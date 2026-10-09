/* Atlas demo: storage sandbox.
   MUST be the first <script> on every demo page (build-demo.mjs enforces this).
   Shadows window.localStorage with a sessionStorage-backed sandbox so:
   - the real app pages run unmodified,
   - a real customer's atlas_* data can never be read or written by the demo,
   - the demo resets itself when the tab closes.
   Sets window.__demoShim = 'override' when it took hold, 'failed' when it did not. */
(() => {
  'use strict';
  const P = 'demo:';
  let store;
  try { store = window.sessionStorage; store.getItem('x'); } catch (e) { store = null; }

  // If sessionStorage is blocked, fall back to an in-memory map: demo still works, just per page load.
  const mem = new Map();
  const keys = () => store ? Object.keys(store).filter(k => k.startsWith(P)).map(k => k.slice(P.length)) : [...mem.keys()];
  const sandbox = {
    getItem(k)    { k = String(k); return store ? store.getItem(P + k) : (mem.has(k) ? mem.get(k) : null); },
    setItem(k, v) { k = String(k); v = String(v); store ? store.setItem(P + k, v) : mem.set(k, v); },
    removeItem(k) { k = String(k); store ? store.removeItem(P + k) : mem.delete(k); },
    clear()       { keys().forEach(k => sandbox.removeItem(k)); },
    key(i)        { const ks = keys(); return i >= 0 && i < ks.length ? ks[i] : null; },
    get length()  { return keys().length; },
  };

  try {
    Object.defineProperty(window, 'localStorage', { get: () => sandbox, configurable: true });
    window.__demoShim = (window.localStorage === sandbox) ? 'override' : 'failed';
  } catch (e) {
    window.__demoShim = 'failed';
  }
})();
