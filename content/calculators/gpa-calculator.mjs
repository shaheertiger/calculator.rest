export default {
  slug: 'gpa-calculator',
  hub: 'education',
  name: 'GPA Calculator',
  title: 'GPA Calculator: How to Calculate GPA on a 4.0 Scale (2026)',
  h1: 'GPA Calculator: Semester and Cumulative GPA on a 4.0 Scale',
  meta: 'Add your classes, letter grades and credit hours to get your semester and cumulative GPA. Example: A, B+, B and A− over 13 credits is a 3.48 GPA.',
  keyword: 'how to calculate gpa',
  also: ['how do you calculate gpa', 'how do i calculate my gpa', 'gpa calculator', 'how to calculate cumulative gpa', 'how to calculate gpa grades', 'how do i calculate my gpa on a 4.0 scale'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'courses', label: 'Your classes this term', type: 'rows', addLabel: '+ add class', max: 30,
      fields: [
        { id: 'name', label: 'Class (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. Biology' },
        { id: 'grade', label: 'Grade', type: 'select', value: 'A', options: [['A+', 'A+'], ['A', 'A'], ['A-', 'A−'], ['B+', 'B+'], ['B', 'B'], ['B-', 'B−'], ['C+', 'C+'], ['C', 'C'], ['C-', 'C−'], ['D+', 'D+'], ['D', 'D'], ['D-', 'D−'], ['F', 'F'], ['P', 'P (pass, not counted)']] },
        { id: 'credits', label: 'Credits', type: 'number', value: 3 }
      ],
      value: [
        { name: 'English Composition', grade: 'A', credits: 3 },
        { name: 'Calculus I', grade: 'B+', credits: 4 },
        { name: 'Intro to Psychology', grade: 'B', credits: 3 },
        { name: 'Spanish II', grade: 'A-', credits: 3 }
      ]
    },
    { id: 'aplus', label: 'A+ counts as', type: 'select', value: '4.0', options: [['4.0', '4.0 (most colleges)'], ['4.33', '4.33']] },
    { id: 'priorGpa', label: 'Current cumulative GPA', type: 'number', value: '', placeholder: 'optional, e.g. 3.2', help: 'Leave blank for a first-semester GPA.' },
    { id: 'priorCredits', label: 'Credits already earned', type: 'number', value: '', placeholder: 'e.g. 30' }
  ],
  data: { points: { 'A': 4, 'A-': 3.7, 'B+': 3.3, 'B': 3, 'B-': 2.7, 'C+': 2.3, 'C': 2, 'C-': 1.7, 'D+': 1.3, 'D': 1, 'D-': 0.7, 'F': 0 } },
  compute(v, H, D) {
    var qp = 0, cr = 0, n = 0;
    (v.courses || []).forEach(function (c) {
      if (!(c.credits > 0) || c.grade === 'P') return;
      var p = c.grade === 'A+' ? Number(v.aplus) : D.points[c.grade];
      if (p === undefined) return;
      qp += p * c.credits; cr += c.credits; n++;
    });
    if (!cr) return { error: 'Add at least one graded class with credits.' };
    var gpa = qp / cr;
    var rows = [['Quality points', H.num(qp, 2)], ['Graded credits', H.num(cr, 2)], ['Classes counted', String(n)]];
    var out = { value: H.fix(gpa, 2), label: 'Semester GPA', expr: H.num(qp, 2) + ' pts ÷ ' + H.num(cr, 2) + ' credits', rows: rows };
    if (v.priorGpa >= 0 && v.priorGpa <= 5 && v.priorCredits > 0) {
      var cum = (v.priorGpa * v.priorCredits + qp) / (v.priorCredits + cr);
      out.value = H.fix(cum, 2); out.label = 'New cumulative GPA';
      out.expr = '(' + H.num(v.priorGpa, 2) + ' × ' + H.num(v.priorCredits, 0) + ' + ' + H.num(qp, 1) + ') ÷ ' + H.num(v.priorCredits + cr, 1);
      rows.unshift(['Semester GPA', H.fix(gpa, 2), true]);
      rows.push(['Total credits', H.num(v.priorCredits + cr, 2)]);
    }
    var letter = gpa >= 3.85 ? 'A' : gpa >= 3.5 ? 'A−' : gpa >= 3.15 ? 'B+' : gpa >= 2.85 ? 'B' : gpa >= 2.5 ? 'B−' : gpa >= 2.15 ? 'C+' : gpa >= 1.85 ? 'C' : gpa >= 1.5 ? 'C−' : gpa >= 1 ? 'D' : 'F';
    out.sub = 'This term averages a ' + letter + '. ' + (gpa >= 3.5 ? 'Dean\'s list range at most colleges (3.5+).' : gpa >= 3.0 ? 'Above the 3.0 most scholarships and many grad programs ask for.' : gpa >= 2.0 ? 'Above the 2.0 needed for good academic standing at most colleges.' : 'Below the 2.0 most colleges require for good standing.');
    return out;
  },
  quick: ({ r }) => `To calculate GPA, multiply each class's grade points (A = 4.0, B = 3.0, C = 2.0) by its credit hours, add them up and divide by total credits. An A, B+, B and A− across 13 credits is 45.3 quality points ÷ 13 = <strong>${r.value} GPA</strong>. Pass/fail classes don't count.`,
  stepsTitle: 'How to calculate your GPA in 4 steps',
  steps: [
    'Convert each letter grade to grade points on the 4.0 scale: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, and so on (full table below).',
    'Multiply each class\'s grade points by its credit hours to get <strong>quality points</strong>. A B+ in a 4-credit class is 3.3 × 4 = 13.2.',
    'Add up all quality points and all credit hours. Leave out pass/fail, withdrawn (W) and audited classes; they carry no grade points.',
    'Divide total quality points by total credits. For a cumulative GPA, add your earlier quality points (old GPA × old credits) before dividing by all credits.'
  ],
  formulaTitle: 'What is the GPA formula?',
  formula: {
    expr: 'GPA = Σ (grade points × credits) ÷ Σ credits<br>Cumulative GPA = (old GPA × old credits + new quality points) ÷ (old credits + new credits)',
    vars: [['grade points', 'value of the letter grade on the 4.0 scale'], ['credits', 'credit (semester) hours for the class'], ['Σ', 'sum over all graded classes']]
  },
  example: `<p>A student takes English (A, 3 credits), Calculus (B+, 4 credits), Psychology (B, 3 credits) and Spanish (A−, 3 credits).</p>
<p>Quality points: 4.0 × 3 = 12.0; 3.3 × 4 = 13.2; 3.0 × 3 = 9.0; 3.7 × 3 = 11.1. Total = <strong>45.3</strong> over <strong>13</strong> credits.</p>
<p>Semester GPA = 45.3 ÷ 13 = <strong>3.48</strong>.</p>
<p>If they already had a 3.20 GPA over 30 credits: (3.20 × 30 + 45.3) ÷ 43 = (96 + 45.3) ÷ 43 = <strong>3.29 cumulative GPA</strong>.</p>`,
  table: {
    title: 'What is each letter grade worth on the 4.0 scale?',
    intro: 'The standard U.S. college scale with plus and minus grades, and the percentage range most syllabi map to each letter.',
    head: ['Letter grade', 'Grade points', 'Typical percent', '3-credit class adds'],
    rows: ({ D, H }) => [['A+', '4.0 (4.33 at some schools)', '97–100%'], ['A', '4.0', '93–96%'], ['A−', '3.7', '90–92%'], ['B+', '3.3', '87–89%'], ['B', '3.0', '83–86%'], ['B−', '2.7', '80–82%'], ['C+', '2.3', '77–79%'], ['C', '2.0', '73–76%'], ['C−', '1.7', '70–72%'], ['D+', '1.3', '67–69%'], ['D', '1.0', '63–66%'], ['D−', '0.7', '60–62%'], ['F', '0.0', 'Below 60%']].map(r => [r[0], r[1], r[2], H.num(parseFloat(r[1]) * 3, 1) + ' pts']),
    note: 'Schools set their own scales. Some don\'t use A+ or minus grades, and a few count A+ as 4.33. Check your registrar\'s grading policy; the calculator lets you switch A+ between 4.0 and 4.33.'
  },
  sections: [
    {
      h2: 'How do you calculate cumulative GPA?',
      html: `<p>Cumulative GPA is the average across every term, weighted by credits, not the average of your semester GPAs. Multiply your current cumulative GPA by the credits you've already earned to recover your total quality points, add this term's quality points, and divide by the new credit total.</p>
<p>Example: a 3.40 GPA over 60 credits is 204 quality points. A 15-credit semester at 3.80 adds 57 points. The new cumulative GPA is (204 + 57) ÷ 75 = <strong>3.48</strong>, not the 3.60 you'd get by averaging 3.40 and 3.80.</p>
<p>Enter your current cumulative GPA and credits in the optional boxes above and the calculator does this automatically.</p>`
    },
    {
      h2: 'How much can one semester raise my GPA?',
      html: `<p>Less each year, because every new term is a smaller share of your total credits. The table shows the cumulative GPA after a 15-credit semester of straight A's (4.0), starting from a 3.0.</p>
<div class="twrap"><table><thead><tr><th>Credits already earned</th><th>GPA after a 4.0 term</th><th>Gain</th></tr></thead><tbody>
<tr><td>15 (end of 1st semester)</td><td>3.50</td><td>+0.50</td></tr>
<tr><td>30 (end of freshman year)</td><td>3.33</td><td>+0.33</td></tr>
<tr><td>60 (end of sophomore year)</td><td>3.20</td><td>+0.20</td></tr>
<tr><td>90 (end of junior year)</td><td>3.14</td><td>+0.14</td></tr>
</tbody></table></div>
<p>To reach a target, the GPA you need next term is (target × total credits − current GPA × current credits) ÷ new credits. Going from 3.0 to 3.2 over 60 credits with a 15-credit term needs (3.2 × 75 − 180) ÷ 15 = 4.0.</p>`
    },
    {
      h2: 'Do pass/fail, withdrawn and repeated classes count?',
      html: `<ul>
<li><strong>Pass/fail (P/NP, S/U):</strong> credits count toward graduation but not toward GPA. Select "P" in the calculator and the class is left out.</li>
<li><strong>Withdrawals (W):</strong> no grade points and no GPA credits. A WF (withdraw failing) is counted as an F at some schools.</li>
<li><strong>Incompletes (I):</strong> left out until the final grade is posted.</li>
<li><strong>Repeated classes:</strong> many colleges replace the first grade with the new one (grade forgiveness); others average both attempts. Check your registrar's repeat policy before including both.</li>
<li><strong>Transfer credits:</strong> usually count toward graduation but not your institutional GPA.</li>
</ul>`
    },
    {
      h2: 'How do you calculate GPA from percentages?',
      html: `<p>Convert each percentage to a letter grade using your syllabus, then to grade points. On the most common scale, 93% and above is an A (4.0), 90–92% an A− (3.7), 87–89% a B+ (3.3) and so on, as in the table above. A rough shortcut for a single percent grade is (percent − 55) ÷ 10, but it drifts at the edges, so use the letter table for an official figure.</p>
<p>For a 10-point CGPA or a GPA-to-percent conversion, use the <a href="/gpa-to-percentage-calculator">GPA to percentage calculator</a>.</p>`
    },
    {
      h2: 'How do I calculate the GPA I need to reach a target?',
      html: `<p>Work backwards from quality points. Required term GPA = (target GPA × total credits after the term − current GPA × current credits) ÷ credits this term.</p>
<p>Example: you have a 2.85 GPA over 45 credits and want a 3.0 after a 15-credit semester. You need 3.0 × 60 = 180 quality points in total, and you already have 2.85 × 45 = 128.25, so this term must earn 51.75 points: 51.75 ÷ 15 = <strong>3.45</strong>, roughly a B+/A− average.</p>
<p>If the answer is above 4.0, the target isn't reachable in one term; spread it over two semesters, or check whether your school's grade-replacement policy lets a retaken class swap out an old F or D. Replacing a 3-credit F with a B adds 9 quality points without adding credits, which moves a 45-credit GPA by 0.20.</p>`
    },
    {
      h2: 'What is a good college GPA?',
      html: `<p>Benchmarks most U.S. students run into:</p>
<ul>
<li><strong>2.0:</strong> minimum for good academic standing and to keep federal financial aid (satisfactory academic progress) at most schools.</li>
<li><strong>3.0:</strong> a B average; a common cutoff for scholarships, internships and many graduate programs.</li>
<li><strong>3.5:</strong> typical Dean's List threshold for a single semester.</li>
<li><strong>3.5–3.9:</strong> Latin honors ranges (cum laude, magna cum laude, summa cum laude) at many colleges.</li>
<li><strong>3.7+:</strong> competitive for medical and law school; the median GPA at top-ranked law schools is above 3.8.</li>
</ul>`
    }
  ],
  faq: [
    { q: 'What GPA is a B+ average?', a: 'A B+ average is a 3.3 GPA on the standard 4.0 scale. A 3.0 is a straight B and a 3.7 is an A−.' },
    { q: 'Is a 3.5 GPA good?', a: 'Yes. A 3.5 GPA means mostly A− and B+ grades, puts you on the Dean\'s List at most colleges and clears the 3.0 cutoff used by most scholarships and graduate programs.' },
    { q: 'How do I calculate my GPA with credit hours?', a: 'Multiply each grade\'s points by the class\'s credit hours, add those quality points together, and divide by your total credit hours. Classes with more credits move your GPA more.' },
    { q: 'Do I include classes I failed?', a: 'Yes. An F counts as 0 grade points but its credits stay in the total, which pulls your GPA down until the class is retaken and the grade is replaced (if your school allows grade forgiveness).' },
    { q: 'Is cumulative GPA the average of semester GPAs?', a: 'No. Cumulative GPA is weighted by credits: total quality points from all terms divided by total graded credits. Averaging semester GPAs only works if every term had the same number of credits.' },
    { q: 'What is the difference between weighted and unweighted GPA?', a: 'Unweighted GPA uses the plain 4.0 scale. Weighted GPA adds points for honors, AP or IB classes (often +0.5 or +1.0) and is mainly used in high school. Use the high school GPA calculator for weighted GPA.' },
    { q: 'How do I calculate GPA in Excel or Google Sheets?', a: 'Put grade points in column B and credits in column C, then use =SUMPRODUCT(B2:B10,C2:C10)/SUM(C2:C10). That is the same weighted average this calculator uses.' },
    { q: 'Can I raise my GPA from 2.5 to 3.0 in one semester?', a: 'Only early on. With 30 credits at 2.5, a 15-credit semester of 4.0 brings you to 3.0 exactly. With 60 credits at 2.5, the best one semester can do is 2.8.' }
  ],
  related: ['high-school-gpa-calculator', 'final-grade-calculator', 'grade-calculator', 'gpa-to-percentage-calculator', 'credit-hours-calculator'],
  sources: [
    { name: 'Federal Student Aid: Satisfactory Academic Progress (SAP)', url: 'https://studentaid.gov/understand-aid/eligibility/staying-eligible' },
    { name: 'College Board BigFuture: How to Convert Your GPA to a 4.0 Scale', url: 'https://bigfuture.collegeboard.org/plan-for-college/college-prep/academics/how-to-convert-gpa-4.0-scale' },
    { name: 'LSAC: GPA conversion and academic summary report', url: 'https://www.lsac.org/applying-law-school/jd-application-process/credential-assembly-service/academic-summary-report' }
  ]
};
