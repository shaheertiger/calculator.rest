export default {
  slug: 'asphalt-calculator',
  hub: 'construction',
  name: 'Asphalt Calculator',
  title: 'Asphalt Calculator: 60 × 12 ft Driveway at 3" = 13.7 Tons',
  h1: 'Asphalt Tonnage Calculator for Driveways, Lots and Patches',
  meta: 'Hot-mix asphalt tonnage from area, compacted thickness and density. A 60 × 12 ft driveway 3" thick at 145 lb/cu ft is 13.05 tons; order 13.7 tons with 5% extra.',
  keyword: 'how to calculate asphalt tonnage',
  also: ['how do you calculate asphalt tonnage', 'how to calculate tons of asphalt', 'how to calculate asphalt', 'how to calculate tonnage for asphalt', 'how do you calculate asphalt', 'how to calculate for asphalt', 'asphalt calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'length', label: 'Length', type: 'number', value: 60, suffix: 'ft' },
    { id: 'width', label: 'Width', type: 'number', value: 12, suffix: 'ft' },
    { id: 'thick', label: 'Compacted thickness', type: 'number', value: 3, suffix: 'in' },
    { id: 'density', label: 'Compacted density', type: 'number', value: 145, suffix: 'lb/cu ft', help: '145 lb/cu ft is the usual figure for dense-graded hot mix; ask your plant for its mix.' },
    { id: 'waste', label: 'Extra for edges and uneven base', type: 'number', value: 5, suffix: '%' },
    { id: 'price', label: 'Price per ton (optional)', type: 'number', value: '', prefix: '$' }
  ],
  compute(v, H) {
    if (!(v.length > 0) || !(v.width > 0)) return { error: 'Enter the length and width in feet.' };
    if (!(v.thick > 0)) return { error: 'Enter the compacted thickness in inches.' };
    if (!(v.density > 0)) return { error: 'Enter a density in lb per cubic foot.' };
    var sf = v.length * v.width;
    var cf = sf * v.thick / 12;
    var lb = cf * v.density, t = lb / 2000;
    var w = v.waste > 0 ? v.waste : 0;
    var tx = t * (1 + w / 100);
    var rows = [
      ['Tons before extra', H.num(t, 2) + ' tons'],
      ['Weight with extra', H.int(lb * (1 + w / 100)) + ' lb'],
      ['Area', H.num(sf, 1) + ' sq ft = ' + H.num(sf / 9, 1) + ' sq yd'],
      ['Volume', H.num(cf, 1) + ' cu ft = ' + H.num(cf / 27, 2) + ' yd³'],
      ['Spread rate', H.num(v.density * 9 / 12, 2) + ' lb per sq yd per inch'],
      ['Metric tonnes', H.num(tx * 0.90718474, 2) + ' t']
    ];
    if (v.price > 0) rows.push(['Material cost', H.money(tx * v.price), true]);
    return {
      value: H.num(tx, 2) + ' tons',
      label: 'Asphalt to order (with ' + H.num(w, 1) + '% extra)',
      expr: H.num(sf, 1) + ' sq ft × ' + H.num(v.thick, 2) + '/12 ft × ' + H.num(v.density, 1) + ' ÷ 2,000',
      rows: rows,
      n: t,
      sub: 'Tons are U.S. short tons (2,000 lb). Plants sell by the ton off the truck scale.'
    };
  },
  quick: ({ r }) => `Asphalt tonnage = area (sq ft) × compacted thickness (ft) × 145 lb per cu ft ÷ 2,000. A 60 × 12 ft driveway paved 3 inches thick is 720 × 0.25 = 180 cu ft; × 145 = 26,100 lb, or 13.05 tons. Add 5% for edges and low spots and order <strong>${r.value}</strong>. Rule of thumb: about 110 lb per square yard per inch.`,
  stepsTitle: 'How to calculate asphalt tonnage',
  steps: [
    'Measure the length and width in feet and multiply for square feet. Break curved drives and parking areas into rectangles.',
    'Use the <em>compacted</em> thickness in inches, not the loose depth the paver lays down, and divide by 12 for feet.',
    'Multiply square feet × thickness in feet to get cubic feet, then × density (about 145 lb per cubic foot for compacted hot mix).',
    'Divide pounds by 2,000 for tons and add 5–10% for edges, transitions and an uneven base. Calculating the base course with the asphalt density is a common slip; aggregate base is ordered separately.'
  ],
  formulaTitle: 'What is the asphalt tonnage formula?',
  formula: {
    expr: 'Tons = L (ft) × W (ft) × T (in) ÷ 12 × 145 ÷ 2,000<br>Shortcut: Tons ≈ sq yd × T (in) × 110 ÷ 2,000',
    vars: [['T', 'compacted thickness in inches'], ['145', 'typical compacted density of hot-mix asphalt, lb/cu ft'], ['110', 'lb per square yard per inch (145 × 9 ÷ 12 ≈ 109)'], ['2,000', 'lb per short ton']]
  },
  example: `<p>A small parking lot is 120 × 80 ft, paved with 2 inches of surface course over a 2-inch binder course, 4 inches total.</p>
<p>Area = 9,600 sq ft = 1,066.7 sq yd. Volume = 9,600 × 4 ÷ 12 = 3,200 cu ft.</p>
<p>Weight = 3,200 × 145 = 464,000 lb = <strong>232 tons</strong>. The shortcut gives 1,066.7 × 4 × 110 ÷ 2,000 = 234.7 tons, close enough for a budget. Order each lift separately, about 116 tons each, plus 5%.</p>`,
  table: {
    title: 'How many tons of asphalt per 1,000 square feet?',
    intro: 'Tons at 145 lb/cu ft with no waste allowance, computed by the calculator.',
    head: ['Compacted thickness', 'Tons per 1,000 sq ft', 'Tons per 100 sq yd', '12 × 50 ft driveway', '24 × 24 ft pad'],
    rows: ({ run, H }) => [1, 1.5, 2, 2.5, 3, 4, 5, 6].map(t => [t + ' in', H.num(run({ length: 1000, width: 1, thick: t, density: 145, waste: 0 }).n, 2), H.num(run({ length: 900, width: 1, thick: t, density: 145, waste: 0 }).n, 2), run({ length: 50, width: 12, thick: t, density: 145, waste: 0 }).rows[0][1], run({ length: 24, width: 24, thick: t, density: 145, waste: 0 }).rows[0][1]])
  },
  sections: [
    {
      h2: 'How thick should an asphalt driveway be?',
      html: `<p>Residential driveways are commonly paved with 2 to 3 inches of compacted hot mix over a compacted aggregate base, often 4 to 8 inches of crushed stone depending on the soil. Heavier traffic gets more: commercial lots and drives that see delivery trucks are usually built with a binder course and a surface course, and roads are designed from traffic counts and soil tests. Your paving contractor or the local DOT specification sets the real numbers; the calculator just turns them into tons.</p>
<p>Because tonnage scales directly with thickness, a 3-inch driveway uses 50% more asphalt than a 2-inch one. If you are comparing quotes, make sure each one states the compacted thickness, not just “2–3 inches.”</p>`
    },
    {
      h2: 'Why does asphalt density matter?',
      html: `<p>Hot-mix asphalt is mostly crushed stone and sand held together with a few percent of asphalt binder, and a well-compacted dense-graded mix weighs about 145 lb per cubic foot (roughly 2 tons per cubic yard). That is why 145 is the standard estimating figure. Mixes with heavier aggregate, or a plant's specific job-mix formula, can run 140–150 lb/cu ft; open-graded and porous mixes are lighter because they contain more air. Enter your plant's number if you have it.</p>
<p>Density is also why tons, not cubic yards, are used to buy asphalt: the truck is weighed at the plant, and the paver compacts the loose mat down to the design thickness with rollers. Base gravel has its own density; size it with the <a href="/gravel-calculator">gravel calculator</a>.</p>`
    },
    {
      h2: 'How do you convert square yards of asphalt to tons?',
      html: `<p>Paving bids are often written in square yards. Multiply square yards × thickness in inches × the spread rate in pounds per square yard per inch, then divide by 2,000. At 145 lb/cu ft the exact spread rate is 108.75 lb/sy/in, and many estimators round it to 110. So 500 sq yd at 2 inches is 500 × 2 × 110 ÷ 2,000 = 55 tons (54.4 tons with the exact factor). To go the other way, one ton of asphalt covers about 2,000 ÷ 110 = 18.2 sq yd at 1 inch, or 6.1 sq yd at 3 inches.</p>`
    },
    {
      h2: 'How much asphalt do you need to patch a hole?',
      html: `<p>Measure the patch after you square up the edges, and use the compacted depth. A pothole cut to 3 × 2 ft and 3 in deep is 6 × 0.25 = 1.5 cu ft × 145 = 217.5 lb of hot mix. Cold-patch bags list their own coverage; overfill by about ½ inch and compact with a tamper or a car tire so the patch ends up flush.</p>`
    }
  ],
  faq: [
    { q: 'How many tons of asphalt do I need for a driveway?', a: 'A typical 60 × 12 ft driveway at 3 inches compacted needs about 13.05 tons, or 13.7 tons with 5% extra, at 145 lb per cubic foot.' },
    { q: 'How many square feet does a ton of asphalt cover?', a: 'At 145 lb per cubic foot, a ton covers about 165.5 sq ft at 1 inch, 82.8 sq ft at 2 inches and 55.2 sq ft at 3 inches compacted.' },
    { q: 'How much does a cubic yard of asphalt weigh?', a: 'About 3,915 lb, or roughly 1.96 tons, at 145 lb per cubic foot.' },
    { q: 'What is the formula for asphalt tonnage?', a: 'Square feet × thickness in inches ÷ 12 × 145 ÷ 2,000. In square yards: sq yd × inches × 110 ÷ 2,000.' },
    { q: 'How many tons of asphalt for 1,000 square feet?', a: 'About 12.08 tons at 2 inches and 18.13 tons at 3 inches compacted, before any extra.' },
    { q: 'Do I use loose or compacted thickness?', a: 'Compacted. Tonnage formulas use the finished thickness after rolling; the paver lays the loose mat somewhat thicker to get there.' },
    { q: 'Is asphalt sold in short tons or metric tonnes?', a: 'U.S. plants sell in short tons of 2,000 lb. One short ton is 0.907 metric tonnes, which the calculator also shows.' }
  ],
  related: ['gravel-calculator', 'cubic-yards-to-tons-calculator', 'concrete-calculator', 'square-footage-calculator'],
  sources: [
    { name: 'Asphalt Institute', url: 'https://www.asphaltinstitute.org/' },
    { name: 'FHWA: Asphalt pavement technology', url: 'https://www.fhwa.dot.gov/pavement/asphalt/' },
    { name: 'National Asphalt Pavement Association', url: 'https://www.asphaltpavement.org/' }
  ],
  disclaimer: 'Densities vary by mix design; your asphalt plant can give the exact figure for its mix.'
};
