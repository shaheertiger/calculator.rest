export default {
  slug: '401k-retirement-calculator',
  hub: 'planning',
  name: '401(k) Retirement Calculator',
  title: '401(k) Retirement Calculator: 8% of $70K Grows to $1.38M',
  h1: '401(k) Calculator: What Your Account Will Be Worth When You Retire',
  meta: 'Saving 8% of a $70,000 salary with a 50% match on 6% grows $45,000 to $1,375,596 by 65, about $4,585 a month at 4%. Uses 2026 IRS limits.',
  keyword: '401k retirement calculator',
  also: ['retirement calculator 401k', '401k calculator retirement', 'retirement 401k calculator', '401k retirement calculators', '401k calculator for retirement', '401k retirement savings calculator', 'calculate 401k balance at retirement', 'calculate my 401k at retirement', 'how much will my 401k be worth calculator', 'how much in 401k to retire calculator'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Your age now', type: 'number', value: 35 },
    { id: 'retAge', label: 'Age you plan to retire', type: 'number', value: 65 },
    { id: 'bal', label: 'Current 401(k) balance', type: 'number', value: 45000, prefix: '$' },
    { id: 'salary', label: 'Annual salary (gross)', type: 'number', value: 70000, prefix: '$' },
    { id: 'pct', label: 'You contribute', type: 'number', value: 8, suffix: '% of pay', help: 'Traditional and Roth 401(k) deferrals combined.' },
    { id: 'mrate', label: 'Employer matches', type: 'number', value: 50, suffix: '% of your deferral' },
    { id: 'mcap', label: 'On the first', type: 'number', value: 6, suffix: '% of pay' },
    { id: 'raise', label: 'Annual raise', type: 'number', value: 3, suffix: '%' },
    { id: 'ret', label: 'Annual return before retirement', type: 'number', value: 7, suffix: '%' },
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
  quick: ({ r }) => `A 401(k) retirement calculator projects your balance from your salary, contribution rate, employer match and return. A 35-year-old with $45,000 saved, earning $70,000 with 3% raises, deferring 8% and getting a 50% match on the first 6%, reaches <strong>${r.value}</strong> by 65 at a 7% return. That is ${r.rows[0][1]} in today's dollars and supports about <strong>$4,585 a month</strong> at a 4% withdrawal rate.`,
  stepsTitle: 'How to calculate your 401(k) balance at retirement',
  steps: [
    'Enter your age, the age you plan to stop working and what is in the account today. Use the vested balance if you might leave the employer before the match fully vests.',
    'Enter your gross salary and the percentage you defer. Count traditional and Roth 401(k) deferrals together; they share one IRS limit.',
    'Copy the match formula from your plan documents. "50% up to 6%" means a 50% match on the first 6% of pay you defer. The calculator caps the match at the share of pay the employer actually matches.',
    'Set a raise, a return and inflation. The step people get wrong is the return: a long-run 7% before inflation is a common planning figure for a stock-heavy mix, but use 5–6% if you hold a lot of bonds or want a margin of safety.',
    'Read two numbers, not one: the balance in future dollars (what your statement will say) and the same balance in today\'s dollars (what it will feel like). Plan your retirement budget off the second.'
  ],
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
      h2: 'How much will my 401(k) be worth when I retire?',
      html: `<p>Mostly it depends on how many years the money compounds, then on how much goes in. Using the same $70,000 salary, 8% deferral, 50% match on 6%, 7% return and retirement at 65, but starting from a $0 balance:</p>
<div class="twrap"><table><thead><tr><th>Start saving at</th><th>Balance at 65</th><th>Monthly income at 4%</th></tr></thead><tbody>
<tr><td>25</td><td>$2,333,553</td><td>$7,779</td></tr>
<tr><td>35</td><td>$1,033,045</td><td>$3,443</td></tr>
<tr><td>45</td><td>$411,141</td><td>$1,370</td></tr>
<tr><td>55</td><td>$124,172</td><td>$414</td></tr>
</tbody></table></div>
<p>Ten extra years at the start more than doubles the result, because the earliest dollars get the most years of growth. Starting late can be offset only partly: a 55-year-old earning $120,000 with $300,000 saved who defers 25% reaches $1,118,892 by 65, and hits the deferral cap in six of those ten years.</p>
<p>The return matters too. In the default example, 5% a year gives $942,175, 6% gives $1,135,157 and 8% gives $1,675,704. Working two more years, to 67, lifts the 7% result to $1,615,543.</p>`
    },
    {
      h2: 'What are the 401(k) contribution limits for 2026?',
      html: `<p>The IRS announced these figures for 2026:</p>
<ul><li><strong>Elective deferral limit:</strong> $24,500 (up from $23,500 in 2025). It covers traditional and Roth 401(k) deferrals combined, across every 401(k) and 403(b) you contribute to that year.</li>
<li><strong>Catch-up at 50 and older:</strong> $8,000 more, so $32,500 in total.</li>
<li><strong>Catch-up at 60, 61, 62 or 63:</strong> $11,250 instead of $8,000, so $35,750. It drops back to $8,000 the year you turn 64.</li>
<li><strong>Total from you and your employer:</strong> $72,000, not counting catch-ups.</li></ul>
<p>Also new in 2026: if your Social Security (FICA) wages from the employer were over $150,000 in the prior year, your catch-up contributions must be made as Roth contributions. Regular deferrals up to $24,500 can still be pre-tax. The calculator treats Roth and pre-tax money the same, because the balance grows the same way; the difference shows up in the tax you pay on withdrawal.</p>
<p>The calculator applies the limit for your age in each projected year and holds the 2026 dollar amounts flat. To see what any rate means per paycheck, use the <a href="/401k-contribution-calculator">401(k) paycheck contribution calculator</a>.</p>`
    },
    {
      h2: 'How much do I need in my 401(k) to retire?',
      html: `<p>Work backward from income. The 4% rule of thumb says a portfolio can support a first-year withdrawal of about 4% of its value, raised with inflation after that, for roughly 30 years. So each $1,000 a month of income needs about $300,000 saved, and $4,585 a month needs the $1,375,596 in the example.</p>
<p>Your 401(k) rarely has to cover everything. Subtract Social Security and any pension from your target spending first, and size the 401(k) to the gap. The <a href="/retirement-calculator">retirement savings calculator</a> does that math, and the <a href="/social-security-calculator">Social Security benefits calculator</a> estimates the benefit side.</p>
<p>Withdrawals from a traditional 401(k) are taxed as ordinary income, so $4,585 a month is before tax. Roth 401(k) withdrawals are tax-free once you are 59½ and the Roth account is at least five years old. Once you stop working, the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a> shows how far a given balance stretches at a chosen withdrawal.</p>`
    },
    {
      h2: 'Why is my 401(k) balance shown in today\'s dollars?',
      html: `<p>Because $1.4 million in 2056 will not buy what $1.4 million buys now. At 3% inflation prices rise about 2.4 times over 30 years, so the example's $1,375,596 has the buying power of $566,728 today, and its $4,585 monthly income feels like $1,889 does now.</p>
<p>That gap is easy to misread. If your current spending is $4,000 a month, the comparison that matters is $1,889 against $4,000, not $4,585 against $4,000. Raising the deferral, working longer or adding an IRA are the levers; the <a href="/roth-ira-calculator">Roth IRA calculator</a> shows what an extra $7,500 a year adds outside the plan.</p>
<p>To plan entirely in today's money, set inflation to 0 and lower the return by the same amount (7% becomes about 4%). Salary raises then represent real raises above inflation.</p>`
    },
    {
      h2: 'Does the employer match really make that much difference?',
      html: `<p>Yes, more than its size suggests. In the example the employer deposits $99,908 over 30 years, but each match dollar compounds alongside yours: with no match the same saver would retire with $1,093,857, so the match and its growth are worth $281,739 at 65. Deferring 4% instead of 6% cuts the match by a third as well as your own deposits, and the table above shows the 4% saver ends up $281,739 behind the 6% saver too, because both changes remove three points of pay a year.</p>
<p>Check two details in your plan. First, vesting: employer money may vest over three to six years, and leaving early forfeits the unvested part. Second, timing: if you hit the annual limit before December, most plans stop matching unless they do a year-end true-up. People working in schools, hospitals or charities usually have a <a href="/403b-calculator">403(b)</a> instead, and many government employees can add a <a href="/457-calculator">457(b)</a> on top of either plan.</p>`
    }
  ],
  faq: [
    { q: 'How much will my 401(k) be worth in 30 years?', a: 'With $45,000 today, a $70,000 salary rising 3% a year, an 8% deferral, a 50% match on 6% and a 7% return, about $1,375,596. Change any input above to see your own figure.' },
    { q: 'What rate of return should I use in a 401(k) calculator?', a: 'Many planners use 6–7% a year before inflation for a stock-heavy portfolio held for decades and 4–5% for a balanced or bond-heavy mix. Past returns are no guarantee; running 5% and 7% shows a sensible range.' },
    { q: 'Does this 401(k) calculator include taxes?', a: 'No. It projects the account balance before tax. Traditional 401(k) withdrawals are taxed as ordinary income; qualified Roth 401(k) withdrawals are tax-free. The retirement tax calculator estimates the tax side.' },
    { q: 'Is 15% of my salary enough for a 401(k)?', a: 'Often, if you start in your 20s or early 30s. In the example, 15% plus the match gives $2,032,989 at 65, about $6,777 a month at 4%. Starting later usually calls for more.' },
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
