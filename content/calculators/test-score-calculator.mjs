export default {
  slug: 'test-score-calculator',
  hub: 'education',
  name: 'Test Score Calculator',
  title: 'Test Score Calculator: 6 Wrong Out of 40 Is 85% (a B)',
  h1: 'Test Grade Calculator: Percentage and Letter Grade From Wrong Answers',
  meta: 'Missing 6 of 40 questions scores 85%, a B, with each question worth 2.5%. Enter questions or marks and the number wrong to get your percentage and grade.',
  keyword: 'how to calculate percentage for marks',
  also: ['test grade calculator', 'quiz grade calculator', 'how to calculate test score percentage', 'how to calculate raw score', 'how to calculate percent accuracy', 'how to curve grades calculator', 'marks percentage calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'total', label: 'Total questions or points', type: 'number', value: 40 },
    { id: 'kind', label: 'I know the number', type: 'select', value: 'wrong', options: [['wrong', 'wrong (points lost)'], ['right', 'right (points earned)']] },
    { id: 'count', label: 'How many', type: 'number', value: 6 },
    { id: 'scale', label: 'Letter grade scale', type: 'select', value: 'pm', options: [['pm', 'Plus/minus (A 93+, A− 90+, B+ 87+ …)'], ['ten', 'Simple 10-point (A 90+, B 80+, C 70+, D 60+)']] }
  ],
  compute(v, H) {
    var isN = function (x) { return typeof x === 'number' && isFinite(x); };
    if (!(isN(v.total) && v.total > 0)) return { error: 'Enter the total number of questions or points.' };
    if (!(isN(v.count) && v.count >= 0)) return { error: 'Enter how many you got wrong or right.' };
    if (v.count > v.total) return { error: 'That is more than the total.' };
    var T = v.total, right = v.kind === 'right' ? v.count : T - v.count, wrong = T - right;
    var pm = v.scale !== 'ten';
    var cuts = pm ? [[93, 'A'], [90, 'A−'], [87, 'B+'], [83, 'B'], [80, 'B−'], [77, 'C+'], [73, 'C'], [70, 'C−'], [67, 'D+'], [63, 'D'], [60, 'D−'], [0, 'F']] : [[90, 'A'], [80, 'B'], [70, 'C'], [60, 'D'], [0, 'F']];
    var letter = function (p) { for (var i = 0; i < cuts.length; i++) if (p >= cuts[i][0] - 1e-9) return cuts[i]; return cuts[cuts.length - 1]; };
    var pct = right / T * 100, L = letter(pct);
    var rows = [['Letter grade', L[1], true], ['Correct', H.num(right, 2) + ' of ' + H.num(T, 2)], ['Each question or point is worth', H.num(100 / T, 3) + '%']];
    var idx = cuts.indexOf(L);
    if (idx > 0) {
      var nextP = cuts[idx - 1][0], needRight = Math.ceil(nextP / 100 * T - 1e-9);
      rows.push(['Needed for ' + cuts[idx - 1][1] + ' (' + nextP + '%)', H.num(needRight, 2) + ' right (' + H.num(needRight - right, 2) + ' more)']);
    }
    var tbl = [];
    var maxW = Math.min(Math.floor(T), 15);
    for (var w = 0; w <= maxW; w++) { var p = (T - w) / T * 100; tbl.push([String(w), H.num(T - w, 2), H.num(p, 2) + '%', letter(p)[1]]); }
    return { value: H.num(pct, 2) + '%', label: 'Test score (' + L[1] + ')', expr: H.num(right, 2) + ' ÷ ' + H.num(T, 2) + ' × 100', rows: rows, sub: wrong === 0 ? 'A perfect score.' : 'Every question you miss costs ' + H.num(100 / T, 2) + ' percentage points on this test.', table: { head: ['Wrong', 'Right', 'Score', 'Grade'], rows: tbl, caption: 'Score for each number of wrong answers' } };
  },
  quick: ({ r }) => `To calculate a test score percentage, divide the questions (or marks) you got right by the total and multiply by 100. Missing 6 of 40 questions means 34 right: 34 ÷ 40 × 100 = <strong>${r.value}</strong>, a B on the standard U.S. scale. Each question on a 40-question test is worth 2.5%. For marks, 432 out of 500 is 86.4%.`,
  stepsTitle: 'How to calculate a test score percentage',
  steps: [
    'Find the total number of questions, or the total marks if questions are worth different amounts.',
    'Count what you got right, or subtract the number wrong from the total: 40 − 6 = 34.',
    'Divide right by total and multiply by 100: 34 ÷ 40 = 0.85 → 85%.',
    'Match the percentage to your teacher\'s grading scale. The usual mistake is dividing wrong answers by the total (6 ÷ 40 = 15%), which is the percentage you missed, not your score.'
  ],
  formulaTitle: 'What is the formula for test score percentage?',
  formula: {
    expr: 'Score % = right ÷ total × 100 = (total − wrong) ÷ total × 100<br>Points lost per question = 100 ÷ total',
    vars: [['right', 'questions correct or marks earned'], ['total', 'questions on the test or maximum marks'], ['wrong', 'questions missed, including blanks']]
  },
  example: `<p><strong>Points test:</strong> a quiz has 8 multiple-choice questions worth 2 points and 2 short answers worth 7 points, 30 points in all. You lose 2 multiple-choice questions (−4) and 3 points on one short answer (−3), so you earn 23 of 30: 23 ÷ 30 × 100 = <strong>76.67%</strong>, a C, just under the 77% needed for a C+.</p>
<p><strong>Board exam marks:</strong> 78, 85, 92, 88 and 89 out of 100 in five subjects total 432 out of 500: 432 ÷ 500 × 100 = <strong>86.4%</strong>.</p>`,
  table: {
    title: 'What percentage is 1, 2, 3 or 5 wrong?',
    intro: 'Scores for common test lengths when every question is worth the same.',
    head: ['Questions', '1 wrong', '2 wrong', '3 wrong', '5 wrong', '10 wrong'],
    rows: ({ run }) => [10, 15, 20, 25, 30, 40, 50, 60, 75, 100].map(n => [n, ...[1, 2, 3, 5, 10].map(w => run({ total: n, kind: 'wrong', count: w, scale: 'pm' }).value)]),
    note: 'On a 20-question test each miss costs 5 points, so 2 wrong is already an A− (90%). On a 100-question test you can miss 7 and keep an A (93%).'
  },
  sections: [
    {
      h2: 'How do you calculate the percentage of marks across subjects?',
      html: `<p>Add the marks obtained in every subject, add the maximum marks, and divide: total obtained ÷ total maximum × 100. Don't average the subject percentages unless every subject has the same maximum. If one paper is out of 100 and another out of 50, scoring 90 and 30 is 120 ÷ 150 = 80%, while averaging 90% and 60% would wrongly give 75%.</p>
<p>Some boards calculate an aggregate from your best five subjects; drop the lowest one first if that rule applies to you.</p>`
    },
    {
      h2: 'What is a raw score and how is it calculated?',
      html: `<p>A raw score is the number of questions answered correctly (or points earned) before any conversion. A 34 out of 40 is a raw score of 34. Standardized tests then convert raw scores to scaled scores with a table, which is why one wrong answer can cost different amounts on different test dates.</p>
<p>Older tests sometimes subtracted a fraction for each wrong answer to discourage guessing, such as raw = right − wrong ÷ 4 on five-choice questions. AP exams dropped that penalty in 2011 and the current SAT has none, so on those tests a blank and a wrong answer cost the same: guess.</p>`
    },
    {
      h2: 'What is the difference between percent score and percent accuracy?',
      html: `<p>Percent score divides by every question on the test; percent accuracy divides only by the questions you attempted. If you answered 30 of 40 questions and got 27 right, your score is 27 ÷ 40 = 67.5% but your accuracy is 27 ÷ 30 = 90%. Accuracy tells you whether to slow down or speed up: high accuracy with low completion means you ran out of time.</p>`
    },
    {
      h2: 'How do teachers curve test scores?',
      html: `<p>Two common methods. A <strong>flat curve</strong> adds the same points to everyone: if the top score is 88%, adding 12 points makes it 100% and turns an 85% into a 97%. A <strong>proportional curve</strong> divides each score by the top score: 85 ÷ 88 × 100 = 96.6%. Teachers may also bell-curve to a target average, which can lower some grades, so ask which method is used before assuming a curve helps.</p>`
    }
  ],
  faq: [
    { q: 'What is 34 out of 40 as a percentage?', a: '34 out of 40 is 85%: 34 ÷ 40 × 100. That is a B on the plus/minus scale and a B on the simple 10-point scale.' },
    { q: 'What grade is 6 wrong out of 40?', a: '6 wrong out of 40 is 85%, a B. You would need to miss 5 or fewer (87.5%) for a B+, and 4 or fewer (90%) for an A−.' },
    { q: 'How much is each question worth on a 25-question test?', a: 'Each question is worth 4 percentage points (100 ÷ 25), so 3 wrong is 88% and 5 wrong is 80%.' },
    { q: 'What is 432 out of 500 in percentage?', a: '432 out of 500 is 86.4%: 432 ÷ 500 × 100.' },
    { q: 'Do blank answers count as wrong?', a: 'Yes, for your percentage score: an unanswered question earns no points, so it counts against the total just like a wrong answer.' },
    { q: 'What percentage is a passing grade on a test?', a: 'Usually 60% (D−) or 65% depending on the school; for a C, 70% to 73% is typical. Your syllabus sets the exact cutoff.' },
    { q: 'How do I find out how a test affects my class grade?', a: 'Enter the test score as a what-if score in its category in the what-if grade calculator to see the change in your overall grade.' }
  ],
  related: ['grade-calculator', 'final-grade-calculator', 'percentage-calculator', 'gpa-to-percentage-calculator', 'attendance-percentage-calculator'],
  sources: [
    { name: 'Wikipedia: Academic grading in the United States', url: 'https://en.wikipedia.org/wiki/Academic_grading_in_the_United_States' },
    { name: 'College Board AP Central', url: 'https://apcentral.collegeboard.org/' }
  ]
};
