export default {
  slug: 'rent-or-sell-house-calculator',
  hub: 'mortgage',
  name: 'Rent or Sell My House Calculator',
  title: 'Rent or Sell My House Calculator: 5-Year Wealth Comparison',
  h1: 'Should I Rent Out My House or Sell It? Compare Both Paths',
  meta: 'Compare selling now and investing the cash with renting your home out for 5 years, then selling. Example: renting a $400,000 house comes out $63,993 ahead.',
  keyword: 'should i rent or sell my house calculator',
  also: ['should i sell or rent my house calculator', 'should i rent or sell my home calculator', 'should i rent my house or sell it calculator', 'should i sell my house or rent it out calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'value', label: 'Home value today', type: 'number', value: 400000, prefix: '$' },
    { id: 'balance', label: 'Mortgage balance', type: 'number', value: 220000, prefix: '$' },
    { id: 'rate', label: 'Mortgage rate', type: 'number', value: 3.5, suffix: '%' },
    { id: 'yearsLeft', label: 'Years left on mortgage', type: 'number', value: 24, suffix: 'years' },
    { id: 'rent', label: 'Monthly rent you could charge', type: 'number', value: 2600, prefix: '$' },
    { id: 'vacancy', label: 'Vacancy', type: 'number', value: 5, suffix: '% of rent' },
    { id: 'mgmt', label: 'Property management', type: 'number', value: 8, suffix: '% of rent', help: 'Use 0 if you will manage it yourself.' },
    { id: 'tax', label: 'Property tax', type: 'number', value: 4400, prefix: '$', suffix: '/ yr' },
    { id: 'ins', label: 'Landlord insurance', type: 'number', value: 2000, prefix: '$', suffix: '/ yr' },
    { id: 'maint', label: 'Maintenance and repairs', type: 'number', value: 1, suffix: '% of value / yr' },
    { id: 'hoa', label: 'HOA dues', type: 'number', value: 0, prefix: '$', suffix: '/ mo' },
    { id: 'appr', label: 'Home price growth', type: 'number', value: 3, suffix: '% / yr' },
    { id: 'rentGrowth', label: 'Rent growth', type: 'number', value: 3, suffix: '% / yr' },
    { id: 'sellCost', label: 'Selling costs', type: 'number', value: 7, suffix: '% of price', help: 'Agent commissions plus seller closing costs.' },
    { id: 'ret', label: 'Return if you invest the sale cash', type: 'number', value: 6, suffix: '% / yr' },
    { id: 'years', label: 'Years you would rent it out', type: 'number', value: 5, suffix: 'years' }
  ],
  compute(v, H) {
    if (!(v.value > 0)) return { error: 'Enter the home value.' };
    if (!(v.years >= 1 && v.years <= 30)) return { error: 'Enter how many years you would rent it out (1 to 30).' };
    var N = Math.round(v.years);
    var bal = v.balance > 0 ? v.balance : 0;
    var p = function (x) { return x > 0 ? x / 100 : 0; };
    var sc = p(v.sellCost), i = v.ret > -100 ? (v.ret || 0) / 100 : 0, a = (v.appr || 0) / 100, g = (v.rentGrowth || 0) / 100;
    var r = (v.rate > 0 ? v.rate : 0) / 1200, nLeft = v.yearsLeft > 0 ? Math.round(v.yearsLeft * 12) : 0;
    var pi = bal > 0 && nLeft > 0 ? H.pmt(r, nLeft, bal) : 0;
    var sellNow = v.value * (1 - sc) - bal;
    var sellPath = sellNow * Math.pow(1 + i, N);
    var b = bal, fvCF = 0, tbl = [], cf1 = 0, totCF = 0;
    for (var y = 1; y <= N; y++) {
      var rentY = (v.rent > 0 ? v.rent : 0) * Math.pow(1 + g, y - 1) * 12;
      var coll = rentY * (1 - p(v.vacancy));
      var valY = v.value * Math.pow(1 + a, y - 1);
      var costs = coll * p(v.mgmt) + valY * p(v.maint) + ((v.tax > 0 ? v.tax : 0) + (v.ins > 0 ? v.ins : 0)) * Math.pow(1 + a, y - 1) + (v.hoa > 0 ? v.hoa : 0) * 12;
      var debt = 0;
      for (var m = 0; m < 12; m++) { if (b > 0.005) { var it = b * r, pay = Math.min(pi, b + it); b = b + it - pay; debt += pay; } }
      var cf = coll - costs - debt;
      if (y === 1) cf1 = cf;
      totCF += cf;
      fvCF = fvCF * (1 + i) + cf;
      var endVal = v.value * Math.pow(1 + a, y);
      tbl.push(['Year ' + y, H.money0(cf), H.money0(endVal), H.money0(Math.max(0, b)), H.money0(endVal * (1 - sc) - Math.max(0, b) + fvCF)]);
    }
    var valN = v.value * Math.pow(1 + a, N);
    var saleLater = valN * (1 - sc) - Math.max(0, b);
    var rentPath = saleLater + fvCF;
    var diff = rentPath - sellPath;
    var rows = [
      ['Renting path after ' + N + ' yrs', H.money0(rentPath), diff >= 0],
      ['Selling path after ' + N + ' yrs', H.money0(sellPath), diff < 0],
      ['Net proceeds if you sell now', H.money0(sellNow)],
      ['Cash flow in year 1', H.money0(cf1) + ' (' + H.money0(cf1 / 12) + '/mo)'],
      ['Total rental cash flow', H.money0(totCF)],
      ['Home value in ' + N + ' yrs', H.money0(valN)],
      ['Mortgage balance in ' + N + ' yrs', H.money0(Math.max(0, b))],
      ['Net from selling in ' + N + ' yrs', H.money0(saleLater)]
    ];
    return {
      value: H.money0(Math.abs(diff)),
      label: diff >= 0 ? 'Renting it out comes out ahead by' : 'Selling now comes out ahead by',
      expr: H.money0(rentPath) + ' vs ' + H.money0(sellPath) + ' after ' + N + ' yrs',
      rows: rows,
      sub: (cf1 < 0 ? 'Year-1 cash flow is negative, so you would be paying ' + H.money0(-cf1 / 12) + ' a month to hold the house. ' : '') + 'Before income tax, depreciation and any capital gains tax; see the tax section below.',
      table: { caption: 'Renting path, year by year', head: ['Year', 'Cash flow', 'Home value', 'Loan balance', 'Wealth if sold'], rows: tbl }
    };
  },
  quick: ({ r }) => `For a <strong>$400,000</strong> house with a $220,000 mortgage at 3.5%, renting it for $2,600 a month for 5 years and then selling leaves about <strong>${r.rows[0][1]}</strong>, versus ${r.rows[1][1]} if you sell now (${r.rows[2][1]} net) and invest at 6%. Renting comes out <strong>${r.value}</strong> ahead, mostly from 3% appreciation and mortgage paydown, before taxes.`,
  stepsTitle: 'How to decide whether to rent or sell your house',
  steps: [
    'Enter today\'s realistic sale value and your mortgage balance, rate and years left. A low pandemic-era rate is often the main reason renting wins.',
    'Enter the rent comparable homes actually lease for, not the asking price on listings. Then set vacancy (5% is about two and a half weeks a year) and management (8–10% if you hire a manager).',
    'Add the landlord costs: property tax, a landlord insurance policy, maintenance at about 1% of value per year, and HOA dues. Forgetting maintenance is the most common error and makes renting look far better than it is.',
    'Set price growth, rent growth, selling costs and what the sale cash would earn invested. Compare both paths at the number of years you would actually be a landlord.'
  ],
  formulaTitle: 'How does the rent-or-sell comparison work?',
  formula: {
    expr: 'Sell now = (value × (1 − selling %) − mortgage) × (1 + return)<sup>N</sup><br>Rent then sell = value<sub>N</sub> × (1 − selling %) − balance<sub>N</sub> + Σ yearly cash flow, grown at the return rate',
    vars: [['Cash flow', 'rent × (1 − vacancy) − management − maintenance − tax − insurance − HOA − mortgage payments'], ['value<sub>N</sub>', 'value × (1 + growth)<sup>N</sup>'], ['balance<sub>N</sub>', 'mortgage balance after N more years of payments'], ['return', 'what the money would earn if invested instead']],
    note: 'Both paths pay selling costs once: now, or at the end. Tax, depreciation and capital gains are not included because they depend on your bracket and how long you lived in the home.'
  },
  example: `<p>Sell now: $400,000 × 0.93 − $220,000 = <strong>$152,000</strong>. Invested at 6% for 5 years: $152,000 × 1.3382 = <strong>$203,410</strong>.</p>
<p>Rent: year-1 rent collected is $2,600 × 12 × 0.95 = $29,640. Costs are $2,371 management, $4,000 maintenance, $4,400 tax and $2,000 insurance, and the mortgage payment of $1,130.17 a month is $13,562 a year, leaving <strong>$3,307</strong> of cash flow in year 1.</p>
<p>After 5 years the home is worth $463,710, the loan is down to $188,020, and selling nets $243,230. Add the cash flow, $21,749 collected and $24,173 once grown at 6%, and the rent path ends at <strong>$267,403</strong>, $63,993 ahead.</p>`,
  table: {
    title: 'Does renting win if I only keep the house a few years?',
    intro: 'The default example re-run for different holding periods. Selling costs are paid either way, so short holds lean toward selling now only when cash flow is weak.',
    head: ['Years renting', 'Rent, then sell', 'Sell now and invest', 'Difference'],
    rows: ({ run }) => [1, 2, 3, 5, 7, 10, 15].map(y => {
      const o = run({ years: y });
      return [String(y), o.rows[0][1], o.rows[1][1], (o.label.indexOf('Renting') === 0 ? 'Rent +' : 'Sell +') + o.value];
    }),
    note: 'Assumes 3% yearly price and rent growth and a 6% return on invested cash. Set price growth to 0% to see how much of the advantage depends on appreciation.'
  },
  sections: [
    {
      h2: 'Should I rent out my house or sell it?',
      html: `<p>Renting tends to win when three things line up: a mortgage rate well below today's (so the payment is cheap to carry), rent that covers every cost with something left over, and a market where you expect prices to keep rising. Selling tends to win when the house barely breaks even as a rental, you need the equity for your next down payment, or you don't want a landlord's workload.</p>
<p>A useful sanity check is the rent-to-value ratio. $2,600 on a $400,000 house is 0.65% a month, below the 1% investors often look for, so the example depends on appreciation and paydown rather than cash flow. Re-run it with price growth at 0% and the advantage shrinks from $63,993 to just $8,154, a thin reward for five years of landlord risk.</p>`
    },
    {
      h2: 'How long can I rent my house and still avoid capital gains tax?',
      html: `<p>Up to about three years. The home-sale exclusion lets you exclude up to <strong>$250,000</strong> of gain ($500,000 for a married couple filing jointly) if you owned the home and lived in it as your main home for at least 2 of the 5 years before the sale. Move out, rent it for up to 3 years, and you can still qualify; wait longer and the exclusion is gone.</p>
<p>Two catches. Depreciation you claimed (or were allowed to claim) while renting is not excluded and is taxed as unrecaptured section 1250 gain at up to 25%. And rental income is taxable each year on Schedule E, though depreciation of the building over 27.5 years usually shelters much of it. IRS Publications 523 and 527 cover the rules.</p>`
    },
    {
      h2: 'What does it really cost to be a landlord?',
      html: `<ul>
<li><strong>Vacancy and turnover:</strong> a month empty plus cleaning, paint and listing every couple of years is roughly 5–8% of rent.</li>
<li><strong>Management:</strong> commonly 8–10% of collected rent, plus a leasing fee for each new tenant. Self-managing saves it but costs your time.</li>
<li><strong>Maintenance and big repairs:</strong> 1% of value per year is a floor for an older home; a roof or HVAC replacement can take several years of cash flow at once.</li>
<li><strong>Insurance:</strong> you need a landlord (dwelling) policy instead of a homeowners policy, and it usually costs more. Tell your lender and insurer the home is now a rental.</li>
<li><strong>Your mortgage terms:</strong> most owner-occupied mortgages require you to live in the home for at least a year after closing. After that, renting is generally allowed, but read your loan documents.</li>
</ul>
<p>The <a href="/rental-property-calculator">rental property cash flow calculator</a> breaks these costs out with cap rate and cash-on-cash return, and the <a href="/home-sale-proceeds-calculator">cost to sell a house calculator</a> itemizes what you would pay to sell.</p>`
    }
  ],
  faq: [
    { q: 'Is it better to sell my house or rent it out?', a: 'It depends on your numbers. In the default example renting comes out ahead after 5 years because of a 3.5% mortgage and 3% appreciation, but with flat prices the edge falls to about $8,000, which may not justify the work. Run your own rent and costs above.' },
    { q: 'Should I keep my house if I have a 3% mortgage?', a: 'A low rate makes renting much more attractive, because a small payment lets rent cover costs and each payment pays down more principal. It is still only worth it if you are willing to be a landlord and the cash flow is positive.' },
    { q: 'Can I rent out my house if I still have a mortgage?', a: 'Usually yes, once you have met the occupancy requirement in your loan, typically 12 months of living in the home. Notify your lender and switch to a landlord insurance policy.' },
    { q: 'Do I pay capital gains tax if I rent out my house and then sell?', a: 'Not on gains up to $250,000 ($500,000 married filing jointly) if you lived in it for 2 of the 5 years before selling. You still owe tax on depreciation recapture at up to 25%.' },
    { q: 'How much cash flow should a rental make?', a: 'Many landlords want at least $100 to $300 a month per unit after all costs including maintenance and vacancy. Less than that leaves no cushion for a major repair.' },
    { q: 'What happens to my next home purchase if I keep this one?', a: 'Lenders count the existing mortgage payment as debt. They may offset it with 75% of the documented rent, but you will need a separate down payment, which is often why people sell.' }
  ],
  related: ['rental-property-calculator', 'home-sale-proceeds-calculator', 'cap-rate-calculator', 'capital-gains-tax-calculator', 'mortgage-payoff-calculator'],
  sources: [
    { name: 'IRS: Publication 523, Selling Your Home', url: 'https://www.irs.gov/forms-pubs/about-publication-523' },
    { name: 'IRS: Publication 527, Residential Rental Property', url: 'https://www.irs.gov/forms-pubs/about-publication-527' },
    { name: 'IRS: Topic 701, Sale of your home', url: 'https://www.irs.gov/taxtopics/tc701' },
    { name: 'FHFA: House Price Index', url: 'https://www.fhfa.gov/data/hpi' }
  ],
  disclaimer: 'Pre-tax planning estimate; not tax or investment advice.'
};
