export default {
  slug: 'right-triangle-calculator',
  hub: 'math',
  name: 'Right Triangle Calculator',
  title: 'Right Triangle Calculator: Legs 5 and 12 Give Hypotenuse 13',
  h1: 'Right Triangle Solver: Missing Sides and Angles From Any Two Values',
  meta: 'Legs of 5 and 12 give a hypotenuse of √(25 + 144) = 13 and angles of 22.62° and 67.38°. Solve any right triangle from two sides, or from a side and an angle.',
  keyword: 'how to calculate side length of triangle',
  also: ['right triangle calculator', 'pythagorean theorem calculator', 'hypotenuse calculator', 'missing side of a triangle calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'known', label: 'I know', type: 'select', value: 'ab', wide: true, options: [['ab', 'Both legs (a and b)'], ['ac', 'One leg (a) and the hypotenuse (c)'], ['aA', 'Leg a and the angle opposite it (A)'], ['aB', 'Leg a and the angle next to it (B)'], ['cA', 'Hypotenuse c and angle A']] },
    { id: 'a', label: 'Leg a', type: 'number', value: 5, showIf: { known: ['ab', 'ac', 'aA', 'aB'] } },
    { id: 'b', label: 'Leg b', type: 'number', value: 12, showIf: { known: ['ab'] } },
    { id: 'c', label: 'Hypotenuse c', type: 'number', value: 13, showIf: { known: ['ac', 'cA'] } },
    { id: 'ang', label: 'Angle (degrees)', type: 'number', value: 30, suffix: '°', showIf: { known: ['aA', 'aB', 'cA'] } }
  ],
  compute(v, H) {
    var R = Math.PI / 180;
    function f(x) { return H.num(x, 4); }
    function deg(x) { return H.num(x, 2) + '°'; }
    var a, b, c, A, k = v.known, value, label, expr;
    function needAngle() { return v.ang > 0 && v.ang < 90; }
    if (k === 'ac') {
      if (!(v.a > 0) || !(v.c > 0)) return { error: 'Enter leg a and the hypotenuse c.' };
      if (v.c <= v.a) return { error: 'The hypotenuse must be longer than the leg.' };
      a = v.a; c = v.c; b = Math.sqrt(c * c - a * a); A = Math.asin(a / c) / R;
      value = f(b); label = 'Missing leg b'; expr = '√(' + f(c) + '² − ' + f(a) + '²) = √' + f(c * c - a * a);
    } else if (k === 'aA' || k === 'aB') {
      if (!(v.a > 0) || !needAngle()) return { error: 'Enter leg a and an angle between 0° and 90°.' };
      a = v.a; A = k === 'aA' ? v.ang : 90 - v.ang;
      c = a / Math.sin(A * R); b = a / Math.tan(A * R);
      value = f(c); label = 'Hypotenuse c';
      expr = k === 'aA' ? f(a) + ' ÷ sin ' + deg(A) : f(a) + ' ÷ cos ' + deg(v.ang);
    } else if (k === 'cA') {
      if (!(v.c > 0) || !needAngle()) return { error: 'Enter the hypotenuse and an angle between 0° and 90°.' };
      c = v.c; A = v.ang; a = c * Math.sin(A * R); b = c * Math.cos(A * R);
      value = f(a); label = 'Leg a (opposite angle A)'; expr = f(c) + ' × sin ' + deg(A);
    } else {
      if (!(v.a > 0) || !(v.b > 0)) return { error: 'Enter both legs.' };
      a = v.a; b = v.b; c = Math.sqrt(a * a + b * b); A = Math.atan(a / b) / R;
      value = f(c); label = 'Hypotenuse c'; expr = '√(' + f(a) + '² + ' + f(b) + '²) = √' + f(a * a + b * b);
    }
    var B = 90 - A;
    var rows = [
      ['Leg a', f(a), k === 'cA'], ['Leg b', f(b), k === 'ac' || k === 'aA' || k === 'aB' || k === 'cA'], ['Hypotenuse c', f(c), k !== 'ac' && k !== 'cA'],
      ['Angle A (opposite a)', deg(A)], ['Angle B (opposite b)', deg(B)], ['Angle C', '90°'],
      ['Area (a × b ÷ 2)', f(a * b / 2)], ['Perimeter', f(a + b + c)],
      ['Height to the hypotenuse', f(a * b / c)], ['Inscribed circle radius', f((a + b - c) / 2)], ['Circumscribed circle radius', f(c / 2)]
    ];
    var ints = [a, b, c].every(function (x) { return Math.abs(x - Math.round(x)) < 1e-9; });
    return { value: value, label: label, expr: expr, rows: rows, sub: ints ? 'All three sides are whole numbers: ' + Math.round(a) + '-' + Math.round(b) + '-' + Math.round(c) + ' is a Pythagorean triple.' : 'Angles A and B always add up to 90°.' };
  },
  quick: ({ r }) => `To find a missing side of a right triangle, use the Pythagorean theorem a² + b² = c². With legs of 5 and 12, c = √(5² + 12²) = √169 = <strong>${r.value}</strong>. For a missing leg, subtract instead: b = √(c² − a²), so √(13² − 5²) = 12. If you know an angle instead of a second side, use sine, cosine or tangent.`,
  stepsTitle: 'How to calculate the side length of a right triangle',
  steps: [
    'Identify the hypotenuse: the longest side, opposite the 90° angle. The other two sides are the legs.',
    'Two sides known: square them. Add the squares if both are legs; subtract the smaller square from the larger if one is the hypotenuse. Take the square root.',
    'One side and an angle known: use SOH CAH TOA. sin = opposite ÷ hypotenuse, cos = adjacent ÷ hypotenuse, tan = opposite ÷ adjacent. Set the calculator to degrees; radian mode is the usual cause of wildly wrong answers.',
    'Find the angles with inverse trig (A = tan⁻¹(a ÷ b)) and remember the two acute angles sum to 90°.'
  ],
  formulaTitle: 'What formulas solve a right triangle?',
  formula: {
    expr: 'a² + b² = c² &nbsp;→&nbsp; c = √(a² + b²), &nbsp;b = √(c² − a²)<br>sin A = a ÷ c &nbsp;·&nbsp; cos A = b ÷ c &nbsp;·&nbsp; tan A = a ÷ b<br>A + B = 90° &nbsp;·&nbsp; Area = ab ÷ 2',
    vars: [['a, b', 'the legs (the sides forming the right angle)'], ['c', 'the hypotenuse'], ['A', 'angle opposite leg a'], ['B', 'angle opposite leg b']]
  },
  example: `<p>A 20-foot ladder leans against a wall at 70° to the ground. How high does it reach, and how far is its foot from the wall?</p>
<p>The ladder is the hypotenuse. Height = 20 × sin 70° = 20 × 0.9397 = <strong>18.79 ft</strong>. Distance from the wall = 20 × cos 70° = 20 × 0.3420 = <strong>6.84 ft</strong>.</p>
<p>Check with Pythagoras: 18.79² + 6.84² = 353.1 + 46.8 = 399.9 ≈ 20² = 400. ✓</p>`,
  table: {
    title: 'Which right triangles have whole-number sides?',
    intro: 'Primitive Pythagorean triples with their angles and area, solved by the calculator above. Any multiple (6-8-10, 10-24-26) works too.',
    head: ['Legs a and b', 'Hypotenuse', 'Smaller angle', 'Larger angle', 'Area'],
    rows: ({ run }) => [[3, 4], [5, 12], [8, 15], [7, 24], [20, 21], [12, 35], [9, 40], [28, 45], [11, 60], [33, 56], [16, 63], [48, 55]].map(([a, b]) => { const o = run({ known: 'ab', a, b }); const g = n => o.rows.find(x => x[0].indexOf(n) === 0)[1]; return [a + ' and ' + b, o.value, g('Angle A'), g('Angle B'), g('Area')]; })
  },
  sections: [
    {
      h2: 'How do you find a missing leg of a right triangle?',
      html: `<p>Subtract the square of the known leg from the square of the hypotenuse, then take the square root: b = √(c² − a²). A 13-foot ladder with its foot 5 feet from a wall reaches √(169 − 25) = √144 = <strong>12 feet</strong> up.</p>
<p>The hypotenuse must be the longest side. If c² − a² comes out negative, one of the numbers is in the wrong box. For square roots that are not whole numbers, the <a href="/root-calculator">root calculator</a> also gives the simplified radical, such as √72 = 6√2.</p>`
    },
    {
      h2: 'How do you use SOH CAH TOA to find a side?',
      html: `<p>Pick the ratio that links what you know to what you want, measured from the angle you know:</p>
<ul><li><strong>SOH:</strong> sin = Opposite ÷ Hypotenuse</li><li><strong>CAH:</strong> cos = Adjacent ÷ Hypotenuse</li><li><strong>TOA:</strong> tan = Opposite ÷ Adjacent</li></ul>
<p>A wheelchair ramp must rise 30 inches at 4.76° (a 1:12 slope). The rise is opposite the angle and the ramp length is the hypotenuse, so length = 30 ÷ sin 4.76° = 30 ÷ 0.0830 = 361.6 inches, about 30 feet. The horizontal run is 30 ÷ tan 4.76° ≈ 360 inches. For slopes given as rise over run, the <a href="/slope-calculator">slope calculator</a> converts to angle and grade.</p>`
    },
    {
      h2: 'What are the 30-60-90 and 45-45-90 triangle rules?',
      html: `<p>Two right triangles have side ratios worth memorizing:</p>
<ul><li><strong>45-45-90:</strong> sides in the ratio 1 : 1 : √2. Legs of 10 give a hypotenuse of 10√2 ≈ 14.142. A square's diagonal is its side × 1.414.</li>
<li><strong>30-60-90:</strong> sides in the ratio 1 : √3 : 2. The short leg (opposite 30°) is half the hypotenuse; the long leg is the short leg × 1.732. A hypotenuse of 8 gives legs of 4 and 6.928.</li></ul>
<p>These come straight from the trig values: sin 30° = 0.5, cos 30° = sin 60° ≈ 0.8660, and sin 45° = cos 45° ≈ 0.7071.</p>`
    },
    {
      h2: 'How do builders use the 3-4-5 rule to square a corner?',
      html: `<p>Measure 3 units along one wall and 4 along the other. If the diagonal between those marks is exactly 5, the corner is 90°. Scale it up for accuracy: 6-8-10 or 9-12-15 feet for a deck or slab. The same check works for any rectangle: a 12 × 16-foot room should measure √(144 + 256) = 20 feet corner to corner.</p>
<p>Stairs and roofs are right triangles too. A step that rises 7.5 inches over a 10-inch tread climbs at tan⁻¹(7.5 ÷ 10) = 36.87°. The <a href="/stair-calculator">stair calculator</a> and <a href="/roof-pitch-calculator">roof pitch calculator</a> apply these formulas to building codes.</p>`
    }
  ],
  faq: [
    { q: 'What is the Pythagorean theorem?', a: 'In a right triangle, the squares of the two legs add up to the square of the hypotenuse: a² + b² = c². It only applies to triangles with a 90° angle.' },
    { q: 'Which side is the hypotenuse?', a: 'The hypotenuse is the longest side, directly across from the right angle. The two sides that meet at the right angle are the legs.' },
    { q: 'How do you find the angles if you know the sides?', a: 'Use inverse tangent on the legs: A = tan⁻¹(a ÷ b). For legs 5 and 12, A = tan⁻¹(0.4167) = 22.62°, and B = 90° − 22.62° = 67.38°.' },
    { q: 'How do you find the area of a right triangle?', a: 'Multiply the two legs and halve the result. Legs of 5 and 12 give 5 × 12 ÷ 2 = 30 square units.' },
    { q: 'Can you solve a right triangle from two angles?', a: 'No. Angles fix the shape but not the size, so you need at least one side length as well.' },
    { q: 'Does the Pythagorean theorem work on other triangles?', a: 'No. For triangles without a right angle, use the law of cosines, c² = a² + b² − 2ab·cos C, which reduces to Pythagoras when C = 90°.' },
    { q: 'How do I calculate a hypotenuse in Excel?', a: 'Use =SQRT(A2^2+B2^2) with the legs in A2 and B2. For the angle opposite A2, use =DEGREES(ATAN(A2/B2)).' }
  ],
  related: ['root-calculator', 'slope-calculator', 'midpoint-calculator', 'stair-calculator', 'roof-pitch-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Right Triangle', url: 'https://mathworld.wolfram.com/RightTriangle.html' },
    { name: 'Wolfram MathWorld: Pythagorean Triple', url: 'https://mathworld.wolfram.com/PythagoreanTriple.html' },
    { name: 'Khan Academy: Trigonometry', url: 'https://www.khanacademy.org/math/trigonometry' }
  ]
};
