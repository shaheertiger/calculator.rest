export default {
  slug: 'nominal-gdp-calculator',
  hub: 'business',
  name: 'Nominal GDP Calculator',
  title: 'Nominal GDP Calculator: $5,500 Nominal vs $4,550 Real GDP',
  h1: 'Nominal GDP Calculator with Real GDP and the GDP Deflator',
  meta: 'Three goods at current prices sum to a $5,500 nominal GDP against $4,550 in base-year prices, a deflator of 120.88. Solve textbook problems three ways.',
  keyword: 'how do you calculate nominal gdp',
  also: ['nominal gdp calculator', 'which of the following is included in gdp calculations', 'how to calculate the percentage change in real gdp'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Method', type: 'select', value: 'pq', options: [['pq', 'Prices × quantities (goods list)'], ['deflator', 'Real GDP × GDP deflator'], ['spend', 'Expenditure: C + I + G + (X − M)']] },
    {
      id: 'goods', label: 'Final goods and services', type: 'rows', addLabel: '+ add good', max: 20, wide: true, showIf: { mode: ['pq'] },
      fields: [
        { id: 'name', label: 'Good', type: 'text', value: '', blank: true, placeholder: 'e.g. Apples' },
        { id: 'price', label: 'Price this year', type: 'number', value: 1 },
        { id: 'qty', label: 'Quantity', type: 'number', value: 100 },
        { id: 'base', label: 'Base-year price', type: 'number', value: '', blank: true, placeholder: 'for real GDP' }
      ],
      value: [
        { name: 'Apples', price: 2, qty: 1000, base: 1.5 },
        { name: 'Bread', price: 3, qty: 500, base: 2.5 },
        { name: 'Haircuts', price: 20, qty: 100, base: 18 }
      ]
    },
    { id: 'real', label: 'Real GDP', type: 'number', value: 23500, prefix: '$', suffix: 'billion', showIf: { mode: ['deflator'] } },
    { id: 'defl', label: 'GDP price deflator', type: 'number', value: 128, help: 'Base year = 100.', showIf: { mode: ['deflator'] } },
    { id: 'c', label: 'Consumption (C)', type: 'number', value: 20000, prefix: '$', suffix: 'billion', showIf: { mode: ['spend'] } },
    { id: 'i', label: 'Gross private investment (I)', type: 'number', value: 5100, prefix: '$', suffix: 'billion', showIf: { mode: ['spend'] } },
    { id: 'g', label: 'Government spending (G)', type: 'number', value: 5200, prefix: '$', suffix: 'billion', showIf: { mode: ['spend'] } },
    { id: 'x', label: 'Exports (X)', type: 'number', value: 3200, prefix: '$', suffix: 'billion', showIf: { mode: ['spend'] } },
    { id: 'm', label: 'Imports (M)', type: 'number', value: 4100, prefix: '$', suffix: 'billion', showIf: { mode: ['spend'] } }
  ],
  compute(v, H) {
    if (v.mode === 'deflator') {
      if (!(v.real > 0)) return { error: 'Enter real GDP.' };
      if (!(v.defl > 0)) return { error: 'Enter the GDP deflator (base year = 100).' };
      var nom = v.real * v.defl / 100;
      return {
        value: H.money(nom, 1) + 'B',
        label: 'Nominal GDP',
        expr: H.money(v.real, 1) + 'B × ' + H.num(v.defl, 3) + ' ÷ 100',
        rows: [['Real GDP', H.money(v.real, 1) + 'B'], ['Price level vs base year', (v.defl >= 100 ? '+' : '') + H.fix(v.defl - 100, 2) + '%'], ['Gap from inflation', H.money(nom - v.real, 1) + 'B', true]],
        sub: 'Nominal GDP is real GDP restated in current prices.'
      };
    }
    if (v.mode === 'spend') {
      var parts = [v.c, v.i, v.g, v.x, v.m];
      for (var j = 0; j < 5; j++) if (!(parts[j] >= 0)) return { error: 'Enter all five components (0 if none).' };
      var gdp = v.c + v.i + v.g + v.x - v.m;
      var nx = v.x - v.m;
      return {
        value: H.money(gdp, 1) + 'B',
        label: 'Nominal GDP (expenditure approach)',
        expr: 'C + I + G + (X − M)',
        rows: [
          ['Consumption share', gdp > 0 ? H.fix(v.c / gdp * 100, 1) + '%' : '—'],
          ['Investment share', gdp > 0 ? H.fix(v.i / gdp * 100, 1) + '%' : '—'],
          ['Government share', gdp > 0 ? H.fix(v.g / gdp * 100, 1) + '%' : '—'],
          ['Net exports (X − M)', (nx < 0 ? '−' : '') + H.money(Math.abs(nx), 1) + 'B', nx < 0]
        ],
        sub: nx < 0 ? 'Imports exceed exports, so net exports subtract from GDP.' : 'Exports exceed imports, so net exports add to GDP.'
      };
    }
    var nomT = 0, realT = 0, n = 0, haveBase = true;
    (v.goods || []).forEach(function (g) {
      if (!(g.price >= 0) || !(g.qty >= 0)) return;
      nomT += g.price * g.qty; n++;
      if (g.base >= 0) realT += g.base * g.qty; else haveBase = false;
    });
    if (!n) return { error: 'Add at least one good with a price and quantity.' };
    var rows = [['Goods counted', String(n)]];
    var out = { value: H.money(nomT), label: 'Nominal GDP', expr: 'Σ (current price × quantity)', rows: rows, sub: 'Add base-year prices to every good to get real GDP and the deflator.' };
    if (haveBase && realT > 0) {
      var d = nomT / realT * 100;
      rows.push(['Real GDP (base-year prices)', H.money(realT), true]);
      rows.push(['GDP deflator', H.fix(d, 2), true]);
      rows.push(['Price change since base year', (d >= 100 ? '+' : '') + H.fix(d - 100, 2) + '%']);
      out.sub = 'Of the ' + H.money(nomT - realT) + ' gap between nominal and real GDP, all of it is price change: quantities are the same in both.';
    }
    return out;
  },
  quick: ({ r }) => `Nominal GDP is the sum of every final good and service produced, valued at this year's prices: Σ (price × quantity). An economy making 1,000 apples at $2, 500 loaves at $3 and 100 haircuts at $20 has a nominal GDP of <strong>${r.value}</strong>. At base-year prices the same output is $4,550, so the GDP deflator is 120.88. Nominal GDP also equals real GDP × deflator ÷ 100.`,
  stepsTitle: 'How to calculate nominal GDP',
  steps: [
    'List the <strong>final</strong> goods and services produced in the year. Leave out intermediate goods (the flour in the bread) so nothing is counted twice.',
    'Multiply each good\'s <strong>current-year price</strong> by the quantity produced that year.',
    'Add the results. That sum is nominal GDP.',
    'For real GDP, repeat with <strong>base-year prices</strong> and the same quantities. The deflator is nominal ÷ real × 100. Using current prices for real GDP is the slip most textbook problems are built to catch.'
  ],
  formulaTitle: 'What is the formula for nominal GDP?',
  formula: {
    expr: 'Nominal GDP = Σ (P<sub>current</sub> × Q<sub>current</sub>)<br>Real GDP = Σ (P<sub>base</sub> × Q<sub>current</sub>)<br>Nominal GDP = Real GDP × GDP deflator ÷ 100<br>Nominal GDP = C + I + G + (X − M)',
    vars: [['P, Q', 'price and quantity of each final good'], ['GDP deflator', 'price index with the base year = 100'], ['C, I, G', 'consumer spending, gross private investment, government purchases'], ['X − M', 'exports minus imports (net exports)']]
  },
  example: `<p>A textbook economy produces three final goods. In the current year: 1,000 apples at $2.00, 500 loaves of bread at $3.00 and 100 haircuts at $20. In the base year the prices were $1.50, $2.50 and $18.</p>
<p>Nominal GDP = 1,000 × $2 + 500 × $3 + 100 × $20 = $2,000 + $1,500 + $2,000 = <strong>$5,500</strong>.</p>
<p>Real GDP = 1,000 × $1.50 + 500 × $2.50 + 100 × $18 = $1,500 + $1,250 + $1,800 = <strong>$4,550</strong>.</p>
<p>GDP deflator = $5,500 ÷ $4,550 × 100 = <strong>120.88</strong>, so prices are 20.88% higher than in the base year.</p>`,
  table: {
    title: 'How do nominal growth and inflation combine into real GDP growth?',
    intro: 'Real growth is (1 + nominal growth) ÷ (1 + inflation) − 1. The quick "nominal minus inflation" shortcut is close for small numbers and drifts as they grow. Each row restates $1,000 billion of last year\'s GDP.',
    head: ['Nominal growth', 'Deflator change', 'This year\'s nominal GDP', 'Real growth (exact)', 'Shortcut'],
    rows: ({ run, H }) => [[3, 1], [4, 2], [5, 3], [6, 2.5], [4, 4], [2, 3], [8, 5], [12, 8], [-2, 1]].map(([n, p]) => {
      const r = run({ mode: 'deflator', real: 1000 * (1 + n / 100) / (1 + p / 100), defl: 100 + p });
      return [H.fix(n, 1) + '%', H.fix(p, 1) + '%', r.value, H.fix(((1 + n / 100) / (1 + p / 100) - 1) * 100, 2) + '%', H.fix(n - p, 1) + '%'];
    })
  },
  sections: [
    {
      h2: 'What is the difference between nominal and real GDP?',
      html: `<p><strong>Nominal GDP</strong> values output at the prices of the year it was produced, so it rises when either output or prices rise. <strong>Real GDP</strong> values output at a fixed base year's prices, so it changes only when quantities change. If nominal GDP rose 5% and prices rose 3%, real output grew about 1.9%.</p>
<p>Use nominal GDP for ratios to other current-dollar figures, such as debt-to-GDP or tax revenue as a share of GDP. Use real GDP to measure economic growth over time. The BEA publishes both each quarter; its real GDP uses a chain-weighted index rather than a single base year, but the logic is the same.</p>`
    },
    {
      h2: 'How do you calculate the GDP deflator?',
      html: `<p>Divide nominal GDP by real GDP and multiply by 100: deflator = nominal ÷ real × 100. With $5,500 nominal and $4,550 real, the deflator is 120.88. Rearranged, real GDP = nominal GDP ÷ deflator × 100, which is how you convert a nominal figure into base-year dollars.</p>
<p>The deflator covers everything produced domestically, including business equipment and government purchases. The consumer price index (CPI) tracks a basket of consumer purchases, including imports. For inflation over time in everyday prices, see the <a href="/inflation-calculator">inflation calculator</a>.</p>`
    },
    {
      h2: 'What is included in GDP calculations?',
      html: `<p>GDP counts the market value of all <strong>final</strong> goods and services <strong>produced within the country</strong> in a period.</p>
<ul><li><strong>Included:</strong> new goods bought by households, business investment in equipment, software and buildings, new homes, changes in inventories, government purchases (including public employees' pay), and exports minus imports.</li>
<li><strong>Not included:</strong> intermediate goods used up in production, used goods resold (a used car), purely financial transactions (buying stocks or bonds), transfer payments such as Social Security, unpaid household work, and illegal activity.</li></ul>
<p>The commission a dealer earns selling a used car does count, because that is a service produced this year. Goods made abroad by a U.S. company count in the other country's GDP.</p>`
    },
    {
      h2: 'How do you calculate the percentage change in real GDP?',
      html: `<p>Subtract last year's real GDP from this year's, divide by last year's, and multiply by 100. If real GDP rose from $22,800 billion to $23,370 billion, growth = ($23,370 − $22,800) ÷ $22,800 × 100 = <strong>2.5%</strong>. BEA's quarterly headline figure is that quarter's change expressed at an annual rate, which roughly multiplies the quarterly change by four (compounded). For growth over several years, use the <a href="/cagr-calculator">CAGR calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for nominal GDP?', a: 'Nominal GDP = the sum of current-year price × current-year quantity for every final good and service. Equivalently, nominal GDP = real GDP × GDP deflator ÷ 100, or C + I + G + (X − M) in current dollars.' },
    { q: 'How do you calculate nominal GDP from real GDP and the deflator?', a: 'Multiply real GDP by the deflator and divide by 100. $23,500 billion of real GDP with a deflator of 128 is $30,080 billion of nominal GDP.' },
    { q: 'Can nominal GDP be lower than real GDP?', a: 'Yes, in any year whose prices are below the base year\'s, so the deflator is under 100. In the base year itself, nominal and real GDP are equal.' },
    { q: 'Why is nominal GDP misleading for growth?', a: 'Because it rises with inflation even if the economy produces nothing more. Real GDP removes price changes, so it shows how much output actually grew.' },
    { q: 'Is nominal GDP the same as GDP at current prices?', a: 'Yes. Nominal GDP, current-dollar GDP and GDP at current prices all mean output valued at the prices of the year it was produced.' },
    { q: 'How do you calculate nominal GDP per capita?', a: 'Divide nominal GDP by the population. $30 trillion of GDP shared by 340 million people is about $88,235 per person.' },
    { q: 'Who calculates U.S. GDP?', a: 'The Bureau of Economic Analysis (BEA), part of the U.S. Department of Commerce. It releases advance, second and third estimates for each quarter and revises them as more data arrive.' }
  ],
  related: ['inflation-calculator', 'unemployment-rate-calculator', 'percentage-change-calculator', 'cagr-calculator', 'productivity-calculator'],
  sources: [
    { name: 'U.S. Bureau of Economic Analysis: Gross Domestic Product', url: 'https://www.bea.gov/data/gdp/gross-domestic-product' },
    { name: 'BEA: Measuring the Economy, a primer on GDP and the national accounts', url: 'https://www.bea.gov/resources/methodologies/measuring-the-economy' },
    { name: 'OpenStax Principles of Economics 3e: Measuring the size of the economy (GDP)', url: 'https://openstax.org/books/principles-economics-3e/pages/19-1-measuring-the-size-of-the-economy-gross-domestic-product' },
    { name: 'OpenStax Principles of Economics 3e: Adjusting nominal values to real values', url: 'https://openstax.org/books/principles-economics-3e/pages/19-2-adjusting-nominal-values-to-real-values' }
  ]
};
