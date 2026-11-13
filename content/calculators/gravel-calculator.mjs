export default {
  slug: 'gravel-calculator',
  hub: 'construction',
  name: 'Gravel Calculator',
  title: 'Gravel Calculator: 50 × 12 ft Driveway at 4" Deep = 11 Tons',
  h1: 'Gravel Calculator: Tons and Cubic Yards for Driveways, Paths and Patios',
  meta: 'How much gravel do you need? A 50 × 12 ft driveway 4" deep is 7.41 yd³; with 10% for compaction that is 11 tons of crushed stone. Pea gravel and river rock too.',
  keyword: 'how to calculate how much gravel i need',
  also: ['how to calculate how much gravel you need', 'how to calculate yards of gravel', 'how much pea gravel do i need calculator', 'how to calculate gravel in yards', 'how to calculate gravel for driveway', 'how do i calculate gravel for driveway', 'how to calculate a yard of gravel', 'how to calculate tons of gravel', 'how much river rock do i need calculator', 'how many tons of rock do i need calculator', 'how to calculate landscape rock', 'how to calculate yards of rock'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Measure by', type: 'select', value: 'dims', options: [['dims', 'Length × width'], ['area', 'Known square footage']] },
    { id: 'length', label: 'Length', type: 'number', value: 50, suffix: 'ft', showIf: { mode: ['dims'] } },
    { id: 'width', label: 'Width', type: 'number', value: 12, suffix: 'ft', showIf: { mode: ['dims'] } },
    { id: 'area', label: 'Area', type: 'number', value: 600, suffix: 'sq ft', showIf: { mode: ['area'] } },
    { id: 'depth', label: 'Depth', type: 'number', value: 4, suffix: 'in' },
    { id: 'type', label: 'Gravel type', type: 'select', value: 'crushed', options: [['crushed', 'Crushed stone (#57, clean) ~2,700 lb/yd³'], ['pea', 'Pea gravel ~2,800 lb/yd³'], ['crusherrun', 'Crusher run / road base ~3,000 lb/yd³'], ['river', 'River rock ~2,600 lb/yd³'], ['custom', 'Custom density']] },
    { id: 'density', label: 'Custom density', type: 'number', value: 2800, suffix: 'lb/yd³', showIf: { type: ['custom'] } },
    { id: 'extra', label: 'Extra for compaction and spread', type: 'number', value: 10, suffix: '%' },
    { id: 'price', label: 'Price per ton (optional)', type: 'number', value: '', prefix: '$' }
  ],
  data: { lb: { crushed: 2700, pea: 2800, crusherrun: 3000, river: 2600 } },
  compute(v, H, D) {
    var area = v.mode === 'area' ? v.area : v.length * v.width;
    if (!(area > 0)) return { error: v.mode === 'area' ? 'Enter the area in square feet.' : 'Enter the length and width in feet.' };
    if (!(v.depth > 0)) return { error: 'Enter the depth in inches.' };
    var dens = v.type === 'custom' ? v.density : D.lb[v.type];
    if (!(dens > 0)) return { error: 'Enter a density in pounds per cubic yard.' };
    var ex = v.extra > 0 ? v.extra : 0;
    var cf = area * v.depth / 12;
    var yd = cf / 27, ydx = yd * (1 + ex / 100);
    var tons = ydx * dens / 2000;
    var rows = [
      ['Cubic yards (no extra)', H.num(yd, 2) + ' yd³'],
      ['Cubic yards with ' + H.num(ex, 1) + '%', H.num(ydx, 2) + ' yd³', true],
      ['Weight', H.int(tons * 2000) + ' lb'],
      ['Cubic feet', H.num(cf * (1 + ex / 100), 1) + ' cu ft'],
      ['0.5 cu ft bags (small jobs)', H.int(Math.ceil(cf * (1 + ex / 100) / 0.5 - 1e-9))],
      ['Coverage per ton at this depth', H.num(2000 / dens * 27 * 12 / v.depth, 1) + ' sq ft']
    ];
    if (v.price > 0) rows.push(['Cost at ' + H.money(v.price) + '/ton', H.money(tons * v.price), true]);
    return {
      value: H.num(tons, 2) + ' tons',
      label: 'Gravel to order',
      expr: H.num(area, 1) + ' sq ft × ' + H.num(v.depth, 2) + '″ → ' + H.num(ydx, 2) + ' yd³ × ' + H.int(dens) + ' lb',
      rows: rows,
      n: tons,
      sub: 'Densities are typical loose values and vary by quarry and moisture; ask your supplier for their weight per yard.'
    };
  },
  quick: ({ r }) => `To work out how much gravel you need, multiply length × width × depth in feet, divide by 27 for cubic yards, then convert to tons. A 50 × 12 ft driveway 4 inches deep is 200 cu ft, or 7.41 cubic yards. Add 10% for compaction (8.15 yd³) and, at about 2,700 lb per yard for crushed stone, order <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate how much gravel you need',
  steps: [
    'Measure the area in feet. Split curved driveways or odd paths into rectangles and add them, or enter the total square footage.',
    'Choose the depth in inches for the layer you are buying. Base and top layers are usually different stones, so calculate them separately.',
    'Multiply square feet by depth in inches and divide by 324 to get cubic yards (12 in per ft × 27 cu ft per yd).',
    'Add 10–15% for compaction and uneven ground. Crushed and road-base stone settle when they are compacted; skipping this is why orders come up short.',
    'Multiply cubic yards by the stone\'s weight per yard and divide by 2,000 to get tons, which is how most quarries sell gravel.'
  ],
  formulaTitle: 'What is the formula for gravel tonnage?',
  formula: {
    expr: 'Cubic yards = sq ft × depth (in) ÷ 324<br>Tons = cubic yards × (1 + extra %) × density (lb/yd³) ÷ 2,000',
    vars: [['sq ft', 'length × width in feet'], ['324', '12 × 27, turns sq ft × inches into cubic yards'], ['density', 'loose weight per cubic yard of that stone'], ['2,000', 'pounds in a U.S. (short) ton']]
  },
  example: `<p>A garden path is 40 ft long and 3 ft wide, to be covered with 2 inches of pea gravel.</p>
<p>Area = 40 × 3 = 120 sq ft. Volume = 120 × 2 ÷ 324 = <strong>0.74 yd³</strong> (20 cu ft).</p>
<p>With 10% extra: 0.81 yd³ × 2,800 lb = 2,281 lb = <strong>1.14 tons</strong>. In 0.5 cu ft bags that is 44 bags, so this is a job where bulk delivery, or a pickup load from the yard, is cheaper and far less lifting.</p>`,
  table: {
    title: 'How much area does a ton of gravel cover?',
    intro: 'Square feet one ton covers at common depths, worked out by the calculator from typical loose densities.',
    head: ['Gravel type', 'Tons per yd³', '2 in deep', '3 in deep', '4 in deep', '6 in deep'],
    rows: ({ run, H, D }) => [['Crushed stone (#57)', 'crushed'], ['Pea gravel', 'pea'], ['Crusher run / road base', 'crusherrun'], ['River rock', 'river']].map(([name, t]) => [name, H.num(D.lb[t] / 2000, 2), ...[2, 3, 4, 6].map(d => H.num(100 / run({ mode: 'area', area: 100, depth: d, type: t, extra: 0 }).n, 0) + ' sq ft')]),
    note: 'Gravel that will be compacted (crusher run, road base) covers less than this once rolled. Add your compaction allowance.'
  },
  sections: [
    {
      h2: 'How deep should gravel be for a driveway, path or patio?',
      html: `<p>Depth drives the order more than anything else, so pick it per layer. Common practice for residential work:</p>
<ul>
<li><strong>Walkways and garden paths:</strong> 2–3 in of pea gravel or ⅜-in chip over landscape fabric.</li>
<li><strong>Patio, shed or paver base:</strong> 4–6 in of compacted crusher run or road base, plus 1 in of bedding sand under pavers.</li>
<li><strong>Existing driveway refresh:</strong> 2–3 in of crushed stone on top of the old surface.</li>
<li><strong>New driveway:</strong> built in layers, typically a 4–6 in base of larger stone or crusher run topped with 2–4 in of smaller crushed stone; soft or clay soils may need more, plus geotextile.</li>
</ul>
<p>Calculate each layer with its own depth and stone type, because a yard of road base weighs more than a yard of clean #57.</p>`
    },
    {
      h2: 'How many tons of gravel are in a cubic yard?',
      html: `<p>Most gravel weighs about 1.3 to 1.5 tons per cubic yard (2,600–3,000 lb) loose. Clean crushed stone, with gaps between the angular pieces, runs about 2,700 lb; pea gravel about 2,800 lb; crusher run, with fines filling the gaps, about 3,000 lb and more once compacted; river rock about 2,600 lb. Wet stone weighs more. These are typical published values; every quarry's rock is a little different, which is why their scale ticket is what you pay for.</p>
<p>To go between the two units for any material, the <a href="/cubic-yards-to-tons-calculator">cubic yards to tons calculator</a> has a longer density table and works in both directions.</p>`
    },
    {
      h2: 'Which gravel should you use: pea gravel, crushed stone or crusher run?',
      html: `<ul>
<li><strong>Crushed stone (#57, #3, #411):</strong> angular pieces lock together, so it stays put on driveways and drains well. #57 (about ¾–1 in) is the most common top and drainage stone.</li>
<li><strong>Crusher run / road base (dense grade):</strong> crushed stone plus stone dust. It compacts almost like concrete, making it the standard base for driveways, patios and sheds, but it drains slowly.</li>
<li><strong>Pea gravel:</strong> small, rounded and comfortable underfoot for paths, play areas and patios, but it rolls and migrates on slopes and driveways unless it is edged or set in a stabilizing grid.</li>
<li><strong>River rock:</strong> larger rounded stone (1–3 in and up) used for dry creek beds, borders and drainage swales; mostly decorative.</li>
</ul>`
    },
    {
      h2: 'How do you calculate gravel for a round or irregular area?',
      html: `<p>For a circle, find the area with 3.1416 × radius² and switch the calculator to “known square footage”: a 12-ft fire-pit circle is 3.1416 × 6² = 113 sq ft, which takes 1.40 yd³ at 4 in (about 1.9 tons of crushed stone before extra). For a curved driveway, measure the centerline length and the average width. For a freeform bed, break it into rectangles and triangles, add the areas, and use the total.</p>`
    }
  ],
  faq: [
    { q: 'How much area does a ton of gravel cover?', a: 'A ton of crushed stone (about 2,700 lb per yard) covers roughly 120 sq ft at 2 inches deep, 80 sq ft at 3 inches and 60 sq ft at 4 inches.' },
    { q: 'How much gravel do I need for a 10x10 area?', a: 'At 4 inches deep a 10 × 10 ft area needs 1.23 cubic yards, about 1.67 tons of crushed stone before any extra for compaction.' },
    { q: 'How many cubic yards of gravel do I need for a driveway?', a: 'Multiply length × width × depth in inches and divide by 324. A 50 × 12 ft driveway at 4 inches needs 7.41 cubic yards, or about 8.15 with 10% for compaction.' },
    { q: 'How many bags of gravel make a cubic yard?', a: '54 bags of 0.5 cu ft make one cubic yard (27 cu ft). Bags are practical only for small patches.' },
    { q: 'How much pea gravel do I need for a 12x12 patio?', a: 'At 3 inches deep, a 12 × 12 ft patio needs 1.33 cubic yards, about 1.87 tons of pea gravel, before extra.' },
    { q: 'Is gravel sold by the ton or by the yard?', a: 'Both. Quarries usually sell by the ton because they weigh trucks; landscape yards often sell by the cubic yard. The calculator shows both.' },
    { q: 'How much extra gravel should I order?', a: 'Order about 10–15% extra for compaction and uneven subgrade, more for crusher run that will be rolled hard.' }
  ],
  related: ['cubic-yards-to-tons-calculator', 'cubic-yards-calculator', 'concrete-calculator', 'asphalt-calculator', 'mulch-calculator'],
  sources: [
    { name: 'The Engineering ToolBox: Densities of common materials (gravel, crushed stone, sand)', url: 'https://www.engineeringtoolbox.com/density-materials-d_1652.html' },
    { name: 'NIST Handbook 44, Appendix C: General Tables of Units of Measurement', url: 'https://www.nist.gov/pml/weights-and-measures/publications/nist-handbooks/handbook-44' }
  ],
  disclaimer: 'Gravel densities are typical published values; actual weight varies by supplier, stone and moisture.'
};
