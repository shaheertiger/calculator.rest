export default {
  slug: 'average-calculator',
  hub: 'math',
  name: 'Average Calculator',
  title: 'Average Calculator: 10 Test Scores Average 86.6 (Median 88.5)',
  h1: 'Mean, Median, Mode and Range Calculator for Any List of Numbers',
  meta: 'Ten test scores that add to 866 have a mean of 86.6, a median of 88.5 and a mode of 92. Paste any list for the mean, median, mode, range, trimmed mean and more.',
  keyword: 'how to calculate the mean of a sample',
  also: ['average calculator', 'mean median mode calculator', 'how to calculate the sample mean', 'how to calculate sample mean in excel', 'how to calculate the range of a data set', 'how to calculate the trimmed mean', 'how to calculate geometric mean in excel', 'how to calculate average temperature', 'how to calculate average temp'],
  updated: '2026-11-13',
  inputs: [
    { id: 'data', label: 'Your numbers (separated by commas, spaces or new lines)', type: 'text', multiline: 4, value: '85, 92, 78, 90, 88, 76, 95, 89, 92, 81' },
    { id: 'trim', label: 'Trimmed mean: cut from each end', type: 'select', value: '10', options: [['0', 'No trimming'], ['5', '5% each end'], ['10', '10% each end'], ['20', '20% each end'], ['25', '25% each end']] }
  ],
  compute(v, H) {
    var x = H.list(v.data);
    var n = x.length;
    if (!n) return { error: 'Enter at least one number.' };
    function f(t) { var a = Math.abs(t); return a !== 0 && (a < 1e-6 || a >= 1e15) ? H.sig(t, 8) : H.num(t, 4); }
    var s = H.sorted(x), sum = H.sum(x), mean = sum / n, med = H.median(x), modes = H.mode(x);
    var rows = [
      ['Median (middle value)', f(med), true],
      ['Mode (most frequent)', modes.length ? modes.map(f).join(', ') + (modes.length > 1 ? ' (multimodal)' : '') : 'none (no value repeats)'],
      ['Range (max − min)', f(s[n - 1] - s[0]) + ' (' + f(s[0]) + ' to ' + f(s[n - 1]) + ')'],
      ['Count and sum', n + (n === 1 ? ' value' : ' values') + ', sum ' + f(sum)]
    ];
    var p = Number(v.trim) || 0;
    if (p > 0) {
      var cut = Math.floor(n * p / 100);
      if (n - 2 * cut < 1) rows.push([p + '% trimmed mean', 'needs more values']);
      else rows.push([p + '% trimmed mean', f(H.mean(s.slice(cut, n - cut))) + (cut ? ' (drops ' + cut + ' from each end)' : ' (too few values to drop any)')]);
    }
    if (n >= 2) {
      var sd = H.sd(x, true);
      rows.push(['Sample standard deviation (s)', f(sd)]);
      rows.push(['Population standard deviation (σ)', f(H.sd(x, false))]);
      rows.push(['Standard error of the mean', f(sd / Math.sqrt(n))]);
    }
    if (s[0] > 0) {
      rows.push(['Geometric mean', f(Math.exp(H.mean(x.map(Math.log))))]);
      rows.push(['Harmonic mean', f(n / H.sum(x.map(function (t) { return 1 / t; })))]);
    }
    return {
      value: f(mean), label: 'Mean (average) of ' + n + ' value' + (n === 1 ? '' : 's'),
      expr: f(sum) + ' ÷ ' + n, rows: rows,
      sub: n >= 3 ? (Math.abs(mean - med) <= 0.1 * (H.sd(x, true) || 1) ? 'Mean and median are close, so the data are fairly symmetric.' : mean < med ? 'The mean is below the median: a few low values pull it down (left skew).' : 'The mean is above the median: a few high values pull it up (right skew).') : ''
    };
  },
  quick: ({ r }) => `To calculate the mean of a sample, add the values and divide by how many there are: x̄ = Σx ÷ n. Ten test scores of 85, 92, 78, 90, 88, 76, 95, 89, 92 and 81 add to 866, so the mean is 866 ÷ 10 = <strong>${r.value}</strong>. The median (middle) is 88.5, the mode is 92 and the range is 19.`,
  stepsTitle: 'How to calculate the mean, median and mode',
  steps: [
    'Paste or type your numbers. Commas, spaces, tabs and line breaks all work, so a column copied from a spreadsheet is fine.',
    '<strong>Mean:</strong> add all values and divide by the count. Include zeros; leaving them out is the most common error and inflates the average.',
    '<strong>Median:</strong> sort the values and take the middle one, or the average of the middle two when the count is even.',
    '<strong>Mode and range:</strong> the mode is the value that appears most often; the range is the largest minus the smallest. Choose a trim level to see a trimmed mean that ignores extreme values.'
  ],
  formulaTitle: 'What is the formula for the sample mean?',
  formula: {
    expr: 'x̄ = (x₁ + x₂ + … + xₙ) ÷ n = Σx ÷ n<br>s = √( Σ(x − x̄)² ÷ (n − 1) ) &nbsp;·&nbsp; SE = s ÷ √n',
    vars: [['x̄', 'sample mean ("x-bar")'], ['n', 'number of values'], ['Σx', 'sum of all values'], ['s', 'sample standard deviation'], ['SE', 'standard error of the mean']],
    note: 'The sample mean and the population mean (μ) use the same formula. The difference shows up in the standard deviation, which divides by n − 1 for a sample and by n for a whole population.'
  },
  example: `<p>Scores: 85, 92, 78, 90, 88, 76, 95, 89, 92, 81.</p>
<p><strong>Mean:</strong> the sum is 866, so 866 ÷ 10 = <strong>86.6</strong>.</p>
<p><strong>Median:</strong> sorted, the list is 76, 78, 81, 85, 88, 89, 90, 92, 92, 95. The middle pair is 88 and 89, so the median is <strong>88.5</strong>.</p>
<p><strong>Mode:</strong> 92 appears twice, so the mode is <strong>92</strong>. <strong>Range:</strong> 95 − 76 = <strong>19</strong>. Dropping the top and bottom score (a 10% trimmed mean) gives 695 ÷ 8 = 86.875.</p>`,
  table: {
    title: 'How does one outlier change the mean and the median?',
    intro: 'The same ten scores with the top score (95) replaced by bigger and bigger values, recalculated by the calculator above.',
    head: ['Top value', 'Mean', 'Median', '10% trimmed mean'],
    rows: ({ run }) => [95, 100, 120, 150, 200, 500, 1000].map(t => { const o = run({ data: '85, 92, 78, 90, 88, 76, ' + t + ', 89, 92, 81', trim: '10' }); return [t.toLocaleString('en-US'), o.value, o.rows[0][1], o.rows.find(r => r[0].indexOf('trimmed') > 0)[1].replace(/ \(.*$/, '')]; }),
    note: 'The mean chases the outlier; the median and the trimmed mean do not move at all. That is why typical incomes and home prices are reported as medians.'
  },
  sections: [
    {
      h2: 'Should you use the mean, the median or the mode?',
      html: `<ul>
<li><strong>Mean:</strong> best for roughly symmetric data without extreme values, such as test scores, heights or daily temperatures. It uses every value, which also makes it sensitive to outliers.</li>
<li><strong>Median:</strong> best for skewed data such as incomes, home prices or response times, where a few huge values would drag the mean away from a typical case.</li>
<li><strong>Mode:</strong> the only average for categories (most common shoe size or survey answer) and useful for spotting the most typical value in repeated measurements.</li>
</ul>
<p>When mean and median differ a lot, report both. The calculator flags which way the data lean. For spread, the <a href="/standard-deviation-calculator">standard deviation calculator</a> goes further, and the <a href="/outlier-calculator">outlier calculator</a> finds values outside the IQR fences.</p>`
    },
    {
      h2: 'How do you calculate the mean, median and mode in Excel?',
      html: `<div class="twrap"><table><thead><tr><th>Statistic</th><th>Excel / Google Sheets</th></tr></thead><tbody>
<tr><td>Mean</td><td><code>=AVERAGE(A2:A11)</code></td></tr>
<tr><td>Median</td><td><code>=MEDIAN(A2:A11)</code></td></tr>
<tr><td>Mode</td><td><code>=MODE.SNGL(A2:A11)</code> (one) or <code>=MODE.MULT(A2:A11)</code> (all)</td></tr>
<tr><td>Range</td><td><code>=MAX(A2:A11)-MIN(A2:A11)</code></td></tr>
<tr><td>10% trimmed mean (each end)</td><td><code>=TRIMMEAN(A2:A11,0.2)</code></td></tr>
<tr><td>Geometric mean</td><td><code>=GEOMEAN(A2:A11)</code></td></tr>
<tr><td>Sample standard deviation</td><td><code>=STDEV.S(A2:A11)</code></td></tr>
</tbody></table></div>
<p>TRIMMEAN's percentage is the <em>total</em> share removed, split between both ends, so 0.2 drops 10% from each end. AVERAGE skips blank cells and text but counts zeros, so a blank and a 0 give different results.</p>`
    },
    {
      h2: 'What is a trimmed mean and when is it used?',
      html: `<p>A trimmed mean sorts the data, drops the same number of values from each end, and averages what is left. With 10 values, 10% trimming removes one from each end. It sits between the mean (no trimming) and the median (maximum trimming).</p>
<p>Judged sports such as diving and figure skating use the idea by discarding the highest and lowest judges' marks, and economists track trimmed-mean inflation to filter out extreme price swings. Use it when a few values are suspect but you still want an average that reflects most of the data.</p>`
    },
    {
      h2: 'How do you calculate an average temperature?',
      html: `<p>The standard daily mean temperature used by NOAA's National Centers for Environmental Information is the average of the day's high and low: a high of 84°F and a low of 62°F give (84 + 62) ÷ 2 = <strong>73°F</strong>. A monthly mean averages the daily means, and the annual mean averages the months.</p>
<p>If you have readings every hour, the mean of all 24 is more representative, but it will not match published climate normals, which use the max-plus-min method. Paste the readings above either way.</p>`
    }
  ],
  faq: [
    { q: 'What is the mean of a sample?', a: 'The sample mean, x̄, is the sum of the sample values divided by the number of values. It estimates the population mean μ, and is calculated the same way.' },
    { q: 'How do you find the median of an even number of values?', a: 'Sort the values and average the two in the middle. For 76, 78, 81, 85, 88, 89, 90, 92, 92, 95 the middle pair is 88 and 89, so the median is 88.5.' },
    { q: 'What if no number repeats?', a: 'Then the data have no mode. If two values tie for most frequent, the data are bimodal and both are modes.' },
    { q: 'Does the average have to be one of the numbers?', a: 'No. The mean of 1, 2, 3 and 4 is 2.5, which is not in the list. The median can also fall between values; only the mode is always an actual data value.' },
    { q: 'Should zeros be included in an average?', a: 'Yes, if they are real measurements (a 0 on a quiz, a day with no sales). Leave out only missing data. Excel\'s AVERAGE counts zeros but skips blank cells.' },
    { q: 'When should you use the geometric mean?', a: 'For rates that compound, such as investment returns. Returns of +10%, −5% and +20% average (1.10 × 0.95 × 1.20)^(1/3) − 1 = 7.84% a year, not the 8.33% arithmetic mean.' },
    { q: 'Can you average averages?', a: 'Only when each average covers the same number of items. Otherwise, weight each average by its count; the weighted average calculator does this.' }
  ],
  related: ['weighted-average-calculator', 'standard-deviation-calculator', 'outlier-calculator', 'moving-average-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook of Statistical Methods: Measures of Location', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm' },
    { name: 'Microsoft Support: TRIMMEAN function', url: 'https://support.microsoft.com/en-us/office/trimmean-function-d90c9878-a119-4746-88fa-63d988f511d3' },
    { name: 'Microsoft Support: AVERAGE function', url: 'https://support.microsoft.com/en-us/office/average-function-047bac88-d466-426c-a32b-8f33eb960cf6' },
    { name: 'NOAA NCEI: U.S. Climate Normals', url: 'https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals' }
  ]
};
