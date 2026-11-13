export default {
  slug: 'calorie-deficit-calculator',
  hub: 'health',
  name: 'Calorie Deficit Calculator',
  title: 'Calorie Deficit Calculator: 500 kcal/Day = 1 lb a Week (2026)',
  h1: 'Calorie Deficit Calculator: Daily Target and Weeks to Your Goal Weight',
  meta: 'Losing 25 lb at 1 lb a week takes 25 weeks by the 3,500-calorie rule, but closer to 30 if intake stays fixed. Get your daily calorie target and timeline.',
  keyword: 'how to calculate a calorie deficit',
  also: ['calorie deficit calculator', 'how to calculate deficit calories', 'how can i calculate my calorie deficit', 'weight loss calculator', 'how long to lose weight calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sex', label: 'Sex', type: 'select', value: 'male', options: [['male', 'Male'], ['female', 'Female']] },
    { id: 'age', label: 'Age', type: 'number', value: 40, suffix: 'years' },
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'US (lb, ft, in)'], ['metric', 'Metric (kg, cm)']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 10, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 178, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'lb', label: 'Current weight', type: 'number', value: 210, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'goalLb', label: 'Goal weight', type: 'number', value: 185, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Current weight', type: 'number', value: 95, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'goalKg', label: 'Goal weight', type: 'number', value: 84, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'act', label: 'Activity level', type: 'select', value: '1.375', options: [['1.2', 'Sedentary (×1.2)'], ['1.375', 'Lightly active, 1–3 workouts/week (×1.375)'], ['1.55', 'Moderately active, 3–5/week (×1.55)'], ['1.725', 'Very active, 6–7/week (×1.725)']] },
    { id: 'pace', label: 'Target pace', type: 'select', value: '1', options: [['0.5', '0.5 lb (0.23 kg) a week: −250 kcal/day'], ['1', '1 lb (0.45 kg) a week: −500 kcal/day'], ['1.5', '1.5 lb (0.68 kg) a week: −750 kcal/day'], ['2', '2 lb (0.91 kg) a week: −1,000 kcal/day']] }
  ],
  compute(v, H) {
    var us = v.units !== 'metric';
    var cm = us ? ((v.ft > 0 ? v.ft : 0) * 12 + (v.inch > 0 ? v.inch : 0)) * 2.54 : v.cm;
    var w = us ? v.lb : v.kg / 0.45359237;
    var g = us ? v.goalLb : v.goalKg / 0.45359237;
    if (!(v.age >= 18 && v.age <= 100)) return { error: 'Enter an age from 18 to 100.' };
    if (!(cm >= 120 && cm <= 250)) return { error: 'Enter a height between 4 ft and 8 ft 2 in (120–250 cm).' };
    if (!(w >= 70 && w <= 770)) return { error: 'Enter your current weight.' };
    if (!(g >= 70 && g < w)) return { error: 'Enter a goal weight below your current weight.' };
    var male = v.sex === 'male';
    var f = Number(v.act) || 1.375;
    var pace = Number(v.pace) || 1;
    var tdeeAt = function (lb) { return (10 * lb * 0.45359237 + 6.25 * cm - 5 * v.age + (male ? 5 : -161)) * f; };
    var tdee = tdeeAt(w);
    var deficit = pace * 500;
    var target = tdee - deficit;
    var floor = male ? 1500 : 1200;
    var toLose = w - g;
    var weeksRule = toLose / pace;
    var cur = w, wk = 0;
    var intake = Math.round(target);
    while (cur > g && wk < 520) { cur -= (tdeeAt(cur) - intake) * 7 / 3500; wk++; }
    var plateau = (intake / f - 6.25 * cm + 5 * v.age - (male ? 5 : -161)) / 10 / 0.45359237;
    var fmtW = function (lb) { return us ? H.num(lb, 1) + ' lb' : H.num(lb * 0.45359237, 1) + ' kg'; };
    var rows = [
      ['Maintenance now (TDEE)', H.int(tdee) + ' kcal'],
      ['Daily deficit', H.int(deficit) + ' kcal (' + H.int(deficit * 7) + ' a week)'],
      ['Weeks to goal, 3,500-kcal rule', H.num(weeksRule, 1) + ' weeks (' + H.num(weeksRule / 4.345, 1) + ' months)', true],
      ['Weeks if you keep eating ' + H.int(intake), cur <= g ? H.int(wk) + ' weeks' : 'levels off near ' + fmtW(plateau)],
      ['Maintenance at goal weight', H.int(tdeeAt(g)) + ' kcal']
    ];
    var warn = target < floor ? 'This target is below ' + H.int(floor) + ' kcal, the lower limit the AHA/ACC/TOS guideline uses for ' + (male ? 'men' : 'women') + ' without medical supervision; choose a slower pace or add activity. ' : '';
    if (pace > 1 && toLose < 20) warn += 'With under 20 lb to lose, 0.5–1 lb a week is easier to sustain. ';
    return {
      value: H.int(target) + ' kcal/day',
      label: 'Calories to lose ' + (us ? pace + ' lb' : H.num(pace * 0.45359237, 2) + ' kg') + ' a week',
      expr: H.int(tdee) + ' TDEE − ' + H.int(deficit) + ' deficit',
      rows: rows,
      sub: warn + 'Losing ' + fmtW(toLose) + ' takes ' + H.num(weeksRule, 1) + ' weeks on paper; as you lose weight your maintenance falls, so re-run this every 10 lb.',
      weeksRule: weeksRule, weeksFixed: cur <= g ? wk : NaN, target: target
    };
  },
  quick: ({ r }) => `To calculate a calorie deficit, find your maintenance calories (TDEE) and subtract 500 kcal a day for about 1 lb of loss a week. A lightly active 40-year-old man, 5 ft 10 in and 210 lb, maintains on about 2,570 kcal, so his target is <strong>${r.value}</strong>. Losing 25 lb takes 25 weeks by the 3,500-calorie rule, but about 30 if he keeps eating the same amount.`,
  stepsTitle: 'How to calculate your calorie deficit',
  steps: [
    'Estimate your maintenance calories: BMR from the Mifflin-St Jeor equation × an activity factor. For the example man, 1,869 × 1.375 = 2,570 kcal.',
    'Choose a pace. A deficit of 250 kcal a day is about ½ lb a week, 500 is about 1 lb, 750 is about 1.5 lb and 1,000 is about 2 lb (using 3,500 kcal per pound).',
    'Subtract the deficit from maintenance: 2,570 − 500 = 2,070 kcal a day.',
    'Check the floor. If the result is under 1,200 kcal for a woman or 1,500 for a man, slow the pace or add activity instead.',
    'Divide pounds to lose by your weekly pace for a first timeline (25 lb ÷ 1 = 25 weeks), then re-run the numbers every 10 lb. The step people skip is lowering the target as their maintenance drops.'
  ],
  formulaTitle: 'What is the calorie deficit formula?',
  formula: {
    expr: 'Daily target = TDEE − (weekly pace in lb × 3,500 ÷ 7)<br>Weeks to goal ≈ (current weight − goal weight) ÷ weekly pace<br>TDEE = (10W + 6.25H − 5A + 5 or − 161) × activity factor',
    vars: [['TDEE', 'total daily energy expenditure (maintenance calories)'], ['3,500', 'approximate kcal in a pound of body weight lost'], ['W, H, A', 'weight (kg), height (cm), age (years)']],
    note: 'The "keep eating the same" timeline above recalculates maintenance every week as your weight falls, which is why it is longer than the simple 3,500-kcal estimate.'
  },
  example: `<p>A 35-year-old woman, 5 ft 6 in and 180 lb, is moderately active and wants to reach 150 lb.</p><p>BMR = 10 × 81.6 + 6.25 × 167.6 − 5 × 35 − 161 = 1,528 kcal. Maintenance = 1,528 × 1.55 = <strong>2,369 kcal</strong>.</p><p>At 1 lb a week her target is 2,369 − 500 = <strong>1,869 kcal</strong>, and 30 lb takes about 30 weeks on paper.</p><p>By the time she reaches 150 lb her maintenance has dropped to about 2,158 kcal, so the same 1,869-kcal intake is then only a 289-kcal deficit. Re-running the calculator at 170 and 160 lb keeps the pace steady.</p>`,
  table: {
    title: 'How long does it take to lose 10, 20 or 50 pounds?',
    intro: 'Timelines for the example man (40, 5 ft 10 in, 210 lb, lightly active) eating 2,070 kcal a day, computed with the calculator above. The last column holds intake fixed while his maintenance falls.',
    head: ['Pounds to lose', 'Goal weight', 'Weeks, 3,500-kcal rule', 'Weeks, intake held at 2,070'],
    rows: ({ run, H }) => [5, 10, 15, 20, 25, 30, 35, 40, 50].map(x => {
      const r = run({ goalLb: 210 - x, units: 'us', lb: 210, pace: '1' });
      return [x + ' lb', (210 - x) + ' lb', H.num(r.weeksRule, 0), isNaN(r.weeksFixed) ? 'levels off' : H.int(r.weeksFixed)];
    }),
    note: 'Both columns use 3,500 kcal per pound. Early weeks usually show faster loss from water and stored glycogen, so the real curve is steeper at the start and flatter later.'
  },
  sections: [
    {
      h2: 'How big should a calorie deficit be?',
      html: `<p>For most adults, 500–750 kcal a day. That is the deficit the 2013 AHA/ACC/TOS obesity guideline recommends, and it lines up with the CDC's observation that people who lose about 1 to 2 lb a week are more likely to keep the weight off.</p><p>Smaller is fine. A 250-kcal deficit, roughly one snack or a 45-minute walk, adds up to about 26 lb in a year by the 3,500-kcal rule (less in practice, for the reason explained below). Larger deficits make it harder to get enough protein and keep training quality up, and they push many people under the 1,200 (women) or 1,500 (men) kcal floor. Keeping protein high helps protect muscle while you lose; the <a href="/protein-calculator">protein calculator</a> gives a daily target and the <a href="/macro-calculator">macro calculator</a> splits your target calories into grams.</p>`
    },
    {
      h2: 'Is the 3,500-calorie rule accurate?',
      html: `<p>It works for the first few weeks and overpromises after that. The rule assumes every 3,500 kcal of deficit removes a pound forever, but as you lose weight you burn less: a smaller body needs less energy, and you move a little less. A 500-kcal deficit on day one is a smaller deficit by month six if you keep eating the same.</p><p>Kevin Hall's team at the NIH (Lancet, 2011) modeled this and found that body weight responds slowly to a lasting change in intake, with a half-time of about a year. Their rule of thumb: a lasting change of about 24 kcal a day (100 kJ) eventually shifts body weight by about 1 kg, roughly 10–11 kcal a day per pound, with about half of that change reached in the first year. The <a href="https://www.niddk.nih.gov/bwp" rel="nofollow noopener" target="_blank">NIH Body Weight Planner</a> runs their full model.</p><p>This calculator shows both views: the classic 3,500-kcal timeline and a fixed-intake timeline that recalculates your maintenance every week.</p>`
    },
    {
      h2: 'Why am I not losing weight in a calorie deficit?',
      html: `<ul><li><strong>The deficit is smaller than you think.</strong> Portion estimates, cooking oils, drinks and weekends are easy to undercount. Weigh food for a week to check.</li><li><strong>Water is masking fat loss.</strong> A salty meal, a hard workout or the menstrual cycle can hide 2–4 lb of loss for days. Judge the 2–3 week average, not a single weigh-in.</li><li><strong>Maintenance has moved.</strong> After losing 15–20 lb, the example man's maintenance is roughly 95–125 kcal lower. Re-enter your new weight.</li><li><strong>Activity is overstated.</strong> Choosing "moderately active" when you are lightly active adds about 330 kcal to the example man's maintenance.</li></ul>`
    }
  ],
  faq: [
    { q: 'How many calories should I eat to lose 1 lb a week?', a: 'About 500 fewer than your maintenance calories. For a lightly active 40-year-old man at 5 ft 10 in and 210 lb, that is 2,570 − 500 = 2,070 kcal a day.' },
    { q: 'How many calories is a pound of fat?', a: 'About 3,500 kcal is the traditional figure for a pound of body weight lost. It is a useful approximation early on, but the actual loss slows over time because your energy needs fall as you get lighter.' },
    { q: 'Is a 1,000-calorie deficit safe?', a: 'It can be for people with a lot of weight to lose and a high maintenance level, but it pushes many people below 1,200 kcal (women) or 1,500 kcal (men). Talk to a health care provider before going that low.' },
    { q: 'How long will it take to lose 20 pounds?', a: 'About 20 weeks at 1 lb a week, or 10 weeks at 2 lb a week, using the 3,500-calorie rule. Expect the second half to go slower unless you lower your intake as you lose.' },
    { q: 'Does exercise count toward my calorie deficit?', a: 'Yes. A deficit is the gap between what you eat and what you burn, so a 250-kcal workout plus eating 250 kcal less gives a 500-kcal deficit. Just do not count the workout twice if your activity level already includes it.' },
    { q: 'Should I recalculate my deficit as I lose weight?', a: 'Yes, every 10 lb or so. The example man\'s maintenance falls from about 2,570 kcal at 210 lb to about 2,414 kcal at 185 lb.' },
    { q: 'Can I be in a calorie deficit and not lose weight?', a: 'Short term, yes, because water shifts can hide fat loss for a week or two. If the 3-week trend is flat, the deficit is probably smaller than you calculated.' }
  ],
  related: ['calorie-calculator', 'bmr-calculator', 'macro-calculator', 'protein-calculator', 'bmi-calculator'],
  sources: [
    { name: 'Hall KD et al. Quantification of the effect of energy imbalance on bodyweight. Lancet 2011', url: 'https://pubmed.ncbi.nlm.nih.gov/21872751/' },
    { name: 'NIDDK: Body Weight Planner', url: 'https://www.niddk.nih.gov/bwp' },
    { name: 'Jensen MD et al. 2013 AHA/ACC/TOS Guideline for the Management of Overweight and Obesity in Adults', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5819889/' },
    { name: 'CDC: Steps for Losing Weight', url: 'https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html' }
  ],
  disclaimer: 'Weight-loss timelines are estimates, not medical advice. If you are pregnant, have diabetes, take medication that affects weight, or have a history of eating disorders, plan a deficit with a health care provider.'
};
