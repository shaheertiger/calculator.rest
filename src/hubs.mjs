// Hub (category) pages. Order = order on the homepage.
export default [
  {
    id: 'income', slug: 'retirement-income-calculators', name: 'Retirement Income & Withdrawals', short: 'Income',
    title: 'Retirement Income Calculators: {n} Drawdown & Withdrawal Tools',
    meta: 'Free retirement income calculators: how long your money will last, how much you can withdraw, Monte Carlo odds, annuity payouts and a retirement budget.',
    intro: 'Once you stop working, the questions flip: how much can you take out each month, and will it last? These tools run the year-by-year drawdown with your return, inflation and taxes, show the withdrawal that lasts 30 years, and stress-test it against bad markets with a Monte Carlo simulation.',
    faq: [
      ['How long will my money last in retirement?', 'It depends on four numbers: savings, withdrawals, return and inflation. Each year you withdraw what you need, the rest earns a return, and withdrawals rise with inflation. $500,000 drawn at $3,000 a month, raised 3% a year and earning 6%, lasts about 18 years. The <a href="/how-long-will-money-last-calculator">money-last calculator</a> runs it with your numbers.'],
      ['What is the 4% rule?', 'The 4% rule says you can withdraw 4% of your savings in the first year of retirement, then raise that dollar amount with inflation each year, and historically have the money last at least 30 years. $1,000,000 supports about $40,000 a year, or $3,333 a month, before tax.'],
      ['What is a Monte Carlo retirement simulation?', 'It runs your plan through hundreds or thousands of random market sequences instead of one fixed return, then reports the share of runs where the money lasts. A success rate of 80–90% or higher is the range most planners aim for.']
    ]
  },
  {
    id: 'planning', slug: 'retirement-planning-calculators', name: 'Retirement Saving & Planning', short: 'Planning',
    title: 'Retirement Planning Calculators: {n} Free Savings Tools',
    meta: 'Free retirement planning calculators: how much you need to retire, when you can retire, 401(k), 403(b), 457 and Roth IRA growth, FIRE and couples plans.',
    intro: 'Before retirement the job is to hit a number. These calculators find that number from your spending, project your 401(k), 403(b), 457(b) and Roth IRA with 2026 IRS contribution limits, and tell you the age you can stop working. Couples get one joint plan, not two guesses.',
    faq: [
      ['How much do I need to retire?', 'A common starting point is 25 times the yearly spending your savings must cover, which is the 4% rule turned around. If you need $60,000 a year and Social Security pays $24,000, savings must cover $36,000, so the target is about $900,000.'],
      ['What are the 2026 401(k) and IRA limits?', 'For 2026 you can defer $24,500 into a 401(k), 403(b) or governmental 457(b), plus an $8,000 catch-up at age 50 or older, or $11,250 at ages 60 to 63. The IRA limit is $7,500, plus a $1,100 catch-up at 50 or older.'],
      ['Is a Roth or traditional account better for retirement?', 'Roth wins if your tax rate in retirement will be the same or higher than today; traditional wins if it will be lower. Many savers split contributions so they have both taxable and tax-free money to draw from later.']
    ]
  },
  {
    id: 'rules', slug: 'retirement-tax-calculators', name: 'Social Security, Taxes & IRS Rules', short: 'Taxes & rules',
    title: 'Retirement Tax & Social Security Calculators: {n} 2026 Tools',
    meta: 'Free 2026 calculators for retirement taxes, Social Security benefits, RMDs, Roth IRA MAGI and 401(k) early withdrawal penalties, with IRS and SSA sources.',
    intro: 'The rules decide how much of your money you keep. These calculators apply the 2026 IRS brackets and deductions, the Social Security benefit formula and taxation thresholds, the Uniform Lifetime Table for RMDs and the 10% early withdrawal penalty, and cite the IRS or SSA page for every number.',
    faq: [
      ['Is Social Security taxable?', 'Up to 85% of your benefit can be taxable. It depends on provisional income: your other income plus half your benefit. Below $25,000 (single) or $32,000 (married filing jointly) none is taxed; above $34,000 or $44,000 up to 85% is.'],
      ['When do I have to take RMDs?', 'Required minimum distributions start at age 73 for people born 1951 to 1959 and at 75 for people born in 1960 or later. Each year\'s RMD is the prior December 31 balance divided by the IRS Uniform Lifetime Table factor for your age.'],
      ['What is the penalty for withdrawing from a 401(k) early?', 'Withdrawals before age 59½ usually owe a 10% additional tax on top of ordinary income tax. Exceptions include separating from your employer in or after the year you turn 55, disability, and substantially equal periodic payments under 72(t).']
    ]
  }
];
