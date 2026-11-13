export default {
  slug: 'ltv-calculator',
  hub: 'mortgage',
  name: 'LTV & CLTV Calculator',
  title: 'CLTV Calculator: $330,000 Owed on a $400,000 Home Is 82.5%',
  h1: 'Loan-to-Value Calculator: LTV, CLTV and HCLTV in One Place',
  meta: 'A $300,000 first mortgage plus a $30,000 HELOC balance on a $400,000 home is 75% LTV and 82.5% CLTV. See your equity, PMI status and borrowing room.',
  keyword: 'how to calculate cltv',
  also: ['ltv calculator', 'loan to value calculator', 'cltv calculator', 'how much can i borrow home equity loan calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'value', label: 'Home value (appraised or price, whichever is lower)', type: 'number', value: 400000, prefix: '$', wide: true },
    { id: 'first', label: 'First mortgage balance', type: 'number', value: 300000, prefix: '$' },
    { id: 'second', label: 'Second mortgage / HELOC balance owed', type: 'number', value: 30000, prefix: '$' },
    { id: 'line', label: 'HELOC credit limit (if any)', type: 'number', value: 50000, prefix: '$', help: 'Used for HCLTV, which counts the full line even if undrawn.' },
    { id: 'limit', label: 'Lender CLTV limit for new borrowing', type: 'number', value: 85, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.value > 0)) return { error: 'Enter the home value.' };
    var first = v.first > 0 ? v.first : 0, second = v.second > 0 ? v.second : 0, line = v.line > 0 ? v.line : 0;
    if (line > 0 && second > line) return { error: 'The HELOC balance cannot be higher than its credit limit.' };
    var ltv = first / v.value * 100;
    var cltv = (first + second) / v.value * 100;
    var hcltv = (first + Math.max(second, line)) / v.value * 100;
    var equity = v.value - first - second;
    var lim = v.limit > 0 ? v.limit : 80;
    var room = v.value * lim / 100 - first - Math.max(second, line);
    var pmi = ltv > 80 ? 'Likely required on a conventional first mortgage (LTV above 80%)' : ltv > 78 ? 'Can be cancelled on request at 80% of original value; ends automatically at 78%' : 'Not needed on a conventional loan at this LTV';
    var rows = [
      ['LTV (first mortgage only)', H.pct(ltv, 2), true],
      ['HCLTV (full HELOC line)', H.pct(hcltv, 2)],
      ['Home equity', H.money0(equity) + ' (' + H.pct(equity / v.value * 100, 1) + ')'],
      ['Room to borrow at ' + H.num(lim, 1) + '% CLTV', room > 0 ? H.money0(room) : 'none (' + H.money0(-room) + ' over)'],
      ['To reach 80% LTV, pay down', ltv > 80 ? H.money0(first - v.value * 0.8) : 'already at or below 80%'],
      ['PMI', pmi]
    ];
    return {
      value: H.pct(cltv, 2),
      label: 'Combined loan-to-value (CLTV)',
      expr: '(' + H.money0(first) + ' + ' + H.money0(second) + ') ÷ ' + H.money0(v.value),
      rows: rows,
      sub: cltv <= 80 ? 'At or under 80% CLTV most lenders will offer home equity credit on their best terms.' : cltv <= 90 ? 'Between 80% and 90% CLTV: home equity lenders still lend, but fewer of them and at higher rates.' : 'Above 90% CLTV, little equity is left to borrow against and a refinance may be hard to qualify for.'
    };
  },
  quick: ({ r }) => `To calculate CLTV, add every loan secured by the home and divide by its value. A <strong>$300,000</strong> first mortgage plus a <strong>$30,000</strong> HELOC balance on a $400,000 home is $330,000 ÷ $400,000 = <strong>${r.value} CLTV</strong>. The first mortgage alone is ${r.rows[0][1]} LTV, and counting the full $50,000 credit line gives an HCLTV of ${r.rows[1][1]}.`,
  stepsTitle: 'How to calculate LTV and CLTV',
  steps: [
    'Find the home\'s value. On a purchase lenders use the lower of the price and the appraisal; on a refinance or home equity loan they use the new appraisal. Using a hopeful online estimate is the usual reason a real LTV comes in higher.',
    'Divide the first mortgage balance by the value for LTV.',
    'Add the balances of every other loan secured by the home (home equity loan, the drawn HELOC balance, any second mortgage) to the first mortgage and divide by the value for CLTV.',
    'For HCLTV, use the full HELOC credit limit instead of the drawn balance. Fannie Mae requires that CLTV never exceeds HCLTV.'
  ],
  formulaTitle: 'What are the LTV, CLTV and HCLTV formulas?',
  formula: {
    expr: 'LTV = first mortgage ÷ value × 100<br>CLTV = (first mortgage + all other lien balances) ÷ value × 100<br>HCLTV = (first mortgage + full HELOC limit + other liens) ÷ value × 100',
    vars: [['value', 'lower of sales price or appraised value (appraisal alone for refinances)'], ['other liens', 'home equity loans, drawn HELOC balance, second mortgages'], ['full HELOC limit', 'the line amount whether or not you have drawn it']]
  },
  example: `<p>Home value $400,000. First mortgage $300,000. HELOC: $50,000 limit with $30,000 drawn.</p>
<p>LTV = 300,000 ÷ 400,000 = <strong>75%</strong>. CLTV = (300,000 + 30,000) ÷ 400,000 = <strong>82.5%</strong>. HCLTV = (300,000 + 50,000) ÷ 400,000 = <strong>87.5%</strong>.</p>
<p>Equity is $400,000 − $330,000 = $70,000. A lender capping total borrowing at 85% would allow $340,000 of liens. Counting the HELOC at its full $50,000 limit puts liens at $350,000, $10,000 over, so no new credit is available unless the line is reduced. Measured on balances alone there would be $10,000 of room, which is why the two ratios matter.</p>`,
  table: {
    title: 'What LTV does each down payment give you?',
    intro: 'LTV on a $400,000 purchase at common down payments, computed by the calculator.',
    head: ['Down payment', 'Cash down', 'Loan amount', 'LTV', 'Conventional PMI?'],
    rows: ({ run, H }) => [3, 3.5, 5, 10, 15, 20, 25, 30].map(d => {
      const loan = 400000 * (1 - d / 100), o = run({ value: 400000, first: loan, second: 0, line: 0 });
      return [d + '%', H.money0(400000 * d / 100), H.money0(loan), o.rows[0][1], d >= 20 ? 'No' : 'Yes'];
    }),
    note: 'FHA loans start at 96.5% LTV (3.5% down) and carry mortgage insurance regardless of LTV; VA loans can be 100% LTV with no monthly mortgage insurance.'
  },
  sections: [
    {
      h2: 'What is the difference between LTV, CLTV and HCLTV?',
      html: `<p><strong>LTV</strong> looks only at the first mortgage and decides whether you pay mortgage insurance and how your rate is priced. <strong>CLTV</strong> adds every other loan against the house, using what you actually owe, and is what home equity lenders and refinance underwriters cap. <strong>HCLTV</strong> treats a HELOC as if fully drawn, because you could borrow the rest at any time; Fannie Mae uses it whenever a HELOC sits behind the first mortgage.</p>
<p>The three are equal when you have only one mortgage. They split apart once you add a second lien: in the example, 75%, 82.5% and 87.5%.</p>`
    },
    {
      h2: 'What LTV do you need to avoid PMI?',
      html: `<p>80% or lower on a conventional loan, which means 20% down on a purchase. Above 80% the lender requires private mortgage insurance. Under the Homeowners Protection Act you can ask to cancel it when the balance is scheduled to reach 80% of the home's <em>original</em> value, and it must end automatically at 78%, provided you are current on payments.</p>
<p>If the home has risen in value, a new appraisal may let you drop PMI sooner, but servicers usually set stricter rules for current-value removal, such as a lower LTV or a minimum number of years since closing. FHA mortgage insurance follows its own rules and, with under 10% down, lasts for the life of the loan unless you refinance.</p>`
    },
    {
      h2: 'How much can I borrow against my house?',
      html: `<p>Multiply the value by the lender's CLTV limit and subtract what you owe. Home equity loans and HELOCs are commonly capped at 80% to 90% CLTV. A conventional cash-out refinance on a one-unit primary home is limited to 80% LTV, FHA cash-out also to 80%, and VA cash-out loans can go higher.</p>
<div class="twrap"><table><thead><tr><th>Home value</th><th>Owed</th><th>Max liens at 80%</th><th>Available at 80%</th><th>Available at 85%</th></tr></thead><tbody>
<tr><td>$300,000</td><td>$180,000</td><td>$240,000</td><td>$60,000</td><td>$75,000</td></tr>
<tr><td>$400,000</td><td>$250,000</td><td>$320,000</td><td>$70,000</td><td>$90,000</td></tr>
<tr><td>$500,000</td><td>$350,000</td><td>$400,000</td><td>$50,000</td><td>$75,000</td></tr>
<tr><td>$750,000</td><td>$400,000</td><td>$600,000</td><td>$200,000</td><td>$237,500</td></tr>
</tbody></table></div>
<p>The <a href="/heloc-payment-calculator">HELOC payment calculator</a> shows what the borrowed amount would cost each month.</p>`
    },
    {
      h2: 'How does LTV affect your mortgage rate?',
      html: `<p>Higher LTV means less of your own money at risk, so lenders charge more. Fannie Mae and Freddie Mac apply loan-level price adjustments that rise with LTV and fall with credit score, and those costs show up as a higher rate or points. The biggest price steps usually come at 80%, 90% and 95% LTV, so stretching from 9% down to 10% or from 19% to 20% can save more than the extra cash suggests. Cash-out refinances and second homes add further adjustments at the same LTV.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate loan-to-value ratio?', a: 'Divide the loan amount by the home\'s value and multiply by 100. A $320,000 loan on a $400,000 home is an 80% LTV.' },
    { q: 'Is 80% LTV good?', a: 'Yes. 80% is the threshold where conventional loans no longer need PMI and where pricing improves noticeably. Most home equity lenders also use 80% to 85% CLTV as their limit.' },
    { q: 'What is the maximum LTV for conventional, FHA and VA loans?', a: 'Conventional loans go up to 97% LTV for eligible buyers, FHA to 96.5% (plus financed upfront MIP), and VA to 100% (plus a financed funding fee). Jumbo loans are often capped at 80% to 90%.' },
    { q: 'Does LTV use the purchase price or the appraisal?', a: 'On a purchase, the lower of the two. If you offer $410,000 and the home appraises at $400,000, your LTV is based on $400,000 and you need more cash to keep the same loan-to-value.' },
    { q: 'What CLTV do I need for a HELOC?', a: 'Most lenders want the first mortgage plus the full HELOC line at or under 80% to 85% of the home\'s value; some go to 90% for strong credit.' },
    { q: 'How can I lower my LTV?', a: 'Pay down principal, make a larger down payment, or wait for the home to appreciate and get a new appraisal. Home improvements raise value only if the appraiser sees them in comparable sales.' }
  ],
  related: ['heloc-payment-calculator', 'house-affordability-calculator', 'refinance-calculator', 'mortgage-calculator', 'dti-calculator'],
  sources: [
    { name: 'CFPB: What is a loan-to-value ratio and how does it relate to my costs?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-to-value-ratio-and-how-does-it-relate-to-my-costs-en-121/' },
    { name: 'Fannie Mae Selling Guide B2-1.2-02: Combined Loan-to-Value (CLTV) Ratios', url: 'https://selling-guide.fanniemae.com/sel/b2-1.2-02/combined-loan-value-cltv-ratios' },
    { name: 'Fannie Mae Selling Guide B2-1.2-03: Home Equity Combined Loan-to-Value (HCLTV) Ratios', url: 'https://selling-guide.fanniemae.com/sel/b2-1.2-03/home-equity-combined-loan-value-hcltv-ratios' },
    { name: 'CFPB: When can I remove private mortgage insurance (PMI)?', url: 'https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/' }
  ]
};
