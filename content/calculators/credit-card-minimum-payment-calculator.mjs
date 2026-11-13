export default {
  slug: 'credit-card-minimum-payment-calculator',
  hub: 'loans',
  name: 'Credit Card Minimum Payment Calculator',
  title: 'Minimum Payment Calculator: $5,000 at 22% Is $141.67 to Start',
  h1: 'Credit Card Minimum Payment Calculator: Your Minimum and How Long It Takes',
  meta: 'On a $5,000 card balance at 22% APR, 1% plus interest makes the minimum $141.67. Paying only that takes over 19 years. See your minimum and the 36-month payoff.',
  keyword: 'how is minimum payment calculated',
  also: ['how do credit cards calculate minimum payment', 'credit card minimum payment calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'balance', label: 'Card balance', type: 'number', value: 5000, prefix: '$' },
    { id: 'apr', label: 'Purchase APR', type: 'number', value: 22, suffix: '%' },
    { id: 'method', label: 'How your issuer sets the minimum', type: 'select', value: 'int', options: [['int', '1% of balance + interest'], ['pct', 'Flat % of balance']], help: 'Your cardmember agreement states the formula.' },
    { id: 'pct', label: 'Percent of balance', type: 'number', value: 2, suffix: '%', showIf: { method: ['pct'] } },
    { id: 'floor', label: 'Minimum payment floor', type: 'number', value: 25, prefix: '$', help: 'Most cards require at least $25–$40, or the full balance if it is smaller.' }
  ],
  compute(v, H) {
    if (!(v.balance > 0)) return { error: 'Enter your card balance.' };
    if (!(v.apr >= 0) || v.apr > 80) return { error: 'Enter the card\'s APR.' };
    if (v.method === 'pct' && !(v.pct > 0 && v.pct <= 100)) return { error: 'Enter the percent of the balance your issuer requires.' };
    var r = v.apr / 1200;
    var floor = v.floor > 0 ? v.floor : 0;
    function minFor(bal, it) {
      var m = v.method === 'pct' ? (bal + it) * v.pct / 100 : bal * 0.01 + it;
      m = Math.max(Math.round(m * 100) / 100, floor);
      return Math.min(m, bal + it);
    }
    var it0 = Math.round(v.balance * r * 100) / 100;
    var min0 = minFor(v.balance, it0);
    if (v.method === 'pct' && min0 <= it0 && floor <= it0) return { error: 'A ' + H.num(v.pct, 2) + '% minimum does not cover the monthly interest at this APR, so the balance would never fall. Try a higher percent or the 1% + interest method.' };
    function run(fixed) {
      var bal = v.balance, k = 0, tot = 0;
      while (bal > 0.005 && k < 1200) {
        k++;
        var it = Math.round(bal * r * 100) / 100;
        var p = fixed ? Math.min(fixed, bal + it) : minFor(bal, it);
        if (p <= it && p < bal + it) return { n: Infinity, interest: Infinity };
        bal = Math.round((bal + it - p) * 100) / 100; tot += it;
      }
      return { n: k, interest: tot };
    }
    var a = run(0);
    var f = run(min0);
    var p36 = Math.ceil(H.pmt(r, 36, v.balance) * 100) / 100;
    var c36 = run(p36);
    var rows = [
      ['Interest charged this month', H.money(it0)],
      ['Paying only the minimum', a.n === Infinity ? 'never' : H.ym(a.n), true],
      ['Total interest at the minimum', a.n === Infinity ? '—' : H.money(a.interest)],
      ['Keep paying ' + H.money(min0) + ' every month', H.ym(f.n) + ' · ' + H.money(f.interest) + ' interest'],
      ['Payment to clear it in 36 months', H.money(p36) + ' · ' + H.money(c36.interest) + ' interest']
    ];
    return {
      value: H.money(min0),
      label: 'This month\'s minimum payment',
      expr: v.method === 'pct' ? H.num(v.pct, 2) + '% × ' + H.money(v.balance + it0) : '1% × ' + H.money0(v.balance) + ' + ' + H.money(it0) + ' interest',
      rows: rows,
      sub: a.n === Infinity ? 'At this setting the minimum never pays the card off.' : 'Because the minimum shrinks as the balance shrinks, paying only the minimum stretches the debt out far longer than a fixed payment does.'
    };
  },
  quick: ({ r }) => `Most U.S. card issuers set the minimum payment at <strong>1% of the balance plus that month's interest</strong> and fees, or a flat 2–3% of the balance, with a floor around $25–$40. On a $5,000 balance at 22% APR that is $50 + $91.67 = <strong>${r.value}</strong>. Paying only the shrinking minimum takes 19 years 2 months and about $8,100 in interest.`,
  stepsTitle: 'How to work out your credit card minimum payment',
  steps: [
    'Find your statement balance and purchase APR on your latest bill.',
    'Check your cardmember agreement for the minimum payment formula. The most common is 1% of the balance plus interest and fees; some cards use a flat percentage such as 2% or 3%.',
    'Enter the floor (often $25, $35 or $40). If the formula gives less than the floor, you owe the floor, or the whole balance if it is smaller.',
    'Compare the three payoff paths in the result: the declining minimum, a fixed payment equal to today\'s minimum, and the 36-month payment printed on your statement. Most people underestimate how much the declining minimum costs.'
  ],
  formulaTitle: 'What formulas do card issuers use for the minimum payment?',
  formula: {
    expr: '1% method: Minimum = 1% × Balance + Interest + Fees<br>Percent method: Minimum = p% × Statement balance<br>Monthly interest ≈ Balance × APR ÷ 12; then Minimum = max(result, floor)',
    vars: [['Balance', 'statement balance'], ['Interest', 'finance charge for the cycle'], ['p%', 'flat percentage in your card agreement, typically 2–3%'], ['floor', 'fixed dollar minimum, often $25–$40']],
    note: 'Past-due amounts and any amount over your credit limit are usually added on top. Issuers charge interest daily on the average daily balance; the monthly APR ÷ 12 approximation used here is within a few cents for a steady balance.'
  },
  example: `<p>A $5,000 balance at 22% APR, minimum = 1% + interest, $25 floor.</p>
<p>Interest for the month: 5,000 × 0.22 ÷ 12 = <strong>$91.67</strong>. 1% of the balance: <strong>$50.00</strong>. Minimum = <strong>$141.67</strong>.</p>
<p>Next month the balance is $4,950, so the minimum falls to $49.50 + $90.75 = $140.25. Because the balance only falls by 1% a month, it takes about 14½ years to reach roughly $880, where the $25 floor takes over, and almost five more years to finish.</p>
<p>If you kept paying $141.67 every month instead, the card would be clear in 4 years 10 months with about $3,121 of interest.</p>`,
  table: {
    title: 'How long does paying the minimum take on different balances?',
    intro: 'Minimum payment (1% + interest, $25 floor), time and total interest if you pay only the minimum, versus the 36-month payment, all at 22% APR.',
    head: ['Balance', 'First minimum', 'Time at minimum', 'Interest at minimum', '36-month payment', 'Interest in 36 months'],
    rows: ({ run, H }) => [500, 1000, 2500, 5000, 7500, 10000, 15000, 20000].map(b => {
      const x = run({ balance: b, apr: 22, method: 'int', floor: 25 });
      const p = x.rows[4][1].split(' · ');
      return [H.money0(b), x.value, x.rows[1][1], x.rows[2][1], p[0], p[1].replace(' interest', '')];
    }),
    note: 'Assumes no new purchases, fees or rate changes. Your statement\'s minimum payment warning uses your issuer\'s exact formula, so its figures may differ slightly.'
  },
  sections: [
    {
      h2: 'How do credit card companies calculate the minimum payment?',
      html: `<p>Each issuer sets its own formula in the cardmember agreement, but most fall into two groups:</p>
<ul>
<li><strong>1% of the balance plus interest and fees.</strong> Used by many of the largest U.S. banks. It guarantees the balance falls by at least 1% a month, because the interest is always covered.</li>
<li><strong>A flat percentage of the balance</strong>, commonly 2% or 3%. At high APRs a 2% minimum barely covers the interest: at 22% the monthly interest alone is about 1.83% of the balance.</li>
</ul>
<p>Either way there is a dollar floor, and if your balance is below it you pay the full balance. Any past-due amount and any amount above your credit limit is usually added to the minimum.</p>`
    },
    {
      h2: 'How long does it take to pay off a credit card with minimum payments?',
      html: `<p>Far longer than most people expect, because the minimum shrinks every time the balance does. On $5,000 at 22% the minimum starts at $141.67, but after five years of paying it you still owe about $2,740 and the minimum has fallen to around $77. The full payoff takes <strong>19 years 2 months</strong> and costs about $8,100 in interest, far more than the original balance.</p>
<p>The fix is simple: pick a fixed payment and stick to it even as the required minimum drops. Holding the payment at $141.67 clears the same card in under five years. To see how interest is charged within a single billing cycle, use the <a href="/credit-card-interest-calculator">credit card interest calculator</a>.</p>`
    },
    {
      h2: 'What does the minimum payment warning on my statement mean?',
      html: `<p>Since the Credit CARD Act of 2009, Regulation Z requires most card statements to include a box that shows how long it would take to pay off your current balance by paying only the minimum, the total you would pay that way, and the monthly payment that would clear it in 36 months along with that total. The CFPB explains that these figures assume no new purchases.</p>
<p>The 36-month figure is a useful target. In the example it is about <strong>$191 a month</strong>, which saves more than $6,200 of interest compared with paying the minimum. If you add new charges, the 36-month payment will not clear the card on time.</p>`
    },
    {
      h2: 'Where does money above the minimum go?',
      html: `<p>When a card carries balances at different rates (purchases, a cash advance, an expired promotional rate), federal rules generally require the issuer to apply any amount above the minimum to the highest-rate balance first. The issuer may apply the minimum itself however it chooses, often to the lowest-rate balance. Paying more than the minimum is therefore the only way to steer money toward the most expensive debt.</p>
<p>Missing the minimum is costly: you can be charged a late fee right away, and if a payment is more than 60 days late the issuer may apply a penalty APR to your existing balance.</p>`
    }
  ],
  faq: [
    { q: 'What is the minimum payment on a $1,000 credit card balance?', a: 'Usually $25 to $40. With 1% + interest at 22% APR the formula gives $28.33, which is above a $25 floor. A 2% card would ask for $20.37 and round up to its floor.' },
    { q: 'What is the minimum payment on $10,000?', a: 'About $283 with the 1% + interest method at 22% APR ($100 + $183.33 interest). A 3% card would ask for about $305.50.' },
    { q: 'Does paying the minimum hurt my credit score?', a: 'No, paying at least the minimum on time keeps your account current. But carrying a high balance raises your credit utilization, which can lower your score, and you pay much more interest.' },
    { q: 'Is it better to pay the minimum or the statement balance?', a: 'Pay the full statement balance if you can. If your card has a grace period, that avoids all interest on new purchases. Paying only the minimum keeps you paying interest every month.' },
    { q: 'Why did my minimum payment go up?', a: 'Common reasons are a higher balance, a rate increase, a past-due amount added on, a fee, or going over your credit limit. Promotional rates ending can also raise the interest part of the 1% + interest formula.' },
    { q: 'Can my card issuer change the minimum payment formula?', a: 'Yes, by changing the account terms. For significant changes, issuers generally must give 45 days\' advance notice.' }
  ],
  related: ['credit-card-interest-calculator', 'loan-payoff-calculator', 'apr-calculator', 'apy-calculator', 'dti-calculator'],
  sources: [
    { name: 'CFPB: The 36-month payoff box on your credit card bill', url: 'https://www.consumerfinance.gov/ask-cfpb/a-box-on-my-credit-card-bill-says-that-i-will-pay-off-the-balance-in-three-years-if-i-pay-a-certain-amount-what-does-that-mean-do-i-have-to-pay-that-much-if-i-pay-that-much-and-make-new-purchases-will-i-still-owe-nothing-after-three-years-en-36/' },
    { name: 'CFPB: Regulation Z §1026.7 (periodic statement and minimum payment disclosures)', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/7/' },
    { name: 'CFPB: How does my credit card company calculate the interest I owe?', url: 'https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/' },
    { name: 'Federal Reserve: G.19 Consumer Credit (credit card interest rates)', url: 'https://www.federalreserve.gov/releases/g19/current/default.htm' }
  ]
};
