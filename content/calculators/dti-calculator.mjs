export default {
  slug: 'dti-calculator',
  hub: 'mortgage',
  name: 'Debt-to-Income Ratio Calculator',
  title: 'DTI Calculator: $2,770 of Debt on $7,000 Income Is 39.6%',
  h1: 'Debt-to-Income Ratio Calculator: Front-End and Back-End DTI',
  meta: '$2,770 of monthly debt payments on $7,000 of gross monthly income is a 39.6% back-end DTI and 27.1% front-end. Compare yours with 28/36, 43% and 50% limits.',
  keyword: 'how to calculate debt-to-income ratio',
  also: ['how to calculate dti in mortgage', 'how to calculate the debt to income ratio', 'how to calculate dti for fha loan', 'dti calculator', 'debt to income ratio calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'income', label: 'Gross monthly income', type: 'number', value: 7000, prefix: '$', help: 'Before taxes. Annual salary ÷ 12.' },
    { id: 'housing', label: 'Housing payment (new mortgage PITI + HOA)', type: 'number', value: 1900, prefix: '$', wide: true },
    { id: 'car', label: 'Car loans or leases', type: 'number', value: 450, prefix: '$' },
    { id: 'student', label: 'Student loans', type: 'number', value: 300, prefix: '$' },
    { id: 'cards', label: 'Credit card minimum payments', type: 'number', value: 120, prefix: '$' },
    { id: 'other', label: 'Other debts (personal loans, child support…)', type: 'number', value: 0, prefix: '$' }
  ],
  compute(v, H) {
    if (!(v.income > 0)) return { error: 'Enter your gross monthly income.' };
    var z = function (x) { return x > 0 ? x : 0; };
    var housing = z(v.housing), others = z(v.car) + z(v.student) + z(v.cards) + z(v.other);
    var total = housing + others;
    var back = total / v.income * 100, front = housing / v.income * 100;
    var room = function (p) { var x = v.income * p / 100 - total; return (x >= 0 ? H.money(x) + ' left' : H.money(-x) + ' over'); };
    var maxHousing = Math.max(0, Math.min(v.income * 0.28, v.income * 0.36 - others));
    var rows = [
      ['Front-end (housing) ratio', H.pct(front, 1), true],
      ['Total monthly debt payments', H.money(total)],
      ['Versus 36% (conventional comfort)', room(36)],
      ['Versus 43% (QM benchmark, FHA)', room(43)],
      ['Versus 50% (Fannie Mae DU maximum)', room(50)],
      ['Max housing payment under 28/36', H.money(maxHousing)]
    ];
    var verdict = back <= 36 ? 'Within the 36% that most lenders and planners treat as comfortable.'
      : back <= 43 ? 'Above 36% but within the 43% benchmark most loan programs accept; expect closer scrutiny of credit and savings.'
      : back <= 50 ? 'Above 43%: usually needs an automated underwriting approval with strong credit or cash reserves (conventional allows up to 50%).'
      : 'Above 50%: very hard to qualify for most mortgages. Paying down debt or adding income would help.';
    return {
      value: H.pct(back, 1),
      label: 'Back-end debt-to-income ratio',
      expr: H.money0(total) + ' ÷ ' + H.money0(v.income),
      rows: rows,
      sub: verdict
    };
  },
  quick: ({ r }) => `To calculate debt-to-income ratio, divide your total monthly debt payments by your gross monthly income. <strong>$2,770</strong> of payments (a $1,900 mortgage, $450 car loan, $300 student loan and $120 card minimum) on <strong>$7,000</strong> of income is a <strong>${r.value}</strong> back-end DTI. The housing payment alone is ${r.rows[0][1]}, the front-end ratio.`,
  stepsTitle: 'How to calculate your debt-to-income ratio',
  steps: [
    'Add up every monthly debt payment that shows on your credit report or a court order: mortgage or proposed mortgage (with tax, insurance, PMI and HOA), car loans and leases, student loans, credit card minimums, personal loans, child support and alimony.',
    'Use the <strong>minimum required</strong> payment, not what you actually pay. If you pay a card off in full each month, lenders still count the minimum on the statement.',
    'Find your gross monthly income: salary ÷ 12, or hourly rate × hours × 52 ÷ 12. Use pay before taxes and deductions; using take-home pay is the most common mistake and inflates the ratio.',
    'Divide total debts by gross income and multiply by 100. Do it once with housing only (front-end) and once with all debts (back-end).'
  ],
  formulaTitle: 'What is the debt-to-income ratio formula?',
  formula: {
    expr: 'Back-end DTI = total monthly debt payments ÷ gross monthly income × 100<br>Front-end DTI = monthly housing payment ÷ gross monthly income × 100',
    vars: [['total monthly debt payments', 'housing plus all other recurring debt minimums'], ['housing payment', 'principal, interest, property tax, insurance, mortgage insurance and HOA dues'], ['gross monthly income', 'income before taxes and deductions']],
    note: 'When people say "DTI" without a qualifier, they mean the back-end ratio. Fannie Mae and Freddie Mac look only at the back-end number; FHA and USDA set limits on both.'
  },
  example: `<p>Debts: $1,900 + $450 + $300 + $120 = <strong>$2,770</strong> a month. Income: $84,000 salary ÷ 12 = <strong>$7,000</strong>.</p>
<p>Back-end DTI = $2,770 ÷ $7,000 = 0.3957 → <strong>39.6%</strong>. Front-end DTI = $1,900 ÷ $7,000 = <strong>27.1%</strong>.</p>
<p>The front-end ratio passes the 28% guideline but the back-end ratio is above 36%. To get back to 36% this borrower would need to cut $250 of monthly payments, for example by paying off the card balance and part of the car loan, or find a home with a $1,650 payment.</p>`,
  table: {
    title: 'How much debt can I have for my income?',
    intro: 'Maximum total monthly debt payments, including the mortgage, at common DTI limits, plus the 28% housing guideline.',
    head: ['Gross annual income', 'Monthly income', 'Max housing at 28%', 'Total debts at 36%', 'at 43%', 'at 50%'],
    rows: ({ H }) => [36000, 48000, 60000, 72000, 84000, 100000, 120000, 150000, 200000].map(a => {
      const m = a / 12;
      return [H.money0(a), H.money0(m), H.money0(m * 0.28), H.money0(m * 0.36), H.money0(m * 0.43), H.money0(m * 0.5)];
    }),
    note: 'Subtract your existing non-housing debts from the total-debt column to see the mortgage payment each limit allows.'
  },
  sections: [
    {
      h2: 'What is a good debt-to-income ratio for a mortgage?',
      html: `<p>Lower is better, and lenders sort applicants roughly like this:</p>
<ul>
<li><strong>36% or less:</strong> comfortable; the traditional 28/36 rule and Fannie Mae's limit for manually underwritten loans.</li>
<li><strong>37% to 43%:</strong> approvable for most programs. 43% was the hard cap for a "qualified mortgage" when the CFPB's ability-to-repay rule took effect in 2014, and it remains the benchmark many lenders and FHA's manual guidelines use.</li>
<li><strong>44% to 50%:</strong> possible with automated approval and compensating factors such as a high credit score, a large down payment or months of cash reserves. Fannie Mae's Desktop Underwriter tops out at 50%.</li>
<li><strong>Above 50%:</strong> few lenders will approve a conventional loan; FHA's automated system occasionally does.</li>
</ul>
<p>The CFPB replaced the 43% QM cap with a price-based test in 2021, so 43% is no longer a legal limit, but it is still the most widely quoted line.</p>`
    },
    {
      h2: 'What debts are included in debt-to-income ratio?',
      html: `<p><strong>Counted:</strong> the new mortgage payment with escrow and HOA, auto loans and leases, student loans, credit card minimums, personal and payday loans, lines of credit with a balance, child support and alimony, and loans you co-signed. A deferred or $0 student loan still counts: FHA uses 0.5% of the balance, and Fannie Mae uses 1% of the balance or the payment that would fully repay it unless a documented income-driven payment applies.</p>
<p><strong>Not counted:</strong> utilities, phone, internet, car and health insurance, groceries, subscriptions and your current rent if you are buying. Some programs also ignore installment loans with 10 or fewer payments left and loans against your own 401(k). Those still cost money, which is why lender-approved budgets often feel tighter than the ratio suggests.</p>`
    },
    {
      h2: 'How do you calculate DTI for an FHA loan?',
      html: `<p>The same way, but FHA checks both ratios. Its manual-underwriting benchmark is <strong>31% housing</strong> and <strong>43% total</strong>, with higher ratios allowed when the borrower has compensating factors such as reserves or minimal payment increase, and approvals through FHA's TOTAL Mortgage Scorecard can go well above that. The FHA housing payment includes the monthly mortgage insurance premium, which adds about 0.55% of the loan a year for most 30-year loans with 3.5% down.</p>
<p>Example: $7,000 income allows a $2,170 housing payment at 31% and $3,010 of total debts at 43%. With the $870 of non-housing debt above, the 43% limit leaves $2,140 for housing, so that is the binding figure. VA loans use a 41% guideline plus a residual-income test, and USDA uses 29% and 41%.</p>`
    },
    {
      h2: 'How can I lower my debt-to-income ratio quickly?',
      html: `<p>Pay off the debts with the highest payment per dollar of balance first. A car loan with $3,000 left and a $450 payment drops your DTI by 6.4 points on $7,000 income once it is gone, while $3,000 toward a credit card might cut the minimum by only $60. Other options: add a co-borrower's income, document overtime, bonus or side income with a two-year history, avoid new financing before closing, or lower the housing payment with a larger down payment or a cheaper home.</p>
<p>See how a lower ratio changes your price range with the <a href="/house-affordability-calculator">home affordability calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'Is 40% a good debt-to-income ratio?', a: 'It is acceptable for most mortgages but not ideal. 40% is under the 43% benchmark and the 50% conventional maximum, but above the 36% that planners consider comfortable, so you may need good credit or savings to get the best rate.' },
    { q: 'Is debt-to-income based on gross or net income?', a: 'Gross income, before taxes and deductions. The CFPB and every major loan program define DTI as monthly debt payments divided by gross monthly income.' },
    { q: 'Is rent included in debt-to-income ratio?', a: 'Not when you apply for a mortgage, because the new house payment replaces your rent. Landlords screening rental applicants may compare the rent to your income separately.' },
    { q: 'What is the maximum DTI for a conventional loan?', a: '50% for loans approved through Fannie Mae\'s Desktop Underwriter, 36% for manually underwritten loans, or up to 45% manually with the required credit score and reserves.' },
    { q: 'Does debt-to-income ratio affect my credit score?', a: 'No. Income is not on your credit report, so DTI is not part of the score. Your credit utilization (card balances ÷ limits) does affect the score, and paying it down helps both.' },
    { q: 'How do I calculate DTI with an annual salary?', a: 'Divide the salary by 12 first. An $84,000 salary is $7,000 a month, so $2,520 of monthly debt payments is a 36% DTI.' },
    { q: 'Do lenders use the minimum payment on credit cards?', a: 'Yes, the minimum shown on your credit report or statement. If no minimum is reported, many lenders use 5% of the balance.' }
  ],
  related: ['house-affordability-calculator', 'mortgage-calculator', 'rent-affordability-calculator', 'debt-to-asset-ratio-calculator', 'heloc-payment-calculator'],
  sources: [
    { name: 'CFPB: What is a debt-to-income ratio?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/' },
    { name: 'CFPB: What is a Qualified Mortgage?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-qualified-mortgage-en-1789/' },
    { name: 'Fannie Mae Selling Guide B3-6-02: Debt-to-Income Ratios', url: 'https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios' },
    { name: 'HUD: FHA Single Family Housing Policy Handbook 4000.1', url: 'https://www.hud.gov/program_offices/housing/sfh/handbook_4000-1' },
    { name: 'VA: Home Loans', url: 'https://www.benefits.va.gov/homeloans/' }
  ]
};
