export default {
  slug: 'birthday-calculator',
  hub: 'time',
  name: 'Birthday Countdown Calculator',
  title: 'Birthday Countdown: Days Until Your Birthday, Weekday in 2027',
  h1: 'How Many Days Until My Birthday? Countdown, Weekday and Half Birthday',
  meta: 'Count the days to your next birthday, its weekday and your half birthday. A March 8 birthday falls on a Monday in 2027, and its half birthday is Sep 8.',
  keyword: 'how many days until my birthday calculator',
  also: ['birthday countdown', 'days until my birthday', 'how to calculate half birthday', 'what\'s my half birthday calculator', 'what is my half birthday calculator', 'what day is my birthday this year', 'how many sleeps until my birthday'],
  updated: '2026-11-13',
  inputs: [
    { id: 'dob', label: 'Your birthday (with birth year)', type: 'date', value: '1995-03-08' },
    { id: 'today', label: 'Count from', type: 'date', value: 'today' }
  ],
  compute(v, H) {
    var b = H.parseDate(v.dob), t = H.parseDate(v.today);
    if (!b) return { error: 'Enter your date of birth.' };
    if (!t) return { error: 'Enter the date to count from.' };
    if (t < b) return { error: 'The count-from date is before the birth date.' };
    var bm = b.getUTCMonth(), bd = b.getUTCDate(), by = b.getUTCFullYear(), ty = t.getUTCFullYear();
    function on(y) { var d = new Date(Date.UTC(y, bm, bd)); if (d.getUTCMonth() !== bm) d = new Date(Date.UTC(y, 2, 1)); return d; }
    var next = on(ty); if (next < t) next = on(ty + 1);
    var last = on(ty); if (last > t) last = on(ty - 1);
    var until = H.daysBetween(t, next);
    var age = next.getUTCFullYear() - by;
    var half = H.addMonths(last, 6); if (half < t) half = H.addMonths(next, 6);
    var halfMD = H.addMonths(b, 6);
    var round = Math.ceil((age) / 10) * 10; if (round === 0) round = 10;
    var roundDate = on(by + round);
    var lived = H.daysBetween(b, t);
    var rows = [
      ['Next birthday', H.fmtDate(next, true), true],
      ['You turn', String(age)],
      ['Countdown', H.int(Math.floor(until / 7)) + ' weeks, ' + (until % 7) + ' days (' + H.int(until * 24) + ' hours)'],
      ['Next half birthday', H.fmtDate(half, true) + (H.daysBetween(t, half) ? ', in ' + H.plural(H.daysBetween(t, half), 'day') : ', today')],
      ['You were born on a', H.weekday(b)],
      ['Days you have been alive', H.int(lived)],
      ['Next milestone birthday', round + ' on ' + H.fmtDate(roundDate)]
    ];
    if (bm === 1 && bd === 29) rows.push(['Leap-day birthday', 'Shown on Mar 1 in common years; many people celebrate Feb 28']);
    return {
      value: until === 0 ? 'Today!' : H.int(until) + (until === 1 ? ' day' : ' days'),
      label: until === 0 ? 'Happy birthday! You turn ' + age + ' today' : 'Until your birthday on ' + H.fmtDate(next),
      expr: H.fmtDate(t) + ' → ' + H.fmtDate(next),
      rows: rows,
      sub: 'Your half birthday is on ' + (halfMD.getUTCMonth() === 1 && bd > 28 ? 'the last day of February' : halfMD.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric' })) + ' each year.'
    };
  },
  quick: ({ r, v, H }) => `Counting from ${H.fmtDate(v.today)}, a <strong>March 8</strong> birthday is <strong>${r.value}</strong> away: it falls on ${r.rows[0][1]}, when someone born in 1995 turns ${r.rows[1][1]}. To count by hand, add the days left in this month, the days in each full month between, and the birthday's date. A March 8 half birthday is September 8.`,
  stepsTitle: 'How to count the days until your birthday',
  steps: [
    'Count the days left in the current month after today. On Nov 13, November has 30 − 13 = 17 left.',
    'Add the length of each full month before your birthday month: December 31, January 31, February 28 (29 in a leap year).',
    'Add your birthday\'s day of the month. For March 8: 17 + 31 + 31 + 28 + 8 = 115 days.',
    'If your birthday has already passed this year, count to next year\'s date. Forgetting February 29 in leap years is the usual off-by-one.'
  ],
  formulaTitle: 'How does the birthday countdown work?',
  formula: {
    expr: 'Days until birthday = Next birthday date − Today<br>Half birthday = Birthday + 6 calendar months',
    vars: [['Next birthday', 'this year\'s birthday, or next year\'s if it has passed'], ['6 calendar months', 'same day of the month, six months later (end of month if that day doesn\'t exist)']]
  },
  example: `<p>Born March 8, 1995, counting from November 13, 2026:</p>
<p>Days left in November: 17. December: 31. January: 31. February 2027: 28. March: 8. Total: <strong>115 days</strong>, or 16 weeks and 3 days.</p>
<p>March 8, 2027 is a <strong>Monday</strong>, and that birthday is the 32nd. The half birthday is <strong>September 8</strong>. The person was born on a Wednesday and turns 40 on March 8, 2035.</p>`,
  table: {
    title: 'What day of the week is a March 8 birthday each year?',
    intro: 'The weekday of the example birthday for the next 10 years, from the calculator. Your own birthday follows the same pattern: one weekday later each year, two after a February 29.',
    head: ['Year', 'Birthday falls on', 'Age turned (born 1995)'],
    rows: ({ run }) => [2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036].map(y => { const r = run({ today: y + '-01-01' }); return [String(y), r.rows[0][1].split(',')[0], r.rows[1][1]]; })
  },
  sections: [
    {
      h2: 'How do you calculate your half birthday?',
      html: `<p>Add six months to your birthday and keep the same day of the month: March 8 becomes <strong>September 8</strong>, November 20 becomes May 20. If that day doesn't exist, use the last day of the month, so an August 30 or 31 birthday has a half birthday on February 28 (February 29 in leap years).</p>
<p>Some people define it as exactly half a year, 182 or 183 days later. That usually lands within a day or two of the calendar method: 182 days after March 8 is September 6 in a common year. The calculator uses the calendar method, which is what most families celebrate.</p>`
    },
    {
      h2: 'What day of the week will my birthday be next year?',
      html: `<p>One weekday later than this year, because 365 days is 52 weeks plus 1 day. If a February 29 falls between this birthday and the next, it moves two weekdays. A March 8 birthday was a Sunday in 2026, is a Monday in 2027 and jumps to Wednesday in 2028, a leap year.</p>
<p>The full pattern of weekdays repeats every 28 years in the 1901–2099 range, so you will have your birthday on the same weekday as the day you were born at ages 28 and 56 (and at some ages in between, such as 6, 11 or 17, depending on leap years).</p>`
    },
    {
      h2: 'What if my birthday is February 29?',
      html: `<p>In common years the calculator counts down to March 1, the day you complete another year of age. Plenty of leap-day babies celebrate on February 28 instead; both are fine for a party. The next true February 29 birthdays are in 2028, 2032 and 2036. There are only 24 or 25 of them in a century, since century years like 2100 skip the leap day unless they are divisible by 400.</p>`
    }
  ],
  faq: [
    { q: 'How many days until my birthday?', a: 'Enter your date of birth and the calculator counts from today. By hand: the days left in this month, plus each full month in between, plus the day of the month of your birthday.' },
    { q: 'How many weeks until my birthday?', a: 'Divide the days by 7. 115 days is 16 weeks and 3 days.' },
    { q: 'How many sleeps until my birthday?', a: 'The same as the number of days until it: one sleep per night, counting tonight. If your birthday is tomorrow, it is 1 sleep away.' },
    { q: 'When is my half birthday?', a: 'Six calendar months after your birthday, on the same day of the month. A January 15 birthday has a July 15 half birthday.' },
    { q: 'What day of the week was I born?', a: 'Enter your full date of birth and it is shown in the results. Someone born March 8, 1995 was born on a Wednesday.' },
    { q: 'How old will I be on my next birthday?', a: 'Your birth year subtracted from the year of your next birthday. Someone born in 1995 turns 32 on their 2027 birthday.' }
  ],
  related: ['age-calculator', 'day-of-week-calculator', 'anniversary-calculator', 'days-between-dates-calculator'],
  sources: [
    { name: 'NIST: A Walk Through Time (the evolution of calendars and time measurement)', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time' }
  ]
};
