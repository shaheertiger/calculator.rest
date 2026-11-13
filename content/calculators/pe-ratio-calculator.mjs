export default {
  slug: 'pe-ratio-calculator',
  hub: 'investing',
  name: 'P/E Ratio Calculator',
  title: 'P/E and PEG Calculator: $120 Stock, $5 EPS = 24× P/E, 1.50 PEG',
  h1: 'P/E Ratio Calculator With Forward P/E and PEG Ratio',
  meta: 'A $120 stock earning $5 a share trades at 24 times earnings; with 16% expected EPS growth its PEG ratio is 1.50. Get trailing P/E, forward P/E and PEG.',
  keyword: 'how to calculate peg',
  also: ['pe ratio calculator', 'peg ratio calculator', 'how to calculate forward p/e ratio', 'how to calculate market price per share', 'price to earnings ratio formula', 'earnings yield'],
  updated: '2026-11-13',
  inputs: [
    { id: 'price', label: 'Share price', type: 'number', value: 120, prefix: '$' },
    { id: 'eps', label: 'EPS, trailing 12 months', type: 'number', value: 5, prefix: '$', help: 'Sum of the last four quarters of diluted EPS.' },
    { id: 'feps', label: 'Forward EPS estimate (optional)', type: 'number', value: 5.8, prefix: '$', help: 'Analysts\' consensus for the next 12 months or fiscal year.' },
    { id: 'growth', label: 'Expected annual EPS growth', type: 'number', value: 16, suffix: '%', help: 'Usually the 3–5 year consensus growth estimate.' },
    { id: 'yield', label: 'Dividend yield (optional, for PEGY)', type: 'number', value: '', suffix: '%' },
    { id: 'target', label: 'Target P/E to price the stock (optional)', type: 'number', value: '', placeholder: 'e.g. 20' }
  ],
  compute(v, H) {
    if (!(v.price > 0)) return { error: 'Enter the share price.' };
    if (!H.isNum(v.eps) || v.eps === 0) return { error: 'Enter trailing EPS (not zero).' };
    if (v.eps < 0) return { value: 'n/m', label: 'P/E ratio (not meaningful)', expr: H.money(v.price) + ' ÷ −' + H.money(-v.eps), rows: [['Earnings yield', H.pct(v.eps / v.price * 100, 2)]], sub: 'The company lost money over the last 12 months, so P/E is not meaningful. Use forward P/E, price-to-sales or EV/EBITDA instead.' };
    var pe = v.price / v.eps;
    var rows = [];
    if (v.growth > 0) {
      var peg = pe / v.growth;
      rows.push(['PEG ratio (P/E ÷ growth)', H.fix(peg, 2), true]);
    }
    var fpe = NaN;
    if (v.feps > 0) {
      fpe = v.price / v.feps;
      rows.push(['Forward P/E', H.fix(fpe, 2) + '×']);
      if (v.growth > 0) rows.push(['Forward PEG', H.fix(fpe / v.growth, 2)]);
      rows.push(['Implied next-year EPS growth', H.pct((v.feps / v.eps - 1) * 100, 2)]);
    }
    rows.push(['Earnings yield (EPS ÷ price)', H.pct(v.eps / v.price * 100, 2)]);
    if (v.yield > 0 && v.growth > 0) rows.push(['PEGY ratio (P/E ÷ (growth + yield))', H.fix(pe / (v.growth + v.yield), 2)]);
    if (v.target > 0) rows.push(['Price at ' + H.num(v.target, 2) + '× trailing EPS', H.money(v.target * v.eps)]);
    var sub;
    if (v.growth > 0) {
      var p2 = pe / v.growth;
      sub = p2 < 1 ? 'A PEG under 1 suggests the P/E is low relative to expected growth, the classic Peter Lynch screen for a bargain.' : p2 <= 2 ? 'A PEG between 1 and 2 means you are paying a fair-to-full price for the expected growth.' : 'A PEG above 2 means the price assumes faster growth than forecast, or the forecast is too low.';
    } else sub = 'Add an expected growth rate to get the PEG ratio.';
    return { value: H.fix(pe, 2) + '×', label: 'Trailing P/E ratio', expr: H.money(v.price) + ' ÷ ' + H.money(v.eps), rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate PEG, divide the P/E ratio by the expected annual EPS growth rate (as a whole number). A $120 stock with $5 of trailing EPS has a P/E of $120 ÷ $5 = <strong>${r.value}</strong>; with 16% expected growth, PEG = 24 ÷ 16 = <strong>${r.rows[0][1]}</strong>. On a $5.80 forward EPS estimate the forward P/E is 20.69. A PEG near 1 is usually considered fair value.`,
  stepsTitle: 'How to calculate P/E, forward P/E and PEG',
  steps: [
    'Get the current share price and trailing 12-month diluted EPS (the last four quarters added together) from the company\'s filings or a quote page.',
    'Divide price by EPS for the trailing P/E: $120 ÷ $5 = 24. The stock costs 24 years of current earnings.',
    'For forward P/E, divide the same price by next year\'s consensus EPS estimate: $120 ÷ $5.80 = 20.69.',
    'For PEG, divide the P/E by the expected annual EPS growth rate written as a whole number, not a decimal: 24 ÷ 16 = 1.50. Dividing by 0.16 instead (giving 150) is the classic error.',
    'Compare against the company\'s own history and its industry peers rather than against an absolute number.'
  ],
  formulaTitle: 'What are the P/E and PEG formulas?',
  formula: {
    expr: 'P/E = Share price ÷ EPS<br>Forward P/E = Share price ÷ Estimated EPS for the next 12 months<br>PEG = P/E ÷ Annual EPS growth rate (%)<br>Price = Target P/E × EPS',
    vars: [['EPS', 'earnings per share; trailing 12 months unless stated'], ['Annual EPS growth rate', 'expected growth in percent, e.g. 16 for 16%'], ['Earnings yield', 'the inverse of P/E: EPS ÷ price']],
    note: 'Which P/E goes into PEG varies by source: most use trailing P/E with forward growth, some use forward P/E. The calculator shows both.'
  },
  example: `<p>A stock trades at $120. It earned $5.00 a share over the last four quarters, analysts expect $5.80 next year, and the 5-year consensus EPS growth estimate is 16% a year.</p>
<p>Trailing P/E = $120 ÷ $5.00 = <strong>24.0×</strong>. Forward P/E = $120 ÷ $5.80 = <strong>20.69×</strong>.</p>
<p>PEG = 24 ÷ 16 = <strong>1.50</strong>. Forward PEG = 20.69 ÷ 16 = 1.29.</p>
<p>Earnings yield = $5 ÷ $120 = 4.17%. If the market priced it at 20 times earnings instead, the share price would be 20 × $5 = $100.</p>`,
  table: {
    title: 'What PEG ratio do different P/E and growth combinations give?',
    intro: 'PEG ratio for P/E ratios from 10 to 50 against expected annual EPS growth of 5% to 30%. Values under 1.0 are the traditional "cheap for its growth" zone.',
    head: ['P/E', '5% growth', '10% growth', '15% growth', '20% growth', '30% growth'],
    rows: ({ run }) => [10, 15, 20, 24, 30, 40, 50].map(pe => [pe + '×', ...[5, 10, 15, 20, 30].map(g => run({ price: pe * 5, eps: 5, feps: NaN, growth: g, yield: NaN, target: NaN }).rows[0][1])]),
    note: 'A 40× P/E company growing 30% a year (PEG 1.33) can be better value than a 15× company growing 5% (PEG 3.00), if the growth forecast holds.'
  },
  sections: [
    {
      h2: 'How do you calculate the forward P/E ratio?',
      html: `<p>Divide today's share price by the expected EPS for the next 12 months (or the next fiscal year). Earnings estimates come from analysts' consensus forecasts published on finance sites or in the company's own guidance.</p>
<p>Forward P/E is lower than trailing P/E when earnings are expected to grow: $120 ÷ $5.80 = 20.69 versus 24.0. The gap implies 16% EPS growth next year ($5.80 ÷ $5.00 − 1). Because forecasts are often too optimistic, especially further out, many investors look at both numbers and how estimates have changed over recent months.</p>`
    },
    {
      h2: 'How do you calculate market price per share from P/E?',
      html: `<p>Rearrange the formula: <strong>Price = P/E × EPS</strong>. If similar companies trade at 18 times earnings and the company earns $5 a share, a comparable price is 18 × $5 = $90. This is the basis of "multiples" valuation.</p>
<p>To estimate a future price, multiply a forward P/E by expected EPS: if EPS reaches $7 in three years and the stock still trades at 20×, the price would be $140. Enter a target P/E above to see the price for your own figures. The <a href="/business-valuation-calculator">business valuation calculator</a> applies the same idea to private companies.</p>`
    },
    {
      h2: 'What is a good P/E ratio and PEG ratio?',
      html: `<p>For PEG, the rule of thumb popularized by Fidelity fund manager Peter Lynch is that a fairly priced company's P/E roughly equals its growth rate, so a PEG of 1. Below 1 may be undervalued; above 2 is expensive unless growth is underestimated.</p>
<p>For P/E, context matters more than any cutoff:</p>
<ul><li>The S&P 500's long-run average trailing P/E has been in the mid-teens, though it has spent much of the last decade above 20.</li>
<li>Slow-growing sectors such as utilities, banks and energy usually trade at lower P/Es than software or healthcare.</li>
<li>A low P/E can mean a bargain or a business in decline (a "value trap"); a high one can mean strong growth or hype.</li></ul>
<p>Earnings yield, the inverse of P/E, lets you compare with bonds: a 24× P/E is a 4.17% earnings yield, against a 10-year Treasury yield near 4.9% in early November 2026.</p>`
    },
    {
      h2: 'When is the P/E ratio misleading?',
      html: `<ul><li><strong>Losses:</strong> with negative EPS there is no meaningful P/E. Use price-to-sales or EV/EBITDA.</li>
<li><strong>Cyclical companies:</strong> carmakers, steel and chip companies often look cheapest at the peak of the cycle, when earnings are temporarily high, and most expensive at the bottom.</li>
<li><strong>One-time items:</strong> a large gain or write-down distorts trailing EPS. Check whether the P/E uses GAAP or adjusted EPS.</li>
<li><strong>Debt:</strong> P/E ignores the balance sheet. Two companies with the same P/E can carry very different risk.</li></ul>
<p>Work out EPS correctly first with the <a href="/eps-calculator">EPS calculator</a>, since every multiple depends on it.</p>`
    }
  ],
  faq: [
    { q: 'What is the PEG ratio formula?', a: 'PEG = P/E ratio ÷ expected annual EPS growth rate, with growth as a whole number. A P/E of 24 and 16% growth gives a PEG of 24 ÷ 16 = 1.50.' },
    { q: 'How do you calculate the P/E ratio?', a: 'Divide the current share price by earnings per share for the last 12 months. A $120 stock with $5 of EPS has a P/E of 24.' },
    { q: 'What growth rate should I use for PEG?', a: 'Most sources use the analysts\' consensus estimate of annual EPS growth over the next 3 to 5 years. Using a one-year growth spike can make PEG look misleadingly low.' },
    { q: 'What does a negative P/E mean?', a: 'The company lost money over the last 12 months. Most data providers show P/E as "n/m" (not meaningful) in that case rather than a negative number.' },
    { q: 'What is the PEGY ratio?', a: 'PEGY adjusts PEG for dividends: P/E ÷ (EPS growth rate + dividend yield). It is fairer to slower-growing companies that return more cash to shareholders.' },
    { q: 'How do you calculate P/E in Excel?', a: 'With price in B1 and EPS in B2, use =B1/B2. For PEG with growth in B3 entered as a percentage (16%), use =(B1/B2)/(B3*100).' },
    { q: 'Is a high P/E ratio good or bad?', a: 'Neither by itself. A high P/E means investors expect strong future earnings growth. It becomes a problem when the growth does not arrive, which is what the PEG ratio helps you judge.' }
  ],
  related: ['eps-calculator', 'dividend-payout-ratio-calculator', 'capm-calculator', 'business-valuation-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Price-earnings (P/E) ratio', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/price-earnings-pe-ratio' },
    { name: 'SEC: Beginners\' Guide to Financial Statements', url: 'https://www.sec.gov/files/investor/pubs/begfinstmtguide.htm' },
    { name: 'NYU Stern (Aswath Damodaran): P/E ratios by industry', url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/pedata.html' },
    { name: 'Federal Reserve Bank of St. Louis (FRED): 10-Year Treasury constant maturity rate', url: 'https://fred.stlouisfed.org/series/DGS10' }
  ]
};
