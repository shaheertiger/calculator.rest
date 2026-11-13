export default {
  slug: 'overtime-tax-deduction-calculator',
  hub: 'pay',
  name: 'No Tax on Overtime Deduction Calculator',
  title: 'No Tax on Overtime Calculator: $15,000 OT = $5,000 Deduction',
  h1: 'Overtime Tax Deduction Calculator (2025–2028): Deduction and Tax Saved',
  meta: '$15,000 of time-and-a-half overtime holds a $5,000 qualified premium, saving a single filer in the 22% bracket $1,100. Estimate your 2026 deduction.',
  keyword: 'how to calculate overtime tax credit',
  also: ['how to calculate overtime deduction', 'how do i calculate my overtime taxes', 'no tax on overtime calculator', 'overtime tax deduction calculator', 'qualified overtime compensation deduction'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'I know my', type: 'select', value: 'pay', options: [['pay', 'Total overtime pay for the year'], ['hours', 'Hourly rate and overtime hours']] },
    { id: 'otPay', label: 'Overtime pay at time and a half (year)', type: 'number', value: 15000, prefix: '$', help: 'Pay for FLSA overtime hours only (over 40 a week), at the full 1.5× rate.', showIf: { method: ['pay'] } },
    { id: 'rate', label: 'Regular hourly rate', type: 'number', value: 25, prefix: '$', showIf: { method: ['hours'] } },
    { id: 'otHours', label: 'FLSA overtime hours in the year', type: 'number', value: 400, suffix: 'hours', showIf: { method: ['hours'] } },
    { id: 'status', label: 'Filing status', type: 'select', value: 'single', options: [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household'], ['mfs', 'Married filing separately']] },
    { id: 'magi', label: 'Modified AGI (including the overtime)', type: 'number', value: 80000, prefix: '$', help: 'For most people this is adjusted gross income, Form 1040 line 11.' }
  ],
  data: {
    rates: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
    tops: { single: [12400, 50400, 105700, 201775, 256225, 640600], mfj: [24800, 100800, 211400, 403550, 512450, 768700], hoh: [17700, 67450, 105700, 201750, 256200, 640600] },
    std: { single: 16100, mfj: 32200, hoh: 24150 },
    cap: { single: 12500, mfj: 25000, hoh: 12500 },
    phaseStart: { single: 150000, mfj: 300000, hoh: 150000 }
  },
  compute(v, H, D) {
    var prem;
    if (v.method === 'hours') {
      if (!(v.rate > 0) || !(v.otHours >= 0)) return { error: 'Enter your hourly rate and overtime hours.' };
      prem = 0.5 * v.rate * v.otHours;
    } else {
      if (!(v.otPay >= 0)) return { error: 'Enter your overtime pay for the year.' };
      prem = v.otPay / 3;
    }
    if (!(v.magi >= 0)) return { error: 'Enter your modified AGI.' };
    if (v.status === 'mfs') return { value: H.money(0), label: 'Overtime deduction', expr: 'married filing separately', rows: [['Qualified overtime premium', H.money(prem)]], sub: 'Married couples must file a joint return to claim the overtime deduction.' };
    var st = D.tops[v.status] ? v.status : 'single';
    function tax(ti) {
      var t = 0, lo = 0, tops = D.tops[st];
      for (var i = 0; i < D.rates.length; i++) {
        var hi = i < tops.length ? tops[i] : Infinity;
        if (ti > lo) t += (Math.min(ti, hi) - lo) * D.rates[i];
        lo = hi;
      }
      return t;
    }
    var cap = D.cap[st], start = D.phaseStart[st];
    var allowed = Math.min(prem, cap);
    var cut = Math.max(0, v.magi - start) * 0.10;
    var ded = Math.max(0, allowed - cut);
    var ti0 = Math.max(0, v.magi - D.std[st]);
    var ti1 = Math.max(0, ti0 - ded);
    var saved = tax(ti0) - tax(ti1);
    var marg = 0, tops = D.tops[st];
    for (var i = 0; i < D.rates.length; i++) { if (ti0 > (i ? tops[i - 1] : 0)) marg = D.rates[i]; }
    var rows = [
      ['Qualified overtime premium', H.money(prem)],
      ['Limit for your filing status', H.money(cap)]
    ];
    if (cut > 0) rows.push(['Phase-out reduction (10% of MAGI over ' + H.money0(start) + ')', '−' + H.money(Math.min(cut, allowed))]);
    rows.push(['Estimated federal tax saved', H.money(saved), true]);
    rows.push(['Your top bracket before the deduction', H.pct(marg * 100, 0)]);
    rows.push(['Taxable income after deduction', H.money(ti1)]);
    var sub = ded <= 0 ? 'Your income is past the phase-out, so the deduction is $0.' : prem > cap ? 'Your premium is above the ' + H.money0(cap) + ' limit, so the deduction is capped.' : 'Saved at roughly your ' + H.pct(marg * 100, 0) + ' bracket. Social Security and Medicare tax on the overtime still apply.';
    return { value: H.money(ded), label: 'Overtime deduction', expr: H.money(Math.min(prem, cap)) + (cut > 0 ? ' − ' + H.money(Math.min(cut, allowed)) : '') + ' qualified premium', rows: rows, sub: sub };
  },
  quick: ({ r, run, H }) => `The no-tax-on-overtime deduction covers only the "half" in time and a half: one-third of your overtime pay. <strong>$15,000</strong> of overtime at 1.5× holds a <strong>${r.value}</strong> premium, which a single filer with $80,000 of income deducts to save about <strong>${run({}).rows.find(x => /saved/.test(x[0]))[1]}</strong> in 2026. The limit is $12,500 ($25,000 joint), reduced above $150,000 ($300,000) of income.`,
  stepsTitle: 'How to calculate the overtime deduction',
  steps: [
    'Find the overtime pay you earned for hours over 40 in a workweek. Daily overtime required only by state law, and double time paid only under a contract, do not qualify beyond the federal half-time portion.',
    'Take the premium part only. At time and a half, divide total overtime pay by 3 (or multiply your hourly rate × 0.5 × overtime hours). This is the step people get wrong: the full overtime check is <em>not</em> deductible.',
    'Cap it at $12,500, or $25,000 on a joint return.',
    'If your modified AGI is over $150,000 ($300,000 joint), subtract $100 for every $1,000 above that line (10% of the excess).',
    'Multiply what is left by your tax bracket for a rough federal saving. The calculator does it exactly with the 2026 brackets and standard deduction.'
  ],
  formulaTitle: 'What is the formula for the overtime deduction?',
  formula: {
    expr: 'Premium = Overtime pay ÷ 3 &nbsp;(or Rate × 0.5 × OT hours)<br>Deduction = min(Premium, $12,500) − 10% × max(0, MAGI − $150,000)<br>Tax saved = Tax(taxable income) − Tax(taxable income − Deduction)',
    vars: [['Overtime pay', 'pay for FLSA overtime hours at 1.5×'], ['$12,500', 'per-return limit ($25,000 married filing jointly)'], ['$150,000', 'phase-out start ($300,000 married filing jointly)'], ['MAGI', 'adjusted gross income plus any excluded foreign income']],
    note: 'The deduction never goes below $0. It applies to tax years 2025 through 2028 and is claimed on Schedule 1-A with Form 1040, whether or not you itemize.'
  },
  example: `<p>Jordan earns $25 an hour and worked 400 FLSA overtime hours in 2026, paid at $37.50: <strong>$15,000</strong> of overtime pay. Total income is $80,000 and Jordan files single.</p>
<p>Premium = $15,000 ÷ 3 = <strong>$5,000</strong> (the same as $25 × 0.5 × 400). It is under the $12,500 limit and income is under $150,000, so the full $5,000 is deductible.</p>
<p>Taxable income falls from $80,000 − $16,100 = $63,900 to $58,900. Both are in the 22% bracket, so the saving is $5,000 × 22% = <strong>$1,100</strong>.</p>`,
  table: {
    title: 'How much does no tax on overtime save?',
    intro: 'Estimated 2026 federal income tax saved for single filers using the standard deduction, by yearly overtime pay at time and a half and total income.',
    head: ['Overtime pay (1.5×)', 'Premium', 'Saved at $50k income', 'Saved at $90k', 'Saved at $180k', 'Saved at $240k'],
    rows: ({ run, H }) => [3000, 6000, 9000, 15000, 24000, 37500, 45000].map(p => {
      const g = m => run({ method: 'pay', otPay: p, status: 'single', magi: m }).rows.find(x => /saved/.test(x[0]))[1];
      return [H.money0(p), H.money0(p / 3), g(50000), g(90000), g(180000), g(240000)];
    }),
    note: 'Premiums above $12,500 are capped. At $180,000 the deduction shrinks by $3,000 and at $240,000 by $9,000 because of the phase-out.'
  },
  sections: [
    {
      h2: 'What overtime qualifies for the deduction?',
      html: `<p>Only <strong>qualified overtime compensation</strong>: the part of your pay that exceeds your regular rate and is required by section 7 of the Fair Labor Standards Act. In practice that means:</p>
<ul>
<li>You are a non-exempt employee paid overtime for hours over 40 in a workweek.</li>
<li>Only the extra half counts. At $30 an hour, overtime pays $45, and $15 of each hour is deductible.</li>
<li>If your employer pays double time where federal law requires only time and a half, the deduction is still the half-time amount.</li>
<li>Daily overtime under California or other state law, and overtime that exists only under a union contract, does not count unless the FLSA also required it.</li>
<li>Exempt salaried employees and independent contractors earn no FLSA overtime, so they have nothing to deduct.</li>
</ul>
<p>You also need a valid Social Security number, and married couples must file jointly.</p>`
    },
    {
      h2: 'How does the income phase-out work?',
      html: `<p>Start with the smaller of your premium and the limit ($12,500, or $25,000 joint). Then reduce it by $100 for each $1,000 your modified AGI is over $150,000 ($300,000 joint).</p>
<p>Example: a single filer with an $8,000 premium and $180,000 of MAGI is $30,000 over the line, so the deduction drops by $3,000 to <strong>$5,000</strong>. At $230,000 it would fall by $8,000 to zero.</p>
<p>Someone at the full $12,500 limit loses the deduction completely at $275,000 of MAGI ($550,000 joint at the $25,000 limit). Because the reduction comes after the cap, a smaller premium disappears sooner.</p>`
    },
    {
      h2: 'Where do I find my qualified overtime amount?',
      html: `<p>Look at your final pay stub for the year. Most stubs list overtime hours and overtime earnings year to date; divide time-and-a-half earnings by 3. If you only see hours, multiply them by half of your regular rate.</p>
<p>For 2025 the IRS did not require employers to report the amount in a separate W-2 box, so many sent it in box 14 or a separate statement, and workers could rely on pay records. The IRS has said separate reporting on Form W-2 applies from 2026. Keep your stubs either way, since the regular rate can include bonuses and shift differentials (see the <a href="/overtime-calculator">overtime calculator</a>).</p>`
    },
    {
      h2: 'Does it reduce Social Security, Medicare or state tax?',
      html: `<p>No to payroll taxes: your overtime is still subject to 6.2% Social Security and 1.45% Medicare withholding. It is a federal income tax deduction only.</p>
<p>It also does not lower your adjusted gross income. It is subtracted after AGI, like the standard deduction, so it will not change AGI-based items such as the earned income credit or student loan payments that use AGI. State income tax depends on whether your state adopts the federal deduction; many states start from federal AGI and would not include it.</p>`
    },
    {
      h2: 'How do I calculate my overtime taxes on a paycheck?',
      html: `<p>Overtime is taxed as ordinary wages. The withholding looks heavy because payroll software annualizes each check: a week with $400 of overtime is taxed as if you earned that much every week, which can push the extra pay into a higher withholding bracket. Your actual tax is settled on your annual return, where the deduction applies.</p>
<p>If you work steady overtime and want more in each check now, enter your expected deduction on line 4(b) of a new Form W-4. To see what your check looks like after all taxes, use the <a href="/take-home-pay-calculator">take-home pay calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'Is there no tax at all on overtime?', a: 'No. Only the half-time premium is deductible from federal income tax, up to $12,500 ($25,000 joint), for 2025 through 2028. Your base pay for those hours and all payroll taxes still apply.' },
    { q: 'Is the overtime deduction a tax credit?', a: 'No, it is a deduction. It lowers taxable income, so it saves your bracket rate times the deduction: $5,000 saves $600 in the 12% bracket and $1,100 in the 22% bracket.' },
    { q: 'Do I have to itemize to claim it?', a: 'No. It is claimed on Schedule 1-A and taken in addition to the standard deduction or itemized deductions.' },
    { q: 'How much is the deduction on $10,000 of overtime?', a: 'If the $10,000 was paid at time and a half, the qualified premium is $3,333.33, and that is the deduction as long as your MAGI is under $150,000 ($300,000 joint).' },
    { q: 'Does double time count?', a: 'Only the half-time portion the FLSA requires. If you earn double time on a $20 wage, the deductible part is still $10 per overtime hour, not $20.' },
    { q: 'Can salaried employees claim the overtime deduction?', a: 'Only if they are non-exempt and receive FLSA overtime for hours over 40. Exempt salaried employees do not qualify.' },
    { q: 'What years does no tax on overtime apply to?', a: 'Tax years 2025, 2026, 2027 and 2028. It expires after 2028 unless Congress extends it.' }
  ],
  related: ['overtime-calculator', 'income-tax-calculator', 'take-home-pay-calculator', 'magi-calculator'],
  sources: [
    { name: 'IRS: One, Big, Beautiful Bill provisions', url: 'https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions' },
    { name: 'IRS: Federal income tax rates and brackets', url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' },
    { name: 'IRS: About Form W-4, Employee\'s Withholding Certificate', url: 'https://www.irs.gov/forms-pubs/about-form-w-4' },
    { name: 'U.S. Department of Labor: Overtime Pay', url: 'https://www.dol.gov/agencies/whd/overtime' }
  ],
  disclaimer: 'An estimate of federal income tax only, using 2026 brackets and the standard deduction. Not tax advice.'
};
