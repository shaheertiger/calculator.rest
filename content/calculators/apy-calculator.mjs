export default {
  slug: 'apy-calculator',
  hub: 'loans',
  name: 'APY Calculator',
  title: 'APY Calculator: 6% APR Compounded Monthly Is 6.168% APY',
  h1: 'APY and Effective Interest Rate Calculator (APR to APY and Back)',
  meta: '6% compounded monthly is an effective annual rate of 6.168%, so $10,000 earns $616.78 in a year. Convert any APR to APY, or APY back to APR, at any compounding.',
  keyword: 'how to calculate effective interest rate',
  also: ['apy calculator', 'how to calculate interest apy', 'how to calculate effective interest rate excel', 'how to calculate effective interest rate in excel', 'how to calculate effective interest rate using excel', 'effective annual rate calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Convert', type: 'select', value: 'toapy', options: [['toapy', 'APR (nominal) → APY (effective)'], ['toapr', 'APY (effective) → APR (nominal)']] },
    { id: 'rate', label: 'Rate', type: 'number', value: 6, suffix: '%' },
    { id: 'comp', label: 'Compounding', type: 'select', value: '12', options: [['1', 'Annually'], ['2', 'Semiannually'], ['4', 'Quarterly'], ['12', 'Monthly'], ['26', 'Biweekly'], ['52', 'Weekly'], ['365', 'Daily'], ['cont', 'Continuously']] },
    { id: 'deposit', label: 'Balance (optional)', type: 'number', value: 10000, prefix: '$', help: 'Shows the dollars of interest over one year.' }
  ],
  compute(v, H) {
    if (!(v.rate >= 0) || v.rate > 1000) return { error: 'Enter a rate between 0% and 1,000%.' };
    var cont = v.comp === 'cont';
    var n = cont ? Infinity : Number(v.comp) || 12;
    var names = { '1': 'annually', '2': 'semiannually', '4': 'quarterly', '12': 'monthly', '26': 'biweekly', '52': 'weekly', '365': 'daily', 'cont': 'continuously' };
    var apr, apy;
    if (v.mode === 'toapr') {
      apy = v.rate / 100;
      apr = cont ? Math.log(1 + apy) : n * (Math.pow(1 + apy, 1 / n) - 1);
    } else {
      apr = v.rate / 100;
      apy = cont ? Math.exp(apr) - 1 : Math.pow(1 + apr / n, n) - 1;
    }
    var rows = [
      [v.mode === 'toapr' ? 'APY entered' : 'APR entered', H.pct(v.rate, 4)],
      ['Rate per period', cont ? 'continuous' : H.pct(apr / n * 100, 5) + ' × ' + n + ' periods'],
      ['Extra from compounding', '+' + H.fix((apy - apr) * 100, 3) + ' pts']
    ];
    if (v.deposit > 0) {
      rows.push(['Interest on ' + H.money0(v.deposit) + ' in one year', H.money(v.deposit * apy), true]);
      rows.push(['Same rate with no compounding', H.money(v.deposit * apr)]);
      rows.push(['Balance after one year', H.money(v.deposit * (1 + apy))]);
    }
    var out = v.mode === 'toapr' ? apr : apy;
    return {
      value: H.pct(out * 100, 3),
      label: v.mode === 'toapr' ? 'Nominal APR, compounded ' + names[v.comp] : 'APY (effective annual rate)',
      expr: v.mode === 'toapr' ? H.pct(v.rate, 3) + ' APY, ' + names[v.comp] : cont ? 'e^' + H.num(apr, 4) + ' − 1' : '(1 + ' + H.num(apr, 4) + '/' + n + ')^' + n + ' − 1',
      rows: rows,
      sub: 'An APY tells you what a rate earns (or costs) over a full year once interest is added to the balance ' + names[v.comp] + '.'
    };
  },
  quick: ({ r }) => `To calculate the effective interest rate, use (1 + r/n)<sup>n</sup> − 1, where r is the nominal rate and n the compounding periods per year. A <strong>6%</strong> rate compounded monthly is (1 + 0.06/12)<sup>12</sup> − 1 = <strong>${r.value}</strong>, so $10,000 earns $616.78 in a year instead of $600. Daily compounding gives 6.183%; continuous, 6.184%.`,
  stepsTitle: 'How to convert APR to APY',
  steps: [
    'Write the nominal rate as a decimal: 6% → 0.06.',
    'Divide by the number of compounding periods in a year to get the periodic rate: 0.06 ÷ 12 = 0.005 for monthly.',
    'Add 1 and raise to the number of periods: 1.005<sup>12</sup> = 1.061678.',
    'Subtract 1 and convert back to a percentage: 6.168%. Skipping the "subtract 1" step, or using 365 periods for a rate that compounds monthly, are the usual errors.'
  ],
  formulaTitle: 'What is the formula for effective annual rate (APY)?',
  formula: {
    expr: 'APY = (1 + r ÷ n)<sup>n</sup> − 1<br>Continuous: APY = e<sup>r</sup> − 1<br>Back to APR: r = n × ((1 + APY)<sup>1/n</sup> − 1)',
    vars: [['r', 'nominal annual rate (APR) as a decimal'], ['n', 'compounding periods per year (12 monthly, 365 daily)'], ['APY', 'annual percentage yield, also called the effective annual rate (EAR)']],
    note: 'For deposit accounts, Regulation DD (Truth in Savings) defines APY from the dollars actually earned: APY = 100 × [(1 + Interest ÷ Principal)<sup>365 ÷ days in term</sup> − 1]. For a one-year term it gives the same answer.'
  },
  example: `<p>A savings account pays 4.40% interest compounded daily. A CD pays 4.45% compounded quarterly. Which earns more?</p>
<p>Savings: (1 + 0.044 ÷ 365)<sup>365</sup> − 1 = <strong>4.498% APY</strong>.</p>
<p>CD: (1 + 0.0445 ÷ 4)<sup>4</sup> − 1 = <strong>4.525% APY</strong>.</p>
<p>The CD's higher APY wins despite less frequent compounding. On $25,000 that is $1,131.20 a year versus $1,124.49. Compare APYs, never the nominal rates.</p>`,
  table: {
    title: 'What is the APY for each APR and compounding frequency?',
    intro: 'Effective annual rates computed by the calculator above. Read across to see how much compounding frequency adds.',
    head: ['APR', 'Annually', 'Quarterly', 'Monthly', 'Daily', 'Continuously'],
    rows: ({ run }) => [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 18, 24, 30].map(a => [a + '%', ...['1', '4', '12', '365', 'cont'].map(c => run({ mode: 'toapy', rate: a, comp: c }).value)]),
    note: 'The jump from annual to monthly compounding is far larger than from monthly to daily. At typical savings rates of 4–5%, daily compounding adds only about 0.01 point over monthly.'
  },
  sections: [
    {
      h2: 'How do you calculate the effective interest rate in Excel?',
      html: `<p>Excel and Google Sheets have built-in functions for both directions:</p>
<ul>
<li><code>=EFFECT(6%, 12)</code> → 6.168% (nominal to effective, monthly compounding).</li>
<li><code>=NOMINAL(6.168%, 12)</code> → 6.000% (effective back to nominal).</li>
<li>Daily: <code>=EFFECT(6%, 365)</code> → 6.183%. Continuous: <code>=EXP(6%) − 1</code> → 6.184%.</li>
</ul>
<p>If you are working from dollars rather than rates, use the Regulation DD formula: <code>=(1 + interest/principal)^(365/days) − 1</code>. $10,000 that earns $616.78 in 365 days has an APY of 6.168%.</p>`
    },
    {
      h2: 'What is the effective interest rate on a loan or credit card?',
      html: `<p>Lenders quote APR, which by law does not include compounding, so the yearly cost of a revolving balance is higher than the headline rate. A credit card at 24% APR that compounds daily has an effective rate of <strong>27.11%</strong>. A 6.5% mortgage, which compounds monthly, has an effective rate of 6.697%, but because the balance is paid down every month you never actually pay that rate on a fixed amount for a year.</p>
<p>Savings products work the other way: the Truth in Savings Act requires banks to advertise the APY so you can compare accounts that compound differently. For an installment loan's APR including fees, use the <a href="/apr-calculator">APR calculator</a>.</p>`
    },
    {
      h2: 'Does compounding frequency make a big difference?',
      html: `<p>Less than most people think, once interest compounds at least monthly. At 5%, annual compounding gives 5.000%, monthly 5.116%, daily 5.127% and continuous 5.127%. On $10,000 the gap between monthly and daily is about $1.06 a year.</p>
<p>The rate itself matters far more. The FDIC's October 2026 national averages were 0.38% for savings accounts and 1.76% for 12-month CDs, while many online banks paid several times that. Over many years the difference compounds: use the <a href="/compound-interest-calculator">compound interest calculator</a> for multi-year growth with deposits, or the <a href="/cd-calculator">CD calculator</a> for a fixed term.</p>`
    }
  ],
  faq: [
    { q: 'What is the APY of 5% compounded daily?', a: '5.127%. (1 + 0.05 ÷ 365)^365 − 1 = 0.05127. Compounded monthly it would be 5.116%.' },
    { q: 'What APR gives a 4.5% APY with monthly compounding?', a: '4.41%. Switch the calculator to APY → APR: 12 × (1.045^(1/12) − 1) = 0.04410.' },
    { q: 'Is APY the same as the effective annual rate?', a: 'Yes. APY is the consumer-banking name for the effective annual rate (EAR). Both include the effect of compounding over one year.' },
    { q: 'Is a higher APY always better?', a: 'For savings, yes, if the other terms are equal: it is the yield after compounding. Check whether the rate is variable, whether it applies only to part of the balance, and any fees or minimums that would cut what you actually earn.' },
    { q: 'How is APY different from APR?', a: 'APR is the yearly rate without compounding, used for loans. APY includes compounding and is used for deposit accounts. For the same rate, APY is equal to or higher than APR.' },
    { q: 'How often do savings accounts compound interest?', a: 'Many compound daily and credit interest monthly, but some compound monthly or quarterly. The account disclosure must state the compounding and crediting frequency along with the APY.' }
  ],
  related: ['apr-calculator', 'simple-interest-calculator', 'compound-interest-calculator', 'cd-calculator', 'credit-card-interest-calculator'],
  sources: [
    { name: 'CFPB: Regulation DD (Truth in Savings), Appendix A: APY calculation', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/a/' },
    { name: 'FDIC: National Rates and Rate Caps', url: 'https://www.fdic.gov/national-rates-and-rate-caps' },
    { name: 'CFPB: What is a credit card interest rate? What does APR mean?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-card-interest-rate-what-does-apr-mean-en-44/' },
    { name: 'Investor.gov (SEC): Compound interest calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' }
  ]
};
