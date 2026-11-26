export default {
  slug: 'moving-average-calculator',
  hub: 'school',
  name: 'Moving Average Calculator',
  title: 'Moving Average Calculator: 3-Day Average = 69.67 (Steps)',
  meta: 'The 3-day moving average of 70, 66 and 73 is 69.67: 209 ÷ 3. Find simple, weighted or cumulative moving averages for any list, with each window worked out.',
  keyword: 'moving average calculator',
  also: ['3 day moving average', 'rolling average calculator', '7 day rolling average', 'weighted moving average', 'how to calculate moving average'],
  updated: '2026-11-26',
  answer: ({ r }) => `The latest 3-day moving average of these temperatures is <strong>${r.value}</strong>: (70 + 66 + 73) ÷ 3 = 209 ÷ 3.`,
  inputs: [
    { id: 'data', label: 'Values, oldest first', type: 'text', value: '62, 65, 61, 68, 70, 66, 73', wide: true, placeholder: 'e.g. daily high temperatures' },
    { id: 'w', label: 'Window (how many values per average)', type: 'number', value: 3 },
    { id: 'type', label: 'Type', type: 'select', value: 'sma', options: [['sma', 'Simple'], ['wma', 'Weighted (newest counts most)'], ['cma', 'Cumulative (running average)']] }
  ],
  compute(v, H) {
    var d = H.list(v.data), n = d.length, w = Math.floor(v.w), t = v.type;
    var f = function (x) { return H.num(x, 4); };
    var two = function (x) { return H.num(H.round(x, 2), 2); };
    var rule = function (x) { return Math.abs(H.round(x, 2) - x) < 1e-9 ? 'exact, no rounding needed' : 'rounded to 2 decimal places'; };
    if (n < 2) return { error: 'Enter at least two values, oldest first.' };
    if (t !== 'cma') {
      if (!(w >= 2)) return { error: 'Enter a window of at least 2 values.' };
      if (w > n) return { error: 'The window (' + w + ') is longer than the list (' + n + ' values).' };
    }
    var steps = [], all = [], i, j, s;
    if (t === 'cma') {
      steps.push('<b>Formula:</b> Cumulative average after k values = (x₁ + x₂ + … + xₖ) ÷ k');
      s = 0;
      for (i = 0; i < n; i++) { s += d[i]; all.push(s / (i + 1)); }
      var showC = n <= 8 ? d.map(function (x, k) { return k; }) : [0, 1, n - 2, n - 1];
      showC.forEach(function (k, idx) {
        if (n > 8 && idx === 2) steps.push('<b>Values 3 to ' + (n - 2) + ':</b> keep adding the next value and dividing by the new count');
        var run = 0; for (j = 0; j <= k; j++) run += d[j];
        steps.push('<b>After ' + (k + 1) + ':</b> ' + f(run) + ' ÷ ' + (k + 1) + ' = ' + two(run / (k + 1)));
      });
      steps.push('<b>Answer:</b> the cumulative average of all ' + n + ' values is ' + two(all[n - 1]) + ' (' + rule(all[n - 1]) + ').');
      return { value: two(all[n - 1]), label: 'Cumulative average of ' + n + ' values', expr: f(H.sum(d)) + ' ÷ ' + n, table: n > 8 ? { head: ['After value', 'Running average'], rows: all.map(function (a, k) { return [String(k + 1), two(a)]; }) } : null, steps: steps };
    }
    if (t === 'wma') {
      var den = w * (w + 1) / 2;
      for (i = w - 1; i < n; i++) { s = 0; for (j = 0; j < w; j++) s += (j + 1) * d[i - w + 1 + j]; all.push(s / den); }
      var last = d.slice(n - w), num = 0;
      steps.push('<b>Formula:</b> WMA = (1 × oldest + 2 × next + … + ' + w + ' × newest) ÷ (1 + 2 + … + ' + w + ')');
      steps.push('<b>Substitute:</b> the last ' + w + ' values are ' + last.map(f).join(', ') + ', so WMA = (' + last.map(function (x, k) { return (k + 1) + ' × ' + f(x); }).join(' + ') + ') ÷ ' + den);
      steps.push('<b>Multiply:</b> ' + last.map(function (x, k) { num += (k + 1) * x; return (k + 1) + ' × ' + f(x) + ' = ' + f((k + 1) * x); }).join(', '));
      steps.push('<b>Add:</b> ' + last.map(function (x, k) { return f((k + 1) * x); }).join(' + ') + ' = ' + f(num));
      steps.push('<b>Sum of the weights:</b> ' + last.map(function (x, k) { return k + 1; }).join(' + ') + ' = ' + den);
      steps.push('<b>Divide:</b> ' + f(num) + ' ÷ ' + den + ' = ' + H.num(num / den, 6));
      steps.push('<b>Answer:</b> the latest ' + w + '-value weighted moving average is ' + two(num / den) + ' (' + rule(num / den) + ').');
      return { value: two(num / den), label: 'Latest ' + w + '-value weighted moving average', expr: f(num) + ' ÷ ' + den, table: { head: ['Values', 'Weighted average'], rows: all.map(function (a, k) { return [(k + 1) + '–' + (k + w), two(a)]; }) }, steps: steps };
    }
    steps.push('<b>Formula:</b> SMA = (sum of the last ' + w + ' values) ÷ ' + w + ', recalculated each time the window slides one value forward');
    var cnt = n - w + 1, shown = cnt <= 6 ? null : [0, 1, cnt - 2, cnt - 1];
    for (i = 0; i < cnt; i++) {
      var win = d.slice(i, i + w); s = H.sum(win); all.push(s / w);
      if (shown && shown.indexOf(i) === -1) { if (i === 2) steps.push('<b>Windows 3 to ' + (cnt - 2) + ':</b> drop the oldest value, add the next one, divide by ' + w + ' again'); continue; }
      steps.push('<b>Values ' + (i + 1) + '–' + (i + w) + ':</b> (' + win.map(f).join(' + ') + ') ÷ ' + w + ' = ' + f(s) + ' ÷ ' + w + ' = ' + two(s / w));
    }
    steps.push('<b>Answer:</b> the latest ' + w + '-value moving average is ' + two(all[cnt - 1]) + ' (' + rule(all[cnt - 1]) + '); there are ' + cnt + ' averages in all, because the first ' + (w === 2 ? 'value has' : (w - 1) + ' values have') + ' no full window.');
    return { value: two(all[cnt - 1]), label: 'Latest ' + w + '-value simple moving average', expr: f(H.sum(d.slice(n - w))) + ' ÷ ' + w, table: shown ? { head: ['Values', 'Moving average'], rows: all.map(function (a, k) { return [(k + 1) + '–' + (k + w), two(a)]; }) } : null, steps: steps };
  },
  facts: {
    formula: 'Simple: SMA = (x<sub>t−N+1</sub> + … + x<sub>t</sub>) ÷ N<br>Weighted: WMA = (1·x<sub>t−N+1</sub> + … + N·x<sub>t</sub>) ÷ (1 + 2 + … + N)',
    vars: [['x<sub>t</sub>', 'the newest value in the window'], ['N', 'the window: how many values go into each average'], ['t', 'the position of the newest value, counting from the oldest']],
    rounding: 'add and divide at full precision, then round each moving average, usually to 2 decimal places or to the precision of the data.',
    note: 'A list of n values has n − N + 1 simple moving averages, because the first N − 1 values do not yet have a full window behind them.'
  },
  example: {
    h2: 'Worked example: a café\'s 4-day moving average',
    html: `<p><strong>Problem:</strong> A café sells 40, 46, 52, 49, 58 and 61 cups of hot chocolate from Monday to Saturday. Find every 4-day moving average.</p>
<p><strong>1.</strong> Monday to Thursday: 40 + 46 + 52 + 49 = 187, and 187 ÷ 4 = 46.75.</p>
<p><strong>2.</strong> Slide one day: Tuesday to Friday is 46 + 52 + 49 + 58 = 205, and 205 ÷ 4 = 51.25.</p>
<p><strong>3.</strong> Wednesday to Saturday: 52 + 49 + 58 + 61 = 220, and 220 ÷ 4 = 55.</p>
<p><strong>Answer:</strong> the 4-day moving averages are 46.75, 51.25 and 55. Sense check: 6 days with a 4-day window give 6 − 4 + 1 = 3 averages, and they rise steadily while staying below Saturday's 61, because each one still includes slower days.</p>`
  },
  variants: [
    {
      h2: 'How do you calculate a 3-day moving average?',
      html: `<p>Average the first three values, then drop the oldest and add the next, and repeat. For the temperatures 62, 65, 61, 68, 70, 66 and 73, the 3-day averages are 62.67, 64.67, 66.33, 68 and <strong>69.67</strong>. A shortcut for the next one: new average = old average + (value added − value dropped) ÷ 3. Going from 68 to the last window: 68 + (73 − 68) ÷ 3 = 69.67.</p>`
    },
    {
      h2: 'What is a 7-day rolling average?',
      html: `<p>It is a moving average with a window of 7, which smooths out day-of-the-week ups and downs in daily data. Add the latest 7 days and divide by 7: for the seven temperatures above, 465 ÷ 7 = <strong>66.43</strong>. In a spreadsheet with values in B2:B8, the same number is <code>=AVERAGE(B2:B8)</code>; fill it down and each row averages its own last 7 days.</p>`
    },
    {
      h2: 'Simple vs weighted moving average',
      html: `<p>A simple moving average treats every value in the window equally. A weighted one multiplies the newest by N, the one before by N − 1, and so on, then divides by the sum of those weights. For 70, 66 and 73: (1 × 70 + 2 × 66 + 3 × 73) ÷ 6 = 421 ÷ 6 = <strong>70.17</strong>, closer to the latest 73 than the simple 69.67, because recent values count more.</p>`
    }
  ],
  mistakes: [
    '<strong>Dividing by the whole list length.</strong> A 3-value moving average always divides by 3, no matter how long the list is.',
    '<strong>Starting too early.</strong> The first moving average sits at the third value of a 3-value window. Writing an "average" next to the first or second value mixes in a different window size.',
    '<strong>Dividing a weighted average by N.</strong> The weights 1, 2 and 3 add to 6, so a 3-value weighted average divides by 6, not 3.',
    '<strong>Entering the newest value first.</strong> Order matters for the weighted average and for which window is "latest". List values oldest to newest.'
  ],
  related: ['average-calculator', 'grade-calculator', 'slope-calculator', 'percentage-calculator'],
  faq: [
    { q: 'Why are there fewer moving averages than values?', a: 'Each average needs a full window. With 7 values and a window of 3, only 7 − 3 + 1 = 5 windows fit.' },
    { q: 'What window size should I use?', a: 'Match it to the pattern you want to smooth: 7 for daily data with a weekly rhythm, 3 to 5 for a light smoothing, 12 for monthly data across a year. Bigger windows are smoother but slower to react.' },
    { q: 'Is a cumulative average a moving average?', a: 'Not quite. A cumulative average divides everything so far by the count so far, so its window keeps growing. A moving average keeps the same window and forgets the oldest value each time.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Moving Average', url: 'https://mathworld.wolfram.com/MovingAverage.html' }
  ]
};
