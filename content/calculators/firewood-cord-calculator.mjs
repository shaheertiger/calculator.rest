export default {
  slug: 'firewood-cord-calculator',
  hub: 'construction',
  name: 'Firewood Cord Calculator',
  title: 'Firewood Cord Calculator: a 16×4 ft Stack Is 0.67 Cord',
  h1: 'Cord of Wood Calculator: Full Cords, Face Cords and Price per Cord',
  meta: 'A cord is 128 cu ft of stacked wood (4 × 4 × 8 ft). A 16-ft × 4-ft stack of 16-in logs is 85.3 cu ft: 0.67 cord, or two face cords. Measure any woodpile.',
  keyword: 'how to calculate a cord of wood',
  also: ['how do you calculate a cord of wood', 'how to calculate a cord of firewood', 'how to calculate cords of wood', 'how much firewood do i need calculator', 'how much wood do i need calculator', 'face cord calculator', 'firewood calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'len', label: 'Stack length', type: 'number', value: 16, suffix: 'ft' },
    { id: 'height', label: 'Stack height', type: 'number', value: 4, suffix: 'ft' },
    { id: 'piece', label: 'Piece (log) length', type: 'number', value: 16, suffix: 'in', help: 'The depth of the stack front to back.' },
    { id: 'rows', label: 'Rows side by side', type: 'number', value: 1 },
    { id: 'price', label: 'Price for this stack', type: 'number', value: '', prefix: '$', placeholder: 'optional' }
  ],
  compute(v, H) {
    if (!(v.len > 0) || !(v.height > 0) || !(v.piece > 0)) return { error: 'Enter the stack length, height and piece length.' };
    var rows = v.rows >= 1 ? Math.floor(v.rows) : 1;
    var depth = v.piece / 12 * rows;
    var cf = v.len * v.height * depth;
    var cords = cf / 128;
    var face = v.len * v.height * rows / 32;
    var out = [
      ['Cubic feet', H.num(cf, 1), true],
      ['Face cords (4 × 8 ft face, ' + H.num(v.piece, 1) + '-in pieces)', H.num(face, 2)],
      ['One face cord equals', H.num(v.piece / 48, 3) + ' cord'],
      ['Stack length for 1 full cord at this height', H.num(128 / (v.height * depth), 1) + ' ft']
    ];
    if (v.price > 0) out.splice(1, 0, ['Price per full cord', H.money(v.price / cords), true]);
    return {
      value: H.fix(cords, 2) + ' cord',
      label: 'Full cords of firewood',
      expr: H.num(v.len, 2) + ' × ' + H.num(v.height, 2) + ' × ' + H.num(depth, 3) + ' ft ÷ 128',
      rows: out,
      sub: cords >= 0.98 && cords <= 1.02 ? 'That is a full legal cord.' : 'A full cord is 128 cu ft; this stack is ' + H.pct(cords * 100, 0) + ' of one.'
    };
  },
  quick: ({ r }) => `A cord of wood is 128 cubic feet of tightly stacked firewood, such as a pile 4 ft high, 4 ft deep and 8 ft long. To calculate cords, multiply length × height × depth in feet and divide by 128. A stack 16 ft long and 4 ft high of 16-in logs is 16 × 4 × 1.333 = 85.3 cu ft, or <strong>${r.value}</strong>: two face cords.`,
  stepsTitle: 'How to calculate a cord of wood',
  steps: [
    'Stack the wood tightly in rows, pieces parallel and touching, with as few gaps as possible. A loose, thrown pile can\'t be measured fairly; restack it first.',
    'Measure the stack length and the average height in feet, and the piece length (stack depth) in inches.',
    'Convert the depth to feet: 16-in pieces are 1.333 ft, 24-in pieces are 2 ft. Mixing up the piece length with the stack depth of several rows is the common slip: multiply by the number of rows.',
    'Multiply length × height × depth for cubic feet, then divide by 128 for cords.',
    'Divide the price by the cords to compare quotes on a per-full-cord basis.'
  ],
  formulaTitle: 'What is the formula for a cord of wood?',
  formula: {
    expr: 'Cords = Length (ft) × Height (ft) × Depth (ft) ÷ 128<br>Face cords = Length × Height ÷ 32 &nbsp; (one 4 × 8 ft face, any piece length)<br>Price per cord = Price ÷ Cords',
    vars: [['Depth', 'piece length × number of rows, ft'], ['128', 'cubic feet in a cord (4 × 4 × 8)'], ['32', 'square feet in a 4 × 8 ft face']]
  },
  example: `<p>A seller delivers a single row of 16-in split oak, stacked 16 ft long and 4 ft high, for $330.</p>
<p>Volume: 16 × 4 × 1.333 = <strong>85.3 cu ft</strong>. Cords: 85.3 ÷ 128 = <strong>0.67 cord</strong>, which is two face cords of 16-in wood.</p>
<p>Price per full cord: $330 ÷ 0.667 = <strong>$495</strong>. If the ad promised "a cord" for $330, you received two-thirds of what the law calls a cord.</p>`,
  table: {
    title: 'How many cords are in common stack sizes?',
    intro: 'Stacked, single-row unless noted, calculated with length × height × depth ÷ 128.',
    head: ['Stack (L × H)', 'Piece length', 'Cubic feet', 'Cords'],
    rows: ({ run }) => [[8, 4, 16, 1], [8, 4, 24, 1], [8, 4, 16, 3], [8, 4, 24, 2], [12, 4, 16, 1], [16, 4, 16, 1], [16, 4, 24, 1], [20, 4, 16, 1], [24, 4, 16, 1], [8, 6, 16, 1], [10, 5, 18, 1], [32, 4, 16, 1]].map(([l, h, p, n]) => { const r = run({ len: l, height: h, piece: p, rows: n, price: NaN }); return [l + ' × ' + h + ' ft' + (n > 1 ? ', ' + n + ' rows' : ''), p + ' in', r.rows[0][1], r.value.replace(' cord', '')]; }),
    note: 'Three rows of 16-in wood, or two rows of 24-in wood, in a 4 × 8 ft face make a full cord.'
  },
  sections: [
    {
      h2: 'What is the difference between a cord and a face cord?',
      html: `<p>A <strong>full cord</strong> is a legal unit: 128 cubic feet of wood "ranked and well stowed," usually pictured as 4 × 4 × 8 ft. A <strong>face cord</strong> (also called a rick, rank or stove cord in some regions) is one 4 × 8 ft face of wood that is only one piece deep, so its volume depends on how long the pieces are:</p>
<ul><li>12-in pieces: 32 cu ft, 1/4 cord.</li><li>16-in pieces: 42.7 cu ft, 1/3 cord.</li><li>24-in pieces: 64 cu ft, 1/2 cord.</li></ul>
<p>NIST's firewood guidance notes that terms like "face cord," "rack," "pile" and "truckload" have no legally defined meaning, and that wood can only be sold by the cord or fractions of a cord. If a seller quotes in face cords, ask for the dimensions and convert.</p>`
    },
    {
      h2: 'How much firewood do I need for a winter?',
      html: `<p>It depends far more on your stove, house and climate than on any rule, so base it on your own burn rate. Track how long one measured stack lasts in steady cold weather, then scale it to your season. For example, if one face cord of 16-in wood (1/3 cord) lasts three weeks and you heat for 24 weeks, you need 8 face cords, or <strong>2.7 full cords</strong>. Supplemental burning a few evenings a week often uses well under a cord; heating a whole house with wood in a cold climate commonly takes several.</p>
<p>Buy seasoned wood or buy a season ahead. Freshly cut wood holds a lot of water and burns poorly until it has dried, typically for six months or more after splitting.</p>`
    },
    {
      h2: 'How much wood fits in a pickup truck?',
      html: `<p>Measure the bed and run it through the calculator. A full-size long bed about 8 ft long and 5 ft wide, stacked level with 20-in sides, holds 8 × 5 × 1.67 = 66.7 cu ft, roughly <strong>half a cord</strong>. A short bed (about 6.5 ft) holds about 0.4 cord stacked. Thrown in loose, the same bed holds noticeably less wood, which is why NIST advises against buying by the "truckload."</p>`
    }
  ],
  faq: [
    { q: 'How many cubic feet are in a cord of wood?', a: 'A cord is 128 cubic feet of stacked wood, for example 4 ft high × 4 ft deep × 8 ft long, or 2 ft deep × 4 ft high × 16 ft long.' },
    { q: 'How many face cords are in a full cord?', a: 'With 16-in logs, three face cords make a full cord. With 24-in logs it takes two, and with 12-in logs it takes four.' },
    { q: 'What is half a cord of wood?', a: 'Half a cord is 64 cubic feet, such as a stack 4 ft high, 8 ft long and 2 ft deep, or 16-in wood stacked 4 ft high and 12 ft long.' },
    { q: 'How do I measure a cord of wood that is not stacked?', a: 'Stack it first. Loose wood has large air gaps, and there is no fair way to measure it. The NIST guidance is to stack the wood neatly, then multiply width × height × length; 128 cubic feet is a cord.' },
    { q: 'How many logs are in a cord of wood?', a: 'Roughly 600 to 800 split pieces for 16-in firewood, but it varies a lot with how thick the splits are. Volume, not piece count, is the legal measure.' },
    { q: 'How tall is a cord of wood stacked 8 feet long?', a: 'With 4-ft pieces it is 4 ft tall. With typical 16-in firewood, a full cord stacked 8 ft long would need three rows 4 ft high, or one row 12 ft high; in practice it is stacked 4 ft high and 24 ft long.' },
    { q: 'What should I do if I got less than a cord?', a: 'Stack and measure the wood before burning any, photograph the stack next to a tape measure, and contact the seller. If that fails, contact your state weights and measures office.' }
  ],
  related: ['cubic-feet-calculator', 'board-foot-calculator', 'cubic-yards-calculator', 'mulch-calculator'],
  sources: [
    { name: 'NIST: Avoid Getting Burned When Buying Firewood (cord = 128 cu ft)', url: 'https://www.nist.gov/system/files/documents/pml/wmd/ncwm-firewood-facts.pdf' },
    { name: 'NIST Office of Weights and Measures: Handbook 130 (uniform method of sale)', url: 'https://www.nist.gov/pml/owm/owm-products-and-services/publications-and-documentary-standards/handbooks' }
  ]
};
