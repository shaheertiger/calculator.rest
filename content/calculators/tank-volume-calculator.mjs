// Aquarium table for the static section (build time only).
const aq = [['10 gallon', 20, 10, 12], ['20 long', 30, 12, 12], ['29 gallon', 30, 12, 18], ['40 breeder', 36, 18, 16], ['55 gallon', 48, 13, 21], ['75 gallon', 48, 18, 21], ['125 gallon', 72, 18, 21]];
const aqTable = `<div class="twrap"><table><thead><tr><th>Tank</th><th>Outside size (L × W × H)</th><th>Gallons by formula</th><th>Water weight</th></tr></thead><tbody>${aq.map(([n, l, w, h]) => { const g = l * w * h / 231; return `<tr><td>${n}</td><td>${l} × ${w} × ${h} in</td><td>${g.toFixed(1)}</td><td>${Math.round(g * 8.34)} lb</td></tr>`; }).join('')}</tbody></table></div>`;

export default {
  slug: 'tank-volume-calculator',
  hub: 'construction',
  name: 'Tank Volume Calculator',
  title: 'Tank Volume Calculator: 48×72 in Tank Holds 564 Gallons',
  h1: 'Tank Volume Calculator: Gallons Full and at Any Fill Height',
  meta: 'A horizontal 48 × 72 in cylinder tank holds 564 gallons full and 371 gallons at 30 in deep. Gallons and liters for round, horizontal or box tanks.',
  keyword: 'how to calculate gallons in a tank',
  also: ['how to calculate a tank volume', 'how to calculate tank volume formula', 'how many gallons in a round tank calculator', 'how to calculate water tank capacity in litres', 'how to calculate tank capacity', 'how to calculate fish tank gallons', 'how to calculate gallons of a fish tank', 'horizontal tank volume calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'shape', label: 'Tank shape', type: 'select', value: 'hcyl', options: [['hcyl', 'Horizontal cylinder (lying down)'], ['vcyl', 'Vertical cylinder (standing)'], ['rect', 'Rectangular / fish tank']] },
    { id: 'unit', label: 'Units', type: 'select', value: 'in', options: [['in', 'inches'], ['ft', 'feet'], ['cm', 'centimeters'], ['m', 'meters']] },
    { id: 'diam', label: 'Inside diameter', type: 'number', value: 48, showIf: { shape: ['hcyl', 'vcyl'] } },
    { id: 'len', label: 'Length (horizontal) or height (vertical)', type: 'number', value: 72, showIf: { shape: ['hcyl', 'vcyl'] } },
    { id: 'rl', label: 'Length', type: 'number', value: 48, showIf: { shape: ['rect'] } },
    { id: 'rw', label: 'Width', type: 'number', value: 13, showIf: { shape: ['rect'] } },
    { id: 'rh', label: 'Height', type: 'number', value: 21, showIf: { shape: ['rect'] } },
    { id: 'fill', label: 'Liquid depth (blank = full)', type: 'number', value: 30, help: 'Measured straight down from the top of the liquid to the bottom of the tank, in the same units.' }
  ],
  compute(v, H) {
    var k = { 'in': 1, ft: 12, cm: 1 / 2.54, m: 39.37007874 }[v.unit] || 1;
    var u = v.unit || 'in';
    var full, part, depthMax, dims;
    var h = typeof v.fill === 'number' && v.fill >= 0 ? v.fill * k : NaN;
    if (v.shape === 'rect') {
      if (!(v.rl > 0) || !(v.rw > 0) || !(v.rh > 0)) return { error: 'Enter the inside length, width and height.' };
      var L = v.rl * k, W = v.rw * k; depthMax = v.rh * k;
      full = L * W * depthMax;
      if (!(h >= 0)) h = depthMax;
      if (h > depthMax + 1e-9) return { error: 'Liquid depth is more than the tank height.' };
      part = L * W * h;
      dims = H.num(v.rl, 2) + ' × ' + H.num(v.rw, 2) + ' × ' + H.num(v.rh, 2) + ' ' + u;
    } else {
      if (!(v.diam > 0) || !(v.len > 0)) return { error: 'Enter the inside diameter and the ' + (v.shape === 'vcyl' ? 'height' : 'length') + '.' };
      var r = v.diam * k / 2, len = v.len * k;
      full = Math.PI * r * r * len;
      depthMax = v.shape === 'vcyl' ? len : 2 * r;
      if (!(h >= 0)) h = depthMax;
      if (h > depthMax + 1e-9) return { error: 'Liquid depth is more than the tank ' + (v.shape === 'vcyl' ? 'height' : 'diameter') + '.' };
      if (v.shape === 'vcyl') part = Math.PI * r * r * h;
      else { var y = Math.min(h, 2 * r); part = (r * r * Math.acos((r - y) / r) - (r - y) * Math.sqrt(Math.max(0, 2 * r * y - y * y))) * len; }
      dims = H.num(v.diam, 2) + ' ' + u + ' dia × ' + H.num(v.len, 2) + ' ' + u;
    }
    var g = part / 231, gf = full / 231;
    var isFull = Math.abs(h - depthMax) < 1e-9;
    return {
      value: H.num(g, g < 100 ? 1 : 0) + ' gal',
      label: isFull ? 'Tank capacity (full)' : 'Liquid in the tank at ' + H.num(v.fill, 2) + ' ' + u + ' deep',
      expr: dims + (isFull ? '' : ' at ' + H.num(v.fill, 2) + ' ' + u),
      rows: [
        ['Full capacity', H.num(gf, gf < 100 ? 1 : 0) + ' gal', true],
        ['Percent full', H.pct(gf > 0 ? g / gf * 100 : 0, 1)],
        ['Liters', H.num(part * 0.016387064, 1)],
        ['Room left to fill', H.num(gf - g, gf < 100 ? 1 : 0) + ' gal'],
        ['Cubic feet', H.num(part / 1728, 2)],
        ['Weight if water', H.int(g * 8.34) + ' lb']
      ],
      sub: v.shape === 'hcyl' && !isFull ? 'A lying-down cylinder is not linear: the middle inches hold far more than the inches near the top and bottom.' : 'Volumes use inside dimensions. Measure inside, or subtract the wall thickness twice from outside measurements.'
    };
  },
  quick: ({ r }) => `To calculate gallons in a tank, find its volume in cubic inches and divide by 231. A horizontal cylinder 48 in across and 72 in long holds π × 24² × 72 = 130,288 cu in, or <strong>564 gallons</strong> full. Lying down, it isn't linear: at 30 in deep it holds <strong>${r.value}</strong> (65.7%). For a standing tank, gallons = diameter² × height × 0.0034.`,
  stepsTitle: 'How to calculate gallons in a tank',
  steps: [
    'Pick the shape: a cylinder standing on end, a cylinder lying on its side, or a rectangular box.',
    'Measure the <strong>inside</strong> diameter and length, or inside length, width and height. Using outside dimensions on a thick-walled poly or concrete tank overstates the capacity.',
    'Work out the volume in cubic inches: π × radius² × length for a cylinder, length × width × height for a box.',
    'Divide cubic inches by 231 for U.S. gallons, or multiply by 0.016387 for liters. In feet, multiply cubic feet by 7.48.',
    'For a partly full tank, measure the liquid depth with a dipstick. Standing tanks and boxes scale straight with depth; horizontal tanks need the circular-segment formula, which the calculator applies.'
  ],
  formulaTitle: 'What is the tank volume formula?',
  formula: {
    expr: 'Vertical cylinder: V = π r² h &nbsp; Box: V = L × W × h<br>Horizontal cylinder at depth h: V = L × [r² acos((r − h) ÷ r) − (r − h)√(2rh − h²)]<br>Gallons = cubic inches ÷ 231 &nbsp; Liters = cubic inches × 0.016387',
    vars: [['r', 'inside radius (half the diameter)'], ['h', 'liquid depth, or full height'], ['L', 'tank length'], ['231', 'cubic inches in one U.S. gallon']]
  },
  example: `<p>A steel tank lies on its side: 48 in inside diameter, 72 in long, with a dipstick reading of 30 in.</p>
<p>Full volume: π × 24² × 72 = 130,288 cu in ÷ 231 = <strong>564 gallons</strong>.</p>
<p>Partial: r = 24, h = 30, so r − h = −6. Segment area = 24² × acos(−0.25) + 6 × √(2 × 24 × 30 − 30²) = 576 × 1.8235 + 6 × 23.24 = 1,189.7 sq in. Volume = 1,189.7 × 72 = 85,662 cu in ÷ 231 = <strong>371 gallons</strong>, or 65.7% full, even though the dipstick reads 62.5% of the diameter.</p>`,
  table: {
    title: 'What does a tank dip chart look like?',
    intro: 'Gallons in the 48-in × 72-in horizontal tank above at each 4 in of liquid depth, calculated with the segment formula. Make your own chart by entering your tank and stepping the depth.',
    head: ['Liquid depth', 'Gallons', 'Percent full'],
    rows: ({ run }) => [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48].map(d => { const r = run({ shape: 'hcyl', unit: 'in', diam: 48, len: 72, fill: d }); return [d + ' in', r.value, r.rows[1][1]]; }),
    note: 'At half depth (24 in) the tank is exactly half full; the bottom 4 inches hold only about 22 gallons, while 4 inches across the middle hold about 60.'
  },
  sections: [
    {
      h2: 'How many gallons are in a round tank?',
      html: `<p>For a cylinder standing upright, gallons = diameter² × height × 0.0034 with both in inches (0.0034 is π ÷ 4 ÷ 231). A 30-in-wide, 60-in-tall water heater-style tank: 30² × 60 × 0.0034 ≈ 184 gallons. In feet, use diameter² × height × 5.875: a 12-ft-wide, 8-ft-tall water storage tank holds 12² × 8 × 5.875 = 6,768 gallons.</p>
<p>Round livestock tanks and rain barrels work the same way, using the water depth rather than the rim height.</p>`
    },
    {
      h2: 'How do you calculate water tank capacity in liters?',
      html: `<p>Measure in centimeters and divide cubic centimeters by 1,000, or measure in meters and multiply cubic meters by 1,000. A vertical tank 1.2 m across and 1.8 m tall holds π × 0.6² × 1.8 = 2.036 m³ = <strong>2,036 liters</strong> (538 U.S. gallons). Switch the units box to cm or m and the calculator does the conversion.</p>`
    },
    {
      h2: 'How many gallons is my fish tank?',
      html: `<p>Multiply length × width × height in inches and divide by 231. Standard aquarium names are based on these outside dimensions:</p>${aqTable}
<p>The water inside is less than the formula says: glass thickness, the gap below the rim, substrate and decorations all take up space. Use the formula number for the stand and floor load (water weighs 8.34 lb per gallon, before glass and gravel) and a lower figure for dosing medication.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate the gallons in a horizontal tank that is partly full?', a: 'Measure the liquid depth and use the circular-segment formula: V = L × [r² acos((r − h)/r) − (r − h)√(2rh − h²)], then divide cubic inches by 231. The calculator does it for you when you choose a horizontal cylinder.' },
    { q: 'How many gallons per inch are in a tank?', a: 'In a vertical tank or box it is constant: diameter² × 0.0034 per inch of depth for a cylinder, or length × width ÷ 231 for a box. In a horizontal tank it changes with depth, which is why oil and fuel tanks come with dip charts.' },
    { q: 'How many gallons are in a 1,000-liter tank?', a: '1,000 liters is 264.2 U.S. gallons. In the U.S., IBC totes are most often sold as 275 gal (about 1,040 L) or 330 gal (about 1,250 L).' },
    { q: 'How many gallons is a 55-gallon drum, really?', a: 'A standard steel drum is about 22.5 in inside diameter and 33.5 in tall, which works out to roughly 57–58 gallons brimful; the 55-gallon rating leaves headspace.' },
    { q: 'How do I find the volume of a tank in cubic feet?', a: 'Measure in feet and multiply π × r² × length for a cylinder or L × W × H for a box. Multiply cubic feet by 7.48 for gallons. The calculator also lists cubic feet in the results.' },
    { q: 'How much does a full water tank weigh?', a: 'Water weighs about 8.34 lb per gallon, so a 564-gallon tank holds about 4,700 lb of water, plus the tank itself. Check that the floor, slab or stand is rated for it.' }
  ],
  related: ['pipe-volume-calculator', 'pool-volume-calculator', 'cubic-feet-calculator', 'pool-chlorine-calculator'],
  sources: [
    { name: 'NIST Office of Weights and Measures: Handbook 44, Appendix C (1 gallon = 231 cubic inches)', url: 'https://www.nist.gov/pml/owm/owm-products-and-services/publications-and-documentary-standards/handbooks' },
    { name: 'NIST: SI units of volume (liter and cubic meter)', url: 'https://www.nist.gov/pml/owm/si-units-volume' }
  ]
};
