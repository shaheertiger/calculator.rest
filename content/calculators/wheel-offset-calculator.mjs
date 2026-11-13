export default {
  slug: 'wheel-offset-calculator',
  hub: 'electrical',
  name: 'Wheel Offset Calculator',
  title: 'Wheel Offset Calculator: 8 in. Wheel, 5.5 in. Backspace = +25 mm',
  h1: 'Wheel Offset and Backspacing Calculator: Compare Old and New Wheels',
  meta: 'An 8 in. wide wheel (9 in. overall) with 5.5 in. of backspacing has a +25.4 mm offset. Convert backspacing to offset and see how far new wheels poke out or tuck in.',
  keyword: 'how to calculate wheel offset',
  also: ['how to calculate offset on wheels', 'how to calculate offset wheels', 'wheel offset calculator', 'backspacing to offset calculator', 'wheel backspacing calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'width', label: 'Wheel width', type: 'number', value: 8, suffix: 'in' },
    { id: 'wtype', label: 'Width is', type: 'select', value: 'nominal', options: [['nominal', 'Nominal (stamped size, adds 1 in. for the flanges)'], ['overall', 'Overall, measured lip to lip']] },
    { id: 'bs', label: 'Backspacing', type: 'number', value: 5.5, suffix: 'in', help: 'Hub mounting face to the inner edge of the rim.' },
    { id: 'w2', label: 'New wheel width (to compare)', type: 'number', value: 9, suffix: 'in', placeholder: 'optional' },
    { id: 'o2', label: 'New wheel offset', type: 'number', value: 12, suffix: 'mm', placeholder: 'e.g. 12 or -12' },
    { id: 'spacer', label: 'Wheel spacer on new wheel', type: 'number', value: '', suffix: 'mm', placeholder: 'optional' }
  ],
  compute(v, H) {
    if (!(v.width > 0)) return { error: 'Enter the wheel width.' };
    if (!H.isNum(v.bs) || v.bs < 0) return { error: 'Enter the backspacing in inches.' };
    var add = v.wtype === 'overall' ? 0 : 1;
    var ow = v.width + add;
    if (v.bs > ow) return { error: 'Backspacing cannot be more than the overall width (' + H.num(ow, 2) + ' in.).' };
    var offIn = v.bs - ow / 2;
    var mm = offIn * 25.4;
    var fs = ow - v.bs;
    var sign = function (x, d) { return (x > 0.05 ? '+' : x < -0.05 ? '−' : '') + H.num(Math.abs(x), d); };
    var rows = [
      ['Offset in inches', sign(offIn, 3) + ' in'],
      ['Overall width used', H.num(ow, 2) + ' in'],
      ['Front spacing (face to outer lip)', H.num(fs, 3) + ' in'],
      ['Type', Math.abs(mm) < 0.5 ? 'Zero offset: mounting face on the centerline' : mm > 0 ? 'Positive: mounting face outboard of center' : 'Negative: mounting face inboard of center (deep dish)']
    ];
    var out = { value: sign(mm, 1) + ' mm', label: 'Wheel offset (ET)', expr: '(' + H.num(v.bs, 3) + ' − ' + H.num(ow, 2) + ' ÷ 2) × 25.4', rows: rows, _mm: mm };
    if (v.w2 > 0 && H.isNum(v.o2)) {
      var ow2 = v.w2 + add;
      var eff = v.o2 - (v.spacer > 0 ? v.spacer : 0);
      var bs2 = eff / 25.4 + ow2 / 2;
      var fs2 = ow2 - bs2;
      var inner = v.bs - bs2, outer = fs2 - fs;
      rows.push(['New wheel backspacing', H.num(bs2, 3) + ' in', true]);
      rows.push(['Inner edge moves', (Math.abs(inner) < 0.005 ? 'no change' : H.num(Math.abs(inner), 2) + ' in (' + H.num(Math.abs(inner) * 25.4, 1) + ' mm) ' + (inner > 0 ? 'away from the suspension' : 'closer to the suspension'))]);
      rows.push(['Outer lip moves', (Math.abs(outer) < 0.005 ? 'no change' : H.num(Math.abs(outer), 2) + ' in (' + H.num(Math.abs(outer) * 25.4, 1) + ' mm) ' + (outer > 0 ? 'further out toward the fender' : 'further in')), true]);
      out.sub = 'Compared with the current wheel, the new one ' + (outer > 0.005 ? 'pokes out ' + H.num(outer, 2) + ' in. more' : 'sits ' + H.num(Math.abs(outer), 2) + ' in. further in') + ' at the fender and ' + (inner < -0.005 ? 'gains ' + H.num(-inner, 2) + ' in. toward the strut.' : 'clears the strut by ' + H.num(Math.abs(inner), 2) + ' in. more.');
    } else {
      out.sub = 'Add a new wheel width and offset to compare fitment.';
    }
    return out;
  },
  quick: ({ r }) => `Wheel offset = backspacing − half the overall width, converted to millimeters. An 8 in. wheel measures about 9 in. lip to lip, so with <strong>5.5 in. of backspacing</strong> the offset is (5.5 − 4.5) × 25.4 = <strong>${r.value}</strong>. Swapping to a 9 in. +12 mm wheel pushes the outer lip about 1.03 in. closer to the fender.`,
  stepsTitle: 'How to calculate wheel offset from backspacing',
  steps: [
    'Find the overall width: the stamped size (the 8 in "17×8") is measured between the bead seats, so add about 1 in. for the flanges, or measure lip to lip. Skipping this step makes offset look 12.7 mm too high.',
    'Measure backspacing: lay a straightedge across the back lip and measure straight down to the hub mounting face.',
    'Divide the overall width by 2 to find the wheel centerline, and subtract it from the backspacing.',
    'Multiply the result in inches by 25.4 for offset in millimeters. Positive means the mounting face is outboard of center; negative means it is inboard.'
  ],
  formulaTitle: 'What is the wheel offset formula?',
  formula: {
    expr: 'Offset (mm) = (backspacing − overall width ÷ 2) × 25.4<br>Backspacing (in) = offset ÷ 25.4 + overall width ÷ 2<br>Overall width ≈ nominal width + 1 in.',
    vars: [['backspacing', 'hub mounting face to inner rim edge, inches'], ['overall width', 'lip-to-lip width including flanges, inches'], ['offset (ET)', 'mounting face to wheel centerline, millimeters']],
    note: 'A spacer of thickness t (mm) reduces the effective offset by t: a +35 mm wheel on a 15 mm spacer behaves like a +20 mm wheel.'
  },
  example: `<p>A truck owner measures a 17×9 wheel: <strong>10 in.</strong> lip to lip with <strong>4.5 in.</strong> of backspacing.</p>
<p>Centerline = 10 ÷ 2 = 5 in. Offset = (4.5 − 5) × 25.4 = <strong>−12.7 mm</strong>, sold as a −12.</p>
<p>The replacement is 17×10 with a −25 mm offset. Its backspacing is −25 ÷ 25.4 + 11 ÷ 2 = <strong>4.52 in.</strong>, so the inner edge stays almost where it was, while the outer lip moves 11 − 4.52 − 5.5 = about <strong>0.98 in.</strong> further out.</p>`,
  table: {
    title: 'What offset do common backspacing measurements equal?',
    intro: 'Offset in millimeters by nominal wheel width and backspacing, computed with the calculator (overall width = nominal + 1 in.).',
    head: ['Wheel width', '3.5 in. BS', '4.5 in.', '5.0 in.', '5.5 in.', '6.0 in.', '6.5 in.'],
    rows: ({ run }) => [6, 7, 7.5, 8, 8.5, 9, 10, 12].map(w => [w + ' in.', ...[3.5, 4.5, 5, 5.5, 6, 6.5].map(b => b > w + 1 ? '–' : run({ width: w, wtype: 'nominal', bs: b, w2: NaN })._mm.toFixed(1).replace('-', '−').replace(/^(\d)/, '+$1').replace(/^\+0\.0$/, '0.0'))]),
    note: 'Offsets are usually sold in whole millimeters, so a computed +25.4 mm is listed as +25. Use the calculator for other widths or overall measurements.'
  },
  sections: [
    {
      h2: 'What is the difference between offset and backspacing?',
      html: `<p>Both locate the mounting face, but from different reference points. <strong>Offset</strong> is measured from the wheel's centerline, in millimeters, and is stamped on most wheels as "ET" (from the German <em>Einpresstiefe</em>) or "OS". <strong>Backspacing</strong> is measured from the inner edge of the rim, in inches, and is the figure most American truck and hot-rod wheel catalogs use.</p>
<p>Backspacing tells you directly how much room you have to the strut, spring or control arm; offset tells you how the wheel sits relative to the hub. Because backspacing depends on width, two wheels with the same offset but different widths have different backspacing, and vice versa.</p>`
    },
    {
      h2: 'Will a lower offset make my wheels stick out more?',
      html: `<p>Yes. At the same width, each 25.4 mm of lower offset moves the whole wheel 1 in. outward. Going from +45 mm to +20 mm on the same width moves it about 0.98 in. out. Width matters too: an extra inch of width at the same offset adds half an inch on each side.</p>
<p>That is why the comparison in the calculator reports the inner and outer edge separately. A wider wheel with a matching higher offset can tuck in at the fender and run into the strut instead. Lower offsets also widen the track and increase scrub radius, which can make steering heavier and adds leverage on wheel bearings.</p>`
    },
    {
      h2: 'Is positive, zero or negative offset better?',
      html: `<p>None is better on its own; the right offset is the one that clears the brakes and suspension and keeps the tire under the fender. Most modern front-wheel-drive and many rear-drive cars use positive offset so the wheel tucks over the brakes and hub. Zero offset puts the mounting face on the centerline. Negative offset gives the deep-dish look common on lifted trucks, usually paired with fender flares. When changing more than 10–15 mm from stock, check brake caliper clearance and full-lock steering, not just the fender.</p>`
    }
  ],
  faq: [
    { q: 'What does +35 offset mean?', a: 'The hub mounting face sits 35 mm outboard of the wheel\'s centerline. On an 8 in. wheel (9 in. overall), that is about 5.88 in. of backspacing.' },
    { q: 'Is ET the same as offset?', a: 'Yes. ET (Einpresstiefe) is the German term for offset and is given in millimeters. ET45 means a +45 mm offset.' },
    { q: 'What backspacing is zero offset?', a: 'Exactly half the overall width. A 10 in. wide wheel measuring 11 in. overall has 5.5 in. of backspacing at zero offset.' },
    { q: 'How do wheel spacers change offset?', a: 'Subtract the spacer thickness from the offset. A +40 mm wheel with a 20 mm spacer acts like a +20 mm wheel and sits 20 mm further out.' },
    { q: 'Why add 1 inch to the wheel width?', a: 'The stamped width is measured inside the flanges, where the tire bead sits. The flanges add about half an inch per side, so a 17×8 wheel is roughly 9 in. overall.' },
    { q: 'Does tire size change wheel offset?', a: 'No. Offset belongs to the wheel. A wider tire bulges out on both sides, so check clearance with the tire\'s section width as well.' }
  ],
  related: ['gear-ratio-calculator', 'compression-ratio-calculator', 'engine-displacement-calculator', 'mpg-calculator'],
  sources: [
    { name: 'Forgeline: How to measure backspace and offset', url: 'https://www.forgeline.com/blog/tech-how-to-measure-backspace-and-offset/25636' },
    { name: 'Tire Rack: Wheel offset and backspacing', url: 'https://www.tirerack.com/wheels/tech/techpage.jsp?techid=101' },
    { name: 'The Tire and Rim Association (wheel and rim standards)', url: 'https://www.us-tra.org/' },
    { name: 'Rim (wheel): offset, backspacing and ET terminology', url: 'https://en.wikipedia.org/wiki/Rim_(wheel)' }
  ]
};
