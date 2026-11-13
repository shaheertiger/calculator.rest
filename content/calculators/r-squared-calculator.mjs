export default {
  slug: 'r-squared-calculator',
  hub: 'statistics',
  name: 'R-Squared Calculator',
  title: 'R-Squared Calculator: R² = 0.9765 With Line and Adjusted R²',
  h1: 'R-Squared and Adjusted R-Squared Calculator for a Regression Line',
  meta: 'Eight months of ad spend and sales fit ŷ = 92.726 + 2.919x with R² = 0.9765 and adjusted R² = 0.9726. Paste x and y for the line, residuals and fit.',
  keyword: 'how to calculate r squared',
  also: ['r squared calculator', 'adjusted r squared calculator', 'coefficient of determination calculator', 'how to calculate least squares regression line on ti 84', 'how to calculate residuals on ti 84', 'linear regression calculator', 'how to calculate adjusted r squared'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'data', wide: true, options: [['data', 'Regression line and R² from x and y data'], ['adj', 'Adjusted R² from an R² you already have']] },
    { id: 'xs', label: 'x (predictor), e.g. ad spend in $k', type: 'text', multiline: 4, value: '10, 15, 20, 25, 30, 35, 40, 45', showIf: { mode: ['data'] } },
    { id: 'ys', label: 'y (response), e.g. sales in $k', type: 'text', multiline: 4, value: '120, 135, 160, 158, 185, 190, 214, 222', showIf: { mode: ['data'] } },
    { id: 'r2', label: 'R²', type: 'number', value: 0.8, showIf: { mode: ['adj'] }, help: 'As a decimal, e.g. 0.80' },
    { id: 'n', label: 'Observations (n)', type: 'number', value: 30, showIf: { mode: ['adj'] } },
    { id: 'k', label: 'Predictors (k)', type: 'number', value: 3, showIf: { mode: ['adj'] }, help: 'Independent variables, not counting the intercept.' }
  ],
  compute(v, H) {
    function adj(R2, n, k) { return 1 - (1 - R2) * (n - 1) / (n - k - 1); }
    if (v.mode === 'adj') {
      var R = v.r2, n0 = Math.floor(v.n), k0 = Math.floor(v.k);
      if (!(R >= 0 && R <= 1)) return { error: 'Enter R² as a decimal between 0 and 1.' };
      if (!(k0 >= 1)) return { error: 'Enter at least 1 predictor.' };
      if (!(n0 > k0 + 1)) return { error: 'n must be larger than k + 1.' };
      var A = adj(R, n0, k0);
      return {
        value: 'Adj. R² = ' + H.fix(A, 4), label: 'Adjusted R-squared',
        expr: '1 − (1 − ' + H.num(R, 4) + ') × ' + (n0 - 1) + ' ÷ ' + (n0 - k0 - 1),
        rows: [['R²', H.fix(R, 4)], ['Penalty for ' + k0 + ' predictor' + (k0 > 1 ? 's' : ''), H.fix(R - A, 4), true], ['Residual degrees of freedom', String(n0 - k0 - 1)]],
        sub: 'Adjusted R² only rises when a new predictor improves the fit by more than chance would; it can fall below 0 for a poor model.',
        _adj: A
      };
    }
    var x = H.list(v.xs), y = H.list(v.ys);
    if (x.length !== y.length) return { error: 'x has ' + x.length + ' values and y has ' + y.length + '. They must pair up.' };
    var n = x.length;
    if (n < 3) return { error: 'Enter at least 3 (x, y) pairs.' };
    var L = H.linreg(x, y);
    if (!isFinite(L.slope)) return { error: 'All x values are the same, so no line can be fitted.' };
    var my = H.mean(y), sse = 0, sst = 0, res = [];
    for (var i = 0; i < n; i++) {
      var fit = L.intercept + L.slope * x[i], e = y[i] - fit;
      sse += e * e; sst += (y[i] - my) * (y[i] - my); res.push([x[i], y[i], fit, e]);
    }
    if (sst === 0) return { error: 'All y values are equal, so there is no variation to explain.' };
    var r2 = 1 - sse / sst, ssr = sst - sse, df = n - 2;
    var rows = [
      ['Regression line', 'ŷ = ' + H.num(L.intercept, 3) + (L.slope < 0 ? ' − ' : ' + ') + H.num(Math.abs(L.slope), 3) + 'x', true],
      ['Adjusted R²', df > 0 ? H.fix(adj(r2, n, 1), 4) : '—', true],
      ['Correlation r', H.fix((L.slope < 0 ? -1 : 1) * Math.sqrt(r2), 4)],
      ['SST (total)', H.num(sst, 4)], ['SSR (explained)', H.num(ssr, 4)], ['SSE (residual)', H.num(sse, 4)]
    ];
    if (df > 0) {
      var see = Math.sqrt(sse / df), F = sse > 0 ? ssr / (sse / df) : Infinity;
      rows.push(['Standard error of estimate', H.num(see, 4)]);
      rows.push(['F (1, ' + df + ') and p', isFinite(F) ? H.fix(F, 2) + ', p = ' + (function (p) { return p < 0.0001 ? H.sig(p, 3) : H.fix(p, 4); })(1 - H.fCdf(F, 1, df)) : '∞']);
    }
    return {
      value: 'R² = ' + H.fix(r2, 4), label: 'Coefficient of determination',
      expr: '1 − ' + H.num(sse, 2) + ' ÷ ' + H.num(sst, 2),
      rows: rows,
      sub: 'The line explains ' + H.pct(r2 * 100, 1) + ' of the variation in y; the other ' + H.pct((1 - r2) * 100, 1) + ' is left in the residuals.',
      table: n <= 40 ? { head: ['x', 'y', 'ŷ', 'Residual y − ŷ'], rows: res.map(function (q) { return [H.num(q[0], 4), H.num(q[1], 4), H.fix(q[2], 2), H.fix(q[3], 2)]; }) } : null,
      _r2: r2, _sse: sse, _sst: sst
    };
  },
  quick: ({ r }) => `R-squared is 1 − SSE ÷ SST: the share of the variation in y that a regression line explains. For 8 months of ad spend and sales, the least-squares line is ŷ = 92.726 + 2.919x, residuals square to 215.12 against a total of 9,162, so <strong>${r.value}</strong>. Adjusted R², which penalizes extra predictors, is <strong>0.9726</strong>.`,
  stepsTitle: 'How to calculate R-squared',
  steps: [
    'Fit the least-squares line: slope b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)², intercept a = ȳ − b·x̄.',
    'Work out each predicted value ŷ = a + bx and the residual y − ŷ.',
    'Add the squared residuals to get SSE, and add the squared distances of y from its mean to get SST.',
    'R² = 1 − SSE ÷ SST. Using the squared distances from the line in both parts (or forgetting to square) is where hand calculations usually go wrong.',
    'For a model with k predictors, adjust it: 1 − (1 − R²)(n − 1) ÷ (n − k − 1).'
  ],
  formulaTitle: 'What is the formula for R-squared?',
  formula: {
    expr: 'R² = 1 − SSE ÷ SST = SSR ÷ SST<br>SSE = Σ(y − ŷ)², &nbsp; SST = Σ(y − ȳ)², &nbsp; SSR = Σ(ŷ − ȳ)²<br>Adjusted R² = 1 − (1 − R²)(n − 1) ÷ (n − k − 1)',
    vars: [['ŷ', 'value predicted by the regression line'], ['ȳ', 'mean of the observed y values'], ['n', 'number of observations'], ['k', 'number of predictors (1 for a straight line)']],
    note: 'For simple linear regression with an intercept, R² equals the square of Pearson\'s r. That identity breaks for models fitted without an intercept or for non-linear models.'
  },
  example: `<p>Ad spend x ($k): 10, 15, 20, 25, 30, 35, 40, 45. Sales y ($k): 120, 135, 160, 158, 185, 190, 214, 222.</p>
<p>x̄ = 27.5, ȳ = 173. Slope b = 3,065 ÷ 1,050 = <strong>2.919</strong>; intercept a = 173 − 2.919 × 27.5 = <strong>92.726</strong>.</p>
<p>SST = 9,162. SSE (sum of squared residuals) = 215.12. R² = 1 − 215.12 ÷ 9,162 = <strong>0.9765</strong>.</p>
<p>Adjusted R² = 1 − (0.0235 × 7 ÷ 6) = <strong>0.9726</strong>. Each extra $1k of advertising goes with about $2.92k more sales in this range.</p>`,
  table: {
    title: 'How much does adjusted R² drop as you add predictors?',
    intro: 'Adjusted R² for a model with R² = 0.80, by sample size and number of predictors. Computed with the calculator\'s adjusted-R² mode.',
    head: ['Observations n', 'k = 1', 'k = 2', 'k = 3', 'k = 5', 'k = 10'],
    rows: ({ run, H }) => [15, 20, 30, 50, 100, 500].map(n => [String(n), ...[1, 2, 3, 5, 10].map(k => n > k + 1 ? H.fix(run({ mode: 'adj', r2: 0.8, n, k })._adj, 3) : '—')]),
    note: 'With small samples, every extra predictor costs a lot; with 500 observations, the penalty is nearly invisible.'
  },
  sections: [
    {
      h2: 'How do you calculate R-squared in Excel?',
      html: `<ul>
<li><strong>One number:</strong> <code>=RSQ(B2:B9,A2:A9)</code> returns 0.9765. The y range comes first; the order doesn't change RSQ, but it does change SLOPE and INTERCEPT, which use the same <code>(known_y's, known_x's)</code> order.</li>
<li><strong>The line:</strong> <code>=SLOPE(B2:B9,A2:A9)</code> → 2.919 and <code>=INTERCEPT(B2:B9,A2:A9)</code> → 92.726.</li>
<li><strong>On a chart:</strong> make a scatter chart, right-click a point, choose Add Trendline → Linear, and tick "Display R-squared value on chart".</li>
<li><strong>Full output:</strong> <code>=LINEST(B2:B9,A2:A9,TRUE,TRUE)</code> spills a 5 × 2 block; R² is in row 3, column 1. The Analysis ToolPak's Data → Data Analysis → Regression reports Multiple R, R Square, Adjusted R Square and the standard error together, and it handles several x columns.</li>
</ul>
<p>Google Sheets supports RSQ, SLOPE, INTERCEPT and LINEST with the same arguments, and its chart editor has a "Show R²" box under Trendline.</p>`
    },
    {
      h2: 'How do you calculate adjusted R-squared?',
      html: `<p>Adjusted R² = 1 − (1 − R²)(n − 1) ÷ (n − k − 1). Plain R² never goes down when you add a variable, even pure noise, so it rewards overfitting. The adjustment charges for every predictor: a model with R² = 0.80 from 30 observations and 3 predictors has adjusted R² = 1 − 0.20 × 29 ÷ 26 = <strong>0.777</strong>.</p>
<p>Use adjusted R² to compare models with different numbers of predictors on the same data. If adding a variable lowers adjusted R², the variable isn't pulling its weight. Choose "Adjusted R² from an R² you already have" above to run the numbers for a multiple regression from any software.</p>`
    },
    {
      h2: 'How do you get the least squares line and residuals on a TI-84?',
      html: `<ol>
<li>Type x into L1 and y into L2 (<strong>STAT → 1:Edit</strong>).</li>
<li>So that r² shows up, turn on diagnostics: <strong>CATALOG → DiagnosticOn</strong>, or STAT DIAGNOSTICS: ON in MODE on the CE.</li>
<li>Run <strong>STAT → CALC → 4:LinReg(ax+b)</strong> with Xlist L1, Ylist L2 and, optionally, Store RegEQ = Y1 (VARS → Y-VARS → 1:Function → Y1) so the line can be graphed. The screen shows a = 2.919, b = 92.726 and r² = .9765.</li>
<li>Every regression stores residuals in a list called <strong>RESID</strong>. Press <strong>2nd STAT</strong> (LIST), pick RESID from NAMES, and STO→ it into L3 to see them. For a residual plot, set a STAT PLOT scatter with Xlist L1 and Ylist RESID.</li>
</ol>
<p>Note that LinReg(ax+b) labels the slope a, while LinReg(a+bx) labels it b.</p>`
    },
    {
      h2: 'What is a good R-squared value?',
      html: `<p>There's no universal threshold; it depends on how noisy the thing you're modeling is. Calibration curves in a chemistry lab are expected to exceed 0.99. Models of human behavior often land between 0.1 and 0.5 and are still useful. An R² near 1 with financial time series often signals two trending variables rather than a real relationship.</p>
<p>A high R² also doesn't prove the line is the right model. Check the residual plot: residuals should scatter randomly around zero. A curve, a funnel shape or one huge residual means a straight line is the wrong tool even if R² looks impressive. For whether x and y are associated at all, and how significant that is, use the <a href="/correlation-coefficient-calculator">correlation coefficient calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What does an R-squared of 0.75 mean?', a: 'It means the model explains 75% of the variance in the response variable, and 25% is unexplained (residual) variation. It does not mean predictions are 75% accurate.' },
    { q: 'Is R-squared the same as r squared?', a: 'For a straight line with an intercept and one predictor, yes: R² is the square of the correlation coefficient r. For multiple regression, R² is the square of the correlation between observed and predicted values.' },
    { q: 'Can R-squared be negative?', a: 'Ordinary R² from least squares with an intercept is between 0 and 1. Adjusted R² can be negative when the model fits worse than its predictors would by chance, and R² computed on new data or a model without an intercept can also drop below 0.' },
    { q: 'What is the difference between R-squared and adjusted R-squared?', a: 'R² always rises (or stays the same) as you add predictors. Adjusted R² subtracts a penalty based on n and the number of predictors, so it only rises when a new variable genuinely improves the model.' },
    { q: 'What does RSQ do in Excel?', a: 'RSQ(known_y\'s, known_x\'s) returns the R-squared of the simple linear regression of y on x, the square of the Pearson correlation between the two ranges.' },
    { q: 'How do I calculate a residual?', a: 'Subtract the predicted value from the observed value: residual = y − ŷ. In the example, x = 20 predicts ŷ = 92.726 + 2.919 × 20 = 151.11, and the observed 160 leaves a residual of 8.89.' },
    { q: 'Does a high R-squared mean causation?', a: 'No. R² measures how well the line fits, not why. Two variables that both rise over time can produce R² above 0.9 with no causal link.' }
  ],
  related: ['correlation-coefficient-calculator', 'moving-average-calculator', 'standard-deviation-calculator', 'p-value-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Linear Least Squares Regression', url: 'https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd141.htm' },
    { name: 'NIST/SEMATECH e-Handbook: How can I tell if a model fits my data?', url: 'https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm' },
    { name: 'Microsoft Support: RSQ function', url: 'https://support.microsoft.com/en-us/excel/functions/rsq-function' },
    { name: 'Microsoft Support: LINEST function', url: 'https://support.microsoft.com/en-us/excel/functions/linest-function' },
    { name: 'Penn State STAT 501: Regression Methods', url: 'https://online.stat.psu.edu/stat501/' }
  ]
};
