export default {
  slug: '401k-contribution-calculator',
  hub: 'planning',
  name: '401(k) Paycheck Contribution Calculator',
  seoTitle: '401(k) Contribution Calculator 2026: Per Paycheck + Match',
  meta: '6% of an $85,000 salary is $196.15 per biweekly paycheck ($5,100 a year), plus $98.08 of 50% match. See your take-home drop and the 2026 $24,500 limit.',
  intro: 'Plug in your salary, pay schedule, contribution rate and match formula, and we\'ll show you how much goes into your 401(k) each paycheck, what your employer adds and how much less you take home.',
  keyword: 'how to calculate 401k contribution on paycheck',
  also: ['401k contribution calculator', 'how to maximize employer 401k match calculator', '401k limit 2026', '401k paycheck calculator', 'how much should i contribute to my 401k'],
  updated: '2026-11-24',
  inputs: [
    { id: 'salary', label: 'Annual salary (gross)', type: 'number', value: 85000, prefix: '$', help: 'Yearly pay before taxes and deductions, from your offer letter or pay stub.' },
    { id: 'freq', label: 'Pay frequency', type: 'select', value: '26', options: [['52', 'Weekly (52)'], ['26', 'Every two weeks (26)'], ['24', 'Twice a month (24)'], ['12', 'Monthly (12)']], help: 'How often you are paid; your pay stub shows the pay period dates.' },
    { id: 'pct', label: 'Your contribution', type: 'number', value: 6, suffix: '% of pay', help: 'The deferral percentage you elected in your plan\'s website or enrollment form.' },
    { id: 'type', label: 'Contribution type', type: 'select', value: 'pre', options: [['pre', 'Traditional (pre-tax)'], ['roth', 'Roth (after-tax)']], help: 'Traditional lowers your taxable pay now; Roth is taxed now and withdrawn tax-free later.' },
    { id: 'rate', label: 'Federal + state income tax bracket', type: 'number', value: 22, suffix: '%', help: 'Used to estimate how much less take-home pay you see. Pre-tax deferrals still pay Social Security and Medicare tax.', showIf: { type: ['pre'] } },
    { id: 'age', label: 'Your age at the end of 2026', type: 'select', value: 'u50', options: [['u50', 'Under 50 ($24,500 limit)'], ['50', '50–59 or 64+ ($32,500 with catch-up)'], ['60', '60–63 ($35,750 with super catch-up)']], help: 'Sets your 2026 IRS limit, including any catch-up.' },
    { id: 'match', label: 'Employer match formula', type: 'select', value: 'partial', options: [['partial', 'Percent match up to a cap'], ['safe', '100% of first 3% + 50% of next 2%'], ['none', 'No match']], help: 'Find it in your summary plan description or benefits guide.' },
    { id: 'mrate', label: 'Employer matches', type: 'number', value: 50, suffix: '% of what you put in', showIf: { match: ['partial'] }, help: 'The first number in "50% up to 6%": cents added per dollar you defer.' },
    { id: 'mcap', label: 'On the first', type: 'number', value: 6, suffix: '% of your pay', showIf: { match: ['partial'] }, help: 'The second number in "50% up to 6%": the most of your pay that gets matched.' }
  ],
  data: { limit: { u50: 24500, '50': 32500, '60': 35750 }, comp: 360000, total: 72000 },
  compute(v, H, D) {
    if (!(v.salary > 0)) return { error: 'Enter your annual salary.' };
    if (!(v.pct >= 0) || v.pct > 100) return { error: 'Enter a contribution percentage between 0 and 100.' };
    var n = Number(v.freq) || 26;
    var limit = D.limit[v.age] || 24500;
    var gross = v.salary / n;
    var per = v.salary * v.pct / 100 / n;
    var wanted = per * n;
    var annual = Math.min(wanted, limit);
    var checks = per > 0 ? Math.min(n, Math.ceil(limit / per - 1e-9)) : 0;
    var capped = wanted > limit + 0.005;
    var mSal = Math.min(v.salary, D.comp);
    var mPct = 0;
    if (v.match === 'partial') mPct = (v.mrate > 0 ? v.mrate : 0) / 100 * Math.min(v.pct, v.mcap > 0 ? v.mcap : 0);
    else if (v.match === 'safe') mPct = Math.min(v.pct, 3) + 0.5 * Math.max(0, Math.min(v.pct, 5) - 3);
    var mPer = mSal * mPct / 100 / n;
    var mAnnual = capped ? mPer * checks : mPer * n;
    if (annual + mAnnual > D.total) mAnnual = Math.max(0, D.total - annual);
    var taxRate = v.type === 'pre' && v.rate > 0 ? v.rate / 100 : 0;
    var cut = per * (1 - taxRate);
    var maxPct = limit / v.salary * 100;
    var rows = [
      ['Employer match per paycheck', H.money(mPer)],
      ['Take-home pay goes down by', H.money(cut) + ' per check', true],
      ['Your contributions this year', H.money(annual, 0)],
      ['Employer match this year', H.money(mAnnual, 0)],
      ['Total going into the account', H.money(annual + mAnnual, 0), true],
      ['Rate needed to max out', H.pct(Math.min(maxPct, 100), 2) + ' (' + H.money(limit / n) + '/check)'],
      ['Gross pay per check', H.money(gross)]
    ];
    var sub;
    if (capped) sub = 'At this rate you reach the ' + H.money(limit, 0) + ' limit on paycheck ' + checks + ' of ' + n + ' and contributions stop. Ask whether your plan has a true-up, or the match stops too.';
    else if (v.match !== 'none' && ((v.match === 'partial' && v.pct < v.mcap) || (v.match === 'safe' && v.pct < 5))) sub = 'You are leaving match money on the table: contribute at least ' + (v.match === 'safe' ? '5' : H.num(v.mcap, 2)) + '% to collect the full employer match.';
    else sub = 'You are on pace for ' + H.money(annual, 0) + ' of the ' + H.money(limit, 0) + ' you can defer in 2026' + (v.match !== 'none' ? ' and you collect the full match.' : '.');
    return {
      value: H.money(per),
      label: 'Your contribution per paycheck',
      expr: H.money(gross) + ' × ' + H.num(v.pct, 2) + '%',
      rows: rows,
      sub: sub
    };
  },
  notes: {
    'Employer match per paycheck': 'What your employer adds each payday under the formula you chose.',
    'Take-home pay goes down by': 'Your deferral minus the income tax it saves; Roth deferrals cut pay dollar for dollar.',
    'Your contributions this year': 'Your deferrals for 2026, stopped at your IRS limit.',
    'Employer match this year': 'Match for the paychecks you contribute on, within the $72,000 total limit.',
    'Total going into the account': 'Your deferrals plus the employer match for the year.',
    'Rate needed to max out': 'The percentage, and amount per check, that reaches your 2026 limit by the last paycheck.',
    'Gross pay per check': 'Annual salary divided by the number of paychecks.'
  },
  assumptions: 'These calculations are estimates. They assume the same gross pay every paycheck, a match paid each pay period with no year-end true-up and one combined tax rate on pre-tax deferrals. Bonuses and your W-4 can change the real figures.',
  quick: ({ r }) => `To calculate a 401(k) contribution per paycheck, multiply your gross pay per check by your contribution rate. On an $85,000 salary paid every two weeks, gross pay is $3,269.23, so 6% is <strong>${r.value}</strong> per paycheck, or $5,100 a year. A 50% match on the first 6% adds $98.08 per check. The 2026 limit is <strong>$24,500</strong>.`,
  formulaTitle: 'What is the formula for a 401(k) paycheck deduction?',
  formula: {
    expr: 'Contribution per check = (Salary ÷ Paychecks) × Deferral %<br>Match per check = (Salary ÷ Paychecks) × Match rate × min(Deferral %, Match cap %)<br>Take-home change (pre-tax) = Contribution × (1 − Tax bracket)',
    vars: [['Paychecks', '52, 26, 24 or 12 a year'], ['Deferral %', 'the percentage you elect'], ['Match rate', 'how much the employer adds per dollar you defer, e.g. 50%'], ['Match cap %', 'the share of pay the employer will match, e.g. 6%']]
  },
  example: `<p>Jordan earns $85,000, is paid every two weeks, defers 6% pre-tax and is in the 22% federal bracket with no state income tax. The employer matches 50% of the first 6%.</p>
<p>Gross per check: $85,000 ÷ 26 = $3,269.23. Jordan's deferral: 6% × $3,269.23 = <strong>$196.15</strong>. Employer match: 50% × 6% × $3,269.23 = <strong>$98.08</strong>. Together $294.23 goes into the account every payday, $7,650 a year.</p>
<p>Because the $196.15 skips 22% federal income tax, Jordan's net pay drops by only $196.15 × 0.78 = <strong>$153.00</strong>. Social Security and Medicare tax still apply to the full $3,269.23.</p>`,
  table: {
    title: 'How much is each contribution rate per paycheck?',
    intro: 'Biweekly amounts on an $85,000 salary with a 50% match on the first 6% and a 22% tax bracket, from the calculator above.',
    head: ['You defer', 'Per paycheck', 'Match per check', 'Take-home drops by', 'Yearly total in'],
    rows: ({ run, H }) => [3, 4, 5, 6, 8, 10, 12, 15, 20, 30].map(p => {
      const r = run({ pct: p, salary: 85000, freq: '26', type: 'pre', rate: 22, age: 'u50', match: 'partial', mrate: 50, mcap: 6 });
      return [p + '%', r.value, r.rows[0][1], r.rows[1][1].replace(' per check', ''), r.rows[4][1]];
    }),
    note: 'At 30% the $24,500 limit is reached on the 25th paycheck, so the yearly total is capped. Your plan stops deductions automatically once you hit the limit.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>A paycheck deduction is simple arithmetic: gross pay per check times your percentage. The other boxes add the employer's share, the tax effect and the yearly limit.</p>
<h3>Annual salary</h3>
<p>Use gross pay, not take-home pay. Your plan applies your percentage before taxes come out, so entering net pay understates every figure. Bonuses and overtime usually count too, depending on how your plan defines compensation.</p>
<h3>Pay frequency</h3>
<p>The calculator divides your salary by the number of paychecks: 26 if paid every two weeks, 24 if paid twice a month. $85,000 ÷ 26 = $3,269.23 per check. Twice-a-month checks are larger, so the same percentage takes more from each one.</p>
<h3>Your contribution percentage</h3>
<p>Enter the rate you elected. 6% × $3,269.23 = $196.15. If your plan lets you elect a flat dollar amount instead, divide it by gross pay per check to get the percentage.</p>
<h3>Contribution type and tax bracket</h3>
<p>For traditional (pre-tax) deferrals, your take-home pay falls by less than the contribution, because you skip income tax on it. Enter your federal bracket plus your state rate. A Roth deferral reduces take-home pay dollar for dollar, so the bracket box disappears.</p>
<h3>Your age at the end of 2026</h3>
<p>This sets your limit: $24,500, or $32,500 at 50+ and $35,750 at 60–63. Use your age on December 31, even if your birthday is late in the year.</p>
<h3>Employer match formula</h3>
<p>"50% up to 6%" means the company adds half of what you defer, on deferrals up to 6% of pay: 3% × $3,269.23 = $98.08 a check. Choose the safe harbor option if your plan matches 100% of the first 3% and 50% of the next 2%, or "No match" if there is none.</p>`
    },
    {
      h2: 'How much is a 401(k) contribution on each pay schedule?',
      html: `<p>The yearly total is the same however often you are paid; only the size of each deduction changes. For a 6% deferral on $85,000 with a 50% match on the first 6% and a 22% bracket:</p>
<div class="twrap"><table><thead><tr><th>Paid</th><th>You put in per check</th><th>Match per check</th><th>Take-home drops by</th></tr></thead><tbody>
<tr><td>Weekly (52)</td><td>$98.08</td><td>$49.04</td><td>$76.50</td></tr>
<tr><td>Every two weeks (26)</td><td>$196.15</td><td>$98.08</td><td>$153.00</td></tr>
<tr><td>Twice a month (24)</td><td>$212.50</td><td>$106.25</td><td>$165.75</td></tr>
<tr><td>Monthly (12)</td><td>$425.00</td><td>$212.50</td><td>$331.50</td></tr>
</tbody></table></div>
<p>Every row adds up to $5,100 from you and $2,550 from the employer in 2026. Biweekly workers get a third paycheck in two months of the year, which some people use to test a higher rate before committing to it.</p>`
    },
    {
      h2: 'What is the 401(k) contribution limit for 2026?',
      html: `<p>The IRS set these 2026 limits in Notice 2025-67.</p>
<h3>Limits by age</h3>
<ul><li><strong>Employee deferrals:</strong> $24,500 (up from $23,500 in 2025). This applies to 401(k), 403(b), governmental 457 plans and the Thrift Savings Plan.</li>
<li><strong>Catch-up at 50+:</strong> another $8,000, for $32,500 in total.</li>
<li><strong>Super catch-up at 60–63:</strong> $11,250 instead of $8,000, for $35,750, if you turn 60, 61, 62 or 63 during 2026.</li></ul>
<h3>Limits that include the employer</h3>
<p>You and your employer together can put in $72,000 (catch-ups are on top of this), and the plan can count only the first $360,000 of compensation when it figures your percentage and match.</p>
<h3>Roth catch-ups for higher earners</h3>
<p>New for 2026: if your Social Security wages from the employer were over $150,000 in 2025, any catch-up contributions must go in as Roth (after-tax) money. Bonuses usually count as pay too, which is how people hit the limit early in the year.</p>`
    },
    {
      h2: 'How do you get the full employer match?',
      html: `<p>Contribute at least the match cap every paycheck. With "50% up to 6%", deferring 6% earns a 3% match; deferring 4% earns only 2%, so on $85,000 the employer adds $1,700 instead of $2,550, and $850 a year of free money is left behind.</p>
<h3>Common match formulas</h3>
<p>50% up to 6% (worth 3% of pay), 100% up to 3%, 100% up to 4%, and the safe harbor 100% of the first 3% plus 50% of the next 2% (worth 4% of pay for a 5% deferral). On $85,000, the safe harbor formula adds $3,400 a year if you defer 5%, but only $2,975 at 4% and $2,550 at 3%.</p>
<h3>Front-loading and true-ups</h3>
<p>Most plans match each paycheck separately, so if you hit $24,500 by October, the match stops for the rest of the year unless the plan has a year-end "true-up". At 30% of $85,000, the limit arrives on paycheck 25 of 26 and the match drops from $2,550 to $2,452. Check your summary plan description before raising your rate sharply.</p>
<h3>Vesting</h3>
<p>You may lose unvested match money if you leave early. Your plan's vesting schedule says how many years of service make the match yours.</p>`
    },
    {
      h2: 'Does contributing to a 401(k) lower your taxes?',
      html: `<h3>Traditional deferrals</h3>
<p>They come out before federal income tax (and state tax in most states). Jordan's $196.15 deferral lowers take-home pay by only $153.00 in the 22% bracket, a saving of $43.15 a check or about $1,122 a year. In the 12% bracket, take-home falls by $172.62. They do not reduce Social Security and Medicare tax, and you pay income tax later when you withdraw.</p>
<h3>Roth 401(k) deferrals</h3>
<p>These are taxed now and come out tax-free in retirement if the account is at least 5 years old and you are 59½ or older. Employer matches can be pre-tax or, if the plan allows, Roth. Either way, the match does not count against your $24,500.</p>
<h3>Which to choose</h3>
<p>A rough rule: choose pre-tax if you expect a lower bracket in retirement, Roth if you expect the same or higher. Many people split the difference between the two.</p>`
    },
    {
      h2: 'What percentage of your paycheck should go into a 401(k)?',
      html: `<p>Start with at least enough to get the full match; it is an instant 50% or 100% return. A common target for retirement saving is 15% of gross pay including the employer's share. On $85,000, 12% from you plus a 3% match gets there: $392.31 a check from you and $12,750 a year in total.</p>
<p>To max out in 2026 on a biweekly schedule, defer $942.31 per check ($24,500 ÷ 26), which is 28.82% of an $85,000 salary. If 15% is out of reach, many plans offer automatic escalation that raises your rate by 1 point a year. To see what any rate grows to by retirement, use the <a href="/401k-retirement-calculator">401(k) retirement calculator</a>; the <a href="/retirement-calculator">retirement calculator</a> checks whether you are on track overall.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my 401(k) contribution per paycheck?', a: 'Divide your salary by your number of paychecks, then multiply by your contribution rate. On $85,000 paid every two weeks, $3,269.23 × 6% = $196.15 per paycheck.' },
    { q: 'How do I calculate my 401(k) match?', a: 'Multiply your gross pay by the match rate and by the smaller of your contribution rate and the match cap. With a 50% match up to 6% on $85,000 paid biweekly, that is $98.08 a check, or $2,550 a year.' },
    { q: 'How much is 6% of $50,000 per paycheck?', a: 'On a $50,000 salary paid every two weeks, 6% is $115.38 per paycheck ($3,000 a year). Paid twice a month, it is $125.00 per paycheck.' },
    { q: 'How much does a 401(k) contribution reduce taxes?', a: 'A traditional deferral saves income tax at your bracket. A $196.15 biweekly deferral in the 22% bracket lowers take-home pay by only $153.00, saving about $1,122 of income tax a year.' },
    { q: 'How do I calculate a Roth 401(k) contribution on my paycheck?', a: 'The same way: gross pay per check times your rate, so 6% of $3,269.23 is $196.15. The difference is that a Roth deferral cuts your take-home pay by the full $196.15, because it is taxed first.' },
    { q: 'How much per paycheck to max out a 401(k) in 2026?', a: 'Divide $24,500 by your number of paychecks: $942.31 biweekly, $1,020.83 twice a month or $2,041.67 monthly. At 50+, use $32,500; at 60–63, $35,750.' },
    { q: 'Is the 401(k) limit per employer or per person?', a: 'The $24,500 deferral limit is per person for the year, across all 401(k) and 403(b) plans combined. If you change jobs, add up what you deferred at both employers.' },
    { q: 'Does the employer match count toward the $24,500 limit?', a: 'No. The match counts only toward the $72,000 total limit on all contributions for 2026. Your own deferrals are what the $24,500 caps.' },
    { q: 'Is 401(k) contribution based on gross or net pay?', a: 'Gross pay. Your percentage is applied to pay before taxes. Whether bonuses, overtime and commissions count depends on how your plan defines compensation.' },
    { q: 'What happens if I contribute more than the limit?', a: 'Ask the plan to return the excess deferral, plus its earnings, by April 15 of the next year. Left in, the excess is taxed twice: once in the year deferred and again when withdrawn.' },
    { q: 'Who gets the $11,250 super catch-up?', a: 'Workers who turn 60, 61, 62 or 63 during the year and whose plan offers catch-up contributions. At 64 the catch-up drops back to the regular $8,000.' },
    { q: 'Can I contribute to a 401(k) and a Roth IRA?', a: 'Yes. The IRA limit of $7,500 in 2026 ($8,600 at 50+) is separate. Roth IRA eligibility depends on your modified AGI; pre-tax 401(k) deferrals lower it.' }
  ],
  related: ['401k-retirement-calculator', '403b-calculator', 'roth-ira-calculator', 'magi-calculator', 'early-withdrawal-penalty-calculator'],
  sources: [
    { name: 'IRS: 401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500', url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500' },
    { name: 'IRS: COLA increases for dollar limitations on benefits and contributions', url: 'https://www.irs.gov/retirement-plans/cola-increases-for-dollar-limitations-on-benefits-and-contributions' },
    { name: 'IRS: Retirement topics, 401(k) and profit-sharing plan contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits' },
    { name: 'IRS: Retirement topics, catch-up contributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions' },
    { name: 'IRS: Retirement plans FAQs on designated Roth accounts', url: 'https://www.irs.gov/retirement-plans/retirement-plans-faqs-on-designated-roth-accounts' }
  ],
  disclaimer: 'Take-home figures are estimates; your payroll withholding depends on your W-4 and state.'
};
