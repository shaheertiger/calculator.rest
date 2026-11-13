export default {
  slug: 'bowling-handicap-calculator',
  hub: 'sports',
  name: 'Bowling Handicap Calculator',
  title: 'Bowling Handicap Calculator: 168 Average Gets 46 Pins at 90%',
  h1: 'Bowling Handicap Calculator for League Averages',
  meta: 'A bowler with a 168 average gets 46 pins a game at 90% of 220 (138 for a 3-game series). Enter your average or game scores and your league basis.',
  keyword: 'how to calculate bowling handicap',
  also: ['how is bowling handicap calculated', 'how to calculate a bowling handicap', 'how do you calculate bowling handicap', 'how do you calculate handicap in bowling', 'how to calculate handicap in bowling', 'how to calculate average in bowling', 'bowling handicap calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'source', label: 'Start from', type: 'select', value: 'avg', options: [['avg', 'My bowling average'], ['games', 'My game scores (works out the average)']] },
    { id: 'avg', label: 'Your average', type: 'number', value: 168, showIf: { source: ['avg'] } },
    { id: 'games', label: 'Game scores', type: 'text', multiline: 3, value: '172, 158, 181, 149, 190, 165, 177, 154, 169', placeholder: 'e.g. 172 158 181', showIf: { source: ['games'] } },
    { id: 'basis', label: 'League basis score', type: 'number', value: 220, help: 'Common bases are 200, 210, 220 and 230. Your league secretary sets it.' },
    { id: 'pct', label: 'Handicap percentage', type: 'number', value: 90, suffix: '%' },
    { id: 'series', label: 'Games per series', type: 'number', value: 3 }
  ],
  compute(v, H) {
    var avg, rows = [], note = '';
    if (v.source === 'games') {
      var g = H.list(v.games).filter(function (x) { return x >= 0 && x <= 300; });
      if (!g.length) return { error: 'Enter at least one game score between 0 and 300.' };
      var tot = H.sum(g);
      avg = Math.floor(tot / g.length + 1e-9);
      rows.push(['Games entered', String(g.length)]);
      rows.push(['Total pins', H.int(tot)]);
      rows.push(['Exact average', H.fix(tot / g.length, 2)]);
      note = 'Average = ' + H.int(tot) + ' ÷ ' + g.length + ', fractions dropped. ';
    } else {
      if (!(v.avg >= 0 && v.avg <= 300)) return { error: 'Enter an average between 0 and 300.' };
      avg = Math.floor(v.avg + 1e-9);
    }
    if (!(v.basis > 0 && v.basis <= 300)) return { error: 'Enter a basis score between 1 and 300.' };
    if (!(v.pct > 0 && v.pct <= 100)) return { error: 'Enter a handicap percentage between 1 and 100.' };
    var series = v.series >= 1 ? Math.floor(v.series) : 3;
    var diff = v.basis - avg;
    var hcp = diff > 0 ? Math.floor(diff * v.pct / 100 + 1e-9) : 0;
    rows.unshift(['Average used', String(avg)]);
    rows.push(['Pins below basis', String(Math.max(0, diff))]);
    rows.push(['Handicap per ' + series + '-game series', String(hcp * series), true]);
    rows.push(['Average + handicap', String(avg + hcp)]);
    return {
      value: hcp + ' pins',
      label: 'Handicap per game',
      expr: '(' + H.num(v.basis, 0) + ' − ' + avg + ') × ' + H.num(v.pct, 1) + '%',
      rows: rows,
      sub: note + (diff <= 0 ? 'Your average is at or above the basis, so you bowl scratch (no handicap).' : 'Unrounded it is ' + H.num(diff * v.pct / 100, 2) + '; USBC practice drops the fraction.')
    };
  },
  quick: ({ r }) => `Bowling handicap = (basis score − your average) × the league percentage, with fractions dropped. In a 90% of 220 league, a <strong>168 average</strong> is 52 pins under the basis, and 52 × 0.90 = 46.8, so the handicap is <strong>${r.value} per game</strong> or 138 pins for a three-game series. The same bowler gets 41 pins at 80% of 220.`,
  stepsTitle: 'How to calculate a bowling handicap',
  steps: [
    'Find your <strong>average</strong>: total pins divided by games bowled, dropping any fraction (a 168.9 average is 168). Leagues usually use last season\'s book average until you have bowled enough games this season.',
    'Look up your league\'s <strong>basis score</strong> and <strong>percentage</strong> in the league rules, for example "90% of 220" or "100% of 210".',
    'Subtract your average from the basis. If your average is higher than the basis, your handicap is zero.',
    'Multiply the difference by the percentage and <strong>drop the fraction</strong> (do not round up). 46.8 becomes 46, which is the step most new league secretaries get wrong.',
    'Add the handicap to each game\'s scratch score, or multiply it by the number of games for a series total.'
  ],
  formulaTitle: 'What is the bowling handicap formula?',
  formula: {
    expr: 'Handicap = (Basis − Average) × Percentage<br>Average = Total pins ÷ Games (fractions dropped)',
    vars: [['Basis', 'the score the league handicaps up to, usually 200–230'], ['Average', 'your scratch average, whole pins only'], ['Percentage', 'how much of the gap the league gives, usually 80–100%']],
    note: 'If the average is at or above the basis, the handicap is 0. Fractions are dropped from both the average and the final handicap.'
  },
  example: `<p>A bowler finished last season with 13,642 pins over 81 games. Average = 13,642 ÷ 81 = 168.42, so the book average is <strong>168</strong>.</p>
<p>The league uses 90% of 220: (220 − 168) × 0.90 = 52 × 0.90 = 46.8, so the handicap is <strong>46 pins</strong> a game.</p>
<p>Games of 159, 184 and 171 (514 scratch) become 205, 230 and 217 with handicap, a <strong>652 handicap series</strong> (514 + 138).</p>`,
  table: {
    title: 'What is my bowling handicap for each average?',
    intro: 'Handicap per game from the calculator for the most common league formulas.',
    head: ['Average', '90% of 220', '80% of 220', '100% of 210', '90% of 210', '80% of 200'],
    rows: ({ run }) => [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220].map(a => [String(a), ...[[220, 90], [220, 80], [210, 100], [210, 90], [200, 80]].map(([b, p]) => run({ source: 'avg', avg: a, basis: b, pct: p }).value.replace(' pins', ''))])
  },
  sections: [
    {
      h2: 'How do you calculate your bowling average?',
      html: `<p>Add up the pins from every game and divide by the number of games. Drop any fraction: USBC leagues use whole-pin averages, so 1,517 pins over 9 games is 168.56, which is a <strong>168</strong> average, not 169.</p>
<p>Count every game you bowled in that league, including bad nights. A league average and a tournament average are tracked separately; when you join a new league, the secretary usually uses your highest average from the previous season, then switches to your current-season average once you have bowled enough games (often 9 or 12, depending on league rules).</p>
<p>Choose "My game scores" above and paste your games to get the average and the handicap in one step.</p>`
    },
    {
      h2: 'What is a good basis and percentage for a bowling league?',
      html: `<p>The basis should sit at or just above the best average in the league, so the strongest bowler gets little or no handicap. The percentage decides how evenly matched teams are:</p>
<ul>
<li><strong>100% of 200–220:</strong> full handicap, common in youth, mixed and fun leagues; a 140 bowler and a 200 bowler start dead even.</li>
<li><strong>90% of 220:</strong> the most common adult league setting; gives a slight edge to the better bowler.</li>
<li><strong>80% of 210–230:</strong> rewards skill more; popular in competitive leagues and many handicap tournaments.</li>
</ul>
<p>The lower the percentage, the more each pin of average is worth. At 80%, raising your average by 10 pins costs you 8 pins of handicap, so you are 2 pins a game better off than before.</p>`
    },
    {
      h2: 'Why does bowling handicap drop the fraction instead of rounding?',
      html: `<p>Truncating is a long-standing convention in USBC-certified leagues and tournaments: averages and handicaps are calculated with fractions disregarded. It keeps the math the same for every secretary and slightly favors the stronger bowler. A computed handicap of 46.8 is 46, and 46.1 is also 46.</p>
<p>The calculator shows the unrounded figure under the answer so you can check your league sheet.</p>`
    },
    {
      h2: 'Can a bowling handicap be negative?',
      html: `<p>Normally no. If your average is above the basis, your handicap is zero and you bowl scratch. A few leagues use "minus handicap," where a bowler above the basis has pins subtracted, but it is rare and must be written into the league rules.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate 90% of 220 handicap?', a: 'Subtract your average from 220 and multiply by 0.9, dropping the fraction. A 150 average gives (220 − 150) × 0.9 = 63 pins per game.' },
    { q: 'What is 80% of 210 for a 160 average?', a: 'It is 40 pins: (210 − 160) × 0.8 = 40.' },
    { q: 'Do you round up a bowling handicap?', a: 'No. Fractions are dropped. A handicap that works out to 37.9 is 37 pins.' },
    { q: 'How many games do you need for an established average?', a: 'It depends on the league rules. Many leagues use your previous season\'s average until you have bowled 9 or 12 games in the current season.' },
    { q: 'Is handicap added to each game or the series?', a: 'Both. The per-game handicap is added to every game, so a three-game series gets three times the per-game handicap.' },
    { q: 'What handicap does a 200 average get?', a: 'At 90% of 220 a 200 average gets 18 pins. At 100% of 210 it gets 10. At 80% of 200 it gets none, because the average equals the basis.' },
    { q: 'Does my handicap change during the season?', a: 'Yes, in most leagues it is recalculated every week from your updated average, so a better week lowers next week\'s handicap.' }
  ],
  related: ['golf-handicap-calculator', 'average-calculator', 'percentage-calculator', 'weighted-average-calculator'],
  sources: [
    { name: 'USBC: United States Bowling Congress', url: 'https://bowl.com/' },
    { name: 'USBC Playing Rules and league resources', url: 'https://bowl.com/rules' }
  ]
};
