export default {
  slug: 'protein-calculator',
  hub: 'health',
  name: 'Protein Intake Calculator',
  title: 'Protein Calculator: 150 lb Needs 54 g Minimum, 82–109 g Goal',
  h1: 'Protein Intake Calculator: Grams a Day for Your Weight and Goal',
  meta: 'A 150 lb adult needs at least 54 g of protein a day (RDA) and 82–109 g under the 2025–2030 Dietary Guidelines. Get your range, per-meal grams and % of calories.',
  keyword: 'how to calculate the amount of protein you need',
  also: ['protein calculator', 'how much protein do i need', 'protein intake calculator', 'how much protein per day', 'how to calculate protein to calorie ratio', 'protein per kg body weight'],
  updated: '2026-11-13',
  inputs: [
    { id: 'units', label: 'Weight units', type: 'select', value: 'us', options: [['us', 'Pounds'], ['metric', 'Kilograms']] },
    { id: 'lb', label: 'Body weight', type: 'number', value: 150, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Body weight', type: 'number', value: 68, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'goal', label: 'Your situation', type: 'select', value: 'dga', wide: true, options: [['rda', 'Minimum for healthy adults: RDA 0.8 g/kg'], ['dga', 'General goal: Dietary Guidelines 2025–2030, 1.2–1.6 g/kg'], ['older', 'Healthy adult 65+: 1.0–1.2 g/kg (PROT-AGE)'], ['athlete', 'Endurance or mixed-sport athlete: 1.2–2.0 g/kg'], ['muscle', 'Lifting to build muscle: 1.6–2.2 g/kg'], ['cut', 'Lifting while dieting: 2.3–3.1 g/kg'], ['pregnant', 'Pregnancy: RDA 1.1 g/kg (at least 71 g)']] },
    { id: 'cal', label: 'Daily calories (optional)', type: 'number', value: 2000, suffix: 'kcal', help: 'Shows protein as a share of calories.' },
    { id: 'meals', label: 'Meals a day', type: 'number', value: 3 }
  ],
  data: { ranges: { rda: [0.8, 0.8], dga: [1.2, 1.6], older: [1.0, 1.2], athlete: [1.2, 2.0], muscle: [1.6, 2.2], cut: [2.3, 3.1], pregnant: [1.1, 1.1] } },
  compute(v, H, D) {
    var kg = v.units === 'metric' ? v.kg : v.lb * 0.45359237;
    if (!(kg >= 20 && kg <= 350)) return { error: 'Enter a body weight between 45 and 770 lb (20–350 kg).' };
    var rg = D.ranges[v.goal] || D.ranges.dga;
    var lo = kg * rg[0], hi = kg * rg[1];
    if (v.goal === 'pregnant') { lo = Math.max(lo, 71); hi = lo; }
    var single = Math.round(lo) === Math.round(hi);
    var val = single ? H.int(lo) + ' g/day' : H.int(lo) + '–' + H.int(hi) + ' g/day';
    var rows = [];
    if (v.goal !== 'rda') rows.push(['RDA minimum (0.8 g/kg)', H.int(kg * 0.8) + ' g']);
    rows.push(['Per pound of body weight', single ? H.fix(lo / kg * 0.45359237, 2) + ' g/lb' : H.fix(rg[0] * 0.45359237, 2) + '–' + H.fix(rg[1] * 0.45359237, 2) + ' g/lb']);
    var m = v.meals >= 1 && v.meals <= 8 ? Math.round(v.meals) : 0;
    if (m) rows.push(['Per meal (' + m + ' meals)', single ? H.int(lo / m) + ' g' : H.int(lo / m) + '–' + H.int(hi / m) + ' g', true]);
    if (v.cal >= 800) rows.push(['Share of ' + H.int(v.cal) + ' kcal', single ? H.pct(lo * 4 / v.cal * 100, 0) : H.pct(lo * 4 / v.cal * 100, 0) + '–' + H.pct(hi * 4 / v.cal * 100, 0)]);
    var over = v.cal >= 800 && hi * 4 / v.cal > 0.35;
    return {
      value: val,
      label: 'Protein target',
      expr: H.num(kg, 1) + ' kg × ' + (rg[0] === rg[1] ? rg[0] : rg[0] + '–' + rg[1]) + ' g/kg',
      rows: rows,
      sub: (over ? 'The top of this range is over 35% of your calories, the upper end of the National Academies\' acceptable range; that is common on a diet but worth balancing. ' : '') + 'Spread it over the day: 0.4–0.55 g/kg per meal (' + H.int(kg * 0.4) + '–' + H.int(kg * 0.55) + ' g) suits muscle building.',
      lo: lo, hi: hi
    };
  },
  quick: ({ r }) => `To calculate how much protein you need, multiply your weight in kilograms (pounds ÷ 2.2) by a protein factor. The RDA minimum is 0.8 g/kg, so a <strong>150 lb (68 kg)</strong> adult needs at least 54 g a day. The Dietary Guidelines for Americans, 2025–2030 set a goal of 1.2–1.6 g/kg, which is <strong>${r.value}</strong>; people lifting to build muscle aim for 1.6–2.2 g/kg.`,
  stepsTitle: 'How to calculate your protein needs',
  steps: [
    'Convert your weight to kilograms: pounds ÷ 2.205. 150 lb is 68.0 kg.',
    'Pick the factor for your situation: 0.8 g/kg is the minimum for healthy adults; 1.2–1.6 g/kg is the 2025–2030 Dietary Guidelines goal; 1.6–2.2 g/kg if you lift to build muscle.',
    'Multiply: 68.0 × 0.8 = 54 g minimum; 68.0 × 1.2 to 68.0 × 1.6 = 82–109 g.',
    'Divide by meals. Three meals at the 1.2–1.6 g/kg goal is 27–36 g each. Packing most protein into dinner is the common mistake; spreading it out is better for muscle.',
    'If you have significant excess body fat, many dietitians base protein on a goal or adjusted body weight instead of current weight, so the target is not inflated.'
  ],
  formulaTitle: 'What is the formula for daily protein?',
  formula: {
    expr: 'Protein (g/day) = body weight (kg) × protein factor (g/kg)<br>Body weight (kg) = pounds ÷ 2.205<br>Protein % of calories = protein g × 4 ÷ total calories × 100',
    vars: [['0.8 g/kg', 'RDA for healthy adults (National Academies)'], ['1.2–1.6 g/kg', 'Dietary Guidelines for Americans, 2025–2030 goal'], ['1.6–2.2 g/kg', 'upper useful range for resistance-training muscle gain (Morton 2018)'], ['4', 'kcal per gram of protein']]
  },
  example: `<p>A 200 lb (90.7 kg) man lifts weights four times a week and wants to add muscle.</p><p>Minimum: 90.7 × 0.8 = <strong>73 g</strong>. Muscle-building range: 90.7 × 1.6 = <strong>145 g</strong> up to 90.7 × 2.2 = <strong>200 g</strong> a day.</p><p>Spread over four meals, 145 g is about 36 g per meal, which is 0.4 g/kg each time, the per-meal amount Schoenfeld and Aragon recommend across at least four meals. At 2,800 kcal, 145 g is 21% of calories.</p>`,
  table: {
    title: 'How much protein do I need for my weight?',
    intro: 'Daily protein in grams by body weight, computed with the calculator above.',
    head: ['Body weight', 'RDA minimum (0.8 g/kg)', 'Dietary Guidelines (1.2–1.6 g/kg)', 'Building muscle (1.6–2.2 g/kg)'],
    rows: ({ run, H }) => [100, 120, 140, 150, 160, 180, 200, 220, 240, 260, 280, 300].map(w => {
      const a = run({ units: 'us', lb: w, goal: 'rda', cal: NaN, meals: 3 });
      const b = run({ units: 'us', lb: w, goal: 'dga', cal: NaN, meals: 3 });
      const c = run({ units: 'us', lb: w, goal: 'muscle', cal: NaN, meals: 3 });
      return [w + ' lb (' + H.num(w * 0.45359237, 0) + ' kg)', H.int(a.lo) + ' g', H.int(b.lo) + '–' + H.int(b.hi) + ' g', H.int(c.lo) + '–' + H.int(c.hi) + ' g'];
    }),
    note: 'For heavier body weights, a target based on goal weight is often more realistic. These are totals from all foods, not supplements.'
  },
  sections: [
    {
      h2: 'How much protein do you need to build muscle?',
      html: `<p>About 1.6 g per kg of body weight a day, and up to 2.2 g/kg for some people. A 2018 meta-analysis of 49 randomized trials (Morton et al., <em>British Journal of Sports Medicine</em>) found that protein beyond about 1.6 g/kg a day produced no further gains in fat-free mass from resistance training, with the confidence range reaching 2.2 g/kg. The International Society of Sports Nutrition puts most exercising people at 1.4–2.0 g/kg.</p><p>While dieting, needs go up. The ISSN notes that resistance-trained people in a calorie deficit may need 2.3–3.1 g/kg to keep as much lean mass as possible. Protein only builds muscle alongside training, though; eating more without lifting mostly just adds calories. Fit the grams into your daily calories with the <a href="/macro-calculator">macro calculator</a>.</p>`
    },
    {
      h2: 'How much protein should you eat per meal?',
      html: `<p>Roughly 0.4 g/kg per meal, over at least four meals, if muscle is the goal. That is the recommendation from Schoenfeld and Aragon's 2018 review in the <em>Journal of the International Society of Sports Nutrition</em>, which adds that going up to 0.55 g/kg per meal reaches the 2.2 g/kg daily upper end. For a 150 lb (68 kg) person that is about 27–37 g per meal.</p><p>The body can absorb more than that at once; the question is how much goes toward muscle building at a time. For general health, simply making sure breakfast and lunch include real protein, not just dinner, gets most people to their daily target.</p>`
    },
    {
      h2: 'How do you calculate your protein-to-calorie ratio?',
      html: `<p>Multiply protein grams by 4 and divide by total calories. 100 g of protein on a 2,000-calorie diet is 400 kcal, or <strong>20%</strong> of calories. The National Academies' acceptable range for adults is 10–35% of calories.</p><p>The same math works for a single food. A Greek yogurt with 120 kcal and 15 g protein gets 60 kcal, or 50%, of its calories from protein; a granola bar with 190 kcal and 4 g protein gets 8%. Foods with a high protein-to-calorie ratio make a high protein target much easier to reach without overshooting calories, which matters most when you are in a <a href="/calorie-deficit-calculator">calorie deficit</a>.</p>`
    },
    {
      h2: 'Do older adults need more protein?',
      html: `<p>Yes. The PROT-AGE study group, writing for the European Union Geriatric Medicine Society, recommends at least 1.0–1.2 g/kg a day for healthy adults over 65, at least 1.2 g/kg for those who exercise, and 1.2–1.5 g/kg for most older adults with acute or chronic illness. The goal is to slow age-related muscle loss.</p><p>The 2025–2030 Dietary Guidelines go further for the whole population with their 1.2–1.6 g/kg goal, and specifically note that some older adults need fewer calories but equal or greater amounts of protein. Older adults with reduced kidney function are the exception and should set a protein target with their doctor.</p>`
    },
    {
      h2: 'Can you eat too much protein?',
      html: `<p>For healthy people, intakes in the ranges above are widely used. The main caution is kidney disease: the NIDDK notes that some people with chronic kidney disease need to limit protein so waste products do not build up, while too little can cause malnutrition, so the right amount should be set with a dietitian. Very high protein intakes also crowd out fiber-rich foods if they come mostly from shakes and meat, so get a share from beans, lentils, dairy, fish and nuts.</p>`
    }
  ],
  faq: [
    { q: 'How much protein do I need a day?', a: 'At least 0.8 g per kg of body weight (0.36 g per lb). The 2025–2030 Dietary Guidelines set a goal of 1.2–1.6 g/kg. For a 150 lb person that is a 54 g minimum and an 82–109 g goal.' },
    { q: 'How many grams of protein per pound should I eat?', a: 'The minimum is 0.36 g per pound. The Dietary Guidelines goal is about 0.54–0.73 g per pound, and people building muscle usually aim for 0.7–1.0 g per pound.' },
    { q: 'Is 1 gram of protein per pound too much?', a: 'For healthy people who lift, 1 g per pound (2.2 g/kg) is the top of the useful range for muscle gain, not dangerous. Most people get the same results from about 0.7–0.8 g per pound.' },
    { q: 'How much protein do I need to lose weight?', a: 'Aim for at least 1.2–1.6 g/kg, and 1.6–2.2 g/kg if you also lift weights. Higher protein helps protect muscle and keeps you fuller while eating less.' },
    { q: 'How much protein do I need during pregnancy?', a: 'The RDA in pregnancy is 1.1 g per kg of body weight, and at least 71 g a day. Your prenatal care provider can adjust that for twins, low body weight or other conditions.' },
    { q: 'What does 30 g of protein look like?', a: 'Roughly 4 oz (113 g) of cooked chicken breast, or 4 large eggs plus a cup of milk. Labels and USDA FoodData Central give exact grams for other foods.' },
    { q: 'Should I use my current weight or goal weight?', a: 'Use current weight if you are near a healthy weight. If you carry a lot of excess body fat, a goal or adjusted weight gives a more realistic target.' }
  ],
  related: ['macro-calculator', 'calorie-calculator', 'calorie-deficit-calculator', 'ideal-weight-calculator', 'one-rep-max-calculator'],
  sources: [
    { name: 'Dietary Guidelines for Americans, 2025–2030', url: 'https://www.dietaryguidelines.gov/' },
    { name: 'National Academies: Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids', url: 'https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids' },
    { name: 'Morton RW et al. Protein supplementation and resistance training: meta-analysis. Br J Sports Med 2018', url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/' },
    { name: 'Jäger R et al. ISSN Position Stand: Protein and Exercise. 2017', url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/' },
    { name: 'Schoenfeld BJ, Aragon AA. How much protein can the body use in a single meal? 2018', url: 'https://pubmed.ncbi.nlm.nih.gov/29497353/' },
    { name: 'Bauer J et al. PROT-AGE recommendations for dietary protein in older people. JAMDA 2013', url: 'https://pubmed.ncbi.nlm.nih.gov/23867520/' },
    { name: 'Thomas DT et al. ACSM/AND/DC Joint Position: Nutrition and Athletic Performance. 2016', url: 'https://pubmed.ncbi.nlm.nih.gov/26891166/' },
    { name: 'NIDDK: Eating Right for Chronic Kidney Disease', url: 'https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/eating-nutrition' }
  ],
  disclaimer: 'Protein targets are general estimates for healthy adults, not medical advice. If you have kidney or liver disease, are pregnant, or follow a prescribed diet, check your target with a health care provider.'
};
