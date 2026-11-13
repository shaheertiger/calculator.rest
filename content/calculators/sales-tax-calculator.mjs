export default {
  slug: 'sales-tax-calculator',
  hub: 'pay',
  name: 'Sales Tax Calculator',
  title: 'Sales Tax Calculator: 8.25% on $120 Is $9.90 (Total $129.90)',
  h1: 'Sales Tax Calculator: Add Tax to a Price or Work It Backwards From a Total',
  meta: '8.25% sales tax on a $120 purchase is $9.90, for a total of $129.90. Add tax to any price, or take a receipt total and find the pre-tax price and tax backwards.',
  keyword: 'how calculate sales tax',
  also: ['how to calculate sales tax backwards from total', 'how to calculate sales tax from total backwards', 'how do i calculate sales tax in texas', 'how to calculate florida sales tax', 'how to calculate sales tax in excel', 'how to calculate tax paid from total', 'how to calculate taxes on a purchase', 'how to add tax in calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'add', options: [['add', 'Add tax to a price'], ['back', 'Remove tax from a total (backwards)']] },
    { id: 'amount', label: 'Price before tax', type: 'number', value: 120, prefix: '$', showIf: { mode: ['add'] } },
    { id: 'total', label: 'Total paid, tax included', type: 'number', value: 129.9, prefix: '$', showIf: { mode: ['back'] } },
    { id: 'rate', label: 'Sales tax rate (state + local)', type: 'number', value: 8.25, suffix: '%' }
  ],
  data: {
    states: [['California', 7.25], ['Texas', 6.25], ['Florida', 6], ['New York', 4], ['Pennsylvania', 6], ['Illinois', 6.25], ['Ohio', 5.75], ['Georgia', 4], ['North Carolina', 4.75], ['Michigan', 6], ['New Jersey', 6.625], ['Washington', 6.5], ['Arizona', 5.6], ['Tennessee', 7], ['Massachusetts', 6.25]]
  },
  compute(v, H) {
    if (!(v.rate >= 0) || v.rate > 50) return { error: 'Enter a sales tax rate between 0% and 50%.' };
    var r = v.rate / 100, price, tax, total;
    if (v.mode === 'back') {
      if (!(v.total > 0)) return { error: 'Enter the total you paid.' };
      total = v.total; price = total / (1 + r); tax = total - price;
    } else {
      if (!(v.amount > 0)) return { error: 'Enter the price before tax.' };
      price = v.amount; tax = price * r; total = price + tax;
    }
    var rows = v.mode === 'back'
      ? [['Price before tax', H.money(price), true], ['Total paid', H.money(total)], ['Tax as a share of the total', H.pct(tax / total * 100, 2)]]
      : [['Total with tax', H.money(total), true], ['Price before tax', H.money(price)], ['Tax per $100 spent', H.money(r * 100)]];
    return {
      value: H.money(tax),
      label: 'Sales tax',
      expr: v.mode === 'back' ? H.money(total) + ' − ' + H.money(total) + ' ÷ ' + H.num(1 + r, 5) : H.money(price) + ' × ' + H.num(v.rate, 4) + '%',
      rows: rows,
      sub: v.mode === 'back' ? 'Divide the total by 1 + the rate to remove tax; subtracting ' + H.num(v.rate, 4) + '% of the total would understate the price.' : 'Multiply the price by 1 + the rate (' + H.num(1 + r, 5) + ') to get the total in one step.'
    };
  },
  quick: ({ r }) => `To calculate sales tax, multiply the price by the tax rate as a decimal. At <strong>8.25%</strong>, the top combined rate in Texas, a <strong>$120</strong> purchase carries $120 × 0.0825 = <strong>${r.value}</strong> in tax, for a total of $129.90. To work backwards from a receipt, divide the total by 1.0825: $129.90 ÷ 1.0825 = $120 before tax.`,
  stepsTitle: 'How to calculate sales tax',
  steps: [
    'Find the combined rate for where you buy: state rate plus any county, city and special district rates.',
    'Convert it to a decimal by dividing by 100: 8.25% = 0.0825.',
    'Multiply the pre-tax price by the decimal for the tax, or by 1 + the decimal (1.0825) for the total.',
    'To go backwards from a total, divide by 1 + the decimal. Do not multiply the total by the rate and subtract; that is the usual mistake and it overstates the tax.'
  ],
  formulaTitle: 'What is the sales tax formula?',
  formula: {
    expr: 'Sales tax = Price × Rate<br>Total = Price × (1 + Rate)<br>Price before tax = Total ÷ (1 + Rate)',
    vars: [['Price', 'pre-tax selling price of taxable items'], ['Rate', 'combined state and local rate as a decimal (8.25% = 0.0825)'], ['Total', 'amount paid including tax']]
  },
  example: `<p>A receipt from a Houston store shows a total of $54.13 with no tax breakdown. Houston's combined rate is 8.25%.</p>
<p>Price before tax: $54.13 ÷ 1.0825 = <strong>$50.00</strong>. Tax: $54.13 − $50.00 = <strong>$4.13</strong>.</p>
<p>The shortcut that fails: 8.25% of $54.13 is $4.47, which would put the pre-tax price at $49.66, 34 cents too low.</p>`,
  table: {
    title: 'What are state sales tax rates in 2026?',
    intro: 'Statewide base rates for the most populous states and the tax on a $100 purchase at the state rate alone. Local taxes add more in most of these states.',
    head: ['State', 'State rate', 'Tax on $100', 'Total for $100'],
    rows: ({ run, D, H }) => D.states.map(s => { const o = run({ mode: 'add', amount: 100, rate: s[1] }); return [s[0], H.pct(s[1], 3), o.value, o.rows[0][1]]; }),
    note: 'Alaska, Delaware, Montana, New Hampshire and Oregon have no statewide sales tax, though some Alaska and Montana localities levy their own. Check your state revenue department for the exact rate at your address.'
  },
  sections: [
    {
      h2: 'How do you calculate sales tax backwards from a total?',
      html: `<p>Divide the total by 1 plus the tax rate. That gives the pre-tax price; subtract it from the total for the tax. With a 7% rate, a $96.30 total is $96.30 ÷ 1.07 = $90.00 before tax, and the tax is $6.30.</p>
<p>The reason you can't just take 7% of $96.30: the tax was charged on the smaller pre-tax price, not on the total. Switch the calculator to "Remove tax from a total" to do it for any receipt, which is handy for expense reports and for checking that a store charged the right rate.</p>`
    },
    {
      h2: 'How do I calculate sales tax in Texas?',
      html: `<p>Texas charges a 6.25% state sales tax, and cities, counties, transit authorities and special districts can add up to 2% more, for a maximum combined rate of <strong>8.25%</strong>. Houston, Dallas, San Antonio and Austin are all at 8.25%. Multiply the price by 0.0825 there, or by your local rate elsewhere.</p>
<p>Cars are different: Texas charges a 6.25% motor vehicle sales tax on the purchase price (minus any trade-in allowance), with no local add-on. A $32,000 car with an $8,000 trade-in owes 6.25% × $24,000 = $1,500, plus title and registration fees. Most groceries and prescription drugs are exempt.</p>`
    },
    {
      h2: 'How is Florida sales tax calculated?',
      html: `<p>Florida's state rate is 6%. Most counties add a discretionary sales surtax, so combined rates usually run from 6% to 8%. The county surtax applies only to the first $5,000 of a single item, which matters on cars, boats and furniture.</p>
<p>Example: a $1,200 laptop in a county with a 1% surtax is taxed at 7%: $84. A $30,000 car in the same county pays 6% on the full price ($1,800) plus 1% on the first $5,000 ($50), for $1,850. The Florida Department of Revenue publishes each county's surtax rate.</p>`
    },
    {
      h2: 'How do you calculate sales tax in Excel or on a phone calculator?',
      html: `<p>In Excel or Google Sheets, with the price in A2 and the rate in B2 as a percentage: tax is <code>=A2*B2</code>, total is <code>=A2*(1+B2)</code>, and the pre-tax price from a total is <code>=A2/(1+B2)</code>. Wrap results in <code>=ROUND(…,2)</code> to match a register, which rounds each transaction to the cent.</p>
<p>On a phone calculator, type the price, then × 1.0825 (your rate as 1 + decimal) and =. Many basic calculators also have a % key: 120 + 8.25 % gives 129.9 directly.</p>`
    }
  ],
  faq: [
    { q: 'How much is 7% sales tax on $100?', a: '$7, for a total of $107.' },
    { q: 'How do I find the tax rate from a receipt?', a: 'Divide the tax by the pre-tax subtotal and multiply by 100. $4.13 of tax on $50.00 is an 8.26% rate, which rounds to the 8.25% charged.' },
    { q: 'What is the sales tax on a $25,000 car?', a: 'It depends on the state: 6.25% in Texas is $1,562.50, and 7.25% in California is $1,812.50 before local add-ons. Many states tax only the price after a trade-in.' },
    { q: 'Is sales tax charged on shipping?', a: 'In some states. Shipping that is part of a taxable sale is often taxable, especially if you cannot avoid it, while separately stated delivery charges are exempt in others.' },
    { q: 'Which states have no sales tax?', a: 'Alaska, Delaware, Montana, New Hampshire and Oregon have no statewide sales tax. Some Alaska and Montana local governments charge their own.' },
    { q: 'Do I pay sales tax on online purchases?', a: 'Usually yes. Since the Supreme Court\'s 2018 Wayfair decision, every state with a sales tax requires large online sellers to collect it, at the rate for your delivery address.' },
    { q: 'Should I tip on the amount before or after sales tax?', a: 'Before tax is standard. Use the tip calculator with your pre-tax subtotal.' }
  ],
  related: ['discount-calculator', 'tip-calculator', 'percentage-calculator', 'car-loan-calculator', 'unit-price-calculator'],
  sources: [
    { name: 'Texas Comptroller: Sales and Use Tax', url: 'https://comptroller.texas.gov/taxes/sales/' },
    { name: 'Florida Department of Revenue: Sales and Use Tax', url: 'https://floridarevenue.com/taxes/taxesfees/Pages/sales_tax.aspx' },
    { name: 'California CDTFA: Sales and use tax rates', url: 'https://www.cdtfa.ca.gov/taxes-and-fees/rates.aspx' },
    { name: 'Federation of Tax Administrators: State sales tax rates', url: 'https://taxadmin.org/' }
  ]
};
