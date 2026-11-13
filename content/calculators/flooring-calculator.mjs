export default {
  slug: 'flooring-calculator',
  hub: 'construction',
  name: 'Flooring Calculator',
  title: 'Flooring Calculator: 259 Sq Ft + 10% Waste = 15 Boxes',
  h1: 'Flooring Calculator: Square Feet, Waste and Boxes to Buy',
  meta: 'Add your rooms, pick a waste factor and box size, and get the boxes of laminate, vinyl plank or hardwood to buy. 259 sq ft + 10% in 20 sq ft boxes = 15 boxes.',
  keyword: 'how do you calculate square feet for flooring',
  also: ['how to calculate how much flooring i need', 'how do you calculate square footage of a floor', 'how to calculate floor square footage', 'how many boxes of laminate flooring do i need calculator', 'how many boxes of flooring do i need', 'vinyl plank flooring calculator', 'how to calculate carpet for stairs', 'how do you calculate square yards for carpet'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'rooms', label: 'Rooms to floor', type: 'rows', addLabel: '+ add room', max: 30,
      fields: [
        { id: 'name', label: 'Room (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. Den' },
        { id: 'l', label: 'Length ft', type: 'number', value: 12 },
        { id: 'w', label: 'Width ft', type: 'number', value: 10 }
      ],
      value: [
        { name: 'Living room', l: 16, w: 14 },
        { name: 'Hallway', l: 10, w: 3.5 }
      ]
    },
    { id: 'waste', label: 'Layout and waste', type: 'select', value: '10', options: [['5', '5% (large open room, straight lay)'], ['10', '10% (standard straight lay)'], ['15', '15% (diagonal or many small rooms)'], ['20', '20% (herringbone or chevron)']] },
    { id: 'box', label: 'Coverage per box', type: 'number', value: 20, suffix: 'sq ft', help: 'Printed on the carton; plank boxes are often 18–30 sq ft.' },
    { id: 'price', label: 'Price per sq ft (optional)', type: 'number', value: '', prefix: '$' }
  ],
  compute(v, H) {
    var area = 0, k = 0;
    (v.rooms || []).forEach(function (r) { if (r.l > 0 && r.w > 0) { area += r.l * r.w; k++; } });
    if (!k) return { error: 'Enter the length and width of at least one room.' };
    if (!(v.box > 0)) return { error: 'Enter the square feet per box.' };
    var w = Number(v.waste) || 0;
    var need = area * (1 + w / 100);
    var boxes = Math.ceil(need / v.box - 1e-9);
    var bought = boxes * v.box;
    var rows = [
      ['Floor area', H.num(area, 2) + ' sq ft'],
      ['With ' + w + '% waste', H.num(need, 2) + ' sq ft', true],
      ['Square feet in ' + boxes + ' boxes', H.num(bought, 2) + ' sq ft'],
      ['Spare after install (approx.)', H.num(bought - area, 2) + ' sq ft'],
      ['Carpet equivalent', H.num(need / 9, 2) + ' sq yd'],
      ['Metric', H.num(need * 0.09290304, 2) + ' m²']
    ];
    if (v.price > 0) rows.push(['Material cost (' + boxes + ' boxes)', H.money(bought * v.price), true]);
    return {
      value: boxes + (boxes === 1 ? ' box' : ' boxes'),
      label: 'Boxes to buy (' + H.num(v.box, 2) + ' sq ft each)',
      expr: H.num(area, 2) + ' sq ft × ' + H.num(1 + w / 100, 2) + ' ÷ ' + H.num(v.box, 2),
      rows: rows,
      sub: 'Boxes are rounded up. Buy them all from the same production lot so color and gloss match.'
    };
  },
  quick: ({ r }) => `To calculate flooring, multiply each room's length by width, add the rooms, then add a waste factor. A 16 × 14 ft living room (224 sq ft) plus a 10 × 3.5 ft hall (35 sq ft) is 259 sq ft; with 10% waste that's 284.9 sq ft. In 20 sq ft cartons, buy <strong>${r.value}</strong> (300 sq ft). Herringbone needs about 20% extra.`,
  stepsTitle: 'How to calculate how much flooring you need',
  steps: [
    'Measure each room wall to wall at the widest points, including closets and the floor under where the fridge and range sit. Skip areas under built-in cabinets and kitchen islands.',
    'Multiply length × width for each room and add them. Treat a hallway or closet as its own rectangle; for odd shapes, split into rectangles first.',
    'Add waste for cuts: about 10% for a standard straight lay, 15% for diagonal layouts or lots of small rooms, 20% for herringbone. Skipping waste is the most common reason people make a second trip and get a different dye lot.',
    'Divide by the square feet per box on the carton and round up to a whole box. Multiply the boxes by their coverage to see what you actually pay for.'
  ],
  formulaTitle: 'What is the formula for flooring?',
  formula: {
    expr: 'Floor area = Σ (length × width)<br>Flooring to buy = area × (1 + waste %)<br>Boxes = flooring to buy ÷ sq ft per box, rounded up',
    vars: [['Σ', 'sum over all rooms'], ['waste %', '5–20% depending on layout'], ['sq ft per box', 'coverage printed on the carton']]
  },
  example: `<p>A bedroom is 13 × 11.5 ft with a 2 × 6 ft closet, and you want vinyl plank in 23.4 sq ft boxes at $2.79/sq ft.</p>
<p>Area = 13 × 11.5 + 2 × 6 = 149.5 + 12 = <strong>161.5 sq ft</strong>. With 10% waste: 177.65 sq ft.</p>
<p>Boxes = 177.65 ÷ 23.4 = 7.59, so buy <strong>8 boxes</strong> = 187.2 sq ft. Cost = 187.2 × $2.79 = <strong>$522.29</strong>, plus underlayment, transitions and baseboard or quarter round (the <a href="/linear-feet-calculator">linear feet calculator</a> totals the trim).</p>`,
  table: {
    title: 'How many boxes of flooring does a room need?',
    intro: 'Square feet with 10% waste and the boxes needed at two common carton sizes, from the calculator.',
    head: ['Room', 'Floor area', 'With 10% waste', 'Boxes (20 sq ft)', 'Boxes (24 sq ft)'],
    rows: ({ run, H }) => [[10, 10], [10, 12], [12, 12], [12, 15], [14, 16], [15, 20], [20, 20], [20, 25], [25, 40], [40, 50]].map(([a, b]) => {
      const r20 = run({ rooms: [{ name: '', l: a, w: b }], waste: '10', box: 20, price: NaN });
      const r24 = run({ rooms: [{ name: '', l: a, w: b }], waste: '10', box: 24, price: NaN });
      return [a + ' × ' + b + ' ft', H.num(a * b, 0) + ' sq ft', r20.rows[1][1], r20.value, r24.value];
    })
  },
  sections: [
    {
      h2: 'How much extra flooring should you buy for waste?',
      html: `<p>Every row of planks ends with a cut piece, and some of those offcuts are too short to start the next row. Typical allowances used by installers:</p>
<ul><li><strong>5%:</strong> one large rectangular room, planks laid parallel to the long wall.</li><li><strong>10%:</strong> the standard figure for most homes with a few rooms, closets and doorways.</li><li><strong>15%:</strong> diagonal layouts, small rooms, many corners, or wide-plank and long-plank products with lots of offcuts.</li><li><strong>20% or more:</strong> herringbone and chevron, where every piece is cut at an angle along the edges.</li></ul>
<p>Keep at least one unopened box after the job. Planks are discontinued and dye lots drift, so a spare box is the only reliable way to repair a damaged board later. Most stores accept unopened returns, which makes rounding up low-risk.</p>`
    },
    {
      h2: 'What should you include when you measure a room for flooring?',
      html: `<p>Measure the full floor the material will cover, wall to wall, and do not deduct small things:</p>
<ul><li><strong>Include</strong> closets, alcoves, and the floor under freestanding appliances (fridge, range, washer), since those areas are floored so the appliance can be moved.</li><li><strong>Include</strong> doorways to the middle of the door, where a transition strip usually goes.</li><li><strong>Exclude</strong> floor under built-in cabinets, islands, tubs and shower bases, and fireplace hearths.</li><li><strong>Don't deduct</strong> for toilets, floor vents or posts; you cut around them and the scraps are waste anyway.</li></ul>
<p>Measuring to the nearest inch is plenty. For a room with inches, the <a href="/square-footage-calculator">square footage calculator</a> takes feet and inches separately and adds rooms with notches or angled walls.</p>`
    },
    {
      h2: 'How do you calculate flooring for stairs?',
      html: `<p>Each step needs its tread plus its riser, plus a little extra to wrap or meet the stair nose. Multiply the stair width by (tread depth + riser height). For 13 steps that are 36 in wide with 10-in treads and 7½-in risers: 36 × 17.5 = 630 sq in = 4.375 sq ft per step, so 13 steps need 56.9 sq ft before waste. Stair treads lose more to cuts than floors do, so add 15–20%, and buy stair-nose molding by the piece (one per step for plank floors). Landings are measured like a small room.</p>
<p>Carpet on stairs is cut from the roll in strips, and how much the strips waste depends on the roll width and whether the stair turns, so use the per-step figure for a budget and get the installer's measure before ordering.</p>`
    },
    {
      h2: 'How do you convert square feet to square yards for carpet?',
      html: `<p>Divide square feet by 9. The default rooms plus 10% waste are 284.9 sq ft, or 31.66 sq yd. Carpet, however, comes off rolls that are usually 12 ft wide (some 13 ft 6 in or 15 ft), so the real amount depends on the room's width and where seams fall. A room 14 ft wide needs a 12-ft width plus a 2-ft strip, and the leftover from that strip may or may not fit somewhere else. For carpet, use the calculator for a budget figure and let the installer draw the seam plan for the order.</p>`
    }
  ],
  faq: [
    { q: 'How many boxes of flooring do I need for 1,000 square feet?', a: 'With 10% waste you need 1,100 sq ft. At 20 sq ft per box that is 55 boxes; at 24 sq ft per box, 46 boxes (45.8 rounded up).' },
    { q: 'How many square feet are in a box of laminate flooring?', a: 'It varies by product, commonly about 18 to 30 sq ft. The exact coverage is printed on the carton and the product page; use that number, not an average.' },
    { q: 'How much flooring do I need for a 12x12 room?', a: 'A 12 × 12 room is 144 sq ft; with 10% waste buy 158.4 sq ft, which is 8 boxes of 20 sq ft or 7 boxes of 24 sq ft.' },
    { q: 'Should I add 10% or 15% for flooring waste?', a: 'Use 10% for a typical straight-lay install and 15% for diagonal patterns, wide planks or rooms with many corners. Herringbone needs about 20%.' },
    { q: 'Do you include closets in flooring square footage?', a: 'Yes. Closets get the same flooring as the room, so measure them as separate rectangles and add them in.' },
    { q: 'Do you put flooring under kitchen cabinets?', a: 'Usually not under built-in cabinets or islands. Floating floors in particular should not be pinned down by cabinets. Do floor under freestanding appliances.' },
    { q: 'How many square feet does a box of vinyl plank cover?', a: 'Commonly around 20 to 24 sq ft, but some boxes hold 30 sq ft or more. Check the carton before dividing.' }
  ],
  related: ['square-footage-calculator', 'tile-calculator', 'linear-feet-calculator', 'square-meters-calculator'],
  sources: [
    { name: 'National Wood Flooring Association: Resources and installation guidelines', url: 'https://www.nwfa.org/resource/' },
    { name: 'NIST: Unit conversion (area)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' }
  ]
};
