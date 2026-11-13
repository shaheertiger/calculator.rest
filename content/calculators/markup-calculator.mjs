const ARTS = [
  // U.S. Census Bureau, Annual Retail Trade Survey, gross margin as a percentage of sales, 2022 (benchmarked release)
  ['Automobile dealers', '4411', 21.8],
  ['Warehouse clubs and supercenters', '452311', 24.3],
  ['Grocery stores', '4451', 28.0],
  ['Pharmacies and drug stores', '44611', 28.0],
  ['Electronics and appliance stores', '443', 29.4],
  ['Beer, wine and liquor stores', '4453', 31.1],
  ['Building material and supplies dealers', '4441', 36.0],
  ['Online and mail-order retailers', '4541', 39.6],
  ['Department stores', '4522', 42.0],
  ['Sporting goods, hobby and music stores', '4511', 44.6],
  ['Auto parts, accessories and tire stores', '4413', 48.1],
  ['Clothing stores', '4481', 50.6],
  ['Shoe stores', '4482', 50.9],
  ['Furniture and home furnishings stores', '442', 51.0]
];
const fx = x => x.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';

export default {
  slug: 'markup-calculator',
  hub: 'business',
  name: 'Markup Calculator',
  title: 'Markup Calculator: $40 Cost + 50% Markup = $60 Selling Price',
  h1: 'Markup Calculator: Selling Price, Markup % and Margin From Your Cost',
  meta: 'A 50% markup on a $40 cost gives a $60 price and a 33.3% gross margin. Find a price from cost and markup or target margin, or the markup from cost and price.',
  keyword: 'how to calculate markup price',
  also: ['how to calculate a markup percentage', 'how do you calculate percent markup', 'how to calculate the markup percentage', 'how to calculate markup and margin', 'how do you calculate markup and margin', 'how to calculate retail price from wholesale', 'how to calculate wholesale price from retail', 'how to calculate retail price', 'how to calculate suggested retail price', 'how to calculate product selling price'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I know', type: 'select', value: 'markup', wide: true, options: [['markup', 'Cost and markup % → selling price'], ['margin', 'Cost and target margin % → selling price'], ['price', 'Cost and selling price → markup and margin']] },
    { id: 'cost', label: 'Unit cost', type: 'number', value: 40, prefix: '$', help: 'What you pay per unit, including inbound freight.' },
    { id: 'markup', label: 'Markup', type: 'number', value: 50, suffix: '%', showIf: { mode: ['markup'] } },
    { id: 'margin', label: 'Target gross margin', type: 'number', value: 40, suffix: '%', showIf: { mode: ['margin'] } },
    { id: 'price', label: 'Selling price', type: 'number', value: 60, prefix: '$', showIf: { mode: ['price'] } }
  ],
  compute(v, H) {
    var c = v.cost, p, mode = v.mode;
    if (!(c > 0)) return { error: 'Enter a unit cost greater than zero.' };
    if (mode === 'margin') {
      if (!(v.margin < 100) || isNaN(v.margin)) return { error: 'A margin must be below 100%: you can\'t keep more than the whole price.' };
      p = c / (1 - v.margin / 100);
    } else if (mode === 'price') {
      if (!(v.price > 0)) return { error: 'Enter the selling price.' };
      p = v.price;
    } else {
      if (!(v.markup > -100)) return { error: 'Enter a markup percentage.' };
      p = c * (1 + v.markup / 100);
    }
    var profit = p - c, mk = profit / c * 100, mg = profit / p * 100;
    var out = {
      rows: [
        ['Selling price', H.money(p), mode !== 'price'],
        ['Profit per unit', H.money(profit)],
        ['Markup on cost', H.pct(mk, 2), mode === 'price'],
        ['Gross margin on price', H.pct(mg, 2), true],
        ['Price ÷ cost multiplier', H.fix(p / c, 3) + '×']
      ],
      mk: mk, mg: mg, p: p
    };
    if (mode === 'price') {
      out.value = H.pct(mk, 2); out.label = 'Markup percentage';
      out.expr = '(' + H.money(p) + ' − ' + H.money(c) + ') ÷ ' + H.money(c);
    } else {
      out.value = H.money(p); out.label = 'Selling price';
      out.expr = mode === 'margin' ? H.money(c) + ' ÷ (1 − ' + H.num(v.margin, 2) + '%)' : H.money(c) + ' × (1 + ' + H.num(v.markup, 2) + '%)';
    }
    out.sub = profit < 0 ? 'This price is below cost: you lose ' + H.money(-profit) + ' on every unit.'
      : 'A ' + H.pct(mk, 1) + ' markup keeps ' + H.pct(mg, 1) + ' of each sale as gross profit; the markup is always the larger number.';
    return out;
  },
  quick: ({ r }) => `To calculate a markup price, multiply the cost by 1 plus the markup percentage. A <strong>$40</strong> item with a <strong>50%</strong> markup sells for $40 × 1.50 = <strong>${r.value}</strong>. The $20 profit is 50% of the cost but only 33.3% of the price, so the gross margin is 33.3%. Doubling the cost (keystone pricing) is a 100% markup and a 50% margin.`,
  stepsTitle: 'How to calculate a markup price',
  steps: [
    'Add up your full <strong>unit cost</strong>: the supplier price plus inbound shipping, duties and packaging. Forgetting landed costs is the most common reason a markup leaves too little profit.',
    'Choose a markup percentage, or a target margin if your plan is written in margins. They are not interchangeable: a 40% margin needs a 66.7% markup.',
    'Multiply: selling price = cost × (1 + markup ÷ 100). From a margin: price = cost ÷ (1 − margin ÷ 100).',
    'Check the result against competitors and round to a price point ($59.99, $60). Rounding changes the real markup, so switch the calculator to "cost and selling price" to see the final figure.'
  ],
  formulaTitle: 'What is the markup formula?',
  formula: {
    expr: 'Selling price = Cost × (1 + Markup %)<br>Markup % = (Price − Cost) ÷ Cost × 100<br>Margin % = (Price − Cost) ÷ Price × 100',
    vars: [['Cost', 'what one unit costs you, landed'], ['Price', 'what the customer pays (before sales tax)'], ['Markup %', 'profit as a share of cost'], ['Margin %', 'profit as a share of price']],
    note: 'Convert between them with margin = markup ÷ (1 + markup) and markup = margin ÷ (1 − margin), using decimals (50% = 0.50).'
  },
  example: `<p>A boutique buys candles for $12 each and pays $1.50 per candle in freight, so the landed cost is <strong>$13.50</strong>.</p>
<p>At a 120% markup: $13.50 × 2.20 = <strong>$29.70</strong>, which the owner rounds to $29.99.</p>
<p>Real markup at $29.99: ($29.99 − $13.50) ÷ $13.50 = <strong>122.1%</strong>. Gross margin: $16.49 ÷ $29.99 = <strong>55.0%</strong>.</p>
<p>Had the owner marked up only the $12 supplier price, the candle would sell for $26.40 and the margin on the true $13.50 cost would fall to 48.9%.</p>`,
  table: {
    title: 'What margin does each markup give you?',
    intro: 'Markup to gross margin conversions, worked out by the calculator above, with the price for a $40 item at each level.',
    head: ['Markup on cost', 'Gross margin', 'Multiply cost by', '$40 cost sells for'],
    rows: ({ run, H }) => [10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 150, 200].map(m => { const r = run({ mode: 'markup', cost: 40, markup: m }); return [m + '%', H.pct(r.mg, 1), H.fix(1 + m / 100, 2) + '×', H.money(r.p)]; }),
    note: 'Margin can never reach 100%, but markup has no ceiling: a 200% markup (selling at three times cost) is a 66.7% margin.'
  },
  sections: [
    {
      h2: 'What is the difference between markup and margin?',
      html: `<p>Both describe the same dollar profit, measured against different bases. <strong>Markup</strong> compares profit with what you paid; <strong>margin</strong> compares it with what the customer paid. On a $40 cost and $60 price, the $20 profit is a 50% markup but a 33.3% margin.</p>
<p>The mix-up costs money. A shop that wants a 40% margin but applies a 40% markup to a $40 item charges $56 instead of $66.67, and its real margin is only 28.6%. Going the other way, use this table of common margin targets:</p>
<div class="twrap"><table><thead><tr><th>Target margin</th><th>Markup needed</th><th>Price on $40 cost</th></tr></thead><tbody>
${[10, 20, 25, 30, 35, 40, 50, 60].map(g => `<tr><td>${g}%</td><td>${fx(g / (100 - g) * 100)}</td><td>$${(40 / (1 - g / 100)).toFixed(2)}</td></tr>`).join('')}
</tbody></table></div>
<p>To read your actual margin off a finished income statement rather than a single product, use the <a href="/profit-margin-calculator">profit margin calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate retail price from wholesale?',
      html: `<p>Retail price = wholesale cost × (1 + markup). Many independent retailers start from <strong>keystone pricing</strong>, doubling the wholesale cost (a 100% markup and 50% margin), then adjust by category. A $25 wholesale item at keystone retails for $50; at a 2.2× multiplier it retails for $55.</p>
<p>Brands that publish a suggested retail price (MSRP) often set it so retailers can earn close to a keystone margin. If a $79 MSRP follows that pattern, the wholesale price is about $39.50; ask the supplier for the actual wholesale sheet before you rely on it.</p>`
    },
    {
      h2: 'How do you calculate wholesale price from retail?',
      html: `<p>Work backwards: wholesale = retail ÷ (1 + markup), or retail × (1 − margin). If a store sells a lamp for $120 and is known to target a 50% margin, it paid about $120 × 0.50 = <strong>$60</strong>. If the store uses a 60% markup instead, the cost is $120 ÷ 1.60 = $75.</p>
<p>Makers setting wholesale prices often go the other way: start from the retail price the market will bear, take off the retailer's margin, and check that what's left still covers their own cost plus profit.</p>`
    },
    {
      h2: 'What markup do retailers use?',
      html: `<p>The U.S. Census Bureau's Annual Retail Trade Survey reports gross margin as a share of sales for each kind of store. Converting those margins gives the average markup each type of retailer achieved in 2022, after markdowns and discounts:</p>
<div class="twrap"><table><thead><tr><th>Kind of retailer (NAICS)</th><th>Gross margin, 2022</th><th>Implied average markup</th></tr></thead><tbody>
${ARTS.map(a => `<tr><td>${a[0]} (${a[1]})</td><td>${fx(a[2])}</td><td>${fx(a[2] / (100 - a[2]) * 100)}</td></tr>`).join('')}
</tbody></table></div>
<p>These are realized averages. Initial markups on the shelf tag are higher, because clearance sales, shrink and coupons pull the average down.</p>`
    }
  ],
  faq: [
    { q: 'What is a 50% markup?', a: 'A 50% markup adds half the cost to the cost. A $40 item sells for $60, the $20 profit is a 33.3% gross margin, and the price is 1.5 times cost.' },
    { q: 'How do I add a 30% markup to a price?', a: 'Multiply by 1.30. A $100 cost with a 30% markup sells for $130, which is a 23.1% margin.' },
    { q: 'Is a 100% markup the same as doubling the price?', a: 'Yes. A 100% markup sells at twice the cost, which gives a 50% gross margin. This is called keystone pricing.' },
    { q: 'Can markup be more than 100%?', a: 'Yes. Markup has no upper limit; selling a $5 item for $20 is a 300% markup. Margin, by contrast, is always below 100%.' },
    { q: 'How do I calculate markup percentage in Excel?', a: 'With cost in A2 and price in B2, use =(B2-A2)/A2 and format as a percentage. For margin use =(B2-A2)/B2. To get a price from a markup in C2, use =A2*(1+C2).' },
    { q: 'Why does a 25% markup followed by a 25% discount lose money?', a: 'The discount is taken from the higher price. $100 marked up 25% is $125; 25% off $125 is $93.75, below the $100 cost. To break even after a 25% discount you need a 33.3% markup.' },
    { q: 'Should markup be based on cost before or after shipping?', a: 'After. Base markup on landed cost, including inbound freight, duties and packaging, so the price covers what the item really cost you to get on the shelf.' }
  ],
  related: ['profit-margin-calculator', 'discount-calculator', 'break-even-calculator', 'cogs-calculator', 'percentage-calculator'],
  sources: [
    { name: 'U.S. Census Bureau: Annual Retail Trade Survey (ARTS)', url: 'https://www.census.gov/programs-surveys/arts.html' },
    { name: 'U.S. Census Bureau: ARTS gross margin as a percentage of sales, 1993–2022 (Excel)', url: 'https://www2.census.gov/programs-surveys/arts/tables/2022benchmarked/gmper.xlsx' },
    { name: 'OpenStax (Rice University): Principles of Accounting, Volume 2: Managerial Accounting', url: 'https://openstax.org/details/books/principles-managerial-accounting' }
  ]
};
