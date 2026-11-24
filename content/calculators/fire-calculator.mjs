export default {
  slug: 'fire-calculator',
  hub: 'planning',
  name: 'FIRE Number Calculator',
  meta: 'Estimate your financial independence number with our free FIRE calculator. See your FIRE number, savings rate and how many years until you are financially free.',
  intro: 'Plug in what you spend, what you take home and what you have invested, and we\'ll show you your FIRE number, your savings rate and how many years it will take to reach financial independence.',
  keyword: 'how to calculate fire number',
  also: ['fire calculator', 'fire number calculator', 'financial independence calculator', 'how many years to financial independence', 'savings rate to retire early', 'lean fire number', 'fat fire number'],
  updated: '2026-11-24',
  inputs: [
    { id: 'expenses', label: 'Yearly spending', type: 'number', value: 40000, prefix: '$', help: 'What you will spend each year once financially independent.' },
    { id: 'wr', label: 'Safe withdrawal rate', type: 'number', value: 4, suffix: '%', help: 'Share of the portfolio you plan to spend each year. Early retirees often use 3.25–3.5%.' },
    { id: 'income', label: 'Yearly take-home pay (after tax)', type: 'number', value: 75000, prefix: '$', help: 'Pay after taxes and payroll deductions, plus any 401(k) contributions you make, per year.' },
    { id: 'invested', label: 'Invested so far', type: 'number', value: 50000, prefix: '$', help: 'Retirement accounts and brokerage investments; leave out your home and emergency cash.' },
    { id: 'ret', label: 'Real return (after inflation)', type: 'number', value: 5, suffix: '%', help: '5% after inflation is a common FIRE planning figure for a stock-heavy portfolio.' },
    { id: 'age', label: 'Current age (optional)', type: 'number', value: 30, help: 'Used only to show the age you reach financial independence.' }
  ],
  compute(v, H) {
    if (!(v.expenses > 0)) return { error: 'Enter your yearly spending.' };
    if (!(v.wr > 0) || v.wr > 20) return { error: 'Enter a withdrawal rate between 0 and 20%.' };
    var fi = v.expenses / (v.wr / 100);
    var inv = v.invested > 0 ? v.invested : 0;
    var inc = v.income > 0 ? v.income : NaN;
    var rows = [['Multiple of spending', '× ' + H.num(100 / v.wr, 2)], ['Monthly spending covered', H.money0(v.expenses / 12)]];
    var out = { value: H.money0(fi), label: 'Your FIRE number', expr: H.money0(v.expenses) + ' ÷ ' + H.num(v.wr, 2) + '%', rows: rows };
    if (inc > 0) {
      var save = inc - v.expenses;
      rows.unshift(['Savings rate', H.pct(save / inc * 100, 1)]);
      var i = Math.pow(1 + (isNaN(v.ret) ? 0 : v.ret) / 100, 1 / 12) - 1, b = inv, m = 0;
      if (b < fi && save > 0) { while (m < 1200) { b = b * (1 + i) + save / 12; m++; if (b >= fi) break; } }
      var done = b >= fi;
      out.n = done ? m : Infinity;
      if (inv >= fi) { rows.unshift(['Years to financial independence', 'Already there', true]); }
      else if (save <= 0) { rows.unshift(['Years to financial independence', 'Never (spending ≥ income)', true]); }
      else if (done) {
        rows.unshift(['Years to financial independence', H.ym(m), true]);
        if (v.age > 0) rows.splice(1, 0, ['FI at age', H.num(Math.floor(v.age + m / 12), 0)]);
      } else rows.unshift(['Years to financial independence', '100+ years', true]);
      rows.push(['Still to invest', H.money0(Math.max(0, fi - inv))]);
      out.sub = inv >= fi ? 'Your investments already cover your ' + H.money0(fi) + ' FIRE number.' : (save > 0 ? 'Your FIRE number is ' + H.money0(fi) + ' and you save ' + H.money0(save) + ' a year' + (done ? ', so you reach it in ' + H.ym(m) : '') + '. Every $1,000 cut from yearly spending lowers the number by ' + H.money0(1000 / (v.wr / 100)) + '.' : 'Your FIRE number is ' + H.money0(fi) + ', but spending must be below take-home pay to make progress.');
    } else { out.sub = 'Your FIRE number is ' + H.money0(fi) + '; add your take-home pay to see how many years it will take.'; }
    return out;
  },
  notes: {
    'Years to financial independence': 'Time until your investments reach the FIRE number at this savings pace.',
    'FI at age': 'Your current age plus the years to financial independence.',
    'Savings rate': 'Take-home pay minus spending, divided by take-home pay.',
    'Multiple of spending': 'How many years of spending the FIRE number holds: 25 at 4%.',
    'Monthly spending covered': 'Yearly spending divided by 12: what the portfolio pays you each month.',
    'Still to invest': 'FIRE number minus what you have invested today.'
  },
  assumptions: 'This estimate assumes a steady real return, that everything you do not spend is invested monthly, and that spending stays the same in today\'s dollars. It does not include Social Security, taxes on withdrawals or market swings.',
  quick: ({ r }) => `Your FIRE number is your yearly spending divided by your safe withdrawal rate, which at 4% means 25 × spending. Spending <strong>$40,000 a year</strong> gives a FIRE number of <strong>${r.value}</strong>. With $50,000 invested and $35,000 a year saved (a 46.7% savings rate) at a 5% real return, you reach it in <strong>16 years 7 months</strong>.`,
  formulaTitle: 'What is the FIRE number formula?',
  formula: {
    expr: 'FIRE number = Yearly spending ÷ Withdrawal rate<br>Savings rate = (Take-home pay − Spending) ÷ Take-home pay',
    vars: [['Withdrawal rate', 'share of the portfolio you withdraw in year one (4% = 0.04)'], ['Years to FI', 'months until Invested × (1 + i)<sup>n</sup> + Savings ÷ 12 × [(1 + i)<sup>n</sup> − 1] ÷ i ≥ FIRE number']],
    note: 'Because the FIRE number and your savings both depend on spending, the years to FI depend only on your savings rate, return and current investments, not on the size of your income.'
  },
  example: `<p>Sam takes home $75,000 a year, spends $40,000 and has $50,000 invested.</p>
<p>FIRE number = $40,000 ÷ 0.04 = <strong>$1,000,000</strong>. Savings = $75,000 − $40,000 = $35,000 a year, a <strong>46.7%</strong> savings rate.</p>
<p>Investing $2,917 a month at a 5% real return (0.407% a month), the portfolio passes $1,000,000 after <strong>16 years 7 months</strong>. At 30, Sam reaches financial independence at 46.</p>
<p>Cutting spending to $35,000 lowers the target to $875,000 and raises savings to $40,000 a year: FI comes in 13 years 9 months instead.</p>`,
  table: {
    title: 'How many years to FIRE at each savings rate?',
    intro: 'Years from zero to financial independence by savings rate, with a 5% real return and a 4% withdrawal rate. Computed by the calculator above; the result is the same at any income.',
    head: ['Savings rate', 'Spending per $100K take-home', 'FIRE number', 'Years to FI'],
    rows: ({ run, H }) => [10, 20, 25, 30, 40, 50, 60, 70, 80].map(s => {
      const r = run({ income: 100000, expenses: 100000 * (1 - s / 100), invested: 0, ret: 5, wr: 4, age: NaN });
      return [s + '%', H.money0(100000 * (1 - s / 100)), r.value, H.fix(r.n / 12, 1)];
    }),
    note: 'Starting with money already invested shortens every figure. A 3.5% withdrawal rate adds about a year and a half at a 50% savings rate.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>Two inputs set the FIRE number; the rest decide how fast you get there.</p>
<h3>Yearly spending</h3>
<p>Add up what you will spend in a year once you stop working: housing, food, transport, travel, and health insurance, which is the line early retirees most often forget because an employer used to pay it. Use today's dollars.</p>
<h3>Safe withdrawal rate</h3>
<p>The calculator divides spending by this rate. At 4% the shortcut is spending × 25; at 3.5% it is × 28.6; at 3% it is × 33.3. A lower rate means a bigger target and a longer road, but more confidence the money lasts.</p>
<h3>Yearly take-home pay</h3>
<p>Your pay after income and payroll taxes. If you contribute to a 401(k) through payroll, add those contributions back, since they are savings too. The difference between pay and spending is what you invest each year.</p>
<h3>Invested so far</h3>
<p>Retirement accounts plus taxable brokerage money. Leave out home equity and the emergency fund; neither is meant to pay your bills in retirement.</p>
<h3>Real return</h3>
<p>Use a real (after-inflation) return so the FIRE number stays in today's dollars. 5% real is a common assumption for a mostly-stock portfolio. Entering a nominal 7–10% here overstates progress by years.</p>
<h3>Current age</h3>
<p>Optional. It only converts the years to FI into the age you reach it.</p>`
    },
    {
      h2: 'What are Lean FIRE, Fat FIRE and Barista FIRE?',
      html: `<p>These are informal community labels for the size of the budget, not official categories.</p>
<h3>Lean FIRE</h3>
<p>A frugal budget, often around $25,000–$40,000 a year, so a FIRE number of roughly $625,000–$1,000,000 at 4%. Spending $30,000 with Sam's $75,000 take-home pay gives a $750,000 target, reached in 11 years 2 months.</p>
<h3>Regular and Fat FIRE</h3>
<p>Regular FIRE covers a middle-class budget of about $40,000–$100,000. Fat FIRE means $100,000 or more a year, which needs $2.5 million or more; a household taking home $200,000 and spending $100,000 gets there in 15 years 11 months.</p>
<h3>Barista and Coast FIRE</h3>
<p>Barista FIRE: part-time work covers some spending, so the portfolio only has to fund the rest. Coast FIRE: you have enough invested that, with no more contributions, it grows to your FIRE number by a normal retirement age. See the <a href="/coast-fire-calculator">Coast FIRE calculator</a>.</p>`
    },
    {
      h2: 'Is 4% the right withdrawal rate for early retirement?',
      html: `<p>The research behind the 4% rule looked at 30-year retirements. Someone retiring at 40 may need the money to last 50 years or more, so many people in the FIRE community plan on 3.25–3.5%. That raises the target from 25 to about 29–31 times spending: $40,000 a year needs $1,142,857 at 3.5% instead of $1,000,000. In the example, the extra $142,857 takes Sam 1 year 8 months longer to reach.</p>
<p>Flexibility can substitute for a lower rate. If you are willing to cut spending after a bad market year or earn some income, 4% is more defensible.</p>`
    },
    {
      h2: 'Why does the savings rate matter more than income?',
      html: `<p>A higher savings rate helps twice: more money goes in each year, and a lower spending level shrinks the number you need. At a 10% savings rate it takes about 51 years to reach FI from zero; at 50%, about 16 years; at 70%, under 9. Doubling your income without changing your spending has the same effect as a large jump in savings rate, which is why the table is expressed per $100,000 of take-home pay.</p>
<h3>Small cuts, big effect</h3>
<p>Sam cutting spending by $5,000 to $35,000 lowers the target to $875,000 and lifts yearly saving to $40,000, so FI arrives in 13 years 9 months instead of 16 years 7 months.</p>`
    },
    {
      h2: 'What should I include in my FIRE spending?',
      html: `<p>Plan for the expenses an employer currently covers or hides, and leave out costs that end at FI, such as commuting and retirement contributions.</p>
<h3>Health insurance before Medicare</h3>
<p>Coverage until Medicare at 65 is usually the largest new cost. An ACA marketplace plan can run several hundred dollars a month per person before subsidies, and subsidies depend on the income you report, which early retirees can partly control.</p>
<h3>Taxes on withdrawals</h3>
<p>Traditional 401(k) and IRA money is taxed as income when you take it out. Add a realistic tax figure to spending, or plan withdrawals from Roth and taxable accounts first.</p>
<h3>Irregular costs</h3>
<p>Home repairs, car replacement and travel don't show up every month. Average them into a yearly figure. Once you retire, track whether your real spending matches the plan; the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a> shows what happens if it does not.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my FIRE number?', a: 'Divide your yearly spending by your safe withdrawal rate. $40,000 a year at 4% gives $40,000 ÷ 0.04 = $1,000,000.' },
    { q: 'What is my FIRE number if I spend $50,000 a year?', a: 'At a 4% withdrawal rate your FIRE number is $1,250,000 (25 × $50,000). At 3.5% it is $1,428,571.' },
    { q: 'What is the 25x rule?', a: 'The 25x rule says you are financially independent when your investments equal 25 times your yearly spending. It is the 4% rule turned around: 4% of 25 times spending is one year of spending.' },
    { q: 'How long does it take to reach FIRE?', a: 'From zero with a 5% real return, about 16 years at a 50% savings rate, 21 years at 40% and 28 years at 30%. Money you already have invested shortens this.' },
    { q: 'What savings rate do I need to retire early?', a: 'A 50% savings rate reaches financial independence in about 16 years 5 months from zero at a 5% real return; 60% takes 12 years 3 months and 70% takes 8 years 8 months.' },
    { q: 'What is a Lean FIRE number?', a: 'Lean FIRE usually means a budget of about $25,000–$40,000 a year. Spending $30,000 at a 4% withdrawal rate gives a $750,000 FIRE number.' },
    { q: 'What is a Fat FIRE number?', a: 'Fat FIRE usually means spending $100,000 or more a year, which needs a FIRE number of at least $2,500,000 at 4%.' },
    { q: 'Should I use a real or nominal return?', a: 'Use a real return (after inflation) so your FIRE number stays in today\'s dollars. A 7% nominal return with 2–3% inflation is roughly a 4–5% real return.' },
    { q: 'How much faster is FIRE at a 7% real return?', a: 'In the default example, 7% real instead of 5% shortens the wait from 16 years 7 months to 14 years 7 months. Treat higher returns as a bonus, not the plan.' },
    { q: 'Does my FIRE number include Social Security?', a: 'Not in this calculator. Social Security can start at 62, so some early retirees plan a larger withdrawal before 62 and a smaller one after; that lowers the number but needs a more detailed plan.' },
    { q: 'Can I access retirement accounts if I retire early?', a: 'Yes, with planning. Roth IRA contributions can be withdrawn any time, 401(k)s allow penalty-free withdrawals after leaving a job in or after the year you turn 55, and substantially equal periodic payments (72(t)) avoid the 10% additional tax.' },
    { q: 'Do I need to count my house in my FIRE number?', a: 'No. The FIRE number covers spending. A paid-off house lowers your spending (and so your number) but is not part of the portfolio you withdraw from.' }
  ],
  related: ['coast-fire-calculator', 'retirement-age-calculator', 'retirement-withdrawal-calculator', 'millionaire-calculator', 'monte-carlo-retirement-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    { name: 'IRS: Retirement topics, exceptions to tax on early distributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-exceptions-to-tax-on-early-distributions' },
    { name: 'Social Security Administration: Retirement age and benefit reduction', url: 'https://www.ssa.gov/benefits/retirement/planner/agereduction.html' }
  ],
  disclaimer: 'Illustration only, not investment advice. Assumes a steady real return.'
};
