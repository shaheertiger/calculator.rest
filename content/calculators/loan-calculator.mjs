export default {
  slug: 'loan-calculator',
  hub: 'loans',
  name: 'Loan Payment Calculator',
  title: 'Loan Calculator: $25,000 at 9% for 5 Years Is $518.96/mo',
  h1: 'Loan Payment Calculator: Monthly Payment, Monthly Rate and Total Interest',
  meta: 'A $25,000 loan at 9% APR over 60 months costs $518.96 a month and $6,137.60 in interest. Enter any amount, rate and term to price a personal loan.',
  keyword: 'how to calculate interest rate per month on loan',
  also: ['how to calculate interest paid on a loan', 'how to calculate monthly interest on loan', 'how to calculate the interest rate on a loan', 'how to calculate loan repayment in excel', 'how to calculate a loan amount', 'how to calculate monthly interest rate for solar loan', 'how do i calculate monthly interest'],
  updated: '2026-11-13',
  inputs: [
    { id: 'amount', label: 'Loan amount', type: 'number', value: 25000, prefix: '$' },
    { id: 'rate', label: 'Interest rate (APR)', type: 'number', value: 9, suffix: '%', help: 'The yearly rate on your loan offer. The monthly rate is this ÷ 12.' },
    { id: 'term', label: 'Loan term', type: 'number', value: 5 },
    { id: 'unit', label: 'Term is in', type: 'select', value: 'years', options: [['years', 'Years'], ['months', 'Months']] }
  ],
  compute(v, H) {
    if (!(v.amount > 0)) return { error: 'Enter the amount you want to borrow.' };
    if (!(v.rate >= 0) || v.rate > 100) return { error: 'Enter an annual interest rate between 0% and 100%.' };
    if (!(v.term > 0)) return { error: 'Enter the loan term.' };
    var n = Math.round(v.unit === 'months' ? v.term : v.term * 12);
    if (n < 1 || n > 600) return { error: 'Use a term between 1 and 600 months.' };
    var r = v.rate / 100 / 12;
    var pay = Math.round(H.pmt(r, n, v.amount) * 100) / 100;
    var total = pay * n;
    var interest = total - v.amount;
    var firstInt = v.amount * r;
    return {
      value: H.money(pay),
      label: 'Monthly payment',
      expr: H.money0(v.amount) + ' · ' + H.num(v.rate, 3) + '% APR · ' + n + ' months',
      rows: [
        ['Monthly interest rate (APR ÷ 12)', H.pct(r * 100, 4)],
        ['Interest in month 1', H.money(firstInt)],
        ['Principal in month 1', H.money(pay - firstInt)],
        ['Total interest', H.money(interest), true],
        ['Total of all payments', H.money(total)],
        ['Interest per $1 borrowed', H.money(interest / v.amount)]
      ],
      sub: 'Interest is charged on the unpaid balance each month, so the interest share of each ' + H.money(pay) + ' payment shrinks as the balance falls.'
    };
  },
  quick: ({ r }) => `To get the monthly interest rate on a loan, divide the APR by 12: a 9% APR is <strong>0.75% a month</strong>. On a $25,000 balance that is $187.50 of interest in month one. Spread over 60 months, the loan costs <strong>${r.value}</strong> a month and $6,137.60 in total interest, about 25¢ per dollar borrowed.`,
  stepsTitle: 'How to work out a loan payment',
  steps: [
    'Enter the amount you will actually receive plus any fee the lender adds to the balance. If an origination fee is taken out of the proceeds instead, still enter the full amount you owe.',
    'Enter the APR from your offer. The calculator converts it to a monthly rate by dividing by 12; it does <em>not</em> divide by 365, which is the step people most often get wrong.',
    'Enter the term and pick years or months. A 5-year loan is 60 payments.',
    'Read the monthly payment, the interest in the first month and the total interest. Change the term to see the trade-off: a longer term lowers the payment but raises the total cost.'
  ],
  formulaTitle: 'What is the formula for a monthly loan payment?',
  formula: {
    expr: 'r = APR ÷ 12<br>M = P × r ÷ (1 − (1 + r)<sup>−n</sup>)<br>Total interest = M × n − P',
    vars: [['M', 'monthly payment'], ['P', 'principal (amount borrowed)'], ['r', 'monthly interest rate as a decimal (9% APR → 0.0075)'], ['n', 'number of monthly payments']],
    note: 'This is the standard fixed-rate installment formula behind personal, auto, solar and student loans, and the same one spreadsheets use in PMT(). With a 0% rate the payment is simply P ÷ n.'
  },
  example: `<p>You borrow $25,000 at 9% APR for 5 years.</p>
<p>Monthly rate r = 0.09 ÷ 12 = <strong>0.0075</strong> (0.75%). Number of payments n = 5 × 12 = <strong>60</strong>.</p>
<p>(1.0075)<sup>−60</sup> = 0.63870, so M = 25,000 × 0.0075 ÷ (1 − 0.63870) = 187.50 ÷ 0.36130 = <strong>$518.96</strong>.</p>
<p>Total paid = $518.96 × 60 = $31,137.60, so total interest = <strong>$6,137.60</strong>. The first payment splits into $187.50 interest and $331.46 principal.</p>`,
  table: {
    title: 'What is the monthly payment on a $25,000 loan?',
    intro: 'Monthly payments on a $25,000 fixed-rate loan at common personal-loan APRs, worked out with the calculator above.',
    head: ['APR', 'Monthly rate', '36 months', '48 months', '60 months', '72 months', 'Interest over 60 mo'],
    rows: ({ run, H }) => [6, 8, 9, 10, 12, 15, 18, 24, 30, 36].map(a => {
      const p = m => run({ amount: 25000, rate: a, term: m, unit: 'months' });
      return [H.pct(a, 0), H.pct(a / 12, 3), p(36).value, p(48).value, p(60).value, p(72).value, p(60).rows[3][1]];
    }),
    note: 'Payments are principal and interest only. Lender fees, credit insurance and late charges are extra. 36% is the highest APR in this table because many consumer-credit rules, including the Military Lending Act, treat it as a ceiling.'
  },
  sections: [
    {
      h2: 'How do you calculate the monthly interest rate on a loan?',
      html: `<p>Divide the annual percentage rate by 12. A loan at 9% APR charges 0.75% a month; 12% APR is 1% a month; 6% APR is 0.5% a month. To turn that into dollars, multiply the monthly rate by what you still owe: 0.75% of $25,000 is <strong>$187.50</strong>, and once the balance is down to $10,000 the same rate costs only $75.</p>
<p>Two details matter. First, lenders quote the rate per year even when interest is billed monthly, so a monthly figure like "1.5%" on a store card or a buy-here-pay-here offer is really 18% a year. Second, some installment loans accrue interest daily (APR ÷ 365 × days since the last payment), which is why a payment made a few days late puts slightly more toward interest. For the daily method on short balances, see the <a href="/simple-interest-calculator">simple interest calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate the total interest paid on a loan?',
      html: `<p>Multiply the monthly payment by the number of payments and subtract the amount you borrowed. For the default loan: $518.96 × 60 − $25,000 = <strong>$6,137.60</strong>. That number assumes you make every payment on schedule and never pay extra.</p>
<p>The interest is not spread evenly. Month one carries $187.50 of interest; in the final year each payment carries less than $45 of interest, and the last one under $4. If you want to see each month's split, the <a href="/amortization-calculator">amortization schedule calculator</a> lists them. If you already have a loan and want to know how soon it ends at your current payment, use the <a href="/loan-payoff-calculator">loan payoff calculator</a>.</p>`
    },
    {
      h2: 'How do you find the interest rate if you only know the payment?',
      html: `<p>There is no algebraic shortcut; the rate has to be found by trial (lenders and spreadsheets do it by iteration). In Excel or Google Sheets, <code>=RATE(60, -518.96, 25000) * 12</code> returns 9.00%. In this calculator, keep the amount and term fixed and adjust the APR until the payment matches your statement.</p>
<p>A quick sanity check: if the payment times the number of months is $31,000 on a $25,000 loan, you are paying $6,000 of interest, which over five years is roughly a 9% loan. If a dealer or lender quotes only a payment, ask for the APR in writing. The federal Truth in Lending Act requires lenders to disclose the APR, the finance charge and the total of payments before you sign.</p>`
    },
    {
      h2: 'How do you calculate a loan payment in Excel?',
      html: `<p>Use <code>=PMT(rate/12, months, -amount)</code>. For the example: <code>=PMT(9%/12, 60, -25000)</code> gives <strong>$518.96</strong>. The minus sign tells Excel the loan amount is money you received.</p>
<ul>
<li><strong>Interest in a given month:</strong> <code>=IPMT(9%/12, 1, 60, -25000)</code> → $187.50.</li>
<li><strong>Principal in a given month:</strong> <code>=PPMT(9%/12, 1, 60, -25000)</code> → $331.46.</li>
<li><strong>How much you can borrow for a payment:</strong> <code>=PV(9%/12, 60, -400)</code> → $19,269.</li>
<li><strong>Months to repay at a set payment:</strong> <code>=NPER(9%/12, -600, 25000)</code> → about 50.1.</li>
</ul>`
    },
    {
      h2: 'How much can I borrow for a given monthly payment?',
      html: `<p>Run the formula in reverse: Loan = M × (1 − (1 + r)<sup>−n</sup>) ÷ r. At 9% over 60 months, every $100 of monthly budget supports about $4,817 of borrowing, so a $400 payment covers roughly $19,269 and $600 covers $28,904. Stretching to 72 months raises a $400 budget to about $22,190, but you pay interest for an extra year.</p>
<p>Lenders also look at your debt-to-income ratio before approving the amount. The <a href="/dti-calculator">DTI calculator</a> shows how a new payment changes it.</p>`
    }
  ],
  faq: [
    { q: 'What is the monthly interest rate on a 12% APR loan?', a: '1% a month. Divide the annual rate by 12. On a $10,000 balance that is $100 of interest for the month.' },
    { q: 'How much is the monthly payment on a $10,000 loan?', a: 'At 9% APR, a $10,000 loan costs $207.58 a month over 5 years or $318.00 over 3 years. Enter your own rate above for an exact figure.' },
    { q: 'Is the interest rate the same as the APR?', a: 'Not always. The interest rate sets your payment; the APR also counts certain fees, such as an origination fee, so it is equal to or higher than the rate. Use the APR to compare offers and the rate to calculate the payment.' },
    { q: 'Does paying a loan off early save interest?', a: 'Yes, on a standard simple-interest installment loan. Interest is charged only on the remaining balance, so any extra principal you pay stops future interest on that amount. Check your contract for a prepayment penalty first.' },
    { q: 'Why does a longer loan cost more if the payment is lower?', a: 'You owe the balance for longer, so interest accrues for more months. At 9%, $25,000 costs $3,619.64 in interest over 3 years but $7,446.08 over 6 years.' },
    { q: 'How do I calculate the interest on a solar loan?', a: 'The same way as any installment loan: divide the APR by 12 and apply the payment formula. Some solar loans are built around a lump-sum paydown in the first 12 to 18 months; if you skip it, the payment usually resets higher, so ask the lender for both figures.' },
    { q: 'What credit score do I need for a good personal loan rate?', a: 'There is no single cutoff; lenders price loans on credit score, income and existing debt. Borrowers with scores in the mid-700s and above usually see the lowest advertised APRs, while lower scores can push rates toward 30% or more.' }
  ],
  related: ['amortization-calculator', 'loan-payoff-calculator', 'apr-calculator', 'simple-interest-calculator', 'car-loan-calculator'],
  sources: [
    { name: 'CFPB: Ask CFPB, loans and interest rates', url: 'https://www.consumerfinance.gov/ask-cfpb/' },
    { name: 'eCFR: Regulation Z (Truth in Lending), 12 CFR Part 1026', url: 'https://www.ecfr.gov/current/title-12/chapter-X/part-1026' },
    { name: 'Federal Reserve: G.19 Consumer Credit release (personal and auto loan rates)', url: 'https://www.federalreserve.gov/releases/g19/current/default.htm' }
  ]
};
