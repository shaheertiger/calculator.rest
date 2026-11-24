export default {
  slug: 'roth-ira-calculator',
  hub: 'planning',
  name: 'Roth IRA Calculator',
  meta: 'Estimate your Roth IRA at retirement with our free Roth IRA calculator. See your tax-free balance, its edge over a taxable account and the 5-year rule date.',
  intro: 'Plug in your age, current Roth IRA balance, yearly contribution and expected return, and we\'ll show you the tax-free balance you will have, how much more that is than a taxable account and when the 5-year rule lets earnings out tax-free.',
  keyword: 'roth ira retirement calculator',
  also: ['roth retirement calculator', 'roth ira calculator retirement', 'roth calculator retirement', 'retirement calculator roth ira', 'roth ira calculator retirement calculator', 'retirement calculator for roth ira', 'retirement roth ira calculator', 'calculate my roth ira at retirement', 'roth calculator balance at retirement', 'roth ira retirement savings calculator'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Your age now', type: 'number', value: 30, help: 'Your age today. It decides when the $1,100 catch-up starts.' },
    { id: 'retAge', label: 'Age you start withdrawing', type: 'number', value: 65, help: 'When you expect to begin taking money out; contributions stop the year before.' },
    { id: 'bal', label: 'Roth IRA balance today', type: 'number', value: 10000, prefix: '$', help: 'The combined value of all your Roth IRAs on your latest statements. Enter 0 if you are opening one.' },
    { id: 'basis', label: 'Of which your own contributions', type: 'number', value: 8000, prefix: '$', help: 'Contributions (not earnings) can come out any time, tax- and penalty-free.' },
    { id: 'contrib', label: 'Yearly contribution', type: 'number', value: 7500, prefix: '$', help: '2026 limit: $7,500, or $8,600 at 50+. Lower if your income is in the phase-out range.' },
    { id: 'catchup', label: 'Add the $1,100 catch-up from age 50', type: 'checkbox', value: true, help: 'Raises a maximum contribution to $8,600 a year from the year you turn 50.' },
    { id: 'ret', label: 'Annual return', type: 'number', value: 7, suffix: '%', help: 'Average yearly growth, dividends included. 6–7% is a common long-run figure for a stock-heavy mix.' },
    { id: 'first', label: 'Year of your first Roth IRA contribution', type: 'number', value: 2026, help: 'Starts the 5-year clock for tax-free earnings.' },
    { id: 'div', label: 'Taxable account: yearly dividends', type: 'number', value: 2, suffix: '% of balance', help: 'Taxed every year in a regular brokerage account.' },
    { id: 'tax', label: 'Tax rate on dividends and capital gains', type: 'number', value: 15, suffix: '%', help: '0%, 15% or 20% federal for qualified dividends and long-term gains, plus any state tax.' }
  ],
  data: { limit: 7500, cu: 1100, year: 2026, wr: 4 },
  compute(v, H, D) {
    if (!(v.age >= 0) || !(v.age < 100)) return { error: 'Enter your current age.' };
    if (!(v.retAge > v.age) || v.retAge > 110) return { error: 'Enter a withdrawal age above your current age.' };
    if (!(v.contrib >= 0)) return { error: 'Enter your yearly contribution (0 is fine).' };
    var r = isNaN(v.ret) ? 0 : v.ret / 100, t = v.tax > 0 && v.tax < 100 ? v.tax / 100 : 0, dy = v.div > 0 ? v.div / 100 : 0;
    if (r <= -1) return { error: 'Enter a return above −100%.' };
    if (dy > r && r >= 0) dy = r;
    var start = v.bal > 0 ? v.bal : 0;
    var basis0 = v.basis >= 0 ? Math.min(v.basis, start) : start;
    var years = Math.round(v.retAge - v.age);
    var roth = start, tx = start, txBasis = start, put = 0, capped = false;
    for (var i = 0; i < years; i++) {
      var a = Math.round(v.age) + i;
      var lim = D.limit + (v.catchup && a >= 50 ? D.cu : 0);
      var c = v.contrib;
      if (v.catchup && a >= 50 && c >= D.limit) c = c + D.cu;
      if (c > lim) { c = lim; capped = true; }
      put += c;
      roth = (roth + c) * (1 + r);
      var dv = (tx + c) * dy;
      tx = (tx + c) * (1 + r) - dv * t;
      txBasis += c + dv * (1 - t);
    }
    var txAfter = tx - Math.max(0, tx - txBasis) * t;
    var contribs = basis0 + put, earn = roth - contribs;
    var firstYr = v.first > 1990 ? Math.round(v.first) : D.year;
    var clockAge = v.age + (firstYr + 5 - D.year);
    var qualAge = Math.max(59.5, clockAge);
    var adv = roth - txAfter;
    var rows = [
      ['Same money in a taxable account, after tax', H.money0(txAfter)],
      ['Roth advantage', H.money0(adv) + ' (' + H.pct(txAfter > 0 ? adv / txAfter * 100 : 0, 1) + ' more)', true],
      ['Tax-free monthly income at 4%', H.money0(roth * D.wr / 100 / 12)],
      ['Your contributions (withdraw any time)', H.money0(contribs)],
      ['Earnings (tax-free once qualified)', H.money0(earn)],
      ['Earnings become tax-free from', clockAge > 59.5 ? 'Age ' + H.num(Math.ceil(clockAge), 0) + ' (5-year rule)' : 'Age 59½']
    ];
    var sub = capped ? 'Your contribution is above the IRS limit for your age in some years, so it was capped at ' + H.money0(D.limit) + ' (' + H.money0(D.limit + D.cu) + ' at 50+). High earners may be limited further by MAGI.'
      : 'Every dollar of the ' + H.money0(roth) + ' can come out tax-free after 59½ and five years, versus ' + H.money0(txAfter) + ' left from a taxable account after dividend and capital gains tax.';
    return {
      value: H.money0(roth),
      label: 'Tax-free Roth IRA balance at ' + H.num(v.retAge, 0),
      expr: H.money0(start) + ' + ' + H.money0(put) + ' contributed over ' + years + ' yrs at ' + H.num(r * 100, 2) + '%',
      rows: rows,
      sub: sub,
      tx: txAfter, adv: adv, contribs: contribs, earn: earn, put: put, mo: roth * D.wr / 100 / 12
    };
  },
  notes: {
    'Same money in a taxable account, after tax': 'The same deposits in a brokerage account, after yearly dividend tax and tax on the gain at sale.',
    'Roth advantage': 'The Roth balance minus the taxable account\'s after-tax value.',
    'Tax-free monthly income at 4%': 'The Roth balance × 4% ÷ 12; qualified withdrawals owe no income tax.',
    'Your contributions (withdraw any time)': 'Your basis: money you put in, which can come out at any age without tax or penalty.',
    'Earnings (tax-free once qualified)': 'Growth above your contributions, tax-free after 59½ and the 5-year rule.',
    'Earnings become tax-free from': 'The later of age 59½ and five tax years after your first Roth IRA contribution.'
  },
  assumptions: 'These calculations are estimates. They assume contributions at the start of each year, the same return every year, 2026 contribution limits held flat and one flat tax rate on dividends and gains in the taxable account. Income limits can lower what you may contribute.',
  quick: ({ r }) => `A Roth IRA retirement calculator shows what tax-free growth is worth. A 30-year-old with $10,000 in a Roth IRA who contributes the 2026 maximum of $7,500 a year, rising to $8,600 at 50, and earns 7% has <strong>${r.value}</strong> at 65, all tax-free after 59½. The same money in a taxable account nets ${r.rows[0][1]} after 15% tax on dividends and gains.`,
  formulaTitle: 'How does the Roth vs taxable comparison work?',
  formula: {
    expr: 'Roth: Balance = (Balance + Contribution) × (1 + r), no tax ever on qualified withdrawals<br>Taxable: Balance = (Balance + Contribution) × (1 + r) − Dividends × tax · Basis += Contribution + Dividends × (1 − tax)<br>Taxable after sale = Balance − (Balance − Basis) × tax',
    vars: [['r', 'total annual return, dividends included'], ['Dividends', '(Balance + Contribution) × dividend yield, taxed the year they are paid'], ['Basis', 'what you have already paid tax on; only the gain above it is taxed at sale'], ['Contribution', 'the same after-tax dollars in both accounts, capped at $7,500 ($8,600 at 50+)']],
    note: 'Contributions are made at the start of each year, with 2026 limits held flat. The comparison assumes qualified dividends and long-term gains at one flat rate.'
  },
  example: `<p>Sam is 30, already has $10,000 in a Roth IRA ($8,000 of it contributions) and plans to put in $7,500 every year, raising it to $8,600 from 50, until 65. He expects 7% a year.</p>
<p><strong>Contributions:</strong> 20 years × $7,500 + 15 years × $8,600 = $279,000, plus the $8,000 already in, for <strong>$287,000</strong> of basis.</p>
<p><strong>At 65:</strong> the Roth holds <strong>$1,245,694</strong>. Of that, $958,694 is earnings, and none of it is taxed because Sam is past 59½ and his first contribution was more than five years earlier. At 4% a year that is $4,152 a month, tax-free.</p>
<p><strong>The taxable alternative:</strong> the same deposits in a brokerage account paying a 2% dividend, taxed at 15% each year and on the gain at sale, leave $1,064,289. The Roth's edge is <strong>$181,404</strong>, about 17%.</p>`,
  table: {
    title: 'How much does a Roth IRA beat a taxable account over time?',
    intro: 'Sam\'s plan ($10,000 start, $7,500 a year, $8,600 from 50, 7% return, 2% dividends, 15% tax) stopped after different numbers of years, from the calculator above.',
    head: ['Years invested', 'Roth IRA (tax-free)', 'Taxable, after tax', 'Roth advantage'],
    rows: ({ run }) => [5, 10, 15, 20, 25, 30, 35, 40].map(y => {
      const r = run({ retAge: 30 + y });
      return [String(y), r.value, r.rows[0][1], r.rows[1][1]];
    }),
    note: 'The gap widens every year because taxed dividends compound less and the gain owed at sale keeps growing. At a 0% tax rate on dividends and gains the two accounts finish level; at 23.8% (the top 20% rate plus the 3.8% net investment income tax) the Roth\'s edge after 35 years is $280,689.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>The first seven boxes project the Roth IRA itself. The last two exist only for the comparison with an ordinary brokerage account, which is how the calculator puts a dollar value on tax-free growth.</p>
<h3>Age now and age you start withdrawing</h3>
<p>Contributions go in at the start of each year until the withdrawal age. Earnings come out tax-free only from 59½, so a withdrawal age below that shows a balance you could not yet fully tap without tax.</p>
<h3>Balance today and your own contributions</h3>
<p>Enter the total across all your Roth IRAs, then how much of it is money you put in. That second number is your basis. People often enter the whole balance as contributions; earnings are not basis, and only basis is free to withdraw at any time.</p>
<h3>Yearly contribution and the age 50 catch-up</h3>
<p>The 2026 limit is $7,500, or $8,600 from age 50, and never more than your earned income. If your MAGI falls in the phase-out range, find your reduced limit with the <a href="/magi-calculator">MAGI calculator for Roth IRAs</a> first. Tick the catch-up box if you plan to keep maxing out after 50; the calculator only adds it when you already contribute the full $7,500.</p>
<h3>Annual return</h3>
<p>Use the total return including dividends. A Roth IRA is often the account people fill with stock funds, because the largest expected growth is the growth that is never taxed.</p>
<h3>Year of your first contribution</h3>
<p>The mistake people make is assuming each contribution has its own clock. It does not: one clock, started by your first contribution to any Roth IRA, covers all of them.</p>
<h3>Dividends and tax rate for the comparison</h3>
<p>Enter the dividend yield and the tax rate you would pay in a regular brokerage account. The calculator taxes dividends each year and the remaining gain when you sell. Set the rate to 0 if you would be in the 0% capital gains bracket; the two accounts then finish level.</p>`
    },
    {
      h2: 'How much will a Roth IRA grow by retirement?',
      html: `<p>Three things set the result: how much you put in each year, how many years it compounds and the return. All figures below start from Sam's $10,000 and run to 65, with the catch-up from 50.</p>
<h3>How much you contribute</h3>
<p>$3,000 a year grows to $550,506, $5,000 a year to $846,333 and the $7,500 maximum to $1,245,694 at 7%. Contributions that stay below the limit are not raised at 50.</p>
<h3>When you start</h3>
<p>Starting at 25 instead of 30 lifts the balance to $1,781,393; starting at 40 leaves $591,425. Five extra years at the beginning add more than half a million dollars, because they are the years that compound longest.</p>
<h3>The return</h3>
<p>At 6% Sam reaches $989,907 and at 8% $1,575,876. The Roth's edge over a taxable account also grows with the return: $131,855 at 6% and $245,862 at 8%, because there is more growth to shelter.</p>`
    },
    {
      h2: 'Is a Roth IRA better than investing in a regular brokerage account?',
      html: `<p>For retirement money, almost always, because you put in the same after-tax dollars but never pay tax on the growth.</p>
<h3>Tax drag in a brokerage account</h3>
<p>In a brokerage account you pay tax on dividends every year, which slows compounding, and again on the gain when you sell. Sam's result, $1,245,694 against $1,064,289 after 35 years, is the size of that difference at a 15% rate. At 23.8% (the top 20% rate plus the 3.8% net investment income tax) the taxable account nets $965,005.</p>
<h3>When the Roth does not help</h3>
<p>The brokerage account wins on flexibility: no contribution or income limit. And a Roth's edge shrinks to nothing if you would pay 0% on dividends and gains anyway, which in 2026 applies to taxable income up to about $49,450 for single filers.</p>
<h3>Roth versus traditional</h3>
<p>Roth versus traditional (pre-tax) is a separate choice: with the same tax rate now and in retirement they come out even, and Roth wins if your rate will be higher later. For a workplace plan, see the <a href="/401k-retirement-calculator">401(k) retirement calculator</a>.</p>`
    },
    {
      h2: 'How does the Roth IRA 5-year rule work?',
      html: `<p>Earnings come out tax-free only in a qualified distribution: you are 59½ or older (or disabled, or it is paid to a beneficiary, or up to $10,000 for a first home) <em>and</em> five tax years have passed since January 1 of the year of your first contribution to any Roth IRA.</p>
<h3>When the clock starts</h3>
<p>A contribution made for 2026 in April 2027 still starts the clock on January 1, 2026, so the clock is satisfied on January 1, 2031.</p>
<h3>Who it affects</h3>
<p>The rule mostly matters to people who open their first Roth late. A 58-year-old who starts in 2026 with the full $8,600 a year has $52,918 by 63, but the $9,918 of earnings in it is not qualified until 2031, when they are 63. Withdrawals of earnings before then owe income tax, though not the 10% additional tax once they are past 59½.</p>
<h3>Conversions have their own clocks</h3>
<p>A separate 5-year clock applies to each Roth <em>conversion</em> for the 10% additional tax under 59½.</p>`
    },
    {
      h2: 'Can you take money out of a Roth IRA before retirement?',
      html: `<h3>Contributions: yes, any time</h3>
<p>Your contributions come out with no tax and no penalty. The IRS ordering rules treat every withdrawal as coming from contributions first, then conversions (oldest first), and earnings last. Sam could withdraw up to $287,000 of contributions by 65 without touching his $958,694 of earnings.</p>
<h3>Earnings: usually taxed and penalized</h3>
<p>Earnings taken out early are taxed as income and usually owe a 10% additional tax as well, unless an exception applies, such as disability, a first-home purchase up to $10,000, or certain education or medical costs. The <a href="/early-withdrawal-penalty-calculator">early withdrawal calculator</a> estimates that cost.</p>
<h3>No required minimum distributions</h3>
<p>A Roth IRA has no required minimum distributions while you are alive, so the money can keep compounding tax-free as long as you leave it.</p>`
    },
    {
      h2: 'Who can contribute to a Roth IRA in 2026?',
      html: `<h3>Income limits</h3>
<p>Anyone with earned income (wages, salary or self-employment income) whose modified AGI is under the limit. For 2026 the amount you can contribute phases out between $153,000 and $168,000 of MAGI for single filers and heads of household, and between $242,000 and $252,000 for married couples filing jointly. Married filing separately (if you lived together) phases out between $0 and $10,000. The <a href="/magi-calculator">MAGI calculator</a> works out your exact reduced limit.</p>
<h3>Contribution limit</h3>
<p>The $7,500 limit ($8,600 at 50 and older) is shared across all your traditional and Roth IRAs and cannot exceed your earned income. There is no age limit, and you have until the April tax deadline to contribute for the prior year.</p>
<h3>Above the income limits</h3>
<p>A backdoor Roth (a nondeductible traditional IRA contribution converted to Roth) is the usual route. Pre-tax money already in traditional IRAs makes part of that conversion taxable, so check before you start.</p>`
    }
  ],
  faq: [
    { q: 'How much will my Roth IRA be worth if I contribute $7,500 a year?', a: 'Starting from $10,000 at 30 with $7,500 a year ($8,600 from 50) at 7%, about $1,245,694 by 65. Over 20 years from zero, $7,500 a year at 7% grows to about $328,989.' },
    { q: 'How much will $5,000 a year in a Roth IRA grow to?', a: 'About $846,333 by 65 if you start at 30 with $10,000 already invested and earn 7% a year. At $3,000 a year the same plan reaches $550,506.' },
    { q: 'What return should I assume in a Roth IRA calculator?', a: 'Many people use 6–7% a year for a mostly stock portfolio over decades. For the default plan, 6% gives $989,907 at 65 and 8% gives $1,575,876, so test more than one rate.' },
    { q: 'What is the Roth IRA contribution limit for 2026?', a: '$7,500, plus a $1,100 catch-up at 50 and older for $8,600. It is a combined limit for all your IRAs and is reduced if your MAGI is in the phase-out range.' },
    { q: 'Are Roth IRA withdrawals taxed in retirement?', a: 'Not if they are qualified: you are 59½ or older and your first Roth IRA contribution was at least five tax years earlier. Withdrawals of contributions are never taxed.' },
    { q: 'How do I calculate my Roth IRA basis?', a: 'Add up every contribution you have made to Roth IRAs, plus any amounts converted or rolled in from pre-tax accounts, minus basis you have already withdrawn. IRS Form 8606 tracks it; earnings are never part of basis.' },
    { q: 'Can I have a Roth IRA and a 401(k)?', a: 'Yes. A workplace plan does not affect your Roth IRA limit or eligibility; only your MAGI does. Pre-tax 401(k) deferrals lower MAGI, which can help you qualify.' },
    { q: 'Is it too late to open a Roth IRA at 50 or 60?', a: 'No. Starting from zero at 50 with $8,600 a year at 7%, you would have about $231,237 by 65. There is no age limit as long as you have earned income.' },
    { q: 'Should I choose a Roth IRA or a traditional IRA?', a: 'If your tax rate in retirement will be the same as now, they end up equal. A Roth comes out ahead if your rate will be higher later or you value having no required withdrawals; a traditional IRA wins if your rate will be lower.' },
    { q: 'Should I do a Roth conversion?', a: 'It can pay if you expect a higher tax rate later, because you pay income tax on the converted amount now. Each conversion has its own five-year clock for the 10% additional tax if you are under 59½.' },
    { q: 'Can I contribute to a Roth IRA after I retire?', a: 'Only if you or your spouse has earned income that year. Pension, Social Security and investment income do not count, though a working spouse can fund a spousal IRA for you.' },
    { q: 'What happens if I contribute too much to a Roth IRA?', a: 'The excess owes a 6% excise tax for each year it stays in the account. Withdraw it with its earnings before your tax-filing deadline, or recharacterize it as a traditional IRA contribution, to avoid the tax.' }
  ],
  related: ['magi-calculator', '401k-retirement-calculator', 'retirement-tax-calculator', 'early-withdrawal-penalty-calculator', 'retirement-calculator'],
  sources: [
    { name: 'IRS: Roth IRAs', url: 'https://www.irs.gov/retirement-plans/roth-iras' },
    { name: 'IRS: 401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500', url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500' },
    { name: 'IRS Publication 590-A: Contributions to individual retirement arrangements (IRAs)', url: 'https://www.irs.gov/publications/p590a' },
    { name: 'IRS Publication 590-B: Distributions from individual retirement arrangements (IRAs)', url: 'https://www.irs.gov/publications/p590b' },
    { name: 'IRS: Topic no. 409, Capital gains and losses', url: 'https://www.irs.gov/taxtopics/tc409' }
  ],
  disclaimer: 'Assumes a steady return and current tax law. Not tax or investment advice.'
};
