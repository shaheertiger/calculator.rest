export default {
  slug: 'dps-calculator',
  hub: 'sports',
  name: 'DPS Calculator',
  title: 'DPS Calculator: 45 Damage at 1.6 Attacks/s With Crits = 81 DPS',
  h1: 'DPS Calculator: Damage per Second With Crits, Accuracy and Reloads',
  meta: 'DPS = damage per hit × attacks per second × crit factor × hit rate. 45 damage at 1.6 attacks/s with 25% crits for 2× and 90% accuracy is 81 DPS.',
  keyword: 'how to calculate dps',
  also: ['how to calculate damage per second', 'dps calculator', 'damage per second calculator', 'how to calculate dps with crit', 'time to kill calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'dmg', label: 'Damage per hit', type: 'number', value: 45 },
    { id: 'rate', label: 'Attack speed given as', type: 'select', value: 'aps', options: [['aps', 'Attacks per second'], ['sec', 'Seconds per attack (cooldown)'], ['rpm', 'Rounds per minute (fire rate)']] },
    { id: 'aps', label: 'Attacks per second', type: 'number', value: 1.6, showIf: { rate: ['aps'] } },
    { id: 'sec', label: 'Seconds between attacks', type: 'number', value: 0.625, showIf: { rate: ['sec'] } },
    { id: 'rpm', label: 'Rounds per minute', type: 'number', value: 96, showIf: { rate: ['rpm'] } },
    { id: 'crit', label: 'Critical hit chance', type: 'number', value: 25, suffix: '%' },
    { id: 'mult', label: 'Critical hit damage', type: 'number', value: 2, suffix: '× normal', help: 'A crit that does 150% damage is 1.5×. If your game says "+50% crit damage" on top of a 1.5× base, enter 2.' },
    { id: 'acc', label: 'Hit chance (accuracy)', type: 'number', value: 90, suffix: '%' },
    { id: 'red', label: 'Target damage reduction', type: 'number', value: 0, suffix: '%' },
    { id: 'mag', label: 'Attacks before reload (optional)', type: 'number', value: '', placeholder: 'e.g. 30' },
    { id: 'reload', label: 'Reload time (optional)', type: 'number', value: '', suffix: 's', placeholder: 'e.g. 2.5' },
    { id: 'hp', label: 'Target health (optional)', type: 'number', value: 1000 }
  ],
  compute(v, H) {
    if (!(v.dmg > 0)) return { error: 'Enter the damage per hit.' };
    var aps = v.rate === 'sec' ? (v.sec > 0 ? 1 / v.sec : NaN) : v.rate === 'rpm' ? (v.rpm > 0 ? v.rpm / 60 : NaN) : v.aps;
    if (!(aps > 0)) return { error: 'Enter an attack speed above 0.' };
    var c = v.crit >= 0 && v.crit <= 100 ? v.crit / 100 : 0;
    var m = v.mult >= 1 ? v.mult : 1;
    var acc = v.acc > 0 && v.acc <= 100 ? v.acc / 100 : 1;
    var red = v.red > 0 && v.red < 100 ? v.red / 100 : 0;
    var critF = 1 + c * (m - 1);
    var perHit = v.dmg * critF * (1 - red);
    var burst = perHit * aps * acc;
    var dps = burst;
    var rows = [
      ['Raw DPS (no crits, all hits)', H.num(v.dmg * aps * (1 - red), 2)],
      ['Average damage per hit with crits', H.num(perHit, 2)],
      ['Crit factor', '× ' + H.fix(critF, 3)],
      ['Attacks per second', H.num(aps, 3)],
      ['Damage per minute', H.int(burst * 60)]
    ];
    var sustained = false;
    if (v.mag > 0 && v.reload >= 0) {
      var cycle = v.mag / aps + v.reload;
      dps = perHit * acc * v.mag / cycle;
      sustained = true;
      rows.unshift(['Burst DPS (while firing)', H.num(burst, 1), true]);
      rows.push(['Uptime spent attacking', H.pct(v.mag / aps / cycle * 100, 1)]);
    }
    if (v.hp > 0) {
      rows.push(['Time to kill ' + H.int(v.hp) + ' HP', H.num(v.hp / dps, 2) + ' s', true]);
      rows.push(['Non-crit hits to kill', String(Math.ceil(v.hp / (v.dmg * (1 - red)) - 1e-9))]);
    }
    return {
      value: H.num(dps, 1),
      label: sustained ? 'Sustained DPS (including reloads)' : 'Expected damage per second',
      expr: H.num(v.dmg, 2) + ' × ' + H.num(aps, 3) + '/s × ' + H.fix(critF, 3) + ' crit × ' + H.num(acc * 100, 1) + '%' + (red ? ' × ' + H.num((1 - red) * 100, 1) + '%' : ''),
      rows: rows,
      sub: 'Crits add ' + H.pct((critF - 1) * 100, 1) + ' to damage on average; missed attacks cost ' + H.pct((1 - acc) * 100, 1) + '.'
    };
  },
  quick: ({ r }) => `DPS = damage per hit × attacks per second × crit factor × hit chance, where crit factor = 1 + crit chance × (crit multiplier − 1). A weapon that hits for <strong>45 damage 1.6 times a second</strong> with a 25% chance to crit for double damage and 90% accuracy does 45 × 1.6 × 1.25 × 0.9 = <strong>${r.value} DPS</strong>, killing a 1,000 HP target in about 12.3 seconds.`,
  stepsTitle: 'How to calculate DPS',
  steps: [
    'Get <strong>damage per hit</strong> from the tooltip or a test against a training dummy (total damage ÷ number of hits).',
    'Convert attack speed to <strong>attacks per second</strong>: 1 ÷ seconds per attack, or rounds per minute ÷ 60.',
    'Work out the <strong>crit factor</strong>: 1 + crit chance × (crit multiplier − 1). 25% crits for 2× damage give 1 + 0.25 × 1 = 1.25. Multiplying by the full crit multiplier instead of the extra part is the usual mistake.',
    'Multiply damage × attacks per second × crit factor × hit chance (and × (1 − damage reduction) if the target has armor or resistance).',
    'For weapons with magazines or cooldowns, divide total damage per cycle by the full cycle time, including the reload, to get sustained DPS.'
  ],
  formulaTitle: 'What is the DPS formula?',
  formula: {
    expr: 'DPS = Damage × Attacks per second × [1 + Crit chance × (Crit multiplier − 1)] × Hit chance<br>Sustained DPS = (Damage per attack × Attacks per magazine) ÷ (Magazine ÷ Attacks per second + Reload time)',
    vars: [['Damage', 'average damage of one hit'], ['Attacks per second', '1 ÷ cooldown, or RPM ÷ 60'], ['Crit chance', 'as a decimal: 25% = 0.25'], ['Crit multiplier', 'crit damage relative to a normal hit: 2 = double'], ['Hit chance', 'as a decimal: 90% = 0.9']],
    note: 'This is expected (average) DPS. Over a short fight, luck with crits can move real damage well above or below it.'
  },
  example: `<p>Weapon: 45 damage per hit, 1.6 attacks per second, 25% crit chance, crits deal 2×, 90% accuracy.</p>
<p>Raw DPS = 45 × 1.6 = 72. Crit factor = 1 + 0.25 × (2 − 1) = 1.25, so 72 × 1.25 = 90. Accuracy: 90 × 0.9 = <strong>81 DPS</strong>.</p>
<p>Time to kill a 1,000 HP target = 1,000 ÷ 81 = <strong>12.3 seconds</strong>.</p>
<p>Now give it a 30-round magazine and a 2.5-second reload. Firing 30 attacks takes 30 ÷ 1.6 = 18.75 s, so a full cycle is 21.25 s. Damage per cycle = 30 × 45 × 1.25 × 0.9 = 1,518.75, and sustained DPS = 1,518.75 ÷ 21.25 = <strong>71.5</strong>.</p>`,
  table: {
    title: 'How much do crit chance and crit damage add to DPS?',
    intro: 'DPS for the example weapon (45 damage, 1.6 attacks per second, 90% accuracy) at different crit chances and multipliers, from the calculator.',
    head: ['Crit chance', '1.5× crits', '2× crits', '2.5× crits', '3× crits'],
    rows: ({ run }) => [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map(c => [c + '%', ...[1.5, 2, 2.5, 3].map(m => run({ crit: c, mult: m, mag: '', reload: '', rate: 'aps', aps: 1.6, red: 0 }).value)]),
    note: 'Each crit stat is worth more when the other is high: going from 25% to 50% crit chance adds 16.2 DPS with 2× crits but 32.4 DPS with 3× crits.'
  },
  sections: [
    {
      h2: 'Is attack speed or damage better for DPS?',
      html: `<p>In the basic formula they are worth exactly the same: DPS is a product, so +10% damage and +10% attack speed both add 10%. The tiebreakers come from outside the formula:</p>
<ul><li><strong>Flat damage reduction</strong> (armor that subtracts a fixed number per hit) favors big hits. Against 10 points of flat reduction, 45-damage hits lose 22% while 15-damage hits lose 67%.</li>
<li><strong>On-hit effects</strong> (life steal per hit, procs) favor attack speed.</li>
<li><strong>Breakpoints:</strong> if 4 hits kill instead of 5, a small damage increase can cut time to kill by 20%, while the same attack-speed increase does less.</li>
<li><strong>Burst windows:</strong> when you only get a few seconds of damage, front-loaded damage per hit wins.</li></ul>`
    },
    {
      h2: 'How do you calculate DPS with crit chance and crit damage?',
      html: `<p>Multiply your normal DPS by <strong>1 + crit chance × (crit multiplier − 1)</strong>. With 30% crit chance and 2.5× crit damage the factor is 1 + 0.3 × 1.5 = 1.45, a 45% boost. Watch how your game words crit damage: "150% crit damage" usually means crits do 1.5× (enter 1.5), while "+50% crit damage" usually adds to a base multiplier (1.5 + 0.5 = 2.0). Crit chance above 100% normally does nothing unless the game has "super crits."</p>`
    },
    {
      h2: 'How do you calculate damage per round in D&D 5e?',
      html: `<p>Tabletop games use damage per round (DPR) instead of per second: hit chance × average damage, plus the extra dice from critical hits. In D&D 5e a natural 20 always hits and doubles the damage dice (not the modifier).</p>
<p>Example: a longsword (1d8 + 3, average 7.5) with +5 to hit against AC 15. You hit on a 10 or higher, an 11-in-20 (55%) chance including the natural 20. Crits (5%) add another 1d8 (4.5). DPR = 0.55 × 7.5 + 0.05 × 4.5 = 4.125 + 0.225 = <strong>4.35</strong>. With two attacks per turn it doubles to 8.7. Six-second rounds make that about 1.45 "DPS," but DPR is the number players compare.</p>`
    },
    {
      h2: 'Why is my real DPS lower than the calculator says?',
      html: `<p>Common reasons: reload and cooldown downtime (use the magazine fields), missed shots, enemy armor or resistances, damage falloff at range, overkill on the last hit (damage beyond the target's remaining health is wasted), and time spent moving or out of range. Measure over a longer fight to average out crit luck: with a 25% crit chance, 20 attacks can easily land anywhere from 2 to 8 crits.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate DPS simply?', a: 'Multiply damage per hit by attacks per second. 50 damage at 2 attacks per second is 100 DPS. Then multiply by the crit factor and your hit chance for an expected value.' },
    { q: 'How do I convert attack speed to attacks per second?', a: 'Divide 1 by the seconds per attack (a 0.8-second attack is 1.25 per second) or divide rounds per minute by 60 (600 RPM is 10 per second).' },
    { q: 'How do I calculate time to kill?', a: 'Divide the target\'s health by your DPS. 1,000 HP at 81 DPS takes about 12.3 seconds. For an exact shot count, divide health by damage per hit and round up.' },
    { q: 'Does crit chance or crit damage matter more?', a: 'Balance them. Crit factor is 1 + chance × (multiplier − 1), so each is worth more when the other is high. At 25% chance and 2× damage, +5% crit chance and +0.2× crit damage each lift the crit factor from 1.25 to 1.30, a 4% DPS gain.' },
    { q: 'What is the difference between DPS and burst damage?', a: 'DPS averages damage over time, including reloads and cooldowns. Burst damage is how much you deal in a short window, such as one magazine or one ability rotation.' },
    { q: 'How do you calculate DPS from damage per minute?', a: 'Divide damage per minute by 60. A tool that shows 4,860 damage per minute is doing 81 DPS.' }
  ],
  related: ['kd-ratio-calculator', 'armor-class-calculator', 'passive-perception-calculator', 'percentage-calculator'],
  sources: [
    { name: 'System Reference Document 5.2.1 (CC BY 4.0): attack rolls and critical hits', url: 'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf' },
    { name: 'D&D Beyond: System Reference Document', url: 'https://www.dndbeyond.com/srd' }
  ],
  disclaimer: 'Expected values. Game-specific mechanics (armor formulas, damage falloff, stacking rules) change real results.'
};
