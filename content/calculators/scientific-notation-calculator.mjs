export default {
  slug: 'scientific-notation-calculator',
  hub: 'math',
  name: 'Scientific Notation Calculator',
  title: 'Scientific Notation Calculator: 45,600,000 = 4.56 × 10⁷',
  meta: '45,600,000 is 4.56 × 10⁷: move the decimal point 7 places left. Convert to and from scientific notation, or multiply, divide, add and subtract, with steps.',
  keyword: 'scientific notation calculator',
  also: ['scientific notation converter', 'how to write a number in scientific notation', 'multiplying scientific notation', 'e notation', 'standard form calculator'],
  updated: '2026-11-26',
  answer: ({ r }) => `45,600,000 in scientific notation is <strong>${r.value}</strong>: move the decimal point 7 places left, to just after the 4.`,
  inputs: [
    { id: 'mode', label: 'What do you need?', type: 'select', value: 'to', wide: true, options: [['to', 'Write a number in scientific notation'], ['from', 'Scientific notation to a regular number'], ['mul', 'Multiply (a × 10ⁿ) × (b × 10ᵐ)'], ['div', 'Divide (a × 10ⁿ) ÷ (b × 10ᵐ)'], ['add', 'Add (a × 10ⁿ) + (b × 10ᵐ)'], ['sub', 'Subtract (a × 10ⁿ) − (b × 10ᵐ)']] },
    { id: 'x', label: 'Number', type: 'text', value: '45,600,000', placeholder: 'e.g. 0.00052 or 6.02e23', showIf: { mode: ['to'] } },
    { id: 'a1', label: 'Coefficient a', type: 'number', value: 4.56, showIf: { mode: ['from', 'mul', 'div', 'add', 'sub'] } },
    { id: 'e1', label: 'Power of ten n', type: 'number', value: 7, showIf: { mode: ['from', 'mul', 'div', 'add', 'sub'] } },
    { id: 'a2', label: 'Coefficient b', type: 'number', value: 3, showIf: { mode: ['mul', 'div', 'add', 'sub'] } },
    { id: 'e2', label: 'Power of ten m', type: 'number', value: -4, showIf: { mode: ['mul', 'div', 'add', 'sub'] } },
    { id: 'sf', label: 'Significant figures', type: 'select', value: 'all', options: [['all', 'keep every digit'], ['2', 'round to 2'], ['3', 'round to 3'], ['4', 'round to 4']] }
  ],
  compute(v, H) {
    function sup(s) { return '<sup>' + String(s).replace(/^-/, '−') + '</sup>'; }
    function mi(s) { return String(s).replace(/^-/, '−'); }
    var sf = v.sf === 'all' ? 0 : Number(v.sf) || 0;
    function norm(c, e) { // c × 10^e, normalized
      if (c === 0) return { m: 0, e: 0, s: '0' };
      var t = Number(c.toPrecision(12)).toExponential().split('e');
      return { m: Number(t[0]), e: e + Number(t[1]), s: t[0] };
    }
    function rnd(p, k) { k = k || sf; if (!k || p.m === 0) return p; var t = Number(p.s).toExponential(k - 1).split('e'); return { m: Number(t[0]), e: p.e + Number(t[1]), s: t[0] }; }
    function sci(p) { return p.m === 0 ? '0' : mi(p.s) + ' × 10' + sup(p.e); }
    function enot(p) { var a = Math.abs(p.e); return p.s + 'E' + (p.e < 0 ? '-' : '+') + (a < 10 ? '0' : '') + a; }
    function expand(s, e) { // s = coefficient string, e = power of ten
      var neg = s.charAt(0) === '-'; s = s.replace('-', '');
      var parts = s.split('.'), d = parts[0] + (parts[1] || ''), pos = parts[0].length + e, ip, fp;
      if (Math.abs(e) > 40) return null;
      if (pos <= 0) { ip = '0'; fp = new Array(-pos + 1).join('0') + d; }
      else if (pos >= d.length) { ip = d + new Array(pos - d.length + 1).join('0'); fp = ''; }
      else { ip = d.slice(0, pos); fp = d.slice(pos); }
      ip = ip.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      fp = fp.replace(/0+$/, '');
      return (neg ? '−' : '') + ip + (fp ? '.' + fp : '');
    }
    function ten(n) { var w = expand('1', n); return w && Math.abs(n) <= 15 ? '10' + sup(n) + ' = ' + w : '10' + sup(n); }
    function rule(p0) { return sf ? 'rounded to ' + sf + ' significant figures' : 'exact, ' + H.plural(p0.s.replace(/[-.]/g, '').replace(/^0+/, '').length, 'significant figure') + ' kept'; }
    var p, steps;
    if (v.mode === 'to') {
      var raw = String(v.x || '').trim();
      var s = raw.replace(/[,\s]/g, '').replace(/[×x*]10\^/i, 'e').replace(/−/g, '-');
      var mm = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(s);
      if (!mm || !(mm[2] || mm[3])) return { error: 'Enter a number such as 0.00052, 45,600,000 or 6.02e23.' };
      var ip = mm[2] || '', fp = mm[3] || '', ee = Number(mm[4] || 0), d = ip + fp, k = d.search(/[1-9]/);
      if (k < 0) return { error: 'Zero has no scientific notation form: it is just 0.' };
      var dig = d.slice(k), coefDigits = fp ? dig : dig.replace(/0+$/, '');
      if (!coefDigits) coefDigits = dig.charAt(0);
      var aStr = (mm[1] === '-' ? '-' : '') + coefDigits.charAt(0) + (coefDigits.length > 1 ? '.' + coefDigits.slice(1) : '');
      var moves = ip.length - 1 - k, n = moves + ee;
      var p0 = { m: Number(aStr), e: n, s: aStr };
      p = rnd(p0);
      var shown = mi(raw.replace(/[−]/g, '-'));
      steps = ['<b>Formula:</b> N = a × 10' + sup('n') + ', where 1 ≤ a < 10 and n is a whole number',
        '<b>Find a:</b> put the decimal point just after the first nonzero digit (' + coefDigits.charAt(0) + ') and keep the digits that follow' + (fp ? '' : ', dropping the trailing zeros') + ': a = ' + mi(aStr)];
      steps.push('<b>Count the moves:</b> ' + (moves === 0 ? 'the decimal point is already just after the first digit, so it does not move' : 'the decimal point moves ' + H.plural(Math.abs(moves), 'place') + ' to the ' + (moves > 0 ? 'left' : 'right')) + (ee ? ', and the ' + mi(ee) + ' already in the exponent is added: n = ' + mi(moves) + ' + ' + (ee < 0 ? '(' + mi(ee) + ')' : ee) + ' = ' + mi(n) : (moves === 0 ? ': n = 0' : ', so n = ') + (moves === 0 ? '' : mi(n)) + (moves > 0 ? ' (moving left makes n positive)' : moves < 0 ? ' (moving right makes n negative)' : '')));
      if (sf && p.s !== p0.s) steps.push('<b>Round a to ' + sf + ' significant figures:</b> ' + mi(p0.s) + ' → ' + mi(p.s) + (p.e !== p0.e ? ', which carries into the next power: ' + sci(p) : ''));
      var w0 = expand(p0.s, p0.e);
      steps.push('<b>Check:</b> ' + (w0 && Math.abs(p0.e) <= 15 ? ten(p0.e) + ', so ' + mi(p0.s) + ' × ' + expand('1', p0.e) + ' = ' + w0 : mi(p0.s) + ' × 10' + sup(p0.e) + (w0 ? ' = ' + w0 : ' moves the decimal point back ' + H.plural(Math.abs(p0.e), 'place'))));
      steps.push('<b>Answer:</b> ' + H.esc(shown) + ' = ' + sci(p) + ' (' + rule(p0) + '; ' + enot(p) + ' on a calculator).');
      return { value: sci(p), label: 'Scientific notation', rows: [['E-notation (calculators, Excel)', enot(p)], ['Decimal point moved', moves === 0 ? '0 places' : H.plural(Math.abs(moves), 'place') + (moves > 0 ? ' left' : ' right')]], steps: steps };
    }
    if (!isFinite(v.a1) || !isFinite(v.e1)) return { error: 'Enter coefficient a and the power of ten n.' };
    if (!Number.isInteger(v.e1) || (v.mode !== 'from' && !Number.isInteger(v.e2))) return { error: 'Powers of ten must be whole numbers.' };
    if (Math.abs(v.e1) > 300 || Math.abs(v.e2 || 0) > 300) return { error: 'Use powers of ten between −300 and 300.' };
    var fa = mi(H.num(v.a1, 12)), A = norm(v.a1, v.e1);
    if (v.mode === 'from') {
      p = rnd(A);
      var as = String(Number(v.a1.toPrecision(12))), e1 = v.e1;
      if (/e/.test(as)) { as = A.s; e1 = A.e; }
      var w = expand(sf ? p.s : as, sf ? p.e : e1);
      steps = ['<b>Formula:</b> a × 10' + sup('n') + ' means move the decimal point of a by n places: right when n is positive, left when n is negative',
        '<b>Substitute:</b> ' + fa + ' × 10' + sup(v.e1),
        '<b>Power of ten:</b> ' + ten(v.e1),
        '<b>Move the decimal point:</b> ' + (v.e1 === 0 ? '10⁰ = 1, so nothing moves' : H.plural(Math.abs(v.e1), 'place') + ' to the ' + (v.e1 > 0 ? 'right' : 'left') + (v.e1 > 0 ? ', filling with zeros' : ', adding zeros in front')) + ': ' + (w || 'too long to write out')];
      if (sf) steps.push('<b>Round to ' + sf + ' significant figures:</b> ' + sci(p));
      steps.push('<b>Answer:</b> ' + fa + ' × 10' + sup(v.e1) + ' = ' + (w || sci(p)) + ' (' + (sf ? 'rounded to ' + sf + ' significant figures' : 'exact') + ').');
      return { value: w || sci(p), label: 'Regular number', rows: [['Normalized scientific notation', sci(p)], ['E-notation', enot(p)]], steps: steps };
    }
    if (!isFinite(v.a2) || !isFinite(v.e2)) return { error: 'Enter coefficient b and the power of ten m.' };
    var fb = mi(H.num(v.a2, 12)), e2t = v.e2 < 0 ? '(' + mi(v.e2) + ')' : String(v.e2);
    var L = '(' + fa + ' × 10' + sup(v.e1) + ')', R = '(' + fb + ' × 10' + sup(v.e2) + ')', c, eT, sym, p0b;
    if (v.mode === 'mul' || v.mode === 'div') {
      var mul = v.mode === 'mul';
      if (!mul && v.a2 === 0) return { error: 'You cannot divide by zero.' };
      sym = mul ? '×' : '÷';
      c = mul ? v.a1 * v.a2 : v.a1 / v.a2; eT = mul ? v.e1 + v.e2 : v.e1 - v.e2;
      var cs = mi(H.num(Number(c.toPrecision(12)), 12));
      steps = [mul ? '<b>Formula:</b> (a × 10' + sup('n') + ') × (b × 10' + sup('m') + ') = (a × b) × 10' + sup('n + m') + ': multiply the coefficients, add the powers' : '<b>Formula:</b> (a × 10' + sup('n') + ') ÷ (b × 10' + sup('m') + ') = (a ÷ b) × 10' + sup('n − m') + ': divide the coefficients, subtract the powers',
        '<b>Substitute:</b> ' + L + ' ' + sym + ' ' + R + ' = (' + fa + ' ' + sym + ' ' + fb + ') × 10' + sup(v.e1 + (mul ? ' + ' : ' − ') + e2t),
        '<b>' + (mul ? 'Multiply' : 'Divide') + ' the coefficients:</b> ' + fa + ' ' + sym + ' ' + fb + ' = ' + cs,
        '<b>' + (mul ? 'Add' : 'Subtract') + ' the powers:</b> ' + v.e1 + (mul ? ' + ' : ' − ') + e2t + ' = ' + mi(eT)];
    } else {
      var add = v.mode === 'add', hi = v.e1 >= v.e2, k2 = Math.abs(v.e1 - v.e2);
      sym = add ? '+' : '−'; eT = hi ? v.e1 : v.e2;
      var sa = hi ? v.a1 : v.a1 / Math.pow(10, k2), sb = hi ? v.a2 / Math.pow(10, k2) : v.a2;
      sa = Number(sa.toPrecision(12)); sb = Number(sb.toPrecision(12));
      c = Number((add ? sa + sb : sa - sb).toPrecision(12));
      var mv = hi ? [fb, v.e2, sb] : [fa, v.e1, sa];
      steps = ['<b>Formula:</b> a × 10' + sup('n') + ' ' + sym + ' b × 10' + sup('n') + ' = (a ' + sym + ' b) × 10' + sup('n') + ': the powers of ten must match before you ' + (add ? 'add' : 'subtract'),
        '<b>Substitute:</b> ' + L + ' ' + sym + ' ' + R,
        '<b>Match the powers:</b> ' + (k2 === 0 ? 'both already use 10' + sup(eT) : 'rewrite ' + mv[0] + ' × 10' + sup(mv[1]) + ' as ' + mi(H.num(mv[2], 15)) + ' × 10' + sup(eT) + ' (decimal point ' + H.plural(k2, 'place') + ' left, power up by ' + k2 + ')'),
        '<b>' + (add ? 'Add' : 'Subtract') + ' the coefficients:</b> ' + mi(H.num(sa, 15)) + ' ' + sym + ' ' + (sb < 0 ? '(' + mi(H.num(sb, 15)) + ')' : H.num(sb, 15)) + ' = ' + mi(H.num(c, 15))];
    }
    var raw2 = c === 0 ? 0 : Number(c.toPrecision(12)), ok = Math.abs(raw2 - c) <= 1e-14 * Math.abs(c), sfx = sf || (ok ? 0 : 10);
    p0b = norm(c, eT); p = rnd(p0b, sfx);
    var sh = p0b.e - eT;
    if (raw2 !== 0 && sh !== 0) steps.push('<b>Fix the coefficient:</b> ' + mi(H.num(raw2, 15)) + ' is not between 1 and 10, so move its decimal point ' + H.plural(Math.abs(sh), 'place') + (sh > 0 ? ' left and add ' + sh + ' to' : ' right and subtract ' + (-sh) + ' from') + ' the power: ' + sci(p0b));
    if (sfx && p.s !== p0b.s) steps.push('<b>Round to ' + sfx + ' significant figures:</b> ' + sci(p0b) + ' → ' + sci(p));
    steps.push('<b>Answer:</b> ' + L + ' ' + sym + ' ' + R + ' = ' + sci(p) + ' (' + (sfx ? 'rounded to ' + sfx + ' significant figures' : 'exact') + ').');
    return { value: sci(p), label: 'Result in scientific notation', rows: [['E-notation', enot(p)], ['As a regular number', expand(p.s, p.e) || 'too long to write out']], steps: steps };
  },
  facts: {
    formula: 'N = a × 10ⁿ, with 1 ≤ |a| < 10<br>(a × 10ⁿ)(b × 10ᵐ) = ab × 10ⁿ⁺ᵐ<br>(a × 10ⁿ) ÷ (b × 10ᵐ) = (a ÷ b) × 10ⁿ⁻ᵐ',
    vars: [['a', 'the coefficient: one nonzero digit before the decimal point'], ['n', 'the power of ten: how many places the decimal point moved'], ['E', 'calculator shorthand for "× 10 to the": 4.56E+07 = 4.56 × 10⁷']],
    rounding: 'converting does not round: every digit you typed stays in a. Pick a number of significant figures to round the coefficient, as chemistry and physics answers usually ask.',
    note: 'Big numbers (10 or more) get a positive power; numbers between 0 and 1 get a negative power.'
  },
  example: {
    h2: 'Worked example: how far light travels in 500 seconds',
    html: `<p><strong>Problem:</strong> Light travels 3.0 × 10⁸ meters per second. Sunlight takes about 5.0 × 10² seconds to reach Earth. How far is that, in scientific notation?</p>
<p><strong>1.</strong> Distance = speed × time = (3.0 × 10⁸) × (5.0 × 10²).</p>
<p><strong>2.</strong> Multiply the coefficients: 3.0 × 5.0 = 15. Add the powers: 8 + 2 = 10. That gives 15 × 10¹⁰.</p>
<p><strong>3.</strong> 15 is not between 1 and 10, so move its decimal point one place left and raise the power by 1: 1.5 × 10¹¹.</p>
<p><strong>Answer:</strong> about 1.5 × 10¹¹ meters (2 significant figures, matching the data). Sense check: that is 150,000,000 km, the usual figure for the Earth–Sun distance.</p>`
  },
  variants: [
    {
      h2: 'How do you write a small number in scientific notation?',
      html: `<p>Move the decimal point right until one nonzero digit sits in front of it, and make the power negative. 0.00052 becomes 5.2 after 4 moves to the right, so 0.00052 = <strong>5.2 × 10⁻⁴</strong>. Count the moves, not the zeros: there are 3 zeros after the point, but the point passes 4 digits (0, 0, 0 and 5).</p>`
    },
    {
      h2: 'How do you multiply and divide in scientific notation?',
      html: `<p>Work the coefficients and the powers separately. Multiply: (4.56 × 10⁷) × (3 × 10⁻⁴) = 13.68 × 10³, and since 13.68 is too big, rewrite it as <strong>1.368 × 10⁴</strong>. Divide: (6 × 10⁵) ÷ (2 × 10⁻³) = 3 × 10<sup>5 − (−3)</sup> = <strong>3 × 10⁸</strong>. Subtracting a negative power is where most sign slips happen.</p>`
    },
    {
      h2: 'What does 4.56E+07 mean on a calculator?',
      html: `<p>It is <strong>4.56 × 10⁷</strong>, or 45,600,000. Calculators and spreadsheets write "E" for "times ten to the", so 5.2E-04 is 5.2 × 10⁻⁴ = 0.00052. On a TI-84, type 4.56, press 2nd then EE (above the comma), then 7. Do not type × 10 ^ 7 inside a longer calculation without brackets.</p>`
    }
  ],
  mistakes: [
    '<strong>Getting the sign of the power backwards.</strong> 0.00052 is 5.2 × 10⁻⁴, not 5.2 × 10⁴. Small numbers get negative powers.',
    '<strong>Leaving the coefficient outside 1 to 10.</strong> 45.6 × 10⁶ equals 45,600,000 but is not scientific notation; write 4.56 × 10⁷.',
    '<strong>Adding without matching the powers.</strong> 2 × 10³ + 5 × 10² is 2.5 × 10³ (2,000 + 500), not 7 × 10⁵.',
    '<strong>Multiplying the powers.</strong> 10⁸ × 10² = 10¹⁰: add the powers, never multiply them to get 10¹⁶.'
  ],
  related: ['exponent-calculator', 'root-calculator', 'ph-calculator', 'speed-calculator'],
  faq: [
    { q: 'What is 6.02 × 10²³ written out?', a: '602,000,000,000,000,000,000,000. Move the decimal point 23 places right: 2 places use up the digits 0 and 2, and 21 zeros fill the rest.' },
    { q: 'Is 10 × 10³ in scientific notation?', a: 'No. The coefficient must be at least 1 and less than 10, so 10 × 10³ is written 1 × 10⁴ (10,000).' },
    { q: 'How many significant figures does a number in scientific notation have?', a: 'Count the digits in the coefficient. 4.56 × 10⁷ has 3, and 4.560 × 10⁷ has 4, which is why scientific notation is the clear way to show precision.' },
    { q: 'Is standard form the same as scientific notation?', a: 'In the UK, yes: standard form means a × 10ⁿ. In US math class, "standard form" usually means the ordinary number, such as 45,600,000.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Scientific Notation', url: 'https://mathworld.wolfram.com/ScientificNotation.html' }
  ]
};
