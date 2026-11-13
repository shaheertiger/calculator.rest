export default {
  slug: 'tile-calculator',
  hub: 'construction',
  name: 'Tile Calculator',
  title: 'Tile Calculator: 80 Sq Ft of 12×24 Tile = 44 Tiles (6 Boxes)',
  h1: 'Tile Calculator: Tiles and Boxes for Floors, Showers and Backsplashes',
  meta: 'Enter the area, tile size, grout joint and waste to get tiles and boxes. An 8 × 10 ft floor in 12×24 tile with ⅛" joints takes 44 tiles, or 6 boxes of 8.',
  keyword: 'how to calculate square feet for tile',
  also: ['how to calculate square footage for tile', 'how do you calculate square feet for tile', 'how to calculate how much tile you need', 'how to calculate square footage of tile needed', 'how to calculate tile square footage', 'how to calculate tiles needed', 'how much tile do i need calculator', 'how to calculate square footage for backsplash', 'how to calculate backsplash tile needed', 'how to calculate tile for shower'],
  updated: '2026-11-13',
  inputs: [
    { id: 'length', label: 'Area length', type: 'number', value: 10, suffix: 'ft' },
    { id: 'width', label: 'Area width (or wall height)', type: 'number', value: 8, suffix: 'ft' },
    { id: 'deduct', label: 'Area not tiled', type: 'number', value: 0, suffix: 'sq ft', help: 'Tub, vanity, window or cabinet footprint.' },
    { id: 'tl', label: 'Tile length', type: 'number', value: 24, suffix: 'in' },
    { id: 'tw', label: 'Tile width', type: 'number', value: 12, suffix: 'in' },
    { id: 'joint', label: 'Grout joint', type: 'select', value: '0.125', options: [['0', 'None (ignore joints)'], ['0.0625', '1/16 in'], ['0.125', '1/8 in'], ['0.1875', '3/16 in'], ['0.25', '1/4 in'], ['0.375', '3/8 in']] },
    { id: 'waste', label: 'Layout and waste', type: 'select', value: '10', options: [['5', '5% (simple, few cuts)'], ['10', '10% (straight or brick lay)'], ['15', '15% (diagonal, large format)'], ['20', '20% (herringbone, small room)']] },
    { id: 'perBox', label: 'Tiles per box', type: 'number', value: 8, help: 'Printed on the box. Leave blank to skip the box count.' },
    { id: 'boxPrice', label: 'Price per box (optional)', type: 'number', value: '', prefix: '$' }
  ],
  compute(v, H) {
    if (!(v.length > 0) || !(v.width > 0)) return { error: 'Enter the length and width of the area in feet.' };
    if (!(v.tl > 0) || !(v.tw > 0)) return { error: 'Enter the tile size in inches.' };
    var ded = v.deduct > 0 ? v.deduct : 0;
    var area = v.length * v.width - ded;
    if (!(area > 0)) return { error: 'The area not tiled is larger than the area.' };
    var j = Number(v.joint) || 0, w = Number(v.waste) || 0;
    var eff = (v.tl + j) * (v.tw + j) / 144;
    var base = area / eff;
    var tiles = Math.ceil(base * (1 + w / 100) - 1e-9);
    var rows = [
      ['Area to tile', H.num(area, 2) + ' sq ft'],
      ['Tiles before waste', H.num(base, 2)],
      ['Tile + joint covers', H.num(eff, 4) + ' sq ft each'],
      ['Tiles per sq ft', H.num(1 / eff, 3)],
      ['Square feet of tile to buy', H.num(tiles * v.tl * v.tw / 144, 2) + ' sq ft']
    ];
    var label = 'Tiles to buy (with ' + w + '% waste)';
    if (v.perBox >= 1) {
      var boxes = Math.ceil(tiles / Math.floor(v.perBox) - 1e-9);
      rows.splice(1, 0, ['Boxes of ' + Math.floor(v.perBox), String(boxes) + ' (' + boxes * Math.floor(v.perBox) + ' tiles)', true]);
      if (v.boxPrice > 0) rows.push(['Tile cost', H.money(boxes * v.boxPrice), true]);
    }
    return {
      value: H.int(tiles) + ' tiles',
      label: label,
      expr: H.num(area, 2) + ' sq ft ÷ ' + H.num(eff, 4) + ' × ' + H.num(1 + w / 100, 2),
      rows: rows,
      sub: 'Joints add to each tile\'s footprint, so wider grout lines mean slightly fewer tiles. Buy all boxes from one lot (shade/caliber).'
    };
  },
  quick: ({ r }) => `To calculate tile, find the area in square feet and divide by the area of one tile plus its grout joint. An 8 × 10 ft floor is 80 sq ft; a 12 × 24 in tile with a ⅛-inch joint covers 2.03 sq ft, so 80 ÷ 2.03 = 39.4 tiles. Add 10% for cuts and buy <strong>${r.value}</strong>, which is 6 boxes of 8.`,
  stepsTitle: 'How to calculate how much tile you need',
  steps: [
    'Measure the length and width of the floor, or the width and height of each wall, in feet. Add separate surfaces together.',
    'Subtract areas that won\'t be tiled, such as a tub, vanity or window. Don\'t subtract outlets or small vents.',
    'Work out the footprint of one tile including its grout joint: (length + joint) × (width + joint) ÷ 144. A 12 × 24 tile with a ⅛-in joint covers 12.125 × 24.125 ÷ 144 = 2.03 sq ft.',
    'Divide the area by that footprint, add waste (10% straight, 15% diagonal, 20% herringbone) and round up. Then divide by tiles per box. Ordering the exact area with no waste is the costliest mistake, because a later box may not match.'
  ],
  formulaTitle: 'What is the formula for tile?',
  formula: {
    expr: 'Tiles = area (sq ft) ÷ [(L + j) × (W + j) ÷ 144] × (1 + waste %)<br>Boxes = tiles ÷ tiles per box, rounded up',
    vars: [['L, W', 'tile length and width in inches'], ['j', 'grout joint in inches'], ['144', 'square inches per square foot'], ['waste %', '5–20% depending on layout']]
  },
  example: `<p><strong>Kitchen backsplash:</strong> 12 ft of counter with 18 in between the counter and the wall cabinets is 12 × 1.5 = 18 sq ft. In 3 × 6 in subway tile with ⅛-in joints, each tile covers 3.125 × 6.125 ÷ 144 = 0.1329 sq ft.</p>
<p>18 ÷ 0.1329 = 135.4 tiles; with 10% waste, <strong>149 tiles</strong>.</p>
<p><strong>Shower walls:</strong> a 60-in alcove with 32-in side walls, tiled 84 in high, is (60 + 32 + 32) × 84 ÷ 144 = 72.33 sq ft. In 12 × 24 tile with ⅛-in joints and 15% waste for large-format cuts: 72.33 ÷ 2.0314 × 1.15 = 40.9, so <strong>41 tiles</strong>.</p>`,
  table: {
    title: 'How many tiles per square foot for common tile sizes?',
    intro: 'Coverage for each size with a ⅛-inch joint, and tiles to buy for 100 sq ft with 10% waste, computed by the calculator.',
    head: ['Tile size', 'Sq ft per tile (no joint)', 'Tiles per sq ft (⅛" joint)', 'Tiles for 100 sq ft + 10%'],
    rows: ({ run, H }) => [[3, 6], [4, 4], [4, 12], [6, 6], [6, 24], [8, 8], [12, 12], [12, 24], [18, 18], [24, 24], [24, 48]].map(([a, b]) => {
      const r = run({ length: 10, width: 10, deduct: 0, tl: b, tw: a, joint: '0.125', waste: '10', perBox: NaN, boxPrice: NaN });
      return [a + ' × ' + b + ' in', H.num(a * b / 144, 3), r.rows.find(x => x[0] === 'Tiles per sq ft')[1], r.value];
    }),
    note: 'Mosaic sheets are sold by the sheet (usually about 1 sq ft each); calculate them by area, not by individual tiles.'
  },
  sections: [
    {
      h2: 'How do you calculate square footage for a backsplash?',
      html: `<p>A backsplash is a wall area: the length of each run times the height you're tiling. The usual gap between counter and wall cabinets is 18 in, so each foot of counter adds 1.5 sq ft. Measure each section separately (beside the window, behind the range, the side return) and add them. Behind a range, many people tile up to the hood, which can add 6–12 in of height there.</p>
<p>Subtract windows, but not outlets and switches; you cut around those and the scraps become waste. Small subway or mosaic tiles produce more cuts at outlets and edges, so 10–15% waste is sensible for a backsplash even though it is a simple shape.</p>`
    },
    {
      h2: 'How do you calculate tile for a shower?',
      html: `<p>Add the area of each wall: width × tiled height. A standard 60-in tub or alcove has a 60-in back wall and two side walls equal to the tub depth, about 30–32 in. Tiling to 84 in (7 ft) is common; to the ceiling is another option. Then do the floor separately if it is a tiled shower pan, usually in smaller tile (2 × 2 in mosaic) so it can slope to the drain.</p>
<p>Add trim pieces by the linear foot: bullnose or metal edge along exposed edges, and a niche or bench counted as extra surface (each inside face of a niche is tiled). Use 15% waste for large-format wall tile because cuts around the valve and niche are big pieces.</p>`
    },
    {
      h2: 'How much extra tile should you order?',
      html: `<p>Order 10% extra for a straight or brick-pattern layout and 15% for diagonal layouts and large-format tile (any side 15 in or longer), where each cut leaves a large unusable offcut. Herringbone and small rooms with many corners can need 20%. Tile is made in batches whose shade and size (caliber) can differ, so buy everything at once from one lot number and keep a spare box or two for future repairs.</p>
<p>For running-bond (brick) layouts with tiles longer than 18 in, industry guidance in ANSI A108.02 recommends an offset of no more than one-third of the tile length to limit lippage from tile warpage. Plan that pattern before ordering because it changes how offcuts can be reused.</p>`
    },
    {
      h2: 'Does grout joint width change how many tiles you need?',
      html: `<p>Slightly. The joint adds to each tile's footprint, so a wider joint means fewer tiles. For 12 × 12 tile, a ⅛-in joint makes each tile cover 1.021 sq ft instead of 1.0; a ¼-in joint makes it 1.042. On 100 sq ft that is about 2 tiles fewer per step of joint width. For small tiles the effect is much bigger: 3 × 6 subway tile with ⅛-in joints covers about 6% more area per tile than the bare tile. Rectified tile can use joints as narrow as 1/16–⅛ in; handmade or uneven tile needs wider joints. Grout quantity depends on joint width, tile thickness and tile size; use the grout manufacturer's coverage chart for the bag count.</p>`
    }
  ],
  faq: [
    { q: 'How many 12x24 tiles do I need for 100 square feet?', a: 'A 12 × 24 tile covers 2 sq ft, so 100 sq ft needs 50 tiles bare, or about 49.2 allowing ⅛-in joints. With 10% waste, buy 55 tiles.' },
    { q: 'How many 12x12 tiles are in a square foot?', a: 'One, ignoring joints. With ⅛-in grout joints each tile covers 1.021 sq ft, so 100 sq ft needs about 98 tiles before waste (108 with 10%).' },
    { q: 'How do I calculate square feet for tile in a room?', a: 'Multiply the room length by the width in feet, subtract areas under cabinets or tubs, then add 10% for cuts. A 10 × 12 ft room is 120 sq ft, so buy 132 sq ft of tile.' },
    { q: 'How many square feet of tile for a backsplash?', a: 'Multiply the length of counter by the height you tile. 15 ft of counter at 18 in high is 22.5 sq ft; buy about 25 sq ft with 10% waste.' },
    { q: 'How much tile do I need for a 5x8 bathroom floor?', a: 'A 5 × 8 ft floor is 40 sq ft. In 12 × 12 tile with ⅛-in joints and 10% waste, about 44 tiles; subtract the toilet only if you are not tiling under it.' },
    { q: 'Should I subtract the toilet or vanity from tile square footage?', a: 'Subtract a built-in vanity or tub that sits on the subfloor. Don\'t subtract the toilet; tile normally runs under it.' },
    { q: 'How much tile waste should I plan for large-format tile?', a: 'Plan about 15% for large-format tiles (15 inches or longer on a side), since each cut leaves a large offcut that often can\'t be reused.' }
  ],
  related: ['flooring-calculator', 'square-footage-calculator', 'square-meters-calculator', 'countertop-square-footage-calculator'],
  sources: [
    { name: 'Tile Council of North America (TCNA): TCNA Handbook and ANSI A108 installation standards', url: 'https://www.tcnatile.com/' },
    { name: 'NIST: Unit conversion (area)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' }
  ]
};
