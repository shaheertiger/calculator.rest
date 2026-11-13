export default {
  slug: 'fire-calculator',
  hub: 'investing',
  name: 'FIRE Number Calculator',
  title: 'FIRE Number Calculator: $40,000 a Year Needs $1,000,000',
  h1: 'FIRE Calculator: Your Financial Independence Number and Years to Get There',
  meta: 'Your FIRE number is yearly spending ÷ withdrawal rate: $40,000 at 4% is $1,000,000. Saving 47% of a $75,000 take-home pay gets you there in 16 years 7 months.',
  keyword: 'how to calculate fire number',
  also: ['fire calculator', 'fire number calculator', 'financial independence calculator', 'how many years to financial independence', 'savings rate to retire early', 'lean fire number', 'fat fire number'],
  updated: '2026-11-13',
  inputs: [
    { id: 'expenses', label: 'Yearly spending', type: 'number', value: 40000, prefix: '$', help: 'What you will spend each year once financially independent.' },
    { id: 'wr', label: 'Safe withdrawal rate', type: 'number', value: 4, suffix: '%' },
    { id: 'income', label: 'Yearly take-home pay (after tax)', type: 'number', value: 75000, prefix: '$' },
    { id: 'invested', label: 'Invested so far', type: 'number', value: 50000, prefix: '$' },
    { id: 'ret', label: 'Real return (after inflation)', type: 'number', value: 5, suffix: '%', help: '5% after inflation is a common FIRE planning figure for a stock-heavy portfolio.' },
    { id: 'age', label: 'Current age (optional)', type: 'number', value: 30 }
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
      out.sub = save > 0 ? 'You save ' + H.money0(save) + ' a year. Every $1,000 cut from yearly spending lowers your FIRE number by ' + H.money0(1000 / (v.wr / 100)) + '.' : 'Spending must be below take-home pay to make progress.';
    } else { out.sub = 'Add your take-home pay to see how many years it will take.'; }
    return out;
  },
  quick: ({ r }) => `Your FIRE number is your yearly spending divided by your safe withdrawal rate, which at 4% means 25 × spending. Spending <strong>$40,000 a year</strong> gives a FIRE number of <strong>${r.value}</strong>. With $50,000 invested and $35,000 a year saved (a 46.7% savings rate) at a 5% real return, you reach it in <strong>16 years 7 months</strong>.`,
  stepsTitle: 'How to calculate your FIRE number',
  steps: [
    'Add up what you will spend in a year once you stop working: housing, food, transport, travel, and health insurance, which is the line early retirees most often forget because an employer used to pay it.',
    'Divide that spending by your safe withdrawal rate. At 4% the shortcut is spending × 25; at 3.5% it is × 28.6; at 3% it is × 33.3.',
    'Enter your take-home pay and what you have invested. The difference between pay and spending is what you save each year.',
    'Use a real (after-inflation) return so the FIRE number stays in today\'s dollars. 5% real is a common assumption for a mostly-stock portfolio.'
  ],
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
      h2: 'What are Lean FIRE, Fat FIRE and Barista FIRE?',
      html: `<p>These are informal community labels for the size of the budget, not official categories:</p>
<ul><li><strong>Lean FIRE:</strong> a frugal budget, often around $25,000–$40,000 a year, so a FIRE number of roughly $625,000–$1,000,000 at 4%.</li><li><strong>Regular FIRE:</strong> a middle-class budget of about $40,000–$100,000.</li><li><strong>Fat FIRE:</strong> $100,000 or more a year, which needs $2.5 million or more.</li><li><strong>Barista FIRE:</strong> part-time work covers some spending, so the portfolio only has to fund the rest.</li><li><strong>Coast FIRE:</strong> you have enough invested that, with no more contributions, it grows to your FIRE number by a normal retirement age. See the <a href="/coast-fire-calculator">Coast FIRE calculator</a>.</li></ul>`
    },
    {
      h2: 'Is 4% the right withdrawal rate for early retirement?',
      html: `<p>The 4% rule was tested on 30-year retirements. Someone retiring at 40 may need the money to last 50 years or more, so many people in the FIRE community plan on 3.25–3.5%. That raises the target from 25 to about 29–31 times spending: $40,000 a year needs $1,142,857 at 3.5% instead of $1,000,000. In the example, the extra $142,857 takes Sam 1 year 8 months longer to reach.</p>
<p>Flexibility can substitute for a lower rate. If you are willing to cut spending after a bad market year or earn some income, 4% is more defensible.</p>`
    },
    {
      h2: 'Why does the savings rate matter more than income?',
      html: `<p>A higher savings rate helps twice: more money goes in each year, and a lower spending level shrinks the number you need. At a 10% savings rate it takes about 51 years to reach FI from zero; at 50%, about 16 years; at 70%, under 9. Doubling your income without changing your spending has the same effect as a large jump in savings rate, which is why the table is expressed per $100,000 of take-home pay.</p>`
    },
    {
      h2: 'What should I include in my FIRE spending?',
      html: `<p>Plan for the expenses an employer currently covers or hides: health insurance until Medicare at 65 (an ACA marketplace plan can run several hundred dollars a month per person before subsidies), taxes on withdrawals, home repairs, car replacement, and travel. Leave out costs that end at FI, such as commuting and retirement contributions. Once you retire, track whether your real spending matches the plan; the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a> shows what happens if it does not.</p>`
    }
  ],
  faq: [
    { q: 'What is my FIRE number if I spend $50,000 a year?', a: 'At a 4% withdrawal rate your FIRE number is $1,250,000 (25 × $50,000). At 3.5% it is $1,428,571.' },
    { q: 'What is the 25x rule?', a: 'The 25x rule says you are financially independent when your investments equal 25 times your yearly spending. It is the 4% rule turned around: 4% of 25 times spending is one year of spending.' },
    { q: 'How long does it take to reach FIRE?', a: 'From zero with a 5% real return, about 16 years at a 50% savings rate, 21 years at 40% and 28 years at 30%. Money you already have invested shortens this.' },
    { q: 'Should I use a real or nominal return?', a: 'Use a real return (after inflation) so your FIRE number stays in today\'s dollars. A 7% nominal return with 2–3% inflation is roughly a 4–5% real return.' },
    { q: 'Does my FIRE number include Social Security?', a: 'Not in this calculator. Social Security can start at 62, so some early retirees plan a larger withdrawal before 62 and a smaller one after; that lowers the number but needs a more detailed plan.' },
    { q: 'Can I access retirement accounts if I retire early?', a: 'Yes, with planning. Roth IRA contributions can be withdrawn any time, 401(k)s allow penalty-free withdrawals after leaving a job in or after the year you turn 55, and substantially equal periodic payments (72(t)) avoid the 10% additional tax.' },
    { q: 'Do I need to count my house in my FIRE number?', a: 'No. The FIRE number covers spending. A paid-off house lowers your spending (and so your number) but is not part of the portfolio you withdraw from.' }
  ],
  related: ['coast-fire-calculator', 'retirement-age-calculator', 'retirement-calculator', 'millionaire-calculator', 'net-worth-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    { name: 'IRS: Retirement topics, exceptions to tax on early distributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-exceptions-to-tax-on-early-distributions' },
    { name: 'Social Security Administration: Retirement age and benefit reduction', url: 'https://www.ssa.gov/benefits/retirement/planner/agereduction.html' }
  ],
  disclaimer: 'Illustration only, not investment advice. Assumes a steady real return.'
};
