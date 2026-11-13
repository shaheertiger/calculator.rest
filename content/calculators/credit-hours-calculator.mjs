export default {
  slug: 'credit-hours-calculator',
  hub: 'education',
  name: 'Credit Hours Calculator',
  title: 'Credit Hours Calculator: 150 Min a Week × 15 Weeks = 3 Credits',
  h1: 'Credit Hour Calculator: Class Time, Quarter Hours and Total Credits',
  meta: 'A class that meets 150 minutes a week for 15 weeks earns 3 semester credit hours (4.5 quarter hours). Convert class time, quarter hours or add up a schedule.',
  keyword: 'how to calculate credit hours',
  also: ['how to calculate semester hours', 'how to calculate credits', 'how to calculate course credit hours', 'how do you calculate semester hours', 'how to calculate total credit hours', 'quarter hours to semester hours'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you want to do?', type: 'select', value: 'contact', options: [['contact', 'Class time → credit hours'], ['q2s', 'Quarter hours → semester hours'], ['s2q', 'Semester hours → quarter hours'], ['total', 'Add up my credits']] },
    { id: 'minutes', label: 'Class time per week', type: 'number', value: 150, suffix: 'minutes', showIf: { mode: ['contact'] }, help: 'MWF at 50 minutes or Tue/Thu at 75 minutes are both 150.' },
    { id: 'weeks', label: 'Weeks in the term', type: 'number', value: 15, suffix: 'weeks', showIf: { mode: ['contact'] } },
    { id: 'kind', label: 'Type of class', type: 'select', value: '1', showIf: { mode: ['contact'] }, options: [['1', 'Lecture / seminar (1 class hour = 1 credit)'], ['2', 'Lab (2 class hours = 1 credit)'], ['3', 'Studio / clinical (3 class hours = 1 credit)']] },
    { id: 'amount', label: 'Hours to convert', type: 'number', value: 45, showIf: { mode: ['q2s', 's2q'] } },
    { id: 'list', label: 'Credits for each class this term', type: 'text', value: '3, 4, 3, 3, 1', showIf: { mode: ['total'] }, placeholder: 'e.g. 3, 4, 3, 3, 1' },
    { id: 'earned', label: 'Credits already earned', type: 'number', value: '', placeholder: 'optional, e.g. 30', showIf: { mode: ['total'] } },
    { id: 'goal', label: 'Credits needed for the degree', type: 'number', value: 120, showIf: { mode: ['total'] }, help: '120 is typical for a bachelor\'s degree, 60 for an associate degree.' }
  ],
  compute(v, H) {
    var isN = function (x) { return typeof x === 'number' && isFinite(x); };
    if (v.mode === 'q2s' || v.mode === 's2q') {
      if (!(isN(v.amount) && v.amount > 0)) return { error: 'Enter the number of hours to convert.' };
      if (v.mode === 'q2s') {
        var s = v.amount * 2 / 3;
        return { value: H.num(s, 2), label: 'Semester credit hours', expr: H.num(v.amount, 2) + ' quarter hrs × 2 ÷ 3', rows: [['Quarter hours entered', H.num(v.amount, 2)], ['Share of a 120-credit degree', H.pct(s / 120 * 100, 1), true]], sub: 'Transfer offices usually keep the decimals: a 4-quarter-hour class becomes 2.67 semester hours.' };
      }
      var q = v.amount * 1.5;
      return { value: H.num(q, 2), label: 'Quarter credit hours', expr: H.num(v.amount, 2) + ' semester hrs × 1.5', rows: [['Semester hours entered', H.num(v.amount, 2)], ['Share of a 180-quarter-hour degree', H.pct(q / 180 * 100, 1), true]], sub: 'A quarter is about 10–11 weeks versus a 15-week semester, so each quarter hour is worth two-thirds of a semester hour.' };
    }
    if (v.mode === 'total') {
      var list = H.list(v.list).filter(function (x) { return x > 0; });
      if (!list.length) return { error: 'Enter the credit hours for each class, separated by commas.' };
      var t = H.sum(list);
      var status = t >= 12 ? 'Full-time (12+)' : t >= 9 ? 'Three-quarter time (9–11)' : t >= 6 ? 'Half-time (6–8)' : 'Less than half-time (under 6)';
      var rows = [['Classes', String(list.length)], ['Enrollment status (undergraduate)', status, true]];
      if (isN(v.goal) && v.goal > 0) {
        var have = (isN(v.earned) && v.earned > 0 ? v.earned : 0) + t;
        var left = Math.max(0, v.goal - have);
        rows.push(['Credits after this term', H.num(have, 2) + ' of ' + H.num(v.goal, 0)]);
        rows.push(['Still needed', H.num(left, 2)]);
        rows.push(['Terms left at this load', left > 0 ? H.num(Math.ceil(left / t - 1e-9), 0) : 'done']);
      }
      return { value: H.num(t, 2), label: 'Credit hours this term', expr: list.map(function (x) { return H.num(x, 2); }).join(' + '), rows: rows, sub: t >= 15 ? 'At this pace you finish 120 credits in 8 semesters (four years).' : 'Finishing 120 credits in four years takes an average of 15 credits per semester.' };
    }
    if (!(isN(v.minutes) && v.minutes > 0)) return { error: 'Enter how many minutes the class meets each week.' };
    if (!(isN(v.weeks) && v.weeks > 0)) return { error: 'Enter the number of weeks in the term.' };
    var ratio = Number(v.kind) || 1;
    var mins = v.minutes * v.weeks;
    var cr = mins / (750 * ratio);
    var homework = ratio === 1 ? cr * 2 : 0;
    var r2 = [
      ['Total class time', H.num(mins, 0) + ' minutes (' + H.num(mins / 60, 2) + ' clock hours)'],
      ['50-minute class hours per week', H.num(v.minutes / 50, 2)],
      ['Quarter-hour equivalent', H.num(cr * 1.5, 2)]
    ];
    if (ratio === 1) r2.push(['Expected study time outside class', 'about ' + H.num(homework, 1) + ' hours a week', true]);
    return { value: H.num(cr, 2), label: 'Semester credit hours', expr: H.num(mins, 0) + ' min ÷ (750 × ' + ratio + ')', rows: r2, sub: Math.abs(cr - Math.round(cr)) > 0.05 ? 'Colleges round to the nearest whole or half credit, so check the course catalog for the official number.' : 'This matches the federal definition: one class hour plus two hours of outside work per credit, for about 15 weeks.' };
  },
  quick: ({ r }) => `A semester credit hour is one 50-minute class hour a week, plus about two hours of homework, for roughly 15 weeks. A class meeting 150 minutes a week for 15 weeks is 2,250 minutes ÷ 750 = <strong>${r.value} credit hours</strong>. To convert, multiply semester hours by 1.5 for quarter hours (3 = 4.5) or quarter hours by ⅔ for semester hours.`,
  stepsTitle: 'How to calculate credit hours for a class',
  steps: [
    'Add up the minutes the class meets each week. Monday/Wednesday/Friday at 50 minutes and Tuesday/Thursday at 75 minutes are both 150 minutes.',
    'Multiply by the number of weeks in the term (usually 15 or 16 for a semester, 10 or 11 for a quarter) to get total instructional minutes.',
    'Divide by 750 minutes (50 minutes × 15 weeks) for each lecture credit. Labs and studios usually need 2 or 3 class hours per credit, so divide by 1,500 or 2,250 instead.',
    'For a quarter-system school, multiply semester hours by 1.5. The common mistake is counting clock hours (60 minutes) instead of the 50-minute class hour colleges use.'
  ],
  formulaTitle: 'What is the credit hour formula?',
  formula: {
    expr: 'Credit hours = (minutes per week × weeks) ÷ (750 × contact ratio)<br>Quarter hours = semester hours × 1.5<br>Semester hours = quarter hours × ⅔',
    vars: [['750', '50-minute class hour × 15 weeks'], ['contact ratio', '1 for lecture, 2 for most labs, 3 for studio or clinical'], ['×1.5', 'three quarters fit in the time of two semesters']],
    note: 'Colleges set their own ratios within the federal definition, so the course catalog is the final word on any one class.'
  },
  example: `<p>A biology course has a lecture on Tuesday and Thursday for 75 minutes and a 170-minute lab on Wednesday, for a 15-week semester.</p>
<p>Lecture: 150 × 15 = 2,250 minutes ÷ 750 = <strong>3 credits</strong>. Lab: 170 × 15 = 2,550 minutes ÷ 1,500 = <strong>1.7</strong>, but the catalog lists it as <strong>1 credit</strong>, as many colleges do for a weekly lab of 2 to 3 hours.</p>
<p>The course is listed as 4 semester hours. Transferred to a quarter-system school it is 4 × 1.5 = <strong>6 quarter hours</strong>.</p>`,
  table: {
    title: 'How do semester hours convert to quarter hours?',
    intro: 'Both directions, worked out by the calculator above.',
    head: ['Semester hours', '= Quarter hours', 'Quarter hours', '= Semester hours'],
    rows: ({ run }) => [1, 2, 3, 4, 5, 12, 15, 30, 45, 60, 90, 120].map(x => [x, run({ mode: 's2q', amount: x }).value, x, run({ mode: 'q2s', amount: x }).value]),
    note: 'A 120-semester-hour bachelor\'s degree is 180 quarter hours; a 60-hour associate degree is 90 quarter hours.'
  },
  sections: [
    {
      h2: 'What counts as one credit hour?',
      html: `<p>The U.S. Department of Education defines a credit hour (34 CFR 600.2) as at least one hour of classroom or direct faculty instruction and a minimum of two hours of out-of-class work each week for about 15 weeks for one semester hour, or 10 to 12 weeks for one quarter hour. Schools may award the same credit for labs, internships, studio work or online courses that take an equivalent amount of work.</p>
<p>So a 3-credit course is designed as roughly 9 hours a week of total effort: 3 class hours plus 6 hours of reading, problem sets and studying.</p>`
    },
    {
      h2: 'How many credit hours is full-time?',
      html: `<p>For federal student aid, full-time undergraduate enrollment is generally at least 12 credit hours per semester or quarter; 9 hours is three-quarter time and 6 hours is half-time. Many aid programs, loan deferments and health insurance plans use those same lines.</p>
<p>Twelve hours keeps you full-time but doesn't graduate you on time: 120 credits over 8 semesters is 15 a term. Switch the calculator to "Add up my credits" to see how many terms you have left at your current load.</p>`
    },
    {
      h2: 'How do you convert quarter hours to semester hours?',
      html: `<p>Multiply quarter hours by two-thirds. A 4-unit quarter class is 4 × ⅔ = 2.67 semester hours, and a full year of 45 quarter hours is 30 semester hours. Going the other way, multiply semester hours by 1.5. Transfer credit evaluators usually keep the decimal, so three 4-unit quarter classes add up to 8 semester hours, not 9.</p>`
    },
    {
      h2: 'How are clock hours converted to credit hours for career programs?',
      html: `<p>For vocational and certificate programs that measure progress in clock hours, federal financial aid rules (34 CFR 668.8) require at least 37.5 clock hours of instruction per semester hour or 25 per quarter hour. Schools whose accreditor allows counting outside work can use a minimum of 30 and 20 clock hours instead. A 900-clock-hour program therefore converts to 24 semester hours at 37.5, or 30 at the 30-hour minimum.</p>`
    }
  ],
  faq: [
    { q: 'How many credit hours is a 3-hour class?', a: 'A class that meets three 50-minute hours a week for a 15-week semester is 3 credit hours. A once-a-week evening class of about 2 hours 45 minutes is often listed as 3 credits too, with the extra time covering a break.' },
    { q: 'How many hours a week should I study per credit hour?', a: 'About two hours outside class for every credit hour, per the federal definition. A 15-credit semester therefore means about 15 hours in class and 30 hours of study a week.' },
    { q: 'Is a credit hour the same as a semester hour?', a: 'At semester-system schools, yes: credit hours, semester hours and units usually mean the same thing. At quarter-system schools a quarter hour is two-thirds of a semester hour.' },
    { q: 'How many credit hours is a bachelor\'s degree?', a: 'Usually 120 semester hours (180 quarter hours). Associate degrees are typically 60 semester hours, and some engineering or architecture programs require more.' },
    { q: 'How do credit hours affect GPA?', a: 'Each grade is multiplied by its credit hours, so a 4-credit class moves your GPA more than a 1-credit class. Use the GPA calculator to see the weighted result.' },
    { q: 'Do pass/fail credits count toward credit hours?', a: 'They count toward the credits you need to graduate and toward full-time status, but not toward your GPA.' },
    { q: 'How many credit hours is a 4-unit quarter class?', a: 'A 4-unit quarter class is 2.67 semester credit hours (4 × ⅔).' }
  ],
  related: ['gpa-calculator', 'high-school-gpa-calculator', 'gpa-to-percentage-calculator', 'attendance-percentage-calculator'],
  sources: [
    { name: 'eCFR: 34 CFR 600.2, definition of credit hour', url: 'https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-600/subpart-A/section-600.2' },
    { name: 'eCFR: 34 CFR 668.8, clock-hour to credit-hour conversion', url: 'https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-668/subpart-A/section-668.8' },
    { name: 'Federal Student Aid Handbook (FSA Partner Connect)', url: 'https://fsapartners.ed.gov/knowledge-center/fsa-handbook' }
  ]
};
