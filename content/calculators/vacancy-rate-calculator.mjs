export default {
  slug: 'vacancy-rate-calculator',
  hub: 'mortgage',
  name: 'Vacancy Rate Calculator',
  title: 'Vacancy Rate Calculator: 3 of 40 Units Empty Is 7.5%',
  h1: 'Vacancy Rate Calculator: Physical Vacancy, Economic Occupancy and Lost Rent',
  meta: 'With 3 of 40 units empty, vacancy is 7.5% and occupancy 92.5%. At $1,500 rents that is $4,500 of lost rent a month. Add rent collected for economic vacancy.',
  keyword: 'how to calculate vacancy rate',
  also: ['how to calculate vacancy loss', 'how to calculate occupancy rate', 'vacancy rate calculator', 'how to calculate economic vacancy'],
  updated: '2026-11-13',
  inputs: [
    { id: 'units', label: 'Total rentable units', type: 'number', value: 40, suffix: 'units' },
    { id: 'vacant', label: 'Vacant units', type: 'number', value: 3, suffix: 'units' },
    { id: 'rent', label: 'Average market rent per unit', type: 'number', value: 1500, prefix: '$', suffix: '/ mo' },
    { id: 'collected', label: 'Rent actually collected this month (optional)', type: 'number', value: 54000, prefix: '$', help: 'Adds economic occupancy: concessions, bad debt and below-market leases.' }
  ],
  compute(v, H) {
    if (!(v.units > 0)) return { error: 'Enter the total number of units.' };
    if (!(v.vacant >= 0) || v.vacant > v.units) return { error: 'Vacant units must be between 0 and the total.' };
    var rate = v.vacant / v.units * 100;
    var rows = [['Physical occupancy', H.pct(100 - rate, 2), true], ['Occupied units', H.num(v.units - v.vacant, 0)]];
    if (v.rent > 0) {
      var gpr = v.units * v.rent, loss = v.vacant * v.rent;
      rows.push(['Gross potential rent', H.money0(gpr) + '/mo']);
      rows.push(['Vacancy loss', H.money0(loss) + '/mo (' + H.money0(loss * 12) + '/yr)']);
      if (v.collected >= 0) {
        var eo = v.collected / gpr * 100;
        rows.push(['Economic occupancy', H.pct(eo, 2), true]);
        rows.push(['Economic vacancy', H.pct(100 - eo, 2)]);
        rows.push(['Other income loss (concessions, bad debt, loss-to-lease)', H.money0(Math.max(0, gpr - loss - v.collected)) + '/mo']);
      }
    }
    return {
      value: H.pct(rate, 2),
      label: 'Physical vacancy rate',
      expr: H.num(v.vacant, 2) + ' ÷ ' + H.num(v.units, 0) + ' units',
      rows: rows,
      sub: 'The U.S. rental vacancy rate was 7.6% in the third quarter of 2026 (Census Bureau). ' + (rate < 5 ? 'This property is tighter than that.' : rate <= 8 ? 'This property is close to the national rate.' : 'This property is running looser than the national rate.')
    };
  },
  quick: ({ r }) => `To calculate vacancy rate, divide vacant units by total units and multiply by 100. A <strong>40-unit</strong> building with <strong>3</strong> empty units has a vacancy rate of 3 ÷ 40 = <strong>${r.value}</strong> and occupancy of ${r.rows[0][1]}. At $1,500 average rent that is $4,500 of lost rent a month. Collecting $54,000 of a possible $60,000 is ${r.rows[4][1]} economic occupancy.`,
  stepsTitle: 'How to calculate vacancy rate',
  steps: [
    'Count the total rentable units, including any that are vacant but ready to lease. Leave out units you have deliberately taken offline for a long renovation, and say so when you report the rate.',
    'Count the units that are vacant on the measurement date. A unit with a signed lease but no tenant yet is usually counted as leased, not vacant.',
    'Divide vacant units by total units and multiply by 100. Occupancy is 100% minus that.',
    'For economic vacancy, compare rent collected with gross potential rent (every unit at market rent). The gap includes concessions, bad debt and below-market leases that a unit count misses, which is the part owners most often forget.'
  ],
  formulaTitle: 'What is the vacancy rate formula?',
  formula: {
    expr: 'Vacancy rate = vacant units ÷ total units × 100<br>Vacancy loss = vacant units × market rent<br>Economic occupancy = rent collected ÷ gross potential rent × 100',
    vars: [['total units', 'all units available to rent'], ['market rent', 'what each vacant unit would lease for today'], ['gross potential rent', 'total units × market rent']],
    note: 'For a single property tracked over a year, use unit-days: days vacant across all units ÷ (units × 365).'
  },
  example: `<p>40 units, 3 vacant: 3 ÷ 40 = 0.075 → <strong>7.5% vacancy</strong>, 92.5% occupancy.</p>
<p>Gross potential rent: 40 × $1,500 = $60,000 a month. Vacancy loss: 3 × $1,500 = <strong>$4,500</strong> a month, $54,000 a year.</p>
<p>Collected: $54,000. Economic occupancy = $54,000 ÷ $60,000 = <strong>90%</strong>, so economic vacancy is 10%. The extra $1,500 beyond empty units came from a move-in special and one tenant behind on rent.</p>`,
  table: {
    title: 'How much rent does each vacant unit cost?',
    intro: 'A 40-unit building at $1,500 average rent, computed by the calculator.',
    head: ['Vacant units', 'Vacancy rate', 'Occupancy', 'Lost rent per month and year'],
    rows: ({ run }) => [0, 1, 2, 3, 4, 5, 6, 8, 10].map(x => {
      const o = run({ vacant: x, collected: NaN });
      return [String(x), o.value, o.rows[0][1], o.rows[3][1]];
    }),
    note: 'At a 7% cap rate, each $1,500 of permanent monthly vacancy loss ($18,000 a year of NOI) lowers the building\'s value by about $257,000.'
  },
  sections: [
    {
      h2: 'What is the difference between physical and economic vacancy?',
      html: `<p><strong>Physical vacancy</strong> counts empty units. <strong>Economic vacancy</strong> measures lost income: everything between the rent you could collect at market rates and what actually arrives. It includes vacant units plus free-rent concessions, bad debt, units used as models or offices, and leases signed below market (loss-to-lease).</p>
<p>A building can be 97% physically occupied and only 90% economically occupied if it is offering a month free to fill units or carrying tenants who don't pay. Lenders and appraisers underwrite economic vacancy, which is why the vacancy line in a pro forma is often larger than the count of empty doors suggests.</p>`
    },
    {
      h2: 'What is a normal vacancy rate for rental property?',
      html: `<p>The Census Bureau's quarterly survey put the U.S. rental vacancy rate at <strong>7.6%</strong> in the third quarter of 2026, up from 7.1% a year earlier, while the homeowner vacancy rate held at 1.2%. Rates vary widely by metro, building age and price tier, and new supply can push a local market well above the national figure for a year or two.</p>
<p>The Census rate is vacant units for rent divided by the rental inventory: renter-occupied units, plus vacant units for rent, plus units rented but not yet occupied. For your own underwriting, 5% is a common default for stabilized single-family rentals and 5% to 8% for apartments, and more in a soft market or a building with frequent turnover. The <a href="/rental-property-calculator">rental property cash flow calculator</a> applies your vacancy assumption to cash flow.</p>`
    },
    {
      h2: 'How do you calculate vacancy loss for a single rental?',
      html: `<p>Use time instead of units. Divide the days or weeks the property sat empty by the days or weeks in the period. A house vacant for 3 weeks between tenants in a year has a vacancy rate of 3 ÷ 52 = <strong>5.8%</strong>. At $2,000 a month ($24,000 a year) the vacancy loss is $24,000 × 0.058 = about $1,385.</p>
<p>For a portfolio, add up vacant unit-days: 4 units each empty 20 days in a year is 80 vacant days out of 1,460 unit-days, a 5.5% vacancy rate. Track turnover costs separately; cleaning, paint and leasing fees often cost as much as the lost rent itself.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate occupancy rate?', a: 'Divide occupied units by total units and multiply by 100, or subtract the vacancy rate from 100%. 37 of 40 units occupied is 92.5% occupancy.' },
    { q: 'What is a good occupancy rate for apartments?', a: 'Stabilized apartment buildings commonly run 93% to 97% occupied. Much higher can mean rents are below market; much lower suggests pricing, condition or management problems, or a market with lots of new supply.' },
    { q: 'What vacancy rate should I use when analyzing a rental?', a: 'Check local vacancy data and the property\'s history. Absent better data, 5% for a single-family rental and 5% to 8% for an apartment building are common starting points; use more in a soft market.' },
    { q: 'Does a unit being renovated count as vacant?', a: 'For your own tracking, yes, because it earns no rent. Many owners report it separately as "down" or offline so the vacancy rate reflects leasing performance.' },
    { q: 'How is economic vacancy different from vacancy loss?', a: 'Vacancy loss is rent lost from empty units only. Economic vacancy also includes concessions, bad debt and below-market leases, so it is equal to or larger than vacancy loss.' },
    { q: 'What was the U.S. rental vacancy rate in 2026?', a: '7.6% in the third quarter of 2026, according to the Census Bureau\'s Housing Vacancies and Homeownership survey, up from 7.1% in the third quarter of 2025.' }
  ],
  related: ['rental-property-calculator', 'cap-rate-calculator', 'commercial-rent-calculator', 'utilization-rate-calculator'],
  sources: [
    { name: 'U.S. Census Bureau: Quarterly Residential Vacancies and Homeownership, Third Quarter 2026', url: 'https://www.census.gov/housing/hvs/files/qtr326/Q326press.pdf' },
    { name: 'U.S. Census Bureau: Housing Vacancies and Homeownership definitions', url: 'https://www.census.gov/housing/hvs/definitions.pdf' },
    { name: 'IRS: Publication 527, Residential Rental Property', url: 'https://www.irs.gov/forms-pubs/about-publication-527' }
  ]
};
