export default {
  slug: 'midpoint-calculator',
  hub: 'math',
  name: 'Midpoint Calculator',
  title: 'Midpoint Calculator: (−3, 4) and (5, −2) Have Midpoint (1, 1)',
  h1: 'Midpoint and Distance Calculator for Two Points (or a Missing Endpoint)',
  meta: 'The midpoint of (−3, 4) and (5, −2) is (1, 1); the points are 10 units apart. Find a midpoint, distance, perpendicular bisector or missing endpoint, with steps.',
  keyword: 'how to calculate midpoint',
  also: ['midpoint calculator', 'how to calculate midpoint in excel', 'how to calculate class midpoint', 'distance between two points calculator', 'endpoint calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Find', type: 'select', value: 'mid', wide: true, options: [['mid', 'Midpoint and distance of two points'], ['end', 'Missing endpoint (know one end and the midpoint)']] },
    { id: 'x1', label: 'Point A: x₁', type: 'number', value: -3 },
    { id: 'y1', label: 'Point A: y₁', type: 'number', value: 4 },
    { id: 'x2', label: 'Point B: x₂', type: 'number', value: 5, showIf: { mode: ['mid'] } },
    { id: 'y2', label: 'Point B: y₂', type: 'number', value: -2, showIf: { mode: ['mid'] } },
    { id: 'mx', label: 'Midpoint: x', type: 'number', value: 1, showIf: { mode: ['end'] } },
    { id: 'my', label: 'Midpoint: y', type: 'number', value: 1, showIf: { mode: ['end'] } }
  ],
  compute(v, H) {
    function f(x) { var a = Math.abs(x); return a !== 0 && (a < 1e-6 || a >= 1e15) ? H.sig(x, 8) : H.num(x, 6).replace('-', '−'); }
    function pt(x, y) { return '(' + f(x) + ', ' + f(y) + ')'; }
    function par(x) { return x < 0 ? '(' + f(x) + ')' : f(x); }
    if (!isFinite(v.x1) || !isFinite(v.y1)) return { error: 'Enter point A.' };
    var x1 = v.x1, y1 = v.y1, x2, y2, value, label, expr, rows = [];
    if (v.mode === 'end') {
      if (!isFinite(v.mx) || !isFinite(v.my)) return { error: 'Enter the midpoint.' };
      x2 = 2 * v.mx - x1; y2 = 2 * v.my - y1;
      value = pt(x2, y2); label = 'Missing endpoint B';
      expr = '(2 × ' + par(v.mx) + ' − ' + par(x1) + ', 2 × ' + par(v.my) + ' − ' + par(y1) + ')';
      rows.push(['Check: midpoint of A and B', pt((x1 + x2) / 2, (y1 + y2) / 2)]);
    } else {
      if (!isFinite(v.x2) || !isFinite(v.y2)) return { error: 'Enter point B.' };
      x2 = v.x2; y2 = v.y2;
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      value = pt(mx, my); label = 'Midpoint of A and B';
      expr = '((' + f(x1) + ' + ' + par(x2) + ') ÷ 2, (' + f(y1) + ' + ' + par(y2) + ') ÷ 2)';
    }
    var dx = x2 - x1, dy = y2 - y1, d = Math.sqrt(dx * dx + dy * dy), Mx = (x1 + x2) / 2, My = (y1 + y2) / 2;
    rows.push(['Distance from A to B', f(d) + ' (√(' + par(dx) + '² + ' + par(dy) + '²))', true]);
    rows.push(['Distance from each end to the midpoint', f(d / 2)]);
    if (d > 0) {
      rows.push(['Slope of segment AB', dx === 0 ? 'undefined (vertical)' : f(dy / dx)]);
      var pb;
      if (dy === 0) pb = 'x = ' + f(Mx);
      else if (dx === 0) pb = 'y = ' + f(My);
      else { var mp = -dx / dy, b = My - mp * Mx; pb = 'y = ' + (mp === 1 ? '' : mp === -1 ? '−' : f(mp)) + 'x' + (Math.abs(b) < 1e-12 ? '' : b > 0 ? ' + ' + f(b) : ' − ' + f(-b)); }
      rows.push(['Perpendicular bisector', pb]);
    }
    return { value: value, label: label, expr: expr, rows: rows };
  },
  quick: ({ r }) => `To calculate a midpoint, average the x-coordinates and average the y-coordinates: M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2). For (−3, 4) and (5, −2) that is ((−3 + 5) ÷ 2, (4 − 2) ÷ 2) = <strong>${r.value}</strong>. The two points are √(8² + 6²) = 10 units apart, so the midpoint is 5 units from each.`,
  stepsTitle: 'How to calculate a midpoint',
  steps: [
    'Add the two x-coordinates and divide by 2. That is the midpoint\'s x.',
    'Add the two y-coordinates and divide by 2. That is the midpoint\'s y. Keep the signs: 4 + (−2) is 2, not 6.',
    'Write the answer as an ordered pair (x, y). Fractions and decimals are normal: the midpoint of (2, 3) and (5, 8) is (3.5, 5.5).',
    'Need the other end instead? Switch to "Missing endpoint": double the midpoint and subtract the end you know.'
  ],
  formulaTitle: 'What are the midpoint and distance formulas?',
  formula: {
    expr: 'M = ( (x₁ + x₂) ÷ 2 , (y₁ + y₂) ÷ 2 )<br>d = √( (x₂ − x₁)² + (y₂ − y₁)² )<br>Missing endpoint B = (2Mₓ − x₁ , 2Mᵧ − y₁)',
    vars: [['(x₁, y₁), (x₂, y₂)', 'the two endpoints'], ['M', 'midpoint, halfway along the segment'], ['d', 'straight-line distance between the endpoints']],
    note: 'The distance formula is the Pythagorean theorem: the horizontal and vertical gaps are the legs of a right triangle and d is its hypotenuse.'
  },
  example: `<p>A segment runs from A(−3, 4) to B(5, −2).</p>
<p>Midpoint: x = (−3 + 5) ÷ 2 = 1 and y = (4 + (−2)) ÷ 2 = 1, so <strong>M = (1, 1)</strong>.</p>
<p>Distance: the gaps are 8 across and −6 down, so d = √(64 + 36) = √100 = <strong>10</strong>. Going backwards, if you knew A and M = (1, 1), then B = (2 × 1 − (−3), 2 × 1 − 4) = (5, −2).</p>`,
  table: {
    title: 'What are the midpoints and distances for common point pairs?',
    intro: 'Worked by the calculator above; useful for checking homework.',
    head: ['Point A', 'Point B', 'Midpoint', 'Distance'],
    rows: ({ run }) => [[0, 0, 8, 6], [2, 3, 10, 7], [-4, -1, 6, 9], [1.5, 2, 4.5, -3], [-7, 5, -1, -3], [3, 3, 3, -5], [0, 0, 1, 1], [100, 250, 400, 650]].map(([a, b, c, d]) => { const o = run({ mode: 'mid', x1: a, y1: b, x2: c, y2: d }); const f = n => String(n).replace('-', '−'); return ['(' + f(a) + ', ' + f(b) + ')', '(' + f(c) + ', ' + f(d) + ')', o.value, o.rows[0][1].replace(/ \(.*$/, '')]; })
  },
  sections: [
    {
      h2: 'How do you find a missing endpoint from the midpoint?',
      html: `<p>The midpoint is halfway, so the unknown end is as far past the midpoint as the known end is before it. Double each midpoint coordinate and subtract the known endpoint: B = (2Mₓ − x₁, 2Mᵧ − y₁).</p>
<p>If A = (2, −5) and the midpoint is (6, 1), then B = (2 × 6 − 2, 2 × 1 − (−5)) = <strong>(10, 7)</strong>. Check: (2 + 10) ÷ 2 = 6 and (−5 + 7) ÷ 2 = 1.</p>`
    },
    {
      h2: 'How do you calculate the distance between two points?',
      html: `<p>Find the horizontal gap and the vertical gap, square both, add, and take the square root. From (1, 2) to (7, 10) the gaps are 6 and 8, so d = √(36 + 64) = √100 = <strong>10</strong>.</p>
<p>The order of the points doesn't matter because squaring removes the sign. This is the same calculation as finding the hypotenuse of a right triangle, which the <a href="/right-triangle-calculator">right triangle calculator</a> does with angles included. For the steepness of the segment, use the <a href="/slope-calculator">slope calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate a class midpoint in statistics?',
      html: `<p>Add the lower and upper limits of the class and divide by 2. The class 10–19 has midpoint (10 + 19) ÷ 2 = <strong>14.5</strong>, and 20–29 has 24.5. Using class boundaries (9.5–19.5) gives the same midpoint.</p>
<p>Midpoints stand in for every value in a class when you estimate the mean of grouped data: multiply each midpoint by its frequency, add the products, and divide by the total frequency. That is a weighted mean, which the <a href="/weighted-average-calculator">weighted average calculator</a> handles row by row.</p>`
    },
    {
      h2: 'How do you calculate a midpoint in Excel?',
      html: `<p>A midpoint is an average, so with x₁, y₁, x₂, y₂ in A2:D2, use <code>=AVERAGE(A2,C2)</code> for x and <code>=AVERAGE(B2,D2)</code> for y. The distance is <code>=SQRT((C2-A2)^2+(D2-B2)^2)</code>.</p>
<p>The same idea finds the halfway point between two dates or times: <code>=A2+(B2-A2)/2</code>. Between 9:00 AM and 4:30 PM, that returns 12:45 PM.</p>`
    }
  ],
  faq: [
    { q: 'What is the midpoint formula?', a: 'M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2). It averages the x-coordinates and the y-coordinates separately.' },
    { q: 'What is the midpoint between two numbers?', a: 'Add them and divide by 2. The midpoint of 18 and 45 is (18 + 45) ÷ 2 = 31.5.' },
    { q: 'Can a midpoint have fractions or decimals?', a: 'Yes. Whenever the coordinates add to an odd number the midpoint lands on a half: (2, 3) and (5, 8) give (3.5, 5.5).' },
    { q: 'How do you find the midpoint in 3D?', a: 'Average the z-coordinates too: M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2, (z₁ + z₂) ÷ 2). The distance formula gains a (z₂ − z₁)² term.' },
    { q: 'What is the midpoint method in economics?', a: 'It measures percent change against the average of the two values instead of the starting value, so the answer is the same in either direction. It is the same as percent difference; see the percentage change calculator.' },
    { q: 'Is the midpoint always on the line segment?', a: 'Yes. It lies on segment AB, exactly half the distance from each end, and the perpendicular bisector of AB passes through it.' }
  ],
  related: ['slope-calculator', 'right-triangle-calculator', 'average-calculator', 'percentage-change-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Midpoint', url: 'https://mathworld.wolfram.com/Midpoint.html' },
    { name: 'Khan Academy: Geometry', url: 'https://www.khanacademy.org/math/geometry' },
    { name: 'Microsoft Support: AVERAGE function', url: 'https://support.microsoft.com/en-us/office/average-function-047bac88-d466-426c-a32b-8f33eb960cf6' }
  ]
};
