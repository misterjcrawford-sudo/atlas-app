/* Money: bills and due dates. Stored in atlas_bills; Today reads the same list for reminders. */
(function () {
  'use strict';
  const A = window.AtlasApp;
  const D = window.AtlasData;
  const $ = id => document.getElementById(id);
  const KEY = 'atlas_bills';
  const MAX_BILLS = 60;

  const REPEAT_LABEL = { once: 'one-off', weekly: 'weekly', fortnightly: 'fortnightly', monthly: 'monthly', quarterly: 'quarterly', yearly: 'yearly' };

  // Quick-add names. Where a matching budget line exists, its monthly amount pre-fills.
  const SUGGESTIONS = [
    ['Rent / mortgage', 'housing', 'rent'],
    ['Electricity', 'housing', 'utilities'],
    ['Internet', 'housing', 'internet'],
    ['Phone', 'housing', 'phone'],
    ['Car rego', 'housing', 'car-insurance', 'yearly'],
    ['Home insurance', 'housing', 'insurance-home', 'yearly'],
    ['Child support', null, 'csOut'],
    ['School fees', 'shared', 'kids-school', 'quarterly'],
  ];

  let editingId = null;

  const bills = () => D.cleanBills(A.read(KEY, []));
  const save = list => A.write(KEY, list.slice(0, MAX_BILLS));
  const fmtDate = iso => D.parseIsoDate(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
  const money = value => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);

  function budgetAmount(group, id) {
    const budget = A.read('atlas_budget_state', A.read('dad_budget_state'));
    if (!budget) return '';
    if (!group) return Number(budget[id]) || '';
    const item = Array.isArray(budget[group]) ? budget[group].find(x => x && x.id === id) : null;
    return item && Number(item.val) ? Number(item.val) : '';
  }

  function dueText(bill) {
    const today = new Date();
    const gap = D.daysBetween(today, D.parseIsoDate(bill.due));
    if (gap < 0) return { text: `Overdue since ${fmtDate(bill.due)}`, state: 'overdue' };
    if (gap === 0) return { text: 'Due today', state: 'soon' };
    if (gap === 1) return { text: 'Due tomorrow', state: 'soon' };
    if (gap < 7) return { text: `Due ${fmtDate(bill.due)}`, state: 'soon' };
    return { text: `Due ${fmtDate(bill.due)}`, state: '' };
  }

  function render() {
    const list = bills().sort((a, b) => a.due.localeCompare(b.due));
    $('bills-empty').hidden = list.length > 0;
    $('bill-list').replaceChildren(...list.map(bill => {
      const due = dueText(bill);
      const li = document.createElement('li');
      li.className = 'at-bill' + (due.state ? ' is-' + due.state : '');

      const copy = document.createElement('div');
      copy.className = 'at-bill-copy';
      const name = document.createElement('strong');
      name.textContent = bill.name;
      const meta = document.createElement('span');
      meta.textContent = `${due.text} · ${REPEAT_LABEL[bill.repeat]}`;
      copy.append(name, meta);

      const amount = document.createElement('span');
      amount.className = 'at-bill-amount';
      amount.textContent = bill.amount ? money(bill.amount) : '';

      const actions = document.createElement('div');
      actions.className = 'at-bill-actions';
      const paid = button('Paid ✓', 'at-bill-paid', () => markPaid(bill.id));
      paid.setAttribute('aria-label', `Mark ${bill.name} paid`);
      const edit = button('Edit', 'at-text-button', () => openForm(bill));
      edit.setAttribute('aria-label', `Edit ${bill.name}`);
      const remove = button('×', 'at-icon-button', () => removeBill(bill));
      remove.setAttribute('aria-label', `Remove ${bill.name}`);
      actions.append(paid, edit, remove);

      li.append(copy, amount, actions);
      return li;
    }));
  }

  function button(label, className, onClick) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = className;
    el.textContent = label;
    el.addEventListener('click', onClick);
    return el;
  }

  function markPaid(id) {
    const before = bills();
    const bill = before.find(b => b.id === id);
    if (!save(D.markBillPaid(before, id))) return;
    const next = bills().find(b => b.id === id);
    A.notify(next ? `${bill.name} marked paid. Next due ${fmtDate(next.due)}.` : `${bill.name} marked paid.`);
    render();
  }

  let undoSnapshot = null;
  function removeBill(bill) {
    const before = bills();
    if (!save(before.filter(b => b.id !== bill.id))) return;
    undoSnapshot = before;
    $('bill-undo-message').textContent = `${bill.name} removed.`;
    $('bill-undo').hidden = false;
    render();
  }

  function openForm(bill) {
    editingId = bill ? bill.id : null;
    $('bill-form').hidden = false;
    $('bill-suggest').hidden = !!bill;
    $('bill-name').value = bill ? bill.name : '';
    $('bill-amount').value = bill && bill.amount ? bill.amount : '';
    $('bill-due').value = bill ? bill.due : '';
    $('bill-repeat').value = bill ? bill.repeat : 'monthly';
    $('bill-save').textContent = bill ? 'Save changes' : 'Save bill';
    $('bill-name').focus();
  }

  function closeForm() {
    editingId = null;
    $('bill-form').reset();
    $('bill-form').hidden = true;
  }

  function submit(event) {
    event.preventDefault();
    const name = $('bill-name').value.trim();
    const due = $('bill-due').value;
    if (!name || !D.parseIsoDate(due)) return;
    const entry = {
      name: name.slice(0, 60),
      amount: Math.max(0, Number($('bill-amount').value) || 0),
      due,
      repeat: $('bill-repeat').value,
      anchorDay: D.parseIsoDate(due).getDate(),
    };
    const list = bills();
    if (editingId) {
      const i = list.findIndex(b => b.id === editingId);
      if (i > -1) list[i] = { ...list[i], ...entry };
    } else {
      if (list.length >= MAX_BILLS) { A.notify('That’s a lot of bills. Remove one before adding another.'); return; }
      list.push({ id: 'bill-' + crypto.randomUUID(), ...entry });
    }
    if (!save(list)) return;
    A.notify(editingId ? 'Bill updated.' : 'Bill added. Today will remind you a week ahead.');
    closeForm();
    render();
  }

  function renderSuggestions() {
    const existing = new Set(bills().map(b => b.name.toLowerCase()));
    $('bill-suggest').replaceChildren(...SUGGESTIONS.filter(([name]) => !existing.has(name.toLowerCase())).map(([name, group, id, repeat]) =>
      button(name, 'at-chip', () => {
        $('bill-name').value = name;
        const amount = budgetAmount(group, id);
        if (amount && !repeat) $('bill-amount').value = amount;
        $('bill-repeat').value = repeat || 'monthly';
        $('bill-due').focus();
      })));
  }

  $('bill-undo-button').addEventListener('click', () => {
    if (undoSnapshot && save(undoSnapshot)) { undoSnapshot = null; $('bill-undo').hidden = true; render(); }
  });
  $('bill-add').addEventListener('click', () => { renderSuggestions(); openForm(null); });
  $('bill-cancel').addEventListener('click', closeForm);
  $('bill-form').addEventListener('submit', submit);
  window.addEventListener('storage', e => { if (e.key === KEY) render(); });
  if (location.hash === '#bills') $('bills').scrollIntoView();
  render();
})();
