export default {
  slug: 'cap-rate-calculator',
  hub: 'mortgage',
  name: 'Commercial Property Value Calculator',
  title: 'Commercial Property Value Calculator: $111K NOI at 7% = $1.59M',
  h1: 'Cap Rate Calculator: Value a Commercial or Multifamily Property From Its Income',
  meta: 'A building netting $111,000 a year is worth about $1,585,714 at a 7% cap rate and $1,480,000 at 7.5%. Solve for value from NOI, or for cap rate from price.',
  keyword: 'how to value commercial property calculator',
  also: ['how to calculate the value of a multifamily property', 'how to calculate value of multi family property', 'how to calculate the value of a commercial building', 'how to calculate commercial property value', 'cap rate calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you want to find?', type: 'select', value: 'value', options: [['value', 'Property value (from cap rate)'], ['rate', 'Cap rate (from price)']], wide: true },
    { id: 'gross', label: 'Gross annual rent (fully leased)', type: 'number', value: 180000, prefix: '$' },
    { id: 'vacancy', label: 'Vacancy and credit loss', type: 'number', value: 5, suffix: '%' },
    { id: 'otherInc', label: 'Other income (parking, laundry, reimbursements)', type: 'number', value: 0, prefix: '$', suffix: '/ yr' },
    { id: 'opex', label: 'Operating expenses (no mortgage)', type: 'number', value: 60000, prefix: '$', suffix: '/ yr' },
    { id: 'cap', label: 'Market cap rate', type: 'number', value: 7, suffix: '%', showIf: { mode: ['value'] } },
    { id: 'price', label: 'Asking or purchase price', type: 'number', value: 1500000, prefix: '$', showIf: { mode: ['rate'] } },
    { id: 'sqft', label: 'Building size (optional)', type: 'number', value: 12000, suffix: 'sq ft' }
  ],
  compute(v, H) {
    var z = function (x) { return x > 0 ? x : 0; };
    if (!(v.gross > 0)) return { error: 'Enter the gross annual rent.' };
    var egi = v.gross * (1 - Math.min(100, z(v.vacancy)) / 100) + z(v.otherInc);
    var noi = egi - z(v.opex);
    if (!(noi > 0)) return { error: 'Operating expenses are higher than income, so NOI is not positive and the income approach gives no value.' };
    var value, cap, rows;
    if (v.mode === 'rate') {
      if (!(v.price > 0)) return { error: 'Enter the price.' };
      value = v.price; cap = noi / v.price * 100;
    } else {
      if (!(v.cap > 0)) return { error: 'Enter a cap rate above 0%.' };
      cap = v.cap; value = noi / (v.cap / 100);
    }
    rows = [
      [v.mode === 'rate' ? 'Price' : 'Cap rate used', v.mode === 'rate' ? H.money0(value) : H.pct(cap, 2)],
      ['Net operating income (NOI)', H.money0(noi), true],
      ['Effective gross income', H.money0(egi)],
      ['Expense ratio', H.pct(z(v.opex) / egi * 100, 1)],
      ['Gross rent multiplier (GRM)', H.fix(value / v.gross, 2)],
      ['Value at cap rate − 0.5 pt', cap > 0.5 ? H.money0(noi / ((cap - 0.5) / 100)) : '—'],
      ['Value at cap rate + 0.5 pt', H.money0(noi / ((cap + 0.5) / 100))]
    ];
    if (v.sqft > 0) rows.push(['Value per square foot', H.money(value / v.sqft)]);
    return {
      value: v.mode === 'rate' ? H.pct(cap, 2) : H.money0(value),
      label: v.mode === 'rate' ? 'Cap rate at this price' : 'Estimated property value',
      expr: v.mode === 'rate' ? H.money0(noi) + ' ÷ ' + H.money0(value) : H.money0(noi) + ' ÷ ' + H.num(cap, 3) + '%',
      rows: rows,
      sub: 'A half-point change in cap rate moves the value by about ' + H.pct(0.5 / cap * 100, 0) + ', which is why the cap rate you choose matters as much as the income.'
    };
  },
  quick: ({ r }) => `To value commercial property, divide its net operating income by the market cap rate. A building with <strong>$180,000</strong> of gross rent, 5% vacancy and $60,000 of operating expenses nets $111,000 a year; at a <strong>7% cap rate</strong> it is worth $111,000 ÷ 0.07 = <strong>${r.value}</strong>, about ${r.rows[7][1]} per square foot on 12,000 sq ft.`,
  stepsTitle: 'How to value a commercial property with the income approach',
  steps: [
    'Total the rent the building would collect fully leased, from the rent roll or market rents, and subtract a vacancy and credit-loss allowance.',
    'Add other income such as parking, laundry, storage or expense reimbursements from tenants on net leases.',
    'Subtract operating expenses: property tax, insurance, utilities paid by the owner, repairs, management, and a reserve for replacements. Do <strong>not</strong> subtract mortgage payments or depreciation; including the loan payment is the most common error and makes the value far too low.',
    'Divide the resulting NOI by a cap rate taken from recent sales of similar properties. To check an asking price instead, switch the mode and the tool divides NOI by the price.'
  ],
  formulaTitle: 'What is the cap rate formula?',
  formula: {
    expr: 'NOI = gross rent × (1 − vacancy) + other income − operating expenses<br>Value = NOI ÷ cap rate<br>Cap rate = NOI ÷ price',
    vars: [['NOI', 'net operating income for a year, before debt service and income tax'], ['cap rate', 'capitalization rate as a decimal (7% = 0.07)'], ['GRM', 'gross rent multiplier = price ÷ gross annual rent']],
    note: 'This is direct capitalization, one of the three appraisal approaches along with sales comparison and cost. It assumes a stable, single year of income; properties in lease-up or with big rent changes ahead are valued with a discounted cash flow instead.'
  },
  example: `<p>Gross rent $180,000, less 5% vacancy = <strong>$171,000</strong>. Operating expenses $60,000. NOI = <strong>$111,000</strong>.</p>
<p>Value at 7%: $111,000 ÷ 0.07 = <strong>$1,585,714</strong>. At 6.5% it would be $1,707,692; at 7.5%, $1,480,000.</p>
<p>Checking an asking price of $1,500,000 instead: cap rate = $111,000 ÷ $1,500,000 = <strong>7.40%</strong>. If similar buildings trade at 7%, the asking price is below market.</p>`,
  table: {
    title: 'What is a building with $111,000 of NOI worth at different cap rates?',
    intro: 'The same income capitalized at a range of cap rates, computed by the calculator.',
    head: ['Cap rate', 'Value', 'Per sq ft (12,000 sq ft)', 'GRM'],
    rows: ({ run }) => [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10].map(c => {
      const o = run({ mode: 'value', cap: c });
      return [c.toFixed(1) + '%', o.value, o.rows[7][1], o.rows[4][1]];
    }),
    note: 'Going from a 5% to a 7% cap rate lowers the value by 29% with no change in income.'
  },
  sections: [
    {
      h2: 'What cap rate should I use to value a property?',
      html: `<p>Use the cap rates from recent sales of comparable properties in the same market: each sale's NOI divided by its price. Brokers, appraisers and commercial research firms publish surveys by property type and city, and they move with interest rates. Cap rates are lower (values higher) for properties seen as safer: strong locations, creditworthy tenants on long leases, newer buildings and apartment buildings in growing metros. They are higher for older buildings, short or weak leases, small towns and riskier property types.</p>
<p>Federal bank examiners point out that rising interest rates can push capitalization rates up and values down even when a building's income holds steady, which is why lenders stress-test values at higher cap rates. If you can't find comparable sales, a cap rate somewhat above your borrowing cost is a conservative floor.</p>`
    },
    {
      h2: 'How do you calculate the value of a multifamily property?',
      html: `<p>The same way: NOI ÷ cap rate. A 12-unit building renting at $1,250 a month per unit has $180,000 of gross rent. With 5% vacancy and $60,000 of expenses, NOI is $111,000 and the value at 7% is about $1,585,714, or roughly <strong>$132,143 per unit</strong>.</p>
<p>Two quick cross-checks investors use: the <strong>gross rent multiplier</strong> (price ÷ gross rent, 8.81 here) and <strong>price per unit</strong> compared with recent sales. Five or more units are financed as commercial loans, where lenders size the loan on NOI and a minimum debt service coverage ratio. For one to four units, the <a href="/rental-property-calculator">rental property cash flow calculator</a> adds the mortgage and cash-on-cash return.</p>`
    },
    {
      h2: 'What is included in net operating income?',
      html: `<p><strong>Included:</strong> all rent and other property income, minus vacancy, property taxes, insurance, owner-paid utilities, repairs and maintenance, management (even if you self-manage, appraisers charge a market fee), landscaping, snow removal, and usually a replacement reserve.</p>
<p><strong>Excluded:</strong> mortgage principal and interest, depreciation, the owner's income taxes, and one-time capital improvements. Under a triple-net lease the tenant reimburses taxes, insurance and common-area costs, so those reimbursements appear as income and the matching costs as expenses; the <a href="/commercial-rent-calculator">commercial rent calculator</a> shows how NNN charges are billed. Ask sellers for trailing-12-month statements rather than a pro forma, which often leaves out vacancy and management.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate cap rate?', a: 'Divide net operating income by the property price and multiply by 100. $111,000 of NOI on a $1,500,000 price is a 7.4% cap rate.' },
    { q: 'How much is a building worth that makes $100,000 a year?', a: 'If $100,000 is the net operating income, it is worth about $1,428,571 at a 7% cap rate, $1,250,000 at 8% and $1,666,667 at 6%. If $100,000 is gross rent, subtract vacancy and expenses first.' },
    { q: 'Is a higher cap rate better?', a: 'For a buyer, a higher cap rate means more income per dollar paid, but usually more risk. For a seller, a lower cap rate means a higher price. Neither is better by itself; it should match the property\'s risk.' },
    { q: 'What is the difference between cap rate and cash-on-cash return?', a: 'Cap rate ignores financing: it is NOI ÷ price. Cash-on-cash return is cash flow after the mortgage ÷ the cash you invested, so it changes with your loan terms and down payment.' },
    { q: 'What is a gross rent multiplier?', a: 'Price divided by gross annual rent. It is a quick screen that ignores expenses; a $1,585,714 building with $180,000 of gross rent has a GRM of 8.81.' },
    { q: 'How do interest rates affect commercial property values?', a: 'When borrowing costs rise, buyers demand higher cap rates, so the same NOI supports a lower price. A move from 6% to 7% on $111,000 of NOI cuts the value from $1,850,000 to $1,585,714.' }
  ],
  related: ['rental-property-calculator', 'commercial-rent-calculator', 'vacancy-rate-calculator', 'business-valuation-calculator', 'roi-calculator'],
  sources: [
    { name: 'OCC Comptroller\'s Handbook: Commercial Real Estate Lending (Version 2.0)', url: 'https://www.occ.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate.pdf' },
    { name: 'IRS: Publication 946, How to Depreciate Property', url: 'https://www.irs.gov/forms-pubs/about-publication-946' },
    { name: 'IRS: Publication 527, Residential Rental Property', url: 'https://www.irs.gov/forms-pubs/about-publication-527' }
  ]
};
