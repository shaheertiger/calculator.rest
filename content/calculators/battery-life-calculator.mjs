export default {
  slug: 'battery-life-calculator',
  hub: 'electrical',
  name: 'Battery Life Calculator',
  title: 'Battery Life Calculator: 12V 100Ah at 100 W Lasts 5.4 Hours',
  h1: 'Battery Runtime Calculator: How Long Your Battery Will Last',
  meta: 'A 12 V 100 Ah lead-acid battery used to 50% runs a 100 W appliance on a 90% inverter for about 5.4 hours. Enter capacity, load, depth of discharge and losses.',
  keyword: 'how to calculate how long a battery will last',
  also: ['battery life calculator', 'how long will battery last calculator', 'how to calculate battery run time', 'battery runtime calculator', 'how long will a 100ah battery last'],
  updated: '2026-11-13',
  inputs: [
    { id: 'cap', label: 'Battery capacity', type: 'number', value: 100 },
    { id: 'capUnit', label: 'Capacity unit', type: 'select', value: 'ah', options: [['ah', 'Ah'], ['mah', 'mAh'], ['wh', 'Wh']] },
    { id: 'volts', label: 'Battery voltage', type: 'number', value: 12, suffix: 'V', help: '12 V lead-acid, 12.8 V LiFePO4, 3.7 V lithium-ion cell.' },
    { id: 'dod', label: 'Usable depth of discharge', type: 'number', value: 50, suffix: '%', help: '50% for lead-acid/AGM, 80–100% for LiFePO4, about 90% for phone-type lithium-ion.' },
    { id: 'load', label: 'Load', type: 'number', value: 100 },
    { id: 'loadUnit', label: 'Load unit', type: 'select', value: 'w', options: [['w', 'watts'], ['a', 'amps'], ['ma', 'milliamps']] },
    { id: 'path', label: 'How the load is powered', type: 'select', value: 'ac', options: [['ac', 'AC appliance through an inverter'], ['dc', 'DC, straight from the battery']] },
    { id: 'eff', label: 'Inverter efficiency', type: 'number', value: 90, suffix: '%', help: 'Most pure-sine inverters run 85–95% near their rated load.', showIf: { path: ['ac'] } },
    { id: 'k', label: 'Peukert exponent (optional)', type: 'number', value: 1, help: '1.0 ignores it. About 1.05 for lithium, 1.1–1.2 for AGM, 1.2–1.3 for flooded lead-acid.' }
  ],
  compute(v, H) {
    if (!(v.cap > 0)) return { error: 'Enter the battery capacity.' };
    if (!(v.volts > 0)) return { error: 'Enter the battery voltage.' };
    if (!(v.dod > 0 && v.dod <= 100)) return { error: 'Depth of discharge must be between 1% and 100%.' };
    if (!(v.load > 0)) return { error: 'Enter the load.' };
    var eff = v.path === 'ac' ? v.eff / 100 : 1;
    if (!(eff > 0 && eff <= 1)) return { error: 'Inverter efficiency must be between 1% and 100%.' };
    var k = v.k >= 1 && v.k <= 2 ? v.k : 1;
    var ah = v.capUnit === 'mah' ? v.cap / 1000 : v.capUnit === 'wh' ? v.cap / v.volts : v.cap;
    var wh = ah * v.volts;
    var battW = v.loadUnit === 'w' ? v.load / eff : (v.loadUnit === 'ma' ? v.load / 1000 : v.load) * v.volts / eff;
    var amps = battW / v.volts;
    var hrs = k === 1 ? ah / amps : 20 * Math.pow(ah / (amps * 20), k);
    hrs = hrs * v.dod / 100;
    var mins = hrs * 60;
    var rows = [
      ['Runtime in hours', H.num(hrs, 2) + ' h', true],
      ['Usable energy', H.num(wh * v.dod / 100, wh < 100 ? 2 : 0) + ' Wh of ' + H.num(wh, wh < 100 ? 2 : 0) + ' Wh'],
      ['Current drawn from the battery', amps < 1 ? H.num(amps * 1000, 0) + ' mA' : H.num(amps, 2) + ' A'],
      ['Discharge rate', amps > 0 ? 'C/' + H.num(ah / amps, 1) : '—']
    ];
    if (v.path === 'ac') rows.splice(3, 0, ['Inverter loss', H.num(battW - battW * eff, 1) + ' W']);
    if (hrs >= 48) rows.push(['In days', H.num(hrs / 24, 1) + ' days']);
    return {
      value: H.dur(mins), label: 'Estimated runtime',
      expr: H.num(wh, wh < 100 ? 2 : 0) + ' Wh × ' + H.num(v.dod, 0) + '%' + (v.path === 'ac' ? ' × ' + H.num(eff * 100, 0) + '%' : '') + ' ÷ ' + (v.loadUnit === 'w' ? H.num(v.load, 1) + ' W' : H.num(battW * eff, 2) + ' W') + (k > 1 ? ' (Peukert ' + H.num(k, 2) + ')' : ''),
      rows: rows,
      sub: (ah / amps < 5 ? 'This is a heavy load for the battery (faster than C/5); lead-acid will deliver noticeably less than its rating. ' : '') + 'Real runtime also falls in the cold and as batteries age.'
    };
  },
  quick: ({ r }) => `To calculate how long a battery will last, multiply its watt-hours by the share you can use and divide by the load. A <strong>12 V 100 Ah</strong> lead-acid battery stores 1,200 Wh; using 50% leaves 600 Wh, and a <strong>100 W</strong> appliance on a 90%-efficient inverter pulls 111 W from it, so it runs about 600 ÷ 111 = <strong>${r.value}</strong> (5.4 hours).`,
  stepsTitle: 'How to calculate battery run time',
  steps: [
    'Convert capacity to watt-hours: Ah × volts. A 12 V 100 Ah battery is 1,200 Wh; a 3,000 mAh, 3.7 V cell is 11.1 Wh.',
    'Multiply by the depth of discharge you will actually use. <strong>This is the step most runtime estimates skip</strong>: lead-acid batteries should stop at about 50%, which halves the usable energy.',
    'Work out what the battery really supplies: for AC loads divide appliance watts by inverter efficiency (100 W ÷ 0.9 = 111 W).',
    'Divide usable watt-hours by that wattage to get hours. For lead-acid under heavy loads, apply Peukert\'s exponent to account for lost capacity.'
  ],
  formulaTitle: 'What formula estimates battery life?',
  formula: {
    expr: 'Runtime (h) = Ah × V × DoD × η ÷ Load (W)<br>With Peukert: t = H × (C ÷ (I × H))<sup>k</sup> × DoD',
    vars: [['Ah × V', 'battery energy in watt-hours'], ['DoD', 'usable depth of discharge (0.5 = 50%)'], ['η', 'inverter efficiency for AC loads (1 for DC)'], ['C, H', 'rated capacity in Ah and its rating period, usually 20 hours'], ['I', 'current drawn from the battery'], ['k', 'Peukert exponent, 1.0 for an ideal battery']],
    note: 'Peukert\'s law describes how lead-acid capacity shrinks at higher discharge rates. It is an approximation; manufacturer discharge tables are better when available.'
  },
  example: `<p>A 12.8 V 100 Ah LiFePO4 battery (1,280 Wh) powers a CPAP machine averaging 40 W straight from 12 V DC, used to 90%.</p>
<p>Usable energy = 1,280 × 0.90 = <strong>1,152 Wh</strong>. Runtime = 1,152 ÷ 40 = <strong>28.8 hours</strong>, or about three 9-hour nights.</p>
<p>Through a 90% inverter instead, the machine would pull 44.4 W from the battery and last 25.9 hours. Turning off the CPAP's heated humidifier, often the biggest draw, extends it much further.</p>`,
  table: {
    title: 'How long will a 100Ah battery last?',
    intro: 'Runtime for AC loads through a 90%-efficient inverter, assuming 50% usable capacity for lead-acid and 90% for LiFePO4, with no Peukert correction.',
    head: ['Load', '12 V 100 Ah lead-acid', '12.8 V 100 Ah LiFePO4', '12.8 V 200 Ah LiFePO4'],
    rows: ({ run }) => [25, 50, 100, 150, 200, 300, 500, 800, 1000, 1500].map(w => [w.toLocaleString('en-US') + ' W',
      run({ cap: 100, capUnit: 'ah', volts: 12, dod: 50, load: w, loadUnit: 'w', path: 'ac', eff: 90, k: 1 }).value,
      run({ cap: 100, capUnit: 'ah', volts: 12.8, dod: 90, load: w, loadUnit: 'w', path: 'ac', eff: 90, k: 1 }).value,
      run({ cap: 200, capUnit: 'ah', volts: 12.8, dod: 90, load: w, loadUnit: 'w', path: 'ac', eff: 90, k: 1 }).value]),
    note: 'Loads of 1,000 W and up on a single 100 Ah lead-acid battery discharge it in well under the 20-hour rating period, so real runtime will be shorter than shown. Set a Peukert exponent of 1.2–1.3 above to see the effect.'
  },
  sections: [
    {
      h2: 'How long will a 12V battery last with an inverter?',
      html: `<p>Divide the battery's usable watt-hours by the appliance wattage plus inverter losses. Inverters typically convert 85–95% of battery power into AC near their rated output, and many draw a further few watts to 20+ watts just being switched on. A small load on a big inverter is the worst case: a 1,500 W inverter powering a 20 W phone charger may waste as much as it delivers.</p>
<p>Watch current as well as energy. A 1,000 W microwave on a 12 V system pulls about 1,000 ÷ 0.9 ÷ 12 = 93 A from the battery, which needs heavy cable and a battery rated for that discharge current. Moving to 24 V or 48 V halves or quarters the current for the same power.</p>`
    },
    {
      h2: 'How do you calculate battery life in mAh for small electronics?',
      html: `<p>Divide capacity by the device's current, using the same units: hours = mAh ÷ mA. A 2,000 mAh battery powering a sensor that draws 25 mA lasts 2,000 ÷ 25 = 80 hours in theory. Choose milliamps as the load unit and DC above.</p>
<p>Two corrections matter in practice. Devices that sleep and wake draw an average current far below their peak, so measure or estimate the average (for example, 0.05 mA asleep and 20 mA for 1 second each minute averages about 0.38 mA). And many electronics shut off before the battery is empty, at a cutoff voltage, which is what the depth of discharge setting approximates. Using 80–90% for lithium-ion and alkaline cells gives a realistic figure.</p>`
    },
    {
      h2: 'Why does a lead-acid battery die faster under heavy loads?',
      html: `<p>A lead-acid battery's Ah rating is measured over 20 hours. Pull current faster and the chemistry cannot keep up, so fewer amp-hours come out before the voltage sags to cutoff. Peukert's law models this with an exponent k: at k = 1.25, a 100 Ah battery discharged at 25 A gives roughly 67 Ah rather than 100. LiFePO4 batteries have exponents close to 1.0, which is one reason they run high-power loads so much better.</p>
<p>Temperature compounds it. Lead-acid batteries lose a meaningful share of capacity near freezing, and lithium batteries generally must not be charged below 32°F (0°C) unless they have built-in heating. Plan winter runtime with extra margin.</p>`
    },
    {
      h2: 'What depth of discharge should you plan for?',
      html: `<ul><li><strong>Flooded lead-acid and AGM:</strong> about 50% for daily cycling. Going deeper is possible in an emergency but shortens battery life.</li>
<li><strong>LiFePO4:</strong> 80–100%; most manufacturers rate thousands of cycles at 80% or more.</li>
<li><strong>Phone, laptop and power-tool lithium-ion:</strong> the device manages this itself; plan on about 90% of the rated Wh.</li></ul>
<p>To size a new battery for a known load and runtime, work backwards with the <a href="/amp-hours-calculator">amp hours calculator</a>, and to add solar recharging see the <a href="/solar-panel-calculator">solar panel calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How long will a 100Ah battery run a 1,000 W load?', a: 'A 12 V 100 Ah lead-acid battery used to 50% runs a 1,000 W AC load for only about 32 minutes through a 90% inverter, and less in practice at that discharge rate. A 12.8 V 100 Ah LiFePO4 used to 90% lasts about 62 minutes.' },
    { q: 'How do you calculate battery life in hours?', a: 'Hours = battery watt-hours × usable fraction ÷ load watts. For DC loads in amps, hours = amp-hours × usable fraction ÷ amps.' },
    { q: 'How long will a 12V battery run a 12V fridge?', a: 'A 12 V compressor fridge averaging 45 W uses about 3.75 Ah per hour. A 100 Ah lead-acid battery used to 50% lasts about 13 hours; a 100 Ah LiFePO4 used to 90% lasts about 26 hours.' },
    { q: 'Does inverter size affect battery life?', a: 'Yes. Every inverter has an idle draw and is least efficient at small loads, so an oversized inverter running a light load wastes battery. Size it reasonably close to your largest load.' },
    { q: 'How long does a 3,000 mAh battery last?', a: 'At a steady 300 mA it lasts about 10 hours in theory (3,000 ÷ 300), or around 9 hours if the device cuts off at 90% discharge.' },
    { q: 'Why does my battery not last as long as the calculation?', a: 'Common causes are an inverter idling or running inefficiently, a load that draws more than its label average, cold temperatures, high discharge rates on lead-acid, and lost capacity from age.' },
    { q: 'What is a good Peukert exponent to use?', a: 'Use the manufacturer\'s figure if published. Otherwise about 1.05 for LiFePO4, 1.1 to 1.2 for AGM and 1.2 to 1.3 for flooded lead-acid.' }
  ],
  related: ['amp-hours-calculator', 'watt-hours-calculator', 'solar-panel-calculator', 'generator-size-calculator'],
  sources: [
    { name: 'U.S. DOE: Batteries, Charging, and Electric Vehicles', url: 'https://www.energy.gov/cmei/vehicles/batteries-charging-and-electric-vehicles' },
    { name: 'FAA PackSafe: Lithium Batteries (calculating Wh)', url: 'https://www.faa.gov/hazmat/packsafe/lithium-batteries' },
    { name: 'NFPA 70: National Electrical Code (Article 480, storage batteries)', url: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' }
  ],
  disclaimer: 'Estimates assume steady loads. Check battery and inverter manufacturer data for critical uses such as medical equipment.'
};
