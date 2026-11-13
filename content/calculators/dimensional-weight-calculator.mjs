export default {
  slug: 'dimensional-weight-calculator',
  hub: 'business',
  name: 'Dimensional Weight Calculator',
  title: 'Dimensional Weight Calculator: 18×14×12 Box Bills at 22 lb',
  h1: 'Dimensional Weight Calculator for UPS, FedEx, USPS and Air Freight',
  meta: 'An 18 × 14 × 12 in box is 3,024 cubic inches ÷ 139 = 22 lb dimensional weight, so a 10 lb item bills at 22 lb. Uses 2026 UPS, FedEx and USPS rules.',
  keyword: 'how to calculate dimensional weight',
  also: ['dimensional weight calculator', 'dim weight calculator', 'how to calculate dimensional weight in kg', 'how to calculate chargeable weight'],
  updated: '2026-11-13',
  inputs: [
    { id: 'rule', label: 'Carrier rule', type: 'select', value: 'ups', wide: true, options: [['ups', 'UPS / FedEx daily rates: ÷ 139 (in, lb)'], ['usps', 'USPS from Jul 12, 2026: ÷ 139 over 1,728 in³'], ['r166', '÷ 166 (UPS retail rates; USPS before Jul 12, 2026)'], ['intl', 'International express: ÷ 5,000 (cm, kg)'], ['air', 'Air cargo chargeable weight: ÷ 6,000 (cm, kg)'], ['custom', 'Custom divisor (in, lb)']] },
    { id: 'L', label: 'Length', type: 'number', value: 18, suffix: 'in', showIf: { rule: ['ups', 'usps', 'r166', 'custom'] } },
    { id: 'W', label: 'Width', type: 'number', value: 14, suffix: 'in', showIf: { rule: ['ups', 'usps', 'r166', 'custom'] } },
    { id: 'Ht', label: 'Height', type: 'number', value: 12, suffix: 'in', showIf: { rule: ['ups', 'usps', 'r166', 'custom'] } },
    { id: 'lb', label: 'Actual weight', type: 'number', value: 10, suffix: 'lb', showIf: { rule: ['ups', 'usps', 'r166', 'custom'] } },
    { id: 'Lc', label: 'Length', type: 'number', value: 46, suffix: 'cm', showIf: { rule: ['intl', 'air'] } },
    { id: 'Wc', label: 'Width', type: 'number', value: 36, suffix: 'cm', showIf: { rule: ['intl', 'air'] } },
    { id: 'Hc', label: 'Height', type: 'number', value: 30, suffix: 'cm', showIf: { rule: ['intl', 'air'] } },
    { id: 'kg', label: 'Actual weight', type: 'number', value: 4.5, suffix: 'kg', showIf: { rule: ['intl', 'air'] } },
    { id: 'div', label: 'Divisor', type: 'number', value: 194, help: 'From your negotiated rate agreement.', showIf: { rule: ['custom'] } },
    { id: 'roundUp', label: 'Round each side up to the next whole inch or cm (current carrier rule)', type: 'checkbox', value: true, wide: true }
  ],
  compute(v, H) {
    var metric = v.rule === 'intl' || v.rule === 'air';
    var L = metric ? v.Lc : v.L, W = metric ? v.Wc : v.W, Hh = metric ? v.Hc : v.Ht, wt = metric ? v.kg : v.lb;
    if (!(L > 0 && W > 0 && Hh > 0)) return { error: 'Enter length, width and height.' };
    if (!(wt >= 0)) return { error: 'Enter the actual weight (0 if unknown).' };
    var div = v.rule === 'intl' ? 5000 : v.rule === 'air' ? 6000 : v.rule === 'r166' ? 166 : v.rule === 'custom' ? v.div : 139;
    if (!(div > 0)) return { error: 'Enter a divisor greater than zero.' };
    if (v.roundUp) { L = Math.ceil(L - 1e-9); W = Math.ceil(W - 1e-9); Hh = Math.ceil(Hh - 1e-9); }
    var vol = L * W * Hh;
    var u = metric ? 'kg' : 'lb', cu = metric ? 'cm³' : 'in³';
    var up = function (x) { return metric ? Math.ceil(x * 2 - 1e-9) / 2 : Math.ceil(x - 1e-9); };
    var dimRaw = vol / div;
    var dim = up(dimRaw);
    var act = up(wt);
    var applies = !(v.rule === 'usps' && vol <= 1728);
    var bill = applies ? Math.max(dim, act) : act;
    var rows = [
      ['Measured size', H.num(L, 2) + ' × ' + H.num(W, 2) + ' × ' + H.num(Hh, 2) + (metric ? ' cm' : ' in')],
      ['Cubic size', H.num(vol, 0) + ' ' + cu + (metric ? ' (' + H.num(vol / 1e6, 4) + ' m³)' : ' (' + H.num(vol / 1728, 2) + ' ft³)')],
      ['Dimensional weight', applies ? H.num(dimRaw, 2) + ' → ' + H.num(dim, 1) + ' ' + u : 'not applied (1,728 in³ or less)'],
      ['Actual weight (rounded up)', H.num(act, 1) + ' ' + u],
      ['Billable weight', H.num(bill, 1) + ' ' + u, true]
    ];
    var sub;
    if (applies && dim > act) {
      rows.push(['Weight you pay for but don\'t ship', H.num(dim - act, 1) + ' ' + u]);
      sub = 'Dimensional weight wins. To bill on actual weight, the box would need to be at most ' + H.num(act * div, 0) + ' ' + cu + '.';
    } else {
      sub = applies ? 'Actual weight is higher, so you are billed on actual weight.' : 'USPS only applies dimensional weight to parcels over 1 cubic foot, so you pay on actual weight.';
    }
    return {
      value: H.num(bill, 1) + ' ' + u,
      label: 'Billable (chargeable) weight',
      expr: H.num(vol, 0) + ' ' + cu + ' ÷ ' + H.num(div, 0),
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `Dimensional weight is length × width × height ÷ a carrier divisor. For UPS and FedEx (and USPS since Jul 12, 2026) the divisor is 139 in inches and pounds. An <strong>18 × 14 × 12 in</strong> box is 3,024 cubic inches ÷ 139 = 21.76, rounded up to 22 lb. If the item weighs 10 lb, you are billed for <strong>${r.value}</strong>, the higher of the two.`,
  stepsTitle: 'How to calculate dimensional weight',
  steps: [
    'Measure the box at its longest points, including any bulges. Since Aug 18, 2025 UPS and FedEx round <strong>each side up</strong> to the next whole inch (USPS since Jul 12, 2026), so 12.2 in counts as 13 in. Forgetting this rounding is the most common reason a quote comes in low.',
    'Multiply length × width × height to get cubic inches (or cubic centimeters).',
    'Divide by the carrier\'s divisor: 139 for UPS and FedEx daily rates and USPS, 166 for UPS retail rates, 5,000 for metric international express, 6,000 for air cargo.',
    'Round the result up to the next whole pound (or 0.5 kg). Compare it with the actual weight, also rounded up; the carrier bills the higher one.'
  ],
  formulaTitle: 'What is the dimensional weight formula?',
  formula: {
    expr: 'DIM weight (lb) = L × W × H (in) ÷ 139<br>DIM weight (kg) = L × W × H (cm) ÷ 5,000<br>Billable weight = max(actual weight, DIM weight)',
    vars: [['L, W, H', 'outside length, width and height, each rounded up to a whole unit'], ['139', 'cubic inches per pound: UPS, FedEx and USPS (2026)'], ['166', 'UPS retail rates; USPS divisor until Jul 11, 2026'], ['5,000', 'cm³ per kg for international express'], ['6,000', 'cm³ per kg for air cargo (the IATA 1:6 ratio)']],
    note: 'Negotiated contracts can use a higher divisor (for example 194 or 225), which lowers DIM weight. Use the custom option to test yours.'
  },
  example: `<p>An online store ships a 9 lb lamp in a box that measures 20.25 × 12.5 × 12.1 inches with FedEx Ground.</p>
<p>Rounded up: 21 × 13 × 13 = <strong>3,549 cubic inches</strong>.</p>
<p>DIM weight = 3,549 ÷ 139 = 25.53, rounded up to <strong>26 lb</strong>. Billable weight is 26 lb, not 9 lb.</p>
<p>Repacked in a 20 × 12 × 12 box: 2,880 ÷ 139 = 20.72 → <strong>21 lb</strong>. Trimming a quarter inch here and there saves 5 billable pounds on every shipment.</p>`,
  table: {
    title: 'What is the dimensional weight of common box sizes?',
    intro: 'Dimensional weight in pounds for standard boxes under each U.S. rule, from the calculator above. USPS ignores DIM weight for boxes of 1,728 in³ or less.',
    head: ['Box (in)', 'Cubic inches', '÷ 139 (UPS, FedEx)', '÷ 166', 'USPS (2026)'],
    rows: ({ run, H }) => [[6, 6, 6], [8, 8, 8], [10, 8, 6], [10, 10, 10], [12, 12, 8], [12, 12, 12], [14, 14, 14], [16, 12, 12], [18, 14, 12], [18, 18, 18], [20, 20, 20], [24, 18, 18], [24, 24, 24]].map(([a, b, c]) => {
      const o = { L: a, W: b, Ht: c, lb: 0, roundUp: true };
      const usps = run({ ...o, rule: 'usps' });
      return [a + ' × ' + b + ' × ' + c, H.int(a * b * c), run({ ...o, rule: 'ups' }).value, run({ ...o, rule: 'r166' }).value, a * b * c > 1728 ? usps.value : 'actual weight'];
    })
  },
  sections: [
    {
      h2: 'How do you calculate dimensional weight in kg?',
      html: `<p>Measure in centimeters, multiply length × width × height, and divide by 5,000 for international express services (UPS, FedEx and DHL Express all use 5,000 for metric). A 46 × 36 × 30 cm box is 49,680 cm³ ÷ 5,000 = 9.94 kg, which express carriers bill in half-kilo steps, so 10 kg. If the contents weigh 4.5 kg, you pay for 10 kg.</p>
<p>Some couriers and postal services use 6,000 instead, and a few domestic services in other countries use 4,000. Check the divisor in the service guide before quoting a customer.</p>`
    },
    {
      h2: 'How do you calculate chargeable weight for air freight?',
      html: `<p>Air cargo uses the IATA volume ratio of 1:6, meaning 6,000 cm³ per kg, or 166.67 kg per cubic meter. Chargeable weight = max(gross weight, volume in cm³ ÷ 6,000). A pallet measuring 120 × 100 × 150 cm is 1,800,000 cm³ ÷ 6,000 = <strong>300 kg</strong> volumetric. If it weighs 220 kg gross, the airline charges 300 kg; if it weighs 380 kg, it charges 380 kg.</p>
<p>For a multi-piece shipment, add up the volumes of all pieces and compare the total with the total gross weight.</p>`
    },
    {
      h2: 'What changed for dimensional weight in 2025 and 2026?',
      html: `<ul><li><strong>Aug 18, 2025:</strong> FedEx began rounding any fraction of an inch or centimeter up to the next whole unit before calculating DIM weight, instead of rounding to the nearest unit. UPS adopted the same round-up rule.</li>
<li><strong>Jul 12, 2026:</strong> USPS changed its DIM factor from 166 to <strong>139</strong> for Priority Mail Express, Priority Mail, USPS Ground Advantage and Parcel Select, and now rounds each dimension up to the next whole inch. DIM weight still applies only to parcels over 1 cubic foot (1,728 cubic inches).</li></ul>
<p>Together, the changes mean a box that measured 12.4 inches per side and was billed at 1,728 in³ before is now 13 × 13 × 13 = 2,197 in³, and USPS now uses the same 139 divisor as UPS and FedEx.</p>`
    },
    {
      h2: 'How can you lower dimensional weight charges?',
      html: `<ul><li>Right-size boxes: every inch removed from each side cuts volume fast. Dropping an 18 × 14 × 12 box to 16 × 12 × 10 takes DIM weight from 22 lb to 14 lb.</li>
<li>Stay at or below 1,728 in³ for USPS so DIM weight does not apply at all.</li>
<li>Avoid fractional sizes: a 12.1-inch side bills as 13.</li>
<li>Use poly mailers or padded envelopes for soft goods.</li>
<li>Ask for a higher divisor in your carrier contract if you ship large volumes of light, bulky goods.</li></ul>
<p>To find a box's cubic size quickly, use the <a href="/cubic-inches-calculator">cubic inches calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the dimensional weight divisor for UPS and FedEx?', a: '139 for U.S. domestic daily (account) rates in inches and pounds, and 5,000 for international shipments in centimeters and kilograms. UPS retail rates have used 166. Negotiated contracts may use a higher divisor.' },
    { q: 'Does USPS use dimensional weight?', a: 'Yes, for Priority Mail Express, Priority Mail, USPS Ground Advantage and Parcel Select parcels larger than 1 cubic foot (1,728 cubic inches). Since Jul 12, 2026 the divisor is 139 and each dimension is rounded up to the next whole inch.' },
    { q: 'Is billable weight the actual weight or the dimensional weight?', a: 'Whichever is greater. A 10 lb item in an 18 × 14 × 12 box bills at 22 lb because the dimensional weight is higher; a 30 lb item in the same box bills at 30 lb.' },
    { q: 'How do I calculate dimensional weight in cubic feet?', a: 'Multiply length × width × height in inches and divide by 1,728 to get cubic feet. To get DIM weight from cubic feet, multiply by 1,728 and divide by 139: one cubic foot is 12.43, which rounds up to 13 lb.' },
    { q: 'Do I round dimensions up or to the nearest inch?', a: 'Up. UPS and FedEx have rounded each fractional dimension up to the next whole inch since Aug 18, 2025, and USPS since Jul 12, 2026.' },
    { q: 'What is the dimensional weight of a 12 × 12 × 12 box?', a: '1,728 cubic inches ÷ 139 = 12.43, rounded up to 13 lb with UPS and FedEx. USPS does not apply DIM weight to this box because it is exactly 1 cubic foot, not over it.' }
  ],
  related: ['cubic-inches-calculator', 'cubic-feet-calculator', 'fuel-surcharge-calculator', 'total-cost-calculator'],
  sources: [
    { name: 'USPS Postal Bulletin 22705: DIM factor changed to 139, effective Jul 12, 2026', url: 'https://about.usps.com/postal-bulletin/2026/pb22705/html/updt_001.htm' },
    { name: 'Federal Register (May 15, 2026): USPS dimensional weight and rounding changes', url: 'https://www.govinfo.gov/content/pkg/FR-2026-05-15/html/2026-09785.htm' },
    { name: 'USPS Domestic Mail Manual 223: Priority Mail commercial prices and eligibility', url: 'https://pe.usps.com/text/dmm300/223.htm' },
    { name: 'Supply Chain Dive: FedEx changes dimensional weight rounding (Aug 18, 2025)', url: 'https://www.supplychaindive.com/news/fedex-dimensional-weight-calculation-changes/753938/' },
    { name: 'FedEx Service Guide', url: 'https://www.fedex.com/en-us/service-guide.html' }
  ]
};
