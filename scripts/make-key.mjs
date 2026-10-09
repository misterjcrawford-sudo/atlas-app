// Mint Atlas keys locally. Never deploy this behind a URL.
//
//   Lost key (same key as their original):
//     SESSION_SECRET=<secret> node scripts/make-key.mjs cs_live_...
//   Fresh key (beta users, practitioner packs, refund replacements):
//     SESSION_SECRET=<secret> node scripts/make-key.mjs
//   Several fresh keys:
//     SESSION_SECRET=<secret> node scripts/make-key.mjs --count 10
import { keyFromSession, randomKey } from '../lib/tokens.js';

const secret = process.env.SESSION_SECRET;
if (!secret) { console.error('Set SESSION_SECRET first.'); process.exit(1); }

const args = process.argv.slice(2);
const countAt = args.indexOf('--count');
if (countAt > -1) {
  const n = Number(args[countAt + 1]) || 1;
  for (let i = 0; i < n; i++) console.log(await randomKey(secret));
} else if (args[0]) {
  console.log(await keyFromSession(args[0], secret));
} else {
  console.log(await randomKey(secret));
}
