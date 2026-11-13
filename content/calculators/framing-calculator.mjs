export default {
  slug: 'framing-calculator',
  hub: 'construction',
  name: 'Framing Nails & Stud Calculator',
  title: 'Framing Nail Calculator: 100 ft of Wall = 17 lb of 16d Nails',
  h1: 'Framing Calculator: Studs, Plates and How Many Nails to Order',
  meta: '100 ft of 8-ft wall at 16 in on center takes 106 studs, 21 plates and 777 16d common nails (17 lb) per the IRC schedule. Sinkers and gun nails too.',
  keyword: 'how many framing nails should i order calculator',
  also: ['how many 2x4 do i need calculator', 'framing calculator', 'stud calculator', 'how many studs do i need', 'how many 16d nails per pound', 'wall framing calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'len', label: 'Total wall length', type: 'number', value: 100, suffix: 'ft', help: 'Add up every wall you are framing.' },
    { id: 'height', label: 'Wall height', type: 'select', value: '8', options: [['8', '8 ft (92-5/8 in precut studs)'], ['9', '9 ft (104-5/8 in studs)'], ['10', '10 ft (116-5/8 in studs)']] },
    { id: 'spacing', label: 'Stud spacing', type: 'select', value: '16', options: [['16', '16 in on center'], ['24', '24 in on center']] },
    { id: 'corners', label: 'Outside corners', type: 'number', value: 4 },
    { id: 'tees', label: 'Wall intersections (T)', type: 'number', value: 2 },
    { id: 'openings', label: 'Doors and windows', type: 'number', value: 4 },
    { id: 'openW', label: 'Average opening width', type: 'number', value: 3, suffix: 'ft' },
    { id: 'nail', label: 'Nail type', type: 'select', value: '16c', options: [['16c', '16d common, 3½ × 0.162 in (≈48/lb)'], ['16s', '16d sinker, 3¼ × 0.148 in (≈60/lb)'], ['131', '3 in × 0.131 in gun nails (≈80/lb)']] },
    { id: 'plateLen', label: 'Plate stock length', type: 'select', value: '16', options: [['8', '8 ft'], ['10', '10 ft'], ['12', '12 ft'], ['14', '14 ft'], ['16', '16 ft']] },
    { id: 'floor', label: 'Nail bottom plate to a wood floor', type: 'checkbox', value: true, help: 'Untick for a slab (anchor bolts instead).' },
    { id: 'waste', label: 'Waste / overage', type: 'number', value: 10, suffix: '%' }
  ],
  data: {
    nails: {
      '16c': { name: '16d common nails', perLb: 48, end: 2, topSp: 16, splice: 8, lap: 2, botSp: 16, studSp: 24, hdrSp: 16 },
      '16s': { name: '16d sinker nails', perLb: 60, end: 3, topSp: 12, splice: 12, lap: 3, botSp: 12, studSp: 16, hdrSp: 12 },
      '131': { name: '3 in × 0.131 in gun nails', perLb: 80, end: 3, topSp: 12, splice: 12, lap: 3, botSp: 12, studSp: 16, hdrSp: 12 }
    },
    studLen: { '8': 92.625, '9': 104.625, '10': 116.625 }
  },
  compute(v, H, D) {
    if (!(v.len > 0)) return { error: 'Enter the total length of wall to frame.' };
    var N = D.nails[v.nail] || D.nails['16c'];
    var sp = Number(v.spacing) || 16, plate = Number(v.plateLen) || 16;
    var studLen = D.studLen[v.height] || 92.625;
    var c = v.corners > 0 ? Math.floor(v.corners) : 0, t = v.tees > 0 ? Math.floor(v.tees) : 0, o = v.openings > 0 ? Math.floor(v.openings) : 0;
    var ow = v.openW > 0 ? v.openW : 3;
    var w = v.waste >= 0 ? v.waste / 100 : 0;
    var studs = Math.ceil(v.len * 12 / sp - 1e-9) + 1 + 2 * c + 2 * t + 2 * o;
    var studsBuy = Math.ceil(studs * (1 + w) - 1e-9);
    var plateLf = 3 * v.len;
    var plates = Math.ceil(plateLf * (1 + w) / plate - 1e-9);
    var nEnd = studs * 2 * N.end;
    var nTop = Math.ceil(v.len * 12 / N.topSp - 1e-9) + Math.floor(v.len / plate) * N.splice + (c + t) * N.lap;
    var nBot = v.floor ? Math.ceil(v.len * 12 / N.botSp - 1e-9) : 0;
    var nStud = (2 * c + 2 * t + 2 * o) * Math.ceil(studLen / N.studSp - 1e-9);
    var nHdr = o * 2 * (Math.ceil((ow * 12 + 3) / N.hdrSp - 1e-9) + 1);
    var total = nEnd + nTop + nBot + nStud + nHdr;
    var buy = Math.ceil(total * (1 + w) - 1e-9);
    var lb = buy / N.perLb;
    var frac = studLen === 92.625 ? '92-5/8' : studLen === 104.625 ? '104-5/8' : '116-5/8';
    return {
      value: H.int(buy) + ' nails',
      label: N.name + ' to order (' + H.num(lb, 1) + ' lb)',
      expr: H.int(total) + ' nails by IRC schedule × ' + H.fix(1 + w, 2),
      rows: [
        ['Weight to order', Math.ceil(lb - 1e-9) + ' lb' + (v.nail === '131' ? ' (sold by count; ≈' + H.num(buy / 1000, 1) + 'k)' : ''), true],
        ['Studs to order', studsBuy + ' × ' + frac + ' in', true],
        ['Plates (1 bottom + 2 top)', plates + ' × ' + plate + ' ft (' + H.int(plateLf) + ' lin ft)'],
        ['Stud-to-plate end nails', H.int(nEnd) + ' (' + N.end + ' per stud end)'],
        ['Double top plate, splices, laps', H.int(nTop)],
        ['Bottom plate to floor', H.int(nBot)],
        ['Built-up studs and headers', H.int(nStud + nHdr)],
        ['Studs before waste', String(studs)]
      ],
      sub: 'Counts follow IRC Table R602.3(1) for walls outside braced wall panels. Sheathing, blocking and toe-nailed headers are extra.'
    };
  },
  quick: ({ r }) => `To order framing nails, count the IRC nailing for every stud end, plate and header. For 100 ft of 8-ft wall at 16 in on center with 4 corners, 2 intersections and 4 openings, you need 106 studs, 21 sixteen-foot plates and <strong>${r.value}</strong> of 16d common size (3½ × 0.162 in) with 10% overage: about <strong>17 lb</strong> at 48 nails per pound.`,
  stepsTitle: 'How to work out how many framing nails to order',
  steps: [
    'Add up the length of all walls and count corners, T-intersections and door or window openings.',
    'Count studs: one every 16 in (or 24 in) plus one to close each wall, then 2 extra per corner, 2 per intersection and 2 per opening for the jack studs. King studs and cripples come from the common studs an opening displaces.',
    'Apply the nailing schedule: 2 sixteen-penny commons into each stud end (4 per stud), the top plates face-nailed every 16 in, 8 nails at each top-plate splice, and the bottom plate nailed every 16 in into the floor framing.',
    'Switching to sinkers or 0.131-in gun nails? The IRC requires <strong>more</strong> of the thinner nails (3 per stud end instead of 2, 12-in spacing instead of 16). This is the step most estimates miss.',
    'Add 10% for bent, dropped and misfired nails, then divide by nails per pound and round up to whole pounds or boxes.'
  ],
  formulaTitle: 'What formula does the nail estimate use?',
  formula: {
    expr: 'Studs = ⌈L × 12 ÷ s⌉ + 1 + 2·corners + 2·tees + 2·openings<br>Nails = 4·studs + L·12 ÷ 16 (top plate) + 8·splices + 2·laps + L·12 ÷ 16 (bottom plate) + built-up + headers<br>Pounds = Nails × 1.10 ÷ nails per lb',
    vars: [['L', 'total wall length, ft'], ['s', 'stud spacing, in'], ['splices', 'top-plate end joints, about one per plate length'], ['nails per lb', '48 for 16d common, 60 for 16d sinker, about 80 for 3 × 0.131 in']],
    note: 'Nail counts are for 16d common. The calculator switches to the IRC\'s alternate counts (3 per stud end, 12 per splice, 12-in plate spacing, 16-in stud-to-stud spacing) for sinkers and gun nails. Nails per pound are manufacturer averages (MiTek lists 48 for 16d common and 60 for 16d sinker); the gun-nail figure is estimated from steel weight, since those are sold by count.'
  },
  example: `<p>A builder is framing 100 ft of 8-ft walls at 16 in on center with 4 corners, 2 interior wall intersections and 4 openings 3 ft wide, on a wood subfloor, using hand-driven 16d commons.</p>
<p><strong>Studs:</strong> 1,200 ÷ 16 = 75, + 1 = 76, + 8 (corners) + 4 (intersections) + 8 (openings) = 96, × 1.10 = <strong>106 studs</strong>.</p>
<p><strong>Plates:</strong> 3 × 100 = 300 lin ft, × 1.10 ÷ 16 = <strong>21 plates</strong>.</p>
<p><strong>Nails:</strong> 384 stud ends + 75 top plate + 48 splices + 12 laps + 75 bottom plate + 80 built-up studs + 32 headers = 706, × 1.10 = <strong>777 nails</strong> ÷ 48 per lb = 16.2, so order <strong>17 lb</strong>. With 0.131-in gun nails the same walls need about 1,130 nails.</p>`,
  table: {
    title: 'How many nails and studs for 100 ft of wall by nail type?',
    intro: 'The same 100 ft of 8-ft wall (4 corners, 2 intersections, 4 openings, 10% overage), worked out by the calculator for each nail and stud spacing.',
    head: ['Nail', 'Stud spacing', 'Studs', 'Nails', 'Weight'],
    rows: ({ run }) => [['16c', '16d common'], ['16s', '16d sinker'], ['131', '3 × 0.131 in gun']].flatMap(([k, n]) => ['16', '24'].map(s => { const r = run({ nail: k, spacing: s }); return [n, s + ' in o.c.', r.rows[1][1].split(' ')[0], r.value.replace(' nails', ''), r.rows[0][1].replace(/ \(.*/, '')]; })),
    note: 'Sinkers and gun nails weigh less each but the code calls for more of them, so the pounds don\'t drop as much as the per-pound counts suggest.'
  },
  sections: [
    {
      h2: 'How many 16d nails are in a pound?',
      html: `<p>About <strong>48 sixteen-penny common nails</strong> (3½ in × 0.162 in) weigh a pound; published counts range from 47 to 49 depending on head size and coating. A <strong>16d sinker</strong> (3¼ in × 0.148 in, vinyl-coated, with a countersunk head) runs about 60 per pound, and a 16d box nail (3½ × 0.135 in) about 70. Hot-dip galvanized nails are heavier, so you get a few less per pound.</p>
<ul><li>5-lb box of 16d commons: about 240 nails.</li><li>50-lb box: about 2,400 nails, enough for roughly 300 ft of wall framed as in the example.</li></ul>
<p>Collated gun nails are sold by count (boxes of a few thousand), so match the count in the results to the box label.</p>`
    },
    {
      h2: 'What does the building code say about nailing wall framing?',
      html: `<p>IRC Table R602.3(1), the fastening schedule most U.S. jurisdictions adopt, sets the minimum nailing for stud walls. For the common cases:</p>
<div class="twrap"><table><thead><tr><th>Connection</th><th>16d common (3½ × 0.162)</th><th>16d box or 3 × 0.131 in</th></tr></thead><tbody>
<tr><td>Top or bottom plate to stud, end nail</td><td>2 per end</td><td>3 per end</td></tr>
<tr><td>Top plate to top plate</td><td>16 in o.c.</td><td>12 in o.c.</td></tr>
<tr><td>Double top plate splice</td><td>8 nails</td><td>12 nails</td></tr>
<tr><td>Top plate laps at corners and intersections</td><td>2 nails</td><td>3 nails</td></tr>
<tr><td>Bottom plate to joist or blocking</td><td>16 in o.c.</td><td>12 in o.c.</td></tr>
<tr><td>Stud to stud (not at braced wall panels)</td><td>24 in o.c.</td><td>16 in o.c.</td></tr>
<tr><td>Built-up header, each edge</td><td>16 in o.c.</td><td>12 in o.c. (16d box)</td></tr>
</tbody></table></div>
<p>Braced wall panels need tighter nailing, and wall sheathing has its own schedule. Your local building department has the final word.</p>`
    },
    {
      h2: 'How many 2x4s do I need to frame a wall?',
      html: `<p>A quick rule is <strong>one stud per linear foot of wall</strong> at 16 in on center; that covers corners, intersections and openings. The detailed count above gives 96 studs for 100 ft before waste, close to the rule. At 24 in on center, plan on about three studs for every four feet.</p>
<p>Plates are separate: three runs of lumber (one bottom plate and a doubled top plate) for every foot of wall, so 100 ft of wall needs 300 lin ft of plate stock. Longer plates mean fewer top-plate splices, and the IRC requires splices in the two top plates to be offset at least 24 in.</p>
<p>Buy precut studs to match the ceiling: 92-5/8 in studs plus three 1½-in plates frame a 97-1/8-in wall, which leaves room for 1/2-in drywall on an 8-ft ceiling.</p>`
    },
    {
      h2: 'Should I use common nails, sinkers or a nail gun?',
      html: `<p><strong>16d commons</strong> are the reference nail in the code tables and the strongest per nail, but they are heavy to drive by hand and can split dry lumber. <strong>Sinkers</strong> are slightly thinner and shorter with a coating that eases driving, which is why many framers prefer them for hand nailing; count them like box nails. <strong>Pneumatic nails</strong> in 3 or 3¼ in × 0.131 in are the norm on job sites. All three are code-compliant when used in the right quantity, which is why the calculator changes the count, not just the weight, when you switch types.</p>`
    }
  ],
  faq: [
    { q: 'How many nails do I need per stud?', a: 'Four 16d common nails per stud for the plates: two end-nailed through the bottom plate and two through the top plate. With 16d box, sinker or 0.131-in gun nails, the IRC calls for three per end, or six per stud.' },
    { q: 'How many pounds of nails to frame a house?', a: 'It depends on wall length more than floor area. As a check, 100 ft of 8-ft wall takes about 17 lb of 16d commons; a typical house with 300–400 ft of walls needs 50–70 lb for wall framing alone, plus nails for floors, roof and sheathing.' },
    { q: 'How many 16d nails are in a 50 lb box?', a: 'About 2,400 16d common nails (48 per lb), or roughly 3,000 sinkers at 60 per lb.' },
    { q: 'What size nail is 16d?', a: 'A 16d (sixteen-penny) nail is 3½ in long. The common version has a 0.162-in shank; box nails are 0.135 in. A 16d sinker is shorter, at 3¼ in × 0.148 in.' },
    { q: 'Can I use 10d nails instead of 16d for framing?', a: 'For some connections, yes: the IRC lists 10d box (3 × 0.128 in) or 3 × 0.131 in nails as alternates for top plates and stud-to-stud nailing, but you need more of them, such as 12-in spacing instead of 16 in. They are too short to end-nail through a 1½-in plate with full penetration in most cases; use 16d there.' },
    { q: 'How many studs do I need for a 12-foot wall?', a: 'At 16 in on center, a 12-ft wall needs 10 studs (9 spaces plus one to close the end), plus 2 for each corner it forms and 2 per window or door, then 10% for culls.' },
  ],
  related: ['board-foot-calculator', 'drywall-calculator', 'linear-feet-calculator', 'roofing-calculator', 'stair-calculator'],
  sources: [
    { name: 'ICC: 2021 International Residential Code, Section R602 Wood wall framing, Table R602.3(1) Fastening schedule', url: 'https://codes.iccsafe.org/content/IRC2021P2' },
    { name: 'MiTek: Nail dimensions and nails per pound (16d common, 16d sinker)', url: 'https://mitek-us.com/wp-content/uploads/files/product/us/tables/Nails.pdf' },
    { name: 'American Wood Council: Wood frame construction codes and standards', url: 'https://awc.org/' }
  ]
};
