export default {
  slug: 'conception-calculator',
  hub: 'health',
  name: 'Conception Date Calculator',
  title: 'Conception Date Calculator: Due May 20, 2027 → Aug 27, 2026',
  h1: 'Conception Date Calculator: When Did I Get Pregnant?',
  meta: 'A due date of May 20, 2027 points to conception around Aug 27, 2026, from intercourse between Aug 22 and Aug 27. Work back from your due date or last period.',
  keyword: 'how do i calculate conception date',
  also: ['conception calculator', 'how to calculate date of conception', 'how to calculate conception', 'when did i conceive', 'conception date from due date', 'when to take pregnancy test after iui calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'm', label: 'Work back from', type: 'select', value: 'due', options: [['due', 'My due date'], ['lmp', 'First day of my last period']] },
    { id: 'due', label: 'Due date', type: 'date', value: '2027-05-20', showIf: { m: ['due'] } },
    { id: 'lmp', label: 'First day of last period', type: 'date', value: '2026-08-13', showIf: { m: ['lmp'] } },
    { id: 'cycle', label: 'Usual cycle length', type: 'number', value: 28, suffix: 'days', showIf: { m: ['lmp'] }, help: 'Ovulation is assumed 14 days before your next period.' }
  ],
  compute(v, H) {
    var P = H.parseDate, A = H.addDays, F = function (d) { return H.fmtDate(d); };
    var ov, due, lmp, cy = 28;
    if (v.m === 'lmp') {
      lmp = P(v.lmp); if (!lmp) return { error: 'Enter the first day of your last period.' };
      if (!(v.cycle >= 20 && v.cycle <= 45)) return { error: 'Enter a cycle length between 20 and 45 days.' };
      cy = Math.round(v.cycle);
      ov = A(lmp, cy - 14);
      due = A(lmp, 280 + cy - 28);
    } else {
      due = P(v.due); if (!due) return { error: 'Enter your due date.' };
      ov = A(due, -266);
      lmp = A(due, -280);
    }
    var rows = [
      ['Fertile window that led to it', F(A(ov, -5)) + ' – ' + F(ov), true],
      ['Most likely implantation', F(A(ov, 8)) + ' – ' + F(A(ov, 10))],
      ['hCG detectable in urine from about', F(A(ov, 12))],
      ['Expected period (missed)', F(A(lmp, cy))],
      [v.m === 'lmp' ? 'Estimated due date' : 'LMP-equivalent date', v.m === 'lmp' ? F(due) : F(lmp)]
    ];
    return {
      value: F(ov),
      label: 'Most likely conception date · ' + H.weekday(ov),
      expr: v.m === 'lmp' ? 'LMP + ' + (cy - 14) + ' days (cycle ' + cy + ' − 14)' : 'due date − 266 days',
      rows: rows,
      sub: 'Conception happens around ovulation, but sperm can survive several days, so the intercourse that led to pregnancy could have been up to 5 days earlier. Dating uncertainty adds a few days on either side.',
      ov: ov, due: due
    };
  },
  quick: ({ r }) => `To calculate your conception date, subtract 266 days (38 weeks) from your due date, or add about 14 days to the first day of your last period in a 28-day cycle. A due date of May 20, 2027 means conception most likely happened around <strong>${r.value}</strong>, from intercourse in the six days ending that day (Aug 22–27, 2026).`,
  stepsTitle: 'How to calculate your conception date',
  steps: [
    'From a due date: count back 266 days, which is 38 weeks. May 20, 2027 − 266 days = Aug 27, 2026.',
    'From your last period: ovulation usually comes about 14 days before the next period, so add (cycle length − 14) days to the first day of your last period. With a 28-day cycle that is day 14; with a 32-day cycle, day 18.',
    'Widen it to a window. Sperm can survive up to about 5 days, so intercourse in the 5 days before ovulation, or on the day itself, can lead to pregnancy.',
    'Use your earliest ultrasound if you had one. A first-trimester dating scan usually pins the due date, and therefore the conception date, more accurately than period dates. Assuming everyone ovulates on day 14 is the most common mistake.'
  ],
  formulaTitle: 'What is the conception date formula?',
  formula: {
    expr: 'Conception ≈ due date − 266 days<br>Conception ≈ LMP + (cycle length − 14) days<br>Fertile window = ovulation − 5 days through ovulation day',
    vars: [['266 days', 'average time from conception to the due date (38 weeks)'], ['LMP', 'first day of the last menstrual period'], ['14', 'typical days from ovulation to the next period (luteal phase)']],
    note: 'The fertile window comes from Wilcox, Weinberg and Baird\'s 1995 study in the New England Journal of Medicine, which found conception occurred only when intercourse took place in a six-day period ending on the estimated day of ovulation.'
  },
  example: `<p>Jess has a 32-day cycle and her last period started on Aug 13, 2026.</p><p>Ovulation ≈ Aug 13 + (32 − 14) = Aug 13 + 18 days = <strong>Aug 31, 2026</strong>. Her fertile window was Aug 26–31.</p><p>Her due date by the cycle-adjusted rule is Aug 13 + 280 + 4 = <strong>May 24, 2027</strong>. If she assumed a standard 28-day cycle, she would have placed conception 4 days too early, on Aug 27.</p>`,
  table: {
    title: 'When did I ovulate and conceive for my cycle length?',
    intro: 'Estimated ovulation day, fertile window and conception date for a last period starting Aug 13, 2026, computed with the calculator above.',
    head: ['Cycle length', 'Ovulation (cycle day)', 'Fertile days (cycle days)', 'Likely conception', 'Due date'],
    rows: ({ run, H }) => [21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35].map(c => {
      const r = run({ m: 'lmp', lmp: '2026-08-13', cycle: c });
      return [c + ' days', 'Day ' + (c - 14), 'Days ' + (c - 19) + '–' + (c - 14), H.fmtDate(r.ov), H.fmtDate(r.due)];
    }),
    note: 'Cycle day 1 is the first day of bleeding. The 14-day luteal phase is an average; it varies by a few days between people and cycles.'
  },
  sections: [
    {
      h2: 'How do you calculate the date of conception from a due date?',
      html: `<p>Subtract 266 days. Due dates are set at 280 days after the first day of the last period, on the assumption that ovulation and conception happen about 14 days in. Taking those 14 days off leaves 266 days, or exactly 38 weeks, from conception to due date.</p><p>If your due date was set or changed by an early ultrasound, this still works: the ultrasound adjusts the due date, and the conception estimate moves with it. For IVF pregnancies you don't need to estimate; fertilization happened on the day of egg retrieval, which is 5 days before a day-5 transfer. To go the other way, from a known conception date to a due date, use the <a href="/due-date-calculator">due date calculator</a>.</p>`
    },
    {
      h2: 'How accurate is a conception date calculator?',
      html: `<p>It is accurate to within several days, not to the day. Three things blur it:</p><ul><li><strong>Ovulation timing:</strong> even people with regular cycles do not always ovulate on the same day.</li><li><strong>Sperm survival:</strong> in Wilcox's 1995 study, the chance of conception ranged from about 10% when intercourse was 5 days before ovulation to 33% on the day of ovulation, so the act that led to pregnancy may predate conception by days.</li><li><strong>Dating error:</strong> due dates from period dates or ultrasound carry their own margin of several days.</li></ul><p>Together, a realistic answer is a window of about a week to 10 days around the date shown, which is why the calculator reports a fertile window as well as a single date.</p>`
    },
    {
      h2: 'Can a conception date tell you who the father is?',
      html: `<p>Only when the possible dates are far apart. If intercourse with two different partners happened several weeks apart, the conception window may clearly point to one of them. If the dates are within about two weeks of each other, ovulation timing, sperm survival and dating error overlap enough that no calculator can tell them apart.</p><p>The reliable answer is a DNA paternity test. Non-invasive prenatal paternity tests use a blood sample from the pregnant person and a cheek swab from the possible father, and testing can also be done after birth. Ask your provider or an accredited lab about timing and options.</p>`
    },
    {
      h2: 'When can you take a pregnancy test after conception?',
      html: `<p>Wait until about the day your period is due. The embryo has to implant before the pregnancy hormone hCG appears, and Wilcox's 1999 study of 221 women found implantation happened 6 to 12 days after ovulation, with 84% on days 8, 9 or 10. The FDA says that with a 28-day cycle, hCG can be detected in urine 12–15 days after ovulation.</p><p>For the example conception date of Aug 27, 2026, that means testing from about Sep 8 to Sep 11, around the expected period on Sep 10. After an IUI, count from the insemination day the same way; if you had an hCG "trigger" shot, testing too early can show a false positive from the injected hormone, so follow your clinic's timing. The <a href="/ovulation-calculator">ovulation calculator</a> predicts fertile days for future cycles.</p>`
    }
  ],
  faq: [
    { q: 'How many weeks pregnant am I at conception?', a: 'About 2 weeks. Pregnancy is counted from the first day of the last period, so at conception you are roughly 2 weeks 0 days pregnant by the standard count, even though the embryo is just forming.' },
    { q: 'If my due date is May 20, 2027, when did I conceive?', a: 'Most likely around Aug 27, 2026 (266 days earlier), from intercourse between about Aug 22 and Aug 27.' },
    { q: 'Can I get pregnant from sex 5 days before ovulation?', a: 'Yes. Sperm can survive up to about 5 days. In Wilcox\'s study the chance of conception from intercourse 5 days before ovulation was about 10%, rising to about 33% on ovulation day.' },
    { q: 'Is conception the same day as intercourse?', a: 'Not always. Fertilization happens when sperm meets the egg after ovulation, which can be up to several days after intercourse.' },
    { q: 'Can an ultrasound tell me the exact day I conceived?', a: 'No, but an early ultrasound is the most accurate way to date a pregnancy. The conception estimate from an ultrasound-based due date is still a window of several days.' },
    { q: 'How long after conception does implantation happen?', a: 'Usually 8 to 10 days after ovulation, and in Wilcox\'s 1999 study always between 6 and 12 days.' },
    { q: 'When should I test after an IUI?', a: 'Most clinics suggest about 2 weeks after the insemination, around when your period is due. If you had an hCG trigger shot, ask your clinic, because it can cause an early false positive.' }
  ],
  related: ['due-date-calculator', 'pregnancy-weeks-calculator', 'ovulation-calculator', 'luteal-phase-calculator'],
  sources: [
    { name: 'Wilcox AJ, Weinberg CR, Baird DD. Timing of sexual intercourse in relation to ovulation. N Engl J Med 1995', url: 'https://pubmed.ncbi.nlm.nih.gov/7477165/' },
    { name: 'Wilcox AJ, Baird DD, Weinberg CR. Time of implantation of the conceptus and loss of pregnancy. N Engl J Med 1999', url: 'https://pubmed.ncbi.nlm.nih.gov/10362823/' },
    { name: 'FDA: Pregnancy (home-use tests)', url: 'https://www.fda.gov/medical-devices/home-use-tests/pregnancy' },
    { name: 'ACOG Committee Opinion 700: Methods for Estimating the Due Date', url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date' }
  ],
  disclaimer: 'Conception dates are estimates, not medical or legal evidence. Only DNA testing can establish paternity; talk with your provider about dating your pregnancy.'
};
