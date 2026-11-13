export default {
  slug: 'lost-wages-calculator',
  hub: 'pay',
  name: 'Lost Wages Calculator',
  title: 'Lost Wages Calculator: 12 Days on a $65,000 Salary = $3,000',
  h1: 'Lost Wages Calculator: Missed Workdays for Salaried, Hourly and Overtime Pay',
  meta: 'A $65,000 salary is $250 per workday, so 12 missed days is $3,000 in lost wages. Work out lost pay for an injury claim or unpaid leave, hourly or salaried.',
  keyword: 'how to calculate lost wages for salaried employee',
  also: ['how to calculate lost wages', 'how to calculate daily pay rate', 'how to calculate average weekly wage', 'lost wages calculator', 'how to calculate lost income from injury'],
  updated: '2026-11-13',
  inputs: [
    { id: 'type', label: 'Pay type', type: 'select', value: 'salary', options: [['salary', 'Salary'], ['hourly', 'Hourly']] },
    { id: 'salary', label: 'Annual salary', type: 'number', value: 65000, prefix: '$', showIf: { type: ['salary'] } },
    { id: 'rate', label: 'Hourly rate', type: 'number', value: 22, prefix: '$', showIf: { type: ['hourly'] } },
    { id: 'hpd', label: 'Hours in a normal workday', type: 'number', value: 8, suffix: 'hours', showIf: { type: ['hourly'] } },
    { id: 'ot', label: 'Overtime normally worked per week', type: 'number', value: 0, suffix: 'hours', showIf: { type: ['hourly'] } },
    { id: 'dpw', label: 'Workdays per week', type: 'number', value: 5, suffix: 'days' },
    { id: 'days', label: 'Workdays missed', type: 'number', value: 12, suffix: 'days' },
    { id: 'partial', label: 'Extra partial-day hours missed', type: 'number', value: 0, suffix: 'hours', help: 'Appointments, therapy or half days.' },
    { id: 'benefits', label: 'Lost benefits (e.g. 401(k) match)', type: 'number', value: 0, suffix: '% of pay' }
  ],
  compute(v, H) {
    if (!(v.dpw > 0) || v.dpw > 7) return { error: 'Enter workdays per week (1 to 7).' };
    var days = v.days > 0 ? v.days : 0, partial = v.partial > 0 ? v.partial : 0;
    if (days + partial <= 0) return { error: 'Enter the workdays or hours you missed.' };
    var daily, hourly, otLost = 0, rows = [], expr;
    if (v.type === 'hourly') {
      if (!(v.rate > 0)) return { error: 'Enter your hourly rate.' };
      var hpd = v.hpd > 0 ? v.hpd : 8;
      hourly = v.rate; daily = v.rate * hpd;
      if (v.ot > 0) otLost = v.ot * v.rate * 1.5 * days / v.dpw;
      expr = H.num(days, 2) + ' days × ' + H.money(daily);
      rows.push(['Daily pay (' + H.num(hpd, 2) + ' h × ' + H.money(v.rate) + ')', H.money(daily)]);
    } else {
      if (!(v.salary > 0)) return { error: 'Enter your annual salary.' };
      var wd = v.dpw * 52;
      daily = v.salary / wd; hourly = daily / 8;
      expr = H.money0(v.salary) + ' ÷ ' + H.num(wd, 0) + ' workdays × ' + H.num(days, 2);
      rows.push(['Daily rate (' + H.money0(v.salary) + ' ÷ ' + H.num(wd, 0) + ')', H.money(daily)]);
    }
    var base = daily * days + hourly * partial;
    rows.push(['Wages for ' + H.num(days, 2) + ' missed days', H.money(daily * days)]);
    if (partial > 0) rows.push(['Partial days (' + H.num(partial, 2) + ' h × ' + H.money(hourly) + ')', H.money(hourly * partial)]);
    if (otLost > 0) rows.push(['Lost overtime', H.money(otLost)]);
    var ben = v.benefits > 0 ? (base + otLost) * v.benefits / 100 : 0;
    if (ben > 0) rows.push(['Lost benefits (' + H.pct(v.benefits, 2) + ')', H.money(ben)]);
    var total = base + otLost + ben;
    rows.push(['Weeks of work missed', H.num(days / v.dpw, 2)]);
    rows.push(['Average weekly wage', H.money(daily * v.dpw + (v.type === 'hourly' && v.ot > 0 ? v.ot * v.rate * 1.5 : 0))]);
    return {
      value: H.money(total),
      label: 'Total lost wages',
      expr: expr,
      rows: rows,
      sub: 'Gross wages before tax, which is how most claims and employer verification letters state them.'
    };
  },
  quick: ({ r }) => `To calculate lost wages for a salaried employee, divide annual salary by the workdays in a year (5 × 52 = 260) and multiply by the days missed. A <strong>$65,000</strong> salary is $250 a workday, so 12 missed days is <strong>${r.value}</strong> in lost wages. For hourly work, multiply your rate by your normal daily hours and the days missed, plus any overtime you would have worked.`,
  stepsTitle: 'How to calculate lost wages',
  steps: [
    'Find your daily rate. Salaried: annual salary ÷ 260 workdays (or ÷ 52 ÷ your workdays per week). Hourly: rate × normal hours per day.',
    'Count the scheduled workdays you missed, not calendar days. Counting weekends you would not have worked is the most common overstatement.',
    'Add partial days for medical appointments, therapy or reduced hours at your hourly equivalent.',
    'Add overtime, shift differentials, bonuses or commissions you can show you regularly earned, and lost benefits such as a 401(k) match.',
    'Back it up with pay stubs, W-2s and a letter from your employer confirming your rate and the dates missed.'
  ],
  formulaTitle: 'What is the formula for lost wages?',
  formula: {
    expr: 'Salaried daily rate = Annual salary ÷ (Workdays per week × 52)<br>Hourly daily rate = Hourly rate × Hours per day<br>Lost wages = Daily rate × Days missed + Hourly rate × Partial hours + Lost overtime',
    vars: [['Workdays per week', 'usually 5, so 260 workdays a year'], ['Days missed', 'scheduled workdays you could not work'], ['Lost overtime', 'regular weekly overtime × 1.5 × rate × weeks missed']]
  },
  example: `<p>Marcus, a warehouse lead, earns $22 an hour on 8-hour days, 5 days a week, and normally works 5 hours of overtime each week. After a car accident he misses 15 workdays and then 6 hours of physical therapy appointments.</p>
<p>Regular pay: 15 × $176 = $2,640. Partial days: 6 × $22 = $132. Lost overtime: 5 h × $33 × 3 weeks = $495.</p>
<p>Total lost wages: $2,640 + $132 + $495 = <strong>$3,267</strong>. His average weekly wage, including regular overtime, is $880 + $165 = $1,045.</p>`,
  table: {
    title: 'How much is a day of lost wages on common salaries?',
    intro: 'Daily rate on a 5-day week (260 workdays) and the wages lost over 1, 2, 4 and 6 weeks of missed work.',
    head: ['Annual salary', 'Per workday', '1 week (5 days)', '2 weeks', '4 weeks', '6 weeks'],
    rows: ({ run, H }) => [30000, 40000, 50000, 60000, 65000, 75000, 90000, 100000, 125000, 150000].map(s => {
      const g = d => run({ type: 'salary', salary: s, dpw: 5, days: d, partial: 0, benefits: 0 }).value;
      return [H.money0(s), H.money(s / 260), g(5), g(10), g(20), g(30)];
    })
  },
  sections: [
    {
      h2: 'Should you divide a salary by 260 or 365 days?',
      html: `<p>Divide by <strong>260</strong> (workdays) when you count missed <em>workdays</em>, and by 365 only when you count <em>calendar</em> days, including weekends. Both give the same total for whole weeks: two weeks off is 10 × $250 = $2,500 or 14 × $178.08 = $2,493 on a $65,000 salary (the gap is because 52 weeks is 364 days).</p>
<p>Mixing them is where claims go wrong: calendar days with a workday rate overstate the loss by 40%, and workdays with a calendar rate understate it by 29%. For partial days, use the hourly equivalent: salary ÷ 2,080, which is $31.25 an hour at $65,000.</p>`
    },
    {
      h2: 'What documents prove lost wages?',
      html: `<ul>
<li><strong>Wage verification letter</strong> from your employer on company letterhead: job title, pay rate, normal schedule, dates you missed and whether you used sick leave or PTO.</li>
<li><strong>Pay stubs</strong> from before and after the absence, showing regular hours and overtime.</li>
<li><strong>W-2s or tax returns</strong> for the past one or two years, especially if pay varies.</li>
<li><strong>Medical records</strong> or a doctor's note stating you could not work for those dates.</li>
<li><strong>Self-employed:</strong> tax returns with Schedule C, 1099s, invoices and canceled contracts, plus bank statements showing the drop in income.</li>
</ul>
<p>Insurance adjusters usually ask for the employer letter and recent stubs first.</p>`
    },
    {
      h2: 'Are lost wages from a settlement taxable?',
      html: `<p>It depends on why you were paid. Under federal tax law, damages received for a <strong>personal physical injury or physical sickness</strong>, such as a car accident claim, are generally not taxable, and that includes the part meant to replace lost wages. Workers' compensation benefits are also tax-free.</p>
<p>Lost wages paid in an <strong>employment case</strong>, such as wrongful termination or discrimination back pay, are taxable wages and are usually reported on a W-2 with payroll taxes withheld. Punitive damages and interest are taxable in almost every case. IRS Publication 4345 explains the rules; for large settlements, ask a tax professional before signing.</p>`
    },
    {
      h2: 'How do you calculate lost wages when hours vary or you are self-employed?',
      html: `<p>Use an <strong>average weekly wage</strong>: add up gross pay for a recent stretch (13 or 52 weeks are common) and divide by the number of weeks. Workers' compensation systems use a version of this figure and then pay a share of it, often about two-thirds, subject to state limits. Your year-to-date total also works; see the <a href="/ytd-income-calculator">YTD income calculator</a>.</p>
<p>If you are self-employed, start from net profit (revenue minus expenses), not gross receipts. Divide last year's net profit by the days you actually worked, then multiply by the days lost, and keep records of jobs you had to turn down. Converting an hourly rate to a salary or back is quick with the <a href="/salary-to-hourly-calculator">salary to hourly calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate lost wages for one day?', a: 'Salaried: divide your annual salary by 260. Hourly: multiply your rate by your normal hours that day. $52,000 a year is $200 a day; $20 an hour for 8 hours is $160.' },
    { q: 'Can I claim lost wages if I used sick days or PTO?', a: 'Often yes. In many personal injury claims, paid leave you were forced to use counts as a loss, because you no longer have it for later. Rules vary by state and insurer.' },
    { q: 'Do lost wages include overtime?', a: 'They can, if you can show you regularly worked overtime before the absence, for example with pay stubs from the prior months.' },
    { q: 'Are lost wages calculated on gross or net pay?', a: 'Usually gross pay. Most claims and verification letters use pay before taxes, though some courts consider after-tax income for future earnings.' },
    { q: 'What is the average weekly wage?', a: 'Your gross pay over a recent period divided by the number of weeks. A $65,000 salary is an average weekly wage of $1,250.' },
    { q: 'Can I claim lost wages for doctor appointments?', a: 'Yes, time missed for treatment related to the injury is usually claimable. Enter those hours as partial-day hours in the calculator.' },
    { q: 'How do I calculate future lost earnings?', a: 'Future lost earning capacity is estimated from your expected wage path, work-life expectancy and a discount rate, and usually needs an economist or vocational expert. This calculator covers wages already lost.' }
  ],
  related: ['salary-to-hourly-calculator', 'ytd-income-calculator', 'gross-pay-calculator', 'business-days-calculator'],
  sources: [
    { name: 'IRS: Publication 4345, Settlements — Taxability', url: 'https://www.irs.gov/pub/irs-pdf/p4345.pdf' },
    { name: 'IRS: Publication 525, Taxable and Nontaxable Income', url: 'https://www.irs.gov/publications/p525' },
    { name: 'U.S. Department of Labor: Office of Workers\' Compensation Programs', url: 'https://www.dol.gov/agencies/owcp' }
  ],
  disclaimer: 'An arithmetic estimate, not legal advice. Claim rules differ by state, insurer and case.'
};
