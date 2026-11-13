export default {
  slug: 'z-score-calculator',
  hub: 'statistics',
  name: 'Z-Score Calculator',
  title: 'Z-Score Calculator: 85 With Mean 70, SD 10 Is z = 1.5 (Excel)',
  h1: 'Z-Score Calculator: Standard Score, Probability and Percentile',
  meta: 'A score of 85 on a test with mean 70 and SD 10 has z = 1.5, the 93.32nd percentile. Find z, normal probabilities and percentiles, plus the Excel and SPSS steps.',
  keyword: 'how to calculate a z score in excel',
  also: ['z score calculator', 'how to calculate z value in excel', 'how to calculate the z score in excel', 'how to calculate z score probability', 'how to calculate the z score on excel', 'how to calculate z score in spss', 'how to calculate z-scores in excel', 'how to calculate z-score in excel', 'how to calculate z value in spss', 'how to calculate z score on spss', 'how to calculate a z score in spss', 'how to calculate z scores in excel', 'how to calculate z score on excel', 'how to calculate percentile rank from z score'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Find', type: 'select', value: 'score', wide: true, options: [['score', 'z-score and percentile from a raw score'], ['pct', 'Raw score and z from a percentile']] },
    { id: 'x', label: 'Raw score (x)', type: 'number', value: 85, showIf: { mode: ['score'] } },
    { id: 'pct', label: 'Percentile', type: 'number', value: 90, suffix: 'th', showIf: { mode: ['pct'] } },
    { id: 'mean', label: 'Mean (μ)', type: 'number', value: 70 },
    { id: 'sd', label: 'Standard deviation (σ)', type: 'number', value: 10 }
  ],
  compute(v, H) {
    if (!(v.mean === v.mean)) return { error: 'Enter the mean.' };
    if (!(v.sd > 0)) return { error: 'Enter a standard deviation above 0.' };
    function pc(p) { return H.pct(p * 100, p < 0.001 || p > 0.999 ? 4 : 2); }
    if (v.mode === 'pct') {
      if (!(v.pct > 0 && v.pct < 100)) return { error: 'Enter a percentile between 0 and 100.' };
      var zp = H.normInv(v.pct / 100), xp = v.mean + zp * v.sd;
      return {
        value: 'x = ' + H.num(xp, 2), label: 'Score at the ' + H.num(v.pct, 2) + 'th percentile',
        expr: H.num(v.mean, 4) + ' + ' + H.fix(zp, 4) + ' × ' + H.num(v.sd, 4),
        rows: [['z-score', H.fix(zp, 4), true], ['Share scoring below', H.pct(v.pct, 2)], ['Share scoring above', H.pct(100 - v.pct, 2)], ['Excel', '<code>=NORM.INV(' + Number((v.pct / 100).toFixed(6)) + ',' + v.mean + ',' + v.sd + ')</code>'], ['TI-84', '<code>invNorm(' + Number((v.pct / 100).toFixed(6)) + ',' + v.mean + ',' + v.sd + ')</code>']],
        sub: 'In a normal distribution with this mean and SD, ' + H.pct(v.pct, 2) + ' of values fall below ' + H.num(xp, 2) + '.',
        _z: zp, _x: xp
      };
    }
    if (!(v.x === v.x)) return { error: 'Enter the raw score.' };
    var z = (v.x - v.mean) / v.sd, left = H.normCdf(z), right = H.normCdf(-z), az = Math.abs(z);
    var within = 1 - 2 * H.normCdf(-az);
    return {
      value: 'z = ' + H.fix(z, 2), label: 'Standard score',
      expr: '(' + H.num(v.x, 4) + ' − ' + H.num(v.mean, 4) + ') ÷ ' + H.num(v.sd, 4) + ' = ' + H.fix(z, 4),
      rows: [['Percentile (area to the left)', pc(left), true], ['Area to the right', pc(right)], ['Area between −' + H.fix(az, 2) + ' and +' + H.fix(az, 2), pc(within)], ['Two-tailed p-value', H.fix(2 * H.normCdf(-az), 4)], ['Excel', '<code>=STANDARDIZE(' + v.x + ',' + v.mean + ',' + v.sd + ')</code>']],
      sub: 'This value is ' + H.fix(az, 2) + ' standard deviations ' + (z >= 0 ? 'above' : 'below') + ' the mean. ' + (az >= 3 ? 'That is very rare (beyond 3 SD).' : az >= 2 ? 'That is unusual (beyond 2 SD).' : 'That is within the usual range.'),
      _z: z, _left: left, _right: right
    };
  },
  quick: ({ r }) => `A z-score is (x − μ) ÷ σ: how many standard deviations a value sits from the mean. A test score of <strong>85</strong> where the mean is 70 and the SD is 10 gives (85 − 70) ÷ 10 = <strong>${r.value.replace('z = ', '')}</strong>, which is the <strong>93.32nd percentile</strong>. In Excel, <code>=STANDARDIZE(85,70,10)</code> returns 1.5 and <code>=NORM.S.DIST(1.5,TRUE)</code> returns 0.9332.`,
  stepsTitle: 'How to calculate a z-score',
  steps: [
    'Find the mean and standard deviation of the distribution. If you are standardizing your own data, calculate them from the data (Excel <code>AVERAGE</code> and <code>STDEV.S</code>).',
    'Subtract the mean from the value: 85 − 70 = 15.',
    'Divide by the standard deviation: 15 ÷ 10 = 1.5. Dividing by the variance instead of the SD is a frequent slip.',
    'To turn z into a percentile, find the area to its left under the standard normal curve: Φ(1.5) = 0.9332, so 93.32% of scores are lower.'
  ],
  formulaTitle: 'What is the z-score formula?',
  formula: {
    expr: 'z = (x − μ) ÷ σ<br>x = μ + z × σ<br>Percentile = Φ(z) × 100',
    vars: [['x', 'the raw score or observation'], ['μ', 'mean of the distribution'], ['σ', 'standard deviation'], ['Φ', 'standard normal cumulative distribution function']],
    note: 'For a sample mean rather than a single value, divide by the standard error: z = (x̄ − μ) ÷ (σ ÷ √n).'
  },
  example: `<p>Two students took different exams. Ana scored 85 on a test with mean 70 and SD 10; Ben scored 650 on a test with mean 500 and SD 120.</p>
<p>Ana: z = (85 − 70) ÷ 10 = <strong>1.50</strong> (93.32nd percentile). Ben: z = (650 − 500) ÷ 120 = <strong>1.25</strong> (89.44th percentile).</p>
<p>Ana did relatively better, even though Ben's raw score is far higher. Standardizing is what makes the comparison fair.</p>`,
  table: {
    title: 'What percentile is each z-score?',
    intro: 'Standard normal areas for common z-scores, with the matching raw score on a scale with mean 70 and SD 10. Calculated with the tool above.',
    head: ['z', 'Percentile (below)', 'Area above', 'Raw score (μ 70, σ 10)'],
    rows: ({ run, H }) => [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3].map(z => {
      const r = run({ mode: 'score', x: 70 + 10 * z, mean: 70, sd: 10 });
      return [H.fix(z, 1), H.pct(r._left * 100, 2), H.pct(r._right * 100, 2), H.num(70 + 10 * z, 0)];
    }),
    note: 'About 68.27% of values fall between z = −1 and +1, 95.45% between ±2 and 99.73% between ±3.'
  },
  sections: [
    {
      h2: 'How do you calculate a z-score in Excel?',
      html: `<p>For one value with a known mean and SD, use <code>=STANDARDIZE(x, mean, standard_dev)</code>: <code>=STANDARDIZE(85,70,10)</code> returns 1.5. It's the same as typing <code>=(85-70)/10</code>.</p>
<p>To convert a whole column of data in A2:A51 into z-scores, enter this in B2 and fill it down:</p>
<p><code>=STANDARDIZE(A2,AVERAGE($A$2:$A$51),STDEV.S($A$2:$A$51))</code></p>
<p>The dollar signs lock the range so every row uses the same mean and SD; leaving them out is the usual reason a z-score column comes out wrong. Use STDEV.P instead of STDEV.S if the column is an entire population. Google Sheets uses the same STANDARDIZE, AVERAGE and STDEV.S functions.</p>
<p>To get the percentile, wrap the z-score in <code>=NORM.S.DIST(z,TRUE)</code>, or skip z entirely with <code>=NORM.DIST(85,70,10,TRUE)</code>; both return 0.9332.</p>`
    },
    {
      h2: 'How do you calculate z-scores in SPSS?',
      html: `<ol>
<li>Go to <strong>Analyze → Descriptive Statistics → Descriptives</strong>.</li>
<li>Move the variable (for example <em>score</em>) into the Variable(s) box.</li>
<li>Tick <strong>Save standardized values as variables</strong> and click OK.</li>
</ol>
<p>SPSS adds a new column named with a Z prefix (<em>Zscore</em>) to Data View, holding each case's z-score. It uses the sample standard deviation (n − 1), so the values match Excel's STDEV.S version, not STDEV.P. To compute a percentile from those z-scores, use <strong>Transform → Compute Variable</strong> with <code>CDF.NORMAL(Zscore,0,1)</code>.</p>`
    },
    {
      h2: 'How do you find the probability for a z-score?',
      html: `<p>The probability is an area under the standard normal curve. Pick the region you need:</p>
<ul>
<li><strong>Below z</strong> (less than): Φ(z). For z = 1.5 that's 0.9332.</li>
<li><strong>Above z</strong> (greater than): 1 − Φ(z) = 0.0668.</li>
<li><strong>Between two z-scores</strong>: Φ(z₂) − Φ(z₁). Between −1.5 and 1.5: 0.9332 − 0.0668 = 0.8664.</li>
</ul>
<p>On a TI-84, press <strong>2nd VARS</strong> (DISTR) → <strong>normalcdf(</strong> and enter lower, upper, μ, σ: <code>normalcdf(-1E99, 85, 70, 10)</code> gives 0.9332. A z-table gives the same value at row 1.5, column 0.00. For hypothesis tests where z is a test statistic, the <a href="/p-value-calculator">p-value calculator</a> handles one- and two-tailed tests.</p>`
    },
    {
      h2: 'How do you calculate a percentile rank from a z-score, and back?',
      html: `<p>Percentile rank = Φ(z) × 100. A z of 0 is the 50th percentile, z = 1 is the 84th and z = −2 is the 2nd (2.28%).</p>
<p>Going the other way, find z for the percentile and convert it to a raw score with x = μ + zσ. The 90th percentile has z = 1.2816, so on a scale with mean 70 and SD 10 the cutoff is 70 + 1.2816 × 10 = <strong>82.82</strong>. Use Excel's <code>=NORM.INV(0.9,70,10)</code> or <code>=NORM.S.INV(0.9)</code> for z alone, or <code>invNorm(0.9,70,10)</code> on a TI-84. Choose "Raw score and z from a percentile" above to do it here.</p>
<p>These percentiles assume the scores are roughly normal. For skewed data, rank the actual values instead (Excel <code>PERCENTRANK.INC</code>).</p>`
    }
  ],
  faq: [
    { q: 'What does a negative z-score mean?', a: 'A negative z-score means the value is below the mean. z = −1.5 is 1.5 standard deviations below average, the 6.68th percentile.' },
    { q: 'What is a good z-score?', a: 'It depends on whether high values are good. On a test, z = 1 beats about 84% of scores and z = 2 beats about 98%. Values beyond ±2 are unusual and beyond ±3 are rare in normal data.' },
    { q: 'What z-score is the 95th percentile?', a: 'The 95th percentile is z = 1.645. The 97.5th percentile, used for 95% confidence intervals, is z = 1.960.' },
    { q: 'Can a z-score be greater than 3?', a: 'Yes. Nothing caps a z-score, but in normally distributed data only 0.13% of values are above +3. A z-score beyond ±3 often flags an outlier or a non-normal distribution.' },
    { q: 'Should I use STDEV.S or STDEV.P for z-scores in Excel?', a: 'Use STDEV.S when your data are a sample (the usual case, and what SPSS does). Use STDEV.P only when the data are the full population. The z-scores differ slightly, most for small data sets.' },
    { q: 'What is the difference between a z-score and a t-score?', a: 'A z-score standardizes with a known population SD and uses the normal distribution. A t statistic uses the sample SD and the t distribution, which has heavier tails for small samples. (Psychology also uses "T-scores" scaled to mean 50 and SD 10: T = 50 + 10z.)' },
    { q: 'How do I calculate a z-score for a sample mean?', a: 'Divide by the standard error instead of the SD: z = (x̄ − μ) ÷ (σ ÷ √n). A sample of 25 with mean 74, from a population with μ = 70 and σ = 10, gives z = 4 ÷ 2 = 2.0.' }
  ],
  related: ['p-value-calculator', 'standard-deviation-calculator', 'outlier-calculator', 'confidence-interval-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Normal Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Cumulative Distribution Function of the Standard Normal Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3671.htm' },
    { name: 'Microsoft Support: STANDARDIZE function', url: 'https://support.microsoft.com/en-us/excel/functions/standardize-function' },
    { name: 'Microsoft Support: NORM.S.DIST function', url: 'https://support.microsoft.com/en-us/excel/functions/norm-s-dist-function' },
    { name: 'Microsoft Support: NORM.INV function', url: 'https://support.microsoft.com/en-us/excel/functions/norm-inv-function' }
  ]
};
