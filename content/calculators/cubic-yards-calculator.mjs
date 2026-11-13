export default {
  slug: 'cubic-yards-calculator',
  hub: 'construction',
  name: 'Cubic Yards Calculator',
  title: 'Cubic Yards Calculator: 20×10 ft at 6" Deep = 3.7 Yd³ of Dirt',
  h1: 'Cubic Yard Calculator for Dirt, Topsoil, Fill and Sand',
  meta: 'Find cubic yards of soil from length, width and depth in inches, plus settling and bag counts. A 20 × 10 ft bed 6" deep takes 3.7 yd³; with 10% extra, 4.07 yd³.',
  keyword: 'how to calculate cubic yards of dirt',
  also: ['how to calculate yards of dirt', 'how to calculate yards of soil', 'how do i calculate cubic yards of dirt', 'how to calculate cubic yards of soil', 'how do you calculate yards of dirt', 'how do you calculate a cubic yard of dirt', 'how to calculate how much topsoil i need', 'how much topsoil do i need calculator', 'how to calculate fill dirt', 'how much sand do i need calculator', 'how do i calculate cubic yards'],
  updated: '2026-11-13',
  inputs: [
    { id: 'shape', label: 'Area shape', type: 'select', value: 'rect', options: [['rect', 'Rectangle'], ['circle', 'Circle']] },
    { id: 'length', label: 'Length', type: 'number', value: 20, suffix: 'ft', showIf: { shape: ['rect'] } },
    { id: 'width', label: 'Width', type: 'number', value: 10, suffix: 'ft', showIf: { shape: ['rect'] } },
    { id: 'diameter', label: 'Diameter', type: 'number', value: 10, suffix: 'ft', showIf: { shape: ['circle'] } },
    { id: 'depth', label: 'Depth', type: 'number', value: 6, suffix: 'in' },
    { id: 'material', label: 'Material', type: 'select', value: 'topsoil', options: [['topsoil', 'Topsoil / garden soil'], ['fill', 'Fill dirt'], ['compost', 'Compost'], ['sand', 'Sand']] },
    { id: 'extra', label: 'Extra for settling or compaction', type: 'number', value: 10, suffix: '%', help: 'Loose soil settles; 10–20% is a common allowance.' },
    { id: 'bag', label: 'Bag size (if buying bags)', type: 'select', value: '0.75', options: [['0.75', '0.75 cu ft (40 lb topsoil)'], ['1', '1 cu ft'], ['1.5', '1.5 cu ft'], ['2', '2 cu ft']] },
    { id: 'price', label: 'Bulk price per cubic yard (optional)', type: 'number', value: '', prefix: '$' }
  ],
  data: { lbPerYd: { topsoil: 2200, fill: 2100, compost: 1000, sand: 2700 } },
  compute(v, H, D) {
    var area;
    if (v.shape === 'circle') { if (!(v.diameter > 0)) return { error: 'Enter the diameter.' }; area = Math.PI * v.diameter * v.diameter / 4; }
    else { if (!(v.length > 0) || !(v.width > 0)) return { error: 'Enter the length and width in feet.' }; area = v.length * v.width; }
    if (!(v.depth > 0)) return { error: 'Enter the depth in inches.' };
    var cf = area * v.depth / 12, yd = cf / 27;
    var ex = v.extra > 0 ? v.extra : 0;
    var ydx = yd * (1 + ex / 100), cfx = cf * (1 + ex / 100);
    var bag = Number(v.bag) || 1;
    var lb = ydx * (D.lbPerYd[v.material] || 2200);
    var rows = [
      ['Before extra', H.num(yd, 2) + ' yd³ (' + H.num(cf, 1) + ' cu ft)'],
      ['Order in bulk (next ½ yd)', H.num(Math.ceil(ydx * 2 - 1e-9) / 2, 1) + ' yd³', true],
      ['Or bags of ' + bag + ' cu ft', H.int(Math.ceil(cfx / bag - 1e-9)) + ' bags'],
      ['Approx. weight', H.int(lb) + ' lb (' + H.num(lb / 2000, 2) + ' tons)'],
      ['Area covered', H.num(area, 1) + ' sq ft']
    ];
    if (v.price > 0) rows.push(['Bulk cost', H.money(Math.ceil(ydx * 2 - 1e-9) / 2 * v.price)]);
    return {
      value: H.num(ydx, 2) + ' yd³',
      label: 'Cubic yards to order (with ' + H.num(ex, 1) + '% extra)',
      expr: H.num(area, 1) + ' sq ft × ' + H.num(v.depth, 2) + ' in ÷ 12 ÷ 27',
      rows: rows,
      sub: 'Weight assumes about ' + H.int(D.lbPerYd[v.material] || 2200) + ' lb per cubic yard; damp soil weighs more, so confirm with your supplier.'
    };
  },
  quick: ({ r }) => `To calculate cubic yards of dirt, multiply length × width in feet by depth in feet, then divide by 27. A 20 × 10 ft garden bed filled 6 inches deep is 20 × 10 × 0.5 = 100 cu ft ÷ 27 = 3.7 cubic yards. Add 10% for settling and you need <strong>${r.value}</strong>, so order 4.5 yards in bulk or about 147 bags of 0.75 cu ft.`,
  stepsTitle: 'How to calculate cubic yards of dirt or soil',
  steps: [
    'Measure the length and width of the area in feet. For a round bed, measure straight across the middle.',
    'Decide the depth in inches: about 2 in to top-dress a lawn, 4–6 in for new lawn or planting beds, 8–12 in for a raised vegetable bed.',
    'Multiply area × depth and divide by 12 to get cubic feet, then divide by 27 for cubic yards. Forgetting to turn inches into feet is the usual mistake; it makes the order 12 times too big.',
    'Add 10–20% for settling or compaction and round up to what the supplier sells, usually half or whole yards.'
  ],
  formulaTitle: 'What is the formula for cubic yards of dirt?',
  formula: {
    expr: 'Cubic yards = Length (ft) × Width (ft) × Depth (in) ÷ 324<br>Circle: yd³ = 3.1416 × (diameter ÷ 2)² × Depth (in) ÷ 324',
    vars: [['324', '12 in per ft × 27 cu ft per yd³'], ['Depth', 'finished depth in inches'], ['27', 'cubic feet in one cubic yard']],
    note: 'Dividing by 324 does both conversions at once: inches to feet (÷ 12) and cubic feet to cubic yards (÷ 27).'
  },
  example: `<p>A new lawn area is 40 × 25 ft and needs 4 inches of topsoil.</p>
<p>40 × 25 × 4 ÷ 324 = 4,000 ÷ 324 = <strong>12.35 yd³</strong>.</p>
<p>With 15% for settling: 12.35 × 1.15 = <strong>14.2 yd³</strong>, so order 14.5 yards. At roughly 2,200 lb per yard that is about 15.6 tons, which is more than one small dump truck can carry, so ask how many loads it takes.</p>`,
  table: {
    title: 'How many cubic yards of dirt for common areas and depths?',
    intro: 'Cubic yards before any settling allowance, from the calculator.',
    head: ['Area', '2 in deep', '4 in deep', '6 in deep', '12 in deep'],
    rows: ({ run }) => [[10, 10], [12, 12], [10, 20], [20, 20], [25, 40], [30, 50], [50, 50], [50, 100]].map(([a, b]) => [a + ' × ' + b + ' ft (' + (a * b).toLocaleString('en-US') + ' sq ft)', ...[2, 4, 6, 12].map(d => run({ shape: 'rect', length: a, width: b, depth: d, extra: 0 }).value)])
  },
  sections: [
    {
      h2: 'How much does a cubic yard of dirt cover?',
      html: `<p>One cubic yard is 27 cu ft, so it covers 324 sq ft at 1 inch deep, 162 sq ft at 2 inches, 81 sq ft at 4 inches and 54 sq ft at 6 inches. Divide 324 by the depth in inches to get the coverage of a yard at any depth. For a 1,000 sq ft lawn topdressed ¼ inch deep, that is 1,000 ÷ (324 ÷ 0.25) = 0.77 yd³.</p>
<p>A cubic yard of topsoil is a pile roughly 3 ft on each side and typically weighs 1 to 1.35 tons depending on moisture; check what your truck or trailer can legally carry before picking it up yourself. A full yard of damp soil can exceed the payload of many half-ton pickups.</p>`
    },
    {
      h2: 'How much extra dirt should you order for settling?',
      html: `<p>Loose soil dumped from a truck is fluffed up with air and settles as it is watered and walked on. Common allowances:</p>
<ul><li><strong>Topsoil and garden soil for beds:</strong> 10–20% extra; raised beds often need a top-up after the first season.</li><li><strong>Fill dirt that will be compacted</strong> (under a patio, shed pad or to raise grade): 20–25% or more, because compaction squeezes out air.</li><li><strong>Compost:</strong> settles a lot as it breaks down; mix it into soil rather than relying on depth alone.</li></ul>
<p>Dirt measured in the ground (bank yards) also swells when dug: an excavated yard of soil usually becomes more than a yard in the truck. If you are hauling dirt <em>away</em>, plan for 20–30% more volume than the hole.</p>`
    },
    {
      h2: 'Is bagged or bulk topsoil better for your project?',
      html: `<p>Bags make sense for small jobs and places a truck can't reach. Bulk wins quickly as the job grows: one cubic yard equals 36 bags of 0.75 cu ft, 27 bags of 1 cu ft or 13.5 bags of 2 cu ft. To compare prices, multiply the bag price by the number of bags per yard and add the delivery fee to the bulk price. For anything over about a yard, bulk is usually cheaper and avoids a pile of plastic.</p>
<p>For a raised bed, many gardeners mix topsoil with 25–50% compost. Calculate the total volume, then split it by percentage. For gravel or stone, which is sold by the ton, use the <a href="/gravel-calculator">gravel calculator</a>; for bark, the <a href="/mulch-calculator">mulch calculator</a>.</p>`
    },
    {
      h2: 'How do you convert cubic yards of dirt to tons?',
      html: `<p>Multiply cubic yards by the weight per yard and divide by 2,000. Typical loose weights are about 2,000–2,200 lb per yard for dry topsoil, 2,100 lb for fill dirt, 2,700 lb for dry sand and around 1,000 lb for compost. Wet soil can be 20% heavier or more. The <a href="/cubic-yards-to-tons-calculator">cubic yards to tons calculator</a> has a full density table and works both ways.</p>`
    }
  ],
  faq: [
    { q: 'How many cubic yards of dirt do I need for a 10x10 area?', a: 'At 4 inches deep, a 10 × 10 ft area needs 1.23 cubic yards; at 6 inches, 1.85 cubic yards, before settling.' },
    { q: 'How many bags of soil equal a cubic yard?', a: '27 bags of 1 cu ft, 36 bags of 0.75 cu ft, or 13.5 bags of 2 cu ft make one cubic yard.' },
    { q: 'How many square feet does a yard of topsoil cover?', a: 'About 162 sq ft at 2 inches deep, 81 sq ft at 4 inches and 54 sq ft at 6 inches.' },
    { q: 'How much does a cubic yard of dirt weigh?', a: 'Roughly 2,000 to 2,700 lb (1 to 1.35 tons) for dry soil, and more when wet. Ask your supplier for their figure.' },
    { q: 'How deep should topsoil be for a new lawn?', a: 'Plan on about 4 to 6 inches of topsoil for a new lawn from seed or sod. For a raised vegetable bed, 8 to 12 inches.' },
    { q: 'How do I calculate cubic yards for a round area?', a: 'Square half the diameter, multiply by 3.1416 to get the area, multiply by depth in inches and divide by 324. A 10-ft round bed 6 inches deep needs 1.45 cubic yards.' },
    { q: 'How do I calculate yards of dirt to fill a hole?', a: 'Multiply the hole\'s length × width × depth in feet and divide by 27, then add 20–25% because fill compacts. A 6 × 4 × 3 ft hole is 2.67 yd³; with 25% extra that is 3.33 yd³, so order 3.5.' }
  ],
  related: ['gravel-calculator', 'mulch-calculator', 'cubic-yards-to-tons-calculator', 'cubic-feet-calculator', 'concrete-calculator'],
  sources: [
    { name: 'NIST Handbook 44, Appendix C: General Tables of Units of Measurement', url: 'https://www.nist.gov/pml/weights-and-measures/publications/nist-handbooks/handbook-44' },
    { name: 'The Engineering ToolBox: Dirt and mud densities', url: 'https://www.engineeringtoolbox.com/dirt-mud-densities-d_1727.html' }
  ],
  disclaimer: 'Soil weights are typical published values; actual weight varies with moisture and supplier.'
};
