export default {
  slug: 'time-duration-calculator',
  hub: 'time',
  name: 'Time Duration Calculator',
  title: 'Time Duration Calculator: 9 AM to 5:30 PM Is 8 h 30 min',
  h1: 'How Much Time Has Passed? Duration Between Two Dates and Times',
  meta: 'Get the days, hours and minutes between two moments, or how much time has passed since a date. 9:00 AM Jan 1 to 5:30 PM Jan 2 is 1 day 8 h 30 min (32.5 hours).',
  keyword: 'how much time has passed calculator',
  also: ['time duration calculator', 'time between two dates and times', 'how long ago calculator', 'hours between two times', 'how to calculate the hours between two times in excel', 'how can i calculate time in excel', 'elapsed time calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sDate', label: 'Start date', type: 'date', value: '2026-01-01' },
    { id: 'sTime', label: 'Start time', type: 'time', value: '09:00' },
    { id: 'eDate', label: 'End date', type: 'date', value: 'today' },
    { id: 'eTime', label: 'End time', type: 'time', value: '17:30' }
  ],
  compute(v, H) {
    function tm(s) { var m = /^(\d{1,2}):(\d{2})/.exec(String(s || '')); if (!m) return NaN; var h = +m[1], mi = +m[2]; return h < 24 && mi < 60 ? h * 60 + mi : NaN; }
    function t12(min) { var h = Math.floor(min / 60), m = min % 60; return ((h + 11) % 12 + 1) + ':' + (m < 10 ? '0' : '') + m + (h < 12 ? ' AM' : ' PM'); }
    var sd = H.parseDate(v.sDate), ed = H.parseDate(v.eDate);
    if (!sd || !ed) return { error: 'Enter both dates.' };
    var st = tm(v.sTime), et = tm(v.eTime);
    if (isNaN(st)) st = 0;
    if (isNaN(et)) et = 0;
    var a = sd.getTime() / 60000 + st, b = ed.getTime() / 60000 + et;
    var neg = b < a;
    if (neg) { var x = a; a = b; b = x; var y = sd; sd = ed; ed = y; var z = st; st = et; et = z; }
    var mins = Math.round(b - a);
    var d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
    var rem = et - st, eDay = ed;
    if (rem < 0) { rem += 1440; eDay = H.addDays(ed, -1); }
    var ymd = H.ymdDiff(sd, eDay);
    var parts = [];
    if (d) parts.push(H.int(d) + (d === 1 ? ' day' : ' days'));
    if (h || d) parts.push(h + ' h');
    parts.push(m + ' min');
    return {
      value: parts.join(' '),
      label: neg ? 'Duration (the end is before the start, shown as a positive span)' : 'Time elapsed',
      expr: H.fmtDate(sd) + ' ' + t12(st) + ' → ' + H.fmtDate(ed) + ' ' + t12(et),
      rows: [
        ['Total hours', H.num(mins / 60, 2) + ' h', true],
        ['Hours and minutes', H.int(Math.floor(mins / 60)) + ':' + (m < 10 ? '0' : '') + m],
        ['Total minutes', H.int(mins)],
        ['Total seconds', H.int(mins * 60)],
        ['Weeks', H.int(Math.floor(d / 7)) + ' weeks, ' + (d % 7) + ' days, ' + h + ' h ' + m + ' min'],
        ['Calendar breakdown', ymd.y + ' y, ' + ymd.m + ' mo, ' + ymd.d + ' d, ' + Math.floor(rem / 60) + ' h ' + (rem % 60) + ' min'],
        ['Total days (decimal)', H.num(mins / 1440, 3)]
      ],
      sub: 'Clock-time difference. If the span crosses a daylight saving change, actual elapsed time is one hour more or less.'
    };
  },
  quick: ({ r, v, H }) => `To find how much time has passed, subtract the start date and time from the end date and time, borrowing 60 minutes or 24 hours when needed. From <strong>9:00 AM on Jan 1, 2026</strong> to 5:30 PM on ${H.fmtDate(v.eDate)}, <strong>${r.value}</strong> have passed, which is ${r.rows[0][1].replace(' h', '')} hours or ${r.rows[2][1]} minutes. Within one day, 9:00 AM to 5:30 PM is 8 hours 30 minutes.`,
  stepsTitle: 'How to calculate the time between two dates and times',
  steps: [
    'Write both times in 24-hour form: 5:30 PM is 17:30, 12:15 AM is 00:15.',
    'Subtract minutes. If the end minutes are smaller, borrow 1 hour (add 60 to the minutes and take 1 from the end hour).',
    'Subtract hours. If the end hour is smaller, borrow 1 day (add 24 hours). This is the step that trips people up for overnight spans like 10 PM to 6 AM.',
    'Count the whole days between the two dates and add the hours and minutes. To get total hours, multiply days by 24 and add the leftover hours.'
  ],
  formulaTitle: 'What is the time duration formula?',
  formula: {
    expr: 'Duration = (End date + End time) − (Start date + Start time)<br>Total hours = Days × 24 + Hours + Minutes ÷ 60',
    vars: [['1 day', '24 hours = 1,440 minutes = 86,400 seconds'], ['1 week', '168 hours = 10,080 minutes'], ['1 hour', '60 minutes = 3,600 seconds']],
    note: 'Calculated in clock time. Across a daylight saving time change (second Sunday in March, first Sunday in November in most of the U.S.), the true elapsed time differs by one hour.'
  },
  example: `<p><strong>Same day:</strong> 9:00 AM to 5:30 PM. In 24-hour time that is 17:30 − 9:00 = <strong>8 hours 30 minutes</strong>, or 8.5 hours.</p>
<p><strong>Across midnight:</strong> 10:45 PM to 6:20 AM the next day. 6:20 − 22:45: minutes 20 − 45 is negative, so borrow an hour (80 − 45 = 35 min, end hour becomes 5). Hours 5 − 22 is negative, so add 24 (29 − 22 = 7). Result: <strong>7 hours 35 minutes</strong>.</p>
<p><strong>Across dates:</strong> 9:00 AM Jan 1 to 5:30 PM Jan 2 is 1 day plus 8 h 30 min = <strong>32.5 hours</strong>.</p>`,
  table: {
    title: 'How many hours, minutes and seconds are in common time spans?',
    intro: 'Each span run through the calculator, midnight to midnight in 2026.',
    head: ['Time span', 'Hours', 'Minutes', 'Seconds'],
    rows: ({ run }) => [['1 hour', '2026-01-01', '2026-01-01', '01:00'], ['8 hours', '2026-01-01', '2026-01-01', '08:00'], ['1 day', '2026-01-01', '2026-01-02', '00:00'], ['1 week', '2026-01-01', '2026-01-08', '00:00'], ['2 weeks', '2026-01-01', '2026-01-15', '00:00'], ['February 2026 (28 days)', '2026-02-01', '2026-03-01', '00:00'], ['January (31 days)', '2026-01-01', '2026-02-01', '00:00'], ['Quarter (Jan–Mar 2026)', '2026-01-01', '2026-04-01', '00:00'], ['Year 2026 (365 days)', '2026-01-01', '2027-01-01', '00:00']].map(([n, s, e, t]) => { const r = run({ sDate: s, sTime: '00:00', eDate: e, eTime: t }); return [n, r.rows[0][1].replace(' h', ''), r.rows[2][1], r.rows[3][1]]; }),
    note: 'A leap year (366 days) has 8,784 hours, 527,040 minutes and 31,622,400 seconds.'
  },
  sections: [
    {
      h2: 'How do you calculate time that crosses midnight?',
      html: `<p>Add 24 hours to the end time before subtracting, or treat the end as the next calendar date. A night shift from 11:00 PM to 7:00 AM is (7 + 24) − 23 = <strong>8 hours</strong>. In the calculator, set the end date to the next day and the times as they appear on the clock.</p>
<p>If you only need hours worked across a week, the <a href="/time-card-calculator">time card calculator</a> handles overnight punches and unpaid breaks automatically.</p>`
    },
    {
      h2: 'How do you convert minutes to decimal hours?',
      html: `<p>Divide the minutes by 60. 30 minutes is 0.5 hours, 45 minutes is 0.75 and 20 minutes is 0.333. So 8 hours 30 minutes is 8.5 hours, and 7 h 35 min is 7 + 35 ÷ 60 = 7.583 hours. Going the other way, multiply the decimal part by 60: 2.4 hours is 2 hours 24 minutes, not 2 hours 40 minutes.</p>`
    },
    {
      h2: 'How do you calculate the hours between two times in Excel?',
      html: `<p>Excel stores times as fractions of a day, so subtract and multiply by 24: <code>=(B2-A2)*24</code> gives decimal hours. For an overnight span use <code>=MOD(B2-A2,1)*24</code>, which adds a day when the end time is earlier. To show hours and minutes instead, use <code>=B2-A2</code> with the custom format <code>[h]:mm</code>; the brackets let the total exceed 24 hours.</p>`
    },
    {
      h2: 'Does daylight saving time change the result?',
      html: `<p>The calculator works in clock time, which is what most people read off a calendar and watch. On the night clocks spring forward (the second Sunday in March in most of the U.S.), 1:00 AM to 4:00 AM on the clock is only 2 hours of real time; on the November fall-back night it is 4 hours. For pay, the Fair Labor Standards Act counts hours actually worked, so a non-exempt employee on an overnight shift that night works, and must be paid for, one extra hour.</p>`
    }
  ],
  faq: [
    { q: 'How many hours are between 9 AM and 5 PM?', a: '8 hours. With a 30-minute unpaid lunch, that is 7.5 hours worked.' },
    { q: 'How do I calculate how long ago something happened?', a: 'Enter the past date and time as the start and today as the end. The calculator shows the days, hours and minutes since then, plus totals in hours, minutes and seconds.' },
    { q: 'How many minutes are in a day?', a: '1,440 minutes (24 × 60), or 86,400 seconds.' },
    { q: 'How many hours are in a week?', a: '168 hours (7 × 24), or 10,080 minutes.' },
    { q: 'What is 7 hours and 45 minutes in decimal?', a: '7.75 hours, because 45 ÷ 60 = 0.75.' },
    { q: 'How do I add up several time durations?', a: 'Add the hours and minutes separately, then convert every 60 minutes into an hour. 3 h 40 min + 2 h 35 min = 5 h 75 min = 6 h 15 min.' }
  ],
  related: ['time-card-calculator', 'days-between-dates-calculator', 'business-days-calculator', 'age-calculator'],
  sources: [
    { name: 'NIST: Daylight Saving Time Rules', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst' },
    { name: 'U.S. Department of Labor: Fact Sheet #22, Hours Worked Under the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/22-flsa-hours-worked' }
  ]
};
