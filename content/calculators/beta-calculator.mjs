export default {
  slug: 'beta-calculator',
  hub: 'investing',
  name: 'Stock Beta Calculator',
  title: 'Beta Calculator: Covariance 7.03 ÷ Variance 5.24 = Beta 1.34',
  h1: 'Stock Beta Calculator: Beta From Returns, Plus Unlevered Beta',
  meta: 'Paste a stock\'s and the market\'s returns to get beta = covariance ÷ variance. Twelve months of sample data give a beta of 1.34 and an unlevered beta of 0.88.',
  keyword: 'how is beta calculated',
  also: ['beta calculator', 'how to calculate unlevered beta', 'how to calculate beta in excel', 'stock beta formula', 'levered beta calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'returns', options: [['returns', 'Beta from stock and market returns'], ['unlever', 'Unlever or relever a known beta']], wide: true },
    { id: 'stock', label: 'Stock returns (%), oldest first', type: 'text', value: '3.8, -0.9, 4.6, -0.7, -3.1, 6.3, 0.2, 0.9, 2.2, -5.0, 3.9, 1.6', multiline: 3, help: 'Monthly or weekly total returns, one per period.', showIf: { mode: ['returns'] }, wide: true },
    { id: 'market', label: 'Market index returns (%), same periods', type: 'text', value: '2.1, -1.5, 3.4, 0.8, -2.7, 4.0, 1.2, -0.6, 2.5, -3.1, 1.9, 0.9', multiline: 3, help: 'For example the S&P 500 over the same dates.', showIf: { mode: ['returns'] }, wide: true },
    { id: 'lbeta', label: 'Levered (observed) beta', type: 'number', value: 1.2, showIf: { mode: ['unlever'] } },
    { id: 'de', label: 'Debt-to-equity ratio (market values)', type: 'number', value: 0.67, help: 'Debt ÷ market value of equity. Leave blank to skip unlevering.' },
    { id: 'tax', label: 'Corporate tax rate', type: 'number', value: 21, suffix: '%' },
    { id: 'tde', label: 'Target debt-to-equity to relever (optional)', type: 'number', value: '', placeholder: 'e.g. 1.0' }
  ],
  compute(v, H) {
    var t = v.tax > 0 ? v.tax / 100 : 0;
    var hasDE = v.de >= 0;
    var rows = [], beta, out;
    if (v.mode === 'unlever') {
      if (!H.isNum(v.lbeta)) return { error: 'Enter the levered beta.' };
      if (!hasDE) return { error: 'Enter the debt-to-equity ratio.' };
      beta = v.lbeta;
      var bu0 = beta / (1 + (1 - t) * v.de);
      rows.push(['Levered beta', H.fix(beta, 3)], ['Leverage factor 1 + (1 − T) × D/E', H.fix(1 + (1 - t) * v.de, 4)]);
      out = { value: H.fix(bu0, 3), label: 'Unlevered (asset) beta', expr: H.num(beta, 3) + ' ÷ (1 + (1 − ' + H.pct(t * 100, 1) + ') × ' + H.num(v.de, 3) + ')', rows: rows };
      if (v.tde >= 0) rows.push(['Relevered beta at D/E ' + H.num(v.tde, 2), H.fix(bu0 * (1 + (1 - t) * v.tde), 3), true]);
      out.sub = 'Unlevered beta strips out financial risk, leaving the business risk of the company\'s operations.';
      return out;
    }
    var s = H.list(v.stock), m = H.list(v.market);
    var n = Math.min(s.length, m.length);
    if (n < 3) return { error: 'Enter at least three matching pairs of returns.' };
    if (s.length !== m.length) rows.push(['Note', 'Lists differ in length; used the first ' + n + ' pairs']);
    s = s.slice(0, n); m = m.slice(0, n);
    var ms = H.mean(s), mm = H.mean(m), cov = 0;
    for (var i = 0; i < n; i++) cov += (s[i] - ms) * (m[i] - mm);
    cov = cov / (n - 1);
    var vm = H.variance(m, true);
    if (!(vm > 0)) return { error: 'Market returns must vary to calculate beta.' };
    beta = cov / vm;
    var r = H.pearson(m, s);
    var alpha = ms - beta * mm;
    rows.push(['Covariance (stock, market)', H.fix(cov, 4)], ['Variance of market', H.fix(vm, 4)], ['Correlation', H.fix(r, 3)], ['R² (share of moves explained by the market)', H.pct(r * r * 100, 1)], ['Alpha (intercept) per period', H.pct(alpha, 3)], ['Periods used', String(n)]);
    if (hasDE) rows.splice(2, 0, ['Unlevered beta (D/E ' + H.num(v.de, 2) + ', tax ' + H.pct(t * 100, 1) + ')', H.fix(beta / (1 + (1 - t) * v.de), 3), true]);
    if (hasDE && v.tde >= 0) rows.splice(3, 0, ['Relevered at D/E ' + H.num(v.tde, 2), H.fix(beta / (1 + (1 - t) * v.de) * (1 + (1 - t) * v.tde), 3)]);
    return {
      value: H.fix(beta, 2),
      label: 'Beta (levered)',
      expr: H.fix(cov, 3) + ' ÷ ' + H.fix(vm, 3),
      rows: rows,
      sub: 'On average the stock moved ' + H.fix(beta, 2) + '% for every 1% move in the market' + (n < 24 ? '. With fewer than 24 periods, treat this beta as a rough estimate.' : '.')
    };
  },
  quick: ({ r }) => `Beta is calculated as the covariance of a stock's returns with the market's returns divided by the variance of the market's returns. For the 12 months of sample data above, covariance is 7.027 and market variance is 5.239, so beta = 7.027 ÷ 5.239 = <strong>${r.value}</strong>: the stock tends to move 1.34% for each 1% market move. Unlevered at a 0.67 debt-to-equity ratio, beta is 0.88.`,
  stepsTitle: 'How is beta calculated, step by step?',
  steps: [
    'Collect periodic total returns for the stock and a market index over the same dates. Five years of monthly returns (60 pairs) is the most common choice; two years of weekly returns is the other.',
    'Find the average return of each series, then for every period multiply the stock\'s deviation from its average by the market\'s deviation from its average.',
    'Add those products and divide by (number of periods − 1) to get the covariance. Do the same with the market\'s squared deviations to get its variance.',
    'Divide covariance by variance. That is beta, and it equals the slope of a regression line of stock returns on market returns. Mixing prices with returns, or misaligned dates, is the mistake that produces nonsense betas.',
    'To compare companies with different debt levels, unlever the beta: β<sub>U</sub> = β<sub>L</sub> ÷ [1 + (1 − T) × D/E].'
  ],
  formulaTitle: 'What is the formula for beta?',
  formula: {
    expr: 'β = Cov(R<sub>s</sub>, R<sub>m</sub>) ÷ Var(R<sub>m</sub>) = ρ × σ<sub>s</sub> ÷ σ<sub>m</sub><br>Unlevered: β<sub>U</sub> = β<sub>L</sub> ÷ [1 + (1 − T) × D/E]<br>Relevered: β<sub>L</sub> = β<sub>U</sub> × [1 + (1 − T) × D/E<sub>target</sub>]',
    vars: [['R<sub>s</sub>, R<sub>m</sub>', 'stock and market returns for the same periods'], ['ρ', 'correlation between them'], ['σ<sub>s</sub>, σ<sub>m</sub>', 'standard deviations of stock and market returns'], ['D/E', 'debt-to-equity ratio at market value'], ['T', 'corporate tax rate']],
    note: 'The unlevering formula is the Hamada equation, which assumes the company\'s debt carries no market risk (a debt beta of zero).'
  },
  example: `<p>Twelve months of returns: the stock averaged 1.150% a month and the market 0.742%.</p>
<p>Sum of the products of deviations = 77.295, so covariance = 77.295 ÷ 11 = <strong>7.027</strong>. Sum of the market's squared deviations = 57.629, so variance = 57.629 ÷ 11 = <strong>5.239</strong>.</p>
<p>Beta = 7.027 ÷ 5.239 = <strong>1.34</strong>. Correlation is 0.934, so the market explains about 87% of the stock's monthly moves.</p>
<p>The company has $0.67 of debt for every $1 of equity and a 21% tax rate. Unlevered beta = 1.341 ÷ (1 + 0.79 × 0.67) = 1.341 ÷ 1.529 = <strong>0.877</strong>.</p>`,
  table: {
    title: 'How does debt change a company\'s beta?',
    intro: 'Levered beta for unlevered (business) betas of 0.6 to 1.4 at different debt-to-equity ratios, with a 21% tax rate.',
    head: ['Unlevered beta', 'D/E 0', 'D/E 0.25', 'D/E 0.5', 'D/E 1.0', 'D/E 2.0'],
    rows: ({ run, H }) => [0.6, 0.8, 1, 1.2, 1.4].map(bu => [H.fix(bu, 2), ...[0, 0.25, 0.5, 1, 2].map(de => run({ mode: 'unlever', lbeta: bu, de: 0, tax: 21, tde: de }).rows[2][1])]),
    note: 'Doubling leverage from 0.5 to 1.0 raises a 1.0 business beta from 1.395 to 1.790: shareholders carry more risk when more of the firm is financed with debt.'
  },
  sections: [
    {
      h2: 'How do you calculate beta in Excel or Google Sheets?',
      html: `<p>Put the stock's returns in column B and the market's in column C, one row per period. Then any of these give the same answer:</p>
<ul><li><code>=SLOPE(B2:B61, C2:C61)</code>: the stock range comes first.</li>
<li><code>=COVARIANCE.S(B2:B61, C2:C61) / VAR.S(C2:C61)</code></li>
<li><code>=CORREL(B2:B61, C2:C61) * STDEV.S(B2:B61) / STDEV.S(C2:C61)</code></li></ul>
<p>If you start from prices, compute returns first with <code>=B3/B2-1</code>. Use adjusted closing prices so dividends and splits are included. Mixing sample and population functions (COVARIANCE.P with VAR.S) gives a slightly wrong beta; keep them matched.</p>`
    },
    {
      h2: 'How do you calculate unlevered beta?',
      html: `<p>Observed betas include financial risk from debt. To compare companies, or to estimate a beta for a private firm, analysts unlever comparable companies' betas, average them, then relever at the target company's capital structure.</p>
<ol><li>Unlever each comparable: β<sub>U</sub> = β<sub>L</sub> ÷ [1 + (1 − T) × D/E].</li>
<li>Take the median or average unlevered beta of the group.</li>
<li>Relever: β<sub>L</sub> = β<sub>U</sub> × [1 + (1 − T) × target D/E].</li></ol>
<p>Example: a peer with beta 1.2, D/E 0.67 and a 21% tax rate has β<sub>U</sub> = 1.2 ÷ 1.529 = 0.785. For a private company with D/E 1.0, β<sub>L</sub> = 0.785 × 1.79 = 1.405. Choose "Unlever or relever a known beta" above and enter a target D/E to do this.</p>`
    },
    {
      h2: 'Why do different websites show different betas for the same stock?',
      html: `<p>Because there is no single beta. Providers choose different time windows (1, 2, 3 or 5 years), frequencies (daily, weekly, monthly), indexes (S&P 500, a total-market index or a world index) and adjustments. Many terminals report an "adjusted" beta that pulls the raw figure toward 1: adjusted β = 0.67 × raw β + 0.33. A raw 1.34 becomes 1.23.</p>
<p>Daily data for thinly traded stocks understates beta because prices react to market news with a lag. Monthly data has fewer observations, so its estimate is noisier. Check R²: a low figure means the market explains little of the stock's movement and beta says little about its total risk.</p>`
    },
    {
      h2: 'What does a beta of 1.34 mean?',
      html: `<p>When the market rises 10%, the stock has tended to rise about 13.4%, and when the market falls 10%, the stock has tended to fall about 13.4%. Beta measures only <em>systematic</em> risk, the part you cannot diversify away. A stock can have a low beta and still be very volatile if most of its moves come from company-specific news.</p>
<ul><li><strong>β = 1:</strong> moves with the market (the index itself).</li>
<li><strong>β &gt; 1:</strong> amplifies market moves, typical of technology and cyclical stocks.</li>
<li><strong>0 &lt; β &lt; 1:</strong> damped moves, typical of utilities and consumer staples.</li>
<li><strong>β &lt; 0:</strong> tends to move against the market, which is rare.</li></ul>
<p>Feed beta into the <a href="/capm-calculator">CAPM calculator</a> to turn it into a required return.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for beta?', a: 'Beta = covariance of the stock\'s returns with the market\'s returns ÷ variance of the market\'s returns. It is also the slope of a regression of stock returns on market returns.' },
    { q: 'How many data points do you need to calculate beta?', a: 'At least 24 to 36 periods for a usable estimate; 60 monthly returns over five years is the most common standard. With fewer, beta can change a lot from one window to the next.' },
    { q: 'Can beta be negative?', a: 'Yes, if the stock tends to rise when the market falls. It is uncommon for individual companies; gold miners and some hedging instruments have shown negative betas over certain periods.' },
    { q: 'What is the beta of the S&P 500?', a: 'Exactly 1.0 when the S&P 500 is the benchmark, because the index has a covariance with itself equal to its own variance.' },
    { q: 'Do I use sample or population covariance?', a: 'Either, as long as you use the same type for the variance. The (n − 1) or n divisors cancel, so beta is identical.' },
    { q: 'What is the difference between levered and unlevered beta?', a: 'Levered beta is what you observe in the market and includes the effect of the company\'s debt. Unlevered beta removes that effect and reflects only business risk.' },
    { q: 'How do you calculate the beta of a portfolio?', a: 'Take the weighted average of the holdings\' betas, weighted by market value. 70% in a 1.3-beta stock and 30% in a 0.8-beta stock gives 0.7 × 1.3 + 0.3 × 0.8 = 1.15.' }
  ],
  related: ['capm-calculator', 'wacc-calculator', 'debt-to-equity-calculator', 'cagr-calculator'],
  sources: [
    { name: 'NYU Stern (Aswath Damodaran): Betas by sector', url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html' },
    { name: 'SEC Investor.gov: Glossary of investing terms', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary' },
    { name: 'SEC Investor.gov: Asset allocation and diversification', url: 'https://www.investor.gov/introduction-investing/getting-started/asset-allocation' },
    { name: 'CFA Institute', url: 'https://www.cfainstitute.org/' }
  ]
};
