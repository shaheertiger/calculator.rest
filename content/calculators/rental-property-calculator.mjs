export default {
  slug: 'rental-property-calculator',
  hub: 'mortgage',
  name: 'Rental Property Cash Flow Calculator',
  title: 'Rental Property Calculator: $2,300 Rent Nets $125/Month',
  h1: 'Rental Property Cash Flow Calculator With Cap Rate and Cash-on-Cash',
  meta: 'A $250,000 rental with 25% down at 7.25% and $2,300 rent clears about $125 a month after every expense: a 6.74% cap rate and 2.15% cash-on-cash return.',
  keyword: 'how to calculate cash flow on rental property',
  also: ['how to calculate rental yield', 'rental property calculator', 'how to calculate cash on cash return', 'rental property cash flow calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'price', label: 'Purchase price', type: 'number', value: 250000, prefix: '$' },
    { id: 'downPct', label: 'Down payment', type: 'number', value: 25, suffix: '%' },
    { id: 'rate', label: 'Mortgage rate', type: 'number', value: 7.25, suffix: '%' },
    { id: 'term', label: 'Loan term', type: 'select', value: '30', options: [['30', '30 years'], ['20', '20 years'], ['15', '15 years']] },
    { id: 'closing', label: 'Closing costs and initial repairs', type: 'number', value: 7500, prefix: '$' },
    { id: 'rent', label: 'Monthly rent', type: 'number', value: 2300, prefix: '$' },
    { id: 'vacancy', label: 'Vacancy', type: 'number', value: 5, suffix: '% of rent' },
    { id: 'tax', label: 'Property tax', type: 'number', value: 3000, prefix: '$', suffix: '/ yr' },
    { id: 'ins', label: 'Insurance', type: 'number', value: 1400, prefix: '$', suffix: '/ yr' },
    { id: 'repairs', label: 'Repairs and maintenance', type: 'number', value: 5, suffix: '% of rent' },
    { id: 'capex', label: 'Capital reserves (roof, HVAC…)', type: 'number', value: 5, suffix: '% of rent' },
    { id: 'mgmt', label: 'Property management', type: 'number', value: 8, suffix: '% of rent' },
    { id: 'other', label: 'HOA, utilities and other costs', type: 'number', value: 0, prefix: '$', suffix: '/ mo' }
  ],
  compute(v, H) {
    if (!(v.price > 0)) return { error: 'Enter the purchase price.' };
    if (!(v.rent >= 0)) return { error: 'Enter the monthly rent.' };
    var z = function (x) { return x > 0 ? x : 0; };
    var dp = Math.min(100, z(v.downPct)) / 100;
    var loan = v.price * (1 - dp);
    var pi = loan > 0 ? H.pmt(z(v.rate) / 1200, (Number(v.term) || 30) * 12, loan) : 0;
    var gsi = v.rent * 12;
    var egi = gsi * (1 - z(v.vacancy) / 100);
    var pctCosts = gsi * (z(v.repairs) + z(v.capex) + z(v.mgmt)) / 100;
    var opex = z(v.tax) + z(v.ins) + z(v.other) * 12 + pctCosts;
    var noi = egi - opex;
    var debt = pi * 12;
    var cf = noi - debt;
    var cash = v.price * dp + z(v.closing);
    var cap = noi / v.price * 100;
    var coc = cash > 0 ? cf / cash * 100 : NaN;
    var be = (opex - pctCosts + debt) / (12 * ((1 - z(v.vacancy) / 100) - (z(v.repairs) + z(v.capex) + z(v.mgmt)) / 100));
    var sign = function (x, f) { return (x < 0 ? '−' : '') + f(Math.abs(x)); };
    return {
      value: sign(cf / 12, H.money) ,
      label: 'Monthly cash flow',
      expr: H.money0(noi) + ' NOI − ' + H.money0(debt) + ' debt ÷ 12',
      rows: [
        ['Annual cash flow', sign(cf, H.money0), true],
        ['Net operating income (NOI)', H.money0(noi)],
        ['Cap rate', H.pct(cap, 2), true],
        ['Cash-on-cash return', isFinite(coc) ? sign(coc, function (x) { return H.pct(x, 2); }) : '—', true],
        ['Gross rental yield', H.pct(gsi / v.price * 100, 2)],
        ['Mortgage payment (P&amp;I)', H.money(pi) + '/mo'],
        ['Operating expenses', H.money0(opex) + '/yr (' + H.pct(egi > 0 ? opex / egi * 100 : 0, 0) + ' of collected rent)'],
        ['Debt service coverage (DSCR)', debt > 0 ? H.fix(noi / debt, 2) : 'no loan'],
        ['Cash invested', H.money0(cash)],
        ['Break-even rent', be > 0 && isFinite(be) ? H.money0(be) + '/mo' : '—']
      ],
      sub: cf >= 0 ? 'Positive cash flow, before income tax. Principal paydown (about ' + H.money0(loan > 0 ? (pi - loan * z(v.rate) / 1200) * 12 : 0) + ' in year 1) and appreciation add to the total return.' : 'Negative cash flow: you would add ' + H.money0(-cf / 12) + ' a month. Rent would need to reach ' + H.money0(be) + ' to break even.'
    };
  },
  quick: ({ r }) => `Rental cash flow is rent collected minus operating expenses (net operating income) minus the mortgage payment. A <strong>$250,000</strong> rental with 25% down at 7.25% and <strong>$2,300</strong> rent produces ${r.rows[1][1]} of NOI and ${r.rows[0][1]} a year after the mortgage, about <strong>${r.value} a month</strong>. That is a ${r.rows[2][1]} cap rate and a ${r.rows[3][1]} cash-on-cash return.`,
  stepsTitle: 'How to calculate cash flow on a rental property',
  steps: [
    'Start with gross scheduled rent (monthly rent × 12) and subtract vacancy. 5% assumes the unit sits empty about 18 days a year; use more in a soft market.',
    'Subtract operating expenses: property tax, insurance, repairs, capital reserves, management, HOA and any utilities you pay. Leaving out capital reserves for the roof, HVAC and appliances is the mistake that makes most deals look better than they are.',
    'The result is net operating income (NOI). Divide it by the price for the cap rate.',
    'Subtract the yearly mortgage payment (principal and interest) to get cash flow, and divide cash flow by the cash you put in (down payment plus closing and repair costs) for cash-on-cash return.'
  ],
  formulaTitle: 'What are the rental property formulas?',
  formula: {
    expr: 'NOI = rent × 12 × (1 − vacancy) − operating expenses<br>Cash flow = NOI − annual mortgage payments<br>Cap rate = NOI ÷ price · Cash-on-cash = cash flow ÷ cash invested · DSCR = NOI ÷ debt payments',
    vars: [['operating expenses', 'tax, insurance, repairs, reserves, management, HOA, utilities (not the mortgage)'], ['cash invested', 'down payment + closing costs + upfront repairs'], ['DSCR', 'debt service coverage ratio; lenders often want 1.20 or more']],
    note: 'Percent-of-rent costs (repairs, reserves, management) are applied to gross scheduled rent here, a common conservative convention.'
  },
  example: `<p>Rent: $2,300 × 12 = $27,600, less 5% vacancy = <strong>$26,220</strong> collected.</p>
<p>Expenses: $3,000 tax + $1,400 insurance + 18% of $27,600 for repairs, reserves and management ($4,968) = <strong>$9,368</strong>. NOI = $26,220 − $9,368 = <strong>$16,852</strong>.</p>
<p>Loan $187,500 at 7.25% for 30 years = $1,279.08 a month, $15,349 a year. Cash flow = $16,852 − $15,349 = <strong>$1,503</strong> a year, $125 a month.</p>
<p>Cap rate = $16,852 ÷ $250,000 = 6.74%. Cash invested = $62,500 + $7,500 = $70,000, so cash-on-cash = $1,503 ÷ $70,000 = 2.15%.</p>`,
  table: {
    title: 'How does rent change cash flow and return?',
    intro: 'The default $250,000 property re-run at different rents.',
    head: ['Monthly rent', 'Rent ÷ price', 'Monthly cash flow', 'Cap rate', 'Cash-on-cash'],
    rows: ({ run }) => [1800, 1950, 2100, 2200, 2300, 2400, 2500, 2750, 3000].map(x => {
      const o = run({ rent: x });
      return ['$' + x.toLocaleString('en-US'), (x / 2500).toFixed(2) + '%', o.value, o.rows[2][1], o.rows[3][1]];
    }),
    note: 'Each extra $100 of rent adds $77 of monthly cash flow here, because vacancy and percentage-based costs take the rest.'
  },
  sections: [
    {
      h2: 'What is a good cash-on-cash return and cap rate?',
      html: `<p>There is no single standard, but many small landlords look for a cash-on-cash return of <strong>8% or more</strong> to compensate for the work and risk, and accept less where they expect strong appreciation. Cap rates depend on the market and property type: lower in expensive, fast-growing metros, higher in cheaper or slower ones. A useful check is to compare the cap rate with your mortgage rate. When the cap rate is below the loan rate, as in the example (6.74% versus 7.25%), borrowing reduces your return instead of boosting it, which is why the cash-on-cash return is only about 2%.</p>
<p>Put 40% down instead of 25% and cash flow rises to about $381 a month and cash-on-cash to 4.25%. When the loan costs more than the property earns, less debt improves the return, the opposite of what leverage usually promises.</p>`
    },
    {
      h2: 'What are the 1% rule and the 50% rule?',
      html: `<p>The <strong>1% rule</strong> says monthly rent should be at least 1% of the purchase price ($2,500 on a $250,000 home) for a property to have a chance at positive cash flow with a mortgage. The <strong>50% rule</strong> estimates that operating expenses, not counting the mortgage, will eat about half of the rent over time. Both are quick screens, not analysis.</p>
<p>The example property rents at 0.92% of price and its expenses are 36% of collected rent, because it has no HOA and the owner pays no utilities. Older homes, high-tax states or tenant-paid utilities shifting to the owner can push expenses toward the 50% level quickly; use the inputs above to run the real numbers.</p>`
    },
    {
      h2: 'How do taxes and depreciation affect rental cash flow?',
      html: `<p>Rental income is taxable, but you deduct operating expenses, mortgage interest and <strong>depreciation</strong>. Residential rental buildings are depreciated over 27.5 years; land is not depreciable. If $200,000 of the $250,000 price is the building, depreciation is about $7,273 a year, enough to make this property show a tax loss even though it produces cash.</p>
<p>Losses from rentals are passive. If you actively participate and your modified AGI is under $100,000, you can deduct up to $25,000 of rental losses against other income; the allowance phases out by $150,000. When you sell, depreciation is recaptured and taxed at up to 25%. IRS Publications 527, 946 and 925 cover the details.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate ROI on a rental property?', a: 'For cash return, divide annual cash flow by the cash you invested: $1,503 ÷ $70,000 = 2.15% in the example. For total return, add principal paydown and appreciation to the cash flow before dividing.' },
    { q: 'How do you calculate rental yield?', a: 'Gross yield is annual rent ÷ price: $27,600 ÷ $250,000 = 11.04%. Net yield uses NOI instead: $16,852 ÷ $250,000 = 6.74%, the same as the cap rate.' },
    { q: 'What is a good monthly cash flow per rental?', a: 'Many investors aim for at least $100 to $200 per door per month after all expenses including reserves. The default example is around $125, positive but thin.' },
    { q: 'Should mortgage principal count as an expense?', a: 'It reduces cash flow because you pay it, but it is not an operating expense and is not tax deductible. It builds equity, so it counts toward total return rather than NOI.' },
    { q: 'How much should I budget for repairs and capital expenses?', a: 'A common starting point is 5% to 10% of rent for repairs and another 5% to 10% for big-ticket replacements, or about 1% to 2% of the property value per year combined. Older homes need the higher end.' },
    { q: 'What DSCR do lenders require?', a: 'Many investment-property lenders want a debt service coverage ratio of at least 1.20 to 1.25, meaning NOI covers the mortgage by 20% to 25%. The example\'s 1.10 would be tight for a DSCR loan.' }
  ],
  related: ['cap-rate-calculator', 'vacancy-rate-calculator', 'rent-or-sell-house-calculator', 'roi-calculator', 'mortgage-calculator'],
  sources: [
    { name: 'IRS: Publication 527, Residential Rental Property', url: 'https://www.irs.gov/forms-pubs/about-publication-527' },
    { name: 'IRS: Publication 946, How to Depreciate Property', url: 'https://www.irs.gov/forms-pubs/about-publication-946' },
    { name: 'IRS: Publication 925, Passive Activity and At-Risk Rules', url: 'https://www.irs.gov/forms-pubs/about-publication-925' },
    { name: 'U.S. Census Bureau: Housing Vacancies and Homeownership', url: 'https://www.census.gov/housing/hvs/index.html' }
  ]
};
