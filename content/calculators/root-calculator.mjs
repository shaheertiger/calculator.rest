export default {
  slug: 'root-calculator',
  hub: 'math',
  name: 'Root Calculator',
  h1: 'Square Root, Cube Root and nth Root Calculator',
  title: 'Root Calculator: ∛54 = 3∛2 ≈ 3.7798 (With Steps)',
  meta: 'The cube root of 54 is 3∛2 ≈ 3.7798, since 54 = 27 × 2. Find square, cube and nth roots, simplify radicals by prime factors, and see each step.',
  keyword: 'root calculator',
  also: ['cube root calculator', 'square root calculator', 'nth root calculator', 'simplify radicals calculator', 'how to cube root on a calculator', 'simplest radical form calculator'],
  updated: '2026-11-26',
  answer: ({ r }) => `The cube root of 54 is <strong>${r.value}</strong>, or 3∛2 in simplest radical form, because 54 = 27 × 2 and ∛27 = 3.`,
  inputs: [
    { id: 'x', label: 'Number under the root (x)', type: 'number', value: 54 },
    { id: 'n', label: 'Which root (n)', type: 'number', value: 3, help: '2 = square root, 3 = cube root, 4 = fourth root…' },
    { id: 'dp', label: 'Round the decimal to', type: 'select', value: '4', options: [['2', '2 decimal places'], ['3', '3 decimal places'], ['4', '4 decimal places'], ['6', '6 decimal places']] }
  ],
  compute(v, H) {
    function sup(s) { return '<sup>' + s + '</sup>'; }
    function sym(k) { return k === 2 ? '√' : k === 3 ? '∛' : k === 4 ? '∜' : sup(k) + '√'; }
    function f(x) { var a = Math.abs(x); if (a !== 0 && (a < 1e-6 || a >= 1e15)) { var t = x.toExponential(7).split('e'); return '(' + String(Number(t[0])).replace('-', '−') + ' × 10' + sup(Number(t[1]).toString().replace('-', '−')) + ')'; } return H.num(x, 8).replace('-', '−'); }
    function nw(k) { return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][k] || String(k); }
    function word(k) { return k === 2 ? 'square root' : k === 3 ? 'cube root' : H.ord(k) + ' root'; }
    function pw(k) { return k === 2 ? 'square' : k === 3 ? 'cube' : H.ord(k) + ' power'; }
    var x = v.x, n = v.n, dp = Number(v.dp) || 4;
    if (!isFinite(x)) return { error: 'Enter the number under the root.' };
    if (!Number.isInteger(n) || n < 2 || n > 100) return { error: 'The root must be a whole number from 2 to 100.' };
    var neg = x < 0, imag = neg && n % 2 === 0, ax = Math.abs(x);
    var r = n === 2 ? Math.sqrt(ax) : n === 3 ? Math.cbrt(ax) : Math.pow(ax, 1 / n), ri = Math.round(r);
    if (Math.pow(ri, n) === ax) r = ri;
    var S = sym(n), sgn = neg && !imag ? '−' : '', iu = imag ? 'i' : '';
    var rounded = H.round(r, dp), isEx = Math.abs(rounded - r) < 1e-12;
    var dec = sgn + H.num(rounded, dp) + iu;
    var steps = ['<b>Formula:</b> ' + sup('n') + '√x = r means r' + sup('n') + ' = x. To simplify, split x into factors: ' + sup('n') + '√(a × b) = ' + sup('n') + '√a × ' + sup('n') + '√b, and pull out every perfect ' + pw(n) + '.'];
    var inner = S + '(' + f(x) + ')';
    if (neg) steps.push(imag ? '<b>Negative under an even root:</b> ' + inner + ' = ' + S + f(ax) + ' × √(−1) = ' + S + f(ax) + ' × i, so work with ' + f(ax) + ' and attach i at the end'
      : '<b>Negative under an odd root:</b> ' + inner + ' = −' + S + f(ax) + ', because an odd number of negative factors stays negative');
    var simple = '', out = 1, ins = 1;
    if (Number.isInteger(ax) && ax >= 2 && ax <= 1e12) {
      var m = ax, fac = [], p = 2;
      while (p * p <= m) { var e = 0; while (m % p === 0) { m /= p; e++; } if (e) fac.push([p, e]); p += p === 2 ? 1 : 2; }
      if (m > 1) fac.push([m, 1]);
      fac.forEach(function (q) { out *= Math.pow(q[0], Math.floor(q[1] / n)); ins *= Math.pow(q[0], q[1] % n); });
      steps.push('<b>Substitute and factor:</b> ' + S + H.int(ax) + ', with ' + H.int(ax) + ' = ' + fac.map(function (q) { return q[0] + (q[1] > 1 ? sup(q[1]) : ''); }).join(' × ') + ' in prime factors');
      var groups = fac.filter(function (q) { return q[1] >= n; });
      if (!groups.length) steps.push('<b>Look for ' + (n === 2 ? 'pairs' : 'groups of ' + nw(n)) + ':</b> no prime appears ' + nw(n) + ' times, so ' + S + H.int(ax) + ' is already in simplest form');
      else {
        var outTxt = groups.map(function (q) { var k = Math.floor(q[1] / n); return k > 1 ? q[0] + sup(k) : String(q[0]); }).join(' × ');
        steps.push('<b>Pull out ' + (n === 2 ? 'pairs' : 'groups of ' + nw(n)) + ':</b> ' + groups.map(function (q) { var k = Math.floor(q[1] / n); return nw(k) + ' ' + (n === 2 ? (k > 1 ? 'pairs' : 'pair') + ' of ' : (k > 1 ? 'groups' : 'group') + ' of ' + nw(n) + ' ') + q[0] + 's'; }).join(' and ') + ' come' + (groups.length === 1 && Math.floor(groups[0][1] / n) === 1 ? 's' : '') + ' out as ' + outTxt + (groups.length > 1 || Math.floor(groups[0][1] / n) > 1 ? ' = ' + H.int(out) : '') + (ins > 1 ? '; ' + H.int(ins) + ' stays inside' : '; nothing is left inside'));
        simple = ins === 1 ? H.int(out) : H.int(out) + S + H.int(ins);
        steps.push('<b>Simplest radical form:</b> ' + S + H.int(ax) + ' = ' + (ins === 1 ? H.int(out) + ', a perfect ' + pw(n) : S + '(' + H.int(Math.pow(out, n)) + ' × ' + H.int(ins) + ') = ' + S + H.int(Math.pow(out, n)) + ' × ' + S + H.int(ins) + ' = ' + simple));
        simple = sgn + simple + (imag ? ' i' : '');
      }
    } else steps.push('<b>Substitute:</b> ' + S + f(ax) + (ax !== Math.floor(ax) ? ' (not a whole number, so go straight to the decimal)' : ''));
    if (ins > 1 && out > 1) {
      var ri2 = Math.pow(ins, 1 / n);
      steps.push('<b>Decimal:</b> ' + S + H.int(ins) + ' = ' + f(ri2) + '…, so ' + H.int(out) + S + H.int(ins) + ' = ' + H.int(out) + ' × ' + f(ri2) + '… = ' + f(r));
    } else if (!(Number.isInteger(r) && ins === 1 && out > 1)) {
      var lo = Math.floor(r);
      if (ax >= 1 && r < 1e6 && !Number.isInteger(r)) steps.push('<b>Estimate:</b> ' + H.int(Math.pow(lo, n)) + ' (' + lo + sup(n) + ') < ' + f(ax) + ' < ' + H.int(Math.pow(lo + 1, n)) + ' (' + (lo + 1) + sup(n) + '), so the root is between ' + lo + ' and ' + (lo + 1));
      steps.push('<b>Decimal:</b> ' + S + f(ax) + ' = ' + f(ax) + sup('1/' + n) + ' = ' + f(r));
    }
    var chk = Math.pow(rounded, n);
    steps.push('<b>Check:</b> ' + (isEx ? H.num(r, dp) + sup(n) + ' = ' + f(ax) : H.num(rounded, dp) + sup(n) + ' = ' + f(Number(chk.toPrecision(10))) + ', close to ' + f(ax) + ' (the gap comes from rounding the root)'));
    steps.push('<b>Answer:</b> ' + inner + ' = ' + (simple && simple !== dec ? simple + ' ≈ ' : '') + dec + (isEx ? ' (exact, no rounding needed)' : ' (rounded to ' + dp + ' decimal places)') + '.');
    var rows = [];
    if (simple && simple !== dec) rows.push(['Simplest radical form', simple, true]);
    rows.push(['As an exponent', (neg ? '(' + f(x) + ')' : f(x)) + sup('1/' + n)]);
    return { value: dec, label: (word(n).charAt(0).toUpperCase() + word(n).slice(1)) + ' of ' + f(x), rows: rows, steps: steps };
  },
  facts: {
    formula: 'ⁿ√x = x<sup>1/n</sup>, so (ⁿ√x)ⁿ = x<br>ⁿ√(a × b) = ⁿ√a × ⁿ√b<br>∛54 = ∛(27 × 2) = ∛27 × ∛2 = 3∛2',
    vars: [['x', 'the radicand, the number under the root sign'], ['n', 'the index: 2 for a square root (usually not written), 3 for a cube root'], ['ⁿ√x', 'the number that, used as a factor n times, gives x']],
    rounding: 'perfect squares and cubes give exact whole numbers. Other roots are irrational, so the decimal is rounded (4 decimal places by default); the simplest radical form is the exact answer.',
    note: 'Simplifying works only on a product. Pull out any factor that is a perfect nth power; a sum under the sign cannot be split.'
  },
  example: {
    h2: 'Worked example: the side of a square garden',
    html: `<p><strong>Problem:</strong> A square garden has an area of 200 square feet. How long is each side? Give the exact answer and the decimal to 4 places.</p>
<p><strong>1.</strong> Area of a square = side², so side = √200.</p>
<p><strong>2.</strong> Factor: 200 = 2³ × 5². The pair of 5s comes out as 5, one pair of 2s comes out as 2, and one 2 stays inside, so √200 = √(100 × 2) = 10√2.</p>
<p><strong>3.</strong> √2 = 1.41421356…, so 10√2 = 14.14213562.</p>
<p><strong>Answer:</strong> each side is 10√2 ≈ 14.1421 feet. Sense check: 14² = 196 and 15² = 225, so a side a little over 14 feet fits an area of 200.</p>`
  },
  variants: [
    {
      h2: 'What is the cube root of 54?',
      html: `<p>The cube root of 54 is <strong>3.7798</strong> to 4 decimal places, or exactly <strong>3∛2</strong>. Factor 54 = 2 × 3³: the three 3s form one group, so a 3 comes out and the 2 stays under the sign. Then ∛2 = 1.25992105… and 3 × 1.25992105… = 3.77976315. It sits between ∛27 = 3 and ∛64 = 4, nearer 4.</p>`
    },
    {
      h2: 'How do you simplify a square root?',
      html: `<p>Write the number in prime factors and take one factor out for every pair. √72: 72 = 2³ × 3², so one pair of 2s and the pair of 3s come out as 2 × 3 = 6, and a single 2 stays inside: √72 = <strong>6√2</strong> ≈ 8.4853. Splitting 72 as 4 × 18 gives 2√18, which is not finished, because 18 still holds the square 9. A radical is in simplest form when no factor inside appears n times.</p>`
    },
    {
      h2: 'How do you cube root on a calculator?',
      html: `<p>On a TI-84, press MATH, then 4 for ∛(, type the number and press ENTER. For any other root, type the index, then MATH 5 (ˣ√), then the number: 4 ˣ√ 81 gives 3. A calculator with only a power key works too: 54 ^ (1 ÷ 3) = 3.7798. The brackets matter, since 54 ^ 1 ÷ 3 gives 18.</p>`
    }
  ],
  mistakes: [
    '<strong>Halving instead of rooting.</strong> √64 is 8, not 32, and ∛27 is 3, not 9. A root asks which number times itself gives x.',
    '<strong>Splitting a root over addition.</strong> √(9 + 16) = √25 = 5, not √9 + √16 = 7. The product rule works for × only.',
    '<strong>Stopping before the radical is simplest.</strong> √48 = 2√12 still has a square (4) inside; the finished form is 4√3.',
    '<strong>Taking an even root of a negative number as a real answer.</strong> √(−16) is 4i, not −4, because (−4)² = +16. Odd roots are fine: ∛(−8) = −2.'
  ],
  related: ['exponent-calculator', 'scientific-notation-calculator', 'slope-calculator'],
  faq: [
    { q: 'Is a square root always positive?', a: 'The √ sign means the principal root, which is never negative: √25 = 5. The equation x² = 25 has two solutions, 5 and −5, so write ±√25 when you need both.' },
    { q: 'What is the square root of 2?', a: 'About 1.4142 to 4 decimal places (1.41421356 to 8). It is irrational, so the decimal never ends or repeats, and √2 is the exact form.' },
    { q: 'How do you write a root as an exponent?', a: 'ⁿ√x = x<sup>1/n</sup>, so √x = x<sup>1/2</sup> and ∛x = x<sup>1/3</sup>. A root raised to a power becomes a fraction exponent: (∛8)² = 8<sup>2/3</sup> = 4.' },
    { q: 'Is a root always smaller than the number?', a: 'Only for numbers above 1. Between 0 and 1 the root is bigger: √0.25 = 0.5 and ∛0.001 = 0.1.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Square Root', url: 'https://mathworld.wolfram.com/SquareRoot.html' },
    { name: 'Wolfram MathWorld: Cube Root', url: 'https://mathworld.wolfram.com/CubeRoot.html' },
    { name: 'Wolfram MathWorld: nth Root', url: 'https://mathworld.wolfram.com/nthRoot.html' }
  ]
};
