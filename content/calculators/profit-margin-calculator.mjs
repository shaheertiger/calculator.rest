const IND = [
  // Damodaran, NYU Stern, "Operating and Net Margins by Sector (US)", data as of January 2026
  // [industry, firms, gross %, pre-tax unadjusted operating %, net %]
  ['Grocery and food retail', 15, 26.31, 2.29, 1.32],
  ['Auto and truck makers', 33, 10.41, 2.32, 1.29],
  ['Trucking', 26, 21.19, 6.89, 3.79],
  ['Apparel', 35, 56.88, 9.11, 3.85],
  ['Specialty retail', 94, 35.30, 7.73, 5.19],
  ['General retail', 23, 33.18, 6.80, 5.61],
  ['Engineering and construction', 48, 15.46, 6.49, 5.94],
  ['Business and consumer services', 155, 33.38, 12.27, 7.03],
  ['Restaurants and dining', 64, 32.24, 15.79, 9.37],
  ['Homebuilding', 30, 22.70, 12.57, 9.47],
  ['Healthcare products', 204, 54.00, 15.34, 9.61],
  ['Machinery', 105, 37.47, 15.86, 10.58],
  ['Pharmaceuticals', 228, 71.73, 29.54, 18.54],
  ['Software (system and application)', 309, 71.72, 32.98, 25.49],
  ['All U.S. non-financial companies', 4822, 34.39, 13.14, 8.56]
];

export default {
  slug: 'profit-margin-calculator',
  hub: 'business',
  name: 'Profit Margin Calculator',
  title: 'Profit Margin Calculator: $60K Profit on $500K Sales = 12%',
  h1: 'Profit Margin Calculator: Gross, Operating and Net Margin From Your P&L',
  meta: 'A business with $500,000 in revenue and $60,000 of net income has a 12% net profit margin. Enter revenue and costs to get gross, operating and net margins.',
  keyword: 'how to calculate net profit margin',
  also: ['how is net profit margin calculated', 'how to calculate the operating profit margin', 'how do i calculate margin percentage', 'how to calculate e-commerce profit margins', 'how to calculate ebit margin', 'how to calculate the gross profit ratio', 'how to calculate business margin', 'how to calculate profitability of a company'],
  updated: '2026-11-13',
  inputs: [
    { id: 'revenue', label: 'Revenue (net sales)', type: 'number', value: 500000, prefix: '$', help: 'Sales after returns, discounts and allowances.' },
    { id: 'cogs', label: 'Cost of goods sold', type: 'number', value: 300000, prefix: '$', help: 'Product or direct service costs.' },
    { id: 'opex', label: 'Operating expenses', type: 'number', value: 120000, prefix: '$', help: 'Rent, salaries, marketing, software, depreciation.' },
    { id: 'interest', label: 'Interest and other expense (net)', type: 'number', value: 5000, prefix: '$', help: 'Enter a negative number for net other income.' },
    { id: 'taxes', label: 'Income taxes', type: 'number', value: 15000, prefix: '$' }
  ],
  compute(v, H) {
    var rev = v.revenue;
    if (!(rev > 0)) return { error: 'Enter revenue greater than zero.' };
    var cogs = v.cogs || 0, opex = v.opex || 0, other = v.interest || 0, tax = v.taxes || 0;
    if (cogs < 0 || opex < 0) return { error: 'Costs can\'t be negative.' };
    var gp = rev - cogs, op = gp - opex, pre = op - other, net = pre - tax;
    var gm = gp / rev * 100, om = op / rev * 100, pm = pre / rev * 100, nm = net / rev * 100;
    var verdict = nm < 0 ? 'The business is losing ' + H.money0(-net) + ', or ' + H.pct(-nm, 1) + ' of every sales dollar.'
      : 'Each $1 of sales leaves ' + H.money(nm / 100) + ' of profit after all costs and taxes; ' + H.money(1 - gm / 100) + ' goes to cost of goods sold.';
    return {
      value: H.pct(nm, 2),
      label: 'Net profit margin',
      expr: H.money0(net) + ' ÷ ' + H.money0(rev),
      rows: [
        ['Gross profit', H.money0(gp)],
        ['Gross margin', H.pct(gm, 2), true],
        ['Operating income (EBIT)', H.money0(op)],
        ['Operating margin', H.pct(om, 2), true],
        ['Pre-tax margin', H.pct(pm, 2)],
        ['Net income', H.money0(net)]
      ],
      sub: verdict,
      gm: gm, om: om, nm: nm
    };
  },
  quick: ({ r }) => `Net profit margin is net income divided by revenue, times 100. A company with <strong>$500,000</strong> in revenue that keeps <strong>$60,000</strong> after cost of goods, operating expenses, interest and taxes has a <strong>${r.value}</strong> net margin. The same income statement shows a 40% gross margin and a 16% operating margin. Across U.S. non-financial companies, the aggregate net margin was 8.56% in NYU Stern's January 2026 data.`,
  stepsTitle: 'How to calculate net profit margin',
  steps: [
    'Start with <strong>net revenue</strong>: total sales minus returns, refunds and discounts. Using gross sales overstates every margin.',
    'Subtract cost of goods sold to get <strong>gross profit</strong>, then operating expenses to get <strong>operating income</strong> (EBIT).',
    'Subtract interest and other non-operating items, then income taxes, to reach <strong>net income</strong>, the bottom line of the income statement.',
    'Divide each profit figure by net revenue and multiply by 100. Compare the result with the same period last year and with your industry, not with an unrelated business.'
  ],
  formulaTitle: 'What is the net profit margin formula?',
  formula: {
    expr: 'Net profit margin = Net income ÷ Revenue × 100<br>Gross margin = (Revenue − COGS) ÷ Revenue × 100<br>Operating margin = Operating income ÷ Revenue × 100',
    vars: [['Net income', 'revenue minus all expenses, interest and taxes'], ['Operating income', 'gross profit minus operating expenses (EBIT)'], ['COGS', 'cost of goods sold'], ['Revenue', 'net sales for the same period']],
    note: 'All three margins use the same denominator, revenue, so they can be compared line by line down the income statement.'
  },
  example: `<p>A bakery-café reports for the year:</p>
<p>Revenue $500,000 − ingredients and packaging (COGS) $300,000 = gross profit <strong>$200,000</strong> → 40% gross margin.</p>
<p>Gross profit $200,000 − wages, rent and other operating costs $120,000 = operating income <strong>$80,000</strong> → 16% operating margin.</p>
<p>Operating income $80,000 − loan interest $5,000 − income taxes $15,000 = net income <strong>$60,000</strong>.</p>
<p>Net profit margin = $60,000 ÷ $500,000 × 100 = <strong>12%</strong>.</p>`,
  table: {
    title: 'What is a good profit margin by industry?',
    intro: 'Aggregate gross, operating and net margins for U.S. public companies, from Professor Aswath Damodaran\'s NYU Stern dataset (data as of January 2026). Use these as context: small private firms often run on thinner or wider margins than listed companies.',
    head: ['Industry', 'Companies', 'Gross margin', 'Operating margin', 'Net margin'],
    rows: ({ H }) => IND.map(r => [r[0], H.int(r[1]), H.pct(r[2], 2), H.pct(r[3], 2), H.pct(r[4], 2)]),
    note: 'Operating margin is Damodaran\'s pre-tax unadjusted operating margin. Margins are sector totals (total profit ÷ total revenue), not medians, so the largest companies weigh most.'
  },
  sections: [
    {
      h2: 'How do you calculate the operating profit margin?',
      html: `<p>Operating margin = operating income ÷ revenue. Operating income is what the core business earns before interest and taxes: gross profit minus selling, general and administrative costs, research and development, and depreciation. In the example, $80,000 ÷ $500,000 = <strong>16%</strong>.</p>
<p>EBIT margin is usually the same number. They differ only when a company books non-operating gains or losses (a lawsuit settlement, a gain on selling equipment) above the interest line: EBIT includes them, operating income does not. Because it ignores how the business is financed and taxed, operating margin is the fairest way to compare two companies with different debt loads.</p>`
    },
    {
      h2: 'How do you calculate e-commerce profit margins?',
      html: `<p>Online sellers need every per-order cost in the math, not just the product cost. Take a $40 order:</p>
<ul><li>Landed product cost (factory price, freight, duty): $14.00</li><li>Pick, pack and shipping: $7.00</li><li>Card processing at a typical 2.9% + 30¢: $1.46</li><li>Advertising cost per order: $8.00</li></ul>
<p>Profit per order = $40 − $30.46 = $9.54, a <strong>23.9% contribution margin</strong>. The gross margin on the product alone is ($40 − $14) ÷ $40 = 65%, which is why sellers who quote only gross margin are often surprised by their bank balance. Fixed costs (apps, storage, salaries) then come out of the $9.54. To see what ad efficiency that margin can support, use the <a href="/roas-calculator">ROAS calculator</a>.</p>`
    },
    {
      h2: 'Is profit margin the same as markup?',
      html: `<p>No. Margin divides profit by the <em>selling price</em>; markup divides it by the <em>cost</em>. An item that costs $60 and sells for $100 has a 40% margin but a 66.7% markup. Convert with margin = markup ÷ (1 + markup) or markup = margin ÷ (1 − margin). The <a href="/markup-calculator">markup calculator</a> has a full conversion table and works out a selling price from a target margin.</p>`
    },
    {
      h2: 'Why is net margin sometimes higher than operating margin?',
      html: `<p>Net income can exceed operating income when non-operating items are positive: interest earned on a large cash pile, a gain on selling a division or investment, or a tax benefit such as releasing a valuation allowance. When you see it, check whether the boost will repeat next year; one-time gains make net margin a poor guide to future profitability.</p>`
    }
  ],
  faq: [
    { q: 'What is a good net profit margin for a small business?', a: 'It depends on the industry. Grocery retailers in Damodaran\'s January 2026 data earned about 1.3% net, restaurants about 9.4% and system software about 25.5%. A margin above your industry\'s typical level, and rising year over year, is the better test.' },
    { q: 'Is net profit margin the same as gross margin?', a: 'No. Gross margin only subtracts cost of goods sold. Net margin subtracts every expense, including overhead, interest and taxes, so it is always lower unless the business has large non-operating income.' },
    { q: 'Can profit margin be negative?', a: 'Yes. If total expenses exceed revenue, net income is negative and so is the margin. A business with $200,000 of revenue and a $10,000 loss has a −5% net margin.' },
    { q: 'How do I calculate profit margin in Excel?', a: 'With revenue in B1 and net income in B2, enter =B2/B1 and format the cell as a percentage. For gross margin use =(B1-B3)/B1 where B3 holds cost of goods sold.' },
    { q: 'Should I include the owner\'s salary when calculating profit margin?', a: 'For sole proprietors, owner draws are not an expense, so the books can overstate profit. To compare with other businesses or prepare for a sale, deduct a market-rate salary for the work the owner does before calculating the margin.' },
    { q: 'What is the gross profit ratio?', a: 'The gross profit ratio is gross profit divided by net sales, the same figure as gross margin. $200,000 of gross profit on $500,000 of sales is a 0.40 ratio, or 40%.' },
    { q: 'Does profit margin include taxes?', a: 'Net profit margin is after taxes. Operating margin and pre-tax margin are before income taxes, which makes them easier to compare across states and countries with different tax rates.' }
  ],
  related: ['markup-calculator', 'break-even-calculator', 'cogs-calculator', 'roas-calculator', 'business-valuation-calculator'],
  sources: [
    { name: 'U.S. SEC: Beginners\' Guide to Financial Statements', url: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements' },
    { name: 'Aswath Damodaran, NYU Stern: Operating and Net Margins by Sector (US), January 2026', url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/margin.html' },
    { name: 'OpenStax (Rice University): Principles of Accounting, Volume 1: Financial Accounting', url: 'https://openstax.org/details/books/principles-financial-accounting' }
  ]
};
