export default {
  slug: 'retirement-withdrawal-calculator',
  hub: 'income',
  name: 'Retirement Withdrawal Calculator',
  meta: 'Estimate how much you can withdraw from retirement savings each month with our free calculator. See your withdrawal rate, the 4% rule and each year\'s balance.',
  intro: 'Plug in your savings, how many years they must last, your expected return and inflation, and we\'ll show you the most you can withdraw each month, your withdrawal rate and how the 4% rule compares.',
  keyword: 'retirement withdrawal calculator',
  also: ['retirement distribution calculator', 'retirement drawdown calculator', 'retirement spend down calculator', 'monthly retirement withdrawal calculator', '4 percent rule retirement calculator', '4 rule retirement calculator', '4 percent retirement withdrawal calculator', 'retirement withdrawal rate calculator', 'safe withdrawal rate retirement calculator', 'how much can i withdraw monthly in retirement calculator', 'retirement withdrawal calculator with inflation', 'retirement calculator with withdrawals'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'savings', label: 'Retirement savings today', type: 'number', value: 1000000, prefix: '$', help: '401(k), 403(b), IRA, brokerage and cash you will draw from. Leave out your emergency fund.' },
    { id: 'years', label: 'Years the money must last', type: 'number', value: 30, suffix: 'years', help: 'From 65, 30 years reaches age 95. Retiring at 55 usually needs 40 or more.' },
    { id: 'ret', label: 'Annual return on savings', type: 'number', value: 6, suffix: '%', help: 'Average yearly growth before inflation. A balanced portfolio is often modeled at 5–7%.' },
    { id: 'infl', label: 'Raise withdrawals each year by (inflation)', type: 'number', value: 3, suffix: '%', help: 'Use 0 for the same dollar amount every year.' },
    { id: 'tax', label: 'Tax rate on withdrawals (optional)', type: 'number', value: 0, suffix: '%', help: 'For pre-tax 401(k) or IRA money. The answer is then what you can spend after tax.' },
    { id: 'leave', label: 'Leave a balance of (optional, today\'s dollars)', type: 'number', value: 0, prefix: '$', help: 'For heirs or a cushion. 0 spends the savings down to nothing.' }
  ],
  compute(v, H) {
    var S = v.savings, N = Math.round(v.years);
    if (!(S > 0)) return { error: 'Enter how much you have saved for retirement.' };
    if (!(N >= 1 && N <= 70)) return { error: 'Enter how many years the money must last (1 to 70).' };
    var r = isNaN(v.ret) ? 0 : v.ret, inf = isNaN(v.infl) ? 0 : v.infl;
    var tax = v.tax > 0 && v.tax < 90 ? v.tax : 0, keepReal = v.leave > 0 ? v.leave : 0;
    if (r <= -100 || inf <= -100) return { error: 'Enter a return and inflation rate above −100%.' };
    var i = Math.pow(1 + r / 100, 1 / 12) - 1, n = N * 12, gUp = 1 / (1 - tax / 100);
    var keep = keepReal * Math.pow(1 + inf / 100, N);
    // Withdrawals are linear in the first-year amount, so solve exactly:
    // end balance = S(1+i)^n − W × K, where K is the end value of all withdrawals per $1.
    var K = 0, f = 1;
    for (var m = 0; m < n; m++) { if (m > 0 && m % 12 === 0) f *= 1 + inf / 100; K = (K + f * gUp) * (1 + i); }
    var grown = S * Math.pow(1 + i, n);
    if (keep >= grown) return { error: 'The balance you want to leave is more than your savings will grow to. Lower it or add years of growth.' };
    var W = (grown - keep) / K;
    function sim(mode, amt) {
      // mode 'infl': amt monthly spending raised yearly; 'flat': fixed; 'pct': amt = annual % of start-of-year balance
      var b = S, w = amt, out = 0, rows = [], ys = S, yw = 0, runOut = 0;
      for (var m = 0; m < n; m++) {
        if (m % 12 === 0) { if (m > 0) { if (mode === 'infl') w *= 1 + inf / 100; } if (mode === 'pct') w = b * amt / 100 / 12 * (1 - tax / 100); ys = b; yw = 0; }
        var g = w * gUp;
        if (b <= g + 1e-9) { out += b / gUp; yw += b; b = 0; runOut = m + 1; rows.push([String(Math.floor(m / 12) + 1), H.money0(ys), H.money0(yw), '$0']); break; }
        b = (b - g) * (1 + i); out += w; yw += g;
        if (m % 12 === 11) rows.push([String((m + 1) / 12), H.money0(ys), H.money0(yw), H.money0(b)]);
      }
      return { b: b, out: out, w: w, rows: rows, runOut: runOut };
    }
    var main = sim('infl', W);
    var flatW = (grown - keep) / (gUp * (Math.abs(i) < 1e-12 ? n : (Math.pow(1 + i, n) - 1) / i * (1 + i)));
    var rule = S * 0.04 / 12 * (1 - tax / 100), ruleRun = sim('infl', rule);
    var fx = sim('pct', 4);
    var today = Math.pow(1 + inf / 100, N);
    var rows = [];
    rows.push(['Yearly withdrawal, first year', H.money0(W * 12)]);
    if (tax > 0) rows.push(['Gross monthly withdrawal before tax', H.money0(W * gUp)]);
    rows.push(['First-year withdrawal rate', H.pct(W * 12 * gUp / S * 100, 2), true]);
    if (inf > 0) rows.push(['Monthly withdrawal in the final year', H.money0(main.w)]);
    rows.push(['Total withdrawn over the whole period', H.money0(main.out)]);
    if (inf !== 0) rows.push(['Flat withdrawal, no inflation raises', H.money0(flatW) + '/mo']);
    rows.push(['4% rule, raised with inflation', H.money0(rule) + '/mo: ' + (ruleRun.runOut ? 'runs out in year ' + Math.ceil(ruleRun.runOut / 12) : 'leaves ' + H.money0(ruleRun.b / today) + ' in today\'s $')]);
    rows.push(['Fixed 4% of balance each year', H.money0(S * 0.04 / 12 * (1 - tax / 100)) + '/mo now, ' + H.money0(fx.w) + '/mo in year ' + N]);
    return {
      value: H.money0(W) + '/mo',
      label: 'Most you can withdraw, raised ' + H.num(inf, 2) + '% a year',
      expr: H.money0(S) + ' over ' + N + ' yrs at ' + H.num(r, 2) + '%' + (keepReal ? ', leaving ' + H.money0(keepReal) : ''),
      rows: rows,
      w: W,
      rate: W * 12 * gUp / S * 100,
      sub: 'Start at ' + H.money0(W) + ' a month' + (inf > 0 ? ', raise it ' + H.num(inf, 2) + '% each year' : '') + ' and the savings ' + (keepReal ? 'end at ' + H.money0(keepReal) + ' in today\'s dollars' : 'reach $0') + ' after exactly ' + N + ' years.',
      table: { head: ['Year', 'Start balance', 'Withdrawn', 'End balance'], rows: main.rows, caption: 'Year-by-year drawdown at the maximum withdrawal' }
    };
  },
  notes: {
    'Yearly withdrawal, first year': 'Twelve months of the starting withdrawal you can spend.',
    'Gross monthly withdrawal before tax': 'What actually leaves the account so the after-tax amount is left to spend.',
    'First-year withdrawal rate': 'First-year gross withdrawals divided by savings. The 4% rule uses 4%.',
    'Monthly withdrawal in the final year': 'The starting withdrawal after every yearly inflation raise.',
    'Total withdrawn over the whole period': 'Every monthly withdrawal you spend, added up over all the years.',
    'Flat withdrawal, no inflation raises': 'The bigger fixed amount you could take if you never raise it.',
    '4% rule, raised with inflation': '4% of savings a year, raised with inflation, and how it ends at your return.',
    'Fixed 4% of balance each year': 'Taking 4% of whatever is left each year: it never runs out, but pay moves with markets.'
  },
  assumptions: 'These calculations are estimates. They assume the same return every year, withdrawals at the start of each month and inflation raises once a year, so there is no margin for a bad market early in retirement.',
  quick: ({ r }) => `A <strong>$1,000,000</strong> retirement portfolio earning 6% a year can pay out <strong>${r.value}</strong> ($50,337 in the first year), raised 3% every year for inflation, and run out exactly at the 30-year mark. That is a 5.03% starting withdrawal rate. The 4% rule's $3,333 a month is more cautious and, at a steady 6%, still leaves $485,909 in today's dollars.`,
  formulaTitle: 'How is the maximum withdrawal calculated?',
  formula: {
    expr: 'W = [ S × (1 + i)<sup>n</sup> − T × (1 + π)<sup>N</sup> ] ÷ K<br>K = value after n months of $1 a month taken at the start of each month, grossed up for tax and raised by π each year',
    vars: [['W', 'first-year monthly withdrawal you can spend'], ['S', 'savings today'], ['i', 'monthly return, (1 + annual return)<sup>1/12</sup> − 1'], ['n', 'number of months (years × 12)'], ['T', 'balance to leave, in today\'s dollars'], ['π', 'yearly inflation raise'], ['K', 'end value of a $1 withdrawal stream']],
    note: 'Because every later withdrawal is a fixed multiple of the first one, the ending balance falls in a straight line as W rises. That makes the answer exact rather than a trial-and-error estimate. Withdrawals come out at the start of each month, then the rest earns a month of return.'
  },
  example: `<p>Take $1,000,000, a 30-year horizon, a 6% return and 3% inflation, with nothing left over at the end.</p>
<p>Monthly return i = 1.06<sup>1/12</sup> − 1 = 0.4868%. Left untouched, the savings would grow to $1,000,000 × 1.06<sup>30</sup> = <strong>$5,743,491</strong>. A withdrawal stream that starts at $1 a month and rises 3% a year would, with the growth it gives up, have been worth $1,369.22 at the end. So the most you can take is $5,743,491 ÷ 1,369.22 = <strong>$4,195 a month</strong>.</p>
<p>In year 1 that is $50,337, and the balance still edges up to $1,008,042 because growth beats spending at first. The monthly draw climbs to $9,885 by year 30, and the account reaches $0 after the last payment. Altogether the plan pays out $2,394,787, of which $1,394,787 is investment return.</p>
<p>For a 401(k) taxed at 15%, the same savings support $3,566 a month of spending; the gross withdrawal is still $4,195.</p>`,
  table: {
    title: 'What is a safe monthly withdrawal from $1 million by retirement length?',
    intro: 'Maximum first-year monthly withdrawal from $1,000,000, raised 3% a year for inflation, that empties the account at the end of each horizon. Computed with the calculator above at steady returns.',
    head: ['Years to last', '3% return', '4% return', '5% return', '6% return', '7% return', 'Rate at 5%'],
    rows: ({ run, H }) => [15, 20, 25, 30, 35, 40, 45, 50].map(y => [String(y), ...[3, 4, 5, 6, 7].map(x => run({ savings: 1000000, years: y, ret: x, infl: 3, tax: 0, leave: 0 }).value.replace('/mo', '')), H.pct(run({ savings: 1000000, years: y, ret: 5, infl: 3, tax: 0, leave: 0 }).rate, 2)]),
    note: 'Scale to your savings: $500,000 supports half these amounts, $2,000,000 twice as much. "Rate at 5%" is the first-year withdrawal as a share of savings. These are break-even figures with no safety margin for bad markets.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>Six numbers set the most you can withdraw. The first four matter most; the last two are optional refinements.</p>
<h3>Retirement savings today</h3>
<p>Add up the savings you will draw from: 401(k), 403(b), traditional and Roth IRAs, brokerage accounts and any cash set aside for spending. Keep your emergency fund and home equity out unless you plan to sell.</p>
<h3>Years the money must last</h3>
<p>From 65, 30 years reaches age 95; retiring at 55 needs 40 or more. Choosing too short a horizon is the most common mistake, because the answer looks generous and the money ends while you are still alive.</p>
<h3>Annual return on savings</h3>
<p>Enter a long-run average return you could live with being wrong about. A balanced stock and bond portfolio is often modeled at 5–7% before inflation; mostly bonds and cash, 2–4%. One point matters: $1,000,000 supports $4,195 a month at 6% but $3,702 at 5%. A steady figure is a simplification; the <a href="/monte-carlo-retirement-calculator">Monte Carlo retirement calculator</a> shows how bumpy returns change the odds.</p>
<h3>Inflation raise</h3>
<p>Keep inflation on so the first-year amount keeps its buying power. Set it to 0 only if you are happy to spend the same dollar figure for decades: a flat withdrawal starts higher ($5,865 a month in the default example) but buys less every year.</p>
<h3>Tax rate on withdrawals</h3>
<p>Add your expected federal plus state rate if the money is in a pre-tax 401(k), 403(b) or traditional IRA. The answer then becomes what you can spend after tax. Use 0% for Roth money and a blended rate for a mix.</p>
<h3>Balance to leave</h3>
<p>Enter a legacy or safety cushion in today's dollars. The calculator grows it with inflation, so the account ends with the same buying power you entered. Leave it at 0 to spend the savings down to nothing.</p>`
    },
    {
      h2: 'What is the 4% rule, and is it still a good guide?',
      html: `<h3>Where the 4% rule comes from</h3>
<p>The 4% rule says to withdraw 4% of your portfolio in the first year of retirement and then raise that dollar amount each year by inflation. It comes from financial planner William Bengen's 1994 research on historical U.S. stock and bond returns, later extended by the 1998 "Trinity study" from three Trinity University professors. For portfolios with roughly half or more in stocks, a 4% start lasted 30 years in all or nearly all of the historical periods they studied; bond-heavy mixes did worse.</p>
<h3>How the 4% rule holds up at steady returns</h3>
<p>On $1,000,000 the rule gives $40,000 a year, or $3,333 a month. Run through this calculator at steady returns:</p>
<ul><li>At a 4% return it runs out in year 30.</li><li>At 5% it leaves $177,451 in today's dollars.</li><li>At 6% it leaves $485,909 in today's dollars.</li></ul>
<h3>Why this calculator allows more than 4%</h3>
<p>The calculator allows 5.03% at 6% because a steady return has no crashes. The 4% rule was sized to survive the worst historical starting years, such as 1966, when poor early returns and high inflation hit together. Treat this page's answer as the ceiling in an average market, and the 4% rule as a cushion for a bad one. To put a probability on the gap, run your plan through the <a href="/monte-carlo-retirement-calculator">Monte Carlo simulator</a>.</p>`
    },
    {
      h2: 'Fixed-percentage or inflation-adjusted withdrawals: which lasts longer?',
      html: `<p>There are three common ways to draw down a portfolio, and the calculator's result rows show each one for your inputs:</p>
<div class="twrap"><table><thead><tr><th>Method</th><th>Monthly, year 1</th><th>Monthly, year 30</th><th>Can it run out?</th></tr></thead><tbody>
<tr><td>Inflation-adjusted (this calculator's answer)</td><td>$4,195</td><td>$9,885</td><td>Yes, by design at year 30</td></tr>
<tr><td>Same dollar amount every year</td><td>$5,865</td><td>$5,865</td><td>Yes, at year 30</td></tr>
<tr><td>Fixed 4% of the balance each year</td><td>$3,333</td><td>$5,706</td><td>No</td></tr>
</tbody></table></div>
<p>Figures for $1,000,000 at a steady 6% and 3% inflation.</p>
<h3>Inflation-adjusted withdrawals</h3>
<p>Your spending keeps the same buying power every year, which is what most retirees want. The trade-off is that the dollar draw keeps rising even after a bad year in the markets.</p>
<h3>The same dollar amount every year</h3>
<p>A flat $5,865 looks better at first, but by year 30, after 29 yearly price rises of 3%, it buys what about $2,489 does today. It suits people with other income that rises with inflation, such as Social Security, covering most of their needs.</p>
<h3>A fixed percentage of the balance</h3>
<p>This method can never hit zero because it always takes a slice of what is left, yet your paycheck moves with the market: a 25% drop in the portfolio means a 25% pay cut the next year. The year-30 figure of $5,706 is worth about $2,421 in today's money.</p>
<h3>Blending the methods</h3>
<p>Many retirees use inflation-adjusted withdrawals with a rule to skip the raise, or trim 5–10%, after a losing year. That small flexibility is what lets a starting rate above 4% survive bad markets.</p>`
    },
    {
      h2: 'How much can I withdraw from my 401(k) or IRA each month after tax?',
      html: `<h3>Traditional 401(k), 403(b) and IRA money</h3>
<p>Money from a traditional 401(k), 403(b) or IRA is taxed as ordinary income when it comes out. Enter your expected federal plus state rate and the calculator returns what you can spend; the gross withdrawal stays the same. With $1,000,000 over 30 years at 6%:</p>
<ul><li>15% tax rate: $3,566 a month to spend, from a $4,195 gross withdrawal.</li><li>22% tax rate: $3,272 a month to spend.</li></ul>
<h3>Roth accounts</h3>
<p>Roth IRA withdrawals are generally tax-free once you are 59½ and the account has been open five years, so use 0% for Roth money and a blended rate for a mix.</p>
<h3>Early withdrawals and required minimums</h3>
<p>Taking money out before 59½ usually adds a 10% additional tax unless an exception applies; the <a href="/early-withdrawal-penalty-calculator">401(k) early withdrawal calculator</a> works that out. From 73 the IRS also sets a floor on what must come out of pre-tax accounts each year, which the <a href="/rmd-calculator">RMD calculator</a> shows. For a fuller picture of your tax bill, including Social Security, use the <a href="/retirement-tax-calculator">retirement tax calculator</a>.</p>`
    },
    {
      h2: 'How much can I withdraw and still leave money to my heirs?',
      html: `<p>Use the "leave a balance of" box. It is in today's dollars, so the calculator grows the target with inflation. Wanting $250,000 of today's buying power left after 30 years means the account must end near $606,816 in future dollars.</p>
<p>That goal lowers the safe monthly draw from $4,195 to <strong>$3,752</strong>, a 4.5% starting rate. Each $100,000 of legacy (in today's dollars) costs roughly $177 a month of spending in this example. If the legacy matters a lot, consider a separate account invested for growth or life insurance, so a bad market does not force a choice between your spending and your heirs.</p>`
    },
    {
      h2: 'What withdrawal rate works for an early retirement?',
      html: `<h3>Longer horizons need lower rates</h3>
<p>The longer the horizon, the more the answer depends on growth and the less on principal. At a 5% return with 3% raises, the break-even rate falls from 6.1% for 20 years to 4.44% for 30, 3.63% for 40 and 3.15% for 50 (see the table above). Someone retiring at 50 who plans to age 95 should start well under 4%, before adding any margin for poor markets.</p>
<h3>Turning a rate into a target or a timeline</h3>
<p>If you are still deciding when you could stop work, the <a href="/fire-calculator">FIRE number calculator</a> turns a withdrawal rate into a savings target. And if you already know what you want to spend and only need to know how many years it buys, that is the opposite question, answered by the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much can I withdraw monthly from $500,000 in retirement?', a: 'About $2,097 a month to start, raised 3% a year, lasts 30 years at a 6% return. Over 25 years the figure rises to $2,365 a month. Under the 4% rule it would be $1,667.' },
    { q: 'How much can I withdraw from $1 million in retirement?', a: '$4,195 a month at a steady 6% over 30 years with 3% raises, or $3,702 a month at 5%. The 4% rule gives $3,333 a month and leaves room for poor markets.' },
    { q: 'How much can I withdraw from $1.5 million in retirement?', a: 'About $6,292 a month to start, raised 3% a year, lasts 30 years at a steady 6% return. The 4% rule figure is $5,000 a month.' },
    { q: 'What can $2 million support in retirement?', a: 'At 6% for 30 years with 3% inflation raises, $2,000,000 supports $8,389 a month to start. The 4% rule figure is $6,667 a month.' },
    { q: 'How much monthly income will $300,000 give me?', a: 'About $1,258 a month for 30 years at 6% with 3% yearly raises. $400,000 gives about $1,678 a month on the same assumptions.' },
    { q: 'What is the 4% rule on $750,000?', a: '$30,000 in the first year, or $2,500 a month, raised with inflation after that. At a steady 6% return the calculator says $750,000 could support up to $3,146 a month over 30 years.' },
    { q: 'What is a safe withdrawal rate for a 40-year retirement?', a: 'About 3.6% or less. At a steady 5% return with 3% raises, the break-even starting rate over 40 years is 3.63%, compared with 4.44% over 30 years. Bad early markets call for a lower figure still.' },
    { q: 'How much can I withdraw from my 401(k) after taxes?', a: 'With $1,000,000 over 30 years at 6% and a 15% tax rate, you can spend $3,566 a month; the gross withdrawal is $4,195. At a 22% rate the spendable amount drops to $3,272 a month.' },
    { q: 'Why does this calculator allow more than 4%?', a: 'It assumes the same return every year, so there is no bad market early in retirement. The 4% rule was set to survive historical worst cases. Use this result as an upper limit and the 4% rule, or a Monte Carlo test, as the cautious figure.' },
    { q: 'What is the best retirement withdrawal strategy?', a: 'There is no single best one, but inflation-adjusted withdrawals that start near 4% and are trimmed after bad years suit most retirees. A fixed percentage of the balance never runs out but makes your income swing with markets; a flat dollar amount loses buying power each year.' },
    { q: 'What is a retirement drawdown or distribution plan?', a: 'It is the schedule for turning savings into income: how much comes out each month, from which accounts, and how the amount changes each year. This calculator sets the size of the draw; the year-by-year table under the result is the drawdown schedule.' },
    { q: 'Should I count Social Security in my savings?', a: 'No. Social Security and pensions are separate income streams that keep paying for life. Work out the gap between your spending and that income, then make sure the withdrawal here covers it. The <a href="/retirement-income-calculator">retirement income calculator</a> adds the pieces together.' },
    { q: 'How much more can I withdraw if I don\'t raise it for inflation?', a: 'On $1,000,000 at 6% over 30 years, a flat withdrawal can be $5,865 a month instead of $4,195 rising 3% a year. The flat amount loses about 3% of its buying power every year.' }
  ],
  related: ['how-long-will-money-last-calculator', 'monte-carlo-retirement-calculator', 'annuity-calculator', 'retirement-income-calculator', 'retirement-tax-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    { name: 'IRS: Topic no. 558, Additional tax on early distributions from retirement plans', url: 'https://www.irs.gov/taxtopics/tc558' },
    { name: 'IRS: Retirement topics, required minimum distributions (RMDs)', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds' },
    { name: 'Social Security Administration: Life Expectancy Calculator', url: 'https://www.ssa.gov/oact/population/longevity.html' }
  ],
  disclaimer: 'Assumes the same return every year. Not investment or tax advice; real markets vary and withdrawals should be reviewed yearly.'
};
