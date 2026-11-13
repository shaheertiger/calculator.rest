export default {
  slug: 'mortgage-calculator',
  hub: 'mortgage',
  name: 'Mortgage Payment Calculator',
  title: 'Mortgage Calculator: $320,000 at 7% Is $2,128.97 a Month',
  h1: 'Mortgage Payment Calculator With Taxes, Insurance and PMI',
  meta: 'A $320,000, 30-year loan at 7% costs $2,128.97 a month in principal and interest, or $2,662.30 with tax and insurance. See your PITI and yearly amortization.',
  keyword: 'how to calculate mortgage payment',
  also: ['how to calculate mortgage loan payment', 'how to calculate monthly repayments on a mortgage', 'how to calculate your mortgage payment', 'how do i calculate monthly mortgage payments', 'how calculate mortgage payment', 'is mortgage interest calculated daily or monthly'],
  updated: '2026-11-13',
  inputs: [
    { id: 'price', label: 'Home price', type: 'number', value: 400000, prefix: '$' },
    { id: 'down', label: 'Down payment', type: 'number', value: 80000, prefix: '$' },
    { id: 'rate', label: 'Interest rate', type: 'number', value: 7, suffix: '%' },
    { id: 'term', label: 'Loan term', type: 'select', value: '30', options: [['30', '30 years'], ['25', '25 years'], ['20', '20 years'], ['15', '15 years'], ['10', '10 years']] },
    { id: 'tax', label: 'Property tax', type: 'number', value: 4400, prefix: '$', suffix: '/ yr' },
    { id: 'ins', label: 'Homeowners insurance', type: 'number', value: 2000, prefix: '$', suffix: '/ yr' },
    { id: 'pmi', label: 'PMI rate (under 20% down)', type: 'number', value: 0.5, suffix: '% / yr' },
    { id: 'hoa', label: 'HOA dues', type: 'number', value: 0, prefix: '$', suffix: '/ mo' }
  ],
  compute(v, H) {
    if (!(v.price > 0)) return { error: 'Enter the home price.' };
    var down = v.down > 0 ? v.down : 0;
    if (down >= v.price) return { error: 'The down payment covers the whole price, so there is no loan to pay.' };
    if (!(v.rate >= 0 && v.rate < 40)) return { error: 'Enter an interest rate between 0% and 40%.' };
    var years = Number(v.term) || 30, n = years * 12, r = v.rate / 100 / 12;
    var L = v.price - down;
    var pi = H.pmt(r, n, L);
    var tax = v.tax > 0 ? v.tax / 12 : 0, ins = v.ins > 0 ? v.ins / 12 : 0, hoa = v.hoa > 0 ? v.hoa : 0;
    var pmiOn = L / v.price > 0.8 && v.pmi > 0;
    var pmi = pmiOn ? L * v.pmi / 100 / 12 : 0;
    var bal = L, yr = [], yi = 0, yp = 0, pmiMonths = 0, totInt = 0;
    for (var m = 1; m <= n; m++) {
      if (pmiOn && bal > 0.78 * v.price) pmiMonths++;
      var it = bal * r, pr = Math.min(bal, pi - it);
      bal -= pr; yi += it; yp += pr; totInt += it;
      if (m % 12 === 0) { yr.push(['Year ' + (m / 12), H.money0(yp), H.money0(yi), H.money0(Math.max(0, bal))]); yi = 0; yp = 0; }
    }
    var total = pi + tax + ins + pmi + hoa;
    var rows = [
      ['Principal and interest', H.money(pi), true],
      ['Property tax', H.money(tax)],
      ['Homeowners insurance', H.money(ins)]
    ];
    if (pmi > 0) rows.push(['PMI', H.money(pmi)]);
    if (hoa > 0) rows.push(['HOA dues', H.money(hoa)]);
    rows.push(['Loan amount', H.money0(L) + ' (' + H.pct(L / v.price * 100, 1) + ' LTV)']);
    rows.push(['Total interest over ' + years + ' years', H.money0(totInt)]);
    rows.push(['Total of loan payments', H.money0(pi * n)]);
    if (pmi > 0) rows.push(['PMI drops off after', H.ym(pmiMonths) + ' (' + H.money0(pmi * pmiMonths) + ' total)']);
    return {
      value: H.money(total),
      label: 'Monthly payment (PITI' + (hoa > 0 ? ' + HOA' : '') + ')',
      expr: H.money0(L) + ' at ' + H.num(v.rate, 3) + '% for ' + years + ' yrs',
      rows: rows,
      sub: 'Interest is ' + H.pct(totInt / (pi * n) * 100, 0) + ' of everything you pay the lender over the full term. In year 1, ' + yr[0][2] + ' of your payments goes to interest and ' + yr[0][1] + ' to principal.',
      table: { caption: 'Amortization by year', head: ['Year', 'Principal', 'Interest', 'Balance'], rows: yr }
    };
  },
  quick: ({ r }) => `The monthly payment on a <strong>$320,000</strong> mortgage at 7% for 30 years is <strong>${r.rows[0][1]}</strong> in principal and interest. Add $4,400 a year in property tax and $2,000 in homeowners insurance and the full payment for a $400,000 home with 20% down is <strong>${r.value}</strong>. Over the full term you would pay ${r.rows.find(x => x[0].indexOf('Total interest') === 0)[1]} in interest, more than the amount borrowed.`,
  stepsTitle: 'How to calculate a mortgage payment',
  steps: [
    'Subtract the down payment from the price to get the loan amount. $400,000 − $80,000 = $320,000.',
    'Turn the annual rate into a monthly rate by dividing by 12 (7% → 0.5833% or 0.0058333), and the term into months (30 years → 360). Using the annual rate here is the most common mistake in hand calculations.',
    'Plug both into the payment formula below, or use Excel: <code>=PMT(7%/12, 360, -320000)</code> returns $2,128.97.',
    'Add one-twelfth of the yearly property tax and insurance bill, plus PMI if you put down less than 20% and any HOA dues, to get the full PITI payment your lender will quote.'
  ],
  formulaTitle: 'What is the mortgage payment formula?',
  formula: {
    expr: 'M = P × r(1 + r)<sup>n</sup> ÷ [(1 + r)<sup>n</sup> − 1]<br>PITI = M + annual tax ÷ 12 + annual insurance ÷ 12 + PMI + HOA',
    vars: [['M', 'monthly principal and interest'], ['P', 'loan amount (price − down payment)'], ['r', 'monthly interest rate = annual rate ÷ 12'], ['n', 'number of monthly payments = years × 12']],
    note: 'The formula gives a level payment: the same amount every month, with the interest share shrinking as the balance falls. PMI in this tool is charged on the original loan until the balance reaches 78% of the price, when federal law requires it to end.'
  },
  example: `<p>Loan: $400,000 − $80,000 down = <strong>$320,000</strong>. Monthly rate r = 0.07 ÷ 12 = 0.0058333. Payments n = 360.</p>
<p>(1 + r)<sup>360</sup> = 8.1165. M = 320,000 × 0.0058333 × 8.1165 ÷ 7.1165 = <strong>$2,128.97</strong>.</p>
<p>Escrow: $4,400 ÷ 12 = $366.67 tax and $2,000 ÷ 12 = $166.67 insurance. With 20% down there is no PMI, so PITI = $2,128.97 + $366.67 + $166.67 = <strong>$2,662.30</strong>.</p>
<p>The very first payment is $1,866.67 interest (320,000 × 0.0058333) and only $262.30 principal.</p>`,
  table: {
    title: 'What is the monthly payment on a $300,000 mortgage?',
    intro: 'Principal and interest only, before tax, insurance and PMI, computed by the calculator for a $300,000 loan.',
    head: ['Rate', '15-year payment', '30-year payment', '30-year total interest'],
    rows: ({ run }) => [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5].map(rt => {
      const a = run({ price: 300000, down: 0, rate: rt, term: '15', pmi: 0 }), b = run({ price: 300000, down: 0, rate: rt, term: '30', pmi: 0 });
      const pick = (x, k) => (x.rows.find(row => row[0].indexOf(k) === 0) || [, '—'])[1];
      return [rt.toFixed(1) + '%', pick(a, 'Principal'), pick(b, 'Principal'), pick(b, 'Total interest')];
    }),
    note: 'Scale linearly for other loan sizes: a $150,000 loan is half these payments, a $600,000 loan is double.'
  },
  sections: [
    {
      h2: 'What is included in a monthly mortgage payment?',
      html: `<p>Lenders quote the payment as <strong>PITI</strong>: principal, interest, taxes and insurance. Principal and interest go to the lender and stay fixed on a fixed-rate loan. Taxes and insurance usually go into an <strong>escrow account</strong> the servicer uses to pay your county tax bill and homeowners policy when they come due, which is why your payment can rise each year even with a fixed rate.</p>
<p>Two other costs often ride along. <strong>Mortgage insurance</strong> (PMI on conventional loans with under 20% down, MIP on FHA loans) protects the lender, not you. <strong>HOA dues</strong> are usually paid to the association directly, but lenders still count them when qualifying you. In the default example, tax and insurance add $533.34 a month, 25% on top of principal and interest.</p>`
    },
    {
      h2: 'How much of my mortgage payment goes to interest?',
      html: `<p>Far more at the start. On the $320,000 loan at 7%, the first payment is 88% interest. Interest stays above half of each payment until early in <strong>year 21</strong>, and the balance only falls to $160,000, half the original loan, about 21 years and 9 months in. Over the full 30 years you pay $446,428 in interest, more than the amount borrowed.</p>
<p>This is why extra principal payments early in the loan save so much: each dollar knocks out interest that would have compounded for decades. The <a href="/mortgage-payoff-calculator">mortgage payoff calculator</a> shows how much time and interest a monthly extra saves, and the yearly schedule under the result above shows exactly where your balance stands at any anniversary.</p>`
    },
    {
      h2: '15-year vs 30-year mortgage: how much do you save?',
      html: `<p>On a $320,000 loan, a 15-year term at 7% costs $2,876.25 a month and $197,725 in total interest. The 30-year at the same rate costs $2,128.97 a month but $446,428 in interest, so the shorter term saves about <strong>$248,700</strong> for $747 more a month. In practice 15-year loans also price lower; Freddie Mac's survey on Nov 12, 2026 put the average at 6.45% for 15 years versus 7.11% for 30, widening the gap further.</p>
<p>The 30-year wins on flexibility: you can always pay it like a shorter loan, but you can't make a 15-year payment smaller in a bad month. Check affordability with the <a href="/house-affordability-calculator">home affordability calculator</a> before choosing the higher payment.</p>`
    },
    {
      h2: 'Is mortgage interest calculated daily or monthly?',
      html: `<p>Standard U.S. fixed-rate mortgages calculate interest <strong>monthly</strong>: each month's interest is the outstanding balance times the annual rate divided by 12, regardless of whether the month has 28 or 31 days. That is what this calculator and the PMT formula assume. Interest is paid in arrears, so your June payment covers May's interest, which is why closing paperwork includes prepaid interest from the closing date to the end of that month.</p>
<p>Some loans work differently. Home equity lines of credit and a few simple-interest mortgages accrue interest daily (balance × rate ÷ 365 per day), so paying early in the cycle lowers the interest charged. Payoff quotes also use a daily per-diem figure for the days since your last payment.</p>`
    }
  ],
  faq: [
    { q: 'What is the monthly payment on a $400,000 house?', a: 'With 20% down ($80,000) at 7% for 30 years, principal and interest is $2,128.97 a month. Adding $4,400 a year of property tax and $2,000 of insurance brings the full payment to $2,662.30.' },
    { q: 'How much is a $200,000 mortgage payment?', a: 'At 7% for 30 years, a $200,000 loan costs $1,330.60 a month in principal and interest. On a 15-year term it is $1,797.66.' },
    { q: 'How do I calculate my mortgage payment in Excel or Google Sheets?', a: 'Use =PMT(annual_rate/12, years*12, -loan_amount). For example =PMT(0.07/12, 360, -320000) returns 2,128.97. Add tax, insurance and PMI separately.' },
    { q: 'Why is my actual payment higher than the calculator shows?', a: 'Usually escrow. Your servicer collects property tax and insurance with the payment, and adjusts the amount each year after an escrow analysis. A shortage from a higher tax bill or insurance renewal can raise the payment even on a fixed-rate loan.' },
    { q: 'When does PMI go away?', a: 'On a conventional loan you can ask to cancel PMI once the balance reaches 80% of the original home value, and it ends automatically at 78%. With 10% down on a $400,000 home at 7%, reaching 78% takes 9 years 7 months of scheduled payments, about $17,250 of PMI in total; extra payments get you there sooner.' },
    { q: 'How much does a 1% higher rate add to the payment?', a: 'Roughly 10% to 11% more per month at today\'s rate levels. On a $320,000 30-year loan, going from 6% to 7% raises principal and interest from $1,918.56 to $2,128.97, an extra $210.41 a month.' },
    { q: 'Is mortgage interest tax deductible?', a: 'Only if you itemize. You can deduct interest on up to $750,000 of mortgage debt used to buy, build or improve your main or second home ($375,000 if married filing separately), per IRS Publication 936. Most households take the standard deduction instead.' }
  ],
  related: ['house-affordability-calculator', 'mortgage-payoff-calculator', 'refinance-calculator', 'amortization-calculator', 'property-tax-calculator'],
  sources: [
    { name: 'CFPB: Owning a Home – loan options and costs', url: 'https://www.consumerfinance.gov/owning-a-home/' },
    { name: 'CFPB: What is an escrow or impound account?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-an-escrow-or-impound-account-en-140/' },
    { name: 'CFPB: When can I remove private mortgage insurance (PMI)?', url: 'https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/' },
    { name: 'Freddie Mac: Primary Mortgage Market Survey', url: 'https://www.freddiemac.com/pmms' },
    { name: 'IRS: Publication 936, Home Mortgage Interest Deduction', url: 'https://www.irs.gov/forms-pubs/about-publication-936' }
  ]
};
