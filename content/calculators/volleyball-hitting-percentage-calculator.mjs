export default {
  slug: 'volleyball-hitting-percentage-calculator',
  hub: 'sports',
  name: 'Hitting Percentage Calculator',
  title: 'Volleyball Hitting % Calculator: 14 Kills, 4 Errors = .286',
  h1: 'Volleyball Hitting Percentage and Kill Percentage Calculator',
  meta: 'Hitting percentage = (kills − errors) ÷ total attempts. 14 kills and 4 errors on 35 swings is a .286 hitting percentage and a 40% kill rate.',
  keyword: 'how to calculate hitting percentage in volleyball',
  also: ['how is volleyball hitting percentage calculated', 'how do you calculate hitting percentage in volleyball', 'how to calculate kill percentage in volleyball', 'how to calculate volleyball hitting percentage', 'how is hitting percentage calculated in volleyball', 'how to calculate hitting percentage', 'how to calculate serving percentage in volleyball'],
  updated: '2026-11-13',
  inputs: [
    { id: 'k', label: 'Kills (K)', type: 'number', value: 14 },
    { id: 'e', label: 'Attack errors (E)', type: 'number', value: 4, help: 'Include attacks that were blocked for a point, hit out or into the net, and attack violations.' },
    { id: 'ta', label: 'Total attempts (TA)', type: 'number', value: 35, help: 'Every attack: kills + errors + attempts kept in play.' },
    { id: 'sets', label: 'Sets played (optional)', type: 'number', value: 4 }
  ],
  compute(v, H) {
    if (!(v.ta > 0)) return { error: 'Enter total attack attempts (more than 0).' };
    if (!(v.k >= 0) || !(v.e >= 0)) return { error: 'Enter kills and errors (0 or more).' };
    if (v.k + v.e > v.ta) return { error: 'Kills + errors cannot be more than total attempts.' };
    function rate(x) { var neg = x < 0; var s = Math.abs(x).toFixed(3); if (s.charAt(0) === '0') s = s.slice(1); return (neg && s !== '.000' ? '−' : '') + s; }
    var hp = (v.k - v.e) / v.ta;
    var inPlay = v.ta - v.k - v.e;
    var rows = [
      ['Kill percentage (K ÷ TA)', H.fix(v.k / v.ta * 100, 1) + '%', true],
      ['Error percentage (E ÷ TA)', H.fix(v.e / v.ta * 100, 1) + '%'],
      ['Attempts kept in play', String(inPlay) + ' (' + H.fix(inPlay / v.ta * 100, 1) + '%)'],
      ['Kills minus errors', String(v.k - v.e)]
    ];
    if (v.sets > 0) {
      rows.push(['Kills per set', H.fix(v.k / v.sets, 2)]);
      rows.push(['Attempts per set', H.fix(v.ta / v.sets, 2)]);
    }
    var need = Math.max(0, Math.ceil(0.3 * v.ta + v.e - v.k - 1e-9));
    if (hp < 0.3 && v.k + v.e + need <= v.ta) rows.push(['Extra kills (same swings) to hit .300', String(need)]);
    return {
      value: rate(hp),
      label: 'Hitting percentage (attack efficiency)',
      expr: '(' + v.k + ' − ' + v.e + ') ÷ ' + v.ta,
      rows: rows,
      sub: hp >= 0.4 ? 'Outstanding: the level of the best college middle blockers.' : hp >= 0.3 ? 'Excellent for an outside or opposite hitter.' : hp >= 0.2 ? 'Solid: a positive contribution at most levels.' : hp >= 0.1 ? 'Below average; cutting errors helps most.' : hp >= 0 ? 'Barely positive: errors are cancelling out kills.' : 'Negative: more errors than kills.'
    };
  },
  quick: ({ r }) => `Volleyball hitting percentage is (kills − attack errors) ÷ total attempts, written like a batting average. A hitter with <strong>14 kills and 4 errors on 35 swings</strong> hits (14 − 4) ÷ 35 = <strong>${r.value}</strong>. Kill percentage ignores errors: 14 ÷ 35 = 40.0%. Hitting percentage runs from −1.000 to 1.000, and .300 or higher is excellent.`,
  stepsTitle: 'How to calculate hitting percentage in volleyball',
  steps: [
    'Count <strong>kills</strong>: attacks that end the rally with a point for your team.',
    'Count <strong>attack errors</strong>: attacks hit out, into the net, blocked straight down for a point, or called for a violation. Being stuffed by a block counts as an error for the hitter, which is the part people most often miss.',
    'Count <strong>total attempts</strong>: every attack, including the ones that stay in play and are dug.',
    'Subtract errors from kills and divide by total attempts. Write the result to three decimals without the leading zero, like .286.'
  ],
  formulaTitle: 'What is the hitting percentage formula?',
  formula: {
    expr: 'Hitting % = (K − E) ÷ TA<br>Kill % = K ÷ TA',
    vars: [['K', 'kills'], ['E', 'attack errors (including blocked attacks)'], ['TA', 'total attack attempts']],
    note: 'Despite the name, hitting percentage is usually written as a three-decimal number (.286), not a percent. Kill percentage is usually shown as a percent.'
  },
  example: `<p>An outside hitter's match: 35 swings, 14 kills, 4 errors (2 hit out, 1 into the net, 1 blocked), 17 attacks dug by the other team.</p>
<p>Hitting percentage = (14 − 4) ÷ 35 = 10 ÷ 35 = <strong>.286</strong>.</p>
<p>Kill percentage = 14 ÷ 35 = <strong>40.0%</strong>. Over 4 sets that is 3.50 kills per set.</p>
<p>Two more kills instead of dug balls, (16 − 4) ÷ 35, would lift it to .343. Two fewer errors, (14 − 2) ÷ 35, gives the same .343: cutting an error is worth exactly as much as adding a kill.</p>`,
  table: {
    title: 'What hitting percentage do kills and errors give on 30 attempts?',
    intro: 'Hitting percentage for 30 swings, a typical high-volume match for an outside hitter, worked out by the calculator.',
    head: ['Kills', '0 errors', '2 errors', '4 errors', '6 errors', '8 errors'],
    rows: ({ run }) => [6, 8, 10, 12, 14, 16, 18, 20].map(k => [String(k), ...[0, 2, 4, 6, 8].map(e => run({ k, e, ta: 30, sets: '' }).value)])
  },
  sections: [
    {
      h2: 'What is a good hitting percentage in volleyball?',
      html: `<p>Coaches' rules of thumb, which shift by position and level:</p>
<ul><li><strong>.400 and up:</strong> outstanding; NCAA Division I hitting-percentage leaderboards are dominated by middle blockers above .400</li><li><strong>.300–.399:</strong> excellent, especially for an outside hitter who takes the most difficult sets</li><li><strong>.200–.299:</strong> good, a solid contributor</li><li><strong>.100–.199:</strong> below average</li><li><strong>Under .100:</strong> errors are wiping out most kills</li></ul>
<p>Middles hit higher because they swing on quick, well-timed sets against fewer blockers. Outside and opposite hitters get the high outside sets and out-of-system balls, so .250 from the left side can be more valuable than .350 from the middle on half the swings. Compare players at the same position and level.</p>`
    },
    {
      h2: 'How do you calculate kill percentage in volleyball?',
      html: `<p>Kill percentage is kills ÷ total attempts × 100. It measures how often a swing ends the rally, without subtracting errors. 14 kills on 35 attempts is a 40.0% kill rate.</p>
<p>Use both numbers together. A hitter with a 45% kill rate and a 20% error rate hits only .250, while a 35% kill rate with 5% errors hits .300. The second hitter is more efficient even though she kills fewer balls.</p>`
    },
    {
      h2: 'Does a blocked ball count as an attack error?',
      html: `<p>Yes, when the block ends the rally. If a hitter is stuffed and the ball lands on her side for a point, she is charged with an attack error and the blockers get a block (solo or assists). If the ball is blocked but her team digs it and keeps playing, it is just an attempt, with no error and no kill.</p>
<p>Other attack errors: hitting the ball out of bounds or into the antenna, hitting into the net so it doesn't cross, a net or centerline violation during the attack, and illegal attacks such as a back-row attack in front of the 3-meter line.</p>`
    },
    {
      h2: 'How do you calculate serving percentage in volleyball?',
      html: `<p>Serving percentage = (total serves − service errors) ÷ total serves × 100. A player who serves 20 times with 2 errors is serving (20 − 2) ÷ 20 = <strong>90%</strong>. Aces are counted separately: ace percentage = aces ÷ total serves. Most coaches look for a serving percentage of 90% or higher with a few aces per match.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate hitting percentage quickly?', a: 'Subtract errors from kills and divide by total swings. 12 kills, 3 errors and 30 attempts is 9 ÷ 30 = .300.' },
    { q: 'Can hitting percentage be negative?', a: 'Yes. If a player has more errors than kills, the hitting percentage is negative, down to −1.000 if every swing is an error.' },
    { q: 'Is .250 a good hitting percentage?', a: 'Yes, .250 is a solid hitting percentage, especially for an outside hitter. For a middle blocker it is about average.' },
    { q: 'Why is it called a percentage if it\'s a decimal?', a: 'It comes from the batting-average style of writing statistics. A .286 hitting percentage would be 28.6% if written as a percent.' },
    { q: 'What is attack efficiency?', a: 'Attack efficiency is another name for hitting percentage: (kills − errors) ÷ total attempts.' },
    { q: 'Do free balls count as attack attempts?', a: 'Only if they are attacked. An overhead or underhand free ball that is just sent over is not an attack attempt. A tip or roll shot meant to score is an attempt.' },
    { q: 'How is team hitting percentage calculated?', a: 'Use the team totals: (team kills − team attack errors) ÷ team total attempts. Don\'t average the players\' percentages.' }
  ],
  related: ['ops-calculator', 'passer-rating-calculator', 'percentage-calculator', 'average-calculator'],
  sources: [
    { name: 'NCAA.com: Division I women\'s volleyball hitting percentage leaders', url: 'https://www.ncaa.com/stats/volleyball-women/d1/current/individual/1' },
    { name: 'NCAA.com: Division I women\'s volleyball statistics', url: 'https://www.ncaa.com/stats/volleyball-women/d1' }
  ]
};
