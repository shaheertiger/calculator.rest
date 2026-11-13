export default {
  slug: 'cubic-feet-calculator',
  hub: 'construction',
  name: 'Cubic Feet Calculator',
  title: 'Cubic Feet Calculator: 24" × 18" × 18" Box = 4.5 Cu Ft',
  h1: 'Cubic Feet Calculator: Volume of a Box, Room or Space',
  meta: 'Find cubic feet from length, width and height in inches, feet, yards, cm or meters. A 24 × 18 × 18 in box holds 4.5 cu ft, about 33.66 gallons or 127.4 liters.',
  keyword: 'how can i calculate cubic feet',
  also: ['how to calculate cubic footage', 'how to calculate cubic feet of a room', 'how to calculate cubic footage of a room', 'how to calculate cubic feet of a microwave', 'cubic feet calculator', 'cubic inches to cubic feet'],
  updated: '2026-11-13',
  inputs: [
    { id: 'unit', label: 'Measurements in', type: 'select', value: 'in', options: [['in', 'inches'], ['ft', 'feet'], ['yd', 'yards'], ['cm', 'centimeters'], ['m', 'meters']] },
    { id: 'l', label: 'Length', type: 'number', value: 24 },
    { id: 'w', label: 'Width', type: 'number', value: 18 },
    { id: 'h', label: 'Height (or depth)', type: 'number', value: 18 },
    { id: 'qty', label: 'How many identical items', type: 'number', value: 1, help: 'For several boxes of the same size.' }
  ],
  data: { toFt: { in: 1 / 12, ft: 1, yd: 3, cm: 1 / 30.48, m: 1 / 0.3048 } },
  compute(v, H, D) {
    var f = D.toFt[v.unit];
    if (!f) return { error: 'Choose a unit.' };
    if (!(v.l > 0) || !(v.w > 0) || !(v.h > 0)) return { error: 'Enter length, width and height.' };
    var q = v.qty >= 1 ? Math.floor(v.qty) : 1;
    var one = v.l * f * v.w * f * v.h * f;
    var cf = one * q;
    var rows = [];
    if (q > 1) rows.push(['Each item', H.num(one, 3) + ' cu ft']);
    rows.push(['Cubic inches', H.num(cf * 1728, 0) + ' in³']);
    rows.push(['Cubic yards', H.num(cf / 27, 4) + ' yd³', true]);
    rows.push(['US gallons', H.num(cf * 7.48051948, 2) + ' gal']);
    rows.push(['Liters', H.num(cf * 28.316846592, 1) + ' L']);
    rows.push(['Cubic meters', H.num(cf * 0.028316846592, 4) + ' m³']);
    return {
      value: H.num(cf, 3) + ' cu ft',
      label: 'Volume in cubic feet',
      expr: H.num(v.l, 3) + ' × ' + H.num(v.w, 3) + ' × ' + H.num(v.h, 3) + ' ' + v.unit + (q > 1 ? ' × ' + q : '') + (v.unit === 'in' ? ' ÷ 1,728' : ''),
      rows: rows,
      sub: v.unit === 'in' ? 'Inches cubed are divided by 1,728 (12 × 12 × 12) to get cubic feet.' : 'Each side was converted to feet before multiplying.'
    };
  },
  quick: ({ r }) => `To calculate cubic feet, multiply length × width × height in feet. Working in inches, multiply them and divide by 1,728: a 24 × 18 × 18 in box is 7,776 cubic inches ÷ 1,728 = <strong>${r.value}</strong>. That's 0.17 cubic yards, 33.66 US gallons or 127.4 liters. A 12 × 10 ft room with 8-ft ceilings is 960 cu ft.`,
  stepsTitle: 'How to calculate cubic feet',
  steps: [
    'Measure the length, width and height of the box or space. For a container, measure the inside if you want capacity.',
    'Pick the unit you measured in. Don\'t mix units: 2 ft × 18 in × 18 in has to become 2 × 1.5 × 1.5 ft first.',
    'Multiply the three numbers. In feet the result is cubic feet; in inches divide by 1,728, in yards multiply by 27.',
    'Multiply by the number of identical boxes, then read off cubic yards, gallons and liters if you need them.'
  ],
  formulaTitle: 'What is the formula for cubic feet?',
  formula: {
    expr: 'Cubic feet = L (ft) × W (ft) × H (ft)<br>From inches: cu ft = L × W × H ÷ 1,728<br>Cylinder: cu ft = 3.1416 × r² × H',
    vars: [['L, W, H', 'length, width and height'], ['1,728', 'cubic inches in a cubic foot (12³)'], ['27', 'cubic feet in a cubic yard (3³)'], ['7.4805', 'US gallons in a cubic foot']]
  },
  example: `<p>A self-storage unit is 10 ft × 10 ft with an 8 ft ceiling: 10 × 10 × 8 = <strong>800 cu ft</strong>.</p>
<p>You plan to fill it with 18 × 18 × 16 in boxes. Each box is 18 × 18 × 16 = 5,184 in³ ÷ 1,728 = <strong>3 cu ft</strong>, so 40 boxes take up 120 cu ft, about 15% of the unit.</p>
<p>Metric check: a 60 × 40 × 40 cm crate is 0.096 m³ = 0.096 × 35.315 = 3.39 cu ft.</p>`,
  table: {
    title: 'How many cubic feet are common boxes, rooms and spaces?',
    intro: 'Volumes worked out by the calculator. Moving-box sizes vary by brand; these are common dimensions.',
    head: ['Item', 'Dimensions', 'Cubic feet', 'Cubic yards', 'Gallons'],
    rows: ({ run, H }) => [
      ['Small moving box', 'in', 16, 12, 12], ['Medium moving box', 'in', 18, 18, 16], ['Large moving box', 'in', 24, 18, 18], ['Wardrobe box', 'in', 24, 20, 46],
      ['Chest freezer interior (example)', 'in', 40, 18, 24], ['5 × 10 ft storage unit', 'ft', 5, 10, 8], ['10 × 10 ft storage unit', 'ft', 10, 10, 8], ['10 × 12 ft bedroom', 'ft', 10, 12, 8], ['15 × 20 ft living room', 'ft', 15, 20, 9], ['8 × 4 ft raised bed, 1 ft deep', 'ft', 8, 4, 1]
    ].map(([name, u, a, b, c]) => {
      const r = run({ unit: u, l: a, w: b, h: c, qty: 1 });
      const cf = r.value.replace(' cu ft', '').replace(/,/g, '');
      return [name, a + ' × ' + b + ' × ' + c + ' ' + u, r.value, H.num(Number(cf) / 27, 2), H.num(Number(cf) * 7.48051948, 0)];
    })
  },
  sections: [
    {
      h2: 'How do you calculate the cubic feet of a room?',
      html: `<p>Multiply floor length × width × ceiling height. A 14 × 12 ft bedroom with an 8-ft ceiling holds 14 × 12 × 8 = 1,344 cu ft of air. Room volume is what HVAC, dehumidifier and air-purifier sizing use: air changes per hour = CFM × 60 ÷ room volume, so a purifier moving 150 CFM changes the air in that bedroom 150 × 60 ÷ 1,344 = 6.7 times an hour. The <a href="/cfm-calculator">CFM calculator</a> runs that the other way.</p>
<p>For a vaulted or cathedral ceiling, use the average height: a room 8 ft at the walls and 14 ft at the peak averages 11 ft. Bay windows and closets can be added as separate boxes.</p>`
    },
    {
      h2: 'How do you calculate cubic feet from inches or centimeters?',
      html: `<p>Multiply the three dimensions in inches and divide by 1,728, because a cubic foot is 12 in on every side (12 × 12 × 12 = 1,728 in³). A carry-on bag of 22 × 14 × 9 in is 2,772 in³ ÷ 1,728 = 1.6 cu ft. Dividing by 12 or by 144 is a common slip; that only works for lengths and areas.</p>
<p>From centimeters, multiply and divide by 28,316.85 (the cubic centimeters in a cubic foot), or convert to cubic meters (÷ 1,000,000) and multiply by 35.3147. Choose your unit above and the calculator handles it.</p>`
    },
    {
      h2: 'How do you find the cubic feet of a cylinder or an odd shape?',
      html: `<p>For a round container, multiply 3.1416 × radius² × height, all in feet. A 55-gallon drum is about 22.5 in across and 33.5 in tall: radius 0.9375 ft, height 2.79 ft, so 3.1416 × 0.9375² × 2.79 = 7.7 cu ft, which matches its 55-gallon (7.35 cu ft) nominal size plus headspace. The <a href="/cylinder-volume-calculator">cylinder volume calculator</a> does this directly.</p>
<p>For an irregular space, break it into boxes and add them, or for a solid object, submerge it in a container of water and measure the rise: the volume of water displaced equals the object's volume.</p>`
    },
    {
      h2: 'How do you measure the cubic feet of a microwave, fridge or freezer?',
      html: `<p>Measure the <em>inside</em> of the cavity: width, depth and height, in inches, and divide the product by 1,728. A microwave cavity 15.5 × 15 × 10 in is 2,325 in³ ÷ 1,728 = 1.35 cu ft. The capacity on the label may be a little different because manufacturers measure under their own test rules and may exclude or include the turntable and curved walls, so treat your number as a close check rather than an exact match.</p>
<p>For freight and shipping, use the <em>outside</em> dimensions of the package instead, rounded up to the next inch, since carriers bill by the space a box occupies. The <a href="/dimensional-weight-calculator">dimensional weight calculator</a> turns that into billable weight.</p>`
    }
  ],
  faq: [
    { q: 'How many cubic feet are in a cubic yard?', a: '27. A cubic yard is 3 ft × 3 ft × 3 ft. To convert cubic feet to cubic yards, divide by 27.' },
    { q: 'How many gallons are in a cubic foot?', a: 'One cubic foot holds 7.48 US gallons (28.32 liters). A US gallon is 231 cubic inches.' },
    { q: 'How do I calculate cubic feet in inches?', a: 'Multiply length × width × height in inches, then divide by 1,728. A 12 × 12 × 12 in box is exactly 1 cubic foot.' },
    { q: 'What is 1 cubic foot in real life?', a: 'A box 12 inches on each side. It holds about 7.5 gallons of water, which weighs roughly 62.4 lb.' },
    { q: 'How many cubic feet is a 10x10x8 room?', a: '10 × 10 × 8 = 800 cubic feet.' },
    { q: 'How do I convert cubic meters to cubic feet?', a: 'Multiply by 35.3147. One cubic meter is 35.31 cubic feet, and one cubic foot is 0.0283 cubic meters.' },
    { q: 'How many cubic feet of soil do I need for a raised bed?', a: 'Multiply length × width × depth in feet. An 8 × 4 ft bed filled 1 ft deep needs 32 cu ft, which is 1.19 cubic yards or sixteen 2-cu-ft bags.' }
  ],
  related: ['cubic-yards-calculator', 'cubic-inches-calculator', 'cylinder-volume-calculator', 'tank-volume-calculator'],
  sources: [
    { name: 'NIST: Unit conversion (volume)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' },
    { name: 'NIST Handbook 44, Appendix C: General Tables of Units of Measurement', url: 'https://www.nist.gov/pml/weights-and-measures/publications/nist-handbooks/handbook-44' }
  ]
};
