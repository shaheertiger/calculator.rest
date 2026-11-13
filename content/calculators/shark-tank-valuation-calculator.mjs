export default {
  slug: 'shark-tank-valuation-calculator',
  hub: 'business',
  name: 'Shark Tank Valuation Calculator',
  title: 'Shark Tank Valuation Calculator: $200K for 10% = $2M',
  h1: 'Shark Tank Valuation Calculator: Decode the Ask and the Counteroffer',
  meta: 'Asking $200,000 for 10% values a company at $2 million. A counter of $200,000 for 25% drops it to $800,000. Check any pitch, deal or sales multiple.',
  keyword: 'how to calculate shark tank valuation',
  also: ['shark tank valuation calculator', 'how to calculate valuation shark tank'],
  updated: '2026-11-13',
  inputs: [
    { id: 'ask', label: 'Investment asked for', type: 'number', value: 200000, prefix: '$' },
    { id: 'equity', label: 'Equity offered', type: 'number', value: 10, suffix: '%' },
    { id: 'sales', label: 'Last 12 months of sales (optional)', type: 'number', value: 400000, prefix: '$' },
    { id: 'profit', label: 'Last 12 months of profit (optional)', type: 'number', value: '', prefix: '$' },
    { id: 'offer', label: 'Shark\'s counter: amount (optional)', type: 'number', value: 200000, prefix: '$' },
    { id: 'offerEquity', label: 'Shark\'s counter: equity (optional)', type: 'number', value: 25, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.ask > 0)) return { error: 'Enter the amount of money asked for.' };
    if (!(v.equity > 0 && v.equity < 100)) return { error: 'Enter the equity offered, between 0% and 100%.' };
    var post = v.ask / (v.equity / 100);
    var pre = post - v.ask;
    var rows = [
      ['Pre-money valuation (before the cash)', H.money0(pre)],
      ['Founders\' stake after the deal', H.fix(100 - v.equity, 1) + '% = ' + H.money0(post * (1 - v.equity / 100))]
    ];
    if (v.sales > 0) rows.push(['Valuation ÷ sales', H.num(post / v.sales, 2) + '× sales', true]);
    if (v.profit > 0) rows.push(['Valuation ÷ profit', H.num(post / v.profit, 1) + '× profit']);
    var sub = 'Every 1% of equity is being priced at ' + H.money0(post / 100) + '.';
    if (v.offer > 0 && v.offerEquity > 0 && v.offerEquity < 100) {
      var cpost = v.offer / (v.offerEquity / 100);
      var chg = (cpost / post - 1) * 100;
      rows.push(['Counteroffer valuation', H.money0(cpost), true]);
      rows.push(['Change vs the ask', (chg >= 0 ? '+' : '−') + H.fix(Math.abs(chg), 1) + '%']);
      if (v.sales > 0) rows.push(['Counter ÷ sales', H.num(cpost / v.sales, 2) + '× sales']);
      rows.push(['Founders\' stake after counter', H.fix(100 - v.offerEquity, 1) + '% = ' + H.money0(cpost * (1 - v.offerEquity / 100))]);
      if (v.offer !== v.ask) rows.push(['Equity matching your valuation', H.fix(v.offer / post * 100, 2) + '% for ' + H.money0(v.offer)]);
      sub = 'The Shark values the company ' + H.fix(Math.abs(chg), 1) + '% ' + (chg < 0 ? 'below' : 'above') + ' the founders\' number.';
    }
    return {
      value: H.money0(post),
      label: 'Implied valuation (post-money)',
      expr: H.money0(v.ask) + ' ÷ ' + H.num(v.equity, 2) + '%',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate a Shark Tank valuation, divide the money asked for by the percentage of equity offered. An entrepreneur asking for <strong>$200,000 for 10%</strong> is valuing the company at $200,000 ÷ 0.10 = <strong>${r.value}</strong>, or 5× its $400,000 in sales. If a Shark counters with $200,000 for 25%, the valuation falls to $800,000, 60% lower.`,
  stepsTitle: 'How to calculate a Shark Tank valuation',
  steps: [
    'Take the amount of money asked for, for example $200,000.',
    'Convert the equity offered to a decimal: 10% = 0.10.',
    'Divide the money by the decimal: $200,000 ÷ 0.10 = $2,000,000. That is the <strong>post-money</strong> valuation, the company\'s worth including the new cash.',
    'Subtract the investment for the <strong>pre-money</strong> value ($1,800,000). Many viewers stop at step 3 and forget the Shark\'s cash is part of that $2 million.',
    'Compare the valuation with sales and profit. Sharks often react to the multiple: $2 million on $400,000 of sales is 5× sales.'
  ],
  formulaTitle: 'What is the Shark Tank valuation formula?',
  formula: {
    expr: 'Post-money valuation = Investment ÷ Equity %<br>Pre-money valuation = Post-money − Investment<br>Equity % = Investment ÷ Post-money valuation',
    vars: [['Investment', 'cash the Shark puts in'], ['Equity %', 'share of the company the Shark receives, as a decimal'], ['Post-money', 'value of the whole company right after the deal']]
  },
  example: `<p>A founder asks for $150,000 for 5% of her hot-sauce company, which sold $500,000 last year with $60,000 of profit.</p>
<p>Valuation = $150,000 ÷ 0.05 = <strong>$3,000,000</strong>, which is 6× sales and 50× profit.</p>
<p>A Shark offers $150,000 for 20%: $150,000 ÷ 0.20 = <strong>$750,000</strong>, or 1.5× sales.</p>
<p>The founder counters at 10%: $150,000 ÷ 0.10 = <strong>$1,500,000</strong>. The final deal splits the gap at 3× sales.</p>`,
  table: {
    title: 'What valuation does each ask imply?',
    intro: 'Post-money valuations for common Shark Tank asks. Read across for the equity offered.',
    head: ['Asking for', '5%', '10%', '15%', '20%', '25%', '33%'],
    rows: ({ run, H }) => [50000, 100000, 150000, 250000, 500000, 1000000].map(a => [H.money0(a), ...[5, 10, 15, 20, 25, 33].map(e => run({ ask: a, equity: e, offer: '', offerEquity: '', sales: '', profit: '' }).value)])
  },
  sections: [
    {
      h2: 'How do the Sharks decide what a company is worth?',
      html: `<p>Mostly by comparing the valuation with real numbers: trailing sales, profit and growth. A valuation of 10× sales for a consumer product with thin margins gets pushback; a business with strong margins, repeat customers and fast growth can justify more. The Sharks also price in risk: patents or none, how easily the product can be copied, how dependent sales are on one retailer, and how much of the Shark's time and network the deal will need.</p>
<p>Projections carry little weight. A founder who says "we will do $5 million next year" will hear "what did you do last year?" Enter trailing 12-month sales and profit in the calculator to see the multiple the Sharks are reacting to.</p>`
    },
    {
      h2: 'What is the difference between pre-money and post-money valuation?',
      html: `<p>Post-money is the value after the investment; pre-money is the value before it. Asking $200,000 for 10% implies $2,000,000 post-money and $1,800,000 pre-money, because $200,000 of the $2 million is the Shark's own cash now sitting in the company.</p>
<p>The distinction matters when several investors join. Each new round dilutes existing owners: after selling 10%, a founder with 100% owns 90%; if a later investor takes 20%, the founder owns 72%, not 70%. Startup instruments such as the post-money SAFE are built around this calculation.</p>`
    },
    {
      h2: 'How do royalty and loan deals change the math?',
      html: `<p>Many Shark deals are not straight equity. A <strong>royalty</strong> pays the Shark a fixed amount per unit (say $1) until the investment is repaid, sometimes several times over, often on top of a smaller equity stake. A <strong>loan</strong> or line of credit carries interest and gets repaid regardless of performance.</p>
<p>To compare, add the royalty's cost to the equity cost. $150,000 for 15% plus $1 per unit until $300,000 is paid back means the company hands over 15% of its value and $300,000 of future cash. At 100,000 units a year, that royalty runs for three years. The calculator values the equity part; work out the royalty separately.</p>`
    },
    {
      h2: 'Is a Shark Tank valuation the same as a business valuation?',
      html: `<p>No. The on-air number is a negotiated price for a minority stake in a young company, often with little profit, and it includes the value of a Shark's connections. A business that is being sold outright is normally priced on a multiple of its earnings. For that, use the <a href="/business-valuation-calculator">business valuation calculator</a>; for how big the market behind a pitch is, the <a href="/tam-sam-som-calculator">TAM SAM SOM calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate a valuation from an investment and percentage?', a: 'Divide the investment by the percentage as a decimal. $200,000 for 10% is $200,000 ÷ 0.10 = $2,000,000.' },
    { q: 'What does "$100,000 for 20%" mean on Shark Tank?', a: 'The entrepreneur is selling a 20% stake for $100,000, which values the company at $100,000 ÷ 0.20 = $500,000 post-money and $400,000 pre-money.' },
    { q: 'How much equity should I give for an investment?', a: 'Divide the investment by the valuation you can justify. To raise $250,000 at a $2.5 million post-money valuation, give 10%.' },
    { q: 'Why do Sharks ask for more equity?', a: 'More equity at the same dollar amount means a lower valuation. Sharks counter when they think sales or profit do not support the founder\'s number, or to compensate for risk and the work they will put in.' },
    { q: 'What sales multiple do Sharks accept?', a: 'There is no fixed rule. The multiple depends on margins, growth and risk: a low-margin consumer product usually earns a lower multiple of sales than a high-margin, fast-growing or software business. Profit multiples matter more once a company is consistently profitable.' },
    { q: 'Do Shark Tank deals always close?', a: 'No. The handshake on air is followed by due diligence, and deals are sometimes renegotiated or dropped after the cameras stop, for example if the numbers do not check out or either side changes its mind.' },
    { q: 'How does dilution work after a Shark deal?', a: 'Your percentage shrinks each time new shares are sold. If you own 90% after a 10% deal and later sell 20% to another investor, you own 90% × 80% = 72%.' }
  ],
  related: ['business-valuation-calculator', 'tam-sam-som-calculator', 'roi-calculator', 'percentage-calculator', 'pe-ratio-calculator'],
  sources: [
    { name: 'ABC: Shark Tank official show page', url: 'https://abc.com/shows/shark-tank' },
    { name: 'Investor.gov (SEC): Dilution', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/dilution' },
    { name: 'Y Combinator: SAFE financing documents and user guide', url: 'https://www.ycombinator.com/documents' },
    { name: 'U.S. Small Business Administration: Fund your business', url: 'https://www.sba.gov/business-guide/plan-your-business/fund-your-business' }
  ]
};
