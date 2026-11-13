export default {
  slug: 'kd-ratio-calculator',
  hub: 'sports',
  name: 'K/D Ratio Calculator',
  title: 'K/D Ratio Calculator: 1,250 Kills, 1,000 Deaths = 1.25 K/D',
  h1: 'K/D Ratio Calculator With KDA and Kills Needed for a Target',
  meta: 'K/D = kills ÷ deaths. 1,250 kills and 1,000 deaths is a 1.25 K/D; reaching 1.50 takes 250 kills without dying, or 1,000 more kills at a 2.0 pace.',
  keyword: 'how to calculate kd ratio',
  also: ['how is kda calculated', 'kd ratio calculator', 'kda calculator', 'kill death ratio calculator', 'how to calculate kda', 'how many kills to raise kd'],
  updated: '2026-11-13',
  inputs: [
    { id: 'k', label: 'Kills', type: 'number', value: 1250 },
    { id: 'd', label: 'Deaths', type: 'number', value: 1000 },
    { id: 'a', label: 'Assists (for KDA)', type: 'number', value: 400 },
    { id: 'kda', label: 'KDA formula', type: 'select', value: 'full', options: [['full', '(Kills + Assists) ÷ Deaths'], ['half', '(Kills + ½ Assists) ÷ Deaths']] },
    { id: 'target', label: 'Target K/D', type: 'number', value: 1.5 },
    { id: 'pace', label: 'Your K/D in games from now on', type: 'number', value: 2.0, help: 'Used to estimate how long it takes to reach the target if you keep dying at a normal rate.' }
  ],
  compute(v, H) {
    if (!(v.k >= 0) || !(v.d >= 0)) return { error: 'Enter kills and deaths (0 or more).' };
    var k = v.k, d = v.d, a = v.a >= 0 ? v.a : 0;
    var aw = v.kda === 'half' ? a / 2 : a;
    var kd = d > 0 ? k / d : k;
    var kda = d > 0 ? (k + aw) / d : k + aw;
    var rows = [
      ['KDA ' + (v.kda === 'half' ? '(K + ½A) ÷ D' : '(K + A) ÷ D'), H.fix(kda, 2), true],
      ['Kills per death, as a share', H.pct(k + d > 0 ? k / (k + d) * 100 : 0, 1) + ' of fights won'],
      ['Kills minus deaths (+/−)', (k - d >= 0 ? '+' : '−') + H.int(Math.abs(k - d))]
    ];
    var sub;
    var t = v.target;
    if (t > 0) {
      if (d === 0) { sub = 'No deaths yet: your K/D equals your kills until you die once.'; }
      else if (kd >= t) { sub = 'You are already at or above a ' + H.fix(t, 2) + ' K/D. You could take ' + H.int(Math.floor(k / t - d + 1e-9)) + ' more deaths without a kill and stay there.'; }
      else {
        var need = Math.ceil(t * d - k - 1e-9);
        rows.push(['Kills needed with no more deaths', H.int(need), true]);
        if (v.pace > t) {
          var dd = (t * d - k) / (v.pace - t);
          rows.push(['At a ' + H.fix(v.pace, 2) + ' K/D from now on', H.int(Math.ceil(v.pace * dd - 1e-9)) + ' kills, ' + H.int(Math.ceil(dd - 1e-9)) + ' deaths']);
          sub = 'Playing at a ' + H.fix(v.pace, 2) + ' K/D, you reach ' + H.fix(t, 2) + ' after about ' + H.int(Math.ceil(dd - 1e-9)) + ' more deaths.';
        } else if (v.pace > 0) {
          sub = 'At a ' + H.fix(v.pace, 2) + ' K/D you can never reach ' + H.fix(t, 2) + ': your future games must beat the target ratio to pull the total up to it.';
        } else sub = 'Every kill without a death raises your K/D by ' + H.fix(1 / d, 4) + '.';
      }
    }
    return {
      value: H.fix(kd, 2),
      label: 'K/D ratio',
      expr: H.int(k) + ' kills ÷ ' + H.int(d) + ' deaths',
      rows: rows,
      sub: sub || (kd >= 1 ? 'Above 1.0: you get more kills than you give up.' : 'Below 1.0: you die more often than you get kills.')
    };
  },
  quick: ({ r }) => `K/D ratio is kills divided by deaths. A player with <strong>1,250 kills and 1,000 deaths</strong> has a <strong>${r.value} K/D</strong>. KDA adds assists: (1,250 + 400) ÷ 1,000 = 1.65. To reach a 1.50 K/D that player needs 250 kills without dying, or about 1,000 more kills (and 500 deaths) playing at a 2.0 K/D.`,
  stepsTitle: 'How to calculate K/D ratio and KDA',
  steps: [
    'Find your total <strong>kills</strong> and <strong>deaths</strong> on your profile or combat record. Use the same mode and time period for both.',
    'Divide kills by deaths. 1,250 ÷ 1,000 = 1.25. If you have zero deaths, games usually show your kill count as the K/D.',
    'For <strong>KDA</strong>, add assists to kills before dividing: (kills + assists) ÷ deaths. Some shooters count an assist as half a kill; pick the formula your game uses.',
    'To find the kills needed for a target, multiply the target by your deaths and subtract your kills: 1.5 × 1,000 − 1,250 = 250. That assumes you don\'t die again, the part most quick estimates leave out.'
  ],
  formulaTitle: 'What is the K/D formula?',
  formula: {
    expr: 'K/D = Kills ÷ Deaths<br>KDA = (Kills + Assists) ÷ Deaths<br>Kills needed (no deaths) = Target × Deaths − Kills<br>Deaths until target at pace p = (Target × Deaths − Kills) ÷ (p − Target)',
    vars: [['Target', 'the K/D you want'], ['p', 'the K/D you expect to play at from now on (must beat the target)']]
  },
  example: `<p>A player has 1,250 kills, 1,000 deaths and 400 assists.</p>
<p>K/D = 1,250 ÷ 1,000 = <strong>1.25</strong>. KDA = (1,250 + 400) ÷ 1,000 = <strong>1.65</strong>.</p>
<p>Target 1.50: with no deaths they need 1.5 × 1,000 − 1,250 = <strong>250 kills</strong>.</p>
<p>Realistically they will die. Playing at a 2.0 K/D, the gap closes by 0.5 kills per death: (1,500 − 1,250) ÷ (2.0 − 1.5) = 500 deaths, during which they get 2.0 × 500 = <strong>1,000 kills</strong>. Check: (1,250 + 1,000) ÷ (1,000 + 500) = 2,250 ÷ 1,500 = 1.50.</p>`,
  table: {
    title: 'How many kills do you need to raise your K/D?',
    intro: 'Kills needed without dying for a player with 1,000 deaths, by current and target K/D, from the calculator.',
    head: ['Current K/D (1,000 deaths)', 'To reach 1.00', 'To reach 1.50', 'To reach 2.00', 'To reach 3.00'],
    rows: ({ run, H }) => [0.5, 0.7, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0].map(c => [H.fix(c, 2), ...[1, 1.5, 2, 3].map(t => { const r = run({ k: Math.round(c * 1000), d: 1000, target: t, pace: '' }); const row = r.rows.find(x => /no more deaths/.test(x[0])); return row ? row[1] : '—'; })]),
    note: '— means you are already at or above that K/D. Every kill without a death raises a 1,000-death K/D by only 0.001, which is why career K/D moves so slowly.'
  },
  sections: [
    {
      h2: 'What is a good K/D ratio?',
      html: `<p>A <strong>1.0</strong> K/D means you get one kill for every death, which is roughly the midpoint in most team shooters: every kill is someone else's death, so the average across all players is close to 1.0 (a little lower once self-inflicted and environmental deaths are counted). Rough guide for public matchmaking:</p>
<ul><li><strong>Under 0.8:</strong> learning the game</li><li><strong>0.8–1.2:</strong> average</li><li><strong>1.2–2.0:</strong> above average to very good</li><li><strong>2.0+:</strong> excellent, often top few percent in casual playlists</li></ul>
<p>Skill-based matchmaking pulls most players toward 1.0, so a stable 1.1 against tough lobbies can mean more than a 2.0 against new players. Objective modes also push K/D down for players who spend time capturing points instead of hunting kills.</p>`
    },
    {
      h2: 'How is KDA calculated?',
      html: `<p>In MOBAs such as League of Legends and in many hero shooters, KDA = <strong>(kills + assists) ÷ deaths</strong>. A 7/3/11 game (7 kills, 3 deaths, 11 assists) is (7 + 11) ÷ 3 = <strong>6.0 KDA</strong>. With zero deaths, the game usually shows "Perfect" or simply kills + assists.</p>
<p>Some games show KDA as three separate numbers (K/D/A) instead of a ratio, and a few weight assists as half a kill: (7 + 5.5) ÷ 3 = 4.17. Select the half-assist option above to match those.</p>`
    },
    {
      h2: 'Why does K/D rise so slowly?',
      html: `<p>Because each new game is a tiny share of your career totals. With 1,000 deaths, a perfect 10-kill, 0-death game moves you from 1.25 to 1.26. To move a career K/D noticeably you have to play many games <em>above</em> your target ratio: from 1.25 to 1.50 at a 2.0 pace takes 500 more deaths, about as many games as it took to die the first 500 times.</p>
<p>Recent form is a better measure of improvement. Track your last 20 or 50 matches separately: if they average 1.6, your career number will creep toward 1.6 over time but never pass it.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate K/D ratio?', a: 'Divide kills by deaths. 30 kills and 20 deaths is a 1.5 K/D.' },
    { q: 'What does a 2.0 K/D mean?', a: 'You get two kills for every death. Over 100 deaths you would have 200 kills.' },
    { q: 'What is my K/D if I have 0 deaths?', a: 'Dividing by zero is undefined, so most games show your kill count as the K/D (10 kills, 0 deaths = 10.0) or label it perfect.' },
    { q: 'How many kills do I need to get a 1.0 K/D?', a: 'You need as many kills as deaths. With 800 kills and 1,000 deaths you need 200 kills without dying, or more if you keep dying along the way.' },
    { q: 'Is K/D or KDA better?', a: 'K/D shows how often you win a fight that ends with a kill. KDA also rewards assists, so it better reflects support players and team fights. MOBAs use KDA; most shooters show both.' },
    { q: 'Does K/D include suicides?', a: 'Usually yes for deaths: falling off the map or a self-kill adds a death without giving anyone a kill. Games differ, so check how yours counts them.' },
    { q: 'What is win/loss ratio?', a: 'It is wins divided by losses, calculated exactly like K/D. A 60–40 record is a 1.5 W/L ratio, or a 60% win rate.' }
  ],
  related: ['dps-calculator', 'percentage-calculator', 'ratio-calculator', 'average-calculator'],
  sources: [
    { name: 'Wikipedia: Kill–death ratio', url: 'https://en.wikipedia.org/wiki/Kill%E2%80%93death_ratio' },
    { name: 'Wikipedia: Glossary of video game terms', url: 'https://en.wikipedia.org/wiki/Glossary_of_video_game_terms' }
  ]
};
