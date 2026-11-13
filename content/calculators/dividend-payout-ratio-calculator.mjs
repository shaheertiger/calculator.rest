export default {
  slug: 'dividend-payout-ratio-calculator',
  hub: 'investing',
  name: 'Dividend Payout Ratio Calculator',
  title: 'Dividend Payout Ratio Calculator: $20M ÷ $50M Is a 40% Payout',
  h1: 'Dividend Payout Ratio Calculator With Retention Ratio and Yield',
  meta: 'A company that pays $20 million of dividends from $50 million of net income has a 40% payout ratio and keeps 60%. Get payout, yield and dividend income.',
  keyword: 'how to calculate dividend payout ratio',
  also: ['dividend payout ratio calculator', 'payout ratio formula', 'how calculate dividends', 'retention ratio calculator', 'dividend yield calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I have', type: 'select', value: 'total', options: [['total', 'Total dividends and net income'], ['share', 'Dividend per share and EPS']] },
    { id: 'div', label: 'Total dividends paid (common)', type: 'number', value: 20, prefix: '$', suffix: 'million', help: 'Cash flow statement, financing section.', showIf: { mode: ['total'] } },
    { id: 'ni', label: 'Net income', type: 'number', value: 50, prefix: '$', suffix: 'million', help: 'Subtract preferred dividends if there are any.', showIf: { mode: ['total'] } },
    { id: 'shares', label: 'Shares outstanding (optional)', type: 'number', value: 10, suffix: 'million', showIf: { mode: ['total'] } },
    { id: 'dps', label: 'Annual dividend per share', type: 'number', value: 2, prefix: '$', showIf: { mode: ['share'] } },
    { id: 'eps', label: 'Earnings per share', type: 'number', value: 5, prefix: '$', showIf: { mode: ['share'] } },
    { id: 'price', label: 'Share price (optional, for yield)', type: 'number', value: 80, prefix: '$' },
    { id: 'roe', label: 'Return on equity (optional, for growth)', type: 'number', value: 15, suffix: '%' },
    { id: 'own', label: 'Shares you own (optional)', type: 'number', value: '', placeholder: 'e.g. 100' }
  ],
  compute(v, H) {
    var payout, dps = NaN, eps = NaN, rows = [], expr;
    if (v.mode === 'share') {
      if (!(v.dps >= 0)) return { error: 'Enter the annual dividend per share.' };
      if (!H.isNum(v.eps) || v.eps === 0) return { error: 'Enter earnings per share (not zero).' };
      dps = v.dps; eps = v.eps; payout = dps / eps;
      expr = H.money(dps) + ' ÷ ' + H.money(eps);
    } else {
      if (!(v.div >= 0)) return { error: 'Enter total dividends paid.' };
      if (!H.isNum(v.ni) || v.ni === 0) return { error: 'Enter net income (not zero).' };
      payout = v.div / v.ni;
      expr = H.money(v.div, 2) + 'M ÷ ' + H.money(v.ni, 2) + 'M';
      if (v.shares > 0) { dps = v.div / v.shares; eps = v.ni / v.shares; }
    }
    if (v.ni < 0 || eps < 0) return { value: 'n/m', label: 'Payout ratio (not meaningful)', expr: expr, rows: [['Dividends exceed earnings', 'Company had a loss']], sub: 'With negative earnings the payout ratio is not meaningful; the dividend is being paid from cash or borrowing. Compare dividends with free cash flow instead.' };
    var keep = 1 - payout;
    rows.push(['Retention ratio', H.pct(keep * 100, 2), true]);
    if (H.isNum(dps)) rows.push(['Dividend per share', H.money(dps)]);
    if (H.isNum(eps)) rows.push(['Earnings per share', H.money(eps)]);
    if (H.isNum(dps) && v.price > 0) rows.push(['Dividend yield', H.pct(dps / v.price * 100, 2)]);
    if (H.isNum(eps) && v.price > 0) rows.push(['Earnings yield', H.pct(eps / v.price * 100, 2)]);
    if (v.roe > 0 && keep > 0) rows.push(['Sustainable dividend growth (ROE × retention)', H.pct(v.roe * keep, 2)]);
    if (v.own > 0 && H.isNum(dps)) rows.push(['Your annual dividend income', H.money(dps * v.own) + ' (' + H.money(dps * v.own / 4) + ' a quarter)']);
    var p = payout * 100;
    var sub = p > 100 ? 'Paying out more than it earns: the dividend is funded from cash reserves or debt and is at risk if earnings do not recover.'
      : p > 75 ? 'A high payout leaves little cushion. Normal for REITs and some utilities; a warning sign for most other companies.'
      : p >= 30 ? 'A moderate payout typical of mature, profitable companies, with room to keep raising the dividend.'
      : 'A low payout: most profit is reinvested or used for buybacks, so the dividend is well covered.';
    return { value: H.pct(p, 2), label: 'Dividend payout ratio', expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate the dividend payout ratio, divide total dividends by net income (or dividends per share by EPS). A company that earns $50 million and pays $20 million in dividends has a payout ratio of $20M ÷ $50M = <strong>${r.value}</strong>, so it retains 60%. Per share that is $2.00 ÷ $5.00; at an $80 share price the dividend yield is 2.5%.`,
  stepsTitle: 'How to calculate the dividend payout ratio',
  steps: [
    'Find dividends paid to common shareholders. They appear in the financing section of the cash flow statement (often as "dividends paid") or as dividends declared per share in the 10-K.',
    'Find net income for the same period from the income statement. If the company has preferred stock, subtract preferred dividends first; the payout ratio is about common shareholders.',
    'Divide dividends by net income and multiply by 100. Per-share data works the same way: annual dividend per share ÷ diluted EPS.',
    'Subtract from 100% to get the retention ratio, the share of profit kept for growth or debt reduction.',
    'Use annual or trailing-12-month figures for both numbers. Mixing a quarterly dividend with annual earnings is the most frequent error and makes the ratio look four times too low.'
  ],
  formulaTitle: 'What is the dividend payout ratio formula?',
  formula: {
    expr: 'Payout ratio = Dividends ÷ Net income = DPS ÷ EPS<br>Retention ratio = 1 − Payout ratio<br>Dividend yield = DPS ÷ Share price<br>Sustainable growth g = ROE × Retention ratio',
    vars: [['Dividends', 'cash dividends paid to common shareholders'], ['Net income', 'profit available to common shareholders'], ['DPS, EPS', 'dividend and earnings per share for the same 12 months'], ['ROE', 'return on equity: net income ÷ shareholders\' equity']]
  },
  example: `<p>A company earned $50 million last year on 10 million shares and paid $20 million in dividends. Its stock trades at $80 and its return on equity is 15%.</p>
<p>Payout ratio = $20M ÷ $50M = <strong>40%</strong>. Retention ratio = 60%.</p>
<p>Per share: DPS = $20M ÷ 10M = $2.00; EPS = $5.00; $2.00 ÷ $5.00 = 40%, the same answer.</p>
<p>Dividend yield = $2.00 ÷ $80 = <strong>2.50%</strong>. Sustainable growth = 15% × 60% = <strong>9.00%</strong> a year, the pace at which earnings and dividends can grow from reinvested profit alone. An owner of 100 shares receives $200 a year, or $50 a quarter.</p>`,
  table: {
    title: 'How fast can dividends grow at each payout ratio?',
    intro: 'Sustainable growth rate (ROE × retention ratio) for different payout ratios and returns on equity, from the calculator above.',
    head: ['Payout ratio', 'Retention', 'ROE 10%', 'ROE 15%', 'ROE 20%', 'ROE 25%'],
    rows: ({ run }) => [0, 20, 30, 40, 50, 60, 75, 90, 100].map(p => {
      const g = roe => { const r = run({ mode: 'share', dps: p / 20, eps: 5, price: 80, roe: roe, own: NaN }); const row = (r.rows || []).find(x => /Sustainable/.test(x[0])); return row ? row[1] : '0%'; };
      return [p + '%', (100 - p) + '%', g(10), g(15), g(20), g(25)];
    }),
    note: 'A company paying out everything cannot grow earnings from reinvestment; growth then has to come from price increases, borrowing or issuing shares.'
  },
  sections: [
    {
      h2: 'What is a good dividend payout ratio?',
      html: `<p>There is no single target; it depends on the business:</p>
<ul><li><strong>Under 30%:</strong> common for fast-growing companies that need cash for expansion, or those that prefer buybacks. The dividend is very safe.</li>
<li><strong>30–60%:</strong> the comfortable range for mature companies. They can keep raising the dividend and still absorb a bad year.</li>
<li><strong>60–80%:</strong> high for most industries, but normal for utilities and telecoms with stable, regulated earnings.</li>
<li><strong>Over 100%:</strong> the company is paying more than it earns. One weak year can be tolerated; several in a row often end in a dividend cut.</li></ul>
<p>Real estate investment trusts are a special case: they must distribute at least 90% of taxable income to keep their REIT status, and depreciation makes net income misleading, so investors use funds from operations (FFO) instead.</p>`
    },
    {
      h2: 'How are dividends calculated for shareholders?',
      html: `<p>Your dividend income is the dividend per share times the number of shares you own on the record date. A company paying $0.50 a quarter ($2.00 a year) sends a 100-share holder $50 each quarter. To receive it, you must buy before the ex-dividend date.</p>
<p>Dividend yield turns that into a rate: annual dividend ÷ share price. $2.00 on an $80 stock is 2.5%. Yield rises when the price falls, so a very high yield can signal that the market expects a cut. Check the payout ratio before trusting it.</p>
<p>In a taxable account, qualified dividends are taxed at the 0%, 15% or 20% long-term capital gains rates; ordinary (non-qualified) dividends are taxed at your regular income tax rate.</p>`
    },
    {
      h2: 'Should the payout ratio use earnings or free cash flow?',
      html: `<p>Earnings include non-cash items such as depreciation, impairments and gains on asset sales, so a one-time charge can make the earnings-based ratio spike above 100% even when the dividend is safe. The <strong>cash payout ratio</strong> = dividends ÷ free cash flow (operating cash flow minus capital expenditures) shows whether the business actually generates the cash it pays out.</p>
<p>Example: $20 million of dividends against $32 million of free cash flow is a 62.5% cash payout, higher than the 40% earnings payout, because the company is spending heavily on new equipment. Analysts also look at a <strong>total payout ratio</strong> that adds share buybacks to dividends.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for dividend payout ratio?', a: 'Payout ratio = total dividends ÷ net income, or dividend per share ÷ earnings per share. Multiply by 100 for a percentage.' },
    { q: 'Where do I find dividends paid?', a: 'In the financing activities section of the cash flow statement in a company\'s 10-K or 10-Q, usually labeled "dividends paid" or "cash dividends". Dividends declared per share are also in the notes and earnings releases.' },
    { q: 'Can the dividend payout ratio be over 100%?', a: 'Yes. It means the company paid more in dividends than it earned that year, using cash reserves, asset sales or debt. It is sustainable only if earnings recover or were temporarily depressed.' },
    { q: 'What is the retention ratio?', a: 'The share of net income a company keeps rather than paying out: 1 − payout ratio. A 40% payout ratio means a 60% retention ratio.' },
    { q: 'What is the difference between payout ratio and dividend yield?', a: 'Payout ratio compares dividends with earnings and measures how safe the dividend is. Dividend yield compares dividends with the share price and measures the income you get per dollar invested.' },
    { q: 'Do share buybacks count in the payout ratio?', a: 'Not in the standard dividend payout ratio. The total payout ratio adds buybacks: (dividends + repurchases) ÷ net income.' },
    { q: 'What payout ratio is safe?', a: 'For most non-financial companies, below about 60% of earnings and comfortably covered by free cash flow. Utilities and REITs routinely run higher because their cash flows are steadier.' }
  ],
  related: ['eps-calculator', 'pe-ratio-calculator', 'capm-calculator', 'compound-interest-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Dividend (glossary)', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/dividend' },
    { name: 'SEC: Beginners\' Guide to Financial Statements', url: 'https://www.sec.gov/files/investor/pubs/begfinstmtguide.htm' },
    { name: 'IRS Topic 404: Dividends', url: 'https://www.irs.gov/taxtopics/tc404' },
    { name: 'NYU Stern (Aswath Damodaran): Dividend fundamentals by industry', url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/divfund.html' }
  ]
};
