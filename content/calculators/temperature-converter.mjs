export default {
  slug: 'temperature-converter',
  hub: 'science',
  name: 'Celsius to Fahrenheit Converter',
  title: 'Celsius to Fahrenheit Converter: 25 °C = 77 °F, Plus a Chart',
  h1: 'Convert Celsius, Fahrenheit and Kelvin With the Exact Formula',
  meta: '25 °C is 77 °F (25 × 9/5 + 32) and 298.15 K. Convert any temperature between Celsius, Fahrenheit, Kelvin and Rankine, with a chart and a mental shortcut.',
  keyword: 'how to calculate degree centigrade to fahrenheit',
  also: ['celsius to fahrenheit', 'how to calculate fahrenheit to celcius', 'fahrenheit to celsius formula', 'celsius to kelvin', 'temperature converter', 'centigrade to fahrenheit'],
  updated: '2026-11-13',
  inputs: [
    { id: 't', label: 'Temperature', type: 'number', value: 25 },
    { id: 'from', label: 'From', type: 'select', value: 'C', options: [['C', 'Celsius (°C)'], ['F', 'Fahrenheit (°F)'], ['K', 'Kelvin (K)'], ['R', 'Rankine (°R)']] }
  ],
  compute(v, H) {
    if (!isFinite(v.t)) return { error: 'Enter a temperature.' };
    var c;
    if (v.from === 'F') c = (v.t - 32) * 5 / 9;
    else if (v.from === 'K') c = v.t - 273.15;
    else if (v.from === 'R') c = (v.t - 491.67) * 5 / 9;
    else c = v.t;
    if (c < -273.15 - 1e-9) return { error: 'That is below absolute zero (−273.15 °C, −459.67 °F, 0 K).' };
    var f = c * 9 / 5 + 32, k = c + 273.15, r = f + 459.67;
    var fmt = function (x) { return H.num(Math.abs(x) < 1e-9 ? 0 : x, 2); };
    var value, label, expr;
    if (v.from === 'C') { value = fmt(f) + ' °F'; label = 'Fahrenheit'; expr = fmt(v.t) + ' °C × 9/5 + 32'; }
    else if (v.from === 'F') { value = fmt(c) + ' °C'; label = 'Celsius'; expr = '(' + fmt(v.t) + ' °F − 32) × 5/9'; }
    else if (v.from === 'K') { value = fmt(c) + ' °C'; label = 'Celsius'; expr = fmt(v.t) + ' K − 273.15'; }
    else { value = fmt(f) + ' °F'; label = 'Fahrenheit'; expr = fmt(v.t) + ' °R − 459.67'; }
    var rows = [
      ['Celsius', fmt(c) + ' °C', v.from !== 'C' && v.from !== 'R'],
      ['Fahrenheit', fmt(f) + ' °F', v.from === 'C' || v.from === 'R'],
      ['Kelvin', fmt(k) + ' K'],
      ['Rankine', fmt(r) + ' °R'],
      ['Mental estimate (double °C, add 30)', fmt(c * 2 + 30) + ' °F']
    ];
    var sub = c <= 0 ? 'At or below the freezing point of water (0 °C, 32 °F).' : c >= 100 ? 'At or above the boiling point of water at sea level (100 °C, 212 °F).' : c >= 35 ? 'Hot: normal body temperature is about 37 °C (98.6 °F).' : c > 24 ? 'Warmer than a typical room; 25 °C (77 °F) is the standard lab temperature used in chemistry tables.' : c >= 18 ? 'Within the usual indoor comfort range of about 18–24 °C (64–75 °F).' : 'Above freezing but cooler than room temperature.';
    return { value: value, label: label, expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `To convert degrees centigrade (Celsius) to Fahrenheit, multiply by 9/5 (or 1.8) and add 32: °F = °C × 1.8 + 32. So 25 °C × 1.8 = 45, and 45 + 32 = <strong>${r.value}</strong>. To go back, subtract 32 and multiply by 5/9: 77 °F − 32 = 45, × 5/9 = 25 °C. Kelvin is °C + 273.15, so 25 °C = 298.15 K.`,
  stepsTitle: 'How to convert Celsius to Fahrenheit by hand',
  steps: [
    'Multiply the Celsius temperature by 9, then divide by 5. Multiplying by 1.8 does the same thing in one step.',
    'Add 32. Doing this <em>before</em> multiplying is the classic mistake: (25 + 32) × 1.8 = 102.6, not 77.',
    'Round to match your input. A thermometer read to the nearest degree gives a Fahrenheit value good to about 2 °F, so 77.0 °F is plenty.',
    'For the reverse, subtract 32 first, then multiply by 5/9 (or divide by 1.8).'
  ],
  formulaTitle: 'What is the formula to convert Celsius to Fahrenheit?',
  formula: {
    expr: '°F = °C × 9/5 + 32<br>°C = (°F − 32) × 5/9<br>K = °C + 273.15<br>°R = °F + 459.67',
    vars: [['°C', 'degrees Celsius (centigrade)'], ['°F', 'degrees Fahrenheit'], ['K', 'kelvins, the SI unit; written without a degree sign'], ['°R', 'degrees Rankine, an absolute scale with Fahrenheit-sized degrees']],
    note: 'The 9/5 comes from the size of the degrees: water\'s freezing-to-boiling range is 100 Celsius degrees but 180 Fahrenheit degrees, and 180 ÷ 100 = 1.8. The 32 is there because water freezes at 32 °F instead of 0.'
  },
  example: `<p><strong>Oven and fever.</strong> A recipe says bake at 180 °C. A thermometer reads 38.5 °C. What are these in Fahrenheit?</p>
<p>Oven: 180 × 1.8 = 324, + 32 = <strong>356 °F</strong>. Most U.S. ovens step in 25 °F increments, so set it to 350 °F.</p>
<p>Fever: 38.5 × 1.8 = 69.3, + 32 = <strong>101.3 °F</strong>, about 2.7 °F above the traditional 98.6 °F (37 °C).</p>`,
  table: {
    title: 'What are common Celsius temperatures in Fahrenheit?',
    intro: 'Each row is converted with °F = °C × 9/5 + 32 and K = °C + 273.15.',
    head: ['Celsius', 'Fahrenheit', 'Kelvin', 'What it is'],
    rows: ({ run }) => [
      [-273.15, 'Absolute zero'], [-40, 'Same number on both scales'], [-18, 'Home freezer setting (≈ 0 °F)'], [0, 'Water freezes'], [4, 'Refrigerator (≈ 40 °F)'],
      [10, 'Cool spring day'], [20, 'Room temperature'], [25, 'Warm room; standard lab temperature'], [30, 'Hot summer day'], [37, 'Normal body temperature'],
      [40, 'Heat wave'], [100, 'Water boils (sea level)'], [180, 'Moderate oven'], [230, 'Hot oven for pizza or bread']
    ].map(x => { const r = run({ t: x[0], from: 'C' }); return [x[0] + ' °C', r.rows[1][1], r.rows[2][1], x[1]]; }),
    note: 'Water\'s boiling point drops about 1 °C for every 300 m (1,000 ft) of altitude, so in Denver water boils near 95 °C (203 °F).'
  },
  sections: [
    {
      h2: 'How do you calculate Fahrenheit to Celsius?',
      html: `<p>Subtract 32, then multiply by 5/9 (or divide by 1.8): °C = (°F − 32) × 5/9. For a 68 °F day: 68 − 32 = 36, and 36 × 5/9 = <strong>20 °C</strong>. For body temperature, 98.6 − 32 = 66.6, × 5/9 = <strong>37 °C</strong>. For a 350 °F oven, 318 × 5/9 = <strong>176.7 °C</strong>, which recipes round to 175 or 180 °C.</p>
<p>Choose °F in the "From" box above to do this automatically.</p>`
    },
    {
      h2: 'Is there an easy way to convert Celsius to Fahrenheit in your head?',
      html: `<p>Double the Celsius number and add 30. It is quick and close for weather: 15 °C → 60 °F (exact: 59 °F), 25 °C → 80 °F (exact: 77 °F). The error grows at the extremes, reaching 18 °F too high at 100 °C.</p>
<p>For an exact answer that is still mental math, double, subtract 10% of the doubled value, then add 32: 25 → 50 → 45 → <strong>77 °F</strong>. Going the other way: subtract 32, halve, then add 10% of the half: 77 → 45 → 22.5 → 24.75 ≈ 25 °C.</p>`
    },
    {
      h2: 'At what temperature are Celsius and Fahrenheit the same?',
      html: `<p>At −40. Set the two equal, C = 1.8C + 32, and solve: −0.8C = 32, so C = −40. That means −40 °C and −40 °F describe exactly the same cold. Above −40 the Fahrenheit number is always the larger one; below it, the Celsius number is.</p>`
    },
    {
      h2: 'How do you convert Celsius to Kelvin?',
      html: `<p>Add 273.15: K = °C + 273.15. Room temperature of 20 °C is 293.15 K, and water boils at 373.15 K. Kelvin starts at absolute zero (0 K = −273.15 °C = −459.67 °F), the lowest temperature possible, so it never goes negative. That is why gas-law and thermodynamics problems require kelvins: doubling 10 °C to 20 °C does not double the thermal energy, but 283.15 K to 566.3 K would.</p>
<p>Write kelvins without a degree sign (300 K, not 300 °K). The kelvin and the Celsius degree are the same size, so a change of 5 K equals a change of 5 °C.</p>`
    },
    {
      h2: 'How do you convert a temperature change, not a temperature?',
      html: `<p>Leave out the 32. A rise of 10 °C is a rise of 10 × 1.8 = <strong>18 °F</strong>, not 50 °F. The offset only matters for actual readings on a thermometer, because both scales have the same zero for differences. Climate figures work this way: 1.5 °C of warming equals 2.7 °F.</p>`
    }
  ],
  faq: [
    { q: 'What is 0 °C in Fahrenheit?', a: '0 °C is 32 °F, the freezing point of water. 0 °F is −17.8 °C.' },
    { q: 'What is 100 °F in Celsius?', a: '100 °F is 37.8 °C: (100 − 32) × 5/9 = 37.78.' },
    { q: 'What is 37 °C in Fahrenheit?', a: '37 °C is 98.6 °F, the traditional normal body temperature. Healthy adults commonly range from about 97 °F to 99 °F (36.1–37.2 °C).' },
    { q: 'Is centigrade the same as Celsius?', a: 'Yes. "Centigrade" was the older name for the 100-step scale between water\'s freezing and boiling points; it was officially renamed Celsius in 1948 after astronomer Anders Celsius.' },
    { q: 'What is 20 degrees Celsius in Fahrenheit?', a: '20 °C is 68 °F: 20 × 1.8 = 36, plus 32 = 68.' },
    { q: 'Why does the U.S. still use Fahrenheit?', a: 'Habit and cost of change. The U.S. uses Fahrenheit for weather and cooking, but U.S. science, medicine and engineering use Celsius and kelvins, which are part of the SI.' },
    { q: 'What is 350 °F in Celsius?', a: '350 °F is 176.7 °C, usually written as 175 or 180 °C on recipes.' },
    { q: 'How do you convert Fahrenheit to Kelvin?', a: 'Subtract 32, multiply by 5/9, then add 273.15. 68 °F → 20 °C → 293.15 K. In one step: K = (°F + 459.67) × 5/9.' }
  ],
  related: ['wind-chill-calculator', 'specific-heat-calculator', 'superheat-calculator', 'btu-calculator'],
  sources: [
    { name: 'NIST: SI Units – Temperature', url: 'https://www.nist.gov/pml/weights-and-measures/si-units-temperature' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI (temperature conversions)', url: 'https://www.nist.gov/pml/special-publication-811' },
    { name: 'BIPM: The International System of Units (SI Brochure), definition of the kelvin', url: 'https://www.bipm.org/en/publications/si-brochure' },
    { name: 'FoodSafety.gov: Cold Food Storage Chart (refrigerator 40 °F, freezer 0 °F)', url: 'https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts' }
  ]
};
