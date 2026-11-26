export default {
  slug: 'cogs-calculator',
  hub: 'everyday',
  name: 'COGS Calculator',
  title: 'COGS Calculator: $40K + $125K − $35K = $130K (With Steps)',
  meta: 'Beginning inventory of $40,000 plus $125,000 of purchases and freight-in, minus $35,000 ending inventory, is $130,000 COGS. Solve for COGS or either inventory.',
  keyword: 'cogs calculator',
  also: ['cost of goods sold calculator', 'how do you calculate cost of goods sold', 'how to calculate ending inventory', 'how to calculate beginning inventory', 'goods available for sale'],
  updated: '2026-11-26',
  answer: ({ r }) => `Cost of goods sold is <strong>${r.value}</strong>: $40,000 beginning inventory + $125,000 of purchases and freight-in − $35,000 ending inventory.`,
  inputs: [
    { id: 'mode', label: 'Solve for', type: 'select', value: 'cogs', wide: true, options: [['cogs', 'Cost of goods sold'], ['ei', 'Ending inventory'], ['bi', 'Beginning inventory']] },
    { id: 'bi', label: 'Beginning inventory', type: 'number', value: 40000, prefix: '$', showIf: { mode: ['cogs', 'ei'] } },
    { id: 'purch', label: 'Net purchases (after returns)', type: 'number', value: 120000, prefix: '$' },
    { id: 'freight', label: 'Freight-in', type: 'number', value: 5000, prefix: '$' },
    { id: 'ei', label: 'Ending inventory', type: 'number', value: 35000, prefix: '$', showIf: { mode: ['cogs', 'bi'] } },
    { id: 'cogsIn', label: 'Cost of goods sold', type: 'number', value: 130000, prefix: '$', showIf: { mode: ['ei', 'bi'] } }
  ],
  compute(v, H) {
    var m = function (x) { return Math.abs(x - Math.round(x)) < 0.005 ? H.money0(x) : H.money(x, 2); };
    var p = v.purch, f = isFinite(v.freight) ? v.freight : 0, mode = v.mode;
    if (!(p >= 0)) return { error: 'Enter net purchases for the period (0 if none).' };
    if (!(f >= 0)) return { error: 'Freight-in cannot be negative (enter 0 if none).' };
    var buy = p + f, bi, ei, cogs, steps;
    var buyStep = '<b>Add freight-in to net purchases:</b> ' + m(p) + ' + ' + m(f) + ' = ' + m(buy);
    if (mode === 'ei') {
      bi = v.bi; cogs = v.cogsIn;
      if (!(bi >= 0) || !(cogs >= 0)) return { error: 'Enter beginning inventory and cost of goods sold.' };
      ei = bi + buy - cogs;
      if (ei < 0) return { error: 'COGS is larger than the goods available for sale, so ending inventory would be negative. Check the figures.' };
      steps = ['<b>Formula:</b> Ending inventory = Beginning inventory + Purchases − COGS',
        '<b>Substitute:</b> Ending inventory = ' + m(bi) + ' + (' + m(p) + ' + ' + m(f) + ') − ' + m(cogs), buyStep,
        '<b>Goods available for sale:</b> ' + m(bi) + ' + ' + m(buy) + ' = ' + m(bi + buy),
        '<b>Subtract what was sold:</b> ' + m(bi + buy) + ' − ' + m(cogs) + ' = ' + m(ei),
        '<b>Answer:</b> ending inventory is ' + m(ei) + ' (exact; dollar amounts are kept to the cent and shown to the dollar when whole).'];
    } else if (mode === 'bi') {
      ei = v.ei; cogs = v.cogsIn;
      if (!(ei >= 0) || !(cogs >= 0)) return { error: 'Enter ending inventory and cost of goods sold.' };
      bi = cogs + ei - buy;
      if (bi < 0) return { error: 'Purchases exceed COGS plus ending inventory, so beginning inventory would be negative. Check the figures.' };
      steps = ['<b>Formula:</b> Beginning inventory = COGS + Ending inventory − Purchases',
        '<b>Substitute:</b> Beginning inventory = ' + m(cogs) + ' + ' + m(ei) + ' − (' + m(p) + ' + ' + m(f) + ')', buyStep,
        '<b>Goods available for sale</b> (what was sold plus what is left): ' + m(cogs) + ' + ' + m(ei) + ' = ' + m(cogs + ei),
        '<b>Subtract this period\'s purchases:</b> ' + m(cogs + ei) + ' − ' + m(buy) + ' = ' + m(bi),
        '<b>Answer:</b> beginning inventory was ' + m(bi) + ' (exact; it equals last period\'s ending inventory).'];
    } else {
      bi = v.bi; ei = v.ei;
      if (!(bi >= 0) || !(ei >= 0)) return { error: 'Enter beginning and ending inventory.' };
      cogs = bi + buy - ei;
      if (cogs < 0) return { error: 'Ending inventory is larger than everything available for sale. Check the inventory count or purchases.' };
      steps = ['<b>Formula:</b> COGS = Beginning inventory + Purchases − Ending inventory',
        '<b>Substitute:</b> COGS = ' + m(bi) + ' + (' + m(p) + ' + ' + m(f) + ') − ' + m(ei), buyStep,
        '<b>Goods available for sale:</b> ' + m(bi) + ' + ' + m(buy) + ' = ' + m(bi + buy),
        '<b>Subtract ending inventory:</b> ' + m(bi + buy) + ' − ' + m(ei) + ' = ' + m(cogs),
        '<b>Answer:</b> cost of goods sold is ' + m(cogs) + ' (exact; dollar amounts are kept to the cent and shown to the dollar when whole).'];
    }
    var avail = bi + buy, avg = (bi + ei) / 2, rows = [['Goods available for sale', m(avail)]];
    if (avail > 0) rows.push(['Share of available goods sold', H.pct(cogs / avail * 100, 1)]);
    if (avg > 0) rows.push(['Inventory turnover (COGS ÷ average inventory)', H.num(cogs / avg, 2) + ' times']);
    var res = mode === 'ei' ? ei : mode === 'bi' ? bi : cogs;
    return { value: m(res), label: mode === 'ei' ? 'Ending inventory' : mode === 'bi' ? 'Beginning inventory' : 'Cost of goods sold', rows: rows, steps: steps };
  },
  facts: {
    formula: 'COGS = Beginning inventory + Purchases − Ending inventory<br>Goods available for sale = Beginning inventory + Purchases',
    vars: [['Beginning inventory', 'cost of goods on hand at the start of the period (last period\'s ending inventory)'], ['Purchases', 'net purchases (after returns, allowances and discounts) plus freight-in'], ['Ending inventory', 'cost of goods still on hand at the end, from a physical count'], ['COGS', 'cost of the goods that were sold during the period']],
    rounding: 'inventory and purchases are usually whole dollars; keep cents if the problem gives them and round only the final figure, to the dollar.',
    note: 'This is the periodic inventory method taught in introductory accounting: count what is left, and everything else that was available is treated as sold.'
  },
  example: {
    h2: 'Worked example: a store\'s year-end COGS',
    html: `<p><strong>Problem:</strong> A store began the year with $18,500 of inventory. During the year it bought $62,300 of merchandise, returned $800 of it to the supplier and paid $1,200 freight-in. A count on December 31 found $21,400 of inventory on hand. What was the cost of goods sold?</p>
<p><strong>1.</strong> Net purchases: $62,300 − $800 returned = $61,500.</p>
<p><strong>2.</strong> Add freight-in: $61,500 + $1,200 = $62,700.</p>
<p><strong>3.</strong> Goods available for sale: $18,500 + $62,700 = $81,200.</p>
<p><strong>4.</strong> Subtract ending inventory: $81,200 − $21,400 = $59,800.</p>
<p><strong>Answer:</strong> COGS is $59,800. Sense check: the store had $81,200 of goods to sell and $21,400 is still on the shelf, so about 74% of what it could sell was sold.</p>`
  },
  variants: [
    {
      h2: 'How do you calculate cost of goods sold?',
      html: `<p>Add what you started with to what you bought, then take away what is left: <strong>COGS = beginning inventory + purchases − ending inventory</strong>. With $40,000 at the start, $120,000 of net purchases, $5,000 of freight-in and $35,000 counted at the end, COGS is $40,000 + $125,000 − $35,000 = $130,000. All three amounts are at cost, what the business paid, never at the selling price.</p>`
    },
    {
      h2: 'How do you find ending inventory from COGS?',
      html: `<p>Rearrange the formula: <strong>ending inventory = beginning inventory + purchases − COGS</strong>. If a shop starts with $12,000, buys $48,000 and its records show $45,500 of goods sold, it should have $12,000 + $48,000 − $45,500 = $14,500 left. When a physical count comes in lower, the difference is shrinkage (loss, damage or theft).</p>`
    },
    {
      h2: 'How do you get gross profit and gross margin from COGS?',
      html: `<p>Gross profit is net sales minus COGS, and gross margin is gross profit as a percentage of sales. With $200,000 of sales and the $130,000 COGS above, gross profit is $200,000 − $130,000 = $70,000, and gross margin is $70,000 ÷ $200,000 × 100 = 35%. The <a href="/percentage-calculator">percentage calculator</a> shows that last step in detail.</p>`
    }
  ],
  mistakes: [
    '<strong>Subtracting beginning inventory.</strong> It is added: goods on hand at the start were available to sell. Only ending inventory is subtracted.',
    '<strong>Counting freight-out.</strong> Shipping paid to bring goods in (freight-in) is part of purchases. Shipping paid to send goods to customers is a selling expense, not COGS.',
    '<strong>Using gross purchases.</strong> Take off purchase returns, allowances and discounts first, or COGS comes out too high.',
    '<strong>Valuing inventory at selling price.</strong> Beginning and ending inventory are measured at cost. Using shelf prices mixes profit into COGS.'
  ],
  related: ['percentage-calculator', 'average-calculator', 'split-bill-calculator', 'time-card-calculator'],
  faq: [
    { q: 'Is cost of goods sold an expense?', a: 'Yes. COGS is the first expense on a merchandiser\'s income statement, subtracted from net sales to give gross profit. Inventory not yet sold stays on the balance sheet as an asset.' },
    { q: 'What is goods available for sale?', a: 'Beginning inventory plus net purchases and freight-in: everything the business could have sold during the period. It splits into COGS (sold) and ending inventory (not sold).' },
    { q: 'What is inventory turnover?', a: 'COGS divided by average inventory, where average inventory is (beginning + ending) ÷ 2. $130,000 ÷ $37,500 = 3.47, so the stock turned over about three and a half times.' },
    { q: 'Do FIFO and LIFO change COGS?', a: 'They change the cost assigned to ending inventory when prices move, and so the COGS this formula produces. Value ending inventory with your class\'s method first, then use the formula.' }
  ],
  sources: [
    { name: 'OpenStax Principles of Financial Accounting: Inventory valuation methods (10.1)', url: 'https://openstax.org/books/principles-financial-accounting/pages/10-1-describe-and-demonstrate-the-basic-inventory-valuation-methods-and-their-cost-flow-assumptions' },
    { name: 'OpenStax Principles of Financial Accounting: COGS and ending inventory, periodic method (10.2)', url: 'https://openstax.org/books/principles-financial-accounting/pages/10-2-calculate-the-cost-of-goods-sold-and-ending-inventory-using-the-periodic-method' }
  ]
};
