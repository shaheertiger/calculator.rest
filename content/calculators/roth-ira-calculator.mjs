export default {
  slug: 'roth-ira-calculator',
  hub: 'planning',
  name: 'Roth IRA Calculator',
  title: 'Roth IRA Retirement Calculator: $7,500/yr Grows to $1.25M',
  h1: 'Roth IRA Calculator: Tax-Free Balance, 5-Year Rule and Taxable Comparison',
  meta: 'Investing $7,500 a year in a Roth IRA from 30 to 65 at 7% grows to $1,245,694 tax-free, $181,404 more than a taxable account. Uses 2026 limits.',
  keyword: 'roth ira retirement calculator',
  also: ['roth retirement calculator', 'roth ira calculator retirement', 'roth calculator retirement', 'retirement calculator roth ira', 'roth ira calculator retirement calculator', 'retirement calculator for roth ira', 'retirement roth ira calculator', 'calculate my roth ira at retirement', 'roth calculator balance at retirement', 'roth ira retirement savings calculator'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Your age now', type: 'number', value: 30 },
    { id: 'retAge', label: 'Age you start withdrawing', type: 'number', value: 65 },
    { id: 'bal', label: 'Roth IRA balance today', type: 'number', value: 10000, prefix: '$' },
    { id: 'basis', label: 'Of which your own contributions', type: 'number', value: 8000, prefix: '$', help: 'Contributions (not earnings) can come out any time, tax- and penalty-free.' },
    { id: 'contrib', label: 'Yearly contribution', type: 'number', value: 7500, prefix: '$', help: '2026 limit: $7,500, or $8,600 at 50+. Lower if your income is in the phase-out range.' },
    { id: 'catchup', label: 'Add the $1,100 catch-up from age 50', type: 'checkbox', value: true },
    { id: 'ret', label: 'Annual return', type: 'number', value: 7, suffix: '%' },
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
  quick: ({ r }) => `A Roth IRA retirement calculator shows what tax-free growth is worth. A 30-year-old with $10,000 in a Roth IRA who contributes the 2026 maximum of $7,500 a year, rising to $8,600 at 50, and earns 7% has <strong>${r.value}</strong> at 65, all tax-free after 59½. The same money in a taxable account nets ${r.rows[0][1]} after 15% tax on dividends and gains.`,
  stepsTitle: 'How to project a Roth IRA and compare it with a taxable account',
  steps: [
    'Enter your age, the age you expect to start withdrawing, your current Roth IRA balance and how much of it is your own contributions.',
    'Enter what you will contribute each year. The 2026 limit is $7,500, or $8,600 from age 50, and never more than your earned income. If your MAGI falls in the phase-out range, find your reduced limit with the <a href="/magi-calculator">MAGI calculator for Roth IRAs</a> first.',
    'Enter the year of your first contribution to any Roth IRA. The mistake people make is assuming each contribution has its own clock; it does not, one clock covers all your Roth IRAs.',
    'For the comparison, enter the dividend yield and the tax rate you would pay in a regular brokerage account. The calculator taxes dividends each year and the remaining gain when you sell.'
  ],
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
      h2: 'Is a Roth IRA better than investing in a regular brokerage account?',
      html: `<p>For retirement money, almost always, because you put in the same after-tax dollars but never pay tax on the growth. In a brokerage account you pay tax on dividends every year, which slows compounding, and again on the gain when you sell. Sam's result, $1,245,694 against $1,064,289 after 35 years, is the size of that difference at a 15% rate.</p>
<p>The brokerage account wins on flexibility: no contribution or income limit. And a Roth's edge shrinks to nothing if you would pay 0% on dividends and gains anyway, which in 2026 applies to taxable income up to about $49,450 for single filers.</p>
<p>Roth versus traditional (pre-tax) is a separate choice: with the same tax rate now and in retirement they come out even, and Roth wins if your rate will be higher later. For a workplace plan, see the <a href="/401k-retirement-calculator">401(k) retirement calculator</a>.</p>`
    },
    {
      h2: 'How does the Roth IRA 5-year rule work?',
      html: `<p>Earnings come out tax-free only in a qualified distribution: you are 59½ or older (or disabled, or it is paid to a beneficiary, or up to $10,000 for a first home) <em>and</em> five tax years have passed since January 1 of the year of your first contribution to any Roth IRA. A contribution made for 2026 in April 2027 still starts the clock on January 1, 2026, so the clock is satisfied on January 1, 2031.</p>
<p>The rule mostly matters to people who open their first Roth late. A 58-year-old who starts in 2026 with the full $8,600 a year has $52,918 by 63, but the $9,918 of earnings in it is not qualified until 2031, when they are 63. Withdrawals of earnings before then owe income tax, though not the 10% additional tax once they are past 59½.</p>
<p>A separate 5-year clock applies to each Roth <em>conversion</em> for the 10% additional tax under 59½.</p>`
    },
    {
      h2: 'Can you take money out of a Roth IRA before retirement?',
      html: `<p>Your contributions, yes, at any time, with no tax and no penalty. The IRS ordering rules treat every withdrawal as coming from contributions first, then conversions (oldest first), and earnings last. Sam could withdraw up to $287,000 of contributions by 65 without touching his $958,694 of earnings.</p>
<p>Earnings taken out early are taxed as income and usually owe a 10% additional tax as well, unless an exception applies, such as disability, a first-home purchase up to $10,000, or certain education or medical costs. The <a href="/early-withdrawal-penalty-calculator">early withdrawal calculator</a> estimates that cost.</p>
<p>A Roth IRA also has no required minimum distributions while you are alive.</p>`
    },
    {
      h2: 'Who can contribute to a Roth IRA in 2026?',
      html: `<p>Anyone with earned income (wages, salary or self-employment income) whose modified AGI is under the limit. For 2026 the amount you can contribute phases out between $153,000 and $168,000 of MAGI for single filers and heads of household, and between $242,000 and $252,000 for married couples filing jointly. Married filing separately (if you lived together) phases out between $0 and $10,000. The <a href="/magi-calculator">MAGI calculator</a> works out your exact reduced limit.</p>
<p>The $7,500 limit ($8,600 at 50 and older) is shared across all your traditional and Roth IRAs and cannot exceed your earned income. There is no age limit, and you have until the April tax deadline to contribute for the prior year.</p>
<p>Above the income limits, a backdoor Roth (a nondeductible traditional IRA contribution converted to Roth) is the usual route.</p>`
    }
  ],
  faq: [
    { q: 'How much will my Roth IRA be worth if I contribute $7,500 a year?', a: 'Starting from $10,000 at 30 with $7,500 a year ($8,600 from 50) at 7%, about $1,245,694 by 65. Over 20 years from zero, $7,500 a year at 7% grows to roughly $329,000.' },
    { q: 'What is the Roth IRA contribution limit for 2026?', a: '$7,500, plus a $1,100 catch-up at 50 and older for $8,600. It is a combined limit for all your IRAs and is reduced if your MAGI is in the phase-out range.' },
    { q: 'Are Roth IRA withdrawals taxed in retirement?', a: 'Not if they are qualified: you are 59½ or older and your first Roth IRA contribution was at least five tax years earlier. Withdrawals of contributions are never taxed.' },
    { q: 'Can I have a Roth IRA and a 401(k)?', a: 'Yes. A workplace plan does not affect your Roth IRA limit or eligibility; only your MAGI does. Pre-tax 401(k) deferrals lower MAGI, which can help you qualify.' },
    { q: 'Is it too late to open a Roth IRA at 50 or 60?', a: 'No. There is no age limit as long as you have earned income. Opening early starts the 5-year clock, and a Roth has no required minimum distributions while you are alive.' },
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
