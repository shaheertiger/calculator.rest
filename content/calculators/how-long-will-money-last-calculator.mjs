export default {
  slug: 'how-long-will-money-last-calculator',
  hub: 'investing',
  name: 'How Long Will My Money Last Calculator',
  title: 'How Long Will My Money Last? $500K at $3,000/mo Lasts 18 Years',
  h1: 'How Long Will Your Savings Last? Withdrawal and Drawdown Calculator',
  meta: '$500,000 drawn at $3,000 a month, raised 3% a year for inflation and earning 6%, lasts 18 years. Enter your savings, withdrawals, return and taxes.',
  keyword: 'how long will my money last calculator',
  also: ['how long will my savings last calculator', 'how long will my money last retirement calculator', 'how long will my savings last calculator with inflation', 'how long retirement savings last calculator', 'how long will my money last calculator with taxes', 'how much can i withdraw without touching principal calculator', 'how long will retirement last calculator', 'how long will 500k last in retirement'],
  updated: '2026-11-13',
  inputs: [
    { id: 'savings', label: 'Savings today', type: 'number', value: 500000, prefix: '$' },
    { id: 'withdraw', label: 'Monthly withdrawal (spending)', type: 'number', value: 3000, prefix: '$', help: 'What you need to spend each month, after tax.' },
    { id: 'ret', label: 'Annual return on savings', type: 'number', value: 6, suffix: '%' },
    { id: 'infl', label: 'Raise withdrawals each year by (inflation)', type: 'number', value: 3, suffix: '%', help: 'Use 0 for a fixed withdrawal.' },
    { id: 'tax', label: 'Tax rate on withdrawals', type: 'number', value: 0, suffix: '%', help: 'For pre-tax 401(k)/IRA money; the calculator grosses up each withdrawal.' },
    { id: 'age', label: 'Your age now (optional)', type: 'number', value: 65, placeholder: 'e.g. 65' }
  ],
  compute(v, H) {
    var S = v.savings, W = v.withdraw;
    if (!(S > 0)) return { error: 'Enter how much you have saved.' };
    if (!(W > 0)) return { error: 'Enter how much you plan to withdraw each month.' };
    var r = isNaN(v.ret) ? 0 : v.ret, inf = isNaN(v.infl) ? 0 : v.infl, tax = v.tax > 0 && v.tax < 90 ? v.tax : 0;
    if (r <= -100) return { error: 'Enter a return above −100%.' };
    var i = Math.pow(1 + r / 100, 1 / 12) - 1;
    function sim(w0, keep) {
      var b = S, w = w0, m = 0, out = 0, gain = 0, yr = [], ys = S, yw = 0;
      while (m < 1200) {
        var g = w / (1 - tax / 100);
        if (b <= g + 1e-9) { var frac = b / g; out += b * (1 - tax / 100); yw += b; m += frac; b = 0; break; }
        b -= g; out += w; yw += g;
        var gr = b * i; b += gr; gain += gr; m++;
        if (m % 12 === 0) {
          if (keep) yr.push([String(m / 12), H.money0(ys), H.money0(yw), H.money0(b)]);
          ys = b; yw = 0; w *= 1 + inf / 100;
        }
      }
      if (keep && m % 12 !== 0) yr.push([String(Math.ceil(m / 12)), H.money0(ys), H.money0(yw), H.money0(b)]);
      return { m: m, out: out, gain: gain, w: w, b: b, yr: yr };
    }
    var s = sim(W, true);
    var forever = s.m >= 1200;
    var lo = 0, hi = S;
    for (var k = 0; k < 70; k++) { var mid = (lo + hi) / 2; if (sim(mid, false).m >= 360) lo = mid; else hi = mid; }
    var rows = [];
    if (!forever && v.age > 0 && v.age < 120) rows.push(['Money runs out at about age', H.num(Math.floor(v.age + s.m / 12), 0), true]);
    rows.push(['Total you withdraw (after tax)', H.money0(s.out)]);
    rows.push(['Investment growth earned', H.money0(s.gain)]);
    if (inf > 0) rows.push(['Monthly withdrawal in the final year', H.money0(s.w)]);
    rows.push(['Monthly withdrawal that lasts 30 years', H.money0(lo)]);
    if (tax > 0) rows.push(['Gross monthly withdrawal in year 1', H.money0(W / (1 - tax / 100))]);
    rows.push(['First-year withdrawal rate', H.pct(W * 12 / (1 - tax / 100) / S * 100, 2)]);
    return {
      value: forever ? '100+ years' : H.ym(s.m),
      label: forever ? 'Your savings outlast the calculation' : 'How long your savings last',
      expr: H.money0(S) + ' − ' + H.money0(W) + '/mo' + (inf ? ' (+' + H.num(inf, 2) + '%/yr)' : '') + ' at ' + H.num(r, 2) + '%',
      rows: rows,
      n: s.m,
      sub: forever ? 'Growth covers your withdrawals: the balance is still ' + H.money0(s.b) + ' after 100 years.' : (s.m >= 360 ? 'That covers a 30-year retirement.' : 'That is short of a 30-year retirement; ' + H.money0(lo) + ' a month would stretch it to 30 years.'),
      table: { head: ['Year', 'Start balance', 'Withdrawn', 'End balance'], rows: s.yr.slice(0, 60), caption: 'Year-by-year drawdown' }
    };
  },
  quick: ({ r }) => `<strong>$500,000</strong> lasts about <strong>${r.value}</strong> if you withdraw <strong>$3,000 a month</strong>, raise it 3% each year for inflation and earn 6% a year on what is left. A 65-year-old would run out around age 83. Cutting spending to <strong>$2,097 a month</strong> makes the same savings last 30 years.`,
  stepsTitle: 'How to work out how long your money will last',
  steps: [
    'Enter your total savings that will fund withdrawals (401(k), IRA, brokerage and cash you plan to spend down). Leave out your emergency fund.',
    'Enter the monthly amount you need from savings: your spending minus Social Security, pensions and other income. This is the number that matters, not total spending.',
    'Set a realistic return. A balanced stock and bond portfolio is often modeled at 5–7% a year before inflation; cash and CDs earn less.',
    'Keep inflation on. The most common mistake is holding withdrawals flat for decades: at 3% inflation, $3,000 of spending today costs about $5,100 a month in 18 years.',
    'If the money is in a pre-tax 401(k) or traditional IRA, add your tax rate so each withdrawal is grossed up to cover the tax.'
  ],
  formulaTitle: 'How does the calculator work it out?',
  formula: {
    expr: 'Each month: Balance = (Balance − Withdrawal ÷ (1 − tax)) × (1 + i)<br>i = (1 + annual return)<sup>1/12</sup> − 1 · Withdrawal × (1 + inflation) every 12 months',
    vars: [['Balance', 'savings left at the start of the month'], ['Withdrawal', 'monthly after-tax spending from savings'], ['tax', 'tax rate on withdrawals, as a decimal'], ['i', 'monthly return equivalent to the annual return']],
    note: 'Withdrawals are taken at the start of each month, which is slightly more conservative than end-of-month. With no inflation, the closed form is n = −ln(1 − B·i ÷ W) ÷ ln(1 + i) months, using end-of-month withdrawals. Returns are assumed steady; real markets are not.'
  },
  example: `<p>A retiree has $500,000, needs $3,000 a month from savings, expects 6% a year and 3% inflation.</p>
<p>Monthly return i = 1.06<sup>1/12</sup> − 1 = 0.487%. Month 1: ($500,000 − $3,000) × 1.00487 = $499,419. The withdrawal rises to $3,090 in year 2, $3,183 in year 3 and so on.</p>
<p>At first, growth (about $2,400 a month) almost covers the withdrawal, so the balance falls slowly. By year 10 the withdrawal is $3,914 a month and the balance is shrinking fast. The money runs out after <strong>18 years</strong>, having paid out $843,278 in total, of which $343,278 came from investment growth.</p>
<p>With no inflation raise, the same $3,000 a month would last 28 years 3 months.</p>`,
  table: {
    title: 'How long will $500,000 last at different withdrawals and returns?',
    intro: 'Years until $500,000 runs out with withdrawals raised 3% a year for inflation, computed by the calculator above.',
    head: ['Monthly withdrawal', '4% return', '5% return', '6% return', '7% return', '8% return'],
    rows: ({ run, H }) => [1500, 2000, 2500, 3000, 3500, 4000, 5000].map(w => [H.money0(w), ...[4, 5, 6, 7, 8].map(r => { const x = run({ savings: 500000, withdraw: w, ret: r, infl: 3, tax: 0 }); return x.n >= 1200 ? '100+ yrs' : H.fix(x.n / 12, 1) + ' yrs'; })]),
    note: '"100+ yrs" means growth keeps up with inflation-adjusted withdrawals indefinitely at that return. Scale the savings and withdrawal together: $1,000,000 at $6,000 a month lasts as long as $500,000 at $3,000.'
  },
  sections: [
    {
      h2: 'How long will $1 million last in retirement?',
      html: `<p>It depends mostly on how much you take out each month. With withdrawals raised 3% a year for inflation:</p>
<div class="twrap"><table><thead><tr><th>Monthly withdrawal</th><th>4% return</th><th>6% return</th><th>8% return</th></tr></thead><tbody>
<tr><td>$3,000</td><td>32.8 years</td><td>57.4 years</td><td>100+ years</td></tr>
<tr><td>$4,000</td><td>23.6 years</td><td>32.4 years</td><td>100+ years</td></tr>
<tr><td>$5,000</td><td>18.4 years</td><td>23.1 years</td><td>33.9 years</td></tr>
<tr><td>$6,000</td><td>15.1 years</td><td>18.0 years</td><td>23.1 years</td></tr>
<tr><td>$8,000</td><td>11.1 years</td><td>12.6 years</td><td>14.6 years</td></tr>
</tbody></table></div>
<p>The pattern to notice: once the first-year withdrawal reaches 6% of savings ($5,000 a month on $1 million), even an 8% return only stretches the money to about 34 years, and at 4% it is gone in about 18. At 3.6% or less ($3,000 a month), a decent return can make savings last for life.</p>`
    },
    {
      h2: 'Does the 4% rule still work?',
      html: `<p>The 4% rule says you can withdraw 4% of your savings in the first year of retirement, then raise that dollar amount with inflation each year, and have a high chance of the money lasting 30 years. It comes from studies of historical U.S. stock and bond returns in the 1990s, most famously by financial planner William Bengen.</p>
<p>In this calculator, $1,000,000 with a $3,333 monthly withdrawal (4% a year) and 3% inflation lasts 29.0 years at a 4% return, 34.7 years at 5% and 87.1 years at 7%. So the rule holds if your portfolio beats inflation by at least 1 to 2 points a year on average. It is a starting point, not a guarantee: it assumes a 30-year horizon, a mix of stocks and bonds, and spending that rises only with inflation. Retiring in your 50s, or holding mostly cash, calls for a lower rate, often 3–3.5%.</p>`
    },
    {
      h2: 'How does inflation change how long savings last?',
      html: `<p>A lot. Without inflation raises, $500,000 at $3,000 a month and 6% lasts <strong>28 years 3 months</strong>. With 3% yearly raises, it lasts <strong>18 years</strong>, ten years less. Inflation compounds against you: after 18 years at 3%, a $3,000 monthly budget has grown to about $5,100 just to buy the same things.</p>
<p>With a 0% return (cash under the mattress), the same plan lasts 13 years 11 months with flat withdrawals and only 11 years 9 months with inflation raises. Keeping at least part of retirement savings invested is what buys the extra years. To see how much prices have actually risen in past decades, use the <a href="/inflation-calculator">inflation calculator</a>.</p>`
    },
    {
      h2: 'How do taxes affect how long my money lasts?',
      html: `<p>Withdrawals from a traditional 401(k) or IRA are taxed as ordinary income, so to spend $3,000 you must withdraw more. At a 15% combined tax rate you need $3,529 a month, and the $500,000 example lasts about 14 years 8 months instead of 18 years. Roth accounts (after the five-year and age-59½ rules) and the principal in a taxable brokerage account are not taxed this way, so enter a lower blended rate if your savings are a mix.</p>
<p>From age 73 the IRS also requires minimum withdrawals from pre-tax accounts each year; the <a href="/rmd-calculator">RMD calculator</a> shows how much. Taking more than you need doesn't shorten how long the money lasts if you reinvest the extra in a taxable account, but the tax is due either way.</p>`
    },
    {
      h2: 'How much can I withdraw without touching the principal?',
      html: `<p>If you only want to spend the growth, withdraw no more than the return. On $500,000 earning 6% that is about <strong>$2,434 a month</strong> ($500,000 × the monthly rate of 0.487%). The balance stays at $500,000 in dollars, but it loses buying power every year.</p>
<p>To keep the principal intact <em>after inflation</em>, spend only the real return: (1.06 ÷ 1.03) − 1 = 2.91% a year, or about <strong>$1,200 a month</strong> to start, raised with inflation each year. Most retirees spend somewhere between the two and accept a slowly shrinking real balance.</p>`
    },
    {
      h2: 'What if the market drops early in retirement?',
      html: `<p>This calculator uses a steady average return. Real portfolios bounce around, and the order of returns matters once you are withdrawing: a 20% fall in the first two years forces you to sell more shares at low prices, and the portfolio may never recover even if the long-run average is the same. Planners call this sequence-of-returns risk.</p>
<p>Ways to soften it: keep one to three years of withdrawals in cash or short-term bonds, trim spending by 5–10% after a bad year, and delay Social Security to get a larger, inflation-adjusted benefit. Run the calculator at a return one or two points lower than you expect to see a stress-tested answer.</p>`
    }
  ],
  faq: [
    { q: 'How long will $500,000 last if I withdraw $2,000 a month?', a: 'With 3% yearly inflation raises it lasts about 32.4 years at a 6% return and 27.1 years at 5%. With a fixed $2,000 and 6%, it never runs out, because growth exceeds withdrawals.' },
    { q: 'How long will $300,000 last in retirement?', a: 'Withdrawing $2,000 a month with 3% inflation raises and a 5% return, $300,000 lasts about 14.5 years. At $1,500 a month it lasts longer; enter your own numbers above.' },
    { q: 'How long will $100,000 last?', a: 'At $1,000 a month, rising 3% a year, with a 5% return, $100,000 lasts about 9.2 years. With no inflation raise and no growth it would last 8 years 4 months.' },
    { q: 'Should I include Social Security in my savings?', a: 'No. Subtract Social Security and pension income from your monthly spending and enter only the gap you need from savings. Social Security has its own inflation adjustment and lasts for life.' },
    { q: 'What return should I assume in retirement?', a: 'Many planners use 4–6% a year for a balanced portfolio before inflation, and 2–4% for mostly bonds and cash. Use a conservative figure; overestimating the return is the fastest way to run out early.' },
    { q: 'How long should I plan for my money to last?', a: 'Plan for at least age 90 to 95. The Social Security Administration estimates that about one in three 65-year-olds today will live past 90, and one in seven past 95.' },
    { q: 'Does this calculator include required minimum distributions?', a: 'No. RMDs force money out of tax-deferred accounts but do not force you to spend it. If you reinvest what you don\'t need, how long your money lasts is unchanged apart from taxes.' },
    { q: 'Is it better to withdraw monthly or annually?', a: 'The difference is small. Withdrawing a year\'s spending at once means less money stays invested, so monthly withdrawals typically last a few months longer over a long retirement.' }
  ],
  related: ['retirement-calculator', 'rmd-calculator', 'inflation-calculator', 'social-security-calculator', 'fire-calculator'],
  sources: [
    { name: 'Social Security Administration: Life Expectancy Calculator', url: 'https://www.ssa.gov/oact/population/longevity.html' },
    { name: 'CFPB: Planning for retirement', url: 'https://www.consumerfinance.gov/consumer-tools/retirement/' },
    { name: 'IRS: Retirement topics, required minimum distributions (RMDs)', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds' }
  ],
  disclaimer: 'Uses a steady return for illustration. Not investment advice; actual returns vary from year to year.'
};
