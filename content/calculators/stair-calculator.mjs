export default {
  slug: 'stair-calculator',
  hub: 'construction',
  name: 'Stair Calculator',
  title: 'Stair Calculator: 108-in Rise = 15 Risers of 7.2 in (IRC)',
  h1: 'Stair Calculator: Risers, Treads, Stringer Length and Angle',
  meta: 'A 108-in rise needs 15 risers of 7.2 in and 14 treads: a 12 ft 3 in run on 10.5-in treads and a 15 ft 2 in stringer. Checked against IRC R311.7 limits.',
  keyword: 'how to calculate steps in staircase',
  also: ['how to calculate the staircase', 'how to calculate deck stairs', 'how to calculate angle of stairs', 'how to calculate run and rise of stairs', 'how to calculate stair angle', 'how to calculate stairs with a landing', 'how to calculate stringers for deck stairs', 'stair calculator', 'stair stringer calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'rise', label: 'Total rise (finished floor to finished floor)', type: 'number', value: 108, suffix: 'in', wide: true },
    { id: 'target', label: 'Target riser height', type: 'number', value: 7.5, suffix: 'in', help: 'IRC maximum is 7¾ in. 7 to 7½ in is comfortable.' },
    { id: 'tread', label: 'Tread depth (run per step)', type: 'number', value: 10.5, suffix: 'in', help: 'IRC minimum is 10 in, nosing to nosing.' },
    { id: 'width', label: 'Stair width', type: 'number', value: 36, suffix: 'in' }
  ],
  compute(v, H) {
    if (!(v.rise > 0)) return { error: 'Enter the total rise from finished floor to finished floor.' };
    if (!(v.target > 0) || !(v.tread > 0)) return { error: 'Enter a target riser height and a tread depth.' };
    function frac(x) {
      var w = Math.floor(x + 1e-9), f = Math.round((x - w) * 16);
      if (f === 16) { w++; f = 0; }
      if (!f) return w + ' in';
      var d = 16; while (f % 2 === 0) { f /= 2; d /= 2; }
      return (w ? w + ' ' : '') + f + '/' + d + ' in';
    }
    function ftin(x) { var ft = Math.floor(x / 12 + 1e-9); return ft + ' ft ' + frac(x - ft * 12); }
    var n = Math.max(1, Math.ceil(v.rise / v.target - 1e-9));
    var riser = v.rise / n;
    var treads = n - 1;
    var run = treads * v.tread;
    var angle = Math.atan(riser / v.tread) * 180 / Math.PI;
    var stringer = Math.sqrt(v.rise * v.rise + run * run);
    var sizes = [8, 10, 12, 14, 16, 18, 20], board = null;
    for (var i = 0; i < sizes.length; i++) if (sizes[i] * 12 >= stringer + 6) { board = sizes[i]; break; }
    var width = v.width > 0 ? v.width : 36;
    var nStr = Math.ceil(width / 18 - 1e-9) + 1;
    var blondel = 2 * riser + v.tread;
    var issues = [];
    if (riser > 7.75 + 1e-9) issues.push('risers over the IRC 7¾-in maximum');
    if (v.tread < 10) issues.push('treads under the IRC 10-in minimum');
    if (width < 36) issues.push('width under the IRC 36-in minimum');
    if (v.rise > 151) issues.push('a rise over 151 in, so the IRC requires a landing');
    return {
      value: n + ' risers',
      label: 'Steps up at ' + H.fix(riser, 2) + ' in (' + frac(riser) + ') each',
      expr: H.num(v.rise, 2) + ' in ÷ ' + H.num(v.target, 2) + ' in = ' + H.num(v.rise / v.target, 2) + ' → ' + n,
      rows: [
        ['Treads', String(treads), true],
        ['Total run', H.num(run, 2) + ' in (' + ftin(run) + ')', true],
        ['Stair angle', H.fix(angle, 1) + '°'],
        ['Stringer length (diagonal)', ftin(stringer)],
        ['Stringer stock', board ? n > 1 ? nStr + ' × 2×12 at ' + board + ' ft' : '—' : 'over 20 ft: add a landing'],
        ['2 × riser + tread', H.num(blondel, 2) + ' in' + (blondel >= 24 && blondel <= 25.5 ? ' (comfortable)' : blondel < 24 ? ' (shallow)' : ' (steep)')],
        ['Handrail required (4+ risers)', n >= 4 ? 'Yes, 34–38 in high' : 'No']
      ],
      sub: issues.length ? 'Check: ' + issues.join('; ') + '.' : 'Meets IRC R311.7 riser (≤ 7¾ in), tread (≥ 10 in) and width (≥ 36 in) limits.'
    };
  },
  quick: ({ r }) => `To calculate the steps in a staircase, divide the total rise by your target riser height and round up. For a 108-in (9-ft) floor-to-floor rise: 108 ÷ 7.5 = 14.4, so <strong>${r.value}</strong> of 7.2 in and 14 treads. With 10.5-in treads the stairs run 147 in (12 ft 3 in) at 34.4°, on stringers about 15 ft 2 in long. The IRC caps risers at 7¾ in.`,
  stepsTitle: 'How to calculate stairs step by step',
  steps: [
    'Measure the total rise from the <strong>finished</strong> lower floor to the <strong>finished</strong> upper floor. Measuring to bare subfloor and then adding flooring later is the classic mistake: it makes the first or last step a different height, which the IRC limits to a 3/8-in variation.',
    'Divide the total rise by a target riser of 7 to 7½ in and round up to get the number of risers. Divide the total rise by that whole number for the exact riser height.',
    'Treads = risers − 1, because the upper floor is the last step. Multiply treads by the tread depth (10 in minimum, 10½ to 11 in is comfortable) for the total run.',
    'Check comfort: 2 × riser + tread should land between 24 and 25 in.',
    'Stringer length = √(rise² + run²). Buy the next lumber length up, and space cut stringers no more than about 18 in apart.'
  ],
  formulaTitle: 'What are the stair formulas?',
  formula: {
    expr: 'Risers = ⌈Total rise ÷ target riser⌉ &nbsp; Riser = Total rise ÷ Risers<br>Treads = Risers − 1 &nbsp; Run = Treads × Tread<br>Stringer = √(Rise² + Run²) &nbsp; Angle = arctan(Riser ÷ Tread)',
    vars: [['Total rise', 'finished floor to finished floor, in'], ['target riser', '7–7¾ in'], ['Tread', 'horizontal depth per step, nosing to nosing, in'], ['⌈ ⌉', 'round up']]
  },
  example: `<p>A basement stair runs from a finished slab to a finished first floor 108 in above it, 36 in wide.</p>
<p>Risers: 108 ÷ 7.5 = 14.4 → <strong>15 risers</strong> of 108 ÷ 15 = <strong>7.2 in</strong> (just over 7 3/16 in).</p>
<p>Treads: 15 − 1 = <strong>14</strong>. Total run at 10.5 in: 14 × 10.5 = <strong>147 in</strong> (12 ft 3 in). Angle: arctan(7.2 ÷ 10.5) = <strong>34.4°</strong>. Comfort check: 2 × 7.2 + 10.5 = 24.9 in.</p>
<p>Stringer: √(108² + 147²) = √33,273 = <strong>182.4 in</strong> (15 ft 2 7/16 in), so cut three 2×12 × 16-ft stringers.</p>`,
  table: {
    title: 'How many steps for an 8, 9 or 10 foot rise?',
    intro: 'Risers, treads and run for common total rises, aiming for 7½-in risers and 10½-in treads, calculated by the tool above.',
    head: ['Total rise', 'Risers', 'Riser height', 'Treads', 'Total run', 'Stringer'],
    rows: ({ run }) => [18, 24, 30, 36, 48, 60, 72, 84, 96, 102, 108, 114, 120, 144].map(h => { const r = run({ rise: h, target: 7.5, tread: 10.5, width: 36 }); return [h + ' in (' + Math.floor(h / 12) + "' " + (h % 12) + '")', r.value.replace(' risers', ''), r.label.replace(/^Steps up at /, '').replace(/ each$/, ''), r.rows[0][1], r.rows[1][1].replace(/ \(.*/, ''), r.rows[3][1]]; }),
    note: 'Floor-to-floor height for an 8-ft ceiling is usually about 105–110 in once you add the floor joists and subfloor; measure yours. Rises over 151 in need a landing.'
  },
  sections: [
    {
      h2: 'What does the IRC require for residential stairs?',
      html: `<p>The International Residential Code, Section R311.7, sets the rules most U.S. homes are inspected against:</p>
<ul><li><strong>Riser height:</strong> 7¾ in maximum, with no more than 3/8 in difference between the tallest and shortest riser in a flight.</li><li><strong>Tread depth:</strong> 10 in minimum measured nosing to nosing, with the same 3/8-in tolerance.</li><li><strong>Nosing:</strong> ¾ to 1¼ in on stairs with solid risers, unless treads are at least 11 in deep.</li><li><strong>Width:</strong> 36 in minimum clear above the handrail height.</li><li><strong>Headroom:</strong> 6 ft 8 in minimum, measured plumb from the line of the nosings.</li><li><strong>Height of a flight:</strong> no more than 151 in between floors or landings.</li><li><strong>Handrail:</strong> required on at least one side once there are four or more risers, 34–38 in above the nosings.</li></ul>
<p>At the code limits (7¾-in risers, 10-in treads) a stair is about 37.8°, which is steep; most designers aim for 32–35°.</p>`
    },
    {
      h2: 'How do you calculate stairs with a landing?',
      html: `<p>Work out the risers for the whole height first, then split them between flights. A landing doesn't change the riser count; it replaces one tread with a platform at least 36 in deep and as wide as the stair. For the 108-in example, 15 risers could be split 7 + 8: the lower flight has 7 risers and 6 treads to the landing, and the upper flight 8 risers and 7 treads. Each flight then gets its own stringers, and the landing height is 7 × 7.2 = 50.4 in above the floor.</p>
<p>An L- or U-shaped stair with a landing fits a much shorter footprint, and the IRC requires one anywhere the total rise exceeds 151 in.</p>`
    },
    {
      h2: 'How do you calculate deck stairs?',
      html: `<p>Use the same math, but measure the total rise from the top of the deck boards to the ground where the bottom step will land, not straight down from the deck edge: sloping ground changes the height.</p>
<p>Deck stairs follow the same IRC limits. Cut stringers from 2×12s are typically limited to about 18 in on center (12 in for composite or thin treads; follow the decking maker's span), so a 36-in stair takes three stringers and a 48-in stair four. Rest the bottom on a concrete pad, not on soil.</p>`
    },
    {
      h2: 'How do you calculate the angle of stairs?',
      html: `<p>The angle is the arctangent of rise over run for one step: arctan(riser ÷ tread). 7-in risers on 11-in treads give 32.5°, 7.5 on 10.5 give 35.5°, and the IRC limit of 7¾ on 10 gives 37.8°. Above roughly 50° you are building a ship's ladder or alternating-tread device, which the code only allows in limited cases.</p>`
    }
  ],
  faq: [
    { q: 'How many steps do I need for 8 feet?', a: 'An 8-ft (96-in) total rise needs 13 risers of about 7.38 in and 12 treads. With 10.5-in treads that is a run of 126 in (10 ft 6 in).' },
    { q: 'What is the most comfortable stair rise and run?', a: 'A riser of 7 to 7½ in with a tread of 10½ to 11 in. The traditional rule is 2 × riser + tread = 24 to 25 in, so a 7-in riser pairs with an 11-in tread.' },
    { q: 'Do you count the top floor as a step?', a: 'Not as a tread. You always have one more riser than treads, because the last riser steps you onto the upper floor. 15 risers means 14 treads.' },
    { q: 'How long is a stair stringer for a 9-foot rise?', a: 'With 15 risers of 7.2 in and 14 treads of 10.5 in, the stringer diagonal is about 182 in (15 ft 2 in), so you cut it from a 16-ft 2×12.' },
    { q: 'How much carpet do I need for stairs?', a: 'For each step, add tread depth, riser height and about 2 in to wrap the nosing. With 7.2-in risers and 10.5-in treads that is about 20 in per step; 14 steps plus the bottom riser need about 24 ft of runner.' },
    { q: 'Can stair risers be different heights?', a: 'Only by 3/8 in within a flight under the IRC. Plan for the finished floor thickness at the top and bottom so the first and last risers match the rest.' }
  ],
  related: ['framing-calculator', 'board-foot-calculator', 'roof-pitch-calculator', 'square-footage-calculator', 'concrete-calculator'],
  sources: [
    { name: 'ICC: 2021 International Residential Code, Section R311.7 Stairways', url: 'https://codes.iccsafe.org/content/IRC2021P1' },
    { name: 'American Wood Council: DCA 6 Prescriptive Residential Wood Deck Construction Guide', url: 'https://awc.org/codes-standards/publications/dca6/' }
  ]
};
