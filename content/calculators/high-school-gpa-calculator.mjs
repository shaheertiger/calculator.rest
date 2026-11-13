export default {
  slug: 'high-school-gpa-calculator',
  hub: 'education',
  name: 'High School GPA Calculator',
  title: 'High School GPA Calculator: Weighted 3.88 vs Unweighted 3.55',
  h1: 'High School GPA Calculator for Weighted and Unweighted GPA',
  meta: 'Two honors classes and one AP turn a 3.55 unweighted high school GPA into a 3.88 weighted GPA. Add your classes and levels to see both numbers.',
  keyword: 'how to calculate high school gpa',
  also: ['how to calculate your high school gpa', 'how to calculate your weighted gpa', 'how to calculate gpa with honors classes', 'weighted gpa calculator', 'unweighted gpa calculator', 'how to calculate gpa in middle school'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'classes', label: 'Your high school classes', type: 'rows', addLabel: '+ add class', max: 40,
      fields: [
        { id: 'name', label: 'Class (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. AP Biology' },
        { id: 'grade', label: 'Grade', type: 'select', value: 'A', options: [['A+', 'A+'], ['A', 'A'], ['A-', 'A−'], ['B+', 'B+'], ['B', 'B'], ['B-', 'B−'], ['C+', 'C+'], ['C', 'C'], ['C-', 'C−'], ['D+', 'D+'], ['D', 'D'], ['D-', 'D−'], ['F', 'F']] },
        { id: 'level', label: 'Level', type: 'select', value: 'reg', options: [['reg', 'Regular / CP'], ['hon', 'Honors'], ['ap', 'AP / IB / dual enrollment']] },
        { id: 'credits', label: 'Credits', type: 'number', value: 1 }
      ],
      value: [
        { name: 'English 10 Honors', grade: 'A-', level: 'hon', credits: 1 },
        { name: 'AP World History', grade: 'B+', level: 'ap', credits: 1 },
        { name: 'Algebra II', grade: 'B', level: 'reg', credits: 1 },
        { name: 'Chemistry Honors', grade: 'B+', level: 'hon', credits: 1 },
        { name: 'Spanish III', grade: 'A', level: 'reg', credits: 1 },
        { name: 'Computer Science', grade: 'A', level: 'reg', credits: 1 }
      ],
      help: 'Use 1 credit for a full-year class and 0.5 for a one-semester class. List every year\'s classes to get a cumulative GPA.'
    },
    { id: 'hon', label: 'Honors bonus', type: 'select', value: '0.5', options: [['0.5', '+0.5 (most common)'], ['1', '+1.0'], ['0', 'No bonus']] },
    { id: 'ap', label: 'AP / IB bonus', type: 'select', value: '1', options: [['1', '+1.0 (most common)'], ['0.5', '+0.5']] },
    { id: 'pm', label: 'Plus/minus grades', type: 'select', value: 'yes', options: [['yes', 'Count them (A− = 3.7)'], ['no', 'Ignore them (A− = 4.0)']] }
  ],
  data: {
    pts: { 'A+': 4, 'A': 4, 'A-': 3.7, 'B+': 3.3, 'B': 3, 'B-': 2.7, 'C+': 2.3, 'C': 2, 'C-': 1.7, 'D+': 1.3, 'D': 1, 'D-': 0.7, 'F': 0 },
    base: { 'A+': 4, 'A': 4, 'A-': 4, 'B+': 3, 'B': 3, 'B-': 3, 'C+': 2, 'C': 2, 'C-': 2, 'D+': 1, 'D': 1, 'D-': 1, 'F': 0 }
  },
  compute(v, H, D) {
    var hon = Number(v.hon), ap = Number(v.ap);
    if (!(hon >= 0)) hon = 0.5;
    if (!(ap >= 0)) ap = 1;
    var table = D[v.pm === 'no' ? 'base' : 'pts'];
    var uq = 0, wq = 0, cr = 0, n = 0, boosted = 0;
    (v.classes || []).forEach(function (c) {
      if (!(c.credits > 0)) return;
      var p = table[c.grade];
      if (p === undefined) return;
      var bonus = p > 0 ? (c.level === 'ap' ? ap : c.level === 'hon' ? hon : 0) : 0;
      if (bonus > 0) boosted += c.credits;
      uq += p * c.credits; wq += (p + bonus) * c.credits; cr += c.credits; n++;
    });
    if (!cr) return { error: 'Add at least one class with a grade and credits.' };
    var u = uq / cr, w = wq / cr;
    var rows = [
      ['Unweighted GPA (4.0 scale)', H.fix(u, 2), true],
      ['Weighted points earned', H.num(wq, 2) + ' over ' + H.num(cr, 2) + ' credits'],
      ['Unweighted points earned', H.num(uq, 2)],
      ['Credits in honors/AP/IB', H.num(boosted, 2) + ' of ' + H.num(cr, 2)],
      ['Weighting added', '+' + H.fix(w - u, 2)]
    ];
    var band = u >= 3.7 ? 'mostly A grades' : u >= 3.3 ? 'an A−/B+ average' : u >= 3.0 ? 'a B average or better' : u >= 2.0 ? 'a C to B average' : 'below a C average';
    return {
      value: H.fix(w, 2),
      label: 'Weighted GPA',
      expr: H.num(wq, 2) + ' weighted pts ÷ ' + H.num(cr, 2) + ' credits',
      rows: rows,
      sub: 'Unweighted, these ' + n + ' classes are ' + band + '. Colleges see both numbers on your transcript and many recalculate their own.'
    };
  },
  quick: ({ r }) => `To calculate a high school GPA, turn each grade into points (A = 4, B = 3, C = 2), add 0.5 for honors and 1.0 for AP or IB, then divide by total credits. Six 1-credit classes graded A−, B+, B, B+, A and A, with two honors and one AP, give a <strong>${r.value} weighted</strong> and <strong>${r.rows[0][1]} unweighted</strong> GPA.`,
  stepsTitle: 'How to calculate high school GPA, weighted and unweighted',
  steps: [
    'Write down every class with its final grade (semester or year, whichever your school records) and its credit value: usually 1.0 for a year course and 0.5 for a semester course.',
    'Give each grade its unweighted value: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0, with plus and minus steps of about 0.3 if your school uses them.',
    'For the <strong>weighted</strong> GPA, add the bonus for each advanced class: typically +0.5 for honors and +1.0 for AP, IB or dual-enrollment college courses. An F earns no bonus.',
    'Multiply each value by the class credits, total both columns, and divide by the total credits. The step students skip is the credits: a half-credit health class should count half as much as a full-year English class.'
  ],
  formulaTitle: 'What is the formula for weighted and unweighted GPA?',
  formula: {
    expr: 'Unweighted GPA = Σ (grade value × credits) ÷ Σ credits<br>Weighted GPA = Σ ((grade value + level bonus) × credits) ÷ Σ credits',
    vars: [['grade value', 'A = 4.0 down to F = 0 on the 4-point scale'], ['level bonus', '0 for regular, 0.5 for honors, 1.0 for AP / IB (check your school profile)'], ['credits', 'credit value of the class, e.g. 1.0 or 0.5']],
    note: 'Districts set the bonus. Some give honors a full point, some cap the weighted scale at 5.0, and some only weight grades of C or better.'
  },
  example: `<p>A sophomore takes English 10 Honors (A−), AP World History (B+), Algebra II (B), Chemistry Honors (B+), Spanish III (A) and Computer Science (A), each worth 1 credit.</p>
<p>Unweighted points: 3.7 + 3.3 + 3.0 + 3.3 + 4.0 + 4.0 = 21.3. Divided by 6 credits = <strong>3.55 unweighted</strong>.</p>
<p>Weighted points: the honors classes become 4.2 and 3.8, the AP class becomes 4.3, so the total is 21.3 + 0.5 + 0.5 + 1.0 = 23.3. Divided by 6 = <strong>3.88 weighted</strong>.</p>
<p>The three advanced classes add 2.0 points spread across 6 credits, which is the +0.33 gap between the two GPAs.</p>`,
  table: {
    title: 'How much does an honors or AP class add to each grade?',
    intro: 'Points for one 1-credit class at each level, using the common +0.5 honors and +1.0 AP/IB bonus and plus/minus grades.',
    head: ['Grade', 'Regular', 'Honors', 'AP / IB'],
    rows: ({ run }) => ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map(g => [g.replace('-', '−'), ...['reg', 'hon', 'ap'].map(l => run({ classes: [{ name: '', grade: g, level: l, credits: 1 }], hon: '0.5', ap: '1', pm: 'yes' }).value)]),
    note: 'A B in an AP class (4.0) is worth the same weighted points as an A in a regular class, which is why students weigh course rigor against the risk of a lower grade.'
  },
  sections: [
    {
      h2: 'How do you calculate your weighted GPA?',
      html: `<p>Start from the unweighted value of each grade, then add the level bonus before averaging. With the usual scheme, a B+ is 3.3 in a regular class, 3.8 in honors and 4.3 in AP. Because the bonus is added class by class, your weighted GPA rises by the share of your schedule that is advanced: one AP class out of six adds 1.0 ÷ 6 = 0.17; four AP classes out of six add 0.67.</p>
<p>That is also why weighted GPAs above 4.0 are possible. On a 5.0 weighted scale, a straight-A student taking only AP courses reaches 5.0; a mix of regular and AP classes with A's lands somewhere between 4.0 and 5.0.</p>`
    },
    {
      h2: 'Do colleges look at weighted or unweighted GPA?',
      html: `<p>Both, and often neither as printed. Admissions offices receive your transcript and the school profile, which explains how your high school weights grades, and many recalculate a GPA of their own so applicants from different schools can be compared. Common adjustments:</p>
<ul><li>Dropping non-academic classes such as PE, health and some electives.</li><li>Using only 10th and 11th grade (the University of California does this for its UC GPA).</li><li>Capping bonus points. UC adds one point for approved honors-level courses but counts at most eight semesters of them, and no more than four from 10th grade.</li></ul>
<p>Report your GPA exactly as it appears on your transcript; let the college do any conversion.</p>`
    },
    {
      h2: 'What is a good high school GPA?',
      html: `<p>A 3.0 unweighted (a B average) meets the minimum for many state universities and scholarships, and a 3.5 or higher is competitive at most selective public universities. Highly selective colleges typically admit students with mostly A grades in the hardest courses their school offers, which often shows up as an unweighted GPA near 3.9 or above.</p>
<p>For context, the NCES High School Transcript Study found that the average GPA of 2019 U.S. graduates was 3.11, up from 3.00 in 2009, so a 3.0 is roughly the national middle. Class rank puts your number against your own classmates; use the <a href="/class-rank-calculator">class rank calculator</a> to turn a rank into a percentile.</p>`
    },
    {
      h2: 'How do you calculate GPA in middle school?',
      html: `<p>The same way, usually without weighting: average the 4-point value of each final grade, weighted by how often the class meets if your school assigns credits. Middle school grades rarely appear on college applications, but some high schools use 8th grade GPA to place students in honors tracks, and high school credit courses taken in 8th grade (Algebra I, a world language) may count toward your high school GPA. Check your district's policy before adding them above.</p>`
    }
  ],
  faq: [
    { q: 'Is a 3.88 weighted GPA good?', a: 'Yes. A 3.88 weighted GPA with a 3.55 unweighted GPA means mostly A and B grades with several honors or AP classes, which is above the national average of about 3.1 and competitive at most state universities.' },
    { q: 'Can a weighted GPA be higher than 4.0?', a: 'Yes. Honors and AP bonuses push each advanced grade above 4.0, so a weighted GPA can reach 4.5 or 5.0. Unweighted GPA tops out at 4.0 at almost every school.' },
    { q: 'Does an F in an AP class still get the extra point?', a: 'Usually not. Most districts give the honors or AP bonus only to passing grades, and some only to grades of C or better, so an F counts as 0 in both GPAs.' },
    { q: 'Do PE and electives count in high school GPA?', a: 'They usually count in the GPA your school prints, but many colleges remove them when they recalculate an academic GPA from your core classes.' },
    { q: 'Should I use semester grades or final grades?', a: 'Use whatever your transcript records. If it lists each semester separately, enter each semester as its own row with 0.5 credits; if it lists one final grade per course, enter one row with 1 credit.' },
    { q: 'How do I calculate my cumulative high school GPA?', a: 'Enter every graded class from 9th grade onward as a row. Cumulative GPA is simply the credit-weighted average of all of them, not the average of your yearly GPAs.' },
    { q: 'Is dual enrollment weighted like AP?', a: 'At many high schools, yes: dual-enrollment college courses get the same +1.0 as AP or IB. Some schools weight them like honors (+0.5), so check your school profile.' }
  ],
  related: ['gpa-calculator', 'class-rank-calculator', 'gpa-to-percentage-calculator', 'grade-calculator', 'psat-score-calculator'],
  sources: [
    { name: 'NCES: High School Transcript Study (NAEP HSTS)', url: 'https://nces.ed.gov/nationsreportcard/hsts/' },
    { name: 'University of California Admissions: GPA requirement', url: 'https://admission.universityofcalifornia.edu/admission-requirements/freshman-requirements/gpa-requirement.html' },
    { name: 'College Board BigFuture: How to Convert Your GPA to a 4.0 Scale', url: 'https://bigfuture.collegeboard.org/plan-for-college/college-prep/academics/how-to-convert-gpa-4.0-scale' }
  ]
};
