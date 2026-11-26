export default {
  slug: 'average-calculator',
  hub: 'school',
  name: 'Average Calculator',
  title: 'Average Calculator: Average of 81 and 100 = 90.5 (Steps)',
  meta: 'The average of 81 and 100 is 90.5: add them to get 181 and divide by 2. Average two test scores or a whole list, with the sum ÷ count steps shown.',
  keyword: 'average calculator',
  also: ['average test', 'average of 81 and 100', 'what is the average of 100 and 90', 'average of 70 and 0', '93+80+100', 'average of two test scores'],
  updated: '2026-11-26',
  answer: ({ r }) => `The average of 81 and 100 is <strong>${r.value}</strong>: add them to get 181, then divide by 2.`,
  inputs: [
    { id: 'data', label: 'Numbers to average (commas, spaces or + signs)', type: 'text', value: '81, 100', wide: true, placeholder: 'e.g. 93, 80, 100' },
    { id: 'dp', label: 'Round the average to', type: 'select', value: '2', options: [['2', '2 decimal places'], ['1', '1 decimal place'], ['0', 'a whole number']] }
  ],
  compute(v, H) {
    var x = H.list(String(v.data || '').replace(/\+/g, ' '));
    var n = x.length;
    if (!n) return { error: 'Enter at least one number, such as 81, 100.' };
    var dp = Number(v.dp); if (!(dp >= 0)) dp = 2;
    var f = function (t) { return H.num(t, 6); };
    var sum = H.sum(x), mean = sum / n, r = H.round(mean, dp);
    var exact = Math.abs(r - mean) < 1e-9;
    var shown = x.length <= 12 ? x.map(f).join(' + ') : x.slice(0, 5).map(f).join(' + ') + ' + … + ' + x.slice(-2).map(f).join(' + ');
    var names = n === 2 ? f(x[0]) + ' and ' + f(x[1]) : n === 1 ? f(x[0]) : 'these ' + n + ' numbers';
    var steps = [
      '<b>Formula:</b> Average = (sum of the values) ÷ (how many values there are)',
      '<b>Substitute:</b> Average = (' + shown + ') ÷ ' + n,
      '<b>Count:</b> there ' + (n === 1 ? 'is 1 value' : 'are ' + n + ' values') + ', so divide by ' + n + '. A 0 counts as a value; a blank does not.',
      '<b>Add:</b> ' + shown + ' = ' + f(sum),
      '<b>Divide:</b> ' + f(sum) + ' ÷ ' + n + ' = ' + f(mean),
      '<b>Answer:</b> the average of ' + names + ' is ' + H.num(r, dp) + ' (' + (exact ? 'exact, no rounding needed' : 'rounded to ' + (dp === 0 ? 'a whole number' : dp + ' decimal place' + (dp === 1 ? '' : 's'))) + ').'
    ];
    return {
      value: H.num(r, dp),
      label: 'Average of ' + n + ' value' + (n === 1 ? '' : 's'),
      expr: f(sum) + ' ÷ ' + n,
      rows: n >= 3 ? [['Lowest to highest', f(H.sorted(x)[0]) + ' to ' + f(H.sorted(x)[n - 1])]] : [],
      steps: steps
    };
  },
  facts: {
    formula: 'Average = (x₁ + x₂ + … + xₙ) ÷ n<br>Two numbers: Average = (a + b) ÷ 2',
    vars: [['x₁ … xₙ', 'the values you are averaging, such as test scores'], ['n', 'how many values there are (zeros count, blanks do not)'], ['a, b', 'the two numbers, when there are only two']],
    rounding: 'add and divide at full precision, then round the average once, usually to 2 decimal places or to the nearest whole point for grades.',
    note: 'This average is the arithmetic mean. The average of two numbers is always exactly halfway between them.'
  },
  example: {
    h2: 'Worked example: averaging three test scores',
    html: `<p><strong>Problem:</strong> Jordan scored 93, 80 and 100 on three math tests. What is Jordan's test average?</p>
<p><strong>1.</strong> Add the scores: 93 + 80 + 100 = 273.</p>
<p><strong>2.</strong> Count the scores: there are 3 tests.</p>
<p><strong>3.</strong> Divide the sum by the count: 273 ÷ 3 = 91.</p>
<p><strong>Answer:</strong> Jordan's average is 91. Sense check: 93 is 2 above 91, 80 is 11 below and 100 is 9 above, and +2 − 11 + 9 = 0. The distances above and below an average always cancel out.</p>`
  },
  variants: [
    {
      h2: 'What is the average of 100 and 90?',
      html: `<p>The average of 100 and 90 is <strong>95</strong>: 100 + 90 = 190 and 190 ÷ 2 = 95. With only two test scores you can also take the point halfway between them. These are the pairs people ask about most, worked the same way:</p>
<div class="twrap"><table><thead><tr><th>Two scores</th><th>Sum</th><th>Sum ÷ 2</th></tr></thead><tbody>
<tr><td>81 and 100</td><td>181</td><td>90.5</td></tr><tr><td>93 and 100</td><td>193</td><td>96.5</td></tr><tr><td>85 and 100</td><td>185</td><td>92.5</td></tr><tr><td>95 and 87.5</td><td>182.5</td><td>91.25</td></tr><tr><td>70 and 0</td><td>70</td><td>35</td></tr>
</tbody></table></div>`
    },
    {
      h2: 'Why is the average of 70 and 0 only 35?',
      html: `<p>Because a 0 is a real score, so it counts. 70 + 0 = 70, and dividing by 2 gives <strong>35</strong>. This is why one missing assignment drags a grade down so hard: a zero sits 70 points below the other score, and the average lands halfway. If the second test was excused rather than scored 0, leave it out and the average is simply 70.</p>`
    },
    {
      h2: 'How do I average test scores that are out of different totals?',
      html: `<p>Add the points, not the percents. A 45 out of 50 (90%) and an 80 out of 100 (80%) average to 85% if you average the percents, but the student earned 125 of 150 points, which is 125 ÷ 150 = 83.33%. The 100-point test counts for more because it has more points. When categories have set weights instead, use a weighted average, as the grade calculator does.</p>`
    }
  ],
  mistakes: [
    '<strong>Dividing by the wrong count.</strong> Five scores need ÷ 5, even if one of them is 0. Skipping the zero makes the average look higher than it is.',
    '<strong>Dividing only the last number.</strong> 93 + 80 + 100 ÷ 3 on a calculator gives 206.33, because division happens first. Add everything, then divide: (93 + 80 + 100) ÷ 3 = 91.',
    '<strong>Averaging averages.</strong> A class average of 80 from 10 students and 90 from 30 students is not 85 overall; it is (800 + 2,700) ÷ 40 = 87.5.',
    '<strong>Rounding before dividing.</strong> Keep the full sum, divide, and round the average once at the end.'
  ],
  related: ['test-score-calculator', 'grade-calculator', 'moving-average-calculator', 'gpa-calculator', 'percentage-calculator'],
  faq: [
    { q: 'How do you find the average of 3 numbers?', a: 'Add the three numbers and divide by 3. For 12, 15 and 21: 12 + 15 + 21 = 48, and 48 ÷ 3 = 16.' },
    { q: 'Is the average the same as the mean?', a: 'Yes. "Average" in school math usually means the arithmetic mean: sum ÷ count. The median is different: it is the middle value. For 70, 75 and 100 the mean is 81.67 but the median is 75.' },
    { q: 'Can the average of whole numbers be a decimal?', a: 'Yes. 95 and 88 add to 183, and 183 ÷ 2 = 91.5. Round only if your teacher asks for a whole number.' },
    { q: 'How do I type a list like 93+80+100?', a: 'Type it exactly like that, or use commas or spaces. The calculator treats + signs as separators, adds every value and divides by how many there are.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Arithmetic Mean', url: 'https://mathworld.wolfram.com/ArithmeticMean.html' },
    { name: 'OpenStax Introductory Statistics 2e: Measures of the Center of the Data', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-5-measures-of-the-center-of-the-data' }
  ]
};
