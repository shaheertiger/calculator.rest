export default {
  slug: 'armor-class-calculator',
  hub: 'sports',
  name: 'Armor Class Calculator',
  title: 'Armor Class Calculator 5e: Breastplate + Shield = AC 18',
  h1: 'D&D 5e Armor Class Calculator: Armor, Dex Cap, Shield and Cover',
  meta: 'Work out AC in D&D 5e from armor, Dexterity, shield, magic bonuses and cover. Breastplate (14 + Dex, max 2) with 16 Dex and a shield is AC 18.',
  keyword: 'how to calculate armor class',
  also: ['how to calculate ac in dnd 5e', 'how is ac calculated 5e', 'how to calculate armor class dnd 5e', 'how is armor class calculated', 'armor class calculator', 'ac calculator 5e'],
  updated: '2026-11-13',
  inputs: [
    { id: 'armor', label: 'Armor worn', type: 'select', value: 'breastplate', options: [['none', 'No armor'], ['padded', 'Padded (light, 11 + Dex)'], ['leather', 'Leather (light, 11 + Dex)'], ['studded', 'Studded leather (light, 12 + Dex)'], ['hide', 'Hide (medium, 12 + Dex max 2)'], ['chainshirt', 'Chain shirt (medium, 13 + Dex max 2)'], ['scale', 'Scale mail (medium, 14 + Dex max 2)'], ['breastplate', 'Breastplate (medium, 14 + Dex max 2)'], ['halfplate', 'Half plate (medium, 15 + Dex max 2)'], ['ring', 'Ring mail (heavy, 14)'], ['chainmail', 'Chain mail (heavy, 16)'], ['splint', 'Splint (heavy, 17)'], ['plate', 'Plate (heavy, 18)']] },
    { id: 'unarmored', label: 'Unarmored AC formula', type: 'select', value: 'base', showIf: { armor: ['none'] }, options: [['base', 'Standard: 10 + Dex'], ['barb', 'Barbarian Unarmored Defense: 10 + Dex + Con'], ['monk', 'Monk Unarmored Defense: 10 + Dex + Wis'], ['mage', 'Mage Armor spell: 13 + Dex'], ['drac14', 'Draconic Resilience (2014): 13 + Dex'], ['drac24', 'Draconic Resilience (2024): 10 + Dex + Cha']] },
    { id: 'dex', label: 'Dexterity score', type: 'number', value: 16 },
    { id: 'con', label: 'Constitution score', type: 'number', value: 16, showIf: { armor: ['none'], unarmored: ['barb'] } },
    { id: 'wis', label: 'Wisdom score', type: 'number', value: 16, showIf: { armor: ['none'], unarmored: ['monk'] } },
    { id: 'cha', label: 'Charisma score', type: 'number', value: 16, showIf: { armor: ['none'], unarmored: ['drac24'] } },
    { id: 'str', label: 'Strength score', type: 'number', value: 15, showIf: { armor: ['chainmail', 'splint', 'plate'] } },
    { id: 'shield', label: 'Carrying a shield (+2)', type: 'checkbox', value: true },
    { id: 'magic', label: 'Magic armor or shield bonus', type: 'number', value: 0, help: '+1, +2 or +3 armor and shields add their bonus.' },
    { id: 'defense', label: 'Defense fighting style (+1 in armor)', type: 'checkbox', value: false },
    { id: 'other', label: 'Other AC bonuses', type: 'number', value: 0, help: 'e.g. Ring or Cloak of Protection +1, shield of faith +2, shield spell +5.' },
    { id: 'cover', label: 'Cover', type: 'select', value: 'none', options: [['none', 'No cover'], ['half', 'Half cover (+2)'], ['three', 'Three-quarters cover (+5)']] }
  ],
  data: {
    armor: {
      padded: { n: 'Padded', base: 11, cap: 99, cat: 'light', stealth: 1, str: 0 },
      leather: { n: 'Leather', base: 11, cap: 99, cat: 'light', stealth: 0, str: 0 },
      studded: { n: 'Studded leather', base: 12, cap: 99, cat: 'light', stealth: 0, str: 0 },
      hide: { n: 'Hide', base: 12, cap: 2, cat: 'medium', stealth: 0, str: 0 },
      chainshirt: { n: 'Chain shirt', base: 13, cap: 2, cat: 'medium', stealth: 0, str: 0 },
      scale: { n: 'Scale mail', base: 14, cap: 2, cat: 'medium', stealth: 1, str: 0 },
      breastplate: { n: 'Breastplate', base: 14, cap: 2, cat: 'medium', stealth: 0, str: 0 },
      halfplate: { n: 'Half plate', base: 15, cap: 2, cat: 'medium', stealth: 1, str: 0 },
      ring: { n: 'Ring mail', base: 14, cap: 0, cat: 'heavy', stealth: 1, str: 0 },
      chainmail: { n: 'Chain mail', base: 16, cap: 0, cat: 'heavy', stealth: 1, str: 13 },
      splint: { n: 'Splint', base: 17, cap: 0, cat: 'heavy', stealth: 1, str: 15 },
      plate: { n: 'Plate', base: 18, cap: 0, cat: 'heavy', stealth: 1, str: 15 }
    }
  },
  compute(v, H, D) {
    function mod(x) { return Math.floor((Math.floor(x) - 10) / 2); }
    function ok(x) { return x >= 1 && x <= 30; }
    function sg(x) { return (x < 0 ? '−' : '+') + Math.abs(x); }
    if (!ok(v.dex)) return { error: 'Enter a Dexterity score from 1 to 30.' };
    var dm = mod(v.dex), rows = [], notes = [], base, desc;
    var A = v.armor !== 'none' ? D.armor[v.armor] : null;
    var shield = !!v.shield;
    if (A) {
      var used = A.cat === 'heavy' ? 0 : Math.min(dm, A.cap);
      base = A.base + used;
      desc = A.n + ' ' + A.base + (A.cat === 'heavy' ? '' : ' ' + sg(used) + ' Dex');
      rows.push(['Armor base (' + A.cat + ')', String(A.base)]);
      rows.push(['Dexterity bonus used', A.cat === 'heavy' ? 'none (heavy armor)' : sg(used) + (used < dm ? ' (capped from ' + sg(dm) + ')' : '')]);
    } else {
      var u = v.unarmored;
      if (u === 'monk' && shield) { notes.push('A Monk loses Unarmored Defense while wielding a shield, so the standard 10 + Dex applies.'); u = 'base'; }
      if (u === 'barb') { if (!ok(v.con)) return { error: 'Enter a Constitution score from 1 to 30.' }; base = 10 + dm + mod(v.con); desc = '10 ' + sg(dm) + ' Dex ' + sg(mod(v.con)) + ' Con'; }
      else if (u === 'monk') { if (!ok(v.wis)) return { error: 'Enter a Wisdom score from 1 to 30.' }; base = 10 + dm + mod(v.wis); desc = '10 ' + sg(dm) + ' Dex ' + sg(mod(v.wis)) + ' Wis'; }
      else if (u === 'drac24') { if (!ok(v.cha)) return { error: 'Enter a Charisma score from 1 to 30.' }; base = 10 + dm + mod(v.cha); desc = '10 ' + sg(dm) + ' Dex ' + sg(mod(v.cha)) + ' Cha'; }
      else if (u === 'mage' || u === 'drac14') { base = 13 + dm; desc = '13 ' + sg(dm) + ' Dex'; }
      else { base = 10 + dm; desc = '10 ' + sg(dm) + ' Dex'; }
      rows.push(['Unarmored base', desc]);
    }
    var ac = base, parts = [desc];
    if (shield) { ac += 2; parts.push('+2 shield'); rows.push(['Shield', '+2']); }
    var mg = v.magic ? Math.round(v.magic) : 0;
    if (mg) { ac += mg; parts.push(sg(mg) + ' magic'); rows.push(['Magic armor/shield', sg(mg)]); }
    if (v.defense && A) { ac += 1; parts.push('+1 Defense'); rows.push(['Defense fighting style', '+1']); }
    if (v.defense && !A) notes.push('Defense only works while wearing armor.');
    var ot = v.other ? Math.round(v.other) : 0;
    if (ot) { ac += ot; parts.push(sg(ot) + ' other'); rows.push(['Other bonuses', sg(ot)]); }
    var acNoCover = ac;
    var cv = v.cover === 'half' ? 2 : v.cover === 'three' ? 5 : 0;
    if (cv) { ac += cv; parts.push('+' + cv + ' cover'); rows.push([v.cover === 'half' ? 'Half cover' : 'Three-quarters cover', '+' + cv]); rows.push(['AC out of cover', String(acNoCover)]); }
    if (A) {
      rows.push(['Stealth', A.stealth ? 'Disadvantage on Dexterity (Stealth) checks' : 'No penalty']);
      if (A.str) {
        var sOk = v.str >= A.str;
        rows.push(['Strength requirement', 'Str ' + A.str + (v.str > 0 ? (sOk ? ': met' : ': not met, speed −10 ft') : '')]);
      }
    }
    var hit = Math.max(5, Math.min(95, (21 - (ac - 5)) * 5));
    return {
      value: 'AC ' + ac,
      label: 'Armor Class',
      expr: parts.join(' '),
      rows: rows,
      sub: (notes.length ? notes.join(' ') + ' ' : '') + 'An attacker with +5 to hit needs a ' + Math.max(2, Math.min(20, ac - 5)) + ' or higher on the d20, about a ' + hit + '% chance.'
    };
  },
  quick: ({ r }) => `Armor Class in D&D 5e = your armor's base AC + your Dexterity modifier (light armor: full Dex; medium: Dex up to +2; heavy: no Dex) + 2 for a shield + magic bonuses. A fighter in a <strong>breastplate</strong> (14) with 16 Dexterity (+3, capped at +2) and a shield has <strong>${r.value}</strong>. With no armor, AC is 10 + Dex modifier.`,
  stepsTitle: 'How to calculate Armor Class in 5e',
  steps: [
    'Find your <strong>Dexterity modifier</strong>: (Dexterity − 10) ÷ 2, rounded down. 16 Dex is +3; 8 Dex is −1.',
    'Start from your armor\'s base AC: light armor adds your full Dex modifier, <strong>medium armor adds at most +2</strong> (a negative modifier still counts in full), and heavy armor ignores Dex entirely. Adding the full +3 or +4 to medium armor is the most common mistake.',
    'No armor? Use 10 + Dex, or one alternative formula you qualify for (Barbarian, Monk, Mage Armor, Draconic Resilience). You can only use one base calculation at a time.',
    'Add <strong>+2 for a shield</strong>, then any magic bonus (+1 armor, +1 shield), the Defense fighting style (+1 while armored) and items such as a Ring of Protection.',
    'In combat, add cover: +2 for half cover, +5 for three-quarters cover.'
  ],
  formulaTitle: 'What is the Armor Class formula?',
  formula: {
    expr: 'AC = Armor base + Dex modifier (capped by armor type) + Shield + Magic + Other<br>Unarmored AC = 10 + Dex modifier',
    vars: [['Light armor', 'base + full Dex modifier'], ['Medium armor', 'base + Dex modifier (max +2)'], ['Heavy armor', 'base only'], ['Shield', '+2 (plus any magic bonus)'], ['Dex modifier', 'floor((Dexterity − 10) ÷ 2)']],
    note: 'Armor values come from the armor table in the System Reference Document. The numbers are the same in the 2014 (SRD 5.1) and 2024 (SRD 5.2) rules.'
  },
  example: `<p>A level 1 fighter wears a breastplate, carries a shield and has 16 Dexterity (+3).</p>
<p>Breastplate is 14 + Dex modifier, max 2: 14 + 2 = 16 (one point of Dex is wasted). Shield: +2. <strong>AC 18</strong>.</p>
<p>Taking the Defense fighting style adds +1 for <strong>AC 19</strong>. Later, swapping to plate (18, no Dex) with a shield and Defense gives 18 + 2 + 1 = <strong>AC 21</strong>, but she needs 15 Strength to avoid losing 10 feet of speed, and she has disadvantage on Stealth checks.</p>
<p>A Barbarian with 14 Dex (+2) and 16 Con (+3) and no armor has 10 + 2 + 3 = 15, or <strong>AC 17</strong> with a shield.</p>`,
  table: {
    title: 'What AC does each armor give at each Dexterity score?',
    intro: 'Armor Class without a shield, worked out by the calculator. Add 2 for a shield.',
    head: ['Armor', 'Dex 10 (+0)', 'Dex 12 (+1)', 'Dex 14 (+2)', 'Dex 16 (+3)', 'Dex 18 (+4)', 'Dex 20 (+5)'],
    rows: ({ run, D }) => [['none', 'No armor'], ...Object.keys(D.armor).map(k => [k, D.armor[k].n])].map(([k, n]) => [n, ...[10, 12, 14, 16, 18, 20].map(d => run({ armor: k, unarmored: 'base', dex: d, shield: false, magic: 0, defense: false, other: 0, cover: 'none' }).value.replace('AC ', ''))]),
    note: 'Medium armor stops improving at Dex 14; heavy armor ignores Dex. Studded leather ties a breastplate at Dex 18 and overtakes it at Dex 20.'
  },
  sections: [
    {
      h2: 'How does the Dexterity cap on medium armor work?',
      html: `<p>Medium armor (hide, chain shirt, scale mail, breastplate, half plate) adds your Dexterity modifier only up to <strong>+2</strong>. Anything above that is wasted, so a character with 18 Dex in half plate has 15 + 2 = 17, the same as a character with 14 Dex. A negative modifier is not capped: 8 Dex (−1) in a breastplate gives 13.</p>
<p>That cap is why high-Dex characters prefer light armor. Studded leather (12 + Dex) trails a breastplate by one point at 16 Dex (15 vs 16), ties it at 18 Dex (16 vs 16) and beats it at 20 Dex (17 vs 16), while costing 45 gp instead of 400. Heavy armor ignores Dex completely, good or bad, which suits Strength-based fighters and paladins with low Dexterity.</p>`
    },
    {
      h2: 'How do you calculate AC without armor?',
      html: `<p>The default is <strong>10 + Dexterity modifier</strong>. Several SRD features replace that base:</p>
<ul>
<li><strong>Barbarian Unarmored Defense:</strong> 10 + Dex + Con, and you can still use a shield.</li>
<li><strong>Monk Unarmored Defense:</strong> 10 + Dex + Wis, but only with no armor and <em>no shield</em>.</li>
<li><strong>Mage Armor</strong> (1st-level spell, 8 hours): 13 + Dex on a creature not wearing armor.</li>
<li><strong>Draconic Resilience</strong> (Draconic sorcerer): 13 + Dex in the 2014 rules; 10 + Dex + Cha in the 2024 rules.</li>
</ul>
<p>These don't stack with each other or with armor. The 2024 rules spell it out: if you have more than one way to calculate AC, you use only one at a time. A Monk/Barbarian picks 10 + Dex + Con <em>or</em> 10 + Dex + Wis. Shields and flat bonuses (magic items, cover) do add on top.</p>`
    },
    {
      h2: 'Do shields, spells and magic items stack with armor?',
      html: `<p>Yes, flat bonuses from different sources add together: a shield (+2), +1 armor, a +1 shield, a Ring of Protection (+1) and the Defense fighting style (+1) can all apply at once. The <strong>shield</strong> spell adds +5 until the start of your next turn, and <strong>shield of faith</strong> adds +2 while you concentrate.</p>
<p>Two things don't add: a second shield (you can only benefit from one), and features that set your AC to a minimum, such as <strong>barkskin</strong> (AC can't be less than 16 in the 2014 rules; AC 17 if lower in 2024). Those set a floor rather than adding.</p>
<p>Cover sits on top of everything during an attack: <strong>half cover +2</strong> (a low wall, another creature), <strong>three-quarters cover +5</strong> (an arrow slit), and total cover means you can't be targeted directly.</p>`
    },
    {
      h2: 'What happens if you wear armor you are not proficient with?',
      html: `<p>You still get its AC, but you have disadvantage on every ability check, saving throw and attack roll that involves Strength or Dexterity, and you can't cast spells. A wizard in plate is a poor trade. Heavy armor also has a Strength requirement (chain mail Str 13, splint and plate Str 15): below it, your speed drops by 10 feet. Padded, scale mail, half plate and all heavy armor give disadvantage on Stealth checks.</p>`
    }
  ],
  faq: [
    { q: 'What is the base Armor Class in 5e?', a: 'With no armor it is 10 + your Dexterity modifier. A character with 14 Dexterity has AC 12.' },
    { q: 'What is the highest AC in D&D 5e?', a: 'Without magic, plate (18) + shield (2) + Defense (1) = 21. Magic items and spells push it higher: +3 plate, a +3 shield and a Ring of Protection with the shield spell reach the high 20s or more.' },
    { q: 'Does medium armor add your full Dex?', a: 'No. Medium armor adds your Dexterity modifier up to a maximum of +2. Light armor adds the full modifier, and heavy armor adds none.' },
    { q: 'How much AC does a shield give?', a: 'A shield gives +2 AC, plus its magic bonus if it has one (a +1 shield gives +3 in total).' },
    { q: 'Is AC 16 good at level 1?', a: 'Yes. AC 16 is solid for a level 1 character; most low-level monsters hit it a little under half the time. Fighters and paladins in chain mail with a shield start at 18.' },
    { q: 'Can a Monk use a shield?', a: 'A Monk can carry one, but loses Unarmored Defense while doing so, falling back to 10 + Dex + 2 for the shield.' },
    { q: 'What AC does an adult red dragon have?', a: 'The SRD gives an adult red dragon AC 19, so a character with +7 to hit needs a 12 or higher.' }
  ],
  related: ['passive-perception-calculator', 'dps-calculator', 'kd-ratio-calculator', 'average-calculator'],
  sources: [
    { name: 'System Reference Document 5.1 (CC BY 4.0): Armor table, Unarmored Defense, cover', url: 'https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf' },
    { name: 'System Reference Document 5.2.1 (CC BY 4.0), Wizards of the Coast', url: 'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf' },
    { name: 'D&D Beyond: System Reference Document', url: 'https://www.dndbeyond.com/srd' }
  ],
  disclaimer: 'This page includes material from the System Reference Document 5.1 and 5.2.1 by Wizards of the Coast LLC, licensed under CC BY 4.0. calculator.rest is not affiliated with Wizards of the Coast.'
};
