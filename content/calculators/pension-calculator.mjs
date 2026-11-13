export default {
  slug: 'pension-calculator',
  hub: 'investing',
  name: 'Pension Lump Sum Calculator',
  title: 'Pension Lump Sum Calculator: $2,000/Mo Is Worth $304,313',
  h1: 'Pension Lump Sum vs. Monthly Payments: Present Value Calculator',
  meta: 'At a 5% discount rate, $2,000 a month from 65 to 85 is worth $304,313 today, so a $300,000 lump sum offer is about $4,300 short. Test your own offer.',
  keyword: 'how to calculate a lump sum pension payout',
  also: ['pension lump sum calculator', 'how to calculate pension value', 'how to calculate the value of a pension', 'how is a pension calculated', 'how to calculate pension payout', 'lump sum vs annuity calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'monthly', label: 'Monthly pension offered', type: 'number', value: 2000, prefix: '$' },
    { id: 'lump', label: 'Lump sum offered instead', type: 'number', value: 300000, prefix: '$' },
    { id: 'now', label: 'Your age today', type: 'number', value: 65, suffix: 'years' },
    { id: 'start', label: 'Age monthly payments start', type: 'number', value: 65, suffix: 'years' },
    { id: 'end', label: 'Plan for payments until age', type: 'number', value: 85, suffix: 'years', help: 'Your life expectancy, or longer to be safe. SSA tables put a 65-year-old\'s average at the early-to-mid 80s.' },
    { id: 'rate', label: 'Discount rate (what the cash could safely earn)', type: 'number', value: 5, suffix: '% a year' },
    { id: 'cola', label: 'Yearly cost-of-living raise in the pension', type: 'number', value: 0, suffix: '%', help: 'Most private-company pensions have none; many public pensions do.' }
  ],
  compute(v, H) {
    if (!(v.monthly > 0)) return { error: 'Enter the monthly pension amount.' };
    if (!(v.now >= 0) || !(v.start >= v.now)) return { error: 'The start age must be your age today or later.' };
    if (!(v.end > v.start)) return { error: 'The final payment age must be after the start age.' };
    if (!(v.rate > -50)) return { error: 'Enter a discount rate.' };
    var defer = Math.round((v.start - v.now) * 12);
    var n = Math.round((v.end - v.start) * 12);
    var g = v.cola > 0 ? v.cola / 100 : 0;
    function pv(annual) {
      var i = annual / 12, s = 0;
      for (var k = 0; k < n; k++) s += v.monthly * Math.pow(1 + g, Math.floor(k / 12)) / Math.pow(1 + i, defer + k);
      return s;
    }
    var value = pv(v.rate / 100);
    var total = 0;
    for (var k = 0; k < n; k++) total += v.monthly * Math.pow(1 + g, Math.floor(k / 12));
    var rows = [['Total payments, undiscounted', H.money(total, 0)], ['Number of monthly payments', H.int(n)]];
    var diff = NaN, sub = 'Present value of the pension at a ' + H.pct(v.rate, 2) + ' discount rate.';
    if (v.lump > 0) {
      diff = value - v.lump;
      var irr = H.solve(function (r) { return pv(r) - v.lump; }, -0.5, 1);
      var cum = 0, be = NaN, i = v.rate / 100 / 12;
      for (var m = 0; m < n; m++) { cum += v.monthly * Math.pow(1 + g, Math.floor(m / 12)) / Math.pow(1 + i, defer + m); if (cum >= v.lump) { be = v.start + (m + 1) / 12; break; } }
      rows.unshift(['Pension minus lump sum', (diff >= 0 ? '+' : '−') + H.money(Math.abs(diff), 0), true]);
      rows.push(['Return the lump sum must earn to match', H.isNum(irr) ? H.pct(irr * 100, 2) + ' a year' : 'n/a']);
      rows.push(['Pension overtakes lump sum at age', H.isNum(be) ? H.num(be, 1) : 'not before ' + H.num(v.end, 0)]);
      rows.push(['Annual payout as % of lump sum', H.pct(v.monthly * 12 / v.lump * 100, 2)]);
      sub = diff >= 0 ? 'The monthly pension is worth more than the lump sum at these assumptions, by ' + H.money(diff, 0) + '.' : 'The lump sum is worth more than the pension at these assumptions, by ' + H.money(-diff, 0) + '.';
    }
    return {
      value: H.money(value, 0),
      label: 'Present value of the monthly pension',
      expr: H.money(v.monthly, 0) + '/mo × ' + n + ' months @ ' + H.pct(v.rate, 2),
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r, run }) => `To calculate what a pension lump sum should be, discount every future monthly payment back to today and add them up. At a 5% rate, <strong>$2,000 a month</strong> from 65 to 85 has a present value of <strong>${r.value}</strong>, so a $300,000 offer is about $4,300 low. The lump sum would need to earn ${run().rows[3][1]} to match the pension; at 90 the pension's value rises to ${run({ end: 90 }).value}.`,
  stepsTitle: 'How to compare a pension lump sum with monthly payments',
  steps: [
    'Enter the monthly benefit and the lump sum from your election packet. Compare the same form of benefit: a single-life annuity against the lump sum, or the joint-and-survivor amount if you are married and would choose that.',
    'Enter your age, the age payments start and how long you expect them to last. Use your own health and family history; planning to 90 is a cautious choice.',
    'Pick a discount rate: the return you could earn on the cash with similar safety. High-grade corporate bond yields or Treasury yields are reasonable. Using a stock-market return is the step people get wrong, because the pension carries no market risk.',
    'Add a COLA only if the plan document guarantees one. Most corporate pensions are flat for life.',
    'Read the result two ways: the present value gap, and the return the lump sum must earn to match. If that return is above what safe bonds pay, the pension is the better deal.'
  ],
  formulaTitle: 'What is the formula for the present value of a pension?',
  formula: {
    expr: 'PV = Σ (k = 0 to n − 1) P × (1 + g)<sup>⌊k/12⌋</sup> ÷ (1 + r/12)<sup>d + k</sup><br>With no COLA and no deferral: PV = P × [1 − (1 + i)<sup>−n</sup>] ÷ i × (1 + i)',
    vars: [['P', 'monthly pension'], ['n', 'number of monthly payments'], ['r, i', 'annual discount rate, and i = r ÷ 12'], ['d', 'months until the first payment'], ['g', 'annual cost-of-living raise']],
    note: 'Payments are assumed at the start of each month. Plans themselves must use IRS minimum present value rules (corporate bond segment rates and an IRS mortality table) when they compute the lump sum, so your result can differ from the plan\'s figure.'
  },
  example: `<p>Linda, 65, can take $2,000 a month for life or $300,000 now. She plans for payments to age 85 (240 months) and uses a 5% discount rate, so i = 0.05 ÷ 12 = 0.0041667.</p>
<p>PV = $2,000 × [1 − 1.0041667<sup>−240</sup>] ÷ 0.0041667 × 1.0041667 = $2,000 × 151.52 × 1.0041667 = <strong>$304,313</strong>.</p>
<p>The pension is worth about $4,300 more than the lump sum. Put another way, $300,000 would have to earn about 5.17% a year to pay $2,000 a month until 85. Undiscounted, she collects $300,000 by age 77½, and every month after that is extra.</p>`,
  table: {
    title: 'What is a $2,000 monthly pension worth as a lump sum?',
    intro: 'Present value at 65 of $2,000 a month with no COLA, by discount rate and the age payments end.',
    head: ['Discount rate', 'To age 80', 'To age 85', 'To age 90', 'To age 95'],
    rows: ({ run }) => [3, 4, 4.5, 5, 5.5, 6, 7, 8].map(rt => [rt + '%', ...[80, 85, 90, 95].map(e => run({ monthly: 2000, lump: 0, now: 65, start: 65, end: e, rate: rt, cola: 0 }).value)]),
    note: 'Lower rates and longer lives make the pension worth more. That is why lump sum offers shrink when interest rates rise.'
  },
  sections: [
    {
      h2: 'How is a pension calculated in the first place?',
      html: `<p>Most defined-benefit plans use a formula like:</p>
<p><strong>Annual pension = benefit multiplier × years of service × final average salary</strong></p>
<p>With a 1.5% multiplier, 30 years of service and an $80,000 average of your highest-paid years, the pension is 1.5% × 30 × $80,000 = $36,000 a year, or $3,000 a month at the plan's normal retirement age. Retiring early typically cuts it by a fixed percentage per year, and choosing a joint-and-survivor option lowers the monthly amount in exchange for payments to your spouse after you die.</p>
<p>Your plan's summary plan description spells out the multiplier, the salary averaging period and the early-retirement reduction.</p>`
    },
    {
      h2: 'How do pension plans calculate the lump sum they offer?',
      html: `<p>Private-sector plans covered by ERISA must offer at least the minimum present value set by Internal Revenue Code §417(e). They discount your future payments using three corporate bond "segment rates" published monthly by the IRS (short, middle and long term) and an IRS mortality table that estimates how likely you are to be alive for each payment.</p>
<p>The result moves with interest rates. A 1-percentage-point rise in rates can cut a 65-year-old's lump sum by roughly 6–10%, depending on how long payments last, as the table above shows: going from 5% to 6% lowers the value of payments to age 85 by about 8%. Plans typically lock the rate a few months before the plan year (the "lookback month"), so check when your plan updates it.</p>`
    },
    {
      h2: 'Should you take the pension lump sum or the monthly payments?',
      html: `<p>The math is one part. Also weigh:</p>
<ul><li><strong>Longevity:</strong> the pension pays as long as you live; the lump sum can run out. Good health and long-lived parents favor the monthly check.</li>
<li><strong>Inflation:</strong> a flat $2,000 buys about a third less after 15 years of 3% inflation. A lump sum invested well can keep up.</li>
<li><strong>Plan safety:</strong> the Pension Benefit Guaranty Corporation insures private pensions up to annual limits if the plan fails.</li>
<li><strong>Your spouse:</strong> compare against the joint-and-survivor payment, which pays less but keeps going.</li>
<li><strong>Heirs and flexibility:</strong> money left in a rolled-over IRA can pass to children; a single-life pension stops at death.</li></ul>
<p>Pair the result with the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a> to see how a lump sum holds up under withdrawals.</p>`
    },
    {
      h2: 'How do you value a pension for your net worth?',
      html: `<p>Use the same present value calculation. A pension that will pay $2,000 a month from 65 is worth about $304,000 at 65 at a 5% rate. If you are 55 and payments start at 65, the value today is lower because you wait 10 years: set "Your age today" to 55 to see it. Add that figure to the assets side of the <a href="/net-worth-calculator">net worth calculator</a>, and label it separately, because you cannot sell it or borrow against it.</p>`
    }
  ],
  faq: [
    { q: 'What discount rate should I use for a pension lump sum?', a: 'Use a safe rate close to high-quality corporate or Treasury bond yields, typically around 4–6%. That is what the IRS requires plans to use, and it reflects the fact that a pension is a guaranteed stream with no market risk.' },
    { q: 'Is a pension lump sum taxable?', a: 'Yes, unless you roll it directly into an IRA or another employer plan. If the check is paid to you, the plan must withhold 20% for federal tax, and money taken before 59½ may owe a 10% penalty unless an exception applies, such as leaving the job in or after the year you turn 55.' },
    { q: 'What is a good pension lump sum offer?', a: 'One that is at least the present value of the payments at a safe discount rate and your realistic life expectancy. Another check: if the annual pension divided by the lump sum is well above what an insurer would pay for an immediate annuity of that size, keep the pension.' },
    { q: 'How long does it take for a pension to beat the lump sum?', a: 'Without discounting, divide the lump sum by the annual pension: $300,000 ÷ $24,000 = 12.5 years, or age 77½ for payments that start at 65. With a 5% discount rate the crossover is later, at about age 84½.' },
    { q: 'Why did my lump sum offer go down?', a: 'Usually because interest rates rose. Plans discount future payments at IRS corporate bond segment rates, and higher rates mean a smaller present value even though your monthly benefit did not change.' },
    { q: 'Does a lump sum include survivor benefits?', a: 'Yes. Taking the lump sum ends all future payments from the plan, including any survivor benefit. Married participants in private plans usually need their spouse\'s written consent to choose it.' },
    { q: 'Is a pension worth it compared with investing the lump sum?', a: 'It depends on the return you can earn safely. In the default example the lump sum must earn about 5.17% a year to match the pension to age 85, and more if you live longer.' }
  ],
  related: ['net-worth-calculator', 'social-security-calculator', 'how-long-will-money-last-calculator', 'npv-calculator', 'retirement-calculator'],
  sources: [
    { name: 'IRS: Minimum present value segment rates', url: 'https://www.irs.gov/retirement-plans/minimum-present-value-segment-rates' },
    { name: 'IRS Topic 412: Lump-sum distributions', url: 'https://www.irs.gov/taxtopics/tc412' },
    { name: 'IRS: Rollovers of retirement plan and IRA distributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/rollovers-of-retirement-plan-and-ira-distributions' },
    { name: 'Pension Benefit Guaranty Corporation (PBGC)', url: 'https://www.pbgc.gov/' },
    { name: 'U.S. Department of Labor: Types of retirement plans', url: 'https://www.dol.gov/general/topic/retirement/typesofplans' }
  ],
  disclaimer: 'Educational estimate. It ignores mortality weighting and taxes; your plan\'s official figures govern.'
};
