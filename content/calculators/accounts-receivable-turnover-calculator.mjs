const IND = [
  // Damodaran, NYU Stern, "Working Capital Ratios by Sector (US)", data as of January 2026: [industry, firms, receivables as % of sales]
  ['Grocery and food retail', 15, 1.75],
  ['Restaurants and dining', 64, 5.32],
  ['Food wholesalers', 13, 5.60],
  ['Food processing', 78, 7.76],
  ['Household products', 110, 9.75],
  ['Apparel', 35, 12.53],
  ['Building materials', 41, 13.78],
  ['Hospitals and healthcare facilities', 31, 14.22],
  ['Software (system and application)', 309, 16.84],
  ['Machinery', 105, 19.03],
  ['Computer services', 64, 21.30],
  ['Aerospace and defense', 79, 23.93],
  ['Engineering and construction', 48, 27.52],
  ['All U.S. non-financial companies', 4822, 12.39]
];

export default {
  slug: 'accounts-receivable-turnover-calculator',
  hub: 'business',
  name: 'AR Turnover Calculator',
  title: 'AR Turnover Calculator: $1.2M Credit Sales ÷ $150K = 8.0×',
  h1: 'Accounts Receivable Turnover Calculator With Days Sales Outstanding',
  meta: 'Net credit sales of $1,200,000 and average receivables of $150,000 give an AR turnover of 8.0 and a DSO of 45.6 days. Compare with your terms and your industry.',
  keyword: 'how to calculate accounts receivable turnover',
  also: ['accounts receivable turnover calculator', 'receivables turnover ratio', 'how do you calculate days sales outstanding', 'dso calculator', 'how to calculate net accounts receivable', 'how to calculate cash collected from accounts receivable', 'how to calculate days sales uncollected', 'how to calculate net receivables'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sales', label: 'Net credit sales for the period', type: 'number', value: 1200000, prefix: '$', help: 'Sales on account minus returns and allowances. Leave out cash sales.' },
    { id: 'arBeg', label: 'Accounts receivable at start', type: 'number', value: 140000, prefix: '$' },
    { id: 'arEnd', label: 'Accounts receivable at end', type: 'number', value: 160000, prefix: '$' },
    { id: 'days', label: 'Days in the period', type: 'number', value: 365, suffix: 'days' },
    { id: 'terms', label: 'Your payment terms (optional)', type: 'number', value: 30, suffix: 'days', help: 'e.g. 30 for net 30.' }
  ],
  compute(v, H) {
    if (!(v.sales > 0)) return { error: 'Enter net credit sales for the period.' };
    if (!(v.arBeg >= 0) || !(v.arEnd >= 0)) return { error: 'Enter receivables at the start and end of the period.' };
    var avg = (v.arBeg + v.arEnd) / 2;
    if (!(avg > 0)) return { error: 'Average receivables must be above zero.' };
    var days = v.days > 0 ? v.days : 365, t = v.sales / avg, dso = days / t;
    var rows = [
      ['Days sales outstanding (DSO)', H.fix(dso, 1) + ' days', true],
      ['Average accounts receivable', H.money0(avg)],
      ['Cash collected from customers', H.money0(v.arBeg + v.sales - v.arEnd)],
      ['Average credit sales per day', H.money0(v.sales / days)]
    ];
    var sub = 'Customers pay, on average, ' + H.num(dso, 0) + ' days after the sale.';
    if (v.terms > 0) {
      var gap = dso - v.terms;
      rows.push(['DSO vs. terms', gap > 0 ? H.fix(gap, 1) + ' days slower' : H.fix(-gap, 1) + ' days faster']);
      rows.push(['Cash freed if DSO met terms', gap > 0 ? H.money0(gap * v.sales / days) : '$0']);
      sub = gap > 0 ? 'Collections run ' + H.num(gap, 0) + ' days behind your ' + H.num(v.terms, 0) + '-day terms, tying up about ' + H.money0(gap * v.sales / days) + ' of cash.' : 'Customers pay within your ' + H.num(v.terms, 0) + '-day terms on average.';
    }
    return {
      value: H.fix(t, 2) + '×',
      label: 'AR turnover (times per period)',
      expr: H.money0(v.sales) + ' ÷ ' + H.money0(avg),
      rows: rows,
      sub: sub,
      t: t, dso: dso
    };
  },
  quick: ({ r }) => `Accounts receivable turnover = net credit sales ÷ average accounts receivable. A company with <strong>$1,200,000</strong> of annual credit sales and receivables of $140,000 at the start and $160,000 at the end averages $150,000, so its turnover is <strong>${r.value}</strong>. That means customers pay in about 365 ÷ 8 = <strong>45.6 days</strong> (DSO), 15.6 days slower than net-30 terms.`,
  stepsTitle: 'How to calculate accounts receivable turnover',
  steps: [
    'Find <strong>net credit sales</strong> for the period: sales on account minus returns and allowances. Including cash sales is the common mistake; it inflates turnover and makes collections look faster than they are.',
    'Average the receivables balance: (beginning AR + ending AR) ÷ 2. Use net receivables, after the allowance for doubtful accounts, and be consistent from year to year.',
    'Divide net credit sales by average receivables. The answer is how many times you collected your average balance during the period.',
    'Divide the days in the period by the turnover to get days sales outstanding, and compare it with your payment terms.'
  ],
  formulaTitle: 'What is the accounts receivable turnover formula?',
  formula: {
    expr: 'AR turnover = Net credit sales ÷ Average accounts receivable<br>Average AR = (Beginning AR + Ending AR) ÷ 2<br>DSO = Days in period ÷ AR turnover = Average AR ÷ Net credit sales × Days',
    vars: [['Net credit sales', 'sales on account − returns and allowances'], ['Accounts receivable', 'amounts customers owe, net of the allowance for doubtful accounts'], ['DSO', 'days sales outstanding, also called the average collection period']],
    note: 'For a quarter, use quarterly credit sales and 90 or 91 days so turnover and DSO stay comparable.'
  },
  example: `<p>An industrial supplier sold $1,200,000 on net-30 terms last year. Receivables were $140,000 on January 1 and $160,000 on December 31.</p>
<p>Average AR = ($140,000 + $160,000) ÷ 2 = <strong>$150,000</strong>. Turnover = $1,200,000 ÷ $150,000 = <strong>8.0 times</strong>.</p>
<p>DSO = 365 ÷ 8 = <strong>45.6 days</strong>, 15.6 days beyond its terms. At $3,288 of credit sales per day ($1,200,000 ÷ 365), bringing DSO down to 30 days would free about <strong>$51,370</strong> of cash.</p>`,
  table: {
    title: 'What is a good accounts receivable turnover ratio by industry?',
    intro: 'Implied AR turnover and DSO for U.S. public companies, computed with the calculator from the receivables-to-sales ratios in Professor Aswath Damodaran\'s NYU Stern working-capital dataset (data as of January 2026).',
    head: ['Industry', 'Companies', 'Receivables ÷ sales', 'Implied AR turnover', 'Implied DSO'],
    rows: ({ run, H }) => IND.map(r => { const x = run({ sales: 100, arBeg: r[2], arEnd: r[2], days: 365, terms: NaN }); return [r[0], H.int(r[1]), H.fix(r[2], 2) + '%', H.fix(x.t, 1) + '×', H.fix(x.dso, 0) + ' days']; }),
    note: 'Damodaran\'s ratio divides year-end receivables by total sales, including cash sales, so businesses with many card or cash sales (grocers, restaurants) look faster than a credit-only calculation would show.'
  },
  sections: [
    {
      h2: 'How do you calculate days sales outstanding?',
      html: `<p>DSO = average accounts receivable ÷ net credit sales × days in the period, which is the same as days ÷ AR turnover. In the example, $150,000 ÷ $1,200,000 × 365 = 45.6 days. Many finance teams calculate it monthly using the month's ending AR and the last 90 days of credit sales.</p>
<p>The <strong>countback method</strong> is more accurate when sales swing month to month: start with ending AR, subtract the most recent month's credit sales (counting its days), then the prior month's, until AR is used up. If AR is $160,000 and the last two months' credit sales were $110,000 (30 days) and $100,000 (31 days), DSO = 30 + 31 × ($50,000 ÷ $100,000) = <strong>45.5 days</strong>.</p>`
    },
    {
      h2: 'How do you calculate net accounts receivable?',
      html: `<p>Net accounts receivable = gross accounts receivable − allowance for doubtful accounts. If customers owe $168,000 and you expect $8,000 of it to go uncollected, net receivables are <strong>$160,000</strong>, the amount reported on the balance sheet.</p>
<p>The allowance is usually estimated from an aging schedule (for example, 1% of current balances, 5% of 31–60 days, 20% of 61–90 days, 50% of over 90 days) or as a percentage of credit sales. Writing off a specific bad account reduces both gross AR and the allowance, so net AR doesn't change.</p>`
    },
    {
      h2: 'How do you calculate cash collected from accounts receivable?',
      html: `<p>Cash collected = beginning AR + credit sales − ending AR − write-offs. With $140,000 beginning AR, $1,200,000 of credit sales, $160,000 ending AR and $5,000 written off, collections were $140,000 + $1,200,000 − $160,000 − $5,000 = <strong>$1,175,000</strong>. The calculator shows the figure before write-offs ($1,180,000).</p>
<p>This is the same reconciliation used in the indirect method of the cash flow statement: an increase in receivables is subtracted from net income because the sales were booked but not yet collected.</p>`
    },
    {
      h2: 'How can you improve a low AR turnover?',
      html: `<ul><li>Invoice the day goods ship or work is done, with the due date and payment link on the invoice.</li><li>Offer an early-payment discount such as 2/10 net 30 (2% off if paid in 10 days) to customers who can pay early.</li><li>Follow an aging report weekly and contact accounts the day they pass due.</li><li>Check credit before extending terms to new customers, and set credit limits.</li><li>Accept card and ACH payments so customers can pay instantly.</li></ul>
<p>Faster collections also improve the <a href="/current-ratio-calculator">current ratio</a>'s quality: a dollar of cash is worth more to lenders than a dollar of slow receivables.</p>`
    }
  ],
  faq: [
    { q: 'What is a good accounts receivable turnover ratio?', a: 'One that keeps DSO close to your payment terms. For net-30 terms, a turnover near 365 ÷ 30 ≈ 12 is excellent; a ratio of 8 (DSO 45.6 days) means customers pay about two weeks late on average.' },
    { q: 'Is a higher AR turnover better?', a: 'Usually, because it means faster collection and less cash tied up. A very high ratio can also signal credit terms so strict that they cost you sales.' },
    { q: 'What if I don\'t know my credit sales?', a: 'Use total net sales, but note the result overstates turnover if part of your sales are paid in cash at the time of sale. Use the same basis every period so the trend is meaningful.' },
    { q: 'How do you calculate days sales uncollected?', a: 'Days sales uncollected = ending accounts receivable ÷ net sales × 365. With $160,000 of ending AR and $1,200,000 of sales, it is 48.7 days. It uses the year-end balance instead of the average.' },
    { q: 'How do I calculate AR turnover in Excel?', a: 'With credit sales in B1, beginning AR in B2 and ending AR in B3, use =B1/AVERAGE(B2:B3) for turnover and =365/(B1/AVERAGE(B2:B3)) for DSO.' },
    { q: 'Is DSO the same as the average collection period?', a: 'Yes. Days sales outstanding, average collection period and days receivable all mean average receivables expressed as days of credit sales.' },
    { q: 'Should AR turnover use gross or net receivables?', a: 'Most analysts use net receivables from the balance sheet, after the allowance for doubtful accounts. Either works if you are consistent across periods.' }
  ],
  related: ['current-ratio-calculator', 'average-inventory-calculator', 'debt-to-equity-calculator', 'profit-margin-calculator'],
  sources: [
    { name: 'OpenStax (Rice University): Principles of Accounting, Volume 1, Ch. 9: Accounting for Receivables', url: 'https://openstax.org/details/books/principles-financial-accounting' },
    { name: 'Aswath Damodaran, NYU Stern: Working Capital Ratios by Sector (US), January 2026', url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/wcdata.html' },
    { name: 'U.S. SEC: Beginners\' Guide to Financial Statements', url: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements' }
  ]
};
