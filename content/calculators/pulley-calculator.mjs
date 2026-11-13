export default {
  slug: 'pulley-calculator',
  hub: 'electrical',
  name: 'Pulley Calculator',
  title: 'Pulley Calculator: 4 Supporting Strands = IMA 4 (50 lb Pull)',
  h1: 'Pulley Calculator: Mechanical Advantage, Efficiency and Belt RPM',
  meta: 'Four rope strands under a 200 lb load give an IMA of 4: a 50 lb ideal pull, or 83% efficiency if you really pull 60 lb. Also does belt pulley rpm and length.',
  keyword: 'how to calculate ima of a pulley',
  also: ['how to calculate efficiency of a pulley system', 'how to calculate pulley ratio', 'how do you calculate tension in a pulley system', 'how to calculate tension in a pulley', 'how to calculate the acceleration of a pulley system', 'pulley rpm calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'System', type: 'select', value: 'tackle', options: [['tackle', 'Rope pulleys (block and tackle)'], ['belt', 'Belt drive (two pulleys)']], wide: true },
    { id: 'load', label: 'Load weight', type: 'number', value: 200, suffix: 'lb', showIf: { mode: ['tackle'] } },
    { id: 'strands', label: 'Rope strands supporting the load', type: 'number', value: 4, help: 'Count the rope segments that hold up the movable block.', showIf: { mode: ['tackle'] } },
    { id: 'effort', label: 'Measured pull (effort)', type: 'number', value: 60, suffix: 'lb', placeholder: 'optional', showIf: { mode: ['tackle'] } },
    { id: 'lift', label: 'Lift height', type: 'number', value: 5, suffix: 'ft', showIf: { mode: ['tackle'] } },
    { id: 'd1', label: 'Driver pulley diameter', type: 'number', value: 4, suffix: 'in', showIf: { mode: ['belt'] } },
    { id: 'd2', label: 'Driven pulley diameter', type: 'number', value: 8, suffix: 'in', showIf: { mode: ['belt'] } },
    { id: 'rpm1', label: 'Driver speed', type: 'number', value: 1750, suffix: 'rpm', showIf: { mode: ['belt'] } },
    { id: 'c', label: 'Center distance', type: 'number', value: 15, suffix: 'in', placeholder: 'optional', showIf: { mode: ['belt'] } }
  ],
  compute(v, H) {
    if (v.mode === 'belt') {
      if (!(v.d1 > 0) || !(v.d2 > 0)) return { error: 'Enter both pulley diameters.' };
      var ratio = v.d2 / v.d1;
      var rows = [];
      if (v.rpm1 > 0) {
        rows.push(['Driven pulley speed', H.num(v.rpm1 / ratio, 1) + ' rpm', true]);
        rows.push(['Belt speed', H.int(Math.PI * v.d1 * v.rpm1 / 12) + ' ft/min']);
      }
      if (v.c > 0) {
        var big = Math.max(v.d1, v.d2), sm = Math.min(v.d1, v.d2);
        if (v.c <= (big + sm) / 2) return { error: 'Center distance must be more than half the sum of the diameters, or the pulleys overlap.' };
        var L = 2 * v.c + Math.PI * (big + sm) / 2 + Math.pow(big - sm, 2) / (4 * v.c);
        var wrap = 180 - 2 * Math.asin((big - sm) / (2 * v.c)) * 180 / Math.PI;
        rows.push(['Belt length (pitch)', H.num(L, 2) + ' in']);
        rows.push(['Wrap on small pulley', H.num(wrap, 1) + '°']);
      }
      return { value: H.num(ratio, 3) + ':1', label: 'Pulley ratio', expr: H.num(v.d2, 2) + ' in ÷ ' + H.num(v.d1, 2) + ' in', rows: rows, _ratio: ratio, sub: ratio >= 1 ? 'Speed drops and torque rises by ' + H.num(ratio, 2) + '×, less 3–5% belt loss.' : 'The driven pulley spins faster than the motor, with proportionally less torque.' };
    }
    if (!(v.strands >= 1)) return { error: 'Enter the number of supporting strands.' };
    var n = Math.round(v.strands);
    var out = { value: String(n), label: 'Ideal mechanical advantage (IMA)', expr: n + ' supporting strand' + (n === 1 ? '' : 's'), _ima: n };
    var r2 = [];
    if (v.load > 0) r2.push(['Ideal pull (no friction)', H.num(v.load / n, 1) + ' lb', true]);
    if (v.lift > 0) r2.push(['Rope you must pull', H.num(v.lift * n, 1) + ' ft for ' + H.num(v.lift, 1) + ' ft of lift']);
    if (v.load > 0 && v.effort > 0) {
      var ama = v.load / v.effort;
      var eff = ama / n * 100;
      r2.push(['Actual mechanical advantage (AMA)', H.fix(ama, 2)]);
      r2.push(['Efficiency', H.pct(eff, 1), true]);
      if (v.lift > 0) r2.push(['Work out ÷ work in', H.int(v.load * v.lift) + ' ÷ ' + H.int(v.effort * v.lift * n) + ' ft·lb']);
      out.sub = eff > 100 ? 'Efficiency above 100% is impossible: re-check the strand count or the measured pull.' : 'Friction in the sheaves and rope stiffness use up ' + H.pct(100 - eff, 1) + ' of the work you put in.';
    } else {
      out.sub = 'Add a measured pull to see the actual mechanical advantage and efficiency.';
    }
    out.rows = r2;
    return out;
  },
  quick: ({ r }) => `The ideal mechanical advantage (IMA) of a pulley system equals the number of rope strands supporting the moving load. Four supporting strands give an IMA of <strong>${r.value}</strong>, so lifting 200 lb ideally takes a 50 lb pull and 20 ft of rope for a 5 ft lift. If the real pull is 60 lb, AMA is 3.33 and efficiency is 83.3%.`,
  stepsTitle: 'How to calculate the IMA of a pulley in 4 steps',
  steps: [
    'Find the movable pulley (the block attached to the load). Only rope segments that hold up this block count.',
    'Count every strand running to or from the movable block, including the rope end if it is tied to that block. Do not count the strand you pull on if it comes down from a fixed pulley; it only changes direction.',
    'That count is the IMA. It is also the distance ratio: rope pulled ÷ height lifted.',
    'For efficiency, measure the actual pull with a spring scale: AMA = load ÷ pull, and efficiency = AMA ÷ IMA × 100%.'
  ],
  formulaTitle: 'What are the pulley formulas?',
  formula: {
    expr: 'IMA = supporting strands = rope pulled ÷ load distance<br>AMA = load ÷ effort · Efficiency = AMA ÷ IMA × 100%<br>Belt drive: ratio = D<sub>driven</sub> ÷ D<sub>driver</sub> · RPM<sub>driven</sub> = RPM<sub>driver</sub> × D<sub>driver</sub> ÷ D<sub>driven</sub>',
    vars: [['IMA', 'ideal mechanical advantage (no friction)'], ['AMA', 'actual mechanical advantage measured with real friction'], ['D', 'pulley pitch diameter'], ['Belt length', '2C + π(D + d)/2 + (D − d)² ÷ 4C, with C = center distance']],
    note: 'The belt length formula is the standard open-belt approximation for two pulleys; V-belts are sold by pitch or outside length, so check the manufacturer\'s convention.'
  },
  example: `<p>A shop hoist uses a double block above and a double block on the hook, with the rope end tied to the lower block: <strong>5 strands</strong> support the hook, so IMA = 5.</p>
<p>Lifting a 450 lb engine ideally takes 450 ÷ 5 = <strong>90 lb</strong> of pull. A spring scale reads 112 lb, so AMA = 450 ÷ 112 = 4.02 and efficiency = 4.02 ÷ 5 = <strong>80.4%</strong>.</p>
<p>To raise the engine 3 ft, you pull 3 × 5 = <strong>15 ft</strong> of rope.</p>`,
  table: {
    title: 'What is the mechanical advantage of common pulley setups?',
    intro: 'IMA by number of supporting strands, with the ideal pull for a 200 lb load and the rope needed per foot of lift. Rig names follow the traditional tackle names, rove to disadvantage.',
    head: ['Supporting strands', 'Typical rig', 'IMA', 'Ideal pull for 200 lb', 'Rope per 1 ft lift'],
    rows: ({ run, H }) => [[1, 'Single fixed pulley'], [2, 'Single movable pulley or gun tackle'], [3, 'Luff tackle'], [4, 'Double tackle'], [5, 'Gyn tackle'], [6, 'Threefold purchase'], [8, 'Four-sheave blocks']].map(([n, name]) => {
      const r = run({ mode: 'tackle', strands: n, load: 200, lift: 1, effort: NaN });
      return [n, name, r.value, H.num(200 / r._ima, 1) + ' lb', n + ' ft'];
    }),
    note: 'Real rigs lose roughly 5–10% per sheave to friction, so a six-strand tackle often has an actual advantage closer to 4 or 5.'
  },
  sections: [
    {
      h2: 'How do you calculate the efficiency of a pulley system?',
      html: `<p>Divide the actual mechanical advantage by the ideal one, or divide the work you get out by the work you put in. Both give the same answer, because the effort moves IMA times as far as the load. In the default example, 200 lb lifted 5 ft is 1,000 ft·lb of output; a 60 lb pull over 20 ft of rope is 1,200 ft·lb of input; 1,000 ÷ 1,200 = 83.3%.</p>
<p>Efficiency falls as you add sheaves, because each one adds bearing and rope-bending friction. That is why very high-ratio tackles are rare: past about six strands, the extra friction and the length of rope you must haul outweigh the gain.</p>`
    },
    {
      h2: 'How do you calculate pulley ratio and rpm for a belt drive?',
      html: `<p>Pulley ratio = driven diameter ÷ driver diameter. A 4 in. motor pulley turning an 8 in. pulley is 2:1, so a 1,750 rpm motor drives the shaft at 875 rpm. To hit a target speed, solve for the size you need: driven diameter = driver diameter × motor rpm ÷ target rpm. For 600 rpm from a 1,750 rpm motor with a 3 in. pulley, the driven pulley should be 3 × 1,750 ÷ 600 = 8.75 in.</p>
<p>Belt speed is π × driver diameter × rpm ÷ 12 in feet per minute; many V-belt drives are designed for roughly 1,000–6,000 ft/min. Keep wrap on the small pulley above about 120° or the belt will slip under load. For tooth-count drives, the <a href="/gear-ratio-calculator">gear ratio calculator</a> works the same way.</p>`
    },
    {
      h2: 'How do you calculate tension and acceleration in a pulley system?',
      html: `<p>In an ideal tackle holding a load still, the tension in the single rope is the same everywhere and equals load ÷ supporting strands: 200 lb on 4 strands puts 50 lb in the rope, and the overhead anchor carries 200 lb plus the pull if it comes down from the top block.</p>
<p>For two masses hanging over one frictionless pulley (an Atwood machine), acceleration a = (m₁ − m₂) g ÷ (m₁ + m₂) and tension T = 2 m₁ m₂ g ÷ (m₁ + m₂). With 5 kg and 3 kg: a = 2 × 9.81 ÷ 8 = <strong>2.45 m/s²</strong> and T = 2 × 5 × 3 × 9.81 ÷ 8 = <strong>36.8 N</strong>.</p>`
    }
  ],
  faq: [
    { q: 'What is the IMA of a single fixed pulley?', a: 'One. A fixed pulley only changes the direction of the force, so you still pull with a force equal to the load, though pulling down is often easier than lifting up.' },
    { q: 'What is the IMA of a single movable pulley?', a: 'Two. The load hangs from two rope segments, each carrying half the weight, so you pull half the force but twice the distance.' },
    { q: 'Why is AMA always less than IMA?', a: 'Friction in the pulley bearings, rope stiffness and the weight of the movable block all add to the effort, so the real advantage is lower than the strand count.' },
    { q: 'Does the strand you pull count toward IMA?', a: 'Only if it comes up from the movable block. A pulled strand coming down from a fixed pulley just changes direction and does not add advantage.' },
    { q: 'Does a bigger driver pulley make the machine faster?', a: 'Yes. A larger pulley on the motor or a smaller pulley on the driven shaft raises driven rpm, and lowers available torque by the same ratio.' },
    { q: 'How do I find the belt length for two pulleys?', a: 'Use L = 2C + π(D + d)/2 + (D − d)² ÷ 4C. For 4 in. and 8 in. pulleys 15 in. apart, L = 30 + 18.85 + 0.27 = 49.1 in.' }
  ],
  related: ['gear-ratio-calculator', 'torque-calculator', 'force-calculator', 'efficiency-calculator'],
  sources: [
    { name: 'OpenStax College Physics 2e: Simple machines and mechanical advantage', url: 'https://openstax.org/details/books/college-physics-2e' },
    { name: 'Block and tackle: rig types and mechanical advantage', url: 'https://en.wikipedia.org/wiki/Block_and_tackle' },
    { name: 'Mechanical advantage: ideal and actual', url: 'https://en.wikipedia.org/wiki/Mechanical_advantage' },
    { name: 'Belt (mechanical): belt drive geometry and speed ratio', url: 'https://en.wikipedia.org/wiki/Belt_(mechanical)' }
  ]
};
