// GET  /api/activate?session_id=cs_...  -> returning from Stripe checkout: verify paid, set cookie, show key
// POST /api/activate {key}              -> unlocking with a saved Atlas key: verify HMAC, set cookie
import { keyFromSession, verifyKey, makeCookie } from '../lib/tokens.js';

const cookie = v => `atlas_access=${v}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`;

export default async function handler(req, res) {
  const secret = process.env.SESSION_SECRET;
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET' && req.query?.session_id) {
    const id = String(req.query.session_id);
    let s = {};
    let ok = false;
    try {
      const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      });
      s = await r.json();
      ok = r.ok;
    } catch (_) { ok = false; }

    // Any paid AUD session in this Stripe account is a buyer (promo codes allowed, so no amount check).
    if (!ok || s.payment_status !== 'paid' || s.currency !== 'aud') {
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
