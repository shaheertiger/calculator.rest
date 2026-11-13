export default {
  slug: 'income-tax-calculator',
  hub: 'pay',
  name: 'Federal Income Tax Calculator 2026',
  title: 'Income Tax Calculator 2026: Tax on $75,000 Is $7,670 (Single)',
  h1: 'Federal Income Tax Calculator for 2026: Brackets, Effective and Marginal Rate',
  meta: 'A single filer earning $75,000 in 2026 owes $7,670 in federal income tax after the $16,100 standard deduction: a 10.2% effective rate in the 22% bracket.',
  keyword: 'how to calculate tax on income',
  also: ['how do you calculate income tax payable', 'how to calculate income tax in excel using formula', 'how to calculate how much tax you owe', 'how much taxes should i pay calculator', 'federal income tax calculator 2026', '2026 tax brackets'],
  updated: '2026-11-13',
  inputs: [
    { id: 'income', label: 'Gross income for 2026', type: 'number', value: 75000, prefix: '$', help: 'Wages, self-employment profit, interest and other taxable income.' },
    { id: 'status', label: 'Filing status', type: 'select', value: 'single', options: [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household']] },
    { id: 'pretax', label: 'Pre-tax contributions and adjustments', type: 'number', value: 0, prefix: '$', help: 'Traditional 401(k), HSA, deductible IRA, student loan interest.' },
    { id: 'dedType', label: 'Deduction', type: 'select', value: 'std', options: [['std', 'Standard deduction'], ['item', 'Itemize']] },
    { id: 'itemized', label: 'Itemized deductions', type: 'number', value: '', prefix: '$', placeholder: 'e.g. 22000', showIf: { dedType: ['item'] } },
    { id: 'credits', label: 'Tax credits', type: 'number', value: 0, prefix: '$', help: 'For example $2,200 per child for the Child Tax Credit.' }
  ],
  data: {
    rates: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
    tops: { single: [12400, 50400, 105700, 201775, 256225, 640600], mfj: [24800, 100800, 211400, 403550, 512450, 768700], hoh: [17700, 67450, 105700, 201750, 256200, 640600] },
    std: { single: 16100, mfj: 32200, hoh: 24150 }
  },
  compute(v, H, D) {
    if (!(v.income >= 0)) return { error: 'Enter your gross income.' };
    var st = D.tops[v.status] ? v.status : 'single';
    var pre = v.pretax > 0 ? v.pretax : 0;
    var agi = Math.max(0, v.income - pre);
    var ded = D.std[st], dedName = 'Standard deduction';
    if (v.dedType === 'item') {
      if (!(v.itemized >= 0)) return { error: 'Enter your itemized deductions, or switch to the standard deduction.' };
      ded = v.itemized; dedName = 'Itemized deductions';
    }
    var ti = Math.max(0, agi - ded);
    var tops = D.tops[st], tax = 0, lo = 0, marg = 0.10, brk = [];
    for (var i = 0; i < D.rates.length; i++) {
      var hi = i < tops.length ? tops[i] : Infinity;
      if (ti > lo) {
        var amt = Math.min(ti, hi) - lo;
        tax += amt * D.rates[i]; marg = D.rates[i];
        brk.push([H.pct(D.rates[i] * 100, 0), H.money0(lo) + (hi === Infinity ? '+' : ' – ' + H.money0(hi)), H.money(amt), H.money(amt * D.rates[i])]);
      }
      lo = hi;
    }
    var cr = v.credits > 0 ? v.credits : 0;
    var owed = Math.max(0, tax - cr);
    var eff = v.income > 0 ? owed / v.income * 100 : 0;
    var rows = [
      ['Taxable income', H.money(ti)],
      [dedName, H.money(ded)],
      ['Tax before credits', H.money(tax)]
    ];
    if (cr > 0) rows.push(['Credits', '−' + H.money(Math.min(cr, tax))]);
    rows.push(['Effective rate (of gross income)', H.pct(eff, 2), true]);
    rows.push(['Marginal rate (top bracket)', H.pct(marg * 100, 0)]);
    rows.push(['Income after federal income tax', H.money(v.income - owed)]);
    return {
      value: H.money(owed),
      label: 'Federal income tax for 2026',
      expr: H.money0(agi) + ' − ' + H.money0(ded) + ' = ' + H.money0(ti) + ' taxable',
      rows: rows,
      sub: ti > 0 ? 'Each extra $100 of income costs ' + H.money(marg * 100) + ' in federal tax; only the dollars inside each bracket are taxed at that rate.' : 'Your deductions cover all of your income, so no federal income tax is due.',
      table: brk.length ? { head: ['Rate', 'Bracket', 'Your income in it', 'Tax'], rows: brk, caption: 'How your tax is built, bracket by bracket' } : null
    };
  },
  quick: ({ r }) => `To calculate federal income tax, subtract the standard deduction from your income and tax each slice at its bracket rate. A single filer earning <strong>$75,000</strong> in 2026 has $58,900 of taxable income: 10% on the first $12,400, 12% up to $50,400 and 22% on the last $8,500, for <strong>${r.value}</strong>. That is a 10.23% effective rate in the 22% bracket.`,
  stepsTitle: 'How to calculate your federal income tax',
  steps: [
    'Start with gross income: wages, business profit, interest, taxable retirement withdrawals and so on.',
    'Subtract pre-tax contributions and adjustments (traditional 401(k), HSA, deductible IRA) to reach adjusted gross income.',
    'Subtract the larger of the standard deduction ($16,100 single, $32,200 married filing jointly, $24,150 head of household for 2026) or your itemized deductions to get taxable income.',
    'Apply each bracket only to the income that falls inside it. Taxing all of your income at your top rate is the mistake people make most often.',
    'Subtract credits such as the Child Tax Credit dollar for dollar. Divide the result by gross income for your effective rate.'
  ],
  formulaTitle: 'What is the formula for federal income tax?',
  formula: {
    expr: 'Taxable income = Gross income − Adjustments − Deduction<br>Tax = Σ rate<sub>i</sub> × (income inside bracket i) − Credits<br>Effective rate = Tax ÷ Gross income',
    vars: [['Adjustments', 'pre-tax 401(k), HSA, deductible IRA, student loan interest'], ['Deduction', 'standard deduction or itemized total, whichever is larger'], ['rate<sub>i</sub>', '10%, 12%, 22%, 24%, 32%, 35% or 37%']]
  },
  example: `<p>A married couple earns $140,000 and puts $10,000 into traditional 401(k)s. They take the $32,200 standard deduction and have two children.</p>
<p>Taxable income: $140,000 − $10,000 − $32,200 = <strong>$97,800</strong>.</p>
<p>Tax: 10% × $24,800 = $2,480; 12% × ($97,800 − $24,800) = $8,760. Total $11,240, all within the 12% bracket.</p>
<p>Two Child Tax Credits of $2,200 cut it to <strong>$6,840</strong>, an effective rate of 4.89% on $140,000.</p>`,
  table: {
    title: 'How much federal tax will I pay on my income in 2026?',
    intro: 'Federal income tax by gross income and filing status with the standard deduction and no credits, from the calculator above. Effective rate in brackets.',
    head: ['Gross income', 'Single', 'Married filing jointly', 'Head of household'],
    rows: ({ run, H }) => [25000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000, 250000, 300000, 500000].map(x => [H.money0(x), ...['single', 'mfj', 'hoh'].map(s => { const o = run({ income: x, status: s, pretax: 0, dedType: 'std', credits: 0 }); return o.value + ' (' + o.rows.find(y => /Effective/.test(y[0]))[1] + ')'; })]),
    note: 'Federal income tax only. Social Security and Medicare (7.65% of wages) and state income tax come on top.'
  },
  sections: [
    {
      h2: 'What are the 2026 federal tax brackets?',
      html: `<p>The IRS adjusted the brackets for inflation for 2026. The rates are unchanged; the income ranges are taxable income, after deductions.</p>
<div class="twrap"><table><thead><tr><th>Rate</th><th>Single</th><th>Married filing jointly</th><th>Head of household</th></tr></thead><tbody>
<tr><td>10%</td><td>$0 – $12,400</td><td>$0 – $24,800</td><td>$0 – $17,700</td></tr>
<tr><td>12%</td><td>$12,400 – $50,400</td><td>$24,800 – $100,800</td><td>$17,700 – $67,450</td></tr>
<tr><td>22%</td><td>$50,400 – $105,700</td><td>$100,800 – $211,400</td><td>$67,450 – $105,700</td></tr>
<tr><td>24%</td><td>$105,700 – $201,775</td><td>$211,400 – $403,550</td><td>$105,700 – $201,750</td></tr>
<tr><td>32%</td><td>$201,775 – $256,225</td><td>$403,550 – $512,450</td><td>$201,750 – $256,200</td></tr>
<tr><td>35%</td><td>$256,225 – $640,600</td><td>$512,450 – $768,700</td><td>$256,200 – $640,600</td></tr>
<tr><td>37%</td><td>over $640,600</td><td>over $768,700</td><td>over $640,600</td></tr>
</tbody></table></div>
<p>Standard deductions for 2026 are $16,100 (single), $32,200 (married filing jointly) and $24,150 (head of household). These figures are for returns filed in early 2027.</p>`
    },
    {
      h2: 'Will a raise push me into a higher tax bracket?',
      html: `<p>Only the dollars above the bracket line are taxed at the higher rate, so a raise never lowers your take-home pay. If a single filer's taxable income goes from $50,000 to $52,000, the first $400 of the raise is taxed at 12% and the other $1,600 at 22%: $48 + $352 = $400 of extra tax on $2,000, and the rest of their income is taxed exactly as before.</p>
<p>That is why the calculator shows two rates. Your <strong>marginal rate</strong> is what the next dollar costs; your <strong>effective rate</strong> is total tax divided by income, and it is always lower. A $75,000 single earner has a 22% marginal rate but pays 10.23% overall. To see what a specific raise adds after tax, try the <a href="/raise-calculator">raise calculator</a>.</p>`
    },
    {
      h2: 'How do deductions and credits change what you owe?',
      html: `<p>A <strong>deduction</strong> lowers taxable income, so it saves your marginal rate: a $1,000 deduction saves $220 in the 22% bracket. A <strong>credit</strong> comes off the tax itself, so $1,000 of credit saves $1,000.</p>
<ul>
<li><strong>Pre-tax 401(k):</strong> every $1,000 contributed saves $120 to $370 depending on your bracket.</li>
<li><strong>Itemizing:</strong> only helps when mortgage interest, state and local taxes (SALT), and charitable gifts add up to more than your standard deduction.</li>
<li><strong>Child Tax Credit:</strong> up to $2,200 per qualifying child under 17.</li>
<li><strong>2025–2028 deductions:</strong> qualified tips, the overtime premium (see the <a href="/overtime-tax-deduction-calculator">overtime deduction calculator</a>), and an extra $6,000 for people 65 and older, each with income limits.</li>
</ul>`
    },
    {
      h2: 'How do I calculate income tax in Excel?',
      html: `<p>Put taxable income in cell A1 and use one formula with the 2026 single brackets. The second array is the bracket floors; the third is how much each rate rises over the one before it.</p>
<p><code>=SUMPRODUCT((A1&gt;{0,12400,50400,105700,201775,256225,640600})*(A1-{0,12400,50400,105700,201775,256225,640600})*{0.1,0.02,0.1,0.02,0.08,0.03,0.02})</code></p>
<p>For $58,900 it returns $7,670, the same as this calculator. Swap in the married or head-of-household floors from the table above for other statuses.</p>`
    }
  ],
  faq: [
    { q: 'How much federal tax do I pay on $50,000?', a: 'A single filer with $50,000 of income pays $3,820 in 2026: $33,900 of taxable income after the $16,100 standard deduction, taxed at 10% and 12%. That is a 7.64% effective rate.' },
    { q: 'How much federal tax do I pay on $100,000?', a: 'A single filer pays $13,170 on $100,000 in 2026 (13.17% effective). A married couple filing jointly pays $7,640.' },
    { q: 'What is the standard deduction for 2026?', a: '$16,100 for single filers and married filing separately, $32,200 for married filing jointly and $24,150 for head of household. People 65 or older or blind get an additional amount.' },
    { q: 'What tax bracket am I in?', a: 'Your bracket is set by taxable income, after deductions. For a single filer in 2026, taxable income between $50,400 and $105,700 is in the 22% bracket, which covers gross incomes of roughly $66,500 to $121,800 with the standard deduction.' },
    { q: 'Does this include Social Security and Medicare?', a: 'No. This is federal income tax only. Payroll taxes add 7.65% of wages up to the $184,500 Social Security wage base. The take-home pay calculator includes them.' },
    { q: 'Why is my effective tax rate so much lower than my bracket?', a: 'Because the standard deduction is taxed at 0% and the first slices of income are taxed at 10% and 12%. Only the top slice is taxed at your bracket rate.' },
    { q: 'Do I pay tax on income tax refunds?', a: 'Federal refunds are not taxable. A state refund can be taxable on your federal return if you itemized and deducted state income tax the year before.' }
  ],
  related: ['take-home-pay-calculator', 'capital-gains-tax-calculator', 'self-employment-tax-calculator', 'overtime-tax-deduction-calculator', '401k-contribution-calculator'],
  sources: [
    { name: 'IRS: Federal income tax rates and brackets', url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' },
    { name: 'IRS: Topic 551, Standard deduction', url: 'https://www.irs.gov/taxtopics/tc551' },
    { name: 'IRS: One, Big, Beautiful Bill provisions', url: 'https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions' },
    { name: 'IRS: Child Tax Credit', url: 'https://www.irs.gov/credits-deductions/individuals/child-tax-credit' }
  ],
  disclaimer: 'Estimates regular federal income tax for tax year 2026. It does not include AMT, capital gains rates, payroll or state taxes. Not tax advice.'
};
