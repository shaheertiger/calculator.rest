export default {
  slug: 'payback-period-calculator',
  hub: 'business',
  name: 'Payback Period Calculator',
  title: 'Payback Period Calculator: $50,000 at $12,500/Year = 4 Years',
  h1: 'Payback Period Calculator: Simple and Discounted Payback',
  meta: 'A $50,000 investment returning $12,500 a year pays back in 4.0 years, or 5.01 years discounted at 8%. Handles even or uneven yearly cash flows.',
  keyword: 'how to calculate the payback period',
  also: ['payback period calculator', 'how to calculate the payback period in excel', 'how to calculate payback in excel', 'discounted payback period calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'invest', label: 'Initial investment', type: 'number', value: 50000, prefix: '$' },
    { id: 'pattern', label: 'Cash flows', type: 'select', value: 'even', options: [['even', 'Same amount every year'], ['uneven', 'Different each year']] },
    { id: 'annual', label: 'Net cash inflow per year', type: 'number', value: 12500, prefix: '$', help: 'Extra cash in or savings, after operating costs.', showIf: { pattern: ['even'] } },
    { id: 'life', label: 'Years of cash flow', type: 'number', value: 10, suffix: 'years', showIf: { pattern: ['even'] } },
    { id: 'flows', label: 'Net cash flow for year 1, 2, 3…', type: 'text', value: '12000, 15000, 18000, 20000, 20000', wide: true, placeholder: 'e.g. 12000, 15000, 18000', showIf: { pattern: ['uneven'] } },
    { id: 'rate', label: 'Discount rate (optional)', type: 'number', value: 8, suffix: '%', help: 'Your cost of capital or required return, for discounted payback.' }
  ],
  compute(v, H) {
    if (!(v.invest > 0)) return { error: 'Enter the initial investment.' };
    var cf = [];
    if (v.pattern === 'uneven') {
      cf = H.list(v.flows);
      if (!cf.length) return { error: 'Enter at least one yearly cash flow.' };
    } else {
      if (!(v.annual > 0)) return { error: 'Enter the yearly cash inflow.' };
      var n = v.life >= 1 ? Math.min(Math.floor(v.life), 100) : 10;
      for (var k = 0; k < n; k++) cf.push(v.annual);
    }
    var r = v.rate >= 0 ? v.rate / 100 : NaN;
    function payback(list) {
      var cum = -v.invest;
      for (var i = 0; i < list.length; i++) {
        var prev = cum; cum += list[i];
        if (cum >= 0 && list[i] > 0) return i + (-prev) / list[i];
      }
      return NaN;
    }
    var disc = [], cumS = -v.invest, cumD = -v.invest, table = [];
    for (var i = 0; i < cf.length; i++) {
      var d = isNaN(r) ? NaN : cf[i] / Math.pow(1 + r, i + 1);
      disc.push(d);
      cumS += cf[i]; cumD += d;
      table.push([String(i + 1), H.money0(cf[i]), H.money0(cumS), isNaN(r) ? '—' : H.money0(d), isNaN(r) ? '—' : H.money0(cumD)]);
    }
    var pb = payback(cf);
    var dpb = isNaN(r) ? NaN : payback(disc);
    var total = H.sum(cf);
    var rows = [];
    rows.push(['Discounted payback' + (isNaN(r) ? '' : ' at ' + H.num(v.rate, 2) + '%'), isNaN(r) ? 'enter a rate' : (isNaN(dpb) ? 'not reached in ' + cf.length + ' years' : H.fix(dpb, 2) + ' years'), true]);
    rows.push(['Total cash returned', H.money0(total)]);
    rows.push(['Cash after payback', H.money0(total - v.invest)]);
    if (!isNaN(r)) rows.push(['NPV of these cash flows', H.money0(cumD)]);
    var y = Math.floor(pb), m = Math.round((pb - y) * 12);
    if (m === 12) { y++; m = 0; }
    return {
      value: isNaN(pb) ? 'Not reached' : H.fix(pb, 2) + ' years',
      label: 'Simple payback period',
      expr: v.pattern === 'even' ? H.money0(v.invest) + ' ÷ ' + H.money0(v.annual) + ' per year' : 'cumulative cash flow reaches ' + H.money0(v.invest),
      rows: rows,
      sub: isNaN(pb) ? 'The cash flows entered never recover the investment.' : 'About ' + y + (y === 1 ? ' year' : ' years') + (m ? ' and ' + m + (m === 1 ? ' month' : ' months') : '') + ' to get the money back' + (isNaN(dpb) ? '.' : '; discounting adds ' + H.fix(dpb - pb, 2) + ' years.'),
      table: { head: ['Year', 'Cash flow', 'Cumulative', 'Discounted', 'Cum. discounted'], rows: table, caption: 'Year-by-year recovery' }
    };
  },
  quick: ({ r, run }) => `To calculate the payback period, divide the initial investment by the yearly cash inflow. A <strong>$50,000</strong> machine that saves <strong>$12,500 a year</strong> pays for itself in 50,000 ÷ 12,500 = <strong>${r.value}</strong>. Discounted at 8%, payback stretches to ${r.rows[0][1]}. With uneven cash flows, add them year by year until the running total reaches $50,000.`,
  stepsTitle: 'How to calculate the payback period',
  steps: [
    'Write down the <strong>initial investment</strong>: purchase price plus installation, training and any other up-front cost.',
    'Estimate the <strong>net cash inflow</strong> each year: extra revenue or cost savings minus the running costs the investment adds. Use cash, not accounting profit, so leave depreciation out.',
    'Even cash flows: payback = investment ÷ yearly inflow. Uneven: keep a running total and find the year it turns positive.',
    'For the final partial year, divide the amount still unrecovered at the start of that year by that year\'s cash flow and add it to the full years. Skipping this step and rounding up to whole years is a common error.',
    'For discounted payback, divide each year\'s cash flow by (1 + rate)<sup>year</sup> first, then repeat steps 3–4.'
  ],
  formulaTitle: 'What is the payback period formula?',
  formula: {
    expr: 'Even cash flows: Payback = Initial investment ÷ Annual cash inflow<br>Uneven: Payback = A + B ÷ C<br>Discounted cash flow in year t = CF<sub>t</sub> ÷ (1 + r)<sup>t</sup>',
    vars: [['A', 'last full year before the cumulative cash flow turns positive'], ['B', 'amount still unrecovered at the end of year A'], ['C', 'cash flow during year A + 1'], ['r', 'discount rate per year']],
    note: 'The calculator assumes cash arrives evenly through each year, which is the standard textbook convention for the fractional year.'
  },
  example: `<p>A bakery spends $50,000 on a new oven. Extra cash flow is $12,000 in year 1, $15,000 in year 2, $18,000 in year 3 and $20,000 in years 4 and 5.</p>
<p>Cumulative: −$38,000 after year 1, −$23,000 after year 2, −$5,000 after year 3, +$15,000 after year 4. Payback = 3 + $5,000 ÷ $20,000 = <strong>3.25 years</strong>.</p>
<p>Discounted at 8%, the five cash flows are worth $11,111, $12,860, $14,289, $14,701 and $13,612. After three years $38,260 is recovered, so discounted payback = 3 + $11,740 ÷ $14,701 = <strong>3.80 years</strong>.</p>`,
  table: {
    title: 'How long does a $50,000 investment take to pay back?',
    intro: 'Simple and discounted payback for $50,000 at different yearly cash inflows, over a 10-year life. "Not reached" means the discounted cash never covers the cost within those 10 years.',
    head: ['Yearly inflow', 'Simple payback', 'Discounted at 5%', 'Discounted at 8%', 'Discounted at 12%'],
    rows: ({ run, H }) => [6000, 7500, 10000, 12500, 15000, 20000, 25000, 40000].map(a => [H.money0(a), run({ pattern: 'even', invest: 50000, annual: a, life: 10, rate: 0 }).value, ...[5, 8, 12].map(rt => run({ pattern: 'even', invest: 50000, annual: a, life: 10, rate: rt }).rows[0][1])])
  },
  sections: [
    {
      h2: 'What is the discounted payback period?',
      html: `<p>It is the time until the <strong>present value</strong> of the cash flows equals the investment. A dollar received in year 4 is worth less than a dollar today, so discounted payback is always longer than simple payback when the rate is above zero. In the default example, $12,500 a year pays back $50,000 in 4.00 years on a simple basis but takes 5.01 years once each year's cash is discounted at 8%.</p>
<p>If discounted payback happens within the project's life, the project's net present value is positive at that rate. For the full value over the whole life, use the <a href="/npv-calculator">NPV calculator</a>, and to find the rate of return itself, the <a href="/irr-calculator">IRR calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate the payback period in Excel?',
      html: `<p><strong>Even cash flows:</strong> put the investment in B1 and the yearly inflow in B2, then use <code>=B1/B2</code>.</p>
<p><strong>Uneven cash flows:</strong> list the years in column A (0, 1, 2…) and cash flows in column B, with the investment as a negative number in B2. In C2 enter <code>=B2</code> and in C3 <code>=C2+B3</code>, then fill down for a running total. The payback year is the last negative row plus the fraction <code>=-C(last negative)/B(next row)</code>.</p>
<p><strong>Discounted:</strong> add a column with <code>=B3/(1+rate)^A3</code> and build the running total from it instead. For level cash flows, <code>=NPER(rate, inflow, -investment)</code> gives the discounted payback directly when cash is assumed to arrive at each year end.</p>`
    },
    {
      h2: 'What is a good payback period?',
      html: `<p>It depends on the asset and your risk tolerance. Many small businesses want equipment to pay back within 2–3 years; energy-efficiency projects are often accepted at 5–7 years; buildings and infrastructure run longer. A useful rule is that payback should be well inside the asset's useful life. A pump that lasts 8 years with a 7-year payback leaves almost nothing for risk.</p>
<p>Payback ignores everything after the break-even year and the size of the total return. Two projects with a 3-year payback can have very different profits, so pair it with <a href="/roi-calculator">ROI</a> or NPV before deciding.</p>`
    },
    {
      h2: 'How do you calculate CAC payback?',
      html: `<p>For subscription businesses, CAC payback is the number of months of gross profit needed to earn back the cost of acquiring a customer: CAC ÷ (monthly revenue per customer × gross margin). If it costs $600 to win a customer paying $80 a month at a 75% gross margin, CAC payback = $600 ÷ ($80 × 0.75) = <strong>10 months</strong>. It is the same payback idea measured per customer.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for payback period?', a: 'With equal yearly cash flows, payback period = initial investment ÷ annual cash inflow. $50,000 ÷ $12,500 = 4 years. With unequal cash flows, add them up year by year and interpolate within the year the total passes the investment.' },
    { q: 'How do you calculate payback period with uneven cash flows?', a: 'Keep a cumulative total of cash flows. Take the last full year before it turns positive and add the unrecovered amount divided by the next year\'s cash flow. $50,000 recovered from $12k, $15k, $18k, $20k gives 3 + $5,000 ÷ $20,000 = 3.25 years.' },
    { q: 'How do you convert a payback period into years and months?', a: 'Multiply the decimal part by 12. A payback of 3.25 years is 3 years and 0.25 × 12 = 3 months.' },
    { q: 'Is a shorter payback period always better?', a: 'Shorter means less time at risk and faster cash recovery, but payback ignores cash flows after the payback date. A project with a 4-year payback that earns for 15 years can beat a 2-year payback that stops after 3.' },
    { q: 'Should depreciation be included in payback calculations?', a: 'No. Payback uses cash flows, and depreciation is a non-cash expense. Do include the tax savings depreciation creates, because those are real cash.' },
    { q: 'What discount rate should I use for discounted payback?', a: 'Use your cost of capital or the minimum return you require, such as your loan rate or WACC. Many small businesses use 8–12%.' },
    { q: 'What is the difference between payback period and break-even point?', a: 'Payback measures how long it takes to recover an investment from cash flows. A break-even point measures the sales volume at which revenue covers fixed and variable costs in a period.' }
  ],
  related: ['npv-calculator', 'irr-calculator', 'roi-calculator', 'break-even-calculator', 'depreciation-calculator'],
  sources: [
    { name: 'OpenStax Principles of Managerial Accounting: Evaluate the payback and accounting rate of return', url: 'https://openstax.org/books/principles-managerial-accounting/pages/11-2-evaluate-the-payback-and-accounting-rate-of-return-in-capital-investment-decisions' },
    { name: 'Corporate Finance Institute: Payback period', url: 'https://corporatefinanceinstitute.com/resources/accounting/payback-period/' },
    { name: 'IRS Publication 946: How to Depreciate Property', url: 'https://www.irs.gov/publications/p946' }
  ]
};
