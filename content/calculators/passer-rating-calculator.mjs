export default {
  slug: 'passer-rating-calculator',
  hub: 'sports',
  name: 'Passer Rating Calculator',
  title: 'Passer Rating Calculator: NFL Formula, 158.3 Max (and NCAA)',
  h1: 'Passer Rating Calculator for NFL and College Quarterbacks',
  meta: 'Enter attempts, completions, yards, touchdowns and interceptions. 410 of 600 for 4,500 yards, 32 TD and 10 INT is a 101.1 NFL passer rating (145.6 NCAA).',
  keyword: 'how to calculate a passer rating',
  also: ['how is nfl passer rating calculated', 'passer rating calculator', 'qb rating calculator', 'ncaa passing efficiency calculator', 'quarterback rating formula'],
  updated: '2026-11-13',
  inputs: [
    { id: 'att', label: 'Pass attempts', type: 'number', value: 600 },
    { id: 'cmp', label: 'Completions', type: 'number', value: 410 },
    { id: 'yds', label: 'Passing yards', type: 'number', value: 4500 },
    { id: 'td', label: 'Touchdown passes', type: 'number', value: 32 },
    { id: 'int', label: 'Interceptions', type: 'number', value: 10 },
    { id: 'scale', label: 'Show as main result', type: 'select', value: 'nfl', options: [['nfl', 'NFL / CFL / high school passer rating'], ['ncaa', 'NCAA passing efficiency']] }
  ],
  compute(v, H) {
    if (!(v.att > 0)) return { error: 'Enter pass attempts (more than 0).' };
    if (!(v.cmp >= 0) || v.cmp > v.att) return { error: 'Completions must be between 0 and attempts.' };
    if (!(v.td >= 0) || !(v.int >= 0)) return { error: 'Enter touchdowns and interceptions (0 or more).' };
    if (!(v.yds > -1e6)) return { error: 'Enter passing yards (can be negative).' };
    if (v.td + v.int > v.att || v.td > v.cmp) return { error: 'Touchdowns cannot exceed completions, and TD + INT cannot exceed attempts.' };
    function cap(x) { return Math.max(0, Math.min(2.375, x)); }
    var A = v.att;
    var a = cap((v.cmp / A - 0.3) * 5);
    var b = cap((v.yds / A - 3) * 0.25);
    var c = cap(v.td / A * 20);
    var d = cap(2.375 - v.int / A * 25);
    var nfl = (a + b + c + d) / 6 * 100;
    var ncaa = (8.4 * v.yds + 330 * v.td + 100 * v.cmp - 200 * v.int) / A;
    var isN = v.scale === 'ncaa';
    var rows = [
      [isN ? 'NFL passer rating' : 'NCAA passing efficiency', H.fix(isN ? nfl : ncaa, 1), true],
      ['Completion % → component a', H.fix(v.cmp / A * 100, 1) + '% → ' + H.fix(a, 3)],
      ['Yards per attempt → b', H.fix(v.yds / A, 2) + ' → ' + H.fix(b, 3)],
      ['Touchdown % → c', H.fix(v.td / A * 100, 1) + '% → ' + H.fix(c, 3)],
      ['Interception % → d', H.fix(v.int / A * 100, 1) + '% → ' + H.fix(d, 3)]
    ];
    var maxed = [a, b, c, d].filter(function (x) { return x >= 2.375; }).length;
    return {
      value: H.fix(isN ? ncaa : nfl, 1),
      label: isN ? 'NCAA passing efficiency' : 'NFL passer rating',
      expr: isN ? '(8.4×' + H.int(v.yds) + ' + 330×' + v.td + ' + 100×' + v.cmp + ' − 200×' + v.int + ') ÷ ' + A : '(' + H.fix(a, 3) + ' + ' + H.fix(b, 3) + ' + ' + H.fix(c, 3) + ' + ' + H.fix(d, 3) + ') ÷ 6 × 100',
      rows: rows,
      sub: (maxed === 4 ? 'A perfect NFL passer rating of 158.3. ' : maxed ? maxed + ' of 4 NFL components hit the 2.375 cap. ' : '') + (nfl >= 100 ? 'An NFL rating above 100 is Pro Bowl-level for a full season.' : nfl >= 90 ? 'Around the NFL league average (roughly 88–94 in recent seasons).' : nfl >= 80 ? 'Below the NFL league average.' : 'Well below an NFL starting standard.')
    };
  },
  quick: ({ r, run }) => `NFL passer rating averages four capped components (completion %, yards per attempt, TD % and INT %), each from 0 to 2.375, divided by 6 and multiplied by 100. A quarterback who completes <strong>410 of 600 passes for 4,500 yards, 32 TDs and 10 INTs</strong> has a <strong>${r.value} passer rating</strong>. The NCAA formula gives the same line a ${run({ scale: 'ncaa' }).value}.`,
  stepsTitle: 'How to calculate NFL passer rating',
  steps: [
    'Completion component: <strong>a = (completions ÷ attempts − 0.3) × 5</strong>.',
    'Yards component: <strong>b = (yards ÷ attempts − 3) × 0.25</strong>.',
    'Touchdown component: <strong>c = (touchdowns ÷ attempts) × 20</strong>.',
    'Interception component: <strong>d = 2.375 − (interceptions ÷ attempts × 25)</strong>.',
    '<strong>Cap each component</strong> at a minimum of 0 and a maximum of 2.375. Forgetting the cap is the usual reason a hand calculation comes out above 158.3 or below 0.',
    'Passer rating = (a + b + c + d) ÷ 6 × 100, rounded to one decimal.'
  ],
  formulaTitle: 'What is the passer rating formula?',
  formula: {
    expr: 'NFL rating = [(a + b + c + d) ÷ 6] × 100, each of a, b, c, d limited to 0–2.375<br>NCAA efficiency = (8.4 × Yds + 330 × TD + 100 × Cmp − 200 × Int) ÷ Att',
    vars: [['a', '(Cmp/Att − 0.3) × 5'], ['b', '(Yds/Att − 3) × 0.25'], ['c', '(TD/Att) × 20'], ['d', '2.375 − (Int/Att × 25)']],
    note: 'The NFL components were scaled from 1960–1970 passing data so that an average passer scores about 1.0 on each (a 66.7 rating) and a record-setting one about 2.0. The 2.375 cap is reached at 77.5% completions, 12.5 yards per attempt, 11.875% TD rate or 0% INT rate.'
  },
  example: `<p>Season line: 600 attempts, 410 completions, 4,500 yards, 32 TD, 10 INT.</p>
<p>a = (410/600 − 0.3) × 5 = (0.6833 − 0.3) × 5 = <strong>1.917</strong><br>
b = (4,500/600 − 3) × 0.25 = (7.5 − 3) × 0.25 = <strong>1.125</strong><br>
c = 32/600 × 20 = <strong>1.067</strong><br>
d = 2.375 − 10/600 × 25 = 2.375 − 0.417 = <strong>1.958</strong></p>
<p>Rating = (1.917 + 1.125 + 1.067 + 1.958) ÷ 6 × 100 = 6.067 ÷ 6 × 100 = <strong>101.1</strong>.</p>
<p>NCAA: (8.4 × 4,500 + 330 × 32 + 100 × 410 − 200 × 10) ÷ 600 = (37,800 + 10,560 + 41,000 − 2,000) ÷ 600 = 87,360 ÷ 600 = <strong>145.6</strong>.</p>`,
  table: {
    title: 'What passer rating do common stat lines produce?',
    intro: 'NFL and NCAA ratings for single-game and season lines, run through the calculator.',
    head: ['Stat line (Cmp/Att, Yds, TD, INT)', 'NFL rating', 'NCAA efficiency'],
    rows: ({ run }) => [
      [16, 20, 250, 3, 0], [22, 30, 310, 3, 0], [25, 35, 280, 2, 0], [23, 35, 250, 2, 1], [20, 32, 220, 1, 1], [18, 30, 190, 1, 2], [15, 30, 150, 0, 2], [0, 10, 0, 0, 0], [2, 10, 15, 0, 2], [410, 600, 4500, 32, 10], [350, 550, 3800, 20, 14]
    ].map(([c, a, y, t, i]) => [c + '/' + a + ', ' + y.toLocaleString('en-US') + ' yds, ' + t + ' TD, ' + i + ' INT', run({ att: a, cmp: c, yds: y, td: t, int: i, scale: 'nfl' }).value, run({ att: a, cmp: c, yds: y, td: t, int: i, scale: 'ncaa' }).value])
  },
  sections: [
    {
      h2: 'What is a perfect passer rating?',
      html: `<p>A perfect NFL passer rating is <strong>158.3</strong> (exactly 158⅓): all four components at the 2.375 cap, so 9.5 ÷ 6 × 100. To get it a quarterback needs, in the same game, at least a 77.5% completion rate, 12.5 yards per attempt, a touchdown on 11.875% of throws and no interceptions. 16 of 20 for 250 yards and 3 TDs does it.</p>
<p>The lowest possible rating is 0.0. Throwing nothing but incompletions gives 39.6, because the interception component still scores the full 2.375; you only reach 0 with a completion rate of 30% or less, 3 yards per attempt or less, no touchdowns and an interception rate of 9.5% or more.</p>
<p>The NCAA formula has no cap, so college efficiency can run from −731.6 (one attempt, completed for a 99-yard loss) to 1,261.6 (one attempt, a 99-yard touchdown).</p>`
    },
    {
      h2: 'What is a good passer rating?',
      html: `<p>For a full NFL season, the league-wide passer rating has been around 88 to 94 in recent years, so:</p>
<ul><li><strong>100+:</strong> excellent, often a top-five season</li><li><strong>90–100:</strong> above average starter</li><li><strong>80–90:</strong> around average to below average</li><li><strong>Under 80:</strong> struggling</li></ul>
<p>Ratings have risen steadily since the formula was adopted in 1973, because modern offenses complete more passes and throw fewer interceptions; the scale was built so an average passer of the 1960s rated about 66.7. Aaron Rodgers' 122.5 in 2011 stood as the single-season record for more than a decade. In college, an NCAA efficiency of about 150 or more is strong for a full season, and the best seasons exceed 190.</p>`
    },
    {
      h2: 'Why is the NCAA passing formula different?',
      html: `<p>The NCAA adopted its own passing efficiency formula in 1979. It uses the same four ingredients but weights them directly instead of capping them: 8.4 points per yard per attempt, 3.3 per touchdown percentage point and −2 per interception percentage point, on top of the raw completion percentage. Because there is no cap, a great college season scores much higher than the 158.3 NFL ceiling, and the two numbers should never be compared.</p>
<p>To rank nationally, an NCAA passer must average at least 15 attempts per game; NFL leaderboards require 14 attempts per team game. High school (NFHS) statistics generally use the NFL formula.</p>`
    },
    {
      h2: 'Is passer rating the same as QBR?',
      html: `<p>No. Passer rating uses only five numbers from the box score and can be computed by anyone. ESPN's Total QBR is a proprietary 0–100 scale built from play-by-play data, including rushing, sacks, fumbles, down and distance and how much each play changed the chance of winning. You can't calculate QBR from a stat line.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate passer rating quickly?', a: 'Compute the four components from completions, yards, touchdowns and interceptions per attempt, cap each between 0 and 2.375, add them, divide by 6 and multiply by 100.' },
    { q: 'What is the highest passer rating possible?', a: 'In the NFL it is 158.3, which needs every component at its 2.375 maximum. College passing efficiency has no maximum.' },
    { q: 'Why is the maximum 158.3?', a: 'Four components capped at 2.375 add up to 9.5, and 9.5 ÷ 6 × 100 = 158.33.' },
    { q: 'Do rushing yards count in passer rating?', a: 'No. Passer rating counts only passing attempts, completions, passing yards, passing touchdowns and interceptions. Sacks, rushing and fumbles are ignored.' },
    { q: 'What passer rating do you get for all incompletions?', a: 'In the NFL, 0 completions with no interceptions gives 39.6, because the interception component is at its maximum. In college it gives 0.0.' },
    { q: 'Do sacks count as pass attempts?', a: 'No. In both the NFL and NCAA, a sack is not a pass attempt (in college it is counted as a rush), so it does not affect passer rating directly.' },
    { q: 'What is the average NFL passer rating?', a: 'The league-wide figure has been roughly 88 to 94 in recent seasons. When the formula was introduced in 1973 it was scaled so an average passer of the 1960s rated about 66.7.' }
  ],
  related: ['era-calculator', 'ops-calculator', 'volleyball-hitting-percentage-calculator', 'percentage-calculator'],
  sources: [
    { name: 'NCAA Football Statisticians\' Manual: pass-efficiency formula', url: 'http://fs.ncaa.org/Docs/stats/Stats_Manuals/Football/2015ez.pdf' },
    { name: 'NFL.com: Player passing statistics', url: 'https://www.nfl.com/stats/player-stats/' },
    { name: 'Pro Football Hall of Fame', url: 'https://www.profootballhof.com/' }
  ]
};
