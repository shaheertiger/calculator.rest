export default {
  slug: 'take-home-pay-calculator',
  hub: 'pay',
  name: 'Take-Home Pay Calculator',
  title: 'Take-Home Pay Calculator 2026: $65,000 Nets $2,092.60 Biweekly',
  h1: 'Take-Home Pay Calculator: Net Paycheck After Federal, FICA and State Tax',
  meta: 'A single worker on $65,000 keeps $2,092.60 of each $2,500 biweekly paycheck in a no-income-tax state after 2026 federal tax and FICA. Or find gross from net.',
  keyword: 'how to calculate net pay from gross',
  also: ['how to calculate net income from gross', 'how much money after taxes calculator', 'how to calculate tax withholding from paycheck', 'how to calculate taxes from paycheck in texas', 'paycheck calculator', 'net pay calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'net', options: [['net', 'Take-home pay from salary'], ['gross', 'Salary needed for a take-home amount']] },
    { id: 'salary', label: 'Annual gross pay', type: 'number', value: 65000, prefix: '$', showIf: { mode: ['net'] } },
    { id: 'target', label: 'Take-home pay wanted per paycheck', type: 'number', value: 2500, prefix: '$', showIf: { mode: ['gross'] } },
    { id: 'freq', label: 'Pay frequency', type: 'select', value: '26', options: [['52', 'Weekly (52)'], ['26', 'Every two weeks (26)'], ['24', 'Twice a month (24)'], ['12', 'Monthly (12)']] },
    { id: 'status', label: 'Filing status', type: 'select', value: 'single', options: [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household']] },
    { id: 'k401', label: 'Traditional 401(k) contribution', type: 'number', value: 0, suffix: '% of pay' },
    { id: 'health', label: 'Pre-tax health premiums per paycheck', type: 'number', value: 0, prefix: '$', help: 'Section 125 deductions; they also lower Social Security and Medicare tax.' },
    { id: 'state', label: 'State income tax (flat estimate)', type: 'number', value: 0, suffix: '%', help: '0 in Texas, Florida and the other no-income-tax states.' }
  ],
  data: {
    rates: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
    tops: { single: [12400, 50400, 105700, 201775, 256225, 640600], mfj: [24800, 100800, 211400, 403550, 512450, 768700], hoh: [17700, 67450, 105700, 201750, 256200, 640600] },
    std: { single: 16100, mfj: 32200, hoh: 24150 },
    ssRate: 0.062, ssBase: 184500, medRate: 0.0145, addMed: 0.009, addMedStart: 200000
  },
  compute(v, H, D) {
    var n = Number(v.freq) || 26;
    var st = D.tops[v.status] ? v.status : 'single';
    var kp = v.k401 > 0 ? Math.min(v.k401, 100) : 0;
    var hp = v.health > 0 ? v.health * n : 0;
    var sr = v.state > 0 ? v.state : 0;
    function tax(ti) {
      var t = 0, lo = 0, tops = D.tops[st];
      for (var i = 0; i < D.rates.length; i++) {
        var hi = i < tops.length ? tops[i] : Infinity;
        if (ti > lo) t += (Math.min(ti, hi) - lo) * D.rates[i];
        lo = hi;
      }
      return t;
    }
    function calc(G) {
      var k = G * kp / 100;
      var fica = Math.max(0, G - hp);
      var fed = tax(Math.max(0, G - k - hp - D.std[st]));
      var ss = D.ssRate * Math.min(fica, D.ssBase);
      var med = D.medRate * fica + D.addMed * Math.max(0, fica - D.addMedStart);
      var sTax = sr / 100 * Math.max(0, G - k - hp);
      return { G: G, k: k, fed: fed, ss: ss, med: med, sTax: sTax, net: G - k - hp - fed - ss - med - sTax };
    }
    var c;
    if (v.mode === 'gross') {
      if (!(v.target > 0)) return { error: 'Enter the take-home pay you want per paycheck.' };
      var G = H.solve(function (g) { return calc(g).net / n - v.target; }, 0, 1e8);
      if (!(G > 0)) return { error: 'That take-home amount is out of range.' };
      c = calc(G);
    } else {
      if (!(v.salary > 0)) return { error: 'Enter your annual gross pay.' };
      if (hp >= v.salary) return { error: 'Pre-tax deductions are larger than your pay.' };
      c = calc(v.salary);
    }
    var per = function (x) { return H.money(x / n); };
    var rows = [];
    if (v.mode === 'gross') rows.push(['Annual salary needed', H.money(c.G), true]);
    rows.push(['Gross pay per paycheck', per(c.G)]);
    rows.push(['Federal income tax', '−' + per(c.fed)]);
    rows.push(['Social Security (6.2%)', '−' + per(c.ss)]);
    rows.push(['Medicare (1.45%' + (c.G - hp > D.addMedStart ? ' + 0.9%' : '') + ')', '−' + per(c.med)]);
    if (sr > 0) rows.push(['State income tax (' + H.pct(sr, 2) + ')', '−' + per(c.sTax)]);
    if (c.k > 0) rows.push(['401(k) contribution', '−' + per(c.k)]);
    if (hp > 0) rows.push(['Health premiums', '−' + per(hp)]);
    rows.push(['Take-home pay per year', H.money(c.net), v.mode !== 'gross']);
    rows.push(['Share of gross you keep', H.pct(c.net / c.G * 100, 1)]);
    var taxes = c.fed + c.ss + c.med + c.sTax;
    return {
      value: v.mode === 'gross' ? H.money(c.G / n) : per(c.net),
      label: v.mode === 'gross' ? 'Gross pay needed per paycheck' : 'Take-home pay per paycheck',
      expr: per(c.G) + ' gross − ' + per(taxes) + ' tax' + (c.k + hp > 0 ? ' − ' + per(c.k + hp) + ' deductions' : ''),
      rows: rows,
      sub: 'Taxes take ' + H.pct(taxes / c.G * 100, 1) + ' of gross pay. Figures use the 2026 brackets, standard deduction and a ' + H.money0(D.ssBase) + ' Social Security wage base.'
    };
  },
  quick: ({ r }) => `To get net pay from gross, subtract federal income tax, 7.65% for Social Security and Medicare, state tax and pre-tax deductions. A single worker earning <strong>$65,000</strong> a year, paid every two weeks in a state with no income tax, grosses $2,500 a check and takes home <strong>${r.value}</strong> in 2026: $216.15 federal tax, $155.00 Social Security and $36.25 Medicare come out.`,
  stepsTitle: 'How to calculate net pay from gross pay',
  steps: [
    'Divide annual pay by the number of paychecks: 52 weekly, 26 biweekly, 24 semi-monthly or 12 monthly.',
    'Subtract pre-tax deductions. A traditional 401(k) lowers income tax but not Social Security or Medicare; Section 125 health premiums lower both. Mixing these up is the most common error.',
    'Work out federal income tax on the annual figure: pay minus pre-tax deductions minus the 2026 standard deduction, run through the brackets, then divided back by the number of checks.',
    'Take 6.2% for Social Security (until wages reach $184,500) and 1.45% for Medicare, plus 0.9% on wages over $200,000.',
    'Subtract state and local income tax and any after-tax deductions (Roth 401(k), union dues, garnishments). What is left is take-home pay.'
  ],
  formulaTitle: 'What is the formula for take-home pay?',
  formula: {
    expr: 'Net = Gross − Pre-tax deductions − Federal tax − Social Security − Medicare − State tax<br>Social Security = 6.2% × min(Wages, $184,500)<br>Medicare = 1.45% × Wages + 0.9% × (Wages − $200,000 if positive)',
    vars: [['Gross', 'pay before anything is taken out'], ['Federal tax', 'tax on (gross − pre-tax deductions − standard deduction) using 2026 brackets'], ['Wages', 'gross minus Section 125 deductions (401(k) money is still taxed for FICA)']],
    note: 'Employers withhold with IRS Publication 15-T tables, which annualize each paycheck the same way, so the result lands within a few dollars of actual withholding for a W-4 with no adjustments.'
  },
  example: `<p>Sam earns $80,000 a year, is paid twice a month, files single, puts 6% into a traditional 401(k) and lives in a state with a flat 5% income tax.</p>
<p>401(k): $4,800 a year. Federal taxable income: $80,000 − $4,800 − $16,100 = $59,100, so federal tax is $5,800 + 22% × $8,700 = $7,714.</p>
<p>Social Security: 6.2% × $80,000 = $4,960. Medicare: 1.45% × $80,000 = $1,160. State: 5% × $75,200 = $3,760.</p>
<p>Take-home: $80,000 − $4,800 − $7,714 − $4,960 − $1,160 − $3,760 = $57,606 a year, or <strong>$2,400.25</strong> per semi-monthly check out of $3,333.33 gross.</p>`,
  table: {
    title: 'How much is take-home pay on common salaries?',
    intro: 'Single filer, 2026 federal tax and FICA, no state income tax, no pre-tax deductions, computed by the calculator above.',
    head: ['Salary', 'Biweekly take-home', 'Monthly take-home', 'Total tax', 'Kept'],
    rows: ({ run, H }) => [30000, 40000, 50000, 60000, 65000, 75000, 85000, 100000, 125000, 150000, 200000, 250000].map(x => {
      const o = run({ mode: 'net', salary: x, freq: '26', status: 'single', k401: 0, health: 0, state: 0 });
      const yr = parseFloat(o.rows.find(y => /per year/.test(y[0]))[1].replace(/[$,]/g, ''));
      return [H.money0(x), o.value, H.money(yr / 12), H.money0(x - yr), o.rows.find(y => /keep/.test(y[0]))[1]];
    }),
    note: 'Add your state rate in the calculator; in a 5% flat-tax state, take 5% of salary off these figures.'
  },
  sections: [
    {
      h2: 'How much of my paycheck goes to Social Security and Medicare?',
      html: `<p>7.65% of every dollar of wages up to $184,500 in 2026: 6.2% for Social Security and 1.45% for Medicare. Your employer pays a matching 7.65% that never shows on your stub.</p>
<p>Once your wages for the year pass $184,500, Social Security withholding stops, so high earners see bigger checks late in the year. Medicare has no cap, and employers must withhold an extra 0.9% on wages above $200,000 no matter your filing status. A married couple's actual Additional Medicare Tax starts at $250,000 combined and is squared up on Form 8959.</p>`
    },
    {
      h2: 'How do I work out the salary I need for a target take-home pay?',
      html: `<p>Switch the calculator to "Salary needed for a take-home amount" and enter the check you want. It searches for the gross pay that leaves exactly that much after tax.</p>
<p>For example, a single person in a no-income-tax state who wants $2,500 every two weeks ($65,000 a year in hand) needs about <strong>$79,844</strong> of salary, or $3,070.91 per check. Federal tax and FICA take about 18.6% of pay at that level, so a quick rule is to divide the take-home you want by 0.81; at higher salaries or in states with an income tax, divide by 0.75 or less.</p>`
    },
    {
      h2: 'Which states have no income tax on wages?',
      html: `<p>Nine states do not tax wages: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington and Wyoming. In those states your take-home pay is gross minus federal tax, FICA and your own deductions, which is why "taxes from a paycheck in Texas" is just the federal math.</p>
<p>Most other states either use a flat rate (Illinois charges 4.95% and Pennsylvania 3.07%) or brackets like the federal system. Some cities add their own wage tax, including New York City, Philadelphia and many Ohio cities. For a quick estimate, enter your state's top rate as a flat percentage; it slightly overstates tax for lower incomes in bracketed states.</p>`
    },
    {
      h2: 'Why is my actual paycheck different from the estimate?',
      html: `<p>The usual reasons:</p>
<ul>
<li><strong>W-4 entries.</strong> Dependents (Step 3), other income or extra withholding (Step 4) change federal withholding.</li>
<li><strong>Benefits.</strong> Dental, vision, FSA, HSA and commuter deductions each lower taxable pay.</li>
<li><strong>Bonuses.</strong> Supplemental wages are often withheld at a flat 22%, separate from your regular check.</li>
<li><strong>Local taxes and state disability insurance</strong>, such as California SDI or New Jersey SDI/FLI.</li>
<li><strong>Overtime and extra hours</strong>, which change gross pay. Get the gross first with the <a href="/gross-pay-calculator">gross pay calculator</a>.</li>
</ul>`
    }
  ],
  faq: [
    { q: 'What is $65,000 a year after taxes?', a: 'About $54,408 for a single filer in a state with no income tax in 2026: $5,620 federal income tax and $4,972.50 Social Security and Medicare come out. That is $2,092.60 every two weeks or $4,533.96 a month.' },
    { q: 'What percentage of my paycheck goes to taxes?', a: 'Typically 15% to 30%. A single $65,000 earner with no state tax pays 16.3% in federal tax and FICA; add your state rate on top.' },
    { q: 'How do I calculate taxes from a paycheck in Texas?', a: 'Texas has no state income tax, so only federal income tax, 6.2% Social Security and 1.45% Medicare come out. Set the state rate to 0% in the calculator.' },
    { q: 'Does a 401(k) contribution lower my take-home pay dollar for dollar?', a: 'No. A traditional 401(k) contribution also cuts income tax, so $100 contributed lowers take-home by only $78 in the 22% bracket (before state tax).' },
    { q: 'Is take-home pay the same as net pay?', a: 'Yes. Net pay, take-home pay and net income from a paycheck all mean gross pay minus taxes and deductions.' },
    { q: 'How much is $3,000 biweekly after taxes?', a: '$3,000 biweekly is $78,000 a year. A single filer in a no-income-tax state takes home about $2,450 per check in 2026, or $63,703 for the year.' },
    { q: 'Why does my first paycheck of the year look smaller?', a: 'For most people it doesn\'t change much. High earners see the opposite: Social Security withholding stops once wages pass $184,500, so their later checks are bigger.' }
  ],
  related: ['income-tax-calculator', 'gross-pay-calculator', 'salary-to-hourly-calculator', 'biweekly-pay-calculator', '401k-contribution-calculator'],
  sources: [
    { name: 'IRS: Publication 15-T, Federal Income Tax Withholding Methods', url: 'https://www.irs.gov/forms-pubs/about-publication-15-t' },
    { name: 'IRS: Topic 751, Social Security and Medicare withholding rates', url: 'https://www.irs.gov/taxtopics/tc751' },
    { name: 'SSA: Contribution and benefit base', url: 'https://www.ssa.gov/oact/cola/cbb.html' },
    { name: 'IRS: Questions and answers for the Additional Medicare Tax', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax' },
    { name: 'IRS: Federal income tax rates and brackets', url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' }
  ],
  disclaimer: 'An estimate for tax year 2026. State tax is a flat percentage of taxable wages. Not tax advice.'
};
