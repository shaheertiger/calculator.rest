export default {
  slug: 'margin-of-error-calculator',
  hub: 'statistics',
  name: 'Margin of Error Calculator',
  title: 'Margin of Error Calculator: 1,000 People at 95% Is ±3.1%',
  h1: 'Margin of Error Calculator for Polls, Surveys and Sample Size',
  meta: 'A poll of 1,000 people showing 50% has a 95% margin of error of ±3.10 points. Find the margin for a proportion or mean, or the sample size for a target margin.',
  keyword: 'how to calculate margin of error',
  also: ['margin of error calculator', 'how to calculate margin of error in excel', 'sample size calculator', 'survey margin of error calculator', 'how to calculate sample size for a survey', 'margin of error formula'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'prop', wide: true, options: [['prop', 'Margin of error for a percentage (poll, survey)'], ['mean', 'Margin of error for an average'], ['size', 'Sample size needed for a target margin']] },
    { id: 'p', label: 'Sample percentage', type: 'number', value: 50, suffix: '%', showIf: { mode: ['prop', 'size'] }, help: 'Use 50% if unknown: it gives the largest (safest) margin.' },
    { id: 'n', label: 'Sample size (n)', type: 'number', value: 1000, showIf: { mode: ['prop', 'mean'] } },
    { id: 's', label: 'Standard deviation (s)', type: 'number', value: 12, showIf: { mode: ['mean'] } },
    { id: 'e', label: 'Target margin of error', type: 'number', value: 3, suffix: '±%', showIf: { mode: ['size'] } },
    { id: 'conf', label: 'Confidence level', type: 'select', value: '95', options: [['80', '80%'], ['85', '85%'], ['90', '90%'], ['95', '95%'], ['98', '98%'], ['99', '99%'], ['99.9', '99.9%']] },
    { id: 'pop', label: 'Population size (optional)', type: 'number', value: '', placeholder: 'leave blank if large or unknown', help: 'Applies the finite population correction when your sample is a sizable share of the population.' }
  ],
  compute(v, H) {
    var c = Number(v.conf), alpha = 1 - c / 100, z = H.normInv(1 - alpha / 2);
    var N = v.pop > 0 ? v.pop : 0;
    if (v.mode === 'size') {
      var p0 = v.p / 100, E = v.e / 100;
      if (!(p0 > 0 && p0 < 1)) return { error: 'Enter a percentage between 0 and 100.' };
      if (!(E > 0 && E < 1)) return { error: 'Enter the margin of error you want, e.g. 3 for ±3%.' };
      var n0 = z * z * p0 * (1 - p0) / (E * E);
      var nf = N ? n0 / (1 + (n0 - 1) / N) : n0;
      return {
        value: H.int(Math.ceil(nf - 1e-9)) + ' people', label: 'Sample size for ±' + H.num(v.e, 2) + '% at ' + c + '% confidence',
        expr: H.fix(z, 3) + '² × ' + H.num(p0, 3) + ' × ' + H.num(1 - p0, 3) + ' ÷ ' + H.num(E, 4) + '²' + (N ? ', corrected for N = ' + H.int(N) : ''),
        rows: [['Before rounding up', H.num(nf, 2)], ['Without population correction', H.int(Math.ceil(n0 - 1e-9))], ['Critical value z*', H.fix(z, 3)], ['Invitations needed at a 20% response rate', H.int(Math.ceil(Math.ceil(nf - 1e-9) / 0.2))]],
        sub: 'Always round up. This is the number of completed responses, so plan to contact more people than this.',
        _n: Math.ceil(nf - 1e-9)
      };
    }
    var n = v.n;
    if (!(n >= 2)) return { error: 'Enter a sample size of at least 2.' };
    if (N && n > N) return { error: 'The sample cannot be larger than the population.' };
    var fpc = N ? Math.sqrt((N - n) / (N - 1)) : 1;
    if (v.mode === 'mean') {
      if (!(v.s > 0)) return { error: 'Enter the standard deviation.' };
      var df = Math.floor(n) - 1, t = H.tInv(1 - alpha / 2, df), se = v.s / Math.sqrt(n), m = t * se * fpc;
      return {
        value: '±' + H.num(m, 3), label: c + '% margin of error for the mean',
        expr: H.fix(t, 3) + ' × ' + H.num(v.s, 4) + ' ÷ √' + H.num(n, 0) + (N ? ' × FPC' : ''),
        rows: [['Critical value t* (df ' + df + ')', H.fix(t, 3)], ['Standard error', H.num(se, 4)], ['Using z instead of t', '±' + H.num(z * se * fpc, 3)], ['Finite population correction', N ? H.fix(fpc, 4) : 'not applied']],
        sub: 'Add and subtract this from your sample mean to get the ' + c + '% confidence interval.',
        _m: m
      };
    }
    var p = v.p / 100;
    if (!(p >= 0 && p <= 1)) return { error: 'Enter the sample percentage between 0 and 100.' };
    var mo = z * Math.sqrt(p * (1 - p) / n) * fpc;
    return {
      value: '±' + H.fix(mo * 100, 2) + '%', label: c + '% margin of error',
      expr: H.fix(z, 3) + ' × √(' + H.num(p, 3) + ' × ' + H.num(1 - p, 3) + ' ÷ ' + H.int(n) + ')' + (N ? ' × FPC' : ''),
      rows: [['Range', H.fix(Math.max(0, p - mo) * 100, 2) + '% to ' + H.fix(Math.min(1, p + mo) * 100, 2) + '%', true], ['Critical value z*', H.fix(z, 3)], ['Standard error', H.fix(Math.sqrt(p * (1 - p) / n) * 100, 3) + ' points'], ['Finite population correction', N ? H.fix(fpc, 4) : 'not applied'], ['Margin on a lead between two answers (up to)', '±' + H.fix(2 * mo * 100, 1) + ' points']],
      sub: 'The true percentage is likely (at ' + c + '% confidence) within ' + H.fix(mo * 100, 2) + ' points of ' + H.pct(v.p, 2) + ', counting random sampling error only.',
      _m: mo
    };
  },
  quick: ({ r }) => `Margin of error for a poll is z* × √(p(1 − p) ÷ n). A survey of <strong>1,000 people</strong> with a 50% result at 95% confidence gives 1.960 × √(0.25 ÷ 1,000) = <strong>${r.value}</strong>, so the true figure is likely between 46.90% and 53.10%. Halving the margin to ±1.55% would take 4,000 people; ±5% needs only 385.`,
  stepsTitle: 'How to calculate margin of error',
  steps: [
    'Pick the confidence level and its z value: 1.645 for 90%, 1.960 for 95%, 2.576 for 99%.',
    'Take your sample proportion p as a decimal (52% → 0.52). If you are planning a survey and do not know it yet, use 0.5, which gives the widest margin.',
    'Compute the standard error √(p(1 − p) ÷ n). For p = 0.5 and n = 1,000: √0.00025 = 0.0158.',
    'Multiply by z: 1.960 × 0.0158 = 0.0310, or ±3.10 percentage points. Report it in <em>points</em>, not as a percent of the result; that confusion is very common.',
    'If the sample is more than about 5% of a known population, multiply by the finite population correction √((N − n) ÷ (N − 1)).'
  ],
  formulaTitle: 'What is the margin of error formula?',
  formula: {
    expr: 'Proportion: MOE = z* × √(p(1 − p) ÷ n)<br>Mean: MOE = t* × s ÷ √n<br>Sample size: n = z*² × p(1 − p) ÷ E²<br>Finite population: × √((N − n) ÷ (N − 1))',
    vars: [['z*, t*', 'critical value for the confidence level'], ['p', 'sample proportion (decimal)'], ['n', 'sample size'], ['s', 'sample standard deviation'], ['E', 'target margin of error (decimal)'], ['N', 'population size']]
  },
  example: `<p>A city poll asks 1,000 residents whether they back a new transit tax; 50% say yes.</p>
<p>Standard error = √(0.5 × 0.5 ÷ 1,000) = 0.01581. At 95%, MOE = 1.960 × 0.01581 = <strong>0.0310, or ±3.10 points</strong>.</p>
<p>If the city has only 20,000 adults, the correction √(19,000 ÷ 19,999) = 0.9747 trims the margin to ±3.02 points.</p>
<p>Planning the next poll for ±5 points instead: n = 1.960² × 0.25 ÷ 0.05² = 384.1, rounded up to <strong>385 responses</strong>.</p>`,
  table: {
    title: 'What is the margin of error for common sample sizes?',
    intro: 'Worst-case margins (p = 50%) at three confidence levels, computed with the calculator above. Results further from 50% have slightly smaller margins.',
    head: ['Sample size', '90%', '95%', '99%'],
    rows: ({ run, H }) => [100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 5000, 10000].map(n => [H.int(n), ...['90', '95', '99'].map(c => run({ mode: 'prop', p: 50, n, conf: c, pop: NaN }).value)]),
    note: 'The margin shrinks with the square root of n: going from 1,000 to 4,000 respondents only halves it, which is why most national polls stop around 1,000–1,500.'
  },
  sections: [
    {
      h2: 'How do you calculate margin of error in Excel?',
      html: `<p>For a percentage, with p (as a decimal) in B1 and n in B2:</p>
<p><code>=NORM.S.INV(0.975)*SQRT(B1*(1-B1)/B2)</code> → 0.0310 for 0.5 and 1,000. Change 0.975 to 0.95 for 90% or 0.995 for 99%.</p>
<p>A shortcut uses <code>CONFIDENCE.NORM(alpha, standard_dev, size)</code>, which returns z × sd ÷ √n: <code>=CONFIDENCE.NORM(0.05,SQRT(B1*(1-B1)),B2)</code> gives the same 0.0310. For an average, use <code>=CONFIDENCE.T(0.05,STDEV.S(A2:A41),COUNT(A2:A41))</code>, which applies the t distribution. For a sample size, <code>=ROUNDUP(NORM.S.INV(0.975)^2*0.25/0.03^2,0)</code> returns 1,068. Google Sheets accepts all of these formulas unchanged.</p>`
    },
    {
      h2: 'How big a sample do you need for a given margin of error?',
      html: `<p>Rearranging the formula gives n = z² × p(1 − p) ÷ E². With p = 0.5 and 95% confidence:</p>
<div class="twrap"><table><thead><tr><th>Target margin</th><th>Responses needed</th></tr></thead><tbody>
<tr><td>±10%</td><td>97</td></tr><tr><td>±5%</td><td>385</td></tr><tr><td>±4%</td><td>601</td></tr><tr><td>±3%</td><td>1,068</td></tr><tr><td>±2%</td><td>2,401</td></tr><tr><td>±1%</td><td>9,604</td></tr>
</tbody></table></div>
<p>These are completed responses. If one in five people answers, you need to invite five times as many. Choose "Sample size needed for a target margin" above for other confidence levels or an expected percentage other than 50%.</p>`
    },
    {
      h2: 'Does population size affect the margin of error?',
      html: `<p>Hardly, unless the sample is a big share of the population. A random sample of 1,000 has about the same ±3.1% margin whether it comes from a town of 100,000 or a country of 330 million. Precision depends on how many people you ask, not on what fraction of the population they are.</p>
<p>The finite population correction matters once the sample tops about 5% of the population. Surveying an organization of 2,000 employees to ±5% needs 323 responses rather than 385. Enter the population size above to apply the correction.</p>`
    },
    {
      h2: 'How should you read the margin of error in a poll?',
      html: `<p>The published margin applies to each candidate's share, not to the gap between them. When two candidates split most of the vote, the margin on the <em>lead</em> is close to double: a 48% to 45% race with ±3 points is not a clear lead. Subgroups (say, voters under 30) have smaller samples and much larger margins; 250 respondents carry about ±6.2 points.</p>
<p>The margin also covers only random sampling error. Question wording, who refuses to answer and how the sample was weighted can shift results more than the stated margin, a point the Pew Research Center makes in its guide to election polls. For the full confidence interval around a mean or proportion, including small-sample t intervals, use the <a href="/confidence-interval-calculator">confidence interval calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is a good margin of error?', a: 'For opinion polls, ±3 to ±4 points at 95% confidence is typical. Market research often accepts ±5, while medical or policy studies may aim for ±2 or less. Smaller margins require much larger samples.' },
    { q: 'What sample size gives a 5% margin of error?', a: 'About 385 completed responses at 95% confidence with the worst-case 50% split. With a small known population the number drops: 323 for a population of 2,000.' },
    { q: 'Is margin of error the same as standard error?', a: 'No. The margin of error is the standard error multiplied by a critical value. At 95% confidence it is about 1.96 standard errors.' },
    { q: 'Why use 50% when calculating margin of error?', a: 'p(1 − p) is largest at p = 0.5, so 50% gives the biggest, most conservative margin. Pollsters quote that worst case so it covers every question in the survey.' },
    { q: 'How do you calculate margin of error from a confidence interval?', a: 'Subtract the lower limit from the upper limit and divide by 2. An interval of 46.9% to 53.1% has a margin of error of ±3.1 points.' },
    { q: 'Does doubling the sample size halve the margin of error?', a: 'No. The margin shrinks with the square root of the sample size, so doubling n reduces it by about 29%. You need four times the sample to halve it.' },
    { q: 'What is the margin of error for a sample of 400?', a: 'At 95% confidence and a 50% result, a sample of 400 has a margin of error of ±4.90 percentage points.' }
  ],
  related: ['confidence-interval-calculator', 'point-estimate-calculator', 't-critical-value-calculator', 'standard-deviation-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Confidence intervals for a proportion', url: 'https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Sample sizes required', url: 'https://www.itl.nist.gov/div898/handbook/prc/section2/prc242.htm' },
    { name: 'Pew Research Center: Understanding the margin of error in election polls', url: 'https://www.pewresearch.org/short-reads/2016/09/08/understanding-the-margin-of-error-in-election-polls/' },
    { name: 'Microsoft Support: CONFIDENCE.NORM function', url: 'https://support.microsoft.com/en-us/excel/functions/confidence-norm-function' },
    { name: 'Microsoft Support: NORM.S.INV function', url: 'https://support.microsoft.com/en-us/excel/functions/norm-s-inv-function' }
  ]
};
