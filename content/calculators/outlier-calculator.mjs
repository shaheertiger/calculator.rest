export default {
  slug: 'outlier-calculator',
  hub: 'statistics',
  name: 'Outlier Calculator',
  title: 'Outlier Calculator: IQR Fences 6.5 and 34.5 Flag 48 (1.5×IQR)',
  h1: 'Outlier Calculator: Quartiles, IQR and Upper and Lower Fences',
  meta: 'For 12, 15, 17, 18, 19, 21, 22, 23, 24, 34, 48: Q1 = 17, Q3 = 24, IQR = 7, fences 6.5 and 34.5, so 48 is an outlier. Paste any data to find outliers.',
  keyword: 'how to calculate upper and lower fences',
  also: ['outlier calculator', 'how do you calculate an outlier', 'how to calculate upper fence', 'how to calculate the upper fence', 'how to calculate outliers in r', 'iqr calculator', 'interquartile range calculator', 'lower fence calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'data', label: 'Data set', type: 'text', multiline: 5, wide: true, value: '12, 15, 17, 18, 19, 21, 22, 23, 24, 34, 48', placeholder: 'Numbers separated by commas, spaces or new lines' },
    { id: 'k', label: 'Fence multiplier', type: 'select', value: '1.5', options: [['1.5', '1.5 × IQR (outliers)'], ['3', '3 × IQR (extreme outliers)']] },
    { id: 'method', label: 'Quartile method', type: 'select', value: 'tukey', options: [['tukey', 'Median of halves (TI-84, AP Stats, most textbooks)'], ['inc', 'Excel QUARTILE.INC / R default / Google Sheets'], ['exc', 'Excel QUARTILE.EXC / Minitab']] }
  ],
  compute(v, H) {
    var a = H.list(v.data);
    if (a.length < 4) return { error: 'Enter at least 4 numbers.' };
    var s = H.sorted(a), n = s.length, k = Number(v.k) || 1.5;
    function med(x) { var m = Math.floor(x.length / 2); return x.length % 2 ? x[m] : (x[m - 1] + x[m]) / 2; }
    function exc(p) {
      var h = (n + 1) * p, lo = Math.floor(h);
      if (lo < 1) return s[0];
      if (lo >= n) return s[n - 1];
      return s[lo - 1] + (h - lo) * (s[lo] - s[lo - 1]);
    }
    var q1, q3, label;
    if (v.method === 'inc') { q1 = H.quantile(s, 0.25); q3 = H.quantile(s, 0.75); label = 'QUARTILE.INC'; }
    else if (v.method === 'exc') { q1 = exc(0.25); q3 = exc(0.75); label = 'QUARTILE.EXC'; }
    else { var half = Math.floor(n / 2); q1 = med(s.slice(0, half)); q3 = med(s.slice(n - half)); label = 'median of halves'; }
    var iqr = q3 - q1, lf = q1 - k * iqr, uf = q3 + k * iqr;
    var low = s.filter(function (x) { return x < lf; }), high = s.filter(function (x) { return x > uf; });
    var out = low.concat(high);
    function f(x) { return H.num(x, 4); }
    var inside = s.filter(function (x) { return x >= lf && x <= uf; });
    return {
      value: out.length ? H.plural(out.length, 'outlier') : 'No outliers',
      label: out.length ? 'Outside ' + f(lf) + ' to ' + f(uf) + ': ' + out.map(f).join(', ') : 'Every value is inside the fences ' + f(lf) + ' to ' + f(uf),
      expr: 'Q1 − ' + k + '×IQR = ' + f(lf) + ', Q3 + ' + k + '×IQR = ' + f(uf),
      rows: [
        ['Q1 (25th percentile)', f(q1)], ['Median', f(med(s))], ['Q3 (75th percentile)', f(q3)],
        ['Interquartile range IQR', f(iqr), true],
        ['Lower fence', f(lf), true], ['Upper fence', f(uf), true],
        ['Low outliers', low.length ? low.map(f).join(', ') : 'none'], ['High outliers', high.length ? high.map(f).join(', ') : 'none'],
        ['Whisker ends (min / max inside fences)', inside.length ? f(inside[0]) + ' / ' + f(inside[inside.length - 1]) : '—'],
        ['n, quartile method', n + ', ' + label]
      ],
      sub: out.length ? 'Flagged values deserve a second look (typo, measurement error, or a genuinely unusual case) before you decide whether to keep them.' : 'Nothing falls beyond ' + k + ' IQRs from the quartiles.',
      _q1: q1, _q3: q3, _iqr: iqr, _lf: lf, _uf: uf, _out: out
    };
  },
  quick: ({ r }) => `Lower fence = Q1 − 1.5 × IQR and upper fence = Q3 + 1.5 × IQR; values beyond them are outliers. For <strong>12, 15, 17, 18, 19, 21, 22, 23, 24, 34, 48</strong>, Q1 = 17 and Q3 = 24, so IQR = 7, the lower fence is 17 − 10.5 = <strong>6.5</strong> and the upper fence is 24 + 10.5 = <strong>34.5</strong>. That gives <strong>${r.value.toLowerCase()}</strong>: 48.`,
  stepsTitle: 'How to calculate upper and lower fences',
  steps: [
    'Sort the data from smallest to largest.',
    'Find the median, then the median of the lower half (Q1) and of the upper half (Q3). With an odd count, leave the overall median out of both halves. Software can use other quartile rules, which is why answers sometimes differ slightly.',
    'Subtract: IQR = Q3 − Q1. For the example, 24 − 17 = 7.',
    'Multiply the IQR by 1.5 (here 10.5). Lower fence = Q1 − 10.5 = 6.5; upper fence = Q3 + 10.5 = 34.5.',
    'Any value below the lower fence or above the upper fence is an outlier. Use 3 × IQR instead to flag only extreme outliers.'
  ],
  formulaTitle: 'What is the formula for outlier fences?',
  formula: {
    expr: 'IQR = Q3 − Q1<br>Lower fence = Q1 − 1.5 × IQR<br>Upper fence = Q3 + 1.5 × IQR<br>Extreme (outer) fences: Q1 − 3 × IQR and Q3 + 3 × IQR',
    vars: [['Q1', 'first quartile (25th percentile)'], ['Q3', 'third quartile (75th percentile)'], ['IQR', 'interquartile range, the spread of the middle 50%']],
    note: 'This is Tukey\'s rule, the same one box plots use: whiskers stop at the most extreme values inside the fences, and points beyond them are drawn individually.'
  },
  example: `<p>Eleven delivery times in minutes: 12, 15, 17, 18, 19, 21, 22, 23, 24, 34, 48.</p>
<p>Median = 21 (6th value). Lower half 12, 15, 17, 18, 19 → <strong>Q1 = 17</strong>. Upper half 22, 23, 24, 34, 48 → <strong>Q3 = 24</strong>.</p>
<p>IQR = 24 − 17 = 7; 1.5 × 7 = 10.5. Fences: 17 − 10.5 = <strong>6.5</strong> and 24 + 10.5 = <strong>34.5</strong>.</p>
<p>48 is above 34.5, so it's an outlier; nothing is below 6.5. 34 sits just inside the upper fence. With 3 × IQR the upper fence is 45, and 48 is still flagged as extreme.</p>`,
  table: {
    title: 'Do different quartile methods find different outliers?',
    intro: 'The example data run through each quartile convention and both multipliers. The fences move, so borderline values can flip between "outlier" and "not".',
    head: ['Method', 'Multiplier', 'Q1', 'Q3', 'IQR', 'Fences', 'Outliers'],
    rows: ({ run, H }) => [['tukey', 'Median of halves (TI-84)'], ['inc', 'QUARTILE.INC (Excel, R)'], ['exc', 'QUARTILE.EXC']].flatMap(([m, name]) => ['1.5', '3'].map(k => {
      const r = run({ method: m, k });
      return [name, k + '×', H.num(r._q1, 2), H.num(r._q3, 2), H.num(r._iqr, 2), H.num(r._lf, 2) + ' to ' + H.num(r._uf, 2), r._out.length ? r._out.join(', ') : 'none'];
    })),
    note: 'For large data sets the three methods converge. For small ones, use the method your course, software or report requires, and say which one you used.'
  },
  sections: [
    {
      h2: 'How do you find outliers in Excel?',
      html: `<p>With the data in A2:A12:</p>
<ul>
<li>Q1: <code>=QUARTILE.INC(A2:A12,1)</code> → 17.5; Q3: <code>=QUARTILE.INC(A2:A12,3)</code> → 23.5 (or QUARTILE.EXC for 17 and 24).</li>
<li>IQR in D3: <code>=D2-D1</code>. Lower fence: <code>=D1-1.5*D3</code>; upper fence: <code>=D2+1.5*D3</code>.</li>
<li>Flag each row: <code>=IF(OR(A2&lt;$D$4,A2&gt;$D$5),"Outlier","")</code> and fill down, or use the same OR() test as a conditional-formatting rule to highlight them.</li>
<li>Excel 365 can list them in one cell: <code>=FILTER(A2:A12,(A2:A12&lt;D4)+(A2:A12&gt;D5),"none")</code>.</li>
</ul>
<p>Excel's QUARTILE.INC matches the R default and Google Sheets' QUARTILE, so its fences (8.5 and 32.5 here) differ slightly from a TI-84's, and that is enough to flag 34 as well as 48. A box and whisker chart (Insert → Statistic Chart) uses the exclusive method by default.</p>`
    },
    {
      h2: 'How do you find outliers in R?',
      html: `<p>R's box-plot helper applies Tukey's rule directly: <code>boxplot.stats(x)$out</code> returns the outlying values (34 and 48 for the example). It builds the box from Tukey's hinges (<code>fivenum(x)</code>), which include the median in both halves when n is odd; for the example they are 17.5 and 23.5, giving fences of 8.5 and 32.5.</p>
<p>To use the fences explicitly:</p>
<p><code>q &lt;- quantile(x, c(0.25, 0.75)); iqr &lt;- IQR(x)</code><br><code>x[x &lt; q[1] - 1.5*iqr | x &gt; q[2] + 1.5*iqr]</code></p>
<p><code>quantile()</code> uses type 7 (like QUARTILE.INC) unless you pass <code>type = 6</code> (like QUARTILE.EXC) or another type.</p>`
    },
    {
      h2: 'Why do calculators give different Q1, Q3 and fences?',
      html: `<p>There is no single agreed definition of a quartile; statistical software offers at least nine. The three you're most likely to meet:</p>
<ul>
<li><strong>Median of halves</strong> (TI-84 1-Var Stats, AP Statistics, most intro textbooks): split the sorted data at the median and take the median of each half.</li>
<li><strong>Inclusive interpolation</strong> (Excel QUARTILE.INC, Google Sheets, R default): position (n − 1)p + 1 in the sorted list, interpolating between neighbors.</li>
<li><strong>Exclusive interpolation</strong> (Excel QUARTILE.EXC, Minitab, SPSS): position (n + 1)p.</li>
</ul>
<p>Pick the method in the calculator to match your class or software. If a homework answer is off by a little, the quartile method is almost always the reason.</p>`
    },
    {
      h2: 'Should you remove outliers?',
      html: `<p>Not automatically. The fences flag values worth checking; they don't prove a value is wrong. The NIST/SEMATECH handbook advises investigating each one: a data-entry slip (48 typed for 18) should be corrected, a broken instrument reading can be dropped with a note, but a real extreme observation is often the most informative point in the data set.</p>
<p>If you keep outliers, prefer statistics that resist them: the median and IQR instead of the mean and <a href="/standard-deviation-calculator">standard deviation</a>. For roughly normal data, a value more than 3 standard deviations from the mean (|z| > 3, see the <a href="/z-score-calculator">z-score calculator</a>) is another common screen, and formal tests such as Grubbs' test exist for a single suspected outlier. The IQR rule's advantage is that the outlier itself can't inflate the fences, which happens with the mean and SD.</p>`
    }
  ],
  faq: [
    { q: 'What is the 1.5 IQR rule?', a: 'A value is an outlier if it lies more than 1.5 interquartile ranges below Q1 or above Q3. The rule comes from John Tukey\'s box plot and flags about 0.7% of values in normally distributed data.' },
    { q: 'How do you calculate the upper fence?', a: 'Upper fence = Q3 + 1.5 × (Q3 − Q1). With Q1 = 17 and Q3 = 24, the upper fence is 24 + 1.5 × 7 = 34.5.' },
    { q: 'Can the lower fence be negative?', a: 'Yes. If Q1 is small relative to the IQR, the lower fence drops below zero. For data that can\'t be negative, such as times or prices, that just means there can be no low outliers.' },
    { q: 'What is the difference between an outlier and an extreme outlier?', a: 'Outliers fall beyond 1.5 × IQR from the quartiles (the inner fences). Extreme outliers fall beyond 3 × IQR (the outer fences).' },
    { q: 'Is a value exactly on the fence an outlier?', a: 'No. Under the usual definition a value must be strictly below the lower fence or strictly above the upper fence to count as an outlier.' },
    { q: 'How do I find outliers on a TI-84?', a: 'Enter the data in L1, run STAT → CALC → 1-Var Stats and note Q1 and Q3, then compute the fences by hand. For a picture, choose the modified box plot (the one with separate dots) in STAT PLOT; it marks outliers automatically.' },
    { q: 'Does the IQR method work for skewed data?', a: 'It flags more values on the long tail of skewed data because the rule assumes a roughly symmetric distribution. For strongly skewed data, consider a log transformation first or an adjusted box plot.' }
  ],
  related: ['standard-deviation-calculator', 'z-score-calculator', 'coefficient-of-variation-calculator', 'moving-average-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: What are outliers in the data?', url: 'https://www.itl.nist.gov/div898/handbook/prc/section1/prc16.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Box Plot', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/boxplot.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Detection of Outliers', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm' },
    { name: 'Microsoft Support: QUARTILE.INC function', url: 'https://support.microsoft.com/en-us/excel/functions/quartile-inc-function' },
    { name: 'Microsoft Support: QUARTILE.EXC function', url: 'https://support.microsoft.com/en-us/excel/functions/quartile-exc-function' }
  ]
};
