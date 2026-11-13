export default {
  slug: 'property-tax-calculator',
  hub: 'mortgage',
  name: 'Property Tax Calculator',
  title: 'Property Tax Calculator: $350,000 Home at 1.2% Is $3,900/Year',
  h1: 'Property Tax Calculator: Assessed Value, Exemptions and Mill Rates',
  meta: 'A $350,000 home with a $25,000 homestead exemption and a 1.2% tax rate owes $3,900 a year, or $325 a month in escrow. Works with percent or mill rates.',
  keyword: 'how to calculate property taxes',
  also: ['how is property tax calculated in california', 'how property tax is calculated in california', 'how to calculate property tax with mill rate', 'how are property taxes calculated in ohio', 'how are property taxes calculated in illinois', 'how to calculate property taxes in michigan', 'how is property tax calculated on new construction', 'how do they calculate property taxes'],
  updated: '2026-11-13',
  inputs: [
    { id: 'value', label: 'Market value of the home', type: 'number', value: 350000, prefix: '$' },
    { id: 'ratio', label: 'Assessment ratio', type: 'number', value: 100, suffix: '% of market value', help: '100% in many states; 35% in Ohio, 50% in Michigan, 10% for Cook County homes.' },
    { id: 'exempt', label: 'Exemptions (homestead, senior, veteran)', type: 'number', value: 25000, prefix: '$', help: 'Amount subtracted from assessed value.' },
    { id: 'method', label: 'Tax rate given as', type: 'select', value: 'pct', options: [['pct', 'Percent of taxable value'], ['mill', 'Mill rate (per $1,000)']] },
    { id: 'rate', label: 'Tax rate', type: 'number', value: 1.2, suffix: '%', showIf: { method: ['pct'] } },
    { id: 'mills', label: 'Mill rate', type: 'number', value: 25, suffix: 'mills', showIf: { method: ['mill'] } }
  ],
  compute(v, H) {
    if (!(v.value > 0)) return { error: 'Enter the home\'s market value.' };
    var ratio = v.ratio > 0 ? v.ratio / 100 : 1;
    var rate = v.method === 'mill' ? (v.mills >= 0 ? v.mills / 1000 : NaN) : (v.rate >= 0 ? v.rate / 100 : NaN);
    if (!(rate >= 0)) return { error: 'Enter the tax rate.' };
    var assessed = v.value * ratio;
    var taxable = Math.max(0, assessed - (v.exempt > 0 ? v.exempt : 0));
    var tax = taxable * rate;
    var eff = tax / v.value * 100;
    return {
      value: H.money(tax),
      label: 'Annual property tax',
      expr: H.money0(taxable) + ' × ' + (v.method === 'mill' ? H.num(v.mills, 3) + ' mills' : H.num(v.rate, 4) + '%'),
      rows: [
        ['Monthly (escrow)', H.money(tax / 12), true],
        ['Assessed value', H.money0(assessed)],
        ['Taxable value after exemptions', H.money0(taxable)],
        ['Effective tax rate (on market value)', H.pct(eff, 3)],
        ['Same rate in mills', H.num(rate * 1000, 3) + ' mills'],
        ['Tax per $1,000 of market value', H.money(eff * 10)]
      ],
      sub: 'Effective rate ' + H.pct(eff, 2) + ': ' + (eff < 0.6 ? 'low by U.S. standards.' : eff < 1.3 ? 'near the middle of the U.S. range.' : 'on the high side for the U.S.')
    };
  },
  quick: ({ r }) => `To calculate property tax, multiply the assessed value minus exemptions by the local tax rate. A <strong>$350,000</strong> home assessed at full value, with a $25,000 homestead exemption and a 1.2% rate, owes $325,000 × 0.012 = <strong>${r.value}</strong> a year, or ${r.rows[0][1]} a month in escrow. A rate of 12 mills is the same as 1.2%.`,
  stepsTitle: 'How to calculate property taxes',
  steps: [
    'Find the assessed value on your county assessor\'s notice or website. Many states assess at full market value; others use a fraction (the assessment ratio), such as 35% in Ohio.',
    'Subtract exemptions you qualify for: homestead, senior, disability or veteran. Most must be applied for once with the assessor and are not automatic, which is the most common reason people overpay.',
    'Find the total tax rate for your address, the sum of the county, city, school district and special district rates. It may be stated as a percent or in mills.',
    'Multiply taxable value by the rate (percent ÷ 100, or mills ÷ 1,000). Divide by 12 for the monthly amount your lender collects in escrow.'
  ],
  formulaTitle: 'What is the property tax formula?',
  formula: {
    expr: 'Assessed value = market value × assessment ratio<br>Property tax = (assessed value − exemptions) × tax rate<br>Tax rate = percent ÷ 100 = mills ÷ 1,000',
    vars: [['assessment ratio', 'share of market value that is taxed (100% in many states)'], ['exemptions', 'dollar amounts removed from assessed value'], ['mill', '$1 of tax per $1,000 of taxable value (0.1%)']],
    note: 'The effective tax rate, tax ÷ market value, is the number to compare across places, because assessment ratios and exemptions differ so much.'
  },
  example: `<p>Market value $350,000, assessed at 100%: assessed value <strong>$350,000</strong>.</p>
<p>Homestead exemption $25,000: taxable value <strong>$325,000</strong>.</p>
<p>Rate 1.2%: $325,000 × 0.012 = <strong>$3,900</strong> a year, $325 a month. The effective rate on the home's market value is $3,900 ÷ $350,000 = 1.114%.</p>
<p>The same bill in a mill-rate town: 12 mills × $325,000 ÷ 1,000 = $3,900.</p>`,
  table: {
    title: 'How much is property tax on a $200,000, $300,000 or $500,000 house?',
    intro: 'Annual tax at different effective rates (no exemptions, full-value assessment), computed by the calculator.',
    head: ['Home value', '0.5%', '0.75%', '1.0%', '1.5%', '2.0%', '2.5%'],
    rows: ({ run }) => [150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000].map(x => ['$' + x.toLocaleString('en-US'), ...[0.5, 0.75, 1, 1.5, 2, 2.5].map(t => run({ value: x, ratio: 100, exempt: 0, method: 'pct', rate: t }).value.replace(/\.00$/, ''))]),
    note: 'Effective rates in the U.S. range from roughly 0.3% of value in the lowest-tax states to above 2% in the highest. Your county\'s bill is the only exact source.'
  },
  sections: [
    {
      h2: 'How do you calculate property tax with a mill rate?',
      html: `<p>A mill is one-thousandth of a dollar, so a rate of 1 mill charges $1 for every $1,000 of taxable value. Divide the mill rate by 1,000 and multiply by taxable value, or move the decimal: 25 mills = 2.5%.</p>
<p>Connecticut is a classic mill-rate state and assesses homes at 70% of market value. A $350,000 home there is assessed at $245,000; at 30 mills the bill is $245,000 × 30 ÷ 1,000 = <strong>$7,350</strong>, an effective rate of 2.1%. Switch "Tax rate given as" to mills above, set the ratio to 70% and the exemption to $0 to reproduce it.</p>`
    },
    {
      h2: 'How is property tax calculated in California?',
      html: `<p>Under Proposition 13 the base rate is <strong>1%</strong> of assessed value, plus voter-approved bonds and special assessments that usually bring the total to about 1.1% to 1.3%. The assessed value is set at your purchase price and can rise by no more than <strong>2% a year</strong> until the home is sold or newly built on, regardless of how much the market climbs. Owner-occupants can claim a $7,000 homeowners' exemption, which cuts the bill by roughly $70 to $90.</p>
<p>Example: a home bought for $500,000 ten years ago has an assessed value of at most $500,000 × 1.02<sup>10</sup> = $609,497. At a 1.15% total rate, minus the $7,000 exemption, the bill is about <strong>$6,929</strong>, even if the home would now sell for $900,000. A buyer paying $900,000 is reassessed to that price and receives a supplemental tax bill for the rest of the fiscal year.</p>`
    },
    {
      h2: 'How are property taxes calculated in Illinois, Ohio and Michigan?',
      html: `<ul>
<li><strong>Illinois:</strong> homes are assessed at one-third of market value outside Cook County and 10% inside it. The state equalization factor is applied, homestead exemptions are subtracted (the general homestead exemption in Cook County removes $10,000 of equalized value), and the result is multiplied by the combined local rate, which is stated as a percent of equalized value and is much higher than the effective rate.</li>
<li><strong>Ohio:</strong> the assessed value is 35% of the county auditor's appraised value. It is multiplied by the effective millage after tax reduction factors, then any homestead or owner-occupancy credits are subtracted.</li>
<li><strong>Michigan:</strong> the state equalized value is 50% of market value, but the tax is charged on the <em>taxable value</em>, whose yearly growth is capped at the lower of 5% or inflation until the home sells. A principal residence exemption removes up to 18 mills of school operating tax from owner-occupied homes.</li>
</ul>
<p>In each case the calculator works if you enter the assessment ratio, the exemption amount and the local rate from your tax bill.</p>`
    },
    {
      h2: 'Can you deduct property taxes on your federal return?',
      html: `<p>Yes, if you itemize on Schedule A. State and local taxes, including property, income or sales tax, share one cap. The cap rose to $40,000 for 2025 and <strong>$40,400 for 2026</strong> ($20,200 if married filing separately), and phases down to $10,000 for taxpayers with modified adjusted gross income above $505,000 in 2026. Most homeowners take the standard deduction instead, so check whether your mortgage interest, SALT and charitable gifts together exceed it before counting on a tax benefit. Only taxes based on assessed value count; flat fees for trash or water service do not.</p>`
    }
  ],
  faq: [
    { q: 'How much is property tax on a $300,000 house?', a: 'At a 1% effective rate it is $3,000 a year ($250 a month); at 1.5% it is $4,500 and at 2% it is $6,000. Your actual bill depends on your assessment and exemptions.' },
    { q: 'What is a mill rate?', a: 'A mill is $1 of tax per $1,000 of taxable value, or 0.1%. A 25-mill rate means $25 per $1,000, so a $200,000 taxable value owes $5,000.' },
    { q: 'How is property tax calculated on new construction?', a: 'Until the house is finished, you are usually billed on the land alone. Once the assessor adds the completed home, often as of the next assessment date, the bill jumps, and some states send a supplemental bill for the partial year.' },
    { q: 'Why did my property tax go up if the rate stayed the same?', a: 'Because the assessed value rose, an exemption dropped off, or voters approved a new levy. Check the assessment notice: if the value is higher than comparable sales support, you can appeal within the deadline on the notice.' },
    { q: 'How do I find my property tax rate?', a: 'Look at last year\'s tax bill or the county treasurer\'s or assessor\'s website, which lists the combined rate for each tax district. Dividing last year\'s bill by your home\'s market value gives your effective rate.' },
    { q: 'Are property taxes included in my mortgage payment?', a: 'Usually, if you have an escrow account. Your lender collects one-twelfth of the yearly bill each month and pays the county when it is due.' }
  ],
  related: ['mortgage-calculator', 'house-affordability-calculator', 'home-sale-proceeds-calculator', 'rental-property-calculator', 'income-tax-calculator'],
  sources: [
    { name: 'IRS: Topic 503, Deductible taxes', url: 'https://www.irs.gov/taxtopics/tc503' },
    { name: 'IRS: About Schedule A (Form 1040), Itemized Deductions', url: 'https://www.irs.gov/forms-pubs/about-schedule-a-form-1040' },
    { name: 'California State Board of Equalization', url: 'https://www.boe.ca.gov/' },
    { name: 'Michigan Department of Treasury: Property Tax', url: 'https://www.michigan.gov/taxes/property' },
    { name: 'Cook County Assessor\'s Office', url: 'https://www.cookcountyassessoril.gov/' }
  ]
};
