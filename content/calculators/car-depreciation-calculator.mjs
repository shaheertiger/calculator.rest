export default {
  slug: 'car-depreciation-calculator',
  hub: 'math',
  name: 'Car Depreciation Calculator',
  title: 'Car Depreciation Calculator: Halves Every 3.5 Years (Steps)',
  meta: 'A $27,000 car that halves in value every 3.5 years is worth about $3,700 after 10 years. Solve half-life and percent-per-year depreciation problems with steps.',
  keyword: 'car depreciation calculator',
  also: ['a new car is purchased for $27,000 and over time its value depreciates by one half every 3.5 years', 'exponential decay calculator', 'half-life depreciation', 'vehicle depreciation calculator', 'auto depreciation calculator'],
  updated: '2026-11-26',
  answer: ({ r }) => `A $27,000 car that loses half its value every 3.5 years is worth about <strong>${r.value}</strong> after 10 years: 27,000 × (1/2)<sup>10 ÷ 3.5</sup>.`,
  inputs: [
    { id: 'mode', label: 'The problem says', type: 'select', value: 'half', wide: true, options: [['half', 'Halves every N years: find the value'], ['halfTime', 'Halves every N years: how long until $X'], ['pct', 'Loses r% a year: find the value'], ['pctTime', 'Loses r% a year: how long until $X']] },
    { id: 'v0', label: 'Purchase price (V₀)', type: 'number', value: 27000, prefix: '$' },
    { id: 'h', label: 'Halves every (h)', type: 'number', value: 3.5, suffix: 'years', showIf: { mode: ['half', 'halfTime'] } },
    { id: 'rate', label: 'Loses each year (r)', type: 'number', value: 15, suffix: '%', showIf: { mode: ['pct', 'pctTime'] } },
    { id: 't', label: 'Years after purchase (t)', type: 'number', value: 10, suffix: 'years', showIf: { mode: ['half', 'pct'] } },
    { id: 'target', label: 'Target value (V)', type: 'number', value: 3100, prefix: '$', showIf: { mode: ['halfTime', 'pctTime'] } },
    { id: 'round', label: 'Round the value to the nearest', type: 'select', value: '100', options: [['100', 'hundred dollars'], ['1', 'dollar'], ['0.01', 'cent']], showIf: { mode: ['half', 'pct'] } },
    { id: 'tround', label: 'Round the time to the nearest', type: 'select', value: '0.1', options: [['0.1', 'tenth of a year'], ['1', 'whole year'], ['0.01', 'hundredth of a year']], showIf: { mode: ['halfTime', 'pctTime'] } }
  ],
  compute(v, H) {
    var m = v.mode;
    if (!(v.v0 > 0)) return { error: 'Enter the purchase price.' };
    var isHalf = m === 'half' || m === 'halfTime';
    if (isHalf && !(v.h > 0)) return { error: 'Enter how many years it takes to lose half its value.' };
    if (!isHalf && !(v.rate > 0 && v.rate < 100)) return { error: 'Enter a yearly loss between 0% and 100%.' };
    var r = v.rate / 100, b = isHalf ? 0.5 : 1 - r;
    var money = function (x) { return H.money(x, 2); };
    var p = function (x) { return H.num(x, 6); };
    var formula = isHalf ? 'V = V₀ × (1/2)<sup>t ÷ h</sup>' : 'V = V₀ × (1 − r)<sup>t</sup>';
    if (m === 'half' || m === 'pct') {
      if (!(v.t >= 0)) return { error: 'Enter the number of years.' };
      var e = isHalf ? v.t / v.h : v.t, f = Math.pow(b, e), val = v.v0 * f;
      var step = Number(v.round) || 100, rounded = Math.round(val / step) * step;
      var unit = step === 100 ? 'hundred dollars' : step === 1 ? 'dollar' : 'cent';
      var shown = step === 0.01 ? money(rounded) : H.money(rounded, 0);
      var steps = ['<b>Formula:</b> ' + formula];
      if (isHalf) {
        steps.push('<b>Substitute:</b> V = ' + H.num(v.v0, 2) + ' × (1/2)<sup>' + H.num(v.t, 4) + ' ÷ ' + H.num(v.h, 4) + '</sup>');
        steps.push('<b>Exponent (number of half-lives):</b> ' + H.num(v.t, 4) + ' ÷ ' + H.num(v.h, 4) + ' = ' + p(e));
        steps.push('<b>Power:</b> (1/2)<sup>' + p(e) + '</sup> = 0.5<sup>' + p(e) + '</sup> = ' + p(f));
      } else {
        steps.push('<b>Substitute:</b> V = ' + H.num(v.v0, 2) + ' × (1 − ' + H.num(r, 6) + ')<sup>' + H.num(v.t, 4) + '</sup>');
        steps.push('<b>Subtract:</b> 1 − ' + H.num(r, 6) + ' = ' + H.num(b, 6) + ' (the share of its value the car keeps each year)');
        steps.push('<b>Power:</b> ' + H.num(b, 6) + '<sup>' + H.num(v.t, 4) + '</sup> = ' + p(f));
      }
      steps.push('<b>Multiply:</b> ' + H.num(v.v0, 2) + ' × ' + p(f) + ' = ' + money(val));
      steps.push('<b>Answer:</b> the car is worth ' + shown + ' after ' + H.plural(v.t, 'year') + ', rounded to the nearest ' + unit + ' (' + money(val) + ' before rounding).');
      return {
        value: shown,
        label: 'Value after ' + H.plural(v.t, 'year'),
        rows: [['Value lost', money(v.v0 - val)], ['Share of the price left', H.pct(f * 100, 2)], [isHalf ? 'Same as losing, each year' : 'Half its value is gone after', isHalf ? H.pct((1 - Math.pow(0.5, 1 / v.h)) * 100, 2) : H.num(Math.log(0.5) / Math.log(b), 2) + ' years']],
        steps: steps
      };
    }
    if (!(v.target > 0) || v.target >= v.v0) return { error: 'Enter a target value above $0 and below the purchase price.' };
    var ratio = v.target / v.v0, lr = Math.log10(ratio), lb = Math.log10(b), n = lr / lb, T = isHalf ? v.h * n : n;
    var ts = Number(v.tround) || 0.1, Tr = Math.round(T / ts) * ts, dp = ts === 1 ? 0 : ts === 0.1 ? 1 : 2;
    var tunit = ts === 1 ? 'whole year' : ts === 0.1 ? 'tenth of a year' : 'hundredth of a year';
    var st = ['<b>Formula:</b> ' + formula + '. Solve for t by taking the log of both sides: ' + (isHalf ? 't = h × log(V ÷ V₀) ÷ log(1/2)' : 't = log(V ÷ V₀) ÷ log(1 − r)'),
      '<b>Substitute:</b> t = ' + (isHalf ? H.num(v.h, 4) + ' × ' : '') + 'log(' + H.num(v.target, 2) + ' ÷ ' + H.num(v.v0, 2) + ') ÷ log(' + H.num(b, 6) + ')',
      '<b>Divide:</b> ' + H.num(v.target, 2) + ' ÷ ' + H.num(v.v0, 2) + ' = ' + p(ratio),
      '<b>Logs (base 10):</b> log(' + p(ratio) + ') = ' + p(lr) + ' and log(' + H.num(b, 6) + ') = ' + p(lb),
      '<b>Divide the logs:</b> ' + p(lr) + ' ÷ ' + p(lb) + ' = ' + p(n) + (isHalf ? ' half-lives' : ' years')];
    if (isHalf) st.push('<b>Multiply by the half-life:</b> ' + H.num(v.h, 4) + ' × ' + p(n) + ' = ' + p(T) + ' years');
    st.push('<b>Answer:</b> about ' + H.num(Tr, dp) + ' years, rounded to the nearest ' + tunit + ' (' + p(T) + ' before rounding).');
    return {
      value: H.num(Tr, dp) + ' years',
      label: 'Time until it is worth ' + money(v.target),
      rows: [['Share of the price left then', H.pct(ratio * 100, 2)]],
      steps: st
    };
  },
  facts: {
    formula: 'Halves every h years: V = V₀ × (1/2)<sup>t ÷ h</sup><br>Loses r per year: V = V₀ × (1 − r)<sup>t</sup><br>Time to reach V: t = h × log(V ÷ V₀) ÷ log(1/2)',
    vars: [['V', 'value after t years'], ['V₀', 'purchase price'], ['h', 'years it takes to lose half its value (the half-life)'], ['r', 'yearly loss as a decimal: 15% = 0.15'], ['t', 'years since purchase']],
    rounding: 'keep every digit until the end, then round as the question asks: values usually to the nearest hundred dollars, times to the nearest tenth of a year.',
    note: 'This is exponential decay, the same model used for radioactive half-life. Real cars do not lose value at one steady rate; the formula is the model homework and textbooks use.'
  },
  example: {
    h2: 'Worked example: a $16,000 car that halves every 7 years',
    html: `<p><strong>Problem:</strong> A new car is purchased for $16,000 and over time its value depreciates by one half every 7 years. What is the value of the car 12 years after it was purchased, to the nearest hundred dollars?</p>
<p><strong>1.</strong> "Depreciates by one half every 7 years" is a half-life, so V = V₀ × (1/2)<sup>t ÷ h</sup> with V₀ = 16,000, h = 7 and t = 12.</p>
<p><strong>2.</strong> Number of half-lives: 12 ÷ 7 = 1.714286.</p>
<p><strong>3.</strong> Power: 0.5<sup>1.714286</sup> = 0.304753.</p>
<p><strong>4.</strong> Multiply: 16,000 × 0.304753 = $4,876.05.</p>
<p><strong>Answer:</strong> $4,900 to the nearest hundred dollars. Sense check: after 7 years the car is worth $8,000 and after 14 years $4,000, so 12 years must land between them, closer to $4,000.</p>`
  },
  variants: [
    {
      h2: 'A new car is purchased for $27,000 and depreciates by one half every 3.5 years…',
      html: `<p>For this homework problem, use V = 27,000 × (1/2)<sup>t ÷ 3.5</sup> and put in the number of years your question asks about. After 10 years: 10 ÷ 3.5 = 2.857143 half-lives, 0.5<sup>2.857143</sup> = 0.138011, and 27,000 × 0.138011 = $3,726.30, which is <strong>$3,700</strong> to the nearest hundred dollars.</p>
<div class="twrap"><table><thead><tr><th>Years after purchase</th><th>Exact value</th><th>Nearest $100</th></tr></thead><tbody>
<tr><td>5</td><td>$10,030.46</td><td>$10,000</td></tr><tr><td>10</td><td>$3,726.30</td><td>$3,700</td></tr><tr><td>12</td><td>$2,507.62</td><td>$2,500</td></tr><tr><td>15</td><td>$1,384.32</td><td>$1,400</td></tr><tr><td>20</td><td>$514.27</td><td>$500</td></tr>
</tbody></table></div>
<p>Versions with other prices or half-lives ($28,000 every 3 years, $37,000 every 6 years) work the same way: change V₀ and h in the calculator.</p>`
    },
    {
      h2: 'How long until the car is worth a given amount?',
      html: `<p>Some versions ask the reverse: "A new car is purchased for $40,000 and its value depreciates by one half every 6.5 years. How long, to the nearest tenth of a year, until the value is $3,100?" Solve for t with logs: t = 6.5 × log(3,100 ÷ 40,000) ÷ log(0.5). Here 3,100 ÷ 40,000 = 0.0775, log(0.0775) = −1.110698 and log(0.5) = −0.301030, so t = 6.5 × 3.689690 = 23.98, or <strong>24.0 years</strong>. Pick "how long" in the calculator to get these steps for your numbers.</p>`
    },
    {
      h2: 'What if the car loses a percentage every year?',
      html: `<p>"For each consecutive year, the value of the car depreciated by 7%" is percentage decay, not a half-life. Use V = V₀ × (1 − r)<sup>t</sup>. A car bought in 2001 for $22,000 is worth 22,000 × 0.93<sup>4</sup> = $16,457.14 in 2005, or <strong>$16,500</strong> to the nearest hundred. Count t as the years between the dates (2005 − 2001 = 4), not the number of years listed.</p>`
    }
  ],
  mistakes: [
    '<strong>Mixing up half-life and percentage decay.</strong> "Half every 3.5 years" is not 50% ÷ 3.5 = 14.3% a year. The equivalent yearly loss is 1 − 0.5<sup>1/3.5</sup> = 17.97%.',
    '<strong>Dividing the wrong way in the exponent.</strong> The exponent is years ÷ half-life (10 ÷ 3.5), not half-life ÷ years.',
    '<strong>Subtracting half the price each period.</strong> Each half-life halves what is left, not the original price. After two half-lives a $27,000 car is worth $6,750, not $0.',
    '<strong>Rounding the exponent early.</strong> Using 2.86 instead of 2.857143 moves the value by several dollars and can change the rounded answer.'
  ],
  related: ['compound-interest-calculator', 'exponent-calculator', 'percentage-calculator', 'scientific-notation-calculator'],
  faq: [
    { q: 'What yearly percentage is the same as halving every 3.5 years?', a: 'About 17.97% a year. The car keeps 0.5<sup>1/3.5</sup> = 0.8203 of its value each year, so it loses 1 − 0.8203 = 0.1797.' },
    { q: 'How do you write the depreciation formula for a car that halves every N years?', a: 'V = V₀ × (1/2)<sup>t/N</sup>, where V₀ is the purchase price and t is the years since purchase. Some textbooks write it as V = V₀(0.5)<sup>t/N</sup>; it is the same formula.' },
    { q: 'How much does a car depreciate per year?', a: 'There is no single rate: it depends on the model, mileage and condition. Homework problems give you either a half-life or a yearly percentage, and the calculator handles both.' },
    { q: 'Why round to the nearest hundred dollars?', a: 'Because the question says so, and a car\'s value is not known to the cent. Round only the final value, never the exponent or the power.' }
  ],
  sources: [
    { name: 'OpenStax College Algebra 2e: Exponential and Logarithmic Models', url: 'https://openstax.org/books/college-algebra-2e/pages/6-7-exponential-and-logarithmic-models' }
  ]
};
