// The key list: a tiny Upstash Redis store (added through Vercel → Storage → Upstash).
// Holds NO personal data — only key IDs, their status, the Stripe sale they came from,
// and anonymous random device IDs for the activation limit.
//
//   key:<ID>   hash   status=active|revoked, session=cs_..., created=<ms>, reason=...
//   dev:<ID>   set    random device IDs that have unlocked with this key (max DEVICE_LIMIT)
//   pi:<pi_>   string payment intent → key ID (so a refund can find the key)
//   mail:<cs_> string "sent" flag so the key email goes out once
//
// If the store isn't configured, everything degrades to the original behaviour (no limits).

export const DEVICE_LIMIT = 5;

const url = () => (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').trim();
const token = () => (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
export const storeReady = () => Boolean(url() && token());

export async function redis(...cmd) {
  const r = await fetch(url(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error('store: ' + (j.error || r.status));
  return j.result;
}

export const getStatus = id => redis('HGET', 'key:' + id, 'status');

// Create the record if it doesn't exist yet (keys issued before the list existed register on first use).
export async function registerKey(id, fields = {}) {
  await redis('HSETNX', 'key:' + id, 'status', 'active');
  await redis('HSETNX', 'key:' + id, 'created', String(Date.now()));
  for (const [k, v] of Object.entries(fields)) if (v) await redis('HSET', 'key:' + id, k, String(v));
}

export const revokeKey = (id, reason) => redis('HSET', 'key:' + id, 'status', 'revoked', 'reason', reason || 'manual');

// Returns 'ok' | 'limit'. A device already on the list is always allowed back in.
export async function claimDevice(id, deviceId) {
  if (await redis('SISMEMBER', 'dev:' + id, deviceId)) return 'ok';
  if (Number(await redis('SCARD', 'dev:' + id)) >= DEVICE_LIMIT) return 'limit';
  await redis('SADD', 'dev:' + id, deviceId);
  return 'ok';
}
