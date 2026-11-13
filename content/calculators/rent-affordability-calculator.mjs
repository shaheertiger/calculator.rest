export default {
  slug: 'rent-affordability-calculator',
  hub: 'mortgage',
  name: '3x Rent Calculator',
  title: '3x Rent Calculator: $1,800 Rent Needs $64,800 a Year',
  h1: '3 Times the Rent Calculator: Income Needed and Maximum Rent',
  meta: 'To pass a 3x rent rule on an $1,800 apartment you need $5,400 a month, or $64,800 a year in gross income. Or enter a salary to find your maximum rent.',
  keyword: 'how to calculate 3 times the rent',
  also: ['how to calculate three times the rent', 'how to calculate 3 times rent', '3x rent calculator', 'how much rent can i afford calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you want to find?', type: 'select', value: 'income', options: [['income', 'Income needed for a rent'], ['rent', 'Maximum rent for my income']], wide: true },
    { id: 'rent', label: 'Monthly rent', type: 'number', value: 1800, prefix: '$', showIf: { mode: ['income'] } },
    { id: 'income', label: 'Gross annual income (all applicants)', type: 'number', value: 72000, prefix: '$', showIf: { mode: ['rent'] } },
    { id: 'mult', label: 'Landlord\'s income rule', type: 'select', value: '3', options: [['3', '3× monthly rent'], ['2.5', '2.5× monthly rent'], ['3.5', '3.5× monthly rent'], ['40', '40× monthly rent per year (NYC-style)']] }
  ],
  compute(v, H) {
    var m = v.mult === '40' ? 40 / 12 : Number(v.mult) || 3;
    var ruleLabel = v.mult === '40' ? '40× rule' : H.num(m, 1) + '× rule';
    if (v.mode === 'rent') {
      if (!(v.income > 0)) return { error: 'Enter your gross annual income.' };
      var maxRent = v.income / 12 / m;
      return {
        value: H.money0(Math.floor(maxRent)),
        label: 'Maximum monthly rent (' + ruleLabel + ')',
        expr: H.money0(v.income) + ' ÷ 12 ÷ ' + H.num(m, 3),
        rows: [
          ['Gross monthly income', H.money(v.income / 12)],
          ['Rent at 30% of income (HUD affordability line)', H.money0(v.income * 0.3 / 12), true],
          ['Rent at 2.5× rule', H.money0(v.income / 12 / 2.5)],
          ['Rent at 3× rule', H.money0(v.income / 12 / 3)],
          ['Rent at 40× rule', H.money0(v.income / 40)],
          ['Hourly pay equivalent (2,080 hrs)', H.money(v.income / 2080)]
        ],
        sub: 'Landlords compare gross (pre-tax) income. Rent at ' + H.money0(maxRent) + ' would be ' + H.pct(100 / m, 1) + ' of it.'
      };
    }
    if (!(v.rent > 0)) return { error: 'Enter the monthly rent.' };
    var monthly = v.rent * m, annual = monthly * 12;
    return {
      value: H.money0(annual),
      label: 'Annual income needed (' + ruleLabel + ')',
      expr: H.money0(v.rent) + ' × ' + H.num(m, 3) + ' × 12',
      rows: [
        ['Monthly income needed', H.money0(monthly), true],
        ['Hourly pay at 40 hrs/week', H.money(annual / 2080)],
        ['Income needed at 2.5×', H.money0(v.rent * 2.5 * 12)],
        ['Income needed at 40× (and the 30% rule)', H.money0(v.rent * 40)],
        ['Each of 2 roommates (if combined income counts)', H.money0(annual / 2)],
        ['Typical guarantor requirement (80×)', H.money0(v.rent * 80)]
      ],
      sub: 'At ' + H.money0(annual) + ' a year the rent is ' + H.pct(100 / m, 1) + ' of gross income.'
    };
  },
  quick: ({ r }) => `To calculate 3 times the rent, multiply the monthly rent by 3 to get the gross monthly income a landlord wants to see, then by 12 for the yearly figure. For an <strong>$1,800</strong> apartment that is $5,400 a month, or <strong>${r.value} a year</strong>, about ${r.rows[1][1]} an hour full-time. Under a 40× rule you would need $72,000.`,
  stepsTitle: 'How to calculate 3 times the rent',
  steps: [
    'Take the monthly rent from the listing, without utilities or parking unless the landlord says they are included.',
    'Multiply by 3 for the monthly income required: $1,800 × 3 = $5,400.',
    'Multiply by 12 for annual income: $5,400 × 12 = $64,800. Compare it with your <strong>gross</strong> pay, before taxes. Checking it against take-home pay is the most common mix-up and makes you think you fall short when you don\'t.',
    'If a landlord uses a 40× rule, multiply the monthly rent by 40 and compare it with your annual income instead.'
  ],
  formulaTitle: 'What is the formula for 3 times the rent?',
  formula: {
    expr: 'Monthly income needed = rent × 3<br>Annual income needed = rent × 36<br>Maximum rent = annual income ÷ 36 (or monthly income ÷ 3)',
    vars: [['rent', 'monthly rent on the lease'], ['36', '3 × 12 months'], ['40× rule', 'annual income ≥ 40 × monthly rent, the same as 3.33× monthly']]
  },
  example: `<p>Rent $1,800. Monthly income needed: $1,800 × 3 = <strong>$5,400</strong>. Annual: $5,400 × 12 = <strong>$64,800</strong>.</p>
<p>Hourly equivalent at 2,080 working hours a year: $64,800 ÷ 2,080 = <strong>$31.15</strong>.</p>
<p>Going the other way, a $72,000 salary qualifies for up to $72,000 ÷ 36 = <strong>$2,000</strong> a month under the 3× rule, or $1,800 under the 40× rule.</p>`,
  table: {
    title: 'How much do I need to make for my rent?',
    intro: 'Gross annual income needed under the common landlord rules, computed by the calculator.',
    head: ['Monthly rent', '2.5× rule', '3× rule', 'Hourly at 3×', '40× rule / 30% of income'],
    rows: ({ run }) => [1000, 1200, 1500, 1800, 2000, 2200, 2500, 3000, 3500, 4000].map(x => {
      const o = run({ mode: 'income', rent: x, mult: '3' });
      return ['$' + x.toLocaleString('en-US'), o.rows[2][1], o.value, o.rows[1][1], o.rows[3][1]];
    }),
    note: 'The 40× rule and the 30%-of-income guideline give the same answer: rent ÷ 0.30 × 12 = rent × 40.'
  },
  sections: [
    {
      h2: 'Is the 3x rent rule the same as the 30% rule?',
      html: `<p>Close, but not quite. The 3× rule caps rent at one-third (33.3%) of gross income. The 30% rule comes from the federal definition of housing affordability: HUD considers a household <strong>cost-burdened</strong> when housing takes more than 30% of income, and severely cost-burdened above 50%. The Census Bureau found 20.1 million renter households over the 30% line in 2021.</p>
<p>On an $1,800 rent, 3× requires $64,800 a year; 30% requires $72,000. The 40× rule many New York City landlords use lands on the same $72,000. If you are budgeting for yourself rather than passing a screen, 30% is the safer number, and less if you have student loans or a car payment.</p>`
    },
    {
      h2: 'How much rent can I afford on my salary?',
      html: `<p>Divide your gross annual salary by 36 for the 3× limit, or by 40 for the stricter rule:</p>
<div class="twrap"><table><thead><tr><th>Salary</th><th>Max rent at 3×</th><th>Max rent at 40× / 30%</th></tr></thead><tbody>
<tr><td>$35,000</td><td>$972</td><td>$875</td></tr>
<tr><td>$50,000</td><td>$1,388</td><td>$1,250</td></tr>
<tr><td>$60,000</td><td>$1,666</td><td>$1,500</td></tr>
<tr><td>$75,000</td><td>$2,083</td><td>$1,875</td></tr>
<tr><td>$100,000</td><td>$2,777</td><td>$2,500</td></tr>
</tbody></table></div>
<p>Switch the calculator to "Maximum rent for my income" for any salary. Hourly workers can multiply their wage by 2,080 (40 hours × 52 weeks) to estimate annual pay: $20 an hour is $41,600, which qualifies for about $1,155 a month at 3×.</p>`
    },
    {
      h2: 'What if I don\'t make 3 times the rent?',
      html: `<p>Landlords use the rule to screen, and many will accept alternatives:</p>
<ul>
<li><strong>A guarantor or co-signer</strong>, who typically must earn far more, often 80 times the monthly rent a year in New York City, or about $144,000 for an $1,800 apartment.</li>
<li><strong>Combined income</strong> from roommates or a partner, if the landlord counts all leaseholders together rather than requiring each to qualify.</li>
<li><strong>Savings or assets</strong> shown on bank statements, sometimes enough to cover a full year of rent.</li>
<li><strong>A larger security deposit or prepaid rent</strong>, where state law allows it; several states cap deposits.</li>
<li><strong>Proof of a job offer</strong> or of income that is not on a pay stub, such as Social Security, child support or freelance income, documented with letters or tax returns.</li>
</ul>
<p>Tenant-based rental assistance changes the math entirely; see how voucher rent is set with the <a href="/section-8-rent-calculator">Section 8 rent calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much do I need to make for $1,500 rent?', a: '$54,000 a year ($4,500 a month) under the 3× rule, or $60,000 under a 40× rule.' },
    { q: 'How much do I need to make for $2,000 rent?', a: '$72,000 a year ($6,000 a month) at 3× rent, or $80,000 at 40× rent. That is about $34.62 an hour full-time at 3×.' },
    { q: 'Is 3 times the rent based on gross or net income?', a: 'Gross income, before taxes and deductions. Landlords verify it with pay stubs, an offer letter, tax returns or bank statements.' },
    { q: 'Does 3 times the rent include utilities?', a: 'Usually not; landlords apply the rule to the base rent on the lease. When utilities are included in the rent, they are part of the figure automatically.' },
    { q: 'Do landlords count roommates\' income together?', a: 'Policies vary. Many combine the income of everyone on the lease; others require each roommate to earn 3× their share, or 3× the full rent for a single guarantor.' },
    { q: 'What does 40 times the rent mean?', a: 'Your annual income must be at least 40 times the monthly rent. For $1,800 rent that is $72,000 a year, the same as spending 30% of income on rent.' }
  ],
  related: ['rent-increase-calculator', 'section-8-rent-calculator', 'house-affordability-calculator', 'salary-to-hourly-calculator', 'dti-calculator'],
  sources: [
    { name: 'U.S. Census Bureau: Low-income renters spent larger share of income on rent', url: 'https://www.census.gov/library/stories/2023/03/low-income-renters-spent-larger-share-of-income-on-rent.html' },
    { name: 'HUD User: Comprehensive Housing Affordability Strategy (CHAS) data', url: 'https://www.huduser.gov/portal/datasets/cp.html' },
    { name: 'CFPB: What is a debt-to-income ratio?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/' }
  ]
};
