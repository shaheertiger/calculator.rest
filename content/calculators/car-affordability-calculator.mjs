export default {
  slug: 'car-affordability-calculator',
  hub: 'loans',
  name: 'How Much Car Can I Afford Calculator',
  title: 'How Much Car Can I Afford? $75K Salary = $22,843 Car (20/4/10)',
  h1: 'How Much Car Can I Afford? A 20/4/10 Budget Calculator',
  meta: 'On a $75,000 salary the 20/4/10 rule allows $625 a month for a car. After $150 of insurance, that buys a $22,843 car at 7.5% over 4 years with 20% down.',
  keyword: 'how much should i spend on a car calculator',
  also: ['how much car can i afford calculator', 'car affordability calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'income', label: 'Gross annual income', type: 'number', value: 75000, prefix: '$', help: 'Before taxes; household income if the car is shared.' },
    { id: 'budget', label: 'Share of gross income for the car', type: 'number', value: 10, suffix: '%', help: '10% is the 20/4/10 guideline; 15% is a stretch.' },
    { id: 'other', label: 'Insurance and other monthly car costs', type: 'number', value: 150, prefix: '$', help: 'Counted inside the budget. Enter 0 to spend the whole budget on the payment.' },
    { id: 'apr', label: 'Loan APR', type: 'number', value: 7.5, suffix: '%' },
    { id: 'term', label: 'Loan term', type: 'select', value: '48', options: [['36', '36 months'], ['48', '48 months (20/4/10)'], ['60', '60 months'], ['72', '72 months']] },
    { id: 'downPct', label: 'Down payment', type: 'number', value: 20, suffix: '% of price' },
    { id: 'tax', label: 'Sales tax and fees', type: 'number', value: 6, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.income > 0)) return { error: 'Enter your gross annual income.' };
    if (!(v.budget > 0 && v.budget <= 50)) return { error: 'Enter a budget between 1% and 50% of income.' };
    if (!(v.apr >= 0) || v.apr > 40) return { error: 'Enter a loan APR between 0% and 40%.' };
    var d = v.downPct >= 0 ? v.downPct / 100 : 0, t = v.tax > 0 ? v.tax / 100 : 0;
    if (d >= 1 + t) return { error: 'The down payment covers the whole price; no loan is needed.' };
    var monthly = v.income / 12 * v.budget / 100;
    var pay = monthly - (v.other > 0 ? v.other : 0);
    if (!(pay > 0)) return { error: 'Your other car costs use up the whole ' + H.money(monthly) + ' budget. Raise the budget or lower the costs.' };
    var n = Number(v.term) || 48, r = v.apr / 1200;
    var loan = H.pvAnn(r, n, pay);
    var price = loan / (1 + t - d);
    var interest = pay * n - loan;
    var rule35 = v.income * 0.35;
    return {
      value: H.money0(price),
      label: 'Maximum car price',
      expr: H.money(pay) + '/mo × ' + n + ' mo at ' + H.num(v.apr, 3) + '%',
      rows: [
        ['Monthly car budget (' + H.num(v.budget, 2) + '% of gross)', H.money(monthly)],
        ['Left for the loan payment', H.money(pay), true],
        ['Loan amount it supports', H.money0(loan)],
        ['Cash down payment', H.money0(price * d)],
        ['Sales tax and fees', H.money0(price * t)],
        ['Total interest on the loan', H.money0(interest)],
        ['35%-of-income rule of thumb', H.money0(rule35)]
      ],
      sub: price > rule35 ? 'This is above the 35%-of-income shortcut, usually because of a long term or a low rate. Stay at the lower figure if you want room to spare.' : 'Spending less than this leaves room for repairs, fuel and saving.'
    };
  },
  quick: ({ r }) => `A common answer is the <strong>20/4/10 rule</strong>: put at least 20% down, finance for no more than 4 years, and keep the payment plus insurance under 10% of gross income. On a $75,000 salary that is $625 a month. After $150 of insurance, a $475 payment at 7.5% APR supports a car priced around <strong>${r.value}</strong>, including 6% tax and fees.`,
  stepsTitle: 'How to work out how much to spend on a car',
  steps: [
    'Enter your gross (pre-tax) yearly income and the share you are willing to spend on the car. The 20/4/10 guideline uses 10%.',
    'Enter what you pay or expect to pay for insurance and other fixed car costs each month. These come out of the same budget; forgetting insurance is the step that most often blows a car budget.',
    'Enter the APR you have been offered (or a realistic estimate for your credit) and the loan term. Four years keeps you inside the guideline.',
    'Set the down payment percentage and your state\'s sales tax and fees. The result is the highest sticker price that keeps the whole package within budget.'
  ],
  formulaTitle: 'How is the maximum car price calculated?',
  formula: {
    expr: 'Payment budget = Income ÷ 12 × Budget % − Other car costs<br>Loan = Payment × (1 − (1 + r)<sup>−n</sup>) ÷ r<br>Max price = Loan ÷ (1 + tax % − down %)',
    vars: [['r', 'monthly rate (APR ÷ 12)'], ['n', 'loan term in months'], ['tax %', 'sales tax and fees as a share of price, financed'], ['down %', 'cash down payment as a share of price']],
    note: 'The last line assumes tax and fees are financed and the down payment is a percentage of the price. A trade-in works like extra down payment.'
  },
  example: `<p>Income $75,000, 10% budget, $150 a month of insurance, 7.5% APR, 48 months, 20% down, 6% tax and fees.</p>
<p>Monthly budget = 75,000 ÷ 12 × 10% = <strong>$625</strong>. Payment available = $625 − $150 = <strong>$475</strong>.</p>
<p>Loan = 475 × (1 − 1.00625<sup>−48</sup>) ÷ 0.00625 = <strong>$19,645</strong>.</p>
<p>Price = 19,645 ÷ (1 + 0.06 − 0.20) = <strong>$22,843</strong>. You would bring $4,569 as a down payment, finance $1,371 of tax and fees, and pay about $3,155 of interest over four years.</p>`,
  table: {
    title: 'How much car can I afford on my salary?',
    intro: 'Maximum car price under 20/4/10 with $150 a month of insurance, 7.5% APR, 20% down and 6% tax and fees. The last column stretches the loan to 60 months.',
    head: ['Gross income', 'Monthly car budget', 'Max payment', 'Max price (48 mo)', 'Max price (60 mo)'],
    rows: ({ run, H }) => [40000, 50000, 60000, 75000, 90000, 100000, 125000, 150000, 200000].map(i => {
      const a = run({ income: i, term: '48' }), b = run({ income: i, term: '60' });
      if (a.error) return [H.money0(i), H.money0(i / 120), '—', '—', '—'];
      return [H.money0(i), a.rows[0][1], a.rows[1][1], a.value, b.value];
    }),
    note: 'Stretching to 60 months raises the price you can reach by about a fifth, but adds a year of payments and interest and breaks the "4" in 20/4/10.'
  },
  sections: [
    {
      h2: 'What is the 20/4/10 rule for buying a car?',
      html: `<p>It is a personal-finance guideline, not a lender requirement, with three parts:</p>
<ul>
<li><strong>20% down.</strong> New cars lose value fastest in the first years, so a fifth down keeps the loan below the car's value and protects you from owing more than it is worth.</li>
<li><strong>4-year loan at most.</strong> A shorter term means less interest and a loan that is paid off while the car is still worth something.</li>
<li><strong>10% of gross income</strong> for the payment plus insurance (stricter versions add fuel and maintenance).</li>
</ul>
<p>Most buyers go well past it. In the Federal Reserve's G.19 data, finance-company new-car loans in the second quarter of 2026 averaged about $41,700 financed over 67 months. Financing that much within 20/4/10 would take a household income of roughly $140,000.</p>`
    },
    {
      h2: 'How much car can I afford on a $50,000 or $100,000 salary?',
      html: `<p>With the default assumptions ($150 insurance, 7.5% APR, 48 months, 20% down, 6% tax and fees):</p>
<ul>
<li><strong>$50,000 a year:</strong> $416.67 monthly budget, $266.67 payment, a car of about <strong>$12,824</strong>.</li>
<li><strong>$75,000 a year:</strong> $625 budget, $475 payment, about $22,843.</li>
<li><strong>$100,000 a year:</strong> $833.33 budget, $683.33 payment, about <strong>$32,862</strong>.</li>
</ul>
<p>Lower incomes are squeezed hardest because insurance takes a bigger slice of a small budget. If 10% feels too tight, raising it to 15% on a $75,000 income lifts the ceiling to about $37,872, but that is money not going to savings, retirement or other debt.</p>`
    },
    {
      h2: 'Should gas, insurance and maintenance count toward the car budget?',
      html: `<p>At minimum, count insurance: it is a fixed bill that comes with the car, and it can be several hundred dollars a month for young drivers or expensive models. The stricter version of the rule puts fuel, maintenance and registration in the same 10%, which suits anyone who wants a real cushion.</p>
<p>Transportation is the second-largest category of U.S. household spending after housing in the Bureau of Labor Statistics' Consumer Expenditure Surveys, so it is worth pricing fully. Estimate fuel with the <a href="/trip-gas-cost-calculator">trip gas cost calculator</a> and add it to the "other costs" box if you want the strict version.</p>`
    },
    {
      h2: 'How much will a lender let me borrow for a car?',
      html: `<p>Often more than you should. Lenders look at your credit score, income and debt-to-income ratio, and many will approve payments well above 10% of gross income or terms of 72 to 84 months. Approval tells you what the lender will risk, not what fits your budget.</p>
<p>The CFPB suggests comparing loan offers by APR, term and total cost rather than the monthly payment, because a longer term can make an expensive car look affordable. Check how the payment affects your overall debt load with the <a href="/dti-calculator">DTI calculator</a>, and price a specific deal with the <a href="/car-loan-calculator">car loan calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much should my car payment be?', a: 'Under 20/4/10, your payment plus insurance should stay under 10% of gross monthly income. On $75,000 a year that is $625, so with $150 of insurance the payment should be about $475 or less.' },
    { q: 'What is the 35% rule for buying a car?', a: 'A shortcut that says the car\'s price should be no more than 35% of your gross annual income: $26,250 on a $75,000 salary. It is simpler than 20/4/10 but ignores the rate, the term and insurance.' },
    { q: 'Does a trade-in count toward the 20% down payment?', a: 'Yes. Trade-in equity (its value minus any loan you still owe on it) works exactly like cash down. Negative equity works against you and should be paid off rather than rolled into the new loan.' },
    { q: 'Should I buy new or used to stay within budget?', a: 'A used car a few years old lets the first owner absorb the steepest depreciation, so the same budget buys more car. Used-car loan rates are usually higher, so compare total cost, not just price.' },
    { q: 'Does the 20/4/10 rule work for leasing?', a: 'Partly. The 10% cap on payment plus insurance is a sensible limit for a lease too, but a large down payment on a lease is risky because it is usually lost if the car is totaled. Use the car lease calculator to price a lease.' },
    { q: 'What if no car I need fits the budget?', a: 'Options are a cheaper or older car, a larger down payment saved over a few months, paying down other debt first, or accepting a 5-year loan while keeping the 10% cap. Avoid fixing the gap with a 72- or 84-month loan.' }
  ],
  related: ['car-loan-calculator', 'lease-calculator', 'car-depreciation-calculator', 'dti-calculator'],
  sources: [
    { name: 'CFPB: How do I compare auto loan offers?', url: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/' },
    { name: 'CFPB: Auto loans consumer tools', url: 'https://www.consumerfinance.gov/consumer-tools/auto-loans/' },
    { name: 'Federal Reserve: G.19 Consumer Credit (new-car loan rates and terms)', url: 'https://www.federalreserve.gov/releases/g19/current/default.htm' },
    { name: 'BLS: Consumer Expenditure Surveys', url: 'https://www.bls.gov/cex/' }
  ]
};
