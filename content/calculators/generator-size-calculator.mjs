export default {
  slug: 'generator-size-calculator',
  hub: 'electrical',
  name: 'Generator Size Calculator',
  title: 'Generator Size Calculator: 5,475 W Runs Fridge, Sump, Furnace',
  h1: 'What Size Generator Do I Need? Add Up Running and Starting Watts',
  meta: 'A fridge, sump pump, furnace fan, lights, TV and microwave need 3,975 running and 5,475 starting watts. List your own appliances to size a generator.',
  keyword: 'how to calculate what size generator i need',
  also: ['generator size calculator'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'items', label: 'Appliances you want to run at the same time', type: 'rows', addLabel: '+ add appliance', max: 30, wide: true,
      fields: [
        { id: 'name', label: 'Appliance', type: 'text', value: '', blank: true, placeholder: 'e.g. Well pump' },
        { id: 'run', label: 'Running watts', type: 'number', value: 500 },
        { id: 'start', label: 'Starting watts (total; 0 if no motor)', type: 'number', value: 0 }
      ],
      value: [
        { name: 'Refrigerator', run: 700, start: 2200 },
        { name: 'Sump pump (1/2 hp)', run: 1050, start: 2150 },
        { name: 'Furnace blower (1/2 hp)', run: 875, start: 2350 },
        { name: 'LED lights (10 bulbs)', run: 100, start: 0 },
        { name: 'TV and internet router', run: 250, start: 0 },
        { name: 'Microwave', run: 1000, start: 0 }
      ]
    },
    { id: 'margin', label: 'Headroom on running watts', type: 'select', value: '20', options: [['0', 'None'], ['10', '10%'], ['20', '20% (recommended)'], ['25', '25%']] }
  ],
  compute(v, H) {
    var run = 0, bestExtra = 0, bestName = '', n = 0;
    (Array.isArray(v.items) ? v.items : []).forEach(function (it, i) {
      if (!(it.run > 0)) return;
      n++; run += it.run;
      var extra = it.start > it.run ? it.start - it.run : 0;
      if (extra > bestExtra) { bestExtra = extra; bestName = it.name || ('Item ' + (i + 1)); }
    });
    if (!n) return { error: 'Add at least one appliance with its running watts.' };
    var peak = run + bestExtra;
    var m = Number(v.margin) || 0;
    var rec = run * (1 + m / 100);
    var rows = [
      ['Running watts (all on together)', H.int(run) + ' W', true],
      ['Largest motor surge', bestExtra ? '+' + H.int(bestExtra) + ' W (' + H.esc(bestName) + ')' : 'none'],
      ['Running rating with ' + m + '% headroom', H.int(rec) + ' W'],
      ['Running current at 240 V / 120 V', H.num(run / 240, 1) + ' A / ' + H.num(run / 120, 1) + ' A']
    ];
    return {
      value: H.int(peak) + ' W', label: 'Starting (surge) watts the generator must supply',
      expr: H.int(run) + ' W running + ' + H.int(bestExtra) + ' W surge',
      rows: rows,
      sub: 'Choose a generator rated at least ' + H.int(rec) + ' running watts and ' + H.int(Math.max(peak, rec)) + ' starting watts. Start motors one at a time.'
    };
  },
  quick: ({ r }) => `To calculate what size generator you need, add the running watts of everything you will use at once, then add the extra starting watts of the single biggest motor. A refrigerator, sump pump, furnace blower, lights, TV and microwave total 3,975 running watts; the fridge's 1,500 W start-up surge brings the peak to <strong>${r.value}</strong>. With 20% headroom, look for about 4,770 running watts.`,
  stepsTitle: 'How to calculate what size generator you need',
  steps: [
    'List everything you want powered at the same time during an outage. Be realistic: you can run the microwave and the well pump at different moments.',
    'Write down each item\'s <strong>running</strong> watts from its nameplate or manual. If only amps are listed, multiply amps by volts (120 or 240).',
    'Find <strong>starting</strong> watts for anything with a motor or compressor: refrigerators, freezers, pumps, furnace blowers, air conditioners. These can briefly need two to three times their running watts or more.',
    'Add all running watts, then add only the <em>largest</em> extra starting surge (starting minus running). <strong>Adding every surge together oversizes the generator</strong>, as long as you start motors one at a time.',
    'Add 10–25% headroom to the running total so the generator is not run flat out, then pick a model whose running and starting ratings both clear your numbers.'
  ],
  formulaTitle: 'What is the generator sizing formula?',
  formula: {
    expr: 'Running watts needed = Σ running watts<br>Starting watts needed = Σ running watts + max(starting − running)<br>Recommended rated watts = Σ running watts × (1 + headroom)',
    vars: [['running watts', 'continuous power once the appliance is up to speed'], ['starting watts', 'brief peak when a motor or compressor starts'], ['headroom', 'spare capacity, typically 10–25%']]
  },
  example: `<p>A rural home needs a 1/2 hp well pump (1,000 W running, 2,100 W starting), a refrigerator (700 / 2,200), a chest freezer (400 / 1,200), lights and a laptop (200 W) and a 1,500 W space heater.</p>
<p>Running total = 1,000 + 700 + 400 + 200 + 1,500 = <strong>3,800 W</strong>. Extra surges: pump 1,100, fridge 1,500, freezer 800. The largest is the fridge's 1,500 W, so peak = <strong>5,300 W</strong>.</p>
<p>With 20% headroom the running rating should be about 4,560 W. A generator rated around 5,000 running / 6,000+ starting watts covers it. Dropping the space heater cuts the need to 2,300 running and 3,800 starting watts.</p>`,
  table: {
    title: 'How many watts do common appliances need on a generator?',
    intro: 'Typical running and starting watts as listed in generator manufacturers\' wattage guides. Your appliance\'s nameplate is the real number; motors vary a lot by age and size.',
    head: ['Appliance', 'Running watts', 'Starting watts', 'Running amps', 'Alone: starting / running +20%'],
    rows: ({ run, H }) => [['Refrigerator / freezer', 700, 2200, 120], ['Chest freezer', 400, 1200, 120], ['Sump pump (1/2 hp)', 1050, 2150, 120], ['Furnace blower (1/2 hp)', 875, 2350, 120], ['Window AC (10,000 BTU)', 1200, 3600, 120], ['Washing machine', 1150, 2250, 120], ['Microwave (1,000 W)', 1000, 0, 120], ['Coffee maker', 1000, 0, 120], ['Space heater', 1500, 0, 120], ['Electric water heater', 4500, 0, 240], ['TV (LED)', 100, 0, 120], ['Wi-Fi router and modem', 20, 0, 120], ['CPAP machine', 50, 0, 120]].map(([n, r, s, volts]) => {
      const res = run({ items: [{ name: n, run: r, start: s }], margin: '20' });
      return [n, H.int(r) + ' W', s ? H.int(s) + ' W' : '—', H.num(r / volts, 1) + ' A at ' + volts + ' V', res.value + ' / ' + res.rows[2][1]];
    }),
    note: 'Starting watts here are the total at start-up. Some generator charts list "additional starting watts" instead, which excludes the running watts; do not add both.'
  },
  sections: [
    {
      h2: 'How many watts do I need to run my house on a generator?',
      html: `<p>For essentials only (refrigerator, sump or well pump, furnace blower, lights, phone charging, internet and a few small appliances), most homes land between about 3,500 and 7,500 running watts, which is the range of a mid-size portable generator. Adding a window air conditioner or an electric water heater pushes that higher quickly.</p>
<p>Running the <em>whole</em> house, including central air, an electric range and an electric dryer, typically takes a permanently installed standby generator. Home standby units are commonly sold from roughly 10 kW to 26 kW, and electric heat or several air conditioners can call for more. A whole-house unit is sized from a load calculation like the one in NEC Article 220, so ask the installer for theirs. The <a href="/kva-calculator">kVA calculator</a> converts commercial generator ratings, which are listed in kVA at 0.8 power factor.</p>`
    },
    {
      h2: 'What is the difference between starting watts and running watts?',
      html: `<p>Running (rated) watts are what a generator can supply continuously. Starting (surge or peak) watts are a short burst, a few seconds at most, that it can deliver while a motor spins up. An induction motor can pull several times its running current for a second or two while it accelerates, so a refrigerator that runs at 700 W might need 2,200 W to start.</p>
<p>Generators advertise both numbers, and the bigger one is printed larger. A "4,500 W" portable may only be a 3,600 W running unit. Size the running rating to your continuous load and check that the starting rating covers your biggest motor on top of it.</p>
<p>Inverter generators produce cleaner power that is gentler on electronics and are usually quieter and more fuel-efficient at light loads, but they tend to have less surge capacity per running watt than open-frame units. Check the starting rating carefully if you need to run a well pump or AC.</p>`
    },
    {
      h2: 'Can a portable generator run central air or a well pump?',
      html: `<p>Often, but these are the loads that decide the generator size. A 240 V well pump needs a generator with a 240 V outlet and a starting rating well above the pump's running watts. A central air conditioner's compressor can draw several times its running current at start-up; a soft-start kit installed on the condenser can cut that surge substantially, often enough to let a large portable start a mid-size system. Check the nameplate's rated load amps (RLA) and locked rotor amps (LRA): LRA × voltage is a worst-case estimate of starting watts.</p>`
    },
    {
      h2: 'How do you connect a generator to a house safely?',
      html: `<ul><li><strong>Use a transfer switch or a listed interlock kit.</strong> Plugging a generator into a wall outlet ("backfeeding") can energize the utility lines and electrocute line workers, and it bypasses your breakers. The NEC requires transfer equipment for optional standby systems (Article 702), and installation should be done by a licensed electrician.</li>
<li><strong>Keep it outside and away from the house.</strong> Generator exhaust contains carbon monoxide, which can kill in minutes. The U.S. Consumer Product Safety Commission advises running portable generators outdoors only, at least 20 feet from the house, with the exhaust pointed away from windows, doors and vents, and installing battery-backed CO alarms.</li>
<li><strong>Size extension cords to the load.</strong> Use outdoor-rated, heavy-gauge cords; a long, thin cord overheats and drops voltage at motor starts.</li></ul>`
    }
  ],
  faq: [
    { q: 'What size generator do I need to run a refrigerator?', a: 'A typical refrigerator runs on about 700 watts but needs around 2,200 watts to start, so a generator of at least 2,000 running / 2,500 starting watts handles it alone. Plan more if anything else runs at the same time.' },
    { q: 'Will a 5,000-watt generator run my house?', a: 'It will run essentials such as a refrigerator, sump pump, furnace blower, lights and electronics if you avoid running large heating loads at the same time. It will not run central air, an electric range or an electric water heater alongside everything else.' },
    { q: 'How do I find the wattage of an appliance?', a: 'Look for a label on the back, bottom or inside the door. If it lists amps and volts but not watts, multiply them: 6 A × 120 V = 720 W. For motors, the starting figure is usually in the manual or can be estimated from locked rotor amps.' },
    { q: 'Should I add every appliance\'s starting watts?', a: 'No. Add all running watts, then add only the largest single surge. Motors that start at different moments do not surge together, and you can control that by switching them on one at a time.' },
    { q: 'How much headroom should a generator have?', a: 'About 20% above your running total is a common recommendation. Generators run more efficiently and last longer below full load, and the margin covers estimating errors.' },
    { q: 'What size generator do I need for a 200 amp service?', a: 'Service size does not set generator size; your actual load does. A 200 A, 240 V service could theoretically draw 48 kW, but home standby units are commonly 10–26 kW, and a load calculation decides where in that range (or below it, for essentials only) you fall.' },
    { q: 'Can I run a generator in my garage with the door open?', a: 'No. CPSC warns never to run a generator in a garage, basement or any enclosed space, even with doors or windows open, because carbon monoxide can build up to deadly levels.' }
  ],
  related: ['kva-calculator', 'amps-calculator', 'kw-calculator', 'battery-life-calculator', 'wire-size-calculator'],
  sources: [
    { name: 'U.S. CPSC: Portable Generators', url: 'https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Portable-Generators' },
    { name: 'Ready.gov: Power Outages', url: 'https://www.ready.gov/power-outages' },
    { name: 'NFPA 70: National Electrical Code (Articles 220, 445 and 702)', url: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' }
  ],
  disclaimer: 'Appliance wattages are typical values; use your equipment\'s nameplate. Have a licensed electrician install transfer equipment.'
};
