export default {
  slug: 'home-sale-proceeds-calculator',
  hub: 'mortgage',
  name: 'Cost to Sell a House Calculator',
  title: 'Cost to Sell a House Calculator: $400K Sale Costs $31,000',
  h1: 'Home Sale Proceeds Calculator: Selling Costs and What You Walk Away With',
  meta: 'Selling a $400,000 home with 5.5% commission, 1.5% closing costs and $3,000 of prep costs $31,000, leaving $149,000 after a $220,000 payoff. Run your own sale.',
  keyword: 'how much does it cost to sell a house calculator',
  also: ['cost to sell a house calculator', 'home sale proceeds calculator', 'seller net sheet calculator', 'net proceeds from sale of home calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'price', label: 'Sale price', type: 'number', value: 400000, prefix: '$' },
    { id: 'payoff', label: 'Mortgage payoff (all loans on the home)', type: 'number', value: 220000, prefix: '$' },
    { id: 'comm', label: 'Agent commissions (total)', type: 'number', value: 5.5, suffix: '% of price', help: 'Listing agent plus any buyer-agent compensation you agree to pay.' },
    { id: 'closing', label: 'Seller closing costs', type: 'number', value: 1.5, suffix: '% of price', help: 'Title, escrow or attorney, transfer taxes, recording, prorations.' },
    { id: 'prep', label: 'Repairs, cleaning and staging', type: 'number', value: 3000, prefix: '$' },
    { id: 'credits', label: 'Credits or concessions to the buyer', type: 'number', value: 0, prefix: '$' }
  ],
  compute(v, H) {
    if (!(v.price > 0)) return { error: 'Enter the sale price.' };
    var z = function (x) { return x > 0 ? x : 0; };
    var comm = v.price * z(v.comm) / 100, close = v.price * z(v.closing) / 100, prep = z(v.prep), cred = z(v.credits), payoff = z(v.payoff);
    var cost = comm + close + prep + cred;
    var net = v.price - cost - payoff;
    var equity = v.price - payoff;
    var rows = [
      ['Net proceeds to you', (net < 0 ? '−' : '') + H.money0(Math.abs(net)), true],
      ['Agent commissions', H.money0(comm)],
      ['Seller closing costs', H.money0(close)],
      ['Repairs and staging', H.money0(prep)],
      ['Buyer credits', H.money0(cred)],
      ['Selling costs as % of price', H.pct(cost / v.price * 100, 2)],
      ['Equity before selling costs', H.money0(equity)],
      ['Share of equity spent on selling', equity > 0 ? H.pct(cost / equity * 100, 1) : '—']
    ];
    return {
      value: H.money0(cost),
      label: 'Total cost to sell',
      expr: H.money0(v.price) + ' × ' + H.num(z(v.comm) + z(v.closing), 2) + '% + ' + H.money0(prep + cred),
      rows: rows,
      sub: net < 0 ? 'The costs and payoff exceed the price, so you would need to bring ' + H.money0(-net) + ' to closing (or negotiate a short sale).' : 'You keep ' + H.pct(net / v.price * 100, 1) + ' of the sale price after paying off the mortgage and every selling cost.'
    };
  },
  quick: ({ r }) => `Selling a <strong>$400,000</strong> house costs about <strong>${r.value}</strong> with 5.5% in agent commissions ($22,000), 1.5% seller closing costs ($6,000) and $3,000 of repairs and staging, or ${r.rows[5][1]} of the price. After paying off a $220,000 mortgage you walk away with <strong>${r.rows[0][1]}</strong>. A planning range of 6% to 10% of the price covers most sales.`,
  stepsTitle: 'How to estimate your net proceeds from a home sale',
  steps: [
    'Start from a realistic sale price based on recent comparable sales, not the list price.',
    'Get a payoff quote from your servicer for every loan on the house, including any HELOC. The payoff is higher than the balance on your statement because it adds interest through the closing date; using the statement balance is the classic mistake.',
    'Enter the total commission you will pay: the listing agent\'s fee plus any buyer-agent compensation you offer. Since August 2024 these are negotiated separately and are not set by the MLS.',
    'Add seller closing costs (title, escrow or attorney, transfer tax, recording, prorated property tax and HOA fees), plus repairs, staging and any credits the buyer negotiates after inspection.'
  ],
  formulaTitle: 'How do you calculate net proceeds from selling a house?',
  formula: {
    expr: 'Selling costs = price × (commission % + closing %) + repairs + buyer credits<br>Net proceeds = price − selling costs − mortgage payoff',
    vars: [['commission %', 'total paid to agents'], ['closing %', 'seller-paid title, escrow, transfer taxes and fees'], ['mortgage payoff', 'every lien on the home, with interest to the payoff date']]
  },
  example: `<p>Sale price $400,000. Commissions: 5.5% = <strong>$22,000</strong>. Closing costs: 1.5% = <strong>$6,000</strong>. Repairs and staging: $3,000.</p>
<p>Total cost to sell = $22,000 + $6,000 + $3,000 = <strong>$31,000</strong>, or 7.75% of the price.</p>
<p>Net proceeds = $400,000 − $31,000 − $220,000 payoff = <strong>$149,000</strong>. The seller had $180,000 of equity, so selling costs took 17.2% of it.</p>`,
  table: {
    title: 'How much does it cost to sell a house at different prices?',
    intro: 'Commission at 5.5% and closing costs at 1.5% of the price, before repairs and buyer credits, computed by the calculator.',
    head: ['Sale price', 'Commissions', 'Closing costs', 'Total cost', 'Net with no mortgage'],
    rows: ({ run }) => [150000, 200000, 250000, 300000, 400000, 500000, 600000, 750000, 1000000].map(p => {
      const o = run({ price: p, payoff: 0, prep: 0, credits: 0 });
      return ['$' + p.toLocaleString('en-US'), o.rows[1][1], o.rows[2][1], o.value, o.rows[0][1]];
    }),
    note: 'Transfer taxes alone can exceed 1% in some states and cities, and are zero in others, so ask a local title or escrow company for a seller net sheet.'
  },
  sections: [
    {
      h2: 'How much are realtor fees when selling a house in 2026?',
      html: `<p>There is no standard rate. Total commissions have historically run around 5% to 6% of the price, split between the listing and buyer's agents. Since the National Association of Realtors settlement practice changes took effect on Aug 17, 2024, offers of buyer-agent compensation can no longer be published on the MLS and buyers must sign a written agreement with their own agent. Sellers can still agree to pay the buyer's agent, often as a negotiated concession, but nothing requires it.</p>
<p>On a $400,000 sale, each percentage point of commission is $4,000. A listing agent at 2.5% plus a buyer-agent payment of 2.5% is $20,000; a flat-fee or discount listing can cut the listing side to a few thousand dollars, in exchange for doing more of the work yourself.</p>`
    },
    {
      h2: 'What closing costs does the seller pay?',
      html: `<p>Seller closing costs commonly add 1% to 3% of the price, depending heavily on the state:</p>
<ul>
<li><strong>Transfer or excise taxes:</strong> set by the state, county or city. Some states charge nothing; others charge 1% or more, and some cities add their own.</li>
<li><strong>Title and settlement:</strong> in many areas the seller buys the buyer's owner's title policy, and pays part of the escrow or attorney fee.</li>
<li><strong>Prorations:</strong> property tax and HOA dues are split to the closing date; if taxes are paid in arrears, the seller credits the buyer for the months owed.</li>
<li><strong>Payoff costs:</strong> interest to the payoff date, recording fees to release the lien, and any HOA transfer or statement fees.</li>
</ul>
<p>Your Closing Disclosure or settlement statement lists every charge; ask your title company for a preliminary net sheet once you have an offer.</p>`
    },
    {
      h2: 'Do you pay taxes when you sell your house?',
      html: `<p>Usually not, if it was your main home. You can exclude up to <strong>$250,000</strong> of gain ($500,000 for married couples filing jointly) if you owned and lived in the house for at least 2 of the 5 years before the sale. The gain is the sale price minus selling costs minus your adjusted basis (what you paid, plus closing costs at purchase and the cost of improvements).</p>
<p>Example: bought for $250,000 with $40,000 of improvements, sold for $400,000 with $31,000 of selling costs. Gain = $400,000 − $31,000 − $290,000 = $79,000, fully covered by the exclusion. Selling costs are not deductible on their own, but they reduce the taxable gain, so keep the settlement statement. If the gain exceeds the exclusion or you don't qualify, see the <a href="/capital-gains-tax-calculator">capital gains tax calculator</a>.</p>`
    },
    {
      h2: 'How can I lower the cost of selling my home?',
      html: `<p>Negotiate the listing commission and decide up front what, if anything, you will offer a buyer's agent. Get two or three listing presentations; fees and services vary more than most sellers expect. Skip cosmetic remodels that rarely return their cost and focus on cleaning, decluttering and fixing items an inspector will flag. Selling yourself saves the listing fee but you will still need a title company or attorney, and buyers often bring an agent who expects to be paid.</p>
<p>If you are weighing whether to sell at all, the <a href="/rent-or-sell-house-calculator">rent or sell calculator</a> compares selling now with renting the house out.</p>`
    }
  ],
  faq: [
    { q: 'How much does it cost to sell a $300,000 house?', a: 'About $21,000 at 5.5% commission and 1.5% closing costs, or $24,000 with $3,000 of repairs and staging. That is 7% to 8% of the price.' },
    { q: 'How much will I walk away with when I sell my house?', a: 'Sale price minus all selling costs minus your mortgage payoff. In the default example a $400,000 sale with a $220,000 payoff and $31,000 of costs nets $149,000.' },
    { q: 'Who pays closing costs, the buyer or the seller?', a: 'Both pay their own costs. Sellers usually pay commissions, transfer taxes and often the owner\'s title policy; buyers pay lender fees, the appraisal and prepaid escrow. Who pays what is negotiable and varies by local custom.' },
    { q: 'Do I have to pay the buyer\'s agent commission?', a: 'No. Since August 2024 buyer-agent compensation is negotiated separately and cannot be advertised on the MLS. Many sellers still offer it to attract buyers, but it is optional.' },
    { q: 'Are home selling costs tax deductible?', a: 'Not as a deduction, but commissions and seller closing costs reduce the amount you realize from the sale, which lowers any taxable gain under IRS rules in Publication 523.' },
    { q: 'When do I get the money from selling my house?', a: 'At closing. The title or escrow company pays off your mortgage and wires or cuts a check for the rest, usually the same day or within a couple of business days once the deed is recorded.' }
  ],
  related: ['rent-or-sell-house-calculator', 'capital-gains-tax-calculator', 'mortgage-payoff-calculator', 'property-tax-calculator', 'house-affordability-calculator'],
  sources: [
    { name: 'IRS: Publication 523, Selling Your Home', url: 'https://www.irs.gov/forms-pubs/about-publication-523' },
    { name: 'IRS: Topic 701, Sale of your home', url: 'https://www.irs.gov/taxtopics/tc701' },
    { name: 'CFPB: Closing Disclosure explainer', url: 'https://www.consumerfinance.gov/owning-a-home/closing-disclosure/' },
    { name: 'National Association of Realtors: Settlement facts', url: 'https://www.nar.realtor/the-facts' }
  ]
};
