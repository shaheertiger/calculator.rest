export default {
  slug: 'day-of-week-calculator',
  hub: 'time',
  name: 'Day of the Week Calculator',
  title: 'Day of the Week Calculator: July 4, 1776 Was a Thursday',
  h1: 'What Day of the Week Was It? Weekday Finder With Zeller and Doomsday',
  meta: 'Find the weekday of any date, past or future, with the working shown. July 4, 1776 was a Thursday; Christmas 2026 is a Friday. Uses Zeller\'s congruence and Doomsday.',
  keyword: 'how to calculate the weekday for any date',
  also: ['day of the week calculator', 'what day of the week was', 'what day of the week is', 'zeller\'s congruence calculator', 'doomsday rule calculator', 'what day was i born'],
  updated: '2026-11-13',
  inputs: [
    { id: 'date', label: 'Date', type: 'date', value: '1776-07-04' },
    { id: 'cal', label: 'Calendar', type: 'select', value: 'auto', options: [['auto', 'Automatic (Julian before Oct 15, 1582)'], ['greg', 'Gregorian (modern calendar)'], ['jul', 'Julian (old style)']] }
  ],
  compute(v, H) {
    var m = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(String(v.date || ''));
    if (!m) return { error: 'Enter a date.' };
    var y = +m[1], mo = +m[2], d = +m[3];
    if (y < 1 || mo < 1 || mo > 12 || d < 1) return { error: 'Enter a valid date.' };
    var jul = v.cal === 'jul' || (v.cal === 'auto' && (y < 1582 || (y === 1582 && (mo < 10 || (mo === 10 && d < 15)))));
    if (v.cal === 'auto' && y === 1582 && mo === 10 && d > 4 && d < 15) return { error: 'October 5–14, 1582 never happened in the Gregorian changeover. Pick Julian or Gregorian explicitly.' };
    var leap = jul ? y % 4 === 0 : (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    var ml = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (d > ml[mo - 1]) return { error: 'That month has only ' + ml[mo - 1] + ' days in ' + y + '.' };
    var names = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    var mn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var zm = mo < 3 ? mo + 12 : mo, zy = mo < 3 ? y - 1 : y;
    var K = zy % 100, J = Math.floor(zy / 100);
    var t1 = Math.floor(13 * (zm + 1) / 5), t2 = Math.floor(K / 4);
    var h = jul ? (d + t1 + K + t2 + 5 + 6 * J) % 7 : (d + t1 + K + t2 + Math.floor(J / 4) + 5 * J) % 7;
    var day = names[h];
    var doy = d; for (var i = 0; i < mo - 1; i++) doy += ml[i];
    var rows = [
      ['Calendar used', jul ? 'Julian' : 'Gregorian'],
      ['Day of the year', H.ord(doy) + ' of ' + (leap ? 366 : 365) + (leap ? ' (leap year)' : '')],
      ['Zeller: q + ⌊13(m+1)/5⌋ + K + ⌊K/4⌋ + ' + (jul ? '5 + 6J' : '⌊J/4⌋ + 5J'), d + ' + ' + t1 + ' + ' + K + ' + ' + t2 + ' + ' + (jul ? '5 + ' + 6 * J : Math.floor(J / 4) + ' + ' + 5 * J) + ' = ' + (jul ? d + t1 + K + t2 + 5 + 6 * J : d + t1 + K + t2 + Math.floor(J / 4) + 5 * J) + ' → mod 7 = ' + h + ' (' + day + ')']
    ];
    if (!jul) {
      var wd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var c = Math.floor(y / 100), yy = y % 100;
      var anchor = (5 * (c % 4) + 2) % 7;
      var a = Math.floor(yy / 12), b = yy % 12, cc = Math.floor(b / 4);
      var dd = (anchor + a + b + cc) % 7;
      var dm = [leap ? 4 : 3, leap ? 29 : 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12][mo - 1];
      rows.push(['Doomsday: century anchor + ⌊yy/12⌋ + yy mod 12 + ⌊(yy mod 12)/4⌋', wd[anchor] + ' + ' + a + ' + ' + b + ' + ' + cc + ' → ' + wd[dd]]);
      rows.push(['Nearest doomsday date', mn[mo - 1] + ' ' + dm + ' is a ' + wd[dd] + '; ' + mn[mo - 1] + ' ' + d + ' is ' + Math.abs(d - dm) + (d >= dm ? ' days later' : ' days earlier')]);
      var dow = (h + 5) % 7 + 1;
      var wk = Math.floor((doy - dow + 10) / 7);
      function wiy(Y) { function p(X) { return (X + Math.floor(X / 4) - Math.floor(X / 100) + Math.floor(X / 400)) % 7; } return p(Y) === 4 || p(Y - 1) === 3 ? 53 : 52; }
      var isoY = y;
      if (wk < 1) { isoY = y - 1; wk = wiy(y - 1); } else if (wk > wiy(y)) { isoY = y + 1; wk = 1; }
      rows.push(['ISO week', 'Week ' + wk + ' of ' + isoY]);
    }
    return {
      value: day,
      label: mn[mo - 1] + ' ' + d + ', ' + y + (jul ? ' (Julian calendar)' : ''),
      expr: 'Zeller h = ' + h,
      rows: rows,
      sub: (day === 'Saturday' || day === 'Sunday') ? 'A weekend day.' : 'A weekday.'
    };
  },
  quick: ({ r }) => `To find the weekday for any date, use Zeller's congruence or the Doomsday rule. July 4, 1776, the day the Declaration of Independence was adopted, fell on a <strong>${r.value}</strong>: 1776's doomsday was a Thursday, July 11 is always a doomsday, and July 4 is exactly one week earlier. Enter any date to see the full working.`,
  stepsTitle: 'How to calculate the weekday for any date (Doomsday rule)',
  steps: [
    'Find the <strong>century anchor</strong>: 1700s Sunday, 1800s Friday, 1900s Wednesday, 2000s Tuesday (the pattern repeats every 400 years).',
    'Take the last two digits of the year (yy). Add ⌊yy ÷ 12⌋, the remainder yy mod 12, and that remainder ÷ 4 (rounded down). Add this to the anchor and reduce mod 7 to get the year\'s <strong>doomsday</strong>. For 1776: 6 + 4 + 1 = 11, and Sunday + 11 = Thursday.',
    'Recall a doomsday date in your month: 4/4, 6/6, 8/8, 10/10, 12/12, 5/9, 9/5, 7/11, 11/7, March 14, and the last day of February. January 3 (January 4 in leap years) is the one people most often get wrong.',
    'Count forward or back from that date to yours. July 4 is 7 days before July 11, so July 4, 1776 was a Thursday too.'
  ],
  formulaTitle: 'What is Zeller\'s congruence?',
  formula: {
    expr: 'h = (q + ⌊13(m + 1) ÷ 5⌋ + K + ⌊K ÷ 4⌋ + ⌊J ÷ 4⌋ + 5J) mod 7<br>Julian calendar: h = (q + ⌊13(m + 1) ÷ 5⌋ + K + ⌊K ÷ 4⌋ + 5 + 6J) mod 7',
    vars: [['h', 'day of the week: 0 = Saturday, 1 = Sunday, 2 = Monday … 6 = Friday'], ['q', 'day of the month'], ['m', 'month, with March = 3 … December = 12, and January and February counted as 13 and 14 of the previous year'], ['K', 'year of the century (year mod 100)'], ['J', 'zero-based century (⌊year ÷ 100⌋)']],
    note: 'Treating January and February as months 13 and 14 of the previous year puts the leap day at the end of the "year," which is what makes the formula work.'
  },
  example: `<p><strong>July 4, 1776 with Zeller:</strong> q = 4, m = 7, K = 76, J = 17.</p>
<p>⌊13 × 8 ÷ 5⌋ = 20, ⌊76 ÷ 4⌋ = 19, ⌊17 ÷ 4⌋ = 4, 5 × 17 = 85.</p>
<p>h = (4 + 20 + 76 + 19 + 4 + 85) mod 7 = 208 mod 7 = <strong>5 → Thursday</strong>.</p>
<p><strong>A January date:</strong> January 1, 2000 uses m = 13 and the year 1999 (K = 99, J = 19): (1 + 36 + 99 + 24 + 4 + 95) mod 7 = 259 mod 7 = 0 → <strong>Saturday</strong>.</p>`,
  table: {
    title: 'What day of the week are New Year\'s Day, July 4 and Christmas?',
    intro: 'Weekdays for the next ten years, from the calculator.',
    head: ['Year', 'January 1', 'July 4', 'December 25'],
    rows: ({ run }) => [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map(y => [String(y), run({ date: y + '-01-01', cal: 'greg' }).value, run({ date: y + '-07-04', cal: 'greg' }).value, run({ date: y + '-12-25', cal: 'greg' }).value]),
    note: 'Each date moves one weekday later per year, or two when a February 29 comes in between.'
  },
  sections: [
    {
      h2: 'Why does the calendar matter for old dates?',
      html: `<p>The Gregorian calendar started on October 15, 1582 in Catholic countries; the day before was October 4 in the old Julian calendar. Britain and its American colonies switched in 1752, when Wednesday, September 2 was followed by Thursday, September 14. Russia switched in 1918 and Greece in 1923.</p>
<p>So the "same" date can fall on different weekdays depending on which calendar the record used. George Washington was born on February 11, 1731 by the Julian calendar then in use in Virginia, which is February 22, 1732 in the Gregorian calendar. Choose the calendar above that matches your source; "automatic" uses Julian before October 15, 1582 and Gregorian after.</p>`
    },
    {
      h2: 'How do you find the day of the week in your head?',
      html: `<p>The Doomsday rule, devised by mathematician John Conway, is the fastest mental method. Every year, a set of easy dates (4/4, 6/6, 8/8, 10/10, 12/12, 5/9, 9/5, 7/11, 11/7 and the last day of February) all fall on the same weekday, called the doomsday. Memorize "9-to-5 at the 7-Eleven" for 5/9, 9/5, 7/11 and 11/7.</p>
<p>For 2026, the doomsday is Saturday (Tuesday anchor + 2 + 2 + 0 = Saturday). So October 10, 2026 is a Saturday, and Halloween, three weeks later, is a Saturday as well. Christmas: December 12 is a Saturday, so December 25, 13 days later, is a Friday.</p>`
    },
    {
      h2: 'Why does my birthday move one weekday each year?',
      html: `<p>A common year has 365 days, which is 52 weeks plus 1 day, so every date shifts one weekday later. In a leap year, dates after February 28 shift two. The weekday pattern for a whole calendar repeats every 28 years between 1901 and 2099; the full Gregorian cycle is 400 years (146,097 days, an exact number of weeks), which is why the Doomsday century anchors repeat every 400 years.</p>`
    }
  ],
  faq: [
    { q: 'What day of the week was July 4, 1776?', a: 'Thursday. The Continental Congress adopted the Declaration of Independence on Thursday, July 4, 1776.' },
    { q: 'What day of the week is Christmas 2026?', a: 'Friday, December 25, 2026. In 2027 Christmas falls on a Saturday.' },
    { q: 'What day of the week was January 1, 2000?', a: 'Saturday.' },
    { q: 'How do I find out what day I was born?', a: 'Enter your date of birth above. For example, someone born on May 15, 1990 was born on a Tuesday.' },
    { q: 'What is the doomsday for 2027?', a: 'Sunday. So April 4, June 6, August 8, October 10 and December 12, 2027 are all Sundays.' },
    { q: 'Does Zeller\'s congruence work for any year?', a: 'Yes, for any year in the calendar you choose. Use the Gregorian version for dates from October 15, 1582 (later in some countries) and the Julian version for earlier dates.' },
    { q: 'What day of the week will January 1, 2030 be?', a: 'Tuesday.' }
  ],
  related: ['birthday-calculator', 'age-calculator', 'days-between-dates-calculator', 'business-days-calculator'],
  sources: [
    { name: 'NIST: A Walk Through Time (the evolution of calendars and time measurement)', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time' },
    { name: 'National Archives: The Declaration of Independence', url: 'https://www.archives.gov/founding-docs/declaration' }
  ]
};
