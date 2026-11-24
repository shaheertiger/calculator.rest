export default {
  slug: 'millionaire-calculator',
  hub: 'planning',
  name: 'Save a Million Calculator',
  meta: 'Estimate how to save a million dollars with our free calculator. See the monthly savings you need, how much growth adds and how long your own amount takes.',
  intro: 'Plug in your goal, your timeline, what you have saved and your expected return, and we\'ll show you how much to invest each month to reach $1 million or any other target.',
  keyword: 'how to save a million dollars in 10 years calculator',
  also: ['how to save a million dollars in 20 years calculator', 'when will i be a millionaire calculator', 'millionaire calculator', 'how much to save to become a millionaire', 'how long to save a million dollars'],
  updated: '2026-11-24',
  inputs: [
    { id: 'goal', label: 'Goal', type: 'number', value: 1000000, prefix: '$', help: 'The balance you want to reach, such as $1,000,000.' },
    { id: 'years', label: 'Years to reach it', type: 'number', value: 10, suffix: 'years', help: 'How many years from now you want to hit the goal.' },
    { id: 'saved', label: 'Already saved or invested', type: 'number', value: 0, prefix: '$', help: 'Money already invested toward this goal; enter 0 if starting from scratch.' },
    { id: 'ret', label: 'Annual return', type: 'number', value: 7, suffix: '%', help: 'Average yearly growth before inflation. 7% is a common long-run figure for stock-heavy funds.' },
    { id: 'canSave', label: 'Or: I can invest per month (optional)', type: 'number', value: '', prefix: '$', placeholder: 'e.g. 1500', help: 'Shows how many years your monthly amount takes.' },
    { id: 'infl', label: 'Inflation, to show today\'s value', type: 'number', value: 3, suffix: '%', help: 'Expected yearly price rise, used only to show what the goal is worth today.' }
  ],
  compute(v, H) {
    if (!(v.goal > 0)) return { error: 'Enter your savings goal.' };
    if (!(v.years > 0) || v.years > 80) return { error: 'Enter a number of years between 0 and 80.' };
    var saved = v.saved > 0 ? v.saved : 0, ret = isNaN(v.ret) ? 0 : v.ret;
    if (ret <= -100) return { error: 'Enter a return above −100%.' };
    var i = Math.pow(1 + ret / 100, 1 / 12) - 1, n = Math.round(v.years * 12), g = Math.pow(1 + i, n);
    var fvSaved = saved * g;
    var pmt = fvSaved >= v.goal ? 0 : (Math.abs(i) < 1e-12 ? (v.goal - fvSaved) / n : (v.goal - fvSaved) * i / (g - 1));
    var deposits = saved + pmt * n;
    var rows = [
      ['Per year', H.money0(pmt * 12)],
      ['Total you put in', H.money0(deposits)],
      ['Investment growth', H.money0(v.goal - deposits)],
      ['Goal in today\'s dollars', H.money0(v.goal / Math.pow(1 + (isNaN(v.infl) ? 0 : v.infl) / 100, v.years))]
    ];
    if (v.canSave > 0) {
      var b = saved, m = 0;
      while (b < v.goal && m < 1200) { b = b * (1 + i) + v.canSave; m++; }
      rows.unshift(['Time to reach the goal at your monthly amount', m >= 1200 && b < v.goal ? '100+ years' : H.ym(m), true]);
    }
    return {
      value: H.money0(pmt) + '/mo',
      label: 'To reach ' + H.money0(v.goal) + ' in ' + H.plural(v.years, 'year'),
      expr: H.money0(v.goal) + ' at ' + H.num(ret, 2) + '% over ' + H.num(n, 0) + ' months',
      rows: rows,
      sub: pmt === 0 ? 'What you have already invested reaches ' + H.money0(v.goal) + ' on its own at this return.' : 'Investing ' + H.money0(pmt) + ' a month reaches ' + H.money0(v.goal) + ' in ' + H.plural(v.years, 'year') + '; growth supplies ' + H.pct((v.goal - deposits) / v.goal * 100, 0) + ' of the goal and your deposits the rest.'
    };
  },
  notes: {
    'Time to reach the goal at your monthly amount': 'How long the goal takes if you invest the optional monthly amount instead.',
    'Per year': 'The monthly deposit times 12.',
    'Total you put in': 'Your starting balance plus every monthly deposit.',
    'Investment growth': 'The part of the goal that comes from returns rather than deposits.',
    'Goal in today\'s dollars': 'What the goal will buy in today\'s money after inflation.'
  },
  assumptions: 'These figures assume a steady return compounded monthly and deposits at the end of each month. Taxes, fees and market swings are not included.',
  quick: ({ r }) => `To save <strong>$1 million in 10 years</strong> starting from zero, invest about <strong>${r.value.replace('/mo', '')} a month</strong> at a 7% annual return. You put in about $701,500 and growth adds the other $298,500. Give it 20 years and the monthly amount drops to $1,970; 30 years, $855. Money already invested lowers each figure.`,
  formulaTitle: 'What is the formula for saving a million?',
  formula: {
    expr: 'Monthly saving = (Goal − Saved × (1 + i)<sup>n</sup>) × i ÷ [(1 + i)<sup>n</sup> − 1]<br>i = (1 + annual return)<sup>1/12</sup> − 1',
    vars: [['Goal', 'target balance, e.g. $1,000,000'], ['Saved', 'amount invested today'], ['i', 'monthly return'], ['n', 'number of monthly deposits']],
    note: 'Deposits are made at the end of each month. Spreadsheet equivalent: =PMT((1+7%)^(1/12)-1, 120, 0, -1000000).'
  },
  example: `<p>Goal: $1,000,000 in 10 years, starting from $0, at 7% a year.</p>
<p>Monthly return i = 1.07<sup>1/12</sup> − 1 = 0.5654%. Over 120 months the growth factor is 1.07<sup>10</sup> = 1.96715.</p>
<p>Monthly saving = $1,000,000 × 0.0056541 ÷ (1.96715 − 1) = <strong>$5,846</strong> per month.</p>
<p>Over 120 months you deposit $701,542, and investment growth supplies the remaining $298,458. Start with $50,000 already invested and the monthly figure falls to $5,271.</p>`,
  table: {
    title: 'How much do you need to save each month to reach $1 million?',
    intro: 'Monthly investment needed to reach $1,000,000 from zero, by years and annual return, computed by the calculator above.',
    head: ['Years', '5% return', '7% return', '8% return', '10% return'],
    rows: ({ run }) => [5, 10, 15, 20, 25, 30, 35, 40].map(y => [String(y), ...[5, 7, 8, 10].map(r => run({ goal: 1000000, years: y, saved: 0, ret: r, canSave: NaN }).value)]),
    note: 'Halving the time more than doubles the monthly amount, because the money has less time to compound. For $500,000, halve each figure; for $2 million, double it.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>Four boxes set the monthly deposit; two more answer side questions.</p>
<h3>Goal</h3>
<p>The balance you want to see on your statement. The calculator defaults to $1,000,000, but any target works: for $500,000 the monthly amount halves, for $2 million it doubles ($3,941 a month over 20 years at 7%).</p>
<h3>Years to reach it</h3>
<p>Time is the biggest lever. At 7%, $1 million takes $5,846 a month over 10 years, $3,214 over 15, $1,970 over 20 and $855 over 30.</p>
<h3>Already saved or invested</h3>
<p>Add what you already have invested toward the goal. Even $50,000 today cuts the monthly amount for a 10-year goal by about $575, to $5,271.</p>
<h3>Annual return</h3>
<p>Pick a return you can defend: 7% is a common long-run estimate for a stock-heavy portfolio before inflation; high-yield savings or CDs earn far less.</p>
<h3>Optional monthly amount</h3>
<p>Type what you can actually invest each month to see how long the goal takes at that pace, instead of the deposit for a fixed deadline.</p>
<h3>Inflation</h3>
<p>The step people skip. It does not change the monthly figure; it shows what the goal is worth in today's money. $1 million in 10 years buys what about $744,094 does today at 3% inflation.</p>`
    },
    {
      h2: 'How long does it take to become a millionaire?',
      html: `<p>It depends on what you invest each month. Starting from zero at a 7% return:</p>
<ul><li>$500 a month: about 37 years 2 months</li><li>$1,000 a month: about 28 years 1 month</li><li>$1,500 a month: about 23 years 2 months</li><li>$2,000 a month: about 19 years 11 months</li><li>$3,000 a month: about 15 years 8 months</li></ul>
<h3>Using a 401(k) to get there</h3>
<p>Maxing out a 401(k) in 2026 ($24,500 a year, about $2,042 a month) reaches $1 million in about 19 years 8 months at 7%, before any employer match. Type your own monthly amount in the optional box above to get your date.</p>`
    },
    {
      h2: 'Is $1 million in 10 or 20 years still worth $1 million?',
      html: `<p>Not in buying power. At 3% inflation, $1,000,000 ten years from now is worth about $744,094 in today's money, and twenty years from now about $553,676.</p>
<h3>Setting an inflation-adjusted goal</h3>
<p>If you want today's $1 million of buying power, set the goal higher: about $1,343,916 in 10 years or $1,806,111 in 20. To see how inflation has eroded the dollar historically, try the inflation calculator.</p>`
    },
    {
      h2: 'Where should I invest to save a million?',
      html: `<p>The return assumption drives everything, so the account matters.</p>
<h3>Cash and CDs</h3>
<p>Cash and CDs (roughly 3–5% recently) would need far larger deposits; at 4%, $1 million in 20 years takes about $2,748 a month instead of $1,970 at 7%.</p>
<h3>Diversified funds in tax-advantaged accounts</h3>
<p>Most people who reach seven figures do it through low-cost diversified stock and bond funds in tax-advantaged accounts: a 401(k), IRA or Roth IRA, where growth is not taxed each year. Higher expected returns come with more ups and downs, so match the mix to your timeline.</p>`
    }
  ],
  faq: [
    { q: 'How much do I need to save to be a millionaire in 10 years?', a: 'About $5,846 a month from zero at a 7% annual return, or $70,154 a year. Starting with $50,000 invested lowers it to $5,271 a month.' },
    { q: 'How much do I need to save a month to be a millionaire in 20 years?', a: 'About $1,970 a month from zero at a 7% annual return. At 10% it is about $1,392 a month; at 5%, about $2,464.' },
    { q: 'Can you save $1 million in 5 years?', a: 'Only with very large deposits: about $14,046 a month at 7%, or $168,549 a year. Most people need 15 to 30 years.' },
    { q: 'How much do I need to save to be a millionaire in 15 years?', a: 'About $3,214 a month from zero at a 7% return. You put in about $578,583 and growth adds the rest.' },
    { q: 'When will I be a millionaire if I invest $1,000 a month?', a: 'At a 7% annual return, $1,000 a month from zero reaches $1 million in about 28 years 1 month. You put in about $337,000 of your own money; growth supplies the rest.' },
    { q: 'How long does it take to save a million dollars?', a: 'From zero at 7%, about 37 years at $500 a month, 20 years at $2,000 and 15 years 8 months at $3,000. Money already invested shortens each figure.' },
    { q: 'How much to save to become a millionaire in 30 years?', a: 'About $855 a month from zero at a 7% return. Over 30 years you deposit $307,836 and growth contributes the other two thirds.' },
    { q: 'How much does it take to save $2 million in 20 years?', a: 'About $3,941 a month from zero at a 7% annual return, exactly double the figure for $1 million.' },
    { q: 'What percentage of Americans have $1 million?', a: 'Federal Reserve Survey of Consumer Finances data show only a small minority of U.S. households have $1 million or more in retirement accounts; more reach it in total net worth, including home equity.' },
    { q: 'Is a 7% return realistic?', a: 'As a long-run average for a mostly-stock portfolio before inflation, 7% is a common planning figure, though any single year can be far higher or lower. Use 5% for a more conservative plan.' },
    { q: 'Should I pay off debt before saving for $1 million?', a: 'High-interest debt such as credit cards (often above 20% APR) costs more than investments are likely to earn, so paying it off first usually wins. Low-rate mortgage debt is a closer call.' }
  ],
  related: ['401k-retirement-calculator', 'fire-calculator', 'retirement-calculator', 'roth-ira-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Savings Goal Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/savings-goal-calculator' },
    { name: 'SEC Investor.gov: Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    { name: 'IRS: 401(k) contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits' }
  ],
  disclaimer: 'Illustration only, not investment advice. Returns are not guaranteed.'
};
