/* Atlas demo: Money page only.
   The CSA estimator's "their income" field is never saved by the app, so it opens blank and the estimate means nothing.
   Fill it with the other parent's (fictional) income so the estimate matches the budgeted child support. */
(() => {
  'use strict';
  const OTHER_INCOME = { marcus: 50000, priya: 90000 };
  const run = () => {
    let persona = 'marcus';
    try { persona = localStorage.getItem('atlas_demo_persona') || 'marcus'; } catch (_) {}
    const el = document.getElementById('csa-other-income');
    if (!el || el.value) return;
    el.value = OTHER_INCOME[persona] || '';
    if (typeof window.calcCSA === 'function') window.calcCSA();
  };
  if (document.readyState === 'complete') run(); else window.addEventListener('load', run);
})();
