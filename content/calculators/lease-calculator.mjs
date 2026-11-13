export default {
  slug: 'lease-calculator',
  hub: 'loans',
  name: 'Car Lease Calculator',
  title: 'Car Lease Calculator: Money Factor .0025 = 6% APR ($522.61/mo)',
  h1: 'Car Lease Calculator: Money Factor, Residual and Monthly Lease Payment',
  meta: 'A money factor of 0.00250 equals a 6% APR. On a $40,000-MSRP car at $37,500 with a 58% residual for 36 months, the lease is $522.61 a month with 7% tax.',
  keyword: 'how to calculate the money factor on a lease',
  also: ['how to calculate money factor', 'car lease calculator', 'how to calculate auto lease', 'how to calculate residual value of car', 'how to calculate lease buyout amount', 'how is lease buyout calculated', 'how is a lease buyout calculated', 'how to calculate lease buyout'],
  updated: '2026-11-13',
  inputs: [
    { id: 'msrp', label: 'MSRP (sticker price)', type: 'number', value: 40000, prefix: '$', help: 'The residual is a percentage of MSRP, not of the price you negotiate.' },
    { id: 'price', label: 'Negotiated price (cap cost)', type: 'number', value: 37500, prefix: '$' },
    { id: 'fees', label: 'Fees rolled into the lease', type: 'number', value: 0, prefix: '$', help: 'Acquisition fee and any dealer fees you finance.' },
    { id: 'down', label: 'Down payment / cap cost reduction', type: 'number', value: 2000, prefix: '$', help: 'Cash, rebates and trade-in equity that lower the cap cost.' },
    { id: 'residual', label: 'Residual value', type: 'number', value: 58, suffix: '% of MSRP' },
    { id: 'term', label: 'Lease term', type: 'select', value: '36', options: [['24', '24 months'], ['27', '27 months'], ['30', '30 months'], ['33', '33 months'], ['36', '36 months'], ['39', '39 months'], ['42', '42 months'], ['48', '48 months']] },
    { id: 'rtype', label: 'Rate given as', type: 'select', value: 'mf', options: [['mf', 'Money factor'], ['apr', 'APR']] },
    { id: 'mf', label: 'Money factor', type: 'number', value: 0.0025, showIf: { rtype: ['mf'] }, help: 'Usually written like 0.00250 or "2.50".' },
    { id: 'apr', label: 'Equivalent APR', type: 'number', value: 6, suffix: '%', showIf: { rtype: ['apr'] } },
    { id: 'tax', label: 'Sales tax on payments', type: 'number', value: 7, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.msrp > 0) || !(v.price > 0)) return { error: 'Enter the MSRP and the negotiated price.' };
    if (!(v.residual > 0 && v.residual < 100)) return { error: 'Enter the residual as a percentage of MSRP, for example 58.' };
    var n = Number(v.term) || 36;
    var mf;
    if (v.rtype === 'apr') {
      if (!(v.apr >= 0) || v.apr > 40) return { error: 'Enter an APR between 0% and 40%.' };
      mf = v.apr / 2400;
    } else {
      mf = v.mf;
      if (!(mf >= 0)) return { error: 'Enter the money factor, e.g. 0.00250.' };
      if (mf >= 0.1) mf = mf / 1000;
    }
    var adj = v.price + (v.fees > 0 ? v.fees : 0) - (v.down > 0 ? v.down : 0);
    var res = v.msrp * v.residual / 100;
    if (!(adj > res)) return { error: 'The adjusted cap cost must be higher than the residual value of ' + H.money(res) + '.' };
    var c2 = function (x) { return Math.round(x * 100) / 100; };
    var dep = c2((adj - res) / n);
    var rent = c2((adj + res) * mf);
    var base = dep + rent;
    var tax = c2(base * (v.tax > 0 ? v.tax : 0) / 100);
    var pay = c2(base + tax);
    var down = v.down > 0 ? v.down : 0;
    return {
      value: H.money(pay),
      label: 'Monthly lease payment (with tax)',
      expr: H.money(dep) + ' depreciation + ' + H.money(rent) + ' rent charge',
      rows: [
        ['Money factor / APR', H.fix(mf, 5) + ' = ' + H.pct(mf * 2400, 2) + ' APR'],
        ['Adjusted cap cost', H.money(adj)],
        ['Residual value', H.money(res)],
        ['Depreciation fee', H.money(dep)],
        ['Rent charge (finance fee)', H.money(rent)],
        ['Sales tax per month', H.money(tax)],
        ['Total lease cost (payments + down)', H.money(pay * n + down), true],
        ['Buyout at lease end (before fees)', H.money(res)]
      ],
      sub: 'Over ' + n + ' months you pay ' + H.money(rent * n) + ' in rent charges, the lease equivalent of interest.'
    };
  },
  quick: ({ r }) => `To find the money factor on a lease, divide the APR by 2,400: 6% ÷ 2,400 = <strong>0.00250</strong>. Going the other way, money factor × 2,400 = APR. On a $40,000-MSRP car negotiated to $37,500 with $2,000 down, a 58% residual and 36 months, that factor makes a $146.75 rent charge and a lease payment of <strong>${r.value}</strong> with 7% tax.`,
  stepsTitle: 'How to calculate a car lease payment',
  steps: [
    'Start from the negotiated price, add any fees you are rolling in (such as the acquisition fee), and subtract your down payment, rebates and trade-in equity. That is the adjusted capitalized cost.',
    'Multiply the MSRP, not the negotiated price, by the residual percentage to get the residual value. Using the selling price here is the most common mistake.',
    'Depreciation fee = (adjusted cap cost − residual) ÷ months.',
    'Rent charge = (adjusted cap cost + residual) × money factor. If you only have an APR, divide it by 2,400 first.',
    'Add the two and apply your state\'s sales tax (most states tax each monthly payment).'
  ],
  formulaTitle: 'What is the car lease payment formula?',
  formula: {
    expr: 'Money factor = APR ÷ 2,400<br>Depreciation fee = (Adjusted cap cost − Residual) ÷ Term<br>Rent charge = (Adjusted cap cost + Residual) × Money factor<br>Payment = (Depreciation + Rent) × (1 + tax rate)',
    vars: [['Adjusted cap cost', 'price + capitalized fees − down payment, rebates, trade equity'], ['Residual', 'MSRP × residual % set by the leasing company'], ['Term', 'lease length in months']],
    note: 'Why 2,400? The rent charge is applied to the cap cost plus the residual, which is roughly twice the average balance you are financing. Dividing the annual rate by 12 months and by 2 gives APR ÷ 24, and the 100 converts a percentage to a decimal: 12 × 2 × 100 = 2,400.'
  },
  example: `<p>MSRP $40,000, negotiated price $37,500, $2,000 down, residual 58%, 36 months, money factor 0.00250, 7% tax.</p>
<p>Adjusted cap cost = $37,500 − $2,000 = <strong>$35,500</strong>. Residual = $40,000 × 0.58 = <strong>$23,200</strong>.</p>
<p>Depreciation = ($35,500 − $23,200) ÷ 36 = <strong>$341.67</strong>. Rent charge = ($35,500 + $23,200) × 0.0025 = <strong>$146.75</strong>.</p>
<p>Base payment = $488.42. Tax at 7% = $34.19. Monthly payment = <strong>$522.61</strong>. Over 36 months plus the $2,000 down, the lease costs $20,813.96.</p>`,
  table: {
    title: 'How do the money factor and residual change a lease payment?',
    intro: 'Monthly payment with 7% tax on the default deal ($37,500 price, $2,000 down, $40,000 MSRP, 36 months) at different money factors and residuals.',
    head: ['Money factor', 'APR', '50% residual', '55% residual', '58% residual', '62% residual'],
    rows: ({ run, H }) => [0.0010, 0.0015, 0.0020, 0.0025, 0.0030, 0.0035, 0.0040].map(m => [H.fix(m, 5), H.pct(m * 2400, 1), ...[50, 55, 58, 62].map(rr => run({ rtype: 'mf', mf: m, residual: rr }).value)]),
    note: 'A higher residual lowers the payment because you pay for less depreciation. A money factor marked up by 0.0004 (about one APR point) adds roughly $25 a month with tax on this car.'
  },
  sections: [
    {
      h2: 'How do you calculate the money factor from a lease quote?',
      html: `<p>Dealers often quote only the payment. If you know the price, residual, down payment and term, you can back out the money factor: take the pre-tax payment, subtract the depreciation fee, and divide what is left by the adjusted cap cost plus the residual.</p>
<p>Example: the same car is quoted at $500 a month before tax. Depreciation is $341.67, so the rent charge is $158.33. Money factor = $158.33 ÷ ($35,500 + $23,200) = <strong>0.002697</strong>, or about <strong>6.47% APR</strong>. If the leasing company's base ("buy") rate is 0.00250, the dealer has added roughly half a point. Ask for the money factor in writing; federal Regulation M requires the lease disclosure to show the rent charge, residual value and capitalized cost so you can check the math.</p>`
    },
    {
      h2: 'How is the residual value of a car calculated?',
      html: `<p>The residual is the leasing company's forecast of what the car will be worth at the end of the lease, written as a percentage of MSRP. It is set by the lessor (often the manufacturer's finance arm) for each model, term and annual mileage allowance, and it is not negotiable. Typical 36-month residuals for new cars fall roughly between 50% and 65%; shorter terms and lower mileage allowances get higher residuals.</p>
<p>Residual value = MSRP × residual %. On a $40,000 MSRP at 58%, that is $23,200, no matter how far below sticker you negotiate the price. That is why negotiating the price down lowers your payment twice: it shrinks the depreciation you pay for and the rent charge. For how cars actually lose value over time, see the <a href="/car-depreciation-calculator">car depreciation calculator</a>.</p>`
    },
    {
      h2: 'How is a lease buyout calculated?',
      html: `<p><strong>At the end of the lease</strong>, the buyout is the residual value written in your contract plus any purchase-option fee and sales tax: $23,200 plus fees in the example. If the car is worth more than the residual on the open market, buying it out (or selling it to a dealer) can make sense.</p>
<p><strong>Before the lease ends</strong>, the payoff is the lessor's adjusted lease balance, which is roughly the residual plus the depreciation you have not yet paid, plus any early-termination charges. After 24 of 36 payments that is about $23,200 + 12 × $341.67 = <strong>$27,300</strong> before fees and tax. The CFPB warns that ending a lease early can be very expensive, so get a written payoff quote first.</p>`
    },
    {
      h2: 'Is it cheaper to lease or buy?',
      html: `<p>Leasing usually means a lower monthly payment, but you pay for the car's depreciation and a rent charge and own nothing at the end. Buying costs more per month, and the payments build equity you keep. In the example, the lease payment is $522.61; financing the same $35,500 at 6% for 60 months would be about $686 before tax, but after five years you own a car worth a large share of its price.</p>
<p>Leasing tends to work out when you want a new car every few years, drive within the mileage limit and keep the car in good condition. Excess miles (often $0.15 to $0.30 a mile), wear-and-tear charges and the turn-in (disposition) fee can add hundreds or thousands at the end. Compare the full cost with the <a href="/car-loan-calculator">car loan calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is a good money factor?', a: 'A good money factor is close to the leasing company\'s base rate for your credit tier. Multiply by 2,400 to compare it with loan APRs: 0.00150 is 3.6% APR, 0.00250 is 6%, and 0.00350 is 8.4%.' },
    { q: 'How do I convert a money factor to an APR?', a: 'Multiply by 2,400. A money factor of 0.00210 is 0.00210 × 2,400 = 5.04% APR. If the factor is written as "2.10", divide by 1,000 first.' },
    { q: 'Does putting money down on a lease lower the payment?', a: 'Yes. Each $1,000 of cap cost reduction lowers a 36-month payment by about $30 before tax ($27.78 of depreciation plus rent charge). But if the car is totaled or stolen early, the down payment is usually lost, so many advisers suggest keeping it small.' },
    { q: 'Is sales tax charged on the whole car when leasing?', a: 'In most states, no: tax is charged on each monthly payment. A few states tax the total of payments or the full price upfront, so check your state\'s rules.' },
    { q: 'Can I negotiate a car lease?', a: 'Yes. You can negotiate the capitalized cost (the price), the money factor (if the dealer marked it up), fees and the trade-in value. The residual percentage is set by the leasing company and is not negotiable.' },
    { q: 'What is due at signing on a lease?', a: 'Typically the first month\'s payment, any down payment, the acquisition fee if it is not rolled in, a security deposit if required, and taxes and registration. The lease disclosure lists the total "amount due at lease signing."' }
  ],
  related: ['car-loan-calculator', 'car-affordability-calculator', 'car-depreciation-calculator', 'apr-calculator'],
  sources: [
    { name: 'CFPB: What should I know about leasing versus buying a car?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-leasing-versus-buying-a-car-en-815/' },
    { name: 'CFPB: Regulation M (Consumer Leasing), 12 CFR Part 1013', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1013/' },
    { name: 'CFPB: Regulation M §1013.4 Content of lease disclosures', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1013/4/' }
  ]
};
