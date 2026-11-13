export default {
  slug: 'pipe-volume-calculator',
  hub: 'construction',
  name: 'Pipe Volume Calculator',
  title: 'Pipe Volume Calculator: 50 ft of 1/2-in PEX Holds 0.48 Gallons',
  h1: 'Pipe Volume Calculator: Water per Foot, Total Gallons and Purge Time',
  meta: '50 ft of 1/2-in PEX holds 0.48 gallons (1.82 L): 19 seconds of flow at a 1.5 gal/min faucet. Gallons per foot for PEX, copper, Schedule 40 or any pipe ID.',
  keyword: 'how to calculate volume of a pipe',
  also: ['how to calculate volume of pipeline', 'how to calculate volume in pipe', 'how do you calculate the volume of a pipe', 'pipe volume calculator', 'gallons per foot of pipe', 'how much water is in a pipe'],
  updated: '2026-11-13',
  inputs: [
    { id: 'pipe', label: 'Pipe', type: 'select', value: 'pex12', wide: true, options: [['pex38', '3/8 in PEX (SDR 9), ID 0.360 in'], ['pex12', '1/2 in PEX (SDR 9), ID 0.485 in'], ['pex34', '3/4 in PEX (SDR 9), ID 0.681 in'], ['pex1', '1 in PEX (SDR 9), ID 0.875 in'], ['cul12', '1/2 in copper Type L, ID 0.545 in'], ['cul34', '3/4 in copper Type L, ID 0.785 in'], ['cul1', '1 in copper Type L, ID 1.025 in'], ['cul112', '1-1/2 in copper Type L, ID 1.505 in'], ['cul2', '2 in copper Type L, ID 1.985 in'], ['s4012', '1/2 in Schedule 40 steel/PVC, ID 0.622 in'], ['s4034', '3/4 in Schedule 40, ID 0.824 in'], ['s401', '1 in Schedule 40, ID 1.049 in'], ['s402', '2 in Schedule 40, ID 2.067 in'], ['s403', '3 in Schedule 40, ID 3.068 in'], ['s404', '4 in Schedule 40, ID 4.026 in'], ['s406', '6 in Schedule 40, ID 6.065 in'], ['custom', 'Other: enter inside diameter']] },
    { id: 'id', label: 'Inside diameter', type: 'number', value: 12, suffix: 'in', showIf: { pipe: ['custom'] } },
    { id: 'len', label: 'Pipe length', type: 'number', value: 50, suffix: 'ft' },
    { id: 'gpm', label: 'Flow rate (for purge time)', type: 'number', value: 1.5, suffix: 'gal/min', help: 'A WaterSense bathroom faucet is 1.5; kitchen faucets are up to 2.2.' }
  ],
  data: {
    ids: { pex38: 0.360, pex12: 0.485, pex34: 0.681, pex1: 0.875, cul12: 0.545, cul34: 0.785, cul1: 1.025, cul112: 1.505, cul2: 1.985, s4012: 0.622, s4034: 0.824, s401: 1.049, s402: 2.067, s403: 3.068, s404: 4.026, s406: 6.065 },
    names: { pex38: '3/8-in PEX', pex12: '1/2-in PEX', pex34: '3/4-in PEX', pex1: '1-in PEX', cul12: '1/2-in copper', cul34: '3/4-in copper', cul1: '1-in copper', cul112: '1-1/2-in copper', cul2: '2-in copper', s4012: '1/2-in Sch 40', s4034: '3/4-in Sch 40', s401: '1-in Sch 40', s402: '2-in Sch 40', s403: '3-in Sch 40', s404: '4-in Sch 40', s406: '6-in Sch 40' }
  },
  compute(v, H, D) {
    var id = v.pipe === 'custom' ? v.id : D.ids[v.pipe];
    if (!(id > 0)) return { error: 'Enter the inside diameter of the pipe in inches.' };
    if (!(v.len > 0)) return { error: 'Enter the pipe length in feet.' };
    var name = v.pipe === 'custom' ? H.num(id, 3) + '-in ID pipe' : D.names[v.pipe];
    var gpf = Math.PI / 4 * id * id * 12 / 231;
    var gal = gpf * v.len;
    var fmt = function (x) { return x < 10 ? H.sig(x, 3) : H.num(x, 1); };
    var rows = [
      ['Gallons per foot', H.sig(gpf, 3), true],
      ['Liters', fmt(gal * 3.785411784)],
      ['Cubic feet', H.sig(gal / 7.480519, 3)],
      ['Water weight', fmt(gal * 8.34) + ' lb']
    ];
    if (v.gpm > 0) {
      var sec = gal / v.gpm * 60;
      rows.splice(1, 0, ['Time to purge at ' + H.num(v.gpm, 2) + ' gal/min', sec < 120 ? H.num(sec, 1) + ' seconds' : H.num(sec / 60, 1) + ' minutes', true]);
    }
    if (gal >= 42) rows.push(['Oil barrels (42 gal)', H.num(gal / 42, 2)]);
    return {
      value: fmt(gal) + ' gal',
      label: 'Water held in ' + H.num(v.len, 2) + ' ft of ' + name,
      expr: '0.0408 × ' + H.num(id, 3) + '² × ' + H.num(v.len, 2) + ' ft',
      rows: rows,
      sub: 'Based on inside diameter. Two pipes with the same nominal size can hold quite different amounts: 1/2-in copper holds 26% more than 1/2-in PEX.'
    };
  },
  quick: ({ r }) => `To calculate the volume of a pipe, square the inside diameter in inches and multiply by 0.0408 and the length in feet to get gallons. A 1/2-in PEX line (0.485-in ID) holds 0.0096 gal per foot, so a 50-ft run holds <strong>${r.value}</strong> (1.82 L). At a 1.5 gal/min faucet that is about 19 seconds of cold water before hot arrives.`,
  stepsTitle: 'How to calculate the volume of a pipe',
  steps: [
    'Find the <strong>inside</strong> diameter, not the nominal size. A "1/2-inch" pipe can be 0.485 in (PEX), 0.545 in (copper Type L) or 0.622 in (Schedule 40) inside. Using the nominal size is the usual mistake and can be off by 50% or more.',
    'Square the inside diameter in inches and multiply by 0.0408 to get gallons per foot of pipe.',
    'Multiply by the length in feet for total gallons. Multiply gallons by 3.785 for liters.',
    'For purge or wait time, divide gallons by the flow rate in gallons per minute.'
  ],
  formulaTitle: 'What is the formula for pipe volume?',
  formula: {
    expr: 'V (cu in) = π ÷ 4 × ID² × L × 12<br>Gallons = 0.0408 × ID² × L &nbsp; (ID in inches, L in feet)<br>Liters = 0.000785 × ID² × L &nbsp; (ID in mm, L in meters)',
    vars: [['ID', 'inside diameter'], ['L', 'length of pipe'], ['0.0408', 'π ÷ 4 × 12 ÷ 231: square inches to gallons per foot']],
    note: 'Inside diameters are minimum-wall values from the pipe standards: ASTM F876 SDR 9 for PEX, ASTM B88 Type L for copper and ASME B36.10 Schedule 40 for steel (Schedule 40 PVC shares the same dimensions).'
  },
  example: `<p>A bathroom sink is 50 ft of 1/2-in PEX from the water heater, and the faucet runs at 1.5 gal/min.</p>
<p>Gallons per foot: 0.0408 × 0.485² = <strong>0.0096 gal/ft</strong>. Volume: 0.0096 × 50 = <strong>0.48 gal</strong> (1.82 L).</p>
<p>Purge time: 0.48 ÷ 1.5 = 0.32 min = <strong>19 seconds</strong> of cold water down the drain every time, before the pipe itself warms. The same run in 3/4-in PEX holds 0.95 gal and takes twice as long.</p>`,
  table: {
    title: 'How many gallons per foot does each pipe size hold?',
    intro: 'Water capacity by inside diameter, calculated with 0.0408 × ID².',
    head: ['Pipe', 'Inside diameter', 'Gallons per foot', 'Gallons per 100 ft', 'Liters per meter'],
    rows: ({ run, D }) => ['pex38', 'pex12', 'pex34', 'pex1', 'cul12', 'cul34', 'cul1', 'cul2', 's401', 's402', 's403', 's404', 's406'].map(p => { const r = run({ pipe: p, len: 100, gpm: NaN }); const gpf = Math.PI / 4 * D.ids[p] ** 2 * 12 / 231; return [D.names[p], D.ids[p].toFixed(3) + ' in', r.rows[0][1], r.value.replace(' gal', ''), (gpf * 3.785411784 / 0.3048).toFixed(3)]; }),
    note: 'A 4-in Schedule 40 line holds about two-thirds of a gallon per foot, so 100 ft of it holds 66 gallons, more than a typical water heater.'
  },
  sections: [
    {
      h2: 'How long does it take hot water to reach a faucet?',
      html: `<p>At least as long as it takes to push out the cold water sitting in the line: pipe volume ÷ flow rate. With 1/2-in PEX at 1.5 gal/min that is about <strong>0.4 seconds per foot</strong> of pipe; with 3/4-in PEX it is about 0.75 seconds per foot. In practice the wait is longer, because the first hot water gives up heat to the cold pipe.</p>
<p>Low-flow fixtures make the wait longer, not shorter. Shortening the run, using smaller lines to distant fixtures, insulating hot-water pipes or adding a recirculation loop are the real fixes. A dedicated 3/8-in line to a far bathroom sink holds about half the water of a 1/2-in line.</p>`
    },
    {
      h2: 'How do you calculate the volume of a pipeline?',
      html: `<p>Use the same cylinder formula with larger units. For a pipeline in feet: volume in cubic feet = 0.7854 × ID² × length, with ID in feet; multiply by 7.48 for gallons. A 1-mile (5,280-ft) run of 12-in ID pipe holds 0.7854 × 1 × 5,280 = 4,147 cu ft, or about <strong>31,020 gallons</strong> (739 barrels).</p>
<p>In metric, volume in cubic meters = π ÷ 4 × ID² × length with both in meters; 1 m³ is 1,000 L. Line-fill volumes like this are what you need to plan a flush, a pressure test or a pigging run.</p>`
    },
    {
      h2: 'How much fluid does a heating loop or irrigation line hold?',
      html: `<p>Add up the length of each pipe size and multiply each by its gallons per foot, then add the boiler, heat exchanger or tank volume from the manufacturer's data. A radiant floor with 1,000 ft of 1/2-in PEX holds about 9.6 gallons in the tubing alone, which sets how much glycol to buy at your chosen mix ratio. For winterizing or chlorinating a line, the same total tells you how much solution it takes to fill it.</p>`
    }
  ],
  faq: [
    { q: 'How many gallons are in 100 feet of 1/2-inch PEX?', a: 'About 0.96 gallons (3.6 L), based on the 0.485-in inside diameter of SDR 9 PEX. 100 ft of 1/2-in copper Type L holds about 1.21 gallons.' },
    { q: 'How much water is in 100 feet of 3/4-inch pipe?', a: 'About 1.9 gallons in 3/4-in PEX, 2.5 gallons in 3/4-in copper Type L and 2.8 gallons in 3/4-in Schedule 40.' },
    { q: 'How many gallons per foot is a 4-inch pipe?', a: 'A 4-in Schedule 40 pipe (4.026-in ID) holds about 0.66 gallons per foot. Other 4-in pipe standards (sewer, drain, copper) have different inside diameters, so check the ID before you calculate.' },
    { q: 'Do I use the inside or outside diameter for pipe volume?', a: 'The inside diameter. The outside diameter is fixed by the size standard, and the wall thickness eats into the space for water, so thicker-walled pipes hold less.' },
    { q: 'How do I convert pipe volume to liters?', a: 'Multiply gallons by 3.785. Or measure the inside diameter in millimeters and use 0.000785 × ID² × length in meters for liters directly.' },
    { q: 'What is the volume of a 2-inch pipe per foot?', a: '2-in Schedule 40 (2.067-in ID) holds 0.174 gallons per foot, and 2-in copper Type L (1.985-in ID) holds 0.161 gallons per foot.' }
  ],
  related: ['tank-volume-calculator', 'pool-volume-calculator', 'rolling-offset-calculator', 'cubic-feet-calculator'],
  sources: [
    { name: 'Copper Development Association: The Copper Tube Handbook (ASTM B88 dimensions)', url: 'https://www.copper.org/applications/plumbing/cth/' },
    { name: 'Plastics Pipe Institute: PEX and plastic pipe standards', url: 'https://plasticpipe.org/' },
    { name: 'EPA WaterSense: Bathroom faucets (1.5 gal/min maximum)', url: 'https://www.epa.gov/watersense/bathroom-faucets' }
  ]
};
