export default {
  slug: 'leave-loading-calculator',
  hub: 'pay',
  name: 'Leave Loading Calculator',
  title: 'Leave Loading Calculator: 4 Weeks at A$1,500/wk = A$1,050',
  h1: 'Annual Leave Loading Calculator (Australia): 17.5% Loading and Total Leave Pay',
  meta: 'On a A$1,500 base week, 4 weeks of annual leave pays A$6,000 plus 17.5% leave loading of A$1,050: A$7,050 in total. Work out your loading under Fair Work rules.',
  keyword: 'how to calculate annual leave loading',
  also: ['how do you calculate leave loading', 'how is leave loading calculated', 'how to calculate leave loading', 'how to calculate annual leave pay', 'how to calculate annual leave payment', 'leave loading calculator', '17.5 leave loading calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'basis', label: 'I know my', type: 'select', value: 'week', options: [['week', 'Base weekly pay'], ['hour', 'Base hourly rate'], ['year', 'Annual base salary']] },
    { id: 'weekly', label: 'Base pay per week (ordinary hours)', type: 'number', value: 1500, prefix: 'A$', showIf: { basis: ['week'] } },
    { id: 'hourly', label: 'Base hourly rate', type: 'number', value: 39.5, prefix: 'A$', showIf: { basis: ['hour'] } },
    { id: 'annual', label: 'Annual base salary', type: 'number', value: 78000, prefix: 'A$', showIf: { basis: ['year'] } },
    { id: 'hpw', label: 'Ordinary hours per week', type: 'number', value: 38, suffix: 'hours', showIf: { basis: ['hour'] } },
    { id: 'weeks', label: 'Annual leave taken', type: 'number', value: 4, suffix: 'weeks' },
    { id: 'pct', label: 'Leave loading rate', type: 'number', value: 17.5, suffix: '%' },
    { id: 'penalty', label: 'Shift penalties you would have earned (optional)', type: 'number', value: '', prefix: 'A$', placeholder: 'shiftworkers', help: 'Many awards pay the higher of 17.5% loading or the penalties you would have earned.' }
  ],
  compute(v, H) {
    var base;
    if (v.basis === 'hour') {
      if (!(v.hourly > 0) || !(v.hpw > 0)) return { error: 'Enter your base hourly rate and ordinary weekly hours.' };
      base = v.hourly * v.hpw;
    } else if (v.basis === 'year') {
      if (!(v.annual > 0)) return { error: 'Enter your annual base salary.' };
      base = v.annual / 52;
    } else {
      if (!(v.weekly > 0)) return { error: 'Enter your base weekly pay.' };
      base = v.weekly;
    }
    if (!(v.weeks > 0)) return { error: 'Enter the weeks of annual leave you are taking.' };
    if (!(v.pct >= 0)) return { error: 'Enter the leave loading rate (usually 17.5%).' };
    var A = function (x) { return H.cur(x, 'A$'); };
    var leavePay = base * v.weeks;
    var loading = leavePay * v.pct / 100;
    var usedPenalty = v.penalty > loading;
    var paid = usedPenalty ? v.penalty : loading;
    var rows = [
      ['Base pay for the leave (' + H.num(v.weeks, 2) + ' wk × ' + A(base) + ')', A(leavePay)],
      ['Total annual leave pay', A(leavePay + paid), true],
      ['Loading per week of leave', A(paid / v.weeks)]
    ];
    if (v.basis === 'hour') rows.push(['Loading per hour of leave', A(paid / v.weeks / v.hpw)]);
    if (v.penalty > 0) rows.push(['17.5% loading vs penalties', A(loading) + ' vs ' + A(v.penalty)]);
    rows.push(['Annual entitlement (4 weeks) loading', A(base * 4 * v.pct / 100)]);
    return {
      value: A(paid),
      label: usedPenalty ? 'Shift penalties paid instead of loading' : 'Leave loading',
      expr: A(leavePay) + ' × ' + H.num(v.pct, 2) + '%',
      rows: rows,
      sub: usedPenalty ? 'Your penalties are higher than the ' + H.num(v.pct, 2) + '% loading, so under a "higher of" award clause you receive the penalties.' : 'Loading is normally worked out on base pay for ordinary hours, not on overtime or bonuses.'
    };
  },
  quick: ({ r }) => `Annual leave loading is usually 17.5% of your base pay for the leave you take. An employee on <strong>A$1,500</strong> a week who takes 4 weeks of annual leave gets A$6,000 of leave pay plus 17.5% × A$6,000 = <strong>${r.value}</strong> in loading, so A$7,050 in total. Loading comes from your award, agreement or contract, not the National Employment Standards.`,
  stepsTitle: 'How to calculate annual leave loading',
  steps: [
    'Check your modern award, enterprise agreement or contract for a leave loading clause and its rate. 17.5% is standard; award-free employees only get loading if their contract says so.',
    'Work out your base weekly pay for ordinary hours: hourly rate × ordinary hours, or annual salary ÷ 52. Leave out overtime, allowances and penalty rates; including them is the most common error.',
    'Multiply base weekly pay by the weeks of leave taken for your annual leave pay.',
    'Multiply that by 17.5% for the loading.',
    'If you are a shiftworker under an award with a "higher of" clause, compare the loading with the shift penalties you would have earned and take the larger.'
  ],
  formulaTitle: 'What is the leave loading formula?',
  formula: {
    expr: 'Leave loading = Base weekly pay × Weeks of leave × 17.5%<br>Total leave pay = Base weekly pay × Weeks of leave × 1.175<br>Base weekly pay = Hourly rate × Ordinary hours (or Salary ÷ 52)',
    vars: [['Base weekly pay', 'pay for ordinary hours, excluding overtime, penalties and most allowances'], ['17.5%', 'the usual award rate; check your instrument'], ['Weeks of leave', '4 weeks a year for full-time employees under the NES (5 for some shiftworkers)']]
  },
  example: `<p>Mia works 38 ordinary hours a week at a base rate of A$39.50 an hour under an award with 17.5% loading, and takes 2 weeks of annual leave.</p>
<p>Base weekly pay: 38 × A$39.50 = A$1,501. Leave pay: 2 × A$1,501 = <strong>A$3,002</strong>.</p>
<p>Loading: A$3,002 × 17.5% = <strong>A$525.35</strong>, or about A$6.91 per hour of leave. Total: A$3,527.35, before tax.</p>`,
  table: {
    title: 'How much is 17.5% leave loading?',
    intro: 'Leave loading at 17.5% for common base weekly pay amounts and lengths of leave, from the calculator above.',
    head: ['Base weekly pay', '1 week', '2 weeks', '4 weeks', '5 weeks', 'Total pay, 4 weeks'],
    rows: ({ run, H }) => [900, 1000, 1200, 1500, 1800, 2000, 2500, 3000].map(w => [H.cur(w, 'A$', 0), ...[1, 2, 4, 5].map(k => run({ basis: 'week', weekly: w, weeks: k, pct: 17.5, penalty: NaN }).value), H.cur(w * 4 * 1.175, 'A$')]),
    note: 'Gross amounts before PAYG withholding.'
  },
  sections: [
    {
      h2: 'Who gets 17.5% leave loading?',
      html: `<p>Leave loading is not part of the National Employment Standards. It comes from a modern award, an enterprise agreement or your employment contract, and most awards include 17.5%. Award-free employees only get it if their contract or a workplace policy provides it.</p>
<p>Casual employees do not get paid annual leave or leave loading; their 25% casual loading is paid instead. Part-time employees get loading on the leave they accrue, pro rata.</p>
<p>Many awards give shiftworkers the <strong>higher</strong> of the 17.5% loading or the shift penalties they would have earned during the leave. Enter those penalties in the optional box to compare.</p>`
    },
    {
      h2: 'How is annual leave pay calculated and accrued?',
      html: `<p>Under the NES, full-time and part-time employees accrue 4 weeks of paid annual leave a year (5 weeks for some shiftworkers), building up progressively with ordinary hours worked. On a 38-hour week, 4 weeks is 152 hours a year, or about 2.92 hours per week worked.</p>
<p>When you take leave, you must be paid at least your base pay rate for the ordinary hours you would have worked. Annual leave pay does not include overtime, but it does include allowances or penalty rates if your award or agreement says so. Leave keeps accruing during paid leave, but not during unpaid leave.</p>`
    },
    {
      h2: 'Is leave loading paid when you finish a job?',
      html: `<p>Unused annual leave must be paid out when employment ends, at the rate you would have received if you had taken it. Whether loading is paid on top depends on the award or agreement; many awards say it is payable on termination, and some agreements say it is not. Check the leave loading clause in your award on the Fair Work Ombudsman's website.</p>
<p>Example: 60 unused hours at A$40 an hour pays out A$2,400, plus A$420 if 17.5% loading applies on termination.</p>`
    },
    {
      h2: 'How is leave loading taxed?',
      html: `<p>Leave loading is ordinary income, taxed at your marginal rate along with the rest of your pay. When it is paid in one lump with several weeks of leave, PAYG withholding on that pay run can look high, but the final tax is settled in your annual return.</p>
<p>For superannuation, the ATO generally treats leave loading as ordinary time earnings, so super guarantee applies to it, unless the loading is shown to be solely for lost overtime opportunity.</p>`
    }
  ],
  faq: [
    { q: 'How much is 17.5% leave loading on A$1,000 a week?', a: 'A$175 for each week of leave, so A$700 on a full 4-week entitlement.' },
    { q: 'Is leave loading compulsory in Australia?', a: 'Only if your award, enterprise agreement or contract provides it. The National Employment Standards do not require leave loading, but most awards do.' },
    { q: 'Is leave loading paid on overtime?', a: 'No. Loading is calculated on base pay for ordinary hours. Overtime you might have worked is not included.' },
    { q: 'When is leave loading paid?', a: 'Usually when you take annual leave, with your leave pay. Some employers pay the year\'s loading in one lump on a set date; your award or agreement decides.' },
    { q: 'Do casuals get leave loading?', a: 'No. Casual employees do not get paid annual leave, so there is no leave loading. Their 25% casual loading compensates for it.' },
    { q: 'How do I calculate leave loading on an hourly rate?', a: 'Multiply your hourly rate by 17.5% for the loading per hour of leave. At A$35 an hour that is A$6.13 an hour, or A$232.75 for a 38-hour week.' },
    { q: 'Is leave loading included in super?', a: 'Generally yes. The ATO treats leave loading as ordinary time earnings unless it is solely compensation for lost overtime.' }
  ],
  related: ['pto-accrual-calculator', 'holiday-pay-calculator', 'salary-to-hourly-calculator', 'gratuity-calculator'],
  sources: [
    { name: 'Fair Work Ombudsman: Annual leave', url: 'https://www.fairwork.gov.au/leave/annual-leave' },
    { name: 'Fair Work Ombudsman: Payment for annual leave', url: 'https://www.fairwork.gov.au/leave/annual-leave/payment-for-annual-leave' },
    { name: 'Fair Work Ombudsman: National Employment Standards', url: 'https://www.fairwork.gov.au/employment-conditions/national-employment-standards' }
  ],
  disclaimer: 'General information for Australian employees. Your award or agreement may set different rates.'
};
