export default {
  slug: 'coefficient-of-variation-calculator',
  hub: 'statistics',
  name: 'Coefficient of Variation Calculator',
  title: 'Coefficient of Variation Calculator: SD ÷ Mean = 2.57% CV',
  h1: 'Coefficient of Variation (CV, %RSD) Calculator With Excel Formula',
  meta: 'Six replicate readings averaging 10.033 with SD 0.258 have a CV of 2.57%. Paste data or enter a mean and SD for the CV (relative standard deviation) and an Excel formula.',
  keyword: 'how to calculate cv in excel',
  also: ['coefficient of variation calculator', 'cv calculator', 'relative standard deviation calculator', 'rsd calculator', 'how to calculate coefficient of variation', 'percent rsd calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Input', type: 'select', value: 'data', wide: true, options: [['data', 'Raw data'], ['stats', 'Mean and standard deviation']] },
    { id: 'data', label: 'Data values', type: 'text', multiline: 4, wide: true, value: '9.8, 10.2, 10.0, 9.7, 10.4, 10.1', showIf: { mode: ['data'] }, placeholder: 'Numbers separated by commas, spaces or new lines' },
    { id: 'kind', label: 'Standard deviation type', type: 'select', value: 'sample', showIf: { mode: ['data'] }, options: [['sample', 'Sample (n − 1), Excel STDEV.S'], ['pop', 'Population (n), Excel STDEV.P']] },
    { id: 'mean', label: 'Mean', type: 'number', value: 500, showIf: { mode: ['stats'] } },
    { id: 'sd', label: 'Standard deviation', type: 'number', value: 4, showIf: { mode: ['stats'] } }
  ],
  compute(v, H) {
    var m, s, n = 0, rows = [];
    if (v.mode === 'stats') {
      m = v.mean; s = v.sd;
      if (!(m === m) || m === 0) return { error: 'Enter a mean other than 0.' };
      if (!(s >= 0)) return { error: 'Enter a standard deviation of 0 or more.' };
    } else {
      var a = H.list(v.data); n = a.length;
      if (n < 2) return { error: 'Enter at least two numbers.' };
      m = H.mean(a); s = H.sd(a, v.kind !== 'pop');
      if (m === 0) return { error: 'The mean is 0, so the coefficient of variation is undefined.' };
    }
    var cv = s / Math.abs(m) * 100;
    rows.push(['Mean', H.num(m, 4)]);
    rows.push([v.mode === 'stats' ? 'Standard deviation' : (v.kind === 'pop' ? 'Population SD σ' : 'Sample SD s'), H.num(s, 4)]);
    rows.push(['CV as a ratio', H.fix(cv / 100, 4)]);
    if (n) {
      rows.push(['n', String(n)]);
      rows.push(['Bias-corrected CV (1 + 1/4n)', H.pct(cv * (1 + 1 / (4 * n)), 2)]);
      rows.push(['Excel', '<code>=' + (v.kind === 'pop' ? 'STDEV.P' : 'STDEV.S') + '(A2:A' + (n + 1) + ')/AVERAGE(A2:A' + (n + 1) + ')</code>']);
    }
    var verdict = cv < 5 ? 'very low variability' : cv < 10 ? 'low variability' : cv < 20 ? 'moderate variability' : cv < 30 ? 'high variability' : 'very high variability';
    return {
      value: H.pct(cv, 2), label: 'Coefficient of variation (CV, %RSD)',
      expr: H.num(s, 4) + ' ÷ ' + H.num(Math.abs(m), 4) + ' × 100',
      rows: rows,
      sub: 'The standard deviation is ' + H.pct(cv, 1) + ' of the mean: ' + verdict + ' by common lab and quality rules of thumb.' + (m < 0 ? ' The mean is negative; CV is only meaningful for data on a ratio scale with a true zero.' : ''),
      _cv: cv
    };
  },
  quick: ({ r }) => `To calculate CV in Excel, divide the standard deviation by the mean: <code>=STDEV.S(A2:A7)/AVERAGE(A2:A7)</code>, then format the cell as a percentage. For six replicate readings of <strong>9.8, 10.2, 10.0, 9.7, 10.4 and 10.1</strong>, the mean is 10.033 and the sample SD is 0.258, so the CV is 0.258 ÷ 10.033 = <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate the coefficient of variation',
  steps: [
    'Calculate the mean of the data. For the six readings, 60.2 ÷ 6 = 10.033.',
    'Calculate the standard deviation: the sample SD (n − 1) for replicates or any sample, the population SD (n) only for a complete population. Here s = 0.258.',
    'Divide the SD by the mean: 0.258 ÷ 10.033 = 0.0257.',
    'Multiply by 100 to express it as a percentage: 2.57%. Forgetting this step, or dividing the mean by the SD instead, are the two common slips.'
  ],
  formulaTitle: 'What is the coefficient of variation formula?',
  formula: {
    expr: 'CV = (s ÷ x̄) × 100%<br>Population: CV = (σ ÷ μ) × 100%<br>Bias-corrected (normal data): CV* = (1 + 1/(4n)) × CV',
    vars: [['s, σ', 'sample or population standard deviation'], ['x̄, μ', 'sample or population mean'], ['n', 'number of values']],
    note: 'In analytical chemistry and lab medicine the same quantity is called relative standard deviation (RSD or %RSD).'
  },
  example: `<p>A lab runs one control sample six times: 9.8, 10.2, 10.0, 9.7, 10.4, 10.1 mg/L.</p>
<p>Mean = 60.2 ÷ 6 = <strong>10.033</strong>. Squared deviations add to 0.3333, so s = √(0.3333 ÷ 5) = <strong>0.2582</strong>.</p>
<p>CV = 0.2582 ÷ 10.033 × 100 = <strong>2.57%</strong>. Using the population SD instead (√(0.3333 ÷ 6) = 0.2357) gives 2.35%.</p>
<p>That is well under the 15% precision limit FDA guidance sets for bioanalytical methods, so the run is precise.</p>`,
  table: {
    title: 'How does CV compare variation across different scales?',
    intro: 'Example data sets with different units and means. The SD alone can\'t tell you which is more consistent; the CV can. Computed with the calculator\'s mean-and-SD mode.',
    head: ['Example', 'Mean', 'SD', 'CV', 'Reading'],
    rows: ({ run, H }) => [
      ['500 g cereal boxes', 500, 4], ['50 g snack bags', 50, 2], ['Lab control (mg/L)', 10.033, 0.2582],
      ['Commute time (min)', 28, 9], ['Monthly sales ($)', 42000, 6300], ['Daily website visits', 1200, 480]
    ].map(([name, m, s]) => {
      const cv = run({ mode: 'stats', mean: m, sd: s })._cv;
      return [name, H.num(m, 3), H.num(s, 4), H.pct(cv, 2), cv < 5 ? 'very consistent' : cv < 10 ? 'consistent' : cv < 20 ? 'moderate' : cv < 30 ? 'variable' : 'highly variable'];
    }),
    note: 'The cereal boxes have twice the SD of the snack bags (4 g vs 2 g) but are five times more consistent relative to their size (0.8% vs 4%).'
  },
  sections: [
    {
      h2: 'How do you calculate CV in Excel and Google Sheets?',
      html: `<p>Excel has no CV function, so combine two. With the data in A2:A7:</p>
<ul>
<li>Sample CV: <code>=STDEV.S(A2:A7)/AVERAGE(A2:A7)</code> → 0.0257. Press <strong>Ctrl+Shift+5</strong> (or Home → %) to show it as 2.57%, or multiply by 100.</li>
<li>Population CV: <code>=STDEV.P(A2:A7)/AVERAGE(A2:A7)</code> → 0.0235.</li>
<li>CV for each row of replicates in B2:D2: <code>=STDEV.S(B2:D2)/AVERAGE(B2:D2)</code>, filled down.</li>
<li>Ignoring zeros or blanks that mean "no reading": <code>=STDEV.S(IF(A2:A50&lt;&gt;0,A2:A50))/AVERAGEIF(A2:A50,"&lt;&gt;0")</code>.</li>
</ul>
<p>Google Sheets uses the same formulas. In R, <code>sd(x) / mean(x) * 100</code>; in Python, <code>scipy.stats.variation(x, ddof=1)</code>.</p>`
    },
    {
      h2: 'What is a good coefficient of variation?',
      html: `<p>"Good" depends entirely on the field, but some benchmarks come up again and again:</p>
<ul>
<li><strong>Bioanalytical assays:</strong> FDA's Bioanalytical Method Validation guidance accepts precision of 15% CV, or 20% at the lower limit of quantification.</li>
<li><strong>Immunoassays (ELISA):</strong> labs commonly target intra-assay CV under 10% and inter-assay CV under 15%.</li>
<li><strong>Manufacturing fill weights:</strong> often well under 2%.</li>
<li><strong>Field and survey data:</strong> 20–30% or more is ordinary.</li>
</ul>
<p>As a rough general guide: under 10% is low variability, 10–20% moderate, 20–30% high and above 30% very high.</p>`
    },
    {
      h2: 'When should you not use the coefficient of variation?',
      html: `<p>Only use CV for data on a <strong>ratio scale</strong>, with a true zero and no negative values: weights, concentrations, times, prices, counts. It gives nonsense for temperatures in °C or °F: 10 °C and 50 °F are the same temperature but yield different CVs. Data that can be negative, such as profit or change scores, can have a mean near zero and an exploding CV.</p>
<p>For small samples, the sample CV slightly underestimates the population value; multiplying by 1 + 1/(4n) corrects most of that bias for normally distributed data (the calculator shows it). For heavily skewed data, consider the CV of log-transformed values or a robust alternative such as IQR ÷ median.</p>`
    },
    {
      h2: 'What is the difference between CV and standard deviation?',
      html: `<p>The <a href="/standard-deviation-calculator">standard deviation</a> measures spread in the data's own units (grams, dollars, minutes). The CV divides it by the mean, so it's unitless and lets you compare spread between variables of different sizes or units. A 4 g SD on a 500 g box (0.8%) is far tighter control than a 2 g SD on a 50 g bag (4%).</p>
<p>In finance, the same ratio is used to compare risk per unit of return (SD of returns ÷ mean return), and its inverse, mean ÷ SD, is the signal-to-noise ratio used in engineering and imaging.</p>`
    }
  ],
  faq: [
    { q: 'Is the coefficient of variation the same as relative standard deviation?', a: 'Yes. CV and RSD (often written %RSD) are the same quantity: the standard deviation divided by the mean, usually expressed as a percentage.' },
    { q: 'Can the coefficient of variation be more than 100%?', a: 'Yes. A CV above 100% means the standard deviation is larger than the mean, which is common for highly skewed data such as incomes, insurance claims or website traffic.' },
    { q: 'Should I use STDEV.S or STDEV.P for CV in Excel?', a: 'Use STDEV.S for replicates or any sample, which is almost always the case. STDEV.P is only right when your data are the entire population. The difference matters most for small n.' },
    { q: 'What does a low coefficient of variation mean?', a: 'A low CV means values cluster tightly around the mean relative to its size. In a lab, a CV under 5% for replicate measurements indicates very good precision.' },
    { q: 'How do I calculate CV from a mean and standard deviation?', a: 'Divide the SD by the mean and multiply by 100. A mean of 500 and SD of 4 give a CV of 0.8%. Choose "Mean and standard deviation" above to do it here.' },
    { q: 'Can CV be negative?', a: 'If the mean is negative, the formula gives a negative ratio, which is why CV is usually reported using the absolute value of the mean and only applied to data that are always positive.' },
    { q: 'What is intra-assay vs inter-assay CV?', a: 'Intra-assay CV measures variation among replicates within one run or plate; inter-assay CV measures variation of the same control across different runs or days. Inter-assay CV is normally the larger of the two.' }
  ],
  related: ['standard-deviation-calculator', 'outlier-calculator', 'z-score-calculator', 'moving-average-calculator'],
  sources: [
    { name: 'NIST Dataplot Reference Manual: Coefficient of Variation', url: 'https://www.itl.nist.gov/div898/software/dataplot/refman2/auxillar/coefvari.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Measures of Scale', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm' },
    { name: 'FDA: Bioanalytical Method Validation Guidance for Industry', url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/bioanalytical-method-validation-guidance-industry' },
    { name: 'Microsoft Support: STDEV.S function', url: 'https://support.microsoft.com/en-us/excel/functions/stdev-s-function' },
    { name: 'Microsoft Support: AVERAGE function', url: 'https://support.microsoft.com/en-us/excel/functions/average-function' }
  ]
};
