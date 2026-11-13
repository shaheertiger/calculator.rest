const CO = [
  // Balance sheet at fiscal year end, from each company's latest 10-K (XBRL data, SEC EDGAR), $ millions:
  // [company, fiscal year end, current assets, current liabilities, inventory]
  ['Alphabet', 'Dec 31, 2025', 206038, 102745, 0],
  ['Nike', 'May 31, 2026', 24603, 12547, 7501],
  ['Coca-Cola', 'Dec 31, 2025', 31044, 21281, 4425],
  ['Caterpillar', 'Dec 31, 2025', 52485, 36558, 18135],
  ['Microsoft', 'Jun 30, 2026', 207710, 168825, 1397],
  ['Ford', 'Dec 31, 2025', 123487, 114890, 15285],
  ['Home Depot', 'Feb 1, 2026', 34391, 32424, 25817],
  ['Costco', 'Aug 30, 2026', 46582, 43952, 19324],
  ['Amazon', 'Dec 31, 2025', 229083, 218005, 38325],
  ['Johnson & Johnson', 'Dec 28, 2025', 55624, 54126, 14191],
  ['Apple', 'Sep 26, 2026', 173857, 169915, 14541],
  ['Target', 'Jan 31, 2026', 20005, 21230, 12304],
  ['PepsiCo', 'Dec 27, 2025', 27949, 32764, 5845],
  ['Walmart', 'Jan 31, 2026', 84874, 107469, 58851],
  ['Procter & Gamble', 'Jun 30, 2026', 26208, 38694, 8170]
];

export default {
  slug: 'current-ratio-calculator',
  hub: 'business',
  name: 'Current Ratio Calculator',
  title: 'Current Ratio Calculator: $250K ÷ $125K = 2.0 (+ Quick Ratio)',
  h1: 'Current Ratio Calculator: Current, Quick and Cash Ratios From the Balance Sheet',
  meta: 'Current assets of $250,000 over $125,000 of current liabilities is a 2.0 current ratio. Add inventory and cash to get the quick ratio and working capital.',
  keyword: 'how to calculate current ratio',
  also: ['how to calculate current ratio in accounting', 'current ratio formula', 'quick ratio calculator', 'acid test ratio calculator', 'working capital ratio', 'how to calculate increase in net working capital', 'how to calculate working capital'],
  updated: '2026-11-13',
  inputs: [
    { id: 'ca', label: 'Total current assets', type: 'number', value: 250000, prefix: '$', help: 'Cash, marketable securities, receivables, inventory, prepaid expenses.' },
    { id: 'cl', label: 'Total current liabilities', type: 'number', value: 125000, prefix: '$', help: 'Payables, accrued expenses, short-term debt, current portion of long-term debt.' },
    { id: 'inv', label: 'Inventory (optional)', type: 'number', value: 70000, prefix: '$' },
    { id: 'prepaid', label: 'Prepaid expenses (optional)', type: 'number', value: 10000, prefix: '$' },
    { id: 'cash', label: 'Cash and marketable securities (optional)', type: 'number', value: 60000, prefix: '$' }
  ],
  compute(v, H) {
    var ca = v.ca, cl = v.cl;
    if (!(ca >= 0)) return { error: 'Enter total current assets.' };
    if (!(cl > 0)) return { error: 'Enter total current liabilities greater than zero.' };
    var inv = v.inv > 0 ? v.inv : 0, pre = v.prepaid > 0 ? v.prepaid : 0;
    if (inv + pre > ca) return { error: 'Inventory plus prepaid expenses can\'t exceed total current assets.' };
    var cr = ca / cl, qr = (ca - inv - pre) / cl;
    var rows = [
      ['Quick (acid-test) ratio', H.fix(qr, 2), true],
      ['Working capital', H.money0(ca - cl)]
    ];
    if (v.cash >= 0 && !isNaN(v.cash)) rows.push(['Cash ratio', H.fix(v.cash / cl, 2)]);
    rows.push(['Current assets per $1 owed', H.money(cr)]);
    var sub = cr < 1 ? 'Current liabilities exceed current assets: paying all short-term bills would need new cash from sales, borrowing or equity.'
      : cr < 1.5 ? 'Short-term assets cover liabilities, with a thin cushion. Fine for fast-turning businesses; tight for most others.'
      : cr <= 3 ? 'A comfortable cushion: current assets cover short-term obligations ' + H.num(cr, 1) + ' times.'
      : 'A very high ratio: liquidity is not a concern, but cash or inventory may be sitting idle.';
    return {
      value: H.fix(cr, 2),
      label: 'Current ratio',
      expr: H.money0(ca) + ' ÷ ' + H.money0(cl),
      rows: rows,
      sub: sub,
      cr: cr, qr: qr
    };
  },
  quick: ({ r, run }) => `The current ratio is current assets divided by current liabilities. A business with <strong>$250,000</strong> of current assets and <strong>$125,000</strong> of current liabilities has a current ratio of <strong>${r.value}</strong>: $2 of short-term assets for every $1 due within a year. Excluding $70,000 of inventory and $10,000 of prepaid expenses, its quick ratio is ${run({}).rows[0][1]}.`,
  stepsTitle: 'How to calculate the current ratio',
  steps: [
    'Find <strong>total current assets</strong> on the balance sheet: cash, short-term investments, accounts receivable, inventory and prepaid expenses expected to turn into cash or be used within a year.',
    'Find <strong>total current liabilities</strong>: accounts payable, accrued wages and taxes, short-term loans, unearned revenue and the current portion of long-term debt. Forgetting the current portion of long-term debt is a common error that flatters the ratio.',
    'Divide current assets by current liabilities. Use figures from the same balance sheet date.',
    'For a stricter test, subtract inventory and prepaid expenses from current assets before dividing to get the quick ratio.'
  ],
  formulaTitle: 'What is the current ratio formula?',
  formula: {
    expr: 'Current ratio = Current assets ÷ Current liabilities<br>Quick ratio = (Current assets − Inventory − Prepaid expenses) ÷ Current liabilities<br>Cash ratio = (Cash + Marketable securities) ÷ Current liabilities<br>Working capital = Current assets − Current liabilities',
    vars: [['Current assets', 'assets expected to become cash or be used up within 12 months'], ['Current liabilities', 'obligations due within 12 months'], ['Quick ratio', 'also called the acid-test ratio']],
    note: 'The quick ratio is sometimes written as (cash + marketable securities + receivables) ÷ current liabilities. Both versions leave out inventory and prepaid expenses; they give the same answer when nothing else is in current assets.'
  },
  example: `<p>A small manufacturer's balance sheet shows $60,000 of cash, $110,000 of receivables, $70,000 of inventory and $10,000 of prepaid insurance: <strong>$250,000</strong> of current assets. It owes $75,000 to suppliers, $20,000 of accrued payroll and $30,000 of loan principal due this year: <strong>$125,000</strong> of current liabilities.</p>
<p>Current ratio = $250,000 ÷ $125,000 = <strong>2.00</strong>.</p>
<p>Quick ratio = ($250,000 − $70,000 − $10,000) ÷ $125,000 = $170,000 ÷ $125,000 = <strong>1.36</strong>.</p>
<p>Cash ratio = $60,000 ÷ $125,000 = <strong>0.48</strong>. Working capital = $250,000 − $125,000 = <strong>$125,000</strong>.</p>`,
  table: {
    title: 'What current ratios do large companies have?',
    intro: 'Current and quick ratios for well-known U.S. companies, computed with the calculator above from the balance sheets in their latest 10-K filings on SEC EDGAR. The quick ratio here subtracts inventory only.',
    head: ['Company (fiscal year end)', 'Current assets', 'Current liabilities', 'Current ratio', 'Quick ratio'],
    rows: ({ run, H }) => CO.map(c => { const r = run({ ca: c[2], cl: c[3], inv: c[4], prepaid: 0, cash: NaN }); return [c[0] + ' (' + c[1] + ')', H.money0(c[2]) + 'M', H.money0(c[3]) + 'M', H.fix(r.cr, 2), H.fix(r.qr, 2)]; }),
    note: 'Alphabet reports no separate inventory line, so its two ratios match. Several of the biggest retailers and consumer brands run below 1.0 because they sell inventory before supplier invoices come due.'
  },
  sections: [
    {
      h2: 'What is a good current ratio?',
      html: `<p>Many analysts treat roughly 1.5 to 3 as comfortable for a typical small business and a ratio below 1.0 as a warning sign, but the right level depends on how fast cash moves through the business. Walmart's 0.79 and Procter & Gamble's 0.68 in the table above are not signs of distress: they collect cash from shoppers within days, turn inventory quickly and pay suppliers on 30- to 60-day terms, so current liabilities are funded by the operating cycle.</p>
<p>A manufacturer or wholesaler that waits months to be paid needs a higher ratio. The better question is whether the ratio is stable or falling, and whether the quick ratio still covers liabilities if inventory sells slowly. The SEC's guide to financial statements makes the same point: desirable ratios vary by industry.</p>`
    },
    {
      h2: 'How do you calculate the quick ratio?',
      html: `<p>Quick ratio = (current assets − inventory − prepaid expenses) ÷ current liabilities, or equivalently (cash + marketable securities + accounts receivable) ÷ current liabilities. It asks whether the company could pay its short-term bills without selling any inventory.</p>
<p>In the example, $170,000 of quick assets against $125,000 of liabilities is 1.36. A quick ratio of 1.0 or more is a common comfort level. Home Depot shows why the distinction matters: its current ratio is 1.06, but inventory makes up about three-quarters of its current assets, so its quick ratio is just 0.26.</p>`
    },
    {
      h2: 'How do you calculate an increase in net working capital?',
      html: `<p>Net working capital = current assets − current liabilities. The increase is this year's figure minus last year's. If working capital was $100,000 last year and is $125,000 now, it increased by <strong>$25,000</strong>.</p>
<p>In cash flow analysis and valuation, that increase is subtracted from operating cash flow, because money went into receivables and inventory instead of the bank. Analysts often exclude cash and short-term debt from the calculation (operating working capital) so financing decisions don't distort it.</p>`
    },
    {
      h2: 'Can a current ratio be too high?',
      html: `<p>Yes. A ratio of 4 or 5 can mean excess cash earning little, receivables that aren't being collected or inventory that isn't selling. Check the components: a high ratio driven by cash is safe if unproductive; one driven by aging receivables or stale inventory is a warning. Days sales outstanding from the <a href="/accounts-receivable-turnover-calculator">AR turnover calculator</a> and turnover from the <a href="/average-inventory-calculator">average inventory calculator</a> tell you which.</p>`
    }
  ],
  faq: [
    { q: 'What does a current ratio of 2 mean?', a: 'It means the business has $2 of current assets for every $1 of liabilities due within a year, so it could cover its short-term obligations twice over if all current assets turned into cash at book value.' },
    { q: 'Is a current ratio below 1 bad?', a: 'Not always. It means current liabilities exceed current assets, which is risky for most small businesses, but large retailers like Walmart (0.79) and Target (0.94) operate below 1 because they turn inventory into cash before supplier bills are due.' },
    { q: 'What is the difference between the current ratio and the quick ratio?', a: 'The current ratio counts all current assets. The quick ratio leaves out inventory and prepaid expenses, which can\'t quickly be turned into cash, so it is the stricter test.' },
    { q: 'Is the current portion of long-term debt a current liability?', a: 'Yes. Loan principal due within the next 12 months is moved from long-term debt to current liabilities, and it belongs in the current ratio.' },
    { q: 'How can a business improve its current ratio?', a: 'Collect receivables faster, refinance short-term debt into long-term debt, retain more earnings, or reduce inventory that is funded by short-term borrowing. Paying down a current liability with cash also raises a ratio that is already above 1.' },
    { q: 'How do I calculate the current ratio in Excel?', a: 'With current assets in B1 and current liabilities in B2, enter =B1/B2. For the quick ratio, subtract inventory (B3) and prepaid expenses (B4): =(B1-B3-B4)/B2.' },
    { q: 'Is working capital the same as the current ratio?', a: 'They use the same inputs. Working capital is the dollar difference (current assets − current liabilities); the current ratio is the quotient. $250,000 and $125,000 give $125,000 of working capital and a 2.0 ratio.' }
  ],
  related: ['debt-to-equity-calculator', 'debt-to-asset-ratio-calculator', 'accounts-receivable-turnover-calculator', 'average-inventory-calculator', 'business-valuation-calculator'],
  sources: [
    { name: 'U.S. SEC: Beginners\' Guide to Financial Statements', url: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements' },
    { name: 'SEC EDGAR: company 10-K filings (source of the company table)', url: 'https://www.sec.gov/edgar/search/' },
    { name: 'OpenStax (Rice University): Principles of Accounting, Volume 1: Financial Accounting', url: 'https://openstax.org/details/books/principles-financial-accounting' }
  ]
};
