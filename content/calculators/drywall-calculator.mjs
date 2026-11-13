export default {
  slug: 'drywall-calculator',
  hub: 'construction',
  name: 'Drywall Calculator',
  title: 'Drywall Calculator: a 12×14 Room Takes 19 Sheets of 4×8',
  h1: 'Drywall Calculator: Sheets, Joint Compound, Tape and Screws',
  meta: 'Walls and ceiling of a 12 × 14 ft room with 8-ft ceilings come to 533 sq ft of drywall: 19 sheets of 4×8 with 10% waste. Get mud, tape and screws too.',
  keyword: 'how to calculate drywall',
  also: ['how to calculate sheetrock needed', 'how to calculate drywall square footage', 'how to calculate sheetrock square footage', 'drywall calculator', 'how many sheets of drywall do i need'],
  updated: '2026-11-13',
  inputs: [
    { id: 'len', label: 'Room length', type: 'number', value: 14, suffix: 'ft' },
    { id: 'wid', label: 'Room width', type: 'number', value: 12, suffix: 'ft' },
    { id: 'height', label: 'Wall height', type: 'number', value: 8, suffix: 'ft' },
    { id: 'ceiling', label: 'Include the ceiling', type: 'checkbox', value: true },
    { id: 'sheet', label: 'Sheet size', type: 'select', value: '32', options: [['32', '4 × 8 ft (32 sq ft)'], ['40', '4 × 10 ft (40 sq ft)'], ['48', '4 × 12 ft (48 sq ft)']] },
    { id: 'doors', label: 'Doors', type: 'number', value: 1, help: 'Deducts 21 sq ft each (3 × 7 ft).' },
    { id: 'windows', label: 'Windows', type: 'number', value: 2, help: 'Deducts 15 sq ft each (3 × 5 ft).' },
    { id: 'waste', label: 'Waste allowance', type: 'number', value: 10, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.len > 0) || !(v.wid > 0) || !(v.height > 0)) return { error: 'Enter the room length, width and wall height.' };
    var doors = v.doors > 0 ? Math.floor(v.doors) : 0, wins = v.windows > 0 ? Math.floor(v.windows) : 0;
    var waste = v.waste >= 0 ? v.waste : 0;
    var sheet = Number(v.sheet);
    var gross = 2 * (v.len + v.wid) * v.height;
    var open = doors * 21 + wins * 15;
    var walls = Math.max(0, gross - open);
    var ceil = v.ceiling ? v.len * v.wid : 0;
    var total = walls + ceil;
    if (!(total > 0)) return { error: 'The openings are larger than the walls. Check the door and window counts.' };
    var sheets = Math.ceil(total * (1 + waste / 100) / sheet - 1e-9);
    var wallSheets = Math.ceil(walls * (1 + waste / 100) / sheet - 1e-9);
    var mud = total * 11 / 1000;
    var tape = total * 370 / 1000;
    var screws = Math.ceil((walls * 0.875 + ceil * 1.125) * (1 + waste / 100) / 10 - 1e-9) * 10;
    var label = sheet === 32 ? '4×8' : sheet === 40 ? '4×10' : '4×12';
    var rows = [
      ['Wall area after openings', H.int(walls) + ' sq ft'],
      ['Ceiling area', H.int(ceil) + ' sq ft'],
      ['Total drywall area', H.int(total) + ' sq ft', true],
      [label + ' sheets for walls only', String(wallSheets)],
      ['Ready-mixed joint compound', H.fix(mud, 1) + ' gal (' + Math.ceil(mud / 4.5 - 1e-9) + ' × 4.5-gal pail)'],
      ['Paper joint tape', H.int(tape) + ' ft (' + Math.ceil(tape / 250 - 1e-9) + ' × 250-ft roll)'],
      ['Drywall screws', 'about ' + H.int(screws)]
    ];
    return {
      value: sheets + ' sheets',
      label: label + ' drywall sheets with ' + H.num(waste, 1) + '% waste',
      expr: H.int(total) + ' sq ft × ' + H.fix(1 + waste / 100, 2) + ' ÷ ' + sheet + ' sq ft',
      rows: rows,
      sub: 'That is ' + H.int(sheets * sheet) + ' sq ft of board for ' + H.int(total) + ' sq ft of surface. Hang the ceiling first so the wall sheets hold up its edges.'
    };
  },
  quick: ({ r }) => `To calculate drywall, add up the wall area (perimeter × height), subtract doors and windows, add the ceiling, then divide by the sheet size with 10% waste. A 12 × 14 ft room with 8-ft walls, one door and two windows has 365 sq ft of walls plus a 168 sq ft ceiling: 533 sq ft, or <strong>${r.value} of 4×8</strong> drywall.`,
  stepsTitle: 'How to calculate how much drywall you need',
  steps: [
    'Measure the room perimeter and multiply by the wall height. For a 12 × 14 ft room with 8-ft walls: 2 × (12 + 14) × 8 = 416 sq ft.',
    'Subtract openings: about 21 sq ft for a standard door and 15 sq ft for an average window. Don\'t subtract small openings like outlets or a pass-through under 10 sq ft; the offcuts rarely fit elsewhere.',
    'Add the ceiling (length × width) if you are covering it.',
    'Multiply by 1.10 for waste and divide by the sheet area: 32 sq ft for 4×8, 40 for 4×10, 48 for 4×12. Round up to whole sheets.',
    'Order joint compound, tape and screws from the same total area: about 11 gallons of ready-mixed compound and 370 ft of tape per 1,000 sq ft.'
  ],
  formulaTitle: 'What is the drywall formula?',
  formula: {
    expr: 'Area = 2 × (L + W) × H − openings + (L × W if ceiling)<br>Sheets = Area × (1 + waste) ÷ sheet area, rounded up',
    vars: [['L, W', 'room length and width, ft'], ['H', 'wall height, ft'], ['openings', '21 sq ft per door, 15 sq ft per window'], ['sheet area', '32, 40 or 48 sq ft']],
    note: 'Finishing materials scale with area: compound ≈ 11 gal per 1,000 sq ft (three coats, ready-mixed), tape ≈ 370 ft per 1,000 sq ft, screws ≈ 0.9 per sq ft on walls and 1.1 per sq ft on ceilings.'
  },
  example: `<p>A 12 × 14 ft bedroom with 8-ft walls, one door and two windows, walls and ceiling.</p>
<p>Walls: 2 × (12 + 14) × 8 = 416 sq ft. Openings: 21 + 2 × 15 = 51 sq ft. Net walls: <strong>365 sq ft</strong>. Ceiling: 12 × 14 = <strong>168 sq ft</strong>. Total: <strong>533 sq ft</strong>.</p>
<p>With 10% waste: 586 sq ft ÷ 32 = 18.3, so buy <strong>19 sheets of 4×8</strong> (or 13 sheets of 4×12: 586 ÷ 48 = 12.2).</p>
<p>Finishing: 533 × 11 ÷ 1,000 = 5.9 gal of compound (two 4.5-gal pails), 197 ft of tape (one 250-ft roll) and about 560 screws.</p>`,
  table: {
    title: 'How many sheets of drywall do I need for a 10×10, 12×12 or 12×14 room?',
    intro: 'Walls and ceiling with 8-ft walls, one door, two windows and 10% waste, worked out by the calculator above.',
    head: ['Room', 'Drywall area', '4×8 sheets', '4×12 sheets', 'Walls only (4×8)'],
    rows: ({ run }) => [[10, 10], [10, 12], [12, 12], [12, 14], [12, 16], [14, 16], [15, 20], [16, 20], [20, 20], [20, 24]].map(([w, l]) => {
      const a = run({ wid: w, len: l, height: 8, ceiling: true, doors: 1, windows: 2, waste: 10, sheet: '32' });
      const b = run({ wid: w, len: l, height: 8, ceiling: true, doors: 1, windows: 2, waste: 10, sheet: '48' });
      return [w + ' × ' + l + ' ft', a.rows[2][1], a.value.replace(' sheets', ''), b.value.replace(' sheets', ''), a.rows[3][1]];
    }),
    note: 'For 9-ft walls, 4×9 or 54-in-wide sheets avoid a thin strip at the floor; for 10-ft walls, hang 4×10 or 4×12 sheets horizontally.'
  },
  sections: [
    {
      h2: 'What size drywall sheets should you buy?',
      html: `<p>Bigger sheets mean fewer butt joints, and butt joints (the unrecessed short ends) are the hardest seams to finish flat. Common choices:</p>
<ul><li><strong>4 × 8 ft:</strong> roughly 40–55 lb in 1/2-in board (lightweight to regular), easy for one person and the only size that fits in most SUVs and small trucks.</li><li><strong>4 × 12 ft:</strong> covers a 12-ft wall with no butt joint when hung horizontally; it needs two people and good access.</li><li><strong>4 × 10 ft and 54-in-wide sheets:</strong> for 9- and 10-ft walls, so two rows reach the ceiling without a filler strip.</li></ul>
<p>Hanging sheets horizontally (long edge across the studs) is standard on walls up to 8 ft 1 in: two rows of 48-in sheets cover 96 in, and the seam lands at a comfortable working height.</p>`
    },
    {
      h2: 'What thickness of drywall do you need?',
      html: `<p><strong>1/2 in</strong> is standard for walls in houses. On ceilings, use 1/2-in sag-resistant board or 5/8 in, especially with framing 24 in on center or a heavy textured finish. The IRC also sets fire-separation rules for attached garages (Section R302.6): at least 1/2-in gypsum board on the garage side, and <strong>5/8-in Type X</strong> on garage ceilings with living space above.</p>
<p>Use moisture- and mold-resistant board behind bath vanities and in laundry rooms, and cement board or a tile backer system, not regular drywall, inside showers.</p>`
    },
    {
      h2: 'How much joint compound and tape do you need?',
      html: `<p>For a standard three-coat finish (tape coat, fill coat, finish coat), plan on roughly <strong>11 gallons of ready-mixed compound per 1,000 sq ft</strong> of drywall and about <strong>370 ft of paper tape per 1,000 sq ft</strong>. USG's literature gives 9.4 gallons of lightweight compound for the same area, so 11 gallons leaves room for corner bead, patching and sanding losses.</p>
<p>Inside corners use the same paper tape folded down its crease; outside corners need metal or paper-faced corner bead, priced per 8- or 10-ft stick. Count each outside corner separately: a room with a bulkhead or window returns can easily need six to ten pieces.</p>`
    },
    {
      h2: 'How many screws does a sheet of drywall take?',
      html: `<p>Building codes and the Gypsum Association's application standard space screws about <strong>16 in apart on walls</strong> and <strong>12 in apart on ceilings</strong> when framing is 16 in on center. That works out to roughly 28 screws per 4×8 sheet on a wall and 36 on a ceiling, or about one screw per square foot overall. Use 1-1/4-in coarse-thread screws for 1/2-in board on wood studs and fine-thread screws for steel studs.</p>
<p>Drive screws so the head dimples the paper without tearing it; a drywall screw gun or a dimpler bit sets the depth automatically.</p>`
    }
  ],
  faq: [
    { q: 'How many sheets of drywall do I need for a 12x12 room?', a: 'A 12 × 12 ft room with 8-ft walls needs 17 sheets of 4×8 drywall for walls and ceiling, including one door, two windows and 10% waste. Walls alone take 12 sheets.' },
    { q: 'How do you calculate drywall square footage?', a: 'Multiply the room perimeter by the wall height, subtract doors (21 sq ft) and windows (15 sq ft), and add length × width for the ceiling. A 12 × 14 room with 8-ft walls, one door and two windows is 365 + 168 = 533 sq ft.' },
    { q: 'How many square feet is a sheet of drywall?', a: 'A 4×8 sheet covers 32 sq ft, a 4×10 covers 40 sq ft and a 4×12 covers 48 sq ft. Divide the room area by these numbers to get the sheet count.' },
    { q: 'Should I subtract windows and doors when calculating drywall?', a: 'Subtract doors and large windows, but not small openings. The pieces cut out around a window are usually too small to reuse, which is one reason to keep a 10% waste allowance.' },
    { q: 'How much drywall do I need for a 2,000 sq ft house?', a: 'Walls and ceilings of a single-story house typically come to roughly 3.5 to 4 times the floor area, so a 2,000 sq ft house needs roughly 7,000 to 8,000 sq ft of drywall, or 220 to 250 sheets of 4×8 before waste. Measure room by room for an order.' },
    { q: 'How much does it cost to drywall a room?', a: 'Multiply the sheet count by your local price per sheet, then add the compound pails, tape rolls, screws and corner bead from the results above. Contractors usually price hanging and finishing labor per square foot of board, so get quotes on the board area, not the room\'s floor area.' },
    { q: 'Do you drywall the ceiling or walls first?', a: 'Ceiling first. The wall sheets then butt up under the ceiling board and help support its edges, and the joint at the corner is easier to tape.' }
  ],
  related: ['square-footage-calculator', 'framing-calculator', 'wallpaper-calculator', 'flooring-calculator', 'roofing-calculator'],
  sources: [
    { name: 'ICC: 2021 International Residential Code, Section R702.3 Gypsum board and R302.6 garage separation', url: 'https://codes.iccsafe.org/content/IRC2021P2' },
    { name: 'Gypsum Association: GA-216 Application and Finishing of Gypsum Panel Products', url: 'https://www.gypsum.org/' },
    { name: 'Fine Homebuilding: Joint compound guide (coverage per 1,000 sq ft)', url: 'https://www.finehomebuilding.com/project-guides/drywall/joint-compound' },
    { name: 'USG: Sheetrock joint compounds and tape', url: 'https://www.usg.com/' }
  ]
};
