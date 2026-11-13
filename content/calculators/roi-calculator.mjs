export default {
  slug: 'roi-calculator',
  hub: 'investing',
  name: 'ROI Calculator',
  title: 'ROI Calculator: $10,000 to $14,500 Is 45% ROI, 13.19% a Year',
  h1: 'ROI Calculator: Return on Investment and Annualized Return',
  meta: 'An investment that grows from $10,000 to $14,500 in 3 years has a 45% ROI, or 13.19% a year annualized. Add fees and income to get your true return.',
  keyword: 'how to calculate an investment return',
  also: ['roi calculator', 'how to calculate roi', 'how to calculate roi in marketing', 'how to calculate marketing roi', 'how to calculate roi for rental property', 'annualized roi calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'cost', label: 'Amount invested', type: 'number', value: 10000, prefix: '$' },
    { id: 'end', label: 'Value now, or amount you sold for', type: 'number', value: 14500, prefix: '$' },
    { id: 'income', label: 'Income received along the way', type: 'number', value: 0, prefix: '$', help: 'Dividends, interest, rent or other cash you took out.' },
    { id: 'fees', label: 'Fees, commissions and other costs', type: 'number', value: 0, prefix: '$', help: 'Added to the amount invested.' },
    { id: 'years', label: 'Holding period', type: 'number', value: 3, suffix: 'years', help: 'Decimals are fine: 18 months = 1.5. Leave blank to skip the annualized figure.' }
  ],
  compute(v, H) {
    if (!(v.cost > 0)) return { error: 'Enter the amount invested.' };
    if (!(v.end >= 0)) return { error: 'Enter what the investment is worth now.' };
    var basis = v.cost + (v.fees > 0 ? v.fees : 0);
    var back = v.end + (v.income > 0 ? v.income : 0);
    var gain = back - basis;
    var roi = gain / basis;
    var rows = [
      ['Net profit', (gain < 0 ? '−' : '') + H.money(Math.abs(gain))],
      ['Total cost basis', H.money(basis)],
      ['Total returned', H.money(back)],
      ['Multiple of money', H.num(back / basis, 3) + '×']
    ];
    var ann = NaN;
    if (v.years > 0) {
      ann = back > 0 ? Math.pow(back / basis, 1 / v.years) - 1 : -1;
      rows.unshift(['Annualized ROI', H.pct(ann * 100, 2) + ' a year', true]);
    }
    var sub = !(v.years > 0) ? 'Add a holding period to compare this with other investments on a per-year basis.'
      : v.years < 1 ? 'Held under a year: annualizing a short-term gain can make it look larger than it would be over a full year.'
      : 'Annualized ROI assumes the gain compounded evenly each year, the same as a CAGR.';
    return {
      value: H.pct(roi * 100, 2),
      label: 'Total return on investment (ROI)',
      expr: '(' + H.money(back, 0) + ' − ' + H.money(basis, 0) + ') ÷ ' + H.money(basis, 0),
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate an investment return, subtract what you put in from what you got back and divide by what you put in. $10,000 that grows to $14,500 earns $4,500, so ROI = $4,500 ÷ $10,000 = <strong>${r.value}</strong>. Over 3 years that annualizes to <strong>13.19% a year</strong>: (14,500 ÷ 10,000)<sup>1/3</sup> − 1. Include dividends you received and any fees you paid.`,
  stepsTitle: 'How to calculate return on investment',
  steps: [
    'Add up everything the investment cost: the purchase price plus commissions, closing costs or fund loads.',
    'Add up everything it returned: today\'s value or the sale price, plus dividends, interest or rent you received along the way. Forgetting this income is the most common reason people understate their ROI.',
    'Subtract cost from returns to get net profit, then divide by cost. Multiply by 100 for a percentage.',
    'To compare investments held for different lengths of time, annualize: (returned ÷ cost)<sup>1 ÷ years</sup> − 1. A 45% gain over 3 years is better than 50% over 5.'
  ],
  formulaTitle: 'What is the formula for ROI and annualized ROI?',
  formula: {
    expr: 'ROI = (Total returned − Total cost) ÷ Total cost × 100<br>Annualized ROI = (Total returned ÷ Total cost)<sup>1/years</sup> − 1',
    vars: [['Total returned', 'ending value or sale price + income received'], ['Total cost', 'amount invested + fees and costs'], ['years', 'holding period in years']],
    note: 'ROI treats all money as going in at the start and coming out at the end. If you added or withdrew money in between, the <a href="/irr-calculator">IRR calculator</a> gives the correct annual return.'
  },
  example: `<p>You buy $10,000 of a fund and sell it 3 years later for $14,500.</p>
<p>ROI = ($14,500 − $10,000) ÷ $10,000 = 0.45 = <strong>45%</strong>.</p>
<p>Annualized ROI = (14,500 ÷ 10,000)<sup>1/3</sup> − 1 = 1.45<sup>0.3333</sup> − 1 = <strong>13.19% a year</strong>.</p>
<p>If the fund also paid $600 of dividends and you paid $50 in trading fees: ROI = ($15,100 − $10,050) ÷ $10,050 = <strong>50.25%</strong>, or 14.53% a year.</p>`,
  table: {
    title: 'What does a total ROI work out to per year?',
    intro: 'Annualized return for common total ROI figures over different holding periods, calculated with the formula above.',
    head: ['Total ROI', '1 year', '3 years', '5 years', '10 years', '20 years'],
    rows: ({ run }) => [10, 25, 50, 75, 100, 150, 200, 300, 500, -25].map(p => [(p > 0 ? '+' : '') + p + '%', ...[1, 3, 5, 10, 20].map(y => run({ cost: 10000, end: 10000 * (1 + p / 100), income: 0, fees: 0, years: y }).rows[0][1].replace(' a year', ''))]),
    note: 'Doubling your money (100% ROI) in 10 years is 7.18% a year. The same doubling in 5 years is 14.87% a year.'
  },
  sections: [
    {
      h2: 'How do you calculate marketing ROI?',
      html: `<p>Use the same formula with the campaign's cost as the investment, but measure the return as <strong>profit</strong>, not revenue:</p>
<p><strong>Marketing ROI = (Gross profit from the campaign − Campaign cost) ÷ Campaign cost</strong></p>
<p>A $5,000 ad campaign that brings in $20,000 of sales at a 40% gross margin produces $8,000 of gross profit. ROI = ($8,000 − $5,000) ÷ $5,000 = <strong>60%</strong>. Using revenue instead would claim 300%, which overstates the return because it ignores the cost of the goods sold.</p>
<p>Count all campaign costs: ad spend, agency or freelancer fees, creative, software and staff time. Attribute only the sales the campaign actually caused, using a holdout group or a before-and-after baseline where you can. The same method works for SEO, email and SMS programs. For ad platforms that report revenue per dollar of spend, the <a href="/roas-calculator">ROAS calculator</a> is the better fit.</p>`
    },
    {
      h2: 'How do you calculate ROI on a rental property?',
      html: `<p>Investors use two versions:</p>
<ul><li><strong>Cap rate</strong> (as if bought with cash) = Net operating income ÷ Purchase price.</li>
<li><strong>Cash-on-cash return</strong> (with a mortgage) = Annual cash flow after the mortgage payment ÷ Cash you put in.</li></ul>
<p>Example: a $300,000 rental brings in $2,400 a month ($28,800 a year). Taxes, insurance, repairs, vacancy and management cost $9,600, leaving net operating income of $19,200. Cap rate = $19,200 ÷ $300,000 = <strong>6.4%</strong>.</p>
<p>Financed with $75,000 of cash (20% down plus $15,000 of closing costs) and a $240,000 30-year loan at 6.5%, the payment is $1,516.96 a month, or $18,204 a year. Cash flow is $996, so cash-on-cash return is $996 ÷ $75,000 = <strong>1.3%</strong>. Principal paydown (about $2,700 in year one) and any appreciation add to the total return, which is why investors look at all three.</p>`
    },
    {
      h2: 'What is a good return on investment?',
      html: `<p>It depends on the risk you take and the alternatives. Useful yardsticks:</p>
<ul><li><strong>Risk-free:</strong> Treasury bills and high-yield savings pay whatever short-term rates are, and the 10-year Treasury yield was near 4.9% in early November 2026.</li>
<li><strong>U.S. stocks:</strong> about 10% a year on average over the long run before inflation, with large swings from year to year.</li>
<li><strong>Rental real estate:</strong> cap rates of roughly 5–8% are common, before leverage and appreciation.</li>
<li><strong>Business projects:</strong> a project is worth doing if its annual return beats the company's cost of capital. See the <a href="/wacc-calculator">WACC calculator</a>.</li></ul>
<p>Always compare annualized figures. A 30% ROI sounds better than 20%, but not if the 30% took 6 years (4.47% a year) and the 20% took 2 (9.54% a year).</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate ROI as a percentage?', a: 'Divide net profit by the amount invested and multiply by 100. A $2,000 profit on a $10,000 investment is 2,000 ÷ 10,000 × 100 = 20% ROI.' },
    { q: 'What is the ROI formula in Excel?', a: 'With cost in A2 and ending value in B2, use =(B2-A2)/A2 and format as a percentage. For annualized ROI with years in C2, use =(B2/A2)^(1/C2)-1.' },
    { q: 'Can ROI be negative?', a: 'Yes. If you get back less than you put in, ROI is negative. $10,000 that falls to $7,500 is a −25% ROI. A −100% ROI means you lost everything.' },
    { q: 'What is the difference between ROI and annualized ROI?', a: 'ROI is the total gain over the whole holding period. Annualized ROI spreads that gain into an equivalent yearly compound rate, so you can compare a 3-year investment with a 10-year one.' },
    { q: 'Is ROI the same as CAGR?', a: 'Annualized ROI and CAGR use the same formula when there is one amount in and one amount out. Total ROI is not annualized. Use the CAGR calculator for growth of revenue, users or other values over time.' },
    { q: 'How do businesses calculate the ROI of employee health benefits?', a: 'They divide the program\'s net savings (lower medical claims, less absenteeism, lower turnover) minus its cost by the cost. Savings are estimated from claims data and HR records, so results depend heavily on the assumptions.' },
    { q: 'Should taxes be included in ROI?', a: 'For your personal after-tax return, yes: subtract capital gains tax owed on a sale from the amount returned. Published fund and stock returns are almost always shown before taxes.' }
  ],
  related: ['cagr-calculator', 'irr-calculator', 'compound-interest-calculator', 'npv-calculator', 'roas-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Annual return (glossary)', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/annual-return' },
    { name: 'SEC Investor.gov: Glossary of investing terms', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary' },
    { name: 'IRS Topic 409: Capital gains and losses', url: 'https://www.irs.gov/taxtopics/tc409' },
    { name: 'Federal Reserve Bank of St. Louis (FRED): 10-Year Treasury constant maturity rate', url: 'https://fred.stlouisfed.org/series/DGS10' }
  ]
};
