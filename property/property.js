/* Atlas. Settlement Brief — free property settlement organiser.
   Private by design: answers live in memory unless the person opts in to keeping them on this device
   (localStorage key atlas_property, shared with the paid app on the same origin) or saves a file.
   Information, not advice: this file never produces a percentage, range, score or "likely" outcome. */
(function () {
  'use strict';

  const KEY = 'atlas_property';
  const FILE_ID = 'atlas-settlement-brief';
  const VERSION = 1;

  // ---------- State ----------
  const blank = () => ({
    v: VERSION,
    updated: null,
    start: {
      type: '',            // 'married' | 'defacto'
      region: '',          // NSW VIC QLD WA SA TAS ACT NT
      dates: { together: '', cohabit: '', married: '', separated: '', divorce: '' },
      divorce: '',         // 'none' | 'applied' | 'order'
      kids: [],            // [{ age: number }]
      proceedings: '',     // 'no' | 'yes' | 'unsure'
      urgent: { assets: false, safety: false },
    },
    items: [],
    poolChecked: {},   // commonly-forgotten sweep: key -> 'added' | 'na' | 'logged'
    sinceSep: [],
    contrib: {
      events: [],
      start: { me: { amount: null, desc: '' }, them: { amount: null, desc: '' } },
      windfalls: [],
      periods: [],
      other: {},
      since: { livesIn: '', mortgage: '', debts: '', kids: '', note: '' },
    },
    circ: {
      me: { age: null, work: '', income: null, health: '', healthNote: '', healthInBrief: false, career: '', dependants: '', partner: '' },
      them: { age: null, work: '', income: null, health: '', healthNote: '', healthInBrief: false, career: '', dependants: '', partner: '' },
      kids: { nights: null, cs: '', csAmount: null, housing: '' },
      ahead: '',
      other: '',
    },
    fv: { flag: '', note: '', includeInBrief: false },
    before: { name: '', meeting: '', meetingDate: '', hidden: {}, own: [], docs: {}, visited: false, printed: false },
  });

  let state = blank();
  let keep = false;
  let dirty = false;
  let current = 'start';

  const STEPS = [
    { id: 'start', label: 'Start', hint: 'Dates, kids, time limits' },
    { id: 'pool', label: 'The pool', hint: 'Everything owned and owed' },
    { id: 'contrib', label: 'Contributions', hint: 'What each of you put in' },
    { id: 'circ', label: 'Circumstances', hint: 'Now and ahead' },
    { id: 'before', label: 'Before you meet', hint: 'Questions and documents' },
    { id: 'brief', label: 'Your brief', hint: 'Print or save' },
  ];

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toast(msg) {
    const box = $('#sb-toast');
    box.textContent = msg;
    box.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { box.hidden = true; }, 4500);
  }

  function getPath(obj, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }
  function setPath(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((o, k) => (o[k] ??= {}), obj);
    target[last] = value;
  }

  // Local dates only (no UTC drift before 10am in Sydney).
  function parseDate(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null;
    const [y, m, d] = s.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 ? dt : null;
  }
  function today() { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function addMonths(date, months) {
    const y = date.getFullYear(), m = date.getMonth() + months, d = date.getDate();
    const lastDay = new Date(y, m + 1, 0).getDate();
    return new Date(y, m, Math.min(d, lastDay));
  }
  function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
  function fmtDate(d) { return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function yearsBetween(a, b) {
    let y = b.getFullYear() - a.getFullYear();
    if (b.getMonth() < a.getMonth() || (b.getMonth() === a.getMonth() && b.getDate() < a.getDate())) y--;
    return y;
  }

  function hasData() {
    return JSON.stringify({ ...state, updated: null }) !== JSON.stringify(blank());
  }

  // ---------- Storage ----------
  function persist() {
    state.updated = new Date().toISOString();
    dirty = true;
    if (keep) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); dirty = false; }
      catch (_) { toast('This browser couldn’t keep your progress. Save a file instead.'); }
    }
    renderStorage();
    renderStepList();
  }

  function loadKept() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && data.v === VERSION) { state = merge(blank(), data); keep = true; }
    } catch (_) { /* storage blocked or corrupt: start fresh */ }
  }

  // Fill any fields a saved copy is missing (older or partial files).
  function merge(base, data) {
    for (const k of Object.keys(data)) {
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && data[k] && typeof data[k] === 'object' && !Array.isArray(data[k])) {
        base[k] = merge(base[k], data[k]);
      } else if (k in base) {
        base[k] = data[k];
      }
    }
    return base;
  }

  function renderStorage() {
    const title = $('#sb-store-title'), note = $('#sb-store-note');
    $('#sb-keep').checked = keep;
    if (keep) {
      title.textContent = 'Kept on this device.';
      note.textContent = 'Your answers are stored in this browser only, never sent anywhere. Anyone using this device and browser could open them. Use “Forget everything” to remove them.';
    } else if (hasData()) {
      title.textContent = 'Not saved yet.';
      note.textContent = 'Your answers disappear when you close this tab. Save a file, or keep them on this device.';
    } else {
      title.textContent = 'Nothing is saved yet.';
      note.textContent = 'Your answers stay in this browser tab and disappear when you close it. Nothing is sent anywhere.';
    }
  }

  function saveFile() {
    const payload = { app: FILE_ID, v: VERSION, saved: new Date().toISOString(), data: state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const d = today();
    const stamp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    a.href = URL.createObjectURL(blob);
    a.download = 'settlement-brief-' + stamp + '.json';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    dirty = false;
    toast('Saved. Keep the file somewhere private. Open it here any time to carry on.');
  }

  function openFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let payload;
      try { payload = JSON.parse(reader.result); } catch (_) { payload = null; }
      if (!payload || payload.app !== FILE_ID || !payload.data) {
        toast('That file isn’t a Settlement Brief save file.');
        return;
      }
      if (payload.v > VERSION) {
        toast('That file was saved by a newer version. Refresh the page and try again.');
        return;
      }
      if (hasData() && !confirm('Opening this file replaces the answers on screen now. Carry on?')) return;
      state = merge(blank(), payload.data);
      persist();
      dirty = false;
      render();
      toast('File opened.');
    };
    reader.readAsText(file);
  }

  function forget() {
    if (!confirm('Forget everything? This clears your answers from this page' + (keep ? ' and from this device' : '') + '. Saved files aren’t affected.')) return;
    try { localStorage.removeItem(KEY); } catch (_) {}
    state = blank();
    keep = false;
    dirty = false;
    current = 'start';
    render();
    toast('Cleared.');
  }

  function setKeep(on) {
    if (on) {
      keep = true;
      persist();
      toast('Kept on this device. Only this browser can see it.');
    } else {
      if (!confirm('Stop keeping your progress on this device? The copy stored in this browser is removed. Your answers stay on screen until you close the tab.')) {
        $('#sb-keep').checked = true;
        return;
      }
      try { localStorage.removeItem(KEY); } catch (_) {}
      keep = false;
      dirty = hasData();
      renderStorage();
      toast('Removed from this device.');
    }
  }

  // ---------- Derived: Start ----------
  function timeLimit() {
    const s = state.start;
    const t = today();
    if (s.type === 'married') {
      const div = parseDate(s.dates.divorce);
      if (s.divorce === 'order' && div) {
        const by = addMonths(div, 12);
        return { by, days: daysBetween(t, by), rule: '12 months from when the divorce order took effect' };
      }
      return { pending: 'married' };
    }
    if (s.type === 'defacto') {
      const sep = parseDate(s.dates.separated);
      if (sep) {
        const by = addMonths(sep, 24);
        return { by, days: daysBetween(t, by), rule: 'two years from separation' };
      }
      return { pending: 'defacto' };
    }
    return null;
  }

  function timeLimitHTML() {
    const tl = timeLimit();
    if (!tl) return '<p class="sb-muted">Choose married or de facto above to see your time limit.</p>';
    if (tl.pending === 'married') {
      return `<div class="sb-callout">
        <h4>Your clock hasn’t started yet</h4>
        <p>For married couples, the time limit to apply to the court for property orders is <strong>12 months from when a divorce order takes effect</strong>. You don’t have to wait for a divorce to sort property, and many people settle first.</p>
        <p class="sb-muted">Add the date your divorce order took effect once you have it.</p>
      </div>`;
    }
    if (tl.pending === 'defacto') {
      return '<p class="sb-muted">Add your separation date to see your time limit. For de facto couples it’s two years from separation.</p>';
    }
    let tone = 'ok', lead;
    if (tl.days < 0) {
      tone = 'urgent';
      lead = `<h4>The time limit passed on ${fmtDate(tl.by)}</h4>
        <p>You can still ask the court for permission to apply late, but it isn’t guaranteed. <strong>Get legal advice now.</strong> Agreements reached without going to court can still be made binding.</p>`;
    } else if (tl.days <= 90) {
      tone = 'urgent';
      lead = `<h4>${tl.days === 0 ? 'Today is the last day' : tl.days + (tl.days === 1 ? ' day' : ' days') + ' left'}: apply by ${fmtDate(tl.by)}</h4>
        <p>That’s close. <strong>Talk to a family lawyer or Legal Aid soon</strong>, even if you expect to agree. Filing an application or consent orders before the deadline keeps your options open.</p>`;
    } else if (tl.days <= 180) {
      tone = 'soon';
      lead = `<h4>Apply by ${fmtDate(tl.by)}: about ${Math.round(tl.days / 30)} months left</h4>
        <p>Enough time to organise, mediate and formalise an agreement, but not enough to let it drift.</p>`;
    } else {
      lead = `<h4>Apply by ${fmtDate(tl.by)}</h4>
        <p>About ${tl.days > 730 ? Math.floor(tl.days / 365) + ' years' : Math.round(tl.days / 30) + ' months'} left. Put the date somewhere you’ll see it.</p>`;
    }
    return `<div class="sb-callout sb-${tone}">${lead}
      <p class="sb-muted">Rule: ${tl.rule}. The date is calculated from what you entered, so check it against your paperwork.</p></div>`;
  }

  function notesHTML() {
    const s = state.start;
    const out = [];
    if (s.type === 'defacto' && s.region === 'WA') {
      out.push(`<div class="sb-callout sb-info"><h4>Western Australia works differently for de facto couples</h4>
        <p>De facto property matters in WA run under the state’s <em>Family Court Act 1997</em> through the Family Court of WA. The approach is similar and the time limit is still two years from separation, but check <a href="https://www.legalaid.wa.gov.au/" rel="noopener">Legal Aid WA</a> for the local detail.</p></div>`);
    }
    if (s.type === 'defacto') {
      const start = parseDate(s.dates.cohabit) || parseDate(s.dates.together);
      const sep = parseDate(s.dates.separated);
      if (start && sep && sep > start && yearsBetween(start, sep) < 2) {
        out.push(`<div class="sb-callout sb-info"><h4>Check the de facto relationship qualifies</h4>
          <p>The court can usually only divide property for de facto couples if <strong>at least one</strong> of these applies: the relationship lasted at least two years in total, you have a child together, it was registered under state law, or one of you made substantial contributions and it would be seriously unjust not to make an order. From your dates it was under two years, so this is worth a quick question to Legal Aid or a lawyer.</p></div>`);
      }
    }
    if (s.urgent.assets) {
      out.push(`<div class="sb-callout sb-urgent"><h4>If property may be sold, moved or hidden</h4>
        <p><strong>Get legal advice now.</strong> The court can make urgent orders to stop property being dealt with, and urgency is an exception to the usual steps before court. Start with <a href="https://www.nationallegalaid.org/" rel="noopener">Legal Aid in your state</a> or a family lawyer. Keep copies of any statements you already have.</p></div>`);
    }
    if (s.urgent.safety) {
      out.push(`<div class="sb-callout sb-urgent"><h4>Your safety comes first</h4>
        <p>If you’re in danger, call <strong>000</strong>. For support any time, call <strong>1800RESPECT on 1800 737 732</strong>. Family violence is an exception to the usual requirement to try mediation first, and its effects can be taken into account in a property settlement. A lawyer or Legal Aid can talk you through it.</p></div>`);
    }
    if (s.proceedings === 'yes') {
      out.push(`<div class="sb-callout sb-info"><h4>A court case has started</h4>
        <p>Use this brief alongside your lawyer’s advice, not instead of it. Your duty of full and frank financial disclosure applies the whole way through.</p></div>`);
    }
    return out.join('');
  }

  // ---------- Step views ----------
  const radio = (path, value, label, sub) => `
    <label class="sb-choice"><input type="radio" name="${path}" value="${value}" data-k="${path}" ${getPath(state, path) === value ? 'checked' : ''}>
      <span><strong>${label}</strong>${sub ? `<small>${sub}</small>` : ''}</span></label>`;

  const dateField = (path, label, help) => `
    <label class="at-field sb-field"><span>${label}</span>
      <input class="at-input" type="date" data-k="${path}" value="${esc(getPath(state, path))}" max="2100-12-31">
      ${help ? `<small class="sb-help">${help}</small>` : ''}</label>`;

  function viewStart() {
    const s = state.start;
    const regions = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
    const kids = s.kids.map((k, i) => `
      <div class="sb-kid">
        <label class="at-field"><span>Child ${i + 1}: age</span>
          <input class="at-input sb-age" type="number" min="0" max="17" inputmode="numeric" data-kid="${i}" value="${k.age ?? ''}"></label>
        <button type="button" class="sb-btn sb-btn-quiet" data-remove-kid="${i}" aria-label="Remove child ${i + 1}">Remove</button>
      </div>`).join('');

    return `
      <header class="sb-step-head">
        <div class="sb-step-num">Step 1 of 6</div>
        <h2>Start with the facts</h2>
        <p>A few dates and details set your time limit and shape every step after this. Rough dates are fine for now.</p>
      </header>

      <section class="sb-tile">
        <h3>Your relationship</h3>
        <div class="sb-choices">
          ${radio('start.type', 'married', 'Married', 'Family Law Act, section 79')}
          ${radio('start.type', 'defacto', 'De facto', 'Including same-sex couples. Section 90SM')}
        </div>
        <label class="at-field sb-field sb-narrow"><span>State or territory you live in</span>
          <select class="at-input" data-k="start.region">
            <option value="">Choose…</option>
            ${regions.map(r => `<option ${s.region === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select></label>
      </section>

      <section class="sb-tile">
        <h3>Key dates</h3>
        <div class="sb-grid">
          ${dateField('start.dates.together', 'Relationship started')}
          ${dateField('start.dates.cohabit', 'Started living together')}
          ${s.type === 'married' ? dateField('start.dates.married', 'Married') : ''}
          ${dateField('start.dates.separated', 'Separated', 'If you separated under one roof, use the date the relationship ended, not the date someone moved out.')}
        </div>
        ${s.type === 'married' ? `
          <div class="sb-sub-q">
            <p class="sb-q">Divorce</p>
            <div class="sb-choices sb-choices-inline">
              ${radio('start.divorce', 'none', 'Not applied yet')}
              ${radio('start.divorce', 'applied', 'Applied, waiting')}
              ${radio('start.divorce', 'order', 'Divorce order has taken effect')}
            </div>
            ${s.divorce === 'order' ? `<div class="sb-grid">${dateField('start.dates.divorce', 'Date the divorce order took effect', 'Usually one month and one day after the hearing. It’s on your divorce certificate.')}</div>` : ''}
          </div>` : ''}
      </section>

      <section class="sb-tile sb-tile-cobalt" aria-live="polite">
        <h3>Your time limit</h3>
        <div id="sb-timelimit">${timeLimitHTML()}</div>
      </section>

      <section class="sb-tile">
        <h3>Children under 18</h3>
        <p class="sb-muted">Ages only. No names needed. Children’s care and housing needs are part of step 4.</p>
        <div class="sb-kids">${kids || '<p class="sb-muted sb-empty">No children added.</p>'}</div>
        <button type="button" class="sb-btn" id="sb-add-kid">Add a child</button>
      </section>

      <section class="sb-tile">
        <h3>Where things are at</h3>
        <p class="sb-q">Has a court case about property started?</p>
        <div class="sb-choices sb-choices-inline">
          ${radio('start.proceedings', 'no', 'No')}
          ${radio('start.proceedings', 'yes', 'Yes')}
          ${radio('start.proceedings', 'unsure', 'Not sure')}
        </div>
        <p class="sb-q">Does either of these apply? <span class="sb-muted">(Optional. It changes what to do first.)</span></p>
        <label class="sb-check"><input type="checkbox" data-k="start.urgent.assets" ${s.urgent.assets ? 'checked' : ''}> <span>Property may be sold, moved or hidden before things are sorted</span></label>
        <label class="sb-check"><input type="checkbox" data-k="start.urgent.safety" ${s.urgent.safety ? 'checked' : ''}> <span>I don’t feel safe</span></label>
      </section>

      <div id="sb-notes">${notesHTML()}</div>

      <aside class="sb-tile sb-wrong">
        <h3>What people get wrong at the start</h3>
        <ul>
          <li><strong>Waiting for the divorce.</strong> Property can be settled any time after separation. The divorce only starts the married-couple clock.</li>
          <li><strong>Leaving it informal.</strong> A handshake, email or text isn’t binding. Agreements need consent orders or a binding financial agreement.</li>
          <li><strong>Guessing the separation date.</strong> It anchors the de facto time limit and the “since separation” part of your story. Pin it down.</li>
        </ul>
      </aside>`;
  }

  function viewComing(step) {
    const plans = {
      pool: 'Every asset and debt in either name, super included, with how sure you are of each value and whether you have the paperwork. It ends with your net pool and a list of gaps.',
      contrib: 'A timeline of the relationship, what each of you brought in, windfalls like inheritances, who did what, and what’s happened since separation.',
      circ: 'The things the court weighs looking forward, in plain English: age, health, income, earning capacity, care of the kids and housing them.',
      before: 'Questions to ask your mediator or lawyer, built from your answers, and the documents you still need.',
      brief: 'A clean printed brief: a one-page summary, your schedule of assets and debts, your timeline and your questions.',
    };
    const s = STEPS.find(x => x.id === step);
    return `
      <header class="sb-step-head">
        <div class="sb-step-num">Step ${STEPS.indexOf(s) + 1} of 6</div>
        <h2>${s.label}</h2>
        <p>${plans[step]}</p>
      </header>
      <section class="sb-tile sb-coming"><p><strong>This step is being built.</strong> Save your progress and come back soon.</p></section>`;
  }

  // ---------- Step 2: The pool ----------
  const OWNERS = [['me', 'My name'], ['them', 'Their name'], ['joint', 'Joint'], ['entity', 'Company or trust'], ['unsure', 'Not sure']];
  const BASES = [
    ['guess', 'My guess'],
    ['estimate', 'Online estimate or agent appraisal'],
    ['statement', 'Statement, bill or contract'],
    ['valuation', 'Formal valuation'],
  ];
  const BACKED = new Set(['estimate', 'statement', 'valuation']);

  // type: [label, hint shown under the row]
  const TYPES = {
    asset: {
      home: ['Family home', 'Current market value, not what you paid. Recent local sales or a free agent appraisal is a fine start.'],
      property: ['Other property', 'Investment property, land, holiday place. Current market value.'],
      cash: ['Bank, savings or offset', 'Every account at every bank, in either name. Use today’s balance.'],
      shares: ['Shares, ETFs or managed funds', 'Value on a named date. Employee shares and options count too.'],
      crypto: ['Crypto', 'Value on a named date. It moves, so note the date.'],
      vehicle: ['Car, boat, caravan or trailer', 'Resale value, not the insured value.'],
      business: ['Business', 'A rough figure now. Valuing a business properly is a professional job.'],
      entity: ['Trust or company', 'Interests in a family trust or company either of you controls. List it even if you can’t value it yet.'],
      owed: ['Money owed to you', 'Loans to family or friends, bonds, deposits, a tax refund due.'],
      contents: ['Contents and other', 'Second-hand value. It’s usually far less than people think.'],
      other: ['Other asset', ''],
    },
    super: {
      super: ['Super account', 'Latest statement balance. Their super counts too: estimate it if you have to and mark it as a guess.'],
    },
    debt: {
      mortgage: ['Mortgage', 'The payout figure, including any redraw used. Ask the lender for it.'],
      car: ['Car loan', 'The payout figure, not the monthly repayment.'],
      personal: ['Personal loan', 'The payout figure.'],
      card: ['Credit card', 'Current balance on every card, in either name.'],
      bnpl: ['Buy now pay later or store card', 'Afterpay, Zip, store cards. Small balances add up.'],
      tax: ['Tax owing', 'Income tax, BAS or other ATO debts, in either name.'],
      family: ['Loan from family', 'Whether money from family is a loan or a gift is often disputed. List it and note any paperwork.'],
      study: ['Study debt (HELP)', 'How study debts are treated varies. List it so it’s on the table.'],
      other: ['Other debt', ''],
    },
  };
  const SUPER_TYPES = [['accumulation', 'Standard (accumulation)'], ['defined', 'Defined benefit'], ['smsf', 'Self-managed (SMSF)'], ['unsure', 'Not sure']];

  // The commonly forgotten sweep. add: [kind, type] to add a row; none means a tip only.
  const SWEEP = [
    ['oldsuper', 'Old or lost super funds', 'myGov → ATO → Super shows every fund in your name, including lost ones.', ['super', 'super']],
    ['theirsuper', 'Their super', 'It’s part of the pool even if you don’t know the balance. Add it as a guess.', ['super', 'super']],
    ['defined', 'Defined benefit or public-sector super', 'These are valued differently. Flag it, even without a number.', ['super', 'super']],
    ['smsf', 'A self-managed super fund', 'Usually needs an accountant to value.', ['super', 'super']],
    ['empshares', 'Employee shares or options', 'Check your payslip and employer portal.', ['asset', 'shares']],
    ['crypto', 'Crypto', 'Exchanges and wallets, in either name.', ['asset', 'crypto']],
    ['entity', 'A family trust or company', 'Including one set up for a business or investment.', ['asset', 'entity']],
    ['tax', 'Tax owing or a refund due', 'Check both your ATO accounts.', ['debt', 'tax']],
    ['family', 'Money to or from family', 'Loans, gifts and help with a deposit.', ['debt', 'family']],
    ['bnpl', 'Buy now pay later and store cards', '', ['debt', 'bnpl']],
    ['toys', 'Boats, caravans, trailers, motorbikes', '', ['asset', 'vehicle']],
    ['disposed', 'Anything sold or given away around separation', 'Disclosure covers property disposed of in the year before separation and since. Log it under “Since separation” below.', null],
  ];

  const num = v => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const money = n => (n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-AU');
  const newId = () => 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const typeLabel = it => (TYPES[it.kind]?.[it.type] || ['Item'])[0];
  const optionList = (pairs, sel, placeholder) =>
    (placeholder ? `<option value="">${placeholder}</option>` : '') +
    pairs.map(([v, l]) => `<option value="${v}" ${sel === v ? 'selected' : ''}>${l}</option>`).join('');

  function addItem(kind, type) {
    const it = { id: newId(), kind, type, desc: '', owner: '', value: null, basis: '', asAt: '', doc: false, disputed: false, note: '' };
    if (kind === 'super') Object.assign(it, { superType: '', form6: false });
    state.items.push(it);
    return it;
  }

  function poolTotals() {
    const by = k => state.items.filter(i => i.kind === k);
    const assets = by('asset').reduce((s, i) => s + num(i.value), 0);
    const sup = by('super').reduce((s, i) => s + num(i.value), 0);
    const debts = by('debt').reduce((s, i) => s + num(i.value), 0);
    const pool = assets + sup - debts;
    const realEstate = by('asset').filter(i => i.type === 'home' || i.type === 'property').reduce((s, i) => s + num(i.value), 0);
    const mortgages = by('debt').filter(i => i.type === 'mortgage').reduce((s, i) => s + num(i.value), 0);
    const homeNet = Math.max(0, realEstate - mortgages);
    const otherNet = pool - homeNet - sup; // can be negative when non-mortgage debts outweigh other assets
    const other = Math.max(0, otherNet);
    const gross = state.items.reduce((s, i) => s + Math.abs(num(i.value)), 0);
    const backed = state.items.filter(i => BACKED.has(i.basis)).reduce((s, i) => s + Math.abs(num(i.value)), 0);
    const owners = {};
    for (const i of state.items) {
      const k = i.owner || 'unsure';
      owners[k] = (owners[k] || 0) + (i.kind === 'debt' ? -num(i.value) : num(i.value));
    }
    return { assets, sup, debts, pool, homeNet, other, otherNet, gross, backed, owners };
  }

  function poolGaps() {
    const gaps = [];
    for (const i of state.items) {
      const name = esc(i.desc || typeLabel(i));
      if (i.value == null) gaps.push(`<strong>${name}</strong> needs a value, even a rough one.`);
      else if (i.basis === 'guess') gaps.push(`<strong>${name}</strong> is a guess. What would confirm it?`);
      else if (!i.basis) gaps.push(`<strong>${name}</strong>: where does the figure come from?`);
      if (!i.doc) gaps.push(`<strong>${name}</strong>: no paperwork yet.`);
      if (!i.owner) gaps.push(`<strong>${name}</strong>: whose name is it in?`);
      if (i.disputed) gaps.push(`<strong>${name}</strong> is disputed. Note what each of you says it’s worth.`);
      if (i.kind === 'super' && (i.superType === 'defined' || i.superType === 'smsf')) gaps.push(`<strong>${name}</strong> is ${i.superType === 'defined' ? 'defined benefit' : 'an SMSF'}: it needs a specific valuation. Ask your professional.`);
      if (i.kind === 'super' && !i.form6 && i.owner === 'them') gaps.push(`<strong>${name}</strong>: consider a Superannuation Information Request (Form 6) to the fund.`);
      if (i.type === 'business' && i.basis !== 'valuation') gaps.push(`<strong>${name}</strong>: businesses usually need a professional valuation.`);
    }
    return gaps;
  }

  function poolSummaryHTML() {
    const t = poolTotals();
    if (!state.items.length) {
      return `<div class="sb-pool-empty"><p class="sb-pool-label">Your net pool</p><p class="sb-pool-big">$0</p>
        <p class="sb-muted">Add your first item below. Most people start with the house, the mortgage and both super balances.</p></div>`;
    }
    const comp = t.homeNet + t.sup + t.other || 1;
    const share = n => Math.round((n / comp) * 100);
    const backedShare = t.gross ? Math.round((t.backed / t.gross) * 100) : 0;
    const ownerRow = (k, l) => (t.owners[k] ? `<li><span>${l}</span><strong>${money(t.owners[k])}</strong></li>` : '');
    return `
      <div class="sb-pool-top">
        <div>
          <p class="sb-pool-label">Your net pool</p>
          <p class="sb-pool-big${t.pool < 0 ? ' is-negative' : ''}">${money(t.pool)}</p>
          <p class="sb-muted">${money(t.assets + t.sup)} owned (super included) − ${money(t.debts)} owed</p>
        </div>
        <div class="sb-confidence">
          <p class="sb-pool-label">How solid are these numbers?</p>
          <div class="sb-meter" role="img" aria-label="${backedShare} percent of the dollar value is backed by paperwork"><span style="width:${backedShare}%"></span></div>
          <p class="sb-muted">${backedShare}% of the dollar value is backed by a statement, appraisal or valuation. The rest is a guess or has no source yet.</p>
        </div>
      </div>
      <div class="sb-comp">
        <p class="sb-pool-label">Where the pool sits</p>
        <div class="sb-bar" aria-hidden="true">
          <span class="c-home" style="width:${share(t.homeNet)}%"></span><span class="c-super" style="width:${share(t.sup)}%"></span><span class="c-other" style="width:${share(t.other)}%"></span>
        </div>
        <ul class="sb-legend">
          <li><i class="c-home"></i>Property after mortgage <strong>${money(t.homeNet)}</strong></li>
          <li><i class="c-super"></i>Super <strong>${money(t.sup)}</strong></li>
          <li><i class="c-other"></i>Everything else, after other debts <strong>${money(t.otherNet)}</strong></li>
        </ul>
        ${t.pool > 0 && share(t.homeNet + t.sup) >= 60 ? `<p class="sb-muted">Most of this pool is house and super: money that can be divided but not easily spent. Worth knowing before you talk options.</p>` : ''}
      </div>
      <details class="sb-owners">
        <summary>Whose name things are in</summary>
        <ul>${ownerRow('me', 'My name')}${ownerRow('them', 'Their name')}${ownerRow('joint', 'Joint')}${ownerRow('entity', 'Company or trust')}${ownerRow('unsure', 'Not sure yet')}</ul>
        <p class="sb-muted">Net of debts. Whose name something is in doesn’t decide who keeps it. Everything goes on the list first.</p>
      </details>`;
  }

  function itemHTML(it) {
    const [label, hint] = TYPES[it.kind]?.[it.type] || ['Item', ''];
    const f = (field, inner) => `<label class="at-field sb-field">${inner}</label>`;
    const sel = (field, pairs, ph) => `<select class="at-input" data-item="${it.id}" data-f="${field}">${optionList(pairs, it[field], ph)}</select>`;
    const typeSel = `<select class="at-input" data-item="${it.id}" data-f="type">${optionList(Object.entries(TYPES[it.kind]).map(([v, [l]]) => [v, l]), it.type)}</select>`;
    const descPh = it.kind === 'super' ? 'Fund name, e.g. AustralianSuper' : it.kind === 'debt' ? 'Lender, e.g. CBA home loan' : 'Short description, e.g. 12 Smith St';
    return `
      <article class="sb-item${it.disputed ? ' is-disputed' : ''}" data-row="${it.id}">
        <div class="sb-item-head">
          <span class="sb-item-type">${esc(label)}</span>
          <strong class="sb-item-value">${it.value == null ? 'No value yet' : money(it.kind === 'debt' ? -it.value : it.value)}</strong>
        </div>
        <div class="sb-item-grid">
          ${it.kind === 'super' ? '' : f('type', `<span>Type</span>${typeSel}`)}
          ${f('desc', `<span>${it.kind === 'super' ? 'Fund' : 'Description'}</span><input class="at-input" type="text" maxlength="80" data-item="${it.id}" data-f="desc" value="${esc(it.desc)}" placeholder="${descPh}">`)}
          ${f('owner', `<span>Whose name</span>${sel('owner', OWNERS, 'Choose…')}`)}
          ${f('value', `<span>${it.kind === 'debt' ? 'Amount owed' : 'Value'} ($)</span><input class="at-input" type="number" min="0" step="1" inputmode="numeric" data-item="${it.id}" data-f="value" value="${it.value ?? ''}">`)}
          ${f('basis', `<span>Based on</span>${sel('basis', BASES, 'Choose…')}`)}
          ${f('asAt', `<span>As at</span><input class="at-input" type="date" data-item="${it.id}" data-f="asAt" value="${esc(it.asAt)}">`)}
          ${it.kind === 'super' ? f('superType', `<span>Kind of fund</span>${sel('superType', SUPER_TYPES, 'Choose…')}`) : ''}
        </div>
        ${hint ? `<p class="sb-help">${hint}</p>` : ''}
        <div class="sb-item-flags">
          <label class="sb-check"><input type="checkbox" data-item="${it.id}" data-f="doc" ${it.doc ? 'checked' : ''}> <span>I have the paperwork</span></label>
          <label class="sb-check"><input type="checkbox" data-item="${it.id}" data-f="disputed" ${it.disputed ? 'checked' : ''}> <span>We disagree about this</span></label>
          ${it.kind === 'super' ? `<label class="sb-check"><input type="checkbox" data-item="${it.id}" data-f="form6" ${it.form6 ? 'checked' : ''}> <span>Form 6 request sent</span></label>` : ''}
        </div>
        <label class="at-field sb-field sb-note"><span>Note <small class="sb-muted">(goes in your brief)</small></span>
          <input class="at-input" type="text" maxlength="200" data-item="${it.id}" data-f="note" value="${esc(it.note)}" placeholder="${it.disputed ? 'e.g. They say $700k, my appraisal says $820k' : 'Anything your professional should know'}"></label>
        <button type="button" class="sb-btn sb-btn-quiet sb-item-remove" data-remove-item="${it.id}">Remove</button>
      </article>`;
  }

  function groupHTML(kind, title, lead, quick) {
    const rows = state.items.filter(i => i.kind === kind);
    const total = rows.reduce((s, i) => s + num(i.value), 0);
    return `
      <section class="sb-tile" id="sb-group-${kind}">
        <div class="sb-group-head"><h3>${title}</h3><span class="sb-group-total">${rows.length ? money(kind === 'debt' ? -total : total) : ''}</span></div>
        <p class="sb-muted">${lead}</p>
        <div class="sb-items">${rows.map(itemHTML).join('')}</div>
        <div class="sb-quick" role="group" aria-label="Add ${title.toLowerCase()}">
          <span class="sb-quick-label">Add:</span>
          ${quick.map(t => `<button type="button" class="sb-chip" data-add="${kind}:${t}">+ ${TYPES[kind][t][0]}</button>`).join('')}
        </div>
      </section>`;
  }

  function sweepHTML() {
    const done = state.poolChecked || {};
    const open = SWEEP.filter(([k]) => !done[k]).length;
    return `
      <section class="sb-tile sb-sweep">
        <div class="sb-group-head"><h3>The commonly forgotten</h3><span class="sb-group-total">${open ? open + ' to check' : 'All checked'}</span></div>
        <p class="sb-muted">The items people most often leave off, especially the ones in the other person’s name.</p>
        <ul class="sb-sweep-list">
          ${SWEEP.map(([k, label, tip, add]) => `
            <li class="${done[k] ? 'is-' + done[k] : ''}">
              <div><strong>${label}</strong>${tip ? `<small>${tip}</small>` : ''}</div>
              <div class="sb-sweep-actions">
                ${done[k] ? `<span class="sb-sweep-state">${{ added: 'Added', logged: 'Logged below', na: 'Doesn’t apply' }[done[k]]}</span><button type="button" class="sb-btn sb-btn-quiet" data-sweep="${k}:undo">Undo</button>`
                  : `${add ? `<button type="button" class="sb-chip" data-sweep="${k}:add">Add it</button>` : `<button type="button" class="sb-chip" data-sweep="${k}:log">Log it</button>`}
                     <button type="button" class="sb-chip sb-chip-quiet" data-sweep="${k}:na">Doesn’t apply</button>`}
              </div>
            </li>`).join('')}
        </ul>
        <p class="sb-muted">Pets aren’t on this list. Since June 2025 they’re dealt with separately as “companion animals”.</p>
      </section>`;
  }

  function sinceSepHTML() {
    const rows = state.sinceSep;
    const kinds = [['spent', 'Spent'], ['received', 'Received'], ['sold', 'Sold or given away']];
    const whos = [['me', 'Me'], ['them', 'Them'], ['joint', 'Joint money']];
    return `
      <section class="sb-tile" id="sb-sincesep">
        <div class="sb-group-head"><h3>Since separation</h3></div>
        <p class="sb-muted">Money spent, received or moved since you separated (or just before): legal fees, a sold car, a bonus, an inheritance, a drained account. Since 2025 it isn’t added back into the pool, but it can still be weighed. Keep it separate and keep it factual.</p>
        <div class="sb-ss-rows">
          ${rows.map((r, n) => `
            <div class="sb-ss-row">
              <label class="at-field sb-field"><span>Date</span><input class="at-input" type="date" data-ss="${n}" data-f="date" value="${esc(r.date)}"></label>
              <label class="at-field sb-field"><span>What</span><input class="at-input" type="text" maxlength="100" data-ss="${n}" data-f="desc" value="${esc(r.desc)}" placeholder="e.g. Lawyer’s retainer"></label>
              <label class="at-field sb-field"><span>Kind</span><select class="at-input" data-ss="${n}" data-f="kind">${optionList(kinds, r.kind)}</select></label>
              <label class="at-field sb-field"><span>Whose money</span><select class="at-input" data-ss="${n}" data-f="who">${optionList(whos, r.who, 'Choose…')}</select></label>
              <label class="at-field sb-field"><span>Amount ($)</span><input class="at-input" type="number" min="0" step="1" inputmode="numeric" data-ss="${n}" data-f="amount" value="${r.amount ?? ''}"></label>
              <button type="button" class="sb-btn sb-btn-quiet" data-remove-ss="${n}">Remove</button>
            </div>`).join('') || '<p class="sb-muted sb-empty">Nothing logged.</p>'}
        </div>
        <button type="button" class="sb-btn" id="sb-add-ss">Add an entry</button>
      </section>`;
  }

  function gapsHTML() {
    const gaps = poolGaps();
    if (!state.items.length) return '';
    return gaps.length
      ? `<p class="sb-muted">${gaps.length} thing${gaps.length === 1 ? '' : 's'} to tighten up. These go into “Before you meet”.</p><ul class="sb-gaps">${gaps.slice(0, 12).map(g => `<li>${g}</li>`).join('')}</ul>${gaps.length > 12 ? `<p class="sb-muted">and ${gaps.length - 12} more.</p>` : ''}`
      : '<p>Every item has a value, an owner and paperwork. That’s a strong position to walk in with.</p>';
  }

  function viewPool() {
    return `
      <header class="sb-step-head">
        <div class="sb-step-num">Step 2 of 6</div>
        <h2>Everything owned and owed</h2>
        <p>Both names, either name, before the relationship or after. It all goes on the list first. Arguments about who keeps what come later. Rough numbers are fine: mark them as guesses and firm them up as you go.</p>
      </header>

      <section class="sb-tile sb-tile-cobalt" id="sb-pool-summary" aria-live="polite">${poolSummaryHTML()}</section>

      ${groupHTML('asset', 'Property and assets', 'Current value, not what you paid.', ['home', 'property', 'cash', 'shares', 'vehicle', 'business', 'contents', 'other'])}
      ${groupHTML('super', 'Super', 'Both of you. Super is part of the pool, even though it usually stays locked until retirement.', ['super'])}
      ${groupHTML('debt', 'Debts', 'Debts in one name still count. The pool is what’s left after they’re paid.', ['mortgage', 'car', 'personal', 'card', 'bnpl', 'tax', 'other'])}
      ${sweepHTML()}
      ${sinceSepHTML()}

      <section class="sb-tile" id="sb-gaps-tile"><h3>Gaps</h3><div id="sb-gaps">${gapsHTML() || '<p class="sb-muted">Gaps show here as you add items.</p>'}</div></section>

      <aside class="sb-tile sb-wrong">
        <h3>What people get wrong about the pool</h3>
        <ul>
          <li><strong>“It’s in my name, so it’s mine.”</strong> Not at this stage. Name on title decides nothing by itself.</li>
          <li><strong>Forgetting their super.</strong> It’s routinely the second-biggest asset and the most often missed.</li>
          <li><strong>Using the separation-day value.</strong> Property is generally valued as it is now, not on the day you split.</li>
          <li><strong>Hiding or forgetting something.</strong> Full and frank disclosure is a legal duty. Gaps found later can undo an agreement.</li>
        </ul>
      </aside>`;
  }

  function refreshPool() {
    const sum = $('#sb-pool-summary');
    if (sum) sum.innerHTML = poolSummaryHTML();
    const gaps = $('#sb-gaps');
    if (gaps) gaps.innerHTML = gapsHTML() || '<p class="sb-muted">Gaps show here as you add items.</p>';
    for (const it of state.items) {
      const row = $(`[data-row="${it.id}"]`);
      if (!row) continue;
      const v = $('.sb-item-value', row);
      v.textContent = it.value == null ? 'No value yet' : money(it.kind === 'debt' ? -it.value : it.value);
      row.classList.toggle('is-disputed', !!it.disputed);
    }
    for (const kind of ['asset', 'super', 'debt']) {
      const el = $(`#sb-group-${kind} .sb-group-total`);
      const rows = state.items.filter(i => i.kind === kind);
      if (el) el.textContent = rows.length ? money((kind === 'debt' ? -1 : 1) * rows.reduce((s, i) => s + num(i.value), 0)) : '';
    }
  }

  function rerender(focusSel) {
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
    if (focusSel) $(focusSel)?.focus({ preventScroll: false });
  }

  // ---------- Shared bits for steps 3 and 4 ----------
  const WHO = [['me', 'Me'], ['them', 'Them'], ['both', 'Both of us'], ['na', 'Doesn’t apply']];
  const WHO2 = [['me', 'Me'], ['them', 'Them'], ['both', 'Both']];

  const kSel = (path, pairs, ph) =>
    `<select class="at-input" data-k="${path}">${optionList(pairs, getPath(state, path), ph ?? 'Choose…')}</select>`;
  const kText = (path, ph, max = 160) =>
    `<input class="at-input" type="text" maxlength="${max}" data-k="${path}" value="${esc(getPath(state, path))}" placeholder="${esc(ph || '')}">`;
  const kNum = (path, min = 0, max) =>
    `<input class="at-input" type="number" inputmode="numeric" min="${min}" ${max != null ? `max="${max}"` : ''} step="1" data-k="${path}" data-num value="${getPath(state, path) ?? ''}">`;
  const kArea = (path, ph) =>
    `<textarea class="at-input sb-area" rows="2" maxlength="600" data-k="${path}" placeholder="${esc(ph || '')}">${esc(getPath(state, path))}</textarea>`;
  const kCheck = (path, label) =>
    `<label class="sb-check"><input type="checkbox" data-k="${path}" ${getPath(state, path) ? 'checked' : ''}> <span>${label}</span></label>`;
  const fld = (label, inner, cls = '') => `<label class="at-field sb-field ${cls}"><span>${label}</span>${inner}</label>`;

  // Generic editable rows: data-list="contrib.windfalls" data-i="0" data-f="who"
  const rText = (list, i, f, ph, max = 120) =>
    `<input class="at-input" type="text" maxlength="${max}" data-list="${list}" data-i="${i}" data-f="${f}" value="${esc(getPath(state, list)[i][f])}" placeholder="${esc(ph || '')}">`;
  const rDate = (list, i, f) =>
    `<input class="at-input" type="date" data-list="${list}" data-i="${i}" data-f="${f}" value="${esc(getPath(state, list)[i][f])}">`;
  const rNum = (list, i, f) =>
    `<input class="at-input" type="number" min="0" step="1" inputmode="numeric" data-list="${list}" data-i="${i}" data-f="${f}" data-num value="${getPath(state, list)[i][f] ?? ''}">`;
  const rSel = (list, i, f, pairs, ph) =>
    `<select class="at-input" data-list="${list}" data-i="${i}" data-f="${f}">${optionList(pairs, getPath(state, list)[i][f], ph ?? 'Choose…')}</select>`;
  const rRemove = (list, i) => `<button type="button" class="sb-btn sb-btn-quiet" data-remove-row="${list}:${i}">Remove</button>`;

  const ROW_TEMPLATES = {
    'contrib.events': () => ({ date: '', label: '', kind: '' }),
    'contrib.windfalls': () => ({ who: '', what: '', date: '', amount: null, used: '', note: '' }),
    'contrib.periods': () => ({ from: '', to: '', earn: '', care: '', home: '', note: '' }),
    'before.own': () => ({ q: '' }),
  };

  // ---------- Step 3: Contributions ----------
  const EVENT_KINDS = [['kids', 'Kids'], ['work', 'Work or career'], ['home', 'Home or move'], ['money', 'Money'], ['health', 'Health'], ['other', 'Other']];
  const WINDFALLS = [['inheritance', 'Inheritance'], ['gift', 'Gift from family'], ['redundancy', 'Redundancy or payout'], ['compensation', 'Compensation or insurance'], ['win', 'Lottery or prize'], ['other', 'Other']];
  const USED = [
    ['separate', 'Kept separate, still there'],
    ['home', 'Went into the home or mortgage'],
    ['family', 'Spent on the family or living costs'],
    ['mixed', 'Mixed in with joint money'],
    ['after', 'Received after separation'],
    ['unsure', 'Not sure'],
  ];
  const OTHER_CONTRIB = [
    ['deposit', 'Paid the deposit on the home'],
    ['reno', 'Renovations or building work on a property'],
    ['business', 'Worked in or for a family business, paid or unpaid'],
    ['career', 'Supported the other’s study, career or business'],
    ['carer', 'Cared for a family member (not your kids)'],
    ['debts', 'Paid off debts one person brought in'],
  ];

  function timelineListHTML() {
    const s = state.start;
    const auto = [
      [s.dates.together, 'Relationship started'],
      [s.dates.cohabit, 'Started living together'],
      [s.type === 'married' ? s.dates.married : '', 'Married'],
      [s.dates.separated, 'Separated'],
      [s.type === 'married' && s.divorce === 'order' ? s.dates.divorce : '', 'Divorce order took effect'],
    ].filter(([d]) => parseDate(d)).map(([d, l]) => ({ d, l, auto: true }));
    const own = state.contrib.events.map((e, i) => ({ d: e.date, l: e.label, i }));
    const all = [...auto, ...own.filter(e => parseDate(e.d))].sort((a, b) => a.d.localeCompare(b.d));
    const list = all.length
      ? `<ol class="sb-timeline">${all.map(e => `<li${e.auto ? ' class="is-auto"' : ''}><time>${fmtDate(parseDate(e.d))}</time><span>${esc(e.l || 'Untitled')}${e.auto ? ' <small>from Start</small>' : ''}</span></li>`).join('')}</ol>`
      : '<p class="sb-muted">Add your key dates in Start and they’ll appear here.</p>';
    return list;
  }

  function timelineHTML() {
    const rows = state.contrib.events.map((e, i) => `
      <div class="sb-row sb-row-event">
        ${fld('Date', rDate('contrib.events', i, 'date'))}
        ${fld('What happened', rText('contrib.events', i, 'label', 'e.g. First child born, I went part-time'), 'sb-grow')}
        ${fld('Kind', rSel('contrib.events', i, 'kind', EVENT_KINDS))}
        ${rRemove('contrib.events', i)}
      </div>`).join('');
    return `<div id="sb-tl">${timelineListHTML()}</div><div class="sb-rows">${rows}</div>
      <button type="button" class="sb-btn" data-add-row="contrib.events">Add an event</button>`;
  }

  function viewContrib() {
    const c = state.contrib;
    const windfalls = c.windfalls.map((w, i) => `
      <div class="sb-row sb-row-card">
        <div class="sb-row-grid">
          ${fld('Who received it', rSel('contrib.windfalls', i, 'who', WHO2))}
          ${fld('What', rSel('contrib.windfalls', i, 'what', WINDFALLS))}
          ${fld('When', rDate('contrib.windfalls', i, 'date'))}
          ${fld('Amount ($)', rNum('contrib.windfalls', i, 'amount'))}
          ${fld('What happened to it', rSel('contrib.windfalls', i, 'used', USED), 'sb-span2')}
        </div>
        ${fld('Note', rText('contrib.windfalls', i, 'note', 'e.g. $80k from Mum’s estate, paid off the mortgage in 2019', 200))}
        ${rRemove('contrib.windfalls', i)}
      </div>`).join('');

    const periods = c.periods.map((p, i) => `
      <div class="sb-row sb-row-card">
        <div class="sb-row-grid">
          ${fld('From', rDate('contrib.periods', i, 'from'))}
          ${fld('To', rDate('contrib.periods', i, 'to'))}
          ${fld('Mainly earned the income', rSel('contrib.periods', i, 'earn', WHO))}
          ${fld('Mainly cared for the kids', rSel('contrib.periods', i, 'care', WHO))}
          ${fld('Mainly ran the home', rSel('contrib.periods', i, 'home', WHO))}
        </div>
        ${fld('Note', rText('contrib.periods', i, 'note', 'e.g. I worked 3 days a week and did all school runs', 200))}
        ${rRemove('contrib.periods', i)}
      </div>`).join('');

    const other = OTHER_CONTRIB.map(([k, l]) => `
      <div class="sb-other-row"><span>${l}</span>${kSel('contrib.other.' + k, WHO, '—')}</div>`).join('');

    const fv = state.fv;
    const fvBody = fv.flag === 'yes' ? `
      <div class="sb-callout sb-info">
        <p>Since June 2025 the law says the court must consider the effect of family violence, including financial control, on what each person could contribute and on their circumstances now. It’s the <strong>effect</strong> that’s weighed, so a professional will want to understand what happened and what it changed.</p>
        <p>If you’re in danger, call <strong>000</strong>. For support any time: <strong>1800RESPECT, 1800 737 732</strong>. Family violence is also an exception to having to try mediation first.</p>
      </div>
      ${fld('Private note (optional)', kArea('fv.note', 'Only what helps you remember. You don’t need to write details here.'))}
      ${kCheck('fv.includeInBrief', 'Include this note in my printed brief')}
      <p class="sb-muted">Left unticked, your brief says only “Family violence: raise with my professional”.</p>` : '';

    return `
      <header class="sb-step-head">
        <div class="sb-step-num">Step 3 of 6</div>
        <h2>What each of you put in</h2>
        <p>The court looks back over the whole relationship: money, but also parenting, running the home and everything since you separated. This isn’t a receipts competition. A clear, factual story is what helps.</p>
      </header>

      <section class="sb-tile">
        <h3>Timeline</h3>
        <p class="sb-muted">The big moments: kids, moves, career changes, illness, redundancy. Dates can be approximate.</p>
        ${timelineHTML()}
      </section>

      <section class="sb-tile">
        <h3>What you each brought in</h3>
        <p class="sb-muted">Roughly what each of you owned and owed when you moved in together. Property, savings, super, debts.</p>
        <div class="sb-pair">
          <div class="sb-pair-col"><h4>Me</h4>
            ${fld('Value of what I brought in ($, net of debts)', kNum('contrib.start.me.amount'))}
            ${fld('What it was', kText('contrib.start.me.desc', 'e.g. Unit in Wollongong, $40k savings'))}</div>
          <div class="sb-pair-col"><h4>Them</h4>
            ${fld('Value of what they brought in ($, net of debts)', kNum('contrib.start.them.amount'))}
            ${fld('What it was', kText('contrib.start.them.desc', 'e.g. Car and a student debt'))}</div>
        </div>
      </section>

      <section class="sb-tile">
        <h3>Inheritances, gifts and windfalls</h3>
        <p class="sb-muted">When it arrived and what happened to it matter as much as the amount.</p>
        <div class="sb-rows">${windfalls}</div>
        <button type="button" class="sb-btn" data-add-row="contrib.windfalls">Add a windfall</button>
      </section>

      <section class="sb-tile">
        <h3>Who did what, over time</h3>
        <p class="sb-muted">Split the relationship into a few periods where things were roughly the same. Parenting and running the home are contributions in their own right, not a lesser kind.</p>
        <div class="sb-rows">${periods}</div>
        <button type="button" class="sb-btn" data-add-row="contrib.periods">Add a period</button>
        <h4 class="sb-subhead">Anything else either of you did?</h4>
        <div class="sb-other">${other}</div>
      </section>

      <section class="sb-tile">
        <h3>Since you separated</h3>
        <p class="sb-muted">Contributions keep counting after separation.</p>
        <div class="sb-row-grid">
          ${fld('Who lives in the home now', kSel('contrib.since.livesIn', [['me', 'Me'], ['them', 'Them'], ['both', 'Both of us, separated under one roof'], ['sold', 'It’s been sold'], ['na', 'Doesn’t apply']]))}
          ${fld('Who has paid the mortgage or rent on it', kSel('contrib.since.mortgage', WHO))}
          ${fld('Who has paid the joint debts', kSel('contrib.since.debts', WHO))}
          ${fld('Who has had the kids most nights', kSel('contrib.since.kids', [['me', 'Me'], ['them', 'Them'], ['both', 'About equal'], ['na', 'Doesn’t apply']]))}
        </div>
        ${fld('Note', kText('contrib.since.note', 'e.g. I’ve paid the full mortgage, $3,100 a month, since March 2025', 240))}
      </section>

      <section class="sb-tile sb-fv">
        <h3>Family violence</h3>
        <p class="sb-muted">Optional. Has family violence, including financial control, affected what you could contribute or where you are now?</p>
        <div class="sb-choices sb-choices-inline">
          <label class="sb-choice"><input type="radio" name="fv.flag" value="skip" data-k="fv.flag" ${fv.flag !== 'yes' && fv.flag !== 'no' ? 'checked' : ''}><span><strong>Prefer not to say</strong></span></label>
          <label class="sb-choice"><input type="radio" name="fv.flag" value="no" data-k="fv.flag" ${fv.flag === 'no' ? 'checked' : ''}><span><strong>No</strong></span></label>
          <label class="sb-choice"><input type="radio" name="fv.flag" value="yes" data-k="fv.flag" ${fv.flag === 'yes' ? 'checked' : ''}><span><strong>Yes</strong></span></label>
        </div>
        ${fvBody}
      </section>

      <aside class="sb-tile sb-wrong">
        <h3>What people get wrong about contributions</h3>
        <ul>
          <li><strong>Treating it like a ledger.</strong> Contributions are weighed broadly, not added up dollar for dollar.</li>
          <li><strong>Assuming what you brought in comes back in full.</strong> Its weight depends on timing, the length of the relationship and what happened to it.</li>
          <li><strong>Discounting the unpaid work.</strong> Years as the main carer or running the home are real contributions.</li>
          <li><strong>Forgetting the time since separation.</strong> Paying the mortgage alone or caring for the kids since the split counts too. Keep records.</li>
        </ul>
      </aside>`;
  }

  // ---------- Step 4: Circumstances ----------
  const WORK = [['full', 'Full-time'], ['part', 'Part-time'], ['casual', 'Casual'], ['self', 'Self-employed'], ['none', 'Not in paid work'], ['study', 'Studying'], ['unsure', 'Not sure']];
  const YNU = [['no', 'No'], ['yes', 'Yes'], ['unsure', 'Not sure']];
  const PARTNER = [['no', 'No'], ['live', 'Yes, living together'], ['notlive', 'Yes, not living together'], ['unsure', 'Not sure']];
  const CS = [['none', 'No child support'], ['pay', 'I pay child support'], ['receive', 'I receive child support'], ['notyet', 'Not assessed yet'], ['private', 'Private arrangement']];

  // Care bands by nights per fortnight (Services Australia: 2–4 regular, 5–9 shared, 10–12 primary, 13–14 above primary).
  function careBand(n) {
    if (n == null || n === '') return '';
    n = Number(n);
    if (n < 2) return 'Below regular care (under 14%)';
    if (n <= 4) return 'Regular care (14% to under 35%)';
    if (n <= 9) return 'Shared care (35% to 65%)';
    if (n <= 12) return 'Primary care (over 65% to 86%)';
    return 'Above primary care (over 86%)';
  }

  function careBandHTML() {
    const b = careBand(state.circ.kids.nights);
    return (b ? 'Care band: <strong>' + b + '</strong>. ' : '') +
      'Work it out exactly with the <a href="https://www.get-atlas.com.au/care-percentage-calculator/" target="_blank" rel="noopener">care percentage calculator</a>, and estimate child support with the <a href="https://www.get-atlas.com.au/csa-calculator/" target="_blank" rel="noopener">child support estimator</a>.';
  }

  function personCol(who) {
    const p = 'circ.' + who + '.';
    const c = state.circ[who];
    const label = who === 'me' ? 'Me' : 'Them <small class="sb-muted">(as far as you know)</small>';
    return `<div class="sb-pair-col"><h4>${label}</h4>
      ${fld('Age', kNum(p + 'age', 16, 100))}
      ${fld('Work now', kSel(p + 'work', WORK))}
      ${fld('Income before tax ($ a year)', kNum(p + 'income'))}
      ${fld('Health affects their ability to work', kSel(p + 'health', YNU)).replace('their', who === 'me' ? 'my' : 'their')}
      ${c.health === 'yes' ? `${fld('Health note (private)', kText(p + 'healthNote', 'Only what’s useful', 200))}${kCheck(p + 'healthInBrief', 'Include this note in my brief')}` : ''}
      ${fld('Career breaks or reduced hours during the relationship', kText(p + 'career', 'e.g. 6 years out of work, then part-time', 200))}
      ${fld('Supports anyone else financially', kSel(p + 'dependants', YNU))}
      ${fld('New partner', kSel(p + 'partner', PARTNER))}
    </div>`;
  }

  function viewCirc() {
    const k = state.circ.kids;
    const kidsCount = state.start.kids.length;
    return `
      <header class="sb-step-head">
        <div class="sb-step-num">Step 4 of 6</div>
        <h2>Where you each stand, now and ahead</h2>
        <p>Contributions look back. This looks forward: age, health, income, earning capacity, who cares for the kids and where they’ll live. The court weighs these. There’s no formula, and this tool doesn’t score them.</p>
      </header>

      <section class="sb-tile">
        <h3>You and them</h3>
        <p class="sb-muted">Fill in what you know. “Not sure” is a perfectly good answer for the other person.</p>
        <div class="sb-pair">${personCol('me')}${personCol('them')}</div>
      </section>

      <section class="sb-tile">
        <h3>The kids</h3>
        ${kidsCount ? `<p class="sb-muted">${kidsCount} child${kidsCount === 1 ? '' : 'ren'} under 18 from Start.</p>` : '<p class="sb-muted">No children added in Start. Skip this if it doesn’t apply.</p>'}
        <div class="sb-row-grid">
          ${fld('Nights with me, per fortnight', kNum('circ.kids.nights', 0, 14))}
          ${fld('Child support', kSel('circ.kids.cs', CS))}
          ${['pay', 'receive', 'private'].includes(k.cs) ? fld('Amount ($ a month)', kNum('circ.kids.csAmount')) : ''}
        </div>
        <p class="sb-muted" id="sb-care-band">${careBandHTML()}</p>
        ${fld('What housing do the kids need?', kArea('circ.kids.housing', 'e.g. 3 bedrooms, near their school in Thirroul, room for a carer’s visit'))}
        <p class="sb-muted">Since 2025 the law names children’s housing needs as something the court considers.</p>
      </section>

      <section class="sb-tile">
        <h3>What’s ahead</h3>
        ${fld('Known costs or changes coming up', kArea('circ.ahead', 'e.g. Retraining to return to work, a health procedure, a lease ending in March'))}
        ${fld('Anything else your professional should know', kArea('circ.other', ''))}
      </section>

      <aside class="sb-tile sb-wrong">
        <h3>What people get wrong about circumstances</h3>
        <ul>
          <li><strong>Thinking it’s all about the past.</strong> Future circumstances are weighed separately, and they can change the picture significantly.</li>
          <li><strong>Mixing it up with child support.</strong> Child support is a separate process through Services Australia. What’s payable is one factor here.</li>
          <li><strong>Assuming the higher earner always gives ground.</strong> Earning capacity is one factor among many.</li>
          <li><strong>Leaving out the other person’s new partner.</strong> A new partner’s financial situation can be relevant. So can yours.</li>
        </ul>
      </aside>`;
  }

  // ---------- Step 5: Before you meet ----------
  const lab = (pairs, v) => (pairs.find(([k]) => k === v) || [, ''])[1];
  const yearOf = d => (parseDate(d) ? parseDate(d).getFullYear() : '');
  const itemName = i => i.desc || (i.kind === 'super'
    ? (i.owner === 'them' ? 'their super' : i.owner === 'me' ? 'my super' : 'the super account')
    : typeLabel(i).toLowerCase().replace(/^/, 'the '));

  // Every question has a stable id so people can drop ones that don't fit.
  const qn = i => (i.desc ? '“' + i.desc + '”' : itemName(i));

  function questions() {
    const s = state.start, c = state.contrib, ci = state.circ;
    const q = [];
    const add = (id, group, text) => q.push({ id, group, text });
    const tl = timeLimit();

    // Urgent first
    if (tl && tl.by && tl.days < 0) add('tl-passed', 'Urgent', `My time limit passed on ${fmtDate(tl.by)}. What are my options for applying late, and what does the court look at?`);
    else if (tl && tl.by && tl.days <= 180) add('tl-soon', 'Urgent', `My time limit is ${fmtDate(tl.by)}. What needs to happen before then, and should anything be filed now to protect my position?`);
    if (s.urgent.assets) add('urgent-assets', 'Urgent', 'Property may be sold, moved or hidden. What can be done quickly to stop that?');
    if (s.urgent.safety || state.fv.flag === 'yes') add('fv', 'Urgent', 'How does family violence affect my process, including the exemption from mediation, and how are its effects considered in the settlement?');

    // Eligibility and process quirks
    if (s.type === 'defacto' && s.region === 'WA') add('wa', 'Process', 'As a de facto couple in WA, what’s different about my process and court?');
    if (s.type === 'defacto') {
      const st = parseDate(s.dates.cohabit) || parseDate(s.dates.together), sep = parseDate(s.dates.separated);
      if (st && sep && sep > st && yearsBetween(st, sep) < 2) add('df-2y', 'Process', 'Our relationship was under two years. Does it meet the requirements for the court to make property orders?');
    }

    // The pool
    const homes = state.items.filter(i => i.kind === 'asset' && i.type === 'home');
    if (homes.length) add('home-options', 'The pool', 'What are the realistic options for the home (sell, one of us buys the other out, or sell later), and what stamp duty, tax and refinancing costs come with each?');
    const shaky = state.items
      .filter(i => i.kind !== 'debt' && (i.value == null || i.basis === 'guess' || !i.basis) && !['contents', 'business', 'entity'].includes(i.type) && !['defined', 'smsf'].includes(i.superType))
      .sort((a, b) => num(b.value) - num(a.value)).slice(0, 3);
    for (const i of shaky) add('val-' + i.id, 'The pool', `What’s the best way to confirm the value of ${qn(i)}? Is an appraisal or statement enough, or does it need a formal valuation?`);
    for (const i of state.items.filter(i => i.kind === 'super' && i.owner === 'them' && !i.form6)) add('f6-' + i.id, 'The pool', `Should I send a Superannuation Information Request (Form 6) for ${qn(i)}?`);
    for (const i of state.items.filter(i => i.kind === 'super' && (i.superType === 'defined' || i.superType === 'smsf'))) add('sv-' + i.id, 'The pool', `How is ${qn(i)} (${i.superType === 'defined' ? 'defined benefit' : 'self-managed'}) valued, and does it need an expert?`);
    for (const i of state.items.filter(i => i.type === 'business')) add('biz-' + i.id, 'The pool', `Does ${qn(i)} need a professional valuation, who should do it, and who pays?`);
    for (const i of state.items.filter(i => i.type === 'entity')) add('ent-' + i.id, 'The pool', `How is ${qn(i)} treated, and what documents should I ask for?`);
    for (const i of state.items.filter(i => i.disputed)) add('dis-' + i.id, 'The pool', `We disagree about ${qn(i)}. How are disagreements like this usually resolved, for example with a jointly appointed valuer?`);
    for (const i of state.items.filter(i => i.kind === 'debt' && i.type === 'family')) add('fam-' + i.id, 'The pool', `Will ${qn(i)} be treated as a real debt, or as a gift? What evidence matters?`);
    for (const i of state.items.filter(i => i.kind === 'debt' && i.type === 'study')) add('help-' + i.id, 'The pool', `How will ${qn(i)} be treated?`);
    if (state.sinceSep.length) {
      const eg = state.sinceSep.find(r => r.desc)?.desc;
      add('sincesep', 'The pool', `Money has been spent, received or moved since separation${eg ? ` (for example: ${eg})` : ''}. How might that be weighed?`);
    }

    // Contributions
    const relYears = (() => { const a = parseDate(s.dates.cohabit) || parseDate(s.dates.together), b = parseDate(s.dates.separated); return a && b && b > a ? yearsBetween(a, b) : null; })();
    if (num(c.start.me.amount) >= 20000 || num(c.start.them.amount) >= 20000) add('start-assets', 'Contributions', `How is what we each brought in at the start considered${relYears != null ? ` after ${relYears} year${relYears === 1 ? '' : 's'} together` : ''}?`);
    c.windfalls.forEach((w, n) => {
      const what = (lab(WINDFALLS, w.what) || 'windfall').toLowerCase();
      const who = w.who === 'me' ? 'I' : w.who === 'them' ? 'they' : 'we';
      const yr = yearOf(w.date);
      const used = lab(USED, w.used);
      add('wf-' + n, 'Contributions', `How might the ${what} ${who} received${yr ? ' in ' + yr : ''} be considered${used ? `, given it was “${used.toLowerCase()}”` : ''}?`);
    });
    if (c.periods.some(p => p.care === 'me') || c.periods.some(p => p.home === 'me')) add('carer', 'Contributions', 'How are my years as the main carer or running the home considered alongside financial contributions?');
    if (c.since.mortgage === 'me' || c.since.debts === 'me') add('since-pay', 'Contributions', 'I’ve paid the mortgage or joint debts on my own since separation. How is that taken into account?');

    // Circumstances
    const inc = [ci.me.income, ci.them.income].map(v => (v == null || v === '' ? null : Number(v)));
    const gap = (inc[0] != null && inc[1] != null && Math.max(...inc) >= 2 * Math.max(1, Math.min(...inc)))
      || ['none', 'study'].includes(ci.me.work) !== ['none', 'study'].includes(ci.them.work) && (ci.me.work && ci.them.work && ci.them.work !== 'unsure');
    if (gap) {
      add('earning', 'Circumstances', 'There’s a big gap between our incomes or work situations. How does earning capacity come into it?');
      add('maint', 'Circumstances', 'Is spousal maintenance relevant for us, separate from property?');
    }
    if (ci.me.health === 'yes') add('health', 'Circumstances', 'How might my health, and its effect on my work, be considered?');
    if (s.kids.length || ci.kids.housing) add('housing', 'Circumstances', 'How are the kids’ housing needs considered, given the 2025 changes?');
    if (['live', 'notlive'].includes(ci.them.partner) || ['live', 'notlive'].includes(ci.me.partner)) add('partner', 'Circumstances', 'Is a new partner’s financial situation relevant here?');
    if (num(ci.me.age) >= 55) add('age', 'Circumstances', 'How does being closer to retirement affect things, especially with super?');

    // Process, always
    if (s.proceedings !== 'yes') {
      add('fdr', 'Process', 'Is mediation (Family Dispute Resolution) a good fit for us, and what will it cost?');
      add('disclose', 'Process', 'What disclosure do I need to give, and what should I ask them for?');
      add('formalise', 'Process', 'When we agree, should it be consent orders or a binding financial agreement, and what does each cost?');
    } else {
      add('next-court', 'Process', 'What are the next steps and dates in the court case, and what do you need from me?');
    }
    return q;
  }

  const STANDARD_DOCS = [
    ['tax', 'Tax returns and notices of assessment, last 3 years (both, if you can)'],
    ['pay', 'Recent payslips or business income records'],
    ['bank', 'Bank and offset statements, last 12 months'],
    ['cards', 'Credit card and loan statements'],
    ['superst', 'Latest super statement for every fund'],
    ['mortgage', 'Mortgage statement and payout figure'],
    ['rates', 'Council rates notice for each property'],
    ['rego', 'Car registration papers'],
    ['insure', 'Insurance policies (home, contents, life, income protection)'],
  ];

  function docsList() {
    const s = state.start;
    const list = STANDARD_DOCS.map(([k, l]) => ({ key: 'std-' + k, label: l, have: !!state.before.docs['std-' + k] }));
    if (s.type === 'married') list.push({ key: 'std-marriage', label: 'Marriage certificate', have: !!state.before.docs['std-marriage'] });
    if (s.type === 'married' && s.divorce === 'order') list.push({ key: 'std-divorce', label: 'Divorce certificate', have: !!state.before.docs['std-divorce'] });
    if (state.items.some(i => i.type === 'business' || i.type === 'entity')) list.push({ key: 'std-biz', label: 'Business or trust records: financial statements, tax returns, trust deed', have: !!state.before.docs['std-biz'] });
    if (state.contrib.windfalls.length) list.push({ key: 'std-windfall', label: 'Paperwork for inheritances, gifts or payouts (estate letters, transfer records)', have: !!state.before.docs['std-windfall'] });
    // One line per pool item: ticking it here ticks “I have the paperwork” on the item.
    for (const i of state.items) {
      const what = i.kind === 'super' ? 'statement' : i.kind === 'debt' ? 'statement or payout figure' : ['home', 'property'].includes(i.type) ? 'appraisal or valuation' : 'statement or valuation';
      list.push({ key: 'item-' + i.id, item: i.id, label: `${itemName(i)}: ${what}`, have: !!i.doc });
    }
    return list;
  }

  function viewBefore() {
    const b = state.before;
    const qs = questions();
    const groups = ['Urgent', 'The pool', 'Contributions', 'Circumstances', 'Process'];
    const qHTML = groups.map(g => {
      const rows = qs.filter(x => x.group === g);
      if (!rows.length) return '';
      return `<div class="sb-qgroup${g === 'Urgent' ? ' is-urgent' : ''}"><h4>${g}</h4><ul class="sb-qs">${rows.map(x => `
        <li class="${b.hidden[x.id] ? 'is-off' : ''}"><label class="sb-check"><input type="checkbox" data-q="${x.id}" ${b.hidden[x.id] ? '' : 'checked'}> <span>${esc(x.text)}</span></label></li>`).join('')}</ul></div>`;
    }).join('');
    const own = b.own.map((o, i) => `
      <div class="sb-row sb-row-own">
        ${fld('Your question', rText('before.own', i, 'q', 'e.g. Can I keep the car I need for work?', 240), 'sb-grow')}
        ${rRemove('before.own', i)}
      </div>`).join('');
    const docs = docsList();
    const have = docs.filter(d => d.have).length;
    return `
      <header class="sb-step-head">
        <div class="sb-step-num">Step 5 of 6</div>
        <h2>Before you meet a professional</h2>
        <p>Questions built from your answers, the documents to bring, and the steps that come before court. Paid time goes further when you walk in with these.</p>
      </header>

      <section class="sb-tile">
        <h3>Who you’re meeting</h3>
        <div class="sb-row-grid">
          ${fld('Your name (optional, shows on the brief)', kText('before.name', '', 80))}
          ${fld('Meeting with', kText('before.meeting', 'e.g. Mediator, family lawyer, Legal Aid', 80))}
          ${fld('Date', `<input class="at-input" type="date" data-k="before.meetingDate" value="${esc(b.meetingDate)}">`)}
        </div>
      </section>

      <section class="sb-tile">
        <div class="sb-group-head"><h3>Questions to ask</h3><span class="sb-group-total">${qs.filter(x => !b.hidden[x.id]).length + b.own.filter(o => o.q).length} in your brief</span></div>
        <p class="sb-muted">Untick any that don’t fit. These are questions, not answers: how each is weighed depends on your whole situation.</p>
        ${qHTML}
        <h4 class="sb-subhead">Your own questions</h4>
        <div class="sb-rows">${own}</div>
        <button type="button" class="sb-btn" data-add-row="before.own">Add a question</button>
      </section>

      <section class="sb-tile">
        <div class="sb-group-head"><h3>Documents</h3><span class="sb-group-total" id="sb-docs-count">${have} of ${docs.length} ready</span></div>
        <p class="sb-muted">Tick what you have. Items from your pool are linked: ticking one here ticks “I have the paperwork” there.</p>
        <ul class="sb-docs">${docs.map(d => `<li><label class="sb-check"><input type="checkbox" data-doc="${d.key}" ${d.item ? `data-doc-item="${d.item}"` : ''} ${d.have ? 'checked' : ''}> <span>${esc(d.label)}</span></label></li>`).join('')}</ul>
      </section>

      ${state.start.proceedings === 'yes' ? '' : `
      <section class="sb-tile sb-tile-cobalt">
        <h3>Before anyone goes to court</h3>
        <p class="sb-muted">Unless an exemption applies (urgency or family violence, for example), each of you is expected to:</p>
        <ol class="sb-steps-list">
          <li><strong>Exchange financial disclosure.</strong> Full and frank, both ways. It’s a legal duty, and it starts now.</li>
          <li><strong>Genuinely try to resolve it.</strong> Usually mediation through a Family Dispute Resolution practitioner.</li>
          <li><strong>Put your proposal in writing.</strong> If that doesn’t work, each of you sets out what you’re asking for before applying to court.</li>
        </ol>
        <p class="sb-muted">More: <a href="https://www.get-atlas.com.au/how-to-prepare-for-mediation-what-to-organise-in-the-week-before/" target="_blank" rel="noopener">how to prepare for mediation</a> · <a href="https://www.get-atlas.com.au/the-first-lawyer-appointment-how-to-use-it-without-burning-600-an-hour/" target="_blank" rel="noopener">using a first lawyer appointment well</a></p>
      </section>`}

      <aside class="sb-tile sb-wrong">
        <h3>What people get wrong before the meeting</h3>
        <ul>
          <li><strong>Paying to explain the basics.</strong> Bring the brief. Spend the hour on judgement, not paperwork.</li>
          <li><strong>Asking “what will I get?”</strong> A good professional won’t guess in the first meeting. Ask what will affect it and what to do next.</li>
          <li><strong>Leaving it informal.</strong> Whatever you agree, make it binding with consent orders or a binding financial agreement.</li>
        </ul>
      </aside>`;
  }

  // ---------- Step 6: The brief ----------
  function td(v) { return `<td>${v === '' || v == null ? '<span class="sb-dash">—</span>' : v}</td>`; }

  function briefHTML() {
    const s = state.start, c = state.contrib, ci = state.circ, b = state.before;
    const t = poolTotals();
    const tl = timeLimit();
    const d = x => (parseDate(x) ? fmtDate(parseDate(x)) : '');
    const yes = v => (v ? 'Yes' : 'No');
    const empty = msg => `<p class="sb-doc-empty">${msg || 'Not filled in yet.'}</p>`;
    const backedShare = t.gross ? Math.round((t.backed / t.gross) * 100) : 0;
    const qs = questions().filter(x => !b.hidden[x.id]).map(x => x.text).concat(b.own.map(o => o.q).filter(Boolean));
    const docsNeeded = docsList().filter(x => !x.have).map(x => x.label);
    const gaps = poolGaps();

    const itemRows = kind => state.items.filter(i => i.kind === kind).map(i => `<tr>
      ${td(esc(itemName(i)))}${kind === 'super' ? td(lab(SUPER_TYPES, i.superType)) : td(esc(typeLabel(i)))}${td(lab(OWNERS, i.owner))}
      ${td(i.value == null ? '' : money(i.value))}${td(lab(BASES, i.basis))}${td(d(i.asAt))}${td(yes(i.doc))}
      ${kind === 'super' ? td(yes(i.form6)) : ''}${td((i.disputed ? '<strong>Disputed.</strong> ' : '') + esc(i.note))}</tr>`).join('');
    const sub = (kind, n) => {
      const total = state.items.filter(i => i.kind === kind).reduce((a, i) => a + num(i.value), 0);
      return `<tr class="sb-doc-sub"><td colspan="3">Total</td><td>${money(total)}</td><td colspan="${n - 4}"></td></tr>`;
    };
    const table = (kind, title) => {
      const rows = itemRows(kind);
      const heads = ['Item', kind === 'super' ? 'Kind of fund' : 'Type', 'Whose name', kind === 'debt' ? 'Owed' : 'Value', 'Based on', 'As at', 'Paperwork'].concat(kind === 'super' ? ['Form 6 sent'] : []).concat(['Note']);
      return `<h3>${title}</h3>${rows ? `<table class="sb-doc-table"><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}${sub(kind, heads.length)}</tbody></table>` : empty('None listed.')}`;
    };

    const timeline = (() => {
      const auto = [[s.dates.together, 'Relationship started'], [s.dates.cohabit, 'Started living together'], [s.type === 'married' ? s.dates.married : '', 'Married'], [s.dates.separated, 'Separated'], [s.type === 'married' && s.divorce === 'order' ? s.dates.divorce : '', 'Divorce order took effect']];
      const all = auto.concat(c.events.map(e => [e.date, e.label])).filter(([x]) => parseDate(x)).sort((a, b2) => a[0].localeCompare(b2[0]));
      return all.length ? `<table class="sb-doc-table sb-doc-2col"><tbody>${all.map(([x, l]) => `<tr><td>${d(x)}</td><td>${esc(l)}</td></tr>`).join('')}</tbody></table>` : empty();
    })();

    const fvLine = state.fv.flag === 'yes'
      ? (state.fv.includeInBrief && state.fv.note ? `<p><strong>Family violence:</strong> ${esc(state.fv.note)}</p>` : '<p><strong>Family violence:</strong> to raise with my professional.</p>')
      : '';

    const person = who => {
      const p = ci[who];
      return [
        ['Age', p.age ?? ''], ['Work now', lab(WORK, p.work)], ['Income before tax', p.income == null || p.income === '' ? '' : money(p.income) + ' a year'],
        ['Health affects work', lab(YNU, p.health) + (p.health === 'yes' && p.healthInBrief && p.healthNote ? ': ' + esc(p.healthNote) : '')],
        ['Career breaks or reduced hours', esc(p.career)], ['Supports others financially', lab(YNU, p.dependants)], ['New partner', lab(PARTNER, p.partner)],
      ];
    };
    const me = person('me'), them = person('them');

    return `
      <article class="sb-doc" id="sb-doc">
        <header class="sb-doc-head">
          <div class="sb-doc-brand">Atlas<b>.</b> Settlement Brief</div>
          <h1>${b.name ? esc(b.name) + '’s settlement brief' : 'Settlement brief'}</h1>
          <p>Prepared ${fmtDate(today())}${b.meeting ? ' for ' + esc(b.meeting) : ''}${parseDate(b.meetingDate) ? ', meeting on ' + d(b.meetingDate) : ''}. Figures are the preparer’s own estimates unless a source is shown. This is practical organisation, not legal or financial advice.</p>
        </header>

        <section class="sb-doc-sec sb-doc-summary">
          <h2>1. Summary</h2>
          <div class="sb-doc-grid">
            <div><h3>The relationship</h3>
              <dl>
                <dt>Type</dt><dd>${s.type === 'married' ? 'Married' : s.type === 'defacto' ? 'De facto' : '—'}${s.region ? ', ' + s.region : ''}</dd>
                <dt>Living together from</dt><dd>${d(s.dates.cohabit) || d(s.dates.together) || '—'}</dd>
                ${s.type === 'married' ? `<dt>Married</dt><dd>${d(s.dates.married) || '—'}</dd>` : ''}
                <dt>Separated</dt><dd>${d(s.dates.separated) || '—'}</dd>
                ${s.type === 'married' ? `<dt>Divorce</dt><dd>${s.divorce === 'order' ? 'Order took effect ' + (d(s.dates.divorce) || '') : s.divorce === 'applied' ? 'Applied, waiting' : s.divorce === 'none' ? 'Not applied' : '—'}</dd>` : ''}
                <dt>Time limit</dt><dd>${tl && tl.by ? (tl.days < 0 ? '<strong>Passed ' + fmtDate(tl.by) + '</strong>' : 'Apply by <strong>' + fmtDate(tl.by) + '</strong> (' + tl.days + ' days)') : tl && tl.pending === 'married' ? 'Starts when a divorce order takes effect' : '—'}</dd>
                <dt>Children under 18</dt><dd>${s.kids.length ? s.kids.map(k => (k.age ?? '?')).join(', ') + ' (ages)' : 'None listed'}</dd>
                <dt>Court case started</dt><dd>${lab([['no', 'No'], ['yes', 'Yes'], ['unsure', 'Not sure']], s.proceedings) || '—'}</dd>
              </dl>
              ${s.urgent.assets || s.urgent.safety ? `<p class="sb-doc-flag">Flagged: ${[s.urgent.assets ? 'property may be sold, moved or hidden' : '', s.urgent.safety ? 'safety concerns' : ''].filter(Boolean).join('; ')}.</p>` : ''}
            </div>
            <div><h3>The pool</h3>
              <p class="sb-doc-big">${money(t.pool)}</p>
              <dl>
                <dt>Assets</dt><dd>${money(t.assets)}</dd>
                <dt>Super</dt><dd>${money(t.sup)}</dd>
                <dt>Debts</dt><dd>${money(-t.debts)}</dd>
                <dt>Property after mortgage</dt><dd>${money(t.homeNet)}</dd>
                <dt>Backed by paperwork</dt><dd>${backedShare}% of the dollar value</dd>
                <dt>Open gaps</dt><dd>${gaps.length}</dd>
              </dl>
            </div>
          </div>
          ${qs.length ? `<h3>Top questions</h3><ol>${qs.slice(0, 5).map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
        </section>

        <section class="sb-doc-sec">
          <h2>2. Assets, super and debts</h2>
          <p class="sb-doc-note">Everything owned or owed by either person, in either name. Whose name an item is in doesn’t decide who keeps it.</p>
          ${table('asset', 'Property and assets')}
          ${table('super', 'Super')}
          ${table('debt', 'Debts')}
          <h3>Since separation</h3>
          ${state.sinceSep.length ? `<table class="sb-doc-table"><thead><tr><th>Date</th><th>What</th><th>Kind</th><th>Whose money</th><th>Amount</th></tr></thead><tbody>${state.sinceSep.map(r => `<tr>${td(d(r.date))}${td(esc(r.desc))}${td(lab([['spent', 'Spent'], ['received', 'Received'], ['sold', 'Sold or given away']], r.kind))}${td(lab([['me', 'Me'], ['them', 'Them'], ['joint', 'Joint money']], r.who))}${td(r.amount == null ? '' : money(r.amount))}</tr>`).join('')}</tbody></table>` : empty('Nothing logged.')}
        </section>

        <section class="sb-doc-sec">
          <h2>3. Contributions</h2>
          <h3>Timeline</h3>${timeline}
          <h3>What each person brought in</h3>
          <table class="sb-doc-table"><thead><tr><th></th><th>Value (net)</th><th>What it was</th></tr></thead><tbody>
            <tr><td>Me</td>${td(c.start.me.amount == null ? '' : money(c.start.me.amount))}${td(esc(c.start.me.desc))}</tr>
            <tr><td>Them</td>${td(c.start.them.amount == null ? '' : money(c.start.them.amount))}${td(esc(c.start.them.desc))}</tr>
          </tbody></table>
          <h3>Inheritances, gifts and windfalls</h3>
          ${c.windfalls.length ? `<table class="sb-doc-table"><thead><tr><th>Who</th><th>What</th><th>When</th><th>Amount</th><th>What happened to it</th><th>Note</th></tr></thead><tbody>${c.windfalls.map(w => `<tr>${td(lab(WHO2, w.who))}${td(lab(WINDFALLS, w.what))}${td(d(w.date))}${td(w.amount == null ? '' : money(w.amount))}${td(lab(USED, w.used))}${td(esc(w.note))}</tr>`).join('')}</tbody></table>` : empty('None listed.')}
          <h3>Who did what, over time</h3>
          ${c.periods.length ? `<table class="sb-doc-table"><thead><tr><th>From</th><th>To</th><th>Mainly earned</th><th>Mainly cared for kids</th><th>Mainly ran the home</th><th>Note</th></tr></thead><tbody>${c.periods.map(p => `<tr>${td(d(p.from))}${td(d(p.to))}${td(lab(WHO, p.earn))}${td(lab(WHO, p.care))}${td(lab(WHO, p.home))}${td(esc(p.note))}</tr>`).join('')}</tbody></table>` : empty('No periods added.')}
          ${OTHER_CONTRIB.some(([k]) => c.other[k] && c.other[k] !== 'na') ? `<h3>Other contributions</h3><ul>${OTHER_CONTRIB.filter(([k]) => c.other[k] && c.other[k] !== 'na').map(([k, l]) => `<li>${l}: <strong>${lab(WHO, c.other[k])}</strong></li>`).join('')}</ul>` : ''}
          <h3>Since separation</h3>
          <dl class="sb-doc-dl">
            <dt>Living in the home</dt><dd>${lab([['me', 'Me'], ['them', 'Them'], ['both', 'Both, under one roof'], ['sold', 'Sold'], ['na', 'Doesn’t apply']], c.since.livesIn) || '—'}</dd>
            <dt>Paying the mortgage or rent</dt><dd>${lab(WHO, c.since.mortgage) || '—'}</dd>
            <dt>Paying joint debts</dt><dd>${lab(WHO, c.since.debts) || '—'}</dd>
            <dt>Kids most nights</dt><dd>${lab([['me', 'Me'], ['them', 'Them'], ['both', 'About equal'], ['na', 'Doesn’t apply']], c.since.kids) || '—'}</dd>
          </dl>
          ${c.since.note ? `<p>${esc(c.since.note)}</p>` : ''}
          ${fvLine}
        </section>

        <section class="sb-doc-sec">
          <h2>4. Circumstances now and ahead</h2>
          <table class="sb-doc-table sb-doc-3col"><thead><tr><th></th><th>Me</th><th>Them (as far as I know)</th></tr></thead><tbody>
            ${me.map(([l, v], n) => `<tr><td>${l}</td>${td(v)}${td(them[n][1])}</tr>`).join('')}
          </tbody></table>
          <h3>The kids</h3>
          <dl class="sb-doc-dl">
            <dt>Nights with me per fortnight</dt><dd>${ci.kids.nights ?? '—'}${careBand(ci.kids.nights) ? ' (' + careBand(ci.kids.nights) + ')' : ''}</dd>
            <dt>Child support</dt><dd>${lab(CS, ci.kids.cs) || '—'}${ci.kids.csAmount != null && ['pay', 'receive', 'private'].includes(ci.kids.cs) ? ', ' + money(ci.kids.csAmount) + ' a month' : ''}</dd>
          </dl>
          ${ci.kids.housing ? `<p><strong>Housing needs:</strong> ${esc(ci.kids.housing)}</p>` : ''}
          ${ci.ahead ? `<p><strong>Coming up:</strong> ${esc(ci.ahead)}</p>` : ''}
          ${ci.other ? `<p><strong>Also:</strong> ${esc(ci.other)}</p>` : ''}
        </section>

        <section class="sb-doc-sec">
          <h2>5. Questions</h2>
          ${qs.length ? `<ol>${qs.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : empty()}
          <h2>6. Documents still needed</h2>
          ${docsNeeded.length ? `<ul class="sb-doc-checks">${docsNeeded.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : empty('All ticked.')}
        </section>

        <footer class="sb-doc-foot">Prepared with the free Atlas Settlement Brief (app.get-atlas.com.au/property) by the person named, using their own information and estimates. It organises the facts; it doesn’t predict an outcome or give legal or financial advice. For advice, see a family lawyer or an accredited Family Dispute Resolution practitioner.</footer>
      </article>`;
  }

  function viewBrief() {
    return `
      <header class="sb-step-head">
        <div class="sb-step-num">Step 6 of 6</div>
        <h2>Your brief</h2>
        <p>Everything in one document. Print it or save it as a PDF from the print window, and bring it to your meeting. Sensitive notes stay out unless you chose to include them.</p>
      </header>
      <section class="sb-tile sb-brief-actions">
        <button type="button" class="sb-btn sb-btn-primary" id="sb-print">Print or save as PDF</button>
        <button type="button" class="sb-btn sb-btn-ghost" id="sb-save-2">Save file to keep working later</button>
        <p class="sb-muted">Printing happens on your device. Nothing is uploaded.</p>
      </section>
      ${briefHTML()}`;
  }

  // ---------- Completion (drives the step list ticks) ----------
  function stepDone(id) {
    const s = state.start;
    if (id === 'start') return !!(s.type && parseDate(s.dates.separated));
    if (id === 'pool') return state.items.some(i => i.value != null);
    if (id === 'contrib') { const c = state.contrib; return !!(c.events.length || c.windfalls.length || c.periods.length || c.start.me.amount != null || c.since.mortgage); }
    if (id === 'before') return !!state.before.visited;
    if (id === 'brief') return !!state.before.printed;
    if (id === 'circ') { const c = state.circ; return !!(c.me.age != null && c.me.age !== '' && c.me.work); }
    return false;
  }

  // ---------- Render ----------
  function renderStepList() {
    $('#sb-step-list').innerHTML = STEPS.map((s, i) => `
      <li><button type="button" class="sb-step-link${s.id === current ? ' is-current' : ''}${stepDone(s.id) ? ' is-done' : ''}" data-step="${s.id}" ${s.id === current ? 'aria-current="step"' : ''}>
        <span class="sb-step-dot" aria-hidden="true">${stepDone(s.id) ? '✓' : i + 1}</span>
        <span><strong>${s.label}</strong><small>${s.hint}</small></span>
      </button></li>`).join('');
  }

  function navHTML() {
    const i = STEPS.findIndex(s => s.id === current);
    const prev = STEPS[i - 1], next = STEPS[i + 1];
    return `<div class="sb-nav">
      ${prev ? `<button type="button" class="sb-btn sb-btn-ghost" data-step="${prev.id}">← ${prev.label}</button>` : '<span></span>'}
      ${next ? `<button type="button" class="sb-btn sb-btn-primary" data-step="${next.id}">Next: ${next.label} →</button>` : ''}
    </div>`;
  }

  function render() {
    const main = $('#sb-main');
    const views = { start: viewStart, pool: viewPool, contrib: viewContrib, circ: viewCirc, before: viewBefore, brief: viewBrief };
    main.innerHTML = (views[current] ? views[current]() : viewComing(current)) + navHTML();
    renderStepList();
    renderStorage();
  }

  function refreshDerived() {
    const tl = $('#sb-timelimit');
    if (tl) tl.innerHTML = timeLimitHTML();
    const notes = $('#sb-notes');
    if (notes) notes.innerHTML = notesHTML();
    const band = $('#sb-care-band');
    if (band) band.innerHTML = careBandHTML();
  }

  function go(step) {
    current = step;
    if (step === 'before' && !state.before.visited) { state.before.visited = true; persist(); }
    render();
    $('#sb-main').focus({ preventScroll: true });
    window.scrollTo({ top: $('.sb-layout').offsetTop - 12, behavior: 'smooth' });
  }

  // ---------- Events ----------
  // Fields that change which questions show need a full re-render; the rest update derived panels only.
  const STRUCTURAL = new Set(['start.type', 'start.divorce', 'fv.flag', 'circ.me.health', 'circ.them.health', 'circ.kids.cs']);
  const numVal = el => {
    if (el.value === '') return null;
    let n = Math.max(Number(el.min) || 0, Math.round(Number(el.value)) || 0);
    if (el.max !== '') n = Math.min(Number(el.max), n);
    return n;
  };

  document.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.k && el.type !== 'radio' && el.type !== 'checkbox') {
      setPath(state, el.dataset.k, el.dataset.num !== undefined ? numVal(el) : el.value);
      persist();
      if (STRUCTURAL.has(el.dataset.k) && el.tagName === 'SELECT') rerender(`[data-k="${el.dataset.k}"]`);
      else refreshDerived();
    } else if (el.dataset.list) {
      const row = getPath(state, el.dataset.list)[Number(el.dataset.i)];
      if (!row) return;
      row[el.dataset.f] = el.dataset.num !== undefined ? numVal(el) : el.value;
      persist();
      const tl = $('#sb-tl');
      if (tl && el.dataset.list === 'contrib.events') tl.innerHTML = timelineListHTML();
    } else if (el.dataset.item && el.type !== 'checkbox' && el.tagName !== 'SELECT') {
      const it = state.items.find(i => i.id === el.dataset.item);
      if (!it) return;
      const f = el.dataset.f;
      it[f] = f === 'value' ? (el.value === '' ? null : Math.max(0, Math.round(Number(el.value)) || 0)) : el.value;
      persist();
      refreshPool();
    } else if (el.dataset.ss !== undefined && el.tagName !== 'SELECT') {
      const r = state.sinceSep[Number(el.dataset.ss)];
      const f = el.dataset.f;
      r[f] = f === 'amount' ? (el.value === '' ? null : Math.max(0, Math.round(Number(el.value)) || 0)) : el.value;
      persist();
    } else if (el.dataset.kid !== undefined) {
      const n = el.value === '' ? null : Math.max(0, Math.min(17, Math.round(Number(el.value))));
      state.start.kids[Number(el.dataset.kid)].age = Number.isFinite(n) ? n : null;
      persist();
    }
  });

  document.addEventListener('change', e => {
    const el = e.target;
    if (el.id === 'sb-keep') return setKeep(el.checked);
    if (el.id === 'sb-file') { if (el.files[0]) openFile(el.files[0]); el.value = ''; return; }
    if (el.dataset.q) {
      if (el.checked) delete state.before.hidden[el.dataset.q];
      else state.before.hidden[el.dataset.q] = true;
      persist();
      rerender(`[data-q="${el.dataset.q}"]`);
      return;
    }
    if (el.dataset.doc) {
      if (el.dataset.docItem) {
        const it = state.items.find(i => i.id === el.dataset.docItem);
        if (it) it.doc = el.checked;
      } else {
        state.before.docs[el.dataset.doc] = el.checked;
      }
      persist();
      const docs = docsList(), cnt = $('#sb-docs-count');
      if (cnt) cnt.textContent = docs.filter(d => d.have).length + ' of ' + docs.length + ' ready';
      return;
    }
    if (el.dataset.item && (el.type === 'checkbox' || el.tagName === 'SELECT')) {
      const it = state.items.find(i => i.id === el.dataset.item);
      if (!it) return;
      it[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value;
      persist();
      if (el.dataset.f === 'type') rerender(`[data-item="${it.id}"][data-f="type"]`);
      else refreshPool();
      return;
    }
    if (el.dataset.ss !== undefined && el.tagName === 'SELECT') {
      state.sinceSep[Number(el.dataset.ss)][el.dataset.f] = el.value;
      persist();
      return;
    }
    if (!el.dataset.k) return;
    if (el.type === 'radio') setPath(state, el.dataset.k, el.value);
    else if (el.type === 'checkbox') setPath(state, el.dataset.k, el.checked);
    else return; // text, date and select are handled on input
    persist();
    if (STRUCTURAL.has(el.dataset.k)) {
      const y = window.scrollY;
      render();
      window.scrollTo(0, y);
      const again = $(`[data-k="${el.dataset.k}"][value="${el.value}"]`);
      if (again) again.focus({ preventScroll: true });
    } else {
      refreshDerived();
    }
  });

  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) return go(step.dataset.step);
    if (e.target.id === 'sb-add-kid') {
      state.start.kids.push({ age: null });
      persist();
      render();
      const ages = $$('.sb-age');
      ages[ages.length - 1]?.focus();
      return;
    }
    const rm = e.target.closest('[data-remove-kid]');
    if (rm) {
      state.start.kids.splice(Number(rm.dataset.removeKid), 1);
      persist();
      render();
      return;
    }
    const addRow = e.target.closest('[data-add-row]');
    if (addRow) {
      const list = getPath(state, addRow.dataset.addRow);
      list.push(ROW_TEMPLATES[addRow.dataset.addRow]());
      persist();
      rerender(`[data-list="${addRow.dataset.addRow}"][data-i="${list.length - 1}"]`);
      return;
    }
    const rmRow = e.target.closest('[data-remove-row]');
    if (rmRow) {
      const [path, i] = rmRow.dataset.removeRow.split(':');
      getPath(state, path).splice(Number(i), 1);
      persist();
      rerender();
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const [kind, type] = add.dataset.add.split(':');
      const it = addItem(kind, type);
      persist();
      rerender(`[data-item="${it.id}"][data-f="desc"]`);
      return;
    }
    const rmi = e.target.closest('[data-remove-item]');
    if (rmi) {
      const it = state.items.find(i => i.id === rmi.dataset.removeItem);
      const named = it && (it.desc || it.value != null);
      if (named && !confirm('Remove ' + (it.desc || typeLabel(it)) + ' from your list?')) return;
      state.items = state.items.filter(i => i.id !== rmi.dataset.removeItem);
      persist();
      rerender();
      return;
    }
    const sw = e.target.closest('[data-sweep]');
    if (sw) {
      const [k, action] = sw.dataset.sweep.split(':');
      const def = SWEEP.find(x => x[0] === k);
      state.poolChecked ||= {};
      if (action === 'undo') delete state.poolChecked[k];
      else if (action === 'na') state.poolChecked[k] = 'na';
      else if (action === 'log') {
        state.poolChecked[k] = 'logged';
        state.sinceSep.push({ date: '', desc: '', kind: 'sold', who: '', amount: null });
        persist();
        rerender(`[data-ss="${state.sinceSep.length - 1}"][data-f="desc"]`);
        return;
      } else {
        const [kind, type] = def[3];
        const it = addItem(kind, type);
        if (k === 'theirsuper') { it.owner = 'them'; it.basis = 'guess'; }
        if (k === 'oldsuper') it.owner = 'me';
        if (k === 'defined') it.superType = 'defined';
        if (k === 'smsf') it.superType = 'smsf';
        if (k === 'empshares') it.desc = 'Employee shares';
        if (k === 'toys') it.desc = '';
        state.poolChecked[k] = 'added';
        persist();
        rerender(`[data-item="${it.id}"][data-f="desc"]`);
        return;
      }
      persist();
      rerender();
      return;
    }
    if (e.target.id === 'sb-add-ss') {
      state.sinceSep.push({ date: '', desc: '', kind: 'spent', who: '', amount: null });
      persist();
      rerender(`[data-ss="${state.sinceSep.length - 1}"][data-f="date"]`);
      return;
    }
    const rss = e.target.closest('[data-remove-ss]');
    if (rss) {
      state.sinceSep.splice(Number(rss.dataset.removeSs), 1);
      persist();
      rerender();
      return;
    }
    if (e.target.id === 'sb-save' || e.target.id === 'sb-save-2') return saveFile();
    if (e.target.id === 'sb-print') {
      state.before.printed = true;
      persist();
      window.print();
      return;
    }
    if (e.target.id === 'sb-open') return $('#sb-file').click();
    if (e.target.id === 'sb-forget') return forget();
  });

  window.addEventListener('beforeunload', e => {
    if (!keep && dirty && hasData()) { e.preventDefault(); e.returnValue = ''; }
  });

  // ---------- Boot ----------
  loadKept();
  render();

  // Exposed for tests only.
  window.SettlementBrief = { addMonths, parseDate, timeLimit, poolTotals, poolGaps, careBand, questions, docsList, get state() { return state; }, set state(v) { state = v; } };
})();
