export default {
  slug: 'attendance-percentage-calculator',
  hub: 'education',
  name: 'Attendance Percentage Calculator',
  title: 'Attendance Percentage Calculator: 52 of 70 Classes Is 74.29%',
  h1: 'Attendance Calculator: Your Percentage and Classes Needed for 75%',
  meta: 'Attending 52 of 70 classes is 74.29% attendance; 2 more classes in a row lift it to 75%. See your percentage, classes needed and how many you can still miss.',
  keyword: 'how to calculate attendance percentage',
  also: ['how to calculate percentage for attendance', 'how to calculate percentage attendance', 'how to calculate percentage of attendance', 'how to calculate the attendance percentage', 'how many classes can i miss calculator', '75 attendance calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'attended', label: 'Classes (or days) attended', type: 'number', value: 52 },
    { id: 'total', label: 'Classes (or days) held so far', type: 'number', value: 70 },
    { id: 'req', label: 'Required attendance', type: 'number', value: 75, suffix: '%' },
    { id: 'left', label: 'Classes left this term', type: 'number', value: 30, placeholder: 'optional', help: 'Optional: shows how many of the remaining classes you can miss.' }
  ],
  compute(v, H) {
    var isN = function (x) { return typeof x === 'number' && isFinite(x); };
    if (!(isN(v.total) && v.total > 0)) return { error: 'Enter how many classes have been held.' };
    if (!(isN(v.attended) && v.attended >= 0)) return { error: 'Enter how many classes you attended.' };
    if (v.attended > v.total) return { error: 'Classes attended can\'t be more than classes held.' };
    var a = v.attended, t = v.total, req = isN(v.req) && v.req > 0 && v.req <= 100 ? v.req : 75;
    var pct = a / t * 100;
    var rows = [['Classes missed', H.int(t - a) + ' (' + H.pct((t - a) / t * 100, 2) + ')']];
    var sub;
    if (pct + 1e-9 >= req) {
      var canMiss = Math.floor((100 * a - req * t) / req + 1e-9);
      rows.push(['Classes you can miss in a row and stay at ' + H.num(req, 2) + '%', H.int(canMiss), true]);
      sub = 'You are ' + H.num(pct - req, 2) + ' points above the ' + H.num(req, 2) + '% requirement.';
    } else if (req >= 100) {
      rows.push(['Classes needed to reach 100%', 'not possible after an absence', true]);
      sub = 'Once a class is missed, 100% attendance can\'t be recovered.';
    } else {
      var need = Math.ceil((req * t - 100 * a) / (100 - req) - 1e-9);
      rows.push(['Classes to attend in a row to reach ' + H.num(req, 2) + '%', H.int(need), true]);
      sub = 'You are ' + H.num(req - pct, 2) + ' points below ' + H.num(req, 2) + '%. Attending the next ' + H.plural(need, 'class', 'classes') + ' without a miss gets you there.';
    }
    if (isN(v.left) && v.left > 0) {
      var end = t + v.left, needTotal = Math.ceil(req * end / 100 - 1e-9), mustAttend = needTotal - a;
      rows.push(['Best possible end-of-term attendance', H.pct((a + v.left) / end * 100, 2)]);
      rows.push(['Of the ' + H.int(v.left) + ' classes left, you can miss', mustAttend > v.left ? 'none: ' + H.num(req, 2) + '% is out of reach' : mustAttend <= 0 ? 'all ' + H.int(v.left) : H.int(v.left - mustAttend) + ' (attend at least ' + H.int(mustAttend) + ')']);
    }
    return { value: H.pct(pct, 2), label: 'Attendance percentage', expr: H.int(a) + ' ÷ ' + H.int(t) + ' × 100', rows: rows, sub: sub, pct: pct };
  },
  quick: ({ r }) => `Attendance percentage = classes attended ÷ classes held × 100. Attending 52 of 70 classes gives 52 ÷ 70 × 100 = <strong>${r.value}</strong>, just under a 75% requirement. Attending the next 2 classes in a row brings it to 54 ÷ 72 = exactly 75%. With 30 classes left, you can miss 7 of them and still finish at 75%.`,
  stepsTitle: 'How to calculate your attendance percentage',
  steps: [
    'Count the classes (or school days) held so far, and the number you were marked present for.',
    'Divide attended by held and multiply by 100: 52 ÷ 70 × 100 = 74.29%.',
    'To find the classes needed to reach a target, solve (attended + x) ÷ (held + x) = target. Remember that every class you attend also adds to the total held; forgetting that is the most common mistake.',
    'If you know how many classes are left in the term, multiply the term total by the target to get the classes you must attend overall, then subtract what you have already attended.'
  ],
  formulaTitle: 'What is the attendance percentage formula?',
  formula: {
    expr: 'Attendance % = attended ÷ held × 100<br>Classes needed in a row = ⌈(R × held − 100 × attended) ÷ (100 − R)⌉<br>Classes you can miss = ⌊(100 × attended − R × held) ÷ R⌋',
    vars: [['R', 'required attendance in percent, e.g. 75'], ['held', 'classes or days held so far'], ['⌈ ⌉ / ⌊ ⌋', 'round up / round down to whole classes']]
  },
  example: `<p>Priya has attended 38 of 54 lectures and her college requires 75%.</p>
<p>Attendance: 38 ÷ 54 × 100 = <strong>70.37%</strong>. Classes needed in a row: (75 × 54 − 100 × 38) ÷ 25 = (4,050 − 3,800) ÷ 25 = <strong>10</strong>. Check: 48 ÷ 64 = 75%.</p>
<p>The semester has 36 lectures left (90 in all). She needs 75% of 90 = 67.5, rounded up to 68 lectures, so she must attend 68 − 38 = 30 of the remaining 36 and can miss <strong>6</strong>.</p>`,
  table: {
    title: 'How many classes can I miss and stay above 75%?',
    intro: 'Maximum absences for a whole term, by number of classes in the term and attendance requirement, with the attendance you would end on.',
    head: ['Classes in term', 'At 75%', 'At 80%', 'At 85%', 'At 90%'],
    rows: ({ run }) => [20, 30, 40, 45, 50, 60, 75, 90, 100, 120, 150, 180].map(n => [n, ...[75, 80, 85, 90].map(r => { const miss = Math.floor(n * (100 - r) / 100); return miss + ' (' + run({ attended: n - miss, total: n, req: r, left: NaN }).value + ')'; })]),
    note: 'A 180-day school year is common in U.S. K-12 schools: missing 18 days (10%) there is the usual threshold for chronic absenteeism.'
  },
  sections: [
    {
      h2: 'How many classes do I need to attend to get 75% attendance?',
      html: `<p>Each class you attend raises both the top and bottom of the fraction, so you need more classes than the simple gap suggests. The shortcut for a 75% target: classes needed = 3 × absences − attended. With 18 absences and 52 present, that is 54 − 52 = 2. For 80%, use 4 × absences − attended; for 90%, 9 × absences − attended (if the result is zero or negative, you are already there).</p>
<p>The deeper the hole, the longer the climb: at 60% (30 of 50), reaching 75% takes 30 straight classes.</p>`
    },
    {
      h2: 'How many classes can I skip and still keep 75%?',
      html: `<p>Divide your attended classes by 0.75 and subtract the classes held. With 66 of 80 attended (82.5%), 66 ÷ 0.75 = 88, so 8 more classes could be missed in a row and you would sit at exactly 75%. That is a ceiling, not a plan: one sick week near exams can push you below it, and some colleges also require 75% in each subject, not just overall.</p>`
    },
    {
      h2: 'What attendance percentage counts as chronic absenteeism?',
      html: `<p>For U.S. schools, most states define chronic absenteeism as missing 10% or more of enrolled school days for any reason, excused or not. In a 180-day year that is 18 days, about two days a month, which is attendance of 90% or lower. The U.S. Department of Education's Civil Rights Data Collection uses a fixed count instead: students who miss 15 or more school days in a year.</p>
<p>Research groups such as Attendance Works track it because absences add up quickly: two missed days a month already puts a student in the chronic group by June.</p>`
    },
    {
      h2: 'Do excused absences and late arrivals count?',
      html: `<p>It depends on the school. For chronic absenteeism, excused and unexcused absences both count. Many colleges and universities in India require 75% attendance to sit end-semester exams and may condone a shortfall for documented medical reasons. Some schools convert tardies to absences (for example, three tardies = one absence) or count half days. Check the attendance policy in your handbook before relying on the numbers above.</p>`
    }
  ],
  faq: [
    { q: 'What is 52 out of 70 as an attendance percentage?', a: '52 out of 70 is 74.29% attendance (52 ÷ 70 × 100). Two more classes attended in a row would make it 54 out of 72, exactly 75%.' },
    { q: 'How do I calculate attendance percentage in days?', a: 'Divide days present by days enrolled and multiply by 100. A student present 162 of 180 days has 90% attendance and has missed 10%.' },
    { q: 'Is 75% attendance good?', a: 'It is a common minimum for college exam eligibility, but it means missing one class in four. For K-12 students, anything at or below 90% counts as chronic absenteeism in most states.' },
    { q: 'How do I calculate monthly attendance percentage?', a: 'Use only that month\'s numbers: days present in the month ÷ school days in the month × 100. 19 of 21 days is 90.48%.' },
    { q: 'Can I get 75% attendance if I am at 50% now?', a: 'Yes, if enough classes remain. At 25 of 50, you need (75 × 50 − 100 × 25) ÷ 25 = 50 consecutive classes, so it depends on how many are left in the term.' },
    { q: 'How do I calculate attendance percentage in Excel?', a: 'With attended in A2 and held in B2, use =A2/B2 and format the cell as a percentage. For classes needed to reach 75%, use =MAX(0,ROUNDUP((0.75*B2-A2)/0.25,0)).' }
  ],
  related: ['percentage-calculator', 'test-score-calculator', 'credit-hours-calculator', 'grade-calculator'],
  sources: [
    { name: 'Attendance Works: chronic absence research and definitions', url: 'https://www.attendanceworks.org/' },
    { name: 'U.S. Department of Education: Civil Rights Data Collection', url: 'https://civilrightsdata.ed.gov/' }
  ]
};
