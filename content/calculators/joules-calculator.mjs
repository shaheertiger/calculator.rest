export default {
  slug: 'joules-calculator',
  hub: 'science',
  name: 'Energy in Joules Calculator',
  title: 'Joules Calculator: A 1,500 kg Car at 25 m/s Has 468,750 J',
  h1: 'Energy in Joules: Kinetic, Potential, Work, Watts and Conversions',
  meta: 'A 1,500 kg car moving at 25 m/s carries 468,750 J of kinetic energy (0.13 kWh). Work out joules from ½mv², mgh, F × d or watts × seconds.',
  keyword: 'how to calculate energy in joules',
  also: ['joules calculator', 'how to calculate joules', 'kinetic energy calculator', 'potential energy calculator', 'how to calculate work done by gravitational force', 'joules to calories', 'joules to kwh'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Energy from', type: 'select', value: 'ke', options: [['ke', 'Motion: kinetic energy ½mv²'], ['pe', 'Height: potential energy mgh'], ['work', 'Work: force × distance'], ['power', 'Power × time (watts × seconds)'], ['convert', 'Convert calories, kWh, BTU, eV…']] },
    { id: 'm', label: 'Mass', type: 'number', value: 1500, suffix: 'kg', showIf: { mode: ['ke', 'pe'] } },
    { id: 'speed', label: 'Speed', type: 'number', value: 25, showIf: { mode: ['ke'] } },
    { id: 'su', label: 'Speed unit', type: 'select', value: 'ms', options: [['ms', 'm/s'], ['kmh', 'km/h'], ['mph', 'mph']], showIf: { mode: ['ke'] } },
    { id: 'h', label: 'Height raised or dropped', type: 'number', value: 10, suffix: 'm', showIf: { mode: ['pe'] } },
    { id: 'g', label: 'Gravitational acceleration g', type: 'number', value: 9.81, suffix: 'm/s²', help: '9.81 on Earth (9.80665 standard), 1.62 on the Moon, 3.71 on Mars.', showIf: { mode: ['pe'] } },
    { id: 'f', label: 'Force', type: 'number', value: 50, suffix: 'N', showIf: { mode: ['work'] } },
    { id: 'd', label: 'Distance moved', type: 'number', value: 10, suffix: 'm', showIf: { mode: ['work'] } },
    { id: 'angle', label: 'Angle between force and motion', type: 'number', value: 0, suffix: '°', help: '0° when you push in the direction of travel.', showIf: { mode: ['work'] } },
    { id: 'p', label: 'Power', type: 'number', value: 60, suffix: 'W', showIf: { mode: ['power'] } },
    { id: 't', label: 'Time', type: 'number', value: 1, showIf: { mode: ['power'] } },
    { id: 'tu', label: 'Time unit', type: 'select', value: 'h', options: [['s', 'seconds'], ['min', 'minutes'], ['h', 'hours']], showIf: { mode: ['power'] } },
    { id: 'amt', label: 'Amount', type: 'number', value: 250, showIf: { mode: ['convert'] } },
    { id: 'from', label: 'Unit', type: 'select', value: 'kcal', options: [['kcal', 'kcal (food Calories)'], ['cal', 'cal (small calories)'], ['kwh', 'kWh'], ['wh', 'Wh'], ['btu', 'BTU'], ['kj', 'kJ'], ['ftlb', 'ft·lbf'], ['ev', 'eV (electronvolts)']], showIf: { mode: ['convert'] } }
  ],
  data: { per: { cal: 4.184, kcal: 4184, kwh: 3600000, wh: 3600, btu: 1055.05585262, kj: 1000, ftlb: 1.3558179483, ev: 1.602176634e-19 } },
  compute(v, H, D) {
    var J, expr, label;
    if (v.mode === 'ke') {
      if (!(v.m > 0)) return { error: 'Enter the mass in kilograms.' };
      if (!(v.speed >= 0)) return { error: 'Enter the speed.' };
      var ms = v.su === 'kmh' ? v.speed / 3.6 : v.su === 'mph' ? v.speed * 0.44704 : v.speed;
      J = 0.5 * v.m * ms * ms;
      expr = '½ × ' + H.num(v.m, 3) + ' kg × (' + H.num(ms, 3) + ' m/s)²';
      label = 'Kinetic energy';
    } else if (v.mode === 'pe') {
      if (!(v.m > 0)) return { error: 'Enter the mass in kilograms.' };
      if (!isFinite(v.h)) return { error: 'Enter the height in meters.' };
      var g = v.g > 0 ? v.g : 9.81;
      J = v.m * g * v.h;
      expr = H.num(v.m, 3) + ' kg × ' + H.num(g, 5) + ' m/s² × ' + H.num(v.h, 3) + ' m';
      label = 'Gravitational potential energy';
    } else if (v.mode === 'work') {
      if (!isFinite(v.f) || !isFinite(v.d)) return { error: 'Enter the force and the distance.' };
      var ang = isFinite(v.angle) ? v.angle : 0;
      var c = Math.cos(ang * Math.PI / 180);
      if (Math.abs(c) < 1e-12) c = 0;
      J = v.f * v.d * c;
      expr = H.num(v.f, 3) + ' N × ' + H.num(v.d, 3) + ' m' + (ang ? ' × cos ' + H.num(ang, 2) + '°' : '');
      label = 'Work done';
    } else if (v.mode === 'power') {
      if (!(v.p >= 0) || !(v.t >= 0)) return { error: 'Enter the power in watts and the time.' };
      var sec = v.tu === 'h' ? v.t * 3600 : v.tu === 'min' ? v.t * 60 : v.t;
      J = v.p * sec;
      expr = H.num(v.p, 3) + ' W × ' + H.num(sec, 3) + ' s';
      label = 'Energy used';
    } else {
      var k = D.per[v.from];
      if (!k || !isFinite(v.amt)) return { error: 'Enter an amount to convert.' };
      J = v.amt * k;
      expr = H.num(v.amt, 6) + ' ' + v.from.replace('kwh', 'kWh').replace('wh', 'Wh').replace('btu', 'BTU').replace('kj', 'kJ').replace('ftlb', 'ft·lbf').replace('ev', 'eV') + ' × ' + H.sig(k, 9) + ' J';
      label = 'Energy in joules';
    }
    var f = function (x) { return Math.abs(x) >= 1e-3 && Math.abs(x) < 1e15 ? H.num(x, Math.abs(x) < 10 ? 4 : 2) : H.sig(x, 4); };
    var rows = [
      ['Kilojoules', f(J / 1000) + ' kJ'],
      ['Kilowatt-hours', f(J / D.per.kwh) + ' kWh'],
      ['Food Calories (kcal)', f(J / D.per.kcal) + ' kcal', true],
      ['Small calories', f(J / D.per.cal) + ' cal'],
      ['BTU', f(J / D.per.btu) + ' BTU'],
      ['Foot-pounds', f(J / D.per.ftlb) + ' ft·lbf']
    ];
    if (Math.abs(J) < 1e-6) rows.push(['Electronvolts', H.sig(J / D.per.ev, 5) + ' eV']);
    var sub = '';
    if (v.mode === 'ke') sub = 'Double the speed and the energy quadruples; at ' + H.num(2 * v.speed, 3) + ' ' + (v.su === 'mph' ? 'mph' : v.su === 'kmh' ? 'km/h' : 'm/s') + ' this would be ' + f(4 * J) + ' J.';
    else if (v.mode === 'pe') sub = 'Dropped from this height with no air resistance, it would hit the ground at ' + H.num(Math.sqrt(2 * (v.g > 0 ? v.g : 9.81) * Math.abs(v.h)), 3) + ' m/s carrying the same ' + f(Math.abs(J)) + ' J.';
    else if (v.mode === 'work') sub = J < 0 ? 'Negative work: the force acts against the motion and takes energy out (like friction or braking).' : 'Only the part of the force along the direction of motion does work.';
    else if (v.mode === 'power') sub = 'One watt is one joule per second, so watts × seconds = joules.';
    return { value: f(J) + ' J', label: label, expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate energy in joules, use SI units: kinetic energy is ½ × mass (kg) × speed² (m/s), potential energy is m × g × h, and work is force (N) × distance (m). A 1,500 kg car at 25 m/s (56 mph) has ½ × 1,500 × 25² = <strong>${r.value}</strong> of kinetic energy, equal to 0.13 kWh or 112 food Calories.`,
  stepsTitle: 'How to calculate joules in 4 steps',
  steps: [
    'Decide where the energy comes from: motion (kinetic), height (gravitational potential), a force pushing something along (work), or a device running at a known wattage.',
    'Convert everything to SI units first: grams to kilograms (÷ 1,000), km/h to m/s (÷ 3.6), mph to m/s (× 0.44704), centimeters to meters. Mixing units is the step that ruins most answers.',
    'Apply the matching formula: ½mv², mgh, F·d·cos θ or P·t. Square the speed <em>before</em> multiplying by mass, and only the speed.',
    'Read the result in joules (kg·m²/s²). Divide by 1,000 for kJ, by 4,184 for food Calories or by 3,600,000 for kWh.'
  ],
  formulaTitle: 'What formulas give energy in joules?',
  formula: {
    expr: 'KE = ½ m v²<br>PE = m g h<br>W = F d cos θ<br>E = P t',
    vars: [['m', 'mass in kilograms'], ['v', 'speed in meters per second'], ['g', 'gravitational acceleration, 9.81 m/s² near Earth\'s surface'], ['h', 'height change in meters'], ['F, d', 'force in newtons and distance in meters'], ['θ', 'angle between the force and the direction of motion'], ['P, t', 'power in watts and time in seconds']],
    note: '1 joule = 1 newton-meter = 1 watt-second = 1 kg·m²/s². It is roughly the energy needed to lift a medium apple (about 100 g) one meter.'
  },
  example: `<p><strong>Stairs versus snack.</strong> A 70 kg student climbs a 3.0 m flight of stairs. How much energy does that take, and how many food Calories is it?</p>
<p>PE = m g h = 70 × 9.81 × 3.0 = <strong>2,060 J</strong> (2.06 kJ).</p>
<p>In food Calories: 2,060 ÷ 4,184 = <strong>0.49 kcal</strong>. Because muscles turn only about a quarter of food energy into mechanical work, the body actually burns closer to 2 kcal, still a tiny fraction of a 250 kcal candy bar (1,046,000 J).</p>`,
  table: {
    title: 'How many joules are in everyday things?',
    intro: 'Each value is computed with the same formulas the calculator uses, so you can reproduce any row by choosing the mode and typing the numbers.',
    head: ['Example', 'Inputs', 'Energy', 'kcal'],
    rows: ({ run }) => [
      ['Lifting a 1 kg book 1 m', { mode: 'pe', m: 1, h: 1, g: 9.81 }, 'mgh'],
      ['Baseball pitched at 90 mph', { mode: 'ke', m: 0.145, speed: 90, su: 'mph' }, '0.145 kg, ½mv²'],
      ['Pushing a box with 50 N for 10 m', { mode: 'work', f: 50, d: 10, angle: 0 }, 'F × d'],
      ['70 kg person up a 3 m stairway', { mode: 'pe', m: 70, h: 3, g: 9.81 }, 'mgh'],
      ['1 BTU of heat', { mode: 'convert', amt: 1, from: 'btu' }, 'conversion'],
      ['1 food Calorie', { mode: 'convert', amt: 1, from: 'kcal' }, 'conversion'],
      ['60 W bulb for 1 hour', { mode: 'power', p: 60, t: 1, tu: 'h' }, 'P × t'],
      ['1,500 kg car at 25 m/s (56 mph)', { mode: 'ke', m: 1500, speed: 25, su: 'ms' }, '½mv²'],
      ['Same car at 35 m/s (78 mph)', { mode: 'ke', m: 1500, speed: 35, su: 'ms' }, '½mv²'],
      ['1 kWh on your electric bill', { mode: 'convert', amt: 1, from: 'kwh' }, 'conversion']
    ].map(x => { const r = run(x[1]); return [x[0], x[2], r.value, r.rows[2][1]]; }),
    note: 'Calories here are thermochemical (1 cal = 4.184 J), the value used on U.S. nutrition labels and in chemistry. BTU is the International Table BTU (1,055.06 J).'
  },
  sections: [
    {
      h2: 'How many joules are in a calorie, a kWh or a BTU?',
      html: `<ul>
<li><strong>1 calorie (cal)</strong> = 4.184 J. A food Calorie with a capital C is a kilocalorie: 4,184 J.</li>
<li><strong>1 watt-hour</strong> = 3,600 J, and <strong>1 kilowatt-hour</strong> = 3,600,000 J (3.6 MJ).</li>
<li><strong>1 BTU</strong> ≈ 1,055 J, the heat that warms one pound of water by 1 °F.</li>
<li><strong>1 foot-pound</strong> ≈ 1.356 J.</li>
<li><strong>1 electronvolt</strong> = 1.602176634 × 10⁻¹⁹ J (exact since the 2019 SI redefinition).</li>
</ul>
<p>Going the other way, divide joules by the same factor. 1,000,000 J is 239 kcal, 0.278 kWh or 948 BTU.</p>`
    },
    {
      h2: 'Why does doubling the speed quadruple kinetic energy?',
      html: `<p>Speed is squared in ½mv², so energy grows with the square of velocity. Going from 25 m/s to 35 m/s (56 to 78 mph) is a 40% rise in speed but takes the car from 468,750 J to 918,750 J, a 96% rise. Brakes have to absorb all of it as heat, which is why stopping distance grows so fast with speed.</p>
<p>Mass, on the other hand, is linear: a 3,000 kg truck at 25 m/s has exactly twice the car's 468,750 J.</p>`
    },
    {
      h2: 'How do you calculate work done by gravity?',
      html: `<p>Work by gravity is W = m g Δh, with a positive sign when the object moves down and a negative sign when it moves up. A 2 kg bag dropped 1.5 m receives +2 × 9.81 × 1.5 = <strong>29.4 J</strong> of work from gravity, all of which becomes kinetic energy just before impact. Lifting it back up, gravity does −29.4 J and your arm does +29.4 J.</p>
<p>Only the vertical change counts. Carrying the bag 20 m across a level floor, gravity does no work, because the force (down) is at 90° to the motion and cos 90° = 0. On a ramp, use the height gained, not the length of the slope.</p>`
    },
    {
      h2: 'What is the difference between joules and watts?',
      html: `<p>A joule is an amount of energy; a watt is a rate, one joule per second. A 1,500 W hair dryer running for 10 minutes (600 s) uses 1,500 × 600 = 900,000 J, or 0.25 kWh. To turn a battery's watt-hour rating into joules, multiply by 3,600; to cost out electricity in kWh, see the <a href="/watt-hours-calculator">watt-hours calculator</a>.</p>
<p>For heat that raises a temperature, the joules come from q = m c ΔT instead; use the <a href="/specific-heat-calculator">specific heat calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate joules from mass and velocity?', a: 'Use KE = ½mv² with mass in kilograms and velocity in meters per second. A 0.5 kg ball at 4 m/s has ½ × 0.5 × 16 = 4 J.' },
    { q: 'How do you calculate joules from watts?', a: 'Multiply watts by seconds: E = P × t. A 10 W LED left on for 1 hour (3,600 s) uses 36,000 J.' },
    { q: 'How many joules does it take to lift 1 kg by 1 meter?', a: 'About 9.81 J on Earth, from m g h = 1 × 9.81 × 1. On the Moon, where g is 1.62 m/s², the same lift takes only 1.62 J.' },
    { q: 'Is a newton-meter the same as a joule?', a: 'Dimensionally yes: 1 N·m = 1 J when it describes energy or work. Torque is also measured in N·m, but by convention torque is never written in joules because it is not energy.' },
    { q: 'How many joules are in 1 kWh?', a: '1 kWh = 3,600,000 J (3.6 megajoules), because 1,000 W × 3,600 s = 3,600,000 W·s.' },
    { q: 'Can energy in joules be negative?', a: 'Kinetic energy cannot, because speed is squared. Potential energy and work can: potential energy depends on where you set zero height, and work is negative when the force opposes the motion, as friction does.' },
    { q: 'How many joules are in a food Calorie?', a: '4,184 J. A 2,000 Calorie diet supplies about 8.4 million joules (8.4 MJ) a day, roughly the energy in 2.3 kWh.' }
  ],
  related: ['specific-heat-calculator', 'efficiency-calculator', 'force-calculator', 'watt-hours-calculator', 'kw-calculator'],
  sources: [
    { name: 'NIST Special Publication 811: Guide for the Use of the SI (conversion factors)', url: 'https://www.nist.gov/pml/special-publication-811' },
    { name: 'BIPM: The International System of Units (SI Brochure)', url: 'https://www.bipm.org/en/publications/si-brochure' },
    { name: 'OpenStax University Physics Volume 1: 7.2 Kinetic Energy', url: 'https://openstax.org/books/university-physics-volume-1/pages/7-2-kinetic-energy' },
    { name: 'NIST CODATA: electron volt–joule relationship', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?evj' }
  ]
};
