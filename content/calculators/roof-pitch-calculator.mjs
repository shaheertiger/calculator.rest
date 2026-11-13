export default {
  slug: 'roof-pitch-calculator',
  hub: 'construction',
  name: 'Roof Pitch Calculator',
  title: 'Roof Pitch Calculator: 6/12 Pitch = 26.57° (Pitch to Degrees)',
  h1: 'Roof Pitch Calculator: Convert Rise and Run to Degrees and x/12',
  meta: 'Turn a roof\'s rise and run into pitch, degrees, percent slope and the rafter multiplier. A 6/12 roof is 26.57°, a 50% slope, with a 1.118 area multiplier.',
  keyword: 'how to calculate roof pitch in degrees',
  also: ['how to calculate a roof pitch in degrees', 'how to calculate roof slope degree', 'how do i calculate the pitch of a roof', 'how to calculate the slope of a roof', 'roof pitch to degrees', 'degrees to roof pitch', 'roof pitch multiplier'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I know the', type: 'select', value: 'rise', options: [['rise', 'Rise and run'], ['deg', 'Angle in degrees']] },
    { id: 'rise', label: 'Rise', type: 'number', value: 6, suffix: 'in', showIf: { mode: ['rise'] } },
    { id: 'run', label: 'Run', type: 'number', value: 12, suffix: 'in', showIf: { mode: ['rise'] }, help: 'Measure 12 in level and the rise straight up, or use any run and rise.' },
    { id: 'deg', label: 'Roof angle', type: 'number', value: 30, suffix: '°', showIf: { mode: ['deg'] } }
  ],
  compute(v, H) {
    var p;
    if (v.mode === 'deg') {
      if (!(v.deg > 0) || !(v.deg < 90)) return { error: 'Enter an angle between 0 and 90 degrees.' };
      p = Math.tan(v.deg * Math.PI / 180) * 12;
    } else {
      if (!(v.rise >= 0) || !(v.run > 0)) return { error: 'Enter the rise and a run greater than zero.' };
      p = v.rise / v.run * 12;
    }
    var deg = Math.atan(p / 12) * 180 / Math.PI;
    var mult = Math.sqrt(1 + (p / 12) * (p / 12));
    var cat = p < 2 ? 'Low slope / flat: below the 2/12 minimum for asphalt shingles' : p < 4 ? 'Low slope: shingles allowed with double underlayment (2/12 to under 4/12)' : p < 8 ? 'Conventional slope' : 'Steep slope: roofers usually work from roof jacks or toe boards at 8/12 and above';
    var rows = [
      ['Pitch', H.num(p, 2) + '/12', true],
      ['Slope (grade)', H.pct(p / 12 * 100, 1)],
      ['Rafter / area multiplier', H.fix(mult, 3)],
      ['Rafter length per foot of run', H.num(mult * 12, 2) + ' in'],
      ['Ratio', '1 : ' + (p > 0 ? H.num(12 / p, 2) : '∞')]
    ];
    return {
      value: H.fix(deg, 2) + '°',
      label: 'Roof angle',
      expr: v.mode === 'deg' ? 'tan(' + H.num(v.deg, 2) + '°) × 12 = ' + H.num(p, 2) + '/12' : 'arctan(' + H.num(v.rise, 3) + ' ÷ ' + H.num(v.run, 3) + ')',
      rows: rows,
      sub: cat + '.'
    };
  },
  quick: ({ r }) => `To convert roof pitch to degrees, take the arctangent of rise ÷ run. A 6/12 pitch is arctan(6 ÷ 12) = arctan(0.5) = <strong>${r.value}</strong>. A 4/12 roof is 18.43°, 8/12 is 33.69° and 12/12 is 45°. To go back, multiply tan(angle) by 12: 30° is a 6.93/12 pitch.`,
  stepsTitle: 'How to calculate roof pitch in degrees',
  steps: [
    'Measure the rise over a known run. On the roof or a rafter, hold a level 12 in long horizontally and measure straight up from its end to the roof surface.',
    'Divide rise by run. A 6-in rise over 12 in is 0.5. Make sure both are in the same unit and that the run is horizontal, not along the slope; measuring along the roof is the usual error.',
    'Take the arctangent (tan⁻¹ on a calculator in degree mode): arctan(0.5) = 26.57°.',
    'Express it as x/12 by multiplying rise ÷ run by 12, and as a percent grade by multiplying by 100.'
  ],
  formulaTitle: 'What is the formula for roof pitch in degrees?',
  formula: {
    expr: 'Angle = arctan(rise ÷ run)<br>Pitch (x/12) = 12 × rise ÷ run = 12 × tan(angle)<br>Multiplier = √(1 + (rise ÷ run)²)',
    vars: [['rise', 'vertical rise'], ['run', 'horizontal distance (12 in for x/12 pitch)'], ['multiplier', 'sloped length (or area) ÷ horizontal length (or area)']]
  },
  example: `<p>From the attic, you measure a rafter rising 31½ in over a horizontal run of 54 in.</p>
<p>Rise ÷ run = 31.5 ÷ 54 = 0.583. Pitch = 0.583 × 12 = <strong>7/12</strong>. Angle = arctan(0.583) = <strong>30.26°</strong>.</p>
<p>The multiplier is √(1 + 0.583²) = 1.158, so each 12 in of run takes 13.89 in of rafter, and a 1,500 sq ft house footprint has about 1,500 × 1.158 = 1,737 sq ft of roof before overhangs.</p>`,
  table: {
    title: 'What is each roof pitch in degrees?',
    intro: 'Common pitches converted by the calculator, with the multiplier used to turn a flat footprint into roof area.',
    head: ['Pitch', 'Degrees', 'Slope %', 'Multiplier', 'Typical use'],
    rows: ({ run }) => [[1, 'Low-slope membrane or metal'], [2, 'Minimum for asphalt shingles'], [3, 'Shingles with double underlayment'], [4, 'Common on ranch homes'], [5, 'Common'], [6, 'Common'], [7, 'Common'], [8, 'Steeper, still common'], [9, 'Steep'], [10, 'Steep'], [12, '45°, very steep'], [14, 'A-frame, Tudor'], [18, 'Mansard or A-frame']].map(([x, use]) => {
      const r = run({ mode: 'rise', rise: x, run: 12 });
      return [x + '/12', r.value, r.rows[1][1], r.rows[2][1], use];
    })
  },
  sections: [
    {
      h2: 'How do you measure roof pitch?',
      html: `<p>The easiest place is inside the attic: hold a level against the underside of a rafter, mark 12 in along the level, and measure from that mark straight up to the rafter. That vertical distance is the pitch in inches per foot. On the roof itself, do the same with a level on the shingles (only on a low, dry roof and with proper fall protection). From the ground, you can measure the gable: half the building width is the run, and the height from the top of the wall to the ridge is the rise. A 28-ft-wide house whose ridge sits 7 ft above the walls has a 7 ÷ 14 × 12 = 6/12 pitch.</p>
<p>Smartphone level apps and angle finders give degrees directly; switch the calculator to the angle mode to turn that into x/12.</p>`
    },
    {
      h2: 'How do you convert degrees to roof pitch?',
      html: `<p>Multiply the tangent of the angle by 12. A 30° roof is tan(30°) × 12 = 0.577 × 12 = 6.93, so about a 7/12 pitch. A 20° roof is 4.37/12, and 35° is 8.40/12. Builders round to the nearest whole inch because rafters are cut to whole-number pitches on a framing square. For rafter cuts and full rafter length, the <a href="/right-triangle-calculator">right triangle calculator</a> solves the same triangle with any two sides.</p>`
    },
    {
      h2: 'What is the minimum roof pitch for shingles and other roofing?',
      html: `<p>Under the International Residential Code, asphalt shingles need a slope of at least 2/12 (R905.2.2), and roofs from 2/12 up to less than 4/12 must have double underlayment per the code and the shingle maker. Other common IRC minimums: clay and concrete tile 2½/12, wood shingles 3/12, and standing-seam metal ¼/12. Roofs below 2/12 need a low-slope system such as a single-ply membrane, modified bitumen or built-up roofing. The NRCA treats roofs of 3/12 or less as low slope and steeper ones as steep slope. Check your local code and the manufacturer's instructions, which can be stricter.</p>`
    },
    {
      h2: 'How does pitch change roof area?',
      html: `<p>A sloped roof has more surface than the footprint it covers. Multiply the footprint (including overhangs) by the pitch multiplier: 1.054 for 4/12, 1.118 for 6/12, 1.202 for 8/12 and 1.414 for 12/12. A 2,000 sq ft footprint with a 6/12 roof has about 2,236 sq ft of roof, or 22.4 squares (a square is 100 sq ft). The <a href="/roofing-calculator">roofing calculator</a> takes that through to bundles of shingles and waste.</p>`
    }
  ],
  faq: [
    { q: 'What is a 4/12 roof pitch in degrees?', a: 'A 4/12 pitch is 18.43°, a 33.3% slope, with a multiplier of 1.054.' },
    { q: 'What is an 8/12 pitch in degrees?', a: 'An 8/12 pitch is 33.69°, a 66.7% slope, with a multiplier of 1.202.' },
    { q: 'What angle is a 12/12 roof?', a: 'A 12/12 roof rises 12 in for every 12 in of run, which is exactly 45°, a 100% slope.' },
    { q: 'Is a 3/12 pitch too flat for shingles?', a: 'No, but it is low slope. The IRC allows asphalt shingles down to 2/12 if double underlayment is installed on slopes under 4/12. Below 2/12 you need a low-slope roofing system.' },
    { q: 'What is the difference between roof pitch and slope?', a: 'Strictly, slope is rise over run (6/12) and pitch is rise over the full span (a 6/12 slope is a 1/4 pitch). In everyday use, "pitch" almost always means the x/12 rise-over-run number.' },
    { q: 'What is the most common roof pitch?', a: 'Most houses fall between 4/12 and 9/12, about 18° to 37°, which sheds water well and can still be walked by roofers with care.' },
    { q: 'How do I find roof pitch without going on the roof?', a: 'Measure from the attic along a rafter, or measure the gable: divide the ridge height above the wall plate by half the building width and multiply by 12.' }
  ],
  related: ['roofing-calculator', 'right-triangle-calculator', 'slope-calculator', 'stair-calculator'],
  sources: [
    { name: 'International Code Council: International Residential Code, Chapter 9 Roof Assemblies (R905)', url: 'https://www.iccsafe.org/' },
    { name: 'National Roofing Contractors Association (NRCA)', url: 'https://www.nrca.net/' },
    { name: 'InterNACHI: Measuring roof slope and pitch', url: 'https://www.nachi.org/roof-slope-pitch.htm' }
  ]
};
