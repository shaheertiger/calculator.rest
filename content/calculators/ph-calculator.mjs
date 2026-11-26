export default {
  slug: 'ph-calculator',
  hub: 'science',
  name: 'pH Calculator',
  title: 'pH Calculator: pH 4.50 Means [H⁺] = 3.16 × 10⁻⁵ M',
  h1: 'pH, pOH, [H⁺] and [OH⁻] Calculator',
  meta: '[H⁺] = 10^−pH, so pH 4.50 is 3.16 × 10⁻⁵ M and [OH⁻] is 3.16 × 10⁻¹⁰ M at 25 °C. Convert pH, pOH and ion concentrations, or find the pH of acids and bases.',
  keyword: 'how to calculate the hydrogen ion concentration from ph',
  also: ['ph calculator', 'how to calculate h ion concentration from ph', 'how to calculate oh from ph', 'how to calculate ph from h concentration', 'how to calculate poh', 'how to calculate ph of a weak acid'],
  updated: '2026-11-13',
  inputs: [
    { id: 'known', label: 'I know the', type: 'select', value: 'ph', options: [['ph', 'pH'], ['poh', 'pOH'], ['h', '[H⁺] or [H₃O⁺] (mol/L)'], ['oh', '[OH⁻] (mol/L)'], ['sa', 'Strong acid concentration (HCl, HNO₃)'], ['sb', 'Strong base concentration (NaOH, KOH)'], ['wa', 'Weak acid concentration and Ka'], ['wb', 'Weak base concentration and Kb']] },
    { id: 'ph', label: 'pH', type: 'number', value: 4.5, showIf: { known: ['ph'] } },
    { id: 'poh', label: 'pOH', type: 'number', value: 9.5, showIf: { known: ['poh'] } },
    { id: 'h', label: '[H⁺]', type: 'number', value: 0.00025, suffix: 'M', showIf: { known: ['h'] }, help: 'E-notation works: 2.5e-4' },
    { id: 'oh', label: '[OH⁻]', type: 'number', value: 0.0001, suffix: 'M', showIf: { known: ['oh'] }, help: 'E-notation works: 1e-4' },
    { id: 'conc', label: 'Concentration', type: 'number', value: 0.1, suffix: 'M', showIf: { known: ['sa', 'sb', 'wa', 'wb'] } },
    { id: 'ka', label: 'Ka of the acid', type: 'number', value: 0.000018, showIf: { known: ['wa'] }, help: 'Acetic acid 1.8e-5' },
    { id: 'kb', label: 'Kb of the base', type: 'number', value: 0.000018, showIf: { known: ['wb'] }, help: 'Ammonia 1.8e-5' }
  ],
  compute(v, H) {
    function sf(x, k) {
      if (!isFinite(x)) return '—';
      if (x === 0) return '0';
      var r = Number(x.toPrecision(k));
      var e = Math.floor(Math.log10(Math.abs(r)));
      if (e < -3 || e >= 6) return (r / Math.pow(10, e)).toFixed(k - 1) + ' × 10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>';
      return H.fix(r, Math.max(0, k - 1 - e));
    }
    var Kw = 1e-14, h, expr = '', extra = null, k = v.known;
    function root(f) { return Math.pow(10, -H.solve(f, -3, 17)); }
    if (k === 'ph') {
      if (!isFinite(v.ph) || v.ph < -2 || v.ph > 16) return { error: 'Enter a pH, usually between 0 and 14.' };
      h = Math.pow(10, -v.ph); expr = '10<sup>−' + H.num(v.ph, 4) + '</sup>';
    } else if (k === 'poh') {
      if (!isFinite(v.poh) || v.poh < -2 || v.poh > 16) return { error: 'Enter a pOH, usually between 0 and 14.' };
      h = Kw / Math.pow(10, -v.poh); expr = 'pH = 14 − ' + H.num(v.poh, 4);
    } else if (k === 'h') {
      if (!(v.h > 0)) return { error: 'Enter a positive [H⁺] in mol/L, e.g. 2.5e-4.' };
      h = v.h; expr = '−log(' + sf(v.h, 3) + ')';
    } else if (k === 'oh') {
      if (!(v.oh > 0)) return { error: 'Enter a positive [OH⁻] in mol/L, e.g. 1e-4.' };
      h = Kw / v.oh; expr = 'pOH = −log(' + sf(v.oh, 3) + ')';
    } else {
      var C = v.conc;
      if (!(C > 0)) return { error: 'Enter the concentration in mol/L.' };
      if (k === 'sa') { h = (C + Math.sqrt(C * C + 4 * Kw)) / 2; expr = '−log(' + sf(C, 3) + ')'; }
      else if (k === 'sb') { var o = (C + Math.sqrt(C * C + 4 * Kw)) / 2; h = Kw / o; expr = '14 + log(' + sf(C, 3) + ')'; }
      else if (k === 'wa') {
        if (!(v.ka > 0)) return { error: 'Enter the Ka of the acid.' };
        h = root(function (p) { var x = Math.pow(10, -p); return x - Kw / x - C * v.ka / (v.ka + x); });
        extra = ['Percent ionized', H.num(v.ka / (v.ka + h) * 100, 2) + '%'];
        expr = 'Ka = ' + sf(v.ka, 3) + ', C = ' + sf(C, 3) + ' M';
      } else if (k === 'wb') {
        if (!(v.kb > 0)) return { error: 'Enter the Kb of the base.' };
        var oh = root(function (p) { var x = Math.pow(10, -p); return x - Kw / x - C * v.kb / (v.kb + x); });
        h = Kw / oh;
        extra = ['Percent ionized', H.num(v.kb / (v.kb + oh) * 100, 2) + '%'];
        expr = 'Kb = ' + sf(v.kb, 3) + ', C = ' + sf(C, 3) + ' M';
      } else return { error: 'Choose what you know.' };
    }
    if (!(h > 0) || !isFinite(h)) return { error: 'Those values give no valid result.' };
    var pH = -Math.log10(h), pOH = 14 - pH, ohc = Kw / h;
    var rows = [['pH', H.fix(pH, 2), k !== 'ph'], ['pOH', H.fix(pOH, 2)], ['[H⁺]', sf(h, 3) + ' M', k === 'ph'], ['[OH⁻]', sf(ohc, 3) + ' M']];
    if (extra) rows.push(extra);
    var nature = pH < 6.995 ? 'Acidic' : pH > 7.005 ? 'Basic (alkaline)' : 'Neutral';
    return {
      value: k === 'ph' ? sf(h, 3) + ' M' : H.fix(pH, 2),
      label: k === 'ph' ? 'Hydrogen ion concentration [H⁺]' : 'pH',
      expr: expr,
      rows: rows,
      sub: nature + ' at 25 °C, where pH + pOH = 14.00 and [H⁺][OH⁻] = 1.0 × 10<sup>−14</sup>.'
    };
  },
  quick: ({ r }) => `To find the hydrogen ion concentration from pH, raise 10 to the negative pH: <strong>[H⁺] = 10<sup>−pH</sup></strong>. For pH 4.50, [H⁺] = 10<sup>−4.50</sup> = <strong>${r.value}</strong>. Then pOH = 14.00 − 4.50 = 9.50 and [OH⁻] = 10<sup>−9.50</sup> = 3.16 × 10<sup>−10</sup> M at 25 °C. On a calculator, press 10<sup>x</sup> (2nd, LOG) and enter −4.5.`,
  stepsTitle: 'How to convert between pH, pOH, [H⁺] and [OH⁻]',
  steps: [
    'From pH to [H⁺]: take the antilog of the negative pH, [H⁺] = 10<sup>−pH</sup>. On most calculators that is 2nd → LOG, then type the negative pH.',
    'From [H⁺] to pH: pH = −log[H⁺]. Don\'t drop the minus sign; it is the most common reason for a negative answer.',
    'Get pOH by subtraction: pOH = 14.00 − pH at 25 °C.',
    'Get [OH⁻] from pOH the same way, [OH⁻] = 10<sup>−pOH</sup>, or divide 1.0 × 10<sup>−14</sup> by [H⁺].',
    'Round the pH to as many decimal places as the concentration has significant figures (see below).'
  ],
  formulaTitle: 'What are the pH formulas?',
  formula: {
    expr: 'pH = −log[H⁺] &nbsp;·&nbsp; [H⁺] = 10<sup>−pH</sup><br>pOH = −log[OH⁻] &nbsp;·&nbsp; [OH⁻] = 10<sup>−pOH</sup><br>pH + pOH = 14.00 &nbsp;·&nbsp; [H⁺][OH⁻] = K<sub>w</sub> = 1.0 × 10<sup>−14</sup> (25 °C)',
    vars: [['[H⁺]', 'hydrogen (hydronium, H₃O⁺) ion concentration in mol/L'], ['[OH⁻]', 'hydroxide ion concentration in mol/L'], ['K<sub>w</sub>', 'ion-product constant of water at 25 °C'], ['log', 'base-10 logarithm']],
    note: 'Weak acids and bases are solved exactly from the charge balance with Ka or Kb, so the result stays correct even when the "x is small" shortcut fails.'
  },
  example: `<p>A rainwater sample in an environmental science lab reads pH 4.32 on a calibrated meter.</p>
<p>[H⁺] = 10<sup>−4.32</sup> = <strong>4.8 × 10<sup>−5</sup> M</strong> (two decimal places in the pH, so two significant figures).</p>
<p>pOH = 14.00 − 4.32 = 9.68, so [OH⁻] = 10<sup>−9.68</sup> = 2.1 × 10<sup>−10</sup> M.</p>
<p>Compared with unpolluted rain at about pH 5.6, the sample has 10<sup>5.6 − 4.32</sup> ≈ 19 times more H⁺.</p>`,
  table: {
    title: 'What is the [H⁺] and [OH⁻] at each pH?',
    intro: 'Ion concentrations at 25 °C for each whole pH unit, computed by the calculator, with everyday examples near that value.',
    head: ['pH', '[H⁺] (M)', '[OH⁻] (M)', 'Near this pH'],
    rows: ({ run }) => [
      [0, '1 M hydrochloric acid'], [1, '0.1 M HCl; stomach acid (1–3)'], [2, 'lemon juice (≈2–2.6)'], [3, 'vinegar (≈2.4–3.4)'],
      [4, 'tomato juice (≈4.1–4.6); acid rain (≈4.2–4.4)'], [5, 'black coffee (≈5); clean rain (≈5.6)'], [6, 'milk (≈6.5–6.8)'], [7, 'pure water at 25 °C'],
      [8, 'seawater (≈8.1); baking soda solution (≈8.3)'], [9, 'borax buffer (9.18)'], [10, 'milk of magnesia (≈10.5)'], [11, 'household ammonia (≈11–11.6)'],
      [12, 'saturated limewater (≈12.4)'], [13, '0.1 M NaOH'], [14, '1 M sodium hydroxide']
    ].map(([p, ex]) => { const r = run({ known: 'ph', ph: p }); return [String(p), r.rows[2][1].replace(' M', ''), r.rows[3][1].replace(' M', ''), ex]; }),
    note: 'Each step of one pH unit is a tenfold change in [H⁺]. Food and household values are typical ranges and vary by product.'
  },
  sections: [
    {
      h2: 'How do you calculate [OH⁻] from pH?',
      html: `<p>Subtract the pH from 14 to get pOH, then take 10 to the negative pOH. For a pH 9.25 buffer: pOH = 14.00 − 9.25 = 4.75, and [OH⁻] = 10<sup>−4.75</sup> = <strong>1.8 × 10<sup>−5</sup> M</strong>.</p>
<p>The one-step alternative is [OH⁻] = 1.0 × 10<sup>−14</sup> ÷ [H⁺]. Both rely on K<sub>w</sub> at 25 °C; at other temperatures K<sub>w</sub> changes (see the FAQ).</p>`
    },
    {
      h2: 'How do you calculate pH from hydrogen ion concentration?',
      html: `<p>Take the negative base-10 log: pH = −log[H⁺]. For [H⁺] = 2.5 × 10<sup>−4</sup> M, log(2.5 × 10<sup>−4</sup>) = −3.60, so pH = <strong>3.60</strong>. Enter it as 2.5E−4 to avoid typing errors.</p>
<p>For a strong acid such as HCl or HNO₃, [H⁺] equals the acid concentration, so 0.010 M HCl has pH 2.00. For a strong base, find pOH from the base concentration first: 0.010 M NaOH has pOH 2.00 and pH 12.00. Both are options in the calculator.</p>`
    },
    {
      h2: 'How many decimal places should a pH have?',
      html: `<p>Only the digits after the decimal point in a pH are significant, because the whole-number part just sets the power of ten. So the number of decimal places in the pH equals the number of significant figures in the concentration.</p>
<ul><li>[H⁺] = 3.2 × 10<sup>−5</sup> M (2 s.f.) → pH 4.49 (2 decimal places).</li>
<li>pH 4.50 → [H⁺] = 3.2 × 10<sup>−5</sup> M, not 3.16 × 10<sup>−5</sup>.</li>
<li>pH 7.0 → [H⁺] = 1 × 10<sup>−7</sup> M (1 s.f.).</li></ul>
<p>The calculator shows three significant figures and two decimals so you can round to whatever your data supports.</p>`
    },
    {
      h2: 'How do you calculate the pH of a weak acid?',
      html: `<p>A weak acid only partly ionizes, so [H⁺] is much smaller than its concentration. With an ICE table, Ka = x² ÷ (C − x). If x is under 5% of C, the shortcut x ≈ √(Ka × C) works.</p>
<p>For 0.100 M acetic acid (Ka = 1.8 × 10<sup>−5</sup>): x ≈ √(1.8 × 10<sup>−6</sup>) = 1.34 × 10<sup>−3</sup> M, pH ≈ 2.87. Solving exactly gives 1.33 × 10<sup>−3</sup> M and <strong>pH 2.88</strong>, with 1.3% ionized. Choose "Weak acid concentration and Ka" above for the exact answer. For the pH during and at the end of a titration, use the <a href="/titration-calculator">titration calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the hydrogen ion concentration at pH 7?', a: 'At pH 7.00, [H⁺] = 10⁻⁷ = 1.0 × 10⁻⁷ M, equal to [OH⁻]. That is neutral water at 25 °C.' },
    { q: 'How much does [H⁺] change per pH unit?', a: 'Tenfold. pH 3 has 10 times the [H⁺] of pH 4 and 1,000 times that of pH 6, because pH is a base-10 logarithm.' },
    { q: 'Can pH be negative or above 14?', a: 'Yes. A 2 M strong acid has a calculated pH of −0.30, and a 2 M strong base about 14.30. At such high concentrations real solutions deviate from ideal behavior, so measured values differ somewhat.' },
    { q: 'Why isn\'t the pH of 1 × 10⁻⁸ M HCl equal to 8?', a: 'Water itself supplies about 1 × 10⁻⁷ M H⁺, which is larger than the acid\'s contribution. Solving with both sources gives pH 6.98, slightly acidic, as an acid solution must be.' },
    { q: 'Is neutral always pH 7?', a: 'Only at 25 °C. Kw grows with temperature, so neutral water at body temperature (37 °C) has a pH of about 6.8, and at 0 °C about 7.5. It is neutral because [H⁺] = [OH⁻], not because the number is 7.' },
    { q: 'How do I calculate pH on a TI-84?', a: 'Press (−), then LOG, type the concentration (use 2nd , for EE), close the bracket and press ENTER. For [H⁺] from pH, press 2nd LOG (10^x), type (−) and the pH.' },
    { q: 'What is the difference between [H⁺] and [H₃O⁺]?', a: 'They mean the same thing. Free protons don\'t exist in water; they attach to water molecules as hydronium, H₃O⁺. Chemists write [H⁺] for short.' }
  ],
  related: ['titration-calculator', 'dilution-calculator', 'moles-calculator', 'log-calculator', 'scientific-notation-calculator'],
  sources: [
    { name: 'OpenStax Chemistry 2e: 14.2 pH and pOH', url: 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh' },
    { name: 'OpenStax Chemistry 2e: 14.3 Relative Strengths of Acids and Bases', url: 'https://openstax.org/books/chemistry-2e/pages/14-3-relative-strengths-of-acids-and-bases' },
    { name: 'USGS Water Science School: pH and Water', url: 'https://www.usgs.gov/special-topics/water-science-school/science/ph-and-water' },
    { name: 'U.S. EPA: What is Acid Rain?', url: 'https://www.epa.gov/acidrain/what-acid-rain' }
  ]
};
