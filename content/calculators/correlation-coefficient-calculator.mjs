export default {
  slug: 'correlation-coefficient-calculator',
  hub: 'statistics',
  name: 'Correlation Coefficient Calculator',
  title: 'Correlation Coefficient Calculator: r = 0.821, p = 0.004',
  h1: 'Pearson Correlation Coefficient Calculator With Significance Test',
  meta: 'Ten students\' study hours and exam scores give Pearson r = 0.821 (t = 4.07, p = 0.0036). Paste paired data for r, Spearman rho, p-value and a 95% CI.',
  keyword: 'how to calculate correlation coefficient in excel',
  also: ['correlation coefficient calculator', 'pearson correlation calculator', 'how to calculate correlation coefficient', 'spearman rank correlation calculator', 'how to calculate pearson r', 'correlation significance calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'xs', label: 'X values (e.g. hours studied)', type: 'text', multiline: 4, value: '2, 3, 5, 1, 4, 6, 7, 8, 3, 5', placeholder: 'One number per pair, in order' },
    { id: 'ys', label: 'Y values (e.g. exam score)', type: 'text', multiline: 4, value: '65, 74, 70, 62, 78, 85, 76, 90, 60, 81', placeholder: 'Same order and count as X' },
    { id: 'method', label: 'Coefficient', type: 'select', value: 'pearson', options: [['pearson', 'Pearson r (linear)'], ['spearman', 'Spearman ρ (rank)']] },
    { id: 'alpha', label: 'Significance level α', type: 'number', value: 0.05 }
  ],
  compute(v, H) {
    var x = H.list(v.xs), y = H.list(v.ys);
    if (x.length !== y.length) return { error: 'X has ' + x.length + ' values and Y has ' + y.length + '. Every X needs a matching Y.' };
    var n = x.length;
    if (n < 3) return { error: 'Enter at least 3 pairs.' };
    function ranks(a) {
      var idx = a.map(function (val, i) { return [val, i]; }).sort(function (p, q) { return p[0] - q[0]; });
      var out = new Array(a.length), i = 0;
      while (i < idx.length) {
        var j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
        for (var k = i; k <= j; k++) out[idx[k][1]] = (i + j) / 2 + 1;
        i = j + 1;
      }
      return out;
    }
    var sp = v.method === 'spearman';
    var r = sp ? H.pearson(ranks(x), ranks(y)) : H.pearson(x, y);
    if (!(r === r)) return { error: 'One of the lists has no variation (all values equal), so r is undefined.' };
    var a = v.alpha > 0 && v.alpha < 1 ? v.alpha : 0.05, df = n - 2;
    var t = Math.abs(r) >= 1 ? Infinity : r * Math.sqrt(df) / Math.sqrt(1 - r * r);
    var p = isFinite(t) ? 2 * H.tCdf(-Math.abs(t), df) : 0;
    var ar = Math.abs(r);
    var strength = ar < 0.1 ? 'negligible' : ar < 0.3 ? 'weak' : ar < 0.5 ? 'moderate' : 'strong';
    var dir = r > 0 ? 'positive' : r < 0 ? 'negative' : 'no';
    var rows = [
      ['Strength', strength + ' ' + dir + ' relationship', true],
      ['t statistic (df ' + df + ')', isFinite(t) ? H.fix(t, 3) : '∞'],
      ['p-value (two-tailed)', p < 0.0001 ? H.sig(p, 3) : H.fix(p, 4), true],
      ['Shared variance r²', H.pct(r * r * 100, 1)],
      ['Pairs n', String(n)]
    ];
    if (n > 3 && ar < 1) {
      var fz = 0.5 * Math.log((1 + r) / (1 - r)), se = 1 / Math.sqrt(n - 3), zc = H.normInv(1 - a / 2);
      rows.push([H.num((1 - a) * 100, 2) + '% CI for ' + (sp ? 'ρ' : 'r') + ' (Fisher z)', H.fix(Math.tanh(fz - zc * se), 3) + ' to ' + H.fix(Math.tanh(fz + zc * se), 3)]);
    }
    var tc = H.tInv(1 - a / 2, df);
    rows.push(['Critical |r| at α = ' + H.num(a, 4), H.fix(tc / Math.sqrt(tc * tc + df), 3)]);
    rows.push(['Excel', '<code>=' + (sp ? 'CORREL(RANK.AVG(…),RANK.AVG(…))' : 'CORREL(A2:A' + (n + 1) + ',B2:B' + (n + 1) + ')') + '</code>']);
    return {
      value: (sp ? 'ρ = ' : 'r = ') + H.fix(r, 4), label: sp ? 'Spearman rank correlation' : 'Pearson correlation coefficient',
      expr: 't = ' + H.fix(r, 4) + ' × √' + df + ' ÷ √(1 − ' + H.fix(r * r, 4) + ')',
      rows: rows,
      sub: p < a ? 'The correlation is statistically significant at α = ' + H.num(a, 4) + ' (p = ' + (p < 0.0001 ? H.sig(p, 3) : H.fix(p, 4)) + '). That shows association, not cause and effect.' : 'Not statistically significant at α = ' + H.num(a, 4) + ': a correlation this size could plausibly arise by chance with ' + n + ' pairs.',
      _r: r, _p: p
    };
  },
  quick: ({ r }) => `To calculate a correlation coefficient in Excel, use <code>=CORREL(A2:A11,B2:B11)</code> on two equal-length columns. For 10 students' hours studied and exam scores, Pearson <strong>${r.value}</strong>: a strong positive link. With 8 degrees of freedom, t = 0.8212 × √8 ÷ √(1 − 0.6744) = 4.071, giving <strong>p = 0.0036</strong>, so the correlation is significant at the 5% level.`,
  stepsTitle: 'How to calculate the Pearson correlation coefficient',
  steps: [
    'Line up the data in pairs: each X must sit next to the Y measured on the same person or item. Mismatched or sorted columns are the classic mistake and silently produce a wrong r.',
    'Find the means x̄ and ȳ, then each pair\'s deviations (x − x̄) and (y − ȳ).',
    'Multiply the deviations pair by pair and add them (S<sub>xy</sub>). Separately add the squared x deviations (S<sub>xx</sub>) and squared y deviations (S<sub>yy</sub>).',
    'Divide: r = S<sub>xy</sub> ÷ √(S<sub>xx</sub> × S<sub>yy</sub>). The result is always between −1 and +1.',
    'Test significance with t = r√(n − 2) ÷ √(1 − r²) on n − 2 degrees of freedom.'
  ],
  formulaTitle: 'What is the correlation coefficient formula?',
  formula: {
    expr: 'r = Σ(x − x̄)(y − ȳ) ÷ √[Σ(x − x̄)² × Σ(y − ȳ)²]<br>t = r√(n − 2) ÷ √(1 − r²), df = n − 2<br>Spearman ρ = Pearson r computed on the ranks',
    vars: [['x̄, ȳ', 'means of the X and Y lists'], ['n', 'number of pairs'], ['t', 'test statistic for H₀: no correlation (ρ = 0)']],
    note: 'Tied values get the average of the ranks they span (Excel RANK.AVG), which is how this calculator computes Spearman\'s ρ.'
  },
  example: `<p>Hours studied (X): 2, 3, 5, 1, 4, 6, 7, 8, 3, 5. Exam score (Y): 65, 74, 70, 62, 78, 85, 76, 90, 60, 81.</p>
<p>x̄ = 4.4 and ȳ = 74.1. S<sub>xy</sub> = 162.6, S<sub>xx</sub> = 44.4, S<sub>yy</sub> = 882.9.</p>
<p>r = 162.6 ÷ √(44.4 × 882.9) = 162.6 ÷ 197.99 = <strong>0.8212</strong>.</p>
<p>t = 0.8212 × √8 ÷ √(1 − 0.6744) = <strong>4.071</strong> with 8 df, so p = <strong>0.0036</strong>. Study time and score are strongly, significantly correlated, and r² says 67.4% of the variation in scores moves with study time.</p>`,
  table: {
    title: 'How big does r need to be to be significant?',
    intro: 'Critical values of Pearson r for a two-tailed test, computed from the t distribution (r = t ÷ √(t² + n − 2)). Your |r| must exceed the value for your sample size.',
    head: ['Pairs (n)', 'α = 0.10', 'α = 0.05', 'α = 0.01'],
    rows: ({ H }) => [5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 40, 50, 100].map(n => {
      const df = n - 2, c = a => { const t = H.tInv(1 - a / 2, df); return H.fix(t / Math.sqrt(t * t + df), 3); };
      return [String(n), c(0.1), c(0.05), c(0.01)];
    }),
    note: 'With 10 pairs you need |r| > 0.632 for p < 0.05; with 100 pairs, |r| > 0.197 is enough. Large samples make even weak correlations significant.'
  },
  sections: [
    {
      h2: 'How do you calculate the correlation coefficient in Excel?',
      html: `<p>Put X in column A and Y in column B, then use <code>=CORREL(A2:A11,B2:B11)</code>. <code>=PEARSON(A2:A11,B2:B11)</code> gives the identical result; it's kept for compatibility. Both ignore rows where a cell contains text, but they return #N/A if the ranges have different sizes.</p>
<p>For several variables at once, turn on the Analysis ToolPak (File → Options → Add-ins), then choose <strong>Data → Data Analysis → Correlation</strong> and select all the columns. Excel prints a correlation matrix with every pairwise r. It does not print p-values; get those with <code>=T.DIST.2T(ABS(r*SQRT(n-2)/SQRT(1-r^2)),n-2)</code>.</p>
<p>For Spearman's ρ, rank each column with <code>=RANK.AVG(A2,$A$2:$A$11,1)</code> and run CORREL on the rank columns. Google Sheets uses the same CORREL, PEARSON and RANK.AVG functions.</p>`
    },
    {
      h2: 'How do you find r on a TI-84?',
      html: `<p>The TI-84 hides r until you switch diagnostics on, once:</p>
<ol>
<li>Press <strong>2nd 0</strong> (CATALOG), scroll to <strong>DiagnosticOn</strong>, press Enter twice. (On TI-84 Plus CE models with newer OS versions, set STAT DIAGNOSTICS to ON in the MODE screen instead.)</li>
<li>Enter X in L1 and Y in L2 with <strong>STAT → 1:Edit</strong>.</li>
<li>Press <strong>STAT → CALC → 8:LinReg(a+bx)</strong>, set Xlist L1 and Ylist L2, and Calculate.</li>
</ol>
<p>The output lists a, b, r² and r; for the example r = .8212. For a significance test, use <strong>STAT → TESTS → LinRegTTest</strong>, which also returns t and p.</p>`
    },
    {
      h2: 'Pearson or Spearman: which correlation should you use?',
      html: `<p><strong>Pearson's r</strong> measures how closely the points follow a straight line. It assumes both variables are numeric, the relationship is linear, and there are no extreme outliers. One wild point can push r up or down by 0.3 or more in a small sample.</p>
<p><strong>Spearman's ρ</strong> correlates the ranks instead of the values, so it measures any steadily increasing or decreasing (monotonic) relationship and resists outliers. Use it for ordinal data such as Likert ratings or rankings, or when a scatter plot curves but never changes direction. For the example data Spearman's ρ = 0.799, close to Pearson's 0.821, because the trend is nearly linear.</p>
<p>Always look at a scatter plot. Anscombe's quartet is four data sets with the same r (0.816) that look completely different: a line, a curve, a line with one outlier, and a vertical cluster with one far point.</p>`
    },
    {
      h2: 'What does a correlation coefficient not tell you?',
      html: `<ul>
<li><strong>Cause and effect.</strong> Ice cream sales and drownings are correlated because both rise in summer. A third variable, reverse causation or coincidence can all produce a strong r.</li>
<li><strong>The size of the effect in real units.</strong> r = 0.82 doesn't say how many points each extra hour of study adds. That's the slope of a regression line; the <a href="/r-squared-calculator">R-squared calculator</a> fits the line and reports R² and adjusted R².</li>
<li><strong>Curved relationships.</strong> A perfect U-shape can have r = 0.</li>
<li><strong>Anything outside the range you measured.</strong> A correlation across 1 to 8 hours of study says nothing about 20 hours.</li>
</ul>`
    }
  ],
  faq: [
    { q: 'What is a strong correlation coefficient?', a: 'A common guide (based on Cohen) treats |r| around 0.1 as weak, 0.3 as moderate and 0.5 or more as strong. In physical sciences, r below 0.9 can be disappointing; in social science, r = 0.3 is often meaningful.' },
    { q: 'What does a negative correlation coefficient mean?', a: 'A negative r means Y tends to fall as X rises, such as car age and resale price. The strength is judged by the absolute value, so r = −0.8 is as strong as r = +0.8.' },
    { q: 'Is CORREL the same as PEARSON in Excel?', a: 'Yes. CORREL and PEARSON return the same Pearson product-moment correlation coefficient for the same two ranges.' },
    { q: 'How do I get R squared from r?', a: 'Square it. r = 0.8212 gives r² = 0.674, meaning 67.4% of the variance in Y is shared with X. That only holds for a single predictor; with several predictors use the regression R².' },
    { q: 'How many data points do I need for a correlation?', a: 'At least 3 to compute r, but with fewer than about 10 pairs only very large correlations reach significance (|r| > 0.632 at n = 10). Aim for 30 or more to estimate r with useful precision.' },
    { q: 'Can the correlation coefficient be greater than 1?', a: 'No. Pearson r is always between −1 and +1. A value outside that range means a calculation error, often mismatched or misaligned columns.' },
    { q: 'What is the p-value for a correlation?', a: 'It tests whether the population correlation could be zero. Compute t = r√(n − 2) ÷ √(1 − r²) and find the two-tailed area under the t distribution with n − 2 df. For r = 0.8212 and n = 10, p = 0.0036.' }
  ],
  related: ['r-squared-calculator', 'p-value-calculator', 'standard-deviation-calculator', 't-critical-value-calculator'],
  sources: [
    { name: 'Microsoft Support: CORREL function', url: 'https://support.microsoft.com/en-us/excel/functions/correl-function' },
    { name: 'Microsoft Support: PEARSON function', url: 'https://support.microsoft.com/en-us/excel/functions/pearson-function' },
    { name: 'NIST/SEMATECH e-Handbook: Scatter Plot', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda33q.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Critical Values of the Student\'s t Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm' },
    { name: 'Penn State STAT 501: Regression Methods', url: 'https://online.stat.psu.edu/stat501/' }
  ]
};
