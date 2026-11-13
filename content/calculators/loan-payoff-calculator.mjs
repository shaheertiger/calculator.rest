export default {
  slug: 'loan-payoff-calculator',
  hub: 'loans',
  name: 'Loan Payoff Calculator',
  title: 'Loan Payoff Calculator: $12,500 at $350/mo Takes 42 Months',
  h1: 'Loan Payoff Calculator: When Will My Loan Be Paid Off?',
  meta: 'Owe $12,500 at 8.5% and pay $350 a month? You will be debt-free in 42 months after $1,962.59 of interest. Enter your balance to get your own payoff date.',
  keyword: 'when will my loan be paid off calculator',
  also: ['how to calculate loan payoff', 'loan payoff calculator', 'how long will it take to pay off my loan', 'loan payoff date calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'balance', label: 'Current loan balance', type: 'number', value: 12500, prefix: '$', help: 'The principal balance on your latest statement.' },
    { id: 'rate', label: 'Interest rate (APR)', type: 'number', value: 8.5, suffix: '%' },
    { id: 'mode', label: 'Solve for', type: 'select', value: 'time', options: [['time', 'Payoff date at my payment'], ['target', 'Payment to finish by a deadline']] },
    { id: 'payment', label: 'Monthly payment you make', type: 'number', value: 350, prefix: '$', showIf: { mode: ['time'] } },
    { id: 'months', label: 'Pay it off in', type: 'number', value: 24, suffix: 'months', showIf: { mode: ['target'] } }
  ],
  compute(v, H) {
    if (!(v.balance > 0)) return { error: 'Enter what you still owe.' };
    if (!(v.rate >= 0) || v.rate > 100) return { error: 'Enter the loan\'s APR.' };
    var r = v.rate / 1200;
    var mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function when(k) { var d = H.addMonths(H.parseDate(H.today()), k); return mn[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
    function sim(pay) {
      var bal = v.balance, k = 0, tot = 0, last = 0;
      while (bal > 0.005 && k < 1200) {
        k++;
        var it = Math.round(bal * r * 100) / 100;
        var pr = Math.min(bal, pay - it);
        if (pr <= 0) return null;
        bal = Math.round((bal - pr) * 100) / 100; tot += it; last = pr + it;
      }
      return { n: k, interest: tot, last: last };
    }
    if (v.mode === 'target') {
      var n = Math.round(v.months);
      if (!(n >= 1) || n > 600) return { error: 'Enter a payoff target between 1 and 600 months.' };
      var need = Math.ceil(H.pmt(r, n, v.balance) * 100) / 100;
      var t = sim(need);
      return {
        value: H.money(need),
        label: 'Monthly payment needed',
        expr: H.money0(v.balance) + ' in ' + n + ' months at ' + H.num(v.rate, 3) + '%',
        rows: [['Debt-free by', when(t.n), true], ['Total interest', H.money(t.interest)], ['Total you will pay', H.money(v.balance + t.interest)], ['Interest this month', H.money(v.balance * r)]],
        sub: 'Pay at least ' + H.money(need) + ' every month, starting now, to clear the balance within ' + H.plural(n, 'month') + '.'
      };
    }
    if (!(v.payment > 0)) return { error: 'Enter the monthly payment you make.' };
    var monthInt = v.balance * r;
    if (v.payment <= monthInt + 0.005) return { error: 'A ' + H.money(v.payment) + ' payment does not cover this month\'s ' + H.money(monthInt) + ' of interest, so the loan would never be paid off.' };
    var s = sim(v.payment);
    if (!s) return { error: 'That payment is too small to repay the loan.' };
    var faster = s.n > 12 ? Math.ceil(H.pmt(r, s.n - 12, v.balance) * 100) / 100 : 0;
    var rows = [
      ['Paid off', when(s.n), true],
      ['Number of payments', String(s.n)],
      ['Total interest from here', H.money(s.interest)],
      ['Total you will pay', H.money(v.balance + s.interest)],
      ['Final payment', H.money(s.last)],
      ['Interest share of this month\'s payment', H.pct(monthInt / v.payment * 100, 1)]
    ];
    if (faster) rows.push(['Payment to finish a year sooner', H.money(faster)]);
    return {
      value: H.ym(s.n),
      label: 'Time to pay off',
      expr: H.money0(v.balance) + ' at ' + H.num(v.rate, 3) + '% · ' + H.money(v.payment) + '/mo',
      rows: rows,
      sub: 'Counting from this month, assuming no new borrowing and on-time payments.'
    };
  },
  quick: ({ r }) => `A <strong>$12,500</strong> loan balance at 8.5% APR, paid down at <strong>$350 a month</strong>, is gone in <strong>42 payments (${r.value})</strong>, with a final payment of $112.59 and $1,962.59 of interest along the way. To find your own payoff date, enter the balance, the APR and what you actually pay each month, not the original loan amount.`,
  stepsTitle: 'How to find your loan payoff date',
  steps: [
    'Enter the current principal balance from your latest statement or online account, not the amount you first borrowed.',
    'Enter the APR. If your loan has a variable rate, use today\'s rate and rerun the numbers when it changes.',
    'Enter the payment you really make each month, including any amount you round up. The step most people get wrong is using the minimum when they pay more, or the original payment after a rate change.',
    'Read the payoff month and total interest. Switch to <em>Payment to finish by a deadline</em> to see what it would take to be done sooner.'
  ],
  formulaTitle: 'What formula gives the number of months to pay off a loan?',
  formula: {
    expr: 'n = −ln(1 − B × r ÷ M) ÷ ln(1 + r)<br>Payment for a deadline: M = B × r ÷ (1 − (1 + r)<sup>−n</sup>)',
    vars: [['n', 'months remaining (round up; the last payment is smaller)'], ['B', 'current balance'], ['r', 'monthly rate (APR ÷ 12)'], ['M', 'monthly payment']],
    note: 'If B × r is equal to or larger than M, the payment never reaches the principal and the formula has no answer. The calculator runs the schedule month by month with cent rounding, so its total interest matches a lender\'s schedule more closely than the formula alone.'
  },
  example: `<p>Balance $12,500, APR 8.5%, payment $350.</p>
<p>r = 0.085 ÷ 12 = 0.0070833. B × r = $88.54, so $261.46 of the first payment goes to principal.</p>
<p>n = −ln(1 − 88.54 ÷ 350) ÷ ln(1.0070833) = −ln(0.74702) ÷ 0.0070583 = <strong>41.3</strong>, so 41 full payments and a 42nd of $112.59.</p>
<p>Raising the payment to $450 cuts it to 32 payments and the interest to $1,468.66.</p>`,
  table: {
    title: 'How long does it take to pay off $12,500 at different payments?',
    intro: 'Months to zero and total interest on a $12,500 balance at 8.5% APR, by monthly payment.',
    head: ['Monthly payment', 'Payoff time', 'Payments', 'Total interest', 'Interest saved vs $250'],
    rows: ({ run, H }) => {
      const num = s => parseFloat(String(s).replace(/[$,]/g, ''));
      const base = num(run({ mode: 'time', payment: 250 }).rows[2][1]);
      return [250, 300, 350, 400, 450, 500, 600, 750, 1000, 1500].map(p => {
        const x = run({ mode: 'time', payment: p });
        return [H.money0(p), x.value, x.rows[1][1], x.rows[2][1], p === 250 ? '—' : H.money(base - num(x.rows[2][1]))];
      });
    },
    note: 'A $250 payment barely clears the $88.54 of interest charged in the first month, which is why it takes more than five years.'
  },
  sections: [
    {
      h2: 'How is a loan payoff amount calculated?',
      html: `<p>The payoff amount is not the balance on your statement. It is the principal still owed <strong>plus interest accrued since your last payment</strong> up to the day the lender receives the money, plus any unpaid fees. Most installment loans accrue interest daily, so the lender quotes a per-diem figure: balance × APR ÷ 365. On $12,500 at 8.5% that is about <strong>$2.91 a day</strong>, so paying off 18 days after your last payment costs roughly $12,552.</p>
<p>Ask your lender for a written payoff quote "good through" a specific date, and send the money so it arrives by then. For mortgages, Regulation Z requires the servicer to send an accurate payoff statement within seven business days of a written request.</p>`
    },
    {
      h2: 'What monthly payment pays off a loan by a certain date?',
      html: `<p>Count the months to your target date and switch the calculator to <em>Payment to finish by a deadline</em>. To clear $12,500 at 8.5% in 24 months you need <strong>$568.20 a month</strong>; in 36 months, $394.60. The payment formula is the same one lenders use to set the original payment, applied to today's balance and the months you have left.</p>
<p>If you get paid every two weeks, paying half the monthly amount every other week adds up to 13 monthly payments a year instead of 12. On the default loan that is like paying $379.17 a month, which ends it in 38 payments instead of 42. Confirm first that your lender applies biweekly money to principal right away rather than holding it until the due date.</p>`
    },
    {
      h2: 'Why does my payoff date change when I pay early or late?',
      html: `<p>On a simple-interest loan, interest builds every day between payments. Pay five days early and the next payment covers five fewer days of interest, so a little more reaches principal. Pay late and more of the payment is eaten by interest (plus any late fee), pushing the final payment out. Over a whole loan these shifts can move the last payment by a month or more.</p>
<p>Extra principal payments have the largest effect. Each extra dollar cuts the balance immediately and removes all the interest that dollar would have accrued. Tell the lender in writing to apply extra money to principal; some servicers otherwise credit it toward the next month's payment.</p>`
    },
    {
      h2: 'Should I pay off a loan early?',
      html: `<p>Paying off early is a guaranteed return equal to the loan's APR. Clearing an 8.5% loan is like earning 8.5% risk-free, which beats a savings account and most bonds. It makes less sense if the rate is very low, if you lack an emergency fund, or if you carry higher-rate debt such as a credit card, which should go first.</p>
<p>Check the contract for a prepayment penalty before you do. The CFPB notes that your contract and state law determine whether an auto loan can carry one, and some states ban them for certain loans. To see the month-by-month split of your current loan, use the <a href="/amortization-calculator">amortization schedule calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How long will it take to pay off $10,000 at $300 a month?', a: 'At 8.5% APR, 39 payments (three years and three months), with about $1,448 of interest. At 0% it would be 34 payments.' },
    { q: 'What happens if my payment only covers the interest?', a: 'The balance never goes down. At 8.5%, a $12,500 loan charges $88.54 of interest in a month, so any payment at or below that leaves you owing the same amount or more.' },
    { q: 'How much do I need to pay to clear $12,500 in two years?', a: '$568.20 a month at 8.5% APR, for total interest of about $1,137.' },
    { q: 'Is the payoff amount the same as my current balance?', a: 'No. The payoff amount adds interest accrued since your last payment up to the payoff date, and any fees owed, so it is usually a little higher than the principal balance on your statement.' },
    { q: 'Does paying off a loan early hurt my credit score?', a: 'It can cause a small, temporary dip because a closed installment account no longer adds to your mix of active credit, but your on-time payment history stays on your report. The interest you save usually matters far more.' },
    { q: 'Does this work for a car loan, personal loan or mortgage?', a: 'Yes, for any fixed-rate installment loan. For a mortgage, enter only the principal-and-interest part of your payment, not the escrow for taxes and insurance.' }
  ],
  related: ['loan-calculator', 'amortization-calculator', 'student-loan-payoff-calculator', 'mortgage-payoff-calculator', 'credit-card-minimum-payment-calculator'],
  sources: [
    { name: 'CFPB: Can I prepay my loan at any time without penalty?', url: 'https://www.consumerfinance.gov/ask-cfpb/can-i-prepay-my-loan-at-any-time-without-penalty-en-843/' },
    { name: 'CFPB: Simple interest vs precomputed interest', url: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/' },
    { name: 'CFPB: Regulation Z §1026.36 (mortgage payoff statements)', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/36/' }
  ]
};
