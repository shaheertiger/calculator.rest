export default {
  slug: 'test-score-calculator',
  hub: 'school',
  name: 'Test Score Calculator',
  title: 'Test Score Calculator: 29/30 = 96.67% (With Steps)',
  meta: '29 out of 30 on a test is 96.67%: 29 ÷ 30 = 0.966667, times 100. Turn right or wrong answers into a test percent and letter grade, with every step.',
  keyword: 'test score calculator',
  also: ['how to calculate score on a test', '29/30 percent', 'test percent', 'test grade calculator', 'quiz score percentage'],
  updated: '2026-11-26',
  answer: ({ r }) => `29 out of 30 on a test is <strong>${r.value}</strong>: divide 29 by 30, then multiply by 100.`,
  inputs: [
    { id: 'total', label: 'Points or questions on the test', type: 'number', value: 30 },
    { id: 'kind', label: 'I know how many I got', type: 'select', value: 'right', options: [['right', 'right (points earned)'], ['wrong', 'wrong (points lost)']] },
    { id: 'count', label: 'How many', type: 'number', value: 29 },
    { id: 'scale', label: 'Letter grade scale', type: 'select', value: 'ten', options: [['ten', '10-point: A 90+, B 80+, C 70+, D 60+'], ['pm', 'Plus/minus: A 93+, A− 90+, B+ 87+ …'], ['none', 'No letter grade']] }
  ],
  compute(v, H) {
    var ok = function (x) { return typeof x === 'number' && isFinite(x); };
    if (!(ok(v.total) && v.total > 0)) return { error: 'Enter how many points or questions the test has.' };
    if (!(ok(v.count) && v.count >= 0)) return { error: 'Enter how many you got right or wrong.' };
    if (v.count > v.total) return { error: 'That is more than the test total.' };
    var T = v.total, right = v.kind === 'wrong' ? T - v.count : v.count;
    var f = function (x) { return H.num(x, 6); };
    var ratio = right / T, pct = ratio * 100, r2 = H.round(pct, 2);
    var exact = Math.abs(r2 - pct) < 1e-9;
    var cuts = v.scale === 'pm' ? [[93, 'A'], [90, 'A−'], [87, 'B+'], [83, 'B'], [80, 'B−'], [77, 'C+'], [73, 'C'], [70, 'C−'], [67, 'D+'], [63, 'D'], [60, 'D−'], [0, 'F']] : [[90, 'A'], [80, 'B'], [70, 'C'], [60, 'D'], [0, 'F']];
    var L = null;
    if (v.scale !== 'none') for (var i = 0; i < cuts.length; i++) if (r2 >= cuts[i][0] - 1e-9) { L = cuts[i]; break; }
    var scaleName = v.scale === 'pm' ? 'plus/minus scale' : '10-point scale';
    var steps = ['<b>Formula:</b> Score % = (points earned ÷ points possible) × 100'];
    if (v.kind === 'wrong') steps.push('<b>Points earned:</b> ' + f(T) + ' − ' + f(v.count) + ' wrong = ' + f(right));
    steps.push('<b>Substitute:</b> Score % = (' + f(right) + ' ÷ ' + f(T) + ') × 100');
    steps.push('<b>Divide:</b> ' + f(right) + ' ÷ ' + f(T) + ' = ' + f(ratio));
    steps.push('<b>Multiply by 100:</b> ' + f(ratio) + ' × 100 = ' + H.num(pct, 4) + '%');
    if (L) steps.push('<b>Letter grade:</b> ' + H.num(r2, 2) + '% is at least ' + L[0] + '%, so it is ' + (/^[AF]/.test(L[1]) ? 'an ' : 'a ') + L[1] + ' on the ' + scaleName + '. Your teacher\'s cutoffs may differ.');
    steps.push('<b>Answer:</b> ' + f(right) + ' out of ' + f(T) + ' is ' + H.num(r2, 2) + '% (' + (exact ? 'exact, no rounding needed' : 'rounded to 2 decimal places') + ')' + (L ? ', ' + (/^[AF]/.test(L[1]) ? 'an ' : 'a ') + L[1] : '') + '.');
    return {
      value: H.num(r2, 2) + '%',
      label: 'Test score' + (L ? ' (' + L[1] + ')' : ''),
      expr: f(right) + ' ÷ ' + f(T) + ' × 100',
      rows: [['Each question or point is worth', H.num(100 / T, 2) + ' percentage points']],
      steps: steps
    };
  },
  facts: {
    formula: 'Score % = (E ÷ P) × 100<br>From wrong answers: E = P − W',
    vars: [['E', 'points earned, or questions answered correctly'], ['P', 'points possible, or questions on the test'], ['W', 'points lost, or questions missed (blanks count as missed)']],
    rounding: 'divide and multiply at full precision, then round the percent to 2 decimal places unless your teacher rounds to whole numbers.',
    note: 'Letter grade cutoffs are set by your school or teacher. The two scales here are common in the US, not universal.'
  },
  example: {
    h2: 'Worked example: a test with questions worth different points',
    html: `<p><strong>Problem:</strong> Maya's chemistry test has 20 multiple-choice questions worth 2 points each and 4 short answers worth 10 points each. She misses 3 multiple-choice questions and loses 9 points on the short answers. What is her test percent?</p>
<p><strong>1.</strong> Points possible: 20 × 2 + 4 × 10 = 40 + 40 = 80.</p>
<p><strong>2.</strong> Points lost: 3 × 2 + 9 = 15, so points earned = 80 − 15 = 65.</p>
<p><strong>3.</strong> Divide and multiply by 100: 65 ÷ 80 = 0.8125, and 0.8125 × 100 = 81.25%.</p>
<p><strong>Answer:</strong> Maya scored 81.25%, a B on a 10-point scale. Sense check: she lost 15 of 80 points, a little under a fifth, so her score should be a little over 80%. Count points, not questions, when questions carry different values: 21 of 24 questions right would wrongly suggest 87.5%.</p>`
  },
  variants: [
    {
      h2: 'What is 29/30 as a percent?',
      html: `<p>29/30 is <strong>96.67%</strong>: 29 ÷ 30 = 0.966667, and moving the decimal point two places gives 96.6667%, which rounds to 96.67%. On a 30-question test each question is worth 100 ÷ 30 = 3.33 points, so every miss drops the score by about 3.33:</p>
<div class="twrap"><table><thead><tr><th>Score</th><th>Test percent</th><th>10-point letter</th></tr></thead><tbody>
<tr><td>29/30</td><td>96.67%</td><td>A</td></tr><tr><td>28/30</td><td>93.33%</td><td>A</td></tr><tr><td>27/30</td><td>90%</td><td>A</td></tr><tr><td>26/30</td><td>86.67%</td><td>B</td></tr><tr><td>25/30</td><td>83.33%</td><td>B</td></tr>
</tbody></table></div>`
    },
    {
      h2: 'How do you calculate a score on a test from the number wrong?',
      html: `<p>Subtract the misses from the total first, then divide by the total. Missing 6 questions on a 40-question test leaves 34 right, and 34 ÷ 40 × 100 = <strong>85%</strong>. Pick "wrong" in the calculator and it does the subtraction for you. Do not divide the 6 misses by 40: that gives 15%, the share you lost.</p>`
    },
    {
      h2: 'How many questions can I miss and still get a 90?',
      html: `<p>Multiply the number of questions by 0.10 and round down. On a 30-question test, 30 × 0.10 = 3, so you can miss 3 and score exactly 90%. On a 25-question test, 25 × 0.10 = 2.5, so you can miss 2 (92%) but not 3 (88%). For an 80% target use 0.20 instead.</p>`
    }
  ],
  mistakes: [
    '<strong>Dividing the wrong answers by the total.</strong> 1 ÷ 30 = 3.33% is the part you missed. The score is (30 − 1) ÷ 30 = 96.67%.',
    '<strong>Counting questions instead of points.</strong> When questions have different values, add up points earned and points possible, as in the chemistry example above.',
    '<strong>Cutting off instead of rounding.</strong> 96.6667% rounds to 96.67%, not 96.66%. Look at the third decimal place: 6 or more rounds up.',
    '<strong>Leaving blanks out of the total.</strong> A skipped question still counts in the total, so 27 right out of 30 is 90% even if you only attempted 28.'
  ],
  related: ['percentage-calculator', 'grade-calculator', 'final-grade-calculator', 'average-calculator'],
  faq: [
    { q: 'How much is each question worth on a 20-question test?', a: '5 percentage points, because 100 ÷ 20 = 5. Missing 2 questions gives 90% and missing 4 gives 80%.' },
    { q: 'Is 96.67% an A?', a: 'On both common US scales, yes: the 10-point scale starts an A at 90% and the plus/minus scale starts a full A at 93%. Your syllabus has the final word.' },
    { q: 'What is a passing score on a test?', a: 'It depends on the school. Many US schools treat 60% as the lowest passing grade (a D), and some require 65% or 70%. Check your syllabus or ask your teacher.' },
    { q: 'How do I work out a test percent when there is extra credit?', a: 'Add the extra-credit points to the points earned but not to the points possible. 28 earned plus 2 extra credit on a 30-point test is 30 ÷ 30 = 100%.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Percent', url: 'https://mathworld.wolfram.com/Percent.html' }
  ]
};
