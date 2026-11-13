export default {
  slug: 'roofing-calculator',
  hub: 'construction',
  name: 'Roofing Calculator',
  title: 'Roofing Calculator: 6/12 Roof on a 40×30 House Is 1,503 sq ft',
  h1: 'Roofing Calculator: Roof Area, Squares and Shingle Bundles',
  meta: 'A 40 × 30 ft house with 1-ft overhangs and a 6/12 pitch has 1,503 sq ft of roof: 16.5 squares or 50 bundles with 10% waste. Size any gable or hip roof.',
  keyword: 'how do i calculate square footage of a roof',
  also: ['how to calculate roof shingles', 'how to calculate sq footage of roof', 'how to calculate square feet of a roof', 'how do you calculate roof square footage', 'how to calculate roofing shingles', 'how to calculate roof material', 'how to calculate roof waste', 'how many sheets of metal roofing do i need calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'len', label: 'House length (footprint)', type: 'number', value: 40, suffix: 'ft' },
    { id: 'wid', label: 'House width (footprint)', type: 'number', value: 30, suffix: 'ft' },
    { id: 'overhang', label: 'Eave and rake overhang', type: 'number', value: 12, suffix: 'in', help: 'Set to 0 if you measured at the drip line.' },
    { id: 'pitch', label: 'Roof pitch', type: 'select', value: '6', options: [['2', '2/12'], ['3', '3/12'], ['4', '4/12'], ['5', '5/12'], ['6', '6/12'], ['7', '7/12'], ['8', '8/12'], ['9', '9/12'], ['10', '10/12'], ['11', '11/12'], ['12', '12/12'], ['14', '14/12'], ['16', '16/12']] },
    { id: 'style', label: 'Roof style', type: 'select', value: 'gable', options: [['gable', 'Gable (two slopes)'], ['hip', 'Hip (four slopes)']] },
    { id: 'waste', label: 'Waste allowance', type: 'number', value: 10, suffix: '%', help: '10% for a simple gable, 15% or more for hips, valleys and dormers.' }
  ],
  compute(v, H) {
    if (!(v.len > 0) || !(v.wid > 0)) return { error: 'Enter the length and width of the house footprint.' };
    var p = Number(v.pitch);
    var oh = v.overhang >= 0 ? v.overhang / 12 : 0;
    var waste = v.waste >= 0 ? v.waste : 0;
    var L = Math.max(v.len, v.wid) + 2 * oh, W = Math.min(v.len, v.wid) + 2 * oh;
    var plan = L * W;
    var f = Math.sqrt(1 + p * p / 144);
    var area = plan * f;
    var buy = area * (1 + waste / 100);
    var squares = buy / 100;
    var bundles = Math.ceil(squares * 3 - 1e-9);
    var run = W / 2, rise = run * p / 12;
    var ridge, hips = 0, eaves, rakes;
    if (v.style === 'hip') {
      ridge = L - W;
      hips = 4 * Math.sqrt(2 * run * run + rise * rise);
      eaves = 2 * (L + W); rakes = 0;
    } else {
      ridge = L; eaves = 2 * L; rakes = 4 * run * f;
    }
    var rows = [
      ['Roof area plus ' + H.num(waste, 1) + '% waste', H.int(buy) + ' sq ft'],
      ['Roofing squares to order', H.fix(squares, 2), true],
      ['Shingle bundles (3 per square)', String(bundles), true],
      ['Synthetic underlayment (10-square rolls)', String(Math.ceil(buy / 1000 - 1e-9))],
      ['Drip edge (10-ft pieces)', String(Math.ceil((eaves + rakes) / 10 - 1e-9)) + ' (' + H.int(eaves + rakes) + ' lin ft)'],
      ['Starter strip along eaves', H.int(eaves) + ' lin ft'],
      ['Ridge' + (hips ? ' + hip' : '') + ' cap', H.int(ridge + hips) + ' lin ft'],
      ['Pitch multiplier', H.fix(f, 3)],
      ['Flat (plan) area with overhangs', H.int(plan) + ' sq ft']
    ];
    if (v.style !== 'hip') rows.push(['Metal panels, 36-in coverage', String(2 * Math.ceil(L / 3 - 1e-9)) + ' panels × ' + H.fix(run * f, 1) + ' ft']);
    return {
      value: H.int(area) + ' sq ft',
      label: 'Roof surface area (before waste)',
      expr: H.num(L, 2) + ' × ' + H.num(W, 2) + ' ft × ' + H.fix(f, 3) + ' (' + p + '/12)',
      rows: rows,
      sub: 'Order ' + H.fix(squares, 1) + ' squares: ' + bundles + ' bundles of standard 3-bundle shingles.' + (p < 4 ? ' Below 4/12, asphalt shingles need double underlayment, and the IRC bans them under 2/12.' : '')
    };
  },
  quick: ({ r }) => `To calculate the square footage of a roof, multiply the footprint (including overhangs) by the pitch multiplier. A 40 × 30 ft house with 1-ft overhangs covers 42 × 32 = 1,344 sq ft; at a 6/12 pitch (× 1.118) the roof is <strong>${r.value}</strong>. Add 10% waste and you need <strong>16.5 squares</strong>, or <strong>50 bundles</strong> of shingles.`,
  stepsTitle: 'How to calculate roof square footage and shingles',
  steps: [
    'Measure the house footprint from the outside walls, then add the overhang on each side. Forgetting the eaves and rakes is the most common mistake: a 12-in overhang adds 12% to the plan area of a 40 × 30 ft house.',
    'Find the pitch: the inches of rise in 12 inches of run. Measure it with a level and tape in the attic or on a rake board, or use the <a href="/roof-pitch-calculator">roof pitch calculator</a>.',
    'Multiply the flat area by the pitch multiplier, √(1 + (pitch ÷ 12)²). For a 6/12 roof that is 1.118.',
    'Add waste: about 10% for a simple gable and 15% or more for hip roofs, valleys and dormers, where shingles are cut at angles.',
    'Divide by 100 to get squares, then multiply by 3 for bundles (most 3-tab and architectural shingles). Round up to a whole bundle.'
  ],
  formulaTitle: 'What is the formula for roof square footage?',
  formula: {
    expr: 'Roof area = (L + 2·OH) × (W + 2·OH) × √(1 + (P ÷ 12)²)<br>Squares = Roof area × (1 + waste) ÷ 100<br>Bundles = Squares × 3, rounded up',
    vars: [['L, W', 'footprint length and width, ft'], ['OH', 'overhang on each side, ft'], ['P', 'pitch: inches of rise per 12 in of run'], ['waste', 'allowance for cuts and starter, as a decimal']],
    note: 'The multiplier works for any roof whose planes share one pitch, gable or hip, because every plane tilts by the same ratio. Hip and gable roofs over the same footprint have the same area; the hip just needs more waste and ridge cap.'
  },
  example: `<p>A ranch house measures 40 × 30 ft with 12-in overhangs and a 6/12 gable roof.</p>
<p>Plan area: (40 + 2) × (30 + 2) = 42 × 32 = <strong>1,344 sq ft</strong>.</p>
<p>Pitch multiplier: √(1 + 0.5²) = √1.25 = 1.118. Roof area: 1,344 × 1.118 = <strong>1,503 sq ft</strong>.</p>
<p>With 10% waste: 1,653 sq ft ÷ 100 = <strong>16.53 squares</strong> × 3 = 49.6, so buy <strong>50 bundles</strong>. You also need 2 rolls of 10-square synthetic underlayment, 156 lin ft of drip edge (16 ten-foot pieces) and 42 lin ft of ridge cap.</p>`,
  table: {
    title: 'How much roof does each pitch add to a 40 × 30 house?',
    intro: 'The same 42 × 32 ft plan (40 × 30 ft walls plus 1-ft overhangs) at common pitches, with 10% waste, worked out by the calculator.',
    head: ['Pitch', 'Multiplier', 'Roof area', 'Squares', 'Bundles'],
    rows: ({ run }) => ['3', '4', '5', '6', '7', '8', '9', '10', '12'].map(p => { const r = run({ pitch: p, style: 'gable', waste: 10 }); return [p + '/12', r.rows[7][1], r.value, r.rows[1][1], r.rows[2][1]]; }),
    note: 'Bundles assume 3 per square. Heavy designer and impact-rated shingles can run 4 or 5 bundles per square; the wrapper states the coverage.'
  },
  sections: [
    {
      h2: 'How many bundles of shingles are in a square?',
      html: `<p>Most 3-tab and architectural (laminated) asphalt shingles come <strong>3 bundles to a square</strong>, and a square covers 100 sq ft of roof. Some premium, designer or thick impact-resistant lines are packed 4 or 5 bundles per square because each bundle would be too heavy to carry. Always check the coverage printed on the wrapper.</p>
<p>Starter strip and ridge cap are usually separate products. If you plan to cut starters from field shingles, add roughly one bundle per 100 lin ft of eaves and rakes; for hip-and-ridge shingles, divide the ridge and hip length by the linear coverage on the bundle.</p>`
    },
    {
      h2: 'How much waste should you add for a roof?',
      html: `<p>Roofers order extra because shingles are cut at every rake, hip, valley and penetration, and the starter course uses material too. Typical allowances:</p>
<ul><li><strong>Simple gable, few penetrations:</strong> 10%.</li><li><strong>Hip roof:</strong> 12–15%, since every hip is a diagonal cut on both sides.</li><li><strong>Cut-up roof with valleys, dormers and skylights:</strong> 15–20%.</li></ul>
<p>Leftover full bundles are worth keeping for future repairs, since colors change between production runs.</p>`
    },
    {
      h2: 'Can you measure a roof from the ground?',
      html: `<p>Yes. Measure the outside walls, add the overhangs, and multiply by the pitch factor; that is exactly what this calculator does, and it is accurate within a few percent for roofs with one pitch. You can read the pitch from the gable end with a phone level app, or measure the rafter slope in the attic: hold a level horizontally against a rafter, mark 12 in along it, and measure straight up to the rafter.</p>
<p>For roofs with several pitches, split the roof into sections, run each through the calculator and add them. Satellite measurement reports are useful for complex roofs but still need a waste factor.</p>`
    },
    {
      h2: 'What does the building code require for a shingle roof?',
      html: `<p>The International Residential Code (IRC Section R905.2) sets the main rules most U.S. jurisdictions adopt:</p>
<ul><li>Asphalt shingles are only allowed on slopes of <strong>2/12 or steeper</strong>; from 2/12 up to 4/12 they need a double layer of underlayment.</li><li>Drip edge is required at eaves and rake edges.</li><li>Each shingle needs at least the fasteners the manufacturer specifies, and never fewer than four per strip shingle.</li><li>A new layer can't go over a roof that already has two or more layers (R908); tear-off adds disposal cost but not shingles.</li></ul>
<p>Local codes may require ice-barrier underlayment at the eaves in cold climates. Check with your building department before you order.</p>`
    }
  ],
  faq: [
    { q: 'How many squares is a 2,000 sq ft house roof?', a: 'A 2,000 sq ft single-story house with 1-ft overhangs and a 6/12 roof has roughly 2,400–2,500 sq ft of roof, or about 27 squares (81 bundles) with 10% waste. The exact figure depends on the footprint shape, so enter the length and width above.' },
    { q: 'Does the roof area include the overhang?', a: 'It should. Shingles cover the eaves and rakes, so add the overhang on every side before multiplying by the pitch factor. A 12-inch overhang on a 40 × 30 house adds 144 sq ft of plan area.' },
    { q: 'Is a hip roof bigger than a gable roof?', a: 'Not if both have the same pitch over the same footprint: the surface area is identical. A hip roof needs more waste (12–15%), more ridge cap and no gable siding, so the material bill is a little higher.' },
    { q: 'How many bundles of shingles do I need for 1,000 square feet?', a: 'For 1,000 sq ft of roof surface you need 10 squares, or 30 bundles of standard shingles, plus waste: 33 bundles at 10% and 35 at 15%.' },
    { q: 'What is the pitch multiplier for a 4/12 roof?', a: 'The multiplier for a 4/12 pitch is 1.054, so the roof surface is 5.4% larger than the flat area. A 6/12 roof is 1.118, 8/12 is 1.202 and 12/12 is 1.414.' },
    { q: 'How many sheets of metal roofing do I need?', a: 'Divide the eave length by the panel\'s coverage width (36 in for most exposed-fastener panels) and round up for each slope. A 42-ft gable eave needs 14 panels per side, 28 in total, each as long as the rafter slope plus overhang.' },
    { q: 'How do I calculate roofing for a shed or one-slope roof?', a: 'Multiply the length by the sloped width: run × pitch multiplier, plus overhangs. A 10 × 12 shed roof at 4/12 with 6-in overhangs is 13 × 11 × 1.054 = about 151 sq ft, or 1.5 squares (5 bundles with waste).' }
  ],
  related: ['roof-pitch-calculator', 'square-footage-calculator', 'drywall-calculator', 'linear-feet-calculator', 'framing-calculator'],
  sources: [
    { name: 'ICC: 2021 International Residential Code, Chapter 9 Roof Assemblies (R905 shingles, R908 reroofing)', url: 'https://codes.iccsafe.org/content/IRC2021P2' },
    { name: 'National Roofing Contractors Association (NRCA)', url: 'https://www.nrca.net/' },
    { name: 'Owens Corning: Roofing products and coverage data', url: 'https://www.owenscorning.com/en-us/roofing' }
  ]
};
