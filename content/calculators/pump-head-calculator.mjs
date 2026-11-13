export default {
  slug: 'pump-head-calculator',
  hub: 'electrical',
  name: 'Pump Head Calculator',
  title: 'Pump Head Calculator: 1 psi = 2.31 ft; 136 ft TDH Worked Out',
  h1: 'Pump Head and Total Dynamic Head Calculator (Feet ↔ psi)',
  meta: 'Lifting water 35 ft through 150 ft of 1 in. PVC at 10 GPM and delivering 40 psi takes about 136 ft of total head. Converts head to psi at 2.31 ft per psi.',
  keyword: 'how to calculate head pressure',
  also: ['how do you calculate head pressure', 'how to calculate pump head', 'how to calculate head for a pump', 'how do you calculate pump head', 'how to calculate total dynamic head for a pump', 'how to calculate head loss', 'how to calculate net positive suction head', 'how to calculate pump efficiency'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'tdh', options: [['tdh', 'Total dynamic head for a pump'], ['ft2psi', 'Convert feet of head to psi'], ['psi2ft', 'Convert psi to feet of head']], wide: true },
    { id: 'lift', label: 'Vertical lift (water level to highest outlet)', type: 'number', value: 35, suffix: 'ft', showIf: { mode: ['tdh'] } },
    { id: 'outPsi', label: 'Pressure needed at the outlet', type: 'number', value: 40, suffix: 'psi', help: 'e.g. pressure-switch cut-out, sprinkler or tank pressure; 0 for an open discharge.', showIf: { mode: ['tdh'] } },
    { id: 'gpm', label: 'Flow rate', type: 'number', value: 10, suffix: 'GPM', showIf: { mode: ['tdh'] } },
    { id: 'id', label: 'Pipe inside diameter', type: 'number', value: 1.049, suffix: 'in', help: 'Sch 40: ¾ in. = 0.824, 1 in. = 1.049, 1¼ in. = 1.380, 1½ in. = 1.610, 2 in. = 2.067', showIf: { mode: ['tdh'] } },
    { id: 'len', label: 'Pipe length incl. fitting allowance', type: 'number', value: 150, suffix: 'ft', showIf: { mode: ['tdh'] } },
    { id: 'c', label: 'Pipe material (Hazen-Williams C)', type: 'select', value: '150', options: [['150', 'PVC, PE or PEX (C = 150)'], ['140', 'Copper (C = 140)'], ['120', 'Galvanized or new steel (C = 120)'], ['100', 'Old steel or cast iron (C = 100)']], showIf: { mode: ['tdh'] } },
    { id: 'val', label: 'Value to convert', type: 'number', value: 100, showIf: { mode: ['ft2psi', 'psi2ft'] } },
    { id: 'sg', label: 'Specific gravity of the liquid', type: 'number', value: 1, help: 'Water = 1.0. Head in feet stays the same for any liquid; the pressure it makes changes.', showIf: { mode: ['ft2psi', 'psi2ft', 'tdh'] } }
  ],
  compute(v, H) {
    var sg = v.sg > 0 ? v.sg : 1;
    if (v.mode === 'ft2psi' || v.mode === 'psi2ft') {
      if (!H.isNum(v.val)) return { error: 'Enter a value to convert.' };
      if (v.mode === 'ft2psi') {
        var p = v.val * sg / 2.31;
        return { value: H.num(p, 2) + ' psi', label: 'Pressure from ' + H.num(v.val, 2) + ' ft of head', expr: H.num(v.val, 2) + ' ft × ' + H.num(sg, 3) + ' ÷ 2.31', rows: [['In kPa', H.num(p * 6.894757, 1) + ' kPa'], ['In bar', H.num(p * 0.06894757, 3) + ' bar'], ['In meters of head', H.num(v.val * 0.3048, 2) + ' m']], _psi: p, sub: 'A column of water 2.31 ft tall presses 1 psi on its base.' };
      }
      var ft = v.val * 2.31 / sg;
      return { value: H.num(ft, 1) + ' ft', label: 'Head from ' + H.num(v.val, 2) + ' psi', expr: H.num(v.val, 2) + ' psi × 2.31 ÷ ' + H.num(sg, 3), rows: [['In meters', H.num(ft * 0.3048, 2) + ' m'], ['In kPa', H.num(v.val * 6.894757, 1) + ' kPa']], sub: 'Pump curves are drawn in feet of head, so convert pressure targets to feet before reading one.' };
    }
    if (!(v.gpm > 0)) return { error: 'Enter the flow rate in GPM.' };
    if (!(v.id > 0)) return { error: 'Enter the pipe inside diameter.' };
    var C = Number(v.c) || 150;
    var lift = H.isNum(v.lift) ? v.lift : 0;
    var len = v.len > 0 ? v.len : 0;
    var psi = v.outPsi > 0 ? v.outPsi : 0;
    var hf100 = 0.2083 * Math.pow(100 / C, 1.852) * Math.pow(v.gpm, 1.852) / Math.pow(v.id, 4.8655);
    var fric = hf100 * len / 100;
    var ph = psi * 2.31 / sg;
    var tdh = lift + fric + ph;
    var vel = 0.4085 * v.gpm / (v.id * v.id);
    var whp = v.gpm * tdh * sg / 3960;
    var rows = [
      ['Static lift', H.num(lift, 1) + ' ft'],
      ['Friction loss', H.num(fric, 2) + ' ft (' + H.num(hf100, 2) + ' ft per 100 ft)'],
      ['Pressure head', H.num(ph, 1) + ' ft (' + H.num(psi, 1) + ' psi × 2.31)'],
      ['TDH as pressure', H.num(tdh * sg / 2.31, 1) + ' psi', true],
      ['Pipe velocity', H.num(vel, 2) + ' ft/s'],
      ['Water horsepower', H.num(whp, 3) + ' hp (≈ ' + H.num(whp / 0.5, 2) + ' hp pump at 50% efficiency)']
    ];
    return {
      value: H.num(tdh, 1) + ' ft', label: 'Total dynamic head', expr: H.num(lift, 1) + ' + ' + H.num(fric, 2) + ' + ' + H.num(ph, 1) + ' ft', rows: rows, _fric: hf100, _vel: vel,
      sub: vel > 8 ? 'Velocity is above 8 ft/s: a larger pipe would cut friction head sharply and quiet the system.' : 'Pick a pump whose curve delivers ' + H.num(v.gpm, 1) + ' GPM at ' + H.int(tdh) + ' ft, ideally near its best-efficiency point.'
    };
  },
  quick: ({ r }) => `Head pressure in psi equals feet of water × 0.433 (or feet ÷ 2.31), so 40 psi at the faucet is 92.4 ft of head. A pump lifting water <strong>35 ft</strong> through 150 ft of 1 in. PVC at 10 GPM loses 8.3 ft to friction, so its total dynamic head is 35 + 8.3 + 92.4 = <strong>${r.value}</strong>, about 58.7 psi.`,
  stepsTitle: 'How to calculate total dynamic head for a pump',
  steps: [
    'Measure the vertical lift from the water surface the pump draws from (the pumping level in a well, not the well depth) to the highest discharge point. Horizontal distance does not count here.',
    'Convert the pressure you need at the outlet to feet: psi × 2.31. A 40/60 pressure switch needs 60 psi × 2.31 = 138.6 ft at cut-out.',
    'Work out friction loss in feet for your flow, pipe size and length with the Hazen-Williams formula or a friction-loss table. Add an allowance for elbows, valves and check valves.',
    'Add the three: TDH = lift + friction + pressure head. Then find the pump whose curve delivers your GPM at that head.'
  ],
  formulaTitle: 'What are the head pressure and TDH formulas?',
  formula: {
    expr: 'psi = feet of head × SG ÷ 2.31 · feet = psi × 2.31 ÷ SG<br>TDH = static lift + friction head + pressure head (+ velocity head)<br>h<sub>f</sub> per 100 ft = 0.2083 × (100/C)<sup>1.852</sup> × Q<sup>1.852</sup> ÷ d<sup>4.8655</sup>',
    vars: [['SG', 'specific gravity (water = 1.0)'], ['C', 'Hazen-Williams roughness coefficient of the pipe'], ['Q', 'flow, GPM'], ['d', 'inside diameter, inches']],
    note: 'Velocity head (V² ÷ 2g) is usually under half a foot in household and irrigation systems and is left out. Hazen-Williams applies to water at ordinary temperatures; use Darcy-Weisbach for other liquids or very hot water.'
  },
  example: `<p>An irrigation pump draws from a pond and feeds sprinklers on a hill. The sprinkler heads sit <strong>22 ft</strong> above the pond surface and need <strong>30 psi</strong>. Flow is <strong>20 GPM</strong> through 300 ft of 1½ in. Schedule 40 PVC (1.610 in.), with 30 ft added for fittings.</p>
<p>Friction: 0.2083 × (100/150)<sup>1.852</sup> × 20<sup>1.852</sup> ÷ 1.610<sup>4.8655</sup> = 2.49 ft per 100 ft, × 3.3 = <strong>8.2 ft</strong>. Pressure head: 30 × 2.31 = <strong>69.3 ft</strong>.</p>
<p>TDH = 22 + 8.2 + 69.3 = <strong>99.5 ft</strong>. The pump must deliver 20 GPM at roughly 100 ft of head.</p>`,
  table: {
    title: 'How much head is lost to friction in PVC pipe?',
    intro: 'Friction loss in feet of head per 100 ft of Schedule 40 PVC (C = 150) by flow and pipe size, computed with the Hazen-Williams formula above. An asterisk marks velocities above 8 ft/s; a dash means over 12 ft/s, too fast for that size.',
    head: ['Flow', '¾ in.', '1 in.', '1¼ in.', '1½ in.', '2 in.', '3 in.'],
    rows: ({ run, H }) => [5, 10, 15, 20, 30, 40, 60, 80, 100].map(q => [q + ' GPM', ...[0.824, 1.049, 1.38, 1.61, 2.067, 3.068].map(d => {
      const r = run({ mode: 'tdh', gpm: q, id: d, len: 100, lift: 0, outPsi: 0, c: '150', sg: 1 });
      return r._vel > 12 ? '—' : H.fix(r._fric, 2) + (r._vel > 8 ? '*' : '');
    })]),
    note: 'Divide feet by 2.31 for psi lost per 100 ft. For steel pipe (C = 120), multiply by about 1.5; for old cast iron (C = 100), by about 2.1.'
  },
  sections: [
    {
      h2: 'How do you convert feet of head to psi?',
      html: `<p>Divide feet by 2.31, or multiply by 0.433. A column of water 1 ft tall exerts 0.433 psi at the bottom, so a water tower 100 ft above a house supplies 43.3 psi of static pressure, and 34 ft of water equals roughly one atmosphere (14.7 psi). For liquids other than water, multiply psi by the specific gravity: 100 ft of a liquid with SG 0.85 makes 36.8 psi.</p>
<p>Pump makers use feet because head is independent of the liquid: a pump that lifts water 100 ft will lift a lighter liquid 100 ft too, while the pressure gauge reading changes with density.</p>`
    },
    {
      h2: 'How do you calculate net positive suction head available?',
      html: `<p>NPSH available is the pressure margin at the pump inlet above the liquid's boiling point. In feet: NPSHa = atmospheric head + static suction head − suction friction − vapor pressure head. At sea level atmospheric pressure is about 33.9 ft of water; water at 60°F has a vapor pressure of about 0.26 psia, or 0.6 ft.</p>
<p>A pump 10 ft above its water source with 2 ft of suction-line friction has NPSHa = 33.9 − 10 − 2 − 0.6 = <strong>21.3 ft</strong>. If the pump's required NPSH at that flow is higher, it will cavitate. Altitude, hot water and long, small suction lines all reduce NPSHa, which is why a shallow-well jet pump stops working past about 25 ft of lift.</p>`
    },
    {
      h2: 'How do you calculate pump efficiency?',
      html: `<p>Efficiency = water horsepower ÷ brake horsepower. Water horsepower = GPM × TDH (ft) × SG ÷ 3,960. A pump moving 50 GPM against 120 ft delivers 50 × 120 ÷ 3,960 = 1.52 hp to the water; if its shaft takes 2.5 hp, efficiency is 1.52 ÷ 2.5 = <strong>61%</strong>. Small residential pumps often run 30–60%; large centrifugal pumps at their best-efficiency point can exceed 80%. Wire-to-water efficiency also includes motor losses.</p>`
    }
  ],
  faq: [
    { q: 'How many feet of head is 60 psi?', a: '60 psi equals 60 × 2.31 = 138.6 ft of water head. Most well pumps feeding a 40/60 pressure switch need at least that much head plus lift and friction.' },
    { q: 'How much pressure does 1 foot of water create?', a: '0.433 psi. Every 2.31 ft of water depth or elevation adds 1 psi.' },
    { q: 'Does horizontal pipe length add to pump head?', a: 'Not to static head, which counts only vertical rise. Horizontal pipe adds friction head, which grows with length and rises steeply as flow increases.' },
    { q: 'Is pump head the same as pressure?', a: 'They describe the same energy in different units. Head is in feet of liquid and does not depend on density; pressure in psi does. For water, divide feet by 2.31 to get psi.' },
    { q: 'What is shutoff head?', a: 'Shutoff head is the head a centrifugal pump makes at zero flow, with the discharge closed. It is the top-left point of the pump curve and the most pressure the pump can produce.' },
    { q: 'How much should I add for fittings?', a: 'Each elbow, tee and valve adds the friction of several feet of straight pipe. For simple residential runs, adding 10–20% to the pipe length is a common allowance; use equivalent-length tables for complex piping.' }
  ],
  related: ['gpm-calculator', 'pipe-volume-calculator', 'tank-volume-calculator', 'kw-calculator'],
  sources: [
    { name: 'Hydraulic Institute: pump standards (head, NPSH and efficiency definitions)', url: 'https://www.pumps.org/' },
    { name: 'Engineering ToolBox: Hazen-Williams friction loss equation for water (U.S. units)', url: 'https://www.engineeringtoolbox.com/hazen-williams-water-d_797.html' },
    { name: 'Hazen–Williams equation: C values and limits', url: 'https://en.wikipedia.org/wiki/Hazen%E2%80%93Williams_equation' },
    { name: 'Net positive suction head: NPSHa and NPSHr', url: 'https://en.wikipedia.org/wiki/Net_positive_suction_head' }
  ]
};
