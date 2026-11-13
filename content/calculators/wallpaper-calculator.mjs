export default {
  slug: 'wallpaper-calculator',
  hub: 'construction',
  name: 'Wallpaper Calculator',
  title: 'Wallpaper Calculator: 12×14 Room, 8-ft Walls = 10 Rolls',
  h1: 'Wallpaper Calculator: Strips, Rolls and Pattern Repeat',
  meta: 'A 12 × 14 ft room with 8-ft walls and one door needs 29 strips, or 10 rolls of 20.5-in × 33-ft wallpaper with a 21-in repeat. Count rolls by strips, not area.',
  keyword: 'how to calculate how much wallpaper i need',
  also: ['how do you calculate wallpaper', 'how do you calculate how much wallpaper you need', 'how to calculate wallpaper needs', 'how to calculate wallpaper yardage', 'wallpaper calculator', 'how many rolls of wallpaper do i need'],
  updated: '2026-11-13',
  inputs: [
    { id: 'len', label: 'Room length', type: 'number', value: 14, suffix: 'ft' },
    { id: 'wid', label: 'Room width', type: 'number', value: 12, suffix: 'ft' },
    { id: 'height', label: 'Wall height', type: 'number', value: 8, suffix: 'ft' },
    { id: 'skip', label: 'Width of doors and openings to skip', type: 'number', value: 3, suffix: 'ft', help: 'A standard door is 3 ft. Leave windows in unless they are very wide.' },
    { id: 'rollW', label: 'Roll width', type: 'number', value: 20.5, suffix: 'in' },
    { id: 'rollL', label: 'Roll length', type: 'number', value: 33, suffix: 'ft' },
    { id: 'repeat', label: 'Pattern repeat', type: 'number', value: 21, suffix: 'in', help: '0 for plain or random-match paper.' },
    { id: 'match', label: 'Match type', type: 'select', value: 'straight', options: [['straight', 'Straight match'], ['drop', 'Half-drop match'], ['random', 'Random / free match']] }
  ],
  compute(v, H) {
    if (!(v.len > 0) || !(v.wid > 0) || !(v.height > 0)) return { error: 'Enter the room length, width and wall height.' };
    if (!(v.rollW > 0) || !(v.rollL > 0)) return { error: 'Enter the roll width and length from the label.' };
    var skip = v.skip > 0 ? v.skip : 0;
    var perim = 2 * (v.len + v.wid) - skip;
    if (!(perim > 0)) return { error: 'The openings are wider than the room perimeter.' };
    var rep = v.repeat > 0 && v.match !== 'random' ? v.repeat : 0;
    var strips = Math.ceil(perim * 12 / v.rollW - 1e-9);
    var cut = v.height * 12 + 4;
    if (rep) cut = Math.ceil(cut / rep - 1e-9) * rep;
    if (rep && v.match === 'drop') cut += rep / 2;
    var perRoll = Math.floor(v.rollL * 12 / cut + 1e-9);
    if (perRoll < 1) return { error: 'One strip (' + H.num(cut, 1) + ' in) is longer than a roll. Check the roll length.' };
    var rolls = Math.ceil(strips / perRoll - 1e-9);
    var rollArea = v.rollW / 12 * v.rollL;
    var wallArea = perim * v.height;
    var areaRolls = Math.ceil(wallArea / rollArea - 1e-9);
    var used = wallArea / (rolls * rollArea) * 100;
    return {
      value: rolls + ' rolls',
      label: 'Wallpaper rolls (' + H.num(v.rollW, 2) + ' in × ' + H.num(v.rollL, 2) + ' ft)',
      expr: strips + ' strips ÷ ' + perRoll + ' strips per roll',
      rows: [
        ['Strips (drops) needed', String(strips), true],
        ['Cut length per strip', H.num(cut, 2) + ' in (' + H.num(cut / 12, 2) + ' ft)'],
        ['Full strips per roll', String(perRoll)],
        ['Wall area to cover', H.int(wallArea) + ' sq ft'],
        ['Area-only estimate (too low)', areaRolls + ' rolls'],
        ['Paper on the wall vs bought', H.pct(used, 0)],
        ['If sold by the yard', H.num(strips * cut / 36, 1) + ' linear yd']
      ],
      sub: 'Buy all ' + rolls + ' rolls from one batch (dye lot) number; a spare roll is cheap insurance for repairs.'
    };
  },
  quick: ({ r }) => `To calculate how much wallpaper you need, count strips, not square feet. A 12 × 14 ft room has a 52-ft perimeter; minus a 3-ft door that is 49 ft, or 29 strips of 20.5-in paper. Each 8-ft wall needs 105 in per strip with a 21-in repeat, so a 33-ft roll gives 3 strips: <strong>${r.value}</strong>. Area alone says 7.`,
  stepsTitle: 'How to calculate how much wallpaper you need',
  steps: [
    'Measure the length of every wall you are papering and add them up (for a whole room, the perimeter). Subtract doors and other full-height openings; leave normal windows in, since the paper above and below them is cut from full strips anyway.',
    'Divide that length in inches by the roll width and round up to get the number of strips (drops).',
    'Work out the cut length: wall height plus 4 in for trimming, rounded up to a whole number of pattern repeats. Add half a repeat for a half-drop match.',
    'Divide the roll length by the cut length and round <strong>down</strong>: leftover pieces shorter than a strip are waste. This is the step people skip, and why area-based estimates come up short.',
    'Divide strips by strips per roll and round up. Check that every roll carries the same batch number.'
  ],
  formulaTitle: 'What is the formula for wallpaper rolls?',
  formula: {
    expr: 'Strips = ⌈wall length × 12 ÷ roll width⌉<br>Cut = ⌈(height × 12 + 4) ÷ repeat⌉ × repeat (+ repeat ÷ 2 for half-drop)<br>Rolls = ⌈Strips ÷ ⌊roll length × 12 ÷ Cut⌋⌉',
    vars: [['wall length', 'total width of walls to cover, ft'], ['roll width', 'in (20.5 in is the most common)'], ['repeat', 'vertical pattern repeat, in'], ['⌈ ⌉, ⌊ ⌋', 'round up, round down']]
  },
  example: `<p>A 12 × 14 ft bedroom with 8-ft walls and one 3-ft door, papered with 20.5-in × 33-ft rolls and a 21-in straight-match repeat.</p>
<p>Wall length: 2 × (12 + 14) − 3 = <strong>49 ft</strong> = 588 in. Strips: 588 ÷ 20.5 = 28.7, so <strong>29 strips</strong>.</p>
<p>Cut length: 96 + 4 = 100 in, rounded up to 5 repeats of 21 in = <strong>105 in</strong>. Strips per roll: 396 ÷ 105 = 3.77, so <strong>3</strong>.</p>
<p>Rolls: 29 ÷ 3 = 9.67, so buy <strong>10 rolls</strong>. The area method (392 sq ft ÷ 56.4 sq ft per roll = 7 rolls) would leave you 2–3 rolls short.</p>`,
  table: {
    title: 'How many rolls of wallpaper do I need for a room?',
    intro: 'Rolls of 20.5-in paper with a 21-in repeat and one 3-ft door skipped: 33-ft rolls unless noted, straight match unless noted. Calculated with the strip method above.',
    head: ['Room', '8-ft walls', '9-ft walls, half-drop', 'Peel-and-stick 18-ft rolls, 8-ft walls', 'Area-only guess (8 ft)'],
    rows: ({ run }) => [[8, 10], [10, 10], [10, 12], [12, 12], [12, 14], [12, 16], [14, 16], [14, 18], [16, 20]].map(([w, l]) => {
      const base = { wid: w, len: l, skip: 3, rollW: 20.5, rollL: 33, repeat: 21, match: 'straight' };
      const a = run({ ...base, height: 8 });
      return [w + ' × ' + l + ' ft', a.value, run({ ...base, height: 9, match: 'drop' }).value, run({ ...base, height: 8, rollL: 18 }).value, a.rows[4][1]];
    }),
    note: 'Plain or random-match paper gives the same counts at 8 ft here, because 3 strips per roll is the limit either way.'
  },
  sections: [
    {
      h2: 'How big is a roll of wallpaper?',
      html: `<p>Most wallpaper sold in the U.S. today comes in rolls about <strong>20.5 in wide and 33 ft long</strong> (roughly 56 sq ft), often labeled a double roll. Some brands still quote prices per single roll but only sell double rolls, so compare the length on the label, not the word "roll". Other sizes you will see:</p>
<ul><li><strong>27 in wide</strong> traditional American goods, usually in shorter rolls.</li><li><strong>Peel-and-stick:</strong> often 20.5 in × 18 ft, about 31 sq ft, so you need nearly twice as many.</li><li><strong>Grasscloth and commercial vinyl:</strong> 36 in or wider, sold by the yard; use the yardage row in the results.</li></ul>`
    },
    {
      h2: 'How does pattern repeat change how much wallpaper you need?',
      html: `<p>Every strip has to start at the same point in the pattern, so its length is rounded up to a whole number of repeats. On 8-ft walls a 33-ft roll yields 3 strips whether the repeat is 0 or 25 in. The repeat starts to bite on taller walls: at 9 ft, a 21-in half-drop pushes the cut to 136.5 in, a 33-ft roll then gives only 2 strips, and a 12 × 14 room jumps from 10 rolls to 15.</p>
<p>A <strong>straight match</strong> lines up horizontally across every strip. A <strong>half-drop</strong> shifts every other strip by half the repeat, which uses more paper. <strong>Random match</strong> (stripes, textures, grasscloth) needs no allowance at all.</p>`
    },
    {
      h2: 'Should I subtract windows and doors from wallpaper?',
      html: `<p>Subtract doors, archways and built-ins that run floor to ceiling, because no full strip goes there. Don't subtract ordinary windows: you still cut the strips above and below a window from full-length drops, and the offcuts are rarely long enough to reuse. Picture windows or sliding doors wider than about 6 ft are the exception: subtract their width and add back one strip for the short pieces.</p>`
    },
    {
      h2: 'Why buy all the rolls at once?',
      html: `<p>Wallpaper is printed in batches, and color can shift slightly from one run to the next. The batch (lot) number is printed on each roll's label; buy every roll from the same batch and keep one spare. Reordering a single roll months later often means a visible mismatch on the wall, or no stock at all if the pattern has been discontinued.</p>`
    }
  ],
  faq: [
    { q: 'How many rolls of wallpaper do I need for a 10x12 room?', a: 'A 10 × 12 ft room with 8-ft walls and one door needs 8 rolls of 20.5-in × 33-ft wallpaper with a 21-in repeat (24 strips at 3 per roll).' },
    { q: 'How much wallpaper do I need for an accent wall?', a: 'Divide the wall width in inches by the roll width to get strips, then divide by strips per roll. A 12-ft wall that is 8 ft tall needs 144 ÷ 20.5 = 7.02, so 8 strips, or 3 rolls at 3 strips per roll.' },
    { q: 'How many square feet does a roll of wallpaper cover?', a: 'A 20.5-in × 33-ft roll covers about 56 sq ft on paper, but only about 41 sq ft of usable strips on an 8-ft wall, because the leftover piece on each roll is too short for another drop.' },
    { q: 'How do you calculate wallpaper yardage?', a: 'Multiply the number of strips by the cut length in inches and divide by 36. The default room above needs 29 strips × 105 in ÷ 36 = 84.6 linear yards of paper sold by the yard.' },
    { q: 'How much extra wallpaper should I buy?', a: 'The strip method already includes trim and pattern waste, so add one spare roll from the same batch for mistakes and future repairs rather than a percentage.' },
    { q: 'Do you wallpaper the ceiling the same way?', a: 'Yes, but measure across the shorter dimension: strips = room width ÷ roll width, and cut length = room length plus 4 in. Ceilings are much harder to hang, so many installers add an extra roll.' },
    { q: 'What is a pattern repeat on wallpaper?', a: 'It is the vertical distance before the design starts again, printed on the label in inches or centimeters. A larger repeat means more waste per strip.' }
  ],
  related: ['drywall-calculator', 'square-footage-calculator', 'linear-feet-calculator', 'flooring-calculator'],
  sources: [
    { name: 'York Wallcoverings: product labels and installation guidance', url: 'https://www.yorkwallcoverings.com/' },
    { name: 'Graham & Brown: wallpaper roll sizes and hanging guides', url: 'https://www.grahambrown.com/us/' }
  ]
};
