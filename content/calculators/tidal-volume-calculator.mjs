export default {
  slug: 'tidal-volume-calculator',
  hub: 'health',
  name: 'Tidal Volume Calculator',
  title: 'Tidal Volume Calculator: 6 mL/kg for a 5\'10" Man Is 438 mL',
  h1: 'Tidal Volume Calculator Using ARDSnet Predicted Body Weight',
  meta: 'A 5 ft 10 in man has a predicted body weight of 73 kg, so 6 mL/kg gives a tidal volume of 438 mL. Get the 4–8 mL/kg range plus minute and alveolar ventilation.',
  keyword: 'how do you calculate tidal volume',
  also: ['how is tidal volume calculated', 'how to calculate tidal volume for ventilator', 'ardsnet tidal volume calculator', 'predicted body weight calculator', 'how to calculate alveolar ventilation', 'how to calculate mean tidal volume from a spirometer trace'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sex', label: 'Sex (sets the PBW formula)', type: 'select', value: 'm', options: [['m', 'Male'], ['f', 'Female']] },
    { id: 'units', label: 'Height units', type: 'select', value: 'us', options: [['us', 'Feet and inches'], ['metric', 'Centimeters']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 10, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 178, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'mlkg', label: 'Target tidal volume', type: 'select', value: '6', options: [['4', '4 mL/kg (minimum in protocol)'], ['5', '5 mL/kg'], ['6', '6 mL/kg (ARDSnet target)'], ['7', '7 mL/kg'], ['8', '8 mL/kg (initial setting)']] },
    { id: 'rr', label: 'Respiratory rate (optional)', type: 'number', value: 16, suffix: 'breaths/min' }
  ],
  compute(v, H) {
    var inches = v.units === 'metric' ? v.cm / 2.54 : (v.ft || 0) * 12 + (v.inch || 0);
    if (!(inches > 0)) return { error: 'Enter the patient\'s height.' };
    if (inches < 48 || inches > 96) return { error: 'Enter a height between 4 ft (122 cm) and 8 ft (244 cm); the PBW formula is for adults.' };
    var pbw = (v.sex === 'f' ? 45.5 : 50) + 2.3 * (inches - 60);
    var k = Number(v.mlkg) || 6;
    var vt = k * pbw;
    var rows = [
      ['Predicted body weight', H.num(pbw, 1) + ' kg (' + H.num(pbw / 0.45359237, 0) + ' lb)', true],
      ['Range at 4–8 mL/kg', H.int(4 * pbw) + '–' + H.int(8 * pbw) + ' mL'],
      ['6 mL/kg (ARDSnet goal)', H.int(6 * pbw) + ' mL'],
      ['Height used', H.num(inches, 1) + ' in (' + H.num(inches * 2.54, 1) + ' cm)']
    ];
    var sub = 'Check plateau pressure: the ARDSnet protocol keeps it at 30 cm H₂O or less.';
    if (v.rr > 0) {
      var ds = 2.2 * pbw;
      rows.push(['Minute ventilation (VT × RR)', H.fix(vt * v.rr / 1000, 1) + ' L/min']);
      rows.push(['Alveolar ventilation, dead space ≈ ' + H.int(ds) + ' mL', H.fix((vt - ds) * v.rr / 1000, 1) + ' L/min']);
      if (v.rr > 35) sub = 'The ARDSnet protocol caps the set rate at 35 breaths per minute.';
    }
    return {
      value: H.int(vt) + ' mL',
      label: 'Tidal volume at ' + k + ' mL/kg PBW',
      expr: k + ' mL/kg × ' + H.num(pbw, 1) + ' kg',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `Tidal volume for ventilation is set from predicted body weight (PBW), not actual weight. For men, PBW = 50 + 2.3 × (height in inches − 60); for women, start at 45.5. A <strong>5 ft 10 in</strong> man has a PBW of 50 + 2.3 × 10 = 73 kg, so the ARDSnet target of 6 mL/kg is 6 × 73 = <strong>${r.value}</strong>. The protocol range is 4–8 mL/kg.`,
  stepsTitle: 'How to calculate tidal volume for a ventilator',
  steps: [
    'Measure height accurately; it drives the whole calculation. Convert to inches (cm ÷ 2.54) if needed.',
    'Calculate predicted body weight: men 50 + 2.3 × (inches − 60), women 45.5 + 2.3 × (inches − 60). <strong>Do not use the patient\'s actual weight</strong>; a 120 kg patient who is 5 ft 10 in still has 73 kg lungs.',
    'Multiply PBW by the target volume. ARDSnet starts at 8 mL/kg and reduces by 1 mL/kg at intervals of 2 hours or less until reaching 6 mL/kg.',
    'Set the respiratory rate to approximate the patient\'s baseline minute ventilation (no more than 35 breaths/min) and check minute ventilation = VT × RR.',
    'Measure plateau pressure. If it is above 30 cm H₂O, the protocol lowers tidal volume in 1 mL/kg steps to a minimum of 4 mL/kg.'
  ],
  formulaTitle: 'What is the tidal volume formula?',
  formula: {
    expr: 'PBW (men) = 50 + 2.3 × (height in − 60)<br>PBW (women) = 45.5 + 2.3 × (height in − 60)<br>VT = target mL/kg × PBW<br>V̇E = VT × RR  ·  V̇A = (VT − VD) × RR',
    vars: [['PBW', 'predicted body weight, kg'], ['VT', 'tidal volume, mL per breath'], ['RR', 'respiratory rate, breaths per minute'], ['V̇E', 'minute ventilation'], ['VD', 'dead space volume, estimated here as 2.2 mL/kg PBW (about 1 mL per lb)'], ['V̇A', 'alveolar ventilation']],
    note: 'In centimeters the PBW formulas become 50 (or 45.5) + 0.91 × (height cm − 152.4). The 2.2 mL/kg dead-space figure is a classroom estimate of anatomic dead space; ventilated patients often have more because of the circuit and lung disease.'
  },
  example: `<p>A woman who is <strong>5 ft 4 in</strong> (64 in) and weighs 95 kg is intubated for ARDS.</p>
<p>PBW = 45.5 + 2.3 × (64 − 60) = 45.5 + 9.2 = <strong>54.7 kg</strong>. Initial VT at 8 mL/kg = 437.6, about <strong>438 mL</strong>; the 6 mL/kg goal = <strong>328 mL</strong>. Using her actual weight would have given 570 mL at 6 mL/kg, roughly 10 mL/kg of her predicted lung size.</p>
<p>At 6 mL/kg and a rate of 20: minute ventilation = 328 × 20 = 6.6 L/min. Dead space ≈ 2.2 × 54.7 = 120 mL, so alveolar ventilation ≈ (328 − 120) × 20 = 4.2 L/min.</p>`,
  table: {
    title: 'What tidal volume does each height get at 6 and 8 mL/kg?',
    intro: 'Predicted body weight and tidal volume by height for men and women, using the ARDSnet formulas in the calculator above.',
    head: ['Height', 'PBW men', '6 mL/kg men', '8 mL/kg men', 'PBW women', '6 mL/kg women', '8 mL/kg women'],
    rows: ({ run }) => [58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78].map(i => {
      const ft = Math.floor(i / 12), inch = i % 12;
      const base = { units: 'us', ft, inch, rr: NaN };
      const pm = 50 + 2.3 * (i - 60), pf = 45.5 + 2.3 * (i - 60);
      return [ft + "' " + inch + '"', pm.toFixed(1) + ' kg', run({ ...base, sex: 'm', mlkg: '6' }).value, run({ ...base, sex: 'm', mlkg: '8' }).value, pf.toFixed(1) + ' kg', run({ ...base, sex: 'f', mlkg: '6' }).value, run({ ...base, sex: 'f', mlkg: '8' }).value];
    }),
    note: 'Rounded to the nearest mL. Ventilators deliver in steps, so the set value is usually rounded to the nearest 10 mL.'
  },
  sections: [
    {
      h2: 'Why is tidal volume based on predicted body weight?',
      html: `<p>Lung size depends mainly on height and sex, not on body fat or muscle. Two 5 ft 10 in men weighing 70 kg and 140 kg have similar lungs, so setting volume from actual weight would give the heavier man twice the volume for the same lung capacity and overstretch the alveoli.</p>
<p>Predicted body weight approximates the weight a person of that height and sex would have at a lean build. The ARDSnet equations are close to the Devine formula used for drug dosing; for general healthy-weight ranges, use the <a href="/ideal-weight-calculator">ideal weight calculator</a> instead.</p>`
    },
    {
      h2: 'What did the ARDSNet low tidal volume trial show?',
      html: `<p>The 2000 ARDS Network trial in the New England Journal of Medicine randomized 861 patients with acute lung injury or ARDS to an initial tidal volume of 12 mL/kg PBW (plateau pressure up to 50 cm H₂O) or 6 mL/kg (plateau pressure up to 30). It stopped early because mortality was lower with 6 mL/kg: <strong>31.0% versus 39.8%</strong>. The low-volume group also had more ventilator-free days over the first 28 days.</p>
<p>That result is why 6 mL/kg PBW with a plateau pressure of 30 cm H₂O or less became the standard lung-protective target, summarized on the NIH NHLBI ARDS Network protocol card.</p>`
    },
    {
      h2: 'How do you calculate minute ventilation and alveolar ventilation?',
      html: `<p><strong>Minute ventilation</strong> is the total air moved per minute: tidal volume × respiratory rate. 500 mL × 12 breaths = 6,000 mL, or 6.0 L/min.</p>
<p><strong>Alveolar ventilation</strong> removes the part of each breath that stays in the airways (dead space) and never reaches the alveoli: (VT − VD) × RR. With 150 mL of dead space, (500 − 150) × 12 = 4.2 L/min. Because dead space is fixed per breath, rapid shallow breathing wastes more: 250 mL × 24 is still 6.0 L/min of minute ventilation, but only (250 − 150) × 24 = 2.4 L/min reaches the alveoli.</p>`
    },
    {
      h2: 'How do you find tidal volume on a spirometer trace?',
      html: `<p>On a spirogram, quiet breathing appears as small regular waves. Tidal volume is the vertical distance from the trough (end of expiration) to the peak (end of inspiration) of one wave, read off the volume axis. For the <strong>mean tidal volume</strong>, measure several consecutive quiet breaths and average them: waves of 480, 520 and 500 mL give a mean of 500 mL.</p>
<p>Multiply the mean by the breathing rate counted on the time axis to get minute ventilation. StatPearls gives typical resting tidal volumes of about 500 mL in adult men and 400 mL in adult women.</p>`
    }
  ],
  faq: [
    { q: 'What is a normal tidal volume?', a: 'At rest, a typical adult tidal volume is about 500 mL in men and 400 mL in women. For mechanical ventilation in ARDS the target is 6 mL/kg of predicted body weight.' },
    { q: 'Why not use actual body weight for tidal volume?', a: 'Lungs scale with height and sex, not weight. Using actual weight in a heavy patient delivers too much volume per breath and raises the risk of ventilator-induced lung injury.' },
    { q: 'What is the predicted body weight of a 5 ft 4 in woman?', a: '45.5 + 2.3 × 4 = 54.7 kg, which gives a tidal volume of about 328 mL at 6 mL/kg and 438 mL at 8 mL/kg.' },
    { q: 'How do you calculate PBW in centimeters?', a: 'Men: 50 + 0.91 × (height cm − 152.4). Women: 45.5 + 0.91 × (height cm − 152.4). A 178 cm man has a PBW of about 73 kg.' },
    { q: 'What plateau pressure goes with low tidal volume ventilation?', a: 'The ARDSnet protocol aims for a plateau pressure of 30 cm H₂O or less, measured with a 0.5-second inspiratory pause, and lowers tidal volume toward 4 mL/kg if it is higher.' },
    { q: 'Is 8 mL/kg too high?', a: '8 mL/kg PBW is the protocol\'s starting point, not its goal; it is reduced by 1 mL/kg steps to 6 mL/kg. The protocol allows 7–8 mL/kg for breath stacking or dyssynchrony if plateau pressure stays under 30.' },
    { q: 'How do you calculate tidal volume from minute ventilation?', a: 'Divide minute ventilation by respiratory rate. 7.2 L/min at 16 breaths per minute is 7,200 ÷ 16 = 450 mL per breath.' }
  ],
  related: ['ideal-weight-calculator', 'cardiac-output-calculator', 'map-calculator', 'iv-drip-rate-calculator'],
  sources: [
    { name: 'NIH NHLBI ARDS Clinical Network: Mechanical Ventilation Protocol Summary (PDF)', url: 'http://www.ardsnet.org/files/ventilator_protocol_2008-07.pdf' },
    { name: 'ARDS Network 2000, NEJM: Ventilation with lower tidal volumes (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/10793162/' },
    { name: 'StatPearls (NCBI Bookshelf): Physiology, Tidal Volume', url: 'https://www.ncbi.nlm.nih.gov/books/NBK482502/' }
  ],
  disclaimer: 'Teaching tool for respiratory, nursing and medical students. Ventilator settings must be chosen by the treating team at the bedside.'
};
