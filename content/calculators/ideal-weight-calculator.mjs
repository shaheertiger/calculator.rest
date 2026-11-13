export default {
  slug: 'ideal-weight-calculator',
  hub: 'health',
  name: 'Ideal Body Weight Calculator',
  title: 'Ideal Weight Calculator: 5\'6" Woman Is 131 lb by Devine (IBW)',
  h1: 'Ideal Body Weight Calculator: Devine, Robinson, Miller and Hamwi',
  meta: 'A 5 ft 6 in woman has an ideal body weight of about 131 lb by the Devine formula (129–135 lb across four formulas). Also shows BMI range and adjusted weight.',
  keyword: 'how do i calculate ideal body weight',
  also: ['ideal body weight calculator', 'ideal weight calculator', 'devine formula', 'ibw calculator', 'adjusted body weight calculator', 'how much should i weigh for my height'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sex', label: 'Sex', type: 'select', value: 'female', options: [['female', 'Female'], ['male', 'Male']] },
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'US (lb, ft, in)'], ['metric', 'Metric (kg, cm)']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 6, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 167.6, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'lb', label: 'Current weight (optional)', type: 'number', value: 150, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Current weight (optional)', type: 'number', value: 68, suffix: 'kg', showIf: { units: ['metric'] } }
  ],
  compute(v, H) {
    var us = v.units !== 'metric';
    var h = us ? (v.ft > 0 ? v.ft : 0) * 12 + (v.inch > 0 ? v.inch : 0) : v.cm / 2.54;
    if (!(h >= 48 && h <= 90)) return { error: 'Enter a height between 4 ft and 7 ft 6 in (122–229 cm).' };
    var m = v.sex === 'male';
    var d = h - 60;
    var lb = function (kg) { return kg / 0.45359237; };
    var f = {
      devine: lb((m ? 50 : 45.5) + 2.3 * d),
      robinson: lb(m ? 51.65 + 1.85 * d : 48.67 + 1.65 * d),
      miller: lb(m ? 56.2 + 1.41 * d : 53.1 + 1.36 * d),
      hamwi: (m ? 106 : 100) + (m ? 6 : 5) * d
    };
    var lo = Math.ceil(18.45 * h * h / 703), hi = Math.floor(24.95 * h * h / 703);
    var show = function (x) { return us ? H.int(x) + ' lb' : H.fix(x * 0.45359237, 1) + ' kg'; };
    var rows = [
      ['Devine (1974)', show(f.devine), true],
      ['Robinson (1983)', show(f.robinson)],
      ['Miller (1983)', show(f.miller)],
      ['Hamwi (1964)', show(f.hamwi) + ' (±10% for frame: ' + show(f.hamwi * 0.9) + '–' + show(f.hamwi * 1.1) + ')'],
      ['Healthy BMI range (18.5–24.9)', us ? lo + '–' + hi + ' lb' : H.fix(18.5 * h * h / 703 * 0.45359237, 1) + '–' + H.fix(24.9 * h * h / 703 * 0.45359237, 1) + ' kg']
    ];
    var w = us ? v.lb : v.kg / 0.45359237;
    var sub = 'The four formulas span ' + show(Math.min(f.devine, f.robinson, f.miller, f.hamwi)) + ' to ' + show(Math.max(f.devine, f.robinson, f.miller, f.hamwi)) + '.';
    if (w >= 60 && w <= 800) {
      var pct = w / f.devine * 100;
      rows.push(['Current weight vs Devine IBW', H.pct(pct, 0)]);
      rows.push(['Adjusted body weight (IBW + 0.4 × excess)', w > f.devine ? show(f.devine + 0.4 * (w - f.devine)) : 'not needed (at or below IBW)']);
      sub += pct > 120 ? ' Your weight is over 120% of IBW, the range where many dosing protocols switch to adjusted body weight.' : '';
    }
    if (h < 60) sub += ' Below 5 ft the formulas subtract weight for each inch, which is an extrapolation; the BMI range is more reliable.';
    var hTxt = Math.floor(h / 12) + ' ft ' + H.num(h - 12 * Math.floor(h / 12), 1) + ' in';
    return {
      value: show(f.devine),
      label: 'Ideal body weight (Devine) · ' + (m ? 'man' : 'woman') + ' ' + hTxt,
      expr: (m ? '50' : '45.5') + ' kg + 2.3 × ' + H.num(d, 1) + ' in over 5 ft',
      rows: rows,
      sub: sub,
      f: f, lo: lo, hi: hi
    };
  },
  quick: ({ r }) => `To calculate ideal body weight with the Devine formula, start at 45.5 kg for women (50 kg for men) and add 2.3 kg for every inch over 5 feet. A woman who is 5 ft 6 in gets 45.5 + 2.3 × 6 = 59.3 kg, or <strong>${r.value}</strong>. The Robinson, Miller and Hamwi formulas give 129–135 lb, and her healthy BMI range is 115–154 lb.`,
  stepsTitle: 'How to calculate your ideal body weight',
  steps: [
    'Measure your height in inches without shoes and subtract 60. At 5 ft 6 in that leaves 6 inches.',
    'Start from the base weight: 45.5 kg for women or 50 kg for men (Devine).',
    'Add 2.3 kg for each inch over 5 feet: 6 × 2.3 = 13.8 kg, for a total of 59.3 kg.',
    'Convert to pounds by dividing by 0.4536: 59.3 ÷ 0.4536 = 130.7, about 131 lb.',
    'Cross-check with the healthy BMI range for your height. A formula result is a single reference point, not a target everyone should aim for.'
  ],
  formulaTitle: 'What are the ideal body weight formulas?',
  formula: {
    expr: 'Devine: men 50 kg + 2.3 kg/in over 5 ft; women 45.5 kg + 2.3 kg/in<br>Robinson: men 51.65 kg + 1.85 kg/in; women 48.67 kg + 1.65 kg/in<br>Miller: men 56.2 kg + 1.41 kg/in; women 53.1 kg + 1.36 kg/in<br>Hamwi: men 106 lb + 6 lb/in; women 100 lb + 5 lb/in',
    vars: [['in over 5 ft', 'height in inches minus 60'], ['Adjusted body weight', 'IBW + 0.4 × (actual weight − IBW)']],
    note: 'Robinson\'s coefficients are the exact values from the 1983 paper; many websites round them to 52 + 1.9 and 49 + 1.7, which changes results by 1–2 lb at common heights.'
  },
  example: `<p>A man is 5 ft 10 in (10 inches over 5 ft) and weighs 230 lb.</p><p>Devine IBW: 50 + 2.3 × 10 = 73 kg = <strong>161 lb</strong>. Hamwi: 106 + 6 × 10 = <strong>166 lb</strong>. Robinson and Miller both give about <strong>155 lb</strong>.</p><p>His weight is 230 ÷ 161 = 143% of IBW. If a medication is dosed on adjusted body weight, it would be 161 + 0.4 × (230 − 161) = <strong>189 lb</strong>.</p>`,
  table: {
    title: 'What is the ideal weight for my height?',
    intro: 'Ideal body weight by the Devine and Hamwi formulas, plus the healthy BMI range, computed with the calculator above.',
    head: ['Height', 'Women, Devine', 'Women, Hamwi', 'Men, Devine', 'Men, Hamwi', 'BMI 18.5–24.9'],
    rows: ({ run, H }) => [58, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 76].map(h => {
      const w = run({ sex: 'female', units: 'us', ft: Math.floor(h / 12), inch: h % 12, lb: NaN });
      const m = run({ sex: 'male', units: 'us', ft: Math.floor(h / 12), inch: h % 12, lb: NaN });
      return [Math.floor(h / 12) + ' ft ' + (h % 12) + ' in', H.int(w.f.devine) + ' lb', H.int(w.f.hamwi) + ' lb', H.int(m.f.devine) + ' lb', H.int(m.f.hamwi) + ' lb', w.lo + '–' + w.hi + ' lb'];
    }),
    note: 'Formula results sit in the lower half of the BMI range for most heights. The 4 ft 10 in row extrapolates below 5 ft.'
  },
  sections: [
    {
      h2: 'Which ideal body weight formula is the best?',
      html: `<p>No formula is clearly best, and they agree within a few pounds for average heights. Pai and Paloucek traced their history in 2000: the equations all descend from insurance-company height and weight tables, and the authors concluded that their similarity reflects the agreement among those tables, so any one of them may be used.</p><p>Devine published his in 1974 as part of a paper on gentamicin dosing, and it became the standard in pharmacy and medicine. Robinson (1983) and Miller (1983) refit the Metropolitan Life tables with regression; Hamwi's 1964 rule of thumb is the oldest and is still taught to dietitians, with a ±10% adjustment for small or large frames. Devine and Hamwi rise faster with height, so for tall people they give noticeably higher numbers than Robinson and Miller.</p>`
    },
    {
      h2: 'Why do doctors use ideal body weight?',
      html: `<p>Mainly to dose medicines and set ventilators, not to tell patients what to weigh. Some drugs spread mostly into lean tissue, so dosing them on total body weight in a person with obesity can overshoot. Pharmacists often use IBW, or <strong>adjusted body weight</strong> (IBW + 0.4 × the excess), for these drugs and for estimating kidney function.</p><p>In intensive care, lung-protective ventilation sets tidal volume from <strong>predicted body weight</strong>, which uses the same structure as Devine in metric form: 50 kg (men) or 45.5 kg (women) + 0.91 × (height in cm − 152.4). For a 178 cm man, that is about 73 kg regardless of actual weight; the <a href="/tidal-volume-calculator">tidal volume calculator</a> uses it.</p>`
    },
    {
      h2: 'Is ideal body weight the same as a healthy weight?',
      html: `<p>No. IBW is a single number that ignores muscle, frame size, age and body composition. The CDC defines healthy weight for adults by BMI: 18.5 to under 25. For a 5 ft 6 in woman that is 115–154 lb, a 39 lb range that includes all four formula results near its lower middle.</p><p>A muscular person can be well above IBW and still lean, and a person at IBW can carry excess fat. If you want a target that reflects body composition, estimate your <a href="/body-fat-calculator">body fat percentage</a> and work out the weight at your goal percentage, or check your <a href="/bmi-calculator">BMI</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the ideal weight for a 5 ft 6 in woman?', a: 'About 131 lb by the Devine formula, 129 lb by Robinson, 135 lb by Miller and 130 lb by Hamwi. Her healthy BMI range is 115–154 lb.' },
    { q: 'What is the ideal weight for a 5 ft 10 in man?', a: 'About 161 lb by Devine and 166 lb by Hamwi; Robinson and Miller give about 155 lb. The healthy BMI range at that height is 129–173 lb.' },
    { q: 'What is the Devine formula?', a: 'Men: 50 kg + 2.3 kg per inch over 5 feet. Women: 45.5 kg + 2.3 kg per inch over 5 feet. It was published by B.J. Devine in 1974 for drug dosing.' },
    { q: 'How do I calculate adjusted body weight?', a: 'Adjusted body weight = IBW + 0.4 × (actual weight − IBW). At an IBW of 161 lb and an actual weight of 230 lb, it is 161 + 0.4 × 69 = 189 lb.' },
    { q: 'How do I calculate ideal body weight if I am under 5 feet?', a: 'The formulas subtract the per-inch amount for each inch below 5 feet, but none were designed for it. Many clinicians use the BMI range or clinical judgment instead.' },
    { q: 'Does frame size change ideal weight?', a: 'In the Hamwi method, yes: subtract 10% for a small frame and add 10% for a large frame. A 5 ft 6 in woman\'s 130 lb becomes 117–143 lb.' },
    { q: 'Should I try to reach my ideal body weight?', a: 'Not necessarily. IBW is a clinical reference for dosing, not a personal goal. Staying in the healthy BMI range with good waist size, fitness and blood work matters more.' }
  ],
  related: ['bmi-calculator', 'body-fat-calculator', 'calorie-deficit-calculator', 'tidal-volume-calculator', 'protein-calculator'],
  sources: [
    { name: 'Pai MP, Paloucek FP. The origin of the "ideal" body weight equations. Ann Pharmacother 2000', url: 'https://pubmed.ncbi.nlm.nih.gov/10981254/' },
    { name: 'Robinson JD et al. Determination of ideal body weight for drug dosage calculations. Am J Hosp Pharm 1983', url: 'https://pubmed.ncbi.nlm.nih.gov/6869387/' },
    { name: 'CDC: Adult BMI Categories', url: 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html' }
  ],
  disclaimer: 'Ideal body weight formulas are clinical estimates, not personal weight goals or medical advice. Medication doses should be set by a clinician or pharmacist.'
};
