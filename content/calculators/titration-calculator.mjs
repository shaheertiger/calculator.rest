export default {
  slug: 'titration-calculator',
  hub: 'science',
  name: 'Titration Calculator',
  title: 'Titration Calculator: Equivalence at 25.00 mL, pH 8.72',
  h1: 'Titration Calculator: Equivalence Point, pH Curve and Unknown Concentration',
  meta: '25.00 mL of 0.100 M acetic acid needs 25.00 mL of 0.100 M NaOH to reach equivalence, where pH is 8.72. Get the full titration curve or an unknown concentration.',
  keyword: 'how to calculate equivalence point',
  also: ['titration calculator', 'how to calculate ph at the equivalence point', 'how to calculate the equivalence point', 'how to calculate the equivalence point of a titration', 'how to calculate equivalence point on titration curve', 'how to calculate the concentration of naoh'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you need?', type: 'select', value: 'eq', options: [['eq', 'Equivalence point, pH and titration curve'], ['conc', 'Unknown concentration from the endpoint volume']] },
    { id: 'type', label: 'Titration type', type: 'select', value: 'wa_sb', showIf: { mode: ['eq'] }, options: [['wa_sb', 'Weak acid titrated with strong base'], ['sa_sb', 'Strong acid titrated with strong base'], ['wb_sa', 'Weak base titrated with strong acid'], ['sb_sa', 'Strong base titrated with strong acid']] },
    { id: 'ca', label: 'Analyte concentration', type: 'number', value: 0.1, suffix: 'M', showIf: { mode: ['eq'] } },
    { id: 'va', label: 'Analyte volume (in the flask)', type: 'number', value: 25, suffix: 'mL' },
    { id: 'ct', label: 'Titrant concentration (in the buret)', type: 'number', value: 0.1, suffix: 'M' },
    { id: 'ka', label: 'Ka of the weak acid', type: 'number', value: 0.000018, showIf: { mode: ['eq'], type: ['wa_sb'] }, help: 'Acetic acid 1.8e-5' },
    { id: 'kb', label: 'Kb of the weak base', type: 'number', value: 0.000018, showIf: { mode: ['eq'], type: ['wb_sa'] }, help: 'Ammonia 1.8e-5' },
    { id: 'vadd', label: 'pH after adding (optional)', type: 'number', value: '', suffix: 'mL', placeholder: 'e.g. 10', showIf: { mode: ['eq'] } },
    { id: 'vt', label: 'Titrant volume at the endpoint', type: 'number', value: 21.35, suffix: 'mL', showIf: { mode: ['conc'] } },
    { id: 'ratio', label: 'Moles of titrant per mole of analyte', type: 'select', value: '1', showIf: { mode: ['conc'] }, options: [['1', '1 (HCl + NaOH, CH₃COOH + NaOH)'], ['2', '2 (H₂SO₄ + 2NaOH)'], ['3', '3 (H₃PO₄ + 3NaOH, to the third endpoint)']] }
  ],
  compute(v, H) {
    if (!(v.va > 0)) return { error: 'Enter the analyte volume in mL.' };
    if (!(v.ct > 0)) return { error: 'Enter the titrant concentration.' };
    if (v.mode === 'conc') {
      if (!(v.vt > 0)) return { error: 'Enter the titrant volume used to reach the endpoint.' };
      var ratio = Number(v.ratio) || 1;
      var nt = v.ct * v.vt / 1000, na = nt / ratio, c = na / (v.va / 1000);
      return {
        value: H.fix(Number(c.toPrecision(4)), Math.max(0, 3 - Math.floor(Math.log10(c)))) + ' M',
        label: 'Analyte concentration',
        expr: H.num(v.ct, 6) + ' M × ' + H.num(v.vt, 4) + ' mL ÷ (' + ratio + ' × ' + H.num(v.va, 4) + ' mL)',
        rows: [['Moles of titrant', (nt * 1000).toPrecision(4) + ' mmol'], ['Moles of analyte', (na * 1000).toPrecision(4) + ' mmol', true], ['Mole ratio used', ratio + ' : 1']],
        sub: 'Burets read to ±0.01 mL, so titration results are normally reported to four significant figures.'
      };
    }
    var Kw = 1e-14, t = v.type, ca = v.ca;
    if (!(ca > 0)) return { error: 'Enter the analyte concentration.' };
    if (t === 'wa_sb' && !(v.ka > 0)) return { error: 'Enter the Ka of the weak acid.' };
    if (t === 'wb_sa' && !(v.kb > 0)) return { error: 'Enter the Kb of the weak base.' };
    var nA = ca * v.va / 1000, veq = nA / v.ct * 1000;
    function pHat(vb) {
      var V = (v.va + vb) / 1000, CA = nA / V, CT = v.ct * vb / 1000 / V;
      var f = function (p) {
        var h = Math.pow(10, -p), oh = Kw / h;
        if (t === 'wa_sb') return h + CT - oh - CA * v.ka / (v.ka + h);
        if (t === 'sa_sb') return h + CT - oh - CA;
        if (t === 'wb_sa') { var kaw = Kw / v.kb; return h + CA * h / (h + kaw) - oh - CT; }
        return h + CA - oh - CT;
      };
      return H.solve(f, -3, 17);
    }
    var acidAnalyte = t === 'wa_sb' || t === 'sa_sb';
    var weak = t === 'wa_sb' || t === 'wb_sa';
    var pEq = pHat(veq), p0 = pHat(0), pHalf = pHat(veq / 2);
    var ind = pEq > 7.6 ? 'Phenolphthalein (8.2–10.0)' : pEq < 6.4 ? 'Methyl red (4.4–6.2)' : 'Bromothymol blue (6.0–7.6)';
    var rows = [['pH at equivalence', H.fix(pEq, 2), true], ['Starting pH', H.fix(p0, 2)]];
    if (weak) rows.push(['pH at half-equivalence (' + H.num(veq / 2, 2) + ' mL)', H.fix(pHalf, 2) + (t === 'wa_sb' ? ' ≈ pKa' : ' ≈ pKa of BH⁺')]);
    rows.push(['Moles of analyte', H.num(nA * 1000, 4) + ' mmol']);
    rows.push(['Suggested indicator', ind]);
    if (v.vadd >= 0 && isFinite(v.vadd)) rows.push(['pH after ' + H.num(v.vadd, 2) + ' mL', H.fix(pHat(v.vadd), 2), true]);
    var fr = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.98, 1, 1.02, 1.1, 1.25, 1.5, 2];
    var trows = fr.map(function (x) {
      var vb = veq * x;
      var reg = x === 0 ? 'start' : x < 1 ? (x === 0.5 && weak ? 'half-equivalence' : (weak ? 'buffer region' : 'before equivalence')) : x === 1 ? 'equivalence point' : 'excess titrant';
      return [H.fix(vb, 2) + ' mL', H.fix(pHat(vb), 2), reg];
    });
    return {
      value: H.fix(veq, 2) + ' mL',
      label: 'Titrant volume at the equivalence point',
      expr: H.num(ca, 6) + ' M × ' + H.num(v.va, 4) + ' mL ÷ ' + H.num(v.ct, 6) + ' M',
      rows: rows,
      sub: (acidAnalyte ? (weak ? 'The equivalence point is basic because the conjugate base (A⁻) reacts with water.' : 'Strong acid with strong base: the equivalence point is neutral, pH 7.00 at 25 °C.') : (weak ? 'The equivalence point is acidic because the conjugate acid (BH⁺) donates protons to water.' : 'Strong base with strong acid: the equivalence point is neutral, pH 7.00 at 25 °C.')) + ' Curve assumes a 1:1 reaction at 25 °C.',
      table: { caption: 'Titration curve', head: ['Titrant added', 'pH', 'Region'], rows: trows }
    };
  },
  quick: ({ r }) => `The equivalence point is where moles of titrant equal moles of analyte: V<sub>eq</sub> = C<sub>analyte</sub> × V<sub>analyte</sub> ÷ C<sub>titrant</sub>. Titrating 25.00 mL of 0.100 M acetic acid with 0.100 M NaOH reaches equivalence at <strong>${r.value}</strong>. The pH there is <strong>8.72</strong>, not 7, because the acetate formed is a weak base. Halfway, at 12.50 mL, the pH is 4.75, essentially the pKa.`,
  stepsTitle: 'How to calculate the equivalence point of a titration',
  steps: [
    'Find the moles of analyte in the flask: moles = molarity × volume in liters. 0.100 M × 0.02500 L = 2.500 × 10⁻³ mol.',
    'Use the balanced equation to get the moles of titrant needed. For HCl or acetic acid with NaOH it is 1:1; for H₂SO₄ with NaOH it is 2 mol NaOH per mol acid.',
    'Divide the moles of titrant by its molarity to get the equivalence volume: 2.500 × 10⁻³ mol ÷ 0.100 M = 0.02500 L = 25.00 mL.',
    'For the pH at equivalence, work out what is in the flask at that moment. Strong + strong gives neutral salt water (pH 7). A weak acid leaves its conjugate base, so use Kb = Kw ÷ Ka and the total volume (here 50.00 mL). Forgetting the doubled volume is the usual mistake.',
    'Pick an indicator whose color change falls on the steep part of the curve around that pH.'
  ],
  formulaTitle: 'What formulas does a titration use?',
  formula: {
    expr: 'V<sub>eq</sub> = (C<sub>a</sub> × V<sub>a</sub> × ratio) ÷ C<sub>t</sub><br>Unknown: C<sub>a</sub> = C<sub>t</sub> × V<sub>t</sub> ÷ (ratio × V<sub>a</sub>)<br>Weak acid at equivalence: [OH⁻] ≈ √(K<sub>b</sub> × [A⁻]), K<sub>b</sub> = K<sub>w</sub> ÷ K<sub>a</sub><br>Half-equivalence: pH = pK<sub>a</sub>',
    vars: [['C<sub>a</sub>, V<sub>a</sub>', 'analyte concentration and volume (in the flask)'], ['C<sub>t</sub>, V<sub>t</sub>', 'titrant concentration and volume (from the buret)'], ['ratio', 'moles of titrant per mole of analyte from the balanced equation'], ['K<sub>w</sub>', '1.0 × 10⁻¹⁴ at 25 °C']],
    note: 'The calculator doesn\'t use the square-root shortcut: it solves the full charge balance at every point, so the curve is accurate from the first drop to well past equivalence.'
  },
  example: `<p>pH at equivalence for 25.00 mL of 0.100 M acetic acid (Ka = 1.8 × 10⁻⁵) titrated with 0.100 M NaOH:</p>
<p>All 2.500 mmol of acid has become acetate in 25.00 + 25.00 = 50.00 mL, so [A⁻] = 2.500 ÷ 50.00 = 0.0500 M.</p>
<p>K<sub>b</sub> = 1.0 × 10⁻¹⁴ ÷ 1.8 × 10⁻⁵ = 5.56 × 10⁻¹⁰. [OH⁻] = √(5.56 × 10⁻¹⁰ × 0.0500) = 5.27 × 10⁻⁶ M.</p>
<p>pOH = 5.28, so <strong>pH = 8.72</strong>. Phenolphthalein, which turns pink from 8.2 to 10.0, marks it well; methyl orange would change far too early.</p>`,
  table: {
    title: 'What is the pH at the equivalence point for common titrations?',
    intro: 'Each row titrates 25.00 mL of a 0.100 M analyte with 0.100 M titrant (equivalence at 25.00 mL), computed by the calculator.',
    head: ['Analyte (titrant)', 'K at 25 °C', 'Starting pH', 'pH at half-equivalence', 'pH at equivalence', 'Indicator'],
    rows: ({ run }) => [
      ['Hydrochloric acid (NaOH)', '—', { type: 'sa_sb' }],
      ['Formic acid (NaOH)', 'Ka 1.8 × 10⁻⁴', { type: 'wa_sb', ka: 1.8e-4 }],
      ['Benzoic acid (NaOH)', 'Ka 6.3 × 10⁻⁵', { type: 'wa_sb', ka: 6.3e-5 }],
      ['Acetic acid (NaOH)', 'Ka 1.8 × 10⁻⁵', { type: 'wa_sb', ka: 1.8e-5 }],
      ['Hypochlorous acid (NaOH)', 'Ka 3.0 × 10⁻⁸', { type: 'wa_sb', ka: 3.0e-8 }],
      ['Ammonia (HCl)', 'Kb 1.8 × 10⁻⁵', { type: 'wb_sa', kb: 1.8e-5 }],
      ['Sodium hydroxide (HCl)', '—', { type: 'sb_sa' }]
    ].map(([name, k, o]) => {
      const r = run({ mode: 'eq', ca: 0.1, va: 25, ct: 0.1, vadd: NaN, ...o });
      const half = r.rows.find(x => /half/.test(x[0]));
      return [name, k, r.rows[1][1], half ? half[1].split(' ')[0] : '—', r.rows[0][1], r.rows.find(x => x[0] === 'Suggested indicator')[1]];
    }),
    note: 'Ka and Kb values are typical textbook figures; published tables differ in the second digit. A smaller Ka gives a higher equivalence pH and a smaller, harder-to-see jump.'
  },
  sections: [
    {
      h2: 'How do you find the equivalence point on a titration curve?',
      html: `<p>On a plot of pH against volume of titrant, the equivalence point is the center of the steepest, near-vertical section: the inflection point. Read the volume straight down from it. For a sharper answer, plot the change in pH per mL (ΔpH/ΔV) against volume; the peak of that first-derivative curve is the equivalence volume.</p>
<p>A second check for weak acids is the half-equivalence point. At half the equivalence volume, [HA] = [A⁻], so pH = pKa. In the default example the curve passes pH 4.75 at 12.50 mL (acetic acid's pKa is 4.74; the tiny gap comes from the acid's own ionization), which also lets you measure an unknown acid's Ka from your own data.</p>`
    },
    {
      h2: 'How do you calculate pH at the equivalence point?',
      html: `<p>Ask what species is left in the flask once the acid and base have exactly neutralized each other:</p>
<ul><li><strong>Strong acid + strong base</strong> (HCl + NaOH): only NaCl and water, so pH = 7.00 at 25 °C.</li>
<li><strong>Weak acid + strong base</strong> (CH₃COOH + NaOH): the conjugate base A⁻ hydrolyzes, so pH &gt; 7. Use Kb = Kw ÷ Ka and the concentration of A⁻ in the <em>total</em> volume.</li>
<li><strong>Weak base + strong acid</strong> (NH₃ + HCl): the conjugate acid NH₄⁺ makes the solution acidic, pH &lt; 7. For 0.100 M ammonia it comes out at 5.28.</li></ul>
<p>Choose the titration type above and the calculator gives the equivalence pH, the starting pH and a full curve in the results panel.</p>`
    },
    {
      h2: 'What is the difference between the equivalence point and the endpoint?',
      html: `<p>The equivalence point is a calculated quantity: the volume where the moles of titrant exactly match the analyte. The endpoint is what you observe: the volume where the indicator changes color or the meter shows the jump. A well-chosen indicator puts the endpoint within a drop (about 0.05 mL) of the equivalence point.</p>
<p>Choosing the wrong indicator is a systematic error. Methyl orange (3.1–4.4) in an acetic acid titration changes color several milliliters early, well before the equivalence point at pH 8.72.</p>`
    },
    {
      h2: 'How do you calculate the concentration of NaOH from a titration?',
      html: `<p>NaOH absorbs water and CO₂ from the air, so its solutions are standardized against a primary standard, usually potassium hydrogen phthalate (KHP, 204.22 g/mol). KHP reacts 1:1 with NaOH.</p>
<p>Example: 0.5105 g of KHP needs 24.85 mL of NaOH to reach a faint pink phenolphthalein endpoint. Moles KHP = 0.5105 ÷ 204.22 = 2.500 × 10⁻³ mol. [NaOH] = 2.500 × 10⁻³ ÷ 0.02485 L = <strong>0.1006 M</strong>. For a liquid analyte, choose "Unknown concentration" above: by default, 21.35 mL of 0.100 M NaOH neutralizing 25.00 mL of HCl gives 0.08540 M HCl.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate the equivalence point volume?', a: 'Multiply the analyte\'s molarity by its volume to get moles, apply the mole ratio, and divide by the titrant\'s molarity. 25.00 mL of 0.100 M acid with 0.100 M NaOH needs 25.00 mL.' },
    { q: 'Why is the pH at the equivalence point not always 7?', a: 'Only strong acid–strong base titrations give a neutral salt. A weak acid leaves a basic conjugate base (pH above 7) and a weak base leaves an acidic conjugate acid (pH below 7).' },
    { q: 'What is the pH at the half-equivalence point?', a: 'For a weak acid titrated with a strong base, pH = pKa at half-equivalence because the acid and its conjugate base are present in equal amounts. For acetic acid that is about 4.74.' },
    { q: 'Which indicator should I use?', a: 'Use one whose color-change range sits on the steep part of the curve: phenolphthalein (8.2–10.0) for weak acid–strong base, methyl red (4.4–6.2) for weak base–strong acid, and bromothymol blue (6.0–7.6) or phenolphthalein for strong–strong.' },
    { q: 'How many equivalence points does a diprotic acid have?', a: 'Two, one for each proton, if the two Ka values differ enough (by about 10⁴ or more). Sulfuric acid shows essentially one combined jump because its first proton is strong and its second is fairly strong, so it is usually treated as needing 2 mol NaOH per mole.' },
    { q: 'How do you read a buret correctly?', a: 'Read the bottom of the meniscus at eye level and estimate one digit past the smallest marking, to ±0.01 mL on a 50 mL buret. The titrant volume is the final reading minus the initial reading.' },
    { q: 'What happens if I overshoot the endpoint?', a: 'The calculated concentration comes out too high, because you recorded more titrant than needed. Repeat the titration; most labs require concordant results within 0.10 mL.' }
  ],
  related: ['ph-calculator', 'dilution-calculator', 'moles-calculator', 'theoretical-yield-calculator'],
  sources: [
    { name: 'OpenStax Chemistry 2e: 14.7 Acid-Base Titrations', url: 'https://openstax.org/books/chemistry-2e/pages/14-7-acid-base-titrations' },
    { name: 'OpenStax Chemistry 2e: 4.5 Quantitative Chemical Analysis', url: 'https://openstax.org/books/chemistry-2e/pages/4-5-quantitative-chemical-analysis' },
    { name: 'NIST: Standard Reference Materials (primary standards such as potassium hydrogen phthalate)', url: 'https://www.nist.gov/srm' }
  ]
};
