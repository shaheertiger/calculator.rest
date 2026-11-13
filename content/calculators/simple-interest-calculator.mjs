export default {
  slug: 'simple-interest-calculator',
  hub: 'loans',
  name: 'Simple Interest Calculator',
  title: 'Simple Interest Calculator: $10,000 at 6% for 2 Years = $1,200',
  h1: 'Simple Interest Calculator: I = P × r × t by Days, Months or Years',
  meta: 'Simple interest on $10,000 at 6% for 2 years is $1,200: $50 a month or $1.64 a day. Works in days, months or years, with the 365 or 360-day basis.',
  keyword: 'how to calculate interest payment',
  also: ['simple interest calculator', 'what is 365 360 interest calculation', 'how to calculate monthly interest amount', 'how do you calculate prejudgment interest', 'how are interest rates calculated'],
  updated: '2026-11-13',
  inputs: [
    { id: 'principal', label: 'Principal', type: 'number', value: 10000, prefix: '$' },
    { id: 'rate', label: 'Annual interest rate', type: 'number', value: 6, suffix: '%' },
    { id: 'time', label: 'Time', type: 'number', value: 2 },
    { id: 'unit', label: 'Time is in', type: 'select', value: 'years', options: [['years', 'Years'], ['months', 'Months'], ['days', 'Days']] },
    { id: 'basis', label: 'Day-count basis', type: 'select', value: '365', options: [['365', 'Actual/365 (consumer standard)'], ['360', 'Actual/360 ("365/360" bank method)']], help: 'Used for daily interest and for terms entered in days.' }
  ],
  compute(v, H) {
    if (!(v.principal > 0)) return { error: 'Enter the principal (the amount borrowed or deposited).' };
    if (!(v.rate >= 0)) return { error: 'Enter an annual interest rate.' };
    if (!(v.time > 0)) return { error: 'Enter how long the money is borrowed or invested.' };
    var basis = v.basis === '360' ? 360 : 365;
    var years = v.unit === 'days' ? v.time / basis : v.unit === 'months' ? v.time / 12 : v.time;
    var r = v.rate / 100;
    var interest = v.principal * r * years;
    var daily = v.principal * r / basis;
    var tLabel = v.unit === 'days' ? H.num(v.time, 0) + '/' + basis : v.unit === 'months' ? H.num(v.time, 2) + '/12' : H.num(v.time, 4);
    var rows = [
      ['Principal + interest', H.money(v.principal + interest), true],
      ['Interest per year', H.money(v.principal * r)],
      ['Interest per month', H.money(v.principal * r / 12)],
      ['Interest per day (' + basis + '-day year)', H.money(daily)],
      ['Time in years', H.num(years, 4)]
    ];
    if (basis === 360) rows.push(['Effective cost over a 365-day year', H.pct(v.rate * 365 / 360, 3)]);
    return {
      value: H.money(interest),
      label: 'Simple interest',
      expr: H.money0(v.principal) + ' × ' + H.num(v.rate, 4) + '% × ' + tLabel,
      rows: rows,
      sub: 'Simple interest is figured on the original principal only; interest does not earn interest.'
    };
  },
  quick: ({ r }) => `To calculate an interest payment, multiply principal × annual rate × time in years. <strong>$10,000</strong> at 6% simple interest for 2 years is 10,000 × 0.06 × 2 = <strong>${r.value}</strong>, so you repay $11,200. That is $600 a year, <strong>$50 a month</strong> or about $1.64 a day on a 365-day basis ($1.67 using a 360-day year).`,
  stepsTitle: 'How to calculate simple interest',
  steps: [
    'Enter the principal: the amount borrowed, deposited or owed.',
    'Enter the annual rate as a percentage. The calculator converts 6% to 0.06 for you; forgetting that conversion is the most common hand-calculation mistake.',
    'Enter the time and choose years, months or days. Months are divided by 12; days are divided by 365 or 360.',
    'For a day count, pick the basis your contract uses. Consumer loans and court judgments usually use 365; many commercial loans use the 360-day "365/360" method.'
  ],
  formulaTitle: 'What is the simple interest formula?',
  formula: {
    expr: 'I = P × r × t<br>A = P × (1 + r × t)<br>Daily interest = P × r ÷ 365 (or 360)',
    vars: [['I', 'interest in dollars'], ['P', 'principal'], ['r', 'annual rate as a decimal (6% → 0.06)'], ['t', 'time in years (months ÷ 12, days ÷ 365 or 360)'], ['A', 'total amount owed or accumulated']],
    note: 'Rearranged, the same formula gives the rate (r = I ÷ (P × t)), the time (t = I ÷ (P × r)) or the principal (P = I ÷ (r × t)).'
  },
  example: `<p>A 90-day $25,000 business note at 8% under each day-count basis:</p>
<p>Actual/365: 25,000 × 0.08 × 90 ÷ 365 = <strong>$493.15</strong>.</p>
<p>Actual/360: 25,000 × 0.08 × 90 ÷ 360 = <strong>$500.00</strong>.</p>
<p>The 360-day method costs $6.85 more for the same quoted rate because each day carries 1/360 of a year's interest instead of 1/365.</p>`,
  table: {
    title: 'How much more interest does the 365/360 method charge?',
    intro: 'Simple interest on $10,000 at 6% for common periods, with the actual/365 and actual/360 bases side by side.',
    head: ['Days', 'Actual/365', 'Actual/360', 'Extra with 360'],
    rows: ({ run, H }) => [7, 30, 45, 60, 90, 120, 180, 270, 365].map(d => {
      const a = run({ principal: 10000, rate: 6, time: d, unit: 'days', basis: '365' });
      const b = run({ principal: 10000, rate: 6, time: d, unit: 'days', basis: '360' });
      const x = parseFloat(b.value.replace(/[$,]/g, '')) - parseFloat(a.value.replace(/[$,]/g, ''));
      return [String(d), a.value, b.value, H.money(x)];
    }),
    note: 'Over a full year the 360-day basis adds 365/360 − 1 ≈ 1.39% to the interest, so a quoted 6% behaves like 6.083%.'
  },
  sections: [
    {
      h2: 'How do you calculate a monthly interest payment?',
      html: `<p>For an interest-only loan, line of credit or note, multiply the balance by the annual rate and divide by 12: $10,000 × 6% ÷ 12 = <strong>$50 a month</strong>. Lenders that count actual days instead charge the daily amount times the days in the billing period, so a 31-day month costs $50.96 and February costs $46.03 on a 365-day basis.</p>
<p>On an amortizing loan the interest part of each payment falls over time because the balance falls. The first month's interest still follows the same rule (balance × rate ÷ 12), but the payment itself comes from the installment formula in the <a href="/loan-calculator">loan payment calculator</a>.</p>`
    },
    {
      h2: 'What is the 365/360 interest calculation?',
      html: `<p>It is a day-count convention in which the annual rate is divided by 360 to get a daily rate, and that daily rate is charged for every actual day (365 in a normal year). The result is slightly more interest than the quoted rate implies: on a $500,000 commercial loan at 7%, a year of interest is $35,000 on an actual/365 basis but $35,486.11 using 365/360.</p>
<p>The method dates back to hand-calculated bank ledgers, where a 360-day year made division easier. It remains common on commercial real estate and business loans and in money markets. Consumer installment loans, credit cards and most court-ordered interest generally use 365 (or 366 in a leap year), though card issuers may use either. Read the note's interest clause: it will say "on the basis of a 360-day year and the actual number of days elapsed" if 365/360 applies.</p>`
    },
    {
      h2: 'What is the difference between simple and compound interest?',
      html: `<p>Simple interest is charged only on the original principal. Compound interest is charged on the principal plus interest already added. Over short periods the gap is small; over long ones it is large. $10,000 at 6% for 10 years earns $6,000 of simple interest, but $8,193.97 if compounded monthly. For savings growth, use the <a href="/compound-interest-calculator">compound interest calculator</a>; to convert a nominal rate to its compounded yearly equivalent, see the <a href="/apy-calculator">APY calculator</a>.</p>
<p>Many car loans and personal loans are called "simple interest" loans because interest is never charged on unpaid interest. They still amortize: each payment covers the interest accrued since the last one and the rest reduces principal.</p>`
    },
    {
      h2: 'How is prejudgment or statutory interest calculated?',
      html: `<p>Most prejudgment and post-judgment interest in the U.S. is simple interest at a rate set by statute or court rule. Multiply the amount awarded by the statutory rate and by the days elapsed ÷ 365. A $40,000 award at a 9% statutory rate for 500 days accrues 40,000 × 0.09 × 500 ÷ 365 = <strong>$4,931.51</strong>.</p>
<p>Rates and start dates differ by state and by the type of claim, and federal post-judgment interest is tied to the weekly 1-year Treasury yield and compounded annually under 28 U.S.C. 1961. Check the governing statute before relying on a figure.</p>`
    }
  ],
  faq: [
    { q: 'How much interest is $10,000 at 5% for one year?', a: '$500 of simple interest: 10,000 × 0.05 × 1. That is about $41.67 a month or $1.37 a day.' },
    { q: 'How do I calculate simple interest for months?', a: 'Divide the months by 12 to get years, then use I = P × r × t. For $5,000 at 8% for 9 months: 5,000 × 0.08 × 9 ÷ 12 = $300.' },
    { q: 'How do I calculate interest for a number of days?', a: 'Multiply principal × rate × days ÷ 365. For $10,000 at 6% for 45 days: 10,000 × 0.06 × 45 ÷ 365 = $73.97. On a 360-day basis it is $75.00.' },
    { q: 'What is the daily interest on $100,000 at 7%?', a: '$19.18 a day on a 365-day basis (100,000 × 0.07 ÷ 365), or $19.44 a day if the lender divides by 360.' },
    { q: 'How do I find the interest rate from the interest paid?', a: 'Divide the interest by the principal times the years: r = I ÷ (P × t). If $8,000 earned $480 in 18 months, r = 480 ÷ (8,000 × 1.5) = 4%.' },
    { q: 'Is simple interest better than compound interest?', a: 'For a borrower, yes: interest never builds on interest, so the total cost is lower at the same quoted rate. For a saver, compound interest earns more.' },
    { q: 'Do banks use simple interest?', a: 'Banks use simple daily interest on many loans, including most auto and personal loans and lines of credit. Savings accounts and CDs usually compound, and they quote the result as an APY.' }
  ],
  related: ['loan-calculator', 'apy-calculator', 'credit-card-interest-calculator', 'compound-interest-calculator', 'cd-calculator'],
  sources: [
    { name: 'CFPB: Simple interest vs precomputed interest on a loan', url: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/' },
    { name: 'CFPB: What is a daily periodic rate (APR ÷ 360 or 365)?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-daily-periodic-rate-on-a-credit-card-en-46/' },
    { name: '28 U.S.C. 1961: Interest on federal court judgments', url: 'https://www.law.cornell.edu/uscode/text/28/1961' }
  ]
};
