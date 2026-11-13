export default {
  slug: 'standard-deviation-calculator',
  hub: 'statistics',
  name: 'Standard Deviation Calculator',
  title: 'Standard Deviation Calculator: Sample s = 2.138, σ = 2 (Steps)',
  h1: 'Standard Deviation Calculator With Variance and Step-by-Step Work',
  meta: 'For 2, 4, 4, 4, 5, 5, 7, 9 the mean is 5, the sample SD is 2.138 and the population SD is 2. Paste any list for SD, variance, standard error and pooled SD.',
  keyword: 'how to calculate standard deviation',
  also: ['standard deviation calculator', 'how to calculate standard deviation in google sheets', 'how to calculate a pooled standard deviation', 'how to calculate the pooled standard deviation', 'how to calculate standard deviation in excell', 'how to calculate standard deviation ap stats', 'how to calculate standard error of the mean in excel', 'how to calculate variance in r', 'variance calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'data', label: 'Data set', type: 'text', multiline: 5, wide: true, value: '2, 4, 4, 4, 5, 5, 7, 9', placeholder: 'Paste numbers separated by commas, spaces or line breaks' },
    { id: 'kind', label: 'Treat the data as', type: 'select', value: 'sample', options: [['sample', 'A sample (divide by n − 1)'], ['pop', 'The whole population (divide by n)']] },
    { id: 'data2', label: 'Second group (optional, for pooled SD)', type: 'text', multiline: 3, wide: true, value: '', placeholder: 'Leave blank unless you need a pooled standard deviation' }
  ],
  compute(v, H) {
    var a = H.list(v.data), n = a.length;
    if (n < 2) return { error: 'Enter at least two numbers.' };
    var m = H.mean(a), ss = 0;
    a.forEach(function (x) { ss += (x - m) * (x - m); });
    var samp = v.kind !== 'pop';
    var vs = ss / (n - 1), vp = ss / n, s = Math.sqrt(vs), sp = Math.sqrt(vp);
    var sd = samp ? s : sp, vr = samp ? vs : vp;
    function f(x) { return H.num(x, 4); }
    var rows = [
      ['Mean x̄', f(m)],
      ['Count n', String(n)],
      ['Sum of squared deviations', f(ss)],
      [samp ? 'Sample variance s²' : 'Population variance σ²', f(vr), true],
      [samp ? 'Population SD σ (÷ n)' : 'Sample SD s (÷ n − 1)', f(samp ? sp : s)],
      ['Standard error of the mean s ÷ √n', f(s / Math.sqrt(n))],
      ['Range', f(Math.min.apply(null, a)) + ' to ' + f(Math.max.apply(null, a))]
    ];
    var b = H.list(v.data2);
    var out = {
      value: f(sd), label: samp ? 'Sample standard deviation s' : 'Population standard deviation σ',
      expr: '√(' + f(ss) + ' ÷ ' + (samp ? (n - 1) : n) + ')',
      rows: rows,
      sub: 'Most values lie within one SD of the mean: ' + f(m - sd) + ' to ' + f(m + sd) + ' here (' + a.filter(function (x) { return x >= m - sd && x <= m + sd; }).length + ' of ' + n + ' values).',
      table: n <= 40 ? { head: ['x', 'x − x̄', '(x − x̄)²'], rows: a.map(function (x) { return [f(x), f(x - m), f((x - m) * (x - m))]; }) } : null,
      _ss: ss, _mean: m
    };
    if (b.length >= 2) {
      var vb = H.variance(b, true), nb = b.length;
      var pooled = Math.sqrt(((n - 1) * vs + (nb - 1) * vb) / (n + nb - 2));
      rows.push(['Group 2: n, mean, s', nb + ', ' + f(H.mean(b)) + ', ' + f(Math.sqrt(vb))]);
      rows.push(['Pooled SD s<sub>p</sub>', f(pooled), true]);
    }
    return out;
  },
  quick: ({ r }) => `To calculate standard deviation, find the mean, square each value's distance from it, add the squares, divide by n − 1 (sample) or n (population), then take the square root. For <strong>2, 4, 4, 4, 5, 5, 7, 9</strong> the mean is 5 and the squares add to 32, so the sample SD is √(32 ÷ 7) = <strong>${r.value}</strong> and the population SD is √(32 ÷ 8) = <strong>2</strong>.`,
  stepsTitle: 'How to calculate standard deviation by hand',
  steps: [
    'Add the values and divide by how many there are to get the mean. 2 + 4 + 4 + 4 + 5 + 5 + 7 + 9 = 40, and 40 ÷ 8 = 5.',
    'Subtract the mean from each value and square the result: (2 − 5)² = 9, (4 − 5)² = 1, and so on.',
    'Add the squared deviations. Here they total 32.',
    'Divide by n − 1 if your numbers are a sample from a bigger group (32 ÷ 7 = 4.5714), or by n if they are the entire population (32 ÷ 8 = 4). This is the variance. Dividing a sample by n is the most common mistake and makes the SD too small.',
    'Take the square root of the variance: √4.5714 = 2.1381 (sample) or √4 = 2 (population).'
  ],
  formulaTitle: 'What is the standard deviation formula?',
  formula: {
    expr: 'Sample: s = √[ Σ(x − x̄)² ÷ (n − 1) ]<br>Population: σ = √[ Σ(x − μ)² ÷ N ]<br>Standard error: SE = s ÷ √n',
    vars: [['x', 'each value'], ['x̄, μ', 'sample mean, population mean'], ['n, N', 'number of values'], ['Σ', 'sum over all values']],
    note: 'Dividing by n − 1 (Bessel\'s correction) makes the sample variance an unbiased estimate of the population variance, because deviations from the sample mean run slightly smaller than deviations from the true mean.'
  },
  example: `<p>Data: 2, 4, 4, 4, 5, 5, 7, 9 (n = 8).</p>
<p>Mean = 40 ÷ 8 = <strong>5</strong>. Squared deviations: 9, 1, 1, 1, 0, 0, 4, 16. Sum = <strong>32</strong>.</p>
<p>Sample variance = 32 ÷ 7 = 4.5714, so <strong>s = 2.1381</strong>. Population variance = 32 ÷ 8 = 4, so <strong>σ = 2</strong>.</p>
<p>Standard error of the mean = 2.1381 ÷ √8 = <strong>0.7559</strong>.</p>`,
  table: {
    title: 'What does each step of the calculation look like?',
    intro: 'The deviation table for the example data, produced by the calculator. Paste your own numbers above and the same table appears under the result.',
    head: ['Value x', 'x − x̄', '(x − x̄)²'],
    rows: ({ r, H }) => (r.table ? r.table.rows : []).concat([['<strong>Total</strong>', '0', '<strong>' + H.num(r._ss, 4) + '</strong>']]),
    note: 'The deviations always add to 0, which is why they are squared before averaging.'
  },
  sections: [
    {
      h2: 'How do you calculate standard deviation in Excel or Google Sheets?',
      html: `<p>Put the values in one column (A2:A9 here) and use:</p>
<ul>
<li><code>=STDEV.S(A2:A9)</code>: sample SD, returns 2.138. The older <code>=STDEV()</code> does the same.</li>
<li><code>=STDEV.P(A2:A9)</code>: population SD, returns 2. The older <code>=STDEVP()</code> does the same.</li>
<li><code>=VAR.S(A2:A9)</code> and <code>=VAR.P(A2:A9)</code>: the variances, 4.571 and 4.</li>
<li><code>=STDEV.S(A2:A9)/SQRT(COUNT(A2:A9))</code>: standard error of the mean, 0.756.</li>
</ul>
<p>Google Sheets accepts all of these names. For one group in a mixed column, use <code>=STDEV.S(IF(B2:B100="East",C2:C100))</code> (press Ctrl+Shift+Enter in Excel 2019 and older; Sheets needs <code>=ARRAYFORMULA(...)</code> around it). Text and blank cells are ignored by STDEV.S; use STDEVA if text should count as 0. In R, <code>sd(x)</code> and <code>var(x)</code> both use n − 1.</p>`
    },
    {
      h2: 'Should you use the sample or population standard deviation?',
      html: `<p>Use the <strong>sample</strong> formula (n − 1) when your numbers are a subset you want to generalize from: survey responses, lab replicates, a class you're using to describe all students. Use the <strong>population</strong> formula (n) only when you have every member of the group you care about, such as the final scores of everyone in one class when you only care about that class.</p>
<p>The gap matters most for small data sets:</p>
<div class="twrap"><table><thead><tr><th>n</th><th>s ÷ σ</th><th>Sample SD is larger by</th></tr></thead><tbody>
<tr><td>2</td><td>1.4142</td><td>41.4%</td></tr><tr><td>5</td><td>1.1180</td><td>11.8%</td></tr><tr><td>10</td><td>1.0541</td><td>5.4%</td></tr><tr><td>30</td><td>1.0171</td><td>1.7%</td></tr><tr><td>100</td><td>1.0050</td><td>0.5%</td></tr>
</tbody></table></div>
<p>When in doubt, use the sample SD. It's what statistics courses, hypothesis tests and confidence intervals expect.</p>`
    },
    {
      h2: 'How do you calculate a pooled standard deviation?',
      html: `<p>A pooled SD combines two groups that are assumed to share the same spread, as in a two-sample t test or Cohen's d. Weight each variance by its degrees of freedom:</p>
<p><strong>s<sub>p</sub> = √[((n₁ − 1)s₁² + (n₂ − 1)s₂²) ÷ (n₁ + n₂ − 2)]</strong></p>
<p>Group 1 above has n = 8 and s² = 4.5714. If group 2 is 3, 5, 6, 6, 8, 10 (n = 6, s² = 5.8667), the pooled SD is √[(7 × 4.5714 + 5 × 5.8667) ÷ 12] = √5.1111 = <strong>2.2608</strong>. Paste the second group into the optional box to get it automatically. With equal group sizes the pooled variance is simply the average of the two variances.</p>`
    },
    {
      h2: 'How do you find standard deviation on a TI-84 for AP Stats?',
      html: `<p>Press <strong>STAT → 1:Edit</strong> and type the values into L1. Then press <strong>STAT → CALC → 1:1-Var Stats</strong>, make sure List is L1, and press Enter. The screen shows x̄ = 5, <strong>Sx = 2.138</strong> (sample) and <strong>σx = 2</strong> (population). The AP Statistics formula sheet uses the sample version, s, so report Sx unless a problem says the data are the whole population.</p>
<p>For a frequency table, put the values in L1 and the counts in L2 and set FreqList to L2.</p>`
    },
    {
      h2: 'What does the standard deviation tell you?',
      html: `<p>It's the typical distance of a value from the mean, in the data's own units. For roughly bell-shaped data, about 68% of values fall within 1 SD of the mean, 95% within 2 SD and 99.7% within 3 SD (the empirical rule). A value 2.5 SD above the mean is unusual; the <a href="/z-score-calculator">z-score calculator</a> turns that distance into a percentile.</p>
<p>The SD can't be compared directly between data sets measured on different scales. Divide it by the mean to get the <a href="/coefficient-of-variation-calculator">coefficient of variation</a>, and use the standard error, not the SD, when you are describing how precise a mean is.</p>`
    }
  ],
  faq: [
    { q: 'What is the difference between variance and standard deviation?', a: 'Variance is the average squared deviation from the mean; the standard deviation is its square root. The SD is in the same units as the data (hours, dollars), which makes it easier to interpret. For the example data, the sample variance is 4.5714 and the SD is 2.1381.' },
    { q: 'What is the difference between standard deviation and standard error?', a: 'The standard deviation describes how spread out individual values are. The standard error, s ÷ √n, describes how precisely the sample mean estimates the population mean, and it shrinks as the sample grows.' },
    { q: 'Can standard deviation be negative?', a: 'No. It is the square root of an average of squares, so it is always zero or positive. It is zero only when every value is identical.' },
    { q: 'Why do we divide by n − 1 instead of n?', a: 'Deviations are measured from the sample mean, which is itself fitted to the data, so they come out slightly too small. Dividing by n − 1 corrects this and gives an unbiased estimate of the population variance.' },
    { q: 'Is STDEV in Excel the sample or population standard deviation?', a: 'STDEV and STDEV.S are the sample standard deviation (n − 1). STDEVP and STDEV.P are the population version (n).' },
    { q: 'How do you calculate standard deviation from a frequency table?', a: 'Multiply each squared deviation by its frequency, add them, divide by (total frequency − 1) for a sample, and take the square root. On a TI-84 put the frequencies in L2 and use 1-Var Stats L1, L2.' },
    { q: 'What is a good or high standard deviation?', a: 'There is no universal cutoff; it depends on the scale. Compare the SD with the mean (the coefficient of variation) or with the SD of similar data. A CV under about 10% is usually considered low variability.' }
  ],
  related: ['coefficient-of-variation-calculator', 'z-score-calculator', 'confidence-interval-calculator', 'outlier-calculator', 'point-estimate-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Measures of Scale', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm' },
    { name: 'Microsoft Support: STDEV.S function', url: 'https://support.microsoft.com/en-us/excel/functions/stdev-s-function' },
    { name: 'Microsoft Support: STDEV.P function', url: 'https://support.microsoft.com/en-us/excel/functions/stdev-p-function' },
    { name: 'Google Docs Editors Help: STDEV', url: 'https://support.google.com/docs/answer/3094054' },
    { name: 'Penn State STAT 200: Elementary Statistics', url: 'https://online.stat.psu.edu/stat200/' }
  ]
};
