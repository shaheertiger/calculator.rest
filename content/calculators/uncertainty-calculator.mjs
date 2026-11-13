export default {
  slug: 'uncertainty-calculator',
  hub: 'science',
  name: 'Uncertainty Calculator',
  title: 'Uncertainty Calculator: 2.47 ± 0.04 s Is a 1.6% Uncertainty',
  h1: 'Measurement Uncertainty Calculator: Absolute, Percentage and Propagated',
  meta: 'Five timings averaging 2.47 s with a 0.08 s spread give 2.47 ± 0.04 s, a 1.6% uncertainty. Get absolute, relative and percent uncertainty, and propagate it.',
  keyword: 'how to calculate uncertainty in physics',
  also: ['uncertainty calculator', 'how to calculate percentage uncertainty', 'how to calculate percent uncertainty', 'how to calculate measurement of uncertainty', 'how to calculate uncertainty in excel', 'propagation of uncertainty calculator', 'how to calculate absolute uncertainty'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you have?', type: 'select', value: 'repeat', options: [['repeat', 'Repeated readings of one quantity'], ['single', 'One value with its uncertainty'], ['combine', 'Two measured values to add, multiply, etc.']] },
    { id: 'data', label: 'Readings', type: 'text', multiline: 3, value: '2.43, 2.51, 2.47, 2.45, 2.49', placeholder: 'Separate with commas, spaces or new lines', showIf: { mode: ['repeat'] }, wide: true },
    { id: 'method', label: 'Uncertainty from the spread', type: 'select', value: 'half', options: [['half', 'Half the range (high school / A level / IB)'], ['sd', 'Standard deviation (one reading)'], ['se', 'Standard error of the mean (university labs)']], showIf: { mode: ['repeat'] } },
    { id: 'x', label: 'Measured value', type: 'number', value: 12.0, showIf: { mode: ['single'] } },
    { id: 'dx', label: 'Absolute uncertainty ±', type: 'number', value: 0.2, showIf: { mode: ['single'] } },
    { id: 'a', label: 'Value A', type: 'number', value: 12.0, showIf: { mode: ['combine'] } },
    { id: 'da', label: 'Uncertainty in A ±', type: 'number', value: 0.2, showIf: { mode: ['combine'] } },
    { id: 'op', label: 'Operation', type: 'select', value: 'mul', options: [['add', 'A + B'], ['sub', 'A − B'], ['mul', 'A × B'], ['div', 'A ÷ B'], ['pow', 'Aⁿ (power)']], showIf: { mode: ['combine'] } },
    { id: 'b', label: 'Value B', type: 'number', value: 4.0, showIf: { mode: ['combine'], op: ['add', 'sub', 'mul', 'div'] } },
    { id: 'db', label: 'Uncertainty in B ±', type: 'number', value: 0.1, showIf: { mode: ['combine'], op: ['add', 'sub', 'mul', 'div'] } },
    { id: 'n', label: 'Power n', type: 'number', value: 2, showIf: { mode: ['combine'], op: ['pow'] } },
    { id: 'rule', label: 'Combining rule', type: 'select', value: 'simple', options: [['simple', 'Add uncertainties (worst case, high school)'], ['quad', 'Add in quadrature (independent errors, university)']], showIf: { mode: ['combine'] } },
    { id: 'unit', label: 'Unit (optional)', type: 'text', value: 's', placeholder: 'e.g. s, cm, g' }
  ],
  compute(v, H) {
    var unit = String(v.unit || '').trim().slice(0, 12);
    var us = unit ? ' ' + H.esc(unit) : '';
    var fmt = function (x, u) {
      if (!(u > 0) || !isFinite(x)) return { x: H.sig(x, 4), u: '0' };
      var e = Math.floor(Math.log10(u));
      var lead = u / Math.pow(10, e);
      var sf = lead < 1.95 ? 2 : 1;
      var p = e - sf + 1;
      var q = Math.pow(10, p);
      var ur = Math.round(u / q) * q, xr = Math.round(x / q) * q;
      var dp = Math.max(0, -p);
      return { x: H.fix(xr, dp), u: H.fix(ur, dp) };
    };
    var x, u, rows = [], expr, label, sub;
    if (v.mode === 'repeat') {
      var d = H.list(v.data);
      if (d.length < 2) return { error: 'Enter at least two readings.' };
      var n = d.length, mean = H.mean(d), mx = Math.max.apply(null, d), mn = Math.min.apply(null, d);
      var sd = H.sd(d, true), se = sd / Math.sqrt(n), half = (mx - mn) / 2;
      x = mean;
      u = v.method === 'sd' ? sd : v.method === 'se' ? se : half;
      label = 'Mean ± ' + (v.method === 'sd' ? 'standard deviation' : v.method === 'se' ? 'standard error' : 'half the range');
      expr = 'mean of ' + n + ' readings, ±' + (v.method === 'half' ? ' (max − min) ÷ 2' : v.method === 'sd' ? ' s' : ' s ÷ √n');
      rows.push(['Mean', H.sig(mean, 6) + us]);
      rows.push(['Range (max − min)', H.sig(mx - mn, 4) + us]);
      rows.push(['Half the range', H.sig(half, 4) + us, v.method === 'half']);
      rows.push(['Sample standard deviation s', H.sig(sd, 4) + us, v.method === 'sd']);
      rows.push(['Standard error s ÷ √n', H.sig(se, 4) + us, v.method === 'se']);
      sub = n + ' readings. ' + (v.method === 'half' ? 'Half-range is the usual school method; standard error is smaller and is what university labs report for a mean.' : 'Standard deviation describes one reading; standard error describes the mean and shrinks as you take more readings.');
    } else if (v.mode === 'single') {
      if (!isFinite(v.x)) return { error: 'Enter the measured value.' };
      if (!(v.dx >= 0)) return { error: 'Enter the absolute uncertainty (0 or more).' };
      x = v.x; u = v.dx; label = 'Measurement with uncertainty'; expr = H.num(v.x, 6) + ' ± ' + H.num(v.dx, 6);
      sub = 'A digital reading is usually ± 1 in the last digit; an analog scale, ± half the smallest division.';
    } else {
      if (!isFinite(v.a) || !(v.da >= 0)) return { error: 'Enter value A and its uncertainty.' };
      var quad = v.rule === 'quad', rA = v.a !== 0 ? v.da / Math.abs(v.a) : NaN;
      if (v.op === 'pow') {
        if (!isFinite(v.n)) return { error: 'Enter the power n.' };
        if (v.a === 0) return { error: 'A must not be zero for a power.' };
        x = Math.pow(v.a, v.n); u = Math.abs(v.n) * rA * Math.abs(x);
        expr = '%Q = |' + H.num(v.n, 3) + '| × %A';
        if (!isFinite(x)) return { error: 'That power has no real value.' };
      } else {
        if (!isFinite(v.b) || !(v.db >= 0)) return { error: 'Enter value B and its uncertainty.' };
        if (v.op === 'add' || v.op === 'sub') {
          x = v.op === 'add' ? v.a + v.b : v.a - v.b;
          u = quad ? Math.sqrt(v.da * v.da + v.db * v.db) : v.da + v.db;
          expr = quad ? 'δQ = √(δA² + δB²)' : 'δQ = δA + δB';
        } else {
          if (v.a === 0 || v.b === 0) return { error: 'A and B must be non-zero to multiply or divide with percentage uncertainties.' };
          if (v.op === 'div' && v.b === 0) return { error: 'B cannot be zero.' };
          x = v.op === 'mul' ? v.a * v.b : v.a / v.b;
          var rB = v.db / Math.abs(v.b);
          var rel = quad ? Math.sqrt(rA * rA + rB * rB) : rA + rB;
          u = rel * Math.abs(x);
          expr = quad ? '%Q = √(%A² + %B²)' : '%Q = %A + %B';
          rows.push(['Percentage uncertainty in B', H.pct(rB * 100, 3)]);
        }
      }
      if (isFinite(rA)) rows.unshift(['Percentage uncertainty in A', H.pct(rA * 100, 3)]);
      label = 'Result with propagated uncertainty';
      sub = quad ? 'Quadrature assumes the errors in A and B are independent and random; it gives a smaller, more realistic uncertainty.' : 'Adding uncertainties gives the worst case, the rule taught in most high school and AP/IB courses.';
    }
    var f = fmt(x, u);
    var pctU = x !== 0 ? u / Math.abs(x) * 100 : NaN;
    rows.push(['Absolute uncertainty', '± ' + H.sig(u, 3) + us]);
    rows.push(['Relative (fractional) uncertainty', isFinite(pctU) ? H.sig(pctU / 100, 3) : '—']);
    rows.push(['Percentage uncertainty', isFinite(pctU) ? H.pct(pctU, pctU < 10 ? 2 : 1) : '—', true]);
    rows.push(['Write it as', f.x + ' ± ' + f.u + us + (isFinite(pctU) ? ' (' + H.pct(pctU, pctU < 10 ? 1 : 0) + ')' : ''), true]);
    return { value: f.x + ' ± ' + f.u + us, label: label, expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate uncertainty in physics from repeated readings, take the mean and use half the range as the absolute uncertainty: (max − min) ÷ 2. Timings of 2.43, 2.51, 2.47, 2.45 and 2.49 s average 2.47 s with a range of 0.08 s, giving <strong>${r.value}</strong>. Percentage uncertainty = 0.04 ÷ 2.47 × 100 = 1.6%.`,
  stepsTitle: 'How to calculate uncertainty in a physics lab',
  steps: [
    'Repeat the measurement several times (at least 3, ideally 5 or more) and record every reading, including odd ones; only discard a value you know was a mistake.',
    'Find the mean: add the readings and divide by how many there are.',
    'Find the absolute uncertainty. For repeated readings use half the range, (max − min) ÷ 2. For a single reading, use the instrument\'s resolution: ±1 in the last digit of a digital display, or ±half the smallest division on a ruler or dial.',
    'Convert to percentage uncertainty: absolute ÷ mean × 100.',
    'Round the uncertainty to one significant figure (two if it starts with 1), then round the mean to the same decimal place. Writing 2.4700 ± 0.04 is the mistake teachers mark down most often.'
  ],
  formulaTitle: 'What are the uncertainty formulas?',
  formula: {
    expr: 'Absolute (repeats) = (max − min) ÷ 2<br>% uncertainty = (absolute ÷ value) × 100<br>Q = A ± B: δQ = δA + δB<br>Q = A × B or A ÷ B: %Q = %A + %B<br>Q = Aⁿ: %Q = |n| × %A',
    vars: [['δA', 'absolute uncertainty in A, same unit as A'], ['%A', 'percentage uncertainty in A'], ['s', 'sample standard deviation = √(Σ(x − x̄)² ÷ (n − 1))'], ['s ÷ √n', 'standard error of the mean']],
    note: 'For independent random errors, university courses and the NIST/GUM guidelines combine in quadrature instead: δQ = √(δA² + δB²) for sums, and %Q = √(%A² + %B²) for products and quotients.'
  },
  example: `<p><strong>Measuring g with a pendulum.</strong> Length L = 1.500 ± 0.005 m; period T = 2.47 ± 0.04 s. Using g = 4π²L ÷ T²:</p>
<p>g = 4π² × 1.500 ÷ 2.47² = <strong>9.706 m/s²</strong>.</p>
<p>Percentage uncertainties: L is 0.005 ÷ 1.500 = 0.33%; T is 0.04 ÷ 2.47 = 1.62%, and because T is squared it counts twice: 3.24%. (4π² is exact and adds nothing.)</p>
<p>Total = 0.33 + 3.24 = 3.57%, so δg = 0.0357 × 9.706 = 0.35 m/s². Result: <strong>g = 9.7 ± 0.3 m/s²</strong>, which includes the accepted 9.81. With quadrature the total is 3.26% and the rounded answer is the same.</p>
<p>Tip: timing 10 swings (24.7 ± 0.2 s) and dividing by 10 gives T = 2.47 ± 0.02 s, halving the biggest source of uncertainty.</p>`,
  table: {
    title: 'How do uncertainties combine for each operation?',
    intro: 'A = 12.0 ± 0.2 and B = 4.0 ± 0.1, combined both ways by the calculator.',
    head: ['Operation', 'Rule', 'Add uncertainties', 'Quadrature'],
    rows: ({ run }) => [['A + B', 'add', 'Add absolute'], ['A − B', 'sub', 'Add absolute (never subtract)'], ['A × B', 'mul', 'Add percentages'], ['A ÷ B', 'div', 'Add percentages'], ['A²', 'pow', 'Double the percentage'], ['A³', 'pow3', 'Triple the percentage']].map(x => { const op = x[1] === 'pow3' ? 'pow' : x[1]; const nn = x[1] === 'pow3' ? 3 : 2; const base = { mode: 'combine', a: 12, da: 0.2, b: 4, db: 0.1, op, n: nn, unit: '' }; return [x[0], x[2], run({ ...base, rule: 'simple' }).value, run({ ...base, rule: 'quad' }).value]; }),
    note: 'Subtracting two close values can make the percentage uncertainty huge: 12.0 ± 0.2 minus 11.5 ± 0.2 is 0.5 ± 0.4, an 80% uncertainty.'
  },
  sections: [
    {
      h2: 'How do you calculate percentage uncertainty?',
      html: `<p>Divide the absolute uncertainty by the measured value and multiply by 100. A length of 25.0 ± 0.1 cm has a percentage uncertainty of 0.1 ÷ 25.0 × 100 = <strong>0.4%</strong>. The same ±0.1 cm on a 2.0 cm length is 5%, which is why measuring larger quantities (a stack of 20 coins instead of one) improves precision.</p>
<p>Percentage uncertainty is the form you need for multiplying and dividing, and it lets you compare the quality of measurements with different units. To go back, multiply: 1.6% of 2.47 s is 0.04 s.</p>`
    },
    {
      h2: 'What is the uncertainty of a single measurement?',
      html: `<p>When you can only take one reading, the uncertainty comes from the instrument. The common classroom conventions are:</p>
<ul><li><strong>Analog scales</strong> (ruler, measuring cylinder, dial): ± half the smallest division, so a millimeter ruler gives ±0.5 mm. Many courses use ±1 mm when both ends of the ruler must be read.</li>
<li><strong>Digital instruments</strong> (balance, multimeter, stopwatch): ± 1 in the last displayed digit, so 3.47 g reads as ±0.01 g.</li>
<li><strong>Human reaction time</strong> with a hand-held stopwatch is about 0.1–0.2 s, far bigger than the 0.01 s display, so use that instead.</li></ul>
<p>If repeated readings spread more than the instrument resolution, the spread wins: use half the range.</p>`
    },
    {
      h2: 'What is the difference between uncertainty and percent error?',
      html: `<p>Uncertainty is a range around your own result that describes how precise it is; you can calculate it without knowing the "right" answer. Percent error compares your result with an accepted value: |measured − accepted| ÷ accepted × 100. A good result has a small uncertainty and an accepted value that falls inside its range, like g = 9.7 ± 0.3 m/s² against 9.81 m/s².</p>
<p>If the accepted value lies outside your uncertainty range, there is likely a systematic error, such as a zero error on a scale or a consistent reaction-time delay, that repeating the measurement cannot remove.</p>`
    },
    {
      h2: 'How do you calculate uncertainty in Excel or Google Sheets?',
      html: `<p>With readings in A2:A6:</p>
<ul><li>Mean: <code>=AVERAGE(A2:A6)</code></li><li>Half the range: <code>=(MAX(A2:A6)-MIN(A2:A6))/2</code></li><li>Standard deviation: <code>=STDEV.S(A2:A6)</code></li><li>Standard error: <code>=STDEV.S(A2:A6)/SQRT(COUNT(A2:A6))</code></li><li>Percentage uncertainty: <code>=B2/B1*100</code> with the uncertainty in B2 and the mean in B1.</li></ul>
<p>For the five timings above, Excel returns a standard deviation of 0.0316 s and a standard error of 0.0141 s. See the <a href="/standard-deviation-calculator">standard deviation calculator</a> for the full working.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate absolute uncertainty?', a: 'For repeated readings, absolute uncertainty is half the range: (largest − smallest) ÷ 2. For one reading it is the instrument resolution. It has the same unit as the measurement, e.g. ±0.04 s.' },
    { q: 'How many significant figures should an uncertainty have?', a: 'One, or two if the first digit is 1 (±0.012 rather than ±0.01). Then round the value to the same decimal place: 9.706 ± 0.35 becomes 9.7 ± 0.3.' },
    { q: 'Do you add or multiply uncertainties?', a: 'Add absolute uncertainties when adding or subtracting quantities, and add percentage uncertainties when multiplying or dividing. For a power, multiply the percentage uncertainty by the power.' },
    { q: 'Why do uncertainties add when you subtract?', a: 'Because the errors could push the two values in opposite directions. 12.0 ± 0.2 minus 4.0 ± 0.1 could be anywhere from 7.7 to 8.3, so the result is 8.0 ± 0.3, never ± 0.1.' },
    { q: 'What does a percentage uncertainty of 5% mean?', a: 'The true value is expected to lie within 5% either side of your result. For 20.0 cm ± 5%, that is 19.0 to 21.0 cm.' },
    { q: 'Does a constant like π or 2 add uncertainty?', a: 'No. Exact numbers and well-known constants have no meaningful uncertainty, so multiplying by them keeps the percentage uncertainty unchanged and scales the absolute uncertainty.' },
    { q: 'How do I reduce uncertainty in an experiment?', a: 'Take more readings, measure larger quantities (time 10 oscillations, not one), use instruments with finer resolution, and remove systematic errors such as zero errors before you start.' }
  ],
  related: ['standard-deviation-calculator', 'average-calculator', 'percentage-calculator', 'foil-thickness-calculator', 'coefficient-of-variation-calculator'],
  sources: [
    { name: 'NIST: Essentials of Expressing Measurement Uncertainty', url: 'https://physics.nist.gov/cuu/Uncertainty/index.html' },
    { name: 'NIST Technical Note 1297: Guidelines for Evaluating and Expressing the Uncertainty of NIST Measurement Results', url: 'https://www.nist.gov/pml/nist-technical-note-1297' },
    { name: 'BIPM JCGM 100: Guide to the Expression of Uncertainty in Measurement (GUM)', url: 'https://www.bipm.org/en/committees/jc/jcgm/publications' },
    { name: 'OpenStax College Physics 2e: Accuracy, Precision, and Significant Figures', url: 'https://openstax.org/books/college-physics-2e/pages/1-3-accuracy-precision-and-significant-figures' }
  ]
};
