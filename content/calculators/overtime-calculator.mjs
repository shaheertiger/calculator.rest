export default {
  slug: 'overtime-calculator',
  hub: 'pay',
  name: 'Overtime Calculator',
  title: 'Overtime Calculator: Time and a Half on $20/hr Is $30',
  h1: 'Overtime Pay Calculator: Weekly Hours, Double Time and California Rules',
  meta: 'At $20 an hour, time and a half is $30, so a 50-hour week pays $1,100 before tax. Work out overtime under the federal 40-hour rule or California daily rules.',
  keyword: 'how to calculate overtime',
  also: ['how to overtime calculation', 'how to calculate overtime pay', 'how to calculate overtime rate', 'how to calculate time and a half for overtime', 'how to calculate overtime in california', 'how to calculate overtime in texas', 'how is overtime calculated in texas', 'how to calculate double time and a half', 'overtime calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'rate', label: 'Hourly rate', type: 'number', value: 20, prefix: '$', suffix: '/hr' },
    { id: 'method', label: 'Overtime rule', type: 'select', value: 'week', options: [['week', 'Federal: over 40 hours a week'], ['ca', 'California: daily + weekly']] },
    { id: 'hours', label: 'Total hours worked this week', type: 'number', value: 50, suffix: 'hours', showIf: { method: ['week'] } },
    { id: 'mult', label: 'Overtime multiplier', type: 'number', value: 1.5, suffix: '×', help: 'The FLSA minimum is 1.5 (time and a half).', showIf: { method: ['week'] } },
    { id: 'dt', label: 'Of the overtime, hours at double time', type: 'number', value: 0, suffix: 'hours', help: 'Only if your contract or policy pays double time for some hours.', showIf: { method: ['week'] } },
    { id: 'dtRate', label: 'Double-time rate', type: 'select', value: '2', options: [['2', 'Double time (2×)'], ['2.5', 'Double time and a half (2.5×)']], showIf: { method: ['week'] } },
    {
      id: 'days', label: 'Hours worked each day (one workweek)', type: 'rows', addLabel: '+ add day', max: 7, showIf: { method: ['ca'] },
      fields: [
        { id: 'day', label: 'Day', type: 'text', value: '', placeholder: 'e.g. Mon' },
        { id: 'hours', label: 'Hours', type: 'number', value: 8 }
      ],
      value: [
        { day: 'Mon', hours: 10 }, { day: 'Tue', hours: 13 }, { day: 'Wed', hours: 8 }, { day: 'Thu', hours: 9 },
        { day: 'Fri', hours: 6 }, { day: 'Sat', hours: 0 }, { day: 'Sun', hours: 0 }
      ]
    },
    { id: 'bonus', label: 'Non-discretionary bonus this week', type: 'number', value: '', prefix: '$', placeholder: 'optional', help: 'Production, attendance or shift bonuses raise the overtime rate.' }
  ],
  compute(v, H) {
    var r = v.rate;
    if (!(r > 0)) return { error: 'Enter your hourly rate.' };
    var bonus = v.bonus > 0 ? v.bonus : 0;
    var reg = 0, ot = 0, dt = 0, otM = 1.5, dtM = 2;
    if (v.method === 'ca') {
      var days = (v.days || []).slice(0, 7).map(function (d) { return d.hours > 0 ? Math.min(d.hours, 24) : 0; });
      if (!days.some(function (x) { return x > 0; })) return { error: 'Enter the hours you worked on at least one day.' };
      var all7 = days.length === 7 && days.every(function (x) { return x > 0; });
      days.forEach(function (h, i) {
        if (all7 && i === 6) { ot += Math.min(h, 8); dt += Math.max(0, h - 8); }
        else { reg += Math.min(h, 8); ot += Math.min(Math.max(h - 8, 0), 4); dt += Math.max(0, h - 12); }
      });
      if (reg > 40) { ot += reg - 40; reg = 40; }
    } else {
      var hrs = v.hours;
      if (!(hrs > 0)) return { error: 'Enter the hours you worked this week.' };
      if (hrs > 168) return { error: 'A week only has 168 hours.' };
      reg = Math.min(hrs, 40);
      var over = Math.max(0, hrs - 40);
      dt = v.dt > 0 ? Math.min(v.dt, over) : 0;
      ot = over - dt;
      otM = v.mult >= 1 ? v.mult : 1.5;
      dtM = Number(v.dtRate) || 2;
    }
    var hours = reg + ot + dt;
    var rr = (r * hours + bonus) / hours;
    var otRate = r + (otM - 1) * rr, dtRate = r + (dtM - 1) * rr;
    var regPay = reg * r, otPay = ot * otRate, dtPay = dt * dtRate;
    var total = regPay + otPay + dtPay + bonus;
    var rows = [['Regular pay (' + H.num(reg, 2) + ' h × ' + H.money(r) + ')', H.money(regPay)]];
    if (ot > 0) rows.push(['Overtime pay (' + H.num(ot, 2) + ' h × ' + H.money(otRate) + ')', H.money(otPay), true]);
    if (dt > 0) rows.push(['Double-time pay (' + H.num(dt, 2) + ' h × ' + H.money(dtRate) + ')', H.money(dtPay), true]);
    if (bonus > 0) {
      rows.push(['Bonus', H.money(bonus)]);
      rows.push(['Regular rate incl. bonus', H.money(rr) + '/hr']);
    }
    rows.push(['Overtime rate', H.money(otRate) + '/hr']);
    rows.push(['Total hours', H.num(hours, 2)]);
    var expr = H.num(reg, 2) + ' h × ' + H.money(r) + (ot > 0 ? ' + ' + H.num(ot, 2) + ' h × ' + H.money(otRate) : '') + (dt > 0 ? ' + ' + H.num(dt, 2) + ' h × ' + H.money(dtRate) : '');
    var sub;
    if (v.method === 'ca') {
      var fed = r * hours + bonus + 0.5 * rr * Math.max(0, hours - 40);
      sub = total - fed > 0.005 ? 'The federal 40-hour rule alone would pay ' + H.money(fed) + '; California\'s daily overtime adds ' + H.money(total - fed) + '.' : 'Here California\'s daily rules pay the same as the federal 40-hour rule: ' + H.money(fed) + '.';
    } else {
      sub = ot + dt > 0 ? 'Overtime is ' + H.pct((otPay + dtPay) / total * 100, 1) + ' of this week\'s gross pay. Only hours past 40 in the workweek count, not hours past 8 in a day.' : 'No overtime: under the FLSA it starts after 40 hours in a workweek.';
    }
    return { value: H.money(total), label: 'Gross pay for the week', expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `Overtime under federal law is 1.5 times your regular rate for every hour over 40 in a workweek. At <strong>$20 an hour</strong>, time and a half is <strong>$30</strong>, so 10 overtime hours add $300 and a 50-hour week pays <strong>${r.value}</strong> before tax (40 × $20 + 10 × $30). Double time on the same rate is $40 an hour.`,
  stepsTitle: 'How to calculate overtime pay in 5 steps',
  steps: [
    'Add up the hours you actually worked in one fixed 7-day workweek. Paid vacation, sick and holiday hours you did not work are left out of the count.',
    'Subtract 40. Anything above 40 is overtime under the Fair Labor Standards Act. In California, also count hours over 8 in a day (see below).',
    'Find your <strong>regular rate</strong>: your hourly wage, plus any non-discretionary bonus spread over all hours worked. This is the step most people get wrong.',
    'Multiply the regular rate by 1.5 for the overtime rate, then by the overtime hours. Do the same at 2× for any double-time hours.',
    'Add regular pay (up to 40 hours × your wage), overtime pay and any bonus to get gross pay for the week.'
  ],
  formulaTitle: 'What is the formula for overtime pay?',
  formula: {
    expr: 'Overtime rate = Regular rate × 1.5<br>Weekly pay = (Hours ≤ 40) × Wage + (Hours − 40) × Overtime rate<br>Regular rate with a bonus = (Wage × Total hours + Bonus) ÷ Total hours',
    vars: [['Wage', 'your hourly pay rate'], ['Hours', 'hours actually worked in the workweek'], ['1.5', 'the FLSA minimum multiplier (time and a half)'], ['Bonus', 'non-discretionary bonus earned that week']],
    note: 'With a bonus, the extra overtime owed is 0.5 × regular rate × overtime hours, on top of straight-time pay for all hours plus the bonus. That is the method in 29 CFR 778.110.'
  },
  example: `<p>Maria earns $20 an hour and works 50 hours in a week.</p>
<p>Regular pay: 40 × $20 = <strong>$800</strong>. Overtime rate: $20 × 1.5 = $30. Overtime pay: 10 × $30 = <strong>$300</strong>.</p>
<p>Gross pay = $800 + $300 = <strong>$1,100</strong>. If two of those overtime hours were paid at double time under her union contract, they would be 2 × $40 = $80 instead of 2 × $30 = $60, for $1,120.</p>
<p>If she also earned a $100 attendance bonus, her regular rate becomes ($1,000 + $100) ÷ 50 = $22, the overtime premium is 0.5 × $22 × 10 = $110, and her week pays $1,000 + $100 + $110 = <strong>$1,210</strong>, not $1,200.</p>`,
  table: {
    title: 'How much is time and a half for common hourly rates?',
    intro: 'Overtime and double-time rates, plus gross weekly pay at 45, 50 and 60 hours with time and a half after 40, from the calculator above.',
    head: ['Hourly rate', 'Time and a half', 'Double time', '45-hour week', '50-hour week', '60-hour week'],
    rows: ({ run, H }) => [12, 15, 16, 17, 18, 20, 22, 25, 28, 30, 35, 40, 50].map(x => [H.money(x), H.money(x * 1.5), H.money(x * 2), ...[45, 50, 60].map(h => run({ rate: x, hours: h, method: 'week', mult: 1.5, dt: 0, bonus: NaN }).value)]),
    note: 'Gross pay before tax. A 45-hour week has 5 overtime hours; a 60-hour week has 20.'
  },
  sections: [
    {
      h2: 'How do you calculate time and a half?',
      html: `<p>Multiply your hourly wage by 1.5, or add half your wage to itself. $18 an hour becomes $18 + $9 = <strong>$27</strong>; $17.50 becomes $26.25; $25 becomes $37.50. That figure is paid for each hour past 40 in the week, while the first 40 stay at your normal wage.</p>
<p>A quick check for a whole week: gross pay = wage × (40 + 1.5 × overtime hours). For 46 hours at $18, that is $18 × (40 + 9) = $18 × 49 = <strong>$882</strong>.</p>
<p><strong>Double time</strong> is 2 × the wage ($36 at $18). <strong>Double time and a half</strong>, which some union contracts and employers pay for overtime on a holiday, is 2.5 × the wage ($45 at $18). Federal law only requires 1.5×; anything above that comes from a contract, company policy or state law.</p>`
    },
    {
      h2: 'How is overtime calculated in California?',
      html: `<p>California adds daily overtime on top of the 40-hour weekly rule (Labor Code §510). Non-exempt employees earn:</p>
<ul>
<li><strong>1.5×</strong> for hours over 8 in a workday, up to 12;</li>
<li><strong>2×</strong> for hours over 12 in a workday;</li>
<li><strong>1.5×</strong> for hours over 40 in the workweek that were not already paid as daily overtime;</li>
<li>on the <strong>seventh consecutive day</strong> worked in a workweek: 1.5× for the first 8 hours and 2× after that.</li>
</ul>
<p>Example at $20 an hour: Mon 10 h, Tue 13 h, Wed 8 h, Thu 9 h, Fri 6 h, 46 hours in total. The federal rule sees 6 overtime hours and pays $980. California counts 2 + 4 + 1 = 7 hours at time and a half and 1 hour at double time (the 13th hour on Tuesday), leaving 38 regular hours: 38 × $20 + 7 × $30 + 1 × $40 = <strong>$1,010</strong>. Choose "California" in the calculator and enter each day to check your own week.</p>
<p>Alternative workweek schedules (such as four 10-hour days) adopted by a secret-ballot employee vote can change the daily threshold, so check whether your workplace has one.</p>`
    },
    {
      h2: 'How is overtime calculated in Texas and other states?',
      html: `<p>Texas has no state overtime law, so the federal FLSA rule applies: 1.5× the regular rate after 40 hours in a workweek, with no daily overtime. Florida, Georgia, Arizona, North Carolina and most other states work the same way, either by following the FLSA or with a state law that copies it.</p>
<p>A few states go further:</p>
<ul>
<li><strong>Alaska:</strong> overtime after 8 hours in a day or 40 in a week (employers with 4 or more employees).</li>
<li><strong>Nevada:</strong> daily overtime after 8 hours in a 24-hour period for employees earning less than 1.5 × the state minimum wage.</li>
<li><strong>Colorado:</strong> overtime after 40 hours a week, 12 hours a day, or 12 consecutive hours.</li>
<li><strong>California:</strong> daily, weekly and seventh-day rules as above.</li>
</ul>
<p>When state and federal law differ, the employer has to follow whichever rule pays the employee more.</p>`
    },
    {
      h2: 'Do salaried employees get overtime?',
      html: `<p>Only if they are non-exempt. Under federal rules, a salaried employee is exempt from overtime only if they earn at least <strong>$684 a week ($35,568 a year)</strong> and their main duties pass the executive, administrative or professional tests. A 2024 rule that would have raised the threshold was struck down in November 2024, so $684 is the level the Department of Labor enforces.</p>
<p>For a salaried non-exempt worker, divide the weekly salary by the hours it is meant to cover to get the regular rate. A $1,000 weekly salary for a 40-hour week is $25 an hour, so 6 overtime hours add 6 × $37.50 = <strong>$225</strong>. If the salary is meant to cover whatever hours are worked (the "fluctuating workweek" method), the employer only owes an extra half-time premium on the hours past 40, and the regular rate falls as hours rise.</p>
<p>To compare a salary offer with an hourly one, convert it with the <a href="/salary-to-hourly-calculator">salary to hourly calculator</a>.</p>`
    },
    {
      h2: 'Do bonuses, PTO and holidays count toward overtime?',
      html: `<p><strong>Non-discretionary bonuses count.</strong> Production, attendance, safety and shift bonuses that you were promised must be added to the regular rate, which raises the overtime rate. A true gift, like a surprise holiday bonus the employer was not obliged to pay, is excluded. Enter the bonus in the calculator to see the higher rate.</p>
<p><strong>Paid time off does not count.</strong> Vacation, sick days and paid holidays are not hours worked, so a week with 8 hours of holiday pay and 36 hours on the job has no federal overtime. Hours actually worked on a holiday do count. For holiday premiums, use the <a href="/holiday-pay-calculator">holiday pay calculator</a>.</p>
<p><strong>Each workweek stands alone.</strong> An employer cannot average a 30-hour week with a 50-hour week; the 50-hour week still earns 10 overtime hours even though the two-week total is 80.</p>`
    }
  ],
  faq: [
    { q: 'How much is time and a half for $15 an hour?', a: 'Time and a half on $15 an hour is $22.50. Ten overtime hours pay $225, so a 50-hour week at $15 grosses $825.' },
    { q: 'How do I calculate overtime for a 45-hour week?', a: 'Pay 40 hours at your normal rate and 5 hours at 1.5×. At $20 an hour that is 40 × $20 + 5 × $30 = $950.' },
    { q: 'Is overtime calculated daily or weekly?', a: 'Weekly under federal law: only hours over 40 in a fixed 7-day workweek count. California, Alaska, Nevada and Colorado also have daily overtime rules.' },
    { q: 'Can my employer average two weeks to avoid overtime?', a: 'No. Under the FLSA each workweek stands alone, even on a biweekly payroll. Working 30 hours one week and 50 the next still earns 10 overtime hours.' },
    { q: 'Is overtime taxed at a higher rate?', a: 'No. Overtime is ordinary wages taxed at your normal bracket; the paycheck just withholds more because payroll treats the bigger check as if you earned it every period. For 2025 through 2028 you can also deduct the half-time premium on your federal return; see the <a href="/overtime-tax-deduction-calculator">overtime tax deduction calculator</a>.' },
    { q: 'What is double time and a half?', a: 'Double time and a half is 2.5 times your hourly rate: $50 an hour on a $20 wage. It is not required by federal law and usually comes from a union contract for holiday overtime.' },
    { q: 'Can my employer make me work overtime?', a: 'Yes. Federal law sets no limit on the hours an adult employee can be required to work, as long as overtime is paid. Some states restrict mandatory overtime for nurses and minors.' },
    { q: 'Do I get overtime for working more than 8 hours in a day?', a: 'Only if your state has a daily rule (California, Alaska, Nevada, Colorado) or your contract says so. Under the FLSA alone, a 10-hour day in a 38-hour week earns no overtime.' }
  ],
  related: ['overtime-tax-deduction-calculator', 'holiday-pay-calculator', 'salary-to-hourly-calculator', 'gross-pay-calculator', 'time-card-calculator'],
  sources: [
    { name: 'U.S. Department of Labor: Overtime Pay', url: 'https://www.dol.gov/agencies/whd/overtime' },
    { name: 'DOL Fact Sheet #23: Overtime Pay Requirements of the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime' },
    { name: 'DOL Fact Sheet #17A: Exemption for Executive, Administrative and Professional Employees', url: 'https://www.dol.gov/agencies/whd/fact-sheets/17a-overtime' },
    { name: 'eCFR: 29 CFR Part 778, Overtime Compensation', url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778' },
    { name: 'California DIR: Overtime FAQ', url: 'https://www.dir.ca.gov/dlse/faq_overtime.htm' }
  ],
  disclaimer: 'Estimates gross pay before taxes and deductions. Union contracts and state law can require more than shown.'
};
