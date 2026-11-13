export default {
  slug: 'torque-calculator',
  hub: 'electrical',
  name: 'Torque & Horsepower Calculator',
  title: 'Motor Torque Calculator: 5 hp at 1,750 rpm = 15 lb-ft',
  h1: 'Torque and Horsepower Calculator for Electric Motors',
  meta: 'A 5 hp motor turning 1,750 rpm delivers about 15 lb-ft (20.3 N·m). Convert hp or kW and rpm to torque, torque to horsepower, or volts and amps to shaft torque.',
  keyword: 'how to calculate torque of an electric motor',
  also: ['how do you calculate torque of a motor', 'how to calculate torque on a motor', 'how to calculate motor torque', 'how to calculate horsepower from torque', 'how to calculate electric motor hp', 'how to calculate horsepower electric motor'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Find', type: 'select', value: 'torque', options: [['torque', 'Torque from power and speed'], ['power', 'Horsepower from torque and speed'], ['elec', 'Torque from volts and amps']], wide: true },
    { id: 'power', label: 'Motor power', type: 'number', value: 5, showIf: { mode: ['torque'] } },
    { id: 'punit', label: 'Power unit', type: 'select', value: 'hp', options: [['hp', 'hp'], ['kw', 'kW'], ['w', 'W']], showIf: { mode: ['torque'] } },
    { id: 'torque', label: 'Torque', type: 'number', value: 15, showIf: { mode: ['power'] } },
    { id: 'tunit', label: 'Torque unit', type: 'select', value: 'lbft', options: [['lbft', 'lb-ft'], ['nm', 'N·m'], ['lbin', 'lb-in'], ['ozin', 'oz-in']], showIf: { mode: ['power'] } },
    { id: 'volts', label: 'Voltage', type: 'number', value: 230, suffix: 'V', showIf: { mode: ['elec'] } },
    { id: 'amps', label: 'Current (measured or FLA)', type: 'number', value: 13, suffix: 'A', showIf: { mode: ['elec'] } },
    { id: 'phase', label: 'Supply', type: 'select', value: '3', options: [['3', 'Three-phase AC'], ['1', 'Single-phase AC'], ['dc', 'DC']], showIf: { mode: ['elec'] } },
    { id: 'eff', label: 'Motor efficiency', type: 'number', value: 88, suffix: '%', showIf: { mode: ['elec'] } },
    { id: 'pf', label: 'Power factor', type: 'number', value: 0.85, showIf: { mode: ['elec'] } },
    { id: 'rpm', label: 'Shaft speed', type: 'number', value: 1750, suffix: 'rpm' }
  ],
  compute(v, H) {
    var HPW = 745.699872, LBFT = 1.3558179483;
    if (!(v.rpm > 0)) return { error: 'Enter the shaft speed in rpm.' };
    var w = v.rpm * 2 * Math.PI / 60;
    var watts, nm, expr;
    if (v.mode === 'power') {
      if (!(v.torque > 0)) return { error: 'Enter the torque.' };
      var f = { lbft: LBFT, nm: 1, lbin: LBFT / 12, ozin: LBFT / 192 }[v.tunit] || LBFT;
      nm = v.torque * f;
      watts = nm * w;
      var hp = watts / HPW;
      return {
        value: H.num(hp, 2) + ' hp',
        label: 'Shaft horsepower',
        expr: H.num(nm / LBFT, 2) + ' lb-ft × ' + H.num(v.rpm, 0) + ' rpm ÷ 5,252',
        rows: [['Power in kW', H.num(watts / 1000, 3) + ' kW', true], ['Power in watts', H.int(watts) + ' W'], ['Torque', H.num(nm, 2) + ' N·m = ' + H.num(nm / LBFT, 2) + ' lb-ft']],
        sub: 'Horsepower and lb-ft are numerically equal at 5,252 rpm; below that speed the torque number is the larger one.'
      };
    }
    if (v.mode === 'elec') {
      if (!(v.volts > 0) || !(v.amps > 0)) return { error: 'Enter voltage and current.' };
      var eff = v.eff > 0 && v.eff <= 100 ? v.eff / 100 : 0.88;
      var pf = v.phase === 'dc' ? 1 : (v.pf > 0 && v.pf <= 1 ? v.pf : 0.85);
      var k = v.phase === '3' ? Math.sqrt(3) : 1;
      var input = k * v.volts * v.amps * pf;
      watts = input * eff;
      expr = (k > 1 ? '1.732 × ' : '') + H.num(v.volts, 0) + ' V × ' + H.num(v.amps, 1) + ' A' + (v.phase === 'dc' ? '' : ' × ' + H.num(pf, 2)) + ' × ' + H.num(eff * 100, 0) + '%';
      nm = watts / w;
      return {
        value: H.num(nm / LBFT, 2) + ' lb-ft',
        label: 'Shaft torque from electrical input',
        expr: expr,
        rows: [['Torque in N·m', H.num(nm, 2) + ' N·m', true], ['Electrical input', H.int(input) + ' W'], ['Shaft output', H.int(watts) + ' W = ' + H.num(watts / HPW, 2) + ' hp'], ['Torque in lb-in', H.num(nm / LBFT * 12, 1) + ' lb-in']],
        sub: 'Uses the current you measured: at part load, efficiency and power factor both fall, so clamp-meter estimates of torque run high on lightly loaded motors.'
      };
    }
    if (!(v.power > 0)) return { error: 'Enter the motor power.' };
    watts = v.power * ({ hp: HPW, kw: 1000, w: 1 }[v.punit] || HPW);
    nm = watts / w;
    var lbft = nm / LBFT;
    return {
      value: H.num(lbft, 2) + ' lb-ft',
      label: 'Full-load torque',
      expr: H.num(watts / HPW, 2) + ' hp × 5,252 ÷ ' + H.num(v.rpm, 0) + ' rpm',
      rows: [['Torque in N·m', H.num(nm, 2) + ' N·m', true], ['Torque in lb-in', H.num(lbft * 12, 1) + ' lb-in'], ['Torque in oz-in', H.int(lbft * 192) + ' oz-in'], ['Power', H.num(watts / HPW, 2) + ' hp = ' + H.num(watts / 1000, 3) + ' kW']],
      _lbft: lbft,
      sub: 'This is rated (full-load) torque. Starting and breakdown torque are higher and come from the motor\'s NEMA design letter and data sheet.'
    };
  },
  quick: ({ r }) => `Motor torque in lb-ft equals horsepower × 5,252 ÷ rpm (or N·m = 9,549 × kW ÷ rpm). A <strong>5 hp</strong> motor at <strong>1,750 rpm</strong> therefore delivers 5 × 5,252 ÷ 1,750 = <strong>${r.value}</strong>, which is 20.35 N·m. The same 5 hp at 3,450 rpm gives only 7.61 lb-ft, because speed and torque trade off.`,
  stepsTitle: 'How to calculate the torque of an electric motor',
  steps: [
    'Read the rated horsepower (or kW) and full-load speed from the nameplate. Use the nameplate rpm, such as 1,750 or 1,760, not the synchronous 1,800.',
    'For lb-ft, multiply horsepower by 5,252 and divide by rpm. For N·m, multiply kW by 9,549 and divide by rpm.',
    'If you only know the electrical input, multiply volts × amps × power factor × efficiency (and × 1.732 for three-phase) to get output watts, then divide by angular speed (rpm × 2π ÷ 60) for N·m.',
    'Multiply by any gear or belt reduction to get torque at the driven shaft, less a few percent per stage for friction.'
  ],
  formulaTitle: 'What is the formula for motor torque?',
  formula: {
    expr: 'T (lb-ft) = HP × 5,252 ÷ RPM<br>T (N·m) = P (W) ÷ (2π × RPM ÷ 60) = 9,549 × P (kW) ÷ RPM<br>HP = T (lb-ft) × RPM ÷ 5,252',
    vars: [['T', 'shaft torque'], ['HP', 'mechanical horsepower (550 ft·lbf/s = 745.7 W)'], ['RPM', 'shaft speed, revolutions per minute'], ['P', 'shaft power']],
    note: 'The constant 5,252 is 33,000 ÷ 2π: one horsepower is 33,000 ft·lbf per minute, and each revolution moves a lever arm through 2π radians. 9,549 is 60,000 ÷ 2π for kW.'
  },
  example: `<p>A pump motor on a 230 V three-phase supply draws <strong>13 A</strong>. Assume 88% efficiency and a 0.85 power factor at that load; it runs at 1,750 rpm.</p>
<p>Input power = 1.732 × 230 × 13 × 0.85 = <strong>4,402 W</strong>. Shaft output = 4,402 × 0.88 = <strong>3,874 W</strong> (5.19 hp).</p>
<p>Angular speed = 1,750 × 2π ÷ 60 = 183.3 rad/s, so torque = 3,874 ÷ 183.3 = <strong>21.14 N·m</strong>, or 15.59 lb-ft.</p>`,
  table: {
    title: 'How much torque does a 1, 5 or 10 hp motor have?',
    intro: 'Full-load torque in lb-ft at the common nameplate speeds of 60 Hz induction motors (2-, 4-, 6- and 8-pole), computed by the calculator.',
    head: ['Motor', '3,450 rpm', '1,750 rpm', '1,150 rpm', '870 rpm'],
    rows: ({ run, H }) => [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 50].map(hp => [H.num(hp, 2) + ' hp', ...[3450, 1750, 1150, 870].map(rpm => H.num(run({ mode: 'torque', power: hp, punit: 'hp', rpm })._lbft, 2))]),
    note: 'Multiply lb-ft by 1.3558 for N·m. Actual full-load speeds vary by a few percent with the motor\'s slip; use the nameplate figure.'
  },
  sections: [
    {
      h2: 'How do you calculate horsepower from torque?',
      html: `<p>Multiply torque in lb-ft by rpm and divide by 5,252. An engine making 400 lb-ft at 4,000 rpm produces 400 × 4,000 ÷ 5,252 = <strong>304.6 hp</strong> at that speed. In metric, kW = N·m × rpm ÷ 9,549.</p>
<p>Because of that constant, every dyno chart plotted in hp and lb-ft shows the two curves crossing at 5,252 rpm. Electric motors make their full torque from a standstill, while gasoline engines need revs, which is why an EV with modest horsepower can still out-accelerate a car with more.</p>`
    },
    {
      h2: 'Why does the same horsepower give different torque?',
      html: `<p>Power is torque times speed, so at a fixed power, halving speed doubles torque. An AC induction motor's speed is set by the supply frequency and pole count: synchronous rpm = 120 × frequency ÷ poles, so 1,800 rpm for a 4-pole motor on 60 Hz. Under load it slips a few percent, which is why nameplates read 1,725–1,770 rpm.</p>
<p>Choosing a slower motor (more poles) or adding a reducer is how you get high torque without buying more horsepower. A 1 hp motor makes 1.52 lb-ft at 3,450 rpm, but through a 10:1 <a href="/gear-ratio-calculator">gear reduction</a> the output shaft sees about 15 lb-ft at 345 rpm, less gearbox losses. On a variable-frequency drive, an induction motor can deliver roughly constant torque up to base speed and constant horsepower above it.</p>`
    },
    {
      h2: 'How do you calculate the torque needed to drive a lead screw?',
      html: `<p>For a power screw raising a load, torque = force × lead ÷ (2π × efficiency). Lead is the distance the nut travels per revolution (pitch × number of starts). Lifting 1,000 lbf with a 0.2 in-lead Acme screw at about 35% efficiency takes 1,000 × 0.2 ÷ (2π × 0.35) = <strong>90.9 lb-in</strong>. A ball screw at about 90% efficiency needs only 35.4 lb-in for the same job. Add the torque to accelerate the load and overcome friction in the guides, then size the motor with margin.</p>`
    }
  ],
  faq: [
    { q: 'How much torque does a 1 hp motor have?', a: 'About 3.0 lb-ft (4.07 N·m) at 1,750 rpm, and about 1.52 lb-ft (2.06 N·m) at 3,450 rpm. Lower-speed motors of the same horsepower have more torque.' },
    { q: 'How do I convert kW and rpm to N·m?', a: 'Multiply kW by 9,549 and divide by rpm. A 7.5 kW motor at 1,460 rpm produces 7.5 × 9,549 ÷ 1,460 = 49.1 N·m.' },
    { q: 'How do you convert lb-ft to N·m?', a: 'Multiply lb-ft by 1.3558. For example, 15 lb-ft is 20.34 N·m. To go back, multiply N·m by 0.7376.' },
    { q: 'How do I convert kW to hp?', a: 'Divide kW by 0.7457 (or multiply by 1.341). A 3.7 kW motor is about 4.96 hp, which is why it is sold as a 5 hp equivalent.' },
    { q: 'Why do horsepower and torque cross at 5,252 rpm?', a: 'Because hp = lb-ft × rpm ÷ 5,252. At exactly 5,252 rpm the division cancels, so the two numbers are equal on any engine or motor.' },
    { q: 'Is motor torque higher at startup?', a: 'For most AC induction motors, yes. A NEMA Design B motor typically has locked-rotor torque well above its full-load torque, and DC and permanent-magnet motors make maximum torque at stall. Check the manufacturer\'s speed-torque curve for exact figures.' }
  ],
  related: ['gear-ratio-calculator', 'pulley-calculator', 'kw-calculator', 'amps-calculator', 'engine-displacement-calculator'],
  sources: [
    { name: 'NIST Special Publication 811: Guide for the Use of the International System of Units (conversion factors)', url: 'https://www.nist.gov/pml/special-publication-811' },
    { name: 'U.S. DOE: Motor Systems (Industrial Efficiency and Decarbonization Office)', url: 'https://www.energy.gov/eere/iedo/motor-systems' },
    { name: 'Horsepower: definitions and the 33,000 ft·lbf/min relationship', url: 'https://en.wikipedia.org/wiki/Horsepower' },
    { name: 'Torque: definition and relation to power', url: 'https://en.wikipedia.org/wiki/Torque' }
  ]
};
