export default {
  slug: 'rolling-offset-calculator',
  hub: 'construction',
  name: 'Rolling Offset Calculator',
  title: 'Rolling Offset Calculator: 12×16 in Offset = 28.28-in Travel',
  h1: 'Rolling Offset Calculator: True Offset, Travel and Setback',
  meta: 'A rolling offset with a 12-in roll and 16-in set has a 20-in true offset; with 45° fittings the travel is 28 5/16 in and the setback 20 in. Any fitting angle.',
  keyword: 'how to calculate a rolling offset',
  also: ['how do you calculate a rolling offset', 'how to calculate 45 degree offset', 'rolling offset calculator', 'pipe offset calculator', 'rolling offset formula', 'how to calculate travel on a pipe offset'],
  updated: '2026-11-13',
  inputs: [
    { id: 'roll', label: 'Roll (side-to-side offset)', type: 'number', value: 12, suffix: 'in' },
    { id: 'set', label: 'Set or rise (offset in the other plane)', type: 'number', value: 16, suffix: 'in' },
    { id: 'angle', label: 'Fitting angle', type: 'select', value: '45', options: [['11.25', '11¼° (1/32 bend)'], ['22.5', '22½° (1/16 bend)'], ['45', '45° (1/8 bend)'], ['60', '60° (1/6 bend)'], ['72', '72° (1/5 bend)']] },
    { id: 'takeout', label: 'Fitting take-out (each fitting)', type: 'number', value: 0, suffix: 'in', help: 'Center-to-end minus socket depth, from the fitting chart. 0 = show center-to-center only.' }
  ],
  compute(v, H) {
    if (!(v.roll >= 0) || !(v.set >= 0) || !(v.roll + v.set > 0)) return { error: 'Enter the roll and the set in inches.' };
    function frac(x) {
      var neg = x < 0; x = Math.abs(x);
      var w = Math.floor(x + 1e-9), f = Math.round((x - w) * 16);
      if (f === 16) { w++; f = 0; }
      var d = 16; while (f && f % 2 === 0) { f /= 2; d /= 2; }
      return (neg ? '−' : '') + (f ? (w ? w + ' ' : '') + f + '/' + d : String(w)) + ' in';
    }
    var deg = Number(v.angle) || 45, a = deg * Math.PI / 180;
    var off = Math.sqrt(v.roll * v.roll + v.set * v.set);
    var csc = 1 / Math.sin(a), cot = 1 / Math.tan(a);
    var travel = off * csc, run = off * cot;
    var rot = Math.atan2(v.roll, v.set) * 180 / Math.PI;
    var rows = [
      ['True offset', frac(off) + ' (' + H.fix(off, 2) + ' in)', true],
      ['Setback (run, advance)', frac(run) + ' (' + H.fix(run, 2) + ' in)', true],
      ['Travel, decimal', H.fix(travel, 3) + ' in'],
      ['Multipliers at ' + H.num(deg, 2) + '°', 'travel × ' + H.fix(csc, 3) + ', setback × ' + H.fix(cot, 3)],
      ['Roll the fittings', H.fix(rot, 1) + '° off the set plane']
    ];
    if (v.takeout > 0) rows.splice(1, 0, ['Pipe cut length', frac(travel - 2 * v.takeout) + ' (travel − 2 × ' + H.num(v.takeout, 3) + ' in)', true]);
    return {
      value: frac(travel),
      label: 'Travel, center to center, with ' + H.num(deg, 2) + '° fittings',
      expr: '√(' + H.num(v.roll, 3) + '² + ' + H.num(v.set, 3) + '²) × ' + H.fix(csc, 3),
      rows: rows,
      sub: travel - 2 * (v.takeout > 0 ? v.takeout : 0) <= 0 ? 'The fittings are longer than the travel; use a smaller angle or a larger offset.' : 'Measure travel center to center of the fittings, then subtract the take-out of both fittings for the pipe cut.'
    };
  },
  quick: ({ r }) => `To calculate a rolling offset, find the true offset with the Pythagorean theorem, then multiply by the fitting constant. With a 12-in roll and 16-in set, the true offset is √(12² + 16²) = 20 in. For 45° fittings, travel = 20 × 1.414 = <strong>${r.value}</strong> (28.28 in) center to center, and the setback is 20 × 1.000 = 20 in.`,
  stepsTitle: 'How to calculate a rolling offset step by step',
  steps: [
    'Measure the <strong>roll</strong> (how far the line moves sideways) and the <strong>set</strong> (how far it moves in the other plane, often up or down), both center to center of the pipes.',
    'Find the true offset: √(roll² + set²). This is the diagonal across the end of the imaginary box the offset passes through. Using the roll or the set alone instead of the true offset is the mistake that makes a rolling offset miss.',
    'Multiply the true offset by the travel constant for your fittings: 1.414 for 45°, 2.613 for 22½°, 1.155 for 60°.',
    'Multiply the true offset by the setback constant (1.000 for 45°, 2.414 for 22½°, 0.577 for 60°) to find how far along the line the offset starts before the obstacle.',
    'Subtract the take-out of both fittings from the travel to get the pipe cut length.'
  ],
  formulaTitle: 'What is the rolling offset formula?',
  formula: {
    expr: 'True offset = √(Roll² + Set²)<br>Travel = True offset ÷ sin θ &nbsp; Setback = True offset ÷ tan θ<br>Cut length = Travel − 2 × take-out',
    vars: [['Roll', 'sideways offset, in'], ['Set', 'offset in the second plane (rise), in'], ['θ', 'fitting angle: 11¼°, 22½°, 45°, 60°, 72°'], ['take-out', 'fitting center-to-end minus pipe engagement, per fitting']],
    note: '1 ÷ sin θ is the familiar travel constant (1.414 at 45°) and 1 ÷ tan θ is the setback or run constant (1.000 at 45°).'
  },
  example: `<p>A drain line has to move 12 in sideways and drop 16 in to get around a beam, using two 45° fittings with a 1-in take-out each.</p>
<p>True offset: √(12² + 16²) = √(144 + 256) = √400 = <strong>20 in</strong>.</p>
<p>Travel: 20 × 1.414 = <strong>28.28 in</strong>, or 28 5/16 in center to center. Setback: 20 × 1.000 = <strong>20 in</strong>.</p>
<p>Pipe cut: 28.28 − 2 × 1 = <strong>26.28 in</strong> (26 5/16 in). Roll both fittings 36.9° off vertical (arctan 12 ÷ 16) so the offset pipe points along the true offset.</p>`,
  table: {
    title: 'What are the offset constants for 22½°, 45° and 60° fittings?',
    intro: 'Travel and setback for the 20-in true offset above at each standard fitting angle, calculated by the tool.',
    head: ['Fitting', 'Travel constant', 'Travel', 'Setback constant', 'Setback'],
    rows: ({ run }) => ['11.25', '22.5', '45', '60', '72'].map(a => { const r = run({ roll: 12, set: 16, angle: a, takeout: 0 }); const m = r.rows[3][1].match(/× ([\d.]+), setback × ([\d.]+)/); return [a.replace('11.25', '11¼').replace('22.5', '22½') + '°', m[1], r.value, m[2], r.rows[1][1].replace(/ \(.*/, '')]; }),
    note: 'Smaller fitting angles make a longer, gentler offset; they need more room along the line (setback) but flow better in drainage.'
  },
  sections: [
    {
      h2: 'What is the difference between a simple and a rolling offset?',
      html: `<p>A <strong>simple offset</strong> moves the pipe in one plane only, say 12 in sideways, so the offset itself is the number you multiply by the fitting constant. A <strong>rolling offset</strong> moves it in two planes at once, sideways and up or down, so the pipe travels diagonally through an imaginary box. The diagonal of the box's end, √(roll² + set²), is the true offset, and once you have it the rest of the math is the same as a simple offset.</p>
<p>A handy check: whole-number triangles like 3-4-5 (12-16-20, 9-12-15, 15-20-25) give an exact true offset, which makes field math and layout easier.</p>`
    },
    {
      h2: 'How do you calculate a 45 degree offset?',
      html: `<p>For two 45° fittings, travel = offset × 1.414 and setback = offset × 1. For a simple 10-in offset, travel is 14.14 in (14 1/8 in) and the fittings start 10 in before the obstacle. For a rolling offset, use the true offset in place of the 10 in. The 1.414 is √2, because a 45° offset forms a right triangle with two equal legs.</p>`
    },
    {
      h2: 'How do you measure roll and set in the field?',
      html: `<p>Measure center to center. With the existing pipe and the target point established, measure the vertical difference between their centerlines (the set or rise) and the horizontal sideways difference (the roll), each square to the run of the pipe. A level, a square and a plumb bob or laser make this much easier. Some fitters measure the true offset directly as the diagonal with a tape; it should match √(roll² + set²) if the two measurements are square.</p>
<p>Before cutting, also check the setback against the space you have: a 22½° offset needs 2.4 times the true offset in setback, and drainage lines still need their slope after the offset.</p>`
    }
  ],
  faq: [
    { q: 'What is the constant for a 45 degree offset?', a: 'The travel constant for 45° fittings is 1.414 and the setback (run) constant is 1.000. Multiply the offset, or the true offset for a rolling offset, by these numbers.' },
    { q: 'What is the 22.5 degree offset multiplier?', a: 'For 22½° fittings, travel = offset × 2.613 and setback = offset × 2.414.' },
    { q: 'What is the 60 degree offset multiplier?', a: 'For 60° fittings, travel = offset × 1.155 and setback = offset × 0.577.' },
    { q: 'How do you find the true offset?', a: 'Square the roll and the set, add them and take the square root: √(roll² + set²). With a 9-in roll and a 12-in set the true offset is 15 in.' },
    { q: 'Is travel measured center to center?', a: 'Yes. Travel is the center-to-center distance between the two fittings along the offset pipe. Subtract each fitting\'s take-out to get the length of pipe to cut.' },
    { q: 'Can I use a rolling offset in a drain line?', a: 'Yes, rolling offsets are common in DWV piping, but drainage fittings must be the type approved for the change of direction, and horizontal sections must keep their required slope (commonly 1/4 in per foot for small drains). Check your plumbing code.' }
  ],
  related: ['pipe-volume-calculator', 'stair-calculator', 'roof-pitch-calculator', 'linear-feet-calculator'],
  sources: [
    { name: 'BC Plumbing Apprenticeship (TRU Open Press): C-1.10 Calculate required measurements for piping offsets', url: 'https://c-tradeactivities-electrical-bcplumbingapprl1.pressbooks.tru.ca/chapter/c-1-10-calculate-required-measurements-for-piping-offsets/' },
    { name: 'ICC: 2021 International Plumbing Code (drainage slope and fittings)', url: 'https://codes.iccsafe.org/content/IPC2021P1' }
  ]
};
