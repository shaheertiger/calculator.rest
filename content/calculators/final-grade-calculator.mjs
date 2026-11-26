export default {
  slug: 'final-grade-calculator',
  hub: 'school',
  name: 'Final Grade Calculator',
  title: 'Final Grade Calculator: What Do I Need on the Final? (90%)',
  meta: 'With an 88% and a final worth 25%, you need 96% on the final to end with a 90%: (90 − 88 × 0.75) ÷ 0.25. Enter your numbers and see each step.',
  keyword: 'final grade calculator',
  also: ['what do i need on my final', 'final exam calculator', 'what do i need on the final to get a 90', 'grade needed on final exam'],
  updated: '2026-11-26',
  answer: ({ r }) => `With an 88% in the class and a final worth 25%, you need <strong>${r.value}</strong> on the final to finish with a 90%.`,
  inputs: [
    { id: 'mode', label: 'I want to find', type: 'select', value: 'need', wide: true, options: [['need', 'The score I need on the final'], ['result', 'My class grade after the final']] },
    { id: 'current', label: 'Grade before the final', type: 'number', value: 88, suffix: '%' },
    { id: 'weight', label: 'The final is worth', type: 'number', value: 25, suffix: '% of the grade' },
    { id: 'target', label: 'Class grade I want', type: 'number', value: 90, suffix: '%', showIf: { mode: ['need'] } },
    { id: 'exam', label: 'Score on the final', type: 'number', value: 85, suffix: '%', showIf: { mode: ['result'] } }
  ],
  compute(v, H) {
    if (!(v.current >= 0)) return { error: 'Enter your grade before the final, as a percent.' };
    if (!(v.weight > 0 && v.weight < 100)) return { error: 'The final must be worth more than 0% and less than 100% of the grade.' };
    var f = function (x) { return H.num(x, 6); };
    var w = v.weight / 100, rest = 1 - w, keep = v.current * rest;
    var steps = [];
    if (v.mode === 'result') {
      if (!(v.exam >= 0)) return { error: 'Enter your score on the final.' };
      var add = v.exam * w, g = keep + add, gr = H.round(g, 2);
      steps.push('<b>Formula:</b> Class grade = C × (1 − w) + E × w');
      steps.push('<b>Substitute:</b> Class grade = ' + f(v.current) + ' × (1 − ' + f(w) + ') + ' + f(v.exam) + ' × ' + f(w));
      steps.push('<b>Subtract:</b> 1 − ' + f(w) + ' = ' + f(rest) + ', the share of the grade earned before the final');
      steps.push('<b>Multiply:</b> ' + f(v.current) + ' × ' + f(rest) + ' = ' + f(keep));
      steps.push('<b>Multiply:</b> ' + f(v.exam) + ' × ' + f(w) + ' = ' + f(add));
      steps.push('<b>Add:</b> ' + f(keep) + ' + ' + f(add) + ' = ' + f(g));
      steps.push('<b>Answer:</b> your class grade would be ' + H.num(gr, 2) + '% (' + (Math.abs(gr - g) < 1e-9 ? 'exact, no rounding needed' : 'rounded to 2 decimal places') + ').');
      return { value: H.num(gr, 2) + '%', label: 'Class grade after the final', expr: f(keep) + ' + ' + f(add), steps: steps };
    }
    if (!(v.target >= 0)) return { error: 'Enter the class grade you want.' };
    var gap = v.target - keep, need = gap / w, up = Math.ceil(need * 10 - 1e-7) / 10, best = keep + 100 * w;
    var exactN = Math.abs(up - need) < 1e-7;
    steps.push('<b>Formula:</b> Needed = (T − C × (1 − w)) ÷ w');
    steps.push('<b>Substitute:</b> Needed = (' + f(v.target) + ' − ' + f(v.current) + ' × (1 − ' + f(w) + ')) ÷ ' + f(w) + ', with the ' + f(v.weight) + '% weight written as ' + f(w));
    steps.push('<b>Subtract:</b> 1 − ' + f(w) + ' = ' + f(rest) + ', the share of the grade you have already earned');
    steps.push('<b>Multiply:</b> ' + f(v.current) + ' × ' + f(rest) + ' = ' + f(keep) + ' points locked in');
    steps.push('<b>Subtract:</b> ' + f(v.target) + ' − ' + f(keep) + ' = ' + f(gap) + ' points the final has to supply');
    steps.push('<b>Divide:</b> ' + f(gap) + ' ÷ ' + f(w) + ' = ' + f(need));
    var val, label = 'Score needed on the final for ' + f(v.target) + '%';
    if (need > 100) {
      steps.push('<b>Answer:</b> you would need ' + H.num(up, 1) + '%' + (exactN ? '' : ' (rounded up to 1 decimal place)') + ', more than 100%, so a ' + f(v.target) + '% is out of reach; a perfect final gives ' + H.num(best, 2) + '%.');
      val = H.num(up, 1) + '%';
    } else if (need <= 0) {
      steps.push('<b>Answer:</b> ' + H.num(need, 2) + '% is 0% or below, so you need 0%: any score on the final, even a 0, keeps you at ' + f(v.target) + '% or higher (no rounding needed).');
      val = '0%';
    } else {
      steps.push('<b>Answer:</b> you need at least ' + H.num(up, 1) + '% on the final (' + (exactN ? 'exact, no rounding needed' : 'rounded up to 1 decimal place, so the score is enough') + ').');
      val = H.num(up, 1) + '%';
    }
    return { value: val, label: label, expr: '(' + f(v.target) + ' − ' + f(keep) + ') ÷ ' + f(w), rows: [['A perfect final would give', H.num(best, 2) + '%'], ['A 0 on the final would give', H.num(keep, 2) + '%']], steps: steps };
  },
  facts: {
    formula: 'Needed = (T − C × (1 − w)) ÷ w<br>Class grade = C × (1 − w) + E × w',
    vars: [['T', 'the class grade you want, as a percent'], ['C', 'your grade before the final, as a percent'], ['w', 'the final\'s weight as a decimal: 25% = 0.25'], ['E', 'your score on the final, as a percent']],
    rounding: 'round the needed score up, never down, so it is enough: 81.37% becomes 81.4%. Round a finished class grade to 2 decimal places.',
    note: 'The formula assumes your current grade covers everything except the final. If your gradebook already counts the final as a 0, use the grade before that 0 was added.'
  },
  example: {
    h2: 'Worked example: holding on to a B−',
    html: `<p><strong>Problem:</strong> Priya has a 79.4% in history. The final exam is worth 30% of the grade. What does she need on the final to finish with an 80%?</p>
<p><strong>1.</strong> The work before the final counts for 1 − 0.30 = 0.70 of the grade, so it contributes 79.4 × 0.70 = 55.58 points.</p>
<p><strong>2.</strong> She wants 80 points in total, so the final must add 80 − 55.58 = 24.42 points.</p>
<p><strong>3.</strong> The final is worth 0.30, so divide: 24.42 ÷ 0.30 = 81.4.</p>
<p><strong>Answer:</strong> Priya needs 81.4% on the final. Sense check: she is just below 80% now, so she has to score a little above 80% on the exam to pull the class grade up to it, and 81.4% is a little above.</p>`
  },
  variants: [
    {
      h2: 'What do I need on my final to get a 90?',
      html: `<p>With an 88% and a final worth 25%, you need <strong>96%</strong>. The table shows how much your starting point matters when the final is worth 25%:</p>
<div class="twrap"><table><thead><tr><th>Grade before the final</th><th>Needed for a 90%</th></tr></thead><tbody>
<tr><td>85%</td><td>105% (not possible)</td></tr><tr><td>88%</td><td>96%</td></tr><tr><td>90%</td><td>90%</td></tr><tr><td>92%</td><td>84%</td></tr><tr><td>95%</td><td>75%</td></tr>
</tbody></table></div>
<p>If you already have the grade you want, you only need to match it on the final to keep it.</p>`
    },
    {
      h2: 'What will my grade be if I fail the final?',
      html: `<p>Switch the calculator to "my class grade after the final" and enter the score. With an 88% and a 25% final, scoring 0 leaves 88 × 0.75 = <strong>66%</strong>, and scoring 50% gives 66 + 50 × 0.25 = 78.5%. A failed final hurts, but the work you have already done still counts for three quarters of the grade.</p>`
    },
    {
      h2: 'Does a final worth more make it harder?',
      html: `<p>Not always. If the grade you want is above your current grade, a heavier final helps, because each exam point moves the grade further. With an 88% and a target of 90%, a 25% final needs 96%, but a 40% final needs (90 − 88 × 0.60) ÷ 0.40 = 93%. If you are trying to protect a grade you already have, a heavier final is riskier.</p>`
    }
  ],
  mistakes: [
    '<strong>Using the weight as a whole number.</strong> Dividing by 25 instead of 0.25 gives 0.96 instead of 96. Write the weight as a decimal before you substitute.',
    '<strong>Averaging the current grade and the target.</strong> Halfway between 88 and 90 is 89, but the final carries only a quarter of the grade, so it has to make up the gap four times over.',
    '<strong>Using a grade that already counts the final as 0.</strong> Some gradebooks drop your average when the final is entered as a placeholder. Use the grade from before that happened.',
    '<strong>Rounding the needed score down.</strong> If the math says 81.37%, an 81.3% falls short. Always round up.'
  ],
  related: ['grade-calculator', 'test-score-calculator', 'gpa-calculator', 'percentage-calculator'],
  faq: [
    { q: 'Why does it say I need more than 100%?', a: 'Because the grade you want is out of reach with this final alone. The "perfect final" line shows the best grade still possible; extra credit or a curve are the only ways past it.' },
    { q: 'Where do I find what my final is worth?', a: 'In the course syllabus, usually in a grading breakdown such as "final exam 25%". If the final is points-based, its weight is the final\'s points divided by the total points in the course.' },
    { q: 'What do I need on the final to pass the class?', a: 'Set the target to your school\'s passing grade, often 60% or 70% (check your syllabus). With an 88% and a 25% final, even a 0 leaves 66%, so you pass at a 60% cutoff.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Weighted Mean', url: 'https://mathworld.wolfram.com/WeightedMean.html' }
  ]
};
