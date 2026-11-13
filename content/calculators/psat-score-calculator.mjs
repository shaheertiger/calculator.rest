export default {
  slug: 'psat-score-calculator',
  hub: 'education',
  name: 'PSAT Selection Index Calculator',
  title: 'PSAT Selection Index Calculator: 700 RW + 690 Math = 209',
  h1: 'National Merit Selection Index Calculator for the PSAT/NMSQT',
  meta: 'A 700 Reading and Writing and 690 Math PSAT (1390) is a 209 National Merit Selection Index. Enter your section scores and your state cutoff to compare.',
  keyword: 'how to calculate psat score for national merit',
  also: ['how to calculate psat score', 'how to calculate your psat score', 'how to calculate psat index', 'how to calculate nmsqt score', 'how to calculate national merit score', 'psat selection index calculator', 'national merit cutoff calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'rw', label: 'Reading and Writing score', type: 'number', value: 700, help: '160 to 760, in steps of 10.' },
    { id: 'math', label: 'Math score', type: 'number', value: 690, help: '160 to 760, in steps of 10.' },
    { id: 'cut', label: 'Your state\'s Semifinalist cutoff', type: 'number', value: '', placeholder: 'optional, e.g. 216', help: 'Use the most recent cutoff for your state as an estimate; NMSC sets new ones each year.' }
  ],
  compute(v, H) {
    var isN = function (x) { return typeof x === 'number' && isFinite(x); };
    if (!(isN(v.rw) && v.rw >= 160 && v.rw <= 760)) return { error: 'Enter a Reading and Writing score from 160 to 760.' };
    if (!(isN(v.math) && v.math >= 160 && v.math <= 760)) return { error: 'Enter a Math score from 160 to 760.' };
    var si = (2 * v.rw + v.math) / 10;
    var rows = [
      ['Total PSAT/NMSQT score', H.int(v.rw + v.math) + ' of 1,520', true],
      ['From Reading and Writing (× 2)', H.num(2 * v.rw / 10, 1)],
      ['From Math', H.num(v.math / 10, 1)],
      ['Points below the 228 maximum', H.num(228 - si, 1)]
    ];
    var sub = 'Each extra 10 points in Reading and Writing adds 2 to the index; each extra 10 in Math adds 1.';
    if (isN(v.cut) && v.cut >= 48 && v.cut <= 228) {
      var d = si - v.cut;
      rows.push(['Compared with a ' + H.num(v.cut, 0) + ' cutoff', d >= 0 ? H.num(d, 1) + ' at or above' : H.num(-d, 1) + ' below']);
      sub = d >= 0 ? 'At or above that cutoff, which would qualify for Semifinalist status if your state\'s cutoff stays there.' : 'Below that cutoff by ' + H.num(-d, 1) + ': about ' + H.int(Math.ceil(-d / 2)) + '0 more Reading and Writing points, or ' + H.int(Math.ceil(-d)) + '0 more Math points.';
    }
    return { value: H.num(si, 1), label: 'NMSC Selection Index', expr: '(2 × ' + H.int(v.rw) + ' + ' + H.int(v.math) + ') ÷ 10', rows: rows, sub: sub };
  },
  quick: ({ r }) => `The National Merit Selection Index is (2 × Reading and Writing + Math) ÷ 10. A 700 Reading and Writing and 690 Math score (1390 total) gives (1,400 + 690) ÷ 10 = <strong>${r.value}</strong>. The index runs from 48 to 228, and Reading and Writing counts double. Semifinalist cutoffs are set state by state each year.`,
  stepsTitle: 'How to calculate your PSAT Selection Index',
  steps: [
    'Find your two section scores on the PSAT/NMSQT score report: Reading and Writing and Math, each from 160 to 760.',
    'Double the Reading and Writing score: 700 × 2 = 1,400.',
    'Add the Math score and divide by 10: (1,400 + 690) ÷ 10 = 209. The same number is printed on your score report as the NMSC Selection Index.',
    'Compare it with your state\'s most recent Semifinalist cutoff. The common mistake is comparing your 1520-scale total score, or a national percentile, with the cutoff; only the Selection Index counts.'
  ],
  formulaTitle: 'What is the PSAT Selection Index formula?',
  formula: {
    expr: 'Selection Index = (2 × RW + Math) ÷ 10<br>Range: (2 × 160 + 160) ÷ 10 = 48 to (2 × 760 + 760) ÷ 10 = 228',
    vars: [['RW', 'Reading and Writing section score, 160–760'], ['Math', 'Math section score, 160–760']],
    note: 'Reading and Writing is doubled because the old paper PSAT had two verbal tests (Reading, Writing and Language) and one Math test, and NMSC kept the same balance and range when the test went digital in 2023.'
  },
  example: `<p>A junior scores 720 in Reading and Writing and 740 in Math, a 1460 total.</p>
<p>Selection Index = (2 × 720 + 740) ÷ 10 = (1,440 + 740) ÷ 10 = <strong>218</strong>.</p>
<p>A classmate with the same 1460 total but the scores flipped (740 RW, 720 Math) gets (1,480 + 720) ÷ 10 = <strong>220</strong>. Same total, two index points higher, because verbal points count twice.</p>`,
  table: {
    title: 'What Selection Index do different PSAT scores give?',
    intro: 'Selection Index by Reading and Writing score (rows) and Math score (columns).',
    head: ['RW \\ Math', '760', '720', '680', '640', '600'],
    rows: ({ run }) => [760, 740, 720, 700, 680, 660, 640, 620, 600].map(rw => [rw, ...[760, 720, 680, 640, 600].map(m => run({ rw, math: m, cut: NaN }).value)]),
    note: 'Moving across a row (40 Math points) changes the index by 4; moving down a row (20 RW points) changes it by 4 as well.'
  },
  sections: [
    {
      h2: 'What PSAT score do you need for National Merit?',
      html: `<p>It depends on your state and your year. Of the roughly 1.3 million juniors who enter the competition each year, about 50,000 high scorers are recognized. About 34,000 become Commended Students, based on a single nationwide Selection Index cutoff, and about 16,000 become Semifinalists. Semifinalists are allocated to each state in proportion to its share of graduating seniors, so the cutoff is the index that fills that state's quota.</p>
<p>That makes cutoffs higher in states with many high scorers. In recent years, state Semifinalist cutoffs have run from about 207 in the lowest states to about 223 or 224 in the highest, such as New Jersey and Washington, D.C. NMSC announces each class's cutoffs in September of senior year, so juniors can only compare against last year's numbers.</p>`
    },
    {
      h2: 'Which PSAT counts for National Merit?',
      html: `<p>Only the PSAT/NMSQT taken in the fall of 11th grade enters you in the National Merit Scholarship Program (students finishing high school early can enter in their next-to-last year). The PSAT 8/9, the PSAT 10 and a 9th- or 10th-grade PSAT/NMSQT are practice for National Merit purposes. You must also meet NMSC's citizenship and enrollment requirements. Students who miss the October test because of illness or an emergency can ask NMSC about Alternate Entry using SAT scores.</p>`
    },
    {
      h2: 'How was the Selection Index calculated on the old PSAT?',
      html: `<p>On the paper PSAT/NMSQT (2015 through 2022), the score report included three test scores from 8 to 38: Reading, Writing and Language, and Math. The index was 2 × (Reading + Writing + Math). A student with 35, 34 and 33 scored 2 × 102 = 204. The digital formula produces the same 48–228 range, so cutoffs from both eras can be compared roughly, though NMSC treats each year separately.</p>`
    },
    {
      h2: 'How do I raise my Selection Index the fastest?',
      html: `<p>Prioritize Reading and Writing: every 10 points there is worth 2 index points, twice what Math gives. A student at 680 RW and 740 Math (index 210) needs 3 more points for a 213 cutoff. That is 20 more RW points (gaining 4) or 30 more Math points. Because the digital PSAT/NMSQT is adaptive, a strong first module in each section unlocks a harder second module where the top scores are available, so early accuracy matters most.</p>`
    }
  ],
  faq: [
    { q: 'Is 209 a good PSAT Selection Index?', a: 'Yes. A 209 is in the range that has earned Commended Student recognition in recent years and is close to Semifinalist cutoffs in the lowest-cutoff states, though most states have needed a higher index.' },
    { q: 'What is the highest possible Selection Index?', a: '228, from a perfect 760 in both Reading and Writing and Math: (2 × 760 + 760) ÷ 10.' },
    { q: 'Is a 1400 PSAT score good enough for National Merit?', a: 'It depends on the split. A 1400 with 720 Reading and Writing and 680 Math is a 212 index; with 680 RW and 720 Math it is only 208.' },
    { q: 'Does the PSAT 10 count for National Merit?', a: 'No. Only the PSAT/NMSQT taken in the fall of junior year enters you in the competition. The PSAT 10 uses the same scale but is practice only.' },
    { q: 'When are National Merit Semifinalists announced?', a: 'NMSC notifies schools and announces Semifinalists and Commended Students in September of senior year, about 11 months after the October test.' },
    { q: 'Why does my score report show a different Selection Index?', a: 'Double-check the section scores you entered. The report uses the same formula, so a mismatch usually means a typo; if not, contact the College Board about your report.' },
    { q: 'Does the Selection Index affect college admissions?', a: 'Not directly. Colleges see SAT or ACT scores, not your PSAT. But Semifinalist and Finalist status can lead to scholarships, including merit awards some colleges give to National Merit Finalists.' }
  ],
  related: ['class-rank-calculator', 'high-school-gpa-calculator', 'test-score-calculator', 'graduation-year-calculator'],
  sources: [
    { name: 'National Merit Scholarship Corporation (NMSC)', url: 'https://www.nationalmerit.org/' },
    { name: 'College Board: PSAT/NMSQT', url: 'https://satsuite.collegeboard.org/psat-nmsqt' }
  ]
};
