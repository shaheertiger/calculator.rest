export default {
  slug: 'foil-thickness-calculator',
  hub: 'science',
  name: 'Aluminum Foil Thickness Calculator',
  title: 'Aluminum Foil Thickness Calculator: 0.842 g Sheet Is 15.6 µm',
  h1: 'Aluminum Foil Thickness Lab: Thickness From Mass, Size and Density',
  meta: 'A 20.0 × 10.0 cm sheet of aluminum foil weighing 0.842 g is 1.56 × 10⁻³ cm (15.6 µm) thick, about 54,500 atoms. Enter your lab data to get t = m ÷ (ρLW).',
  keyword: 'how do you calculate the thickness of aluminum foil',
  also: ['how to calculate thickness of aluminum foil', 'how to calculate the thickness of aluminum foil', 'aluminum foil thickness lab', 'thickness of aluminum foil in atoms', 'how to calculate thickness from mass and density', 'how to calculate thickness'],
  updated: '2026-11-13',
  inputs: [
    { id: 'm', label: 'Mass of the foil', type: 'number', value: 0.842, suffix: 'g' },
    { id: 'L', label: 'Length', type: 'number', value: 20.0 },
    { id: 'W', label: 'Width', type: 'number', value: 10.0 },
    { id: 'u', label: 'Length and width measured in', type: 'select', value: 'cm', options: [['cm', 'centimeters'], ['mm', 'millimeters'], ['in', 'inches']] },
    { id: 'rho', label: 'Density of aluminum', type: 'number', value: 2.70, suffix: 'g/cm³', help: 'Pure aluminum is 2.70 g/cm³ at room temperature.' },
    { id: 'd', label: 'Diameter of one aluminum atom', type: 'number', value: 2.86e-8, suffix: 'cm', help: '2.86 × 10⁻⁸ cm (286 pm). Type it as 2.86e-8.' },
    { id: 'acc', label: 'Accepted thickness (optional)', type: 'number', value: '', suffix: 'mm', placeholder: 'e.g. 0.016', help: 'From the box or your teacher; adds percent error.' }
  ],
  compute(v, H) {
    if (!(v.m > 0)) return { error: 'Enter the mass of the foil in grams.' };
    if (!(v.L > 0) || !(v.W > 0)) return { error: 'Enter the length and width of the sheet.' };
    if (!(v.rho > 0)) return { error: 'Enter the density in g/cm³ (2.70 for aluminum).' };
    var f = v.u === 'mm' ? 0.1 : v.u === 'in' ? 2.54 : 1;
    var area = v.L * f * v.W * f;
    var vol = v.m / v.rho;
    var t = vol / area;
    var sup = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    var sci = function (x, n) {
      if (!(x > 0)) return '—';
      var e = Math.floor(Math.log10(x)), mant = x / Math.pow(10, e);
      if (Number(mant.toFixed(n - 1)) >= 10) { e += 1; mant = x / Math.pow(10, e); }
      return mant.toFixed(n - 1) + ' × 10' + String(e).split('').map(function (c) { return sup[c]; }).join('');
    };
    var rows = [
      ['Thickness in mm', H.sig(t * 10, 3) + ' mm'],
      ['Thickness in micrometers', H.sig(t * 1e4, 3) + ' µm', true],
      ['Thickness in inches', H.sig(t / 2.54, 3) + ' in (' + H.sig(t / 2.54 * 1000, 3) + ' mil)'],
      ['Volume of foil (m ÷ ρ)', (vol >= 0.001 ? H.sig(vol, 3) : sci(vol, 3)) + ' cm³'],
      ['Area (L × W)', H.sig(area, 4) + ' cm²']
    ];
    if (v.d > 0) rows.push(['Thickness in atoms (t ÷ d)', H.int(t / v.d) + ' atoms (' + sci(t / v.d, 3) + ')', true]);
    var sub = 'Typical household foil is about 16 µm (0.016 mm) and heavy-duty about 24 µm.';
    if (typeof v.acc === 'number' && v.acc > 0) {
      var tmm = t * 10, pe = Math.abs(tmm - v.acc) / v.acc * 100;
      rows.push(['Percent error vs ' + H.num(v.acc, 4) + ' mm', H.pct(pe, 2)]);
      sub = 'Your result is ' + H.pct(pe, 1) + ' ' + (tmm > v.acc ? 'above' : 'below') + ' the accepted value.';
    }
    return { value: sci(t, 3) + ' cm', label: 'Foil thickness', expr: H.num(v.m, 4) + ' g ÷ (' + H.num(v.rho, 3) + ' g/cm³ × ' + H.sig(area, 4) + ' cm²)', rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate the thickness of aluminum foil, divide mass by density times area: t = m ÷ (ρ × L × W), with ρ = 2.70 g/cm³. A 20.0 × 10.0 cm sheet weighing 0.842 g has volume 0.842 ÷ 2.70 = 0.312 cm³, so t = 0.312 ÷ 200 = <strong>${r.value}</strong> (15.6 µm). Divided by an aluminum atom's 2.86 × 10⁻⁸ cm diameter, that is about 54,500 atoms.`,
  stepsTitle: 'How to do the aluminum foil thickness lab',
  steps: [
    'Cut a rectangle of foil and measure its length and width with a ruler, in centimeters, estimating one digit past the smallest mark (20.0 cm, not 20 cm).',
    'Weigh the foil on a balance. Folding it into a small square first makes it easier to weigh and does not change the mass.',
    'Find the volume from density: V = m ÷ ρ = 0.842 g ÷ 2.70 g/cm³ = 0.312 cm³.',
    'Treat the foil as a very flat box: V = L × W × t, so t = V ÷ (L × W). Keep everything in cm and g so the units cancel to cm. Mixing mm and cm is where most wrong answers come from.',
    'For thickness in atoms, divide t by the diameter of one atom (2.86 × 10⁻⁸ cm).',
    'Round to the number of significant figures in your least precise measurement, usually three.'
  ],
  formulaTitle: 'What is the formula for foil thickness?',
  formula: {
    expr: 'ρ = m ÷ V &nbsp;→&nbsp; V = m ÷ ρ<br>V = L × W × t &nbsp;→&nbsp; t = m ÷ (ρ × L × W)<br>atoms thick = t ÷ d',
    vars: [['t', 'thickness (cm)'], ['m', 'mass of the foil (g)'], ['ρ', 'density of aluminum, 2.70 g/cm³'], ['L, W', 'length and width (cm)'], ['d', 'diameter of an aluminum atom, 2.86 × 10⁻⁸ cm']],
    note: 'Both constants come from aluminum\'s crystal structure: its face-centered cubic cell is 4.05 × 10⁻⁸ cm on a side, which puts neighboring atom centers 2.86 × 10⁻⁸ cm apart and gives a density of 2.70 g/cm³.'
  },
  example: `<p><strong>Lab data:</strong> length 20.0 cm, width 10.0 cm, mass 0.842 g.</p>
<p>Area = 20.0 × 10.0 = 200. cm². Volume = 0.842 g ÷ 2.70 g/cm³ = 0.3119 cm³.</p>
<p>Thickness = 0.3119 cm³ ÷ 200. cm² = 0.001559 cm = <strong>1.56 × 10⁻³ cm</strong> (0.0156 mm, or 15.6 µm).</p>
<p>Atoms thick = 1.559 × 10⁻³ cm ÷ 2.86 × 10⁻⁸ cm = <strong>5.45 × 10⁴ atoms</strong>, about 54,500.</p>
<p>Compared with an accepted 0.0016 cm for standard foil, the percent error is |0.001559 − 0.0016| ÷ 0.0016 × 100 = <strong>2.5%</strong>.</p>`,
  table: {
    title: 'How thick is aluminum foil, in atoms?',
    intro: 'For a range of foil thicknesses: the mass a 10.0 cm × 10.0 cm square would have, and the number of atom diameters stacked through it, run through the calculator.',
    head: ['Thickness', 'In cm', 'Mass of 10 × 10 cm square', 'Atoms thick'],
    rows: ({ run, H }) => [[5, ''], [10, ''], [16, ' (standard household)'], [20, ''], [24, ' (heavy duty)'], [25.4, ' (1 mil)'], [50, ''], [100, ''], [200, ' (0.2 mm sheet)']].map(x => { const tcm = x[0] / 1e4; const m = 2.70 * 100 * tcm; const r = run({ m, L: 10, W: 10, u: 'cm', rho: 2.70, d: 2.86e-8, acc: NaN }); return [x[0] + ' µm' + x[1], r.value, H.num(m, 3) + ' g', r.rows.find(z => z[0].indexOf('atoms') > -1)[1].replace(/ \(.*/, '')]; }),
    note: 'Household foil figures are typical values; brands vary. A human hair, at roughly 50–100 µm, is several times thicker than kitchen foil.'
  },
  sections: [
    {
      h2: 'Why do you use density to find the thickness?',
      html: `<p>The foil is far too thin for a ruler or even most calipers, but it is easy to weigh. Density links the two: knowing aluminum packs 2.70 g into every cubic centimeter, the mass tells you the volume. A rectangular sheet is just a box with a tiny height, so dividing that volume by the area you measured leaves the one dimension you could not measure directly.</p>
<p>The same method finds the thickness of any uniform sheet of known density, from gold leaf (19.3 g/cm³) to copper flashing (8.96 g/cm³). For density problems in general, see the <a href="/density-calculator">density calculator</a>.</p>`
    },
    {
      h2: 'How many atoms thick is aluminum foil?',
      html: `<p>Standard foil, about 16 µm thick, is roughly 56,000 atom diameters thick (1.6 × 10⁻³ cm ÷ 2.86 × 10⁻⁸ cm). Heavy-duty foil, about 24 µm, is around 84,000.</p>
<p>The answer depends on how you count. Dividing by the atomic diameter treats atoms as balls stacked straight on top of each other. In the real crystal, close-packed layers nest into the hollows of the layer below, so layers sit only about 2.34 × 10⁻⁸ cm apart and the same foil holds about 22% more atomic layers (roughly 67,000 for the lab example). Either figure is fine for the lab, as long as you say which you used.</p>`
    },
    {
      h2: 'How many significant figures should the foil thickness have?',
      html: `<p>Match the least precise measurement. With a 0.842 g mass (3 significant figures), 20.0 cm and 10.0 cm lengths (3 each) and density 2.70 (3), report three: 1.56 × 10⁻³ cm. Scientific notation keeps the zeros in 0.00156 from looking significant.</p>
<p>To attach an uncertainty, add the percent uncertainties of the measurements. Mass ±0.001 g is 0.12%, length ±0.05 cm is 0.25% and width ±0.05 cm is 0.50%, for about 0.87% in all: t = (1.559 ± 0.014) × 10⁻³ cm. The width, the shortest side, contributes most, so measure it most carefully. The <a href="/uncertainty-calculator">uncertainty calculator</a> handles the propagation.</p>`
    },
    {
      h2: 'Why is my foil thickness different from the box?',
      html: `<ul>
<li><strong>Wrinkles and torn edges</strong> make the measured area too small or too large. Flatten the sheet and measure before folding.</li>
<li><strong>Balance precision.</strong> A 0.01 g balance on a 0.84 g sample already adds over 1% uncertainty; use a 0.001 g balance or a bigger sheet.</li>
<li><strong>Alloy, not pure metal.</strong> Kitchen foil is an aluminum alloy with a density very close to 2.70 g/cm³, so this effect is usually under 1%.</li>
<li><strong>Brand variation.</strong> Manufacturers list nominal gauges; actual foil can run a few percent thinner or thicker.</li>
</ul>`
    }
  ],
  faq: [
    { q: 'What is the thickness of aluminum foil in cm?', a: 'Standard household foil is about 0.0016 cm (1.6 × 10⁻³ cm, 16 µm) and heavy-duty foil about 0.0024 cm. Your lab value should land in that range.' },
    { q: 'What density should I use for aluminum foil?', a: 'Use 2.70 g/cm³, the density of aluminum at room temperature. Your teacher may give 2.7 or 2.699; the difference is under 0.1%.' },
    { q: 'What is the diameter of an aluminum atom?', a: 'About 2.86 × 10⁻⁸ cm (286 picometers, 2.86 Å), twice aluminum\'s metallic radius of 143 pm. It equals the distance between neighboring atom centers in the metal.' },
    { q: 'How do you convert foil thickness from cm to mm and µm?', a: 'Multiply by 10 for mm and by 10,000 for micrometers. 1.56 × 10⁻³ cm = 0.0156 mm = 15.6 µm.' },
    { q: 'Does folding the foil change the result?', a: 'Folding does not change the mass, so it does not matter for weighing, but measure length and width while the sheet is flat. Folding before measuring makes the area wrong.' },
    { q: 'How do I find the thickness if the foil is not a rectangle?', a: 'Use any shape whose area you can work out, such as a circle (πr²), or trace it on graph paper and count squares. The formula is still t = m ÷ (ρ × area).' },
    { q: 'How do I calculate percent error in the foil lab?', a: 'Percent error = |your value − accepted value| ÷ accepted value × 100. 0.001559 cm against an accepted 0.0016 cm gives 2.5%.' }
  ],
  related: ['density-calculator', 'uncertainty-calculator', 'scientific-notation-calculator', 'atom-calculator', 'moles-calculator'],
  sources: [
    { name: 'Royal Society of Chemistry Periodic Table: Aluminium (density, atomic data)', url: 'https://www.rsc.org/periodic-table/element/13/aluminium' },
    { name: 'OpenStax Chemistry 2e: 1.4 Measurements (density)', url: 'https://openstax.org/books/chemistry-2e/pages/1-4-measurements' },
    { name: 'OpenStax Chemistry 2e: 10.6 Lattice Structures in Crystalline Solids', url: 'https://openstax.org/books/chemistry-2e/pages/10-6-lattice-structures-in-crystalline-solids' },
    { name: 'IUPAC CIAAW: Standard atomic weight of aluminium', url: 'https://www.ciaaw.org/aluminium.htm' }
  ]
};
