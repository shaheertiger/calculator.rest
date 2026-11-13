export default {
  slug: 'heloc-payment-calculator',
  hub: 'mortgage',
  name: 'HELOC Payment Calculator',
  title: 'HELOC Payment Calculator: $50,000 at 8.5% Is $354.17/Month',
  h1: 'HELOC Payment Calculator for the Draw and Repayment Periods',
  meta: 'A $50,000 HELOC balance at 8.5% costs $354.17 a month interest-only, rising to $433.91 when the 20-year repayment period starts. Check your own line.',
  keyword: 'how to calculate heloc payments',
  also: ['how to calculate interest only payments on a heloc', 'how to calculate heloc interest only payment', 'how to calculate home equity line of credit monthly payment', 'how is a heloc payment calculated'],
  updated: '2026-11-13',
  inputs: [
    { id: 'balance', label: 'Amount drawn (balance owed)', type: 'number', value: 50000, prefix: '$' },
    { id: 'rate', label: 'HELOC interest rate (APR)', type: 'number', value: 8.5, suffix: '%' },
    { id: 'draw', label: 'Draw period remaining', type: 'number', value: 10, suffix: 'years' },
    { id: 'repay', label: 'Repayment period', type: 'number', value: 20, suffix: 'years' },
    { id: 'extra', label: 'Extra principal during the draw', type: 'number', value: 0, prefix: '$', suffix: '/ mo' }
  ],
  compute(v, H) {
    if (!(v.balance > 0)) return { error: 'Enter the amount you have drawn.' };
    if (!(v.rate >= 0 && v.rate < 40)) return { error: 'Enter an interest rate between 0% and 40%.' };
    if (!(v.repay > 0 && v.repay <= 40)) return { error: 'Enter the repayment period in years.' };
    var r = v.rate / 1200, nd = v.draw > 0 ? Math.round(v.draw * 12) : 0, nr = Math.round(v.repay * 12);
    var extra = v.extra > 0 ? v.extra : 0;
    var io = v.balance * r;
    var b = v.balance, drawInt = 0;
    for (var m = 0; m < nd && b > 0.005; m++) { var it = b * r; drawInt += it; b -= Math.min(b, extra); }
    var rp = b > 0.005 ? H.pmt(r, nr, b) : 0;
    var repInt = rp * nr - b;
    var shock = b > 0.005 ? H.pmt(r + 2 / 1200, nr, b) : 0;
    var jump = rp - (io + (extra > 0 ? extra : 0));
    var rows = [
      ['Repayment-period payment', H.money(rp), true],
      ['Increase when the draw ends', (jump >= 0 ? '+' : '−') + H.money(Math.abs(jump)) + (io > 0 ? ' (' + H.pct(jump / (io + extra) * 100, 0) + ')' : '')],
      ['Balance when the draw ends', H.money0(b)],
      ['Interest paid during the draw', H.money0(drawInt)],
      ['Interest paid during repayment', H.money0(repInt)],
      ['Total interest, draw + repayment', H.money0(drawInt + repInt)],
      ['Repayment payment if the rate rises 2 points', H.money(shock)],
      ['Interest for a 31-day billing cycle', H.money(v.balance * v.rate / 100 / 365 * 31)]
    ];
    return {
      value: H.money(io),
      label: 'Interest-only payment during the draw',
      expr: H.money0(v.balance) + ' × ' + H.num(v.rate, 3) + '% ÷ 12',
      rows: rows,
      sub: extra > 0 ? 'Paying ' + H.money0(extra) + ' extra each month during the draw cuts the balance to ' + H.money0(b) + ' before repayment starts.' : 'Interest-only payments leave the full ' + H.money0(v.balance) + ' owed when the draw period ends, so the payment jumps ' + H.money(jump) + ' a month.'
    };
  },
  quick: ({ r }) => `The interest-only payment on a <strong>$50,000</strong> HELOC balance at 8.5% is <strong>${r.value}</strong> a month: $50,000 × 0.085 ÷ 12. When the 10-year draw period ends, the same balance repaid over 20 years costs <strong>${r.rows[0][1]}</strong> a month, ${r.rows[1][1].replace(/^\+/, '')} more, and total interest over the life of the line reaches ${r.rows[5][1]}.`,
  stepsTitle: 'How to calculate a HELOC payment',
  steps: [
    'Enter the amount you have actually drawn, not your credit limit. You pay interest only on the balance you use.',
    'Enter the current variable APR from your statement. It is usually the prime rate plus a fixed margin and changes when prime changes.',
    'Enter the years left in the draw period and the length of the repayment period (10 and 20 years is the most common split).',
    'Add any extra principal you plan to pay while drawing. The step people skip is checking the repayment payment: that is the number that has to fit your budget later.'
  ],
  formulaTitle: 'What is the HELOC payment formula?',
  formula: {
    expr: 'Draw period (interest-only) = balance × APR ÷ 12<br>Repayment period = B × r ÷ (1 − (1 + r)<sup>−n</sup>)',
    vars: [['APR', 'annual percentage rate as a decimal'], ['B', 'balance owed when the draw period ends'], ['r', 'APR ÷ 12'], ['n', 'repayment months (years × 12)']],
    note: 'Many lenders charge interest daily on the average daily balance: balance × APR ÷ 365 × days in the billing cycle. That makes 31-day months slightly more expensive than 30-day months; the result above shows the 31-day figure.'
  },
  example: `<p>Draw period: $50,000 × 0.085 ÷ 12 = <strong>$354.17</strong> a month, the same every month while the rate holds.</p>
<p>Repayment: r = 0.085 ÷ 12 = 0.0070833 and n = 240. $50,000 × 0.0070833 ÷ (1 − 1.0070833<sup>−240</sup>) = <strong>$433.91</strong> a month, $79.74 more.</p>
<p>Daily-interest version for a 31-day cycle: $50,000 × 0.085 ÷ 365 × 31 = $360.96; for a 30-day cycle it is $349.32.</p>`,
  table: {
    title: 'What is the monthly payment on a $25,000, $50,000 or $100,000 HELOC?',
    intro: 'Interest-only and 20-year repayment payments at the default 8.5% APR, computed by the calculator.',
    head: ['Balance drawn', 'Interest-only payment', 'Repayment payment (20 yrs)', 'If the rate rises to 10.5%'],
    rows: ({ run }) => [10000, 25000, 50000, 75000, 100000, 150000, 200000, 250000].map(b => {
      const o = run({ balance: b, extra: 0 });
      return ['$' + b.toLocaleString('en-US'), o.value, o.rows[0][1], o.rows[6][1]];
    }),
    note: 'For a 15-year repayment period the payment is higher: about $492 a month on $50,000 at 8.5%.'
  },
  sections: [
    {
      h2: 'What happens when the HELOC draw period ends?',
      html: `<p>You can no longer borrow, and the payment switches from interest-only to principal plus interest. On the default $50,000 balance that is a 23% jump; on a line where you paid only interest for 10 years, you still owe every dollar you borrowed. Some HELOCs end with a balloon instead, requiring the full balance at the end of the draw, so check your agreement.</p>
<p>Ways to soften it: pay extra principal during the draw (the extra-principal box above shows the effect), use a fixed-rate lock option if your lender offers one, or refinance the balance into a home equity loan or a new mortgage before the draw ends. Read your agreement well before the draw ends so the new payment is not a surprise.</p>`
    },
    {
      h2: 'How much can I borrow with a HELOC?',
      html: `<p>Most lenders cap the combined loan-to-value (CLTV), all mortgages plus the full HELOC limit divided by the home's value, at 80% to 85%, and a few go to 90% for strong credit. On a $400,000 home with a $250,000 first mortgage, an 85% cap allows $400,000 × 0.85 − $250,000 = <strong>$90,000</strong> of credit line. Lenders also check your debt-to-income ratio using the HELOC payment, often the fully amortizing one.</p>
<p>Run your own equity numbers in the <a href="/ltv-calculator">LTV and CLTV calculator</a>.</p>`
    },
    {
      h2: 'Why did my HELOC payment go up?',
      html: `<p>Almost always because the rate changed. HELOC APRs are variable, typically the prime rate published in the Wall Street Journal plus a margin set when you opened the line. When the Federal Reserve raises or lowers its target, banks move prime by the same amount and your rate follows on the next adjustment date, usually within a billing cycle. A 0.25-point rise adds $10.42 a month on $50,000 interest-only.</p>
<p>Other causes are a larger balance from new draws, a billing cycle with more days, or the end of an introductory rate. Your agreement must state the index, the margin, how often the rate can change and any lifetime cap; federal rules require a lifetime cap on variable-rate HELOCs.</p>`
    },
    {
      h2: 'HELOC or home equity loan: which costs less?',
      html: `<p>A home equity loan gives you a lump sum at a fixed rate with level payments from day one, so there is no payment shock but you pay interest on all of it immediately. A HELOC is cheaper while you draw only part of the line and pay interest-only, and riskier if rates rise. If you need a known amount for a single project, the fixed loan is simpler to budget; for staged expenses like a renovation paid over months, the line usually costs less. Compare both against a cash-out <a href="/refinance-calculator">refinance</a> if your first-mortgage rate is close to today's.</p>`
    }
  ],
  faq: [
    { q: 'What is the monthly payment on a $100,000 HELOC?', a: 'At 8.5%, interest-only payments on $100,000 are $708.33 a month. Repaid over 20 years the payment is $867.82, and over 15 years about $984.74.' },
    { q: 'How do you calculate interest-only payments on a HELOC?', a: 'Multiply the balance by the APR and divide by 12. $50,000 × 8.5% = $4,250 a year, ÷ 12 = $354.17 a month. Lenders that charge daily interest use balance × APR ÷ 365 × days in the cycle.' },
    { q: 'Is HELOC interest tax deductible?', a: 'Only if you itemize and the money is used to buy, build or substantially improve the home that secures the line, within the $750,000 total mortgage debt limit. Interest on HELOC money used for cars, tuition or debt consolidation is not deductible.' },
    { q: 'Can I pay off a HELOC early?', a: 'Yes, at any time. Some lenders charge an early closure fee, often a few hundred dollars, if you close the line within the first two or three years, so check your agreement before closing it.' },
    { q: 'Should I pay principal during the draw period?', a: 'If you can, yes. Paying $200 extra a month on a $50,000 balance clears $24,000 over 10 years, saving interest and cutting the repayment payment from $433.91 to $225.63.' },
    { q: 'What is a typical HELOC draw and repayment period?', a: 'A 10-year draw followed by a 20-year repayment period is the most common structure, for a 30-year total. Some lines use 5- or 15-year draws or a balloon payment at the end of the draw.' }
  ],
  related: ['ltv-calculator', 'refinance-calculator', 'mortgage-calculator', 'dti-calculator', 'simple-interest-calculator'],
  sources: [
    { name: 'CFPB: What you should know about home equity lines of credit', url: 'https://files.consumerfinance.gov/f/documents/cfpb_heloc-brochure_print.pdf' },
    { name: 'IRS: Publication 936, Home Mortgage Interest Deduction', url: 'https://www.irs.gov/forms-pubs/about-publication-936' },
    { name: 'Federal Reserve: Selected Interest Rates (H.15), bank prime loan rate', url: 'https://www.federalreserve.gov/releases/h15/' }
  ]
};
