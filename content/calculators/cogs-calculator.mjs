export default {
  slug: 'cogs-calculator',
  hub: 'business',
  name: 'Cost of Goods Sold Calculator',
  title: 'COGS Calculator: $40K Start + $125K Bought − $35K End = $130K',
  h1: 'Cost of Goods Sold Calculator: COGS, Beginning or Ending Inventory',
  meta: 'Beginning inventory of $40,000 plus $125,000 of purchases and freight, minus $35,000 ending inventory, is $130,000 COGS. Or solve for either inventory figure.',
  keyword: 'how do you calculate cost of goods sold',
  also: ['how is cost of goods sold calculated', 'cogs calculator', 'how to calculate beginning inventory', 'how do you calculate ending inventory', 'how to calculate ending inventory without cost of goods sold', 'how to calculate cost of goods sold using fifo', 'how to calculate fifo lifo', 'how do you calculate purchases', 'how to calculate net purchases'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Solve for', type: 'select', value: 'cogs', wide: true, options: [['cogs', 'Cost of goods sold'], ['ei', 'Ending inventory'], ['bi', 'Beginning inventory']] },
    { id: 'bi', label: 'Beginning inventory', type: 'number', value: 40000, prefix: '$', showIf: { mode: ['cogs', 'ei'] }, help: 'Last period\'s ending inventory.' },
    { id: 'purch', label: 'Net purchases', type: 'number', value: 120000, prefix: '$', help: 'Purchases minus returns, allowances and early-payment discounts.' },
    { id: 'other', label: 'Freight-in, direct labor and other product costs', type: 'number', value: 5000, prefix: '$' },
    { id: 'ei', label: 'Ending inventory', type: 'number', value: 35000, prefix: '$', showIf: { mode: ['cogs', 'bi'] }, help: 'From a physical count at the end of the period, at cost.' },
    { id: 'cogsIn', label: 'Cost of goods sold', type: 'number', value: 130000, prefix: '$', showIf: { mode: ['ei', 'bi'] } },
    { id: 'rev', label: 'Net sales (optional)', type: 'number', value: 200000, prefix: '$', help: 'Adds gross profit and gross margin.' }
  ],
  compute(v, H) {
    var p = v.purch, o = v.other || 0, mode = v.mode, bi, ei, cogs;
    if (!(p >= 0)) return { error: 'Enter net purchases for the period (0 if none).' };
    if (mode === 'ei') {
      bi = v.bi; cogs = v.cogsIn;
      if (!(bi >= 0) || !(cogs >= 0)) return { error: 'Enter beginning inventory and cost of goods sold.' };
      ei = bi + p + o - cogs;
      if (ei < 0) return { error: 'COGS is larger than the goods available for sale, so ending inventory would be negative. Check the figures.' };
    } else if (mode === 'bi') {
      ei = v.ei; cogs = v.cogsIn;
      if (!(ei >= 0) || !(cogs >= 0)) return { error: 'Enter ending inventory and cost of goods sold.' };
      bi = cogs + ei - p - o;
      if (bi < 0) return { error: 'Purchases exceed COGS plus ending inventory, so beginning inventory would be negative. Check the figures.' };
    } else {
      bi = v.bi; ei = v.ei;
      if (!(bi >= 0) || !(ei >= 0)) return { error: 'Enter beginning and ending inventory.' };
      cogs = bi + p + o - ei;
      if (cogs < 0) return { error: 'Ending inventory is larger than everything available for sale. Check the inventory count or purchases.' };
    }
    var avail = bi + p + o, avg = (bi + ei) / 2;
    var rows = [
      ['Goods available for sale', H.money0(avail)],
      ['Beginning inventory', H.money0(bi), mode === 'bi'],
      ['Ending inventory', H.money0(ei), mode === 'ei'],
      ['Cost of goods sold', H.money0(cogs), mode === 'cogs']
    ];
    if (avg > 0) rows.push(['Inventory turnover', H.fix(cogs / avg, 2) + ' times']);
    var sub = H.pct(avail > 0 ? cogs / avail * 100 : 0, 1) + ' of the goods available were sold; the rest is on the balance sheet as ending inventory.';
    if (v.rev > 0) {
      rows.push(['Gross profit', H.money0(v.rev - cogs)]);
      rows.push(['Gross margin', H.pct((v.rev - cogs) / v.rev * 100, 1), true]);
    }
    var res = mode === 'ei' ? ei : mode === 'bi' ? bi : cogs;
    return {
      value: H.money0(res),
      label: mode === 'ei' ? 'Ending inventory' : mode === 'bi' ? 'Beginning inventory' : 'Cost of goods sold',
      expr: mode === 'ei' ? H.money0(bi) + ' + ' + H.money0(p + o) + ' − ' + H.money0(cogs) : mode === 'bi' ? H.money0(cogs) + ' + ' + H.money0(ei) + ' − ' + H.money0(p + o) : H.money0(bi) + ' + ' + H.money0(p + o) + ' − ' + H.money0(ei),
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `Cost of goods sold = beginning inventory + purchases − ending inventory. A shop that starts the year with <strong>$40,000</strong> of stock, buys $120,000 more and pays $5,000 in freight-in, then counts <strong>$35,000</strong> left at year-end, has COGS of $165,000 − $35,000 = <strong>${r.value}</strong>. On $200,000 of sales, that leaves $70,000 of gross profit, a 35% gross margin.`,
  stepsTitle: 'How to calculate cost of goods sold',
  steps: [
    'Take <strong>beginning inventory</strong> at cost. It must equal the ending inventory on last period\'s balance sheet or tax return.',
    'Add <strong>net purchases</strong> (purchases minus returns and discounts) and other product costs: freight-in, and for makers, direct labor, materials and factory overhead.',
    'Count <strong>ending inventory</strong> and value it at cost with your inventory method (FIFO, LIFO or average cost). This is where most errors happen: every $1 overstated in ending inventory understates COGS by $1 and overstates profit by the same amount.',
    'Subtract ending inventory from the goods available for sale. The result is COGS for the period; subtract it from net sales to get gross profit.'
  ],
  formulaTitle: 'What is the cost of goods sold formula?',
  formula: {
    expr: 'COGS = Beginning inventory + Net purchases + Other product costs − Ending inventory<br>Ending inventory = Beginning inventory + Purchases − COGS<br>Beginning inventory = COGS + Ending inventory − Purchases',
    vars: [['Net purchases', 'purchases − returns − allowances − purchase discounts'], ['Other product costs', 'freight-in; for manufacturers, direct labor and overhead'], ['Ending inventory', 'unsold goods counted at cost at period end']],
    note: 'This periodic formula is the same layout as Schedule C Part III (lines 35–42) for sole proprietors and IRS Form 1125-A for corporations and partnerships.'
  },
  example: `<p>A sporting goods store has $40,000 of inventory on January 1. During the year it buys $123,500 of merchandise, returns $2,000 of damaged goods and takes $1,500 in early-payment discounts, so net purchases are <strong>$120,000</strong>. Inbound freight costs $5,000.</p>
<p>Goods available for sale = $40,000 + $120,000 + $5,000 = <strong>$165,000</strong>.</p>
<p>The December 31 count values remaining stock at <strong>$35,000</strong>. COGS = $165,000 − $35,000 = <strong>$130,000</strong>.</p>
<p>With $200,000 of net sales, gross profit is $70,000 and gross margin is 35%.</p>`,
  table: {
    title: 'How do FIFO, LIFO and average cost change COGS?',
    intro: 'The same year of activity valued three ways (periodic system): 100 units on hand at $10, purchases of 200 units at $12 and 150 units at $13, and 300 units sold at $20 each. Costs were rising, which is when the choice matters most.',
    head: ['Method', 'Cost of goods sold', 'Ending inventory (150 units)', 'Gross profit on $6,000 sales'],
    rows: ({ H }) => {
      const layers = [[100, 10], [200, 12], [150, 13]], sold = 300;
      const take = (order) => { let need = sold, c = 0; for (const [q, u] of order) { const t = Math.min(q, need); c += t * u; need -= t; } return c; };
      const total = layers.reduce((s, [q, u]) => s + q * u, 0);
      const fifo = take(layers), lifo = take([...layers].reverse()), avg = total / 450 * sold;
      return [['FIFO (first in, first out)', fifo], ['LIFO (last in, first out)', lifo], ['Weighted average cost', avg]].map(([n, c]) => [n, H.money(c), H.money(total - c), H.money(6000 - c)]);
    },
    note: 'Total cost of goods available is $5,350 under every method; only the split between COGS and ending inventory changes. With rising costs, LIFO gives the highest COGS and lowest taxable profit.'
  },
  sections: [
    {
      h2: 'How do you calculate beginning inventory?',
      html: `<p>Beginning inventory is simply last period's ending inventory, so first look at the prior balance sheet or the prior year's Schedule C line 41. If that record is missing, rearrange the COGS formula: beginning inventory = COGS + ending inventory − purchases.</p>
<p>Using the example: $130,000 + $35,000 − $125,000 (purchases plus freight) = <strong>$40,000</strong>. Choose "Beginning inventory" in the calculator to do this. If the result is negative, one of the inputs is wrong, usually purchases recorded in the wrong period.</p>`
    },
    {
      h2: 'How do you calculate ending inventory without cost of goods sold?',
      html: `<p>When you can't count stock (for a monthly report, or after a fire or theft), estimate it with the <strong>gross profit method</strong>: ending inventory ≈ beginning inventory + net purchases − net sales × (1 − historical gross margin).</p>
<p>If the store above historically earns a 35% gross margin, estimated COGS on $200,000 of sales is $200,000 × 0.65 = $130,000, and estimated ending inventory is $165,000 − $130,000 = <strong>$35,000</strong>. Retailers also use the retail inventory method, which applies the cost-to-retail ratio of goods available to the ending inventory at retail prices. Both are estimates; a physical count is still needed at year-end.</p>`
    },
    {
      h2: 'Should you use FIFO or LIFO?',
      html: `<p>FIFO assumes the oldest units sell first, so ending inventory reflects recent prices and the balance sheet looks closer to current value. LIFO assumes the newest units sell first, which matches current costs against current sales and, when prices rise, lowers taxable income, as the table shows ($350 more COGS than FIFO).</p>
<p>In the U.S., a business that elects LIFO for taxes (on IRS Form 970) must also use it in its financial statements, the LIFO conformity rule. International Financial Reporting Standards (IFRS) do not allow LIFO at all. Changing methods later requires IRS approval, so choose deliberately.</p>`
    },
    {
      h2: 'What is included in cost of goods sold?',
      html: `<p><strong>Included:</strong> the cost of merchandise bought for resale, freight-in, and for producers, raw materials, direct labor and factory overhead. IRS Publication 334 also lists containers and packages that are part of the product.</p>
<p><strong>Not included:</strong> selling and administrative costs such as office rent, advertising, sales commissions and shipping to customers (a selling expense for tax purposes), plus interest and income taxes. These are operating or other expenses that come after gross profit. Service businesses report "cost of services" instead: the direct labor and materials used to deliver the work. Once COGS is known, the <a href="/profit-margin-calculator">profit margin calculator</a> takes it through to net margin.</p>`
    }
  ],
  faq: [
    { q: 'Is cost of goods sold an expense?', a: 'Yes. COGS is the first expense on the income statement, subtracted from net sales to get gross profit. Until goods are sold, their cost sits on the balance sheet as inventory.' },
    { q: 'How do you calculate net purchases?', a: 'Net purchases = gross purchases − purchase returns and allowances − purchase discounts. $123,500 bought, $2,000 returned and $1,500 of discounts gives $120,000 of net purchases. Freight-in is usually added separately.' },
    { q: 'Does COGS include labor?', a: 'Only labor that makes the product or delivers the service, such as production workers. Salaries for sales, office and management staff are operating expenses, not COGS.' },
    { q: 'How do I calculate COGS per unit?', a: 'Divide total COGS by the number of units sold. $130,000 of COGS on 6,500 units sold is $20 per unit.' },
    { q: 'Why is my COGS negative?', a: 'A negative result means ending inventory is larger than beginning inventory plus purchases, which is impossible. Check for a counting error, purchases missing from the books, or inventory valued at retail instead of cost.' },
    { q: 'Where does COGS go on a tax return?', a: 'Sole proprietors figure it in Part III of Schedule C (Form 1040) and carry line 42 to line 4. Corporations and partnerships use Form 1125-A. Both follow the beginning inventory + purchases − ending inventory layout.' },
    { q: 'What is the difference between COGS and operating expenses?', a: 'COGS covers the direct cost of the goods you sold. Operating expenses cover running the business regardless of sales volume: rent, marketing, admin payroll, software. Gross profit sits between them.' }
  ],
  related: ['average-inventory-calculator', 'profit-margin-calculator', 'markup-calculator', 'days-of-supply-calculator', 'break-even-calculator'],
  sources: [
    { name: 'IRS Publication 334: Tax Guide for Small Business (Cost of Goods Sold)', url: 'https://www.irs.gov/publications/p334' },
    { name: 'IRS: About Form 1125-A, Cost of Goods Sold', url: 'https://www.irs.gov/forms-pubs/about-form-1125-a' },
    { name: 'IRS Publication 538: Accounting Periods and Methods (inventories)', url: 'https://www.irs.gov/publications/p538' },
    { name: 'OpenStax (Rice University): Principles of Accounting, Volume 1: Financial Accounting', url: 'https://openstax.org/details/books/principles-financial-accounting' }
  ]
};
