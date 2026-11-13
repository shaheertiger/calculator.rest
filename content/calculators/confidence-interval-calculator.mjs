export default {
  slug: 'confidence-interval-calculator',
  hub: 'statistics',
  name: 'Confidence Interval Calculator',
  title: '95% Confidence Interval Calculator: Mean, Proportion, z or t',
  h1: 'Confidence Interval Calculator for a Mean or a Proportion',
  meta: 'A sample of 30 with mean 12.4 and s = 1.8 has a 95% confidence interval of 11.728 to 13.072. Get t or z intervals, proportion CIs and confidence levels.',
  keyword: 'how to calculate 95 confidence interval',
  also: ['how to calculate confidence level', 'how to calculate 95 percent confidence interval', 'confidence interval calculator', '95 confidence interval calculator', 'how to calculate confidence interval in excel', 'confidence interval for proportion calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'type', label: 'What do you want?', type: 'select', value: 'mean', wide: true, options: [['mean', 'CI for a mean (x̄, s, n)'], ['prop', 'CI for a proportion (successes out of n)'], ['level', 'Confidence level from a margin of error']] },
    { id: 'dist', label: 'Critical value', type: 'select', value: 't', options: [['t', 't (sample SD, σ unknown)'], ['z', 'z (population σ known)']], showIf: { type: ['mean'] } },
    { id: 'mean', label: 'Sample mean (x̄)', type: 'number', value: 12.4, showIf: { type: ['mean'] } },
    { id: 'sd', label: 'Standard deviation (s or σ)', type: 'number', value: 1.8, showIf: { type: ['mean', 'level'] } },
    { id: 'n', label: 'Sample size (n)', type: 'number', value: 30, showIf: { type: ['mean', 'level'] } },
    { id: 'x', label: 'Successes (x)', type: 'number', value: 248, showIf: { type: ['prop'] }, help: 'People who said yes, defective parts, clicks…' },
    { id: 'pn', label: 'Sample size (n)', type: 'number', value: 400, showIf: { type: ['prop'] } },
    { id: 'moe', label: 'Margin of error (±)', type: 'number', value: 0.5, showIf: { type: ['level'] }, help: 'Half the width of the interval, in the same units as the data.' },
    { id: 'conf', label: 'Confidence level', type: 'number', value: 95, suffix: '%', showIf: { type: ['mean', 'prop'] } }
  ],
  compute(v, H) {
    function f(x) { return H.num(x, 3); }
    if (v.type === 'level') {
      if (!(v.sd > 0)) return { error: 'Enter a standard deviation above 0.' };
      if (!(v.n >= 2)) return { error: 'Enter a sample size of at least 2.' };
      if (!(v.moe > 0)) return { error: 'Enter the margin of error (half the interval width).' };
      var se0 = v.sd / Math.sqrt(v.n), zz = v.moe / se0;
      var lz = 2 * H.normCdf(zz) - 1, lt = 2 * H.tCdf(zz, Math.floor(v.n) - 1) - 1;
      return {
        value: H.pct(lz * 100, 2), label: 'Confidence level (z)',
        expr: 'z = ' + H.num(v.moe, 4) + ' ÷ (' + H.num(v.sd, 4) + ' ÷ √' + H.num(v.n, 0) + ') = ' + H.fix(zz, 3),
        rows: [['Critical value implied', 'z = ' + H.fix(zz, 3), true], ['Standard error', f(se0)], ['Confidence level using t (df ' + (Math.floor(v.n) - 1) + ')', H.pct(lt * 100, 2)], ['Significance level α', H.fix(1 - lz, 4)]],
        sub: 'A ±' + H.num(v.moe, 4) + ' margin with this spread and sample size corresponds to about ' + H.pct(lz * 100, 1) + ' confidence. Larger samples give more confidence for the same margin.',
        _level: lz
      };
    }
    var c = v.conf;
    if (!(c > 0 && c < 100)) return { error: 'Enter a confidence level between 0 and 100%, e.g. 95.' };
    var alpha = 1 - c / 100;
    if (v.type === 'prop') {
      var n = Math.floor(v.pn), x = v.x;
      if (!(n >= 1)) return { error: 'Enter the sample size.' };
      if (!(x >= 0) || x > n) return { error: 'Successes must be between 0 and n.' };
      var p = x / n, z = H.normInv(1 - alpha / 2), sep = Math.sqrt(p * (1 - p) / n), m = z * sep;
      var lo = Math.max(0, p - m), hi = Math.min(1, p + m);
      var den = 1 + z * z / n, cen = (p + z * z / (2 * n)) / den, half = z / den * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
      var ok = n * p >= 10 && n * (1 - p) >= 10;
      return {
        value: H.pct(lo * 100, 2) + ' to ' + H.pct(hi * 100, 2), label: H.num(c, 2) + '% confidence interval for the proportion',
        expr: H.fix(p, 4) + ' ± ' + H.fix(z, 3) + ' × √(' + H.fix(p, 4) + ' × ' + H.fix(1 - p, 4) + ' ÷ ' + n + ')',
        rows: [['Sample proportion p̂', H.pct(p * 100, 2), true], ['Margin of error', '±' + H.pct(m * 100, 2), true], ['Critical value z*', H.fix(z, 3)], ['Standard error', H.fix(sep, 4)], ['Wilson score interval', H.pct((cen - half) * 100, 2) + ' to ' + H.pct((cen + half) * 100, 2)]],
        sub: ok ? 'np̂ and n(1 − p̂) are both at least 10, so the normal (Wald) interval is reasonable; the Wilson interval is shown as a check.' : 'Fewer than 10 successes or failures: the Wald interval is unreliable here, so use the Wilson score interval shown below it.',
        _lo: lo, _hi: hi, _moe: m
      };
    }
    if (!(v.mean === v.mean)) return { error: 'Enter the sample mean.' };
    if (!(v.sd > 0)) return { error: 'Enter a standard deviation above 0.' };
    if (!(v.n >= 2)) return { error: 'Enter a sample size of at least 2.' };
    var nn = Math.floor(v.n), df = nn - 1, se = v.sd / Math.sqrt(nn);
    var crit = v.dist === 'z' ? H.normInv(1 - alpha / 2) : H.tInv(1 - alpha / 2, df);
    var moe = crit * se, l = v.mean - moe, u = v.mean + moe;
    return {
      value: f(l) + ' to ' + f(u), label: H.num(c, 2) + '% confidence interval for the mean',
      expr: H.num(v.mean, 4) + ' ± ' + H.fix(crit, 3) + ' × ' + H.num(v.sd, 4) + ' ÷ √' + nn,
      rows: [['Margin of error', '±' + f(moe), true], [v.dist === 'z' ? 'Critical value z*' : 'Critical value t* (df ' + df + ')', H.fix(crit, 3)], ['Standard error s ÷ √n', f(se)], ['Interval', H.num(v.mean, 4) + ' ± ' + f(moe)]],
      sub: 'If you repeated the sampling many times, about ' + H.num(c, 2) + '% of intervals built this way would contain the true population mean.',
      _crit: crit, _lo: l, _hi: u, _moe: moe
    };
  },
  quick: ({ r }) => `A 95% confidence interval for a mean is x̄ ± t* × s ÷ √n. For 30 batteries averaging <strong>12.4 hours</strong> with s = 1.8, the standard error is 0.329, t* with 29 degrees of freedom is 2.045, and the margin of error is 0.672, so the interval is <strong>${r.value} hours</strong>. If σ is known, swap t* for z* = 1.96.`,
  stepsTitle: 'How to calculate a 95% confidence interval',
  steps: [
    'Find the sample mean x̄ and the sample standard deviation s (Excel: <code>=AVERAGE()</code> and <code>=STDEV.S()</code>), and count n.',
    'Compute the standard error: s ÷ √n. For 1.8 and n = 30 that is 1.8 ÷ 5.477 = 0.329.',
    'Look up the critical value. With σ unknown (almost always), use t* with n − 1 degrees of freedom: 2.045 for 95% and 29 df. Using 1.96 with a small sample is the most common mistake; it makes the interval too narrow.',
    'Multiply: margin of error = t* × SE = 2.045 × 0.329 = 0.672.',
    'Subtract and add the margin to the mean: 12.4 − 0.672 = 11.728 and 12.4 + 0.672 = 13.072.'
  ],
  formulaTitle: 'What is the confidence interval formula?',
  formula: {
    expr: 'Mean, σ unknown: x̄ ± t<sub>α/2, n−1</sub> × s ÷ √n<br>Mean, σ known: x̄ ± z<sub>α/2</sub> × σ ÷ √n<br>Proportion: p̂ ± z<sub>α/2</sub> × √(p̂(1 − p̂) ÷ n)',
    vars: [['x̄', 'sample mean'], ['s, σ', 'sample or population standard deviation'], ['n', 'sample size'], ['t, z', 'critical value for the chosen confidence level (1 − α)'], ['p̂', 'sample proportion x ÷ n']],
    note: 'The confidence level is 1 − α. At 95%, α = 0.05 and each tail holds 0.025, so the critical value is the 97.5th percentile of the t or normal distribution.'
  },
  example: `<p>A lab tests 30 phone batteries: mean life 12.4 hours, sample SD 1.8 hours.</p>
<p>SE = 1.8 ÷ √30 = <strong>0.329</strong>. With 29 df, t* = <strong>2.045</strong> (Excel <code>=T.INV.2T(0.05,29)</code>).</p>
<p>Margin of error = 2.045 × 0.329 = <strong>0.672</strong>, so the 95% CI is 12.4 ± 0.672 = <strong>11.728 to 13.072 hours</strong>.</p>
<p>For a proportion: 248 of 400 customers would renew, p̂ = 0.62. SE = √(0.62 × 0.38 ÷ 400) = 0.0243 and the margin is 1.96 × 0.0243 = 0.0476, giving <strong>57.24% to 66.76%</strong>.</p>`,
  table: {
    title: 'What are the critical values for 90%, 95% and 99% confidence?',
    intro: 'z* and t* for common confidence levels, and the interval each gives for the battery example (x̄ = 12.4, s = 1.8, n = 30). Computed by the calculator above.',
    head: ['Confidence', 'α', 'z*', 't* (df 29)', 'CI with t*'],
    rows: ({ run, H }) => [80, 85, 90, 95, 98, 99, 99.5, 99.9].map(L => {
      const t = run({ type: 'mean', dist: 't', conf: L });
      const z = run({ type: 'mean', dist: 'z', conf: L });
      return [L + '%', H.num(1 - L / 100, 3), H.fix(z._crit, 3), H.fix(t._crit, 3), t.value];
    }),
    note: 'Higher confidence always means a wider interval. Going from 95% to 99% widens this one by 35%; quadrupling the sample size halves it.'
  },
  sections: [
    {
      h2: 'How do you calculate a confidence level?',
      html: `<p>You usually choose the confidence level rather than calculate it: 95% is the convention in most sciences and survey work, 90% is common in quality and business studies, and 99% is used when a wrong conclusion is costly. The level is 1 − α, where α is the significance level you would use in a hypothesis test, so a 95% interval pairs with α = 0.05.</p>
<p>When you already have an interval and want to know what confidence it carries, work backward: divide the margin of error by the standard error to get the critical value, then convert it. For a normal critical value, <strong>confidence = 2 × Φ(z) − 1</strong>. With s = 1.8, n = 30 and a margin of ±0.5, z = 0.5 ÷ 0.329 = 1.52 and the confidence level is about <strong>87.2%</strong>. Choose "Confidence level from a margin of error" above to do this, or use <code>=2*NORM.S.DIST(z,TRUE)-1</code> in Excel.</p>
<p>Common z values to know: 1.645 ↔ 90%, 1.960 ↔ 95%, 2.576 ↔ 99%.</p>`
    },
    {
      h2: 'How do you calculate a confidence interval in Excel or Google Sheets?',
      html: `<p>Excel has two functions that return the <em>margin of error</em>, not the interval itself:</p>
<ul>
<li><code>=CONFIDENCE.T(alpha, standard_dev, size)</code> uses the t distribution. <code>=CONFIDENCE.T(0.05,1.8,30)</code> returns 0.672.</li>
<li><code>=CONFIDENCE.NORM(alpha, standard_dev, size)</code> uses z (σ known). <code>=CONFIDENCE.NORM(0.05,1.8,30)</code> returns 0.644.</li>
</ul>
<p>With raw data in A2:A31, build the bounds as <code>=AVERAGE(A2:A31)-CONFIDENCE.T(0.05,STDEV.S(A2:A31),COUNT(A2:A31))</code> and the same with a plus sign. The Analysis ToolPak's Descriptive Statistics tool also reports a "Confidence Level(95.0%)" row; that number is the margin of error too. For the critical value alone, use <code>=T.INV.2T(0.05,29)</code> or <code>=NORM.S.INV(0.975)</code>. Google Sheets accepts the same CONFIDENCE.T, CONFIDENCE.NORM and T.INV.2T formulas.</p>`
    },
    {
      h2: 'How do you find a confidence interval on a TI-84?',
      html: `<p>Press <strong>STAT</strong>, arrow to <strong>TESTS</strong>, and pick:</p>
<ul>
<li><strong>8: TInterval</strong> when σ is unknown. Choose Stats, enter x̄ = 12.4, Sx = 1.8, n = 30, C-Level = .95, then Calculate. The screen shows (11.728, 13.072).</li>
<li><strong>7: ZInterval</strong> when σ is known; it asks for σ instead of Sx.</li>
<li><strong>A: 1-PropZInt</strong> for a proportion: x = 248, n = 400, C-Level = .95 gives (.57243, .66757).</li>
</ul>
<p>Choose Data instead of Stats if your values are in a list such as L1.</p>`
    },
    {
      h2: 'Should you use z or t for a confidence interval?',
      html: `<p>Use <strong>t</strong> whenever the standard deviation comes from the same sample, which is nearly every real problem. Use <strong>z</strong> only when the population σ is known from long experience or a specification, or for proportions. The t value is larger for small samples (2.262 at n = 10, 2.045 at n = 30) and shrinks toward 1.960 as n grows, so for n above about 100 the two give almost the same interval.</p>
<p>The t interval assumes the data are roughly normal or the sample is large enough for the central limit theorem (n ≥ 30 is a common rule, though strongly skewed data need more). For small, clearly skewed samples, consider a bootstrap interval or a transformation.</p>`
    },
    {
      h2: 'What does a 95% confidence interval actually mean?',
      html: `<p>It describes the method, not one specific interval: if you drew many samples and built an interval from each, about 95% of those intervals would contain the true population mean. It does <em>not</em> mean there is a 95% probability that the true value sits inside the interval you calculated, and it does not mean 95% of individual values fall in the range. For that second idea you need a prediction or tolerance interval, which is much wider.</p>
<p>Intervals also compare groups informally: if two 95% CIs do not overlap, the difference is significant at well below 0.05, but overlapping intervals do not prove the difference is non-significant. Run a proper test with the <a href="/p-value-calculator">p-value calculator</a> to settle it.</p>`
    }
  ],
  faq: [
    { q: 'What is the z value for a 95% confidence interval?', a: 'The z critical value for 95% confidence is 1.960 (more precisely 1.95996). It is the 97.5th percentile of the standard normal distribution because 2.5% sits in each tail.' },
    { q: 'How do you calculate a 95% confidence interval from a mean and standard deviation?', a: 'Divide the standard deviation by √n to get the standard error, multiply by the critical value (t* with n − 1 df, or 1.96 if σ is known), then add and subtract that from the mean. For x̄ = 12.4, s = 1.8, n = 30: 12.4 ± 2.045 × 0.329 = 11.728 to 13.072.' },
    { q: 'What is the difference between confidence level and confidence interval?', a: 'The confidence level (90%, 95%, 99%) is how often the method captures the true value; the confidence interval is the actual range you get, such as 11.728 to 13.072.' },
    { q: 'Why is a 99% confidence interval wider than a 95% one?', a: 'To be right more often the interval has to cover more ground. The critical value grows from 1.960 to 2.576 for z, so the margin of error is about 31% larger at 99% than at 95% for the same data.' },
    { q: 'How does sample size affect a confidence interval?', a: 'The width shrinks with the square root of n. Quadrupling the sample halves the margin of error; doubling it cuts the margin by about 29%.' },
    { q: 'What does CONFIDENCE.T return in Excel?', a: 'CONFIDENCE.T returns the margin of error (half-width), not the interval. Subtract it from and add it to the sample mean to get the lower and upper limits.' },
    { q: 'How do you calculate a confidence interval for a proportion?', a: 'Use p̂ ± z* × √(p̂(1 − p̂) ÷ n). For 248 successes in 400 trials, p̂ = 0.62 and the 95% interval is 0.62 ± 0.0476, or 57.24% to 66.76%. With fewer than 10 successes or failures, use the Wilson interval instead.' },
    { q: 'Can a confidence interval include negative values?', a: 'Yes, for a mean or a difference it can. For a proportion the Wald formula can dip below 0 or above 1; this calculator clips it to 0–100% and also shows the Wilson interval, which always stays in range.' }
  ],
  related: ['margin-of-error-calculator', 't-critical-value-calculator', 'standard-deviation-calculator', 'point-estimate-calculator', 'z-score-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Confidence Limits for the Mean', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm' },
    { name: 'NIST/SEMATECH e-Handbook: What are confidence intervals?', url: 'https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Confidence intervals for a proportion', url: 'https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm' },
    { name: 'Microsoft Support: CONFIDENCE.T function', url: 'https://support.microsoft.com/en-us/excel/functions/confidence-t-function' },
    { name: 'Microsoft Support: CONFIDENCE.NORM function', url: 'https://support.microsoft.com/en-us/excel/functions/confidence-norm-function' },
    { name: 'Penn State STAT 500: Applied Statistics', url: 'https://online.stat.psu.edu/stat500/' }
  ]
};
