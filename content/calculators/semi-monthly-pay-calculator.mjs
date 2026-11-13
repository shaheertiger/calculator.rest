export default {
  slug: 'semi-monthly-pay-calculator',
  hub: 'pay',
  name: 'Semi-Monthly Pay Calculator',
  title: 'Semi-Monthly Pay Calculator: $55,000 ÷ 24 = $2,291.67',
  h1: 'Semi-Monthly Pay Calculator: Paycheck Amount, Hourly Pay and 2027 Pay Dates',
  meta: 'A $55,000 salary paid twice a month is $2,291.67 per paycheck, versus $2,115.38 biweekly. Get your semi-monthly check, hourly equivalent and 2027 pay dates.',
  keyword: 'how to calculate semi monthly pay',
  also: ['how to calculate semi monthly payroll', 'how to calculate semi monthly pay hourly', 'how do you calculate semi monthly pay', 'semi monthly pay calculator', 'semi monthly vs biweekly', 'semi monthly pay dates 2027'],
  updated: '2026-11-13',
  inputs: [
    { id: 'type', label: 'Pay type', type: 'select', value: 'salary', options: [['salary', 'Salary'], ['hourly', 'Hourly']] },
    { id: 'salary', label: 'Annual salary', type: 'number', value: 55000, prefix: '$', showIf: { type: ['salary'] } },
    { id: 'rate', label: 'Hourly rate', type: 'number', value: 24, prefix: '$', showIf: { type: ['hourly'] } },
    { id: 'hpw', label: 'Hours per week', type: 'number', value: 40, suffix: 'hours', showIf: { type: ['hourly'] } },
    { id: 'rule', label: 'Paydays', type: 'select', value: '15last', options: [['15last', '15th and last day of the month'], ['1and15', '1st and 15th']] },
    { id: 'year', label: 'Show pay dates for', type: 'number', value: 2027, suffix: 'year' }
  ],
  compute(v, H) {
    var annual, per, expr;
    if (v.type === 'hourly') {
      if (!(v.rate > 0) || !(v.hpw > 0)) return { error: 'Enter your hourly rate and weekly hours.' };
      annual = v.rate * v.hpw * 52;
      expr = H.money(v.rate) + ' × ' + H.num(v.hpw * 52 / 24, 2) + ' h';
    } else {
      if (!(v.salary > 0)) return { error: 'Enter your annual salary.' };
      annual = v.salary;
      expr = H.money0(annual) + ' ÷ 24';
    }
    per = annual / 24;
    var bi = annual / 26;
    var rows = [
      ['Annual pay', H.money(annual)],
      ['Monthly (2 checks)', H.money(per * 2)],
      ['Same pay biweekly (÷ 26)', H.money(bi)],
      ['Semi-monthly check is larger by', H.money(per - bi), true],
      ['Average hours per pay period', H.num((v.type === 'hourly' ? v.hpw : 40) * 52 / 24, 2)]
    ];
    if (v.type !== 'hourly') rows.push(['Hourly equivalent (40 h/week)', H.money(annual / 2080)]);
    var out = { value: H.money(per), label: 'Gross pay per semi-monthly paycheck', expr: expr, rows: rows, sub: '24 paychecks a year on fixed dates, so every month gets exactly two.' };
    var y = Math.round(v.year);
    if (y >= 1970 && y <= 2100) {
      var names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], list = [], moved = 0;
      for (var m = 0; m < 12; m++) {
        var dates = v.rule === '1and15' ? [new Date(Date.UTC(y, m, 1)), new Date(Date.UTC(y, m, 15))] : [new Date(Date.UTC(y, m, 15)), new Date(Date.UTC(y, m + 1, 0))];
        var cells = dates.map(function (d) {
          var p = d;
          while (p.getUTCDay() === 0 || p.getUTCDay() === 6) p = H.addDays(p, -1);
          if (p.getTime() !== d.getTime()) { moved++; return H.fmtDate(p) + ' (the ' + H.ord(d.getUTCDate()) + ' is a ' + H.weekday(d) + ')'; }
          return H.fmtDate(p);
        });
        list.push([names[m], cells[0], cells[1]]);
      }
      out.table = { head: ['Month', 'First payday', 'Second payday'], rows: list, caption: y + ' pay dates, weekend paydays moved to the Friday before (' + moved + ' moved). Holidays not adjusted.' };
    }
    return out;
  },
  quick: ({ r }) => `Semi-monthly pay is your annual pay divided by 24, because you are paid twice a month on fixed dates. A <strong>$55,000</strong> salary comes to <strong>${r.value}</strong> per paycheck, or $4,583.33 a month. Paid biweekly instead, the same salary is $2,115.38 per check over 26 checks. Hourly workers average 86.67 hours a period at 40 hours a week.`,
  stepsTitle: 'How to calculate semi-monthly pay',
  steps: [
    'For a salary, divide the annual amount by 24. $55,000 ÷ 24 = $2,291.67.',
    'For hourly pay, multiply the rate by the hours actually worked in that half-month. As an average, a 40-hour week is 86.67 hours per period (40 × 52 ÷ 24), not 80; using 80 is the usual mistake.',
    'Add overtime week by week. Workweeks do not line up with the 15th, so a week that straddles two periods is split by the day its hours were worked.',
    'To compare with a biweekly offer, divide the same annual pay by 26 instead.'
  ],
  formulaTitle: 'What is the semi-monthly pay formula?',
  formula: {
    expr: 'Semi-monthly gross = Annual salary ÷ 24<br>Hourly average = Rate × Hours per week × 52 ÷ 24<br>Monthly gross = Semi-monthly gross × 2',
    vars: [['24', 'paychecks a year: two per month'], ['52 ÷ 24', '2.1667 weeks in an average half-month']]
  },
  example: `<p>Diego earns $24 an hour, works 40 hours a week and is paid on the 15th and last day of each month.</p>
<p>Annual pay: $24 × 40 × 52 = $49,920. Average semi-monthly check: $49,920 ÷ 24 = <strong>$2,080</strong> (86.67 hours × $24).</p>
<p>His actual checks swing with the calendar. The period from March 16 to 31, 2027 has 12 weekdays (96 hours, $2,304), while February 1 to 15 has 11 (88 hours, $2,112), and the February 16 to 28 period has only 9 (72 hours, $1,728).</p>`,
  table: {
    title: 'Semi-monthly vs biweekly paychecks: how much per check?',
    intro: 'Gross paycheck at the same annual salary on 24 semi-monthly checks versus 26 biweekly checks.',
    head: ['Annual salary', 'Semi-monthly (24)', 'Biweekly (26)', 'Difference per check', 'Monthly'],
    rows: ({ run, H }) => [30000, 40000, 45000, 50000, 55000, 60000, 70000, 80000, 90000, 100000, 125000, 150000].map(s => {
      const o = run({ type: 'salary', salary: s, year: NaN });
      return [H.money0(s), o.value, H.money(s / 26), o.rows.find(x => /larger/.test(x[0]))[1], H.money(s / 12)];
    }),
    note: 'Same annual pay either way. Semi-monthly checks are 8.3% larger because there are two fewer of them.'
  },
  sections: [
    {
      h2: 'How do you calculate semi-monthly pay for hourly employees?',
      html: `<p>Hourly employees on a semi-monthly schedule are paid for the hours they worked in each half-month, so their checks change with the calendar. A half-month has anywhere from 9 to 12 weekdays, which is 72 to 96 hours on a standard 8-hour schedule.</p>
<p>For a budget, use the average: hourly rate × weekly hours × 52 ÷ 24. At $18 an hour and 40 hours, that is <strong>$1,560</strong> per check. At 32 hours a week, it is $18 × 32 × 52 ÷ 24 = $1,248.</p>
<p>Overtime is still owed on hours over 40 in each fixed workweek, even when a workweek starts in one pay period and ends in the next. Many payrolls pay that overtime on the check after the workweek closes.</p>`
    },
    {
      h2: 'Which pays more, semi-monthly or biweekly?',
      html: `<p>Neither: the annual pay is the same. The difference is timing.</p>
<ul>
<li><strong>Semi-monthly (24 checks):</strong> each check is bigger, and two land in every month, which lines up neatly with rent and other monthly bills. Payday moves around the week.</li>
<li><strong>Biweekly (26 checks):</strong> smaller checks on the same weekday, with two months a year bringing a third paycheck. See the <a href="/biweekly-pay-calculator">biweekly pay calculator</a> for which months.</li>
</ul>
<p>Watch benefit deductions when switching. A $300 monthly health premium is $150 per semi-monthly check but $138.46 per biweekly check, and some employers skip deductions on the third biweekly check of a month.</p>`
    },
    {
      h2: 'When are semi-monthly paydays in 2027?',
      html: `<p>On the 15th-and-last-day schedule, six 2027 paydays fall on a weekend and are usually paid the Friday before: January 31 (paid Fri, Jan 29), February 28 (Feb 26), May 15 (May 14), July 31 (July 30), August 15 (Aug 13) and October 31 (Oct 29). The calculator lists every date for the year you choose.</p>
<p>Some employers pay on the following Monday instead, and a payday on a bank holiday usually moves to the business day before. Your employee handbook states the rule.</p>`
    },
    {
      h2: 'How do you calculate semi-monthly payroll?',
      html: `<p>For salaried staff, divide each salary by 24 and withhold tax using the semi-monthly tables in IRS Publication 15-T, which treat each check as 1/24 of a year. For hourly staff, add up the hours in each period (with weekly overtime), multiply by the rate and run the same tables.</p>
<p>Many states set a minimum pay frequency; California, for example, requires most employees to be paid at least twice a month, which a semi-monthly schedule meets. The Department of Labor keeps a state-by-state list. To go from the gross check to net pay, use the <a href="/take-home-pay-calculator">take-home pay calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much is $60,000 a year semi-monthly?', a: '$2,500 per paycheck before taxes ($60,000 ÷ 24).' },
    { q: 'What is $25 an hour semi-monthly?', a: 'About $2,166.67 per paycheck at 40 hours a week: $25 × 40 × 52 ÷ 24. Actual checks vary with the number of workdays in each half-month.' },
    { q: 'How many hours are in a semi-monthly pay period?', a: 'An average of 86.67 hours for a 40-hour week (2,080 hours ÷ 24). Individual periods range from about 72 to 96 hours.' },
    { q: 'How many paychecks do you get with semi-monthly pay?', a: '24 a year, two every month. Unlike biweekly pay, there are never three paychecks in a month.' },
    { q: 'Is semi-monthly the same as bimonthly?', a: 'Usually people mean the same thing, twice a month, but bimonthly can also mean every two months. Payroll uses "semi-monthly" for twice a month to avoid confusion.' },
    { q: 'How do I convert a semi-monthly paycheck to annual salary?', a: 'Multiply it by 24. A $2,291.67 semi-monthly check is a $55,000 salary.' },
    { q: 'What happens when a semi-monthly payday falls on a weekend?', a: 'Most employers pay on the last business day before, usually Friday. Some pay the next business day; check your company policy and state law.' }
  ],
  related: ['biweekly-pay-calculator', 'salary-to-hourly-calculator', 'take-home-pay-calculator', 'gross-pay-calculator'],
  sources: [
    { name: 'IRS: Publication 15-T, Federal Income Tax Withholding Methods', url: 'https://www.irs.gov/forms-pubs/about-publication-15-t' },
    { name: 'U.S. Department of Labor: State payday requirements', url: 'https://www.dol.gov/agencies/whd/state/payday' },
    { name: 'DOL Fact Sheet #23: Overtime Pay Requirements of the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime' }
  ]
};
