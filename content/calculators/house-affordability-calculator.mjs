export default {
  slug: 'house-affordability-calculator',
  hub: 'mortgage',
  name: 'How Much House Can I Afford Calculator',
  title: 'How Much House Can I Afford Calculator: $100K Buys $311K',
  h1: 'Home Affordability Calculator: Find Your Maximum Home Price',
  meta: 'On a $100,000 salary with $500 of monthly debts and $40,000 down at 7%, the 28/36 rule puts your price limit near $311,300. Run your own income and debts.',
  keyword: 'how much house can i afford calculator',
  also: ['how much can i afford mortgage calculator', 'how much can i afford mortgage payment calculator', 'what can we afford mortgage calculator', 'how much can i lend mortgage calculator', 'how to calculate what mortgage i can afford', 'how much can we afford calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'income', label: 'Annual household income (before tax)', type: 'number', value: 100000, prefix: '$', help: 'Gross pay for everyone who will be on the loan.' },
    { id: 'debts', label: 'Monthly debt payments', type: 'number', value: 500, prefix: '$', help: 'Car, student loan, card minimums, child support. Not rent or utilities.' },
    { id: 'down', label: 'Down payment', type: 'number', value: 40000, prefix: '$' },
    { id: 'rate', label: 'Mortgage interest rate', type: 'number', value: 7, suffix: '%' },
    { id: 'term', label: 'Loan term', type: 'select', value: '30', options: [['30', '30 years'], ['20', '20 years'], ['15', '15 years']] },
    { id: 'taxRate', label: 'Property tax', type: 'number', value: 1.1, suffix: '% of price / yr' },
    { id: 'insRate', label: 'Homeowners insurance', type: 'number', value: 0.5, suffix: '% of price / yr', help: '0.5% is $2,000 a year on a $400,000 home. Use your quote if you have one.' },
    { id: 'pmi', label: 'PMI rate (if under 20% down)', type: 'number', value: 0.5, suffix: '% of loan / yr' },
    { id: 'hoa', label: 'HOA dues', type: 'number', value: 0, prefix: '$', suffix: '/ mo' },
    { id: 'budget', label: 'Budget rule', type: 'select', value: 'c', options: [['c', 'Conservative: 28% housing / 36% total debt'], ['m', 'Moderate: 31% / 43% (FHA benchmark)'], ['s', 'Stretch: 45% total debt, no housing cap']], wide: true }
  ],
  compute(v, H) {
    if (!(v.income > 0)) return { error: 'Enter your annual household income.' };
    if (!(v.rate >= 0 && v.rate < 30)) return { error: 'Enter an interest rate between 0% and 30%.' };
    var debts = v.debts > 0 ? v.debts : 0;
    var down = v.down > 0 ? v.down : 0;
    var hoa = v.hoa > 0 ? v.hoa : 0;
    var tax = v.taxRate > 0 ? v.taxRate / 100 : 0;
    var ins = v.insRate > 0 ? v.insRate / 100 : 0;
    var pmiRate = v.pmi > 0 ? v.pmi / 100 : 0;
    var n = (Number(v.term) || 30) * 12, r = v.rate / 100 / 12;
    var M = v.income / 12;
    var rules = { c: [0.28, 0.36, 'Conservative 28/36'], m: [0.31, 0.43, 'Moderate 31/43'], s: [10, 0.45, 'Stretch 45%'] };
    function cost(P) {
      var L = Math.max(0, P - down);
      var pi = L > 0 ? H.pmt(r, n, L) : 0;
      var pm = (L > 0 && L / P > 0.8) ? L * pmiRate / 12 : 0;
      var t = P * tax / 12, i = P * ins / 12;
      return { L: L, pi: pi, t: t, i: i, pm: pm, total: pi + t + i + pm + hoa };
    }
    function maxPrice(key, d) {
      var f = rules[key][0], b = rules[key][1];
      var cap = Math.min(f * M, b * M - d);
      if (!(cap > 0) || cost(down).total > cap) return { cap: cap, P: NaN, front: f * M < b * M - d };
      var lo = down, hi = down + 1000;
      while (cost(hi).total <= cap && hi < 1e10) hi *= 2;
      for (var k = 0; k < 200; k++) { var mid = (lo + hi) / 2; if (cost(mid).total <= cap) lo = mid; else hi = mid; }
      return { cap: cap, P: Math.max(down, Math.floor(lo / 100) * 100), front: f * M < b * M - d };
    }
    var key = rules[v.budget] ? v.budget : 'c';
    var res = maxPrice(key, debts);
    if (!(res.P > 0)) return { error: 'At this income and debt level the ' + rules[key][2] + ' rule leaves no room for a housing payment. Try a lower debt figure or the stretch budget.' };
    var c = cost(res.P);
    var rows = [
      ['Monthly payment', H.money(c.total), true],
      ['Principal and interest', H.money(c.pi)],
      ['Property tax', H.money(c.t)],
      ['Homeowners insurance', H.money(c.i)]
    ];
    if (c.pm > 0) rows.push(['PMI', H.money(c.pm)]);
    if (hoa > 0) rows.push(['HOA dues', H.money(hoa)]);
    rows.push(['Loan amount', H.money0(c.L)]);
    rows.push(['Down payment share', H.pct(down / res.P * 100, 1)]);
    rows.push(['Housing ratio (front-end)', H.pct(c.total / M * 100, 1)]);
    rows.push(['Total debt ratio (back-end)', H.pct((c.total + debts) / M * 100, 1)]);
    ['c', 'm', 's'].forEach(function (k) {
      if (k === key) return;
      var o = maxPrice(k, debts);
      rows.push([rules[k][2] + ' budget', o.P > 0 ? H.money0(o.P) : 'no room', true]);
    });
    var sub;
    if (key !== 's' && res.front) {
      sub = 'Your ' + Math.round(rules[key][0] * 100) + '% housing limit (' + H.money0(res.cap) + '/mo) is the tighter rule here, so paying down other debts would not raise this budget; a bigger down payment or lower rate would.';
    } else {
      var less = maxPrice(key, Math.max(0, debts - 100));
      sub = 'Your existing debts are the limiting factor. Each $100 a month of debt you clear adds about ' + H.money0(Math.max(0, less.P - res.P)) + ' to this budget.';
    }
    return {
      value: H.money0(res.P),
      label: 'Home price you can afford (' + rules[key][2] + ')',
      expr: 'max payment ' + H.money0(res.cap) + '/mo at ' + H.num(v.rate, 3) + '%',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `On a <strong>$100,000</strong> household income with $500 a month in other debts, $40,000 down and a 7% 30-year rate, you can afford a home of about <strong>${r.value}</strong> under the 28/36 rule. That keeps the full payment, ${r.rows[0][1]} including tax, insurance and PMI, at 28% of gross monthly pay. A stretch 45% budget raises the ceiling to ${r.rows[r.rows.length - 1][1]}.`,
  stepsTitle: 'How to work out how much house you can afford',
  steps: [
    'Enter <strong>gross</strong> annual income for everyone who will sign the loan. Lenders qualify you on pre-tax pay; self-employed buyers are usually averaged over two years of tax returns.',
    'Add the monthly payments that appear on your credit report: car loans, student loans, credit card minimums, personal loans, plus child support or alimony. The mistake most people make is including their current rent, which disappears when you buy, or forgetting a deferred student loan, which lenders still count.',
    'Enter the cash you will put down, after setting aside closing costs (commonly 2% to 5% of the price) and an emergency fund.',
    'Set the rate, term, local property tax rate, an insurance estimate and any HOA dues. Tax and insurance scale with the price, so they shrink your budget more than people expect.',
    'Pick a budget rule. Conservative 28/36 is what most planners recommend; the stretch figure is closer to the most a lender may approve.'
  ],
  formulaTitle: 'How is home affordability calculated?',
  formula: {
    expr: 'Max housing payment = min(28% × monthly income, 36% × monthly income − monthly debts)<br>Payment(price) = P&amp;I on (price − down payment) + tax + insurance + PMI + HOA<br>Max price = the highest price whose payment fits under the max housing payment',
    vars: [['28% (front-end)', 'share of gross monthly income for the whole housing payment'], ['36% (back-end)', 'share of gross monthly income for housing plus all other debts'], ['P&amp;I', 'principal and interest: loan × r ÷ (1 − (1 + r)<sup>−n</sup>), r = annual rate ÷ 12, n = months'], ['PMI', 'private mortgage insurance, charged here only while the loan is above 80% of the price']],
    note: 'The calculator searches for the price where the payment exactly meets your limit, then rounds down to the nearest $100. The moderate rule uses 31%/43% and the stretch rule uses a single 45% total-debt cap.'
  },
  example: `<p>Income is $100,000 a year, or <strong>$8,333.33</strong> a month. Other debts are $500 a month.</p>
<p>Housing limit at 28%: $8,333.33 × 0.28 = <strong>$2,333.33</strong>. Total-debt limit at 36%: $8,333.33 × 0.36 − $500 = <strong>$2,500.00</strong>. The lower figure, $2,333.33, is the most the full house payment can be.</p>
<p>At a <strong>$311,300</strong> price with $40,000 down, the loan is $271,300. At 7% for 30 years the principal and interest is $1,804.97, property tax at 1.1% is $285.36, insurance at 0.5% is $129.71 and PMI at 0.5% of the loan is $113.04, for a total of <strong>$2,333.07</strong>, just under the limit.</p>
<p>That payment is 28.0% of gross income and, with the $500 of debts added, 34.0% back-end, inside both halves of the 28/36 rule.</p>`,
  table: {
    title: 'How much house can I afford on my salary?',
    intro: 'Maximum home price by household income, computed by the calculator above with $500 a month of other debts, $40,000 down, a 7% 30-year rate, 1.1% property tax, 0.5% insurance and 0.5% PMI.',
    head: ['Annual income', 'Conservative 28/36', 'Monthly payment', 'Stretch 45%', 'Price ÷ income'],
    rows: ({ run, H }) => [40000, 50000, 60000, 75000, 90000, 100000, 125000, 150000, 200000, 250000].map(inc => {
      const c = run({ income: inc, budget: 'c' }), s = run({ income: inc, budget: 's' });
      const p = Number(String(c.value).replace(/[^0-9.]/g, ''));
      return [H.money0(inc), c.value || '—', c.rows ? c.rows[0][1] : '—', s.value || '—', p ? H.fix(p / inc, 1) + '×' : '—'];
    }),
    note: 'Down payment is held at $40,000 in every row, so lower incomes get a bigger boost from it. Higher incomes start to hit the 28% housing cap rather than the debt cap, which is why the conservative column grows in a straight line.'
  },
  sections: [
    {
      h2: 'What is the 28/36 rule for buying a house?',
      html: `<p>The 28/36 rule says your total housing payment should be no more than <strong>28%</strong> of gross monthly income, and housing plus every other debt payment no more than <strong>36%</strong>. The housing payment means everything the lender collects or counts: principal, interest, property tax, homeowners insurance, mortgage insurance and HOA dues, often shortened to PITI.</p>
<p>It is a planning guideline, not a law. It started as a conventional-loan underwriting standard, and many planners still treat it as the comfortable ceiling. Both limits matter: whichever produces the smaller payment wins. With $8,333 of monthly income and no other debts, 28% ($2,333) is the binding limit; add a $900 car payment and 36% leaves only $2,100 for housing.</p>
<p>A shortcut many buyers search for is "how much house can I afford based on salary." At 7% with about 13% down, the 28/36 rule works out to roughly <strong>3 times gross income</strong> for a buyer with modest debts, as the price ÷ income column above shows. When rates were near 3% in 2021, the same inputs allowed about $422,100, or 4.2 times income, which is why older rules of thumb now overstate budgets.</p>`
    },
    {
      h2: 'How much house can I afford with an FHA, VA or conventional loan?',
      html: `<p>Each loan program sets its own debt-to-income (DTI) limits, and lenders can go higher with automated approval and strong compensating factors such as cash reserves or a high credit score.</p>
<div class="twrap"><table><thead><tr><th>Loan type</th><th>Typical DTI limits</th><th>Minimum down</th><th>Mortgage insurance</th></tr></thead><tbody>
<tr><td>Conventional (Fannie Mae)</td><td>36% total for manual underwriting, up to 45% with credit and reserve requirements, up to 50% through Desktop Underwriter; no separate housing ratio</td><td>3% for some first-time buyer programs, 5% otherwise</td><td>PMI until the loan reaches 78–80% of the original value</td></tr>
<tr><td>FHA</td><td>31% housing / 43% total benchmark for manual underwriting; higher with compensating factors or automated approval</td><td>3.5% with a 580+ credit score</td><td>1.75% upfront plus annual MIP (0.55% for most 30-year loans with less than 5% down)</td></tr>
<tr><td>VA</td><td>41% total guideline, plus a residual-income test based on family size and region</td><td>None</td><td>No monthly insurance; a funding fee of 2.15% on first use with under 5% down</td></tr>
<tr><td>USDA</td><td>29% housing / 41% total</td><td>None (eligible rural areas, income limits apply)</td><td>Upfront and annual guarantee fees</td></tr>
</tbody></table></div>
<p>The moderate setting above uses FHA's 31/43 benchmark. For a conventional loan, the amount you can borrow is also capped by the conforming loan limit, which FHFA set at <strong>$832,750</strong> for a one-unit home in most of the country for 2026, and up to $1,249,125 in high-cost counties. Bigger loans are jumbo loans with their own, usually stricter, rules.</p>`
    },
    {
      h2: 'How does the down payment change what I can afford?',
      html: `<p>Every extra dollar down raises your price limit by slightly more than a dollar at first, and by a lot at one threshold: once you reach <strong>20% down</strong>, private mortgage insurance disappears from the payment. With the default inputs above, here is how the conservative budget moves:</p>
<div class="twrap"><table><thead><tr><th>Down payment</th><th>Max price</th><th>Down %</th><th>PMI in payment</th></tr></thead><tbody>
<tr><td>$10,000</td><td>$286,000</td><td>3.5%</td><td>$115.00</td></tr>
<tr><td>$25,000</td><td>$298,700</td><td>8.4%</td><td>$114.04</td></tr>
<tr><td>$40,000</td><td>$311,300</td><td>12.8%</td><td>$113.04</td></tr>
<tr><td>$60,000</td><td>$328,100</td><td>18.3%</td><td>$111.71</td></tr>
<tr><td>$70,000</td><td>$350,000</td><td>20.0%</td><td>$0</td></tr>
<tr><td>$90,000</td><td>$367,100</td><td>24.5%</td><td>$0</td></tr>
</tbody></table></div>
<p>Look at the step from $60,000 to $70,000: the extra $10,000 lifts the budget by $21,900, because a $350,000 home with $70,000 down hits exactly 20% and the $112 PMI charge drops out of the payment. Below and above that threshold, each $15,000 to $20,000 of extra savings adds only about $13,000 to $17,000 of house, because tax and insurance rise with the price. On a conventional loan you can ask the lender to drop PMI when the balance reaches 80% of the original value, and it must end automatically at 78% under the Homeowners Protection Act. FHA annual MIP, by contrast, usually lasts the life of the loan when you put down less than 10%.</p>`
    },
    {
      h2: 'How do interest rates change how much house I can afford?',
      html: `<p>Rates move your budget more than any other input except income. Holding the default $100,000 income, $500 of debts and $40,000 down, the conservative 28/36 price at different 30-year rates is:</p>
<div class="twrap"><table><thead><tr><th>Rate</th><th>Max price</th><th>Change vs 7%</th></tr></thead><tbody>
<tr><td>5.5%</td><td>$346,900</td><td>+$35,600</td></tr>
<tr><td>6.0%</td><td>$334,300</td><td>+$23,000</td></tr>
<tr><td>6.5%</td><td>$322,500</td><td>+$11,200</td></tr>
<tr><td>7.0%</td><td>$311,300</td><td>—</td></tr>
<tr><td>7.5%</td><td>$300,800</td><td>−$10,500</td></tr>
<tr><td>8.0%</td><td>$290,800</td><td>−$20,500</td></tr>
</tbody></table></div>
<p>As a rule of thumb, each half-point change in rate moves the price you can afford by about 3% to 4%, or roughly $10,000 to $12,000 at this income. Freddie Mac's weekly survey put the average 30-year fixed rate at 7.11% on Nov 12, 2026, but your own quote depends on credit score, down payment, points and loan type, so get a Loan Estimate from at least three lenders before trusting any number here. A 15-year term cuts total interest sharply but raises the payment, which lowers the price you can afford by about a fifth at the same income: $252,300 instead of $311,300 in the default example.</p>`
    },
    {
      h2: 'Conservative or stretch: which budget should I use?',
      html: `<p>The stretch figure is roughly what an automated underwriting system might approve for a borrower with good credit, not what is comfortable. Lenders look at gross income; you pay the mortgage from take-home pay, after taxes, retirement savings, health insurance, childcare and commuting. Try these checks before going above the conservative number:</p>
<ul>
<li><strong>Take-home test:</strong> keep the full housing payment under about a third of your net monthly pay if you also want to save for retirement.</li>
<li><strong>Maintenance:</strong> budget 1% to 2% of the home's value a year for repairs. On a $311,300 home that is $260 to $520 a month the lender never counts.</li>
<li><strong>Cash after closing:</strong> keep three to six months of expenses in savings after the down payment and closing costs. Some loans require two months of payments in reserve.</li>
<li><strong>Rate risk:</strong> on an adjustable-rate mortgage, check the payment at the first possible adjustment, not the teaser rate.</li>
</ul>
<p>If the conservative price will not buy what you need in your area, the levers that work are a larger down payment, paying off a car loan before applying (when debts are the binding limit), a co-borrower, or a lower rate through buying points or a better credit score. Use the <a href="/dti-calculator">debt-to-income calculator</a> to see which ratio is holding you back and the <a href="/mortgage-calculator">mortgage payment calculator</a> to price a specific listing.</p>`
    }
  ],
  faq: [
    { q: 'How much house can I afford on $50,000 a year?', a: 'About $158,500 with $500 of monthly debts, $40,000 down and a 7% 30-year rate under the 28/36 rule. At this income the 36% total-debt limit binds first, so clearing that $500 of debt would lift the budget to about $179,400.' },
    { q: 'How much house can I afford making $150,000 a year?', a: 'About $450,100 under the conservative 28/36 rule with $40,000 down at 7% and $500 of other debts, for a payment of $3,499 a month. With a stretch 45% total-debt budget the ceiling rises to about $643,500.' },
    { q: 'What income do I need for a $400,000 house?', a: 'Roughly $132,000 a year with $40,000 down at 7%. The full payment would be about $3,079 a month including tax, insurance and PMI, and 28% of $132,000 a year is $3,080 a month.' },
    { q: 'Do lenders use gross or net income?', a: 'Gross income. Mortgage DTI ratios divide your debt payments by pre-tax monthly income, which is why a budget that passes the lender\'s test can still feel tight on take-home pay.' },
    { q: 'Should I include my rent in monthly debts?', a: 'No. Rent stops when you buy, so leave it out. Include only debts that continue after closing: car loans, student loans, card minimums, personal loans, child support and alimony.' },
    { q: 'Is the 28/36 rule still realistic?', a: 'It is still the most widely used comfort guideline, although many buyers in high-cost markets go above it. Lenders routinely approve total DTI ratios of 43% to 50%, so treat 28/36 as the safe number and the lender\'s approval as the outer limit.' },
    { q: 'How much cash do I need besides the down payment?', a: 'Plan on closing costs of about 2% to 5% of the price, a few months of payments in reserve, and moving and repair money. On a $311,300 home, 3% closing costs alone is about $9,340.' },
    { q: 'Does a better credit score let me afford more house?', a: 'Yes, indirectly. A higher score usually gets a lower rate and cheaper PMI. Dropping from 7% to 6.5% raises the conservative budget in the example from $311,300 to $322,500.' }
  ],
  related: ['mortgage-calculator', 'dti-calculator', 'ltv-calculator', 'property-tax-calculator', 'rent-affordability-calculator'],
  sources: [
    { name: 'CFPB: What is a debt-to-income ratio?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/' },
    { name: 'Fannie Mae Selling Guide B3-6-02: Debt-to-Income Ratios', url: 'https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios' },
    { name: 'HUD: FHA Single Family Housing Policy Handbook 4000.1', url: 'https://www.hud.gov/program_offices/housing/sfh/handbook_4000-1' },
    { name: 'VA: Funding fee and closing costs', url: 'https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/' },
    { name: 'CFPB: When can I remove private mortgage insurance (PMI)?', url: 'https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/' },
    { name: 'FHFA: Conforming loan limit values for 2026', url: 'https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026' },
    { name: 'Freddie Mac: Primary Mortgage Market Survey', url: 'https://www.freddiemac.com/pmms' }
  ],
  disclaimer: 'Estimates for planning only; a lender\'s approval depends on your credit, assets, loan program and full underwriting.'
};
