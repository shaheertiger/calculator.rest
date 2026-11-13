export default {
  slug: 'student-loan-payoff-calculator',
  hub: 'loans',
  name: 'Student Loan Payoff Calculator',
  title: 'Student Loan Payoff Calculator: $100 Extra Saves $3,338',
  h1: 'Student Loan Payoff Calculator: How Fast Extra Payments Clear Your Loans',
  meta: 'Adding $100 a month to a $30,000 student loan at 6.5% pays it off in 7 years 2 months instead of 10 and saves $3,338.09 in interest. Try your own numbers.',
  keyword: 'how to pay off student loans faster calculator',
  also: ['student loan payoff calculator', 'should i consolidate my student loans calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'balance', label: 'Total student loan balance', type: 'number', value: 30000, prefix: '$' },
    { id: 'rate', label: 'Interest rate', type: 'number', value: 6.5, suffix: '%', help: 'For several loans, use the balance-weighted average rate.' },
    { id: 'payment', label: 'Required monthly payment', type: 'number', value: 341, prefix: '$' },
    { id: 'extra', label: 'Extra each month', type: 'number', value: 100, prefix: '$' },
    { id: 'lump', label: 'One-time payment now', type: 'number', value: 0, prefix: '$', help: 'A tax refund, bonus or gift applied to principal today.' }
  ],
  compute(v, H) {
    if (!(v.balance > 0)) return { error: 'Enter your total student loan balance.' };
    if (!(v.rate >= 0) || v.rate > 30) return { error: 'Enter an interest rate between 0% and 30%.' };
    if (!(v.payment > 0)) return { error: 'Enter your required monthly payment.' };
    var r = v.rate / 1200;
    var extra = v.extra > 0 ? v.extra : 0, lump = v.lump > 0 ? v.lump : 0;
    if (v.payment <= v.balance * r) return { error: 'Your payment of ' + H.money(v.payment) + ' does not cover the ' + H.money(v.balance * r) + ' of interest charged each month, so the balance will not fall. Income-driven plans can work this way; this calculator needs a payment that reduces principal.' };
    function sim(start, pay) {
      var bal = start, k = 0, tot = 0;
      while (bal > 0.005 && k < 1200) {
        k++;
        var it = Math.round(bal * r * 100) / 100;
        var pr = Math.min(bal, pay - it);
        bal = Math.round((bal - pr) * 100) / 100; tot += it;
      }
      return { n: k, interest: tot };
    }
    var base = sim(v.balance, v.payment);
    if (lump >= v.balance) return { value: 'Today', label: 'Debt-free', rows: [['Interest avoided', H.money(base.interest), true]], sub: 'The one-time payment covers the whole balance.' };
    var fast = sim(v.balance - lump, v.payment + extra);
    var saved = base.interest - fast.interest;
    var mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = H.addMonths(H.parseDate(H.today()), fast.n);
    return {
      value: H.ym(fast.n),
      label: 'Debt-free in',
      expr: H.money0(v.balance) + ' at ' + H.num(v.rate, 3) + '% · ' + H.money(v.payment + extra) + '/mo' + (lump ? ' + ' + H.money0(lump) + ' now' : ''),
      rows: [
        ['Time saved', H.ym(base.n - fast.n), true],
        ['Interest saved', H.money(saved), true],
        ['Payoff month', mn[d.getUTCMonth()] + ' ' + d.getUTCFullYear()],
        ['Without extra payments', H.ym(base.n) + ' · ' + H.money(base.interest) + ' interest'],
        ['With extra payments', H.ym(fast.n) + ' · ' + H.money(fast.interest) + ' interest'],
        ['Return on each extra dollar', H.pct(v.rate, 2) + ' a year, guaranteed']
      ],
      sub: extra || lump ? 'Ask your servicer to apply the extra to principal, not to your next bill.' : 'Add an extra monthly amount or a one-time payment to see how much sooner you finish.'
    };
  },
  quick: ({ r }) => `To pay off student loans faster, add a fixed extra amount to every payment and have your servicer apply it to principal. On <strong>$30,000</strong> at 6.5% with a $341 standard payment, an extra $100 a month clears the debt in <strong>${r.value}</strong> instead of 10 years and saves <strong>$3,338.09</strong> in interest. Adding a one-time $3,000 payment as well saves $4,967.`,
  stepsTitle: 'How to use the student loan payoff calculator',
  steps: [
    'Add up the balances of all your student loans from your servicer account or studentaid.gov. If the rates differ, enter the balance-weighted average (Σ balance × rate ÷ total balance).',
    'Enter the required monthly payment from your bill. For a standard 10-year plan on $30,000 at 6.5% that is about $341.',
    'Enter the extra you can add each month and any one-time payment such as a tax refund.',
    'Read how many months and how much interest you save. Then tell your servicer in writing to apply extra money to principal; the step people skip is checking that it did not just advance the next due date.'
  ],
  formulaTitle: 'How is the payoff time with extra payments calculated?',
  formula: {
    expr: 'n = −ln(1 − B × r ÷ (M + E)) ÷ ln(1 + r)<br>Interest saved = Interest at M − Interest at (M + E)',
    vars: [['B', 'balance after any one-time payment'], ['r', 'monthly rate (annual rate ÷ 12)'], ['M', 'required monthly payment'], ['E', 'extra monthly payment']],
    note: 'Federal student loans accrue simple daily interest (balance × rate ÷ 365 × days between payments). The calculator steps through each month with the annual rate ÷ 12, which matches a servicer\'s figures to within a few dollars over the life of the loan.'
  },
  example: `<p>$30,000 at 6.5% with a required payment of $341 (a standard 10-year plan).</p>
<p>First month's interest: 30,000 × 0.065 ÷ 12 = <strong>$162.50</strong>. At $341, $178.50 goes to principal; at $441, $278.50 does, 56% more.</p>
<p>Paying $341: 120 payments and $10,860.16 of interest. Paying $441: 86 payments and <strong>$7,522.07</strong> of interest.</p>
<p>The extra $100 a month adds up to $8,600 over 86 months, but it removes 34 payments and <strong>$3,338.09</strong> of interest.</p>`,
  table: {
    title: 'How much faster does each extra amount pay off $30,000?',
    intro: 'A $30,000 balance at 6.5% with a $341 required payment, by extra amount paid every month.',
    head: ['Extra per month', 'Payoff time', 'Months saved', 'Total interest', 'Interest saved'],
    rows: ({ run, H }) => [0, 25, 50, 100, 150, 200, 300, 500, 750].map(e => {
      const x = run({ extra: e, lump: 0 });
      const months = s => { const m = /(\d+) years?/.exec(s), mm = /(\d+) months?/.exec(s); return (m ? +m[1] * 12 : 0) + (mm ? +mm[1] : 0); };
      return [e ? H.money0(e) : 'None', x.value, e ? String(months(x.rows[0][1])) : '—', x.rows[4][1].split(' · ')[1].replace(' interest', ''), e ? x.rows[1][1] : '—'];
    })
  },
  sections: [
    {
      h2: 'Is it better to pay a lump sum or extra every month?',
      html: `<p>Dollar for dollar, money paid earlier saves more, because it stops interest for longer. On the default loan, a single $3,000 payment today saves $2,499.90 of interest and 16 months, about 83¢ per dollar paid. The $100-a-month plan saves $3,338.09, but it takes $8,600 of extra payments to get there, about 39¢ per dollar.</p>
<p>That does not make monthly extras a bad idea; most people can't produce a large lump sum. The best approach is both: a steady extra amount you won't miss, plus windfalls such as tax refunds and bonuses applied the day they arrive. Paying half your payment every two weeks also works: 26 half-payments equal 13 full payments a year, which on this loan finishes 12 months early and saves $1,223.81.</p>`
    },
    {
      h2: 'How do I make sure extra student loan payments go to principal?',
      html: `<p>Servicers apply each payment first to fees, then to interest, then to principal. Anything above the required amount may be treated as an early payment of next month's bill, which the CFPB calls <strong>paid-ahead status</strong>. In the CFPB's example, a borrower who pays $300 on a $115 bill gets a statement showing nothing due next month, so the extra money does not get them ahead.</p>
<p>To avoid that, tell your servicer in writing (most have an online setting) to apply overpayments to principal and not advance your due date, and to direct extra money to the loan with the <strong>highest interest rate</strong> first. Federal law bars prepayment penalties on both federal and private student loans, so there is never a charge for paying early. Check your next statement to confirm the principal dropped.</p>`
    },
    {
      h2: 'Should I pay off student loans early or aim for forgiveness?',
      html: `<p>If you are working toward <strong>Public Service Loan Forgiveness</strong>, extra payments usually work against you. PSLF forgives the remaining balance after 120 qualifying monthly payments while you work full-time for a qualifying employer, and paying extra does not count as extra qualifying payments; it only shrinks the amount that would be forgiven. The same logic applies to forgiveness at the end of an income-driven plan.</p>
<p>If you expect to repay in full, every extra dollar earns a guaranteed return equal to your rate, 6.5% in the example. Weigh that against higher-rate debt (pay that first), an emergency fund and any 401(k) employer match you would give up. You can deduct up to $2,500 of student loan interest a year if your income is under the IRS limits, which slightly lowers the after-tax cost of the loan.</p>`
    },
    {
      h2: 'Does consolidating or refinancing student loans help pay them off faster?',
      html: `<p>A federal Direct Consolidation Loan combines federal loans into one, but its rate is the weighted average of the old rates rounded up to the nearest 1/8 of a percent, so it does not lower your cost. It can also reset the term to as long as 30 years, which lowers the payment and raises total interest. Consolidate for simplicity or eligibility reasons, not to save money.</p>
<p>Refinancing with a private lender can cut the rate, but it turns federal loans into private ones and ends access to income-driven repayment, PSLF, federal deferment and forbearance, and federal discharge programs. A smaller, risk-free saving: federal servicers take 0.25 percentage point off your rate while you are enrolled in automatic debit.</p>`
    }
  ],
  faq: [
    { q: 'How long does it take to pay off $30,000 in student loans?', a: 'Ten years on the standard plan at about $341 a month at 6.5%. Adding $100 a month cuts that to 7 years 2 months; adding $200 cuts it to 5 years 7 months.' },
    { q: 'How much do I need to pay to clear $50,000 of student loans in 5 years?', a: 'About $978.31 a month at 6.5%, for roughly $8,698 of total interest. Use the loan payoff calculator to find the payment for any deadline.' },
    { q: 'Is there a penalty for paying off student loans early?', a: 'No. Federal law prohibits prepayment penalties on federal student loans and on private education loans, so you can pay extra or pay in full at any time.' },
    { q: 'Should I pay off the loan with the highest rate or the smallest balance first?', a: 'Paying the highest rate first (the avalanche method) saves the most interest. Paying the smallest balance first (the snowball method) costs a little more but gives quicker wins. Either beats spreading extra money evenly.' },
    { q: 'Will extra payments lower my monthly payment?', a: 'Usually not. The required payment stays the same and the loan simply ends sooner. If your servicer advances your due date instead, ask it to apply the money to principal.' },
    { q: 'Is student loan interest tax deductible?', a: 'Yes, up to $2,500 a year, subject to income limits set by the IRS. Your servicer sends Form 1098-E if you paid $600 or more of interest during the year.' }
  ],
  related: ['loan-payoff-calculator', 'loan-calculator', 'amortization-calculator', 'apr-calculator'],
  sources: [
    { name: 'Federal Student Aid: Interest rates and fees for federal student loans', url: 'https://studentaid.gov/understand-aid/types/loans/interest-rates' },
    { name: 'CFPB: Can I make additional payments on my student loan?', url: 'https://www.consumerfinance.gov/ask-cfpb/can-i-make-additional-payments-on-my-student-loan-en-607/' },
    { name: 'CFPB: How is my student loan payment applied to my account?', url: 'https://www.consumerfinance.gov/ask-cfpb/how-is-my-student-loan-payment-applied-to-my-account-en-605/' },
    { name: 'Federal Student Aid: Public Service Loan Forgiveness', url: 'https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service' },
    { name: 'IRS: Topic 456, Student loan interest deduction', url: 'https://www.irs.gov/taxtopics/tc456' }
  ]
};
