export default {
  slug: 'tithe-calculator',
  hub: 'everyday',
  name: 'Tithe Calculator',
  title: 'Tithe Calculator: 10% of a $75,000 Salary Is $7,500 a Year',
  h1: 'Tithe From Your Salary: Yearly, Monthly and Per-Paycheck Amounts',
  meta: 'A 10% tithe on a $75,000 salary is $7,500 a year: $625 a month or $288.46 every two weeks. On $58,500 take-home it\'s $5,850. Compare gross and net.',
  keyword: 'how to calculate tithe from salary',
  also: ['how to calculate tithe', 'how do you calculate tithe', 'how to calculate tithes', 'how is tithe calculated', 'tithe calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'gross', label: 'Gross income (before taxes)', type: 'number', value: 75000, prefix: '$' },
    { id: 'net', label: 'Take-home pay (optional)', type: 'number', value: 58500, prefix: '$', help: 'After taxes and deductions, for a net-income comparison.' },
    { id: 'period', label: 'Those amounts are per', type: 'select', value: 'year', options: [['year', 'Year'], ['month', 'Month'], ['semi', 'Semimonthly paycheck (24/yr)'], ['biweekly', 'Biweekly paycheck (26/yr)'], ['week', 'Week']] },
    { id: 'pct', label: 'Giving percentage', type: 'number', value: 10, suffix: '%' },
    { id: 'basis', label: 'Tithe on', type: 'select', value: 'gross', options: [['gross', 'Gross income (before taxes)'], ['net', 'Take-home pay (after taxes)']] },
    { id: 'pay', label: 'You get paid', type: 'select', value: 'biweekly', options: [['week', 'Weekly'], ['biweekly', 'Every two weeks'], ['semi', 'Twice a month'], ['month', 'Monthly']] }
  ],
  compute(v, H) {
    var per = { year: 1, month: 12, semi: 24, biweekly: 26, week: 52 };
    var f = per[v.period] || 1;
    if (!(v.pct > 0 && v.pct <= 100)) return { error: 'Enter a giving percentage, such as 10.' };
    var g = v.gross > 0 ? v.gross * f : NaN, n = v.net > 0 ? v.net * f : NaN;
    var useNet = v.basis === 'net';
    var base = useNet ? n : g;
    if (!(base > 0)) return { error: useNet ? 'Enter your take-home pay to tithe on net income.' : 'Enter your gross income.' };
    var yr = base * v.pct / 100;
    var pf = per[v.pay] || 26;
    var payName = { week: 'Per weekly paycheck', biweekly: 'Per biweekly paycheck', semi: 'Per semimonthly paycheck', month: 'Per monthly paycheck' }[v.pay] || 'Per paycheck';
    var rows = [
      ['Per month', H.money(yr / 12), true],
      [payName, H.money(yr / pf), true],
      ['Per week', H.money(yr / 52)]
    ];
    var other = useNet ? g : n;
    if (other > 0) {
      var oy = other * v.pct / 100;
      rows.push([(useNet ? 'On gross' : 'On take-home') + ' instead', H.money(oy) + '/yr · ' + H.money(oy / 12) + '/mo']);
      rows.push(['Difference', H.money(Math.abs(oy - yr)) + ' a year']);
    }
    return {
      value: H.money(yr),
      label: 'Yearly tithe (' + H.num(v.pct, 2) + '% of ' + (useNet ? 'take-home pay' : 'gross income') + ')',
      expr: H.money(base) + ' × ' + H.num(v.pct, 2) + '%',
      rows: rows,
      sub: 'Starting with 2026 returns, people who don\'t itemize can deduct up to $1,000 ($2,000 married filing jointly) of cash gifts to qualifying charities, churches included.'
    };
  },
  quick: ({ r }) => `To calculate a tithe from your salary, multiply your income by 10%. On a <strong>$75,000</strong> gross salary the tithe is <strong>${r.value}</strong> a year, which is $625 a month, $288.46 per biweekly paycheck or $144.23 a week. Tithing on $58,500 of take-home pay instead comes to $5,850 a year, or $225 per paycheck.`,
  stepsTitle: 'How to calculate your tithe',
  steps: [
    'Decide whether you\'ll tithe on gross pay (before taxes and deductions) or take-home pay. Your gross salary is on your offer letter or the "gross pay" line of your pay stub.',
    'Multiply by 10%, which is the same as moving the decimal point one place to the left: $75,000 becomes $7,500.',
    'Divide by how often you\'ll give: 12 for monthly, 26 for every two weeks, 24 for twice a month, 52 weekly. <strong>Watch the paycheck count:</strong> biweekly pay means 26 checks a year, not 24, so a per-check tithe is smaller than half the monthly amount.',
    'Tithe on extra income as it arrives (bonuses, side work, gifts) by taking 10% of each amount, and keep giving records for your tax return.'
  ],
  formulaTitle: 'What is the formula for tithing?',
  formula: {
    expr: 'Tithe = Income × 10%<br>Per paycheck = Yearly tithe ÷ Paychecks per year',
    vars: [['Income', 'gross or take-home pay for the same period'], ['10%', 'a tithe means "a tenth"; enter another percentage if you give more or less'], ['Paychecks per year', '52 weekly, 26 biweekly, 24 semimonthly, 12 monthly']]
  },
  example: `<p>Dana earns $75,000 a year, is paid every two weeks and takes home $2,250 per check ($58,500 a year).</p>
<p><strong>On gross:</strong> $75,000 × 10% = <strong>$7,500</strong> a year. Per paycheck: $7,500 ÷ 26 = <strong>$288.46</strong>. Per month: $625.</p>
<p><strong>On take-home:</strong> $2,250 × 10% = <strong>$225</strong> per check, or $5,850 a year. The gap between the two approaches is $1,650 a year.</p>`,
  table: {
    title: 'How much is a 10% tithe on common salaries?',
    intro: 'Tithe on gross salary at 10%, computed by the calculator above.',
    head: ['Gross salary', 'Per year', 'Per month', 'Per biweekly check', 'Per week'],
    rows: ({ run, H }) => [30000, 40000, 50000, 60000, 75000, 90000, 100000, 125000, 150000, 200000].map(s => {
      const r = run({ gross: s, net: NaN, period: 'year', pct: 10, basis: 'gross', pay: 'biweekly' });
      return [H.money0(s), r.value, r.rows[0][1], r.rows[1][1], r.rows[2][1]];
    })
  },
  sections: [
    {
      h2: 'Should you tithe on gross or net income?',
      html: `<p>The Bible doesn't define gross or net pay, so churches and Christians land in different places. Common views:</p>
<ul><li><strong>Gross (before taxes):</strong> the "firstfruits" reading, giving 10% of everything earned before anything else is taken out. On $75,000 that's $7,500.</li><li><strong>Net (take-home):</strong> giving from what actually reaches you. On $58,500 take-home it's $5,850.</li><li><strong>Somewhere between:</strong> some people tithe on gross minus taxes but count 401(k) contributions, because that money is still theirs.</li></ul>
<p>Self-employed people usually tithe on net business profit (revenue minus business expenses) rather than on total sales, since sales aren't income. Whatever you choose, being consistent makes budgeting easier.</p>`
    },
    {
      h2: 'What does the Bible say about tithing?',
      html: `<p>"Tithe" means a tenth. Leviticus 27:30 says a tithe of the land's produce "belongs to the Lord," Deuteronomy 14:22 instructs setting aside a tenth of the harvest each year, and Malachi 3:10 calls people to "bring the whole tithe into the storehouse." In the New Testament, Jesus mentions tithing in Matthew 23:23, and Paul writes in 2 Corinthians 9:7 that each person should give "what you have decided in your heart to give, not reluctantly or under compulsion."</p>
<p>Many churches teach 10% as a starting point, with "offerings" given on top. Others treat 10% as a guideline under grace rather than a rule. The calculator lets you set any percentage, so you can plan for 5% now and work up.</p>`
    },
    {
      h2: 'Is tithing tax deductible?',
      html: `<p>Yes, if the church is a qualifying organization, which most U.S. churches are. For tax years before 2026, you got a deduction only if you itemized. Under the 2025 tax law, <strong>starting with tax year 2026</strong>, people who take the standard deduction can also deduct up to $1,000 of cash gifts ($2,000 for married couples filing jointly). Gifts to donor-advised funds don't qualify for that new deduction.</p>
<p>Keep records. IRS Publication 526 requires a bank record or written receipt for every cash gift, and a written acknowledgment from the church for any single gift of $250 or more. Most churches send a year-end giving statement that covers this. Ask a tax professional how the rules apply to you.</p>`
    },
    {
      h2: 'How do you tithe on bonuses, side income or retirement?',
      html: `<p>Use the same rule on each amount as it arrives. A $5,000 bonus is a $500 tithe on gross; if $3,400 of it reaches your account after withholding, it's $340 on net. For side gigs, tithe on profit after expenses.</p>
<p>A tax refund is a return of your own money; if you already tithed on gross pay, it has been counted. For retirement, people either tithe on contributions as they earn or on withdrawals and Social Security later. Choosing one avoids giving twice on the same dollars.</p>`
    }
  ],
  faq: [
    { q: 'How much is a 10% tithe on $50,000?', a: '$5,000 a year, which is $416.67 a month, $192.31 per biweekly paycheck or $96.15 a week.' },
    { q: 'How do I calculate my tithe from a biweekly paycheck?', a: 'Multiply the paycheck by 10%. A $2,500 gross check means a $250 tithe; on a $1,900 take-home check it is $190.' },
    { q: 'How much is a tithe on $1,000?', a: 'A tithe on $1,000 is $100, which is 10%.' },
    { q: 'Do I tithe on gross or net income?', a: 'Either is common. Tithing on gross gives 10% of everything you earn; tithing on net gives 10% of what you take home. On a $75,000 salary with $58,500 take-home, that is $7,500 versus $5,850 a year.' },
    { q: 'Is a tithe always 10%?', a: 'The word means one-tenth, so 10% is the traditional tithe. Gifts above that are often called offerings, and many people start lower and increase over time.' },
    { q: 'Can I deduct my tithe if I don\'t itemize?', a: 'Starting with tax year 2026, yes, up to $1,000 of cash gifts to qualifying charities ($2,000 for married couples filing jointly). Itemizers deduct under the normal charitable rules.' },
    { q: 'How do self-employed people calculate a tithe?', a: 'Most tithe on net profit: business income minus business expenses, the same figure that appears on Schedule C. Tithing on total sales would count money that went to costs.' }
  ],
  related: ['take-home-pay-calculator', 'biweekly-pay-calculator', 'percentage-calculator', 'salary-to-hourly-calculator', 'split-bill-calculator'],
  sources: [
    { name: 'IRS: Publication 526, Charitable Contributions', url: 'https://www.irs.gov/publications/p526' },
    { name: 'IRS: One Big Beautiful Bill provisions (non-itemizer charitable deduction, Section 70424)', url: 'https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions' },
    { name: 'IRS: Charitable contribution deductions', url: 'https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contribution-deductions' },
    { name: 'Bible Gateway: Malachi 3:10 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Malachi+3%3A10&version=NIV' }
  ],
  disclaimer: 'Not tax advice. Check IRS rules or a tax professional before claiming a deduction.'
};
