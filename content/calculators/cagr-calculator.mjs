export default {
  slug: 'cagr-calculator',
  hub: 'investing',
  name: 'CAGR Calculator',
  title: 'CAGR Calculator: $50,000 to $80,000 in 5 Years Is 9.86% a Year',
  h1: 'CAGR Calculator: Compound Annual Growth Rate and Average Annual Growth',
  meta: 'Growing from $50,000 to $80,000 over 5 years is a 9.86% compound annual growth rate, while the simple average of the yearly changes is 10.58%. See why.',
  keyword: 'how to calculate average annual growth rate',
  also: ['cagr calculator', 'how to calculate cagr', 'compound annual growth rate formula', 'how to calculate cagr in excel', 'average annual growth rate calculator', 'aagr vs cagr'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you have?', type: 'select', value: 'series', options: [['series', 'A value for each year'], ['ends', 'Just a start value, end value and years']] },
    { id: 'series', label: 'Values in order, one per year', type: 'text', value: '50000, 62000, 55000, 66000, 72000, 80000', multiline: 3, help: 'Separate with commas, spaces or new lines. The first value is the starting year.', showIf: { mode: ['series'] }, wide: true },
    { id: 'start', label: 'Starting value', type: 'number', value: 50000, showIf: { mode: ['ends'] } },
    { id: 'end', label: 'Ending value', type: 'number', value: 80000, showIf: { mode: ['ends'] } },
    { id: 'years', label: 'Number of years between them', type: 'number', value: 5, suffix: 'years', help: 'Use decimals for partial years: 30 months = 2.5.', showIf: { mode: ['ends'] } }
  ],
  compute(v, H) {
    var s, e, n, vals = null;
    if (v.mode === 'series') {
      vals = H.list(v.series);
      if (vals.length < 2) return { error: 'Enter at least two yearly values.' };
      s = vals[0]; e = vals[vals.length - 1]; n = vals.length - 1;
    } else {
      s = v.start; e = v.end; n = v.years;
      if (!(n > 0)) return { error: 'Enter the number of years.' };
    }
    if (!(s > 0) || !(e >= 0)) return { error: 'CAGR needs a positive starting value and an ending value of zero or more.' };
    var cagr = Math.pow(e / s, 1 / n) - 1;
    var rows = [
      ['Total growth', H.pct((e / s - 1) * 100, 2)],
      ['Growth multiple', H.num(e / s, 4) + '×'],
      ['Periods', H.num(n, 2) + ' years']
    ];
    var out = { value: H.pct(cagr * 100, 2), label: 'Compound annual growth rate (CAGR)', expr: '(' + H.num(e, 2) + ' ÷ ' + H.num(s, 2) + ')^(1/' + H.num(n, 2) + ') − 1', rows: rows };
    if (cagr > 0) rows.push(['Years to double at this rate', H.num(Math.log(2) / Math.log(1 + cagr), 1)]);
    if (vals) {
      var g = [], t = [];
      for (var i = 1; i < vals.length; i++) {
        if (vals[i - 1] > 0) { var r = vals[i] / vals[i - 1] - 1; g.push(r); t.push(['Year ' + i, H.num(vals[i - 1], 2) + ' → ' + H.num(vals[i], 2), H.pct(r * 100, 2)]); }
      }
      if (g.length) {
        var aagr = H.mean(g);
        rows.unshift(['Average annual growth rate (AAGR)', H.pct(aagr * 100, 2), true]);
        out.table = { head: ['Period', 'Change', 'Growth'], rows: t, caption: 'Year-by-year growth' };
        out.sub = 'The simple average of the yearly changes (' + H.pct(aagr * 100, 2) + ') ' + (Math.abs(aagr - cagr) < 0.00005 ? 'matches' : aagr > cagr ? 'overstates' : 'understates') + ' the steady rate that actually links the first and last values (' + H.pct(cagr * 100, 2) + ').';
      }
    } else {
      out.sub = 'Growing ' + H.pct(cagr * 100, 2) + ' every year for ' + H.num(n, 2) + ' years turns ' + H.num(s, 2) + ' into ' + H.num(e, 2) + '.';
    }
    return out;
  },
  quick: ({ r }) => `To calculate the average annual growth rate that compounds, divide the ending value by the starting value, raise it to 1 ÷ the number of years, and subtract 1. Growth from $50,000 to $80,000 over 5 years is (80,000 ÷ 50,000)<sup>1/5</sup> − 1 = <strong>${r.value}</strong> a year. Averaging the five yearly changes instead gives <strong>10.58%</strong>, which overstates growth when results swing.`,
  stepsTitle: 'How to calculate CAGR and average annual growth',
  steps: [
    'Divide the final value by the first value. $80,000 ÷ $50,000 = 1.6, meaning 60% total growth.',
    'Count the number of years <em>between</em> the values, not the number of data points. Six yearly figures from 2020 to 2025 span 5 years; using 6 here is the classic mistake.',
    'Raise the ratio to the power of 1 ÷ years and subtract 1: 1.6<sup>0.2</sup> − 1 = 0.0986, or 9.86% a year.',
    'For the simple average annual growth rate (AAGR), work out each year\'s percentage change and take their mean. Report CAGR when you need the true compound rate; AAGR is only a rough summary.'
  ],
  formulaTitle: 'What is the CAGR formula?',
  formula: {
    expr: 'CAGR = (Ending value ÷ Beginning value)<sup>1/n</sup> − 1<br>AAGR = (g<sub>1</sub> + g<sub>2</sub> + … + g<sub>n</sub>) ÷ n, where g<sub>t</sub> = V<sub>t</sub> ÷ V<sub>t−1</sub> − 1',
    vars: [['n', 'number of years between the beginning and ending value'], ['g<sub>t</sub>', 'growth rate in year t'], ['V<sub>t</sub>', 'value at the end of year t']],
    note: 'CAGR depends only on the first and last values. AAGR uses every year, but because it is an arithmetic average it is always at least as large as CAGR when growth varies from year to year.'
  },
  example: `<p>A small business's revenue for 2020–2025 was $50,000, $62,000, $55,000, $66,000, $72,000 and $80,000.</p>
<p>Yearly changes: +24.00%, −11.29%, +20.00%, +9.09%, +11.11%. Their average (AAGR) is 52.91% ÷ 5 = <strong>10.58%</strong>.</p>
<p>CAGR = (80,000 ÷ 50,000)<sup>1/5</sup> − 1 = 1.6<sup>0.2</sup> − 1 = <strong>9.86%</strong>.</p>
<p>Check: $50,000 × 1.0986<sup>5</sup> = $80,000. Growing at the 10.58% average every year would instead reach $82,700, which never happened.</p>`,
  table: {
    title: 'How much does a value grow at different CAGRs?',
    intro: 'Growth multiple after 5, 10 and 20 years, and how long it takes to double, for common compound annual growth rates.',
    head: ['CAGR', 'After 5 years', 'After 10 years', 'After 20 years', 'Years to double'],
    rows: ({ H }) => [2, 3, 5, 7, 8, 10, 12, 15, 20, 25].map(g => [g + '%', ...[5, 10, 20].map(y => H.fix(Math.pow(1 + g / 100, y), 2) + '×'), H.num(Math.log(2) / Math.log(1 + g / 100), 1)]),
    note: 'The rule of 72 approximates doubling time as 72 ÷ the rate: at 8%, 72 ÷ 8 = 9 years, against an exact 9.0.'
  },
  sections: [
    {
      h2: 'What is the difference between CAGR and average annual growth rate?',
      html: `<p>CAGR is the single steady rate that would take the starting value to the ending value. AAGR is the plain average of each year's percentage change. They match only when growth is identical every year.</p>
<p>Volatility drives them apart. A stock that gains 50% one year and loses 50% the next has an AAGR of 0%, but $100 became $150 and then $75, a CAGR of −13.40%. That gap is why mutual fund performance tables report "average annual total returns", which are compound rates, not simple averages.</p>
<p>Use AAGR to describe typical year-to-year change; use CAGR for anything you will compound forward, compare across periods or present as "growth per year".</p>`
    },
    {
      h2: 'How do you calculate CAGR in Excel or Google Sheets?',
      html: `<p>With the starting value in B2, the ending value in B7 and the number of years in C2:</p>
<ul><li><code>=(B7/B2)^(1/C2)-1</code> works in every spreadsheet.</li>
<li><code>=RRI(C2, B2, B7)</code> is Excel's and Sheets' built-in equivalent (number of periods, present value, future value).</li>
<li>For a column of yearly values in B2:B7, the years are <code>=ROWS(B2:B7)-1</code>.</li></ul>
<p>For AAGR, put each year's change in column C with <code>=B3/B2-1</code>, fill down, and take <code>=AVERAGE(C3:C7)</code>. Format the result as a percentage.</p>`
    },
    {
      h2: 'How do you use CAGR to project a future value?',
      html: `<p>Rearrange the formula: <strong>Future value = Current value × (1 + CAGR)<sup>years</sup></strong>. If revenue of $80,000 keeps growing at 9.86%, in 3 years it would be $80,000 × 1.0986<sup>3</sup> = $106,062. To find the rate needed to hit a target, plug the target in as the ending value: reaching $120,000 from $80,000 in 4 years needs (1.5)<sup>0.25</sup> − 1 = 10.67% a year.</p>
<p>Projections assume the past rate continues, which rarely holds for long. Treat them as a scenario, not a forecast.</p>`
    },
    {
      h2: 'When does CAGR give the wrong answer?',
      html: `<ul><li><strong>Money added or withdrawn:</strong> a portfolio that grew partly because you kept contributing will show a CAGR that overstates the investment's own return. Use the <a href="/irr-calculator">IRR calculator</a> for uneven cash flows.</li>
<li><strong>Negative or zero starting values:</strong> CAGR is undefined when the start is zero or below, such as a company moving from a loss to a profit. Describe the change in dollars instead.</li>
<li><strong>Cherry-picked endpoints:</strong> because only the first and last years matter, starting at a market low or ending at a peak can make any series look strong. Check a few different windows.</li></ul>`
    }
  ],
  faq: [
    { q: 'How do you calculate the average annual growth rate?', a: 'Calculate each year\'s growth as (this year ÷ last year − 1), add them up and divide by the number of years. For a compound rate that links the first and last values, use CAGR = (end ÷ start)^(1/years) − 1.' },
    { q: 'Is CAGR the same as annualized return?', a: 'Yes, for a single lump sum invested at the start and valued at the end. If money was added or withdrawn along the way, use a money-weighted measure such as IRR instead.' },
    { q: 'How do you calculate CAGR for months?', a: 'Convert months to years by dividing by 12, then use the normal formula. Growth of 20% over 18 months is 1.2^(1/1.5) − 1 = 12.92% a year.' },
    { q: 'Can CAGR be negative?', a: 'Yes. If the ending value is lower than the starting value, CAGR is negative. Falling from $100 to $70 over 3 years is a CAGR of −11.21%.' },
    { q: 'What is a good CAGR for revenue?', a: 'It depends on company size and industry. Mature companies often grow revenue in the low single digits, while early-stage companies can grow 20% a year or more. Compare against inflation and direct competitors.' },
    { q: 'Why is my CAGR lower than the average growth rate?', a: 'Because the arithmetic average of volatile yearly rates is always higher than the compound rate. The more the yearly figures swing, the bigger the gap.' },
    { q: 'How many years do I use for CAGR?', a: 'The number of years between the first and last value. From the end of 2020 to the end of 2025 is 5 years, even though you have 6 data points.' }
  ],
  related: ['roi-calculator', 'compound-interest-calculator', 'irr-calculator', 'inflation-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Annual return (glossary)', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/annual-return' },
    { name: 'SEC Investor.gov: Glossary of investing terms', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary' },
    { name: 'CFA Institute', url: 'https://www.cfainstitute.org/' }
  ]
};
