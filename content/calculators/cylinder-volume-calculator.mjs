export default {
  slug: 'cylinder-volume-calculator',
  hub: 'math',
  name: 'Cylinder Volume Calculator',
  title: 'Cylinder Volume Calculator: 12 × 24 in = 2,714 in³ (11.75 gal)',
  h1: 'Volume of a Cylinder Calculator: Cubic Units, Gallons, Liters and Surface Area',
  meta: 'A 12-inch-wide, 24-inch-tall cylinder holds π × 6² × 24 = 2,714.34 cubic inches, or 11.75 US gallons. Get volume, gallons, liters, surface area and weight.',
  keyword: 'how to calculate volume for cylinder',
  also: ['cylinder volume calculator', 'volume of a cylinder calculator', 'how to calculate mass of a cylinder', 'how to calculate mass of cylinder', 'how to calculate weight of cylinder', 'how to calculate the weight of a cylinder', 'how do you calculate the weight of a cylinder', 'how to calculate cylinder weight', 'how to calculate density of a cylinder'],
  updated: '2026-11-13',
  inputs: [
    { id: 'dimType', label: 'Across the circle, I have the', type: 'select', value: 'd', options: [['d', 'Diameter'], ['r', 'Radius']] },
    { id: 'size', label: 'Diameter or radius', type: 'number', value: 12 },
    { id: 'height', label: 'Height (or length)', type: 'number', value: 24 },
    { id: 'unit', label: 'Unit', type: 'select', value: 'in', options: [['in', 'inches'], ['ft', 'feet'], ['yd', 'yards'], ['mm', 'millimeters'], ['cm', 'centimeters'], ['m', 'meters']] },
    { id: 'material', label: 'Weight if solid or filled with', type: 'select', value: 'none', options: [['none', 'Skip weight'], ['1000', 'Water (≈1,000 kg/m³)'], ['2400', 'Concrete (≈2,400 kg/m³)'], ['2700', 'Aluminum (≈2,700 kg/m³)'], ['7850', 'Steel (≈7,850 kg/m³)']] }
  ],
  data: { m: { in: 0.0254, ft: 0.3048, yd: 0.9144, mm: 0.001, cm: 0.01, m: 1 } },
  compute(v, H, D) {
    if (!(v.size > 0) || !(v.height > 0)) return { error: 'Enter a diameter (or radius) and a height greater than 0.' };
    var L = D.m[v.unit] || 0.0254, u = v.unit;
    function f(x, dp) { return x >= 1e15 || (x < 1 && x > 0) ? H.sig(x, 4) : H.num(x, dp === undefined ? 2 : dp); }
    var r = v.dimType === 'r' ? v.size : v.size / 2, h = v.height;
    var base = Math.PI * r * r, vol = base * h;
    var m3 = vol * L * L * L;
    var gal = m3 / 0.003785411784, liters = m3 * 1000;
    var lateral = 2 * Math.PI * r * h, total = lateral + 2 * base;
    var rows = [['US gallons', f(gal) + ' gal', true], ['Liters', f(liters) + ' L']];
    if (u !== 'in') rows.push(['Cubic inches', f(m3 / 1.6387064e-5) + ' in³']);
    if (u !== 'ft') rows.push(['Cubic feet', f(m3 / 0.028316846592, 4) + ' ft³']);
    if (u === 'ft' || u === 'yd') rows.push(['Cubic yards', f(m3 / 0.764554857984, 4) + ' yd³']);
    if (u === 'mm' || u === 'cm') rows.push(['Cubic meters', f(m3, 6) + ' m³']);
    rows.push(['Base area (πr²)', f(base) + ' ' + u + '²']);
    rows.push(['Side (lateral) area', f(lateral) + ' ' + u + '²']);
    rows.push(['Total surface area', f(total) + ' ' + u + '²']);
    if (v.material !== 'none') {
      var kg = m3 * Number(v.material);
      rows.push(['Weight (' + (v.material === '1000' ? 'water' : v.material === '2400' ? 'concrete' : v.material === '2700' ? 'aluminum' : 'steel') + ')', f(kg / 0.45359237) + ' lb (' + f(kg) + ' kg)', true]);
    }
    return {
      value: f(vol) + ' ' + u + '³', label: 'Volume of the cylinder',
      expr: 'π × ' + H.num(r, 4) + '² × ' + H.num(h, 4),
      rows: rows,
      sub: 'Radius ' + H.num(r, 4) + ' ' + u + (v.dimType === 'd' ? ' (half the ' + H.num(v.size, 4) + ' ' + u + ' diameter)' : '') + '.'
    };
  },
  quick: ({ r }) => `To calculate the volume of a cylinder, multiply π by the radius squared and then by the height: V = πr²h. A cylinder 12 inches across (radius 6) and 24 inches tall holds π × 6² × 24 = <strong>${r.value}</strong>, which is 11.75 US gallons or 44.48 liters. Always halve the diameter first.`,
  stepsTitle: 'How to calculate the volume of a cylinder',
  steps: [
    'Measure across the circular end. If you measured the full width (diameter), halve it to get the radius. Using the diameter as the radius makes the answer four times too big, the most common cylinder mistake.',
    'Square the radius and multiply by π (3.14159) to get the area of the circular base.',
    'Multiply the base area by the height (or length, for a cylinder lying on its side). Keep every measurement in the same unit.',
    'Convert if you need to: divide cubic inches by 231 for US gallons, multiply cubic feet by 7.48052, or divide cubic centimeters by 1,000 for liters.'
  ],
  formulaTitle: 'What is the formula for the volume of a cylinder?',
  formula: {
    expr: 'V = π × r² × h = π × (d ÷ 2)² × h<br>Lateral area = 2πrh &nbsp;·&nbsp; Total surface = 2πrh + 2πr²<br>Weight = V × density',
    vars: [['r', 'radius of the circular end'], ['d', 'diameter (d = 2r)'], ['h', 'height, or length if the cylinder lies down'], ['π', '3.14159…']],
    note: 'Unit conversions used: 1 US gallon = 231 in³ = 3.785411784 L exactly; 1 ft³ = 1,728 in³ ≈ 7.48052 gal; 1 in = 2.54 cm exactly.'
  },
  example: `<p>A water tank is 12 inches in diameter and 24 inches tall.</p>
<p>Radius = 12 ÷ 2 = 6 in. Base area = π × 6² = 113.10 sq in. Volume = 113.10 × 24 = <strong>2,714.34 cubic inches</strong>.</p>
<p>Gallons = 2,714.34 ÷ 231 = <strong>11.75 gal</strong>. Full of water (about 8.34 lb per gallon), it weighs roughly 98 lb plus the tank.</p>`,
  table: {
    title: 'How many gallons per foot are in a cylinder of each diameter?',
    intro: 'Capacity of each foot of height (or length), computed by the calculator above. Handy for wells, columns, drums and round tanks.',
    head: ['Inside diameter', 'Gallons per foot', 'Gallons per inch', 'Cubic feet per foot'],
    rows: ({ run }) => [1, 2, 3, 4, 6, 8, 10, 12, 18, 24, 36, 48, 60].map(d => { const o = run({ dimType: 'd', size: d, height: 12, unit: 'in', material: 'none' }), i = run({ dimType: 'd', size: d, height: 1, unit: 'in', material: 'none' }); return [d + ' in', o.rows[0][1].replace(' gal', ''), i.rows[0][1].replace(' gal', ''), o.rows.find(x => x[0] === 'Cubic feet')[1].replace(' ft³', '')]; }),
    note: 'Gallons scale with the square of the diameter: a 6-inch well holds 1.47 gallons per foot, four times as much as a 3-inch one.'
  },
  sections: [
    {
      h2: 'How do you calculate the volume of a cylinder in gallons?',
      html: `<p>Work out the volume in cubic inches and divide by 231, or in cubic feet and multiply by 7.48052. For metric measurements, cubic centimeters ÷ 1,000 gives liters.</p>
<p>A steel drum roughly 22.5 inches across and 33.5 inches tall works out to π × 11.25² × 33.5 = 13,319.9 cubic inches, or about 57.7 gallons. Drums like this are sold as 55-gallon drums because the nominal capacity leaves headspace and the inside dimensions are a little smaller than the outside.</p>
<p>For a cylinder lying on its side and only partly full, the math needs the liquid depth; the <a href="/tank-volume-calculator">tank volume calculator</a> handles horizontal and partial fills.</p>`
    },
    {
      h2: 'How do you calculate the weight of a cylinder?',
      html: `<p>Multiply the volume by the density of the material. A solid steel bar 2 inches in diameter and 12 inches long has a volume of π × 1² × 12 = 37.70 cubic inches. Steel at about 7,850 kg/m³ is 0.2836 lb per cubic inch, so the bar weighs 37.70 × 0.2836 ≈ <strong>10.7 lb</strong>.</p>
<p>Densities vary by alloy and mix: aluminum is about 2,700 kg/m³, normal-weight concrete about 2,400 kg/m³, and fresh water about 1,000 kg/m³ (8.34 lb per gallon). Choose a material above to get the weight in pounds and kilograms. For a hollow tube, subtract the inner cylinder's volume from the outer one before multiplying.</p>`
    },
    {
      h2: 'How do you find the density of a cylinder?',
      html: `<p>Weigh it, calculate its volume, and divide mass by volume. A 500 g metal cylinder 4 cm across and 15 cm tall has a volume of π × 2² × 15 = 188.5 cm³, so its density is 500 ÷ 188.5 = <strong>2.65 g/cm³</strong>, close to aluminum's 2.70. This is a standard lab exercise; the <a href="/density-calculator">density calculator</a> solves for any one of mass, volume or density.</p>`
    },
    {
      h2: 'How do you calculate the surface area of a cylinder?',
      html: `<p>The side unrolls into a rectangle whose width is the circumference: lateral area = 2πrh. Each end is a circle of area πr². For the 12 × 24-inch example, the side is 2π × 6 × 24 = 904.78 sq in and the two ends add 2 × 113.10 = 226.19 sq in, for <strong>1,130.97 sq in</strong> in total.</p>
<p>Use the side area alone for a label or wrap, and the total for painting or insulating a closed tank. In Excel, volume is <code>=PI()*(A2/2)^2*B2</code> with the diameter in A2 and height in B2; surface area is <code>=PI()*A2*B2+PI()*A2^2/2</code>.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for the volume of a cylinder?', a: 'V = πr²h: pi times the radius squared times the height. With a diameter, use V = π × (d ÷ 2)² × h.' },
    { q: 'What is the volume of a cylinder with radius 3 and height 5?', a: 'V = π × 3² × 5 = 45π ≈ 141.37 cubic units.' },
    { q: 'How many gallons are in a cubic foot?', a: 'One cubic foot holds about 7.48052 US gallons (1,728 ÷ 231). One US gallon is exactly 231 cubic inches.' },
    { q: 'How do you find the height of a cylinder from its volume?', a: 'Divide the volume by the base area: h = V ÷ (πr²). A 10-gallon (2,310 in³) cylinder with a 5-inch radius must be 2,310 ÷ 78.54 = 29.4 inches tall.' },
    { q: 'How much concrete fills a round column form?', a: 'A 12-inch tube 4 feet tall holds π × 0.5² × 4 = 3.14 cubic feet, or 0.116 cubic yards. The concrete calculator adds waste and bag counts.' },
    { q: 'How is a cone\'s volume related to a cylinder\'s?', a: 'A cone with the same base and height holds exactly one third as much: V = πr²h ÷ 3.' }
  ],
  related: ['circle-calculator', 'tank-volume-calculator', 'pipe-volume-calculator', 'density-calculator', 'concrete-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Cylinder', url: 'https://mathworld.wolfram.com/Cylinder.html' },
    { name: 'NIST Handbook 44, Appendix C: General Tables of Units of Measurement', url: 'https://www.nist.gov/pml/owm/nist-handbook-44-current-edition' },
    { name: 'USGS Water Science School: Water Density', url: 'https://www.usgs.gov/special-topics/water-science-school/science/water-density' }
  ]
};
