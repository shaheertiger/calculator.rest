export default {
  slug: 'raise-calculator',
  hub: 'pay',
  name: 'Pay Raise Calculator',
  title: 'Raise Calculator: A 3% Raise on $60,000 Is $1,800 ($61,800)',
  h1: 'Pay Raise Calculator: New Salary or Hourly Rate From a Percentage Raise',
  meta: 'A 3% raise on a $60,000 salary adds $1,800 a year for a new salary of $61,800, or $69.23 more per biweekly check. Find new pay or the percent raise.',
  keyword: 'how to calculate 3 raise',
  also: ['how to calculate a raise', 'how to calculate raise percentage', 'how to calculate a 3 percent raise', 'pay raise calculator', 'salary increase calculator', 'hourly raise calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I know', type: 'select', value: 'pct', options: [['pct', 'The raise percentage'], ['new', 'My new pay (find the percentage)']] },
    { id: 'unit', label: 'Pay is', type: 'select', value: 'year', options: [['year', 'Per year'], ['hour', 'Per hour']] },
    { id: 'cur', label: 'Current pay', type: 'number', value: 60000, prefix: '$' },
    { id: 'pct', label: 'Raise', type: 'number', value: 3, suffix: '%', showIf: { mode: ['pct'] } },
    { id: 'next', label: 'New pay', type: 'number', value: 62500, prefix: '$', showIf: { mode: ['new'] } },
    { id: 'hpw', label: 'Hours per week', type: 'number', value: 40, suffix: 'hours' },
    { id: 'infl', label: 'Inflation over the year (optional)', type: 'number', value: '', suffix: '%', placeholder: 'e.g. 2.8', help: 'Shows whether the raise beats rising prices.' }
  ],
  compute(v, H) {
    if (!(v.cur > 0)) return { error: 'Enter your current pay.' };
    if (!(v.hpw > 0)) return { error: 'Enter hours per week.' };
    var newPay, p;
    if (v.mode === 'new') {
      if (!(v.next > 0)) return { error: 'Enter your new pay.' };
      newPay = v.next; p = (newPay / v.cur - 1) * 100;
    } else {
      if (!(v.pct > -100)) return { error: 'Enter the raise percentage.' };
      p = v.pct; newPay = v.cur * (1 + p / 100);
    }
    var hrs = v.hpw * 52;
    var oldY = v.unit === 'hour' ? v.cur * hrs : v.cur, newY = v.unit === 'hour' ? newPay * hrs : newPay;
    var d = newY - oldY;
    var rows = [
      [v.unit === 'hour' ? 'New hourly rate' : 'New salary', H.money(newPay), true],
      ['Raise per year', H.money(d)],
      ['Raise per month', H.money(d / 12)],
      ['Raise per biweekly paycheck', H.money(d / 26)],
      ['Raise per hour', H.money(d / hrs)],
      [v.unit === 'hour' ? 'New annual pay' : 'New hourly rate', v.unit === 'hour' ? H.money(newY) : H.money(newY / hrs)]
    ];
    if (v.mode === 'new') rows.unshift(['Raise percentage', H.pct(p, 2), true]);
    var sub = 'Gross pay before tax at ' + H.num(v.hpw, 2) + ' hours a week.';
    if (v.infl > -100 && v.infl !== 0 && !isNaN(v.infl)) {
      var real = ((1 + p / 100) / (1 + v.infl / 100) - 1) * 100;
      rows.push(['Real raise after ' + H.pct(v.infl, 2) + ' inflation', H.pct(real, 2)]);
      sub = real >= 0 ? 'After inflation your buying power rises ' + H.pct(real, 2) + '.' : 'After inflation your buying power falls ' + H.pct(-real, 2) + ' even with the raise.';
    }
    return {
      value: v.mode === 'new' ? H.pct(p, 2) : H.money(newPay),
      label: v.mode === 'new' ? 'Raise percentage' : (v.unit === 'hour' ? 'New hourly rate' : 'New salary'),
      expr: v.mode === 'new' ? '(' + H.money(newPay) + ' − ' + H.money(v.cur) + ') ÷ ' + H.money(v.cur) : H.money(v.cur) + ' × ' + H.num(1 + p / 100, 4),
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate a 3% raise, multiply your pay by 1.03 (or multiply it by 0.03 and add that on). A 3% raise on a <strong>$60,000</strong> salary is $1,800, so the new salary is <strong>${r.value}</strong>: $150 more a month or $69.23 more per biweekly paycheck. On a $20 hourly wage, a 3% raise is 60 cents, making it $20.60 an hour.`,
  stepsTitle: 'How to calculate a pay raise',
  steps: [
    'Turn the percentage into a decimal: 3% = 0.03, 4.5% = 0.045.',
    'Multiply your current pay by 1 plus that decimal. $60,000 × 1.03 = $61,800.',
    'For the dollar amount of the raise, multiply current pay by the decimal alone: $60,000 × 0.03 = $1,800.',
    'To find the percentage from two numbers, divide the difference by the <strong>old</strong> pay, not the new pay: ($62,500 − $60,000) ÷ $60,000 = 4.17%. Dividing by the new pay (4.0%) is the usual mistake.'
  ],
  formulaTitle: 'What is the formula for a raise?',
  formula: {
    expr: 'New pay = Current pay × (1 + Raise % ÷ 100)<br>Raise % = (New pay − Current pay) ÷ Current pay × 100<br>Real raise % = ((1 + Raise %) ÷ (1 + Inflation %) − 1) × 100',
    vars: [['Current pay', 'annual salary or hourly rate before the raise'], ['Inflation %', 'price growth over the same year, e.g. CPI']]
  },
  example: `<p>Tanya earns $24.50 an hour, 40 hours a week. Her review brings a 4.5% raise.</p>
<p>New rate: $24.50 × 1.045 = <strong>$25.60</strong> an hour (more exactly $25.6025; payroll usually rounds to $25.60).</p>
<p>Annual gain: $1.1025 × 2,080 = <strong>$2,293.20</strong>, which is $191.10 a month before tax. If prices rose 2.8% over the same year, her real raise is 1.045 ÷ 1.028 − 1 = <strong>1.65%</strong>.</p>`,
  table: {
    title: 'What is my new salary after a raise?',
    intro: 'New annual salary after common raises, plus what the same raise adds to a $20 hourly wage. Computed with the calculator above.',
    head: ['Raise', '$45,000', '$60,000', '$75,000', '$100,000', '$20/hr becomes'],
    rows: ({ run }) => [2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 10, 15, 20].map(p => [p + '%', ...[45000, 60000, 75000, 100000].map(s => run({ mode: 'pct', unit: 'year', cur: s, pct: p, infl: NaN }).value), run({ mode: 'pct', unit: 'hour', cur: 20, pct: p, infl: NaN }).value])
  },
  sections: [
    {
      h2: 'How much does a raise add to my paycheck after taxes?',
      html: `<p>Less than the headline number, because the raise is taxed at your <em>top</em> rate. Social Security and Medicare take 7.65%, and federal income tax takes your marginal bracket.</p>
<p>A single filer on $60,000 is in the 12% federal bracket for 2026 (taxable income $43,900 after the standard deduction). A $1,800 raise keeps about $1,800 × (1 − 0.12 − 0.0765) = <strong>$1,446</strong> a year, or $55.63 per biweekly check, before state tax. In the 22% bracket the same raise keeps about $1,266.</p>
<p>A raise never lowers your take-home pay: only the dollars above a bracket line are taxed at the higher rate. Run your new salary through the <a href="/take-home-pay-calculator">take-home pay calculator</a> to see the exact check.</p>`
    },
    {
      h2: 'Does a 3% raise keep up with inflation?',
      html: `<p>Compare it with inflation over the same 12 months. Subtracting gives a quick estimate (a 3% raise with 2.8% inflation is roughly a 0.2% real raise); dividing gives the exact figure: 1.03 ÷ 1.028 − 1 = 0.19%. Enter an inflation rate in the optional box above to see it.</p>
<p>Useful yardsticks: the Social Security cost-of-living adjustment for 2026 was 2.8%, based on the CPI-W. The Bureau of Labor Statistics publishes monthly CPI figures and the quarterly Employment Cost Index, which tracks how fast wages are rising across the economy. A raise below inflation is a pay cut in buying power. The <a href="/inflation-calculator">inflation calculator</a> shows what your old salary is worth in today's dollars.</p>`
    },
    {
      h2: 'How do you calculate a raise on hourly pay?',
      html: `<p>Multiply the hourly rate by 1 plus the raise, then round to the cent: $17.25 × 1.05 = $18.1125, so $18.11. To see the yearly effect, multiply the cents-per-hour increase by your annual hours: 86 cents × 2,080 = $1,788.80.</p>
<p>Flat raises work the other way. A "$1 an hour" raise is 5% on $20 but only 2.5% on $40, so flat raises lift lower wages by a bigger percentage. Switch the calculator to "My new pay" and enter both rates to get the percentage.</p>`
    },
    {
      h2: 'How do raises compound over a career?',
      html: `<p>Each raise is a percentage of a bigger number. Five straight years of 3% raises turn $60,000 into $60,000 × 1.03<sup>5</sup> = <strong>$69,556</strong>, an increase of 15.9%, not 15%. Ten years of 3% raises gives $80,635.</p>
<p>That is why the starting salary in a new job matters so much: a $3,000 bigger offer today grows with every future percentage raise. The <a href="/salary-to-hourly-calculator">salary to hourly calculator</a> helps compare offers quoted in different units.</p>`
    }
  ],
  faq: [
    { q: 'What is a 3% raise on $20 an hour?', a: '60 cents, so the new rate is $20.60 an hour, or $1,248 more a year at 40 hours a week.' },
    { q: 'How much is a 5% raise on $50,000?', a: '$2,500, for a new salary of $52,500. That is $208.33 more a month before tax.' },
    { q: 'How do I calculate my raise percentage?', a: 'Subtract your old pay from your new pay, divide by your old pay and multiply by 100. Going from $48,000 to $50,000 is a 4.17% raise.' },
    { q: 'What is a good raise percentage?', a: 'A raise is "good" if it beats inflation and matches your market value. A raise below the year\'s inflation rate means a cut in buying power; promotions and job changes usually bring larger percentages than annual merit raises.' },
    { q: 'Will a raise put me in a higher tax bracket?', a: 'It might move your top dollars into a higher bracket, but only those dollars are taxed at the higher rate. Your take-home pay still goes up.' },
    { q: 'How much is a 10% raise on $45,000?', a: '$4,500, making the new salary $49,500.' },
    { q: 'What is the difference between a cost-of-living raise and a merit raise?', a: 'A cost-of-living adjustment (COLA) goes to everyone to offset inflation; a merit raise is based on your performance. Some employers give both, and the calculator works for either.' }
  ],
  related: ['salary-to-hourly-calculator', 'take-home-pay-calculator', 'inflation-calculator', 'percentage-change-calculator', 'income-tax-calculator'],
  sources: [
    { name: 'BLS: Employment Cost Index', url: 'https://www.bls.gov/eci/' },
    { name: 'BLS: Consumer Price Index', url: 'https://www.bls.gov/cpi/' },
    { name: 'SSA: Cost-of-Living Adjustment (COLA) information', url: 'https://www.ssa.gov/cola/' },
    { name: 'IRS: Federal income tax rates and brackets', url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' }
  ]
};
