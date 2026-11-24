export default {
  slug: 'annuity-calculator',
  hub: 'income',
  name: 'Retirement Annuity Calculator',
  meta: 'Estimate the monthly income a retirement annuity pays with our free calculator. See your payout, payout rate, total interest and how it compares with 4%.',
  intro: 'Plug in a lump sum, how long payments should last and the interest rate, and we\'ll show you the monthly annuity payout, or the lump sum you need for the income you want, side by side with the 4% rule.',
  keyword: 'retirement annuity calculator',
  also: ['annuity calculator for retirement', 'retirement annuity payout calculator', 'annuity calculations for retirement', 'how to calculate annuity payments', 'calculate annuity payments for retirement', 'how to calculate retirement annuity', 'retirement income annuity calculator', 'present value of retirement annuity calculator'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'mode', label: 'What do you want to work out?', type: 'select', value: 'income', options: [['income', 'Monthly income from a lump sum'], ['cost', 'Lump sum needed for a monthly income']], wide: true, help: 'Income from money you have, or the premium needed for an income you want.' },
    { id: 'premium', label: 'Lump sum (premium)', type: 'number', value: 250000, prefix: '$', showIf: { mode: ['income'] }, help: 'The amount you would pay the insurer, from savings or a 401(k) rollover.' },
    { id: 'want', label: 'Monthly income you want', type: 'number', value: 1500, prefix: '$', showIf: { mode: ['cost'] }, help: 'For example, your budget minus Social Security and any pension.' },
    { id: 'term', label: 'Payout length', type: 'select', value: 'period', options: [['period', 'A fixed number of years'], ['life', 'To an age you choose (life estimate)']], help: 'A fixed term pays for set years; a life estimate spreads the money to an age.' },
    { id: 'years', label: 'Payout period', type: 'number', value: 20, suffix: 'years', showIf: { term: ['period'] }, help: 'How many years of monthly payments, often 10 to 30.' },
    { id: 'age', label: 'Age when payments start', type: 'number', value: 65, suffix: 'years', showIf: { term: ['life'] }, help: 'Your age at the first payment.' },
    { id: 'until', label: 'Plan for payments until age', type: 'number', value: 90, suffix: 'years', showIf: { term: ['life'] }, help: 'Use your life expectancy or older. Payments from an insurer\'s life annuity continue past it.' },
    { id: 'rate', label: 'Interest rate the annuity earns', type: 'number', value: 5, suffix: '% a year', help: 'The rate credited by the contract. Use a quoted rate if you have one.' },
    { id: 'grow', label: 'Yearly payment increase', type: 'number', value: 0, suffix: '%', help: '0 for level payments; 2–3% for an inflation-style rider.' }
  ],
  compute(v, H) {
    var life = v.term === 'life', yrs;
    if (life) {
      if (!(v.age >= 40 && v.age < 110)) return { error: 'Enter the age payments start (40 or older).' };
      if (!(v.until > v.age && v.until <= 120)) return { error: 'The final age must be after the starting age and no more than 120.' };
      yrs = v.until - v.age;
    } else {
      yrs = v.years;
      if (!(yrs > 0 && yrs <= 60)) return { error: 'Enter a payout period from 1 to 60 years.' };
    }
    var n = Math.round(yrs * 12);
    var rate = isNaN(v.rate) ? 0 : v.rate, g = v.grow > 0 && v.grow < 20 ? v.grow / 100 : 0;
    if (rate < 0 || rate > 25) return { error: 'Enter an interest rate between 0% and 25%.' };
    var i = rate / 100 / 12;
    // PV of $1 a month (end of month), raised by g once a year
    var F = 0, tot1 = 0;
    for (var k = 0; k < n; k++) { var amt = Math.pow(1 + g, Math.floor(k / 12)); F += amt / Math.pow(1 + i, k + 1); tot1 += amt; }
    var cost = v.mode === 'cost', P, L;
    if (cost) { P = v.want; if (!(P > 0)) return { error: 'Enter the monthly income you want.' }; L = P * F; }
    else { L = v.premium; if (!(L > 0)) return { error: 'Enter the lump sum you would put in.' }; P = L / F; }
    var total = P * tot1;
    // 4% withdrawal from the same lump sum, earning the same rate, raised by g a year
    var b = L, w = L * 0.04 / 12;
    for (var m = 0; m < n; m++) { if (m > 0 && m % 12 === 0) w *= 1 + g; b = b * (1 + i) - w; if (b < 0) { b = 0; } }
    var lenTxt = life ? 'from ' + H.num(v.age, 1) + ' to ' + H.num(v.until, 1) : 'for ' + H.plural(yrs, 'year');
    var rows = [];
    if (cost) {
      rows.push(['Lump sum for the same income with the 4% rule', H.money0(P * 12 / 0.04)]);
      rows.push(['Annuity cost as share of the 4% rule amount', H.pct(L / (P * 12 / 0.04) * 100, 1), true]);
    } else {
      rows.push(['Yearly income', H.money0(P * 12)]);
      rows.push(['Payout rate (first-year income ÷ premium)', H.pct(P * 12 / L * 100, 2), true]);
      rows.push(['4% withdrawal from the same lump sum', H.money0(L * 0.04 / 12) + '/mo']);
    }
    rows.push(['Total paid out', H.money0(total)]);
    rows.push(['Of which interest', H.money0(total - L)]);
    if (g > 0) rows.push(['Monthly payment in the final year', H.money0(P * Math.pow(1 + g, Math.ceil(n / 12) - 1))]);
    rows.push(['Left for heirs at the end: annuity vs 4% withdrawals', '$0 vs ' + H.money0(b)]);
    return {
      value: cost ? H.money0(L) : H.money0(P) + '/mo',
      label: cost ? 'Lump sum needed for ' + H.money0(P) + ' a month ' + lenTxt : 'Monthly annuity payout ' + lenTxt,
      expr: (cost ? H.money0(P) + '/mo' : H.money0(L)) + ' · ' + H.num(n, 0) + ' payments @ ' + H.pct(rate, 2) + (g ? ' +' + H.pct(g * 100, 2) + '/yr' : ''),
      rows: rows,
      P: P, L: L,
      sub: (cost ? 'You need about ' + H.money0(L) + ' to buy ' + H.money0(P) + ' a month ' + lenTxt + ' at ' + H.pct(rate, 2) + ', against ' + H.money0(P * 12 / 0.04) + ' with the 4% rule' : 'A ' + H.money0(L) + ' annuity at ' + H.pct(rate, 2) + ' pays ' + H.money0(P) + ' a month ' + lenTxt + (g ? ' to start' : '') + ', with nothing left at the end') + (life ? '; an insurer\'s life annuity would keep paying past ' + H.num(v.until, 1) + ', so real quotes differ.' : '.')
    };
  },
  notes: {
    'Yearly income': 'Twelve monthly annuity payments in the first year.',
    'Payout rate (first-year income ÷ premium)': 'Not an investment return: part of each payment is your own money back.',
    '4% withdrawal from the same lump sum': 'What the 4% rule would pay from the same money, for comparison.',
    'Lump sum for the same income with the 4% rule': 'Savings needed to fund this income with 4% withdrawals instead.',
    'Annuity cost as share of the 4% rule amount': 'The annuity premium divided by the 4% rule lump sum.',
    'Total paid out': 'Every monthly payment added up over the payout period.',
    'Of which interest': 'Total paid out minus the premium.',
    'Monthly payment in the final year': 'The payment after all the yearly increases.',
    'Left for heirs at the end: annuity vs 4% withdrawals': 'The annuity is used up; 4% withdrawals at the same rate leave this balance.'
  },
  assumptions: 'These calculations are estimates. They assume a fixed interest rate, payments at the end of each month and no fees or surrender charges; an insurer\'s life annuity uses mortality tables, so real quotes differ.',
  quick: ({ r, run }) => `A <strong>$250,000</strong> retirement annuity credited at 5% a year pays <strong>${r.value.replace('/mo', ' a month')}</strong> for 20 years: 240 payments totaling $395,973. That is a 7.92% payout rate, about double the $833 a month a 4% withdrawal would give, but nothing is left at the end. Stretching payments to age 90 from 65 lowers it to ${run({ term: 'life' }).value.replace('/mo', ' a month')}.`,
  formulaTitle: 'How do you calculate annuity payments?',
  formula: {
    expr: 'Payment = Premium × i ÷ (1 − (1 + i)<sup>−n</sup>)<br>Premium needed = Payment × (1 − (1 + i)<sup>−n</sup>) ÷ i',
    vars: [['i', 'monthly interest rate, annual rate ÷ 12'], ['n', 'number of monthly payments'], ['Premium', 'the lump sum paid to the insurer']],
    note: 'Payments are made at the end of each month. With a yearly increase g, each payment is multiplied by (1 + g) once a year and the calculator sums the discounted payments directly instead of using the closed form.'
  },
  example: `<p>You put $250,000 into an immediate annuity that credits 5% and pays monthly for 20 years.</p>
<p>i = 5% ÷ 12 = 0.4167%, n = 240. (1.004167)<sup>−240</sup> = 0.3686, so the payment is $250,000 × 0.004167 ÷ (1 − 0.3686) = <strong>$1,649.89 a month</strong>, or $19,799 a year.</p>
<p>Over 20 years you receive $395,973: your $250,000 back plus $145,973 of interest. Taking 4% a year ($833 a month) from the same $250,000 invested at 5% would leave $335,632 after 20 years, but pays half as much each month.</p>
<p>Turned around: for $1,500 a month over the same 20 years at 5%, the premium needed is <strong>$227,288</strong>. Funding $1,500 a month with the 4% rule would take $450,000.</p>`,
  table: {
    title: 'How much does a $100,000 annuity pay per month?',
    intro: 'Level monthly payout from a $100,000 premium by payout period and interest rate, computed with the calculator above.',
    head: ['Payout period', '3%', '4%', '5%', '6%', '7%'],
    rows: ({ run }) => [5, 10, 15, 20, 25, 30, 35].map(y => [y + ' years', ...[3, 4, 5, 6, 7].map(x => run({ mode: 'income', premium: 100000, term: 'period', years: y, rate: x, grow: 0 }).value.replace('/mo', ''))]),
    note: 'Multiply by your premium in $100,000s: $250,000 at 5% for 20 years is 2.5 × $659.96 = $1,650. Insurer quotes for lifetime annuities also depend on your age, sex and the insurer\'s pricing, so expect them to differ.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>An annuity payout depends on four things: how much goes in, how long it pays, the rate it credits and whether payments rise.</p>
<h3>What you want to work out</h3>
<p>Choose the direction: income from a lump sum you have, or the lump sum needed for an income you want. The second option is useful for pricing a target, such as the gap between your budget and Social Security.</p>
<h3>Lump sum or monthly income</h3>
<p>Enter the premium you would hand to the insurer, or the monthly income you want to buy. If the money is coming from an IRA or 401(k), remember the payments will be taxable.</p>
<h3>Payout length</h3>
<p>A fixed term (period-certain) pays for a set number of years. For lifetime income, enter your starting age and an age you are unlikely to outlive; the calculator spreads the money to that age. The SSA's life expectancy calculator helps pick it.</p>
<h3>Interest rate</h3>
<p>Enter the rate the contract credits. Use a quoted rate if you have one; this is the number that moves the answer most. One point either way changes the default payout from $1,515 to $1,791 a month.</p>
<h3>Yearly payment increase</h3>
<p>Add an increase only if the contract has one. The common mistake is comparing a level annuity with an inflation-adjusted withdrawal: the first payment of a rising annuity starts noticeably lower, $1,403 instead of $1,650 a month with a 2% increase.</p>`
    },
    {
      h2: 'Is an annuity better than the 4% rule?',
      html: `<h3>Why an annuity pays more</h3>
<p>It pays more per dollar because it spends your principal as well as the interest. In the default example the annuity pays $1,650 a month against $833 from 4% withdrawals, and buying $1,500 a month of income costs $227,288 instead of $450,000.</p>
<h3>What you give up</h3>
<p>The money is no longer yours to dip into for a roof or a medical bill, early-surrender charges can apply, and with a life-only contract nothing goes to heirs. The 4% approach keeps control and, in this example, still has $335,632 after 20 years, but the income is not guaranteed and a bad market can shrink it.</p>
<h3>A middle path</h3>
<p>A common approach is to annuitize enough to cover essential bills alongside Social Security and keep the rest invested. The <a href="/retirement-withdrawal-calculator">retirement withdrawal calculator</a> sizes the invested part, and the <a href="/retirement-income-calculator">retirement income calculator</a> adds everything up.</p>`
    },
    {
      h2: 'How is a life annuity different from a fixed-period annuity?',
      html: `<h3>Fixed-period annuities</h3>
<p>A fixed-period (period-certain) annuity is plain math: the formula above, with payments to you or your beneficiary for exactly the term.</p>
<h3>Life annuities and pooling</h3>
<p>A life annuity pays as long as you live, however long that is. The insurer can do this because it pools many buyers: those who die early fund those who live long. That pooling is why a life annuity can pay more than you could safely withdraw yourself for an open-ended retirement.</p>
<h3>How this calculator estimates life income</h3>
<p>This calculator does not have an insurer's mortality tables, so its "to an age you choose" option is an estimate: it spreads the premium evenly to that age. From 65 to 90 at 5%, $250,000 gives $1,461 a month; planning to 95 lowers it to $1,342. A real quote may be higher or lower depending on the insurer's rates, fees and pricing, and it will keep paying past the age you chose. Use the result as a sanity check on a quote, not as one.</p>`
    },
    {
      h2: 'What is the difference between this and a pension lump sum calculator?',
      html: `<p>They answer opposite questions. Here you are buying income: you hand over a lump sum and want to know the monthly payment. With a pension buyout, your employer offers to turn a promised monthly pension into a lump sum, and you want to know whether the offer is fair. For that, use the <a href="/pension-calculator">pension lump sum calculator</a>, which discounts the pension back to today and compares it with the offer.</p>
<p>The two link up neatly: if a pension's lump sum would buy a larger annuity than the pension itself pays, the offer is generous, and the reverse is a sign to keep the pension.</p>`
    },
    {
      h2: 'How are retirement annuity payments taxed?',
      html: `<h3>Qualified annuities</h3>
<p>If the annuity is bought inside an IRA or 401(k), each payment is generally taxable as ordinary income, just like any other withdrawal from those accounts.</p>
<h3>Annuities bought with after-tax money</h3>
<p>If it is bought with after-tax savings, part of each payment is a tax-free return of your premium and only the earnings portion is taxed. Withdrawals from a deferred annuity before 59½ can also face a 10% additional tax.</p>
<h3>Fees and guarantees to check</h3>
<p>Before buying, ask about surrender charges, annual fees and the cost of riders such as inflation increases. Guarantees depend on the insurance company's ability to pay, so check its financial strength.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate annuity payments?', a: 'Payment = premium × i ÷ (1 − (1 + i)<sup>−n</sup>), where i is the monthly rate and n the number of payments. $250,000 at 5% for 240 months gives $1,650 a month.' },
    { q: 'How much does a $100,000 annuity pay per month?', a: 'About $660 a month for 20 years at a 5% interest rate, or $1,061 a month for 10 years. See the table above for other rates and terms.' },
    { q: 'How much does a $200,000 annuity pay per month?', a: 'About $1,320 a month for 20 years at 5%. Paid over 20 years at 4%, it would be about $1,212 a month.' },
    { q: 'How much does a $500,000 annuity pay per month?', a: 'At 5% for 20 years it pays $3,300 a month. Over 30 years the same rate would give about $2,684 a month.' },
    { q: 'How much does a $1 million annuity pay per month?', a: 'About $6,600 a month for 20 years at 5%, or $79,195 a year. Over a longer term or at a lower rate the payment is smaller.' },
    { q: 'How much do I need in an annuity to get $2,000 a month?', a: 'About $303,051 for a 20-year payout at 5%. For $1,000 a month, half that: $151,525. For $3,000 a month, about $454,576.' },
    { q: 'What is an annuity payout rate?', a: 'It is the first year\'s income divided by the premium. $19,799 a year from $250,000 is a 7.92% payout rate. It is not an investment return, because part of every payment is your own money coming back.' },
    { q: 'How much would a $250,000 annuity pay for life from age 65?', a: 'Spreading it evenly to age 90 at 5% gives about $1,461 a month, and to 95 about $1,342. An insurer\'s life annuity uses mortality tables and keeps paying however long you live, so real quotes differ.' },
    { q: 'Do annuity payments rise with inflation?', a: 'Only if the contract includes an increase. With a 2% yearly increase, $250,000 at 5% for 20 years starts at $1,403 a month and reaches $2,044 in the final year.' },
    { q: 'Is an annuity a good idea for retirement?', a: 'It can be for essential bills: in the default example an annuity pays $1,650 a month from $250,000, about twice the $833 a 4% withdrawal gives. The trade-off is that the money is locked up and, after 20 years, nothing is left, while the 4% approach would still hold $335,632.' },
    { q: 'What happens to an annuity when I die?', a: 'A life-only annuity stops. A period-certain annuity, or a life annuity with a period-certain or refund option, pays the remaining amount to your beneficiary. Those options lower the monthly payment.' },
    { q: 'What interest rate should I enter?', a: 'Use the rate from an actual quote if you have one. Without one, try a range: at 4% the default example pays $1,515 a month and at 6% it pays $1,791.' }
  ],
  related: ['pension-calculator', 'retirement-withdrawal-calculator', 'retirement-income-calculator', 'social-security-calculator', 'monte-carlo-retirement-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Annuities', url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/insurance-products/annuities' },
    { name: 'FINRA: Annuities', url: 'https://www.finra.org/investors/investing/investment-products/annuities' },
    { name: 'IRS: Topic no. 410, Pensions and annuities', url: 'https://www.irs.gov/taxtopics/tc410' },
    { name: 'Social Security Administration: Life Expectancy Calculator', url: 'https://www.ssa.gov/oact/population/longevity.html' }
  ],
  disclaimer: 'Estimates for comparison only. Insurer quotes, fees and contract terms vary; this is not an offer or investment advice.'
};
