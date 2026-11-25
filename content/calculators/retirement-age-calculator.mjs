export default {
  slug: 'retirement-age-calculator',
  hub: 'planning',
  name: 'When Can I Retire Calculator',
  seoTitle: 'When Can I Retire Calculator 2026: Your Age at 25× Spending',
  meta: 'You can retire when savings hit 25× your yearly need. $40,000 invested plus $1,500/mo at 7% reaches $1.25M (today\'s $) at about 62. Find your retirement age.',
  intro: 'Plug in what you have invested, what you add each month and the income you will need, and we\'ll show you the earliest age your savings can support retirement and what it takes to get there sooner.',
  keyword: 'when do i retire calculator',
  also: ['when can i retire calculator', 'can i retire early calculator', 'retirement age calculator', 'what age can i retire', 'how many years until i can retire'],
  updated: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Current age', type: 'number', value: 30, help: 'Your age today. The result counts forward from here.' },
    { id: 'saved', label: 'Invested for retirement now', type: 'number', value: 40000, prefix: '$', help: 'Total of your 401(k), IRA and brokerage accounts earmarked for retirement.' },
    { id: 'monthly', label: 'Monthly contribution', type: 'number', value: 1500, prefix: '$', help: 'Include any employer match. Assumed to rise with inflation.' },
    { id: 'spend', label: 'Yearly income you need from savings (today\'s $)', type: 'number', value: 50000, prefix: '$', help: 'Spending minus Social Security and pensions.' },
    { id: 'wr', label: 'Withdrawal rate', type: 'number', value: 4, suffix: '%', help: 'Use 4% for a 30-year retirement and 3–3.5% if you plan to stop before 55.' },
    { id: 'ret', label: 'Annual return', type: 'number', value: 7, suffix: '%', help: 'Average yearly growth before inflation; the calculator subtracts inflation for you.' },
    { id: 'infl', label: 'Inflation', type: 'number', value: 3, suffix: '%', help: 'Expected yearly price rise, used to keep every figure in today\'s dollars.' }
  ],
  compute(v, H) {
    if (!(v.age >= 0 && v.age < 100)) return { error: 'Enter your current age.' };
    if (!(v.spend > 0)) return { error: 'Enter the yearly income you will need from savings.' };
    if (!(v.wr > 0) || v.wr > 20) return { error: 'Enter a withdrawal rate between 0 and 20%.' };
    var saved = v.saved > 0 ? v.saved : 0, D = v.monthly > 0 ? v.monthly : 0;
    var ret = isNaN(v.ret) ? 0 : v.ret, inf = isNaN(v.infl) ? 0 : v.infl;
    var target = v.spend / (v.wr / 100);
    var rr = (1 + ret / 100) / (1 + inf / 100) - 1, i = Math.pow(1 + rr, 1 / 12) - 1;
    var maxM = Math.round((100 - v.age) * 12);
    function monthsTo(d) {
      var b = saved, m = 0;
      if (b >= target) return 0;
      while (m < maxM) { b = b * (1 + i) + d; m++; if (b >= target) return m; }
      return Infinity;
    }
    var m = monthsTo(D);
    var at65 = 65 > v.age ? saved * Math.pow(1 + i, (65 - v.age) * 12) + (Math.abs(i) < 1e-12 ? D * (65 - v.age) * 12 : D * (Math.pow(1 + i, (65 - v.age) * 12) - 1) / i) : NaN;
    if (!isFinite(m)) return { value: 'Not before 100', label: 'Earliest retirement age', rows: [['Target nest egg (today\'s $)', H.money0(target), true]], n: Infinity, sub: 'At this rate your savings never reach the target. Raise contributions or lower the income you need.' };
    var rows = [
      ['Target nest egg (today\'s $)', H.money0(target)],
      ['Years from now', H.ym(m)],
      ['Balance then, in future dollars', H.money0(target * Math.pow(1 + inf / 100, m / 12))]
    ];
    if (m > 60) {
      var goal = m - 60, lo = D, hi = Math.max(D * 20, target / 12);
      for (var k = 0; k < 60; k++) { var mid = (lo + hi) / 2; if (monthsTo(mid) <= goal) hi = mid; else lo = mid; }
      rows.push(['Monthly needed to retire 5 years sooner', H.money0(hi), true]);
    }
    if (isFinite(at65) && v.age < 65) rows.push(['Projected savings at 65 (today\'s $)', H.money0(at65)]);
    var ageAt = v.age + m / 12;
    var ageTxt = 'age ' + H.num(Math.floor(ageAt), 0) + (Math.round((ageAt % 1) * 12) ? ' and ' + Math.round((ageAt % 1) * 12) + ' mo' : '');
    return {
      value: m === 0 ? 'Now' : 'Age ' + H.num(Math.floor(ageAt), 0) + (Math.round((ageAt % 1) * 12) ? ' and ' + Math.round((ageAt % 1) * 12) + ' mo' : ''),
      label: 'Earliest age you can retire',
      expr: H.money0(v.spend) + '/yr ÷ ' + H.num(v.wr, 2) + '% = ' + H.money0(target),
      rows: rows,
      n: m,
      sub: m === 0 ? 'You already have enough to support that income at a ' + H.num(v.wr, 2) + '% withdrawal rate.' : (ageAt <= 62 ? 'Your savings reach ' + H.money0(target) + ' at ' + ageTxt + ', before Social Security can start at 62, so savings must cover the early years on their own.' : 'Your savings reach ' + H.money0(target) + ' at ' + ageTxt + '; working a few years longer would let them support a lower withdrawal rate.')
    };
  },
  notes: {
    'Target nest egg (today\'s $)': 'Yearly income needed divided by the withdrawal rate.',
    'Years from now': 'How long your balance takes to reach the target at this contribution.',
    'Balance then, in future dollars': 'The same target as it will appear on your statement after inflation.',
    'Monthly needed to retire 5 years sooner': 'The contribution, in today\'s dollars, that hits the target five years earlier.',
    'Projected savings at 65 (today\'s $)': 'What you would have at 65 if you kept saving at the current pace.'
  },
  assumptions: 'This estimate assumes a steady return, contributions that rise with inflation, and that you retire the month your balance reaches the target. It does not model taxes or market swings.',
  quick: ({ r }) => `You can retire when your savings reach your yearly need divided by your withdrawal rate. A <strong>30-year-old</strong> with <strong>$40,000</strong> invested, adding <strong>$1,500 a month</strong> at 7% with 3% inflation, reaches $1,250,000 in today's dollars (25 × $50,000) at <strong>${r.value.toLowerCase()}</strong>. Raising contributions to about $2,024 a month brings that forward five years, to 57.`,
  formulaTitle: 'How is the retirement age calculated?',
  formula: {
    expr: 'Target = Income needed ÷ Withdrawal rate<br>Each month: Balance = Balance × (1 + i) + Contribution, until Balance ≥ Target<br>i = [(1 + return) ÷ (1 + inflation)]<sup>1/12</sup> − 1',
    vars: [['Income needed', 'yearly income from savings, today\'s dollars'], ['i', 'monthly real (after-inflation) return'], ['Contribution', 'monthly amount, kept constant in today\'s dollars']],
    note: 'Keeping contributions constant in today\'s dollars means the actual amount you invest rises with inflation each year, as it normally would with raises.'
  },
  example: `<p>Jordan is 30, has $40,000 in a 401(k), and invests $1,500 a month (including the employer match). Jordan wants $50,000 a year from savings and plans to use a 4% withdrawal rate.</p>
<p>Target = $50,000 ÷ 0.04 = <strong>$1,250,000</strong> in today's dollars. Real return = 1.07 ÷ 1.03 − 1 = 3.88% a year, or 0.318% a month.</p>
<p>Month by month the balance grows by 0.318% plus $1,500. It crosses $1,250,000 after 31 years 11 months, so Jordan can retire at <strong>age 61 and 11 months</strong>. On the statement, that balance will read about $3.21 million because of almost 32 years of 3% inflation.</p>`,
  table: {
    title: 'At what age can I retire with each monthly contribution?',
    intro: 'Earliest retirement age for a 30-year-old with $40,000 saved who needs $50,000 a year from savings (4% rule), by monthly contribution and return, with 3% inflation. Computed by the calculator above.',
    head: ['Monthly contribution', '5% return', '6% return', '7% return', '8% return'],
    rows: ({ run, H }) => [500, 750, 1000, 1500, 2000, 2500, 3000, 4000].map(d => [H.money0(d), ...[5, 6, 7, 8].map(r => { const x = run({ monthly: d, ret: r }); return isFinite(x.n) ? H.num(30 + Math.floor(x.n / 12), 0) : '100+'; })]),
    note: 'Ages are rounded down to the year the target is reached. Returns are before inflation; the calculator subtracts inflation internally.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>The calculator grows your balance month by month until it can pay the income you need. Here is what each box does and where people slip up.</p>
<h3>Current age</h3>
<p>The starting point for the countdown. The answer is your age when the balance first crosses the target, shown in years and months.</p>
<h3>Invested for retirement now</h3>
<p>Add up your 401(k), 403(b), IRA and any brokerage account you mean to live on. A head start matters: with nothing saved, Jordan from the example would reach the target at 64 instead of almost 62.</p>
<h3>Monthly contribution</h3>
<p>Everything that goes in each month, including your employer's 401(k) match. The calculator treats it as constant in today's dollars, so it quietly rises with inflation each year.</p>
<h3>Yearly income you need from savings</h3>
<p>Your expected spending in today's dollars minus Social Security and any pension. Entering total spending without subtracting benefits is the most common reason the answer looks too late.</p>
<h3>Withdrawal rate</h3>
<p>4% is the usual starting point for a 30-year retirement; use 3–3.5% if you plan to retire before 55, because the money has to last longer.</p>
<h3>Annual return and inflation</h3>
<p>Enter the return before inflation and your inflation estimate. The calculator works in today's dollars using the real return, so the people who get this wrong are those who compare a future account balance with a target in today's money.</p>`
    },
    {
      h2: 'Can I retire early?',
      html: `<p>Yes, if your savings can carry you until other income starts. Three age rules shape an early exit.</p>
<h3>Age 59½ and the 10% additional tax</h3>
<p>Retiring before 59½ usually means living on taxable brokerage money or Roth contributions, because most 401(k) and IRA withdrawals before then carry a 10% additional tax unless an exception applies (such as leaving your employer in or after the year you turn 55, for that employer's 401(k)).</p>
<h3>Age 62 and full retirement age</h3>
<p>Social Security can start no earlier than 62, and benefits are permanently reduced if you claim before your full retirement age, which is 67 for anyone born in 1960 or later.</p>
<h3>A longer retirement needs a lower withdrawal rate</h3>
<p>For a retirement of 40 years or more, lower the withdrawal rate to 3.5% or less. In the example, that raises the target from $1.25 million to $1,428,571 and pushes the retirement age from just under 62 to 64 and 6 months.</p>`
    },
    {
      h2: 'What makes the biggest difference to my retirement age?',
      html: `<p>In order of impact for most people: the income you need, the amount you save, and the return.</p>
<h3>Needing less income</h3>
<p>Cutting the yearly need from $50,000 to $40,000 lowers the target by $250,000 and, in the example, moves retirement from almost 62 to 57 and 9 months. Spending less does double duty: it lowers the target and frees money to invest. That is the core idea behind the <a href="/fire-calculator">FIRE number calculator</a>, which works from your savings rate.</p>
<h3>Saving more</h3>
<p>Adding $500 a month (to $2,000) gets Jordan to 57 and 2 months. At $3,000 a month the target arrives at 51 and 1 month.</p>
<h3>Earning a higher return</h3>
<p>An extra point of return (7% to 8%) brings it to 58 and 8 months. Returns are the least controllable lever, so treat a higher figure as upside rather than the plan.</p>`
    },
    {
      h2: 'What is the earliest age I can claim Social Security?',
      html: `<p>Age 62. Claiming at 62 with a full retirement age of 67 cuts the monthly benefit by 30% for life; waiting until 70 adds 8% for each year past full retirement age, for 124% of the full benefit. If you retire at 61, as in the example, your savings fund everything until benefits begin.</p>
<p>Subtract the benefit you expect from your yearly need so the target reflects it. If you plan to bridge several years before claiming, the <a href="/retirement-countdown-calculator">retirement countdown calculator</a> helps you track the date itself.</p>`
    }
  ],
  faq: [
    { q: 'What age can I retire?', a: 'You can retire once your savings equal the yearly income you need divided by your withdrawal rate. A 30-year-old with $40,000 invested who adds $1,500 a month at 7% and needs $50,000 a year gets there at age 61 and 11 months.' },
    { q: 'Can I retire at 55?', a: 'Possibly, if you save heavily. In the default example, investing $3,000 a month gets a 30-year-old to the $1,250,000 target at 51, while $2,000 a month gets there at 57. Use a 3–3.5% withdrawal rate for a retirement that long.' },
    { q: 'How much do I need to retire at 55?', a: 'Divide the yearly income you need from savings by a 3–3.5% withdrawal rate, because the money must last 35–40 years. Needing $50,000 a year means about $1.43–1.67 million in today\'s dollars.' },
    { q: 'Can I retire at 60 with $500,000?', a: 'At a 4% withdrawal rate, $500,000 supports about $20,000 a year, rising with inflation. Combined with Social Security from 62 or later that can work for a modest budget, but you would need to cover ages 60 and 61 without benefits.' },
    { q: 'Can I retire at 62?', a: 'A 45-year-old with $300,000 invested who adds $2,000 a month at 7% and needs $50,000 a year reaches the target at 63 and 6 months; raising contributions to $2,400 a month gets there at 61 and 11 months. Age 62 is also the earliest you can claim Social Security.' },
    { q: 'How many years until I can retire?', a: 'For the default example, 31 years 11 months. The calculator shows the count as "Years from now" for your own figures.' },
    { q: 'What is the average retirement age in the U.S.?', a: 'Surveys put the average actual retirement age in the early 60s, a few years below the full Social Security retirement age of 67 for people born in 1960 or later.' },
    { q: 'What is my full retirement age for Social Security?', a: 'It is 67 for anyone born in 1960 or later. Claiming at 62 reduces the benefit by 30%; waiting to 70 raises it to 124% of the full amount.' },
    { q: 'Does this calculator include Social Security?', a: 'Indirectly. Enter your spending minus the Social Security benefit you expect as the yearly income needed from savings.' },
    { q: 'Why are the results in today\'s dollars?', a: 'So you can compare the target with your current budget. The calculator uses the real return (return minus inflation) and shows the inflated balance separately.' },
    { q: 'Should I count my home equity?', a: 'Only if you plan to sell or downsize and invest the proceeds. A home you live in does not produce income, so most planners leave it out of the nest egg.' }
  ],
  related: ['retirement-calculator', 'retirement-countdown-calculator', 'fire-calculator', '401k-retirement-calculator', 'social-security-calculator'],
  sources: [
    { name: 'Social Security Administration: Retirement age and benefit reduction', url: 'https://www.ssa.gov/benefits/retirement/planner/agereduction.html' },
    { name: 'IRS: 401(k) contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits' },
    { name: 'IRS: Retirement topics, exceptions to tax on early distributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-exceptions-to-tax-on-early-distributions' },
    { name: 'CFPB: Planning for retirement', url: 'https://www.consumerfinance.gov/consumer-tools/retirement/' }
  ],
  disclaimer: 'Illustration only, not investment advice. Assumes a steady return.'
};
