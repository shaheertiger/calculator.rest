export default {
  slug: 'business-valuation-calculator',
  hub: 'business',
  name: 'Business Valuation Calculator',
  title: 'Business Valuation Calculator: $230K SDE × 2.5 = $575,000',
  h1: 'Business Valuation Calculator: What Your Business Could Sell For',
  meta: 'A small business with $230,000 of seller\'s discretionary earnings at a 2.5× multiple is worth about $575,000. Value it on SDE, EBITDA or revenue.',
  keyword: 'how to calculate the value of a business for sale',
  also: ['business valuation calculator', 'how to calculate sde', 'how do you calculate equity value'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Valuation method', type: 'select', value: 'sde', options: [['sde', 'SDE multiple (owner-operated, under ~$5M)'], ['ebitda', 'EBITDA multiple (managed, larger)'], ['revenue', 'Revenue multiple (quick check)']] },
    { id: 'revenue', label: 'Annual revenue', type: 'number', value: 1200000, prefix: '$' },
    { id: 'profit', label: 'Pre-tax net profit', type: 'number', value: 120000, prefix: '$', help: 'From the tax return or P&L, before income tax.' },
    { id: 'owner', label: 'Owner salary and benefits', type: 'number', value: 80000, prefix: '$', help: 'One working owner\'s pay, payroll taxes, health insurance, retirement.' },
    { id: 'interest', label: 'Interest expense', type: 'number', value: 10000, prefix: '$' },
    { id: 'da', label: 'Depreciation and amortization', type: 'number', value: 15000, prefix: '$' },
    { id: 'addbacks', label: 'One-time or personal expenses', type: 'number', value: 5000, prefix: '$', help: 'Non-recurring legal bills, owner\'s personal car or travel run through the business.' },
    { id: 'sdeMult', label: 'SDE multiple', type: 'number', value: 2.5, suffix: '×', showIf: { method: ['sde'] } },
    { id: 'ebitdaMult', label: 'EBITDA multiple', type: 'number', value: 4.5, suffix: '×', showIf: { method: ['ebitda'] } },
    { id: 'revMult', label: 'Revenue multiple', type: 'number', value: 0.5, suffix: '×', showIf: { method: ['revenue'] } },
    { id: 'inventory', label: 'Inventory sold on top (optional)', type: 'number', value: 0, prefix: '$', help: 'Many small-business prices exclude inventory, which is added at cost.' }
  ],
  compute(v, H) {
    var nz = function (x) { return x >= 0 || x < 0 ? x : 0; };
    if (!(v.profit === v.profit)) return { error: 'Enter pre-tax net profit (negative if a loss).' };
    var ebitda = v.profit + nz(v.interest) + nz(v.da) + nz(v.addbacks);
    var sde = ebitda + nz(v.owner);
    var inv = v.inventory > 0 ? v.inventory : 0;
    var base, mult, label, basis;
    if (v.method === 'ebitda') { base = ebitda; mult = v.ebitdaMult; label = 'Adjusted EBITDA'; basis = 'ebitda'; }
    else if (v.method === 'revenue') { base = v.revenue; mult = v.revMult; label = 'Revenue'; basis = 'revenue'; }
    else { base = sde; mult = v.sdeMult; label = 'SDE'; basis = 'sde'; }
    if (!(mult > 0)) return { error: 'Enter a multiple greater than zero.' };
    if (!(base > 0)) return { error: basis === 'revenue' ? 'Enter annual revenue.' : 'Earnings are zero or negative, so an earnings multiple gives no value. Try an asset-based valuation instead.' };
    var value = base * mult;
    var rows = [
      ['Seller\'s discretionary earnings (SDE)', H.money0(sde), basis === 'sde'],
      ['Adjusted EBITDA', H.money0(ebitda), basis === 'ebitda'],
      ['Range at ' + H.num(mult * 0.8, 2) + '× to ' + H.num(mult * 1.2, 2) + '× (±20%)', H.money0(base * mult * 0.8) + ' to ' + H.money0(base * mult * 1.2)]
    ];
    if (v.revenue > 0) {
      rows.push(['Implied revenue multiple', H.num((value) / v.revenue, 2) + '×']);
      rows.push(['SDE margin', H.fix(sde / v.revenue * 100, 1) + '%']);
    }
    if (basis !== 'ebitda' && ebitda > 0) rows.push(['Implied EBITDA multiple', H.num(value / ebitda, 2) + '×']);
    if (inv > 0) rows.push(['Price including inventory', H.money0(value + inv), true]);
    return {
      value: H.money0(value),
      label: 'Estimated business value (' + label + ' method)',
      expr: H.money0(base) + ' ' + label + ' × ' + H.num(mult, 2),
      rows: rows,
      sub: 'Cash-free, debt-free enterprise value: the seller keeps the cash, pays off debts at closing' + (inv > 0 ? ', and inventory is added at cost.' : '.')
    };
  },
  quick: ({ r }) => `Most small businesses are valued at a multiple of seller's discretionary earnings (SDE): pre-tax profit plus the owner's pay, interest, depreciation and one-time expenses. A shop with $120,000 of profit and $110,000 of add-backs has $230,000 of SDE; at a typical <strong>2.5× multiple</strong> it is worth about <strong>${r.value}</strong>, roughly 0.48× its $1.2 million revenue.`,
  stepsTitle: 'How to calculate the value of a business for sale',
  steps: [
    'Start with <strong>pre-tax net profit</strong> from the last full year (buyers usually check three years of tax returns).',
    'Add back the <strong>owner\'s salary and benefits</strong>, interest, depreciation and amortization, and one-time or personal expenses run through the business. The result is SDE. Add back only what a buyer would not have to pay; inflating add-backs is the fastest way to lose a buyer\'s trust.',
    'Choose a <strong>multiple</strong> from comparable sales in your industry and size. Owner-run businesses usually sell for about 2–3.5× SDE; larger companies with managers in place trade on EBITDA, often 4–7×.',
    'Multiply earnings by the multiple, then adjust: add inventory if it is sold separately, and remember that the seller normally pays off business debt from the proceeds.'
  ],
  formulaTitle: 'What formula is used to value a small business?',
  formula: {
    expr: 'SDE = Pre-tax profit + Owner pay + Interest + D&amp;A + One-time expenses<br>Adjusted EBITDA = Pre-tax profit + Interest + D&amp;A + One-time expenses<br>Value = Earnings × Multiple (+ inventory if sold separately)<br>Equity value = Enterprise value − Debt + Cash',
    vars: [['SDE', 'seller\'s discretionary earnings: total benefit to one full-time owner'], ['EBITDA', 'earnings before interest, taxes, depreciation and amortization, after paying a market-rate manager'], ['D&amp;A', 'depreciation and amortization'], ['Multiple', 'price ÷ earnings seen in comparable sales']]
  },
  example: `<p>A residential HVAC company had $1.2 million of revenue and $120,000 of pre-tax profit. The owner paid herself $80,000 including benefits; the books also show $10,000 of loan interest, $15,000 of depreciation and a $5,000 one-time legal bill.</p>
<p>SDE = $120,000 + $80,000 + $10,000 + $15,000 + $5,000 = <strong>$230,000</strong>.</p>
<p>At 2.5× SDE the business is worth <strong>$575,000</strong>; the 2.0–3.0× range is $460,000 to $690,000.</p>
<p>A buyer who would hire a general manager instead looks at adjusted EBITDA of $150,000 (SDE minus the owner's pay). At 4.5× that is $675,000, showing why the method has to match the buyer.</p>`,
  table: {
    title: 'What is a business worth at different multiples?',
    intro: 'Value of the example business at common multiples of its $230,000 SDE and $150,000 adjusted EBITDA.',
    head: ['Multiple', 'On SDE ($230,000)', 'On EBITDA ($150,000)'],
    rows: ({ run }) => [1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7].map(m => [m + '×', run({ method: 'sde', sdeMult: m, inventory: 0 }).value, run({ method: 'ebitda', ebitdaMult: m, inventory: 0 }).value]),
    note: 'SDE multiples above about 4× are rare for owner-operated businesses; EBITDA multiples below 3× usually signal a small or risky company.'
  },
  sections: [
    {
      h2: 'What is SDE and how do you calculate it?',
      html: `<p>Seller's discretionary earnings is the total financial benefit one full-time owner-operator gets from the business in a year. Start from pre-tax profit and add back:</p>
<ul><li>one owner's salary, payroll taxes and benefits (health insurance, retirement contributions)</li>
<li>interest expense, because the buyer will finance the deal their own way</li>
<li>depreciation and amortization, which are non-cash</li>
<li>one-time costs (a lawsuit, a move) and personal expenses run through the business</li></ul>
<p>Do not add back a second owner's pay if that person does real work a buyer would need to replace, and do not add back rent you pay yourself above market rate without adjusting it to market. Buyers and lenders will rebuild SDE from your tax returns, so keep a schedule that ties every add-back to a document.</p>`
    },
    {
      h2: 'Should you use an SDE or EBITDA multiple?',
      html: `<p>Use <strong>SDE</strong> when the buyer will run the business personally, which covers most Main Street sales such as restaurants, salons, trades and retail shops. Use <strong>EBITDA</strong> when the business has a management team and the buyer is a company or investor who will pay a manager. Because EBITDA is SDE minus the owner's pay, an EBITDA multiple is always higher for the same price.</p>
<p>Revenue multiples are a rough cross-check, mainly for fast-growing or subscription companies that are not yet profitable. Two businesses with the same revenue and different margins are worth very different amounts, so do not price on revenue alone.</p>`
    },
    {
      h2: 'What multiple do small businesses sell for?',
      html: `<p>BizBuySell's quarterly Insight Report, which tracks small businesses sold through brokers, has put the average cash-flow (SDE) multiple at roughly 2.5–2.7× in recent years. Within that average, the multiple moves with:</p>
<ul><li><strong>Size:</strong> businesses with more SDE get higher multiples.</li>
<li><strong>Owner dependence:</strong> if customers follow the owner, the multiple drops.</li>
<li><strong>Customer concentration:</strong> one customer above 20% of sales is a red flag.</li>
<li><strong>Trend:</strong> three years of growth earns a premium; a declining year discounts it.</li>
<li><strong>Recurring revenue, transferable leases, licenses and trained staff</strong> all push it up.</li></ul>`
    },
    {
      h2: 'How do you calculate equity value from enterprise value?',
      html: `<p>A multiple of SDE or EBITDA gives enterprise value: the price for the operating business, cash-free and debt-free. Equity value is what the owners actually receive: <strong>enterprise value − debt + cash</strong>. A business valued at $575,000 with a $90,000 equipment loan and $25,000 of excess cash has an equity value of $575,000 − $90,000 + $25,000 = $510,000. For public companies, equity value is the market capitalization: share price × shares outstanding.</p>
<p>The IRS requires buyer and seller in an asset sale to allocate the price across asset classes on Form 8594, which affects taxes for both sides, so agree on the allocation before closing.</p>`
    }
  ],
  faq: [
    { q: 'What is the rule of thumb for valuing a small business?', a: 'A common rule of thumb is 2 to 3 times seller\'s discretionary earnings, plus inventory at cost. Industry guides also quote revenue rules, such as a percentage of annual sales, but earnings-based multiples are more reliable.' },
    { q: 'How do you value a business with no profit?', a: 'Earnings multiples do not work when SDE is zero or negative. Use the value of the assets (equipment, inventory, receivables) less liabilities, or a revenue multiple if the company is growing fast and has a clear path to profit.' },
    { q: 'Is inventory included in the sale price?', a: 'Often not. Many small-business listings quote a price "plus inventory", with inventory counted and paid for at cost at closing. Check the listing or letter of intent; the calculator has a field to add it.' },
    { q: 'How many years of financials do buyers look at?', a: 'Usually three years of tax returns and profit-and-loss statements, plus the current year to date. Lenders financing the deal ask for the same.' },
    { q: 'Can I get an SBA loan to buy a business?', a: 'Yes. SBA 7(a) loans are commonly used for business acquisitions. The lender will review the seller\'s tax returns and may require an independent business valuation, depending on the loan size and SBA rules.' },
    { q: 'What is the difference between SDE and EBITDA?', a: 'SDE adds back one owner\'s full compensation; EBITDA keeps a market-rate salary for whoever runs the business. For an owner earning $80,000, SDE is $80,000 higher than EBITDA.' },
    { q: 'Do I need a professional appraisal?', a: 'For a quick estimate, no. For an SBA-financed sale, a partnership buyout, a divorce, an estate or a gift tax filing, a credentialed business appraiser\'s report is usually required or strongly advisable.' }
  ],
  related: ['shark-tank-valuation-calculator', 'profit-margin-calculator', 'pe-ratio-calculator', 'payback-period-calculator', 'depreciation-calculator'],
  sources: [
    { name: 'U.S. Small Business Administration: Buy an existing business or franchise', url: 'https://www.sba.gov/business-guide/plan-your-business/buy-existing-business-or-franchise' },
    { name: 'U.S. Small Business Administration: 7(a) loans', url: 'https://www.sba.gov/funding-programs/loans/7a-loans' },
    { name: 'IRS: Sale of a business', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/sale-of-a-business' },
    { name: 'IRS: About Form 8594, Asset Acquisition Statement', url: 'https://www.irs.gov/forms-pubs/about-form-8594' },
    { name: 'BizBuySell Insight Report (quarterly small-business sales data)', url: 'https://www.bizbuysell.com/insight-report/' }
  ]
};
