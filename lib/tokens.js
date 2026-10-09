// Atlas access tokens: signed keys and cookies. No database: validating is HMAC maths.
// Works in Vercel Edge middleware and Node functions (both have Web Crypto).
//
// Key format: ATLAS-XXXX-XXXX-XXXX-XXXX-XXXX (20 hex chars: 8 id + 12 signature).
// A key made from a Stripe Checkout Session ID is deterministic, so a lost key can be
// regenerated from the sale (scripts/make-key.mjs cs_live_...).
// SESSION_SECRET signs everything. Changing it invalidates every key and cookie ever issued.

const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

async function hmac(msg, secret) {
  if (!secret) throw new Error('SESSION_SECRET is not set');
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}
const sha = async msg => hex(await crypto.subtle.digest('SHA-256', enc.encode(msg)));
const format = raw => 'ATLAS-' + raw.match(/.{4}/g).join('-');
const sign = async (id, secret) => format(id + (await hmac('key.' + id, secret)).slice(0, 12));

export const keyFromSession = async (sessionId, secret) => sign((await sha(String(sessionId))).slice(0, 8), secret);
export const randomKey = async secret => sign(hex(crypto.getRandomValues(new Uint8Array(4))), secret);

export async function verifyKey(input, secret) {
  const raw = String(input || '').toUpperCase().replace(/^\s*ATLAS/, '').replace(/[^0-9A-F]/g, '');
  if (raw.length !== 20) return false;
  return raw.slice(8) === (await hmac('key.' + raw.slice(0, 8), secret)).slice(0, 12);
}

export async function makeCookie(secret) {
  const exp = Date.now() + 365 * 864e5;
  return `${exp}.${await hmac('cookie.' + exp, secret)}`;
}

export async function verifyCookie(value, secret) {
  const [exp, sig] = String(value || '').split('.');
  if (!exp || !sig || !(Number(exp) > Date.now())) return false;
  return sig === await hmac('cookie.' + exp, secret);
}
