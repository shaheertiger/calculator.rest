export default {
  slug: 'rent-increase-calculator',
  hub: 'mortgage',
  name: 'Rent Increase Calculator',
  title: 'Rent Increase Calculator: $1,800 to $1,890 Is a 5% Raise',
  h1: 'Rent Increase Calculator: Percentage, New Rent and Yearly Cost',
  meta: 'Going from $1,800 to $1,890 a month is a 5% rent increase: $90 more a month and $1,080 more a year. Find the percent, or the new rent from a percent.',
  keyword: 'how to calculate rent increase percentage',
  also: ['how to calculate rent increase', 'how do you calculate rent increase', 'rent increase calculator', 'rent increase percentage calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you know?', type: 'select', value: 'pct', options: [['pct', 'Old and new rent (find the %)'], ['new', 'Old rent and % increase (find new rent)']], wide: true },
    { id: 'oldRent', label: 'Current monthly rent', type: 'number', value: 1800, prefix: '$' },
    { id: 'newRent', label: 'New monthly rent', type: 'number', value: 1890, prefix: '$', showIf: { mode: ['pct'] } },
    { id: 'pct', label: 'Increase', type: 'number', value: 5, suffix: '%', showIf: { mode: ['new'] } },
    { id: 'income', label: 'Gross monthly income (optional)', type: 'number', value: '', prefix: '$', placeholder: 'e.g. 6000', help: 'Shows rent as a share of income before and after.' }
  ],
  compute(v, H) {
    if (!(v.oldRent > 0)) return { error: 'Enter the current rent.' };
    var newRent, pct;
    if (v.mode === 'new') {
      if (!(v.pct > -100)) return { error: 'Enter the percentage increase.' };
      pct = v.pct; newRent = v.oldRent * (1 + pct / 100);
    } else {
      if (!(v.newRent > 0)) return { error: 'Enter the new rent.' };
      newRent = v.newRent; pct = (newRent / v.oldRent - 1) * 100;
    }
    var d = newRent - v.oldRent;
    var sg = function (x, f) { return (x < 0 ? '−' : '+') + f(Math.abs(x)); };
    var rows = [
      [v.mode === 'new' ? 'Increase' : 'New rent', v.mode === 'new' ? H.pct(pct, 2) : H.money(newRent)],
      ['Change per month', sg(d, H.money), true],
      ['Change per year', sg(d * 12, H.money), true],
      ['Rent in 5 years at this rate each year', H.money0(v.oldRent * Math.pow(1 + pct / 100, 5))],
      ['Over a 3-year stay, at this rate each year', sg(v.oldRent * 12 * ((1 + pct / 100) + Math.pow(1 + pct / 100, 2) + Math.pow(1 + pct / 100, 3)) - v.oldRent * 36, H.money0)]
    ];
    if (v.income > 0) {
      rows.push(['Rent as share of income', H.pct(v.oldRent / v.income * 100, 1) + ' → ' + H.pct(newRent / v.income * 100, 1)]);
      rows.push(['Income needed at 3× the new rent', H.money0(newRent * 36) + '/yr']);
    }
    return {
      value: v.mode === 'new' ? H.money(newRent) : (pct >= 0 ? '' : '−') + H.pct(Math.abs(pct), 2),
      label: v.mode === 'new' ? 'New monthly rent' : (pct >= 0 ? 'Rent increase' : 'Rent decrease'),
      expr: v.mode === 'new' ? H.money(v.oldRent) + ' × ' + H.num(1 + pct / 100, 4) : '(' + H.money(newRent) + ' − ' + H.money(v.oldRent) + ') ÷ ' + H.money(v.oldRent),
      rows: rows,
      sub: H.round(pct, 4) > 10 ? 'Above 10%: higher than the statewide caps in California, Oregon and Washington allow for covered units. Check whether your home is covered.' : H.round(pct, 4) > 5 ? 'Above 5%: legal in most places, but check state and local caps and the notice required.' : 'Within the range of typical yearly increases.'
    };
  },
  quick: ({ r }) => `To calculate a rent increase percentage, subtract the old rent from the new rent, divide by the old rent and multiply by 100. Going from <strong>$1,800</strong> to <strong>$1,890</strong> is $90 ÷ $1,800 = <strong>${r.value}</strong>, which costs ${r.rows[1][1].replace('+', '')} more a month and ${r.rows[2][1].replace('+', '')} more a year.`,
  stepsTitle: 'How to calculate a rent increase',
  steps: [
    'Subtract the current rent from the new rent: $1,890 − $1,800 = $90.',
    'Divide the difference by the <strong>current</strong> rent, not the new one: $90 ÷ $1,800 = 0.05. Dividing by the new rent is the usual mistake and understates the increase.',
    'Multiply by 100 for the percentage: 5%.',
    'To find a new rent from a percentage instead, multiply the current rent by (1 + percent ÷ 100): $1,800 × 1.05 = $1,890.'
  ],
  formulaTitle: 'What is the rent increase formula?',
  formula: {
    expr: 'Increase % = (new rent − old rent) ÷ old rent × 100<br>New rent = old rent × (1 + increase % ÷ 100)',
    vars: [['old rent', 'current monthly rent'], ['new rent', 'proposed monthly rent'], ['increase %', 'percentage change']],
    note: 'Repeated yearly increases compound: three years of 5% raise rent by 15.8%, not 15%.'
  },
  example: `<p>Your landlord raises rent from $1,800 to $1,890.</p>
<p>Increase = ($1,890 − $1,800) ÷ $1,800 = 90 ÷ 1,800 = 0.05 = <strong>5%</strong>.</p>
<p>Extra cost: $90 a month, <strong>$1,080</strong> a year. If the same 5% repeats every year, rent reaches $2,297 in five years.</p>
<p>Reverse: a 3.5% increase on $1,800 is $1,800 × 1.035 = <strong>$1,863</strong>.</p>`,
  table: {
    title: 'How much is a 3%, 5%, 7% or 10% rent increase?',
    intro: 'Increases on an $1,800 rent, computed by the calculator.',
    head: ['Increase', 'New rent', 'Per month', 'Per year', 'Rent after 5 such years'],
    rows: ({ run }) => [2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map(p => {
      const o = run({ mode: 'new', pct: p, income: NaN });
      return [p + '%', o.value, o.rows[1][1], o.rows[2][1], o.rows[3][1]];
    })
  },
  sections: [
    {
      h2: 'How much can a landlord raise rent in 2026?',
      html: `<p>There is no federal limit, and most states don't cap private rents at all. Where caps exist, they apply for any 12-month period and usually exempt newer buildings:</p>
<ul>
<li><strong>California</strong> (Tenant Protection Act, AB 1482): 5% plus the local CPI change, never more than 10%, for most apartments over 15 years old. Single-family homes owned by individuals are generally exempt if the lease says so.</li>
<li><strong>Oregon</strong> (SB 611, 2023): 7% plus CPI, never more than 10%, for buildings more than 15 years old; landlords must give 90 days' written notice.</li>
<li><strong>Washington</strong> (HB 1217, signed May 7, 2025): 7% plus CPI or 10%, whichever is lower, with 90 days' notice. Many single-family homes and newer buildings are exempt.</li>
<li><strong>Local rent control:</strong> cities such as New York (for rent-stabilized units, set yearly by the Rent Guidelines Board), Los Angeles, San Francisco and St. Paul set their own limits.</li>
</ul>
<p>Even without a cap, the increase can only take effect at lease renewal on a fixed-term lease, and most states require written notice: in California, 30 days for an increase of 10% or less and 90 days above 10%.</p>`
    },
    {
      h2: 'How do rent increases add up over several years?',
      html: `<p>Each increase is calculated on the already-raised rent, so they compound. Starting from $1,800:</p>
<ul>
<li>Three years at 5%: $1,890, then $1,984.50, then $2,083.73, a total rise of 15.8%.</li>
<li>Over that three-year stay you pay $6,699 more than if rent had stayed at $1,800.</li>
<li>Five years at 3%: $2,087, a 15.9% rise, about the same as three years at 5%.</li>
</ul>
<p>To find the average yearly increase over several years, use (new rent ÷ old rent)<sup>1 ÷ years</sup> − 1. Rent that went from $1,500 to $1,890 over four years rose 5.95% a year on average. The <a href="/cagr-calculator">CAGR calculator</a> does the same math for any growth rate.</p>`
    },
    {
      h2: 'Can I negotiate a rent increase?',
      html: `<p>Often, yes, because replacing a tenant costs a landlord a month or more of vacancy plus cleaning, repairs and listing fees. Compare the new rent with similar listings nearby, point to your on-time payment history, and offer something in return: a longer lease, flexible move-out timing or handling small upkeep. Asking for a smaller increase, such as 3% instead of 5%, is a common outcome.</p>
<p>Check whether your new rent still fits your budget with the <a href="/rent-affordability-calculator">3x rent calculator</a>: at $1,890 a landlord applying the 3× rule would want $68,040 a year of income.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate a 3% rent increase?', a: 'Multiply the rent by 1.03. A 3% increase on $1,800 is $54, making the new rent $1,854.' },
    { q: 'Is a 10% rent increase legal?', a: 'In most states, yes, because there is no cap. In California, Oregon and Washington, 10% is the maximum for covered units in a 12-month period, and in rent-controlled cities the limit is usually much lower.' },
    { q: 'How much notice does a landlord have to give for a rent increase?', a: 'It depends on the state, commonly 30 to 90 days in writing. California requires 30 days for increases of 10% or less and 90 days above that; Oregon and Washington require 90 days.' },
    { q: 'Can a landlord raise rent in the middle of a lease?', a: 'Not on a fixed-term lease unless the lease itself allows it. On a month-to-month tenancy, the landlord can raise rent with proper written notice.' },
    { q: 'What is a normal yearly rent increase?', a: 'Increases of about 3% to 5% are common in many markets, and the BLS rent index tracks the national trend. In tight markets renewals can be higher, which is what statewide caps are designed to limit.' },
    { q: 'How do I calculate a rent decrease?', a: 'Use the same formula; the result is negative. Going from $1,800 to $1,710 is ($1,710 − $1,800) ÷ $1,800 = −5%.' }
  ],
  related: ['rent-affordability-calculator', 'commercial-rent-calculator', 'section-8-rent-calculator', 'inflation-calculator', 'raise-calculator'],
  sources: [
    { name: 'California Legislature: AB 1482, Tenant Protection Act of 2019', url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201920200AB1482' },
    { name: 'Oregon Legislature: SB 611 (2023), rent increase limits', url: 'https://olis.oregonlegislature.gov/liz/2023R1/Measures/Overview/SB611' },
    { name: 'Washington Legislature: HB 1217 (2025), rent and fee increase limits', url: 'https://app.leg.wa.gov/billsummary?BillNumber=1217&Year=2025' },
    { name: 'NYC Rent Guidelines Board', url: 'https://www.nyc.gov/site/rentguidelinesboard/index.page' },
    { name: 'BLS: Consumer Price Index', url: 'https://www.bls.gov/cpi/' }
  ]
};
