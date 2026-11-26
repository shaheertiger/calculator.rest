export default {
  slug: 'grade-calculator',
  hub: 'education',
  name: 'What If Grade Calculator',
  title: 'What If Grade Calculator: One 90 Lifts 83.75% to 85.75%',
  h1: 'What-If Grade Calculator for Weighted Class Categories',
  meta: 'See how one new score changes a weighted class grade. A 90 on a third test moves an 83.75% to 85.75%. Enter category weights, averages and a what-if score.',
  keyword: 'what if grade calculator',
  also: ['what if calculator', 'weighted grade calculator', 'grade calculator', 'class grade calculator', 'how to calculate weighted grades', 'how will this grade affect my grade'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'cats', label: 'Grade categories from your syllabus', type: 'rows', addLabel: '+ add category', max: 15,
      fields: [
        { id: 'name', label: 'Category', type: 'text', value: '', blank: true, placeholder: 'e.g. Labs' },
        { id: 'weight', label: 'Weight %', type: 'number', value: 10 },
        { id: 'avg', label: 'Current avg %', type: 'number', value: '', blank: true, placeholder: 'blank = none yet' },
        { id: 'count', label: 'Items graded', type: 'number', value: 1 },
        { id: 'whatif', label: 'What-if score %', type: 'number', value: '', blank: true, placeholder: 'optional' }
      ],
      value: [
        { name: 'Homework', weight: 20, avg: 95, count: 10, whatif: '' },
        { name: 'Quizzes', weight: 20, avg: 84, count: 5, whatif: '' },
        { name: 'Tests', weight: 40, avg: 78, count: 2, whatif: 90 },
        { name: 'Final exam', weight: 20, avg: '', count: 0, whatif: '' }
      ],
      help: 'A what-if score is added to that category as one more graded item. Leave the current average blank for categories with nothing graded yet.'
    }
  ],
  compute(v, H) {
    var isN = function (x) { return typeof x === 'number' && isFinite(x); };
    var letter = function (g) { return g >= 93 ? 'A' : g >= 90 ? 'A−' : g >= 87 ? 'B+' : g >= 83 ? 'B' : g >= 80 ? 'B−' : g >= 77 ? 'C+' : g >= 73 ? 'C' : g >= 70 ? 'C−' : g >= 67 ? 'D+' : g >= 63 ? 'D' : g >= 60 ? 'D−' : 'F'; };
    var cats = (v.cats || []).filter(function (c) { return isN(c.weight) && c.weight > 0; });
    if (!cats.length) return { error: 'Add at least one category with a weight.' };
    var wAll = 0, wNow = 0, sNow = 0, wNew = 0, sNew = 0, anyWhatIf = false, tbl = [];
    cats.forEach(function (c, i) {
      var label = c.name ? H.esc(c.name) : 'Category ' + (i + 1);
      var has = isN(c.avg) && c.avg >= 0, n = isN(c.count) && c.count >= 0 ? c.count : 1, wi = isN(c.whatif) && c.whatif >= 0;
      wAll += c.weight;
      if (has) { wNow += c.weight; sNow += c.weight * c.avg; }
      var after = has ? c.avg : NaN;
      if (wi) {
        anyWhatIf = true;
        after = has && n > 0 ? (c.avg * n + c.whatif) / (n + 1) : c.whatif;
      }
      if (isN(after) && after >= 0) { wNew += c.weight; sNew += c.weight * after; }
      tbl.push([label, H.num(c.weight, 2) + '%', has ? H.num(c.avg, 2) + '%' : '—', isN(after) ? H.num(after, 2) + '%' : '—']);
    });
    if (!wNow && !wNew) return { error: 'Enter a current average or a what-if score for at least one category.' };
    var cur = wNow ? sNow / wNow : NaN, nw = wNew ? sNew / wNew : NaN;
    var rows = [];
    rows.push(['Current grade', wNow ? H.fix(cur, 2) + '% (' + letter(cur) + ')' : 'nothing graded yet']);
    if (anyWhatIf && wNow) rows.push(['Change', (nw - cur >= 0 ? '+' : '−') + H.fix(Math.abs(nw - cur), 2) + ' points', true]);
    rows.push(['Weight graded so far', H.num(anyWhatIf ? wNew : wNow, 2) + '% of ' + H.num(wAll, 2) + '%']);
    if (Math.abs(wAll - 100) > 0.01) rows.push(['Note', 'weights add to ' + H.num(wAll, 2) + '%, so each is scaled to the total']);
    var g = anyWhatIf ? nw : cur;
    return {
      value: H.fix(g, 2) + '%',
      label: anyWhatIf ? 'Grade with your what-if score (' + letter(g) + ')' : 'Current weighted grade (' + letter(g) + ')',
      expr: 'Σ(weight × average) ÷ ' + H.num(anyWhatIf ? wNew : wNow, 2) + '% graded',
      rows: rows,
      sub: (anyWhatIf ? wNew : wNow) < wAll - 0.01 ? 'Categories with nothing graded are left out until they have a score, so this is your grade on the work done so far.' : 'Every category has a score, so this is your full course grade.',
      table: { head: ['Category', 'Weight', 'Now', 'After what-if'], rows: tbl },
      grade: g, cur: cur
    };
  },
  quick: ({ r }) => `A what-if grade adds one hypothetical score to its category, recomputes that category's average, then reweights the class. With homework 95% (20%), quizzes 84% (20%) and two tests averaging 78% (40%), the current grade is 83.75%. A 90 on a third test raises the test average to 82% and the class grade to <strong>${r.value}</strong>.`,
  stepsTitle: 'How to use the what-if grade calculator',
  steps: [
    'Copy the grading categories and weights from your syllabus, for example homework 20%, quizzes 20%, tests 40% and final 20%.',
    'Enter your current average in each category and how many items have been graded. Leave the average blank for anything not graded yet, such as the final.',
    'Type a what-if score in the category you want to test. It is added as one more item, so a 90 on a third test is averaged with your first two tests.',
    'Read the new grade and the change. The step people get wrong: treating a single test as if it replaced the whole category. One new score only moves the category average by its share of the items.'
  ],
  formulaTitle: 'How do you calculate a weighted grade?',
  formula: {
    expr: 'Grade = Σ (weight × category average) ÷ Σ weights of graded categories<br>New category average = (old average × n + what-if score) ÷ (n + 1)',
    vars: [['weight', 'the category\'s share of the grade from the syllabus'], ['category average', 'your average score in that category, %'], ['n', 'number of items already graded in the category']],
    note: 'Dividing by the graded weights (instead of 100) is how most online gradebooks show a running grade before every category has scores.'
  },
  example: `<p>Homework is 20% (95% average), quizzes 20% (84%), tests 40% (78% over 2 tests), and a 20% final has not happened yet.</p>
<p>Current grade: (20 × 95 + 20 × 84 + 40 × 78) ÷ 80 = (1,900 + 1,680 + 3,120) ÷ 80 = 6,700 ÷ 80 = <strong>83.75%</strong>.</p>
<p>What if the next test is a 90? Test average: (78 × 2 + 90) ÷ 3 = <strong>82%</strong>. New grade: (1,900 + 1,680 + 40 × 82) ÷ 80 = 6,860 ÷ 80 = <strong>85.75%</strong>, up 2 points but still a B (a B+ starts at 87%).</p>
<p>Adding a 92 on the final then gives (6,860 + 20 × 92) ÷ 100 = <strong>87%</strong>, a B+.</p>`,
  table: {
    title: 'How much will one test score change my grade?',
    intro: 'The example class above (83.75% now, 2 tests graded, tests worth 40%), with different scores on the third test.',
    head: ['Next test score', 'New test average', 'New class grade', 'Change'],
    rows: ({ run, v, H }) => [100, 95, 90, 85, 80, 75, 70, 60, 50, 0].map(s => {
      const cats = v.cats.map(c => ({ ...c, whatif: c.name === 'Tests' ? s : NaN }));
      const r = run({ cats });
      return [s + '%', H.num((78 * 2 + s) / 3, 2) + '%', r.value, (r.grade - r.cur >= 0 ? '+' : '−') + H.fix(Math.abs(r.grade - r.cur), 2)];
    }),
    note: 'Each test point is worth 40% ÷ 3 tests ÷ 80% graded ≈ 0.17 class points here. The fewer items in a category, the more each new score moves it.'
  },
  sections: [
    {
      h2: 'How will one grade affect my overall grade?',
      html: `<p>Its effect is the category weight divided by the number of items in that category, scaled by how much of the course has been graded. In the example, a new test is one of three tests in a 40% category with 80% of the course graded, so each test point moves the class grade by 0.4 ÷ 3 ÷ 0.8 ≈ 0.17 points. A homework assignment, one of eleven in a 20% category, moves it by only 0.02 points per point.</p>
<p>That is why one bad test early in the term hurts more than one late in the term: with only one or two scores in the category, each one carries a big share.</p>`
    },
    {
      h2: 'What if my category weights don\'t add up to 100%?',
      html: `<p>The calculator divides by the total weight you entered, so weights of 30, 30 and 20 (80 total) are treated as 37.5%, 37.5% and 25%. That matches how gradebooks handle categories with no scores yet. If your syllabus truly adds to more or less than 100% (extra credit categories, for example), enter the weights exactly as written and check the "weights add to" note.</p>`
    },
    {
      h2: 'How do points-based classes work instead of weighted categories?',
      html: `<p>In a total-points class, every point counts the same and your grade is simply points earned ÷ points possible. A 50-point quiz matters half as much as a 100-point test. To use this calculator for a points class, make one category with weight 100, enter your current percentage, and set "items graded" to your points possible divided by the new assignment's points. For a quick percent on a single test or quiz, the <a href="/test-score-calculator">test score calculator</a> is faster.</p>`
    },
    {
      h2: 'What score do I need on my next assignment to get an A?',
      html: `<p>Try what-if scores until the grade crosses your target, or work it backwards. In the example, reaching 87% (B+) on the 80% graded so far needs a test average of (87 × 80 − 1,900 − 1,680) ÷ 40 = 84.5%, which means (84.5 × 3 − 156) = 97.5 on the third test. If the remaining piece is a final exam with a known weight, the <a href="/final-grade-calculator">final grade calculator</a> solves for the exact score in one step.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my grade with weighted categories?', a: 'Multiply each category average by its weight, add the results, and divide by the total weight of the categories that have grades. Homework 95% at 20%, quizzes 84% at 20% and tests 78% at 40% gives 6,700 ÷ 80 = 83.75%.' },
    { q: 'Does a zero hurt my grade a lot?', a: 'Yes, especially in small categories. A 0 on the third test in the example drops the test average from 78% to 52% and the class grade from 83.75% to 70.75%.' },
    { q: 'Why is my grade different from the online gradebook?', a: 'Your teacher may drop the lowest score, weight items inside a category by points, or count missing work as zero. Enter category averages exactly as the gradebook shows them to match it.' },
    { q: 'Can I test more than one what-if score at a time?', a: 'Yes. Put a what-if score in as many categories as you like; each is added to its own category before the class grade is reweighted.' },
    { q: 'What letter grade is an 85.75%?', a: 'On the standard U.S. scale, 85.75% is a B (83–86%). An 87% would be a B+ and a 90% an A−.' },
    { q: 'How do I calculate my grade if a category is not graded yet?', a: 'Leave it out. Divide by the weights of only the graded categories, which is what this calculator does when you leave a category average blank.' }
  ],
  related: ['final-grade-calculator', 'test-score-calculator', 'gpa-calculator', 'high-school-gpa-calculator', 'weighted-average-calculator'],
  sources: [
    { name: 'Wikipedia: Weighted arithmetic mean', url: 'https://en.wikipedia.org/wiki/Weighted_arithmetic_mean' },
    { name: 'Wikipedia: Grading in education', url: 'https://en.wikipedia.org/wiki/Grading_in_education' }
  ]
};
