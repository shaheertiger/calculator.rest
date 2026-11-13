export default {
  slug: 'slope-calculator',
  hub: 'math',
  name: 'Slope Calculator',
  title: 'Slope Calculator: Points (1, 2) and (5, 8) Have a Slope of 3/2',
  h1: 'Slope Calculator: Slope, Y-Intercept and Line Equation From Two Points',
  meta: 'The slope through (1, 2) and (5, 8) is 6 ÷ 4 = 1.5, giving y = 1.5x + 0.5. Get slope, intercepts, standard form, angle and grade, plus Excel formulas.',
  keyword: 'how to calculate slope with two points',
  also: ['slope calculator', 'how to calculate slope with excel', 'how to calculate the slope in excel', 'how to calculate slope on excel', 'how do you calculate the y intercept', 'how to calculate y intercept in excel', 'how to calculate slope and intercept in excel', 'how to calculate slope and y intercept in excel', 'how to calculate average gradient'],
  updated: '2026-11-13',
  inputs: [
    { id: 'x1', label: 'x₁', type: 'number', value: 1 },
    { id: 'y1', label: 'y₁', type: 'number', value: 2 },
    { id: 'x2', label: 'x₂', type: 'number', value: 5 },
    { id: 'y2', label: 'y₂', type: 'number', value: 8 }
  ],
  compute(v, H) {
    function f(x) { var a = Math.abs(x); return a !== 0 && (a < 1e-6 || a >= 1e15) ? H.sig(x, 8) : H.num(x, 6).replace('-', '−'); }
    function par(x) { return x < 0 ? '(' + f(x) + ')' : f(x); }
    var x1 = v.x1, y1 = v.y1, x2 = v.x2, y2 = v.y2;
    if (![x1, y1, x2, y2].every(isFinite)) return { error: 'Enter both points.' };
    var dx = x2 - x1, dy = y2 - y1;
    if (dx === 0 && dy === 0) return { error: 'The two points are the same, so they do not define a line.' };
    var dist = Math.sqrt(dx * dx + dy * dy);
    var expr = '(' + f(y2) + ' − ' + par(y1) + ') ÷ (' + f(x2) + ' − ' + par(x1) + ')';
    if (dx === 0) {
      return { value: 'Undefined', label: 'Slope of a vertical line', expr: expr + ' = ' + f(dy) + ' ÷ 0', rows: [['Equation', 'x = ' + f(x1)], ['Distance between points', f(dist)], ['Angle', '90°']], sub: 'The run is 0, and division by zero is undefined, so a vertical line has no slope.' };
    }
    var m = dy / dx, b = y1 - m * x1;
    // exact fractions when inputs have few decimals
    var k = 0;
    while (k < 6 && [x1, y1, x2, y2].some(function (t) { return Math.abs(t * Math.pow(10, k) - Math.round(t * Math.pow(10, k))) > 1e-9; })) k++;
    var exact = [x1, y1, x2, y2].every(function (t) { return Math.abs(t * Math.pow(10, k) - Math.round(t * Math.pow(10, k))) <= 1e-9 && Math.abs(t * Math.pow(10, k)) < 1e7; });
    function fr(n, d) { if (d < 0) { n = -n; d = -d; } var g = H.gcd(n, d) || 1; n /= g; d /= g; if (d > 10000 || Math.abs(n) > 1e7) return ''; return d === 1 ? (n < 0 ? '−' : '') + Math.abs(n) : (n < 0 ? '−' : '') + Math.abs(n) + '/' + d; }
    var K = Math.pow(10, k), X1 = Math.round(x1 * K), Y1 = Math.round(y1 * K), DX = Math.round(dx * K), DY = Math.round(dy * K);
    var rows = [];
    var mFrac = exact ? fr(DY, DX) : '';
    if (mFrac && mFrac.indexOf('/') > 0) rows.push(['Slope as a fraction (rise/run)', mFrac]);
    function eq(mm, bb) { var s = 'y = '; if (mm === 0) return s + f(bb); s += (mm === 1 ? '' : mm === -1 ? '−' : f(mm)) + 'x'; if (bb > 0) s += ' + ' + f(bb); else if (bb < 0) s += ' − ' + f(-bb); return s; }
    rows.push(['Slope-intercept form', eq(m, b), true]);
    rows.push(['Y-intercept (b)', f(b) + (exact && fr(Y1 * DX - DY * X1, K * DX).indexOf('/') > 0 ? ' = ' + fr(Y1 * DX - DY * X1, K * DX) : '') + ', at (0, ' + f(b) + ')']);
    rows.push(['Point-slope form', 'y − ' + par(y1) + ' = ' + f(m) + '(x − ' + par(x1) + ')']);
    if (exact) {
      var A = DY * K, B = -DX * K, C = DY * X1 - DX * Y1, g = H.gcd(H.gcd(A, B), C) || 1;
      A /= g; B /= g; C /= g;
      if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; }
      if (Math.max(Math.abs(A), Math.abs(B), Math.abs(C)) < 1e7) {
      var sf = (A ? (A === 1 ? '' : A) + 'x' : '') + (B ? (A ? (B < 0 ? ' − ' : ' + ') : (B < 0 ? '−' : '')) + (Math.abs(B) === 1 ? '' : Math.abs(B)) + 'y' : '') + ' = ' + (C < 0 ? '−' : '') + Math.abs(C);
      rows.push(['Standard form (Ax + By = C)', sf]);
      }
    }
    if (m !== 0) rows.push(['X-intercept', '(' + f(-b / m) + ', 0)']);
    rows.push(['Angle of the line', H.num(Math.atan(m) * 180 / Math.PI, 4).replace('-', '−') + '°']);
    rows.push(['Percent grade', H.num(m * 100, 4).replace('-', '−') + '%']);
    rows.push(['Perpendicular slope', m === 0 ? 'undefined (vertical)' : ((exact && fr(-DX, DY)) || f(-1 / m))]);
    rows.push(['Distance between points', f(dist)]);
    return {
      value: f(m), label: 'Slope (m)' + (m > 0 ? ': rising left to right' : m < 0 ? ': falling left to right' : ': horizontal line'),
      expr: expr + ' = ' + f(dy) + ' ÷ ' + f(dx),
      rows: rows
    };
  },
  quick: ({ r }) => `Slope is rise over run: m = (y₂ − y₁) ÷ (x₂ − x₁). For the points (1, 2) and (5, 8), the rise is 8 − 2 = 6 and the run is 5 − 1 = 4, so the slope is 6 ÷ 4 = <strong>${r.value}</strong> (3/2). Plugging in a point gives the y-intercept 0.5, so the line is y = 1.5x + 0.5.`,
  stepsTitle: 'How to calculate slope from two points',
  steps: [
    'Label the points (x₁, y₁) and (x₂, y₂). Either point can be first.',
    'Subtract the y-values for the rise and the x-values for the run, <strong>in the same order</strong>. Taking y₂ − y₁ but x₁ − x₂ flips the sign and is the most common slope mistake.',
    'Divide rise by run and simplify the fraction. A run of 0 means a vertical line with undefined slope.',
    'For the equation, solve b = y₁ − m·x₁ and write y = mx + b. The calculator also gives point-slope and standard form, the angle and the percent grade.'
  ],
  formulaTitle: 'What is the slope formula?',
  formula: {
    expr: 'm = (y₂ − y₁) ÷ (x₂ − x₁)<br>b = y₁ − m·x₁ &nbsp;→&nbsp; y = mx + b<br>angle = arctan(m) &nbsp;·&nbsp; grade = m × 100%',
    vars: [['m', 'slope: change in y per 1 unit of x'], ['b', 'y-intercept: where the line crosses the y-axis'], ['(x₁, y₁), (x₂, y₂)', 'the two known points']],
    note: 'Slope is the same between any two points on a straight line, which is why two points are enough to pin the line down.'
  },
  example: `<p>Find the line through (−2, 7) and (4, −5).</p>
<p>Rise = −5 − 7 = −12. Run = 4 − (−2) = 6. Slope m = −12 ÷ 6 = <strong>−2</strong>.</p>
<p>Intercept: b = 7 − (−2)(−2) = 7 − 4 = 3. The line is <strong>y = −2x + 3</strong>, or 2x + y = 3 in standard form. Check with the other point: −2(4) + 3 = −5. ✓</p>`,
  table: {
    title: 'What angle and percent grade does each slope give?',
    intro: 'Rise-to-run ratios converted by the calculator above. Grade is the slope as a percent; the angle is measured up from horizontal.',
    head: ['Rise : run', 'Slope (m)', 'Percent grade', 'Angle'],
    rows: ({ run }) => [[1, 20], [1, 12], [1, 10], [1, 4], [1, 2], [1, 1], [3, 2], [2, 1], [3, 1], [5, 1], [10, 1]].map(([ri, ru]) => { const o = run({ x1: 0, y1: 0, x2: ru, y2: ri }); const g = n => o.rows.find(x => x[0] === n)[1]; return [ri + ' : ' + ru, o.value, g('Percent grade'), g('Angle of the line')]; }),
    note: 'A 1:12 slope (8.33%) is the steepest running slope the ADA Standards allow for a wheelchair ramp. A slope of 1 is a 45° line; doubling the slope does not double the angle.'
  },
  sections: [
    {
      h2: 'How do you calculate slope in Excel or Google Sheets?',
      html: `<p>For two points, type the slope formula directly. With x₁ in A2, y₁ in B2, x₂ in C2 and y₂ in D2: <code>=(D2-B2)/(C2-A2)</code>.</p>
<p>For a column of data, use <code>=SLOPE(known_y's, known_x's)</code>, for example <code>=SLOPE(B2:B20, A2:A20)</code>. Note the order: <strong>y-values first</strong>. Swapping them is the usual error and gives a different answer. <code>=INTERCEPT(B2:B20, A2:A20)</code> returns b with the same argument order. Both work the same in Google Sheets.</p>
<p>With more than two points, SLOPE returns the least-squares best-fit line, not the slope between the first and last point. To see how well that line fits, add <code>=RSQ(B2:B20, A2:A20)</code> or use the <a href="/r-squared-calculator">R-squared calculator</a>. On a chart, right-click the series, add a linear trendline and tick "Display equation on chart" to see y = mx + b.</p>`
    },
    {
      h2: 'How do you find the y-intercept?',
      html: `<p>Once you have the slope, substitute either point into y = mx + b and solve for b: b = y₁ − m·x₁. With slope 1.5 and the point (1, 2), b = 2 − 1.5 × 1 = <strong>0.5</strong>. Using (5, 8) gives the same: 8 − 1.5 × 5 = 0.5.</p>
<p>From standard form Ax + By = C, set x = 0: b = C ÷ B. For 3x − 2y = −1, b = −1 ÷ −2 = 0.5. In a spreadsheet, =INTERCEPT does it for a whole data set.</p>`
    },
    {
      h2: 'What do positive, negative, zero and undefined slopes mean?',
      html: `<ul>
<li><strong>Positive:</strong> the line rises from left to right. A slope of 1.5 climbs 1.5 units for every 1 unit across.</li>
<li><strong>Negative:</strong> the line falls from left to right; −2 drops 2 units per unit across.</li>
<li><strong>Zero:</strong> a horizontal line, y = constant. The rise is 0.</li>
<li><strong>Undefined:</strong> a vertical line, x = constant. The run is 0, and you cannot divide by 0.</li>
</ul>
<p>In word problems, slope is a rate: dollars per hour, miles per gallon, degrees per minute. The units are the y-units divided by the x-units, and the average slope between two points is the "average rate of change" or average gradient.</p>`
    },
    {
      h2: 'How do you convert a slope to an angle or percent grade?',
      html: `<p>Grade is slope × 100: a rise of 6 ft over a run of 100 ft is a 6% grade. The angle is the inverse tangent of the slope: arctan(0.06) = 3.43°. In Excel, <code>=DEGREES(ATAN(0.06))</code>.</p>
<p>Grades and angles diverge quickly. A 100% grade is only 45°, and a vertical wall would be an infinite grade. Roofs use their own convention, inches of rise per 12 inches of run; the <a href="/roof-pitch-calculator">roof pitch calculator</a> converts those.</p>`
    }
  ],
  faq: [
    { q: 'What is the slope formula?', a: 'm = (y₂ − y₁) ÷ (x₂ − x₁): the change in y divided by the change in x between two points on the line.' },
    { q: 'Does it matter which point I use first?', a: 'No, as long as you keep the same order on top and bottom. (2 − 8) ÷ (1 − 5) = −6 ÷ −4 = 1.5, the same as (8 − 2) ÷ (5 − 1).' },
    { q: 'What is the slope of a horizontal line?', a: 'A horizontal line has slope 0 because the y-value never changes. A vertical line has an undefined slope because the run is 0.' },
    { q: 'How do you find the slope from an equation?', a: 'Rearrange it into y = mx + b; the number in front of x is the slope. 4x + 2y = 10 becomes y = −2x + 5, so m = −2.' },
    { q: 'What is the slope of a perpendicular line?', a: 'It is the negative reciprocal. A line with slope 3/2 is perpendicular to lines with slope −2/3, and the two slopes multiply to −1.' },
    { q: 'How do you find slope from a graph?', a: 'Pick two points where the line crosses grid corners, count the rise (up is positive) and the run (right is positive), and divide rise by run.' },
    { q: 'Why does Excel\'s SLOPE give a different answer than my two points?', a: 'SLOPE fits a least-squares line through every point in the range. It matches the two-point slope only when the data lie exactly on a straight line or when you give it just two points.' }
  ],
  related: ['midpoint-calculator', 'right-triangle-calculator', 'roof-pitch-calculator', 'r-squared-calculator', 'correlation-coefficient-calculator'],
  sources: [
    { name: 'Microsoft Support: SLOPE function', url: 'https://support.microsoft.com/en-us/office/slope-function-11fb8f97-3117-4813-98aa-61d7e01276b9' },
    { name: 'Microsoft Support: INTERCEPT function', url: 'https://support.microsoft.com/en-us/office/intercept-function-2a9b74e2-9d47-4772-b663-3bca70bf63ef' },
    { name: 'Wolfram MathWorld: Slope', url: 'https://mathworld.wolfram.com/Slope.html' },
    { name: 'U.S. Access Board: ADA Standards, Ramps and Curb Ramps (Chapter 4)', url: 'https://www.access-board.gov/ada/guides/chapter-4-ramps-and-curb-ramps/' }
  ]
};
