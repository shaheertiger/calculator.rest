export default {
  slug: '401k-retirement-calculator',
  hub: 'planning',
  name: '401(k) Retirement Calculator',
  meta: 'Estimate your 401(k) balance at retirement with our free 401(k) calculator. See it in today\'s dollars, the monthly income it pays and your employer match.',
  intro: 'Plug in your age, salary, contribution rate and employer match, and we\'ll show you what your 401(k) will be worth when you retire, what that buys in today\'s dollars and the monthly income it can support.',
  keyword: '401k retirement calculator',
  also: ['retirement calculator 401k', '401k calculator retirement', 'retirement 401k calculator', '401k retirement calculators', '401k calculator for retirement', '401k retirement savings calculator', 'calculate 401k balance at retirement', 'calculate my 401k at retirement', 'how much will my 401k be worth calculator', 'how much in 401k to retire calculator'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Your age now', type: 'number', value: 35, help: 'Your age today in whole years.' },
    { id: 'retAge', label: 'Age you plan to retire', type: 'number', value: 65, help: 'The age you expect to stop contributing and start drawing on the account.' },
    { id: 'bal', label: 'Current 401(k) balance', type: 'number', value: 45000, prefix: '$', help: 'The vested balance on your latest plan statement, plus any old 401(k)s you have not rolled over.' },
    { id: 'salary', label: 'Annual salary (gross)', type: 'number', value: 70000, prefix: '$', help: 'Pay before taxes and deductions, as shown on your offer letter or last W-2 (box 1 plus your deferrals).' },
    { id: 'pct', label: 'You contribute', type: 'number', value: 8, suffix: '% of pay', help: 'Traditional and Roth 401(k) deferrals combined.' },
    { id: 'mrate', label: 'Employer matches', type: 'number', value: 50, suffix: '% of your deferral', help: 'From your plan summary: "50% up to 6%" means enter 50 here. Use 0 if there is no match.' },
    { id: 'mcap', label: 'On the first', type: 'number', value: 6, suffix: '% of pay', help: 'The share of pay the employer will match: the 6 in "50% up to 6%".' },
    { id: 'raise', label: 'Annual raise', type: 'number', value: 3, suffix: '%', help: 'Average yearly pay increase you expect. 3% roughly keeps pace with inflation.' },
    { id: 'ret', label: 'Annual return before retirement', type: 'number', value: 7, suffix: '%', help: 'Average yearly growth before inflation. 6–7% is a common long-run figure for a stock-heavy mix.' },
    { id: 'infl', label: 'Inflation', type: 'number', value: 3, suffix: '%', help: 'Used to show the balance in today\'s dollars.' }
  ],
  data: { base: 24500, c50: 8000, c60: 11250, comp: 360000, total: 72000, wr: 4 },
  compute(v, H, D) {
    if (!(v.age >= 15) || !(v.age < 100)) return { error: 'Enter your current age.' };
    if (!(v.retAge > v.age) || v.retAge > 100) return { error: 'Enter a retirement age above your current age.' };
    if (!(v.salary >= 0)) return { error: 'Enter your annual salary.' };
    if (!(v.pct >= 0) || v.pct > 100) return { error: 'Enter a contribution rate between 0 and 100%.' };
    var bal = v.bal > 0 ? v.bal : 0, start = bal;
    var r = isNaN(v.ret) ? 0 : v.ret / 100, inf = isNaN(v.infl) ? 0 : v.infl / 100, g = isNaN(v.raise) ? 0 : v.raise / 100;
    var mrate = v.mrate > 0 ? v.mrate / 100 : 0, mcap = v.mcap > 0 ? v.mcap : 0;
    if (r <= -1) return { error: 'Enter a return above −100%.' };
    var years = Math.round(v.retAge - v.age);
    var sal = v.salary, you = 0, emp = 0, cappedYears = 0, firstCap = 0, tbl = [];
    for (var i = 0; i < years; i++) {
      var a = Math.round(v.age) + i;
      var limit = D.base + (a >= 60 && a <= 63 ? D.c60 : a >= 50 ? D.c50 : 0);
      var want = sal * v.pct / 100;
      var d = Math.min(want, limit);
      if (want > limit + 0.5) { cappedYears++; if (!firstCap) firstCap = a; }
      var m = Math.min(sal, D.comp) * mrate * Math.min(v.pct, mcap) / 100;
      var base = Math.min(d, D.base);
      if (base + m > D.total) m = Math.max(0, D.total - base);
      bal = bal * (1 + r) + (d + m) * (1 + r / 2);
      you += d; emp += m;
      if ((i + 1) % 5 === 0 || i === years - 1) tbl.push([String(a + 1), H.money0(sal), H.money0(d), H.money0(m), H.money0(bal)]);
      sal *= 1 + g;
    }
    var real = bal / Math.pow(1 + inf, years);
    var growth = bal - start - you - emp;
    var mo = bal * D.wr / 100 / 12, moReal = real * D.wr / 100 / 12;
    var rows = [
      ['In today\'s dollars', H.money0(real), true],
      ['Monthly income at a 4% withdrawal', H.money0(mo) + ' (' + H.money0(moReal) + ' today)', true],
      ['Your contributions', H.money0(you)],
      ['Employer match', H.money0(emp)],
      ['Investment growth', H.money0(growth)],
      ['Starting balance', H.money0(start)]
    ];
    if (cappedYears) rows.push(['Years your deferral hits the IRS limit', String(cappedYears) + ' (from age ' + firstCap + ')']);
    var sub;
    if (v.pct < mcap && mrate > 0) sub = 'You contribute less than the ' + H.num(mcap, 2) + '% the employer matches, so part of the match is left unclaimed every year.';
    else if (cappedYears) sub = 'Your rate would exceed the IRS deferral limit in ' + cappedYears + ' of ' + years + ' years; contributions above the limit are cut off.';
    else sub = 'Employer match and investment growth make up ' + H.pct((emp + growth) / Math.max(1, bal) * 100, 0) + ' of the final balance.';
    return {
      value: H.money0(bal),
      label: '401(k) balance at age ' + H.num(v.retAge, 0),
      expr: H.money0(start) + ' + ' + H.num(v.pct, 2) + '% of pay + match, ' + years + ' yrs at ' + H.num(r * 100, 2) + '%',
      rows: rows,
      sub: sub,
      n: years, real: real, mo: mo, moReal: moReal, you: you, emp: emp, growth: growth,
      table: { head: ['Age', 'Salary', 'You put in', 'Match', 'Balance'], rows: tbl, caption: 'Balance every 5 years' }
    };
  },
  notes: {
    'In today\'s dollars': 'The future balance deflated by inflation, so you can compare it with prices now.',
    'Monthly income at a 4% withdrawal': 'Balance × 4% ÷ 12, before income tax; today\'s buying power in brackets.',
    'Your contributions': 'Every paycheck deferral you make until retirement, capped at the IRS limit for your age.',
    'Employer match': 'Money your employer adds under the match formula you entered.',
    'Investment growth': 'Returns earned on the balance and on new contributions over the years.',
    'Starting balance': 'What is already in the account today.',
    'Years your deferral hits the IRS limit': 'Years when your percentage of pay would exceed the deferral limit, so the excess is cut off.'
  },
  assumptions: 'These calculations are estimates. They assume the same return every year, contributions spread evenly through each year, a match paid on every paycheck and 2026 IRS limits held flat. Real markets vary, so try a lower return too.',
  quick: ({ r }) => `A 401(k) retirement calculator projects your balance from your salary, contribution rate, employer match and return. A 35-year-old with $45,000 saved, earning $70,000 with 3% raises, deferring 8% and getting a 50% match on the first 6%, reaches <strong>${r.value}</strong> by 65 at a 7% return. That is ${r.rows[0][1]} in today's dollars and supports about <strong>$4,585 a month</strong> at a 4% withdrawal rate.`,
  formulaTitle: 'How does the 401(k) projection work?',
  formula: {
    expr: 'Each year: Balance = Balance × (1 + r) + (Deferral + Match) × (1 + r ÷ 2)<br>Deferral = min(Salary × rate, IRS limit for your age) · Match = Salary × match % × min(rate, match cap)<br>Today\'s dollars = Final balance ÷ (1 + inflation)<sup>years</sup> · Monthly income = Final balance × 4% ÷ 12',
    vars: [['r', 'annual return before retirement'], ['IRS limit', '$24,500 in 2026; $32,500 from 50; $35,750 at ages 60–63; $32,500 again at 64+'], ['match cap', 'the share of pay the employer will match, e.g. 6%'], ['(1 + r ÷ 2)', 'contributions arrive through the year, so on average they earn about half a year of growth']],
    note: 'Salary grows by the raise you enter each year. The 2026 dollar limits are held flat for future years: the IRS raises them with inflation, so the projection is slightly conservative for people who plan to max out. The match uses pay up to the $360,000 compensation cap, and employee plus employer money is kept under the $72,000 total annual additions limit.'
  },
  example: `<p>Maya is 35, earns $70,000, has $45,000 in her 401(k) and defers 8% of pay. Her employer matches 50% of the first 6%, she expects 3% raises and a 7% return.</p>
<p><strong>Year 1:</strong> she defers 8% × $70,000 = $5,600. The match is 50% × 6% × $70,000 = $2,100. The balance becomes $45,000 × 1.07 + $7,700 × 1.035 = <strong>$56,120</strong>.</p>
<p><strong>Age 50:</strong> her salary has grown to $105,881 and the balance is $363,453. She is far below the $32,500 limit, so the catch-up never comes into play for her.</p>
<p><strong>Age 65:</strong> after 30 years she has put in $266,422, the employer $99,908, and growth added $964,266. The balance is <strong>$1,375,596</strong>, or $566,728 in today's dollars at 3% inflation. A 4% first-year withdrawal is $55,024 a year, about <strong>$4,585 a month</strong> before tax.</p>
<p>The $45,000 she already had is worth $342,551 of the final total on its own: $45,000 × 1.07<sup>30</sup>.</p>`,
  table: {
    title: 'How much will a 401(k) be worth at each contribution rate?',
    intro: 'Balance at 65 for the same 35-year-old: $45,000 saved, $70,000 salary rising 3% a year, a 50% match on the first 6%, 7% return and 3% inflation, from the calculator above.',
    head: ['You defer', 'Balance at 65', 'In today\'s dollars', 'Monthly income at 4%', 'Match collected'],
    rows: ({ run }) => [3, 4, 6, 8, 10, 12, 15, 20, 25, 30].map(p => {
      const r = run({ pct: p });
      return [p + '%', r.value, r.rows[0][1], r.rows[1][1].replace(/ \(.*/, ''), r.rows[3][1]];
    }),
    note: 'Below 6% the employer match shrinks with your rate, so each point you cut costs you twice. At 30% the deferral runs into the IRS limit in the last few years, which is why the jump from 25% to 30% is smaller than the others.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>Ten boxes drive the projection, but three of them (years until retirement, your contribution rate and the return) decide most of the answer. Here is what to enter in each.</p>
<h3>Your age and retirement age</h3>
<p>The gap between the two is the number of years your money compounds. Each year also sets your IRS limit: the calculator adds the age 50 catch-up from 50 and the larger catch-up at 60 to 63. If you are unsure when you will stop, run 62, 65 and 67 and compare.</p>
<h3>Current 401(k) balance</h3>
<p>Use the vested balance if you might leave before the employer match fully vests; unvested money can be forfeited. Include old workplace plans you still hold, but leave IRAs out, since they have their own <a href="/roth-ira-calculator">IRA projection</a>.</p>
<h3>Annual salary and raises</h3>
<p>Enter gross pay before taxes, because both your percentage and the match are applied to it. A 3% raise roughly tracks inflation; enter more only if you expect promotions. Bonuses count as pay in most plans.</p>
<h3>Your contribution rate</h3>
<p>Add your traditional and Roth deferrals together; they share one IRS limit. A common mistake is entering the dollar amount per paycheck instead of the percentage. If you know only the dollar figure, divide it by your gross pay per check.</p>
<h3>Employer match and the match cap</h3>
<p>Copy the formula from your summary plan description. "50% up to 6%" means the employer adds 50 cents per dollar you defer, on deferrals up to 6% of pay, so the most it adds is 3% of salary. The calculator stops counting the match at the cap and at the $360,000 pay limit.</p>
<h3>Return and inflation</h3>
<p>The return is the average yearly growth before inflation. The figure people most often get wrong: 7% suits a stock-heavy mix held for decades, while 5–6% fits a balanced fund or leaves a margin of safety. Inflation does not change the balance; it only converts it into today's dollars, which is the number to plan your budget around.</p>`
    },
    {
      h2: 'How much will my 401(k) be worth when I retire?',
      html: `<p>Mostly it depends on how many years the money compounds, then on how much goes in, then on the return.</p>
<h3>When you start</h3>
<p>Using the same $70,000 salary, 8% deferral, 50% match on 6%, 7% return and retirement at 65, but starting from a $0 balance:</p>
<div class="twrap"><table><thead><tr><th>Start saving at</th><th>Balance at 65</th><th>Monthly income at 4%</th></tr></thead><tbody>
<tr><td>25</td><td>$2,333,553</td><td>$7,779</td></tr>
<tr><td>35</td><td>$1,033,045</td><td>$3,443</td></tr>
<tr><td>45</td><td>$411,141</td><td>$1,370</td></tr>
<tr><td>55</td><td>$124,172</td><td>$414</td></tr>
</tbody></table></div>
<p>Ten extra years at the start more than doubles the result, because the earliest dollars get the most years of growth. Starting late can be offset only partly: a 55-year-old earning $120,000 with $300,000 saved who defers 25% reaches $1,118,892 by 65, and hits the deferral cap in six of those ten years.</p>
<h3>The return you assume</h3>
<p>In the default example, 5% a year gives $942,175, 6% gives $1,135,157, 7% gives $1,375,596 and 8% gives $1,675,704. One point of return is worth roughly $200,000 to $300,000 over 30 years, which is why fund fees matter.</p>
<h3>When you stop</h3>
<p>Retiring at 60 leaves $908,423 and at 62 leaves $1,075,095. Working to 67 lifts the balance to $1,615,543, because two more years of deposits and growth land on the largest balance you will ever have. The <a href="/retirement-age-calculator">retirement age calculator</a> looks at the timing question across all your savings.</p>`
    },
    {
      h2: 'What are the 401(k) contribution limits for 2026?',
      html: `<p>The IRS announced these figures for 2026, and the calculator applies the one that fits your age in each projected year.</p>
<h3>Elective deferral limit</h3>
<p>$24,500, up from $23,500 in 2025. It covers traditional and Roth 401(k) deferrals combined, across every 401(k) and 403(b) you contribute to that year.</p>
<h3>Catch-up contributions</h3>
<p>From the year you turn 50 you can add $8,000, for $32,500 in total. If you are 60, 61, 62 or 63 at the end of the year the catch-up is $11,250 instead, for $35,750. It drops back to $8,000 the year you turn 64.</p>
<h3>Total from you and your employer</h3>
<p>Your deferrals plus the employer's money cannot exceed $72,000 a year, not counting catch-ups, and the match can only be figured on the first $360,000 of pay.</p>
<h3>The Roth catch-up rule</h3>
<p>New in 2026: if your FICA wages from the employer were over $150,000 in the prior year, your catch-up contributions must be made as Roth contributions. Regular deferrals up to $24,500 can still be pre-tax. The calculator treats Roth and pre-tax money the same, because the balance grows the same way; the difference shows up in the tax you pay on withdrawal.</p>
<p>The dollar limits are held at 2026 levels for future years. To see what a given rate means per paycheck, use the <a href="/401k-contribution-calculator">401(k) paycheck contribution calculator</a>.</p>`
    },
    {
      h2: 'How much do I need in my 401(k) to retire?',
      html: `<p>Work backward from the income you want, then subtract what other sources already cover.</p>
<h3>The 4% rule of thumb</h3>
<p>A portfolio can usually support a first-year withdrawal of about 4% of its value, raised with inflation after that, for roughly 30 years. So each $1,000 a month of income needs about $300,000 saved, and the example's $4,585 a month needs its $1,375,596.</p>
<h3>Social Security and pensions</h3>
<p>Your 401(k) rarely has to cover everything. Subtract Social Security and any pension from your target spending first, and size the 401(k) to the gap. The <a href="/retirement-calculator">retirement savings calculator</a> does that math, and the <a href="/social-security-calculator">Social Security benefits calculator</a> estimates the benefit side.</p>
<h3>Taxes on withdrawals</h3>
<p>Withdrawals from a traditional 401(k) are taxed as ordinary income, so $4,585 a month is before tax. Roth 401(k) withdrawals are tax-free once you are 59½ and the Roth account is at least five years old. Once you stop working, the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a> shows how far a given balance stretches at a chosen withdrawal.</p>`
    },
    {
      h2: 'Why is my 401(k) balance shown in today\'s dollars?',
      html: `<p>Because $1.4 million in 2056 will not buy what $1.4 million buys now. At 3% inflation prices rise about 2.4 times over 30 years, so the example's $1,375,596 has the buying power of $566,728 today, and its $4,585 monthly income feels like $1,889 does now.</p>
<p>That gap is easy to misread. If your current spending is $4,000 a month, the comparison that matters is $1,889 against $4,000, not $4,585 against $4,000. Raising the deferral, working longer or adding an IRA are the levers.</p>
<p>To plan entirely in today's money, set inflation to 0 and lower the return by the same amount: at 4% with no inflation the example reaches $786,945. Salary raises then represent real raises above inflation.</p>`
    },
    {
      h2: 'Does the employer match really make that much difference?',
      html: `<p>Yes, more than its size suggests.</p>
<h3>What the match is worth</h3>
<p>In the example the employer deposits $99,908 over 30 years, but each match dollar compounds alongside yours: with no match the same saver would retire with $1,093,857, so the match and its growth are worth $281,739 at 65. Deferring 4% instead of 6% leaves the saver with $906,031 instead of $1,187,770, the same $281,739 gap, because a lower rate cuts the match as well as your own deposits.</p>
<h3>Vesting</h3>
<p>Employer money may vest over three to six years, and leaving early forfeits the unvested part. Check the schedule before you change jobs late in a year.</p>
<h3>Per-paycheck matching and true-ups</h3>
<p>If you hit the annual limit before December, most plans stop matching for the rest of the year unless they do a year-end true-up. People working in schools, hospitals or charities usually have a <a href="/403b-calculator">403(b)</a> instead, and many government employees can add a <a href="/457-calculator">457(b)</a> on top of either plan.</p>`
    }
  ],
  faq: [
    { q: 'How much will my 401(k) be worth in 30 years?', a: 'About $1,375,596, if you start with $45,000, earn $70,000 with 3% yearly raises, defer 8%, get a 50% match on the first 6% and earn 7% a year. Change any input above to see your own figure.' },
    { q: 'How are 401(k) distributions calculated at retirement?', a: 'You choose how much to take, but a common starting point is 4% of the balance in the first year: $55,024 a year, or $4,585 a month, on $1,375,596. From age 73 the IRS sets a required minimum each year based on your balance and age.' },
    { q: 'Does this 401(k) calculator include Social Security?', a: 'No. It projects the 401(k) only. Estimate Social Security separately, subtract it and any pension from the income you need, and compare what is left with the monthly income figure above.' },
    { q: 'Does the 401(k) calculator adjust for inflation?', a: 'Yes. It shows the final balance in today\'s dollars as well: $1,375,596 in 30 years is worth about $566,728 now at 3% inflation. Set inflation to 0 to see future dollars only.' },
    { q: 'What rate of return should I use in a 401(k) calculator?', a: 'Many planners use 6–7% a year before inflation for a stock-heavy portfolio held for decades and 4–5% for a balanced or bond-heavy mix. Past returns are no guarantee; running 5% and 7% shows a sensible range.' },
    { q: 'Does this 401(k) calculator include taxes?', a: 'No. It projects the account balance before tax. Traditional 401(k) withdrawals are taxed as ordinary income; qualified Roth 401(k) withdrawals are tax-free. The <a href="/retirement-tax-calculator">retirement tax calculator</a> estimates the tax side.' },
    { q: 'Does a Roth 401(k) grow differently from a traditional 401(k)?', a: 'No, the balance grows at the same rate, so the projection is the same. The difference is tax: Roth deferrals are taxed now and qualified withdrawals are tax-free, while traditional deferrals cut your tax now and withdrawals are taxed later.' },
    { q: 'Is 15% of my salary enough for a 401(k)?', a: 'Often, if you start in your 20s or early 30s. In the example, 15% plus the match gives $2,032,989 at 65, about $6,777 a month at 4%. Starting later usually calls for more.' },
    { q: 'Is it too late to start a 401(k) at 45?', a: 'No. Starting from zero at 45 on a $70,000 salary with an 8% deferral and a 50% match on 6%, you would have about $411,141 by 65 at 7%. Catch-up contributions from 50 let you put in more if you can afford it.' },
    { q: 'How much less will I have if I retire at 62 instead of 65?', a: 'In the example, $1,075,095 at 62 against $1,375,596 at 65, about 22% less, from three fewer years of deposits and growth. The money also has to last three more years.' },
    { q: 'What happens if I contribute more than the 401(k) limit?', a: 'Your plan normally stops deductions at the limit. If you overshoot across two employers, ask for the excess and its earnings back by April 15 of the next year, or it is taxed twice.' },
    { q: 'Can I contribute to a 401(k) and an IRA in the same year?', a: 'Yes. The 2026 IRA limit is $7,500, or $8,600 at 50 and older, and is separate from the $24,500 401(k) limit. Income limits apply to Roth IRA contributions and to deducting traditional IRA contributions.' },
    { q: 'When can I take money out of my 401(k) without penalty?', a: 'At 59½, or at 55 or later if you leave the employer in or after the year you turn 55. Earlier withdrawals usually owe a 10% additional tax on top of income tax.' },
    { q: 'Should I count my employer match as part of my savings rate?', a: 'Most retirement guidelines, such as saving 15% of pay, include the employer match. In the example, an 8% deferral plus a 3% match is an 11% total savings rate.' }
  ],
  related: ['401k-contribution-calculator', 'retirement-calculator', 'roth-ira-calculator', 'early-withdrawal-penalty-calculator', 'how-long-will-money-last-calculator'],
  sources: [
    { name: 'IRS: 401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500', url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500' },
    { name: 'IRS: Retirement topics, 401(k) and profit-sharing plan contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits' },
    { name: 'IRS: Retirement topics, catch-up contributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions' },
    { name: 'IRS: 401(k) plans', url: 'https://www.irs.gov/retirement-plans/401k-plans' },
    { name: 'Investor.gov: Compound interest calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' }
  ],
  disclaimer: 'Projections assume a steady return and current law. Not investment advice; actual returns vary from year to year.'
};
