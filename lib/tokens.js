// Atlas access tokens: signed keys and cookies (HMAC, Web Crypto; works in middleware and functions).
//
// Key format: ATLAS-XXXX-XXXX-XXXX-XXXX-XXXX (20 hex chars: 8-char key ID + 12-char signature).
// The key ID (e.g. B8BF184F) is what the key list in Upstash is indexed by.
// A key made from a Stripe Checkout Session ID is deterministic, so a lost key can be
// regenerated from the sale.
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
const normalise = input => String(input || '').toUpperCase().replace(/^\s*ATLAS/, '').replace(/[^0-9A-F]/g, '');

export const keyFromSession = async (sessionId, secret) => sign((await sha(String(sessionId))).slice(0, 8), secret);
export const randomKey = async secret => sign(hex(crypto.getRandomValues(new Uint8Array(4))), secret);

// The 8-character ID part of a key (no signature check).
export const keyId = input => { const raw = normalise(input); return raw.length === 20 ? raw.slice(0, 8) : null; };

export async function verifyKey(input, secret) {
  const raw = normalise(input);
  if (raw.length !== 20) return false;
  return raw.slice(8) === (await hmac('key.' + raw.slice(0, 8), secret)).slice(0, 12);
}

// Access cookie, 365 days.
//   v2: <expiryMs>.<keyId>.<sig>  (carries the key ID so a revoked key can be locked out)
//   v1: <expiryMs>.<sig>          (issued before 12 Oct 2026; still accepted, no key ID)
export async function makeCookie(secret, id) {
  const exp = Date.now() + 365 * 864e5;
  if (!id) return `${exp}.${await hmac('cookie.' + exp, secret)}`;
  return `${exp}.${id}.${await hmac('cookie.' + exp + '.' + id, secret)}`;
}

// Returns { ok, id } — id is null for v1 cookies.
export async function readCookie(value, secret) {
  const parts = String(value || '').split('.');
  const exp = parts[0];
  if (!exp || !(Number(exp) > Date.now())) return { ok: false, id: null };
  if (parts.length === 2) return { ok: parts[1] === await hmac('cookie.' + exp, secret), id: null };
  if (parts.length === 3 && /^[0-9A-F]{8}$/.test(parts[1])) {
    return { ok: parts[2] === await hmac('cookie.' + exp + '.' + parts[1], secret), id: parts[1] };
  }
  return { ok: false, id: null };
}

export async function verifyCookie(value, secret) { return (await readCookie(value, secret)).ok; }
