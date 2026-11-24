export default {
  slug: 'early-withdrawal-penalty-calculator',
  hub: 'rules',
  name: '401(k) Early Withdrawal Calculator',
  title: '401(k) Early Withdrawal Calculator: $20,000 at 45 Nets $13,250',
  h1: 'Early Withdrawal Penalty and Tax on a 401(k) or IRA Cash-Out',
  meta: 'Cashing out $20,000 from a 401(k) at 45 on a $60,000 salary costs $2,000 in penalty, $3,750 federal and $1,000 state tax: you keep $13,250. Exceptions included.',
  keyword: 'retirement early withdrawal calculator',
  also: ['early retirement withdrawal calculator', 'how much tax and penalty for 401k withdrawal calculator', 'how much tax on 401k withdrawal calculator', 'how to calculate taxes on 401k withdrawal', 'early retirement penalty calculator', 'retirement withdrawal penalty calculator', 'penalty calculator for early retirement withdrawal', 'cash out retirement calculator', 'retirement cash out calculator', 'retirement cash out tax calculator', 'rule of 55 retirement calculator', 'how to calculate age 59 1/2 for ira withdrawal'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'amount', label: 'Amount you withdraw (gross)', type: 'number', value: 20000, prefix: '$' },
    { id: 'age', label: 'Your age at the withdrawal', type: 'number', value: 45, suffix: 'years', help: 'Enter 59.5 or more if you are past 59½.' },
    { id: 'acct', label: 'Account type', type: 'select', value: '401k', options: [['401k', '401(k), 403(b) or other employer plan'], ['ira', 'Traditional, SEP or SIMPLE IRA'], ['roth', 'Roth IRA (earnings part only)'], ['457', 'Governmental 457(b)']] },
    { id: 'fedMode', label: 'Federal tax based on', type: 'select', value: 'income', options: [['income', 'My other income this year'], ['bracket', 'A tax bracket I choose']] },
    { id: 'status', label: 'Filing status', type: 'select', value: 'single', options: [['single', 'Single'], ['mfj', 'Married filing jointly']], showIf: { fedMode: ['income'] } },
    { id: 'income', label: 'Other income this year (wages etc.)', type: 'number', value: 60000, prefix: '$', help: 'Gross income before the standard deduction, not counting this withdrawal.', showIf: { fedMode: ['income'] } },
    { id: 'bracket', label: 'Federal tax bracket', type: 'select', value: '22', options: [['10', '10%'], ['12', '12%'], ['22', '22%'], ['24', '24%'], ['32', '32%'], ['35', '35%'], ['37', '37%']], showIf: { fedMode: ['bracket'] } },
    { id: 'state', label: 'State income tax rate', type: 'number', value: 5, suffix: '%' },
    { id: 'exc', label: 'Penalty exception', type: 'select', value: 'none', wide: true, options: [['none', 'None'], ['sep55', 'Left the employer in or after the year I turned 55'], ['sep50', 'Public safety employee, left in or after the year I turned 50'], ['disab', 'Total and permanent disability'], ['sepp', '72(t) substantially equal periodic payments'], ['home', 'First home purchase (IRA only, up to $10,000)'], ['edu', 'Higher education expenses (IRA only)'], ['medical', 'Medical expenses above 7.5% of AGI'], ['birth', 'Birth or adoption (up to $5,000)'], ['emerg', 'Emergency personal expense (up to $1,000 a year)']] },
    { id: 'target', label: 'Cash you need after tax (optional)', type: 'number', value: 10000, prefix: '$', help: 'Shows the gross withdrawal needed to end up with this much.' }
  ],
  data: {
    br: {
      single: [[12400, 10], [50400, 12], [105700, 22], [201775, 24], [256225, 32], [640600, 35], [1e15, 37]],
      mfj: [[24800, 10], [100800, 12], [211400, 22], [403550, 24], [512450, 32], [768700, 35], [1e15, 37]]
    },
    std: { single: 16100, mfj: 32200 },
    exc: {
      sep55: ['Separation from service at 55+', 'plan', 0], sep50: ['Public safety separation at 50+', 'plan', 0], disab: ['Disability', 'all', 0], sepp: ['72(t) payments', 'all', 0],
      home: ['First home', 'ira', 10000], edu: ['Higher education', 'ira', 0], medical: ['Medical expenses', 'all', 0], birth: ['Birth or adoption', 'all', 5000], emerg: ['Emergency expense', 'all', 1000]
    }
  },
  compute(v, H, D) {
    var amt = v.amount;
    if (!(amt > 0)) return { error: 'Enter the amount you plan to withdraw.' };
    if (!(v.age > 0 && v.age < 120)) return { error: 'Enter your age at the time of the withdrawal.' };
    var acct = v.acct, isIra = acct === 'ira' || acct === 'roth', st = v.status === 'mfj' ? 'mfj' : 'single';
    var stRate = v.state > 0 && v.state < 20 ? v.state : 0;
    var inc = v.income > 0 ? v.income : 0;
    function taxOn(ti) {
      var t = 0, lo = 0, br = D.br[st];
      for (var i = 0; i < br.length; i++) { if (ti > lo) t += (Math.min(ti, br[i][0]) - lo) * br[i][1] / 100; lo = br[i][0]; }
      return t;
    }
    var reason = '', exempt = 0, note = '';
    var e = D.exc[v.exc];
    if (v.age >= 59.5) { reason = 'you are 59½ or older'; }
    else if (acct === '457') { reason = 'governmental 457(b) plans are exempt'; note = ' Money rolled into the 457(b) from a 401(k) or IRA is still subject to it.'; }
    else if (e) {
      var ok = e[1] === 'all' || (e[1] === 'ira' && isIra) || (e[1] === 'plan' && !isIra);
      if (v.exc === 'sep55' && v.age < 55) ok = false;
      if (v.exc === 'sep50' && v.age < 50) ok = false;
      if (ok) reason = 'exception for ' + e[0].toLowerCase();
      else note = e[1] === 'ira' ? ' The ' + e[0].toLowerCase() + ' exception applies only to IRAs, not employer plans.' : e[1] === 'plan' && isIra ? ' The separation-from-service exception does not apply to IRAs.' : ' You are too young for this exception.';
    }
    function calc(g) {
      var ex = 0;
      if (reason) ex = e && v.age < 59.5 && acct !== '457' && e[2] > 0 ? Math.min(g, e[2]) : g;
      var pen = 0.1 * Math.max(0, g - ex);
      var fed = v.fedMode === 'bracket' ? g * (Number(v.bracket) || 22) / 100 : taxOn(Math.max(0, inc + g - D.std[st])) - taxOn(Math.max(0, inc - D.std[st]));
      var stt = g * stRate / 100;
      return { pen: pen, fed: fed, st: stt, net: g - pen - fed - stt, ex: ex };
    }
    var c = calc(amt);
    var wh = acct === '401k' || acct === '457' ? 0.2 : 0.1;
    var rows = [
      ['10% additional tax (penalty)', H.money0(c.pen), c.pen > 0],
      ['Federal income tax', H.money0(c.fed)],
      ['State income tax', H.money0(c.st)],
      ['Total cost', H.money0(amt - c.net) + ' (' + H.pct((amt - c.net) / amt * 100, 1) + ')'],
      [acct === '401k' || acct === '457' ? 'Mandatory 20% federal withholding' : 'Default 10% IRA withholding', H.money0(amt * wh)],
      ['Check before state withholding', H.money0(amt * (1 - wh))]
    ];
    if (reason && c.ex < amt) rows.splice(1, 0, ['Penalty-free part (' + e[0].toLowerCase() + ')', H.money0(c.ex)]);
    var tg = v.target;
    if (tg > 0) {
      var need = H.solve(function (g) { return calc(g).net - tg; }, tg, tg * 10 + 100000);
      if (need === need) rows.push(['Gross withdrawal to net ' + H.money0(tg), H.money0(Math.ceil(need)), true]);
    }
    return {
      value: H.money0(c.net),
      label: 'Cash you keep after penalty and taxes',
      expr: H.money0(amt) + ' − ' + H.money0(c.pen) + ' − ' + H.money0(c.fed) + ' − ' + H.money0(c.st),
      rows: rows,
      net: c.net, pen: c.pen, fed: c.fed, st: c.st, keep: c.net / amt * 100,
      sub: (c.pen > 0 ? 'The 10% additional tax applies because you are under 59½ and no exception covers ' + (c.ex > 0 ? 'the rest of ' : '') + 'this withdrawal.' : 'No 10% additional tax: ' + reason + '.') + note + ' Withholding is a prepayment; the real bill is settled on your tax return.'
    };
  },
  quick: ({ r, H }) => `A 45-year-old single filer earning $60,000 who cashes out <strong>$20,000</strong> from a 401(k) keeps <strong>${r.value}</strong>: ${H.money0(r.pen)} goes to the 10% early withdrawal penalty, ${H.money0(r.fed)} to federal income tax and ${H.money0(r.st)} to a 5% state tax, a ${H.pct(100 - r.keep, 1)} haircut. The plan withholds $4,000 up front, so about $1,750 more is due at tax time.`,
  stepsTitle: 'How to work out what an early withdrawal really costs',
  steps: [
    'Enter the gross amount you will take out and your age on the day of the withdrawal. The 10% additional tax stops the day you reach 59½, not the year.',
    'Pick the account type. The rules differ: rule-of-55 works only for employer plans, while the first-home and education exceptions work only for IRAs.',
    'Enter your other income for the year so the withdrawal is taxed on top of it, or pick a bracket. Using your current bracket alone is the common mistake: a large cash-out can push part of it into the next bracket.',
    'Choose an exception if one applies. Capped exceptions (first home, birth or adoption, emergency expense) only shelter part of a larger withdrawal.',
    'Use the "cash you need" box to find how much to withdraw so you end up with a target amount after penalty and taxes.'
  ],
  formulaTitle: 'How is the early withdrawal penalty calculated?',
  formula: {
    expr: 'Net cash = W − 10% × (W − exempt part) − federal tax − state tax<br>Federal tax = tax on (other income + W − standard deduction) − tax on (other income − standard deduction)',
    vars: [['W', 'gross amount withdrawn'], ['Exempt part', 'the amount an exception covers (all of it, or up to $10,000, $5,000 or $1,000 for capped exceptions)'], ['Standard deduction', '$16,100 single or $32,200 married filing jointly in 2026']],
    note: 'The 10% is an additional tax reported on Form 5329 (or directly on Schedule 2 when the 1099-R code already shows it). Federal tax uses the 2026 brackets on top of your other income, so a large withdrawal can span two brackets.'
  },
  example: `<p>Jordan is 45, single, earns $60,000 and wants to cash out <strong>$20,000</strong> from a former employer's 401(k). Jordan's state charges a flat 5%.</p>
<p><strong>Penalty:</strong> 10% × $20,000 = <strong>$2,000</strong>.</p>
<p><strong>Federal tax:</strong> before the withdrawal, taxable income is $60,000 − $16,100 = $43,900. After it, $63,900. The first $6,500 fills the 12% bracket (to $50,400) = $780, and the other $13,500 is taxed at 22% = $2,970. Extra federal tax = <strong>$3,750</strong>.</p>
<p><strong>State tax:</strong> 5% × $20,000 = <strong>$1,000</strong>.</p>
<p><strong>Net cash:</strong> $20,000 − $2,000 − $3,750 − $1,000 = <strong>$13,250</strong>, or 66.3% of the withdrawal.</p>
<p>The plan withholds 20%, so Jordan's check is $16,000 before any state withholding. That $4,000 does not cover the $5,750 of federal tax and penalty, so about $1,750 more is due with the tax return. To walk away with $10,000, Jordan would need to withdraw $14,842. Had Jordan left the job in or after the year of turning 55, the penalty would disappear and the net would be $15,250.</p>`,
  table: {
    title: 'How much do you keep from a 401(k) cash-out at 45?',
    intro: 'Penalty, tax and net cash at different withdrawal sizes for a single filer earning $60,000 with a 5% state tax and no exception, computed with the calculator above.',
    head: ['Withdrawal', '10% penalty', 'Federal tax', 'State tax', 'You keep', '% kept'],
    rows: ({ run, H }) => [5000, 10000, 20000, 30000, 50000, 75000, 100000, 150000].map(a => {
      const x = run({ amount: a, target: '' });
      return [H.money0(a), H.money0(x.pen), H.money0(x.fed), H.money0(x.st), x.value, H.pct(x.keep, 1)];
    }),
    note: 'The share you keep falls as the withdrawal grows, because each extra dollar lands in a higher bracket. Taking $100,000 in one year costs $37,114 in penalty and taxes. Splitting a large withdrawal across two tax years, or taking it in a year with little other income, lowers the bill.'
  },
  sections: [
    {
      h2: 'What are the exceptions to the 10% early withdrawal penalty?',
      html: `<p>The IRS lists these exceptions on its "exceptions to tax on early distributions" page. Some work only for employer plans, some only for IRAs:</p>
<div class="twrap"><table><thead><tr><th>Exception</th><th>401(k)/403(b)</th><th>IRA</th></tr></thead><tbody>
<tr><td>Age 59½ or older</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Left the employer in or after the year you turn 55 (50 for qualified public safety employees)</td><td>Yes</td><td>No</td></tr>
<tr><td>Total and permanent disability, or terminal illness</td><td>Yes</td><td>Yes</td></tr>
<tr><td>72(t) substantially equal periodic payments</td><td>Yes, after leaving the employer</td><td>Yes</td></tr>
<tr><td>Unreimbursed medical expenses above 7.5% of AGI</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Birth or adoption, up to $5,000 per child</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Emergency personal expense, up to $1,000 a year</td><td>Yes</td><td>Yes</td></tr>
<tr><td>First home purchase, up to $10,000 lifetime</td><td>No</td><td>Yes</td></tr>
<tr><td>Qualified higher education expenses</td><td>No</td><td>Yes</td></tr>
<tr><td>Health insurance premiums while unemployed</td><td>No</td><td>Yes</td></tr>
<tr><td>Payment to an ex-spouse under a QDRO</td><td>Yes</td><td>No</td></tr>
</tbody></table></div>
<p>Other exceptions cover death, IRS levies, qualified disaster recovery distributions, domestic abuse victims (up to a capped amount) and military reservists called to active duty. There is <strong>no exception for hardship withdrawals</strong>: a 401(k) may let you take one, but the 10% still applies unless something above also fits. Exceptions remove only the 10%; regular income tax is still owed. SIMPLE IRA withdrawals in the first two years of participation carry a 25% additional tax instead of 10%.</p>`
    },
    {
      h2: 'How does the rule of 55 work?',
      html: `<p>If you leave your job, for any reason, during or after the calendar year you turn 55, withdrawals from <em>that employer's</em> 401(k) or 403(b) are free of the 10% additional tax. You could retire in February of the year you turn 55, even before your birthday, and qualify. Qualified public safety employees, such as police officers and firefighters, get the same treatment from age 50.</p>
<p>The catch: it does not reach IRAs or plans from earlier employers. Rolling the 401(k) into an IRA before you need the money throws the exception away, so many early retirees leave enough in the last employer's plan to bridge to 59½. Governmental 457(b) plans never had the 10% tax in the first place.</p>`
    },
    {
      h2: 'Why does a 401(k) withhold 20% when you cash out?',
      html: `<p>Federal law requires a plan to withhold 20% from any distribution that could have been rolled over but is paid to you instead. You cannot opt out, and the 20% is a prepayment toward your tax bill, not the bill itself. On a $20,000 cash-out you receive $16,000; if your real federal tax plus penalty is $5,750, you owe the $1,750 difference when you file.</p>
<p>A direct rollover to an IRA or new plan avoids withholding entirely. If you take the check and change your mind, you have 60 days to deposit the full $20,000, which means replacing the withheld $4,000 from other money; otherwise the shortfall counts as a taxable distribution. Hardship withdrawals cannot be rolled over, so they get 10% default withholding that you can decline, and IRA withdrawals also default to 10% that you can change on Form W-4R.</p>`
    },
    {
      h2: 'How are early Roth IRA withdrawals taxed?',
      html: `<p>Roth IRA money comes out in a fixed order. Your own <strong>contributions</strong> come out first, always tax-free and penalty-free. <strong>Conversions</strong> come next; each one is penalty-free only after five years (or at 59½). <strong>Earnings</strong> come out last, and before 59½ (or before the account is five years old) they are taxed as income and hit with the 10% unless an exception applies.</p>
<p>So someone who contributed $30,000 to a Roth IRA now worth $45,000 can take out $30,000 with no tax at all. Only the part above that is earnings; enter just that amount with the "Roth IRA (earnings part only)" option to see the cost.</p>`
    }
  ],
  faq: [
    { q: 'What is the penalty for withdrawing $10,000 from a 401(k) early?', a: 'The penalty is $1,000, 10% of the withdrawal. With income tax added, a single filer earning $60,000 in a 5% state keeps $6,950 of the $10,000.' },
    { q: 'How much tax will I pay on a $20,000 401(k) withdrawal in the 22% bracket?', a: 'Using a flat 22% federal rate, 10% penalty and 5% state tax, you pay $4,400 + $2,000 + $1,000 = $7,400 and keep $12,600. If part of the withdrawal falls in the 12% bracket, as in the default example, you keep a little more: $13,250.' },
    { q: 'How do I calculate the date I turn 59½?', a: 'Add 59 years and 6 months to your birth date. If you were born on March 15, 1967, you reach 59½ on September 15, 2026, and any withdrawal on or after that day avoids the 10% additional tax.' },
    { q: 'Can I avoid the penalty with a hardship withdrawal?', a: 'No. A hardship withdrawal lets you take money out of a 401(k) while still working, but the 10% additional tax applies unless a separate exception, such as medical expenses over 7.5% of AGI or disability, also fits.' },
    { q: 'How do 72(t) payments avoid the penalty?', a: 'You take a series of substantially equal payments calculated with an IRS-approved method based on your life expectancy. Payments must continue for five years or until 59½, whichever is later; changing them early triggers the 10% retroactively on all payments, plus interest.' },
    { q: 'Does my state charge an early withdrawal penalty too?', a: 'A few do. California, for example, adds a 2.5% additional tax on early distributions. Most states simply tax the withdrawal as income, which this calculator models with the flat state rate.' }
  ],
  related: ['retirement-tax-calculator', '401k-contribution-calculator', 'rmd-calculator', 'roth-ira-calculator', 'magi-calculator'],
  sources: [
    { name: 'IRS: Retirement topics, exceptions to tax on early distributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-exceptions-to-tax-on-early-distributions' },
    { name: 'IRS Topic no. 558: Additional tax on early distributions from retirement plans other than IRAs', url: 'https://www.irs.gov/taxtopics/tc558' },
    { name: 'IRS Topic no. 557: Additional tax on early distributions from traditional and Roth IRAs', url: 'https://www.irs.gov/taxtopics/tc557' },
    { name: 'IRS: Substantially equal periodic payments', url: 'https://www.irs.gov/retirement-plans/substantially-equal-periodic-payments' },
    { name: 'IRS Publication 590-B: Distributions from IRAs', url: 'https://www.irs.gov/publications/p590b' },
    { name: 'IRS: Tax inflation adjustments for tax year 2026', url: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill' }
  ],
  disclaimer: 'A planning estimate using 2026 federal brackets and a flat state rate, not tax advice. Check your plan\'s rules and IRS guidance before withdrawing.'
};
