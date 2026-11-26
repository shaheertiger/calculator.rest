export default {
  slug: 'time-duration-calculator',
  hub: 'everyday',
  name: 'Time Duration Calculator',
  title: 'Time Duration Calculator: 9:45 AM to 5:20 PM = 7 h 35 min',
  meta: 'From 9:45 AM to 5:20 PM is 7 h 35 min: borrow an hour, then subtract minutes and hours. Find elapsed time between any two times or dates, with steps.',
  keyword: 'time duration calculator',
  also: ['elapsed time calculator', 'how much time between two times', 'hours between two dates and times', 'how long from 9:45 am to 5:20 pm', 'time difference calculator'],
  updated: '2026-11-26',
  answer: ({ r }) => `From 9:45 AM to 5:20 PM is <strong>${r.value}</strong>: borrow an hour so 80 − 45 = 35 minutes, then 16 − 9 = 7 hours.`,
  inputs: [
    { id: 'sDate', label: 'Start date', type: 'date', value: '2026-11-26' },
    { id: 'sTime', label: 'Start time', type: 'time', value: '09:45' },
    { id: 'eDate', label: 'End date', type: 'date', value: '2026-11-26' },
    { id: 'eTime', label: 'End time', type: 'time', value: '17:20' }
  ],
  compute(v, H) {
    function hm(s) { var x = /^(\d{1,2}):(\d{2})/.exec(String(s || '')); if (!x) return null; var h = +x[1], m = +x[2]; return h < 24 && m < 60 ? [h, m] : null; }
    function two(n) { return (n < 10 ? '0' : '') + n; }
    function t12(h, m) { return ((h + 11) % 12 + 1) + ':' + two(m) + (h < 12 ? ' AM' : ' PM'); }
    var sd = H.parseDate(v.sDate), ed = H.parseDate(v.eDate), s = hm(v.sTime), e = hm(v.eTime);
    if (!sd || !ed) return { error: 'Enter both dates.' };
    if (!s || !e) return { error: 'Enter both times.' };
    var days = H.daysBetween(sd, ed);
    var total = days * 1440 + (e[0] * 60 + e[1]) - (s[0] * 60 + s[1]);
    if (total < 0) return { error: 'The end is before the start. Check the times, or move the end date to the next day for an overnight span.' };
    var steps = ['<b>Formula:</b> Duration = End − Start. Subtract the minutes, then the hours, then the days, borrowing 60 minutes from the hours or 24 hours from the days when a column is too small.'];
    steps.push('<b>Write both in 24-hour time:</b> start ' + H.fmtDate(sd) + ' at ' + two(s[0]) + ':' + two(s[1]) + ' (' + t12(s[0], s[1]) + '), end ' + H.fmtDate(ed) + ' at ' + two(e[0]) + ':' + two(e[1]) + ' (' + t12(e[0], e[1]) + '). The dates are ' + H.plural(days, 'day') + ' apart.');
    var eh = e[0], d = days, mins, hrs;
    if (e[1] >= s[1]) {
      mins = e[1] - s[1];
      steps.push('<b>Subtract the minutes:</b> ' + e[1] + ' − ' + s[1] + ' = ' + mins + ' min');
    } else {
      mins = e[1] + 60 - s[1]; eh = e[0] - 1;
      steps.push('<b>Subtract the minutes:</b> ' + e[1] + ' − ' + s[1] + ' is too small, so borrow 1 hour: ' + e[1] + ' + 60 = ' + (e[1] + 60) + ', and ' + (e[1] + 60) + ' − ' + s[1] + ' = ' + mins + ' min. The end hour drops from ' + e[0] + ' to ' + eh + '.');
    }
    if (eh >= s[0]) {
      hrs = eh - s[0];
      steps.push('<b>Subtract the hours:</b> ' + eh + ' − ' + s[0] + ' = ' + hrs + ' h');
    } else {
      hrs = eh + 24 - s[0]; d = days - 1;
      steps.push('<b>Subtract the hours:</b> ' + eh + ' − ' + s[0] + ' is too small, so borrow 1 day: ' + eh + ' + 24 = ' + (eh + 24) + ', and ' + (eh + 24) + ' − ' + s[0] + ' = ' + hrs + ' h. The day count drops from ' + days + ' to ' + d + '.');
    }
    if (days > 0) steps.push('<b>Days left over:</b> ' + d + (d === 1 ? ' day' : ' days'));
    var dec = total / 60;
    steps.push('<b>Total in hours:</b> ' + d + ' × 24 + ' + hrs + ' + ' + mins + ' ÷ 60 = ' + H.num(dec, 6) + ' h, or ' + H.int(total) + ' minutes');
    var parts = [];
    if (d) parts.push(H.int(d) + (d === 1 ? ' day' : ' days'));
    if (hrs || d) parts.push(hrs + ' h');
    parts.push(mins + ' min');
    var shown = parts.join(' ');
    var exactH = Math.abs(dec - H.round(dec, 2)) < 1e-9;
    steps.push('<b>Answer:</b> ' + shown + ', which is ' + H.num(dec, 2) + ' hours (' + (exactH ? 'exact' : 'rounded to 2 decimal places') + ') or ' + H.int(total) + ' minutes (exact).');
    return {
      value: shown,
      label: 'Time elapsed',
      rows: [['Decimal hours', H.num(dec, 2) + ' h', true], ['Total minutes', H.int(total)], ['Hours:minutes', H.int(Math.floor(total / 60)) + ':' + two(total % 60)]],
      steps: steps
    };
  },
  facts: {
    formula: 'Duration = End − Start<br>Decimal hours = Days × 24 + Hours + Minutes ÷ 60',
    vars: [['Borrow an hour', 'take 1 from the end hour and add 60 to the end minutes'], ['Borrow a day', 'take 1 from the days and add 24 to the end hour'], ['24-hour time', '5:20 PM = 17:20, 12:15 AM = 00:15']],
    rounding: 'Hours and minutes are exact. Decimal hours are rounded to 2 decimal places, so 35 minutes shows as 0.58 h.',
    note: 'Time is base 60, not base 10, which is why you borrow 60 minutes rather than 100. The calculator counts clock time, so a span across a daylight saving change reads one hour off the real elapsed time.'
  },
  example: {
    h2: 'Worked example: a train trip that runs overnight',
    html: `<p><strong>Problem:</strong> A train leaves at 8:50 AM on Friday and arrives at 3:25 PM on Saturday. How long is the trip?</p>
<p><strong>1.</strong> In 24-hour time the trip runs from Friday 08:50 to Saturday 15:25, one calendar day apart.</p>
<p><strong>2.</strong> Minutes: 25 − 50 is too small, so borrow an hour: 85 − 50 = 35 minutes, and the end hour becomes 14.</p>
<p><strong>3.</strong> Hours: 14 − 8 = 6 hours.</p>
<p><strong>4.</strong> Days: 1 day.</p>
<p><strong>Answer:</strong> 1 day 6 h 35 min, or 24 + 6 + 35 ÷ 60 = 30.58 hours. Sense check: Friday 8:50 AM to Saturday 8:50 AM is 24 hours, and 8:50 AM to 3:25 PM adds a bit over 6½ more.</p>`
  },
  variants: [
    {
      h2: 'How do you calculate time that crosses midnight?',
      html: `<p>Borrow a day: add 24 to the end hour before subtracting. From 11:30 PM to 6:15 AM the next morning, the minutes need a borrow first (75 − 30 = 45, end hour 5), then the hours do (5 + 24 = 29, and 29 − 23 = 6). The answer is <strong>6 h 45 min</strong>, or 6.75 hours. In the calculator, set the end date to the next day and type the times as the clock shows them.</p>`
    },
    {
      h2: 'How many hours are between two dates and times?',
      html: `<p>Multiply the whole days by 24 and add the leftover hours and minutes. From 9:00 AM on January 1 to 5:30 PM on January 3, the clock difference is 8 h 30 min and the dates are 2 days apart, so the span is 2 days 8 h 30 min, or 2 × 24 + 8 + 30 ÷ 60 = <strong>56.5 hours</strong> (3,390 minutes).</p>`
    },
    {
      h2: 'How do you calculate the hours between two times in Excel?',
      html: `<p>Excel stores a time as a fraction of a day, so subtract and multiply by 24: <code>=(B2-A2)*24</code> turns 9:45 AM and 5:20 PM into 7.58 hours. For a span that crosses midnight, use <code>=MOD(B2-A2,1)*24</code>, which adds a day when the end time is earlier. To show hours and minutes, use <code>=B2-A2</code> with the custom format <code>[h]:mm</code>; the brackets let the total pass 24 hours.</p>`
    }
  ],
  mistakes: [
    '<strong>Subtracting times as decimals.</strong> 17.20 − 9.45 = 7.75, which suggests 7 h 75 min. Minutes and hours have to be subtracted separately: the right answer is 7 h 35 min.',
    '<strong>Borrowing 100 instead of 60.</strong> One hour is 60 minutes, so 20 − 45 becomes 80 − 45 = 35, not 120 − 45 = 75.',
    '<strong>Forgetting to convert PM.</strong> 5:20 − 9:45 looks negative. Write 5:20 PM as 17:20 first.',
    '<strong>Reading 7 h 35 min as 7.35 hours.</strong> 35 minutes is 35 ÷ 60 = 0.58 of an hour, so the decimal is 7.58.'
  ],
  related: ['time-card-calculator', 'speed-calculator', 'average-calculator', 'percentage-calculator'],
  faq: [
    { q: 'How many minutes are in a day?', a: '1,440 minutes, because 24 × 60 = 1,440. That is 86,400 seconds.' },
    { q: 'How do you add two durations together?', a: 'Add the hours and the minutes separately, then turn every 60 minutes into an hour. 3 h 40 min + 2 h 35 min = 5 h 75 min = 6 h 15 min.' },
    { q: 'How do you change decimal hours into hours and minutes?', a: 'Multiply the decimal part by 60. 2.4 hours is 2 hours and 0.4 × 60 = 24 minutes, so 2 h 24 min, not 2 h 40 min.' },
    { q: 'Does daylight saving time change the answer?', a: 'The calculator subtracts clock times. On the night the clocks spring forward, 1:00 AM to 4:00 AM on the clock is only 2 hours of real time; on the night they fall back it is 4.' }
  ]
};
