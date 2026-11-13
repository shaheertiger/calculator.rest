export default {
  slug: 'population-growth-calculator',
  hub: 'science',
  name: 'Population Growth Rate Calculator',
  title: 'Population Growth Rate Calculator: +60,000 on 10M Is 0.60%',
  h1: 'Population Growth Rate Calculator with Births, Deaths, Migration and Projections',
  meta: 'Growth rate = (births − deaths + net migration) ÷ population, so a net gain of 60,000 on 10 million is 0.60% a year. Also census-to-census rates and forecasts.',
  keyword: 'how to calculate the population growth rate',
  also: ['population growth calculator', 'how to calculate growth rate apes', 'how to calculate intrinsic growth rate', 'how to calculate crude growth rate', 'how to calculate percent change in population density', 'population projection calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you know?', type: 'select', value: 'components', options: [['components', 'Births, deaths and migration'], ['two', 'Population at two dates'], ['rate', 'The growth rate']] },
    { id: 'pop', label: 'Population (start of year)', type: 'number', value: 10000000, showIf: { mode: ['components', 'rate'] } },
    { id: 'births', label: 'Births per year', type: 'number', value: 120000, showIf: { mode: ['components'] } },
    { id: 'deaths', label: 'Deaths per year', type: 'number', value: 80000, showIf: { mode: ['components'] } },
    { id: 'imm', label: 'Immigrants per year', type: 'number', value: 30000, showIf: { mode: ['components'] } },
    { id: 'emi', label: 'Emigrants per year', type: 'number', value: 10000, showIf: { mode: ['components'] } },
    { id: 'c1', label: 'Earlier population', type: 'number', value: 250000, showIf: { mode: ['two'] } },
    { id: 'c2', label: 'Later population', type: 'number', value: 300000, showIf: { mode: ['two'] } },
    { id: 'gap', label: 'Years between them', type: 'number', value: 10, showIf: { mode: ['two'] } },
    { id: 'rate', label: 'Growth rate', type: 'number', value: 1.2, suffix: '% per year', showIf: { mode: ['rate'] } },
    { id: 'model', label: 'Projection model', type: 'select', value: 'geometric', options: [['geometric', 'Geometric: N × (1 + r)^t'], ['exponential', 'Exponential: N × e^(rt)'], ['logistic', 'Logistic, with a carrying capacity K']] },
    { id: 'K', label: 'Carrying capacity (K)', type: 'number', value: 15000000, showIf: { model: ['logistic'] } },
    { id: 'years', label: 'Project ahead', type: 'number', value: 10, suffix: 'years' }
  ],
  compute(v, H) {
    var P0, r, rows = [], expr, label = 'Annual population growth rate';
    if (v.mode === 'two') {
      if (!(v.c1 > 0) || !(v.c2 > 0)) return { error: 'Enter both population counts.' };
      if (!(v.gap > 0)) return { error: 'Enter the number of years between the counts.' };
      r = Math.pow(v.c2 / v.c1, 1 / v.gap) - 1; P0 = v.c2;
      expr = '(' + H.int(v.c2) + ' ÷ ' + H.int(v.c1) + ')<sup>1/' + H.num(v.gap, 2) + '</sup> − 1';
      rows.push(['Total change', (v.c2 >= v.c1 ? '+' : '−') + H.int(Math.abs(v.c2 - v.c1)) + ' (' + H.pct((v.c2 / v.c1 - 1) * 100, 2) + ')']);
      rows.push(['Simple average per year', H.pct((v.c2 / v.c1 - 1) / v.gap * 100, 3)]);
      rows.push(['Continuous rate r = ln(N₂/N₁) ÷ t', H.num(Math.log(v.c2 / v.c1) / v.gap, 5) + ' per year']);
      label = 'Average annual (compound) growth rate';
    } else if (v.mode === 'rate') {
      if (!(v.pop > 0)) return { error: 'Enter the population.' };
      if (!isFinite(v.rate) || v.rate <= -100) return { error: 'Enter a growth rate in percent per year.' };
      P0 = v.pop; r = v.rate / 100; expr = H.pct(v.rate, 3) + ' per year';
      label = 'Growth rate used';
    } else {
      if (!(v.pop > 0)) return { error: 'Enter the population.' };
      var b = v.births || 0, d = v.deaths || 0, im = v.imm || 0, em = v.emi || 0;
      if (b < 0 || d < 0 || im < 0 || em < 0) return { error: 'Births, deaths and migration counts can\'t be negative.' };
      var net = b - d + im - em;
      P0 = v.pop; r = net / v.pop;
      expr = '(' + H.int(b) + ' − ' + H.int(d) + ' + ' + H.int(im) + ' − ' + H.int(em) + ') ÷ ' + H.int(v.pop);
      rows.push(['Net change per year', (net >= 0 ? '+' : '−') + H.int(Math.abs(net))]);
      rows.push(['Crude birth rate', H.num(b / v.pop * 1000, 2) + ' per 1,000']);
      rows.push(['Crude death rate', H.num(d / v.pop * 1000, 2) + ' per 1,000']);
      rows.push(['Rate of natural increase', H.pct((b - d) / v.pop * 100, 2)]);
      rows.push(['Net migration rate', H.num((im - em) / v.pop * 1000, 2) + ' per 1,000']);
    }
    var t = v.years >= 0 ? v.years : 0, Pt;
    if (v.model === 'logistic' && !(v.K > 0)) return { error: 'Enter a carrying capacity (K).' };
    var kk = Math.log(1 + r);
    function proj(x) {
      if (v.model === 'logistic') return v.K / (1 + (v.K - P0) / P0 * Math.exp(-kk * x));
      if (v.model === 'exponential') return P0 * Math.exp(r * x);
      return P0 * Math.pow(1 + r, x);
    }
    Pt = proj(t);
    if (r > 0) rows.push(['Doubling time', H.num(v.model === 'exponential' ? Math.LN2 / r : Math.LN2 / Math.log(1 + r), 1) + ' years']);
    rows.push(['Population in ' + H.num(t, 2) + ' years', H.int(Pt), true]);
    var n = Math.min(10, Math.max(1, Math.round(t))), trows = [];
    for (var i = 0; i <= n; i++) { var yr = t * i / n; trows.push([H.num(yr, 1), H.int(proj(yr)), (proj(yr) >= P0 ? '+' : '−') + H.int(Math.abs(proj(yr) - P0))]); }
    return {
      value: H.fix(r * 100, 2) + '%',
      label: label,
      expr: expr,
      rows: rows,
      proj: Pt,
      sub: r > 0 ? 'Growing.' + (v.model === 'logistic' ? ' Logistic growth slows as the population approaches K.' : ' At a steady rate the population grows exponentially.') : r < 0 ? 'Shrinking: deaths and emigration outnumber births and immigration.' : 'Zero population growth.',
      table: t > 0 ? { caption: 'Projection (' + v.model + ')', head: ['Year', 'Population', 'Change'], rows: trows } : null
    };
  },
  quick: ({ r }) => `To calculate the population growth rate, add births and immigrants, subtract deaths and emigrants, and divide by the starting population. A country of 10,000,000 with 120,000 births, 80,000 deaths, 30,000 immigrants and 10,000 emigrants gains 60,000 people, a growth rate of <strong>${r.value}</strong> a year. At that rate it reaches about 10.62 million in 10 years.`,
  stepsTitle: 'How to calculate population growth rate',
  steps: [
    'Collect one year of data: births, deaths, immigrants and emigrants, plus the population at the start of the year (or mid-year, as census agencies use).',
    'Find the net change: births − deaths + immigrants − emigrants.',
    'Divide by the population and multiply by 100 to get a percentage. The step people get wrong is dividing per-1,000 rates by 100 instead of 10: a birth rate of 12 per 1,000 is 1.2%, not 0.12%.',
    'To compare two censuses, use the compound rate (later ÷ earlier)<sup>1/years</sup> − 1 rather than dividing the total change by the years.',
    'Project ahead with N<sub>t</sub> = N₀ × (1 + r)<sup>t</sup>, or switch to the logistic model if the population is limited by resources.'
  ],
  formulaTitle: 'What is the population growth rate formula?',
  formula: {
    expr: 'Growth rate = (B − D + I − E) ÷ N × 100%<br>RNI (%) = (CBR − CDR) ÷ 10<br>Between censuses: r = (N₂ ÷ N₁)<sup>1/t</sup> − 1<br>Logistic: dN/dt = rN(1 − N/K)',
    vars: [['B, D', 'births and deaths in the year'], ['I, E', 'immigrants and emigrants in the year'], ['N', 'population at the start (or middle) of the year'], ['CBR, CDR', 'crude birth and death rates per 1,000 people'], ['RNI', 'rate of natural increase (excludes migration)'], ['K', 'carrying capacity, the largest population the environment can sustain']]
  },
  example: `<p>A city counted 250,000 residents in one census and 300,000 ten years later.</p>
<p>Total growth = 50,000, or 20%. Dividing by 10 gives a <em>simple</em> average of 2.0% a year, but that overstates it because growth compounds.</p>
<p>Compound annual rate = (300,000 ÷ 250,000)<sup>1/10</sup> − 1 = 1.2<sup>0.1</sup> − 1 = <strong>1.84% per year</strong>. Projecting another decade at that rate gives 300,000 × 1.2 = 360,000. Choose "Population at two dates" above to repeat it.</p>`,
  table: {
    title: 'How large will a population of 10 million be at different growth rates?',
    intro: 'Projections from 10,000,000 using geometric growth, computed by the calculator.',
    head: ['Annual growth', 'After 10 years', 'After 25 years', 'After 50 years'],
    rows: ({ run, H }) => [-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 4].map(p => [H.pct(p, 1), ...[10, 25, 50].map(y => H.int(run({ mode: 'rate', pop: 10000000, rate: p, model: 'geometric', years: y }).proj))]),
    note: 'Most high-income countries now grow by less than 1% a year, and some are shrinking; a few countries still grow faster than 2.5%. Real populations rarely hold one rate for 50 years.'
  },
  sections: [
    {
      h2: 'How do you calculate population growth rate in APES?',
      html: `<p>AP Environmental Science uses rates per 1,000 people. Growth rate (%) = [(crude birth rate + immigration rate) − (crude death rate + emigration rate)] ÷ 10. With the default numbers: CBR 12, CDR 8, immigration 3 and emigration 1 per 1,000, so (12 + 3 − 8 − 1) ÷ 10 = <strong>0.6%</strong>, the same answer as the calculator.</p>
<p>The rate of natural increase leaves migration out: (12 − 8) ÷ 10 = 0.4%. Many exam questions then ask for the doubling time, which by the rule of 70 is 70 ÷ 0.6 ≈ 117 years (the exact value is 115.9). See the <a href="/doubling-time-calculator">doubling time calculator</a> for that step.</p>`
    },
    {
      h2: 'How do you calculate the crude growth rate?',
      html: `<p>The crude rate of natural increase is the crude birth rate minus the crude death rate, both per 1,000 people per year. A population of 2,500,000 with 45,000 births and 20,000 deaths has CBR = 18.0 and CDR = 8.0, so the crude growth rate is <strong>10.0 per 1,000</strong>, or 1.0% a year.</p>
<p>"Crude" means it is computed over the whole population without adjusting for age structure, so a country with many young adults can post a high birth rate even at modest fertility. Demographers use age-specific rates and the total fertility rate for comparisons; replacement fertility is about 2.1 children per woman in low-mortality countries.</p>`
    },
    {
      h2: 'How do you calculate the intrinsic growth rate (r)?',
      html: `<p>In ecology the intrinsic (per capita) rate of increase is r = b − d, the per-individual birth rate minus the per-individual death rate, under ideal conditions. From counts, r = ln(N<sub>t</sub> ÷ N₀) ÷ t. A lab culture of 50 fruit flies that reaches 400 in 6 days has r = ln 8 ÷ 6 = <strong>0.347 per day</strong>, so it doubles every ln 2 ÷ 0.347 = 2.0 days.</p>
<p>r is a continuous rate, so use it with N<sub>t</sub> = N₀e<sup>rt</sup> (the "Exponential" model above). A per-year percentage, used with (1 + r)<sup>t</sup>, is slightly larger: r = 0.347 per day is 41.4% per day compounded daily.</p>`
    },
    {
      h2: 'What is logistic growth and carrying capacity?',
      html: `<p>Exponential growth can't last; food, space and disease eventually slow it. The logistic model dN/dt = rN(1 − N/K) makes growth slow as N approaches the carrying capacity K, giving an S-shaped curve.</p>
<p>For a deer herd with r = 0.40 per year and K = 1,000: at N = 200 the herd adds 0.40 × 200 × (1 − 0.2) = 64 deer a year; at N = 500 it adds 100, the maximum, because growth peaks at K ÷ 2; at N = 900 it adds only 36. Choose "Logistic" and enter K to see the curve flatten in the projection table.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for population growth rate?', a: 'Growth rate = (births − deaths + immigrants − emigrants) ÷ starting population × 100. A net gain of 60,000 on 10,000,000 people is 0.60% per year.' },
    { q: 'How do you calculate percent change in population density?', a: 'Divide population by area for each year, then use (new − old) ÷ old × 100. If the area hasn\'t changed, the percent change in density equals the percent change in population: 120 to 150 people per km² is a 25% increase.' },
    { q: 'What is the difference between geometric and exponential growth?', a: 'Geometric growth adds a percentage once per period, N × (1 + r)^t, suited to populations that breed seasonally. Exponential growth compounds continuously, N × e^(rt), suited to populations that reproduce all year. For small r they are nearly identical.' },
    { q: 'How do I project population in 20 years?', a: 'Multiply the current population by (1 + r) raised to the 20th power. 10,000,000 growing 1% a year becomes 10,000,000 × 1.01²⁰ = 12,201,900.' },
    { q: 'What does a negative growth rate mean?', a: 'The population is shrinking because deaths and emigration exceed births and immigration. At −0.5% a year, 10 million falls to about 9.51 million in 10 years.' },
    { q: 'Should I use the start-of-year or mid-year population?', a: 'Census agencies and the UN usually divide by the mid-year population, which averages out the year\'s changes. Textbook problems typically use the starting population. The difference is tiny when growth is small.' },
    { q: 'Is a growth rate of 2% fast?', a: 'For a whole country, yes. At 2% a year a population doubles in about 35 years. The world as a whole grows by less than 1% a year.' }
  ],
  related: ['doubling-time-calculator', 'percentage-change-calculator', 'cagr-calculator', 'half-life-calculator'],
  sources: [
    { name: 'OpenStax Biology 2e: 45.3 Environmental Limits to Population Growth', url: 'https://openstax.org/books/biology-2e/pages/45-3-environmental-limits-to-population-growth' },
    { name: 'U.S. Census Bureau: Population and Housing Unit Estimates (components of change)', url: 'https://www.census.gov/programs-surveys/popest.html' },
    { name: 'United Nations: World Population Prospects', url: 'https://population.un.org/wpp/' }
  ]
};
