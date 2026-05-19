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
      '<svg id="atlas-gate-logo" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
        '<path d="M2 19 Q8 5 14 15 T24 7" stroke="#D97757" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
        '<circle cx="24" cy="7" r="2" fill="#D97757"/>',
      '</svg>',
      '<h1 id="atlas-gate-wordmark">Atlas</h1>',
      '<p id="atlas-gate-sub">Private beta &mdash; enter the password to continue.</p>',
      '<form id="atlas-gate-form" autocomplete="off">',
        '<input id="atlas-gate-input" type="password" placeholder="Password" autocomplete="current-password" spellcheck="false">',
        '<button id="atlas-gate-btn" type="submit">Enter &rarr;</button>',
      '</form>',
      '<p id="atlas-gate-error">Incorrect password &mdash; try again.</p>',
    '</div>',
  ].join('');

  // ── Inject overlay styles ──────────────────────────────────────────────
  var gStyle = document.createElement('style');
  gStyle.textContent = [
    '#atlas-gate {',
      'position:fixed;inset:0;z-index:99999;',
      'background:#FAFAF7;',
      'display:flex;align-items:center;justify-content:center;',
      'font-family:"Space Grotesk",-apple-system,BlinkMacSystemFont,sans-serif;',
    '}',
    '#atlas-gate-card {',
      'width:100%;max-width:380px;',
      'background:#FFFFFF;',
      'border:1px solid #E8E8E0;',
      'border-radius:24px;',
      'padding:40px 36px 36px;',
      'box-shadow:0 8px 40px rgba(15,74,63,0.08);',
      'text-align:center;',
    '}',
    '#atlas-gate-logo { width:32px;height:32px;margin:0 auto 12px; }',
    '#atlas-gate-wordmark {',
      'font-family:"Fraunces",Georgia,serif;',
      'font-weight:500;font-size:1.8rem;letter-spacing:-0.03em;',
      'color:#0A0A0A;margin:0 0 8px;',
    '}',
    '#atlas-gate-sub {',
      'font-size:13.5px;color:#6E6E63;line-height:1.5;margin:0 0 24px;',
    '}',
    '#atlas-gate-input {',
      'width:100%;padding:12px 16px;',
      'border:1px solid #E8E8E0;border-radius:12px;',
      'font-size:15px;font-family:inherit;',
      'background:#FAFAF7;color:#0A0A0A;',
      'outline:none;box-sizing:border-box;',
      'transition:border-color 0.15s;',
    '}',
    '#atlas-gate-input:focus { border-color:#0F4A3F; }',
    '#atlas-gate-btn {',
      'width:100%;margin-top:10px;padding:13px;',
      'background:#0F4A3F;color:#FFFFFF;',
      'border:none;border-radius:12px;',
      'font-size:14px;font-weight:600;font-family:inherit;',
      'cursor:pointer;transition:background 0.15s;',
    '}',
    '#atlas-gate-btn:hover { background:#0A332B; }',
    '#atlas-gate-error {',
      'font-size:13px;color:#E27B5A;margin:10px 0 0;',
      'display:none;',
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
      'color:#A8A8A0;text-decoration:none;',
      'font-family:"Space Grotesk",-apple-system,sans-serif;',
      'z-index:9998;',
      'transition:color 0.15s;',
    ].join('');
    a.addEventListener('mouseenter', function () { a.style.color = '#0A0A0A'; });
    a.addEventListener('mouseleave', function () { a.style.color = '#A8A8A0'; });
    a.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem(ATLAS_AUTH_KEY);
      location.reload();
    });
    document.body.appendChild(a);
  }
}
