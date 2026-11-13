export default {
  slug: 'orbital-period-calculator',
  hub: 'science',
  name: 'Orbital Period Calculator',
  title: 'Orbital Period Calculator: 400 km Above Earth Is 92.4 Minutes',
  h1: 'Orbital Period Calculator: Kepler\'s Third Law for Any Planet or Star',
  meta: 'A satellite 400 km above Earth circles it every 92.4 minutes at 7.67 km/s. Find the period of any orbit around Earth, the Sun, Moon, Mars or Jupiter.',
  keyword: 'how to calculate orbital period',
  also: ['orbital period calculator', 'kepler\'s third law calculator', 'orbital period formula', 'how to calculate the period of a satellite', 'how to calculate orbital velocity'],
  updated: '2026-11-13',
  inputs: [
    { id: 'body', label: 'Central body (what is being orbited)', type: 'select', value: 'earth', options: [['earth', 'Earth'], ['sun', 'Sun'], ['moon', 'Moon'], ['mars', 'Mars'], ['jupiter', 'Jupiter'], ['custom', 'Custom mass']] },
    { id: 'mass', label: 'Mass of central body', type: 'number', value: 5.972e24, suffix: 'kg', help: 'Scientific notation works, e.g. 5.972e24.', showIf: { body: ['custom'] } },
    { id: 'radius', label: 'Radius of central body', type: 'number', value: 6371, suffix: 'km', help: 'Only needed when you enter an altitude.', showIf: { body: ['custom'] } },
    { id: 'measure', label: 'Distance given as', type: 'select', value: 'alt', options: [['alt', 'Altitude above the surface'], ['a', 'Semi-major axis (from the center)']] },
    { id: 'dist', label: 'Distance', type: 'number', value: 400 },
    { id: 'unit', label: 'Distance unit', type: 'select', value: 'km', options: [['km', 'kilometers'], ['mi', 'miles'], ['au', 'AU (astronomical units)']] }
  ],
  data: {
    G: 6.6743e-11,
    bodies: {
      earth: { name: 'Earth', gm: 3.986004e14, r: 6371.0 },
      sun: { name: 'the Sun', gm: 1.3271244e20, r: 695700 },
      moon: { name: 'the Moon', gm: 4.9028e12, r: 1737.4 },
      mars: { name: 'Mars', gm: 4.282837e13, r: 3389.5 },
      jupiter: { name: 'Jupiter', gm: 1.26686534e17, r: 69911 }
    }
  },
  compute(v, H, D) {
    var gm, rKm, name;
    if (v.body === 'custom') {
      if (!(v.mass > 0)) return { error: 'Enter the mass of the central body in kg.' };
      gm = D.G * v.mass; rKm = v.radius > 0 ? v.radius : 0; name = 'the central body';
    } else {
      var b = D.bodies[v.body];
      if (!b) return { error: 'Pick a central body.' };
      gm = b.gm; rKm = b.r; name = b.name;
    }
    if (!(v.dist >= 0) || (v.measure === 'a' && !(v.dist > 0))) return { error: 'Enter the orbit distance.' };
    var u = v.unit === 'mi' ? 1609.344 : v.unit === 'au' ? 1.495978707e11 : 1000;
    var d = v.dist * u;
    if (v.measure === 'alt' && v.body === 'custom' && !(rKm > 0)) return { error: 'Enter the radius of the central body, or switch to semi-major axis.' };
    var a = v.measure === 'alt' ? rKm * 1000 + d : d;
    if (rKm > 0 && a < rKm * 1000) return { error: 'That orbit would be inside ' + name + '. Use a larger distance.' };
    var T = 2 * Math.PI * Math.sqrt(a * a * a / gm);
    var vel = Math.sqrt(gm / a);
    var min = T / 60, hr = T / 3600, day = T / 86400, yr = day / 365.25;
    var value, label = 'Orbital period';
    if (min < 180) value = H.num(min, 1) + ' min';
    else if (hr < 72) value = H.num(hr, 2) + ' h';
    else if (yr < 2) value = H.num(day, 2) + ' days';
    else value = H.num(yr, 2) + ' years';
    var rows = [];
    rows.push(['Period in seconds', H.sig(T, 5) + ' s']);
    if (min < 1440) rows.push(['Period in minutes', H.num(min, 2) + ' min']);
    if (hr >= 1 && day < 30) rows.push(['Period in hours', H.num(hr, 3) + ' h']);
    if (day >= 0.5) rows.push(['Period in days', H.num(day, 3) + ' days']);
    if (day >= 30) rows.push(['Period in years', H.num(yr, 4) + ' yr']);
    rows.push(['Circular orbital speed', H.num(vel / 1000, 3) + ' km/s', true]);
    rows.push(['Speed in mph', H.int(vel * 2.2369362921) + ' mph']);
    if (day < 1) rows.push(['Orbits per day', H.num(86400 / T, 2)]);
    rows.push(['Semi-major axis a', H.sig(a / 1000, 6) + ' km']);
    return {
      value: value,
      label: label + ' around ' + name,
      expr: 'T = 2π √(a³ ÷ GM), a = ' + H.sig(a / 1000, 6) + ' km',
      rows: rows,
      sub: 'Speed assumes a circular orbit. For an ellipse the period is the same as long as a is the average of the closest and farthest distances from the center.'
    };
  },
  quick: ({ r }) => `To calculate an orbital period, use Kepler's third law: T = 2π √(a³ ÷ GM), where a is the orbit's semi-major axis measured from the planet's center. A satellite 400 km above Earth has a = 6,771 km, so T = 2π √(6.771×10⁶ m)³ ÷ 3.986×10¹⁴ = <strong>${r.value}</strong>, moving at about 7.67 km/s.`,
  stepsTitle: 'How to calculate orbital period step by step',
  steps: [
    'Pick what is being orbited. The calculator stores the gravitational parameter GM for Earth, the Sun, the Moon, Mars and Jupiter; for anything else enter the mass and it multiplies by G = 6.6743 × 10⁻¹¹ N·m²/kg².',
    'Enter the size of the orbit. The most common mistake is plugging in the <strong>altitude</strong> instead of the distance from the center: a = planet radius + altitude. Choose "Altitude above the surface" and the radius is added for you.',
    'Convert to meters before you cube anything. 400 km becomes 6,771,000 m once Earth\'s 6,371 km mean radius is added.',
    'Compute T = 2π √(a³ ÷ GM). The answer comes out in seconds; divide by 60, 3,600 or 86,400 for minutes, hours or days.'
  ],
  formulaTitle: 'What is the formula for orbital period?',
  formula: {
    expr: 'T = 2π √(a³ ÷ GM)<br>T² = (4π² ÷ GM) · a³<br>v<sub>circular</sub> = √(GM ÷ a)',
    vars: [['T', 'orbital period (s)'], ['a', 'semi-major axis, from the center of the central body (m)'], ['G', '6.6743 × 10⁻¹¹ N·m²/kg², the gravitational constant (CODATA 2018)'], ['M', 'mass of the central body (kg)'], ['GM', 'standard gravitational parameter: 3.986 × 10¹⁴ m³/s² for Earth, 1.327 × 10²⁰ m³/s² for the Sun']],
    note: 'Newton\'s version of Kepler\'s third law strictly uses G(M + m). When the orbiting object is a spacecraft, m is negligible. For a big moon or a binary star, add the two masses together in the custom option.'
  },
  example: `<p><strong>Geostationary orbit.</strong> A communications satellite sits 35,786 km above the equator. How long is one orbit?</p>
<p>a = 6,371 + 35,786 = 42,157 km = 4.2157 × 10⁷ m. a³ = 7.492 × 10²² m³.</p>
<p>a³ ÷ GM = 7.492 × 10²² ÷ 3.986 × 10¹⁴ = 1.880 × 10⁸ s². The square root is 13,710 s; times 2π gives <strong>86,140 s = 23.93 hours</strong>.</p>
<p>That is one sidereal day (23 h 56 min), which is why the satellite appears fixed in the sky. Its speed is √(GM ÷ a) = <strong>3.07 km/s</strong>.</p>`,
  table: {
    title: 'How long do common orbits take?',
    intro: 'Periods computed with the formula above from each orbit\'s altitude or mean distance. Real orbits differ slightly because of Earth\'s oblateness, drag and the pull of other bodies.',
    head: ['Orbit', 'Central body', 'Altitude or distance', 'Period', 'Speed'],
    rows: ({ run }) => [
      ['Low Earth orbit (ISS)', 'earth', 'alt', 400, 'km', '400 km altitude'],
      ['Hubble Space Telescope', 'earth', 'alt', 540, 'km', '540 km altitude'],
      ['GPS satellites', 'earth', 'alt', 20200, 'km', '20,200 km altitude'],
      ['Geostationary', 'earth', 'alt', 35786, 'km', '35,786 km altitude'],
      ['The Moon (Earth\'s mass only)', 'earth', 'a', 384400, 'km', '384,400 km from center'],
      ['Low lunar orbit', 'moon', 'alt', 100, 'km', '100 km altitude'],
      ['Low Mars orbit', 'mars', 'alt', 400, 'km', '400 km altitude'],
      ['Mercury', 'sun', 'a', 0.387, 'au', '0.387 AU'],
      ['Earth', 'sun', 'a', 1, 'au', '1 AU'],
      ['Mars', 'sun', 'a', 1.524, 'au', '1.524 AU'],
      ['Jupiter', 'sun', 'a', 5.203, 'au', '5.203 AU'],
      ['Neptune', 'sun', 'a', 30.07, 'au', '30.07 AU']
    ].map(x => { const r = run({ body: x[1], measure: x[2], dist: x[3], unit: x[4] }); const sp = r.rows.find(z => z[0] === 'Circular orbital speed'); return [x[0], x[1][0].toUpperCase() + x[1].slice(1), x[5], r.value, sp ? sp[1] : '']; }),
    note: 'The Moon\'s true sidereal period is 27.32 days. The 27.45 days shown uses Earth\'s mass alone; adding the Moon\'s own mass (1.2% of Earth\'s) to GM gives 27.28 days, within about an hour of the observed value.'
  },
  sections: [
    {
      h2: 'How do you find orbital period with Kepler\'s third law in AU and years?',
      html: `<p>For anything orbiting the Sun there is a shortcut that needs no constants: if a is in astronomical units and T in years, then <strong>T² = a³</strong>, so T = a<sup>1.5</sup>. It works because Earth defines both units (1 AU, 1 year).</p>
<p>Mars averages 1.524 AU from the Sun: 1.524³ = 3.540, and √3.540 = 1.881 years, or 687 days, matching the observed Martian year. An asteroid at 2.8 AU takes 2.8<sup>1.5</sup> = 4.69 years.</p>
<p>The same trick does not work around Earth or Jupiter without rescaling, because their GM is different. Use the full formula, or choose the body in the calculator.</p>`
    },
    {
      h2: 'How do you calculate the period of an elliptical orbit?',
      html: `<p>Use the semi-major axis, half the longest diameter of the ellipse. If you know the closest and farthest distances from the center of the central body (periapsis r<sub>p</sub> and apoapsis r<sub>a</sub>), then a = (r<sub>p</sub> + r<sub>a</sub>) ÷ 2. Eccentricity does not change the period.</p>
<p>Example: a transfer orbit from 300 km to 35,786 km altitude has r<sub>p</sub> = 6,671 km and r<sub>a</sub> = 42,157 km, so a = 24,414 km. Enter that as a semi-major axis and the calculator gives 10.55 hours for a full lap, so the one-way trip up to geostationary height takes half of that, about 5.3 hours.</p>
<p>When the heights are quoted as altitudes, add the planet's radius to each before averaging.</p>`
    },
    {
      h2: 'How do you calculate orbital velocity?',
      html: `<p>For a circular orbit, v = √(GM ÷ a), or equivalently the circumference divided by the period, v = 2πa ÷ T. At 400 km above Earth: √(3.986 × 10¹⁴ ÷ 6.771 × 10⁶) = 7,673 m/s, about 17,160 mph.</p>
<p>Lower orbits are faster and shorter. Doubling a makes the period 2<sup>1.5</sup> ≈ 2.83 times longer while the speed drops by a factor of √2. In an elliptical orbit the speed varies: fastest at periapsis, slowest at apoapsis (Kepler's second law).</p>`
    },
    {
      h2: 'How do you find the mass of a planet from a moon\'s orbit?',
      html: `<p>Rearrange the law: M = 4π²a³ ÷ (G T²). Measure how far a moon is from the planet and how long it takes to go around, and the planet's mass falls out. This is how astronomers weigh planets, stars and even the black hole at the center of the Milky Way.</p>
<p>The Moon orbits 3.844 × 10⁸ m from Earth every 27.32 days (2.3606 × 10⁶ s): M = 4π² × (3.844 × 10⁸)³ ÷ (6.6743 × 10⁻¹¹ × (2.3606 × 10⁶)²) ≈ 6.0 × 10²⁴ kg, the combined mass of Earth and Moon.</p>`
    }
  ],
  faq: [
    { q: 'What is the orbital period of the ISS?', a: 'About 92 to 93 minutes, or roughly 15.5 orbits a day. The calculator gives 92.4 minutes for a 400 km altitude; the station\'s height drifts between about 400 and 420 km.' },
    { q: 'Does the mass of the satellite affect its orbital period?', a: 'No. A 1 kg CubeSat and a 400-tonne space station at the same altitude have the same period, because the satellite\'s mass cancels out of the force balance. Only the mass of the central body matters.' },
    { q: 'What units should I use in the orbital period formula?', a: 'Use SI units: a in meters, M in kilograms and G = 6.6743 × 10⁻¹¹ N·m²/kg², which gives T in seconds. The shortcut T² = a³ works only for the Sun with a in AU and T in years.' },
    { q: 'Why is a geostationary orbit 35,786 km high?', a: 'It is the altitude where the period equals one sidereal day, 23 h 56 min 4 s. Solving T = 2π√(a³ ÷ GM) for a with that T gives a = 42,164 km from Earth\'s center, which is 35,786 km above the equator.' },
    { q: 'How long does it take Earth to orbit the Sun?', a: 'One sidereal year is 365.256 days. The calculator gives 365.26 days for a = 1 AU using the Sun\'s GM alone.' },
    { q: 'What is the difference between orbital period and rotation period?', a: 'Orbital period is the time to go once around another body; rotation period is the time to spin once on its own axis. Earth orbits the Sun in 365.26 days and rotates in 23.93 hours. The Moon\'s two periods are equal (27.32 days), so it always shows the same face.' },
    { q: 'How do I calculate the radius of an orbit from its period?', a: 'Rearrange to a = ∛(GM T² ÷ 4π²). For a 12-hour orbit around Earth, T = 43,200 s and a ≈ 26,610 km from the center. GPS satellites orbit in half a sidereal day (43,082 s), which puts them at about 26,560 km.' }
  ],
  related: ['wave-calculator', 'speed-calculator', 'force-calculator', 'scientific-notation-calculator', 'telescope-magnification-calculator'],
  sources: [
    { name: 'NASA NSSDCA: Planetary Fact Sheets (GM, radius, orbital periods)', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'NASA JPL Solar System Dynamics: Astrodynamic Parameters', url: 'https://ssd.jpl.nasa.gov/astro_par.html' },
    { name: 'NIST CODATA: Newtonian constant of gravitation G', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?bg' },
    { name: 'OpenStax University Physics Volume 1: 13.5 Kepler\'s Laws of Planetary Motion', url: 'https://openstax.org/books/university-physics-volume-1/pages/13-5-keplers-laws-of-planetary-motion' }
  ]
};
