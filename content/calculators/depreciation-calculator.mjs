export default {
  slug: 'depreciation-calculator',
  hub: 'business',
  name: 'Depreciation Calculator',
  title: 'Depreciation Calculator: $50,000 Equipment = $9,000 a Year',
  h1: 'Depreciation Calculator: Equipment, MACRS and Rental Property Schedules',
  meta: 'A $50,000 machine with a $5,000 salvage value and 5-year life depreciates $9,000 a year straight-line. Get a full schedule: DDB, SYD, MACRS or 27.5-year rental.',
  keyword: 'how do you calculate depreciation on equipment',
  also: ['how do you calculate depreciation of equipment', 'how do i calculate depreciation on equipment', 'how do i calculate depreciation on my rental property', 'how to calculate depreciation tax shield', 'how to calculate depreciation recapture on rental property', 'how to calculate land value of property for depreciation', 'macrs depreciation calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Method', type: 'select', value: 'sl', wide: true, options: [['sl', 'Straight-line (book)'], ['ddb', 'Double-declining balance (book)'], ['syd', 'Sum-of-the-years\' digits (book)'], ['macrs', 'MACRS GDS, half-year (tax: equipment)'], ['res', 'Residential rental property, 27.5 years (tax)'], ['nonres', 'Commercial building, 39 years (tax)']] },
    { id: 'cost', label: 'Cost or depreciable basis', type: 'number', value: 50000, prefix: '$', help: 'Purchase price plus delivery, installation and sales tax. For buildings, leave out the land.' },
    { id: 'salvage', label: 'Salvage value', type: 'number', value: 5000, prefix: '$', showIf: { method: ['sl', 'ddb', 'syd'] }, help: 'What you expect to sell it for at the end of its life.' },
    { id: 'life', label: 'Useful life', type: 'number', value: 5, suffix: 'years', showIf: { method: ['sl', 'ddb', 'syd'] } },
    { id: 'cls', label: 'MACRS property class', type: 'select', value: '5', showIf: { method: ['macrs'] }, options: [['3', '3-year (tractor units, some tools)'], ['5', '5-year (computers, cars, trucks, office machines)'], ['7', '7-year (machinery, office furniture)'], ['10', '10-year (vessels, single-purpose farm structures)'], ['15', '15-year (land improvements, 150% DB)'], ['20', '20-year (farm buildings, 150% DB)']] },
    { id: 'month', label: 'Month placed in service', type: 'select', value: '1', showIf: { method: ['res', 'nonres'] }, options: [['1', 'January'], ['2', 'February'], ['3', 'March'], ['4', 'April'], ['5', 'May'], ['6', 'June'], ['7', 'July'], ['8', 'August'], ['9', 'September'], ['10', 'October'], ['11', 'November'], ['12', 'December']] }
  ],
  data: {
    macrs: {
      '3': [33.33, 44.45, 14.81, 7.41],
      '5': [20.00, 32.00, 19.20, 11.52, 11.52, 5.76],
      '7': [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
      '10': [10.00, 18.00, 14.40, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
      '15': [5.00, 9.50, 8.55, 7.70, 6.93, 6.23, 5.90, 5.90, 5.91, 5.90, 5.91, 5.90, 5.91, 5.90, 5.91, 2.95],
      '20': [3.750, 7.219, 6.677, 6.177, 5.713, 5.285, 4.888, 4.522, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 2.231]
    }
  },
  compute(v, H, D) {
    var m = v.method, cost = v.cost;
    if (!(cost > 0)) return { error: 'Enter the cost or depreciable basis.' };
    var sched = [], expr = '', label = 'First-year depreciation', note = '';
    var bv = cost, y, d;
    if (m === 'sl' || m === 'ddb' || m === 'syd') {
      var salv = v.salvage >= 0 ? v.salvage : 0;
      var life = Math.round(v.life);
      if (!(life >= 1 && life <= 100)) return { error: 'Enter a useful life of 1 to 100 whole years.' };
      if (salv >= cost) return { error: 'Salvage value must be less than the cost.' };
      var base = cost - salv, digits = life * (life + 1) / 2;
      for (y = 1; y <= life; y++) {
        if (m === 'sl') d = base / life;
        else if (m === 'syd') d = base * (life - y + 1) / digits;
        else d = Math.max(bv * 2 / life, (bv - salv) / (life - y + 1));
        if (d > bv - salv || y === life) d = bv - salv;
        bv -= d; sched.push([y, d, cost - bv, bv]);
      }
      if (m === 'sl') { label = 'Annual depreciation (straight-line)'; expr = '(' + H.money0(cost) + ' − ' + H.money0(salv) + ') ÷ ' + life + ' yrs'; }
      else if (m === 'syd') { expr = H.money0(base) + ' × ' + life + '/' + digits; }
      else { expr = H.money0(cost) + ' × ' + H.num(200 / life, 2) + '%'; }
      note = 'Book depreciation over ' + H.plural(life, 'year') + ' down to a ' + H.money0(salv) + ' salvage value.';
    } else if (m === 'macrs') {
      var p = D.macrs[v.cls];
      if (!p) return { error: 'Choose a MACRS property class.' };
      for (y = 0; y < p.length; y++) {
        d = y === p.length - 1 ? bv : cost * p[y] / 100;
        bv -= d; sched.push([y + 1, d, cost - bv, Math.max(0, bv)]);
      }
      expr = H.money0(cost) + ' × ' + H.fix(p[0], 2) + '%';
      label = 'Year-1 MACRS deduction';
      note = v.cls + '-year property recovers over ' + p.length + ' tax years (half-year convention, no salvage value), before any Section 179 or bonus depreciation.';
    } else if (m === 'res' || m === 'nonres') {
      var yrs = m === 'res' ? 27.5 : 39, mo = Number(v.month) || 1;
      var left = yrs * 12, perMonth = cost / left, months = 12.5 - mo;
      for (y = 1; left > 1e-9 && y < 60; y++) {
        var use = Math.min(months, left);
        d = y === 1 || left > use ? perMonth * use : bv;
        if (left - use < 1e-9) d = bv;
        bv -= d; left -= use; months = 12;
        sched.push([y, d, cost - bv, Math.max(0, bv)]);
      }
      expr = H.money0(cost) + ' ÷ ' + yrs + ' × ' + H.num(12.5 - mo, 1) + '/12';
      label = 'First-year depreciation';
      note = 'Straight-line over ' + yrs + ' years with the mid-month convention; full years are ' + H.money(cost / yrs) + ' (' + H.fix(100 / yrs, 3) + '%).';
    } else return { error: 'Choose a depreciation method.' };
    var total = 0; sched.forEach(function (r) { total += r[1]; });
    var rows = [
      ['Depreciation in year 2', sched[1] ? H.money(sched[1][1]) : '—'],
      ['Book value after year 1', H.money(sched[0][3])],
      ['Total depreciation', H.money(total), true],
      ['Years on the schedule', String(sched.length)]
    ];
    return {
      value: H.money(sched[0][1]),
      label: label,
      expr: expr,
      rows: rows,
      sub: note,
      n: sched.map(function (r) { return r[1]; }),
      table: {
        caption: 'Depreciation schedule',
        head: ['Year', 'Depreciation', 'Accumulated', 'Book value'],
        rows: sched.map(function (r) { return [String(r[0]), H.money(r[1]), H.money(r[2]), H.money(r[3])]; })
      }
    };
  },
  quick: ({ r, run }) => `Straight-line depreciation on equipment is (cost − salvage value) ÷ useful life. A <strong>$50,000</strong> machine with a $5,000 salvage value and a 5-year life loses $45,000 ÷ 5 = <strong>${r.value} a year</strong>. Double-declining balance front-loads it to ${run({ method: 'ddb' }).value} in year 1, and the IRS's MACRS 5-year table allows ${run({ method: 'macrs' }).value} (20%) in the first tax year.`,
  stepsTitle: 'How to calculate depreciation on equipment',
  steps: [
    'Find the <strong>cost basis</strong>: the price plus sales tax, freight, installation and testing. This is the step people get wrong; leaving out setup costs understates every year\'s deduction.',
    'Estimate the <strong>salvage value</strong> (resale or scrap value at the end) and the <strong>useful life</strong> in years. For taxes, MACRS replaces both with a fixed recovery period and a zero salvage value.',
    'Pick a method: straight-line spreads the cost evenly, double-declining balance and sum-of-the-years\' digits take more early, and MACRS is what IRS Form 4562 uses for most business equipment.',
    'Read the schedule: each year\'s depreciation, the running total (accumulated depreciation) and the remaining book value. Book value never drops below salvage on the book methods.'
  ],
  formulaTitle: 'What are the depreciation formulas?',
  formula: {
    expr: 'Straight-line = (Cost − Salvage) ÷ Life<br>Double-declining = Book value × (2 ÷ Life)<br>SYD = (Cost − Salvage) × Remaining life ÷ (n(n+1)/2)<br>MACRS = Basis × IRS table %',
    vars: [['Cost', 'depreciable basis: price plus costs to get the asset working'], ['Salvage', 'estimated value at the end of its useful life'], ['Life (n)', 'useful life in years'], ['Book value', 'cost minus depreciation taken so far']],
    note: 'The double-declining option switches to straight-line once that gives the larger amount and stops at salvage value, the same logic as Excel\'s VDB function. MACRS percentages are from IRS Publication 946, Table A-1.'
  },
  example: `<p>A contractor buys a $50,000 skid steer with an expected $5,000 resale value after 5 years.</p>
<p><strong>Straight-line:</strong> ($50,000 − $5,000) ÷ 5 = <strong>$9,000</strong> every year.</p>
<p><strong>Double-declining balance:</strong> the rate is 2 ÷ 5 = 40%. Year 1: $50,000 × 40% = <strong>$20,000</strong>. Year 2: $30,000 × 40% = $12,000. Year 3: $7,200. Year 4: $4,320. Year 5 takes only the $1,480 needed to reach the $5,000 salvage value.</p>
<p><strong>MACRS (tax return):</strong> a skid steer used in construction is 5-year property, and MACRS ignores salvage, so year 1 is $50,000 × 20% = <strong>$10,000</strong>, year 2 is $16,000, and the cost is fully recovered in the sixth tax year.</p>`,
  table: {
    title: 'How do straight-line, declining balance and MACRS compare?',
    intro: 'Year-by-year depreciation on the same $50,000 asset with a $5,000 salvage value and a 5-year life, computed with the calculator above. MACRS recovers the full $50,000 because it ignores salvage value.',
    head: ['Year', 'Straight-line', 'Double-declining', 'Sum-of-years\' digits', 'MACRS 5-year'],
    rows: ({ run, H }) => {
      const m = ['sl', 'ddb', 'syd', 'macrs'].map(x => run({ method: x, cls: '5' }).n);
      const out = [];
      for (let i = 0; i < 6; i++) out.push([String(i + 1), ...m.map(a => a[i] === undefined ? '—' : H.money0(a[i]))]);
      out.push(['Total', ...m.map(a => H.money0(a.reduce((s, x) => s + x, 0)))]);
      return out;
    },
    note: 'Book methods (the first three) are for financial statements. Your tax return uses MACRS unless you elect Section 179 or bonus depreciation, which can deduct the whole cost in year 1.'
  },
  sections: [
    {
      h2: 'How do I calculate depreciation on my rental property?',
      html: `<p>Residential rental buildings are depreciated straight-line over <strong>27.5 years</strong> under the mid-month convention: the property is treated as placed in service in the middle of the month, so the first year gets a partial deduction. Commercial buildings use 39 years.</p>
<p>Example: you buy a rental house for $400,000 and the land is worth $80,000, leaving a $320,000 building basis. A full year of depreciation is $320,000 ÷ 27.5 = <strong>$11,636.36</strong> (3.636%). If the house is ready to rent in June, year 1 covers 6.5 months: $11,636.36 × 6.5 ÷ 12 = <strong>$6,303.03</strong>. Choose the rental method above to see the full 28-year schedule.</p>
<p>Improvements such as a new roof are depreciated separately over 27.5 years from the date they are finished; repairs are deducted in the year you pay for them. Appliances and carpet in a rental are 5-year property.</p>`
    },
    {
      h2: 'How do you calculate the land value of a property for depreciation?',
      html: `<p>Land never wears out, so it is never depreciated. Split the purchase price between land and building in proportion to their fair market values at purchase. If you don't have an appraisal, IRS Publication 527 allows using the ratio from your property tax assessment.</p>
<p>Example: the county assesses land at $60,000 and the building at $240,000, so the building is 80% of the assessed total. On a $400,000 purchase, the depreciable building basis is $400,000 × 80% = $320,000. Settlement costs such as title insurance and recording fees are added to basis and split the same way.</p>`
    },
    {
      h2: 'What is depreciation recapture on rental property and equipment?',
      html: `<p>When you sell, depreciation you took (or were allowed to take) lowers your basis, which raises your taxable gain. For equipment (Section 1245 property), the gain up to the depreciation taken is taxed as ordinary income. For a rental building (Section 1250 property), that part of the gain is "unrecaptured Section 1250 gain", taxed at a maximum 25% rate.</p>
<p>Example: a rental bought for a $320,000 building basis has $80,000 of accumulated depreciation, so the adjusted basis is $240,000. Selling the building portion for $350,000 produces a $110,000 gain, of which $80,000 is taxed at up to 25% and the remaining $30,000 at capital gains rates. Use the <a href="/capital-gains-tax-calculator">capital gains tax calculator</a> for the rest of the sale.</p>`
    },
    {
      h2: 'How do you calculate the depreciation tax shield?',
      html: `<p>Depreciation is a non-cash expense, so its value is the tax it saves: <strong>tax shield = depreciation × tax rate</strong>. At the 21% federal corporate rate, $9,000 of straight-line depreciation saves $9,000 × 21% = $1,890 a year. A sole proprietor in the 24% bracket saves $2,160 in income tax, plus self-employment tax on Schedule C income.</p>
<p>Accelerated methods don't increase the total shield, but they move it earlier, which is worth more in present-value terms. That is why most businesses take MACRS or bonus depreciation on their tax return even when their books use straight-line.</p>`
    },
    {
      h2: 'Should you use Section 179 or bonus depreciation in 2026?',
      html: `<p>Both let you write off equipment faster than MACRS. For tax years beginning in 2026, the Section 179 limit is <strong>$2,560,000</strong>, reduced dollar for dollar once qualifying purchases exceed $4,090,000 (IRS Publication 946). Section 179 can't create a loss: it is capped at your business taxable income.</p>
<p>The One Big Beautiful Bill Act restored <strong>100% bonus depreciation</strong> for qualified property acquired and placed in service after January 19, 2025. Bonus depreciation has no dollar cap and can create a loss. Buildings don't qualify for either (except certain improvements), so rentals stay on the 27.5-year schedule.</p>`
    }
  ],
  faq: [
    { q: 'How much does equipment depreciate per year?', a: 'Under straight-line, the same amount every year: (cost − salvage) ÷ life. A $50,000 machine with $5,000 salvage over 5 years depreciates $9,000 a year, or 18% of cost. Double-declining balance on a 5-year life takes 40% of cost in year 1.' },
    { q: 'What is the useful life of equipment for tax purposes?', a: 'MACRS assigns recovery periods: computers, office machines, cars and light trucks are 5-year property; office furniture and many kinds of manufacturing machinery are 7-year property. IRS Publication 946, Appendix B lists the class life for each asset type.' },
    { q: 'Does MACRS use salvage value?', a: 'No. MACRS depreciates the full basis down to zero. Salvage value only matters for book depreciation on your financial statements.' },
    { q: 'What is the half-year convention?', a: 'MACRS treats all equipment as placed in service halfway through the year, so year 1 gets half a year of depreciation and an extra year is added at the end. If more than 40% of the year\'s purchases were placed in service in the last three months, the mid-quarter convention applies instead.' },
    { q: 'Can I depreciate land?', a: 'No. Land doesn\'t wear out or become obsolete, so only the building and land improvements such as fences, driveways and landscaping (15-year property) are depreciable.' },
    { q: 'How do I calculate depreciation in Excel?', a: 'Use =SLN(cost, salvage, life) for straight-line, =DDB(cost, salvage, life, year) for double-declining balance and =SYD(cost, salvage, life, year) for sum-of-the-years\' digits. =VDB adds the switch to straight-line that this calculator uses.' },
    { q: 'How do I calculate car depreciation?', a: 'For a business vehicle, cars are 5-year MACRS property subject to annual luxury auto limits. For what a personal car loses in market value, use the car depreciation calculator, which models resale value by age.' }
  ],
  related: ['car-depreciation-calculator', 'rental-property-calculator', 'capital-gains-tax-calculator', 'payback-period-calculator'],
  sources: [
    { name: 'IRS Publication 946: How To Depreciate Property', url: 'https://www.irs.gov/publications/p946' },
    { name: 'IRS Publication 527: Residential Rental Property', url: 'https://www.irs.gov/publications/p527' },
    { name: 'IRS: About Form 4562, Depreciation and Amortization', url: 'https://www.irs.gov/forms-pubs/about-form-4562' },
    { name: 'IRS Tax Topic 704: Depreciation', url: 'https://www.irs.gov/taxtopics/tc704' }
  ],
  disclaimer: 'Educational estimate, not tax advice. Listed property, luxury auto limits and state conformity rules can change the result.'
};
