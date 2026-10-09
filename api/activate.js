// GET  /api/activate?session_id=cs_...  -> returning from Stripe checkout: verify paid, set cookie, show key
// POST /api/activate {key}              -> unlocking with a saved Atlas key: verify HMAC, set cookie
import { keyFromSession, verifyKey, makeCookie } from '../lib/tokens.js';

const cookie = v => `atlas_access=${v}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`;

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
      // Diagnostic only: Stripe's own error text (it masks keys) or the session status. No personal data.
      console.error('activate: not verified', JSON.stringify({
        httpOk: ok, stripeError: s?.error?.message, status: s?.payment_status, currency: s?.currency,
        keyType: stripeKey.slice(0, 8),
      }));
      return res.redirect(302, '/activate.html?error=payment');
    }
    res.setHeader('Set-Cookie', cookie(await makeCookie(secret)));
    // The key travels in the URL fragment, which never reaches server logs.
    return res.redirect(302, `/activate.html#key=${await keyFromSession(id, secret)}`);
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
    if (await verifyKey(body?.key, secret)) {
      res.setHeader('Set-Cookie', cookie(await makeCookie(secret)));
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ ok: false });
  }

  return res.redirect(302, '/activate.html');
}
