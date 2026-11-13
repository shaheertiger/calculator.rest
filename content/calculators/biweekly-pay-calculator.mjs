export default {
  slug: 'biweekly-pay-calculator',
  hub: 'pay',
  name: 'Biweekly Pay Calculator',
  title: 'Biweekly Pay Calculator: $2,400 Every 2 Weeks = $62,400 a Year',
  h1: 'Biweekly Pay Calculator: Annual Income, 27-Paycheck Years and 3-Paycheck Months',
  meta: '$2,400 every two weeks is $62,400 a year, or $5,200 a month (not $4,800). Convert biweekly pay to annual income and see which 2027 months bring three paychecks.',
  keyword: 'how to calculate annual income biweekly',
  also: ['how to calculate biweekly payroll', 'how to calculate biweekly paycheck', 'how to calculate biweekly pay from annual salary', 'how is biweekly pay calculated', 'how do you calculate bi weekly pay', 'biweekly pay calculator', 'months with 3 paychecks 2027'],
  updated: '2026-11-13',
  inputs: [
    { id: 'dir', label: 'Convert', type: 'select', value: 'b2a', options: [['b2a', 'Biweekly paycheck → annual income'], ['a2b', 'Annual salary → biweekly paycheck']] },
    { id: 'check', label: 'Gross pay every two weeks', type: 'number', value: 2400, prefix: '$', showIf: { dir: ['b2a'] } },
    { id: 'annual', label: 'Annual salary', type: 'number', value: 62400, prefix: '$', showIf: { dir: ['a2b'] } },
    { id: 'payday', label: 'Any payday in the year to check', type: 'date', value: '2027-01-08', help: 'Used to count paychecks in that calendar year.' }
  ],
  compute(v, H) {
    var check, annual;
    if (v.dir === 'a2b') {
      if (!(v.annual > 0)) return { error: 'Enter your annual salary.' };
      annual = v.annual; check = annual / 26;
    } else {
      if (!(v.check > 0)) return { error: 'Enter your gross pay every two weeks.' };
      check = v.check; annual = check * 26;
    }
    var rows = [
      [v.dir === 'a2b' ? 'Annual salary' : 'Biweekly paycheck', H.money(v.dir === 'a2b' ? annual : check)],
      ['Monthly average (× 26 ÷ 12)', H.money(annual / 12), true],
      ['Weekly', H.money(check / 2)],
      ['Hourly at 80 hours per check', H.money(check / 80)]
    ];
    var sub = 'Annual income is the biweekly check × 26, because 52 weeks hold 26 two-week periods.';
    var d = H.parseDate(v.payday), sched = null;
    if (d) {
      var y = d.getUTCFullYear();
      while (H.addDays(d, -14).getUTCFullYear() === y) d = H.addDays(d, -14);
      var count = 0, per = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], first = d, last = d;
      while (d.getUTCFullYear() === y) { count++; per[d.getUTCMonth()]++; last = d; d = H.addDays(d, 14); }
      var names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], three = [];
      per.forEach(function (c, i) { if (c >= 3) three.push(names[i]); });
      rows.push(['Paychecks in ' + y, String(count) + ' (' + H.fmtDate(first) + ' to ' + H.fmtDate(last) + ')']);
      rows.push(['Months with 3 paychecks in ' + y, three.length ? three.join(', ') : 'none']);
      rows.push(['Gross paid in calendar ' + y, H.money(check * count)]);
      if (count === 27) sub = y + ' has 27 paydays on this schedule, so the calendar year pays ' + H.money(check * 27) + ' if each check stays the same.';
      else sub = 'On this schedule ' + y + ' has 26 paydays; ' + (three.length ? three.join(' and ') + ' bring a third check.' : 'no month has three.');
    }
    return {
      value: v.dir === 'a2b' ? H.money(check) : H.money(annual),
      label: v.dir === 'a2b' ? 'Gross pay every two weeks' : 'Annual income',
      expr: v.dir === 'a2b' ? H.money0(annual) + ' ÷ 26' : H.money(check) + ' × 26',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate annual income from biweekly pay, multiply one paycheck by 26, the number of two-week periods in a year. A gross check of <strong>$2,400</strong> every two weeks is <strong>${r.value}</strong> a year, which averages $5,200 a month. Multiplying by two checks a month gives $4,800 and undercounts by $4,800 a year, because two months each year bring a third check.`,
  stepsTitle: 'How to calculate annual income from biweekly pay',
  steps: [
    'Take the gross amount of one regular paycheck (before taxes), not the net deposit.',
    'Multiply by 26. Doing "two checks a month × 12" (24 checks) is the common error; it leaves out two paychecks.',
    'For a monthly budget, divide the annual figure by 12. Expect two months with three paydays.',
    'Going the other way, divide an annual salary by 26 to get each biweekly check.'
  ],
  formulaTitle: 'What is the biweekly pay formula?',
  formula: {
    expr: 'Annual income = Biweekly gross × 26<br>Biweekly gross = Annual salary ÷ 26<br>Average monthly income = Biweekly gross × 26 ÷ 12 ≈ Biweekly gross × 2.1667',
    vars: [['26', 'two-week pay periods in a 52-week year'], ['2.1667', 'average biweekly paychecks per month']],
    note: 'Hourly workers: biweekly gross = hours worked in both weeks × rate, with overtime counted separately for each week.'
  },
  example: `<p>Priya's offer letter says $71,500 a year, paid biweekly. Each check is $71,500 ÷ 26 = <strong>$2,750</strong> gross.</p>
<p>Her lender asks for monthly income: $2,750 × 26 ÷ 12 = <strong>$5,958.33</strong>. Her old habit of budgeting two checks a month ($5,500) would have left $458.33 a month, or $5,500 a year, unaccounted for.</p>
<p>If her employer's 2027 payday cycle starts on Friday, January 8, she gets 26 checks, and April and October each bring a third.</p>`,
  table: {
    title: 'How much is a biweekly paycheck per year and per month?',
    intro: 'Gross biweekly pay converted to annual income (× 26), the true monthly average, and the extra a 27-paycheck year adds.',
    head: ['Every 2 weeks', 'Per year', 'Per month (average)', 'Per hour (80 h)', 'A 27-check year pays'],
    rows: ({ run, H }) => [800, 1000, 1200, 1500, 1800, 2000, 2400, 2500, 3000, 3500, 4000, 5000].map(b => [H.money0(b), run({ dir: 'b2a', check: b, payday: '2027-01-08' }).value, H.money(b * 26 / 12), H.money(b / 80), H.money0(b * 27)])
  },
  sections: [
    {
      h2: 'Which months have three paychecks in 2027?',
      html: `<p>It depends on your employer's cycle. For the two common Friday schedules:</p>
<ul>
<li><strong>Paydays starting Friday, January 8, 2027:</strong> 26 paychecks, with three in <strong>April</strong> (2, 16, 30) and <strong>October</strong> (1, 15, 29).</li>
<li><strong>Paydays starting Friday, January 1, 2027:</strong> 27 paychecks, with three in <strong>January</strong>, <strong>July</strong> and <strong>December</strong>. The last lands on December 31, 2027.</li>
</ul>
<p>Because January 1 is a holiday, many employers on the second cycle pay that check early on December 31, 2026, which moves the extra paycheck into 2026 instead. Enter any payday from your stub in the calculator to see your own year. For 2026, a cycle that started January 9 had three checks in May and October.</p>
<p>A three-check month is a good time to fund savings or pay down debt, since bills that are monthly were budgeted on two.</p>`
    },
    {
      h2: 'What happens in a year with 27 biweekly paychecks?',
      html: `<p>A year has 365 days (366 in a leap year), while 26 pay periods cover 364. The extra day or two builds up until, roughly every 11 years, a cycle fits 27 paydays into one calendar year.</p>
<p>Hourly workers simply get paid for the hours they work, so a 27th check is extra income for that calendar year. For salaried workers, employers handle it one of two ways:</p>
<ul>
<li><strong>Keep the check the same.</strong> Salary ÷ 26 every payday, so the calendar year pays 27 ÷ 26 of the salary ($64,800 on $62,400).</li>
<li><strong>Shrink each check.</strong> Salary ÷ 27, so the year still totals the stated salary but each check is about 3.7% smaller ($2,311.11 instead of $2,400).</li>
</ul>
<p>Check with payroll before the year starts so fixed bills and automatic transfers still fit.</p>`
    },
    {
      h2: 'How do you calculate biweekly payroll?',
      html: `<p>For a salaried employee, divide the annual salary by 26. For an hourly employee, total each of the two weeks separately: hours up to 40 at the regular rate and anything over 40 at time and a half, then add the two weeks. A 44-hour week and a 36-hour week pay 76 regular hours plus 4 overtime hours, not 80 regular hours.</p>
<p>Withholding then uses the biweekly tables in IRS Publication 15-T, which treat each check as 1/26 of a year. To see deductions from a biweekly check, use the <a href="/take-home-pay-calculator">take-home pay calculator</a>; to add up one period with overtime and tips, use the <a href="/gross-pay-calculator">gross pay calculator</a>.</p>`
    },
    {
      h2: 'Is biweekly pay the same as twice a month?',
      html: `<p>No. Biweekly means every other week on the same weekday: 26 checks a year. Twice a month (semi-monthly) means fixed dates, such as the 15th and last day: 24 checks a year. On a $62,400 salary, a biweekly check is $2,400 and a semi-monthly check is $2,600; the annual total is the same. The <a href="/semi-monthly-pay-calculator">semi-monthly pay calculator</a> covers that schedule.</p>`
    }
  ],
  faq: [
    { q: 'How much is $2,000 biweekly per year?', a: '$52,000 a year ($2,000 × 26), or $4,333.33 a month on average.' },
    { q: 'How much is $3,000 biweekly annually?', a: '$78,000 a year before taxes. That averages $6,500 a month.' },
    { q: 'What is $50,000 a year biweekly?', a: '$1,923.08 gross every two weeks ($50,000 ÷ 26).' },
    { q: 'How many biweekly pay periods are in 2027?', a: 'Usually 26. A cycle with a payday on Friday, January 1, 2027 has 27, ending on December 31, 2027, unless the January 1 check is paid early in 2026.' },
    { q: 'Should I use gross or net pay to calculate annual income?', a: 'Gross. Annual income on loan, rental and benefit applications means pay before taxes and deductions, so multiply the gross amount on your stub by 26.' },
    { q: 'How do I calculate monthly income from biweekly pay?', a: 'Multiply the biweekly check by 26 and divide by 12, which is the same as multiplying by about 2.1667. $1,500 biweekly is $3,250 a month.' },
    { q: 'Why does my biweekly check change from period to period?', a: 'For hourly workers, hours and overtime vary. For everyone, benefit deductions, bonuses, and Social Security withholding stopping after $184,500 of wages can change the net amount.' }
  ],
  related: ['semi-monthly-pay-calculator', 'salary-to-hourly-calculator', 'take-home-pay-calculator', 'gross-pay-calculator'],
  sources: [
    { name: 'IRS: Publication 15-T, Federal Income Tax Withholding Methods', url: 'https://www.irs.gov/forms-pubs/about-publication-15-t' },
    { name: 'U.S. Department of Labor: State payday requirements', url: 'https://www.dol.gov/agencies/whd/state/payday' },
    { name: 'DOL Fact Sheet #23: Overtime Pay Requirements of the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay' }
  ]
};
