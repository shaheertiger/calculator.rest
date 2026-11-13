export default {
  slug: 'theoretical-yield-calculator',
  hub: 'science',
  name: 'Theoretical Yield Calculator',
  title: 'Theoretical Yield Calculator: 2.00 g Salicylic Acid → 2.61 g',
  h1: 'Theoretical and Percent Yield Calculator with Limiting Reagent',
  meta: '2.00 g of salicylic acid gives a theoretical yield of 2.61 g of aspirin, so 2.10 g recovered is an 80.5% yield. Finds the limiting reagent and excess left.',
  keyword: 'how to calculate theoretical yield',
  also: ['theoretical yield calculator', 'how to calculate theoretical yeild', 'how to calculate percent yield', 'percent yield calculator', 'limiting reagent calculator', 'how to calculate the mole ratio'],
  updated: '2026-11-13',
  inputs: [
    { id: 'aName', label: 'Reactant A name', type: 'text', value: 'salicylic acid' },
    { id: 'aMass', label: 'Mass of A', type: 'number', value: 2, suffix: 'g' },
    { id: 'aMW', label: 'Molar mass of A', type: 'number', value: 138.12, suffix: 'g/mol' },
    { id: 'aCoef', label: 'Coefficient of A', type: 'number', value: 1, help: 'From the balanced equation.' },
    { id: 'bName', label: 'Reactant B name (optional)', type: 'text', value: 'acetic anhydride' },
    { id: 'bMass', label: 'Mass of B', type: 'number', value: 5.4, suffix: 'g', help: 'Leave blank if B is in excess or there is only one reactant.' },
    { id: 'bMW', label: 'Molar mass of B', type: 'number', value: 102.09, suffix: 'g/mol' },
    { id: 'bCoef', label: 'Coefficient of B', type: 'number', value: 1 },
    { id: 'pName', label: 'Product name', type: 'text', value: 'aspirin' },
    { id: 'pMW', label: 'Molar mass of product', type: 'number', value: 180.16, suffix: 'g/mol' },
    { id: 'pCoef', label: 'Coefficient of product', type: 'number', value: 1 },
    { id: 'actual', label: 'Actual yield (optional)', type: 'number', value: 2.1, suffix: 'g', help: 'Mass of dry product you recovered, for percent yield.' },
    { id: 'sf', label: 'Significant figures', type: 'select', value: '3', options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5']] }
  ],
  compute(v, H) {
    var n = Number(v.sf) || 3;
    function sf(x, k) {
      if (!isFinite(x)) return '—';
      if (x === 0) return '0';
      var r = Number(x.toPrecision(k));
      var e = Math.floor(Math.log10(Math.abs(r)));
      if (e < -3 || e >= 6) return (r / Math.pow(10, e)).toFixed(k - 1) + ' × 10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>';
      return H.fix(r, Math.max(0, k - 1 - e));
    }
    var an = H.esc(v.aName || 'A'), bn = H.esc(v.bName || 'B'), pn = H.esc(v.pName || 'product');
    if (!(v.aMass > 0) || !(v.aMW > 0)) return { error: 'Enter the mass and molar mass of reactant A.' };
    if (!(v.aCoef > 0) || !(v.pCoef > 0)) return { error: 'Coefficients must be positive numbers from the balanced equation.' };
    if (!(v.pMW > 0)) return { error: 'Enter the molar mass of the product.' };
    var molA = v.aMass / v.aMW, exA = molA / v.aCoef;
    var hasB = v.bMass > 0 && v.bMW > 0 && v.bCoef > 0;
    var molB = hasB ? v.bMass / v.bMW : NaN, exB = hasB ? molB / v.bCoef : Infinity;
    var limB = exB < exA, ext = limB ? exB : exA;
    var pMol = ext * v.pCoef, theo = pMol * v.pMW;
    var rows = [];
    if (hasB) rows.push(['Limiting reagent', limB ? bn : an, true]);
    rows.push(['Moles of ' + an, sf(molA, n) + ' mol']);
    if (hasB) rows.push(['Moles of ' + bn, sf(molB, n) + ' mol']);
    rows.push(['Moles of ' + pn + ' possible', sf(pMol, n) + ' mol']);
    if (hasB) {
      var left = limB ? (molA - ext * v.aCoef) * v.aMW : (molB - ext * v.bCoef) * v.bMW;
      rows.push(['Excess ' + (limB ? an : bn) + ' left over', sf(Math.max(0, left), n) + ' g']);
    }
    var sub = 'Theoretical yield assumes every molecule of the limiting reagent turns into product.';
    if (v.actual > 0) {
      var pct = v.actual / theo * 100;
      rows.push(['Percent yield', sf(pct, n) + '%', true]);
      sub = pct > 100 ? 'Above 100% usually means the product is still wet or contains impurities. Dry it to constant mass and reweigh.' : 'Percent yield = actual ÷ theoretical × 100.';
    }
    return {
      value: sf(theo, n) + ' g',
      label: 'Theoretical yield of ' + pn,
      expr: sf(limB ? molB : molA, n) + ' mol × ' + H.num(v.pCoef, 3) + '/' + H.num(limB ? v.bCoef : v.aCoef, 3) + ' × ' + H.num(v.pMW, 3) + ' g/mol',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate theoretical yield, convert the limiting reagent to moles, multiply by the mole ratio from the balanced equation, then by the product's molar mass. 2.00 g of salicylic acid is 0.01448 mol; at 1:1 that makes 0.01448 mol of aspirin × 180.16 g/mol = <strong>${r.value}</strong>. Recovering 2.10 g is an 80.5% yield.`,
  stepsTitle: 'How to calculate theoretical yield in 5 steps',
  steps: [
    'Balance the equation. The coefficients give the mole ratio, and an unbalanced equation is the most common reason for a wrong answer.',
    'Convert the mass of each reactant to moles: moles = grams ÷ molar mass. For a liquid measured in mL, multiply by its density first.',
    'Find the limiting reagent: divide each reactant\'s moles by its coefficient. The smallest result runs out first. Don\'t just pick the smaller mass.',
    'Multiply the limiting reagent\'s moles by (product coefficient ÷ its coefficient) to get moles of product, then by the product\'s molar mass to get grams.',
    'For percent yield, divide the mass of dry product you actually recovered by the theoretical yield and multiply by 100.'
  ],
  formulaTitle: 'What is the theoretical yield formula?',
  formula: {
    expr: 'Theoretical yield (g) = (m<sub>lim</sub> ÷ M<sub>lim</sub>) × (c<sub>prod</sub> ÷ c<sub>lim</sub>) × M<sub>prod</sub><br>Percent yield = actual ÷ theoretical × 100',
    vars: [['m<sub>lim</sub>', 'mass of the limiting reagent (g)'], ['M', 'molar mass (g/mol)'], ['c', 'coefficient in the balanced equation'], ['actual', 'mass of product you isolated (g)']],
    note: 'The limiting reagent is the reactant with the smallest value of moles ÷ coefficient.'
  },
  example: `<p>Water synthesis: 2H₂ + O₂ → 2H₂O, starting with 4.00 g of H₂ and 16.0 g of O₂.</p>
<p>Moles: H₂ = 4.00 ÷ 2.016 = 1.984 mol; O₂ = 16.0 ÷ 31.998 = 0.500 mol.</p>
<p>Divide by coefficients: H₂ 1.984 ÷ 2 = 0.992; O₂ 0.500 ÷ 1 = 0.500. Oxygen is <strong>limiting</strong>, even though there are four times as many grams of it.</p>
<p>Water = 0.500 mol O₂ × (2 ÷ 1) = 1.000 mol × 18.015 g/mol = <strong>18.0 g</strong>. Hydrogen left over: 1.984 − 1.000 = 0.984 mol, or 1.98 g.</p>`,
  table: {
    title: 'What is the theoretical yield of common textbook reactions?',
    intro: 'Each row was run through the calculator with IUPAC molar masses. The limiting reagent is not always the reactant with the smaller mass.',
    head: ['Reaction', 'Starting amounts', 'Limiting reagent', 'Theoretical yield'],
    rows: ({ run }) => [
      ['C₇H₆O₃ + C₄H₆O₃ → aspirin', '2.00 g + 5.40 g', { aName: 'salicylic acid', aMass: 2, aMW: 138.12, aCoef: 1, bName: 'acetic anhydride', bMass: 5.4, bMW: 102.09, bCoef: 1, pName: 'aspirin', pMW: 180.16, pCoef: 1 }],
      ['2H₂ + O₂ → 2H₂O', '4.00 g H₂ + 16.0 g O₂', { aName: 'H₂', aMass: 4, aMW: 2.016, aCoef: 2, bName: 'O₂', bMass: 16, bMW: 31.998, bCoef: 1, pName: 'H₂O', pMW: 18.015, pCoef: 2 }],
      ['N₂ + 3H₂ → 2NH₃', '28.0 g N₂ + 10.0 g H₂', { aName: 'N₂', aMass: 28, aMW: 28.014, aCoef: 1, bName: 'H₂', bMass: 10, bMW: 2.016, bCoef: 3, pName: 'NH₃', pMW: 17.031, pCoef: 2 }],
      ['Fe₂O₃ + 3CO → 2Fe + 3CO₂', '100 g Fe₂O₃ + 50.0 g CO', { aName: 'Fe₂O₃', aMass: 100, aMW: 159.69, aCoef: 1, bName: 'CO', bMass: 50, bMW: 28.01, bCoef: 3, pName: 'Fe', pMW: 55.845, pCoef: 2 }],
      ['AgNO₃ + NaCl → AgCl + NaNO₃', '1.70 g AgNO₃ + 1.00 g NaCl', { aName: 'AgNO₃', aMass: 1.7, aMW: 169.87, aCoef: 1, bName: 'NaCl', bMass: 1, bMW: 58.44, bCoef: 1, pName: 'AgCl', pMW: 143.32, pCoef: 1 }],
      ['CH₄ + 2O₂ → CO₂ + 2H₂O', '8.00 g CH₄ + 40.0 g O₂', { aName: 'CH₄', aMass: 8, aMW: 16.043, aCoef: 1, bName: 'O₂', bMass: 40, bMW: 31.998, bCoef: 2, pName: 'CO₂', pMW: 44.009, pCoef: 1 }],
      ['CaCO₃ → CaO + CO₂ (heating)', '10.0 g CaCO₃', { aName: 'CaCO₃', aMass: 10, aMW: 100.09, aCoef: 1, bName: '', bMass: NaN, bMW: NaN, bCoef: 1, pName: 'CaO', pMW: 56.077, pCoef: 1 }]
    ].map(([rx, amt, o]) => {
      const r = run({ ...o, actual: NaN, sf: '3' });
      const lim = r.rows[0][0] === 'Limiting reagent' ? r.rows[0][1] : o.aName + ' (only reactant)';
      return [rx, amt, lim, r.value + ' ' + o.pName];
    }),
    note: 'Molar masses (g/mol): salicylic acid 138.12, acetic anhydride 102.09, aspirin 180.16, Fe₂O₃ 159.69, AgNO₃ 169.87, AgCl 143.32, CaCO₃ 100.09, CaO 56.077.'
  },
  sections: [
    {
      h2: 'How do you find the limiting reagent?',
      html: `<p>Convert every reactant to moles, then divide each by its coefficient in the balanced equation. The reactant with the smallest quotient is limiting; it decides how much product can form, and the others are in excess.</p>
<p>In the ammonia row of the table, 28.0 g of N₂ is 0.9995 mol and 10.0 g of H₂ is 4.960 mol. Dividing by the coefficients (1 and 3) gives 0.9995 and 1.653, so nitrogen limits the reaction and 2 × 0.9995 = 1.999 mol of NH₃ (34.0 g) can form. A common shortcut error is to compare grams directly, which would wrongly pick hydrogen.</p>`
    },
    {
      h2: 'How do you calculate percent yield?',
      html: `<p>Percent yield = actual yield ÷ theoretical yield × 100. Both must be in the same unit, usually grams. In the aspirin synthesis above, 2.10 g recovered from a 2.61 g maximum is 2.10 ÷ 2.609 × 100 = <strong>80.5%</strong>.</p>
<p>Undergraduate organic labs often report 50–90% for a recrystallized product, because some product stays dissolved in the filtrate and some is lost on glassware and filter paper. Percent yield is a measure of technique as well as chemistry.</p>`
    },
    {
      h2: 'Why is my percent yield over 100%?',
      html: `<p>A yield above 100% doesn't mean you made matter; it means the mass you weighed isn't all pure product. The usual causes are:</p>
<ul><li><strong>Residual solvent or water.</strong> Dry the solid to constant mass (two weighings that agree) before recording it.</li>
<li><strong>Impurities</strong> such as unreacted starting material or a side product. A melting point below the literature value is the giveaway.</li>
<li><strong>Using the wrong limiting reagent</strong> or an unbalanced equation, which makes the theoretical yield too small.</li></ul>`
    },
    {
      h2: 'How do you calculate the mole ratio?',
      html: `<p>The mole ratio comes straight from the coefficients of the balanced equation. In Fe₂O₃ + 3CO → 2Fe + 3CO₂, the ratio of Fe to Fe₂O₃ is 2:1 and Fe to CO is 2:3. To convert moles of a reactant into moles of product, multiply by (product coefficient ÷ reactant coefficient).</p>
<p>Starting from 50.0 g of CO (1.785 mol) with excess Fe₂O₃, iron formed = 1.785 × 2/3 = 1.190 mol, or 66.5 g. Getting moles first is essential; the ratio applies to moles, never to grams. For gram–mole conversions on their own, use the <a href="/moles-calculator">moles calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the difference between theoretical yield and actual yield?', a: 'Theoretical yield is the maximum product the limiting reagent can make if the reaction is perfect. Actual yield is the mass you really collect, which is almost always lower.' },
    { q: 'Can theoretical yield be in moles?', a: 'Yes. Stop before multiplying by the product\'s molar mass and you have the theoretical yield in moles. Labs usually report grams because that is what the balance measures.' },
    { q: 'Do I use the limiting reagent or the excess reagent?', a: 'Always the limiting reagent. The excess reagent has some left over, so it cannot set the maximum amount of product.' },
    { q: 'How do I calculate theoretical yield from a liquid volume?', a: 'Multiply the volume in mL by the liquid\'s density to get grams, then continue as usual. 5.0 mL of acetic anhydride (1.08 g/mL) is 5.40 g, or 0.0529 mol.' },
    { q: 'What is a good percent yield?', a: 'It depends on the reaction. Simple precipitations can exceed 95%, a typical student aspirin or recrystallization lab lands around 50–90%, and multistep syntheses multiply the losses of each step.' },
    { q: 'How many significant figures should the theoretical yield have?', a: 'Match the least precise measured mass. If you weighed 2.00 g of starting material, report 2.61 g, not 2.6087 g. Molar masses usually carry more digits and don\'t limit the answer.' },
    { q: 'Does a catalyst change theoretical yield?', a: 'No. A catalyst speeds the reaction up but doesn\'t change the stoichiometry, so the theoretical yield stays the same. It can raise the actual yield by reducing side reactions or incomplete conversion.' }
  ],
  related: ['moles-calculator', 'density-calculator', 'dilution-calculator', 'percentage-calculator'],
  sources: [
    { name: 'OpenStax Chemistry 2e: 4.4 Reaction Yields', url: 'https://openstax.org/books/chemistry-2e/pages/4-4-reaction-yields' },
    { name: 'OpenStax Chemistry 2e: 4.3 Reaction Stoichiometry', url: 'https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry' },
    { name: 'IUPAC CIAAW: Standard atomic weights', url: 'https://www.ciaaw.org/atomic-weights.htm' }
  ]
};
