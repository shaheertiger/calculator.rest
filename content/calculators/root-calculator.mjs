export default {
  slug: 'root-calculator',
  hub: 'math',
  name: 'Square Root & Cube Root Calculator',
  title: 'Cube Root Calculator: ∛54 = 3.7798 (3∛2), Square & nth Roots',
  h1: 'Square Root, Cube Root and nth Root Calculator With Simplified Radicals',
  meta: 'The cube root of 54 is 3.779763, or 3∛2 in simplest radical form. Find square, cube and nth roots, simplify radicals, and see which keys to press on a TI-84.',
  keyword: 'how to cube root on a calculator',
  also: ['cube root calculator', 'square root calculator', 'how to find the square root on calculator', 'how to find cube root on calculator ti 83 plus', 'nth root calculator', 'simplify radicals calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'x', label: 'Number under the root', type: 'number', value: 54 },
    { id: 'n', label: 'Root (index)', type: 'number', value: 3, help: '2 = square root, 3 = cube root, 4 = fourth root…' }
  ],
  compute(v, H) {
    var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    function sup(k) { return String(k).split('').map(function (c) { return SUP[c] || c; }).join(''); }
    function sym(k) { return k === 2 ? '√' : k === 3 ? '∛' : k === 4 ? '∜' : sup(k) + '√'; }
    function f(x) { var a = Math.abs(x); return a !== 0 && (a < 1e-6 || a >= 1e15) ? H.sig(x, 8) : H.num(x, 6); }
    function root(x, k) {
      var a = Math.abs(x), r = k === 2 ? Math.sqrt(a) : k === 3 ? Math.cbrt(a) : Math.pow(a, 1 / k);
      var rr = Math.round(r);
      if (rr > 0 && Math.pow(rr, k) === a) r = rr;
      return r;
    }
    if (!isFinite(v.x)) return { error: 'Enter the number under the root.' };
    if (!Number.isInteger(v.n) || v.n < 2 || v.n > 100) return { error: 'The root index must be a whole number from 2 to 100.' };
    var x = v.x, n = v.n, neg = x < 0, imag = neg && n % 2 === 0;
    var r = root(x, n), shown = (neg && !imag ? '−' : '') + f(r) + (imag ? 'i' : '');
    var rows = [], steps = [];
    var simple = '';
    if (Number.isInteger(x) && Math.abs(x) >= 2 && Math.abs(x) <= 1e12) {
      var m = Math.abs(x), fac = [], p = 2;
      while (p * p <= m) { var e = 0; while (m % p === 0) { m /= p; e++; } if (e) fac.push([p, e]); p += p === 2 ? 1 : 2; }
      if (m > 1) fac.push([m, 1]);
      var out = 1, inside = 1;
      fac.forEach(function (q) { out *= Math.pow(q[0], Math.floor(q[1] / n)); inside *= Math.pow(q[0], q[1] % n); });
      steps.push(['Prime factorization', H.int(Math.abs(x)) + ' = ' + fac.map(function (q) { return q[0] + (q[1] > 1 ? sup(q[1]) : ''); }).join(' × ')]);
      steps.push(['Take out each factor that appears ' + n + ' times', out > 1 ? 'outside: ' + H.int(out) + ', left inside: ' + H.int(inside) : 'no factor repeats ' + n + ' times']);
      if (inside === 1) simple = (neg && !imag ? '−' : '') + H.int(out) + (imag ? 'i' : '');
      else simple = (neg && !imag ? '−' : '') + (out > 1 ? H.int(out) : '') + sym(n) + H.int(inside) + (imag ? ' i' : '');
      steps.push(['Simplest radical form', simple]);
      rows.push(['Simplest radical form', simple + (inside === 1 ? ' (a perfect ' + (n === 2 ? 'square' : n === 3 ? 'cube' : n + 'th power') + ')' : ''), true]);
    }
    rows.push(['As an exponent', (neg ? '(' + f(x) + ')' : f(x)) + '^(1/' + n + ')']);
    if (!imag) {
      var lo = Math.floor(r), hi = lo + 1;
      if (Math.pow(lo, n) !== Math.abs(x) && r < 1e6) rows.push(['Between perfect ' + (n === 2 ? 'squares' : n === 3 ? 'cubes' : 'powers'), H.int(Math.pow(lo, n) * (neg ? -1 : 1)) + ' (' + (neg ? '−' : '') + lo + sup(n) + ') and ' + H.int(Math.pow(hi, n) * (neg ? -1 : 1)) + ' (' + (neg ? '−' : '') + hi + sup(n) + ')']);
      rows.push(['Check', (neg ? '(' + shown + ')' : shown) + sup(n) + ' ≈ ' + f(Math.pow(r, n) * (neg ? -1 : 1))]);
    }
    if (n !== 2) rows.push(['Square root of ' + f(x), x < 0 ? f(Math.sqrt(-x)) + 'i' : f(root(x, 2))]);
    if (n !== 3) rows.push(['Cube root of ' + f(x), (x < 0 ? '−' : '') + f(root(x, 3))]);
    var out2 = {
      value: shown,
      label: (n === 2 ? 'Square root' : n === 3 ? 'Cube root' : H.ord(n) + ' root') + ' of ' + f(x),
      expr: sym(n) + (neg ? '(' + f(x) + ')' : f(x)),
      rows: rows,
      sub: imag ? 'An even root of a negative number is not a real number; the answer uses i = √−1.' : (neg ? 'An odd root of a negative number is negative.' : '')
    };
    if (steps.length) out2.table = { head: ['Step', 'Work'], rows: steps };
    return out2;
  },
  quick: ({ r }) => `The cube root of 54 is <strong>${r.value}</strong>, because 3.779763 × 3.779763 × 3.779763 ≈ 54; in simplest radical form it is 3∛2, since 54 = 27 × 2. To cube root on a TI-84, press MATH, choose 4:∛(, type 54 and press ENTER. With no ∛ key, raise to the 1/3 power: 54 ^ (1 ÷ 3).`,
  stepsTitle: 'How to find a cube root or square root',
  steps: [
    'Enter the number under the radical sign. Negative numbers work for odd roots (∛−27 = −3); even roots of negatives come out as imaginary numbers.',
    'Enter the root index: 2 for a square root, 3 for a cube root, or any whole number up to 100.',
    'Read the decimal answer to six places, the simplest radical form for whole numbers, and the perfect powers on either side for a quick estimate.',
    'On a handheld calculator, type the root as a power if there is no dedicated key: x ^ (1 ÷ n). Leaving out the parentheses is the common mistake: 54 ^ 1 ÷ 3 gives 18, not 3.7798.'
  ],
  formulaTitle: 'What is the formula for an nth root?',
  formula: {
    expr: 'ⁿ√x = x<sup>1/n</sup>, so (ⁿ√x)ⁿ = x<br>ⁿ√(a × b) = ⁿ√a × ⁿ√b<br>Example: ∛54 = ∛(27 × 2) = ∛27 × ∛2 = 3∛2',
    vars: [['x', 'the radicand, the number under the root sign'], ['n', 'the index (2 is usually left unwritten)'], ['ⁿ√x', 'the number that, multiplied by itself n times, gives x']],
    note: 'The product rule is what makes simplifying possible: pull out any factor that is a perfect nth power and leave the rest inside.'
  },
  example: `<p>Simplify √72 and find its value.</p>
<p>Factor: 72 = 2³ × 3² = 36 × 2. The perfect square 36 comes out as 6, so √72 = <strong>6√2</strong>.</p>
<p>Since √2 ≈ 1.414214, √72 ≈ 6 × 1.414214 = <strong>8.485281</strong>. Check: 8.485281² ≈ 72.000. It sits between the perfect squares 64 (8²) and 81 (9²), closer to 64, as expected.</p>`,
  table: {
    title: 'What are the square roots and cube roots of common numbers?',
    intro: 'Values computed by the calculator above, rounded to six decimal places, with the simplified radical where one exists.',
    head: ['Number', 'Square root', 'Simplified √', 'Cube root', 'Simplified ∛'],
    rows: ({ run }) => [2, 3, 5, 8, 10, 12, 18, 20, 24, 27, 50, 64, 72, 100, 125].map(x => { const s = run({ x, n: 2 }), c = run({ x, n: 3 }); const simp = o => (o.rows[0][0] === 'Simplest radical form' ? o.rows[0][1].replace(/ \(a perfect.*\)$/, '') : ''); return [String(x), s.value, simp(s), c.value, simp(c)]; }),
    note: 'Perfect squares (4, 9, 16, 25…) and perfect cubes (8, 27, 64, 125…) have whole-number roots. Everything else is irrational: the decimals never end or repeat.'
  },
  sections: [
    {
      h2: 'How do you cube root on a calculator?',
      html: `<ul>
<li><strong>TI-84 Plus and TI-83 Plus:</strong> press <code>MATH</code>, then <code>4</code> for ∛(, type the number, close the parenthesis and press <code>ENTER</code>. For any other root, type the index first, then <code>MATH</code> <code>5</code> (ˣ√) and the number: 4 ˣ√ 81 gives 3.</li>
<li><strong>Scientific calculators:</strong> the cube root is usually the second function (SHIFT or 2nd) of the x³ or √ key. Look for ∛ printed above a key.</li>
<li><strong>iPhone:</strong> turn the phone sideways in the Calculator app to get scientific keys, including ³√x and ʸ√x.</li>
<li><strong>Any calculator with a power key:</strong> type 54, then ^ or xʸ, then (1 ÷ 3). The parentheses matter.</li>
<li><strong>Excel and Google Sheets:</strong> <code>=54^(1/3)</code> or <code>=POWER(54,1/3)</code>; use <code>=SQRT(A2)</code> for square roots. Excel returns a #NUM! error for a negative number raised to a fractional power, so for a negative cube root use <code>=SIGN(A2)*ABS(A2)^(1/3)</code>.</li>
</ul>`
    },
    {
      h2: 'How do you simplify a radical?',
      html: `<p>Write the number as a product of primes, then pull out every group of n identical factors. For a square root you need pairs; for a cube root, triples.</p>
<p>√180: 180 = 2² × 3² × 5. The pair of 2s and the pair of 3s come out as 2 × 3 = 6, leaving 5 inside: √180 = <strong>6√5</strong>. ∛250: 250 = 2 × 5³, so the triple of 5s comes out: ∛250 = <strong>5∛2</strong>.</p>
<p>A radical is fully simplified when no factor under the sign appears n times and there is no fraction under the sign. If your teacher wants the denominator rationalized, 1/√2 becomes √2/2.</p>`
    },
    {
      h2: 'How do you estimate a square root without a calculator?',
      html: `<p>Find the perfect squares on either side, then refine. √50 sits just above √49 = 7. A linear nudge gives 7 + (50 − 49) ÷ (2 × 7) ≈ <strong>7.0714</strong>, against the true 7.0711.</p>
<p>For more accuracy, use the Babylonian (Newton) method: guess, then average the guess with the number divided by the guess. For √10, start at 3: (3 + 10/3) ÷ 2 = 3.1667; again: (3.1667 + 10/3.1667) ÷ 2 = 3.16228, already correct to five decimals. Each round roughly doubles the number of correct digits.</p>`
    },
    {
      h2: 'Can you take the root of a negative number?',
      html: `<p>Odd roots, yes: ∛−27 = −3 because (−3) × (−3) × (−3) = −27. Even roots, not in the real numbers: no real number squared gives −16. Using the imaginary unit i = √−1, √−16 = 4i, which is what the calculator shows.</p>
<p>The same logic explains why √9 is 3 and not ±3. The radical sign means the principal (non-negative) root. The equation x² = 9 has two solutions, x = 3 and x = −3, but √9 names only the positive one. Side lengths from the Pythagorean theorem use that positive root; see the <a href="/right-triangle-calculator">right triangle calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the cube root of 27?', a: 'The cube root of 27 is 3, because 3 × 3 × 3 = 27. The cube root of 64 is 4, of 125 is 5, and of 1,000 is 10.' },
    { q: 'What is the square root of 2?', a: 'The square root of 2 is about 1.414214. It is irrational, so its decimal never ends or repeats.' },
    { q: 'Is a square root always smaller than the number?', a: 'Only for numbers above 1. For numbers between 0 and 1 the root is bigger: √0.25 = 0.5 and ∛0.001 = 0.1.' },
    { q: 'What is the fourth root of 81?', a: 'The fourth root of 81 is 3, because 3⁴ = 81. Enter 81 with index 4, or take the square root twice: √81 = 9 and √9 = 3.' },
    { q: 'How do I type a square root in Excel or Google Sheets?', a: 'Use =SQRT(A2) for a square root, or =A2^(1/n) for any other root. Both programs accept the same formulas.' },
    { q: 'What is the difference between a square root and a cube root?', a: 'A square root multiplied by itself twice gives the number (√49 = 7 because 7 × 7 = 49); a cube root multiplied by itself three times gives the number (∛343 = 7 because 7 × 7 × 7 = 343).' },
    { q: 'Why does 54 ^ 1/3 give the wrong answer on my calculator?', a: 'Without parentheses the calculator works out 54¹ first and then divides by 3, giving 18. Type 54 ^ (1 ÷ 3) to get the cube root, 3.779763.' }
  ],
  related: ['exponent-calculator', 'right-triangle-calculator', 'scientific-notation-calculator', 'log-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: nth Root', url: 'https://mathworld.wolfram.com/nthRoot.html' },
    { name: 'Wolfram MathWorld: Cube Root', url: 'https://mathworld.wolfram.com/CubeRoot.html' },
    { name: 'Microsoft Support: SQRT function', url: 'https://support.microsoft.com/en-us/office/sqrt-function-654975c2-05c4-4831-9a24-2c65e4040fdf' },
    { name: 'Microsoft Support: POWER function', url: 'https://support.microsoft.com/en-us/office/power-function-d3f2908b-56f4-4c3f-895a-07fb519c362a' }
  ]
};
