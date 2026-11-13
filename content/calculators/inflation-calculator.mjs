export default {
  slug: 'inflation-calculator',
  hub: 'investing',
  name: 'Inflation Calculator',
  title: 'Inflation Calculator: Prices Rose 82.17% From 2000 to 2024',
  h1: 'Inflation Rate Calculator: Total and Yearly Inflation Between Any Two Years',
  meta: 'U.S. prices rose 82.17% from 2000 to 2024, or 2.53% a year, by the BLS CPI-U. Find the inflation rate between any two years from 1913 to 2025 or two CPI values.',
  keyword: 'how to calculate inflation',
  also: ['inflation calculator', 'how to calculate the inflation rate between two years', 'how to calculate consumer price index and inflation rate', 'how to calculate the consumer price index', 'how to calculate percentage change in cpi', 'how do we calculate inflation', 'average inflation rate calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate inflation between', type: 'select', value: 'years', options: [['years', 'Two years (BLS CPI-U, 1913–2025)'], ['cpi', 'Two CPI or price values I enter']] },
    { id: 'from', label: 'Start year', type: 'number', value: 2000, showIf: { mode: ['years'] } },
    { id: 'to', label: 'End year', type: 'number', value: 2024, showIf: { mode: ['years'] } },
    { id: 'c1', label: 'Starting CPI (or price)', type: 'number', value: 304.702, showIf: { mode: ['cpi'] } },
    { id: 'c2', label: 'Ending CPI (or price)', type: 'number', value: 313.689, showIf: { mode: ['cpi'] } },
    { id: 'span', label: 'Years between them (optional)', type: 'number', value: '', placeholder: 'e.g. 1', showIf: { mode: ['cpi'] }, help: 'Add this to get an average yearly rate.' }
  ],
  data: {
    cpi: { 1913: 9.9, 1914: 10.0, 1915: 10.1, 1916: 10.9, 1917: 12.8, 1918: 15.1, 1919: 17.3, 1920: 20.0, 1921: 17.9, 1922: 16.8, 1923: 17.1, 1924: 17.1, 1925: 17.5, 1926: 17.7, 1927: 17.4, 1928: 17.1, 1929: 17.1, 1930: 16.7, 1931: 15.2, 1932: 13.7, 1933: 13.0, 1934: 13.4, 1935: 13.7, 1936: 13.9, 1937: 14.4, 1938: 14.1, 1939: 13.9, 1940: 14.0, 1941: 14.7, 1942: 16.3, 1943: 17.3, 1944: 17.6, 1945: 18.0, 1946: 19.5, 1947: 22.3, 1948: 24.1, 1949: 23.8, 1950: 24.1, 1951: 26.0, 1952: 26.5, 1953: 26.7, 1954: 26.9, 1955: 26.8, 1956: 27.2, 1957: 28.1, 1958: 28.9, 1959: 29.1, 1960: 29.6, 1961: 29.9, 1962: 30.2, 1963: 30.6, 1964: 31.0, 1965: 31.5, 1966: 32.4, 1967: 33.4, 1968: 34.8, 1969: 36.7, 1970: 38.8, 1971: 40.5, 1972: 41.8, 1973: 44.4, 1974: 49.3, 1975: 53.8, 1976: 56.9, 1977: 60.6, 1978: 65.2, 1979: 72.6, 1980: 82.4, 1981: 90.9, 1982: 96.5, 1983: 99.6, 1984: 103.9, 1985: 107.6, 1986: 109.6, 1987: 113.6, 1988: 118.3, 1989: 124.0, 1990: 130.7, 1991: 136.2, 1992: 140.3, 1993: 144.5, 1994: 148.2, 1995: 152.4, 1996: 156.9, 1997: 160.5, 1998: 163.0, 1999: 166.6, 2000: 172.2, 2001: 177.1, 2002: 179.9, 2003: 184.0, 2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.342, 2008: 215.303, 2009: 214.537, 2010: 218.056, 2011: 224.939, 2012: 229.594, 2013: 232.957, 2014: 236.736, 2015: 237.017, 2016: 240.007, 2017: 245.120, 2018: 251.107, 2019: 255.657, 2020: 258.811, 2021: 270.970, 2022: 292.655, 2023: 304.702, 2024: 313.689, 2025: 321.943 },
    estimate: 2025
  },
  compute(v, H, D) {
    var c1, c2, span, lab1, lab2, note = '';
    if (v.mode === 'cpi') {
      c1 = v.c1; c2 = v.c2; span = v.span;
      if (!(c1 > 0) || !(c2 > 0)) return { error: 'Enter both CPI (or price) values.' };
      lab1 = 'start'; lab2 = 'end';
    } else {
      var a = Math.round(v.from), b = Math.round(v.to);
      if (!(a >= 1913 && a <= 2025) || !(b >= 1913 && b <= 2025)) return { error: 'Pick years between 1913 and 2025.' };
      if (a === b) return { error: 'Choose two different years.' };
      if (b < a) { var t = a; a = b; b = t; }
      c1 = D.cpi[a]; c2 = D.cpi[b]; span = b - a; lab1 = String(a); lab2 = String(b);
      if (b === D.estimate || a === D.estimate) note = ' The ' + D.estimate + ' index is an 11-month average (BLS did not collect October 2025 prices), so treat it as an estimate.';
    }
    var total = (c2 / c1 - 1) * 100;
    var rows = [['CPI ' + lab1 + ' → ' + lab2, H.num(c1, 3) + ' → ' + H.num(c2, 3)]];
    if (span > 0) {
      var avg = (Math.pow(c2 / c1, 1 / span) - 1) * 100;
      rows.push(['Average yearly inflation', H.fix(avg, 2) + '%', true]);
      rows.push(['Years', H.num(span, 2)]);
    }
    rows.push(['$100 at the start equals', H.money(100 * c2 / c1)]);
    rows.push(['Purchasing power change of $1', (c1 / c2 < 1 ? '−' : '+') + H.pct(Math.abs(1 - c1 / c2) * 100, 1)]);
    return {
      value: (total < 0 ? '−' : '') + H.fix(Math.abs(total), 2) + '%',
      label: total >= 0 ? 'Cumulative inflation, ' + lab1 + ' to ' + lab2 : 'Prices fell (deflation), ' + lab1 + ' to ' + lab2,
      expr: '(' + H.num(c2, 3) + ' − ' + H.num(c1, 3) + ') ÷ ' + H.num(c1, 3) + ' × 100',
      rows: rows,
      sub: (v.mode === 'cpi' ? 'Something that cost $100 at the start costs ' + H.money(100 * c2 / c1) + ' at the end.' : total >= 0 ? 'A basket that cost $100 in ' + lab1 + ' cost ' + H.money(100 * c2 / c1) + ' in ' + lab2 + '.' : 'Prices were lower in ' + lab2 + ' than in ' + lab1 + '.') + note
    };
  },
  quick: ({ r }) => `Inflation = (ending CPI − starting CPI) ÷ starting CPI × 100. Using BLS CPI-U annual averages, U.S. prices rose <strong>${r.value}</strong> from 2000 (172.2) to 2024 (313.689), an average of <strong>2.53% a year</strong>. Inflation in 2024 alone was <strong>2.95%</strong> (304.702 → 313.689), down from 8.00% in 2022.`,
  stepsTitle: 'How to calculate inflation between two years',
  steps: [
    'Look up the Consumer Price Index for both years. This calculator has the BLS CPI-U U.S. city average annual averages (1982–84 = 100) built in from 1913 to 2025.',
    'Subtract the starting CPI from the ending CPI and divide by the starting CPI. Multiply by 100 for a percentage: that is cumulative inflation.',
    'For the average yearly rate, divide the ending CPI by the starting CPI, raise it to the power 1 ÷ (number of years) and subtract 1. Don\'t divide the cumulative rate by the years; that overstates it.',
    'To compare two monthly CPI readings or two prices of the same item, switch to "Two CPI or price values" and type them in.'
  ],
  formulaTitle: 'What is the formula for the inflation rate?',
  formula: {
    expr: 'Inflation % = (CPI<sub>end</sub> − CPI<sub>start</sub>) ÷ CPI<sub>start</sub> × 100<br>Average yearly rate = (CPI<sub>end</sub> ÷ CPI<sub>start</sub>)<sup>1/years</sup> − 1',
    vars: [['CPI<sub>start</sub>', 'index value in the earlier year'], ['CPI<sub>end</sub>', 'index value in the later year'], ['years', 'number of years between them']],
    note: 'The same percent-change formula works for any price: a gallon of milk that went from $3.20 to $4.00 rose 25%.'
  },
  example: `<p>What was inflation from 2000 to 2024?</p>
<p>CPI-U 2000 = 172.2; CPI-U 2024 = 313.689. Cumulative inflation = (313.689 − 172.2) ÷ 172.2 × 100 = <strong>82.17%</strong>.</p>
<p>Average yearly rate = (313.689 ÷ 172.2)<sup>1/24</sup> − 1 = 1.82166<sup>0.04167</sup> − 1 = <strong>2.53% a year</strong>.</p>
<p>Simply dividing 82.17% by 24 would give 3.42%, which is too high because each year's inflation builds on the last.</p>`,
  table: {
    title: 'What was the U.S. inflation rate each year?',
    intro: 'Annual inflation from the change in the yearly average CPI-U, computed by the calculator above from BLS data.',
    head: ['Year', 'CPI-U annual average', 'Inflation rate'],
    rows: ({ run, D }) => [2008, 2009, 2010, 2012, 2014, 2015, 2016, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => [y === 2025 ? '2025 (estimate)' : String(y), (y >= 2007 ? D.cpi[y].toFixed(3) : D.cpi[y].toFixed(1)), run({ mode: 'years', from: y - 1, to: y }).value]),
    note: 'BLS headlines usually quote the 12-month change from one month to the same month a year earlier (for example December to December), so those figures differ slightly from the annual-average rates here.'
  },
  sections: [
    {
      h2: 'How do you calculate the consumer price index?',
      html: `<p>The CPI is the cost of a fixed basket of goods and services in a given period divided by the cost of the same basket in a base period, times 100. BLS prices tens of thousands of items every month (food, rent, fuel, medical care, cars and more) and weights them by how much urban households spend on each. The base for CPI-U is the average of 1982–1984 = 100, so a 2024 index of 313.689 means the basket cost 3.14 times what it did then.</p>
<p>If a basket costs $250 in the base year and $290 now, the index is 290 ÷ 250 × 100 = 116, and inflation since the base year is 16%.</p>`
    },
    {
      h2: 'What was the average inflation rate in each decade?',
      html: `<p>Average yearly inflation by decade, from the CPI-U annual averages:</p>
<ul><li><strong>1930s:</strong> −2.05% a year (Great Depression deflation)</li><li><strong>1940s:</strong> 5.53%</li><li><strong>1950s:</strong> 2.03%</li><li><strong>1960s:</strong> 2.35%</li><li><strong>1970s:</strong> 7.06%</li><li><strong>1980s:</strong> 5.50%</li><li><strong>1990s:</strong> 3.00%</li><li><strong>2000s:</strong> 2.56%</li><li><strong>2010s:</strong> 1.77%</li></ul>
<p>Over the full record from 1913 to 2024, inflation averaged 3.16% a year. The Federal Reserve targets 2% over time, measured with a different index (PCE), which tends to run a little below CPI.</p>`
    },
    {
      h2: 'Why is the 2025 inflation figure an estimate?',
      html: `<p>BLS normally averages 12 monthly indexes for the annual figure. The federal government shutdown in October 2025 stopped price collection, and no October 2025 index was published. The 2025 value here, 321.943, is the average of the 11 monthly CPI-U indexes BLS did release, which puts 2025 inflation at about 2.63%. Use it as an estimate; the years 1913–2024 are final.</p>`
    },
    {
      h2: 'Inflation rate or dollar value: which do you need?',
      html: `<p>This page answers "how much did prices rise?" as a percentage. If your question is "what is $X from a past year worth now?", the <a href="/dollar-value-calculator">dollar value calculator</a> converts the amount directly, including to the latest monthly index. To see how inflation erodes savings or a fixed income over time, try the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What was the inflation rate in 2024?', a: 'Using annual averages, U.S. inflation in 2024 was 2.95%: the CPI-U rose from 304.702 in 2023 to 313.689 in 2024. That was down from 4.12% in 2023 and 8.00% in 2022.' },
    { q: 'What year had the highest inflation in the U.S.?', a: 'In the CPI record since 1913, 1918 had the highest annual-average inflation at 17.97%, followed by 1917 (17.43%) and 1920 (15.61%). The post-war peak was 14.36% in 1947 and the modern peak was 13.50% in 1980.' },
    { q: 'How do you calculate the percentage change in CPI?', a: 'Subtract the old CPI from the new CPI, divide by the old CPI and multiply by 100. From 2021 (270.970) to 2022 (292.655): 21.685 ÷ 270.970 × 100 = 8.00%.' },
    { q: 'What is the difference between cumulative and annual inflation?', a: 'Cumulative inflation is the total rise over the whole period (82.17% from 2000 to 2024). Annual inflation is the compound rate per year that produces that total (2.53%).' },
    { q: 'When did the U.S. last have deflation?', a: 'On an annual-average basis, 2009 was the last year prices fell, by 0.36%. The deepest deflation years were 1921 (−10.50%) and 1932 (−9.87%).' },
    { q: 'What is CPI-U?', a: 'CPI-U is the Consumer Price Index for All Urban Consumers, covering more than 90% of the U.S. population. It is the headline inflation measure. CPI-W, a narrower index for wage earners, is the one used for Social Security cost-of-living adjustments.' },
    { q: 'Can I calculate inflation for one product?', a: 'Yes. Choose "Two CPI or price values" and enter the old and new price. A $4.00 item that now costs $4.60 has risen 15%; add the number of years to get an average yearly rate.' }
  ],
  related: ['dollar-value-calculator', 'how-long-will-money-last-calculator', 'cagr-calculator', 'compound-interest-calculator', 'retirement-calculator'],
  sources: [
    { name: 'U.S. Bureau of Labor Statistics: Consumer Price Index', url: 'https://www.bls.gov/cpi/' },
    { name: 'BLS: Consumer Price Index frequently asked questions', url: 'https://www.bls.gov/cpi/questions-and-answers.htm' },
    { name: 'BLS: CPI Inflation Calculator', url: 'https://www.bls.gov/data/inflation_calculator.htm' }
  ]
};
