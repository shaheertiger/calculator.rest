export default {
  slug: 'bmr-calculator',
  hub: 'health',
  name: 'BMR Calculator',
  title: 'BMR Calculator: Mifflin-St Jeor Gives 1,758 kcal at 180 lb',
  h1: 'BMR Calculator: Your Basal Metabolic Rate by Four Equations',
  meta: 'A 35-year-old man, 5 ft 10 in and 180 lb, burns about 1,758 kcal a day at complete rest (Mifflin-St Jeor). Compare Harris-Benedict and Katch-McArdle.',
  keyword: 'how to calculate the basal metabolic rate',
  also: ['bmr calculator', 'basal metabolic rate calculator', 'mifflin st jeor calculator', 'harris benedict equation', 'how does garmin calculate resting calories', 'resting metabolic rate calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sex', label: 'Sex', type: 'select', value: 'male', options: [['male', 'Male'], ['female', 'Female']] },
    { id: 'age', label: 'Age', type: 'number', value: 35, suffix: 'years' },
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'US (lb, ft, in)'], ['metric', 'Metric (kg, cm)']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 10, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 178, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'lb', label: 'Weight', type: 'number', value: 180, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Weight', type: 'number', value: 82, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'eq', label: 'Equation', type: 'select', value: 'mifflin', options: [['mifflin', 'Mifflin-St Jeor (1990)'], ['hbr', 'Harris-Benedict, revised (1984)'], ['hbo', 'Harris-Benedict, original (1919)'], ['katch', 'Katch-McArdle (needs body fat %)']] },
    { id: 'bf', label: 'Body fat (optional)', type: 'number', value: '', suffix: '%', placeholder: 'e.g. 20', help: 'Only used by Katch-McArdle.' }
  ],
  compute(v, H) {
    var cm = v.units === 'metric' ? v.cm : ((v.ft > 0 ? v.ft : 0) * 12 + (v.inch > 0 ? v.inch : 0)) * 2.54;
    var kg = v.units === 'metric' ? v.kg : v.lb * 0.45359237;
    if (!(v.age >= 15 && v.age <= 100)) return { error: 'Enter an age between 15 and 100.' };
    if (!(cm >= 100 && cm <= 250)) return { error: 'Enter a height between 3 ft 4 in and 8 ft 2 in (100–250 cm).' };
    if (!(kg >= 25 && kg <= 350)) return { error: 'Enter a weight between 55 and 770 lb (25–350 kg).' };
    var m = v.sex !== 'female';
    var a = v.age;
    var ms = 10 * kg + 6.25 * cm - 5 * a + (m ? 5 : -161);
    var hbr = m ? 88.362 + 13.397 * kg + 4.799 * cm - 5.677 * a : 447.593 + 9.247 * kg + 3.098 * cm - 4.330 * a;
    var hbo = m ? 66.473 + 13.7516 * kg + 5.0033 * cm - 6.755 * a : 655.0955 + 9.5634 * kg + 1.8496 * cm - 4.6756 * a;
    var hasBf = v.bf > 2 && v.bf < 70;
    var lbm = hasBf ? kg * (1 - v.bf / 100) : NaN;
    var km = hasBf ? 370 + 21.6 * lbm : NaN;
    if (v.eq === 'katch' && !hasBf) return { error: 'Katch-McArdle needs your body fat percentage (between 3% and 69%).' };
    var pick = { mifflin: ms, hbr: hbr, hbo: hbo, katch: km }[v.eq] || ms;
    var names = { mifflin: 'Mifflin-St Jeor', hbr: 'Harris-Benedict (revised)', hbo: 'Harris-Benedict (1919)', katch: 'Katch-McArdle' };
    var exprs = {
      mifflin: '10×' + H.num(kg, 1) + ' + 6.25×' + H.num(cm, 1) + ' − 5×' + H.num(a, 0) + (m ? ' + 5' : ' − 161'),
      hbr: m ? '88.362 + 13.397×' + H.num(kg, 1) + ' + 4.799×' + H.num(cm, 1) + ' − 5.677×' + H.num(a, 0) : '447.593 + 9.247×' + H.num(kg, 1) + ' + 3.098×' + H.num(cm, 1) + ' − 4.330×' + H.num(a, 0),
      hbo: m ? '66.47 + 13.75×' + H.num(kg, 1) + ' + 5.00×' + H.num(cm, 1) + ' − 6.755×' + H.num(a, 0) : '655.1 + 9.563×' + H.num(kg, 1) + ' + 1.850×' + H.num(cm, 1) + ' − 4.676×' + H.num(a, 0),
      katch: '370 + 21.6 × ' + H.num(lbm, 1) + ' kg lean mass'
    };
    var key = names[v.eq] ? v.eq : 'mifflin';
    var rows = [
      ['Mifflin-St Jeor', H.int(ms) + ' kcal', key === 'mifflin'],
      ['Harris-Benedict (revised 1984)', H.int(hbr) + ' kcal', key === 'hbr'],
      ['Harris-Benedict (original 1919)', H.int(hbo) + ' kcal', key === 'hbo']
    ];
    if (hasBf) rows.push(['Katch-McArdle (' + H.num(v.bf, 1) + '% fat)', H.int(km) + ' kcal', key === 'katch']);
    rows.push(['Per hour at rest', H.num(pick / 24, 0) + ' kcal']);
    rows.push(['Desk-job day (BMR × 1.2)', H.int(pick * 1.2) + ' kcal']);
    var lo = Math.min(ms, hbr, hbo, hasBf ? km : ms), hi = Math.max(ms, hbr, hbo, hasBf ? km : ms);
    return {
      value: H.int(pick) + ' kcal/day',
      label: 'Basal metabolic rate · ' + names[key],
      expr: exprs[key],
      rows: rows,
      sub: 'The equations span ' + H.int(lo) + '–' + H.int(hi) + ' kcal for you. That is the energy to keep you alive lying still for 24 hours; add activity with the calorie calculator.',
      ms: ms, hbr: hbr
    };
  },
  quick: ({ r }) => `Basal metabolic rate (BMR) is the energy your body burns at complete rest. With the Mifflin-St Jeor equation, a 35-year-old man who is 5 ft 10 in (177.8 cm) and 180 lb (81.6 kg) has a BMR of 10 × 81.6 + 6.25 × 177.8 − 5 × 35 + 5 = <strong>${r.value}</strong>. The older Harris-Benedict equation gives about 80 kcal more.`,
  stepsTitle: 'How to calculate your basal metabolic rate',
  steps: [
    'Convert weight to kilograms (pounds × 0.4536) and height to centimeters (inches × 2.54). 180 lb is 81.6 kg; 5 ft 10 in is 177.8 cm.',
    'Multiply weight by 10 and height by 6.25, and add them: 816.5 + 1,111.3 = 1,927.7.',
    'Subtract 5 × your age in years: 1,927.7 − 175 = 1,752.7.',
    'Add 5 for men or subtract 161 for women. The man in the example gets <strong>1,758 kcal a day</strong>; a woman with the same height, weight and age would get 1,592.',
    'If you know your body fat percentage, cross-check with Katch-McArdle, which uses lean mass instead of sex, height and age.'
  ],
  formulaTitle: 'What are the BMR equations?',
  formula: {
    expr: 'Mifflin-St Jeor: 10W + 6.25H − 5A + 5 (men) or − 161 (women)<br>Harris-Benedict (revised): men 88.362 + 13.397W + 4.799H − 5.677A; women 447.593 + 9.247W + 3.098H − 4.330A<br>Katch-McArdle: 370 + 21.6 × lean body mass (kg)',
    vars: [['W', 'weight in kilograms'], ['H', 'height in centimeters'], ['A', 'age in years'], ['lean body mass', 'weight × (1 − body fat % ÷ 100)']],
    note: 'Mifflin and colleagues built their equation in 1990 from resting measurements of 498 healthy adults aged 19 to 78, about half of them with obesity. Roza and Shizgal refit the 1919 Harris-Benedict data in 1984.'
  },
  example: `<p>A 50-year-old woman is 5 ft 5 in (165.1 cm) and weighs 140 lb (63.5 kg).</p><p>Mifflin-St Jeor: 10 × 63.5 + 6.25 × 165.1 − 5 × 50 − 161 = 635.0 + 1,031.9 − 250 − 161 = <strong>1,256 kcal/day</strong>.</p><p>Revised Harris-Benedict: 447.593 + 9.247 × 63.5 + 3.098 × 165.1 − 4.330 × 50 = <strong>1,330 kcal/day</strong>, about 6% higher. That gap is typical: in Mifflin\'s own study the 1919 equations overestimated measured resting energy by 5%.</p>`,
  table: {
    title: 'How does BMR change with age?',
    intro: 'BMR for a 5 ft 10 in, 180 lb adult at different ages, computed with the calculator above. Mifflin-St Jeor takes off exactly 5 kcal per year of age.',
    head: ['Age', 'Men, Mifflin', 'Women, Mifflin', 'Men, Harris-Benedict', 'Women, Harris-Benedict'],
    rows: ({ run, H }) => [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75].map(a => {
      const m = run({ sex: 'male', age: a, units: 'us', ft: 5, inch: 10, lb: 180, eq: 'mifflin', bf: NaN });
      const f = run({ sex: 'female', age: a, units: 'us', ft: 5, inch: 10, lb: 180, eq: 'mifflin', bf: NaN });
      return [String(a), H.int(m.ms), H.int(f.ms), H.int(m.hbr), H.int(f.hbr)];
    }),
    note: 'Part of the real decline with age comes from losing muscle, which none of these equations measure directly. Katch-McArdle handles that if you know your lean mass.'
  },
  sections: [
    {
      h2: 'Which BMR formula is the most accurate?',
      html: `<p>For most healthy adults, Mifflin-St Jeor. A 2005 systematic review for the American Dietetic Association compared the four equations used most in clinics (Harris-Benedict, Mifflin-St Jeor, Owen and WHO/FAO/UNU). Mifflin-St Jeor predicted resting metabolic rate within 10% of the measured value in more people, with and without obesity, than any other equation, and had the narrowest error range.</p><p>"Within 10%" still means a miss of 150–200 kcal a day is normal for an individual. The review also noted that older adults and U.S. ethnic minorities were underrepresented in the studies, so treat any equation as a starting estimate. The only way to know your own number is indirect calorimetry, a breath test some clinics and university labs offer.</p><p>Use <strong>Katch-McArdle</strong> when you have a reliable body fat figure (DEXA or similar) and are leaner or more muscular than average; equations that only see weight tend to underestimate muscular people and overestimate people with a lot of body fat.</p>`
    },
    {
      h2: 'What is the difference between BMR and RMR?',
      html: `<p>They measure nearly the same thing under different rules. <strong>BMR</strong> is measured in a lab in a strict state: right after waking, after an overnight fast, lying still in a comfortable-temperature room. <strong>Resting metabolic rate (RMR)</strong>, also called resting energy expenditure, uses looser conditions and usually comes out slightly higher.</p><p>Strictly speaking, Mifflin-St Jeor predicts resting energy expenditure, since that is what its authors measured, but the two terms are used interchangeably by fitness apps and calculators. Neither includes the energy you spend moving, digesting food or exercising. To add those, use the <a href="/calorie-calculator">calorie calculator</a>, which multiplies BMR by an activity factor.</p>`
    },
    {
      h2: 'How does Garmin calculate resting calories?',
      html: `<p>Garmin, Fitbit, Apple and similar devices show "resting" or "BMR" calories that come from your profile: sex, age, height and weight. They spread that daily estimate across the hours, which is why resting calories tick up even while you sleep. The figure is equation-based, the same idea as this calculator, so if your watch shows something close to the Mifflin-St Jeor number here, that is expected. Updating your weight in the app changes it, while steps, workouts and heart rate feed the separate active-calorie figure.</p>`
    },
    {
      h2: 'Can you increase your basal metabolic rate?',
      html: `<p>A little, mainly by adding muscle. The organ-by-organ estimates published by Elia and checked against MRI data by Wang and colleagues in 2010 put resting skeletal muscle at about <strong>13 kcal per kg per day</strong> (about 6 kcal per pound) and fat tissue at 4.5 kcal per kg. Gaining 5 lb of muscle would therefore raise BMR by roughly 30 kcal a day: real, but smaller than many fitness claims.</p><p>Your heart, liver, kidneys and brain are only a small share of body weight but burn the majority of resting energy, and their rates do not respond much to training. Very low-calorie dieting can lower resting expenditure beyond what weight loss alone predicts, which is one reason to keep a deficit moderate; the <a href="/calorie-deficit-calculator">calorie deficit calculator</a> shows how.</p>`
    }
  ],
  faq: [
    { q: 'What is a normal BMR?', a: 'There is no single normal value because BMR scales with size, age and sex. Mifflin-St Jeor gives 1,256 kcal a day for a 50-year-old woman at 5 ft 5 in and 140 lb, and 1,758 kcal for a 35-year-old man at 5 ft 10 in and 180 lb.' },
    { q: 'Is BMR the same as the calories I should eat?', a: 'No. BMR is only the energy used at complete rest. Your total daily burn adds movement, exercise and digestion, typically 1.2 to 1.9 times BMR. Eating at BMR is already a calorie deficit for almost everyone.' },
    { q: 'Why do women have a lower BMR than men?', a: 'Mainly body composition. At the same weight, women on average carry less muscle and more fat, and fat burns far fewer calories at rest. Mifflin-St Jeor captures this with a 166 kcal difference between its male and female constants.' },
    { q: 'Does BMR go down with age?', a: 'Yes. Mifflin-St Jeor subtracts 5 kcal per year, so the same person burns 50 kcal less at rest each decade, before counting any muscle loss.' },
    { q: 'How accurate are BMR calculators?', a: 'Good equations land within about 10% of a measured value for most people, which is roughly 150 to 200 kcal a day. Individual errors can be larger, especially for very muscular, very lean or older people.' },
    { q: 'What is the Mifflin-St Jeor equation?', a: 'For men: 10 × weight (kg) + 6.25 × height (cm) − 5 × age + 5. For women it is the same, minus 161 instead of plus 5. It was published in the American Journal of Clinical Nutrition in 1990.' },
    { q: 'How many calories do I burn sleeping?', a: 'About your BMR per hour: 1,758 kcal ÷ 24 is about 73 kcal an hour for the example man, so 8 hours of sleep is roughly 590 kcal.' }
  ],
  related: ['calorie-calculator', 'calorie-deficit-calculator', 'macro-calculator', 'body-fat-calculator', 'bmi-calculator'],
  sources: [
    { name: 'Mifflin MD, St Jeor ST et al. A new predictive equation for resting energy expenditure. Am J Clin Nutr 1990', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
    { name: 'Roza AM, Shizgal HM. The Harris Benedict equation reevaluated. Am J Clin Nutr 1984', url: 'https://pubmed.ncbi.nlm.nih.gov/6741850/' },
    { name: 'Frankenfield D et al. Comparison of predictive equations for resting metabolic rate: a systematic review. J Am Diet Assoc 2005', url: 'https://pubmed.ncbi.nlm.nih.gov/15883556/' },
    { name: 'Wang Z et al. Specific metabolic rates of major organs and tissues across adulthood. Am J Clin Nutr 2010', url: 'https://pubmed.ncbi.nlm.nih.gov/20962155/' }
  ],
  disclaimer: 'BMR equations give an estimate for healthy adults, not medical advice. Illness, pregnancy, thyroid conditions and some medications change energy needs.'
};
