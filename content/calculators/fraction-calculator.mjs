export default {
  slug: 'fraction-calculator',
  hub: 'math',
  name: 'Fraction Calculator',
  title: 'Fraction Calculator: 18/24 Simplifies to 3/4 (Steps Shown)',
  h1: 'Fraction Calculator: Simplify, Add, Subtract, Multiply, Divide and Compare',
  meta: '18/24 simplifies to 3/4 because both numbers divide by 6. Simplify, add, subtract, multiply, divide or compare fractions and mixed numbers, steps shown.',
  keyword: 'how do you simplify a fraction on a calculator',
  also: ['fraction calculator', 'how do you divide fractions on a calculator', 'how to convert fraction to decimal calculator', 'how to multiply fractions calculator', 'which is greater fraction calculator', 'how to turn decimal to fraction on calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'op', label: 'What to do', type: 'select', value: 'simplify', wide: true, options: [['simplify', 'Simplify / convert one fraction'], ['add', 'Add (+)'], ['sub', 'Subtract (−)'], ['mul', 'Multiply (×)'], ['div', 'Divide (÷)'], ['compare', 'Compare (which is greater?)'], ['dec', 'Decimal to fraction']] },
    { id: 'w1', label: 'Fraction 1: whole number', type: 'number', value: '', placeholder: 'optional', help: 'For mixed numbers like 2 1/3.', showIf: { op: ['simplify', 'add', 'sub', 'mul', 'div', 'compare'] } },
    { id: 'n1', label: 'Fraction 1: numerator (top)', type: 'number', value: 18, showIf: { op: ['simplify', 'add', 'sub', 'mul', 'div', 'compare'] } },
    { id: 'd1', label: 'Fraction 1: denominator (bottom)', type: 'number', value: 24, showIf: { op: ['simplify', 'add', 'sub', 'mul', 'div', 'compare'] } },
    { id: 'w2', label: 'Fraction 2: whole number', type: 'number', value: '', placeholder: 'optional', showIf: { op: ['add', 'sub', 'mul', 'div', 'compare'] } },
    { id: 'n2', label: 'Fraction 2: numerator', type: 'number', value: 5, showIf: { op: ['add', 'sub', 'mul', 'div', 'compare'] } },
    { id: 'd2', label: 'Fraction 2: denominator', type: 'number', value: 6, showIf: { op: ['add', 'sub', 'mul', 'div', 'compare'] } },
    { id: 'dec', label: 'Decimal', type: 'text', value: '0.375', placeholder: 'e.g. 0.375 or 2.125', showIf: { op: ['dec'] } }
  ],
  compute(v, H) {
    var BIG = 9e15;
    function parse(w, n, d, k) {
      var hasW = isFinite(w), hasN = isFinite(n), hasD = isFinite(d);
      if (!hasW && !hasN) return { err: 'Enter fraction ' + k + '.' };
      if (!hasN) { n = 0; d = hasD ? d : 1; }
      if (!isFinite(d)) return { err: 'Enter the denominator of fraction ' + k + '.' };
      if (!hasW) w = 0;
      if (!Number.isInteger(w) || !Number.isInteger(n) || !Number.isInteger(d)) return { err: 'Use whole numbers in fraction ' + k + ' (for decimals choose "Decimal to fraction").' };
      if (d === 0) return { err: 'A denominator cannot be 0.' };
      if (d < 0) { d = -d; n = -n; }
      if (w !== 0 && n < 0) return { err: 'For a negative mixed number, put the minus sign on the whole number only.' };
      var N = w !== 0 ? w * d + (w < 0 ? -n : n) : n;
      if (Math.abs(N) > BIG || d > BIG) return { err: 'Those numbers are too large to handle exactly.' };
      return { n: N, d: d, mixed: w !== 0 };
    }
    function red(f) { if (f.n === 0) return { n: 0, d: 1 }; var g = H.gcd(f.n, f.d); return { n: f.n / g, d: f.d / g }; }
    function minus(x) { return x < 0 ? '−' + Math.abs(x) : String(x); }
    function fs(f) { return f.d === 1 ? minus(f.n) : minus(f.n) + '/' + f.d; }
    function mx(f) {
      if (f.d === 1 || Math.abs(f.n) < f.d) return fs(f);
      var q = Math.floor(Math.abs(f.n) / f.d), r = Math.abs(f.n) % f.d;
      return (f.n < 0 ? '−' : '') + q + (r ? ' ' + r + '/' + f.d : '');
    }
    function dec(f) {
      // exact decimal with repeating part marked, up to 40 digits
      var neg = f.n < 0, a = Math.abs(f.n), q = Math.floor(a / f.d), r = a % f.d, digits = '', seen = {}, rep = -1;
      while (r !== 0 && digits.length < 40) {
        if (seen[r] !== undefined) { rep = seen[r]; break; }
        seen[r] = digits.length; r *= 10; digits += Math.floor(r / f.d); r = r % f.d;
      }
      var head = (neg ? '−' : '') + q.toLocaleString('en-US');
      if (!digits) return head;
      if (rep >= 0) return head + '.' + digits.slice(0, rep) + '<span style="text-decoration:overline">' + digits.slice(rep) + '</span> (' + digits.slice(rep) + ' repeats)';
      return head + '.' + digits + (r !== 0 ? '…' : '');
    }
    function pct(f) { return H.pct(f.n / f.d * 100, 4); }
    var out, steps = [];
    if (v.op === 'dec') {
      var s = String(v.dec || '').replace(/[,\s]/g, '');
      var m = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(s);
      if (!m || (!m[2] && !m[3])) return { error: 'Enter a decimal such as 0.375.' };
      var fd = (m[3] || '').replace(/0+$/, '');
      if (fd.length > 12) return { error: 'Use 12 or fewer decimal places.' };
      var D = Math.pow(10, fd.length), N = Number(m[2] || '0') * D + Number(fd || '0');
      if (N > BIG) return { error: 'That number is too large to convert exactly.' };
      if (m[1] === '-') N = -N;
      var raw = { n: N, d: D }, f0 = red(raw), g0 = N === 0 ? 1 : H.gcd(N, D);
      steps.push(['Write over a power of 10', fs(raw)]);
      if (g0 > 1) steps.push(['Divide top and bottom by ' + g0.toLocaleString('en-US'), fs(f0)]);
      var rows = [['Simplest form', fs(f0), true], ['Mixed number', mx(f0)], ['Percent', pct(f0)]];
      if (f0.d > 100) {
        // best approximation with denominator <= 100 (continued fractions)
        var x = Math.abs(N / D), h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x, best = null;
        for (var i = 0; i < 30; i++) {
          var a = Math.floor(b), h2 = a * h1 + h0, k2 = a * k1 + k0;
          if (k2 > 100) break;
          best = { n: h2, d: k2 }; h0 = h1; h1 = h2; k0 = k1; k1 = k2;
          if (Math.abs(b - a) < 1e-12) break; b = 1 / (b - a);
        }
        if (best) rows.push(['Closest fraction with denominator ≤ 100', '≈ ' + (N < 0 ? '−' : '') + mx(best) + ' (off by ' + H.sig(Math.abs(best.n / best.d - x), 2) + ')']);
      }
      return { value: mx(f0), label: 'Decimal ' + H.esc(s) + ' as a fraction', expr: H.esc(s) + ' = ' + fs(raw), rows: rows, table: { head: ['Step', 'Work'], rows: steps } };
    }
    var A = parse(v.w1, v.n1, v.d1, 1);
    if (A.err) return { error: A.err };
    if (v.op === 'simplify') {
      var r1 = red(A), g = A.n === 0 ? A.d : H.gcd(A.n, A.d);
      if (A.mixed) steps.push(['Mixed number to improper fraction', mx(A) + ' = ' + (A.n < 0 ? '−' : '') + '(' + Math.floor(Math.abs(A.n) / A.d) + ' × ' + A.d + ' + ' + (Math.abs(A.n) % A.d) + ')/' + A.d + ' = ' + fs(A)]);
      steps.push(['Greatest common factor of ' + Math.abs(A.n) + ' and ' + A.d, String(g)]);
      steps.push(g > 1 ? ['Divide top and bottom by ' + g, minus(A.n) + ' ÷ ' + g + ' = ' + minus(r1.n) + ', ' + A.d + ' ÷ ' + g + ' = ' + r1.d] : ['Nothing but 1 divides both', fs(A) + ' is already in lowest terms']);
      return {
        value: fs(r1), label: (g > 1 ? 'Simplified form of ' : 'Already in simplest form: ') + fs(A), expr: fs(A) + (g > 1 ? ' ÷ ' + g + '/' + g : ''),
        rows: [['Mixed number', mx(r1)], ['Decimal', dec(r1)], ['Percent', pct(r1)], ['Reciprocal', r1.n === 0 ? 'undefined' : fs(red({ n: r1.d * (r1.n < 0 ? -1 : 1), d: Math.abs(r1.n) }))]],
        table: { head: ['Step', 'Work'], rows: steps }
      };
    }
    var B = parse(v.w2, v.n2, v.d2, 2);
    if (B.err) return { error: B.err };
    if (A.mixed || B.mixed) steps.push(['Write as improper fractions', fs(A) + ' and ' + fs(B)]);
    if (v.op === 'compare') {
      var left = A.n * B.d, right = B.n * A.d, sign = left > right ? '>' : left < right ? '<' : '=';
      steps.push(['Cross-multiply', minus(A.n) + ' × ' + B.d + ' = ' + minus(left) + ', ' + minus(B.n) + ' × ' + A.d + ' = ' + minus(right)]);
      steps.push(['Compare the products', minus(left) + ' ' + sign + ' ' + minus(right)]);
      var diff = red({ n: Math.abs(left - right), d: A.d * B.d });
      return {
        value: mx(red(A)) + ' ' + sign + ' ' + mx(red(B)),
        label: sign === '=' ? 'The fractions are equal' : (sign === '>' ? 'Fraction 1' : 'Fraction 2') + ' is greater',
        expr: fs(A) + ' vs ' + fs(B),
        rows: [['Fraction 1 as a decimal', dec(red(A))], ['Fraction 2 as a decimal', dec(red(B))], ['Difference', fs(diff)]],
        table: { head: ['Step', 'Work'], rows: steps }
      };
    }
    var res, sym;
    if (v.op === 'add' || v.op === 'sub') {
      var L = H.lcm(A.d, B.d), a1 = A.n * (L / A.d), b1 = B.n * (L / B.d);
      sym = v.op === 'add' ? '+' : '−';
      var top = v.op === 'add' ? a1 + b1 : a1 - b1;
      res = { n: top, d: L };
      steps.push(['Lowest common denominator of ' + A.d + ' and ' + B.d, String(L)]);
      steps.push(['Rewrite both fractions', fs(A) + ' = ' + minus(a1) + '/' + L + ', ' + fs(B) + ' = ' + minus(b1) + '/' + L]);
      steps.push([(v.op === 'add' ? 'Add' : 'Subtract') + ' the numerators', minus(a1) + ' ' + sym + ' ' + (b1 < 0 ? '(' + minus(b1) + ')' : b1) + ' = ' + minus(top) + ', giving ' + minus(top) + '/' + L]);
    } else if (v.op === 'mul') {
      sym = '×'; res = { n: A.n * B.n, d: A.d * B.d };
      steps.push(['Multiply the numerators', minus(A.n) + ' × ' + minus(B.n) + ' = ' + minus(res.n)]);
      steps.push(['Multiply the denominators', A.d + ' × ' + B.d + ' = ' + res.d]);
    } else {
      if (B.n === 0) return { error: 'You cannot divide by zero.' };
      sym = '÷';
      var flip = { n: B.d * (B.n < 0 ? -1 : 1), d: Math.abs(B.n) };
      res = { n: A.n * flip.n, d: A.d * flip.d };
      steps.push(['Keep, change, flip', fs(A) + ' × ' + fs(flip)]);
      steps.push(['Multiply across', minus(res.n) + '/' + res.d]);
    }
    if (Math.abs(res.n) > BIG || res.d > BIG) return { error: 'The result is too large to show exactly.' };
    var R = red(res), gg = res.n === 0 ? 1 : H.gcd(res.n, res.d);
    steps.push(['Simplify' + (gg > 1 ? ' (divide by ' + gg + ')' : ''), fs(R) + (Math.abs(R.n) > R.d && R.d > 1 ? ' = ' + mx(R) : '')]);
    return {
      value: mx(R), label: mx(A) + ' ' + sym + ' ' + mx(B),
      expr: fs(A) + ' ' + sym + ' ' + fs(B) + ' = ' + fs(R),
      rows: [['Improper fraction', fs(R)], ['Decimal', dec(R)], ['Percent', pct(R)]],
      table: { head: ['Step', 'Work'], rows: steps }
    };
  },
  quick: ({ r }) => `To simplify a fraction, divide the top and bottom by their greatest common factor. For 18/24 that factor is 6, so 18 ÷ 6 = 3 and 24 ÷ 6 = 4, giving <strong>${r.value}</strong> (0.75, or 75%). On a TI-84, type 18/24 and choose MATH ▸ 1:▸Frac; on a Casio with a fraction key, enter it and press =.`,
  stepsTitle: 'How to simplify a fraction on a calculator',
  steps: [
    'Pick what you want to do. "Simplify / convert" works on one fraction; the other choices need a second fraction.',
    'Enter the numerator and denominator. For a mixed number such as 2 1/3, put 2 in the whole-number box and 1/3 in the fraction boxes. Negative mixed numbers take the minus sign on the whole number only.',
    'Read the answer in simplest form, as a mixed number, a decimal (repeating digits are marked) and a percent. The step table shows the common factor or common denominator used.',
    'On a handheld: the TI-84 converts a decimal answer with MATH ▸ 1:▸Frac, and Casio models with a fraction key switch between fraction and decimal with S⇔D. A basic four-function calculator has no fraction mode, so find the common factor yourself.'
  ],
  formulaTitle: 'What are the fraction rules?',
  formula: {
    expr: 'a/b + c/d = (ad + bc) / bd<br>a/b × c/d = ac / bd<br>a/b ÷ c/d = a/b × d/c = ad / bc<br>Simplest form = (a ÷ GCF) / (b ÷ GCF)',
    vars: [['a, c', 'numerators (tops)'], ['b, d', 'denominators (bottoms), never 0'], ['GCF', 'greatest common factor of top and bottom']],
    note: 'For addition the calculator uses the lowest common denominator (the LCM of b and d) instead of b × d, which keeps the numbers small; the final answer is the same.'
  },
  example: `<p>Add 2 1/3 and 1 3/4.</p>
<p>Convert to improper fractions: 2 1/3 = 7/3 and 1 3/4 = 7/4. The lowest common denominator of 3 and 4 is 12, so 7/3 = 28/12 and 7/4 = 21/12.</p>
<p>Add the numerators: 28 + 21 = 49, giving 49/12. 49 ÷ 12 = 4 remainder 1, so the answer is <strong>4 1/12</strong> (about 4.0833).</p>`,
  table: {
    title: 'What are common fractions as decimals and percents?',
    intro: 'Computed by the calculator above. A bar over digits means they repeat forever.',
    head: ['Fraction', 'Decimal', 'Percent'],
    rows: ({ run }) => [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [1, 6], [1, 8], [3, 8], [5, 8], [7, 8], [1, 12], [1, 16], [3, 16]].map(([n, d]) => { const x = run({ op: 'simplify', w1: NaN, n1: n, d1: d }); return [n + '/' + d, x.rows[1][1].replace(/ \(\d+ repeats\)/, ''), x.rows[2][1]]; }),
    note: 'Denominators made only of 2s and 5s (2, 4, 5, 8, 10, 16…) give decimals that end. Any other prime factor, such as the 3 in 1/6 or 1/12, gives a repeating decimal.'
  },
  sections: [
    {
      h2: 'How do you divide fractions?',
      html: `<p>Keep the first fraction, change ÷ to ×, and flip the second fraction (use its reciprocal). Then multiply straight across.</p>
<p>3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 = <strong>1 7/8</strong>. Dividing by a whole number works the same way because 4 = 4/1: 2/3 ÷ 4 = 2/3 × 1/4 = 2/12 = 1/6.</p>
<p>Convert mixed numbers to improper fractions before flipping: 2 1/2 ÷ 1 1/4 = 5/2 × 4/5 = 20/10 = 2. Flipping only the fraction part of a mixed number is a frequent error.</p>`
    },
    {
      h2: 'How do you add fractions with different denominators?',
      html: `<p>Give both fractions the same denominator first, then add only the numerators. The lowest common denominator is the smallest number both denominators divide into: for 3/4 + 5/6 it is 12, so 9/12 + 10/12 = 19/12 = <strong>1 7/12</strong>.</p>
<p>Adding tops and bottoms separately (3/4 + 5/6 = 8/10) is always wrong: half a pizza plus half a pizza is a whole pizza, not 2/4 of one. Subtraction follows the same rule, and borrowing with mixed numbers is easier if you convert to improper fractions first.</p>`
    },
    {
      h2: 'How can you tell which fraction is greater?',
      html: `<p>Cross-multiply. To compare 5/8 and 3/5, multiply each numerator by the other fraction's denominator: 5 × 5 = 25 and 3 × 8 = 24. The bigger product sits on the side of the bigger fraction, so <strong>5/8 &gt; 3/5</strong>, by a slim 1/40.</p>
<p>Two shortcuts help: with equal denominators the bigger numerator wins (5/9 &gt; 4/9), and with equal numerators the smaller denominator wins (3/7 &gt; 3/8, because sevenths are bigger pieces than eighths). Converting both to decimals also works, 0.625 against 0.6.</p>`
    },
    {
      h2: 'How do you turn a decimal into a fraction?',
      html: `<p>Write the digits over the matching power of 10, then simplify. 0.375 has three decimal places, so it is 375/1000; both divide by 125, giving <strong>3/8</strong>. 2.125 becomes 2125/1000 = 17/8 = 2 1/8.</p>
<p>Repeating decimals need one more idea. 0.333… is 1/3, 0.1666… is 1/6 and 0.0909… is 1/11. If you type a rounded repeating decimal such as 0.3333, the calculator gives the exact 3,333/10,000 and also the closest simple fraction (1/3). Shop measurements are a common use: 0.6875 inch is 11/16 inch.</p>`
    }
  ],
  faq: [
    { q: 'What is 18/24 in simplest form?', a: '18/24 simplifies to 3/4. The greatest common factor of 18 and 24 is 6, and 18 ÷ 6 = 3, 24 ÷ 6 = 4.' },
    { q: 'How do you simplify a fraction without a calculator?', a: 'Divide the top and bottom by any factor they share and repeat until nothing but 1 divides both. 48/60 → 24/30 → 12/15 → 4/5. Dividing by the greatest common factor (12) gets there in one step.' },
    { q: 'How do you multiply a fraction by a whole number?', a: 'Multiply the numerator by the whole number and keep the denominator. 2/3 × 6 = 12/3 = 4.' },
    { q: 'What is 3/8 as a decimal?', a: '3/8 is 0.375, or 37.5%. Divide 3 by 8 to check.' },
    { q: 'How do you change an improper fraction to a mixed number?', a: 'Divide the numerator by the denominator. The quotient is the whole number and the remainder goes over the original denominator: 22/7 = 3 remainder 1, so 22/7 = 3 1/7.' },
    { q: 'How do you subtract mixed numbers?', a: 'Convert both to improper fractions, use a common denominator, and subtract. 3 1/4 − 1 2/3 = 13/4 − 5/3 = 39/12 − 20/12 = 19/12 = 1 7/12.' },
    { q: 'Can a denominator be negative?', a: 'Yes, but it is written differently: 3/−4 equals −3/4. A denominator of 0 is never allowed, because division by zero is undefined.' }
  ],
  related: ['percentage-calculator', 'ratio-calculator', 'factor-pair-calculator', 'scientific-notation-calculator'],
  sources: [
    { name: 'Khan Academy: Arithmetic (fractions units)', url: 'https://www.khanacademy.org/math/arithmetic' },
    { name: 'Wolfram MathWorld: Greatest Common Divisor', url: 'https://mathworld.wolfram.com/GreatestCommonDivisor.html' },
    { name: 'Wolfram MathWorld: Repeating Decimal', url: 'https://mathworld.wolfram.com/RepeatingDecimal.html' }
  ]
};
