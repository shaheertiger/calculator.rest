export default {
  slug: 'gross-pay-calculator',
  hub: 'pay',
  name: 'Gross Pay Calculator',
  title: 'Gross Pay Calculator: $22.50/hr, 80 Hours + 4 OT = $1,935',
  h1: 'Gross Pay Calculator: Wages, Overtime, PTO and Tips for One Pay Period',
  meta: '80 regular hours at $22.50 plus 4 overtime hours at $33.75 is $1,935 gross for the pay period, about $4,192.50 a month. Works for hourly or salaried pay.',
  keyword: 'how to calculate gross pay',
  also: ['how to calculate your gross income', 'how to calculate your gross monthly income', 'how do you calculate gross monthly income', 'how to calculate payroll for tipped employees', 'how to calculate taxable wages', 'how payroll is calculated', 'gross pay calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'type', label: 'Pay type', type: 'select', value: 'hourly', options: [['hourly', 'Hourly'], ['salary', 'Salary']] },
    { id: 'rate', label: 'Hourly rate', type: 'number', value: 22.5, prefix: '$', showIf: { type: ['hourly'] } },
    { id: 'reg', label: 'Regular hours this pay period', type: 'number', value: 80, suffix: 'hours', showIf: { type: ['hourly'] } },
    { id: 'ot', label: 'Overtime hours (over 40 in a week)', type: 'number', value: 4, suffix: 'hours', showIf: { type: ['hourly'] } },
    { id: 'pto', label: 'Paid holiday, vacation or sick hours', type: 'number', value: 0, suffix: 'hours', showIf: { type: ['hourly'] } },
    { id: 'salary', label: 'Annual salary', type: 'number', value: 58000, prefix: '$', showIf: { type: ['salary'] } },
    { id: 'freq', label: 'Pay period', type: 'select', value: '26', options: [['52', 'Weekly'], ['26', 'Every two weeks'], ['24', 'Twice a month'], ['12', 'Monthly']] },
    { id: 'bonus', label: 'Bonus or commission this period', type: 'number', value: 0, prefix: '$' },
    { id: 'tips', label: 'Tips received this period', type: 'number', value: 0, prefix: '$' }
  ],
  compute(v, H) {
    var n = Number(v.freq) || 26;
    var bonus = v.bonus > 0 ? v.bonus : 0, tips = v.tips > 0 ? v.tips : 0;
    var rows = [], base = 0, expr;
    if (v.type === 'salary') {
      if (!(v.salary > 0)) return { error: 'Enter your annual salary.' };
      base = v.salary / n;
      rows.push(['Salary for the period (' + H.money0(v.salary) + ' ÷ ' + n + ')', H.money(base)]);
      expr = H.money0(v.salary) + ' ÷ ' + n;
    } else {
      if (!(v.rate > 0)) return { error: 'Enter your hourly rate.' };
      var reg = v.reg > 0 ? v.reg : 0, ot = v.ot > 0 ? v.ot : 0, pto = v.pto > 0 ? v.pto : 0;
      if (reg + ot + pto <= 0 && bonus + tips <= 0) return { error: 'Enter the hours you were paid for.' };
      rows.push(['Regular (' + H.num(reg, 2) + ' h × ' + H.money(v.rate) + ')', H.money(reg * v.rate)]);
      if (ot > 0) rows.push(['Overtime (' + H.num(ot, 2) + ' h × ' + H.money(v.rate * 1.5) + ')', H.money(ot * v.rate * 1.5)]);
      if (pto > 0) rows.push(['Paid time off (' + H.num(pto, 2) + ' h × ' + H.money(v.rate) + ')', H.money(pto * v.rate)]);
      base = (reg + pto) * v.rate + ot * v.rate * 1.5;
      expr = H.num(reg + pto, 2) + ' h × ' + H.money(v.rate) + (ot > 0 ? ' + ' + H.num(ot, 2) + ' h × ' + H.money(v.rate * 1.5) : '');
    }
    if (bonus > 0) { rows.push(['Bonus or commission', H.money(bonus)]); expr += ' + bonus'; }
    if (tips > 0) { rows.push(['Tips', H.money(tips)]); expr += ' + tips'; }
    var gross = base + bonus + tips;
    rows.push(['Gross monthly income at this pace', H.money(gross * n / 12), true]);
    rows.push(['Gross annual income at this pace', H.money(gross * n)]);
    return {
      value: H.money(gross),
      label: 'Gross pay for the period',
      expr: expr,
      rows: rows,
      sub: 'Gross pay is everything earned before taxes and deductions. Monthly figures multiply by ' + n + ' periods ÷ 12, not by ' + (n === 52 ? '4' : n === 26 ? '2' : '1') + '.'
    };
  },
  quick: ({ r }) => `Gross pay is hours × rate, plus overtime at 1.5×, plus bonuses, commissions and tips, before any tax comes out. For 80 regular hours at <strong>$22.50</strong> and 4 overtime hours at $33.75, gross pay is $1,800 + $135 = <strong>${r.value}</strong> for the pay period. Paid every two weeks, that is $4,192.50 of gross monthly income and $50,310 a year.`,
  stepsTitle: 'How to calculate gross pay for a pay period',
  steps: [
    'Multiply regular hours by your hourly rate. For salaried pay, divide the annual salary by the number of pay periods (52, 26, 24 or 12).',
    'Add overtime: hours over 40 in each workweek × 1.5 × your rate. On a two-week period, check each week separately; 45 + 35 hours still earns 5 overtime hours.',
    'Add paid holiday, vacation and sick hours at your normal rate.',
    'Add bonuses, commissions, shift differentials and reported tips. All of it is part of gross pay.',
    'For gross monthly income, multiply by the number of pay periods in a year and divide by 12.'
  ],
  formulaTitle: 'What is the formula for gross pay?',
  formula: {
    expr: 'Gross pay = Regular hours × Rate + OT hours × Rate × 1.5 + PTO hours × Rate + Bonus + Tips<br>Salaried gross per period = Annual salary ÷ Pay periods<br>Gross monthly income = Gross per period × Pay periods ÷ 12',
    vars: [['Rate', 'hourly wage'], ['OT hours', 'hours over 40 in a workweek'], ['Pay periods', '52 weekly, 26 biweekly, 24 semi-monthly, 12 monthly']]
  },
  example: `<p>A server is paid every two weeks at a $2.13 cash wage, works 64 hours and reports $1,280 in tips. A cook at the same restaurant earns $19 an hour, works 82 hours (42 one week, 40 the next) and gets a $100 shift bonus.</p>
<p>Server: 64 × $2.13 = $136.32 + $1,280 tips = <strong>$1,416.32</strong> gross. That is $22.13 an hour, well above the $7.25 minimum, so no tip-credit top-up is owed.</p>
<p>Cook: 80 × $19 = $1,520 + 2 overtime hours × $28.50 = $57 + $100 bonus = <strong>$1,677</strong> gross, or $3,633.50 a month at that pace.</p>`,
  table: {
    title: 'How much gross monthly income is an hourly wage?',
    intro: 'Full-time (40 hours a week) gross monthly income, computed correctly as weekly pay × 52 ÷ 12, next to the common "× 4 weeks" shortcut that undercounts it.',
    head: ['Hourly rate', 'Weekly gross', 'Monthly gross (× 52 ÷ 12)', 'Weekly × 4 (too low)', 'Missed each month'],
    rows: ({ run, H }) => [10, 12, 15, 17, 18, 20, 22.5, 25, 28, 30, 35, 40, 50].map(x => {
      const w = parseFloat(run({ type: 'hourly', rate: x, reg: 40, ot: 0, pto: 0, freq: '52', bonus: 0, tips: 0 }).value.replace(/[$,]/g, ''));
      return [H.money(x), H.money(w), H.money(w * 52 / 12), H.money(w * 4), H.money(w * 52 / 12 - w * 4)];
    }),
    note: 'A month averages 4.33 weeks. Lenders and landlords who ask for gross monthly income expect the 52 ÷ 12 figure.'
  },
  sections: [
    {
      h2: 'What counts as gross pay?',
      html: `<p>Everything your employer pays you for the period, before any tax or deduction:</p>
<ul>
<li>regular wages or salary;</li>
<li>overtime, double time and shift differentials;</li>
<li>paid vacation, sick leave and holiday pay;</li>
<li>bonuses, commissions and incentive pay;</li>
<li>tips reported to your employer, plus service charges paid to you;</li>
<li>taxable fringe benefits, such as personal use of a company car.</li>
</ul>
<p>Expense reimbursements under an accountable plan (mileage, travel receipts) are not gross pay. Neither is the employer's share of payroll tax or health premiums.</p>`
    },
    {
      h2: 'How do you calculate gross monthly income?',
      html: `<p>Multiply your pay per period by the number of periods in a year, then divide by 12. Weekly pay × 52 ÷ 12, biweekly pay × 26 ÷ 12, semi-monthly pay × 2. The tempting shortcut of weekly pay × 4 misses about 8% of your income, because a month is 4.33 weeks on average.</p>
<p>For a mortgage, car loan or apartment application, lenders want gross monthly income from all sources. If your pay varies with overtime, commission or tips, most lenders average the last one or two years, so use your year-to-date total from a recent pay stub rather than one good check. The <a href="/ytd-income-calculator">YTD income calculator</a> turns a stub total into a monthly average, and the <a href="/dti-calculator">DTI calculator</a> shows how lenders use it.</p>`
    },
    {
      h2: 'How do you calculate payroll for tipped employees?',
      html: `<p>Under federal law an employer may pay a tipped employee a cash wage of <strong>$2.13 an hour</strong> and count up to $5.12 an hour of tips toward the $7.25 federal minimum wage (the tip credit). Gross pay is the cash wage times hours plus all tips received.</p>
<p>The employer must check each workweek that cash wage plus tips is at least $7.25 an hour and make up any shortfall. A server who works 30 hours and earns $120 in tips gets $63.90 cash wage + $120 = $183.90, which is $6.13 an hour, so the employer owes another $33.60 to reach $217.50.</p>
<p>Many states set a higher cash wage or ban the tip credit altogether (California, Washington, Oregon, Nevada, Minnesota, Montana and Alaska among them), so check your state's minimum wage for tipped work.</p>`
    },
    {
      h2: 'What is the difference between gross pay, taxable wages and net pay?',
      html: `<p><strong>Gross pay</strong> is the total earned. <strong>Taxable wages</strong> are gross pay minus pre-tax deductions, and there are two versions: traditional 401(k) and 403(b) contributions lower income-tax wages (W-2 box 1) but not Social Security and Medicare wages (boxes 3 and 5), while Section 125 health premiums lower both. <strong>Net pay</strong> is what reaches your bank account after taxes and all deductions.</p>
<p>So $1,935 gross with a $116 401(k) contribution has $1,819 of federal taxable wages but $1,935 of Social Security wages. To go from gross to net, use the <a href="/take-home-pay-calculator">take-home pay calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'Is gross pay before or after taxes?', a: 'Before. Gross pay is total earnings before federal and state income tax, Social Security, Medicare and any deductions. Net pay is after.' },
    { q: 'How do I calculate gross pay for salaried employees?', a: 'Divide the annual salary by the number of pay periods. $58,000 is $2,230.77 every two weeks, $2,416.67 twice a month, or $4,833.33 a month.' },
    { q: 'What is gross monthly income on $20 an hour?', a: '$3,466.67 at 40 hours a week: $20 × 40 × 52 ÷ 12. Multiplying the $800 weekly pay by 4 would give only $3,200.' },
    { q: 'Do tips count as gross pay?', a: 'Yes. Tips you receive, whether cash or card, are part of gross pay and taxable wages. Employees must report monthly tips of $20 or more to their employer.' },
    { q: 'Is gross pay the same as gross income?', a: 'Close. Gross pay is what one employer pays you. Gross income on your tax return also includes interest, self-employment profit, rental income and other sources.' },
    { q: 'Does gross pay include the employer 401(k) match?', a: 'No. The employer match goes straight into your account and is not part of your gross wages, though it is part of total compensation.' },
    { q: 'How is overtime handled on a biweekly payroll?', a: 'Overtime is counted week by week. Two 40-hour weeks earn none, while a 46-hour week followed by a 34-hour week earns 6 overtime hours, even though the period total is 80.' }
  ],
  related: ['take-home-pay-calculator', 'overtime-calculator', 'salary-to-hourly-calculator', 'ytd-income-calculator', 'dti-calculator'],
  sources: [
    { name: 'U.S. Department of Labor: Minimum wages for tipped employees', url: 'https://www.dol.gov/agencies/whd/state/minimum-wage/tipped' },
    { name: 'DOL Fact Sheet #15: Tipped Employees Under the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa' },
    { name: 'IRS: Publication 15 (Circular E), Employer\'s Tax Guide', url: 'https://www.irs.gov/publications/p15' },
    { name: 'IRS: Tip recordkeeping and reporting', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/tip-recordkeeping-and-reporting' }
  ]
};
