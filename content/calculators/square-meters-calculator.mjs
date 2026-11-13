export default {
  slug: 'square-meters-calculator',
  hub: 'construction',
  name: 'Square Meter Calculator',
  title: 'Square Meter Calculator: 4.2 m × 3.5 m Room = 14.7 m²',
  h1: 'Square Meter Calculator: Area in m² From Meters, cm or Feet',
  meta: 'Get area in square meters from meters, centimeters, millimeters, feet or inches. A 4.2 × 3.5 m room is 14.7 m² (158.23 sq ft). Add several rooms for a total.',
  keyword: 'how do we calculate square meters',
  also: ['how do you calculate square metres of a room', 'how to calculate square meter of a room', 'how to calculate square meter of room', 'square meter calculator', 'square feet to square meters', 'm2 calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'unit', label: 'You measured in', type: 'select', value: 'm', options: [['m', 'meters (m)'], ['cm', 'centimeters (cm)'], ['mm', 'millimeters (mm)'], ['ft', 'feet (ft)'], ['in', 'inches (in)'], ['yd', 'yards (yd)']] },
    {
      id: 'rooms', label: 'Rooms or rectangles', type: 'rows', addLabel: '+ add rectangle', max: 30,
      fields: [
        { id: 'name', label: 'Name (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. Hall' },
        { id: 'l', label: 'Length', type: 'number', value: 3 },
        { id: 'w', label: 'Width', type: 'number', value: 3 }
      ],
      value: [{ name: 'Bedroom', l: 4.2, w: 3.5 }]
    },
    { id: 'price', label: 'Price per m² (optional)', type: 'number', value: '', placeholder: 'e.g. 25', help: 'Any currency; the total uses the same one.' }
  ],
  data: { toM: { m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144 } },
  compute(v, H, D) {
    var f = D.toM[v.unit];
    if (!f) return { error: 'Choose a unit.' };
    var m2 = 0, rows = [], parts = [], k = 0;
    (v.rooms || []).forEach(function (r, i) {
      if (!(r.l > 0) || !(r.w > 0)) return;
      var a = r.l * f * r.w * f;
      m2 += a; k++;
      parts.push(H.num(r.l, 3) + ' × ' + H.num(r.w, 3));
      if (rows.length < 10) rows.push([(r.name ? H.esc(r.name) : 'Rectangle ' + (i + 1)), H.num(a, 3) + ' m²']);
    });
    if (!k) return { error: 'Enter a length and width.' };
    if (k === 1) rows = [];
    rows.push(['Square feet', H.num(m2 / 0.09290304, 2) + ' sq ft', true]);
    rows.push(['Square yards', H.num(m2 / 0.83612736, 2) + ' sq yd']);
    rows.push(['Square centimeters', H.num(m2 * 10000, 0) + ' cm²']);
    rows.push(['Hectares', H.num(m2 / 10000, 6) + ' ha']);
    if (v.price > 0) rows.push(['Cost at ' + H.num(v.price, 2) + ' per m²', H.num(m2 * v.price, 2), true]);
    return {
      value: H.num(m2, 3) + ' m²',
      label: 'Area in square meters',
      expr: (parts.join(' + ') + ' ' + v.unit).slice(0, 80),
      rows: rows,
      sub: v.unit === 'm' ? 'Both sides were in meters, so length × width gives m² directly.' : 'Each side was converted to meters first (1 ' + v.unit + ' = ' + f + ' m), then multiplied.'
    };
  },
  quick: ({ r }) => `To calculate square meters, multiply length by width with both sides in meters. A room 4.2 m long and 3.5 m wide is 4.2 × 3.5 = <strong>${r.value}</strong>, which is 158.23 sq ft. If you measured in centimeters, divide the product by 10,000 (420 × 350 = 147,000 cm² = 14.7 m²); from square feet, multiply by 0.0929.`,
  stepsTitle: 'How to calculate square meters',
  steps: [
    'Measure the length and width of the floor or wall at their longest points.',
    'Put both measurements in meters. 350 cm is 3.5 m and 2,750 mm is 2.75 m. Mixing units, such as meters times centimeters, is the most common error.',
    'Multiply length × width. The answer is in square meters (m²).',
    'For an L-shaped room, split it into rectangles, work out each one and add them; use one row per rectangle above.'
  ],
  formulaTitle: 'What is the formula for square meters?',
  formula: {
    expr: 'Area (m²) = length (m) × width (m)<br>cm² ÷ 10,000 = m² · mm² ÷ 1,000,000 = m²<br>sq ft × 0.09290304 = m² · m² × 10.7639 = sq ft',
    vars: [['m²', 'square meter: a 1 m × 1 m square'], ['1 m', '100 cm = 1,000 mm = 3.2808 ft'], ['1 ft', '0.3048 m exactly']],
    note: 'Because area is two-dimensional, the conversion factor is squared: 1 m = 100 cm, so 1 m² = 100 × 100 = 10,000 cm².'
  },
  example: `<p>An L-shaped living area is a 5.6 m × 4.0 m main room plus a 2.4 m × 1.8 m dining nook.</p>
<p>Main room: 5.6 × 4.0 = <strong>22.4 m²</strong>. Nook: 2.4 × 1.8 = <strong>4.32 m²</strong>.</p>
<p>Total = 22.4 + 4.32 = <strong>26.72 m²</strong> = 26.72 × 10.7639 = 287.61 sq ft.</p>
<p>Same room measured in centimeters: 560 × 400 = 224,000 cm² and 240 × 180 = 43,200 cm²; total 267,200 ÷ 10,000 = 26.72 m².</p>`,
  table: {
    title: 'How many square feet is a square meter?',
    intro: 'Square meters converted to square feet and square yards by the calculator.',
    head: ['Square meters', 'Square feet', 'Square yards', 'Equal to a square of'],
    rows: ({ run, H }) => [1, 5, 9, 10, 12, 15, 20, 25, 30, 50, 75, 100, 150, 200, 500, 1000].map(a => {
      const r = run({ unit: 'm', rooms: [{ name: '', l: a, w: 1 }], price: NaN });
      const ft = r.rows.find(x => x[0] === 'Square feet')[1];
      return [H.num(a, 0) + ' m²', ft, H.num(a / 0.83612736, 2), H.num(Math.sqrt(a), 2) + ' m per side'];
    })
  },
  sections: [
    {
      h2: 'How do you calculate square metres of a room measured in centimetres or millimetres?',
      html: `<p>Either convert each side to meters before multiplying, or multiply first and divide by the squared factor. A bathroom 245 cm × 180 cm is 2.45 × 1.80 = 4.41 m², or 245 × 180 = 44,100 cm² ÷ 10,000 = 4.41 m². Builders' plans in millimeters work the same way with 1,000,000: 3,600 mm × 2,700 mm = 9,720,000 mm² = 9.72 m².</p>
<p>The trap is dividing by 100 instead of 10,000. A room measured as 420 × 350 cm is 147,000 cm²; dividing by 100 gives 1,470, which would be a small apartment block, not a bedroom. Choose your unit in the calculator and it converts each side for you.</p>`
    },
    {
      h2: 'How do you convert square feet to square meters?',
      html: `<p>Multiply square feet by 0.09290304, or divide by 10.7639. A 1,200 sq ft apartment is 111.48 m²; a 12 × 12 ft bedroom (144 sq ft) is 13.38 m². In the other direction, a 60 m² flat is 645.83 sq ft.</p>
<p>The factor is exact because the international foot has been defined as exactly 0.3048 m since 1959, and 0.3048² = 0.09290304. If you have feet-and-inches measurements of individual rooms, the <a href="/square-footage-calculator">square footage calculator</a> takes them directly and shows m² alongside.</p>`
    },
    {
      h2: 'How do you calculate square meters of walls for paint or tiles?',
      html: `<p>For walls, use the room's perimeter times its height, then take off doors and windows. A 4.2 × 3.5 m room with 2.4 m ceilings has a perimeter of 2 × (4.2 + 3.5) = 15.4 m, so the walls are 15.4 × 2.4 = 36.96 m². Subtract a standard door (about 2.0 × 0.8 m = 1.6 m²) and a 1.2 × 1.0 m window and 34.16 m² remains to paint. Paint coverage is quoted per liter (often around 10 m² per liter per coat), so check your tin and multiply by the number of coats.</p>
<p>For tiling a wall or floor, the <a href="/tile-calculator">tile calculator</a> turns the area into a tile count with grout joints and waste.</p>`
    },
    {
      h2: 'How do you find the area of a triangle or circle in square meters?',
      html: `<p>A triangular corner is half of base × height: a garden bed with a 3 m base and 2 m depth is 3 × 2 ÷ 2 = 3 m². A circle is π × radius²: a round patio 4 m across has a 2 m radius, so 3.1416 × 2 × 2 = 12.57 m². For larger plots, 10,000 m² is one hectare, and the <a href="/acreage-calculator">acreage calculator</a> handles four-sided lots of unequal length.</p>`
    }
  ],
  faq: [
    { q: 'How many square meters is a 3 x 4 room?', a: 'A 3 m × 4 m room is 12 square meters, or 129.17 square feet.' },
    { q: 'How do I convert cm to square meters?', a: 'You can\'t convert a single length to an area. Multiply length × width in cm, then divide by 10,000. 300 cm × 250 cm = 75,000 cm² = 7.5 m².' },
    { q: 'How many square feet are in a square meter?', a: 'One square meter is 10.764 square feet. One square foot is 0.0929 square meters.' },
    { q: 'Is m2 the same as square meters?', a: 'Yes. m² (often typed m2 or sqm) is the symbol for square meter, the SI unit of area.' },
    { q: 'How many square meters is 1,000 square feet?', a: '1,000 sq ft is 92.9 square meters.' },
    { q: 'How do I calculate square meters for flooring?', a: 'Multiply each room\'s length and width in meters, add the rooms, then add 5–10% for cutting waste before dividing by the m² per pack.' },
    { q: 'What is a square meter compared with a square yard?', a: 'A square meter is about 20% larger: 1 m² = 1.196 sq yd, and 1 sq yd = 0.836 m².' }
  ],
  related: ['square-footage-calculator', 'tile-calculator', 'flooring-calculator', 'acreage-calculator'],
  sources: [
    { name: 'NIST: Unit conversion (length and area)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI', url: 'https://www.nist.gov/pml/special-publication-811' }
  ]
};
