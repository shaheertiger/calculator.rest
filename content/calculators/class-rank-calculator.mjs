export default {
  slug: 'class-rank-calculator',
  hub: 'education',
  name: 'Class Rank Calculator',
  title: 'Class Rank Calculator: 45th of 412 Is the Top 10.92%',
  h1: 'Class Rank Calculator: Turn Your Rank Into a Top % and Percentile',
  meta: 'Ranked 45th in a class of 412? That is the top 10.92% (89th percentile), and the top 10% cutoff is rank 41. Enter your rank and class size to check.',
  keyword: 'how to calculate class rank',
  also: ['how to calculate rank in class', 'how to calculate class rank percentage', 'how to calculate your class rank', 'how do you calculate class rank', 'how to calculate class rank percentile', 'am i in the top 10 percent of my class'],
  updated: '2026-11-13',
  inputs: [
    { id: 'rank', label: 'Your class rank', type: 'number', value: 45, help: '1 = the top of the class.' },
    { id: 'size', label: 'Students in your class', type: 'number', value: 412 },
    { id: 'target', label: 'Check a cutoff: top', type: 'number', value: 10, suffix: '%', help: 'For example 10 for the top 10%, or 6 for UT Austin\'s recent cutoff.' }
  ],
  compute(v, H) {
    if (!(v.size >= 1)) return { error: 'Enter how many students are in your class.' };
    if (!(v.rank >= 1)) return { error: 'Enter your rank (1 is the top of the class).' };
    var size = Math.round(v.size), rank = Math.round(v.rank);
    if (rank > size) return { error: 'Your rank can\'t be larger than the class size.' };
    var top = rank / size * 100, pctile = 100 - top;
    var rows = [
      ['Percentile (share of class ranked below you)', H.num(pctile, 2) + '%', true],
      ['Students ranked ahead of you', H.int(rank - 1)],
      ['Students ranked below you', H.int(size - rank)],
      ['Quartile', rank <= size / 4 ? 'top quarter' : rank <= size / 2 ? 'second quarter' : rank <= size * 3 / 4 ? 'third quarter' : 'bottom quarter'],
      ['Decile', H.ord(Math.max(1, Math.ceil(top / 10 - 1e-9))) + ' (top ' + Math.max(10, Math.ceil(top / 10 - 1e-9) * 10) + '%)']
    ];
    var cut = NaN, sub = '';
    if (v.target > 0 && v.target <= 100) {
      cut = Math.floor(size * v.target / 100 + 1e-9);
      rows.push(['Rank needed for top ' + H.num(v.target, 2) + '%', cut >= 1 ? H.int(cut) + ' or better' : 'no rank qualifies (class too small)']);
      if (cut >= 1) sub = rank <= cut ? 'You are inside the top ' + H.num(v.target, 2) + '%, with ' + H.plural(cut - rank, 'spot') + ' to spare.' : 'You are ' + H.plural(rank - cut, 'spot') + ' outside the top ' + H.num(v.target, 2) + '%, which ends at rank ' + H.int(cut) + '.';
    }
    return { value: 'Top ' + H.num(top, 2) + '%', label: 'Your class rank as a percentage', expr: H.int(rank) + ' ÷ ' + H.int(size) + ' × 100', rows: rows, sub: sub, cut: cut, top: top };
  },
  quick: ({ r, H }) => `To calculate class rank as a percentage, divide your rank by the number of students and multiply by 100. Rank 45 in a class of 412 is 45 ÷ 412 × 100 = ${H.num(r.top, 2)}%, so you are in the <strong>${r.value.replace('Top', 'top')}</strong>, which means you are ahead of 89.08% of your classmates. The top 10% of 412 students ends at rank 41.`,
  stepsTitle: 'How to calculate your class rank percentage',
  steps: [
    'Find your rank and the size of your graduating class on your transcript, report card or student portal. Rank 1 is the highest GPA.',
    'Divide your rank by the class size and multiply by 100. That is your "top %": 45 ÷ 412 × 100 = 10.92%.',
    'Subtract from 100 for your percentile, the share of the class ranked below you: 100 − 10.92 = 89.08.',
    'To check a cutoff such as the top 10%, multiply the class size by 0.10 and round <strong>down</strong>: 412 × 0.10 = 41.2, so ranks 1–41 are in. Rounding up is the usual mistake.'
  ],
  formulaTitle: 'What is the class rank formula?',
  formula: {
    expr: 'Top % = rank ÷ class size × 100<br>Percentile = 100 − top %<br>Top-X% cutoff rank = ⌊class size × X ÷ 100⌋',
    vars: [['rank', 'your position, 1 = highest GPA'], ['class size', 'students in your graduating class'], ['⌊ ⌋', 'round down to a whole student']],
    note: 'Some schools compute percentile as (class size − rank + 1) ÷ class size, which counts you as part of your own group. That version gives 89.32% for 45th of 412, a difference that only matters for very small classes.'
  },
  example: `<p>Jordan is ranked 18th in a senior class of 236.</p>
<p>Top %: 18 ÷ 236 × 100 = <strong>7.63%</strong>. Percentile: 100 − 7.63 = <strong>92.37</strong>.</p>
<p>Top 10% cutoff: 236 × 0.10 = 23.6, rounded down to rank <strong>23</strong>, so Jordan is in with 5 spots to spare. Top 5% ends at rank 11 (236 × 0.05 = 11.8), so Jordan is 7 spots outside it.</p>`,
  table: {
    title: 'What rank is the top 10% in my class?',
    intro: 'The lowest rank that still falls inside each cutoff, by class size (ranks are rounded down to whole students).',
    head: ['Class size', 'Top 5%', 'Top 6%', 'Top 10%', 'Top 25%', 'Top 50%'],
    rows: ({ run, H }) => [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 750, 1000].map(s => [H.int(s), ...[5, 6, 10, 25, 50].map(t => { const c = run({ rank: 1, size: s, target: t }).cut; return c >= 1 ? 'rank ' + H.int(c) : '—'; })])
  },
  sections: [
    {
      h2: 'Am I in the top 10% of my class?',
      html: `<p>You are if your rank is no higher than 10% of the class size, rounded down. In a class of 412, 41.2 rounds down to 41, so rank 41 is in and rank 45 is not, even though 45th "feels" like the top 10%. Your top % (10.92%) tells you the same thing: it must be 10.00% or less.</p>
<p>Schools sometimes round differently or calculate rank at a set point (often the end of junior year or the fall of senior year) for college applications. If you are within a few spots of a cutoff, ask your counselor which semester's rank is reported.</p>`
    },
    {
      h2: 'How is class rank determined?',
      html: `<p>Schools sort every student in the graduating class by GPA, usually the weighted GPA so that honors and AP courses count. The highest GPA is rank 1. Students with identical GPAs typically share a rank, and the next rank skips accordingly (two students tied at 3rd, the next is 5th). Some districts rank on unweighted GPA, leave out transfer or non-core courses, or publish only a decile or quartile instead of an exact number.</p>
<p>Because rank comes from GPA, the fastest way to see where you might move is to rerun your GPA with the <a href="/high-school-gpa-calculator">high school GPA calculator</a> and compare it with the GPA range your school reports for each decile.</p>`
    },
    {
      h2: 'Does class rank matter for college admissions?',
      html: `<p>Less than it used to, with one big exception. Many high schools no longer report rank at all, and colleges instead read your transcript against the school profile. Surveys of admission offices by NACAC consistently rate grades in college-prep courses far above class rank.</p>
<p>The exception is Texas. Under Texas Education Code §51.803, students in the top 10% of their class at a Texas high school are automatically admitted to most Texas public universities. UT Austin is allowed to fill only 75% of its in-state freshman seats this way, so it announces a smaller percentage each year (top 6% for recent entering classes). Some scholarships, valedictorian honors and military academy nominations also use rank.</p>`
    },
    {
      h2: 'How do you calculate class rank percentile?',
      html: `<p>Percentile is the share of the class you rank above: (class size − rank) ÷ class size × 100. Rank 45 of 412 outranks 367 students, and 367 ÷ 412 = 89.08%, so you are in the 89th percentile. Percentile and top % always add to 100, so a student in the top 25% is at the 75th percentile or higher.</p>`
    }
  ],
  faq: [
    { q: 'What percent is 45th out of 412?', a: '45th out of 412 is the top 10.92% of the class: 45 ÷ 412 × 100. That puts you ahead of 89.08% of your classmates, just outside the top 10%, which ends at rank 41.' },
    { q: 'Is a lower class rank better?', a: 'Yes. Rank 1 is the top of the class, so a smaller number is better. A smaller top % is also better: top 5% beats top 15%.' },
    { q: 'What rank is the top 10% of 300 students?', a: 'Rank 30. Ten percent of 300 is exactly 30, so ranks 1 through 30 are in the top 10%.' },
    { q: 'What if my school does not rank students?', a: 'Then leave rank blank on applications. Colleges will use your GPA and the school profile, which often shows the GPA distribution of your class instead.' },
    { q: 'Is class rank based on weighted or unweighted GPA?', a: 'Usually weighted, so honors and AP classes count toward rank. Your school\'s student handbook or profile states which GPA it uses.' },
    { q: 'How often does class rank change?', a: 'Most schools recalculate rank at the end of each semester when new grades post, so it can move after every grading period, especially earlier in high school.' }
  ],
  related: ['high-school-gpa-calculator', 'gpa-calculator', 'psat-score-calculator', 'percentage-calculator', 'z-score-calculator'],
  sources: [
    { name: 'Texas Education Code, Chapter 51 (§51.803 automatic admission)', url: 'https://statutes.capitol.texas.gov/Docs/ED/htm/ED.51.htm' },
    { name: 'NACAC: National Association for College Admission Counseling', url: 'https://www.nacacnet.org/' }
  ]
};
