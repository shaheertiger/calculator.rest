export default {
  slug: 'countertop-square-footage-calculator',
  hub: 'construction',
  name: 'Countertop Square Footage Calculator',
  title: 'Countertop Square Footage Calculator: L + Island = 60.5 Sq Ft',
  h1: 'Countertop Calculator: Square Feet and Cost From Inch Measurements',
  meta: 'Measure each countertop piece in inches to get square feet and cost. A 120" and 84" L-run at 25.5" deep, a 72" × 36" island and a 4" backsplash total 60.5 sq ft.',
  keyword: 'how do you calculate square footage of a countertop',
  also: ['how do you calculate countertop square footage', 'how do you calculate square footage for countertops', 'how to calculate countertop square footage', 'how to calculate square feet of countertop', 'how to calculate square footage for countertops', 'how to calculate square feet for countertops', 'how to calculate square feet of a countertop', 'how to calculate countertop sq ft', 'how to calculate marble in square feet'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'pieces', label: 'Countertop pieces (inches)', type: 'rows', addLabel: '+ add piece', max: 20,
      fields: [
        { id: 'name', label: 'Piece (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. Sink run' },
        { id: 'l', label: 'Length in', type: 'number', value: 96 },
        { id: 'd', label: 'Depth in', type: 'number', value: 25.5 }
      ],
      value: [
        { name: 'Sink wall (full length)', l: 120, d: 25.5 },
        { name: 'Side run (from front edge)', l: 84, d: 25.5 },
        { name: 'Island', l: 72, d: 36 }
      ]
    },
    { id: 'bsLen', label: 'Backsplash length', type: 'number', value: 229.5, suffix: 'in', help: 'Total length along the walls. 0 for none.' },
    { id: 'bsHt', label: 'Backsplash height', type: 'number', value: 4, suffix: 'in', help: '4 in is standard; full height is often 18 in.' },
    { id: 'price', label: 'Installed price per sq ft (optional)', type: 'number', value: '', prefix: '$', placeholder: 'from your quote' }
  ],
  compute(v, H) {
    var sqin = 0, rows = [], k = 0;
    (v.pieces || []).forEach(function (p, i) {
      if (!(p.l > 0) || !(p.d > 0)) return;
      var a = p.l * p.d; sqin += a; k++;
      if (rows.length < 10) rows.push([(p.name ? H.esc(p.name) : 'Piece ' + (i + 1)), H.num(a / 144, 2) + ' sq ft']);
    });
    if (!k) return { error: 'Enter the length and depth of at least one piece in inches.' };
    var bs = v.bsLen > 0 && v.bsHt > 0 ? v.bsLen * v.bsHt : 0;
    var top = sqin / 144, back = bs / 144, total = top + back;
    if (back > 0) rows.push(['Backsplash', H.num(back, 2) + ' sq ft']);
    rows.push(['Countertop surface only', H.num(top, 2) + ' sq ft', true]);
    rows.push(['Square meters', H.num(total * 0.09290304, 2) + ' m²']);
    if (v.price > 0) rows.push(['Estimated cost at ' + H.money(v.price) + '/sq ft', H.money(total * v.price), true]);
    return {
      value: H.num(total, 2) + ' sq ft',
      label: 'Total countertop square footage',
      expr: H.num(sqin + bs, 1) + ' sq in ÷ 144',
      rows: rows,
      sub: 'Sink and cooktop cutouts are not subtracted: fabricators price the full slab area they cut from.'
    };
  },
  quick: ({ r }) => `To calculate countertop square footage, multiply each piece's length by its depth in inches and divide by 144. An L-shaped kitchen with a 120 × 25.5 in run (21.25 sq ft), an 84 × 25.5 in run (14.88 sq ft) and a 72 × 36 in island (18 sq ft) is 54.13 sq ft; a 4-inch backsplash adds 6.38, for <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate countertop square footage',
  steps: [
    'Split the countertop into rectangles: each straight run, the island, any peninsula or bar top.',
    'Measure each length along the wall and each depth from the wall to the front edge, in inches, including the overhang. Standard counters are 25 to 25½ in deep.',
    'In an L or U, measure one run to the wall and the next only from the front edge of the first, so the corner square isn\'t counted twice. Double-counting the corner is the most common error.',
    'Multiply length × depth for each piece, add them and divide by 144. Add backsplash as length × height ÷ 144, then multiply by the price per square foot.'
  ],
  formulaTitle: 'What is the formula for countertop square footage?',
  formula: {
    expr: 'Square feet = Σ (length in × depth in) ÷ 144<br>Backsplash sq ft = backsplash length in × height in ÷ 144<br>Cost = total sq ft × price per sq ft',
    vars: [['length, depth', 'piece dimensions in inches, including overhang'], ['144', 'square inches in one square foot'], ['Σ', 'sum over all pieces']]
  },
  example: `<p>The default kitchen: the sink wall runs 120 in along the back wall, including the corner. The side run is 84 in measured from the front edge of the sink run, so the corner isn't counted twice. Both are 25.5 in deep. The island is 72 × 36 in.</p>
<p>Sink run 120 × 25.5 = 3,060 sq in. Side run 84 × 25.5 = 2,142 sq in. Island 72 × 36 = 2,592 sq in. Total 7,794 sq in ÷ 144 = <strong>54.13 sq ft</strong>.</p>
<p>Backsplash: 120 in on the back wall plus 25.5 + 84 = 109.5 in on the side wall is 229.5 in × 4 in = 918 sq in = 6.38 sq ft. Total = <strong>60.5 sq ft</strong>. At an example installed price of $60 per sq ft, that is $3,630.</p>`,
  table: {
    title: 'How many square feet are common countertop pieces?',
    intro: 'Square feet for standard depths, computed by the calculator from length × depth ÷ 144.',
    head: ['Length', '25.5 in deep (base cabinets)', '30 in deep', '36 in deep (island)', '42 in deep (seating island)'],
    rows: ({ run }) => [24, 36, 48, 60, 72, 84, 96, 108, 120, 144].map(L => [L + ' in (' + (L / 12) + ' ft)', ...[25.5, 30, 36, 42].map(d => run({ pieces: [{ name: '', l: L, d: d }], bsLen: 0, bsHt: 0, price: NaN }).value)])
  },
  sections: [
    {
      h2: 'How do you measure an L-shaped or U-shaped countertop?',
      html: `<p>Pick one run and measure it the full length to the wall, corner included. Measure each run that meets it only from the <em>front edge</em> of the first run to its own end. If you measure both legs of an L along the wall, the corner square (25.5 × 25.5 in = 4.5 sq ft) gets counted twice, and a U-shape doubles two corners, overstating the total by 9 sq ft.</p>
<p>Include every overhang in the depth: the 1–1½ in past the cabinet face, and the extra depth where an island or peninsula has seating. Measure where the counter will end, not the cabinet box. For a peninsula that turns off a wall run, treat it as another leg measured from the front edge.</p>`
    },
    {
      h2: 'Do you subtract the sink or cooktop cutout?',
      html: `<p>No. Stone and quartz fabricators cut the whole top from a slab, so the cutout area is still material you pay for, and most charge a separate fee for each sink, cooktop or faucet hole. Laminate tops are priced the same way. Solid-surface sinks that are molded into the top are priced as part of the counter.</p>
<p>Fabricators also think in slabs, not just square feet. Slabs come in fixed sizes (they vary by material and brand), and seams, grain direction and how the pieces nest on the slab can mean buying more stone than your measured area. For quartz and granite, the square footage here is the number to compare quotes; the fabricator's layout decides how many slabs you buy.</p>`
    },
    {
      h2: 'What are standard countertop depth, height and backsplash sizes?',
      html: `<ul>
<li><strong>Depth:</strong> base cabinets are 24 in deep, and the counter overhangs the front by about 1 to 1½ in, so most counters are 25 to 25½ in deep.</li>
<li><strong>Height:</strong> 36 in finished height for kitchen counters; bathroom vanities are commonly 32 to 36 in.</li>
<li><strong>Backsplash:</strong> a 4-in splash is the common standard. Full-height backsplashes run to the wall cabinets, usually about 18 in.</li>
<li><strong>Island seating:</strong> the NKBA's planning guidelines call for knee space of about 15 in deep at 36-in counter height and 12 in at 42-in bar height, which is why seating islands are often 36 to 42 in deep or more.</li>
</ul>
<p>If your backsplash will be tile instead of slab, leave its length at 0 here and size it with the <a href="/tile-calculator">tile calculator</a>.</p>`
    },
    {
      h2: 'How do you estimate countertop cost from square feet?',
      html: `<p>Multiply total square feet (top plus slab backsplash) by the installed price per square foot from your quote. Then add what is priced separately: sink and cooktop cutouts, edge profiles beyond the standard eased edge, removal of old tops, and plumbing reconnects. Prices differ widely by material, region and fabricator, so get the per-square-foot figure from a local quote rather than a national average. If a quote is by the linear foot instead, divide it by the depth in feet: $150 per linear foot at 25.5 in deep is $150 ÷ 2.125 = $70.59 per sq ft.</p>`
    }
  ],
  faq: [
    { q: 'How many square feet is a standard countertop?', a: 'Each foot of standard 25.5-inch-deep counter is 2.125 sq ft. A 10-ft run is 21.25 sq ft; a typical kitchen with an island often lands between 40 and 70 sq ft.' },
    { q: 'How do you convert countertop inches to square feet?', a: 'Multiply length × depth in inches and divide by 144. A 96 × 25.5 in counter is 2,448 sq in ÷ 144 = 17 sq ft.' },
    { q: 'Does countertop square footage include the backsplash?', a: 'Only if the backsplash is made from the same slab. A 4-inch slab backsplash adds 1 sq ft for every 3 ft of wall; tile backsplashes are priced separately.' },
    { q: 'How many square feet is a 3x6 island?', a: 'A 3 × 6 ft island top is 18 sq ft; a 36 × 72 inch top is 2,592 sq in ÷ 144 = 18 sq ft.' },
    { q: 'Should I add extra for countertop waste?', a: 'For your own estimate, quote the measured area. The fabricator adds waste through the slab layout; if you buy slabs yourself, expect 10–20% beyond the measured area depending on seams and pattern.' },
    { q: 'How deep is a standard kitchen countertop?', a: 'About 25 to 25.5 inches: 24-inch base cabinets plus a 1 to 1.5-inch front overhang.' },
    { q: 'How do I calculate square footage of a curved or rounded countertop?', a: 'Measure the full rectangle that contains the curve and use that; fabricators cut curves from rectangular stock, so the rectangle is what you pay for.' }
  ],
  related: ['square-footage-calculator', 'tile-calculator', 'flooring-calculator', 'linear-feet-calculator'],
  sources: [
    { name: 'National Kitchen & Bath Association (NKBA): Kitchen and bath planning guidelines', url: 'https://nkba.org/' },
    { name: 'NIST: Unit conversion (area)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' }
  ]
};
