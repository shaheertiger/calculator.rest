export default {
  slug: 'irr-calculator',
  hub: 'investing',
  name: 'IRR Calculator',
  title: 'IRR Calculator: −$10,000 Then $3,000, $4,200, $6,800 = 16.34%',
  h1: 'Internal Rate of Return Calculator for Any Series of Cash Flows',
  meta: 'Investing $10,000 for returns of $3,000, $4,200 and $6,800 gives an IRR of 16.34%. Paste your own cash flows to get IRR, MIRR and NPV at your hurdle rate.',
  keyword: 'how to calculate irr',
  also: ['irr calculator', 'internal rate of return calculator', 'how to calculate irr excel', 'how to calculate irr on excel', 'how to calculate irr on ba ii plus', 'how to calculate irr on ti-84 plus', 'mirr calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'flows', label: 'Cash flows, starting with the initial investment (negative)', type: 'text', multiline: 3, value: '-10000, 3000, 4200, 6800', placeholder: '-10000, 3000, 4200, 6800', help: 'One per period, separated by commas, spaces or new lines. Money out is negative, money in is positive. Use 0 for a period with no cash flow.' },
    { id: 'per', label: 'Each period is', type: 'select', value: '1', options: [['1', '1 year'], ['4', '1 quarter'], ['12', '1 month']] },
    { id: 'hurdle', label: 'Hurdle / reinvestment rate (annual)', type: 'number', value: 10, suffix: '%', help: 'Your required return or cost of capital. Used for NPV and MIRR.' }
  ],
  compute(v, H) {
    var cf = H.list(v.flows);
    if (cf.length < 2) return { error: 'Enter at least two cash flows, e.g. -1000, 1200.' };
    var hasNeg = cf.some(function (x) { return x < 0; }), hasPos = cf.some(function (x) { return x > 0; });
    if (!hasNeg || !hasPos) return { error: 'IRR needs at least one negative and one positive cash flow.' };
    var changes = 0, last = 0;
    cf.forEach(function (x) { if (x !== 0) { var s = x > 0 ? 1 : -1; if (last && s !== last) changes++; last = s; } });
    var irr = H.irr(cf);
    if (!isFinite(irr)) return { error: 'No IRR found for these cash flows (try checking the signs).' };
    var p = Number(v.per) || 1;
    var annual = Math.pow(1 + irr, p) - 1;
    var h = isNaN(v.hurdle) ? 0 : v.hurdle / 100;
    var hp = Math.pow(1 + h, 1 / p) - 1;
    var n = cf.length - 1, pvNeg = 0, fvPos = 0;
    cf.forEach(function (x, t) { if (x < 0) pvNeg += x / Math.pow(1 + hp, t); else fvPos += x * Math.pow(1 + hp, n - t); });
    var mirr = pvNeg < 0 && fvPos > 0 ? Math.pow(fvPos / -pvNeg, 1 / n) - 1 : NaN;
    var mirrA = Math.pow(1 + mirr, p) - 1;
    var npv = H.npv(hp, cf);
    var inflow = 0, outflow = 0;
    cf.forEach(function (x) { if (x > 0) inflow += x; else outflow -= x; });
    var rows = [];
    if (p > 1) rows.push(['IRR per ' + (p === 12 ? 'month' : 'quarter'), H.pct(irr * 100, 3)]);
    rows.push(['NPV at ' + H.num(h * 100, 2) + '% hurdle', H.money(npv), true]);
    rows.push(['MIRR (reinvest at ' + H.num(h * 100, 2) + '%)', isFinite(mirrA) ? H.fix(mirrA * 100, 2) + '%' : '—']);
    rows.push(['NPV at the IRR', H.money(Math.abs(H.npv(irr, cf)) < 0.005 ? 0 : H.npv(irr, cf))]);
    rows.push(['Total in ÷ total out', H.fix(inflow / outflow, 2) + '×']);
    return {
      value: H.fix(annual * 100, 2) + '%',
      label: 'Internal rate of return' + (p > 1 ? ' (annualized)' : ''),
      expr: 'NPV(' + H.fix(irr * 100, 2) + '%) = 0 over ' + H.plural(n, p === 1 ? 'year' : p === 12 ? 'month' : 'quarter'),
      rows: rows,
      sub: (annual >= h ? 'The IRR beats your ' + H.num(h * 100, 2) + '% hurdle, so the project adds value at that rate.' : 'The IRR is below your ' + H.num(h * 100, 2) + '% hurdle, so the project loses value at that rate.') + (changes > 1 ? ' Warning: the cash flows change sign ' + changes + ' times, so more than one IRR may exist; rely on NPV or MIRR.' : '')
    };
  },
  quick: ({ r }) => `IRR is the discount rate that makes the net present value of all cash flows zero. An investment of <strong>−$10,000</strong> returning <strong>$3,000, $4,200 and $6,800</strong> over three years has an IRR of <strong>${r.value}</strong>: discounting each flow at 16.34% brings the total back to exactly $0. Against a 10% hurdle rate its NPV is $1,307.29.`,
  stepsTitle: 'How to calculate IRR',
  steps: [
    'List the cash flows in order, one per period. Put the initial investment first as a negative number; later money coming back is positive. A year with nothing still needs a 0, or every later flow shifts a period.',
    'Choose the period length. For monthly flows the calculator turns the monthly IRR into an annual rate with (1 + monthly IRR)<sup>12</sup> − 1.',
    'Enter your hurdle rate (the return you require). The calculator compares it with the IRR and also reports NPV and MIRR at that rate.',
    'Read the warning if your flows change sign more than once (for example a big repair cost in year 5). Those projects can have two IRRs, and NPV is the safer measure.'
  ],
  formulaTitle: 'What is the IRR formula?',
  formula: {
    expr: '0 = CF<sub>0</sub> + CF<sub>1</sub> ÷ (1 + IRR) + CF<sub>2</sub> ÷ (1 + IRR)<sup>2</sup> + … + CF<sub>n</sub> ÷ (1 + IRR)<sup>n</sup>',
    vars: [['CF<sub>0</sub>', 'initial investment at time 0 (negative)'], ['CF<sub>t</sub>', 'net cash flow in period t'], ['IRR', 'the rate that solves the equation'], ['n', 'number of periods']],
    note: 'There is no algebraic solution for more than a few periods, so IRR is found by trial and error. The calculator uses Newton\'s method and falls back to bisection, the same idea as Excel\'s IRR function.'
  },
  example: `<p>Cash flows: −$10,000 today, then $3,000, $4,200 and $6,800 at the end of years 1–3.</p>
<p>Try 15%: −10,000 + 3,000 ÷ 1.15 + 4,200 ÷ 1.15<sup>2</sup> + 6,800 ÷ 1.15<sup>3</sup> = −10,000 + 2,608.70 + 3,175.80 + 4,471.11 = <strong>+$255.61</strong>. Positive, so the IRR is higher.</p>
<p>Try 17%: −10,000 + 2,564.10 + 3,068.16 + 4,245.72 = <strong>−$122.02</strong>. Negative, so the IRR is between 15% and 17%.</p>
<p>Narrowing in gives <strong>IRR = 16.34%</strong>, where the sum is $0.00.</p>`,
  table: {
    title: 'What IRR do common cash flow patterns produce?',
    intro: 'Example investments run through the calculator above (annual periods, 10% hurdle rate).',
    head: ['Cash flows', 'IRR', 'NPV at 10%', 'MIRR at 10%'],
    rows: ({ run }) => [
      ['-1000, 1100', 'Pay $1,000, get $1,100 in a year'],
      ['-1000, 500, 500, 500', '$1,000 for three $500 payments'],
      ['-10000, 3000, 4200, 6800', 'Default example'],
      ['-25000, 5000, 7000, 9000, 11000', 'Growing payback'],
      ['-50000, 15000, 18000, 20000, 12000', 'Equipment purchase'],
      ['-100000, 25000, 25000, 25000, 25000, 25000', 'Level 5-year annuity'],
      ['-200000, 0, 0, 0, 0, 350000', 'Buy, hold 5 years, sell'],
      ['-100000, 230000, -132000', 'Two sign changes']
    ].map(([f, d]) => { const r = run({ flows: f, per: '1', hurdle: 10 }); return [d + '<br><small>' + f.split(', ').join(', ') + '</small>', r.value || '—', r.rows ? r.rows[0][1] : '—', r.rows ? r.rows[1][1] : '—']; }),
    note: 'The last row has IRRs of both 10% and 20%; the calculator reports one of them. When flows change sign more than once, judge the project by NPV.'
  },
  sections: [
    {
      h2: 'How do you calculate IRR in Excel or Google Sheets?',
      html: `<p>Put the cash flows in one column in time order, initial investment first and negative, for example A1:A4 = −10000, 3000, 4200, 6800. Then type <code>=IRR(A1:A4)</code>. Excel returns 16.34%. If the flows are monthly, annualize with <code>=(1+IRR(A1:A37))^12-1</code>.</p>
<p>When payments fall on irregular dates, use <code>=XIRR(values, dates)</code>, which annualizes using the actual days between flows. For a version that assumes reinvestment at a set rate, use <code>=MIRR(values, finance_rate, reinvest_rate)</code>; with both rates at 10% the example gives 14.60%, matching the MIRR row above.</p>`
    },
    {
      h2: 'How do you calculate IRR on a BA II Plus or TI-84?',
      html: `<p><strong>BA II Plus:</strong> press <kbd>CF</kbd>, then <kbd>2nd</kbd> <kbd>CE|C</kbd> to clear. Enter CF0 = 10000 <kbd>+|−</kbd> <kbd>ENTER</kbd> <kbd>↓</kbd>; C01 = 3000 <kbd>ENTER</kbd> <kbd>↓</kbd>; F01 = 1 <kbd>↓</kbd>; C02 = 4200 <kbd>ENTER</kbd> <kbd>↓</kbd> <kbd>↓</kbd>; C03 = 6800 <kbd>ENTER</kbd>. Press <kbd>IRR</kbd> <kbd>CPT</kbd> to get 16.34. The F (frequency) field lets you enter repeated equal flows once.</p>
<p><strong>TI-84 Plus:</strong> press <kbd>APPS</kbd>, choose Finance, then <code>irr(</code>. Type <code>irr(-10000,{3000,4200,6800})</code> and press <kbd>ENTER</kbd>. An optional third argument lists frequencies for repeated flows.</p>`
    },
    {
      h2: 'What is a good IRR?',
      html: `<p>A good IRR is one above your cost of capital or the return you could earn elsewhere at similar risk. Rough benchmarks: a U.S. Treasury bond yield is the near-risk-free floor; broad stock index funds have historically returned about 10% a year before inflation over long periods; private equity and venture investors often target 20% or more to compensate for risk and illiquidity. Compare IRRs only between projects of similar size and length. A 50% IRR on $1,000 creates less wealth than a 15% IRR on $1 million, which is why the <a href="/npv-calculator">NPV calculator</a> is the better tool for choosing between them.</p>`
    },
    {
      h2: 'What is the difference between IRR and ROI?',
      html: `<p>ROI is the total gain divided by the cost, with no regard for timing: the example returns $14,000 on $10,000, an ROI of 40%. IRR is an annual rate that accounts for when each dollar arrives, so getting the $14,000 sooner would raise the IRR while leaving ROI unchanged. For a single lump sum in and out, IRR equals the compound annual growth rate. See the <a href="/roi-calculator">ROI calculator</a> and <a href="/cagr-calculator">CAGR calculator</a> for those measures.</p>`
    }
  ],
  faq: [
    { q: 'What does IRR tell you?', a: 'IRR is the annual return an investment earns over its life, given the size and timing of its cash flows. If it is above your required return, the investment adds value; if below, it destroys value.' },
    { q: 'What is the difference between IRR and NPV?', a: 'NPV is a dollar amount: the value an investment adds at a chosen discount rate. IRR is the rate at which NPV equals zero. NPV is better for comparing projects of different sizes; IRR is easier to compare with interest rates.' },
    { q: 'Can IRR be negative?', a: 'Yes. If you get back less than you put in, the IRR is negative. Paying $1,000 and receiving $900 a year later is an IRR of −10%.' },
    { q: 'Why does Excel give #NUM! for IRR?', a: 'Excel shows #NUM! when it cannot find a rate within 20 tries, usually because all flows have the same sign or the guess is far off. Check that the first flow is negative and add a guess, e.g. =IRR(A1:A10, 0.1).' },
    { q: 'What is MIRR and when should I use it?', a: 'Modified IRR assumes positive cash flows are reinvested at a rate you choose instead of at the IRR itself. It gives a more conservative figure and always has a single answer, so it is useful for projects with large or uneven inflows.' },
    { q: 'How do I calculate IRR for monthly cash flows?', a: 'Enter the monthly flows and choose "1 month" as the period. The calculator finds the monthly IRR and annualizes it as (1 + monthly IRR)^12 − 1.' },
    { q: 'Is IRR the same as annual return?', a: 'For one deposit and one withdrawal, yes: IRR equals the compound annual growth rate. With several deposits and withdrawals, IRR is the money-weighted annual return.' }
  ],
  related: ['npv-calculator', 'roi-calculator', 'cagr-calculator', 'wacc-calculator', 'compound-interest-calculator'],
  sources: [
    { name: 'Microsoft Support: IRR function', url: 'https://support.microsoft.com/en-us/office/irr-function-64925eaa-9988-495b-b290-3ad0c163c1bc' },
    { name: 'Microsoft Support: XIRR function', url: 'https://support.microsoft.com/en-us/office/xirr-function-de1242ec-6477-445b-b11b-a303ad9adc9d' },
    { name: 'Microsoft Support: MIRR function', url: 'https://support.microsoft.com/en-us/office/mirr-function-b020f038-7492-4fb4-93c1-35c345b53524' },
    { name: 'U.S. Treasury: Daily Treasury par yield curve rates', url: 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve' }
  ]
};
