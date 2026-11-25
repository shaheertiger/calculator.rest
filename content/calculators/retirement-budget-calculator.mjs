export default {
  slug: 'retirement-budget-calculator',
  hub: 'income',
  name: 'Retirement Budget Calculator',
  seoTitle: 'Retirement Budget Calculator 2026: Spending → Nest Egg Needed',
  meta: '$4,600/mo of retirement spending becomes $6,182/mo after 10 years of 3% inflation; after Social Security it needs $660,000 saved. Build your own budget.',
  intro: 'Plug in what you expect to spend each month by category, when you plan to retire and your Social Security, and we\'ll show you your budget at retirement, what your savings must cover and the nest egg that takes.',
  keyword: 'retirement spending calculator',
  also: ['retirement budget calculator', 'retirement expense calculator', 'retirement expenses calculator', 'retirement living expenses calculator', 'retirement spending calculator with inflation', 'spending in retirement calculator', 'retirement monthly budget calculator', 'retirement monthly expense calculator', 'retirement spending calculator with social security'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'housing', label: 'Housing (mortgage or rent, property tax, insurance, utilities, upkeep)', type: 'number', value: 1700, prefix: '$', suffix: '/mo', wide: true, help: 'Everything to keep a roof over your head. Drop the mortgage only if it will be paid off.' },
    { id: 'health', label: 'Health care (Medicare premiums, supplement, drugs, dental, out-of-pocket)', type: 'number', value: 650, prefix: '$', suffix: '/mo', wide: true, help: 'Per person. The 2026 Medicare Part B premium alone is $202.90 a month.' },
    { id: 'food', label: 'Food (groceries and eating out)', type: 'number', value: 750, prefix: '$', suffix: '/mo', help: 'Use your current grocery and restaurant spending as a guide.' },
    { id: 'transport', label: 'Transportation (car, fuel, insurance, transit)', type: 'number', value: 550, prefix: '$', suffix: '/mo', help: 'Leave out commuting; include saving toward your next car.' },
    { id: 'travel', label: 'Travel and entertainment', type: 'number', value: 400, prefix: '$', suffix: '/mo', help: 'Trips, hobbies and memberships. Often highest early in retirement.' },
    { id: 'other', label: 'Everything else (clothing, gifts, phone, personal care)', type: 'number', value: 550, prefix: '$', suffix: '/mo', help: 'Include donations and income tax on withdrawals here.' },
    { id: 'age', label: 'Your age now', type: 'number', value: 55, help: 'Used with your retirement age to apply inflation to the budget.' },
    { id: 'retAge', label: 'Retirement age', type: 'number', value: 65, help: 'The age you plan to stop working. Use your current age if already retired.' },
    { id: 'infl', label: 'Inflation until retirement', type: 'number', value: 3, suffix: '%', help: 'Yearly price growth. Many planners use 2.5–3%.' },
    { id: 'ss', label: 'Social Security and pensions per month (today\'s $)', type: 'number', value: 2400, prefix: '$', help: 'Your estimate from your my Social Security account plus any pension.' },
    { id: 'wr', label: 'Withdrawal rate from savings', type: 'number', value: 4, suffix: '%', help: 'Share of savings you draw in the first year. 4% is the common starting point.' }
  ],
  compute(v, H) {
    var cats = [['Housing', v.housing], ['Health care', v.health], ['Food', v.food], ['Transportation', v.transport], ['Travel and entertainment', v.travel], ['Everything else', v.other]];
    var mo = 0, top = null;
    for (var k = 0; k < cats.length; k++) {
      var x = cats[k][1] > 0 ? cats[k][1] : 0;
      cats[k][1] = x; mo += x;
      if (!top || x > top[1]) top = cats[k];
    }
    if (!(mo > 0)) return { error: 'Enter your expected monthly spending in at least one category.' };
    var age = v.age, ra = v.retAge;
    if (!(age >= 0) || !(age < 120)) return { error: 'Enter your current age.' };
    if (!(ra >= 0)) ra = age;
    var yrs = Math.max(0, ra - age);
    var inf = isNaN(v.infl) ? 0 : v.infl;
    if (inf <= -50 || inf > 30) return { error: 'Enter an inflation rate between −50% and 30%.' };
    var wr = v.wr > 0 && v.wr <= 20 ? v.wr : NaN;
    if (isNaN(wr)) return { error: 'Enter a withdrawal rate between 0 and 20%.' };
    var f = Math.pow(1 + inf / 100, yrs);
    var ss = v.ss > 0 ? v.ss : 0;
    var gapYr = Math.max(0, (mo - ss) * 12);
    var nest = gapYr / (wr / 100);
    var rows = [
      ['Yearly budget (today\'s $)', H.money0(mo * 12)],
      ['Monthly budget at retirement', H.money0(mo * f), yrs > 0],
      ['Yearly budget at retirement', H.money0(mo * 12 * f)],
      ['Covered by Social Security and pensions', H.money0(Math.min(ss, mo)) + '/mo'],
      ['Left for savings to cover', H.money0(gapYr / 12) + '/mo'],
      ['Nest egg needed (today\'s $)', H.money0(nest), true]
    ];
    if (yrs > 0) rows.push(['Same nest egg in dollars at retirement', H.money0(nest * f)]);
    rows.push(['Health care share of budget', H.pct(cats[1][1] / mo * 100, 1)]);
    var trows = cats.map(function (c) { return [c[0], H.money0(c[1]), H.money0(c[1] * f), H.pct(c[1] / mo * 100, 1)]; });
    trows.push(['Total', H.money0(mo), H.money0(mo * f), '100%']);
    return {
      value: H.money0(mo) + '/mo',
      label: 'Retirement budget in today\'s dollars',
      expr: H.money0(mo * 12) + '/yr · ' + H.money0(mo * f) + '/mo at ' + H.num(ra, 0),
      rows: rows,
      mo: mo, atRet: mo * f, nest: nest,
      sub: gapYr === 0 ? 'Your ' + H.money0(mo) + ' monthly budget is fully covered by Social Security and pensions, so it needs no savings.' : 'Your ' + H.money0(mo) + ' monthly budget will cost ' + H.money0(mo * f) + ' a month at ' + H.num(ra, 0) + ', and savings must supply ' + H.money0(gapYr) + ' a year, a ' + H.money0(nest) + ' nest egg at ' + H.num(wr, 2) + '%; ' + top[0].toLowerCase() + ' is your largest cost at ' + H.pct(top[1] / mo * 100, 0) + '.',
      table: { head: ['Category', 'Monthly today', 'Monthly at ' + H.num(ra, 0), 'Share'], rows: trows, caption: 'Budget by category' }
    };
  },
  notes: {
    'Yearly budget (today\'s $)': 'Your monthly budget × 12 at today\'s prices.',
    'Monthly budget at retirement': 'The same lifestyle priced at your retirement age after inflation.',
    'Yearly budget at retirement': 'The inflated monthly budget × 12.',
    'Covered by Social Security and pensions': 'The part of the budget your guaranteed income pays.',
    'Left for savings to cover': 'Budget minus Social Security and pensions, in today\'s dollars.',
    'Nest egg needed (today\'s $)': 'Yearly shortfall divided by your withdrawal rate.',
    'Same nest egg in dollars at retirement': 'The nest egg grown by inflation to your retirement age; it buys the same.',
    'Health care share of budget': 'Health care as a share of the total. It tends to rise with age.'
  },
  assumptions: 'These calculations are estimates. They assume every category rises at the same inflation rate until you retire and that Social Security and pensions keep pace with prices.',
  quick: ({ r }) => `A retirement budget of <strong>${r.value}</strong> in today's dollars (housing $1,700, health care $650, food $750, transportation $550, travel $400, other $550) is $55,200 a year. For a 55-year-old retiring at 65 with 3% inflation, that becomes <strong>$6,182 a month</strong>. After $2,400 a month of Social Security, savings must cover $26,400 a year: <strong>$660,000</strong> at a 4% withdrawal rate.`,
  formulaTitle: 'How does the calculator project the budget?',
  formula: {
    expr: 'Budget at retirement = Monthly budget × (1 + inflation)<sup>years</sup><br>Nest egg = (Monthly budget − Social Security and pensions) × 12 ÷ Withdrawal rate',
    vars: [['Monthly budget', 'sum of all categories, in today\'s dollars'], ['years', 'retirement age − current age'], ['Withdrawal rate', 'share of savings drawn in the first year, as a decimal']],
    note: 'The nest egg is shown in today\'s dollars and in dollars at your retirement age; both buy the same lifestyle.'
  },
  example: `<p>Tom is 55 and wants to retire at 65. He lists today's prices: housing $1,700 a month (paid-off condo, but taxes, insurance, HOA and utilities), health care $650, food $750, transportation $550, travel $400 and $550 for everything else.</p>
<p>Total: <strong>$4,600 a month</strong>, or $55,200 a year. Ten years of 3% inflation multiplies prices by 1.03<sup>10</sup> = 1.344, so the same lifestyle costs <strong>$6,182 a month</strong> ($74,184 a year) when he retires.</p>
<p>His Social Security estimate is $2,400 a month in today's dollars, leaving $2,200 a month, or $26,400 a year, for savings to supply. At a 4% withdrawal rate he needs $26,400 ÷ 0.04 = <strong>$660,000</strong> in today's dollars, which is $886,985 in the dollars of 2036. Housing is his biggest line at 37% of the budget; health care is 14.1%.</p>`,
  table: {
    title: 'What will a $4,600 monthly budget cost by the time I retire?',
    intro: 'Monthly cost of today\'s $4,600 budget after each number of years, at four inflation rates, computed by the calculator above.',
    head: ['Years until retirement', '2%', '2.5%', '3%', '4%'],
    rows: ({ run, H }) => [0, 5, 10, 15, 20, 25, 30].map(y => [String(y), ...[2, 2.5, 3, 4].map(i => H.money0(run({ age: 65 - y, retAge: 65, infl: i }).atRet))]),
    note: 'At 3% inflation, prices double in about 24 years. If you are planning 20 years out, the budget on your statement then will be roughly 1.8 times what the same life costs today.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>Start from what you spend now. A year of bank and card statements catches irregular bills such as car repairs and insurance renewals. Then adjust each category for retirement and enter it in today's dollars.</p>
<h3>Housing</h3>
<p>Include mortgage or rent, property tax, home insurance, HOA dues, utilities and upkeep. Drop the mortgage only if it will be paid off by the time you retire; property tax, insurance and maintenance never go away.</p>
<h3>Health care</h3>
<p>This is the line most people get wrong: Medicare is not free. Budget for the Part B premium, a supplement or Medicare Advantage plan, Part D drugs, dental, vision and hearing, per person.</p>
<h3>Food</h3>
<p>Groceries plus eating out. Retirees often eat out less on workdays but more socially, so start from your current total.</p>
<h3>Transportation</h3>
<p>Car payments, fuel, insurance, repairs and transit. Commuting costs disappear, but plan to replace a car or two during retirement.</p>
<h3>Travel and entertainment</h3>
<p>Trips, hobbies, memberships and visits to family. This line is usually highest in the first decade of retirement.</p>
<h3>Everything else</h3>
<p>Clothing, gifts, phone and internet, personal care, donations and income taxes on withdrawals. Leave out work clothes and retirement contributions, which stop when you retire.</p>
<h3>Ages and inflation</h3>
<p>Your age now and your retirement age set how many years of inflation to apply. Many planners use 2.5–3% a year; at 3%, prices rise by about a third in 10 years.</p>
<h3>Social Security, pensions and withdrawal rate</h3>
<p>Enter your Social Security estimate from your my Social Security account plus any pension, in today's dollars. The withdrawal rate turns the rest of the budget into a savings target; 4% is the usual starting point for a 30-year retirement.</p>`
    },
    {
      h2: 'How much does the average retiree spend per month?',
      html: `<p>The Bureau of Labor Statistics Consumer Expenditure Survey gives the best public benchmark. In 2023, households headed by someone 65 or older spent an average of <strong>$60,087 a year</strong>, about $5,007 a month, for an average household of 1.7 people:</p>
<div class="twrap"><table><thead><tr><th>Category (2023, per year)</th><th>Age 65+</th><th>65–74</th><th>75+</th></tr></thead><tbody>
<tr><td>Housing</td><td>$21,445</td><td>$22,216</td><td>$20,370</td></tr>
<tr><td>Transportation</td><td>$9,033</td><td>$10,899</td><td>$6,448</td></tr>
<tr><td>Health care</td><td>$8,027</td><td>$7,942</td><td>$8,145</td></tr>
<tr><td>Food</td><td>$7,714</td><td>$8,566</td><td>$6,508</td></tr>
<tr><td>Personal insurance and pensions</td><td>$3,277</td><td>$4,286</td><td>$1,879</td></tr>
<tr><td>Cash contributions</td><td>$3,132</td><td>$2,756</td><td>$3,653</td></tr>
<tr><td>Entertainment</td><td>$2,898</td><td>$3,447</td><td>$2,131</td></tr>
<tr><td>Apparel and services</td><td>$1,287</td><td>$1,520</td><td>$958</td></tr>
<tr><td><strong>All spending</strong></td><td><strong>$60,087</strong></td><td><strong>$65,149</strong></td><td><strong>$53,031</strong></td></tr>
</tbody></table></div>
<p>Rows do not add to the total because smaller categories (education, personal care, reading, alcohol, tobacco and miscellaneous) are left out. Use these 2023-dollar averages to sanity-check your own lines, not as a target.</p>`
    },
    {
      h2: 'How much should I budget for health care in retirement?',
      html: `<h3>Medicare premiums and deductibles</h3>
<p>Plan on a real monthly line item, per person. For 2026 the standard Medicare Part B premium is <strong>$202.90 a month</strong>, and the Part B deductible is $283 a year, after which you generally pay 20% of approved costs. Higher-income retirees pay more for Part B through income-related surcharges.</p>
<h3>Coverage Medicare leaves out</h3>
<p>On top come a Medigap or Medicare Advantage plan, Part D drug coverage, and dental, vision and hearing care, which Original Medicare largely does not cover.</p>
<h3>Health care costs as you age</h3>
<p>The BLS figures show health care is the one major category that does not fall with age: households 75 and older spent $8,145 on it in 2023, slightly more than the 65–74 group. If you retire before 65, add the full cost of private or employer coverage until Medicare starts.</p>`
    },
    {
      h2: 'Does spending go down as you age in retirement?',
      html: `<h3>What the spending data shows</h3>
<p>On average, yes. In the 2023 survey, households headed by someone 75 or older spent $53,031, about 19% less than the 65–74 group's $65,149. Transportation fell by 41% and entertainment by 38%, while housing barely moved and health care rose.</p>
<h3>How to reflect it in your budget</h3>
<p>A budget that front-loads travel and car costs and keeps housing and medical costs flat is closer to how retirees actually spend than a single number raised with inflation forever. A flat, inflation-adjusted budget is still the safer plan: it leaves a cushion for long-term care, which averages hide.</p>`
    },
    {
      h2: 'How much do I need saved to fund my retirement budget?',
      html: `<h3>The multiply-by-25 shortcut</h3>
<p>Subtract guaranteed income from the budget and multiply what is left by 25 for a 4% withdrawal rate. Tom's $2,200 monthly shortfall is $26,400 a year, so he needs $660,000. At a more cautious 3.5% the target rises to $754,286.</p>
<h3>Why Social Security changes the target so much</h3>
<p>Every $100 a month of guaranteed income cuts the nest egg by $30,000 at 4%. Without his $2,400 of Social Security, Tom would need $1,380,000; with $3,000 a month, only $480,000.</p>
<h3>Next steps</h3>
<p>To turn the target into a monthly savings plan from your current balance, use the <a href="/retirement-calculator">retirement savings calculator</a>; to check your income sources against this budget, use the <a href="/retirement-income-calculator">retirement income calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is a realistic retirement budget?', a: 'For most people it is 70–90% of current spending, built line by line. The BLS average for households headed by someone 65 or older was $60,087 a year in 2023, about $5,007 a month.' },
    { q: 'How much should I budget per month for retirement?', a: 'Add up your expected costs by category; the default example comes to $4,600 a month, or $55,200 a year, in today\'s dollars. The BLS average for households 65 and older was about $5,007 a month in 2023.' },
    { q: 'Is $5,000 a month enough to retire?', a: 'It is close to the average: households 65 and older spent about $5,007 a month in 2023. With $2,400 of Social Security, a $5,000 budget needs $780,000 of savings at a 4% withdrawal rate.' },
    { q: 'How much do I need to retire on $4,600 a month?', a: 'With $2,400 a month from Social Security, the remaining $2,200 a month takes $660,000 of savings at a 4% withdrawal rate, in today\'s dollars.' },
    { q: 'How much do I need saved to spend $3,000 a month in retirement?', a: 'With no other income, $900,000 at a 4% withdrawal rate: $3,000 × 12 ÷ 0.04. Social Security or a pension lowers that by $30,000 for every $100 a month it pays.' },
    { q: 'How much does Medicare cost per month in 2026?', a: 'The standard Part B premium is $202.90 a month in 2026. Most people pay no Part A premium. Drug coverage, a supplement or an Advantage plan, and out-of-pocket costs are extra.' },
    { q: 'What percentage of a retirement budget goes to housing?', a: 'In the BLS 2023 data housing was about 36% of spending for households 65 and older ($21,445 of $60,087). In the default example it is 37%.' },
    { q: 'What expenses go down in retirement?', a: 'Commuting, work clothes, payroll taxes and retirement contributions stop, and a mortgage may be paid off. In BLS data, households 75 and older spent 41% less on transportation and 38% less on entertainment than those 65–74.' },
    { q: 'Should my retirement budget include income taxes?', a: 'Yes. Withdrawals from traditional 401(k)s and IRAs are taxed as income, and part of Social Security can be. Add expected taxes to the everything-else line, or estimate them with the <a href="/retirement-tax-calculator">retirement tax calculator</a>.' },
    { q: 'What inflation rate should I use for retirement planning?', a: 'Many planners use 2.5–3% for general spending. Running the calculator at 4% shows a cautious case: $4,600 today becomes $6,809 a month in 10 years.' },
    { q: 'How much will my budget cost in 20 years?', a: 'At 3% inflation, a $4,600 monthly budget costs about $8,308 a month in 20 years. Retiring at 65 from age 45, that is the figure your savings and income must cover in year one.' }
  ],
  related: ['retirement-income-calculator', 'retirement-calculator', 'how-long-will-money-last-calculator', 'retirement-tax-calculator', 'retirement-withdrawal-calculator'],
  sources: [
    { name: 'BLS: Consumer Expenditures in 2023 (Table 12, age of reference person)', url: 'https://www.bls.gov/opub/reports/consumer-expenditures/2023/' },
    { name: 'CMS: 2026 Medicare Parts A and B premiums and deductibles', url: 'https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles' },
    { name: 'Medicare.gov: Costs', url: 'https://www.medicare.gov/basics/costs/medicare-costs' },
    { name: 'Social Security Administration: my Social Security account', url: 'https://www.ssa.gov/myaccount/' }
  ],
  disclaimer: 'Budget figures are illustrations; BLS averages are in 2023 dollars. Not financial advice.'
};
