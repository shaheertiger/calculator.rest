export default {
  slug: 'concrete-calculator',
  hub: 'construction',
  name: 'Concrete Calculator',
  title: 'Concrete Calculator: 10×10 Slab at 4" = 1.36 Yd³ or 62 Bags',
  h1: 'Concrete Calculator for Slabs, Footings and Round Columns',
  meta: 'Cubic yards and bag counts for a slab, footing or column. A 10 × 10 ft slab 4" thick is 1.23 yd³; with 10% extra, 1.36 yd³, or 62 bags of 80 lb concrete mix.',
  keyword: 'how to calculate concrete slab',
  also: ['how calculate concrete for a slab', 'how to calculate how many yards of concrete i need', 'how do you calculate concrete slab', 'how to calculate cubic yard of concrete', 'how to calculate concrete for footings', 'how to calculate foundation concrete', 'how to calculate square yards of concrete', 'how many bags of concrete do i need'],
  updated: '2026-11-13',
  inputs: [
    { id: 'shape', label: 'What are you pouring?', type: 'select', value: 'slab', wide: true, options: [['slab', 'Slab, patio, driveway or sidewalk'], ['footing', 'Footing or wall (width in inches)'], ['column', 'Round column, pier or post hole']] },
    { id: 'length', label: 'Length', type: 'number', value: 10, suffix: 'ft', showIf: { shape: ['slab', 'footing'] } },
    { id: 'width', label: 'Width', type: 'number', value: 10, suffix: 'ft', showIf: { shape: ['slab'] } },
    { id: 'thick', label: 'Thickness', type: 'number', value: 4, suffix: 'in', showIf: { shape: ['slab'] } },
    { id: 'fwidth', label: 'Footing width', type: 'number', value: 16, suffix: 'in', showIf: { shape: ['footing'] } },
    { id: 'fdepth', label: 'Footing depth', type: 'number', value: 8, suffix: 'in', showIf: { shape: ['footing'] } },
    { id: 'diam', label: 'Diameter', type: 'number', value: 12, suffix: 'in', showIf: { shape: ['column'] } },
    { id: 'height', label: 'Height or hole depth', type: 'number', value: 4, suffix: 'ft', showIf: { shape: ['column'] } },
    { id: 'count', label: 'How many identical pours', type: 'number', value: 1 },
    { id: 'waste', label: 'Extra for spillage and uneven base', type: 'number', value: 10, suffix: '%' }
  ],
  data: { bag: { b80: 0.6, b60: 0.45, b40: 0.3 } },
  compute(v, H, D) {
    var cf, expr;
    if (v.shape === 'footing') {
      if (!(v.length > 0) || !(v.fwidth > 0) || !(v.fdepth > 0)) return { error: 'Enter footing length (ft), width and depth (in).' };
      cf = v.length * v.fwidth / 12 * v.fdepth / 12;
      expr = H.num(v.length, 2) + ' ft × ' + H.num(v.fwidth, 2) + '″ × ' + H.num(v.fdepth, 2) + '″';
    } else if (v.shape === 'column') {
      if (!(v.diam > 0) || !(v.height > 0)) return { error: 'Enter the diameter (in) and height (ft).' };
      var r = v.diam / 24;
      cf = Math.PI * r * r * v.height;
      expr = 'π × ' + H.num(r, 3) + '² ft × ' + H.num(v.height, 2) + ' ft';
    } else {
      if (!(v.length > 0) || !(v.width > 0) || !(v.thick > 0)) return { error: 'Enter length, width (ft) and thickness (in).' };
      cf = v.length * v.width * v.thick / 12;
      expr = H.num(v.length, 2) + ' × ' + H.num(v.width, 2) + ' ft × ' + H.num(v.thick, 2) + '″';
    }
    var n = v.count >= 1 ? Math.floor(v.count) : 1;
    if (n > 1) expr += ' × ' + n;
    cf *= n;
    var w = v.waste > 0 ? v.waste : 0;
    var cfx = cf * (1 + w / 100), yd = cfx / 27;
    return {
      value: H.num(yd, 2) + ' yd³',
      label: 'Concrete needed (with ' + H.num(w, 1) + '% extra)',
      expr: expr,
      rows: [
        ['Exact volume', H.num(cf / 27, 3) + ' yd³ (' + H.num(cf, 2) + ' cu ft)'],
        ['80 lb bags (0.60 cu ft each)', H.int(Math.ceil(cfx / D.bag.b80 - 1e-9)), true],
        ['60 lb bags (0.45 cu ft each)', H.int(Math.ceil(cfx / D.bag.b60 - 1e-9))],
        ['40 lb bags (0.30 cu ft each)', H.int(Math.ceil(cfx / D.bag.b40 - 1e-9))],
        ['Ready-mix order (next ¼ yd)', H.num(Math.ceil(yd * 4 - 1e-9) / 4, 2) + ' yd³', true],
        ['Approx. weight in place', H.int(cfx * 150) + ' lb']
      ],
      sub: 'Bag yields are Quikrete\'s published figures; other brands are similar but check the bag.'
    };
  },
  quick: ({ r }) => `To calculate concrete for a slab, multiply length × width × thickness in feet and divide by 27. A 10 × 10 ft slab 4 inches thick is 10 × 10 × 0.333 = 33.3 cu ft = 1.23 cubic yards. With 10% extra you need <strong>${r.value}</strong>: 62 bags of 80 lb mix (0.60 cu ft each) or 82 bags of 60 lb. For ready-mix, order 1.5 yards.`,
  stepsTitle: 'How to calculate concrete for a slab',
  steps: [
    'Measure the length and width of the forms in feet.',
    'Convert the thickness from inches to feet by dividing by 12: 4 in = 0.333 ft, 5 in = 0.417 ft, 6 in = 0.5 ft. Leaving thickness in inches is the classic error that orders 12 times too much.',
    'Multiply length × width × thickness for cubic feet; divide by 27 for cubic yards.',
    'Add 5–10% for spillage, form bulge and an uneven subgrade, more if the base isn\'t level.',
    'For bags, divide cubic feet by the bag yield (0.60 cu ft for 80 lb, 0.45 for 60 lb) and round up. For ready-mix, round up to the supplier\'s increment, often ¼ or ½ yard.'
  ],
  formulaTitle: 'What is the concrete volume formula?',
  formula: {
    expr: 'Slab: yd³ = L (ft) × W (ft) × T (in) ÷ 324<br>Footing: yd³ = L (ft) × W (in) × D (in) ÷ 3,888<br>Round column: yd³ = 3.1416 × (d ÷ 24)² × H (ft) ÷ 27<br>Bags = cu ft ÷ bag yield, rounded up',
    vars: [['324', '12 × 27: thickness in inches, result in cubic yards'], ['3,888', '144 × 27: two dimensions in inches'], ['d ÷ 24', 'diameter in inches → radius in feet'], ['bag yield', '0.60 cu ft (80 lb), 0.45 (60 lb), 0.30 (40 lb)']]
  },
  example: `<p><strong>Footing:</strong> 40 ft of continuous footing, 16 in wide and 8 in deep. 40 × 16 × 8 ÷ 3,888 = <strong>1.32 yd³</strong> (35.6 cu ft). With 10% extra, 1.45 yd³, so order 1.5 yards of ready-mix.</p>
<p><strong>Pier holes:</strong> six holes 12 in across and 4 ft deep. Each is 3.1416 × 0.5² × 4 = 3.14 cu ft, so six are 18.85 cu ft (0.70 yd³). With 10% extra that is 20.7 cu ft: 35 bags of 80 lb mix.</p>`,
  table: {
    title: 'How much concrete do common slab sizes need?',
    intro: 'Cubic yards and 80 lb bags including 10% extra, from the calculator.',
    head: ['Slab size', '4 in thick', '80 lb bags (4 in)', '6 in thick', '80 lb bags (6 in)'],
    rows: ({ run }) => [[4, 4], [6, 6], [8, 8], [10, 10], [10, 12], [12, 12], [12, 16], [16, 16], [20, 20], [24, 24]].map(([a, b]) => {
      const r4 = run({ shape: 'slab', length: a, width: b, thick: 4, count: 1, waste: 10 });
      const r6 = run({ shape: 'slab', length: a, width: b, thick: 6, count: 1, waste: 10 });
      return [a + ' × ' + b + ' ft', r4.value, r4.rows[1][1], r6.value, r6.rows[1][1]];
    }),
    note: 'Above roughly 1 yd³ (45 bags of 80 lb), ready-mix delivery is usually easier than mixing bags by hand.'
  },
  sections: [
    {
      h2: 'How thick should a concrete slab be?',
      html: `<p>The International Residential Code (R506.1) sets a minimum of 3½ inches for concrete floor slabs on ground, and 4 inches is the everyday standard for patios, sidewalks, shed floors and garage floors. Driveways are commonly poured 4 inches for cars and 5–6 inches where heavier trucks, RVs or boats will park. Hot tub pads and other concentrated loads often call for 6 inches; follow the equipment maker's requirement.</p>
<p>Thickness has the biggest effect on volume after area. Going from 4 to 5 inches adds 25% more concrete; to 6 inches adds 50%. Check the depth of your forms in several spots: a base that dips half an inch across a big slab can use up the 10% allowance on its own.</p>`
    },
    {
      h2: 'How do you calculate concrete for footings, piers and post holes?',
      html: `<p>Footings are long, narrow boxes, so keep their width and depth in inches and use the footing mode. Under the IRC (R403.1.1), spread footings for houses are generally at least 12 in wide and 6 in thick, with larger sizes required by the code tables for heavier loads, weaker soils and more stories.</p>
<p>For piers and post holes, use the round mode with the hole diameter. If a post stays in the hole, subtract its volume: a 4×4 post (3½ in square) in a 10-in hole 3 ft deep leaves 1.64 − 0.26 = 1.38 cu ft to fill, about 2.3 bags of 80 lb mix, so buy 3. Bell-shaped footing forms and tube forms list their volume; use that instead when you have it.</p>`
    },
    {
      h2: 'How many bags of concrete make a yard?',
      html: `<p>Quikrete's data sheet for its Concrete Mix lists an 80 lb bag yielding about 0.60 cu ft, a 60 lb bag 0.45 cu ft and a 40 lb bag 0.30 cu ft. With 27 cu ft in a yard, that means:</p>
<ul><li><strong>45</strong> bags of 80 lb per cubic yard</li><li><strong>60</strong> bags of 60 lb per cubic yard</li><li><strong>90</strong> bags of 40 lb per cubic yard</li></ul>
<p>A yard of bagged concrete therefore weighs about 3,600 lb before water, which is a lot to lift and mix. Most homeowners switch to ready-mix somewhere around 1 yard, though many plants charge a short-load fee for small orders, so compare both prices.</p>`
    },
    {
      h2: 'Should you order extra concrete?',
      html: `<p>Yes. Running short mid-pour leaves a cold joint and a second delivery charge, while a little left over can go into a few stepping stones or a post hole. Plan 5% extra on a well-formed slab with a flat, compacted base and 10% on most DIY jobs. For slabs over a gravel base, compact and screed the base first; the <a href="/gravel-calculator">gravel calculator</a> sizes that layer. For block walls, use the <a href="/concrete-block-calculator">concrete block calculator</a> instead.</p>`
    }
  ],
  faq: [
    { q: 'How many yards of concrete do I need for a 10x10 slab?', a: 'A 10 × 10 ft slab 4 inches thick needs 1.23 cubic yards exactly, or 1.36 with 10% extra. At 6 inches it is 1.85 yards (2.04 with extra).' },
    { q: 'How many 80 lb bags of concrete do I need for a 10x10 slab?', a: 'About 62 bags of 80 lb mix for a 4-inch slab with 10% extra (56 bags with no extra), based on 0.60 cu ft per bag.' },
    { q: 'How many square feet does a yard of concrete cover?', a: 'One cubic yard covers 81 sq ft at 4 inches thick, 65 sq ft at 5 inches and 54 sq ft at 6 inches.' },
    { q: 'How do I calculate square yards of concrete?', a: 'Concrete is ordered in cubic yards, not square yards. Multiply the area in square feet by the thickness in inches and divide by 324 to get cubic yards.' },
    { q: 'How much does a cubic yard of concrete weigh?', a: 'Normal-weight concrete weighs about 4,000 lb per cubic yard (roughly 145–150 lb per cubic foot).' },
    { q: 'How many bags of concrete for a fence post?', a: 'For a 4×4 post in a 10-inch hole 3 ft deep, about 2.3 bags of 80 lb mix, so 3 bags. Use the column mode and subtract the post.' },
    { q: 'What is the minimum thickness for a concrete slab?', a: 'The IRC minimum for a slab-on-ground floor is 3½ inches; 4 inches is standard for patios and walks, and 5–6 inches for heavy-use driveways.' }
  ],
  related: ['concrete-block-calculator', 'gravel-calculator', 'cubic-yards-calculator', 'cubic-yards-to-tons-calculator', 'stair-calculator'],
  sources: [
    { name: 'Quikrete: Concrete Mix (No. 1101) data sheet, bag yields', url: 'https://www.quikrete.com/PDFs/DATA_SHEET-Concrete%20Mix%201101.pdf' },
    { name: 'Quikrete: Concrete Mix product page', url: 'https://www.quikrete.com/productlines/ConcreteMix.asp' },
    { name: 'International Code Council: International Residential Code (R403.1 footings, R506 slabs)', url: 'https://www.iccsafe.org/' }
  ]
};
