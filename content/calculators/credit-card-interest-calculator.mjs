export default {
  slug: 'credit-card-interest-calculator',
  hub: 'loans',
  name: 'Credit Card Interest Calculator',
  title: 'Credit Card Interest Calculator: 24% APR on $1,228 = $24.23',
  h1: 'Credit Card Interest Calculator Using the Average Daily Balance Method',
  meta: 'A $1,228.33 average daily balance at 24% APR over a 30-day cycle costs $24.23 in interest. Enter your purchases and payments by day to check your statement.',
  keyword: 'how to calculate average daily balance',
  also: ['how do you calculate apr on a credit card', 'how to calculate my credit card interest', 'how to calculate apr monthly', 'how to calculate monthly apr interest', 'credit card interest calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'start', label: 'Balance at the start of the cycle', type: 'number', value: 1200, prefix: '$', help: 'The previous statement balance you carried over.' },
    { id: 'apr', label: 'Purchase APR', type: 'number', value: 24, suffix: '%' },
    { id: 'days', label: 'Days in billing cycle', type: 'number', value: 30, suffix: 'days' },
    { id: 'basis', label: 'Daily rate = APR ÷', type: 'select', value: '365', options: [['365', '365 (most issuers)'], ['360', '360']] },
    {
      id: 'tx', label: 'Purchases and payments this cycle', type: 'rows', addLabel: '+ add transaction', max: 40, wide: true,
      fields: [
        { id: 'day', label: 'Day of cycle', type: 'number', value: 1 },
        { id: 'kind', label: 'Type', type: 'select', value: 'p', options: [['p', 'Purchase / fee'], ['c', 'Payment / credit']] },
        { id: 'amount', label: 'Amount ($)', type: 'number', value: 0 }
      ],
      value: [
        { day: 6, kind: 'p', amount: 300 },
        { day: 15, kind: 'c', amount: 500 },
        { day: 22, kind: 'p', amount: 150 }
      ]
    }
  ],
  compute(v, H) {
    var days = Math.round(v.days);
    if (!(days >= 1 && days <= 62)) return { error: 'Enter a billing cycle between 1 and 62 days.' };
    if (!(v.apr >= 0) || v.apr > 100) return { error: 'Enter the card\'s APR.' };
    var start = v.start > 0 ? v.start : 0;
    var basis = v.basis === '360' ? 360 : 365;
    var dpr = v.apr / 100 / basis;
    var chg = []; for (var i = 0; i <= days; i++) chg.push(0);
    var net = 0, nTx = 0;
    (v.tx || []).forEach(function (t) {
      if (!(t.amount > 0) || !(t.day >= 1)) return;
      var d = Math.min(days, Math.max(1, Math.round(t.day)));
      var amt = t.kind === 'c' ? -t.amount : t.amount;
      chg[d] += amt; net += amt; nTx++;
    });
    var bal = start, sum = 0, comp = 0, accr = 0, lo = Infinity, hi = -Infinity;
    for (var d = 1; d <= days; d++) {
      bal += chg[d];
      var b = Math.max(0, bal);
      sum += b;
      lo = Math.min(lo, b); hi = Math.max(hi, b);
      accr += (b + comp) * dpr;
      comp = accr;
    }
    if (!(sum > 0)) return { error: 'Enter a starting balance or at least one purchase.' };
    var adb = sum / days;
    var interest = adb * dpr * days;
    return {
      value: H.money(interest),
      label: 'Interest charge this cycle',
      expr: H.money(adb) + ' × ' + H.fix(dpr * 100, 5) + '% × ' + days + ' days',
      rows: [
        ['Average daily balance', H.money(adb), true],
        ['Daily periodic rate (APR ÷ ' + basis + ')', H.fix(dpr * 100, 5) + '%'],
        ['Monthly periodic rate (APR ÷ 12)', H.pct(v.apr / 12, 3)],
        ['With daily compounding', H.money(comp)],
        ['Lowest / highest daily balance', H.money(lo) + ' / ' + H.money(hi)],
        ['New balance (incl. interest)', H.money(Math.max(0, start + net) + interest)]
      ],
      sub: nTx ? 'Every day a purchase sits on the card, or a payment has not yet posted, adds to the average.' : 'With no activity, the average daily balance equals the carried balance.'
    };
  },
  quick: ({ r }) => `To calculate the average daily balance, add up the card's balance at the end of each day in the billing cycle and divide by the number of days. Carry $1,200, buy $300 on day 6, pay $500 on day 15 and spend $150 on day 22, and the 30-day total is $36,850, an average of <strong>$1,228.33</strong>. At 24% APR the interest is <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate credit card interest by hand',
  steps: [
    'Write down the balance at the start of the cycle and every date a purchase, fee, payment or credit posted. Use the <em>posting</em> date, not the day you swiped or sent the payment.',
    'For each stretch between transactions, multiply that balance by the number of days it lasted. 5 days at $1,200 = $6,000.',
    'Add the stretches together and divide by the days in the cycle to get the average daily balance.',
    'Find the daily periodic rate: APR ÷ 365 (a few issuers use 360). 24% ÷ 365 = 0.06575%.',
    'Multiply the average daily balance by the daily rate and by the number of days in the cycle. That is the interest charge on your statement, give or take a few cents for daily compounding.'
  ],
  formulaTitle: 'What is the average daily balance formula?',
  formula: {
    expr: 'ADB = (Σ end-of-day balances) ÷ days in cycle<br>Interest = ADB × (APR ÷ 365) × days in cycle',
    vars: [['ADB', 'average daily balance'], ['APR ÷ 365', 'daily periodic rate'], ['days', 'length of the billing cycle, usually 28–31']],
    note: 'Many issuers add each day\'s interest to the balance, so interest compounds daily; the "with daily compounding" row shows that version. Separate balances (purchases, cash advances, promotional transfers) each get their own average and rate.'
  },
  example: `<p>Cycle of 30 days, $1,200 carried in, 24% APR.</p>
<ul>
<li>Days 1–5: $1,200 × 5 = $6,000</li>
<li>Days 6–14 (after a $300 purchase): $1,500 × 9 = $13,500</li>
<li>Days 15–21 (after a $500 payment): $1,000 × 7 = $7,000</li>
<li>Days 22–30 (after a $150 purchase): $1,150 × 9 = $10,350</li>
</ul>
<p>Sum = $36,850. ADB = 36,850 ÷ 30 = <strong>$1,228.33</strong>.</p>
<p>Daily rate = 0.24 ÷ 365 = 0.00065753. Interest = 1,228.33 × 0.00065753 × 30 = <strong>$24.23</strong>.</p>`,
  table: {
    title: 'How much interest does a credit card charge per month?',
    intro: 'Interest for one 30-day cycle at a steady average daily balance, by APR (daily rate = APR ÷ 365).',
    head: ['Average daily balance', '18% APR', '21% APR', '24% APR', '27% APR', '30% APR'],
    rows: ({ run, H }) => [250, 500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000].map(b => [H.money0(b), ...[18, 21, 24, 27, 30].map(a => run({ start: b, apr: a, days: 30, basis: '365', tx: [] }).value)]),
    note: 'For reference, the Federal Reserve\'s G.19 release put the average APR on card accounts that were charged interest at 22.36% in the third quarter of 2026.'
  },
  sections: [
    {
      h2: 'How do you calculate the APR on a credit card per month?',
      html: `<p>Divide the APR by 12 for the monthly periodic rate, or by 365 for the daily rate the issuer actually uses. A 24% card charges 2% a month or 0.06575% a day. Statements list the APR; some also show the daily periodic rate next to each balance type.</p>
<p>The monthly shortcut and the daily method give nearly the same answer for a 30-day cycle: $1,000 × 2% = $20.00 versus $1,000 × 0.06575% × 30 = $19.73. In a 31-day cycle the daily method charges $20.38. If you want the yearly cost after compounding, convert the APR with the <a href="/apy-calculator">APY calculator</a>: 24% compounded daily is about 27.1% a year.</p>`
    },
    {
      h2: 'Why was I charged interest after I paid my bill?',
      html: `<p>Usually because you lost the <strong>grace period</strong>. The CFPB explains that if you carry any balance past the due date, the card starts charging interest on new purchases from the day you make them, and you only get the grace period back after paying in full (often for one or two cycles in a row). Interest also builds between the statement date and the day your payment posts, which can show up as a small "residual" charge on the next bill even after you pay the full statement balance.</p>
<p>Cash advances and convenience checks normally have no grace period at all, and they often carry a higher APR.</p>`
    },
    {
      h2: 'How can I lower the interest on my credit card bill?',
      html: `<p>Because interest follows the average daily balance, <em>when</em> you pay matters, not just how much. In the example, moving the $500 payment from day 15 to day 2 lowers the average balance by $216.67 and the interest by $4.27 that month. Paying as soon as you are paid, or splitting the payment in two, keeps the average lower.</p>
<p>The bigger levers are paying more than the minimum, asking the issuer for a lower APR, or moving the balance to a lower-rate card or loan. To see how long your balance will take to clear at the minimum, use the <a href="/credit-card-minimum-payment-calculator">credit card minimum payment calculator</a>.</p>`
    },
    {
      h2: 'Is the average daily balance method the same at every card?',
      html: `<p>Almost every major U.S. issuer uses an average daily balance, but the details vary: whether new purchases are included, whether interest compounds daily, whether the daily rate uses 365 or 360, and how each balance type is averaged. Your card's terms list the method under "How we calculate your balance." The Credit CARD Act of 2009 banned "double-cycle" billing, so issuers can no longer charge interest on balances from days in the previous cycle that you already paid.</p>`
    }
  ],
  faq: [
    { q: 'How much interest is charged on a $1,000 credit card balance?', a: 'About $19.73 for a 30-day cycle at 24% APR, or $14.79 at 18%. Interest is roughly the balance × APR ÷ 365 × days in the cycle.' },
    { q: 'What is a daily periodic rate?', a: 'The APR divided by 365 (or 360 at some issuers). It is the rate applied to each day\'s balance. A 24% APR has a daily periodic rate of about 0.0658%.' },
    { q: 'Do payments count on the day I send them?', a: 'No, they count on the day they post to your account. Cards must credit a payment received by 5 p.m. on the due date as on time, but for the average daily balance it is the posting date that matters.' },
    { q: 'Does paying in the middle of the cycle reduce interest?', a: 'Yes. A payment cuts the balance for every remaining day in the cycle, so paying $500 on day 2 instead of day 15 removes 13 extra days of that $500 from the average.' },
    { q: 'Is there interest if I pay the full statement balance every month?', a: 'Not on purchases, if your card has a grace period. You keep the grace period as long as you pay the full statement balance by the due date.' },
    { q: 'Why does my statement interest differ from this calculator by a few cents?', a: 'Issuers may compound daily, round each day, use 360 instead of 365 or apply different rates to different balance types. Use the daily-compounding row for the closest match.' }
  ],
  related: ['credit-card-minimum-payment-calculator', 'apr-calculator', 'apy-calculator', 'simple-interest-calculator'],
  sources: [
    { name: 'CFPB: How does my credit card company calculate the interest I owe?', url: 'https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/' },
    { name: 'CFPB: What is a daily periodic rate on a credit card?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-daily-periodic-rate-on-a-credit-card-en-46/' },
    { name: 'CFPB: What is a grace period for a credit card?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/' },
    { name: 'Federal Reserve: G.19 Consumer Credit (credit card plan interest rates)', url: 'https://www.federalreserve.gov/releases/g19/current/default.htm' }
  ]
};
