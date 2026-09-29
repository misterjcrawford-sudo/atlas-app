/* Shared app shell: phase, storage helpers, toast, menu and footer behaviour. Loaded on every app page. */
(function () {
  'use strict';
  const LABELS = { 'waiting-room': 'Waiting Room', survive: 'Survive', stabilise: 'Stabilise', rebuild: 'Rebuild', 'new-chapter': 'New Chapter' };
  const PHASE_KEYS = ['atlas_phase', 'dad_atlas_phase', 'atlas_budget_phase', 'dad_budget_phase'];

  // 'crisis' is the pre-2026 name for Survive.
  const normalise = phase => (phase === 'crisis' ? 'survive' : Object.hasOwn(LABELS, phase) ? phase : 'stabilise');

  function read(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function notify(message) {
    let box = document.getElementById('at-toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'at-toast';
      box.className = 'at-toast';
      box.setAttribute('role', 'status');
      document.body.append(box);
    }
    box.textContent = message;
    box.hidden = false;
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => { box.hidden = true; }, 5000);
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      notify('This browser couldn’t save the change. Export a backup and check available storage.');
      return false;
    }
  }

  function phase() {
    try {
      return normalise(localStorage.getItem('atlas_phase') || localStorage.getItem('dad_atlas_phase'));
    } catch (_) {
      return 'stabilise';
    }
  }

  function setPhase(value) {
    value = normalise(value);
    try {
      PHASE_KEYS.forEach(key => localStorage.setItem(key, value));
    } catch (_) {
      notify('Your phase couldn’t be saved in this browser.');
      return;
    }
    // Module pages keep their own phase renderer.
    if (typeof window.setPhase === 'function') window.setPhase(value);
    syncPhase();
    document.dispatchEvent(new CustomEvent('atlas:phase', { detail: value }));
  }

  // Download every atlas_/dad_ key as one JSON file (same format Admin imports) and note when.
  const BACKUP_KEY = 'atlas_last_backup';
  function exportBackup() {
    const data = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('atlas_') || key.startsWith('dad_')) && key !== BACKUP_KEY) data[key] = localStorage.getItem(key);
      }
    } catch (_) {
      notify('This browser couldn’t read your data for a backup.');
      return false;
    }
    if (!Object.keys(data).length) {
      notify('Nothing to back up yet.');
      return false;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'atlas-data-' + new Date().toISOString().slice(0, 10) + '.json';
    link.click();
    URL.revokeObjectURL(url);
    write(BACKUP_KEY, new Date().toISOString());
    notify('Backup saved. Keep that file somewhere safe.');
    return true;
  }

  // Every page can change the phase in place. The chip on module pages is a link back to Today
  // in the HTML (works without JS); here it becomes a dropdown that changes the phase on this page.
  function mountPhaseSelects() {
    document.querySelectorAll('a.at-phase-chip').forEach((link, i) => {
      const label = document.createElement('label');
      label.className = 'at-phase-chip at-phase-chip--select';
      const id = 'at-phase-select-' + i;
      label.htmlFor = id;
      label.innerHTML = '<span class="at-phase-chip-label">Phase</span>';
      const select = document.createElement('select');
      select.id = id;
      select.dataset.phaseSelect = '';
      select.setAttribute('aria-label', 'Your phase');
      Object.entries(LABELS).forEach(([value, text]) => select.add(new Option(text, value)));
      select.addEventListener('change', () => {
        setPhase(select.value);
        notify('Phase set to ' + LABELS[select.value] + '.');
      });
      label.appendChild(select);
      link.replaceWith(label);
    });
  }

  function syncPhase() {
    const current = phase();
    const picker = document.getElementById('at-phase');
    if (picker) picker.value = current;
    document.querySelectorAll('select[data-phase-select]').forEach(el => { el.value = current; });
    document.querySelectorAll('[data-phase-label]').forEach(el => { el.textContent = LABELS[current]; });
  }

  function start() {
    mountPhaseSelects();
    syncPhase();
    document.getElementById('at-phase')?.addEventListener('change', e => setPhase(e.target.value));

    // Close the More menu on outside click or Escape.
    document.addEventListener('click', e => {
      document.querySelectorAll('.at-tools[open]').forEach(el => { if (!el.contains(e.target)) el.open = false; });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') document.querySelectorAll('.at-tools[open]').forEach(el => { el.open = false; });
    });

    window.addEventListener('storage', e => {
      if (e.key === 'atlas_phase') {
        syncPhase();
        document.dispatchEvent(new CustomEvent('atlas:phase', { detail: phase() }));
      }
    });

    document.querySelectorAll('[data-current-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

    // The beta gate adds a lock link; keep it in the footer rather than over the content.
    const lock = [...document.querySelectorAll('a')].find(el => el.title === 'Clear access and return to password screen');
    const footerLinks = document.querySelector('.at-footer-links');
    if (lock && footerLinks) {
      lock.removeAttribute('style');
      footerLinks.append(lock);
    }

    const warning = document.getElementById('at-storage-warning');
    try {
      localStorage.setItem('atlas_storage_check', '1');
      localStorage.removeItem('atlas_storage_check');
    } catch (_) {
      if (warning) warning.hidden = false;
    }

    // Collapsed sections should still print in full.
    window.addEventListener('beforeprint', () => document.querySelectorAll('details.at-more').forEach(el => { el.open = true; }));

    // Jumping to the phase picker from another page: bring it into view and focus it.
    if (location.hash === '#at-phase') document.getElementById('at-phase')?.focus();
  }

  window.AtlasApp = { read, write, notify, phase, setPhase, exportBackup, labels: LABELS, normalise };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
