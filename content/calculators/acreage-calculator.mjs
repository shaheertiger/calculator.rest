export default {
  slug: 'acreage-calculator',
  hub: 'construction',
  name: 'Acreage Calculator',
  title: 'Acreage Calculator: Irregular 4-Sided Lot = 0.88 Acres',
  h1: 'Acreage Calculator for Irregular Lots, Yards and Fields',
  meta: 'Get acres from four sides and a diagonal, a rectangle or a triangle. A 210, 180, 230 and 170 ft lot with a 290 ft diagonal is 38,346 sq ft, or 0.88 acres.',
  keyword: 'how to calculate acreage of an irregular lot',
  also: ['acreage calculator', 'how to calculate lawn size', 'how to calculate square footage of lawn', 'how to calculate yard square footage', 'how big is my yard calculator', 'how many acres is my lot', 'square feet to acres'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Lot shape', type: 'select', value: 'quad', wide: true, options: [['quad', '4 sides + one diagonal (exact)'], ['avg', '4 sides only (average method, approximate)'], ['rect', 'Rectangle'], ['tri', 'Triangle (3 sides)'], ['sqft', 'Convert an area I already know']] },
    { id: 'unit', label: 'Measured in', type: 'select', value: 'ft', options: [['ft', 'feet'], ['yd', 'yards'], ['m', 'meters']], showIf: { mode: ['quad', 'avg', 'rect', 'tri'] } },
    { id: 'a', label: 'Side A', type: 'number', value: 210, showIf: { mode: ['quad', 'avg', 'tri'] } },
    { id: 'b', label: 'Side B', type: 'number', value: 180, showIf: { mode: ['quad', 'avg', 'tri'] } },
    { id: 'c', label: 'Side C', type: 'number', value: 230, showIf: { mode: ['quad', 'avg', 'tri'] } },
    { id: 'd', label: 'Side D', type: 'number', value: 170, showIf: { mode: ['quad', 'avg'] } },
    { id: 'diag', label: 'Diagonal (A–B corner to C–D corner)', type: 'number', value: 290, showIf: { mode: ['quad'] }, help: 'The diagonal splits the lot into triangle A-B-diagonal and triangle C-D-diagonal.' },
    { id: 'length', label: 'Length', type: 'number', value: 208.71, showIf: { mode: ['rect'] } },
    { id: 'width', label: 'Width', type: 'number', value: 208.71, showIf: { mode: ['rect'] } },
    { id: 'sqft', label: 'Area', type: 'number', value: 21780, suffix: 'sq ft', showIf: { mode: ['sqft'] } }
  ],
  data: { toFt: { ft: 1, yd: 3, m: 1 / 0.3048 } },
  compute(v, H, D) {
    function heron(x, y, z) {
      if (!(x > 0 && y > 0 && z > 0)) return NaN;
      if (x + y <= z || x + z <= y || y + z <= x) return NaN;
      var s = (x + y + z) / 2;
      return Math.sqrt(s * (s - x) * (s - y) * (s - z));
    }
    var f = D.toFt[v.unit] || 1, sf, expr, note = '', rows = [];
    if (v.mode === 'sqft') {
      if (!(v.sqft > 0)) return { error: 'Enter the area in square feet.' };
      sf = v.sqft; expr = H.num(sf, 2) + ' sq ft ÷ 43,560';
    } else if (v.mode === 'rect') {
      if (!(v.length > 0) || !(v.width > 0)) return { error: 'Enter the length and width.' };
      sf = v.length * f * v.width * f; expr = H.num(v.length, 2) + ' × ' + H.num(v.width, 2) + ' ' + v.unit;
    } else if (v.mode === 'tri') {
      sf = heron(v.a * f, v.b * f, v.c * f);
      if (!(sf > 0)) return { error: 'Those three sides can\'t form a triangle. Each side must be shorter than the other two combined.' };
      expr = 'Heron: sides ' + H.num(v.a, 2) + ', ' + H.num(v.b, 2) + ', ' + H.num(v.c, 2);
    } else if (v.mode === 'avg') {
      if (!(v.a > 0 && v.b > 0 && v.c > 0 && v.d > 0)) return { error: 'Enter all four sides.' };
      sf = (v.a + v.c) / 2 * f * (v.b + v.d) / 2 * f;
      expr = '(' + H.num(v.a, 2) + ' + ' + H.num(v.c, 2) + ') ÷ 2 × (' + H.num(v.b, 2) + ' + ' + H.num(v.d, 2) + ') ÷ 2';
      note = 'The average method assumes near-right-angle corners and overstates the area of skewed lots. Add a diagonal for an exact answer.';
    } else {
      var t1 = heron(v.a * f, v.b * f, v.diag * f), t2 = heron(v.c * f, v.d * f, v.diag * f);
      if (!(t1 > 0) || !(t2 > 0)) return { error: 'The diagonal doesn\'t fit those sides. It must be shorter than A + B and C + D, and longer than the difference of each pair.' };
      sf = t1 + t2;
      expr = H.num(t1, 0) + ' + ' + H.num(t2, 0) + ' sq ft (two triangles)';
      rows.push(['Triangle A-B-diagonal', H.num(t1, 0) + ' sq ft']);
      rows.push(['Triangle C-D-diagonal', H.num(t2, 0) + ' sq ft']);
      var avg = (v.a + v.c) / 2 * f * (v.b + v.d) / 2 * f;
      rows.push(['Average method would say', H.num(avg / 43560, 4) + ' ac (' + (avg >= sf ? '+' : '−') + H.num(Math.abs(avg - sf), 0) + ' sq ft)']);
    }
    rows.unshift(['Square feet', H.num(sf, 0) + ' sq ft', true]);
    rows.push(['Square yards', H.num(sf / 9, 0) + ' sq yd']);
    rows.push(['Square meters', H.num(sf * 0.09290304, 0) + ' m²']);
    rows.push(['Hectares', H.num(sf * 0.09290304 / 10000, 4) + ' ha']);
    return {
      value: H.num(sf / 43560, 4) + (H.num(sf / 43560, 4) === '1' ? ' acre' : ' acres'),
      label: 'Lot area in acres',
      expr: expr,
      rows: rows,
      sub: note || ('That is ' + H.num(sf / 43560 * 100, 1) + '% of an acre; one acre is 43,560 sq ft.')
    };
  },
  quick: ({ r }) => `To calculate the acreage of an irregular lot, split it into two triangles with a diagonal, find each triangle's area with Heron's formula, add them and divide by 43,560. A lot with sides of 210, 180, 230 and 170 ft and a 290-ft diagonal is 18,804 + 19,542 = 38,346 sq ft, or <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate the acreage of an irregular lot',
  steps: [
    'Get the length of every side from your plat map, deed or survey, or measure them along the property line in feet.',
    'Measure one diagonal between opposite corners. This is the step people skip, and without it four sides alone can\'t fix the shape: a rectangle can lean into a parallelogram with the same sides and less area.',
    'Use Heron\'s formula on each triangle: s = (a + b + c) ÷ 2, area = √(s(s − a)(s − b)(s − c)). Add the two triangle areas.',
    'Divide square feet by 43,560 to get acres. For lots with five or more sides, add more diagonals from one corner and sum every triangle.'
  ],
  formulaTitle: 'What is the formula for acreage?',
  formula: {
    expr: 'Acres = square feet ÷ 43,560<br>Triangle (Heron): A = √(s(s − a)(s − b)(s − c)), s = (a + b + c) ÷ 2<br>Average method (approx.): A ≈ ((a + c) ÷ 2) × ((b + d) ÷ 2)',
    vars: [['a, b, c, d', 'side lengths, opposite sides a/c and b/d'], ['s', 'half the triangle\'s perimeter'], ['43,560', 'square feet in one acre (exact)']]
  },
  example: `<p>A lot has sides of 210, 180, 230 and 170 ft, and the diagonal from the corner between A and B to the corner between C and D measures 290 ft.</p>
<p>Triangle 1 (210, 180, 290): s = 340; area = √(340 × 130 × 160 × 50) = <strong>18,804 sq ft</strong>.</p>
<p>Triangle 2 (230, 170, 290): s = 345; area = √(345 × 115 × 175 × 55) = <strong>19,542 sq ft</strong>.</p>
<p>Total = 38,346 sq ft ÷ 43,560 = <strong>0.88 acres</strong> (0.8803). The average method gives 220 × 175 = 38,500 sq ft, 154 sq ft too high here, and the error grows as the corners get further from square.</p>`,
  table: {
    title: 'How many square feet are in common lot sizes?',
    intro: 'Lot sizes converted by the calculator, with the side of a square lot of that size for scale.',
    head: ['Acres', 'Square feet', 'Square meters', 'Hectares', 'Square lot side'],
    rows: ({ run, H }) => [[0.125, '⅛'], [0.25, '¼'], [1 / 3, '⅓'], [0.5, '½'], [0.75, '¾'], [1, '1'], [2, '2'], [2.5, '2½'], [5, '5'], [10, '10'], [40, '40']].map(([a, label]) => {
      const r = run({ mode: 'sqft', sqft: a * 43560 });
      return [label + ' acre' + (a > 1 ? 's' : ''), r.rows[0][1], r.rows.find(x => x[0] === 'Square meters')[1], r.rows.find(x => x[0] === 'Hectares')[1], H.num(Math.sqrt(a * 43560), 1) + ' ft'];
    })
  },
  sections: [
    {
      h2: 'Why can\'t you just average the sides of an irregular lot?',
      html: `<p>The quick “average opposite sides and multiply” method treats the lot as a rectangle. It is close when the corners are near 90°, but four side lengths don't pin down a shape: the same four sides can be pushed into a lopsided parallelogram with much less area. A 200 × 200 ft square is 0.92 acres; lean it so its corners are 60° and 120° and the sides are unchanged but the area drops to 34,641 sq ft, 0.80 acres. The average method would still say 0.92.</p>
<p>A diagonal fixes the shape, which is why the calculator asks for one. If you can't measure it, angles from a survey or the bearings on a plat map do the same job. For lots with curved frontage (common on cul-de-sacs), the plat lists the arc length and radius; the recorded area on the plat is the most reliable figure.</p>`
    },
    {
      h2: 'How big is an acre?',
      html: `<p>An acre is exactly 43,560 square feet, about 4,047 square meters or 0.405 hectares. As a square, it is about 208.7 ft on each side. Historically it was a strip one furlong (660 ft) long and one chain (66 ft) wide, which is where the odd number comes from: 660 × 66 = 43,560.</p>
<p>For scale, an American football field including both end zones is 360 × 160 ft = 57,600 sq ft, about 1.32 acres. A typical suburban quarter-acre lot is 10,890 sq ft, for example 99 × 110 ft. A square mile is 640 acres.</p>`
    },
    {
      h2: 'How do you calculate the size of your yard?',
      html: `<p>Start with the lot area, then subtract what isn't yard: the house footprint, garage, driveway, patio and any outbuildings. On a 0.25-acre lot (10,890 sq ft) with a 1,800 sq ft house footprint, a 600 sq ft driveway and a 300 sq ft patio, the yard is 10,890 − 2,700 = 8,190 sq ft, or 0.19 acres. For lawn seed, sod, fertilizer or sprinklers, measure only the lawn areas as rectangles and triangles and add them; the <a href="/square-footage-calculator">square footage calculator</a> handles the pieces.</p>`
    },
    {
      h2: 'Where can you find your lot\'s exact dimensions and acreage?',
      html: `<p>The recorded plat (subdivision map) and your deed list the boundary lengths and bearings, and the plat usually states the lot area. County property-tax and GIS websites show the parcel and an acreage figure, but GIS outlines are approximate and can be off by several feet, so don't use them for fences or building setbacks. A licensed land surveyor's boundary survey is the authoritative measurement and is what you need for a dispute, a sale contingency or new construction near a line.</p>
<p>Older surveys may use the U.S. survey foot, which NIST retired at the end of 2022 in favor of the international foot. The two differ by 2 parts per million, which changes the area of a one-acre lot by about 0.2 sq ft.</p>`
    }
  ],
  faq: [
    { q: 'How many square feet are in an acre?', a: 'Exactly 43,560 square feet. To convert square feet to acres, divide by 43,560.' },
    { q: 'How many acres is 100 by 100 feet?', a: 'A 100 × 100 ft lot is 10,000 sq ft, or 0.2296 acres, a little under a quarter acre.' },
    { q: 'How do I calculate acreage with four different side lengths?', a: 'Measure a diagonal, split the lot into two triangles, use Heron\'s formula on each and add them. Averaging opposite sides only works when the corners are close to square.' },
    { q: 'How many feet are on each side of an acre?', a: 'A square acre is about 208.71 ft on each side. A one-acre lot can be any shape, though, such as 100 × 435.6 ft.' },
    { q: 'How many acres is a half-acre lot in square feet?', a: 'A half acre is 21,780 square feet, for example about 147.6 ft square or 100 × 217.8 ft.' },
    { q: 'How do I convert square meters to acres?', a: 'Divide square meters by 4,046.86. A 2,000 m² plot is 0.494 acres.' },
    { q: 'Is the acreage on my tax bill exact?', a: 'Not always. Assessor and GIS acreage is often approximate. The recorded plat or a licensed survey is the authoritative figure.' }
  ],
  related: ['square-footage-calculator', 'square-meters-calculator', 'linear-feet-calculator', 'right-triangle-calculator', 'property-tax-calculator'],
  sources: [
    { name: 'NIST: Unit conversion (acre, square foot, hectare)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' },
    { name: 'NIST: U.S. survey foot retirement', url: 'https://www.nist.gov/pml/us-surveyfoot' },
    { name: 'NIST Handbook 44, Appendix C: General Tables of Units of Measurement', url: 'https://www.nist.gov/pml/weights-and-measures/publications/nist-handbooks/handbook-44' }
  ]
};
