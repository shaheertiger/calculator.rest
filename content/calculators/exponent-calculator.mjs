export default {
  slug: 'exponent-calculator',
  hub: 'math',
  name: 'Exponent Calculator',
  title: 'Exponent Calculator: 2¹⁰ = 1,024, Negative & Fraction Powers',
  h1: 'Power Calculator: Raise Any Number to Any Exponent',
  meta: '2 to the 10th power is 1,024: 2 multiplied by itself 10 times. Raise any number to a whole, negative, decimal or fractional exponent and see the keys to press.',
  keyword: 'how to put an exponent on a calculator',
  also: ['exponent calculator', 'power calculator', 'negative exponent calculator', 'fractional exponent calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'base', label: 'Base (a)', type: 'number', value: 2 },
    { id: 'exp', label: 'Exponent (n)', type: 'text', value: '10', placeholder: 'e.g. 10, −3, 0.5 or 2/3', help: 'Fractions such as 2/3 are allowed.' }
  ],
  compute(v, H) {
    var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    function sup(k) { return String(k).split('').map(function (c) { return SUP[c] || c; }).join(''); }
    function f(x) {
      if (x === 0) return '0';
      var ax = Math.abs(x);
      if (ax >= 1e15 || ax < 1e-6) return H.sig(x, 10);
      if (Number.isInteger(x)) return H.num(x, 0);
      return H.num(Number(x.toPrecision(12)), 10);
    }
    function sciLog(L, neg) { // value = ±10^L
      var e = Math.floor(L), m = Math.pow(10, L - e);
      if (m >= 9.9999999995) { m = 1; e += 1; }
      return (neg ? '−' : '') + H.num(Number(m.toPrecision(10)), 9) + ' × 10' + sup(e);
    }
    if (!isFinite(v.base)) return { error: 'Enter the base.' };
    var s = String(v.exp || '').replace(/\s/g, '').replace('−', '-');
    var mm = /^([+-]?)(\d+)(?:\.(\d+))?(?:\/(\d+))?$/.exec(s);
    if (!mm) return { error: 'Enter the exponent as a number (3, −2, 0.5) or a fraction (2/3).' };
    if (mm[3] && mm[4]) return { error: 'Use either a decimal or a fraction for the exponent, not both.' };
    var p, q;
    if (mm[4]) { p = Number(mm[2]); q = Number(mm[4]); if (q === 0) return { error: 'The fraction\'s denominator cannot be 0.' }; }
    else { var dg = mm[3] || ''; if (dg.length > 9) dg = dg.slice(0, 9); q = Math.pow(10, dg.length); p = Number(mm[2]) * q + Number(dg || '0'); }
    if (mm[1] === '-') p = -p;
    var g = H.gcd(p, q) || 1; p /= g; q /= g;
    var a = v.base, e = p / q, isInt = q === 1, eTxt = isInt ? String(p) : (mm[4] ? p + '/' + q : String(Number((p / q).toPrecision(10))));
    var expr = (a < 0 ? '(' + f(a) + ')' : f(a)) + (isInt ? sup(p) : '^(' + eTxt + ')');
    var rows = [], value, sub = '';
    if (a === 0) {
      if (e < 0) return { error: '0 raised to a negative power is undefined (it would mean dividing by 0).' };
      value = e === 0 ? '1' : '0';
      if (e === 0) sub = '0⁰ is defined as 1 by most calculators, Excel and textbooks, though some treat it as undefined.';
      return { value: value, label: f(a) + ' to the power ' + eTxt, expr: expr, rows: [['Excel / Sheets formula', '=POWER(0,' + eTxt + ')']], sub: sub };
    }
    var neg = false, real = true;
    if (a < 0 && !isInt) {
      if (q % 2 === 1) neg = Math.abs(p) % 2 === 1; else real = false;
    } else if (a < 0) neg = Math.abs(p) % 2 === 1;
    var mag = Math.pow(Math.abs(a), e);
    var L = e * Math.log10(Math.abs(a));
    if (!real) {
      var re = mag * Math.cos(Math.PI * e), im = mag * Math.sin(Math.PI * e);
      return { value: (Math.abs(re) > 1e-12 ? f(re) + (im < 0 ? ' − ' : ' + ') : (im < 0 ? '−' : '')) + f(Math.abs(im)) + 'i', label: 'Principal complex value', expr: expr, rows: [['Magnitude', f(mag)], ['Real-number answer', 'none: an even root of a negative number']], sub: 'A negative base with an exponent whose denominator is even has no real value.' };
    }
    if (isInt && Number.isInteger(a) && Math.abs(L) >= 15.9 && p > 0 && L < 3000) {
      var big = BigInt(Math.abs(a)) ** BigInt(p), str = big.toString(), digits = str.length;
      var withC = str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      value = digits <= 40 ? (neg ? '−' : '') + withC : sciLog(L, neg);
      rows.push(['Scientific notation', sciLog(L, neg)]);
      rows.push(['Number of digits', H.int(digits)]);
      if (digits > 40) rows.push(['First and last digits', str.slice(0, 12) + '…' + str.slice(-12)]);
    } else if (!isFinite(mag) || (mag === 0 && e < 0) || mag === 0 || Math.abs(L) >= 15) {
      value = sciLog(L, neg);
    } else {
      value = f(neg ? -mag : mag);
      if (Math.abs(L) >= 6 || Math.abs(L) <= -3) rows.push(['Scientific notation', sciLog(L, neg)]);
    }
    if (isInt && p >= 2 && p <= 12) {
      var parts = []; for (var i = 0; i < Math.min(p, 6); i++) parts.push(a < 0 ? '(' + f(a) + ')' : f(a));
      rows.unshift(['Repeated multiplication', parts.join(' × ') + (p > 6 ? ' × … (' + p + ' factors)' : '')]);
    }
    if (isInt && p < 0) rows.unshift(['Reciprocal form', '1 ÷ ' + (a < 0 ? '(' + f(a) + ')' : f(a)) + sup(-p) + (Math.abs(L) < 15 ? ' = 1 ÷ ' + f(Math.pow(a, -p)) : '')]);
    if (!isInt) {
      var rad = q === 2 ? '√' : q === 3 ? '∛' : q === 4 ? '∜' : sup(q) + '√';
      var inner = Math.pow(Math.abs(a), 1 / q) * (a < 0 ? -1 : 1);
      if (q <= 1000) rows.unshift(['Root form', (Math.abs(p) === 1 ? '' : '(') + rad + (a < 0 ? '(' + f(a) + ')' : f(a)) + (Math.abs(p) === 1 ? '' : ')' + sup(Math.abs(p))) + (p < 0 ? ' in the denominator' : '') + ' = ' + (Math.abs(p) === 1 ? '' : '(' + f(inner) + ')' + sup(Math.abs(p)) + ' ') ]);
      rows[0][1] = rows[0][1].replace(/ = $/, '');
    }
    rows.push(['Excel / Sheets formula', '=POWER(' + f(a).replace(/,/g, '').replace('−', '-') + ',' + (mm[4] ? p + '/' + q : eTxt) + ')']);
    if (a < 0 && !isInt) sub = 'Excel returns #NUM! for a negative base with a fractional exponent; this calculator uses the real odd root instead.';
    return { value: value, label: (a < 0 ? '(' + f(a) + ')' : f(a)) + ' to the power ' + eTxt, expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `An exponent tells you how many times to multiply the base by itself: 2¹⁰ = 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = <strong>${r.value}</strong>. On most calculators, type 2, press the <strong>^</strong> or <strong>xʸ</strong> key, type 10 and press =. In Excel or Google Sheets, type =2^10 or =POWER(2,10).`,
  stepsTitle: 'How to put an exponent on a calculator',
  steps: [
    'Type the base first (2), then press the power key: <strong>^</strong> on a TI-84 or phone, <strong>xʸ</strong> or <strong>yˣ</strong> on most scientific calculators.',
    'Type the exponent (10) and press = or ENTER. For a negative exponent use the (−) key, not the subtraction key, on a TI-84.',
    'For a fraction such as 2/3, wrap it in parentheses: 8 ^ (2 ÷ 3). Without them the calculator computes 8² ÷ 3 instead.',
    'Do not use the <strong>EE</strong> or <strong>EXP</strong> key for powers. It means "× 10 to the", so 2 EE 10 gives 20,000,000,000, not 1,024.'
  ],
  formulaTitle: 'What are the rules of exponents?',
  formula: {
    expr: 'aⁿ = a × a × … × a (n times)<br>a⁻ⁿ = 1 ÷ aⁿ &nbsp;·&nbsp; a⁰ = 1<br>a<sup>m/n</sup> = (ⁿ√a)ᵐ<br>aᵐ × aⁿ = aᵐ⁺ⁿ &nbsp;·&nbsp; aᵐ ÷ aⁿ = aᵐ⁻ⁿ &nbsp;·&nbsp; (aᵐ)ⁿ = aᵐⁿ',
    vars: [['a', 'the base, the number being multiplied'], ['n', 'the exponent (power or index)'], ['m/n', 'a fractional exponent: n is the root, m the power']],
    note: 'These rules hold for any nonzero base. For a negative base, a fractional exponent has a real value only when its reduced denominator is odd.'
  },
  example: `<p>Evaluate 8<sup>2/3</sup> and 2⁻³.</p>
<p>8<sup>2/3</sup>: the denominator 3 means a cube root and the numerator 2 means square it. ∛8 = 2, and 2² = <strong>4</strong>.</p>
<p>2⁻³: a negative exponent means a reciprocal. 2³ = 8, so 2⁻³ = 1/8 = <strong>0.125</strong>.</p>`,
  table: {
    title: 'What are the powers of 2, 3, 5 and 10?',
    intro: 'From the calculator above. Read down a column to see each power multiply by the base; read up to see each one divide by it.',
    head: ['n', '2ⁿ', '3ⁿ', '5ⁿ', '10ⁿ'],
    rows: ({ run }) => [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => [String(n).replace('-', '−'), ...[2, 3, 5, 10].map(b => run({ base: b, exp: String(n) }).value)]),
    note: 'Going up one row multiplies by the base; that is why 2⁰ has to be 1 and 2⁻¹ has to be 1/2.'
  },
  sections: [
    {
      h2: 'Which key is the exponent on a calculator?',
      html: `<ul>
<li><strong>TI-84 and TI-83:</strong> the <code>^</code> key above ÷. There is also an x² key for squaring. Use <code>(−)</code> for negative exponents.</li>
<li><strong>Scientific calculators (Casio, Sharp, TI-30):</strong> <code>xʸ</code>, <code>yˣ</code> or <code>^</code>. Enter the base, the key, then the exponent. Some models put x³ and x⁻¹ on their own keys.</li>
<li><strong>iPhone:</strong> rotate to landscape for x², x³, xʸ, eˣ and 10ˣ. Android calculators show ^ in the expanded panel.</li>
<li><strong>Excel and Google Sheets:</strong> <code>=2^10</code> or <code>=POWER(2,10)</code>; <code>=EXP(1.5)</code> gives e<sup>1.5</sup>.</li>
<li><strong>Typing in text:</strong> write 2^10, or use superscripts (2¹⁰) where your editor supports them.</li>
</ul>`
    },
    {
      h2: 'What does a negative exponent mean?',
      html: `<p>A negative exponent means divide instead of multiply: a⁻ⁿ = 1 ÷ aⁿ. So 2⁻³ = 1/2³ = 1/8 = 0.125, and 10⁻⁶ = 0.000001 (one millionth, the "micro" in micrometer).</p>
<p>The sign of the exponent says nothing about the sign of the answer. 2⁻³ is positive; only the base decides that. Moving a factor across the fraction bar flips its exponent's sign: 3/x⁻² = 3x².</p>`
    },
    {
      h2: 'How do fractional exponents work?',
      html: `<p>The denominator is a root and the numerator is a power: a<sup>m/n</sup> = (ⁿ√a)ᵐ. Take the root first to keep the numbers small.</p>
<ul><li>16<sup>3/4</sup> = (⁴√16)³ = 2³ = 8</li><li>27<sup>4/3</sup> = (∛27)⁴ = 3⁴ = 81</li><li>4<sup>−1/2</sup> = 1 ÷ √4 = 0.5</li><li>2<sup>0.5</sup> = √2 ≈ 1.414214</li></ul>
<p>Negative bases need care. (−8)<sup>1/3</sup> = −2 because the cube root of a negative number is real, but (−8)<sup>1/2</sup> has no real value. Many calculators and Excel refuse any negative base with a non-whole exponent; this calculator returns the real answer whenever the reduced denominator is odd. For roots on their own, the <a href="/root-calculator">root calculator</a> also simplifies radicals.</p>`
    },
    {
      h2: 'Why does −3² give −9 on a calculator?',
      html: `<p>Order of operations puts exponents before the minus sign, so −3² means −(3²) = −9. To square negative three, type the parentheses: (−3)² = 9. Phones, TI-84s, Excel and Google Sheets differ here: Excel treats <code>=-3^2</code> as (−3)² = 9, while a TI-84 gives −9 for the same keystrokes.</p>
<p>The same trap appears with fractions and products: 2 × 3² is 18, not 36, and 1/2² is 0.25. When in doubt, add parentheses around exactly what you want raised to the power.</p>`
    }
  ],
  faq: [
    { q: 'What is 2 to the 10th power?', a: '2 to the 10th power is 1,024. It is 2 multiplied by itself 10 times, and it is why a kilobyte is sometimes counted as 1,024 bytes.' },
    { q: 'Why is any number to the power of 0 equal to 1?', a: 'Each step down in the exponent divides by the base: 2³ = 8, 2² = 4, 2¹ = 2, so 2⁰ = 2 ÷ 2 = 1. 0⁰ is usually defined as 1 by calculators and textbooks, though some treat it as undefined.' },
    { q: 'What is 10 to the negative 3?', a: '10⁻³ is 0.001, or 1/1,000. Each negative power of 10 moves the decimal point one more place left.' },
    { q: 'What is 5 to the 3rd power?', a: '5³ = 5 × 5 × 5 = 125. "To the 3rd power" is also called cubed.' },
    { q: 'How do you calculate exponents in Excel?', a: 'Use the caret, =5^3, or the function =POWER(5,3). Both return 125. Fractional exponents work the same way, =POWER(8,2/3) returns 4.' },
    { q: 'How big is 2 to the 64th power?', a: '2⁶⁴ = 18,446,744,073,709,551,616, about 1.845 × 10¹⁹. It is the number of values a 64-bit unsigned integer can hold.' },
    { q: 'Can an exponent be a decimal?', a: 'Yes. A decimal exponent is a fraction in disguise: 2^0.5 = 2^(1/2) = √2 ≈ 1.414214, and 10^0.3 ≈ 1.995262.' }
  ],
  related: ['root-calculator', 'scientific-notation-calculator', 'log-calculator', 'doubling-time-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Exponent', url: 'https://mathworld.wolfram.com/Exponent.html' },
    { name: 'NIST Digital Library of Mathematical Functions §4.2: Logarithms, powers and exponentials', url: 'https://dlmf.nist.gov/4.2' },
    { name: 'Microsoft Support: POWER function', url: 'https://support.microsoft.com/en-us/office/power-function-d3f2908b-56f4-4c3f-895a-07fb519c362a' }
  ]
};
