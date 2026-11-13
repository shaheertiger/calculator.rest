export default {
  slug: 'engine-displacement-calculator',
  hub: 'electrical',
  name: 'Engine Displacement Calculator',
  title: 'Engine Displacement Calculator: LS3 Bore & Stroke = 376 cu in',
  h1: 'Engine Displacement Calculator: Cubic Inches, cc and Liters',
  meta: 'GM\'s LS3 (4.065 in. bore, 3.622 in. stroke, 8 cylinders) displaces 376 cu in, or 6,162 cc. Enter any bore, stroke and cylinder count in inches or mm.',
  keyword: 'how to calculate cubic inches of an engine',
  also: ['how to calculate displacement of engine', 'how do you calculate cubic inches of an engine', 'how to calculate engine cubic inches', 'how to calculate cubic inches in an engine', 'how to calculate horsepower from cc', 'engine cc calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'unit', label: 'Bore and stroke in', type: 'select', value: 'in', options: [['in', 'inches'], ['mm', 'millimeters']] },
    { id: 'cyl', label: 'Number of cylinders', type: 'number', value: 8 },
    { id: 'bore', label: 'Bore (cylinder diameter)', type: 'number', value: 4.065 },
    { id: 'stroke', label: 'Stroke (piston travel)', type: 'number', value: 3.622 }
  ],
  compute(v, H) {
    var CI = 16.387064;
    if (!(v.bore > 0) || !(v.stroke > 0)) return { error: 'Enter the bore and stroke.' };
    if (!(v.cyl >= 1)) return { error: 'Enter the number of cylinders.' };
    var n = Math.round(v.cyl);
    var mm = v.unit === 'mm';
    var bIn = mm ? v.bore / 25.4 : v.bore, sIn = mm ? v.stroke / 25.4 : v.stroke;
    var per = Math.PI / 4 * bIn * bIn * sIn;
    var ci = per * n, cc = ci * CI;
    var ratio = v.bore / v.stroke;
    return {
      value: H.fix(ci, 1) + ' cu in',
      label: 'Engine displacement',
      expr: '0.7854 × ' + H.num(bIn, 3) + '² × ' + H.num(sIn, 3) + ' × ' + n,
      rows: [
        ['Displacement in cc', H.int(cc) + ' cc', true],
        ['Liters', H.fix(cc / 1000, 1) + ' L (' + H.fix(cc / 1000, 3) + ')'],
        ['Per cylinder', H.num(per, 2) + ' cu in = ' + H.num(per * CI, 1) + ' cc'],
        ['Bore ÷ stroke', H.fix(ratio, 2) + (ratio > 1.02 ? ' (oversquare)' : ratio < 0.98 ? ' (undersquare)' : ' (square)')]
      ],
      _ci: ci, _cc: cc,
      sub: 'Marketing names round these figures: the same math puts a "5.7 L 350" at 349.8 cu in and a "5.0" Ford 302 at 301.6.'
    };
  },
  quick: ({ r }) => `Engine cubic inches = 0.7854 × bore² × stroke × number of cylinders. For a GM LS3 with a <strong>4.065 in.</strong> bore, <strong>3.622 in.</strong> stroke and 8 cylinders, that is 0.7854 × 16.524 × 3.622 × 8 = <strong>${r.value}</strong>. Multiply by 16.387 for cc: about 6,162 cc, sold as the 6.2-liter V8.`,
  stepsTitle: 'How to calculate the cubic inches of an engine',
  steps: [
    'Get the bore and stroke from the spec sheet or measure them: bore with a bore gauge or caliper across the cylinder, stroke as the piston\'s travel from top to bottom dead center (or the crank throw × 2).',
    'Square the bore and multiply by 0.7854 (π ÷ 4) to get the area of the piston top in square inches.',
    'Multiply by the stroke for one cylinder\'s swept volume, then by the number of cylinders.',
    'Convert if needed: cubic inches × 16.387 = cc, and cc ÷ 1,000 = liters. If you measured in millimeters, the result of bore² × stroke × 0.7854 is in mm³; divide by 1,000 for cc.'
  ],
  formulaTitle: 'What is the engine displacement formula?',
  formula: {
    expr: 'Displacement = π/4 × bore² × stroke × cylinders<br>cc = cu in × 16.387 · cu in = cc × 0.06102 · L = cc ÷ 1000',
    vars: [['bore', 'cylinder diameter'], ['stroke', 'distance the piston travels in one direction'], ['π/4', '0.7854, turns diameter² into circle area']],
    note: 'Displacement is swept volume only. Combustion chamber and head gasket volumes are not included; they matter for the <a href="/compression-ratio-calculator">compression ratio</a>.'
  },
  example: `<p>A Chevy 350 is bored 0.030 in. over and fitted with a 3.75 in. stroker crank.</p>
<p>New bore = 4.000 + 0.030 = <strong>4.030 in.</strong> Displacement = 0.7854 × 4.030² × 3.75 × 8 = 0.7854 × 16.2409 × 30 = <strong>382.7 cu in</strong>, the classic "383."</p>
<p>In metric: 382.7 × 16.387 = <strong>6,271 cc</strong>, or 6.3 L. The overbore alone (with the stock 3.48 in. stroke) would make 355.1 cu in.</p>`,
  table: {
    title: 'How many cubic inches are famous engines?',
    intro: 'Published bore and stroke for well-known engines, run through the calculator. Note how the computed figure differs from the name.',
    head: ['Engine', 'Bore × stroke', 'Cyl.', 'Cubic inches', 'cc'],
    rows: ({ run, H }) => [
      ['Chevy small-block 350', 4.0, 3.48, 8, 'in'], ['Ford 302 (5.0)', 4.0, 3.0, 8, 'in'], ['Ford 351 Windsor', 4.0, 3.5, 8, 'in'],
      ['Chevy 383 stroker', 4.03, 3.75, 8, 'in'], ['GM LS3 6.2', 4.065, 3.622, 8, 'in'], ['Chrysler 426 Hemi', 4.25, 3.75, 8, 'in'],
      ['Chevy big-block 454', 4.25, 4.0, 8, 'in'], ['Ford 5.0 Coyote (Gen 3)', 93, 92.7, 8, 'mm'], ['Toyota 2JZ', 86, 86, 6, 'mm'],
      ['Honda K20', 86, 86, 4, 'mm'], ['Harley-Davidson Milwaukee-Eight 107', 100, 111.1, 2, 'mm']
    ].map(([n, b, s, c, u]) => { const r = run({ bore: b, stroke: s, cyl: c, unit: u }); return [n, (u === 'mm' ? b + ' × ' + s + ' mm' : b.toFixed(3) + ' × ' + s.toFixed(3) + ' in'), c, H.fix(r._ci, 1), H.int(r._cc)]; }),
    note: 'Bore and stroke from manufacturer specifications. Production tolerances and rounding mean published displacements can differ by a few cc.'
  },
  sections: [
    {
      h2: 'How do you convert cc to cubic inches and liters?',
      html: `<p>One cubic inch is exactly 16.387064 cc, so divide cc by 16.387 to get cubic inches, or multiply by 0.06102. One liter is 1,000 cc or 61.02 cubic inches. A 5.7 L engine is 5,700 × 0.06102 = <strong>347.8 cu in</strong>, which Chevrolet rounded to 350; the actual small-block measures 349.8 cu in (5,733 cc). Motorcycle and import engines are usually quoted in cc, American V8s in cubic inches, and modern cars of all origins in liters.</p>`
    },
    {
      h2: 'How do you calculate horsepower from cc?',
      html: `<p>There is no formula that turns displacement into horsepower; cam timing, airflow, rpm, compression and boost matter as much as size. Specific output (horsepower per liter) is the useful benchmark. Some real figures:</p>
<ul><li>GM LS3 6.2 L, 430 hp: about <strong>69 hp/L</strong> (large, low-revving pushrod V8).</li>
<li>Honda K20 2.0 L in naturally aspirated performance trim, about 200 hp: about <strong>100 hp/L</strong>.</li>
<li>Honda Civic Type R (FK8) 2.0 L turbo, 306 hp: about <strong>153 hp/L</strong>.</li></ul>
<p>To estimate, pick a figure from a similar engine and multiply by liters. Once you know torque at a given rpm, the <a href="/torque-calculator">torque and horsepower calculator</a> gives the exact power.</p>`
    },
    {
      h2: 'Is bigger bore or longer stroke better?',
      html: `<p>For the same displacement, a large bore and short stroke (oversquare) leaves room for bigger valves and lets the engine rev higher, because piston speed is lower. A long stroke (undersquare) gives more leverage on the crank and usually stronger low-rpm torque. The LS3 is oversquare at 1.12, the 454 big-block at 1.06, and the K20 and 2JZ are exactly square. Mean piston speed (2 × stroke × rpm) is the limit builders watch: a 3.75 in. stroke at 6,500 rpm averages about 4,060 ft/min.</p>`
    }
  ],
  faq: [
    { q: 'How many cubic inches is a 5.7 liter engine?', a: 'A 5.7 L engine is about 347.8 cubic inches by straight conversion. The Chevy 350 that carries the 5.7 L badge actually measures 349.8 cubic inches (4.000 in. bore × 3.48 in. stroke × 8).' },
    { q: 'How many cc is a 350 engine?', a: 'About 5,733 cc. Multiply 349.85 cubic inches by 16.387.' },
    { q: 'How much does boring .030 over add?', a: 'On a 350, going from a 4.000 to a 4.030 in. bore adds about 5.3 cubic inches (to 355.1). On a 454, a 0.030 in. overbore adds about 6.4 cubic inches.' },
    { q: 'Does displacement include the combustion chamber?', a: 'No. Displacement only counts the volume the pistons sweep. Chamber, gasket and deck volumes are part of the clearance volume used for compression ratio.' },
    { q: 'How is a rotary engine\'s displacement calculated?', a: 'Mazda quotes the volume of one working chamber per rotor times the number of rotors. The 13B has two 654 cc chambers, so it is sold as a 1.3 L (1,308 cc) engine.' },
    { q: 'Is the formula the same for 2-stroke engines?', a: 'Yes. Displacement is bore area × stroke × cylinders whether the engine is 2-stroke or 4-stroke; only the power each displacement produces differs.' }
  ],
  related: ['compression-ratio-calculator', 'torque-calculator', 'cubic-inches-calculator', 'cylinder-volume-calculator', 'gear-ratio-calculator'],
  sources: [
    { name: 'NIST Special Publication 811: conversion factors (inch³ to cm³)', url: 'https://www.nist.gov/pml/special-publication-811' },
    { name: 'Engine displacement: definition and formula', url: 'https://en.wikipedia.org/wiki/Engine_displacement' },
    { name: 'Compression ratio and clearance volume', url: 'https://en.wikipedia.org/wiki/Compression_ratio' }
  ]
};
