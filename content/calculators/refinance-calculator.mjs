export default {
  slug: 'refinance-calculator',
  hub: 'mortgage',
  name: 'Refinance Calculator',
  title: 'Refinance Calculator: 8% to 6.75% Breaks Even in 19 Months',
  h1: 'Should I Refinance? Break-Even and Savings Calculator',
  meta: 'Refinancing a $300,000 balance from 8% to 6.75% with $6,000 of closing costs saves $317 a month and breaks even in 19 months. Find your own break-even.',
  keyword: 'should i refinance my mortgage calculator',
  also: ['should i refinance to a 15 year mortgage calculator', 'refinance calculator', 'refinance break even calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'balance', label: 'Current loan balance', type: 'number', value: 300000, prefix: '$' },
    { id: 'oldRate', label: 'Current interest rate', type: 'number', value: 8, suffix: '%' },
    { id: 'yearsLeft', label: 'Years left on current loan', type: 'number', value: 27, suffix: 'years' },
    { id: 'newRate', label: 'New interest rate', type: 'number', value: 6.75, suffix: '%' },
    { id: 'newTerm', label: 'New loan term', type: 'select', value: '30', options: [['30', '30 years'], ['20', '20 years'], ['15', '15 years'], ['same', 'Same as years left']] },
    { id: 'costs', label: 'Closing costs and points', type: 'number', value: 6000, prefix: '$' },
    { id: 'roll', label: 'Roll closing costs into the new loan', type: 'checkbox', value: false, wide: true }
  ],
  compute(v, H) {
    if (!(v.balance > 0)) return { error: 'Enter your current loan balance.' };
    if (!(v.oldRate >= 0 && v.newRate >= 0 && v.oldRate < 40 && v.newRate < 40)) return { error: 'Enter both interest rates.' };
    if (!(v.yearsLeft > 0 && v.yearsLeft <= 40)) return { error: 'Enter the years left on your current loan.' };
    var costs = v.costs > 0 ? v.costs : 0;
    var n1 = Math.round(v.yearsLeft * 12);
    var n2 = v.newTerm === 'same' ? n1 : Number(v.newTerm) * 12;
    var oldPay = H.pmt(v.oldRate / 1200, n1, v.balance);
    var newLoan = v.balance + (v.roll ? costs : 0);
    var newPay = H.pmt(v.newRate / 1200, n2, newLoan);
    var oldInt = oldPay * n1 - v.balance, newInt = newPay * n2 - newLoan;
    var save = oldPay - newPay;
    var lifetime = oldPay * n1 - (newPay * n2 + (v.roll ? 0 : costs));
    var rows = [
      ['Monthly savings', save >= 0 ? H.money(save) : '−' + H.money(-save), true],
      ['Current payment (P&amp;I)', H.money(oldPay)],
      ['New payment (P&amp;I)', H.money(newPay)],
      ['New loan amount', H.money0(newLoan)],
      ['Interest left on current loan', H.money0(oldInt)],
      ['Interest on new loan', H.money0(newInt)],
      [lifetime >= 0 ? 'Lifetime savings after costs' : 'Lifetime extra cost', H.money0(Math.abs(lifetime)), true]
    ];
    var be = save > 0 ? (v.roll ? 0 : costs / save) : Infinity;
    var value, sub;
    if (save <= 0) {
      value = 'No break-even';
      sub = 'The new payment is not lower, so the refinance only pays off through ' + (lifetime > 0 ? 'lower total interest (' + H.money0(lifetime) + ' saved over the life of the loan).' : 'other goals such as cash out; on cost alone it loses money.');
    } else if (v.roll) {
      value = '0 months';
      sub = 'Rolling the ' + H.money0(costs) + ' into the loan means no cash up front, but you pay interest on it for the whole term.';
    } else {
      value = Math.ceil(be) + ' months';
      sub = 'If you keep the new loan longer than ' + H.ym(Math.ceil(be)) + ', the lower payment has paid back the closing costs.' + (n2 > n1 ? ' Restarting at ' + n2 / 12 + ' years adds ' + H.ym(n2 - n1) + ' of payments, so compare lifetime cost too.' : '');
    }
    return { value: value, label: 'Break-even point', expr: H.money0(costs) + ' ÷ ' + (save > 0 ? H.money(save) : '$0') + '/mo', rows: rows, sub: sub };
  },
  quick: ({ r }) => `Refinancing a <strong>$300,000</strong> balance from 8% (27 years left) into a new 30-year loan at 6.75% lowers principal and interest from ${r.rows[1][1]} to ${r.rows[2][1]}, saving <strong>${r.rows[0][1]} a month</strong>. With $6,000 in closing costs you break even in <strong>${r.value}</strong>, so refinancing pays if you keep the loan longer than that.`,
  stepsTitle: 'How to decide whether to refinance',
  steps: [
    'Enter your current balance, rate and the years left from your mortgage statement. Use the remaining term, not the original 30 years.',
    'Enter the rate and term from a lender\'s Loan Estimate. Get at least three quotes on the same day, because rates change daily.',
    'Add every upfront cost: lender fees, appraisal, title, recording, and discount points. Section D of the Loan Estimate totals them. Leaving out points is the most common way people understate the break-even.',
    'Compare the break-even month with how long you expect to keep the home and loan. Then check the lifetime row: a lower payment from stretching back to 30 years can still cost more in total.'
  ],
  formulaTitle: 'How do you calculate the break-even on a refinance?',
  formula: {
    expr: 'Break-even (months) = closing costs ÷ (current payment − new payment)<br>Lifetime savings = current payment × months left − (new payment × new months + closing costs)',
    vars: [['current payment', 'principal and interest on your existing loan'], ['new payment', 'principal and interest on the refinanced loan'], ['closing costs', 'all fees and points paid at closing']],
    note: 'Taxes and insurance usually stay the same after a refinance, so the comparison uses principal and interest only.'
  },
  example: `<p>Current loan: $300,000 at 8% with 324 months left → payment <strong>$2,262.84</strong>.</p>
<p>New loan: $300,000 at 6.75% for 360 months → payment <strong>$1,945.79</strong>. Monthly savings: $317.05.</p>
<p>Break-even: $6,000 ÷ $317.05 = 18.9, so <strong>19 months</strong>. Over the full terms you would pay $733,160 on the old loan and $700,484 + $6,000 on the new one, saving $26,674 even after adding three years of payments.</p>`,
  table: {
    title: 'How much does each rate drop save on a $300,000 refinance?',
    intro: 'From the default 8% loan with 27 years left into a new 30-year loan, with $6,000 of closing costs paid in cash.',
    head: ['New rate', 'New payment', 'Monthly savings', 'Break-even', 'Lifetime result'],
    rows: ({ run }) => [7.75, 7.5, 7.25, 7, 6.75, 6.5, 6.25, 6, 5.5].map(rt => {
      const o = run({ newRate: rt, newTerm: '30', roll: false });
      return [rt.toFixed(2) + '%', o.rows[2][1], o.rows[0][1], o.value, (o.rows[6][0].indexOf('savings') > -1 ? '+' : '−') + o.rows[6][1]];
    }),
    note: 'A small rate cut into a fresh 30-year term can lower the payment yet cost more overall, because you add three years of payments.'
  },
  sections: [
    {
      h2: 'When does it make sense to refinance?',
      html: `<p>The old rule was to refinance when rates fall 1 to 2 percentage points. A better test is the break-even: refinance when you expect to keep the loan comfortably longer than the months it takes the savings to repay the closing costs. With low costs, even a 0.5-point drop can pay; with high costs and a plan to move in two years, a full point may not.</p>
<p>Other good reasons: dropping FHA mortgage insurance by refinancing into a conventional loan once you have 20% equity, switching from an adjustable rate before it resets, or removing a co-borrower after a divorce. Freddie Mac's survey put the average 30-year rate at 7.11% on Nov 12, 2026, so the people most likely to benefit are those who borrowed at around 7.75% or more in 2023 and 2024.</p>`
    },
    {
      h2: 'Does refinancing into a new 30-year loan cost more?',
      html: `<p>It can. If you are 3 years into a 30-year loan and refinance into a new 30-year loan, you add 3 years of payments. The monthly saving looks large partly because the balance is spread over more months. In the example above the rate cut is big enough to come out ahead anyway, but at 7.75% the new 30-year loan saves $113.60 a month yet costs $46,565 more over its life.</p>
<p>To compare fairly, set the new term to "same as years left" or keep paying your old payment amount on the new loan. Paying $2,262.84 a month on the new 6.75% loan instead of $1,945.79 would clear it in about 20 years 10 months, six years sooner than the old loan.</p>`
    },
    {
      h2: 'Should I refinance to a 15-year mortgage?',
      html: `<p>Only if the higher payment is comfortable. Moving the default $300,000 balance to a 15-year loan at 6.75% raises the payment to $2,654.73, $391.89 more than today, but the total interest falls to about $177,851 versus $433,160 left on the current loan. Fifteen-year rates also usually run about half a point below 30-year rates, which makes the switch more attractive than the calculator's same-rate comparison shows.</p>
<p>If the 15-year payment would squeeze your budget, a 20-year term is a middle ground, or take the 30-year refinance and prepay with the <a href="/mortgage-payoff-calculator">mortgage payoff calculator</a> as a guide.</p>`
    },
    {
      h2: 'How much does it cost to refinance a mortgage?',
      html: `<p>Refinance closing costs commonly run 2% to 5% of the loan, or $6,000 to $15,000 on $300,000. They include the lender's origination fee, appraisal, title insurance and search, recording fees and prepaid interest; escrow deposits for taxes and insurance are also collected but are your money, not a cost. Discount points (1 point = 1% of the loan) buy a lower rate and lengthen the break-even.</p>
<p>A "no-closing-cost" refinance swaps those fees for a higher rate through lender credits. It makes sense if you might move or refinance again soon. Government streamlines are cheaper: the VA Interest Rate Reduction Refinance Loan carries a 0.5% funding fee and FHA Streamline refinances usually need no appraisal.</p>`
    }
  ],
  faq: [
    { q: 'Is it worth refinancing for 1% lower?', a: 'Usually, if you will keep the loan past the break-even. On a $300,000 balance, a drop from 8% to 7% saves $266.93 a month on a new 30-year loan, so $6,000 of costs is repaid in 23 months.' },
    { q: 'Can I roll the closing costs into my new loan?', a: 'Yes, if you have enough equity. You pay nothing at closing, but the costs are added to the balance and you pay interest on them for the life of the loan: at 6.75% over 30 years, that $6,000 costs about $14,000 in payments.' },
    { q: 'How soon can I refinance after buying?', a: 'A conventional rate-and-term refinance often has no waiting period. FHA Streamline and VA IRRRL refinances require at least 210 days since closing and six on-time payments. Cash-out refinances usually need longer seasoning.' },
    { q: 'Does refinancing hurt my credit?', a: 'Only slightly and briefly. The lender\'s hard inquiry and the new account can lower your score by a few points. Rate shopping with several lenders within a short window is generally treated as one inquiry by scoring models.' },
    { q: 'What is a good break-even period for a refinance?', a: 'Anything shorter than the time you are confident you will keep the loan. Many borrowers aim for 24 to 36 months or less, which leaves a margin if plans change.' },
    { q: 'Should I pay points when I refinance?', a: 'Points pay off only if you keep the loan long enough. Divide the cost of the points by the monthly savings they buy; if that break-even is longer than your expected stay, take the higher rate with no points.' }
  ],
  related: ['mortgage-calculator', 'mortgage-payoff-calculator', 'heloc-payment-calculator', 'ltv-calculator', 'apr-calculator'],
  sources: [
    { name: 'CFPB: Owning a Home', url: 'https://www.consumerfinance.gov/owning-a-home/' },
    { name: 'CFPB: Understanding your Loan Estimate', url: 'https://www.consumerfinance.gov/owning-a-home/loan-estimate/' },
    { name: 'CFPB: How should I use lender credits and points?', url: 'https://www.consumerfinance.gov/ask-cfpb/how-should-i-use-lender-credits-and-points-also-called-discount-points-en-136/' },
    { name: 'VA: Interest Rate Reduction Refinance Loan', url: 'https://www.va.gov/housing-assistance/home-loans/loan-types/interest-rate-reduction-loan/' },
    { name: 'Freddie Mac: Primary Mortgage Market Survey', url: 'https://www.freddiemac.com/pmms' }
  ]
};
