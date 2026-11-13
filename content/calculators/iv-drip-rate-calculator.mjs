export default {
  slug: 'iv-drip-rate-calculator',
  hub: 'health',
  name: 'IV Drip Rate Calculator',
  title: 'IV Drip Rate Calculator: 1,000 mL Over 8 h = 31 gtt/min',
  h1: 'IV Drip Rate Calculator: Drops per Minute and mL per Hour',
  meta: '1,000 mL over 8 hours with 15 gtt/mL tubing runs at 125 mL/hr, or 31 drops per minute. Get gtt/min, mL/hr, drops per 15 seconds and the finish time.',
  keyword: 'how to calculate drop per minute',
  also: ['how to calculate ml hr', 'iv drip rate calculator', 'drops per minute calculator', 'gtt/min formula', 'iv flow rate calculator', 'how to calculate ivig infusion rate'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I know the', type: 'select', value: 'time', options: [['time', 'Volume and infusion time'], ['rate', 'Volume and mL/hr rate']], wide: true },
    { id: 'vol', label: 'Volume to infuse', type: 'number', value: 1000, suffix: 'mL' },
    { id: 'hrs', label: 'Infusion time (hours)', type: 'number', value: 8, suffix: 'h', showIf: { mode: ['time'] } },
    { id: 'mins', label: '+ minutes', type: 'number', value: 0, suffix: 'min', showIf: { mode: ['time'] } },
    { id: 'mlhr', label: 'Ordered rate', type: 'number', value: 125, suffix: 'mL/hr', showIf: { mode: ['rate'] } },
    { id: 'df', label: 'Drop factor (on the tubing package)', type: 'select', value: '15', options: [['10', '10 gtt/mL (macrodrip)'], ['15', '15 gtt/mL (macrodrip)'], ['20', '20 gtt/mL (macrodrip)'], ['60', '60 gtt/mL (microdrip)'], ['c', 'Other']] },
    { id: 'dfc', label: 'Custom drop factor', type: 'number', value: 12, suffix: 'gtt/mL', showIf: { df: ['c'] } },
    { id: 'start', label: 'Start time (optional)', type: 'time', value: '08:00' }
  ],
  compute(v, H) {
    var df = v.df === 'c' ? v.dfc : Number(v.df);
    if (!(v.vol > 0)) return { error: 'Enter the volume to infuse in mL.' };
    if (!(df > 0)) return { error: 'Enter the drop factor in gtt/mL.' };
    var min;
    if (v.mode === 'rate') {
      if (!(v.mlhr > 0)) return { error: 'Enter the ordered rate in mL/hr.' };
      min = v.vol / v.mlhr * 60;
    } else {
      min = (v.hrs > 0 ? v.hrs : 0) * 60 + (v.mins > 0 ? v.mins : 0);
      if (!(min > 0)) return { error: 'Enter the infusion time.' };
    }
    var mlhr = v.vol / min * 60;
    var gtt = v.vol * df / min;
    var rows = [
      ['Pump rate', H.num(mlhr, 1) + ' mL/hr', true],
      ['Exact drip rate', H.num(gtt, 2) + ' gtt/min'],
      ['Drops to count in 15 seconds', H.num(Math.round(gtt) / 4, 1)],
      ['One drop every', gtt > 0 ? H.num(60 / Math.round(gtt), 2) + ' seconds' : '—'],
      ['Infusion time', H.dur(min)]
    ];
    var m = /^(\d{1,2}):(\d{2})/.exec(v.start || '');
    if (m) {
      var end = (+m[1] * 60 + +m[2] + Math.round(min));
      var days = Math.floor(end / 1440), t = end % 1440, hh = Math.floor(t / 60), mm = t % 60;
      rows.push(['Finishes at', (hh % 12 || 12) + ':' + (mm < 10 ? '0' : '') + mm + (hh < 12 ? ' AM' : ' PM') + (days ? ' (+' + days + ' day' + (days > 1 ? 's' : '') + ')' : '')]);
    }
    return {
      value: H.int(gtt) + ' gtt/min',
      label: 'Drip rate (rounded to whole drops)',
      expr: H.num(v.vol, 1) + ' mL × ' + H.num(df, 0) + ' gtt/mL ÷ ' + H.num(min, 1) + ' min',
      rows: rows,
      sub: df === 60 ? 'With a 60 gtt/mL microdrip set, drops per minute equal mL per hour.' : 'Round to the nearest whole drop for a gravity infusion. Use the mL/hr figure for an infusion pump.'
    };
  },
  quick: ({ r }) => `Drops per minute = volume (mL) × drop factor (gtt/mL) ÷ time (minutes). For <strong>1,000 mL over 8 hours</strong> with 15 gtt/mL tubing: 1,000 × 15 ÷ 480 = 31.25, so set the drip to <strong>${r.value}</strong>. On a pump the same order is 1,000 ÷ 8 = 125 mL/hr. Count about 8 drops every 15 seconds to check it.`,
  stepsTitle: 'How to calculate drops per minute for an IV',
  steps: [
    'Read the order: total volume in mL and the time it should run over.',
    'Find the drop factor printed on the IV tubing package: 10, 15 or 20 gtt/mL for macrodrip sets, 60 gtt/mL for microdrip.',
    '<strong>Convert the time to minutes</strong> before dividing; using hours here is the most common error. 8 hours = 480 minutes.',
    'Multiply volume by drop factor and divide by minutes: 1,000 × 15 ÷ 480 = 31.25. Round to the nearest whole drop: 31 gtt/min.',
    'Count drops in the drip chamber for 15 seconds and multiply by 4 (or count a full minute), then adjust the roller clamp until it matches.'
  ],
  formulaTitle: 'What is the formula for IV drip rate?',
  formula: {
    expr: 'gtt/min = Volume (mL) × Drop factor (gtt/mL) ÷ Time (min)<br>mL/hr = Volume (mL) ÷ Time (hr)<br>gtt/min = mL/hr × Drop factor ÷ 60<br>Time (hr) = Volume (mL) ÷ mL/hr',
    vars: [['gtt', 'drops (from the Latin guttae)'], ['Drop factor', 'drops per mL delivered by that tubing set'], ['mL/hr', 'flow rate programmed into an infusion pump']],
    note: 'Dividing by 60 converts mL per hour to mL per minute. Shortcuts follow from the third line: with a 60 gtt/mL set, gtt/min = mL/hr; with 15 gtt/mL, divide mL/hr by 4; with 10 gtt/mL, divide by 6; with 20 gtt/mL, divide by 3.'
  },
  example: `<p><strong>Antibiotic piggyback:</strong> 100 mL over 30 minutes with 10 gtt/mL tubing. gtt/min = 100 × 10 ÷ 30 = <strong>33.3, so 33 gtt/min</strong>. Pump rate = 100 ÷ 0.5 h = <strong>200 mL/hr</strong>.</p>
<p><strong>Pediatric maintenance fluid:</strong> 250 mL over 6 hours with a 60 gtt/mL microdrip. mL/hr = 250 ÷ 6 = 41.7; gtt/min = 250 × 60 ÷ 360 = <strong>41.7, so 42 gtt/min</strong>.</p>
<p><strong>Finish time:</strong> 1,000 mL at 125 mL/hr takes 1,000 ÷ 125 = 8 hours. Hung at 8:00 AM, it finishes at <strong>4:00 PM</strong>.</p>`,
  table: {
    title: 'What drip rates do common IV orders need?',
    intro: 'Drops per minute (rounded) for typical orders and drop factors, plus the pump rate, all from the calculator above.',
    head: ['Order', 'mL/hr', '10 gtt/mL', '15 gtt/mL', '20 gtt/mL', '60 gtt/mL'],
    rows: ({ run }) => [[1000, 24], [1000, 12], [1000, 10], [1000, 8], [1000, 6], [500, 8], [500, 4], [250, 2], [250, 1], [100, 1], [100, 0.5], [50, 0.5]].map(([vol, h]) => {
      const base = { mode: 'time', vol, hrs: Math.floor(h), mins: Math.round((h % 1) * 60) };
      const cells = ['10', '15', '20', '60'].map(df => run({ ...base, df }).value.replace(' gtt/min', ''));
      return [vol.toLocaleString('en-US') + ' mL over ' + (h < 1 ? h * 60 + ' min' : h + ' h'), (Math.round(vol / h * 10) / 10) + '', ...cells];
    }),
    note: 'Always use the drop factor from the actual tubing in use. Gravity rates drift as the bag empties or the patient moves, so recheck the count regularly.'
  },
  sections: [
    {
      h2: 'What is the difference between macrodrip and microdrip tubing?',
      html: `<p>The drop factor is the number of drops that make 1 mL, and it is set by the size of the opening in the drip chamber. <strong>Macrodrip</strong> sets make large drops at 10, 15 or 20 gtt/mL and suit routine adult fluids and faster rates. <strong>Microdrip</strong> sets make small drops at 60 gtt/mL and are used for slow or precise infusions, children and medications where small volumes matter.</p>
<p>The same order needs very different drop counts by set: 125 mL/hr is about 21 gtt/min with a 10 gtt/mL set, 31 with 15, 42 with 20 and 125 with a microdrip. Rates above roughly 100 mL/hr are hard to count with a microdrip, which is one reason macrodrip sets exist.</p>`
    },
    {
      h2: 'How do you calculate mL per hour for an IV pump?',
      html: `<p>Divide the volume by the time in hours. If the time is in minutes, divide the volume by the minutes and multiply by 60: 50 mL over 20 minutes = 50 ÷ 20 × 60 = <strong>150 mL/hr</strong>. Pumps ignore drop factor entirely because they deliver measured volumes.</p>
<p>For a medication ordered as a dose per hour, divide the dose by the concentration. Heparin 25,000 units in 250 mL is 100 units/mL; an order of 1,000 units/hr runs at 1,000 ÷ 100 = <strong>10 mL/hr</strong>. IVIG and other weight-based infusions are ordered in mL/kg/hr: 0.5 mL/kg/hr for a 70 kg patient is 35 mL/hr, increased in the steps the product label and protocol specify.</p>`
    },
    {
      h2: 'How do you count and adjust a gravity drip?',
      html: `<p>Hold a watch next to the drip chamber and count drops for 15 seconds, then multiply by 4. For 31 gtt/min you want about 8 drops per 15 seconds, or one drop roughly every 2 seconds. Open or close the roller clamp in small movements and count again after each change.</p>
<p>Gravity flow depends on bag height, catheter size, vein position and fluid viscosity, so the rate changes when the patient moves. Recheck at intervals your facility sets, and use an infusion pump for high-risk drugs; the FDA and ISMP both publish guidance on safe pump use.</p>`
    },
    {
      h2: 'How do you work out when an IV bag will finish?',
      html: `<p>Infusion time = volume ÷ mL/hr. A 500 mL bag at 80 mL/hr lasts 500 ÷ 80 = 6.25 hours, or 6 hours 15 minutes. Hung at 9:30 PM, it finishes at 3:45 AM. Enter a start time above and the calculator gives the finish time directly.</p>
<p>If a bag is partly infused, use the volume remaining, not the original bag size. With 350 mL left at 125 mL/hr there are 2 hours 48 minutes to go.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate drops per minute with a 60 gtt set?', a: 'With a 60 gtt/mL microdrip set, drops per minute equal mL per hour. An order for 50 mL/hr runs at 50 gtt/min.' },
    { q: 'What is the shortcut for 15 gtt/mL tubing?', a: 'Divide the mL/hr rate by 4. 125 mL/hr ÷ 4 = 31.25, so about 31 gtt/min. For 10 gtt/mL divide by 6; for 20 gtt/mL divide by 3.' },
    { q: 'Should you round IV drip rates?', a: 'Yes. You cannot count part of a drop, so round gtt/min to the nearest whole number. Pump rates in mL/hr are entered to the precision the pump allows, often one decimal.' },
    { q: 'How do you calculate mL/hr from drops per minute?', a: 'mL/hr = gtt/min × 60 ÷ drop factor. 25 gtt/min with 20 gtt/mL tubing is 25 × 60 ÷ 20 = 75 mL/hr.' },
    { q: 'How many drops per minute is 100 mL/hr?', a: 'It depends on the tubing: about 17 gtt/min with 10 gtt/mL, 25 with 15 gtt/mL, 33 with 20 gtt/mL and 100 with a 60 gtt/mL microdrip.' },
    { q: 'How do you calculate the drip rate for 1 liter over 12 hours?', a: '1,000 mL ÷ 12 h = 83.3 mL/hr. With 15 gtt/mL tubing: 1,000 × 15 ÷ 720 min = 20.8, so 21 gtt/min.' },
    { q: 'Where do I find the drop factor?', a: 'It is printed on the IV tubing package, for example "10 drops = 1 mL" or "60 gtt/mL". It varies by manufacturer and set, so check the one you are using.' }
  ],
  related: ['anc-calculator', 'map-calculator', 'tidal-volume-calculator', 'ecg-heart-rate-calculator'],
  sources: [
    { name: 'Open RN: Nursing Advanced Skills, intravenous infusion (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK594492/' },
    { name: 'U.S. Food and Drug Administration: Infusion Pumps', url: 'https://www.fda.gov/medical-devices/general-hospital-devices-and-supplies/infusion-pumps' },
    { name: 'ISMP: Guidelines for Optimizing Safe Implementation and Use of Smart Infusion Pumps', url: 'https://www.ismp.org/guidelines/safe-implementation-and-use-smart-pumps' }
  ],
  disclaimer: 'For dosage-calculation practice and education. Follow the prescriber\'s order, your facility\'s policy and an independent double-check before running any infusion.'
};
