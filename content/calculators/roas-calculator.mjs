export default {
  slug: 'roas-calculator',
  hub: 'business',
  name: 'ROAS Calculator',
  title: 'ROAS Calculator: Break-Even ROAS at a 40% Margin Is 2.5x',
  h1: 'ROAS Calculator: Return on Ad Spend, Break-Even and Blended ROAS',
  meta: 'At a 40% gross margin, break-even ROAS is 1 ÷ 0.40 = 2.5x. Enter ad spend and revenue by channel to get blended ROAS, ACoS, ad profit and a target ROAS.',
  keyword: 'how to calculate break even roas',
  also: ['how to calculate breakeven roas', 'how to calculate blended roas across all channels', 'roas calculator', 'break even roas calculator', 'how to calculate roas', 'target roas calculator'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'ch', label: 'Ad channels', type: 'rows', addLabel: '+ add channel', max: 12, wide: true,
      fields: [
        { id: 'name', label: 'Channel', type: 'text', value: '', blank: true, placeholder: 'e.g. Google Ads' },
        { id: 'spend', label: 'Ad spend ($)', type: 'number', value: 1000 },
        { id: 'rev', label: 'Revenue from ads ($)', type: 'number', value: 4000 }
      ],
      value: [
        { name: 'Google Ads', spend: 2000, rev: 10000 },
        { name: 'Meta Ads', spend: 2500, rev: 10500 },
        { name: 'Microsoft Ads', spend: 500, rev: 4500 }
      ]
    },
    { id: 'margin', label: 'Gross margin after variable costs', type: 'number', value: 40, suffix: '%', help: 'Price minus product cost, shipping, payment fees and returns, as a % of revenue.' },
    { id: 'target', label: 'Profit you want after ad spend (optional)', type: 'number', value: 10, suffix: '% of revenue' }
  ],
  compute(v, H) {
    var spend = 0, rev = 0, parts = [];
    (v.ch || []).forEach(function (c, i) {
      if (!(c.spend > 0) || !(c.rev >= 0)) return;
      spend += c.spend; rev += c.rev;
      parts.push([(c.name ? H.esc(c.name) : 'Channel ' + (i + 1)), c.rev / c.spend]);
    });
    if (!(spend > 0)) return { error: 'Enter ad spend and revenue for at least one channel.' };
    var m = v.margin / 100;
    if (!(m > 0 && m <= 1)) return { error: 'Enter a gross margin between 1% and 100%.' };
    var roas = rev / spend, be = 1 / m, profit = rev * m - spend;
    var rows = [
      ['Break-even ROAS', H.fix(be, 2) + 'x', true],
      ['Profit after ad spend', H.money0(profit)],
      ['ACoS (ad spend ÷ revenue)', H.pct(spend / rev * 100, 1)],
      ['Break-even ACoS', H.pct(m * 100, 1)]
    ];
    var t = v.target / 100;
    if (t > 0) rows.push(['Target ROAS for ' + H.pct(t * 100, 1) + ' profit', t < m ? H.fix(1 / (m - t), 2) + 'x' : 'not reachable at this margin']);
    if (parts.length > 1) parts.forEach(function (p) { rows.push([p[0] + ' ROAS', H.fix(p[1], 2) + 'x' + (p[1] < be ? ' (below break-even)' : '')]); });
    return {
      value: H.fix(roas, 2) + 'x',
      label: parts.length > 1 ? 'Blended ROAS' : 'ROAS',
      expr: H.money0(rev) + ' ÷ ' + H.money0(spend),
      rows: rows,
      sub: roas >= be ? 'Above break-even: every $1 of ads returns ' + H.money(roas) + ' in sales and ' + H.money(roas * m - 1) + ' of profit after the ad cost.' : 'Below break-even: ads are costing more than the gross profit they bring in (' + H.money(roas * m - 1) + ' per $1 spent).',
      roas: roas, be: be
    };
  },
  quick: ({ r }) => `Break-even ROAS is 1 divided by your gross margin. If you keep 40% of each sale after product cost, shipping and fees, you need <strong>$2.50 in revenue per $1 of ads (2.5x)</strong> just to cover ad spend. A store spending $5,000 for $25,000 in ad revenue has a blended ROAS of <strong>${r.value}</strong>, double its break-even, leaving $5,000 of profit after ads.`,
  stepsTitle: 'How to calculate break-even ROAS',
  steps: [
    'Work out your <strong>gross margin after variable costs</strong>: price minus product cost, shipping, payment fees and an allowance for returns, divided by price. Using product margin alone (ignoring shipping and fees) is the usual mistake and sets the break-even too low.',
    'Divide 1 by that margin as a decimal. At 40%, 1 ÷ 0.40 = 2.5, so break-even ROAS is 2.5x (250%).',
    'Calculate actual ROAS: revenue attributed to ads ÷ ad spend. Enter each channel to see blended ROAS across all of them.',
    'To earn a profit after ads, divide 1 by (margin − desired profit %). A 40% margin with a 10% profit goal needs 1 ÷ 0.30 = 3.33x.'
  ],
  formulaTitle: 'What is the ROAS formula?',
  formula: {
    expr: 'ROAS = Revenue from ads ÷ Ad spend<br>Break-even ROAS = 1 ÷ Gross margin<br>Target ROAS = 1 ÷ (Gross margin − Target profit %)<br>ACoS = Ad spend ÷ Revenue = 1 ÷ ROAS',
    vars: [['Gross margin', 'share of revenue left after all variable costs, as a decimal'], ['Target profit %', 'profit you want left after ad spend, as a share of revenue'], ['ACoS', 'advertising cost of sales, the metric Amazon Ads reports']],
    note: 'Google Ads expresses target ROAS as a percentage: 2.5x is entered as 250%.'
  },
  example: `<p>An online store sells a $60 product. Product cost is $24, shipping $8, payment fees $2.04 and returns average $1.96 per order, for $36 of variable cost.</p>
<p>Gross margin = ($60 − $36) ÷ $60 = <strong>40%</strong>. Break-even ROAS = 1 ÷ 0.40 = <strong>2.5x</strong>: the store can spend up to $24 in ads per sale and still not lose money.</p>
<p>Last month it spent $5,000 across Google, Meta and Microsoft Ads and recorded $25,000 in ad revenue: ROAS = $25,000 ÷ $5,000 = <strong>5.0x</strong>. Profit after ads = $25,000 × 40% − $5,000 = <strong>$5,000</strong>, a 20% margin after advertising.</p>`,
  table: {
    title: 'What is the break-even ROAS for my margin?',
    intro: 'Break-even ROAS, the matching break-even ACoS, and the ROAS needed to keep 10% of revenue as profit after ad spend, computed with the calculator.',
    head: ['Gross margin', 'Break-even ROAS', 'Break-even ACoS', 'ROAS for 10% profit'],
    rows: ({ run, H }) => [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80].map(m => { const r = run({ margin: m, target: 10 }); return [m + '%', H.fix(r.be, 2) + 'x', m + '%', m > 10 ? H.fix(1 / (m / 100 - 0.10), 2) + 'x' : '—']; }),
    note: 'Low-margin products need very high ROAS to be profitable; a 20% margin needs 5x just to break even. That is why ads tend to work best on high-margin products and on repeat customers.'
  },
  sections: [
    {
      h2: 'How do you calculate blended ROAS across all channels?',
      html: `<p>Blended ROAS = total revenue ÷ total ad spend across every channel. It is a weighted average: channels with bigger budgets pull it harder. In the example, Google returns 5.0x, Meta 4.2x and Microsoft 9.0x, but blended ROAS is $25,000 ÷ $5,000 = 5.0x, not the 6.07x you'd get by averaging the three ratios.</p>
<p>Many marketers also track total store revenue ÷ total marketing spend (sometimes called MER, marketing efficiency ratio). It avoids double counting: when a shopper clicks a Meta ad and later a Google ad, both platforms often claim the same sale, so platform-reported ROAS figures add up to more revenue than you actually took in. Comparing MER with your break-even ROAS is the most conservative check.</p>`
    },
    {
      h2: 'What is a good ROAS?',
      html: `<p>A good ROAS is any figure comfortably above your own break-even ROAS, because profitability depends on margin. A 3x ROAS is excellent for a product with a 70% margin (break-even 1.43x) and a loss for one with a 25% margin (break-even 4x). Rules of thumb like "4x is good" only hold for businesses whose margins happen to be around 25–35%.</p>
<p>New-customer campaigns can run at or below break-even when customers reorder. If the average customer's lifetime gross profit is three times the first order's, the first-order break-even can be judged against that instead; the <a href="/clv-calculator">customer lifetime value calculator</a> estimates it.</p>`
    },
    {
      h2: 'How is ROAS different from ROI and ACoS?',
      html: `<p><strong>ROAS</strong> measures revenue per ad dollar and ignores product costs. <strong>ROI</strong> measures profit against total investment: (gross profit − ad spend) ÷ ad spend. In the example, ROI = ($10,000 − $5,000) ÷ $5,000 = 100%, while ROAS is 5.0x. A campaign can have a "good" ROAS and a negative ROI if margins are thin.</p>
<p><strong>ACoS</strong>, used by Amazon Ads, is the inverse of ROAS: ad spend ÷ ad sales. A 5x ROAS is a 20% ACoS, and break-even ACoS equals your margin. For general investment returns, use the <a href="/roi-calculator">ROI calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is break-even ROAS?', a: 'Break-even ROAS is the return on ad spend at which the gross profit from ad-driven sales exactly pays for the ads. It equals 1 ÷ gross margin, so a 50% margin breaks even at 2.0x.' },
    { q: 'Is a ROAS of 2 good?', a: 'Only if your margin after variable costs is above 50%. At a 2x ROAS, $1 of ads brings $2 of sales; with a 40% margin that is $0.80 of profit, a $0.20 loss per ad dollar.' },
    { q: 'How do I convert ROAS to a percentage?', a: 'Multiply by 100. A 3.5x ROAS is 350%. Google Ads target ROAS bidding uses the percentage form.' },
    { q: 'What margin should I use for break-even ROAS?', a: 'Use contribution margin per order: revenue minus product cost, shipping, payment processing, packaging and expected returns. Don\'t subtract fixed costs like salaries or rent; those are covered by the profit above break-even.' },
    { q: 'How do I calculate ROAS from ACoS?', a: 'ROAS = 1 ÷ ACoS. An ACoS of 25% is a 4x ROAS, and an ACoS of 40% is 2.5x.' },
    { q: 'Should ROAS include sales tax and shipping charged?', a: 'No. Use revenue net of sales tax, and be consistent about shipping: if you count shipping charged to customers as revenue, count your shipping cost in the margin.' },
    { q: 'What is target ROAS in Google Ads?', a: 'Target ROAS is a Smart Bidding strategy where Google sets bids to hit the conversion value per ad dollar you choose. Set it at or above your break-even ROAS plus your profit goal, expressed as a percentage.' }
  ],
  related: ['conversion-rate-calculator', 'clv-calculator', 'profit-margin-calculator', 'break-even-calculator', 'roi-calculator'],
  sources: [
    { name: 'Google Ads Help: About Target ROAS bidding', url: 'https://support.google.com/google-ads/answer/6268637' },
    { name: 'Amazon Ads: What is advertising cost of sales (ACOS)?', url: 'https://advertising.amazon.com/library/guides/acos-advertising-cost-of-sales' },
    { name: 'U.S. Small Business Administration: Calculate your startup costs (contribution margin)', url: 'https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs' }
  ]
};
