export default {
  slug: 'eps-calculator',
  hub: 'investing',
  name: 'EPS Calculator',
  title: 'EPS Calculator: $12M ÷ 10.5M Weighted Shares = $1.14 EPS',
  h1: 'Earnings Per Share Calculator: Basic and Diluted EPS',
  meta: 'Net income of $12.5M minus $0.5M of preferred dividends over 10.5M weighted shares is $1.14 basic EPS and $1.11 diluted. Works out weighted shares for you.',
  keyword: 'how are eps calculated',
  also: ['eps calculator', 'how earnings per share is calculated', 'how to calculate earnings per share', 'diluted eps calculator', 'weighted average shares outstanding'],
  updated: '2026-11-13',
  inputs: [
    { id: 'ni', label: 'Net income', type: 'number', value: 12.5, prefix: '$', suffix: 'million' },
    { id: 'pref', label: 'Preferred dividends', type: 'number', value: 0.5, prefix: '$', suffix: 'million', help: 'For cumulative preferred, subtract the year\'s dividend even if it was not declared.' },
    { id: 'begin', label: 'Common shares at start of year', type: 'number', value: 10, suffix: 'million' },
    { id: 'issued', label: 'New shares issued during the year', type: 'number', value: 1.2, suffix: 'million' },
    { id: 'issuedMo', label: 'Months the new shares were outstanding', type: 'number', value: 6, suffix: 'of 12' },
    { id: 'bought', label: 'Shares repurchased during the year', type: 'number', value: 0.4, suffix: 'million' },
    { id: 'boughtMo', label: 'Months since the repurchase (to year-end)', type: 'number', value: 3, suffix: 'of 12' },
    { id: 'dil', label: 'Dilutive shares from options, RSUs, convertibles', type: 'number', value: 0.3, suffix: 'million', help: 'Net new shares after the treasury stock method.' },
    { id: 'addback', label: 'After-tax interest on convertible debt (if converted)', type: 'number', value: 0, prefix: '$', suffix: 'million' }
  ],
  compute(v, H) {
    function z(x) { return x > 0 ? x : 0; }
    if (!H.isNum(v.ni)) return { error: 'Enter net income.' };
    if (!(v.begin > 0)) return { error: 'Enter the number of shares at the start of the year.' };
    var im = Math.min(12, z(v.issuedMo)), bm = Math.min(12, z(v.boughtMo));
    var w = v.begin + z(v.issued) * im / 12 - z(v.bought) * bm / 12;
    if (!(w > 0)) return { error: 'Weighted shares must be positive; check the share inputs.' };
    var avail = v.ni - z(v.pref);
    var basic = avail / w;
    var dilW = w + z(v.dil);
    var dilEps = (avail + z(v.addback)) / dilW;
    var antidilutive = dilEps > basic;
    if (antidilutive) dilEps = basic;
    var endShares = v.begin + z(v.issued) - z(v.bought);
    var rows = [
      ['Diluted EPS', (dilEps < 0 ? '−' : '') + H.money(Math.abs(dilEps)), true],
      ['Earnings available to common', H.money(avail, 2) + 'M'],
      ['Weighted average shares (basic)', H.num(w, 4) + 'M'],
      ['Weighted average shares (diluted)', H.num(antidilutive ? w : dilW, 4) + 'M'],
      ['Shares at year-end', H.num(endShares, 4) + 'M'],
      ['EPS using year-end shares (wrong method)', H.money(avail / endShares)]
    ];
    return {
      value: (basic < 0 ? '−' : '') + H.money(Math.abs(basic)),
      label: 'Basic earnings per share',
      expr: '(' + H.money(v.ni, 2) + 'M − ' + H.money(z(v.pref), 2) + 'M) ÷ ' + H.num(w, 3) + 'M shares',
      rows: rows,
      sub: basic < 0 ? 'A net loss gives negative EPS. Potential shares are ignored for diluted EPS because they would make the loss per share smaller (antidilutive).' : antidilutive ? 'The convertible add-back would raise EPS, so it is antidilutive and excluded: diluted EPS equals basic.' : 'Diluted EPS assumes every in-the-money option and convertible becomes stock, so it is the more conservative figure.'
    };
  },
  quick: ({ r, run }) => `EPS is calculated as net income minus preferred dividends, divided by the weighted average number of common shares outstanding. A company earning $12.5 million that owes $0.5 million of preferred dividends and averaged 10.5 million shares has basic EPS of $12.0M ÷ 10.5M = <strong>${r.value}</strong>. Adding 0.3 million dilutive shares gives diluted EPS of ${run().rows[0][1]}.`,
  stepsTitle: 'How earnings per share is calculated',
  steps: [
    'Start with net income from the income statement for the year (or trailing 12 months).',
    'Subtract preferred dividends, because that money belongs to preferred holders, not common shareholders.',
    'Work out the <strong>weighted average</strong> share count: shares at the start, plus new shares × the fraction of the year they existed, minus repurchased shares × the fraction of the year they were gone. Using the year-end share count instead is the most common mistake.',
    'Divide earnings available to common shareholders by the weighted shares. That is basic EPS.',
    'For diluted EPS, add shares that options, restricted stock units and convertibles would create (using the treasury stock and if-converted methods), add back convertible interest after tax, and divide again.'
  ],
  formulaTitle: 'What is the EPS formula?',
  formula: {
    expr: 'Basic EPS = (Net income − Preferred dividends) ÷ Weighted average common shares<br>Diluted EPS = (Net income − Preferred dividends + Convertible interest × (1 − t)) ÷ (Weighted shares + Dilutive shares)<br>Weighted shares = Σ shares × months outstanding ÷ 12',
    vars: [['Net income', 'profit after tax for the period'], ['Preferred dividends', 'dividends on preferred stock for the period'], ['Dilutive shares', 'net shares from options, warrants, RSUs and convertible securities'], ['t', 'tax rate applied to interest on convertible debt']],
    note: 'U.S. companies follow FASB ASC Topic 260 and must show both basic and diluted EPS on the face of the income statement.'
  },
  example: `<p>A company starts the year with 10 million shares. It issues 1.2 million shares on July 1 (outstanding 6 months) and buys back 400,000 shares on October 1 (gone for 3 months). Net income is $12.5 million and preferred dividends are $0.5 million.</p>
<p>Weighted shares = 10,000,000 + 1,200,000 × 6/12 − 400,000 × 3/12 = 10,000,000 + 600,000 − 100,000 = <strong>10,500,000</strong>.</p>
<p>Basic EPS = ($12,500,000 − $500,000) ÷ 10,500,000 = <strong>$1.14</strong>.</p>
<p>Employee options and RSUs add 300,000 shares after the treasury stock method. Diluted EPS = $12,000,000 ÷ 10,800,000 = <strong>$1.11</strong>. Dividing by the 10.8 million shares outstanding at year-end instead of the weighted average would understate basic EPS at $1.11.</p>`,
  table: {
    title: 'How much do share buybacks raise EPS?',
    intro: 'EPS for $12 million of earnings available to common shareholders as the weighted share count shrinks, and how earnings growth combines with it.',
    head: ['Shares retired', 'Weighted shares', 'EPS, flat earnings', 'EPS change', 'EPS if earnings +5%'],
    rows: ({ run, H }) => [0, 1, 2, 3, 5, 7.5, 10, 15].map(p => {
      const w = 10.5 * (1 - p / 100);
      const base = run({ ni: 12.5, pref: 0.5, begin: w, issued: 0, bought: 0, dil: 0, addback: 0 }).value;
      const up = run({ ni: 13.1, pref: 0.5, begin: w, issued: 0, bought: 0, dil: 0, addback: 0 }).value;
      return [p + '%', H.num(w, 3) + 'M', base, '+' + H.pct((1 / (1 - p / 100) - 1) * 100, 1), up];
    }),
    note: 'Retiring 5% of shares lifts EPS 5.3% with no change in profit. That is why analysts check whether EPS growth comes from the business or from a shrinking share count.'
  },
  sections: [
    {
      h2: 'What is the difference between basic and diluted EPS?',
      html: `<p>Basic EPS uses only shares actually outstanding. Diluted EPS also counts shares that could be created from stock options, warrants, restricted stock units, convertible bonds and convertible preferred stock, if converting them would lower EPS.</p>
<p><strong>Treasury stock method</strong> for options: assume they are exercised and the cash received buys back shares at the average market price. 1,000,000 options with a $20 strike and a $50 average price bring in $20 million, which buys back 400,000 shares, so the net addition is <strong>600,000</strong> shares. Options with a strike above the market price are left out.</p>
<p><strong>If-converted method</strong> for convertibles: add the shares they would convert into, and add back the after-tax interest (or preferred dividends) the company would no longer pay. If that makes EPS higher, the security is antidilutive and excluded.</p>`
    },
    {
      h2: 'How do you calculate weighted average shares outstanding?',
      html: `<p>Weight each block of shares by the share of the year it was outstanding. Use months for a quick estimate; companies use days.</p>
<ul><li>10,000,000 shares all year: 10,000,000 × 12/12 = 10,000,000</li>
<li>1,200,000 issued July 1: 1,200,000 × 6/12 = +600,000</li>
<li>400,000 repurchased October 1: 400,000 × 3/12 = −100,000</li></ul>
<p>Total: 10,500,000. Stock splits and stock dividends are different: they are applied retroactively to the whole year (and to prior years shown), because they do not bring in new money. After a 2-for-1 split, last year's EPS is restated at half its old value.</p>`
    },
    {
      h2: 'What is adjusted EPS, and how is it different from GAAP EPS?',
      html: `<p>GAAP EPS is the audited figure required by accounting rules. Many companies also publish "adjusted" or non-GAAP EPS that removes items such as restructuring costs, acquisition amortization, stock-based compensation or one-time legal charges. The SEC requires companies that present non-GAAP measures to reconcile them to the GAAP figure and show the GAAP number with equal prominence.</p>
<p>Analysts' consensus estimates, and headlines about whether a company "beat" earnings, usually refer to adjusted EPS. When valuing a stock, check how large the adjustments are and whether "one-time" items recur every year.</p>`
    },
    {
      h2: 'What is trailing and forward EPS?',
      html: `<p><strong>Trailing twelve months (TTM) EPS</strong> adds the last four reported quarters. If quarterly diluted EPS was $0.26, $0.29, $0.27 and $0.30, TTM EPS is $1.12. <strong>Forward EPS</strong> is the analysts' estimate for the next 12 months or fiscal year. Dividing the share price by either gives the trailing or forward P/E ratio; the <a href="/pe-ratio-calculator">P/E ratio calculator</a> does both, plus PEG.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for earnings per share?', a: 'EPS = (net income − preferred dividends) ÷ weighted average common shares outstanding. Diluted EPS adds potential shares from options and convertibles to the denominator.' },
    { q: 'Where do I find EPS?', a: 'At the bottom of the income statement in a company\'s 10-K (annual) or 10-Q (quarterly) report, which list basic and diluted EPS. The share counts used are in the EPS footnote.' },
    { q: 'Can EPS be negative?', a: 'Yes. A net loss produces negative EPS. In that case diluted EPS equals basic EPS, because adding shares would make the loss per share look smaller.' },
    { q: 'Why use weighted average shares instead of shares outstanding?', a: 'Because earnings are generated over the whole year, while shares issued or bought back mid-year only shared in part of it. The weighted average matches the denominator to the period the earnings cover.' },
    { q: 'Do you subtract common dividends when calculating EPS?', a: 'No. Only preferred dividends are subtracted. Common dividends are paid out of the earnings that EPS measures; comparing them with EPS gives the payout ratio.' },
    { q: 'What is a good EPS?', a: 'EPS alone does not say much, because it depends on how many shares a company has. What matters is steady EPS growth over time and the price you pay for it, measured by the P/E ratio.' },
    { q: 'How do buybacks affect EPS?', a: 'They reduce the share count, so the same profit is spread over fewer shares. Retiring 5% of shares raises EPS by about 5.3% even if net income does not change.' }
  ],
  related: ['pe-ratio-calculator', 'dividend-payout-ratio-calculator', 'profit-margin-calculator', 'business-valuation-calculator'],
  sources: [
    { name: 'SEC Investor.gov: Price-earnings (P/E) ratio and earnings per share', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/price-earnings-pe-ratio' },
    { name: 'SEC: Beginners\' Guide to Financial Statements', url: 'https://www.sec.gov/files/investor/pubs/begfinstmtguide.htm' },
    { name: 'SEC Investor.gov: Stocks FAQs', url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks' },
    { name: 'CFA Institute', url: 'https://www.cfainstitute.org/' }
  ]
};
