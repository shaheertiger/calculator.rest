export default {
  slug: 'self-employment-tax-calculator',
  hub: 'pay',
  name: '1099 Self-Employment Tax Calculator',
  title: '1099 Tax Calculator 2026: $8,478 SE Tax on $60,000 Profit',
  h1: '1099 Self-Employment Tax Calculator: SE Tax, Income Tax and Quarterly Payments',
  meta: 'A freelancer with $60,000 of 2026 net profit owes $8,477.73 in self-employment tax and about $12,037 in total federal tax: $3,009 a quarter. See your numbers.',
  keyword: 'how to calculate 1099 taxes owed',
  also: ['how to calculate my 1099 taxes', 'how to calculate self employment taxes', 'self employment tax calculator', '1099 tax calculator', 'quarterly estimated tax calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'profit', label: 'Net self-employment profit (2026)', type: 'number', value: 60000, prefix: '$', help: '1099 income minus business expenses (Schedule C line 31).' },
    { id: 'status', label: 'Filing status', type: 'select', value: 'single', options: [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household']] },
    { id: 'w2', label: 'W-2 wages from a job (if any)', type: 'number', value: 0, prefix: '$', help: 'Counts toward the $184,500 Social Security cap and your tax bracket.' },
    { id: 'qbi', label: 'Include the 20% qualified business income deduction', type: 'checkbox', value: true }
  ],
  data: {
    rates: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
    tops: { single: [12400, 50400, 105700, 201775, 256225, 640600], mfj: [24800, 100800, 211400, 403550, 512450, 768700], hoh: [17700, 67450, 105700, 201750, 256200, 640600] },
    std: { single: 16100, mfj: 32200, hoh: 24150 },
    ssBase: 184500, addMedStart: { single: 200000, mfj: 250000, hoh: 200000 }
  },
  compute(v, H, D) {
    if (!(v.profit > 0)) return { error: 'Enter your net self-employment profit.' };
    var st = D.tops[v.status] ? v.status : 'single';
    var w2 = v.w2 > 0 ? v.w2 : 0;
    function tax(ti) {
      var t = 0, lo = 0, tops = D.tops[st];
      for (var i = 0; i < D.rates.length; i++) {
        var hi = i < tops.length ? tops[i] : Infinity;
        if (ti > lo) t += (Math.min(ti, hi) - lo) * D.rates[i];
        lo = hi;
      }
      return t;
    }
    var nese = v.profit * 0.9235;
    var ss = 0, med = 0, add = 0;
    if (nese >= 400) {
      ss = 0.124 * Math.min(nese, Math.max(0, D.ssBase - w2));
      med = 0.029 * nese;
      add = 0.009 * Math.max(0, nese - Math.max(0, D.addMedStart[st] - w2));
    }
    var se = ss + med, half = se / 2;
    var tax0 = tax(Math.max(0, w2 - D.std[st]));
    var tiPre = Math.max(0, w2 + v.profit - half - D.std[st]);
    var qbiDed = v.qbi ? Math.max(0, Math.min(0.2 * (v.profit - half), 0.2 * tiPre)) : 0;
    var ti = tiPre - qbiDed;
    var inc = tax(ti) - tax0;
    var total = se + add + inc;
    var rows = [
      ['Net earnings from self-employment (92.35%)', H.money(nese)],
      ['Social Security (12.4%)', H.money(ss)],
      ['Medicare (2.9%)', H.money(med)]
    ];
    if (add > 0) rows.push(['Additional Medicare tax (0.9%)', H.money(add)]);
    rows.push(['Deduction for half of SE tax', H.money(half)]);
    if (qbiDed > 0) rows.push(['QBI deduction', H.money(qbiDed)]);
    rows.push(['Income tax on this profit', H.money(inc)]);
    rows.push(['Total federal tax on 1099 income', H.money(total), true]);
    rows.push(['Quarterly estimated payment', H.money(total / 4), true]);
    rows.push(['Set aside per $100 earned', H.money(total / v.profit * 100)]);
    return {
      value: H.money(se),
      label: 'Self-employment tax for 2026',
      expr: H.money0(v.profit) + ' × 92.35% × 15.3%' + (ss < 0.124 * nese - 0.005 ? ' (SS capped)' : ''),
      rows: rows,
      sub: nese < 400 ? 'Net earnings under $400: no self-employment tax is due, though income tax may be.' : 'Save about ' + H.pct(total / v.profit * 100, 0) + ' of profit for federal taxes, plus your state rate. Income tax uses the 2026 brackets and standard deduction.'
    };
  },
  quick: ({ r, run }) => `To calculate 1099 taxes, multiply net profit by 92.35% and then by 15.3% for self-employment tax, and add income tax on the profit. A single freelancer with <strong>$60,000</strong> of 2026 profit owes <strong>${r.value}</strong> in self-employment tax and about ${run({}).rows.find(x => /Income tax/.test(x[0]))[1]} in income tax, for <strong>${run({}).rows.find(x => /Total/.test(x[0]))[1]}</strong>: ${run({}).rows.find(x => /Quarterly/.test(x[0]))[1]} a quarter.`,
  stepsTitle: 'How to calculate taxes owed on 1099 income',
  steps: [
    'Add up all 1099-NEC, 1099-K and other business income, then subtract business expenses to get net profit.',
    'Multiply net profit by 92.35% to get net earnings from self-employment. Skipping this step overstates the tax by about 8%.',
    'Multiply by 12.4% for Social Security (only on the first $184,500, less any W-2 wages) and 2.9% for Medicare. The total is self-employment tax.',
    'Deduct half of the self-employment tax, the standard deduction and the 20% QBI deduction from income, then apply the 2026 brackets for income tax.',
    'Add the two taxes and divide by four for each quarterly estimated payment.'
  ],
  formulaTitle: 'What is the self-employment tax formula?',
  formula: {
    expr: 'SE tax = Profit × 0.9235 × 15.3%<br>(12.4% Social Security up to $184,500 + 2.9% Medicare on all of it)<br>Taxable income = Profit − ½ SE tax − Standard deduction − QBI deduction',
    vars: [['Profit', 'Schedule C net profit (income minus expenses)'], ['0.9235', '1 − 0.0765: removes the employer-equivalent half before taxing'], ['QBI deduction', '20% of qualified business income, capped at 20% of taxable income']],
    note: 'Above about $200,000 single ($400,000 joint) of taxable income the QBI deduction can be limited, especially for service businesses. An extra 0.9% Medicare tax applies to earnings over $200,000 ($250,000 joint).'
  },
  example: `<p>Alex, a single graphic designer, invoices $72,000 on 1099-NECs in 2026 and spends $12,000 on software, equipment and a home office, so net profit is <strong>$60,000</strong>.</p>
<p>Net earnings: $60,000 × 0.9235 = $55,410. SE tax: $55,410 × 15.3% = <strong>$8,477.73</strong>.</p>
<p>Income tax: $60,000 − $4,238.87 (half of SE tax) − $16,100 = $39,661.13. The QBI deduction is the smaller of 20% × $55,761.13 and 20% × $39,661.13, so $7,932.23, leaving $31,728.91 taxable and $3,559.47 of tax.</p>
<p>Total: $8,477.73 + $3,559.47 = <strong>$12,037.20</strong>, about 20% of profit, or $3,009.30 per quarter.</p>`,
  table: {
    title: 'How much tax do I owe on 1099 income?',
    intro: 'Single filer with no other income, standard deduction and QBI deduction, 2026 rules, from the calculator above.',
    head: ['Net profit', 'SE tax', 'Income tax', 'Total', 'Per quarter', 'Share of profit'],
    rows: ({ run, H }) => [10000, 20000, 30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000].map(p => {
      const o = run({ profit: p, status: 'single', w2: 0, qbi: true });
      const g = re => o.rows.find(x => re.test(x[0]))[1];
      return [H.money0(p), o.value, g(/Income tax/), g(/Total/), g(/Quarterly/), H.pct(parseFloat(g(/Total/).replace(/[$,]/g, '')) / p * 100, 1)];
    }),
    note: 'Federal only. State income tax adds more in most states.'
  },
  sections: [
    {
      h2: 'Why is self-employment tax 15.3%?',
      html: `<p>An employee pays 7.65% for Social Security and Medicare and the employer pays another 7.65%. When you work for yourself you are both, so you pay 15.3%: 12.4% for Social Security and 2.9% for Medicare.</p>
<p>Two adjustments soften it. First, the tax applies to 92.35% of profit, which mirrors the fact that an employer's share is never counted as the employee's wages. Second, half of the SE tax is deducted from your income for income tax purposes. The effective SE rate is therefore 14.13% of profit, not 15.3%.</p>
<p>The Social Security part stops once your combined wages and self-employment earnings reach $184,500 for 2026; Medicare keeps going.</p>`
    },
    {
      h2: 'How much should I set aside from each 1099 payment?',
      html: `<p>A common rule is 25–30% of every payment, and the table above shows why: federal tax alone runs from about 15% of profit at $20,000 to about 25% at $150,000, before state tax. Setting aside a percentage of each invoice rather than a fixed amount keeps up with good and slow months.</p>
<p>Put the money in a separate savings account and pay the IRS from it each quarter. If you also have a paycheck, you can instead raise your W-2 withholding on line 4(c) of Form W-4; withholding counts as paid evenly through the year.</p>`
    },
    {
      h2: 'When are quarterly estimated taxes due?',
      html: `<p>For tax year 2026, payments are due <strong>April 15, 2026</strong>, <strong>June 15, 2026</strong>, <strong>September 15, 2026</strong> and <strong>January 15, 2027</strong>. Pay through IRS Direct Pay, EFTPS or your IRS online account, or mail a Form 1040-ES voucher.</p>
<p>You generally need to make estimated payments if you expect to owe $1,000 or more when you file. You avoid an underpayment penalty if your payments and withholding cover at least 90% of this year's tax or 100% of last year's (110% if last year's AGI was over $150,000).</p>`
    },
    {
      h2: 'What lowers taxes on 1099 income?',
      html: `<ul>
<li><strong>Business expenses</strong> on Schedule C: equipment, software, supplies, business mileage, part of your phone and internet. Every $1,000 of expenses saves both SE tax and income tax.</li>
<li><strong>Home office deduction</strong>: the simplified method allows $5 per square foot, up to 300 square feet.</li>
<li><strong>Self-employed health insurance deduction</strong> for premiums you pay for yourself and your family.</li>
<li><strong>Retirement plans</strong>: a SEP-IRA or solo 401(k) can shelter far more than an IRA. Contributions cut income tax but not SE tax.</li>
<li><strong>The QBI deduction</strong>, which this calculator includes, removes up to 20% of qualified business income from tax.</li>
</ul>`
    }
  ],
  faq: [
    { q: 'How much is self-employment tax on $1,000?', a: '$141.30: $1,000 × 92.35% × 15.3%. Half of it ($70.65) is deductible on your income tax return.' },
    { q: 'Do I have to pay self-employment tax if I made under $400?', a: 'No. If net earnings from self-employment are under $400 for the year, no SE tax is due, though the income is still subject to income tax.' },
    { q: 'Is self-employment tax on top of income tax?', a: 'Yes. You pay both: SE tax covers Social Security and Medicare, and income tax is figured separately on profit after deducting half of the SE tax.' },
    { q: 'Do I pay self-employment tax if I also have a W-2 job?', a: 'Yes, on your 1099 profit. But the 12.4% Social Security part only applies until your W-2 wages plus self-employment earnings reach $184,500. Enter your wages in the calculator.' },
    { q: 'What percentage should I save for 1099 taxes?', a: 'Most freelancers save 25–30% of profit. At $60,000 of profit, federal tax is about 20%, so 25% leaves room for state income tax.' },
    { q: 'What happens if I miss a quarterly payment?', a: 'The IRS charges an underpayment penalty, figured like interest on the amount and the number of days it was late. Paying as soon as you can reduces it.' },
    { q: 'Is a 1099-K from PayPal or Venmo taxable?', a: 'Payments for goods or services you sell in a business are taxable and count toward self-employment income. Personal reimbursements and gifts between friends are not.' }
  ],
  related: ['income-tax-calculator', 'take-home-pay-calculator', 'salary-to-hourly-calculator', 'ytd-income-calculator'],
  sources: [
    { name: 'IRS: Self-employment tax (Social Security and Medicare taxes)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
    { name: 'IRS: Topic 554, Self-employment tax', url: 'https://www.irs.gov/taxtopics/tc554' },
    { name: 'IRS: Estimated taxes', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes' },
    { name: 'IRS: Qualified business income deduction', url: 'https://www.irs.gov/newsroom/qualified-business-income-deduction' },
    { name: 'SSA: Contribution and benefit base', url: 'https://www.ssa.gov/oact/cola/cbb.html' }
  ],
  disclaimer: 'Federal estimate for tax year 2026 using the standard deduction. Not tax advice.'
};
