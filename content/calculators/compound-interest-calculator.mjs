export default {
  slug: 'compound-interest-calculator',
  hub: 'investing',
  name: 'Compound Interest Calculator',
  title: 'Compound Interest Calculator: $10K + $200/mo at 7% = $54,714',
  h1: 'Compound Interest Calculator With Monthly Deposits',
  meta: '$10,000 plus $200 a month at 7% compounded monthly grows to $54,713.58 in 10 years, $20,713.58 of it interest. Try your own savings, rate and term.',
  keyword: 'how to calculate interest earned',
  also: ['compound interest calculator', 'how to calculate interest earned on savings account', 'how is interest calculated on savings account', 'compound interest calculator with monthly contributions', 'how much interest will i earn'],
  updated: '2026-11-13',
  inputs: [
    { id: 'principal', label: 'Starting balance', type: 'number', value: 10000, prefix: '$' },
    { id: 'monthly', label: 'Monthly deposit', type: 'number', value: 200, prefix: '$', help: 'Use 0 for a one-time deposit.' },
    { id: 'rate', label: 'Annual interest rate', type: 'number', value: 7, suffix: '%' },
    { id: 'comp', label: 'Compounding', type: 'select', value: '12', options: [['365', 'Daily'], ['12', 'Monthly'], ['4', 'Quarterly'], ['2', 'Semiannually'], ['1', 'Annually']] },
    { id: 'years', label: 'Years', type: 'number', value: 10, suffix: 'years' },
    { id: 'timing', label: 'Deposits made at', type: 'select', value: 'end', options: [['end', 'End of each month'], ['start', 'Start of each month']] }
  ],
  compute(v, H) {
    var P = v.principal >= 0 ? v.principal : 0;
    var D = v.monthly >= 0 ? v.monthly : 0;
    if (!(P > 0) && !(D > 0)) return { error: 'Enter a starting balance or a monthly deposit.' };
    if (!(v.rate > -100) || isNaN(v.rate)) return { error: 'Enter an annual interest rate.' };
    if (!(v.years > 0) || v.years > 100) return { error: 'Enter a term between 0 and 100 years.' };
    var n = Number(v.comp) || 12;
    var i = Math.pow(1 + v.rate / 100 / n, n / 12) - 1;
    var months = Math.round(v.years * 12);
    var bal = P, dep = P, sched = [];
    for (var m = 1; m <= months; m++) {
      if (v.timing === 'start') { bal += D; bal *= 1 + i; } else { bal *= 1 + i; bal += D; }
      dep += D;
      if (m % 12 === 0 || m === months) sched.push([String(Math.ceil(m / 12)), H.money(dep), H.money(bal - dep), H.money(bal)]);
    }
    var interest = bal - dep;
    var apy = (Math.pow(1 + v.rate / 100 / n, n) - 1) * 100;
    return {
      value: H.money(bal),
      label: 'Balance after ' + H.plural(v.years, 'year'),
      expr: H.money0(P) + ' + ' + H.money0(D) + '/mo at ' + H.num(v.rate, 3) + '%',
      rows: [
        ['Interest earned', H.money(interest), true],
        ['Total deposits', H.money(dep)],
        ['Interest share of balance', H.pct(bal > 0 ? interest / bal * 100 : 0, 1)],
        ['Effective annual yield (APY)', H.pct(apy, 3)]
      ],
      sub: interest > dep ? 'Interest has overtaken everything you put in.' : 'Interest is ' + H.pct(interest / dep * 100, 0) + ' of what you deposited; the gap closes faster each year.',
      table: { head: ['Year', 'Deposits', 'Interest', 'Balance'], rows: sched, caption: 'Year-by-year growth' }
    };
  },
  quick: ({ r }) => `To calculate interest earned, grow the balance at the periodic rate and subtract what you deposited. <strong>$10,000</strong> plus <strong>$200 a month</strong> at <strong>7%</strong> compounded monthly becomes <strong>${r.value}</strong> after 10 years. You put in $34,000, so the interest earned is <strong>$20,713.58</strong>, about 38% of the final balance.`,
  stepsTitle: 'How to calculate compound interest earned',
  steps: [
    'Enter what is in the account today and what you will add each month. Leave the monthly deposit at 0 to see a lump sum grow on its own.',
    'Type the annual rate as quoted (the APR or nominal rate, not the APY) and pick how often the bank or fund compounds. Savings accounts usually compound daily; bonds and CDs often monthly or semiannually.',
    'Set the number of years. The year-by-year table under the result shows deposits, interest and balance for each year.',
    'Read <strong>interest earned</strong>, not the balance, when you want to know what the money made. The common mistake is to compare the final balance with the starting balance and forget the monthly deposits.'
  ],
  formulaTitle: 'What is the compound interest formula?',
  formula: {
    expr: 'A = P(1 + r/n)<sup>nt</sup> + D × [(1 + i)<sup>12t</sup> − 1] ÷ i<br>i = (1 + r/n)<sup>n/12</sup> − 1 · Interest = A − P − 12tD',
    vars: [['A', 'ending balance'], ['P', 'starting principal'], ['r', 'annual rate as a decimal'], ['n', 'compounding periods per year'], ['t', 'years'], ['D', 'deposit made at the end of each month'], ['i', 'equivalent monthly rate']],
    note: 'For deposits at the start of each month, multiply the deposit term by (1 + i). With daily or annual compounding the calculator converts the rate to an equivalent monthly rate so each deposit earns interest from the month it arrives.'
  },
  example: `<p>Start with $10,000, add $200 at the end of every month, earn 7% compounded monthly for 10 years.</p>
<p>Monthly rate i = 0.07 ÷ 12 = 0.5833%. Growth factor over 120 months = 1.005833<sup>120</sup> = 2.0097.</p>
<p>Lump sum: $10,000 × 2.0097 = <strong>$20,096.61</strong>. Deposits: $200 × (2.0097 − 1) ÷ 0.005833 = <strong>$34,616.96</strong>.</p>
<p>Balance = $20,096.61 + $34,616.96 = <strong>$54,713.58</strong>. Deposits total $10,000 + 120 × $200 = $34,000, so interest earned = <strong>$20,713.58</strong>.</p>`,
  table: {
    title: 'How much will $10,000 plus $200 a month grow to?',
    intro: 'Balances at 7% compounded monthly, deposits at month end, worked out by the calculator above. The interest column shows how compounding takes over in later years.',
    head: ['Years', 'You deposit', 'Interest earned', 'Balance'],
    rows: ({ run, H }) => [1, 3, 5, 10, 15, 20, 25, 30, 40].map(y => {
      const r = run({ years: y });
      const dep = 10000 + 2400 * y;
      return [String(y), H.money0(dep), r.rows[0][1], r.value];
    }),
    note: 'At 30 years the interest ($243,159) is almost three times the $82,000 deposited. Real returns vary; stock funds do not pay a fixed rate.'
  },
  sections: [
    {
      h2: 'How do you calculate interest earned on a savings account?',
      html: `<p>Banks quote an APY and accrue interest daily on the closing balance, then credit it monthly. For a rough figure, multiply the balance by the APY: $15,000 at 4.00% APY earns about <strong>$600</strong> in a year if you add nothing. Monthly, that is about $50.</p>
<p>If you add money during the year, each deposit only earns interest for the months it sits in the account. That is why this calculator works month by month instead of applying one rate to the year-end total. To compare an APY with a nominal rate, use the <a href="/apy-calculator">APY calculator</a>.</p>`
    },
    {
      h2: 'Does compounding frequency make a big difference?',
      html: `<p>Less than most people think. On $10,000 at 7% for 10 years with no deposits:</p>
<ul><li>Annually: $19,671.51</li><li>Quarterly: $20,015.97</li><li>Monthly: $20,096.61</li><li>Daily: $20,136.18</li></ul>
<p>Going from annual to daily adds only about $465 over a decade. The rate and the number of years matter far more: the same $10,000 left for 30 years at 7% monthly reaches $81,164.97.</p>`
    },
    {
      h2: 'What is the rule of 72?',
      html: `<p>Divide 72 by the annual rate to estimate how many years it takes money to double. At 7%, 72 ÷ 7 ≈ 10.3 years, which matches the table: $10,000 alone reaches $20,097 in 10 years. At 4% it takes about 18 years; at 10%, about 7.2. The shortcut works best between 6% and 10%.</p>`
    },
    {
      h2: 'Simple vs. compound interest: what changes?',
      html: `<p>Simple interest pays only on the original principal: $10,000 at 7% simple earns $700 a year, $7,000 over 10 years. Compound interest also pays on interest already credited, so the same deposit earns $10,096.61 over 10 years with monthly compounding. Loans such as most auto loans charge simple interest on the remaining balance; see the <a href="/simple-interest-calculator">simple interest calculator</a> for those.</p>`
    }
  ],
  faq: [
    { q: 'How much interest will $10,000 earn in a year?', a: 'At 7% compounded monthly, $10,000 earns $722.90 in one year. At a 4% savings APY it earns $400, and at 5% APY, $500.' },
    { q: 'How much is $100,000 at 7% for 30 years?', a: 'With monthly compounding and no further deposits, $100,000 at 7% grows to about $811,650 in 30 years. Compounded annually it is $761,226.' },
    { q: 'How much will $500 a month be worth in 30 years?', a: 'Saving $500 at the end of each month at 7% compounded monthly gives about $609,985 after 30 years. You deposit $180,000; the other $429,985 is interest.' },
    { q: 'Is compound interest calculated monthly or annually?', a: 'It depends on the account. Most U.S. savings accounts compound daily and credit monthly, many CDs compound daily or monthly, and some bonds compound semiannually. The APY already includes the effect of compounding.' },
    { q: 'Should I enter the APR or the APY?', a: 'Enter the nominal annual rate (APR) with its compounding frequency. If you only know the APY, choose annual compounding and enter the APY as the rate; the result will match.' },
    { q: 'Are stock market returns compound interest?', a: 'Reinvested dividends and price growth compound in the same way, but returns are not fixed. Use a long-run average such as 6–7% after inflation only as a planning assumption, not a promise.' },
    { q: 'Is interest earned taxable?', a: 'Yes. Interest from savings accounts, CDs and bonds is taxed as ordinary income in the year it is credited, unless it is inside a tax-advantaged account such as an IRA or 401(k).' }
  ],
  related: ['cd-calculator', 'apy-calculator', 'simple-interest-calculator', 'millionaire-calculator', 'roi-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    { name: 'SEC Investor.gov: Compound interest (glossary)', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest' },
    { name: 'FDIC: National Rates and Rate Caps', url: 'https://www.fdic.gov/national-rates-and-rate-caps' }
  ]
};
