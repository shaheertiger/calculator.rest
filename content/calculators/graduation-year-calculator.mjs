export default {
  slug: 'graduation-year-calculator',
  hub: 'education',
  name: 'Graduation Year Calculator',
  title: 'Graduation Year Calculator: Born March 2021 = Class of 2039',
  h1: 'What Year Will My Child Graduate High School?',
  meta: 'Born Mar 15, 2021? With a Sep 1 cutoff your child starts kindergarten in fall 2026 and graduates with the Class of 2039. Try any birth date and state cutoff.',
  keyword: 'what year will my child graduate high school calculator',
  also: ['how to calculate graduation year', 'what year will you graduate high school calculator', 'class of calculator', 'what year will my child start kindergarten', 'high school graduation year calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'birth', label: 'Child\'s date of birth', type: 'date', value: '2021-03-15' },
    { id: 'cutoff', label: 'Must turn 5 on or before', type: 'select', value: '09-01', options: [['09-01', 'Sep 1 (most states)'], ['07-31', 'Jul 31'], ['08-01', 'Aug 1'], ['08-15', 'Aug 15'], ['08-31', 'Aug 31'], ['09-15', 'Sep 15'], ['09-30', 'Sep 30'], ['10-01', 'Oct 1'], ['10-15', 'Oct 15'], ['12-01', 'Dec 1'], ['12-31', 'Dec 31 (calendar year)']], help: 'Your state or district\'s kindergarten age cutoff.' },
    { id: 'adj', label: 'School path', type: 'select', value: '0', options: [['0', 'Starts kindergarten when first eligible'], ['1', 'Starts a year later or repeats a grade'], ['-1', 'Starts a year early or skips a grade']] }
  ],
  compute(v, H) {
    var b = H.parseDate(v.birth);
    if (!b) return { error: 'Enter a valid date of birth.' };
    var y = b.getUTCFullYear();
    if (y < 1900 || y > 2100) return { error: 'Enter a birth year between 1900 and 2100.' };
    var parts = String(v.cutoff || '09-01').split('-'), cm = Number(parts[0]) - 1, cd = Number(parts[1]);
    var fifth = new Date(Date.UTC(y + 5, b.getUTCMonth(), b.getUTCDate()));
    var cut = new Date(Date.UTC(y + 5, cm, cd));
    var k = (fifth.getTime() <= cut.getTime() ? y + 5 : y + 6) + (Number(v.adj) || 0);
    var grad = k + 13;
    var ageAt = function (d) { var a = H.ymdDiff(b, d); return a.y + ' years ' + a.m + (a.m === 1 ? ' month' : ' months'); };
    var gap = H.daysBetween(new Date(Date.UTC(y, cm, cd)), new Date(Date.UTC(y, b.getUTCMonth(), b.getUTCDate())));
    var sub = 'Graduation is in late spring of ' + grad + ', the end of the ' + (grad - 1) + '–' + String(grad).slice(2) + ' school year.';
    if (Math.abs(gap) <= 31 && v.adj === '0') sub = gap <= 0 ? 'The birthday is ' + H.plural(-gap, 'day') + ' before the cutoff, so your child would be one of the youngest in the class. Many families in this window weigh waiting a year.' : 'The birthday is ' + H.plural(gap, 'day') + ' after the cutoff, so your child would be one of the oldest in the class. Some districts allow early entry with testing.';
    return {
      value: 'Class of ' + grad,
      label: 'High school graduation year',
      expr: 'kindergarten fall ' + k + ' + 13 years',
      rows: [
        ['Starts kindergarten', 'Aug/Sep ' + k + ' (' + k + '–' + String(k + 1).slice(2) + ' school year)', true],
        ['Age on Sep 1 of kindergarten year', ageAt(new Date(Date.UTC(k, 8, 1)))],
        ['Starts 1st grade', 'fall ' + (k + 1)],
        ['Starts middle school (6th grade)', 'fall ' + (k + 6)],
        ['Starts high school (9th grade)', 'fall ' + (k + 9)],
        ['Age at graduation (June ' + grad + ')', ageAt(new Date(Date.UTC(grad, 5, 1)))],
        ['College class of (4-year degree)', String(grad + 4)]
      ],
      sub: sub
    };
  },
  quick: ({ r }) => `A child born March 15, 2021 turns 5 before a September 1 cutoff in 2026, starts kindergarten in fall 2026 and graduates high school 13 school years later as the <strong>${r.value}</strong>. In general: graduation year = kindergarten start year + 13. A birthday after the cutoff pushes everything back one year.`,
  stepsTitle: 'How to calculate a child\'s graduation year',
  steps: [
    'Find your state or district\'s kindergarten cutoff: the date by which a child must turn 5. September 1 is the most common.',
    'Find the year your child turns 5. If that fifth birthday falls on or before the cutoff, kindergarten starts that fall; if it falls after, kindergarten starts the following fall.',
    'Add 13 to the kindergarten start year: kindergarten plus grades 1 through 12 is 13 school years, and graduation happens in the spring of the last one.',
    'Adjust for the path your child actually takes. The usual slip is forgetting that a fall birthday near the cutoff (or a delayed start) moves the class year by one.'
  ],
  formulaTitle: 'What is the formula for high school graduation year?',
  formula: {
    expr: 'Kindergarten year = birth year + 5 (if the 5th birthday is on or before the cutoff), otherwise birth year + 6<br>Graduation year = kindergarten year + 13',
    vars: [['cutoff', 'the date a child must turn 5 by, set by state law or the district'], ['13', 'kindergarten plus 12 grades'], ['graduation year', 'the spring the child finishes 12th grade; also the "Class of" year']],
    note: 'Already know the grade? Graduation year = the spring year of the current school year + (12 − current grade). A 4th grader in 2026–27 graduates in 2027 + 8 = 2035.'
  },
  example: `<p>Twins are born on August 28, 2022 in a state with a September 1 cutoff. They turn 5 on August 28, 2027, four days before the cutoff, so they can start kindergarten in fall 2027 and graduate with the <strong>Class of 2040</strong>.</p>
<p>Had they been born on September 3, 2022, they would turn 5 two days after the cutoff, start kindergarten in fall 2028 and graduate in <strong>2041</strong>, a full year later despite being only six days younger.</p>
<p>In New York City, where children start kindergarten in the calendar year they turn 5, both birth dates would land in the Class of 2040.</p>`,
  table: {
    title: 'What year will my child graduate? (September 1 cutoff)',
    intro: 'Graduation year by birth-date range for the most common cutoff, when the child starts kindergarten as soon as eligible.',
    head: ['Born between', 'Kindergarten starts', 'Graduates high school'],
    rows: ({ run }) => [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map(y => [`Sep 2, ${y - 1} – Sep 1, ${y}`, 'Fall ' + (y + 5), run({ birth: y + '-06-01', cutoff: '09-01', adj: '0' }).value]),
    note: 'For other cutoffs, the range shifts: with an August 1 cutoff, a child born August 15 joins the next year\'s class; with a December 31 cutoff, every child born in a calendar year shares one class.'
  },
  sections: [
    {
      h2: 'What are the kindergarten cutoff dates by state?',
      html: `<p>Most states require children to turn 5 on or before September 1, or within a few weeks of it. Some notable exceptions: Indiana and Missouri use August 1, Virginia uses September 30, and Colorado districts generally use October 1. New York City uses December 31, so all children born in the same calendar year start kindergarten together. A few states, including Pennsylvania and New Jersey, let each district set its own date.</p>
<p>Cutoffs change: Connecticut, for example, moved from January 1 to September 1 starting with the 2024–25 school year. Confirm the current rule with your district's enrollment office, especially if you are moving.</p>`
    },
    {
      h2: 'What if my child\'s birthday is close to the cutoff?',
      html: `<p>Children born in the few months before the cutoff are the youngest in their grade, and some parents choose to wait a year (often called "redshirting"). Children born just after the cutoff are the oldest. Neither choice changes the arithmetic: each year of delay adds one year to the graduation date. Use the "School path" option above to compare both.</p>
<p>Some states and districts allow early entry for children who turn 5 shortly after the cutoff, usually with a readiness assessment. Private schools often set their own cutoffs, which can be earlier than the public school date.</p>`
    },
    {
      h2: 'When will my child graduate from college?',
      html: `<p>Add four years to the high school graduation year for a bachelor's degree on the standard schedule: the Class of 2039 in high school is the college Class of 2043. Two years for an associate degree gives 2041. Many students take longer; at four-year colleges, completion rates are commonly reported at six years (150% of normal time), so 2045 is a realistic later bound.</p>`
    },
    {
      h2: 'What grade is my child in now?',
      html: `<p>Count up from kindergarten: a child who started kindergarten in fall 2026 is a kindergartner in the 2026–27 school year, a 1st grader in 2027–28, and so on. To look up the grade for any specific year or date, including your own school years, use the <a href="/what-grade-calculator">what grade was I in calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What year will a child born in 2020 graduate high school?', a: 'With a September 1 cutoff, a child born between January 1 and September 1, 2020 graduates with the Class of 2038. One born September 2 through December 31, 2020 graduates with the Class of 2039.' },
    { q: 'What year will a child born in 2021 graduate?', a: 'Born on or before September 1, 2021: Class of 2039. Born after September 1, 2021: Class of 2040, assuming a September 1 cutoff and an on-time start.' },
    { q: 'Is the "Class of" year the year my child graduates?', a: 'Yes. The Class of 2039 graduates in the spring (usually May or June) of 2039, at the end of the 2038–39 school year.' },
    { q: 'How old will my child be when they graduate high school?', a: 'Usually 17 or 18. Children with birthdays between the cutoff and graduation day turn 18 before graduating; those born in the summer months just before a September 1 cutoff are often still 17.' },
    { q: 'Does transitional kindergarten change the graduation year?', a: 'No. Transitional kindergarten (TK) and pre-K come before kindergarten, so the graduation year is still the kindergarten year plus 13.' },
    { q: 'Does skipping or repeating a grade change the class year?', a: 'Yes. Each skipped grade moves graduation one year earlier and each repeated grade one year later. Set the School path option to see the new year.' },
    { q: 'How do I figure out the graduation year from the current grade?', a: 'Take the spring year of the current school year and add 12 minus the grade. A 9th grader in the 2026–27 school year graduates in 2027 + 3 = 2030.' }
  ],
  related: ['what-grade-calculator', 'age-calculator', 'high-school-gpa-calculator', 'days-between-dates-calculator'],
  sources: [
    { name: 'NCES: State Education Reforms, kindergarten entrance age by state', url: 'https://nces.ed.gov/programs/statereform/' },
    { name: 'Education Commission of the States: K-3 policies', url: 'https://www.ecs.org/' },
    { name: 'NYC Public Schools: Kindergarten admissions', url: 'https://www.schools.nyc.gov/enrollment/enroll-grade-by-grade/kindergarten' }
  ]
};
