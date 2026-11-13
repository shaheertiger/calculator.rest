export default {
  slug: 'business-days-calculator',
  hub: 'time',
  name: 'Business Days Calculator',
  title: 'Business Days Calculator: 2026 Has 250 Working Days (U.S.)',
  h1: 'Working Days Between Two Dates, Minus Weekends and Federal Holidays',
  meta: 'Count weekdays between two dates minus U.S. federal holidays and your days off. 2026 has 261 weekdays and 250 federal business days; 2027 has 249.',
  keyword: 'how many working days until retirement calculator',
  also: ['business days calculator', 'working days calculator', 'how many business days between two dates', 'workdays calculator', 'how many working days in 2026', 'how many working days in 2027', 'weekdays between dates'],
  updated: '2026-11-13',
  inputs: [
    { id: 'start', label: 'Start date', type: 'date', value: 'today' },
    { id: 'end', label: 'End date (e.g. retirement day)', type: 'date', value: '2027-12-31' },
    { id: 'inclStart', label: 'Count the start date', type: 'checkbox', value: true, help: 'The end date is always counted. Untick to count only the days after the start.' },
    { id: 'hol', label: 'Exclude U.S. federal holidays (observed dates)', type: 'checkbox', value: true },
    { id: 'pto', label: 'Other days off to subtract', type: 'number', value: 0, suffix: 'days', help: 'Vacation, PTO or company holidays that fall on weekdays.' }
  ],
  compute(v, H) {
    var s = H.parseDate(v.start), e = H.parseDate(v.end);
    if (!s || !e) return { error: 'Enter a start date and an end date.' };
    var swapped = false;
    if (e < s) { var x = s; s = e; e = x; swapped = true; }
    if (H.daysBetween(s, e) > 36600) return { error: 'Pick a range of 100 years or less.' };
    var hol = {};
    function U(y, m, d) { return new Date(Date.UTC(y, m, d)); }
    function add(d, name) { hol[H.iso(d)] = name; }
    function obs(y, m, d, name) { var dt = U(y, m, d), w = dt.getUTCDay(); add(w === 6 ? H.addDays(dt, -1) : w === 0 ? H.addDays(dt, 1) : dt, name + (w === 6 || w === 0 ? ' (observed)' : '')); }
    function nth(y, m, wd, n) { var f = U(y, m, 1); return U(y, m, 1 + (wd - f.getUTCDay() + 7) % 7 + 7 * (n - 1)); }
    function lastWd(y, m, wd) { var l = U(y, m + 1, 0); return U(y, m, l.getUTCDate() - (l.getUTCDay() - wd + 7) % 7); }
    if (v.hol) {
      for (var y = s.getUTCFullYear() - 1; y <= e.getUTCFullYear() + 1; y++) {
        obs(y, 0, 1, 'New Year\'s Day');
        if (y >= 1986) add(nth(y, 0, 1, 3), 'Martin Luther King Jr. Day');
        add(nth(y, 1, 1, 3), 'Washington\'s Birthday');
        add(lastWd(y, 4, 1), 'Memorial Day');
        if (y >= 2021) obs(y, 5, 19, 'Juneteenth');
        obs(y, 6, 4, 'Independence Day');
        add(nth(y, 8, 1, 1), 'Labor Day');
        add(nth(y, 9, 1, 2), 'Columbus Day');
        obs(y, 10, 11, 'Veterans Day');
        add(nth(y, 10, 4, 4), 'Thanksgiving Day');
        obs(y, 11, 25, 'Christmas Day');
      }
    }
    var d = v.inclStart ? s : H.addDays(s, 1);
    var cal = 0, wkend = 0, holN = 0, biz = 0, list = [];
    while (d <= e) {
      cal++;
      var w = d.getUTCDay(), k = H.iso(d);
      if (w === 0 || w === 6) wkend++;
      else if (hol[k]) { holN++; if (list.length < 40) list.push([H.weekday(d).slice(0, 3) + ', ' + H.fmtDate(d), hol[k]]); }
      else biz++;
      d = H.addDays(d, 1);
    }
    var pto = v.pto > 0 ? Math.round(v.pto) : 0;
    var work = Math.max(0, biz - pto);
    var rows = [
      ['Calendar days counted', H.int(cal)],
      ['Weekend days', H.int(wkend)],
      ['Weekdays', H.int(cal - wkend)]
    ];
    if (v.hol) rows.push(['Federal holidays on weekdays', H.int(holN)]);
    if (pto) rows.push(['Other days off', '−' + H.int(pto)]);
    rows.push(['Working hours at 8 h/day', H.int(work * 8)]);
    rows.push(['Equivalent 5-day work weeks', H.num(work / 5, 1)]);
    return {
      value: H.int(work) + (work === 1 ? ' business day' : ' business days'),
      label: (v.inclStart ? 'From ' : 'After ') + H.fmtDate(s) + ' through ' + H.fmtDate(e) + (swapped ? ' (dates swapped)' : ''),
      expr: H.int(cal - wkend) + ' weekdays' + (v.hol ? ' − ' + holN + ' holidays' : '') + (pto ? ' − ' + pto + ' days off' : ''),
      rows: rows,
      table: list.length ? { caption: 'Federal holidays excluded' + (holN > list.length ? ' (first ' + list.length + ' shown)' : ''), head: ['Date', 'Holiday'], rows: list } : null,
      sub: 'Banks and the Federal Reserve also close on these days, except that they don\'t take a Friday off when a holiday falls on Saturday.'
    };
  },
  quick: ({ r, v, H }) => `Business days are weekdays minus holidays. From ${H.fmtDate(v.start)} through <strong>Dec 31, 2027</strong> there are <strong>${r.value}</strong> (${r.expr}). A full year has about 250 U.S. federal working days: 2026 has 261 weekdays minus 11 federal holidays = 250, and 2027 has 249 because New Year's Day 2028 is observed on Friday, Dec 31, 2027.`,
  stepsTitle: 'How to count working days between two dates',
  steps: [
    'Count the calendar days in the range, deciding whether the start date counts. The end date normally does.',
    'Remove weekends. Every full week has 5 weekdays, so 52 weeks is 260; add the leftover days one by one.',
    'Remove federal holidays that land on weekdays, using the <strong>observed</strong> date: a holiday on Saturday is observed Friday, on Sunday it moves to Monday. Using the calendar date instead of the observed date is the most common mistake.',
    'Subtract your own planned days off (vacation, PTO, company holidays) to get the days you will actually work.'
  ],
  formulaTitle: 'What is the business days formula?',
  formula: {
    expr: 'Business days = Calendar days − Weekend days − Weekday holidays − Other days off<br>Weekdays in a full year = 260 + the extra 1 or 2 days that fall Monday–Friday',
    vars: [['Weekday holidays', 'federal holidays whose observed date is Monday–Friday'], ['Other days off', 'your own PTO or company closures']],
    note: 'The 11 federal holidays are set by 5 U.S.C. 6103. Juneteenth was added in 2021; earlier years use 10.'
  },
  example: `<p><strong>Calendar year 2026:</strong> 2026 starts on a Thursday and has 365 days, so it has 52 full weeks (260 weekdays) plus one extra Thursday: <strong>261 weekdays</strong>. All 11 federal holidays land on weekdays (Independence Day, a Saturday, is observed Friday, July 3), so 261 − 11 = <strong>250 business days</strong>.</p>
<p><strong>Calendar year 2027:</strong> also 261 weekdays. Juneteenth (Saturday) is observed Friday, June 18; July 4 (Sunday) is observed Monday, July 5; Christmas (Saturday) is observed Friday, December 24; and New Year's Day 2028 (Saturday) is observed Friday, December 31, 2027. That makes 12 observed holidays inside 2027 and <strong>249 business days</strong>.</p>
<p><strong>Until retirement:</strong> with 15 vacation days a year, a person retiring three years from now works roughly 3 × (250 − 15) ≈ 705 more days.</p>`,
  table: {
    title: 'How many business days are in each month of 2027?',
    intro: 'Weekdays, federal holidays (observed) and business days per month, counted by the calculator.',
    head: ['Month (2027)', 'Weekdays', 'Federal holidays', 'Business days'],
    rows: ({ run }) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((n, i) => { const last = new Date(Date.UTC(2027, i + 1, 0)).getUTCDate(); const mm = String(i + 1).padStart(2, '0'); const r = run({ start: '2027-' + mm + '-01', end: '2027-' + mm + '-' + last, inclStart: true, hol: true, pto: 0 }); return [n, r.rows[2][1], r.rows[3][1], r.value.replace(/ business days?/, '')]; }),
    note: 'Total for 2027: 249 business days. December has two observed holidays: Christmas (Fri, Dec 24) and New Year\'s Day 2028 (Fri, Dec 31).'
  },
  sections: [
    {
      h2: 'What are the U.S. federal holidays in 2026 and 2027?',
      html: `<div class="twrap"><table><thead><tr><th>Holiday</th><th>2026 (observed)</th><th>2027 (observed)</th></tr></thead><tbody>
<tr><td>New Year's Day</td><td>Thu, Jan 1</td><td>Fri, Jan 1</td></tr>
<tr><td>Martin Luther King Jr. Day</td><td>Mon, Jan 19</td><td>Mon, Jan 18</td></tr>
<tr><td>Washington's Birthday (Presidents Day)</td><td>Mon, Feb 16</td><td>Mon, Feb 15</td></tr>
<tr><td>Memorial Day</td><td>Mon, May 25</td><td>Mon, May 31</td></tr>
<tr><td>Juneteenth</td><td>Fri, Jun 19</td><td>Fri, Jun 18</td></tr>
<tr><td>Independence Day</td><td>Fri, Jul 3</td><td>Mon, Jul 5</td></tr>
<tr><td>Labor Day</td><td>Mon, Sep 7</td><td>Mon, Sep 6</td></tr>
<tr><td>Columbus Day</td><td>Mon, Oct 12</td><td>Mon, Oct 11</td></tr>
<tr><td>Veterans Day</td><td>Wed, Nov 11</td><td>Thu, Nov 11</td></tr>
<tr><td>Thanksgiving Day</td><td>Thu, Nov 26</td><td>Thu, Nov 25</td></tr>
<tr><td>Christmas Day</td><td>Fri, Dec 25</td><td>Fri, Dec 24</td></tr>
</tbody></table></div>
<p>New Year's Day 2028 falls on a Saturday, so federal employees get Friday, December 31, 2027 off. Inauguration Day (January 20 every four years, next in 2029) is an extra holiday only for federal workers in the Washington, D.C. area and isn't counted here.</p>`
    },
    {
      h2: 'How many working days until retirement?',
      html: `<p>Set the start date to today and the end date to your last day of work. The calculator counts every weekday in between and removes federal holidays. Then enter your remaining vacation and PTO days in "Other days off" to get the days you will actually work.</p>
<p>As a rule of thumb, a full-time U.S. worker with federal holidays off has about 250 working days a year, or about 235 after three weeks of vacation. Five years to retirement is roughly 1,175 working days at that pace.</p>`
    },
    {
      h2: 'Are bank business days the same as federal holidays?',
      html: `<p>Almost. Banks generally follow the Federal Reserve holiday schedule, which uses the same 11 holidays. The difference: when a holiday falls on a <strong>Saturday</strong>, the Federal Reserve stays open on the preceding Friday, while federal offices close. So July 3, 2026 is a federal day off but a normal banking day. Sunday holidays move to Monday for both. Stock exchanges keep their own calendar (they close on Good Friday and stay open on Columbus Day and Veterans Day).</p>
<p>Private employers choose their own holidays, and many observe a shorter list (often New Year's Day, Memorial Day, July 4, Labor Day, Thanksgiving and Christmas). If you work some federal holidays, untick the holiday option and enter your employer's holidays in the days-off field instead.</p>`
    },
    {
      h2: 'How do you count business days in Excel?',
      html: `<p><code>=NETWORKDAYS(A2, B2, H2:H12)</code> counts weekdays from A2 to B2, including both dates, minus any holidays listed in H2:H12. <code>=WORKDAY(A2, 10, H2:H12)</code> goes the other way and finds the date 10 business days after A2. For non-standard weekends (for example Friday–Saturday), use <code>NETWORKDAYS.INTL</code>. To match this calculator, list the observed holiday dates, not the calendar dates.</p>`
    }
  ],
  faq: [
    { q: 'How many working days are in 2026?', a: '250 business days for U.S. federal schedules: 261 weekdays minus 11 federal holidays. Without holidays it is 261.' },
    { q: 'How many working days are in 2027?', a: '249. There are 261 weekdays, and 12 observed federal holidays fall inside 2027 because New Year\'s Day 2028 is observed on Friday, December 31, 2027.' },
    { q: 'Is the start date counted?', a: 'By default, yes, and the end date is always counted, the same way Excel\'s NETWORKDAYS works. Untick "Count the start date" to count only the days after it, for example for a 10-business-day deadline.' },
    { q: 'How many business days are in a year on average?', a: 'About 250 to 252 in the U.S.: 260 or 261 weekdays (262 in some leap years) minus 10 or 11 weekday holidays.' },
    { q: 'What happens when a holiday falls on a weekend?', a: 'For federal employees, a Saturday holiday is observed on the Friday before and a Sunday holiday on the Monday after. The calculator removes the observed date.' },
    { q: 'Are state holidays included?', a: 'No. Only the 11 federal holidays are removed. Enter state or company holidays, such as the day after Thanksgiving, in "Other days off."' },
    { q: 'How many business days are in a month?', a: 'Usually 20 to 23 weekdays, and 19 to 23 business days after federal holidays. See the 2027 table above for every month.' }
  ],
  related: ['days-between-dates-calculator', 'time-card-calculator', 'retirement-age-calculator', 'pto-accrual-calculator', 'holiday-pay-calculator'],
  sources: [
    { name: 'U.S. Office of Personnel Management: Federal Holidays', url: 'https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/' },
    { name: '5 U.S. Code § 6103: Holidays', url: 'https://www.law.cornell.edu/uscode/text/5/6103' },
    { name: 'Federal Reserve: Holidays Observed by the Federal Reserve System', url: 'https://www.federalreserve.gov/aboutthefed/k8.htm' }
  ]
};
