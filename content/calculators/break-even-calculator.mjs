export default {
  slug: 'break-even-calculator',
  hub: 'business',
  name: 'Break-Even Point Calculator',
  title: 'Break-Even Calculator: $12,000 Fixed Costs = 600 Units',
  h1: 'Break-Even Point Calculator: Units, Sales Dollars and Margin of Safety',
  meta: 'With $12,000 of monthly fixed costs, a $50 price and $30 variable cost, you break even at 600 units ($30,000 in sales). Add a profit target or sales forecast.',
  keyword: 'how to calculate break even point',
  also: ['break even point calculator', 'how to calculate break even point in units', 'how to calculate break even point in sales dollars', 'how to calculate total contribution margin', 'how to calculate weighted average contribution margin', 'how to calculate margin of safety in percentage', 'how to calculate break even occupancy multifamily'],
  updated: '2026-11-13',
  inputs: [
    { id: 'fixed', label: 'Fixed costs for the period', type: 'number', value: 12000, prefix: '$', help: 'Rent, salaries, insurance, software: costs that don\'t change with volume.' },
    { id: 'price', label: 'Selling price per unit', type: 'number', value: 50, prefix: '$' },
    { id: 'vc', label: 'Variable cost per unit', type: 'number', value: 30, prefix: '$', help: 'Materials, packaging, shipping, card fees, commissions.' },
    { id: 'target', label: 'Target profit (optional)', type: 'number', value: '', prefix: '$', placeholder: '0' },
    { id: 'expected', label: 'Expected sales (optional)', type: 'number', value: 800, suffix: 'units', help: 'Used for the margin of safety.' }
  ],
  compute(v, H) {
    var F = v.fixed, p = v.price, vc = v.vc;
    if (!(F >= 0)) return { error: 'Enter your fixed costs.' };
    if (!(p > 0)) return { error: 'Enter a selling price per unit.' };
    if (!(vc >= 0)) return { error: 'Enter the variable cost per unit (0 if none).' };
    var cm = p - vc;
    if (cm <= 0) return { error: 'The price must be higher than the variable cost, or you never break even.' };
    var tp = v.target > 0 ? v.target : 0;
    var units = (F + tp) / cm, cmr = cm / p;
    var whole = Math.ceil(units - 1e-9);
    var rows = [
      ['Break-even sales', H.money(units * p), true],
      ['Contribution margin per unit', H.money(cm)],
      ['Contribution margin ratio', H.pct(cmr * 100, 2)],
      ['Exact units', H.num(units, 2)]
    ];
    var sub = 'Every unit sold contributes ' + H.money(cm) + ' toward fixed costs' + (tp ? ' and the profit target' : '') + '.';
    if (v.expected > 0) {
      var q = v.expected, mos = q - units;
      rows.push(['Profit at ' + H.int(q) + ' units', H.money(q * cm - F)]);
      rows.push(['Margin of safety', H.int(mos) + ' units (' + H.pct(mos / q * 100, 1) + ')']);
      sub = mos >= 0 ? 'Sales can fall ' + H.pct(mos / q * 100, 1) + ' (' + H.int(mos) + ' units) from your forecast before you ' + (tp ? 'miss the profit target.' : 'start losing money.')
        : 'Your forecast is ' + H.int(-mos) + ' units short of ' + (tp ? 'the profit target.' : 'break-even.');
    }
    return {
      value: H.int(whole) + ' units',
      label: tp ? 'Units to hit the profit target' : 'Break-even point',
      expr: H.money0(F + tp) + ' ÷ (' + H.money(p) + ' − ' + H.money(vc) + ')',
      rows: rows,
      sub: sub,
      units: units, sales: units * p
    };
  },
  quick: ({ r }) => `To calculate the break-even point, divide fixed costs by the contribution margin per unit (price minus variable cost). With <strong>$12,000</strong> of monthly fixed costs, a $50 price and a $30 variable cost, each sale contributes $20, so you break even at $12,000 ÷ $20 = <strong>${r.value}</strong>, or <strong>$30,000</strong> in sales. Selling 800 units gives a 25% margin of safety.`,
  stepsTitle: 'How to calculate the break-even point',
  steps: [
    'List <strong>fixed costs</strong> for one period (usually a month): rent, salaried payroll, insurance, loan payments, subscriptions.',
    'Work out the <strong>variable cost per unit</strong>: everything that rises with each sale, including card fees, shipping and sales commissions. Leaving these out is the most common error and makes break-even look too easy.',
    'Subtract variable cost from price to get the <strong>contribution margin</strong> per unit, then divide fixed costs by it. Round up: you can\'t sell part of a unit.',
    'Multiply break-even units by price for break-even sales, or divide fixed costs by the contribution margin ratio. Add a target profit to fixed costs to find the volume needed to earn it.'
  ],
  formulaTitle: 'What is the break-even formula?',
  formula: {
    expr: 'Break-even units = Fixed costs ÷ (Price − Variable cost)<br>Break-even sales = Fixed costs ÷ Contribution margin ratio<br>Units for a target = (Fixed costs + Target profit) ÷ Contribution margin',
    vars: [['Fixed costs', 'costs that stay the same at any volume in the period'], ['Price − Variable cost', 'contribution margin per unit'], ['Contribution margin ratio', '(Price − Variable cost) ÷ Price']],
    note: 'These are the formulas in the U.S. Small Business Administration\'s break-even guidance and standard cost-volume-profit (CVP) analysis.'
  },
  example: `<p>A screen-printing shop pays $12,000 a month in rent, wages and equipment leases. It sells shirts for $50; ink, blanks and packaging cost $30 per shirt.</p>
<p>Contribution margin = $50 − $30 = $20 per shirt. Contribution margin ratio = $20 ÷ $50 = 40%.</p>
<p>Break-even = $12,000 ÷ $20 = <strong>600 shirts</strong> a month, or $12,000 ÷ 0.40 = <strong>$30,000</strong> in sales.</p>
<p>To earn $4,000 a month in profit: ($12,000 + $4,000) ÷ $20 = <strong>800 shirts</strong>. At a forecast of 800 shirts, the margin of safety is (800 − 600) ÷ 800 = <strong>25%</strong>.</p>`,
  table: {
    title: 'How does price change the break-even point?',
    intro: 'Break-even volume for the example above ($12,000 fixed costs, $30 variable cost) at different selling prices, computed with the calculator.',
    head: ['Price', 'Contribution per unit', 'CM ratio', 'Break-even units', 'Break-even sales'],
    rows: ({ run, H }) => [35, 40, 45, 50, 55, 60, 65, 70, 80].map(p => { const r = run({ price: p, vc: 30, fixed: 12000, target: NaN, expected: NaN }); return [H.money0(p), H.money0(p - 30), H.pct((p - 30) / p * 100, 1), r.value, H.money0(Math.ceil(r.units - 1e-9) * p)]; }),
    note: 'A 10% price rise from $50 to $55 cuts the break-even volume by 20%, because all of the increase goes to contribution margin. Price cuts work the same way in reverse.'
  },
  sections: [
    {
      h2: 'How do you calculate break-even with several products?',
      html: `<p>Use a <strong>weighted average contribution margin</strong>, weighted by the expected sales mix. Suppose the shop above also sells hoodies at $80 with a $40 variable cost ($40 contribution), and expects to sell 3 shirts for every hoodie.</p>
<p>Weighted contribution = 0.75 × $20 + 0.25 × $40 = <strong>$25</strong> per unit. Break-even = $12,000 ÷ $25 = 480 units: 360 shirts and 120 hoodies. Check: 360 × $20 + 120 × $40 = $12,000.</p>
<p>If the mix shifts toward the lower-margin product, the break-even volume rises even though nothing else changed, so recheck it when your sales mix moves.</p>`
    },
    {
      h2: 'How do you calculate margin of safety as a percentage?',
      html: `<p>Margin of safety = (expected or actual sales − break-even sales) ÷ expected sales × 100. It tells you how far sales can drop before you make a loss. At 800 units against a 600-unit break-even, the margin is 200 ÷ 800 = 25%. In dollars it's $40,000 − $30,000 = $10,000 of sales.</p>
<p>A small margin of safety means a single bad month can push you into a loss, so businesses with thin margins of safety usually hold more cash in reserve.</p>`
    },
    {
      h2: 'How long will it take my business to break even?',
      html: `<p>The calculation above gives volume per period. To estimate time, compare that volume with your expected sales ramp: if you expect to sell 300 shirts in month one and add 75 a month, you reach 600 in month five. Separately, recovering the money you invested to start up is a payback question, not a monthly break-even one; the <a href="/payback-period-calculator">payback period calculator</a> handles that.</p>
<p>Startup lenders typically ask for this analysis in a business plan. The SBA suggests running it for each product and padding cost estimates, since early costs are easy to underestimate.</p>`
    },
    {
      h2: 'How do you calculate break-even occupancy for a rental property?',
      html: `<p>Break-even occupancy = (operating expenses + annual debt service) ÷ gross potential rent. A 40-unit apartment building with $1,000,000 of gross potential rent, $380,000 of operating expenses and $320,000 of mortgage payments breaks even at ($380,000 + $320,000) ÷ $1,000,000 = <strong>70% occupancy</strong>. Lenders like to see actual occupancy comfortably above this figure. For full rental cash flow, use the <a href="/rental-property-calculator">rental property calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the break-even point in simple terms?', a: 'It is the sales volume at which total revenue equals total costs, so profit is exactly zero. Every unit sold beyond it adds its contribution margin to profit.' },
    { q: 'How do I calculate the break-even point in sales dollars?', a: 'Divide fixed costs by the contribution margin ratio. With $12,000 of fixed costs and a 40% ratio, break-even sales are $12,000 ÷ 0.40 = $30,000.' },
    { q: 'What is total contribution margin?', a: 'Total contribution margin is sales revenue minus all variable costs. Selling 800 units at a $20 contribution each gives $16,000, which covers $12,000 of fixed costs and leaves $4,000 of profit.' },
    { q: 'Is depreciation a fixed cost in break-even analysis?', a: 'Usually, yes. Straight-line depreciation on equipment doesn\'t change with volume, so it belongs in fixed costs. Leave it out only if you want a cash break-even point.' },
    { q: 'What if my price is lower than my variable cost?', a: 'Then each sale loses money and there is no break-even point; selling more makes the loss bigger. Raise the price or cut variable costs first.' },
    { q: 'How do I calculate break-even in Excel?', a: 'With fixed costs in B1, price in B2 and variable cost in B3, use =ROUNDUP(B1/(B2-B3),0) for units and =B1/((B2-B3)/B2) for sales dollars.' },
    { q: 'What is the difference between break-even point and break-even ROAS?', a: 'The break-even point is the volume that covers fixed costs. Break-even ROAS is the ad return at which ad spend equals the gross profit it generates, which is 1 divided by your margin. The ROAS calculator works it out.' }
  ],
  related: ['profit-margin-calculator', 'roas-calculator', 'payback-period-calculator', 'markup-calculator', 'total-cost-calculator'],
  sources: [
    { name: 'U.S. Small Business Administration: Calculate your startup costs (break-even analysis)', url: 'https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs' },
    { name: 'OpenStax (Rice University): Principles of Accounting, Volume 2: Managerial Accounting (cost-volume-profit analysis)', url: 'https://openstax.org/details/books/principles-managerial-accounting' }
  ]
};
