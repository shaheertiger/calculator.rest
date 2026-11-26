export default {
  slug: 'scientific-notation-calculator',
  hub: 'math',
  name: 'Scientific Notation Calculator',
  title: 'Scientific Notation Calculator: 45,600,000 = 4.56 × 10⁷',
  h1: 'Scientific Notation Converter and Calculator (×, ÷, +, − and E-Notation)',
  meta: '45,600,000 is 4.56 × 10⁷ (4.56E+07): move the decimal point 7 places left. Convert either way, or multiply, divide, add and subtract in scientific notation.',
  keyword: 'how to calculate scientific notation',
  also: ['scientific notation calculator', 'scientific notation converter', 'e notation converter'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What to do', type: 'select', value: 'to', wide: true, options: [['to', 'Convert a number to scientific notation'], ['from', 'Scientific notation to a regular number'], ['mul', 'Multiply (a × 10ⁿ) × (b × 10ᵐ)'], ['div', 'Divide (a × 10ⁿ) ÷ (b × 10ᵐ)'], ['add', 'Add'], ['sub', 'Subtract']] },
    { id: 'x', label: 'Number', type: 'text', value: '45,600,000', placeholder: 'e.g. 0.00052 or 6.02e23', showIf: { mode: ['to'] }, wide: true },
    { id: 'a1', label: 'Coefficient a', type: 'number', value: 4.56, showIf: { mode: ['from', 'mul', 'div', 'add', 'sub'] } },
    { id: 'e1', label: 'Exponent n (power of 10)', type: 'number', value: 7, showIf: { mode: ['from', 'mul', 'div', 'add', 'sub'] } },
    { id: 'a2', label: 'Coefficient b', type: 'number', value: 3, showIf: { mode: ['mul', 'div', 'add', 'sub'] } },
    { id: 'e2', label: 'Exponent m', type: 'number', value: -4, showIf: { mode: ['mul', 'div', 'add', 'sub'] } },
    { id: 'sf', label: 'Round to significant figures', type: 'number', value: '', placeholder: 'optional, e.g. 3' }
  ],
  compute(v, H) {
    var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    function sup(n) { return String(n).split('').map(function (c) { return SUP[c] || c; }).join(''); }
    var sf = v.sf >= 1 && v.sf <= 15 ? Math.round(v.sf) : 0;
    function norm(c, e, exact) {
      if (c === 0) return { m: 0, e: 0, s: '0' };
      var t = (sf ? Number(c.toPrecision(sf)) : exact ? c : Number(c.toPrecision(12))).toExponential().split('e');
      var m = Number(t[0]), ee = e + Number(t[1]);
      return { m: m, e: ee, s: sf ? m.toPrecision(sf) : String(m) };
    }
    function sci(p) { return p.m === 0 ? '0' : p.s.replace('-', '−') + ' × 10' + sup(p.e); }
    function enot(p) { var a = Math.abs(p.e); return p.s + 'E' + (p.e < 0 ? '-' : '+') + (a < 10 ? '0' : '') + a; }
    function expand(p) {
      if (p.m === 0) return '0';
      if (Math.abs(p.e) > 40) return 'too long to write out (' + (p.e > 0 ? (p.e + 1) + ' digits' : Math.abs(p.e) - 1 + ' zeros after the point') + ')';
      var neg = p.s.charAt(0) === '-', d = p.s.replace(/[-.]/g, ''), pos = 1 + p.e, ip, fp;
      if (pos <= 0) { ip = '0'; fp = new Array(-pos + 1).join('0') + d; }
      else if (pos >= d.length) { ip = d + new Array(pos - d.length + 1).join('0'); fp = ''; }
      else { ip = d.slice(0, pos); fp = d.slice(pos); }
      ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return (neg ? '−' : '') + ip + (fp ? '.' + fp : '');
    }
    function eng(p) {
      if (p.m === 0) return '0';
      var e3 = Math.floor(p.e / 3) * 3, c = Number((p.m * Math.pow(10, p.e - e3)).toPrecision(sf || 12));
      return H.num(c, 12).replace('-', '−') + ' × 10' + sup(e3);
    }
    function rowsFor(p) {
      return [['E-notation (calculators, Excel)', enot(p)], ['Regular decimal number', expand(p)], ['Engineering notation', eng(p)], ['Order of magnitude', '10' + sup(p.e)]];
    }
    var steps = [], p, label, expr;
    if (v.mode === 'to') {
      var raw = String(v.x || '').trim();
      var s = raw.replace(/[,\s]/g, '').replace(/[×x*]10\^/i, 'e').replace('−', '-');
      if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return { error: 'Enter a number such as 0.00052, 45,600,000 or 6.02e23.' };
      var val = Number(s);
      if (!isFinite(val)) return { error: 'That number is outside the range this calculator can handle.' };
      // significant figures in the entry
      var mant = s.replace(/^[+-]/, '').split(/e/i)[0], hasPt = mant.indexOf('.') >= 0, digs = mant.replace('.', '').replace(/^0+/, ''), amb = false;
      if (!hasPt && /0$/.test(digs)) { amb = true; digs = digs.replace(/0+$/, ''); }
      p = norm(val, 0, true);
      label = 'Scientific notation';
      expr = H.esc(raw) + ' = ' + sci(p);
      var r = rowsFor(p);
      if (p.m !== 0) r.unshift(['Decimal point moved', Math.abs(p.e) + ' place' + (Math.abs(p.e) === 1 ? '' : 's') + (p.e > 0 ? ' left' : p.e < 0 ? ' right' : '')]);
      if (digs) r.push(['Significant figures in your entry', digs.length + (amb ? ' to ' + (digs.length + (mant.match(/0+$/) || [''])[0].length) + ' (trailing zeros in a whole number are ambiguous)' : '')]);
      return { value: sci(p), label: label, expr: expr, rows: r, sub: p.e > 0 ? 'Big numbers get a positive exponent.' : p.e < 0 ? 'Numbers between −1 and 1 get a negative exponent.' : 'Numbers from 1 to 9.99… use 10⁰ = 1.' };
    }
    if (!isFinite(v.a1) || !isFinite(v.e1)) return { error: 'Enter coefficient a and exponent n.' };
    if (!Number.isInteger(v.e1) || (v.mode !== 'from' && !Number.isInteger(v.e2))) return { error: 'Exponents must be whole numbers.' };
    var A = norm(v.a1, v.e1, true);
    if (v.mode === 'from') {
      p = A;
      return { value: expand(p), label: 'Regular number', expr: H.num(v.a1, 12) + ' × 10' + sup(v.e1), rows: [['Normalized scientific notation', sci(p)], ['E-notation', enot(p)], ['Engineering notation', eng(p)]], sub: v.e1 > 0 ? 'Move the decimal point ' + v.e1 + ' places right.' : v.e1 < 0 ? 'Move the decimal point ' + (-v.e1) + ' places left.' : '10⁰ = 1, so the number is unchanged.' };
    }
    if (!isFinite(v.a2) || !isFinite(v.e2)) return { error: 'Enter coefficient b and exponent m.' };
    var fa = H.num(v.a1, 12), fb = H.num(v.a2, 12), sym;
    if (v.mode === 'mul') {
      sym = '×';
      var c = v.a1 * v.a2;
      steps.push(['Multiply the coefficients', fa + ' × ' + fb + ' = ' + H.num(Number(c.toPrecision(12)), 12)]);
      steps.push(['Add the exponents', v.e1 + ' + ' + (v.e2 < 0 ? '(' + v.e2 + ')' : v.e2) + ' = ' + (v.e1 + v.e2)]);
      p = norm(c, v.e1 + v.e2);
    } else if (v.mode === 'div') {
      if (v.a2 === 0) return { error: 'You cannot divide by zero.' };
      sym = '÷';
      var q = v.a1 / v.a2;
      steps.push(['Divide the coefficients', fa + ' ÷ ' + fb + ' = ' + H.num(Number(q.toPrecision(12)), 12)]);
      steps.push(['Subtract the exponents', v.e1 + ' − ' + (v.e2 < 0 ? '(' + v.e2 + ')' : v.e2) + ' = ' + (v.e1 - v.e2)]);
      p = norm(q, v.e1 - v.e2);
    } else {
      sym = v.mode === 'add' ? '+' : '−';
      var hi = v.e1 >= v.e2, eT = hi ? v.e1 : v.e2, k = Math.abs(v.e1 - v.e2);
      var b2 = v.mode === 'add' ? v.a2 : -v.a2;
      var sa = hi ? v.a1 : (k > 300 ? 0 : v.a1 / Math.pow(10, k)), sb = hi ? (k > 300 ? 0 : b2 / Math.pow(10, k)) : b2;
      sa = Number(sa.toPrecision(12)); sb = Number(sb.toPrecision(12));
      steps.push(['Match the exponents (use 10' + sup(eT) + ')', H.num(sa, 15) + ' × 10' + sup(eT) + ' and ' + H.num(Math.abs(sb), 15) + ' × 10' + sup(eT)]);
      steps.push([(v.mode === 'add' ? 'Add' : 'Subtract') + ' the coefficients', H.num(Number((sa + sb).toPrecision(12)), 15) + ' × 10' + sup(eT)]);
      p = norm(sa + sb, eT);
    }
    steps.push(['Write with one digit before the point', sci(p)]);
    return {
      value: sci(p), label: 'Result in scientific notation',
      expr: '(' + fa + ' × 10' + sup(v.e1) + ') ' + sym + ' (' + fb + ' × 10' + sup(v.e2) + ')',
      rows: rowsFor(p), table: { head: ['Step', 'Work'], rows: steps }
    };
  },
  quick: ({ r }) => `To write a number in scientific notation, move the decimal point until one nonzero digit is left in front of it, then multiply by 10 raised to the number of places moved. 45,600,000 needs 7 moves left, so it is <strong>${r.value}</strong> (4.56E+07 on a calculator). Small numbers get negative powers: 0.00052 = 5.2 × 10⁻⁴.`,
  stepsTitle: 'How to calculate scientific notation',
  steps: [
    'Find the first nonzero digit and place the decimal point right after it. For 45,600,000 that gives 4.56; for 0.00052 it gives 5.2.',
    'Count how many places the point moved. That count is the exponent: positive if the original number was 10 or more, negative if it was smaller than 1. Getting the sign backwards is the usual slip.',
    'Drop zeros that only held place: 45,600,000 becomes 4.56 × 10⁷. Keep zeros that were measured, which is what the optional significant-figures box is for.',
    'To go back, move the point right for a positive exponent and left for a negative one, filling gaps with zeros.'
  ],
  formulaTitle: 'What is the rule for scientific notation?',
  formula: {
    expr: 'N = a × 10ⁿ, with 1 ≤ |a| &lt; 10 and n a whole number<br>(a × 10ⁿ)(b × 10ᵐ) = ab × 10ⁿ⁺ᵐ<br>(a × 10ⁿ) ÷ (b × 10ᵐ) = (a ÷ b) × 10ⁿ⁻ᵐ',
    vars: [['a', 'coefficient (also called the significand or mantissa)'], ['n', 'exponent: how many places the decimal point moved'], ['10ⁿ', 'the power of ten that sets the size']],
    note: 'After multiplying or dividing, a coefficient of 10 or more (or below 1) is renormalized: 13.68 × 10³ becomes 1.368 × 10⁴.'
  },
  example: `<p>Multiply (4.56 × 10⁷) by (3 × 10⁻⁴).</p>
<p>Coefficients: 4.56 × 3 = 13.68. Exponents: 7 + (−4) = 3. That gives 13.68 × 10³.</p>
<p>13.68 is not between 1 and 10, so move the point one place left and add 1 to the exponent: <strong>1.368 × 10⁴</strong>, which is 13,680.</p>`,
  table: {
    title: 'How are famous constants written in scientific notation?',
    intro: 'Exact SI defining values and astronomical lengths, converted by the calculator above.',
    head: ['Quantity', 'Written out', 'Scientific notation', 'E-notation'],
    rows: ({ run }) => [['Speed of light (m/s)', '299792458'], ['Astronomical unit (m)', '149597870700'], ['Light-year (m)', '9460730472580800'], ['Avogadro constant (per mol)', '6.02214076e23'], ['Boltzmann constant (J/K)', '1.380649e-23'], ['Elementary charge (C)', '1.602176634e-19'], ['Planck constant (J·s)', '6.62607015e-34'], ['One micrometer (m)', '0.000001']].map(([q, x]) => { const o = run({ mode: 'to', x, sf: NaN }); return [q, o.rows.find(r => r[0].indexOf('Regular') === 0)[1], o.value, o.rows.find(r => r[0].indexOf('E-notation') === 0)[1]]; }),
    note: 'Since the 2019 SI redefinition the speed of light, Planck constant, elementary charge, Boltzmann constant and Avogadro constant have exact values (NIST CODATA). The light-year is the IAU Julian year (365.25 days) times the speed of light.'
  },
  sections: [
    {
      h2: 'How do you multiply and divide numbers in scientific notation?',
      html: `<p>Work on the two parts separately. Multiply (or divide) the coefficients, then add the exponents when multiplying or subtract them when dividing. Finish by renormalizing so one digit sits before the point.</p>
<ul><li>(3 × 10⁸) × (2 × 10⁻³) = 6 × 10⁵</li><li>(6.4 × 10⁶) ÷ (1.6 × 10²) = 4 × 10⁴</li><li>(5 × 10⁴) × (4 × 10³) = 20 × 10⁷ = 2 × 10⁸</li></ul>
<p>This is why scientists use the notation: multiplying 300,000,000 by 0.002 by hand invites a misplaced zero, while 3 × 2 and 8 − 3 do not.</p>`
    },
    {
      h2: 'How do you add or subtract in scientific notation?',
      html: `<p>The exponents must match first. Rewrite the number with the smaller exponent so it uses the larger one, then add or subtract the coefficients.</p>
<p>4.2 × 10⁵ + 3.1 × 10⁴: rewrite 3.1 × 10⁴ as 0.31 × 10⁵, then 4.2 + 0.31 = <strong>4.51 × 10⁵</strong>. For subtraction, 7.0 × 10⁻³ − 5.5 × 10⁻⁴ = 7.0 × 10⁻³ − 0.55 × 10⁻³ = 6.45 × 10⁻³.</p>
<p>When the exponents differ by more than your precision (say 10¹² + 3), the smaller number vanishes after rounding, which is fine for measurements but worth knowing.</p>`
    },
    {
      h2: 'What does E mean on a calculator?',
      html: `<p>An E (or e) in a calculator or spreadsheet display means "times ten to the power." 4.56E7 and 4.56E+07 both mean 4.56 × 10⁷, and 5.2E−4 means 5.2 × 10⁻⁴. It has nothing to do with Euler's number e ≈ 2.718.</p>
<p>To type a number in this form, use the <strong>EE</strong> or <strong>EXP</strong> key instead of typing "× 10 ^". On a TI-84 the EE function is 2nd + comma, so 4.56 [2nd][EE] 7 enters 4.56 × 10⁷. Typing × 10 ^ 7 by hand usually gives the same value but can break order of operations inside a longer expression.</p>
<p>Excel and Google Sheets accept 4.56E7 typed into a cell. Choose the Scientific number format to display any value as 4.56E+07; the number of decimals you choose sets the significant figures shown.</p>`
    },
    {
      h2: 'How do significant figures work in scientific notation?',
      html: `<p>Every digit in the coefficient counts as significant, which removes the guesswork about trailing zeros. A measured 45,600,000 could have three significant figures or eight; writing 4.56 × 10⁷ says three, and 4.5600 × 10⁷ says five.</p>
<p>Leading zeros never count: 0.00052 has two significant figures (5 and 2), shown plainly as 5.2 × 10⁻⁴. Enter a count in the optional box to round any result, for example 1.368 × 10⁴ to 3 significant figures is 1.37 × 10⁴. For propagating measurement error, use the <a href="/uncertainty-calculator">uncertainty calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is 0.00045 in scientific notation?', a: '0.00045 is 4.5 × 10⁻⁴. The decimal point moves 4 places right to sit after the 4, so the exponent is −4.' },
    { q: 'What is 6.02 × 10²³ written out?', a: '6.02 × 10²³ is 602,000,000,000,000,000,000,000: the digits 602 followed by 21 zeros.' },
    { q: 'Can the coefficient be 10 or bigger?', a: 'Not in normalized scientific notation. The coefficient must be at least 1 and less than 10, so 12 × 10³ is rewritten as 1.2 × 10⁴.' },
    { q: 'Is scientific notation the same as standard form?', a: 'It depends on the country. In the UK, "standard form" means scientific notation. In U.S. classrooms, "standard form" usually means the ordinary written-out number, such as 45,600,000.' },
    { q: 'What is engineering notation?', a: 'Engineering notation restricts the exponent to multiples of 3, matching SI prefixes such as kilo (10³), mega (10⁶) and micro (10⁻⁶). 45,600,000 is 45.6 × 10⁶, or 45.6 mega-units.' },
    { q: 'How do you write a negative number in scientific notation?', a: 'Put the minus sign on the coefficient: −320,000 is −3.2 × 10⁵. A negative exponent means a small size, not a negative value.' },
    { q: 'What is 1 × 10⁰?', a: '1 × 10⁰ is just 1, because any nonzero number raised to the power 0 equals 1. Numbers from 1 up to 9.99… all have an exponent of 0.' }
  ],
  related: ['exponent-calculator', 'log-calculator', 'fraction-calculator', 'binary-hex-calculator'],
  sources: [
    { name: 'NIST: Fundamental Physical Constants (CODATA)', url: 'https://physics.nist.gov/cuu/Constants/' },
    { name: 'NIST: Metric (SI) Prefixes', url: 'https://www.nist.gov/pml/owm/metric-si-prefixes' },
    { name: 'Wolfram MathWorld: Scientific Notation', url: 'https://mathworld.wolfram.com/ScientificNotation.html' }
  ]
};
