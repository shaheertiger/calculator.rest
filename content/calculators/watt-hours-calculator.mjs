export default {
  slug: 'watt-hours-calculator',
  hub: 'electrical',
  name: 'Watt Hours Calculator',
  title: 'Watt Hours Calculator: 20,000 mAh at 3.7 V = 74 Wh',
  h1: 'Watt-Hour Calculator: Battery Wh from mAh or Ah, and Device Energy',
  meta: 'Watt-hours = amp-hours × volts. A 20,000 mAh power bank at 3.7 V stores 74 Wh, under the FAA\'s 100 Wh carry-on limit. Also finds Wh used by any device.',
  keyword: 'how to calculate watt hours',
  also: ['how to calculate watt hour', 'how do you calculate battery watt hours', 'how to calculate battery watt hours', 'how to calculate watt-hours of a battery', 'how to calculate wh of a battery', 'how to calculate watt hours of a power bank', 'how to calculate watt of mobile charger'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'battery', options: [['battery', 'Battery capacity in Wh'], ['device', 'Energy a device uses']] },
    { id: 'unit', label: 'Capacity unit', type: 'select', value: 'mah', options: [['mah', 'mAh (phones, power banks)'], ['ah', 'Ah (12 V, e-bike, solar)']], showIf: { mode: ['battery'] } },
    { id: 'cap', label: 'Capacity', type: 'number', value: 20000, help: 'The number before mAh or Ah on the label.', showIf: { mode: ['battery'] } },
    { id: 'volts', label: 'Nominal voltage', type: 'number', value: 3.7, suffix: 'V', help: 'Use the cell voltage (3.6–3.85 V for lithium-ion), not the 5 V USB output.', showIf: { mode: ['battery'] } },
    { id: 'load', label: 'Device draw (optional)', type: 'number', value: '', suffix: 'W', placeholder: 'e.g. 10', help: 'Adds a rough runtime estimate.', showIf: { mode: ['battery'] } },
    { id: 'watts', label: 'Device power', type: 'number', value: 65, suffix: 'W', showIf: { mode: ['device'] } },
    { id: 'hours', label: 'Hours used per day', type: 'number', value: 3, suffix: 'h', showIf: { mode: ['device'] } }
  ],
  compute(v, H) {
    if (v.mode === 'device') {
      if (!(v.watts > 0)) return { error: 'Enter the device power in watts.' };
      if (!(v.hours > 0 && v.hours <= 24)) return { error: 'Enter hours per day between 0 and 24.' };
      var wh = v.watts * v.hours;
      return {
        value: H.num(wh, 1) + ' Wh', label: 'Energy per day', expr: H.num(v.watts, 1) + ' W × ' + H.num(v.hours, 2) + ' h',
        rows: [['Per day in kWh', H.num(wh / 1000, 3) + ' kWh'], ['Per 30 days', H.num(wh * 30 / 1000, 2) + ' kWh', true], ['Per year', H.num(wh * 365 / 1000, 1) + ' kWh']],
        sub: 'Nameplate watts are a maximum; chargers and computers often draw less on average.'
      };
    }
    if (!(v.cap > 0)) return { error: 'Enter the battery capacity.' };
    if (!(v.volts > 0)) return { error: 'Enter the battery voltage.' };
    var ah = v.unit === 'mah' ? v.cap / 1000 : v.cap;
    var w = ah * v.volts;
    var faa = w <= 100 ? 'Allowed in carry-on (not checked bags)' : w <= 160 ? 'Needs airline approval; 2 spares max' : 'Not allowed in passenger bags';
    var rows = [['Amp-hours', H.num(ah, 3) + ' Ah'], ['Kilowatt-hours', H.num(w / 1000, 4) + ' kWh'], ['Energy in joules', H.num(w * 3600, 0) + ' J'], ['FAA rule for a spare lithium-ion battery', faa, true]];
    if (v.load > 0) rows.push(['Runtime at ' + H.num(v.load, 1) + ' W (before losses)', H.num(w / v.load, 1) + ' h']);
    return {
      value: H.num(w, 2) + ' Wh', label: 'Stored energy (watt-hours)',
      expr: H.num(ah, 3) + ' Ah × ' + H.num(v.volts, 2) + ' V', rows: rows,
      sub: 'Usable output is lower: USB power banks typically deliver around two-thirds to nine-tenths of rated Wh after voltage conversion.'
    };
  },
  quick: ({ r }) => `To calculate watt-hours, multiply amp-hours by voltage. A <strong>20,000 mAh</strong> power bank is 20 Ah, and at its 3.7 V cell voltage that is 20 × 3.7 = <strong>${r.value}</strong>, under the FAA's 100 Wh limit for carry-on batteries. For devices, multiply watts by hours: a 65 W laptop used 3 hours a day consumes 195 Wh.`,
  stepsTitle: 'How to calculate watt hours of a battery',
  steps: [
    'Find the capacity on the label. If it is in mAh, divide by 1,000 to get Ah.',
    'Find the nominal voltage. <strong>Use the battery\'s own voltage, not the USB output:</strong> power banks are 3.6–3.7 V inside even though they charge your phone at 5 V or more.',
    'Multiply Ah × V. The result is watt-hours; divide by 1,000 for kWh.',
    'For a device, multiply its power in watts by the hours it runs. Watt-hours stored ÷ device watts gives an upper-bound runtime.'
  ],
  formulaTitle: 'What is the watt-hour formula?',
  formula: {
    expr: 'Wh = Ah × V = (mAh ÷ 1,000) × V<br>Wh used = W × hours<br>kWh = Wh ÷ 1,000 &nbsp;·&nbsp; 1 Wh = 3,600 joules',
    vars: [['Wh', 'watt-hours, energy'], ['Ah / mAh', 'amp-hours / milliamp-hours, charge'], ['V', 'nominal voltage'], ['W', 'power in watts']]
  },
  example: `<p>An e-bike battery is labeled 48 V 14 Ah. Energy = 48 × 14 = <strong>672 Wh</strong>.</p>
<p>If the bike averages 15 Wh per mile on flat ground with moderate assist, a full charge covers about 672 ÷ 15 = <strong>45 miles</strong>.</p>
<p>A phone battery of 5,000 mAh at 3.85 V is 5 × 3.85 = <strong>19.25 Wh</strong>, so the e-bike pack stores about as much as 35 phone batteries.</p>`,
  table: {
    title: 'How many watt-hours are common batteries?',
    intro: 'Typical label ratings converted to watt-hours by the calculator above. Check your own battery\'s label; capacities vary by model.',
    head: ['Battery', 'Label rating', 'Watt-hours', 'kWh'],
    rows: ({ run, H }) => [
      ['AA NiMH rechargeable', 'ah', 2, 1.2], ['Phone battery', 'mah', 5000, 3.85], ['Power bank', 'mah', 10000, 3.7], ['Power bank', 'mah', 20000, 3.7], ['Large power bank', 'mah', 26800, 3.7],
      ['E-bike pack', 'ah', 14, 48], ['Car starting battery', 'ah', 60, 12], ['Deep-cycle lead-acid', 'ah', 100, 12], ['LiFePO4 RV battery', 'ah', 100, 12.8], ['6 V golf-cart battery', 'ah', 225, 6], ['48 V rack battery', 'ah', 100, 51.2]
    ].map(([n, u, c, vv]) => { const r = run({ mode: 'battery', unit: u, cap: c, volts: vv, load: NaN }); return [n, (u === 'mah' ? H.num(c, 0) + ' mAh' : H.num(c, 1) + ' Ah') + ' at ' + H.num(vv, 2) + ' V', r.value, r.rows[1][1]]; }),
    note: 'The 26,800 mAh size is popular because 26.8 Ah × 3.7 V = 99.16 Wh, just under the 100 Wh airline threshold.'
  },
  sections: [
    {
      h2: 'How do you calculate watt-hours of a power bank?',
      html: `<p>Multiply the mAh rating by the internal cell voltage and divide by 1,000. Almost every lithium-ion power bank uses 3.6 V or 3.7 V cells, so 10,000 mAh is 36–37 Wh and 20,000 mAh is 72–74 Wh. Many now print the Wh figure next to the mAh rating; use that if it is there.</p>
<p>Two practical points follow. First, airlines care about Wh: the FAA limits spare lithium-ion batteries, including power banks, to 100 Wh each in carry-on bags, allows up to two between 101 and 160 Wh with airline approval, and bans spares from checked bags. Second, you will not get the full rating out. Boosting 3.7 V to 5–20 V USB output and charging the phone's own battery both lose energy, so a 74 Wh bank typically delivers something like 50–65 Wh into a phone.</p>`
    },
    {
      h2: 'How do you calculate watt-hours from watts and time?',
      html: `<p>Multiply power by duration: Wh = W × h. A 10 W LED lamp left on for 6 hours uses 60 Wh. A 1,500 W hair dryer used for 10 minutes uses 1,500 × (10 ÷ 60) = 250 Wh. Convert minutes to hours by dividing by 60 before multiplying.</p>
<p>Your utility bills in kilowatt-hours, so divide by 1,000: the laptop in the default example uses 195 Wh a day, which is 5.85 kWh over 30 days. The <a href="/electricity-cost-calculator">electricity cost calculator</a> turns that into dollars at your rate.</p>`
    },
    {
      h2: 'How do you calculate the watts of a mobile charger?',
      html: `<p>Multiply the output voltage by the output current printed on the charger: watts = volts × amps. A basic 5 V 2 A USB charger is 10 W; a USB-C Power Delivery charger listing 9 V 2.22 A is 20 W, and one listing 20 V 3.25 A is 65 W. The charger only supplies what the device asks for, so a phone on a 65 W charger may still draw 20 W or less.</p>
<p>Charging time is roughly battery Wh ÷ charging watts, plus 10–20% for losses and the slower final stretch. A 19.25 Wh phone battery on a 20 W charger refills in about an hour to an hour and a half.</p>`
    },
    {
      h2: 'Should you compare batteries in Wh or mAh?',
      html: `<p>Use Wh whenever the voltages differ. mAh measures charge, not energy, so a 3,000 mAh battery at 7.4 V holds twice the energy of a 3,000 mAh battery at 3.7 V. Watt-hours already include voltage, which is why airlines, laptop makers and EV makers all quote Wh or kWh. To go the other way, from Wh back to amp-hours, use the <a href="/amp-hours-calculator">amp hours calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How many watt-hours is 20,000 mAh?', a: 'At 3.7 V, 20,000 mAh is 74 Wh (20 Ah × 3.7 V). At 3.6 V it is 72 Wh.' },
    { q: 'How many watt-hours is a 12V 100Ah battery?', a: '1,200 Wh (100 × 12). A 12.8 V LiFePO4 battery of 100 Ah is 1,280 Wh.' },
    { q: 'Can I take a 100 Wh power bank on a plane?', a: 'Yes. The FAA allows spare lithium-ion batteries up to 100 Wh in carry-on baggage without airline approval. They are not allowed in checked bags, and individual airlines may set stricter limits.' },
    { q: 'How many Wh are in a kWh?', a: '1,000. A 13.5 kWh home battery stores 13,500 Wh.' },
    { q: 'How do you convert watt-hours to joules?', a: 'Multiply by 3,600, because a watt is one joule per second and an hour has 3,600 seconds. 74 Wh = 266,400 J.' },
    { q: 'How long will a 74 Wh power bank run a 10 W device?', a: 'Up to 7.4 hours in theory, but after conversion losses expect roughly 5 to 6.5 hours.' },
    { q: 'How do you find watt-hours if the label shows only mAh and 5 V?', a: 'The 5 V figure is the USB output, not the cell voltage. Use 3.7 V with the mAh rating unless the label states a different cell voltage or prints the Wh value directly.' }
  ],
  related: ['amp-hours-calculator', 'battery-life-calculator', 'electricity-cost-calculator', 'joules-calculator'],
  sources: [
    { name: 'FAA PackSafe: Lithium Batteries', url: 'https://www.faa.gov/hazmat/packsafe/lithium-batteries' },
    { name: 'NIST: SI Units (watt, joule)', url: 'https://www.nist.gov/pml/owm/metric-si/si-units' },
    { name: 'U.S. EIA: Use of electricity', url: 'https://www.eia.gov/energyexplained/electricity/use-of-electricity.php' }
  ]
};
