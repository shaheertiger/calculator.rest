export default {
  slug: 'salary-to-hourly-calculator',
  hub: 'pay',
  name: 'Salary to Hourly Calculator',
  title: 'Salary to Hourly Calculator: $60,000 a Year Is $28.85 an Hour',
  h1: 'Convert a Yearly Salary to an Hourly Wage (and Hourly Back to Salary)',
  meta: '$60,000 a year divided by 2,080 work hours is $28.85 an hour, $1,153.85 a week or $5,000 a month. Convert any salary to hourly, or hourly pay to a salary.',
  keyword: 'how to calculate yearly salary into hourly rate',
  also: ['how to calculate hourly wage', 'how to calculate annual income to hourly', 'how to calculate the salary per hour', 'how to calculate hourly pay on google sheets', 'how do you calculate your yearly salary', 'how to calculate my salary', 'salary to hourly calculator', 'hourly to salary calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'dir', label: 'Convert', type: 'select', value: 's2h', options: [['s2h', 'Salary → hourly rate'], ['h2s', 'Hourly rate → salary']] },
    { id: 'salary', label: 'Annual salary', type: 'number', value: 60000, prefix: '$', showIf: { dir: ['s2h'] } },
    { id: 'hourly', label: 'Hourly wage', type: 'number', value: 25, prefix: '$', suffix: '/hr', showIf: { dir: ['h2s'] } },
    { id: 'hpw', label: 'Hours per week', type: 'number', value: 40, suffix: 'hours' },
    { id: 'weeks', label: 'Paid weeks per year', type: 'number', value: 52, suffix: 'weeks', help: 'Keep 52 if vacation and holidays are paid. Use fewer for unpaid time off.' }
  ],
  compute(v, H) {
    if (!(v.hpw > 0) || v.hpw > 168) return { error: 'Enter hours per week between 1 and 168.' };
    if (!(v.weeks > 0) || v.weeks > 53) return { error: 'Enter paid weeks per year between 1 and 53.' };
    var hours = v.hpw * v.weeks, annual, hourly;
    if (v.dir === 'h2s') {
      if (!(v.hourly > 0)) return { error: 'Enter your hourly wage.' };
      hourly = v.hourly; annual = hourly * hours;
    } else {
      if (!(v.salary > 0)) return { error: 'Enter your annual salary.' };
      annual = v.salary; hourly = annual / hours;
    }
    var weekly = annual / v.weeks;
    var rows = [
      [v.dir === 'h2s' ? 'Hourly wage' : 'Annual salary', v.dir === 'h2s' ? H.money(hourly) : H.money(annual)],
      ['Daily (' + H.num(v.hpw / 5, 2) + '-hour day)', H.money(hourly * v.hpw / 5)],
      ['Weekly', H.money(weekly)],
      ['Every two weeks', H.money(weekly * 2)],
      ['Twice a month', H.money(annual / 24)],
      ['Monthly', H.money(annual / 12), true],
      ['Paid hours per year', H.num(hours, 2)]
    ];
    return {
      value: v.dir === 'h2s' ? H.money(annual) : H.money(hourly),
      label: v.dir === 'h2s' ? 'Annual salary' : 'Hourly rate',
      expr: v.dir === 'h2s' ? H.money(hourly) + ' × ' + H.num(v.hpw, 2) + ' h × ' + H.num(v.weeks, 2) + ' wk' : H.money0(annual) + ' ÷ (' + H.num(v.hpw, 2) + ' h × ' + H.num(v.weeks, 2) + ' wk)',
      rows: rows,
      sub: 'Gross pay before tax. Over a 2,080-hour year, each $1 an hour is worth $2,080 of salary.'
    };
  },
  quick: ({ r }) => `To turn a yearly salary into an hourly rate, divide it by the hours you are paid for in a year: 40 hours × 52 weeks = 2,080. A <strong>$60,000</strong> salary works out to $60,000 ÷ 2,080 = <strong>${r.value} an hour</strong>, or $1,153.85 a week and $5,000 a month. Going the other way, $25 an hour full time is $52,000 a year.`,
  stepsTitle: 'How to convert salary to an hourly rate',
  steps: [
    'Work out paid hours per year: hours per week × paid weeks. Full time is 40 × 52 = 2,080 hours.',
    'Divide the annual salary by that number. $75,000 ÷ 2,080 = $36.06 an hour.',
    'Only reduce the weeks if time off is unpaid. Subtracting paid vacation and holidays is a common mistake: it inflates the hourly rate because you are paid for those weeks.',
    'To convert hourly to yearly, reverse it: hourly wage × hours per week × paid weeks.'
  ],
  formulaTitle: 'What is the salary to hourly formula?',
  formula: {
    expr: 'Hourly rate = Annual salary ÷ (Hours per week × Paid weeks per year)<br>Annual salary = Hourly rate × Hours per week × Paid weeks per year',
    vars: [['Hours per week', 'usually 40; 37.5 in many offices'], ['Paid weeks', '52 when vacation and holidays are paid']],
    note: 'Shortcut: for a 40-hour job, halve the salary and drop the last three zeros. $60,000 → about $30 an hour (exact: $28.85). Hourly to yearly: double the wage and add three zeros. $25 → about $50,000 (exact: $52,000).'
  },
  example: `<p>A job offer pays $48,500 a year for a 37.5-hour week with paid holidays and vacation.</p>
<p>Paid hours: 37.5 × 52 = <strong>1,950</strong>. Hourly rate: $48,500 ÷ 1,950 = <strong>$24.87</strong>.</p>
<p>Compare it with a $24-an-hour job at 40 hours: $24 × 2,080 = $49,920 a year. The hourly job pays $1,420 more a year, but the salaried one pays $0.87 more per hour worked and gives back 2.5 hours a week.</p>`,
  table: {
    title: 'How much is a salary per hour?',
    intro: 'Common salaries converted to hourly, weekly and monthly pay at 40 hours a week and 52 paid weeks, plus the hourly rate at 37.5 hours.',
    head: ['Salary', 'Hourly (40 h)', 'Hourly (37.5 h)', 'Weekly', 'Monthly'],
    rows: ({ run, H }) => [30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 80000, 90000, 100000, 120000, 150000].map(s => [H.money0(s), run({ dir: 's2h', salary: s, hpw: 40, weeks: 52 }).value, run({ dir: 's2h', salary: s, hpw: 37.5, weeks: 52 }).value, H.money(s / 52), H.money(s / 12)])
  },
  sections: [
    {
      h2: 'How many work hours are in 2026?',
      html: `<p>The 2,080-hour standard assumes exactly 52 weeks. Calendar years are a day or two longer: 2026 has <strong>261 weekdays</strong> (2,088 hours at 8 a day), because it starts on a Thursday and has 365 days. Subtract the 11 federal holidays and there are 250 working days, or 2,000 hours actually on the job.</p>
<p>For a salary conversion this rarely matters. A salaried employee is paid the same annual amount however the calendar falls, and paid holidays are still paid hours, so 2,080 is the figure most payroll departments and job sites use. The federal government divides by 2,087, the average number of paid hours a year over a 28-year calendar cycle. It matters more for hourly workers: in a 261-weekday year, a full-time hourly employee with paid holidays earns 2,088 hours of pay, a little more than a salaried colleague at the same rate.</p>`
    },
    {
      h2: 'Is a salary worth more than the same hourly pay?',
      html: `<p>It depends on the hours and what comes with it. Three things to compare:</p>
<ul>
<li><strong>Overtime.</strong> Most salaried workers earning at least $684 a week are exempt from overtime, so a 50-hour week pays the same as a 40-hour one. A $60,000 salary at 50 hours a week is really $23.08 an hour. Hourly workers get time and a half past 40; see the <a href="/overtime-calculator">overtime calculator</a>.</li>
<li><strong>Benefits.</strong> Health insurance, retirement matches and paid leave make up about 30% of total compensation for U.S. civilian workers, according to the Bureau of Labor Statistics. A contract or gig rate with no benefits needs to be well above the salaried hourly equivalent.</li>
<li><strong>Stability.</strong> A salary is paid in full in short weeks; hourly pay drops if your shifts are cut.</li>
</ul>`
    },
    {
      h2: 'How do I calculate hourly pay in Google Sheets or Excel?',
      html: `<p>For a salary in cell A2: <code>=A2/2080</code>, or with hours per week in B2 and paid weeks in C2: <code>=A2/(B2*C2)</code>. Wrap it in <code>=ROUND(…,2)</code> to get cents.</p>
<p>To pay someone from clock-in and clock-out times, put the start time in A2, the end time in B2 and the wage in C2, then use <code>=(B2-A2)*24*C2</code>. Sheets stores times as fractions of a day, so multiplying by 24 turns the difference into hours. For a shift that crosses midnight, use <code>=MOD(B2-A2,1)*24*C2</code>. For whole timesheets, the <a href="/time-card-calculator">time card calculator</a> does the adding up.</p>`
    },
    {
      h2: 'How do you calculate your yearly salary from part-time hours?',
      html: `<p>Use your real weekly hours, not 40. Someone paid $19 an hour for 24 hours a week earns $19 × 24 × 52 = <strong>$23,712</strong> a year if every week is paid. If they take three unpaid weeks off, it is $19 × 24 × 49 = $22,344.</p>
<p>If your hours change from week to week, average the last few months of pay stubs, or use year-to-date pay from your latest stub with the <a href="/ytd-income-calculator">YTD income calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much is $50,000 a year per hour?', a: '$24.04 an hour at 40 hours a week for 52 weeks ($50,000 ÷ 2,080).' },
    { q: 'How much is $100,000 a year per hour?', a: '$48.08 an hour for a 40-hour week, or $51.28 for a 37.5-hour week.' },
    { q: '$20 an hour is how much a year?', a: '$41,600 a year at 40 hours a week and 52 paid weeks. That is $3,466.67 a month before tax.' },
    { q: 'How much is $30 an hour annually?', a: '$62,400 a year full time ($30 × 2,080), or $5,200 a month.' },
    { q: 'Should I subtract vacation weeks when converting salary to hourly?', a: 'Only if the vacation is unpaid. Paid vacation and holidays are part of the 2,080 paid hours, so a salaried employee with two paid weeks off still divides by 2,080.' },
    { q: 'How many hours a year is full time?', a: '2,080 hours: 40 hours a week for 52 weeks. Some employers use 1,950 hours (37.5 a week) or 2,088 hours in years with 261 weekdays.' },
    { q: 'Does this hourly rate include taxes?', a: 'No. It is gross pay. To see pay after federal tax, Social Security and Medicare, use the take-home pay calculator.' }
  ],
  related: ['gross-pay-calculator', 'overtime-calculator', 'take-home-pay-calculator', 'raise-calculator', 'biweekly-pay-calculator'],
  sources: [
    { name: 'OPM: Pay and leave (federal pay administration)', url: 'https://www.opm.gov/policy-data-oversight/pay-leave/' },
    { name: 'U.S. Department of Labor: Overtime Pay', url: 'https://www.dol.gov/agencies/whd/overtime' },
    { name: 'BLS: Employer Costs for Employee Compensation', url: 'https://www.bls.gov/news.release/ecec.nr0.htm' }
  ]
};
