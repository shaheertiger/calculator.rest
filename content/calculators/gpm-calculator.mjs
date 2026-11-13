export default {
  slug: 'gpm-calculator',
  hub: 'electrical',
  name: 'GPM Calculator',
  title: 'GPM Calculator: 5 Gallons in 30 Seconds = 10 GPM Pump Flow',
  h1: 'GPM Calculator: Measure Pump and Pipe Flow in Gallons per Minute',
  meta: 'A pump that fills a 5-gallon bucket in 30 seconds delivers 10 GPM (600 GPH). Also finds GPM from pipe size and velocity, nozzle pressure or pump horsepower.',
  keyword: 'how to calculate gpm of a pump',
  also: ['how to calculate gpm', 'how to calculate gpm on a pump', 'how to calculate gpm from psi', 'how to calculate psi from gpm', 'how to calculate gallons per minute from psi', 'how to calculate flow rate of water', 'how to calculate fire hydrant flow rate'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Method', type: 'select', value: 'bucket', options: [['bucket', 'Bucket test (volume and time)'], ['pipe', 'Pipe diameter and velocity'], ['orifice', 'Outlet or nozzle pressure (psi)'], ['power', 'Pump horsepower and head']], wide: true },
    { id: 'gal', label: 'Container volume', type: 'number', value: 5, suffix: 'gal', showIf: { mode: ['bucket'] } },
    { id: 'sec', label: 'Time to fill', type: 'number', value: 30, suffix: 'seconds', showIf: { mode: ['bucket'] } },
    { id: 'id', label: 'Pipe inside diameter', type: 'number', value: 1.049, suffix: 'in', help: 'Schedule 40: ½ in. = 0.622, ¾ in. = 0.824, 1 in. = 1.049, 1½ in. = 1.610, 2 in. = 2.067', showIf: { mode: ['pipe'] } },
    { id: 'vel', label: 'Flow velocity', type: 'number', value: 5, suffix: 'ft/s', showIf: { mode: ['pipe'] } },
    { id: 'od', label: 'Outlet diameter', type: 'number', value: 2.5, suffix: 'in', showIf: { mode: ['orifice'] } },
    { id: 'psi', label: 'Pitot / residual pressure at the outlet', type: 'number', value: 25, suffix: 'psi', showIf: { mode: ['orifice'] } },
    { id: 'cd', label: 'Discharge coefficient', type: 'select', value: '0.9', options: [['0.9', '0.90 smooth, rounded outlet'], ['0.8', '0.80 square, sharp outlet'], ['0.7', '0.70 square, projecting outlet'], ['0.62', '0.62 sharp-edged hole in a plate'], ['0.97', '0.97 smooth-bore fire nozzle']], showIf: { mode: ['orifice'] } },
    { id: 'hp', label: 'Pump power (brake horsepower)', type: 'number', value: 1, suffix: 'hp', showIf: { mode: ['power'] } },
    { id: 'tdh', label: 'Total dynamic head', type: 'number', value: 150, suffix: 'ft', showIf: { mode: ['power'] } },
    { id: 'peff', label: 'Pump efficiency', type: 'number', value: 50, suffix: '%', showIf: { mode: ['power'] } }
  ],
  compute(v, H) {
    var gpm, expr, label = 'Flow rate', extra = [];
    if (v.mode === 'pipe') {
      if (!(v.id > 0) || !(v.vel > 0)) return { error: 'Enter the pipe inside diameter and velocity.' };
      gpm = 2.448 * v.id * v.id * v.vel;
      expr = '2.448 × ' + H.num(v.id, 3) + '² × ' + H.num(v.vel, 2) + ' ft/s';
      extra.push(['Flow area', H.num(Math.PI / 4 * v.id * v.id, 3) + ' sq in']);
    } else if (v.mode === 'orifice') {
      var cd = Number(v.cd) || 0.9;
      if (!(v.od > 0) || !(v.psi > 0)) return { error: 'Enter the outlet diameter and pressure.' };
      gpm = 29.84 * cd * v.od * v.od * Math.sqrt(v.psi);
      expr = '29.84 × ' + H.num(cd, 2) + ' × ' + H.num(v.od, 3) + '² × √' + H.num(v.psi, 1);
      extra.push(['Jet velocity', H.num(12.19 * Math.sqrt(v.psi), 1) + ' ft/s']);
    } else if (v.mode === 'power') {
      if (!(v.hp > 0) || !(v.tdh > 0)) return { error: 'Enter pump horsepower and total head.' };
      var e = v.peff > 0 && v.peff <= 100 ? v.peff / 100 : 0.5;
      gpm = 3960 * v.hp * e / v.tdh;
      expr = '3,960 × ' + H.num(v.hp, 2) + ' hp × ' + H.num(e * 100, 0) + '% ÷ ' + H.num(v.tdh, 0) + ' ft';
      label = 'Estimated pump flow';
      extra.push(['Pressure at that head', H.num(v.tdh / 2.31, 1) + ' psi']);
    } else {
      if (!(v.gal > 0) || !(v.sec > 0)) return { error: 'Enter the container size and the seconds it took to fill.' };
      gpm = v.gal * 60 / v.sec;
      expr = H.num(v.gal, 2) + ' gal × 60 ÷ ' + H.num(v.sec, 1) + ' s';
      label = 'Measured flow rate';
    }
    var rows = [['Gallons per hour', H.int(gpm * 60) + ' GPH', true], ['Liters per minute', H.num(gpm * 3.785411784, 1) + ' L/min'], ['Cubic feet per second', H.num(gpm / 448.831, 4) + ' cfs']].concat(extra);
    rows.push(['Time to fill 1,000 gal', H.dur(1000 / gpm)]);
    return {
      value: H.num(gpm, 1) + ' GPM', label: label, expr: expr, rows: rows, _gpm: gpm,
      sub: v.mode === 'power' ? 'A rough estimate: the pump\'s published curve at your total head is the real answer.' : v.mode === 'pipe' ? 'Water lines are usually kept to 5–8 ft/s; faster flow is noisy and wears fittings.' : v.mode === 'orifice' ? 'Use the pressure measured while water is flowing; a static reading overstates the flow.' : 'Repeat the test two or three times and average the results.'
    };
  },
  quick: ({ r }) => `To calculate the GPM of a pump, time how long it takes to fill a container of known size and use GPM = gallons × 60 ÷ seconds. A pump that fills a <strong>5-gallon bucket in 30 seconds</strong> delivers 5 × 60 ÷ 30 = <strong>${r.value}</strong>, or 600 gallons per hour. Without a bucket, use pipe velocity or the pump's performance curve.`,
  stepsTitle: 'How to calculate GPM of a pump with a bucket test',
  steps: [
    'Use a container you know the volume of: a marked 5-gallon bucket works for flows up to about 20 GPM; use a 30- or 55-gallon drum above that so the fill takes at least 15 seconds.',
    'Run the pump until the pressure or flow is steady. For a well pump with a pressure tank, open a hose bib near the tank and let the tank drain until the pump runs continuously, or you will be measuring stored water, not pump output.',
    'Time the fill with a stopwatch from the moment the stream enters the container until it reaches the mark.',
    'Divide gallons by seconds and multiply by 60. Repeat two or three times and average.'
  ],
  formulaTitle: 'What formulas give gallons per minute?',
  formula: {
    expr: 'Bucket: GPM = gallons × 60 ÷ seconds<br>Pipe: GPM = 2.448 × d² × V<br>Outlet: GPM = 29.84 × C<sub>d</sub> × d² × √P<br>Pump: GPM ≈ 3,960 × BHP × η ÷ TDH',
    vars: [['d', 'inside diameter, inches'], ['V', 'average velocity, ft/s'], ['C<sub>d</sub>', 'discharge coefficient of the outlet'], ['P', 'pressure at the outlet (pitot pressure for hydrant tests), psi'], ['BHP, η, TDH', 'brake horsepower, pump efficiency and total dynamic head in feet']],
    note: '2.448 comes from converting square inches × ft/s into gallons per minute (7.48 gal per cubic foot). 29.84 is the U.S.-unit form of Q = C<sub>d</sub>A√(2gh), used in NFPA 291 hydrant flow tests. 3,960 is 33,000 ft·lb/min ÷ 8.33 lb per gallon of water.'
  },
  example: `<p>A 1 hp submersible well pump is rated about 10 GPM at the head this well needs. To check it, the owner drains the pressure tank until the pump runs steadily and fills a 5-gallon bucket at the tank tee.</p>
<p>Three timings: 31, 29 and 30 seconds, averaging <strong>30 s</strong>. Flow = 5 × 60 ÷ 30 = <strong>10.0 GPM</strong>, matching the rating.</p>
<p>A year later the same bucket takes 42 s: 5 × 60 ÷ 42 = <strong>7.1 GPM</strong>, a 29% drop that points to a worn impeller, a falling water level or a clogged screen.</p>`,
  table: {
    title: 'How many GPM can a pipe carry?',
    intro: 'Flow through Schedule 40 pipe at common design velocities, computed with the pipe method above. 5 ft/s is a typical target for water supply lines.',
    head: ['Nominal size', 'Inside diameter', '4 ft/s', '5 ft/s', '8 ft/s'],
    rows: ({ run, H }) => [['½ in.', 0.622], ['¾ in.', 0.824], ['1 in.', 1.049], ['1¼ in.', 1.38], ['1½ in.', 1.61], ['2 in.', 2.067], ['2½ in.', 2.469], ['3 in.', 3.068], ['4 in.', 4.026], ['6 in.', 6.065]].map(([n, d]) => [n, H.fix(d, 3) + ' in.', ...[4, 5, 8].map(vel => H.num(run({ mode: 'pipe', id: d, vel })._gpm, 1) + ' GPM')]),
    note: 'Schedule 40 inside diameters per ASME B36.10. PEX, copper and Schedule 80 pipe have different bores, so measure or look up the actual inside diameter.'
  },
  sections: [
    {
      h2: 'How do you read GPM from a pump curve?',
      html: `<p>A pump's performance curve plots flow (GPM) along the bottom against head (feet) up the side. Flow is not a fixed number: the same pump moves more water against low head and less against high head. To find your GPM, work out the total dynamic head of your system (vertical lift + pipe friction + required outlet pressure, all in feet; the <a href="/pump-head-calculator">pump head calculator</a> does this), find that head on the vertical axis, move across to the curve and read straight down.</p>
<p>For example, if a curve passes through 100 ft at 12 GPM and 140 ft at 8 GPM, a system needing 120 ft of head will run near 10 GPM. Where the curve crosses your system's resistance curve is the operating point; try to land near the pump's best-efficiency point, often marked on the chart.</p>`
    },
    {
      h2: 'How do you calculate GPM from psi?',
      html: `<p>Pressure alone does not set flow; you also need the opening it flows through. For water leaving an open outlet, GPM = 29.84 × C<sub>d</sub> × d² × √psi. A fire hydrant's 2½ in. smooth outlet with a 25 psi pitot reading flows 29.84 × 0.90 × 6.25 × 5 = <strong>839 GPM</strong>. Because flow follows the square root of pressure, doubling the pressure raises flow only about 41%.</p>
<p>Going the other way, psi from GPM: P = (GPM ÷ (29.84 × C<sub>d</sub> × d²))². Inside a pipe network, the pressure you lose at a given flow comes from friction, which depends on pipe size, length and material.</p>`
    },
    {
      h2: 'How many GPM does a house need?',
      html: `<p>Add up the fixtures likely to run at once. Federal limits and EPA WaterSense specifications put a showerhead at 2.5 GPM maximum (WaterSense models 2.0 GPM or less), a bathroom faucet at 1.5 GPM for WaterSense models and a kitchen faucet around 1.5–2.2 GPM. A shower, a sink and a washing machine running together can call for 6–8 GPM, which is why well pumps for a typical three-bedroom home are often sized around 8–12 GPM. Irrigation zones are planned separately and often set the pump size on rural properties.</p>`
    }
  ],
  faq: [
    { q: 'How many GPM can a 1 inch pipe carry?', a: 'About 13.5 GPM at 5 ft/s and 21.6 GPM at 8 ft/s for 1 in. Schedule 40 pipe (1.049 in. inside diameter). Long runs carry less at the same pressure because of friction.' },
    { q: 'How do I convert GPM to GPH or liters per minute?', a: 'Multiply GPM by 60 for gallons per hour and by 3.785 for liters per minute. 10 GPM is 600 GPH or 37.9 L/min.' },
    { q: 'How do I calculate GPM from horsepower?', a: 'GPM ≈ 3,960 × horsepower × pump efficiency ÷ total head in feet. A 1 hp pump at 50% efficiency against 150 ft of head moves about 13.2 GPM. Check the manufacturer\'s curve for the exact figure.' },
    { q: 'Does higher pressure mean more GPM?', a: 'Through the same opening, yes, but only by the square root: four times the pressure doubles the flow. A pump, however, delivers less flow as the pressure it must produce rises.' },
    { q: 'What is the formula for fire hydrant flow?', a: 'Q = 29.83 × c × d² × √p, where d is the outlet diameter in inches, p the pitot pressure in psi and c the outlet coefficient (0.90 for smooth, rounded outlets). This is the formula in NFPA 291.' },
    { q: 'Why does my bucket test show less than the pump rating?', a: 'Pump ratings are given at a specific head. Real systems add lift, friction and pressure-switch settings, and wear, a low water level or a clogged intake screen also cut flow.' }
  ],
  related: ['pump-head-calculator', 'pipe-volume-calculator', 'pool-volume-calculator', 'tank-volume-calculator'],
  sources: [
    { name: 'Hydraulic Institute: pump standards and performance testing', url: 'https://www.pumps.org/' },
    { name: 'NFPA 291: Recommended Practice for Water Flow Testing and Marking of Hydrants', url: 'https://www.nfpa.org/codes-and-standards/nfpa-291-standard-development/291' },
    { name: 'U.S. EPA WaterSense: product flow-rate specifications', url: 'https://www.epa.gov/watersense' },
    { name: 'Engineering ToolBox: Hazen-Williams friction loss for water', url: 'https://www.engineeringtoolbox.com/hazen-williams-water-d_797.html' }
  ]
};
