export default {
  slug: 'life-path-number-calculator',
  hub: 'everyday',
  name: 'Life Path Number Calculator',
  title: 'Life Path Number Calculator: Born Jul 14, 1990? You\'re a 4',
  h1: 'Numerology Calculator: Life Path Number From Your Birth Date (and Name)',
  meta: 'Born Jul 14, 1990? 7 + 5 + 1 = 13, and 1 + 3 = 4: life path 4. Reduce any birth date the traditional way, keep master numbers 11, 22 and 33, and score a name.',
  keyword: 'how to calculate numerology number',
  also: ['how to calculate your life path', 'how calculate numerology for name', 'life path number calculator', 'numerology calculator', 'expression number calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'birth', label: 'Birth date', type: 'date', value: '1990-07-14' },
    { id: 'name', label: 'Full birth name (optional)', type: 'text', value: 'Taylor Morgan', placeholder: 'For expression, soul urge and personality numbers' }
  ],
  data: {
    meaning: { 1: 'The Leader: independent, driven', 2: 'The Peacemaker: cooperative, sensitive', 3: 'The Communicator: creative, expressive', 4: 'The Builder: practical, steady, hard-working', 5: 'The Adventurer: restless, freedom-loving', 6: 'The Nurturer: caring, responsible', 7: 'The Seeker: analytical, private', 8: 'The Achiever: ambitious, business-minded', 9: 'The Humanitarian: compassionate, idealistic', 11: 'Master number, The Intuitive: inspiring, sensitive', 22: 'Master number, The Master Builder: visionary and practical', 33: 'Master number, The Master Teacher: selfless, nurturing' }
  },
  compute(v, H, D) {
    var d = H.parseDate(v.birth);
    if (!d) return { error: 'Enter a birth date.' };
    function digits(n) { var s = 0; String(n).split('').forEach(function (c) { s += Number(c) || 0; }); return s; }
    function reduce(n, keep) {
      var steps = [n];
      while (n > 9 && !(keep && (n === 11 || n === 22 || n === 33))) { n = digits(n); steps.push(n); }
      return { n: n, steps: steps };
    }
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
    var rm = reduce(m, true), rd = reduce(day, true), ry = reduce(digits(y), true);
    var total = rm.n + rd.n + ry.n;
    var lp = reduce(total, true);
    var all = reduce(digits(m) + digits(day) + digits(y), true);
    var rows = [
      ['Meaning (traditional)', D.meaning[lp.n], true],
      ['Month ' + m, rm.steps.join(' → ')],
      ['Day ' + day, rd.steps.join(' → ')],
      ['Year ' + y, digits(y) === ry.n ? String(ry.n) : digits(y) + ' → ' + ry.steps.slice(1).join(' → ')],
      ['Sum', total + (lp.steps.length > 1 ? ' → ' + lp.steps.slice(1).join(' → ') : '')]
    ];
    if (all.n !== lp.n) rows.push(['Adding all digits at once', all.n + ' (some numerologists use this; it can hide master numbers)']);
    var nm = String(v.name || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (nm.length) {
      var ex = 0, vo = 0, co = 0;
      nm.split('').forEach(function (c) {
        var val = (c.charCodeAt(0) - 65) % 9 + 1;
        ex += val; if ('AEIOU'.indexOf(c) >= 0) vo += val; else co += val;
      });
      rows.push(['Expression (destiny) number', String(reduce(ex, true).n) + ' (letters total ' + ex + ')']);
      if (vo) rows.push(['Soul urge (vowels)', String(reduce(vo, true).n)]);
      if (co) rows.push(['Personality (consonants)', String(reduce(co, true).n)]);
    }
    return {
      value: String(lp.n),
      label: 'Life path number',
      expr: rm.n + ' + ' + rd.n + ' + ' + ry.n + ' = ' + total,
      rows: rows,
      lp: lp.n,
      sub: 'For entertainment. Numerology is a tradition, not a science, and these numbers don\'t predict personality or the future.'
    };
  },
  quick: ({ r }) => `To calculate your life path number, reduce the month, day and year of birth to single digits, add them, and reduce again, keeping 11, 22 and 33 as master numbers. For Jul 14, 1990: 7, 1 + 4 = 5, and 1 + 9 + 9 + 0 = 19 → 10 → 1. Then 7 + 5 + 1 = 13 → <strong>life path ${r.value}</strong>. It's numerology, so treat it as entertainment.`,
  stepsTitle: 'How to calculate your life path number',
  steps: [
    'Write your birth date as numbers: July 14, 1990 is month 7, day 14, year 1990.',
    'Reduce each part separately by adding its digits until one digit is left, but stop at 11, 22 or 33: 14 → 1 + 4 = 5; 1990 → 19 → 10 → 1.',
    'Add the three results: 7 + 5 + 1 = 13.',
    'Reduce the sum the same way: 1 + 3 = 4. If you land on 11, 22 or 33, keep it. <strong>Where people slip:</strong> adding every digit in one long string, which gives the same single digit but can skip past a master number.'
  ],
  formulaTitle: 'What is the numerology formula?',
  formula: {
    expr: 'Life path = reduce( reduce(month) + reduce(day) + reduce(year) )<br>reduce(n): add the digits of n until 1–9, or stop at 11, 22, 33<br>Name numbers: A=1 … I=9, J=1 … R=9, S=1 … Z=8, then reduce',
    vars: [['Expression number', 'all letters of your full birth name'], ['Soul urge', 'vowels only (A, E, I, O, U)'], ['Personality', 'consonants only']],
    note: 'This is the Pythagorean system used by most Western numerology books. The Chaldean system uses different letter values (1–8), so name numbers from different sites can disagree.'
  },
  example: `<p><strong>Life path for Nov 29, 1985:</strong> month 11 stays 11 (master). Day 29 → 2 + 9 = 11 (master). Year 1985 → 1 + 9 + 8 + 5 = 23 → 5. Sum 11 + 11 + 5 = 27 → 2 + 7 = <strong>9</strong>.</p>
<p><strong>Expression number for "Taylor Morgan":</strong> T2 A1 Y7 L3 O6 R9 = 28; M4 O6 R9 G7 A1 N5 = 32. Total 60 → 6 + 0 = <strong>6</strong>. Vowels A, O, O, A = 1 + 6 + 6 + 1 = 14 → soul urge 5; consonants 46 → personality 1.</p>`,
  table: {
    title: 'How common is each life path number?',
    intro: 'Share of all birth dates from 1950 through 2009 that produce each life path number, counted day by day with the calculator above. Traits are the traditional numerology descriptions.',
    head: ['Life path', 'Traditional label', 'Share of birthdays'],
    rows: ({ run, H, D }) => {
      const counts = {}; let total = 0;
      let d = H.parseDate('1950-01-01');
      const end = H.parseDate('2009-12-31');
      while (d <= end) { const n = run({ birth: H.iso(d), name: '' }).lp; counts[n] = (counts[n] || 0) + 1; total++; d = H.addDays(d, 1); }
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(n => [String(n), D.meaning[n], H.pct((counts[n] || 0) / total * 100, 1)]);
    },
    note: 'Reducing month, day and year separately (the method used here) is what makes 11, 22 and 33 possible at the end; master numbers are kept only when the final sum is exactly 11, 22 or 33.'
  },
  sections: [
    {
      h2: 'What are master numbers 11, 22 and 33?',
      html: `<p>In numerology, 11, 22 and 33 are "master numbers" that are not reduced to 2, 4 and 6. They're said to carry the traits of the single digit in a stronger form: 11 an intuitive version of 2, 22 an ambitious, practical version of 4, and 33 a teaching, caring version of 6.</p>
<p>Whether you get one depends on method. Reducing month, day and year first, as most numerology books do, lets a master number appear at the final step. Some practitioners also keep master numbers that appear in the middle (like the 11 in November); the calculator keeps them at every step, which is the common convention.</p>`
    },
    {
      h2: 'How do you calculate your numerology number from your name?',
      html: `<p>Give each letter a value from the Pythagorean chart, add them up and reduce:</p>
<div class="twrap"><table><thead><tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr></thead><tbody>
<tr><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td>I</td></tr>
<tr><td>J</td><td>K</td><td>L</td><td>M</td><td>N</td><td>O</td><td>P</td><td>Q</td><td>R</td></tr>
<tr><td>S</td><td>T</td><td>U</td><td>V</td><td>W</td><td>X</td><td>Y</td><td>Z</td><td></td></tr>
</tbody></table></div>
<p>All letters of your full birth name give the <strong>expression</strong> (or destiny) number; the vowels alone give the <strong>soul urge</strong>; the consonants give the <strong>personality</strong> number. Traditions differ on whether Y is a vowel; this calculator treats it as a consonant. Numerologists use the name on your birth certificate, not a nickname.</p>`
    },
    {
      h2: 'What does each life path number mean?',
      html: `<p>In popular numerology, the life path is described as your core nature. The usual labels: <strong>1</strong> leader, <strong>2</strong> peacemaker, <strong>3</strong> communicator, <strong>4</strong> builder, <strong>5</strong> adventurer, <strong>6</strong> nurturer, <strong>7</strong> seeker, <strong>8</strong> achiever, <strong>9</strong> humanitarian, plus the master numbers 11, 22 and 33.</p>
<p>These descriptions are broad enough that most people recognize themselves in several of them, a well-known effect in psychology (the Barnum or Forer effect). Read yours for fun and conversation, not for decisions about careers, money or relationships.</p>`
    },
    {
      h2: 'Is numerology real?',
      html: `<p>No scientific evidence shows that numbers derived from birth dates or names predict personality or events. Numerology is a belief system: it borrows from the ancient Pythagoreans' view that numbers underlie reality, but the life path and name methods used today are modern, popularized in the early 20th century.</p>
<p>That's why this page treats it as entertainment. The arithmetic itself is simple and repeatable, which is all a calculator can promise: two people using the same method will always get the same number.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my life path number?', a: 'Reduce your birth month, day and year to single digits (keeping 11, 22 and 33), add them, and reduce the total. Jul 14, 1990 gives 7 + 5 + 1 = 13, and 1 + 3 = 4.' },
    { q: 'What is the life path number for 11/11?', a: 'It depends on the year. Nov 11, 2000 gives 11 + 11 + 2 = 24, and 2 + 4 = 6. Nov 11, 1999 gives 11 + 11 + 1 = 23, which reduces to 5.' },
    { q: 'Which life path number is the rarest?', a: 'Master number 33 is the rarest by far, followed by 22. Among single digits the shares are fairly even; the table above shows each number\'s share of birthdays from 1950 to 2009.' },
    { q: 'Why do different calculators give different numbers?', a: 'They use different methods: some add all the digits at once, some keep master numbers only at the end, and name numbers vary between the Pythagorean and Chaldean letter charts.' },
    { q: 'Is Y a vowel in numerology?', a: 'Traditions differ. Some treat Y as a vowel when it sounds like one (as in "Lynn"). This calculator counts Y as a consonant.' },
    { q: 'Can a life path number be 0?', a: 'No. Every birth date adds up to at least 1, so life path numbers run from 1 to 9, plus the master numbers 11, 22 and 33.' },
    { q: 'Is numerology scientifically proven?', a: 'No. There is no scientific evidence that numerology predicts personality or the future. Use it for fun.' }
  ],
  related: ['birthday-calculator', 'age-calculator', 'day-of-week-calculator', 'anniversary-calculator'],
  sources: [
    { name: 'Encyclopaedia Britannica: Numerology', url: 'https://www.britannica.com/topic/numerology' },
    { name: 'Stanford Encyclopedia of Philosophy: Pythagoreanism', url: 'https://plato.stanford.edu/entries/pythagoreanism/' }
  ],
  disclaimer: 'For entertainment only. Numerology has no scientific basis.'
};
