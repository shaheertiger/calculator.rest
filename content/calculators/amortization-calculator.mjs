export default {
  slug: 'amortization-calculator',
  hub: 'loans',
  name: 'Amortization Schedule Calculator',
  title: 'Amortization Calculator: $30,000 at 7.5% Schedule ($601.14/mo)',
  h1: 'Amortization Schedule Calculator: Principal, Interest and Balance by Month',
  meta: 'See how each $601.14 payment on a $30,000, 7.5%, 5-year loan splits between interest and principal, month by month, with yearly totals and balances.',
  keyword: 'how to calculate loan amortization',
  also: ['amortization schedule calculator', 'how do you calculate amortization', 'how to calculate amortization expense', 'amortization table'],
  updated: '2026-11-13',
  inputs: [
    { id: 'amount', label: 'Loan amount', type: 'number', value: 30000, prefix: '$' },
    { id: 'rate', label: 'Interest rate (APR)', type: 'number', value: 7.5, suffix: '%' },
    { id: 'years', label: 'Term', type: 'number', value: 5, suffix: 'years' },
    { id: 'start', label: 'First payment date', type: 'date', value: 'today+30' }
  ],
  compute(v, H) {
    if (!(v.amount > 0)) return { error: 'Enter the loan amount.' };
    if (!(v.rate >= 0) || v.rate > 60) return { error: 'Enter an annual rate between 0% and 60%.' };
    if (!(v.years > 0) || v.years > 50) return { error: 'Enter a term between 1 month (0.09) and 50 years.' };
    var n = Math.max(1, Math.round(v.years * 12));
    var r = v.rate / 1200;
    var pay = Math.round(H.pmt(r, n, v.amount) * 100) / 100;
    var start = H.parseDate(v.start) || H.parseDate(H.today());
    var mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function lab(k) { var d = H.addMonths(start, k - 1); return mn[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
    var bal = v.amount, sched = [], totInt = 0, half = 0, cross = 0;
    for (var k = 1; k <= n && bal > 0.005; k++) {
      var it = Math.round(bal * r * 100) / 100;
      var pr = pay - it;
      if (pr > bal || k === n) pr = bal;
      bal = Math.round((bal - pr) * 100) / 100;
      totInt += it;
      if (!cross && pr > it) cross = k;
      if (!half && bal <= v.amount / 2) half = k;
      sched.push({ k: k, pay: pr + it, it: it, pr: pr, bal: bal });
    }
    var rowsT = [];
    var fmt = function (a, b, c, d, e) { return [a, H.money(b), H.money(c), H.money(d), H.money(e)]; };
    if (sched.length <= 24) {
      sched.forEach(function (s) { rowsT.push(fmt(s.k + ' · ' + lab(s.k), s.pay, s.pr, s.it, s.bal)); });
    } else {
      for (var i = 0; i < 12; i++) { var s = sched[i]; rowsT.push(fmt(s.k + ' · ' + lab(s.k), s.pay, s.pr, s.it, s.bal)); }
      for (var y = 2; (y - 1) * 12 < sched.length; y++) {
        var p = 0, pi = 0, ii = 0, last = null;
        for (var j = (y - 1) * 12; j < Math.min(y * 12, sched.length); j++) { p += sched[j].pay; pi += sched[j].pr; ii += sched[j].it; last = sched[j]; }
        rowsT.push(fmt('<b>Year ' + y + '</b> · ' + ((y - 1) * 12 + 1) + '–' + last.k, p, pi, ii, last.bal));
      }
    }
    var y1 = sched[Math.min(11, sched.length - 1)];
    var y1int = 0; for (var q = 0; q < Math.min(12, sched.length); q++) y1int += sched[q].it;
    var first = sched[0];
    return {
      value: H.money(pay),
      label: 'Monthly payment (principal + interest)',
      expr: H.money0(v.amount) + ' · ' + H.num(v.rate, 3) + '% · ' + n + ' payments',
      rows: [
        ['Payment 1: interest / principal', H.money(first.it) + ' / ' + H.money(first.pr)],
        ['Interest paid in the first 12 months', H.money(y1int)],
        ['Balance after 12 payments', H.money(y1.bal)],
        ['Half the principal repaid after', H.plural(half, 'payment')],
        ['Principal first exceeds interest', 'payment ' + cross],
        ['Total interest', H.money(totInt), true],
        ['Final payment', lab(sched.length) + ' (' + H.money(sched[sched.length - 1].pay) + ')']
      ],
      sub: Math.round(first.it / pay * 100) + '% of your first payment is interest; by the last payment it is under ' + Math.max(1, Math.ceil(sched[sched.length - 1].it / pay * 100)) + '%.',
      table: { head: ['Payment', 'Paid', 'Principal', 'Interest', 'Balance'], rows: rowsT, caption: sched.length <= 24 ? 'Full amortization schedule' : 'First 12 payments, then yearly totals' }
    };
  },
  quick: ({ r }) => `To calculate loan amortization, find the fixed payment, then each month charge interest on the balance (balance × APR ÷ 12) and subtract it from the payment; the rest repays principal. On a <strong>$30,000</strong> loan at 7.5% for 5 years the payment is <strong>${r.value}</strong>: payment 1 is $187.50 interest and $413.64 principal, and the balance is down to $24,862.08 after a year.`,
  stepsTitle: 'How to build an amortization schedule',
  steps: [
    'Work out the fixed monthly payment with the installment formula (or enter your loan above and read it off).',
    'For month 1, multiply the starting balance by the monthly rate (APR ÷ 12) to get the interest. $30,000 × 0.625% = $187.50.',
    'Subtract that interest from the payment to get the principal portion: $601.14 − $187.50 = $413.64. Subtract the principal from the balance: $29,586.36.',
    'Repeat with the new balance each month. Interest is always figured on the <em>current</em> balance, not the original loan, which is the step most hand-made schedules get wrong.',
    'Let the last payment absorb any rounding so the balance ends at exactly $0.00.'
  ],
  formulaTitle: 'What formulas drive an amortization schedule?',
  formula: {
    expr: 'M = P × r ÷ (1 − (1 + r)<sup>−n</sup>)<br>Interest<sub>k</sub> = B<sub>k−1</sub> × r &nbsp;·&nbsp; Principal<sub>k</sub> = M − Interest<sub>k</sub><br>B<sub>k</sub> = P(1 + r)<sup>k</sup> − M × ((1 + r)<sup>k</sup> − 1) ÷ r',
    vars: [['M', 'fixed monthly payment'], ['P', 'original principal'], ['r', 'monthly rate (APR ÷ 12)'], ['n', 'total payments'], ['B<sub>k</sub>', 'balance after payment k']],
    note: 'The last line jumps straight to the balance after any payment without building every row, which is how the yearly balances in the table are checked. The calculator rounds each month\'s interest to the cent, as lenders do.'
  },
  example: `<p>$30,000 at 7.5% for 60 months; r = 0.075 ÷ 12 = 0.00625; payment = $601.14.</p>
<p><strong>Payment 1:</strong> interest = 30,000 × 0.00625 = $187.50; principal = $413.64; balance = $29,586.36.</p>
<p><strong>Payment 2:</strong> interest = 29,586.36 × 0.00625 = $184.91; principal = $416.23; balance = $29,170.13.</p>
<p><strong>Payment 3:</strong> interest = $182.31; principal = $418.83; balance = $28,751.30.</p>
<p>Each month about $2.60 more goes to principal. After 12 payments the balance is $24,862.08, so year one repaid $5,137.92 of principal and cost $2,075.76 of interest.</p>`,
  table: {
    title: 'How fast does the balance fall on a 5-, 10-, 15- and 30-year loan?',
    intro: 'Share of the original principal repaid by the end of each year at 7.5% APR. Longer terms repay slowly at first because early payments are mostly interest.',
    head: ['End of year', '5-year loan', '10-year loan', '15-year loan', '30-year loan'],
    rows: ({ H }) => [1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map(y => [String(y), ...[5, 10, 15, 30].map(t => {
      if (y > t) return '—';
      const r = 0.075 / 12, n = t * 12, k = y * 12, g = Math.pow(1 + r, k);
      const pay = H.pmt(r, n, 1);
      const bal = Math.max(0, g - pay * (g - 1) / r);
      return H.pct((1 - bal) * 100, 1);
    })]),
    note: 'On the 30-year loan only about 5% of the principal is gone after five years, and principal does not overtake interest until payment 250 (year 21).'
  },
  sections: [
    {
      h2: 'Why does most of an early loan payment go to interest?',
      html: `<p>Because interest is charged on the balance, and the balance is highest at the start. On the default loan the first payment is 31% interest and the last is under 1%. The longer the term, the more extreme this is: on a $300,000, 30-year loan at 7.5%, the $2,097.64 payment is $1,875 interest and only $222.64 principal in month one. Principal does not exceed interest until payment 250, and half the original balance is not repaid until payment 265, more than 22 years in.</p>
<p>This is why the first years of a long loan build little equity and why refinancing or selling early leaves most of the balance in place. The CFPB describes the same pattern for auto loans: the principal balance falls slowly at first, then faster near the end.</p>`
    },
    {
      h2: 'How do you make an amortization schedule in Excel or Google Sheets?',
      html: `<p>Put the rate in B1 (7.5%), months in B2 (60) and amount in B3 (30000). Then:</p>
<ul>
<li><strong>Payment:</strong> <code>=PMT(B1/12, B2, -B3)</code> → $601.14.</li>
<li><strong>Columns:</strong> Period (1–60), Interest <code>=ROUND(prev_balance*$B$1/12, 2)</code>, Principal <code>=payment − interest</code>, Balance <code>=prev_balance − principal</code>.</li>
<li><strong>Check any row directly:</strong> <code>=IPMT(B1/12, 13, B2, -B3)</code> gives month 13's interest and <code>=PPMT(…)</code> its principal.</li>
<li><strong>Interest paid over a range:</strong> <code>=-CUMIPMT(B1/12, B2, B3, 1, 12, 0)</code> → about $2,076 for year one.</li>
</ul>
<p>The calculator above follows the same steps and rounds interest to the cent each month, so its totals can differ from an unrounded spreadsheet by a few cents.</p>`
    },
    {
      h2: 'How do extra payments change an amortization schedule?',
      html: `<p>An extra payment goes straight to principal, so every later month starts from a lower balance and charges less interest. The required payment stays the same, but the schedule ends early. On the default loan, an extra $100 a month ends it after 50 payments instead of 60 and saves about $1,050 of interest.</p>
<p>This page shows the contractual schedule. To see how long your current balance will take at the payment you actually make, use the <a href="/loan-payoff-calculator">loan payoff calculator</a>; for the effect of extra payments on student debt, use the <a href="/student-loan-payoff-calculator">student loan payoff calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate amortization expense for an intangible asset?',
      html: `<p>Accounting amortization is different from loan amortization: it spreads the cost of an intangible asset (a patent, software license, customer list or goodwill) over its useful life, usually straight-line. Expense per year = (cost − residual value) ÷ useful life. A $90,000 patent with a 10-year life is amortized at <strong>$9,000 a year</strong>, or $750 a month.</p>
<p>For U.S. tax purposes, most acquired intangibles covered by Section 197 (such as goodwill) are amortized over 15 years and reported on IRS Form 4562. For physical assets the equivalent is depreciation; see the <a href="/depreciation-calculator">depreciation calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is an amortization schedule?', a: 'A table that lists every loan payment and splits it into interest and principal, with the balance remaining after each one. The CFPB uses the same definition for auto loans.' },
    { q: 'How much interest will I pay in the first year?', a: 'On a $30,000 loan at 7.5% for 5 years, $2,075.76 of the first 12 payments is interest, about 29% of the $7,213.68 paid that year.' },
    { q: 'Does an amortization schedule change if I pay early?', a: 'The payment amount does not change, but each extra dollar of principal cuts future interest, so the loan ends sooner than the original schedule shows.' },
    { q: 'Is a 15-year or 30-year loan better for building equity?', a: 'A 15-year loan builds equity much faster. At 7.5%, a 15-year loan has repaid about 22% of the principal after five years; a 30-year loan only about 5%.' },
    { q: 'What is negative amortization?', a: 'It happens when a payment is smaller than the interest due, so unpaid interest is added to the balance and the loan grows. Standard fixed-rate installment loans do not negatively amortize.' },
    { q: 'Why does my lender\'s schedule differ by a few cents?', a: 'Lenders round interest each month and some accrue interest daily (APR ÷ 365 × days in the period), so months with 31 days carry slightly more interest than 30-day months. The last payment absorbs the difference.' },
    { q: 'Can I get an amortization schedule for a mortgage here?', a: 'Yes, enter the loan amount, rate and a 15- or 30-year term. The schedule covers principal and interest only; taxes, insurance and PMI are extra. The mortgage calculator adds those costs.' }
  ],
  related: ['loan-calculator', 'loan-payoff-calculator', 'mortgage-calculator', 'student-loan-payoff-calculator', 'mortgage-payoff-calculator'],
  sources: [
    { name: 'CFPB: What is amortization and how could it affect my auto loan?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/' },
    { name: 'CFPB: How does paying down a mortgage work?', url: 'https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/' },
    { name: 'CFPB: What is negative amortization?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-negative-amortization-en-103/' },
    { name: 'IRS: About Form 4562, Depreciation and Amortization', url: 'https://www.irs.gov/forms-pubs/about-form-4562' }
  ]
};
