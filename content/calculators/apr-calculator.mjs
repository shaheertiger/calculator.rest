export default {
  slug: 'apr-calculator',
  hub: 'loans',
  name: 'APR Calculator',
  title: 'APR Calculator: 6.5% Mortgage + $5,500 Fees = 6.679% APR',
  h1: 'APR Calculator: The True Yearly Cost of a Loan After Points and Fees',
  meta: 'A $300,000, 30-year mortgage at 6.5% with $5,500 of points and lender fees has a 6.679% APR. Enter any rate, points and fees to compare loan offers.',
  keyword: 'how do you calculate apr for a mortgage',
  also: ['apr calculator', 'how do you calculate apr in excel', 'mortgage apr calculator', 'how to calculate apr with fees'],
  updated: '2026-11-13',
  inputs: [
    { id: 'amount', label: 'Loan amount', type: 'number', value: 300000, prefix: '$' },
    { id: 'rate', label: 'Note interest rate', type: 'number', value: 6.5, suffix: '%', help: 'The rate that sets your monthly payment.' },
    { id: 'years', label: 'Term', type: 'number', value: 30, suffix: 'years' },
    { id: 'points', label: 'Discount / origination points', type: 'number', value: 1, suffix: '% of loan' },
    { id: 'fees', label: 'Other finance charges', type: 'number', value: 2500, prefix: '$', help: 'Lender, underwriting, processing and broker fees, prepaid interest, mortgage insurance paid at closing.' }
  ],
  compute(v, H) {
    if (!(v.amount > 0)) return { error: 'Enter the loan amount.' };
    if (!(v.rate >= 0) || v.rate > 50) return { error: 'Enter the note rate between 0% and 50%.' };
    if (!(v.years > 0) || v.years > 50) return { error: 'Enter a term up to 50 years.' };
    var n = Math.round(v.years * 12);
    var r = v.rate / 1200;
    var pts = v.points > 0 ? v.amount * v.points / 100 : 0;
    var fees = v.fees > 0 ? v.fees : 0;
    var charges = pts + fees;
    var af = v.amount - charges;
    if (!(af > 0)) return { error: 'Fees cannot equal or exceed the loan amount.' };
    var pay = Math.round(H.pmt(r, n, v.amount) * 100) / 100;
    function aprFor(k) {
      var bal = H.fv(r, k, -pay, v.amount);
      if (k >= n) bal = 0;
      var f = function (i) { return H.pvAnn(i, k, pay) + Math.max(0, bal) / Math.pow(1 + i, k) - af; };
      var i = H.solve(f, 1e-10, 0.2);
      return i * 1200;
    }
    var apr = charges > 0 ? aprFor(n) : v.rate;
    var fin = pay * n - af;
    var rows = [
      ['Monthly payment (principal + interest)', H.money(pay)],
      ['Prepaid finance charges', H.money(charges)],
      ['Amount financed', H.money(af)],
      ['APR minus note rate', '+' + H.fix(apr - v.rate, 3) + ' pts'],
      ['Finance charge over the full term', H.money(fin), true]
    ];
    if (n > 120 && charges > 0) rows.push(['Effective rate if repaid after 10 years', H.pct(aprFor(120), 3)]);
    if (n > 60 && charges > 0) rows.push(['Effective rate if repaid after 5 years', H.pct(aprFor(60), 3)]);
    return {
      value: H.pct(apr, 3),
      label: 'APR',
      expr: H.pct(v.rate, 3) + ' rate · ' + H.money0(charges) + ' fees · ' + n + ' months',
      rows: rows,
      sub: 'The APR is the rate at which ' + n + ' payments of ' + H.money(pay) + ' repay exactly the ' + H.money0(af) + ' you net after fees.'
    };
  },
  quick: ({ r }) => `A mortgage APR is the interest rate at which your monthly payments would repay only the money you actually receive after points and lender fees. A $300,000, 30-year loan at 6.5% has a $1,896.20 payment. Subtract 1 point ($3,000) and $2,500 of fees, and that payment repays $294,500 at an APR of <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate the APR on a mortgage',
  steps: [
    'Work out the monthly principal-and-interest payment from the full loan amount and the note rate. $300,000 at 6.5% for 30 years is $1,896.20.',
    'Add up the prepaid finance charges: points, origination and lender fees, broker fees, prepaid interest and upfront mortgage insurance. Leave out appraisal, credit report, title, notary and recording fees, which Regulation Z excludes for mortgages; including them is the most common mistake.',
    'Subtract the finance charges from the loan amount to get the amount financed: $300,000 − $5,500 = $294,500.',
    'Find the monthly rate at which 360 payments of $1,896.20 have a present value of $294,500, then multiply by 12. The calculator does this by bisection; Excel\'s RATE() does it by iteration.'
  ],
  formulaTitle: 'What is the APR formula?',
  formula: {
    expr: 'Amount financed = Σ<sub>k=1..n</sub> M ÷ (1 + i)<sup>k</sup><br>APR = 12 × i',
    vars: [['M', 'monthly payment at the note rate'], ['n', 'number of payments'], ['i', 'monthly rate that solves the equation'], ['Amount financed', 'loan amount − prepaid finance charges']],
    note: 'This is the actuarial method set out in Appendix J of Regulation Z for regular monthly payments. There is no closed-form solution, so the rate is found numerically. In Excel: <code>=RATE(360, -1896.20, 294500) * 12</code>.'
  },
  example: `<p>Loan $300,000 at a 6.5% note rate for 30 years, with 1 point ($3,000) and $2,500 of other finance charges.</p>
<p>Payment = <strong>$1,896.20</strong>. Amount financed = $300,000 − $5,500 = <strong>$294,500</strong>.</p>
<p>At 6.5% ÷ 12 the 360 payments are worth exactly $300,000, too much. At 6.7% ÷ 12 they are worth $293,858, too little. At 6.68% they are worth $294,463, just under. Narrowing further gives i = 0.0055657 a month, so <strong>APR = 6.679%</strong>.</p>
<p>The finance charge is $1,896.20 × 360 − $294,500 = <strong>$388,132</strong>: all the interest plus the $5,500 of fees.</p>`,
  table: {
    title: 'How much do closing fees raise the APR?',
    intro: 'A $300,000, 30-year loan at a 6.5% note rate with different prepaid finance charges. The last two columns show the effective yearly cost if you sell or refinance early.',
    head: ['Prepaid finance charges', 'APR (full 30 years)', 'Effective rate after 10 years', 'Effective rate after 5 years'],
    rows: ({ run, H }) => [0, 1500, 3000, 4500, 6000, 7500, 9000, 12000].map(f => {
      const x = run({ amount: 300000, rate: 6.5, years: 30, points: 0, fees: f });
      const get = l => { const row = (x.rows || []).find(q => q[0].indexOf(l) >= 0); return row ? row[1] : '6.5%'; };
      return [H.money0(f), x.value, get('10 years'), get('5 years')];
    }),
    note: 'The shorter you keep the loan, the more each dollar of upfront fees costs per year, so a low-rate, high-point loan can be the worse deal if you expect to move or refinance within a few years.'
  },
  sections: [
    {
      h2: 'Which fees are included in a mortgage APR?',
      html: `<p>Regulation Z counts a fee in the APR if it is a <strong>finance charge</strong>: a cost you pay as a condition of getting the credit that a cash buyer would not pay. For mortgages that includes:</p>
<ul>
<li>Discount points and origination points</li>
<li>Lender fees for origination, underwriting and processing (an application fee is excluded only if every applicant pays it, approved or not)</li>
<li>Mortgage broker fees</li>
<li>Prepaid (per-diem) interest from closing to the end of the month</li>
<li>Mortgage insurance premiums, including FHA upfront and monthly premiums and private mortgage insurance</li>
</ul>
<p>Real-estate charges listed in §1026.4(c)(7) are excluded even though you pay them at closing: title examination and title insurance, appraisal and credit report fees, document preparation, notary fees, and amounts placed in escrow for taxes and insurance. Government recording fees and transfer taxes are left out too. That is why two loans with identical closing costs can show different APRs.</p>`
    },
    {
      h2: 'Is the loan with the lowest APR always the better deal?',
      html: `<p>Only if you keep it for the full term. APR spreads the upfront fees over every payment, so it understates their cost if you sell or refinance early. Compare two offers on $300,000:</p>
<ul>
<li><strong>Offer A:</strong> 6.5% with $5,500 of points and fees. Payment $1,896.20, APR 6.679%.</li>
<li><strong>Offer B:</strong> 6.875% with no lender fees. Payment $1,970.79, APR 6.875%.</li>
</ul>
<p>Over 30 years, A wins. But A's effective yearly cost is 6.769% if you leave after 10 years and 6.948% after 5 years, so if you expect to move or refinance within about five years, B is cheaper. A simpler check is the break-even month: upfront cost ÷ monthly savings. One point of $3,000 that cuts the rate from 6.75% to 6.5% saves $49.59 a month and takes about 61 months to pay back.</p>`
    },
    {
      h2: 'How do you calculate APR in Excel?',
      html: `<p>Use RATE with the payment based on the full loan and the present value equal to the amount financed:</p>
<ul>
<li>Mortgage example: <code>=RATE(360, -1896.20, 300000-5500) * 12</code> → 6.679%.</li>
<li>Personal loan with an origination fee: $10,000 at 12% for 3 years has a $332.14 payment. If a 5% ($500) fee is deducted from the proceeds, <code>=RATE(36, -332.14, 9500) * 12</code> → <strong>15.605%</strong>. The fee adds more than 3.6 points because it is spread over only 36 months.</li>
</ul>
<p>To build the payment itself, <code>=PMT(6.5%/12, 360, -300000)</code> returns $1,896.20. For a card's daily and monthly rates, see the <a href="/credit-card-interest-calculator">credit card interest calculator</a> instead; card APRs have no upfront fees to fold in.</p>`
    },
    {
      h2: 'How accurate does the APR on my Loan Estimate have to be?',
      html: `<p>Under Regulation Z §1026.22, a disclosed APR is considered accurate if it is within <strong>1/8 of a percentage point</strong> (0.125) of the true figure for a regular loan, or 1/4 point for an irregular one (for example, with uneven payments or a construction phase). Page 3 of the Loan Estimate and Closing Disclosure shows the APR next to the Total Interest Percentage (TIP), the total interest over the loan as a percentage of the amount borrowed.</p>
<p>If the APR on your final terms rises beyond that tolerance after you receive the Closing Disclosure, the lender must give you a corrected disclosure and a new three-business-day waiting period before closing. A lower APR does not restart the clock.</p>`
    }
  ],
  faq: [
    { q: 'Why is my APR higher than my interest rate?', a: 'Because the APR adds the cost of points, lender fees and mortgage insurance to the interest. With no finance charges the two are equal; every dollar of fees pushes the APR above the note rate.' },
    { q: 'Does the APR include closing costs like title insurance and the appraisal?', a: 'No. For mortgages, title insurance, title search, appraisal, credit report, notary and document preparation fees, and escrow deposits, are excluded from the finance charge. Points, origination and underwriting fees, broker fees, prepaid interest and mortgage insurance are included.' },
    { q: 'Does PMI count in the APR?', a: 'Yes. Mortgage insurance premiums, including private mortgage insurance and FHA mortgage insurance, are finance charges, so they raise the APR.' },
    { q: 'How is APR calculated on an adjustable-rate mortgage?', a: 'The lender assumes the rate adjusts to the fully indexed rate (today\'s index plus the margin) after the fixed period and computes one composite APR. Because the index will change, an ARM\'s APR is only an estimate of future cost.' },
    { q: 'What is the difference between APR and APY?', a: 'APR is a yearly rate without compounding, used for loans. APY includes compounding and is used for savings. A 6% rate compounded monthly is a 6.17% APY. Use the APY calculator to convert between them.' },
    { q: 'Is a 0.25-point difference in APR a lot?', a: 'On a $300,000 30-year loan, a quarter-point lower rate (6.25% instead of 6.5%) saves about $49 a month, or roughly $17,700 over the full term if you keep the loan that long.' },
    { q: 'Can I compare APRs on a 15-year and a 30-year loan?', a: 'Not directly. Fees raise the APR more on a shorter loan, and the payments differ. Compare APRs between offers with the same term and loan type, then compare payments and total interest separately.' }
  ],
  related: ['mortgage-calculator', 'loan-calculator', 'apy-calculator', 'refinance-calculator', 'credit-card-interest-calculator'],
  sources: [
    { name: 'CFPB: What is the difference between a mortgage interest rate and an APR?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/' },
    { name: 'CFPB: Regulation Z §1026.4 Finance charge', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/4/' },
    { name: 'CFPB: Regulation Z §1026.22 Determination of annual percentage rate', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/22/' },
    { name: 'CFPB: What is a Loan Estimate?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/' }
  ]
};
