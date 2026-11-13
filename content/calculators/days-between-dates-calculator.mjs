export default {
  slug: 'days-between-dates-calculator',
  hub: 'time',
  name: 'Days Between Dates Calculator',
  title: 'Days Between Dates Calculator: Jan 1 to Dec 31, 2026 = 364 Days',
  h1: 'How Many Days Apart? Count Days Between Two Dates or Add Days',
  meta: 'Jan 1 to Dec 31, 2026 is 364 days apart (365 if you count both dates). Count days, weeks and months between any two dates, or add or subtract days.',
  keyword: 'how many days apart calculator',
  also: ['days between dates calculator', 'how many days inbetween calculator', 'date difference calculator', 'add days to a date', 'subtract days from a date', 'how many weeks between two dates', 'day of the year'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you need?', type: 'select', value: 'between', wide: true, options: [['between', 'Count the days between two dates'], ['add', 'Add or subtract days from a date']] },
    { id: 'start', label: 'Start date', type: 'date', value: 'today' },
    { id: 'end', label: 'End date', type: 'date', value: '2027-01-01', showIf: { mode: ['between'] } },
    { id: 'incl', label: 'Include the end date (count both days)', type: 'checkbox', value: false, showIf: { mode: ['between'] } },
    { id: 'n', label: 'Number of days', type: 'number', value: 90, showIf: { mode: ['add'] } },
    { id: 'dir', label: 'Direction', type: 'select', value: 'add', showIf: { mode: ['add'] }, options: [['add', 'Add (later date)'], ['sub', 'Subtract (earlier date)']] }
  ],
  compute(v, H) {
    var s = H.parseDate(v.start);
    if (!s) return { error: 'Enter a start date.' };
    if (v.mode === 'add') {
      if (!(v.n >= 0)) return { error: 'Enter how many days to add or subtract.' };
      var n = Math.round(v.n) * (v.dir === 'sub' ? -1 : 1);
      var r = H.addDays(s, n);
      return {
        value: H.fmtDate(r),
        label: H.weekday(r) + ', ' + H.plural(Math.abs(n), 'day') + (n < 0 ? ' before ' : ' after ') + H.fmtDate(s),
        expr: H.fmtDate(s) + (n < 0 ? ' − ' : ' + ') + H.int(Math.abs(n)) + ' days',
        rows: [
          ['Resulting date', H.fmtDate(r, true), true],
          ['ISO format', H.iso(r)],
          ['Same span in weeks', H.int(Math.floor(Math.abs(n) / 7)) + ' weeks, ' + (Math.abs(n) % 7) + ' days'],
          ['Day of the year', H.ord(H.daysBetween(new Date(Date.UTC(r.getUTCFullYear(), 0, 1)), r) + 1) + ' of ' + (H.isLeap(r.getUTCFullYear()) ? 366 : 365)]
        ]
      };
    }
    var e = H.parseDate(v.end);
    if (!e) return { error: 'Enter an end date.' };
    var raw = H.daysBetween(s, e);
    var neg = raw < 0;
    var span = Math.abs(raw) + (v.incl ? 1 : 0);
    var a = neg ? H.ymdDiff(e, s) : H.ymdDiff(s, e);
    var rows = [
      ['Weeks and days', H.int(Math.floor(span / 7)) + ' weeks, ' + (span % 7) + ' days'],
      ['Months and days', (a.y * 12 + a.m) + ' months, ' + a.d + ' days' + (v.incl ? ' (end date not added)' : '')],
      ['Years, months, days', a.y + ' y, ' + a.m + ' m, ' + a.d + ' d'],
      ['In hours', H.int(span * 24)],
      ['In minutes', H.int(span * 1440)],
      ['Start falls on', H.weekday(neg ? e : s) + ', ' + H.fmtDate(neg ? e : s)],
      ['End falls on', H.weekday(neg ? s : e) + ', ' + H.fmtDate(neg ? s : e)]
    ];
    return {
      value: H.int(span) + (span === 1 ? ' day' : ' days'),
      label: neg ? 'The end date is before the start date: it was this many days earlier' : (v.incl ? 'Days, counting both the start and end date' : 'Days between the dates (end date not counted)'),
      expr: H.fmtDate(s) + ' → ' + H.fmtDate(e),
      rows: rows,
      sub: v.incl ? 'Counting both ends adds one day, as for hotel nights plus checkout day or an inclusive date range.' : 'Tick "include the end date" if both the first and last day should count, like a 7-day event from Monday to Sunday.'
    };
  },
  quick: ({ r, v, H }) => `To find how many days apart two dates are, subtract the earlier date from the later one. From ${H.fmtDate(v.start)} to <strong>${H.fmtDate(v.end)}</strong> is <strong>${r.value}</strong> (${r.rows[0][1]}). Add 1 if you count both the first and last day. Jan 1 to Dec 31, 2026 is 364 days apart, or 365 counted inclusively.`,
  stepsTitle: 'How to count the days between two dates',
  steps: [
    'Count the days left in the start month after the start date. From March 10, that is 31 − 10 = 21 days.',
    'Add the full length of every month in between (30 or 31 days; February has 28, or 29 in a leap year).',
    'Add the day-of-month of the end date. March 10 to May 4 is 21 + 30 (April) + 4 = 55 days.',
    'Decide whether to count both ends. The standard difference leaves out the start date; an inclusive count adds 1. Mixing the two is where most hand counts go wrong.'
  ],
  formulaTitle: 'What is the formula for days between dates?',
  formula: {
    expr: 'Days = End date − Start date<br>Inclusive days = End date − Start date + 1<br>Weeks = Days ÷ 7',
    vars: [['End − Start', 'the number of midnights crossed between the two dates'], ['+ 1', 'counts the start day as well, for inclusive ranges']],
    note: 'Leap days are handled automatically. Dates are counted as calendar days, so time zones and daylight saving time do not change the result.'
  },
  example: `<p><strong>Between two dates:</strong> a lease runs from March 10, 2026 to May 4, 2026. March has 21 days left after the 10th, April has 30, and May adds 4: 21 + 30 + 4 = <strong>55 days</strong>, or 7 weeks and 6 days. Counting both the move-in and move-out day gives 56.</p>
<p><strong>Adding days:</strong> 90 days after Nov 13, 2026 is <strong>Feb 11, 2027</strong>. 30 days after is Dec 13, 2026, 60 days after is Jan 12, 2027 and 180 days after is May 12, 2027.</p>`,
  table: {
    title: 'What day of the year is the 1st of each month?',
    intro: 'Day number of the first of each month (Jan 1 = day 1) in a common year and a leap year, counted by the calculator. Subtract two day numbers to get the days between dates in the same year.',
    head: ['Date', 'Day of year in 2026', 'Day of year in 2028 (leap)'],
    rows: ({ run }) => ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m, i) => [['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i] + ' 1', run({ mode: 'between', start: '2026-01-01', end: '2026-' + m + '-01', incl: true }).value.replace(/ days?/, ''), run({ mode: 'between', start: '2028-01-01', end: '2028-' + m + '-01', incl: true }).value.replace(/ days?/, '')]),
    note: 'Example: Jul 1 is day 182 and Oct 1 is day 274 in 2026, so they are 274 − 182 = 92 days apart.'
  },
  sections: [
    {
      h2: 'Should you count the start date, the end date or both?',
      html: `<p>It depends on what you are counting:</p>
<ul><li><strong>Elapsed time</strong> (age, how long ago, countdowns): don't include the end date. Monday to Friday is 4 days.</li>
<li><strong>Days of an event or a stay you pay for by day</strong> (a conference, a rental billed per calendar day, medication doses): count both. Monday through Friday is 5 days.</li>
<li><strong>Hotel nights:</strong> the plain difference. Check in Monday, check out Friday is 4 nights.</li>
<li><strong>Legal and contract deadlines:</strong> U.S. federal court rules exclude the day of the event that triggers the period and include the last day, unless it falls on a weekend or legal holiday. Check the rule that applies to you.</li></ul>`
    },
    {
      h2: 'How many weeks and months are between two dates?',
      html: `<p>Weeks are simple: divide the days by 7. 55 days is 7 weeks and 6 days. Months are trickier because months have different lengths. The calculator counts whole calendar months first (March 10 to May 10 is 2 months) and then the leftover days (May 10 to May 4 doesn't reach, so March 10 to May 4 is 1 month and 24 days).</p>
<p>For a rough figure, divide days by 30.44, the average month length in the Gregorian calendar (365.2425 ÷ 12).</p>`
    },
    {
      h2: 'How do you add or subtract days from a date?',
      html: `<p>Switch the mode to "Add or subtract days." Common uses: a 30-, 60- or 90-day return or notice period, a 180-day visa limit, a due date "net 45" on an invoice, or counting back 280 days from a due date. Adding days is exact; adding "3 months" is not the same as adding 90 days (it can be 89 to 92 depending on the months).</p>
<p>If you need to skip weekends and holidays, for example "10 business days," use the <a href="/business-days-calculator">business days calculator</a> instead.</p>`
    },
    {
      h2: 'How do you count days between dates in Excel?',
      html: `<p>Subtract the cells: <code>=B2-A2</code> gives the days between two dates (format the result as a number). <code>=DAYS(B2, A2)</code> does the same. Add 1 for an inclusive count. For whole months and years use <code>=DATEDIF(A2, B2, "M")</code> or <code>"Y"</code>, and for weekdays only use <code>=NETWORKDAYS(A2, B2)</code>.</p>`
    }
  ],
  faq: [
    { q: 'How many days are there in 2026?', a: '2026 has 365 days because it is not a leap year. The next leap year, with 366 days, is 2028.' },
    { q: 'How many days apart are two dates if I include both?', a: 'Add 1 to the difference. Jan 1 to Jan 31 is 30 days apart, or 31 days counting both.' },
    { q: 'How many days is 6 months?', a: 'Between 181 and 184 days, depending on which months. Jan 1 to Jul 1, 2026 is 181 days; Jul 1, 2026 to Jan 1, 2027 is 184.' },
    { q: 'How many weeks are in a year?', a: '52 weeks and 1 day in a common year (365 days), or 52 weeks and 2 days in a leap year.' },
    { q: 'Does the calculator account for leap years?', a: 'Yes. February 29 is counted in leap years such as 2024 and 2028, and century years follow the Gregorian rule (2000 was a leap year, 2100 will not be).' },
    { q: 'What if the end date is before the start date?', a: 'The calculator shows how many days earlier the end date is, so you can also use it to count how long ago something happened.' },
    { q: 'What is 90 days from today?', a: 'Choose "Add or subtract days," keep today\'s date as the start and enter 90. From Nov 13, 2026, it is Feb 11, 2027.' }
  ],
  related: ['business-days-calculator', 'time-duration-calculator', 'age-calculator', 'day-of-week-calculator'],
  sources: [
    { name: 'NIST: Walk Through Time (calendars and the Gregorian leap-year rule)', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time' },
    { name: 'Federal Rules of Civil Procedure, Rule 6: Computing time', url: 'https://www.law.cornell.edu/rules/frcp/rule_6' }
  ]
};
