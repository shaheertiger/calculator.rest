export default {
  slug: 'quilt-backing-calculator',
  hub: 'construction',
  name: 'Quilt Backing Calculator',
  title: 'Quilt Backing Calculator: a 60×80 Quilt Needs 5 Yards',
  h1: 'Quilt Backing and Binding Calculator: Yardage, Seams and Strips',
  meta: 'A 60 × 80 in quilt needs a 68 × 88 in back: 5 yards of 42-in cotton with one seam, or 2 yards of 108-in wide backing, plus 5/8 yd for 2½-in binding.',
  keyword: 'how to calculate backing for a quilt',
  also: ['how to calculate quilt backing', 'how to calculate backing for quilt', 'how to calculate backing for quilts', 'how to calculate binding for a quilt', 'how to calculate quilt binding', 'quilt backing calculator', 'quilt binding calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'width', label: 'Quilt top width', type: 'number', value: 60, suffix: 'in' },
    { id: 'length', label: 'Quilt top length', type: 'number', value: 80, suffix: 'in' },
    { id: 'extra', label: 'Extra backing on each side', type: 'number', value: 4, suffix: 'in', help: 'Most longarm quilters ask for 4 in per side; some want 5–6.' },
    { id: 'fabric', label: 'Backing fabric', type: 'select', value: '40', options: [['40', '42–44 in quilting cotton (40 in usable)'], ['104', '108 in wide backing (104 in usable)']] },
    { id: 'strip', label: 'Binding strip width', type: 'select', value: '2.5', options: [['2.25', '2¼ in'], ['2.5', '2½ in'], ['2.75', '2¾ in']] }
  ],
  compute(v, H) {
    if (!(v.width > 0) || !(v.length > 0)) return { error: 'Enter the quilt top width and length.' };
    var e = v.extra >= 0 ? v.extra : 0;
    var U = Number(v.fabric) || 40;
    var bw = v.width + 2 * e, bl = v.length + 2 * e;
    function yd(inches) {
      var t = Math.ceil(inches / 36 * 8 - 1e-9), w = Math.floor(t / 8), f = t % 8, d = 8;
      while (f && f % 2 === 0) { f /= 2; d /= 2; }
      return (w ? w + (f ? ' ' : '') : '') + (f ? f + '/' + d : '') + (t ? '' : '0') + ' yd';
    }
    var pA = Math.ceil(bw / U - 1e-9), inA = pA * bl;
    var pB = Math.ceil(bl / U - 1e-9), inB = pB * bw;
    var useA = inA <= inB;
    var panels = useA ? pA : pB, cut = useA ? bl : bw, inches = useA ? inA : inB;
    var seams = panels - 1;
    var layout = panels + (panels === 1 ? ' piece' : ' pieces') + ' × ' + H.num(cut, 2) + ' in' + (seams ? ', ' + seams + (seams === 1 ? ' seam ' : ' seams ') + (useA ? 'running lengthwise' : 'running across') : ', no seams');
    var sw = Number(v.strip) || 2.5;
    var perim = 2 * (v.width + v.length) + 10;
    var strips = Math.ceil(perim / 40 - 1e-9);
    return {
      value: yd(inches),
      label: 'Backing fabric (' + (U === 40 ? '42-in cotton' : '108-in wide') + ')',
      expr: panels + ' × ' + H.num(cut, 2) + ' in = ' + H.num(inches, 2) + ' in ÷ 36',
      rows: [
        ['Backing size needed', H.num(bw, 2) + ' × ' + H.num(bl, 2) + ' in', true],
        ['Layout', layout],
        ['Other direction would take', yd(useA ? inB : inA)],
        ['Binding strips (' + H.num(sw, 2) + ' in × width of fabric)', String(strips) + ' (' + H.int(perim) + ' in of binding)'],
        ['Binding fabric', yd(strips * sw), true],
        ['Batting at least', H.num(bw, 2) + ' × ' + H.num(bl, 2) + ' in']
      ],
      sub: 'Yardage is rounded up to the next 1/8 yd. Prewash or allow for shrinkage if your backing is not prewashed.'
    };
  },
  quick: ({ r }) => `To calculate backing for a quilt, add 4 in to every side of the top, then count how many fabric widths that takes. A 60 × 80 in quilt needs a 68 × 88 in back: two 88-in lengths of 42-in cotton (about 40 in usable) joined with one seam, 176 in, so <strong>${r.value}</strong>. With 108-in wide backing, one 2-yard cut does it.`,
  stepsTitle: 'How to calculate quilt backing and binding',
  steps: [
    'Measure the finished quilt top and add the overage your quilter asks for to <strong>each</strong> side: 4 in per side means +8 in to both width and length. Adding 4 in total instead of per side is the most common mistake.',
    'Use the usable width of the fabric: about 40 in for 42–44-in quilting cotton after removing selvages and allowing for shrinkage, or about 104 in for 108-in wide backs.',
    'Try both directions: divide the backing width by the usable width and round up (panels), then multiply by the backing length. Repeat with width and length swapped and keep the smaller total.',
    'Divide inches by 36 for yards and round up to the next 1/8 yard.',
    'For binding, add the four sides plus 10 in for corners and the join, divide by 40 for strips, and multiply by the strip width.'
  ],
  formulaTitle: 'What is the quilt backing formula?',
  formula: {
    expr: 'Back = (W + 2e) × (L + 2e)<br>Yards = ⌈(W + 2e) ÷ usable width⌉ × (L + 2e) ÷ 36 &nbsp; (or the same with W and L swapped)<br>Binding strips = ⌈(2W + 2L + 10) ÷ 40⌉ &nbsp; Binding yards = strips × strip width ÷ 36',
    vars: [['W, L', 'quilt top width and length, in'], ['e', 'extra backing per side, in'], ['usable width', '40 in for 42–44-in cotton, about 104 in for 108-in backing'], ['⌈ ⌉', 'round up']]
  },
  example: `<p>A 60 × 80 in quilt top is going to a longarm quilter who wants 4 in extra per side.</p>
<p>Backing size: (60 + 8) × (80 + 8) = <strong>68 × 88 in</strong>.</p>
<p>Seams lengthwise: 68 ÷ 40 = 1.7 → 2 panels × 88 in = 176 in = 4.89 yd. Seams across: 88 ÷ 40 = 2.2 → 3 panels × 68 in = 204 in = 5.67 yd. The first layout wins: buy <strong>5 yards</strong> and sew one long seam.</p>
<p>Binding: 2 × (60 + 80) + 10 = 290 in ÷ 40 = 7.25 → <strong>8 strips</strong> × 2½ in = 20 in, so buy <strong>5/8 yd</strong>.</p>`,
  table: {
    title: 'How much backing and binding fabric for common quilt sizes?',
    intro: 'Example finished sizes with 4 in extra per side and 2½-in binding, worked out by the calculator.',
    head: ['Quilt top', '42-in cotton', '108-in wide', 'Binding'],
    rows: ({ run }) => [['Baby', 36, 36], ['Crib', 36, 52], ['Lap', 50, 65], ['Throw', 60, 80], ['Twin', 70, 90], ['Full', 84, 90], ['Queen', 90, 100], ['King', 108, 100]].map(([n, w, l]) => { const a = run({ width: w, length: l, extra: 4, fabric: '40', strip: '2.5' }); const b = run({ width: w, length: l, extra: 4, fabric: '104', strip: '2.5' }); return [n + ' (' + w + ' × ' + l + ' in)', a.value, b.value, a.rows[4][1]]; }),
    note: 'Bed-quilt sizes vary with mattress depth and how far you want the quilt to drape; measure your own bed for the top size.'
  },
  sections: [
    {
      h2: 'How much bigger should quilt backing be than the top?',
      html: `<p>For longarm quilting, the standard request is <strong>4 in larger on every side</strong>, so 8 in wider and 8 in longer than the top. The machine clamps the backing at the sides and rolls it onto bars at the top and bottom, and quilting draws the layers in slightly. Some longarmers ask for 5 or 6 in per side for big quilts or dense quilting, so ask yours before you buy. For quilting on a home machine, 3–4 in per side is plenty.</p>
<p>Batting should be the same size as the backing or slightly smaller, but never smaller than the top plus a couple of inches each way.</p>`
    },
    {
      h2: 'Is it better to use wide backing fabric?',
      html: `<p>Wide backs (108 in, sometimes 118 in) let you skip seams on anything up to about queen width, which looks cleaner and saves piecing time. They often cost more per yard but take far fewer yards: the 60 × 80 in example needs 5 yards of 42-in cotton but only 2 yards of 108-in backing. For king-size quilts even a 108-in back needs a seam.</p>
<p>If you piece a back from 42-in fabric, press the seam open to reduce bulk, and trim the selvages off first; they shrink differently and can pucker.</p>`
    },
    {
      h2: 'How do you calculate binding for a quilt?',
      html: `<p>Add up the four sides of the quilt and add about 10 in for mitering the corners and joining the ends. Divide by the usable width of fabric (40 in) and round up to get the number of strips, then multiply by your strip width. 2¼ in and 2½ in are the most popular widths for double-fold binding.</p>
<ul><li>60 × 80 in quilt: 290 in ÷ 40 = 8 strips × 2½ in = 20 in, or 5/8 yd.</li><li>90 × 100 in quilt: 390 in ÷ 40 = 10 strips × 2½ in = 25 in, or 3/4 yd.</li></ul>
<p>Bias binding for curved edges uses the same length but is cut diagonally; buy a little extra fabric to square up the bias.</p>`
    }
  ],
  faq: [
    { q: 'How much backing do I need for a queen size quilt?', a: 'A 90 × 100 in queen quilt with 4 in per side needs a 98 × 108 in back: 8 1/4 yards of 42-in cotton (3 pieces × 98 in, seams running across) or 3 yards of 108-in wide backing with no seam.' },
    { q: 'How much backing for a twin quilt?', a: 'A 70 × 90 in twin quilt needs a 78 × 98 in back: 5 1/2 yards of 42-in cotton in two lengthwise pieces, or 2 1/4 yards of 108-in wide backing.' },
    { q: 'How much backing for a baby quilt?', a: 'A 36 × 36 in baby quilt needs a 44 × 44 in back. That is just over one width of 42-in fabric, so it takes 2 pieces, 2 1/2 yards; with 108-in backing, 1 1/4 yards.' },
    { q: 'Should backing seams run vertically or horizontally?', a: 'Either works structurally. Choose whichever uses less fabric; many longarmers prefer seams running parallel to the rollers (horizontal) because the fabric rolls more evenly, so ask your quilter.' },
    { q: 'What is the usable width of quilting cotton?', a: 'Most quilting cotton is sold 42–44 in wide. After trimming selvages and allowing for shrinkage, plan on 40 in of usable width for backing and binding.' },
    { q: 'How many binding strips do I need?', a: 'Divide the quilt perimeter plus 10 in by 40 and round up. A 60 × 80 in quilt needs 8 strips cut across the width of fabric.' }
  ],
  related: ['yarn-calculator', 'square-footage-calculator', 'wallpaper-calculator'],
  sources: [
    { name: 'Missouri Star Quilt Co.: How to figure yardage for quilt backing', url: 'https://www.missouriquiltco.com/blogs/missouri-star-blog/how-to-figure-yardage-for-quilt-backing' }
  ]
};
