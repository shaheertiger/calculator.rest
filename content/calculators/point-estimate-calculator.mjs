export default {
  slug: 'point-estimate-calculator',
  hub: 'statistics',
  name: 'Point Estimate Calculator',
  title: 'Point Estimate Calculator: p̂ = 45 ÷ 120 = 0.375 (MLE, Wilson)',
  h1: 'Point Estimate Calculator: p-Hat, Sample Mean and Best Estimates',
  meta: '45 successes in 120 trials give p̂ = 0.375; the Wilson estimate is 0.3789 and Laplace 0.3770. Also find a mean, pooled proportion or an interval\'s midpoint.',
  keyword: 'how to calculate p hat',
  also: ['point estimate calculator', 'how to calculate the point estimate', 'how to calculate point estimate of population mean', 'how to calculate pooled proportion', 'how to calculate point estimate of the population mean', 'how to calculate point estimate in excel', 'p hat calculator', 'sample proportion calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Estimate', type: 'select', value: 'prop', wide: true, options: [['prop', 'Proportion p̂ from successes and trials'], ['mean', 'Population mean from sample data'], ['ci', 'Point estimate from a confidence interval'], ['pool', 'Pooled proportion of two samples']] },
    { id: 'x', label: 'Successes (x)', type: 'number', value: 45, showIf: { mode: ['prop', 'pool'] } },
    { id: 'n', label: 'Trials / sample size (n)', type: 'number', value: 120, showIf: { mode: ['prop', 'pool'] } },
    { id: 'x2', label: 'Successes in sample 2 (x₂)', type: 'number', value: 38, showIf: { mode: ['pool'] } },
    { id: 'n2', label: 'Size of sample 2 (n₂)', type: 'number', value: 100, showIf: { mode: ['pool'] } },
    { id: 'conf', label: 'Confidence level (for Wilson)', type: 'number', value: 95, suffix: '%', showIf: { mode: ['prop'] } },
    { id: 'data', label: 'Sample values', type: 'text', multiline: 4, wide: true, value: '18.2, 21.5, 19.8, 23.1, 20.4, 22.0, 19.1, 20.9', showIf: { mode: ['mean'] } },
    { id: 'lo', label: 'Lower limit', type: 'number', value: 0.31, showIf: { mode: ['ci'] } },
    { id: 'hi', label: 'Upper limit', type: 'number', value: 0.44, showIf: { mode: ['ci'] } }
  ],
  compute(v, H) {
    function f(x) { return H.fix(x, 4); }
    if (v.mode === 'ci') {
      if (!(v.lo === v.lo) || !(v.hi === v.hi)) return { error: 'Enter both limits of the interval.' };
      if (!(v.hi > v.lo)) return { error: 'The upper limit must be larger than the lower limit.' };
      var mid = (v.lo + v.hi) / 2, half = (v.hi - v.lo) / 2;
      return {
        value: H.num(mid, 6), label: 'Point estimate (midpoint of the interval)',
        expr: '(' + H.num(v.lo, 6) + ' + ' + H.num(v.hi, 6) + ') ÷ 2',
        rows: [['Margin of error', '±' + H.num(half, 6), true], ['Interval width', H.num(v.hi - v.lo, 6)]],
        sub: 'Symmetric intervals (z and t intervals for means and Wald intervals for proportions) are centered on the point estimate. Wilson and other asymmetric intervals are not, so their midpoint is not p̂.'
      };
    }
    if (v.mode === 'mean') {
      var a = H.list(v.data);
      if (a.length < 1) return { error: 'Enter at least one value.' };
      var m = H.mean(a), s = a.length > 1 ? H.sd(a, true) : NaN;
      return {
        value: 'x̄ = ' + H.num(m, 4), label: 'Point estimate of the population mean μ',
        expr: H.num(H.sum(a), 4) + ' ÷ ' + a.length,
        rows: [['Sample size n', String(a.length)], ['Sample SD s (estimate of σ)', H.num(s, 4)], ['Standard error s ÷ √n', H.num(s / Math.sqrt(a.length), 4), true], ['Median (robust alternative)', H.num(H.median(a), 4)], ['Excel', '<code>=AVERAGE(A2:A' + (a.length + 1) + ')</code>']],
        sub: 'x̄ is the unbiased point estimate of μ; s² is the unbiased estimate of σ².'
      };
    }
    var x = v.x, n = v.n;
    if (!(n > 0)) return { error: 'Enter the number of trials n.' };
    if (!(x >= 0) || x > n) return { error: 'Successes must be between 0 and n.' };
    if (v.mode === 'pool') {
      var x2 = v.x2, n2 = v.n2;
      if (!(n2 > 0)) return { error: 'Enter the size of sample 2.' };
      if (!(x2 >= 0) || x2 > n2) return { error: 'Successes in sample 2 must be between 0 and n₂.' };
      var pp = (x + x2) / (n + n2), p1 = x / n, p2 = x2 / n2;
      var se = Math.sqrt(pp * (1 - pp) * (1 / n + 1 / n2));
      return {
        value: 'p̂ = ' + f(pp), label: 'Pooled proportion',
        expr: '(' + H.num(x, 2) + ' + ' + H.num(x2, 2) + ') ÷ (' + H.num(n, 2) + ' + ' + H.num(n2, 2) + ')',
        rows: [['Sample 1 p̂₁', f(p1)], ['Sample 2 p̂₂', f(p2)], ['Difference p̂₁ − p̂₂', f(p1 - p2), true], ['Pooled standard error', f(se)], ['z for H₀: p₁ = p₂', se > 0 ? H.fix((p1 - p2) / se, 3) : '—']],
        sub: 'The pooled proportion is used for the standard error of a two-proportion z test, where the null hypothesis says both samples share one proportion.'
      };
    }
    var c = v.conf > 0 && v.conf < 100 ? v.conf : 95, z = H.normInv(1 - (1 - c / 100) / 2);
    var mle = x / n, wil = (x + z * z / 2) / (n + z * z), lap = (x + 1) / (n + 2), jef = (x + 0.5) / (n + 1);
    return {
      value: 'p̂ = ' + H.num(mle, 4), label: 'Sample proportion (maximum likelihood estimate)',
      expr: H.num(x, 2) + ' ÷ ' + H.num(n, 2),
      rows: [['As a percentage', H.pct(mle * 100, 2)], ['Wilson estimate (' + H.num(c, 2) + '%)', f(wil), true], ['Laplace estimate (x + 1) ÷ (n + 2)', f(lap)], ['Jeffreys estimate (x + 0.5) ÷ (n + 1)', f(jef)], ['q̂ = 1 − p̂', f(1 - mle)], ['Standard error √(p̂q̂ ÷ n)', f(Math.sqrt(mle * (1 - mle) / n))]],
      sub: (x === 0 || x === n) ? 'With ' + (x === 0 ? 'zero successes' : 'every trial a success') + ', p̂ = ' + H.num(mle, 0) + ' is almost certainly too extreme; the Wilson or Laplace estimate is a more realistic guess.' : n < 30 ? 'With a small sample the adjusted estimates differ noticeably from p̂; Wilson or Laplace is often the better single guess.' : 'With this many trials the four estimates are close; p̂ is the standard answer.',
      _mle: mle, _wil: wil, _lap: lap, _jef: jef
    };
  },
  quick: ({ r }) => `p-hat is the number of successes divided by the sample size: p̂ = x ÷ n. If <strong>45 of 120</strong> customers redeem a coupon, p̂ = 45 ÷ 120 = <strong>${r.value.replace('p̂ = ', '')}</strong>, or 37.5%. That is the point estimate of the population proportion. Adjusted estimates pull it slightly toward 50%: Wilson gives 0.3789 and Laplace (46 ÷ 122) gives 0.3770.`,
  stepsTitle: 'How to calculate p-hat and other point estimates',
  steps: [
    'Count the successes x: the people, items or trials with the trait you are measuring.',
    'Count the total sample size n, including the failures. Using the number of failures as n is a common slip.',
    'Divide: p̂ = x ÷ n. 45 ÷ 120 = 0.375. Report it as a decimal or percentage (37.5%).',
    'For a population mean, the point estimate is the sample mean x̄ = Σx ÷ n.',
    'If you only have a confidence interval, the point estimate is its midpoint: (lower + upper) ÷ 2.'
  ],
  formulaTitle: 'What are the point estimate formulas?',
  formula: {
    expr: 'p̂ = x ÷ n &nbsp; x̄ = Σx ÷ n<br>Wilson: (x + z²/2) ÷ (n + z²) &nbsp; Laplace: (x + 1) ÷ (n + 2) &nbsp; Jeffreys: (x + 0.5) ÷ (n + 1)<br>Pooled: p̂ = (x₁ + x₂) ÷ (n₁ + n₂) &nbsp; From a CI: (L + U) ÷ 2',
    vars: [['x', 'number of successes'], ['n', 'sample size'], ['z', 'critical value for the Wilson confidence level (1.96 at 95%)'], ['L, U', 'lower and upper confidence limits']],
    note: 'p̂ is the maximum likelihood estimate (MLE): the proportion that makes the observed data most probable. The adjusted estimators add pseudo-observations, which helps most when x is 0, n or close to either.'
  },
  example: `<p>A shop emails a coupon to 120 customers and 45 redeem it.</p>
<p>p̂ = 45 ÷ 120 = <strong>0.375</strong> (37.5%), q̂ = 0.625. Standard error = √(0.375 × 0.625 ÷ 120) = 0.0442.</p>
<p>Wilson (95%): (45 + 1.9208) ÷ (120 + 3.8415) = <strong>0.3789</strong>. Laplace: 46 ÷ 122 = <strong>0.3770</strong>. Jeffreys: 45.5 ÷ 121 = 0.3760.</p>
<p>A second campaign gets 38 of 100. Pooled p̂ = (45 + 38) ÷ (120 + 100) = 83 ÷ 220 = <strong>0.3773</strong>, the value a two-proportion z test uses for its standard error.</p>`,
  table: {
    title: 'How do p̂, Wilson, Laplace and Jeffreys estimates compare?',
    intro: 'Point estimates of a proportion for different results, computed by the calculator (Wilson at 95%). They agree for large samples and diverge for small ones or extreme counts.',
    head: ['Successes / trials', 'p̂ (MLE)', 'Wilson', 'Laplace', 'Jeffreys'],
    rows: ({ run, H }) => [[0, 10], [1, 10], [5, 10], [9, 10], [10, 10], [0, 50], [3, 50], [45, 120], [480, 1000]].map(([x, n]) => {
      const r = run({ mode: 'prop', x, n, conf: 95 });
      return [x + ' / ' + H.num(n, 0), H.fix(r._mle, 4), H.fix(r._wil, 4), H.fix(r._lap, 4), H.fix(r._jef, 4)];
    }),
    note: 'With 0 successes in 10 trials, p̂ = 0 claims the event never happens; the adjusted estimates (0.0455 to 0.1388) are more honest about what 10 trials can show.'
  },
  sections: [
    {
      h2: 'How do you calculate a point estimate of the population mean?',
      html: `<p>Add the sample values and divide by how many there are. For eight bolt lengths of 18.2, 21.5, 19.8, 23.1, 20.4, 22.0, 19.1 and 20.9 mm, x̄ = 165 ÷ 8 = <strong>20.625 mm</strong>. That single number is the point estimate of μ, the mean of every bolt the machine makes. Its standard error, s ÷ √n, says how far x̄ typically lands from μ: 1.5944 ÷ √8 = 0.5637 mm here.</p>
<p>Likewise, the sample standard deviation s (dividing by n − 1) is the point estimate of σ, and s² is the unbiased estimate of σ². Switch the calculator to "Population mean from sample data" to get all three. For a mean, median, mode and range of any list, the <a href="/average-calculator">average calculator</a> is quicker.</p>`
    },
    {
      h2: 'How do you calculate a point estimate in Excel?',
      html: `<ul>
<li>Proportion from counts: <code>=45/120</code>, or from raw answers in A2:A121, <code>=COUNTIF(A2:A121,"Yes")/COUNTA(A2:A121)</code>.</li>
<li>Mean: <code>=AVERAGE(A2:A9)</code>; standard deviation: <code>=STDEV.S(A2:A9)</code>.</li>
<li>Wilson estimate at 95%: <code>=(B1+NORM.S.INV(0.975)^2/2)/(B2+NORM.S.INV(0.975)^2)</code> with x in B1 and n in B2.</li>
<li>From an interval in D1:D2: <code>=AVERAGE(D1:D2)</code> gives the point estimate and <code>=(D2-D1)/2</code> the margin of error.</li>
</ul>
<p>Google Sheets uses the same formulas.</p>`
    },
    {
      h2: 'Which point estimate of a proportion is best?',
      html: `<p>For most problems, and every intro-statistics homework, the answer is <strong>p̂ = x ÷ n</strong>. It's unbiased and it's what confidence intervals and hypothesis tests are built around.</p>
<p>The adjusted estimators earn their place with small samples or results near 0% or 100%. If 0 of 10 users hit a bug, p̂ = 0 says the bug never happens, which nobody believes. Laplace's rule of succession, (x + 1) ÷ (n + 2), adds one imaginary success and one failure; Jeffreys adds half of each; Wilson centers on the middle of the Wilson score interval and shrinks harder toward 50% at higher confidence. Usability researchers often report Wilson or Laplace for small task-completion samples for this reason. Once n reaches the hundreds, all four agree to two or three decimals.</p>`
    },
    {
      h2: 'How do you calculate a pooled proportion?',
      html: `<p>Add the successes from both samples and divide by the combined sample size: p̂ = (x₁ + x₂) ÷ (n₁ + n₂). For 45 of 120 and 38 of 100, that's 83 ÷ 220 = <strong>0.3773</strong>. Note that it isn't the simple average of 0.375 and 0.38; larger samples get more weight.</p>
<p>The pooled value goes into the standard error of a two-proportion z test, √(p̂(1 − p̂)(1/n₁ + 1/n₂)), because the null hypothesis assumes both groups share one true proportion. For a confidence interval for the difference you use the unpooled standard error instead. To turn p̂ into an interval, use the <a href="/confidence-interval-calculator">confidence interval calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is p-hat in statistics?', a: 'p-hat (p̂) is the sample proportion: the number of successes divided by the sample size. It is the point estimate of the unknown population proportion p.' },
    { q: 'What is the difference between a point estimate and an interval estimate?', a: 'A point estimate is a single best guess, such as p̂ = 0.375. An interval estimate gives a range likely to contain the true value, such as 0.288 to 0.462 at 95% confidence, and shows how uncertain the guess is.' },
    { q: 'How do you find the point estimate from a confidence interval?', a: 'Add the two limits and divide by 2. A 95% interval of 0.31 to 0.44 has a point estimate of 0.375 and a margin of error of 0.065.' },
    { q: 'What is q-hat?', a: 'q-hat is 1 − p̂, the sample proportion of failures. For 45 successes in 120 trials, q̂ = 0.625.' },
    { q: 'Is the sample mean an unbiased estimator?', a: 'Yes. The sample mean x̄ is an unbiased point estimate of the population mean μ: averaged over many samples it equals μ. The sample variance is unbiased only when you divide by n − 1.' },
    { q: 'Can p-hat be greater than 1?', a: 'No. Successes can never exceed the sample size, so p̂ is always between 0 and 1 (0% to 100%). A value above 1 means x and n were swapped.' },
    { q: 'What is the best point estimate for a population standard deviation?', a: 'The sample standard deviation s, calculated with n − 1 in the denominator (Excel STDEV.S). It is the conventional estimate of σ, although s is very slightly biased low for small samples.' }
  ],
  related: ['confidence-interval-calculator', 'margin-of-error-calculator', 'standard-deviation-calculator', 'average-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Confidence intervals for a proportion', url: 'https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Measures of Location', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm' },
    { name: 'Microsoft Support: AVERAGE function', url: 'https://support.microsoft.com/en-us/excel/functions/average-function' },
    { name: 'Penn State STAT 415: Introduction to Mathematical Statistics', url: 'https://online.stat.psu.edu/stat415/' }
  ]
};
