export default {
  slug: 'due-date-calculator',
  hub: 'health',
  name: 'Due Date Calculator',
  title: 'Due Date Calculator: LMP Mar 1, 2026 Means Due Dec 6, 2026',
  h1: 'Due Date Calculator: From Your Last Period, Conception Date or IVF Transfer',
  meta: 'A last period starting Mar 1, 2026 gives an estimated due date of Sunday, Dec 6, 2026 (LMP + 280 days). Adjust for cycle length, conception, IVF or ultrasound.',
  keyword: 'how to calculate your due date',
  also: ['due date calculator', 'pregnancy due date calculator', 'what to expect ivf calculator', 'ivf due date calculator', 'naegele\'s rule', 'estimated due date'],
  updated: '2026-11-13',
  inputs: [
    { id: 'm', label: 'Calculate from', type: 'select', value: 'lmp', wide: true, options: [['lmp', 'First day of last menstrual period (LMP)'], ['con', 'Known conception date'], ['ivf5', 'IVF: day-5 embryo (blastocyst) transfer'], ['ivf3', 'IVF: day-3 embryo transfer'], ['us', 'Ultrasound dating']] },
    { id: 'lmp', label: 'First day of last period', type: 'date', value: '2026-03-01', showIf: { m: ['lmp'] } },
    { id: 'cycle', label: 'Usual cycle length', type: 'number', value: 28, suffix: 'days', showIf: { m: ['lmp'] }, help: 'From the first day of one period to the first day of the next.' },
    { id: 'con', label: 'Conception date', type: 'date', value: '2026-03-15', showIf: { m: ['con'] } },
    { id: 'xfer', label: 'Embryo transfer date', type: 'date', value: '2026-03-20', showIf: { m: ['ivf5', 'ivf3'] } },
    { id: 'usd', label: 'Date of ultrasound', type: 'date', value: '2026-04-30', showIf: { m: ['us'] } },
    { id: 'usw', label: 'Gestational age at scan: weeks', type: 'number', value: 8, suffix: 'wk', showIf: { m: ['us'] } },
    { id: 'usdays', label: 'and days', type: 'number', value: 4, suffix: 'd', showIf: { m: ['us'] } }
  ],
  compute(v, H) {
    var P = H.parseDate, A = H.addDays, edd, expr;
    if (v.m === 'con') {
      var c = P(v.con); if (!c) return { error: 'Enter the conception date.' };
      edd = A(c, 266); expr = 'conception + 266 days';
    } else if (v.m === 'ivf5' || v.m === 'ivf3') {
      var x = P(v.xfer); if (!x) return { error: 'Enter the embryo transfer date.' };
      var k = v.m === 'ivf5' ? 261 : 263;
      edd = A(x, k); expr = 'day-' + (v.m === 'ivf5' ? 5 : 3) + ' transfer + ' + k + ' days';
    } else if (v.m === 'us') {
      var u = P(v.usd); if (!u) return { error: 'Enter the ultrasound date.' };
      var ga = (v.usw >= 0 ? v.usw : NaN) * 7 + (v.usdays >= 0 ? v.usdays : 0);
      if (!(ga >= 35 && ga <= 280)) return { error: 'Enter the gestational age from the scan report (5 to 40 weeks).' };
      edd = A(u, 280 - ga); expr = 'scan date + (280 − ' + ga + ') days';
    } else {
      var l = P(v.lmp); if (!l) return { error: 'Enter the first day of your last period.' };
      var cy = v.cycle >= 20 && v.cycle <= 45 ? Math.round(v.cycle) : NaN;
      if (isNaN(cy)) return { error: 'Enter a cycle length between 20 and 45 days.' };
      edd = A(l, 280 + cy - 28); expr = 'LMP + 280 days' + (cy !== 28 ? (cy > 28 ? ' + ' : ' − ') + Math.abs(cy - 28) + ' (cycle)' : '');
    }
    var l0 = A(edd, -280);
    var rows = [
      ['Estimated conception', H.fmtDate(A(l0, 14))],
      ['Second trimester begins (14w 0d)', H.fmtDate(A(l0, 98))],
      ['Third trimester begins (28w 0d)', H.fmtDate(A(l0, 196))],
      ['Full term (39w 0d – 40w 6d)', H.fmtDate(A(l0, 273)) + ' – ' + H.fmtDate(A(l0, 286)), true],
      ['Late term begins (41w 0d)', H.fmtDate(A(l0, 287))]
    ];
    if (v.m !== 'lmp') rows.unshift(['LMP-equivalent start date', H.fmtDate(l0)]);
    var t = P(H.today()), gd = H.daysBetween(l0, t);
    if (gd >= 0 && gd <= 300) rows.push(['Gestational age today', Math.floor(gd / 7) + ' weeks, ' + (gd % 7) + ' days']);
    return {
      value: H.fmtDate(edd),
      label: 'Estimated due date · ' + H.weekday(edd),
      expr: expr,
      rows: rows,
      sub: 'Only about 1 in 20 babies arrives on the due date itself. Babies born from ' + H.fmtDate(A(l0, 259)) + ' (37 weeks) on are term; your provider may adjust the date after an early ultrasound.',
      edd: edd
    };
  },
  quick: ({ r }) => `To calculate your due date, add 280 days (40 weeks) to the first day of your last menstrual period. If your last period started on Mar 1, 2026, your estimated due date is <strong>${r.value}</strong>, a ${r.label.split('· ')[1]}. Add or subtract days if your cycle is longer or shorter than 28 days, or count 266 days from a known conception date.`,
  stepsTitle: 'How to calculate your due date',
  steps: [
    'Find the first day of your last menstrual period (LMP), not the day it ended. In the example that is Mar 1, 2026.',
    'Add 280 days, or 40 weeks: Mar 1, 2026 + 280 days = Dec 6, 2026.',
    'Adjust for cycle length: add one day for each day your cycle is longer than 28 days, or subtract one for each day shorter. A 32-day cycle moves the date to Dec 10.',
    'If you know the conception date, add 266 days instead. For IVF, add 261 days to a day-5 transfer or 263 days to a day-3 transfer.',
    'Confirm with your provider. An early ultrasound often checks the date, and once your due date is set it normally stays the same for the rest of the pregnancy.'
  ],
  formulaTitle: 'What is the due date formula?',
  formula: {
    expr: 'Due date = LMP + 280 days + (cycle length − 28)<br>Due date = conception date + 266 days<br>IVF: transfer date + 261 days (day-5 embryo) or + 263 days (day-3 embryo)',
    vars: [['LMP', 'first day of the last menstrual period'], ['280 days', '40 weeks, the standard length of pregnancy counted from LMP'], ['266 days', '38 weeks, from conception (assumes ovulation on day 14)']],
    note: 'Naegele\'s rule is the pen-and-paper shortcut: add 1 year, subtract 3 months and add 7 days to the LMP. It can land 1–3 days later than an exact 280-day count because months have different lengths.'
  },
  example: `<p>Maya's last period started on May 1, 2026 and her cycles run about 31 days.</p><p>LMP + 280 days = Feb 5, 2027. Her cycle is 3 days longer than 28, so she adds 3 days: <strong>Feb 8, 2027</strong>.</p><p>At an 8-week ultrasound the baby measures a day behind, which is well within normal, so her provider keeps Feb 8 as the due date. Full term (39 weeks 0 days to 40 weeks 6 days) runs from Feb 1 to Feb 14, 2027.</p>`,
  table: {
    title: 'What is my due date if my last period started on the 1st of the month?',
    intro: 'Due dates for a 28-day cycle, computed with the calculator above, compared with Naegele\'s shortcut (+1 year, −3 months, +7 days).',
    head: ['Last period began', 'Due date (LMP + 280)', 'Naegele\'s rule', 'Difference'],
    rows: ({ run, H }) => Array.from({ length: 12 }, (_, i) => {
      const l = new Date(Date.UTC(2026, i, 1));
      const e = run({ m: 'lmp', lmp: H.iso(l), cycle: 28 }).edd;
      const n = H.addDays(H.addMonths(l, 9), 7);
      const d = H.daysBetween(e, n);
      return [H.fmtDate(l), H.fmtDate(e), H.fmtDate(n), d === 0 ? 'same' : '+' + d + (d === 1 ? ' day' : ' days')];
    }),
    note: 'The shortcut overshoots for last periods in March through May because those 9-month spans include February. Clinicians and pregnancy wheels use the exact 280-day count.'
  },
  sections: [
    {
      h2: 'How accurate is a due date?',
      html: `<p>It is an estimate of the middle of a wide window. The American College of Obstetricians and Gynecologists (ACOG) notes that only about 1 in 20 women give birth on their due date. A 2013 NIH study by Jukic and colleagues followed 125 natural pregnancies in which ovulation had been pinpointed with daily hormone tests; even after excluding preterm births, the length of pregnancy varied over a range of 37 days. The median time from ovulation to birth was 268 days (38 weeks, 2 days).</p><p>Two things make an LMP-based date less certain: not remembering the start date exactly, and ovulating earlier or later than day 14. That is why many providers confirm the date with a first-trimester ultrasound, which measures the embryo's crown-rump length.</p>`
    },
    {
      h2: 'How do you calculate an IVF due date?',
      html: `<p>IVF dates are the most precise because the embryo's age is known. ACOG's guidance on estimating the due date (Committee Opinion 700) says to use the embryo's age and the transfer date: the due date is <strong>261 days after a day-5 (blastocyst) transfer</strong> or <strong>263 days after a day-3 transfer</strong>. Both equal 266 days from fertilization.</p><p>With a day-5 transfer on Mar 20, 2026, the due date is Dec 6, 2026, the same as a natural pregnancy with an LMP of Mar 1. For a frozen embryo transfer the same rule applies; what matters is the embryo's age on the day it was transferred.</p>`
    },
    {
      h2: 'Can my due date change after an ultrasound?',
      html: `<p>It can be changed once, early. ACOG advises setting the due date as soon as the LMP and the first accurate ultrasound are available, and changing it only if the ultrasound differs from the LMP date by more than a set margin that grows with gestational age. After that, the date normally does not change, no matter how many later ultrasounds you have; later scans track growth instead.</p><p>ACOG also considers a pregnancy without an ultrasound that confirms or revises the due date before 22 weeks to be suboptimally dated. If you already have a scan date and the gestational age it reported, choose "Ultrasound dating" above.</p>`
    },
    {
      h2: 'What do early term, full term and late term mean?',
      html: `<p>ACOG and the Society for Maternal-Fetal Medicine replaced the single label "term" with four categories:</p><div class="twrap"><table><thead><tr><th>Category</th><th>Gestational age</th><th>For a Dec 6, 2026 due date</th></tr></thead><tbody>
<tr><td>Early term</td><td>37w 0d – 38w 6d</td><td>Nov 15 – Nov 28, 2026</td></tr>
<tr><td>Full term</td><td>39w 0d – 40w 6d</td><td>Nov 29 – Dec 12, 2026</td></tr>
<tr><td>Late term</td><td>41w 0d – 41w 6d</td><td>Dec 13 – Dec 19, 2026</td></tr>
<tr><td>Postterm</td><td>42w 0d and beyond</td><td>Dec 20, 2026 on</td></tr>
</tbody></table></div><p>Babies born before 37 weeks are preterm. To see where you are today, use the <a href="/pregnancy-weeks-calculator">pregnancy weeks calculator</a>; to work backward to the likely conception date, use the <a href="/conception-calculator">conception calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my due date from my last period?', a: 'Add 280 days to the first day of your last period. An LMP of Mar 1, 2026 gives a due date of Dec 6, 2026.' },
    { q: 'How many weeks is a full-term pregnancy?', a: 'ACOG defines full term as 39 weeks 0 days through 40 weeks 6 days. Early term is 37 to 38 weeks 6 days; late term is 41 weeks to 41 weeks 6 days.' },
    { q: 'What if I have irregular periods?', a: 'An LMP-based date is less reliable with irregular cycles because ovulation timing varies. An early ultrasound is the usual way to set the due date in that case.' },
    { q: 'How do I calculate my due date from conception?', a: 'Add 266 days (38 weeks) to the conception date. Conception on Mar 15, 2026 gives a due date of Dec 6, 2026.' },
    { q: 'Is the due date 40 weeks from conception?', a: 'No. Pregnancy is counted from the first day of the last period, about 2 weeks before conception in a 28-day cycle. From conception it is about 38 weeks.' },
    { q: 'Are first babies usually late?', a: 'First pregnancies are one of the recognized risk factors for going past the due date, according to ACOG, but many first babies arrive on time or early.' },
    { q: 'What day of the week is my due date?', a: 'The calculator shows it under the result. For an LMP of Mar 1, 2026, the due date falls on a Sunday.' }
  ],
  related: ['pregnancy-weeks-calculator', 'conception-calculator', 'ovulation-calculator', 'luteal-phase-calculator'],
  sources: [
    { name: 'ACOG Committee Opinion 700: Methods for Estimating the Due Date', url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date' },
    { name: 'ACOG Committee Opinion 579: Definition of Term Pregnancy', url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2013/11/definition-of-term-pregnancy' },
    { name: 'ACOG: How Your Fetus Grows During Pregnancy', url: 'https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy' },
    { name: 'ACOG: When Pregnancy Goes Past Your Due Date', url: 'https://www.acog.org/womens-health/faqs/when-pregnancy-goes-past-your-due-date' },
    { name: 'Jukic AM et al. Length of human pregnancy and contributors to its natural variation. Hum Reprod 2013', url: 'https://pubmed.ncbi.nlm.nih.gov/23922246/' }
  ],
  disclaimer: 'This due date is an estimate, not medical advice. Your prenatal care provider sets your official due date, usually with an ultrasound.'
};
