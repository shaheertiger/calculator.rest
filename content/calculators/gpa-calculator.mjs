export default {
  slug: 'gpa-calculator',
  hub: 'school',
  name: 'GPA Calculator',
  title: 'GPA Calculator: A, A−, B+, B = 3.50 GPA (With Steps)',
  meta: 'Grades of A, A−, B+ and B in four 1-credit classes make a 3.50 GPA: 14 grade points ÷ 4 credits. High school, college or homeschool GPA, with steps.',
  keyword: 'gpa calculator',
  also: ['gpa calculator for elementary school', 'highschool gpa cal', 'homeschool gpa calculator', 'weighted gpa calculator', 'how to calculate gpa'],
  updated: '2026-11-26',
  answer: ({ r }) => `Grades of A, A−, B+ and B in four 1-credit classes give a <strong>${r.value}</strong> GPA: 14 grade points ÷ 4 credits.`,
  inputs: [
    {
      id: 'courses', label: 'Your classes', type: 'rows', addLabel: '+ add class', max: 12,
      fields: [
        { id: 'name', label: 'Class', type: 'text', value: '', blank: true, placeholder: 'e.g. Biology' },
        { id: 'grade', label: 'Grade', type: 'select', value: 'A', options: [['A+', 'A+'], ['A', 'A'], ['A-', 'A−'], ['B+', 'B+'], ['B', 'B'], ['B-', 'B−'], ['C+', 'C+'], ['C', 'C'], ['C-', 'C−'], ['D+', 'D+'], ['D', 'D'], ['D-', 'D−'], ['F', 'F'], ['P', 'Pass (not counted)']] },
        { id: 'credits', label: 'Credits', type: 'number', value: 1 },
        { id: 'level', label: 'Level', type: 'select', value: 'reg', options: [['reg', 'Regular'], ['hon', 'Honors +0.5'], ['ap', 'AP/IB +1']] }
      ],
      value: [
        { name: 'English', grade: 'A', credits: 1, level: 'reg' },
        { name: 'Math', grade: 'B+', credits: 1, level: 'reg' },
        { name: 'Science', grade: 'A-', credits: 1, level: 'reg' },
        { name: 'History', grade: 'B', credits: 1, level: 'reg' }
      ],
      help: 'Honors and AP bonuses differ by school; use Regular for an unweighted GPA.'
    },
    { id: 'scale', label: 'Grade point scale', type: 'select', value: 'pm', wide: true, options: [['pm', 'Plus/minus: A 4.0, A− 3.7, B+ 3.3, B 3.0 … (A+ = 4.0)'], ['pm433', 'Plus/minus with A+ = 4.33'], ['whole', 'Whole letters only: A 4, B 3, C 2, D 1 (+ and − ignored)']] }
  ],
  compute(v, H) {
    var pmPts = { 'A+': 4, 'A': 4, 'A-': 3.7, 'B+': 3.3, 'B': 3, 'B-': 2.7, 'C+': 2.3, 'C': 2, 'C-': 1.7, 'D+': 1.3, 'D': 1, 'D-': 0.7, 'F': 0 };
    var wholePts = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    var bonus = { reg: 0, hon: 0.5, ap: 1 };
    var f = function (x) { return H.num(x, 4); };
    var qp = 0, cr = 0, lines = [], terms = [], crs = [], weighted = false;
    (v.courses || []).forEach(function (c, i) {
      if (!(c.credits > 0) || c.grade === 'P' || !c.grade) return;
      var base = v.scale === 'whole' ? wholePts[c.grade.charAt(0)] : (c.grade === 'A+' && v.scale === 'pm433' ? 4.33 : pmPts[c.grade]);
      if (base === undefined) return;
      var b = c.grade === 'F' ? 0 : (bonus[c.level] || 0), pts = base + b, q = pts * c.credits;
      if (b) weighted = true;
      var nm = c.name ? H.esc(c.name) : 'Class ' + (i + 1);
      lines.push('<b>' + nm + ':</b> ' + c.grade.replace('-', '−') + ' = ' + f(base) + (b ? ' + ' + f(b) + ' bonus = ' + f(pts) : '') + ' points × ' + f(c.credits) + ' credit' + (c.credits === 1 ? '' : 's') + ' = ' + f(q));
      qp += q; cr += c.credits; terms.push(f(q)); crs.push(f(c.credits));
    });
    if (!cr) return { error: 'Add at least one graded class with credits.' };
    var gpa = qp / cr, g2 = H.round(gpa, 2), shown = H.fix(g2, 2);
    var steps = ['<b>Formula:</b> GPA = (sum of grade points × credits) ÷ (sum of credits)'];
    if (lines.length > 8) steps.push('<b>Grade points × credits:</b> ' + lines.length + ' classes, ' + terms.join(', '));
    else steps = steps.concat(lines);
    steps.push('<b>Add the grade points:</b> ' + terms.join(' + ') + ' = ' + f(qp));
    steps.push('<b>Add the credits:</b> ' + crs.join(' + ') + ' = ' + f(cr));
    steps.push('<b>Divide:</b> ' + f(qp) + ' ÷ ' + f(cr) + ' = ' + H.num(gpa, 6));
    steps.push('<b>Answer:</b> your ' + (weighted ? 'weighted' : 'unweighted') + ' GPA is ' + shown + ' on a 4.0 scale (' + (Math.abs(g2 - gpa) < 1e-9 ? 'exact, shown to 2 decimal places' : 'rounded to 2 decimal places') + ').');
    return { value: shown, label: (weighted ? 'Weighted' : 'Unweighted') + ' GPA', expr: f(qp) + ' ÷ ' + f(cr), steps: steps };
  },
  facts: {
    formula: 'GPA = Σ(p × c) ÷ Σc',
    vars: [['p', 'grade points for one class: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0 on the common plus/minus scale'], ['c', 'credits or hours for that class (1 for most high school classes)'], ['Σ', 'add up over every graded class; pass/fail classes are left out']],
    rounding: 'add and divide at full precision, then round the GPA to 2 decimal places (some schools truncate instead of rounding).',
    note: 'Grade point scales vary. Most US schools use the plus/minus 4.0 scale above, but some skip pluses and minuses, give A+ 4.33, or add 0.5 or 1.0 for honors and AP. Use your school\'s own scale.'
  },
  example: {
    h2: 'Worked example: a college semester with different credit hours',
    html: `<p><strong>Problem:</strong> Ana takes English (A, 3 credits), Calculus (B+, 4 credits), Psychology (B, 3 credits) and Spanish (A−, 3 credits). What is her semester GPA?</p>
<p><strong>1.</strong> Grade points × credits: 4.0 × 3 = 12, 3.3 × 4 = 13.2, 3.0 × 3 = 9 and 3.7 × 3 = 11.1.</p>
<p><strong>2.</strong> Add them: 12 + 13.2 + 9 + 11.1 = 45.3 quality points.</p>
<p><strong>3.</strong> Add the credits: 3 + 4 + 3 + 3 = 13. Divide: 45.3 ÷ 13 = 3.4846.</p>
<p><strong>Answer:</strong> Ana's GPA is 3.48. Sense check: her grades range from 3.0 to 4.0, and the 4-credit B+ (3.3) pulls the result a little below the plain average of her four grade points, which is 3.5.</p>`
  },
  variants: [
    {
      h2: 'How do you calculate GPA for elementary school or homeschool?',
      html: `<p>When every subject counts the same, give each one 1 credit and the GPA is simply the average of the grade points. A, B+, A− and B are 4.0 + 3.3 + 3.7 + 3.0 = 14, and 14 ÷ 4 = <strong>3.50</strong>. Homeschool parents choose the scale, so pick one, write it on the transcript and use it every year. Half-year or lighter courses can be entered as 0.5 credit.</p>`
    },
    {
      h2: 'How is a high school GPA calculated, weighted or unweighted?',
      html: `<p>An unweighted GPA uses the plain 4.0 scale for every class. A weighted GPA adds a bonus for harder classes, often +0.5 for honors and +1.0 for AP or IB, though schools set their own rules. If the B+ in math above were AP, it would count 3.3 + 1 = 4.3, and the GPA would be (4.0 + 4.3 + 3.7 + 3.0) ÷ 4 = 15 ÷ 4 = <strong>3.75</strong>. Colleges often recalculate GPAs their own way, so keep both numbers.</p>`
    },
    {
      h2: 'How do I calculate my cumulative GPA?',
      html: `<p>Combine quality points, not GPAs. Multiply your old GPA by your old credits, add this term's quality points, and divide by all credits. A 3.2 over 30 credits is 3.2 × 30 = 96 points; adding Ana's 45.3 points from 13 credits gives (96 + 45.3) ÷ 43 = 141.3 ÷ 43 = <strong>3.29</strong>. Averaging 3.2 and 3.48 directly would give 3.34, too high, because the old credits outnumber the new ones.</p>`
    }
  ],
  mistakes: [
    '<strong>Averaging grades without credits.</strong> A 4-credit B+ counts more than a 1-credit A. Multiply each grade by its credits first.',
    '<strong>Counting pass/fail classes.</strong> A "P" earns credits toward graduation but has no grade points, so leave it out of both sums.',
    '<strong>Averaging percents instead of grade points.</strong> A 93% and a 79% average to 86%, but the GPA is (4.0 + 2.3) ÷ 2 = 3.15 on the plus/minus scale.',
    '<strong>Adding honors bonuses to an F.</strong> Most schools give no bonus for a failing grade; an F stays 0.'
  ],
  related: ['grade-calculator', 'final-grade-calculator', 'test-score-calculator', 'average-calculator'],
  faq: [
    { q: 'What is an A− worth in GPA?', a: '3.7 on the common plus/minus 4.0 scale. A B+ is 3.3 and a B− is 2.7. Schools that ignore pluses and minuses count an A− as a full 4.0.' },
    { q: 'Can a GPA be higher than 4.0?', a: 'An unweighted GPA cannot. A weighted GPA can, because honors and AP bonuses push single classes to 4.5 or 5.0.' },
    { q: 'What GPA is a B average?', a: 'A 3.0 on the 4.0 scale. A 3.50 sits halfway between a B+ (3.3) and an A− (3.7).' },
    { q: 'Do I round or truncate my GPA?', a: 'Most schools round to 2 decimal places, so 3.4846 becomes 3.48. A few truncate, which would also give 3.48 here but turns 3.4996 into 3.49 instead of 3.50.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Weighted Mean', url: 'https://mathworld.wolfram.com/WeightedMean.html' }
  ]
};
