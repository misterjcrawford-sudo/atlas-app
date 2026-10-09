// Atlas gate (Vercel Routing Middleware). Runs before every request, static files included.
// No valid atlas_access cookie -> redirect to /activate.html. Non-payers never receive app
// pages, scripts-data.js or the companion pack PDFs.
import { next } from '@vercel/functions';
import { verifyCookie } from './lib/tokens.js';

// Public: the front door, referral pages, and the shared shell they need to render.
const PUBLIC = new Set([
  '/activate', '/activate.html', '/buy',
  '/terms', '/terms.html',
  '/how-it-works', '/how-it-works.html',
  '/for-professionals', '/for-professionals.html',
  '/favicon.svg', '/apple-touch-icon.png', '/robots.txt',
  // Free sales tool: the user guide (linked from how-it-works; /user-guide is a short link for Ghost).
  '/assets/Atlas - User guide.pdf', '/user-guide',
  '/assets/app/bento.css', '/assets/app/interface.css', '/assets/app/app.js',
]);
const PUBLIC_PREFIX = ['/api/', '/assets/fonts/'];

export default async function middleware(request) {
  const url = new URL(request.url);
  let path = url.pathname;
  try { path = decodeURIComponent(path); } catch (_) { /* malformed: leave encoded, so it's gated */ }
  if (PUBLIC.has(path) || PUBLIC_PREFIX.some(p => path.startsWith(p))) return next();

  const cookie = /(?:^|;\s*)atlas_access=([^;]+)/.exec(request.headers.get('cookie') || '')?.[1];
  try {
    if (cookie && await verifyCookie(cookie, (process.env.SESSION_SECRET || '').trim())) return next();
  } catch (_) { /* missing secret: fail closed */ }

  const gate = new URL('/activate.html', url);
  // Send people back to the page they asked for once they're in (HTML pages only).
  if (path !== '/' && path.endsWith('.html')) gate.searchParams.set('next', url.pathname + url.search);
  return Response.redirect(gate, 302);
}
