export default {
  slug: 'coast-fire-calculator',
  hub: 'planning',
  name: 'Coast FIRE Calculator',
  meta: 'Estimate your Coast FI number with our free Coast FIRE calculator. See how much you need invested today, your gap to it and the age you can stop contributing.',
  intro: 'Plug in your age, retirement age, spending and what you have invested, and we\'ll show you your Coast FIRE number and the age at which you could stop saving and let growth do the rest.',
  keyword: 'how to calculate coast fi number',
  also: ['coast fire calculator', 'how to calculate coast fi', 'what is coast fire calculator', 'how to calculate my coast fire number', 'how to calculate your coast fire number', 'coast fi calculator'],
  updated: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Current age', type: 'number', value: 30, help: 'Your age today; compounding runs from here to your retirement age.' },
    { id: 'retAge', label: 'Age you want to retire', type: 'number', value: 65, help: 'The age your portfolio must reach the full FIRE number.' },
    { id: 'spend', label: 'Yearly spending in retirement (today\'s $)', type: 'number', value: 40000, prefix: '$', help: 'Expected yearly spending once retired, minus any Social Security or pension.' },
    { id: 'wr', label: 'Withdrawal rate', type: 'number', value: 4, suffix: '%', help: 'Share of the portfolio you will spend each year in retirement. 4% means 25 × spending.' },
    { id: 'ret', label: 'Real return (after inflation)', type: 'number', value: 5, suffix: '%', help: 'Yearly growth after inflation. 4–5% is a cautious figure for a stock-heavy portfolio.' },
    { id: 'invested', label: 'Invested now', type: 'number', value: 100000, prefix: '$', help: 'Retirement and brokerage accounts you will leave invested until retirement.' },
    { id: 'monthly', label: 'Monthly contribution until you coast', type: 'number', value: 1000, prefix: '$', help: 'What you add each month, including any employer match, until you reach Coast FI.' }
  ],
  compute(v, H) {
    if (!(v.age >= 0) || !(v.retAge > v.age)) return { error: 'Enter a retirement age above your current age.' };
    if (!(v.spend > 0)) return { error: 'Enter your yearly spending in retirement.' };
    if (!(v.wr > 0) || v.wr > 20) return { error: 'Enter a withdrawal rate between 0 and 20%.' };
    var r = isNaN(v.ret) ? 0 : v.ret / 100;
    if (r <= -1) return { error: 'Enter a return above −100%.' };
    var years = v.retAge - v.age;
    var fi = v.spend / (v.wr / 100);
    var coast = fi / Math.pow(1 + r, years);
    var inv = v.invested > 0 ? v.invested : 0, D = v.monthly > 0 ? v.monthly : 0;
    var grows = inv * Math.pow(1 + r, years);
    var rows = [
      ['FIRE number at retirement (today\'s $)', H.money0(fi)],
      ['What you have invested grows to', H.money0(grows)],
      ['Progress to Coast FI', H.pct(Math.min(999, inv / coast * 100), 1)]
    ];
    var sub;
    if (inv >= coast) {
      rows.unshift(['Status', 'Coast FI reached', true]);
      sub = 'You have passed your ' + H.money0(coast) + ' Coast FI number: stop contributing today and you still reach ' + H.money0(fi) + ' by ' + H.num(v.retAge, 0) + ', assuming the return holds.';
    } else {
      rows.splice(2, 0, ['Gap to Coast FI today', H.money0(coast - inv), true]);
      var i = Math.pow(1 + r, 1 / 12) - 1, b = inv, m = 0, total = years * 12, hit = -1;
      while (m < total && D > 0) {
        b = b * (1 + i) + D; m++;
        if (b >= fi / Math.pow(1 + r, (total - m) / 12)) { hit = m; break; }
      }
      if (hit > 0) {
        rows.push(['Age you can stop contributing', H.num(v.age + hit / 12, 1), true]);
        rows.push(['Balance when you can coast', H.money0(b)]);
        sub = 'You need ' + H.money0(coast) + ' invested today to coast; keep investing ' + H.money0(D) + ' a month for ' + H.ym(hit) + ', then let compounding carry you to ' + H.money0(fi) + ' by ' + H.num(v.retAge, 0) + '.';
      } else sub = D > 0 ? 'You need ' + H.money0(coast) + ' invested today to coast; at this contribution you reach your FIRE number only by saving all the way to ' + H.num(v.retAge, 0) + '.' : 'You need ' + H.money0(coast) + ' invested today to coast; add a monthly contribution to see when you get there.';
    }
    return {
      value: H.money0(coast),
      label: 'Coast FI number at age ' + H.num(v.age, 0),
      expr: H.money0(fi) + ' ÷ (1 + ' + H.num(r * 100, 2) + '%)^' + H.num(years, 1),
      rows: rows,
      sub: sub
    };
  },
  notes: {
    'Status': 'Your current investments already meet the Coast FI number.',
    'FIRE number at retirement (today\'s $)': 'Yearly spending divided by the withdrawal rate: the full target at retirement.',
    'What you have invested grows to': 'Your current balance at retirement age with no more contributions.',
    'Gap to Coast FI today': 'Coast FI number minus what you have invested now.',
    'Progress to Coast FI': 'What you have invested as a share of today\'s Coast FI number.',
    'Age you can stop contributing': 'When your balance, with monthly contributions, catches the rising Coast target.',
    'Balance when you can coast': 'Your invested balance at the moment you reach Coast FI.'
  },
  assumptions: 'These figures assume a steady real return every year, monthly contributions at month end and no withdrawals before retirement. Everything is in today\'s dollars.',
  quick: ({ r }) => `Your Coast FI number is your FIRE number divided by (1 + real return) raised to the years until retirement. Spending <strong>$40,000 a year</strong> needs $1,000,000 at a 4% withdrawal rate; at <strong>30</strong>, with 35 years to grow at a 5% real return, you need <strong>${r.value}</strong> invested today. With $100,000 now and $1,000 a month, you can stop contributing at about 38.3.`,
  formulaTitle: 'What is the Coast FI formula?',
  formula: {
    expr: 'Coast FI = FIRE number ÷ (1 + r)<sup>t</sup><br>FIRE number = Yearly spending ÷ Withdrawal rate',
    vars: [['r', 'real annual return, as a decimal'], ['t', 'years until retirement age']],
    note: 'Your Coast number rises every year you wait, because there are fewer years left to compound. That is why the calculator checks month by month when your growing balance catches the rising target.'
  },
  example: `<p>Priya is 30, plans to retire at 65 and expects to spend $40,000 a year in today's dollars.</p>
<p>FIRE number = $40,000 ÷ 0.04 = $1,000,000. Growth factor at 5% real for 35 years = 1.05<sup>35</sup> = 5.516.</p>
<p>Coast FI number = $1,000,000 ÷ 5.516 = <strong>$181,290</strong>. She has $100,000, which alone would grow to $551,602 by 65.</p>
<p>Investing $1,000 a month, her balance catches the rising Coast target after 8 years 3 months, at about age 38.3, when it is near $271,000. After that she only needs to earn enough to cover her spending.</p>`,
  table: {
    title: 'What is the Coast FIRE number at each age?',
    intro: 'Amount needed invested today to reach a $1,000,000 FIRE number at 65 with no further contributions, by current age and real return. Computed by the calculator above.',
    head: ['Current age', '4% real', '5% real', '6% real', '7% real'],
    rows: ({ run }) => [20, 25, 30, 35, 40, 45, 50, 55, 60].map(a => [String(a), ...[4, 5, 6, 7].map(r => run({ age: a, retAge: 65, spend: 40000, wr: 4, ret: r }).value)]),
    note: 'Scale for other targets: for a $2,000,000 FIRE number, double each figure. 7% real is optimistic for a long-run plan; 4–5% is more cautious.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>Coast FI works backwards from a future target, so a few of these boxes behave differently from an ordinary savings calculator.</p>
<h3>Current age and retirement age</h3>
<p>The gap between them is how long your money compounds without help. A longer gap shrinks the Coast number sharply: at a 5% real return, $1,000,000 at 65 needs $142,046 at 25 but $295,303 at 40.</p>
<h3>Yearly spending in retirement</h3>
<p>What you expect to spend each year once retired, in today's dollars. Subtract any Social Security or pension you expect, because the portfolio only has to cover the rest.</p>
<h3>Withdrawal rate</h3>
<p>Turns spending into your full FIRE number: yearly spending ÷ withdrawal rate. $40,000 at 4% is $1,000,000.</p>
<h3>Real return</h3>
<p>Choose a real (after-inflation) return. Using a nominal return here is the classic mistake; it makes the Coast number look far smaller than it really is.</p>
<h3>Invested now and monthly contribution</h3>
<p>Enter what you have invested and what you add each month. The calculator then shows the gap to your Coast number today and the age at which your growing balance catches it, the point where you could stop saving.</p>`
    },
    {
      h2: 'What does Coast FIRE mean?',
      html: `<p>Coast FIRE (Coast FI) is the point where the money already invested will grow to your full retirement number by a normal retirement age without another dollar of contributions. You still work, but only to pay current bills.</p>
<h3>Why people aim for it</h3>
<p>Many people use it to switch to lower-stress work, go part time or take a career break, knowing retirement is already funded on paper.</p>
<h3>How it differs from full FIRE</h3>
<p>With full FIRE, investments cover your spending now. Use the <a href="/fire-calculator">FIRE number calculator</a> for that target and how long it takes.</p>`
    },
    {
      h2: 'Should I use a 7% or a 5% return for Coast FI?',
      html: `<p>Use a real return, after inflation, because your spending figure is in today's dollars. U.S. stocks have historically returned roughly 6–7% a year after inflation over long periods, while a stock-and-bond mix has returned less.</p>
<p>The difference is large over decades: at 30 with 35 years to go, the Coast number for $1,000,000 is $253,415 at 4%, $181,290 at 5% and $93,663 at 7%. At 7% the example saver with $100,000 is already coasting; at 4% they would need to keep investing $1,000 a month until about 47.8. Planning with 5% leaves room for weaker markets.</p>`
    },
    {
      h2: 'What are the risks of coasting too early?',
      html: `<p>Coast FI rests on one assumption doing a lot of work: decades of steady returns.</p>
<h3>What can undo it</h3>
<p>A bad decade early on, higher spending in retirement than planned, or dipping into the portfolio during a career break can all undo it. If you coast at 35 and the market falls 30%, you may simply need to resume contributions for a few years.</p>
<h3>Common safeguards</h3>
<p>Keep contributing enough to get any employer match, aim for 110–125% of the Coast number before stopping, and recheck every year. Raising spending in the plan from $40,000 to $60,000 lifts the example Coast number to $271,935 and pushes the stop-saving age to about 54.8, so revisit the number whenever your lifestyle changes.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my Coast FIRE number?', a: 'Divide your FIRE number by (1 + real return) raised to the years until retirement. $1,000,000 ÷ 1.05<sup>35</sup> = $181,290 for a 30-year-old retiring at 65.' },
    { q: 'How much do I need to Coast FIRE at 25?', a: 'For a $1,000,000 FIRE number at 65 and a 5% real return, you need $142,046 invested at 25. At 7% real it is $66,780.' },
    { q: 'What is a good Coast FIRE number at 35?', a: 'To reach $1,000,000 by 65 at a 5% real return, you need $231,377 invested at 35.' },
    { q: 'What is a good Coast FIRE number at 40?', a: 'To reach $1,000,000 by 65 at 5% real, you need $295,303 at 40. For a $1.5 million target, about $442,954.' },
    { q: 'How much do I need at 45 to coast to retirement?', a: 'About $376,889 for a $1,000,000 FIRE number at 65 with a 5% real return. With only 20 years of compounding left, the number climbs quickly.' },
    { q: 'What if I want to retire at 55 instead of 65?', a: 'Ten fewer years of growth raise the Coast number. For a 30-year-old with a $1,000,000 target and a 5% real return, it goes from $181,290 to $295,303.' },
    { q: 'How fast can I reach Coast FI?', a: 'In the default example, investing $1,000 a month gets a 30-year-old with $100,000 there at about 38.3; doubling to $2,000 a month brings it to about 33.8.' },
    { q: 'Does Coast FIRE include Social Security?', a: 'Not directly. Subtract the Social Security you expect from your retirement spending before calculating; that lowers both the FIRE number and the Coast number.' },
    { q: 'Can I stop contributing to my 401(k) at Coast FI?', a: 'You can, but many people keep contributing at least enough to collect the employer match, which is free money and adds a safety margin.' },
    { q: 'What is the difference between Coast FIRE and Barista FIRE?', a: 'Coast FIRE means retirement is funded and you work only for current expenses. Barista FIRE means you have left full-time work and part-time income covers the gap your portfolio can\'t yet support.' },
    { q: 'Why does my Coast number go up every year?', a: 'Each year you wait leaves one fewer year of compounding, so you need more invested today. At 5% real, the number rises about 5% a year.' }
  ],
  related: ['fire-calculator', 'retirement-age-calculator', '401k-retirement-calculator', 'roth-ira-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    { name: 'SEC Investor.gov: Assessing your risk tolerance', url: 'https://www.investor.gov/introduction-investing/getting-started/assessing-your-risk-tolerance' },
    { name: 'IRS: 401(k) contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits' }
  ],
  disclaimer: 'Illustration only, not investment advice. Assumes a steady real return.'
};
