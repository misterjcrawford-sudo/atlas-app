/* Atlas demo: fictional households.
   Runs straight after demo-shim.js, so every write lands in the sandbox.
   Two personas: Marcus (default) and Priya. Pick with /demo/?who=priya.
   All dates are computed from today, so the demo never goes stale.

   Marcus: separated about 8 months, Stabilise. Kids Ruby (9) and Ollie (6). Week-about, Wednesday handover.
           Pays child support. Back to a small monthly surplus.
   Priya:  separated about 10 months, Stabilise. Kids Mia (8) and Theo (5). Primary carer, alternate weekends away.
           Receives child support and Family Tax Benefit. Staying in the family home, paying the mortgage.

   These are not real people. Never use the names of anyone's actual children here. */
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  let who = (params.get('who') || '').toLowerCase();
  if (who && who !== 'marcus' && who !== 'priya') who = '';

  // Switching persona (or ?reset) wipes the sandbox first, then reseeds.
  if (who || params.has('reset')) {
    const current = localStorage.getItem('atlas_demo_persona');
    if (params.has('reset') || (who && who !== current)) localStorage.clear();
  }
  if (localStorage.getItem('atlas_phase') && localStorage.getItem('atlas_demo_persona')) return; // already seeded this tab

  const persona = who || localStorage.getItem('atlas_demo_persona') || 'marcus';

  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const day = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  const monthsAgo = (m, dom) => { const d = new Date(today.getFullYear(), today.getMonth() - m, 1, 12); d.setDate(Math.min(dom, 28)); return d; };
  const weekday = d => (d.getDay() + 6) % 7; // Monday = 0, as Week stores it
  const mostRecent = (wd, from = 0) => { let n = from; while (weekday(day(n)) !== wd) n--; return day(n); };
  const nextWeekday = wd => { let n = 1; while (weekday(day(n)) !== wd) n++; return day(n); };
  const set = (k, v) => localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  const both = (k, v) => { set('atlas_' + k, v); };

  const P = {
    marcus: {
      phase: 'stabilise',
      kids: [{ name: 'Ruby', age: 9, colorIdx: 0 }, { name: 'Ollie', age: 6, colorIdx: 1 }],
      cycle: { preset: 'week-about', pattern: [1,1,1,1,1,1,1,0,0,0,0,0,0,0], anchor: mostRecent(2) }, // Wednesday handover, today is in his week
      budget: {
        grossSalary: 100000, salaryInputMode: 'annual', salarySacrifice: 0, ftbMonthly: 0, csReceived: 0, csOut: 490, csMode: 'paying',
        'kids-costs': [{ id: 'kids-food', val: 380 }, { id: 'kids-childcare', val: 190 }, { id: 'kids-pocket', val: 30 }, { id: 'kids-gifts', val: 60 }],
        shared: [{ id: 'kids-school', val: 90 }, { id: 'kids-activities', val: 120 }, { id: 'kids-clothing', val: 80 }, { id: 'kids-medical', val: 60 }, { id: 'shared-health', val: 110 }],
        housing: [{ id: 'rent', val: 2600 }, { id: 'utilities', val: 250 }, { id: 'internet', val: 80 }, { id: 'phone', val: 65 }, { id: 'insurance-home', val: 45 }, { id: 'fuel', val: 150 }, { id: 'car-insurance', val: 160 }],
        personal: [{ id: 'groceries', val: 420 }, { id: 'personal-health', val: 70 }, { id: 'clothing-self', val: 90 }, { id: 'gym', val: 55 }, { id: 'dining', val: 200 }],
        subs: [{ id: 'streaming1', val: 23 }, { id: 'streaming2', val: 13 }, { id: 'software', val: 20 }, { id: 'cloud', val: 3 }],
        savings: [{ id: 'emergency', val: 300, balance: 3500 }, { id: 'general', val: 100, balance: 900 }],
      },
      costs: [
        { label: 'Legal / Solicitor', pay: [[7, 12, 1200, 'Initial advice and letter to the other side'], [6, 3, 1200, 'Letter and follow-up']] },
        { label: 'Mediation', pay: [[5, 9, 900, 'Session 1'], [4, 20, 900, 'Session 2']] },
        { label: 'Setting up new home', pay: [[8, 2, 2400, 'Rental bond'], [7, 18, 380, 'Second-hand bunk beds'], [7, 20, 240, 'Booster seats x2']] },
        { label: 'Moving costs', pay: [[8, 1, 650, 'Removalists']] },
      ],
      bills: [
        { name: 'Rent', amount: 2600, repeat: 'monthly', due: iso(day(6)) },
        { name: 'Child support', amount: 490, repeat: 'monthly', due: iso(day(2)) },
        { name: 'Electricity', amount: 250, repeat: 'quarterly', due: iso(day(11)) },
        { name: 'Car rego', amount: 880, repeat: 'yearly', due: iso(day(24)) },
      ],
      admin: { f: 17, d: 14, b: 13, g: 3, h: 4, k: 6 },
      events: () => {
        const e = [];
        [0, 1, 2, 3, 4].forEach(d => e.push({ day: d, time: '08:20', text: 'School drop-off', who: 'both', repeat: 'kids' }));
        e.push({ day: 1, time: '16:00', text: 'Soccer training', who: 'child2', repeat: 'kids' });
        e.push({ day: 3, time: '16:30', text: 'Swimming lesson', who: 'child1', repeat: 'kids' });
        e.push({ day: 5, time: '09:00', text: 'Netball', who: 'child1', repeat: 'kids' });
        return e;
      },
      dates: () => [
        { date: iso(nextWeekday(3)), label: 'Ruby: school assembly', type: 'school' },
        { date: iso(day(18)), label: 'Parent-teacher interviews', type: 'school' },
        { date: iso(day(40)), label: 'Ollie: school concert', type: 'school' },
      ],
      tasks: ['Book the car service', 'Plan next week’s dinners', 'Ask school for a second copy of the newsletter'],
      records: [
        ['handover', 21, 'Handover moved a day for the school camp', 'Agreed by text, back to normal the week after.', null, null],
        ['communication', 17, 'Agreed who pays for the school excursion', 'Split 50/50. Confirmed by email.', null, null],
        ['cost', 15, 'School excursion', 'Ruby. Paid up front, half owed back.', 85, 'me'],
        ['cost', 9, 'Ollie’s dentist', 'Check-up and clean.', 140, 'me'],
        ['communication', 5, 'Swapped weekend for Ruby’s birthday party', 'Text thread, both happy.', null, null],
        ['cost', 3, 'Soccer boots', 'Ollie. Paid by the other parent.', 70, 'them'],
      ],
      goals: null,
    },
    priya: {
      phase: 'stabilise',
      kids: [{ name: 'Mia', age: 8, colorIdx: 2 }, { name: 'Theo', age: 5, colorIdx: 3 }],
      // Week A: kids away Fri to Sun. Week B: all week with her. Today sits in Week B.
      cycle: { preset: 'custom', pattern: [1,1,1,1,0,0,0,1,1,1,1,1,1,1], anchor: (() => { const m = mostRecent(0); const a = new Date(m); a.setDate(a.getDate() - 7); return a; })() },
      budget: {
        grossSalary: 82000, salaryInputMode: 'annual', salarySacrifice: 0, ftbMonthly: 310, csReceived: 624, csOut: 0, csMode: 'receiving',
        'kids-costs': [{ id: 'kids-food', val: 460 }, { id: 'kids-childcare', val: 520 }, { id: 'kids-pocket', val: 20 }, { id: 'kids-gifts', val: 70 }],
        shared: [{ id: 'kids-school', val: 110 }, { id: 'kids-activities', val: 150 }, { id: 'kids-clothing', val: 90 }, { id: 'kids-medical', val: 70 }, { id: 'shared-health', val: 120 }],
        housing: [{ id: 'rent', val: 2650 }, { id: 'utilities', val: 290 }, { id: 'internet', val: 80 }, { id: 'phone', val: 60 }, { id: 'insurance-home', val: 120 }, { id: 'fuel', val: 160 }, { id: 'car-insurance', val: 140 }],
        personal: [{ id: 'groceries', val: 380 }, { id: 'personal-health', val: 80 }, { id: 'therapy', val: 140 }, { id: 'clothing-self', val: 60 }, { id: 'dining', val: 90 }],
        subs: [{ id: 'streaming1', val: 23 }, { id: 'streaming2', val: 13 }, { id: 'cloud', val: 3 }],
        savings: [{ id: 'emergency', val: 200, balance: 2800 }, { id: 'general', val: 0, balance: 400 }],
      },
      costs: [
        { label: 'Legal / Solicitor', pay: [[9, 6, 1500, 'Initial advice'], [7, 14, 1800, 'Property settlement advice']] },
        { label: 'Mediation', pay: [[6, 10, 800, 'Session 1'], [5, 22, 800, 'Session 2']] },
        { label: 'Setting up new home', pay: [[8, 4, 450, 'Beds and bedding for the kids'], [7, 9, 320, 'Second-hand dining table']] },
        { label: 'Moving costs', pay: [] },
      ],
      bills: [
        { name: 'Mortgage', amount: 2650, repeat: 'monthly', due: iso(day(9)) },
        { name: 'Before and after school care', amount: 520, repeat: 'monthly', due: iso(day(3)) },
        { name: 'Electricity', amount: 290, repeat: 'quarterly', due: iso(day(14)) },
        { name: 'Home insurance', amount: 1440, repeat: 'yearly', due: iso(day(33)) },
      ],
      admin: { f: 17, d: 18, b: 10, g: 7, h: 5, k: 8 },
      events: () => {
        const e = [];
        [0, 1, 2, 3, 4].forEach(d => e.push({ day: d, time: '08:30', text: 'School drop-off', who: 'both', repeat: 'kids' }));
        e.push({ day: 2, time: '16:00', text: 'Piano', who: 'child1', repeat: 'kids' });
        e.push({ day: 3, time: '15:45', text: 'Kindy gym', who: 'child2', repeat: 'kids' });
        return e;
      },
      dates: () => [
        { date: iso(nextWeekday(4)), label: 'Mia: school disco', type: 'school' },
        { date: iso(day(16)), label: 'Parent-teacher interviews', type: 'school' },
        { date: iso(day(38)), label: 'Theo: first swimming carnival', type: 'school' },
      ],
      tasks: ['Order Theo’s school shoes', 'Renew the home insurance quote', 'Write down what the kids need for the sleepover'],
      records: [
        ['handover', 24, 'Pickup on Friday was 30 minutes later than agreed', 'Told me by text beforehand. Logged in case it becomes a pattern.', null, null],
        ['communication', 18, 'Agreed to split Theo’s swimming fees', 'Email, both confirmed.', null, null],
        ['cost', 14, 'Theo’s swimming term fees', 'Half owed back.', 210, 'me'],
        ['cost', 8, 'Mia’s school photos', 'Paid by the other parent.', 45, 'them'],
        ['handover', 4, 'Swapped weekend so Mia could go to a birthday party', 'Agreed over text. Back to normal after.', null, null],
      ],
      goals: null,
    },
  }[persona];

  /* Phase */
  ['atlas_phase', 'dad_atlas_phase', 'atlas_budget_phase', 'dad_budget_phase'].forEach(k => set(k, P.phase));
  set('atlas_demo_persona', persona);

  /* Money. money.html fills every other line from its defaults. */
  set('atlas_budget_state', P.budget);
  set('atlas_transition_costs', P.costs.map((c, i) => ({
    id: 'tc-demo-' + i, label: c.label, estimated: 0, trackOnly: true, archived: false, open: false,
    payments: c.pay.map((p, j) => ({ id: 'p-demo-' + i + '-' + j, date: iso(monthsAgo(p[0], p[1])), amount: p[2], note: p[3] })),
  })));
  set('atlas_bills', P.bills.map((b, i) => ({ id: 'b-demo-' + i, anchorDay: Number(b.due.slice(8)), ...b })));

  /* Week */
  const c = P.cycle;
  set('atlas_kidsweek', {
    kids: P.kids,
    events: P.events().map((e, i) => ({ id: 'e-demo-' + i, recurring: true, ...e })),
    dates: P.dates().map((d, i) => ({ id: 'dt-demo-' + i, ...d })),
    checklist: {
      before: [
        { id: 'b1', text: 'Beds made, fresh sheets on, and rooms ready', done: true },
        { id: 'b2', text: 'Food in the fridge and easy breakfast options sorted', done: true },
        { id: 'b3', text: 'School uniforms washed and ready for the week', done: false },
        { id: 'b4', text: 'Sports kit packed', done: false },
        { id: 'b5', text: 'School bags, library books and permission notes checked', done: false },
      ],
      during: [],
      after: [
        { id: 'a1', text: 'Bags packed', done: false },
        { id: 'a2', text: 'Medication and special items packed', done: false },
        { id: 'a3', text: 'Anything to tell the other parent noted', done: false },
      ],
    },
    meals: {},
    chores: [
      { id: 'ch1', text: 'Clear dinner plate', who: 'both', when: 'Every kids day', done: false },
      { id: 'ch2', text: 'Put shoes and school bag away', who: 'both', when: 'Every kids day', done: false },
      { id: 'ch3', text: 'Tidy bedroom', who: 'both', when: 'Sunday', done: false },
    ],
    notes: '',
    cycle: { preset: c.preset, pattern: c.pattern, nextKidsDate: iso(c.anchor) },
  });

  /* Records */
  set('atlas_records', {
    entries: P.records.map((r, i) => ({
      id: 'r_demo_' + i, type: r[0], date: iso(day(-r[1])), title: r[2], note: r[3],
      amount: r[0] === 'cost' ? r[4] : null, paidBy: r[0] === 'cost' ? r[5] : null,
      kids: '', receipt: '', created: day(-r[1]).toISOString(),
    })),
  });

  /* Admin: tick the first N items of each section */
  const ticks = {};
  Object.entries(P.admin).forEach(([prefix, n]) => {
    for (let i = 1; i <= n; i++) ticks['item-' + prefix + pad(i)] = true;
  });
  set('atlas_admin_checklists', ticks);

  /* Today list and welcome state */
  set('atlas_today_tasks', P.tasks.map((t, i) => ({ id: 'task-demo-' + i, text: t, done: false })));
  set('atlas_welcome_dismissed', 'true');
  set('atlas_last_backup', JSON.stringify(new Date().toISOString()));
})();
