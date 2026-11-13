export default {
  slug: 'macro-calculator',
  hub: 'health',
  name: 'Macro Calculator',
  title: 'Macro Calculator: 2,400 kcal Recomp = 154 g Protein, 67 g Fat',
  h1: 'Macro Calculator: Turn Your Calories Into Protein, Fat and Carb Grams',
  meta: 'At 170 lb and 2,400 calories, a body recomp split is 154 g protein, 67 g fat and 296 g carbs a day. Pick recomp, cut, bulk, keto or set your own ratio.',
  keyword: 'how to calculate macros for body recomp',
  also: ['macro calculator', 'how to calculate macros', 'macronutrient calculator', 'body recomp macros', 'how to calculate macros for weight loss', 'keto macro calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'cal', label: 'Daily calories', type: 'number', value: 2400, suffix: 'kcal', help: 'Don\'t know it? Get your maintenance number from the calorie calculator.' },
    { id: 'units', label: 'Weight units', type: 'select', value: 'us', options: [['us', 'Pounds'], ['metric', 'Kilograms']] },
    { id: 'lb', label: 'Body weight', type: 'number', value: 170, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Body weight', type: 'number', value: 77, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'plan', label: 'Goal / split', type: 'select', value: 'recomp', wide: true, options: [['recomp', 'Body recomposition: 2.0 g protein/kg, 25% fat, rest carbs'], ['cut', 'Fat loss: 2.2 g protein/kg, 25% fat, rest carbs'], ['bulk', 'Muscle gain: 1.8 g protein/kg, 25% fat, rest carbs'], ['balanced', 'Balanced: 30% protein, 30% fat, 40% carbs'], ['lowcarb', 'Low carb: 30% protein, 45% fat, 25% carbs'], ['keto', 'Keto: 20% protein, 75% fat, 5% carbs'], ['custom', 'Custom percentages']] },
    { id: 'pp', label: 'Protein', type: 'number', value: 30, suffix: '%', showIf: { plan: ['custom'] } },
    { id: 'fp', label: 'Fat', type: 'number', value: 30, suffix: '%', showIf: { plan: ['custom'] } },
    { id: 'cp', label: 'Carbs', type: 'number', value: 40, suffix: '%', showIf: { plan: ['custom'] } },
    { id: 'meals', label: 'Meals a day', type: 'number', value: 4 }
  ],
  compute(v, H) {
    if (!(v.cal >= 800 && v.cal <= 8000)) return { error: 'Enter daily calories between 800 and 8,000.' };
    var kg = v.units === 'metric' ? v.kg : v.lb * 0.45359237;
    var byWeight = { recomp: 2.0, cut: 2.2, bulk: 1.8 };
    var pct = { balanced: [30, 30, 40], lowcarb: [30, 45, 25], keto: [20, 75, 5] };
    var P, F, C;
    if (byWeight[v.plan]) {
      if (!(kg >= 30 && kg <= 350)) return { error: 'Enter your body weight to set protein.' };
      P = byWeight[v.plan] * kg;
      F = v.cal * 0.25 / 9;
      C = (v.cal - P * 4 - F * 9) / 4;
      if (C < 0) return { error: 'These calories are too low for a protein target of ' + H.int(P) + ' g plus 25% fat. Raise calories or choose another split.' };
    } else {
      var s = pct[v.plan] || [v.pp, v.fp, v.cp];
      if (!(s[0] >= 0 && s[1] >= 0 && s[2] >= 0)) return { error: 'Enter protein, fat and carb percentages.' };
      if (Math.abs(s[0] + s[1] + s[2] - 100) > 0.5) return { error: 'Percentages add up to ' + H.num(s[0] + s[1] + s[2], 1) + '%. Make them total 100%.' };
      P = v.cal * s[0] / 100 / 4; F = v.cal * s[1] / 100 / 9; C = v.cal * s[2] / 100 / 4;
    }
    var m = v.meals >= 1 && v.meals <= 10 ? Math.round(v.meals) : 0;
    var pc = function (k) { return H.pct(k / v.cal * 100, 0); };
    var rows = [
      ['Protein', H.int(P) + ' g · ' + H.int(P * 4) + ' kcal · ' + pc(P * 4), true],
      ['Fat', H.int(F) + ' g · ' + H.int(F * 9) + ' kcal · ' + pc(F * 9), true],
      ['Carbohydrate', H.int(C) + ' g · ' + H.int(C * 4) + ' kcal · ' + pc(C * 4), true]
    ];
    if (kg > 0) rows.push(['Protein per body weight', H.fix(P / kg, 1) + ' g/kg (' + H.fix(P / (kg / 0.45359237), 2) + ' g/lb)']);
    if (m) rows.push(['Per meal (' + m + ' meals)', H.int(P / m) + ' g P · ' + H.int(F / m) + ' g F · ' + H.int(C / m) + ' g C']);
    var warn = (P * 4 / v.cal < 0.1 || F * 9 / v.cal < 0.2) ? ' This split falls below the National Academies\' ranges for protein (10%) or fat (20%).' : '';
    return {
      value: H.int(P) + ' / ' + H.int(F) + ' / ' + H.int(C) + ' g',
      label: 'Protein / fat / carbs per day',
      expr: H.int(v.cal) + ' kcal → ' + H.int(P) + '×4 + ' + H.int(F) + '×9 + ' + H.int(C) + '×4',
      rows: rows,
      sub: 'Hit protein first, keep fat in range, and let carbs fill the rest.' + warn,
      P: P, F: F, C: C
    };
  },
  quick: ({ r }) => `To calculate macros for body recomp, set protein by body weight first (1.6–2.2 g/kg), give fat about 25% of calories, and fill the rest with carbs. At <strong>170 lb (77.1 kg) and 2,400 kcal</strong>, 2.0 g/kg is 154 g protein (617 kcal), 25% fat is 67 g (600 kcal), and the remaining 1,183 kcal is 296 g carbs: <strong>${r.value}</strong> protein/fat/carbs.`,
  stepsTitle: 'How to calculate your macros',
  steps: [
    'Start with calories. For body recomposition, eat at or a little below maintenance; for fat loss, use a deficit of about 500 kcal; for muscle gain, a small surplus. The <a href="/calorie-calculator">calorie calculator</a> gives the maintenance number.',
    'Set protein from body weight, not from a percentage: 1.6–2.2 g per kg (about 0.7–1.0 g per lb). At 77.1 kg, 2.0 g/kg is 154 g, or 617 kcal.',
    'Set fat at 20–35% of calories. 25% of 2,400 kcal is 600 kcal, and 600 ÷ 9 = 67 g.',
    'Give the remaining calories to carbs: 2,400 − 617 − 600 = 1,183 kcal, and 1,183 ÷ 4 = 296 g.',
    'Split across meals. Four meals of about 39 g protein is 0.5 g/kg per meal, inside the 0.4–0.55 g/kg-per-meal range Schoenfeld and Aragon suggest for muscle growth.'
  ],
  formulaTitle: 'How do you convert macros to calories?',
  formula: {
    expr: 'Protein (g) = target g/kg × body weight (kg)<br>Fat (g) = calories × fat % ÷ 9<br>Carbs (g) = (calories − protein g × 4 − fat g × 9) ÷ 4',
    vars: [['4', 'kcal per gram of protein or carbohydrate'], ['9', 'kcal per gram of fat'], ['7', 'kcal per gram of alcohol (not counted as a macro here)']],
    note: 'Percentage splits (balanced, low carb, keto, custom) skip the body-weight step: grams = calories × percentage ÷ 4 or 9.'
  },
  example: `<p>A 140 lb (63.5 kg) woman eating 1,800 kcal to lose fat chooses 2.2 g/kg of protein.</p><p>Protein: 2.2 × 63.5 = <strong>140 g</strong> (559 kcal, 31% of calories). Fat: 25% × 1,800 = 450 kcal ÷ 9 = <strong>50 g</strong>. Carbs: (1,800 − 559 − 450) ÷ 4 = <strong>198 g</strong>.</p><p>Compare a fixed 30/30/40 split at 2,400 kcal: 180 g protein, 80 g fat and 240 g carbs. Percentages are simple, but they hand a 130 lb person and a 230 lb person the same protein if they eat the same calories, which is why the goal-based options set protein from body weight.</p>`,
  table: {
    title: 'What are my macros at 1,600 to 3,200 calories?',
    intro: 'Body recomposition macros for a 170 lb person (protein fixed at 2.0 g/kg, fat at 25%) at different calorie levels, computed with the calculator above.',
    head: ['Calories', 'Protein', 'Fat', 'Carbs', 'Carbs % of calories'],
    rows: ({ run, H }) => [1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200].map(c => {
      const r = run({ cal: c, units: 'us', lb: 170, plan: 'recomp' });
      return [H.int(c) + ' kcal', H.int(r.P) + ' g', H.int(r.F) + ' g', H.int(r.C) + ' g', H.pct(r.C * 4 / c * 100, 0)];
    }),
    note: 'Because protein stays tied to body weight, carbohydrate absorbs almost all of the calorie change: about 37 g of carbs per 200 kcal.'
  },
  sections: [
    {
      h2: 'How do you calculate macros for body recomposition?',
      html: `<p>Body recomposition means losing fat and gaining muscle at the same time, usually with calories close to maintenance and regular resistance training. The macro math puts protein first:</p><ol><li><strong>Protein:</strong> 1.6–2.2 g/kg a day. A 2018 meta-analysis of 49 trials (Morton et al., <em>British Journal of Sports Medicine</em>) found that extra protein stopped adding to strength-training gains in fat-free mass at about 1.6 g/kg, with 2.2 g/kg as the upper end of the confidence range. Going to 2.0 g/kg covers most people.</li><li><strong>Fat:</strong> 20–35% of calories, the National Academies' acceptable range for adults.</li><li><strong>Carbs:</strong> whatever is left, which fuels training.</li></ol><p>Recomp works best for beginners, people returning after a break, and people with more body fat. Lean, experienced lifters usually make faster progress alternating a dedicated gaining phase with a cutting phase.</p>`
    },
    {
      h2: 'What is the best macro ratio for fat loss?',
      html: `<p>The one you can stick to, as long as calories and protein are right. In the DIETFITS trial (Gardner et al., <em>JAMA</em> 2018), 609 adults were randomized to a healthy low-fat or a healthy low-carb diet for a year. Average weight loss was 5.3 kg versus 6.0 kg, a difference that was not statistically significant.</p><p>What matters more is the calorie deficit and keeping protein high to hold on to muscle. The International Society of Sports Nutrition notes that resistance-trained people in a calorie deficit may benefit from even higher intakes, 2.3–3.1 g/kg, to preserve lean mass. The "fat loss" option here uses 2.2 g/kg as a practical middle ground; the <a href="/protein-calculator">protein calculator</a> shows the full range for your weight and goal.</p>`
    },
    {
      h2: 'What are the recommended ranges for protein, fat and carbs?',
      html: `<div class="twrap"><table><thead><tr><th>Macronutrient</th><th>Acceptable range (adults)</th><th>At 2,400 kcal</th></tr></thead><tbody>
<tr><td>Protein</td><td>10–35% of calories</td><td>60–210 g</td></tr>
<tr><td>Fat</td><td>20–35% of calories</td><td>53–93 g</td></tr>
<tr><td>Carbohydrate</td><td>45–65% of calories</td><td>270–390 g</td></tr>
</tbody></table></div><p>These Acceptable Macronutrient Distribution Ranges come from the National Academies' Dietary Reference Intakes. The Dietary Guidelines for Americans, 2025–2030 set a protein goal of 1.2–1.6 g per kg of body weight a day, which for a 170 lb adult is 93–123 g.</p><p>Low-carb and keto splits deliberately go below the carbohydrate range. A ketogenic diet typically keeps carbs around 20–50 g a day; the keto preset here gives 30 g at 2,400 kcal. If you count carbs that way, the <a href="/net-carbs-calculator">net carbs calculator</a> handles fiber and sugar alcohols.</p>`
    },
    {
      h2: 'Should I count macros or just calories?',
      html: `<p>Calories decide whether you gain or lose weight; macros decide how much of that change is fat versus muscle and how well you train. A practical middle path is to track calories and protein only, and let fat and carbs land where they land within the ranges above. Many people find that hitting a protein number naturally keeps the rest of the diet in reasonable shape.</p><p>Check labels with the 4-4-9 rule: a bar with 20 g protein, 10 g fat and 22 g carbs should have about 20 × 4 + 10 × 9 + 22 × 4 = 258 kcal. Fiber and sugar alcohols supply fewer calories than this, so low-carb products often come in under the 4-4-9 estimate.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my macros?', a: 'Pick a calorie target, set protein at 1.6–2.2 g per kg of body weight, set fat at 20–35% of calories (divide by 9 for grams), and give the remaining calories to carbs (divide by 4). At 170 lb and 2,400 kcal that is 154 g protein, 67 g fat and 296 g carbs.' },
    { q: 'What macros should I eat for body recomp?', a: 'Eat near maintenance calories with protein around 2.0 g/kg (about 0.9 g/lb), fat around 25% of calories and the rest from carbs, plus resistance training at least two to three times a week.' },
    { q: 'How many grams of protein per pound should I eat?', a: 'About 0.7–1.0 g per pound (1.6–2.2 g/kg) if you lift and want to build or keep muscle. The general adult minimum is 0.36 g per pound (0.8 g/kg).' },
    { q: 'Is 40/30/30 a good macro split?', a: 'A 40% carb, 30% protein, 30% fat split is reasonable for most active people. At 2,000 kcal it gives 200 g carbs, 150 g protein and 67 g fat. Check that the protein is at least 1.6 g/kg if muscle is your goal.' },
    { q: 'What are keto macros?', a: 'Typically about 70–75% of calories from fat, 20–25% from protein and 5–10% from carbs. The keto preset uses 75/20/5: at 2,000 kcal that is 167 g fat, 100 g protein and 25 g carbs.' },
    { q: 'Do I need to hit my macros exactly?', a: 'No. Landing within about 10 g of protein and 5–10 g of fat on most days is plenty. Weekly averages matter more than any single day.' },
    { q: 'How many calories are in a gram of protein, fat and carbs?', a: 'Protein and carbohydrate have about 4 kcal per gram and fat about 9 kcal per gram. Alcohol has about 7.' }
  ],
  related: ['protein-calculator', 'calorie-calculator', 'calorie-deficit-calculator', 'net-carbs-calculator', 'bmr-calculator'],
  sources: [
    { name: 'Morton RW et al. Protein supplementation and resistance training-induced gains: meta-analysis. Br J Sports Med 2018', url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/' },
    { name: 'Jäger R et al. ISSN Position Stand: Protein and Exercise. J Int Soc Sports Nutr 2017', url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/' },
    { name: 'Schoenfeld BJ, Aragon AA. How much protein can the body use in a single meal for muscle-building? J Int Soc Sports Nutr 2018', url: 'https://pubmed.ncbi.nlm.nih.gov/29497353/' },
    { name: 'Gardner CD et al. Low-fat vs low-carbohydrate diet on 12-month weight loss (DIETFITS). JAMA 2018', url: 'https://pubmed.ncbi.nlm.nih.gov/29466592/' },
    { name: 'National Academies: Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids', url: 'https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids' },
    { name: 'Dietary Guidelines for Americans, 2025–2030', url: 'https://www.dietaryguidelines.gov/' }
  ],
  disclaimer: 'Macro targets are general estimates for healthy adults, not medical advice. People with kidney disease, diabetes or other conditions should set protein and carbohydrate targets with their care team.'
};
