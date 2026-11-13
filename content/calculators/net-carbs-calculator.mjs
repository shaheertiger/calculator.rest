export default {
  slug: 'net-carbs-calculator',
  hub: 'health',
  name: 'Net Carbs Calculator',
  title: 'Net Carbs Calculator for Atkins: 20 g a Day in Phase 1',
  h1: 'Net Carbs Calculator: Subtract Fiber and Sugar Alcohols the Right Way',
  meta: 'A bar with 24 g carbs, 10 g fiber, 5 g erythritol and 6 g maltitol has 6 g net carbs (3 g by the Atkins label method). Count any food for Atkins or keto.',
  keyword: 'how to calculate net carbs on atkins diet',
  also: ['net carbs calculator', 'how to calculate net carbs', 'net carbs formula', 'do you subtract sugar alcohols from net carbs', 'net carbs vs total carbs', 'how many net carbs on atkins'],
  updated: '2026-11-13',
  inputs: [
    { id: 'total', label: 'Total carbohydrate (per serving)', type: 'number', value: 24, suffix: 'g' },
    { id: 'fiber', label: 'Dietary fiber', type: 'number', value: 10, suffix: 'g' },
    { id: 'ery', label: 'Erythritol or allulose', type: 'number', value: 5, suffix: 'g', help: 'Check the ingredient list; some labels group these under sugar alcohols.' },
    { id: 'other', label: 'Other sugar alcohols', type: 'number', value: 6, suffix: 'g', help: 'Maltitol, sorbitol, xylitol, isomalt, lactitol, mannitol.' },
    { id: 'servings', label: 'Servings eaten', type: 'number', value: 1 },
    { id: 'method', label: 'Counting method', type: 'select', value: 'half', wide: true, options: [['half', 'Careful: erythritol and allulose in full, other sugar alcohols at half'], ['atkins', 'Atkins label method: subtract all sugar alcohols'], ['fiber', 'Fiber only: subtract fiber, count every sugar alcohol']] },
    { id: 'limit', label: 'Your daily net carb limit', type: 'number', value: 20, suffix: 'g', help: '20 g is Atkins Phase 1; 40 g is Atkins Flex.' }
  ],
  data: {
    foods: [
      ['Spinach, raw', 3.63, 2.2], ['Zucchini, raw', 3.11, 1.0], ['Cauliflower, raw', 4.97, 2.0], ['Broccoli, raw', 6.64, 2.6],
      ['Raspberries', 11.9, 6.5], ['Strawberries', 7.68, 2.0], ['Almonds', 21.6, 12.5], ['Blueberries', 14.5, 2.4],
      ['Lentils, boiled', 20.1, 7.9], ['Banana', 22.8, 2.6], ['White rice, cooked', 28.2, 0.4]
    ]
  },
  compute(v, H) {
    if (!(v.total >= 0)) return { error: 'Enter the total carbohydrate grams from the label.' };
    var fiber = v.fiber > 0 ? v.fiber : 0, ery = v.ery > 0 ? v.ery : 0, other = v.other > 0 ? v.other : 0;
    var s = v.servings > 0 ? v.servings : 1;
    if (fiber + ery + other > v.total + 0.5) return { error: 'Fiber and sugar alcohols are part of total carbohydrate on US labels, so together they cannot exceed it. Check the label (non-US labels often list carbohydrate without fiber).' };
    var otherFactor = v.method === 'atkins' ? 1 : v.method === 'fiber' ? 0 : 0.5;
    var eryFactor = v.method === 'fiber' ? 0 : 1;
    var net1 = Math.max(0, v.total - fiber - ery * eryFactor - other * otherFactor);
    var net = net1 * s;
    var atk = Math.max(0, v.total - fiber - ery - other) * s;
    var rows = [
      ['Total carbs' + (s !== 1 ? ' (' + H.num(s, 2) + ' servings)' : ''), H.num(v.total * s, 1) + ' g'],
      ['− Fiber', H.num(fiber * s, 1) + ' g'],
      ['− Erythritol / allulose', H.num(ery * eryFactor * s, 1) + ' g'],
      ['− Other sugar alcohols' + (otherFactor === 0.5 ? ' (half)' : ''), H.num(other * otherFactor * s, 1) + ' g']
    ];
    if (v.method !== 'atkins') rows.push(['Atkins label method', H.num(atk, 1) + ' g']);
    if (v.limit > 0) rows.push(['Share of a ' + H.num(v.limit, 0) + ' g day', H.pct(net / v.limit * 100, 0), true]);
    var calNote = (ery + other) > 0 ? ' Sugar alcohols still carry some calories (most about 1.5–3 kcal per gram versus 4 for sugar), and large amounts can upset digestion.' : '';
    return {
      value: H.num(net, 1) + ' g',
      label: 'Net carbs' + (s !== 1 ? ' for ' + H.num(s, 2) + ' servings' : ' per serving'),
      expr: H.num(v.total, 1) + ' − ' + H.num(fiber, 1) + (eryFactor && ery ? ' − ' + H.num(ery, 1) : '') + (otherFactor && other ? ' − ' + H.num(other * otherFactor, 1) : '') + (s !== 1 ? ' × ' + H.num(s, 2) : ''),
      rows: rows,
      sub: (v.limit > 0 ? (net <= v.limit ? 'Leaves ' + H.num(v.limit - net, 1) + ' g of your ' + H.num(v.limit, 0) + ' g daily limit.' : 'This alone is over your ' + H.num(v.limit, 0) + ' g daily limit.') : '') + calNote,
      net: net
    };
  },
  quick: ({ r }) => `To calculate net carbs, subtract fiber and sugar alcohols from total carbohydrate. A bar with 24 g carbs, 10 g fiber, 5 g erythritol and 6 g maltitol has 24 − 10 − 5 − 3 = <strong>${r.value} net carbs</strong> if you count maltitol at half, or 3 g by the Atkins method of subtracting all sugar alcohols. Atkins Phase 1 allows 20 g of net carbs a day.`,
  stepsTitle: 'How to calculate net carbs from a food label',
  steps: [
    'Find <strong>Total Carbohydrate</strong> on the Nutrition Facts label (24 g in the example). On US labels this number already includes fiber, sugars and sugar alcohols.',
    'Subtract <strong>Dietary Fiber</strong> (10 g). Fiber is not digested into glucose, so it does not raise blood sugar.',
    'Check the ingredient list for which sugar alcohols are used. Subtract erythritol and allulose in full (5 g); for maltitol, sorbitol, xylitol and similar, subtract half (6 g → 3 g), or all of it if you follow the Atkins label method.',
    'Multiply by the number of servings you actually eat. A "2 servings per package" bar eaten whole doubles everything.',
    'Compare the result with your daily limit: 20 g on Atkins Phase 1, 40 g on Atkins Flex, roughly 20–50 g on most ketogenic diets.'
  ],
  formulaTitle: 'What is the net carbs formula?',
  formula: {
    expr: 'Atkins: Net carbs = Total carbs − Fiber − Sugar alcohols<br>Careful method: Net carbs = Total carbs − Fiber − Erythritol − Allulose − ½ × Other sugar alcohols',
    vars: [['Total carbs', '"Total Carbohydrate" grams on a US Nutrition Facts label'], ['Fiber', '"Dietary Fiber" grams (soluble plus insoluble)'], ['Other sugar alcohols', 'maltitol, sorbitol, xylitol, isomalt, lactitol, mannitol']],
    note: '"Net carbs" is not defined by the FDA. Atkins publishes the first version on its website: Net Carbs = Total Carbohydrates − Fiber − Sugar Alcohols (if applicable). The half-credit rule for most sugar alcohols is a common, more cautious approach because those sweeteners are partly absorbed.'
  },
  example: `<p>A low-carb chocolate bar lists 24 g total carbohydrate, 10 g fiber and 11 g sugar alcohols. The ingredients show erythritol and maltitol, and the brand says 5 g is erythritol, so 6 g is maltitol.</p><p><strong>Atkins label method:</strong> 24 − 10 − 11 = <strong>3 g net carbs</strong>.</p><p><strong>Careful method:</strong> 24 − 10 − 5 − (6 ÷ 2) = <strong>6 g net carbs</strong>.</p><p>On Atkins Phase 1 (20 g a day) that bar uses 15% or 30% of the daily budget, depending on the method. If you eat the whole package and it is 2 servings, double it: 6 g or 12 g.</p>`,
  table: {
    title: 'How many net carbs are in common foods?',
    intro: 'Net carbs per 100 g (about 3.5 oz), computed from USDA FoodData Central values for total carbohydrate and fiber, with the share of a 20 g Atkins Phase 1 day.',
    head: ['Food (100 g)', 'Total carbs', 'Fiber', 'Net carbs', 'Share of 20 g'],
    rows: ({ run, D, H }) => D.foods.map(f => {
      const r = run({ total: f[1], fiber: f[2], ery: 0, other: 0, servings: 1, method: 'half', limit: 20 });
      return [f[0], H.num(f[1], 1) + ' g', H.num(f[2], 1) + ' g', r.value, H.pct(r.net / 20 * 100, 0)];
    }),
    note: 'Values are USDA SR Legacy entries for raw produce, unsalted almonds, and boiled or cooked lentils and rice. Brands and varieties vary, so use the label when there is one.'
  },
  sections: [
    {
      h2: 'How do you calculate net carbs on the Atkins diet?',
      html: `<p>Atkins counts net carbs, not total carbs. Its own formula is <strong>total carbohydrates minus fiber minus sugar alcohols</strong>, and it lists allulose alongside sugar alcohols as something you can subtract. For foods without a label, such as vegetables, fruit and nuts, look up total carbohydrate and fiber in a carb counter or in USDA FoodData Central and subtract the fiber.</p><p>Atkins-branded bars and shakes print a net carb number on the front of the pack. Atkins says those figures reflect glycemic testing on volunteers rather than simple subtraction, so for its own products you can use the printed number. For any other "keto" or "low net carb" product, do the math yourself from the Nutrition Facts panel, because there is no regulated definition behind the front-of-pack claim.</p><p>In practice:</p><ul><li><strong>Vegetables and berries:</strong> total − fiber is accurate and easy.</li><li><strong>Packaged low-carb foods:</strong> check which sugar alcohol is used; the calculator above handles both counting methods.</li><li><strong>Restaurant food:</strong> chains publish total carbs and fiber in their nutrition guides; sauces, breading and sweet glazes are where hidden grams live.</li></ul>`
    },
    {
      h2: 'Do you subtract sugar alcohols from net carbs?',
      html: `<p>Some of them, fully; others, only partly. Sugar alcohols (polyols) are absorbed to different degrees:</p><ul><li><strong>Erythritol</strong> is absorbed and then passed out in urine largely unchanged, so it has very little effect on blood sugar and almost no calories. Subtracting it fully is reasonable.</li><li><strong>Allulose</strong> is a rare sugar rather than a sugar alcohol, but behaves similarly. The FDA lets manufacturers leave it out of "Total Sugars" and "Added Sugars" and count it at 0.4 kcal per gram, though it still appears in Total Carbohydrate.</li><li><strong>Maltitol, sorbitol, xylitol, isomalt and lactitol</strong> are partly digested and can raise blood glucose. Counting half of them is a common middle ground; Atkins' own formula subtracts them all.</li></ul><p>Two cautions. Large amounts of sugar alcohols, especially maltitol and sorbitol, cause gas, bloating or diarrhea in many people. And a 2023 study in <em>Nature Medicine</em> (Witkowski et al.) linked higher blood erythritol levels with cardiovascular events; it showed an association, not proof of harm, but it is a reason not to build a diet around sweetened products.</p>`
    },
    {
      h2: 'How many net carbs per day can you have on Atkins?',
      html: `<div class="twrap"><table><thead><tr><th>Plan or phase</th><th>Net carbs a day</th><th>Notes</th></tr></thead><tbody>
<tr><td>Atkins 20 (now KickStart), Phase 1: Induction</td><td>20 g</td><td>12–15 g of it from foundation vegetables; at least 2 weeks, or until about 15 lb from goal</td></tr>
<tr><td>Atkins 20, Phase 2: Balancing</td><td>25 g, rising in steps (30 g and up)</td><td>Nuts and seeds come back first, then dairy, legumes and juice</td></tr>
<tr><td>Atkins 20, Phases 3–4: Pre-Maintenance and Lifetime Maintenance</td><td>Your personal carb balance</td><td>Carbs keep rising as long as weight stays stable</td></tr>
<tr><td>Atkins 40 (now Atkins Flex)</td><td>About 40 g</td><td>For a smaller weight-loss goal, or people who want more food variety from day one</td></tr>
<tr><td>Atkins 100</td><td>About 100 g</td><td>A maintenance-style lifestyle plan</td></tr>
<tr><td>Very low-carbohydrate / ketogenic diets (general)</td><td>About 20–50 g</td><td>StatPearls: usually enough to induce nutritional ketosis</td></tr>
</tbody></table></div><p>Atkins says you can stay on Phase 1 longer than two weeks if you have a lot of weight to lose and your blood work, blood pressure and energy levels stay good, which requires checking in with your doctor. The calculator's daily limit box lets you set any of these budgets and see how much of it a food uses.</p>`
    },
    {
      h2: 'Net carbs vs. total carbs: which should you count?',
      html: `<p>For low-carb weight loss, net carbs are the usual measure; fiber-rich vegetables, nuts and berries would otherwise eat up a 20 g budget fast. A cup of raw broccoli and 1 oz of almonds together have about 12 g total carbohydrate but only about 6 g net.</p><p>For diabetes, follow your care team. The CDC explains that sugars and starches raise blood sugar but fiber does not, and the American Diabetes Association teaches carb counting from Total Carbohydrate on the label. People who dose insulin by carbohydrate grams should not start subtracting fiber or sugar alcohols without guidance, because partly absorbed sweeteners like maltitol still raise glucose for many people.</p><p>Total carbs also matter for calories. Net-carb counting can hide a lot of energy in fat-heavy "keto" products, so if weight loss stalls, check the <a href="/calorie-calculator">calorie calculator</a> as well.</p>`
    },
    {
      h2: 'How do you count net carbs on UK, EU, Canadian or Australian labels?',
      html: `<p>This trips up a lot of people. In the US and Canada, "Carbohydrate" on the label <strong>includes</strong> fiber, so you subtract it. In the UK and the European Union, the "Carbohydrate" line already <strong>excludes</strong> fiber, which is listed separately, so the carbohydrate figure is close to net carbs already; subtracting fiber again undercounts. Australian and New Zealand panels also list carbohydrate and dietary fibre as separate lines.</p><p>EU and UK labels do include polyols (sugar alcohols) within carbohydrate and may show them on an "of which polyols" line. If they do, you can subtract that line using the same rules as above. The calculator's error message warns you if fiber and sugar alcohols add up to more than the carbohydrate figure, which is a typical sign of a label that already excludes fiber.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for net carbs?', a: 'Net carbs = total carbohydrate − fiber − sugar alcohols. A food with 15 g carbs and 6 g fiber has 9 g net carbs. If it contains maltitol or sorbitol, many people subtract only half of those grams.' },
    { q: 'How many net carbs should I eat a day on Atkins?', a: 'Atkins Phase 1 (Atkins 20, now called KickStart) allows 20 g of net carbs a day, with 12–15 g from vegetables. Phase 2 starts at 25 g and rises. Atkins Flex is about 40 g and Atkins 100 about 100 g.' },
    { q: 'Do you subtract erythritol from net carbs?', a: 'Yes. Erythritol has very little effect on blood sugar and is subtracted in full by both Atkins and the more cautious counting method.' },
    { q: 'Is net carbs or total carbs better for keto?', a: 'Most keto plans count net carbs, typically 20–50 g a day. Some stricter plans count total carbs to keep it simple. Either way, people with diabetes should follow their care team\'s method.' },
    { q: 'Why does the FDA not use net carbs?', a: 'The FDA has no definition of net carbs. US labels show Total Carbohydrate, Dietary Fiber, Total Sugars and Added Sugars, and may list sugar alcohols; "net carb" claims on the front of a package are calculated by the manufacturer.' },
    { q: 'How many net carbs are in an avocado?', a: 'Very few, because most of its carbohydrate is fiber. Look up the size you are eating in USDA FoodData Central, then subtract the fiber from the total carbs; the calculator above does the subtraction.' },
    { q: 'Do net carbs count on a 2-serving package?', a: 'Yes, per serving. If the label says 2 servings and you eat the whole thing, multiply the net carbs by 2. Set "Servings eaten" in the calculator to do it automatically.' },
    { q: 'Can I eat unlimited net-zero foods?', a: 'No. Foods with zero net carbs can still have plenty of calories, and large amounts of sugar alcohols cause digestive upset in many people.' }
  ],
  related: ['macro-calculator', 'calorie-calculator', 'calorie-deficit-calculator', 'protein-calculator'],
  sources: [
    { name: 'Atkins: What Are Net Carbs?', url: 'https://www.atkins.com/expertise/what-are-net-carbs-1' },
    { name: 'FDA: Guidance for Industry on the Declaration of Allulose and Calories from Allulose', url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-declaration-allulose-and-calories-allulose-nutrition-and-supplement-facts-labels' },
    { name: 'FDA: How to Understand and Use the Nutrition Facts Label', url: 'https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label' },
    { name: 'CDC: Carb Counting to Manage Blood Sugar', url: 'https://www.cdc.gov/diabetes/healthy-eating/carb-counting-manage-blood-sugar.html' },
    { name: 'StatPearls: Low-Carbohydrate Diet (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK537084/' },
    { name: 'USDA FoodData Central', url: 'https://fdc.nal.usda.gov/' },
    { name: 'Witkowski M et al. The artificial sweetener erythritol and cardiovascular event risk. Nat Med 2023', url: 'https://pubmed.ncbi.nlm.nih.gov/36849732/' }
  ],
  disclaimer: 'Net carb counts are estimates for meal planning, not medical advice. If you have diabetes or take glucose-lowering medication, ask your care team before changing how you count carbohydrates.'
};
