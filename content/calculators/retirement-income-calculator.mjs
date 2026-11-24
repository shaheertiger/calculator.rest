export default {
  slug: 'retirement-income-calculator',
  hub: 'income',
  name: 'Retirement Income Calculator',
  title: 'Retirement Income Calculator: Is $4,500 a Month Enough?',
  h1: 'Retirement Income Calculator: Add Up Every Paycheck You Will Have After Work',
  meta: 'Social Security, a pension, 4% of $450,000 and side income add up to $4,500 a month, $500 short of $5,000 in costs. Find your own gap or surplus.',
  keyword: 'retirement income calculator',
  also: ['retirement monthly income calculator', 'monthly retirement income calculator', 'calculate retirement income', 'how to calculate retirement income', 'retirement income calculator with social security', 'retirement income calculator with pension', 'estimated retirement income calculator', 'retirement income gap calculator', 'monthly retirement income calculator including social security'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'ss', label: 'Social Security per month', type: 'number', value: 2200, prefix: '$', help: 'Your estimate at the age you plan to claim, from your my Social Security account. Add a spouse\'s benefit for a household figure.' },
    { id: 'pension', label: 'Pension or annuity per month', type: 'number', value: 500, prefix: '$' },
    { id: 'savings', label: 'Retirement savings balance', type: 'number', value: 450000, prefix: '$', help: '401(k), IRA, brokerage and cash you will draw from.' },
    { id: 'wr', label: 'Withdrawal rate from savings', type: 'number', value: 4, suffix: '%', help: '4% a year is the common starting point for a 30-year retirement.' },
    { id: 'other', label: 'Part-time, rental or other income per month', type: 'number', value: 300, prefix: '$' },
    { id: 'expenses', label: 'Monthly expenses in retirement', type: 'number', value: 5000, prefix: '$', help: 'Include taxes you expect to pay on this income.' },
    { id: 'pre', label: 'Pre-retirement income per year (gross)', type: 'number', value: 75000, prefix: '$', help: 'Used for the replacement ratio. Leave blank to skip.' }
  ],
  compute(v, H) {
    function n0(x) { return x > 0 ? x : 0; }
    var ss = n0(v.ss), pen = n0(v.pension), sav = n0(v.savings), oth = n0(v.other), exp = n0(v.expenses);
    var wr = v.wr;
    if (sav > 0 && !(wr > 0 && wr <= 20)) return { error: 'Enter a withdrawal rate between 0 and 20%.' };
    if (!(wr > 0)) wr = 4;
    var fromSav = sav * wr / 100 / 12;
    var total = ss + pen + fromSav + oth;
    if (!(total > 0)) return { error: 'Enter at least one source of retirement income.' };
    var gap = total - exp;
    var rows = [
      ['Social Security', H.money0(ss) + '/mo'],
      ['Pension or annuity', H.money0(pen) + '/mo'],
      ['From savings (' + H.num(wr, 2) + '% of ' + H.money0(sav) + ')', H.money0(fromSav) + '/mo'],
      ['Part-time, rental and other', H.money0(oth) + '/mo'],
      ['Yearly retirement income', H.money0(total * 12)]
    ];
    if (exp > 0) rows.push([gap >= 0 ? 'Surplus over expenses' : 'Gap below expenses', (gap >= 0 ? '+' : '−') + H.money0(Math.abs(gap)) + '/mo', true]);
    if (v.pre > 0) rows.push(['Replacement ratio (of ' + H.money0(v.pre) + ' a year)', H.pct(total * 12 / v.pre * 100, 1)]);
    rows.push(['Guaranteed share (Social Security + pension)', H.pct((ss + pen) / total * 100, 0)]);
    var extra = 0, needRate = 0;
    if (exp > 0 && gap < 0) {
      extra = -gap * 12 / (wr / 100);
      rows.push(['Extra savings to close the gap at ' + H.num(wr, 2) + '%', H.money0(extra), true]);
      if (sav > 0) { needRate = (exp - ss - pen - oth) * 12 / sav * 100; rows.push(['Withdrawal rate that would cover expenses', H.pct(needRate, 2)]); }
    }
    var sub;
    if (!(exp > 0)) sub = 'Enter your monthly expenses to see a gap or surplus.';
    else if (gap >= 0) sub = 'Your income covers your expenses with ' + H.money0(gap) + ' a month to spare.';
    else sub = 'You are ' + H.money0(-gap) + ' a month short; closing it takes about ' + H.money0(extra) + ' more in savings, ' + H.money0(-gap) + ' a month of extra income, or lower spending.';
    return {
      value: H.money0(total) + '/mo',
      label: 'Total monthly retirement income',
      expr: H.money0(ss) + ' + ' + H.money0(pen) + ' + ' + H.money0(fromSav) + ' + ' + H.money0(oth),
      rows: rows,
      total: total, gap: gap, extra: extra,
      sub: sub
    };
  },
  quick: ({ r }) => `A retiree with <strong>$2,200</strong> of Social Security, a <strong>$500</strong> pension, <strong>$450,000</strong> saved (4% a year is $1,500 a month) and $300 of part-time pay has <strong>${r.value}</strong> of retirement income. Against $5,000 of monthly expenses that is a <strong>$500 gap</strong>, which takes about <strong>$150,000</strong> more in savings to close. It replaces 72% of a $75,000 salary.`,
  stepsTitle: 'How to calculate your retirement income',
  steps: [
    'Look up your Social Security estimate in your my Social Security account at ssa.gov. Use the figure for the age you actually plan to claim: the age-62 amount can be 30% below the full-retirement-age amount.',
    'Add any pension or annuity at its monthly payout. If you will choose a joint-and-survivor option, enter that smaller amount, not the single-life one.',
    'Enter the savings you will draw on and a withdrawal rate. The calculator turns the balance into a monthly paycheck: balance × rate ÷ 12. Most people get this step wrong by treating the whole balance as spendable, or by assuming 7–8% a year can be withdrawn safely.',
    'Add steady side income such as part-time work, rent from a property or royalties. Leave out one-off windfalls.',
    'Enter monthly expenses, including income tax and health insurance premiums, and your gross pre-retirement income to see the gap or surplus and your replacement ratio.'
  ],
  formulaTitle: 'What is the formula for monthly retirement income?',
  formula: {
    expr: 'Monthly income = SS + Pension + (Savings × WR ÷ 12) + Other<br>Gap = Expenses − Monthly income · Extra savings = Gap × 12 ÷ WR<br>Replacement ratio = Monthly income × 12 ÷ Pre-retirement income',
    vars: [['SS', 'monthly Social Security benefit'], ['WR', 'yearly withdrawal rate as a decimal (4% = 0.04)'], ['Other', 'part-time, rental and other regular income'], ['Pre-retirement income', 'gross yearly pay in the last years before you stop working']],
    note: 'All amounts are in today\'s dollars and before income tax. Social Security and many government pensions rise with inflation each year; most private pensions do not, so a fixed pension buys less every year.'
  },
  example: `<p>Linda, 66, has a Social Security estimate of $2,200 a month, a $500 pension from an old employer, $450,000 in a 401(k) and IRA, and earns about $300 a month tutoring. Her budget is $5,000 a month. She earned $75,000 a year before retiring.</p>
<p>Savings: $450,000 × 0.04 ÷ 12 = <strong>$1,500</strong> a month. Total: $2,200 + $500 + $1,500 + $300 = <strong>$4,500</strong> a month, or $54,000 a year. Replacement ratio: $54,000 ÷ $75,000 = <strong>72%</strong>.</p>
<p>Her gap is $5,000 − $4,500 = <strong>$500</strong> a month, or $6,000 a year. At a 4% withdrawal rate, $6,000 ÷ 0.04 = <strong>$150,000</strong> of extra savings would cover it. Without more savings she would need to draw 5.33% a year, which raises the risk of running short in a long retirement. Two other fixes: delaying Social Security from 67 to 70 raises a $2,200 benefit by 24% to about $2,728 a month, or trimming $500 from the budget.</p>`,
  table: {
    title: 'How much monthly income will my savings give me?',
    intro: 'Monthly income from savings alone at five withdrawal rates, computed by the calculator above. Add Social Security, pensions and other income on top.',
    head: ['Savings', '3%', '3.5%', '4%', '4.5%', '5%'],
    rows: ({ run }) => [100000, 250000, 450000, 500000, 750000, 1000000, 1500000, 2000000].map(b => ['$' + b.toLocaleString('en-US'), ...[3, 3.5, 4, 4.5, 5].map(w => run({ savings: b, ss: 0, pension: 0, other: 0, wr: w }).value)]),
    note: 'Each figure is balance × rate ÷ 12. The 4% column is the classic starting point for a 30-year retirement; 3–3.5% suits retiring in your 50s, and 5% suits shorter horizons or a willingness to cut spending after weak markets.'
  },
  sections: [
    {
      h2: 'What is a good retirement income replacement ratio?',
      html: `<p>A replacement ratio is your retirement income as a share of your gross pay before you stopped working. The Social Security Administration notes that most financial advisers suggest about <strong>70% to 80%</strong> of pre-retirement income, from all sources combined, to live comfortably. The ratio can be lower than 100% because payroll tax, commuting and retirement contributions disappear, and often the mortgage too.</p>
<p>Social Security alone covers less than half of that for most people. SSA says it replaces about 40% of an average earner's pre-retirement earnings, more for low earners and less for high earners. The rest has to come from pensions, savings and work. In the example, 72% sits inside the usual range, yet Linda is still $500 a month short, because her budget is high relative to her old salary. Treat the ratio as a check, and your own budget as the deciding number.</p>`
    },
    {
      h2: 'How do I close a retirement income gap?',
      html: `<p>A shortfall can be fixed from either side of the ledger. Using the $500-a-month gap from the example:</p>
<ul>
<li><strong>Delay Social Security.</strong> Each year you wait past full retirement age adds 8% to your benefit, up to age 70. Waiting from 67 to 70 turns $2,200 into about $2,728, which closes this gap for life and grows with inflation.</li>
<li><strong>Save more or work longer.</strong> Every $1,000 of extra monthly income needs $300,000 of savings at 4%, so a few more working years both add savings and shorten the years they must cover.</li>
<li><strong>Keep some earned income.</strong> $500 a month is roughly 10 hours a week at $12 an hour, and even a few years of it lets savings keep compounding.</li>
<li><strong>Cut fixed costs.</strong> Paying off the mortgage or downsizing removes a cost for good; at 4%, each $100 of monthly spending you drop saves you from needing $30,000 of savings.</li>
<li><strong>Buy guaranteed income.</strong> An annuity converts part of the balance into a pension-like check; compare the payout with 4% in the <a href="/annuity-calculator">annuity calculator</a>.</li>
</ul>`
    },
    {
      h2: 'Should I count my spouse\'s Social Security?',
      html: `<p>For a household budget, yes. Enter both benefits in the Social Security field and both pensions in the pension field, and set expenses for the household. A spouse who earned little can receive up to half of the other spouse's full-retirement-age benefit as a spousal benefit; the <a href="/social-security-calculator">Social Security benefits calculator</a> shows how that is figured. Remember that when one spouse dies, the household keeps only the larger of the two checks, which the <a href="/couples-retirement-calculator">couples retirement calculator</a> tests for you.</p>`
    },
    {
      h2: 'Is retirement income taxed?',
      html: `<p>Much of it is. Withdrawals from a traditional 401(k) or IRA and most pension payments are taxed as ordinary income, and up to 85% of Social Security benefits can be taxable once your other income passes IRS thresholds. Roth withdrawals after age 59½ and five years are tax-free. This calculator works before tax, so include your expected tax bill in monthly expenses, or estimate it first with the <a href="/retirement-tax-calculator">retirement tax calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the average retirement income per month?', a: 'It varies too widely for one figure to help. Start with your own Social Security estimate, which SSA says replaces about 40% of pre-retirement earnings for an average worker, and add the other sources in the calculator.' },
    { q: 'How much monthly income will $500,000 give me in retirement?', a: 'About $1,667 a month at a 4% withdrawal rate, or $1,458 at 3.5%. Add Social Security and any pension to get total income.' },
    { q: 'How much income does $1 million produce in retirement?', a: 'At 4% a year, $1,000,000 supports about $3,333 a month, or $40,000 a year, raised with inflation. At 3% it is $2,500 a month.' },
    { q: 'Is $4,500 a month a good retirement income?', a: 'It depends on your costs. $4,500 a month is $54,000 a year, which replaces 72% of a $75,000 salary. In the example it falls $500 short of a $5,000 budget.' },
    { q: 'How much savings do I need to make up a $500 monthly shortfall?', a: 'About $150,000 at a 4% withdrawal rate: $500 × 12 ÷ 0.04. At 3.5% you would need about $171,429.' },
    { q: 'Should I count my home equity as retirement income?', a: 'Not as monthly income unless you sell, downsize or take a reverse mortgage. If you plan to downsize, add the expected cash freed up to the savings balance.' },
    { q: 'Does this calculator adjust for inflation?', a: 'It shows income in today\'s dollars. Social Security has a yearly cost-of-living adjustment and the 4% rule assumes you raise withdrawals with inflation, but a fixed pension loses buying power each year.' }
  ],
  related: ['how-long-will-money-last-calculator', 'retirement-withdrawal-calculator', 'retirement-budget-calculator', 'social-security-calculator', 'retirement-tax-calculator'],
  sources: [
    { name: 'Social Security Administration: Understanding the Benefits (PDF)', url: 'https://www.ssa.gov/pubs/EN-05-10024.pdf' },
    { name: 'Social Security Administration: Delayed retirement credits', url: 'https://www.ssa.gov/benefits/retirement/planner/delayret.html' },
    { name: 'Social Security Administration: my Social Security account', url: 'https://www.ssa.gov/myaccount/' },
    { name: 'IRS: Publication 915, Social Security and Equivalent Railroad Retirement Benefits', url: 'https://www.irs.gov/publications/p915' }
  ],
  disclaimer: 'Illustration in today\'s dollars, before tax. Not financial advice.'
};
