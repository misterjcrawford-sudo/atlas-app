/* Today · Bento extras (index.html).
   1. The countdown tile: days until the next handover, the checklist that gets you ready for it
      (tickable in place), and the next 14 days as a labelled strip. Mid-stretch with the kids it
      shows "day 3 of 7 together" and tonight's dinner instead, until two days before the handover.
   2. Money and Records tiles use a quieter type size until they hold a real number. */
(function () {
  const A = window.AtlasApp, D = window.AtlasData;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const phone = window.matchMedia('(max-width: 720px)');
  const ticksShown = () => (phone.matches ? 1 : 2); // open checklist items shown in the tile
  const PREP_WINDOW = 2;      // with the kids, switch from "together" to the checklist this many days out

  const shortDate = (d) => d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
  const weekday = (d) => d.toLocaleDateString('en-AU', { weekday: 'long' });

  function readWeek() { return A.read('atlas_kidsweek', A.read('dad_kidsweek')); }

  function headline(prep, kidsLabel) {
    if (prep.handoverToday) {
      const nowTime = new Date().toTimeString().slice(0, 5);
      const first = prep.days[0].events.find((e) => e.time && e.time >= nowTime);
      return {
        eyebrow: prep.handoverToday === 'arrive' ? 'Handover today · kids arrive' : 'Handover today',
        number: 'Today', word: true,
        caption: first ? `${first.text}${first.time ? ' ' + first.time : ''} is first up` : `${kidsLabel} ${prep.handoverToday === 'arrive' ? 'arrive' : 'go back'} today`,
      };
    }
    if (!prep.next) return { eyebrow: prep.kidsToday ? 'With you' : 'Solo', number: '14+', word: false, caption: prep.kidsToday ? 'days with the kids' : 'days solo' };
    return {
      eyebrow: `${prep.direction === 'arrive' ? 'Kids arrive' : 'Next handover'} · ${shortDate(prep.next)}`,
      number: String(prep.daysLeft), word: false,
      caption: prep.daysLeft === 1 ? 'day · tomorrow' : `days · ${weekday(prep.next)}`,
    };
  }

  function checklist(prep) {
    const title = prep.group === 'before' ? 'Before they arrive' : 'Before handover';
    if (!prep.items.length) {
      return `<div class="count-empty"><span><strong>${title}</strong>: no checklist yet.</span><button type="button" class="btn" data-starter="${prep.group}">Add a starter list</button></div>`;
    }
    const total = prep.items.length, pct = Math.round((prep.done / total) * 100);
    const all = (prep.week.checklist[prep.group] || []);
    const open = all.map((item, index) => ({ item, index })).filter((x) => x.item && typeof x.item.text === 'string' && !x.item.done).slice(0, ticksShown());
    const list = open.length
      ? `<ul class="prep-list">${open.map(({ item, index }) => `<li><label><input type="checkbox" data-group="${prep.group}" data-index="${index}"><span>${esc(item.text)}</span></label></li>`).join('')}</ul>`
      : `<div class="prep-done">All ${total} done. You’re ready.</div>`;
    return `<div><div class="prep-top"><span>${title}</span><span>${prep.done} of ${total} ready</span></div>
      <div class="prep-bar" role="progressbar" aria-label="${title}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${prep.done}"><i style="width:${pct}%"></i></div></div>${list}`;
  }

  function together(prep) {
    const len = Math.max(prep.stretchLength || 1, 1), day = Math.min(prep.stretchDay || 1, len);
    const pips = Array.from({ length: len }, (_, i) => `<i class="${i < day - 1 ? 'done' : i === day - 1 ? 'now' : ''}"></i>`).join('');
    const meal = prep.week.meals && prep.week.meals['day-' + ((prep.days[0].date.getDay() + 6) % 7)];
    const tonight = meal && meal.dinner ? ` Tonight: ${esc(meal.dinner)}.` : '';
    return `<div class="stretch"><div class="stretch-bar" aria-hidden="true">${pips}</div>
      <p class="count-note">${prep.daysLeft} ${prep.daysLeft === 1 ? 'day' : 'days'} left of this stretch.${tonight}</p></div>`;
  }

  function strip(prep) {
    const cells = prep.days.map((d, i) => {
      const cls = [d.kids ? 'k' : '', i === 0 ? 't' : '', d.handover ? 'h' : '', i === 7 ? 'w' : ''].filter(Boolean).join(' ');
      const label = `${shortDate(d.date)}${i === 0 ? ', today' : ''}${d.kids ? ', kids with you' : ', solo'}${d.handover ? ', handover' : ''}`;
      return `<span class="${cls}" title="${esc(label)}">${d.date.toLocaleDateString('en-AU', { weekday: 'narrow' })}<i></i><em></em></span>`;
    }).join('');
    const withYou = prep.days.filter((d) => d.kids).length;
    return `<div><div class="strip" role="img" aria-label="Next 14 days: ${withYou} with the kids">${cells}</div>
      <div class="strip-foot"><span><b aria-hidden="true"></b>With you</span><span><b class="solo" aria-hidden="true"></b>Solo</span><span><b class="hand" aria-hidden="true"></b>Handover</span><a href="./week.html">Week →</a></div></div>`;
  }

  function drawCountdown() {
    const tile = $('count');
    const week = readWeek();
    let prep = week ? D.handoverPrep(week) : null;
    if (!prep) {
      tile.innerHTML = `<span class="eyebrow" id="count-label">Next handover</span>
        <div class="count-head"><span class="count-number">–</span></div><div class="count-fill"></div>
        <a href="./week.html#cycle">Set your custody cycle to start the countdown →</a>`;
      return;
    }
    // New handover, fresh ticks.
    if (D.rollHandoverChecklist(week, prep)) { A.write('atlas_kidsweek', week); prep = D.handoverPrep(week); }
    prep.week = week;
    const kids = (Array.isArray(week.kids) ? week.kids : []).filter((k) => k && k.name).map((k) => k.name);
    const kidsLabel = kids.length ? kids.join(' & ') : 'The kids';
    const midStretch = prep.kidsToday && !prep.handoverToday && prep.next && prep.daysLeft > PREP_WINDOW && prep.stretchDay;

    let head, body;
    if (midStretch) {
      head = `<span class="eyebrow" id="count-label">Together · handover ${esc(shortDate(prep.next))}</span>
        <div class="count-head"><span class="count-number">${prep.stretchDay}</span><span class="count-caption">of ${prep.stretchLength} days together</span></div>`;
      body = together(prep);
    } else {
      const h = headline(prep, kidsLabel);
      head = `<span class="eyebrow" id="count-label">${esc(h.eyebrow)}</span>
        <div class="count-head"><span class="count-number${h.word ? ' is-word' : ''}">${esc(h.number)}</span><span class="count-caption">${esc(h.caption)}</span></div>`;
      body = prep.next || prep.handoverToday ? checklist(prep) : '';
    }
    tile.innerHTML = head + body + '<div class="count-fill"></div>' + strip(prep);
  }

  function markEmpty() {
    $('money-tile').classList.toggle('is-empty', !/[\d$]/.test($('at-money-value').textContent));
    $('at-second-card').classList.toggle('is-empty', !/[\d$]/.test($('at-second-value').textContent));
  }

  function save(week) {
    A.write('atlas_kidsweek', week);
    document.dispatchEvent(new CustomEvent('atlas:changed', { detail: { key: 'atlas_kidsweek' } }));
  }

  $('count').addEventListener('change', (event) => {
    const box = event.target.closest('input[data-group]');
    if (!box) return;
    const week = readWeek();
    const item = week?.checklist?.[box.dataset.group]?.[Number(box.dataset.index)];
    if (!item) return;
    item.done = box.checked;
    save(week);
    setTimeout(() => {
      drawCountdown(); // the next unticked item moves up; keep keyboard focus in the list
      const next = $('count').querySelector('input[data-group]');
      if (next) next.focus({ preventScroll: true });
    }, 450);
  });

  $('count').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-starter]');
    if (!button) return;
    const week = readWeek() || {};
    const group = button.dataset.starter;
    week.checklist = week.checklist && typeof week.checklist === 'object' ? week.checklist : { before: [], during: [], after: [] };
    week.checklist[group] = D.STARTER_CHECKLIST[group].map((text, i) => ({ id: `${group[0]}${Date.now().toString(36)}${i}`, text, done: false }));
    save(week);
    drawCountdown();
    $('count').querySelector('input[data-group]')?.focus();
    if (A.notify) A.notify('Starter list added. Edit it on Week.');
  });

  function draw() { drawCountdown(); markEmpty(); }
  draw();
  new MutationObserver(markEmpty).observe($('at-money-value'), { childList: true, characterData: true, subtree: true });
  new MutationObserver(markEmpty).observe($('at-second-value'), { childList: true, characterData: true, subtree: true });
  document.addEventListener('atlas:phase', draw);
  window.addEventListener('storage', draw);
  window.addEventListener('pageshow', draw);
  phone.addEventListener?.('change', drawCountdown);
})();
