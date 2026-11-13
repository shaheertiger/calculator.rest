export default {
  slug: 'final-grade-calculator',
  hub: 'education',
  name: 'Final Grade Calculator',
  title: 'Final Grade Calculator: 88% Now, 25% Final, Need 96% for a 90',
  h1: 'Final Exam Grade Calculator: What Score Do You Need?',
  meta: 'Sitting at 88% with a final worth 25%? You need a 96% on the exam to finish with a 90% (A−). Enter your grade, the exam weight and your goal.',
  keyword: 'how to calculate final grade',
  also: ['what i need to get on my final calculator', 'final exam calculator', 'what do i need on my final', 'final grade needed calculator', 'how much will my final affect my grade'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I want to find', type: 'select', value: 'need', options: [['need', 'The score I need on the final'], ['result', 'My course grade after the final']] },
    { id: 'current', label: 'Current grade in the class', type: 'number', value: 88, suffix: '%', help: 'Your grade before the final, as shown in your gradebook.' },
    { id: 'weight', label: 'Final exam is worth', type: 'number', value: 25, suffix: '% of grade' },
    { id: 'target', label: 'Grade you want in the class', type: 'number', value: 90, suffix: '%', showIf: { mode: ['need'] } },
    { id: 'exam', label: 'Score on the final', type: 'number', value: 85, suffix: '%', showIf: { mode: ['result'] } }
  ],
  compute(v, H) {
    if (!(v.current >= 0)) return { error: 'Enter your current grade as a percentage.' };
    if (!(v.weight > 0 && v.weight < 100)) return { error: 'The final must be worth more than 0% and less than 100% of the grade.' };
    var w = v.weight / 100, keep = v.current * (1 - w);
    var letter = function (g) { return g >= 93 ? 'A' : g >= 90 ? 'A−' : g >= 87 ? 'B+' : g >= 83 ? 'B' : g >= 80 ? 'B−' : g >= 77 ? 'C+' : g >= 73 ? 'C' : g >= 70 ? 'C−' : g >= 67 ? 'D+' : g >= 63 ? 'D' : g >= 60 ? 'D−' : 'F'; };
    var needFor = function (t) { return (t - keep) / w; };
    var show = function (n) { return n <= 0 ? 'any score (0%+)' : n > 100 ? H.num(n, 1) + '% (not possible)' : H.num(n, 1) + '%'; };
    var hi = keep + 100 * w;
    var rows = [];
    if (v.mode === 'result') {
      if (!(v.exam >= 0)) return { error: 'Enter your score on the final.' };
      var g = keep + v.exam * w;
      rows.push(['Change from current grade', (g - v.current >= 0 ? '+' : '−') + H.num(Math.abs(g - v.current), 2) + ' points', true]);
      rows.push(['Grade if you score 100%', H.num(hi, 2) + '%']);
      rows.push(['Grade if you score 0%', H.num(keep, 2) + '%']);
      return { value: H.num(g, 2) + '%', label: 'Course grade after the final (' + letter(g) + ')', expr: H.num(v.current, 2) + '% × ' + H.num(1 - w, 4) + ' + ' + H.num(v.exam, 2) + '% × ' + H.num(w, 4), rows: rows, sub: 'Your work before the final carries ' + H.num(100 - v.weight, 2) + '% of the grade, so the exam can move it by at most ' + H.num(v.weight, 2) + ' points from the 0% floor.' };
    }
    if (!(v.target >= 0)) return { error: 'Enter the grade you want to finish with.' };
    var need = needFor(v.target);
    [[90, 'A− (90%)'], [80, 'B− (80%)'], [70, 'C− (70%)'], [60, 'D− (60%)']].forEach(function (t) { rows.push(['Needed for ' + t[1], show(needFor(t[0]))]); });
    rows.push(['Grade if you score 100%', H.num(hi, 2) + '% (' + letter(hi) + ')', true]);
    rows.push(['Grade if you score 0%', H.num(keep, 2) + '% (' + letter(keep) + ')']);
    var sub = need > 100 ? 'Even 100% on the final leaves you at ' + H.num(hi, 2) + '%. You would need extra credit or a curve to reach ' + H.num(v.target, 2) + '%.' : need <= 0 ? 'You already have ' + H.num(v.target, 2) + '% locked in, even with a 0 on the final.' : 'Scoring ' + H.num(need, 1) + '% on a final worth ' + H.num(v.weight, 2) + '% lifts an ' + H.num(v.current, 2) + '% to exactly ' + H.num(v.target, 2) + '%.';
    return { value: H.num(need, 1) + '%', label: 'Score needed on the final for ' + H.num(v.target, 2) + '%', expr: '(' + H.num(v.target, 2) + ' − ' + H.num(v.current, 2) + ' × ' + H.num(1 - w, 4) + ') ÷ ' + H.num(w, 4), rows: rows, sub: sub, need: need };
  },
  quick: ({ r }) => `To calculate the final exam grade you need, subtract your current grade times (1 − final weight) from your goal, then divide by the final weight. With an 88% and a final worth 25%, reaching 90% takes (90 − 88 × 0.75) ÷ 0.25 = <strong>${r.value}</strong> on the exam. Keeping a B− (80%) takes only 56%.`,
  stepsTitle: 'How to calculate the grade you need on a final',
  steps: [
    'Find your current grade in the class before the final. Use the overall percentage from your gradebook, not a single test score.',
    'Look up how much the final is worth in the syllabus (for example 20%, 25% or 30%). If the class uses points, divide the final\'s points by the total points in the course.',
    'Pick the course grade you want, such as 90% for an A− or 70% to pass with a C−.',
    'Calculate (goal − current × (1 − weight)) ÷ weight with the weights as decimals. The common mistake is forgetting to shrink your current grade: it only counts for the part of the course that isn\'t the final.'
  ],
  formulaTitle: 'What is the final grade formula?',
  formula: {
    expr: 'Needed on final = (G − C × (1 − w)) ÷ w<br>Course grade = C × (1 − w) + F × w',
    vars: [['G', 'goal grade for the course, %'], ['C', 'current grade before the final, %'], ['w', 'final exam weight as a decimal (25% = 0.25)'], ['F', 'score on the final, %']],
    note: 'This assumes your current grade already reflects every other assignment. If homework or a project is still ungraded, use the <a href="/grade-calculator">what-if grade calculator</a> with each category instead.'
  },
  example: `<p>Maya has an 82% in chemistry and the final is worth 20% of her grade. She wants to keep at least a B− (80%).</p>
<p>Her coursework counts for 80% of the grade: 82 × 0.8 = 65.6 points already earned.</p>
<p>Needed for 80%: (80 − 65.6) ÷ 0.2 = <strong>72%</strong> on the final. Needed for a B (85%): (85 − 65.6) ÷ 0.2 = <strong>97%</strong>.</p>
<p>If she scores 100%, she finishes with 65.6 + 20 = 85.6%; if she skips it, 65.6%.</p>`,
  table: {
    title: 'What do I need on my final to get an A, B or C?',
    intro: 'Score needed on a final worth 25% of the course grade, for a range of current grades.',
    head: ['Current grade', 'For 90% (A−)', 'For 80% (B−)', 'For 70% (C−)'],
    rows: ({ run }) => [98, 95, 92, 90, 88, 85, 82, 80, 77, 75, 72, 70, 65].map(c => [c + '%', ...[90, 80, 70].map(t => { const n = run({ mode: 'need', current: c, weight: 25, target: t }).need; return n <= 0 ? 'Any score' : n > 100 ? 'Not possible' : (Math.round(n * 10) / 10) + '%'; })]),
    note: '"Any score" means the grade is already secured even with a 0. "Not possible" means more than 100% would be needed without extra credit.'
  },
  sections: [
    {
      h2: 'How much will my final affect my grade?',
      html: `<p>At most its weight. A final worth 25% can move your course grade anywhere between 75% of your current grade (if you score 0) and that plus 25 points (if you score 100). Starting from 88%, the range is 66% to 91%.</p>
<p>In practice the swing is smaller, because you will probably score near your usual level. Scoring 10 points below your current average on a 25% final drops the course grade by 2.5 points; on a 40% final it drops 4 points. That is why students with heavy finals feel more pressure: each exam point is worth more.</p>`
    },
    {
      h2: 'What do I need on my final to pass the class?',
      html: `<p>Set the goal to your school's passing grade, usually 60% (D−) or 70% (C−) if the class is a prerequisite. With a 68% average and a final worth 30%, passing at 60% needs (60 − 68 × 0.7) ÷ 0.3 = 41.3%, but keeping a C− (70%) needs 74.7%.</p>
<p>Some instructors also require a minimum score on the final itself, regardless of your average, so check the syllabus for a "must pass the final" rule.</p>`
    },
    {
      h2: 'How do I calculate my final grade if my class uses points?',
      html: `<p>Convert points to the same two inputs. Your current grade is points earned ÷ points possible so far, and the final's weight is its points ÷ all points in the course.</p>
<p>Example: you have 412 of 460 points (89.57%) and the final is worth 200 of 660 total points (30.3%). For a 90% you need 0.9 × 660 = 594 points, so 594 − 412 = 182 of 200, a <strong>91%</strong> on the final. The calculator gives the same answer with 89.57% and 30.3%.</p>`
    },
    {
      h2: 'What if I need more than 100% on the final?',
      html: `<p>Then the goal can't be reached from the exam alone. Look at the "grade if you score 100%" line to see your ceiling, and set a realistic target one letter lower. Options that can still help: extra credit, a dropped-lowest-score policy, a curve, or a replacement policy where the final score replaces your lowest test. Ask your teacher before the exam rather than after.</p>`
    }
  ],
  faq: [
    { q: 'What do I need on my final to get a 90 with an 88?', a: 'With an 88% and a final worth 25%, you need a 96% on the final to finish at 90%. If the final is worth 40%, you only need 93%.' },
    { q: 'Can I fail the final and still pass the class?', a: 'Often, yes. With an 85% and a final worth 20%, a 0 on the final still leaves you at 68% (85 × 0.8), which passes at most schools where 60% is a D−.' },
    { q: 'How do I find out how much my final is worth?', a: 'Check the grading breakdown in your syllabus or online gradebook. If grades are point-based, divide the final exam\'s points by the total points for the term.' },
    { q: 'Does this work for a final project instead of an exam?', a: 'Yes. Any last assignment with a known weight works the same way: enter its weight and the formula tells you the score you need.' },
    { q: 'Why does my teacher\'s gradebook show a different grade?', a: 'Gradebooks often leave out ungraded categories or drop a lowest score, so your displayed average may not be the number the formula needs. Use the category-by-category calculator if some categories are still empty.' },
    { q: 'What is a passing grade on a final?', a: 'Usually 60% or higher on a standard U.S. scale, though many classes treat 70% (C−) as the minimum that counts toward a major or prerequisite.' },
    { q: 'How do I calculate my grade after the final?', a: 'Multiply your current grade by (1 − final weight), multiply your final exam score by the weight, and add them. An 88% with an 85% on a 25% final gives 66 + 21.25 = 87.25%.' }
  ],
  related: ['grade-calculator', 'test-score-calculator', 'gpa-calculator', 'high-school-gpa-calculator', 'weighted-average-calculator'],
  sources: [
    { name: 'Wikipedia: Weighted arithmetic mean', url: 'https://en.wikipedia.org/wiki/Weighted_arithmetic_mean' },
    { name: 'Wikipedia: Academic grading in the United States', url: 'https://en.wikipedia.org/wiki/Academic_grading_in_the_United_States' }
  ]
};
