export default {
  slug: 'sourdough-hydration-calculator',
  hub: 'everyday',
  name: 'Sourdough Hydration Calculator',
  title: 'Sourdough Hydration Calculator: 350 g Water + Starter = 72.7%',
  h1: 'Sourdough Hydration and Baker\'s Percentages, Starter Included',
  meta: '500 g flour, 350 g water and 100 g of 100% starter is 72.7% true hydration, not 70%. Count the starter, get baker\'s percentages and hit a target hydration.',
  keyword: 'how to calculate sourdough hydration',
  also: ['sourdough hydration calculator', 'bakers percentage calculator', 'dough hydration calculator', 'sourdough starter hydration', 'how to calculate hydration in bread'],
  updated: '2026-11-13',
  inputs: [
    { id: 'flour', label: 'Flour', type: 'number', value: 500, suffix: 'g' },
    { id: 'water', label: 'Water', type: 'number', value: 350, suffix: 'g' },
    { id: 'starter', label: 'Starter (levain)', type: 'number', value: 100, suffix: 'g' },
    { id: 'sh', label: 'Starter hydration', type: 'number', value: 100, suffix: '%', help: '100% = equal weights of flour and water when you feed it.' },
    { id: 'salt', label: 'Salt', type: 'number', value: 10, suffix: 'g' },
    { id: 'target', label: 'Target hydration (optional)', type: 'number', value: 75, suffix: '%', help: 'Shows how much water to use instead.' }
  ],
  compute(v, H) {
    if (!(v.flour > 0)) return { error: 'Enter the flour weight in grams.' };
    if (!(v.water >= 0)) return { error: 'Enter the water weight in grams.' };
    var st = v.starter > 0 ? v.starter : 0;
    var sh = v.sh >= 0 ? v.sh : 100;
    var sf = st / (1 + sh / 100), sw = st - sf;
    var tf = v.flour + sf, tw = v.water + sw;
    var hyd = tw / tf * 100;
    var g = function (x) { return H.num(x, 1) + ' g'; };
    var rows = [
      ['Ignoring the starter', H.pct(v.water / v.flour * 100, 1)],
      ['Total flour (incl. starter)', g(tf)],
      ['Total water (incl. starter)', g(tw)],
      ['Starter as % of flour', H.pct(st / v.flour * 100, 1)]
    ];
    if (v.salt > 0) rows.push(['Salt', H.pct(v.salt / tf * 100, 2) + ' of total flour']);
    rows.push(['Dough weight', g(v.flour + v.water + st + (v.salt > 0 ? v.salt : 0))]);
    if (v.target > 0 && v.target < 200) {
      var need = v.target / 100 * tf - sw;
      var diff = need - v.water;
      rows.push(['For ' + H.num(v.target, 1) + '% hydration', need >= 0 ? 'use ' + g(need) + ' water (' + (diff >= 0 ? '+' : '−') + g(Math.abs(diff)) + ')' : 'starter alone is too wet; add flour', true]);
    }
    return {
      value: H.pct(hyd, 1),
      label: 'True dough hydration (starter included)',
      expr: g(tw) + ' water ÷ ' + g(tf) + ' flour',
      rows: rows,
      sub: hyd < 63 ? 'Stiff dough: bagels, pretzels and some sandwich loaves live here.' : hyd < 70 ? 'Moderate hydration: easy to shape, a good first sourdough.' : hyd < 78 ? 'Typical artisan sourdough: open crumb, sticky but manageable with wet hands.' : 'High hydration: slack, very open crumb; needs strong flour and practice.'
    };
  },
  quick: ({ r }) => `Sourdough hydration is total water divided by total flour, counting the flour and water inside the starter. 500 g flour, 350 g water and 100 g of 100% starter (50 g flour + 50 g water) is 400 ÷ 550 = <strong>${r.value}</strong>, not the 70% you get from 350 ÷ 500. For 75%, use 362.5 g of water.`,
  stepsTitle: 'How to calculate sourdough hydration',
  steps: [
    'Weigh everything in grams. Cups are too inconsistent for flour; a cup can weigh anywhere from about 120 to 150 g depending on how it\'s scooped.',
    'Split the starter into flour and water using its hydration. A 100% starter is half flour, half water, so 100 g holds 50 g of each. For other starters: starter flour = starter ÷ (1 + hydration).',
    'Add the starter\'s flour to your flour and its water to your water.',
    'Divide total water by total flour and multiply by 100. <strong>The usual mistake</strong> is leaving the starter out, which understates hydration by 2–4 points in a typical recipe.',
    'Count other liquids too: milk is about 87% water, and eggs about 75%, if a recipe includes them.'
  ],
  formulaTitle: 'What is the formula for dough hydration?',
  formula: {
    expr: 'Hydration % = (Water + Starter water) ÷ (Flour + Starter flour) × 100<br>Starter flour = Starter ÷ (1 + Starter hydration)<br>Water for a target = Target × Total flour − Starter water',
    vars: [['Starter hydration', 'as a decimal: 100% = 1.0, a stiff 50% starter = 0.5'], ['Total flour', 'flour you add plus the flour in the starter']],
    note: 'In baker\'s percentages, every ingredient is a percentage of flour weight, with flour fixed at 100% (King Arthur Baking\'s definition). Hydration is simply the water\'s baker\'s percentage.'
  },
  example: `<p>A loaf with 500 g bread flour, 350 g water, 100 g active 100% starter and 10 g salt.</p>
<p>Starter flour = 100 ÷ 2 = 50 g; starter water = 50 g. Total flour = <strong>550 g</strong>; total water = <strong>400 g</strong>.</p>
<p>Hydration = 400 ÷ 550 = <strong>72.7%</strong>. Salt = 10 ÷ 550 = 1.8%. Starter = 20% of the added flour. Dough weight = 960 g.</p>
<p>To hit 75%: 0.75 × 550 = 412.5 g total water; minus 50 g from the starter = <strong>362.5 g</strong> of water to add, 12.5 g more than the recipe.</p>`,
  table: {
    title: 'What hydration do different water amounts give?',
    intro: 'True hydration for 500 g flour plus 100 g of 100% starter, computed by the calculator above.',
    head: ['Water added', 'Ignoring starter', 'True hydration', 'What the dough is like'],
    rows: ({ run }) => [275, 300, 325, 350, 375, 400, 425, 450].map(w => {
      const r = run({ flour: 500, water: w, starter: 100, sh: 100, salt: 10, target: NaN });
      return [w + ' g', r.rows[0][1], r.value, r.sub.split(':')[0]];
    }),
    note: 'Whole wheat and high-protein flours absorb more water, so the same percentage feels stiffer than with all-purpose flour.'
  },
  sections: [
    {
      h2: 'Should you count the starter in sourdough hydration?',
      html: `<p>For an accurate number, yes. The starter is flour and water, and it ends up in the dough like everything else. Leaving it out makes a 72.7% dough look like 70%, and the gap grows as the starter share grows: with 200 g of starter in the same recipe, true hydration is 75% while the "flour and water only" figure still says 70%.</p>
<p>Recipe writers aren't consistent. Some quote hydration from the main flour and water only, so if your dough comes out wetter than expected, recalculate it with the starter included before blaming your flour.</p>`
    },
    {
      h2: 'What hydration should a beginner use for sourdough?',
      html: `<p>Start around <strong>65–70%</strong> with bread flour. The dough is soft but holds its shape, so you can learn shaping and judge fermentation without fighting a sticky mess. Move up in 2–3 point steps as you get comfortable.</p>
<ul><li><strong>55–62%:</strong> bagels, pretzels, stiff sandwich doughs.</li><li><strong>63–70%:</strong> sandwich loaves and a forgiving first sourdough. King Arthur's example white bread formula is 66%.</li><li><strong>70–78%:</strong> classic artisan boules with an open crumb. King Arthur's ciabatta example is 73%.</li><li><strong>78%+:</strong> very open, glossy crumb; needs strong flour and confident handling.</li></ul>
<p>Whole wheat flour soaks up more water, so a 30% whole wheat dough at 75% can feel like a white dough at 70%.</p>`
    },
    {
      h2: 'How do you calculate baker\'s percentages?',
      html: `<p>Divide each ingredient's weight by the total flour weight and multiply by 100. Flour is always 100%. For the example loaf counting the starter's flour: water 400 ÷ 550 = 72.7%, salt 10 ÷ 550 = 1.8%. Many bakers instead quote the starter as a percentage of the added flour (100 ÷ 500 = 20%), and salt at about 2% of flour is the usual target.</p>
<p>Baker's percentages make scaling easy. To make 1,500 g of dough at 72.7% hydration, 2% salt and 20% starter, add up the percentages and divide the dough weight by the total, which gives the flour weight. Everything else follows from it.</p>`
    },
    {
      h2: 'How do you fix a dough that is too wet or too dry?',
      html: `<p>To raise hydration, add water: water needed = target × total flour − water already in. Going from 72.7% to 75% on 550 g of total flour takes 12.5 g more. Add it gradually during mixing (bakers call this bassinage) so the dough can absorb it.</p>
<p>To lower hydration, add flour: total flour needed = total water ÷ target. Getting 400 g of water down to 70% needs 400 ÷ 0.70 = 571 g of flour, so 21 g more. Remember that adding flour also lowers the starter and salt percentages slightly.</p>`
    }
  ],
  faq: [
    { q: 'What does 75% hydration mean?', a: 'There are 75 grams of water for every 100 grams of flour. With 500 g of total flour, that is 375 g of total water, including any water in the starter.' },
    { q: 'How much water do I need for 500 g of flour at 70% hydration?', a: '350 g if there is no starter. With 100 g of 100% starter added, use 0.70 × 550 − 50 = 335 g of water to keep true hydration at 70%.' },
    { q: 'What is a 100% hydration starter?', a: 'A starter fed with equal weights of flour and water, such as 50 g flour and 50 g water. It is half flour and half water by weight.' },
    { q: 'How do I account for a stiff 50% starter?', a: 'A 50% starter has half as much water as flour, so 100 g contains 66.7 g flour and 33.3 g water. Enter 50% as the starter hydration and the calculator splits it for you.' },
    { q: 'Does salt count in hydration?', a: 'No. Hydration counts only water (and the water in other liquids) against flour. Salt is listed separately, usually around 2% of flour.' },
    { q: 'Why does my high-hydration dough feel so sticky?', a: 'Weaker flour, whole grain flour or under-developed gluten all make wet doughs harder to handle. Try lowering hydration by 3–5 points or using a higher-protein bread flour.' },
    { q: 'Do milk and eggs count toward hydration?', a: 'Their water does. Milk is roughly 87% water and eggs about 75%, so 100 g of milk adds about 87 g of water to the calculation.' }
  ],
  related: ['ratio-calculator', 'percentage-calculator', 'party-food-calculator', 'temperature-converter'],
  sources: [
    { name: 'King Arthur Baking: Baker\'s Percentage', url: 'https://www.kingarthurbaking.com/pro/reference/bakers-percentage' },
    { name: 'King Arthur Baking: Sourdough Starter recipe', url: 'https://www.kingarthurbaking.com/recipes/sourdough-starter-recipe' }
  ]
};
