/* Today: who has the kids, the next 7 days, what needs attention, quick logging to Records,
   the person's own list, headline numbers, scripts for what's coming up, support and backup status. */
(function () {
  'use strict';
  const A = window.AtlasApp;
  const D = window.AtlasData;
  const $ = id => document.getElementById(id);

  const TASKS_KEY = 'atlas_today_tasks';
  const WELCOME_KEY = 'atlas_welcome_dismissed';
  const BACKUP_KEY = 'atlas_last_backup';
  const RECORDS_KEY = 'atlas_records';
  const BILLS_KEY = 'atlas_bills';
  const ADMIN_KEY = 'atlas_admin_checklists';
  const LEGACY_KEYS = { atlas_reimagined_tasks_v1: TASKS_KEY, atlas_reimagined_welcome_dismissed: WELCOME_KEY };
  const MAX_TASKS = 100;
  const MAX_NEEDS = 3;
  const RECORD_GAP_DAYS = 14;
  const BACKUP_GAP_DAYS = 30;

  /* ---------- Content ---------- */

  // Shown only when nothing in the person's data needs attention.
  const ALL_CLEAR = {
    'waiting-room': ['Nothing urgent.', 'Get the income and costs you already know into Money. The rest can wait.', 'Open Money', 'money.html'],
    survive: ['Nothing urgent today.', 'Keep it simple. Check tomorrow and leave the rest.', 'See your week', 'week.html'],
    stabilise: ['Nothing urgent this week.', 'A good week to tick off one admin item.', 'Open Admin', 'admin.html'],
    rebuild: ['Nothing urgent this week.', 'Pick one goal for this month.', 'Open Goals', 'goals.html'],
    'new-chapter': ['All clear.', 'A quick look at money and the fortnight is enough.', 'Open Money', 'money.html'],
  };

  const PHASE_SCRIPTS = {
    'waiting-room': ['first-conversation-with-a-lawyer', 'how-to-tell-the-kids-agreeing-together', 'telling-close-friends'],
    survive: ['the-first-logistics-conversation', 'telling-your-manager', 'asking-for-help'],
    stabilise: ['asking-to-change-the-schedule-temporarily', 'handling-a-schedule-dispute-without-escalating', 'talking-to-your-childs-teacher'],
    rebuild: ['renegotiating-an-arrangement-that-isnt-working', 'setting-communication-boundaries', 'talking-to-a-mortgage-broker'],
    'new-chapter': ['telling-your-kids-youre-seeing-someone', 'introducing-a-new-partner-to-your-kids', 'navigating-a-promotion-conversation'],
  };
  const HANDOVER_SCRIPTS = ['asking-for-flexibility-on-a-specific-date', 'handling-a-schedule-dispute-without-escalating', 'asking-to-change-the-schedule-temporarily'];
  const SCHOOL_SCRIPTS = ['a-school-event-where-both-parents-will-be-present', 'talking-to-your-childs-teacher'];
  const SCHOOL_WORDS = /school|term|teacher|parent[- ]teacher|assembly|concert|carnival|sport|excursion|presentation/i;

  // Titles and categories, so Today doesn't load the full script library.
  const SCRIPTS = {
    'first-conversation-with-a-lawyer': ['First conversation with a lawyer', 'finances-legal', 'Finances & legal'],
    'how-to-tell-the-kids-agreeing-together': ['How to tell the kids: agreeing together', 'your-ex', 'Your ex'],
    'telling-close-friends': ['Telling close friends', 'social-friends', 'Friends'],
    'the-first-logistics-conversation': ['The first logistics conversation', 'your-ex', 'Your ex'],
    'telling-your-manager': ['Telling your manager', 'work', 'Work'],
    'asking-for-help': ['Asking for help', 'wellbeing', 'Wellbeing'],
    'asking-to-change-the-schedule-temporarily': ['Asking to change the schedule temporarily', 'your-ex', 'Your ex'],
    'handling-a-schedule-dispute-without-escalating': ['Handling a schedule dispute without escalating', 'your-ex', 'Your ex'],
    'asking-for-flexibility-on-a-specific-date': ['Asking for flexibility on a specific date', 'your-ex', 'Your ex'],
    'talking-to-your-childs-teacher': ['Talking to your child’s teacher', 'kids-world', 'Kids’ world'],
    'a-school-event-where-both-parents-will-be-present': ['A school event where both parents will be there', 'kids-world', 'Kids’ world'],
    'renegotiating-an-arrangement-that-isnt-working': ['Renegotiating an arrangement that isn’t working', 'your-ex', 'Your ex'],
    'setting-communication-boundaries': ['Setting communication boundaries', 'your-ex', 'Your ex'],
    'talking-to-a-mortgage-broker': ['Talking to a mortgage broker', 'finances-legal', 'Finances & legal'],
    'telling-your-kids-youre-seeing-someone': ['Telling your kids you’re seeing someone', 'new-relationships', 'New relationships'],
    'introducing-a-new-partner-to-your-kids': ['Introducing a new partner to your kids', 'new-relationships', 'New relationships'],
    'navigating-a-promotion-conversation': ['Navigating a promotion conversation', 'work', 'Work'],
  };

  const CAPTURE_TYPES = {
    cost: ['What was it for', 'e.g. School shoes'],
    incident: ['What happened', 'e.g. Late pickup, no message'],
    communication: ['What was said or agreed', 'e.g. Agreed to swap the 12th'],
    handover: ['What changed', 'e.g. Pickup moved to 5pm Friday'],
  };

  /* ---------- Dates ---------- */

  const fmt = (date, options) => date.toLocaleDateString('en-AU', options);
  const weekdayName = date => fmt(date, { weekday: 'long' });
  const shortDate = date => fmt(date, { weekday: 'short', day: 'numeric', month: 'short' });
  const longDate = date => fmt(date, { weekday: 'long', day: 'numeric', month: 'long' });
  const dayMonth = date => fmt(date, { day: 'numeric', month: 'short' });
  const parseIso = iso => { const [y, m, d] = String(iso).split('-').map(Number); return new Date(y, m - 1, d, 12); };

  // "today", "tomorrow", "Wednesday" (within a week), otherwise "Sun 12 Oct".
  function when(date, now) {
    const gap = D.daysBetween(now, date);
    if (gap === 0) return 'today';
    if (gap === 1) return 'tomorrow';
    if (gap > 1 && gap < 7) return weekdayName(date);
    return shortDate(date);
  }
  const capitalise = text => text.charAt(0).toUpperCase() + text.slice(1);

  /* ---------- Data ---------- */

  function load() {
    const now = new Date();
    const week = A.read('atlas_kidsweek', A.read('dad_kidsweek'));
    const budget = A.read('atlas_budget_state', A.read('dad_budget_state'));
    const phase = A.phase();
    const checklist = Array.isArray(week?.checklist?.before) ? week.checklist.before : [];
    let hasAnyData = false;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (/^(atlas|dad)_(budget_state|kidsweek|records|transition_costs|admin_checklists|goals|bills)/.test(key)) { hasAnyData = true; break; }
      }
    } catch (_) { /* storage unavailable */ }
    const bills = A.read(BILLS_KEY, []);
    const end = new Date(now);
    end.setDate(now.getDate() + 6);
    return {
      now, phase, week, budget, hasAnyData,
      billsDue: D.billsBetween(bills, now, end),
      billsOverdue: D.overdueBills(bills, now),
      summary: D.weekSummary(week, now),
      days: D.upcomingDays(week, now, 7),
      money: D.moneySummary(budget, phase),
      records: D.recordsSummary(A.read(RECORDS_KEY, null)),
      separationCosts: D.separationCostsTotal(A.read('atlas_transition_costs', A.read('dad_atlas_transition_costs'))),
      lastBackup: A.read(BACKUP_KEY, null),
      showWelcome: !A.read(WELCOME_KEY, false) && !budget && !D.weekSummary(week, now),
      checklist: { total: checklist.length, done: checklist.filter(item => item && item.done).length },
      admin: D.nextAdminStep(A.read(ADMIN_KEY, {}), A.read('atlas_admin_hidden_items', []), phase),
    };
  }

  const nextHandover = ctx => {
    const index = ctx.days.findIndex(day => day.handover);
    return index === -1 ? null : { ...ctx.days[index], index };
  };

  /* ---------- Headline ---------- */

  function renderStatus(ctx) {
    const status = $('at-status');
    const detail = $('at-status-detail');
    $('at-date').textContent = longDate(ctx.now);
    detail.replaceChildren();

    if (!ctx.summary) {
      status.textContent = 'Here’s your week.';
      const link = document.createElement('a');
      link.href = './week.html#cycle';
      link.textContent = 'Set your custody cycle →';
      detail.append('See who’s where at a glance. ', link);
      return;
    }

    const today = ctx.days[0];
    const { kidsToday, next } = ctx.summary;
    const checklistNote = ctx.checklist.total ? ` Handover checklist ${ctx.checklist.done} of ${ctx.checklist.total}.` : '';

    if (today.handover === 'arrive') {
      status.textContent = 'Kids arrive today.';
      detail.textContent = next ? `With you until ${when(next, ctx.now)}.${checklistNote}` : `With you all fortnight.${checklistNote}`;
    } else if (today.handover === 'leave') {
      status.textContent = 'Handover today.';
      detail.textContent = next ? `Kids back ${when(next, ctx.now)}.` : 'No kids days in the rest of your cycle.';
    } else if (!next) {
      status.textContent = kidsToday ? 'Kids with you all fortnight.' : 'No kids days in your cycle.';
      detail.textContent = kidsToday ? 'Your saved cycle has no handovers.' : 'Check your custody cycle in Week if that’s not right.';
    } else if (kidsToday) {
      status.textContent = `Kids with you until ${when(next, ctx.now)}.`;
      detail.textContent = `Handover ${longDate(next)}.`;
    } else {
      status.textContent = `Solo until ${when(next, ctx.now)}.`;
      detail.textContent = `Kids arrive ${longDate(next)}.${checklistNote}`;
    }
  }

  /* ---------- Next 7 days ---------- */

  function renderDays(ctx) {
    const strip = $('at-day-strip');
    const MAX_ITEMS = 3;
    strip.replaceChildren(...ctx.days.map((day, index) => {
      const li = document.createElement('li');
      li.className = 'at-day' + (day.kids ? ' is-kids' : '') + (index === 0 ? ' is-today' : '') + (day.handover ? ' is-handover' : '');

      const head = document.createElement('div');
      head.className = 'at-day-head';
      const name = document.createElement('span');
      name.className = 'at-day-name';
      name.textContent = index === 0 ? 'Today' : fmt(day.date, { weekday: 'short' });
      const number = document.createElement('span');
      number.className = 'at-day-number';
      number.textContent = fmt(day.date, { day: 'numeric' });
      head.append(name, number);
      li.append(head);

      const items = document.createElement('ul');
      items.className = 'at-day-items';
      const add = (text, className) => {
        const item = document.createElement('li');
        if (className) item.className = className;
        item.textContent = text;
        items.append(item);
      };
      if (day.handover) add(day.handover === 'arrive' ? 'Kids arrive' : 'Handover', 'at-day-handover');
      day.dates.forEach(d => add(d.label, 'at-day-date'));
      ctx.billsDue.filter(b => b.on === day.iso).forEach(b => add(`${b.amount ? D.currency(b.amount) + ' ' : ''}${b.name}`, 'at-day-bill'));
      const room = Math.max(0, MAX_ITEMS - items.children.length);
      day.events.slice(0, room).forEach(e => add(e.time ? `${e.time} ${e.text}` : e.text));
      const hidden = day.events.length - room;
      if (hidden > 0) add(`+${hidden} more`, 'at-day-more');
      if (!items.children.length) add(day.kids === null ? '' : day.kids ? 'Kids with you' : 'Solo', 'at-day-empty');
      li.append(items);

      li.setAttribute('aria-label', `${index === 0 ? 'Today, ' : ''}${longDate(day.date)}${day.kids ? ', kids with you' : day.kids === false ? ', solo' : ''}`);
      return li;
    }));
    $('at-days-legend').hidden = !ctx.summary;
    // Nothing to show until a cycle, event or date is saved.
    document.querySelector('.at-days').hidden = !ctx.summary && !ctx.billsDue.length && !ctx.days.some(day => day.events.length || day.dates.length);
  }

  /* ---------- Needs you ---------- */

  function needs(ctx) {
    const list = [];
    const handover = nextHandover(ctx);

    if (handover && handover.handover === 'arrive' && handover.index <= 3) {
      const day = capitalise(when(handover.date, ctx.now));
      const { total, done } = ctx.checklist;
      list.push(total && done < total
        ? { title: `Get ready for ${day === 'Today' ? 'today' : day}`, detail: `Kids arrive ${when(handover.date, ctx.now)}. ${done} of ${total} on the handover checklist.`, label: 'Open checklist', href: 'week.html', urgent: handover.index <= 1 }
        : { title: `Kids arrive ${when(handover.date, ctx.now)}`, detail: 'Confirm the time and what needs to come with them.', label: 'Open Week', href: 'week.html', urgent: handover.index <= 1 });
    } else if (handover && handover.handover === 'leave' && handover.index <= 2) {
      list.push({ title: `Handover ${when(handover.date, ctx.now)}`, detail: 'Confirm the time and pack what goes with them.', label: 'Open Week', href: 'week.html', urgent: handover.index <= 1 });
    }

    if (ctx.money && ctx.money.surplus < 0) {
      list.push({ title: `You’re ${D.currency(ctx.money.surplus)} short this month`, detail: 'Planned costs are more than what’s coming in.', label: 'See the numbers', href: 'money.html', urgent: true });
    }

    list.push(...billNeeds(ctx));

    // The welcome panel already asks for these two on first visit.
    if (!ctx.budget && !ctx.showWelcome) list.push({ title: 'Add your numbers', detail: 'Take-home pay and regular costs. Rough is fine.', label: 'Open Money', href: 'money.html' });
    if (!ctx.summary && !ctx.showWelcome) list.push({ title: 'Set your custody cycle', detail: 'Then Today can show who’s where and when handovers are.', label: 'Open Week', href: 'week.html#cycle' });

    // Early phases: the next First 30 days task, tickable from here.
    if (ctx.admin) {
      list.push({ title: ctx.admin.title, detail: `Next on your admin list. ${ctx.admin.done} of ${ctx.admin.total} first-30-day tasks done.`, label: 'Mark done', action: () => markAdminDone(ctx.admin) });
    }

    ctx.days.forEach((day, index) => day.dates.forEach(d => {
      list.push({ title: d.label, detail: index === 0 ? 'Today.' : index === 1 ? 'Tomorrow.' : `${capitalise(when(day.date, ctx.now))}, ${dayMonth(day.date)}.`, label: 'Open Week', href: 'week.html', urgent: index <= 1 });
    }));

    if (ctx.records.count && ctx.records.last) {
      const last = parseIso(ctx.records.last);
      const gap = D.daysBetween(last, ctx.now);
      if (gap >= RECORD_GAP_DAYS) list.push({ title: `Anything to log since ${dayMonth(last)}?`, detail: `Your last entry was ${gap} days ago.`, label: 'Log it', action: openCapture });
    } else if (ctx.phase !== 'new-chapter' && (ctx.budget || ctx.summary)) {
      list.push({ title: 'Start your record', detail: 'Log one payment, message or change from this week. Dated entries are what help later.', label: 'Log it', action: openCapture });
    }

    if (ctx.hasAnyData) {
      const gap = ctx.lastBackup ? D.daysBetween(new Date(ctx.lastBackup), ctx.now) : null;
      if (gap === null || gap >= BACKUP_GAP_DAYS) {
        list.push({ title: 'Save a backup', detail: gap === null ? 'You haven’t backed up yet. Your data only lives in this browser.' : `Last backup ${gap} days ago.`, label: 'Back up now', action: backup });
      }
    }

    // Urgent first, otherwise keep the order above.
    return list.map((item, i) => ({ ...item, i })).sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || a.i - b.i);
  }

  // Overdue bills first, then what's due in the next 7 days. One bill gets a "Mark paid" button;
  // several are grouped into one line so bills can't crowd out everything else.
  function billNeeds(ctx) {
    const out = [];
    const amount = b => (b.amount ? D.currency(b.amount) : '');
    const total = list => list.reduce((sum, b) => sum + b.amount, 0);
    const named = list => list.map(b => `${b.name} (${dayMonth(parseIso(b.due))})`).join(', ');

    if (ctx.billsOverdue.length === 1) {
      const b = ctx.billsOverdue[0];
      out.push({ title: `${b.name} is overdue`, detail: [amount(b), `due ${dayMonth(parseIso(b.due))}`].filter(Boolean).join(', ') + '.', label: 'Mark paid', action: () => payBill(b), urgent: true });
    } else if (ctx.billsOverdue.length > 1) {
      out.push({ title: `${ctx.billsOverdue.length} bills overdue`, detail: `${named(ctx.billsOverdue)}.`, label: 'See bills', href: 'money.html#bills', urgent: true });
    }

    const overdueIds = new Set(ctx.billsOverdue.map(b => b.id));
    const upcoming = ctx.billsDue.filter(b => !overdueIds.has(b.id)); // pay the overdue one first
    if (upcoming.length === 1) {
      const b = upcoming[0];
      const gap = D.daysBetween(ctx.now, parseIso(b.on));
      out.push({ title: `${b.name} due ${when(parseIso(b.on), ctx.now)}`, detail: amount(b) ? `${amount(b)}.` : 'No amount saved.', label: 'Mark paid', action: () => payBill(b), urgent: gap <= 1 });
    } else if (upcoming.length > 1) {
      const soonest = D.daysBetween(ctx.now, parseIso(upcoming[0].on));
      const sum = total(upcoming);
      out.push({ title: `${upcoming.length} bills due this week`, detail: (sum ? `${D.currency(sum)} in total: ` : '') + `${upcoming.map(b => `${b.name} ${when(parseIso(b.on), ctx.now)}`).join(', ')}.`, label: 'See bills', href: 'money.html#bills', urgent: soonest <= 1 });
    }
    return out;
  }

  function markAdminDone(step) {
    const state = A.read(ADMIN_KEY, {});
    state[step.id] = true;
    if (!A.write(ADMIN_KEY, state)) return;
    A.notify(`Done: ${step.title}.`);
    render();
  }

  function payBill(bill) {
    const before = A.read(BILLS_KEY, []);
    if (!A.write(BILLS_KEY, D.markBillPaid(before, bill.id))) return;
    const next = D.cleanBills(A.read(BILLS_KEY, [])).find(b => b.id === bill.id);
    A.notify(next ? `${bill.name} marked paid. Next due ${shortDate(parseIso(next.due))}.` : `${bill.name} marked paid.`);
    render();
  }

  function renderNeeds(ctx) {
    const box = $('at-needs');
    const items = needs(ctx);
    const shown = items.slice(0, MAX_NEEDS);
    $('at-needs-count').textContent = items.length > MAX_NEEDS ? `${items.length - MAX_NEEDS} more after these` : '';

    if (!shown.length) {
      const [title, detail, label, href] = ALL_CLEAR[ctx.phase];
      shown.push({ title, detail, label, href, calm: true });
    }
    box.replaceChildren(...shown.map(item => {
      const li = document.createElement('li');
      li.className = 'at-need' + (item.urgent ? ' is-urgent' : '') + (item.calm ? ' is-calm' : '');
      const copy = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = item.title;
      const detail = document.createElement('span');
      detail.textContent = item.detail;
      copy.append(title, detail);
      let action;
      if (item.action) {
        action = document.createElement('button');
        action.type = 'button';
        action.addEventListener('click', item.action);
      } else {
        action = document.createElement('a');
        action.href = './' + item.href;
      }
      action.className = 'at-need-action';
      action.textContent = item.label + ' →';
      li.append(copy, action);
      return li;
    }));
  }

  /* ---------- Log something ---------- */

  let captureType = null;

  function selectCapture(type) {
    captureType = type;
    document.querySelectorAll('[data-capture]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.capture === type)));
    const form = $('at-capture-form');
    form.hidden = !type;
    if (!type) return;
    const [label, placeholder] = CAPTURE_TYPES[type];
    $('at-capture-title-label').textContent = label;
    $('at-capture-text').placeholder = placeholder;
    if (!$('at-capture-date').value) $('at-capture-date').value = D.isoDate(new Date());
    form.querySelectorAll('[data-cost-only]').forEach(el => { el.hidden = type !== 'cost'; });
    $('at-capture-text').focus();
  }

  function openCapture() {
    document.querySelector('.at-capture').scrollIntoView({ behavior: 'smooth', block: 'center' });
    selectCapture(captureType || 'incident');
  }

  function saveCapture(event) {
    event.preventDefault();
    const title = $('at-capture-text').value.trim();
    const date = $('at-capture-date').value;
    if (!title || !date || !captureType) return;
    const records = A.read(RECORDS_KEY, null);
    const store = records && Array.isArray(records.entries) ? records : { ...(records || {}), entries: [] };
    const isCost = captureType === 'cost';
    const now = new Date().toISOString();
    store.entries.push({
      id: 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      type: captureType,
      date,
      title: title.slice(0, 200),
      amount: isCost ? (parseFloat($('at-capture-amount').value) || 0) : null,
      paidBy: isCost ? $('at-capture-paid').value : null,
      kids: '',
      receipt: '',
      note: '',
      created: now,
    });
    if (!A.write(RECORDS_KEY, store)) return;
    $('at-capture-form').reset();
    selectCapture(null);
    A.notify(`Saved to Records. ${store.entries.length} ${store.entries.length === 1 ? 'entry' : 'entries'} on the record.`);
    render();
  }

  /* ---------- Your list ---------- */

  const tasks = () => {
    const value = A.read(TASKS_KEY, []);
    return Array.isArray(value) ? value.filter(t => t && typeof t.text === 'string').slice(0, MAX_TASKS) : [];
  };
  const saveTasks = list => A.write(TASKS_KEY, list);
  let undoSnapshot = null;

  function renderTasks() {
    const items = tasks();
    $('at-task-list').replaceChildren(...items.map(taskRow));
    $('at-task-tools').hidden = !items.length;
    $('at-task-count').textContent = items.length ? `${items.filter(t => t.done).length} of ${items.length} done` : '';
  }

  function taskRow(item) {
    const li = document.createElement('li');
    li.className = 'at-task';
    const label = document.createElement('label');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = !!item.done;
    check.addEventListener('change', () => {
      if (!saveTasks(tasks().map(t => (t.id === item.id ? { ...t, done: check.checked } : t)))) check.checked = !check.checked;
      renderTasks();
    });
    const name = document.createElement('span');
    name.className = 'at-task-copy at-task-name';
    name.textContent = item.text;
    label.append(check, name);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'at-icon-button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', 'Remove: ' + item.text);
    remove.addEventListener('click', () => {
      const before = tasks();
      if (saveTasks(before.filter(t => t.id !== item.id))) { renderTasks(); showUndo(before, 'Removed.'); }
    });
    li.append(label, remove);
    return li;
  }

  function showUndo(snapshot, message) {
    undoSnapshot = snapshot;
    $('at-undo-message').textContent = message;
    $('at-undo').hidden = false;
  }

  /* ---------- Numbers ---------- */

  function renderNumbers(ctx) {
    const money = ctx.money;
    $('at-money-value').textContent = money ? D.currency(money.surplus) + (money.surplus < 0 ? ' short' : ' left') : 'Start with your numbers';
    $('at-money-value').classList.toggle('at-negative', !!money && money.surplus < 0);
    $('at-money-detail').textContent = money ? 'Monthly estimate after planned costs' : 'Add income and costs to see your monthly picture.';

    const card = $('at-second-card');
    if (ctx.separationCosts > 0) {
      card.href = './money.html#separation-costs';
      $('at-second-kicker').textContent = 'Separation costs so far';
      $('at-second-value').textContent = D.currency(ctx.separationCosts);
      $('at-second-detail').textContent = 'Legal, mediation, moving and setting up.';
      $('at-second-action').textContent = 'See the breakdown →';
    } else {
      card.href = './records.html';
      $('at-second-kicker').textContent = 'Your record';
      $('at-second-value').textContent = ctx.records.count ? `${ctx.records.count} ${ctx.records.count === 1 ? 'entry' : 'entries'}` : 'No entries yet';
      $('at-second-detail').textContent = ctx.records.last ? `Last entry ${dayMonth(parseIso(ctx.records.last))}.` : 'Payments, incidents and agreements, dated.';
      $('at-second-action').textContent = 'Open Records →';
    }
  }

  /* ---------- Scripts ---------- */

  function renderScripts(ctx) {
    let picks = [];
    let reason = 'Picked for your phase.';
    const handover = nextHandover(ctx);
    const schoolDay = ctx.days.find(day => day.dates.some(d => SCHOOL_WORDS.test(d.label)));
    if (handover && handover.index <= 3) {
      picks = HANDOVER_SCRIPTS;
      reason = `For ${when(handover.date, ctx.now)}’s handover.`;
    } else if (schoolDay) {
      picks = SCHOOL_SCRIPTS;
      reason = `For ${schoolDay.dates.find(d => SCHOOL_WORDS.test(d.label)).label} ${when(schoolDay.date, ctx.now)}.`;
    }
    const ids = [...new Set([...picks, ...PHASE_SCRIPTS[ctx.phase]])].filter(id => SCRIPTS[id]).slice(0, 3);
    $('at-scripts-reason').textContent = reason;
    $('at-script-list').replaceChildren(...ids.map(id => {
      const [title, category, label] = SCRIPTS[id];
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `./scripts.html?tab=conversations&cat=${encodeURIComponent(category)}&script=${encodeURIComponent(id)}`;
      const name = document.createElement('span');
      name.textContent = title;
      const meta = document.createElement('small');
      meta.textContent = label;
      link.append(name, meta);
      li.append(link);
      return li;
    }));
  }

  /* ---------- Backup ---------- */

  function renderBackup(ctx) {
    const status = $('at-backup-status');
    const detail = $('at-backup-detail');
    if (!ctx.lastBackup) {
      status.textContent = ctx.hasAnyData ? 'Not backed up yet.' : 'Your data stays on this device.';
      detail.textContent = ctx.hasAnyData ? 'Your data only lives in this browser. Save a copy somewhere safe.' : 'Save a backup before you change browsers or clear browsing data.';
      return;
    }
    const gap = D.daysBetween(new Date(ctx.lastBackup), ctx.now);
    status.textContent = `Last backup ${gap === 0 ? 'today' : gap === 1 ? 'yesterday' : gap + ' days ago'}.`;
    detail.textContent = 'Your data stays on this device. Back up again after big changes.';
  }

  function backup() {
    if (A.exportBackup()) render();
  }

  /* ---------- Render ---------- */

  function render() {
    const ctx = load();
    renderStatus(ctx);
    renderDays(ctx);
    renderNeeds(ctx);
    renderNumbers(ctx);
    renderScripts(ctx);
    renderBackup(ctx);
    $('at-welcome').hidden = !ctx.showWelcome;
  }

  function migrateLegacyKeys() {
    for (const [oldKey, newKey] of Object.entries(LEGACY_KEYS)) {
      try {
        const value = localStorage.getItem(oldKey);
        if (value !== null && localStorage.getItem(newKey) === null) localStorage.setItem(newKey, value);
        if (value !== null) localStorage.removeItem(oldKey);
      } catch (_) { /* storage unavailable: the warning banner covers this */ }
    }
  }

  /* ---------- Events ---------- */

  document.querySelectorAll('[data-capture]').forEach(button => {
    button.addEventListener('click', () => selectCapture(captureType === button.dataset.capture ? null : button.dataset.capture));
  });
  $('at-capture-form').addEventListener('submit', saveCapture);
  $('at-capture-cancel').addEventListener('click', () => { $('at-capture-form').reset(); selectCapture(null); });

  $('at-add-task').addEventListener('submit', event => {
    event.preventDefault();
    const input = $('at-new-task');
    const text = input.value.trim();
    if (!text) return;
    const current = tasks();
    if (current.length >= MAX_TASKS) { A.notify('Keep this list manageable: remove something before adding more.'); return; }
    if (saveTasks([...current, { id: 'task-' + crypto.randomUUID(), text: text.slice(0, 160), done: false }])) {
      input.value = '';
      renderTasks();
    }
  });
  $('at-undo-button').addEventListener('click', () => {
    if (undoSnapshot && saveTasks(undoSnapshot)) { undoSnapshot = null; $('at-undo').hidden = true; renderTasks(); }
  });
  $('at-clear-done').addEventListener('click', () => {
    const current = tasks();
    if (!current.some(t => t.done)) { A.notify('Nothing ticked off yet.'); return; }
    if (saveTasks(current.filter(t => !t.done))) { renderTasks(); showUndo(current, 'Cleared.'); }
  });
  $('at-dismiss-welcome').addEventListener('click', () => { if (A.write(WELCOME_KEY, true)) $('at-welcome').hidden = true; });
  $('at-backup-now').addEventListener('click', backup);

  const refresh = () => { render(); renderTasks(); };
  document.addEventListener('atlas:phase', refresh);
  document.addEventListener('atlas:changed', render); // another part of Today saved data (e.g. the countdown checklist)
  window.addEventListener('storage', refresh);
  window.addEventListener('pageshow', refresh);

  migrateLegacyKeys();
  refresh();
})();
