export default {
  slug: 'car-loan-calculator',
  hub: 'loans',
  name: 'Car Loan Calculator',
  title: 'Car Loan Calculator: $35,000 Car at 7.5% Is $535.81/mo',
  h1: 'Car Loan Calculator With Trade-In, Sales Tax and Rate Finder',
  meta: 'Financing $26,740 of a $35,000 car at 7.5% APR for 60 months costs $535.81 a month. Add your down payment, trade-in and tax, or solve for the APR.',
  keyword: 'how do i calculate interest rate on a car loan',
  also: ['car loan calculator', 'how is car finance interest calculated', 'how are car loan interest calculated', 'how to calculate a vehicle payment', 'how to calculate car sales tax', 'auto loan calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'price', label: 'Vehicle price', type: 'number', value: 35000, prefix: '$', help: 'Negotiated price before tax.' },
    { id: 'down', label: 'Cash down payment', type: 'number', value: 4000, prefix: '$' },
    { id: 'trade', label: 'Trade-in value', type: 'number', value: 6000, prefix: '$' },
    { id: 'owed', label: 'Still owed on trade-in', type: 'number', value: 0, prefix: '$', help: 'Any payoff above the trade-in value is rolled into the new loan.' },
    { id: 'tax', label: 'Sales tax rate', type: 'number', value: 6, suffix: '%' },
    { id: 'taxTrade', label: 'My state taxes only price minus trade-in', type: 'checkbox', value: true },
    { id: 'fees', label: 'Fees added to the loan', type: 'number', value: 0, prefix: '$', help: 'Title, registration and dealer documentation fees you finance.' },
    { id: 'term', label: 'Loan term', type: 'select', value: '60', options: [['24', '24 months'], ['36', '36 months'], ['48', '48 months'], ['60', '60 months'], ['72', '72 months'], ['84', '84 months']] },
    { id: 'mode', label: 'I know the', type: 'select', value: 'rate', options: [['rate', 'APR (find my payment)'], ['payment', 'Payment (find my APR)']] },
    { id: 'apr', label: 'APR', type: 'number', value: 7.5, suffix: '%', showIf: { mode: ['rate'] } },
    { id: 'payment', label: 'Monthly payment', type: 'number', value: 550, prefix: '$', showIf: { mode: ['payment'] } }
  ],
  compute(v, H) {
    if (!(v.price > 0)) return { error: 'Enter the vehicle price.' };
    var down = v.down > 0 ? v.down : 0, trade = v.trade > 0 ? v.trade : 0, owed = v.owed > 0 ? v.owed : 0, fees = v.fees > 0 ? v.fees : 0;
    var rate = v.tax > 0 ? v.tax : 0;
    var taxable = Math.max(0, v.price - (v.taxTrade ? trade : 0));
    var tax = taxable * rate / 100;
    var fin = v.price + tax + fees - down - trade + owed;
    if (!(fin > 0)) return { error: 'Your down payment and trade-in cover the whole price, so there is nothing to finance.' };
    var n = Number(v.term) || 60;
    var r, pay;
    if (v.mode === 'payment') {
      if (!(v.payment > 0)) return { error: 'Enter your monthly payment.' };
      if (v.payment * n < fin - 0.005) return { error: 'That payment would not repay ' + H.money(fin) + ' in ' + n + ' months even at 0% APR.' };
      pay = v.payment;
      r = Math.abs(pay * n - fin) < 0.01 ? 0 : H.solve(function (x) { return H.pmt(x, n, fin) - pay; }, 1e-9, 0.1);
      if (!(r >= 0)) return { error: 'That payment implies an APR above 120%. Check the numbers.' };
    } else {
      if (!(v.apr >= 0) || v.apr > 50) return { error: 'Enter an APR between 0% and 50%.' };
      r = v.apr / 1200;
      pay = Math.round(H.pmt(r, n, fin) * 100) / 100;
    }
    var interest = pay * n - fin;
    var apr = r * 1200;
    var neg = owed > trade ? owed - trade : 0;
    var rows = [
      ['Amount financed', H.money(fin), true],
      ['Sales tax', H.money(tax)],
      ['Interest in month 1', H.money(fin * r)],
      ['Total interest', H.money(interest)],
      ['Total cost (cash + trade + payments)', H.money(down + trade - owed + pay * n)]
    ];
    if (neg > 0) rows.push(['Negative equity rolled in', H.money(neg)]);
    if (v.mode === 'payment') {
      return { value: H.pct(apr, 2), label: 'Implied APR', expr: H.money(pay) + ' × ' + n + ' on ' + H.money0(fin), rows: [['Monthly rate', H.pct(r * 100, 4)]].concat(rows), sub: 'This is the APR that makes ' + n + ' payments of ' + H.money(pay) + ' repay exactly ' + H.money(fin) + '. Compare it with the APR on your contract.' };
    }
    return { value: H.money(pay), label: 'Monthly car payment', expr: H.money0(fin) + ' · ' + H.num(apr, 3) + '% APR · ' + n + ' mo', rows: rows, sub: 'Interest over the loan adds ' + H.pct(interest / fin * 100, 1) + ' to the amount you borrow.' };
  },
  quick: ({ r }) => `Car loan interest is charged on the unpaid balance at APR ÷ 12 a month. Buy a <strong>$35,000</strong> car with $4,000 down and a $6,000 trade-in, add 6% tax on $29,000, and you finance $26,740. At 7.5% for 60 months that is <strong>${r.value} a month</strong>, $167.13 of interest in month one and $5,408.60 over the loan.`,
  stepsTitle: 'How to calculate a car loan payment',
  steps: [
    'Enter the negotiated price, not the sticker price, then your cash down payment and the dealer\'s offer for your trade-in.',
    'If you still owe money on the trade-in, enter the payoff. Anything above its value is negative equity and gets added to the new loan, which is the step buyers most often forget.',
    'Enter your state and local sales tax rate. Leave the box ticked if your state taxes only the price minus the trade-in (most do).',
    'Pick the term and enter the APR from the lender to get the payment. If you only know the payment, switch to <em>Payment (find my APR)</em> to see the rate it implies.'
  ],
  formulaTitle: 'How is a car payment calculated?',
  formula: {
    expr: 'Amount financed = Price + Tax + Fees − Down − Trade-in + Owed on trade<br>Payment = A × r ÷ (1 − (1 + r)<sup>−n</sup>), with r = APR ÷ 12',
    vars: [['A', 'amount financed'], ['Tax', 'sales tax rate × (price − trade-in) in most states'], ['r', 'monthly rate (7.5% APR → 0.00625)'], ['n', 'term in months']],
    note: 'When you know the payment instead of the rate, the calculator solves the same equation for r by bisection, the method a spreadsheet\'s RATE() function uses.'
  },
  example: `<p>Price $35,000, $4,000 down, $6,000 trade-in, nothing owed, 6% sales tax, 7.5% APR, 60 months.</p>
<p>Taxable amount = $35,000 − $6,000 = $29,000, so tax = <strong>$1,740</strong>.</p>
<p>Amount financed = $35,000 + $1,740 − $4,000 − $6,000 = <strong>$26,740</strong>.</p>
<p>r = 0.075 ÷ 12 = 0.00625. Payment = 26,740 × 0.00625 ÷ (1 − 1.00625<sup>−60</sup>) = <strong>$535.81</strong>.</p>
<p>60 payments total $32,148.60, so the interest is <strong>$5,408.60</strong>. The first month\'s interest is $26,740 × 0.00625 = $167.13.</p>`,
  table: {
    title: 'Is a 72- or 84-month car loan worth the lower payment?',
    intro: 'The same $26,740 at 7.5% APR over different terms. The last column is what you would still owe after three years, when many owners trade in.',
    head: ['Term', 'Monthly payment', 'Total interest', 'Extra interest vs 36 months', 'Owed after 36 payments'],
    rows: ({ run, H }) => {
      const base = run({ mode: 'rate', apr: 7.5, term: '36' });
      const baseInt = parseFloat(base.rows[3][1].replace(/[$,]/g, ''));
      return ['36', '48', '60', '72', '84'].map(t => {
        const x = run({ mode: 'rate', apr: 7.5, term: t });
        const pay = parseFloat(x.value.replace(/[$,]/g, ''));
        const int = parseFloat(x.rows[3][1].replace(/[$,]/g, ''));
        let owed = H.fv(0.075 / 12, 36, -pay, 26740); if (owed < 1) owed = 0;
        return [t + ' months', x.value, x.rows[3][1], t === '36' ? '—' : '+' + H.money(int - baseInt), H.money(owed)];
      });
    },
    note: 'A typical new car loses a large share of its value in the first three years, so long terms raise the risk of owing more than the car is worth. See the car depreciation calculator for an estimate.'
  },
  sections: [
    {
      h2: 'How is interest calculated on a car loan?',
      html: `<p>Most U.S. auto loans are <strong>simple-interest</strong> loans; the CFPB calls this method far more common than the alternative. Interest is figured on the principal you still owe, usually daily at the APR ÷ 365 (some lenders use a monthly rate), and each payment first covers the interest built up since the last one; the rest reduces principal. On a monthly schedule this works out to the APR ÷ 12 figure the calculator uses. Paying a few days early shaves a little interest; paying late adds some.</p>
<p>The older <strong>precomputed</strong> method fixes the total interest at signing and front-loads it using the "Rule of 78s," so paying early saves less. Federal law (15 U.S.C. 1615) bars the Rule of 78s on consumer loans longer than 61 months, and many states ban it outright, but it is worth asking whether a buy-here-pay-here or subprime contract uses it.</p>`
    },
    {
      h2: 'How do I figure out the interest rate on my car loan?',
      html: `<p>Look first at the Truth in Lending disclosure in your contract: the box labeled <em>Annual Percentage Rate</em> is the rate. If all you have is the payment, switch the calculator to <em>Payment (find my APR)</em>. For example, a $550 payment for 60 months on $26,740 financed implies an APR of about <strong>8.6%</strong>, more than a point above a 7.5% offer. That gap is often where add-ons such as extended warranties, GAP coverage or a marked-up dealer rate hide.</p>
<p>For a benchmark, the Federal Reserve's G.19 consumer credit release (Nov 6, 2026) put the average 60-month new-car loan rate at commercial banks at 7.54% for the third quarter of 2026, and finance-company new-car loans averaged about $41,700 over 67 months. Your rate depends heavily on credit score, the car's age and the term.</p>`
    },
    {
      h2: 'Do you pay sales tax on the full price of a car if you trade one in?',
      html: `<p>In most states, no: tax is charged on the price minus the trade-in allowance, which is why a $6,000 trade-in in the example saves $360 of tax at 6%. A few states, including California, tax the full price regardless of a trade. Untick the box in the calculator to model that. Rebates are treated differently again; some states tax the price before a manufacturer rebate.</p>
<p>Local add-on rates, title, registration and documentation fees vary widely. Enter fees you are financing in <em>Fees added to the loan</em>. For tax on a cash purchase, use the <a href="/sales-tax-calculator">sales tax calculator</a>.</p>`
    },
    {
      h2: 'What happens if I owe more on my trade-in than it is worth?',
      html: `<p>The difference is <strong>negative equity</strong>, and dealers usually roll it into the new loan. Owe $9,000 on a car worth $6,000 and the trade-in stops reducing the loan; instead it adds $3,000. In the example the amount financed jumps from $26,740 to $35,740 and the payment from $535.81 to $716.16 at 7.5% for 60 months, and you pay interest on the old car's debt for five more years.</p>
<p>The CFPB has flagged rolled-over negative equity as a risk because it can leave you owing more than the new car is worth from the day you drive it home. If you can, pay the gap in cash or keep the old car until the balance and value meet.</p>`
    }
  ],
  faq: [
    { q: 'What is the monthly payment on a $30,000 car loan?', a: 'At 7.5% APR, $30,000 financed costs $601.14 a month over 60 months or $518.70 over 72 months. Over 60 months you would pay $6,068.40 in interest.' },
    { q: 'What is the interest on a $25,000 car loan for 5 years?', a: 'At 7.5% APR, about $5,057. The payment is $500.95 a month, and 60 payments total $30,057.' },
    { q: 'Is 7.5% a good interest rate for a car loan?', a: 'It is close to average. The Federal Reserve\'s G.19 data show commercial banks charged between about 7.1% and 7.5% on 60-month new-car loans in the first three quarters of 2026. Borrowers with excellent credit, or buyers using a manufacturer\'s promotional financing, can pay much less; used-car and subprime loans usually cost more.' },
    { q: 'How much should I put down on a car?', a: 'A common guideline is 20% on a new car and at least 10% on a used one. A bigger down payment lowers the payment, the total interest and the chance of owing more than the car is worth.' },
    { q: 'Can I pay off my car loan early?', a: 'Usually yes, and on a simple-interest loan you save the interest that would have accrued on the principal you prepay. Check the contract for a prepayment penalty and ask the lender to apply extra money to principal.' },
    { q: 'Should I take 0% financing or a cash rebate?', a: 'Compare total cost. Take the rebate if the rebate lowers the price by more than the interest you would pay at the best rate you can get elsewhere. Run both scenarios in the calculator: 0% on the full price versus your bank\'s rate on the price minus the rebate.' },
    { q: 'Are dealer fees included in the APR?', a: 'Some are. Finance charges you pay to get the loan count toward the APR, while charges a cash buyer would also pay, such as tax, title and registration, do not.' }
  ],
  related: ['car-affordability-calculator', 'lease-calculator', 'car-depreciation-calculator', 'loan-calculator', 'sales-tax-calculator'],
  sources: [
    { name: 'CFPB: Simple interest vs precomputed interest on an auto loan', url: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/' },
    { name: 'CFPB: Should I trade in my car if it\'s not paid off?', url: 'https://www.consumerfinance.gov/ask-cfpb/should-i-trade-in-my-car-if-its-not-paid-off-en-2045/' },
    { name: 'Federal Reserve: G.19 Consumer Credit, terms of credit (new-car loan rates)', url: 'https://www.federalreserve.gov/releases/g19/current/default.htm' },
    { name: '15 U.S.C. 1615: Prohibition on use of Rule of 78s in connection with mortgage refinancings and other consumer loans', url: 'https://www.law.cornell.edu/uscode/text/15/1615' },
    { name: 'eCFR: Regulation Z, 12 CFR Part 1026 (finance charge and APR disclosures)', url: 'https://www.ecfr.gov/current/title-12/chapter-X/part-1026' }
  ]
};
