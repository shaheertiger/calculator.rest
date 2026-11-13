export default {
  slug: 'mulch-calculator',
  hub: 'construction',
  name: 'Mulch Calculator',
  title: 'Mulch Calculator: 152 Sq Ft at 3" Deep = 19 Bags (1.41 Yd³)',
  h1: 'Mulch Calculator: Bags or Cubic Yards for Every Bed',
  meta: 'Add your garden beds and depth to get bags or yards of bark mulch. Two beds totaling 152 sq ft at 3 inches need 38 cu ft: 19 bags of 2 cu ft or 1.41 yards.',
  keyword: 'how to calculate bark mulch coverage',
  also: ['how much mulch do i need calculator', 'how to calculate cubic feet for mulch', 'how to calculate cubic yards of mulch', 'how do i calculate how much rubber mulch is required', 'mulch calculator bags', 'how many bags of mulch in a yard'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'beds', label: 'Beds', type: 'rows', addLabel: '+ add bed', max: 30,
      fields: [
        { id: 'name', label: 'Bed (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. Front walk' },
        { id: 'l', label: 'Length ft', type: 'number', value: 10 },
        { id: 'w', label: 'Width ft', type: 'number', value: 4 }
      ],
      value: [
        { name: 'Front bed', l: 20, w: 4 },
        { name: 'Side bed', l: 12, w: 6 }
      ]
    },
    { id: 'depth', label: 'Target depth', type: 'number', value: 3, suffix: 'in' },
    { id: 'existing', label: 'Mulch already there', type: 'number', value: 0, suffix: 'in', help: 'For a top-up, enter the depth that remains.' },
    { id: 'bag', label: 'Bag size', type: 'select', value: '2', options: [['2', '2 cu ft (most common)'], ['3', '3 cu ft'], ['1.5', '1.5 cu ft'], ['0.8', '0.8 cu ft (rubber mulch)']] },
    { id: 'bagPrice', label: 'Price per bag (optional)', type: 'number', value: '', prefix: '$' },
    { id: 'ydPrice', label: 'Bulk price per yard (optional)', type: 'number', value: '', prefix: '$' }
  ],
  compute(v, H) {
    var area = 0, k = 0;
    (v.beds || []).forEach(function (b) { if (b.l > 0 && b.w > 0) { area += b.l * b.w; k++; } });
    if (!k) return { error: 'Enter the length and width of at least one bed.' };
    if (!(v.depth > 0)) return { error: 'Enter the depth in inches.' };
    var have = v.existing > 0 ? v.existing : 0;
    var add = v.depth - have;
    if (!(add > 0)) return { error: 'The bed already has the target depth.' };
    var cf = area * add / 12, yd = cf / 27;
    var bag = Number(v.bag) || 2;
    var bags = Math.ceil(cf / bag - 1e-9);
    var rows = [
      ['Cubic yards', H.num(yd, 2) + ' yd³', true],
      ['Cubic feet', H.num(cf, 1) + ' cu ft'],
      ['Total bed area', H.num(area, 1) + ' sq ft'],
      ['Depth added', H.num(add, 2) + ' in'],
      ['Bulk order (next ½ yd)', H.num(Math.ceil(yd * 2 - 1e-9) / 2, 1) + ' yd³']
    ];
    if (v.bagPrice > 0) rows.push(['Bagged cost', H.money(bags * v.bagPrice)]);
    if (v.ydPrice > 0) rows.push(['Bulk cost (before delivery)', H.money(Math.ceil(yd * 2 - 1e-9) / 2 * v.ydPrice)]);
    return {
      value: bags + ' bags',
      label: 'Bags of mulch (' + bag + ' cu ft)',
      expr: H.num(area, 1) + ' sq ft × ' + H.num(add, 2) + ' in ÷ 12 ÷ ' + bag,
      rows: rows,
      sub: 'One ' + bag + ' cu ft bag covers ' + H.num(bag * 12 / add, 1) + ' sq ft at ' + H.num(add, 2) + ' in deep.'
    };
  },
  quick: ({ r }) => `One 2 cu ft bag of bark mulch covers 12 sq ft at 2 inches or 8 sq ft at 3 inches, and a cubic yard covers 108 sq ft at 3 inches. Beds of 20 × 4 ft and 12 × 6 ft total 152 sq ft; at 3 inches deep that is 152 × 3 ÷ 12 = 38 cu ft, or <strong>${r.value}</strong> of 2 cu ft (1.41 cubic yards).`,
  stepsTitle: 'How to calculate how much mulch you need',
  steps: [
    'Measure each bed\'s length and width in feet. Treat curved beds as a rectangle of the average width, and add one row per bed.',
    'Choose a depth: 2–3 in for most beds, 3 in where weeds are a problem, 1 in around seedlings and small annuals.',
    'If old mulch is still there, enter its depth so you only buy the top-up. Most people forget this and buy a full layer every year.',
    'Multiply total square feet by the depth in inches and divide by 12 for cubic feet, then by your bag size (or by 27 for bulk yards). Round bags up.'
  ],
  formulaTitle: 'What is the formula for mulch coverage?',
  formula: {
    expr: 'Cubic feet = sq ft × depth (in) ÷ 12<br>Bags = cubic feet ÷ bag size (cu ft), rounded up<br>Cubic yards = sq ft × depth (in) ÷ 324',
    vars: [['sq ft', 'total bed area'], ['depth', 'mulch to add, in inches'], ['324', 'sq ft one cubic yard covers at 1 inch deep']],
    note: 'Coverage of one bag at any depth = bag cu ft × 12 ÷ depth in inches. Coverage of one yard = 324 ÷ depth.'
  },
  example: `<p>A ring of mulch around a tree is 8 ft across, with the 1 ft nearest the trunk left bare (outer radius 4 ft, inner radius 1 ft).</p>
<p>Area = 3.1416 × (4² − 1²) = 3.1416 × 15 = <strong>47.1 sq ft</strong>.</p>
<p>At 3 inches deep: 47.1 × 3 ÷ 12 = 11.8 cu ft ÷ 2 = 5.9, so buy <strong>6 bags</strong> of 2 cu ft. Adding it to the 152 sq ft of beds above brings the total to 199.1 sq ft and 25 bags.</p>`,
  table: {
    title: 'How much area does a bag or yard of mulch cover?',
    intro: 'Square feet covered at each depth, from the coverage formula the calculator uses.',
    head: ['Depth', '1 cubic yard', '3 cu ft bag', '2 cu ft bag', '1.5 cu ft bag'],
    rows: ({ H }) => [1, 2, 3, 4, 5, 6].map(d => [d + (d === 1 ? ' inch' : ' inches'), H.num(324 / d, 1) + ' sq ft', H.num(36 / d, 1) + ' sq ft', H.num(24 / d, 1) + ' sq ft', H.num(18 / d, 1) + ' sq ft']),
    note: 'Bark settles and breaks down over a season, so a 3-inch layer will look closer to 2 inches by the next spring.'
  },
  sections: [
    {
      h2: 'How deep should mulch be?',
      html: `<p>For shrub and perennial beds, 2–3 inches is the usual target. The University of Florida's Florida-Friendly Landscaping program recommends 3 inches: enough to suppress weeds and hold moisture without keeping rain from reaching the roots. Thinner layers (about 1 inch) suit seedlings, vegetables and herbs. Going deeper than 3–4 inches wastes mulch and can starve roots of air and water.</p>
<p>Keep mulch off trunks and stems. Piling it against a tree (“volcano mulching”) holds moisture against the bark and invites rot and rodents; UF/IFAS advises leaving about 1 ft bare around large trees and a couple of inches around smaller plants. The tree-ring example above leaves that gap out of the area.</p>`
    },
    {
      h2: 'How many bags of mulch are in a cubic yard?',
      html: `<p>A cubic yard is 27 cu ft, so it equals 13.5 bags of 2 cu ft, 9 bags of 3 cu ft or 18 bags of 1.5 cu ft. To compare bagged and bulk prices, multiply the bag price by 13.5 (for 2 cu ft bags) and set it against the bulk price per yard plus delivery. For one or two small beds, bags are easier to handle; once a job passes about 2–3 yards (27–40 bags), bulk mulch is usually cheaper and much faster to spread from a wheelbarrow.</p>
<p>Bagged mulch is sometimes sold by the liter in imported brands: 56 L ≈ 2 cu ft (1 cu ft = 28.3 L).</p>`
    },
    {
      h2: 'How much rubber mulch or playground mulch do you need?',
      html: `<p>Playground surfacing is about fall protection, not looks, so it is much deeper. The U.S. Consumer Product Safety Commission's Public Playground Safety Handbook says never to use less than 9 inches of loose-fill material such as wood mulch or chips, except shredded/recycled rubber, for which 6 inches is recommended. Because loose fill compresses at least 25%, the handbook gives the example of filling to 12 inches to keep 9 inches in place.</p>
<p>So a 20 × 20 ft play area (400 sq ft) filled to 12 inches of wood mulch needs 400 cu ft, or 14.8 cubic yards. Rubber mulch is often sold in 0.8 cu ft bags; check the label, and enter that bag size above.</p>`
    },
    {
      h2: 'How do you calculate mulch for a curved or round bed?',
      html: `<p>Measure the longest length and the average width (measure the width in three places and average them), then treat it as a rectangle. For a circle, area = 3.1416 × radius²; a 6-ft round bed is 28.3 sq ft. For a ring around a tree, subtract the bare inner circle from the outer one as in the worked example. If you'd rather work in cubic yards for a large landscape job, the <a href="/cubic-yards-calculator">cubic yards calculator</a> takes length, width and depth for soil as well.</p>`
    }
  ],
  faq: [
    { q: 'How many square feet does a 2 cubic foot bag of mulch cover?', a: 'A 2 cu ft bag covers 24 sq ft at 1 inch, 12 sq ft at 2 inches and 8 sq ft at 3 inches deep.' },
    { q: 'How many square feet does a yard of mulch cover?', a: 'One cubic yard covers 324 sq ft at 1 inch, 162 sq ft at 2 inches, 108 sq ft at 3 inches and 81 sq ft at 4 inches.' },
    { q: 'How many bags of mulch do I need for 100 square feet?', a: 'At 3 inches deep, 100 sq ft needs 25 cu ft of mulch: 13 bags of 2 cu ft (12.5 rounded up). At 2 inches, 9 bags.' },
    { q: 'How many bags of mulch are in a yard?', a: '13.5 bags of 2 cu ft, or 9 bags of 3 cu ft, make one cubic yard.' },
    { q: 'Should I remove old mulch before adding new?', a: 'Not usually. Rake it to loosen it and top it up to the target depth. Remove it only if the total would exceed 3–4 inches or if it is matted, moldy or piled against stems.' },
    { q: 'How deep should mulch be around trees?', a: 'About 2–3 inches deep over the root zone, with a gap of about a foot around the trunk of a large tree. Never pile mulch against the bark.' },
    { q: 'How much does a yard of mulch weigh?', a: 'Wood and bark mulch typically weigh about 400–800 lb per cubic yard, depending on the wood and how wet it is.' }
  ],
  related: ['cubic-yards-calculator', 'gravel-calculator', 'cubic-feet-calculator', 'cubic-yards-to-tons-calculator'],
  sources: [
    { name: 'University of Florida IFAS Gardening Solutions: Mulch', url: 'https://gardeningsolutions.ifas.ufl.edu/care/planting/mulch/' },
    { name: 'U.S. CPSC: Public Playground Safety Handbook (Publication 325)', url: 'https://www.cpsc.gov/s3fs-public/325.pdf' }
  ]
};
