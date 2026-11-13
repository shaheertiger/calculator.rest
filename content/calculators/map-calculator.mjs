export default {
  slug: 'map-calculator',
  hub: 'health',
  name: 'Mean Arterial Pressure Calculator',
  title: 'MAP Calculator: 120/80 Gives a Mean Arterial Pressure of 93',
  h1: 'Mean Arterial Pressure (MAP) Calculator With Formula and Ranges',
  meta: 'A blood pressure of 120/80 mmHg has a MAP of 93.3 mmHg: (120 + 2 × 80) ÷ 3. Enter any reading to get MAP, pulse pressure and a heart-rate-adjusted value.',
  keyword: 'how do you calculate map',
  also: ['how to calculate arterial pressure', 'mean arterial pressure calculator', 'map calculator', 'how to calculate average blood pressure', 'map formula nursing'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sbp', label: 'Systolic pressure (top number)', type: 'number', value: 120, suffix: 'mmHg' },
    { id: 'dbp', label: 'Diastolic pressure (bottom number)', type: 'number', value: 80, suffix: 'mmHg' },
    { id: 'hr', label: 'Heart rate (optional)', type: 'number', value: '', suffix: 'bpm', placeholder: 'e.g. 110', help: 'Adds the heart-rate-corrected MAP (Razminia formula).' }
  ],
  compute(v, H) {
    var s = v.sbp, d = v.dbp;
    if (!(s > 0) || !(d > 0)) return { error: 'Enter both the systolic and diastolic pressure.' };
    if (s > 300 || d > 200) return { error: 'Check the reading: values above 300/200 mmHg are not plausible.' };
    if (d >= s) return { error: 'Diastolic pressure must be lower than systolic pressure.' };
    var pp = s - d;
    var map = (s + 2 * d) / 3;
    var rows = [
      ['Pulse pressure (SBP − DBP)', H.num(pp, 0) + ' mmHg'],
      ['Check: DBP + ⅓ × PP', H.num(d, 0) + ' + ' + H.num(pp / 3, 1) + ' = ' + H.fix(map, 1)],
      ['Simple average of SBP and DBP (not MAP)', H.fix((s + d) / 2, 1) + ' mmHg']
    ];
    if (v.hr > 0 && v.hr < 300) {
      var k = 0.33 + v.hr * 0.0012;
      rows.push(['Heart-rate-corrected MAP', H.fix(d + k * pp, 1) + ' mmHg (factor ' + H.fix(k, 3) + ')', true]);
    }
    var sub;
    if (map < 60) sub = 'Below 60 mmHg: blood flow to the brain, heart and kidneys may not be adequate. This needs prompt medical assessment.';
    else if (map < 65) sub = 'Below 65 mmHg, the usual minimum target for adults in septic shock.';
    else if (map < 70) sub = 'Just under the commonly cited normal range of 70–100 mmHg.';
    else if (map <= 100) sub = 'Within the commonly cited normal range of 70–100 mmHg.';
    else sub = 'Above 100 mmHg, which usually reflects high blood pressure. Hypertension is diagnosed from systolic and diastolic readings, not MAP.';
    return {
      value: H.fix(map, 1) + ' mmHg',
      label: 'Mean arterial pressure',
      expr: '(' + H.num(s, 0) + ' + 2 × ' + H.num(d, 0) + ') ÷ 3',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate MAP, double the diastolic pressure, add the systolic pressure and divide by 3. For a reading of <strong>120/80 mmHg</strong> that is (120 + 160) ÷ 3 = <strong>${r.value}</strong>. Equivalently, add one-third of the pulse pressure (40 ÷ 3 = 13.3) to the diastolic value. Normal MAP is about 70–100 mmHg.`,
  stepsTitle: 'How to calculate mean arterial pressure by hand',
  steps: [
    'Take the blood pressure reading: systolic (top) and diastolic (bottom), both in mmHg.',
    'Multiply the diastolic pressure by 2. For 120/80 that gives 160.',
    'Add the systolic pressure: 160 + 120 = 280.',
    'Divide by 3: 280 ÷ 3 = <strong>93.3 mmHg</strong>. The common mistake is to average the two numbers, which gives 100 and overstates MAP because the heart spends longer in diastole than in systole.',
    'Optional: enter the heart rate to see the heart-rate-corrected value, which matters most above about 100 bpm.'
  ],
  formulaTitle: 'What is the formula for mean arterial pressure?',
  formula: {
    expr: 'MAP = (SBP + 2 × DBP) ÷ 3<br>MAP = DBP + ⅓ × (SBP − DBP)<br>HR-corrected MAP = DBP + [0.33 + (HR × 0.0012)] × (SBP − DBP)',
    vars: [['SBP', 'systolic blood pressure, mmHg'], ['DBP', 'diastolic blood pressure, mmHg'], ['SBP − DBP', 'pulse pressure (PP)'], ['HR', 'heart rate, beats per minute']],
    note: 'The first two lines are the same equation written two ways; StatPearls gives the second form. The heart-rate-corrected version comes from Razminia et al. (2004), who validated it against central aortic catheter readings. Physiologically, MAP ≈ cardiac output × systemic vascular resistance + central venous pressure.'
  },
  example: `<p>A nursing student charts a blood pressure of <strong>138/88 mmHg</strong>.</p>
<p>Pulse pressure = 138 − 88 = 50. One-third of 50 is 16.7. MAP = 88 + 16.7 = <strong>104.7 mmHg</strong>, which is above the 70–100 range.</p>
<p>A septic patient reads <strong>86/48 mmHg</strong>: (86 + 2 × 48) ÷ 3 = 182 ÷ 3 = <strong>60.7 mmHg</strong>, below the 65 mmHg target used for septic shock.</p>
<p>The same 86/48 at a heart rate of 125: factor = 0.33 + 125 × 0.0012 = 0.48, so MAP = 48 + 0.48 × 38 = <strong>66.2 mmHg</strong>. At fast heart rates the standard formula reads lower than the corrected one.</p>`,
  table: {
    title: 'What is the MAP for common blood pressure readings?',
    intro: 'Mean arterial pressure for typical readings, calculated with the standard (SBP + 2 × DBP) ÷ 3 formula above.',
    head: ['Blood pressure', 'Pulse pressure', 'MAP', 'Where it falls'],
    rows: ({ run }) => [[70, 40], [80, 50], [90, 60], [100, 60], [110, 70], [120, 80], [130, 85], [140, 90], [150, 95], [160, 100], [180, 110], [200, 120]].map(([s, d]) => {
      const r = run({ sbp: s, dbp: d, hr: NaN });
      const m = (s + 2 * d) / 3;
      return [s + '/' + d, (s - d) + ' mmHg', r.value, m < 60 ? 'Below 60: hypoperfusion risk' : m < 65 ? 'Below 65 sepsis target' : m < 70 ? 'Low' : m <= 100 ? 'Normal range' : 'High'];
    }),
    note: 'Ranges are general adult reference points, not diagnostic cut-offs. Children have lower normal values that vary with age.'
  },
  sections: [
    {
      h2: 'Why does diastolic pressure count twice in the MAP formula?',
      html: `<p>MAP is the time-weighted average pressure across one heartbeat, not the midpoint of the two numbers. At a resting heart rate, the ventricles spend roughly one-third of each cycle contracting (systole) and two-thirds relaxing and filling (diastole). The artery therefore sits closer to the diastolic pressure for most of the beat, so diastolic gets twice the weight.</p>
<p>That ratio changes with heart rate. As the rate climbs, diastole shortens more than systole and the true average drifts toward systolic. Razminia's correction raises the weighting factor from 0.33 to 0.45 at 100 bpm and 0.47 at 120 bpm. For a reading of 100/60 at 120 bpm, the standard formula gives 73.3 mmHg and the corrected one 79.0 mmHg.</p>`
    },
    {
      h2: 'What is a normal MAP, and how low is too low?',
      html: `<p>A MAP of about <strong>70 to 100 mmHg</strong> is the range usually quoted for healthy adults. The thresholds that matter clinically sit below it:</p>
<ul>
<li><strong>Below about 60 mmHg:</strong> the brain, heart muscle and kidneys may not receive enough blood flow. Sustained values in this range are associated with organ injury.</li>
<li><strong>65 mmHg:</strong> the initial target the Surviving Sepsis Campaign (2021) recommends for adults with septic shock who need vasopressors.</li>
<li><strong>Above 100 mmHg:</strong> usually means blood pressure is high. A reading of 140/90 already gives 106.7 mmHg.</li>
</ul>
<p>There is no official "high MAP" diagnosis. The American Heart Association classifies blood pressure using systolic and diastolic readings, so use those numbers when you talk about hypertension.</p>`
    },
    {
      h2: 'Is mean arterial pressure the same as average blood pressure?',
      html: `<p>No. "Average blood pressure" usually means averaging several separate readings, such as a week of home measurements: add the systolic numbers and divide by the count, then do the same for diastolic. Three readings of 128/82, 124/80 and 132/84 average to 128/82.</p>
<p>MAP is a single number derived from one reading. You can calculate a MAP from that averaged reading: (128 + 2 × 82) ÷ 3 = 97.3 mmHg. Home blood pressure guidance focuses on the averaged systolic and diastolic values, not MAP.</p>`
    },
    {
      h2: 'How do cardiac output and vascular resistance set MAP?',
      html: `<p>Pressure in the arteries depends on how much blood the heart pumps and how hard it is to push that blood through the vessels: <strong>MAP ≈ CO × SVR + CVP</strong>, where CO is cardiac output, SVR is systemic vascular resistance and CVP is central venous pressure (often close to zero and dropped in simple versions).</p>
<p>Rearranged, it lets ICU teams estimate resistance: SVR = 80 × (MAP − CVP) ÷ CO, in dyn·s/cm⁵. With a MAP of 93, CVP of 5 and cardiac output of 5 L/min, SVR = 80 × 88 ÷ 5 = 1,408 dyn·s/cm⁵. Work out the cardiac output first with the <a href="/cardiac-output-calculator">cardiac output calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the MAP for 120/80?', a: 'The MAP for 120/80 mmHg is 93.3 mmHg: (120 + 2 × 80) ÷ 3 = 280 ÷ 3. That sits in the middle of the usual 70–100 mmHg range.' },
    { q: 'Is a MAP of 65 good?', a: 'A MAP of 65 mmHg is the minimum target used for adults in septic shock, not a typical healthy value. Most healthy adults run between 70 and 100 mmHg at rest.' },
    { q: 'Why is MAP not just the average of systolic and diastolic?', a: 'Because the heart spends about twice as long in diastole as in systole at rest. A simple average of 120 and 80 gives 100; the time-weighted MAP is 93.3.' },
    { q: 'Does a blood pressure monitor calculate MAP with this formula?', a: 'Often not. Automated oscillometric cuffs measure MAP directly as the point of maximum cuff oscillation and estimate systolic and diastolic from it, and arterial lines integrate the whole waveform. Their MAP can differ by a few mmHg from the formula.' },
    { q: 'What is pulse pressure?', a: 'Pulse pressure is systolic minus diastolic. For 120/80 it is 40 mmHg. MAP equals diastolic pressure plus one-third of the pulse pressure.' },
    { q: 'Can I use the MAP formula for children?', a: 'Yes, the formula is the same, but normal values are lower in infants and children and depend on age, so compare against pediatric reference ranges rather than the adult 70–100 mmHg.' },
    { q: 'What MAP is considered high?', a: 'Values above about 100 mmHg usually indicate high blood pressure; 160/100 gives a MAP of 120 mmHg. Clinicians still diagnose hypertension from the systolic and diastolic numbers.' }
  ],
  related: ['cardiac-output-calculator', 'ecg-heart-rate-calculator', 'iv-drip-rate-calculator', 'tidal-volume-calculator'],
  sources: [
    { name: 'StatPearls (NCBI Bookshelf): Physiology, Mean Arterial Pressure', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538226/' },
    { name: 'Razminia et al. 2004: Validation of a new formula for mean arterial pressure calculation (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/15558774/' },
    { name: 'Evans et al. 2021: Surviving Sepsis Campaign international guidelines (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/34605781/' },
    { name: 'American Heart Association: Understanding Blood Pressure Readings', url: 'https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings' }
  ],
  disclaimer: 'For education and exam practice only. Not for diagnosing or treating patients; clinical decisions belong to qualified professionals using measured values.'
};
