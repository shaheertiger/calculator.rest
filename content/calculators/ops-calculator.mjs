export default {
  slug: 'ops-calculator',
  hub: 'sports',
  name: 'OPS Calculator',
  title: 'OPS Calculator: .381 OBP + .538 SLG = .919 OPS (Baseball)',
  h1: 'OPS Calculator: On-Base Plus Slugging, OBP, SLG and Batting Average',
  meta: 'OPS is on-base percentage plus slugging. A hitter with 165 hits, 30 homers and 70 walks in 550 at-bats has a .381 OBP, .538 SLG and a .919 OPS.',
  keyword: 'how to calculate ops in baseball',
  also: ['how do i calculate ops in baseball', 'ops calculator', 'on base percentage calculator', 'slugging percentage calculator', 'how do you calculate batting average for softball', 'how to calculate batting average in softball', 'how to calculate softball batting average'],
  updated: '2026-11-13',
  inputs: [
    { id: 'ab', label: 'At-bats (AB)', type: 'number', value: 550 },
    { id: 'h', label: 'Hits (H, all types)', type: 'number', value: 165 },
    { id: 'd', label: 'Doubles (2B)', type: 'number', value: 35 },
    { id: 't', label: 'Triples (3B)', type: 'number', value: 3 },
    { id: 'hr', label: 'Home runs (HR)', type: 'number', value: 30 },
    { id: 'bb', label: 'Walks (BB, incl. intentional)', type: 'number', value: 70 },
    { id: 'hbp', label: 'Hit by pitch (HBP)', type: 'number', value: 5 },
    { id: 'sf', label: 'Sacrifice flies (SF)', type: 'number', value: 5 }
  ],
  compute(v, H) {
    function z(x) { return x >= 0 ? x : 0; }
    var ab = v.ab, h = v.h, d = z(v.d), t = z(v.t), hr = z(v.hr), bb = z(v.bb), hbp = z(v.hbp), sf = z(v.sf);
    if (!(ab > 0)) return { error: 'Enter at-bats (more than 0).' };
    if (!(h >= 0) || h > ab) return { error: 'Hits must be between 0 and at-bats.' };
    if (d + t + hr > h) return { error: 'Doubles + triples + home runs cannot be more than total hits.' };
    function rate(x) { var s = x.toFixed(3); return s.charAt(0) === '0' ? s.slice(1) : s; }
    var singles = h - d - t - hr;
    var tb = singles + 2 * d + 3 * t + 4 * hr;
    var pa = ab + bb + hbp + sf;
    var obp = (h + bb + hbp) / pa;
    var slg = tb / ab;
    var avg = h / ab;
    var ops = obp + slg;
    var tier = ops >= 0.9 ? 'Great (.900+)' : ops >= 0.8334 ? 'Very good (.834–.899)' : ops >= 0.7667 ? 'Above average (.767–.833)' : ops >= 0.7 ? 'Average (.700–.766)' : ops >= 0.6334 ? 'Below average (.634–.699)' : ops >= 0.5667 ? 'Poor (.567–.633)' : 'Very poor (under .567)';
    return {
      value: rate(ops),
      label: 'OPS (on-base plus slugging)',
      expr: rate(obp) + ' OBP + ' + rate(slg) + ' SLG',
      rows: [
        ['On-base percentage (OBP)', rate(obp), true],
        ['Slugging percentage (SLG)', rate(slg), true],
        ['Batting average (AVG)', rate(avg)],
        ['Slash line', rate(avg) + ' / ' + rate(obp) + ' / ' + rate(slg)],
        ['Total bases', H.int(tb) + ' (' + singles + ' 1B, ' + d + ' 2B, ' + t + ' 3B, ' + hr + ' HR)'],
        ['Isolated power (SLG − AVG)', rate(slg - avg)],
        ['OBP denominator (AB + BB + HBP + SF)', H.int(pa)]
      ],
      sub: 'Bill James scale: ' + tier + '.'
    };
  },
  quick: ({ r }) => `OPS = on-base percentage + slugging percentage. A hitter with <strong>165 hits</strong> (35 doubles, 3 triples, 30 homers), 70 walks, 5 HBP and 5 sacrifice flies in 550 at-bats reaches base at a .381 clip and slugs .538 (296 total bases ÷ 550), for an <strong>OPS of ${r.value}</strong>. His batting average is .300.`,
  stepsTitle: 'How to calculate OPS in baseball',
  steps: [
    'Calculate <strong>on-base percentage</strong>: (hits + walks + hit by pitch) ÷ (at-bats + walks + hit by pitch + sacrifice flies).',
    'Count <strong>total bases</strong>: singles + 2 × doubles + 3 × triples + 4 × home runs. Get singles by subtracting extra-base hits from total hits; forgetting this step double-counts every extra-base hit.',
    'Calculate <strong>slugging percentage</strong>: total bases ÷ at-bats.',
    'Add OBP and SLG. Write the result to three decimals without the leading zero, like .919. OPS above 1.000 is possible and is written 1.023.'
  ],
  formulaTitle: 'What is the OPS formula?',
  formula: {
    expr: 'OBP = (H + BB + HBP) ÷ (AB + BB + HBP + SF)<br>SLG = TB ÷ AB, where TB = 1B + 2×2B + 3×3B + 4×HR<br>OPS = OBP + SLG',
    vars: [['H', 'hits'], ['BB', 'walks (bases on balls), including intentional'], ['HBP', 'times hit by a pitch'], ['AB', 'at-bats (excludes walks, HBP, sacrifices and catcher\'s interference)'], ['SF', 'sacrifice flies'], ['TB', 'total bases']],
    note: 'Sacrifice bunts are left out of both OBP and SLG. Reaching on an error or fielder\'s choice counts as an at-bat without a hit.'
  },
  example: `<p>The default line: 550 AB, 165 H (35 2B, 3 3B, 30 HR), 70 BB, 5 HBP, 5 SF.</p>
<p>Singles = 165 − 35 − 3 − 30 = 97. Total bases = 97 + 70 + 9 + 120 = <strong>296</strong>.</p>
<p>OBP = (165 + 70 + 5) ÷ (550 + 70 + 5 + 5) = 240 ÷ 630 = <strong>.381</strong>.</p>
<p>SLG = 296 ÷ 550 = <strong>.538</strong>. AVG = 165 ÷ 550 = .300.</p>
<p>OPS = .38095 + .53818 = <strong>.919</strong>. Add the unrounded numbers; adding the rounded .381 and .538 also gives .919 here, but can be off by .001 on other lines.</p>`,
  table: {
    title: 'How much do walks and home runs add to OPS?',
    intro: 'Each row changes one part of the example .919 season and recomputes it with the calculator, so you can see which skill moves OPS most.',
    head: ['Change to the season', 'AVG', 'OBP', 'SLG', 'OPS'],
    rows: ({ run }) => {
      const lines = [
        ['Example season as entered', {}],
        ['+20 walks', { bb: 90 }],
        ['−20 walks', { bb: 50 }],
        ['+10 singles (10 more hits)', { h: 175 }],
        ['10 singles become doubles', { d: 45 }],
        ['10 singles become home runs', { hr: 40 }],
        ['+10 home runs (10 more hits)', { h: 175, hr: 40 }],
        ['+50 at-bats with no hits', { ab: 600 }],
        ['Half the walks, half the homers', { bb: 35, hr: 15, h: 150 }]
      ];
      return lines.map(([n, o]) => { const r = run(o); return [n, r.rows[2][1], r.rows[0][1], r.rows[1][1], r.value]; });
    },
    note: 'Turning singles into home runs adds 3 total bases each, which is why power raises OPS faster than average. Walks only feed OBP.'
  },
  sections: [
    {
      h2: 'What is a good OPS in baseball?',
      html: `<p>Bill James' widely used scale for full-season OPS:</p>
<div class="twrap"><table><thead><tr><th>Rating</th><th>OPS</th></tr></thead><tbody>
<tr><td>Great</td><td>.900 and higher</td></tr><tr><td>Very good</td><td>.834–.899</td></tr><tr><td>Above average</td><td>.767–.833</td></tr><tr><td>Average</td><td>.700–.766</td></tr><tr><td>Below average</td><td>.634–.699</td></tr><tr><td>Poor</td><td>.567–.633</td></tr><tr><td>Very poor</td><td>.566 and lower</td></tr>
</tbody></table></div>
<p>League context matters: the overall MLB OPS has been in the low .700s in recent seasons, so a .750 OPS is a little above the big-league norm today. A 1.000 OPS season is rare and usually means an MVP-level year.</p>`
    },
    {
      h2: 'Why does OPS use different denominators?',
      html: `<p>OBP divides by plate appearances (minus sacrifice bunts and a few rare events), because walks and hit-by-pitches count as reaching base. SLG divides by at-bats only, because walks are not part of slugging. Adding two numbers with different denominators is not mathematically pure, and OPS slightly undervalues OBP (one point of OBP is worth more runs than one point of SLG), but it tracks run scoring well and is easy to compute from a box score.</p>
<p>For a park- and league-adjusted version, analysts use OPS+, where 100 is league average and 120 means 20% better. It needs league and park factors, so it can't be computed from one player's line.</p>`
    },
    {
      h2: 'How do you calculate batting average in softball?',
      html: `<p>Batting average is the same in softball and baseball: hits ÷ at-bats, written to three decimals. A softball player with 28 hits in 80 at-bats is hitting 28 ÷ 80 = <strong>.350</strong>. Walks, hit-by-pitches, sacrifice bunts and sacrifice flies are not at-bats, so they neither help nor hurt the average.</p>
<p>OPS works the same way in softball, but averages run higher than in baseball (especially in slow-pitch), so compare players within the same league.</p>`
    },
    {
      h2: 'Does reaching on an error count toward OPS?',
      html: `<p>No. Reaching on an error or a fielder's choice is an at-bat with no hit, so it lowers AVG, OBP and SLG. Catcher's interference is not an at-bat and not part of OBP. A game-ending hit is credited with only as many bases as it takes to score the winning run (unless the ball leaves the park), so a walk-off drive off the wall can go in the book as a single.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate OPS quickly?', a: 'Add on-base percentage and slugging percentage. A .350 OBP and a .450 SLG make an .800 OPS.' },
    { q: 'Can OPS be over 1.000?', a: 'Yes. The theoretical maximum is 5.000 (a 1.000 OBP plus a 4.000 SLG). A 1.000+ OPS over a full season is elite and happens only a handful of times each year in MLB, if at all.' },
    { q: 'Is a .700 OPS good?', a: 'A .700 OPS is about average on the Bill James scale and close to recent MLB league-wide levels. It is solid for a defense-first player and low for a first baseman or designated hitter.' },
    { q: 'Do sacrifice flies count in OPS?', a: 'Sacrifice flies are added to the OBP denominator (which lowers OBP slightly) but are not at-bats, so they do not affect slugging.' },
    { q: 'What is the difference between OPS and batting average?', a: 'Batting average counts only hits per at-bat. OPS adds walks and hit-by-pitches (through OBP) and gives extra weight to doubles, triples and homers (through SLG), so it captures far more of a hitter\'s value.' },
    { q: 'How do you write OPS?', a: 'Write it to three decimals without a leading zero (.919) when it is under 1, and with the 1 when it is over (1.035). It is pronounced "nine nineteen."' },
    { q: 'What is OPS+?', a: 'OPS+ adjusts OPS for the player\'s league and ballpark and scales it so 100 is average. A 150 OPS+ is 50% better than league average.' }
  ],
  related: ['era-calculator', 'passer-rating-calculator', 'volleyball-hitting-percentage-calculator', 'percentage-calculator', 'average-calculator'],
  sources: [
    { name: 'MLB.com Glossary: On-base Plus Slugging (OPS)', url: 'https://www.mlb.com/glossary/standard-stats/on-base-plus-slugging' },
    { name: 'MLB.com Glossary: On-base Percentage (OBP)', url: 'https://www.mlb.com/glossary/standard-stats/on-base-percentage' },
    { name: 'MLB.com Glossary: Slugging Percentage (SLG)', url: 'https://www.mlb.com/glossary/standard-stats/slugging-percentage' },
    { name: 'MLB.com Glossary: Batting Average (AVG)', url: 'https://www.mlb.com/glossary/standard-stats/batting-average' }
  ]
};
