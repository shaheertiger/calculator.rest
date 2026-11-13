export default {
  slug: 'amp-hours-calculator',
  hub: 'electrical',
  name: 'Amp Hours Calculator',
  title: 'Amp Hours Calculator: 1,280 Wh at 12.8 V Is 100 Ah',
  h1: 'Amp Hour Calculator: Battery Ah from Watt-Hours, Loads or mAh',
  meta: 'Ah = watt-hours ÷ volts, so a 1,280 Wh, 12.8 V lithium battery is 100 Ah. Also sizes the Ah a load needs and converts mAh to Ah for phones and power banks.',
  keyword: 'how to calculate amp hours',
  also: ['how do you calculate amp hours', 'how to calculate battery amp hours', 'how to calculate battery ah', 'how do you calculate amp hours for a battery', 'how to calculate battery ampere hour', 'how to calculate amp hours in a battery', 'how to calculate milliamp hours', 'how to calculate capacity of a battery'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'wh', options: [['wh', 'Ah from watt-hours and voltage'], ['load', 'Ah a load needs (battery sizing)'], ['mah', 'Convert mAh to Ah and Wh']] },
    { id: 'wh', label: 'Battery energy', type: 'number', value: 1280, suffix: 'Wh', help: 'Printed on most lithium batteries; 1 kWh = 1,000 Wh.', showIf: { mode: ['wh'] } },
    { id: 'mah', label: 'Capacity', type: 'number', value: 5000, suffix: 'mAh', showIf: { mode: ['mah'] } },
    { id: 'watts', label: 'Load power', type: 'number', value: 60, suffix: 'W', help: 'For a DC load rated in amps, enter amps × volts.', showIf: { mode: ['load'] } },
    { id: 'hours', label: 'Hours of use between charges', type: 'number', value: 10, suffix: 'h', showIf: { mode: ['load'] } },
    { id: 'volts', label: 'Battery voltage', type: 'number', value: 12.8, suffix: 'V', help: 'Nominal: 12 V lead-acid, 12.8 V LiFePO4, 24 or 48 V for larger banks.', showIf: { mode: ['wh', 'load'] } },
    { id: 'cellv', label: 'Cell voltage', type: 'number', value: 3.85, suffix: 'V', help: 'Printed on the battery: usually 3.6–3.85 V for phones and power banks.', showIf: { mode: ['mah'] } },
    { id: 'dod', label: 'Usable depth of discharge', type: 'number', value: 50, suffix: '%', help: '50% for lead-acid/AGM; 80–100% for LiFePO4.', showIf: { mode: ['load'] } }
  ],
  compute(v, H) {
    var V = v.mode === 'mah' ? v.cellv : v.volts;
    if (!(V > 0)) return { error: 'Enter the battery voltage.' };
    if (v.mode === 'mah') {
      if (!(v.mah > 0)) return { error: 'Enter the capacity in mAh.' };
      var ah = v.mah / 1000;
      return {
        value: H.num(ah, 3) + ' Ah', label: 'Amp-hours', expr: H.num(v.mah, 0) + ' mAh ÷ 1,000',
        rows: [['Energy', H.num(ah * V, 2) + ' Wh', true], ['Energy in kWh', H.num(ah * V / 1000, 4) + ' kWh'], ['Hours at a 500 mA draw', H.num(ah / 0.5, 1) + ' h']],
        sub: 'mAh only compares batteries of the same voltage; Wh compares any two.'
      };
    }
    if (v.mode === 'load') {
      if (!(v.watts > 0)) return { error: 'Enter the load in watts.' };
      if (!(v.hours > 0)) return { error: 'Enter the hours of use.' };
      if (!(v.dod > 0 && v.dod <= 100)) return { error: 'Depth of discharge must be between 1% and 100%.' };
      var amps = v.watts / V, used = amps * v.hours, buy = used / (v.dod / 100);
      return {
        value: H.num(used, 1) + ' Ah', label: 'Amp-hours the load uses',
        expr: H.num(v.watts, 1) + ' W ÷ ' + H.num(V, 2) + ' V × ' + H.num(v.hours, 2) + ' h',
        rows: [['Current draw', H.num(amps, 2) + ' A'], ['Energy used', H.num(v.watts * v.hours, 0) + ' Wh'], ['Battery rating to buy at ' + H.num(v.dod, 0) + '% DoD', H.num(buy, 0) + ' Ah', true]],
        sub: 'Add about 10% if the load runs through an inverter, and more for cold weather.'
      };
    }
    if (!(v.wh > 0)) return { error: 'Enter the battery energy in Wh.' };
    var c = v.wh / V;
    return {
      value: H.num(c, 1) + ' Ah', label: 'Battery capacity (amp-hours)', expr: H.num(v.wh, 0) + ' Wh ÷ ' + H.num(V, 2) + ' V',
      rows: [['In milliamp-hours', H.num(c * 1000, 0) + ' mAh'], ['Energy in kWh', H.num(v.wh / 1000, 3) + ' kWh'], ['20-hour rate current (C/20)', H.num(c / 20, 2) + ' A', true], ['1C current (full capacity in 1 hour)', H.num(c, 1) + ' A']],
      sub: 'Ratings are usually quoted at the 20-hour rate; faster discharge gives fewer usable amp-hours, especially from lead-acid.'
    };
  },
  quick: ({ r }) => `To calculate amp hours, divide watt-hours by voltage: a <strong>1,280 Wh</strong> lithium (LiFePO4) battery at 12.8 V nominal holds 1,280 ÷ 12.8 = <strong>${r.value}</strong>. From a load, multiply amps by hours: drawing 5 A for 20 hours uses 100 Ah. For phone and power-bank cells, divide mAh by 1,000 (5,000 mAh = 5 Ah).`,
  stepsTitle: 'How to calculate battery amp hours',
  steps: [
    'Read the label. Many batteries print Ah directly; lithium packs often print Wh, and small cells print mAh.',
    'Use the <strong>nominal</strong> voltage, not the charging voltage: 12 V for lead-acid, 12.8 V for a 4-cell LiFePO4, 3.6–3.85 V for a lithium-ion cell. Using 14.4 V charging voltage understates Ah by about 11%.',
    'Divide watt-hours by volts to get Ah, or divide mAh by 1,000.',
    'To size a battery for a load, multiply the load\'s amps by its hours of use, then divide by the usable depth of discharge (0.5 for lead-acid).'
  ],
  formulaTitle: 'What is the amp-hour formula?',
  formula: {
    expr: 'Ah = Wh ÷ V<br>Ah used = load amps × hours = (load W ÷ V) × hours<br>Ah = mAh ÷ 1,000<br>Battery Ah to buy = Ah used ÷ depth of discharge',
    vars: [['Ah', 'amp-hours: one amp flowing for one hour'], ['Wh', 'watt-hours of stored energy'], ['V', 'nominal battery voltage'], ['DoD', 'fraction of capacity you plan to use per cycle']]
  },
  example: `<p>A camper wants to run a 12 V fridge averaging 45 W, LED lights at 15 W and a fan at 10 W for 10 hours overnight from a lead-acid battery.</p>
<p>Total load = 70 W. Current = 70 ÷ 12 = <strong>5.83 A</strong>. Amp-hours used = 5.83 × 10 = <strong>58.3 Ah</strong>.</p>
<p>At a 50% depth of discharge, the battery should be rated 58.3 ÷ 0.5 = <strong>117 Ah</strong> or more, so a 120 Ah battery or two 100 Ah batteries in parallel. A LiFePO4 battery used to 90% would need only 58.3 ÷ 0.9 = 65 Ah.</p>`,
  table: {
    title: 'How many amp hours do I need for a 12 V load?',
    intro: 'Amp-hours consumed by DC loads on a 12 V system, and the battery rating needed to supply them for a full day without going below the usable depth of discharge.',
    head: ['Load', 'Current at 12 V', 'Ah for 8 h', 'Ah for 24 h', 'Lead-acid for 24 h (50% DoD)', 'LiFePO4 for 24 h (90% DoD)'],
    rows: ({ run, H }) => [10, 25, 50, 75, 100, 150, 200, 300, 500, 1000].map(w => {
      const a = run({ mode: 'load', watts: w, hours: 8, volts: 12, dod: 50 }), b = run({ mode: 'load', watts: w, hours: 24, volts: 12, dod: 50 }), c = run({ mode: 'load', watts: w, hours: 24, volts: 12, dod: 90 });
      return [H.num(w, 0) + ' W', a.rows[0][1], a.value, b.value, b.rows[2][1], c.rows[2][1]];
    }),
    note: 'Calculated at a flat 12 V for comparison. Add roughly 10% for AC loads running through an inverter.'
  },
  sections: [
    {
      h2: 'How do you calculate amp hours of a battery you already have?',
      html: `<p>If the label gives Ah, that is the rated capacity, usually measured at the 20-hour rate (C/20): a 100 Ah battery can deliver 5 A for 20 hours before reaching its cutoff voltage. If it gives Wh, divide by nominal voltage. If it gives only reserve capacity (RC), as many car batteries do, RC is the minutes the battery can supply 25 A, so a rough Ah figure at that rate is RC × 25 ÷ 60. An RC of 120 minutes is about 50 Ah.</p>
<p>To measure real capacity, fully charge the battery, discharge it at a steady known current until it hits the manufacturer's cutoff voltage, and multiply amps by hours. An older battery that lasts 14 hours at 5 A has about 70 Ah left of its original 100.</p>`
    },
    {
      h2: 'How do you calculate milliamp hours?',
      html: `<p>Milliamp-hours are amp-hours × 1,000. A device drawing 250 mA for 8 hours uses 250 × 8 = 2,000 mAh. A 20,000 mAh power bank holds 20 Ah at its internal cell voltage of 3.6–3.7 V, which is about 74 Wh.</p>
<p>The trap is comparing mAh across voltages. A phone battery of 5,000 mAh at 3.85 V stores 19.25 Wh; a 5,000 mAh battery at 7.4 V stores twice as much. When the voltages differ, compare watt-hours with the <a href="/watt-hours-calculator">watt hours calculator</a>.</p>`
    },
    {
      h2: 'Do amp hours add up when batteries are wired together?',
      html: `<ul><li><strong>Parallel</strong> (positive to positive): amp-hours add and voltage stays the same. Two 12 V 100 Ah batteries make 12 V 200 Ah.</li>
<li><strong>Series</strong> (positive to negative): voltage adds and amp-hours stay the same. Two 12 V 100 Ah batteries make 24 V 100 Ah.</li>
<li>Either way the stored energy doubles: 2,400 Wh in both cases. That is why Wh is the fairer number when you compare a 24 V or 48 V bank with a 12 V one.</li></ul>
<p>Only combine batteries of the same type, age and capacity, and follow the manufacturer's limits on how many can be paralleled.</p>`
    },
    {
      h2: 'Why should you not use all the amp hours?',
      html: `<p>Lead-acid and AGM batteries last far longer when they are routinely discharged only to about 50%; draining them flat shortens cycle life sharply. LiFePO4 batteries tolerate 80–100% depth of discharge, which is why a 100 Ah lithium battery delivers roughly what a 200 Ah lead-acid bank does in daily use. Cold also cuts available capacity, and heavy loads reduce lead-acid capacity below the 20-hour rating. To turn amp-hours into an actual runtime with these losses included, use the <a href="/battery-life-calculator">battery life calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How many amp hours is a 12V 1,200 Wh battery?', a: '1,200 Wh ÷ 12 V = 100 Ah. A 12.8 V LiFePO4 battery of the same Wh would be 93.75 Ah.' },
    { q: 'How do you convert Ah to Wh?', a: 'Multiply amp-hours by nominal voltage: 100 Ah × 12 V = 1,200 Wh.' },
    { q: 'How many amp hours does a 100 W load use?', a: 'On 12 V, 100 W draws 8.33 A, so it uses 8.33 Ah every hour, or 200 Ah in 24 hours.' },
    { q: 'What is the difference between Ah and mAh?', a: 'Only scale: 1 Ah = 1,000 mAh. Ah is used for vehicle and solar batteries, mAh for phones, power banks and small cells.' },
    { q: 'Do two 100Ah batteries make 200Ah?', a: 'Yes, if wired in parallel at the same voltage. In series they make a 100 Ah battery at double the voltage.' },
    { q: 'What does C-rate mean?', a: 'C-rate is discharge current relative to capacity. For a 100 Ah battery, 1C is 100 A, C/10 is 10 A and C/20 is 5 A. A capacity rating only applies at the C-rate it was rated at.' },
    { q: 'How many amp hours is a car battery?', a: 'Most passenger-car starting batteries hold roughly 40 to 80 Ah, but they are designed for short, high-current bursts, not deep cycling. Use a deep-cycle battery for running loads.' }
  ],
  related: ['watt-hours-calculator', 'battery-life-calculator', 'solar-panel-calculator', 'amps-calculator'],
  sources: [
    { name: 'FAA PackSafe: Lithium Batteries (Wh = V × Ah)', url: 'https://www.faa.gov/hazmat/packsafe/lithium-batteries' },
    { name: 'U.S. DOE: Batteries, Charging, and Electric Vehicles', url: 'https://www.energy.gov/cmei/vehicles/batteries-charging-and-electric-vehicles' },
    { name: 'NIST: SI Units', url: 'https://www.nist.gov/pml/owm/metric-si/si-units' }
  ]
};
