export default {
  slug: 'monte-carlo-retirement-calculator',
  hub: 'income',
  name: 'Monte Carlo Retirement Calculator',
  meta: 'Estimate the odds your retirement savings last with our free Monte Carlo calculator. See your success rate, ending balances and spending for 90% odds.',
  intro: 'Plug in your savings, yearly spending, retirement length and how your portfolio behaves, and we\'ll run up to 5,000 random markets to show your chance of success, the range of ending balances and the spending that gives 90% odds.',
  keyword: 'monte carlo retirement calculator',
  also: ['monte carlo simulation retirement calculator', 'retirement calculator monte carlo', 'retirement calculator monte carlo simulation', 'free monte carlo retirement calculator', 'retirement calculator monte carlo analysis', 'retirement simulation calculator', 'monte carlo retirement withdrawal calculator', 'retirement monte carlo calculator'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'savings', label: 'Retirement savings today', type: 'number', value: 1000000, prefix: '$', help: '401(k), IRA, brokerage and cash you will live on. Leave out your emergency fund.' },
    { id: 'spend', label: 'Yearly spending from savings', type: 'number', value: 40000, prefix: '$', help: 'Taken at the start of each year and raised with inflation. Leave out Social Security and pension income.' },
    { id: 'years', label: 'Years the money must last', type: 'number', value: 30, suffix: 'years', help: 'From 65 to 95 is 30 years. Retiring earlier needs a longer horizon.' },
    { id: 'mean', label: 'Average annual return', type: 'number', value: 7, suffix: '%', help: 'Arithmetic average of yearly returns, before inflation.' },
    { id: 'vol', label: 'Volatility (standard deviation of returns)', type: 'number', value: 12, suffix: '%', help: 'How much yearly returns swing around the average. Higher for stock-heavy portfolios, lower for bond-heavy ones.' },
    { id: 'infl', label: 'Inflation', type: 'number', value: 3, suffix: '%', help: 'Your spending rises by this much every year. 2–3% is a common long-run assumption.' },
    { id: 'sims', label: 'Number of simulations', type: 'number', value: 1000, help: 'Up to 5,000. The same inputs always give the same answer.' },
    { id: 'age', label: 'Your age at retirement (optional)', type: 'number', value: 65, placeholder: 'e.g. 65', help: 'Used only to show the age at which failed runs ran out.' }
  ],
  compute(v, H) {
    var S = v.savings, W = v.spend, N = Math.round(v.years);
    if (!(S > 0)) return { error: 'Enter your retirement savings.' };
    if (!(W >= 0)) return { error: 'Enter how much you plan to spend from savings each year.' };
    if (!(N >= 1 && N <= 60)) return { error: 'Enter a retirement length from 1 to 60 years.' };
    var mu = isNaN(v.mean) ? 0 : v.mean / 100, sd = isNaN(v.vol) ? 0 : v.vol / 100, inf = isNaN(v.infl) ? 0 : v.infl / 100;
    if (sd < 0 || sd > 0.6) return { error: 'Enter a volatility between 0% and 60%.' };
    if (mu <= -0.5 || mu > 0.3) return { error: 'Enter an average return between −50% and 30%.' };
    if (inf <= -0.5 || inf > 0.3) return { error: 'Enter an inflation rate between −50% and 30%.' };
    var M = Math.round(v.sims); if (!(M >= 100)) M = 1000; if (M > 5000) M = 5000;
    // Seeded PRNG (mulberry32) + Box–Muller, so the page and the server agree.
    var seed = 20261124 >>> 0;
    function rnd() { seed = (seed + 0x6D2B79F5) >>> 0; var t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
    var R = new Array(M * N), spare = null;
    for (var k = 0; k < M * N; k++) {
      var z;
      if (spare !== null) { z = spare; spare = null; } else {
        var u1 = rnd(), u2 = rnd(); if (u1 < 1e-12) u1 = 1e-12;
        var mag = Math.sqrt(-2 * Math.log(u1)); z = mag * Math.cos(2 * Math.PI * u2); spare = mag * Math.sin(2 * Math.PI * u2);
      }
      R[k] = Math.max(-0.95, mu + sd * z);
    }
    function sim(w0, keep) {
      var ok = 0, ends = keep ? [] : null, fails = keep ? [] : null;
      for (var s = 0; s < M; s++) {
        var b = S, w = w0, failed = 0;
        for (var y = 0; y < N; y++) {
          if (b < w) { failed = y; b = 0; break; }
          b = (b - w) * (1 + R[s * N + y]); w *= 1 + inf;
        }
        if (b > 0 || (failed === 0 && w0 === 0)) ok++; else if (keep) fails.push(failed);
        if (keep) ends.push(b);
      }
      return { ok: ok, ends: ends, fails: fails };
    }
    var res = sim(W, true), p = res.ok / M * 100, defl = Math.pow(1 + inf, N);
    var q = function (x) { return H.money0(H.quantile(res.ends, x) / defl); };
    // steady-return path for comparison
    var b = S, w = W, steadyOut = 0, g = mu;
    for (var y = 0; y < N; y++) { if (b < w) { steadyOut = y; b = 0; break; } b = (b - w) * (1 + g); w *= 1 + inf; }
    // spending that gives a 90% success rate (same random paths)
    var lo = 0, hi = S;
    for (var it = 0; it < 30; it++) { var mid = (lo + hi) / 2; if (sim(mid, false).ok / M >= 0.9) lo = mid; else hi = mid; }
    var rows = [];
    rows.push(['Runs that lasted the full period', H.int(res.ok) + ' of ' + H.int(M)]);
    rows.push(['10th percentile ending balance (today\'s $)', q(0.1)]);
    rows.push(['Median ending balance (today\'s $)', q(0.5), true]);
    rows.push(['90th percentile ending balance (today\'s $)', q(0.9)]);
    if (res.fails.length) {
      var mf = H.median(res.fails);
      rows.push(['Failed runs: median time until money runs out', H.num(mf, 1) + ' years' + (v.age > 0 && v.age < 110 ? ' (age ' + H.num(v.age + mf, 1) + ')' : '')]);
    }
    rows.push(['Same plan at a steady average return', steadyOut ? 'runs out in year ' + (steadyOut + 1) : 'lasts, ending at ' + H.money0(b / defl)]);
    rows.push(['First-year withdrawal rate', H.pct(W / S * 100, 2)]);
    rows.push(['Spending for a 90% success rate', H.money0(lo) + '/yr (' + H.pct(lo / S * 100, 2) + ')']);
    return {
      value: H.pct(p, 1),
      label: 'Chance your savings last ' + N + ' years',
      expr: H.int(M) + ' runs · ' + H.money0(W) + '/yr from ' + H.money0(S) + ' · ' + H.num(mu * 100, 2) + '% ± ' + H.num(sd * 100, 2) + '%',
      rows: rows,
      p: p,
      safe: lo,
      sub: p >= 90 ? 'Your savings lasted all ' + N + ' years in ' + H.pct(p, 1) + ' of simulated markets, a high success rate.' : p >= 75 ? 'Your savings lasted all ' + N + ' years in ' + H.pct(p, 1) + ' of simulated markets, which is workable if you trim spending after bad years; about 1 run in ' + Math.max(2, Math.round(100 / (100 - p))) + ' ran out.' : 'Your savings ran out in ' + H.pct(100 - p, 1) + ' of simulated markets, which is risky; spending ' + H.money0(lo) + ' a year would raise the odds of lasting ' + N + ' years to 90%.'
    };
  },
  notes: {
    'Runs that lasted the full period': 'Simulated markets in which every year of spending was paid in full.',
    '10th percentile ending balance (today\'s $)': 'One run in ten ended with less than this; $0 means over 10% ran out.',
    'Median ending balance (today\'s $)': 'The middle outcome: half the runs ended with more, half with less.',
    '90th percentile ending balance (today\'s $)': 'One run in ten ended with more than this, after strong markets.',
    'Failed runs: median time until money runs out': 'Among runs that ran dry, the typical number of years spending was paid.',
    'Same plan at a steady average return': 'What a calculator with no ups and downs would show for the same plan.',
    'First-year withdrawal rate': 'First-year spending divided by savings. The 4% rule uses 4%.',
    'Spending for a 90% success rate': 'The first-year spending that lasts the full period in 9 of 10 runs.'
  },
  assumptions: 'These calculations are estimates. They assume normally distributed, independent yearly returns, a fixed inflation rate and spending taken at the start of each year that never flexes after bad markets.',
  quick: ({ r }) => `In 1,000 simulated markets averaging 7% a year with 12% volatility, <strong>$1,000,000</strong> paying for <strong>$40,000 a year</strong> of spending (the 4% rule, raised 3% a year for inflation) lasted the full 30 years in <strong>${r.value}</strong> of runs. The median run finished with $516,487 in today's dollars. Spending $33,362 a year instead lifts the success rate to 90%.`,
  formulaTitle: 'How does the Monte Carlo simulation work?',
  formula: {
    expr: 'For each run and each year t: R<sub>t</sub> = μ + σ × Z<sub>t</sub>, Z<sub>t</sub> ~ Normal(0, 1)<br>Balance<sub>t+1</sub> = (Balance<sub>t</sub> − Spending × (1 + π)<sup>t</sup>) × (1 + R<sub>t</sub>)<br>Success rate = runs that pay every year in full ÷ total runs',
    vars: [['μ', 'average (arithmetic) annual return'], ['σ', 'volatility, the standard deviation of annual returns'], ['Z', 'a standard normal random number, from a seeded mulberry32 generator and the Box–Muller transform'], ['π', 'inflation; spending rises by this much every year']],
    note: 'Spending is taken at the start of each year. Returns are floored at −95% so a balance cannot go negative from a single draw. Ending balances are divided by (1 + π)<sup>years</sup> to show them in today\'s dollars, and runs that ran out count as $0.'
  },
  example: `<p>Default plan: $1,000,000, $40,000 of spending in year 1 rising 3% a year, 30 years, returns averaging 7% with a 12% standard deviation.</p>
<p>Each of the 1,000 runs draws 30 random annual returns. A typical year lands between −5% and +19% (one standard deviation either side of 7%), and about one year in six falls below −5%. Then the calculator steps through the years: take out the spending, apply that year's return, raise the spending 3%.</p>
<p>Result: <strong>783 of 1,000 runs</strong> paid all 30 years, a <strong>78.3%</strong> success rate. Ending balances in today's dollars were $0 at the 10th percentile, $516,487 at the median and $2,438,157 at the 90th percentile. In the 217 runs that failed, the median run paid 24 years of spending before running dry, which is age 89 for someone retiring at 65.</p>
<p>The same plan with a steady 7% every year never runs out and ends at $850,470 in today's dollars. That gap is the cost of volatility and of bad luck in the order of returns.</p>`,
  table: {
    title: 'What are the odds my savings last at each withdrawal rate?',
    intro: 'Share of 1,000 simulated runs that lasted the full period, by first-year withdrawal rate (raised 3% a year for inflation) and length of retirement. Returns average 7% with 12% volatility. Computed with the calculator above.',
    head: ['Withdrawal rate', '20 years', '25 years', '30 years', '35 years', '40 years'],
    rows: ({ run, H }) => [3, 3.5, 4, 4.5, 5, 5.5, 6].map(w => [H.pct(w, 1), ...[20, 25, 30, 35, 40].map(y => run({ savings: 1000000, spend: w * 10000, years: y, mean: 7, vol: 12, infl: 3, sims: 1000 }).value)]),
    note: 'With 1,000 runs, each figure can move a point or two with a different random seed. A 3% start over 30 years succeeded in 94.4% of runs; 5% in about half.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>A Monte Carlo test needs the same basics as any retirement plan, plus one number most calculators skip: volatility.</p>
<h3>Retirement savings today</h3>
<p>Enter the savings you will live on: 401(k), 403(b), IRAs, brokerage accounts and cash set aside for spending. Leave out your emergency fund and home equity.</p>
<h3>Yearly spending from savings</h3>
<p>Use spending minus Social Security and pension income, not total spending. If you spend $70,000 a year and Social Security pays $30,000, enter $40,000. The calculator takes it at the start of each year and raises it with inflation.</p>
<h3>Years the money must last</h3>
<p>A plan that starts at 65 and must reach 95 needs 30. Each extra year lowers the odds: the default plan succeeds in 87.8% of runs over 25 years but only 57.6% over 40.</p>
<h3>Average annual return</h3>
<p>Enter the arithmetic average of yearly returns for your mix, after fund fees and before inflation. Overstating it is the most common mistake; dropping the default from 7% to 6% cuts the success rate from 78.3% to 65.7%.</p>
<h3>Volatility</h3>
<p>Volatility is the step people skip: two portfolios with the same 7% average can have very different odds if one swings twice as hard. Stock-heavy portfolios have higher volatility than bond-heavy ones.</p>
<h3>Inflation</h3>
<p>Spending rises by this rate every year. At 2% the default plan succeeds 86.9% of the time; at 4%, 65.5%.</p>
<h3>Number of simulations and age</h3>
<p>Leave the simulation count at 1,000 for a quick answer or raise it to 5,000 for a steadier one. The random draws are seeded, so the same inputs always return the same result. Your age is optional and only labels when failed runs ran out. Read the success rate together with the 10th percentile balance and the spending level that gets you to 90%, then adjust and run it again.</p>`
    },
    {
      h2: 'What is sequence-of-returns risk?',
      html: `<p>It is the danger that bad years arrive early, while you are withdrawing. Before retirement the order of returns doesn't matter: a 30-year set of returns gives the same final balance in any order. Once money is coming out, losses in the first few years force you to sell more shares at low prices, and those shares are not there for the recovery.</p>
<h3>Same returns, different order</h3>
<p>A computed example with $1,000,000 and $40,000 of spending rising 3% a year. Both retirees get exactly the same 30 annual returns: one year of −20%, one of −15% and 28 years of +8%. Only the order differs.</p>
<div class="twrap"><table><thead><tr><th></th><th>Losses in years 1–2</th><th>Losses in years 29–30</th></tr></thead><tbody>
<tr><td>Balance after 2 years</td><td>$617,780</td><td>$1,075,248</td></tr>
<tr><td>Outcome after 30 years</td><td>Money runs out after 25 years</td><td>$2,004,396 left ($825,785 in today's dollars)</td></tr>
</tbody></table></div>
<h3>Why a steady-return calculator misses it</h3>
<p>Without withdrawals, either order compounds at 6.07% a year. With them, one retiree is broke at 90 and the other leaves a fortune. A steady-return calculator cannot show this; a Monte Carlo test samples thousands of orderings, which is why its answer is more cautious than the <a href="/retirement-withdrawal-calculator">retirement withdrawal calculator</a> for the same average return.</p>`
    },
    {
      h2: 'What is a good Monte Carlo success rate for retirement?',
      html: `<p>There is no official standard, and 100% is not the goal. A plan that never fails in any simulated market usually means you are spending less than you could and will die with a large balance. A low figure means a real chance of running short in your 80s or 90s.</p>
<h3>Why 75–90% is more comfortable than it sounds</h3>
<p>First, "failure" here means the money ran out under rigid spending; real retirees cut back after a crash, and even a 10% trim in bad years lifts the odds noticeably. Second, Social Security keeps paying after a portfolio is exhausted, so failure rarely means zero income.</p>
<h3>Using the 90% spending level as a guardrail</h3>
<p>Use the "spending for a 90% success rate" row as a guardrail. In the default plan it is $33,362 a year, or 3.34% of savings: spend near that in a weak market and allow yourself more after strong years.</p>
<h3>Ways to raise your odds</h3>
<ul><li><strong>Spend a little less.</strong> Cutting the default plan from $40,000 to $35,000 a year lifts success from 78.3% to 87.4%; $30,000 gets 94.4%.</li><li><strong>Shorten the horizon.</strong> Working a few more years both adds savings and cuts years of withdrawals: 25 years instead of 30 succeeds 87.8% of the time.</li><li><strong>Delay Social Security.</strong> A larger, inflation-adjusted benefit means less has to come from the portfolio. The <a href="/social-security-calculator">Social Security calculator</a> shows the trade-off.</li></ul>`
    },
    {
      h2: 'How does volatility change the probability of success?',
      html: `<p>Holding the average return at 7% and changing only the volatility, the default plan ($1,000,000, $40,000 a year, 30 years) gives:</p>
<div class="twrap"><table><thead><tr><th>Volatility</th><th>Success rate</th><th>Median ending balance (today's $)</th></tr></thead><tbody>
<tr><td>6%</td><td>97.7%</td><td>$747,782</td></tr>
<tr><td>9%</td><td>87.9%</td><td>$646,785</td></tr>
<tr><td>12%</td><td>78.3%</td><td>$516,487</td></tr>
<tr><td>15%</td><td>68.9%</td><td>$341,317</td></tr>
<tr><td>18%</td><td>60.4%</td><td>$203,780</td></tr>
</tbody></table></div>
<h3>Volatility drag</h3>
<p>Volatility drags down compound growth. A portfolio averaging 7% with 12% swings compounds at roughly 7% − ½ × 12%² ≈ 6.3% a year; at 18% swings it compounds near 5.4%.</p>
<h3>Testing return and volatility together</h3>
<p>In practice stock-heavy portfolios have both a higher average and higher volatility, so test the pair together: 9% with 18% volatility succeeds 78.1% of the time, almost the same as 7% with 12%, but with a much wider spread of outcomes.</p>`
    },
    {
      h2: 'How accurate is a Monte Carlo retirement simulation?',
      html: `<p>It is a better stress test than a single average, but it is still a model, and this one makes simplifying choices you should know about.</p>
<h3>What the model leaves out</h3>
<ul><li><strong>Normal returns understate crashes.</strong> Real annual returns have fatter tails than a bell curve: years like 2008 happen more often than a normal distribution with the same volatility predicts. Treat the success rate as optimistic and keep a margin.</li><li><strong>Each year is independent.</strong> The model has no long bear markets, no rebounds after crashes, and no link between inflation and returns. Periods such as the 1970s, when high inflation and weak returns hit together, produced the worst outcomes in historical studies and set the limit for the 4% rule.</li><li><strong>Inflation is fixed</strong> at the rate you enter, and spending never flexes.</li><li><strong>No taxes or fees.</strong> Enter returns after fund fees, and spending that includes the tax on withdrawals.</li></ul>
<h3>Sampling noise</h3>
<p>The default plan scores 78.3% with 1,000 runs and 75.9% with 5,000. Differences of a point or two between plans don't mean much.</p>
<h3>When to use a simpler tool</h3>
<p>For a single deterministic projection with a year-by-year table, the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a> is simpler. To size the nest egg in the first place, start with the <a href="/retirement-calculator">retirement savings calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is a Monte Carlo retirement simulation?', a: 'It runs your plan through hundreds or thousands of random sequences of market returns and reports the share in which your money lasted. Here, $1,000,000 paying $40,000 a year, raised for inflation, lasted 30 years in 78.3% of 1,000 runs.' },
    { q: 'Does the 4% rule pass a Monte Carlo test?', a: 'With a 7% average return and 12% volatility, a 4% start raised 3% a year lasted 30 years in 78.3% of 1,000 runs here. Over 25 years the rate was 87.8%, and over 40 years only 57.6%.' },
    { q: 'What is the success rate for a 5% withdrawal rate?', a: 'About 51.4% over 30 years, with a 7% average return, 12% volatility and 3% inflation. Starting at 5% is close to a coin flip once returns vary from year to year.' },
    { q: 'Is a 3% withdrawal rate safe?', a: 'It is much safer: a 3% start raised 3% a year lasted 30 years in 94.4% of 1,000 runs with a 7% average return and 12% volatility.' },
    { q: 'What are the odds $1 million lasts 40 years?', a: 'At $40,000 a year raised with inflation, 57.6% in this simulation. Spending about $27,652 a year to start brings the odds to 90% over 40 years.' },
    { q: 'How many simulations does a Monte Carlo retirement calculator need?', a: '1,000 is enough for a working answer; the result typically moves a point or two with more runs. For the default plan, 5,000 runs give 75.9% versus 78.3% with 1,000. This page caps runs at 5,000 so it stays fast in your browser.' },
    { q: 'Why does the same plan give the same answer every time?', a: 'The random numbers come from a seeded generator, so identical inputs always produce identical market paths. That lets you change one input and see its effect without the noise of a fresh random draw.' },
    { q: 'What does the 10th percentile ending balance mean?', a: 'One run in ten ended with less than this amount. In the default plan it is $0, meaning more than 10% of runs ran out of money before the 30 years were up.' },
    { q: 'Are the ending balances in today\'s dollars?', a: 'Yes. Each ending balance is divided by the cumulative inflation over the period, so $516,487 means the buying power of $516,487 today, not the nominal figure in 30 years.' },
    { q: 'What success rate should I aim for?', a: 'There is no official target. Many people plan for a high probability and agree in advance to cut spending after bad years. The "spending for a 90% success rate" row shows how much you can spend for that level of confidence: $33,362 a year on $1,000,000 in the default plan.' },
    { q: 'How does inflation affect my odds?', a: 'Strongly, because spending rises every year. The default plan succeeds 86.9% of the time at 2% inflation, 78.3% at 3% and 65.5% at 4%.' },
    { q: 'Should I include Social Security?', a: 'Not as savings. Subtract Social Security and pensions from your yearly spending and enter only what the portfolio must supply. The <a href="/retirement-income-calculator">retirement income calculator</a> adds those sources together.' },
    { q: 'What average return and volatility should I enter?', a: 'Use figures for your actual mix after fees. Stock-heavy portfolios have a higher average and much higher volatility than bond-heavy ones. If unsure, try a cautious pair, such as 6% and 12%, which gives 65.7% for the default plan.' }
  ],
  related: ['retirement-withdrawal-calculator', 'how-long-will-money-last-calculator', 'retirement-income-calculator', 'retirement-calculator', 'annuity-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Asset allocation and diversification', url: 'https://www.investor.gov/introduction-investing/getting-started/asset-allocation' },
    { name: 'FINRA: Risk', url: 'https://www.finra.org/investors/investing/investing-basics/risk' },
    { name: 'Social Security Administration: Life Expectancy Calculator', url: 'https://www.ssa.gov/oact/population/longevity.html' },
    { name: 'CFPB: Planning for retirement', url: 'https://www.consumerfinance.gov/consumer-tools/retirement/' }
  ],
  disclaimer: 'Uses normally distributed, independent annual returns, which understate the chance of extreme years. Not investment advice.'
};
