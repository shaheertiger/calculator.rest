export default {
  slug: 'unemployment-rate-calculator',
  hub: 'business',
  name: 'Unemployment Rate Calculator',
  title: 'Unemployment Rate Calculator: 7.07M of 170.7M Is 4.1% (2026)',
  h1: 'Unemployment Rate Calculator with Labor Force Participation',
  meta: 'October 2026: 7,068,000 unemployed in a 170,683,000 labor force is a 4.1% unemployment rate. Check the BLS math, participation rate and U-6 yourself.',
  keyword: 'how is the unemployment rate calculated',
  also: ['unemployment rate calculator', 'how do they calculate unemployment', 'how to calculate labor force participation rate'],
  updated: '2026-11-13',
  inputs: [
    { id: 'unemployed', label: 'Unemployed people', type: 'number', value: 7068, suffix: 'thousand', help: 'Jobless, available, and looked for work in the past 4 weeks (or on temporary layoff).' },
    { id: 'employed', label: 'Employed people', type: 'number', value: 163615, suffix: 'thousand' },
    { id: 'pop', label: 'Civilian population 16+ (optional)', type: 'number', value: 275682, suffix: 'thousand', help: 'Civilian noninstitutional population, for participation and employment ratios.' },
    { id: 'marg', label: 'Marginally attached (optional)', type: 'number', value: '', suffix: 'thousand', help: 'Want a job, looked in the past year but not the past 4 weeks.' },
    { id: 'pter', label: 'Part-time for economic reasons (optional)', type: 'number', value: '', suffix: 'thousand', help: 'Want full-time work but could only find part-time.' }
  ],
  compute(v, H) {
    if (!(v.unemployed >= 0)) return { error: 'Enter the number of unemployed people.' };
    if (!(v.employed >= 0)) return { error: 'Enter the number of employed people.' };
    var lf = v.unemployed + v.employed;
    if (!(lf > 0)) return { error: 'The labor force (employed + unemployed) must be above zero.' };
    var u = v.unemployed / lf * 100;
    var rows = [
      ['Labor force', H.num(lf, 3) + 'K'],
      ['Unrounded rate', H.fix(u, 3) + '%'],
      ['Employed share of labor force', H.fix(100 - u, 2) + '%']
    ];
    if (v.pop > 0) {
      if (lf > v.pop) return { error: 'The labor force cannot be larger than the population 16 and over.' };
      rows.push(['Labor force participation rate', H.fix(lf / v.pop * 100, 2) + '%', true]);
      rows.push(['Employment-population ratio', H.fix(v.employed / v.pop * 100, 2) + '%']);
      rows.push(['Not in the labor force', H.num(v.pop - lf, 3) + 'K']);
    }
    if (v.marg >= 0 || v.pter >= 0) {
      var mg = v.marg >= 0 ? v.marg : 0, pt = v.pter >= 0 ? v.pter : 0;
      rows.push(['U-6 underutilization rate', H.fix((v.unemployed + mg + pt) / (lf + mg) * 100, 2) + '%', true]);
    }
    return {
      value: H.fix(u, 1) + '%',
      label: 'Unemployment rate (U-3)',
      expr: H.num(v.unemployed, 3) + ' ÷ (' + H.num(v.employed, 3) + ' + ' + H.num(v.unemployed, 3) + ')',
      rows: rows,
      sub: 'About ' + H.num(u, 1) + ' of every 100 people in the labor force are looking for work. People not looking at all are outside the labor force and do not count.'
    };
  },
  quick: ({ r }) => `The unemployment rate is the number of unemployed people divided by the labor force (employed + unemployed), times 100. In October 2026 BLS counted <strong>7,068,000 unemployed</strong> and 163,615,000 employed, a labor force of 170,683,000, so the rate was 7,068 ÷ 170,683 = 4.141%, published as <strong>${r.value}</strong>. Participation was 61.9% of the 16+ population.`,
  stepsTitle: 'How the unemployment rate is calculated',
  steps: [
    'Count the <strong>unemployed</strong>: people 16 and older without a job who are available to work and actively looked in the last four weeks, plus those on temporary layoff waiting to be recalled.',
    'Count the <strong>employed</strong>: anyone who did any paid work in the survey week, worked 15+ hours in a family business, or had a job but was temporarily absent (sick, on vacation).',
    'Add them to get the <strong>labor force</strong>. People who are not working and not looking (students, retirees, discouraged workers) are left out entirely; dividing by the whole population instead of the labor force is the classic mistake.',
    'Divide unemployed by labor force and multiply by 100. BLS rounds the published national rate to one decimal place.'
  ],
  formulaTitle: 'What is the unemployment rate formula?',
  formula: {
    expr: 'Unemployment rate = Unemployed ÷ Labor force × 100<br>Labor force = Employed + Unemployed<br>Participation rate = Labor force ÷ Civilian population 16+ × 100<br>U-6 = (Unemployed + Marginally attached + Part-time for economic reasons) ÷ (Labor force + Marginally attached) × 100',
    vars: [['Unemployed', 'no job, available, actively searched in the past 4 weeks'], ['Labor force', 'everyone working or looking for work'], ['Civilian population 16+', 'civilian noninstitutional population: excludes active-duty military and people in prisons or nursing homes']]
  },
  example: `<p>A county survey finds 46,200 residents employed and 2,800 unemployed, out of 78,000 residents aged 16 and over.</p>
<p>Labor force = 46,200 + 2,800 = <strong>49,000</strong>.</p>
<p>Unemployment rate = 2,800 ÷ 49,000 × 100 = <strong>5.7%</strong>.</p>
<p>Participation rate = 49,000 ÷ 78,000 × 100 = <strong>62.8%</strong>. The other 29,000 residents are not in the labor force and do not affect the unemployment rate at all.</p>`,
  table: {
    title: 'How many people are unemployed at each rate?',
    intro: 'Unemployed people at different rates for a labor force of 170,683,000, the October 2026 BLS figure. Each 0.1-point move is roughly 171,000 people.',
    head: ['Unemployment rate', 'Unemployed', 'Employed', 'Change vs 4.1%'],
    rows: ({ run, H }) => [3.5, 3.8, 4.0, 'oct', 4.5, 5.0, 6.0, 8.0, 10.0].map(p => {
      const un = p === 'oct' ? 7068 : Math.round(170683 * p / 100);
      const r = run({ unemployed: un, employed: 170683 - un, pop: '', marg: '', pter: '' });
      return [p === 'oct' ? r.value + ' (Oct 2026)' : r.value, H.int(un * 1000), H.int((170683 - un) * 1000), un === 7068 ? '—' : (un > 7068 ? '+' : '−') + H.int(Math.abs(un - 7068) * 1000)];
    })
  },
  sections: [
    {
      h2: 'Where does the government get the numbers?',
      html: `<p>From the Current Population Survey (CPS), a monthly survey of about 60,000 eligible households run by the Census Bureau for the Bureau of Labor Statistics. Interviewers ask each household member about their work status in the week that includes the 12th of the month. BLS weights the sample up to the national population and publishes the result, usually on the first Friday of the following month, in the Employment Situation report.</p>
<p>It is not a count of people claiming unemployment insurance. Many unemployed people never file a claim or have used up their benefits, and some claimants work part-time, so UI claims and the unemployment rate measure different things.</p>`
    },
    {
      h2: 'How is the labor force participation rate calculated?',
      html: `<p>Divide the labor force by the civilian noninstitutional population aged 16 and older, then multiply by 100. In October 2026, 170,683,000 ÷ 275,682,000 = <strong>61.9%</strong>. The employment-population ratio uses employed people instead: 163,615,000 ÷ 275,682,000 = 59.3%.</p>
<p>Participation explains why the unemployment rate can fall for a bad reason: if discouraged job seekers stop looking, they leave the labor force, the unemployed count drops and the rate improves even though no one found work. Watching participation and the employment-population ratio alongside the rate catches this.</p>`
    },
    {
      h2: 'What is the difference between U-3 and U-6?',
      html: `<p><strong>U-3</strong> is the official unemployment rate, the one in headlines. <strong>U-6</strong> is BLS's broadest measure of labor underutilization. It adds two groups to the unemployed:</p>
<ul><li><strong>Marginally attached workers:</strong> want a job and looked in the past 12 months but not in the past 4 weeks. Discouraged workers are a subset.</li>
<li><strong>Part-time for economic reasons:</strong> working part-time only because they could not find full-time work or their hours were cut.</li></ul>
<p>Marginally attached workers are also added to the denominator. U-6 typically runs several points above U-3. Enter both optional counts above to compute it from the BLS table A-15 figures.</p>`
    },
    {
      h2: 'Is this how unemployment benefits are calculated?',
      html: `<p>No. The unemployment <em>rate</em> is a statistic about the labor market. Unemployment <em>benefits</em> are set by each state's insurance program, usually as a percentage of your wages in a "base period" of four quarters, up to a weekly maximum that differs a lot between states. Check your state workforce agency for your weekly benefit amount.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for the unemployment rate?', a: 'Unemployment rate = unemployed ÷ (employed + unemployed) × 100. 7,068,000 unemployed out of a 170,683,000 labor force is 4.141%, published as 4.1%.' },
    { q: 'Who is not counted in the labor force?', a: 'People 16 and older who are neither working nor looking for work: most students, retirees, stay-at-home parents, people unable to work, and discouraged workers who stopped searching. Children under 16, active-duty military and people in institutions are excluded from the population entirely.' },
    { q: 'Do part-time workers count as employed?', a: 'Yes. Anyone who did at least one hour of paid work in the survey week counts as employed, even if they want more hours. The U-6 measure captures part-timers who want full-time work.' },
    { q: 'Why can the unemployment rate fall while jobs are lost?', a: 'If people stop looking for work, they leave the labor force. The number of unemployed shrinks faster than the labor force, so the rate falls even though employment did not rise.' },
    { q: 'What is the natural rate of unemployment?', a: 'It is the rate the economy settles at when output is at its potential, made up of frictional and structural unemployment. Estimates for the U.S. are usually in the low-to-mid 4% range and change over time.' },
    { q: 'How do you calculate the employment rate?', a: 'The employment-population ratio is employed ÷ civilian population 16+ × 100. In October 2026 that was 163,615,000 ÷ 275,682,000 = 59.3%. It is not 100% minus the unemployment rate.' },
    { q: 'How is the state or county unemployment rate calculated?', a: 'The same way, unemployed ÷ labor force, but BLS\'s Local Area Unemployment Statistics program estimates the inputs with models that combine CPS data, payroll jobs counts and unemployment insurance claims, because the household survey is too small for most local areas.' }
  ],
  related: ['nominal-gdp-calculator', 'inflation-calculator', 'percentage-calculator', 'percentage-change-calculator'],
  sources: [
    { name: 'BLS: How the Government Measures Unemployment', url: 'https://www.bls.gov/cps/cps_htgm.htm' },
    { name: 'BLS: The Employment Situation, October 2026', url: 'https://www.bls.gov/news.release/empsit.nr0.htm' },
    { name: 'BLS: Table A-1, Employment status of the civilian population', url: 'https://www.bls.gov/news.release/empsit.t01.htm' },
    { name: 'BLS: Current Population Survey concepts and definitions', url: 'https://www.bls.gov/cps/definitions.htm' },
    { name: 'OpenStax Principles of Economics 3e: How economists define and compute unemployment', url: 'https://openstax.org/books/principles-economics-3e/pages/21-1-how-economists-define-and-compute-unemployment-rate' }
  ]
};
