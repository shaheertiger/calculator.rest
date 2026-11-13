export default {
  slug: 'cfm-calculator',
  hub: 'electrical',
  name: 'CFM Calculator',
  title: 'CFM Calculator: 80 CFM in an 8 × 10 Bathroom Is 7.5 ACH',
  h1: 'CFM and Air Changes per Hour Calculator for Rooms and Fans',
  meta: 'ACH = CFM × 60 ÷ room volume. An 80 CFM fan in an 8 × 10 ft bathroom with an 8 ft ceiling gives 7.5 air changes per hour. Or find the CFM a room needs.',
  keyword: 'how to calculate air changes per hour',
  also: ['how to calculate ach', 'how do i calculate air changes per hour', 'how do you calculate cfm', 'how to calculate cfm required for a room', 'how to calculate cfm for bathroom fan', 'how to calculate cfm in hvac', 'how do you calculate cfm for duct size', 'how to calculate cfm for a fan'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'ach', options: [['ach', 'Air changes per hour from fan CFM'], ['cfm', 'CFM needed for a target ACH']] },
    { id: 'room', label: 'Room type', type: 'select', value: 'bath', options: [['bath', 'Bathroom'], ['kitchen', 'Kitchen'], ['other', 'Other room']] },
    { id: 'length', label: 'Length', type: 'number', value: 10, suffix: 'ft' },
    { id: 'width', label: 'Width', type: 'number', value: 8, suffix: 'ft' },
    { id: 'height', label: 'Ceiling height', type: 'number', value: 8, suffix: 'ft' },
    { id: 'cfm', label: 'Fan airflow', type: 'number', value: 80, suffix: 'CFM', help: 'Use the HVI-certified rating; long or kinked ducts reduce real airflow.', showIf: { mode: ['ach'] } },
    { id: 'ach', label: 'Target air changes per hour', type: 'number', value: 8, suffix: 'ACH', showIf: { mode: ['cfm'] } }
  ],
  compute(v, H) {
    if (!(v.length > 0) || !(v.width > 0) || !(v.height > 0)) return { error: 'Enter the room length, width and ceiling height in feet.' };
    var area = v.length * v.width, vol = area * v.height, ach, cfm;
    if (v.mode === 'cfm') {
      if (!(v.ach > 0)) return { error: 'Enter the target air changes per hour.' };
      ach = v.ach; cfm = vol * ach / 60;
    } else {
      if (!(v.cfm > 0)) return { error: 'Enter the fan airflow in CFM.' };
      cfm = v.cfm; ach = cfm * 60 / vol;
    }
    var rows = [['Room volume', H.int(vol) + ' cu ft'], ['Minutes per full air change', H.num(60 / ach, 1) + ' min', true]];
    var sub;
    if (v.room === 'bath') {
      var rec = area <= 100 ? Math.max(50, Math.ceil(area)) : null;
      rows.push(['HVI bathroom fan guideline', rec ? rec + ' CFM' : '50 CFM per toilet, shower or tub']);
      sub = rec ? (cfm >= rec ? 'Meets HVI\'s 1 CFM per square foot guideline (minimum 50 CFM).' : 'Below HVI\'s guideline of ' + rec + ' CFM for this floor area.') : 'Over 100 sq ft, HVI sizes by fixture: 50 CFM each for toilet, shower and tub, 100 CFM for a jetted tub.';
    } else if (v.room === 'kitchen') {
      rows.push(['Range hood guideline (wall)', '100 CFM per foot of range width']);
      sub = 'HVI suggests 250 CFM for a 30-inch range against a wall and 150 CFM per foot for island ranges.';
    } else {
      rows.push(['Air purifier CADR for this room (EPA chart)', H.int(area * 0.65) + ' CFM']);
      sub = 'For room air cleaners, EPA\'s chart works out to about 5 air changes per hour of filtered air at an 8 ft ceiling.';
    }
    if (v.mode === 'cfm') return { value: H.int(Math.ceil(cfm - 1e-9)) + ' CFM', label: 'Airflow needed', expr: H.int(vol) + ' cu ft × ' + H.num(ach, 2) + ' ÷ 60', rows: rows, sub: sub };
    return { value: H.num(ach, 2) + ' ACH', label: 'Air changes per hour', expr: H.num(cfm, 1) + ' CFM × 60 ÷ ' + H.int(vol) + ' cu ft', rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate air changes per hour, multiply airflow in CFM by 60 and divide by the room's volume in cubic feet. An <strong>80 CFM</strong> fan in an 8 × 10 ft bathroom with an 8 ft ceiling (640 cu ft) gives 80 × 60 ÷ 640 = <strong>${r.value}</strong>, a full air change every 8 minutes. To find the CFM a room needs, reverse it: volume × ACH ÷ 60.`,
  stepsTitle: 'How to calculate air changes per hour',
  steps: [
    'Measure length, width and ceiling height in feet and multiply them for the room volume in cubic feet. For vaulted ceilings, use the average height.',
    'Find the airflow in cubic feet per minute (CFM) from the fan\'s HVI label, or the delivered airflow of the supply registers.',
    'Multiply CFM by 60 to get cubic feet per hour, then divide by the room volume. The result is air changes per hour (ACH).',
    'Compare with the guideline for the space. <strong>Rated CFM is not delivered CFM</strong>: a long, flexible or undersized duct can cut a bath fan\'s airflow sharply, so size up when the duct run is long.'
  ],
  formulaTitle: 'What is the air changes per hour formula?',
  formula: {
    expr: 'ACH = CFM × 60 ÷ volume<br>CFM = volume × ACH ÷ 60<br>Volume (cu ft) = length × width × height',
    vars: [['ACH', 'air changes per hour'], ['CFM', 'airflow in cubic feet per minute'], ['60', 'minutes per hour'], ['volume', 'room volume in cubic feet']]
  },
  example: `<p>A 12 × 15 ft basement workshop with a 7.5 ft ceiling needs 6 air changes per hour to clear sawdust and fumes.</p>
<p>Volume = 12 × 15 × 7.5 = <strong>1,350 cu ft</strong>. CFM = 1,350 × 6 ÷ 60 = <strong>135 CFM</strong>.</p>
<p>A 150 CFM fan would deliver 150 × 60 ÷ 1,350 = 6.67 ACH at its rated airflow, giving a little margin for duct losses.</p>`,
  table: {
    title: 'How many CFM do you need for 4, 6 or 8 air changes per hour?',
    intro: 'Airflow required for common room sizes with 8-foot ceilings, computed by the calculator above (rounded up to the next whole CFM).',
    head: ['Floor area', 'Volume', '2 ACH', '4 ACH', '6 ACH', '8 ACH', '12 ACH'],
    rows: ({ run, H }) => [40, 60, 80, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000].map(a => [H.int(a) + ' sq ft', H.int(a * 8) + ' cu ft', ...[2, 4, 6, 8, 12].map(n => run({ mode: 'cfm', room: 'other', length: a, width: 1, height: 8, ach: n }).value)]),
    note: 'For ceilings other than 8 ft, multiply by your ceiling height ÷ 8. HVI\'s bathroom rule of 1 CFM per square foot is equivalent to about 7.5 ACH at an 8 ft ceiling.'
  },
  sections: [
    {
      h2: 'How do you calculate CFM for a bathroom fan?',
      html: `<p>The Home Ventilating Institute (HVI) recommends <strong>1 CFM per square foot</strong> of floor area for bathrooms up to 100 sq ft, with a minimum of 50 CFM. An 8 × 10 ft bathroom (80 sq ft) needs 80 CFM; a 6 × 7 ft half bath still gets a 50 CFM fan.</p>
<p>For bathrooms over 100 sq ft, add up the fixtures instead: 50 CFM each for a toilet, shower and bathtub, and 100 CFM for a jetted tub. A large primary bath with a toilet, a separate shower and a tub needs 150 CFM, either from one fan or from separate fans over each fixture. An enclosed toilet room should have its own fan.</p>
<p>HVI also recommends a timer so the fan runs at least 20 minutes after each use, or continuous ventilation of at least 20 CFM in place of an intermittent 50 CFM fan. ASHRAE Standard 62.2 uses the same 50 CFM intermittent and 20 CFM continuous minimums.</p>`
    },
    {
      h2: 'How do you calculate CFM in HVAC?',
      html: `<p>Two numbers do most of the work:</p>
<ul><li><strong>Airflow per ton:</strong> central air systems are typically designed for about 350–450 CFM per ton of cooling, with 400 CFM per ton the usual starting point. A 3-ton system moves roughly 1,200 CFM. See the <a href="/btu-calculator">BTU calculator</a> to convert room loads into tons.</li>
<li><strong>Duct airflow:</strong> CFM = air velocity (feet per minute) × duct cross-section (square feet). An 8-inch round duct has an area of π × (4 ÷ 12)² = 0.349 sq ft, so at 700 fpm it carries about 244 CFM. Rectangular ducts: width × height in inches ÷ 144 gives square feet.</li></ul>
<p>Residential ducts are laid out with ACCA Manual D, which balances friction loss and velocity so registers stay quiet. For a quick check of an existing system, a hood-style flow meter at each register gives delivered CFM directly.</p>`
    },
    {
      h2: 'How many air changes per hour does a room need?',
      html: `<p>It depends on the job:</p>
<ul><li><strong>Whole-house fresh air:</strong> ASHRAE 62.2 sets a continuous rate of 0.03 CFM per square foot plus 7.5 CFM per occupant (bedrooms + 1). A 2,000 sq ft, 3-bedroom home needs 0.03 × 2,000 + 7.5 × 4 = <strong>90 CFM</strong>, only about 0.34 ACH for 16,000 cu ft of house.</li>
<li><strong>Bathrooms:</strong> HVI's 1 CFM per square foot equals about 7.5–8 ACH while the fan runs.</li>
<li><strong>Filtered air for a room:</strong> EPA's portable air cleaner chart (65 CFM of CADR per 100 sq ft) works out to about 5 ACH of clean air at an 8-foot ceiling.</li>
<li><strong>Workshops and hobby rooms with fumes:</strong> often designed for 6–12 ACH of exhaust, with the fan near the source.</li></ul>
<p>Don't confuse these with <strong>ACH50</strong>, the blower-door airtightness number: it measures leakage at a 50-pascal test pressure, and energy codes such as the 2021 IECC cap new homes at 3.0 ACH50 in most climate zones and 5.0 in the warmest.</p>`
    }
  ],
  faq: [
    { q: 'What size bathroom fan do I need?', a: 'For bathrooms up to 100 sq ft, 1 CFM per square foot with a 50 CFM minimum: a 5 × 8 ft bath needs 50 CFM, a 9 × 10 ft bath needs 90 CFM. Larger bathrooms need 50 CFM per toilet, shower and tub.' },
    { q: 'How do you convert ACH to CFM?', a: 'Multiply room volume in cubic feet by ACH and divide by 60. A 1,200 cu ft room at 5 ACH needs 1,200 × 5 ÷ 60 = 100 CFM.' },
    { q: 'How many CFM is 1 air change per hour?', a: 'Room volume ÷ 60. For a 12 × 12 ft room with 8 ft ceilings (1,152 cu ft), 1 ACH is 19.2 CFM.' },
    { q: 'How do you calculate CFM for an air compressor?', a: 'That is a different measurement: compressor CFM is the volume of air delivered at a stated pressure. Add up the CFM each tool needs at its operating psi and choose a compressor rated above that total at the same pressure.' },
    { q: 'What is a good ACH for a bedroom?', a: 'Homes get most of their fresh air from whole-house ventilation, which at ASHRAE 62.2 rates typically works out to roughly 0.3–0.4 ACH for the house. For cleaner bedroom air, a portable air cleaner giving about 5 ACH of filtered air, per EPA\'s sizing chart, is a practical target.' },
    { q: 'Does ceiling height matter for CFM?', a: 'Yes for air changes, because volume grows with height: a 10-foot ceiling needs 25% more CFM than an 8-foot ceiling for the same ACH. HVI\'s bathroom rule assumes standard 8-foot ceilings.' },
    { q: 'How many CFM does a range hood need?', a: 'HVI recommends 100 CFM per linear foot of range for wall-mounted hoods (250 CFM for a 30-inch range, 300 for 36-inch) and 150 CFM per foot for island hoods.' }
  ],
  related: ['btu-calculator', 'square-footage-calculator', 'electricity-cost-calculator', 'superheat-calculator'],
  sources: [
    { name: 'Home Ventilating Institute: How Much Ventilation Do I Need?', url: 'https://www.hvi.org/resources/publications/home-ventilation-guide-articles/how-much-ventilation-do-i-need/' },
    { name: 'Home Ventilating Institute: Bathroom Ventilation', url: 'https://www.hvi.org/resources/publications/bathroom-ventilation/' },
    { name: 'ASHRAE: Standards 62.1 and 62.2 (ventilation and indoor air quality)', url: 'https://www.ashrae.org/technical-resources/bookstore/standards-62-1-62-2' },
    { name: 'U.S. EPA: Guide to Air Cleaners in the Home', url: 'https://www.epa.gov/indoor-air-quality-iaq/guide-air-cleaners-home' }
  ]
};
