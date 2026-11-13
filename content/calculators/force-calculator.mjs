export default {
  slug: 'force-calculator',
  hub: 'science',
  name: 'Force Calculator',
  title: 'Force Calculator: F = ma, 1,200 kg × 3 m/s² = 3,600 N',
  h1: 'Force Calculator: Newton\'s Second Law, Weight, Impulse and Springs',
  meta: 'Pushing a 1,200 kg car to 3 m/s² takes 3,600 N (809 lbf). Solve F = ma, weight on any planet, average impact force, vector magnitude or spring force.',
  keyword: 'how to calculate forces',
  also: ['force calculator', 'how to calculate force', 'how do you calculate magnitude of force', 'how to calculate the average force', 'how to calculate spring tension force at rest', 'newtons to pounds'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you know?', type: 'select', value: 'ma', options: [['ma', 'Mass and acceleration (F = ma)'], ['weight', 'Mass on a planet (weight = mg)'], ['impulse', 'Change in speed over a time (impact force)'], ['components', 'x and y components (magnitude)'], ['spring', 'Spring constant and stretch (F = kx)']] },
    { id: 'm', label: 'Mass', type: 'number', value: 1200, suffix: 'kg', showIf: { mode: ['ma', 'weight', 'impulse'] } },
    { id: 'a', label: 'Acceleration', type: 'number', value: 3, suffix: 'm/s²', showIf: { mode: ['ma'] } },
    { id: 'planet', label: 'Where', type: 'select', value: 'earth', options: [['earth', 'Earth (9.80665 m/s²)'], ['moon', 'Moon (1.62)'], ['mars', 'Mars (3.71)'], ['venus', 'Venus (8.87)'], ['mercury', 'Mercury (3.7)'], ['jupiter', 'Jupiter (24.79)'], ['saturn', 'Saturn (10.44)'], ['neptune', 'Neptune (11.15)']], showIf: { mode: ['weight'] } },
    { id: 'v1', label: 'Starting speed', type: 'number', value: 0, suffix: 'm/s', showIf: { mode: ['impulse'] } },
    { id: 'v2', label: 'Final speed', type: 'number', value: 25, suffix: 'm/s', showIf: { mode: ['impulse'] } },
    { id: 'dt', label: 'Contact or stopping time', type: 'number', value: 0.008, suffix: 's', showIf: { mode: ['impulse'] } },
    { id: 'fx', label: 'Horizontal component Fx', type: 'number', value: 30, suffix: 'N', showIf: { mode: ['components'] } },
    { id: 'fy', label: 'Vertical component Fy', type: 'number', value: 40, suffix: 'N', showIf: { mode: ['components'] } },
    { id: 'k', label: 'Spring constant k', type: 'number', value: 200, suffix: 'N/m', showIf: { mode: ['spring'] } },
    { id: 'x', label: 'Stretch or compression x', type: 'number', value: 0.05, suffix: 'm', showIf: { mode: ['spring'] } }
  ],
  data: { g: { earth: 9.80665, moon: 1.62, mars: 3.71, venus: 8.87, mercury: 3.7, jupiter: 24.79, saturn: 10.44, neptune: 11.15 }, names: { earth: 'Earth', moon: 'the Moon', mars: 'Mars', venus: 'Venus', mercury: 'Mercury', jupiter: 'Jupiter', saturn: 'Saturn', neptune: 'Neptune' } },
  compute(v, H, D) {
    var F, expr, label, rows = [], sub = '';
    if (v.mode === 'ma') {
      if (!(v.m > 0)) return { error: 'Enter the mass in kilograms.' };
      if (!isFinite(v.a)) return { error: 'Enter the acceleration in m/s².' };
      F = v.m * v.a; expr = H.num(v.m, 4) + ' kg × ' + H.num(v.a, 4) + ' m/s²'; label = 'Net force';
      sub = 'This is the net (unbalanced) force. If friction or drag also acts, the applied force must be larger by that amount.';
    } else if (v.mode === 'weight') {
      var g = D.g[v.planet];
      if (!(v.m > 0) || !g) return { error: 'Enter the mass in kilograms.' };
      F = v.m * g; expr = H.num(v.m, 4) + ' kg × ' + H.num(g, 5) + ' m/s²'; label = 'Weight on ' + D.names[v.planet];
      rows.push(['Same weight on Earth would be a mass of', H.num(F / 9.80665, 2) + ' kg']);
      sub = 'Mass stays ' + H.num(v.m, 4) + ' kg everywhere; only the pull of gravity, and so the weight, changes.';
    } else if (v.mode === 'impulse') {
      if (!(v.m > 0)) return { error: 'Enter the mass in kilograms.' };
      if (!isFinite(v.v1) || !isFinite(v.v2)) return { error: 'Enter the starting and final speeds.' };
      if (!(v.dt > 0)) return { error: 'Enter a contact time greater than zero.' };
      var dp = v.m * (v.v2 - v.v1);
      F = dp / v.dt; expr = H.num(v.m, 4) + ' kg × (' + H.num(v.v2, 4) + ' − ' + H.num(v.v1, 4) + ') m/s ÷ ' + H.num(v.dt, 6) + ' s'; label = 'Average force during contact';
      rows.push(['Impulse (change in momentum)', H.num(dp, 4) + ' N·s']);
      rows.push(['Average acceleration', H.num((v.v2 - v.v1) / v.dt, 2) + ' m/s² (' + H.num((v.v2 - v.v1) / v.dt / 9.80665, 1) + ' g)']);
      sub = 'Peak force is higher than this average. Stretching the time (padding, crumple zones, bending your knees) cuts the force in proportion.';
    } else if (v.mode === 'components') {
      if (!isFinite(v.fx) || !isFinite(v.fy)) return { error: 'Enter both components in newtons.' };
      F = Math.sqrt(v.fx * v.fx + v.fy * v.fy); expr = '√(' + H.num(v.fx, 4) + '² + ' + H.num(v.fy, 4) + '²)'; label = 'Magnitude of the resultant force';
      var ang = Math.atan2(v.fy, v.fx) * 180 / Math.PI;
      rows.push(['Direction (from +x axis)', H.num(ang, 2) + '°']);
      sub = 'The resultant points ' + H.num(ang, 1) + '° counterclockwise from the positive x axis.';
    } else if (v.mode === 'spring') {
      if (!(v.k > 0) || !isFinite(v.x)) return { error: 'Enter the spring constant and the stretch.' };
      F = v.k * Math.abs(v.x); expr = H.num(v.k, 4) + ' N/m × ' + H.num(Math.abs(v.x), 5) + ' m'; label = 'Spring force (restoring)';
      rows.push(['Mass that would hang at rest at this stretch', H.num(F / 9.80665, 3) + ' kg']);
      rows.push(['Elastic energy stored ½kx²', H.num(0.5 * v.k * v.x * v.x, 4) + ' J']);
      sub = 'Hooke\'s law holds only while the spring is in its elastic range; overstretched springs stop being linear.';
    } else return { error: 'Choose what you know.' };
    rows.unshift(['Kilonewtons', H.num(F / 1000, 4) + ' kN'], ['Pounds-force', H.num(F / 4.4482216152605, 2) + ' lbf', true], ['Kilograms-force', H.num(F / 9.80665, 2) + ' kgf']);
    return { value: H.num(F, Math.abs(F) < 10 ? 3 : 1) + ' N', label: label, expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate force, multiply mass by acceleration: F = m × a, with mass in kilograms and acceleration in m/s², giving newtons (N). Accelerating a 1,200 kg car at 3 m/s² takes 1,200 × 3 = <strong>${r.value}</strong>, about 809 pounds-force. Weight is the same law with a = g: a 70 kg person weighs 686 N on Earth.`,
  stepsTitle: 'How to calculate force',
  steps: [
    'List every force on the object (gravity, normal force, friction, tension, your push) on a free-body sketch. Forget one and the answer is wrong no matter how good the arithmetic is.',
    'Pick the matching relationship: F = ma for acceleration, W = mg for weight, F = Δp ÷ Δt for a collision, Pythagoras for components, F = kx for a spring.',
    'Use kilograms, meters and seconds. Grams must be divided by 1,000; a "weight" given in pounds is already a force (1 lbf = 4.448 N), not a mass.',
    'Add forces as vectors: forces in the same direction add, opposite ones subtract, and perpendicular ones combine as √(Fx² + Fy²).',
    'Check the sign and size. A net force of zero means constant velocity, not necessarily standing still.'
  ],
  formulaTitle: 'What are the force formulas?',
  formula: {
    expr: 'F<sub>net</sub> = m a<br>W = m g<br>F<sub>avg</sub> = m (v<sub>f</sub> − v<sub>i</sub>) ÷ Δt<br>|F| = √(F<sub>x</sub>² + F<sub>y</sub>²)<br>F<sub>spring</sub> = k x',
    vars: [['m', 'mass (kg)'], ['a', 'acceleration (m/s²)'], ['g', 'gravitational acceleration, 9.80665 m/s² standard on Earth'], ['Δt', 'time the force acts (s)'], ['k', 'spring constant (N/m)'], ['x', 'stretch or compression from the relaxed length (m)']],
    note: 'One newton is the force that accelerates 1 kg at 1 m/s². 1 N = 0.2248 lbf, and 1 lbf = 4.448 N.'
  },
  example: `<p><strong>Friction on a crate.</strong> You push a 20 kg crate across a floor with 100 N. The coefficient of kinetic friction is 0.30. What is the net force and the acceleration?</p>
<p>Normal force = m g = 20 × 9.81 = 196.2 N. Friction = μ × N = 0.30 × 196.2 = <strong>58.9 N</strong>, opposing the push.</p>
<p>Net force = 100 − 58.9 = <strong>41.1 N</strong>. Acceleration = 41.1 ÷ 20 = <strong>2.06 m/s²</strong>.</p>
<p>Enter m = 20 and a = 2.06 in F = ma mode to check: the calculator returns about 41.2 N, the same net force within rounding.</p>`,
  table: {
    title: 'How much does a 70 kg person weigh on other planets?',
    intro: 'Weight W = mg for a 70 kg mass, using surface gravity from NASA\'s planetary fact sheets. Mass never changes; only the force does.',
    head: ['Location', 'g (m/s²)', 'Weight (N)', 'Weight (lbf)', 'Feels like on Earth'],
    rows: ({ run, D }) => ['moon', 'mercury', 'mars', 'venus', 'earth', 'saturn', 'neptune', 'jupiter'].map(p => { const r = run({ mode: 'weight', m: 70, planet: p }); return [D.names[p].replace('the ', 'The '), String(D.g[p]), r.value, r.rows[1][1], r.rows[3][1]]; }),
    note: 'Gas giants have no solid surface; their g is quoted at the altitude where atmospheric pressure is 1 bar.'
  },
  sections: [
    {
      h2: 'How do you calculate the magnitude of a force?',
      html: `<p>Break each force into x and y components, add all the x parts and all the y parts, then combine: |F| = √(ΣF<sub>x</sub>² + ΣF<sub>y</sub>²). The direction is θ = tan⁻¹(ΣF<sub>y</sub> ÷ ΣF<sub>x</sub>), adjusted for the quadrant.</p>
<p>Two ropes pull a sled, one with 30 N east and one with 40 N north. The resultant is √(30² + 40²) = <strong>50 N</strong> at 53.1° north of east. If a single force of 80 N acts at 25° above horizontal, its components are 80 cos 25° = 72.5 N and 80 sin 25° = 33.8 N.</p>`
    },
    {
      h2: 'How do you calculate the average force of an impact?',
      html: `<p>Use the impulse–momentum theorem: average force = change in momentum ÷ contact time, F = m Δv ÷ Δt. A 0.45 kg soccer ball kicked from rest to 25 m/s with the foot in contact for 0.008 s feels 0.45 × 25 ÷ 0.008 = <strong>1,406 N</strong>, more than 300 pounds-force, for eight thousandths of a second.</p>
<p>The same idea explains airbags. A 70 kg passenger stopping from 15 m/s (34 mph) in 0.01 s against a dashboard would take 105,000 N; spread over 0.1 s by an airbag it is 10,500 N. Ten times the stopping time, one tenth the force.</p>`
    },
    {
      h2: 'How do you calculate spring tension force at rest?',
      html: `<p>When a mass hangs still on a spring, the spring force balances its weight exactly: k x = m g. So the tension is simply the weight, and you can find the spring constant from a single measurement: k = m g ÷ x.</p>
<p>A 0.50 kg mass stretches a spring 4.0 cm. Tension = 0.50 × 9.81 = <strong>4.9 N</strong>, and k = 4.9 ÷ 0.040 = 123 N/m. Hang 1.0 kg instead and the stretch doubles to 8.0 cm, as long as the spring stays in its linear range.</p>`
    },
    {
      h2: 'What is the difference between mass and weight?',
      html: `<p>Mass (kg) is the amount of matter and does not depend on location. Weight is a force (N) equal to mass times local gravity. A 70 kg astronaut is 70 kg on the Moon but weighs 113 N there instead of 686 N on Earth.</p>
<p>Bathroom scales display kilograms or pounds because they divide the force they measure by Earth's g. In U.S. engineering, "pounds" usually means pounds-force: a 150 lb person exerts 150 lbf, or 667 N, on the floor.</p>`
    }
  ],
  faq: [
    { q: 'What unit is force measured in?', a: 'The SI unit is the newton (N), equal to 1 kg·m/s². U.S. customary work uses pounds-force (lbf); 1 lbf = 4.448 N. Older metric texts use kilograms-force (1 kgf = 9.80665 N) and dynes (1 N = 100,000 dyn).' },
    { q: 'How do you calculate force without acceleration?', a: 'Use another relationship: weight (mg) for gravity, Δp ÷ Δt when you know a change in speed and a time, kx for a spring, or pressure × area for a fluid. Or find acceleration first from a = (v_f − v_i) ÷ t.' },
    { q: 'What is net force?', a: 'The vector sum of all forces on an object. If 100 N pushes right and 60 N of friction pulls left, the net force is 40 N to the right, and that 40 N is what goes into F = ma.' },
    { q: 'How many newtons is 1 kg?', a: 'A 1 kg mass weighs 9.81 N on Earth (9.80665 N exactly at standard gravity). Strictly, kilograms measure mass and newtons measure force, so 1 kg only equals 9.81 N as a weight at Earth\'s surface.' },
    { q: 'How do you convert newtons to pounds?', a: 'Divide by 4.448. For example, 3,600 N ÷ 4.448 = 809 lbf. To go from pounds-force to newtons, multiply by 4.448.' },
    { q: 'Does a moving object always have a force on it?', a: 'No. By Newton\'s first law an object keeps moving at constant velocity when the net force is zero. A force is only needed to change speed or direction.' },
    { q: 'How do you calculate the force of friction?', a: 'Multiply the coefficient of friction by the normal force: f = μN. On a level floor N = mg, so a 20 kg crate with μ = 0.30 has 0.30 × 20 × 9.81 = 58.9 N of kinetic friction.' }
  ],
  related: ['joules-calculator', 'stress-calculator', 'speed-calculator', 'torque-calculator', 'pulley-calculator'],
  sources: [
    { name: 'OpenStax University Physics Volume 1: 5.3 Newton\'s Second Law', url: 'https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law' },
    { name: 'NASA NSSDCA: Planetary Fact Sheet (surface gravity)', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'NIST CODATA: standard acceleration of gravity', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?gn' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI', url: 'https://www.nist.gov/pml/special-publication-811' }
  ]
};
