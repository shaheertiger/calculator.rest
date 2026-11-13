export default {
  slug: 'water-intake-calculator',
  hub: 'health',
  name: 'Water Intake Calculator',
  title: 'Water Intake Calculator: Women Need 74 oz of Drinks a Day',
  h1: 'Daily Water Intake Calculator With Exercise, Heat and Breastfeeding',
  meta: 'Women need about 2.7 L of water a day from all sources, about 74 oz (9 cups) of it from drinks; men need 101 oz. Adjust for exercise, heat and breastfeeding.',
  keyword: 'how much water should you drink in a day calculator',
  also: ['how much water a day calculator', 'how much water should i drink while breastfeeding calculator', 'how much water should an athlete drink a day calculator', 'water intake calculator', 'daily water intake calculator', 'hydration calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'stage', label: 'You are', type: 'select', value: 'f', options: [['f', 'A woman (19+)'], ['m', 'A man (19+)'], ['preg', 'Pregnant'], ['bf', 'Breastfeeding']] },
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'US (lb, fl oz, cups)'], ['metric', 'Metric (kg, liters)']] },
    { id: 'lb', label: 'Body weight', type: 'number', value: 150, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Body weight', type: 'number', value: 68, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'ex', label: 'Exercise today', type: 'number', value: 0, suffix: 'min' },
    { id: 'sweat', label: 'How hard you sweat', type: 'select', value: '1', options: [['0.5', 'Light, about 0.5 L/hour'], ['1', 'Moderate to hard, about 1 L/hour'], ['1.5', 'Hard in the heat, about 1.5 L/hour']] },
    { id: 'climate', label: 'Weather and surroundings', type: 'select', value: '0', options: [['0', 'Mild or indoors'], ['0.5', 'Hot or humid (+0.5 L)'], ['1', 'Very hot, working outdoors (+1 L)']] },
    { id: 'lost', label: 'Weight lost during exercise (optional)', type: 'number', value: '', placeholder: 'e.g. 1.5', help: 'Weigh before and after a workout, in your chosen units, to size your recovery drinking.' }
  ],
  data: { bev: { f: 2.2, m: 3.0, preg: 2.3, bf: 3.1 }, total: { f: 2.7, m: 3.7, preg: 3.0, bf: 3.8 } },
  compute(v, H, D) {
    var us = v.units !== 'metric';
    var kg = us ? v.lb * 0.45359237 : v.kg;
    if (!(kg >= 25 && kg <= 300)) return { error: 'Enter a body weight between 55 and 660 lb (25–300 kg).' };
    var base = D.bev[v.stage] || 2.2, tot = D.total[v.stage] || 2.7;
    var exL = (v.ex > 0 ? Math.min(v.ex, 1440) : 0) / 60 * (Number(v.sweat) || 1);
    var heat = Number(v.climate) || 0;
    var drink = base + exL + heat;
    var oz = function (l) { return l * 33.814; };
    var amt = function (l) { return us ? H.num(oz(l), 0) + ' oz' : H.fix(l, 1) + ' L'; };
    var rows = [
      [us ? 'In cups (8 fl oz)' : 'In US fl oz', us ? H.num(oz(drink) / 8, 1) + ' cups' : H.num(oz(drink), 0) + ' oz'],
      [us ? 'In liters' : 'In 250 mL glasses', us ? H.fix(drink, 2) + ' L' : H.num(drink / 0.25, 1) + ' glasses'],
      ['Total water incl. food (about 20%)', amt(tot + exL + heat)],
      ['National Academies baseline from drinks', amt(base)]
    ];
    if (exL > 0) rows.push(['Added for ' + H.num(v.ex, 0) + ' min of exercise', amt(exL)]);
    if (heat > 0) rows.push(['Added for heat (planning allowance)', amt(heat)]);
    rows.push(['"Half your weight in ounces" rule of thumb', amt(kg / 0.45359237 * 0.5 / 33.814)]);
    if (v.lost > 0) {
      var lostKg = us ? v.lost * 0.45359237 : v.lost;
      rows.push(['To rehydrate after exercise (1.5 L per kg lost)', amt(lostKg * 1.5), true]);
    }
    return {
      value: amt(drink),
      label: 'Water and other drinks per day',
      expr: H.fix(base, 1) + ' L baseline' + (exL ? ' + ' + H.fix(exL, 2) + ' L exercise' : '') + (heat ? ' + ' + H.fix(heat, 1) + ' L heat' : ''),
      rows: rows,
      sub: 'A starting point for healthy adults. Thirst and pale yellow urine are good day-to-day guides; people with heart, kidney or liver disease should follow their clinician\'s fluid advice.'
    };
  },
  quick: ({ r }) => `The National Academies set an adequate intake of about 2.7 liters of water a day for women and 3.7 liters for men, from all drinks and food. About 80% comes from drinks, so a woman needs roughly <strong>${r.value}</strong> (2.2 L, about 9 cups) of fluids and a man about 101 oz (13 cups). Add about 1 liter per hour of hard exercise.`,
  stepsTitle: 'How to work out how much water you should drink',
  steps: [
    'Start from the National Academies adequate intake for drinks: about 2.2 L (74 oz) for women, 3.0 L (101 oz) for men, 2.3 L in pregnancy and 3.1 L while breastfeeding.',
    'Add your exercise sweat losses. Sweat rates vary widely, so pick light, moderate or heavy; for accuracy, weigh yourself before and after a session.',
    'Add an allowance for hot or humid weather, or for a day working outdoors.',
    'Check the total against your body: if you are thirsty or your urine is dark, drink more. <strong>Do not force down large amounts beyond your needs</strong>; overdrinking during long events can cause dangerously low sodium.',
    'Spread drinks through the day. Water, milk, tea, coffee and other beverages all count, and so does water in food.'
  ],
  formulaTitle: 'How does the calculator estimate daily water needs?',
  formula: {
    expr: 'Daily drinks = baseline + (exercise hours × sweat rate) + heat allowance<br>Rehydration after exercise ≈ 1.5 L × kg of body weight lost',
    vars: [['baseline', 'National Academies adequate intake from beverages: women 2.2 L, men 3.0 L, pregnancy 2.3 L, breastfeeding 3.1 L'], ['sweat rate', 'liters lost per hour of exercise (0.5, 1 or 1.5 L/h)'], ['heat allowance', '+0.5 L or +1 L for hot surroundings'], ['1 L', '33.8 US fl oz, about 4.2 cups']],
    note: 'The baselines are the Institute of Medicine\'s 2004 adequate intakes for adults 19 and older, which equal total water intakes of 2.7 L (women), 3.7 L (men), 3.0 L (pregnancy) and 3.8 L (breastfeeding), with about 20% assumed to come from food. The sweat-rate options and heat allowances are planning assumptions, not official figures: the American College of Sports Medicine stresses that sweat rates vary too much between people for one number to fit everyone.'
  },
  example: `<p>A 165-lb man runs for 45 minutes on a hot summer morning, sweating heavily.</p>
<p>Baseline from drinks: 3.0 L. Exercise: 0.75 h × 1.5 L/h = 1.13 L. Heat allowance: 0.5 L. Total = <strong>4.63 L, about 156 oz or 19.5 cups</strong> from all drinks that day.</p>
<p>He weighs 165.0 lb before and 162.8 lb after, a loss of 2.2 lb (1.0 kg). To rehydrate, he aims for about 1.5 × 1.0 = <strong>1.5 L (51 oz)</strong> over the next few hours, ideally with a salty snack or meal.</p>`,
  table: {
    title: 'How much water should you drink a day with exercise?',
    intro: 'Daily fluid from drinks in US fl oz (liters in brackets), by life stage, weather and minutes of moderate-to-hard exercise (1 L per hour), as calculated above.',
    head: ['Who', 'Weather', 'No exercise', '30 min', '60 min', '90 min'],
    rows: ({ run }) => [['f', 'Women'], ['m', 'Men'], ['preg', 'Pregnant'], ['bf', 'Breastfeeding']].flatMap(([st, name]) => [['0', 'Mild'], ['0.5', 'Hot']].map(([cl, w]) => [name, w, ...[0, 30, 60, 90].map(ex => {
      const r = run({ stage: st, units: 'us', climate: cl, ex, sweat: '1', lost: NaN });
      const l = { f: 2.2, m: 3.0, preg: 2.3, bf: 3.1 }[st] + ex / 60 + Number(cl);
      return r.value + ' (' + l.toFixed(1) + ' L)';
    })])),
    note: 'Use these as starting points. Hard training in the heat can raise sweat losses well above 1 L per hour.'
  },
  sections: [
    {
      h2: 'How much water should you drink in a day?',
      html: `<p>In 2004 the Institute of Medicine (now the National Academies of Sciences, Engineering, and Medicine) found that adequately hydrated women take in about <strong>2.7 liters (91 oz)</strong> of total water a day and men about <strong>3.7 liters (125 oz)</strong>. About 80% comes from water and other drinks, including caffeinated ones, and 20% from food. That works out to about 9 cups of fluids for women and 13 for men.</p>
<p>The panel deliberately gave no rule for glasses of plain water and said most healthy people meet their needs by letting thirst guide them. The popular "8 glasses a day" (64 oz) is not an official recommendation; it is less than the adequate intake from drinks for either sex, though food and other beverages make up the difference for many people.</p>
<p>Children need less: the same report sets drink intakes of about 5 cups for ages 4–8, 7–8 cups for ages 9–13, and 8 cups (girls) to 11 cups (boys) for ages 14–18.</p>`
    },
    {
      h2: 'How much water should I drink while breastfeeding or pregnant?',
      html: `<p>The National Academies set higher adequate intakes for both:</p>
<ul>
<li><strong>Pregnancy:</strong> 3.0 L of total water a day, about 2.3 L (78 oz, 10 cups) from drinks.</li>
<li><strong>Breastfeeding:</strong> 3.8 L of total water a day, about 3.1 L (105 oz, 13 cups) from drinks, to cover the water that goes into milk.</li>
</ul>
<p>Many breastfeeding parents notice strong thirst during feeds; keeping a drink nearby and drinking to thirst usually covers the extra need. Drinking well beyond thirst has not been shown to increase milk supply. For how much expressed milk your baby needs, see the <a href="/breast-milk-calculator">breast milk calculator</a>.</p>`
    },
    {
      h2: 'How much water should an athlete drink a day?',
      html: `<p>Start with the daily baseline and add what you sweat out. The American College of Sports Medicine's position stand on fluid replacement says sweat rates and sweat sodium differ so much between people that customized plans are recommended, and that individual sweat rates can be estimated by weighing before and after exercise.</p>
<p>Its practical goals: begin exercise well hydrated, drink during exercise to avoid losing more than 2% of body weight (3 lb for a 150-lb athlete), and replace the deficit afterward. A common recovery target is about 1.5 L for each kilogram lost, roughly 23 oz per pound, because you keep losing some fluid as urine while you rehydrate. Sports drinks with sodium and carbohydrate help in long or very sweaty sessions.</p>`
    },
    {
      h2: 'Can you drink too much water?',
      html: `<p>Yes. Drinking far more than you lose, especially quickly or during long endurance events, can dilute blood sodium and cause hyponatremia. Early signs include nausea, headache, confusion and swelling; severe cases cause seizures and can be fatal. Gaining weight during a long race is a warning sign that you are drinking more than you sweat.</p>
<p>For everyday life the risk is low in healthy adults, but it is one reason this calculator gives a planning estimate rather than a quota to hit. People with heart failure, kidney disease or liver disease may be told to limit fluids and should follow that advice.</p>`
    }
  ],
  faq: [
    { q: 'Is drinking 8 glasses of water a day right?', a: 'It is a reasonable minimum for many people but not an official rule. The National Academies suggest about 9 cups of fluids for women and 13 for men from all beverages, plus water from food.' },
    { q: 'Does coffee count toward water intake?', a: 'Yes. The National Academies counted caffeinated drinks such as coffee and tea toward total water intake; their mild diuretic effect does not cancel out the fluid.' },
    { q: 'How much water should a 150-pound person drink?', a: 'The National Academies baseline is about 74 oz of fluids a day for a woman and 101 oz for a man, whatever their weight. The "half your weight in ounces" rule gives 75 oz for 150 lb, which is close to the women\'s figure.' },
    { q: 'How many 16.9-oz water bottles is 74 oz?', a: 'About 4.4 standard 16.9-oz (500 mL) bottles. Other drinks and watery foods count too, so you do not need to get it all from bottled water.' },
    { q: 'How do I know if I am drinking enough water?', a: 'You rarely feel thirsty and your urine is pale yellow. Dark urine, headache and fatigue suggest you need more; needs rise with heat, exercise, fever, vomiting or diarrhea.' },
    { q: 'How much water should I drink while breastfeeding?', a: 'About 3.1 liters (105 oz, 13 cups) of fluids a day, part of a 3.8-liter total water intake set by the National Academies. Drinking to thirst usually covers it.' },
    { q: 'Should I drink more water when it is hot?', a: 'Yes. The CDC lists hot climates, physical activity, fever, diarrhea and vomiting as times your body needs more water. The calculator adds 0.5 to 1 liter as a planning allowance for heat.' }
  ],
  related: ['breast-milk-calculator', 'calories-burned-calculator', 'calorie-calculator', 'sleep-calculator'],
  sources: [
    { name: 'National Academies: Report sets dietary intake levels for water, salt and potassium (2004)', url: 'https://www.nationalacademies.org/news/report-sets-dietary-intake-levels-for-water-salt-and-potassium-to-maintain-health-and-reduce-chronic-disease-risk' },
    { name: 'National Academies Press: Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate', url: 'https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate' },
    { name: 'ACSM position stand: Exercise and fluid replacement (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/17277604/' },
    { name: 'CDC: About Water and Healthier Drinks', url: 'https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html' }
  ],
  disclaimer: 'General guidance for healthy adults, not medical advice. Anyone on a fluid restriction or with kidney, heart or liver disease should follow their care team\'s instructions.'
};
