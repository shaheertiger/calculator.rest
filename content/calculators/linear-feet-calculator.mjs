export default {
  slug: 'linear-feet-calculator',
  hub: 'construction',
  name: 'Linear Feet Calculator',
  title: 'Linear Feet Calculator: 14\'3" × 12\'6" Room = 53.5 LF of Trim',
  h1: 'Linear Feet Calculator: Add Up Pieces or Convert From Square Feet',
  meta: 'Total linear feet for trim, fence, boards or decking, with waste and stock lengths. A 14\'3" × 12\'6" room takes 53.5 LF; 300 sq ft of 5½" decking is 640 LF.',
  keyword: 'how to calculate linear feet',
  also: ['how to calculate linear footage', 'how to calculate linear feet from square feet', 'how do you calculate linear feet from square feet', 'how to calculate linear square feet', 'how do you calculate linear foot', 'how to calculate square feet into linear feet', 'how to calculate square feet from linear feet', 'how to calculate linear feet for fence', 'how to calculate linear ft', 'how do i calculate linear feet'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you want to do?', type: 'select', value: 'pieces', wide: true, options: [['pieces', 'Add up pieces (trim, fence, boards)'], ['area', 'Square feet → linear feet'], ['toarea', 'Linear feet → square feet']] },
    {
      id: 'pieces', label: 'Pieces or runs', type: 'rows', addLabel: '+ add piece', max: 40, showIf: { mode: ['pieces'] },
      fields: [
        { id: 'name', label: 'What (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. North wall' },
        { id: 'qty', label: 'How many', type: 'number', value: 1 },
        { id: 'ft', label: 'Length ft', type: 'number', value: 8 },
        { id: 'inch', label: 'in', type: 'number', value: '', blank: true, placeholder: '0' }
      ],
      value: [
        { name: 'Long walls', qty: 2, ft: 14, inch: 3 },
        { name: 'Short walls', qty: 2, ft: 12, inch: 6 }
      ]
    },
    { id: 'area', label: 'Area to cover', type: 'number', value: 300, suffix: 'sq ft', showIf: { mode: ['area'] } },
    { id: 'lf', label: 'Linear feet you have', type: 'number', value: 640, suffix: 'LF', showIf: { mode: ['toarea'] } },
    { id: 'width', label: 'Board width (actual face)', type: 'number', value: 5.5, suffix: 'in', showIf: { mode: ['area', 'toarea'] }, help: 'A nominal 1×6 or 5/4×6 deck board is 5½ in wide.' },
    { id: 'gap', label: 'Gap between boards', type: 'number', value: 0.125, suffix: 'in', showIf: { mode: ['area', 'toarea'] }, help: '⅛ in = 0.125. Use 0 for tongue-and-groove.' },
    { id: 'waste', label: 'Waste allowance', type: 'number', value: 10, suffix: '%', showIf: { mode: ['pieces', 'area'] } },
    { id: 'stock', label: 'Stock length you buy', type: 'select', value: '16', showIf: { mode: ['pieces', 'area'] }, options: [['8', '8 ft'], ['10', '10 ft'], ['12', '12 ft'], ['14', '14 ft'], ['16', '16 ft'], ['20', '20 ft'], ['0', 'Bought by the foot']] },
    { id: 'price', label: 'Price per linear foot (optional)', type: 'number', value: '', prefix: '$', placeholder: 'e.g. 1.25', showIf: { mode: ['pieces', 'area'] } }
  ],
  compute(v, H) {
    function n(x) { return typeof x === 'number' && isFinite(x) ? x : 0; }
    var w = n(v.width), g = n(v.gap);
    if (v.mode === 'toarea') {
      if (!(v.lf > 0)) return { error: 'Enter the linear feet.' };
      if (!(w > 0)) return { error: 'Enter the board width in inches.' };
      var sq = v.lf * (w + g) / 12;
      return { value: H.num(sq, 2) + ' sq ft', label: 'Area covered', expr: H.num(v.lf, 2) + ' LF × ' + H.num(w + g, 3) + ' in ÷ 12', rows: [['Coverage per linear foot', H.num((w + g) / 12, 4) + ' sq ft'], ['Square yards', H.num(sq / 9, 2) + ' sq yd'], ['Square meters', H.num(sq * 0.09290304, 2) + ' m²']], sub: 'Each linear foot of a ' + H.num(w, 3) + '-inch board covers ' + H.num((w + g) * 12, 2) + ' square inches including the gap.' };
    }
    var base = 0, expr = '', rows = [];
    if (v.mode === 'area') {
      if (!(v.area > 0)) return { error: 'Enter the area in square feet.' };
      if (!(w > 0)) return { error: 'Enter the board width in inches.' };
      base = v.area * 12 / (w + g);
      expr = H.num(v.area, 2) + ' sq ft × 12 ÷ ' + H.num(w + g, 3) + ' in';
      rows.push(['Linear feet per sq ft', H.num(12 / (w + g), 4)]);
    } else {
      var parts = [];
      (v.pieces || []).forEach(function (p) {
        var len = n(p.ft) + n(p.inch) / 12, q = p.qty > 0 ? p.qty : (p.qty === 0 ? 0 : 1);
        if (!(len > 0) || !(q > 0)) return;
        base += q * len;
        parts.push((q !== 1 ? H.num(q, 2) + ' × ' : '') + H.num(len, 3));
      });
      if (!(base > 0)) return { error: 'Enter at least one piece with a length.' };
      expr = parts.join(' + ').slice(0, 80) + ' ft';
      rows.push(['In inches', H.num(base * 12, 1) + ' in']);
      rows.push(['In meters', H.num(base * 0.3048, 2) + ' m']);
    }
    var waste = n(v.waste) > 0 ? n(v.waste) : 0;
    var buy = base * (1 + waste / 100);
    rows.push(['With ' + H.num(waste, 1) + '% waste', H.num(buy, 2) + ' LF', true]);
    var stock = Number(v.stock);
    if (stock > 0) rows.push([stock + '-ft pieces to buy', String(Math.ceil(buy / stock - 1e-9)), true]);
    if (v.price > 0) rows.push(['Cost at ' + H.money(v.price) + '/LF', H.money((stock > 0 ? Math.ceil(buy / stock - 1e-9) * stock : buy) * v.price)]);
    return {
      value: H.num(base, 2) + ' LF',
      label: 'Linear feet (before waste)',
      expr: expr,
      rows: rows,
      sub: 'Linear feet measure length only. Buy ' + H.num(buy, 2) + ' LF to cover cuts, miters and bad ends.'
    };
  },
  quick: ({ r }) => `To calculate linear feet, add the lengths of every piece in feet, ignoring width. Baseboard for a 14'3" × 12'6" room is 14.25 + 14.25 + 12.5 + 12.5 = <strong>${r.value}</strong>; with 10% waste that is 58.85 ft, or four 16-ft boards. To go from square feet, divide by the board width in feet: 300 sq ft of 5½-inch decking with ⅛-inch gaps needs 640 LF.`,
  stepsTitle: 'How to calculate linear feet in 4 steps',
  steps: [
    'Measure each run end to end along the line where the material goes: the bottom of each wall for baseboard, the property line for fence, the length of each board for lumber.',
    'Convert inches to feet by dividing by 12 (3 in = 0.25 ft, 6 in = 0.5 ft, 9 in = 0.75 ft) and multiply by the number of identical pieces.',
    'Add the runs. For area jobs such as decking or paneling, switch the mode and divide square feet by the board\'s actual width in feet, including the gap. Use the actual width (5½ in for a 1×6), not the nominal name; that is the usual mistake.',
    'Add waste (5–10% for straight runs, 15% for lots of miters) and round up to whole stock lengths, since lumber and trim come in 8, 10, 12 and 16-ft pieces.'
  ],
  formulaTitle: 'What is the formula for linear feet?',
  formula: {
    expr: 'Linear feet = Σ (quantity × length in ft)<br>From inches: LF = total inches ÷ 12<br>From area: LF = sq ft × 12 ÷ (board width in + gap in)<br>To area: sq ft = LF × (board width in + gap in) ÷ 12',
    vars: [['LF', 'linear feet, a length in feet with no width'], ['board width', 'actual face width in inches'], ['gap', 'spacing between boards in inches'], ['12', 'inches per foot']]
  },
  example: `<p><strong>Trim:</strong> a bedroom is 14'3" × 12'6". The perimeter is 2 × 14.25 + 2 × 12.5 = <strong>53.5 LF</strong>. Adding 10% for miters gives 58.85 LF, so buy four 16-ft lengths (64 ft). If there is a 3-ft door opening, subtract it first: 50.5 LF before waste.</p>
<p><strong>Decking:</strong> a 20 × 15 ft deck is 300 sq ft. Each 5½-inch board with a ⅛-inch gap covers 5.625 in of width, so the deck needs 300 × 12 ÷ 5.625 = <strong>640 LF</strong>. That would be exactly forty 16-ft boards if nothing were cut, but boards running the 15-ft way need 20 × 12 ÷ 5.625 = 42.7 rows, so you buy 43 sixteen-footers (688 LF). The offcuts are why the waste allowance exists.</p>`,
  table: {
    title: 'How many linear feet are in a square foot for each board width?',
    intro: 'Linear feet needed to cover an area with boards laid tight (no gap), computed by the calculator from actual lumber widths.',
    head: ['Board (nominal)', 'Actual width', 'LF per sq ft', 'LF for 100 sq ft', '8-ft boards for 100 sq ft'],
    rows: ({ run, H }) => [['2¼" strip flooring', 2.25], ['1×4', 3.5], ['1×6, 2×6, 5/4×6 deck', 5.5], ['1×8', 7.25], ['1×10', 9.25], ['1×12', 11.25], ['12-inch panel', 12], ['4-ft sheet goods', 48]].map(([name, w]) => {
      const r = run({ mode: 'area', area: 100, width: w, gap: 0, waste: 0, stock: '8', price: NaN });
      const lf = 100 * 12 / w;
      return [name, H.num(w, 2) + ' in', H.num(12 / w, 3), r.value, String(Math.ceil(lf / 8 - 1e-9))];
    }),
    note: 'Lumber is sold by nominal size; the dressed (actual) width is smaller. Add your gap for decking and your waste allowance before ordering.'
  },
  sections: [
    {
      h2: 'How do you calculate linear feet from square feet?',
      html: `<p>Linear feet and square feet only connect through a width. Divide the area by the width of the material in feet (or multiply the area by 12 and divide by the width in inches). Shiplap that shows 7¼ in per board needs 200 × 12 ÷ 7.25 = 331 LF to cover a 200 sq ft wall. Because this depends entirely on the width, there's no single “square feet to linear feet” factor: 100 sq ft is 100 LF of 12-inch boards but 218 LF of 5½-inch boards.</p>
<p>Two details change the answer more than people expect:</p>
<ul><li><strong>Actual vs nominal width.</strong> A “1×6” is planed to about ¾ × 5½ in, a 1×8 to 7¼ in, a 1×10 to 9¼ in. Using the nominal 6 in instead of 5½ in under-orders by about 8%.</li><li><strong>Exposure and gaps.</strong> Decking has a gap (commonly ⅛ to ¼ in), which <em>adds</em> coverage per board. Lap siding and tongue-and-groove lose width to the overlap or tongue, so use the exposed face, not the full board.</li></ul>`
    },
    {
      h2: 'How do you convert linear feet to square feet?',
      html: `<p>Reverse it: multiply the linear feet by the width in feet. 640 LF of 5½-inch decking with ⅛-inch gaps covers 640 × 5.625 ÷ 12 = 300 sq ft; 120 LF of 3¼-inch hardwood strip covers 120 × 3.25 ÷ 12 = 32.5 sq ft. Choose “Linear feet → square feet” above to do this for any width.</p>
<p>This is the check to run when a supplier quotes a price per linear foot and you want to compare it with a price per square foot. A board at $2.40 per LF that is 5½ in wide works out to $2.40 × 12 ÷ 5.5 = <strong>$5.24 per sq ft</strong> of coverage, before waste.</p>`
    },
    {
      h2: 'How many linear feet of fence do I need?',
      html: `<p>Measure the property line the fence will follow and subtract openings that get a gate instead of panels. A backyard 80 ft wide and 60 ft deep, fenced on three sides with the house closing the fourth, is 80 + 60 + 60 = 200 LF; take out a 4-ft gate and 196 LF of fencing remains. With 8-ft panels that is 196 ÷ 8 = 24.5, so buy 25 panels.</p>
<p>Posts are counted separately: roughly one per panel plus one to finish each straight run, and a sturdier pair for the gate, so about 27 here. Board-on-board or picket fences built on site are figured by the board instead: a 6-ft fence of 5½-inch pickets set tight needs 12 ÷ 5.5 = 2.18 pickets per foot of fence, which is about 428 pickets for 196 ft (plus 5–10%). Check local rules on height and setbacks before you buy; many cities limit backyard fences to 6 ft.</p>`
    },
    {
      h2: 'How do you calculate linear feet for baseboard, trim and crown molding?',
      html: `<p>For baseboard, measure the length of every wall at floor level and add them, then subtract door openings (usually 3 ft each) but not windows. A room with a 14'3" and a 12'6" wall pair has a 53.5-ft perimeter; minus one door it needs 50.5 LF. Crown molding follows the full perimeter at the ceiling, so don't subtract doors, and allow 15% or more because inside and outside corners are mitered or coped.</p>
<p>Door and window casing is counted per opening: a standard 36 × 80 in door takes about 17 LF of casing per side once you include the head piece and miter cuts, so about 34 LF for both sides. Buy pieces long enough to run each wall without a splice where you can; a 14'3" wall needs a 16-ft board, and two 8-ft pieces would leave a visible joint.</p>`
    },
    {
      h2: 'What is the difference between linear feet, square feet and board feet?',
      html: `<ul>
<li><strong>Linear foot (LF):</strong> one foot of length, whatever the width or thickness. Trim, fencing, gutters, countertop edges and cabinets are priced this way.</li>
<li><strong>Square foot (sq ft):</strong> a 1 × 1 ft area. Flooring, drywall, roofing and paint coverage use it; see the <a href="/square-footage-calculator">square footage calculator</a>.</li>
<li><strong>Board foot (BF):</strong> a volume of wood 12 × 12 × 1 in (144 cubic inches), used for hardwood lumber. A 1×6 that is 8 ft long is 8 LF but 4 BF; the <a href="/board-foot-calculator">board foot calculator</a> handles that conversion.</li>
<li><strong>Linear inches:</strong> airlines use a different idea entirely: length + width + height of a bag. Major U.S. airlines cap standard checked bags at 62 linear inches.</li>
</ul>
<p>"Linear square feet" is not a real unit. It usually means someone wants to convert between the two, which needs the width.</p>`
    }
  ],
  faq: [
    { q: 'Is a linear foot the same as a foot?', a: 'Yes. A linear foot is 12 inches of length. The word “linear” just signals that width and thickness are ignored when the material is priced or counted.' },
    { q: 'How many linear feet are in 100 square feet?', a: 'It depends on the width. For 12-inch-wide material it is 100 LF; for 6-inch material, 200 LF; for 5½-inch boards, about 218 LF. Divide the area by the width in feet.' },
    { q: 'How do I calculate linear feet from inches?', a: 'Add up all the lengths in inches and divide by 12. Three boards of 30 in each are 90 in ÷ 12 = 7.5 linear feet.' },
    { q: 'How many linear feet is a 12 x 12 room?', a: 'The perimeter of a 12 × 12 ft room is 48 linear feet. Subtract about 3 ft for each door when ordering baseboard.' },
    { q: 'How many 8-foot boards make 100 linear feet?', a: '100 ÷ 8 = 12.5, so you need 13 boards, or 14 with about 10% for waste.' },
    { q: 'How do you calculate linear feet for cabinets?', a: 'Measure the length of the cabinet run along each wall and add them. Cabinet prices quoted per linear foot cover both base and wall cabinets along that length unless the quote says otherwise.' },
    { q: 'How do I figure linear feet for a fence with a gate?', a: 'Measure the full fence line, subtract the gate width, and divide by the panel length for the number of panels. Buy the gate and its posts separately.' },
    { q: 'How much waste should I add for trim?', a: 'Add about 10% for baseboard and casing in an ordinary room and 15% or more for crown molding or rooms with many corners. Round up to whole stock lengths.' }
  ],
  related: ['board-foot-calculator', 'square-footage-calculator', 'framing-calculator', 'flooring-calculator', 'drywall-calculator'],
  sources: [
    { name: 'NIST: Voluntary Product Standards program (PS 20 American Softwood Lumber Standard)', url: 'https://www.nist.gov/standardsgov/voluntary-product-standards-program' },
    { name: 'NIST: Unit conversion (length and area)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' },
    { name: 'American Lumber Standard Committee', url: 'https://www.alsc.org/' }
  ]
};
