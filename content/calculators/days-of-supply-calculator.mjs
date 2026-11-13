export default {
  slug: 'days-of-supply-calculator',
  hub: 'business',
  name: 'Days of Supply Calculator',
  title: 'Days of Supply Calculator: 1,200 Units at 300 a Week = 4 Weeks',
  h1: 'Days of Supply Calculator: Weeks of Supply, Run-Out Date and Reorder Date',
  meta: '1,200 units on hand selling 300 a week is 4.0 weeks (28 days) of supply. Add a supplier lead time to see the date you run out and the last day to reorder.',
  keyword: 'how to calculate weeks of supply',
  also: ['how to calculate days of supply', 'how do you calculate weeks of supply', 'weeks of supply calculator', 'days of inventory on hand calculator', 'how to calculate months supply of inventory real estate', 'how to calculate months of inventory real estate'],
  updated: '2026-11-13',
  inputs: [
    { id: 'onhand', label: 'Inventory on hand', type: 'number', value: 1200, suffix: 'units', help: 'Units, or dollars at cost if usage is in dollars at cost.' },
    { id: 'onorder', label: 'On order, not yet received (optional)', type: 'number', value: '', suffix: 'units', placeholder: '0' },
    { id: 'usage', label: 'Average sales or usage', type: 'number', value: 300, suffix: 'units' },
    { id: 'per', label: 'Usage period', type: 'select', value: 'week', options: [['day', 'per day'], ['week', 'per week'], ['month', 'per month']] },
    { id: 'lt', label: 'Supplier lead time (optional)', type: 'number', value: 14, suffix: 'days' }
  ],
  compute(v, H) {
    var oh = v.onhand, oo = v.onorder > 0 ? v.onorder : 0, u = v.usage;
    if (!(oh >= 0)) return { error: 'Enter the inventory you have on hand.' };
    if (!(u > 0)) return { error: 'Enter average sales or usage greater than zero.' };
    var perDay = v.per === 'day' ? u : v.per === 'month' ? u * 12 / 365 : u / 7;
    var dos = (oh + oo) / perDay;
    var today = H.parseDate(H.today());
    var rows = [
      ['Weeks of supply', H.fix(dos / 7, 1) + ' weeks', true],
      ['Months of supply', H.fix(dos * 12 / 365, 2) + ' months'],
      ['Average daily usage', H.num(perDay, 2)],
      ['Runs out around', H.fmtDate(H.addDays(today, Math.floor(dos)))]
    ];
    if (oo) rows.splice(2, 0, ['On hand only', H.fix(oh / perDay, 1) + ' days']);
    var sub = 'At the current rate this stock lasts about ' + H.num(dos, 0) + ' days.';
    if (v.lt > 0) {
      var slack = dos - v.lt;
      rows.push(['Last day to reorder', slack >= 0 ? H.fmtDate(H.addDays(today, Math.floor(slack))) + ' (' + H.plural(Math.floor(slack), 'day') + ' from today)' : 'overdue', true]);
      sub = slack >= 0 ? 'With a ' + H.num(v.lt, 0) + '-day lead time you have ' + H.plural(Math.floor(slack), 'day') + ' before you must reorder (no safety stock included).'
        : 'Order now: a new delivery would arrive about ' + H.plural(Math.ceil(-slack), 'day') + ' after you run out.';
    }
    return {
      value: H.fix(dos, 1) + ' days',
      label: 'Days of supply',
      expr: H.num(oh + oo, 2) + ' ÷ ' + H.num(perDay, 2) + ' per day',
      rows: rows,
      sub: sub,
      dos: dos
    };
  },
  quick: ({ r }) => `Weeks of supply = inventory on hand ÷ average weekly sales. A store holding <strong>1,200 units</strong> that sells <strong>300 a week</strong> has 1,200 ÷ 300 = <strong>4.0 weeks</strong> of supply, which is ${r.value}. If the supplier needs 14 days to deliver, the order must go in within 14 days to avoid running out, sooner if you keep safety stock.`,
  stepsTitle: 'How to calculate weeks of supply',
  steps: [
    'Count what is <strong>on hand</strong> and sellable. Leave out damaged, reserved or already-allocated stock, and decide whether to add stock already on order.',
    'Work out <strong>average sales per week</strong>. Use a forecast of the coming weeks when demand is seasonal; using last month\'s rate going into a peak is the usual error.',
    'Divide on-hand inventory by weekly sales for weeks of supply. Multiply by 7 for days of supply, or divide on-hand by daily usage directly.',
    'Compare the result with the supplier\'s lead time. If days of supply is close to the lead time, reorder now.'
  ],
  formulaTitle: 'What is the days of supply formula?',
  formula: {
    expr: 'Days of supply = Inventory on hand ÷ Average daily usage<br>Weeks of supply = Inventory on hand ÷ Average weekly sales<br>Reorder slack (days) = Days of supply − Lead time',
    vars: [['Inventory on hand', 'units, or dollars at cost'], ['Average usage', 'units (or cost dollars) sold or consumed per day or week'], ['Lead time', 'days from placing an order to having stock ready to sell']],
    note: 'Keep the units consistent: unit counts with unit sales, or inventory at cost with cost of goods sold. Inventory at retail prices divided by sales at retail also works.'
  },
  example: `<p>A pet supply store has 1,200 bags of a dog food on the shelf and in the back room. Over the last eight weeks it sold 2,400 bags, an average of <strong>300 a week</strong>.</p>
<p>Weeks of supply = 1,200 ÷ 300 = <strong>4.0 weeks</strong>. Days of supply = 1,200 ÷ (300 ÷ 7) = 1,200 ÷ 42.86 = <strong>28 days</strong>.</p>
<p>The distributor delivers 14 days after an order, so the store has 28 − 14 = <strong>14 days</strong> before it must reorder. If it wants a 3-day safety buffer, the order should go in within 11 days.</p>`,
  table: {
    title: 'How long will 1,200 units last at different sales rates?',
    intro: 'Weeks and days of supply for 1,200 units on hand at a range of weekly sales rates, and how many days you have to reorder with a 14-day lead time, computed with the calculator.',
    head: ['Weekly sales', 'Days of supply', 'Weeks of supply', 'Days left to reorder (14-day lead time)'],
    rows: ({ run, H }) => [50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1200].map(w => { const r = run({ onhand: 1200, onorder: NaN, usage: w, per: 'week', lt: 14 }); const s = Math.floor(r.dos - 14); return [H.int(w), H.fix(r.dos, 1), H.fix(r.dos / 7, 1), s >= 0 ? String(s) : 'order now']; }),
    note: 'Above 600 units a week, 1,200 units no longer cover the 14-day lead time, so the item needs an order in transit at all times.'
  },
  sections: [
    {
      h2: 'How much supply should you keep on hand?',
      html: `<p>A practical target is <strong>lead time + review period + safety days</strong>. If you check stock weekly (a 7-day review period), the supplier takes 14 days and you keep 3 days of safety stock, aim for about 24 days, or 3.4 weeks, right after each delivery arrives. Keeping much more than that ties up cash; keeping less means running out between orders.</p>
<p>For the safety part, a statistical buffer based on demand variability is more reliable than a fixed number of days; the <a href="/safety-stock-calculator">safety stock calculator</a> works it out from your sales history and service level.</p>`
    },
    {
      h2: 'How is weeks of supply different from inventory turnover?',
      html: `<p>Turnover looks back: cost of goods sold over a past period divided by average inventory. Weeks of supply looks forward: how long today's stock will last at the expected sales rate. They are related: annual turns ≈ 52 ÷ average weeks of supply, so a store averaging 4 weeks of supply turns its inventory about 13 times a year.</p>
<p>Retail buyers often plan in weeks of supply by category, and finance teams report turnover. To get historical turnover and days on hand from your books, use the <a href="/average-inventory-calculator">average inventory calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate months supply of inventory in real estate?',
      html: `<p>Months' supply = homes currently listed for sale ÷ homes sold per month. A market with 2,400 active listings and 600 closed sales a month has 2,400 ÷ 600 = <strong>4.0 months</strong> of supply: if no new listings came on, it would take four months to sell everything.</p>
<p>The National Association of Realtors publishes national months' supply every month in its existing-home sales report. Around six months is commonly described as a balanced market; less favors sellers and more favors buyers. Set the calculator's usage period to "per month" and enter listings as the inventory to get the same figure.</p>`
    },
    {
      h2: 'Should days of supply include stock on order?',
      html: `<p>Report both. <strong>On-hand days of supply</strong> tells you when the shelf goes empty if nothing arrives. <strong>Inventory-position days of supply</strong> (on hand + on order − backorders) tells you whether you need to place another order. Adding on-order stock to the first figure hides the risk that a late shipment leaves you empty; leaving it out of the second leads to double ordering. Enter an on-order quantity above to see both.</p>`
    }
  ],
  faq: [
    { q: 'What does 4 weeks of supply mean?', a: 'It means current inventory will last four weeks at the expected sales rate if nothing new arrives. 1,200 units selling 300 a week is 4 weeks, or 28 days.' },
    { q: 'How do I calculate days of supply from weeks of supply?', a: 'Multiply by 7. Three weeks of supply is 21 days; 2.5 weeks is 17.5 days.' },
    { q: 'Can I calculate weeks of supply in dollars?', a: 'Yes. Divide inventory at cost by average weekly cost of goods sold, or inventory at retail by average weekly sales at retail. Don\'t mix cost and retail values.' },
    { q: 'How do I calculate days of supply in Excel?', a: 'With units on hand in A2 and weekly sales in B2, use =A2/(B2/7) for days or =A2/B2 for weeks. For a run-out date, use =TODAY()+A2/(B2/7).' },
    { q: 'Should I use past sales or a forecast?', a: 'Use a forecast for the coming weeks whenever demand is seasonal or trending. Trailing averages understate the rate going into a peak and overstate it coming out.' },
    { q: 'What is days on hand?', a: 'Days on hand usually means the backward-looking measure from financial statements: average inventory ÷ COGS × 365. Days of supply is forward-looking. Both answer how many days of sales the inventory represents.' }
  ],
  related: ['safety-stock-calculator', 'average-inventory-calculator', 'cogs-calculator', 'business-days-calculator'],
  sources: [
    { name: 'National Association of Realtors: Existing-Home Sales (months\' supply)', url: 'https://www.nar.realtor/research-and-statistics/housing-statistics/existing-home-sales' },
    { name: 'U.S. SEC: Beginners\' Guide to Financial Statements (inventory turnover)', url: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements' },
    { name: 'MIT OpenCourseWare: 15.762J Supply Chain Planning', url: 'https://ocw.mit.edu/courses/15-762j-supply-chain-planning-spring-2011/' }
  ]
};
