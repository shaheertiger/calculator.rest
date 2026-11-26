export default {
  slug: 'grade-calculator',
  hub: 'school',
  name: 'Grade Calculator',
  title: 'Grade Calculator: Weighted Grade 15/20/65 = 84% (Steps)',
  meta: 'Homework 91 at 15%, quizzes 85 at 20% and exams 82 at 65% make an 84% course grade: 13.65 + 17 + 53.3 = 83.95. Weighted or point-system grades, with steps.',
  keyword: 'grade calculator',
  also: ['school grades calculator', 'point system grade calculator', 'weighted grade calculator', 'calculate his final course percentage', 'using the averages and the weights calculate'],
  updated: '2026-11-26',
  answer: ({ r }) => `Weights of 15%, 20% and 65% on averages of 91, 85 and 82 give a course grade of <strong>${r.value}</strong>: 13.65 + 17 + 53.3 = 83.95.`,
  inputs: [
    { id: 'mode', label: 'My class grades by', type: 'select', value: 'weighted', wide: true, options: [['weighted', 'Weighted categories (homework 15%, exams 65% …)'], ['points', 'Total points (point system)']] },
    {
      id: 'cats', label: 'Categories from your syllabus', type: 'rows', addLabel: '+ add category', max: 10, showIf: { mode: ['weighted'] },
      fields: [
        { id: 'name', label: 'Category', type: 'text', value: '', blank: true, placeholder: 'e.g. Labs' },
        { id: 'weight', label: 'Weight %', type: 'number', value: 10 },
        { id: 'avg', label: 'Your average %', type: 'number', value: '', blank: true }
      ],
      value: [
        { name: 'Homework', weight: 15, avg: 91 },
        { name: 'Quizzes', weight: 20, avg: 85 },
        { name: 'Exams', weight: 65, avg: 82 }
      ],
      help: 'Leave the average blank for a category with nothing graded yet; it is left out and the other weights are scaled up.'
    },
    {
      id: 'items', label: 'Graded work', type: 'rows', addLabel: '+ add assignment', max: 10, showIf: { mode: ['points'] },
      fields: [
        { id: 'name', label: 'Assignment', type: 'text', value: '', blank: true, placeholder: 'e.g. Quiz 2' },
        { id: 'earned', label: 'Points earned', type: 'number', value: '', blank: true },
        { id: 'possible', label: 'Points possible', type: 'number', value: 100 }
      ],
      value: [
        { name: 'Homework', earned: 182, possible: 200 },
        { name: 'Quiz 1', earned: 46, possible: 50 },
        { name: 'Test 1', earned: 88, possible: 100 }
      ]
    },
    { id: 'dp', label: 'Round the grade to', type: 'select', value: '0', options: [['0', 'the nearest whole number'], ['1', '1 decimal place'], ['2', '2 decimal places']] }
  ],
  compute(v, H) {
    var ok = function (x) { return typeof x === 'number' && isFinite(x); };
    var f = function (x) { return H.num(x, 6); };
    var dp = Number(v.dp); if (!(dp >= 0)) dp = 0;
    var ruleName = dp === 0 ? 'the nearest whole number' : dp + ' decimal place' + (dp === 1 ? '' : 's');
    var finish = function (g, lead) {
      var r = H.round(g, dp), exact = Math.abs(r - g) < 1e-9;
      return { r: r, line: '<b>Answer:</b> ' + lead + ' ' + H.num(r, dp) + '% (' + (exact ? 'exact, no rounding needed' : H.num(g, 4) + '% rounded to ' + ruleName) + ').' };
    };
    if (v.mode === 'points') {
      var it = (v.items || []).filter(function (x) { return ok(x.earned) && ok(x.possible) && x.possible > 0; });
      if (!it.length) return { error: 'Enter points earned and points possible for at least one assignment.' };
      var E = 0, P = 0;
      it.forEach(function (x) { E += x.earned; P += x.possible; });
      var gp = E / P * 100, endP = finish(gp, 'your grade is');
      return {
        value: H.num(endP.r, dp) + '%', label: 'Grade from total points', expr: f(E) + ' ÷ ' + f(P) + ' × 100',
        steps: [
          '<b>Formula:</b> Grade = (total points earned ÷ total points possible) × 100',
          '<b>Add the points earned:</b> ' + it.map(function (x) { return f(x.earned); }).join(' + ') + ' = ' + f(E),
          '<b>Add the points possible:</b> ' + it.map(function (x) { return f(x.possible); }).join(' + ') + ' = ' + f(P),
          '<b>Divide:</b> ' + f(E) + ' ÷ ' + f(P) + ' = ' + f(E / P),
          '<b>Multiply by 100:</b> ' + f(E / P) + ' × 100 = ' + H.num(gp, 4) + '%',
          endP.line
        ]
      };
    }
    var cats = (v.cats || []).filter(function (c) { return ok(c.weight) && c.weight > 0 && ok(c.avg) && c.avg >= 0; });
    if (!cats.length) return { error: 'Enter a weight and your average for at least one category.' };
    var W = 0, S = 0, lines = [];
    cats.forEach(function (c, i) {
      var nm = c.name ? H.esc(c.name) : 'Category ' + (i + 1), d = c.weight / 100, p = d * c.avg;
      W += d; S += p;
      lines.push('<b>' + nm + ':</b> ' + f(d) + ' × ' + f(c.avg) + ' = ' + f(p));
    });
    var full = Math.abs(W - 1) < 1e-9, g = S / W;
    var steps = ['<b>Formula:</b> Grade = (w₁ × s₁ + w₂ × s₂ + …) ÷ (w₁ + w₂ + …), with each weight w as a decimal',
      '<b>Substitute:</b> Grade = (' + cats.map(function (c) { return f(c.weight / 100) + ' × ' + f(c.avg); }).join(' + ') + ') ÷ ' + f(W)].concat(lines);
    steps.push('<b>Add the products:</b> ' + cats.map(function (c) { return f(c.weight / 100 * c.avg); }).join(' + ') + ' = ' + f(S));
    var wsum = cats.map(function (c) { return f(c.weight / 100); }).join(' + ') + ' = ' + f(W);
    if (full) steps.push('<b>Check the weights:</b> ' + wsum + ' (100%), so dividing by the total weight changes nothing: the grade is ' + f(g));
    else steps.push('<b>Divide by the total weight:</b> ' + wsum + ', not 1, so ' + f(S) + ' ÷ ' + f(W) + ' = ' + H.num(g, 6));
    var end = finish(g, full ? 'the course grade is' : 'the grade so far is');
    steps.push(end.line);
    return {
      value: H.num(end.r, dp) + '%', label: full ? 'Weighted course grade' : 'Weighted grade on ' + H.num(W * 100, 2) + '% of the course',
      expr: f(S) + ' ÷ ' + f(W), steps: steps
    };
  },
  facts: {
    formula: 'Weighted: Grade = Σ(w × s) ÷ Σw<br>Point system: Grade = (points earned ÷ points possible) × 100',
    vars: [['w', 'a category\'s weight as a decimal: 15% = 0.15'], ['s', 'your average in that category, as a percent'], ['Σ', 'add up over every category that has a score']],
    rounding: 'multiply and add at full precision and round only the final grade, to the nearest whole number unless your teacher says otherwise.',
    note: 'Which percent counts as an A or a B is set by your school. Look up your own grading scale before turning 84% into a letter.'
  },
  example: {
    h2: 'Worked example: a grade before the final exam',
    html: `<p><strong>Problem:</strong> Sam's syllabus weights labs 20%, quizzes 15%, the midterm 25% and the final exam 40%. Sam has a lab average of 88, a quiz average of 76 and a midterm score of 81. The final has not happened yet. What is Sam's grade right now?</p>
<p><strong>1.</strong> Multiply each weight by its score: 0.20 × 88 = 17.6, 0.15 × 76 = 11.4 and 0.25 × 81 = 20.25.</p>
<p><strong>2.</strong> Add the products: 17.6 + 11.4 + 20.25 = 49.25.</p>
<p><strong>3.</strong> Only 0.20 + 0.15 + 0.25 = 0.60 of the course has been graded, so divide by 0.60: 49.25 ÷ 0.60 = 82.0833.</p>
<p><strong>Answer:</strong> Sam's current grade is 82%. Sense check: it sits between the lowest score (76) and the highest (88), pulled toward 81 and 88 because the midterm and labs carry more weight than quizzes. To see what the final must be, use the final grade calculator.</p>`
  },
  variants: [
    {
      h2: 'Will earned the following grades in his math class. Using the averages and the weights, calculate his final course percentage',
      html: `<p>Will's final course percentage is <strong>84%</strong>. Turn each weight into a decimal, multiply it by the matching average and add the three products:</p>
<div class="twrap"><table><thead><tr><th>Category</th><th>Weight</th><th>Earned average</th><th>Weight × average</th></tr></thead><tbody>
<tr><td>Homework</td><td>15%</td><td>91</td><td>0.15 × 91 = 13.65</td></tr><tr><td>Quizzes</td><td>20%</td><td>85</td><td>0.20 × 85 = 17</td></tr><tr><td>Exams</td><td>65%</td><td>82</td><td>0.65 × 82 = 53.3</td></tr>
</tbody></table></div>
<p>13.65 + 17 + 53.3 = 83.95, and 83.95 rounded to the nearest whole number is 84. The weights add to 100%, so no further division is needed.</p>`
    },
    {
      h2: 'How does a point system grade calculator work?',
      html: `<p>In a points-based class every assignment adds to one running total, so the grade is all points earned divided by all points possible. With 182/200 on homework, 46/50 on a quiz and 88/100 on a test, the totals are 316 and 350: 316 ÷ 350 × 100 = <strong>90.29%</strong>, or 90% rounded. Bigger assignments matter more automatically because they carry more points. Pick "total points" above to enter your own.</p>`
    },
    {
      h2: 'How much does one category move my grade?',
      html: `<p>Each point in a category moves the course grade by that category's weight. For Will, exams are 0.65 of the grade, so raising the exam average from 82 to 90 adds 0.65 × 8 = 5.2 points: 83.95 + 5.2 = 89.15. The same 8 points in homework adds only 0.15 × 8 = 1.2. Study time spent on the heaviest category pays off most.</p>`
    }
  ],
  mistakes: [
    '<strong>Ignoring the weights.</strong> Averaging 91, 85 and 82 gives (91 + 85 + 82) ÷ 3 = 86, two points too high, because exams count for 65% of Will\'s grade, not a third.',
    '<strong>Forgetting the decimal.</strong> Multiplying by 15, 20 and 65 gives 8,395. That is the right answer times 100: divide by 100 (or use 0.15, 0.20, 0.65) to get 83.95.',
    '<strong>Not dividing when weights fall short of 100%.</strong> Before the final, the graded weights might add to only 60%. Divide by 0.60, or the grade looks far lower than it is.',
    '<strong>Rounding each product.</strong> Rounding 13.65 to 14 and 53.3 to 53 gives 84 here by luck, but it can push a borderline grade the wrong way. Round once, at the end.'
  ],
  related: ['final-grade-calculator', 'test-score-calculator', 'gpa-calculator', 'average-calculator', 'percentage-calculator'],
  faq: [
    { q: 'How do I calculate my grade with weighted categories?', a: 'Multiply each category average by its weight as a decimal, add the results, and divide by the sum of the weights you used. If every category has a score and the weights total 100%, that last division is by 1.' },
    { q: 'What letter grade is 84%?', a: 'On a common 10-point scale 84% is a B, and on a common plus/minus scale, where a B runs from 83% to just under 87%, it is also a B. Schools set their own cutoffs, so check your syllabus.' },
    { q: 'Does this work as a school grades calculator for middle and high school?', a: 'Yes. Any class that lists category weights or totals points uses one of the two methods here, from elementary school through college.' },
    { q: 'Why is my online gradebook different from my own math?', a: 'Gradebooks may drop the lowest quiz, count missing work as 0 or round differently. Enter exactly what the gradebook counts and the results will match.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Weighted Mean', url: 'https://mathworld.wolfram.com/WeightedMean.html' }
  ]
};
