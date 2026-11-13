export default {
  slug: 'log-calculator',
  hub: 'math',
  name: 'Logarithm Calculator',
  title: 'Log Calculator: ln(50) = 3.912023 and log₁₀(50) = 1.69897',
  h1: 'Logarithm Calculator: ln, log₁₀, log₂, Any Base and Antilog',
  meta: 'ln(50) = 3.912023 and log₁₀(50) = 1.69897. Find natural, common, binary or any-base logs and antilogs, with the Excel formula to match (=LN, =LOG10, =LOG).',
  keyword: 'how to calculate ln in excel',
  also: ['how to calculate logarithms in excel', 'log calculator', 'natural log calculator', 'ln calculator', 'antilog calculator', 'log base 2 calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'log', options: [['log', 'Logarithm: log_b(x)'], ['anti', 'Antilog: b raised to y']] },
    { id: 'base', label: 'Base (b)', type: 'select', value: 'e', options: [['e', 'e ≈ 2.71828 (natural log, ln)'], ['10', '10 (common log)'], ['2', '2 (binary log)'], ['custom', 'Other base']] },
    { id: 'b', label: 'Custom base', type: 'number', value: 3, showIf: { base: ['custom'] } },
    { id: 'x', label: 'Number (x)', type: 'number', value: 50, showIf: { mode: ['log'] } },
    { id: 'y', label: 'Exponent (y)', type: 'number', value: 2, showIf: { mode: ['anti'] } }
  ],
  compute(v, H) {
    function f(x) { var a = Math.abs(x); return a !== 0 && (a < 1e-6 || a >= 1e15) ? H.sig(x, 8) : H.num(x, 6); }
    var bName, bVal;
    if (v.base === 'e') { bVal = Math.E; bName = 'e'; }
    else if (v.base === '10') { bVal = 10; bName = '10'; }
    else if (v.base === '2') { bVal = 2; bName = '2'; }
    else {
      if (!(v.b > 0) || v.b === 1) return { error: 'The base must be positive and not equal to 1.' };
      bVal = v.b; bName = f(v.b);
    }
    function lg(x) { return v.base === 'e' ? Math.log(x) : v.base === '10' ? Math.log10(x) : v.base === '2' ? Math.log2(x) : Math.log(x) / Math.log(bVal); }
    var xl = function (s) { return s.replace(/,/g, ''); };
    if (v.mode === 'anti') {
      if (!isFinite(v.y)) return { error: 'Enter the exponent y.' };
      var val = v.base === 'e' ? Math.exp(v.y) : Math.pow(bVal, v.y);
      if (!isFinite(val)) return { error: 'The result is too large to display.' };
      var xf = v.base === 'e' ? '=EXP(' + xl(f(v.y)) + ')' : '=POWER(' + xl(bName) + ',' + xl(f(v.y)) + ')';
      return {
        value: f(val), label: 'Antilog: ' + bName + ' to the power ' + f(v.y),
        expr: (v.base === 'e' ? 'e' : bName) + '^' + f(v.y),
        rows: [['Excel / Sheets formula', xf], ['Check', 'log' + (v.base === 'e' ? ' base e (ln)' : ' base ' + bName) + ' of ' + f(val) + ' = ' + f(lg(val))], ['Calculator keys', v.base === 'e' ? 'eˣ (2nd + LN on a TI-84)' : v.base === '10' ? '10ˣ (2nd + LOG on a TI-84)' : bName + ' ^ ' + f(v.y)]],
        sub: 'The antilog undoes the logarithm: if log_b(x) = y, then x = b^y.'
      };
    }
    if (!isFinite(v.x)) return { error: 'Enter a number.' };
    if (v.x <= 0) return { error: 'Logarithms are defined only for positive numbers; log(0) and logs of negatives have no real value.' };
    var res = lg(v.x);
    var xs = xl(f(v.x));
    var rows = [];
    var name = v.base === 'e' ? 'ln(' + f(v.x) + ')' : 'log' + (v.base === '10' ? '₁₀' : v.base === '2' ? '₂' : '_' + bName) + '(' + f(v.x) + ')';
    if (v.base !== 'e') rows.push(['Natural log ln(' + f(v.x) + ')', f(Math.log(v.x))]);
    if (v.base !== '10') rows.push(['Common log log₁₀(' + f(v.x) + ')', f(Math.log10(v.x))]);
    if (v.base !== '2') rows.push(['Binary log log₂(' + f(v.x) + ')', f(Math.log2(v.x))]);
    rows.push(['Excel / Sheets formula', v.base === 'e' ? '=LN(' + xs + ')' : v.base === '10' ? '=LOG10(' + xs + ')' : '=LOG(' + xs + ',' + xl(bName) + ')', true]);
    rows.push(['Check', (v.base === 'e' ? 'e' : bName) + '^' + f(res) + ' = ' + f(Math.pow(bVal, res))]);
    if (v.base === 'custom') rows.push(['Change of base', 'ln(' + f(v.x) + ') ÷ ln(' + bName + ') = ' + f(Math.log(v.x)) + ' ÷ ' + f(Math.log(bVal))]);
    return {
      value: f(res), label: (v.base === 'e' ? 'Natural log' : 'Log base ' + bName) + ' of ' + f(v.x),
      expr: name, rows: rows,
      sub: (v.base === 'e' ? 'e' : bName) + ' must be raised to the power ' + f(res) + ' to make ' + f(v.x) + '.' + (v.x < 1 ? ' Numbers between 0 and 1 have negative logs.' : '')
    };
  },
  quick: ({ r }) => `In Excel or Google Sheets, type <strong>=LN(A2)</strong> to get the natural log of the number in A2: =LN(50) returns <strong>${r.value}</strong>. Use =LOG10(50) for the base-10 log (1.69897), =LOG(50,2) for any other base (5.643856), and =EXP(3.912023) to undo ln and get back about 50.`,
  stepsTitle: 'How to calculate a logarithm',
  steps: [
    'Pick the base. ln means base e (≈ 2.71828), "log" on a calculator means base 10, and computer science often uses base 2.',
    'Enter a positive number. Zero and negative numbers have no real logarithm, which is also why Excel returns #NUM! for them.',
    'Read the result and the matching spreadsheet formula. For a base that is not on your calculator, divide two logs: log_b(x) = ln(x) ÷ ln(b).',
    'To go backwards, choose Antilog: it raises the base to your number. Confusing ln with log is the classic mistake, since ln(50) and log(50) differ by a factor of about 2.3.'
  ],
  formulaTitle: 'What is the logarithm formula?',
  formula: {
    expr: 'log_b(x) = y &nbsp;⇔&nbsp; bʸ = x<br>log_b(x) = ln(x) ÷ ln(b) &nbsp;(change of base)<br>ln(x) = log₁₀(x) × 2.302585…',
    vars: [['b', 'the base: positive and not 1'], ['x', 'the argument: must be positive'], ['y', 'the logarithm, i.e. the exponent'], ['e', 'Euler\'s number, 2.718281828…']],
    note: 'Product, quotient and power rules: log(ab) = log a + log b, log(a/b) = log a − log b, and log(aⁿ) = n·log a, for any base.'
  },
  example: `<p>Find log₃(81) without a log-base-3 key.</p>
<p>Use change of base: ln(81) ÷ ln(3) = 4.394449 ÷ 1.098612 = <strong>4</strong>. Check: 3⁴ = 81.</p>
<p>In Excel the same answer is =LOG(81,3), and with common logs it is log(81) ÷ log(3) = 1.908485 ÷ 0.477121 = 4.</p>`,
  table: {
    title: 'What are ln, log₁₀ and log₂ of common numbers?',
    intro: 'Values computed by the calculator above, rounded to six decimal places.',
    head: ['x', 'ln(x)', 'log₁₀(x)', 'log₂(x)'],
    rows: ({ run }) => [[0.5, '0.5'], [1, '1'], [2, '2'], [Math.E, 'e ≈ 2.718282'], [3, '3'], [5, '5'], [10, '10'], [20, '20'], [50, '50'], [100, '100'], [1000, '1,000'], [1024, '1,024']].map(([x, l]) => [l, ...['e', '10', '2'].map(b => run({ mode: 'log', base: b, x }).value)]),
    note: 'log of 1 is 0 in every base, and numbers below 1 have negative logs. Every log₁₀ value is the ln value divided by 2.302585.'
  },
  sections: [
    {
      h2: 'How do you calculate ln and other logs in Excel?',
      html: `<div class="twrap"><table><thead><tr><th>You want</th><th>Excel / Google Sheets</th><th>Example result</th></tr></thead><tbody>
<tr><td>Natural log, ln(x)</td><td><code>=LN(A2)</code></td><td>=LN(50) → 3.912023</td></tr>
<tr><td>Base-10 log</td><td><code>=LOG10(A2)</code> or <code>=LOG(A2)</code></td><td>=LOG10(50) → 1.69897</td></tr>
<tr><td>Any base b</td><td><code>=LOG(A2, b)</code></td><td>=LOG(8,2) → 3</td></tr>
<tr><td>Undo ln (eˣ)</td><td><code>=EXP(A2)</code></td><td>=EXP(1) → 2.718282</td></tr>
<tr><td>Undo log₁₀ (10ˣ)</td><td><code>=10^A2</code></td><td>=10^2 → 100</td></tr>
</tbody></table></div>
<p>LOG with no second argument assumes base 10, so =LOG(50) and =LN(50) are different numbers. All of these return #NUM! for zero or negative inputs; wrap them as <code>=IF(A2&gt;0,LN(A2),"")</code> to keep a column clean. A common finance use is log returns: =LN(B3/B2) gives the continuously compounded change between two prices, close to the percent change for small moves (ln(1.05) = 0.04879 versus 5%).</p>`
    },
    {
      h2: 'What is the difference between log and ln?',
      html: `<p>ln is the natural logarithm, base e ≈ 2.718282. log, on calculators and in Excel, is the common logarithm, base 10. They are always in the same ratio: ln(x) = 2.302585 × log₁₀(x), so ln(50) = 2.302585 × 1.69897 = 3.912023.</p>
<p>Watch the convention in other places. In most programming languages (Python's math.log, JavaScript's Math.log, C's log) and in many college math books, "log" with no base means the <em>natural</em> log. Engineers and chemists usually mean base 10. When a formula looks off by a factor of 2.3, this mix-up is the first thing to check.</p>`
    },
    {
      h2: 'How do you find a log with a different base on a calculator?',
      html: `<p>Use the change-of-base formula with either the LN or LOG key: log_b(x) = ln(x) ÷ ln(b). For log₂(1,024): ln(1,024) ÷ ln(2) = 6.931472 ÷ 0.693147 = 10.</p>
<p>Newer TI-84 models also have <code>logBASE(</code> in the MATH menu, which lets you type the base directly. On any calculator, 10ˣ and eˣ (usually the second functions of LOG and LN) give antilogs.</p>`
    },
    {
      h2: 'Where are logarithms used in real life?',
      html: `<ul>
<li><strong>pH:</strong> pH = −log₁₀[H⁺]. A hydrogen-ion concentration of 1 × 10⁻⁷ mol/L is pH 7. See the <a href="/ph-calculator">pH calculator</a>.</li>
<li><strong>Sound:</strong> decibels = 10 × log₁₀(P ÷ P₀), so ten times the power adds 10 dB.</li>
<li><strong>Growth and decay:</strong> doubling time = ln(2) ÷ growth rate, and half-life uses the same ln(2) = 0.693147. See the <a href="/doubling-time-calculator">doubling time</a> and <a href="/half-life-calculator">half-life</a> calculators.</li>
<li><strong>Computing:</strong> log₂(n) is the number of bits needed for n values and the number of steps in a binary search: 20 steps cover about a million items.</li>
</ul>`
    }
  ],
  faq: [
    { q: 'What is ln(1)?', a: 'ln(1) = 0, because e⁰ = 1. The log of 1 is 0 in every base.' },
    { q: 'What is ln(e)?', a: 'ln(e) = 1, because e¹ = e. In general, the log of a number in its own base is 1, so log₁₀(10) = 1 too.' },
    { q: 'Why can\'t you take the log of 0 or a negative number?', a: 'No power of a positive base can produce 0 or a negative number, so log(0) and log(−5) have no real value. As x approaches 0, the log heads toward negative infinity.' },
    { q: 'What is log base 2 of 1,024?', a: 'log₂(1,024) = 10, because 2¹⁰ = 1,024. In Excel, use =LOG(1024,2).' },
    { q: 'How do I calculate log base 2 in Excel?', a: 'Use =LOG(A2,2). The second argument of LOG is the base; leave it out and Excel uses base 10. Google Sheets works the same way.' },
    { q: 'What is the value of e?', a: 'e is about 2.718281828459045. It is the base of natural logarithms and the limit of (1 + 1/n)ⁿ as n grows. In Excel, =EXP(1) returns it.' },
    { q: 'What is an antilog?', a: 'An antilog reverses a logarithm by raising the base to the given number. The base-10 antilog of 2 is 10² = 100, and the natural antilog of 3.912023 is e^3.912023 ≈ 50.' }
  ],
  related: ['exponent-calculator', 'scientific-notation-calculator', 'ph-calculator', 'half-life-calculator', 'doubling-time-calculator'],
  sources: [
    { name: 'Microsoft Support: LN function', url: 'https://support.microsoft.com/en-us/office/ln-function-81fe1ed7-dac9-4acd-ba1d-07a142c6118f' },
    { name: 'Microsoft Support: LOG function', url: 'https://support.microsoft.com/en-us/office/log-function-4e82f196-1ca9-4747-8fb0-6c4a3abb3280' },
    { name: 'Microsoft Support: EXP function', url: 'https://support.microsoft.com/en-us/office/exp-function-c578f034-2c45-4c37-bc8c-329660a63abe' },
    { name: 'NIST Digital Library of Mathematical Functions §4.2: Logarithms', url: 'https://dlmf.nist.gov/4.2' }
  ]
};
