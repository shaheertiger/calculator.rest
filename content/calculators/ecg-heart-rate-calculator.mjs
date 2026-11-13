export default {
  slug: 'ecg-heart-rate-calculator',
  hub: 'health',
  name: 'ECG Heart Rate Calculator',
  title: 'ECG Heart Rate Calculator: 1500 ÷ 20 Small Boxes = 75 bpm',
  h1: 'ECG Heart Rate Calculator: Small Box, Big Box and 6-Second Methods',
  meta: 'Twenty small boxes between R waves on a 25 mm/s ECG means 1500 ÷ 20 = 75 bpm. Count boxes, QRS complexes or the R-R interval and get the rate and RR time.',
  keyword: 'how to calculate heart rate of ecg',
  also: ['how to calculate the heart rate from an ecg', 'how to calculate hr from ecg strip', 'how to calculate rate ekg', 'ecg heart rate calculator', '1500 method ecg', '6 second method ecg'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'What did you count?', type: 'select', value: 'small', options: [['small', 'Small boxes between two R waves (1500 method)'], ['large', 'Large boxes between two R waves (300 method)'], ['six', 'QRS complexes in 6 seconds (6-second method)'], ['ten', 'QRS complexes on a 10-second 12-lead strip'], ['rr', 'R-R interval in milliseconds']], wide: true },
    { id: 'small', label: 'Small boxes (1 mm each)', type: 'number', value: 20, showIf: { method: ['small'] } },
    { id: 'large', label: 'Large boxes (5 mm each)', type: 'number', value: 4, showIf: { method: ['large'] } },
    { id: 'count', label: 'Number of QRS complexes', type: 'number', value: 7, showIf: { method: ['six', 'ten'] } },
    { id: 'rr', label: 'R-R interval', type: 'number', value: 800, suffix: 'ms', showIf: { method: ['rr'] } },
    { id: 'speed', label: 'Paper speed', type: 'select', value: '25', options: [['25', '25 mm/s (standard)'], ['50', '50 mm/s']], showIf: { method: ['small', 'large'] } }
  ],
  compute(v, H) {
    var f = v.speed === '50' ? 2 : 1;
    var rate, rr, expr;
    if (v.method === 'large') {
      if (!(v.large > 0)) return { error: 'Enter the number of large boxes between two R waves.' };
      rate = 300 * f / v.large; rr = v.large * 0.2 / f;
      expr = (300 * f) + ' ÷ ' + H.num(v.large, 2) + ' large boxes';
    } else if (v.method === 'six' || v.method === 'ten') {
      if (!(v.count >= 0)) return { error: 'Enter how many QRS complexes you counted.' };
      var m = v.method === 'six' ? 10 : 6;
      rate = v.count * m; rr = rate > 0 ? 60 / rate : NaN;
      expr = H.num(v.count, 0) + ' complexes × ' + m;
    } else if (v.method === 'rr') {
      if (!(v.rr > 0)) return { error: 'Enter the R-R interval in milliseconds.' };
      rr = v.rr / 1000; rate = 60 / rr;
      expr = '60,000 ÷ ' + H.num(v.rr, 0) + ' ms';
    } else {
      if (!(v.small > 0)) return { error: 'Enter the number of small boxes between two R waves.' };
      rate = 1500 * f / v.small; rr = v.small * 0.04 / f;
      expr = H.int(1500 * f) + ' ÷ ' + H.num(v.small, 2) + ' small boxes';
    }
    if (rate > 400) return { error: 'That gives a rate above 400 bpm. Check the count and the paper speed.' };
    var rows = [];
    if (rr > 0) {
      rows.push(['R-R interval', H.fix(rr, 2) + ' s (' + H.int(rr * 1000) + ' ms)']);
      rows.push(['Small boxes at 25 mm/s', H.num(rr / 0.04, 1)]);
      rows.push(['Large boxes at 25 mm/s', H.num(rr / 0.2, 2)]);
    }
    var cls = rate < 60 ? 'Bradycardia range (under 60 bpm)' : rate <= 100 ? 'Normal resting range (60–100 bpm)' : 'Tachycardia range (over 100 bpm)';
    rows.unshift(['Rate category', cls, true]);
    var sub = (v.method === 'six' || v.method === 'ten') ? 'Counting complexes works for irregular rhythms such as atrial fibrillation, but gives a rough average.' : 'Box methods assume a regular rhythm. If R-R intervals vary, use the 6-second method instead.';
    return { value: H.num(rate, rate < 100 ? 1 : 0) + ' bpm', label: 'Heart rate', expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate heart rate on an ECG, divide 1,500 by the number of small boxes between two R waves (at the standard 25 mm/s). With <strong>20 small boxes</strong>, 1500 ÷ 20 = <strong>${r.value}</strong>. Or divide 300 by the large boxes (300 ÷ 4 = 75), or count QRS complexes in 6 seconds and multiply by 10. Normal resting rate is 60–100 bpm.`,
  stepsTitle: 'How to calculate heart rate from an ECG strip',
  steps: [
    'Check the paper speed. Almost all ECGs run at 25 mm/s, where one small box (1 mm) is 0.04 seconds and one large box (5 mm) is 0.20 seconds.',
    'Decide whether the rhythm is regular: measure two or three R-R intervals. If they match, use a box method; if not, use the 6-second method.',
    'Regular rhythm: count the small boxes between two consecutive R waves and divide 1,500 by that number. For a quick estimate, divide 300 by the large boxes.',
    'Irregular rhythm: count the QRS complexes in a 6-second stretch (30 large boxes) and multiply by 10. On a standard 10-second 12-lead, count the rhythm strip and multiply by 6.',
    'At 50 mm/s paper speed, double the constants: 3,000 ÷ small boxes or 600 ÷ large boxes. Using 1,500 on fast paper halves the true rate.'
  ],
  formulaTitle: 'What are the ECG heart rate formulas?',
  formula: {
    expr: 'HR = 1500 ÷ small boxes between R waves<br>HR = 300 ÷ large boxes between R waves<br>HR = QRS complexes in 6 s × 10<br>HR = 60 ÷ R-R interval (s)',
    vars: [['1500', 'small boxes per minute at 25 mm/s (25 × 60)'], ['300', 'large boxes per minute at 25 mm/s (1500 ÷ 5)'], ['6-second strip', '30 large boxes at 25 mm/s'], ['R-R interval', 'time between two consecutive R waves']],
    note: 'All four are the same idea: 60 seconds divided by the time between beats. At 50 mm/s the paper moves twice as fast, so the constants become 3,000 and 600.'
  },
  example: `<p><strong>Regular strip:</strong> R waves are 17 small boxes apart. HR = 1500 ÷ 17 = <strong>88.2 bpm</strong>. Quick check with large boxes: 17 small boxes is 3.4 large boxes, and 300 ÷ 3.4 = 88.2.</p>
<p><strong>Irregular strip:</strong> a patient in atrial fibrillation has 11 QRS complexes in 6 seconds. HR ≈ 11 × 10 = <strong>110 bpm</strong>, in the tachycardia range.</p>
<p><strong>From the R-R interval:</strong> a monitor reads R-R = 1,250 ms. HR = 60 ÷ 1.25 = <strong>48 bpm</strong>, bradycardia.</p>`,
  table: {
    title: 'What heart rate does each number of boxes give?',
    intro: 'Heart rate by the number of boxes between two R waves, calculated by the tool above. The first rows give the 300-150-100-75-60-50 sequence many students memorize.',
    head: ['Large boxes', 'Small boxes', 'R-R interval', 'Rate at 25 mm/s', 'Rate at 50 mm/s'],
    rows: ({ run }) => [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10].map(n => {
      const a = run({ method: 'large', large: n, speed: '25' });
      const b = run({ method: 'large', large: n, speed: '50' });
      return [String(n), String(n * 5), (n * 0.2).toFixed(2) + ' s', a.value, b.value || '— (over 400)'];
    }),
    note: 'Between the memorized values, use the 1500 method for precision: 3.5 large boxes is 17.5 small boxes and 85.7 bpm.'
  },
  sections: [
    {
      h2: 'Which ECG heart rate method is most accurate?',
      html: `<p>For a regular rhythm, the <strong>1500 method</strong> is the most precise because each small box is a 0.04-second step. The <strong>300 method</strong> is faster but coarse: with R waves between the third and fourth large box, it tells you only that the rate is between 75 and 100.</p>
<p>The <strong>6-second method</strong> is the least precise for regular rhythms, since one extra or missing complex changes the answer by 10 bpm, but it is the only one of the three that handles irregular rhythms. Monitors calculate rate from averaged R-R intervals, which is why their number can differ from a single hand count.</p>`
    },
    {
      h2: 'How do you calculate heart rate when the rhythm is irregular?',
      html: `<p>Box methods measure a single beat-to-beat interval, so in atrial fibrillation, frequent ectopic beats or second-degree block they can give any answer depending on which pair of R waves you pick. Count complexes over a fixed time instead:</p>
<ul>
<li>Mark 6 seconds (30 large boxes at 25 mm/s; many strips have 3-second tick marks at the top) and multiply the QRS count by 10.</li>
<li>On a standard 12-lead ECG, the rhythm strip at the bottom covers 10 seconds: multiply its QRS count by 6.</li>
</ul>
<p>Count a complex only if its R wave falls inside the window. To report the range, also measure the shortest and longest R-R intervals: 1500 ÷ 12 = 125 bpm and 1500 ÷ 25 = 60 bpm would be described as a ventricular rate varying from 60 to 125.</p>`
    },
    {
      h2: 'What heart rate is normal on an ECG?',
      html: `<p>The American Heart Association describes a normal resting adult heart rate as 60 to 100 beats per minute. Below 60 is <strong>bradycardia</strong>, which can be normal in athletes and during sleep, and above 100 is <strong>tachycardia</strong>, common with exercise, fever, pain or dehydration.</p>
<p>The rate alone does not name the rhythm. A rate of 75 can be normal sinus rhythm or a regular junctional or paced rhythm; you also need to check P waves, the PR interval and QRS width. For training-zone heart rates rather than ECG reading, see the <a href="/target-heart-rate-calculator">target heart rate calculator</a>.</p>`
    },
    {
      h2: 'How do you measure the atrial rate separately?',
      html: `<p>Use the same formulas with P waves instead of R waves. Count small boxes between two consecutive P waves and divide 1,500 by that number. This matters when the atria and ventricles beat at different rates, as in atrial flutter (often an atrial rate near 300 with a ventricular rate of 150 at 2:1 conduction) or complete heart block, where P waves march through at their own rate.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate heart rate on an ECG with small squares?', a: 'Divide 1,500 by the number of small squares between two consecutive R waves. With 25 small squares, 1500 ÷ 25 = 60 bpm.' },
    { q: 'How many seconds is one small box on an ECG?', a: 'At the standard 25 mm/s, one small box is 0.04 seconds and one large box (5 small boxes) is 0.20 seconds. Five large boxes make one second.' },
    { q: 'What is the 6-second method?', a: 'Count the QRS complexes in a 6-second strip (30 large boxes) and multiply by 10. Seven complexes gives about 70 bpm. Use it for irregular rhythms.' },
    { q: 'How do you calculate heart rate from the R-R interval?', a: 'Divide 60 by the R-R interval in seconds, or 60,000 by the interval in milliseconds. An R-R interval of 0.8 seconds is 75 bpm.' },
    { q: 'What changes at 50 mm/s paper speed?', a: 'Each box represents half the time, so use 3,000 ÷ small boxes or 600 ÷ large boxes. Twenty small boxes at 50 mm/s is 150 bpm, not 75.' },
    { q: 'Why does the 300 method give 300, 150, 100, 75, 60, 50?', a: 'Those are 300 divided by 1, 2, 3, 4, 5 and 6 large boxes. If the next R wave lands on a heavy line, you can read the rate straight from the sequence.' },
    { q: 'Is 75 bpm on an ECG normal?', a: 'Yes, 75 bpm is within the 60–100 bpm normal resting range. Whether the rhythm itself is normal depends on the P waves, intervals and QRS shape.' }
  ],
  related: ['max-heart-rate-calculator', 'target-heart-rate-calculator', 'map-calculator', 'cardiac-output-calculator'],
  sources: [
    { name: 'StatPearls (NCBI Bookshelf): Electrocardiogram', url: 'https://www.ncbi.nlm.nih.gov/books/NBK549803/' },
    { name: 'Open RN: Nursing Advanced Skills, basic ECG interpretation (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK594492/' },
    { name: 'American Heart Association: Bradycardia (slow heart rate)', url: 'https://www.heart.org/en/health-topics/arrhythmia/about-arrhythmia/bradycardia--slow-heart-rate' },
    { name: 'American Heart Association: Tachycardia (fast heart rate)', url: 'https://www.heart.org/en/health-topics/arrhythmia/about-arrhythmia/tachycardia--fast-heart-rate' }
  ],
  disclaimer: 'A study aid for reading rhythm strips, not a diagnostic tool. ECGs from real patients should be interpreted by a qualified clinician.'
};
