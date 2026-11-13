export default {
  slug: 'wacc-calculator',
  hub: 'investing',
  name: 'WACC Calculator',
  title: 'WACC Calculator: 60/40 Equity-Debt Mix Gives a 7.90% WACC',
  h1: 'WACC Calculator: Weighted Average Cost of Capital Step by Step',
  meta: 'With $600M of equity at 10%, $400M of debt at 6% and a 21% tax rate, WACC is 7.90%. Enter market values and costs to get your discount rate.',
  keyword: 'how do i calculate wacc',
  also: ['wacc calculator', 'how to calculate wacc', 'how to calculate wacc on excel', 'how do you calculate wacc in excel', 'weighted average cost of capital formula'],
  updated: '2026-11-13',
  inputs: [
    { id: 'e', label: 'Market value of equity (E)', type: 'number', value: 600, prefix: '$', suffix: 'million', help: 'Share price × shares outstanding. Any unit works if all three values use it.' },
    { id: 'd', label: 'Market value of debt (D)', type: 'number', value: 400, prefix: '$', suffix: 'million', help: 'Interest-bearing debt; book value is a common stand-in.' },
    { id: 're', label: 'Cost of equity (Re)', type: 'number', value: 10, suffix: '%', help: 'Usually from CAPM: risk-free rate + beta × market risk premium.' },
    { id: 'rd', label: 'Pre-tax cost of debt (Rd)', type: 'number', value: 6, suffix: '%', help: 'Yield to maturity on the company\'s bonds, or its borrowing rate.' },
    { id: 'tax', label: 'Corporate tax rate (T)', type: 'number', value: 21, suffix: '%', help: 'U.S. federal rate is 21%; add state tax for a blended rate of about 25%.' },
    { id: 'p', label: 'Preferred stock value (optional)', type: 'number', value: 0, prefix: '$', suffix: 'million' },
    { id: 'rp', label: 'Cost of preferred stock', type: 'number', value: 0, suffix: '%', help: 'Preferred dividend ÷ preferred price.' }
  ],
  compute(v, H) {
    var E = v.e > 0 ? v.e : 0, D = v.d > 0 ? v.d : 0, P = v.p > 0 ? v.p : 0;
    var V = E + D + P;
    if (!(V > 0)) return { error: 'Enter the market value of equity and/or debt.' };
    if (E > 0 && !(v.re >= 0)) return { error: 'Enter the cost of equity.' };
    if (D > 0 && !(v.rd >= 0)) return { error: 'Enter the cost of debt.' };
    var t = v.tax > 0 ? v.tax / 100 : 0;
    var re = E > 0 ? v.re : 0, rd = D > 0 ? v.rd : 0, rp = P > 0 && v.rp > 0 ? v.rp : 0;
    var we = E / V, wd = D / V, wp = P / V;
    var after = rd * (1 - t);
    var cE = we * re, cD = wd * after, cP = wp * rp;
    var wacc = cE + cD + cP;
    var rows = [
      ['Equity weight (E/V)', H.pct(we * 100, 2)],
      ['Debt weight (D/V)', H.pct(wd * 100, 2)],
      ['After-tax cost of debt', H.pct(after, 3), true],
      ['Equity contributes', H.pct(cE, 3)],
      ['Debt contributes', H.pct(cD, 3)],
      ['Debt-to-equity ratio', E > 0 ? H.num(D / E, 3) : '—']
    ];
    if (P > 0) { rows.splice(2, 0, ['Preferred weight (P/V)', H.pct(wp * 100, 2)]); rows.push(['Preferred contributes', H.pct(cP, 3)]); }
    return {
      value: H.fix(wacc, 2) + '%',
      label: 'Weighted average cost of capital',
      expr: H.pct(we * 100, 1) + ' × ' + H.pct(re, 2) + ' + ' + H.pct(wd * 100, 1) + ' × ' + H.pct(rd, 2) + ' × (1 − ' + H.pct(t * 100, 1) + ')' + (P > 0 ? ' + ' + H.pct(wp * 100, 1) + ' × ' + H.pct(rp, 2) : ''),
      rows: rows,
      sub: 'A project or acquisition must earn more than ' + H.pct(wacc, 2) + ' a year to create value for both shareholders and lenders at this capital mix.'
    };
  },
  quick: ({ r }) => `To calculate WACC, weight each source of capital by its share of total market value and add up the after-tax costs. With $600M of equity costing 10% and $400M of debt at 6% pre-tax and a 21% tax rate: WACC = 0.60 × 10% + 0.40 × 6% × (1 − 0.21) = 6.00% + 1.90% = <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate WACC in 5 steps',
  steps: [
    'Find the market value of equity: current share price × diluted shares outstanding. Use market value, not the book equity on the balance sheet; mixing the two is the most common WACC error.',
    'Find the value of debt: all interest-bearing borrowings, ideally at market value. Many analysts include lease liabilities. Add the two (plus any preferred stock) to get V.',
    'Estimate the cost of equity with CAPM: risk-free rate + beta × market risk premium. The <a href="/capm-calculator">CAPM calculator</a> does this step.',
    'Estimate the pre-tax cost of debt from the yield on the company\'s bonds or its current borrowing rate, then multiply by (1 − tax rate) because interest is tax-deductible.',
    'Multiply each cost by its weight and add: WACC = E/V × Re + D/V × Rd × (1 − T).'
  ],
  formulaTitle: 'What is the WACC formula?',
  formula: {
    expr: 'WACC = (E ÷ V) × Re + (D ÷ V) × Rd × (1 − T) + (P ÷ V) × Rp<br>V = E + D + P',
    vars: [['E, D, P', 'market values of equity, debt and preferred stock'], ['Re', 'cost of equity (required return for shareholders)'], ['Rd', 'pre-tax cost of debt'], ['Rp', 'cost of preferred stock'], ['T', 'marginal corporate tax rate']],
    note: 'Preferred dividends are not tax-deductible, so the preferred term gets no tax adjustment.'
  },
  example: `<p>A company has 50 million shares at $12 ($600 million equity) and $400 million of bonds yielding 6%. Its beta-based cost of equity is 10% and its tax rate is 21%.</p>
<p>V = $600M + $400M = $1,000M, so E/V = 60% and D/V = 40%.</p>
<p>After-tax cost of debt = 6% × (1 − 0.21) = 4.74%.</p>
<p>WACC = 0.60 × 10% + 0.40 × 4.74% = 6.00% + 1.896% = <strong>7.90%</strong>.</p>`,
  table: {
    title: 'How do the cost of equity and debt weight change WACC?',
    intro: 'WACC for a 6% pre-tax cost of debt and 21% tax rate, by cost of equity and share of debt in the capital structure.',
    head: ['Cost of equity', '20% debt', '30% debt', '40% debt', '50% debt', '60% debt'],
    rows: ({ run }) => [8, 9, 10, 11, 12, 14].map(re => [re + '%', ...[20, 30, 40, 50, 60].map(dw => run({ e: 100 - dw, d: dw, re: re, rd: 6, tax: 21, p: 0, rp: 0 }).value)]),
    note: 'Read across with care: in practice more debt raises both the cost of equity (shareholders bear more risk) and the cost of debt (lenders charge more), so WACC does not keep falling as the table might suggest.'
  },
  sections: [
    {
      h2: 'How do you calculate WACC in Excel?',
      html: `<p>Lay out the inputs in cells, then build the formula from them so you can test scenarios:</p>
<ul><li>B1 equity value (600), B2 debt value (400), B3 cost of equity (10%), B4 cost of debt (6%), B5 tax rate (21%).</li>
<li>B6 total value: <code>=B1+B2</code></li>
<li>B7 WACC: <code>=B1/B6*B3 + B2/B6*B4*(1-B5)</code> → 7.90%</li></ul>
<p>Format B3:B5 and B7 as percentages. If you enter rates as whole numbers (10 rather than 10%), divide them by 100 in the formula. To pull a live share price, Excel's Stocks data type or Google Sheets' <code>=GOOGLEFINANCE("TICKER","price")</code> can feed the equity value.</p>`
    },
    {
      h2: 'Where do you find each WACC input?',
      html: `<ul><li><strong>Equity value:</strong> share price × shares outstanding, from a quote and the cover page of the latest 10-K or 10-Q on SEC EDGAR.</li>
<li><strong>Debt:</strong> the balance sheet's short- and long-term debt; the debt footnote lists each bond's rate and maturity.</li>
<li><strong>Cost of debt:</strong> the yield to maturity on the company's traded bonds. Without one, use interest expense ÷ average debt, or a risk-free rate plus a spread matching its credit rating.</li>
<li><strong>Tax rate:</strong> the marginal rate, not the effective rate on the income statement. U.S. federal is 21%; state taxes push it to about 24–27% for many companies.</li>
<li><strong>Cost of equity:</strong> CAPM, using a long-term Treasury yield, the stock's beta from the <a href="/beta-calculator">beta calculator</a>, and a market risk premium (practitioners commonly use about 4–6%).</li></ul>`
    },
    {
      h2: 'Why is the cost of debt multiplied by (1 − tax rate)?',
      html: `<p>Interest is a deductible expense, so every dollar of interest reduces taxable income and saves the company T cents of tax. A 6% loan for a company in the 21% bracket really costs 6% × 0.79 = 4.74%. Dividends to shareholders come from after-tax profit, so the cost of equity gets no such adjustment.</p>
<p>The shield only works if the company is profitable enough to use the deduction. U.S. rules also cap net business interest deductions at 30% of adjusted taxable income for larger companies. A loss-making firm should use a lower tax rate, often zero, in the formula.</p>`
    },
    {
      h2: 'What is WACC used for, and what is a typical WACC?',
      html: `<p>WACC is the discount rate in a discounted cash flow (DCF) valuation of the whole firm, and the minimum return (hurdle rate) for new projects of average risk. A project that returns 9% when WACC is 7.90% adds value; one that returns 7% destroys it, even though it is profitable. Use it in the <a href="/npv-calculator">NPV calculator</a> to value a project's cash flows.</p>
<p>Large, stable U.S. companies often land somewhere around 6–9%; smaller, riskier or highly cyclical businesses are higher. Professor Aswath Damodaran of NYU Stern publishes cost-of-capital estimates by industry each January, which are a useful sanity check.</p>`
    }
  ],
  faq: [
    { q: 'What is the WACC formula?', a: 'WACC = (E/V × Re) + (D/V × Rd × (1 − T)), where E is equity value, D is debt value, V = E + D, Re is the cost of equity, Rd the pre-tax cost of debt and T the tax rate.' },
    { q: 'Should I use book value or market value in WACC?', a: 'Market value, especially for equity. Book equity is often far below what shareholders could sell for. For debt, book value is an acceptable stand-in when the company\'s bonds trade near par.' },
    { q: 'Is a higher or lower WACC better?', a: 'Lower. A lower WACC means the company can raise money more cheaply, so more projects clear the hurdle and its future cash flows are worth more today.' },
    { q: 'Why is debt cheaper than equity?', a: 'Lenders are paid before shareholders and have a fixed claim, so they take less risk and accept a lower return. Interest is also tax-deductible, which lowers the cost of debt further.' },
    { q: 'What tax rate should I use in WACC?', a: 'The marginal tax rate the company pays on its next dollar of profit, usually 21% federal plus state tax for U.S. companies. Use zero if the company is not profitable enough to use the interest deduction.' },
    { q: 'Does WACC include current liabilities like accounts payable?', a: 'No. Only investor capital that carries a required return is included: equity, interest-bearing debt and preferred stock. Operating liabilities like payables are handled in the cash flow forecast.' },
    { q: 'How do you calculate WACC for a private company?', a: 'Use the same formula, but estimate equity value from a valuation or target debt-to-equity ratio, and borrow a beta from comparable public companies, unlevering and relevering it for the private firm\'s debt.' }
  ],
  related: ['capm-calculator', 'beta-calculator', 'npv-calculator', 'irr-calculator', 'debt-to-equity-calculator'],
  sources: [
    { name: 'NYU Stern (Aswath Damodaran): Cost of capital by industry', url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/wacc.html' },
    { name: 'SEC: Beginners\' Guide to Financial Statements', url: 'https://www.sec.gov/files/investor/pubs/begfinstmtguide.htm' },
    { name: 'IRS: Questions and answers about the limitation on the deduction for business interest expense', url: 'https://www.irs.gov/newsroom/questions-and-answers-about-the-limitation-on-the-deduction-for-business-interest-expense' },
    { name: 'CFA Institute', url: 'https://www.cfainstitute.org/' }
  ]
};
