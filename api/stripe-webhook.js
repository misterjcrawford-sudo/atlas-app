// POST /api/stripe-webhook — Stripe calls this after events. Needs STRIPE_WEBHOOK_SECRET (whsec_...).
//   checkout.session.completed -> register the key, email it to the buyer (once)
//   charge.refunded (full)     -> revoke that key on every device
// Uses only what's inside the signed event, so the restricted Stripe key needs no extra permissions.
import { keyFromSession, keyId } from '../lib/tokens.js';
import { storeReady, redis, registerKey, revokeKey } from '../lib/store.js';
import { mailReady, sendKeyEmail } from '../lib/mail.js';

const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');

async function validSignature(raw, header, secret) {
  // Header looks like: t=1700000000,v1=abc...,v1=def...
  let t = null;
  const sigs = [];
  for (const part of String(header || '').split(',')) {
    const i = part.indexOf('=');
    const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
    if (k === 't') t = v;
    if (k === 'v1') sigs.push(v);
  }
  if (!t || !sigs.length || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = hex(await crypto.subtle.sign('HMAC', k, enc.encode(`${t}.${raw}`)));
  return sigs.includes(expected);
}

const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

async function handle(request) {
  const raw = await request.text();
  const whsec = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
  if (!whsec || !(await validSignature(raw, request.headers.get('stripe-signature'), whsec))) {
    return json(400, { error: 'bad signature' });
  }
  const event = JSON.parse(raw);
  const secret = (process.env.SESSION_SECRET || '').trim();

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      const settled = s.payment_status === 'paid' || s.payment_status === 'no_payment_required';
      if (!settled || s.currency !== 'aud') return json(200, { skipped: 'not settled' });

      const key = await keyFromSession(s.id, secret);
      const kid = keyId(key);
      if (storeReady()) {
        await registerKey(kid, { session: s.id });
        if (s.payment_intent) await redis('SET', 'pi:' + s.payment_intent, kid);
      }

      const to = s.customer_details?.email;
      if (to && mailReady()) {
        // Send once, even if Stripe retries. If sending fails, clear the flag and let Stripe retry.
        const first = storeReady() ? await redis('SET', 'mail:' + s.id, 'sent', 'NX', 'EX', 60 * 60 * 24 * 30) : 'OK';
        if (first === 'OK') {
          try { await sendKeyEmail(to, key); }
          catch (e) { if (storeReady()) await redis('DEL', 'mail:' + s.id); throw e; }
        }
      }
      return json(200, { ok: true });
    }

    if (event.type === 'charge.refunded') {
      const c = event.data.object;
      // Only a full refund cancels access; a partial refund (goodwill) doesn't.
      if (!c.refunded || !c.payment_intent || !storeReady()) return json(200, { skipped: 'partial or no store' });
      const kid = await redis('GET', 'pi:' + c.payment_intent);
      if (kid) await revokeKey(kid, 'refund');
      return json(200, { ok: true, revoked: Boolean(kid) });
    }

    return json(200, { ignored: event.type });
  } catch (e) {
    console.error('webhook:', event.type, e.message);
    return json(500, { error: 'temporary' }); // Stripe retries
  }
}

// Vercel Web-standard handler (works on plain, framework-free projects).
export default {
  fetch(request) {
    if (request.method !== 'POST') return json(405, { error: 'POST only' });
    return handle(request);
  },
};
