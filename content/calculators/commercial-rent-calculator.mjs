export default {
  slug: 'commercial-rent-calculator',
  hub: 'mortgage',
  name: 'Commercial Rent Calculator',
  title: 'Commercial Rent Calculator: 2,500 sq ft at $24 NNN = $6,667/mo',
  h1: 'Commercial Rent Calculator: Price per Square Foot to Monthly Rent',
  meta: '2,500 sq ft at $24 per square foot per year plus $8 of NNN charges is $6,666.67 a month, or $80,000 a year. Convert any quote to monthly rent and lease cost.',
  keyword: 'how to calculate commercial rent',
  also: ['how to calculate rent for commercial property', 'how to calculate rent per square foot per month', 'how to calculate office space rent', 'how to calculate commercial property rent', 'how do i calculate commercial rent', 'how to calculate triple net lease', 'how to calculate net effective rent', 'how to calculate rent per square foot commercial'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sqft', label: 'Rentable square feet', type: 'number', value: 2500, suffix: 'sq ft' },
    { id: 'rate', label: 'Base rent rate', type: 'number', value: 24, prefix: '$', suffix: '/ sq ft' },
    { id: 'per', label: 'Rate is quoted', type: 'select', value: 'yr', options: [['yr', 'Per sq ft per year'], ['mo', 'Per sq ft per month']] },
    { id: 'type', label: 'Lease type', type: 'select', value: 'nnn', options: [['nnn', 'Triple net (NNN)'], ['mg', 'Modified gross (some pass-throughs)'], ['gross', 'Full-service gross']] },
    { id: 'extra', label: 'NNN / CAM charges', type: 'number', value: 8, prefix: '$', suffix: '/ sq ft / yr', showIf: { type: ['nnn', 'mg'] }, help: 'Taxes, insurance and common-area maintenance passed to the tenant.' },
    { id: 'years', label: 'Lease term', type: 'number', value: 5, suffix: 'years' },
    { id: 'esc', label: 'Annual base rent increase', type: 'number', value: 3, suffix: '%' },
    { id: 'free', label: 'Free rent', type: 'number', value: 0, suffix: 'months' }
  ],
  compute(v, H) {
    if (!(v.sqft > 0)) return { error: 'Enter the square footage.' };
    if (!(v.rate > 0)) return { error: 'Enter the rent per square foot.' };
    var annualRate = v.per === 'mo' ? v.rate * 12 : v.rate;
    var base = v.sqft * annualRate;
    var extraRate = v.type === 'gross' ? 0 : (v.extra > 0 ? v.extra : 0);
    var extras = v.sqft * extraRate;
    var yrs = v.years > 0 ? Math.round(v.years) : 1;
    var esc = (v.esc || 0) / 100;
    var baseTotal = 0;
    for (var y = 0; y < yrs; y++) baseTotal += base * Math.pow(1 + esc, y);
    var free = Math.min(v.free > 0 ? v.free : 0, yrs * 12);
    var abate = base / 12 * free;
    var total = baseTotal - abate + extras * yrs;
    var ner = (baseTotal - abate) / yrs / v.sqft;
    var monthly = (base + extras) / 12;
    return {
      value: H.money(monthly),
      label: 'Monthly rent, year 1' + (extras > 0 ? ' (base + charges)' : ''),
      expr: H.num(v.sqft, 0) + ' sq ft × ' + H.money(annualRate + extraRate) + ' ÷ 12',
      rows: [
        ['Base rent per month', H.money(base / 12), true],
        ['NNN / CAM per month', H.money(extras / 12)],
        ['Annual rent, year 1', H.money0(base + extras)],
        ['All-in cost per sq ft per month', H.money((annualRate + extraRate) / 12)],
        ['Base rent in final year', H.money0(base * Math.pow(1 + esc, yrs - 1)) + '/yr'],
        ['Total cost over ' + yrs + ' years', H.money0(total)],
        ['Net effective base rent', H.money(ner) + '/sq ft/yr']
      ],
      sub: v.type === 'gross' ? 'Full-service gross: the landlord pays taxes, insurance and operating costs out of the rent, though you may owe increases over a base year.' : 'Pass-through charges are estimates; the landlord reconciles them against actual costs each year, so budget for a true-up.'
    };
  },
  quick: ({ r }) => `To calculate commercial rent, multiply the square footage by the annual rate and divide by 12. <strong>2,500 sq ft</strong> at <strong>$24</strong> per sq ft per year is $60,000 a year, or ${r.rows[0][1]} a month in base rent. On a triple-net lease add $8 per sq ft for taxes, insurance and CAM and the total is <strong>${r.value} a month</strong>.`,
  stepsTitle: 'How to calculate commercial rent',
  steps: [
    'Get the rentable square footage from the listing or lease. It includes your share of common areas, so it is larger than the space you actually occupy.',
    'Check how the rate is quoted. Most U.S. office, retail and industrial listings quote dollars per square foot <strong>per year</strong>; some markets quote per month. Treating an annual rate as monthly is the mistake that makes rent look 12 times too high.',
    'Multiply square feet by the annual rate and divide by 12 for monthly base rent.',
    'On NNN or modified gross leases, add the estimated pass-through charges (taxes, insurance, CAM) per square foot, then factor in annual escalations and any free months for the full lease cost.'
  ],
  formulaTitle: 'What is the commercial rent formula?',
  formula: {
    expr: 'Monthly base rent = square feet × annual rate ÷ 12<br>Monthly NNN rent = square feet × (annual rate + NNN charges) ÷ 12<br>Net effective rent = (total base rent − free rent) ÷ years ÷ square feet',
    vars: [['annual rate', 'dollars per rentable sq ft per year (monthly rate × 12)'], ['NNN charges', 'property tax, insurance and common-area maintenance per sq ft per year'], ['net effective rent', 'average base rent after concessions, used to compare offers']]
  },
  example: `<p>2,500 sq ft × $24 = <strong>$60,000</strong> base rent a year, or $5,000 a month.</p>
<p>NNN charges: 2,500 × $8 = $20,000 a year, $1,666.67 a month. Total: <strong>$6,666.67</strong> a month, $80,000 in year 1.</p>
<p>With 3% yearly increases over 5 years, base rent totals $318,548. Add $100,000 of estimated charges and the lease costs <strong>$418,548</strong>. Net effective base rent is $318,548 ÷ 5 ÷ 2,500 = $25.48 per sq ft per year.</p>`,
  table: {
    title: 'What is the monthly rent for common space sizes?',
    intro: 'Monthly base rent at typical annual rates per square foot, before any NNN charges, computed by the calculator.',
    head: ['Square feet', '$15 /sq ft/yr', '$20', '$24', '$30', '$40'],
    rows: ({ run }) => [500, 1000, 1500, 2000, 2500, 3000, 5000, 7500, 10000].map(s => [s.toLocaleString('en-US'), ...[15, 20, 24, 30, 40].map(x => run({ sqft: s, rate: x, per: 'yr', type: 'gross' }).value)]),
    note: 'Divide any annual rate by 12 for the monthly rate per square foot: $24 a year is $2.00 a month.'
  },
  sections: [
    {
      h2: 'How do you calculate rent per square foot per month?',
      html: `<p>Divide the annual rate by 12: $24 per square foot per year is <strong>$2.00</strong> per square foot per month, and $30 a year is $2.50. To go from a monthly quote to an annual one, multiply by 12. Some West Coast markets and many retail and industrial landlords quote monthly rates, so a listing at "$1.75" is almost certainly per month ($21 a year), while "$21" is per year.</p>
<p>To find the rate from a rent you already pay, divide annual rent by square feet: $4,500 a month on 2,000 sq ft is $54,000 ÷ 2,000 = $27 per square foot per year.</p>`
    },
    {
      h2: 'How is a triple net (NNN) lease calculated?',
      html: `<p>On a triple-net lease the tenant pays base rent plus its share of the building's three big operating costs: <strong>property taxes, insurance and common-area maintenance (CAM)</strong>. The landlord estimates these per square foot at the start of each year, bills them monthly with the rent, and reconciles against actual costs after year end, sending a refund or an extra bill.</p>
<ul>
<li><strong>NNN:</strong> base rent + taxes + insurance + CAM. Common for retail and single-tenant buildings.</li>
<li><strong>Modified gross:</strong> some costs are included in the rent and some passed through, or the tenant pays increases over a base year.</li>
<li><strong>Full-service gross:</strong> one rate covers everything except, often, the tenant's own electricity and janitorial. Common for multi-tenant offices.</li>
</ul>
<p>Compare offers on an all-in basis: a $20 NNN space with $9 of charges ($29) costs more than a $27 full-service space.</p>`
    },
    {
      h2: 'What is the difference between rentable and usable square feet?',
      html: `<p>Usable square feet is the space you occupy. Rentable square feet adds your share of lobbies, corridors, restrooms and other common areas, and it is what rent is charged on. The ratio between them is the <strong>load factor</strong>: rentable = usable × (1 + load factor).</p>
<p>A suite with 2,174 usable sq ft in a building with a 15% load factor is billed as 2,174 × 1.15 = 2,500 rentable sq ft. Two spaces with the same rentable size can feel very different if their load factors differ, so ask for both numbers and compare the cost per usable square foot.</p>`
    },
    {
      h2: 'How do you calculate net effective rent with free rent?',
      html: `<p>Add up base rent over the full term, subtract the value of free months or other landlord concessions, then divide by the number of years and square feet. In the default lease, three free months at $5,000 save $15,000, so net effective base rent falls from $25.48 to ($318,548 − $15,000) ÷ 5 ÷ 2,500 = <strong>$24.28</strong> per square foot per year. Enter the free months above to see it. Tenant improvement allowances can be treated the same way if they replace money you would otherwise spend.</p>
<p>Rent paid for business space is generally a deductible business expense; see the IRS guidance below. Landlords evaluating the same lease from the other side use the <a href="/cap-rate-calculator">commercial property value calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much is $20 per square foot in monthly rent?', a: 'Multiply by the square footage and divide by 12. For 2,000 sq ft, $20 × 2,000 = $40,000 a year, or $3,333.33 a month.' },
    { q: 'What does $15 per square foot NNN mean?', a: 'Base rent is $15 per square foot per year, and you also pay your share of property taxes, insurance and common-area maintenance on top. At $6 of charges, the all-in cost is $21 per square foot per year.' },
    { q: 'Is commercial rent quoted per month or per year?', a: 'In most U.S. markets it is per square foot per year, especially for office space. Some retail, industrial and West Coast listings quote per month; a rate under about $5 is almost always monthly.' },
    { q: 'What are CAM charges?', a: 'Common-area maintenance charges cover shared costs such as cleaning, landscaping, parking lot upkeep, security and management of common areas, divided among tenants by square footage.' },
    { q: 'What is a typical annual rent escalation?', a: 'Fixed increases of about 2% to 4% a year are common, or increases tied to the consumer price index. Over a 5-year lease, 3% annual bumps raise the final-year base rent by 12.6%.' },
    { q: 'How do I calculate office space needed per employee?', a: 'Multiply headcount by a space allowance per person, often 150 to 250 rentable square feet for a typical office layout, then add room for meeting and storage space.' }
  ],
  related: ['cap-rate-calculator', 'rent-increase-calculator', 'vacancy-rate-calculator', 'break-even-calculator', 'rental-property-calculator'],
  sources: [
    { name: 'IRS: Guide to business expense resources', url: 'https://www.irs.gov/forms-pubs/guide-to-business-expense-resources' },
    { name: 'IRS: Publication 334, Tax Guide for Small Business', url: 'https://www.irs.gov/publications/p334' },
    { name: 'U.S. Small Business Administration: Launch your business – business location', url: 'https://www.sba.gov/business-guide/launch-your-business/pick-your-business-location' }
  ]
};
