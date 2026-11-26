export default {
  slug: 'slope-calculator',
  hub: 'math',
  name: 'Slope Calculator',
  title: 'Slope Calculator: (1, 2) and (5, 8) Give m = 3/2 (Steps)',
  meta: 'The slope through (1, 2) and (5, 8) is 6 ÷ 4 = 3/2 = 1.5, so the line is y = 1.5x + 0.5. Find the slope and line equation from two points, with steps.',
  keyword: 'slope calculator',
  also: ['slope from two points', 'how to find slope', 'rise over run calculator', 'slope intercept form calculator', 'y intercept calculator'],
  updated: '2026-11-26',
  answer: ({ r }) => `The slope through (1, 2) and (5, 8) is <strong>${r.value}</strong>: the rise 8 − 2 = 6 divided by the run 5 − 1 = 4.`,
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
    // scale to whole numbers so the slope can be written as an exact fraction
    var k = 0;
    while (k < 6 && [x1, y1, x2, y2].some(function (t) { return Math.abs(t * Math.pow(10, k) - Math.round(t * Math.pow(10, k))) > 1e-9; })) k++;
    var K = Math.pow(10, k), exact = k < 6 && [x1, y1, x2, y2].every(function (t) { return Math.abs(t * K) < 1e9; });
    var DX = Math.round(dx * K), DY = Math.round(dy * K);
    if (exact) { dx = DX / K; dy = DY / K; }
    function fr(n, d) { if (d < 0) { n = -n; d = -d; } var g = H.gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? (n < 0 ? '−' : '') + Math.abs(n) : (n < 0 ? '−' : '') + Math.abs(n) + '/' + d; }
    var P1 = '(' + f(x1) + ', ' + f(y1) + ')', P2 = '(' + f(x2) + ', ' + f(y2) + ')';
    var steps = ['<b>Formula:</b> m = (y₂ − y₁) ÷ (x₂ − x₁), rise over run',
      '<b>Substitute:</b> with ' + P1 + ' as point 1 and ' + P2 + ' as point 2, m = (' + f(y2) + ' − ' + par(y1) + ') ÷ (' + f(x2) + ' − ' + par(x1) + ')',
      '<b>Rise:</b> ' + f(y2) + ' − ' + par(y1) + ' = ' + f(dy),
      '<b>Run:</b> ' + f(x2) + ' − ' + par(x1) + ' = ' + f(dx)];
    if (dx === 0) {
      steps.push('<b>Divide:</b> ' + f(dy) + ' ÷ 0 cannot be done: the run is 0, so the line goes straight up and down');
      steps.push('<b>Answer:</b> the slope is undefined (exact). The line is vertical, with equation x = ' + f(x1) + '.');
      return { value: 'Undefined', label: 'Slope of a vertical line', rows: [['Equation', 'x = ' + f(x1)]], steps: steps };
    }
    var m = dy / dx, b = y1 - m * x1;
    var mF = exact ? fr(DY, DX) : '', isFrac = mF.indexOf('/') > 0;
    var mDec = H.round(m, 4), mExact = Math.abs(mDec - m) < 1e-12;
    var g0 = exact ? H.gcd(DY, DX) || 1 : 1;
    var dv = [f(dy) + ' ÷ ' + par(dx)];
    if (isFrac && k === 0 && g0 > 1 && DX > 0) dv.push(f(dy) + '/' + f(dx));
    if (isFrac) dv.push(mF);
    dv.push(mExact ? f(m) : H.num(m, 6).replace('-', '−') + '…');
    steps.push('<b>Divide' + (isFrac && g0 > 1 ? ' and simplify' : '') + ':</b> ' + dv.join(' = '));
    var bF = exact ? fr(Math.round(y1 * K) * DX - DY * Math.round(x1 * K), K * DX) : '', bFrac = !mExact && bF.indexOf('/') > 0 && Math.abs(H.round(b, 6) - b) > 1e-12, mUse = isFrac && !mExact;
    var bS = bFrac ? bF + ' ≈ ' + f(H.round(b, 6)) : f(H.round(b, 10));
    steps.push('<b>Y-intercept:</b> b = y₁ − m × x₁ = ' + f(y1) + ' − ' + (mUse ? mF.replace(/^−(.*)$/, '(−$1)') : par(m)) + ' × ' + par(x1) + ' = ' + bS);
    function eq(ms, bb, bs) { var s = 'y = '; if (m === 0) return s + bs; s += ms + 'x'; if (bb > 0) s += ' + ' + bs; else if (bb < 0) s += ' − ' + bs.replace(/^−/, ''); return s; }
    var line = eq(mUse ? '(' + mF + ')' : (m === 1 ? '' : m === -1 ? '−' : f(H.round(m, 6))), H.round(b, 10), bFrac ? bF : f(H.round(b, 6)));
    var shown = isFrac ? mF : (mExact ? f(m) : H.num(m, 4).replace('-', '−'));
    var dir = m > 0 ? 'rises left to right' : m < 0 ? 'falls left to right' : 'is horizontal';
    steps.push('<b>Answer:</b> m = ' + shown + (isFrac ? ' = ' + f(mDec) : '') + ' (' + (isFrac || mExact ? 'exact' + (isFrac && !mExact ? ' as a fraction; the decimal is rounded to 4 places' : '') : 'rounded to 4 decimal places') + '). The line ' + dir + ' and its equation is ' + line + '.');
    return {
      value: shown,
      label: 'Slope (m): the line ' + dir,
      rows: [['Slope as a decimal', mExact ? f(m) : H.num(m, 4).replace('-', '−')], ['Slope-intercept form', line, true], ['Perpendicular slope', m === 0 ? 'undefined (vertical)' : (exact ? fr(-DX, DY) : f(H.round(-1 / m, 4)))]],
      steps: steps
    };
  },
  facts: {
    formula: 'm = (y₂ − y₁) ÷ (x₂ − x₁)<br>b = y₁ − m·x₁<br>y = mx + b',
    vars: [['m', 'the slope: rise ÷ run, how much y changes when x goes up by 1'], ['(x₁, y₁), (x₂, y₂)', 'the two points on the line'], ['b', 'the y-intercept, where the line crosses the y-axis']],
    rounding: 'with whole-number or short-decimal points the slope is exact and is given as a reduced fraction; decimals are rounded to 4 places only when they do not end.',
    note: 'A positive slope rises from left to right, a negative slope falls, 0 is a horizontal line, and a vertical line has an undefined slope.'
  },
  example: {
    h2: 'Worked example: slope as a rate',
    html: `<p><strong>Problem:</strong> A plumber charges $150 for a 2-hour job and $285 for a 5-hour job. Treating the cost as a straight line, what is the hourly rate, and what is the fixed call-out fee?</p>
<p><strong>1.</strong> Write the jobs as points (hours, dollars): (2, 150) and (5, 285).</p>
<p><strong>2.</strong> Rise: 285 − 150 = 135 dollars. Run: 5 − 2 = 3 hours.</p>
<p><strong>3.</strong> Slope: 135 ÷ 3 = 45, so the rate is $45 per hour.</p>
<p><strong>4.</strong> Y-intercept: b = 150 − 45 × 2 = 60, so the line is y = 45x + 60.</p>
<p><strong>Answer:</strong> $45 an hour plus a $60 fee. Sense check: 45 × 5 + 60 = 285, which matches the second job.</p>`
  },
  variants: [
    {
      h2: 'How do you find the slope from two points?',
      html: `<p>Subtract the y-values, subtract the x-values in the same order, and divide. For (−3, 4) and (2, −6): rise = −6 − 4 = −10, run = 2 − (−3) = 5, so m = −10 ÷ 5 = <strong>−2</strong>. The minus sign means the line falls as x grows. Put brackets around negative numbers when you substitute so the double negative in 2 − (−3) is not lost.</p>`
    },
    {
      h2: 'What is the slope of a horizontal or vertical line?',
      html: `<p>A horizontal line has slope <strong>0</strong>: for (−1, 7) and (4, 7) the rise is 7 − 7 = 0, and 0 ÷ 5 = 0. A vertical line has an <strong>undefined</strong> slope: for (2, 7) and (2, −1) the run is 2 − 2 = 0, and dividing by 0 is not allowed. Its equation is x = 2, not y = mx + b.</p>`
    },
    {
      h2: 'How do you write the equation of the line once you have the slope?',
      html: `<p>Put the slope and either point into b = y₁ − m·x₁, then write y = mx + b. With m = 3/2 and the point (1, 2): b = 2 − 1.5 × 1 = 0.5, so the line is <strong>y = 1.5x + 0.5</strong>. Using the other point gives the same b: 8 − 1.5 × 5 = 0.5. That is a quick way to check your work.</p>`
    }
  ],
  mistakes: [
    '<strong>Subtracting in different orders.</strong> (8 − 2) ÷ (1 − 5) = −1.5 has the wrong sign. If y₂ comes first on top, x₂ must come first underneath.',
    '<strong>Putting the run on top.</strong> Slope is rise over run, y over x. 4 ÷ 6 = 2/3 is the reciprocal of the slope through (1, 2) and (5, 8).',
    '<strong>Losing a double negative.</strong> 2 − (−3) is 5, not −1.',
    '<strong>Calling a vertical line\'s slope 0.</strong> Zero is the horizontal case; a run of 0 makes the slope undefined.'
  ],
  related: ['speed-calculator', 'percentage-calculator', 'average-calculator', 'root-calculator'],
  faq: [
    { q: 'Does it matter which point is first?', a: 'No, as long as you keep the same order on top and bottom. (2 − 8) ÷ (1 − 5) = −6 ÷ −4 = 1.5, the same slope as (8 − 2) ÷ (5 − 1).' },
    { q: 'How do you find the slope from an equation?', a: 'Rearrange it into y = mx + b; the number in front of x is the slope. 2x + 3y = 6 becomes y = −(2/3)x + 2, so m = −2/3.' },
    { q: 'How is slope related to percent grade?', a: 'Multiply the slope by 100. A road that rises 6 feet over 100 feet of run has slope 0.06, a 6% grade. A slope of 1.5 is a 150% grade.' },
    { q: 'What is the slope of a perpendicular line?', a: 'The negative reciprocal: flip the fraction and change the sign. Perpendicular to m = 3/2 is m = −2/3, and the two slopes multiply to −1.' }
  ],
  sources: [
    { name: 'OpenStax Elementary Algebra 2e: Understand Slope of a Line', url: 'https://openstax.org/books/elementary-algebra-2e/pages/4-4-understand-slope-of-a-line' },
    { name: 'Wolfram MathWorld: Slope', url: 'https://mathworld.wolfram.com/Slope.html' }
  ]
};
