export default {
  slug: 'max-heart-rate-calculator',
  hub: 'health',
  name: 'Max Heart Rate Calculator',
  title: 'Max Heart Rate Calculator: Age 30 Is 190 bpm (220 − Age)',
  h1: 'Max Heart Rate Calculator: Five Formulas and Your Training Zones',
  meta: 'At age 30, 220 − age puts max heart rate at 190 bpm; Tanaka\'s formula says 187 and Gulati\'s for women 180. Compare formulas and see your 5 zones.',
  keyword: 'how to calculate max heart rate',
  also: ['max heart rate calculator', 'how do you calculate the maximum heart rate', 'maximum heart rate by age', '220 minus age', 'tanaka formula max heart rate', 'how to calculate max hr from 30 min lthr test', 'heart rate zones calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'age', label: 'Age', type: 'number', value: 30, suffix: 'years' },
    { id: 'sex', label: 'Sex', type: 'select', value: 'female', options: [['female', 'Female'], ['male', 'Male']] },
    { id: 'f', label: 'Formula for zones', type: 'select', value: 'fox', wide: true, options: [['fox', '220 − age (Fox, the classic)'], ['tanaka', '208 − 0.7 × age (Tanaka 2001)'], ['gellish', '207 − 0.7 × age (Gellish 2007)'], ['nes', '211 − 0.64 × age (Nes, HUNT 2013)'], ['gulati', '206 − 0.88 × age (Gulati 2010, women)']] },
    { id: 'measured', label: 'Measured max HR (optional)', type: 'number', value: '', suffix: 'bpm', placeholder: 'from a test or race', help: 'If you know it, this overrides the formula.' }
  ],
  compute(v, H) {
    var a = v.age;
    if (!(a >= 10 && a <= 100)) return { error: 'Enter an age from 10 to 100.' };
    var all = {
      fox: 220 - a,
      tanaka: 208 - 0.7 * a,
      gellish: 207 - 0.7 * a,
      nes: 211 - 0.64 * a,
      gulati: 206 - 0.88 * a
    };
    var names = { fox: '220 − age', tanaka: 'Tanaka', gellish: 'Gellish', nes: 'Nes (HUNT)', gulati: 'Gulati (women)' };
    var exprs = { fox: '220 − ' + a, tanaka: '208 − 0.7 × ' + a, gellish: '207 − 0.7 × ' + a, nes: '211 − 0.64 × ' + a, gulati: '206 − 0.88 × ' + a };
    var key = names[v.f] ? v.f : 'fox';
    var useMeasured = v.measured >= 100 && v.measured <= 240;
    var mx = useMeasured ? v.measured : all[key];
    var rows = [];
    ['fox', 'tanaka', 'gellish', 'nes', 'gulati'].forEach(function (k) {
      if (k === 'gulati' && v.sex === 'male' && key !== 'gulati') return;
      rows.push([names[k], H.int(all[k]) + ' bpm', !useMeasured && k === key]);
    });
    if (useMeasured) rows.unshift(['Your measured max', H.int(v.measured) + ' bpm', true]);
    var z = [[1, 'Very light / recovery', 50, 60], [2, 'Light / endurance base', 60, 70], [3, 'Moderate / aerobic', 70, 80], [4, 'Hard / threshold', 80, 90], [5, 'Maximum effort', 90, 100]];
    var tableRows = z.map(function (q) { return ['Zone ' + q[0], q[1], q[2] + '–' + q[3] + '%', H.int(mx * q[2] / 100) + '–' + H.int(mx * q[3] / 100) + ' bpm']; });
    var spread = Math.max(all.fox, all.tanaka, all.nes) - Math.min(all.fox, all.tanaka, all.nes);
    return {
      value: H.int(mx) + ' bpm',
      label: useMeasured ? 'Measured maximum heart rate' : 'Estimated maximum heart rate · ' + names[key],
      expr: useMeasured ? 'measured' : exprs[key],
      rows: rows,
      sub: 'The general formulas disagree by ' + H.int(spread) + ' bpm at age ' + a + ', and real people often differ from any of them by 10 bpm or more. AHA moderate intensity is 50–70% of max (' + H.int(mx * 0.5) + '–' + H.int(mx * 0.7) + ' bpm); vigorous is 70–85% (' + H.int(mx * 0.7) + '–' + H.int(mx * 0.85) + ' bpm).',
      table: { head: ['Zone', 'Effort', '% of max', 'Heart rate'], rows: tableRows, caption: 'Training zones from ' + H.int(mx) + ' bpm' },
      all: all
    };
  },
  quick: ({ r }) => `To calculate max heart rate, subtract your age from 220. For a 30-year-old, 220 − 30 = <strong>${r.value}</strong>. Tanaka's research-based formula, 208 − 0.7 × age, gives 187 bpm, and Gulati's formula for women, 206 − 0.88 × age, gives 180 bpm. Every formula is an estimate: individual max heart rates commonly differ by 10 bpm or more.`,
  stepsTitle: 'How to calculate your max heart rate',
  steps: [
    'Use 220 − age for a quick estimate: 220 − 30 = 190 bpm. This is the formula the American Heart Association uses in its target heart rate chart.',
    'For a better estimate across ages, use Tanaka: 208 − (0.7 × age). At 30, 208 − 21 = 187 bpm; at 60, it gives 166 bpm, six beats higher than 220 − age.',
    'Women can cross-check with Gulati: 206 − (0.88 × age). At 30, 206 − 26.4 = 179.6, about 180 bpm.',
    'Multiply your max by zone percentages: 60–70% for easy endurance work (114–133 bpm at a 190 max), 80–90% for hard intervals.',
    'If your watch regularly shows sustained heart rates above your estimate during hard efforts, the formula is low for you. Enter your highest reliably recorded number in "Measured max HR" instead.'
  ],
  formulaTitle: 'What are the maximum heart rate formulas?',
  formula: {
    expr: 'Fox: HRmax = 220 − age<br>Tanaka: HRmax = 208 − 0.7 × age<br>Gellish: HRmax = 207 − 0.7 × age<br>Nes: HRmax = 211 − 0.64 × age<br>Gulati (women): HRmax = 206 − 0.88 × age',
    vars: [['HRmax', 'maximum heart rate in beats per minute (bpm)'], ['age', 'age in years']],
    note: 'Tanaka pooled 351 studies covering 18,712 people and confirmed the result in a lab study of 514 adults. Gulati derived her equation from treadmill tests of 5,437 women; Nes from 3,320 Norwegian adults in the HUNT Fitness Study; Gellish from repeated tests of the same people over years.'
  },
  example: `<p>A 52-year-old woman wants her zones for a new running plan.</p><p>220 − 52 = <strong>168 bpm</strong>. Tanaka: 208 − 0.7 × 52 = <strong>171.6 bpm</strong>. Gulati: 206 − 0.88 × 52 = <strong>160.2 bpm</strong>.</p><p>The three estimates span 11 bpm, so her zone 2 (60–70%) could be 96–112 bpm (Gulati) or 103–120 bpm (Tanaka). A sensible approach is to start with the middle estimate and adjust using the talk test: in zone 2 she should be able to speak in full sentences.</p>`,
  table: {
    title: 'What is the maximum heart rate by age?',
    intro: 'Estimated maximum heart rate in beats per minute for each formula, computed with the calculator above.',
    head: ['Age', '220 − age', 'Tanaka', 'Nes (HUNT)', 'Gulati (women)'],
    rows: ({ run, H }) => [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(a => {
      const r = run({ age: a, sex: 'female', f: 'fox', measured: NaN });
      return [String(a), H.int(r.all.fox), H.int(r.all.tanaka), H.int(r.all.nes), H.int(r.all.gulati)];
    }),
    note: '220 − age and Tanaka agree at age 40. Below 40, 220 − age is higher; above 40, it is lower, by 12 bpm at age 80. Nes found earlier equations underestimated measured max heart rate in people over 30.'
  },
  sections: [
    {
      h2: 'Which max heart rate formula is the most accurate?',
      html: `<p>For a general adult population, Tanaka's 208 − 0.7 × age is the best-supported single formula. In 2001, Tanaka, Monahan and Seals pooled group results from 351 studies with 18,712 participants and found max heart rate fell with age along 208 − 0.7 × age; a separate lab study of 514 healthy adults produced an almost identical 209 − 0.7 × age. They found the line did not differ between men and women or between active and sedentary people, and concluded that 220 − age underestimates max heart rate in older adults.</p><p>Later large studies landed close by. Gellish's longitudinal data gave 207 − 0.7 × age. The Norwegian HUNT study of 3,320 adults gave 211 − 0.64 × age and reported a standard error of 10.8 beats per minute, meaning a big share of people sit more than 10 bpm away from the line.</p><p>For women, Gulati's 2010 study of 5,437 women who completed symptom-limited treadmill tests found peak heart rate averaged 206 − 0.88 × age and concluded that the traditional male-based formula overestimates max heart rate in women. Her line sits about 10 bpm below 220 − age at 30 and grows further below Tanaka's line with every decade.</p><p>So: use Tanaka (or Nes) if you want one number, use Gulati as a cross-check if you are a woman, and treat any formula as a starting point rather than a measurement.</p>`
    },
    {
      h2: 'Where does 220 minus age come from?',
      html: `<p>It is usually credited to a 1971 review by Fox, Naughton and Haskell on physical activity and heart disease. The line was drawn through data from roughly a dozen earlier studies rather than produced by a formal regression on a large sample, a point exercise physiologists Robert Robergs and Roberto Landwehr laid out in a 2002 paper on the formula's history. It stuck because it is easy to remember.</p><p>It is not useless: it lands close to research-based formulas for people around 30 to 50. It drifts at the ends of the age range, reading too high for people in their 20s and too low for people over 50 compared with Tanaka. At age 70, 220 − age says 150 bpm; Tanaka says 159.</p>`
    },
    {
      h2: 'How do you find your true maximum heart rate?',
      html: `<p>The accurate way is a graded exercise test: a treadmill or bike test in a clinic or sports lab where the workload rises every few minutes until you cannot continue, with ECG monitoring. It is the safest option if you are older, have heart disease risk factors or have been inactive.</p><p>Healthy, regularly active people sometimes estimate it in the field. A common approach is a thorough warm-up followed by several minutes of steadily harder running or cycling, finishing with an all-out final minute or two, often uphill, while wearing a chest-strap monitor (wrist sensors can lag during hard surges). The highest reliable reading is close to your max. The final sprint of a hard 5K race often shows a similar number.</p><p>Do not attempt a max test if you have chest pain, dizziness or shortness of breath with exertion, a known heart condition, or you take medication that affects heart rate. The American Heart Association notes that some blood pressure medications lower maximum heart rate and target zones; ask your doctor what range to use.</p>`
    },
    {
      h2: 'How do you calculate max HR from a 30-minute LTHR test?',
      html: `<p>You don't, at least not reliably. The popular 30-minute field test, associated with coach Joe Friel, measures <strong>lactate threshold heart rate (LTHR)</strong>: you ride or run alone as hard as you can sustain for 30 minutes, and your average heart rate over the last 20 minutes is your LTHR. Lactate threshold sits below maximum heart rate, and the gap between the two varies from person to person, so dividing LTHR by a fixed percentage only gives a rough guess at max.</p><p>The better approach is to use LTHR directly. Training plans built on LTHR set zones as percentages of that number instead of max, which avoids the error in age-based formulas altogether. If you want Karvonen-style zones that account for your resting pulse, use the <a href="/target-heart-rate-calculator">target heart rate calculator</a>.</p>`
    },
    {
      h2: 'What are the 5 heart rate zones based on max heart rate?',
      html: `<div class="twrap"><table><thead><tr><th>Zone</th><th>% of max</th><th>At 190 bpm max</th><th>What it feels like</th></tr></thead><tbody>
<tr><td>1. Very light</td><td>50–60%</td><td>95–114 bpm</td><td>Warm-up, recovery, easy walking</td></tr>
<tr><td>2. Light</td><td>60–70%</td><td>114–133 bpm</td><td>Conversational; builds endurance</td></tr>
<tr><td>3. Moderate</td><td>70–80%</td><td>133–152 bpm</td><td>Short sentences only</td></tr>
<tr><td>4. Hard</td><td>80–90%</td><td>152–171 bpm</td><td>A few words at a time; threshold work</td></tr>
<tr><td>5. Maximum</td><td>90–100%</td><td>171–190 bpm</td><td>Short intervals; can't talk</td></tr>
</tbody></table></div><p>The American Heart Association defines moderate exercise as about 50–70% of maximum heart rate and vigorous exercise as about 70–85%. The CDC's talk test is a handy check: during moderate activity you can talk but not sing; during vigorous activity you can say only a few words before pausing for breath. The calculator above prints these zones for any age or formula.</p>`
    },
    {
      h2: 'Does maximum heart rate change with fitness?',
      html: `<p>Very little. Max heart rate is mostly set by age and genetics; Tanaka found it was not influenced by habitual physical activity. Training lowers your resting heart rate and lets you work harder at the same heart rate, but it does not meaningfully raise your ceiling. A high max heart rate is not a sign of fitness, and a low one is not a sign of poor fitness.</p><p>It does fall with age: about 0.7 bpm a year in Tanaka's formula, or 7 bpm per decade. Fitness shows up instead in your resting pulse and in how much oxygen you can use at max, which the <a href="/vo2-max-calculator">VO2 max calculator</a> estimates.</p>`
    }
  ],
  faq: [
    { q: 'What is the max heart rate for a 40-year-old?', a: 'About 180 bpm. Both 220 − 40 and Tanaka\'s 208 − 0.7 × 40 give 180 bpm; Gulati\'s formula for women gives about 171 bpm.' },
    { q: 'What is the max heart rate for a 50-year-old?', a: '170 bpm by 220 − age, 173 bpm by Tanaka and about 162 bpm by Gulati\'s formula for women.' },
    { q: 'What is the max heart rate for a 60-year-old?', a: '160 bpm by 220 − age and 166 bpm by Tanaka. For a 60-year-old woman, Gulati\'s formula gives about 153 bpm.' },
    { q: 'Is it dangerous to exceed your max heart rate?', a: 'Seeing a number above a formula estimate usually means the formula is wrong for you, not that you are in danger. If a high heart rate comes with chest pain, dizziness, fainting or unusual breathlessness, stop and seek medical care.' },
    { q: 'Is the max heart rate formula different for women?', a: 'Gulati\'s 2010 study of 5,437 women found peak heart rate averaged 206 − 0.88 × age, lower than 220 − age at every age (about 10 bpm lower at 30). Tanaka\'s analysis found no sex difference, so many people use both as a range.' },
    { q: 'How accurate is 220 minus age?', a: 'It is a rough estimate. It matches research formulas around age 40 but reads high for young adults and low for older adults, and individuals commonly differ from any formula by 10 bpm or more.' },
    { q: 'Do beta blockers change max heart rate?', a: 'Yes. Beta blockers and some other heart and blood pressure medications lower both resting and maximum heart rate, so age-based zones may be too high. Ask your doctor for a target range.' },
    { q: 'What heart rate is too high when exercising?', a: 'There is no single number. Staying at or below about 85% of your estimated max covers vigorous exercise for most people; going higher in short intervals is normal for trained, healthy people. Symptoms matter more than the number.' }
  ],
  related: ['target-heart-rate-calculator', 'vo2-max-calculator', 'calories-burned-calculator', 'ecg-heart-rate-calculator'],
  sources: [
    { name: 'Tanaka H, Monahan KD, Seals DR. Age-predicted maximal heart rate revisited. J Am Coll Cardiol 2001', url: 'https://pubmed.ncbi.nlm.nih.gov/11153730/' },
    { name: 'Gulati M et al. Heart rate response to exercise stress testing in asymptomatic women. Circulation 2010', url: 'https://pubmed.ncbi.nlm.nih.gov/20585008/' },
    { name: 'Nes BM et al. Age-predicted maximal heart rate in healthy subjects: the HUNT Fitness Study. Scand J Med Sci Sports 2013', url: 'https://pubmed.ncbi.nlm.nih.gov/22376273/' },
    { name: 'Gellish RL et al. Longitudinal modeling of the relationship between age and maximal heart rate. Med Sci Sports Exerc 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/17468581/' },
    { name: 'American Heart Association: Target Heart Rates Chart', url: 'https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates' },
    { name: 'CDC: How to Measure Physical Activity Intensity', url: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html' }
  ],
  disclaimer: 'Heart rate formulas give estimates for healthy people, not medical advice. If you have a heart condition, take heart-rate-lowering medication or have symptoms with exercise, get medical clearance before vigorous training.'
};
