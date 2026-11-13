export default {
  slug: 'golf-handicap-calculator',
  hub: 'sports',
  name: 'Golf Handicap Calculator',
  title: 'Golf Handicap Calculator: WHS Handicap Index (2026 Rules)',
  h1: 'Golf Handicap Calculator: Handicap Index and Course Handicap',
  meta: 'Enter scores, Course Rating and Slope to get a World Handicap System index. Example: 10 rounds averaging 88.6 give a 12.8 index and a course handicap of 14.',
  keyword: 'how to calculate golf handicap',
  also: ['how do you calculate golf handicap', 'golf handicap calculator', 'how calculate handicap', 'how to calculate handicap for a course', 'how do you calculate course handicap', 'how is a golf handicap index calculated', 'how to calculate a handicap for 9 holes', 'how to calculate golf score'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you want to work out?', type: 'select', value: 'scores', wide: true, options: [['scores', 'Handicap Index from my scores (plus course handicap)'], ['index', 'Course handicap from a Handicap Index I already have']] },
    {
      id: 'rounds', label: 'Your most recent 18-hole rounds (up to 20)', type: 'rows', addLabel: '+ add round', max: 20, showIf: { mode: ['scores'] },
      help: 'Use your adjusted gross score (net double bogey is the most you can take on a hole). Course Rating and Slope Rating are printed on the scorecard for the tees you played. Leave PCC at 0 unless your handicap app shows one.',
      fields: [
        { id: 'score', label: 'Adjusted score', type: 'number', value: '', blank: true, placeholder: 'e.g. 88' },
        { id: 'rating', label: 'Course Rating', type: 'number', value: '', blank: true, placeholder: 'e.g. 71.2' },
        { id: 'slope', label: 'Slope', type: 'number', value: '', blank: true, placeholder: 'e.g. 128' },
        { id: 'pcc', label: 'PCC', type: 'number', value: 0 }
      ],
      value: [
        { score: 88, rating: 71.2, slope: 128, pcc: 0 },
        { score: 92, rating: 71.2, slope: 128, pcc: 0 },
        { score: 85, rating: 70.4, slope: 124, pcc: 0 },
        { score: 90, rating: 72.6, slope: 135, pcc: 0 },
        { score: 87, rating: 71.2, slope: 128, pcc: 0 },
        { score: 94, rating: 72.6, slope: 135, pcc: 1 },
        { score: 86, rating: 70.4, slope: 124, pcc: 0 },
        { score: 91, rating: 71.2, slope: 128, pcc: 0 },
        { score: 89, rating: 69.8, slope: 120, pcc: 0 },
        { score: 84, rating: 71.2, slope: 128, pcc: 0 }
      ]
    },
    { id: 'index', label: 'Your Handicap Index', type: 'number', value: 14.0, showIf: { mode: ['index'] }, help: 'Enter a plus handicap as a negative number (+1.5 → −1.5).' },
    { id: 'cRating', label: 'Course Rating of the tees you will play', type: 'number', value: 71.2 },
    { id: 'cSlope', label: 'Slope Rating of those tees', type: 'number', value: 128 },
    { id: 'par', label: 'Par', type: 'number', value: 72 },
    { id: 'allow', label: 'Handicap allowance', type: 'select', value: '100', options: [['100', '100%: course handicap, individual match play'], ['95', '95%: individual stroke play'], ['90', '90%: four-ball match play'], ['85', '85%: four-ball stroke play']] }
  ],
  compute(v, H) {
    function r1(x) { var s = x < 0 ? -1 : 1; return s * Math.round(Math.abs(x) * 10 + 1e-9) / 10; }
    function showIdx(x) { return x < 0 ? '+' + H.fix(-x, 1) : H.fix(x, 1); }
    function showCh(x) { return x < 0 ? '+' + (-x) : String(x); }
    var rows = [], out = {};
    var index;
    if (v.mode === 'index') {
      if (!(v.index >= -10 && v.index <= 54)) return { error: 'Enter a Handicap Index between +10.0 and 54.0.' };
      index = r1(v.index);
    } else {
      var list = [];
      (v.rounds || []).forEach(function (rd, i) {
        if (!(rd.score > 0) || !(rd.rating > 0) || !(rd.slope >= 55 && rd.slope <= 155)) return;
        var pcc = rd.pcc >= -1 && rd.pcc <= 3 ? Math.round(rd.pcc) : 0;
        list.push({ n: list.length + 1, score: rd.score, rating: rd.rating, slope: rd.slope, pcc: pcc, diff: r1(113 / rd.slope * (rd.score - rd.rating - pcc)) });
      });
      if (list.length > 20) list = list.slice(list.length - 20);
      var n = list.length;
      if (n < 3) return { error: 'Enter at least 3 rounds with a score, Course Rating and a Slope between 55 and 155.' };
      var use = n >= 20 ? 8 : n === 19 ? 7 : n >= 17 ? 6 : n >= 15 ? 5 : n >= 12 ? 4 : n >= 9 ? 3 : n >= 6 ? 2 : 1;
      var adj = n === 3 ? -2 : n === 4 ? -1 : n === 6 ? -1 : 0;
      var sorted = list.slice().sort(function (a, b) { return a.diff - b.diff; });
      var low = sorted.slice(0, use);
      low.forEach(function (x) { x.used = true; });
      var avg = H.mean(low.map(function (x) { return x.diff; }));
      index = Math.min(54, r1(avg + adj));
      out.value = showIdx(index);
      out.label = 'Handicap Index';
      out.expr = (use === 1 ? 'lowest of ' : 'avg of lowest ' + use + ' of ') + n + ' differentials' + (adj ? ' ' + H.fix(adj, 1) : '');
      rows.push(['Scores counted', 'Lowest ' + use + ' of ' + n]);
      rows.push(['Average of those differentials', H.fix(avg, 2)]);
      if (adj) rows.push(['WHS adjustment for ' + n + ' scores', H.fix(adj, 1)]);
      out.table = {
        caption: 'Score Differential = (113 ÷ Slope) × (score − Course Rating − PCC)',
        head: ['Round', 'Score', 'Rating / Slope', 'Differential', 'Counts?'],
        rows: list.map(function (x) { return [String(x.n), String(x.score), H.fix(x.rating, 1) + ' / ' + x.slope + (x.pcc ? ' (PCC ' + (x.pcc > 0 ? '+' : '') + x.pcc + ')' : ''), H.fix(x.diff, 1), x.used ? '✓ lowest' : '']; })
      };
    }
    var ch = null;
    if (v.cRating > 0 && v.cSlope >= 55 && v.cSlope <= 155 && v.par > 0) {
      var raw = index * (v.cSlope / 113) + (v.cRating - v.par);
      ch = Math.round(raw);
      var allow = Number(v.allow) || 100;
      var ph = Math.round(raw * allow / 100);
      if (v.mode === 'index') {
        out.value = showCh(ch);
        out.label = 'Course handicap';
        out.expr = showIdx(index) + ' × ' + v.cSlope + '/113 + (' + H.fix(v.cRating, 1) + ' − ' + v.par + ')';
        rows.push(['Unrounded', H.fix(raw, 2)]);
      } else {
        rows.push(['Course handicap (' + H.fix(v.cRating, 1) + ' / ' + v.cSlope + ', par ' + v.par + ')', showCh(ch), true]);
      }
      if (allow !== 100) rows.push(['Playing handicap at ' + allow + '%', showCh(ph), true]);
      rows.push(['Target score at these tees', String(Math.round(v.par + ch))]);
    } else if (v.mode === 'index') {
      return { error: 'Enter the Course Rating, a Slope Rating between 55 and 155 and par.' };
    } else {
      rows.push(['Course handicap', 'add Course Rating, Slope and par']);
    }
    out.rows = rows;
    out.sub = index <= 0 ? 'A plus handicap: you give strokes back to the course.' : index < 10 ? 'Single-digit index: a strong amateur golfer.' : index <= 20 ? 'A typical club golfer: you get about one stroke on most holes.' : index < 54 ? 'You get one or more strokes on every hole at most courses.' : 'Capped at the WHS maximum of 54.0.';
    return out;
  },
  quick: ({ r, run }) => {
    const ch = run({ mode: 'index', index: Number(String(r.value)) }).value;
    return `Your Handicap Index is the average of your lowest 8 Score Differentials from your last 20 rounds, where each differential = (113 ÷ Slope) × (adjusted score − Course Rating − PCC). With only 10 rounds the World Handicap System averages the lowest 3. The example rounds here give a <strong>${r.value} Handicap Index</strong>, which is a <strong>course handicap of ${ch}</strong> on a 71.2/128, par-72 course.`;
  },
  stepsTitle: 'How to calculate your golf handicap in 5 steps',
  steps: [
    'Work out your <strong>adjusted gross score</strong> for each round: cap every hole at net double bogey (par + 2 + any strokes you receive on that hole). This is the step most golfers skip, and it is why a home-made index can come out higher than the official one.',
    'Find the <strong>Course Rating</strong> and <strong>Slope Rating</strong> for the tees you played. They are on the scorecard, the tee sign or the USGA Course Rating database.',
    'Convert each round to a <strong>Score Differential</strong>: (113 ÷ Slope) × (adjusted score − Course Rating − PCC), rounded to one decimal. PCC is the daily Playing Conditions Calculation (−1 to +3), usually 0.',
    'Take your <strong>most recent 20</strong> differentials and average the lowest 8. With fewer than 20 rounds, use the WHS table below (3 rounds: lowest 1 minus 2.0; 10 rounds: average of lowest 3).',
    'Round to one decimal. That is your Handicap Index (maximum 54.0). Multiply by Slope ÷ 113 and add (Course Rating − par) to get your <strong>course handicap</strong> for a given set of tees.'
  ],
  formulaTitle: 'What is the golf handicap formula?',
  formula: {
    expr: 'Score Differential = (113 ÷ Slope Rating) × (Adjusted Gross Score − Course Rating − PCC)<br>Handicap Index = average of lowest 8 of the last 20 differentials (max 54.0)<br>Course Handicap = Handicap Index × (Slope Rating ÷ 113) + (Course Rating − Par)',
    vars: [['113', 'Slope Rating of a course of standard difficulty'], ['Slope Rating', '55–155; how much harder the course plays for a bogey golfer than a scratch golfer'], ['Course Rating', 'expected score of a scratch golfer from those tees, e.g. 71.2'], ['PCC', 'Playing Conditions Calculation, −1 to +3, set daily by the handicap system'], ['Adjusted Gross Score', 'your score with each hole capped at net double bogey']],
    note: 'Score Differentials and the Handicap Index are rounded to one decimal; course and playing handicaps are rounded to the nearest whole number. The 0.96 "bonus for excellence" multiplier from the old USGA system is gone: the World Handicap System uses the straight average.'
  },
  example: `<p>Take the 10 rounds loaded in the calculator. The first is an 88 on tees rated 71.2 with a Slope of 128:</p>
<p>Differential = (113 ÷ 128) × (88 − 71.2 − 0) = 0.8828 × 16.8 = <strong>14.8</strong>.</p>
<p>Doing the same for all 10 rounds gives differentials of 14.8, 18.4, 13.3, 14.6, 13.9, 17.1, 14.2, 17.5, 18.1 and 11.3 (round 6 had a PCC of +1, so 1 stroke comes off before scaling). With 10 scores the WHS uses the lowest 3: 11.3, 13.3 and 13.9. Their average is 38.5 ÷ 3 = 12.83, so the <strong>Handicap Index is 12.8</strong>.</p>
<p>At the home course (Course Rating 71.2, Slope 128, par 72): 12.8 × 128 ÷ 113 + (71.2 − 72) = 14.50 − 0.8 = 13.70, which rounds to a <strong>course handicap of 14</strong>. In a stroke-play event with a 95% allowance the playing handicap is 13.70 × 0.95 = 13.01, so <strong>13</strong>.</p>`,
  table: {
    title: 'What is my course handicap at different Slope Ratings?',
    intro: 'Course handicaps from the calculator for common Handicap Index values. The Course Rating is set equal to par here, so only Slope moves the number; add (Course Rating − par) for your tees.',
    head: ['Handicap Index', 'Slope 113', 'Slope 120', 'Slope 128', 'Slope 135', 'Slope 145'],
    rows: ({ run }) => [0, 2.5, 5, 8, 10, 12, 15, 18, 20, 24, 28, 36, 54].map(i => [i.toFixed(1), ...[113, 120, 128, 135, 145].map(s => run({ mode: 'index', index: i, cSlope: s, cRating: 72, par: 72, allow: '100' }).value)]),
    note: 'A plus value (shown as +1, +2) means you add strokes to your score instead of subtracting them.'
  },
  sections: [
    {
      h2: 'How many scores do you need for a golf handicap?',
      html: `<p>You need <strong>54 holes</strong> to get a Handicap Index: three 18-hole rounds, six 9-hole rounds or any mix. Until you have 20 scores the World Handicap System (WHS) uses fewer differentials and, for very small records, subtracts a little extra so a new index isn't inflated:</p>
<div class="twrap"><table><thead><tr><th>Scores in your record</th><th>Differentials used</th><th>Adjustment</th></tr></thead><tbody>
<tr><td>3</td><td>Lowest 1</td><td>−2.0</td></tr>
<tr><td>4</td><td>Lowest 1</td><td>−1.0</td></tr>
<tr><td>5</td><td>Lowest 1</td><td>0</td></tr>
<tr><td>6</td><td>Average of lowest 2</td><td>−1.0</td></tr>
<tr><td>7–8</td><td>Average of lowest 2</td><td>0</td></tr>
<tr><td>9–11</td><td>Average of lowest 3</td><td>0</td></tr>
<tr><td>12–14</td><td>Average of lowest 4</td><td>0</td></tr>
<tr><td>15–16</td><td>Average of lowest 5</td><td>0</td></tr>
<tr><td>17–18</td><td>Average of lowest 6</td><td>0</td></tr>
<tr><td>19</td><td>Average of lowest 7</td><td>0</td></tr>
<tr><td>20</td><td>Average of lowest 8</td><td>0</td></tr>
</tbody></table></div>
<p>Once you pass 20 scores, every new round pushes the oldest one out, so your index always reflects your last 20. Using the best 8 rather than all 20 is deliberate: a Handicap Index measures your <em>potential</em>, roughly what you shoot on a good day, not your average round. That is why most golfers score 2–4 strokes above their course handicap in a typical round.</p>`
    },
    {
      h2: 'How do you calculate a handicap for 9 holes?',
      html: `<p>A 9-hole round uses the 9-hole Course Rating and Slope Rating for the tees you played (printed on most scorecards, or half the 18-hole Course Rating as a rough guide). The 9-hole differential is (113 ÷ Slope) × (9-hole adjusted score − 9-hole Course Rating − PCC).</p>
<p>Since the 2024 revision of the Rules of Handicapping, that 9-hole differential is turned into an 18-hole one straight away by adding an <strong>expected score</strong> for the nine you didn't play, based on your current Handicap Index. Rounds of 10 to 17 holes are handled the same way, with expected scores filling in the missing holes. Before 2024, U.S. golfers had to wait for a second 9-hole score and combine the two.</p>
<p>Because expected scores depend on your index and the official tables, post 9-hole rounds through your club or the GHIN app. To use this calculator with 9-hole scores, add two 9-hole rounds together and enter the combined score with the combined ratings.</p>`
    },
    {
      h2: 'What is net double bogey and how do you adjust your score?',
      html: `<p>Net double bogey is the highest score you can post on any hole: <strong>par + 2 + the handicap strokes you receive on that hole</strong>. It stops one blow-up hole from inflating your index.</p>
<p>Example: a golfer with a course handicap of 14 gets one stroke on the holes with stroke index 1 to 14. On a par 4 with stroke index 6, the maximum is 4 + 2 + 1 = 7. On a par 3 with stroke index 16 (no stroke), the maximum is 3 + 2 = 5. If they made 9 and 6 on those holes, they post 7 and 5, cutting 3 strokes from the gross score.</p>
<p>Golfers with a course handicap above 18 get two strokes on the hardest holes (a course handicap of 22 gives two strokes on stroke index 1–4). Until you have an index, the cap is <strong>par + 5</strong> on every hole. Holes you start but don't finish are scored as the most likely score, up to net double bogey.</p>`
    },
    {
      h2: 'How do you calculate a course handicap?',
      html: `<p>Course handicap = Handicap Index × (Slope Rating ÷ 113) + (Course Rating − par), rounded to the nearest whole number. It is the number of strokes you receive from a particular set of tees.</p>
<p>The Slope part scales your index to how hard the course is for a bogey golfer. The (Course Rating − par) part was added when the WHS arrived in the U.S. in 2020: on tees rated 74.1 with par 72, everyone gets about two more strokes; on forward tees rated 68.9 with par 72, about three fewer. It lets golfers playing different tees compete fairly.</p>
<p>A 14.0 index on tees rated 73.4/140, par 72: 14.0 × 140 ÷ 113 + 1.4 = 17.35 + 1.4 = 18.75, which rounds to <strong>19 strokes</strong>. The same golfer on tees rated 69.0/119 gets 14.0 × 119 ÷ 113 − 3.0 = 11.74, so <strong>12 strokes</strong>.</p>
<p>For competitions, the course handicap is multiplied by a <strong>handicap allowance</strong>: 95% for individual stroke play, 85% for four-ball stroke play, 100% for individual match play and 90% for four-ball match play. Pick one in the calculator to get your playing handicap.</p>`
    },
    {
      h2: 'What changed in the World Handicap System in 2024?',
      html: `<p>The USGA and The R&amp;A review the Rules of Handicapping every few years. The main change in the 2024 revision, which still applies in the 2026 season, is how short rounds are treated: a 9-hole score, or a round of 10 to 17 holes, now produces an 18-hole Score Differential right away, with an expected score filling in the holes you didn't play. Before that, U.S. golfers had to pair two 9-hole scores, and unplayed holes in longer rounds were scored as net par.</p>
<p>What did not change: the 113 constant, the best 8 of 20 rule, the 54.0 maximum and the course handicap formula. Two safeguards also stay: a <strong>soft cap</strong> halves any rise of more than 3.0 strokes above your lowest index of the past 365 days, and a <strong>hard cap</strong> stops it rising more than 5.0. An <strong>exceptional score</strong> 7.0 or more strokes below your index cuts it by 1.0 (or 2.0 for 10.0 or more). Those depend on your full year of history, so this calculator doesn't apply them; your official index may be slightly lower as a result.</p>`
    }
  ],
  faq: [
    { q: 'How is a golf handicap calculated in simple terms?', a: 'Each round becomes a Score Differential: (113 ÷ Slope) × (adjusted score − Course Rating). Your Handicap Index is the average of your best 8 differentials from your last 20 rounds, rounded to one decimal.' },
    { q: 'What is the difference between a Handicap Index and a course handicap?', a: 'A Handicap Index travels with you and is the same at every course. A course handicap is the number of strokes you get from a particular set of tees: index × Slope ÷ 113 + (Course Rating − par). A 14.0 index is 15 strokes on 71.2/128 par-72 tees.' },
    { q: 'What is the maximum golf handicap?', a: 'The maximum Handicap Index under the World Handicap System is 54.0 for every golfer. Course handicaps can be higher than 54 on courses with a high Slope Rating.' },
    { q: 'Why is 113 used in the handicap formula?', a: '113 is the Slope Rating of a course of standard relative difficulty. Dividing by the actual Slope and multiplying by 113 converts your score on any course to that standard scale.' },
    { q: 'Can I calculate a handicap without Slope Rating?', a: 'Not accurately. Without Slope you can only estimate with (average score − Course Rating), which overstates the index on hard courses and understates it on easy ones. Course and Slope Ratings for most U.S. courses are listed in the USGA Course Rating and Slope database.' },
    { q: 'Do I need to join a club to get an official handicap?', a: 'Yes. An official Handicap Index is issued by a golf club authorized by an Allied Golf Association, such as a state golf association. Many offer online clubs with no home course. This calculator gives the same number from the same formula for your own tracking.' },
    { q: 'Is a lower handicap better?', a: 'Yes. A lower Handicap Index means a better golfer. A scratch golfer has an index of 0.0, and a plus handicap such as +2.0 means the player is expected to shoot better than the Course Rating.' },
    { q: 'How often is a Handicap Index updated?', a: 'Under the World Handicap System your index is revised daily, the day after you post a score, so it always reflects your most recent 20 rounds.' }
  ],
  related: ['bowling-handicap-calculator', 'average-calculator', 'weighted-average-calculator', 'percentage-calculator'],
  sources: [
    { name: 'USGA: Handicapping and the World Handicap System', url: 'https://www.usga.org/handicapping.html' },
    { name: 'World Handicap System (USGA and The R&A)', url: 'https://www.whs.com/' },
    { name: 'The R&A: governing body for golf outside the U.S. and Mexico', url: 'https://www.randa.org/' }
  ]
};
