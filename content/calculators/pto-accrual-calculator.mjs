export default {
  slug: 'pto-accrual-calculator',
  hub: 'pay',
  name: 'PTO Accrual Calculator',
  title: 'PTO Accrual Calculator: 15 Days a Year = 0.0577 Hours per Hour',
  h1: 'PTO Accrual Calculator: Hours Earned per Hour Worked, per Paycheck and at Payout',
  meta: '15 days (120 hours) of PTO a year on a 40-hour week accrues 0.0577 hours per hour worked, or 4.62 hours a biweekly paycheck. Find your rate, balance and payout.',
  keyword: 'how to calculate pto accrual per hour',
  also: ['how to calculate pto payout', 'how do you calculate vacation accrual', 'how to calculate pto hours', 'how do you calculate pto hours', 'how much pto will i have calculator', 'how to calculate prorated pto', 'how to calculate vacation payout for salaried employees', 'how to calculate vacation pay', 'how to calculate vacation payout'],
  updated: '2026-11-13',
  inputs: [
    { id: 'amount', label: 'PTO earned per year', type: 'number', value: 15 },
    { id: 'unit', label: 'Unit', type: 'select', value: 'days', options: [['days', 'Days'], ['hours', 'Hours']] },
    { id: 'hpd', label: 'Hours in a workday', type: 'number', value: 8, suffix: 'hours', showIf: { unit: ['days'] } },
    { id: 'hpw', label: 'Hours worked per week', type: 'number', value: 40, suffix: 'hours' },
    { id: 'freq', label: 'Pay frequency', type: 'select', value: '26', options: [['52', 'Weekly'], ['26', 'Every two weeks'], ['24', 'Twice a month'], ['12', 'Monthly']] },
    { id: 'balance', label: 'Current PTO balance', type: 'number', value: 40, suffix: 'hours' },
    { id: 'ahead', label: 'Paychecks until you need the time', type: 'number', value: 10 },
    { id: 'cap', label: 'Accrual cap (if any)', type: 'number', value: '', suffix: 'hours', placeholder: 'e.g. 180' },
    { id: 'rate', label: 'Hourly rate (for payout value)', type: 'number', value: 25, prefix: '$', help: 'Salaried? Use annual salary ÷ 2,080.' }
  ],
  compute(v, H) {
    if (!(v.amount > 0)) return { error: 'Enter how much PTO you earn per year.' };
    if (!(v.hpw > 0) || v.hpw > 100) return { error: 'Enter the hours you work per week.' };
    var hpd = v.hpd > 0 ? v.hpd : 8;
    var yearH = v.unit === 'hours' ? v.amount : v.amount * hpd;
    var workH = v.hpw * 52;
    var perHour = yearH / workH;
    var n = Number(v.freq) || 26;
    var perCheck = yearH / n;
    var bal = v.balance > 0 ? v.balance : 0;
    var ahead = v.ahead > 0 ? v.ahead : 0;
    var future = bal + perCheck * ahead;
    var capped = v.cap > 0 && future > v.cap;
    if (capped) future = Math.max(bal, v.cap);
    var rows = [
      ['Per paycheck', H.num(perCheck, 2) + ' hours', true],
      ['Per month', H.num(yearH / 12, 2) + ' hours'],
      ['Per week', H.num(yearH / 52, 2) + ' hours'],
      ['PTO hours per year', H.num(yearH, 2) + ' (' + H.num(yearH / hpd, 2) + ' days)'],
      ['Hours worked to earn 1 day', H.num(hpd / perHour, 2)],
      ['Accrual as "1 hour per … hours"', '1 per ' + H.num(1 / perHour, 2)]
    ];
    if (ahead > 0) rows.push(['Balance after ' + H.num(ahead, 0) + ' paychecks', H.num(future, 2) + ' hours' + (capped ? ' (capped)' : '')]);
    if (v.rate > 0) rows.push(['Payout value of current balance', H.money(bal * v.rate), true]);
    return {
      value: H.fix(perHour, 4) + ' h',
      label: 'PTO accrued per hour worked',
      expr: H.num(yearH, 2) + ' PTO h ÷ ' + H.num(workH, 2) + ' work h',
      rows: rows,
      sub: 'About ' + H.num(perHour * 60, 1) + ' minutes of PTO for every hour you work.' + (capped ? ' Your cap stops accrual until you use some time.' : '')
    };
  },
  quick: ({ r }) => `PTO accrual per hour is your yearly PTO hours divided by the hours you work in a year. <strong>15 days</strong> of PTO (120 hours) on a 40-hour week is 120 ÷ 2,080 = <strong>${r.value}</strong> of PTO per hour worked, about 3.5 minutes an hour. That is 4.62 hours every biweekly paycheck, or 10 hours a month, so a full 8-hour day takes 138.67 hours of work.`,
  stepsTitle: 'How to calculate PTO accrual',
  steps: [
    'Convert your annual PTO to hours: days × hours in a workday. 15 days × 8 = 120 hours.',
    'Find the hours you work in a year: hours per week × 52. Use your actual schedule if part-time; using 2,080 for a 30-hour week is a common error that understates the rate.',
    'Divide PTO hours by work hours for the accrual per hour worked: 120 ÷ 2,080 = 0.0577.',
    'For accrual per paycheck, divide yearly PTO hours by the number of paychecks (26, 24, 52 or 12).',
    'For a payout, multiply the hours in your balance by your current hourly rate.'
  ],
  formulaTitle: 'What is the PTO accrual formula?',
  formula: {
    expr: 'Accrual per hour = Annual PTO hours ÷ (Hours per week × 52)<br>Accrual per paycheck = Annual PTO hours ÷ Paychecks per year<br>Payout = Balance hours × Hourly rate',
    vars: [['Annual PTO hours', 'PTO days × hours per workday'], ['Paychecks per year', '52 weekly, 26 biweekly, 24 semi-monthly, 12 monthly'], ['Hourly rate', 'for salaried staff, annual salary ÷ 2,080']]
  },
  example: `<p>Jenna gets 20 days of PTO a year, works 40 hours a week and is paid every two weeks. Her balance is 52 hours and she earns $31.25 an hour ($65,000 a year).</p>
<p>Annual PTO: 20 × 8 = 160 hours. Accrual rate: 160 ÷ 2,080 = <strong>0.0769 hours</strong> per hour worked, or 160 ÷ 26 = <strong>6.15 hours</strong> per paycheck.</p>
<p>She wants a 5-day (40-hour) trip in 6 paychecks: 52 + 6 × 6.15 = 88.92 hours, enough with 48.92 to spare. If she left today, her 52-hour balance would pay out at 52 × $31.25 = <strong>$1,625</strong> where payout is required.</p>`,
  table: {
    title: 'What is the PTO accrual rate for common allowances?',
    intro: 'Accrual rates for a full-time 40-hour week (2,080 hours) and 8-hour days, computed by the calculator above.',
    head: ['PTO per year', 'Per hour worked', 'Per biweekly check', 'Per semi-monthly check', 'Per month'],
    rows: ({ run }) => [5, 10, 12, 15, 18, 20, 25, 30].map(d => {
      const g = f => run({ amount: d, unit: 'days', hpd: 8, hpw: 40, freq: f, balance: 0, ahead: 0, cap: NaN, rate: NaN });
      return [d + ' days (' + d * 8 + ' h)', g('26').value, g('26').rows[0][1], g('24').rows[0][1], g('26').rows[1][1]];
    }),
    note: 'California\'s minimum paid sick leave accrual of 1 hour per 30 hours worked equals 0.0333 hours per hour, or 69.33 hours a year at full time.'
  },
  sections: [
    {
      h2: 'How do you calculate prorated PTO?',
      html: `<p><strong>New hires:</strong> multiply the annual allowance by the share of the year left. Someone hired April 1 into a 120-hour plan gets 120 × 9 ÷ 12 = <strong>90 hours</strong> for their first year if PTO is front-loaded; if it accrues per hour, it prorates itself.</p>
<p><strong>Part-time employees:</strong> multiply the full-time allowance by hours worked ÷ 40. A 24-hour-a-week employee in a 120-hour plan earns 120 × 24 ÷ 40 = 72 hours a year, which is the same 0.0577 hours per hour worked. Enter 24 hours a week and 72 hours a year in the calculator to check.</p>
<p><strong>Leaving mid-year:</strong> under accrual plans you keep only what you have earned to date; under front-loaded plans, some employers recover time used but not yet earned, where state law allows.</p>`
    },
    {
      h2: 'How do you calculate PTO payout?',
      html: `<p>Multiply your unused balance by your current rate of pay. For a salaried employee, the hourly rate is annual salary ÷ 2,080: a $72,800 salary is $35 an hour, so 64 hours pays out <strong>$2,240</strong>.</p>
<p>Whether you get paid out depends on state law and your employer's policy. California, Colorado, Illinois, Massachusetts, Montana and Nebraska, among others, treat earned vacation as wages that must be paid at separation. Many other states only require payout if the written policy promises it. Federal law does not require paid vacation at all.</p>
<p>A payout is taxed as wages. Employers often withhold federal tax at the flat 22% supplemental rate, plus Social Security and Medicare.</p>`
    },
    {
      h2: 'Does PTO accrue on overtime and paid time off?',
      html: `<p>It is up to the policy. Common setups are: accrual on all hours worked (overtime included), accrual on hours paid up to 40 a week, or a flat amount per paycheck regardless of hours. A flat per-paycheck accrual of 4.62 hours does not grow when you work 50 hours.</p>
<p>Most plans do not accrue on PTO itself, and many cap your balance (for example at 1.5 times the annual amount). Once you hit the cap, you stop earning until you use some. California, Colorado, Montana and Nebraska do not allow "use it or lose it" forfeiture of earned vacation, but a cap on future accrual is allowed.</p>`
    },
    {
      h2: 'How much PTO will I have by a certain date?',
      html: `<p>Add your current balance to the accrual per paycheck times the number of paychecks before the date, then subtract any time already booked. With 40 hours banked and 4.62 hours a paycheck, 10 paychecks from now you will have 40 + 46.15 = <strong>86.15 hours</strong>, about 10.8 days. Enter "Paychecks until you need the time" above to run your own date, and use the <a href="/business-days-calculator">business days calculator</a> to count how many workdays a trip uses.</p>`
    }
  ],
  faq: [
    { q: 'How many hours of PTO do I earn per hour worked?', a: 'Divide annual PTO hours by annual work hours. 80 hours (2 weeks) of PTO on a 40-hour schedule is 0.0385 hours per hour worked; 120 hours is 0.0577.' },
    { q: 'What does 1 hour of PTO for every 30 hours worked equal?', a: '0.0333 hours per hour worked, which is about 69 hours (8.7 days) a year for a full-time employee working 2,080 hours.' },
    { q: 'How many hours of PTO is 3 weeks?', a: '120 hours for a 40-hour week. That accrues at 4.62 hours per biweekly paycheck.' },
    { q: 'How do I calculate PTO for salaried employees?', a: 'The same way: salaried employees usually accrue as if they work 40 hours a week, so 2,080 hours a year. Their payout rate is annual salary ÷ 2,080.' },
    { q: 'Is PTO paid out when you quit?', a: 'Only if your state requires it or your employer\'s policy promises it. California, Colorado, Montana and Nebraska, among others, require payout of earned vacation.' },
    { q: 'Is PTO the same as vacation and sick time?', a: 'PTO usually combines vacation, sick and personal days into one bank. Some employers keep separate vacation and sick balances with different accrual rates and payout rules.' },
    { q: 'Do you accrue PTO while on PTO?', a: 'Usually not under per-hour-worked plans, since PTO hours are not hours worked. Per-paycheck plans often keep accruing during paid leave.' }
  ],
  related: ['holiday-pay-calculator', 'salary-to-hourly-calculator', 'business-days-calculator', 'gross-pay-calculator'],
  sources: [
    { name: 'U.S. Department of Labor: Vacation Leave', url: 'https://www.dol.gov/general/topic/workhours/vacation_leave' },
    { name: 'California DIR: Vacation FAQ', url: 'https://www.dir.ca.gov/dlse/faq_vacation.htm' },
    { name: 'California DIR: Paid Sick Leave', url: 'https://www.dir.ca.gov/dlse/paid_sick_leave.htm' },
    { name: 'IRS: Publication 15 (Circular E), supplemental wages', url: 'https://www.irs.gov/publications/p15' }
  ]
};
