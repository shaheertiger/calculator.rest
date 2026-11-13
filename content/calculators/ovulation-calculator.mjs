export default {
  slug: 'ovulation-calculator',
  hub: 'health',
  name: 'Ovulation & Period Calculator',
  title: 'Ovulation Calculator: Fertile Days 9–14 of a 28-Day Cycle',
  h1: 'Ovulation and Period Calculator: Your Fertile Window for 3 Cycles',
  meta: 'In a 28-day cycle, ovulation falls around day 14 and the fertile window runs from day 9 to day 14. Enter your last period for dates across your next 3 cycles.',
  keyword: 'how to calculate my fertile window',
  also: ['ovulation calculator', 'fertile window calculator', 'how to calculate my next menstrual period', 'how can i calculate my menstrual cycle', 'am i late for my period calculator', 'period calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'lmp', label: 'First day of your last period', type: 'date', value: 'today-7' },
    { id: 'cycle', label: 'Average cycle length', type: 'number', value: 28, suffix: 'days', help: 'From the first day of one period to the day before the next.' },
    { id: 'luteal', label: 'Luteal phase length', type: 'number', value: 14, suffix: 'days', help: 'Leave at 14 unless you have tracked it.' },
    { id: 'short', label: 'Shortest recent cycle (optional)', type: 'number', value: '', suffix: 'days', placeholder: 'e.g. 26' },
    { id: 'long', label: 'Longest recent cycle (optional)', type: 'number', value: '', suffix: 'days', placeholder: 'e.g. 32' }
  ],
  compute(v, H) {
    var lmp = H.parseDate(v.lmp);
    if (!lmp) return { error: 'Enter the first day of your last period.' };
    var c = Math.round(v.cycle), lu = Math.round(v.luteal >= 1 ? v.luteal : 14);
    if (!(c >= 20 && c <= 45)) return { error: 'Enter an average cycle length between 20 and 45 days.' };
    if (!(lu >= 8 && lu <= 18) || c - lu < 7) return { error: 'Enter a luteal phase of 8 to 18 days that is at least 7 days shorter than your cycle.' };
    var ov = c - lu;
    function md(d) { return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' }); }
    var trows = [], first = null;
    for (var i = 0; i < 3; i++) {
      var s = H.addDays(lmp, i * c), o = H.addDays(s, ov - 1), f0 = H.addDays(o, -5), nx = H.addDays(s, c);
      if (!first) first = { s: s, o: o, f0: f0, nx: nx };
      trows.push([String(i + 1), H.fmtDate(s), md(f0) + ' – ' + md(o), H.fmtDate(o), H.fmtDate(nx)]);
    }
    var rows = [
      ['Estimated ovulation', H.fmtDate(first.o, true) + ' (cycle day ' + ov + ')', true],
      ['Most fertile days', md(H.addDays(first.o, -2)) + ' – ' + md(first.o)],
      ['Next period expected', H.fmtDate(first.nx, true)],
      ['Pregnancy test from', H.fmtDate(first.nx) + ' (day of expected period)']
    ];
    var today = H.parseDate(H.today());
    var cd = H.daysBetween(lmp, today) + 1;
    if (cd >= 1 && cd <= c) rows.push(['Today is', 'cycle day ' + cd]);
    if (v.short > 0 && v.long >= v.short) {
      var a = Math.round(v.short) - 18, b = Math.round(v.long) - 11;
      if (a >= 1 && b >= a) rows.push(['Calendar-method range (shortest − 18 to longest − 11)', 'cycle days ' + a + '–' + b + ' (' + md(H.addDays(lmp, a - 1)) + ' – ' + md(H.addDays(lmp, b - 1)) + ')']);
    }
    var sub = 'The fertile window is the 5 days before ovulation plus ovulation day. Calendar estimates can be off by several days, even with regular cycles.';
    if (cd > c + 1) sub = 'Your period was expected on ' + H.fmtDate(first.nx) + '. If it has not started, a home pregnancy test is a sensible next step; cycles also vary by several days for many reasons.';
    return {
      value: md(first.f0) + ' – ' + md(first.o),
      label: 'Fertile window this cycle',
      expr: 'Ovulation ≈ day ' + c + ' − ' + lu + ' = day ' + ov,
      ovDay: ov,
      rows: rows,
      table: { head: ['Cycle', 'Period starts', 'Fertile window', 'Ovulation', 'Next period'], rows: trows, caption: 'Your next 3 cycles' },
      sub: sub
    };
  },
  quick: ({ r, v, H }) => `To calculate your fertile window, subtract 14 from your cycle length to estimate ovulation day, then count back 5 days. In a <strong>28-day cycle</strong> ovulation falls around day 14, so the fertile window is <strong>days 9–14</strong>. For a last period starting ${H.fmtDate(v.lmp)}, that is <strong>${r.value}</strong>. Your next period would be due 28 days after it started.`,
  stepsTitle: 'How to calculate your fertile window',
  steps: [
    'Find your average cycle length: count from the first day of one period to the day before the next, over at least 3 to 6 cycles, and average them.',
    'Estimate ovulation day as cycle length minus your luteal phase, which is about 14 days for most people: 28 − 14 = day 14; 32 − 14 = day 18.',
    'Count back 5 days from ovulation. The 6 days ending on ovulation day are the fertile window, because sperm can survive up to about 5 days and the egg for about a day.',
    '<strong>Use your own cycle length, not 28</strong>. Assuming day 14 for everyone is the most common mistake; in a 35-day cycle ovulation is closer to day 21.',
    'Add your cycle length to the first day of your last period to predict the next period, and repeat for later cycles.'
  ],
  formulaTitle: 'What is the formula for ovulation and the fertile window?',
  formula: {
    expr: 'Ovulation day = cycle length − luteal phase (≈ 14)<br>Fertile window = ovulation day − 5 through ovulation day<br>Next period = first day of last period + cycle length',
    vars: [['cycle length', 'days from the start of one period to the start of the next'], ['luteal phase', 'days from just after ovulation to the day before the next period, usually 12–14'], ['cycle day 1', 'the first day of full menstrual flow']],
    note: 'The six-day window comes from Wilcox et al. (NEJM, 1995), who found conception occurred only from intercourse in the six days ending on the estimated day of ovulation. If you have measured your luteal phase, enter it to shift the estimate; the <a href="/luteal-phase-calculator">luteal phase calculator</a> shows how to measure it.'
  },
  example: `<p>Maya's last period started on <strong>March 3</strong> and her cycles average <strong>31 days</strong>.</p>
<p>Ovulation ≈ day 31 − 14 = <strong>day 17</strong>, which is March 3 + 16 days = <strong>March 19</strong>. Fertile window: March 14 – March 19, with March 17–19 the most fertile days.</p>
<p>Next period: March 3 + 31 days = <strong>April 3</strong>. The following two cycles would give fertile windows of April 14–19 and May 15–20.</p>`,
  table: {
    title: 'When is the fertile window for each cycle length?',
    intro: 'Estimated ovulation and fertile days by cycle length, assuming a 14-day luteal phase. Day 1 is the first day of your period.',
    head: ['Cycle length', 'Ovulation (cycle day)', 'Fertile window', 'Most fertile days', 'Next period starts'],
    rows: ({ run }) => [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 38].map(c => {
      const o = run({ cycle: c, luteal: 14, short: NaN, long: NaN }).ovDay;
      return [c + ' days', 'Day ' + o, 'Days ' + (o - 5) + '–' + o, 'Days ' + (o - 2) + '–' + o, 'Day ' + (c + 1)];
    }),
    note: 'Ovulation timing varies from cycle to cycle, so treat these as the center of a wider range rather than exact days.'
  },
  sections: [
    {
      h2: 'How do I calculate my fertile window if my cycles are irregular?',
      html: `<p>Use the range of your cycles instead of an average. The traditional calendar method takes your shortest and longest cycles from the past 6 to 12 months: <strong>shortest − 18</strong> gives the first likely fertile day and <strong>longest − 11</strong> the last. With cycles of 26 to 32 days, that is cycle days 8 to 21. Enter your shortest and longest cycles above to see this range with dates.</p>
<p>Irregularity is common. The U.S. Office on Women's Health counts periods as regular if they usually come every 24 to 38 days, and a prospective NIH study (Wilcox et al., BMJ, 2000) found that only about 30% of women had a fertile window entirely within days 10 to 17. If your cycles swing widely, LH test strips or tracking cervical mucus will pinpoint ovulation better than any calendar.</p>`
    },
    {
      h2: 'How do I calculate my next period, and am I late?',
      html: `<p>Add your average cycle length to the first day of your last period. A period that started on June 4 with a 29-day cycle points to July 3. Cycle lengths naturally shift by a few days, so a period that is two or three days later than predicted is usually not a concern.</p>
<p>If your period is a week or more late, or if you have had unprotected sex since your last period, take a home pregnancy test; most are reliable from the day your period was expected. Stress, illness, travel, weight change, breastfeeding and conditions such as polycystic ovary syndrome can also delay ovulation, which pushes the next period back.</p>`
    },
    {
      h2: 'What are the chances of getting pregnant on each fertile day?',
      html: `<p>In the Wilcox study of 221 women trying to conceive, the probability of conception rose from about <strong>10% for intercourse five days before ovulation to 33% on the day of ovulation</strong>. Nearly all pregnancies came from intercourse during the six days ending on ovulation day; none came from intercourse after it.</p>
<p>That is why the two or three days leading up to and including ovulation are called the most fertile. Having sex every day or every other day through the fertile window covers it without needing to know the exact day.</p>`
    },
    {
      h2: 'Can you use an ovulation calculator to avoid pregnancy?',
      html: `<p>Not on its own. A calendar estimate is the least reliable form of fertility awareness, because ovulation can come early or late in any cycle. ACOG reports that with typical use of fertility awareness-based methods, 12 to 24 out of 100 women become pregnant in the first year.</p>
<p>Structured methods do better than a simple app prediction. The Standard Days method, for people whose cycles are consistently 26 to 32 days, treats days 8 to 19 as fertile; symptothermal methods combine temperature and cervical mucus. If avoiding pregnancy matters, talk to a clinician about the method and backup that suit you.</p>`
    }
  ],
  faq: [
    { q: 'How many days after my period do I ovulate?', a: 'In a 28-day cycle you ovulate around day 14, counted from the first day of your period. If your period lasts 5 days, that is about 9 days after it ends. Longer cycles ovulate later.' },
    { q: 'Can you get pregnant right after your period?', a: 'Yes, especially with short cycles. In a 21-day cycle ovulation is around day 7, so the fertile window starts on about day 2, while bleeding may still be happening.' },
    { q: 'When should I take a pregnancy test?', a: 'Most home tests are reliable from the day your period is due, about 14 days after ovulation. Testing earlier can give a false negative because hCG levels are still low.' },
    { q: 'How accurate are ovulation calculators?', a: 'They give an estimate centered on the average. Research has found that only about 30% of women have their whole fertile window within days 10–17, so LH tests or symptom tracking are more precise.' },
    { q: 'How long does the fertile window last?', a: 'About six days: the five days before ovulation and ovulation day itself. Sperm can live up to about five days in the reproductive tract, while the egg survives for about a day.' },
    { q: 'Can I ovulate twice in one cycle?', a: 'More than one egg can be released, which is how fraternal twins happen, but this occurs within the same short window. You will not have two separate fertile windows weeks apart in one cycle.' },
    { q: 'Does this calculator work with PCOS?', a: 'Less well. With polycystic ovary syndrome ovulation is often irregular or absent, so calendar predictions can be far off. LH tests may also be misleading; a clinician can help confirm ovulation.' }
  ],
  related: ['luteal-phase-calculator', 'conception-calculator', 'due-date-calculator', 'pregnancy-weeks-calculator'],
  sources: [
    { name: 'ACOG: Fertility Awareness-Based Methods of Family Planning', url: 'https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning' },
    { name: 'Office on Women\'s Health (HHS): Your Menstrual Cycle', url: 'https://www.womenshealth.gov/menstrual-cycle/your-menstrual-cycle' },
    { name: 'Wilcox et al. 1995, NEJM: Timing of sexual intercourse in relation to ovulation (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/7477165/' },
    { name: 'Wilcox et al. 2000, BMJ: The timing of the fertile window (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/11082086/' },
    { name: 'StatPearls (NCBI Bookshelf): Physiology, Menstrual Cycle', url: 'https://www.ncbi.nlm.nih.gov/books/NBK500020/' }
  ],
  disclaimer: 'Estimates for family planning awareness, not a method of contraception or a diagnosis. See a clinician about irregular, absent or very painful periods.'
};
