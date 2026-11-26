export default {
  slug: 'compound-interest-calculator',
  hub: 'math',
  name: 'Compound Interest Calculator',
  title: 'Compound Interest Calculator: $10,000 at 1.5% → $11,605.41',
  meta: '$10,000 at 1.5% compounded annually grows to $11,605.41 in 10 years. Solve A = P(1 + r/n)^(nt) for the amount or for how long it takes, with steps.',
  keyword: 'compound interest calculator',
  also: ['compound interest formula', 'how long will it take to become compounded weekly', 'a = p(1 + r/n)^nt', 'if i deposit $10,000 into an account earning 1.5%', 'compound interest word problems'],
  updated: '2026-11-26',
  answer: ({ r }) => `$10,000 at 1.5% interest compounded once a year grows to <strong>${r.value}</strong> after 10 years: 10,000 × 1.015<sup>10</sup>.`,
  inputs: [
    { id: 'mode', label: 'The question asks', type: 'select', value: 'amount', wide: true, options: [['amount', 'How much will be in the account after t years? (find A)'], ['time', 'How long until it grows to a target amount? (find t)']] },
    { id: 'p', label: 'Starting amount (P)', type: 'number', value: 10000, prefix: '$' },
    { id: 'rate', label: 'Annual rate (r)', type: 'number', value: 1.5, suffix: '%' },
    { id: 'n', label: 'Compounded', type: 'select', value: '1', options: [['1', 'annually (n = 1)'], ['2', 'semiannually (n = 2)'], ['4', 'quarterly (n = 4)'], ['12', 'monthly (n = 12)'], ['52', 'weekly (n = 52)'], ['365', 'daily (n = 365)']] },
    { id: 't', label: 'Years (t)', type: 'number', value: 10, suffix: 'years', showIf: { mode: ['amount'] } },
    { id: 'a', label: 'Target amount (A)', type: 'number', value: 10500, prefix: '$', showIf: { mode: ['time'] } }
  ],
  compute(v, H) {
    function g(x) { return H.num(Number(x.toPrecision(10)), 12); }
    function d(x) { return H.num(x, 2); }
    var P = v.p, R = v.rate, n = Number(v.n) || 1;
    if (!(P > 0)) return { error: 'Enter a starting amount above $0.' };
    if (!(R > 0) || R > 1000) return { error: 'Enter an annual interest rate above 0%.' };
    var r = R / 100, i = r / n, f = 1 + i;
    var nName = { 1: 'annually', 2: 'semiannually', 4: 'quarterly', 12: 'monthly', 52: 'weekly', 365: 'daily' }[n] || n + ' times a year';
    var formula = 'A = P(1 + r/n)<sup>nt</sup>';
    if (v.mode === 'time') {
      var A = v.a;
      if (!(A > P)) return { error: 'Enter a target amount larger than the starting amount.' };
      var ratio = A / P, lnR = Math.log(ratio), lnF = Math.log(f), den = n * lnF, t = lnR / den, tr = H.round(t, 2);
      var periods = Math.ceil(n * t - 1e-9);
      var st = ['<b>Formula:</b> ' + formula + '. Divide both sides by P and take the natural log: t = ln(A ÷ P) ÷ (n × ln(1 + r/n))',
        '<b>Substitute:</b> t = ln(' + d(A) + ' ÷ ' + d(P) + ') ÷ (' + n + ' × ln(1 + ' + g(r) + '/' + n + '))',
        '<b>Convert the rate:</b> ' + g(R) + '% ÷ 100 = ' + g(r),
        '<b>Rate per period:</b> ' + g(r) + ' ÷ ' + n + ' = ' + g(i) + ', so 1 + r/n = ' + g(f),
        '<b>Divide the amounts:</b> ' + d(A) + ' ÷ ' + d(P) + ' = ' + g(ratio),
        '<b>Natural logs:</b> ln(' + g(ratio) + ') = ' + g(lnR) + ' and ln(' + g(f) + ') = ' + g(lnF),
        '<b>Multiply:</b> ' + n + ' × ' + g(lnF) + ' = ' + g(den),
        '<b>Divide:</b> ' + g(lnR) + ' ÷ ' + g(den) + ' = ' + g(t),
        '<b>Answer:</b> t = ' + H.num(tr, 2) + ' years, rounded to two decimal places (' + g(t) + ' before rounding).'];
      return {
        value: H.num(tr, 2) + ' years',
        label: 'Time for $' + d(P) + ' to grow to $' + d(A) + ' at ' + g(R) + '% compounded ' + nName,
        rows: [['Compounding periods (n × t)', g(n * t)], ['Whole periods before the balance passes $' + d(A), periods + (n === 1 ? ' years' : ' periods') + ' = ' + H.num(periods / n, 2) + ' years']],
        steps: st
      };
    }
    var T = v.t;
    if (!(T > 0)) return { error: 'Enter the number of years.' };
    var nt = n * T, pw = Math.pow(f, nt), amt = P * pw, cents = H.round(amt, 2), dollars = Math.round(amt);
    var steps = ['<b>Formula:</b> ' + formula,
      '<b>Substitute:</b> A = ' + d(P) + '(1 + ' + g(r) + '/' + n + ')<sup>' + n + ' × ' + g(T) + '</sup>',
      '<b>Convert the rate:</b> ' + g(R) + '% ÷ 100 = ' + g(r),
      '<b>Rate per period:</b> ' + g(r) + ' ÷ ' + n + ' = ' + g(i) + (n === 1 ? ' (compounded once a year, so the rate is unchanged)' : ''),
      '<b>Add 1:</b> 1 + ' + g(i) + ' = ' + g(f) + ' (the growth factor each period)',
      '<b>Exponent:</b> n × t = ' + n + ' × ' + g(T) + ' = ' + g(nt) + ' compounding periods',
      '<b>Power:</b> ' + g(f) + '<sup>' + g(nt) + '</sup> = ' + g(pw),
      '<b>Multiply:</b> ' + d(P) + ' × ' + g(pw) + ' = ' + g(amt),
      '<b>Answer:</b> A = $' + H.fix(cents, 2) + ' to the nearest cent ($' + H.int(dollars) + ' to the nearest whole dollar). The interest earned is $' + H.fix(cents - P, 2) + '.'];
    return {
      value: '$' + H.fix(cents, 2),
      label: 'Amount after ' + H.plural(T, 'year') + ' at ' + g(R) + '% compounded ' + nName,
      rows: [['Interest earned (A − P)', '$' + H.fix(cents - P, 2)], ['Growth factor (1 + r/n)<sup>nt</sup>', g(pw)]],
      steps: steps
    };
  },
  facts: {
    formula: 'A = P(1 + r/n)<sup>nt</sup><br>t = ln(A ÷ P) ÷ (n × ln(1 + r/n))<br>Interest = A − P',
    vars: [['A', 'the amount after t years'], ['P', 'the starting amount (principal)'], ['r', 'the annual rate as a decimal: 6.25% = 0.0625'], ['n', 'times per year interest is added: 1, 4, 12, 52 or 365'], ['t', 'time in years']],
    rounding: 'keep every digit of 1 + r/n and the power until the last step. Round money to the nearest cent (or whole dollar if the question says so) and time to two decimal places.',
    note: 'This is exponential growth, the same shape as population growth. If a problem gives no compounding period, use n = 1 (once a year).'
  },
  example: {
    h2: 'Worked example: $2,000 at 4% compounded quarterly',
    html: `<p><strong>Problem:</strong> Maria puts $2,000 in an account that pays 4% a year, compounded quarterly. How much is in the account after 6 years?</p>
<p><strong>1.</strong> P = 2,000, r = 0.04, n = 4 and t = 6.</p>
<p><strong>2.</strong> Rate per quarter: 0.04 ÷ 4 = 0.01, so the growth factor is 1.01.</p>
<p><strong>3.</strong> Number of quarters: 4 × 6 = 24.</p>
<p><strong>4.</strong> Power: 1.01<sup>24</sup> = 1.269734649. Multiply: 2,000 × 1.269734649 = 2,539.469297.</p>
<p><strong>Answer:</strong> $2,539.47 to the nearest cent. Sense check: simple interest would give 2,000 + 2,000 × 0.04 × 6 = $2,480, and compounding should come out a little higher, which it does.</p>`
  },
  variants: [
    {
      h2: 'How long will it take $5,500.00 to become $10,500.00 at 6.25% compounded weekly?',
      html: `<p>About <strong>10.35 years</strong> (to two decimal places). Solve 10,500 = 5,500(1 + 0.0625/52)<sup>52t</sup> for t with natural logs:</p>
<p>10,500 ÷ 5,500 = 1.909090909 and ln(1.909090909) = 0.6466271649. The weekly factor is 1 + 0.0625 ÷ 52 = 1.001201923, and ln(1.001201923) = 0.001201201346. Multiply by 52: 0.06246246997. Divide: 0.6466271649 ÷ 0.06246246997 = 10.35225096, which rounds to <strong>10.35</strong>.</p>
<p>Choose "How long" in the calculator to get the same working for your own numbers.</p>`
    },
    {
      h2: 'If I deposit $10,000 at 1.5%, how much will I have after 10 years?',
      html: `<p><strong>$11,605</strong> to the nearest whole dollar, assuming the interest is compounded once a year (the usual reading when the problem names no period). A = 10,000(1.015)<sup>10</sup> = 10,000 × 1.160540825 = 11,605.40825. If your textbook says compounded monthly, use n = 12: the answer is $11,617.</p>`
    },
    {
      h2: 'How much does the compounding period change the answer?',
      html: `<p>A little, at low rates. For $10,000 at 1.5% for 10 years, from the calculator:</p>
<div class="twrap"><table><thead><tr><th>Compounded</th><th>n</th><th>Amount A</th></tr></thead><tbody>
<tr><td>Annually</td><td>1</td><td>$11,605.41</td></tr><tr><td>Quarterly</td><td>4</td><td>$11,615.08</td></tr><tr><td>Monthly</td><td>12</td><td>$11,617.25</td></tr><tr><td>Weekly</td><td>52</td><td>$11,618.09</td></tr><tr><td>Daily</td><td>365</td><td>$11,618.31</td></tr>
</tbody></table></div>
<p>More periods always means slightly more growth, but the gain shrinks as n rises.</p>`
    }
  ],
  mistakes: [
    '<strong>Using the percent instead of the decimal.</strong> r for 6.25% is 0.0625. Putting 6.25 into the formula makes the growth factor 1.12 per week instead of 1.0012.',
    '<strong>Forgetting to divide r by n.</strong> At weekly compounding the rate per period is 0.0625 ÷ 52, not 0.0625.',
    '<strong>Using t instead of nt as the exponent.</strong> Ten years compounded weekly is 520 periods, so the exponent is 520, not 10.',
    '<strong>Rounding 1 + r/n too early.</strong> Writing 1.0012 for 1.001201923 in the weekly problem gives 10.37 years instead of 10.35.',
    '<strong>Taking the log of A − P.</strong> The log goes on the ratio A ÷ P (1.909090909), never on the difference.'
  ],
  related: ['car-depreciation-calculator', 'exponent-calculator', 'percentage-calculator'],
  faq: [
    { q: 'What is the compound interest formula?', a: 'A = P(1 + r/n)<sup>nt</sup>, where P is the starting amount, r the yearly rate as a decimal, n the compounding periods per year and t the years. The interest earned is A − P.' },
    { q: 'How do you solve for time in compound interest?', a: 'Divide both sides by P, take the log of both sides, and divide: t = ln(A ÷ P) ÷ (n × ln(1 + r/n)). Common logs (log) give the same answer as natural logs (ln) as long as you use the same one on top and bottom.' },
    { q: 'What is n for weekly, monthly and daily compounding?', a: 'Weekly n = 52, monthly n = 12, quarterly n = 4, semiannually n = 2 and daily n = 365. Some finance classes use 360 for daily; follow your textbook.' },
    { q: 'What about interest compounded continuously?', a: 'Use A = Pe<sup>rt</sup>. $10,000 at 1.5% for 10 years gives 10,000 × e<sup>0.15</sup> = $11,618.34, just above the daily result.' }
  ],
  sources: [
    { name: 'OpenStax College Algebra 2e: Exponential Functions', url: 'https://openstax.org/books/college-algebra-2e/pages/6-1-exponential-functions' },
    { name: 'OpenStax College Algebra 2e: Exponential and Logarithmic Equations', url: 'https://openstax.org/books/college-algebra-2e/pages/6-6-exponential-and-logarithmic-equations' },
    { name: 'Wolfram MathWorld: Compound Interest', url: 'https://mathworld.wolfram.com/CompoundInterest.html' }
  ]
};
