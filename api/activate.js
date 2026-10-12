// GET  /api/activate?session_id=cs_...      -> back from Stripe checkout: verify paid, set cookie, show key
// POST /api/activate {key, device}          -> unlocking with a saved Atlas key
//
// With the key list configured (lib/store.js): revoked keys are refused and each key
// works on up to DEVICE_LIMIT devices (counted by an anonymous random device ID).
import { keyFromSession, verifyKey, keyId, makeCookie } from '../lib/tokens.js';
import { storeReady, redis, getStatus, registerKey, claimDevice } from '../lib/store.js';

const cookie = v => `atlas_access=${v}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`;
const DEVICE_RE = /^[A-Za-z0-9-]{8,64}$/;

export default async function handler(req, res) {
  // .trim() guards against a stray space or line break pasted into the Vercel env var.
  const secret = (process.env.SESSION_SECRET || '').trim();
  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET' && req.query?.session_id) {
    const id = String(req.query.session_id);
    let s = {};
    let ok = false;
    try {
      const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${stripeKey}` },
      });
      s = await r.json();
      ok = r.ok;
    } catch (e) { ok = false; console.error('activate: Stripe request failed:', e.message); }

    // Any paid AUD session in this Stripe account is a buyer (promo codes allowed, so no amount check).
    // 'no_payment_required' = a 100%-off promo code (beta users, practitioner comps).
    const settled = s.payment_status === 'paid' || s.payment_status === 'no_payment_required';
    if (!ok || !settled || s.status !== 'complete' || s.currency !== 'aud') {
      console.error('activate: not verified', JSON.stringify({
        httpOk: ok, stripeError: s?.error?.message, status: s?.payment_status, currency: s?.currency,
        keyType: stripeKey.slice(0, 8),
      }));
      return res.redirect(302, '/activate.html?error=payment');
    }

    const key = await keyFromSession(id, secret);
    const kid = keyId(key);
    if (storeReady()) {
      try {
        await registerKey(kid, { session: id });
        if (s.payment_intent) await redis('SET', 'pi:' + s.payment_intent, kid);
        if (await getStatus(kid) === 'revoked') return res.redirect(302, '/activate.html?revoked=1');
      } catch (e) { console.error('activate: store unavailable', e.message); }
    }
    res.setHeader('Set-Cookie', cookie(await makeCookie(secret, kid)));
    // The key travels in the URL fragment, which never reaches server logs.
    return res.redirect(302, `/activate.html#key=${key}`);
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
    const key = body?.key;
    if (!(await verifyKey(key, secret))) return res.status(401).json({ ok: false, reason: 'invalid' });
    const kid = keyId(key);

    if (storeReady()) {
      try {
        await registerKey(kid);
        if (await getStatus(kid) === 'revoked') return res.status(403).json({ ok: false, reason: 'revoked' });
        const device = String(body?.device || '');
        if (DEVICE_RE.test(device) && await claimDevice(kid, device) === 'limit') {
          return res.status(429).json({ ok: false, reason: 'limit' });
        }
      } catch (e) {
        // Store down: let paying customers in rather than lock them out.
        console.error('activate: store unavailable', e.message);
      }
    }
    res.setHeader('Set-Cookie', cookie(await makeCookie(secret, kid)));
    return res.status(200).json({ ok: true });
  }

  return res.redirect(302, '/activate.html');
}
