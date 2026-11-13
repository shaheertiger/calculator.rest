export default {
  slug: 'tam-sam-som-calculator',
  hub: 'business',
  name: 'TAM SAM SOM Calculator',
  title: 'TAM SAM SOM Calculator: $600M Market Gives a $9M SOM',
  h1: 'TAM, SAM and SOM Calculator for Market Sizing',
  meta: 'A $600 million market with a 30% serviceable share and 5% capture gives a $9 million SOM. Size your market top-down or bottom-up for a pitch deck or plan.',
  keyword: 'how to calculate tam sam som',
  also: ['tam sam som calculator', 'how to calculate market potential'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Start from', type: 'select', value: 'topdown', options: [['topdown', 'Total market spend (top-down)'], ['bottomup', 'Customers × price (bottom-up)']] },
    { id: 'market', label: 'Total market spend per year', type: 'number', value: 600000000, prefix: '$', help: 'From an industry report, census data or analyst estimate.', showIf: { method: ['topdown'] } },
    { id: 'customers', label: 'Potential customers', type: 'number', value: 500000, help: 'Every buyer who could ever need this, before any filtering.', showIf: { method: ['bottomup'] } },
    { id: 'arpu', label: 'Annual revenue per customer', type: 'number', value: 1200, prefix: '$', help: 'Your price × purchases per year. Used to turn SOM into a customer count.' },
    { id: 'samPct', label: 'Share you can serve (SAM)', type: 'number', value: 30, suffix: '% of TAM', help: 'The part your product, region and channels can actually reach.' },
    { id: 'somPct', label: 'Share you can win (SOM)', type: 'number', value: 5, suffix: '% of SAM', help: 'Realistic capture in 3–5 years given competitors.' }
  ],
  compute(v, H) {
    var tam;
    if (v.method === 'bottomup') {
      if (!(v.customers > 0)) return { error: 'Enter the number of potential customers.' };
      if (!(v.arpu > 0)) return { error: 'Enter annual revenue per customer.' };
      tam = v.customers * v.arpu;
    } else {
      if (!(v.market > 0)) return { error: 'Enter the total market size in dollars.' };
      tam = v.market;
    }
    if (!(v.samPct > 0 && v.samPct <= 100)) return { error: 'SAM share must be between 0% and 100%.' };
    if (!(v.somPct > 0 && v.somPct <= 100)) return { error: 'SOM share must be between 0% and 100%.' };
    function short(x) {
      if (x >= 1e9) return '$' + H.num(x / 1e9, 2) + 'B';
      if (x >= 1e6) return '$' + H.num(x / 1e6, 2) + 'M';
      if (x >= 1e3) return '$' + H.num(x / 1e3, 1) + 'K';
      return H.money0(x);
    }
    var sam = tam * v.samPct / 100;
    var som = sam * v.somPct / 100;
    var somOfTam = som / tam * 100;
    var rows = [
      ['TAM (total addressable market)', H.money0(tam)],
      ['SAM (serviceable available market)', H.money0(sam)],
      ['SOM (serviceable obtainable market)', H.money0(som), true],
      ['SOM as a share of TAM', H.pct(somOfTam, 2)]
    ];
    if (v.arpu > 0) {
      rows.push(['Customers in TAM', H.int(tam / v.arpu)]);
      rows.push(['Customers needed to reach SOM', H.int(som / v.arpu), true]);
    }
    return {
      value: short(som),
      label: 'Serviceable obtainable market (SOM)',
      expr: short(tam) + ' × ' + H.num(v.samPct, 2) + '% × ' + H.num(v.somPct, 2) + '%',
      rows: rows,
      sub: somOfTam > 10 ? 'Capturing more than 10% of the whole market is an aggressive claim; investors will ask how.' : 'A SOM of ' + H.pct(somOfTam, 2) + ' of the total market is a believable starting target for most new entrants.'
    };
  },
  quick: ({ r }) => `TAM is the whole market's annual spend, SAM is the slice your product and reach can serve, and SOM is the share of SAM you can realistically win. A <strong>$600 million</strong> TAM × 30% serviceable = $180 million SAM; 5% of that is a <strong>${r.value} SOM</strong>, or 7,500 customers paying $1,200 a year.`,
  stepsTitle: 'How to calculate TAM, SAM and SOM',
  steps: [
    'Find <strong>TAM</strong>. Top-down: take the total annual spend from an industry report or government data. Bottom-up: multiply every potential customer by what each would pay you per year.',
    'Cut TAM to <strong>SAM</strong> by the share you can actually serve: your geography, customer size, language, channels and product scope. This is the step founders most often skip, which inflates everything after it.',
    'Cut SAM to <strong>SOM</strong> using a share you can defend in three to five years, based on competitors, sales capacity and what comparable companies achieved.',
    'Divide SOM by annual revenue per customer to see how many customers that is. If the number looks impossible for your sales team, lower the SOM share.'
  ],
  formulaTitle: 'What is the formula for TAM, SAM and SOM?',
  formula: {
    expr: 'TAM = total market spend<br>&nbsp;&nbsp;or TAM = potential customers × annual revenue per customer<br>SAM = TAM × serviceable share<br>SOM = SAM × obtainable share',
    vars: [['TAM', 'total addressable market: revenue if every possible buyer bought from you'], ['SAM', 'serviceable available market: the part your offer and reach fit'], ['SOM', 'serviceable obtainable market: the part you can realistically capture']],
    note: 'All three are annual revenue figures. Keep the same year and currency through the chain, and state your sources next to each number.'
  },
  example: `<p>A startup sells scheduling software to U.S. physical therapy clinics. Bottom-up, it estimates 40,000 clinics could use the product at $2,400 a year.</p>
<p>TAM = 40,000 × $2,400 = <strong>$96 million</strong>.</p>
<p>It only integrates with two billing systems used by 45% of clinics, so SAM = $96M × 45% = <strong>$43.2 million</strong>.</p>
<p>Against three established competitors it targets 8% of SAM in five years: SOM = $43.2M × 8% = <strong>$3,456,000</strong>, which is 1,440 clinics.</p>`,
  table: {
    title: 'How big is SOM at different serviceable and capture shares?',
    intro: 'SOM in dollars for a $600 million TAM. Read across for the share of TAM you can serve and down for the share of SAM you win.',
    head: ['Win (% of SAM)', 'SAM 10%', 'SAM 25%', 'SAM 50%', 'SAM 100%'],
    rows: ({ run }) => [1, 2, 3, 5, 10, 15, 20, 25].map(s => [s + '%', ...[10, 25, 50, 100].map(a => run({ method: 'topdown', market: 600000000, samPct: a, somPct: s }).value)])
  },
  sections: [
    {
      h2: 'What is the difference between TAM, SAM and SOM?',
      html: `<p>They are three nested circles. <strong>TAM</strong> answers "how much is spent on this problem in total?" <strong>SAM</strong> answers "how much of that could my current product sell into?" <strong>SOM</strong> answers "how much will I actually get?"</p>
<p>A meal-kit company's TAM might be all U.S. grocery spending on dinner ingredients. Its SAM is households in the zip codes it ships to that cook at home and order online. Its SOM is the slice of those households it can convert and keep given competition from other kits and supermarkets.</p>
<p>Investors care most about SAM and SOM. A huge TAM shows the idea can scale; a credible SOM shows you understand how you will win customers.</p>`
    },
    {
      h2: 'Should you size a market top-down or bottom-up?',
      html: `<p><strong>Top-down</strong> starts from a published total (an industry report, U.S. Census Bureau business counts, trade association data) and narrows it with percentages. It is quick and easy to source but can hide wishful assumptions inside the percentages.</p>
<p><strong>Bottom-up</strong> counts reachable buyers and multiplies by your real price. It takes longer but ties directly to your pricing and sales plan, and investors trust it more. A strong deck shows both and explains any gap between them.</p>
<p>The calculator handles either: pick "Customers × price" to build TAM bottom-up, or enter a market total to work top-down.</p>`
    },
    {
      h2: 'What SOM percentage is realistic?',
      html: `<p>There is no official benchmark, but some rules of thumb help:</p>
<ul><li><strong>New entrant, crowded market:</strong> 1–5% of SAM within five years is defensible.</li>
<li><strong>Niche with few competitors:</strong> 10–20% of SAM can be argued if you have a distribution edge.</li>
<li><strong>Above 25% of SAM:</strong> only believable if you are creating the category or have a contractual advantage.</li></ul>
<p>Sanity-check SOM against capacity: if each salesperson closes 60 accounts a year and SOM needs 7,500 customers, you need many reps or a self-serve funnel. Use the <a href="/conversion-rate-calculator">conversion rate calculator</a> to work back from traffic to customers.</p>`
    },
    {
      h2: 'How do you calculate market potential?',
      html: `<p>Market potential is the maximum sales an entire industry could reach, usually written as <strong>number of potential buyers × purchases per buyer per year × average price</strong>. It is the same idea as a bottom-up TAM. For 2 million households buying 4 air filters a year at $15 each, market potential = 2,000,000 × 4 × $15 = $120 million.</p>
<p>Your sales potential is your share of that figure, which corresponds to SOM.</p>`
    }
  ],
  faq: [
    { q: 'Is TAM measured in revenue or customers?', a: 'Usually annual revenue. You can also express it as a customer count, but investors expect a dollar figure, and SAM and SOM should use the same unit as TAM.' },
    { q: 'Can SOM be larger than SAM?', a: 'No. SOM is a share of SAM, and SAM is a share of TAM, so TAM ≥ SAM ≥ SOM by definition.' },
    { q: 'What is a good TAM for a startup?', a: 'Venture investors often look for a TAM of $1 billion or more so that a modest share can produce a large company. Bootstrapped and small businesses can thrive in far smaller markets.' },
    { q: 'Where do I find market size data?', a: 'Start with free public sources: U.S. Census Bureau County Business Patterns and Statistics of U.S. Businesses for business counts, BLS consumer spending data, trade associations and public company filings. The SBA lists more market research sources.' },
    { q: 'Should TAM include customers who use a free alternative?', a: 'Include them if they have the problem and could pay. Exclude buyers who cannot legally or practically buy from you, such as regions you are barred from serving.' },
    { q: 'How often should I update my market sizing?', a: 'Revisit it when you add a product, enter a new region or change price. Each of those moves SAM, and price changes move all three numbers.' },
    { q: 'What is the difference between SOM and a sales forecast?', a: 'SOM is the ceiling you could capture in a few years; a sales forecast is the month-by-month path toward it. Your forecast for year five should not exceed SOM.' }
  ],
  related: ['clv-calculator', 'conversion-rate-calculator', 'business-valuation-calculator', 'shark-tank-valuation-calculator', 'cagr-calculator'],
  sources: [
    { name: 'U.S. Small Business Administration: Market research and competitive analysis', url: 'https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis' },
    { name: 'U.S. Census Bureau: County Business Patterns', url: 'https://www.census.gov/programs-surveys/cbp.html' },
    { name: 'U.S. Census Bureau: Statistics of U.S. Businesses', url: 'https://www.census.gov/programs-surveys/susb.html' }
  ]
};
