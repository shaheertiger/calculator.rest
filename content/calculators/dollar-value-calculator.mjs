const YEARS = [];
for (let y = 2025; y >= 1913; y--) YEARS.push([String(y), y === 2025 ? '2025 (estimate)' : String(y)]);

export default {
  slug: 'dollar-value-calculator',
  hub: 'investing',
  name: 'Dollar Value Calculator',
  title: 'Dollar Value Calculator: $20 in 1932 Is Worth $492.72 Today',
  h1: 'What Is a Past Dollar Amount Worth Today? Convert Any Year Since 1913',
  meta: '$20 in 1932 buys what $492.72 buys today (Oct 2026 CPI-U). Type any amount and year from 1913 on to see its value in today\'s dollars, or in any other year.',
  keyword: 'how much was $20 in 1932',
  also: ['what is $20 in 1932 worth today', 'how much was a dollar worth in 1950', 'how much was 5000 dollars in 1960', 'how much was 10 dollars worth in 1960', 'how much was 100 dollars worth in 1980', 'how much was 3000 in 1990', 'how much was 10 dollars in 1945', 'how much was $200 in 1966', 'value of a dollar calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'amount', label: 'Amount', type: 'number', value: 20, prefix: '$' },
    { id: 'year', label: 'In the year', type: 'number', value: 1932, help: '1913 to 2025' },
    { id: 'target', label: 'Worth in', type: 'select', value: 'latest', options: [['latest', 'Today (Oct 2026 index)']].concat(YEARS) }
  ],
  data: {
    cpi: { 1913: 9.9, 1914: 10.0, 1915: 10.1, 1916: 10.9, 1917: 12.8, 1918: 15.1, 1919: 17.3, 1920: 20.0, 1921: 17.9, 1922: 16.8, 1923: 17.1, 1924: 17.1, 1925: 17.5, 1926: 17.7, 1927: 17.4, 1928: 17.1, 1929: 17.1, 1930: 16.7, 1931: 15.2, 1932: 13.7, 1933: 13.0, 1934: 13.4, 1935: 13.7, 1936: 13.9, 1937: 14.4, 1938: 14.1, 1939: 13.9, 1940: 14.0, 1941: 14.7, 1942: 16.3, 1943: 17.3, 1944: 17.6, 1945: 18.0, 1946: 19.5, 1947: 22.3, 1948: 24.1, 1949: 23.8, 1950: 24.1, 1951: 26.0, 1952: 26.5, 1953: 26.7, 1954: 26.9, 1955: 26.8, 1956: 27.2, 1957: 28.1, 1958: 28.9, 1959: 29.1, 1960: 29.6, 1961: 29.9, 1962: 30.2, 1963: 30.6, 1964: 31.0, 1965: 31.5, 1966: 32.4, 1967: 33.4, 1968: 34.8, 1969: 36.7, 1970: 38.8, 1971: 40.5, 1972: 41.8, 1973: 44.4, 1974: 49.3, 1975: 53.8, 1976: 56.9, 1977: 60.6, 1978: 65.2, 1979: 72.6, 1980: 82.4, 1981: 90.9, 1982: 96.5, 1983: 99.6, 1984: 103.9, 1985: 107.6, 1986: 109.6, 1987: 113.6, 1988: 118.3, 1989: 124.0, 1990: 130.7, 1991: 136.2, 1992: 140.3, 1993: 144.5, 1994: 148.2, 1995: 152.4, 1996: 156.9, 1997: 160.5, 1998: 163.0, 1999: 166.6, 2000: 172.2, 2001: 177.1, 2002: 179.9, 2003: 184.0, 2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.342, 2008: 215.303, 2009: 214.537, 2010: 218.056, 2011: 224.939, 2012: 229.594, 2013: 232.957, 2014: 236.736, 2015: 237.017, 2016: 240.007, 2017: 245.120, 2018: 251.107, 2019: 255.657, 2020: 258.811, 2021: 270.970, 2022: 292.655, 2023: 304.702, 2024: 313.689, 2025: 321.943 },
    latest: { label: 'Oct 2026', cpi: 337.511, t: 2026.79 }
  },
  compute(v, H, D) {
    if (!(v.amount > 0)) return { error: 'Enter a dollar amount.' };
    var y = Math.round(v.year);
    if (!(y >= 1913 && y <= 2025)) return { error: 'The CPI-U starts in 1913. Enter a year from 1913 to 2025.' };
    var c1 = D.cpi[y], c2, label2, t2;
    if (v.target === 'latest' || !D.cpi[v.target]) { c2 = D.latest.cpi; label2 = 'today (' + D.latest.label + ')'; t2 = D.latest.t; }
    else { c2 = D.cpi[v.target]; label2 = 'in ' + v.target; t2 = Number(v.target) + 0.5; }
    var worth = v.amount * c2 / c1;
    var ratio = c2 / c1;
    var span = t2 - (y + 0.5);
    var rows = [
      ['Price multiplier', '× ' + H.fix(ratio, 3)],
      ['Cumulative inflation', H.pct((ratio - 1) * 100, 1)]
    ];
    if (Math.abs(span) >= 1) rows.push(['Average yearly inflation', H.pct((Math.pow(ratio, 1 / span) - 1) * 100, 2)]);
    rows.push([H.money(v.amount) + ' ' + label2 + ' in ' + y + ' dollars', H.money(v.amount / ratio), true]);
    rows.push(['CPI-U ' + y + ' → ' + (v.target === 'latest' ? D.latest.label : v.target), H.num(c1, 3) + ' → ' + H.num(c2, 3)]);
    return {
      value: H.money(worth),
      label: H.money(v.amount) + ' from ' + y + ', ' + label2,
      expr: H.money(v.amount) + ' × ' + H.num(c2, 3) + ' ÷ ' + H.num(c1, 3),
      rows: rows,
      sub: ratio >= 1 ? 'A dollar in ' + y + ' bought as much as ' + H.money(ratio) + ' ' + label2 + '.' : 'Prices were lower ' + label2 + ' than in ' + y + ', so the same money bought more.'
    };
  },
  quick: ({ r }) => `<strong>$20 in 1932</strong> had the same buying power as about <strong>${r.value}</strong> today, based on the BLS CPI-U (13.7 for 1932 vs. 337.511 in October 2026). Prices are 24.6 times higher, so each 1932 dollar is worth $24.64 now. Put the other way, $20 today would have bought what $0.81 bought in 1932.`,
  stepsTitle: 'How to find what an old dollar amount is worth today',
  steps: [
    'Enter the amount and the year it is from. The calculator has the official CPI-U annual average for every year from 1913 to 2025.',
    'Leave "Worth in" on <strong>Today</strong> to use the latest monthly index (October 2026), or pick any other year to convert between two past years.',
    'Read the result as equal buying power, not as investment growth. $20 kept in a jar since 1932 is still $20; it just buys far less.',
    'Check the reverse row too: it tells you what today\'s amount would have been worth back then, which is how many people phrase the question.'
  ],
  formulaTitle: 'How do you convert past dollars to today\'s dollars?',
  formula: {
    expr: 'Value today = Amount × CPI<sub>today</sub> ÷ CPI<sub>then</sub>',
    vars: [['Amount', 'the dollar figure from the past year'], ['CPI<sub>then</sub>', 'CPI-U annual average for that year'], ['CPI<sub>today</sub>', 'latest CPI-U (or the annual average of the target year)']],
    note: 'Going backward is the same ratio upside down: Amount today × CPI<sub>then</sub> ÷ CPI<sub>today</sub>.'
  },
  example: `<p>How much was $5,000 in 1960 worth in today's money?</p>
<p>CPI-U 1960 = 29.6. CPI-U October 2026 = 337.511. Ratio = 337.511 ÷ 29.6 = 11.402.</p>
<p>$5,000 × 11.402 = <strong>$57,011.99</strong>. So a $5,000 car or down payment in 1960 is like spending about $57,000 today.</p>
<p>Converting to the 2025 average instead (321.943) gives $54,382.26; the difference is the inflation from 2025 to late 2026.</p>`,
  table: {
    title: 'How much are popular past amounts worth today?',
    intro: 'Amounts people often ask about, converted to October 2026 dollars by the calculator above.',
    head: ['Amount and year', 'Worth today', 'Multiplier'],
    rows: ({ run }) => [[1, 1913], [20, 1932], [10, 1945], [1, 1950], [10, 1960], [5000, 1960], [200, 1966], [5, 1973], [100, 1980], [3000, 1990], [100000, 1990], [175000, 1996], [1, 2000], [100, 2010], [20, 2020]].map(([a, y]) => {
      const r = run({ amount: a, year: y, target: 'latest' });
      return ['$' + a.toLocaleString('en-US') + ' in ' + y, r.value, r.rows[0][1]];
    }),
    note: 'CPI-U annual averages from BLS; the today column uses the October 2026 monthly index (not seasonally adjusted), so it moves a little each month.'
  },
  sections: [
    {
      h2: 'How much was $20 worth in 1932?',
      html: `<p>In 1932, at the bottom of the Great Depression, prices had fallen almost 20% from 1929, so a dollar stretched further than it had for years. $20 then equals about <strong>$492.72</strong> in October 2026 dollars, or $469.99 in 2025 dollars. For a sense of scale, the official U.S. gold price in 1932 was $20.67 an ounce, so a $20 bill was close to an ounce of gold before the dollar was revalued to $35 an ounce in 1934. A dime in 1932 is roughly $2.46 today.</p>`
    },
    {
      h2: 'How much was a dollar worth in 1950 and 1960?',
      html: `<p>One dollar in 1950 equals <strong>$14.00</strong> today; one dollar in 1960 equals <strong>$11.40</strong>. Searches for 1960 amounts are especially common, so here they are worked out (October 2026 dollars):</p>
<ul><li>$10 in 1960: $114.02</li><li>$25 in 1960: $285.06</li><li>$200 in 1960: $2,280.48</li><li>$500 in 1960: $5,701.20</li><li>$2,500 in 1960: $28,506.00</li><li>$3,500 in 1960: $39,908.40</li><li>$40,000 in 1960: $456,095.95</li></ul>`
    },
    {
      h2: 'Can I convert amounts from before 1913?',
      html: `<p>Not with the official CPI: BLS index numbers start in 1913. Questions about the 1800s or the Gilded Age (for example $300,000 in 1880 or $10 in 1899) need a historical estimate. The Federal Reserve Bank of Minneapolis publishes a CPI series back to 1800 built from older price studies; treat results from it as approximate, because 19th-century households bought very different things.</p>`
    },
    {
      h2: 'Why do inflation calculators give different answers?',
      html: `<p>Three reasons. First, the "today" index: this page uses the latest monthly CPI-U, while some tools use the last full-year average (our 2025 average, 321.943, is itself an estimate because October 2025 prices were never collected). Second, the starting point: an annual average vs. a specific month can differ by several percent in high-inflation years. Third, the measure: CPI tracks consumer prices; comparing wages, home prices or GDP per person gives much bigger multipliers. For the percentage rate between two years, use the <a href="/inflation-calculator">inflation calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How much was $10 in 1945 worth today?', a: '$10 in 1945 is worth about $187.51 today (October 2026 CPI-U). Prices are about 18.8 times higher than in 1945.' },
    { q: 'How much was $100 worth in 1980?', a: '$100 in 1980 has the buying power of about $409.60 today. 1980 itself had 13.5% inflation, the highest annual rate since 1947.' },
    { q: 'How much was $3,000 in 1990?', a: '$3,000 in 1990 equals about $7,747.00 today. $100,000 in 1990 equals about $258,233.36.' },
    { q: 'How much was $200 in 1966 worth?', a: '$200 in 1966 is worth about $2,083.40 today, using the 1966 CPI-U of 32.4.' },
    { q: 'How much is $5 from 1973 worth now?', a: '$5 in 1973 equals about $38.01 today. Prices have risen about 7.6 times since then.' },
    { q: 'What would $100 today have been worth in 1950?', a: 'About $7.14. Divide today\'s amount by the 1950 multiplier of 14.00, or set the year to 1950 and read the reverse row.' },
    { q: 'Does this account for interest or investment growth?', a: 'No. It only measures buying power. To see what money would have grown to if invested, use a compound interest or CAGR calculation with an assumed return.' }
  ],
  related: ['inflation-calculator', 'compound-interest-calculator', 'cagr-calculator', 'how-long-will-money-last-calculator'],
  sources: [
    { name: 'BLS: CPI Inflation Calculator', url: 'https://www.bls.gov/data/inflation_calculator.htm' },
    { name: 'U.S. Bureau of Labor Statistics: Consumer Price Index', url: 'https://www.bls.gov/cpi/' },
    { name: 'FRED (St. Louis Fed): CPI-U, all items, U.S. city average, not seasonally adjusted', url: 'https://fred.stlouisfed.org/series/CPIAUCNS' },
    { name: 'Federal Reserve Bank of Minneapolis: Consumer Price Index, 1800–', url: 'https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1800-' }
  ]
};
