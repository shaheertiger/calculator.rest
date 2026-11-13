export default {
  slug: 'btu-calculator',
  hub: 'electrical',
  name: 'BTU Calculator',
  title: 'BTU Calculator: A 500 sq ft Room Needs 12,000 BTU (1 Ton)',
  h1: 'Room BTU Calculator: Air Conditioner Size by Square Feet',
  meta: 'A 20 × 25 ft (500 sq ft) room needs about 12,000 BTU per hour of cooling, or 1 ton, by ENERGY STAR\'s chart. Adjusts for sun, shade, occupants and kitchens.',
  keyword: 'how do you calculate btu for a room',
  also: ['btu calculator', 'how to calculate btu for air conditioner', 'how to calculate aircon btu', 'how do you calculate air conditioner size', 'how to calculate btu per square foot', 'what size air conditioner do i need'],
  updated: '2026-11-13',
  inputs: [
    { id: 'length', label: 'Room length', type: 'number', value: 25, suffix: 'ft' },
    { id: 'width', label: 'Room width', type: 'number', value: 20, suffix: 'ft' },
    { id: 'height', label: 'Ceiling height', type: 'number', value: 8, suffix: 'ft', help: 'The ENERGY STAR chart assumes 8 ft; taller ceilings scale the estimate up.' },
    { id: 'sun', label: 'Sun exposure', type: 'select', value: 'avg', options: [['avg', 'Average'], ['shade', 'Heavily shaded (−10%)'], ['sunny', 'Very sunny (+10%)']] },
    { id: 'people', label: 'People who regularly use the room', type: 'number', value: 2, help: 'Adds 600 BTU for each person beyond two.' },
    { id: 'kitchen', label: 'Room type', type: 'select', value: 'no', options: [['no', 'Bedroom, living room or office'], ['yes', 'Kitchen (+4,000 BTU)']] }
  ],
  data: {
    chart: [[100, 5000], [150, 6000], [250, 7000], [300, 8000], [350, 9000], [400, 10000], [450, 12000], [550, 14000], [700, 18000], [1000, 21000], [1200, 23000], [1400, 24000], [1500, 30000], [2000, 34000]]
  },
  compute(v, H, D) {
    if (!(v.length > 0) || !(v.width > 0)) return { error: 'Enter the room length and width in feet.' };
    var area = v.length * v.width;
    var ht = v.height > 0 ? v.height : 8;
    var hf = ht > 8 ? ht / 8 : 1;
    var base, src;
    if (area > 2500) { base = area * 20; src = 'Rule of thumb (beyond the chart)'; }
    else {
      base = 5000;
      for (var i = 0; i < D.chart.length; i++) if (area >= D.chart[i][0]) base = D.chart[i][1];
      src = 'ENERGY STAR chart for ' + H.int(area) + ' sq ft';
    }
    var btu = base * hf;
    if (v.sun === 'shade') btu *= 0.9;
    if (v.sun === 'sunny') btu *= 1.1;
    var extra = v.people > 2 ? Math.round(v.people - 2) : 0;
    btu += extra * 600;
    if (v.kitchen === 'yes') btu += 4000;
    btu = Math.round(btu / 100) * 100;
    var rule = area * 20 * hf;
    var rows = [
      ['Cooling in tons', H.num(btu / 12000, 2) + (btu === 12000 ? ' ton' : ' tons'), true],
      [src, H.int(base) + ' BTU'],
      ['Quick rule: 20 BTU × sq ft', H.int(rule) + ' BTU'],
      ['Heat removed, in kilowatts', H.num(btu / 3412, 2) + ' kW']
    ];
    if (hf > 1) rows.splice(2, 0, ['Ceiling factor (' + H.num(ht, 1) + ' ft ÷ 8)', '× ' + H.num(hf, 2)]);
    return {
      value: H.int(btu) + ' BTU/h', label: 'Recommended cooling capacity',
      expr: H.num(v.length, 1) + ' × ' + H.num(v.width, 1) + ' ft = ' + H.int(area) + ' sq ft',
      rows: rows,
      sub: area > 2500 ? 'Whole-home systems should be sized with an ACCA Manual J load calculation, not a chart.' : (area < 100 ? 'The smallest common room units are about 5,000 BTU, which covers rooms up to 150 sq ft.' : 'Choose the unit closest to this rating; going much bigger cools fast but leaves the room damp.')
    };
  },
  quick: ({ r }) => `To calculate BTU for a room, multiply length × width for square feet, then look up the capacity: ENERGY STAR puts a <strong>500 sq ft</strong> room (20 × 25 ft) at <strong>${r.value}</strong>, or 1 ton. The quick rule of 20 BTU per square foot gives 10,000 BTU. Add 10% for a very sunny room, 600 BTU per extra person and 4,000 BTU for a kitchen.`,
  stepsTitle: 'How to calculate BTU for a room',
  steps: [
    'Measure the floor in feet and multiply length × width. Convert inches to decimals first: 12 ft 6 in is 12.5 ft. For L-shaped rooms, split them into rectangles and add the areas.',
    'Find the capacity for that area in the ENERGY STAR chart below (it assumes an 8-foot ceiling).',
    'Adjust: subtract 10% for a heavily shaded room, add 10% for a very sunny one, add 600 BTU for each regular occupant beyond two, and add 4,000 BTU if the unit cools a kitchen.',
    'Buy the closest size. <strong>Oversizing is the common mistake</strong>: a unit that is too big short-cycles, leaving the air cool but clammy and wasting energy.'
  ],
  formulaTitle: 'What is the BTU formula for a room?',
  formula: {
    expr: 'Area (sq ft) = length × width<br>BTU/h = chart capacity × (ceiling ÷ 8, if over 8 ft) × sun factor + 600 × (people − 2) + 4,000 if kitchen<br>Tons = BTU/h ÷ 12,000',
    vars: [['chart capacity', 'ENERGY STAR capacity for the floor area'], ['sun factor', '0.9 heavily shaded, 1.0 average, 1.1 very sunny'], ['12,000', 'BTU per hour in one ton of cooling']],
    note: 'The 20 BTU per square foot rule is a common shortcut. It runs below the ENERGY STAR chart for small and mid-size rooms (which carry a minimum unit size) and above it for very large spaces.'
  },
  example: `<p>A sunny 14 × 16 ft home office (224 sq ft) is used by three people, with a 9-foot ceiling.</p>
<p>Chart capacity for 150–250 sq ft: <strong>6,000 BTU</strong>. Ceiling: 6,000 × 9 ÷ 8 = 6,750. Sunny: 6,750 × 1.1 = 7,425. One extra person: + 600 = <strong>8,025 BTU</strong>, which the calculator rounds to 8,000.</p>
<p>An 8,000 BTU window unit is the right fit. That is 8,000 ÷ 12,000 = 0.67 tons of cooling.</p>`,
  table: {
    title: 'What size air conditioner do I need for my square footage?',
    intro: 'ENERGY STAR\'s room air conditioner sizing chart, with the sunny-room and extra-occupant adjustments worked out by the calculator above.',
    head: ['Room area', 'BTU per hour', 'Tons', 'Very sunny (+10%)', 'Sunny with 4 people'],
    rows: ({ run, H }) => [['100–150', 125], ['150–250', 200], ['250–300', 275], ['300–350', 325], ['350–400', 375], ['400–450', 425], ['450–550', 500], ['550–700', 625], ['700–1,000', 850], ['1,000–1,200', 1100], ['1,200–1,400', 1300], ['1,400–1,500', 1450], ['1,500–2,000', 1750], ['2,000–2,500', 2250]].map(([label, a]) => {
      const b = run({ length: a, width: 1, height: 8, sun: 'avg', people: 2, kitchen: 'no' });
      return [label + ' sq ft', b.value, b.rows[0][1], run({ length: a, width: 1, height: 8, sun: 'sunny', people: 2, kitchen: 'no' }).value, run({ length: a, width: 1, height: 8, sun: 'sunny', people: 4, kitchen: 'no' }).value];
    }),
    note: 'Sizes are for single rooms and window, through-the-wall or portable units. Portable units are often less efficient than their rating suggests, so err toward the next size up.'
  },
  sections: [
    {
      h2: 'How many BTU do I need per square foot?',
      html: `<p>About 20 BTU per square foot is the popular rule of thumb, but the ENERGY STAR chart is more useful because it reflects real unit sizes. Small rooms need proportionally more: a 125 sq ft bedroom gets a 5,000 BTU unit, which is 40 BTU per square foot, because that is the smallest common size. Mid-size rooms land around 20–27 BTU per square foot (12,000 BTU for 450–550 sq ft), and very large open areas drop toward 14–17 (34,000 BTU for 2,000–2,500 sq ft).</p>
<p>Climate, insulation, window area and orientation can each move the real load by more than the chart's 10% sun adjustment. A west-facing room with big windows in Phoenix needs more than a north-facing room in Seattle of the same size.</p>`
    },
    {
      h2: 'How do you convert BTU to tons for an air conditioner?',
      html: `<p>Divide BTU per hour by 12,000. One ton of cooling is the heat needed to melt one short ton of ice in 24 hours: 288,000 BTU ÷ 24 hours = 12,000 BTU/h. So a 24,000 BTU mini-split is 2 tons and a 36,000 BTU central system is 3 tons.</p>
<p>Room units are labeled in BTU; central air and heat pumps are usually sold in half-ton steps from 1.5 to 5 tons. Whole-house equipment should not be sized from square footage alone. HVAC contractors use ACCA Manual J, which accounts for insulation, windows, air leakage, duct location and your local design temperatures.</p>`
    },
    {
      h2: 'How do you calculate BTU for heating a room?',
      html: `<p>Electric heat converts at a fixed rate: 1 watt = 3.412 BTU per hour (EIA puts 1 kWh at 3,412 BTU). A standard 1,500 W space heater therefore delivers 1,500 × 3.412 = <strong>5,118 BTU/h</strong>, and a 5,000 W baseboard circuit about 17,060 BTU/h.</p>
<p>How much heat a room needs depends far more on climate and insulation than cooling does, since the indoor-outdoor temperature difference in a northern winter can be 60–70°F. For a single room, compare the heater's BTU with the AC size from this calculator as a floor, and for a whole house use a Manual J heating load. To turn a heater's watts into running cost, use the <a href="/electricity-cost-calculator">electricity cost calculator</a>.</p>`
    },
    {
      h2: 'What happens if an air conditioner is too big or too small?',
      html: `<ul><li><strong>Too big:</strong> it hits the thermostat setting in a few minutes and shuts off before it has removed much humidity. The room feels cold and clammy, the compressor cycles more often, and you paid for capacity you cannot use. ENERGY STAR specifically warns that bigger is not better.</li>
<li><strong>Too small:</strong> it runs constantly on hot afternoons and may never reach the set temperature, especially in a sunny room.</li>
<li><strong>Just right:</strong> long, steady run times that dry the air as they cool. Variable-speed (inverter) units tolerate some oversizing better because they can throttle down.</li></ul>`
    }
  ],
  faq: [
    { q: 'How many BTU do I need for a 12 × 12 room?', a: 'A 12 × 12 room is 144 sq ft, which falls in ENERGY STAR\'s 100–150 sq ft bracket: 5,000 BTU. Make it 5,500 BTU if the room is very sunny.' },
    { q: 'How many BTU for 1,000 square feet?', a: 'ENERGY STAR lists 21,000 BTU for 1,000 to 1,200 sq ft. At 999 sq ft you are in the 700–1,000 bracket at 18,000 BTU. For a whole apartment or house, get a Manual J calculation.' },
    { q: 'Is 20 BTU per square foot accurate?', a: 'Only roughly. It lands close to ENERGY STAR\'s chart for 700–1,000 sq ft spaces but comes in 15–50% low for smaller rooms, and it ignores sun, occupants and kitchens.' },
    { q: 'How many square feet does a 10,000 BTU air conditioner cool?', a: 'About 400 to 450 sq ft in ENERGY STAR\'s chart, or less if the room is very sunny or regularly holds more than two people.' },
    { q: 'How many BTU is 1 ton?', a: 'One ton of cooling equals 12,000 BTU per hour, so a 2-ton system is 24,000 BTU/h.' },
    { q: 'How do high ceilings affect BTU?', a: 'The ENERGY STAR chart assumes 8-foot ceilings. A common approach, used here, is to scale capacity by ceiling height ÷ 8, so a 10-foot ceiling adds 25%.' },
    { q: 'Do I need extra BTU for a kitchen?', a: 'Yes. ENERGY STAR recommends adding 4,000 BTU when a room air conditioner cools a kitchen, because cooking appliances add a lot of heat.' }
  ],
  related: ['cfm-calculator', 'square-footage-calculator', 'electricity-cost-calculator', 'superheat-calculator', 'kw-calculator'],
  sources: [
    { name: 'ENERGY STAR: Room Air Conditioners (sizing chart and adjustments)', url: 'https://www.energystar.gov/products/room_air_conditioners' },
    { name: 'U.S. EIA: British thermal units (Btu)', url: 'https://www.eia.gov/energyexplained/units-and-calculators/british-thermal-units.php' },
    { name: 'ACCA: Manual J Residential Load Calculation', url: 'https://www.acca.org/standards/technical-manuals/manual-j' }
  ]
};
