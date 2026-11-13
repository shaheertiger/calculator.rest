export default {
  slug: 'mortgage-payoff-calculator',
  hub: 'mortgage',
  name: 'Mortgage Payoff Calculator',
  title: 'Mortgage Payoff Calculator: $200 Extra Saves $64,928',
  h1: 'Mortgage Payoff Calculator: See How Extra Payments Shorten Your Loan',
  meta: 'Adding $200 a month to a $250,000, 6.5% mortgage with 25 years left pays it off 5 years 6 months early and saves $64,928 in interest. Test any extra payment.',
  keyword: 'how do i calculate paying off mortgage early',
  also: ['when will i pay off my mortgage calculator', 'should i pay off my mortgage or invest calculator', 'should i pay extra on mortgage or invest calculator', 'mortgage payoff calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'balance', label: 'Current loan balance', type: 'number', value: 250000, prefix: '$' },
    { id: 'rate', label: 'Interest rate', type: 'number', value: 6.5, suffix: '%' },
    { id: 'years', label: 'Years left on the loan', type: 'number', value: 25, suffix: 'years', help: 'From your statement: remaining months ÷ 12.' },
    { id: 'extra', label: 'Extra principal each month', type: 'number', value: 200, prefix: '$' },
    { id: 'yearly', label: 'Extra payment once a year', type: 'number', value: 0, prefix: '$' },
    { id: 'lump', label: 'One-time lump sum now', type: 'number', value: 0, prefix: '$' },
    { id: 'biweekly', label: 'Switch to biweekly payments (13 full payments a year)', type: 'checkbox', value: false, wide: true }
  ],
  compute(v, H) {
    if (!(v.balance > 0)) return { error: 'Enter your current loan balance.' };
    if (!(v.rate >= 0 && v.rate < 40)) return { error: 'Enter an interest rate between 0% and 40%.' };
    if (!(v.years > 0 && v.years <= 50)) return { error: 'Enter the years left on the loan (up to 50).' };
    var n = Math.round(v.years * 12), r = v.rate / 100 / 12;
    var pay = H.pmt(r, n, v.balance);
    var base = H.amort(v.balance, v.rate, n, 0, pay);
    var extra = v.extra > 0 ? v.extra : 0, yearly = v.yearly > 0 ? v.yearly : 0, lump = v.lump > 0 ? v.lump : 0;
    var bw = v.biweekly ? pay / 12 : 0;
    var bal = v.balance - lump, m = 0, interest = 0, paidExtra = lump;
    if (bal <= 0) return { value: 'Paid off now', label: 'The lump sum clears the loan', rows: [['Interest saved', H.money0(base.totalInterest), true]] };
    while (bal > 0.005 && m < 1200) {
      m++;
      var it = bal * r;
      var add = extra + bw + (m % 12 === 0 ? yearly : 0);
      var pr = Math.min(bal, pay + add - it);
      paidExtra += Math.max(0, Math.min(add, bal + it - pay));
      bal -= pr; interest += it;
    }
    var saved = n - m, intSaved = base.totalInterest - interest;
    var end = H.addMonths(H.parseDate(H.today()), m);
    var rows = [
      ['Interest saved', H.money0(intSaved), true],
      ['New payoff time', H.ym(m)],
      ['Original payoff time', H.ym(n)],
      ['Interest with extra payments', H.money0(interest)],
      ['Interest on current schedule', H.money0(base.totalInterest)],
      ['Regular monthly payment (P&amp;I)', H.money(pay)],
      ['Total extra principal paid', H.money0(paidExtra)],
      ['Estimated payoff month', H.fmtDate(end).replace(/ \d+,/, '')]
    ];
    return {
      value: saved > 0 ? H.ym(saved) : 'No change',
      label: 'Paid off sooner',
      expr: H.money0(v.balance) + ' at ' + H.num(v.rate, 3) + '%, ' + H.num(v.years, 2) + ' yrs left',
      rows: rows,
      sub: paidExtra > 0 ? 'Every extra dollar returns ' + H.money(intSaved / paidExtra) + ' in avoided interest, a guaranteed, tax-free return equal to your ' + H.num(v.rate, 3) + '% rate.' : 'Add an extra payment to see how much sooner the loan is paid off.'
    };
  },
  quick: ({ r }) => `Paying an extra <strong>$200 a month</strong> on a $250,000 mortgage at 6.5% with 25 years left pays it off <strong>${r.value} sooner</strong>, in ${r.rows[1][1]} instead of 25 years, and saves <strong>${r.rows[0][1]}</strong> in interest. The regular payment is ${r.rows[5][1]}, so the extra is about 12% more each month.`,
  stepsTitle: 'How to calculate paying off a mortgage early',
  steps: [
    'Find your current principal balance, interest rate and remaining term on your latest mortgage statement. Use the balance, not the original loan amount: that is the mistake that makes most payoff estimates wrong.',
    'Enter the extra principal you plan to pay each month, any yearly extra (a tax refund or bonus), and any lump sum you can pay now.',
    'Tick biweekly if you will pay half the payment every two weeks. That works out to 26 half-payments, or 13 full payments a year.',
    'Read the time saved and interest saved. Then confirm with your servicer that extra money is applied to principal, not held for the next payment.'
  ],
  formulaTitle: 'What formula shows when a mortgage will be paid off?',
  formula: {
    expr: 'n = −ln(1 − r × B ÷ P) ÷ ln(1 + r)<br>Interest saved = interest on current schedule − interest with extra payments',
    vars: [['n', 'months until the balance reaches zero'], ['B', 'current balance'], ['P', 'total monthly payment including the extra principal'], ['r', 'monthly rate = annual rate ÷ 12']],
    note: 'The closed-form version works for a fixed monthly extra. With yearly extras, lump sums or biweekly payments the calculator steps through the loan month by month instead.'
  },
  example: `<p>Balance $250,000 at 6.5% with 300 months left. The scheduled payment is <strong>$1,688.02</strong>.</p>
<p>With $200 extra, P = $1,888.02 and r = 0.0054167. r × B ÷ P = 1,354.17 ÷ 1,888.02 = 0.71725. n = −ln(0.28275) ÷ ln(1.0054167) = 1.26318 ÷ 0.0054021 ≈ <strong>234 months</strong>, or 19 years 6 months.</p>
<p>Interest drops from $256,405 to $191,477, a saving of <strong>$64,928</strong> for $46,600 of extra principal: each extra dollar avoids $1.39 of interest.</p>`,
  table: {
    title: 'How much faster is a mortgage paid off with extra payments?',
    intro: 'Results for the default $250,000 balance at 6.5% with 25 years left.',
    head: ['Extra each month', 'Paid off in', 'Time saved', 'Interest saved'],
    rows: ({ run }) => [[50], [100], [200], [300], [500], [750], [1000], [0, true]].map(([x, bw]) => {
      const o = run({ extra: x, yearly: 0, lump: 0, biweekly: !!bw });
      return [bw ? 'Biweekly ($0 extra)' : '$' + x.toLocaleString('en-US'), o.rows[1][1], o.value, o.rows[0][1]];
    }),
    note: 'Biweekly payments are the same as adding one-twelfth of a payment ($140.67 here) to every monthly payment.'
  },
  sections: [
    {
      h2: 'Is it better to pay extra monthly, yearly or as a lump sum?',
      html: `<p>The earlier the money reaches principal, the more interest it erases, so for the same total dollars a lump sum today beats monthly extras, which beat a single payment at year end. The difference is smaller than people expect: $2,400 paid once a year saves a little less than $200 every month, because each monthly $200 starts cutting interest up to 11 months sooner.</p>
<p>Biweekly plans work because they add a 13th payment each year, not because of the timing. If a third-party company charges a fee to set up biweekly payments, you can get the same result free by adding one-twelfth of your payment to each monthly bill.</p>`
    },
    {
      h2: 'Should I pay off my mortgage early or invest?',
      html: `<p>Compare your mortgage rate with what you could reliably earn after tax. Every extra dollar on a 6.5% mortgage earns exactly 6.5%, risk-free. Investing in a diversified stock fund has historically returned more over long periods, but with real swings and taxes on gains outside retirement accounts.</p>
<ul>
<li><strong>Do these first:</strong> capture any 401(k) employer match, pay off credit cards and other debt above your mortgage rate, and hold three to six months of expenses in cash.</li>
<li><strong>Lean toward prepaying</strong> if your rate is 6% or higher, you are close to retirement, or you value the lower fixed costs of a paid-off home.</li>
<li><strong>Lean toward investing</strong> if your rate is under about 4%, you have decades ahead, or your savings are mostly tied up in the house already. Home equity is hard to get back without selling or borrowing.</li>
</ul>
<p>Only itemizers get a mortgage interest deduction, and since the standard deduction roughly doubled in 2018 most households don't itemize, so the "tax break" argument for keeping a mortgage applies to fewer people than it used to.</p>`
    },
    {
      h2: 'Will extra payments go to principal, and is there a prepayment penalty?',
      html: `<p>Most servicers apply extra money to principal if you tell them to: use the "additional principal" line on the payment coupon or online form. Check the next statement to confirm the balance dropped by the full extra amount.</p>
<p>Prepayment penalties are rare on today's home loans. Under federal rules, most mortgages made since 2014 can only carry a penalty if they are fixed-rate qualified mortgages, and even then it is limited to the first three years and capped at 2% of the prepaid balance in years one and two and 1% in year three. FHA, VA and USDA loans don't allow prepayment penalties. Your Loan Estimate and Closing Disclosure state whether your loan has one.</p>`
    }
  ],
  faq: [
    { q: 'What happens if I pay an extra $500 a month on my mortgage?', a: 'On a $250,000 balance at 6.5% with 25 years left, $500 extra a month pays the loan off in 14 years 11 months instead of 25, saving $115,668 in interest.' },
    { q: 'How much does one extra mortgage payment a year save?', a: 'One extra full payment a year ($1,688 in the default example) cuts a 25-year payoff to 21 years and saves about $47,500 of interest at 6.5%. Switching to biweekly payments does slightly better, because the extra money arrives in pieces through the year.' },
    { q: 'Does paying extra lower my monthly payment?', a: 'No. Extra principal shortens the loan but the required payment stays the same. To lower the payment after a large prepayment, ask your servicer about a recast, which re-amortizes the smaller balance over the remaining term for a fee, usually a few hundred dollars.' },
    { q: 'Is it better to pay extra on principal or interest?', a: 'Always principal. Interest for the month is fixed by the balance; any extra above the scheduled payment should be marked "principal only" so it reduces the balance that future interest is charged on.' },
    { q: 'Can I pay off a 30-year mortgage in 15 years?', a: 'Yes, by paying what a 15-year loan would cost. On a new $320,000 loan at 7%, that means $2,876.25 a month instead of $2,128.97, an extra $747.28, and it saves about $248,700 in interest.' },
    { q: 'Should I use savings to pay off my mortgage?', a: 'Only money beyond your emergency fund and after higher-interest debts and employer 401(k) matches. Cash put into the house is not available in an emergency without a loan or sale.' }
  ],
  related: ['mortgage-calculator', 'refinance-calculator', 'amortization-calculator', 'loan-payoff-calculator', 'heloc-payment-calculator'],
  sources: [
    { name: 'CFPB: What is a prepayment penalty?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/' },
    { name: 'CFPB: Regulation Z §1026.43, minimum standards and prepayment penalties', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/43/' },
    { name: 'CFPB: Owning a Home', url: 'https://www.consumerfinance.gov/owning-a-home/' },
    { name: 'IRS: Publication 936, Home Mortgage Interest Deduction', url: 'https://www.irs.gov/forms-pubs/about-publication-936' }
  ]
};
