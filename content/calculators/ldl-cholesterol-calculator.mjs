export default {
  slug: 'ldl-cholesterol-calculator',
  hub: 'health',
  name: 'LDL Cholesterol Calculator',
  title: 'LDL Cholesterol Calculator: 200 − 50 − 150/5 = LDL 120',
  h1: 'LDL Cholesterol Calculator: Friedewald and NIH (Sampson) Equations',
  meta: 'Total cholesterol 200, HDL 50 and triglycerides 150 give a calculated LDL of 120 mg/dL. See how labs compute LDL, non-HDL and lipid ratios in mg/dL or mmol/L.',
  keyword: 'how is cholesterol calculated',
  also: ['how to calculate ldl', 'ldl calculator', 'friedewald equation calculator', 'what is non hdl cholesterol calculation', 'how to calculate triglyceride to hdl ratio', 'cholesterol ratio calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'units', label: 'Units on your lab report', type: 'select', value: 'mg', options: [['mg', 'mg/dL (US)'], ['mmol', 'mmol/L']] },
    { id: 'method', label: 'LDL equation', type: 'select', value: 'f', options: [['f', 'Friedewald (classic)'], ['s', 'NIH / Sampson (2020)']] },
    { id: 'tc', label: 'Total cholesterol', type: 'number', value: 200 },
    { id: 'hdl', label: 'HDL cholesterol', type: 'number', value: 50 },
    { id: 'tg', label: 'Triglycerides', type: 'number', value: 150 }
  ],
  compute(v, H) {
    var mmol = v.units === 'mmol';
    if (!(v.tc > 0) || !(v.hdl > 0) || !(v.tg > 0)) return { error: 'Enter total cholesterol, HDL and triglycerides.' };
    var tc = mmol ? v.tc * 38.67 : v.tc, hdl = mmol ? v.hdl * 38.67 : v.hdl, tg = mmol ? v.tg * 88.57 : v.tg;
    if (mmol && v.tc > 50) return { error: 'Those look like mg/dL values. Switch the units to mg/dL.' };
    if (!mmol && v.tc < 30) return { error: 'Those look like mmol/L values. Switch the units to mmol/L.' };
    if (hdl >= tc) return { error: 'HDL must be lower than total cholesterol.' };
    var nonhdl = tc - hdl;
    var fried = mmol ? (v.tc - v.hdl - v.tg / 2.2) * 38.67 : tc - hdl - tg / 5;
    var samp = tc / 0.948 - hdl / 0.971 - (tg / 8.56 + tg * nonhdl / 2140 - tg * tg / 16100) - 9.44;
    var useS = v.method === 's' || tg >= 400;
    var ldl = useS ? samp : fried;
    function show(mg, isTg) { return mmol ? H.fix(mg / (isTg ? 88.57 : 38.67), 2) + ' mmol/L' : H.int(mg) + ' mg/dL'; }
    var cat = ldl < 100 ? 'Optimal (under 100 mg/dL)' : ldl < 130 ? 'Near or above optimal (100–129)' : ldl < 160 ? 'Borderline high (130–159)' : ldl < 190 ? 'High (160–189)' : 'Very high (190 or more)';
    var rows = [
      ['LDL category (NCEP ATP III)', cat, true],
      [useS ? 'Friedewald LDL' : 'NIH / Sampson LDL', tg >= 400 && useS ? 'not valid at this triglyceride level' : show(useS ? fried : samp)],
      ['Non-HDL cholesterol (TC − HDL)', show(nonhdl)],
      ['VLDL estimate (TG ÷ 5)', show(tg / 5)],
      ['Total cholesterol ÷ HDL', H.fix(tc / hdl, 1)],
      ['Triglyceride ÷ HDL (mg/dL basis)', H.fix(tg / hdl, 1)]
    ];
    var sub = tg >= 800 ? 'Triglycerides of 800 mg/dL or more: no calculation is reliable. Ask for a direct LDL measurement.' : tg >= 400 ? 'Friedewald is not valid with triglycerides of 400 mg/dL or more, so the NIH equation (validated up to 800) is shown.' : ldl < 70 ? 'At low LDL levels Friedewald tends to underestimate; the NIH or Martin–Hopkins equations are more accurate.' : 'Calculated values are estimates; a direct LDL test is more accurate when results sit near a treatment threshold.';
    if (ldl < 0) return { error: 'The equation gives a negative LDL for these numbers. A direct LDL measurement is needed.' };
    return {
      value: show(ldl),
      label: (useS ? 'LDL cholesterol (NIH / Sampson)' : 'LDL cholesterol (Friedewald)'),
      expr: useS ? 'Sampson equation, TG ' + H.int(tg) + ' mg/dL' : mmol ? H.num(v.tc, 2) + ' − ' + H.num(v.hdl, 2) + ' − ' + H.num(v.tg, 2) + ' ÷ 2.2' : H.int(tc) + ' − ' + H.int(hdl) + ' − ' + H.int(tg) + ' ÷ 5',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `Most labs calculate LDL rather than measure it. The Friedewald equation is LDL = total cholesterol − HDL − triglycerides ÷ 5 (in mg/dL). With a total of <strong>200</strong>, HDL of <strong>50</strong> and triglycerides of <strong>150</strong>: 200 − 50 − 30 = <strong>${r.value}</strong>. Non-HDL cholesterol is 200 − 50 = 150 mg/dL. In mmol/L, divide triglycerides by 2.2 instead of 5.`,
  stepsTitle: 'How to calculate LDL from a lipid panel',
  steps: [
    'Find total cholesterol, HDL and triglycerides on your lipid panel and note the units (mg/dL in the US, mmol/L in most other countries).',
    'Estimate VLDL cholesterol as triglycerides ÷ 5 in mg/dL (÷ 2.2 in mmol/L). For triglycerides of 150 that is 30 mg/dL.',
    'Subtract HDL and VLDL from total cholesterol: 200 − 50 − 30 = 120 mg/dL.',
    'Check the triglycerides first: <strong>at 400 mg/dL (4.5 mmol/L) or above, Friedewald is not valid</strong>. Use the NIH (Sampson) equation, valid to 800 mg/dL, or a direct LDL test.',
    'Compare the result with the reference categories and work out non-HDL cholesterol (total − HDL) as a second check.'
  ],
  formulaTitle: 'What formulas are used to calculate LDL cholesterol?',
  formula: {
    expr: 'Friedewald: LDL = TC − HDL − TG ÷ 5 (mg/dL)  ·  TG ÷ 2.2 (mmol/L)<br>NIH / Sampson: LDL = TC ÷ 0.948 − HDL ÷ 0.971 − (TG ÷ 8.56 + TG × non-HDL ÷ 2140 − TG² ÷ 16100) − 9.44<br>Non-HDL = TC − HDL',
    vars: [['TC', 'total cholesterol'], ['HDL', 'high-density lipoprotein cholesterol'], ['TG', 'triglycerides'], ['TG ÷ 5', 'estimate of VLDL cholesterol in mg/dL']],
    note: 'Friedewald, Levy and Fredrickson published their equation in Clinical Chemistry in 1972. Sampson and colleagues at the NIH published theirs in JAMA Cardiology in 2020; it uses mg/dL, so this calculator converts mmol/L values (cholesterol × 38.67, triglycerides × 88.57) before applying it.'
  },
  example: `<p>A lipid panel reads total cholesterol <strong>245</strong>, HDL <strong>42</strong> and triglycerides <strong>210</strong> mg/dL.</p>
<p>Friedewald: 245 − 42 − 210 ÷ 5 = 245 − 42 − 42 = <strong>161 mg/dL</strong> (high). Non-HDL = 245 − 42 = 203 mg/dL. Total/HDL ratio = 5.8; TG/HDL = 5.0.</p>
<p>NIH equation: non-HDL = 203, so the VLDL term is 210 ÷ 8.56 + 210 × 203 ÷ 2140 − 210² ÷ 16100 = 24.53 + 19.92 − 2.74 = 41.71. LDL = 258.44 − 43.25 − 41.71 − 9.44 = <strong>164 mg/dL</strong>, close to Friedewald at this triglyceride level.</p>`,
  table: {
    title: 'How much do Friedewald and NIH LDL differ as triglycerides rise?',
    intro: 'Calculated LDL in mg/dL for a total cholesterol of 200 and HDL of 50, with triglycerides changing. Both columns come from the calculator above.',
    head: ['Triglycerides', 'Friedewald LDL', 'NIH / Sampson LDL', 'Gap'],
    rows: ({ run }) => [50, 100, 150, 200, 250, 300, 350, 399, 450, 600, 800].map(tg => {
      const s = run({ units: 'mg', method: 's', tc: 200, hdl: 50, tg });
      const fv = 200 - 50 - tg / 5, sv = parseFloat(String(s.value).replace(/,/g, ''));
      return [tg + ' mg/dL', tg >= 400 ? 'not valid' : Math.round(fv) + ' mg/dL', s.value, tg >= 400 ? '—' : (sv - fv >= 0 ? '+' : '') + Math.round(sv - fv) + ' mg/dL'];
    }),
    note: 'The fixed TG ÷ 5 assumption breaks down as triglycerides rise, so Friedewald drifts lower than more accurate methods.'
  },
  sections: [
    {
      h2: 'How is total cholesterol calculated?',
      html: `<p>Total cholesterol is not calculated: the lab measures it directly with an enzyme assay, along with HDL and triglycerides. LDL is the number usually derived from the other three. Total cholesterol is roughly the sum of the cholesterol carried in LDL, HDL and VLDL particles, which is why LDL ≈ total − HDL − VLDL.</p>
<p>VLDL particles carry about five times as much triglyceride as cholesterol in fasting blood, which gives the TG ÷ 5 shortcut. That ratio is an average, and it is the main source of Friedewald's error.</p>`
    },
    {
      h2: 'Why is Friedewald LDL inaccurate with high triglycerides?',
      html: `<p>When triglycerides are high, VLDL and remnant particles carry relatively more triglyceride per unit of cholesterol, so TG ÷ 5 overstates VLDL cholesterol and the subtraction pushes LDL too low. Friedewald is not used at 400 mg/dL or above and also underestimates at very low LDL levels.</p>
<p>In the NIH team's validation, their equation had a root-mean-square error of 15.2 mg/dL against the reference ultracentrifugation method, compared with 32 mg/dL for Friedewald and 25.7 mg/dL for the Martin equation. It stayed as accurate up to 800 mg/dL as Friedewald is below 400. Many US labs now report the Martin–Hopkins or NIH result; check the method line on your report.</p>`
    },
    {
      h2: 'What is non-HDL cholesterol and how is it calculated?',
      html: `<p>Non-HDL cholesterol = total cholesterol − HDL. It counts the cholesterol in every particle that can deposit in artery walls (LDL, VLDL, IDL and lipoprotein(a)), needs no triglyceride correction and works on non-fasting samples.</p>
<p>The National Cholesterol Education Program's ATP III report set the non-HDL goal 30 mg/dL above the LDL goal, so an LDL goal under 100 pairs with a non-HDL goal under 130. With a total of 200 and HDL of 50, non-HDL is 150 mg/dL.</p>`
    },
    {
      h2: 'How do you calculate the triglyceride to HDL ratio?',
      html: `<p>Divide triglycerides by HDL using the same units. In mg/dL, 150 ÷ 50 = 3.0. The ratio is not interchangeable between unit systems: the same blood in mmol/L gives 1.69 ÷ 1.29 = 1.3, because triglyceride and cholesterol convert with different factors (divide mg/dL ratios by about 2.3 to get mmol/L ratios).</p>
<p>Researchers have studied the TG/HDL ratio as a marker of insulin resistance and small, dense LDL, but US guidelines do not set a treatment cut-off for it. The total cholesterol/HDL ratio (200 ÷ 50 = 4.0 here) is another older summary measure.</p>`
    },
    {
      h2: 'What are healthy LDL, HDL and triglyceride levels?',
      html: `<p>The NHLBI's ATP III classification (mg/dL) is still the common reference on lab reports:</p>
<ul>
<li><strong>LDL:</strong> under 100 optimal; 100–129 near or above optimal; 130–159 borderline high; 160–189 high; 190 or more very high.</li>
<li><strong>Total cholesterol:</strong> under 200 desirable; 200–239 borderline high; 240 or more high.</li>
<li><strong>HDL:</strong> under 40 is low; 60 or more is protective.</li>
<li><strong>Triglycerides:</strong> under 150 normal; 150–199 borderline high; 200–499 high; 500 or more very high.</li>
</ul>
<p>Personal LDL targets depend on overall cardiovascular risk, diabetes and existing heart disease, so a clinician may aim lower than these categories.</p>`
    }
  ],
  faq: [
    { q: 'Is an LDL of 120 good?', a: 'An LDL of 120 mg/dL falls in the near or above optimal category (100–129). Whether it needs treatment depends on your overall cardiovascular risk.' },
    { q: 'How do I convert cholesterol from mg/dL to mmol/L?', a: 'Divide cholesterol values (total, LDL, HDL) by 38.67 and triglycerides by 88.57. An LDL of 120 mg/dL is 3.10 mmol/L.' },
    { q: 'Do I need to fast for an LDL calculation?', a: 'Not usually. Current US guidelines accept non-fasting lipid panels for most adults, but a fasting test is often repeated if non-fasting triglycerides are 400 mg/dL or higher.' },
    { q: 'Why is my calculated LDL different from a direct LDL test?', a: 'Calculated LDL is an estimate from three other measurements, so its error adds up, especially with high triglycerides or very low LDL. A direct test measures LDL cholesterol itself.' },
    { q: 'Can calculated LDL be negative?', a: 'Yes, with Friedewald and very high triglycerides the TG ÷ 5 term can exceed total minus HDL. That result is meaningless and a direct LDL measurement is needed.' },
    { q: 'What is VLDL cholesterol?', a: 'VLDL is the cholesterol carried in very-low-density lipoproteins, which mainly transport triglycerides. Labs usually estimate it as triglycerides ÷ 5 in mg/dL.' },
    { q: 'What is a good total cholesterol to HDL ratio?', a: 'Lower is better. A total of 200 with an HDL of 50 gives 4.0. Guidelines now base treatment on LDL, non-HDL and overall risk rather than this ratio.' }
  ],
  related: ['map-calculator', 'bmi-calculator', 'calorie-calculator', 'anc-calculator'],
  sources: [
    { name: 'NHLBI: ATP III Guidelines At-a-Glance Quick Desk Reference (PDF)', url: 'https://www.nhlbi.nih.gov/files/docs/guidelines/atglance.pdf' },
    { name: 'NHLBI: Blood Cholesterol', url: 'https://www.nhlbi.nih.gov/health/blood-cholesterol' },
    { name: 'Friedewald, Levy, Fredrickson 1972, Clinical Chemistry (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/4337382/' },
    { name: 'Sampson et al. 2020, JAMA Cardiology: a new equation for LDL-C (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/32101259/' },
    { name: 'CDC: About Cholesterol', url: 'https://www.cdc.gov/cholesterol/about/index.html' }
  ],
  disclaimer: 'Educational estimate only. It does not replace your laboratory\'s reported values or a clinician\'s assessment of cardiovascular risk.'
};
