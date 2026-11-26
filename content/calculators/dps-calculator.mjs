export default {
  slug: 'dps-calculator',
  hub: 'science',
  name: 'DPS Calculator',
  h1: 'DPS Calculator (Damage per Second)',
  title: 'DPS Calculator: 45 Damage × 1.6 Hits/s + 25% Crits = 90',
  meta: '45 damage per hit at 1.6 attacks per second with a 25% chance of a 2× crit averages 90 DPS. Work out damage per second and attack speed with steps.',
  keyword: 'dps calculator',
  also: ['damage per second calculator', 'attack speed calculator', 'how to calculate dps', 'how to calculate damage per second'],
  updated: '2026-11-26',
  answer: ({ r }) => `45 damage per hit at 1.6 attacks per second, with a 25% chance to crit for double damage, averages <strong>${r.value}</strong>.`,
  inputs: [
    { id: 'dmg', label: 'Damage per hit', type: 'number', value: 45 },
    { id: 'aps', label: 'Attacks per second', type: 'number', value: 1.6, help: 'Seconds per attack? Use 1 ÷ seconds.' },
    { id: 'crit', label: 'Crit chance', type: 'number', value: 25, suffix: '%' },
    { id: 'mult', label: 'Crit multiplier', type: 'number', value: 2, suffix: '×', help: 'A crit for 150% damage is 1.5×.' }
  ],
  compute(v, H) {
    if (!(v.dmg > 0)) return { error: 'Enter the damage per hit, above 0.' };
    if (!(v.aps > 0)) return { error: 'Enter the attacks per second, above 0.' };
    var c = isFinite(v.crit) ? v.crit : 0, mu = isFinite(v.mult) ? v.mult : 1;
    if (c < 0 || c > 100) return { error: 'Crit chance must be between 0% and 100%.' };
    if (c > 0 && !(mu >= 1)) return { error: 'Enter a crit multiplier of 1 or more (double damage is 2).' };
    var f = function (x) { return H.num(x, 10); };
    var p6 = function (x) { return H.num(x, 6); };
    var base = v.dmg * v.aps, cd = c / 100, cf = 1 + cd * (mu - 1), dps = base * cf;
    var r = H.round(dps, 2), note = Math.abs(r - dps) < 1e-9 ? 'exact, no rounding needed' : 'rounded to 2 decimal places';
    var st = [];
    if (c > 0) {
      st.push('<b>Formula:</b> DPS = damage per hit × attacks per second × crit factor, where crit factor = 1 + crit chance × (crit multiplier − 1)');
      st.push('<b>Substitute:</b> DPS = ' + f(v.dmg) + ' × ' + f(v.aps) + ' × (1 + ' + f(cd) + ' × (' + f(mu) + ' − 1))');
      st.push('<b>Damage per second without crits:</b> ' + f(v.dmg) + ' × ' + f(v.aps) + ' = ' + p6(base));
      st.push('<b>Extra damage on a crit:</b> ' + f(mu) + ' − 1 = ' + f(mu - 1) + ' (a crit adds ' + H.num((mu - 1) * 100, 4) + '% of a normal hit)');
      st.push('<b>Crit factor:</b> 1 + ' + f(cd) + ' × ' + f(mu - 1) + ' = ' + p6(cf) + ' (an average hit is ' + p6(cf) + ' normal hits)');
      st.push('<b>Multiply:</b> ' + p6(base) + ' × ' + p6(cf) + ' = ' + p6(dps));
    } else {
      st.push('<b>Formula:</b> DPS = damage per hit × attacks per second');
      st.push('<b>Substitute:</b> DPS = ' + f(v.dmg) + ' × ' + f(v.aps) + ' (no crits, so the crit factor is 1)');
      st.push('<b>Multiply:</b> ' + f(v.dmg) + ' × ' + f(v.aps) + ' = ' + p6(base));
    }
    st.push('<b>Answer:</b> ' + H.num(r, 2) + ' damage per second on average (' + note + ').');
    return {
      value: H.num(r, 2) + ' DPS',
      label: c > 0 ? 'Expected damage per second' : 'Damage per second',
      rows: [['Without crits', H.num(base, 2) + ' DPS'], ['Average damage per hit', H.num(v.dmg * cf, 2)], ['Seconds per attack', H.num(1 / v.aps, 4) + ' s'], ['Damage per minute', H.num(dps * 60, 2)]],
      steps: st
    };
  },
  facts: {
    formula: 'DPS = D × A × (1 + c × (m − 1))<br>A = 1 ÷ seconds per attack<br>A = rounds per minute ÷ 60',
    vars: [['D', 'damage per hit'], ['A', 'attacks (hits) per second, the attack speed'], ['c', 'crit chance as a decimal: 25% = 0.25'], ['m', 'crit multiplier: double damage = 2']],
    rounding: 'keep every digit through the multiplications and round the final DPS to 2 decimal places.',
    note: 'This is the expected (average) value. Over a short fight, luck with crits can push real damage above or below it. Games also add armor, resistances and buffs, which this general formula leaves out.'
  },
  example: {
    h2: 'Worked example: a slow crossbow or a fast dagger?',
    html: `<p><strong>Problem:</strong> A crossbow hits for 120 damage and needs 2.4 seconds between shots. A dagger hits for 30 damage twice a second. Neither can crit. Which does more damage per second?</p>
<p><strong>1.</strong> Turn the crossbow's delay into an attack speed: 1 ÷ 2.4 s = 0.416667 attacks per second.</p>
<p><strong>2.</strong> Crossbow DPS: 120 × 0.416667 = 50 (the same as 120 ÷ 2.4).</p>
<p><strong>3.</strong> Dagger DPS: 30 × 2 = 60.</p>
<p><strong>Answer:</strong> the dagger wins, 60 DPS to 50 DPS. Sense check: in 12 seconds the crossbow fires 5 times for 600 damage, while the dagger hits 24 times for 720.</p>`
  },
  variants: [
    {
      h2: 'How do you calculate DPS?',
      html: `<p>Multiply the damage of one hit by the number of hits per second. A sword that does 45 damage and swings 1.6 times a second deals 45 × 1.6 = <strong>72 DPS</strong> before crits. If an attack hits more than once, such as a three-pellet shot, multiply by the pellets too: damage per pellet × pellets × attacks per second.</p>`
    },
    {
      h2: 'How do crits change damage per second?',
      html: `<p>Use the expected value: crit factor = 1 + crit chance × (crit multiplier − 1). With a 25% chance of double damage, the factor is 1 + 0.25 × 1 = 1.25, so 72 DPS becomes 72 × 1.25 = <strong>90 DPS</strong>. A 40% chance of 1.5× damage gives 1 + 0.4 × 0.5 = 1.2, or 72 × 1.2 = 86.4 DPS, so more frequent but weaker crits can still lose.</p>`
    },
    {
      h2: 'Attack speed calculator: seconds per attack to attacks per second',
      html: `<p>Divide 1 by the seconds between attacks. A weapon that attacks every 0.625 seconds has an attack speed of 1 ÷ 0.625 = <strong>1.6 attacks per second</strong>. A fire rate in rounds per minute works the same way: 96 RPM ÷ 60 = 1.6 per second. Enter that number as the attack speed.</p>`
    }
  ],
  mistakes: [
    '<strong>Counting only the crit hits.</strong> 72 × 0.25 × 2 = 36 is the damage from crits alone. The other 75% of hits still land: 72 × 0.75 + 72 × 0.25 × 2 = 54 + 36 = 90.',
    '<strong>Multiplying by seconds per attack.</strong> 45 × 0.625 = 28.125 is wrong. A delay must be turned into a rate first: 45 ÷ 0.625 = 72.',
    '<strong>Entering "+50% crit damage" as 0.5.</strong> The multiplier is the whole crit hit compared with a normal one, so +50% is 1.5.',
    '<strong>Ignoring reloads.</strong> 72 DPS while firing drops if you stop to reload. A 30-shot magazine at 1.6 shots per second lasts 18.75 s; add a 2.5 s reload and the sustained rate is 72 × 18.75 ÷ 21.25 = 63.53 DPS.'
  ],
  related: ['average-calculator', 'percentage-calculator', 'speed-calculator', 'time-duration-calculator'],
  faq: [
    { q: 'Is this the DPS formula my game uses?', a: 'It is the core rate math every game shares: damage × attacks per second, with crits as an average. Many games then apply armor, resistances or buffs in their own way, so check how your game handles those.' },
    { q: 'How long does it take to defeat a target?', a: 'Divide its health by your DPS. At 90 DPS, a target with 1,000 health lasts 1,000 ÷ 90 = 11.11 seconds on average.' },
    { q: 'What is the difference between DPS and damage per hit?', a: 'Damage per hit is one attack. DPS is a rate: how much damage builds up each second. A slow, heavy hit can have a lower DPS than a weak, fast one.' },
    { q: 'Does accuracy affect DPS?', a: 'Yes. Multiply by the hit chance as a decimal. At 90% accuracy, 90 DPS becomes 90 × 0.9 = 81 DPS.' }
  ]
};
