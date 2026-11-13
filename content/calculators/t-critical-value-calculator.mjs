export default {
  slug: 't-critical-value-calculator',
  hub: 'statistics',
  name: 'T Critical Value Calculator',
  title: 'T Critical Value Calculator: α = 0.05, df = 10 → t* = 2.228',
  h1: 'T Critical Value Calculator and Student\'s t Table',
  meta: 'The two-tailed t critical value for α = 0.05 with 10 degrees of freedom is ±2.228 (one-tailed: 1.812). Any α, df and tail, plus the Excel and TI-84 inputs.',
  keyword: 'how to calculate critical value of t',
  also: ['t critical value calculator', 't table', 'critical t value calculator', 'how to find t critical value in excel', 'invt ti 84', 't value calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'alpha', label: 'Significance level α', type: 'number', value: 0.05, help: 'For a 95% confidence interval use 0.05 with two tails.' },
    { id: 'df', label: 'Degrees of freedom (df)', type: 'number', value: 10, help: 'One-sample or paired test: n − 1.' },
    { id: 'tails', label: 'Tails', type: 'select', value: 'two', options: [['two', 'Two-tailed (±)'], ['right', 'Right-tailed (upper)'], ['left', 'Left-tailed (lower)']] }
  ],
  compute(v, H) {
    var a = v.alpha, df = v.df;
    if (!(a > 0 && a < 1)) return { error: 'Enter α between 0 and 1, e.g. 0.05.' };
    if (!(df > 0)) return { error: 'Enter degrees of freedom above 0.' };
    var q = v.tails === 'two' ? 1 - a / 2 : v.tails === 'right' ? 1 - a : a;
    var t = H.tInv(q, df), z = H.normInv(q);
    var one = H.tInv(1 - a, df), two = H.tInv(1 - a / 2, df);
    var A = Number(a.toFixed(6)), D = Number(df.toFixed(3)), Q = Number(q.toFixed(6));
    var xl = v.tails === 'two' ? '=T.INV.2T(' + A + ',' + D + ')' : v.tails === 'right' ? '=T.INV(' + Number((1 - a).toFixed(6)) + ',' + D + ')' : '=T.INV(' + A + ',' + D + ')';
    var shown = v.tails === 'two' ? '±' + H.fix(t, 3) : H.fix(t, 3);
    return {
      value: 't* = ' + shown, label: (v.tails === 'two' ? 'Two-tailed' : v.tails === 'right' ? 'Right-tailed' : 'Left-tailed') + ' critical value, α = ' + H.num(a, 4) + ', df = ' + H.num(df, 3),
      expr: 'T⁻¹(' + H.num(q, 6) + ', ' + H.num(df, 3) + ')',
      rows: [
        ['Area to the left of t*', H.num(q, 6)],
        ['Two-tailed value (same α)', '±' + H.fix(two, 3), v.tails === 'two'],
        ['One-tailed value (same α)', H.fix(one, 3), v.tails !== 'two'],
        ['z critical value for comparison', (v.tails === 'two' ? '±' : '') + H.fix(z, 3)],
        ['Confidence level for an interval', H.pct((1 - a) * 100, 2) + (v.tails === 'two' ? '' : ' (one-sided)')],
        ['Excel / Google Sheets', '<code>' + xl + '</code>'],
        ['TI-84', '<code>invT(' + Q + ',' + D + ')</code>']
      ],
      sub: v.tails === 'two' ? 'Reject H₀ if |t| > ' + H.fix(t, 3) + '. With df = ' + H.num(df, 3) + ' the t value is ' + H.pct((t / z - 1) * 100, 1) + ' larger than the normal-distribution value.' : 'Reject H₀ if t ' + (v.tails === 'right' ? '> ' : '< ') + H.fix(t, 3) + '.',
      _t: t
    };
  },
  quick: ({ r }) => `To find a t critical value, look up the t distribution's inverse at 1 − α/2 (two-tailed) or 1 − α (one-tailed) with your degrees of freedom. For <strong>α = 0.05 and df = 10</strong>, the two-tailed critical value is <strong>${r.value.replace('t* = ', '')}</strong> and the one-tailed value is 1.812. In Excel: <code>=T.INV.2T(0.05,10)</code>; on a TI-84: <code>invT(0.975,10)</code>.`,
  stepsTitle: 'How to find the critical value of t',
  steps: [
    'Choose the significance level α (0.05 is standard; 0.10 or 0.01 are the usual alternatives). For a confidence interval, α = 1 − confidence, so 95% → 0.05.',
    'Work out the degrees of freedom for your test: n − 1 for one sample or paired data, n₁ + n₂ − 2 for a pooled two-sample test.',
    'Decide on one or two tails. A two-tailed test splits α between both ends, so you look up 1 − α/2 = 0.975, not 0.95. Mixing these up is the most common table-reading error.',
    'Read t* from the table below at your df row and α column, or calculate it: Excel <code>=T.INV.2T(α, df)</code>.',
    'Compare: reject the null hypothesis if your test statistic is beyond ±t* (or beyond t* in the direction of a one-tailed test).'
  ],
  formulaTitle: 'How is the t critical value defined?',
  formula: {
    expr: 'Two-tailed: t* = T⁻¹<sub>df</sub>(1 − α/2)<br>Right-tailed: t* = T⁻¹<sub>df</sub>(1 − α) &nbsp; Left-tailed: t* = −T⁻¹<sub>df</sub>(1 − α)',
    vars: [['T⁻¹<sub>df</sub>', 'inverse cumulative distribution function (quantile) of Student\'s t with df degrees of freedom'], ['α', 'significance level'], ['df', 'degrees of freedom']],
    note: 'There is no closed-form formula; t* is found numerically. This calculator solves P(T ≤ t*) = 1 − α/2 to well beyond the three decimals printed in textbook tables.'
  },
  example: `<p>A one-sample t test uses 11 measurements and α = 0.05, two-tailed.</p>
<p>df = 11 − 1 = <strong>10</strong>. The area to the left of the upper critical value is 1 − 0.05/2 = 0.975.</p>
<p>t* = T⁻¹<sub>10</sub>(0.975) = <strong>2.228</strong>. A test statistic of t = 2.5 is beyond 2.228, so H₀ is rejected; t = 1.9 is not.</p>
<p>If the test were right-tailed instead, t* = T⁻¹<sub>10</sub>(0.95) = <strong>1.812</strong>, and t = 1.9 would be significant.</p>`,
  table: {
    title: 'What does the t table look like? (two-tailed critical values)',
    intro: 'Critical values of Student\'s t by degrees of freedom and two-tailed α, generated by the calculator above. For a one-tailed test, use the column with double your α (one-tailed 0.05 → the 0.10 column).',
    head: ['df', 'α = 0.20 (80%)', 'α = 0.10 (90%)', 'α = 0.05 (95%)', 'α = 0.02 (98%)', 'α = 0.01 (99%)'],
    rows: ({ run, H }) => [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 60, 120].map(df => [String(df), ...[0.2, 0.1, 0.05, 0.02, 0.01].map(a => H.fix(run({ alpha: a, df, tails: 'two' })._t, 3))]),
    note: 'As df grows, the values approach the normal z values: 1.282, 1.645, 1.960, 2.326 and 2.576.'
  },
  sections: [
    {
      h2: 'How do you find the t critical value in Excel or Google Sheets?',
      html: `<ul>
<li><strong>Two-tailed:</strong> <code>=T.INV.2T(0.05,10)</code> → 2.228. The older <code>=TINV(0.05,10)</code> is also two-tailed and gives the same answer.</li>
<li><strong>Right-tailed:</strong> <code>=T.INV(0.95,10)</code> → 1.812, or equivalently <code>=T.INV.2T(0.10,10)</code>.</li>
<li><strong>Left-tailed:</strong> <code>=T.INV(0.05,10)</code> → −1.812.</li>
</ul>
<p>The trap: T.INV takes a cumulative probability (area to the left), while T.INV.2T and TINV take α. Typing <code>=T.INV(0.05,10)</code> when you wanted a two-tailed 95% value gives −1.812 instead of 2.228. Google Sheets has the same three functions. In R, use <code>qt(0.975, df = 10)</code>; in Python, <code>scipy.stats.t.ppf(0.975, 10)</code>.</p>`
    },
    {
      h2: 'How do you find a t critical value on a TI-84?',
      html: `<p>Press <strong>2nd VARS</strong> (DISTR) and choose <strong>invT(</strong>. Enter the area to the <em>left</em> of the value you want, then the degrees of freedom: <code>invT(0.975,10)</code> returns 2.228. For a right-tailed test at α = 0.05 enter <code>invT(0.95,10)</code>; for left-tailed, <code>invT(0.05,10)</code>.</p>
<p>invT is on the TI-84 Plus family but not the older TI-83 Plus. On a TI-83, use the t table or a program, or let the TInterval and T-Test commands compute the interval or p-value directly.</p>`
    },
    {
      h2: 'How many degrees of freedom does your t test have?',
      html: `<div class="twrap"><table><thead><tr><th>Situation</th><th>Degrees of freedom</th></tr></thead><tbody>
<tr><td>One-sample t test or CI for a mean</td><td>n − 1</td></tr>
<tr><td>Paired t test</td><td>number of pairs − 1</td></tr>
<tr><td>Two-sample t test, equal variances (pooled)</td><td>n₁ + n₂ − 2</td></tr>
<tr><td>Two-sample t test, unequal variances (Welch)</td><td>Welch–Satterthwaite formula; often not a whole number</td></tr>
<tr><td>Slope in simple linear regression</td><td>n − 2</td></tr>
<tr><td>Coefficient in multiple regression with k predictors</td><td>n − k − 1</td></tr>
</tbody></table></div>
<p>If your df isn't in a printed table, use the next <em>smaller</em> df shown, which gives a slightly larger, conservative critical value. This calculator accepts any df, including fractional Welch values like 17.3.</p>`
    },
    {
      h2: 'When should you use a t critical value instead of z?',
      html: `<p>Use t when the standard deviation is estimated from the sample, which covers almost every test of means and every confidence interval built from <code>STDEV.S</code>. Use z only when σ is known or when testing proportions. The t value is larger because a sample SD adds uncertainty: at df = 5 the 95% two-tailed value is 2.571, 31% above z's 1.960; by df = 30 it's 2.042, only 4% above; at df = 120 it's 1.980.</p>
<p>That's why the "n ≥ 30, use z" rule of thumb exists, but software always uses t when σ is estimated, and so should you. To build the interval itself, the <a href="/confidence-interval-calculator">confidence interval calculator</a> does it in one step; to turn a t statistic into a p-value, use the <a href="/p-value-calculator">p-value calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the t critical value for a 95% confidence interval?', a: 'It depends on the degrees of freedom: 2.776 for df = 4, 2.262 for df = 9, 2.228 for df = 10, 2.045 for df = 29 and 1.984 for df = 100. It approaches 1.960 as df grows.' },
    { q: 'What is the critical t value for α = 0.05, one-tailed?', a: 'With 10 degrees of freedom the one-tailed critical value is 1.812. In general use the two-tailed column for α = 0.10, or Excel =T.INV(0.95, df).' },
    { q: 'Why is the t critical value larger than the z critical value?', a: 'The t distribution has heavier tails to account for estimating the standard deviation from the sample. With few degrees of freedom the extra width is large; with many it nearly vanishes.' },
    { q: 'What is the difference between T.INV and T.INV.2T in Excel?', a: 'T.INV(probability, df) returns the value with that cumulative area to its left (a one-tailed quantile). T.INV.2T(alpha, df) returns the positive value that leaves α split across both tails.' },
    { q: 'What is the t critical value with infinite degrees of freedom?', a: 'It equals the z critical value: 1.645 for 90%, 1.960 for 95% and 2.576 for 99% two-tailed. That is the bottom "∞" row of most t tables.' },
    { q: 'Can degrees of freedom be a decimal?', a: 'Yes. Welch\'s unequal-variance t test usually gives fractional df such as 17.34. Software uses the exact value; with a printed table, round down.' },
    { q: 'What is the t critical value for 99% confidence with 20 df?', a: 'The two-tailed critical value for 99% confidence (α = 0.01) with 20 degrees of freedom is 2.845.' }
  ],
  related: ['confidence-interval-calculator', 'p-value-calculator', 'margin-of-error-calculator', 'chi-square-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Critical Values of the Student\'s t Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm' },
    { name: 'NIST/SEMATECH e-Handbook: t Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3664.htm' },
    { name: 'Microsoft Support: T.INV.2T function', url: 'https://support.microsoft.com/en-us/excel/functions/t-inv-2t-function' },
    { name: 'Microsoft Support: T.INV function', url: 'https://support.microsoft.com/en-us/excel/functions/t-inv-function' },
    { name: 'Penn State STAT 500: Applied Statistics', url: 'https://online.stat.psu.edu/stat500/' }
  ]
};
