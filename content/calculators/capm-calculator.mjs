export default {
  slug: 'capm-calculator',
  hub: 'investing',
  name: 'CAPM Required Return Calculator',
  title: 'CAPM Calculator: Beta 1.2 Means an 11.10% Required Return',
  h1: 'Required Rate of Return Calculator (CAPM and Dividend Growth Model)',
  meta: 'With a 4.5% risk-free rate, a beta of 1.2 and a 10% expected market return, CAPM gives a required return of 11.10%. Also solves the dividend growth method.',
  keyword: 'how to calculate required rate of return',
  also: ['capm calculator', 'required rate of return calculator', 'how to calculate expected return of a stock', 'cost of equity calculator', 'capm formula'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Method', type: 'select', value: 'capm', options: [['capm', 'CAPM: risk-free rate + beta × risk premium'], ['ddm', 'Dividend growth model: D1 ÷ price + growth']], wide: true },
    { id: 'rf', label: 'Risk-free rate', type: 'number', value: 4.5, suffix: '%', help: 'Usually the 10-year U.S. Treasury yield.', showIf: { method: ['capm'] } },
    { id: 'beta', label: 'Beta of the stock', type: 'number', value: 1.2, help: '1.0 moves with the market; above 1 is more volatile.', showIf: { method: ['capm'] } },
    { id: 'rm', label: 'Expected market return', type: 'number', value: 10, suffix: '%', help: 'Long-run expected return on a broad stock index.', showIf: { method: ['capm'] } },
    { id: 'div', label: 'Dividend paid over the last 12 months (D0)', type: 'number', value: 2, prefix: '$', showIf: { method: ['ddm'] } },
    { id: 'price', label: 'Current share price', type: 'number', value: 50, prefix: '$', showIf: { method: ['ddm'] } },
    { id: 'g', label: 'Expected dividend growth rate, forever', type: 'number', value: 5, suffix: '%', showIf: { method: ['ddm'] } }
  ],
  compute(v, H) {
    if (v.method === 'ddm') {
      if (!(v.div >= 0)) return { error: 'Enter the annual dividend per share.' };
      if (!(v.price > 0)) return { error: 'Enter the share price.' };
      if (!(v.g > -100)) return { error: 'Enter the expected dividend growth rate.' };
      var d1 = v.div * (1 + v.g / 100);
      var yld = d1 / v.price * 100;
      var r = yld + v.g;
      return {
        value: H.fix(r, 2) + '%',
        label: 'Required return (dividend growth model)',
        expr: H.money(d1) + ' ÷ ' + H.money(v.price) + ' + ' + H.pct(v.g, 2),
        rows: [['Next year\'s dividend (D1)', H.money(d1), true], ['Forward dividend yield', H.pct(yld, 2)], ['Growth component', H.pct(v.g, 2)]],
        sub: 'This is the return the market price implies, assuming dividends grow ' + H.pct(v.g, 2) + ' a year forever. It only suits steady dividend payers.'
      };
    }
    if (!(v.rf >= -5)) return { error: 'Enter the risk-free rate.' };
    if (!H.isNum(v.beta)) return { error: 'Enter the stock\'s beta.' };
    if (!H.isNum(v.rm)) return { error: 'Enter the expected market return.' };
    var mrp = v.rm - v.rf;
    var prem = v.beta * mrp;
    var req = v.rf + prem;
    return {
      value: H.fix(req, 2) + '%',
      label: 'Required rate of return (CAPM)',
      expr: H.pct(v.rf, 2) + ' + ' + H.num(v.beta, 3) + ' × (' + H.pct(v.rm, 2) + ' − ' + H.pct(v.rf, 2) + ')',
      rows: [['Market risk premium', H.pct(mrp, 2)], ['Risk premium for this stock (β × MRP)', H.pct(prem, 2), true], ['Versus the market\'s return', (req >= v.rm ? '+' : '−') + H.pct(Math.abs(req - v.rm), 2)]],
      sub: v.beta > 1 ? 'A beta above 1 means more market risk than the index, so investors demand more than the market return.' : v.beta < 0 ? 'A negative beta tends to rise when the market falls, so CAPM asks for less than the risk-free rate.' : 'A beta below 1 means less market risk than the index, so the required return is below the market\'s.'
    };
  },
  quick: ({ r }) => `To calculate the required rate of return with CAPM, add the risk-free rate to beta times the market risk premium. With a 4.5% Treasury yield, a beta of 1.2 and a 10% expected market return: 4.5% + 1.2 × (10% − 4.5%) = 4.5% + 6.6% = <strong>${r.value}</strong>. Using the dividend growth model instead, a $2 dividend growing 5% on a $50 stock implies 9.20%.`,
  stepsTitle: 'How to calculate the required rate of return',
  steps: [
    'Pick the risk-free rate. For long-term stock valuation use the 10-year Treasury yield; it was near 4.9% in early November 2026 (FRED series DGS10).',
    'Find the stock\'s beta from a data provider or from its own returns with the <a href="/beta-calculator">beta calculator</a>.',
    'Choose the expected market return, or go straight to the market risk premium (market return minus the risk-free rate). Practitioners commonly use a premium of about 4–6%.',
    'Multiply beta by the market risk premium and add the risk-free rate. The step people get wrong is multiplying beta by the full market return instead of by the premium above the risk-free rate.',
    'For a steady dividend payer, cross-check with the dividend growth model: next year\'s dividend ÷ price + long-run growth rate.'
  ],
  formulaTitle: 'What is the CAPM formula for required return?',
  formula: {
    expr: 'CAPM: r = R<sub>f</sub> + β × (R<sub>m</sub> − R<sub>f</sub>)<br>Dividend growth: r = D<sub>1</sub> ÷ P<sub>0</sub> + g, with D<sub>1</sub> = D<sub>0</sub> × (1 + g)',
    vars: [['r', 'required (expected) rate of return on the stock, also its cost of equity'], ['R<sub>f</sub>', 'risk-free rate'], ['β', 'beta: sensitivity of the stock to market moves'], ['R<sub>m</sub> − R<sub>f</sub>', 'market risk premium'], ['D<sub>0</sub>, D<sub>1</sub>', 'dividend over the past year and expected next year'], ['P<sub>0</sub>, g', 'current price and constant dividend growth rate']]
  },
  example: `<p>An analyst values a stock with a beta of 1.2. She uses a 4.5% risk-free rate and expects the market to return 10%.</p>
<p>Market risk premium = 10% − 4.5% = 5.5%. Stock risk premium = 1.2 × 5.5% = 6.6%.</p>
<p>Required return = 4.5% + 6.6% = <strong>11.10%</strong>.</p>
<p>The same company pays a $2.00 dividend that she expects to grow 5% a year, and trades at $50. D1 = $2.00 × 1.05 = $2.10. Dividend growth model: $2.10 ÷ $50 + 5% = 4.20% + 5% = <strong>9.20%</strong>. The market price implies a lower return than CAPM demands, which suggests the stock is fully priced.</p>`,
  table: {
    title: 'What required return does each beta imply?',
    intro: 'CAPM required return for a range of betas and risk-free rates, holding the market risk premium at 5.5%.',
    head: ['Beta', 'Rf 3.5%', 'Rf 4.5%', 'Rf 5.5%'],
    rows: ({ run }) => [0, 0.5, 0.8, 1, 1.2, 1.5, 1.8, 2].map(b => [String(b), ...[3.5, 4.5, 5.5].map(rf => run({ method: 'capm', rf: rf, beta: b, rm: rf + 5.5 }).value)]),
    note: 'A beta of 0 earns only the risk-free rate; a beta of 1 earns the market return. Utilities and consumer staples often have betas below 1; many technology stocks are above 1.'
  },
  sections: [
    {
      h2: 'What is the difference between required return and expected return?',
      html: `<p>The <strong>required return</strong> is the minimum an investor should demand for the risk, which CAPM supplies. The <strong>expected return</strong> is what you actually forecast the stock will earn, from your view of its dividends and price.</p>
<p>A simple way to estimate expected return is to weight scenarios by probability. If you see a 25% chance of a 30% gain, a 50% chance of 10% and a 25% chance of a 15% loss, the expected return is 0.25 × 30% + 0.50 × 10% + 0.25 × (−15%) = 8.75%.</p>
<p>Compare the two: if the expected return is above the required return, the stock plots above the security market line and looks undervalued; below it, overvalued. With an 11.10% required return, an 8.75% expected return is not enough.</p>`
    },
    {
      h2: 'Which risk-free rate and market risk premium should you use?',
      html: `<p>Match the risk-free rate to the time horizon. For valuing a company or a long-lived project, the 10-year Treasury yield is standard; for a one-year holding, a Treasury bill rate fits better. Use the same currency as the cash flows.</p>
<p>The market risk premium is the most debated input. Historical averages of U.S. stock returns over Treasury bonds come out around 4–6% depending on the period and averaging method. Forward-looking "implied" premiums, such as those NYU's Aswath Damodaran publishes monthly, are calculated from current index prices and expected cash flows. Whatever you choose, use it consistently across the companies you compare.</p>`
    },
    {
      h2: 'How do you calculate the required return for a portfolio?',
      html: `<p>A portfolio's beta is the weighted average of its holdings' betas. A portfolio that is 60% in a stock with beta 1.2 and 40% in one with beta 0.7 has a beta of 0.6 × 1.2 + 0.4 × 0.7 = 1.0. Its CAPM required return equals the market's: 4.5% + 1.0 × 5.5% = 10.0%.</p>
<p>The same weighting applies to required returns: 0.6 × 11.10% + 0.4 × 8.35% = 10.0%.</p>`
    },
    {
      h2: 'What are the weaknesses of CAPM?',
      html: `<ul><li><strong>Beta is backward-looking</strong> and changes with the time window and data frequency you use.</li>
<li><strong>One factor only:</strong> research by Fama and French and others found that size, value, profitability and momentum also explain returns, which multi-factor models add.</li>
<li><strong>The inputs are estimates:</strong> a 1-point change in the market risk premium moves a beta-1.2 stock's required return by 1.2 points, which can swing a valuation by 15% or more.</li></ul>
<p>Despite this, CAPM remains the standard way to estimate the cost of equity for a <a href="/wacc-calculator">WACC</a> because it is simple and transparent.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for the required rate of return?', a: 'Using CAPM, required return = risk-free rate + beta × (market return − risk-free rate). Using the dividend growth model, required return = next year\'s dividend ÷ current price + dividend growth rate.' },
    { q: 'Is the required rate of return the same as the cost of equity?', a: 'Yes, from the company\'s point of view. The return shareholders require is what the company must earn on their money, so CAPM\'s result is used as the cost of equity in WACC.' },
    { q: 'How do you calculate CAPM in Excel?', a: 'With the risk-free rate in B1, beta in B2 and the market return in B3 (as percentages), use =B1+B2*(B3-B1). For 4.5%, 1.2 and 10% it returns 11.10%.' },
    { q: 'What does a beta of 1.5 mean for required return?', a: 'The stock is expected to move 1.5 times as much as the market, so its risk premium is 1.5 times the market\'s. With a 4.5% risk-free rate and 5.5% premium, it requires 4.5% + 1.5 × 5.5% = 12.75%.' },
    { q: 'Can the required rate of return be lower than the risk-free rate?', a: 'Only with a negative beta, such as some gold or volatility-linked assets that tend to rise when stocks fall. Investors accept a lower return because the asset hedges market risk.' },
    { q: 'What is a hurdle rate?', a: 'The minimum return a company sets for a new project. It usually starts from the WACC, which includes the CAPM cost of equity, and adds a margin for project-specific risk.' },
    { q: 'What market return should I use in CAPM?', a: 'A long-run expected return for a broad index such as the S&P 500, commonly 8–10% in nominal terms, or equivalently a risk-free rate plus a 4–6% market risk premium.' }
  ],
  related: ['beta-calculator', 'wacc-calculator', 'dividend-payout-ratio-calculator', 'pe-ratio-calculator', 'npv-calculator'],
  sources: [
    { name: 'Federal Reserve Bank of St. Louis (FRED): 10-Year Treasury constant maturity rate (DGS10)', url: 'https://fred.stlouisfed.org/series/DGS10' },
    { name: 'NYU Stern (Aswath Damodaran): Current data, betas and equity risk premiums', url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html' },
    { name: 'SEC Investor.gov: Asset allocation and diversification', url: 'https://www.investor.gov/introduction-investing/getting-started/asset-allocation' },
    { name: 'CFA Institute', url: 'https://www.cfainstitute.org/' }
  ]
};
