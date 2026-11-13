export default {
  slug: 'percentage-change-calculator',
  hub: 'math',
  name: 'Percentage Change Calculator',
  title: 'Percentage Change Calculator: 84,000 to 96,600 Is +15%',
  h1: 'Percent Increase and Decrease Calculator, With Percent Difference',
  meta: 'Going from 84,000 to 96,600 is a 15% increase, but the drop back is only 13.04%. Get percent change, YoY or sales growth, percent difference, or undo a change.',
  keyword: 'how do you calculate percentage change',
  also: ['percentage change calculator', 'how to find percent decrease calculator', 'what is percentage increase calculator', 'how to calculate percentage increase in price', 'how to calculate year over year percentage change', 'how do you calculate growth percentage year over year', 'how to calculate sales growth', 'how to calculate sales growth over 5 years', 'how to calculate percent variance in excel', 'how to calculate percentage variance', 'percent difference calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'change', wide: true, options: [['change', 'Percent change (old → new)'], ['diff', 'Percent difference (two values, no order)'], ['reverse', 'Original value before a % change']] },
    { id: 'old', label: 'Old (starting) value', type: 'number', value: 84000, showIf: { mode: ['change'] } },
    { id: 'new', label: 'New (ending) value', type: 'number', value: 96600, showIf: { mode: ['change'] } },
    { id: 'periods', label: 'Periods between them (optional)', type: 'number', value: '', placeholder: 'e.g. 5 years', help: 'Adds the average compound growth per period.', showIf: { mode: ['change'] } },
    { id: 'a', label: 'Value A', type: 'number', value: 120, showIf: { mode: ['diff'] } },
    { id: 'b', label: 'Value B', type: 'number', value: 150, showIf: { mode: ['diff'] } },
    { id: 'fin', label: 'Value after the change', type: 'number', value: 69000, showIf: { mode: ['reverse'] } },
    { id: 'pct', label: 'Percent change applied', type: 'number', value: 15, suffix: '%', help: 'Use a minus sign for a decrease, e.g. −25.', showIf: { mode: ['reverse'] } }
  ],
  compute(v, H) {
    function n(x) { return H.num(x, 4); }
    function sp(x) { return (x > 0 ? '+' : x < 0 ? '−' : '') + H.pct(Math.abs(x), 2); }
    function sn(x) { return (x > 0 ? '+' : x < 0 ? '−' : '') + n(Math.abs(x)); }
    if (v.mode === 'diff') {
      if (!isFinite(v.a) || !isFinite(v.b)) return { error: 'Enter both values.' };
      var avg = (v.a + v.b) / 2;
      if (avg === 0) return { error: 'The two values average to 0, so percent difference is undefined.' };
      var pd = Math.abs(v.a - v.b) / Math.abs(avg) * 100;
      var rowsD = [['Absolute difference', n(Math.abs(v.a - v.b))], ['Average of A and B', n(avg)]];
      if (v.a !== 0) rowsD.push(['Percent change A → B', sp((v.b - v.a) * 100 / Math.abs(v.a))]);
      if (v.b !== 0) rowsD.push(['Percent change B → A', sp((v.a - v.b) * 100 / Math.abs(v.b))]);
      return {
        value: H.pct(pd, 2), label: 'Percent difference',
        expr: '|' + n(v.a) + ' − ' + n(v.b) + '| ÷ ' + n(avg) + ' × 100',
        rows: rowsD,
        sub: 'Percent difference divides by the average of the two values, so it is the same whichever value you list first.' + ((v.a < 0) !== (v.b < 0) ? ' The values have opposite signs, so this figure is not very meaningful.' : '')
      };
    }
    if (v.mode === 'reverse') {
      if (!isFinite(v.fin) || !isFinite(v.pct)) return { error: 'Enter the final value and the percent change.' };
      if (v.pct <= -100) return { error: 'A decrease of 100% or more cannot be reversed.' };
      var orig = v.fin * 100 / (100 + v.pct);
      return {
        value: n(orig), label: 'Original value before the ' + (v.pct >= 0 ? 'increase' : 'decrease'),
        expr: n(v.fin) + ' ÷ ' + n(1 + v.pct / 100),
        rows: [
          ['Amount of the change', sn(v.fin - orig)],
          ['Check', n(orig) + ' × ' + n(1 + v.pct / 100) + ' = ' + n(v.fin)],
          ['Wrong shortcut (' + n(v.fin) + ' ' + (v.pct >= 0 ? '−' : '+') + ' ' + H.pct(Math.abs(v.pct), 2) + ' of it)', n(v.fin * (1 - v.pct / 100))]
        ],
        sub: 'Divide by 1 ' + (v.pct >= 0 ? '+ ' : '− ') + n(Math.abs(v.pct) / 100) + '. Taking the same percent off the final value does not return the original.'
      };
    }
    if (!isFinite(v.old) || !isFinite(v.new)) return { error: 'Enter the old and new values.' };
    if (v.old === 0) return { error: 'Percent change from 0 is undefined. Report the absolute change instead.' };
    var d = v.new - v.old, pc = d * 100 / Math.abs(v.old);
    var rows = [
      ['Change', sn(d)],
      ['New value as % of old', H.pct(v.new * 100 / v.old, 2)],
      ['Multiplier', '× ' + n(v.new / v.old)]
    ];
    if (v.new !== 0) rows.push(['Change needed to get back to ' + n(v.old), sp(-d * 100 / Math.abs(v.new))]);
    if (v.old + v.new !== 0) rows.push(['Percent difference (no order)', H.pct(Math.abs(d) / Math.abs((v.old + v.new) / 2) * 100, 2)]);
    if (v.periods > 0) {
      if (v.old > 0 && v.new > 0) {
        var g = (Math.pow(v.new / v.old, 1 / v.periods) - 1) * 100;
        rows.push(['Average compound growth per period', sp(g), true]);
        rows.push(['Simple average per period', sp(pc / v.periods)]);
      } else rows.push(['Average compound growth', 'needs two positive values']);
    }
    return {
      value: sp(pc),
      label: pc > 0 ? 'Percent increase' : pc < 0 ? 'Percent decrease' : 'No change',
      expr: '(' + n(v.new) + ' − ' + n(v.old) + ') ÷ ' + (v.old < 0 ? '|' + n(v.old) + '|' : n(v.old)) + ' × 100',
      rows: rows,
      sub: v.old < 0 ? 'The old value is negative, so the change is divided by its absolute value: a positive result means the number moved up.' : 'Steps: ' + n(v.new) + ' − ' + n(v.old) + ' = ' + sn(d) + ', then ÷ ' + n(v.old) + ' = ' + n(d / v.old) + ', then × 100.'
    };
  },
  quick: ({ r }) => `Percentage change = (new − old) ÷ old × 100. Going from 84,000 to 96,600 is a change of 12,600, and 12,600 ÷ 84,000 = 0.15, so the increase is <strong>${r.value}</strong>. The way back is not the same size: falling from 96,600 to 84,000 is a <strong>13.04% decrease</strong>, because that drop is measured against the larger number.`,
  stepsTitle: 'How to calculate percentage change step by step',
  steps: [
    'Subtract the old value from the new value. A positive result is an increase, a negative one a decrease.',
    'Divide that difference by the <strong>old</strong> value, the one you started from. Dividing by the new value is the most common error and gives a smaller increase or a bigger decrease than the truth.',
    'Multiply by 100 to turn the decimal into a percent: 0.15 becomes 15%.',
    'For growth over several years, enter the number of periods to see the average compound rate per year instead of dividing the total by the years.'
  ],
  formulaTitle: 'What is the percent change formula?',
  formula: {
    expr: 'Percent change = (New − Old) ÷ |Old| × 100<br>Percent difference = |A − B| ÷ ((A + B) ÷ 2) × 100<br>Original = Final ÷ (1 + change ÷ 100)',
    vars: [['Old', 'the starting, earlier or baseline value'], ['New', 'the ending or later value'], ['A, B', 'two values with no before and after'], ['|x|', 'absolute value, which keeps the sign right when the old value is negative']],
    note: 'Average compound growth over n periods is (New ÷ Old)<sup>1/n</sup> − 1, which is what finance calls CAGR.'
  },
  example: `<p>A shop's sales were $84,000 last year and $96,600 this year.</p>
<p>Change = $96,600 − $84,000 = $12,600. Divide by last year: $12,600 ÷ $84,000 = 0.15. Multiply by 100: <strong>15% year-over-year growth</strong>.</p>
<p>If sales slip back to $84,000 next year, the change is −$12,600 ÷ $96,600 = <strong>−13.04%</strong>. The dollar amount is the same both ways; the base it is divided by is not.</p>`,
  table: {
    title: 'Why doesn\'t a 20% drop undo a 20% rise?',
    intro: 'Each row shows the gain needed to climb back from a drop of that size, and where you end up after rising and then falling by the same percent. Computed with the tool above.',
    head: ['Percent move', 'Gain needed to recover a drop this size', 'Up then down by it (net)'],
    rows: ({ run }) => [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 90].map(p => [p + '%', run({ mode: 'change', old: 100 - p, new: 100, periods: NaN }).value, run({ mode: 'change', old: 100, new: (100 + p) * (100 - p) / 100, periods: NaN }).value]),
    note: 'A 50% loss needs a 100% gain to break even. Rising 50% and then falling 50% leaves you 25% below where you started.'
  },
  sections: [
    {
      h2: 'How do you calculate year-over-year (YoY) growth?',
      html: `<p>Compare a period with the same period one year earlier: (this year − last year) ÷ last year × 100. If March revenue was $41,800 against $38,000 last March, YoY growth is $3,800 ÷ $38,000 = <strong>10%</strong>.</p>
<p>YoY comparisons cancel out seasonality. December retail sales nearly always beat November, so a month-over-month jump says little; December against last December tells you whether the business actually grew. Use the same length of period on both sides (a full quarter against a full quarter, or year-to-date against the same days last year).</p>
<p>Price indexes work the same way. If the CPI-U index moved from 300.0 to 310.5 over twelve months, inflation was 10.5 ÷ 300 = 3.5% for the year. To compare dollar amounts across many years, the <a href="/inflation-calculator">inflation calculator</a> applies the official index for you.</p>`
    },
    {
      h2: 'How do you calculate sales growth over several years?',
      html: `<p>Total growth uses the same formula with the first and last year. Sales that went from $250,000 to $400,000 over 5 years grew ($400,000 − $250,000) ÷ $250,000 = <strong>60%</strong> in total.</p>
<p>Dividing that by 5 gives 12% a year, which overstates the real pace because growth compounds. The average annual (compound) rate is (400,000 ÷ 250,000)<sup>1/5</sup> − 1 = 1.6<sup>0.2</sup> − 1 = <strong>9.86% a year</strong>. Check: $250,000 × 1.0986<sup>5</sup> ≈ $400,000. Enter 5 in the optional periods box to get this figure, or use the <a href="/cagr-calculator">CAGR calculator</a> for a year-by-year table.</p>
<p>When reporting sales growth, say which figure you mean: "up 60% since 2021" and "growing 9.9% a year" describe the same numbers.</p>`
    },
    {
      h2: 'How do you calculate a percentage increase in price?',
      html: `<p>Treat the old price as the base. Gas that goes from $3.49 to $3.99 a gallon rose $0.50, and $0.50 ÷ $3.49 = <strong>14.33%</strong>. Rounding the old price to $3.50 first gives 14.29%, close enough for conversation but not for a report.</p>
<p>Package-size cuts hide price increases. If a $4.00 bag shrinks from 16 oz to 14 oz, the price per ounce climbs from $0.25 to about $0.2857, a <strong>14.29% increase</strong> even though the shelf price did not move. Compare per-unit prices with the <a href="/unit-price-calculator">unit price calculator</a> to catch it.</p>
<p>A store's markup is the same calculation run from cost to selling price: an item bought for $40 and sold for $58 carries a 45% markup. The <a href="/markup-calculator">markup calculator</a> also shows the matching profit margin, which is measured against the price instead of the cost.</p>`
    },
    {
      h2: 'What is the difference between percent change, percent difference and percentage points?',
      html: `<ul>
<li><strong>Percent change</strong> has a direction: it measures movement from an old value to a new one and divides by the old value.</li>
<li><strong>Percent difference</strong> has no direction: it compares two values of equal standing (two lab measurements, the same item at two stores) and divides by their average. 120 and 150 differ by 30 ÷ 135 = 22.22%, whichever comes first.</li>
<li><strong>Percentage points</strong> are the plain difference between two percentages. A mortgage rate rising from 4% to 5% is up 1 percentage point, but that is a 25% increase in the rate itself.</li>
</ul>
<p>News reports mix these up often. "Unemployment rose 0.5%" usually means half a percentage point, which could be a 12% relative rise if the rate was 4.2%.</p>`
    },
    {
      h2: 'How do you calculate percentage change in Excel or Google Sheets?',
      html: `<p>With the old value in A2 and the new value in B2, type <code>=(B2-A2)/A2</code> and format the cell as a percentage. <code>=B2/A2-1</code> gives the same result. The formulas are identical in Google Sheets.</p>
<ul>
<li><strong>Budget variance:</strong> with budget in B2 and actual in C2, percent variance is <code>=(C2-B2)/ABS(B2)</code>. The ABS keeps the sign meaningful when the baseline is a loss.</li>
<li><strong>Avoiding #DIV/0!:</strong> wrap it as <code>=IFERROR((B2-A2)/ABS(A2),"n/a")</code> for rows that start at zero.</li>
<li><strong>Compound growth:</strong> <code>=(B2/A2)^(1/5)-1</code> for five years between the two values.</li>
<li><strong>Percent difference:</strong> <code>=ABS(A2-B2)/AVERAGE(A2,B2)</code>.</li>
</ul>`
    },
    {
      h2: 'How do you reverse a percentage increase or decrease?',
      html: `<p>Divide the final number by the growth factor. After a 15% raise a salary is $69,000, so it was $69,000 ÷ 1.15 = <strong>$60,000</strong> before. After 25% off, a jacket costs $54, so the original price was $54 ÷ 0.75 = <strong>$72</strong>.</p>
<p>Subtracting the percent from the final figure gives the wrong answer: $69,000 minus 15% is $58,650, not $60,000, and $54 plus 25% is $67.50, not $72. The percent was applied to the original amount, so you have to divide it back out. Choose "Original value before a % change" above to do this for any number. Common versions of the same question have dedicated tools: the <a href="/raise-calculator">raise calculator</a> for pay and the <a href="/rent-increase-calculator">rent increase calculator</a> for leases.</p>`
    }
  ],
  faq: [
    { q: 'What is the percentage increase from 50 to 75?', a: 'The increase from 50 to 75 is 50%: the change is 25, and 25 ÷ 50 = 0.5.' },
    { q: 'What is the percent decrease from 80 to 60?', a: 'The decrease from 80 to 60 is 25%: (80 − 60) ÷ 80 = 0.25. Going back up from 60 to 80 is a 33.33% increase.' },
    { q: 'What is the formula for percent decrease?', a: 'Percent decrease = (old − new) ÷ old × 100. It is the percent change formula with the sign flipped so the answer is positive.' },
    { q: 'Can a percentage change be more than 100%?', a: 'An increase can: going from 40 to 100 is a 150% increase, and doubling is always +100%. A decrease of a positive quantity tops out at 100%, which means it fell to zero.' },
    { q: 'How do you calculate percentage change from zero?', a: 'You can\'t. Dividing by a starting value of 0 is undefined, so report the absolute change instead (for example, "from 0 to 35 customers").' },
    { q: 'How do you calculate percent change with negative numbers?', a: 'Divide the change by the absolute value of the old number. A loss that shrinks from −200 to −50 is a change of +150, and 150 ÷ 200 = +75%, an improvement.' },
    { q: 'How do I find a monthly growth rate?', a: 'For one month, use (this month − last month) ÷ last month × 100. For an average over several months, use (last ÷ first)^(1 ÷ months) − 1, or enter the months as periods above.' },
    { q: 'Is percent change the same as percent difference?', a: 'No. Percent change divides by the starting value and has a direction (+ or −). Percent difference divides by the average of the two values and is always positive.' }
  ],
  related: ['percentage-calculator', 'cagr-calculator', 'inflation-calculator', 'raise-calculator', 'population-growth-calculator'],
  sources: [
    { name: 'Microsoft Support: Calculate percentages (including percent change)', url: 'https://support.microsoft.com/en-us/excel/calculate-percentages' },
    { name: 'U.S. Bureau of Labor Statistics: Consumer Price Index', url: 'https://www.bls.gov/cpi/' },
    { name: 'Wolfram MathWorld: Percent', url: 'https://mathworld.wolfram.com/Percent.html' }
  ]
};
