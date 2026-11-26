export default {
  slug: 'split-bill-calculator',
  hub: 'everyday',
  name: 'Bill Split Calculator',
  title: 'Bill Split Calculator: Split $3,600 of Bills 60/40 by Income',
  h1: 'Split Household Bills With Your Spouse or Partner: 50/50 or by Income',
  meta: 'Earning $6,000 and $4,000 a month? A fair income-based split of $3,600 in shared bills is $2,160 and $1,440. Compare 50/50, by income and equal leftover.',
  keyword: 'how to split bills with spouse calculator',
  also: ['bill split calculator', 'split bills proportionally to income', 'how to split expenses based on income', 'fair way to split bills calculator', 'split bills with partner calculator'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'bills', label: 'Shared monthly bills', type: 'rows', addLabel: '+ add bill', max: 30,
      fields: [
        { id: 'name', label: 'Bill', type: 'text', value: '', blank: true, placeholder: 'e.g. Rent' },
        { id: 'amount', label: 'Amount per month', type: 'number', value: 100 }
      ],
      value: [
        { name: 'Rent', amount: 1950 },
        { name: 'Groceries', amount: 850 },
        { name: 'Utilities', amount: 300 },
        { name: 'Car insurance', amount: 240 },
        { name: 'Phone and internet', amount: 160 },
        { name: 'Subscriptions', amount: 100 }
      ]
    },
    { id: 'method', label: 'How to split', type: 'select', value: 'income', options: [['income', 'In proportion to income'], ['equal', '50/50'], ['leftover', 'Equal money left over'], ['custom', 'Custom percentage']], wide: true },
    { id: 'incA', label: 'Your monthly take-home pay', type: 'number', value: 6000, prefix: '$' },
    { id: 'incB', label: 'Partner\'s monthly take-home pay', type: 'number', value: 4000, prefix: '$' },
    { id: 'pctA', label: 'Your share', type: 'number', value: 55, suffix: '%', showIf: { method: ['custom'] } }
  ],
  compute(v, H) {
    var list = (v.bills || []).filter(function (b) { return b.amount > 0; });
    var total = 0;
    list.forEach(function (b) { total += b.amount; });
    if (!total) return { error: 'Add at least one bill with an amount.' };
    var a = v.incA > 0 ? v.incA : 0, b = v.incB > 0 ? v.incB : 0, haveInc = a + b > 0;
    var share;
    if (v.method === 'equal') share = 0.5;
    else if (v.method === 'custom') {
      if (!(v.pctA >= 0 && v.pctA <= 100)) return { error: 'Enter your share as a percentage from 0 to 100.' };
      share = v.pctA / 100;
    } else {
      if (!haveInc) return { error: 'Enter both take-home pays to split by income.' };
      if (v.method === 'leftover') share = Math.min(total, Math.max(0, (a - b + total) / 2)) / total;
      else share = a / (a + b);
    }
    var payA = total * share, payB = total - payA;
    var rows = [
      ['You pay', H.money(payA), true],
      ['Partner pays', H.money(payB), true],
      ['Split', H.pct(share * 100, 1) + ' / ' + H.pct((1 - share) * 100, 1)]
    ];
    if (a > 0 && b > 0) {
      rows.push(['Share of take-home pay', H.pct(payA / a * 100, 1) + ' / ' + H.pct(payB / b * 100, 1)]);
      rows.push(['Left after shared bills', H.money(a - payA) + ' / ' + H.money(b - payB)]);
    }
    if (v.method !== 'equal') {
      var d = payA - total / 2;
      rows.push(['Compared with 50/50', Math.abs(d) < 0.005 ? 'same as 50/50' : 'you pay ' + H.money(Math.abs(d)) + (d > 0 ? ' more' : ' less')]);
    }
    return {
      value: H.money0(payA) + ' / ' + H.money0(payB),
      label: 'You / partner, per month',
      expr: H.money(total) + ' × ' + H.pct(share * 100, 1),
      rows: rows,
      table: {
        head: ['Bill', 'Amount', 'You', 'Partner'],
        rows: list.map(function (x, i) { return [H.esc(x.name || 'Bill ' + (i + 1)), H.money(x.amount), H.money(x.amount * share), H.money(x.amount * (1 - share))]; })
      },
      sub: v.method === 'income' ? 'Each of you puts the same share of your pay toward the household.' : v.method === 'leftover' ? 'You both keep the same amount for personal spending after shared bills.' : v.method === 'equal' ? 'Equal dollars, but the lower earner gives up a bigger share of their pay.' : 'A custom split. Revisit it whenever either income changes.'
    };
  },
  quick: ({ r }) => `To split bills with a spouse by income, divide each person's take-home pay by your combined pay and apply that percentage to the shared bills. With $6,000 and $4,000 a month the split is 60/40, so on $3,600 of bills you pay <strong>$2,160</strong> and your partner <strong>$1,440</strong>, which is 36% of each paycheck. Splitting 50/50 instead would be $1,800 each.`,
  stepsTitle: 'How to split bills fairly with a spouse or partner',
  steps: [
    'List every shared monthly bill: rent or mortgage, utilities, groceries, insurance, internet and joint subscriptions. Convert annual or quarterly bills to a monthly amount (divide by 12 or 3).',
    'Decide what stays personal: individual debts brought into the relationship, hobbies, personal phone plans and clothing usually do.',
    'Enter each person\'s monthly <strong>take-home</strong> pay. Using gross pay when one of you has much higher taxes or retirement contributions skews the split.',
    'Choose a method: 50/50, in proportion to income, or equal money left over. Compare them by switching the menu; the per-bill table updates.',
    'Set up automatic transfers of each person\'s share into a joint account a few days before the bills are due, and recheck the split after any raise or job change.'
  ],
  formulaTitle: 'What is the formula for splitting bills by income?',
  formula: {
    expr: 'Your share = Your income ÷ (Your income + Partner\'s income)<br>You pay = Total bills × Your share<br>Equal leftover: You pay = (Your income − Partner\'s income + Total bills) ÷ 2',
    vars: [['Income', 'monthly take-home pay (use the same basis for both people)'], ['Total bills', 'sum of shared monthly expenses']],
    note: 'Equal leftover means the higher earner covers the income gap first, so each person ends up with the same personal spending money. If the gap is larger than the bills, the higher earner pays everything.'
  },
  example: `<p>Jordan takes home $6,000 a month and Sam $4,000. Their shared bills total $3,600.</p>
<p><strong>By income:</strong> Jordan's share = 6,000 ÷ 10,000 = 60%. Jordan pays $3,600 × 0.60 = <strong>$2,160</strong>; Sam pays <strong>$1,440</strong>. Both spend 36% of their pay on the household, leaving $3,840 and $2,560.</p>
<p><strong>50/50:</strong> $1,800 each, which is 30% of Jordan's pay but 45% of Sam's.</p>
<p><strong>Equal leftover:</strong> Jordan pays (6,000 − 4,000 + 3,600) ÷ 2 = <strong>$2,800</strong> and Sam $800, so each keeps $3,200.</p>`,
  table: {
    title: 'How much does each partner pay on $3,600 of bills?',
    intro: 'Your share of the same $3,600 in monthly bills at different income pairs, under each split method. Computed by the calculator above.',
    head: ['Take-home pay (you / partner)', 'By income', 'Each spends', 'Equal leftover'],
    rows: ({ run, H }) => [[5000, 5000], [5500, 4500], [6000, 4000], [6000, 5000], [8000, 6000], [6500, 3500], [7000, 3000], [9000, 3000]].map(([a, b]) => {
      const pay = m => { const r = run({ incA: a, incB: b, method: m }); return r.rows[0][1].replace('.00', '') + ' / ' + r.rows[1][1].replace('.00', ''); };
      return [H.money0(a) + ' / ' + H.money0(b), pay('income'), H.pct(3600 / (a + b) * 100, 1) + ' of pay', pay('leftover')];
    }),
    note: 'Amounts are you / partner. A 50/50 split is $1,800 each in every row. Once the income gap reaches the size of the bills ($7,000 vs. $3,000 above), equal leftover means the higher earner pays all the shared bills.'
  },
  sections: [
    {
      h2: 'What is the fairest way to split bills with a spouse?',
      html: `<p>There's no single right answer; the fair method is the one both of you would pick without knowing who earns more. The common options:</p>
<ul><li><strong>50/50:</strong> simple and works well when incomes are close. When they aren't, the lower earner can end up with little left for savings or fun.</li><li><strong>Proportional to income:</strong> each person contributes the same <em>percentage</em> of pay. It's the most popular "fair" split for couples with different incomes.</li><li><strong>Equal leftover:</strong> both keep the same dollars for personal spending. This behaves like fully pooled money while keeping separate accounts.</li><li><strong>Full pooling:</strong> all income goes into one account. Common for married couples, especially when one partner earns little or nothing.</li></ul>
<p>Many couples start proportional and move toward pooling as finances merge. Whatever you pick, write it down and review it once a year.</p>`
    },
    {
      h2: 'Should you split bills by gross pay or take-home pay?',
      html: `<p>Take-home pay is usually fairer, because it's the money actually available for bills. Two people with the same $80,000 salary can bring home very different amounts if one lives in a high-tax state, pays for family health coverage or contributes 15% to a 401(k).</p>
<p>Retirement contributions are the judgment call. If one partner saves heavily pre-tax and the other doesn't, using take-home pay lets the saver pay less toward bills. Some couples add voluntary retirement savings back in so the split reflects earning power rather than saving habits. Either way, use the same basis for both people.</p>`
    },
    {
      h2: 'Which bills should be shared and which kept separate?',
      html: `<p>Share costs that both of you use: housing, utilities, household groceries, renters or homeowners insurance, internet, joint streaming services and children's costs. Housing is the largest category of household spending in the Bureau of Labor Statistics Consumer Expenditure Survey, so the rent or mortgage line drives most of the split.</p>
<p>Keep separate: debt either of you had before the relationship (student loans, credit cards), personal phone plans, gym memberships, hobbies and gifts for each other. Cars are a toss-up: if one is mostly a commuter car for one person, many couples keep its payment personal and share only insurance.</p>`
    },
    {
      h2: 'How do you set up a joint account for shared bills?',
      html: `<p>The "yours, mine and ours" setup is the easiest way to make a split stick:</p>
<ol><li>Open a joint checking account used only for shared bills.</li><li>Each person schedules an automatic transfer of their share, timed a few days after payday.</li><li>Put all shared bills on autopay from that account.</li><li>Keep one extra month of bills in it as a buffer for irregular costs like a high winter utility bill.</li></ol>
<p>The calculator's per-bill table shows who covers what if you'd rather each pay certain bills directly. Recalculate after raises, job changes or a new baby.</p>`
    }
  ],
  faq: [
    { q: 'What is a 60/40 split of bills?', a: 'One partner pays 60% and the other 40%. On $3,600 of monthly bills that is $2,160 and $1,440. It matches incomes where one person earns 1.5 times the other, such as $6,000 and $4,000.' },
    { q: 'How do you split rent proportionally to income?', a: 'Divide each income by the combined income, then multiply the rent by each share. With $2,000 rent and take-home pay of $5,250 and $3,750, the shares are 58.3% and 41.7%, so $1,166.67 and $833.33.' },
    { q: 'Is splitting bills 50/50 fair?', a: 'It is fair in dollars, and it works well when incomes are similar. When one partner earns much less, 50/50 takes a much bigger share of their pay; with $6,000 and $4,000 incomes, $1,800 each is 30% vs. 45% of take-home pay.' },
    { q: 'Should a stay-at-home spouse pay toward bills?', a: 'Usually not in cash. When one partner has little or no income, most couples pool money, since unpaid work like childcare has real economic value. Pick "Equal money left over" to see a split that leaves both with the same spending money.' },
    { q: 'What if one partner earns all the money?', a: 'An income-based split puts 100% of shared bills on the earner. Many couples then give each person the same personal allowance from the remainder.' },
    { q: 'How often should we recalculate the split?', a: 'At least once a year, and whenever either income changes, a big bill changes (new lease, new car) or your household grows.' },
    { q: 'Can I use this to split bills with roommates?', a: 'Yes. Choose 50/50 for an even split, or Custom to give someone with a bigger room a larger share. For splitting a restaurant check with tip, use the tip calculator.' }
  ],
  related: ['tip-calculator', 'take-home-pay-calculator', 'percentage-calculator', 'trip-gas-cost-calculator', 'tithe-calculator'],
  sources: [
    { name: 'CFPB: Budgeting, how to create a budget and stick with it', url: 'https://www.consumerfinance.gov/about-us/blog/budgeting-how-to-create-a-budget-and-stick-with-it/' },
    { name: 'CFPB: Your Money, Your Goals toolkit', url: 'https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/' },
    { name: 'U.S. Bureau of Labor Statistics: Consumer Expenditure Surveys', url: 'https://www.bls.gov/cex/' }
  ]
};
