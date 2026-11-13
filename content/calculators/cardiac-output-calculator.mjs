export default {
  slug: 'cardiac-output-calculator',
  hub: 'health',
  name: 'Cardiac Output Calculator',
  title: 'Cardiac Output Calculator: 72 bpm × 70 mL = 5.04 L/min',
  h1: 'Cardiac Output and Cardiac Index Calculator (HR × SV, Fick)',
  meta: 'At 72 bpm and a 70 mL stroke volume, cardiac output is 5.04 L/min. Get cardiac index, ejection fraction, SVR and a Fick estimate, with worked examples.',
  keyword: 'how to calculate cardiac output',
  also: ['cardiac output formula', 'cardiac index calculator', 'how to calculate stroke volume', 'fick cardiac output calculator', 'how to calculate cardiac index'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Calculate from', type: 'select', value: 'hrsv', options: [['hrsv', 'Heart rate × stroke volume'], ['vol', 'Heart rate + EDV and ESV'], ['fick', 'Fick principle (VO₂ and O₂ content)']], wide: true },
    { id: 'hr', label: 'Heart rate', type: 'number', value: 72, suffix: 'bpm' },
    { id: 'sv', label: 'Stroke volume', type: 'number', value: 70, suffix: 'mL', showIf: { method: ['hrsv'] } },
    { id: 'edv', label: 'End-diastolic volume (EDV)', type: 'number', value: 120, suffix: 'mL', showIf: { method: ['vol'] } },
    { id: 'esv', label: 'End-systolic volume (ESV)', type: 'number', value: 50, suffix: 'mL', showIf: { method: ['vol'] } },
    { id: 'vo2', label: 'Oxygen consumption (VO₂)', type: 'number', value: 250, suffix: 'mL/min', showIf: { method: ['fick'] }, help: 'Measured, or estimated as about 125 mL/min per m² of BSA.' },
    { id: 'hb', label: 'Hemoglobin', type: 'number', value: 15, suffix: 'g/dL', showIf: { method: ['fick'] } },
    { id: 'sao2', label: 'Arterial O₂ saturation (SaO₂)', type: 'number', value: 98, suffix: '%', showIf: { method: ['fick'] } },
    { id: 'svo2', label: 'Mixed venous O₂ saturation (SvO₂)', type: 'number', value: 75, suffix: '%', showIf: { method: ['fick'] } },
    { id: 'units', label: 'Height and weight units', type: 'select', value: 'us', options: [['us', 'US (ft, in, lb)'], ['metric', 'Metric (cm, kg)']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 7, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'lb', label: 'Weight', type: 'number', value: 154, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 170, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'kg', label: 'Weight', type: 'number', value: 70, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'map', label: 'Mean arterial pressure (optional)', type: 'number', value: '', suffix: 'mmHg', placeholder: 'for SVR, e.g. 93' },
    { id: 'cvp', label: 'Central venous pressure (optional)', type: 'number', value: '', suffix: 'mmHg', placeholder: 'e.g. 5' }
  ],
  compute(v, H) {
    var co, sv = NaN, ef = NaN, expr, extra = [];
    var hr = v.hr;
    if (v.method === 'fick') {
      if (!(v.vo2 > 0) || !(v.hb > 0) || !(v.sao2 > 0) || !(v.svo2 >= 0)) return { error: 'Enter VO₂, hemoglobin and both oxygen saturations.' };
      if (v.sao2 > 100 || v.svo2 >= v.sao2) return { error: 'SvO₂ must be lower than SaO₂, and saturations cannot exceed 100%.' };
      var ca = 1.34 * v.hb * v.sao2 / 100, cv = 1.34 * v.hb * v.svo2 / 100;
      co = v.vo2 / ((ca - cv) * 10);
      expr = H.num(v.vo2, 0) + ' ÷ (' + H.fix(ca - cv, 2) + ' × 10)';
      extra.push(['Arterial O₂ content (CaO₂)', H.fix(ca, 2) + ' mL/dL']);
      extra.push(['Venous O₂ content (CvO₂)', H.fix(cv, 2) + ' mL/dL']);
      extra.push(['a–v O₂ difference', H.fix(ca - cv, 2) + ' mL/dL']);
      if (hr > 0) sv = co * 1000 / hr;
    } else {
      if (!(hr > 0) || hr > 300) return { error: 'Enter a heart rate between 1 and 300 bpm.' };
      if (v.method === 'vol') {
        if (!(v.edv > 0) || !(v.esv >= 0)) return { error: 'Enter end-diastolic and end-systolic volumes.' };
        if (v.esv >= v.edv) return { error: 'ESV must be smaller than EDV.' };
        sv = v.edv - v.esv; ef = sv / v.edv * 100;
      } else {
        if (!(v.sv > 0)) return { error: 'Enter the stroke volume in mL.' };
        sv = v.sv;
      }
      co = hr * sv / 1000;
      expr = H.num(hr, 0) + ' bpm × ' + H.num(sv, 1) + ' mL';
    }
    var cm = v.units === 'metric' ? v.cm : ((v.ft || 0) * 12 + (v.inch || 0)) * 2.54;
    var kg = v.units === 'metric' ? v.kg : v.lb * 0.45359237;
    var bsa = cm > 0 && kg > 0 ? Math.sqrt(cm * kg / 3600) : NaN;
    var rows = [];
    if (sv > 0) rows.push(['Stroke volume', H.num(sv, 1) + ' mL']);
    if (ef > 0) rows.push(['Ejection fraction (SV ÷ EDV)', H.pct(ef, 1)]);
    if (bsa > 0) {
      rows.push(['Cardiac index (CO ÷ BSA)', H.fix(co / bsa, 2) + ' L/min/m²', true]);
      rows.push(['Body surface area (Mosteller)', H.fix(bsa, 2) + ' m²']);
      if (sv > 0) rows.push(['Stroke volume index', H.num(sv / bsa, 1) + ' mL/m²']);
    }
    rows = rows.concat(extra);
    if (v.map > 0) {
      var cvp = v.cvp >= 0 ? v.cvp : 0;
      rows.push(['SVR = 80 × (MAP − CVP) ÷ CO', H.int(80 * (v.map - cvp) / co) + ' dyn·s/cm⁵']);
    }
    var ci = bsa > 0 ? co / bsa : NaN;
    var sub = co < 4 ? 'Below the usual resting adult range of 4–8 L/min.' : co <= 8 ? 'Within the usual resting adult range of 4–8 L/min.' : 'Above the usual resting range of 4–8 L/min, as expected during exercise, fever, pregnancy or high-output states.';
    if (ci > 0) sub += ci < 2.2 ? ' A cardiac index under 2.2 L/min/m² is one of the criteria used to define cardiogenic shock.' : ci < 2.5 ? ' Cardiac index is slightly below the 2.5–4.0 L/min/m² reference range.' : ci <= 4 ? ' Cardiac index is within the 2.5–4.0 L/min/m² reference range.' : ' Cardiac index is above the 2.5–4.0 L/min/m² reference range.';
    return { value: H.fix(co, 2) + ' L/min', label: 'Cardiac output', expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `Cardiac output equals heart rate times stroke volume. A heart beating <strong>72 times a minute</strong> and ejecting <strong>70 mL</strong> per beat pumps 72 × 70 = 5,040 mL a minute, or <strong>${r.value}</strong>. Dividing by body surface area gives cardiac index: 5.04 ÷ 1.82 m² = 2.77 L/min/m². Normal resting values are 4–8 L/min and 2.5–4.0 L/min/m².`,
  stepsTitle: 'How to calculate cardiac output step by step',
  steps: [
    'Get the heart rate in beats per minute from the monitor, pulse or ECG.',
    'Find stroke volume in mL. If you have echo volumes, stroke volume = end-diastolic volume − end-systolic volume (120 − 50 = 70 mL).',
    'Multiply heart rate by stroke volume, then <strong>divide by 1,000</strong> to convert mL/min to L/min. Forgetting this conversion is the most common exam slip: 72 × 70 = 5,040 mL/min = 5.04 L/min.',
    'For cardiac index, calculate body surface area (Mosteller: √(height cm × weight kg ÷ 3,600)) and divide cardiac output by it.',
    'Compare with reference values: cardiac output 4–8 L/min, cardiac index 2.5–4.0 L/min/m², stroke volume 60–100 mL.'
  ],
  formulaTitle: 'What is the formula for cardiac output?',
  formula: {
    expr: 'CO = HR × SV<br>SV = EDV − ESV  ·  EF = SV ÷ EDV<br>CI = CO ÷ BSA,  BSA = √(cm × kg ÷ 3600)<br>Fick: CO = VO₂ ÷ [(CaO₂ − CvO₂) × 10],  CaO₂ = 1.34 × Hb × SaO₂',
    vars: [['CO', 'cardiac output, L/min'], ['HR', 'heart rate, beats/min'], ['SV', 'stroke volume, mL per beat'], ['EDV / ESV', 'end-diastolic / end-systolic ventricular volume, mL'], ['CI', 'cardiac index, L/min/m²'], ['VO₂', 'oxygen consumption, mL/min'], ['CaO₂ / CvO₂', 'arterial / mixed venous oxygen content, mL O₂ per dL']],
    note: 'The × 10 in the Fick equation converts oxygen content from mL per dL to mL per liter. This calculator leaves out dissolved oxygen (0.003 × PaO₂), which adds only about 0.3 mL/dL at a normal PaO₂. Mosteller\'s body-surface-area formula was published in the New England Journal of Medicine in 1987.'
  },
  example: `<p><strong>From echo volumes:</strong> HR 88 bpm, EDV 140 mL, ESV 80 mL. SV = 140 − 80 = 60 mL; EF = 60 ÷ 140 = 42.9%. CO = 88 × 60 = 5,280 mL/min = <strong>5.28 L/min</strong>.</p>
<p><strong>Cardiac index:</strong> the patient is 180 cm and 95 kg. BSA = √(180 × 95 ÷ 3,600) = √4.75 = 2.18 m². CI = 5.28 ÷ 2.18 = <strong>2.42 L/min/m²</strong>, just under the 2.5 reference floor even though CO looks normal.</p>
<p><strong>Fick:</strong> VO₂ 250 mL/min, Hb 15 g/dL, SaO₂ 98%, SvO₂ 75%. CaO₂ = 1.34 × 15 × 0.98 = 19.70 mL/dL; CvO₂ = 1.34 × 15 × 0.75 = 15.08 mL/dL. CO = 250 ÷ (4.62 × 10) = <strong>5.41 L/min</strong>.</p>`,
  table: {
    title: 'What cardiac output do different heart rates and stroke volumes give?',
    intro: 'Cardiac output in L/min for combinations of heart rate (rows) and stroke volume (columns), computed with CO = HR × SV.',
    head: ['Heart rate', 'SV 50 mL', 'SV 60 mL', 'SV 70 mL', 'SV 80 mL', 'SV 100 mL'],
    rows: ({ run }) => [50, 60, 70, 80, 90, 100, 120, 150].map(hr => [hr + ' bpm', ...[50, 60, 70, 80, 100].map(sv => run({ method: 'hrsv', hr, sv, map: NaN }).value)]),
    note: 'A fast heart rate does not always raise output: when the rate is very high, the ventricle has less time to fill, so stroke volume falls.'
  },
  sections: [
    {
      h2: 'What are normal cardiac output and cardiac index values?',
      html: `<p>Commonly used adult reference values at rest:</p>
<ul>
<li><strong>Cardiac output:</strong> 4–8 L/min</li>
<li><strong>Cardiac index:</strong> 2.5–4.0 L/min/m²</li>
<li><strong>Stroke volume:</strong> 60–100 mL per beat</li>
<li><strong>Ejection fraction:</strong> roughly 50–70%</li>
<li><strong>Systemic vascular resistance:</strong> 800–1,200 dyn·s/cm⁵</li>
</ul>
<p>Cardiac index is preferred for comparing patients because it scales output to body size. A 5 L/min output is generous for a 1.5 m² adult (CI 3.3) and borderline for a 2.3 m² adult (CI 2.2).</p>`
    },
    {
      h2: 'What determines stroke volume?',
      html: `<p>Three factors set how much blood leaves the ventricle with each beat:</p>
<ul>
<li><strong>Preload:</strong> how full the ventricle is at the end of diastole. More stretch produces a stronger contraction, up to a point (the Frank–Starling mechanism). Dehydration and blood loss lower preload.</li>
<li><strong>Afterload:</strong> the resistance the ventricle pumps against. High blood pressure or aortic stenosis raises afterload and reduces stroke volume.</li>
<li><strong>Contractility:</strong> the strength of the muscle itself, increased by adrenaline and inotropes and reduced by heart failure or myocardial infarction.</li>
</ul>
<p>Heart rate is the fourth lever on cardiac output, and the body adjusts rate and stroke volume together through the autonomic nervous system.</p>`
    },
    {
      h2: 'How does the Fick method calculate cardiac output?',
      html: `<p>The Fick principle says the oxygen the body consumes per minute equals the blood flow multiplied by how much oxygen each liter of blood gives up. Rearranged: <strong>flow = oxygen consumption ÷ arteriovenous oxygen difference</strong>.</p>
<p>In practice, VO₂ is measured with expired-gas analysis or, more often, estimated (about 125 mL/min/m²). The venous sample must be mixed venous blood from the pulmonary artery. Because the estimated VO₂ can be off, the "assumed Fick" is less accurate than a measured one, and catheter labs often check it against thermodilution.</p>
<p>A low SvO₂ widens the a–v difference and signals low output: with the same VO₂ and arterial values as above, an SvO₂ of 60% gives a cardiac output of 3.27 L/min.</p>`
    },
    {
      h2: 'How is cardiac output measured in patients?',
      html: `<p>The formula needs inputs someone has measured. Common methods include:</p>
<ul>
<li><strong>Echocardiography:</strong> stroke volume from ventricular volumes or from the outflow-tract velocity–time integral.</li>
<li><strong>Thermodilution:</strong> cold saline injected through a pulmonary artery catheter; the temperature change downstream gives flow.</li>
<li><strong>Fick:</strong> oxygen consumption and blood gases, as above.</li>
<li><strong>Arterial pulse-contour devices:</strong> estimate stroke volume continuously from the arterial waveform.</li>
</ul>
<p>Each method has its own error, so trends in the same patient are usually more useful than a single number.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for cardiac output?', a: 'Cardiac output = heart rate × stroke volume. At 72 bpm and 70 mL per beat, CO = 5,040 mL/min, or 5.04 L/min.' },
    { q: 'How do you calculate stroke volume from cardiac output?', a: 'Divide cardiac output by heart rate. A cardiac output of 6 L/min at 80 bpm is 6,000 ÷ 80 = 75 mL per beat.' },
    { q: 'What is the difference between cardiac output and cardiac index?', a: 'Cardiac index is cardiac output divided by body surface area. It lets you compare people of different sizes; the normal range is 2.5–4.0 L/min/m².' },
    { q: 'How do you calculate ejection fraction?', a: 'Ejection fraction = stroke volume ÷ end-diastolic volume × 100. With EDV 120 mL and ESV 50 mL, SV is 70 mL and EF is 58.3%.' },
    { q: 'How do you calculate SVR from cardiac output?', a: 'SVR = 80 × (MAP − CVP) ÷ CO. With MAP 93 mmHg, CVP 5 mmHg and CO 5 L/min, SVR is 1,408 dyn·s/cm⁵. Enter MAP and CVP in the calculator to see it.' },
    { q: 'What is a low cardiac output?', a: 'A resting cardiac output below about 4 L/min, or a cardiac index below 2.5 L/min/m², is generally considered low. A cardiac index under 2.2 is one of the criteria used for cardiogenic shock.' },
    { q: 'Why does cardiac output rise during exercise?', a: 'Working muscles need more oxygen, so heart rate climbs and stroke volume increases through greater filling and stronger contraction. Output can rise to several times its resting value during hard exercise.' }
  ],
  related: ['map-calculator', 'ecg-heart-rate-calculator', 'max-heart-rate-calculator', 'tidal-volume-calculator'],
  sources: [
    { name: 'StatPearls (NCBI Bookshelf): Physiology, Cardiac Output', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470455/' },
    { name: 'StatPearls (NCBI Bookshelf): Physiology, Stroke Volume', url: 'https://www.ncbi.nlm.nih.gov/books/NBK547686/' },
    { name: 'StatPearls (NCBI Bookshelf): Calculating Fick Cardiac Output and Input', url: 'https://www.ncbi.nlm.nih.gov/books/NBK606091/' },
    { name: 'Mosteller RD. Simplified calculation of body-surface area. NEJM 1987 (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/3657876/' }
  ],
  disclaimer: 'Educational tool for students and clinicians in training. It is not a monitoring device and must not guide treatment of a real patient.'
};
