export default {
  slug: 'age-calculator',
  hub: 'time',
  name: 'Age Calculator',
  title: 'Age Calculator: Exact Age in Years, Months and Days (2026)',
  h1: 'How Old Are You? Age Calculator by Date of Birth',
  meta: 'Find your exact age in years, months and days, or your age on any past or future date. Born May 15, 1990? You turn 40 on Wednesday, May 15, 2030.',
  keyword: 'how old are you calculator',
  also: ['age calculator', 'how old am i', 'calculate age from date of birth', 'age on a specific date', 'exact age calculator', 'chronological age calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'dob', label: 'Date of birth', type: 'date', value: '1990-05-15' },
    { id: 'asOf', label: 'Age on this date', type: 'date', value: 'today', help: 'Leave as today, or pick any past or future date.' }
  ],
  data: {
    gens: [[1928, 1945, 'Silent Generation'], [1946, 1964, 'Baby Boomer'], [1965, 1980, 'Generation X'], [1981, 1996, 'Millennial'], [1997, 2012, 'Generation Z']]
  },
  compute(v, H, D) {
    var b = H.parseDate(v.dob), t = H.parseDate(v.asOf);
    if (!b) return { error: 'Enter a date of birth.' };
    if (!t) return { error: 'Enter the date to calculate age on.' };
    if (t < b) return { error: 'The "age on" date is before the date of birth.' };
    var a = H.ymdDiff(b, t);
    var days = H.daysBetween(b, t);
    var months = a.y * 12 + a.m;
    var by = b.getUTCFullYear(), bm = b.getUTCMonth(), bd = b.getUTCDate();
    function bdayIn(y) { var d = new Date(Date.UTC(y, bm, bd)); if (d.getUTCMonth() !== bm) d = new Date(Date.UTC(y, 2, 1)); return d; }
    var ty = t.getUTCFullYear();
    var next = bdayIn(ty);
    if (next < t) next = bdayIn(ty + 1);
    var until = H.daysBetween(t, next);
    var turning = next.getUTCFullYear() - by;
    var gen = '';
    (D.gens || []).forEach(function (g) { if (by >= g[0] && by <= g[1]) gen = g[2]; });
    var rows = [
      ['Exact age', a.y + ' years, ' + a.m + ' months, ' + a.d + ' days', true],
      ['In months', H.int(months) + ' months, ' + a.d + ' days'],
      ['In weeks', H.int(Math.floor(days / 7)) + ' weeks, ' + (days % 7) + ' days'],
      ['In days', H.int(days) + ' days'],
      ['In hours (approx.)', H.int(days * 24)],
      ['Next birthday', until === 0 ? 'Today! Turning ' + turning : H.fmtDate(next, true) + ' (turning ' + turning + ', in ' + H.plural(until, 'day') + ')'],
      ['Born on a', H.weekday(b)]
    ];
    if (gen) rows.push(['Generation (Pew Research)', gen]);
    return {
      value: a.y + (a.y === 1 ? ' year' : ' years'),
      label: 'Age on ' + H.fmtDate(t),
      expr: H.fmtDate(b) + ' → ' + H.fmtDate(t),
      rows: rows,
      sub: 'That is ' + H.num(days / 365.2425, 2) + ' years as a decimal (days ÷ 365.2425).'
    };
  },
  quick: ({ r, v, H }) => `Someone born on <strong>May 15, 1990</strong> is <strong>${r.value} old</strong> as of ${H.fmtDate(v.asOf)}: exactly ${r.rows[0][1]}, or ${r.rows[3][1]}. To work out an age, subtract the birth year from the current year, then take off one if the birthday hasn't happened yet this year.`,
  stepsTitle: 'How to calculate age from a date of birth',
  steps: [
    'Subtract the birth year from the current year. 2026 − 1990 = 36.',
    'If the birthday hasn\'t arrived yet this year, subtract 1. Forgetting this check is the classic off-by-one error.',
    'For months, count whole months since the last birthday. For days, count from the same day-of-month in the previous month; if today\'s day-of-month is smaller than the birth day, borrow the length of last month.',
    'Enter the birth date above to skip the arithmetic, or change the "age on" date to find an age at a past or future moment, such as retirement or school entry.'
  ],
  formulaTitle: 'How does the age formula work?',
  formula: {
    expr: 'Age (years) = current year − birth year − (1 if birthday not reached yet)<br>Total days = date − date of birth',
    vars: [['Years', 'whole birthdays passed'], ['Months', 'whole months since the last birthday'], ['Days', 'days since the last monthly anniversary of the birth day']],
    note: 'Leap days are counted exactly. Someone born on February 29 is treated as having a birthday on March 1 in common years, which is when they have completed another full year.'
  },
  example: `<p>Born May 15, 1990. On November 13, 2026:</p>
<p><strong>Years:</strong> 2026 − 1990 = 36, and May 15 has passed, so 36.</p>
<p><strong>Months:</strong> from May 15 to October 15 is 5 whole months.</p>
<p><strong>Days:</strong> October 15 to November 13 is 29 days (October has 31 days, so 31 − 15 + 13).</p>
<p>Exact age: <strong>36 years, 5 months, 29 days</strong>, which is 13,331 days. The next birthday, May 15, 2027, is a Saturday.</p>`,
  table: {
    title: 'How old is each generation in 2026?',
    intro: 'Pew Research Center birth-year ranges, with the age each group reaches on its birthday in 2026 (computed by the calculator as of Dec 31, 2026).',
    head: ['Generation', 'Born', 'Age in 2026'],
    rows: ({ run, D }) => D.gens.slice().reverse().map(g => [g[2], g[0] + '–' + g[1], run({ dob: g[1] + '-01-01', asOf: '2026-12-31' }).value.replace(' years', '') + '–' + run({ dob: g[0] + '-01-01', asOf: '2026-12-31' }).value.replace(' years', '')]),
    note: 'Pew\'s 2019 analysis set 1997 as the first Gen Z birth year; its later reports use 2012 as the last. Pew has not defined the generation after Gen Z (often called Generation Alpha).'
  },
  sections: [
    {
      h2: 'How old am I if I was born in a certain year?',
      html: `<p>Subtract your birth year from the current year to get the age you turn this year. In 2026, someone born in 2000 turns 26, someone born in 1990 turns 36 and someone born in 1980 turns 46. Before your birthday you are one year younger. A person born in December 2000 is still 25 on November 13, 2026.</p>
<p>For a future date, change the "age on" field: a child born August 20, 2021 will be 5 on September 1, 2026, which is the kind of check school districts make for kindergarten cut-off dates.</p>`
    },
    {
      h2: 'How is age calculated if you were born on February 29?',
      html: `<p>A leap-day baby completes another year of age at the end of February 28 in a common year, so legally and in this calculator the birthday counts on <strong>March 1</strong> in non-leap years. On February 28, 2027, someone born February 29, 2000 is still 26; on March 1, 2027, they are 27.</p>
<p>Laws differ by country and situation, and many people simply celebrate on February 28. Real February 29 birthdays happen once every four years, with exceptions in century years not divisible by 400 (2100 is not a leap year).</p>`
    },
    {
      h2: 'How do you calculate age in Excel or Google Sheets?',
      html: `<p>Use <code>=DATEDIF(A2, TODAY(), "Y")</code> for whole years, where A2 holds the date of birth. Add <code>DATEDIF(A2, TODAY(), "YM")</code> for the leftover months and <code>DATEDIF(A2, TODAY(), "MD")</code> for days. A common shortcut, <code>=(TODAY()-A2)/365</code>, drifts by about a day every four years because of leap years, so it can be wrong right around a birthday.</p>`
    },
    {
      h2: 'Does everyone count age the same way?',
      html: `<p>Not historically. Traditional East Asian age reckoning counts a newborn as 1 and adds a year every Lunar New Year. South Korea, the last country to use that "Korean age" widely in official settings, switched to international age for legal and administrative purposes in June 2023. This calculator uses the international method: you are 0 until your first birthday.</p>
<p>Doctors also use <em>corrected age</em> for babies born prematurely: chronological age minus the weeks born early, usually until age 2 or 3.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my exact age?', a: 'Subtract your birth date from today\'s date in years, months and days, borrowing a month\'s days when needed. The calculator does it automatically and also shows your age in months, weeks and days.' },
    { q: 'How many days old am I?', a: 'Count the days from your birth date to today. Someone born May 15, 1990 was 13,331 days old on November 13, 2026. Enter your date of birth above to get yours.' },
    { q: 'How old is someone born in 2000?', a: 'They turn 26 in 2026: 26 after their birthday and 25 before it.' },
    { q: 'How do you calculate age in months for a baby?', a: 'Count whole months from the birth date. A baby born March 10 is 8 months old on November 10 and stays 8 months until December 10. Pediatricians usually use months until age 2.' },
    { q: 'How do I find my age on a specific date?', a: 'Enter your date of birth and change the "age on" date. It works for past and future dates, for example to check eligibility ages for retirement, licenses or school.' },
    { q: 'Why is my age off by one in some calculators?', a: 'Usually because they divide days by 365 and ignore leap years, or they count the birth year as age 1. This calculator counts completed birthdays exactly.' },
    { q: 'What day of the week was I born?', a: 'The calculator shows it in the results. For any other date, use the day of the week calculator.' }
  ],
  related: ['birthday-calculator', 'days-between-dates-calculator', 'day-of-week-calculator', 'anniversary-calculator', 'retirement-age-calculator'],
  sources: [
    { name: 'Pew Research Center: Where Millennials end and Generation Z begins', url: 'https://www.pewresearch.org/short-reads/2019/01/17/where-millennials-end-and-generation-z-begins/' },
    { name: 'NIST Time and Frequency Division', url: 'https://www.nist.gov/pml/time-and-frequency-division' }
  ]
};
