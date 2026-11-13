export default {
  slug: 'net-worth-calculator',
  hub: 'investing',
  name: 'Net Worth Calculator',
  title: 'Net Worth Calculator: $585K Assets − $313.5K Debts = $271,500',
  h1: 'Net Worth Calculator: Add Up What You Own and What You Owe',
  meta: 'A household with $585,000 of assets and $313,500 of debt has a net worth of $271,500, above the $253,700 Fed median for ages 45–54. Find your number.',
  keyword: 'how do i calculate net worth',
  also: ['net worth calculator', 'how to calculate net worth', 'median net worth by age', 'how to calculate pension into net worth', 'how to calculate value of pension for net worth'],
  updated: '2026-11-13',
  inputs: [
    { id: 'cash', label: 'Cash: checking, savings, CDs', type: 'number', value: 15000, prefix: '$' },
    { id: 'retire', label: 'Retirement accounts: 401(k), IRA, HSA', type: 'number', value: 120000, prefix: '$' },
    { id: 'invest', label: 'Taxable investments: brokerage, crypto', type: 'number', value: 25000, prefix: '$' },
    { id: 'home', label: 'Home and other real estate (market value)', type: 'number', value: 400000, prefix: '$' },
    { id: 'cars', label: 'Vehicles (resale value)', type: 'number', value: 20000, prefix: '$' },
    { id: 'otherA', label: 'Other assets: business, pension value, valuables', type: 'number', value: 5000, prefix: '$' },
    { id: 'mortgage', label: 'Mortgages and home equity loans', type: 'number', value: 280000, prefix: '$' },
    { id: 'auto', label: 'Car loans', type: 'number', value: 12000, prefix: '$' },
    { id: 'student', label: 'Student loans', type: 'number', value: 18000, prefix: '$' },
    { id: 'cards', label: 'Credit card balances', type: 'number', value: 3500, prefix: '$' },
    { id: 'otherL', label: 'Other debts: personal loans, medical, taxes owed', type: 'number', value: 0, prefix: '$' },
    { id: 'age', label: 'Age of household head (for comparison)', type: 'select', value: '45', options: [['u35', 'Under 35'], ['35', '35–44'], ['45', '45–54'], ['55', '55–64'], ['65', '65–74'], ['75', '75 or older']] }
  ],
  data: { median: { u35: 33000, '35': 155600, '45': 253700, '55': 411900, '65': 431300, '75': 504900 }, label: { u35: 'under 35', '35': '35–44', '45': '45–54', '55': '55–64', '65': '65–74', '75': '75+' } },
  compute(v, H, D) {
    function z(x) { return x > 0 ? x : 0; }
    var assets = z(v.cash) + z(v.retire) + z(v.invest) + z(v.home) + z(v.cars) + z(v.otherA);
    var debts = z(v.mortgage) + z(v.auto) + z(v.student) + z(v.cards) + z(v.otherL);
    if (!assets && !debts) return { error: 'Enter at least one asset or debt.' };
    var nw = assets - debts;
    var liquid = z(v.cash) + z(v.invest);
    var homeEq = z(v.home) - z(v.mortgage);
    var exHome = nw - homeEq;
    var med = D.median[v.age] || D.median['45'];
    var rows = [
      ['Total assets', H.money(assets, 0)],
      ['Total liabilities', H.money(debts, 0)],
      ['Home equity', H.money(homeEq, 0)],
      ['Net worth without home equity', H.money(exHome, 0), true],
      ['Cash and taxable investments', H.money(liquid, 0)],
      ['Debt-to-asset ratio', assets ? H.pct(debts / assets * 100, 1) : '—'],
      ['Fed median for ages ' + D.label[v.age], H.money(med, 0)]
    ];
    var ratio = nw / med;
    var sub = nw < 0 ? 'Negative net worth: you owe more than you own. Common early in a career with student loans; paying down high-interest debt first raises it fastest.'
      : 'Your net worth is ' + (nw >= med ? H.num(ratio, 2) + '× ' : H.pct(ratio * 100, 0) + ' of ') + 'the median for households headed by someone ' + D.label[v.age] + ' in the Federal Reserve\'s 2025 survey.';
    return {
      value: H.money(nw, 0),
      label: 'Net worth',
      expr: H.money(assets, 0) + ' − ' + H.money(debts, 0),
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate net worth, add up the current value of everything you own and subtract everything you owe. A household with $585,000 in assets (home, retirement savings, cash, cars) and $313,500 in debts (mortgage, loans, cards) has a net worth of <strong>${r.value}</strong>. The Federal Reserve's 2025 survey puts the U.S. median at $215,900 for all families and $253,700 for ages 45–54.`,
  stepsTitle: 'How to calculate your net worth',
  steps: [
    'List every asset at what it would sell for today, not what you paid. Use your latest account statements, a recent home value estimate and private-party car value.',
    'Include retirement accounts at their full balance, but remember pre-tax 401(k) and IRA money will owe income tax when withdrawn.',
    'List every debt at its current payoff balance: mortgage, home equity line, car loans, student loans, credit cards, personal loans, medical bills and any taxes owed.',
    'Subtract total debts from total assets. The most common mistake is counting the home at its value but forgetting the mortgage against it, or counting household goods at purchase price.',
    'Write the number down and repeat every 6 or 12 months on the same date. The trend matters more than any single figure.'
  ],
  formulaTitle: 'What is the net worth formula?',
  formula: {
    expr: 'Net worth = Total assets − Total liabilities<br>Net worth without home equity = Net worth − (Home value − Mortgage)<br>Debt-to-asset ratio = Total liabilities ÷ Total assets',
    vars: [['Total assets', 'cash + investments + retirement accounts + real estate + vehicles + other property, at market value'], ['Total liabilities', 'the payoff balance of every debt'], ['Home equity', 'market value of the home minus what you owe on it']]
  },
  example: `<p>Sam and Alex, both 47, own:</p>
<p>Cash $15,000 + retirement accounts $120,000 + brokerage $25,000 + home $400,000 + cars $20,000 + other $5,000 = <strong>$585,000 in assets</strong>.</p>
<p>They owe: mortgage $280,000 + car loan $12,000 + student loans $18,000 + credit cards $3,500 = <strong>$313,500 in debts</strong>.</p>
<p>Net worth = $585,000 − $313,500 = <strong>$271,500</strong>. Of that, $120,000 is home equity, so their net worth outside the house is $151,500. Their debt-to-asset ratio is $313,500 ÷ $585,000 = 53.6%.</p>`,
  table: {
    title: 'What is the median net worth by age in the U.S.?',
    intro: 'Median and mean family net worth from the Federal Reserve\'s 2025 Survey of Consumer Finances (published October 2026), compared with the example household above.',
    head: ['Age of household head', 'Median', 'Mean', '$271,500 is'],
    rows: ({ H }) => [['Under 35', 33000, 135400], ['35–44', 155600, 681900], ['45–54', 253700, 1244500], ['55–64', 411900, 1878000], ['65–74', 431300, 1897600], ['75 or older', 504900, 1962200], ['All families', 215900, 1241500]].map(x => [x[0], H.money(x[1], 0), H.money(x[2], 0), 271500 >= x[1] ? H.num(271500 / x[1], 1) + '× the median' : H.pct(271500 / x[1] * 100, 0) + ' of the median']),
    note: 'Means are far above medians because a small number of very wealthy households pull the average up. The median, the household in the middle, is the better yardstick. Homeowners had a median net worth of $458,900; renters, $10,600.'
  },
  sections: [
    {
      h2: 'What counts as an asset and what counts as a liability?',
      html: `<p><strong>Assets</strong> are things with a resale value: bank balances, CDs, stocks, bonds, mutual funds, 401(k)s and IRAs, HSAs, cash-value life insurance, real estate, vehicles, a share of a business, and valuables you could actually sell (jewelry, collectibles). Furniture, clothes and electronics are worth a fraction of what you paid; most people leave them out or list a small amount.</p>
<p><strong>Liabilities</strong> are any balance you would need to pay off: mortgages and HELOCs, car loans, student loans, credit cards, personal and payday loans, buy-now-pay-later plans, medical debt, money owed to family and unpaid taxes.</p>
<p>Leave out income you have not earned yet (future salary) and bills you have not received yet (next month's rent). Net worth is a snapshot of today.</p>`
    },
    {
      h2: 'Should you count your home and retirement accounts?',
      html: `<p>Yes for your total net worth, which is how the Federal Reserve measures it. But track two other figures too:</p>
<ul><li><strong>Net worth without home equity:</strong> you have to live somewhere, so equity in your primary home is hard to spend. In the example, $151,500 of the $271,500 is outside the house.</li>
<li><strong>Liquid net worth:</strong> cash and taxable investments minus non-mortgage debt. It shows what you could reach in an emergency without selling the house or paying early-withdrawal penalties.</li></ul>
<p>For a more conservative figure, cut pre-tax retirement balances by your expected tax rate in retirement. $120,000 in a traditional 401(k) at a 15% future tax rate is worth about $102,000 after tax; a Roth IRA balance needs no haircut.</p>`
    },
    {
      h2: 'How do you include a pension or Social Security in net worth?',
      html: `<p>Standard net worth statements, including the Fed's survey, leave out defined-benefit pensions and Social Security because you cannot sell or borrow against them. If you want to include a pension, use its present value: the lump sum it is equivalent to today. A $2,000-a-month pension starting at 65 is worth roughly $304,000 at 65 at a 5% discount rate, and less at younger ages because of the wait.</p>
<p>Use the <a href="/pension-calculator">pension lump sum calculator</a> to get that figure, then put it in "Other assets" and keep a note that it is not spendable. Most planners keep Social Security out of net worth and treat it as income in a retirement plan.</p>`
    },
    {
      h2: 'What is a good net worth for your age?',
      html: `<p>Beating the median for your age group in the table above puts you ahead of half of U.S. households. Another widely quoted target from <em>The Millionaire Next Door</em> is:</p>
<p><strong>Target net worth = Age × Annual pre-tax household income ÷ 10</strong></p>
<p>At 47 with $120,000 of income, that is 47 × $120,000 ÷ 10 = $564,000. People at twice the target or more are the book's "prodigious accumulators"; those at half of it or less are "under accumulators". The authors exclude inheritances from income, and the formula ignores the cost of where you live, so use it as a rough check, not a grade.</p>
<p>For a forward-looking goal, the <a href="/fire-calculator">FIRE calculator</a> works out the net worth you need to stop working: usually 25 times your yearly spending.</p>`
    }
  ],
  faq: [
    { q: 'What is the average net worth in the U.S.?', a: 'The mean family net worth was $1,241,500 in the Federal Reserve\'s 2025 Survey of Consumer Finances, but the median, a better measure of a typical household, was $215,900.' },
    { q: 'What does negative net worth mean?', a: 'It means your debts are larger than your assets. It is common for recent graduates with student loans or new homeowners who put little down. Paying off high-interest debt and building savings brings it back above zero.' },
    { q: 'Do you include your car in net worth?', a: 'Yes, at what it would sell for today, with the car loan listed as a debt. Cars lose value every year, so a car bought with a loan often adds little or nothing to net worth.' },
    { q: 'Is net worth calculated before or after taxes?', a: 'The standard calculation uses pre-tax balances. For a stricter after-tax view, reduce traditional 401(k) and IRA balances by the income tax you expect to pay on withdrawal, and subtract capital gains tax owed on taxable investments.' },
    { q: 'Is home equity part of net worth?', a: 'Yes. Home equity, the market value minus the mortgage balance, is part of total net worth and is the largest asset for most middle-income families. Many people also track net worth without it.' },
    { q: 'How often should I calculate my net worth?', a: 'Once or twice a year is enough for most people, on the same date each time. Monthly tracking mostly shows stock market noise.' },
    { q: 'What is the median net worth for a 50-year-old?', a: 'For households headed by someone aged 45–54, the median net worth was $253,700 in the Fed\'s 2025 survey. For ages 55–64 it was $411,900.' }
  ],
  related: ['pension-calculator', 'debt-to-asset-ratio-calculator', 'millionaire-calculator', 'fire-calculator', 'retirement-calculator'],
  sources: [
    { name: 'Federal Reserve: Changes in U.S. Family Finances from 2022 to 2025 (Survey of Consumer Finances)', url: 'https://www.federalreserve.gov/publications/files/scf26.pdf' },
    { name: 'Federal Reserve: Survey of Consumer Finances', url: 'https://www.federalreserve.gov/econres/scfindex.htm' }
  ]
};
