export default {
  slug: 'efficiency-calculator',
  hub: 'science',
  name: 'Efficiency Calculator',
  title: 'Efficiency Calculator: 900 J Out of 1,200 J In Is 75%',
  h1: 'Efficiency Calculator: Useful Output ÷ Input for Energy, Power and Motors',
  meta: 'A device that turns 1,200 J of input into 900 J of useful work is 75% efficient and wastes 300 J. Solve for efficiency, output or input, or rate a motor.',
  keyword: 'how do we calculate efficiency',
  also: ['efficiency calculator', 'how to calculate efficiency', 'how to calculate efficiency of energy transfer', 'how to calculate energy efficiency', 'how to calculate the efficiency of an electric motor', 'how to calculate motor efficiency', 'efficiency formula physics'],
  updated: '2026-11-13',
  inputs: [
    { id: 'solve', label: 'Find', type: 'select', value: 'eff', options: [['eff', 'Efficiency from output and input'], ['out', 'Useful output from input and efficiency'], ['in', 'Input needed from output and efficiency'], ['motor', 'Electric motor efficiency (hp, volts, amps)']] },
    { id: 'out', label: 'Useful output', type: 'number', value: 900, showIf: { solve: ['eff', 'in'] } },
    { id: 'inp', label: 'Total input', type: 'number', value: 1200, showIf: { solve: ['eff', 'out'] } },
    { id: 'pct', label: 'Efficiency', type: 'number', value: 75, suffix: '%', showIf: { solve: ['out', 'in'] } },
    { id: 'unit', label: 'Unit (same for both)', type: 'select', value: 'J', options: [['J', 'joules (J)'], ['kJ', 'kilojoules (kJ)'], ['kWh', 'kilowatt-hours (kWh)'], ['W', 'watts (W)'], ['kW', 'kilowatts (kW)'], ['BTU', 'BTU'], ['cal', 'calories']], showIf: { solve: ['eff', 'out', 'in'] } },
    { id: 'hp', label: 'Rated output (shaft power)', type: 'number', value: 5, suffix: 'hp', showIf: { solve: ['motor'] } },
    { id: 'volts', label: 'Supply voltage', type: 'number', value: 460, suffix: 'V', showIf: { solve: ['motor'] } },
    { id: 'amps', label: 'Measured current', type: 'number', value: 6.6, suffix: 'A', showIf: { solve: ['motor'] } },
    { id: 'phase', label: 'Phase', type: 'select', value: '3', options: [['3', 'Three-phase'], ['1', 'Single-phase']], showIf: { solve: ['motor'] } },
    { id: 'pf', label: 'Power factor', type: 'number', value: 0.85, help: 'From the nameplate; 0.8–0.9 is typical at full load. Use 1 for DC motors.', showIf: { solve: ['motor'] } }
  ],
  compute(v, H) {
    var u = v.unit || 'J', out, inp, e;
    if (v.solve === 'motor') {
      if (!(v.hp > 0)) return { error: 'Enter the motor output in horsepower.' };
      if (!(v.volts > 0) || !(v.amps > 0)) return { error: 'Enter the supply voltage and current.' };
      var pf = v.pf > 0 && v.pf <= 1 ? v.pf : 1;
      var k = v.phase === '3' ? Math.sqrt(3) : 1;
      inp = k * v.volts * v.amps * pf; out = v.hp * 745.7; e = out / inp * 100;
      if (e > 100) return { error: 'Output is larger than electrical input (' + H.int(inp) + ' W). Check the current, voltage or power factor.' };
      return {
        value: H.pct(e, 1), label: 'Motor efficiency',
        expr: H.num(out, 0) + ' W ÷ ' + H.num(inp, 0) + ' W',
        rows: [['Shaft output', H.num(out, 0) + ' W (' + H.num(v.hp, 2) + ' hp × 745.7)'], ['Electrical input', H.num(inp, 0) + ' W', true], ['Losses as heat', H.num(inp - out, 0) + ' W'], ['Input formula', (v.phase === '3' ? '√3 × ' : '') + 'V × A × PF']],
        sub: e >= 90 ? 'High efficiency: typical of a modern premium-efficiency motor near full load.' : e >= 80 ? 'Reasonable for a small or older motor; efficiency also drops when a motor runs well below its rated load.' : 'Low. Small motors and lightly loaded motors are often this inefficient, or the measured current includes other loads.'
      };
    }
    if (v.solve === 'eff') {
      if (!(v.inp > 0)) return { error: 'Enter the total input, greater than zero.' };
      if (!(v.out >= 0)) return { error: 'Enter the useful output.' };
      out = v.out; inp = v.inp; e = out / inp * 100;
      if (e > 100) return { error: 'Useful output cannot exceed total input. Swap the numbers or check your units.' };
    } else if (v.solve === 'out') {
      if (!(v.inp > 0)) return { error: 'Enter the total input.' };
      if (!(v.pct > 0 && v.pct <= 100)) return { error: 'Efficiency must be between 0 and 100%.' };
      inp = v.inp; e = v.pct; out = inp * e / 100;
    } else {
      if (!(v.out > 0)) return { error: 'Enter the useful output you need.' };
      if (!(v.pct > 0 && v.pct <= 100)) return { error: 'Efficiency must be between 0 and 100%.' };
      out = v.out; e = v.pct; inp = out / (e / 100);
    }
    var waste = inp - out;
    var rows = [
      ['Useful output', H.num(out, 3) + ' ' + u, v.solve === 'out'],
      ['Total input', H.num(inp, 3) + ' ' + u, v.solve === 'in'],
      ['Wasted (mostly heat)', H.num(waste, 3) + ' ' + u + ' (' + H.pct(100 - e, 1) + ')'],
      ['Efficiency as a decimal', H.num(e / 100, 4)],
      ['Input per 1 unit of useful output', H.num(inp / Math.max(out, 1e-300), 3)]
    ];
    var res = v.solve === 'eff' ? { value: H.pct(e, 1), label: 'Efficiency', expr: H.num(out, 3) + ' ÷ ' + H.num(inp, 3) + ' × 100' }
      : v.solve === 'out' ? { value: H.num(out, 3) + ' ' + u, label: 'Useful output', expr: H.num(inp, 3) + ' × ' + H.pct(e, 2) }
        : { value: H.num(inp, 3) + ' ' + u, label: 'Input required', expr: H.num(out, 3) + ' ÷ ' + H.num(e / 100, 4) };
    res.rows = rows;
    res.sub = 'Of every 100 ' + u + ' supplied, ' + H.num(e, 1) + ' do the job you want and ' + H.num(100 - e, 1) + ' are lost to the surroundings.';
    return res;
  },
  quick: ({ r }) => `To calculate efficiency, divide the useful energy (or power) out by the total energy (or power) in and multiply by 100. A motor that takes in 1,200 J and lifts a load with 900 J of useful work is 900 ÷ 1,200 × 100 = <strong>${r.value}</strong> efficient; the other 300 J is wasted, mostly as heat. Efficiency can never exceed 100%.`,
  stepsTitle: 'How to calculate efficiency',
  steps: [
    'Identify the <strong>useful</strong> output: the energy in the form you wanted (light from a bulb, lift from a crane, heat in the water for a kettle). Sound and heat from a motor are not useful outputs.',
    'Find the total input: all the energy supplied, usually electrical (watts × seconds) or chemical (fuel).',
    'Put both in the same unit. Joules over joules or watts over watts both work; mixing kWh and joules does not.',
    'Divide useful output by total input, then multiply by 100 for a percentage.',
    'Sanity-check: the answer must be between 0 and 100%. Above 100% means the output and input are swapped or a unit is wrong.'
  ],
  formulaTitle: 'What is the efficiency formula?',
  formula: {
    expr: 'Efficiency = (useful output ÷ total input) × 100%<br>Wasted = input − useful output<br>Input needed = useful output ÷ efficiency',
    vars: [['useful output', 'energy (J) or power (W) delivered in the wanted form'], ['total input', 'energy or power supplied, in the same unit'], ['efficiency', 'written as a decimal (0.75) or a percentage (75%)']],
    note: 'For motors, use power: input = V × I × PF for single-phase or √3 × V × I × PF for three-phase; output = horsepower × 745.7 W.'
  },
  example: `<p><strong>Kettle.</strong> A 2,000 W kettle runs for 3 minutes and heats 1.0 kg of water from 20 °C to 100 °C. How efficient is it?</p>
<p>Input energy = 2,000 W × 180 s = <strong>360,000 J</strong>. Useful energy in the water = m c ΔT = 1,000 g × 4.184 × 80 = <strong>334,720 J</strong>.</p>
<p>Efficiency = 334,720 ÷ 360,000 × 100 = <strong>93.0%</strong>. The missing 25,280 J warmed the kettle body and the air around it.</p>`,
  table: {
    title: 'How much input do you need for 1,000 J of useful output?',
    intro: 'The lower the efficiency, the faster the required input climbs. Computed with input = output ÷ efficiency.',
    head: ['Efficiency', 'Input needed', 'Wasted energy', 'Input per useful joule'],
    rows: ({ run }) => [5, 10, 20, 25, 33, 40, 50, 60, 75, 85, 90, 95, 99].map(p => { const r = run({ solve: 'in', out: 1000, pct: p, unit: 'J' }); return [p + '%', r.value, r.rows[2][1].replace(/ \(.*/, ''), r.rows[4][1]]; }),
    note: 'Going from 20% to 25% efficiency saves 1,000 J of input per 1,000 J of useful work; going from 90% to 95% saves only about 59 J. Gains matter most at the bottom of the scale.'
  },
  sections: [
    {
      h2: 'How do you calculate the efficiency of energy transfer?',
      html: `<p>Draw (or picture) a Sankey diagram: one arrow in, split into a useful arrow and a wasted arrow. Efficiency is the useful arrow divided by the input arrow. Energy is conserved, so useful + wasted always equals the input.</p>
<p>Example: a phone charger draws 25 J from the wall each second and puts 20 J into the battery. Efficiency = 20 ÷ 25 = 0.80 = <strong>80%</strong>, and 5 J per second warms the charger. If you know only the waste, subtract first: a light bulb wasting 54 J of every 60 J has 6 J useful, 10% efficient.</p>`
    },
    {
      h2: 'How do you calculate the efficiency of an electric motor?',
      html: `<p>Motor efficiency = mechanical output power ÷ electrical input power. Output comes from the rated or measured shaft power (1 hp = 745.7 W). Input comes from measured volts and amps times the power factor, and for three-phase motors also times √3 ≈ 1.732.</p>
<p>A 5 hp three-phase motor on 460 V drawing 6.6 A at a power factor of 0.85 takes in 1.732 × 460 × 6.6 × 0.85 = <strong>4,470 W</strong> and delivers 5 × 745.7 = <strong>3,729 W</strong>, so it is 83.4% efficient. Pick "Electric motor efficiency" above to run your own nameplate numbers. For torque and horsepower from rpm, use the <a href="/torque-calculator">torque calculator</a>.</p>`
    },
    {
      h2: 'What is a good efficiency for common devices?',
      html: `<ul>
<li><strong>Incandescent bulb:</strong> about 90% of its energy leaves as heat, so roughly 10% or less becomes light. An LED that gives the same 800 lumens draws about 9 W instead of 60 W.</li>
<li><strong>Gasoline car:</strong> only a small share of fuel energy, very roughly a fifth to a quarter, reaches the wheels; most is lost as engine heat. Battery electric cars deliver well over three-quarters of grid energy to the wheels (fueleconomy.gov).</li>
<li><strong>Fossil power plants:</strong> about a third (older steam plants) to about half (combined-cycle gas) of the fuel's heat becomes electricity (EIA heat-rate data; 3,412 BTU per kWh would be 100%).</li>
<li><strong>Large electric motors and transformers:</strong> typically above 90%.</li>
<li><strong>Human muscles:</strong> roughly 20–25% of food energy becomes mechanical work.</li>
</ul>`
    },
    {
      h2: 'Why can\'t efficiency be more than 100%?',
      html: `<p>The law of conservation of energy says a device cannot put out more energy than it takes in, so useful output ÷ input is at most 1. In practice friction, electrical resistance and sound always waste some, so real machines stay below 100%.</p>
<p>Heat engines face a tighter limit, the Carnot efficiency 1 − T<sub>cold</sub> ÷ T<sub>hot</sub> with temperatures in kelvins. An engine running between 500 K and 300 K can never beat 1 − 300 ÷ 500 = 40%, however well it is built. Heat pumps quote a coefficient of performance above 1 (often 3 or more), but that measures heat moved, not energy created.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for efficiency in physics?', a: 'Efficiency = useful energy output ÷ total energy input × 100%. The same formula works with power: useful power out ÷ power in × 100%.' },
    { q: 'How do you calculate efficiency as a decimal?', a: 'Divide useful output by input and stop before multiplying by 100. 900 J out of 1,200 J is 0.75; as a percentage that is 75%.' },
    { q: 'How do you calculate wasted energy?', a: 'Subtract useful output from total input. A 60 W bulb that is 10% efficient wastes 60 − 6 = 54 W, or 54 J every second.' },
    { q: 'How do you calculate the efficiency of a pulley system?', a: 'Efficiency = actual mechanical advantage ÷ ideal mechanical advantage × 100, or work out ÷ work in. Lifting 400 N with 125 N of effort on a 4-rope pulley gives AMA = 3.2 and IMA = 4, so 80%. The pulley calculator does this in detail.' },
    { q: 'How do you calculate transformation efficiency in biology?', a: 'Transformation efficiency = number of colonies ÷ micrograms of DNA actually plated. If 0.1 µg of plasmid is in 1,000 µL and you plate 100 µL (0.01 µg) and get 150 colonies, the efficiency is 150 ÷ 0.01 = 15,000 transformants per µg.' },
    { q: 'How do I calculate the input energy if I know the efficiency?', a: 'Divide the useful output by the efficiency as a decimal. To get 500 J of useful work from a 25% efficient engine you need 500 ÷ 0.25 = 2,000 J of fuel energy.' },
    { q: 'Is 100% efficiency possible?', a: 'No real machine reaches it. Electric heaters come closest, because all the electricity ends up as heat, which is the useful output, so a resistance heater is effectively 100% efficient at heating.' }
  ],
  related: ['joules-calculator', 'kw-calculator', 'pulley-calculator', 'percentage-calculator', 'electricity-cost-calculator'],
  sources: [
    { name: 'fueleconomy.gov: Where the Energy Goes, Gasoline Vehicles', url: 'https://www.fueleconomy.gov/feg/atv.shtml' },
    { name: 'fueleconomy.gov: All-Electric Vehicles (energy efficiency)', url: 'https://www.fueleconomy.gov/feg/atv-ev.shtml' },
    { name: 'U.S. Energy Information Administration: power plant efficiency FAQ', url: 'https://www.eia.gov/tools/faqs/faq.php?id=107&t=3' },
    { name: 'OpenStax College Physics 2e (work, energy, power and efficiency)', url: 'https://openstax.org/details/books/college-physics-2e' }
  ]
};
