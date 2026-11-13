export default {
  slug: 'conversion-rate-calculator',
  hub: 'business',
  name: 'Conversion Rate Calculator',
  title: 'Conversion Rate Calculator: 300 of 12,500 Visits Is 2.4%',
  h1: 'Conversion Rate Calculator: CVR, Cost per Conversion and Revenue',
  meta: '300 conversions from 12,500 visitors is a 2.40% conversion rate. See cost per conversion, revenue per visitor and the extra sales a higher rate would bring.',
  keyword: 'how to calculate cvr',
  also: ['conversion rate calculator', 'how to calculate conversion rate', 'how to calculate cost per conversion'],
  updated: '2026-11-13',
  inputs: [
    { id: 'visitors', label: 'Visitors, sessions or clicks', type: 'number', value: 12500, help: 'The people who had the chance to convert. Use the same definition every time.' },
    { id: 'conversions', label: 'Conversions', type: 'number', value: 300, help: 'Purchases, sign-ups, leads or calls: whatever counts as the goal.' },
    { id: 'spend', label: 'Traffic cost (optional)', type: 'number', value: 3750, prefix: '$', help: 'Ad spend that bought these visitors.' },
    { id: 'aov', label: 'Value per conversion (optional)', type: 'number', value: 80, prefix: '$', help: 'Average order value or lead value.' },
    { id: 'target', label: 'Target conversion rate (optional)', type: 'number', value: 3, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.visitors > 0)) return { error: 'Enter the number of visitors, sessions or clicks.' };
    if (!(v.conversions >= 0)) return { error: 'Enter the number of conversions (0 if none).' };
    var cvr = v.conversions / v.visitors * 100;
    var rows = [['Visitors per conversion', v.conversions > 0 ? H.num(v.visitors / v.conversions, 1) : '—'], ['Conversions per 1,000 visitors', H.num(cvr * 10, 1)]];
    if (v.spend > 0) {
      rows.push(['Cost per conversion', v.conversions > 0 ? H.money(v.spend / v.conversions) : 'no conversions', true]);
      rows.push(['Cost per visitor', H.money(v.spend / v.visitors)]);
    }
    if (v.aov > 0) {
      rows.push(['Conversion value', H.money0(v.conversions * v.aov)]);
      rows.push(['Value per visitor', H.money(v.conversions * v.aov / v.visitors)]);
    }
    if (v.target > 0 && v.target <= 100) {
      var need = v.visitors * v.target / 100;
      var extra = need - v.conversions;
      rows.push(['Conversions at ' + H.num(v.target, 2) + '%', H.num(need, 1) + (extra > 0 ? ' (+' + H.num(extra, 1) + ')' : '')]);
      if (extra > 0 && v.aov > 0) rows.push(['Extra value at target', H.money0(extra * v.aov), true]);
      if (v.spend > 0 && need > 0) rows.push(['Cost per conversion at target', H.money(v.spend / need)]);
    }
    if (cvr > 100) return { error: 'Conversions are higher than visitors. Check that both cover the same period and definition.' };
    return {
      value: H.fix(cvr, 2) + '%',
      label: 'Conversion rate (CVR)',
      expr: H.num(v.conversions, 2) + ' ÷ ' + H.num(v.visitors, 2) + ' × 100',
      rows: rows,
      sub: 'About 1 in ' + (v.conversions > 0 ? H.num(v.visitors / v.conversions, 0) : '—') + ' visitors converted.'
    };
  },
  quick: ({ r }) => `To calculate CVR, divide conversions by visitors (or clicks) and multiply by 100. An online store with <strong>300 orders</strong> from <strong>12,500 visitors</strong> has a conversion rate of <strong>${r.value}</strong>, or 1 sale per 41.7 visits. If the traffic cost $3,750, each conversion cost $12.50; lifting CVR to 3% would add 75 orders.`,
  stepsTitle: 'How to calculate conversion rate',
  steps: [
    'Decide what counts as a <strong>conversion</strong>: a purchase, a form fill, a trial start, a call. Count one action per goal, and keep the definition fixed between reports.',
    'Pick the <strong>denominator</strong>: sessions, unique users or ad clicks for the same date range and channel. Mixing sessions from one tool with conversions from another is the most common error.',
    'Divide conversions by the denominator and multiply by 100.',
    'Add ad spend and order value to see cost per conversion and value per visitor, which tell you whether a change in CVR actually made money.'
  ],
  formulaTitle: 'What is the conversion rate formula?',
  formula: {
    expr: 'Conversion rate = Conversions ÷ Visitors × 100<br>Cost per conversion = Spend ÷ Conversions<br>Value per visitor = Conversion rate × Value per conversion',
    vars: [['Conversions', 'completed goal actions'], ['Visitors', 'sessions, users or clicks in the same period'], ['Spend', 'what you paid for the traffic']],
    note: 'Google Ads defines conversion rate as conversions divided by ad interactions (clicks for search ads). Analytics tools often divide by sessions, which gives a lower rate when people visit more than once before buying.'
  },
  example: `<p>A home-services company ran a landing page test for two weeks.</p>
<p>Page A: 4,200 clicks, 126 quote requests. CVR = 126 ÷ 4,200 = <strong>3.00%</strong>.</p>
<p>Page B: 4,050 clicks, 162 quote requests. CVR = 162 ÷ 4,050 = <strong>4.00%</strong>.</p>
<p>Both pages cost $1.10 per click, so cost per lead fell from $1.10 ÷ 0.03 = $36.67 on page A to $1.10 ÷ 0.04 = <strong>$27.50</strong> on page B. Relative lift = 4.00 ÷ 3.00 − 1 = 33.3%.</p>`,
  table: {
    title: 'How does conversion rate change your cost per conversion?',
    intro: 'Results per 10,000 visitors bought at $0.30 each ($3,000), with an $80 value per conversion.',
    head: ['Conversion rate', 'Conversions', 'Cost per conversion', 'Value per visitor', 'Conversion value'],
    rows: ({ run, H }) => [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10].map(c => {
      const r = run({ visitors: 10000, conversions: c * 100, spend: 3000, aov: 80, target: '' });
      return [r.value, H.int(c * 100), r.rows[2][1], r.rows[5][1], r.rows[4][1]];
    }),
    note: 'Doubling the conversion rate halves the cost per conversion at the same traffic cost.'
  },
  sections: [
    {
      h2: 'What is a good conversion rate?',
      html: `<p>There is no universal number. Conversion rates depend on what you count, how warm the traffic is and the price of what you sell. A free newsletter sign-up can convert 20% or more of visitors; a $3,000 furniture order may convert well under 1%. Branded search and email traffic convert far higher than cold social traffic.</p>
<p>The useful benchmark is your own past performance for the same page, offer and channel. Track it weekly, and judge changes by cost per conversion and revenue per visitor, not the percentage alone. A page that converts more people into low-value orders can earn less.</p>`
    },
    {
      h2: 'Should conversion rate use sessions, users or clicks?',
      html: `<p>Each answers a different question:</p>
<ul><li><strong>Clicks:</strong> what ad platforms use. Best for judging an ad and its landing page.</li>
<li><strong>Sessions:</strong> the default in most analytics tools. Counts repeat visits, so it is lower than a per-user rate.</li>
<li><strong>Users:</strong> the share of people who eventually converted. Closest to "what fraction of my audience buys".</li></ul>
<p>In Google Analytics 4, conversions are recorded as key events, and session or user key event rate is reported separately. Choose one denominator per report and label it.</p>`
    },
    {
      h2: 'How do you calculate cost per conversion?',
      html: `<p>Divide total spend by the number of conversions. $3,750 of ad spend that produced 300 sales is $3,750 ÷ 300 = <strong>$12.50 per conversion</strong>. You can get the same answer from cost per click and conversion rate: $0.30 ÷ 0.024 = $12.50.</p>
<p>Compare cost per conversion with what a conversion is worth. If average profit per order is $20, $12.50 leaves $7.50; at a 1.2% conversion rate the cost would jump to $25 and every sale would lose money. To judge ad spend against revenue, use the <a href="/roas-calculator">ROAS calculator</a>.</p>`
    },
    {
      h2: 'How many more sales would a higher conversion rate bring?',
      html: `<p>Multiply your traffic by the rate difference. At 12,500 visitors, going from 2.4% to 3.0% adds 12,500 × 0.6% = 75 conversions. At $80 each, that is $6,000 more revenue with no extra ad spend. Enter a target rate above to see this for your numbers.</p>
<p>Be careful with small samples. A jump from 10 to 15 conversions on 500 visits looks like a 50% lift but is well within normal random variation. Wait for a few hundred conversions per version before declaring a winner.</p>`
    }
  ],
  faq: [
    { q: 'What does CVR mean?', a: 'CVR stands for conversion rate: the percentage of visitors, sessions or clicks that complete a goal such as a purchase or sign-up.' },
    { q: 'How do you calculate conversion rate percentage?', a: 'Conversion rate = conversions ÷ visitors × 100. 300 orders from 12,500 visitors is 300 ÷ 12,500 × 100 = 2.40%.' },
    { q: 'How do you calculate conversion rate in Excel?', a: 'Put conversions in A2 and visitors in B2, then use =A2/B2 and format the cell as a percentage. For a total across rows, use =SUM(A2:A20)/SUM(B2:B20), not the average of the row percentages.' },
    { q: 'Can a conversion rate be over 100%?', a: 'Only if you count more than one conversion per visitor, for example several purchases in one session or every form fill. Limit it to one conversion per session or user to keep the rate at or below 100%.' },
    { q: 'What is the difference between conversion rate and click-through rate?', a: 'Click-through rate (CTR) is clicks divided by impressions: how many people who saw an ad clicked it. Conversion rate is conversions divided by clicks or visits: how many of those who arrived took the action.' },
    { q: 'How do I calculate a lead-to-customer conversion rate?', a: 'Divide new customers by leads in the same cohort. 18 customers from 240 leads is a 7.5% lead-to-customer rate. Multiply stage rates together for a full-funnel rate.' },
    { q: 'How do I calculate relative lift between two conversion rates?', a: 'Divide the new rate by the old rate and subtract 1. Moving from 3.0% to 4.0% is a 33.3% relative lift, or 1 percentage point in absolute terms.' }
  ],
  related: ['roas-calculator', 'clv-calculator', 'tam-sam-som-calculator', 'percentage-calculator', 'percentage-change-calculator'],
  sources: [
    { name: 'Google Ads Help: Conversion rate definition', url: 'https://support.google.com/google-ads/answer/2684489' },
    { name: 'Google Ads Help: Key event, conversion and purchase definition', url: 'https://support.google.com/google-ads/answer/6365' },
    { name: 'Google Analytics Help: About key events', url: 'https://support.google.com/analytics/answer/9267568' }
  ]
};
