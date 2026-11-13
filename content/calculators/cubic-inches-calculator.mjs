export default {
  slug: 'cubic-inches-calculator',
  hub: 'everyday',
  name: 'Cubic Inches Calculator',
  title: 'Cubic Inches Calculator: 12 × 9 × 6 Box Is 648 in³ (0.375 ft³)',
  h1: 'Box Volume in Cubic Inches for Shipping: ft³, cm³, Cubic Tier and DIM Weight',
  meta: 'A 12 × 9 × 6 inch box is 648 cubic inches, or 0.375 cubic feet: USPS cubic tier 0.4 and a 5 lb dimensional weight at the 139 divisor. Measure any box.',
  keyword: 'how to calculate cubic inches for shipping',
  also: ['how to calculate cubic inch', 'how to calculate cubic inches of a box', 'cubic inches calculator', 'cubic inches of a box for shipping', 'box volume calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'len', label: 'Length (longest side)', type: 'number', value: 12 },
    { id: 'wid', label: 'Width', type: 'number', value: 9 },
    { id: 'ht', label: 'Height', type: 'number', value: 6 },
    { id: 'unit', label: 'Measured in', type: 'select', value: 'in', options: [['in', 'Inches'], ['cm', 'Centimeters'], ['ft', 'Feet']] },
    { id: 'qty', label: 'Number of boxes', type: 'number', value: 1, suffix: 'boxes' }
  ],
  compute(v, H) {
    var f = v.unit === 'cm' ? 1 / 2.54 : v.unit === 'ft' ? 12 : 1;
    if (!(v.len > 0 && v.wid > 0 && v.ht > 0)) return { error: 'Enter the length, width and height.' };
    var d = [v.len * f, v.wid * f, v.ht * f].sort(function (a, b) { return b - a; });
    var qty = v.qty >= 1 ? Math.floor(v.qty) : 1;
    var one = d[0] * d[1] * d[2];
    var vol = one * qty;
    var dn = d.map(function (x) { return Math.floor(x * 4 + 1e-9) / 4; });
    var cubicFt = dn[0] * dn[1] * dn[2] / 1728;
    var tier = (cubicFt <= 0.5 && dn[0] <= 22) ? Math.max(0.1, Math.ceil(cubicFt * 10 - 1e-9) / 10) : null;
    var up = d.map(function (x) { return Math.ceil(x - 1e-9); });
    var dimVol = up[0] * up[1] * up[2];
    var dimWt = Math.ceil(dimVol / 139 - 1e-9);
    var rows = [
      ['Cubic feet', H.num(vol / 1728, 3) + ' ft³', true],
      ['Cubic centimeters', H.int(vol * 16.387064) + ' cm³ (' + H.num(vol * 0.016387064, 2) + ' L)'],
      ['US gallons', H.num(vol / 231, 2) + ' gal']
    ];
    if (qty > 1) rows.unshift(['Each box', H.num(one, 2) + ' in³']);
    rows.push(['USPS Priority Mail Cubic tier', tier ? H.fix(tier, 1) + ' (' + H.num(cubicFt, 3) + ' ft³ after rounding down to ¼")' : 'not eligible (over 0.5 ft³ or longer than 22")']);
    rows.push(['Dimensional weight (÷139)', dimWt + ' lb per box' + (dimVol <= 1728 ? '; USPS applies it only above 1,728 in³' : '')]);
    rows.push(['Length + girth', H.num(d[0] + 2 * (d[1] + d[2]), 2) + ' in']);
    return {
      value: H.num(vol, 2) + ' in³',
      label: qty > 1 ? 'Total cubic inches, ' + qty + ' boxes' : 'Cubic inches',
      expr: H.num(d[0], 2) + ' × ' + H.num(d[1], 2) + ' × ' + H.num(d[2], 2) + (qty > 1 ? ' × ' + qty : '') + ' in',
      rows: rows,
      sub: 'Carriers measure the outside of the box, including bulges. Measure the same way so the quote matches the label.'
    };
  },
  quick: ({ r }) => `To calculate cubic inches for shipping, multiply the box's outside length × width × height in inches. A 12 × 9 × 6 inch box is <strong>${r.value}</strong>; divide by 1,728 for 0.375 cubic feet. That fits USPS Priority Mail Cubic tier 0.4, and at the common 139 divisor its dimensional weight is 648 ÷ 139 = 4.7, billed as 5 lb.`,
  stepsTitle: 'How to calculate cubic inches of a box',
  steps: [
    'Measure the outside of the packed box with a tape: length (the longest side), width and height. Include any bulge from overstuffing.',
    'Convert to inches if needed: centimeters ÷ 2.54, feet × 12.',
    'Multiply length × width × height. 12 × 9 × 6 = 648 cubic inches.',
    'Divide by 1,728 for cubic feet (12 × 12 × 12). <strong>Watch the rounding:</strong> USPS rounds each side down to the nearest ¼ inch for cubic pricing but up to the next whole inch for dimensional weight, so round the way your carrier does.'
  ],
  formulaTitle: 'What is the formula for cubic inches?',
  formula: {
    expr: 'Cubic inches = Length × Width × Height (in)<br>Cubic feet = in³ ÷ 1,728<br>cm³ = in³ × 16.387<br>Dimensional weight (lb) = in³ ÷ 139, rounded up',
    vars: [['1,728', 'cubic inches in a cubic foot (12³)'], ['16.387', 'cubic centimeters in a cubic inch (2.54³)'], ['139', 'dimensional weight divisor USPS uses for large parcels, also common for UPS and FedEx daily rates']]
  },
  example: `<p>You're shipping a pair of boots in a box measuring 13⅛ × 8⅞ × 5⅝ inches.</p>
<p>Volume = 13.125 × 8.875 × 5.625 = <strong>655.2 in³</strong> = 0.379 ft³.</p>
<p><strong>USPS cubic:</strong> round each side down to ¼": 13 × 8.75 × 5.5 = 625.6 in³ ÷ 1,728 = 0.362 ft³ → tier <strong>0.4</strong>.</p>
<p><strong>Dimensional weight:</strong> round each side up: 14 × 9 × 6 = 756 in³ ÷ 139 = 5.4 → <strong>6 lb</strong> at carriers that apply DIM pricing to this size.</p>`,
  table: {
    title: 'How many cubic inches are common shipping boxes?',
    intro: 'Volume, USPS cubic tier and dimensional weight for stock box sizes, computed by the calculator above.',
    head: ['Box (in)', 'Cubic inches', 'Cubic feet', 'USPS cubic tier', 'DIM weight ÷139'],
    rows: ({ run }) => [[6, 6, 6], [8, 6, 4], [9, 6, 3], [10, 8, 6], [12, 9, 6], [12, 12, 6], [14, 10, 8], [16, 12, 8], [12, 12, 12], [18, 12, 12], [18, 18, 18], [24, 18, 18]].map(([l, w, h]) => {
      const r = run({ len: l, wid: w, ht: h, unit: 'in', qty: 1 });
      const tier = r.rows.find(x => x[0].startsWith('USPS'))[1];
      return [l + ' × ' + w + ' × ' + h, r.value, r.rows[0][1], /^\d/.test(tier) ? tier.split(' ')[0] : '—', r.rows.find(x => x[0].startsWith('Dimensional'))[1].split(' per')[0]];
    }),
    note: 'USPS charges dimensional weight only on parcels over 1,728 in³ (1 ft³); UPS and FedEx can apply it to any size. Check your account\'s divisor; retail and negotiated rates can differ.'
  },
  sections: [
    {
      h2: 'How do you convert cubic inches to cubic feet, liters or gallons?',
      html: `<div class="twrap"><table><thead><tr><th>To convert cubic inches to</th><th>Do this</th><th>648 in³ becomes</th></tr></thead><tbody>
<tr><td>Cubic feet</td><td>÷ 1,728</td><td>0.375 ft³</td></tr>
<tr><td>Cubic centimeters</td><td>× 16.387</td><td>10,619 cm³</td></tr>
<tr><td>Liters</td><td>× 0.016387</td><td>10.62 L</td></tr>
<tr><td>US gallons</td><td>÷ 231</td><td>2.81 gal</td></tr>
<tr><td>Cubic yards</td><td>÷ 46,656</td><td>0.0139 yd³</td></tr>
</tbody></table></div>
<p>These follow from exact definitions: an inch is exactly 2.54 cm, and the U.S. gallon is defined as 231 cubic inches. For larger spaces like rooms or storage units, the <a href="/cubic-feet-calculator">cubic feet calculator</a> is easier.</p>`
    },
    {
      h2: 'What is USPS Priority Mail Cubic pricing?',
      html: `<p>Cubic pricing charges small, heavy Priority Mail parcels by size instead of weight. Under the USPS Domestic Mail Manual (section 223), it's available to commercial customers such as PC Postage users, for pieces that measure 0.5 cubic foot or less, weigh 20 lb or less and have no side longer than 22 inches.</p>
<p>USPS rounds each dimension <em>down</em> to the nearest ¼ inch, multiplies, divides by 1,728 and places the parcel in one of five tiers: 0.1, 0.2, 0.3, 0.4 or 0.5 cubic foot. The DMM's own example: 6⅛ × 5⅞ × 6⅜ inches rounds to 6 × 5¾ × 6¼ = 215.6 in³, which is 0.125 ft³ and lands in tier 0.2. A dense 15 lb box in tier 0.2 can cost far less than its weight-based price.</p>`
    },
    {
      h2: 'How does dimensional weight work?',
      html: `<p>Carriers bill large, light boxes by their size. Dimensional (DIM) weight = cubic inches ÷ a divisor, and you pay for the higher of actual or DIM weight. USPS rounds each side up to the next whole inch, applies DIM pricing only above 1,728 cubic inches, and uses a divisor of 139. UPS and FedEx publish their own divisors (139 is common for daily rates) and can apply DIM weight to any size box.</p>
<p>Example: a 16 × 12 × 8 box is 1,536 in³ ÷ 139 = 11.05, so 12 lb. If the contents weigh 4 lb, a carrier using DIM pricing bills 12 lb; repacking into a 14 × 10 × 8 box (1,120 in³) drops it to 9 lb. For full carrier comparisons, see the <a href="/dimensional-weight-calculator">dimensional weight calculator</a>.</p>`
    },
    {
      h2: 'How do you find cubic inches of a cylinder, a tube or an engine?',
      html: `<p>For a cylinder or tube: π × radius² × length. A mailing tube 3 inches across and 24 inches long is 3.1416 × 1.5² × 24 = 169.6 in³. Note that USPS cubic pricing excludes rolls and tubes, and carriers usually measure tubes as the box that would contain them (3 × 3 × 24 = 216 in³).</p>
<p>Engine size in cubic inches is a different job: bore² × 0.7854 × stroke × number of cylinders. The <a href="/engine-displacement-calculator">engine displacement calculator</a> handles that, including conversion to liters (61.02 in³ per liter).</p>`
    }
  ],
  faq: [
    { q: 'How many cubic inches are in a cubic foot?', a: '1,728, because a cubic foot is 12 × 12 × 12 inches.' },
    { q: 'How do I calculate the cubic inches of a box?', a: 'Multiply length × width × height in inches. A 12 × 9 × 6 box is 648 cubic inches.' },
    { q: 'How do I convert cubic centimeters to cubic inches?', a: 'Divide by 16.387. For example, 1,000 cm³ (one liter) is 61.02 cubic inches.' },
    { q: 'How many cubic inches are in a gallon?', a: 'A U.S. liquid gallon is defined as exactly 231 cubic inches. A cubic foot holds about 7.48 gallons.' },
    { q: 'Do carriers use inside or outside box dimensions?', a: 'Outside. USPS, UPS and FedEx measure the outside of the package, so measure the packed box, including any bulging sides.' },
    { q: 'Is a 12 × 12 × 12 box eligible for USPS cubic pricing?', a: 'No. It is 1,728 cubic inches, or 1 cubic foot, twice the 0.5 cubic foot limit. The largest cubic tier is 0.5 ft³, or 864 in³.' },
    { q: 'What is the dimensional weight of a 12 × 12 × 12 box?', a: '1,728 ÷ 139 = 12.4, which rounds up to 13 lb at the 139 divisor.' }
  ],
  related: ['cubic-feet-calculator', 'dimensional-weight-calculator', 'engine-displacement-calculator', 'cylinder-volume-calculator', 'candy-jar-calculator'],
  sources: [
    { name: 'USPS Domestic Mail Manual 223: Priority Mail (cubic pricing and dimensional weight)', url: 'https://pe.usps.com/text/dmm300/223.htm' },
    { name: 'UPS: Package dimensions and weight', url: 'https://www.ups.com/us/en/support/shipping-support/shipping-dimensions-weight.page' },
    { name: 'NIST: Unit conversion (volume)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' }
  ]
};
