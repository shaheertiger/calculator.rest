export default {
  slug: 'ytd-income-calculator',
  hub: 'pay',
  name: 'Year-to-Date Income Calculator',
  title: 'YTD Income Calculator: $50,400 After 21 Paychecks = $62,400/yr',
  h1: 'Year-to-Date Income Calculator: Annualize the YTD Figure on Your Pay Stub',
  meta: '$50,400 of year-to-date gross after 21 biweekly paychecks annualizes to $62,400, or $5,200 a month. Turn any pay stub YTD total into yearly and monthly income.',
  keyword: 'how to calculate year to date income',
  also: ['how do i calculate ytd income', 'how do you calculate year to date income', 'how do you calculate ytd income', 'how to calculate ytd in payslip', 'how to calculate ytd income from pay stub', 'how to calculate total annual income', 'annualized income calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'ytd', label: 'Year-to-date gross pay (from your stub)', type: 'number', value: 50400, prefix: '$' },
    { id: 'basis', label: 'Annualize by', type: 'select', value: 'periods', options: [['periods', 'Number of paychecks so far'], ['date', 'Date of the pay stub']] },
    { id: 'periods', label: 'Paychecks received this year', type: 'number', value: 21, showIf: { basis: ['periods'] } },
    { id: 'freq', label: 'Pay frequency', type: 'select', value: '26', options: [['52', 'Weekly (52)'], ['26', 'Every two weeks (26)'], ['24', 'Twice a month (24)'], ['12', 'Monthly (12)']], showIf: { basis: ['periods'] } },
    { id: 'thru', label: 'Pay date on the stub', type: 'date', value: '2026-10-30', showIf: { basis: ['date'] } },
    { id: 'prior', label: 'Last year\'s gross income (optional)', type: 'number', value: '', prefix: '$', placeholder: 'W-2 box 1 or total', help: 'Adds the 2-year average that mortgage lenders use for variable pay.' }
  ],
  compute(v, H) {
    if (!(v.ytd > 0)) return { error: 'Enter your year-to-date gross pay.' };
    var annual, months, rows = [], expr, share;
    if (v.basis === 'date') {
      var d = H.parseDate(v.thru);
      if (!d) return { error: 'Enter the pay date on your stub.' };
      var y = d.getUTCFullYear(), jan1 = new Date(Date.UTC(y, 0, 1));
      var days = H.daysBetween(jan1, d) + 1, diy = H.isLeap(y) ? 366 : 365;
      var dim = new Date(Date.UTC(y, d.getUTCMonth() + 1, 0)).getUTCDate();
      months = d.getUTCMonth() + d.getUTCDate() / dim;
      annual = v.ytd / days * diy;
      share = days / diy;
      expr = H.money0(v.ytd) + ' ÷ ' + days + ' days × ' + diy;
      rows.push(['Days elapsed in ' + y, days + ' of ' + diy]);
      rows.push(['Monthly income (YTD ÷ ' + H.num(months, 2) + ' months)', H.money(v.ytd / months), true]);
      rows.push(['Weekly average', H.money(annual / 52)]);
    } else {
      var n = Number(v.freq) || 26, p = v.periods;
      if (!(p > 0)) return { error: 'Enter how many paychecks you have received this year.' };
      if (p > n + 1) return { error: 'That is more paychecks than this pay frequency allows in a year.' };
      annual = v.ytd / p * n;
      months = p / n * 12;
      share = p / n;
      expr = H.money0(v.ytd) + ' ÷ ' + H.num(p, 2) + ' checks × ' + n;
      rows.push(['Average gross per paycheck', H.money(v.ytd / p)]);
      rows.push(['Monthly income', H.money(annual / 12), true]);
      rows.push(['Weekly average', H.money(annual / 52)]);
    }
    rows.push(['Share of the year covered', H.pct(share * 100, 1)]);
    rows.push(['Still to come at this pace', H.money(Math.max(0, annual - v.ytd))]);
    if (v.prior > 0) {
      var two = (v.prior + v.ytd) / (12 + months);
      rows.push(['Change vs last year (annualized)', (annual >= v.prior ? '+' : '') + H.pct((annual / v.prior - 1) * 100, 1)]);
      rows.push(['2-year average monthly income', H.money(two), true]);
    }
    return {
      value: H.money(annual),
      label: 'Annualized income',
      expr: expr,
      rows: rows,
      sub: 'Assumes the rest of the year pays like the part already paid. One-time bonuses in the YTD total will overstate it.'
    };
  },
  quick: ({ r }) => `To calculate year-to-date income, take the gross YTD total on your latest pay stub (everything paid since January 1), then divide by the paychecks so far and multiply by the paychecks in a year. <strong>$50,400</strong> after 21 biweekly checks is $2,400 a check, which annualizes to <strong>${r.value}</strong>, or $5,200 a month.`,
  stepsTitle: 'How to calculate year-to-date income from a pay stub',
  steps: [
    'Find the YTD column on your most recent pay stub and use the <strong>gross</strong> YTD amount, not net pay or taxable wages.',
    'Count the paychecks dated this calendar year. YTD follows the pay date, so a check dated January 2 for December work belongs to the new year; mixing up work dates and pay dates is the usual error.',
    'Divide YTD gross by that count for an average check, then multiply by 52, 26, 24 or 12 to annualize.',
    'Or use dates: YTD ÷ days elapsed × 365. For monthly income, divide YTD by months elapsed (October 30 is about 9.97 months).'
  ],
  formulaTitle: 'What is the formula for annualized YTD income?',
  formula: {
    expr: 'Annualized income = YTD gross ÷ Paychecks so far × Paychecks per year<br>or = YTD gross ÷ Days elapsed × 365<br>Monthly income = YTD gross ÷ Months elapsed',
    vars: [['YTD gross', 'total gross pay dated January 1 through the stub date'], ['Paychecks per year', '52, 26, 24 or 12'], ['Days elapsed', 'January 1 through the pay date, inclusive']]
  },
  example: `<p>Keisha's stub dated October 30, 2026 shows $58,320 gross YTD, including a $3,000 bonus in March. Last year's W-2 showed $64,000.</p>
<p>By date: October 30 is day 303 of 365. Annualized: $58,320 ÷ 303 × 365 = <strong>$70,253</strong>. Monthly: $58,320 ÷ 9.97 = $5,851.</p>
<p>Without the one-time bonus: $55,320 ÷ 303 × 365 = $66,640, a better guide to next year. A lender comparing it with last year sees steady pay and might average both years: ($64,000 + $58,320) ÷ 21.97 months = $5,568 a month.</p>`,
  table: {
    title: 'How do you annualize YTD income at the end of each month?',
    intro: 'The multiplier that turns YTD gross into a full-year figure for a stub dated the last day of each month in 2026, and what $10,000 of YTD pay annualizes to.',
    head: ['Stub dated', 'Days elapsed', 'Multiply YTD by', '$10,000 YTD annualizes to'],
    rows: ({ run, H }) => ['01-31', '02-28', '03-31', '04-30', '05-31', '06-30', '07-31', '08-31', '09-30', '10-31', '11-30'].map(md => {
      const o = run({ ytd: 10000, basis: 'date', thru: '2026-' + md, prior: NaN });
      const days = parseInt(o.rows[0][1], 10);
      return [H.fmtDate('2026-' + md), String(days), '× ' + H.fix(365 / days, 3), o.value];
    }),
    note: 'Monthly income from a month-end stub is simply YTD ÷ the month number (÷ 10 for October 31).'
  },
  sections: [
    {
      h2: 'Where is year-to-date income on a pay stub?',
      html: `<p>Most stubs have two columns of numbers: <strong>Current</strong> (this paycheck) and <strong>YTD</strong> (every check dated since January 1). The top YTD figure in the earnings section is gross pay. Further down you will see YTD taxes, deductions and net pay.</p>
<p>If your stub has no YTD column, add up the gross pay on every stub dated this year. The final stub of December shows the same gross that becomes your W-2, though box 1 of the W-2 is lower if you made pre-tax 401(k) or health contributions.</p>
<p>Starting a new job mid-year? Your new employer's YTD only counts its own checks. Add the YTD from your last stub at the old job for your true income so far.</p>`
    },
    {
      h2: 'How do lenders calculate income from YTD pay?',
      html: `<p>Mortgage underwriters usually divide YTD gross by the number of months it covers, then compare that with your W-2s for the past one or two years. Salaried income that matches the offer letter is used as is. Overtime, bonus and commission income is typically averaged over the past two years, and if the YTD pace is lower than last year, the lender uses the lower figure.</p>
<p>Enter last year's income in the optional box to see the 2-year average monthly figure. Then plug your monthly income into the <a href="/dti-calculator">DTI calculator</a> to see how much debt a lender will allow.</p>`
    },
    {
      h2: 'Why can annualized YTD income be misleading?',
      html: `<ul>
<li><strong>Bonuses and commissions</strong> paid early in the year inflate the pace. Subtract them and add them back once.</li>
<li><strong>A raise mid-year</strong> means the annualized figure understates next year's pay. Use your new rate with the <a href="/salary-to-hourly-calculator">salary to hourly calculator</a> instead.</li>
<li><strong>Seasonal overtime</strong> or unpaid leave skews whichever months happen to be included.</li>
<li><strong>27-paycheck years</strong> give biweekly workers one extra check, so 26 × average check understates that calendar year.</li>
</ul>`
    },
    {
      h2: 'How do self-employed people calculate YTD income?',
      html: `<p>Run a year-to-date profit and loss: business revenue received since January 1 minus deductible expenses paid in the same span. That net profit, not revenue, is your YTD income for loans and taxes.</p>
<p>Annualize it the same way (÷ days elapsed × 365), but be careful with seasonal businesses. Use the annualized profit to check your quarterly estimates in the <a href="/self-employment-tax-calculator">self-employment tax calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'Is YTD income gross or net?', a: 'It can be either; pay stubs show both. Loan applications, rental applications and annual income questions almost always mean gross YTD, before taxes and deductions.' },
    { q: 'How do I calculate YTD income if I am paid biweekly?', a: 'Multiply your gross check by the number of paychecks dated this year. 21 checks of $2,400 is $50,400 YTD.' },
    { q: 'How do I annualize YTD income?', a: 'Divide YTD gross by the paychecks so far and multiply by your paychecks per year, or divide by the days elapsed and multiply by 365.' },
    { q: 'Does YTD start on January 1?', a: 'For pay stubs and taxes, yes: YTD covers checks dated January 1 through today. A company with a fiscal year may report fiscal YTD on internal reports, but pay stubs use the calendar year.' },
    { q: 'Why is my W-2 lower than my final YTD gross?', a: 'W-2 box 1 subtracts pre-tax deductions such as traditional 401(k), HSA and Section 125 health premiums. Boxes 3 and 5 (Social Security and Medicare wages) are usually closer to gross.' },
    { q: 'How do I calculate monthly income from YTD?', a: 'Divide YTD gross by the number of months it covers. $45,000 YTD on a stub dated September 30 is $45,000 ÷ 9 = $5,000 a month.' },
    { q: 'What if I changed jobs this year?', a: 'Add the YTD gross from your final stub at the old job to the YTD at the new one. Each employer\'s stub only shows what it paid you.' }
  ],
  related: ['gross-pay-calculator', 'biweekly-pay-calculator', 'salary-to-hourly-calculator', 'dti-calculator', 'self-employment-tax-calculator'],
  sources: [
    { name: 'IRS: About Form W-2, Wage and Tax Statement', url: 'https://www.irs.gov/forms-pubs/about-form-w-2' },
    { name: 'IRS: Publication 15 (Circular E), Employer\'s Tax Guide', url: 'https://www.irs.gov/publications/p15' },
    { name: 'Fannie Mae Selling Guide (income assessment)', url: 'https://selling-guide.fanniemae.com/' },
    { name: 'CFPB: What is a debt-to-income ratio?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/' }
  ]
};
