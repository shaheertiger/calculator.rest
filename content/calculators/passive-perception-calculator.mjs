export default {
  slug: 'passive-perception-calculator',
  hub: 'sports',
  name: 'Passive Perception Calculator',
  title: 'Passive Perception Calculator 5e: 10 + Wis + Prof (+5 Adv)',
  h1: 'Passive Perception Calculator for D&D 5e Characters',
  meta: 'Passive Perception = 10 + your Wisdom (Perception) bonus, +5 with advantage, −5 with disadvantage. A level 5 character with 14 Wisdom and proficiency has 15.',
  keyword: 'how to calculate passive perception 5e',
  also: ['passive perception calculator', 'passive perception 5e', 'how to calculate passive perception', 'passive wisdom perception', 'passive perception with advantage'],
  updated: '2026-11-13',
  inputs: [
    { id: 'wis', label: 'Wisdom score', type: 'number', value: 14 },
    { id: 'level', label: 'Character level', type: 'number', value: 5, help: 'Sets your proficiency bonus: +2 at levels 1–4, +3 at 5–8, +4 at 9–12, +5 at 13–16, +6 at 17–20.' },
    { id: 'prof', label: 'Perception training', type: 'select', value: 'prof', options: [['none', 'Not proficient'], ['half', 'Jack of All Trades (half proficiency)'], ['prof', 'Proficient'], ['exp', 'Expertise (double proficiency)']] },
    { id: 'adv', label: 'Advantage or disadvantage', type: 'select', value: 'none', options: [['none', 'Neither'], ['adv', 'Advantage (+5)'], ['dis', 'Disadvantage (−5), e.g. dim light for sight']] },
    { id: 'bonus', label: 'Other bonuses or penalties', type: 'number', value: 0, help: 'Flat modifiers that apply to all your Perception checks, such as a magic item.' }
  ],
  compute(v, H) {
    if (!(v.wis >= 1 && v.wis <= 30)) return { error: 'Enter a Wisdom score from 1 to 30.' };
    if (!(v.level >= 1 && v.level <= 20)) return { error: 'Enter a character level from 1 to 20.' };
    var lvl = Math.floor(v.level);
    var pb = 2 + Math.floor((lvl - 1) / 4);
    var mod = Math.floor((Math.floor(v.wis) - 10) / 2);
    var p = v.prof === 'exp' ? pb * 2 : v.prof === 'prof' ? pb : v.prof === 'half' ? Math.floor(pb / 2) : 0;
    var other = v.bonus ? Math.round(v.bonus) : 0;
    var check = mod + p + other;
    var advN = v.adv === 'adv' ? 5 : v.adv === 'dis' ? -5 : 0;
    var score = 10 + check + advN;
    function sg(x) { return (x < 0 ? '−' : '+') + Math.abs(x); }
    var rows = [
      ['Wisdom modifier', sg(mod)],
      ['Proficiency bonus at level ' + lvl, sg(pb)],
      ['Proficiency added', sg(p)],
      ['Wisdom (Perception) check bonus', sg(check), true]
    ];
    if (advN) rows.push([v.adv === 'adv' ? 'Advantage' : 'Disadvantage', sg(advN)]);
    rows.push(['Passive score in dim light (sight)', String(10 + check + (v.adv === 'adv' ? 0 : v.adv === 'dis' ? -5 : -5))]);
    return {
      value: String(score),
      label: 'Passive Wisdom (Perception)',
      expr: '10 ' + sg(mod) + ' Wis ' + sg(p) + ' prof' + (other ? ' ' + sg(other) + ' other' : '') + (advN ? ' ' + sg(advN) + (advN > 0 ? ' adv' : ' dis') : ''),
      rows: rows,
      sub: 'A hidden creature needs a Dexterity (Stealth) total above ' + score + ' to stay unnoticed without you searching. ' + (score >= 18 ? 'Very perceptive: few low-level ambushes will surprise you.' : score >= 14 ? 'A solid party lookout.' : score >= 11 ? 'About average for an adventurer.' : 'Easy to sneak past.')
    };
  },
  quick: ({ r }) => `Passive Perception is 10 + your Wisdom modifier + your proficiency bonus if you are proficient in Perception. A level 5 character with 14 Wisdom (+2) and Perception proficiency (+3) has a passive Perception of <strong>${r.value}</strong>. Advantage adds 5 (20) and disadvantage, such as relying on sight in dim light, subtracts 5 (10).`,
  stepsTitle: 'How to calculate passive Perception in 5e',
  steps: [
    'Find your <strong>Wisdom modifier</strong>: (Wisdom score − 10) ÷ 2, rounded down. 14 Wisdom is +2; 9 Wisdom is −1.',
    'If you are proficient in Perception, add your <strong>proficiency bonus</strong> (+2 at level 1, rising by 1 every four levels). With Expertise, add it twice; with the Bard\'s Jack of All Trades and no proficiency, add half, rounded down.',
    'Add any other bonus that applies to <strong>every</strong> Perception check you make, such as a magic item. One-off boosts that need a die roll (like the guidance cantrip) don\'t count.',
    'Add 10. That is your passive Wisdom (Perception) score.',
    'If you have <strong>advantage</strong> on the check, add 5; with <strong>disadvantage</strong>, subtract 5. Forgetting the −5 in dim light is the most common mistake at the table.'
  ],
  formulaTitle: 'What is the passive Perception formula?',
  formula: {
    expr: 'Passive Perception = 10 + Wisdom modifier + proficiency bonus (if proficient) + other bonuses<br>+5 with advantage · −5 with disadvantage',
    vars: [['10', 'the average roll of a d20, rounded'], ['Wisdom modifier', 'floor((Wisdom − 10) ÷ 2)'], ['proficiency bonus', '+2 to +6 by level; ×2 with Expertise']],
    note: 'Both the 2014 rules (SRD 5.1) and the 2024 rules (SRD 5.2) use the same formula: 10 plus your Wisdom (Perception) check bonus, with +5 for advantage and −5 for disadvantage.'
  },
  example: `<p>The SRD's own example: a 1st-level character with 15 Wisdom (+2) and proficiency in Perception (+2) has a passive Perception of 10 + 2 + 2 = <strong>14</strong>. With advantage on Perception checks it becomes <strong>19</strong>.</p>
<p>Now a level 9 rogue with 16 Wisdom (+3) and Expertise in Perception (proficiency +4, doubled to +8): 10 + 3 + 8 = <strong>21</strong>. Walking through a dim cellar, relying on sight, she has disadvantage, so 21 − 5 = <strong>16</strong>.</p>
<p>Monsters work the same way. A goblin's stat block lists passive Perception 9 (Wisdom 8, no proficiency: 10 − 1); an adult red dragon lists Perception +13 and passive Perception 23.</p>`,
  table: {
    title: 'What is my passive Perception by Wisdom score and level?',
    intro: 'Passive scores from the calculator with no advantage, disadvantage or other bonuses.',
    head: ['Wisdom', 'Not proficient', 'Proficient, lvl 1–4', 'Proficient, lvl 5–8', 'Proficient, lvl 9–12', 'Proficient, lvl 13–16', 'Expertise, lvl 5–8'],
    rows: ({ run }) => [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(w => [String(w), run({ wis: w, level: 1, prof: 'none', adv: 'none', bonus: 0 }).value, run({ wis: w, level: 1, prof: 'prof', adv: 'none', bonus: 0 }).value, run({ wis: w, level: 5, prof: 'prof', adv: 'none', bonus: 0 }).value, run({ wis: w, level: 9, prof: 'prof', adv: 'none', bonus: 0 }).value, run({ wis: w, level: 13, prof: 'prof', adv: 'none', bonus: 0 }).value, run({ wis: w, level: 5, prof: 'exp', adv: 'none', bonus: 0 }).value]),
    note: 'Add 5 to any cell for advantage or subtract 5 for disadvantage.'
  },
  sections: [
    {
      h2: 'How does advantage or disadvantage change passive Perception?',
      html: `<p>Advantage adds a flat <strong>+5</strong> and disadvantage a flat <strong>−5</strong>, which roughly matches what rolling two d20s and keeping the better one is worth when you need a middling roll. If you have both, they cancel and you use the normal score.</p>
<p>Common sources in the SRD rules:</p>
<ul><li><strong>Dim light</strong> (a lightly obscured area): disadvantage on Perception checks that rely on sight, so −5 to passive Perception for spotting things. Darkvision lets you treat darkness as dim light, so the −5 still applies in the dark.</li>
<li><strong>Fast travel pace:</strong> −5 to passive Perception in the 2014 rules; disadvantage on Perception checks in the 2024 rules. Same result.</li>
<li><strong>Slow travel pace</strong> (2024 rules): advantage on Perception checks, so +5.</li>
<li>Any feature or condition that grants advantage or imposes disadvantage on Wisdom (Perception) checks.</li></ul>`
    },
    {
      h2: 'When does the DM use passive Perception?',
      html: `<p>The DM uses your passive score whenever you aren't actively searching: to see whether you notice a hidden creature, a trap, a secret door or an ambush as you travel. When a creature hides, the DM compares its Dexterity (Stealth) check against the passive Perception of everyone who might spot it.</p>
<p>Passive Perception also keeps the DM from tipping players off. Asking for a Perception roll tells everyone something is there; checking passive scores in secret doesn't.</p>
<p>If you say you're looking for something, you make an active Wisdom (Perception) check instead, rolling a d20. That roll can come out higher or lower than your passive score.</p>`
    },
    {
      h2: 'Is passive Perception the same as passive Investigation or Insight?',
      html: `<p>The same formula works for any skill: 10 + the check bonus, ±5 for advantage or disadvantage. Passive Investigation uses Intelligence and your Investigation proficiency; passive Insight uses Wisdom and Insight proficiency. Many character sheets list all three because DMs use them to decide whether you spot a clue or sense a lie without rolling.</p>
<p>Perception is about noticing things with your senses. Investigation is about deducing from clues you've found, so a high passive Perception might reveal the hidden trapdoor, while Investigation tells you how its mechanism works.</p>`
    },
    {
      h2: 'What is a good passive Perception?',
      html: `<p>Many low-level SRD monsters have a passive Perception around 9 to 13 (the goblin is 9), while big threats such as adult dragons reach the 20s. For a party, at least one character with passive Perception <strong>15 or higher</strong> catches most ambushes and traps at low levels. By level 9 a Wisdom-focused character with proficiency usually has 17–19, and a rogue or bard with Expertise can pass 20. The highest normal score without magic is 10 + 5 (Wisdom 20) + 12 (Expertise at level 17+) = <strong>27</strong>, or 32 with advantage.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate passive Perception?', a: 'Add 10 to your Wisdom (Perception) bonus: your Wisdom modifier plus your proficiency bonus if you are proficient. A +5 Perception bonus means a passive Perception of 15.' },
    { q: 'Do you add 5 for advantage on passive Perception?', a: 'Yes. With advantage on Wisdom (Perception) checks, add 5 to your passive score. With disadvantage, subtract 5.' },
    { q: 'What is the passive Perception of a character with 10 Wisdom?', a: 'It is 10 if you are not proficient in Perception. With proficiency at levels 1–4 it is 12.' },
    { q: 'Does Expertise apply to passive Perception?', a: 'Yes. Expertise doubles your proficiency bonus on Perception checks, and passive Perception includes everything that applies to the check, so it doubles there too.' },
    { q: 'Does Jack of All Trades add to passive Perception?', a: 'By the rules text, yes, if you aren\'t proficient: a passive check is a kind of ability check, and Jack of All Trades adds half your proficiency bonus (rounded down) to ability checks that don\'t already include it. Some tables rule otherwise, so ask your DM.' },
    { q: 'Does guidance or Bardic Inspiration add to passive Perception?', a: 'No. Bonuses that are rolled for a single check, such as the d4 from guidance or a Bardic Inspiration die, apply only to active rolls.' },
    { q: 'Does passive Perception work while asleep?', a: 'The rules don\'t define ordinary sleep in detail. Many DMs let a sleeping character notice loud noises with passive Perception at disadvantage (−5). A creature put to sleep by magic is unconscious, which makes it unaware of its surroundings.' }
  ],
  related: ['armor-class-calculator', 'dps-calculator', 'kd-ratio-calculator', 'average-calculator'],
  sources: [
    { name: 'System Reference Document 5.1 (CC BY 4.0), Wizards of the Coast', url: 'https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf' },
    { name: 'System Reference Document 5.2.1 (CC BY 4.0), Wizards of the Coast', url: 'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf' },
    { name: 'D&D Beyond: System Reference Document', url: 'https://www.dndbeyond.com/srd' }
  ],
  disclaimer: 'This page includes material from the System Reference Document 5.1 and 5.2.1 by Wizards of the Coast LLC, licensed under CC BY 4.0. calculator.rest is not affiliated with Wizards of the Coast.'
};
