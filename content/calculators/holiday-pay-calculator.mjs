export default {
  slug: 'holiday-pay-calculator',
  hub: 'pay',
  name: 'Holiday Pay Calculator',
  title: 'Holiday Pay Calculator: 8 Hours at 1.5× on $18/hr = $216',
  h1: 'Holiday Pay Calculator: Premium Rates, Paid Days Off and Holiday-Week Overtime',
  meta: 'Working 8 holiday hours at time and a half on an $18 wage pays $216, $72 more than a normal shift. Add the rest of the week to see total pay with overtime.',
  keyword: 'how to calculate holiday pay',
  also: ['how is holiday pay calculated', 'how to calculate holiday pay for hourly employees', 'how to calculate holiday pay on overtime', 'holiday pay calculator', 'time and a half holiday pay'],
  updated: '2026-11-13',
  inputs: [
    { id: 'rate', label: 'Regular hourly rate', type: 'number', value: 18, prefix: '$', suffix: '/hr' },
    { id: 'hol', label: 'Hours worked on the holiday', type: 'number', value: 8, suffix: 'hours' },
    { id: 'mult', label: 'Holiday rate', type: 'select', value: '1.5', options: [['1', 'Straight time (1×)'], ['1.5', 'Time and a half (1.5×)'], ['2', 'Double time (2×)'], ['2.5', 'Double time and a half (2.5×)']] },
    { id: 'other', label: 'Other hours worked that week', type: 'number', value: 32, suffix: 'hours' },
    { id: 'off', label: 'Paid holiday hours not worked', type: 'number', value: 0, suffix: 'hours', help: 'Holiday pay for a day off. Does not count toward 40 hours.' },
    { id: 'otRule', label: 'If the week goes over 40 hours', type: 'select', value: 'credit', options: [['credit', 'Holiday premium counts toward overtime (FLSA allows)'], ['stack', 'Pay overtime on top of the holiday premium']] }
  ],
  compute(v, H) {
    var r = v.rate;
    if (!(r > 0)) return { error: 'Enter your hourly rate.' };
    var hol = v.hol > 0 ? v.hol : 0, other = v.other > 0 ? v.other : 0, off = v.off > 0 ? v.off : 0;
    if (hol + other + off <= 0) return { error: 'Enter the hours you worked or were paid for.' };
    if (hol > 24) return { error: 'A holiday has at most 24 hours.' };
    var m = Number(v.mult) || 1.5;
    var worked = hol + other;
    var otH = Math.max(0, worked - 40);
    var holPrem = (m - 1) * r * hol;
    var otPrem = 0.5 * r * otH;
    var extraOt = v.otRule === 'stack' || m < 1.5 ? otPrem : Math.max(0, otPrem - holPrem);
    var holPay = hol * r * m;
    var offPay = off * r;
    var total = other * r + holPay + offPay + extraOt;
    var rows = [['Holiday rate', H.money(r * m) + '/hr']];
    if (other > 0) rows.push(['Other hours (' + H.num(other, 2) + ' h × ' + H.money(r) + ')', H.money(other * r)]);
    if (off > 0) rows.push(['Paid holiday off (' + H.num(off, 2) + ' h × ' + H.money(r) + ')', H.money(offPay)]);
    if (otH > 0) rows.push(['Overtime premium still owed (' + H.num(otH, 2) + ' h over 40)', H.money(extraOt)]);
    rows.push(['Total gross pay for the week', H.money(total), true]);
    rows.push(['Extra vs a normal shift', H.money(holPrem)]);
    var sub = otH > 0 ? (v.otRule === 'stack' || m < 1.5 ? 'Overtime is paid in addition to the holiday premium.' : extraOt > 0 ? 'The holiday premium covers part of the overtime owed; the rest is added.' : 'The holiday premium already covers the overtime owed for hours over 40, as federal rules allow.') : 'No overtime: hours actually worked total ' + H.num(worked, 2) + '. Paid time off does not count toward 40.';
    return {
      value: H.money(holPay + offPay),
      label: 'Holiday pay',
      expr: H.num(hol, 2) + ' h × ' + H.money(r) + ' × ' + m + (off > 0 ? ' + ' + H.num(off, 2) + ' h × ' + H.money(r) : ''),
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `Holiday pay is hours worked on the holiday × your hourly rate × the holiday multiplier. At <strong>$18 an hour</strong>, an 8-hour holiday shift at time and a half pays 8 × $27 = <strong>${r.value}</strong>, which is $72 more than the same shift on a normal day ($144). At double time it would be $288. U.S. law does not require holiday premiums; your employer's policy sets the rate.`,
  stepsTitle: 'How to calculate holiday pay',
  steps: [
    'Check your employer\'s policy for the holiday rate: straight time, time and a half (most common for private employers) or double time.',
    'Multiply your hourly rate by that multiplier, then by the hours you worked on the holiday.',
    'If you were off but paid for the holiday, multiply your normal scheduled hours by your regular rate (8 × $18 = $144).',
    'Count only hours actually worked toward the 40-hour overtime threshold. Including paid holiday hours you did not work is the most common mistake.',
    'If the week tops 40 hours, a holiday premium of at least 1.5× can be credited toward the overtime owed, unless your policy pays both.'
  ],
  formulaTitle: 'What is the holiday pay formula?',
  formula: {
    expr: 'Holiday pay = Holiday hours worked × Rate × Multiplier<br>Paid day off = Scheduled hours × Rate<br>Overtime still owed = 0.5 × Rate × (Hours worked − 40) − Holiday premium (if creditable)',
    vars: [['Multiplier', '1.5 for time and a half, 2 for double time'], ['Holiday premium', '(Multiplier − 1) × Rate × Holiday hours'], ['Hours worked', 'actual hours on the job, including the holiday shift but not paid time off']],
    note: 'Under 29 CFR 778.203 and 778.219, extra pay for working on a holiday at a rate of at least 1.5× may be credited toward FLSA overtime for the same week.'
  },
  example: `<p>Luis earns $18 an hour. Thanksgiving week he works his regular 40 hours Monday to Friday, plus 8 hours on Thanksgiving at time and a half: 48 hours worked.</p>
<p>Straight time for all 48 hours: $864. Holiday premium: 8 × $9 = $72. Overtime premium owed for 8 hours over 40: 8 × $9 = $72.</p>
<p>If the employer credits the holiday premium toward overtime (federal minimum): $864 + $72 = <strong>$936</strong>. If the policy pays both: $864 + $72 + $72 = <strong>$1,008</strong>.</p>`,
  table: {
    title: 'How much is holiday pay for an 8-hour shift?',
    intro: 'Pay for 8 hours worked on a holiday at common hourly rates and holiday multipliers, from the calculator above.',
    head: ['Hourly rate', 'Straight (1×)', 'Time and a half', 'Double time', 'Double time and a half'],
    rows: ({ run, H }) => [12, 15, 16, 18, 20, 22, 25, 28, 30, 35, 40].map(x => [H.money(x), ...['1', '1.5', '2', '2.5'].map(m => run({ rate: x, hol: 8, mult: m, other: 0, off: 0, otRule: 'credit' }).value)])
  },
  sections: [
    {
      h2: 'Is holiday pay required by law?',
      html: `<p>Not for most private employers. The Fair Labor Standards Act does not require pay for holidays off or a premium for working on one; holiday pay is a matter of company policy or a union contract. The federal rule that does apply is overtime: hours worked on the holiday count toward 40 for the week.</p>
<p>Exceptions to know:</p>
<ul>
<li><strong>Federal employees</strong> who work on a holiday earn holiday premium pay equal to their basic rate, so they receive double pay for those non-overtime hours.</li>
<li><strong>Rhode Island</strong> requires time and a half for most retail work on Sundays and certain holidays.</li>
<li><strong>Public employers and union contracts</strong> often set double time or double time and a half for holiday work.</li>
</ul>
<p>Once an employer promises holiday pay in a written policy, many states treat it as wages it must pay as promised.</p>`
    },
    {
      h2: 'How is holiday pay calculated for hourly employees?',
      html: `<p>There are two different payments, and a week can include both.</p>
<p><strong>Paid holiday off:</strong> the employer pays your normal scheduled hours at your regular rate. A full-timer on an 8-hour schedule at $18 gets $144. Part-timers are often paid their average daily hours, or nothing if the policy covers only full-time staff.</p>
<p><strong>Working the holiday:</strong> you are paid for the hours worked at the holiday rate. Some employers pay both: the holiday's regular pay plus premium pay for working it, which is how "double time" holiday pay often comes about in practice.</p>
<p>Salaried exempt employees are paid their full salary for any week they work, so a holiday closure does not reduce their pay; employers may still offer a floating day off if they work the holiday.</p>`
    },
    {
      h2: 'How do you calculate holiday pay on overtime?',
      html: `<p>Add up the hours actually worked that week, including the holiday shift. If the total is 40 or less, there is no overtime, just the holiday rate for the holiday hours. Paid holiday hours you did not work never count toward 40, so a week with a paid Thanksgiving off and 36 hours worked has no overtime even though the check pays for 44 hours.</p>
<p>If you worked more than 40, the employer owes half your regular rate on top of straight time for each hour over 40. A premium of at least 1.5× paid for the holiday hours can count toward that overtime. Choose "Pay overtime on top" in the calculator if your policy stacks them, as many union contracts do. For overtime without a holiday, use the <a href="/overtime-calculator">overtime calculator</a>.</p>`
    },
    {
      h2: 'Which days are federal holidays in late 2026 and 2027?',
      html: `<p>Private employers choose their own paid holidays, but most follow the federal list. Coming up: Thanksgiving, Thursday, Nov 26, 2026; Christmas, Friday, Dec 25, 2026; New Year's Day, Friday, Jan 1, 2027.</p>
<p>In 2027: Martin Luther King Jr. Day (Jan 18), Washington's Birthday (Feb 15), Memorial Day (May 31), Juneteenth (Saturday, June 19, observed Friday, June 18), Independence Day (Sunday, July 4, observed Monday, July 5), Labor Day (Sept 6), Columbus Day (Oct 11), Veterans Day (Thursday, Nov 11), Thanksgiving (Nov 25) and Christmas (Saturday, Dec 25, observed Friday, Dec 24). New Year's Day 2028 falls on a Saturday, so federal offices observe it on Friday, Dec 31, 2027.</p>`
    }
  ],
  faq: [
    { q: 'How much is time and a half holiday pay on $15 an hour?', a: '$22.50 an hour. An 8-hour holiday shift pays $180, which is $60 more than a regular $120 shift.' },
    { q: 'Do holiday hours count toward overtime?', a: 'Hours you actually work on a holiday count toward the 40-hour overtime threshold. Paid holiday hours you take off do not.' },
    { q: 'Do employers have to pay holiday pay?', a: 'Not under federal law for private employers. Holiday pay and holiday premiums come from company policy or a contract, though a few states and public employers have their own rules.' },
    { q: 'What is double time holiday pay?', a: 'Twice your regular rate for hours worked on the holiday: $36 an hour on an $18 wage, or $288 for an 8-hour shift.' },
    { q: 'How do I calculate holiday pay for a part-time employee?', a: 'Most policies pay part-timers the hours they would normally have worked that day, often their average daily hours over recent weeks. Some policies give holiday pay only to full-time staff.' },
    { q: 'Can I get holiday pay and overtime in the same week?', a: 'Yes. You can receive holiday premium pay and overtime in one week, but under federal rules a holiday premium of 1.5× or more can be counted toward the overtime owed, so you may not get both premiums in full unless your policy says so.' },
    { q: 'Is holiday pay taxed differently?', a: 'No. Holiday pay is ordinary wages, taxed like the rest of your paycheck. A larger check can look more heavily withheld because payroll annualizes it.' }
  ],
  related: ['overtime-calculator', 'pto-accrual-calculator', 'gross-pay-calculator', 'salary-to-hourly-calculator'],
  sources: [
    { name: 'U.S. Department of Labor: Holidays', url: 'https://www.dol.gov/general/topic/workhours/holidays' },
    { name: 'eCFR: 29 CFR 778.203, Premium pay for work on certain days', url: 'https://www.ecfr.gov/current/title-29/section-778.203' },
    { name: 'OPM: Federal holidays', url: 'https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/' },
    { name: 'U.S. Department of Labor: Overtime Pay', url: 'https://www.dol.gov/agencies/whd/overtime' }
  ]
};
