export default {
  slug: 'vo2-max-calculator',
  hub: 'health',
  name: 'VO2 Max Calculator',
  title: 'VO2 Max Calculator: HR 185/60 Gives 47.2 ml/kg/min (Uth)',
  h1: 'VO2 Max Calculator: Estimate Aerobic Fitness From Heart Rate or a Run Test',
  meta: 'A max heart rate of 185 and resting rate of 60 give a VO2 max of 15.3 × 185 ÷ 60 = 47.2 ml/kg/min. Or use a 12-minute or 1.5-mile run, then compare age norms.',
  keyword: 'how to calculate vo2 max',
  also: ['vo2 max calculator', 'how to calculate vo2 max from heart rate', 'cooper test calculator', '1.5 mile run vo2 max', 'good vo2 max for age', 'vo2 max chart'],
  updated: '2026-11-13',
  inputs: [
    { id: 'm', label: 'Method', type: 'select', value: 'uth', wide: true, options: [['uth', 'Heart rate ratio (Uth): max and resting heart rate'], ['cooper', 'Cooper 12-minute run: distance covered'], ['run15', '1.5-mile run: finish time']] },
    { id: 'sex', label: 'Sex (for age norms)', type: 'select', value: 'male', options: [['male', 'Male'], ['female', 'Female']] },
    { id: 'age', label: 'Age', type: 'number', value: 35, suffix: 'years' },
    { id: 'hrmax', label: 'Maximum heart rate', type: 'number', value: 185, suffix: 'bpm', showIf: { m: ['uth'] }, help: 'Measured if possible. Leave blank to use 208 − 0.7 × age.' },
    { id: 'hrrest', label: 'Resting heart rate', type: 'number', value: 60, suffix: 'bpm', showIf: { m: ['uth'] } },
    { id: 'dist', label: 'Distance in 12 minutes', type: 'number', value: 2400, showIf: { m: ['cooper'] } },
    { id: 'du', label: 'Distance unit', type: 'select', value: 'm', options: [['m', 'meters'], ['mi', 'miles']], showIf: { m: ['cooper'] } },
    { id: 'mins', label: '1.5-mile time: minutes', type: 'number', value: 12, suffix: 'min', showIf: { m: ['run15'] } },
    { id: 'secs', label: 'seconds', type: 'number', value: 0, suffix: 's', showIf: { m: ['run15'] } }
  ],
  data: {
    ages: ['20–29', '30–39', '40–49', '50–59', '60–69', '70–79'],
    p: [5, 10, 25, 50, 75, 90, 95],
    male: [[29.0, 32.1, 40.1, 48.0, 55.2, 61.8, 66.3], [27.2, 30.2, 35.9, 42.4, 49.2, 56.5, 59.8], [24.2, 26.8, 31.9, 37.8, 45.0, 52.1, 55.6], [20.9, 22.8, 27.1, 32.6, 39.7, 45.6, 50.7], [17.4, 19.8, 23.7, 28.2, 34.5, 40.3, 43.0], [16.3, 17.1, 20.4, 24.4, 30.4, 36.6, 39.7]],
    female: [[21.7, 23.9, 30.5, 37.6, 44.7, 51.3, 56.0], [19.0, 20.9, 25.3, 30.2, 36.1, 41.4, 45.8], [17.0, 18.8, 22.1, 26.7, 32.4, 38.4, 41.7], [16.0, 17.3, 19.9, 23.4, 27.6, 32.0, 35.9], [13.4, 14.6, 17.2, 20.0, 23.8, 27.0, 29.4], [13.1, 13.6, 15.6, 18.3, 20.8, 23.1, 24.1]]
  },
  compute(v, H, D) {
    var vo, expr, rows = [];
    if (!(v.age >= 13 && v.age <= 100)) return { error: 'Enter an age from 13 to 100.' };
    if (v.m === 'cooper') {
      var dm = v.du === 'mi' ? v.dist * 1609.344 : v.dist;
      if (!(dm >= 800 && dm <= 5000)) return { error: 'Enter the distance covered in 12 minutes (800–5,000 m, or 0.5–3.1 miles).' };
      vo = (dm - 504.9) / 44.73;
      expr = '(' + H.int(dm) + ' m − 504.9) ÷ 44.73';
      rows.push(['Distance', H.int(dm) + ' m (' + H.fix(dm / 1609.344, 2) + ' mi)']);
    } else if (v.m === 'run15') {
      var t = (v.mins > 0 ? v.mins : 0) + (v.secs > 0 ? v.secs : 0) / 60;
      if (!(t >= 6 && t <= 40)) return { error: 'Enter a 1.5-mile time between 6 and 40 minutes.' };
      vo = 3.5 + 483 / t;
      expr = '3.5 + 483 ÷ ' + H.fix(t, 2) + ' min';
      var pace = t / 1.5, pm = Math.floor(pace), ps = Math.round((pace - pm) * 60);
      if (ps === 60) { pm++; ps = 0; }
      rows.push(['Average pace', pm + ':' + (ps < 10 ? '0' : '') + ps + ' per mile']);
    } else {
      var mx = v.hrmax >= 100 && v.hrmax <= 240 ? v.hrmax : 208 - 0.7 * v.age;
      if (!(v.hrrest >= 30 && v.hrrest <= 110)) return { error: 'Enter a resting heart rate between 30 and 110 bpm.' };
      if (!(mx > v.hrrest)) return { error: 'Max heart rate must be higher than resting heart rate.' };
      vo = 15.3 * mx / v.hrrest;
      expr = '15.3 × ' + H.int(mx) + ' ÷ ' + H.int(v.hrrest);
      rows.push(['HRmax ÷ HRrest', H.fix(mx / v.hrrest, 2) + (v.hrmax >= 100 ? '' : ' (max from 208 − 0.7 × age)')]);
    }
    if (!(vo > 5)) return { error: 'That result is too low to be valid. Check your inputs.' };
    rows.push(['METs (VO2 max ÷ 3.5)', H.fix(vo / 3.5, 1)]);
    var gi = Math.min(5, Math.max(0, Math.floor((v.age - 20) / 10)));
    var tab = (v.sex === 'female' ? D.female : D.male)[gi];
    var pct;
    if (vo <= tab[0]) pct = 'below the 5th';
    else if (vo >= tab[6]) pct = 'above the 95th';
    else { for (var i = 0; i < 6; i++) if (vo < tab[i + 1]) { pct = 'about the ' + H.ord(Math.round(D.p[i] + (D.p[i + 1] - D.p[i]) * (vo - tab[i]) / (tab[i + 1] - tab[i]))); break; } }
    rows.push(['FRIEND median, ' + (v.sex === 'female' ? 'women ' : 'men ') + D.ages[gi], H.fix(tab[3], 1) + ' ml/kg/min']);
    rows.push(['Your rank in that group', pct + ' percentile', true]);
    var mets = vo / 3.5;
    var band = mets < 7.9 ? 'low' : mets < 10.9 ? 'intermediate' : 'high';
    return {
      value: H.fix(vo, 1) + ' ml/kg/min',
      label: 'Estimated VO2 max',
      expr: expr,
      rows: rows,
      sub: 'That is ' + H.fix(mets, 1) + ' METs, ' + band + ' fitness in the Kodama 2009 meta-analysis (low < 7.9, high ≥ 10.9 METs). Field estimates are typically within about 3–5 ml/kg/min of a lab test.',
      vo: vo
    };
  },
  quick: ({ r }) => `The simplest way to calculate VO2 max at home is the Uth heart rate ratio: VO2 max ≈ 15.3 × (max heart rate ÷ resting heart rate). With a max of 185 bpm and a resting rate of 60 bpm, that is 15.3 × 3.08 = <strong>${r.value}</strong>, above the median of 42.4 for men aged 30–39 in the FRIEND registry. A 12-minute run or 1.5-mile time also works.`,
  stepsTitle: 'How to calculate your VO2 max',
  steps: [
    '<strong>Heart rate method:</strong> measure your resting heart rate on waking, and use a measured max heart rate (or 208 − 0.7 × age). Divide max by resting and multiply by 15.3: 185 ÷ 60 × 15.3 = 47.2.',
    '<strong>Cooper 12-minute run:</strong> after a warm-up, cover as much distance as you can in 12 minutes on a track. VO2 max = (meters − 504.9) ÷ 44.73. 2,400 m gives 42.4.',
    '<strong>1.5-mile run:</strong> run 1.5 miles (6 laps of a 400 m track plus 14 m) as fast as you can. VO2 max = 3.5 + 483 ÷ time in minutes. 12:00 gives 43.8.',
    'Compare the result with age and sex norms (table below). Run tests reward pacing, so the most common error is starting too fast and fading; a second attempt a few weeks later is usually more accurate.',
    'Only do the run tests if you are healthy and already exercise regularly. Otherwise, use the resting heart rate method or ask about a supervised test.'
  ],
  formulaTitle: 'What are the VO2 max formulas?',
  formula: {
    expr: 'Uth (2004): VO2 max = 15.3 × HRmax ÷ HRrest<br>Cooper (1968): VO2 max = (distance in m − 504.9) ÷ 44.73<br>1.5-mile run (ACSM): VO2 max = 3.5 + 483 ÷ time (min)',
    vars: [['VO2 max', 'maximal oxygen uptake in ml of oxygen per kg of body weight per minute'], ['HRmax, HRrest', 'maximum and resting heart rate (bpm)'], ['1 MET', '3.5 ml/kg/min, the resting oxygen use of an average adult']],
    note: 'Uth\'s team found the 15.3 factor in well-trained men; with measured max heart rate the estimate had a standard error of 2.7 ml/kg/min, rising to 4.7 when max heart rate was predicted from age.'
  },
  example: `<p>A 45-year-old woman has a resting heart rate of 70 bpm and does not know her max.</p><p>Estimated max (Tanaka): 208 − 0.7 × 45 = 176.5 bpm. VO2 max = 15.3 × 176.5 ÷ 70 = <strong>38.6 ml/kg/min</strong>.</p><p>The FRIEND median for women aged 40–49 is 26.7 and the 90th percentile is 38.4, so her estimate ranks around the 90th percentile. Because her max was predicted rather than measured, the error band is wider (about ±4.7 ml/kg/min in Uth's data), so a 1.5-mile run would be a useful cross-check.</p>`,
  table: {
    title: 'What VO2 max does my 1.5-mile time or 12-minute distance mean?',
    intro: 'VO2 max from 1.5-mile run times (ACSM equation), and the 12-minute Cooper distance that gives the same score, computed with the calculator above.',
    head: ['1.5-mile time', 'VO2 max', 'Equivalent 12-min distance', 'In miles'],
    rows: ({ run, H }) => [9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(t => {
      const r = run({ m: 'run15', mins: t, secs: 0 });
      const d = r.vo * 44.73 + 504.9;
      return [t + ':00', H.fix(r.vo, 1), H.int(d) + ' m', H.fix(d / 1609.344, 2) + ' mi'];
    }),
    note: 'The two field tests use different equations, so the same runner can score a few points differently on each. Hills, wind and heat lower scores.'
  },
  sections: [
    {
      h2: 'What is a good VO2 max for my age?',
      html: `<p>The FRIEND registry (Kaminsky et al., <em>Mayo Clinic Proceedings</em> 2015) published percentiles from 7,783 treadmill tests with directly measured oxygen uptake in healthy U.S. adults. Values in ml/kg/min:</p><div class="twrap"><table><thead><tr><th>Age</th><th>Men 25th</th><th>Men 50th</th><th>Men 75th</th><th>Men 90th</th><th>Women 25th</th><th>Women 50th</th><th>Women 75th</th><th>Women 90th</th></tr></thead><tbody>
<tr><td>20–29</td><td>40.1</td><td>48.0</td><td>55.2</td><td>61.8</td><td>30.5</td><td>37.6</td><td>44.7</td><td>51.3</td></tr>
<tr><td>30–39</td><td>35.9</td><td>42.4</td><td>49.2</td><td>56.5</td><td>25.3</td><td>30.2</td><td>36.1</td><td>41.4</td></tr>
<tr><td>40–49</td><td>31.9</td><td>37.8</td><td>45.0</td><td>52.1</td><td>22.1</td><td>26.7</td><td>32.4</td><td>38.4</td></tr>
<tr><td>50–59</td><td>27.1</td><td>32.6</td><td>39.7</td><td>45.6</td><td>19.9</td><td>23.4</td><td>27.6</td><td>32.0</td></tr>
<tr><td>60–69</td><td>23.7</td><td>28.2</td><td>34.5</td><td>40.3</td><td>17.2</td><td>20.0</td><td>23.8</td><td>27.0</td></tr>
<tr><td>70–79</td><td>20.4</td><td>24.4</td><td>30.4</td><td>36.6</td><td>15.6</td><td>18.3</td><td>20.8</td><td>23.1</td></tr>
</tbody></table></div><p>Above the 75th percentile for your age is excellent; around the 50th is average for Americans who come in for an exercise test. The calculator places your estimate in this table automatically.</p>`
    },
    {
      h2: 'How do you calculate VO2 max from heart rate?',
      html: `<p>Divide your maximum heart rate by your resting heart rate and multiply by 15.3. Niels Uth and colleagues proposed this in 2004 after reasoning from the Fick principle that oxygen uptake should scale with the ratio of maximum to resting heart rate, and measured a factor of 15.3 in a group of well-trained men.</p><p>It works best when both numbers are accurate: a resting rate averaged over several mornings and a max heart rate you have actually reached. Using an age-predicted max nearly doubled the typical error in their study. Because the original group was trained men aged 21 to 51, treat results for women, older adults and beginners as rougher estimates. For the max heart rate itself, see the <a href="/max-heart-rate-calculator">max heart rate calculator</a>.</p>`
    },
    {
      h2: 'How accurate are smartwatch VO2 max estimates?',
      html: `<p>Reasonably good for tracking your own trend, less reliable as an exact number. Watches estimate VO2 max from heart rate and pace during outdoor runs or walks, plus your profile. Independent validation studies of recent Apple, Garmin and Google watches typically report average errors of a few ml/kg/min against lab tests, with larger misses for some individuals.</p><p>Use the same device and similar routes and conditions for comparisons over time, and treat a change of 1–2 points as noise. A field test from this page gives an independent check.</p>`
    },
    {
      h2: 'Why does VO2 max matter for health?',
      html: `<p>Cardiorespiratory fitness is one of the strongest predictors of long-term health. A 2009 meta-analysis in <em>JAMA</em> (Kodama et al.) pooled cohort studies of healthy adults and found that each 1-MET (3.5 ml/kg/min) higher fitness level was associated with a 13% lower risk of death from any cause and a 15% lower risk of heart disease events. People below 7.9 METs (about 27.7 ml/kg/min) had substantially higher risk than those above it.</p><p>VO2 max responds to training at any age. Regular moderate aerobic exercise plus some harder interval work raises it; the <a href="/target-heart-rate-calculator">target heart rate calculator</a> sets the intensity zones.</p>`
    }
  ],
  faq: [
    { q: 'What is a good VO2 max?', a: 'It depends on age and sex. In the FRIEND registry the median is 48.0 ml/kg/min for men in their 20s and 37.6 for women in their 20s, falling to 32.6 and 23.4 in the 50s. Above the 75th percentile for your group is excellent.' },
    { q: 'How do I calculate VO2 max without a lab?', a: 'Use the heart rate ratio (15.3 × max HR ÷ resting HR), a Cooper 12-minute run ((meters − 504.9) ÷ 44.73) or a 1.5-mile run (3.5 + 483 ÷ minutes). Each gives an estimate within a few ml/kg/min for most healthy people.' },
    { q: 'What VO2 max is a 12-minute 1.5-mile run?', a: 'About 43.8 ml/kg/min: 3.5 + 483 ÷ 12 = 43.75.' },
    { q: 'How far do I need to run in 12 minutes for a VO2 max of 50?', a: 'About 2,741 meters (1.70 miles), because 50 × 44.73 + 504.9 = 2,741.' },
    { q: 'Can you improve VO2 max?', a: 'Yes. Consistent aerobic training raises it, and interval training at high intensity is particularly effective. Gains are largest for people who start out less fit.' },
    { q: 'What is the difference between VO2 max and METs?', a: 'They are the same measure in different units. One MET is 3.5 ml/kg/min, so a VO2 max of 42 ml/kg/min equals 12 METs.' },
    { q: 'Does VO2 max decline with age?', a: 'Yes. FRIEND medians drop from 48.0 in men aged 20–29 to 24.4 in men aged 70–79, and from 37.6 to 18.3 in women. Staying active slows the decline.' }
  ],
  related: ['max-heart-rate-calculator', 'target-heart-rate-calculator', 'calories-burned-calculator', 'stride-length-calculator'],
  sources: [
    { name: 'Uth N et al. Estimation of VO2max from the ratio between HRmax and HRrest. Eur J Appl Physiol 2004', url: 'https://pubmed.ncbi.nlm.nih.gov/14624296/' },
    { name: 'Cooper KH. A means of assessing maximal oxygen intake. JAMA 1968', url: 'https://pubmed.ncbi.nlm.nih.gov/5694044/' },
    { name: 'Kaminsky LA, Arena R, Myers J. Reference standards for cardiorespiratory fitness: FRIEND registry. Mayo Clin Proc 2015 (full text)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4919021/' },
    { name: 'Kodama S et al. Cardiorespiratory fitness as a quantitative predictor of all-cause mortality and cardiovascular events. JAMA 2009', url: 'https://pubmed.ncbi.nlm.nih.gov/19454641/' }
  ],
  disclaimer: 'VO2 max field tests give estimates, not a medical assessment. Talk to a doctor before maximal running tests if you have heart disease, symptoms with exercise, or have been inactive.'
};
