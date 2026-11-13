export default {
  slug: 'stride-length-calculator',
  hub: 'health',
  name: 'Stride Length Calculator',
  title: 'Stride Length Calculator: 5\'5" Woman ≈ 26.8 in, 2,360 Steps/Mile',
  h1: 'Stride Length Calculator: From Your Height or a Measured Walk',
  meta: 'A 5 ft 5 in woman has an estimated walking stride (step) of 26.8 in, about 2,360 steps per mile. Use height or a measured walk to get steps per mile and km.',
  keyword: 'how do i calculate stride length',
  also: ['stride length calculator', 'step length calculator', 'how many steps in a mile calculator', 'average stride length by height', 'steps to miles calculator', 'how to measure stride length for fitbit'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Method', type: 'select', value: 'height', options: [['height', 'Estimate from my height'], ['walk', 'I measured a walk (most accurate)']], wide: true },
    { id: 'sex', label: 'Sex', type: 'select', value: 'f', options: [['f', 'Female (height × 0.413)'], ['m', 'Male (height × 0.415)']], showIf: { method: ['height'] } },
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'US (ft, in)'], ['metric', 'Metric (cm, m)']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { method: ['height'], units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 5, suffix: 'in', showIf: { method: ['height'], units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 165, suffix: 'cm', showIf: { method: ['height'], units: ['metric'] } },
    { id: 'dist', label: 'Distance walked', type: 'number', value: 100, suffix: 'ft or m', showIf: { method: ['walk'] }, help: 'Feet if you chose US units, meters if metric.' },
    { id: 'steps', label: 'Steps counted over that distance', type: 'number', value: 45, showIf: { method: ['walk'] } }
  ],
  compute(v, H) {
    var us = v.units !== 'metric';
    var stepIn, how;
    if (v.method === 'walk') {
      if (!(v.dist > 0) || !(v.steps >= 1)) return { error: 'Enter the distance you walked and the number of steps.' };
      var distIn = us ? v.dist * 12 : v.dist * 100 / 2.54;
      stepIn = distIn / v.steps;
      how = H.num(v.dist, 1) + (us ? ' ft' : ' m') + ' ÷ ' + H.num(v.steps, 0) + ' steps';
    } else {
      var hIn = us ? (v.ft || 0) * 12 + (v.inch || 0) : v.cm / 2.54;
      if (!(hIn >= 36 && hIn <= 96)) return { error: 'Enter a height between 3 ft and 8 ft (91–244 cm).' };
      var k = v.sex === 'm' ? 0.415 : 0.413;
      stepIn = hIn * k;
      how = (us ? H.num(hIn, 1) + ' in' : H.num(v.cm, 1) + ' cm') + ' × ' + k;
    }
    if (!(stepIn >= 8 && stepIn <= 90)) return { error: 'That works out to an unusual step length. Check the distance and step count.' };
    var cm = stepIn * 2.54;
    var perMile = 63360 / stepIn, perKm = 100000 / cm;
    return {
      value: us ? H.num(stepIn, 1) + ' in' : H.num(cm, 1) + ' cm',
      label: 'Step length (what Fitbit and most pedometers call stride length)',
      expr: how,
      rows: [
        ['Steps per mile', H.int(perMile), true],
        ['Steps per kilometer', H.int(perKm)],
        ['In other units', us ? H.num(cm, 1) + ' cm · ' + H.fix(stepIn / 12, 2) + ' ft' : H.num(stepIn, 1) + ' in · ' + H.fix(cm / 100, 2) + ' m'],
        ['Full gait stride (two steps)', us ? H.num(stepIn * 2, 1) + ' in' : H.num(cm * 2, 1) + ' cm'],
        ['Distance in 10,000 steps', H.fix(10000 / perMile, 2) + ' mi (' + H.fix(10000 / perKm, 2) + ' km)']
      ],
      sub: v.method === 'walk' ? 'Measured from your own walk, so it reflects your real pace. Repeat it two or three times and average for best results.' : 'Height-based estimates are a starting point; real step length varies with pace, leg length and terrain.'
    };
  },
  quick: ({ r }) => `The quickest way to calculate stride length is height × 0.413 for women or × 0.415 for men. A <strong>5 ft 5 in</strong> (65-inch) woman's walking stride is about 65 × 0.413 = <strong>${r.value}</strong>, which is 2,360 steps per mile. For a more accurate number, walk a measured distance, count your steps and divide the distance by the steps.`,
  stepsTitle: 'How to measure your stride length',
  steps: [
    'Mark out a known distance on a flat surface: 100 feet with a tape measure, 30 meters, or one 400-meter lap of a running track in lane 1.',
    'Start walking a few steps before the line so you reach your normal pace, then count every step until you cross the finish.',
    'Divide the distance by the number of steps. 100 ft = 1,200 in, so 45 steps gives 1,200 ÷ 45 = 26.7 in per step.',
    'Repeat two or three times and average. <strong>Measure walking and running separately</strong>; your running step is much longer, and using one number for both throws off distance tracking.',
    'Enter the result in your fitness tracker\'s profile, or use the steps per mile to convert step counts to distance.'
  ],
  formulaTitle: 'What is the formula for stride length?',
  formula: {
    expr: 'Step length ≈ height × 0.413 (women) or × 0.415 (men)<br>Step length = distance ÷ steps<br>Steps per mile = 63,360 in ÷ step length (in)<br>Steps per km = 100,000 cm ÷ step length (cm)',
    vars: [['step length', 'heel-to-heel distance of one step, called "stride" by most pedometers'], ['0.413 / 0.415', 'rule-of-thumb ratios long used by pedometer makers'], ['63,360', 'inches in a mile'], ['100,000', 'centimeters in a kilometer']],
    note: 'The height ratios are a widely used rule of thumb rather than a measured law; individual step length varies by several inches at the same height. A measured walk beats any formula.'
  },
  example: `<p><strong>Height method:</strong> a 6 ft 0 in (72-inch) man: 72 × 0.415 = <strong>29.9 in</strong> (75.9 cm). Steps per mile = 63,360 ÷ 29.88 = <strong>2,120</strong>.</p>
<p><strong>Measured method:</strong> on a 400 m track he counts 520 steps walking. Step length = 40,000 cm ÷ 520 = <strong>76.9 cm</strong> (30.3 in), close to the estimate. Running the same lap takes 330 steps, a 121.2 cm (47.7 in) step and only about 1,330 steps per mile.</p>
<p>His 9,000 daily steps at the walking length cover 9,000 ÷ 2,093 ≈ <strong>4.3 miles</strong>.</p>`,
  table: {
    title: 'What is the average stride length by height?',
    intro: 'Estimated walking step length and steps per mile by height, using the 0.413 (women) and 0.415 (men) ratios in the calculator above.',
    head: ['Height', 'Women: step', 'Women: steps/mile', 'Men: step', 'Men: steps/mile'],
    rows: ({ run }) => [58, 60, 62, 63, 64, 65, 66, 68, 69, 70, 72, 74, 76, 78].map(i => {
      const base = { method: 'height', units: 'us', ft: Math.floor(i / 12), inch: i % 12 };
      const f = run({ ...base, sex: 'f' }), m = run({ ...base, sex: 'm' });
      return [Math.floor(i / 12) + "' " + (i % 12) + '"', f.value, f.rows[0][1], m.value, m.rows[0][1]];
    }),
    note: 'CDC measurements put the average U.S. woman at 63.5 inches and man at 68.9 inches, giving estimated steps of about 26.2 and 28.6 inches.'
  },
  sections: [
    {
      h2: 'What is the difference between step length and stride length?',
      html: `<p>In gait science, a <strong>step</strong> is the distance from one foot's heel strike to the other foot's heel strike, and a <strong>stride</strong> is a full cycle, from one heel strike to the next strike of the same foot. A stride is therefore two steps.</p>
<p>Fitness trackers and pedometers use "stride length" to mean one step, because they count each footfall. That is the number this calculator gives first. If a physical therapist or a running coach asks for stride length, check which they mean; the full gait stride appears in the results as well.</p>`
    },
    {
      h2: 'How many steps are in a mile?',
      html: `<p>For most adults walking, about <strong>2,000 to 2,500 steps</strong>: taller people and faster walkers take fewer, shorter people more. The formula is 63,360 inches divided by your step length, so a 26-inch step means 2,437 steps and a 30-inch step 2,112.</p>
<p>Running lengthens each step, often to 40 inches or more, which cuts a mile to roughly 1,300–1,600 steps depending on speed. That gap is why trackers that use a single stride setting for every activity misjudge distance on runs.</p>
<p>At the walking stride from the example above, 10,000 steps is about 4.2 miles for a 5 ft 5 in woman. Research on step counts (Tudor-Locke et al., 2011) treats about 100 steps per minute as a reasonable floor for moderate-intensity walking.</p>`
    },
    {
      h2: 'How many steps a day should you aim for?',
      html: `<p>10,000 steps is a popular target rather than a medical cut-off. A 2022 meta-analysis of 15 cohorts in The Lancet Public Health (Paluch et al.) found that taking more steps per day was linked to a progressively lower risk of death, leveling off at about 6,000–8,000 steps for adults 60 and older and 8,000–10,000 for younger adults.</p>
<p>Converting that to distance with your own step length makes the goal concrete: 8,000 steps at 2,360 steps per mile is about 3.4 miles. To estimate the energy you burn walking those miles, use the <a href="/calories-burned-calculator">calories burned calculator</a>.</p>`
    },
    {
      h2: 'How do I set my stride length on a Fitbit or other tracker?',
      html: `<p>Most trackers estimate step length from the height and sex in your profile, which is the same idea as the 0.413/0.415 rule. If your recorded distance seems off on a route you know, measure your walking and running steps as described above and enter them manually in the app's profile or device settings, where available.</p>
<p>Devices with GPS, or connected to a phone's GPS, can calibrate step length during outdoor walks and runs. After changing the setting, check it against a known distance such as a track lap.</p>`
    }
  ],
  faq: [
    { q: 'What is the average stride length for a woman?', a: 'Using height × 0.413, a woman of average U.S. height (63.5 inches, per CDC data) has a walking step of about 26.2 inches, or roughly 2,420 steps per mile.' },
    { q: 'What is the average stride length for a man?', a: 'Using height × 0.415, a man of average U.S. height (68.9 inches) has a walking step of about 28.6 inches, roughly 2,216 steps per mile.' },
    { q: 'How do I calculate stride length from steps and distance?', a: 'Divide the distance by the number of steps, in the same units. 1,200 inches (100 feet) in 45 steps is 26.7 inches per step.' },
    { q: 'How many miles is 10,000 steps?', a: 'Usually 4 to 5 miles. Divide 10,000 by your steps per mile: at 2,360 steps per mile, 10,000 steps is about 4.2 miles.' },
    { q: 'Is running stride length different from walking?', a: 'Yes, much longer, often 1.5 times your walking step or more, and it grows with speed. Measure it separately on a track if your tracker allows a running stride setting.' },
    { q: 'Does stride length change with age?', a: 'It tends to shorten in older adults as walking speed falls. If your tracker\'s distance starts reading high, re-measure your step length.' },
    { q: 'How do I convert steps to miles?', a: 'Multiply steps by your step length in inches and divide by 63,360. 7,500 steps × 26.8 in ÷ 63,360 = 3.2 miles.' }
  ],
  related: ['calories-burned-calculator', 'target-heart-rate-calculator', 'vo2-max-calculator', 'bmi-calculator'],
  sources: [
    { name: 'CDC FastStats: Body Measurements (average U.S. adult height)', url: 'https://www.cdc.gov/nchs/fastats/body-measurements.htm' },
    { name: 'Tudor-Locke et al. 2011: How many steps/day are enough? For adults (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/21798015/' },
    { name: 'Paluch et al. 2022: Daily steps and all-cause mortality, Lancet Public Health (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/35247352/' },
    { name: 'ODPHP: Physical Activity Guidelines for Americans', url: 'https://odphp.health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines' }
  ],
  disclaimer: 'Estimates for fitness tracking, not a gait or medical assessment. A sudden change in how you walk is worth mentioning to a clinician.'
};
