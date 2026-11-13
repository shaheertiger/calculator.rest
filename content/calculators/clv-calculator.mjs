export default {
  slug: 'clv-calculator',
  hub: 'business',
  name: 'Customer Lifetime Value Calculator',
  title: 'CLV Calculator: $60 Orders, 4 a Year for 3 Years = $360 Profit',
  h1: 'Customer Lifetime Value Calculator: Repeat-Purchase and Churn-Based CLV',
  meta: 'A customer who spends $60 four times a year for 3 years at a 50% margin is worth $360 in gross profit. Get CLV, LTV:CAC and CAC payback, or use monthly churn.',
  keyword: 'how to calculate clv',
  also: ['how to calculate cltv', 'how do you calculate customer lifetime value', 'customer lifetime value calculator', 'ltv calculator', 'how to calculate cac payback', 'ltv to cac ratio'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Business model', type: 'select', value: 'simple', wide: true, options: [['simple', 'Repeat purchases (order value × frequency × lifespan)'], ['churn', 'Subscription (monthly revenue and churn rate)']] },
    { id: 'aov', label: 'Average order value', type: 'number', value: 60, prefix: '$', showIf: { method: ['simple'] } },
    { id: 'freq', label: 'Purchases per customer per year', type: 'number', value: 4, showIf: { method: ['simple'] } },
    { id: 'life', label: 'Average customer lifespan', type: 'number', value: 3, suffix: 'years', showIf: { method: ['simple'] } },
    { id: 'arpu', label: 'Average revenue per customer per month', type: 'number', value: 50, prefix: '$', showIf: { method: ['churn'] } },
    { id: 'churn', label: 'Monthly churn rate', type: 'number', value: 4, suffix: '%', showIf: { method: ['churn'] }, help: 'Share of customers who cancel each month.' },
    { id: 'margin', label: 'Gross margin', type: 'number', value: 50, suffix: '%', help: 'Revenue minus the direct cost to serve each customer.' },
    { id: 'disc', label: 'Annual discount rate (optional)', type: 'number', value: '', suffix: '%', placeholder: '0', help: 'Values future profit in today\'s dollars.' },
    { id: 'cac', label: 'Customer acquisition cost (optional)', type: 'number', value: 90, prefix: '$' }
  ],
  compute(v, H) {
    var m = v.margin / 100;
    if (!(m > 0 && m <= 1)) return { error: 'Enter a gross margin between 1% and 100%.' };
    var d = v.disc > 0 ? v.disc / 100 : 0, clv, rev, monthlyGP, expr, life;
    if (v.method === 'churn') {
      var c = v.churn / 100;
      if (!(v.arpu > 0)) return { error: 'Enter average monthly revenue per customer.' };
      if (!(c > 0 && c < 1)) return { error: 'Enter a monthly churn rate between 0.1% and 99%.' };
      var i = Math.pow(1 + d, 1 / 12) - 1;
      monthlyGP = v.arpu * m; life = 1 / c;
      clv = monthlyGP * (1 + i) / (i + c);
      rev = v.arpu * (1 + i) / (i + c);
      expr = H.money(monthlyGP) + ' ÷ ' + H.num(v.churn, 2) + '%' + (d ? ' (discounted)' : '');
    } else {
      if (!(v.aov > 0) || !(v.freq > 0) || !(v.life > 0)) return { error: 'Enter order value, purchases per year and lifespan.' };
      var annualGP = v.aov * v.freq * m;
      monthlyGP = annualGP / 12; life = v.life * 12;
      var f = d ? H.pvAnn(d, v.life, 1) / v.life : 1;
      clv = annualGP * v.life * f;
      rev = v.aov * v.freq * v.life * f;
      expr = H.money0(v.aov) + ' × ' + H.num(v.freq, 2) + ' × ' + H.num(v.life, 2) + ' yrs × ' + H.num(v.margin, 2) + '%' + (d ? ' (discounted)' : '');
    }
    var rows = [
      ['Lifetime revenue', H.money(rev)],
      ['Gross profit per month', H.money(monthlyGP)],
      ['Expected customer lifetime', H.ym(life)]
    ];
    var sub = 'Gross profit one average customer generates over the relationship' + (d ? ', in today\'s dollars.' : '.');
    if (v.cac > 0) {
      var ratio = clv / v.cac, pay = v.cac / monthlyGP;
      rows.unshift(['LTV:CAC ratio', H.fix(ratio, 1) + ' : 1', true]);
      rows.push(['CAC payback', H.fix(pay, 1) + ' months']);
      sub = ratio >= 3 ? 'At ' + H.fix(ratio, 1) + ':1, each customer returns well over their acquisition cost; there may be room to spend more on growth.'
        : ratio >= 1 ? 'Each customer repays their acquisition cost, but at ' + H.fix(ratio, 1) + ':1 the cushion for overhead and profit is thin.'
        : 'Customers are worth less than they cost to acquire: lower CAC, raise retention or raise margins.';
    }
    return { value: H.money(clv, clv >= 1000 ? 0 : 2), label: 'Customer lifetime value (gross profit)', expr: expr, rows: rows, sub: sub, clv: clv, life: life };
  },
  quick: ({ r }) => `To calculate CLV, multiply average order value × purchases per year × customer lifespan × gross margin. A customer who spends <strong>$60</strong> four times a year for three years generates $720 in revenue; at a 50% margin that is <strong>${r.value}</strong> of lifetime gross profit. If acquiring that customer costs $90, the LTV:CAC ratio is 4.0:1 and the cost is earned back in 9 months.`,
  stepsTitle: 'How to calculate customer lifetime value',
  steps: [
    'Find <strong>average order value</strong>: revenue ÷ number of orders over the last 12 months.',
    'Find <strong>purchase frequency</strong>: orders ÷ unique customers over the same 12 months.',
    'Estimate <strong>customer lifespan</strong> in years. If you track retention, lifespan ≈ 1 ÷ annual churn rate; for subscriptions, use the monthly churn option instead.',
    'Multiply the three, then multiply by gross margin. Skipping the margin step gives revenue LTV, which overstates what a customer is worth and is the most common CLV mistake.'
  ],
  formulaTitle: 'What is the CLV formula?',
  formula: {
    expr: 'CLV = Average order value × Purchases per year × Lifespan (years) × Gross margin<br>Subscription CLV = Monthly revenue × Gross margin ÷ Monthly churn<br>LTV:CAC = CLV ÷ Customer acquisition cost<br>CAC payback (months) = CAC ÷ Monthly gross profit per customer',
    vars: [['Gross margin', 'share of revenue left after the direct cost to serve'], ['Churn', 'share of customers lost per period; expected lifetime = 1 ÷ churn'], ['CAC', 'sales and marketing spend ÷ new customers acquired']],
    note: 'With a discount rate, the subscription formula becomes m × (1 + i) ÷ (i + churn), with the first month\'s payment collected up front; Fader and Hardie\'s note "Reconciling and Clarifying CLV Formulas" explains why textbook versions differ on this timing.'
  },
  example: `<p>A specialty coffee roaster's average order is $60, customers order 4 times a year, and the typical customer stays 3 years. Beans, packaging and shipping eat half of revenue, so gross margin is 50%.</p>
<p>Lifetime revenue = $60 × 4 × 3 = <strong>$720</strong>. CLV = $720 × 50% = <strong>$360</strong>.</p>
<p>The roaster spends $90 in ads per new customer. LTV:CAC = $360 ÷ $90 = <strong>4.0:1</strong>. Monthly gross profit per customer = $60 × 4 × 50% ÷ 12 = $10, so CAC payback = $90 ÷ $10 = <strong>9 months</strong>.</p>`,
  table: {
    title: 'How does churn change customer lifetime value?',
    intro: 'Subscription CLV at $50 a month and an 80% gross margin ($40 of monthly gross profit) for different monthly churn rates, computed with the calculator (no discounting).',
    head: ['Monthly churn', 'Annual retention', 'Expected lifetime', 'CLV (gross profit)'],
    rows: ({ run, H }) => [1, 2, 3, 4, 5, 7, 10, 15].map(c => { const r = run({ method: 'churn', arpu: 50, margin: 80, churn: c, disc: NaN, cac: NaN }); return [c + '%', H.pct(Math.pow(1 - c / 100, 12) * 100, 1), H.num(r.life, 1) + ' months', H.money(r.clv, 2)]; }),
    note: 'Halving churn doubles lifetime value: going from 4% to 2% a month raises CLV from $1,000 to $2,000 without adding a single customer.'
  },
  sections: [
    {
      h2: 'How do you calculate CLV for a subscription business?',
      html: `<p>Use churn instead of a lifespan guess. Expected customer lifetime is 1 ÷ churn rate, so a 4% monthly churn means customers stay 25 months on average. CLV = monthly revenue × gross margin ÷ monthly churn. At $50 a month and an 80% margin, that is $40 ÷ 0.04 = <strong>$1,000</strong>.</p>
<p>Monthly and annual churn are not interchangeable: 4% a month means keeping 0.96<sup>12</sup> = 61.3% of customers after a year, an annual churn of 38.7%, not 48%. Calculate churn from customers lost during a month divided by customers at the start of that month, and leave new sign-ups out of the denominator.</p>`
    },
    {
      h2: 'What is a good LTV to CAC ratio?',
      html: `<p>A ratio of about <strong>3:1</strong> is a widely used rule of thumb, particularly among subscription and software companies: each customer brings three times their acquisition cost in gross profit, leaving room for overhead and profit. Below 1:1 you lose money on every new customer. Well above 5:1 can mean you are under-investing in growth.</p>
<p>Treat the ratio as a guide, not a rule. A 3:1 ratio earned over seven years ties up far more cash than the same ratio earned in two, which is why CAC payback matters too. Blended CAC (all marketing spend ÷ all new customers) also hides channels that are far less efficient; the <a href="/roas-calculator">ROAS calculator</a> breaks ad performance down by channel.</p>`
    },
    {
      h2: 'How do you calculate CAC payback?',
      html: `<p>CAC payback = customer acquisition cost ÷ monthly gross profit per customer. With a $90 CAC and $10 of monthly gross profit, it takes <strong>9 months</strong> to earn back the cost of winning the customer. For a subscription at $50 a month and an 80% margin, a $400 CAC pays back in $400 ÷ $40 = 10 months.</p>
<p>Shorter payback means growth funds itself sooner. If customers churn faster than the payback period, you never recover the acquisition cost, however good the lifetime math looks on paper. (For the payback of a capital investment rather than a customer, use the <a href="/payback-period-calculator">payback period calculator</a>.)</p>`
    },
    {
      h2: 'Should CLV use revenue or profit?',
      html: `<p>Profit. Revenue LTV ($720 in the example) answers "how much will this customer spend?", but only gross profit ($360) can pay for acquisition and overhead. Comparing revenue LTV with CAC makes marketing look twice as efficient as it is at a 50% margin.</p>
<p>Two refinements make CLV more realistic: <strong>discounting</strong>, because a dollar in year three is worth less than a dollar today (enter a rate above), and <strong>cohorts</strong>, measuring CLV separately for customers acquired in each month or channel, because averages hide that some groups stay far longer than others.</p>`
    }
  ],
  faq: [
    { q: 'Are CLV, CLTV and LTV the same thing?', a: 'Yes. CLV and CLTV both abbreviate customer lifetime value, and LTV is short for lifetime value. All three name the same measure: the total value, usually gross profit, a customer brings over the relationship.' },
    { q: 'How do I estimate customer lifespan?', a: 'Divide 1 by your churn rate. If you lose 25% of customers a year, the average lifespan is 1 ÷ 0.25 = 4 years. Without churn data, use the average time between first and last purchase for customers who have stopped buying.' },
    { q: 'How do you calculate CLV in Excel?', a: 'With order value in B1, purchases per year in B2, lifespan in B3 and margin in B4, use =B1*B2*B3*B4. For subscriptions, with monthly revenue in B1, margin in B2 and monthly churn in B3, use =B1*B2/B3.' },
    { q: 'What is a good customer lifetime value?', a: 'There is no universal figure; CLV only means something next to acquisition cost. A $360 CLV is excellent if customers cost $50 to acquire and a problem if they cost $400.' },
    { q: 'How can I increase customer lifetime value?', a: 'Raise any input: average order value (bundles, upsells), purchase frequency (subscriptions, reminders, loyalty programs), lifespan (better onboarding and service), or margin (pricing, lower cost to serve). Reducing churn usually has the biggest effect.' },
    { q: 'Should CLV include the first purchase?', a: 'Yes, for comparing with acquisition cost, since the first order\'s profit helps repay CAC. Some teams also track residual CLV (future value excluding purchases already made) when deciding how much to spend on retention.' }
  ],
  related: ['roas-calculator', 'conversion-rate-calculator', 'profit-margin-calculator', 'payback-period-calculator', 'business-valuation-calculator'],
  sources: [
    { name: 'Fader & Hardie: Reconciling and Clarifying CLV Formulas (technical note)', url: 'https://www.brucehardie.com/notes/024/' },
    { name: 'Fader & Hardie (Wharton, London Business School): How to Project Customer Retention', url: 'https://www.brucehardie.com/papers/021/' },
    { name: 'Google Analytics Help: [GA4] Predictive metrics (purchase and churn probability)', url: 'https://support.google.com/analytics/answer/9846734' }
  ]
};
