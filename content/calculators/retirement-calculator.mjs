export default {
  slug: 'retirement-calculator',
  hub: 'investing',
  name: 'Retirement Savings Calculator',
  title: 'How Much Do I Need to Retire? Calculator: $900,000 Example',
  h1: 'Retirement Savings Calculator: Your Target Nest Egg and Monthly Savings',
  meta: 'Need $60,000 a year with $24,000 from Social Security? At a 4% withdrawal rate that takes $900,000 in today\'s dollars. See your number and monthly savings.',
  keyword: 'how much do i need to retire calculator',
  also: ['retirement savings calculator', 'how much do you need in retirement calculator', 'how to calculate retirement amount', 'how much do i need to retire', 'how much should i save for retirement per month', 'is 1 million enough to retire'],
  updated: '2026-11-13',
  inputs: [
    { id: 'age', label: 'Current age', type: 'number', value: 35 },
    { id: 'retAge', label: 'Retirement age', type: 'number', value: 65 },
    { id: 'spend', label: 'Yearly spending in retirement (today\'s $)', type: 'number', value: 60000, prefix: '$', help: 'Many people start from 70–80% of current pre-tax income.' },
    { id: 'income', label: 'Social Security and pensions per year (today\'s $)', type: 'number', value: 24000, prefix: '$' },
    { id: 'wr', label: 'Withdrawal rate', type: 'number', value: 4, suffix: '%' },
    { id: 'saved', label: 'Retirement savings so far', type: 'number', value: 50000, prefix: '$' },
    { id: 'ret', label: 'Expected return before retirement', type: 'number', value: 7, suffix: '%' },
    { id: 'infl', label: 'Inflation', type: 'number', value: 3, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.age >= 0) || !(v.retAge > v.age)) return { error: 'Enter a retirement age above your current age.' };
    if (!(v.spend > 0)) return { error: 'Enter how much you expect to spend each year in retirement.' };
    if (!(v.wr > 0) || v.wr > 20) return { error: 'Enter a withdrawal rate between 0 and 20%.' };
    var inc = v.income > 0 ? v.income : 0, saved = v.saved > 0 ? v.saved : 0;
    var ret = isNaN(v.ret) ? 0 : v.ret, inf = isNaN(v.infl) ? 0 : v.infl;
    var gapYr = v.spend - inc;
    if (gapYr <= 0) return { value: '$0', label: 'Savings needed', rows: [['Income covers spending', 'Yes', true]], sub: 'Social Security and pensions cover the spending you entered.' };
    var years = v.retAge - v.age, n = Math.round(years * 12);
    var target = gapYr / (v.wr / 100);
    var nominal = target * Math.pow(1 + inf / 100, years);
    var i = Math.pow(1 + ret / 100, 1 / 12) - 1;
    var fvSaved = saved * Math.pow(1 + i, n);
    var pmt = nominal > fvSaved ? (Math.abs(i) < 1e-12 ? (nominal - fvSaved) / n : (nominal - fvSaved) * i / (Math.pow(1 + i, n) - 1)) : 0;
    var rr = (1 + ret / 100) / (1 + inf / 100) - 1, ir = Math.pow(1 + rr, 1 / 12) - 1;
    var fvReal = saved * Math.pow(1 + ir, n);
    var pmtR = target > fvReal ? (Math.abs(ir) < 1e-12 ? (target - fvReal) / n : (target - fvReal) * ir / (Math.pow(1 + ir, n) - 1)) : 0;
    return {
      value: H.money0(target),
      label: 'Nest egg needed, in today\'s dollars',
      expr: H.money0(gapYr) + '/yr ÷ ' + H.num(v.wr, 2) + '%',
      rows: [
        ['Same target in ' + H.num(years, 1) + ' years (with inflation)', H.money0(nominal)],
        ['Your current savings grow to', H.money0(fvSaved)],
        ['Monthly savings needed (fixed amount)', H.money0(pmt), true],
        ['Or start at, and raise with inflation', H.money0(pmtR) + '/mo'],
        ['Multiple of yearly gap', '× ' + H.num(100 / v.wr, 1)]
      ],
      sub: pmt === 0 ? 'Your savings are on track to reach the target with no new contributions.' : 'Saving ' + H.money0(pmt * 12) + ' a year closes the gap by age ' + H.num(v.retAge, 0) + '.'
    };
  },
  quick: ({ r }) => `To retire on <strong>$60,000 a year</strong> with <strong>$24,000</strong> coming from Social Security, you need savings that cover the $36,000 gap. At a 4% withdrawal rate that is 25 × $36,000 = <strong>${r.value}</strong> in today's dollars, or about $2.18 million by age 65 with 3% inflation. A 35-year-old with $50,000 saved needs to invest about <strong>$1,543 a month</strong> at 7%.`,
  stepsTitle: 'How to calculate how much you need to retire',
  steps: [
    'Estimate yearly spending in retirement in today\'s dollars. Start from your current budget, drop work costs and the mortgage if it will be paid off, and add health care. Medicare premiums, deductibles and dental care are the most commonly underestimated items.',
    'Subtract guaranteed income: Social Security (your estimate is in your my Social Security account at ssa.gov), pensions and annuities. What is left is the yearly gap your savings must fill.',
    'Divide the gap by your withdrawal rate. At 4% that is 25 times the gap; at 3.5%, about 28.6 times. This is your nest egg in today\'s dollars.',
    'Enter your current savings and expected return to get the monthly amount to invest from now until retirement.'
  ],
  formulaTitle: 'What is the formula for a retirement number?',
  formula: {
    expr: 'Nest egg = (Spending − Guaranteed income) ÷ Withdrawal rate<br>Monthly saving = (Target<sub>future</sub> − Savings × (1 + i)<sup>n</sup>) × i ÷ [(1 + i)<sup>n</sup> − 1]',
    vars: [['Target<sub>future</sub>', 'nest egg × (1 + inflation)<sup>years</sup>'], ['i', 'monthly return = (1 + annual return)<sup>1/12</sup> − 1'], ['n', 'months until retirement']],
    note: 'The "raise with inflation" figure uses the real return, (1 + return) ÷ (1 + inflation) − 1, and keeps every amount in today\'s dollars.'
  },
  example: `<p>Maya is 35, has $50,000 saved and wants $60,000 a year in retirement at 65. She expects $24,000 a year from Social Security.</p>
<p>Gap = $60,000 − $24,000 = $36,000. Nest egg = $36,000 ÷ 0.04 = <strong>$900,000</strong> in today's dollars. With 3% inflation over 30 years that is $900,000 × 1.03<sup>30</sup> = <strong>$2,184,536</strong> at 65.</p>
<p>Her $50,000 at 7% grows to $380,613, leaving $1,803,923 to build. Monthly rate i = 0.565%, n = 360, so she needs about <strong>$1,543 a month</strong>. If she prefers to start lower and raise contributions with inflation, she can begin at $1,106 a month.</p>`,
  table: {
    title: 'How much do you need to retire for each income level?',
    intro: 'Nest egg (today\'s dollars) for the yearly income you need from savings, after Social Security, at four withdrawal rates. Computed by the calculator above.',
    head: ['Yearly income from savings', '3%', '3.5%', '4%', '5%'],
    rows: ({ run, H }) => [20000, 30000, 40000, 50000, 60000, 80000, 100000].map(g => [H.money0(g), ...[3, 3.5, 4, 5].map(w => run({ spend: g, income: 0, wr: w }).value)]),
    note: 'A lower withdrawal rate is safer for early retirees or retirements longer than 30 years. 5% suits shorter horizons or people willing to cut spending after bad markets.'
  },
  sections: [
    {
      h2: 'How much should I save each month at my age?',
      html: `<p>Starting from zero, here is the fixed monthly investment needed to reach the $900,000 (today's dollars) target from the example by 65, at a 7% return and 3% inflation:</p>
<div class="twrap"><table><thead><tr><th>Start at age</th><th>Fixed monthly amount</th><th>Or start at (raised yearly)</th></tr></thead><tbody>
<tr><td>25</td><td>$1,188</td><td>$797</td></tr>
<tr><td>30</td><td>$1,480</td><td>$1,024</td></tr>
<tr><td>35</td><td>$1,868</td><td>$1,340</td></tr>
<tr><td>40</td><td>$2,407</td><td>$1,798</td></tr>
<tr><td>45</td><td>$3,203</td><td>$2,505</td></tr>
<tr><td>50</td><td>$4,507</td><td>$3,712</td></tr>
<tr><td>55</td><td>$7,071</td><td>$6,172</td></tr>
</tbody></table></div>
<p>Waiting ten years from 25 to 35 raises the monthly amount by about 57%; waiting from 45 to 55 more than doubles it. In 2026 you can put up to $24,500 a year into a 401(k) ($8,000 more from age 50, or $11,250 more at ages 60–63) and $7,500 into an IRA ($8,600 at 50+).</p>`
    },
    {
      h2: 'How does Social Security change my retirement number?',
      html: `<p>Every dollar of guaranteed income cuts the savings you need by 25 dollars at a 4% withdrawal rate. A $2,000 monthly Social Security benefit ($24,000 a year) is worth $600,000 of savings. Claiming at 70 instead of 62 raises your benefit substantially for life, which is one of the cheapest ways to shrink the nest egg you need. The <a href="/social-security-calculator">Social Security calculator</a> explains how benefits are figured.</p>`
    },
    {
      h2: 'Is $1 million enough to retire?',
      html: `<p>At a 4% withdrawal rate, $1 million supports $40,000 a year, rising with inflation, on top of Social Security. With an average-sized benefit that is roughly $60,000 to $70,000 a year of total income for a single retiree, and more for a couple with two benefits. It is plenty in a low-cost area with a paid-off home and tight for someone with rent and high health costs. To test a specific spending plan against $1 million, run it through the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a>.</p>`
    },
    {
      h2: 'Should the target be in today\'s dollars or future dollars?',
      html: `<p>Plan in today's dollars; that is the number you can compare with your current budget. But the account balance you will see at 65 is in future dollars, which is why the calculator also shows the inflated target. At 3% inflation, prices roughly double every 24 years, so $900,000 of today's buying power is about $2.2 million on a statement 30 years from now. Both describe the same lifestyle.</p>`
    }
  ],
  faq: [
    { q: 'How much do I need to retire at 65?', a: 'Multiply the yearly income you need from savings (spending minus Social Security and pensions) by 25 for a 4% withdrawal rate. Needing $36,000 a year from savings means a $900,000 nest egg in today\'s dollars.' },
    { q: 'What is the 80% rule for retirement?', a: 'A rule of thumb that you will need about 70–80% of your pre-retirement income each year, because work costs, payroll taxes and retirement saving stop. Your own budget is a better guide than the rule.' },
    { q: 'How much should I have saved by 40?', a: 'Fidelity\'s widely quoted guideline is about 3 times your salary by 40, 6 times by 50 and 10 times by 67. It is a rough benchmark; the calculator gives a target based on your actual spending.' },
    { q: 'Is the 4% withdrawal rate safe?', a: 'It has historically lasted 30 years with a balanced stock and bond portfolio. For retirements longer than 30 years, many planners use 3–3.5%, which raises the target to 28.6–33.3 times your yearly gap.' },
    { q: 'Does this include taxes?', a: 'Enter spending including the taxes you will pay on withdrawals. Traditional 401(k) and IRA withdrawals are taxed as income; Roth withdrawals generally are not after age 59½ and five years.' },
    { q: 'What return should I assume before retirement?', a: 'A stock-heavy portfolio is often modeled at 6–8% a year before inflation over long periods, and less as you shift to bonds. A lower assumption gives a safer monthly savings target.' },
    { q: 'When can I afford to retire?', a: 'Use the when can I retire calculator: it takes your savings and contributions and finds the age at which you reach your target.' }
  ],
  related: ['retirement-age-calculator', 'how-long-will-money-last-calculator', 'fire-calculator', '401k-contribution-calculator', 'social-security-calculator'],
  sources: [
    { name: 'IRS: 401(k) contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits' },
    { name: 'IRS: IRA contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits' },
    { name: 'Social Security Administration: Retirement age and benefit reduction', url: 'https://www.ssa.gov/benefits/retirement/planner/agereduction.html' },
    { name: 'CFPB: Planning for retirement', url: 'https://www.consumerfinance.gov/consumer-tools/retirement/' }
  ],
  disclaimer: 'Illustration only, not investment advice. Returns and inflation will vary.'
};
