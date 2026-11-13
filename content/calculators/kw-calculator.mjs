export default {
  slug: 'kw-calculator',
  hub: 'electrical',
  name: 'kW Calculator',
  title: 'kW Calculator: 480 V 3-Phase at 40 A and 0.85 PF Is 28.27 kW',
  h1: 'Kilowatt Calculator: kW from Volts and Amps, Horsepower or kWh',
  meta: 'Real power in kW = volts × amps × power factor ÷ 1,000 (× 1.732 for 3-phase). A 480 V motor at 40 A and 0.85 PF uses 28.27 kW. Also converts hp and kWh.',
  keyword: 'how to calculate kw',
  also: ['how do you calculate kw', 'how calculate kw', 'how to calculate kw from amps', 'how to calculate kw to kwh', 'how to calculate kw to hp', 'how do i calculate kilowatt hours'],
  updated: '2026-11-13',
  inputs: [
    { id: 'from', label: 'Calculate kW from', type: 'select', value: 'amps', options: [['amps', 'Volts, amps and power factor'], ['hp', 'Motor horsepower'], ['kwh', 'Energy (kWh) over a time period']] },
    { id: 'system', label: 'Supply', type: 'select', value: 'ac3', options: [['ac3', 'AC three-phase'], ['ac1', 'AC single-phase'], ['dc', 'DC']], showIf: { from: ['amps'] } },
    { id: 'volts', label: 'Voltage', type: 'number', value: 480, suffix: 'V', help: 'Line-to-line for three-phase.', showIf: { from: ['amps'] } },
    { id: 'amps', label: 'Current', type: 'number', value: 40, suffix: 'A', help: 'Measured or nameplate amps per line.', showIf: { from: ['amps'] } },
    { id: 'pf', label: 'Power factor', type: 'number', value: 0.85, help: 'Nameplate PF; 1.0 for purely resistive loads.', showIf: { from: ['amps'] } },
    { id: 'hp', label: 'Motor output', type: 'number', value: 10, suffix: 'hp', showIf: { from: ['hp'] } },
    { id: 'eff', label: 'Motor efficiency', type: 'number', value: 90, suffix: '%', help: 'From the nameplate; premium-efficiency motors of 10 hp and up are usually 90% or better.', showIf: { from: ['hp'] } },
    { id: 'kwh', label: 'Energy used', type: 'number', value: 36, suffix: 'kWh', showIf: { from: ['kwh'] } },
    { id: 'hours', label: 'Running time', type: 'number', value: 8, suffix: 'hours', help: 'Used to turn kW into kWh (or kWh back into kW).' }
  ],
  compute(v, H) {
    var kw, rows = [], expr, sub;
    var hrs = v.hours > 0 ? v.hours : NaN;
    if (v.from === 'hp') {
      if (!(v.hp > 0)) return { error: 'Enter the motor horsepower.' };
      if (!(v.eff > 0 && v.eff <= 100)) return { error: 'Efficiency must be between 1% and 100%.' };
      var shaft = v.hp * 0.7457;
      kw = shaft / (v.eff / 100);
      expr = H.num(v.hp, 2) + ' hp × 0.7457 ÷ ' + H.num(v.eff, 1) + '%';
      rows.push(['Shaft (output) power', H.num(shaft, 2) + ' kW']);
      rows.push(['Electrical input', H.num(kw, 2) + ' kW', true]);
      rows.push(['Lost as heat in the motor', H.num(kw - shaft, 2) + ' kW']);
      sub = 'Horsepower on a motor nameplate is shaft output; the supply has to deliver the losses on top.';
    } else if (v.from === 'kwh') {
      if (!(v.kwh > 0)) return { error: 'Enter the energy in kWh.' };
      if (!(hrs > 0)) return { error: 'Enter the running time in hours.' };
      kw = v.kwh / hrs;
      expr = H.num(v.kwh, 2) + ' kWh ÷ ' + H.num(hrs, 2) + ' h';
      rows.push(['Average power', H.num(kw * 1000, 0) + ' W', true]);
      rows.push(['Equivalent horsepower', H.num(kw / 0.7457, 2) + ' hp']);
      sub = 'This is the average over the period; the peak draw may have been higher.';
      return { value: H.num(kw, 3) + ' kW', label: 'Average kilowatts', expr: expr, rows: rows, sub: sub };
    } else {
      if (!(v.volts > 0)) return { error: 'Enter the voltage.' };
      if (!(v.amps > 0)) return { error: 'Enter the current in amps.' };
      var pf = v.system === 'dc' ? 1 : v.pf;
      if (!(pf > 0 && pf <= 1)) return { error: 'Power factor must be greater than 0 and no more than 1.' };
      var k = v.system === 'ac3' ? Math.sqrt(3) : 1;
      var kva = v.volts * v.amps * k / 1000;
      kw = kva * pf;
      expr = H.num(v.volts, 1) + ' V × ' + H.num(v.amps, 2) + ' A' + (k > 1 ? ' × 1.732' : '') + (v.system !== 'dc' ? ' × ' + H.num(pf, 3) : '') + ' ÷ 1,000';
      if (v.system !== 'dc') rows.push(['Apparent power', H.num(kva, 2) + ' kVA']);
      if (v.system !== 'dc' && pf < 1) rows.push(['Reactive power', H.num(Math.sqrt(kva * kva - kw * kw), 2) + ' kVAR']);
      rows.push(['Equivalent horsepower (input)', H.num(kw / 0.7457, 2) + ' hp']);
      sub = v.system === 'dc' ? 'DC power is simply volts × amps.' : 'kW is the real, billable power; kVA is what the wires and transformer must carry.';
    }
    if (hrs > 0) rows.push(['Energy over ' + H.num(hrs, 2) + ' h', H.num(kw * hrs, 2) + ' kWh', true]);
    return { value: H.num(kw, 2) + ' kW', label: v.from === 'hp' ? 'Kilowatts drawn from the supply' : 'Real power (kilowatts)', expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate kW, multiply volts by amps, multiply by the power factor for AC, and divide by 1,000; on three-phase also multiply by 1.732. A <strong>480 V three-phase</strong> motor drawing <strong>40 A</strong> at 0.85 PF uses 480 × 40 × 1.732 × 0.85 ÷ 1,000 = <strong>${r.value}</strong>. Running 8 hours, that is 226.14 kWh. A 240 V, 30 A single-phase resistive load is 7.2 kW.`,
  stepsTitle: 'How to calculate kW from amps',
  steps: [
    'Read the operating voltage and the current per line. On three-phase equipment use the line-to-line voltage (208, 240, 480 or 600 V).',
    'Multiply volts × amps. For three-phase, multiply again by 1.732. Divide by 1,000: that gives kVA, the apparent power.',
    'Multiply kVA by the power factor to get kW. <strong>Leaving out power factor overstates kW</strong> by 10–25% for typical motors.',
    'For energy, multiply kW by the hours it runs to get kWh, the unit on your electric bill.'
  ],
  formulaTitle: 'What is the formula for kW?',
  formula: {
    expr: 'Single-phase: kW = V × I × PF ÷ 1,000<br>Three-phase: kW = V × I × PF × 1.732 ÷ 1,000<br>DC: kW = V × I ÷ 1,000<br>kWh = kW × hours &nbsp;·&nbsp; kW = hp × 0.7457 ÷ efficiency',
    vars: [['V', 'volts (line-to-line on three-phase)'], ['I', 'amps per line'], ['PF', 'power factor, the ratio of kW to kVA'], ['0.7457', 'kilowatts in one mechanical horsepower (745.7 W)']]
  },
  example: `<p>A shop runs a 10 hp air compressor motor rated at 90% efficiency for 6 hours a day.</p>
<p>Shaft output = 10 × 0.7457 = 7.457 kW. Electrical input = 7.457 ÷ 0.90 = <strong>8.29 kW</strong>.</p>
<p>Daily energy = 8.29 × 6 = <strong>49.7 kWh</strong>. Over 22 working days that is about 1,094 kWh a month, which the <a href="/electricity-cost-calculator">electricity cost calculator</a> can price at your rate.</p>`,
  table: {
    title: 'How many kW is 10, 50 or 200 amps?',
    intro: 'Kilowatts for common current readings at standard U.S. voltages, computed above with power factor 1.0. Multiply by your actual power factor for motor loads.',
    head: ['Amps', '120 V 1-phase', '240 V 1-phase', '208 V 3-phase', '480 V 3-phase'],
    rows: ({ run, H }) => [5, 10, 15, 20, 30, 40, 50, 60, 100, 150, 200, 400].map(a => [a + ' A',
      run({ from: 'amps', system: 'ac1', volts: 120, amps: a, pf: 1 }).value,
      run({ from: 'amps', system: 'ac1', volts: 240, amps: a, pf: 1 }).value,
      run({ from: 'amps', system: 'ac3', volts: 208, amps: a, pf: 1 }).value,
      run({ from: 'amps', system: 'ac3', volts: 480, amps: a, pf: 1 }).value]),
    note: 'Example: 100 A on 480 V three-phase is 83.14 kW at unity power factor, or 70.67 kW at PF 0.85.'
  },
  sections: [
    {
      h2: 'How do you convert kW to kWh?',
      html: `<p>Multiply by time: kWh = kW × hours. A kilowatt is a rate (how fast energy is used); a kilowatt-hour is an amount (how much was used). A 1.5 kW space heater running 4 hours uses 6 kWh. Going the other way, divide: 36 kWh used over an 8-hour shift means an average draw of 4.5 kW. Pick <em>Energy (kWh) over a time period</em> in the calculator for that direction.</p>
<p>To get kWh from amps, find kW first, then multiply by hours. A 240 V circuit carrying 20 A at unity power factor is 4.8 kW, so 3 hours of it is 14.4 kWh. Utilities bill residential customers on kWh; many commercial accounts also pay a demand charge on peak kW, typically the highest average over a 15- or 30-minute window in the billing cycle.</p>`
    },
    {
      h2: 'How do you convert kW to horsepower?',
      html: `<p>One mechanical horsepower is 745.7 watts, so hp = kW ÷ 0.7457 and kW = hp × 0.7457. A 7.5 kW motor is 10.06 hp; a 50 hp motor is 37.3 kW.</p>
<p>The catch is which side of the motor you are on. Nameplate horsepower is shaft <em>output</em>. The electrical <em>input</em> is larger by the motor's losses, so a 10 hp motor at 90% efficiency pulls 8.29 kW from the supply, not 7.46 kW. Choose <em>Motor horsepower</em> above to include efficiency. For torque and rpm, the <a href="/torque-calculator">torque and horsepower calculator</a> uses HP = torque × rpm ÷ 5,252.</p>`
    },
    {
      h2: 'Why do kW and kVA give different numbers?',
      html: `<p>Motors, transformers and fluorescent ballasts need magnetizing current that flows back and forth without doing useful work. Your conductors still carry it, so the "apparent" power (kVA) is higher than the "real" power (kW). Power factor is the ratio: PF = kW ÷ kVA.</p>
<p>In the default example the motor draws 33.26 kVA but only 28.27 kW does work; the other component is 17.52 kVAR of reactive power, and kVA² = kW² + kVAR². Generators, transformers and UPS units are rated in kVA for this reason. Size those with the <a href="/kva-calculator">kVA calculator</a>, and use kW here for energy use and cost.</p>`
    },
    {
      h2: 'How many kW does a house use?',
      html: `<p>On average, about 1.2 kW. The U.S. Energy Information Administration reports the average residential customer bought 10,791 kWh in 2022, about 899 kWh a month; spread over the 8,760 hours in a year that is 10,791 ÷ 8,760 = <strong>1.23 kW</strong> of continuous draw.</p>
<p>Peaks are far higher. With an electric range, dryer, water heater and central air running together, a home can briefly pull 15–25 kW, which is why services are rated in amps (100–200 A at 240 V is 24–48 kVA) rather than by average use.</p>`
    }
  ],
  faq: [
    { q: 'How many kW is 1 horsepower?', a: 'One mechanical horsepower equals 0.7457 kW (745.7 W). One kW equals 1.341 hp.' },
    { q: 'How do you calculate kW from amps on a 3-phase circuit?', a: 'Multiply line-to-line volts × amps × 1.732 × power factor and divide by 1,000. At 208 V, 50 A and PF 0.9: 208 × 50 × 1.732 × 0.9 ÷ 1,000 = 16.21 kW.' },
    { q: 'How many amps is 1 kW?', a: 'At unity power factor, 1 kW draws 8.33 A at 120 V, 4.17 A at 240 V and 1.20 A per line at 480 V three-phase.' },
    { q: 'What is the difference between kW and kWh?', a: 'kW measures power (a rate), kWh measures energy (an amount). Running 2 kW for 3 hours uses 6 kWh.' },
    { q: 'Can I calculate kW without the power factor?', a: 'Only for DC and resistive AC loads, where PF is 1. For motors, assuming PF 1 gives kVA, not kW, and overstates real power. If the nameplate lacks PF, 0.85 is a common planning value for induction motors under load.' },
    { q: 'How do I convert BTU per hour to kW?', a: 'Divide BTU/h by 3,412. A 12,000 BTU/h air conditioner moves 3.52 kW of heat, though it draws far less electricity than that.' },
    { q: 'Is kW the same as kVA for a generator?', a: 'No. Generators are usually rated at 0.8 power factor, so a 100 kVA unit delivers 80 kW of real power.' }
  ],
  related: ['kva-calculator', 'amps-calculator', 'torque-calculator', 'electricity-cost-calculator', 'solar-panel-calculator'],
  sources: [
    { name: 'NIST: SI Units (watt and derived units)', url: 'https://www.nist.gov/pml/owm/metric-si/si-units' },
    { name: 'U.S. EIA: How much electricity does an American home use?', url: 'https://www.eia.gov/tools/faqs/faq.php?id=97&t=3' },
    { name: 'U.S. EIA: British thermal units (Btu) and conversions', url: 'https://www.eia.gov/energyexplained/units-and-calculators/british-thermal-units.php' },
    { name: 'NFPA 70: National Electrical Code (Article 430, motors)', url: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' }
  ]
};
