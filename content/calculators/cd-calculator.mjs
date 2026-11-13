export default {
  slug: 'cd-calculator',
  hub: 'investing',
  name: 'CD Calculator',
  title: 'CD Calculator: $10,000 in a 12-Month CD at 4% APY Earns $400',
  h1: 'CD Calculator: Interest Earned and Value at Maturity',
  meta: 'A $10,000 one-year CD at 4.00% APY pays $400 and matures at $10,400. Enter any deposit, APY or rate, term and compounding to see what your CD earns.',
  keyword: 'how to calculate interest on a cd',
  also: ['cd calculator', 'how to calculate cd interest rate', 'how do you calculate cd interest', 'how to calculate cd returns', 'how is cd interest calculated', 'how to calculate interest earned on a cd', 'how to calculate a cd yield'],
  updated: '2026-11-13',
  inputs: [
    { id: 'deposit', label: 'Opening deposit', type: 'number', value: 10000, prefix: '$' },
    { id: 'rate', label: 'Rate', type: 'number', value: 4, suffix: '%' },
    { id: 'type', label: 'The rate is', type: 'select', value: 'apy', options: [['apy', 'APY (annual percentage yield)'], ['apr', 'Interest rate (nominal)']] },
    { id: 'comp', label: 'Compounding', type: 'select', value: '365', options: [['365', 'Daily'], ['12', 'Monthly'], ['4', 'Quarterly'], ['1', 'Annually']], showIf: { type: ['apr'] } },
    { id: 'months', label: 'Term', type: 'number', value: 12, suffix: 'months' },
    { id: 'tax', label: 'Tax rate on interest (optional)', type: 'number', value: '', suffix: '%', placeholder: 'e.g. 22' }
  ],
  compute(v, H) {
    if (!(v.deposit > 0)) return { error: 'Enter the amount you will deposit.' };
    if (!(v.rate >= 0) || v.rate > 50) return { error: 'Enter the CD rate (APY or interest rate).' };
    if (!(v.months > 0) || v.months > 600) return { error: 'Enter the term in months.' };
    var n = Number(v.comp) || 365;
    var apy, nominal;
    if (v.type === 'apr') { nominal = v.rate / 100; apy = Math.pow(1 + nominal / n, n) - 1; }
    else { apy = v.rate / 100; nominal = n * (Math.pow(1 + apy, 1 / n) - 1); }
    var years = v.months / 12;
    var value = v.deposit * Math.pow(1 + apy, years);
    var interest = value - v.deposit;
    var rows = [
      ['Value at maturity', H.money(value), true],
      ['APY', H.fix(apy * 100, 3) + '%'],
      [v.type === 'apr' ? 'Nominal rate' : 'Equivalent daily-compounded rate', H.pct((v.type === 'apr' ? nominal : 365 * (Math.pow(1 + apy, 1 / 365) - 1)) * 100, 3)],
      ['Interest per month (average)', H.money(interest / v.months)]
    ];
    if (v.tax > 0 && v.tax < 100) {
      rows.push(['Tax on interest', H.money(interest * v.tax / 100)]);
      rows.push(['Interest after tax', H.money(interest * (1 - v.tax / 100)), true]);
    }
    var tbl = [];
    if (v.months > 12) {
      for (var y = 1; y <= Math.ceil(years); y++) {
        var t = Math.min(y, years);
        var b = v.deposit * Math.pow(1 + apy, t);
        var prev = v.deposit * Math.pow(1 + apy, Math.max(0, y - 1));
        tbl.push([y === Math.ceil(years) && t < y ? 'Month ' + H.num(v.months, 0) : 'Year ' + y, H.money(b - prev), H.money(b)]);
      }
    }
    return {
      value: H.money(interest),
      label: 'Interest earned over ' + H.num(v.months, 1) + ' months',
      expr: H.money0(v.deposit) + ' × ((1 + ' + H.fix(apy * 100, 2) + '%)^' + H.num(years, 3) + ' − 1)',
      rows: rows,
      sub: 'Interest is FDIC-insured along with principal up to $250,000 per depositor, per bank, per ownership category.',
      table: tbl.length ? { head: ['Period', 'Interest credited', 'Balance'], rows: tbl, caption: 'Growth by year' } : undefined
    };
  },
  quick: ({ r }) => `To calculate interest on a CD, multiply the deposit by (1 + APY) raised to the term in years, then subtract the deposit. A <strong>$10,000</strong> CD at <strong>4.00% APY</strong> for 12 months earns <strong>${r.value}</strong> and matures at $10,400. The same CD for 18 months earns $605.96; for 5 years, $2,166.53.`,
  stepsTitle: 'How to calculate CD interest',
  steps: [
    'Enter the deposit and the rate from the bank\'s rate sheet. Banks must disclose the APY, which already includes compounding, so choose "APY" unless you only have the stated interest rate.',
    'If you entered a nominal rate, pick the compounding the bank uses (daily is most common). The calculator converts it to an APY.',
    'Enter the term in months: 3, 6, 12, 18, 24, 36 or 60 are the usual CD terms.',
    'Add your tax rate to see interest after federal tax. The step people skip: CD interest is taxable each year it is credited, even on a multi-year CD you have not cashed.'
  ],
  formulaTitle: 'What is the formula for CD interest?',
  formula: {
    expr: 'Maturity value = P × (1 + APY)<sup>months ÷ 12</sup><br>APY = (1 + r/n)<sup>n</sup> − 1 · Interest = Maturity value − P',
    vars: [['P', 'opening deposit'], ['APY', 'annual percentage yield, as a decimal'], ['r', 'nominal (stated) annual interest rate'], ['n', 'compounding periods per year (365 for daily)']],
    note: 'The formula assumes interest stays in the CD until maturity. If the bank pays interest out to checking each month, you earn the nominal rate without compounding, slightly less than the APY.'
  },
  example: `<p>You open an 18-month CD with $10,000 at 4.00% APY.</p>
<p>Term in years = 18 ÷ 12 = 1.5. Growth factor = 1.04<sup>1.5</sup> = 1.060596.</p>
<p>Maturity value = $10,000 × 1.060596 = <strong>$10,605.96</strong>. Interest earned = <strong>$605.96</strong>, of which $400.00 builds up in the first 12 months and $205.96 in the last six.</p>
<p>In the 22% federal bracket you owe about $133.31 of tax on that interest, leaving $472.65.</p>`,
  table: {
    title: 'How much interest does a $10,000 CD earn?',
    intro: 'Interest on a $10,000 deposit held to maturity, by term and APY, worked out by the calculator above.',
    head: ['Term', '3.00% APY', '3.50% APY', '4.00% APY', '4.50% APY', '5.00% APY'],
    rows: ({ run }) => [3, 6, 9, 12, 18, 24, 36, 48, 60].map(m => [m + ' months', ...[3, 3.5, 4, 4.5, 5].map(a => run({ deposit: 10000, rate: a, type: 'apy', months: m, tax: NaN }).value)]),
    note: 'For a different deposit, scale proportionally: $25,000 earns 2.5 times these amounts. Example rates only; compare current offers on the FDIC national rates page.'
  },
  sections: [
    {
      h2: 'What is the difference between a CD rate and its APY?',
      html: `<p>The rate (sometimes called the interest rate or dividend rate at credit unions) is the nominal annual rate before compounding. The APY is what you actually earn in a year with interest left in the account. Under the federal Truth in Savings rules, banks must show the APY, so it is the number to compare between banks.</p>
<p>The gap is small: 4.00% compounded daily is a 4.081% APY; compounded monthly, 4.074%. On $10,000 for a year, the gap between the stated rate and the APY is worth $7 to $8. If you have the APY, you don't need the compounding frequency at all.</p>`
    },
    {
      h2: 'How much does an early withdrawal cost?',
      html: `<p>Most banks charge a penalty measured in months of interest, often around three months on a one-year CD and six to twelve months on longer terms. The exact penalty is in the account agreement. On the $10,000 CD at 4.00% APY, three months of interest is about $99, so breaking the CD after six months would leave you with roughly $99 of the $198 you had earned.</p>
<p>No-penalty CDs avoid this but usually pay a lower APY. If you might need the money, a CD ladder (splitting the deposit across 6-, 12-, 18- and 24-month CDs) keeps part of it maturing every few months.</p>`
    },
    {
      h2: 'Is CD interest paid monthly or at maturity?',
      html: `<p>CDs of a year or less usually pay all interest at maturity. Longer CDs often credit interest monthly or quarterly into the CD (compounding) or let you have it paid to a checking account. Either way, the IRS treats the interest as income in the year it is credited or made available, and the bank reports it on Form 1099-INT.</p>`
    },
    {
      h2: 'Is a CD better than a high-yield savings account?',
      html: `<p>A CD locks in its rate for the whole term, while a savings account rate can fall at any time. If savings rates drop by a point during the year, a CD that started at the same APY earns more. The trade-off is access to your money. Both are FDIC-insured to $250,000 per depositor, per bank, per ownership category. To see how monthly deposits grow in a savings account, use the <a href="/compound-interest-calculator">compound interest calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much interest will I earn on $10,000 in a CD for 1 year?', a: 'At 4.00% APY you earn $400 in a year. At 4.50% APY it is $450, and at 5.00% APY, $500. With the APY, one-year interest is simply deposit × APY.' },
    { q: 'How much does a $5,000 CD earn in 6 months?', a: 'At 4.00% APY a $5,000 six-month CD earns $99.02. Half a year is (1.04)^0.5 − 1 = 1.98%, not a full 4%.' },
    { q: 'How much would a $100,000 CD earn?', a: 'At 4.00% APY a $100,000 one-year CD earns $4,000. Over 5 years at the same APY it earns $21,665.29.' },
    { q: 'Are CD rates quoted per year?', a: 'Yes. A CD rate and APY are always annual, even on a 3-month CD. A 3-month CD at 4.00% APY earns about 0.99% over its term.' },
    { q: 'What happens when a CD matures?', a: 'You usually get a grace period of 7 to 10 days to withdraw or move the money. If you do nothing, most banks renew it automatically for the same term at the current rate.' },
    { q: 'Do you pay taxes on CD interest?', a: 'Yes. CD interest is ordinary income taxed at your federal bracket and usually state income tax, in the year it is credited. CDs held inside an IRA are taxed only when you withdraw.' },
    { q: 'Is a CD over $250,000 insured?', a: 'FDIC insurance covers $250,000 per depositor, per insured bank, for each ownership category. Above that, spread deposits across banks or ownership categories such as joint or trust accounts.' }
  ],
  related: ['compound-interest-calculator', 'apy-calculator', 'simple-interest-calculator', 'inflation-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Certificates of Deposit (CDs)', url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/certificates-deposit-cds' },
    { name: 'FDIC: Understanding Deposit Insurance', url: 'https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance' },
    { name: 'FDIC: National Rates and Rate Caps', url: 'https://www.fdic.gov/national-rates-and-rate-caps' }
  ]
};
