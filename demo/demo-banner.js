/* Atlas demo: the frame. Injected before </body> on every demo page.
   1. A fixed bar: who this is, how the demo behaves, the persona switch, the buy button.
   2. A click guard: any link that leaves the demo's open pages goes to the locked page instead,
      including links the app builds in JavaScript. */
(() => {
  'use strict';
  const BUY_URL = '/buy/demo';
  const OPEN = new Set(['index.html', 'money.html', 'week.html', 'records.html', 'scripts.html', 'locked.html']);
  const PUBLIC_ROOT = new Set(['how-it-works.html', 'terms.html', 'for-professionals.html']);

  let persona = 'marcus';
  try { persona = localStorage.getItem('atlas_demo_persona') || 'marcus'; } catch (_) {}
  const other = persona === 'marcus' ? 'priya' : 'marcus';
  const name = s => s.charAt(0).toUpperCase() + s.slice(1);

  const style = document.createElement('style');
  style.textContent = `
    #demo-bar { position: fixed; z-index: 9999; left: 50%; bottom: max(12px, env(safe-area-inset-bottom)); transform: translateX(-50%);
      width: min(920px, calc(100% - 24px)); box-sizing: border-box; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: space-between;
      background: #111; color: #fff; border-radius: 22px; padding: 10px 10px 10px 18px; box-shadow: 0 10px 40px rgba(0,0,0,.25);
      font: 500 13px/1.4 system-ui, -apple-system, 'Segoe UI', sans-serif; }
    #demo-bar .db-text { flex: 1 1 260px; color: #e8e8e4; }
    #demo-bar .db-text b { color: #fff; font-weight: 650; }
    #demo-bar .db-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    #demo-bar a { text-decoration: none; white-space: nowrap; border-radius: 999px; padding: 9px 16px; font-weight: 600; font-size: 13px; }
    #demo-bar .db-switch { color: #fff; background: rgba(255,255,255,.12); }
    #demo-bar .db-switch:hover { background: rgba(255,255,255,.2); }
    #demo-bar .db-buy { background: #d4f062; color: #111; }
    #demo-bar .db-buy:hover { background: #e0f78a; }
    #demo-bar a:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    body { padding-bottom: 104px !important; }
    @media (max-width: 640px) { #demo-bar { border-radius: 18px; padding: 10px 10px 10px 14px; gap: 8px; font-size: 12px; } body { padding-bottom: 150px !important; } }
    @media print { #demo-bar { display: none; } }
    /* Features that make no sense in a sandbox */
    .at-footer-links a[href*="move-data"], .at-tools-menu a[href*="move-data"], .tile.backup, #at-backup-now { display: none !important; }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'demo-bar';
  bar.setAttribute('role', 'complementary');
  bar.setAttribute('aria-label', 'About this demo');
  bar.innerHTML =
    '<div class="db-text"><b>This is ' + name(persona) + '. Not a real person.</b> Change anything. It resets when you close the tab. Your Atlas starts empty and never leaves your device.</div>' +
    '<div class="db-actions">' +
    '<a class="db-switch" href="./index.html?who=' + other + '">See ' + name(other) + '</a>' +
    '<a class="db-buy" href="' + BUY_URL + '">Get Atlas · $79</a>' +
    '</div>';
  document.body.appendChild(bar);

  // Click guard. Capture phase so it runs before the app's own handlers.
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented) return;
    const raw = a.getAttribute('href');
    if (!raw || raw.startsWith('#') || /^(tel|mailto|sms):/i.test(raw)) return;
    let u;
    try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (u.origin !== location.origin) return;                  // external links are fine
    if (u.pathname === '/buy' || u.pathname === '/buy/demo') return;
    const file = u.pathname.split('/').pop() || 'index.html';
    const inDemo = u.pathname.startsWith('/demo/');
    if (inDemo && OPEN.has(file)) return;                      // an open demo page
    if (!inDemo && PUBLIC_ROOT.has(file)) return;              // public pages on the app domain
    e.preventDefault();
    e.stopPropagation();
    const from = encodeURIComponent((file.replace(/\.html$/, '') || 'app') + (u.hash || ''));
    location.href = '/demo/locked.html?from=' + from;
  }, true);
})();
