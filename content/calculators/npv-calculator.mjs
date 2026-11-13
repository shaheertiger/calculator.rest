export default {
  slug: 'npv-calculator',
  hub: 'investing',
  name: 'NPV Calculator',
  title: 'NPV Calculator: $50,000 Project at 8% Has an NPV of $4,017.99',
  h1: 'Net Present Value Calculator With Discounted Cash Flow Table',
  meta: 'A $50,000 project returning $15K, $18K, $20K and $12K has an NPV of $4,017.99 at 8% and a profitability index of 1.08. Enter your rate and cash flows.',
  keyword: 'how to calculate npv',
  also: ['npv calculator', 'net present value calculator', 'how to calculate npv using ba ii plus', 'how to calculate npv in excel', 'profitability index calculator', 'discounted cash flow calculator', 'discounted payback period'],
  updated: '2026-11-13',
  inputs: [
    { id: 'rate', label: 'Discount rate (per period)', type: 'number', value: 8, suffix: '%', help: 'Your cost of capital or required return.' },
    { id: 'flows', label: 'Cash flows, period 0 first', type: 'text', multiline: 3, value: '-50000, 15000, 18000, 20000, 12000', placeholder: '-50000, 15000, 18000, 20000, 12000', help: 'Initial cost as a negative number, then each period\'s net cash flow. Use 0 for empty periods.' },
    { id: 'conv', label: 'First cash flow happens', type: 'select', value: 'now', options: [['now', 'Today (period 0, not discounted)'], ['end', 'End of period 1 (Excel NPV style)']] }
  ],
  compute(v, H) {
    var cf = H.list(v.flows);
    if (cf.length < 1) return { error: 'Enter at least one cash flow.' };
    if (isNaN(v.rate) || v.rate <= -100) return { error: 'Enter a discount rate.' };
    var r = v.rate / 100, off = v.conv === 'end' ? 1 : 0;
    var npv = 0, cum = 0, pvIn = 0, pvOut = 0, payback = NaN, rows = [];
    for (var t = 0; t < cf.length; t++) {
      var k = t + off, df = 1 / Math.pow(1 + r, k), pv = cf[t] * df, before = cum;
      cum += pv; npv += pv;
      if (pv >= 0) pvIn += pv; else pvOut -= pv;
      if (isNaN(payback) && before < 0 && cum >= 0 && pv > 0) payback = (k - 1) + (-before / pv);
      rows.push([String(k), H.money(cf[t]), H.fix(df, 4), H.money(pv), H.money(cum)]);
    }
    var pi = pvOut > 0 ? pvIn / pvOut : NaN;
    var out = [
      ['PV of inflows', H.money(pvIn)],
      ['PV of outflows', H.money(pvOut)],
      ['Profitability index', isFinite(pi) ? H.fix(pi, 3) : '—', true],
      ['Discounted payback', isFinite(payback) ? H.num(payback, 2) + ' periods' : 'Not reached']
    ];
    var irr = cf.length > 1 && cf.some(function (x) { return x < 0; }) && cf.some(function (x) { return x > 0; }) ? H.irr(cf) : NaN;
    if (isFinite(irr)) out.push(['IRR (rate where NPV = 0)', H.fix(irr * 100, 2) + '%']);
    return {
      value: H.money(npv),
      label: 'Net present value at ' + H.num(v.rate, 3) + '%',
      expr: 'Σ CF ÷ (1 + ' + H.num(v.rate, 3) + '%)^t, ' + H.plural(cf.length, 'cash flow'),
      rows: out,
      sub: npv > 0.005 ? 'Positive NPV: the cash flows earn more than ' + H.num(v.rate, 3) + '% and add ' + H.money(npv) + ' of value today.' : npv < -0.005 ? 'Negative NPV: at ' + H.num(v.rate, 3) + '% the project is worth less than it costs.' : 'NPV is zero: the project earns exactly the discount rate.',
      table: { head: ['Period', 'Cash flow', 'Discount factor', 'Present value', 'Cumulative PV'], rows: rows, caption: 'Discounted cash flows' }
    };
  },
  quick: ({ r }) => `To calculate NPV, discount each cash flow by (1 + rate)<sup>t</sup> and add them up, including the negative upfront cost. A <strong>$50,000</strong> investment returning $15,000, $18,000, $20,000 and $12,000 over four years has an NPV of <strong>${r.value}</strong> at an <strong>8%</strong> discount rate. It is positive, so the project beats an 8% return.`,
  stepsTitle: 'How to calculate net present value',
  steps: [
    'Pick a discount rate: your cost of capital, the return on your next-best investment, or a company hurdle rate. NPV is only as good as this number.',
    'List the cash flows in time order, starting with the upfront cost as a negative number at period 0. Use net figures: cash in minus cash out for each period.',
    'Divide each cash flow by (1 + rate) raised to its period number. Period 0 is divided by 1, so the initial cost is not discounted.',
    'Add the present values. Positive NPV means accept; negative means the project returns less than your rate. The classic spreadsheet error is discounting the period-0 cost too; switch the timing option to see the difference.'
  ],
  formulaTitle: 'What is the NPV formula?',
  formula: {
    expr: 'NPV = Σ CF<sub>t</sub> ÷ (1 + r)<sup>t</sup> = CF<sub>0</sub> + CF<sub>1</sub> ÷ (1 + r) + … + CF<sub>n</sub> ÷ (1 + r)<sup>n</sup><br>Profitability index = PV of future inflows ÷ initial outlay',
    vars: [['CF<sub>t</sub>', 'net cash flow in period t (CF<sub>0</sub> is usually the negative upfront cost)'], ['r', 'discount rate per period'], ['t', 'period number, 0 to n']],
    note: 'Use a rate that matches the period: for monthly cash flows, a monthly rate such as (1 + annual)<sup>1/12</sup> − 1.'
  },
  example: `<p>A business can buy a $50,000 machine that saves $15,000, $18,000, $20,000 and $12,000 over the next four years. Its cost of capital is 8%.</p>
<p>Present values: $15,000 ÷ 1.08 = $13,888.89; $18,000 ÷ 1.08<sup>2</sup> = $15,432.10; $20,000 ÷ 1.08<sup>3</sup> = $15,876.64; $12,000 ÷ 1.08<sup>4</sup> = $8,820.36.</p>
<p>Sum of inflows = $54,017.99. NPV = $54,017.99 − $50,000 = <strong>$4,017.99</strong>. Profitability index = 54,017.99 ÷ 50,000 = <strong>1.080</strong>.</p>
<p>The cumulative present value turns positive during year 4, giving a discounted payback of about 3.54 years.</p>`,
  table: {
    title: 'How does the discount rate change NPV?',
    intro: 'The same $50,000 project valued at different discount rates by the calculator above. NPV crosses zero at the IRR, about 11.62%.',
    head: ['Discount rate', 'NPV', 'Profitability index', 'Decision'],
    rows: ({ run }) => [0, 4, 6, 8, 10, 11.62, 12, 15, 20].map(x => {
      const r = run({ rate: x, conv: 'now' });
      const n = parseFloat(String(r.value).replace(/[^0-9.]/g, '')) * (String(r.value).indexOf('−') === 0 ? -1 : 1);
      return [x + '%', r.value, r.rows[2][1], n > 10 ? 'Accept' : n < -10 ? 'Reject' : 'Break-even (≈ IRR)'];
    }),
    note: 'At 0% the NPV is just the sum of the cash flows ($15,000). The higher the rate, the less future dollars are worth today.'
  },
  sections: [
    {
      h2: 'How do you calculate NPV in Excel?',
      html: `<p>Excel's <code>NPV(rate, values)</code> assumes the first value arrives at the <em>end</em> of period 1, so it discounts every cash flow. To value a project with an upfront cost today, leave the cost out and add it separately: with the cost in B1 and the inflows in B2:B5, use <code>=NPV(8%, B2:B5) + B1</code>, which returns $4,017.99.</p>
<p>Typing <code>=NPV(8%, B1:B5)</code> instead discounts the cost by a year and gives $3,720.36, about $298 too low. That is what the "End of period 1" option above reproduces. For irregular dates, use <code>XNPV(rate, values, dates)</code>.</p>`
    },
    {
      h2: 'How do you calculate NPV on a BA II Plus?',
      html: `<p>Press <kbd>CF</kbd> and clear with <kbd>2nd</kbd> <kbd>CE|C</kbd>. Enter CF0 = 50000 <kbd>+|−</kbd> <kbd>ENTER</kbd>, then each flow with <kbd>↓</kbd> C01 = 15000 <kbd>ENTER</kbd> <kbd>↓</kbd> F01 = 1, and so on through C04 = 12000. Press <kbd>NPV</kbd>, enter I = 8 <kbd>ENTER</kbd>, press <kbd>↓</kbd> and <kbd>CPT</kbd>. The display shows NPV = 4,017.99. The calculator treats CF0 as today, matching this page's default.</p>`
    },
    {
      h2: 'What discount rate should I use for NPV?',
      html: `<p>Use the return you give up by investing in this project instead of the next-best alternative with similar risk. Companies usually start from their weighted average cost of capital (the <a href="/wacc-calculator">WACC calculator</a> shows how) and add a premium for riskier projects. Individuals might use their mortgage rate (for paying down debt), a long-run stock return (for an investment property) or a Treasury yield (for a nearly risk-free payment). Inflation matters too: discount nominal cash flows with a nominal rate and inflation-adjusted cash flows with a real rate.</p>`
    },
    {
      h2: 'NPV vs. IRR: which should you trust?',
      html: `<p>When they disagree, trust NPV. IRR is a percentage and ignores scale, so a small project with a high IRR can look better than a large project that creates far more dollars of value. IRR can also have no answer or two answers when cash flows change sign more than once. NPV always gives one dollar figure at your chosen rate. IRR is still useful as a quick break-even rate; the <a href="/irr-calculator">IRR calculator</a> finds it for any series of cash flows.</p>`
    }
  ],
  faq: [
    { q: 'What does a positive NPV mean?', a: 'It means the investment returns more than your discount rate. An NPV of $4,017.99 at 8% says the project is worth $4,017.99 more today than it costs, after paying for the 8% required return.' },
    { q: 'Is a higher NPV always better?', a: 'Among projects you can only pick one of, choose the highest NPV. If capital is limited and you can fund several, rank by profitability index (NPV per dollar invested) instead.' },
    { q: 'What is the profitability index?', a: 'The present value of future cash flows divided by the initial investment. Above 1.0 means positive NPV; the example\'s 1.080 means each dollar invested returns $1.08 in today\'s money.' },
    { q: 'What is the present value of $1,000 in 5 years at 8%?', a: '$1,000 ÷ 1.08^5 = $680.58. Money received later is worth less today because you could have invested it in the meantime.' },
    { q: 'Can NPV be negative even if the project makes money?', a: 'Yes. A project that returns more cash than it costs can still have a negative NPV if the return is below your discount rate. At 12%, the example project is worth −$395.83.' },
    { q: 'What is the difference between NPV and PV?', a: 'Present value (PV) is today\'s value of future cash flows. NPV subtracts the upfront cost from that PV, so it measures value created rather than value received.' },
    { q: 'How do you calculate discounted payback period?', a: 'Add the present values of the cash flows period by period. The discounted payback is when the running total turns from negative to positive; in the example it is about 3.54 years.' }
  ],
  related: ['irr-calculator', 'wacc-calculator', 'roi-calculator', 'capm-calculator', 'cagr-calculator'],
  sources: [
    { name: 'Microsoft Support: NPV function', url: 'https://support.microsoft.com/en-us/office/npv-function-8672cb67-2576-4d07-b67b-ac28acf2a568' },
    { name: 'Microsoft Support: IRR function', url: 'https://support.microsoft.com/en-us/office/irr-function-64925eaa-9988-495b-b290-3ad0c163c1bc' },
    { name: 'U.S. Treasury: Daily Treasury par yield curve rates', url: 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve' }
  ]
};
