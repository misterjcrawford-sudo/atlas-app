// ─── Atlas password gate ───────────────────────────────────────────────────
// Change ATLAS_PASSWORD to update the password across all protected pages.
const ATLAS_PASSWORD = 'atlas2026';
const ATLAS_AUTH_KEY = 'atlas_auth_v1';

(function () {
  // ── Already authenticated ──────────────────────────────────────────────
  if (localStorage.getItem(ATLAS_AUTH_KEY) === '1') {
    _injectLockLink();
    return;
  }

  // ── Block page render immediately ──────────────────────────────────────
  // Hide the body until auth passes so there's no flash of content.
  var style = document.createElement('style');
  style.id = 'atlas-gate-style';
  style.textContent = 'body { visibility: hidden !important; }';
  document.head.appendChild(style);

  // ── Build overlay ──────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'atlas-gate';
  overlay.innerHTML = [
    '<div id="atlas-gate-card">',
      '<svg id="atlas-gate-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
        '<rect width="64" height="64" rx="14" fill="#2743ff"/>',
        '<path d="M10.5 50 L24.5 14 H31.5 L45.5 50 H37.4 L34.6 42.2 H21.4 L18.6 50 Z M23.8 35.4 H32.2 L28 23.6 Z" fill="#fff"/>',
        '<rect x="47" y="41" width="9" height="9" fill="#d4f062"/>',
      '</svg>',
      '<h1 id="atlas-gate-wordmark">Atlas<span style="display:inline-block;width:.18em;height:.18em;margin-left:.06em;background:#2743ff;color:transparent;overflow:hidden;vertical-align:baseline;line-height:1">.</span></h1>',
      '<p id="atlas-gate-sub">Private beta &mdash; enter the password to continue.</p>',
      '<form id="atlas-gate-form" autocomplete="off">',
        '<input id="atlas-gate-input" type="password" placeholder="Password" autocomplete="current-password" spellcheck="false">',
        '<button id="atlas-gate-btn" type="submit">Enter &rarr;</button>',
      '</form>',
      '<p id="atlas-gate-error">Incorrect password &mdash; try again.</p>',
      '<p id="atlas-gate-access"><a href="mailto:hello@get-atlas.com.au">Request early access &rarr;</a></p>',
    '</div>',
  ].join('');

  // ── Inject overlay styles ──────────────────────────────────────────────
  var gStyle = document.createElement('style');
  gStyle.textContent = [
    '#atlas-gate {',
      'position:fixed;inset:0;z-index:99999;',
      'background:#f7f7f5;',
      'display:flex;align-items:center;justify-content:center;',
      'font-family:var(--font-body);',
    '}',
    '#atlas-gate-card {',
      'width:100%;max-width:380px;',
      'background:#FFFFFF;',
      'border:1px solid #e7e7e4;',
      'border-radius:24px;',
      'padding:40px 36px 36px;',
      'box-shadow:0 8px 40px rgba(15,74,63,0.08);',
      'text-align:center;',
    '}',
    '#atlas-gate-logo { width:48px;height:48px;margin:0 auto 14px;display:block; }',
    '#atlas-gate-wordmark {',
      'font-family:var(--font-display);font-weight:700;letter-spacing:-.03em;',
      'font-size:2rem;',
      'color:#111111;margin:0 0 8px;',
    '}',
    '#atlas-gate-sub {',
      'font-size:13.5px;color:#62626a;line-height:1.5;margin:0 0 24px;',
    '}',
    '#atlas-gate-input {',
      'width:100%;padding:12px 16px;',
      'border:1px solid #e7e7e4;border-radius:14px;',
      'font-size:15px;font-family:inherit;',
      'background:#f7f7f5;color:#111111;',
      'outline:none;box-sizing:border-box;',
      'transition:border-color 0.15s;',
    '}',
    '#atlas-gate-input:focus { border-color:#111111; }',
    '#atlas-gate-btn {',
      'width:100%;margin-top:10px;padding:13px;',
      'background:#111111;color:#FFFFFF;',
      'border:none;border-radius:999px;',
      'font-size:14px;font-weight:600;font-family:inherit;',
      'cursor:pointer;transition:background 0.15s;',
    '}',
    '#atlas-gate-btn:hover { background:#1a2ccc; }',
    '#atlas-gate-error {',
      'font-size:13px;color:#e0532f;margin:10px 0 0;',
      'display:none;',
    '}',
    '#atlas-gate-access {',
      'margin-top:20px;font-size:13px;',
    '}',
    '#atlas-gate-access a {',
      'color:#62626a;text-decoration:none;',
      'border-bottom:1px solid #e7e7e4;padding-bottom:1px;',
      'transition:color 0.15s,border-color 0.15s;',
    '}',
    '#atlas-gate-access a:hover {',
      'color:#111111;border-color:#111111;',
    '}',
  ].join('');
  document.head.appendChild(gStyle);

  // ── Show overlay once DOM is ready ─────────────────────────────────────
  function showGate() {
    document.body.appendChild(overlay);
    document.getElementById('atlas-gate-style').textContent = '';
    document.body.style.visibility = '';
    setTimeout(function () {
      var inp = document.getElementById('atlas-gate-input');
      if (inp) inp.focus();
    }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showGate);
  } else {
    showGate();
  }

  // ── Check password ─────────────────────────────────────────────────────
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'atlas-gate-form') {
      e.preventDefault();
      var input = document.getElementById('atlas-gate-input');
      var error = document.getElementById('atlas-gate-error');
      if (input.value === ATLAS_PASSWORD) {
        localStorage.setItem(ATLAS_AUTH_KEY, '1');
        var gate = document.getElementById('atlas-gate');
        if (gate) gate.remove();
        _injectLockLink();
      } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
      }
    }
  });

})();

// ── Lock link ────────────────────────────────────────────────────────────────
function _injectLockLink() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _doInject);
  } else {
    _doInject();
  }
  function _doInject() {
    var a = document.createElement('a');
    a.textContent = 'Lock app';
    a.href = '#';
    a.title = 'Clear access and return to password screen';
    a.style.cssText = [
      'position:fixed;bottom:14px;right:16px;',
      'font-size:11px;font-weight:500;',
      'color:#6a6a70;text-decoration:none;',
      'font-family:var(--font-body);',
      'z-index:9998;',
      'transition:color 0.15s;',
    ].join('');
    a.addEventListener('mouseenter', function () { a.style.color = '#111111'; });
    a.addEventListener('mouseleave', function () { a.style.color = '#6a6a70'; });
    a.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem(ATLAS_AUTH_KEY);
      location.reload();
    });
    var footer = document.querySelector('.at-footer-links');
    if (footer) { a.removeAttribute('style'); footer.appendChild(a); }
    else document.body.appendChild(a);
  }
}
