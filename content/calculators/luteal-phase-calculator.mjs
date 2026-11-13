export default {
  slug: 'luteal-phase-calculator',
  hub: 'health',
  name: 'Luteal Phase Calculator',
  title: 'Luteal Phase Calculator: 30 − 17 = a 13-Day Luteal Phase',
  h1: 'Luteal Phase Calculator: Measure Yours and Check If It Is Short',
  meta: 'A 30-day cycle with ovulation on day 17 has a 13-day luteal phase (30 − 17). Measure yours from tracking data, see if it is short, and time a progesterone test.',
  keyword: 'how to calculate luteal phase',
  also: ['how do you calculate luteal phase', 'when is my luteal phase calculator', 'luteal phase length calculator', 'short luteal phase calculator', 'day 21 progesterone test calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'What do you know?', type: 'select', value: 'days', options: [['days', 'Cycle length and the cycle day I ovulated'], ['dates', 'The date I ovulated and the date my next period started']], wide: true },
    { id: 'cycle', label: 'Cycle length', type: 'number', value: 30, suffix: 'days', showIf: { method: ['days'] } },
    { id: 'ovday', label: 'Ovulation or LH-peak day', type: 'number', value: 17, suffix: 'cycle day', showIf: { method: ['days'] }, help: 'Day 1 is the first day of your period.' },
    { id: 'lmp', label: 'First day of this cycle (optional, for dates)', type: 'date', value: 'today-10', showIf: { method: ['days'] } },
    { id: 'ovdate', label: 'Ovulation or LH-peak date', type: 'date', value: 'today-20', showIf: { method: ['dates'] } },
    { id: 'nextdate', label: 'Next period started on', type: 'date', value: 'today-6', showIf: { method: ['dates'] } }
  ],
  compute(v, H) {
    var lut, ovd, cyc, ovDate = null, nextDate = null;
    if (v.method === 'dates') {
      ovDate = H.parseDate(v.ovdate); nextDate = H.parseDate(v.nextdate);
      if (!ovDate || !nextDate) return { error: 'Enter both dates.' };
      lut = H.daysBetween(ovDate, nextDate) - 1;
      if (lut < 3 || lut > 30) return { error: 'The period date should be 4 to 31 days after ovulation. Check the dates.' };
    } else {
      cyc = Math.round(v.cycle); ovd = Math.round(v.ovday);
      if (!(cyc >= 18 && cyc <= 60)) return { error: 'Enter a cycle length between 18 and 60 days.' };
      if (!(ovd >= 5) || ovd >= cyc - 2) return { error: 'The ovulation day must be at least 3 days before the end of the cycle.' };
      lut = cyc - ovd;
      var start = H.parseDate(v.lmp);
      if (start) { ovDate = H.addDays(start, ovd - 1); nextDate = H.addDays(start, cyc); }
    }
    var status = lut <= 10 ? 'Short (10 days or fewer)' : lut <= 17 ? 'Typical (11–17 days)' : 'Longer than typical (18+ days)';
    var rows = [['Assessment', status, true]];
    if (ovd) rows.push(['Follicular phase (day 1 to ovulation)', H.plural(ovd, 'day')]);
    rows.push(['Mid-luteal progesterone test', ovd ? 'cycle day ' + (ovd + 7) + (ovDate ? ' (' + H.fmtDate(H.addDays(ovDate, 7)) + ')' : '') : H.fmtDate(H.addDays(ovDate, 7)) + ' (7 days after ovulation)']);
    if (ovDate && nextDate) rows.push(['Luteal phase dates', H.fmtDate(H.addDays(ovDate, 1)) + ' – ' + H.fmtDate(H.addDays(nextDate, -1))]);
    if (ovd) rows.push(['Luteal phase cycle days', 'day ' + (ovd + 1) + ' to day ' + cyc]);
    var dd = lut - 14;
    rows.push(['Difference from the 14-day average', dd === 0 ? 'none' : (dd > 0 ? '+' : '−') + H.plural(Math.abs(dd), 'day')]);
    var sub = lut <= 10 ? 'ASRM associates a luteal phase of 10 days or fewer with luteal phase deficiency, though it has not been proven to cause infertility on its own. Check a few cycles and discuss them with a clinician if you are trying to conceive.' : lut <= 17 ? 'Within the usual range. Research (Lenton 1984) found an average of about 14 days, varying little from cycle to cycle.' : 'Unusually long. If you have had no period 18 or more days after ovulation, take a pregnancy test.';
    return {
      value: H.plural(lut, 'day'),
      label: 'Luteal phase length',
      expr: ovd ? cyc + ' − ' + ovd : H.daysBetween(ovDate, nextDate) + ' days between dates − 1',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate your luteal phase, subtract the cycle day you ovulated from your total cycle length. A <strong>30-day cycle</strong> with ovulation on <strong>day 17</strong> has a luteal phase of 30 − 17 = <strong>${r.value}</strong>. Equivalently, count the days from the day after ovulation to the day before your next period. Most luteal phases last 11 to 17 days; 10 or fewer is considered short.`,
  stepsTitle: 'How to calculate your luteal phase length',
  steps: [
    'Pin down your ovulation day for one cycle with an LH test, basal body temperature chart or cervical mucus tracking. A calendar guess will not do, because this is what you are trying to measure.',
    'Note the cycle day of ovulation (or of your LH peak), counting the first day of your period as day 1.',
    'When your next period starts, count that cycle\'s total length, from day 1 up to the day before the new period.',
    'Subtract: cycle length − ovulation day = luteal phase. <strong>Do not count the ovulation day itself or the first day of the new period</strong>; including either adds a day.',
    'Repeat for two or three cycles. One short cycle is common; a pattern matters more.'
  ],
  formulaTitle: 'What is the luteal phase formula?',
  formula: {
    expr: 'Luteal phase = cycle length − ovulation day<br>Luteal phase = (next period date − ovulation date) − 1<br>Mid-luteal test day = ovulation day + 7',
    vars: [['cycle length', 'days from the first day of one period to the day before the next'], ['ovulation day', 'cycle day of ovulation or of the LH peak'], ['luteal phase', 'days after ovulation up to and including the day before the next period']],
    note: 'This matches the definition Lenton and colleagues used in their 1984 study of 327 cycles: the days following, but not including, the LH peak, up to and including the day before menstruation. They found a mean of 14.13 days with a standard deviation of 1.41.'
  },
  example: `<p>Jess gets her first positive LH test on <strong>day 19</strong> and her next period starts after a <strong>29-day cycle</strong>.</p>
<p>Luteal phase = 29 − 19 = <strong>10 days</strong>, which falls in the short range. Her follicular phase was 19 days, longer than the textbook 14.</p>
<p>The next cycle she tracks gives 31 − 19 = <strong>12 days</strong>. With dates instead: LH peak on <strong>June 9</strong>, next period on <strong>June 22</strong>: 13 days between them, minus 1 = <strong>12 days</strong>. Her mid-luteal progesterone test would fall on June 16, cycle day 26, rather than day 21.</p>`,
  table: {
    title: 'How long is the luteal phase for each ovulation day?',
    intro: 'Luteal phase length by ovulation day and cycle length, calculated with the tool above. Values of 10 days or fewer are marked short, and 18 or more long.',
    head: ['Ovulation day', '26-day cycle', '28-day cycle', '30-day cycle', '32-day cycle', '35-day cycle', 'Progesterone test day'],
    rows: ({ run }) => [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(o => ['Day ' + o, ...[26, 28, 30, 32, 35].map(c => {
      const r = run({ method: 'days', cycle: c, ovday: o });
      if (r.error) return '—';
      const n = parseInt(r.value, 10);
      return n + (n <= 10 ? ' (short)' : n >= 18 ? ' (long)' : '');
    }), 'Day ' + (o + 7)]),
    note: 'Read across a row to see that the luteal phase stays near two weeks only when cycle length and ovulation day move together.'
  },
  sections: [
    {
      h2: 'How do you know which day you ovulated?',
      html: `<p>You need a sign that happens at or after ovulation, logged day by day:</p>
<ul>
<li><strong>LH test strips:</strong> a surge of luteinizing hormone triggers ovulation, usually within about a day or two of a first positive test. Research definitions often count the luteal phase from the LH peak day.</li>
<li><strong>Basal body temperature:</strong> progesterone raises your waking temperature slightly after ovulation. The last low reading before a sustained rise is usually taken as ovulation day.</li>
<li><strong>Cervical mucus:</strong> clear, stretchy, slippery mucus peaks around ovulation and dries up soon after.</li>
<li><strong>Blood tests and ultrasound:</strong> a mid-luteal progesterone level or follicle tracking at a fertility clinic confirm it most reliably.</li>
</ul>
<p>Combining two signs, such as LH tests and temperature, gives a firmer ovulation day than either alone.</p>`
    },
    {
      h2: 'What is a short luteal phase, and does it affect fertility?',
      html: `<p>The American Society for Reproductive Medicine describes luteal phase deficiency as a clinical diagnosis associated with a luteal phase of <strong>10 days or fewer</strong>. In Lenton's study, every luteal phase of 9 days or fewer was judged abnormal, as were most 10-day phases, and short luteal phases made up 5.2% of cycles.</p>
<p>The fertility link is weaker than often claimed. ASRM's 2026 committee opinion states that luteal phase deficiency has not been proven to be an independent cause of infertility or recurrent pregnancy loss, that it also occurs in fertile women with normal cycles, and that whether treatment helps is uncertain. A short luteal phase across several cycles is still worth raising with a clinician, especially alongside thyroid symptoms, very intense exercise, low body weight or high prolactin.</p>`
    },
    {
      h2: 'When should you take a day 21 progesterone test?',
      html: `<p>The "day 21" blood test is meant to be taken about <strong>7 days after ovulation</strong>, when progesterone from the corpus luteum peaks. Day 21 only fits a 28-day cycle that ovulates on day 14. Ovulate on day 19 and the right day is 26; in a 35-day cycle ovulating on day 21, it is day 28.</p>
<p>A test taken too early can look low even though ovulation happened, which is a common reason for a misleading result. Use the progesterone test day in the results, or count 7 days forward from a positive LH test, and tell the lab or clinician which cycle day you are on.</p>`
    },
    {
      h2: 'Why does my cycle length change if the luteal phase is steady?',
      html: `<p>Most cycle-to-cycle variation comes from the follicular phase, the time it takes a follicle to mature before ovulation. Stress, illness, travel and changes in sleep or training can delay ovulation, which lengthens the cycle. Once ovulation happens, the corpus luteum typically lasts about two weeks unless pregnancy occurs.</p>
<p>So a 35-day cycle usually means late ovulation, not a 21-day luteal phase. That is also why fertile-window predictions should start from your ovulation pattern: the <a href="/ovulation-calculator">ovulation calculator</a> accepts your measured luteal phase to sharpen its dates.</p>`
    }
  ],
  faq: [
    { q: 'How long is a normal luteal phase?', a: 'Usually 11 to 17 days, with an average of about 14. Lenton\'s 1984 study found a mean of 14.13 days and a standard deviation of 1.41 days.' },
    { q: 'Is a 10-day luteal phase too short?', a: 'A luteal phase of 10 days or fewer is the range ASRM associates with luteal phase deficiency. One short cycle is not unusual; track a few more before drawing conclusions.' },
    { q: 'Does the luteal phase include my period?', a: 'No. The luteal phase ends the day before your period starts. Your period is the first part of the next cycle\'s follicular phase.' },
    { q: 'Can the luteal phase be longer than 16 days?', a: 'Occasionally, but a luteal phase that runs past 17 or 18 days with no period is a classic early sign of pregnancy. Take a home pregnancy test.' },
    { q: 'How do I calculate my luteal phase from an LH test?', a: 'Count the days after your positive LH test (the peak day) up to the day before your next period. Positive on day 15 of a 28-day cycle gives a 13-day luteal phase.' },
    { q: 'When is my luteal phase?', a: 'It starts the day after ovulation and ends the day before your next period. In a 28-day cycle that ovulates on day 14, it runs from day 15 to day 28. Enter your cycle start date above to see the dates.' },
    { q: 'Can you lengthen a short luteal phase?', a: 'Treatments such as progesterone supplements or ovulation medications are sometimes used, but ASRM notes it is unclear whether treating luteal phase deficiency improves pregnancy rates. Discuss options with a fertility specialist.' }
  ],
  related: ['ovulation-calculator', 'conception-calculator', 'due-date-calculator', 'pregnancy-weeks-calculator'],
  sources: [
    { name: 'ASRM & SREI Practice Committees 2026: Diagnosis and treatment of luteal phase deficiency (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/42414147/' },
    { name: 'Lenton et al. 1984: Normal variation in the length of the luteal phase (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/6743610/' },
    { name: 'StatPearls (NCBI Bookshelf): Physiology, Menstrual Cycle', url: 'https://www.ncbi.nlm.nih.gov/books/NBK500020/' },
    { name: 'Office on Women\'s Health (HHS): Your Menstrual Cycle', url: 'https://www.womenshealth.gov/menstrual-cycle/your-menstrual-cycle' }
  ],
  disclaimer: 'For cycle tracking and education only. It cannot diagnose luteal phase deficiency or other conditions; talk to a clinician about fertility concerns.'
};
