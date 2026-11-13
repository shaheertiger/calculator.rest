export default {
  slug: 'factor-pair-calculator',
  hub: 'math',
  name: 'What Multiplies To and Adds To Calculator',
  title: 'What Multiplies To and Adds To Calculator: −24 & 5 Give 8, −3',
  h1: 'Find Two Numbers From Their Product and Sum (Factoring Helper)',
  meta: '8 and −3 multiply to −24 and add to 5, so x² + 5x − 24 = (x + 8)(x − 3). Enter any product and sum for the two numbers, all factor pairs and the factored form.',
  keyword: 'what multiplies to and adds to calculator',
  also: ['what multiplies to and adds to', 'factor pair calculator', 'ac method calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'P', label: 'Multiplies to (product)', type: 'number', value: -24 },
    { id: 'S', label: 'Adds to (sum)', type: 'number', value: 5 }
  ],
  compute(v, H) {
    function f(t) { var a = Math.abs(t); return a !== 0 && (a < 1e-6 || a >= 1e15) ? H.sig(t, 8) : H.num(t, 4).replace('-', '−'); }
    function term(k) { return k === 0 ? '' : (k > 0 ? ' + ' : ' − ') + f(Math.abs(k)); }
    var P = v.P, S = v.S;
    if (!isFinite(P) || !isFinite(S)) return { error: 'Enter the product and the sum.' };
    var disc = S * S - 4 * P, rows = [], out;
    var poly = 'x²' + (S === 0 ? '' : (S > 0 ? ' + ' : ' − ') + (Math.abs(S) === 1 ? '' : f(Math.abs(S))) + 'x') + term(P);
    if (disc < 0) {
      var re = S / 2, im = Math.sqrt(-disc) / 2;
      out = { value: 'No real numbers', label: 'Complex pair: ' + f(re) + ' ± ' + f(im) + 'i', expr: 'S² − 4P = ' + f(disc) + ' < 0', sub: 'Two real numbers with sum S and product P exist only when S² ≥ 4P. ' + poly + ' does not factor over the real numbers.' };
      rows.push(['Complex numbers', f(re) + ' + ' + f(im) + 'i and ' + f(re) + ' − ' + f(im) + 'i']);
    } else {
      var sq = Math.sqrt(disc), m = (S + sq) / 2, n = (S - sq) / 2;
      var isInt = Number.isInteger(P) && Number.isInteger(S) && Number.isInteger(sq) && (S + sq) % 2 === 0;
      if (isInt) { m = Math.round(m); n = Math.round(n); }
      out = { value: f(m) + ' and ' + f(n), label: 'Multiply to ' + f(P) + ' and add to ' + f(S), expr: f(m) + ' × ' + (n < 0 ? '(' + f(n) + ')' : f(n)) + ' = ' + f(m * n) + ', ' + f(m) + ' + ' + (n < 0 ? '(' + f(n) + ')' : f(n)) + ' = ' + f(m + n) };
      rows.push(['Factored form of ' + poly, n === 0 ? 'x(x' + term(m) + ')' : m === 0 ? 'x(x' + term(n) + ')' : '(x' + term(m) + ')(x' + term(n) + ')', true]);
      rows.push(['Roots of ' + poly + ' = 0', 'x = ' + f(-m) + (m !== n ? ' and x = ' + f(-n) : ' (double root)')]);
      out.sub = isInt ? 'Both numbers are integers, so the quadratic factors neatly.' : 'The numbers are not both integers, so ' + poly + ' does not factor over the integers; these come from the quadratic formula.';
    }
    rows.push(['Discriminant S² − 4P', f(disc)]);
    out.rows = rows;
    if (Number.isInteger(P) && Number.isInteger(S) && P !== 0 && Math.abs(P) <= 1e8) {
      var A = Math.abs(P), pairs = [];
      for (var d = 1; d * d <= A && pairs.length < 60; d++) {
        if (A % d) continue;
        var e = A / d;
        if (P > 0) { pairs.push([d, e]); pairs.push([-d, -e]); }
        else { pairs.push([d, -e]); pairs.push([-d, e]); }
      }
      out.table = { head: ['Factor pair', 'Sum', 'Match?'], rows: pairs.slice(0, 40).map(function (p) { return [f(p[0]) + ' × ' + f(p[1]), f(p[0] + p[1]), p[0] + p[1] === S ? '✓ adds to ' + f(S) : '']; }), caption: 'Every integer pair that multiplies to ' + f(P) };
    } else if (P === 0) out.sub = 'A product of 0 means one number is 0, so the other must be the sum itself.';
    return out;
  },
  quick: ({ r }) => `The two numbers that multiply to −24 and add to 5 are <strong>${r.value}</strong>: 8 × (−3) = −24 and 8 + (−3) = 5. That means x² + 5x − 24 factors as (x + 8)(x − 3). For any product P and sum S, the numbers are (S ± √(S² − 4P)) ÷ 2, and the calculator lists every factor pair so you can see why.`,
  stepsTitle: 'How to find what multiplies to one number and adds to another',
  steps: [
    'Write down the target product (the constant c in x² + bx + c) and the target sum (the coefficient b).',
    'List the factor pairs of the product. For a negative product, one number of each pair is negative; for a positive product, both share the sign of the sum.',
    'Add each pair and stop at the one that hits the sum. The calculator lists every pair and ticks the match.',
    'If no integer pair works, the numbers are irrational or complex; they come from (S ± √(S² − 4P)) ÷ 2. Getting the signs mixed up (−8 and 3 instead of 8 and −3) is the usual slip, so check both the product and the sum.'
  ],
  formulaTitle: 'What formula gives the two numbers?',
  formula: {
    expr: 'm + n = S and m × n = P<br>m, n = ( S ± √(S² − 4P) ) ÷ 2<br>x² + Sx + P = (x + m)(x + n)',
    vars: [['P', 'the product the numbers multiply to'], ['S', 'the sum they add to'], ['S² − 4P', 'the discriminant: negative means no real pair']],
    note: 'The numbers are the roots of t² − St + P = 0, which is why the quadratic formula finds them (Vieta\'s formulas).'
  },
  example: `<p>Factor x² − 2x − 35.</p>
<p>You need two numbers that multiply to −35 and add to −2. Factor pairs of −35: 1 × −35 (sum −34), −1 × 35 (34), 5 × −7 (−2) ✓, −5 × 7 (2).</p>
<p>The pair is 5 and −7, so x² − 2x − 35 = <strong>(x + 5)(x − 7)</strong>, with roots x = −5 and x = 7.</p>`,
  table: {
    title: 'What multiplies to and adds to these common pairs?',
    intro: 'Homework-style products and sums solved by the calculator above, with the factored quadratic x² + bx + c.',
    head: ['Multiplies to (c)', 'Adds to (b)', 'The numbers', 'Factored form'],
    rows: ({ run }) => [[12, 7], [12, -7], [-12, 1], [-12, -4], [24, 10], [-24, 5], [36, 13], [36, -13], [-36, 0], [18, -9], [-18, 7], [20, 9], [-15, 2], [48, 14], [-40, 3]].map(([p, s]) => { const o = run({ P: p, S: s }); return [String(p).replace('-', '−'), String(s).replace('-', '−'), o.value, o.rows[0][1]]; })
  },
  sections: [
    {
      h2: 'How does this help you factor a quadratic?',
      html: `<p>When you multiply out (x + m)(x + n), you get x² + (m + n)x + mn. So to factor x² + bx + c you need two numbers whose <strong>sum is b</strong> and whose <strong>product is c</strong>. That is exactly the "what multiplies to c and adds to b" question.</p>
<p>For x² + 10x + 24, the pair is 4 and 6 (4 × 6 = 24, 4 + 6 = 10), so it factors as (x + 4)(x + 6). Setting each factor to zero solves the equation: x = −4 or x = −6. Note the sign flip: the numbers you find are the negatives of the roots.</p>`
    },
    {
      h2: 'How do you factor when the leading coefficient is not 1?',
      html: `<p>Use the ac method. For ax² + bx + c, find two numbers that multiply to a × c and add to b, then split the middle term and factor by grouping.</p>
<p>6x² + 7x − 3: a × c = 6 × (−3) = −18, and b = 7. The pair is 9 and −2. Split: 6x² + 9x − 2x − 3. Group: 3x(2x + 3) − 1(2x + 3) = <strong>(3x − 1)(2x + 3)</strong>. Enter −18 and 7 above to find the pair.</p>`
    },
    {
      h2: 'What are the sign rules for the two numbers?',
      html: `<ul>
<li><strong>Positive product, positive sum:</strong> both numbers positive (12, 7 → 3 and 4).</li>
<li><strong>Positive product, negative sum:</strong> both negative (12, −7 → −3 and −4).</li>
<li><strong>Negative product:</strong> one positive and one negative; the one with the larger size takes the sign of the sum (−12, 1 → 4 and −3; −12, −4 → −6 and 2).</li>
<li><strong>Sum of 0:</strong> the numbers are opposites, which only works for a negative product (−36, 0 → 6 and −6): a difference of squares.</li>
</ul>`
    },
    {
      h2: 'What if no whole numbers multiply and add to the targets?',
      html: `<p>Then the quadratic does not factor over the integers, but the numbers still exist whenever S² − 4P is zero or positive. For a product of 3 and a sum of 5, S² − 4P = 13, so the numbers are (5 ± √13) ÷ 2 ≈ 4.3028 and 0.6972.</p>
<p>When S² − 4P is negative, no real numbers work. A product of 5 and a sum of 2 gives 4 − 20 = −16, so the numbers are the complex pair 1 + 2i and 1 − 2i. The <a href="/root-calculator">root calculator</a> simplifies the square roots that appear in these answers.</p>`
    }
  ],
  faq: [
    { q: 'What multiplies to 12 and adds to 7?', a: '3 and 4: 3 × 4 = 12 and 3 + 4 = 7. So x² + 7x + 12 = (x + 3)(x + 4).' },
    { q: 'What multiplies to −12 and adds to −1?', a: '−4 and 3: (−4) × 3 = −12 and −4 + 3 = −1. So x² − x − 12 = (x − 4)(x + 3).' },
    { q: 'What multiplies to 36 and adds to −13?', a: '−4 and −9. A positive product with a negative sum means both numbers are negative.' },
    { q: 'What multiplies to −24 and adds to −5?', a: '−8 and 3: (−8) × 3 = −24 and −8 + 3 = −5. It is the default example with the signs swapped.' },
    { q: 'Why does the product-and-sum trick work?', a: 'Expanding (x + m)(x + n) gives x² + (m + n)x + mn, so matching b to m + n and c to mn recovers the factors.' },
    { q: 'What if the product is 0?', a: 'Then one number is 0 and the other equals the sum. x² + 5x factors as x(x + 5).' }
  ],
  related: ['root-calculator', 'fraction-calculator', 'exponent-calculator', 'slope-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Quadratic Equation', url: 'https://mathworld.wolfram.com/QuadraticEquation.html' },
    { name: 'Wolfram MathWorld: Vieta\'s Formulas', url: 'https://mathworld.wolfram.com/VietasFormulas.html' },
    { name: 'Khan Academy: Algebra 1 (factoring quadratics)', url: 'https://www.khanacademy.org/math/algebra' }
  ]
};
