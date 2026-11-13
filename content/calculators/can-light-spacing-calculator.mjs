export default {
  slug: 'can-light-spacing-calculator',
  hub: 'construction',
  name: 'Recessed Light Spacing Calculator',
  title: 'Can Light Spacing Calculator: 8-ft Ceiling = 4 ft Apart',
  h1: 'Recessed (Can) Light Layout: How Many Lights and Where',
  meta: 'Space recessed lights at half the ceiling height: 4 ft apart and 2 ft from the walls under an 8-ft ceiling. A 12 × 16 ft room takes 12 lights in 3 rows of 4.',
  keyword: 'can light spacing calculator',
  also: ['can light layout calculator', 'can light placement calculator', 'can lighting layout calculator', 'recessed lighting layout calculator', 'how many recessed lights do i need', 'how far apart should recessed lights be'],
  updated: '2026-11-13',
  inputs: [
    { id: 'len', label: 'Room length', type: 'number', value: 16, suffix: 'ft' },
    { id: 'wid', label: 'Room width', type: 'number', value: 12, suffix: 'ft' },
    { id: 'height', label: 'Ceiling height', type: 'number', value: 8, suffix: 'ft' },
    { id: 'rule', label: 'Spacing', type: 'select', value: 'half', options: [['half', 'Even general light: ceiling height ÷ 2'], ['custom', 'Custom spacing']] },
    { id: 'custom', label: 'Custom spacing between lights', type: 'number', value: 5, suffix: 'ft', showIf: { rule: ['custom'] } }
  ],
  compute(v, H) {
    if (!(v.len > 0) || !(v.wid > 0)) return { error: 'Enter the room length and width.' };
    var s = v.rule === 'custom' ? v.custom : v.height / 2;
    if (!(s > 0)) return { error: v.rule === 'custom' ? 'Enter the spacing you want between lights.' : 'Enter the ceiling height.' };
    function ftin(x) { var ft = Math.floor(x + 1e-9), inch = Math.round((x - ft) * 12); if (inch === 12) { ft++; inch = 0; } return ft + ' ft' + (inch ? ' ' + inch + ' in' : ''); }
    var cols = Math.max(1, Math.round(v.len / s)), rows = Math.max(1, Math.round(v.wid / s));
    var sx = v.len / cols, sy = v.wid / rows;
    var n = cols * rows;
    return {
      value: n + ' lights',
      label: rows + (rows === 1 ? ' row' : ' rows') + ' of ' + cols + ' recessed lights',
      expr: H.num(v.len, 2) + ' × ' + H.num(v.wid, 2) + ' ft at ' + H.num(s, 2) + ' ft spacing',
      rows: [
        ['Spacing along the length', ftin(sx), true],
        ['Spacing across the width', ftin(sy), true],
        ['First light from end walls', ftin(sx / 2)],
        ['First light from side walls', ftin(sy / 2)],
        ['Target spacing used', ftin(s)],
        ['Floor area per light', H.num(v.len * v.wid / n, 1) + ' sq ft']
      ],
      sub: 'Centers sit half a spacing from each wall, so light overlaps evenly across the floor. Put the lights on a dimmer.'
    };
  },
  quick: ({ r }) => `For even general lighting, space recessed lights about half the ceiling height apart and half that distance from the walls. Under an 8-ft ceiling that means 4 ft between cans and 2 ft from the walls, so a 12 × 16 ft room takes <strong>${r.value}</strong>: 3 rows of 4. A 9-ft ceiling stretches the spacing to 4½ ft.`,
  stepsTitle: 'How to lay out recessed lights',
  steps: [
    'Divide the ceiling height by 2 for the spacing between lights: 4 ft for an 8-ft ceiling, 4½ ft for 9 ft, 5 ft for 10 ft.',
    'Divide the room length and width by that spacing and round to whole numbers. Those are your columns and rows.',
    'Recalculate the exact spacing: room length ÷ columns and width ÷ rows, so the lights are evenly spread.',
    'Put the first row half a spacing from each wall. Placing cans a full spacing from the wall, or tight to it, is the usual layout mistake: it leaves a dark band or a hot spot on the wall.',
    'Mark the layout on the ceiling and check for joists, ducts and plumbing before cutting. Shift the whole row an inch or two rather than breaking the grid.'
  ],
  formulaTitle: 'What is the recessed lighting spacing formula?',
  formula: {
    expr: 'Spacing ≈ Ceiling height ÷ 2<br>Columns = round(L ÷ spacing) &nbsp; Rows = round(W ÷ spacing)<br>Lights = Columns × Rows &nbsp; Wall offset = spacing ÷ 2',
    vars: [['L, W', 'room length and width, ft'], ['spacing', 'distance between light centers, ft'], ['round', 'to the nearest whole number']],
    note: 'Half the ceiling height is a lighting-trade rule of thumb for 4- to 6-in downlights with typical beam spreads. Wide-beam fixtures can go farther apart; narrow-beam or accent trims need to be closer.'
  },
  example: `<p>A 12 × 16 ft family room has an 8-ft ceiling.</p>
<p>Spacing: 8 ÷ 2 = <strong>4 ft</strong>. Columns: 16 ÷ 4 = 4. Rows: 12 ÷ 4 = 3. Lights: 4 × 3 = <strong>12</strong>.</p>
<p>Layout: lights 4 ft apart in both directions, with the outer lights <strong>2 ft</strong> from every wall. Each light covers 16 sq ft of floor.</p>
<p>If the same room had a 10-ft ceiling, spacing becomes 5 ft: 16 ÷ 5 = 3.2 → 3 columns at 5 ft 4 in, and 12 ÷ 5 = 2.4 → 2 rows at 6 ft, for <strong>6 lights</strong>.</p>`,
  table: {
    title: 'How many recessed lights do I need for my room size?',
    intro: 'Light counts (rows × columns) using the ceiling height ÷ 2 rule, calculated with the tool above.',
    head: ['Room', '8-ft ceiling', '9-ft ceiling', '10-ft ceiling'],
    rows: ({ run }) => [[10, 10], [10, 12], [12, 12], [12, 14], [12, 16], [14, 16], [14, 18], [16, 20], [18, 24], [20, 20]].map(([w, l]) => [w + ' × ' + l + ' ft', ...[8, 9, 10].map(h => { const r = run({ wid: w, len: l, height: h, rule: 'half' }); return r.value.replace(' lights', '') + ' (' + r.label.replace(/ recessed lights$/, '').replace(/ rows? of /, '×') + ')'; })]),
    note: 'Counts are for even general (ambient) light. Add separate task lights over counters, desks and islands, and accent lights for art.'
  },
  sections: [
    {
      h2: 'How far from the wall should recessed lights be?',
      html: `<p>For general lighting, put the first row <strong>half the spacing</strong> from the wall: about 2 ft under an 8-ft ceiling. That way the wall gets the same overlap of light as the middle of the room.</p>
<p>To light the wall itself (art, a fireplace or a textured surface), use wall-wash or adjustable trims about <strong>1½ to 3 ft</strong> out from the wall, closer for low ceilings and farther for tall ones. Much closer than a foot and the light rakes down the wall in harsh scallops.</p>`
    },
    {
      h2: 'How do you place recessed lights in a kitchen?',
      html: `<p>Kitchens need task light where you work, not just a grid. Center a row of cans over the front half of the counters, roughly 18–24 in out from the wall for standard 25-in-deep counters, so light lands in front of you instead of behind your head. Space those lights about 3 to 4 ft apart along the run. Then fill the open floor with the ceiling-height ÷ 2 grid, and add pendants or a pair of cans over an island.</p>
<p>Under-cabinet lights do more for counter work than any ceiling can; plan both if you can.</p>`
    },
    {
      h2: '4-inch or 6-inch recessed lights?',
      html: `<p>Smaller apertures look cleaner and suit modern rooms, but each one puts out less light, so you need them on the tighter end of the spacing rule. 6-in fixtures throw more light and can sit farther apart in rooms with taller ceilings. Whatever the size, compare fixtures by <strong>lumens</strong>, color temperature and beam angle rather than watts; ENERGY STAR-certified downlights list all three.</p>
<p>Most new installs are integrated LED "wafer" lights that need no housing. If you do use cans, any fixture in an insulated ceiling must be <strong>IC-rated</strong> (rated for insulation contact) and, under the IECC energy code (R402.4.5), sealed and labeled for no more than 2.0 cfm of air leakage.</p>`
    }
  ],
  faq: [
    { q: 'How many recessed lights do I need for a 12x12 room?', a: 'With an 8-ft ceiling, 9 lights in a 3 × 3 grid, 4 ft apart and 2 ft from the walls. With a 10-ft ceiling, 4 lights in a 2 × 2 grid 6 ft apart work.' },
    { q: 'How far apart should 6-inch recessed lights be?', a: 'Start with half the ceiling height (4 ft under an 8-ft ceiling) and go up to roughly the ceiling height for bright, wide-beam 6-in fixtures used for general light. Check the spacing guidance on the fixture\'s spec sheet.' },
    { q: 'How far apart should 4-inch recessed lights be?', a: 'About half the ceiling height: 4 ft apart under 8-ft ceilings and 4½ ft under 9-ft ceilings, because 4-in lights usually have lower output and a narrower spread.' },
    { q: 'Should recessed lights be centered in the room?', a: 'The grid should be centered so the gaps to opposite walls match. Don\'t put a single light dead center in a room unless it is a small space like a hallway or closet; one light makes a hot spot with dark corners.' },
    { q: 'Can recessed lights be too close together?', a: 'Yes. Packing them in makes a "Swiss cheese" ceiling and uneven, glaring light. If a room still feels dim at the recommended spacing, use higher-lumen fixtures or add lamps and task lights rather than more holes.' },
    { q: 'How do I space recessed lights in a hallway?', a: 'Run a single line down the center, spaced about 6 to 8 ft apart, starting about half that distance from each end. Put one near every door and at any turn.' },
    { q: 'Do recessed lights need to be on a dimmer?', a: 'They don\'t have to be, but it is strongly recommended for living spaces. Use LED fixtures and a dimmer listed as compatible to avoid flicker and buzzing.' }
  ],
  related: ['square-footage-calculator', 'drywall-calculator', 'framing-calculator', 'flooring-calculator'],
  sources: [
    { name: 'ICC: 2021 International Energy Conservation Code, R402.4.5 Recessed lighting', url: 'https://codes.iccsafe.org/content/IECC2021P1' },
    { name: 'ENERGY STAR: Light fixtures and downlights', url: 'https://www.energystar.gov/products/light_fixtures' }
  ]
};
