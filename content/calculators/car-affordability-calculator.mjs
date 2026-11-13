export default {
  slug: 'car-affordability-calculator',
  hub: 'loans',
  name: 'How Much Car Can I Afford Calculator',
  title: 'How Much Car Can I Afford? $75K Salary = {PRICE} Car (20/4/10)',
  h1: 'How Much Car Can I Afford? A 20/4/10 Budget Calculator',
  meta: '{META}',
  keyword: 'how much should i spend on a car calculator',
  also: ['how much car can i afford calculator', 'car affordability calculator', '20/4/10 rule calculator', 'how much car can i afford on my salary'],
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
  quick: ({ r }) => `{QUICK}`,
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
  example: `{EXAMPLE}`,
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
  sections: [],
  faq: [],
  related: ['car-loan-calculator', 'lease-calculator', 'car-depreciation-calculator', 'dti-calculator'],
  sources: [
    { name: 'CFPB: How do I compare auto loan offers?', url: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/' },
    { name: 'CFPB: Auto loans consumer tools', url: 'https://www.consumerfinance.gov/consumer-tools/auto-loans/' },
    { name: 'Federal Reserve: G.19 Consumer Credit (new-car loan rates and terms)', url: 'https://www.federalreserve.gov/releases/g19/current/default.htm' },
    { name: 'BLS: Consumer Expenditure Surveys', url: 'https://www.bls.gov/cex/' }
  ]
};
