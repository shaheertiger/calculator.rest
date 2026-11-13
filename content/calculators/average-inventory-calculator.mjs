const CO = [
  // From each company's latest 10-K (XBRL data, SEC EDGAR), $ millions: [company, fiscal year end, beginning inventory, ending inventory, cost of sales]
  ['Costco', 'Aug 30, 2026', 18116, 19324, 264279],
  ['Ford', 'Dec 31, 2025', 14951, 15285, 174466],
  ['Amazon', 'Dec 31, 2025', 34214, 38325, 356414],
  ['Walmart', 'Jan 31, 2026', 56435, 58851, 535395],
  ['PepsiCo', 'Dec 27, 2025', 5306, 5845, 43066],
  ['Target', 'Jan 31, 2026', 12740, 12304, 75511],
  ['Procter & Gamble', 'Jun 30, 2026', 7551, 8170, 43362],
  ['Home Depot', 'Feb 1, 2026', 23451, 25817, 109818],
  ['Coca-Cola', 'Dec 31, 2025', 4728, 4425, 18397],
  ['Nike', 'May 31, 2026', 7489, 7501, 26487],
  ['Caterpillar', 'Dec 31, 2025', 16827, 18135, 44752],
  ['Johnson & Johnson', 'Dec 28, 2025', 12444, 14191, 30256]
];

export default {
  slug: 'average-inventory-calculator',
  hub: 'business',
  name: 'Average Inventory Calculator',
  title: 'Average Inventory Calculator: ($45K + $55K) ÷ 2 = $50,000',
  h1: 'Average Inventory Calculator: Two-Point or Monthly Average, Turnover and Days on Hand',
  meta: 'Average inventory = (beginning + ending) ÷ 2: $45,000 and $55,000 average $50,000. Add COGS to get inventory turnover (6.0×) and days on hand (60.8).',
  keyword: 'how to calculate average inventory',
  also: ['how do you calculate average inventory', 'how to calculate average inventory level', 'how to calculate rate of inventory turnover', 'inventory turnover calculator', 'days inventory outstanding calculator', 'average inventory formula'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Method', type: 'select', value: 'two', wide: true, options: [['two', 'Beginning and ending balance'], ['list', 'Several period-end balances (monthly or quarterly)']] },
    { id: 'bi', label: 'Beginning inventory', type: 'number', value: 45000, prefix: '$', showIf: { mode: ['two'] } },
    { id: 'ei', label: 'Ending inventory', type: 'number', value: 55000, prefix: '$', showIf: { mode: ['two'] } },
    { id: 'list', label: 'Inventory balances, oldest first', type: 'text', multiline: 3, value: '52000, 48000, 50500, 47000, 51000, 53500, 49000, 46000, 50000, 54000, 58000, 61000, 55000', showIf: { mode: ['list'] }, help: 'For a year, use 13 month-end figures: last year\'s December plus each month this year.' },
    { id: 'cogs', label: 'Cost of goods sold for the period (optional)', type: 'number', value: 300000, prefix: '$', help: 'Adds inventory turnover and days on hand.' },
    { id: 'days', label: 'Days in the period', type: 'number', value: 365, suffix: 'days' }
  ],
  compute(v, H) {
    var avg, n, expr;
    if (v.mode === 'list') {
      var a = H.list(v.list).filter(function (x) { return x >= 0; });
      if (a.length < 2) return { error: 'Enter at least two inventory balances.' };
      avg = H.mean(a); n = a.length;
      expr = H.money0(H.sum(a)) + ' ÷ ' + n;
    } else {
      if (!(v.bi >= 0) || !(v.ei >= 0)) return { error: 'Enter beginning and ending inventory.' };
      avg = (v.bi + v.ei) / 2; n = 2;
      expr = '(' + H.money0(v.bi) + ' + ' + H.money0(v.ei) + ') ÷ 2';
    }
    var rows = [['Balances averaged', String(n)]];
    var out = { value: H.money0(avg), label: 'Average inventory', expr: expr, rows: rows, avg: avg };
    if (v.cogs > 0 && avg > 0) {
      var days = v.days > 0 ? v.days : 365, turns = v.cogs / avg, dio = days / turns;
      rows.unshift(['Inventory turnover', H.fix(turns, 2) + ' times', true]);
      rows.splice(1, 0, ['Days inventory on hand', H.fix(dio, 1) + ' days', true]);
      rows.splice(2, 0, ['Weeks of inventory', H.fix(dio / 7, 1) + ' weeks']);
      out.sub = 'You sell through your average stock about every ' + H.num(dio, 0) + ' days. Faster turnover frees cash; too fast risks stockouts.';
      out.turns = turns; out.dio = dio;
    } else {
      out.sub = 'Add cost of goods sold to see how many times this inventory turns over.';
    }
    return out;
  },
  quick: ({ r }) => `To calculate average inventory, add the beginning and ending inventory and divide by 2. A store that starts the year with <strong>$45,000</strong> of stock and ends with <strong>$55,000</strong> carries an average of <strong>${r.value}</strong>. With $300,000 of cost of goods sold, inventory turns over $300,000 ÷ $50,000 = 6 times a year, or about every 60.8 days.`,
  stepsTitle: 'How to calculate average inventory',
  steps: [
    'Get inventory <strong>at cost</strong> from the balance sheet at the start and end of the period. Mixing a retail-price count with a cost figure is the most common error.',
    'For a quick figure, add the two balances and divide by 2. For a seasonal business, average 13 month-end balances (or 5 quarter-ends) instead.',
    'To get <strong>inventory turnover</strong>, divide cost of goods sold for the same period by average inventory.',
    'To get <strong>days inventory on hand</strong> (days inventory outstanding), divide the days in the period by the turnover.'
  ],
  formulaTitle: 'What is the average inventory formula?',
  formula: {
    expr: 'Average inventory = (Beginning inventory + Ending inventory) ÷ 2<br>Multi-period average = (I₀ + I₁ + … + Iₙ) ÷ (n + 1)<br>Inventory turnover = COGS ÷ Average inventory<br>Days on hand = Days in period ÷ Turnover',
    vars: [['I₀ … Iₙ', 'inventory balances at the end of each sub-period, starting with the opening balance'], ['COGS', 'cost of goods sold for the same period'], ['Days in period', '365 for a year, 91 for a quarter, 30 for a month']],
    note: 'The U.S. SEC\'s Beginners\' Guide to Financial Statements defines inventory turnover as cost of sales ÷ average inventory for the period.'
  },
  example: `<p>A hardware store reports inventory of $45,000 on January 1 and $55,000 on December 31. Cost of goods sold for the year was $300,000.</p>
<p>Average inventory = ($45,000 + $55,000) ÷ 2 = <strong>$50,000</strong>.</p>
<p>Inventory turnover = $300,000 ÷ $50,000 = <strong>6.0 times</strong>. Days on hand = 365 ÷ 6 = <strong>60.8 days</strong>.</p>
<p>Using its 13 month-end balances instead (they total $675,000), average inventory is $675,000 ÷ 13 = $51,923 and turnover is 5.78, a more accurate picture because stock peaked at $61,000 before the holidays.</p>`,
  table: {
    title: 'What is a good inventory turnover ratio?',
    intro: 'Turnover depends heavily on the business model. These figures for well-known U.S. companies were computed with the calculator above from the inventory and cost-of-sales figures in each company\'s latest 10-K on SEC EDGAR ($ millions).',
    head: ['Company (fiscal year end)', 'Average inventory', 'Cost of sales', 'Turnover', 'Days on hand'],
    rows: ({ run, H }) => CO.map(c => { const r = run({ mode: 'two', bi: c[2], ei: c[3], cogs: c[4], days: 365 }); return [c[0] + ' (' + c[1] + ')', H.money0(r.avg) + 'M', H.money0(c[4]) + 'M', H.fix(r.turns, 1) + '×', H.num(r.dio, 0)]; }),
    note: 'Warehouse clubs and grocers turn stock in weeks; makers of machinery and medicines hold months of inventory. Compare yourself with companies that sell similar goods, and with your own trend.'
  },
  sections: [
    {
      h2: 'Why use monthly balances instead of beginning and ending inventory?',
      html: `<p>The two-point average only looks at two days of the year. If both fall in a quiet season, it misses the peak and overstates turnover. A toy retailer might hold $40,000 in January and $45,000 the next January, but $150,000 in November; its true average could be nearly double the two-point figure.</p>
<p>Averaging 13 month-end balances (the opening balance plus 12 month-ends) smooths seasonality. Switch the calculator to "Several period-end balances" and paste them in, separated by commas or line breaks. Use the same approach when a business is growing fast, since the ending balance alone would exaggerate the year's typical stock.</p>`
    },
    {
      h2: 'How do you convert inventory turnover to days?',
      html: `<p>Days on hand = 365 ÷ turnover; turnover = 365 ÷ days on hand. Common pairs:</p>
<div class="twrap"><table><thead><tr><th>Turnover per year</th><th>Days on hand</th><th>Weeks on hand</th></tr></thead><tbody>
${[2, 3, 4, 6, 8, 12, 26, 52].map(t => `<tr><td>${t}×</td><td>${(365 / t).toFixed(1)}</td><td>${(52 / t).toFixed(1)}</td></tr>`).join('')}
</tbody></table></div>
<p>For a forward-looking figure (how long today's stock will last at current sales) use the <a href="/days-of-supply-calculator">days of supply calculator</a>, which divides what is on hand now by expected usage rather than looking back at last year.</p>`
    },
    {
      h2: 'Why does average inventory matter for cash flow?',
      html: `<p>Average inventory is the cash tied up in stock on a typical day. Raising turnover from 6 to 8 on $300,000 of COGS cuts average inventory from $50,000 to $37,500, freeing $12,500 of cash and lowering carrying costs (storage, insurance, shrink and obsolescence, commonly estimated at 20% to 30% of inventory value a year).</p>
<p>The cut has a limit: too little stock means lost sales. Pair turnover goals with a reorder point and <a href="/safety-stock-calculator">safety stock</a> so faster turns don't turn into empty shelves.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for average inventory?', a: 'Average inventory = (beginning inventory + ending inventory) ÷ 2. For more precision, add up all period-end balances, including the opening balance, and divide by how many there are.' },
    { q: 'Should average inventory use cost or retail value?', a: 'Use cost when you pair it with cost of goods sold for turnover. Retailers using the retail method sometimes compute turnover at retail (sales ÷ average inventory at retail), but never mix the two.' },
    { q: 'How do you calculate average inventory for a month?', a: 'Add the inventory at the start and end of the month and divide by 2. For days on hand, divide 30 (or the actual days) by that month\'s COGS ÷ average inventory.' },
    { q: 'What does a low inventory turnover mean?', a: 'Stock is sitting longer before it sells: possibly overbuying, slow-moving or obsolete items, or prices that are too high. It ties up cash and raises carrying costs.' },
    { q: 'Can inventory turnover be too high?', a: 'Yes. Very high turnover can mean you\'re running too lean and losing sales to stockouts, or paying more for frequent small orders. Check fill rates alongside turnover.' },
    { q: 'How do I find beginning inventory if I only know ending inventory?', a: 'Beginning inventory is last period\'s ending balance. If you only have COGS, purchases and ending inventory, use beginning inventory = COGS + ending inventory − purchases, as in the COGS calculator.' },
    { q: 'Is days inventory outstanding the same as days on hand?', a: 'Yes. Days inventory outstanding (DIO), days sales of inventory (DSI) and days on hand all mean average inventory ÷ COGS × days in the period.' }
  ],
  related: ['cogs-calculator', 'days-of-supply-calculator', 'safety-stock-calculator', 'accounts-receivable-turnover-calculator', 'current-ratio-calculator'],
  sources: [
    { name: 'U.S. SEC: Beginners\' Guide to Financial Statements (inventory turnover ratio)', url: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements' },
    { name: 'SEC EDGAR: company 10-K filings (source of the turnover table)', url: 'https://www.sec.gov/edgar/search/' },
    { name: 'OpenStax (Rice University): Principles of Accounting, Volume 1: Financial Accounting', url: 'https://openstax.org/details/books/principles-financial-accounting' }
  ]
};
