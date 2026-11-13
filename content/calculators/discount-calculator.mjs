export default {
  slug: 'discount-calculator',
  hub: 'everyday',
  name: 'Discount Calculator',
  title: 'Discount Calculator: 25% Off $80 Is $60 (You Save $20)',
  h1: 'Percent Off Calculator: Sale Price, Savings and Stacked Discounts',
  meta: '25% off an $80 price is $60, a $20 saving. Work out any percent off, stack an extra coupon, find the original price or see what discount you really got.',
  keyword: 'how to calculate 25 off',
  also: ['discount calculator', 'percent off calculator', 'sale price calculator', 'how to calculate a discount', 'double discount calculator', 'how to calculate percent off'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you want to find?', type: 'select', value: 'sale', options: [['sale', 'Sale price after a discount'], ['pct', 'Percent off (from two prices)'], ['orig', 'Original price before a discount']], wide: true },
    { id: 'price', label: 'Original price', type: 'number', value: 80, prefix: '$', showIf: { mode: ['sale', 'pct'] } },
    { id: 'pct', label: 'Discount', type: 'number', value: 25, suffix: '% off', showIf: { mode: ['sale', 'orig'] } },
    { id: 'extra', label: 'Extra discount on top (optional)', type: 'number', value: 0, suffix: '% off', help: 'For "take an extra 20% off sale prices" deals.', showIf: { mode: ['sale'] } },
    { id: 'sale', label: 'Sale price', type: 'number', value: 60, prefix: '$', showIf: { mode: ['pct', 'orig'] } },
    { id: 'tax', label: 'Sales tax (optional)', type: 'number', value: 0, suffix: '%', showIf: { mode: ['sale'] } }
  ],
  compute(v, H) {
    if (v.mode === 'pct') {
      if (!(v.price > 0)) return { error: 'Enter the original price.' };
      if (!(v.sale >= 0)) return { error: 'Enter the sale price.' };
      if (v.sale > v.price) return { error: 'The sale price is higher than the original price, so there is no discount.' };
      var off = (v.price - v.sale) / v.price * 100;
      return { value: H.pct(off, 1) + ' off', label: 'Discount', expr: '(' + H.money(v.price) + ' − ' + H.money(v.sale) + ') ÷ ' + H.money(v.price), rows: [['You save', H.money(v.price - v.sale), true], ['You pay', H.pct(100 - off, 1) + ' of the original']] };
    }
    if (!(v.pct >= 0 && v.pct < 100)) return { error: 'Enter a discount from 0 to 99%.' };
    if (v.mode === 'orig') {
      if (!(v.sale > 0)) return { error: 'Enter the sale price.' };
      var o = v.sale / (1 - v.pct / 100);
      return { value: H.money(o), label: 'Original price', expr: H.money(v.sale) + ' ÷ (1 − ' + H.num(v.pct, 2) + '%)', rows: [['You saved', H.money(o - v.sale), true], ['Not this', H.money(v.sale * (1 + v.pct / 100)) + ' (adding ' + H.num(v.pct, 2) + '% back undercounts)']] };
    }
    if (!(v.price > 0)) return { error: 'Enter the original price.' };
    var ex = v.extra > 0 && v.extra < 100 ? v.extra : 0;
    var s1 = v.price * (1 - v.pct / 100);
    var s2 = s1 * (1 - ex / 100);
    var rows = [['You save', H.money(v.price - s2), true]];
    if (ex) {
      rows.push(['After first ' + H.num(v.pct, 2) + '%', H.money(s1)]);
      rows.push(['Total discount', H.pct((1 - s2 / v.price) * 100, 2) + ' (not ' + H.num(v.pct + ex, 2) + '%)']);
    }
    rows.push(['Multiply the price by', H.num(s2 / v.price, 4)]);
    if (v.tax > 0) rows.push(['With ' + H.num(v.tax, 3) + '% sales tax', H.money(s2 * (1 + v.tax / 100)), true]);
    return {
      value: H.money(s2),
      label: 'Sale price',
      expr: H.money(v.price) + ' × (1 − ' + H.num(v.pct, 2) + '%)' + (ex ? ' × (1 − ' + H.num(ex, 2) + '%)' : ''),
      rows: rows
    };
  },
  quick: ({ r }) => `To take 25% off, multiply the price by 0.75 (or divide it by 4 and subtract). <strong>25% off $80 is ${r.value}</strong>, so you save $20. Stacked deals multiply rather than add: an extra 10% off that $60 sale price brings it to $54, which is 32.5% off in total, not 35%.`,
  stepsTitle: 'How to calculate a discount',
  steps: [
    'Turn the percent off into a decimal and subtract it from 1: 25% off becomes 1 − 0.25 = 0.75.',
    'Multiply the original price by that number to get the sale price: $80 × 0.75 = $60. The saving is the difference, $20.',
    'For an extra discount on a sale price, multiply again: $60 × 0.90 = $54. <strong>Don\'t add the percentages</strong>; 25% plus 10% is 32.5% off, not 35%.',
    'Add sales tax last, on the discounted price, if your state taxes the item.'
  ],
  formulaTitle: 'What is the formula for a discount?',
  formula: {
    expr: 'Sale price = Original × (1 − d)<br>Percent off = (Original − Sale) ÷ Original × 100<br>Original = Sale ÷ (1 − d)<br>Stacked: Sale = Original × (1 − d₁) × (1 − d₂)',
    vars: [['d', 'discount as a decimal (25% = 0.25)'], ['d₁, d₂', 'first and second discounts, applied one after the other']]
  },
  example: `<p>A jacket is $129.99, marked 40% off, with a coupon for an extra 15% off at checkout and 7% sales tax.</p>
<p>After 40%: $129.99 × 0.60 = <strong>$77.99</strong>. After the extra 15%: $77.99 × 0.85 = <strong>$66.29</strong>. Total discount: 1 − 0.60 × 0.85 = 0.49, so <strong>49% off</strong>, not 55%.</p>
<p>With 7% tax: $66.29 × 1.07 = <strong>$70.94</strong> (the calculator carries the unrounded cents). You save $63.70 before tax.</p>`,
  table: {
    title: 'What is 10%, 20%, 25%, 30%, 40% and 50% off?',
    intro: 'Sale prices for common price tags, computed by the calculator above.',
    head: ['Price', '10% off', '20% off', '25% off', '30% off', '40% off', '50% off'],
    rows: ({ run, H }) => [15, 20, 25, 35, 40, 50, 60, 80, 100, 150, 200, 300, 500].map(p => [H.money0(p), ...[10, 20, 25, 30, 40, 50].map(d => run({ mode: 'sale', price: p, pct: d, extra: 0, tax: 0 }).value)])
  },
  sections: [
    {
      h2: 'How do you calculate 25% off in your head?',
      html: `<p>Divide the price by 4 and subtract. 25% is a quarter, so on $80 the discount is $20 and the sale price $60. On $36, a quarter is $9, so you pay $27.</p>
<p>For other percentages, build from 10%: move the decimal one place left. 30% off $70 is 3 × $7 = $21 off, so $49. 15% off $45 is $4.50 + $2.25 = $6.75 off, so $38.25. 20% off is the same as paying 80%, so $50 becomes $40.</p>`
    },
    {
      h2: 'How do stacked discounts work, like an extra 20% off sale prices?',
      html: `<p>Each discount applies to the already-reduced price, so they multiply: total discount = 1 − (1 − d₁)(1 − d₂). A 30% markdown plus an extra 20% off is 1 − 0.70 × 0.80 = <strong>44% off</strong>, not 50%. The order of two percent-off discounts doesn't change the result.</p>
<p>The order does matter when one discount is a dollar amount. On a $100 item with a $10-off coupon and 20% off: taking 20% first gives $80 − $10 = <strong>$70</strong>, while taking $10 first gives $90 × 0.80 = <strong>$72</strong>. Stores set the order in their terms, usually percent first.</p>
<p>"Buy one, get one 50% off" on two equal-priced items is 25% off each: you pay 1.5 prices for 2 items.</p>`
    },
    {
      h2: 'How do you find the original price before a discount?',
      html: `<p>Divide the sale price by 1 minus the discount. A $45 item marked 25% off was originally $45 ÷ 0.75 = <strong>$60</strong>.</p>
<p>The common mistake is adding the percentage back: $45 + 25% = $56.25, which is too low because the 25% was taken from the larger original price, not from $45. Choose "Original price" in the calculator to do it the right way.</p>
<p>Be skeptical of "compare at" prices. The FTC's Guides Against Deceptive Pricing (16 CFR Part 233) say a former-price comparison is legitimate only if the item was actually offered at that price, in good faith, for a reasonably substantial period.</p>`
    },
    {
      h2: 'Is sales tax charged on the original price or the discounted price?',
      html: `<p>Usually on the discounted price when the <strong>store</strong> gives the discount, whether it's a markdown, a sale or a store coupon, because you're paying less and the store collects less. <strong>Manufacturer</strong> coupons are often treated differently: in many states the retailer is reimbursed for them, so tax is figured on the price before the coupon.</p>
<p>Rules vary by state, so check your state revenue department if the difference matters. Enter your local rate in the optional sales tax box to see the after-tax total on the sale price.</p>`
    }
  ],
  faq: [
    { q: 'How much is 25% off $80?', a: '25% off $80 is $60. A quarter of $80 is $20, and $80 − $20 = $60.' },
    { q: 'How do I calculate 20% off?', a: 'Multiply the price by 0.80. For example, 20% off $50 is $50 × 0.80 = $40, a $10 saving.' },
    { q: 'What is 30% off $70?', a: '30% off $70 is $49. 10% of $70 is $7, so 30% is $21, and $70 − $21 = $49.' },
    { q: 'What is 40% off $120?', a: '40% off $120 is $72. You pay 60% of the price: $120 × 0.60 = $72, saving $48.' },
    { q: 'Is 50% off plus an extra 20% off the same as 70% off?', a: 'No. The extra 20% comes off the already-halved price: $100 becomes $50, then $40, which is 60% off in total.' },
    { q: 'How do I calculate the percentage discount between two prices?', a: 'Subtract the sale price from the original, divide by the original and multiply by 100. A $120 item on sale for $90 is ($120 − $90) ÷ $120 × 100 = 25% off.' },
    { q: 'What is 15% off $45?', a: '15% off $45 is $38.25. 10% is $4.50 and 5% is $2.25, so the discount is $6.75.' },
    { q: 'Should I tip on the discounted or full price at a restaurant?', a: 'On the full price before the discount or coupon. The tip calculator can work out the amount.' }
  ],
  related: ['percentage-calculator', 'sales-tax-calculator', 'unit-price-calculator', 'markup-calculator', 'tip-calculator'],
  sources: [
    { name: 'FTC Guides Against Deceptive Pricing, 16 CFR 233.1 (former price comparisons)', url: 'https://www.law.cornell.edu/cfr/text/16/233.1' },
    { name: 'Streamlined Sales Tax Governing Board (state sales tax rules)', url: 'https://www.streamlinedsalestax.org/' }
  ]
};
