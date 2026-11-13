export default {
  slug: 'concrete-block-calculator',
  hub: 'construction',
  name: 'Concrete Block Calculator',
  title: 'Concrete Block Calculator: 40×6 ft Wall Needs 284 Blocks',
  h1: 'Concrete Block Calculator: CMU Count, Courses and Mortar Bags',
  meta: 'Count 8×8×16 blocks and mortar for a wall. A 40 ft × 6 ft wall is 9 courses of 30, or 270 blocks; with 5% waste buy 284 blocks and about 22 bags of mortar.',
  keyword: 'how to calculate concrete blocks needed',
  also: ['concrete block calculator', 'cinder block calculator', 'how many cinder blocks do i need', 'how many concrete blocks per square foot', 'block wall calculator', 'cmu calculator', 'how much mortar for block'],
  updated: '2026-11-13',
  inputs: [
    { id: 'length', label: 'Total wall length', type: 'number', value: 40, suffix: 'ft', help: 'Add all the walls together.' },
    { id: 'height', label: 'Wall height', type: 'number', value: 6, suffix: 'ft' },
    { id: 'openings', label: 'Doors and windows to leave out', type: 'number', value: 0, suffix: 'sq ft' },
    { id: 'face', label: 'Block face size (nominal)', type: 'select', value: '16', options: [['16', '8 × 16 in (standard 4–12 in wide CMU)'], ['8', '8 × 8 in (half block)']] },
    { id: 'waste', label: 'Waste and breakage', type: 'number', value: 5, suffix: '%' },
    { id: 'perBag', label: 'Blocks laid per 80 lb mortar bag', type: 'number', value: 13, help: 'Quikrete Mortar Mix: up to 13 standard blocks per 80 lb bag.' },
    { id: 'price', label: 'Price per block (optional)', type: 'number', value: '', prefix: '$' }
  ],
  compute(v, H) {
    if (!(v.length > 0) || !(v.height > 0)) return { error: 'Enter the wall length and height in feet.' };
    var fl = Number(v.face) || 16, fh = 8;
    var courses = Math.ceil(v.height * 12 / fh - 1e-9);
    var perCourse = v.length * 12 / fl;
    var gross = courses * perCourse;
    var open = v.openings > 0 ? v.openings * 144 / (fl * fh) : 0;
    var net = gross - open;
    if (!(net > 0)) return { error: 'The openings are larger than the wall.' };
    var w = v.waste > 0 ? v.waste : 0;
    var buy = Math.ceil(net * (1 + w / 100) - 1e-9);
    var per = v.perBag > 0 ? v.perBag : 13;
    var bags = Math.ceil(buy / per - 1e-9);
    var rows = [
      ['Blocks before waste', H.num(Math.ceil(net - 1e-9), 0)],
      ['Courses (rows)', courses + ' × 8 in = ' + H.num(courses * 8 / 12, 2) + ' ft high'],
      ['Blocks per course', H.num(perCourse, 2)],
      ['Net wall area', H.num(v.length * v.height - (v.openings > 0 ? v.openings : 0), 1) + ' sq ft'],
      ['80 lb mortar bags (minimum)', String(bags), true]
    ];
    if (v.price > 0) rows.push(['Block cost', H.money(buy * v.price)]);
    return {
      value: H.int(buy) + ' blocks',
      label: 'Blocks to buy (with ' + H.num(w, 1) + '% waste)',
      expr: courses + ' courses × ' + H.num(perCourse, 2) + (open ? ' − ' + H.num(open, 1) : '') + ' × ' + H.num(1 + w / 100, 2),
      rows: rows,
      sub: courses * 8 > v.height * 12 + 1e-9 ? 'The height isn\'t a multiple of 8 in, so the top course will need cutting or a cap.' : 'Laid with ⅜-in joints, 8 × 16 in nominal blocks fill exactly 8 × 16 in of wall.'
    };
  },
  quick: ({ r }) => `To calculate concrete blocks, divide the wall area by 0.889 sq ft (the face of one 8 × 16 in block), or multiply it by 1.125. A wall 40 ft long and 6 ft high is 240 sq ft: 9 courses of 30 blocks = 270 blocks. With 5% for breakage, buy <strong>${r.value}</strong> and about 22 bags of 80 lb mortar mix.`,
  stepsTitle: 'How to calculate how many blocks you need',
  steps: [
    'Measure the total length of all walls and the finished height in feet.',
    'Work out the courses: height in inches ÷ 8, rounded up. A 6-ft wall is 72 ÷ 8 = 9 courses.',
    'Work out blocks per course: length in inches ÷ 16. A 40-ft wall is 480 ÷ 16 = 30 blocks.',
    'Multiply courses × blocks per course, subtract openings (about 1.125 blocks per square foot of door or window), then add 5–10% for cuts and breakage. People often forget the cut blocks at corners and openings, which is what the waste covers.',
    'Divide the block count by 13 for 80 lb bags of mortar mix and round up.'
  ],
  formulaTitle: 'What is the formula for concrete blocks?',
  formula: {
    expr: 'Blocks = wall area (sq ft) ÷ 0.889 = wall area × 1.125<br>or Blocks = ⌈height (in) ÷ 8⌉ × length (in) ÷ 16<br>Mortar bags (80 lb) = blocks ÷ 13',
    vars: [['0.889 sq ft', 'face of one 8 × 16 in block: 128 sq in ÷ 144'], ['1.125', 'blocks per square foot of wall'], ['⌈ ⌉', 'round up to whole courses'], ['13', 'blocks per 80 lb bag of Quikrete Mortar Mix']],
    note: 'Nominal sizes include the ⅜-in mortar joint. A standard block actually measures 7⅝ × 7⅝ × 15⅝ in.'
  },
  example: `<p>A garage foundation wall runs 24 + 24 + 22 + 22 = 92 ft and stands 4 ft high, with no openings.</p>
<p>Courses: 48 ÷ 8 = <strong>6</strong>. Blocks per course: 92 × 12 ÷ 16 = <strong>69</strong>. Blocks: 6 × 69 = <strong>414</strong>.</p>
<p>With 5% waste: 414 × 1.05 = 434.7, so buy <strong>435 blocks</strong>. Mortar: 435 ÷ 13 = 33.5, so at least <strong>34 bags</strong> of 80 lb mortar mix (Type S is the usual choice below grade).</p>`,
  table: {
    title: 'How many blocks for a wall of each size?',
    intro: '8 × 16 in face blocks with no waste, from the calculator. Heights are whole 8-inch courses.',
    head: ['Wall length', '2 ft high (3 courses)', '4 ft (6)', '6 ft (9)', '8 ft (12)'],
    rows: ({ run }) => [8, 12, 16, 20, 24, 32, 40, 50, 60, 80, 100].map(L => [L + ' ft', ...[2, 4, 6, 8].map(h => run({ length: L, height: h, openings: 0, face: '16', waste: 0 }).value)])
  },
  sections: [
    {
      h2: 'How many concrete blocks are in a square foot?',
      html: `<p>1.125. A standard concrete masonry unit (CMU) has a nominal face of 8 × 16 in, which is 128 sq in, or 0.889 sq ft once you divide by 144. Turn that around and one square foot of wall holds 1 ÷ 0.889 = 1.125 blocks, so 100 sq ft of wall takes 112.5 blocks. The face is the same for 4, 6, 8, 10 and 12-inch-wide units, so the count doesn't change with wall thickness; only the weight and the price do.</p>
<p>Half blocks (8 × 8 in face) cover 0.444 sq ft each, so you need 2.25 per square foot. Many walls use a mix: full blocks in the field, and half or corner blocks at ends and openings to keep the running bond without cutting.</p>`
    },
    {
      h2: 'How much mortar do you need for concrete block?',
      html: `<p>Quikrete's data sheet for its Mortar Mix says each 80 lb bag lays up to 13 standard 8 × 8 × 16 in blocks (or 37 bricks). “Up to” matters: thick joints, full head-joint bedding and droppings all reduce yield, so treat the bag count as a minimum and keep a few extra on hand. For the 270-block default wall, 284 ÷ 13 = 21.8, so buy at least 22 bags.</p>
<p>Choose the mortar type for the job. Under ASTM C270, Type N is a general-purpose mortar for above-grade walls, while Type S has higher strength and is commonly used for foundations, retaining walls and other below-grade or load-bearing work. On large jobs masons mix masonry cement and sand on site, which is cheaper per block than pre-blended bags.</p>`
    },
    {
      h2: 'Why does wall height have to be in 8-inch steps?',
      html: `<p>Block walls go up in whole courses, and every course is 8 in tall including its joint. A wall that must be exactly 5 ft (60 in) needs 7.5 courses, so you either build 8 courses (5 ft 4 in) or cut the top course down, which wastes blocks and labor. The same applies to length in 8-inch steps (half a block). Laying out walls, door openings and window heights on the 8-inch module saves a surprising number of cuts; the calculator flags when your height falls between courses.</p>
<p>Foundation and retaining walls also need footings, reinforcing steel and grouted cores sized by your local code and engineer. Use the <a href="/concrete-calculator">concrete calculator</a> for the footing and grout volume.</p>`
    },
    {
      h2: 'How do you count blocks for a wall with doors or windows?',
      html: `<p>Find the gross count for the solid wall, then subtract the openings at 1.125 blocks per square foot. A 3 × 7 ft door opening is 21 sq ft, about 23.6 blocks; a 4 × 3 ft window is 12 sq ft, 13.5 blocks. Don't subtract more than that: the blocks next to the opening are often cut or replaced with jamb units, and a lintel (a precast concrete or bond-beam unit) has to span the top. Those special units are bought separately.</p>`
    }
  ],
  faq: [
    { q: 'How many cinder blocks do I need for a 10 x 10 wall?', a: 'A wall 10 ft long and 10 ft high is 240 inches long ÷ 16 = 7.5 blocks per course times 15 courses (120 ÷ 8) = 112.5, so 113 blocks, or about 119 with 5% waste.' },
    { q: 'How many blocks are in a square foot of wall?', a: '1.125 standard 8 × 16 in blocks per square foot, or 112.5 blocks per 100 sq ft.' },
    { q: 'How many blocks does a bag of mortar lay?', a: 'Quikrete rates its 80 lb Mortar Mix at up to 13 standard 8 × 8 × 16 in blocks per bag, or up to 37 bricks.' },
    { q: 'What size is a standard concrete block?', a: 'Nominally 8 × 8 × 16 in; the actual size is 7⅝ × 7⅝ × 15⅝ in, and the ⅜-in mortar joint makes up the difference.' },
    { q: 'How many blocks are in a course?', a: 'Divide the wall length in inches by 16. A 20-ft wall has 240 ÷ 16 = 15 blocks per course.' },
    { q: 'Are cinder blocks and concrete blocks the same?', a: 'In everyday use, yes. True cinder blocks used coal cinders as aggregate and are rarely made today; modern CMUs use sand, gravel or lightweight aggregate.' },
    { q: 'How much extra block should I buy?', a: 'Add 5% for a simple straight wall and up to 10% for walls with many corners, openings or cuts.' }
  ],
  related: ['concrete-calculator', 'framing-calculator', 'square-footage-calculator', 'gravel-calculator'],
  sources: [
    { name: 'Quikrete: Mortar Mix (No. 1102) data sheet, yield per bag', url: 'https://www.quikrete.com/PDFs/DATA_SHEET-Mortar%20Mix%201102.pdf' },
    { name: 'NCMA: Concrete masonry unit shapes, sizes, properties and specifications', url: 'https://www.ncma.org/resource/concrete-masonry-unit-shapes-sizes-properties-and-specifications/' },
    { name: 'Quikrete: Building a concrete block wall', url: 'https://www.quikrete.com/athome/Video-Blockwall.asp' }
  ]
};
