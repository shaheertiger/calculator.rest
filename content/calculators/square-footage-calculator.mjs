export default {
  slug: 'square-footage-calculator',
  hub: 'construction',
  name: 'Square Footage Calculator',
  title: 'Square Footage Calculator: 3 Rooms in Ft + In = 488 Sq Ft',
  h1: 'Square Footage Calculator for Rooms, Homes and Odd Shapes',
  meta: 'Add each room in feet and inches for total square feet, square yards and m². Rooms of 15\'6" × 13\', 12\' × 11\'4" and 14\' × 10\'9" add up to 488 sq ft.',
  keyword: 'how is square footage calculated',
  also: ['how to calculate sq ft of a room', 'how to calculate a rooms square footage', 'how to calculate square footage with inches', 'how i calculate square feet', 'how do i calculate room square footage', 'how to calculate room area', 'how to calculate a room square footage', 'how do you calculate the square footage of a house', 'how to calculate square feet of irregular shape', 'how to calculate square feet of area'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'areas', label: 'Rooms or shapes', type: 'rows', addLabel: '+ add room or shape', max: 40,
      fields: [
        { id: 'name', label: 'Name (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. Bedroom' },
        { id: 'shape', label: 'Shape', type: 'select', value: 'rect', options: [['rect', 'Rectangle'], ['tri', 'Triangle (base × height ÷ 2)'], ['circle', 'Circle (length = diameter)'], ['minus', 'Subtract a cut-out']] },
        { id: 'lf', label: 'Length ft', type: 'number', value: 12 },
        { id: 'li', label: 'in', type: 'number', value: '', blank: true, placeholder: '0' },
        { id: 'wf', label: 'Width ft', type: 'number', value: 10 },
        { id: 'wi', label: 'in', type: 'number', value: '', blank: true, placeholder: '0' }
      ],
      value: [
        { name: 'Living room', shape: 'rect', lf: 15, li: 6, wf: 13, wi: '' },
        { name: 'Bedroom', shape: 'rect', lf: 12, li: '', wf: 11, wi: 4 },
        { name: 'Kitchen', shape: 'rect', lf: 14, li: '', wf: 10, wi: 9 }
      ]
    },
    { id: 'price', label: 'Price per sq ft (optional)', type: 'number', value: '', prefix: '$', placeholder: 'e.g. 4.50', help: 'Flooring, paint or sale price per square foot, to get a total cost.' }
  ],
  compute(v, H) {
    function n(x) { return typeof x === 'number' && isFinite(x) ? x : 0; }
    var total = 0, parts = [], rows = [], count = 0;
    (v.areas || []).forEach(function (a, i) {
      var L = n(a.lf) + n(a.li) / 12, W = n(a.wf) + n(a.wi) / 12, s = 0;
      if (!(L > 0)) return;
      if (a.shape === 'circle') s = Math.PI * L * L / 4;
      else if (!(W > 0)) return;
      else if (a.shape === 'tri') s = L * W / 2;
      else if (a.shape === 'minus') s = -L * W;
      else s = L * W;
      total += s; count++;
      parts.push((s < 0 ? '− ' : (parts.length ? '+ ' : '')) + H.num(Math.abs(s), 2));
      if (rows.length < 12) rows.push([(a.name ? H.esc(a.name) : 'Area ' + (i + 1)) + (a.shape === 'minus' ? ' (cut-out)' : ''), (s < 0 ? '−' : '') + H.num(Math.abs(s), 2) + ' sq ft']);
    });
    if (!count) return { error: 'Enter a length and width for at least one room.' };
    if (!(total > 0)) return { error: 'The cut-outs are larger than the rooms. Check the subtract rows.' };
    rows.push(['Square yards', H.num(total / 9, 2) + ' sq yd', true]);
    rows.push(['Square meters', H.num(total * 0.09290304, 2) + ' m²']);
    rows.push(['Acres', H.num(total / 43560, 4) + ' ac']);
    if (v.price > 0) rows.push(['Cost at ' + H.money(v.price) + '/sq ft', H.money(total * v.price), true]);
    return {
      value: H.num(total, 2) + ' sq ft',
      label: 'Total square footage',
      expr: parts.join(' ').slice(0, 80),
      rows: rows,
      sub: 'Reported to the nearest whole square foot, as listings and appraisals do: ' + H.int(total) + ' sq ft.'
    };
  },
  quick: ({ r }) => `Square footage is length times width in feet. A 15'6" × 13' living room is 15.5 × 13 = 201.5 sq ft; add a 12' × 11'4" bedroom (136 sq ft) and a 14' × 10'9" kitchen (150.5 sq ft) and the total is <strong>${r.value}</strong>, or 54.22 square yards and 45.34 m². Convert inches to feet (÷ 12) before you multiply.`,
  stepsTitle: 'How to calculate square footage, room by room',
  steps: [
    'Measure each room wall to wall at floor level, to the nearest inch. Write down the longest length and the widest width.',
    'Turn inches into decimal feet by dividing by 12: 4 in = 0.33 ft, 6 in = 0.5 ft, 9 in = 0.75 ft. This is the step most people get wrong; 11\'4" is 11.33 ft, not 11.4 ft.',
    'Multiply length × width for each rectangle. Split L-shaped rooms into two rectangles, or measure the full rectangle and add a “subtract” row for the notch.',
    'Add the rooms together. Use the triangle and circle shapes for angled walls, bay windows and round areas.',
    'Divide by 9 for square yards (carpet) or multiply by 0.0929 for square meters. Enter a price per square foot to see the total cost.'
  ],
  formulaTitle: 'What is the formula for square footage?',
  formula: {
    expr: 'Rectangle: Area = L × W<br>Triangle: Area = ½ × base × height<br>Circle: Area = π × (diameter ÷ 2)²<br>Feet + inches: L = feet + inches ÷ 12',
    vars: [['L, W', 'length and width in feet'], ['base, height', 'triangle side and the distance square to it'], ['π', '3.14159'], ['1 sq ft', '144 sq in = 0.0929 m²']],
    note: 'Total square footage is the sum of all shapes minus any cut-outs (a fireplace hearth, a stair opening, a closet you are not flooring).'
  },
  example: `<p>An apartment has a living room of 15'6" × 13'0", a bedroom of 12'0" × 11'4" and a kitchen of 14'0" × 10'9".</p>
<p>Convert the inches: 15'6" = 15.5 ft, 11'4" = 11.333 ft, 10'9" = 10.75 ft.</p>
<p>Living room 15.5 × 13 = <strong>201.5 sq ft</strong>. Bedroom 12 × 11.333 = <strong>136 sq ft</strong>. Kitchen 14 × 10.75 = <strong>150.5 sq ft</strong>.</p>
<p>Total = 201.5 + 136 + 150.5 = <strong>488 sq ft</strong> = 488 ÷ 9 = 54.22 sq yd = 488 × 0.0929 = 45.34 m². At $4.50 per square foot for vinyl plank, the material comes to $2,196 before waste.</p>`,
  table: {
    title: 'How many square feet is a room of each size?',
    intro: 'Common room dimensions worked out by the calculator, with square yards for carpet and square meters for metric plans.',
    head: ['Room size', 'Square feet', 'Square yards', 'Square meters', 'Typical use'],
    rows: ({ run, H }) => [[10, 10, 'Small bedroom, home office'], [10, 12, 'Secondary bedroom'], [12, 12, 'Bedroom'], [12, 14, 'Primary bedroom (small)'], [12, 16, 'Kitchen or den'], [14, 16, 'Primary bedroom'], [15, 20, 'Living room'], [16, 20, 'Family room'], [20, 20, 'Large great room'], [24, 24, 'Two-car garage'], [30, 40, 'Small ranch footprint']].map(([a, b, use]) => {
      const r = run({ areas: [{ name: '', shape: 'rect', lf: a, li: NaN, wf: b, wi: NaN }], price: NaN });
      return [a + ' × ' + b + ' ft', r.value, H.num(a * b / 9, 2), H.num(a * b * 0.09290304, 2), use];
    })
  },
  sections: [
    {
      h2: 'How do you calculate square footage with inches?',
      html: `<p>You have two clean options. The first is to convert each measurement to decimal feet before multiplying: divide the inches by 12 and add them to the feet. 13'8" becomes 13 + 8 ÷ 12 = 13.667 ft. The second is to work entirely in inches and divide the product by 144, because a square foot is 12 × 12 = 144 square inches. A room of 164 in × 136 in is 22,304 sq in ÷ 144 = 154.89 sq ft, the same answer as 13.667 × 11.333.</p>
<p>What you can't do is treat inches as a decimal. 11'4" is not 11.4 ft; it is 11.33 ft. On a 12-foot wall that slip adds 0.8 sq ft, and across a whole house it can add up to tens of square feet. Handy conversions:</p>
<ul><li>1 in = 0.083 ft · 2 in = 0.167 ft · 3 in = 0.25 ft</li><li>4 in = 0.333 ft · 6 in = 0.5 ft · 8 in = 0.667 ft</li><li>9 in = 0.75 ft · 10 in = 0.833 ft · 11 in = 0.917 ft</li></ul>
<p>The calculator has a separate inches box for each dimension, so you can type 11 and 4 and let it do the conversion.</p>`
    },
    {
      h2: 'How do you find the square footage of an L-shaped or irregular room?',
      html: `<p>Break the floor into simple shapes, find each area, and add them. An L-shaped family room that measures 20 ft along one wall and 16 ft along the other, with an 8 × 6 ft notch missing from one corner, can be done two ways:</p>
<ul><li><strong>Split it:</strong> a 20 × 10 ft rectangle (200 sq ft) plus a 12 × 6 ft rectangle (72 sq ft) = 272 sq ft.</li><li><strong>Subtract it:</strong> the full 20 × 16 ft box (320 sq ft) minus the 8 × 6 ft notch (48 sq ft) = 272 sq ft.</li></ul>
<p>Both give the same number; use whichever needs fewer measurements. For an angled wall, measure the rectangle up to where the angle starts and add a triangle (base × height ÷ 2). For a bay window, treat the bump-out as a trapezoid or as a rectangle plus two small triangles. For a round room or a circular patio, measure the diameter through the center and use π × r²: a 12-ft circle is 3.1416 × 6² = 113.1 sq ft.</p>
<p>Curved or freeform areas, such as a kidney-shaped pool deck, can be approximated by laying a grid of 1-ft or 2-ft squares over a sketch and counting full squares plus half of the partial ones.</p>`
    },
    {
      h2: 'How is the square footage of a house calculated?',
      html: `<p>For a house, the number on a listing or appraisal is usually <strong>finished, above-grade living area</strong> measured from the <em>outside</em> of the exterior walls, not the sum of room interiors. In the U.S., the reference method is ANSI Z765-2021, published by Home Innovation Research Labs, which Fannie Mae requires appraisers to use and Freddie Mac has also adopted. The main rules:</p>
<ul>
<li>Measure the exterior finished surface of the outside walls, floor by floor, to the nearest inch or tenth of a foot, and report the total to the nearest whole square foot.</li>
<li>Count only finished space: heated, with walls, floor and ceiling finished like the rest of the house.</li>
<li>Ceilings must be at least 7 ft high. In a room with a sloped ceiling, at least half of the finished area must reach 7 ft, and any part under 5 ft is left out.</li>
<li>Stairs count on the floor they descend from. Open-to-below areas such as a two-story foyer do not count on the upper level.</li>
<li>Garages, unfinished basements, porches and decks are excluded. A level that is any part below grade is reported separately as below-grade area, even if it is finished.</li>
</ul>
<p>That is why adding up your rooms with a tape measure normally comes out smaller than the listing: interior measurements leave out the thickness of exterior and interior walls, plus hallways and closets you may not have measured. A builder's or tax assessor's figure can differ again, because some count the garage or measure differently. When the number matters for a sale or a loan, ask which method was used.</p>`
    },
    {
      h2: 'How do you convert square feet to square yards, square meters and acres?',
      html: `<ul>
<li><strong>Square yards:</strong> divide by 9 (a yard is 3 ft, so a square yard is 3 × 3 = 9 sq ft). Carpet and some sod are still sold by the square yard: 488 sq ft is 54.22 sq yd.</li>
<li><strong>Square meters:</strong> multiply by 0.09290304, the exact factor that follows from 1 ft = 0.3048 m. 2,000 sq ft is 185.81 m². To go back, multiply square meters by 10.764.</li>
<li><strong>Acres:</strong> divide by 43,560. A 10,890 sq ft lot is exactly a quarter acre.</li>
<li><strong>Square inches:</strong> multiply by 144.</li>
</ul>
<p>For metric room measurements, the <a href="/square-meters-calculator">square meter calculator</a> takes meters and centimeters directly, and the <a href="/acreage-calculator">acreage calculator</a> handles lots with four unequal sides.</p>`
    },
    {
      h2: 'How do you work out cost per square foot?',
      html: `<p>It runs in both directions. To price a project, multiply the area by the rate: 488 sq ft of flooring at $4.50/sq ft is $2,196, before the 5–15% extra you buy for cuts (the <a href="/flooring-calculator">flooring calculator</a> adds that and rounds to whole boxes). To compare homes or rentals, divide the price by the area: a $389,000 house with 1,850 sq ft of living area sells for $389,000 ÷ 1,850 = <strong>$210.27 per sq ft</strong>.</p>
<p>Price per square foot is only meaningful when both homes were measured the same way. A listing that includes a finished basement in its total will look cheaper per square foot than one that reports above-grade area only, so compare like with like. Commercial leases add another wrinkle: rent is quoted per square foot per year and often on rentable area that includes a share of lobbies and corridors, which the <a href="/commercial-rent-calculator">commercial rent calculator</a> covers.</p>`
    }
  ],
  faq: [
    { q: 'How many square feet is a 12 x 12 room?', a: 'A 12 × 12 ft room is 144 square feet, which is 16 square yards or 13.38 square meters.' },
    { q: 'How do you calculate square footage of a room with a closet?', a: 'Measure the room and the closet as separate rectangles and add them. A 12 × 11 ft bedroom (132 sq ft) with a 2 × 6 ft closet (12 sq ft) is 144 sq ft of floor.' },
    { q: 'Do closets, hallways and stairs count in a home\'s square footage?', a: 'Yes, when they are finished and inside the heated envelope. Under ANSI Z765, closets and hallways are included, and stairs are counted on the level they descend from.' },
    { q: 'Is the garage included in square footage?', a: 'No. Garages are not part of finished living area under ANSI Z765 and appraisal practice, even if they are insulated. They are usually listed as a separate line.' },
    { q: 'Does a finished basement count as square footage?', a: 'It is reported separately as below-grade finished area. Any level that is partly below ground counts as below grade, so it is not added to the above-grade living area in an appraisal.' },
    { q: 'How do I calculate square footage in inches?', a: 'Multiply length × width in inches and divide by 144. A 30 × 60 inch area is 1,800 sq in ÷ 144 = 12.5 sq ft.' },
    { q: 'How many square meters is a 2,000 sq ft house?', a: 'A 2,000 sq ft house is about 185.8 square meters (2,000 × 0.0929).' },
    { q: 'How do I find the square footage of a circle?', a: 'Square the radius (half the diameter) and multiply by 3.1416. A circle 10 ft across has a 5 ft radius: 5 × 5 × 3.1416 = 78.54 sq ft.' }
  ],
  related: ['square-meters-calculator', 'flooring-calculator', 'acreage-calculator', 'countertop-square-footage-calculator', 'linear-feet-calculator'],
  sources: [
    { name: 'Home Innovation Research Labs: ANSI Z765-2021 Square Footage Method for Calculating', url: 'https://homeinnovation.com/z765' },
    { name: 'Home Innovation Research Labs: ANSI Z765 square footage standard FAQ', url: 'https://www.homeinnovation.com/services/national_standards/square_footage_method_standard_faq' },
    { name: 'NIST: Unit conversion (length and area)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' }
  ]
};
