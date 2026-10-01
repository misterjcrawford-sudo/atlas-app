/* Mirrors the retained Money tool. Tax assumptions are inherited, not a new tax assessment. */
(function(root){
 'use strict';
const DEFAULTS = {
  grossSalary: 0,
  salaryInputMode: 'annual',
  salarySacrifice: 0,
  ftbMonthly: 0,
  csReceived: 0,
  csOut: 0,
  csMode: 'paying',

  // Phase shorthands (not stored — metadata only)
  // ALL = all 5 phases | SV = Survive+ | ST = Stabilise+ | RB = Rebuild+ | NC = New Chapter only
  'kids-costs': [
    { id: 'kids-food',      name: 'Food / Groceries (kids weeks)',                 val: 0, min: 0, max: 1500, phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'kids-childcare', name: 'Childcare (nanny / babysitter / before school)', val: 0,   min: 0, max: 1000, phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'kids-pocket',    name: 'Pocket Money',                                   val: 0,  min: 0, max: 200,  phases: ['survive','stabilise','rebuild','new-chapter'] },
    { id: 'kids-gifts',     name: 'Birthdays / Christmas',                          val: 0,  min: 0, max: 300,  phases: ['stabilise','rebuild','new-chapter'] },
  ],
  'shared': [
    { id: 'kids-school',        name: 'School Fees &amp; Supplies',                       val: 0,  min: 0, max: 600,  phases: ['survive','stabilise','rebuild','new-chapter'] },
    { id: 'kids-activities',    name: 'Sports / Activities / Classes',               val: 0, min: 0, max: 800,  phases: ['survive','stabilise','rebuild','new-chapter'] },
    { id: 'kids-clothing',      name: 'School Clothing &amp; Shoes',                      val: 0,  min: 0, max: 400,  phases: ['survive','stabilise','rebuild','new-chapter'] },
    { id: 'kids-medical',       name: 'Medical / Dental (kids)',                     val: 0,  min: 0, max: 400,  phases: ['survive','stabilise','rebuild','new-chapter'] },
    { id: 'shared-health',      name: 'Health Insurance (kids portion)',             val: 0, min: 0, max: 400,  phases: ['survive','stabilise','rebuild','new-chapter'] },
    { id: 'shared-specialists', name: 'Major Medical / Specialists / Orthodontics', val: 0,   min: 0, max: 500,  phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'shared-devices',     name: 'Devices &amp; Electronics',                       val: 0,   min: 0, max: 300,  phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'shared-holidays',    name: 'Shared Holiday Costs',                        val: 0,   min: 0, max: 500,  phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'shared-extras',      name: 'Other Agreed Costs',                          val: 0,   min: 0, max: 500,  phases: ['survive','stabilise','rebuild','new-chapter'] },
  ],
  'housing': [
    { id: 'rent',           name: 'Rent / Mortgage',            val: 0, min: 0, max: 6000, phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'utilities',      name: 'Utilities (elec/gas/water)', val: 0,  min: 0,  max: 700,  phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'internet',       name: 'Internet',                   val: 0,   min: 0,   max: 150,  phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'phone',          name: 'Phone',                      val: 0,   min: 0,   max: 150,  phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'insurance-home', name: 'Home / Contents Insurance',  val: 0,  min: 0,   max: 500,  phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'car',            name: 'Car Loan / Finance',         val: 0,    min: 0,   max: 1500, phases: ['survive','stabilise','rebuild','new-chapter'] },
    { id: 'fuel',           name: 'Fuel',                       val: 0,  min: 0,   max: 500,  phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'car-insurance',  name: 'Car Insurance / Rego',       val: 0,  min: 0,   max: 400,  phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
  ],
  'personal': [
    { id: 'debt-repayment', name: 'Debt Repayments',        val: 0,   min: 0, max: 3000, phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'groceries',      name: 'Groceries (adult)',       val: 0, min: 0, max: 1200, phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'personal-health',name: 'Health / Appointments',  val: 0,  min: 0, max: 300,  phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'therapy',        name: 'Therapy / Counselling',  val: 0,   min: 0, max: 500,  phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'clothing-self',  name: 'Clothing (self)',         val: 0,  min: 0, max: 400,  phases: ['survive','stabilise','rebuild','new-chapter'] },
    { id: 'gym',            name: 'Gym / Fitness',           val: 0,  min: 0, max: 200,  phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'dining',         name: 'Dining &amp; Social',     val: 0, min: 0, max: 600,  phases: ['stabilise','rebuild','new-chapter'] },
  ],
  'subs': [
    { id: 'other-sub',  name: 'Other Subscriptions',         val: 0,  min: 0, max: 200, phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'streaming1', name: 'Streaming (Netflix / Disney)', val: 0, min: 0, max: 60,  phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'streaming2', name: 'Music (Spotify)',              val: 0, min: 0, max: 30,  phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'software',   name: 'Software / Apps',              val: 0, min: 0, max: 150, phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'news',       name: 'News / Reading',               val: 0, min: 0, max: 60,  phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'cloud',      name: 'Cloud Storage',                val: 0,  min: 0, max: 30,  phases: ['stabilise','rebuild','new-chapter'] },
  ],
  'savings': [
    { id: 'emergency',       name: 'Emergency Fund',    val: 0, min: 0, max: 3000, target: 15000, balance: 0, priority: true, phases: ['waiting-room','survive','stabilise','rebuild','new-chapter'] },
    { id: 'general',         name: 'General Savings',   val: 0, min: 0, max: 3000, target: 0,     balance: 0, phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'holiday-kids',    name: 'Holiday with Kids', val: 0,   min: 0, max: 1000, target: 5000,  balance: 0, phases: ['stabilise','rebuild','new-chapter'] },
    { id: 'housing-deposit', name: 'Housing Deposit',   val: 0,   min: 0, max: 5000, target: 80000, balance: 0, phases: ['rebuild','new-chapter'] },
    { id: 'kids-future',     name: "Kids' Future Fund", val: 0,   min: 0, max: 2000, target: 20000, balance: 0, phases: ['rebuild','new-chapter'] },
    { id: 'super-catchup',   name: 'Super Catch-up',    val: 0,   min: 0, max: 3000, target: 0,     balance: 0, phases: ['new-chapter'] },
  ],
  'networth': {
    property: 0, superBal: 0, cashSavings: 0, investments: 0, otherAssets: 0,
    mortgage: 0, carLoan: 0, otherDebt: 0, settlementDebt: 0,
  }
};

function calcAusTax(gross) {
  let tax = 0;
  if (gross <= 18200) tax = 0;
  else if (gross <= 45000) tax = (gross - 18200) * 0.16;
  else if (gross <= 135000) tax = 4288 + (gross - 45000) * 0.30;
  else if (gross <= 190000) tax = 31288 + (gross - 135000) * 0.37;
  else tax = 51638 + (gross - 190000) * 0.45;
  const lito = gross <= 37500 ? 700 : gross <= 45000 ? 700 - (gross - 37500) * 0.05 : gross <= 66667 ? 325 - (gross - 45000) * 0.015 : 0;
  tax = Math.max(0, tax - lito);
  const medicare = gross > 26000 ? gross * 0.02 : 0;
  const totalTax = tax + medicare;
  const netAnnual = gross - totalTax;
  return { tax, medicare, totalTax, netAnnual, netMonthly: netAnnual / 12 };
}


function currency(value){return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(Math.abs(value));}
function moneySummary(saved,phase){
 if(!saved||typeof saved!=='object'||Array.isArray(saved))return null;
 const state=JSON.parse(JSON.stringify(saved));
 const ARRAY_GROUPS=['kids-costs','shared','legal','housing','personal','subs','savings'];
 const deepClone=o=>JSON.parse(JSON.stringify(o));
 for(const k in DEFAULTS)if(state[k]===undefined)state[k]=deepClone(DEFAULTS[k]);
 for(const k of ARRAY_GROUPS)if(!Array.isArray(state[k]))state[k]=deepClone(DEFAULTS[k]||[]);
 for(const k of ARRAY_GROUPS)state[k]=state[k].filter(x=>x&&typeof x==='object');
function mergeDefaultArrayMetadata() {
  ARRAY_GROUPS.forEach(groupKey => {
    if (!Array.isArray(state[groupKey]) || !Array.isArray(DEFAULTS[groupKey])) return;
    const defaultsById = new Map(DEFAULTS[groupKey].map(item => [item.id, item]));
    state[groupKey] = state[groupKey].map(item => {
      const defaultItem = defaultsById.get(item.id);
      return defaultItem ? { ...defaultItem, ...item } : item;
    });
  });
}

// Migrate saved state: moves kids-school/activities/clothing/medical from kids-costs → shared,
// and ensures any new DEFAULTS items are present in each group.
function migrateState() {
  const movedIds = ['kids-school','kids-activities','kids-clothing','kids-medical'];
  const kidsArr = state['kids-costs'] || [];
  const sharedArr = state['shared'] || [];
  const sharedIdSet = new Set(sharedArr.map(i => i.id));

  // Capture user values from old kids-costs location before removing
  const savedVals = {};
  movedIds.forEach(id => {
    const item = kidsArr.find(i => i.id === id);
    if (item) savedVals[id] = item.val;
  });

  // Strip moved items and removed items from kids-costs
  const removedKidsIds = ['kids-transport'];
  state['kids-costs'] = kidsArr.filter(i => !movedIds.includes(i.id) && !removedKidsIds.includes(i.id));

  // Insert moved items into shared (preserving user values, skipping if already present)
  movedIds.forEach(id => {
    if (!sharedIdSet.has(id)) {
      const def = DEFAULTS['shared'].find(i => i.id === id);
      if (def) {
        const newItem = deepClone(def);
        if (savedVals[id] !== undefined) newItem.val = savedVals[id];
        sharedArr.push(newItem);
      }
    }
  });
  state['shared'] = sharedArr;

  // Ensure any new DEFAULTS items exist in every group (e.g. kids-childcare, debt-repayment)
  ARRAY_GROUPS.forEach(groupKey => {
    if (!Array.isArray(DEFAULTS[groupKey])) return;
    const stateArr = state[groupKey] || [];
    const stateIds = new Set(stateArr.map(i => i.id));
    DEFAULTS[groupKey].forEach(def => {
      if (!stateIds.has(def.id)) stateArr.push(deepClone(def));
    });
    state[groupKey] = stateArr;
  });
}

 mergeDefaultArrayMetadata();migrateState();mergeDefaultArrayMetadata();
 const n=x=>Number.isFinite(Number(x))?Number(x):0;
 const net=calcAusTax(Math.max(0,n(state.grossSalary)-n(state.salarySacrifice)*12)).netMonthly;
 const takeHome=net+n(state.ftbMonthly)+n(state.csReceived);
 const totalExpenses=n(state.csOut)+['kids-costs','shared','housing','personal','subs','savings'].reduce((total,key)=>total+state[key].reduce((sum,item)=>sum+n(item.val),0),0); // every amount counts; phase never hides money
 return {takeHome,totalExpenses,surplus:takeHome-totalExpenses};
}
/* ---------- Week: custody cycle ---------- */

// Returns a function date -> true (kids with you) / false, or null if no valid cycle is saved.
function cycleReader(saved){
 const pattern=saved?.cycle?.pattern,anchor=saved?.cycle?.nextKidsDate;
 if(!Array.isArray(pattern)||pattern.length!==14||!pattern.every(x=>x===0||x===1))return null;
 if(typeof anchor!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(anchor))return null;
 const [y,m,d]=anchor.split('-').map(Number),start=new Date(y,m-1,d,12);
 if(start.getFullYear()!==y||start.getMonth()!==m-1||start.getDate()!==d)return null;
 const dayNumber=date=>Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000;
 return date=>pattern[((dayNumber(date)-dayNumber(start))%14+14)%14]===1;
}

const noon=date=>new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);
const isoDate=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

function weekSummary(saved,now=new Date()){
 const isKids=cycleReader(saved);
 if(!isKids)return null;
 const today=noon(now),kidsToday=isKids(today);let next=null;
 for(let i=1;i<=14;i++){const day=new Date(today);day.setDate(day.getDate()+i);if(isKids(day)!==kidsToday){next=day;break;}}
 return {kidsToday,next};
}

// The next `count` days from today: who has the kids, handovers, weekly events and important dates.
function upcomingDays(saved,now=new Date(),count=7){
 const isKids=cycleReader(saved);
 const events=Array.isArray(saved?.events)?saved.events:[];
 const dates=Array.isArray(saved?.dates)?saved.dates:[];
 const today=noon(now),days=[];
 for(let i=0;i<count;i++){
  const date=new Date(today);date.setDate(today.getDate()+i);
  const yesterday=new Date(date);yesterday.setDate(date.getDate()-1);
  const kids=isKids?isKids(date):null;
  const handover=isKids&&isKids(yesterday)!==kids?(kids?'arrive':'leave'):null;
  const weekday=(date.getDay()+6)%7; // Week stores Monday as 0
  days.push({
   date,iso:isoDate(date),kids,handover,
   events:events.filter(e=>e&&typeof e.text==='string'&&((e.recurring!==false&&!e.date)?e.day===weekday&&(e.repeat!=='kids'||!isKids||kids):e.date===isoDate(date))).sort((a,b)=>String(a.time||'').localeCompare(String(b.time||''))).map(e=>({time:e.time||'',text:e.text})),
   dates:dates.filter(d=>d&&d.date===isoDate(date)&&typeof d.label==='string').map(d=>({label:d.label,type:d.type||''})),
  });
 }
 return days;
}

/* ---------- Handover prep (the countdown tile on Today) ---------- */
// Which handover is next, which checklist prepares for it, and where we are in the current stretch.
// Arriving uses checklist.before, going back uses checklist.after (the same rule Week uses).
function handoverPrep(saved,now=new Date()){
 const summary=weekSummary(saved,now);
 if(!summary)return null;
 const days=upcomingDays(saved,now,14);
 const today=days[0];
 const handoverToday=today.handover;
 const target=handoverToday?today.date:summary.next;
 const direction=handoverToday||(summary.kidsToday?'leave':'arrive');
 const group=direction==='arrive'?'before':'after';
 const items=(saved&&saved.checklist&&Array.isArray(saved.checklist[group])?saved.checklist[group]:[]).filter(i=>i&&typeof i.text==='string');
 // Day of the current stretch (1 = the handover day that started it).
 const back=upcomingDays(saved,new Date(noon(now).getTime()-14*86400000),15);
 let start=-1;back.forEach((d,i)=>{if(d.handover)start=i;});
 const stretchDay=start<0?null:15-start;
 const daysLeft=summary.next?daysBetween(now,summary.next):null;
 const stretchLength=stretchDay&&daysLeft!=null?stretchDay-1+daysLeft:null;
 return {kidsToday:summary.kidsToday,next:summary.next,handoverToday,direction,group,target,targetIso:target?isoDate(target):null,daysLeft,items,done:items.filter(i=>i.done).length,days,stretchDay,stretchLength};
}

// Ticks belong to one handover. When the handover a list prepares for changes, clear its ticks.
// The first time a list is seen, remember its handover without clearing anything. Returns true if saved changed.
function rollHandoverChecklist(saved,prep){
 if(!saved||!prep||!prep.targetIso)return false;
 const marks=saved.checklistFor&&typeof saved.checklistFor==='object'?saved.checklistFor:{};
 const was=marks[prep.group];
 if(was===prep.targetIso)return false;
 if(was&&saved.checklist&&Array.isArray(saved.checklist[prep.group]))saved.checklist[prep.group].forEach(i=>{if(i)i.done=false;});
 saved.checklistFor={...marks,[prep.group]:prep.targetIso};
 return true;
}

const STARTER_CHECKLIST={
 before:['Beds made and rooms ready','Food in the fridge','Uniforms washed','Sports kit packed','School bags and library books checked','Lunchboxes and drink bottles ready'],
 after:['Bags packed','Medication and special items packed','Dirty uniforms and sports gear sorted','Anything to tell the other parent noted','Beds stripped and rooms reset'],
};

/* ---------- Admin: the First 30 days list (mirrors admin.html; a test keeps them in step) ---------- */
const ADMIN_FIRST30=[
  { id: 'item-f01', title: 'Find somewhere stable to live' },
  { id: 'item-f02', title: 'Open a personal bank account in your name only' },
  { id: 'item-f03', title: 'Set up a separate email address for legal and financial correspondence' },
  { id: 'item-f04', title: 'Create one private folder for separation admin' },
  { id: 'item-f05', title: 'Locate your important documents' },
  { id: 'item-f06', title: 'Take phone photos or scans of key documents before anything gets moved' },
  { id: 'item-f07', title: 'Contact a family lawyer for an initial consultation' },
  { id: 'item-f08', title: "Notify your children's school of the separation and any new contact details" },
  { id: 'item-f09', title: 'Contact Services Australia about child support obligations if relevant' },
  { id: 'item-f10', title: 'Let Centrelink / Services Australia know if your income or living situation has changed' },
  { id: 'item-f11', title: 'Register with a GP if you have moved suburb' },
  { id: 'item-f12', title: 'Update your payroll, HR and emergency contact details if needed' },
  { id: 'item-f13', title: 'Change passwords on personal email, banking and government accounts' },
  { id: 'item-f14', title: 'Turn on two-factor authentication where possible' },
  { id: 'item-f15', title: 'Check who has access to shared devices, cloud storage and family accounts' },
  { id: 'item-f16', title: 'Write down key dates while they are still fresh' },
  { id: 'item-f17', title: 'Do not make major financial decisions in the first 30 days if you can avoid it' }
];
const ADMIN_PHASES=['waiting-room','survive','stabilise'];

// The next unticked First 30 days task, skipping items the person hid on Admin.
// state: atlas_admin_checklists ({ 'item-f01': true, ... }); hidden: atlas_admin_hidden_items (array of ids).
function nextAdminStep(state,hidden,phase){
 if(!ADMIN_PHASES.includes(phase))return null;
 const skip=new Set(Array.isArray(hidden)?hidden:[]);
 const list=ADMIN_FIRST30.filter(item=>!skip.has(item.id));
 const done=list.filter(item=>state&&state[item.id]===true).length;
 const next=list.find(item=>!(state&&state[item.id]===true));
 return next?{...next,done,total:list.length}:null;
}

/* ---------- Records and separation costs ---------- */

function recordsSummary(saved){
 const entries=Array.isArray(saved?.entries)?saved.entries.filter(e=>e&&typeof e.date==='string'):[];
 const last=entries.map(e=>e.date).sort().pop()||null;
 return {count:entries.length,last};
}

function separationCostsTotal(rows){
 if(!Array.isArray(rows))return 0;
 return rows.reduce((sum,row)=>sum+(Array.isArray(row?.payments)?row.payments.reduce((s,p)=>s+(Number(p?.amount)||0),0):0),0);
}

// Whole days between two dates, ignoring time of day.
function daysBetween(from,to){
 return Math.round((Date.UTC(to.getFullYear(),to.getMonth(),to.getDate())-Date.UTC(from.getFullYear(),from.getMonth(),from.getDate()))/86400000);
}


/* ---------- Bills ---------- */
// A bill: { id, name, amount, due: 'YYYY-MM-DD' (next unpaid), repeat, anchorDay }.
// anchorDay keeps monthly bills on their original day (31st → last day of shorter months).
const REPEATS=['once','weekly','fortnightly','monthly','quarterly','yearly'];

function addMonthsClamped(date,months,anchorDay){
 const target=new Date(date.getFullYear(),date.getMonth()+months,1,12);
 const lastDay=new Date(target.getFullYear(),target.getMonth()+1,0).getDate();
 target.setDate(Math.min(anchorDay||date.getDate(),lastDay));
 return target;
}

function nextDue(iso,repeat,anchorDay){
 const date=parseIsoDate(iso);
 if(!date)return null;
 switch(repeat){
  case 'weekly':date.setDate(date.getDate()+7);return isoDate(date);
  case 'fortnightly':date.setDate(date.getDate()+14);return isoDate(date);
  case 'monthly':return isoDate(addMonthsClamped(date,1,anchorDay));
  case 'quarterly':return isoDate(addMonthsClamped(date,3,anchorDay));
  case 'yearly':return isoDate(addMonthsClamped(date,12,anchorDay));
  default:return null; // once: nothing further
 }
}

function parseIsoDate(iso){
 if(typeof iso!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(iso))return null;
 const [y,m,d]=iso.split('-').map(Number),date=new Date(y,m-1,d,12);
 return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d?date:null;
}

function cleanBills(saved){
 return (Array.isArray(saved)?saved:[]).filter(b=>b&&typeof b.name==='string'&&parseIsoDate(b.due)).map(b=>({...b,amount:Number(b.amount)||0,repeat:REPEATS.includes(b.repeat)?b.repeat:'monthly'}));
}

// Every due date for each bill between two dates (inclusive), soonest first.
function billsBetween(saved,from,to){
 const start=isoDate(noon(from)),end=isoDate(noon(to)),out=[];
 cleanBills(saved).forEach(bill=>{
  let due=bill.due,guard=0;
  while(due&&due<=end&&guard++<60){
   if(due>=start)out.push({...bill,on:due});
   due=nextDue(due,bill.repeat,bill.anchorDay);
  }
 });
 return out.sort((a,b)=>a.on.localeCompare(b.on)||a.name.localeCompare(b.name));
}

function overdueBills(saved,now=new Date()){
 const today=isoDate(noon(now));
 return cleanBills(saved).filter(b=>b.due<today).sort((a,b)=>a.due.localeCompare(b.due));
}

// Paying moves a repeating bill to its next date; a one-off bill is removed.
function markBillPaid(saved,id){
 return cleanBills(saved).flatMap(b=>{
  if(b.id!==id)return [b];
  const due=nextDue(b.due,b.repeat,b.anchorDay);
  return due?[{...b,due,lastPaid:isoDate(new Date())}]:[];
 });
}

const api={nextAdminStep,ADMIN_FIRST30,moneySummary,weekSummary,upcomingDays,handoverPrep,rollHandoverChecklist,STARTER_CHECKLIST,recordsSummary,separationCostsTotal,daysBetween,currency,isoDate,parseIsoDate,nextDue,cleanBills,billsBetween,overdueBills,markBillPaid,REPEATS};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AtlasData=api;
})(typeof window!=='undefined'?window:globalThis);
