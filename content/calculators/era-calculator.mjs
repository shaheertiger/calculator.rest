export default {
  slug: 'era-calculator',
  hub: 'sports',
  name: 'ERA Calculator',
  title: 'ERA Calculator: 62 Earned Runs in 182.1 Innings Is a 3.06 ERA',
  h1: 'ERA Calculator for Baseball and Softball Pitchers (with WHIP)',
  meta: 'ERA = earned runs × 9 ÷ innings pitched, counting .1 and .2 as thirds. 62 earned runs in 182⅓ innings is a 3.06 ERA. Softball (7-inning) and WHIP included.',
  keyword: 'how is era calculated in baseball',
  also: ['how is era in baseball calculated', 'how to calculate era in softball', 'how is era calculated in softball', 'era calculator', 'earned run average calculator', 'whip calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'er', label: 'Earned runs allowed', type: 'number', value: 62 },
    { id: 'ip', label: 'Innings pitched', type: 'number', value: 182.1, help: 'Use box-score notation: .1 = one out (⅓ inning), .2 = two outs (⅔).' },
    { id: 'game', label: 'Game length', type: 'select', value: '9', options: [['9', '9 innings (baseball)'], ['7', '7 innings (softball, high school)'], ['6', '6 innings (some youth leagues)']] },
    { id: 'hits', label: 'Hits allowed (for WHIP)', type: 'number', value: 160 },
    { id: 'bb', label: 'Walks allowed (for WHIP)', type: 'number', value: 51 }
  ],
  compute(v, H) {
    if (!(v.er >= 0)) return { error: 'Enter earned runs (0 or more).' };
    if (!(v.ip >= 0)) return { error: 'Enter innings pitched, e.g. 6.2 for six and two-thirds.' };
    var whole = Math.floor(v.ip + 1e-9);
    var frac = Math.round((v.ip - whole) * 10);
    if (frac > 2) return { error: 'Innings use .1 and .2 for one and two outs. ' + H.num(v.ip, 2) + ' is not a valid innings total.' };
    var outs = whole * 3 + frac;
    var ip = outs / 3;
    var g = Number(v.game) || 9;
    var ipText = whole + (frac ? ' ' + (frac === 1 ? '⅓' : '⅔') : '');
    if (outs === 0) {
      if (v.er > 0) return { value: '∞', label: 'ERA (no outs recorded)', expr: v.er + ' ER × ' + g + ' ÷ 0 IP', sub: 'Runs scored with no outs recorded give an infinite ERA until the pitcher gets an out.' };
      return { error: 'Enter innings pitched.' };
    }
    var era = v.er * g / ip;
    var rows = [
      ['Innings as a number', H.fix(ip, 3) + ' (' + ipText + ')'],
      ['Outs recorded', String(outs)],
      ['Earned runs per inning', H.fix(v.er / ip, 3)]
    ];
    if (v.hits >= 0 && v.bb >= 0) {
      rows.push(['WHIP (walks + hits per inning)', H.fix((v.hits + v.bb) / ip, 2), true]);
      rows.push(['Baserunners per ' + g + ' innings', H.fix((v.hits + v.bb) * g / ip, 1)]);
    }
    if (g !== 9) rows.push(['Same line on a 9-inning scale', H.fix(v.er * 9 / ip, 2)]);
    var lvl = g === 9 ? (era < 2.5 ? 'Elite: ace territory in MLB.' : era < 3.5 ? 'Well above average for an MLB starter.' : era < 4.5 ? 'Around the MLB league average of roughly 4.00.' : era < 5.5 ? 'Below average at the major-league level.' : 'High: hitters are scoring often against this pitcher.') : 'Compare with other pitchers on the same ' + g + '-inning scale.';
    return {
      value: H.fix(era, 2),
      label: 'Earned run average',
      expr: v.er + ' ER × ' + g + ' ÷ ' + H.fix(ip, 3) + ' IP',
      rows: rows,
      sub: lvl
    };
  },
  quick: ({ r }) => `ERA is earned runs × 9 ÷ innings pitched. Count partial innings in thirds: 182.1 innings is 182⅓, or 182.333. A pitcher who allows <strong>62 earned runs in 182.1 innings</strong> has a <strong>${r.value} ERA</strong> (62 × 9 ÷ 182.333). For 7-inning softball and high school games, multiply by 7 instead of 9.`,
  stepsTitle: 'How to calculate ERA',
  steps: [
    'Count only <strong>earned runs</strong>: runs that scored without the help of an error or a passed ball. The official scorer decides this; the box score lists it as ER.',
    'Convert innings pitched to a true number. The digit after the point is <strong>outs, not tenths</strong>: 6.1 = 6⅓ = 6.333 and 6.2 = 6⅔ = 6.667. Treating 6.2 as 6.2 is the most common ERA mistake.',
    'Multiply earned runs by the number of innings in a regulation game: 9 for baseball, 7 for softball and high school baseball.',
    'Divide by innings pitched and round to two decimals.'
  ],
  formulaTitle: 'What is the ERA formula?',
  formula: {
    expr: 'ERA = (Earned Runs × 9) ÷ Innings Pitched<br>Softball ERA = (Earned Runs × 7) ÷ Innings Pitched<br>WHIP = (Walks + Hits) ÷ Innings Pitched',
    vars: [['Earned Runs', 'runs charged to the pitcher that did not result from errors or passed balls'], ['Innings Pitched', 'outs recorded ÷ 3 (x.1 = ⅓, x.2 = ⅔)'], ['9 or 7', 'innings in a regulation game']]
  },
  example: `<p>A starter's season line is 182.1 innings, 62 earned runs, 160 hits and 51 walks.</p>
<p>Innings: 182.1 means 182 innings and 1 out = 182⅓ = 182.333.</p>
<p>ERA = 62 × 9 ÷ 182.333 = 558 ÷ 182.333 = <strong>3.06</strong>.</p>
<p>WHIP = (160 + 51) ÷ 182.333 = 211 ÷ 182.333 = <strong>1.16</strong>.</p>
<p>A softball pitcher with 30 earned runs in 140 innings has an ERA of 30 × 7 ÷ 140 = <strong>1.50</strong>.</p>`,
  table: {
    title: 'What ERA does one outing produce?',
    intro: 'Single-game ERA for common outings on the 9-inning scale, computed by the calculator. Note how much one run moves the number in a short appearance.',
    head: ['Innings pitched', '0 ER', '1 ER', '2 ER', '3 ER', '4 ER'],
    rows: ({ run }) => [1, 2, 2.2, 3, 4, 5, 5.1, 5.2, 6, 6.1, 6.2, 7, 8, 9].map(ip => [String(ip), ...[0, 1, 2, 3, 4].map(er => run({ er, ip, game: '9' }).value)])
  },
  sections: [
    {
      h2: 'How do you count partial innings in ERA?',
      html: `<p>Each out is one-third of an inning. Box scores write a third as .1 and two-thirds as .2, so the innings column never shows .3 to .9. To calculate, convert outs to a fraction: total outs ÷ 3.</p>
<ul><li>5.1 IP = 16 outs = 5.333 innings</li><li>5.2 IP = 17 outs = 5.667 innings</li><li>182.1 IP = 547 outs = 182.333 innings</li></ul>
<p>Using 5.2 as a decimal gives the wrong ERA. Three earned runs in 5.2 innings is a <strong>4.76</strong> ERA (27 ÷ 5.667), not 5.19 (27 ÷ 5.2). Adding innings works the same way: 5.2 + 6.1 is 17 + 19 = 36 outs, which is exactly 12.0 innings, not 11.3.</p>`
    },
    {
      h2: 'What is a good ERA in baseball?',
      html: `<p>The major-league average ERA has sat around 4.00 to 4.30 in recent seasons, so anything under 4.00 is better than average. Rough MLB benchmarks for a starting pitcher:</p>
<ul><li><strong>Under 2.50:</strong> elite, Cy Young contention</li><li><strong>2.50–3.49:</strong> excellent, a front-line starter</li><li><strong>3.50–4.49:</strong> about average</li><li><strong>4.50–5.49:</strong> below average</li><li><strong>5.50+:</strong> poor</li></ul>
<p>To qualify for the ERA title a pitcher needs at least one inning pitched per team game (162 in a full season). Bob Gibson's 1.12 ERA in 1968 is the lowest by a qualified pitcher in the modern live-ball era. In high school and college, ERAs vary widely by level, so compare against teammates and conference averages.</p>`
    },
    {
      h2: 'What counts as an earned run?',
      html: `<p>A run is earned unless it scored because of a fielding error or a passed ball (catcher's interference and obstruction also make a run unearned). Wild pitches, hit batters and walks are the pitcher's responsibility, so runs they produce are earned.</p>
<p>When an error extends an inning, the scorer "reconstructs" the inning as if the error hadn't happened: any run that would not have scored without it, including everything after what should have been the third out, is unearned. Runners a pitcher leaves on base are charged to <em>him</em> if they score after he is relieved.</p>`
    },
    {
      h2: 'How is ERA calculated in softball?',
      html: `<p>Softball games are 7 innings, so softball ERA = earned runs × 7 ÷ innings pitched. The same applies to high school baseball under NFHS rules and to 7-inning doubleheaders. A pitcher with 18 earned runs in 84 innings has an ERA of 18 × 7 ÷ 84 = <strong>1.50</strong>. On the 9-inning scale that same line would be 1.93, so don't compare softball and baseball ERAs directly.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate ERA quickly?', a: 'Divide earned runs by innings pitched and multiply by 9. Three earned runs in 6 innings is 3 ÷ 6 × 9 = 4.50.' },
    { q: 'What does 6.2 innings pitched mean?', a: 'It means 6 innings and 2 outs, or 6⅔ innings (6.667). The decimal counts outs, not tenths of an inning.' },
    { q: 'Can ERA be infinite?', a: 'Yes. If a pitcher allows an earned run without recording an out, the ERA is infinite (shown as ∞ or INF) until they get an out.' },
    { q: 'Do unearned runs count in ERA?', a: 'No. Runs that score because of an error or passed ball are unearned and are left out of ERA. They still count in RA9 (total runs allowed per 9 innings).' },
    { q: 'What is WHIP and how is it different from ERA?', a: 'WHIP is walks plus hits divided by innings pitched. It measures how many baserunners a pitcher allows per inning, while ERA measures runs. An MLB WHIP around 1.30 is roughly average; under 1.10 is excellent.' },
    { q: 'What is a good ERA in high school?', a: 'High school uses 7-inning games, so ERA = ER × 7 ÷ IP. Under 2.00 is very strong at most levels, but it depends heavily on the competition, so compare within your league.' },
    { q: 'Is ERA rounded or truncated?', a: 'ERA is rounded to two decimal places in MLB statistics. 3.0603 shows as 3.06 and 3.065 as 3.07.' }
  ],
  related: ['ops-calculator', 'passer-rating-calculator', 'average-calculator', 'percentage-calculator'],
  sources: [
    { name: 'MLB.com Glossary: Earned Run Average (ERA)', url: 'https://www.mlb.com/glossary/standard-stats/earned-run-average' },
    { name: 'MLB.com Glossary: Walks and Hits per Inning Pitched (WHIP)', url: 'https://www.mlb.com/glossary/standard-stats/walks-and-hits-per-inning-pitched' }
  ]
};
