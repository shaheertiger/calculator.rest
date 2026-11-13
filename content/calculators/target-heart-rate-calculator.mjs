export default {
  slug: 'target-heart-rate-calculator',
  hub: 'health',
  name: 'Target Heart Rate Calculator',
  title: 'Target Heart Rate Calculator: Age 45 Zone Is 120–159 bpm',
  h1: 'Target Heart Rate Calculator: Karvonen Zones From Your Resting Pulse',
  meta: 'A 45-year-old with a resting pulse of 65 has a target zone of 120–159 bpm at 50–85% of heart rate reserve (Karvonen). Enter your age and resting heart rate.',
  keyword: 'how do i calculate target heart rate',
  also: ['target heart rate calculator', 'how do you calculate the target heart rate', 'how to calculate heart rate reserve', 'how to calculate your heart rate target zone', 'karvonen formula calculator', 'fat burning heart rate'],
  updated: '2026-11-13',
  inputs: [
    { id: 'age', label: 'Age', type: 'number', value: 45, suffix: 'years' },
    { id: 'rest', label: 'Resting heart rate', type: 'number', value: 65, suffix: 'bpm', help: 'Count your pulse for 60 seconds after waking, before getting up.' },
    { id: 'maxm', label: 'Maximum heart rate from', type: 'select', value: 'fox', options: [['fox', '220 − age'], ['tanaka', '208 − 0.7 × age (Tanaka)'], ['known', 'I know my max heart rate']] },
    { id: 'max', label: 'Your max heart rate', type: 'number', value: 180, suffix: 'bpm', showIf: { maxm: ['known'] } },
    { id: 'lo', label: 'Lower intensity', type: 'number', value: 50, suffix: '%' },
    { id: 'hi', label: 'Upper intensity', type: 'number', value: 85, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.age >= 10 && v.age <= 100)) return { error: 'Enter an age from 10 to 100.' };
    if (!(v.rest >= 30 && v.rest <= 120)) return { error: 'Enter a resting heart rate between 30 and 120 bpm.' };
    var mx = v.maxm === 'known' ? v.max : v.maxm === 'tanaka' ? 208 - 0.7 * v.age : 220 - v.age;
    if (!(mx > v.rest + 20 && mx <= 240)) return { error: 'Max heart rate must be at least 20 bpm above your resting rate.' };
    if (!(v.lo >= 20 && v.hi <= 100 && v.lo < v.hi)) return { error: 'Enter intensities between 20% and 100%, lower first.' };
    var hrr = mx - v.rest;
    var at = function (p) { return v.rest + hrr * p / 100; };
    var lo = at(v.lo), hi = at(v.hi);
    var rows = [
      ['Maximum heart rate', H.int(mx) + ' bpm'],
      ['Heart rate reserve (max − resting)', H.int(hrr) + ' bpm'],
      ['Moderate (40–59% of reserve, ACSM)', H.int(at(40)) + '–' + H.int(at(59)) + ' bpm'],
      ['Vigorous (60–89% of reserve, ACSM)', H.int(at(60)) + '–' + H.int(at(89)) + ' bpm'],
      ['Same % of max HR, no resting rate', H.int(mx * v.lo / 100) + '–' + H.int(mx * v.hi / 100) + ' bpm'],
      ['10-second pulse count', Math.ceil(lo / 6) + '–' + Math.floor(hi / 6) + ' beats', true]
    ];
    var zt = [[50, 60], [60, 70], [70, 80], [80, 90], [90, 100]].map(function (z, i) { return ['Zone ' + (i + 1), z[0] + '–' + z[1] + '%', H.int(at(z[0])) + '–' + H.int(at(z[1])) + ' bpm']; });
    return {
      value: H.int(lo) + '–' + H.int(hi) + ' bpm',
      label: 'Target heart rate at ' + H.num(v.lo, 0) + '–' + H.num(v.hi, 0) + '% of heart rate reserve',
      expr: H.int(v.rest) + ' + (' + H.int(mx) + ' − ' + H.int(v.rest) + ') × ' + H.num(v.lo, 0) + '–' + H.num(v.hi, 0) + '%',
      rows: rows,
      sub: 'Karvonen adds your resting pulse back in, so a fitter heart (lower resting rate) gets a zone that starts lower but reaches the same top. Check by feel too: at the bottom of this zone you can talk easily; near the top, only a few words.',
      table: { head: ['Zone', '% of reserve', 'Heart rate'], rows: zt, caption: 'Karvonen zones for your numbers' },
      lo: lo, hi: hi
    };
  },
  quick: ({ r }) => `To calculate target heart rate with the Karvonen formula, subtract resting heart rate from max (220 − age) to get heart rate reserve, multiply by the intensity, and add the resting rate back. For a 45-year-old with a resting pulse of 65: 175 − 65 = 110; 65 + 110 × 50% = 120 and 65 + 110 × 85% = 159, so the target zone is <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate your target heart rate',
  steps: [
    'Measure your resting heart rate on 3 mornings before getting out of bed and average them: count beats for 60 seconds at your wrist. The example uses 65 bpm.',
    'Estimate maximum heart rate: 220 − 45 = 175 bpm (or 208 − 0.7 × 45 = 177 bpm with Tanaka).',
    'Subtract to get your heart rate reserve: 175 − 65 = 110 bpm. Skipping this step and taking a percentage of max is the most common mix-up; it ignores your fitness.',
    'Multiply the reserve by each intensity and add the resting rate back: 110 × 0.50 + 65 = 120 bpm; 110 × 0.85 + 65 = 158.5, about 159 bpm.',
    'During exercise, count your pulse for 10 seconds and multiply by 6. For this zone that is 20–26 beats in 10 seconds.'
  ],
  formulaTitle: 'What is the Karvonen formula?',
  formula: {
    expr: 'Target HR = (HRmax − HRrest) × intensity % + HRrest<br>Heart rate reserve (HRR) = HRmax − HRrest',
    vars: [['HRmax', 'maximum heart rate (220 − age, Tanaka, or measured)'], ['HRrest', 'resting heart rate in bpm'], ['intensity %', '40–59% moderate, 60–89% vigorous (ACSM)']],
    note: 'The method is named after Finnish physician Martti Karvonen, whose 1957 study used heart rate reserve to set training intensity. The American College of Sports Medicine uses reserve-based ranges in its exercise prescription guidance.'
  },
  example: `<p>A 60-year-old man with a resting pulse of 58 bpm wants a moderate-to-vigorous walking and cycling zone of 60–80%. He uses Tanaka's max: 208 − 0.7 × 60 = <strong>166 bpm</strong>.</p><p>Reserve: 166 − 58 = 108 bpm. Lower limit: 58 + 108 × 0.60 = <strong>123 bpm</strong>. Upper limit: 58 + 108 × 0.80 = <strong>144 bpm</strong>.</p><p>With the simple percent-of-max method and 220 − age, the same 60–80% would be 96–128 bpm, a much easier zone. The difference is his low resting rate, which Karvonen credits and the simple method ignores.</p>`,
  table: {
    title: 'What is my target heart rate by age?',
    intro: 'Target zones at 50–85% intensity for each age, computed with the calculator above using 220 − age. The Karvonen column assumes a resting heart rate of 70 bpm.',
    head: ['Age', 'Max HR', '50–85% of max (AHA chart)', '50–85% of reserve (Karvonen, rest 70)'],
    rows: ({ run, H }) => [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70].map(a => {
      const r = run({ age: a, rest: 70, maxm: 'fox', lo: 50, hi: 85 });
      return [String(a), (220 - a) + ' bpm', H.int((220 - a) * 0.5) + '–' + H.int((220 - a) * 0.85) + ' bpm', r.value];
    }),
    note: 'The AHA chart column applies the percentages straight to maximum heart rate, which is why its zones start much lower. A resting rate below 70 shifts the Karvonen zone down; above 70 shifts it up.'
  },
  sections: [
    {
      h2: 'How do you calculate heart rate reserve?',
      html: `<p>Heart rate reserve is the gap between your maximum and resting heart rate: <strong>HRR = HRmax − HRrest</strong>. It is the range your heart can actually use during exercise. A 45-year-old with an estimated max of 175 and a resting rate of 65 has a reserve of 110 bpm.</p><p>Reserve grows as you get fitter, because training lowers your resting rate while max stays about the same. Two 40-year-olds with the same estimated max of 180 show the effect: with a resting rate of 50, the reserve is 130 and 70% intensity is 141 bpm; with a resting rate of 80, the reserve is 100 and 70% is 150 bpm. The less-fit person's heart has to beat faster for the same relative effort.</p><p>The <a href="/max-heart-rate-calculator">max heart rate calculator</a> compares the formulas for the top of the range if you are unsure which to use.</p>`
    },
    {
      h2: 'How do I find my resting heart rate?',
      html: `<p>Take it first thing in the morning, before coffee and before you get out of bed. Find the pulse on the thumb side of your wrist with two fingers, count for a full 60 seconds (or 30 seconds × 2), and repeat on a few mornings. Use the average.</p><p>The American Heart Association gives 60–100 bpm as the normal resting range for adults; well-trained endurance athletes are often lower. Caffeine, stress, poor sleep, illness, dehydration and some medications raise it. Fitness trackers estimate resting heart rate from readings taken while you sleep and while you are awake and still, so their number is usually close to a manual morning count.</p>`
    },
    {
      h2: 'Should I use Karvonen or percent of max heart rate?',
      html: `<p>Karvonen, if you know your resting heart rate. It personalizes the zone to your fitness, and ACSM's reserve-based ranges (40–59% for moderate, 60–89% for vigorous) are built on it. The simple percent-of-max method is easier and is what the American Heart Association's chart uses: about 50–70% of max for moderate exercise and 70–85% for vigorous.</p><p>The two methods give different numbers for the same percentage because Karvonen's zone sits on top of your resting rate. At age 45 with a resting pulse of 65, 50% of reserve is 120 bpm but 50% of max is only 88 bpm. Pick one method and stick with it; mixing them is the usual reason zones look "wrong."</p>`
    },
    {
      h2: 'How do I check my heart rate during exercise?',
      html: `<p>Slow down briefly, find your pulse at the wrist or the side of the neck (press gently on only one side), count for 10 seconds and multiply by 6, or count for 15 seconds and multiply by 4. Count quickly, because heart rate starts dropping within seconds of slowing down. A chest-strap monitor reads continuously and tends to track fast changes better than a wrist sensor during intervals.</p><p>If your heart rate never reaches the zone, that is not always a problem. The CDC's talk test works without any device: at moderate intensity you can talk but not sing, and at vigorous intensity you can say only a few words before pausing for a breath. If you take a beta blocker or another heart-rate-lowering medication, use perceived effort and ask your doctor for a target.</p>`
    }
  ],
  faq: [
    { q: 'What is my target heart rate?', a: 'For a 45-year-old with a resting pulse of 65, the Karvonen zone at 50–85% intensity is 120–159 bpm. Enter your own age and resting heart rate above for yours.' },
    { q: 'What is a good target heart rate for a 60-year-old?', a: 'By the AHA chart, 80–136 bpm (50–85% of a 160 bpm max). By Karvonen with a resting rate of 70, 115–147 bpm.' },
    { q: 'What is the fat-burning heart rate zone?', a: 'Usually described as about 60–70% of max or the lower part of your target zone. You burn a higher share of fat at easier intensities, but more total calories at harder ones, so total weekly activity matters more for fat loss.' },
    { q: 'What heart rate is moderate intensity?', a: 'ACSM defines moderate as 40–59% of heart rate reserve; the AHA describes it as about 50–70% of maximum heart rate. For a 45-year-old with a resting pulse of 65, that is about 109–130 bpm by the ACSM method.' },
    { q: 'Is a resting heart rate of 50 bad?', a: 'Not usually. Many fit people rest in the 40s or 50s. A low resting rate with dizziness, fainting, fatigue or shortness of breath is worth discussing with a doctor.' },
    { q: 'How does Fitbit calculate resting heart rate?', a: 'Fitbit estimates it from heart rate readings taken while you sleep and while you are awake and still. It is an estimate, but usually close to a careful manual count after waking.' },
    { q: 'Why is my heart rate higher than my target during easy runs?', a: 'Heat, dehydration, caffeine, poor sleep, hills or a max heart rate that is higher than the formula predicts can all push it up. If it happens every time, consider a measured max or use the talk test.' }
  ],
  related: ['max-heart-rate-calculator', 'vo2-max-calculator', 'calories-burned-calculator', 'map-calculator'],
  sources: [
    { name: 'American Heart Association: Target Heart Rates Chart', url: 'https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates' },
    { name: 'Garber CE et al. ACSM Position Stand: Quantity and quality of exercise for adults. Med Sci Sports Exerc 2011', url: 'https://pubmed.ncbi.nlm.nih.gov/21694556/' },
    { name: 'CDC: How to Measure Physical Activity Intensity', url: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html' },
    { name: 'Tanaka H et al. Age-predicted maximal heart rate revisited. J Am Coll Cardiol 2001', url: 'https://pubmed.ncbi.nlm.nih.gov/11153730/' }
  ],
  disclaimer: 'Target zones are estimates for healthy adults, not medical advice. If you have heart disease, high blood pressure or take medication that affects heart rate, ask your doctor what range is safe for you.'
};
