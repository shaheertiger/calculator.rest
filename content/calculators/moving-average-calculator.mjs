export default {
  slug: 'moving-average-calculator',
  hub: 'statistics',
  name: 'Moving Average Calculator',
  title: 'Moving Average Calculator: 3-Month SMA of 180, 176, 190 = 182',
  h1: 'Moving Average Calculator: Simple, Exponential, Weighted and Cumulative',
  meta: 'Twelve months of sales ending 180, 176 and 190 have a 3-month simple moving average of 182. Paste any series to get SMA, EMA, WMA or a running average.',
  keyword: 'how to calculate moving average in excel',
  also: ['moving average calculator', 'how to calculate rolling average in excel', 'how to calculate a rolling average in excel', 'how to calculate running average in excel', 'how to calculate a running average in excel', 'exponential moving average calculator', 'rolling average calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'data', label: 'Series, oldest first', type: 'text', multiline: 5, wide: true, value: '120, 135, 128, 142, 150, 138, 160, 172, 165, 180, 176, 190', placeholder: 'One value per period, oldest to newest' },
    { id: 'w', label: 'Window (periods)', type: 'number', value: 3 },
    { id: 'type', label: 'Type', type: 'select', value: 'sma', options: [['sma', 'Simple (SMA)'], ['ema', 'Exponential (EMA)'], ['wma', 'Weighted (WMA, linear)'], ['cma', 'Cumulative / running average']] }
  ],
  compute(v, H) {
    var d = H.list(v.data), n = d.length, w = Math.floor(v.w), t = v.type;
    if (n < 2) return { error: 'Enter at least two values.' };
    if (t !== 'cma') {
      if (!(w >= 1)) return { error: 'Enter a window of at least 1 period.' };
      if (w > n) return { error: 'The window (' + w + ') is longer than the series (' + n + ' values).' };
    }
    var out = [], i, j, s;
    var alpha = 2 / (w + 1);
    for (i = 0; i < n; i++) {
      if (t === 'cma') { s = 0; for (j = 0; j <= i; j++) s += d[j]; out.push(s / (i + 1)); continue; }
      if (i < w - 1) { out.push(null); continue; }
      if (t === 'wma') { var num = 0, den = 0; for (j = 0; j < w; j++) { num += (w - j) * d[i - j]; den += w - j; } out.push(num / den); }
      else if (t === 'ema' && i > w - 1) out.push(alpha * d[i] + (1 - alpha) * out[i - 1]);
      else { s = 0; for (j = i - w + 1; j <= i; j++) s += d[j]; out.push(s / w); }
    }
    var last = out[n - 1], prev = out[n - 2];
    var names = { sma: 'simple moving average', ema: 'exponential moving average', wma: 'weighted moving average', cma: 'cumulative average' };
    var exprs = {
      sma: '(' + d.slice(n - w).map(function (x) { return H.num(x, 4); }).join(' + ') + ') ÷ ' + w,
      ema: H.fix(alpha, 4) + ' × ' + H.num(d[n - 1], 4) + ' + ' + H.fix(1 - alpha, 4) + ' × ' + (prev == null ? '—' : H.num(prev, 2)),
      wma: '(' + d.slice(n - w).map(function (x, k) { return (k + 1) + '×' + H.num(x, 4); }).reverse().join(' + ') + ') ÷ ' + (w * (w + 1) / 2),
      cma: H.num(H.sum(d), 4) + ' ÷ ' + n
    };
    var rows = [['Periods averaged', t === 'cma' ? 'all ' + n : String(w)], ['Previous value', prev == null ? '—' : H.num(prev, 2)], ['Change from previous', prev == null ? '—' : H.num(last - prev, 2), true], ['Latest raw value', H.num(d[n - 1], 4)], ['Values in series', String(n)]];
    if (t === 'ema') rows.push(['Smoothing factor α = 2 ÷ (N + 1)', H.fix(alpha, 4)]);
    if (t === 'sma' || t === 'cma') rows.push(['Excel (last value)', '<code>=AVERAGE(B' + (t === 'cma' ? 2 : n - w + 2) + ':B' + (n + 1) + ')</code>']);
    return {
      value: H.num(last, 2), label: 'Latest ' + (t === 'cma' ? '' : w + '-period ') + names[t],
      expr: exprs[t], rows: rows,
      sub: 'The latest value is ' + (d[n - 1] >= last ? 'above' : 'below') + ' its ' + names[t] + ', ' + (d[n - 1] >= last ? 'a sign the series is running ahead of its recent trend.' : 'a sign the series is cooling relative to its recent trend.'),
      table: { head: ['Period', 'Value', names[t].replace(/^./, function (c) { return c.toUpperCase(); })], rows: d.map(function (x, k) { return [String(k + 1), H.num(x, 4), out[k] == null ? '—' : H.num(out[k], 2)]; }) },
      _out: out
    };
  },
  quick: ({ r }) => `A moving average is the mean of the last N values, recalculated each period. For 12 months of sales ending <strong>180, 176 and 190</strong>, the 3-month simple moving average is (180 + 176 + 190) ÷ 3 = <strong>${r.value}</strong>, up from 173.67 the month before. In Excel, type <code>=AVERAGE(B2:B4)</code> next to the third month and fill it down.`,
  stepsTitle: 'How to calculate a moving average',
  steps: [
    'Choose the window N: 3 or 4 periods react quickly, 12 months removes seasonality, 50 or 200 days are standard for stock prices.',
    'Average the first N values and record it against the N-th period. There is no value for the first N − 1 periods; filling them in with partial averages is a common mistake.',
    'Slide the window forward one period: drop the oldest value, add the newest, average again.',
    'For an exponential moving average, start from the first SMA and then use EMA = α × today + (1 − α) × yesterday\'s EMA, with α = 2 ÷ (N + 1).',
    'Plot the averages with the raw data to see the trend without the noise.'
  ],
  formulaTitle: 'What are the moving average formulas?',
  formula: {
    expr: 'SMA<sub>t</sub> = (x<sub>t</sub> + x<sub>t−1</sub> + … + x<sub>t−N+1</sub>) ÷ N<br>EMA<sub>t</sub> = α·x<sub>t</sub> + (1 − α)·EMA<sub>t−1</sub>, α = 2 ÷ (N + 1)<br>WMA<sub>t</sub> = (N·x<sub>t</sub> + (N−1)·x<sub>t−1</sub> + … + 1·x<sub>t−N+1</sub>) ÷ [N(N + 1)/2]<br>Cumulative average<sub>t</sub> = (x<sub>1</sub> + … + x<sub>t</sub>) ÷ t',
    vars: [['x<sub>t</sub>', 'value in period t'], ['N', 'window length'], ['α', 'smoothing factor (weight on the newest value)']],
    note: 'This calculator seeds the EMA with the simple average of the first N values, the usual convention in charting software. Seeding with the first raw value instead gives slightly different early values that converge after a few windows.'
  },
  example: `<p>Monthly sales (units): 120, 135, 128, 142, 150, 138, 160, 172, 165, 180, 176, 190.</p>
<p>3-month SMA for March = (120 + 135 + 128) ÷ 3 = <strong>127.67</strong>. April = (135 + 128 + 142) ÷ 3 = 135.00. December = (180 + 176 + 190) ÷ 3 = <strong>182.00</strong>.</p>
<p>3-month EMA (α = 0.5): starts at 127.67 in March, then April = 0.5 × 142 + 0.5 × 127.67 = 134.83, and December ends at <strong>181.88</strong>.</p>
<p>3-month WMA for December = (3 × 190 + 2 × 176 + 1 × 180) ÷ 6 = <strong>183.67</strong>, higher than the SMA because the latest, highest month gets the most weight.</p>`,
  table: {
    title: 'How do simple, exponential and weighted averages compare?',
    intro: 'Three-period averages of the example sales series, computed by the calculator. The weighted and exponential versions react faster to the latest months.',
    head: ['Month', 'Sales', 'SMA (3)', 'EMA (3)', 'WMA (3)'],
    rows: ({ run, H, v }) => {
      const d = H.list(v.data), s = run({ type: 'sma', w: 3 })._out, e = run({ type: 'ema', w: 3 })._out, w = run({ type: 'wma', w: 3 })._out;
      const f = x => x == null ? '—' : H.fix(x, 2);
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => [m, String(d[i]), f(s[i]), f(e[i]), f(w[i])]);
    },
    note: 'Every moving average lags the data. The longer the window, the smoother the line and the bigger the lag: a simple N-period average trails by about (N − 1) ÷ 2 periods.'
  },
  sections: [
    {
      h2: 'How do you calculate a moving average in Excel?',
      html: `<p>With months in column A and values in B2:B13:</p>
<ol>
<li>In C4 (the third month) type <code>=AVERAGE(B2:B4)</code>.</li>
<li>Drag the fill handle down to C13. The relative references slide one row at a time, giving a 3-month rolling average.</li>
</ol>
<p>Other routes: the Analysis ToolPak's <strong>Data → Data Analysis → Moving Average</strong> asks for the input range and an Interval (3) and writes the column for you (#N/A for the first two rows). On a line chart, <strong>Add Trendline → Moving Average</strong> with Period 3 draws the line without any formulas. For the average of only the latest 3 values in a growing column, use <code>=AVERAGE(OFFSET(B2,COUNT(B2:B1000)-3,0,3,1))</code>, which also works in Google Sheets.</p>
<p>Exponential version: put α in F1 (<code>=2/(3+1)</code>), seed C4 with <code>=AVERAGE(B2:B4)</code>, then in C5 type <code>=$F$1*B5+(1-$F$1)*C4</code> and fill down.</p>`
    },
    {
      h2: 'What is the difference between a rolling, running and moving average?',
      html: `<p><strong>Rolling average</strong> and <strong>moving average</strong> mean the same thing: the mean of a fixed-length window that moves forward one period at a time. A 7-day rolling average of daily case counts or sales always covers exactly 7 days.</p>
<p>A <strong>running average</strong> (cumulative average) grows instead: it averages everything from the start up to now. In Excel, anchor the first cell: <code>=AVERAGE($B$2:B2)</code> in C2, filled down. For the example the running average reaches 154.67 by December, far below the 3-month moving average of 182, because it still remembers the slow early months. Choose "Cumulative / running average" above to see it.</p>`
    },
    {
      h2: 'Simple, exponential or weighted: which moving average should you use?',
      html: `<ul>
<li><strong>Simple (SMA):</strong> every value in the window counts equally. Easiest to explain and audit; the standard for smoothing sales, web traffic and other business series.</li>
<li><strong>Exponential (EMA):</strong> weights fall off geometrically, so recent data dominate but nothing is dropped abruptly. Favored for stock and crypto charts (12- and 26-day EMAs feed the MACD indicator) and for forecasting by simple exponential smoothing.</li>
<li><strong>Weighted (WMA):</strong> linear weights N, N − 1, …, 1. Reacts faster than an SMA but drops old values cleanly at the window edge.</li>
</ul>
<p>For forecasting, the last moving average is often used as next period's forecast; NIST's handbook treats single moving averages and exponential smoothing as the two basic smoothing methods. If the series has a steady upward trend, every moving average will under-forecast it; fit a trend line with the <a href="/r-squared-calculator">R-squared calculator</a> instead.</p>`
    },
    {
      h2: 'How do you pick the window length?',
      html: `<p>Match the window to the noise you want to remove. A 7-day window cancels day-of-week effects in daily data, a 12-month window cancels seasonality in monthly data, and a 4-quarter window does the same for quarterly figures. Shorter windows follow turns sooner but keep more noise; longer windows are smoother but lag. If you're unsure, compare two windows side by side, or test which one gives the smallest forecast errors on past data.</p>`
    }
  ],
  faq: [
    { q: 'What is a 3-month moving average?', a: 'It is the average of the latest three months, recalculated each month. For sales of 180, 176 and 190, the 3-month moving average is 182.' },
    { q: 'Why does the moving average start at the third value?', a: 'An N-period average needs N values, so a 3-period average first exists at period 3. The first N − 1 periods are left blank rather than filled with averages of fewer values.' },
    { q: 'What smoothing factor does a 10-day EMA use?', a: 'α = 2 ÷ (10 + 1) = 0.1818, so today\'s price gets about 18% of the weight and the previous EMA gets about 82%.' },
    { q: 'Is a rolling average the same as a moving average?', a: 'Yes. Both terms describe the average of a fixed-size window that moves forward through the data. A running (cumulative) average is different: it includes every value from the start.' },
    { q: 'How do I calculate a 7-day rolling average in Excel?', a: 'Put =AVERAGE(B2:B8) next to the seventh day and fill down. Each row then averages that day and the six days before it.' },
    { q: 'Does a moving average predict the future?', a: 'Only naively. Using the latest moving average as next period\'s forecast works for series without a trend; with a trend it lags behind, and with seasonality you need a seasonal method.' },
    { q: 'What is a centered moving average?', a: 'A centered moving average places each average at the middle of its window instead of the end, which removes the lag. It is used in seasonal decomposition, but it can\'t be calculated for the newest periods.' }
  ],
  related: ['r-squared-calculator', 'standard-deviation-calculator', 'outlier-calculator', 'coefficient-of-variation-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: What are Moving Average or Smoothing Techniques?', url: 'https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc42.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Single Moving Average', url: 'https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc421.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Single Exponential Smoothing', url: 'https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc431.htm' },
    { name: 'Microsoft Support: AVERAGE function', url: 'https://support.microsoft.com/en-us/excel/functions/average-function' }
  ]
};
