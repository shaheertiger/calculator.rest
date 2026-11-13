export default {
  slug: 'gratuity-calculator',
  hub: 'pay',
  name: 'Gratuity Calculator',
  title: 'Gratuity Calculator: ₹60,000 Salary, 12 Yrs 7 Mo = ₹4,50,000',
  h1: 'Gratuity Calculator (India): 15/26 Formula, Service Rounding and the ₹20 Lakh Cap',
  meta: 'Last drawn basic + DA of ₹60,000 and 12 years 7 months of service (counted as 13) gives ₹4,50,000 gratuity: 60,000 × 15/26 × 13. Check eligibility and tax.',
  keyword: 'how to calculate gratuity amount',
  also: ['how do you calculate gratuity', 'how to gratuity calculation', 'how calculate gratuity', 'gratuity calculator india', 'gratuity formula 15/26', 'payment of gratuity act calculation'],
  updated: '2026-11-13',
  inputs: [
    { id: 'salary', label: 'Last drawn monthly basic pay + DA', type: 'number', value: 60000, prefix: '₹', help: 'Basic salary plus dearness allowance only, not HRA or other allowances.' },
    { id: 'years', label: 'Completed years of service', type: 'number', value: 12, suffix: 'years' },
    { id: 'months', label: 'Extra months of service', type: 'number', value: 7, suffix: 'months' },
    { id: 'cover', label: 'Employer', type: 'select', value: 'act', options: [['act', 'Covered by the Payment of Gratuity Act (10+ employees)'], ['not', 'Not covered by the Act']] },
    { id: 'reason', label: 'Leaving because of', type: 'select', value: 'resign', options: [['resign', 'Resignation or retirement'], ['death', 'Death or disablement']] }
  ],
  data: { cap: 2000000 },
  compute(v, H, D) {
    if (!(v.salary > 0)) return { error: 'Enter your last drawn monthly basic pay plus DA.' };
    var y = v.years >= 0 ? Math.floor(v.years) : 0;
    var m = v.months >= 0 ? Math.min(Math.floor(v.months), 11) : 0;
    if (y === 0 && m === 0) return { error: 'Enter your length of service.' };
    var inr = function (x) { return '₹' + Math.round(x).toLocaleString('en-IN'); };
    var covered = v.cover !== 'not';
    var counted = covered ? y + (m > 6 ? 1 : 0) : y;
    var raw = covered ? v.salary * 15 / 26 * counted : v.salary * 15 / 30 * counted;
    var pay = Math.min(raw, D.cap);
    var eligible = v.reason === 'death' || y >= 5;
    var rows = [
      ['Years counted', counted + (covered && m > 6 ? ' (' + m + ' months round up)' : covered && m > 0 ? ' (' + m + ' months round down)' : '')],
      ['15 days\' wages', inr(v.salary * 15 / (covered ? 26 : 30))],
      ['Formula result', inr(raw)]
    ];
    if (raw > D.cap) rows.push(['Capped at ₹20 lakh', inr(D.cap), true]);
    rows.push(['In lakh', H.fix(pay / 100000, 2) + ' lakh']);
    rows.push(['Tax-exempt part (Section 10(10), non-government)', inr(Math.min(pay, D.cap)), true]);
    rows.push(['Eligible now', eligible ? 'Yes' : 'Not yet: needs 5 years of continuous service']);
    return {
      value: inr(eligible ? pay : 0),
      label: eligible ? 'Gratuity payable' : 'Gratuity payable today (not yet eligible)',
      expr: inr(v.salary) + ' × 15/' + (covered ? 26 : 30) + ' × ' + counted,
      rows: rows,
      sub: eligible ? (covered ? 'Formula under the Payment of Gratuity Act, 1972: 15 days\' wages for each year, with a month counted as 26 working days.' : 'Employers outside the Act usually pay half a month\'s salary per completed year (15/30).') : 'After 5 years of continuous service you would receive ' + inr(pay) + ' at today\'s salary.'
    };
  },
  quick: ({ r }) => `Gratuity under India's Payment of Gratuity Act is last drawn salary (basic + DA) × 15/26 × years of service, with any part-year over 6 months counted as a full year. With a <strong>₹60,000</strong> monthly salary and 12 years 7 months of service (counted as 13), gratuity is 60,000 × 15 ÷ 26 × 13 = <strong>${r.value}</strong>. You need 5 years of service, and the maximum is ₹20 lakh.`,
  stepsTitle: 'How to calculate gratuity',
  steps: [
    'Take your last drawn monthly salary: basic pay plus dearness allowance (DA). Do not include HRA, bonus or other allowances.',
    'Count your years of service. Under the Act, a final part-year of more than 6 months counts as a full year: 12 years 7 months is 13; 12 years 6 months is 12.',
    'Multiply salary by 15 and divide by 26 (15 days\' wages, with 26 working days in a month). Dividing by 30 here is the most common mistake for employees covered by the Act.',
    'Multiply by the years counted. The result is capped at ₹20 lakh.',
    'If your employer is not covered by the Act, use 15/30 and completed years only.'
  ],
  formulaTitle: 'What is the gratuity formula?',
  formula: {
    expr: 'Gratuity = Last drawn salary × 15 ÷ 26 × Years of service<br>(not covered by the Act: Average salary × 15 ÷ 30 × Completed years)<br>Maximum = ₹20,00,000',
    vars: [['Last drawn salary', 'monthly basic pay + dearness allowance'], ['15 ÷ 26', '15 days\' wages per year, a month taken as 26 working days'], ['Years of service', 'completed years, plus 1 if the last part-year is more than 6 months']],
    note: 'Seasonal establishments use 7 days\' wages per season instead of 15. For employees paid piece rates, daily wages are averaged over the last three months.'
  },
  example: `<p>Ravi resigns after 18 years 9 months with a last drawn basic pay of ₹72,000 and DA of ₹18,000 a month. His employer has more than 10 employees.</p>
<p>Salary for gratuity: ₹72,000 + ₹18,000 = ₹90,000. Years counted: 18 years 9 months rounds up to <strong>19</strong>.</p>
<p>Gratuity = ₹90,000 × 15 ÷ 26 × 19 = <strong>₹9,86,538</strong>, under the ₹20 lakh cap, and fully tax-exempt for a private-sector employee.</p>
<p>Had he left at 18 years 6 months, only 18 years would count: ₹9,34,615.</p>`,
  table: {
    title: 'How much gratuity will I get?',
    intro: 'Gratuity under the Payment of Gratuity Act for common last drawn salaries (basic + DA) and years of service, capped at ₹20 lakh. Computed with the calculator above.',
    head: ['Basic + DA per month', '5 years', '10 years', '15 years', '20 years', '25 years', '30 years'],
    rows: ({ run }) => [20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000].map(s => ['₹' + s.toLocaleString('en-IN'), ...[5, 10, 15, 20, 25, 30].map(y => run({ salary: s, years: y, months: 0, cover: 'act', reason: 'resign' }).value)])
  },
  sections: [
    {
      h2: 'Who is eligible for gratuity?',
      html: `<p>Under the Payment of Gratuity Act, 1972, an employee becomes entitled after <strong>5 years of continuous service</strong> with the same employer, and gratuity is paid when employment ends through superannuation, retirement, resignation, death or disablement. The 5-year condition does not apply on death or disablement; in a death case the gratuity goes to the nominee or legal heirs.</p>
<p>The Act covers factories, mines, oilfields, plantations, ports, railways, shops and establishments with 10 or more employees on any day in the preceding 12 months. Once covered, an establishment stays covered even if staff numbers later fall below 10.</p>
<p>Gratuity must be paid within 30 days of becoming payable; after that the employer owes simple interest.</p>`
    },
    {
      h2: 'Why does the gratuity formula use 15/26?',
      html: `<p>The Act pays 15 days' wages for every year of service and treats a month as 26 working days (excluding four weekly offs). So one day's wage is monthly salary ÷ 26, and 15 days is salary × 15/26, about 57.7% of a month's pay per year.</p>
<p>Employers <em>not</em> covered by the Act may pay gratuity voluntarily or under a company policy. The common basis is half a month's salary for each completed year, or 15/30, which is 50% of a month per year and pays about 13% less than 15/26. Part-years are not rounded up in that case.</p>`
    },
    {
      h2: 'Is gratuity taxable?',
      html: `<p>Gratuity received by central and state government employees is fully exempt from income tax. For other employees covered by the Act, the exempt amount under Section 10(10) is the least of:</p>
<ul>
<li>₹20 lakh (lifetime limit across employers);</li>
<li>the gratuity actually received;</li>
<li>15/26 × last drawn salary × years of service.</li>
</ul>
<p>For employees not covered by the Act, the third limit is half of the average salary of the last 10 months × completed years. Anything above the exempt amount is added to your salary income and taxed at your slab rate. Gratuity paid to a nominee after an employee's death is not taxed as salary.</p>`
    },
    {
      h2: 'What changed for gratuity under the new labour codes?',
      html: `<p>The Code on Social Security, 2020, which took effect on Nov 21, 2025 along with India's other labour codes, now governs gratuity. It keeps the same core formula of 15 days' wages per year of service, with part-years over six months rounded up, and the ceiling set by the central government (₹20 lakh).</p>
<p>Two changes matter. <strong>Fixed-term employees</strong> qualify for pro-rata gratuity after one year of service instead of five. And <strong>wages</strong> are defined so that if excluded allowances (such as HRA and conveyance) exceed 50% of total pay, the excess counts as wages, which can raise the salary used in the formula for employees with a low basic pay. Check your employer's revised salary structure.</p>`
    }
  ],
  faq: [
    { q: 'What is the gratuity for 5 years of service?', a: 'For a ₹30,000 basic + DA, 5 years gives ₹30,000 × 15/26 × 5 = ₹86,538.' },
    { q: 'Is 4 years 7 months enough for gratuity?', a: 'Generally no. The months-rounding rule applies to calculating the amount, not to the 5-year eligibility condition, except on death or disablement. Some courts have counted 4 years and 240 working days as continuous service, so check with your employer if you are close.' },
    { q: 'Is gratuity calculated on gross salary?', a: 'No. It is based on basic pay plus dearness allowance. HRA, bonus, overtime and most other allowances are excluded.' },
    { q: 'What is the maximum gratuity amount?', a: '₹20 lakh under the Act. An employer can pay more as an ex-gratia amount, but anything above the exempt limit is taxable.' },
    { q: 'Can gratuity be forfeited?', a: 'Yes, wholly or partly, if employment is terminated for wilful damage to the employer\'s property (up to the loss caused), or for riotous or violent conduct or an offence involving moral turpitude.' },
    { q: 'Do I get gratuity if I resign?', a: 'Yes, if you have completed 5 years of continuous service. Resignation is one of the events on which gratuity becomes payable.' },
    { q: 'How do I claim gratuity?', a: 'Apply to your employer in Form I within 30 days of it becoming payable (employers usually accept late applications). The employer must pay within 30 days of it becoming due.' }
  ],
  related: ['leave-loading-calculator', 'pension-calculator', 'salary-to-hourly-calculator', 'retirement-calculator'],
  sources: [
    { name: 'Ministry of Labour & Employment, Government of India', url: 'https://labour.gov.in/' },
    { name: 'India Code: Payment of Gratuity Act, 1972 (search the Act)', url: 'https://www.indiacode.nic.in/' },
    { name: 'Income Tax Department of India', url: 'https://www.incometax.gov.in/iec/foportal/' }
  ],
  disclaimer: 'General information on Indian gratuity rules, not legal or tax advice.'
};
