export default {
  slug: 'doubling-time-calculator',
  hub: 'science',
  name: 'Doubling Time Calculator',
  title: 'Doubling Time Calculator: 2.5% Growth Doubles in 28.07 Years',
  h1: 'Doubling Time Calculator: Exact Formula vs the Rule of 70',
  meta: 'At 2.5% growth a year, the rule of 70 says 28 years to double; the exact ln 2 ÷ ln(1.025) gives 28.07. Also works from two counts for bacteria and populations.',
  keyword: 'how do you calculate doubling time',
  also: ['doubling time calculator', 'how to calculate doubling time apes', 'how to calculate doubling time aphg', 'rule of 70 calculator', 'generation time calculator', 'how to calculate doubling time of bacteria'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you know?', type: 'select', value: 'rate', options: [['rate', 'The growth rate (%)'], ['data', 'Two measurements and the time between them']] },
    { id: 'rate', label: 'Growth rate', type: 'number', value: 2.5, suffix: '% per period', showIf: { mode: ['rate'] } },
    { id: 'comp', label: 'Rate type', type: 'select', value: 'discrete', showIf: { mode: ['rate'] }, options: [['discrete', 'Percent per period (compounded each period)'], ['continuous', 'Continuous (instantaneous) rate, as in N₀e^(rt)']] },
    { id: 'n0', label: 'Starting count or size (N₀)', type: 'number', value: 500000, showIf: { mode: ['data'] }, help: 'E-notation works: 5e5' },
    { id: 'nt', label: 'Later count or size (N)', type: 'number', value: 8000000, showIf: { mode: ['data'] } },
    { id: 't', label: 'Time between measurements', type: 'number', value: 4, showIf: { mode: ['data'] } },
    { id: 'tUnit', label: 'Time unit (the period)', type: 'select', value: 'years', options: [['years', 'years'], ['months', 'months'], ['days', 'days'], ['hours', 'hours'], ['minutes', 'minutes']] }
  ],
  compute(v, H) {
    function sf(x, k) {
      if (!isFinite(x)) return '—';
      if (x === 0) return '0';
      var r = Number(x.toPrecision(k));
      var e = Math.floor(Math.log10(Math.abs(r)));
      if (e < -3 || e >= 6) return (r / Math.pow(10, e)).toFixed(k - 1) + ' × 10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>';
      return H.fix(r, Math.max(0, k - 1 - e));
    }
    var tu = ' ' + (v.tUnit || 'years'), tu1 = tu.replace(/s$/, ''), LN2 = Math.LN2;
    if (v.mode === 'data') {
      if (!(v.n0 > 0) || !(v.nt > 0)) return { error: 'Enter both measurements.' };
      if (!(v.t > 0)) return { error: 'Enter the time between the measurements.' };
      if (v.nt <= v.n0) return { error: 'The later value must be larger. For something shrinking, use the half-life calculator.' };
      var ratio = v.nt / v.n0, gens = Math.log(ratio) / LN2, td = v.t / gens;
      var kc = Math.log(ratio) / v.t, pr = (Math.pow(ratio, 1 / v.t) - 1) * 100;
      var rows = [['Number of doublings (generations)', H.num(gens, 3), true], ['Growth factor', H.num(ratio, 4) + '×'], ['Growth rate per' + tu1, H.num(pr, 3) + '%'], ['Continuous rate k', sf(kc, 4) + ' per' + tu1]];
      if (v.tUnit === 'hours') rows.push(['Generation time in minutes', H.num(td * 60, 1) + ' min']);
      if (v.tUnit === 'days') rows.push(['Doubling time in hours', H.num(td * 24, 2) + ' hours']);
      return {
        value: sf(td, 4) + tu,
        label: 'Doubling time (generation time)',
        expr: H.num(v.t, 4) + ' × ln 2 ÷ ln(' + sf(v.nt, 3) + ' ÷ ' + sf(v.n0, 3) + ')',
        rows: rows,
        sub: 'Assumes steady exponential growth between the two measurements, as in the log phase of a bacterial culture.'
      };
    }
    var r = v.rate;
    if (!(r > 0)) return { error: 'Enter a positive growth rate in percent.' };
    if (r > 10000) return { error: 'Enter a growth rate below 10,000%.' };
    var cont = v.comp === 'continuous';
    var T = cont ? LN2 / (r / 100) : LN2 / Math.log(1 + r / 100);
    var T3 = cont ? Math.log(3) / (r / 100) : Math.log(3) / Math.log(1 + r / 100);
    var T10 = cont ? Math.log(10) / (r / 100) : Math.log(10) / Math.log(1 + r / 100);
    var r70 = 70 / r, r72 = 72 / r;
    return {
      value: sf(T, 4) + tu,
      label: 'Exact doubling time',
      expr: cont ? 'ln 2 ÷ ' + H.num(r / 100, 6) : 'ln 2 ÷ ln(1 + ' + H.num(r / 100, 6) + ')',
      rows: [
        ['Rule of 70 estimate', H.num(r70, 2) + tu, true],
        ['Rule of 72 estimate', H.num(r72, 2) + tu],
        ['Rule of 70 error', Math.abs(r70 - T) / T < 0.0005 ? 'under 0.05%' : (r70 >= T ? '+' : '−') + H.num(Math.abs(r70 - T) / T * 100, 1) + '%'],
        ['Time to triple', sf(T3, 4) + tu],
        ['Time to grow 10×', sf(T10, 4) + tu]
      ],
      sub: cont ? 'For a continuous rate the exact doubling time is 69.3 ÷ r, so the rule of 70 is very close at any rate.' : 'The rule of 70 is a shortcut; it drifts from the exact answer as the rate grows (see the table below).'
    };
  },
  quick: ({ r }) => `To calculate doubling time, divide 70 by the percentage growth rate (the rule of 70), or for an exact answer use <strong>T<sub>d</sub> = ln 2 ÷ ln(1 + r)</strong>. At 2.5% a year the rule gives 70 ÷ 2.5 = 28 years, and the exact formula gives 0.6931 ÷ 0.02469 = <strong>${r.value}</strong>. From two counts, T<sub>d</sub> = t × ln 2 ÷ ln(N ÷ N₀).`,
  stepsTitle: 'How to calculate doubling time',
  steps: [
    'Express the growth rate as a percentage per period (per year, per hour, per generation). The answer comes out in that same period.',
    'Quick estimate: divide 70 by the percentage. 2.5% per year → 70 ÷ 2.5 = 28 years. Use the percent itself (2.5), not the decimal (0.025); dividing by the decimal is the classic mistake that gives 2,800.',
    'Exact answer: convert the percent to a decimal r and compute ln 2 ÷ ln(1 + r). For a continuous rate k, it is simply ln 2 ÷ k.',
    'From data instead of a rate: count how many doublings fit between two measurements, n = log₂(N ÷ N₀), then divide the elapsed time by n.'
  ],
  formulaTitle: 'What is the doubling time formula?',
  formula: {
    expr: 'T<sub>d</sub> = ln 2 ÷ ln(1 + r) &nbsp;(r per period, as a decimal)<br>T<sub>d</sub> = ln 2 ÷ k &nbsp;(continuous growth N = N₀e<sup>kt</sup>)<br>Rule of 70: T<sub>d</sub> ≈ 70 ÷ (r in %)<br>From data: T<sub>d</sub> = t × ln 2 ÷ ln(N ÷ N₀) = t ÷ (3.32 × log₁₀(N ÷ N₀))',
    vars: [['T<sub>d</sub>', 'doubling time'], ['r', 'growth rate per period'], ['k', 'continuous (instantaneous) growth rate'], ['N₀, N', 'starting and later size'], ['t', 'time between the two measurements'], ['ln 2', '0.693147…']],
    note: 'The 3.32 in the microbiology form is 1 ÷ log₁₀2, so 3.32 × log₁₀(N ÷ N₀) is the number of generations.'
  },
  example: `<p>An E. coli culture in log phase grows from 5.0 × 10⁵ to 8.0 × 10⁶ cells/mL in 4.0 hours.</p>
<p>Growth factor = 8.0 × 10⁶ ÷ 5.0 × 10⁵ = 16. Generations n = 3.32 × log₁₀ 16 = 3.32 × 1.204 = <strong>4.0</strong>.</p>
<p>Doubling (generation) time = 4.0 h ÷ 4.0 = <strong>1.0 hour (60 minutes)</strong>. That is slower than the roughly 20 minutes E. coli manages in rich broth at 37 °C, which would point to a cooler incubator or a minimal medium. Choose "Two measurements" above to check your own counts.</p>`,
  table: {
    title: 'How accurate is the rule of 70 at different growth rates?',
    intro: 'Exact doubling times for growth compounded once per period, compared with the rule of 70 and rule of 72, all computed by the calculator.',
    head: ['Growth rate', 'Exact doubling time', 'Rule of 70', 'Rule of 72', 'Rule of 70 error'],
    rows: ({ run }) => [0.5, 1, 1.5, 2, 3, 4, 5, 7, 8, 10, 15, 20, 25, 50, 100].map(p => {
      const r = run({ mode: 'rate', rate: p, comp: 'discrete', tUnit: 'years' });
      return [p + '%', r.value.replace(' years', ''), r.rows[0][1].replace(' years', ''), r.rows[1][1].replace(' years', ''), r.rows[2][1]];
    }),
    note: 'Times are in periods (years if the rate is per year). Up to 5% the rule of 70 is within 1.5% of the exact value; the rule of 72 is exact near 7.8% and is the better shortcut above about 5%. At 100% growth something doubles in exactly 1 period, but both rules miss badly.'
  },
  sections: [
    {
      h2: 'Why does the rule of 70 work?',
      html: `<p>For small rates, ln(1 + r) is almost equal to r, so ln 2 ÷ ln(1 + r) ≈ 0.693 ÷ r. Writing r as a percentage multiplies the top by 100, giving 69.3 ÷ r%. Rounding 69.3 up to 70 makes the mental math easy and partly cancels the error from the approximation.</p>
<p>Finance uses 72 instead because it divides evenly by 2, 3, 4, 6, 8, 9 and 12, and because typical interest rates of 6–10% sit where 72 is most accurate. Population and environmental science classes use 70 because growth rates there are usually 0–3%. For continuously compounded growth, 69.3 is exact.</p>`
    },
    {
      h2: 'How do you calculate doubling time for bacteria?',
      html: `<p>Microbiologists call it the generation time. Take two counts (or optical density readings) during the log phase, find the number of generations n = 3.32 × log₁₀(N ÷ N₀), and divide the elapsed time by n. The worked example above shows a culture that doubles every 60 minutes.</p>
<p>Generation times vary enormously: about 20 minutes for E. coli in ideal lab conditions, several hours in many soil bacteria, and roughly 15–20 hours for Mycobacterium tuberculosis, which is one reason TB cultures take weeks. Use counts from the straight part of a semi-log growth curve; points from the lag or stationary phase make the doubling time look longer than it really is.</p>`
    },
    {
      h2: 'How do you calculate doubling time in APES and AP Human Geography?',
      html: `<p>AP courses use the rule of 70 with the rate of natural increase (RNI). First find RNI as a percentage: (crude birth rate − crude death rate) ÷ 10, since those rates are per 1,000 people. A country with 18 births and 8 deaths per 1,000 has RNI = (18 − 8) ÷ 10 = 1.0%, so its doubling time is 70 ÷ 1.0 = <strong>70 years</strong>.</p>
<p>A country at 3.5% doubles in 20 years; one at 0.5% takes 140. RNI leaves out migration; to include it and project future population, use the <a href="/population-growth-calculator">population growth calculator</a>.</p>`
    },
    {
      h2: 'How do you find the growth rate from a doubling time?',
      html: `<p>Turn the formula around: r = 2<sup>1/T<sub>d</sub></sup> − 1, or roughly 70 ÷ T<sub>d</sub>. Something that doubles every 3 days is growing 2<sup>1/3</sup> − 1 = <strong>26.0% per day</strong>; the rule of 70 would say 23.3%, a noticeable underestimate at such a fast rate.</p>
<p>A doubling time of 10 years corresponds to 7.18% a year, and 35 years to 2.0%. Short doubling times compound dramatically: ten doublings is a 1,024-fold increase.</p>`
    }
  ],
  faq: [
    { q: 'What is the rule of 70?', a: 'A shortcut for doubling time: divide 70 by the growth rate in percent. Growth of 2% per year doubles in about 70 ÷ 2 = 35 years.' },
    { q: 'Should I use the rule of 70 or the rule of 72?', a: 'Use 70 for population and science problems with low rates (under about 5%), and 72 for interest rates around 6–10%. For an exact answer use ln 2 ÷ ln(1 + r).' },
    { q: 'How long does it take money to double at 6%?', a: 'The rule of 72 says 72 ÷ 6 = 12 years; the exact figure with annual compounding is 11.90 years. Monthly compounding shortens it slightly.' },
    { q: 'What is the doubling time for a continuous growth rate?', a: 'Divide ln 2 by the rate: T = 0.693 ÷ k. A continuous rate of 0.035 per year doubles in 19.8 years.' },
    { q: 'How long does it take to double at 1% per month?', a: 'ln 2 ÷ ln 1.01 = 69.66 months, or about 5.8 years. Always keep the time unit the same as the period of the rate.' },
    { q: 'What if the growth rate is negative?', a: 'Then the quantity never doubles; it halves. Use the same math with the absolute rate to get a halving time, or use the half-life calculator.' },
    { q: 'How many doublings does it take to grow 1,000 times?', a: 'About 10, because 2¹⁰ = 1,024. A million-fold increase takes about 20 doublings.' }
  ],
  related: ['population-growth-calculator', 'half-life-calculator', 'cagr-calculator', 'compound-interest-calculator', 'log-calculator'],
  sources: [
    { name: 'OpenStax Microbiology: 9.1 How Microbes Grow (generation time)', url: 'https://openstax.org/books/microbiology/pages/9-1-how-microbes-grow' },
    { name: 'OpenStax Biology 2e: 45.3 Environmental Limits to Population Growth', url: 'https://openstax.org/books/biology-2e/pages/45-3-environmental-limits-to-population-growth' },
    { name: 'Investor.gov (SEC): Rule of 72', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-72' }
  ]
};
