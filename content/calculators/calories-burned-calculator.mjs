export default {
  slug: 'calories-burned-calculator',
  hub: 'health',
  name: 'Calories Burned Calculator',
  title: 'Calories Burned Calculator: 30-Minute 6-mph Run Burns 337',
  h1: 'Calories Burned Calculator for Workouts and Everyday Activities',
  meta: 'A 160-lb person running at 6 mph for 30 minutes burns about 337 calories (9.3 METs × 72.6 kg × 0.5 h). Pick from 42 activities in the 2024 Compendium.',
  keyword: 'how to calculate calories burned in a workout',
  also: ['how do fitbit calculate calories burned', 'calories burned calculator', 'met calculator', 'calories burned walking calculator', 'exercise calorie calculator', 'how many calories did i burn'],
  updated: '2026-11-13',
  inputs: [
    { id: 'act', label: 'Activity', type: 'select', value: 'run6', wide: true, options: [
      ['walk2', 'Walking, 2.0–2.4 mph, slow'], ['walk3', 'Walking, 2.8–3.4 mph, moderate'], ['walk35', 'Walking, 3.5–3.9 mph, brisk'], ['walk4', 'Walking, 4.0–4.4 mph, very brisk'], ['hike', 'Hiking, cross country'], ['stairs', 'Stair climbing, general'],
      ['jog', 'Jogging, general'], ['run5', 'Running, 5 mph (12 min/mile)'], ['run6', 'Running, 6 mph (10 min/mile)'], ['run7', 'Running, 7 mph (8:30 min/mile)'], ['run8', 'Running, 8 mph (7:30 min/mile)'], ['run10', 'Running, 10 mph (6 min/mile)'],
      ['bike10', 'Cycling, 10–11.9 mph, light'], ['bike12', 'Cycling, 12–13.9 mph, moderate'], ['bike14', 'Cycling, 14–15.9 mph, vigorous'], ['bikestat', 'Stationary bike, general'], ['spin', 'Spin / RPM class'],
      ['ellip', 'Elliptical, moderate'], ['ellipv', 'Elliptical, vigorous'], ['row', 'Rowing machine, moderate'], ['rowv', 'Rowing machine, vigorous'], ['stairmill', 'Stair treadmill / StairMaster'],
      ['swim', 'Swimming laps, freestyle, slow'], ['swimv', 'Swimming laps, freestyle, fast'], ['swimleis', 'Swimming, leisurely'],
      ['weights', 'Weight training, 8–15 reps, moderate'], ['weightsv', 'Weight lifting / power lifting, vigorous'], ['circuit', 'Circuit training with kettlebells, vigorous'], ['hiit', 'HIIT: burpees, mountain climbers, Tabata'], ['rope', 'Jumping rope, general'],
      ['yoga', 'Yoga, hatha'], ['pyoga', 'Yoga, power'], ['pilates', 'Pilates, general'], ['zumba', 'Zumba class'],
      ['bball', 'Basketball, game'], ['soccer', 'Soccer, casual'], ['tennis', 'Tennis, singles'], ['golf', 'Golf, walking and carrying clubs'],
      ['mow', 'Mowing lawn, walking, power mower'], ['garden', 'Gardening, moderate'], ['vacuum', 'Vacuuming'], ['sit', 'Sitting quietly']
    ] },
    { id: 'units', label: 'Weight units', type: 'select', value: 'us', options: [['us', 'Pounds'], ['metric', 'Kilograms']] },
    { id: 'lb', label: 'Body weight', type: 'number', value: 160, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Body weight', type: 'number', value: 72.6, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'min', label: 'Duration', type: 'number', value: 30, suffix: 'min' }
  ],
  data: {
    met: {
      walk2: [2.8, '17152'], walk3: [3.8, '17190'], walk35: [4.8, '17200'], walk4: [5.5, '17220'], hike: [6.0, '17080'], stairs: [6.8, '17131'],
      jog: [7.5, '12020'], run5: [8.5, '12030'], run6: [9.3, '12050'], run7: [11.0, '12070'], run8: [12.0, '12090'], run10: [14.8, '12120'],
      bike10: [6.8, '01020'], bike12: [8.0, '01030'], bike14: [10.0, '01040'], bikestat: [6.8, '01200'], spin: [9.0, '01270'],
      ellip: [5.0, '02048'], ellipv: [9.0, '02049'], row: [5.0, '02071'], rowv: [7.3, '02070'], stairmill: [9.3, '02065'],
      swim: [5.8, '18240'], swimv: [9.8, '18230'], swimleis: [6.0, '18310'],
      weights: [3.5, '02054'], weightsv: [6.0, '02050'], circuit: [7.5, '02040'], hiit: [11.0, '02214'], rope: [11.0, '02068'],
      yoga: [2.3, '02150'], pyoga: [4.0, '02160'], pilates: [2.8, '02105'], zumba: [6.5, '02310'],
      bball: [8.0, '15040'], soccer: [7.0, '15610'], tennis: [8.0, '15690'], golf: [4.3, '15265'],
      mow: [5.0, '08120'], garden: [3.8, '08245'], vacuum: [3.0, '05043'], sit: [1.0, '07021']
    }
  },
  compute(v, H, D) {
    var a = D.met[v.act];
    if (!a) return { error: 'Choose an activity.' };
    var kg = v.units === 'metric' ? v.kg : v.lb * 0.45359237;
    if (!(kg >= 20 && kg <= 300)) return { error: 'Enter a body weight between 44 and 660 lb (20–300 kg).' };
    if (!(v.min > 0)) return { error: 'Enter how many minutes you exercised.' };
    var met = a[0], h = v.min / 60;
    var kcal = met * kg * h;
    var net = Math.max(0, met - 1) * kg * h;
    var intensity = met < 3 ? 'light (under 3 METs)' : met < 6 ? 'moderate (3–5.9 METs)' : 'vigorous (6+ METs)';
    return {
      value: H.int(kcal) + ' calories',
      label: 'Calories burned (gross, includes resting)',
      expr: H.num(met, 1) + ' METs × ' + H.num(kg, 1) + ' kg × ' + H.num(h, 2) + ' h',
      rows: [
        ['Net calories above resting', H.int(net) + ' kcal', true],
        ['Per hour at this pace', H.int(met * kg) + ' kcal/h'],
        ['Per minute', H.num(met * kg / 60, 1) + ' kcal/min'],
        ['Minutes to burn 100 calories', H.num(100 / (met * kg / 60), 0) + ' min'],
        ['Intensity', intensity],
        ['Compendium code and MET value', a[1] + ' · ' + H.num(met, 1) + ' METs']
      ],
      sub: 'An average for adults of your weight. Fitness, efficiency, terrain and body composition can move the real number up or down by a fair margin.'
    };
  },
  quick: ({ r }) => `To calculate calories burned in a workout, multiply the activity's MET value by your weight in kilograms and the hours you exercised. Running at 6 mph is 9.3 METs in the 2024 Compendium of Physical Activities, so a <strong>160-lb</strong> (72.57 kg) person running for <strong>30 minutes</strong> burns 9.3 × 72.57 × 0.5 = <strong>${r.value}</strong>, about 301 above resting.`,
  stepsTitle: 'How to calculate calories burned step by step',
  steps: [
    'Look up the MET value of your activity in the Compendium of Physical Activities: brisk walking at 3.5–3.9 mph is 4.8 METs, running at 6 mph is 9.3.',
    'Convert your weight to kilograms: pounds × 0.4536. 160 lb = 72.57 kg.',
    '<strong>Convert minutes to hours</strong> (minutes ÷ 60) before multiplying; plugging in 30 instead of 0.5 gives a number 60 times too high.',
    'Multiply: METs × kg × hours = calories. 9.3 × 72.57 × 0.5 = 337.',
    'For calories above what you would burn anyway, subtract 1 MET first: (9.3 − 1) × 72.57 × 0.5 = 301.'
  ],
  formulaTitle: 'What is the formula for calories burned?',
  formula: {
    expr: 'Calories = MET × weight (kg) × time (hours)<br>Net calories = (MET − 1) × weight (kg) × time (hours)<br>ACSM version: kcal/min = MET × 3.5 × kg ÷ 200',
    vars: [['MET', 'metabolic equivalent: energy cost of the activity as a multiple of resting'], ['1 MET', '3.5 mL of oxygen per kg per minute, about 1 kcal per kg per hour'], ['weight', 'body weight in kilograms'], ['time', 'duration in hours']],
    note: 'The ACSM form gives results about 5% higher, because 3.5 mL O₂ × 60 min ÷ 200 = 1.05 kcal per kg per hour rather than 1. Either is acceptable; this calculator uses the simpler 1 kcal per kg per hour that the Compendium itself uses.'
  },
  example: `<p>A 185-lb (83.9 kg) person does a 45-minute session of moderate weight training (3.5 METs) and then 20 minutes on a moderate elliptical (5.0 METs).</p>
<p>Weights: 3.5 × 83.9 × 0.75 = <strong>220 calories</strong>. Elliptical: 5.0 × 83.9 × 0.333 = <strong>140 calories</strong>. Total = <strong>360 calories</strong>.</p>
<p>Net of resting metabolism: (2.5 × 83.9 × 0.75) + (4.0 × 83.9 × 0.333) = 157 + 112 = <strong>269 calories</strong> extra.</p>`,
  table: {
    title: 'How many calories do common workouts burn in 30 minutes?',
    intro: 'Calories burned in 30 minutes by body weight, computed with the MET values from the 2024 Adult Compendium shown in the second column.',
    head: ['Activity (30 min)', 'METs', '130 lb', '155 lb', '180 lb', '205 lb'],
    rows: ({ run, D }) => [['walk3', 'Walking, 3 mph'], ['walk35', 'Walking, 3.5 mph brisk'], ['hike', 'Hiking'], ['run5', 'Running, 5 mph'], ['run6', 'Running, 6 mph'], ['run8', 'Running, 8 mph'], ['bike12', 'Cycling, 12–13.9 mph'], ['spin', 'Spin class'], ['ellip', 'Elliptical, moderate'], ['row', 'Rowing machine, moderate'], ['swim', 'Swimming laps, slow'], ['weights', 'Weight training, moderate'], ['hiit', 'HIIT, vigorous'], ['yoga', 'Yoga, hatha'], ['bball', 'Basketball game']].map(([k, name]) => [name, D.met[k][0].toFixed(1), ...[130, 155, 180, 205].map(lb => run({ act: k, units: 'us', lb, min: 30 }).value.replace(' calories', ''))]),
    note: 'Gross calories, including the energy you would burn at rest. Subtract about 1 calorie per kg per hour for net calories.'
  },
  sections: [
    {
      h2: 'What is a MET, and why does it work for any activity?',
      html: `<p>A metabolic equivalent (MET) expresses an activity's energy cost as a multiple of sitting quietly. One MET is defined as 3.5 mL of oxygen per kilogram per minute, which works out to about 1 calorie per kilogram per hour. An activity rated 4.8 METs burns 4.8 times the resting rate, so the same formula covers walking, swimming or mowing the lawn.</p>
<p>The values come from the Compendium of Physical Activities, first published in 1993 and updated in 2000, 2011 and 2024. The 2024 Adult Compendium lists more than 1,100 activities, each with a five-digit code. U.S. physical activity guidelines call 3.0–5.9 METs moderate intensity and 6 or more vigorous.</p>`
    },
    {
      h2: 'How do Fitbit and Apple Watch calculate calories burned?',
      html: `<p>Wearables estimate your basal metabolic rate from the age, sex, height and weight in your profile, then add activity calories estimated from motion sensors and, during workouts, heart rate. Fitbit's daily "calories burned" includes your BMR, so it starts climbing from midnight even if you stay in bed; Apple Watch shows active and resting calories separately.</p>
<p>Their heart-rate readings are usually good, but energy estimates are much rougher. A Stanford study of seven wrist-worn devices (Shcherbina et al., 2017) found that most measured heart rate with low error, yet none estimated energy expenditure with an error below 20%. Treat watch calories, and this calculator, as estimates.</p>`
    },
    {
      h2: 'Should you count gross or net calories burned?',
      html: `<p>Gross calories (the main result) include the energy your body would have used anyway in that time. Net calories subtract that resting burn, which is the extra you earned by exercising. For a 30-minute run at 6 mph, gross is 337 and net is 301 calories for a 160-lb person.</p>
<p>The difference is small for hard exercise and large for gentle activity: an hour of hatha yoga (2.3 METs) at 160 lb is 167 gross but only 94 net. If you log exercise to eat back calories while tracking a deficit, net is the more honest number. To plan the deficit itself, use the <a href="/calorie-deficit-calculator">calorie deficit calculator</a>.</p>`
    },
    {
      h2: 'How accurate are MET-based calorie estimates?',
      html: `<p>MET values are averages measured in groups of adults, and the Compendium does not adjust them for age, sex or body composition. Its authors note that using 3.5 mL/kg/min for everyone overestimates resting metabolism for many people, especially those who are older, heavier or less fit, which shifts their true MET values.</p>
<p>Technique and fitness matter too: an experienced swimmer moves more efficiently than a beginner, and hills, wind and load change the cost of walking or cycling. Expect your real burn to differ from the estimate, and judge progress by trends in weight, fitness and how you feel rather than single workout totals.</p>`
    }
  ],
  faq: [
    { q: 'How many calories does walking a mile burn?', a: 'At 3 mph (3.8 METs) a mile takes 20 minutes, so a 160-lb person burns about 3.8 × 72.6 × 0.333 = 92 calories. Heavier people burn more per mile.' },
    { q: 'How many calories does running a mile burn?', a: 'At 6 mph (9.3 METs) a mile takes 10 minutes, so a 160-lb runner burns about 112 calories. Running burns more per mile than walking because its MET value per minute is far higher.' },
    { q: 'Does body weight change calories burned?', a: 'Yes. The formula scales directly with weight: a 200-lb person burns 25% more than a 160-lb person doing the same activity for the same time.' },
    { q: 'How many calories does weight lifting burn?', a: 'Moderate weight training is 3.5 METs and vigorous power lifting 6.0 METs. For a 160-lb person, 30 minutes burns about 127 and 218 calories respectively.' },
    { q: 'How many calories do you burn sitting?', a: 'Sitting quietly is 1.0 MET, about 1 calorie per kg per hour. A 160-lb person burns roughly 73 calories an hour at rest.' },
    { q: 'Why does my watch show a different number?', a: 'Watches use your heart rate and their own algorithms, and their daily totals may include resting calories. Studies show their energy estimates can be off by 20% or more, so neither number is exact.' },
    { q: 'Is the ACSM formula different?', a: 'Slightly. ACSM uses kcal/min = MET × 3.5 × kg ÷ 200, which gives about 5% more than MET × kg × hours. Both rest on the same MET values.' }
  ],
  related: ['calorie-calculator', 'calorie-deficit-calculator', 'bmr-calculator', 'stride-length-calculator', 'target-heart-rate-calculator'],
  sources: [
    { name: 'Compendium of Physical Activities: 2024 Adult Compendium', url: 'https://pacompendium.com/adult-compendium/' },
    { name: 'Herrmann et al. 2024: Adult Compendium of Physical Activities, third update (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/38242596/' },
    { name: 'Shcherbina et al. 2017: Accuracy of wrist-worn devices for heart rate and energy expenditure (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/28538708/' },
    { name: 'ODPHP: Physical Activity Guidelines for Americans', url: 'https://odphp.health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines' }
  ],
  disclaimer: 'Estimates for general fitness planning, not medical advice. Check with a clinician before starting vigorous exercise if you have heart disease or other health conditions.'
};
