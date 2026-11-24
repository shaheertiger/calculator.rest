export default {
  slug: 'retirement-countdown-calculator',
  hub: 'planning',
  name: 'Retirement Countdown Calculator',
  title: 'Retirement Countdown Calculator 2026: Days and Workdays Left',
  h1: 'Days Until Retirement: Count Down the Workdays and Paychecks',
  meta: 'Count the days, weeks, Monday–Friday workdays after holidays and paychecks left until you retire, plus your age then and your Social Security retirement age.',
  keyword: 'days until retirement calculator',
  also: ['retirement countdown calculator', 'days to retirement calculator', 'how many working days until retirement calculator', 'calculate days until retirement', 'how many days until retirement calculator', 'working days until retirement calculator', 'work days until retirement calculator', 'retirement date countdown calculator', 'retirement calculator days left'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'mode', label: 'Count down to', type: 'select', value: 'date', options: [['date', 'A retirement date I know'], ['age', 'A retirement age (uses my birth date)']] },
    { id: 'ret', label: 'Retirement date', type: 'date', value: '2031-01-01', help: 'Your first day of retirement. It is not counted as a workday.', showIf: { mode: ['date'] } },
    { id: 'age', label: 'Retirement age', type: 'number', value: 65, suffix: 'years', help: 'Decimals work: 62.5 means 62 years and 6 months.', showIf: { mode: ['age'] } },
    { id: 'birth', label: 'Your birth date', type: 'date', value: '1966-05-20', help: 'Used for your age at retirement and Social Security full retirement age.' },
    { id: 'today', label: 'Count from', type: 'date', value: 'today' },
    { id: 'freq', label: 'Pay frequency', type: 'select', value: 'biweekly', options: [['weekly', 'Weekly'], ['biweekly', 'Every two weeks'], ['semimonthly', 'Twice a month (15th and last day)'], ['monthly', 'Monthly (last day)']] },
    { id: 'hol', label: 'Paid holidays and vacation days per year', type: 'number', value: 11, suffix: 'days', help: '11 = the federal holidays. Add vacation days to count only days you actually work.' }
  ],
  compute(v, H) {
    var t = H.parseDate(v.today), b = H.parseDate(v.birth), R;
    if (!t) return { error: 'Enter the date to count from.' };
    if (v.mode === 'age') {
      if (!b) return { error: 'Enter your birth date.' };
      if (!(v.age > 0 && v.age < 100)) return { error: 'Enter the age you plan to retire.' };
      R = H.addMonths(b, Math.round(v.age * 12));
    } else {
      R = H.parseDate(v.ret);
      if (!R) return { error: 'Enter your retirement date.' };
    }
    var days = H.daysBetween(t, R);
    if (days <= 0) return { value: 'Retired', label: 'Your retirement date ' + (days === 0 ? 'is today' : 'has passed'), rows: [['Retirement date', H.fmtDate(R)]], sub: days === 0 ? 'Congratulations: today is the day.' : 'That date is ' + H.plural(-days, 'day') + ' ago. Pick a future date to count down.' };
    if (days > 60 * 366) return { error: 'Pick a retirement date within the next 60 years.' };
    var hol = v.hol > 0 && v.hol < 200 ? v.hol : 0;
    var wk = 0, pay = 0, years = [], cur = null, d = t;
    for (var i = 0; i < days; i++) {
      var y = d.getUTCFullYear(), dow = d.getUTCDay();
      if (!cur || cur.y !== y) {
        cur = { y: y, cal: 0, wd: 0, full: H.isLeap(y) ? 366 : 365 };
        years.push(cur);
      }
      cur.cal++;
      if (dow > 0 && dow < 6) { wk++; cur.wd++; }
      var n = H.addDays(d, 1), last = n.getUTCDate() === 1;
      if (i > 0 && v.freq === 'semimonthly' && (d.getUTCDate() === 15 || last)) pay++;
      if (i > 0 && v.freq === 'monthly' && last) pay++;
      d = n;
    }
    if (v.freq === 'weekly') pay = Math.floor(days / 7);
    if (v.freq === 'biweekly') pay = Math.floor(days / 14);
    var off = 0, rowsY = [];
    for (var k = 0; k < years.length; k++) {
      var Y = years[k], ho = Math.round(hol * Y.cal / Y.full);
      if (ho > Y.wd) ho = Y.wd;
      off += ho;
      rowsY.push([String(Y.y) + (Y.cal < Y.full ? ' (part)' : ''), H.int(Y.cal), H.int(Y.wd), H.int(ho), H.int(Y.wd - ho)]);
    }
    var work = wk - off;
    var df = H.ymdDiff(t, R), months = df.y * 12 + df.m;
    var rows = [
      ['Retirement date', H.weekday(R) + ', ' + H.fmtDate(R)],
      ['Time left', [df.y ? H.plural(df.y, 'year') : '', df.m ? H.plural(df.m, 'month') : '', df.d ? H.plural(df.d, 'day') : ''].filter(Boolean).join(', ')],
      ['Weeks left', H.num(days / 7, 1)],
      ['Months left', H.int(months) + (df.d ? ' (+' + H.plural(df.d, 'day') + ')' : '')],
      ['Weekdays (Mon–Fri)', H.int(wk)],
      ['Working days after ' + H.plural(hol, 'day') + ' off a year', H.int(work), true],
      ['Paychecks left (' + ({ weekly: 'weekly', biweekly: 'every two weeks', semimonthly: 'twice a month', monthly: 'monthly' }[v.freq] || 'every two weeks') + ')', H.int(pay)]
    ];
    var ageTxt = '';
    if (b && b < R) {
      var a = H.ymdDiff(b, R);
      ageTxt = a.y + (a.m ? ' and ' + H.plural(a.m, 'month') : '');
      rows.push(['Your age at retirement', ageTxt]);
      var by = b.getUTCFullYear();
      if (b.getUTCMonth() === 0 && b.getUTCDate() === 1) by -= 1;
      var fraM = by <= 1954 ? 792 : by >= 1960 ? 804 : 792 + (by - 1954) * 2;
      var fra = H.addMonths(b, fraM);
      rows.push(['Social Security full retirement age', Math.floor(fraM / 12) + (fraM % 12 ? ' and ' + (fraM % 12) + ' months' : '') + ' (' + H.fmtDate(fra) + ')']);
      rows.push(['You turn 65 (Medicare age)', H.fmtDate(H.addMonths(b, 780))]);
    }
    return {
      value: H.int(days) + ' days',
      label: 'until you retire on ' + H.fmtDate(R),
      expr: H.fmtDate(t) + ' → ' + H.fmtDate(R),
      rows: rows,
      days: days, weeks: H.num(days / 7, 1), wk: wk, work: work, pay: pay, months: months, retFmt: H.fmtDate(R), fromFmt: H.fmtDate(t), ageTxt: ageTxt, years: rowsY,
      sub: 'Counting from ' + H.fmtDate(t) + ' (today counts) up to, but not including, your retirement date. That is about ' + H.int(work) + ' days of work left.',
      table: { head: ['Year', 'Calendar days', 'Weekdays', 'Days off', 'Working days'], rows: rowsY, caption: 'Working days left in each calendar year' }
    };
  },
  quick: ({ r, H }) => `Retiring on ${r.retFmt}, you have <strong>${r.value}</strong> left counting from ${r.fromFmt}: ${r.weeks} weeks, ${r.months} full months and ${H.int(r.wk)} weekdays. Take out 11 paid holidays a year and about <strong>${H.int(r.work)} working days</strong> and ${r.pay} biweekly paychecks remain. Someone born May 20, 1966 would retire at ${r.ageTxt}, before a Social Security full retirement age of 67.`,
  stepsTitle: 'How to count the days until you retire',
  steps: [
    'Choose whether you know the exact date or only the age you plan to retire. In age mode the date is your birth date plus that many years and months.',
    'Enter your retirement date as your first day of retirement. The count includes today and stops the day before, so your last workday is the final one counted.',
    'Set paid holidays and vacation days. Leaving this at 0 is the usual mistake: you will not work about 11 federal holidays a year, plus any vacation.',
    'Pick how often you are paid to see paychecks left. A final paycheck that arrives after you leave is not counted.'
  ],
  example: `<p>Pat was born on May 20, 1966 and plans to make January 1, 2031 the first day of retirement. On January 1, 2026 the countdown reads:</p>
<ul><li><strong>1,826 days</strong> (five years, including the leap day in 2028), or 260.9 weeks and 60 months.</li>
<li><strong>1,304 weekdays</strong>: 261 in each of 2026, 2027, 2029 and 2030 and 260 in 2028.</li>
<li>Minus 11 holidays a year (55 in total): <strong>1,249 working days</strong>. With two extra weeks of vacation a year (21 days off), it is 1,199.</li>
<li><strong>130 paychecks</strong> paid every two weeks, 120 if paid twice a month, 260 if weekly or 60 if monthly.</li></ul>
<p>Pat will be 64 and 7 months on retirement day, turns 65 and becomes eligible for Medicare on May 20, 2031, and reaches Social Security full retirement age of 67 on May 20, 2033.</p>`,
  table: {
    title: 'How many working days are left in each year until retirement?',
    intro: 'Year-by-year breakdown for the default countdown, from the start date above to the retirement date, with 11 days off per year.',
    head: ['Year', 'Calendar days', 'Weekdays', 'Days off', 'Working days'],
    rows: ({ r }) => r.years,
    note: 'Days off are spread across each year in proportion to the days remaining in it, so a partial first or last year gets a share of the yearly total.'
  },
  sections: [
    {
      h2: 'How many working days are in a year?',
      html: `<p>A 365-day year has 52 full weeks plus one extra day, so it has 260 or 261 weekdays (Monday to Friday); a leap year can have 262. In 2026, 2027, 2029, 2030 and 2031 there are 261, in 2028 there are 260 and in 2032 there are 262.</p>
<p>The U.S. Office of Personnel Management lists 11 federal holidays, including Juneteenth. Most full-time workers end up with roughly 250 working days a year after holidays, and about 240 after two weeks of vacation. A useful rule of thumb: each remaining year is worth about 250 workdays, so 1,000 working days left is roughly four years.</p>`
    },
    {
      h2: 'When is my Social Security full retirement age?',
      html: `<p>Full retirement age (FRA) is when Social Security pays 100% of your benefit. It depends only on your birth year:</p>
<div class="twrap"><table><thead><tr><th>Born</th><th>Full retirement age</th></tr></thead><tbody>
<tr><td>1943–1954</td><td>66</td></tr><tr><td>1955</td><td>66 and 2 months</td></tr><tr><td>1956</td><td>66 and 4 months</td></tr><tr><td>1957</td><td>66 and 6 months</td></tr><tr><td>1958</td><td>66 and 8 months</td></tr><tr><td>1959</td><td>66 and 10 months</td></tr><tr><td>1960 or later</td><td>67</td></tr>
</tbody></table></div>
<p>If you were born on January 1, SSA uses the previous year's FRA, and the calculator does the same. Retiring from work and claiming Social Security are separate decisions: you can stop working at 62 and wait to claim, or keep working past FRA. The <a href="/social-security-calculator">Social Security benefits calculator</a> shows how the claiming age changes the check.</p>`
    },
    {
      h2: 'What should I do as the countdown gets short?',
      html: `<ul><li><strong>About a year out:</strong> check that your savings support the date with the <a href="/retirement-calculator">retirement calculator</a>, and draft a retirement budget.</li>
<li><strong>Around 65:</strong> Medicare's initial enrollment period runs for seven months, starting three months before the month you turn 65. If you retire before 65, plan for health coverage until then.</li>
<li><strong>Up to four months before</strong> you want Social Security to start, you can apply online at SSA.gov.</li>
<li><strong>Before your last day:</strong> ask HR how unused vacation is paid out, when your final paycheck arrives, and whether leaving in or after the year you turn 55 lets you take 401(k) money without the 10% early withdrawal penalty.</li></ul>`
    }
  ],
  faq: [
    { q: 'How many days are in 5 years?', a: '1,826 days when the five years include one leap day, as from January 1, 2026 to January 1, 2031. That is about 1,304 weekdays and, after 11 holidays a year, roughly 1,249 working days.' },
    { q: 'Does the countdown include today and my retirement date?', a: 'It includes today and stops the day before your retirement date. If the retirement date is your first day off, the last day counted is your final workday.' },
    { q: 'How many paychecks are left if I am paid every two weeks?', a: 'Divide the days left by 14 and round down. Biweekly pay gives 26 paychecks in most years and 27 in some years, depending on which day the first payday falls.' },
    { q: 'Should I count vacation days?', a: 'Yes, if you want the days you will actually work. Add your yearly vacation to the 11 holidays: with 21 days off a year, five years has about 1,199 working days instead of 1,249.' },
    { q: 'How do I count down to an age instead of a date?', a: 'Switch "Count down to" to a retirement age and enter your birth date. The calculator adds that many years and months to your birth date to find the retirement day.' },
    { q: 'Is my retirement age the same as my Social Security full retirement age?', a: 'Not necessarily. You choose when to stop working; full retirement age is set by your birth year (67 if born in 1960 or later) and only affects how much Social Security pays when you claim.' }
  ],
  related: ['retirement-age-calculator', 'retirement-calculator', 'social-security-calculator', '401k-retirement-calculator', 'retirement-budget-calculator'],
  sources: [
    { name: 'SSA: Retirement age and benefit reduction (full retirement age by birth year)', url: 'https://www.ssa.gov/benefits/retirement/planner/agereduction.html' },
    { name: 'U.S. Office of Personnel Management: Federal holidays', url: 'https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/' },
    { name: 'Medicare.gov: When does Medicare coverage start?', url: 'https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-does-medicare-coverage-start' },
    { name: 'SSA: Apply for retirement benefits', url: 'https://www.ssa.gov/retirement' }
  ]
};
