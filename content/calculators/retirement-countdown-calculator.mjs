export default {
  slug: 'retirement-countdown-calculator',
  hub: 'planning',
  name: 'Retirement Countdown Calculator',
  meta: 'Estimate the days until you retire with our free retirement countdown calculator. See the workdays left after holidays, paychecks left and your age on the day.',
  intro: 'Plug in your retirement date or age, your birth date, how you are paid and your days off, and we\'ll show you how many days, working days and paychecks are left until you retire.',
  keyword: 'days until retirement calculator',
  also: ['retirement countdown calculator', 'days to retirement calculator', 'how many working days until retirement calculator', 'calculate days until retirement', 'how many days until retirement calculator', 'working days until retirement calculator', 'work days until retirement calculator', 'retirement date countdown calculator', 'retirement calculator days left'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'mode', label: 'Count down to', type: 'select', value: 'date', options: [['date', 'A retirement date I know'], ['age', 'A retirement age (uses my birth date)']], help: 'Pick a date if you have one set, or an age to let the calculator find the date.' },
    { id: 'ret', label: 'Retirement date', type: 'date', value: '2031-01-01', help: 'Your first day of retirement. It is not counted as a workday.', showIf: { mode: ['date'] } },
    { id: 'age', label: 'Retirement age', type: 'number', value: 65, suffix: 'years', help: 'Decimals work: 62.5 means 62 years and 6 months.', showIf: { mode: ['age'] } },
    { id: 'birth', label: 'Your birth date', type: 'date', value: '1966-05-20', help: 'Used for your age at retirement and Social Security full retirement age.' },
    { id: 'today', label: 'Count from', type: 'date', value: 'today', help: 'Today by default. Change it to count from a future date, such as January 1.' },
    { id: 'freq', label: 'Pay frequency', type: 'select', value: 'biweekly', options: [['weekly', 'Weekly'], ['biweekly', 'Every two weeks'], ['semimonthly', 'Twice a month (15th and last day)'], ['monthly', 'Monthly (last day)']], help: 'How often you are paid, to count the paychecks left.' },
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
      ['Working days left', H.int(work), true],
      ['Paychecks left', H.int(pay)]
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
  notes: {
    'Retirement date': 'Your first day of retirement and the weekday it falls on.',
    'Time left': 'The calendar gap from the count-from date to retirement.',
    'Weeks left': 'Days left divided by 7.',
    'Months left': 'Whole calendar months left, plus any extra days.',
    'Weekdays (Mon–Fri)': 'Every Monday to Friday before your retirement date, holidays included.',
    'Working days left': 'Weekdays minus your paid holidays and vacation, spread across each year.',
    'Paychecks left': 'Paydays before your retirement date on the schedule you chose.',
    'Your age at retirement': 'Your age on your first day of retirement.',
    'Social Security full retirement age': 'The age Social Security pays your full benefit, set by your birth year.',
    'You turn 65 (Medicare age)': 'The date you can first get Medicare based on age.'
  },
  assumptions: 'These counts assume a Monday-to-Friday schedule, days off spread evenly across each year rather than on specific dates, and paydays on a fixed cycle starting from the count-from date. Your employer\'s calendar may differ by a few days.',
  quick: ({ r, H }) => `Retiring on ${r.retFmt}, you have <strong>${r.value}</strong> left counting from ${r.fromFmt}: ${r.weeks} weeks, ${r.months} full months and ${H.int(r.wk)} weekdays. Take out 11 paid holidays a year and about <strong>${H.int(r.work)} working days</strong> and ${r.pay} biweekly paychecks remain. Someone born May 20, 1966 would retire at ${r.ageTxt}, before a Social Security full retirement age of 67.`,
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
      h2: 'Understanding your inputs',
      html: `<p>The countdown needs only an end date. The other boxes turn plain calendar days into the numbers that feel real: workdays, paychecks and your age on the day.</p>
<h3>Count down to a date or an age</h3>
<p>Choose a date if HR already has one on file, or an age if you only know roughly when. In age mode the retirement date is your birth date plus that many years and months, so 65 for someone born May 20, 1966 is May 20, 2031.</p>
<h3>Retirement date</h3>
<p>Enter your first day of retirement, not your last day at work. The count includes the start date and stops the day before, so your last workday is the final one counted. Entering the last workday instead drops one day from every total.</p>
<h3>Your birth date</h3>
<p>It gives your age at retirement, your Social Security full retirement age and the date you turn 65 for Medicare. It is also required in age mode.</p>
<h3>Count from</h3>
<p>Leave it on today for a live countdown. Set it to January 1 or your next pay date to plan a specific stretch, such as how many workdays fall in the coming year.</p>
<h3>Pay frequency</h3>
<p>Pick how often you are paid to see paychecks left. Weekly and biweekly paydays are counted every 7 or 14 days from the start date; twice-a-month pay falls on the 15th and the last day of each month. A final paycheck that arrives after you leave is not counted.</p>
<h3>Holidays and vacation days</h3>
<p>Leaving this at 0 is the usual mistake: you will not work about 11 federal holidays a year, plus any vacation. Add your yearly vacation and sick days to see only the days you will actually be at work.</p>`
    },
    {
      h2: 'How many working days are in a year?',
      html: `<h3>Weekdays per year</h3>
<p>A 365-day year has 52 full weeks plus one extra day, so it has 260 or 261 weekdays (Monday to Friday); a leap year can have 262. In 2026, 2027, 2029, 2030 and 2031 there are 261, in 2028 there are 260 and in 2032 there are 262.</p>
<h3>After holidays and vacation</h3>
<p>The U.S. Office of Personnel Management lists 11 federal holidays, including Juneteenth. A full calendar year such as 2026 leaves 250 working days after those holidays, and about 240 after two weeks of vacation.</p>
<h3>A rule of thumb</h3>
<p>Each remaining year is worth about 250 workdays, so 1,000 working days left is roughly four years, and ten years from January 1, 2026 to January 1, 2036 holds 2,498.</p>`
    },
    {
      h2: 'How many days until I retire at 62, 65 or 67?',
      html: `<p>For someone born May 20, 1966, counting from January 1, 2026 with 11 days off a year and biweekly pay:</p>
<div class="twrap"><table><thead><tr><th>Retire at</th><th>Retirement day</th><th>Days left</th><th>Working days</th><th>Paychecks</th></tr></thead><tbody>
<tr><td>62</td><td>May 20, 2028</td><td>870</td><td>596</td><td>62</td></tr>
<tr><td>65</td><td>May 20, 2031</td><td>1,965</td><td>1,344</td><td>140</td></tr>
<tr><td>67</td><td>May 20, 2033</td><td>2,696</td><td>1,845</td><td>192</td></tr>
</tbody></table></div>
<p>Each extra year at work adds roughly 250 working days and 26 paychecks. Whether those years are worth it depends on your savings and benefits more than the count: the <a href="/retirement-age-calculator">retirement age calculator</a> weighs the money side of the choice.</p>`
    },
    {
      h2: 'When is my Social Security full retirement age?',
      html: `<p>Full retirement age (FRA) is when Social Security pays 100% of your benefit. It depends only on your birth year:</p>
<div class="twrap"><table><thead><tr><th>Born</th><th>Full retirement age</th></tr></thead><tbody>
<tr><td>1943–1954</td><td>66</td></tr><tr><td>1955</td><td>66 and 2 months</td></tr><tr><td>1956</td><td>66 and 4 months</td></tr><tr><td>1957</td><td>66 and 6 months</td></tr><tr><td>1958</td><td>66 and 8 months</td></tr><tr><td>1959</td><td>66 and 10 months</td></tr><tr><td>1960 or later</td><td>67</td></tr>
</tbody></table></div>
<h3>Birthdays on January 1</h3>
<p>If you were born on January 1, SSA uses the previous year's FRA, and the calculator does the same.</p>
<h3>Retiring and claiming are separate</h3>
<p>You can stop working at 62 and wait to claim, or keep working past FRA. The <a href="/social-security-calculator">Social Security benefits calculator</a> shows how the claiming age changes the check.</p>`
    },
    {
      h2: 'What should I do as the countdown gets short?',
      html: `<h3>About a year out</h3>
<p>Check that your savings support the date with the <a href="/retirement-calculator">retirement calculator</a>, and draft a retirement budget so you know what income you need from the first month.</p>
<h3>Around 65</h3>
<p>Medicare's initial enrollment period runs for seven months, starting three months before the month you turn 65. If you retire before 65, plan for health coverage until then.</p>
<h3>Four months before claiming</h3>
<p>You can apply for Social Security online at SSA.gov up to four months before you want benefits to start.</p>
<h3>Before your last day</h3>
<p>Ask HR how unused vacation is paid out, when your final paycheck arrives, and whether leaving in or after the year you turn 55 lets you take 401(k) money without the 10% early withdrawal penalty.</p>`
    }
  ],
  faq: [
    { q: 'How many working days until I retire?', a: 'Enter your date above. One full calendar year such as 2026 has 261 weekdays and about 250 working days after 11 holidays; five years from January 1, 2026 to January 1, 2031 has about 1,249.' },
    { q: 'How many days are in 5 years?', a: '1,826 days when the five years include one leap day, as from January 1, 2026 to January 1, 2031. That is about 1,304 weekdays and, after 11 holidays a year, roughly 1,249 working days.' },
    { q: 'How many working days are left in 10 years?', a: 'About 2,498 after 11 holidays a year, from January 1, 2026 to January 1, 2036. That is 3,652 calendar days and 2,608 weekdays.' },
    { q: 'How many days until I retire at 65?', a: 'It depends on your birth date. Someone born May 20, 1966 retires at 65 on May 20, 2031, which is 1,965 days and about 1,344 working days after January 1, 2026.' },
    { q: 'How many weeks and months until I retire?', a: 'The results show both. Five years from January 1, 2026 to January 1, 2031 is 260.9 weeks or 60 months.' },
    { q: 'Does the countdown include today and my retirement date?', a: 'It includes today and stops the day before your retirement date. If the retirement date is your first day off, the last day counted is your final workday.' },
    { q: 'How many paychecks are left if I am paid every two weeks?', a: 'Divide the days left by 14 and round down: 130 over the five years from January 1, 2026 to January 1, 2031. Biweekly pay gives 26 paychecks in most years and 27 in some.' },
    { q: 'Should I count vacation days?', a: 'Yes, if you want the days you will actually work. Add your yearly vacation to the 11 holidays: with 21 days off a year, five years has about 1,199 working days instead of 1,249.' },
    { q: 'Does the calculator skip specific holidays?', a: 'No. It subtracts the number of days off you enter, spread across each year in proportion to the days left in it, instead of matching holiday dates. Over a few years the totals come out within a day or two.' },
    { q: 'How do I count down to an age instead of a date?', a: 'Switch "Count down to" to a retirement age and enter your birth date. The calculator adds that many years and months to your birth date to find the retirement day.' },
    { q: 'How do I count working days until retirement in Excel?', a: 'Use =NETWORKDAYS(TODAY(), retirement_date - 1, holidays), where holidays is a range of holiday dates. It counts Monday to Friday in both end dates, so subtract one day to match this calculator.' },
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
