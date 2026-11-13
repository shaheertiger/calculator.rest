export default {
  slug: 'dilution-calculator',
  hub: 'science',
  name: 'Dilution Calculator',
  title: 'Dilution Calculator (C1V1 = C2V2): 12.5 mL of 2 M Makes 250 mL',
  h1: 'Dilution Calculator: Stock Volume, Final Concentration and Serial Dilutions',
  meta: 'Use C1V1 = C2V2: 250 mL of 0.100 M from a 2.00 M stock takes 12.5 mL of stock plus 237.5 mL of water. Also final concentration and serial dilutions.',
  keyword: 'how to calculate dilution',
  also: ['dilution calculator', 'how to calculate concentration of dilution', 'how to calculate the final concentration', 'c1v1 c2v2 calculator', 'serial dilution calculator', 'how to calculate dilution factor'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you need?', type: 'select', value: 'v1', options: [['v1', 'Volume of stock to use (V1)'], ['c2', 'Final concentration after diluting (C2)'], ['serial', 'Serial dilution series']] },
    { id: 'c1', label: 'Stock concentration (C1)', type: 'number', value: 2 },
    { id: 'c2', label: 'Target concentration (C2)', type: 'number', value: 0.1, showIf: { mode: ['v1'] } },
    { id: 'v1', label: 'Volume of stock used (V1)', type: 'number', value: 5, showIf: { mode: ['c2'] } },
    { id: 'v2', label: 'Final total volume (V2)', type: 'number', value: 250, showIf: { mode: ['v1', 'c2'] } },
    { id: 'df', label: 'Dilution factor per step', type: 'number', value: 10, showIf: { mode: ['serial'] }, help: '10 = each tube is 1/10 of the one before.' },
    { id: 'steps', label: 'Number of tubes', type: 'number', value: 6, showIf: { mode: ['serial'] } },
    { id: 'tv', label: 'Volume transferred each step', type: 'number', value: 1, showIf: { mode: ['serial'] } },
    { id: 'cUnit', label: 'Concentration unit', type: 'select', value: 'M', options: [['M', 'M (mol/L)'], ['mM', 'mM'], ['µM', 'µM'], ['nM', 'nM'], ['mg/mL', 'mg/mL'], ['µg/mL', 'µg/mL'], ['%', '% (w/v or v/v)'], ['ppm', 'ppm'], ['cells/mL', 'cells or CFU per mL']] },
    { id: 'vUnit', label: 'Volume unit', type: 'select', value: 'mL', options: [['mL', 'mL'], ['L', 'L'], ['µL', 'µL']] },
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
    var cu = ' ' + (v.cUnit || 'M'), vu = ' ' + (v.vUnit || 'mL');
    if (!(v.c1 > 0)) return { error: 'Enter the stock concentration.' };
    if (v.mode === 'serial') {
      var df = v.df, k = Math.floor(v.steps), tv = v.tv;
      if (!(df > 1)) return { error: 'The dilution factor per step must be greater than 1.' };
      if (!(k >= 1 && k <= 15)) return { error: 'Enter 1 to 15 tubes.' };
      if (!(tv > 0)) return { error: 'Enter the volume transferred each step.' };
      var dil = tv * (df - 1), rows = [], trows = [];
      for (var i = 1; i <= k; i++) {
        var tot = Math.pow(df, i);
        trows.push(['Tube ' + i, '1:' + (tot < 1e9 ? H.num(tot, 4) : sf(tot, 3)), sf(v.c1 / tot, n) + cu]);
      }
      rows.push(['Diluent in each tube', H.num(dil, 4) + vu, true]);
      rows.push(['Transfer each step', H.num(tv, 4) + vu]);
      rows.push(['Total dilution of last tube', '1:' + (Math.pow(df, k) < 1e9 ? H.num(Math.pow(df, k), 4) : sf(Math.pow(df, k), 3))]);
      return {
        value: sf(v.c1 / Math.pow(df, k), n) + cu,
        label: 'Concentration in tube ' + k,
        expr: sf(v.c1, n) + cu + ' ÷ ' + H.num(df, 4) + '<sup>' + k + '</sup>',
        rows: rows,
        sub: 'Put ' + H.num(dil, 4) + vu + ' of diluent in each tube, move ' + H.num(tv, 4) + vu + ' along the series, and mix before every transfer.',
        table: { head: ['Tube', 'Total dilution', 'Concentration'], rows: trows }
      };
    }
    if (v.mode === 'c2') {
      if (!(v.v1 > 0) || !(v.v2 > 0)) return { error: 'Enter the stock volume and the final volume.' };
      if (v.v1 > v.v2) return { error: 'The final volume must be at least as large as the stock volume.' };
      var c2 = v.c1 * v.v1 / v.v2;
      return {
        value: sf(c2, n) + cu,
        label: 'Final concentration (C2)',
        expr: sf(v.c1, n) + cu + ' × ' + H.num(v.v1, 4) + vu + ' ÷ ' + H.num(v.v2, 4) + vu,
        rows: [['Dilution factor', H.num(v.v2 / v.v1, 3) + '×', true], ['Diluent added', H.num(v.v2 - v.v1, 4) + vu], ['Fraction of stock', H.pct(v.v1 / v.v2 * 100, 2)]],
        sub: 'C2 = C1 × V1 ÷ V2. The amount of solute stays the same; only the volume grows.'
      };
    }
    if (!(v.c2 > 0) || !(v.v2 > 0)) return { error: 'Enter the target concentration and the final volume.' };
    if (v.c2 >= v.c1) return { error: 'The target concentration must be lower than the stock. A dilution can only lower concentration.' };
    var v1 = v.c2 * v.v2 / v.c1, f = v.c1 / v.c2;
    return {
      value: sf(v1, n) + vu,
      label: 'Stock solution to measure (V1)',
      expr: sf(v.c2, n) + cu + ' × ' + H.num(v.v2, 4) + vu + ' ÷ ' + sf(v.c1, n) + cu,
      rows: [['Diluent to add (V2 − V1)', H.num(v.v2 - v1, 2) + vu, true], ['Dilution factor', sf(f, n) + '× (1:' + H.num(f, 3) + ')'], ['Stock : diluent ratio', '1 : ' + H.num(f - 1, 3)]],
      sub: 'Measure ' + sf(v1, n) + vu + ' of stock into a ' + H.num(v.v2, 4) + vu + ' volumetric flask and fill to the mark rather than adding a fixed volume of water.'
    };
  },
  quick: ({ r }) => `To calculate a dilution, use <strong>C1V1 = C2V2</strong> and solve for the stock volume: V1 = C2 × V2 ÷ C1. To make 250 mL of 0.100 M solution from a 2.00 M stock you need 0.100 × 250 ÷ 2.00 = <strong>${r.value}</strong> of stock, made up to 250 mL with about 237.5 mL of water. That is a 1:20 dilution (dilution factor 20).`,
  stepsTitle: 'How to calculate a dilution with C1V1 = C2V2',
  steps: [
    'Write down what you know: the stock concentration (C1), the concentration you want (C2) and how much you need to make (V2).',
    'Put both concentrations in the same unit and both volumes in the same unit. Mixing mM with M is the most common mistake and makes the answer 1,000 times off.',
    'Solve for the stock volume: V1 = C2 × V2 ÷ C1.',
    'Measure V1 of stock with a pipette or graduated cylinder, transfer it to a volumetric flask, and add solvent up to the final volume V2.',
    'For very large dilutions (1:1,000 or more), use two or three smaller steps instead of pipetting a tiny volume; the error of a 0.1 mL measurement is far larger than that of a 1 mL one.'
  ],
  formulaTitle: 'What is the dilution formula?',
  formula: {
    expr: 'C1 × V1 = C2 × V2<br>Dilution factor = V2 ÷ V1 = C1 ÷ C2<br>Serial: C<sub>n</sub> = C1 ÷ DF<sup>n</sup>',
    vars: [['C1', 'concentration of the stock solution'], ['V1', 'volume of stock you take'], ['C2', 'concentration after diluting'], ['V2', 'total final volume (stock + solvent)'], ['DF', 'dilution factor of each step in a series'], ['n', 'number of steps (tubes)']],
    note: 'The formula works because dilution doesn\'t change the amount of solute: moles (or grams) before = C1 × V1 = moles after = C2 × V2.'
  },
  example: `<p>A biology lab needs 500 mL of 70% ethanol for disinfecting benches, and the stockroom has 95% ethanol.</p>
<p>V1 = 70% × 500 mL ÷ 95% = <strong>368 mL</strong> of 95% ethanol.</p>
<p>Pour it into a 500 mL graduated cylinder and add water to the 500 mL line. Don't simply add 132 mL of water: ethanol and water shrink slightly when mixed, so the total would come up short and the strength would be off.</p>`,
  table: {
    title: 'How much stock do you need for common concentrations?',
    intro: 'Volumes of a 2.00 M stock needed to make 250 mL at each target concentration, computed with C1V1 = C2V2.',
    head: ['Target (C2)', 'Stock (V1)', 'Water to add', 'Dilution factor'],
    rows: ({ run }) => [1, 0.5, 0.25, 0.2, 0.1, 0.05, 0.025, 0.02, 0.01, 0.005, 0.001].map(c => {
      const r = run({ mode: 'v1', c1: 2, c2: c, v2: 250, cUnit: 'M', vUnit: 'mL', sf: '3' });
      return [String(c) + ' M', r.value, r.rows[0][1], r.rows[1][1].split(' ')[0].replace('.0×', '×').replace(/^(\d+)\.00×$/, '$1×')];
    }),
    note: 'At a 1:2,000 dilution the stock volume is just 0.125 mL, too small to measure well with a graduated cylinder. Make a 1:20 intermediate first, then dilute that 1:100.'
  },
  sections: [
    {
      h2: 'How do you calculate the final concentration of a dilution?',
      html: `<p>Rearrange the same equation: C2 = C1 × V1 ÷ V2, where V2 is the total volume after adding solvent. Pipette 5.00 mL of 0.500 M copper sulfate into a 100.0 mL volumetric flask and fill to the mark: C2 = 0.500 × 5.00 ÷ 100.0 = <strong>0.0250 M</strong>.</p>
<p>The trap is using the volume of water added instead of the total. If you add 100 mL of water to 5.00 mL of stock, V2 is 105 mL and C2 is 0.0238 M. Choose "Final concentration" in the calculator to check either case.</p>`
    },
    {
      h2: 'How do you calculate the dilution factor, and what does 1:10 mean?',
      html: `<p>The dilution factor is the final volume divided by the volume of stock, or equivalently the starting concentration divided by the final one. In chemistry and microbiology, "1:10" means 1 part stock in 10 parts <em>total</em>: 1 mL of sample plus 9 mL of diluent, so the concentration drops to one-tenth.</p>
<p>Some product labels and older recipes use "1:10" to mean 1 part concentrate to 10 parts water (11 parts total). The difference is 10%, small for cleaning but significant in a quantitative lab, so check which convention your protocol uses. Dilution factors multiply: a 1:10 followed by a 1:50 is a 1:500 dilution overall.</p>`
    },
    {
      h2: 'How do you calculate a serial dilution?',
      html: `<p>Each tube is diluted by the same factor, so the concentration in tube <em>n</em> is C1 ÷ DF<sup>n</sup>. For a ten-fold series, put 9.0 mL of sterile diluent in each tube and move 1.0 mL down the line, mixing each time. After six tubes the sample is diluted 1:1,000,000 (10<sup>−6</sup>). Choose "Serial dilution" above to get the whole series.</p>
<p>Microbiologists use this to count bacteria. If 0.1 mL from the 10<sup>−6</sup> tube grows 150 colonies, the original culture had 150 ÷ (0.1 mL × 10<sup>−6</sup>) = <strong>1.5 × 10<sup>9</sup> CFU/mL</strong>. Plates with roughly 30 to 300 colonies give the most reliable counts.</p>`
    },
    {
      h2: 'Why fill to the mark instead of adding the calculated water?',
      html: `<p>C1V1 = C2V2 defines V2 as the final volume of the solution, and volumes of different liquids are not always additive. Ethanol and water, and concentrated acids and water, contract on mixing. Measuring the stock into a volumetric flask and filling to the calibration line gives the exact V2 regardless.</p>
<p>When diluting a concentrated acid, always add the acid to water, never water to acid; the heat released can boil the first drops of water and spatter acid. Put most of the water in the flask first, add the acid, let it cool, then make up to the mark.</p>`
    }
  ],
  faq: [
    { q: 'What does C1V1 = C2V2 mean?', a: 'It says the amount of solute is the same before and after diluting. C1 and V1 are the stock\'s concentration and the volume you take; C2 and V2 are the new concentration and the total final volume.' },
    { q: 'Can I use C1V1 = C2V2 with percent or mg/mL?', a: 'Yes, as long as C1 and C2 are in the same unit and V1 and V2 are in the same unit. It cannot convert between units such as % and molarity; that needs the molar mass and sometimes the density.' },
    { q: 'How do you make a 1:100 dilution?', a: 'Add 1 part stock to 99 parts diluent, for example 1.00 mL of stock made up to 100 mL. For better accuracy with small volumes, do two 1:10 steps.' },
    { q: 'How much water do I add to dilute a solution 10 times?', a: 'Use 9 volumes of water for every 1 volume of stock, for example 10 mL of stock made up to 100 mL total. The final concentration is one-tenth of the original.' },
    { q: 'How do I calculate the concentration when mixing two different solutions?', a: 'C1V1 = C2V2 is for adding pure solvent. For mixing two solutions of the same solute, use C_final = (C_a × V_a + C_b × V_b) ÷ (V_a + V_b).' },
    { q: 'What is the dilution factor of 2 mL in 50 mL?', a: 'If 2 mL of stock is made up to 50 mL total, the dilution factor is 50 ÷ 2 = 25, so the new concentration is 1/25 (4%) of the stock.' },
    { q: 'Do I need to convert mL to L for C1V1 = C2V2?', a: 'No. Because the same volume unit appears on both sides, mL, L or µL all work. You only need liters when converting molarity to moles.' }
  ],
  related: ['moles-calculator', 'ph-calculator', 'titration-calculator', 'ratio-calculator'],
  sources: [
    { name: 'OpenStax Chemistry 2e: 3.3 Molarity (dilution of solutions)', url: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity' },
    { name: 'OpenStax Microbiology: 9.1 How Microbes Grow (serial dilution and plate counts)', url: 'https://openstax.org/books/microbiology/pages/9-1-how-microbes-grow' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI (concentration units)', url: 'https://www.nist.gov/pml/special-publication-811' }
  ]
};
