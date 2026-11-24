export default {
  slug: 'retirement-tax-calculator',
  hub: 'rules',
  name: 'Retirement Tax Calculator',
  title: 'Retirement Tax Calculator 2026: $98K Income Owes $2,732 Tax',
  h1: 'Federal Tax on Retirement Income: IRA, Pension and Social Security',
  meta: 'A 65+ couple with $40,000 of Social Security, $30,000 of IRA withdrawals and a $15,000 pension owes $2,732 in 2026 federal tax, after the new senior deduction.',
  keyword: 'retirement tax calculator',
  also: ['taxes on retirement income calculator', 'retirement income tax calculator', 'retirement tax rate calculator', 'federal taxes on retirement income calculator', 'retirement withdrawal tax calculator', 'calculate taxes on retirement income', 'tax calculator for retirees', 'federal income tax calculator for retirees', 'retirement taxable income calculator', 'social security tax calculator for retirees', 'income tax calculator for retirees'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'status', label: 'Filing status', type: 'select', value: 'mfj', options: [['mfj', 'Married filing jointly'], ['single', 'Single (or head of household, approx.)']] },
    { id: 'old1', label: 'You are 65 or older by Dec 31, 2026', type: 'checkbox', value: true },
    { id: 'old2', label: 'Your spouse is 65 or older by Dec 31, 2026', type: 'checkbox', value: true, showIf: { status: ['mfj'] } },
    { id: 'ira', label: 'Traditional IRA / 401(k) withdrawals (incl. RMDs)', type: 'number', value: 30000, prefix: '$', help: 'Pre-tax money taken out during 2026, for both spouses.' },
    { id: 'pension', label: 'Pension and annuity income (taxable part)', type: 'number', value: 15000, prefix: '$' },
    { id: 'ss', label: 'Social Security benefits for the year', type: 'number', value: 40000, prefix: '$', help: 'Box 5 of Form SSA-1099, before Medicare premiums are taken out. Both spouses combined.' },
    { id: 'interest', label: 'Taxable interest and dividends', type: 'number', value: 3000, prefix: '$' },
    { id: 'wages', label: 'Wages or self-employment income', type: 'number', value: 0, prefix: '$' },
    { id: 'exempt', label: 'Tax-exempt interest (municipal bonds)', type: 'number', value: 0, prefix: '$', help: 'Not taxed itself, but it counts toward how much Social Security is taxed.' },
    { id: 'roth', label: 'Qualified Roth IRA / Roth 401(k) withdrawals', type: 'number', value: 10000, prefix: '$', help: 'Tax-free after age 59½ and five years; shown for your monthly total only.' },
    { id: 'state', label: 'State income tax rate (flat estimate)', type: 'number', value: 0, suffix: '%', help: 'Applied to income other than Social Security. Leave 0 for federal only.' }
  ],
  data: {
    br: {
      single: [[12400, 10], [50400, 12], [105700, 22], [201775, 24], [256225, 32], [640600, 35], [1e15, 37]],
      mfj: [[24800, 10], [100800, 12], [211400, 22], [403550, 24], [512450, 32], [768700, 35], [1e15, 37]]
    },
    std: { single: 16100, mfj: 32200 },
    add65: { single: 2050, mfj: 1650 },
    base: { single: [25000, 9000], mfj: [32000, 12000] },
    senior: { amt: 6000, rate: 0.06, start: { single: 75000, mfj: 150000 } }
  },
  compute(v, H, D) {
    var st = v.status === 'single' ? 'single' : 'mfj';
    function n(x) { return x > 0 ? x : 0; }
    var ira = n(v.ira), pen = n(v.pension), ss = n(v.ss), intr = n(v.interest), wag = n(v.wages), ex = n(v.exempt), roth = n(v.roth);
    var stRate = v.state > 0 && v.state < 20 ? v.state : 0;
    var old = (v.old1 ? 1 : 0) + (st === 'mfj' && v.old2 ? 1 : 0);
    if (ira + pen + ss + intr + wag + ex + roth <= 0) return { error: 'Enter at least one source of retirement income.' };
    function calc(iraAmt) {
      var other = iraAmt + pen + intr + wag;
      var b = D.base[st];
      var prov = other + ex + ss / 2;
      var over = prov - b[0], tss = 0;
      if (over > 0 && ss > 0) {
        var top = Math.max(0, over - b[1]);
        var mid = Math.min(over, b[1]) / 2;
        tss = Math.min(Math.min(mid, ss / 2) + 0.85 * top, 0.85 * ss);
      }
      var agi = other + tss;
      var std = D.std[st] + old * D.add65[st];
      var sen = old * Math.max(0, D.senior.amt - D.senior.rate * Math.max(0, agi - D.senior.start[st]));
      var ti = Math.max(0, agi - std - sen);
      var tax = 0, lo = 0, rate = 10, br = D.br[st];
      for (var i = 0; i < br.length; i++) {
        var hi = br[i][0];
        if (ti > lo) { tax += (Math.min(ti, hi) - lo) * br[i][1] / 100; rate = br[i][1]; }
        lo = hi;
      }
      return { prov: prov, tss: tss, agi: agi, std: std, sen: sen, ti: ti, tax: tax, rate: ti > 0 ? rate : 0, other: other };
    }
    var c = calc(ira);
    var nxt = calc(ira + 1000);
    var marg = (nxt.tax - c.tax) / 10;
    var total = ira + pen + ss + intr + wag + ex + roth;
    var stTax = c.other * stRate / 100;
    var after = total - c.tax - stTax;
    var eff = total > 0 ? c.tax / total * 100 : 0;
    var torpedo = marg > c.rate + 0.5;
    var rows = [
      ['Provisional income', H.money0(c.prov)],
      ['Taxable Social Security', H.money0(c.tss) + (ss > 0 ? ' (' + H.pct(c.tss / ss * 100, 1) + ' of benefits)' : ''), true],
      ['Adjusted gross income', H.money0(c.agi)],
      ['Standard deduction incl. 65+ amount', '−' + H.money0(c.std)],
      ['Senior deduction (2025–2028)', '−' + H.money0(c.sen)],
      ['Taxable income', H.money0(c.ti)],
      ['Effective federal rate on all income', H.pct(eff, 1)],
      ['Tax bracket', H.pct(c.rate, 0)],
      ['Tax on the next $1,000 of IRA withdrawal', H.money0(nxt.tax - c.tax) + ' (' + H.pct(marg, 1) + ')', torpedo]
    ];
    if (stRate > 0) rows.push(['State income tax (estimate)', H.money0(stTax)]);
    rows.push(['After-tax income per month', H.money0(after / 12), true]);
    return {
      value: H.money0(c.tax),
      label: '2026 federal income tax',
      expr: H.money0(c.ti) + ' taxable income at 2026 ' + (st === 'mfj' ? 'joint' : 'single') + ' rates',
      rows: rows,
      tax: c.tax, tss: c.tss, ti: c.ti, agi: c.agi, sen: c.sen, std: c.std, prov: c.prov, eff: eff, marg: marg, bracket: c.rate, monthly: after / 12, total: total,
      sub: torpedo ? 'Each extra IRA dollar also makes more Social Security taxable, so your real marginal rate (' + H.pct(marg, 1) + ') is above your ' + H.pct(c.rate, 0) + ' bracket.' : (c.tax === 0 ? 'Deductions cover all of your taxable income, so no federal income tax is due.' : 'Your marginal rate on extra withdrawals equals your ' + H.pct(c.rate, 0) + ' bracket.')
    };
  },
  quick: ({ r, H }) => `A married couple, both 65 or older, with $40,000 of Social Security, $30,000 of IRA withdrawals, a $15,000 pension and $3,000 of interest owes <strong>${r.value}</strong> in 2026 federal income tax, an effective rate of ${H.pct(r.eff, 1)}. ${H.money0(r.tss)} of their benefits is taxable, and the next $1,000 they withdraw costs ${H.pct(r.marg, 1)} in tax even though they sit in the ${H.pct(r.bracket, 0)} bracket.`,
  stepsTitle: 'How to estimate tax on your retirement income',
  steps: [
    'Choose your filing status and tick the 65-or-older boxes. Each box adds both the regular extra standard deduction and the $6,000 senior deduction, so leaving one unticked overstates the tax.',
    'Enter yearly totals: pre-tax IRA and 401(k) withdrawals (including RMDs), the taxable part of any pension, Social Security from Form SSA-1099 box 5, and interest, dividends or wages.',
    'Add tax-exempt municipal bond interest if you have any. It is not taxed, but the IRS adds it to provisional income, which is the step most people skip.',
    'Include Roth withdrawals only to see your full monthly budget. Qualified Roth money does not change the federal tax or the taxable share of Social Security.',
    'Read the "tax on the next $1,000" line before taking a bigger withdrawal or doing a Roth conversion; it shows the real rate on extra income.'
  ],
  formulaTitle: 'How is federal tax on retirement income calculated?',
  formula: {
    expr: 'Provisional income = other income + tax-exempt interest + ½ × Social Security<br>Taxable SS = min(85% × SS, 50% tier + 85% × (provisional − $34,000/$44,000))<br>Taxable income = other income + taxable SS − standard deduction − 65+ additions − senior deduction<br>Tax = 2026 brackets applied to taxable income',
    vars: [['Other income', 'IRA/401(k) withdrawals, pension, taxable interest, dividends and wages'], ['50% tier', 'half of provisional income above $25,000 ($32,000 joint), capped at $4,500 ($6,000 joint) and at half your benefits'], ['Senior deduction', '$6,000 per person 65+, minus 6% of MAGI above $75,000 ($150,000 joint)'], ['Standard deduction', '$16,100 single, $32,200 joint, plus $2,050 (single) or $1,650 per spouse at 65+']],
    note: 'This follows the IRS Publication 915 Worksheet 1 and the 2025 Schedule 1-A senior deduction lines. It treats dividends and capital gains as ordinary income and ignores credits, itemized deductions and the net investment income tax.'
  },
  example: `<p>Tom and Ana file jointly and are both over 65. In 2026 they collect $40,000 of Social Security, withdraw $30,000 from Tom's IRA, receive a $15,000 pension and earn $3,000 of bank interest. They also take $10,000 from a Roth IRA.</p>
<p><strong>1. Provisional income.</strong> $30,000 + $15,000 + $3,000 = $48,000 of other income, plus half of $40,000 in benefits = <strong>$68,000</strong>. The Roth money is left out.</p>
<p><strong>2. Taxable Social Security.</strong> They are $36,000 over the $32,000 joint base. The 50% tier is capped at half of $12,000 = $6,000. The 85% tier is 85% × ($68,000 − $44,000) = $20,400. Total $26,400, which is under the 85% ceiling of $34,000, so <strong>$26,400</strong> (66% of benefits) is taxable.</p>
<p><strong>3. Deductions.</strong> AGI is $48,000 + $26,400 = $74,400. The joint standard deduction is $32,200, plus $1,650 for each spouse 65 or older = $35,500. Their AGI is below $150,000, so each gets the full $6,000 senior deduction: $12,000. Taxable income = $74,400 − $35,500 − $12,000 = <strong>$26,900</strong>.</p>
<p><strong>4. Tax.</strong> 10% of the first $24,800 = $2,480, plus 12% of the remaining $2,100 = $252. Federal tax = <strong>$2,732</strong>, or 2.8% of the $98,000 they received. Without the temporary senior deduction the bill would be $4,172.</p>
<p>After tax they keep $95,268 a year, about <strong>$7,939 a month</strong>. One warning sign: an extra $1,000 from the IRA would add $222 of tax, because it also pulls $850 more of their benefits into taxable income.</p>`,
  table: {
    title: 'How much tax do you pay as IRA withdrawals rise? (the Social Security tax torpedo)',
    intro: 'Federal tax for the example couple (married, both 65+, $40,000 of Social Security, $15,000 pension, $3,000 interest) as the IRA withdrawal changes, computed with the calculator above. Watch the last column.',
    head: ['IRA withdrawal', 'Taxable Social Security', 'Federal tax', 'Effective rate', 'Tax on next $1,000'],
    rows: ({ run, H, v }) => [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 100000, 120000].map(a => {
      const x = run({ ira: a });
      return [H.money0(a), H.money0(x.tss), H.money0(x.tax), H.pct(x.eff, 1), H.pct(x.marg, 1)];
    }),
    note: 'From about $20,000 to $39,000 of withdrawals, each extra dollar is taxed once on its own and again on the 85 cents of Social Security it drags into taxable income, so the real rate is 18.5% in the 10% bracket and 22.2% in the 12% bracket. Once 85% of benefits is taxable the rate falls back to 12%. Above $150,000 of AGI the senior deduction starts to phase out, which lifts the 22% bracket to an effective 24.6%.'
  },
  sections: [
    {
      h2: 'How much of my Social Security is taxable?',
      html: `<p>Anywhere from none to 85% of it, depending on your other income. The IRS test in Publication 915 starts with <strong>provisional income</strong>: your adjusted gross income without Social Security, plus tax-exempt interest, plus half of your benefits. The calculator then runs the same worksheet line by line:</p>
<ol><li>Subtract the base amount ($25,000 single, $32,000 joint). If nothing is left, no benefits are taxed.</li>
<li>Take half of the first $9,000 above the base ($12,000 joint), but never more than half your benefits. That is the 50% tier.</li>
<li>Add 85% of whatever provisional income is above $34,000 ($44,000 joint).</li>
<li>Cap the total at 85% of your benefits.</li></ol>
<p>A single retiree with $24,000 of benefits and a $20,000 IRA withdrawal has provisional income of $32,000, so $3,500 of benefits is taxable. Raise the withdrawal to $40,000 and $19,800 is taxable. The thresholds are not indexed for inflation, so more retirees cross them every year.</p>
`
    },
    {
      h2: 'What is the Social Security tax torpedo?',
      html: `<p>It is the stretch of income where each extra dollar you withdraw from an IRA or 401(k) is taxed twice: once as income itself and again because it makes up to 85 cents more of your Social Security taxable. In the 12% bracket the combined rate is 12% × 1.85 = <strong>22.2%</strong>; in the 22% bracket it becomes 40.7%. In the 50% tier the multiplier is 1.5, so 12% turns into 18%.</p>
<p>The table above shows the effect for the example couple: their marginal rate rises from 0% to 18.5% and 22.2% as withdrawals go from $10,000 to $30,000, then drops back to 12% once 85% of their benefits are already taxable. Middle-income retirees feel it most; large pensions are usually past it, and people living mainly on Social Security never reach it.</p>
<p>Ways to plan around it: draw more from pre-tax accounts in the years before claiming Social Security, convert to Roth while your income is low, or fill a year's needs from Roth or taxable savings when a big expense would otherwise push you into the torpedo zone.</p>`
    },
    {
      h2: 'How does the $6,000 senior deduction work?',
      html: `<p>The One Big Beautiful Bill Act, which the IRS now calls the Working Families Tax Cuts, added a temporary deduction of <strong>$6,000 for each taxpayer who is 65 or older</strong>, for tax years 2025 through 2028. A married couple who both qualify can deduct $12,000. Key rules from IRS guidance and Schedule 1-A:</p>
<ul><li>It is on top of the regular standard deduction and the existing extra amount for age 65+ ($2,050 single, $1,650 per married spouse in 2026).</li>
<li>You can claim it whether you itemize or take the standard deduction.</li>
<li>It shrinks by 6% of modified AGI above $75,000 (single) or $150,000 (joint). Each $6,000 is gone at $175,000 single; for a couple, each spouse's $6,000 is gone at $250,000.</li>
<li>Married couples must file jointly, and each person claiming it needs a valid Social Security number.</li></ul>
<p>For most retirees, modified AGI here is plain AGI, which includes the taxable part of Social Security. That is why the table shows a jump in the marginal rate above $150,000 of AGI: in the 22% bracket, losing 12 cents of deduction per dollar for a couple adds 2.6 points. The deduction does not reduce adjusted gross income, so it does not lower the taxable share of Social Security or Medicare IRMAA surcharges. The <a href="/magi-calculator">MAGI calculator</a> covers the other places modified AGI matters.</p>`
    },
    {
      h2: 'How are 401(k), IRA, pension and Roth withdrawals taxed?',
      html: `<ul><li><strong>Traditional IRA, 401(k), 403(b), 457(b):</strong> every pre-tax dollar you take out is ordinary income, taxed at the same brackets as wages. Required minimum distributions count too; the <a href="/rmd-calculator">RMD calculator</a> shows how large yours will be. If you made nondeductible IRA contributions, part of each withdrawal is tax-free, figured on Form 8606.</li>
<li><strong>Pensions and annuities:</strong> taxable in full unless you paid in after-tax money, in which case the 1099-R shows the taxable amount. Enter that figure.</li>
<li><strong>Roth IRA and Roth 401(k):</strong> qualified withdrawals (age 59½ and five years after your first Roth contribution) are tax-free and are not counted in provisional income. That makes Roth money the cheapest source of cash in a torpedo year.</li>
<li><strong>Before 59½:</strong> pre-tax withdrawals usually add a 10% additional tax; use the <a href="/early-withdrawal-penalty-calculator">early withdrawal calculator</a> for that case.</li></ul>
<p>Withholding is separate from the tax itself. IRA custodians withhold 10% from a withdrawal unless you choose a different rate on Form W-4R, and a 401(k) payout that could have been rolled over has 20% withheld. Compare what was withheld with the federal tax above to see whether you owe money in April or should make estimated payments.</p>`
    },
    {
      h2: 'How can retirees lower their federal income tax?',
      html: `<p>The biggest levers are timing and which account you draw from:</p>
<ul><li><strong>Fill low brackets on purpose.</strong> In years between retiring and claiming Social Security or starting RMDs, taxable income can be very low. Withdrawing or converting to Roth up to the top of the 12% bracket ($50,400 single, $100,800 joint in 2026 taxable income) can save tax later.</li>
<li><strong>Give from the IRA.</strong> From age 70½, a qualified charitable distribution sent straight to a charity is left out of AGI, so it also keeps Social Security and the senior deduction phase-out in check.</li>
<li><strong>Watch AGI cliffs.</strong> The senior deduction phase-out starts at $75,000/$150,000 MAGI, and Medicare premiums rise with income from two years earlier.</li></ul>
<p>To see whether your after-tax income covers spending for life, plug the monthly figure into the <a href="/retirement-income-calculator">retirement income calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What are the 2026 federal tax brackets for retirees?', a: 'Retirees use the same brackets as everyone else. For 2026, single filers pay 10% up to $12,400 of taxable income, 12% to $50,400, 22% to $105,700, 24% to $201,775, 32% to $256,225, 35% to $640,600 and 37% above. Joint brackets are double the single ones up to the 32% bracket; the 35% bracket ends at $768,700.' },
    { q: 'What is the standard deduction for seniors over 65 in 2026?', a: 'A single filer 65 or older gets $16,100 + $2,050 = $18,150, plus the $6,000 senior deduction, for $24,150 in total. A married couple who are both 65+ get $32,200 + $3,300 = $35,500, plus $12,000 of senior deduction, for $47,500, as long as MAGI is under $75,000 or $150,000.' },
    { q: 'How much tax will I pay on a $30,000 IRA withdrawal?', a: 'It depends on your other income. A single retiree over 65 with $24,000 of Social Security and no other income would owe $1,810 of federal tax on a $30,000 withdrawal, because the withdrawal also makes $11,300 of benefits taxable. With no Social Security, the same person would owe $585.' },
    { q: 'How much income can a retired couple have before paying federal tax?', a: 'A couple both 65 or older with no Social Security pays no federal income tax on up to $47,500 of IRA, pension or interest income in 2026. With $40,000 of Social Security, they can withdraw about $33,400 from an IRA before any tax is due.' },
    { q: 'At what age is Social Security no longer taxed?', a: 'There is no such age. Whether benefits are taxable depends only on provisional income, at any age. The new senior deduction lowers the tax on taxable benefits for people 65+ through 2028, but it does not make benefits non-taxable.' },
    { q: 'Do I pay state tax on retirement income?', a: 'It depends on the state. Most states do not tax Social Security benefits, several have no income tax at all, and many exempt part of pension or IRA income for older residents. Enter a flat rate above for a rough estimate and check your state revenue department for its exclusions.' },
    { q: 'Are Roth IRA withdrawals counted when figuring Social Security tax?', a: 'No. Qualified Roth withdrawals are not income and are not part of provisional income, so they do not make any Social Security taxable. Tax-exempt municipal bond interest, by contrast, does count.' },
    { q: 'Why is my marginal tax rate higher than my tax bracket?', a: 'Because one extra dollar of IRA income can raise taxable income by up to $1.85 when it also makes Social Security taxable, or cost part of the senior deduction above $75,000/$150,000 of MAGI. The calculator\'s "tax on the next $1,000" line captures both effects.' }
  ],
  related: ['social-security-calculator', 'rmd-calculator', 'magi-calculator', 'retirement-income-calculator', 'early-withdrawal-penalty-calculator'],
  sources: [
    { name: 'IRS Publication 915: Social Security and Equivalent Railroad Retirement Benefits', url: 'https://www.irs.gov/publications/p915' },
    { name: 'IRS: Tax inflation adjustments for tax year 2026 (brackets and standard deduction)', url: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill' },
    { name: 'IRS: Check your eligibility for the new enhanced deduction for seniors', url: 'https://www.irs.gov/newsroom/check-your-eligibility-for-the-new-enhanced-deduction-for-seniors' },
    { name: 'IRS Internal Revenue Bulletin 2025-45 (Rev. Proc. 2025-32, 65+ additional standard deduction)', url: 'https://www.irs.gov/irb/2025-45_IRB' },
    { name: 'IRS Publication 590-B: Distributions from IRAs', url: 'https://www.irs.gov/publications/p590b' },
    { name: 'IRS Publication 554: Tax Guide for Seniors', url: 'https://www.irs.gov/publications/p554' }
  ],
  disclaimer: 'A planning estimate of 2026 federal income tax, not tax advice. Credits, itemized deductions, capital gains rates and state rules can change your actual bill.'
};
