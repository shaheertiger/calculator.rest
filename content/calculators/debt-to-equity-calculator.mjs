const CO = [
  // From each company's latest 10-K balance sheet (XBRL data, SEC EDGAR), $ millions: [company, fiscal year end, total liabilities, total equity]
  ['Alphabet', 'Dec 31, 2025', 180016, 415265],
  ['Microsoft', 'Jun 30, 2026', 315989, 442387],
  ['Procter & Gamble', 'Jun 30, 2026', 72210, 54311],
  ['Johnson & Johnson', 'Dec 28, 2025', 117666, 81544],
  ['Costco', 'Aug 30, 2026', 53242, 35803],
  ['Apple', 'Sep 26, 2026', 292455, 112093],
  ['Caterpillar', 'Dec 31, 2025', 77267, 21318],
  ['PepsiCo', 'Dec 27, 2025', 86852, 20547],
  ['Ford', 'Dec 31, 2025', 253180, 35980],
  ['Home Depot', 'Feb 1, 2026', 92282, 12813],
  ['Boeing', 'Dec 31, 2025', 162778, 5457],
  ['Starbucks', 'Sep 27, 2026', 36052, -7662]
];
const DBT = [
  // Damodaran, NYU Stern, "Debt Fundamentals by Industry Sector (US)", January 2026: [industry, book debt-to-capital %]
  ['Semiconductors', 25.54], ['Homebuilding', 25.82], ['Software (system and application)', 34.14], ['General retail', 36.90],
  ['Machinery', 39.33], ['Food processing', 44.29], ['Pharmaceuticals', 48.10], ['Utilities (general)', 57.87],
  ['Telecom services', 60.95], ['REITs', 63.18], ['Air transport', 71.38], ['Hotels and gaming', 82.27],
  ['All U.S. non-financial companies', 48.24]
];

export default {
  slug: 'debt-to-equity-calculator',
  hub: 'business',
  name: 'Debt-to-Equity Ratio Calculator',
  title: 'Debt-to-Equity Calculator: $300K ÷ $200K Equity = 1.5 D/E',
  h1: 'Debt-to-Equity Ratio Calculator: Total-Liabilities and Debt-Only D/E',
  meta: 'A company with $300,000 of liabilities and $200,000 of shareholders\' equity has a 1.5 debt-to-equity ratio. Get debt-only D/E and compare with Apple and Ford.',
  keyword: 'how to calculate debt to equity ratio',
  also: ['how do you calculate debt to equity ratio', 'debt to equity ratio calculator', 'd/e ratio formula', 'how to calculate equity on a balance sheet', 'how to calculate equity on balance sheet', 'leverage ratio calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'liab', label: 'Total liabilities', type: 'number', value: 300000, prefix: '$', help: 'Everything owed: payables, accruals, loans, bonds, leases.' },
    { id: 'equity', label: 'Total shareholders\' equity', type: 'number', value: 200000, prefix: '$', help: 'Owners\' equity on the balance sheet (assets − liabilities).' },
    { id: 'debt', label: 'Interest-bearing debt only (optional)', type: 'number', value: 180000, prefix: '$', help: 'Loans, bonds, credit lines and lease liabilities, short and long term.' }
  ],
  compute(v, H) {
    var L = v.liab, E = v.equity;
    if (!(L >= 0)) return { error: 'Enter total liabilities.' };
    if (isNaN(E)) return { error: 'Enter total shareholders\' equity.' };
    if (E === 0) return { error: 'Equity is zero, so the ratio is undefined.' };
    var A = L + E;
    if (E < 0) {
      return {
        value: 'Negative equity', label: 'Debt-to-equity ratio not meaningful', expr: H.money0(L) + ' ÷ ' + H.money0(E),
        rows: [['Total assets', H.money0(A)], ['Liabilities ÷ assets', A > 0 ? H.fix(L / A, 2) : '—']],
        sub: 'Liabilities exceed assets. This can come from accumulated losses or from large share buybacks; check which before drawing conclusions.',
        de: NaN
      };
    }
    var de = L / E;
    var rows = [
      ['Debt-to-asset ratio', H.fix(L / A, 2)],
      ['Equity multiplier (assets ÷ equity)', H.fix(A / E, 2)],
      ['Total assets', H.money0(A)]
    ];
    if (v.debt >= 0 && !isNaN(v.debt)) rows.unshift(['Debt-only D/E (interest-bearing)', H.fix(v.debt / E, 2), true]);
    return {
      value: H.fix(de, 2),
      label: 'Debt-to-equity ratio',
      expr: H.money0(L) + ' ÷ ' + H.money0(E),
      rows: rows,
      sub: 'Creditors have supplied ' + H.money(de) + ' for every $1 owners have invested. ' + (de < 1 ? 'Owners fund most of the assets.' : de <= 2 ? 'A moderate level of leverage for most non-financial companies.' : 'Highly leveraged: compare with the industry before judging.'),
      de: de
    };
  },
  quick: ({ r }) => `The debt-to-equity ratio is total liabilities divided by shareholders' equity. A business with <strong>$300,000</strong> of liabilities and <strong>$200,000</strong> of equity has a D/E of <strong>${r.value}</strong>: creditors have put in $1.50 for every $1 from owners. Counting only its $180,000 of interest-bearing debt, the narrower debt-only D/E is 0.90.`,
  stepsTitle: 'How to calculate the debt-to-equity ratio',
  steps: [
    'Find <strong>total liabilities</strong> on the balance sheet. If you want the narrower version, add up only interest-bearing debt: short-term borrowings, the current portion of long-term debt, long-term debt and lease liabilities.',
    'Find <strong>total shareholders\' equity</strong> (or owner\'s equity for a sole proprietorship). If it isn\'t shown, it equals total assets minus total liabilities.',
    'Divide liabilities (or debt) by equity. Say which version you used; mixing them is the most common reason two sources quote different D/E ratios for the same company.',
    'Compare the result with companies in the same industry and with the same company in prior years.'
  ],
  formulaTitle: 'What is the debt-to-equity formula?',
  formula: {
    expr: 'D/E = Total liabilities ÷ Shareholders\' equity<br>Debt-only D/E = Interest-bearing debt ÷ Shareholders\' equity<br>Shareholders\' equity = Total assets − Total liabilities',
    vars: [['Total liabilities', 'all current and long-term obligations'], ['Interest-bearing debt', 'loans, bonds, notes and lease liabilities'], ['Shareholders\' equity', 'paid-in capital plus retained earnings, minus treasury stock']],
    note: 'The U.S. SEC\'s Beginners\' Guide to Financial Statements defines the debt-to-equity ratio as total liabilities ÷ shareholders\' equity, the default used above.'
  },
  example: `<p>A regional landscaping company's balance sheet shows $500,000 of total assets. It owes $70,000 to suppliers, $50,000 in accrued wages and taxes, and $180,000 on an equipment loan and line of credit: <strong>$300,000</strong> of total liabilities. Owners' equity is $500,000 − $300,000 = <strong>$200,000</strong>.</p>
<p>D/E = $300,000 ÷ $200,000 = <strong>1.50</strong>.</p>
<p>Debt-only D/E = $180,000 ÷ $200,000 = <strong>0.90</strong>.</p>
<p>The same balance sheet gives a debt-to-asset ratio of $300,000 ÷ $500,000 = 0.60 and an equity multiplier of 2.5.</p>`,
  table: {
    title: 'What debt-to-equity ratios do big companies have?',
    intro: 'Total liabilities ÷ total equity for well-known U.S. companies, computed with the calculator from the balance sheets in their latest 10-K filings on SEC EDGAR ($ millions).',
    head: ['Company (fiscal year end)', 'Total liabilities', 'Total equity', 'Debt-to-equity'],
    rows: ({ run, H }) => CO.map(c => { const r = run({ liab: c[2], equity: c[3], debt: NaN }); return [c[0] + ' (' + c[1] + ')', H.money0(c[2]) + 'M', (c[3] < 0 ? '−$' + H.int(-c[3]) : H.money0(c[3])) + 'M', isNaN(r.de) ? 'negative equity' : H.fix(r.de, 2)]; }),
    note: 'High ratios at Home Depot and Starbucks come largely from years of share buybacks, which shrink equity; Boeing\'s reflects accumulated losses; Ford\'s includes the borrowings of its Ford Credit finance arm. Same ratio, very different stories.'
  },
  sections: [
    {
      h2: 'What is a good debt-to-equity ratio?',
      html: `<p>There is no single good number. For a typical non-financial company, many analysts read a total-liabilities D/E below 1.0 as conservative, 1.0–2.0 as moderate and above 2.0 as aggressive, but utilities, real estate and airlines routinely carry more debt because their cash flows or assets support it, while software firms often carry little.</p>
<p>Interest-bearing debt relative to book equity varies widely by industry. These implied debt-only ratios come from the book debt-to-capital figures in Professor Aswath Damodaran's NYU Stern data (January 2026):</p>
<div class="twrap"><table><thead><tr><th>Industry</th><th>Book debt ÷ capital</th><th>Implied debt-only D/E</th></tr></thead><tbody>
${DBT.map(d => `<tr><td>${d[0]}</td><td>${d[1].toFixed(2)}%</td><td>${(d[1] / (100 - d[1])).toFixed(2)}</td></tr>`).join('')}
</tbody></table></div>`
    },
    {
      h2: 'Should debt-to-equity use total liabilities or only debt?',
      html: `<p>Both are used, which is why figures differ between sources. The total-liabilities version (the SEC's definition) counts everything a company owes, including supplier invoices and deferred revenue. The debt-only version counts borrowings that carry interest and fixed repayment dates, which is what lenders and credit analysts usually care about.</p>
<p>For the example company, the two versions are 1.50 and 0.90. Whichever you use, apply it the same way across companies and years, and note whether lease liabilities are included.</p>`
    },
    {
      h2: 'How do you calculate equity on a balance sheet?',
      html: `<p>Shareholders' equity = total assets − total liabilities. It can also be built up from its parts: common stock and additional paid-in capital, plus retained earnings, plus or minus accumulated other comprehensive income, minus treasury stock (shares bought back). For a sole proprietor, owner's equity = capital contributed + net income − draws.</p>
<p>Because buybacks are subtracted, a profitable company can show very low or even negative equity, which pushes D/E up without any new borrowing.</p>`
    },
    {
      h2: 'What does a negative debt-to-equity ratio mean?',
      html: `<p>A negative result means shareholders' equity is below zero: liabilities exceed assets. The ratio itself isn't meaningful then, so the calculator flags it instead of printing a negative number. Starbucks has negative book equity mainly because it has returned more cash through buybacks and dividends than it retained. In a small business, negative equity usually means accumulated losses, which lenders treat as a serious warning. Compare debt with assets instead using the <a href="/debt-to-asset-ratio-calculator">debt-to-asset ratio calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What does a debt-to-equity ratio of 1.5 mean?', a: 'It means the company has $1.50 of liabilities for every $1 of shareholders\' equity, so creditors finance 60% of its assets and owners 40%.' },
    { q: 'Is a high debt-to-equity ratio bad?', a: 'Not necessarily. Debt magnifies returns on equity when the business earns more than its interest cost, but it also raises fixed payments and default risk if earnings fall. Compare with peers and check interest coverage.' },
    { q: 'Does debt-to-equity include accounts payable?', a: 'In the total-liabilities version, yes: accounts payable, accrued expenses and deferred revenue are all included. The debt-only version leaves them out.' },
    { q: 'What is the difference between debt-to-equity and debt-to-asset ratios?', a: 'D/E compares liabilities with equity; debt-to-asset compares them with total assets. They move together: D/A = D/E ÷ (1 + D/E), so a D/E of 1.5 is a D/A of 0.60.' },
    { q: 'How do I calculate debt-to-equity in Excel?', a: 'With total liabilities in B1 and total equity in B2, use =B1/B2. Use =IF(B2<=0,"n/m",B1/B2) to flag negative equity.' },
    { q: 'What is market debt-to-equity?', a: 'Market D/E divides debt by the market value of equity (share price × shares outstanding) instead of book equity. It is common in valuation and cost-of-capital work and is usually much lower than book D/E for profitable companies.' },
    { q: 'How can a company lower its debt-to-equity ratio?', a: 'Pay down debt, retain earnings instead of paying them out, issue new shares, or convert debt to equity. Selling assets to repay debt also lowers it.' }
  ],
  related: ['debt-to-asset-ratio-calculator', 'current-ratio-calculator', 'wacc-calculator', 'business-valuation-calculator', 'dti-calculator'],
  sources: [
    { name: 'U.S. SEC: Beginners\' Guide to Financial Statements (debt-to-equity ratio)', url: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements' },
    { name: 'SEC EDGAR: company 10-K filings (source of the company table)', url: 'https://www.sec.gov/edgar/search/' },
    { name: 'Aswath Damodaran, NYU Stern: Debt Fundamentals by Industry Sector (US), January 2026', url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/dbtfund.html' }
  ]
};
