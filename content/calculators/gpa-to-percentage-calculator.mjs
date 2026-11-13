export default {
  slug: 'gpa-to-percentage-calculator',
  hub: 'education',
  name: 'GPA to Percentage Calculator',
  title: 'GPA to Percentage Calculator: 3.5 ≈ 89.5%, 8.2 CGPA = 77.9%',
  h1: 'Convert GPA or CGPA to a Percentage (and Back)',
  meta: 'A 3.5 GPA works out to about 89.5% on the standard U.S. letter scale; an 8.2 CGPA is 77.9% using CBSE\'s × 9.5 rule. Convert 4.0 or 10-point grades either way.',
  keyword: 'how to calculate percentage from gpa',
  also: ['how to calculate gpa percentage', 'how to calculate cgpa from gpa', 'how can we calculate cgpa', 'cgpa to percentage', 'gpa to percentage', 'percentage to gpa'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Convert', type: 'select', value: 'g4', options: [['g4', 'GPA (4.0 scale) → percentage'], ['g10', 'CGPA (10-point) → percentage'], ['p4', 'Percentage → GPA (4.0 scale)'], ['p10', 'Percentage → CGPA (10-point)']] },
    { id: 'x', label: 'Your GPA, CGPA or percentage', type: 'number', value: 3.5 },
    { id: 'rule', label: '10-point formula', type: 'select', value: '9.5', showIf: { mode: ['g10', 'p10'] }, options: [['9.5', 'CGPA × 9.5 (CBSE, most common)'], ['10', 'CGPA × 10'], ['0.75', '(CGPA − 0.75) × 10']] }
  ],
  data: {
    anchors: [[0.7, 61], [1.0, 64.5], [1.3, 68], [1.7, 71], [2.0, 74.5], [2.3, 78], [2.7, 81], [3.0, 84.5], [3.3, 88], [3.7, 91], [4.0, 96.5]],
    bands: [[93, 4.0, 'A', '93–100%'], [90, 3.7, 'A−', '90–92%'], [87, 3.3, 'B+', '87–89%'], [83, 3.0, 'B', '83–86%'], [80, 2.7, 'B−', '80–82%'], [77, 2.3, 'C+', '77–79%'], [73, 2.0, 'C', '73–76%'], [70, 1.7, 'C−', '70–72%'], [67, 1.3, 'D+', '67–69%'], [63, 1.0, 'D', '63–66%'], [60, 0.7, 'D−', '60–62%'], [0, 0, 'F', 'below 60%']]
  },
  compute(v, H, D) {
    var x = v.x;
    if (!(typeof x === 'number' && isFinite(x) && x >= 0)) return { error: 'Enter a GPA, CGPA or percentage.' };
    var rule = v.rule;
    var toPct10 = function (c) { return rule === '10' ? c * 10 : rule === '0.75' ? (c - 0.75) * 10 : c * 9.5; };
    var fromPct10 = function (p) { return rule === '10' ? p / 10 : rule === '0.75' ? p / 10 + 0.75 : p / 9.5; };
    var ruleTxt = rule === '10' ? 'CGPA × 10' : rule === '0.75' ? '(CGPA − 0.75) × 10' : 'CGPA × 9.5';
    var band = function (p) { for (var i = 0; i < D.bands.length; i++) if (p >= D.bands[i][0]) return D.bands[i]; return D.bands[D.bands.length - 1]; };
    if (v.mode === 'g10') {
      if (x > 10) return { error: 'A 10-point CGPA can\'t be above 10.' };
      var p = Math.max(0, toPct10(x));
      return { value: H.num(p, 2) + '%', label: 'Percentage for a CGPA of ' + H.num(x, 2), expr: ruleTxt.replace('CGPA', H.num(x, 2)), rows: [['Formula used', ruleTxt], ['CGPA × 9.5 (CBSE)', H.num(x * 9.5, 2) + '%', rule !== '9.5'], ['First class (60%+) at most Indian universities', p >= 60 ? 'yes' : 'no']], sub: 'Your university\'s transcript or grade card may state its own formula, and that one always wins.' };
    }
    if (v.mode === 'p10') {
      if (x > 100) return { error: 'A percentage can\'t be above 100.' };
      var c = Math.min(10, fromPct10(x));
      return { value: H.fix(c, 2), label: 'CGPA on a 10-point scale', expr: 'reverse of ' + ruleTxt, rows: [['Formula used', ruleTxt]], sub: 'Converting a percentage back to CGPA only reverses the formula; it is not your official CGPA.' };
    }
    if (v.mode === 'p4') {
      if (x > 100) return { error: 'A percentage can\'t be above 100.' };
      var b = band(x);
      return { value: H.fix(b[1], 1), label: 'Grade points on the 4.0 scale (' + b[2] + ')', expr: H.num(x, 2) + '% → ' + b[2] + ' (' + b[3] + ')', rows: [['Letter grade', b[2]], ['Percent band', b[3]], ['Without plus/minus grades', H.fix(x >= 90 ? 4 : x >= 80 ? 3 : x >= 70 ? 2 : x >= 60 ? 1 : 0, 1)]], sub: 'This converts one percentage. For several classes, convert each one and average them by credits.' };
    }
    if (x > 4.0) return { error: 'For a weighted GPA above 4.0, convert your unweighted GPA instead.' };
    var A = D.anchors, pct;
    if (x < A[0][0]) pct = NaN;
    else {
      for (var i = 0; i < A.length - 1; i++) {
        if (x <= A[i + 1][0]) { pct = A[i][1] + (x - A[i][0]) / (A[i + 1][0] - A[i][0]) * (A[i + 1][1] - A[i][1]); break; }
      }
      if (pct === undefined) pct = A[A.length - 1][1];
    }
    if (!(pct >= 0)) return { value: 'below 60%', label: 'Percentage equivalent (F range)', expr: H.fix(x, 2) + ' GPA', rows: [['GPA ÷ 4 × 100', H.num(x / 4 * 100, 2) + '%']], sub: 'GPAs below 0.7 average out to failing grades on the U.S. scale.' };
    var lo = band(pct);
    return {
      value: H.num(pct, 1) + '%',
      label: 'Percentage equivalent of a ' + H.fix(x, 2) + ' GPA',
      expr: H.fix(x, 2) + ' on the 4.0 letter scale',
      rows: [['Letter band it falls in', lo[2] + ' (' + lo[3] + ')', true], ['GPA ÷ 4 × 100 (simple ratio)', H.num(x / 4 * 100, 2) + '%'], ['10-point equivalent (GPA × 2.5)', H.fix(x * 2.5, 2)]],
      sub: 'Based on the midpoints of the standard U.S. letter-grade bands (A = 93–100%, B = 83–86%, and so on). There is no single official conversion.'
    };
  },
  quick: ({ r }) => `No single official formula converts a 4.0 GPA to a percentage, so convert through the letter scale. A 3.5 GPA falls between a B+ (87–89%) and an A− (90–92%), which works out to about <strong>${r.value}</strong>. For a 10-point CGPA, CBSE's rule is CGPA × 9.5, so an 8.2 CGPA is <strong>77.9%</strong>.`,
  stepsTitle: 'How to convert GPA to a percentage',
  steps: [
    'Check which scale your GPA uses: a U.S. 4.0 scale, or a 10-point CGPA used in India and some other countries.',
    'For a 10-point CGPA, use the formula printed on your grade card. If none is given, CBSE\'s CGPA × 9.5 is the usual default.',
    'For a 4.0 GPA, find the two letter grades your GPA falls between and the percentage band for each (A− = 90–92%, B+ = 87–89%), then read off the point in between.',
    'Use your unweighted GPA. A weighted 4.4 includes honors and AP bonus points that have no percentage equivalent; dividing it by 4 is the mistake that gives answers above 100%.'
  ],
  formulaTitle: 'What formula converts GPA to percentage?',
  formula: {
    expr: '10-point: Percentage = CGPA × 9.5<br>4.0 scale: Percentage ≈ P₁ + (GPA − G₁) ÷ (G₂ − G₁) × (P₂ − P₁)',
    vars: [['9.5', 'CBSE multiplier for its CGPA scheme'], ['G₁, G₂', 'grade points of the letter grades just below and above your GPA (e.g. 3.3 and 3.7)'], ['P₁, P₂', 'midpoints of those letters\' percentage bands (88% and 91%)']],
    note: 'Many people simply divide the GPA by 4 (3.5 ÷ 4 = 87.5%). That ratio is shown in the results, but it doesn\'t match how U.S. schools assign letter grades, so treat it as rough.'
  },
  example: `<p><strong>4.0 scale:</strong> a 3.5 GPA lies halfway between B+ (3.3) and A− (3.7). Their band midpoints are 88% and 91%, so 88 + 0.5 × 3 = <strong>89.5%</strong>.</p>
<p><strong>10-point scale:</strong> an 8.2 CGPA × 9.5 = <strong>77.9%</strong>. Under a university that uses (CGPA − 0.75) × 10, the same CGPA is 74.5%.</p>
<p><strong>Back to GPA:</strong> an 85% in a single U.S. class is a B (83–86%), worth 3.0 grade points; on the 10-point scale it is 85 ÷ 9.5 = 8.95 CGPA.</p>`,
  table: {
    title: 'What percentage is a 3.0, 3.5 or 3.8 GPA?',
    intro: 'Unweighted GPAs on the 4.0 scale converted with the letter-band method above, next to the simple GPA ÷ 4 ratio.',
    head: ['GPA', 'Percentage (letter scale)', 'Letter grade', 'GPA ÷ 4 × 100'],
    rows: ({ run, H }) => [4.0, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.0, 2.8, 2.5, 2.0, 1.5, 1.0].map(g => { const r = run({ mode: 'g4', x: g }); return [H.fix(g, 1), r.value, r.rows[0][1].split(' ')[0], H.num(g * 25, 1) + '%']; }),
    note: 'An all-A record (4.0) averages somewhere between 93% and 100%; the table uses the 96.5% midpoint.'
  },
  sections: [
    {
      h2: 'How do you convert CGPA to percentage?',
      html: `<p>Multiply by 9.5 unless your university publishes a different rule. CBSE introduced the 9.5 multiplier with its CGPA grading scheme, and many Indian schools, colleges and employers still use it. Quick reference:</p>
<div class="twrap"><table><thead><tr><th>CGPA</th><th>× 9.5</th><th>(CGPA − 0.75) × 10</th></tr></thead><tbody>
<tr><td>10</td><td>95%</td><td>92.5%</td></tr><tr><td>9.5</td><td>90.25%</td><td>87.5%</td></tr><tr><td>9</td><td>85.5%</td><td>82.5%</td></tr><tr><td>8.5</td><td>80.75%</td><td>77.5%</td></tr><tr><td>8</td><td>76%</td><td>72.5%</td></tr><tr><td>7.5</td><td>71.25%</td><td>67.5%</td></tr><tr><td>7</td><td>66.5%</td><td>62.5%</td></tr><tr><td>6.5</td><td>61.75%</td><td>57.5%</td></tr><tr><td>6</td><td>57%</td><td>52.5%</td></tr>
</tbody></table></div>
<p>Engineering and technical universities often print their own formula on the grade card; check it before filling in an application.</p>`
    },
    {
      h2: 'How do you calculate CGPA from semester GPAs?',
      html: `<p>CGPA is the credit-weighted average of your semester GPAs (SGPAs): multiply each SGPA by that semester's credits, add them, and divide by total credits. Semesters of 22, 24 and 20 credits at 8.1, 8.6 and 7.9 give (178.2 + 206.4 + 158) ÷ 66 = <strong>8.22 CGPA</strong>. If every semester has the same credits, a plain average gives the same answer. The <a href="/gpa-calculator">GPA calculator</a> does the same weighting for U.S. letter grades.</p>`
    },
    {
      h2: 'Do U.S. colleges accept a converted percentage or GPA?',
      html: `<p>Usually not as your own calculation. U.S. graduate schools and employers typically ask for your original transcript and, for degrees earned abroad, a course-by-course evaluation from a credential evaluation service such as WES, which assigns a U.S. GPA class by class. Use this calculator to estimate where you stand, then report the numbers exactly as your institution issued them.</p>`
    },
    {
      h2: 'What is a 4.0 GPA as a percentage?',
      html: `<p>A 4.0 means every grade was an A, which on the usual scale covers 93% to 100%, so a 4.0 GPA corresponds to roughly 93–100% (about 96.5% at the midpoint). At schools that count an A as 90% and above, the same 4.0 can include grades as low as 90%. That spread is why admissions offices prefer GPA plus a school profile over a single converted percentage.</p>`
    }
  ],
  faq: [
    { q: 'What percentage is a 3.5 GPA?', a: 'A 3.5 GPA is about 89.5% on the standard U.S. letter scale, between a B+ (87–89%) and an A− (90–92%). Dividing by 4 gives 87.5%, which understates it.' },
    { q: 'What is an 8.2 CGPA in percentage?', a: 'An 8.2 CGPA is 77.9% with the CBSE formula (8.2 × 9.5). With (CGPA − 0.75) × 10 it is 74.5%, so use your university\'s rule if it has one.' },
    { q: 'What percentage is a 3.0 GPA?', a: 'A 3.0 GPA is a straight B average, about 84.5% on the standard scale (B = 83–86%).' },
    { q: 'How do I convert percentage to CGPA?', a: 'Divide by 9.5 under the CBSE rule: 76% ÷ 9.5 = 8.0 CGPA. If your university uses another formula, reverse that one instead.' },
    { q: 'How do I convert a 10-point CGPA to a 4.0 GPA?', a: 'A rough conversion is CGPA × 0.4 (8.0 becomes 3.2), but official conversions are done course by course by credential evaluators, so treat the quick version as an estimate.' },
    { q: 'Can I convert a weighted GPA to a percentage?', a: 'Not meaningfully. Weighted GPAs include bonus points for honors and AP classes. Convert your unweighted GPA instead.' },
    { q: 'What percentage is a 2.0 GPA?', a: 'A 2.0 GPA is a C average, about 74.5% on the standard scale (C = 73–76%).' }
  ],
  related: ['gpa-calculator', 'high-school-gpa-calculator', 'test-score-calculator', 'percentage-calculator', 'credit-hours-calculator'],
  sources: [
    { name: 'College Board BigFuture: How to Convert Your GPA to a 4.0 Scale', url: 'https://bigfuture.collegeboard.org/plan-for-college/college-prep/academics/how-to-convert-gpa-4.0-scale' },
    { name: 'Central Board of Secondary Education (CBSE)', url: 'https://www.cbse.gov.in/' },
    { name: 'World Education Services (WES): credential evaluation', url: 'https://www.wes.org/' }
  ]
};
