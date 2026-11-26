export default {
  slug: 'exponent-calculator',
  hub: 'math',
  name: 'Exponent Calculator',
  title: 'Exponent Calculator: 2¹⁰ = 1,024 (With Steps)',
  meta: '2¹⁰ = 1,024: multiply ten 2s together. Raise any number to a whole, negative or fractional exponent, multiply powers, or solve 4ˣ = 128, with steps.',
  keyword: 'exponent calculator',
  also: ['2¹⁰', 'what is 2¹⁰', '4 to the power of what is 128', 'multiplying exponents calculator', 'fractional exponent calculator', 'fraction exponent calculator', '10 to the power of 24', '500 to the power of 2.5'],
  updated: '2026-11-26',
  answer: ({ r }) => `2¹⁰ (2 to the 10th power) is <strong>${r.value}</strong>, because ten 2s multiplied together, 2 × 2 × … × 2, make ${r.value}.`,
  inputs: [
    { id: 'mode', label: 'What do you need?', type: 'select', value: 'pow', wide: true, options: [['pow', 'Raise a number to a power: aⁿ = ?'], ['mult', 'Multiply powers with the same base: aᵐ × aⁿ'], ['solve', 'Solve for the exponent: aˣ = b']] },
    { id: 'base', label: 'Base (a)', type: 'number', value: 2 },
    { id: 'exp', label: 'Exponent (n)', type: 'text', value: '10', placeholder: 'e.g. 10, −3, 2.5 or 2/3', showIf: { mode: ['pow'] } },
    { id: 'm1', label: 'First exponent (m)', type: 'number', value: 3, showIf: { mode: ['mult'] } },
    { id: 'm2', label: 'Second exponent (n)', type: 'number', value: 4, showIf: { mode: ['mult'] } },
    { id: 'target', label: 'Result (b)', type: 'number', value: 128, showIf: { mode: ['solve'] } }
  ],
  compute(v, H) {
    function sup(s) { return '<sup>' + String(s).replace(/^-/, '−') + '</sup>'; }
    function mi(s) { return String(s).replace(/^-/, '−'); }
    function sci(m, e) { return mi(m) + ' × 10' + sup(e); }
    function g(x) {
      if (x === 0) return '0';
      var ax = Math.abs(x);
      if (ax >= 1e15 || ax < 1e-6) { var t = x.toExponential(9).split('e'); return sci(String(Number(t[0])), Number(t[1])); }
      return mi(H.num(Number(x.toPrecision(10)), 12));
    }
    function exact(x) { return x === 0 || Math.abs(Number(x.toPrecision(10)) - x) <= 1e-14 * Math.abs(x); }
    function fromLog(L, negv) {
      var e = Math.floor(L), m = Number(Math.pow(10, L - e).toPrecision(10));
      if (m >= 10) { m = 1; e += 1; }
      return (negv ? '−' : '') + sci(String(m), e);
    }
    function bs(a) { return a < 0 ? '(' + g(a) + ')' : g(a); }
    function rule(ok) { return ok ? 'exact, no rounding needed' : 'rounded to 10 significant figures'; }
    var a = v.base, mode = v.mode;
    if (!isFinite(a)) return { error: 'Enter the base.' };

    if (mode === 'solve') {
      var b = v.target;
      if (!(a > 0) || a === 1) return { error: 'For aˣ = b the base must be positive and not 1.' };
      if (!(b > 0)) return { error: 'The result b must be positive: a positive base raised to any power is positive.' };
      var la = Math.log10(a), lb = Math.log10(b), x = lb / la, xr = H.round(x, 6), nice = Math.abs(x - xr) < 1e-9;
      if (nice) x = xr;
      var st = ['<b>Formula:</b> a' + sup('x') + ' = b, so take the log of both sides: x = log(b) ÷ log(a)',
        '<b>Substitute:</b> ' + g(a) + sup('x') + ' = ' + g(b) + ', so x = log(' + g(b) + ') ÷ log(' + g(a) + ')',
        '<b>Logs (base 10):</b> log(' + g(b) + ') = ' + g(lb) + ' and log(' + g(a) + ') = ' + g(la),
        '<b>Divide:</b> ' + g(lb) + ' ÷ ' + g(la) + ' = ' + g(x)];
      var isP = function (N, c) { var k = 0; while (N > 1 && N % c === 0) { N /= c; k++; } return N === 1 ? k : -1; };
      if (Number.isInteger(a) && a >= 2 && a <= 1e6) {
        var bi = Number.isInteger(b) ? b : (Math.abs(1 / b - Math.round(1 / b)) < 1e-9 ? -Math.round(1 / b) : 0);
        for (var c = 2; c <= a && bi; c++) {
          var i = isP(a, c); if (i < 1) continue;
          var j = isP(Math.abs(bi), c); if (j < 0) continue;
          if (bi < 0) j = -j;
          st.push('<b>Same-base check:</b> ' + g(a) + ' = ' + c + sup(i) + ' and ' + g(b) + ' = ' + c + sup(j) + ', so ' + c + sup(i === 1 ? 'x' : i + 'x') + ' = ' + c + sup(j) + ', ' + (i === 1 ? '' : i) + 'x = ' + mi(j) + (i === 1 ? '' : ' and x = ' + mi(j) + ' ÷ ' + i + ' = ' + g(j / i)));
          break;
        }
      }
      st.push('<b>Check:</b> ' + g(a) + sup(g(x)) + ' = ' + g(Math.pow(a, x)));
      st.push('<b>Answer:</b> x = ' + (nice ? g(x) + ' (exact)' : H.num(x, 4) + ' (rounded to 4 decimal places)') + '.');
      return { value: 'x = ' + (nice ? g(x) : H.num(x, 4)), label: g(a) + ' to the power of x is ' + g(b), steps: st };
    }

    // evaluate a^e (e a number), returning a display string, exactness and the value
    function pw(e, base) {
      if (base === undefined) base = a;
      var negv = base < 0 && Number.isInteger(e) && Math.abs(e) % 2 === 1;
      var L = e * Math.log10(Math.abs(base)), val = Math.pow(base, e);
      if (Math.abs(L) >= 300 || !isFinite(val) || val === 0) return { s: fromLog(L, negv), ok: false, val: val, big: true };
      return { s: g(val), ok: exact(val), val: val };
    }

    if (mode === 'mult') {
      var m = v.m1, n = v.m2;
      if (!isFinite(m) || !isFinite(n)) return { error: 'Enter both exponents.' };
      var sum = H.round(m + n, 10);
      if (a < 0 && !(Number.isInteger(m) && Number.isInteger(n))) return { error: 'Use whole-number exponents with a negative base.' };
      if (a === 0 && (m <= 0 || n <= 0)) return { error: '0 to a zero or negative power is undefined.' };
      var R = pw(sum), A1 = pw(m), A2 = pw(n);
      var ms = [ '<b>Formula:</b> a' + sup('m') + ' × a' + sup('n') + ' = a' + sup('m + n') + ' (same base: add the exponents, keep the base)',
        '<b>Substitute:</b> ' + bs(a) + sup(g(m)) + ' × ' + bs(a) + sup(g(n)) + ' = ' + bs(a) + sup(g(m) + ' + ' + (n < 0 ? '(' + g(n) + ')' : g(n))),
        '<b>Add the exponents:</b> ' + g(m) + ' + ' + (n < 0 ? '(' + g(n) + ')' : g(n)) + ' = ' + g(sum),
        '<b>Evaluate:</b> ' + bs(a) + sup(g(sum)) + ' = ' + R.s];
      if (!A1.big && !A2.big && !R.big) ms.push('<b>Check:</b> ' + A1.s + ' × ' + A2.s + ' = ' + g(A1.val * A2.val));
      ms.push('<b>Answer:</b> ' + bs(a) + sup(g(m)) + ' × ' + bs(a) + sup(g(n)) + ' = ' + bs(a) + sup(g(sum)) + ' = ' + R.s + ' (' + rule(R.ok) + ').');
      return { value: R.s, label: bs(a) + sup(g(m)) + ' × ' + bs(a) + sup(g(n)) + ' = ' + bs(a) + sup(g(sum)), steps: ms };
    }

    // mode pow: parse the exponent (whole number, decimal or fraction)
    var s = String(v.exp || '').replace(/\s/g, '').replace('−', '-');
    var mm = /^([+-]?)(\d+)(?:\.(\d+))?(?:\/(\d+))?$/.exec(s);
    if (!mm) return { error: 'Enter the exponent as a number (3, −2, 2.5) or a fraction (2/3).' };
    if (mm[3] && mm[4]) return { error: 'Use either a decimal or a fraction for the exponent, not both.' };
    var p, q, dg = mm[3] || '';
    if (mm[4]) { p = Number(mm[2]); q = Number(mm[4]); if (q === 0) return { error: 'The fraction\'s denominator cannot be 0.' }; }
    else { if (dg.length > 9) dg = dg.slice(0, 9); q = Math.pow(10, dg.length); p = Number(mm[2]) * q + Number(dg || '0'); }
    if (mm[1] === '-') p = -p;
    var gg = H.gcd(p, q) || 1; p /= gg; q /= gg;
    var e = p / q, eTxt = q === 1 ? String(p) : p + '/' + q, ex = bs(a) + sup(q === 1 ? p : (mm[4] ? eTxt : g(e)));
    var steps = [], res;
    if (a === 0) {
      if (e < 0) return { error: '0 to a negative power is undefined: it would mean dividing by 0.' };
      if (e === 0) return { value: '1', label: ex, steps: ['<b>Formula:</b> a' + sup(0) + ' = 1', '<b>Substitute:</b> 0' + sup(0) + '. Most textbooks, calculators and spreadsheets define 0' + sup(0) + ' as 1; some call it undefined.', '<b>Answer:</b> 0' + sup(0) + ' = 1 by convention (exact).'] };
      return { value: '0', label: ex, steps: ['<b>Formula:</b> 0' + sup('n') + ' = 0 for any positive n', '<b>Substitute:</b> ' + ex + ' = 0 × 0 × …', '<b>Answer:</b> ' + ex + ' = 0 (exact).'] };
    }
    if (a < 0 && q > 1 && q % 2 === 0) return { error: 'A negative base with an even root in the exponent (like ½) has no real-number answer.' };
    var negR = a < 0 && Math.abs(p) % 2 === 1;

    if (q === 1) {
      var n2 = Math.abs(p);
      if (p === 0) {
        steps = ['<b>Formula:</b> a' + sup(0) + ' = 1 for any base a ≠ 0',
          '<b>Substitute:</b> ' + ex,
          '<b>Why:</b> a' + sup('n') + ' ÷ a' + sup('n') + ' = a' + sup('n − n') + ' = a' + sup(0) + ', and any nonzero number divided by itself is 1',
          '<b>Answer:</b> ' + ex + ' = 1 (exact, no rounding needed).'];
        return { value: '1', label: ex, steps: steps };
      }
      if (p === 1) return { value: g(a), label: ex, steps: ['<b>Formula:</b> a' + sup(1) + ' = a', '<b>Substitute:</b> ' + ex + ' is a single factor of ' + g(a) + ', so there is nothing to multiply', '<b>Answer:</b> ' + ex + ' = ' + g(a) + ' (exact).'] };
      if (a === 10 && p >= 2) {
        var zeros = new Array(p + 1).join('0'), w = ('1' + zeros).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        steps = ['<b>Formula:</b> 10' + sup('n') + ' = 1 followed by n zeros',
          '<b>Substitute:</b> 10' + sup(p) + ' = 1 followed by ' + p + ' zeros',
          p <= 40 ? '<b>Write it out:</b> 10' + sup(p) + ' = ' + w : '<b>Too long to write out:</b> ' + (p + 1) + ' digits, so keep it in scientific notation'];
        steps.push('<b>Answer:</b> 10' + sup(p) + ' = ' + (p <= 40 ? w + ' = ' : '') + '1 × 10' + sup(p) + ' (exact).');
        return { value: p <= 40 ? w : '1 × 10' + sup(p), label: ex, steps: steps };
      }
      var P = pw(n2);
      if (p > 0) steps.push('<b>Formula:</b> a' + sup('n') + ' = a × a × … × a (n factors of a)');
      else steps.push('<b>Formula:</b> a' + sup('−n') + ' = 1 ÷ a' + sup('n') + ' (a negative exponent means "one over")');
      if (p < 0) steps.push('<b>Substitute:</b> ' + ex + ' = 1 ÷ ' + bs(a) + sup(n2));
      if (!P.big && Math.abs(P.val) < 1e15 && n2 <= 30) {
        var fac = []; for (var k = 0; k < n2; k++) fac.push(bs(a));
        var prods = [], cur = a, list = [g(a)];
        for (var k2 = 2; k2 <= n2; k2++) { var nx = cur * a; prods.push('<b>Multiply:</b> ' + g(cur) + ' × ' + bs(a) + ' = ' + g(nx)); cur = nx; list.push(g(cur)); }
        if (p > 0) steps.push('<b>Substitute:</b> ' + ex + ' = ' + (n2 <= 12 ? fac.join(' × ') : bs(a) + ' × ' + bs(a) + ' × … × ' + bs(a)) + ' (' + n2 + ' factors)');
        if (n2 <= 10) steps = steps.concat(p > 0 ? prods : ['<b>Power:</b> ' + bs(a) + sup(n2) + ' = ' + fac.join(' × ') + ' = ' + P.s]);
        else steps.push('<b>Multiply by ' + bs(a) + ', one factor at a time:</b> ' + list.join(', '));
      } else {
        var L = n2 * Math.log10(Math.abs(a));
        if (p > 0) steps.push('<b>Substitute:</b> ' + ex + ' = ' + bs(a) + ' × ' + bs(a) + ' × … (' + H.int(n2) + ' factors), too many to multiply out by hand');
        steps.push('<b>Size it with logs:</b> log(' + g(Math.abs(a)) + sup(n2) + ') = ' + H.int(n2) + ' × log(' + g(Math.abs(a)) + ') = ' + mi(H.num(L, 6)) + (Math.abs(a) > 1 ? ', so ' + g(Math.abs(a)) + sup(n2) + ' has ' + H.int(Math.floor(L) + 1) + ' digits before the decimal point' : ''));
        if (a < 0) steps.push('<b>Sign:</b> ' + H.int(n2) + ' negative factors is an ' + (n2 % 2 ? 'odd' : 'even') + ' count, so the result is ' + (n2 % 2 ? 'negative' : 'positive'));
        if (Number.isInteger(a) && Math.abs(L) < 5000 && p > 0) {
          var str = (BigInt(Math.abs(a)) ** BigInt(n2)).toString();
          if (str.length <= 40) { P = { s: (negR ? '−' : '') + str.replace(/\B(?=(\d{3})+(?!\d))/g, ','), ok: true }; steps.push('<b>Exact value:</b> ' + ex + ' = ' + P.s); }
          else steps.push('<b>Leading digits:</b> the exact value starts ' + str.slice(0, 12) + '… and ends …' + str.slice(-6) + ', too long to show, so it is written in scientific notation');
        } else if (P.big) steps.push('<b>Power of ten:</b> 10' + sup(H.num(L, 6)) + ' = ' + fromLog(L, false));
      }
      if (p < 0) {
        var rv = 1 / P.val;
        res = isFinite(rv) && rv !== 0 && !P.big ? { s: g(negR ? -Math.abs(rv) : Math.abs(rv)), ok: exact(rv) } : { s: fromLog(-n2 * Math.log10(Math.abs(a)), negR), ok: false };
        steps.push('<b>Divide:</b> 1 ÷ ' + (P.s.indexOf('×') > 0 ? '(' + P.s + ')' : P.s) + ' = ' + res.s);
      } else res = P;
      if (res.s.indexOf('× 10') > 0 && !res.ok) res.note = 'shown in scientific notation, rounded to 10 significant figures';
      steps.push('<b>Answer:</b> ' + ex + ' = ' + res.s + ' (' + (res.note || rule(res.ok)) + ').');
      return { value: res.s, label: ex, steps: steps };
    }

    // fractional exponent
    var dec = !mm[4];
    var aa = Math.abs(a), ap = Math.abs(p);
    if (q <= 12) {
      var rt = Math.pow(aa, 1 / q), rr = Math.round(rt);
      if (Math.abs(Math.pow(rr, q) - aa) < 1e-9 * aa) rt = rr;
      var rootSym = q === 2 ? '√' : q === 3 ? '∛' : q === 4 ? '∜' : sup(q) + '√';
      var rootTxt = (a < 0 ? '−' : '') + g(rt);
      steps.push('<b>Formula:</b> a' + sup('m/n') + ' = (' + sup('n') + '√a)' + sup('m') + ': the bottom of the fraction is the root, the top is the power' + (p < 0 ? '; a negative exponent then means 1 ÷ the result' : ''));
      if (dec) steps.push('<b>Write the decimal as a fraction:</b> ' + mi(g(e)) + ' = ' + mi(p) + '/' + q);
      steps.push('<b>Substitute:</b> ' + bs(a) + sup(mi(p) + '/' + q) + ' = ' + (p < 0 ? '1 ÷ ' : '') + (ap === 1 ? rootSym + '(' + g(a) + ')' : '(' + rootSym + '(' + g(a) + '))' + sup(ap)));
      steps.push('<b>Root first:</b> ' + rootSym + '(' + g(a) + ') = ' + rootTxt + (a < 0 ? ' (an odd root of a negative number is negative)' : ''));
      var pv = pw(ap / q, aa);
      res = pv;
      if (negR) res = pv.big ? { s: '−' + pv.s, ok: false } : { s: g(-Math.abs(pv.val)), ok: pv.ok, val: -Math.abs(pv.val) };
      if (ap > 1) steps.push('<b>Then the power:</b> (' + rootTxt + ')' + sup(ap) + ' = ' + res.s + (exact(rt) ? '' : ' (using the unrounded root)'));
      if (p < 0) {
        var inv = 1 / Math.abs(pv.val), den = res.s;
        res = pv.big || !isFinite(inv) || inv === 0 ? { s: fromLog(-(ap / q) * Math.log10(aa), negR), ok: false } : { s: g(negR ? -inv : inv), ok: exact(inv) };
        steps.push('<b>Reciprocal:</b> 1 ÷ ' + (den.indexOf('×') > 0 ? '(' + den + ')' : den) + ' = ' + res.s);
      }
    } else {
      if (a < 0) return { error: 'Write a decimal exponent on a negative base as a fraction with an odd denominator, such as 1/3.' };
      var L2 = e * Math.log10(aa);
      steps.push('<b>Formula:</b> a' + sup('x') + ' = 10' + sup('x × log(a)') + ' (for a decimal exponent that is not a simple fraction)');
      steps.push('<b>Substitute:</b> ' + ex + ' = 10' + sup(g(e) + ' × log(' + g(a) + ')'));
      steps.push('<b>Log of the base:</b> log(' + g(a) + ') = ' + g(Math.log10(aa)));
      steps.push('<b>Multiply:</b> ' + g(e) + ' × ' + g(Math.log10(aa)) + ' = ' + g(L2));
      res = pw(e);
      steps.push('<b>Power of ten:</b> 10' + sup(g(L2)) + ' = ' + res.s);
    }
    steps.push('<b>Answer:</b> ' + ex + ' = ' + res.s + ' (' + rule(res.ok) + ').');
    return { value: res.s, label: ex, steps: steps };
  },
  facts: {
    formula: 'aⁿ = a × a × … × a (n factors)<br>a⁻ⁿ = 1 ÷ aⁿ &nbsp;·&nbsp; a⁰ = 1<br>a<sup>m/n</sup> = (ⁿ√a)ᵐ<br>aᵐ × aⁿ = aᵐ⁺ⁿ<br>aˣ = b → x = log(b) ÷ log(a)',
    vars: [['a', 'the base, the number being multiplied'], ['n', 'the exponent (power): how many factors of a'], ['m/n', 'a fractional exponent: n is the root, m is the power'], ['b', 'the result, when you solve for the exponent']],
    rounding: 'whole-number powers of whole numbers are exact. Roots, fractional powers and logs are rounded to 10 significant figures, like a scientific calculator display; a solved exponent to 4 decimal places.',
    note: 'For a negative base, a fractional exponent has a real answer only when the reduced denominator is odd: (−8)<sup>1/3</sup> = −2, but (−8)<sup>1/2</sup> has no real value.'
  },
  example: {
    h2: 'Worked example: a message passed on in rounds',
    html: `<p><strong>Problem:</strong> A student sends a study tip to 3 classmates. In each new round, everyone who just got it sends it to 3 more people. How many people receive it in round 6?</p>
<p><strong>1.</strong> Each round multiplies the count by 3, so round n reaches 3ⁿ people. Round 6 is 3⁶.</p>
<p><strong>2.</strong> Multiply step by step: 3 × 3 = 9, 9 × 3 = 27, 27 × 3 = 81, 81 × 3 = 243, 243 × 3 = 729.</p>
<p><strong>Answer:</strong> 729 people get it in round 6. Sense check: 3³ = 27, and 3⁶ = 3³ × 3³ = 27 × 27 = 729, so the two routes agree.</p>`
  },
  variants: [
    {
      h2: 'What is 2¹⁰?',
      html: `<p>2¹⁰ is <strong>1,024</strong>. Doubling ten times gives 2, 4, 8, 16, 32, 64, 128, 256, 512, 1,024. It is the reason a kilobyte is often 1,024 bytes: 2¹⁰ is the power of 2 closest to 1,000. Halving goes the other way, so 2⁹ = 512 and 2⁻¹ = 0.5.</p>`
    },
    {
      h2: '4 to the power of what is 128?',
      html: `<p><strong>3.5</strong>, because 4<sup>3.5</sup> = 128. To solve 4ˣ = 128, take logs of both sides: x = log(128) ÷ log(4) = 2.10720997 ÷ 0.6020599913 = 3.5. Without logs, write both numbers as powers of 2: 4 = 2² and 128 = 2⁷, so 2<sup>2x</sup> = 2⁷, 2x = 7 and x = 3.5. Pick "Solve for the exponent" above to get these steps for your own a and b.</p>`
    },
    {
      h2: 'How do you work out a fractional exponent?',
      html: `<p>Take the root given by the bottom of the fraction, then raise it to the top: a<sup>m/n</sup> = (ⁿ√a)ᵐ. For 8<sup>2/3</sup>, the cube root of 8 is 2 and 2² = <strong>4</strong>. A decimal exponent works once you write it as a fraction: 500 to the power of 2.5 is 500<sup>5/2</sup>, so √500 = 22.36067977, and raising that to the 5th power gives <strong>5,590,169.944</strong> (rounded to 10 significant figures). Type 2/3 or 2.5 straight into the exponent box.</p>`
    }
  ],
  mistakes: [
    '<strong>Multiplying the base by the exponent.</strong> 2¹⁰ is 1,024, not 2 × 10 = 20. The exponent counts factors.',
    '<strong>Adding when you should multiply, or the reverse.</strong> 2³ × 2⁴ = 2⁷ = 128 (add the exponents), not 2¹². Multiply exponents only for a power of a power: (2³)⁴ = 2¹² = 4,096.',
    '<strong>Dropping the parentheses on a negative base.</strong> (−3)² = 9, but −3² means −(3²) = −9.',
    '<strong>Reading a negative exponent as a negative answer.</strong> 2⁻³ = 1 ÷ 8 = 0.125, a small positive number, not −8.',
    '<strong>Typing a fraction exponent without brackets.</strong> 8^2/3 on a calculator gives 64 ÷ 3 = 21.33. Enter 8^(2/3) to get 4.'
  ],
  related: ['root-calculator', 'scientific-notation-calculator', 'compound-interest-calculator', 'car-depreciation-calculator'],
  faq: [
    { q: 'What is 10 to the power of 24?', a: '1 followed by 24 zeros: 1,000,000,000,000,000,000,000,000, or 1 × 10²⁴ (a septillion). In the same way, 10 to the exponent 23 is 1 followed by 23 zeros, 1 × 10²³.' },
    { q: 'What is 0.8 to the power of 10?', a: 'Exactly 0.1073741824. Each multiplication by 0.8 keeps 80% of the last value: 0.8, 0.64, 0.512, 0.4096 and so on, ten factors in all.' },
    { q: 'How do you multiply exponents?', a: 'With the same base, add the exponents and keep the base: 5² × 5³ = 5⁵ = 3,125. With different bases and the same exponent, multiply the bases: 2³ × 5³ = 10³ = 1,000.' },
    { q: 'Why is any number to the power 0 equal to 1?', a: 'Because aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰, and a nonzero number divided by itself is 1. Going down the powers of 2 shows it too: 8, 4, 2, then 2⁰ = 1.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Exponent Laws', url: 'https://mathworld.wolfram.com/ExponentLaws.html' },
    { name: 'Wolfram MathWorld: Power', url: 'https://mathworld.wolfram.com/Power.html' },
    { name: 'OpenStax College Algebra 2e: Exponential and Logarithmic Equations', url: 'https://openstax.org/books/college-algebra-2e/pages/6-6-exponential-and-logarithmic-equations' }
  ]
};
