export default {
  slug: 'p-value-calculator',
  hub: 'statistics',
  name: 'P-Value Calculator',
  title: 'P-Value Calculator: t = 2.25 With 20 df Gives p = 0.0359',
  h1: 'P-Value Calculator for z, t, Chi-Square and F Statistics',
  meta: 'A t statistic of 2.25 with 20 degrees of freedom has a two-tailed p-value of 0.0359. Get p from z, t, χ² or F, one or two tailed, plus the Excel formula.',
  keyword: 'how do you calculate p value',
  also: ['how to calculate p-value in excel', 'how to calculate p value using excel', 'how to calculate p value from z score', 'how to calculate p value from excel', 'how do you calculate the p value', 'how to calculate p value in r', 'how to calculate a p value in excel', 'how to calculate p value in excel t test', 'how to calculate p value from f statistic', 'how to calculate t test p value in excel', 'how to calculate p value from f test', 'how to calculate p value for f test', 'how to calculate p value on excel', 'how to calculate p value in google sheets', 'p value calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'test', label: 'Test statistic', type: 'select', value: 't', options: [['z', 'z score (normal)'], ['t', 't statistic'], ['chi', 'Chi-square (χ²)'], ['f', 'F statistic (ANOVA, regression)']] },
    { id: 'stat', label: 'Value of the statistic', type: 'number', value: 2.25 },
    { id: 'df', label: 'Degrees of freedom (df1 for F)', type: 'number', value: 20, showIf: { test: ['t', 'chi', 'f'] } },
    { id: 'df2', label: 'Denominator df (df2)', type: 'number', value: 27, showIf: { test: ['f'] } },
    { id: 'tails', label: 'Alternative hypothesis', type: 'select', value: 'two', options: [['two', 'Two-tailed (≠)'], ['right', 'Right-tailed (>)'], ['left', 'Left-tailed (<)']] },
    { id: 'alpha', label: 'Significance level α', type: 'number', value: 0.05 }
  ],
  compute(v, H) {
    var s = v.stat, test = v.test, df = v.df, d2 = v.df2;
    if (!(s === s)) return { error: 'Enter the test statistic.' };
    if (test !== 'z' && !(df > 0)) return { error: 'Enter the degrees of freedom (above 0).' };
    if (test === 'f' && !(d2 > 0)) return { error: 'Enter the denominator degrees of freedom.' };
    if ((test === 'chi' || test === 'f') && s < 0) return { error: 'Chi-square and F statistics cannot be negative.' };
    var a = v.alpha > 0 && v.alpha < 1 ? v.alpha : 0.05;
    var left, right, crit, xl, name;
    if (test === 'z') { left = H.normCdf(s); right = H.normCdf(-s); name = 'z'; }
    else if (test === 't') { left = H.tCdf(s, df); right = H.tCdf(-s, df); name = 't'; }
    else if (test === 'chi') { left = H.chi2Cdf(s, df); right = 1 - left; name = 'χ²'; }
    else { left = H.fCdf(s, df, d2); right = 1 - left; name = 'F'; }
    var p = v.tails === 'left' ? left : v.tails === 'right' ? right : Math.min(1, 2 * Math.min(left, right));
    p = Math.max(0, p);
    var sym = test === 'z' || test === 't';
    var inv = function (q) {
      if (test === 'z') return H.normInv(q);
      if (test === 't') return H.tInv(q, df);
      if (test === 'chi') return H.chi2Inv(q, df);
      return H.solve(function (x) { return H.fCdf(x, df, d2) - q; }, 0, 1e5);
    };
    if (v.tails === 'two') crit = sym ? '±' + H.fix(inv(1 - a / 2), 3) : H.fix(inv(a / 2), 3) + ' and ' + H.fix(inv(1 - a / 2), 3);
    else if (v.tails === 'right') crit = H.fix(inv(1 - a), 3);
    else crit = H.fix(inv(a), 3);
    var S = String(Number(s.toFixed(4))), D = String(Number((df || 0).toFixed(2))), D2 = String(Number((d2 || 0).toFixed(2)));
    if (test === 'z') xl = v.tails === 'two' ? '=2*(1-NORM.S.DIST(ABS(' + S + '),TRUE))' : v.tails === 'right' ? '=1-NORM.S.DIST(' + S + ',TRUE)' : '=NORM.S.DIST(' + S + ',TRUE)';
    else if (test === 't') xl = v.tails === 'two' ? '=T.DIST.2T(ABS(' + S + '),' + D + ')' : v.tails === 'right' ? '=T.DIST.RT(' + S + ',' + D + ')' : '=T.DIST(' + S + ',' + D + ',TRUE)';
    else if (test === 'chi') xl = v.tails === 'right' ? '=CHISQ.DIST.RT(' + S + ',' + D + ')' : v.tails === 'left' ? '=CHISQ.DIST(' + S + ',' + D + ',TRUE)' : '=2*MIN(CHISQ.DIST(' + S + ',' + D + ',TRUE),CHISQ.DIST.RT(' + S + ',' + D + '))';
    else xl = v.tails === 'right' ? '=F.DIST.RT(' + S + ',' + D + ',' + D2 + ')' : v.tails === 'left' ? '=F.DIST(' + S + ',' + D + ',' + D2 + ',TRUE)' : '=2*MIN(F.DIST(' + S + ',' + D + ',' + D2 + ',TRUE),F.DIST.RT(' + S + ',' + D + ',' + D2 + '))';
    var pf = p < 0.0001 ? H.sig(p, 3) : H.fix(p, 4);
    var sig = p < a;
    var dfTxt = test === 'z' ? '' : test === 'f' ? ' (df ' + D + ', ' + D2 + ')' : ' (df ' + D + ')';
    return {
      value: 'p = ' + pf,
      label: (v.tails === 'two' ? 'Two-tailed' : v.tails === 'right' ? 'Right-tailed' : 'Left-tailed') + ' p-value for ' + name + ' = ' + S + dfTxt,
      expr: v.tails === 'two' ? '2 × P(' + name + ' ' + (s >= 0 || !sym ? '≥' : '≤') + ' ' + S + ')' : 'P(' + name + (v.tails === 'right' ? ' ≥ ' : ' ≤ ') + S + ')',
      rows: [
        ['Decision at α = ' + H.num(a, 4), sig ? 'Reject H₀ (p < α)' : 'Fail to reject H₀ (p ≥ α)', true],
        ['Critical value at α', crit],
        ['Area to the left', left < 0.0001 ? H.sig(left, 3) : H.fix(left, 4)],
        ['Area to the right', right < 0.0001 ? H.sig(right, 3) : H.fix(right, 4)],
        ['Excel / Google Sheets', '<code>' + xl + '</code>']
      ],
      sub: sig ? 'A result at least this extreme would happen ' + H.pct(p * 100, 2) + ' of the time if the null hypothesis were true, which is below your ' + H.num(a * 100, 2) + '% threshold: statistically significant.' : 'A result at least this extreme would happen ' + H.pct(p * 100, 2) + ' of the time if the null hypothesis were true, which is not below your ' + H.num(a * 100, 2) + '% threshold: not statistically significant.',
      _p: p
    };
  },
  quick: ({ r }) => `A p-value is the probability of getting a test statistic at least as extreme as yours if the null hypothesis is true. For <strong>t = 2.25 with 20 degrees of freedom</strong>, the area beyond 2.25 in one tail is 0.0179, so the two-tailed p-value is <strong>${r.value.replace('p = ', '')}</strong>. That is below 0.05, so the result is significant. In Excel: <code>=T.DIST.2T(2.25,20)</code>.`,
  stepsTitle: 'How to calculate a p-value in 4 steps',
  steps: [
    'Compute the test statistic from your data: z or t for means, χ² for counts, F for ANOVA or regression. (The <a href="/chi-square-calculator">chi-square calculator</a> and <a href="/correlation-coefficient-calculator">correlation calculator</a> do this step for you.)',
    'Note the degrees of freedom: n − 1 for a one-sample t test, n₁ + n₂ − 2 for a pooled two-sample t test, (rows − 1)(columns − 1) for a chi-square table, and k − 1 and N − k for one-way ANOVA.',
    'Pick the tail that matches the alternative hypothesis <em>before</em> looking at the data. "Different from" is two-tailed; "greater than" is right-tailed. Choosing one tail after seeing the direction halves the p-value and is the most common misuse.',
    'Find the area under the distribution beyond your statistic (double it for two tails) and compare it with α. If p < α, reject the null hypothesis.'
  ],
  formulaTitle: 'What is the formula for a p-value?',
  formula: {
    expr: 'Right-tailed: p = P(T ≥ t) = 1 − CDF(t)<br>Left-tailed: p = P(T ≤ t) = CDF(t)<br>Two-tailed (z, t): p = 2 × P(T ≥ |t|)',
    vars: [['T', 'random variable that follows the test distribution under H₀'], ['t', 'the statistic you observed'], ['CDF', 'cumulative distribution function (normal, Student\'s t, χ² or F)']],
    note: 'Chi-square goodness-of-fit, independence and ANOVA F tests are right-tailed by design: only large values count as evidence against H₀. The two-tailed option for χ² and F doubles the smaller tail, which is what a test of a variance ratio needs.'
  },
  example: `<p>A one-sample t test on 21 measurements gives t = 2.25. Degrees of freedom = 21 − 1 = <strong>20</strong>.</p>
<p>Area to the right of 2.25 under the t distribution with 20 df = <strong>0.0179</strong>.</p>
<p>Two-tailed p = 2 × 0.0179 = <strong>0.0359</strong>. Since 0.0359 < 0.05, reject H₀ at the 5% level (but not at 1%).</p>
<p>If the same 2.25 were a z score, the two-tailed p-value would be 2 × 0.0122 = <strong>0.0244</strong>; the t distribution's heavier tails give a larger p.</p>`,
  table: {
    title: 'What p-value goes with common z and t values?',
    intro: 'P-values for frequently used test statistics, calculated with the tool above. Compare the z column with the t columns to see how small samples raise the p-value.',
    head: ['Statistic', 'z one-tailed', 'z two-tailed', 't two-tailed, 10 df', 't two-tailed, 30 df'],
    rows: ({ run, H }) => [1, 1.282, 1.5, 1.645, 1.96, 2, 2.326, 2.5, 2.576, 3, 3.291].map(s => {
      const f = p => p < 0.0001 ? H.sig(p, 2) : H.fix(p, 4);
      return [String(s), f(run({ test: 'z', stat: s, tails: 'right' })._p), f(run({ test: 'z', stat: s, tails: 'two' })._p), f(run({ test: 't', stat: s, df: 10, tails: 'two' })._p), f(run({ test: 't', stat: s, df: 30, tails: 'two' })._p)];
    }),
    note: 'z = 1.645 is the one-tailed 5% cutoff, 1.96 the two-tailed 5% cutoff and 2.576 the two-tailed 1% cutoff.'
  },
  sections: [
    {
      h2: 'How do you calculate a p-value from a z score?',
      html: `<p>Look up the cumulative probability Φ(z) from the standard normal distribution, then take the tail your hypothesis points to:</p>
<ul>
<li>Left-tailed: p = Φ(z).</li>
<li>Right-tailed: p = 1 − Φ(z).</li>
<li>Two-tailed: p = 2 × (1 − Φ(|z|)).</li>
</ul>
<p>For z = 2.25, Φ(2.25) = 0.9878, so the right tail is 0.0122 and the two-tailed p-value is <strong>0.0244</strong>. On a TI-84, press <strong>2nd VARS</strong> (DISTR), choose <strong>normalcdf(</strong> and enter <code>normalcdf(2.25, 1E99, 0, 1)</code> for the right tail; multiply by 2 for two tails. In Excel, <code>=2*(1-NORM.S.DIST(2.25,TRUE))</code> returns 0.0244. To get z itself from a raw score, use the <a href="/z-score-calculator">z-score calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate a p-value in Excel and Google Sheets?',
      html: `<p>Match the function to your statistic. All of these work identically in Google Sheets:</p>
<div class="twrap"><table><thead><tr><th>You have</th><th>Two-tailed</th><th>Right-tailed</th></tr></thead><tbody>
<tr><td>z score</td><td><code>=2*(1-NORM.S.DIST(ABS(z),TRUE))</code></td><td><code>=1-NORM.S.DIST(z,TRUE)</code></td></tr>
<tr><td>t statistic</td><td><code>=T.DIST.2T(ABS(t),df)</code></td><td><code>=T.DIST.RT(t,df)</code></td></tr>
<tr><td>Chi-square</td><td>(not used)</td><td><code>=CHISQ.DIST.RT(x,df)</code></td></tr>
<tr><td>F statistic</td><td>(not used)</td><td><code>=F.DIST.RT(F,df1,df2)</code></td></tr>
</tbody></table></div>
<p>T.DIST.2T returns #NUM! for a negative t, which is why the ABS() wrapper matters. If you have the raw data instead of a statistic, <code>=T.TEST(A2:A21,B2:B21,2,3)</code> returns the p-value directly: the third argument is tails (1 or 2) and the fourth is the type (1 = paired, 2 = two-sample equal variance, 3 = two-sample unequal variance, also called Welch). The Analysis ToolPak's t-Test tools print the same number as "P(T&lt;=t) two-tail", and its ANOVA tool prints a "P-value" column next to F.</p>`
    },
    {
      h2: 'How do you calculate a p-value from an F statistic?',
      html: `<p>An F test (ANOVA, regression, comparing two variances) uses the right tail of the F distribution with two degrees of freedom: df1 for the numerator (groups − 1, or the number of predictors) and df2 for the denominator (total N − groups, or n − predictors − 1). Three groups of 10 give df1 = 2 and df2 = 27. If F = 4.20, the p-value is the area to the right: <code>=F.DIST.RT(4.2,2,27)</code> = <strong>0.0258</strong>, so at least one group mean differs at α = 0.05.</p>
<p>Select "F statistic" above, enter both df values and leave the tail on right-tailed. On a TI-84 use <code>Fcdf(4.2, 1E99, 2, 27)</code>.</p>`
    },
    {
      h2: 'How do you calculate a p-value in R?',
      html: `<p>Use the distribution functions with <code>lower.tail = FALSE</code> for the upper tail:</p>
<ul>
<li>z: <code>2 * pnorm(-abs(2.25))</code> → 0.0244</li>
<li>t: <code>2 * pt(-abs(2.25), df = 20)</code> → 0.0359</li>
<li>χ²: <code>pchisq(7.81, df = 3, lower.tail = FALSE)</code> → 0.0501</li>
<li>F: <code>pf(4.2, 2, 27, lower.tail = FALSE)</code> → 0.0258</li>
</ul>
<p>Functions such as <code>t.test()</code>, <code>chisq.test()</code> and <code>summary(aov())</code> print the p-value in their output, so you only need these when you start from a statistic.</p>`
    },
    {
      h2: 'What does a p-value tell you, and what doesn\'t it?',
      html: `<p>A p-value of 0.036 means: if the null hypothesis were exactly true, a statistic this far from zero would turn up about 3.6% of the time by chance. Small values are evidence against the null.</p>
<p>It is <strong>not</strong> the probability that the null hypothesis is true, not the chance your result is a fluke, and not a measure of effect size. A tiny, unimportant difference can produce p < 0.001 with a big enough sample, and a large real effect can miss 0.05 in a small study. The American Statistical Association's 2016 statement makes the same points and recommends reporting effect sizes and confidence intervals (see the <a href="/confidence-interval-calculator">confidence interval calculator</a>) next to the p-value instead of a bare "significant / not significant".</p>
<p>The 0.05 threshold is a convention, not a law. Physics discoveries use 5 sigma (p ≈ 3 × 10⁻⁷); some fields now ask for 0.005.</p>`
    }
  ],
  faq: [
    { q: 'Is a p-value of 0.05 significant?', a: 'Strictly, a test is significant when p is less than α, so p = 0.050 exactly sits on the boundary and is usually reported as not significant at α = 0.05. In practice, report the exact value and let readers judge.' },
    { q: 'What is the difference between one-tailed and two-tailed p-values?', a: 'A two-tailed p-value counts extreme results in both directions and, for z and t, is double the one-tailed value. Use one tail only if a result in the other direction would be treated the same as no effect, and decide that before seeing the data.' },
    { q: 'What p-value does a z score of 1.96 give?', a: 'z = 1.96 gives a two-tailed p-value of 0.0500 and a one-tailed p-value of 0.0250.' },
    { q: 'Can a p-value be greater than 1 or negative?', a: 'No. A p-value is a probability, so it is always between 0 and 1. If a formula returns more than 1, you probably doubled a tail that was already larger than 0.5.' },
    { q: 'What does p < 0.001 mean?', a: 'It means the observed result would occur less than 1 time in 1,000 under the null hypothesis. Most journals report very small values as p < 0.001 rather than printing every decimal.' },
    { q: 'How do I get a p-value from a t-test in Excel?', a: 'With raw data use =T.TEST(range1,range2,2,type) for a two-tailed test. With a t statistic you already calculated, use =T.DIST.2T(ABS(t),df).' },
    { q: 'Why is my p-value different from my textbook?', a: 'Tables give only bounds (for example 0.02 < p < 0.05) and round the statistic. Software gives the exact area, so small differences in the third or fourth decimal place are expected.' },
    { q: 'What is the p-value for a chi-square of 3.841 with 1 df?', a: 'Chi-square = 3.841 with 1 degree of freedom has a p-value of 0.0500, the familiar 5% critical value. It is the square of z = 1.96.' }
  ],
  related: ['t-critical-value-calculator', 'z-score-calculator', 'chi-square-calculator', 'confidence-interval-calculator', 'correlation-coefficient-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Critical values and p values', url: 'https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm' },
    { name: 'NIST/SEMATECH e-Handbook: t Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3664.htm' },
    { name: 'NIST/SEMATECH e-Handbook: F Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3665.htm' },
    { name: 'Microsoft Support: T.DIST.2T function', url: 'https://support.microsoft.com/en-us/excel/functions/t-dist-2t-function' },
    { name: 'Microsoft Support: T.TEST function', url: 'https://support.microsoft.com/en-us/excel/functions/t-test-function' },
    { name: 'Microsoft Support: F.DIST.RT function', url: 'https://support.microsoft.com/en-us/excel/functions/f-dist-rt-function' },
    { name: 'American Statistical Association: Statement on Statistical Significance and P-Values (2016)', url: 'https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf' }
  ]
};
