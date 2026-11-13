// Log-rule table for the static section (build time only; compute() below is self-contained).
const intl = (D, L) => { let n = Math.floor(L / 4), r = L - 4 * n, s = 0; for (let i = 0; i < n; i++) { const d = D + 0.5 * i; s += 0.199 * d * d - 0.642 * d; } const d = D + 0.5 * n; if (r > 0) s += r / 4 * (0.199 * d * d - 0.642 * d); return Math.max(0, Math.round(s / 5) * 5); };
const doyle = (D, L) => D > 4 ? Math.round((D - 4) * (D - 4) * L / 16) : 0;
const scrib = (D, L) => Math.max(0, Math.round((0.79 * D * D - 2 * D - 4) * L / 16));
const logTable = `<div class="twrap"><table><thead><tr><th>Small-end diameter</th><th>Doyle</th><th>Scribner (formula)</th><th>International ¼-in</th></tr></thead><tbody>${[8, 10, 12, 14, 16, 18, 20, 24, 28, 32].map(D => `<tr><td>${D} in</td><td>${doyle(D, 16)}</td><td>${scrib(D, 16)}</td><td>${intl(D, 16)}</td></tr>`).join('')}</tbody></table></div>`;

export default {
  slug: 'board-foot-calculator',
  hub: 'construction',
  name: 'Board Foot Calculator',
  title: 'Board Foot Calculator: a 1×6×8 Board Is 4 Board Feet',
  h1: 'Board Foot Calculator for Lumber and Logs (Doyle, Scribner, International)',
  meta: 'Board feet = thickness × width (in) × length (ft) ÷ 12. Ten 1×6×8 boards are 40 board feet. Also scales a log by the Doyle, Scribner or International ¼-in rule.',
  keyword: 'how calculate board feet',
  also: ['how do i calculate board feet of lumber', 'how to calculate board feet in a log', 'how do you calculate a board foot', 'how do you calculate board feet of lumber', 'how to calculate board footage in a log', 'board foot calculator', 'doyle log scale calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What are you measuring?', type: 'select', value: 'lumber', options: [['lumber', 'Boards / lumber'], ['log', 'A log (log scale)']] },
    { id: 'thick', label: 'Thickness', type: 'number', value: 1, suffix: 'in', help: 'Nominal or rough: 4/4 = 1, 5/4 = 1.25, 8/4 = 2. A 2×4 counts as 2.', showIf: { mode: ['lumber'] } },
    { id: 'width', label: 'Width', type: 'number', value: 6, suffix: 'in', showIf: { mode: ['lumber'] } },
    { id: 'length', label: 'Length', type: 'number', value: 8, suffix: 'ft', showIf: { mode: ['lumber'] } },
    { id: 'qty', label: 'Number of boards', type: 'number', value: 10, showIf: { mode: ['lumber'] } },
    { id: 'price', label: 'Price per board foot', type: 'number', value: '', prefix: '$', placeholder: 'optional', showIf: { mode: ['lumber'] } },
    { id: 'dia', label: 'Small-end diameter inside bark', type: 'number', value: 16, suffix: 'in', showIf: { mode: ['log'] } },
    { id: 'logLen', label: 'Log length', type: 'number', value: 16, suffix: 'ft', showIf: { mode: ['log'] } },
    { id: 'rule', label: 'Log rule', type: 'select', value: 'doyle', options: [['doyle', 'Doyle'], ['scribner', 'Scribner (formula)'], ['intl', 'International ¼-inch']], showIf: { mode: ['log'] } }
  ],
  compute(v, H) {
    if (v.mode === 'log') {
      var D = v.dia, L = v.logLen;
      if (!(D > 0) || !(L > 0)) return { error: 'Enter the small-end diameter (inside the bark) and the log length.' };
      if (L > 20) return { error: 'Scale logs longer than 20 ft as two shorter logs.' };
      var doy = D > 4 ? (D - 4) * (D - 4) * L / 16 : 0;
      var scr = Math.max(0, (0.79 * D * D - 2 * D - 4) * L / 16);
      var n = Math.floor(L / 4), rem = L - 4 * n, s = 0, d;
      for (var i = 0; i < n; i++) { d = D + 0.5 * i; s += 0.199 * d * d - 0.642 * d; }
      d = D + 0.5 * n; if (rem > 0) s += rem / 4 * (0.199 * d * d - 0.642 * d);
      var itl = Math.max(0, Math.round(s / 5) * 5);
      var names = { doyle: 'Doyle', scribner: 'Scribner', intl: 'International ¼-in' };
      var vals = { doyle: Math.round(doy), scribner: Math.round(scr), intl: itl };
      var exprs = { doyle: '(' + H.num(D, 2) + ' − 4)² × ' + H.num(L, 2) + ' ÷ 16', scribner: '(0.79 × ' + H.num(D, 2) + '² − 2 × ' + H.num(D, 2) + ' − 4) × ' + H.num(L, 2) + ' ÷ 16', intl: 'Σ 4-ft sections: 0.199D² − 0.642D, +½ in taper each' };
      var rule = vals[v.rule] === undefined ? 'doyle' : v.rule;
      return {
        value: H.int(vals[rule]) + ' BF',
        label: names[rule] + ' log scale, ' + H.num(D, 2) + ' in × ' + H.num(L, 2) + ' ft',
        expr: exprs[rule],
        rows: [['Doyle', H.int(vals.doyle) + ' BF', rule === 'doyle'], ['Scribner (formula)', H.int(vals.scribner) + ' BF', rule === 'scribner'], ['International ¼-in', H.int(vals.intl) + ' BF', rule === 'intl'], ['Doyle as % of International', vals.intl > 0 ? H.pct(vals.doyle / vals.intl * 100, 0) : '—']],
        sub: D < 20 ? 'Doyle underestimates logs this small; mills buying on Doyle usually saw out more lumber (overrun).' : 'At this diameter the three rules are closer together; International ¼-in is the most accurate predictor of sawn lumber.'
      };
    }
    if (!(v.thick > 0) || !(v.width > 0) || !(v.length > 0)) return { error: 'Enter the thickness and width in inches and the length in feet.' };
    var q = v.qty >= 1 ? Math.floor(v.qty) : 1;
    var each = v.thick * v.width * v.length / 12;
    var total = each * q;
    var rows = [['Board feet per board', H.num(each, 3)], ['Linear feet', H.num(v.length * q, 2)], ['Cubic feet', H.num(total / 12, 3)]];
    if (v.price > 0) { rows.unshift(['Total cost', H.money(total * v.price), true]); rows.push(['Cost per board', H.money(each * v.price)]); }
    return {
      value: H.num(total, 2) + ' BF',
      label: 'Board feet' + (q > 1 ? ' (' + q + ' boards)' : ''),
      expr: H.num(v.thick, 3) + ' in × ' + H.num(v.width, 3) + ' in × ' + H.num(v.length, 2) + ' ft ÷ 12' + (q > 1 ? ' × ' + q : ''),
      rows: rows,
      sub: 'One board foot is 144 cubic inches: a piece 1 in thick, 12 in wide and 12 in long.'
    };
  },
  quick: ({ r }) => `To calculate board feet, multiply thickness (in) × width (in) × length (ft) and divide by 12. A 1 × 6 board 8 ft long is 1 × 6 × 8 ÷ 12 = <strong>4 board feet</strong>, so ten of them are <strong>${r.value}</strong>. With all three in inches, divide by 144 instead. A 2×4×8 stud is 5.33 board feet.`,
  stepsTitle: 'How to calculate board feet',
  steps: [
    'Measure thickness and width in inches. Use the <strong>nominal</strong> size for softwood lumber (a 2×4 is billed as 2 × 4, not 1.5 × 3.5) and the rough quarter size for hardwoods (4/4 = 1 in, 5/4 = 1.25 in, 8/4 = 2 in). Using actual surfaced dimensions is the most common mistake and undercounts what the yard charges.',
    'Measure the length in feet.',
    'Multiply thickness × width × length and divide by 12. If you measured the length in inches, divide by 144.',
    'Multiply by the number of boards, then by the price per board foot to check a quote.',
    'For a log, measure the small-end diameter inside the bark and the length, then pick the log rule your buyer uses (switch the calculator to log mode).'
  ],
  formulaTitle: 'What is the board foot formula?',
  formula: {
    expr: 'BF = T (in) × W (in) × L (ft) ÷ 12<br>BF = T (in) × W (in) × L (in) ÷ 144<br>Doyle log rule: BF = (D − 4)² × L ÷ 16',
    vars: [['T, W', 'thickness and width, in (nominal or rough)'], ['L', 'length'], ['D', 'small-end log diameter inside bark, in'], ['144', 'cubic inches in one board foot']]
  },
  example: `<p>A woodworker buys ten 4/4 red oak boards, each 6 in wide and 8 ft long, at $6.50 per board foot.</p>
<p>Each board: 1 × 6 × 8 ÷ 12 = <strong>4 BF</strong>. Ten boards: <strong>40 BF</strong>. Cost: 40 × $6.50 = <strong>$260.00</strong>.</p>
<p>Random-width hardwood is tallied the same way: add up width × length for each board, multiply by thickness and divide by 12. Boards 5, 7 and 9 in wide by 8 ft at 4/4 make (5 + 7 + 9) × 8 ÷ 12 = 14 BF.</p>`,
  table: {
    title: 'How many board feet are in common lumber sizes?',
    intro: 'Board feet per piece at nominal sizes, calculated with T × W × L ÷ 12.',
    head: ['Nominal size', '8 ft', '10 ft', '12 ft', '16 ft'],
    rows: ({ run }) => [[1, 4], [1, 6], [1, 8], [1, 12], [2, 4], [2, 6], [2, 8], [2, 10], [2, 12], [4, 4], [4, 6], [6, 6]].map(([t, w]) => [t + ' × ' + w, ...[8, 10, 12, 16].map(L => run({ mode: 'lumber', thick: t, width: w, length: L, qty: 1, price: NaN }).value.replace(' BF', ''))]),
    note: 'A 2×4 actually measures 1.5 × 3.5 in, but lumber is priced on nominal dimensions, so its board feet use 2 × 4.'
  },
  sections: [
    {
      h2: 'How do you calculate board feet in a log?',
      html: `<p>Logs are scaled with a <strong>log rule</strong>, a formula or table that estimates how much lumber a log will saw out after slabs, edgings and saw kerf. Measure the diameter inside the bark at the <em>small</em> end and the length in feet, then apply your buyer's rule. Purdue Extension's FNR-191 gives the three in common U.S. use:</p>
<ul><li><strong>Doyle:</strong> (D − 4)² × L ÷ 16. The most widely used rule, especially on private timber in the East and South.</li><li><strong>Scribner:</strong> approximated by (0.79D² − 2D − 4) × L ÷ 16. Traditional in the West and Lake States.</li><li><strong>International ¼-inch:</strong> 0.199D² − 0.642D for each 4-ft section, adding ½ in of diameter per section for taper. The most accurate of the three.</li></ul>
<p>Board feet in 16-ft logs by each rule (International rounded to the nearest 5, as in published tables):</p>${logTable}`
    },
    {
      h2: 'Why does the Doyle scale give such low numbers?',
      html: `<p>Doyle subtracts a flat 4 in from the diameter for slabs, then squares what is left, which takes a huge bite out of small logs. A 12-in × 16-ft log scales 64 BF Doyle but about 95 BF International; at 28 in the two are within 2%, and above about 30 in Doyle actually scales higher than International. Mills that buy on Doyle routinely saw out more lumber than the scale (called overrun), which is why sellers of small logs often ask to be paid on International or Scribner.</p>`
    },
    {
      h2: 'What is the difference between nominal and actual lumber sizes?',
      html: `<p>Softwood dimension lumber is named and priced by its rough-sawn size. After drying and planing, a 2×4 is 1½ × 3½ in, a 2×6 is 1½ × 5½ in, and a 1×6 is ¾ × 5½ in. Board feet are still calculated on the nominal size. Hardwood lumber is sold rough in quarter-inch thicknesses (4/4, 5/4, 6/4, 8/4), and board feet use that rough thickness even if you buy it surfaced (S2S).</p>
<p>Very thin stock is the exception: anything under 1 in nominal is usually tallied as if it were 1 in thick.</p>`
    }
  ],
  faq: [
    { q: 'How many board feet is a 2x4x8?', a: 'A 2×4×8 is 2 × 4 × 8 ÷ 12 = 5.33 board feet, based on nominal size. A 2×6×8 is 8 board feet and a 2×4×10 is 6.67.' },
    { q: 'How many board feet are in a 1x12x12?', a: 'A 1×12 that is 12 ft long is 1 × 12 × 12 ÷ 12 = 12 board feet.' },
    { q: 'Is a board foot the same as a square foot?', a: 'Only for 1-inch-thick lumber. A board foot is a volume (144 cubic inches), so a 2-inch-thick board has 2 board feet per square foot of face.' },
    { q: 'How do you calculate the price per board foot?', a: 'Divide the board\'s price by its board feet. A 1×6×8 (4 BF) priced at $26 costs $6.50 per board foot.' },
    { q: 'How many board feet are in a cubic foot?', a: 'There are 12 board feet in a cubic foot, because a cubic foot is 1,728 cubic inches and a board foot is 144.' },
    { q: 'How many board feet are in a 16-inch log?', a: 'A 16-in × 16-ft log scales 144 board feet by the Doyle rule, about 166 by the Scribner formula and 180 by the International ¼-inch rule.' },
    { q: 'Do I use the large or small end of the log?', a: 'The small end, measured inside the bark. Log rules assume the small-end diameter; the International rule adds its own taper allowance for longer logs.' }
  ],
  related: ['framing-calculator', 'cubic-feet-calculator', 'firewood-cord-calculator', 'linear-feet-calculator'],
  sources: [
    { name: 'Purdue Extension FNR-191: Log and Tree Scaling Techniques', url: 'https://www.extension.purdue.edu/extmedia/fnr/fnr-191.pdf' },
    { name: 'USDA Forest Service, Forest Products Laboratory', url: 'https://research.fs.usda.gov/fpl' }
  ]
};
