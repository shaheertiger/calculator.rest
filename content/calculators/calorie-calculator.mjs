export default {
  slug: 'calorie-calculator',
  hub: 'health',
  name: 'Calorie Calculator',
  title: 'Calorie Calculator: Maintenance Is 2,172 kcal at 150 lb (TDEE)',
  h1: 'Calorie Calculator: Daily Calories to Maintain, Lose or Gain Weight',
  meta: 'A moderately active 30-year-old woman, 5 ft 5 in and 150 lb, maintains her weight on about 2,172 calories a day. Get your TDEE and goal calories.',
  keyword: 'how to calculate your calories',
  also: ['calorie calculator', 'tdee calculator', 'maintenance calories calculator', 'how many calories should i eat', 'daily calorie needs calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sex', label: 'Sex', type: 'select', value: 'female', options: [['female', 'Female'], ['male', 'Male']] },
    { id: 'age', label: 'Age', type: 'number', value: 30, suffix: 'years' },
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'US (lb, ft, in)'], ['metric', 'Metric (kg, cm)']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 5, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 165, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'lb', label: 'Weight', type: 'number', value: 150, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Weight', type: 'number', value: 68, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'act', label: 'Activity level', type: 'select', value: '1.55', wide: true, options: [['1.2', 'Sedentary: desk job, little or no exercise (×1.2)'], ['1.375', 'Lightly active: exercise 1–3 days a week (×1.375)'], ['1.55', 'Moderately active: exercise 3–5 days a week (×1.55)'], ['1.725', 'Very active: hard exercise 6–7 days a week (×1.725)'], ['1.9', 'Extra active: physical job plus training (×1.9)']] }
  ],
  compute(v, H) {
    var cm = v.units === 'metric' ? v.cm : ((v.ft > 0 ? v.ft : 0) * 12 + (v.inch > 0 ? v.inch : 0)) * 2.54;
    var kg = v.units === 'metric' ? v.kg : v.lb * 0.45359237;
    if (!(v.age >= 18 && v.age <= 100)) return { error: 'This calculator is for adults: enter an age from 18 to 100.' };
    if (!(cm >= 120 && cm <= 250)) return { error: 'Enter a height between 4 ft and 8 ft 2 in (120–250 cm).' };
    if (!(kg >= 30 && kg <= 350)) return { error: 'Enter a weight between 66 and 770 lb (30–350 kg).' };
    var f = Number(v.act) || 1.55;
    var male = v.sex === 'male';
    var bmr = 10 * kg + 6.25 * cm - 5 * v.age + (male ? 5 : -161);
    var tdee = bmr * f;
    var floor = male ? 1500 : 1200;
    var t = function (x) { return H.int(x) + ' kcal' + (x < floor ? ' (below ' + H.int(floor) + ')' : ''); };
    var rows = [
      ['Basal metabolic rate', H.int(bmr) + ' kcal'],
      ['Lose about ½ lb a week (−250)', t(tdee - 250)],
      ['Lose about 1 lb a week (−500)', t(tdee - 500), true],
      ['Gain slowly (+250)', H.int(tdee + 250) + ' kcal'],
      ['Gain faster (+500)', H.int(tdee + 500) + ' kcal']
    ];
    return {
      value: H.int(tdee) + ' kcal/day',
      label: 'Maintenance calories (TDEE)',
      expr: H.int(bmr) + ' kcal BMR × ' + f,
      rows: rows,
      sub: (tdee - 500 < floor ? 'A 500-calorie cut would drop you under ' + H.int(floor) + ' kcal, the low end of the AHA/ACC/TOS weight-loss range for ' + (male ? 'men' : 'women') + '; aim for a smaller deficit or more activity. ' : '') + 'Weigh yourself for 2–3 weeks at this intake and adjust by 100–200 kcal if your weight drifts.',
      tdee: tdee
    };
  },
  quick: ({ r }) => `To calculate your calories, estimate your basal metabolic rate with the Mifflin-St Jeor equation, then multiply by an activity factor from 1.2 to 1.9. A moderately active 30-year-old woman who is 5 ft 5 in and 150 lb has a BMR of 1,401 kcal; × 1.55 gives <strong>${r.value}</strong> to maintain her weight, or about 1,672 to lose 1 lb a week.`,
  stepsTitle: 'How to calculate your daily calories',
  steps: [
    'Work out your BMR. For women: 10 × weight (kg) + 6.25 × height (cm) − 5 × age − 161; for men add 5 instead of subtracting 161. The example woman: 680.4 + 1,031.9 − 150 − 161 = 1,401 kcal.',
    'Pick the activity factor that matches a typical week, not your best week: 1.2 sedentary, 1.375 light, 1.55 moderate, 1.725 very active, 1.9 extra active. Overstating activity is the most common reason a calorie target does not work.',
    'Multiply BMR by the factor to get total daily energy expenditure (TDEE), your maintenance calories: 1,401 × 1.55 = 2,172.',
    'Set a goal: subtract about 500 kcal a day to lose roughly 1 lb a week, or add 250–500 to gain.',
    'Test it. Eat at the target for 2–3 weeks, track your average weight, and move the number by 100–200 kcal if the trend is not what you expected.'
  ],
  formulaTitle: 'What formula does a calorie calculator use?',
  formula: {
    expr: 'TDEE = BMR × activity factor<br>BMR (Mifflin-St Jeor) = 10W + 6.25H − 5A + 5 (men) or − 161 (women)<br>Goal calories = TDEE − 500 (lose) or + 250 to 500 (gain)',
    vars: [['W', 'weight in kg'], ['H', 'height in cm'], ['A', 'age in years'], ['activity factor', '1.2 (sedentary) to 1.9 (extra active)']],
    note: 'The activity factors are conventional multipliers used by dietitians and fitness professionals, not values set by a government agency. They are averages, so treat the result as a starting estimate.'
  },
  example: `<p>A 45-year-old man is 6 ft (182.9 cm), weighs 200 lb (90.7 kg) and works out 1–3 days a week.</p><p>BMR = 10 × 90.7 + 6.25 × 182.9 − 5 × 45 + 5 = <strong>1,830 kcal</strong>.</p><p>TDEE = 1,830 × 1.375 = <strong>2,517 kcal</strong> a day to maintain his weight. If he really trains 3–5 days a week, the factor of 1.55 gives 2,837, a difference of 320 kcal, which is why picking the honest activity level matters more than which equation you use.</p><p>To lose about 1 lb a week he would eat around 2,017 kcal.</p>`,
  table: {
    title: 'How many calories should I eat for my weight?',
    intro: 'Maintenance calories for a 30-year-old woman who is 5 ft 5 in, at different body weights and activity levels, computed with the calculator above. Men of the same size need about 166 kcal more at rest, multiplied by the activity factor.',
    head: ['Weight', 'Sedentary', 'Light', 'Moderate', 'Very active'],
    rows: ({ run, H }) => [110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250].map(w => [w + ' lb', ...['1.2', '1.375', '1.55', '1.725'].map(a => H.int(run({ sex: 'female', age: 30, units: 'us', ft: 5, inch: 5, lb: w, act: a }).tdee))]),
    note: 'Each extra 10 lb adds about 45 kcal to BMR in the Mifflin-St Jeor equation, so maintenance rises by roughly 55–80 kcal per 10 lb depending on activity.'
  },
  sections: [
    {
      h2: 'Which activity level should I choose?',
      html: `<p>Choose the level that describes an average week over the last month. A few guidelines:</p><ul><li><strong>Sedentary (×1.2):</strong> office work, driving, little planned exercise.</li><li><strong>Lightly active (×1.375):</strong> a desk job plus 1–3 workouts a week, or a job with some standing and walking.</li><li><strong>Moderately active (×1.55):</strong> 3–5 solid workouts a week, or an on-your-feet job like retail or nursing.</li><li><strong>Very active (×1.725):</strong> hard training most days.</li><li><strong>Extra active (×1.9):</strong> manual labor plus training, or endurance athletes in heavy training.</li></ul><p>If you are between two levels, start with the lower one. It is easier to add 100–200 kcal later than to wonder why the scale is not moving.</p>`
    },
    {
      h2: 'How many calories should I eat to lose weight?',
      html: `<p>Start from your maintenance number and subtract. The 2013 AHA/ACC/TOS obesity guideline recommends a deficit of 500 or 750 kcal a day, or an intake of about 1,200–1,500 kcal for women and 1,500–1,800 kcal for men, adjusted for body weight and activity. The CDC notes that people who lose about 1 to 2 lb a week are more likely to keep it off.</p><p>For the example woman, 2,172 − 500 = 1,672 kcal. To see how many weeks a goal will take, and why progress slows as you lose, use the <a href="/calorie-deficit-calculator">calorie deficit calculator</a>, which models the shrinking deficit.</p>`
    },
    {
      h2: 'Why do calorie calculators give different numbers?',
      html: `<p>Three choices change the answer: the BMR equation (Harris-Benedict usually runs higher than Mifflin-St Jeor), the activity multipliers, and whether exercise is counted in the activity level or added separately. The USDA's DRI calculator for health professionals uses the National Academies' Estimated Energy Requirement equations, which build activity into the formula itself, so its result will not match a BMR × factor calculator exactly.</p><p>None of these is measured for you. A carefully tracked two-week trial on your own body beats any formula; the <a href="/bmr-calculator">BMR calculator</a> shows how much the equations alone disagree.</p>`
    },
    {
      h2: 'Should I eat back the calories I burn exercising?',
      html: `<p>Not if you already chose an activity level that includes your workouts; that would count them twice. The activity factor is meant to cover all your movement. If you picked "sedentary" and log workouts separately on a fitness tracker, eat back part of them, since tracker estimates of exercise calories are often generous. A <a href="/calories-burned-calculator">calories burned calculator</a> can give a second opinion on a single session.</p>`
    }
  ],
  faq: [
    { q: 'How many calories should I eat a day?', a: 'It depends on your size, age, sex and activity. A moderately active 30-year-old woman at 5 ft 5 in and 150 lb needs about 2,172 kcal to maintain her weight; a sedentary woman of the same size needs about 1,682.' },
    { q: 'What is TDEE?', a: 'TDEE, total daily energy expenditure, is everything you burn in a day: your BMR plus the energy for movement, exercise and digesting food. It is the number of calories that keeps your weight stable.' },
    { q: 'How many calories do I burn doing nothing?', a: 'Roughly your basal metabolic rate, which is 1,401 kcal a day for the example woman. Normal daily life on a sedentary day raises that to about 1.2 × BMR, or 1,682 kcal.' },
    { q: 'Is 1,200 calories a day enough?', a: 'For many women 1,200 kcal is the low end of a weight-loss diet in the AHA/ACC/TOS guideline, and for most men it is too low (their range starts at 1,500). Very low-calorie diets should be supervised by a health care provider.' },
    { q: 'How accurate is a calorie calculator?', a: 'It is an estimate. The BMR equation is usually within about 10% for healthy adults, and the activity factor adds more uncertainty, so expect to fine-tune by 100–200 kcal after a few weeks.' },
    { q: 'Do I need fewer calories as I get older?', a: 'Yes, slightly. The Mifflin-St Jeor equation lowers BMR by 5 kcal per year of age, about 50 kcal per decade, and many people also become less active and lose some muscle.' },
    { q: 'Should men and women use different calorie formulas?', a: 'They use the same structure with a different constant. At the same height, weight and age, the male Mifflin-St Jeor result is 166 kcal higher at rest.' }
  ],
  related: ['bmr-calculator', 'calorie-deficit-calculator', 'macro-calculator', 'protein-calculator', 'calories-burned-calculator'],
  sources: [
    { name: 'Jensen MD et al. 2013 AHA/ACC/TOS Guideline for the Management of Overweight and Obesity in Adults (Circulation, full text)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5819889/' },
    { name: 'CDC: Steps for Losing Weight', url: 'https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html' },
    { name: 'Mifflin MD, St Jeor ST et al. A new predictive equation for resting energy expenditure. Am J Clin Nutr 1990', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
    { name: 'USDA National Agricultural Library: DRI Calculator for Health Professionals', url: 'https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator' }
  ],
  disclaimer: 'Calorie targets are estimates for healthy adults, not medical advice. Pregnancy, breastfeeding, diabetes, eating disorders and many medications change what is safe; check with a health care provider.'
};
