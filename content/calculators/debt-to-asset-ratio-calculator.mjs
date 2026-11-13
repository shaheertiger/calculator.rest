const CO = [
  // From each company's latest 10-K balance sheet (XBRL data, SEC EDGAR), $ millions: [company, fiscal year end, total liabilities, total assets]
  ['Alphabet', 'Dec 31, 2025', 180016, 595281],
  ['Microsoft', 'Jun 30, 2026', 315989, 758376],
  ['Procter & Gamble', 'Jun 30, 2026', 72210, 126521],
  ['Johnson & Johnson', 'Dec 28, 2025', 117666, 199210],
  ['Costco', 'Aug 30, 2026', 53242, 89045],
  ['Apple', 'Sep 26, 2026', 292455, 404548],
  ['Caterpillar', 'Dec 31, 2025', 77267, 98585],
  ['Ford', 'Dec 31, 2025', 253180, 289160],
  ['Boeing', 'Dec 31, 2025', 162778, 168235],
  ['Starbucks', 'Sep 27, 2026', 36052, 28390]
];

export default {
  slug: 'debt-to-asset-ratio-calculator',
  hub: 'business',
  name: 'Debt-to-Asset Ratio Calculator',
  title: 'Debt-to-Asset Ratio Calculator: $360K ÷ $800K = 0.45 (45%)',
  h1: 'Debt-to-Asset Ratio Calculator: How Much of the Business Creditors Fund',
  meta: 'Liabilities of $360,000 against $800,000 of assets is a 0.45 debt-to-asset ratio: creditors fund 45% of the business, owners 55%. Debt-only version included.',
  keyword: 'how to calculate debt to asset ratio',
  also: ['debt to asset ratio calculator', 'debt ratio calculator', 'how to calculate debt ratio', 'total debt to total assets ratio', 'equity multiplier calculator', 'debt to total assets formula'],
  updated: '2026-11-13',
  inputs: [
    { id: 'assets', label: 'Total assets', type: 'number', value: 800000, prefix: '$' },
    { id: 'liab', label: 'Total liabilities', type: 'number', value: 360000, prefix: '$', help: 'All current and long-term obligations.' },
    { id: 'debt', label: 'Interest-bearing debt only (optional)', type: 'number', value: 240000, prefix: '$', help: 'Bank loans, notes, bonds, credit lines and lease liabilities.' }
  ],
  compute(v, H) {
    var A = v.assets, L = v.liab;
    if (!(A > 0)) return { error: 'Enter total assets greater than zero.' };
    if (!(L >= 0)) return { error: 'Enter total liabilities (0 if none).' };
    var r = L / A, E = A - L;
    var rows = [['As a percentage', H.pct(r * 100, 1)]];
    if (v.debt >= 0 && !isNaN(v.debt)) rows.push(['Debt-only ratio (interest-bearing ÷ assets)', H.fix(v.debt / A, 2), true]);
    rows.push(['Shareholders\' equity', H.money0(E)]);
    rows.push(['Equity ratio', H.pct((1 - r) * 100, 1)]);
    rows.push(['Debt-to-equity', E > 0 ? H.fix(L / E, 2) : 'n/m (negative equity)']);
    rows.push(['Equity multiplier', E > 0 ? H.fix(A / E, 2) : 'n/m']);
    return {
      value: H.fix(r, 2),
      label: 'Debt-to-asset ratio',
      expr: H.money0(L) + ' ÷ ' + H.money0(A),
      rows: rows,
      sub: r > 1 ? 'Liabilities exceed assets, so equity is negative: creditors have a claim on more than everything the company owns.'
        : 'Creditors have financed ' + H.pct(r * 100, 0) + ' of the assets; owners\' equity covers the other ' + H.pct((1 - r) * 100, 0) + '.',
      r: r
    };
  },
  quick: ({ r }) => `The debt-to-asset ratio is total liabilities divided by total assets. A business that owes <strong>$360,000</strong> and owns <strong>$800,000</strong> of assets has a ratio of <strong>${r.value}</strong>, meaning 45% of its assets are financed by creditors and 55% by owners. Counting only the $240,000 of interest-bearing loans, the narrower debt ratio is 0.30.`,
  stepsTitle: 'How to calculate the debt-to-asset ratio',
  steps: [
    'Take <strong>total assets</strong> from the bottom of the asset side of the balance sheet.',
    'Take <strong>total liabilities</strong>, or add up only interest-bearing debt if you want the narrower "total debt to total assets" version. State which one you use, because they can differ a lot.',
    'Divide liabilities by assets. Multiply by 100 to express it as a percentage.',
    'Read it as the share of assets financed by creditors. One minus the ratio is the equity ratio, the share financed by owners.'
  ],
  formulaTitle: 'What is the debt-to-asset ratio formula?',
  formula: {
    expr: 'Debt-to-asset ratio = Total liabilities ÷ Total assets<br>Debt-only version = Interest-bearing debt ÷ Total assets<br>Equity ratio = 1 − Debt-to-asset ratio<br>Equity multiplier = 1 ÷ (1 − Debt-to-asset ratio)',
    vars: [['Total liabilities', 'everything the business owes'], ['Interest-bearing debt', 'borrowings with interest, short and long term'], ['Total assets', 'liabilities + shareholders\' equity']],
    note: 'Because assets = liabilities + equity, the ratio converts directly to debt-to-equity: D/E = D/A ÷ (1 − D/A).'
  },
  example: `<p>A family-owned trucking company owns $800,000 of trucks, trailers, receivables and cash. It owes $240,000 on truck loans plus $120,000 of payables, fuel cards and accrued payroll, for <strong>$360,000</strong> of total liabilities.</p>
<p>Debt-to-asset ratio = $360,000 ÷ $800,000 = <strong>0.45</strong> (45%).</p>
<p>Debt-only ratio = $240,000 ÷ $800,000 = <strong>0.30</strong>.</p>
<p>Equity = $800,000 − $360,000 = $440,000, an equity ratio of 55%. That is a debt-to-equity ratio of 0.82 and an equity multiplier of 1.82.</p>`,
  table: {
    title: 'How does the debt-to-asset ratio convert to debt-to-equity?',
    intro: 'Each debt-to-asset level and the matching debt-to-equity ratio, equity ratio and equity multiplier (the leverage term in DuPont return-on-equity analysis), computed with the calculator.',
    head: ['Debt-to-asset', 'Equity ratio', 'Debt-to-equity', 'Equity multiplier'],
    rows: ({ run, H }) => [0.1, 0.2, 0.3, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95].map(x => { const r = run({ assets: 100, liab: x * 100, debt: NaN }); return [H.fix(r.r, 2) + ' (' + H.pct(x * 100, 0) + ')', H.pct((1 - x) * 100, 0), H.fix(x / (1 - x), 2), H.fix(1 / (1 - x), 2) + '×']; }),
    note: 'Leverage accelerates at the top: moving from 0.80 to 0.90 more than doubles debt-to-equity, from 4 to 9.'
  },
  sections: [
    {
      h2: 'What is a good debt-to-asset ratio?',
      html: `<p>Below 0.5 means owners fund more of the assets than creditors do, which most lenders find reassuring for a small business. Between 0.5 and 0.8 is common for established companies, especially asset-heavy ones that can borrow against equipment or property. Above 1.0 means negative equity.</p>
<p>Large companies span the whole range. Computed from their latest 10-K balance sheets:</p>
<div class="twrap"><table><thead><tr><th>Company (fiscal year end)</th><th>Total liabilities ÷ total assets</th></tr></thead><tbody>
${CO.map(c => `<tr><td>${c[0]} (${c[1]})</td><td>${(c[2] / c[3]).toFixed(2)}</td></tr>`).join('')}
</tbody></table></div>
<p>Alphabet and Microsoft fund most of their assets with retained profits; Ford's ratio reflects its auto-finance business, which borrows to make car loans; Starbucks' liabilities exceed its assets because buybacks and dividends have exceeded retained earnings.</p>`
    },
    {
      h2: 'Is the debt ratio total debt or total liabilities?',
      html: `<p>Textbooks and financial sites use "debt ratio" for both. The broad version divides all liabilities by assets and answers "how much of the business do outsiders have a claim on?" The narrow version counts only interest-bearing debt and answers "how much is financed by borrowing?", which matters for interest costs and refinancing risk.</p>
<p>A business with large customer deposits or deferred revenue (a software company billing annually in advance, for instance) can look highly leveraged on the broad measure while owing banks almost nothing. Showing both, as the calculator does, avoids that trap.</p>`
    },
    {
      h2: 'How do lenders use the debt-to-asset ratio?',
      html: `<p>Lenders read it as a cushion: at 0.45, assets could lose 55% of their book value before creditors were at risk. It is usually reviewed alongside interest coverage (operating income ÷ interest) and, for small business loans, the debt service coverage ratio, because a low-leverage business can still struggle if cash flow is weak.</p>
<p>Book values can mislead in both directions. Fully depreciated equipment may be worth more than its book value, while goodwill from an acquisition may be worth less. For short-term solvency, check the <a href="/current-ratio-calculator">current ratio</a> as well; to compare with equity rather than assets, use the <a href="/debt-to-equity-calculator">debt-to-equity calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What does a debt-to-asset ratio of 0.45 mean?', a: 'Creditors finance 45% of the company\'s assets and owners finance the remaining 55%. For every $1 of assets there is 45 cents of liabilities.' },
    { q: 'Can the debt-to-asset ratio be greater than 1?', a: 'Yes. A ratio above 1 means liabilities exceed assets and shareholders\' equity is negative. Starbucks, at about 1.27 in its latest 10-K, is an example.' },
    { q: 'Is a lower debt-to-asset ratio always better?', a: 'Lower means less financial risk, but very little debt can mean a company is passing up cheap financing that would raise returns on equity. The right level depends on how stable cash flows are.' },
    { q: 'How do you convert debt-to-asset to debt-to-equity?', a: 'Divide the debt-to-asset ratio by one minus itself. 0.45 ÷ 0.55 = 0.82, so a 0.45 debt-to-asset ratio equals a 0.82 debt-to-equity ratio.' },
    { q: 'How do I calculate the debt-to-asset ratio in Excel?', a: 'With total liabilities in B1 and total assets in B2, use =B1/B2, and format as a percentage if you prefer 45% to 0.45.' },
    { q: 'What is the equity multiplier?', a: 'The equity multiplier is total assets ÷ shareholders\' equity. It equals 1 ÷ (1 − debt-to-asset ratio) and is the leverage component of DuPont return-on-equity analysis.' }
  ],
  related: ['debt-to-equity-calculator', 'current-ratio-calculator', 'net-worth-calculator', 'ltv-calculator'],
  sources: [
    { name: 'U.S. SEC: Beginners\' Guide to Financial Statements', url: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements' },
    { name: 'SEC EDGAR: company 10-K filings (source of the company figures)', url: 'https://www.sec.gov/edgar/search/' },
    { name: 'OpenStax (Rice University): Principles of Accounting, Volume 1: Financial Accounting', url: 'https://openstax.org/details/books/principles-financial-accounting' }
  ]
};
