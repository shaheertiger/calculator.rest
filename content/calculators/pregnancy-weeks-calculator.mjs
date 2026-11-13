export default {
  slug: 'pregnancy-weeks-calculator',
  hub: 'health',
  name: 'How Far Along Am I Calculator',
  title: 'How Far Along Am I? LMP 70 Days Ago = 10 Weeks Pregnant',
  h1: 'How Far Along Am I? Pregnancy Weeks, Days and Trimester Today',
  meta: 'If your last period started 70 days ago, you are 10 weeks 0 days pregnant: first trimester, 210 days to go. Count from your LMP, due date or conception date.',
  keyword: 'how do you calculate pregnancy weeks',
  also: ['how far along am i', 'how far along am i in pregnancy calculator', 'how many week pregnant calculator', 'how can we calculate pregnancy weeks', 'how is weeks of pregnancy calculated', 'how do you calculate pregnancy', 'pregnancy week calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'm', label: 'I know my', type: 'select', value: 'lmp', options: [['lmp', 'First day of last period'], ['due', 'Due date'], ['con', 'Conception date']] },
    { id: 'lmp', label: 'First day of last period', type: 'date', value: 'today-70', showIf: { m: ['lmp'] } },
    { id: 'cycle', label: 'Usual cycle length', type: 'number', value: 28, suffix: 'days', showIf: { m: ['lmp'] } },
    { id: 'due', label: 'Due date', type: 'date', value: 'today+210', showIf: { m: ['due'] } },
    { id: 'con', label: 'Conception date', type: 'date', value: 'today-56', showIf: { m: ['con'] } },
    { id: 'asof', label: 'How far along on', type: 'date', value: 'today', help: 'Today by default; change it to check any date.' }
  ],
  compute(v, H) {
    var P = H.parseDate, A = H.addDays, l0;
    if (v.m === 'due') { var d = P(v.due); if (!d) return { error: 'Enter your due date.' }; l0 = A(d, -280); }
    else if (v.m === 'con') { var c = P(v.con); if (!c) return { error: 'Enter the conception date.' }; l0 = A(c, -14); }
    else {
      var l = P(v.lmp); if (!l) return { error: 'Enter the first day of your last period.' };
      if (!(v.cycle >= 20 && v.cycle <= 45)) return { error: 'Enter a cycle length between 20 and 45 days.' };
      l0 = A(l, Math.round(v.cycle) - 28);
    }
    var t = P(v.asof) || P(H.today());
    var g = H.daysBetween(l0, t);
    if (g < 0) return { error: 'That date is before the start of the pregnancy count. Check the dates.' };
    if (g > 300) return { error: 'That is more than 42 weeks from the start date. Check the dates or year.' };
    var w = Math.floor(g / 7), dd = g % 7;
    var edd = A(l0, 280);
    var tri = g < 98 ? 'First trimester' : g < 196 ? 'Second trimester' : 'Third trimester';
    var left = 280 - g;
    var fa = g - 14;
    var rows = [
      ['Trimester', tri, true],
      ['Pregnancy week', H.ord(w + 1) + ' week'],
      ['Due date', H.fmtDate(edd)],
      [left >= 0 ? 'Days to due date' : 'Days past due date', H.int(Math.abs(left)) + ' (' + Math.floor(Math.abs(left) / 7) + 'w ' + (Math.abs(left) % 7) + 'd)'],
      ['Progress through 40 weeks', H.pct(g / 280 * 100, 0)],
      ['Embryo/fetal age from conception', fa >= 0 ? Math.floor(fa / 7) + ' weeks, ' + (fa % 7) + ' days' : 'before conception'],
      ['Months (days ÷ 30.4)', H.fix(g / 30.44, 1)]
    ];
    var term = g >= 294 ? ' Postterm (42 weeks or more).' : g >= 287 ? ' Late term (41 weeks).' : g >= 273 ? ' Full term (39–40 weeks).' : g >= 259 ? ' Early term (37–38 weeks).' : '';
    return {
      value: w + (w === 1 ? ' week, ' : ' weeks, ') + dd + (dd === 1 ? ' day' : ' days'),
      label: 'Pregnant on ' + H.fmtDate(t) + ' (' + w + '+' + dd + ')',
      expr: H.fmtDate(t) + ' − ' + H.fmtDate(l0) + ' = ' + g + ' days',
      rows: rows,
      sub: tri + '.' + term + ' Weeks are counted from the first day of the last period, about 2 weeks before conception.',
      l0: l0, g: g
    };
  },
  quick: ({ r }) => `To calculate how many weeks pregnant you are, count the days from the first day of your last period to today and divide by 7. If your last period began 70 days ago, you are 70 ÷ 7 = <strong>${r.value}</strong> pregnant (written 10+0), in the first trimester, with 210 days until your due date. From conception, add 2 weeks; from a due date, subtract the days left from 280.`,
  stepsTitle: 'How to calculate how many weeks pregnant you are',
  steps: [
    'Find the first day of your last menstrual period (LMP). Pregnancy is counted from this day, even though conception happens about 2 weeks later.',
    'Count the days from that date to today. 70 days in the example.',
    'Divide by 7. The whole number is completed weeks and the remainder is days: 70 ÷ 7 = 10 weeks, 0 days. A remainder of 3 would be 10 weeks 3 days, written 10+3 or 10 3/7.',
    'Remember that "10 weeks" means you are in your 11th week. Mixing up completed weeks with the current week number is the most common confusion.',
    'If you know your due date instead, subtract the days remaining from 280. If you know the conception date, add 14 days to the days since conception.'
  ],
  formulaTitle: 'How is gestational age calculated?',
  formula: {
    expr: 'Gestational age (days) = date − LMP<br>Weeks = floor(days ÷ 7); days = remainder<br>From a due date: days = 280 − days remaining<br>From conception: days = days since conception + 14',
    vars: [['LMP', 'first day of the last menstrual period, adjusted by (cycle length − 28) days'], ['280', 'days from LMP to the due date (40 weeks)']],
    note: 'Trimesters follow ACOG: first from the LMP through 13 weeks 6 days, second from 14 weeks 0 days through 27 weeks 6 days, third from 28 weeks 0 days to birth.'
  },
  example: `<p>Priya's due date is Jun 18, 2027 and she wants to know how far along she is on Jan 1, 2027.</p><p>Days from Jan 1 to Jun 18, 2027: 168. Gestational age = 280 − 168 = 112 days. 112 ÷ 7 = <strong>16 weeks, 0 days</strong>.</p><p>That is the second trimester (14w 0d to 27w 6d), her 17th week, and 40% of the way to 40 weeks. The embryo's age from conception is 14 weeks.</p>`,
  table: {
    title: 'What happens in each week of pregnancy, and when?',
    intro: 'Key ACOG and CDC milestones, with calendar dates for a pregnancy whose last period began 70 days before today (computed with the calculator above).',
    head: ['Gestational age', 'Milestone', 'Date for this example'],
    rows: ({ run, H }) => {
      const r = run({});
      const at = d => H.fmtDate(H.addDays(r.l0, d));
      return [
        ['4w 0d', 'Period due (28-day cycle); most home tests can detect pregnancy by now', at(28)],
        ['10w 0d', 'Cell-free DNA screening can start', at(70)],
        ['10w – 13w', 'First-trimester screening (blood test + nuchal translucency)', at(70) + ' – ' + at(91)],
        ['14w 0d', 'Second trimester begins', at(98)],
        ['18w – 22w', 'Standard (anatomy) ultrasound', at(126) + ' – ' + at(154)],
        ['24w – 28w', 'Gestational diabetes screening', at(168) + ' – ' + at(196)],
        ['27w – 36w', 'Tdap (whooping cough) vaccine, CDC', at(189) + ' – ' + at(252)],
        ['28w 0d', 'Third trimester begins', at(196)],
        ['36w – 38w', 'Group B strep test', at(252) + ' – ' + at(266)],
        ['37w 0d', 'Early term begins', at(259)],
        ['39w 0d', 'Full term begins', at(273)],
        ['40w 0d', 'Estimated due date', at(280)],
        ['41w 0d', 'Late term begins', at(287)],
        ['42w 0d', 'Postterm', at(294)]
      ];
    },
    note: 'Your care team sets the exact schedule; some tests come earlier if you have risk factors.'
  },
  sections: [
    {
      h2: 'Why are pregnancy weeks counted from your last period?',
      html: `<p>Because the first day of a period is a date most people know, while the day of conception usually is not. ACOG explains that pregnancy is assumed to start 2 weeks after the first day of the last period, so an extra 2 weeks is counted at the beginning when you are not actually pregnant yet. That is why you are already "4 weeks pregnant" around the day your period is due, only about 2 weeks after conceiving.</p><p>This count is called gestational age, and it is what doctors, ultrasound reports and prenatal test schedules use. The embryo's actual age from fertilization, sometimes called fetal or conceptional age, is 2 weeks less. If your cycles are longer or shorter than 28 days, the calculator shifts the start date by the difference.</p>`
    },
    {
      h2: 'What trimester am I in?',
      html: `<div class="twrap"><table><thead><tr><th>Trimester</th><th>Weeks (ACOG)</th><th>Days from LMP</th></tr></thead><tbody>
<tr><td>First</td><td>LMP to 13w 6d</td><td>0–97</td></tr>
<tr><td>Second</td><td>14w 0d to 27w 6d</td><td>98–195</td></tr>
<tr><td>Third</td><td>28w 0d to birth</td><td>196 on</td></tr>
</tbody></table></div><p>At 10 weeks 0 days you are in the first trimester, with 4 weeks until the second begins. Some books and apps draw the lines a week earlier or later; your provider will use ACOG's definitions.</p>`
    },
    {
      h2: 'How many months pregnant am I?',
      html: `<p>There is no official conversion, because months have 28 to 31 days and pregnancy is tracked in weeks. Dividing days by the average month length (30.4) gives a fair answer: 10 weeks is 2.3 months, 20 weeks is 4.6 months, and 40 weeks is 9.2 months. That is why a "9-month" pregnancy is really a little over 9 calendar months from the last period.</p><p>If someone asks, "a little over 2 months" or "in my third month" both describe 10 weeks. For dates rather than durations, the <a href="/due-date-calculator">due date calculator</a> lists trimester start dates.</p>`
    },
    {
      h2: 'Why does my ultrasound say a different number of weeks?',
      html: `<p>An early ultrasound measures the embryo and estimates gestational age from its size. If that differs enough from your period-based count, your provider may move the due date, and with it how far along you are; small differences are normal and usually ignored. Once a due date is set, ACOG says it does not change no matter how many later ultrasounds you have, even if the baby measures ahead or behind.</p><p>If your provider gave you a due date, choose "Due date" above so this calculator matches your chart. To estimate when conception happened, use the <a href="/conception-calculator">conception calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How many weeks pregnant am I if my last period was 70 days ago?', a: '10 weeks, 0 days. 70 ÷ 7 = 10 with no remainder. You are in your 11th week and in the first trimester.' },
    { q: 'What does 10+3 weeks mean?', a: '10 weeks and 3 days of pregnancy, counted from the first day of the last period. It is also written 10 3/7 weeks.' },
    { q: 'Am I 4 weeks pregnant when I miss my period?', a: 'Usually, yes. With a 28-day cycle your period is due on day 28 from your LMP, which is 4 weeks 0 days by the standard count, even though conception was about 2 weeks earlier.' },
    { q: 'How many weeks is the first trimester?', a: 'By ACOG\'s definition, the first trimester runs from the first day of the last period through 13 weeks 6 days. The second trimester starts at 14 weeks 0 days.' },
    { q: 'How do I calculate how far along I am from my due date?', a: 'Count the days left until the due date and subtract that from 280, then divide by 7. With 168 days to go, you are 112 days, or 16 weeks 0 days, pregnant.' },
    { q: 'Is 40 weeks pregnant 9 months?', a: 'It is about 9.2 months: 280 days divided by an average month of 30.4 days.' },
    { q: 'How many weeks pregnant am I from conception?', a: 'Add 2 weeks to the time since conception. Eight weeks after conception you are 10 weeks pregnant by the standard count.' }
  ],
  related: ['due-date-calculator', 'conception-calculator', 'ovulation-calculator', 'breast-milk-calculator'],
  sources: [
    { name: 'ACOG: How Your Fetus Grows During Pregnancy (trimesters and due date)', url: 'https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy' },
    { name: 'ACOG: Prenatal Genetic Screening Tests', url: 'https://www.acog.org/womens-health/faqs/prenatal-genetic-screening-tests' },
    { name: 'ACOG: Ultrasound Exams', url: 'https://www.acog.org/womens-health/faqs/ultrasound-exams' },
    { name: 'ACOG: Gestational Diabetes', url: 'https://www.acog.org/womens-health/faqs/gestational-diabetes' },
    { name: 'ACOG: Group B Strep and Pregnancy', url: 'https://www.acog.org/womens-health/faqs/group-b-strep-and-pregnancy' },
    { name: 'CDC: Pertussis (Tdap) vaccine recommendations', url: 'https://www.cdc.gov/pertussis/hcp/vaccine-recommendations/index.html' },
    { name: 'ACOG Committee Opinion 579: Definition of Term Pregnancy', url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2013/11/definition-of-term-pregnancy' }
  ],
  disclaimer: 'This is an estimate based on the dates you enter, not medical advice. Your prenatal care provider\'s dating, usually confirmed by ultrasound, is the one to follow.'
};
