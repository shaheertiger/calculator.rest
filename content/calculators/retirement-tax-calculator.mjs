export default {
  slug: 'retirement-tax-calculator',
  hub: 'rules',
  name: 'Retirement Tax Calculator',
  seoTitle: 'Retirement Tax Calculator 2026: 85% SS Rule + $6,000 Deduction',
  meta: 'A 65+ couple with $40,000 of Social Security, $30,000 of IRA withdrawals and a $15,000 pension owes $2,732 in 2026 federal tax (2.8%). Run your own mix.',
  intro: 'Plug in your IRA and 401(k) withdrawals, pension, Social Security and other income, and we\'ll show you your 2026 federal income tax, how much of your Social Security is taxable, the tax brackets you fall in and what you keep after tax.',
  keyword: 'retirement tax calculator',
  also: ['taxes on retirement income calculator', 'retirement income tax calculator', 'retirement tax rate calculator', 'federal taxes on retirement income calculator', 'retirement withdrawal tax calculator', 'calculate taxes on retirement income', 'tax calculator for retirees', 'federal income tax calculator for retirees', 'retirement taxable income calculator', 'social security tax calculator for retirees', 'income tax calculator for retirees'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'status', label: 'Filing status', type: 'select', value: 'mfj', options: [['mfj', 'Married filing jointly'], ['single', 'Single (or head of household, approx.)']], help: 'Head of household filers can choose Single; the estimate will run slightly high.' },
    { id: 'old1', label: 'You are 65 or older by Dec 31, 2026', type: 'checkbox', value: true, help: 'Tick if you were born before Jan 2, 1962. It adds the 65+ standard deduction and the $6,000 senior deduction.' },
    { id: 'old2', label: 'Your spouse is 65 or older by Dec 31, 2026', type: 'checkbox', value: true, help: 'The same test for your spouse; each person 65 or older adds their own amounts.', showIf: { status: ['mfj'] } },
    { id: 'ira', label: 'Traditional IRA / 401(k) withdrawals (incl. RMDs)', type: 'number', value: 30000, prefix: '$', help: 'Pre-tax money taken out during 2026, for both spouses.' },
    { id: 'pension', label: 'Pension and annuity income (taxable part)', type: 'number', value: 15000, prefix: '$', help: 'The taxable amount in box 2a of Form 1099-R, for both spouses.' },
    { id: 'ss', label: 'Social Security benefits for the year', type: 'number', value: 40000, prefix: '$', help: 'Box 5 of Form SSA-1099, before Medicare premiums are taken out. Both spouses combined.' },
    { id: 'interest', label: 'Taxable interest and dividends', type: 'number', value: 3000, prefix: '$', help: 'From Forms 1099-INT and 1099-DIV, including money market and CD interest.' },
    { id: 'wages', label: 'Wages or self-employment income', type: 'number', value: 0, prefix: '$', help: 'Pay from a job or net self-employment income in 2026, if you still work.' },
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
      ['Total income', H.money0(total)],
      ['Provisional income', H.money0(c.prov)],
      ['Taxable Social Security', H.money0(c.tss) + (ss > 0 ? ' (' + H.pct(c.tss / ss * 100, 1) + ' of benefits)' : ''), true],
      ['Adjusted gross income', H.money0(c.agi)],
      ['Standard deduction incl. 65+ amount', '−' + H.money0(c.std)],
      ['Senior deduction (2025–2028)', '−' + H.money0(c.sen)],
      ['Taxable income', H.money0(c.ti)]
    ];
    if (stRate > 0) rows.push(['State income tax (estimate)', H.money0(stTax)]);
    rows.push(['Total income after tax', H.money0(after)]);
    rows.push(['After-tax income per month', H.money0(after / 12), true]);
    rows.push(['Average tax rate', H.pct(eff, 1)]);
    rows.push(['Tax bracket', H.pct(c.rate, 0)]);
    rows.push(['Marginal tax rate', H.money0(nxt.tax - c.tax) + ' (' + H.pct(marg, 1) + ')', torpedo]);
    var brRows = [], blo = 0, bl = D.br[st];
    for (var j = 0; j < bl.length; j++) {
      var bhi = bl[j][0];
      if (c.ti > blo) {
        var inB = Math.min(c.ti, bhi) - blo;
        brRows.push([H.pct(bl[j][1], 0), H.money0(blo) + (bhi >= 1e15 ? ' and up' : ' – ' + H.money0(bhi)), H.money0(inB), H.money0(inB * bl[j][1] / 100)]);
      }
      blo = bhi;
    }
    return {
      value: H.money0(c.tax),
      label: '2026 federal income tax',
      expr: H.money0(c.ti) + ' taxable income at 2026 ' + (st === 'mfj' ? 'joint' : 'single') + ' rates',
      rows: rows,
      tax: c.tax, tss: c.tss, ti: c.ti, agi: c.agi, sen: c.sen, std: c.std, prov: c.prov, eff: eff, marg: marg, bracket: c.rate, monthly: after / 12, total: total,
      table: { head: ['Rate', 'Bracket (taxable income)', 'Your income in it', 'Tax'], rows: brRows, caption: 'Your taxable income places you in the following tax brackets' },
      sub: 'You owe about ' + H.money0(c.tax) + ' in 2026 federal income tax, an average rate of ' + H.pct(eff, 1) + ' on ' + H.money0(total) + ' of income. ' + (torpedo ? 'Each extra IRA dollar also makes more Social Security taxable, so your real marginal rate (' + H.pct(marg, 1) + ') is above your ' + H.pct(c.rate, 0) + ' bracket.' : (c.tax === 0 ? 'Deductions cover all of your taxable income, so no federal income tax is due.' : 'Your marginal rate on extra withdrawals equals your ' + H.pct(c.rate, 0) + ' bracket.'))
    };
  },
  notes: {
    'Total income': 'Everything you received, including Social Security and Roth withdrawals.',
    'Provisional income': 'Other income plus tax-exempt interest plus half your Social Security.',
    'Taxable Social Security': 'The part of your benefits added to taxable income, at most 85%.',
    'Adjusted gross income': 'Taxable income sources before any deductions.',
    'Standard deduction incl. 65+ amount': 'The 2026 standard deduction plus the extra amount for each person 65 or older.',
    'Senior deduction (2025–2028)': 'The temporary $6,000 per person 65+, reduced above $75,000 or $150,000 of MAGI.',
    'Taxable income': 'AGI minus all deductions; the brackets below apply to this.',
    'State income tax (estimate)': 'Your flat state rate times income other than Social Security.',
    'Total income after tax': 'Total income minus federal and any state income tax.',
    'After-tax income per month': 'What you keep after tax, divided by 12.',
    'Average tax rate': 'Total federal tax divided by total income.',
    'Tax bracket': 'The rate on the top slice of your taxable income.',
    'Marginal tax rate': 'Incremental tax paid on the next $1,000 of IRA withdrawals, including any Social Security it makes taxable.'
  },
  assumptions: 'These calculations are estimates. They use 2026 federal brackets and the standard deduction, treat dividends and capital gains as ordinary income, and ignore credits, itemized deductions and the net investment income tax.',
  quick: ({ r, H }) => `A married couple, both 65 or older, with $40,000 of Social Security, $30,000 of IRA withdrawals, a $15,000 pension and $3,000 of interest owes <strong>${r.value}</strong> in 2026 federal income tax, an effective rate of ${H.pct(r.eff, 1)}. ${H.money0(r.tss)} of their benefits is taxable, and the next $1,000 they withdraw costs ${H.pct(r.marg, 1)} in tax even though they sit in the ${H.pct(r.bracket, 0)} bracket.`,
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
      h2: 'Understanding your inputs',
      html: `<p>Enter yearly totals for 2026. For a married couple filing jointly, add both spouses' income together on each line.</p>
<h3>Filing status</h3>
<p>Married filing jointly uses brackets and a standard deduction twice as wide as single for most of the range. Head of household filers can choose Single: their real brackets and deduction are a little larger, so the estimate runs slightly high.</p>
<h3>65 or older</h3>
<p>Tick each box that applies. Each one adds both the regular extra standard deduction for age 65+ and the $6,000 senior deduction, so leaving one unticked overstates the tax. For the example couple, unticking both raises the bill from $2,732 to $4,568.</p>
<h3>Traditional IRA and 401(k) withdrawals</h3>
<p>Include every pre-tax dollar you take out of a traditional IRA, 401(k), 403(b) or 457(b), including required minimum distributions. Use the gross amount before withholding, not what reached your bank account.</p>
<h3>Pension and annuity income</h3>
<p>Enter the taxable amount from Form 1099-R. If you paid into the plan with after-tax money, part of each payment is a tax-free return of your own contributions and box 2a is lower than box 1.</p>
<h3>Social Security benefits</h3>
<p>Use the net benefits in box 5 of Form SSA-1099. Medicare Part B premiums are deducted from the check but still count as benefits you received, so don't subtract them.</p>
<h3>Interest, dividends and wages</h3>
<p>Add bank, CD and bond interest, dividends and any pay from work. The calculator taxes dividends at ordinary rates, which slightly overstates tax on qualified dividends.</p>
<h3>Tax-exempt interest</h3>
<p>Add tax-exempt municipal bond interest if you have any. It is not taxed, but the IRS adds it to provisional income, which is the step most people skip.</p>
<h3>Roth withdrawals</h3>
<p>Include Roth withdrawals only to see your full monthly budget. Qualified Roth money does not change the federal tax or the taxable share of Social Security.</p>
<h3>State income tax rate</h3>
<p>Enter a flat rate for a rough state figure. It is applied to income other than Social Security, because most states don't tax benefits. Before taking a bigger withdrawal or doing a Roth conversion, read the "Marginal tax rate" line; it shows the real federal rate on extra income.</p>`
    },
    {
      h2: 'What are the 2026 federal tax brackets for retirees?',
      html: `<p>Retirees use the same seven brackets as everyone else. Each rate applies only to the slice of taxable income inside its band, which is why the results show a table of the brackets your income reaches.</p>
<div class="twrap"><table><thead><tr><th>Rate</th><th>Single taxable income</th><th>Married filing jointly</th></tr></thead><tbody>
<tr><td>10%</td><td>$0 – $12,400</td><td>$0 – $24,800</td></tr>
<tr><td>12%</td><td>$12,400 – $50,400</td><td>$24,800 – $100,800</td></tr>
<tr><td>22%</td><td>$50,400 – $105,700</td><td>$100,800 – $211,400</td></tr>
<tr><td>24%</td><td>$105,700 – $201,775</td><td>$211,400 – $403,550</td></tr>
<tr><td>32%</td><td>$201,775 – $256,225</td><td>$403,550 – $512,450</td></tr>
<tr><td>35%</td><td>$256,225 – $640,600</td><td>$512,450 – $768,700</td></tr>
<tr><td>37%</td><td>over $640,600</td><td>over $768,700</td></tr>
</tbody></table></div>
<h3>Average tax rate</h3>
<p>Your average (effective) rate is total federal tax divided by total income. The example couple pays $2,732 on $98,000, or 2.8%, because deductions shelter $47,500 and most of the rest is taxed at 10%.</p>
<h3>Marginal tax rate</h3>
<p>Your marginal rate is the incremental tax paid on incremental income. For most people it equals the bracket. For retirees on Social Security it is often higher, because an extra IRA dollar can also make more benefits taxable; the next section explains why.</p>`
    },
    {
      h2: 'How is each type of retirement income taxed?',
      html: `<p>Federal tax treats retirement income very differently depending on the account it comes from.</p>
<h3>Traditional IRA and 401(k) withdrawals</h3>
<p>Every pre-tax dollar you take out of a traditional IRA, 401(k), 403(b) or 457(b) is ordinary income, taxed at the same brackets as wages. Required minimum distributions count too; the <a href="/rmd-calculator">RMD calculator</a> shows how large yours will be. If you made nondeductible IRA contributions, part of each withdrawal is tax-free, figured on Form 8606. Before 59½, pre-tax withdrawals usually add a 10% additional tax; use the <a href="/early-withdrawal-penalty-calculator">early withdrawal calculator</a> for that case.</p>
<h3>Pensions and annuities</h3>
<p>Taxable in full unless you paid in after-tax money, in which case the 1099-R shows the taxable amount. Enter that figure.</p>
<h3>Social Security</h3>
<p>Anywhere from none to 85% of benefits is taxable, depending on your other income. The IRS test in Publication 915 starts with <strong>provisional income</strong>: your adjusted gross income without Social Security, plus tax-exempt interest, plus half of your benefits. The calculator then runs the same worksheet line by line:</p>
<ol><li>Subtract the base amount ($25,000 single, $32,000 joint). If nothing is left, no benefits are taxed.</li>
<li>Take half of the first $9,000 above the base ($12,000 joint), but never more than half your benefits. That is the 50% tier.</li>
<li>Add 85% of whatever provisional income is above $34,000 ($44,000 joint).</li>
<li>Cap the total at 85% of your benefits.</li></ol>
<p>A single retiree with $24,000 of benefits and a $20,000 IRA withdrawal has provisional income of $32,000, so $3,500 of benefits is taxable. Raise the withdrawal to $40,000 and $19,800 is taxable. The thresholds are not indexed for inflation, so more retirees cross them every year. The <a href="/social-security-calculator">Social Security calculator</a> estimates the benefit itself.</p>
<h3>Interest and dividends</h3>
<p>Bank, CD and taxable bond interest is ordinary income. Qualified dividends and long-term gains get lower rates on a real return; this calculator taxes them as ordinary income, so it errs on the high side.</p>
<h3>Roth IRA and Roth 401(k)</h3>
<p>Qualified withdrawals (age 59½ and five years after your first Roth contribution) are tax-free and are not counted in provisional income. That makes Roth money the cheapest source of cash in a torpedo year.</p>
<h3>Withholding is not the tax</h3>
<p>IRA custodians withhold 10% from a withdrawal unless you choose a different rate on Form W-4R, and a 401(k) payout that could have been rolled over has 20% withheld. Compare what was withheld with the federal tax above to see whether you owe money in April or should make estimated payments.</p>`
    },
    {
      h2: 'What deductions can retirees take in 2026?',
      html: `<p>Three deductions stack for most retirees, and together they shelter a lot of income: $24,150 for a single filer 65 or older and $47,500 for a married couple who are both 65+.</p>
<h3>Standard deduction</h3>
<p>The 2026 standard deduction is $16,100 for single filers and $32,200 for married couples filing jointly. Most retirees take it because their mortgage is paid off and itemized deductions are small.</p>
<h3>Additional deduction for age 65 or older</h3>
<p>Each taxpayer 65 or older adds $2,050 (single) or $1,650 (per married spouse) in 2026. Blind taxpayers get the same amount again.</p>
<h3>$6,000 senior deduction</h3>
<p>The One Big Beautiful Bill Act, which the IRS now calls the Working Families Tax Cuts, added a temporary deduction of <strong>$6,000 for each taxpayer who is 65 or older</strong>, for tax years 2025 through 2028. A married couple who both qualify can deduct $12,000. Key rules from IRS guidance and Schedule 1-A:</p>
<ul><li>It is on top of the regular standard deduction and the extra amount for age 65+.</li>
<li>You can claim it whether you itemize or take the standard deduction.</li>
<li>It shrinks by 6% of modified AGI above $75,000 (single) or $150,000 (joint). Each $6,000 is gone at $175,000 single; for a couple, each spouse's $6,000 is gone at $250,000.</li>
<li>Married couples must file jointly, and each person claiming it needs a valid Social Security number.</li></ul>
<p>For most retirees, modified AGI here is plain AGI, which includes the taxable part of Social Security. That is why the table above shows a jump in the marginal rate above $150,000 of AGI: in the 22% bracket, losing 12 cents of deduction per dollar for a couple adds 2.6 points. The deduction does not reduce adjusted gross income, so it does not lower the taxable share of Social Security or Medicare IRMAA surcharges. The <a href="/magi-calculator">MAGI calculator</a> covers the other places modified AGI matters.</p>`
    },
    {
      h2: 'What is the Social Security tax torpedo?',
      html: `<p>It is the stretch of income where each extra dollar you withdraw from an IRA or 401(k) is taxed twice: once as income itself and again because it makes up to 85 cents more of your Social Security taxable.</p>
<h3>How big the effect is</h3>
<p>In the 12% bracket the combined rate is 12% × 1.85 = <strong>22.2%</strong>; in the 22% bracket it becomes 40.7%. In the 50% tier the multiplier is 1.5, so 12% turns into 18%. The table above shows the effect for the example couple: their marginal rate rises from 0% to 18.5% and 22.2% as withdrawals go from $10,000 to $30,000, then drops back to 12% once 85% of their benefits are already taxable.</p>
<h3>Who it hits</h3>
<p>Middle-income retirees feel it most; large pensions are usually past it, and people living mainly on Social Security never reach it.</p>
<h3>Ways to plan around it</h3>
<p>Draw more from pre-tax accounts in the years before claiming Social Security, convert to Roth while your income is low, or fill a year's needs from Roth or taxable savings when a big expense would otherwise push you into the torpedo zone.</p>`
    },
    {
      h2: 'How can retirees lower their federal income tax?',
      html: `<p>The biggest levers are timing and which account you draw from.</p>
<h3>Fill low brackets on purpose</h3>
<p>In years between retiring and claiming Social Security or starting RMDs, taxable income can be very low. Withdrawing or converting to Roth up to the top of the 12% bracket ($50,400 single, $100,800 joint in 2026 taxable income) can save tax later.</p>
<h3>Give from the IRA</h3>
<p>From age 70½, a qualified charitable distribution sent straight to a charity is left out of AGI, so it also keeps Social Security and the senior deduction phase-out in check.</p>
<h3>Watch AGI cliffs</h3>
<p>The senior deduction phase-out starts at $75,000/$150,000 MAGI, and Medicare premiums rise with income from two years earlier. To see whether your after-tax income covers spending for life, plug the monthly figure into the <a href="/retirement-income-calculator">retirement income calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much tax will I pay on my retirement income?', a: 'A married couple, both 65+, with $40,000 of Social Security, $30,000 of IRA withdrawals, a $15,000 pension and $3,000 of interest owes $2,732 of federal tax in 2026, an average rate of 2.8%. Enter your own income above; the answer depends heavily on how much Social Security becomes taxable.' },
    { q: 'What are the 2026 federal tax brackets for retirees?', a: 'Retirees use the same brackets as everyone else. For 2026, single filers pay 10% up to $12,400 of taxable income, 12% to $50,400, 22% to $105,700, 24% to $201,775, 32% to $256,225, 35% to $640,600 and 37% above. Joint brackets are double the single ones up to the 32% bracket; the 35% bracket ends at $768,700.' },
    { q: 'What is the standard deduction for seniors over 65 in 2026?', a: 'A single filer 65 or older gets $16,100 + $2,050 = $18,150, plus the $6,000 senior deduction, for $24,150 in total. A married couple who are both 65+ get $32,200 + $3,300 = $35,500, plus $12,000 of senior deduction, for $47,500, as long as MAGI is under $75,000 or $150,000.' },
    { q: 'How much tax will I pay on a $30,000 IRA withdrawal?', a: 'It depends on your other income. A single retiree over 65 with $24,000 of Social Security and no other income would owe $1,810 of federal tax on a $30,000 withdrawal, because the withdrawal also makes $11,300 of benefits taxable. With no Social Security, the same person would owe $585.' },
    { q: 'How much federal tax do I pay on $50,000 of retirement income?', a: 'A single retiree 65 or older with $50,000 of IRA or pension income and no Social Security owes $2,854, an average rate of 5.7%. Add $24,000 of Social Security and the bill rises to $5,302, because $20,400 of benefits becomes taxable.' },
    { q: 'How much income can a retired couple have before paying federal tax?', a: 'A couple both 65 or older with no Social Security pays no federal income tax on up to $47,500 of IRA, pension or interest income in 2026. With $40,000 of Social Security, they can withdraw about $33,400 from an IRA before any tax is due.' },
    { q: 'How do I calculate my effective tax rate in retirement?', a: 'Divide total federal tax by total income, including Social Security and Roth withdrawals. The example couple pays $2,732 on $98,000, an average rate of 2.8%, even though they are in the 12% bracket.' },
    { q: 'Why is my marginal tax rate higher than my tax bracket?', a: 'Because one extra dollar of IRA income can raise taxable income by up to $1.85 when it also makes Social Security taxable, or cost part of the senior deduction above $75,000/$150,000 of MAGI. The calculator\'s "Marginal tax rate" line captures both effects: 22.2% for the example couple in the 12% bracket.' },
    { q: 'At what age is Social Security no longer taxed?', a: 'There is no such age. Whether benefits are taxable depends only on provisional income, at any age. The new senior deduction lowers the tax on taxable benefits for people 65+ through 2028, but it does not make benefits non-taxable.' },
    { q: 'Are Roth IRA withdrawals counted when figuring Social Security tax?', a: 'No. Qualified Roth withdrawals are not income and are not part of provisional income, so they do not make any Social Security taxable. Tax-exempt municipal bond interest, by contrast, does count.' },
    { q: 'Is my pension taxable?', a: 'Yes, in full, unless you contributed after-tax money to it. In that case part of each payment is tax-free and Form 1099-R shows the taxable amount in box 2a. Enter that figure in the pension line above.' },
    { q: 'Do I still pay tax on 401(k) withdrawals after 65?', a: 'Yes. Traditional 401(k) and IRA withdrawals are ordinary income at any age; turning 65 only adds larger deductions. A married couple both 65+ with $100,000 of 401(k) withdrawals and no other income owes $5,804 in 2026.' },
    { q: 'How much tax should I have withheld from IRA withdrawals?', a: 'Enough to cover your total federal tax for the year, after any pension or wage withholding. IRA custodians withhold 10% by default: the example couple would have $3,000 withheld from a $30,000 withdrawal, a little more than their $2,732 bill. Use Form W-4R to choose a different rate.' },
    { q: 'Do I pay state tax on retirement income?', a: 'It depends on the state. Most states do not tax Social Security benefits, several have no income tax at all, and many exempt part of pension or IRA income for older residents. Enter a flat rate above for a rough estimate and check your state revenue department for its exclusions.' }
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
