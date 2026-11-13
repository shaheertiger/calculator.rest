export default {
  slug: 'yarn-calculator',
  hub: 'construction',
  name: 'Yarn Calculator',
  title: 'Yarn Calculator: 50×60 Worsted Blanket Needs 2,063 Yards',
  h1: 'Blanket Yarn Calculator: Yards and Skeins by Size and Yarn Weight',
  meta: 'A 50 × 60 in knitted throw in worsted (#4) yarn takes about 2,063 yards with a 10% margin: 11 skeins of 200 yd. Crochet uses about 30% more.',
  keyword: 'how much yarn do i need for a blanket calculator',
  also: ['how much yarn do i need calculator', 'how much yarn do i need crochet calculator', 'how many granny squares to make a blanket calculator', 'blanket yarn calculator', 'how many skeins of yarn for a blanket', 'yarn yardage calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'width', label: 'Blanket width', type: 'number', value: 50, suffix: 'in' },
    { id: 'length', label: 'Blanket length', type: 'number', value: 60, suffix: 'in' },
    { id: 'weight', label: 'Yarn weight (CYC)', type: 'select', value: '4', options: [['1', '1 Super fine (fingering, sock)'], ['2', '2 Fine (sport)'], ['3', '3 Light (DK)'], ['4', '4 Medium (worsted, aran)'], ['5', '5 Bulky (chunky)'], ['6', '6 Super bulky'], ['7', '7 Jumbo']] },
    { id: 'craft', label: 'Craft', type: 'select', value: 'knit', options: [['knit', 'Knitting'], ['crochet', 'Crochet']] },
    { id: 'skein', label: 'Yards per skein', type: 'number', value: 200, suffix: 'yd', help: 'From the yarn label.' },
    { id: 'margin', label: 'Extra margin', type: 'number', value: 10, suffix: '%', help: 'For swatching, tails, borders and dye-lot safety.' }
  ],
  data: {
    gauge: { '1': 29.5, '2': 24.5, '3': 22.5, '4': 18, '5': 13.5, '6': 9, '7': 5 },
    names: { '1': 'super fine', '2': 'fine', '3': 'DK', '4': 'worsted', '5': 'bulky', '6': 'super bulky', '7': 'jumbo' }
  },
  compute(v, H, D) {
    if (!(v.width > 0) || !(v.length > 0)) return { error: 'Enter the blanket width and length in inches.' };
    if (!(v.skein > 0)) return { error: 'Enter the yards per skein from the label.' };
    var g = D.gauge[v.weight] || 18;
    var spi = g / 4;
    var rate = spi * 5 / 36 * (v.craft === 'crochet' ? 1.3 : 1);
    var area = v.width * v.length;
    var base = area * rate;
    var m = v.margin >= 0 ? v.margin / 100 : 0;
    var yd = base * (1 + m);
    var skeins = Math.ceil(yd / v.skein - 1e-9);
    return {
      value: H.int(yd) + ' yd',
      label: 'Yarn for a ' + H.num(v.width, 1) + ' × ' + H.num(v.length, 1) + ' in ' + (v.craft === 'crochet' ? 'crocheted' : 'knitted') + ' blanket in ' + (D.names[v.weight] || 'worsted'),
      expr: H.int(area) + ' sq in × ' + H.fix(rate, 3) + ' yd/sq in × ' + H.fix(1 + m, 2),
      rows: [
        ['Skeins to buy', skeins + ' × ' + H.num(v.skein, 0) + ' yd', true],
        ['Estimate before margin', H.int(base) + ' yd'],
        ['Meters', H.int(yd * 0.9144) + ' m'],
        ['Yards per square inch', H.fix(rate, 3)],
        ['Gauge assumed (4 in, stockinette)', H.num(g, 1) + ' sts']
      ],
      sub: 'Buy all ' + skeins + ' skeins from one dye lot. Cables, bobbles, brioche and dense textured stitches use noticeably more.'
    };
  },
  quick: ({ r }) => `A 50 × 60 in throw knitted in worsted-weight (#4) yarn takes about 1,875 yards, or <strong>${r.value}</strong> with a 10% margin: <strong>11 skeins</strong> of 200 yd. Bulky yarn cuts that to about 1,550 yd; DK raises it to about 2,580. Crochet uses roughly 30% more yarn than knitting, about 2,680 yd for the same worsted throw.`,
  stepsTitle: 'How to work out how much yarn a blanket needs',
  steps: [
    'Choose the finished size in inches. Common sizes are about 30 × 36 in for a baby blanket, 50 × 60 in for a throw and 66 × 90 in for a twin bed.',
    'Find your yarn\'s weight category on the label (the Craft Yarn Council number 1–7). Heavier yarn covers more area per yard.',
    'Multiply width × length for square inches, then by the yards per square inch for your yarn weight and craft (0.625 for knitted worsted).',
    'Add 10% or more for borders, fringe, tails and swatching. Skipping the margin is the classic mistake; running out mid-blanket often means a dye-lot mismatch.',
    'Divide by the yards per skein and round up.'
  ],
  formulaTitle: 'How is the yarn estimate calculated?',
  formula: {
    expr: 'Yards = W × L × (stitches per inch × 5 ÷ 36) × craft factor × (1 + margin)<br>Skeins = Yards ÷ yards per skein, rounded up',
    vars: [['W, L', 'blanket width and length, in'], ['stitches per inch', 'middle of the CYC stockinette gauge range for the yarn weight (worsted: 18 sts per 4 in = 4.5)'], ['5 ÷ 36', 'about 5 in of yarn per sq in for each stitch per inch, in yards'], ['craft factor', '1.0 knitting, 1.3 crochet']],
    note: 'In knitted fabric, the yarn in each loop is proportional to the stitch size, so a square inch of stockinette holds about 5 in of yarn for every stitch per inch of gauge (from the loop-length geometry of plain knitting). At worsted gauge that is 22.5 in, or 0.625 yd per square inch, which agrees with typical pattern yardages. Treat it as an estimate and check your pattern.'
  },
  example: `<p>A knitter plans a 50 × 60 in throw in worsted yarn sold in 200-yd skeins.</p>
<p>Area: 50 × 60 = <strong>3,000 sq in</strong>. Worsted gauge is 16–20 stitches per 4 in (CYC), about 4.5 per inch, so the rate is 4.5 × 5 ÷ 36 = <strong>0.625 yd per sq in</strong>.</p>
<p>Yarn: 3,000 × 0.625 = 1,875 yd, plus 10% = <strong>2,063 yd</strong>. Skeins: 2,063 ÷ 200 = 10.3, so buy <strong>11 skeins</strong>.</p>
<p>Crocheted in the same yarn: 1,875 × 1.3 × 1.1 = 2,681 yd, or 14 skeins.</p>`,
  table: {
    title: 'How much yarn do I need for a baby, throw, twin or queen blanket?',
    intro: 'Knitted yardage including a 10% margin, worked out by the calculator for common blanket sizes. Multiply by 1.3 for crochet.',
    head: ['Blanket', 'DK (#3)', 'Worsted (#4)', 'Bulky (#5)', 'Super bulky (#6)'],
    rows: ({ run }) => [['Lovey', 12, 12], ['Baby', 30, 36], ['Crib', 36, 52], ['Lap', 36, 48], ['Throw', 50, 60], ['Twin', 66, 90], ['Full', 80, 90], ['Queen', 90, 90], ['King', 108, 90]].map(([n, w, l]) => [n + ' (' + w + ' × ' + l + ' in)', ...['3', '4', '5', '6'].map(k => run({ width: w, length: l, weight: k, craft: 'knit', margin: 10 }).value)]),
    note: 'There is no official standard for blanket sizes; these are common conventions. Bed-size blankets are often sized to drape over the sides, so measure your mattress and add the drop you want.'
  },
  sections: [
    {
      h2: 'Does crochet use more yarn than knitting?',
      html: `<p>Yes. Crochet stitches are taller and built from more wraps of yarn, so crocheted fabric is denser and typically uses roughly 25–35% more yarn than knitting the same area at a comparable gauge. The calculator uses 30%. Single crochet and dense textured stitches can use more; open lace and mesh stitches such as granny squares or filet use less.</p>
<p>The same applies within knitting: garter stitch, seed stitch and especially cables or brioche use more yarn than plain stockinette. If your pattern lists yardage, trust it over any general estimate.</p>`
    },
    {
      h2: 'What do yarn weight numbers mean?',
      html: `<p>The Craft Yarn Council's Standard Yarn Weight System groups yarn by thickness from 0 (lace) to 7 (jumbo). The calculator uses the middle of each category's standard knitting gauge over 4 in of stockinette:</p>
<ul><li><strong>1 Super fine</strong> (sock, fingering): 27–32 sts.</li><li><strong>2 Fine</strong> (sport): 23–26 sts.</li><li><strong>3 Light</strong> (DK): 21–24 sts.</li><li><strong>4 Medium</strong> (worsted, aran): 16–20 sts.</li><li><strong>5 Bulky</strong> (chunky): 12–15 sts.</li><li><strong>6 Super bulky:</strong> 7–11 sts.</li><li><strong>7 Jumbo:</strong> 6 sts and fewer.</li></ul>
<p>If you knit tighter or looser than the middle of the range, your yardage moves with it: 20 stitches per 4 in in worsted uses about 11% more yarn than 18.</p>`
    },
    {
      h2: 'How many granny squares do I need for a blanket?',
      html: `<p>Divide the blanket width and length by the finished square size and round up each one, then multiply. A 50 × 60 in throw from 6-in squares needs 9 × 10 = <strong>90 squares</strong> (finishing at 54 × 60 in before the border). From 4-in squares it takes 13 × 15 = 195. Weigh or measure the yarn used in your first finished square and multiply by the count, adding 10–15% for joining and the border.</p>`
    },
    {
      h2: 'How do I estimate yarn from a swatch?',
      html: `<p>The most accurate method uses your own yarn and tension. Knit or crochet a swatch at least 6 × 6 in, measure it, then unravel it and measure the yarn (or weigh the swatch on a kitchen scale and convert using the label's yards per gram). Yards per square inch = yarn used ÷ swatch area. Multiply by the blanket area and add your margin.</p>`
    }
  ],
  faq: [
    { q: 'How many skeins of yarn do I need for a throw blanket?', a: 'A 50 × 60 in knitted throw in worsted takes about 2,063 yards with margin, which is 11 skeins of 200 yd or 10 skeins of 220 yd. In bulky yarn it is about 1,550 yd; check how many yards your skeins hold.' },
    { q: 'How much yarn do I need for a baby blanket?', a: 'A 30 × 36 in knitted baby blanket needs about 740 yards of worsted or 930 yards of DK, including a 10% margin. Crochet adds about 30%.' },
    { q: 'How much yarn for a queen size blanket?', a: 'A 90 × 90 in knitted blanket needs roughly 5,570 yards of worsted or 4,180 yards of bulky with a 10% margin. That is 28 skeins of 200-yd worsted, so buy from a single dye lot.' },
    { q: 'How much yarn do I need for a chunky blanket?', a: 'A 50 × 60 in throw in super bulky (#6) yarn takes about 1,030 yards with margin; in jumbo (#7) yarn, about 570 yards. Arm-knit and hand-knit chunky blankets vary widely, so check the pattern.' },
    { q: 'How many yards are in a skein of yarn?', a: 'It varies by brand and weight: worsted skeins commonly hold 200 to 220 yards per 100 g, while larger economy skeins hold 350 yards or more. Always use the yardage on the label, not the number of skeins.' },
    { q: 'Should I buy extra yarn?', a: 'Yes. Add at least 10%, and buy every skein from the same dye lot. Unused skeins can often be returned unopened, but a matching dye lot may be impossible to find later.' }
  ],
  related: ['quilt-backing-calculator', 'square-footage-calculator', 'wallpaper-calculator'],
  sources: [
    { name: 'Craft Yarn Council: Standard Yarn Weight System', url: 'https://www.craftyarncouncil.com/standards/yarn-weight-system' },
    { name: 'Craft Yarn Council: Standards and guidelines for crochet and knitting', url: 'https://www.craftyarncouncil.com/standards' }
  ]
};
