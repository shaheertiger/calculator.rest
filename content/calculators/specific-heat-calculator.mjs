export default {
  slug: 'specific-heat-calculator',
  hub: 'science',
  name: 'Specific Heat Calculator',
  title: 'Specific Heat Calculator: q = mcΔT (Water Is 4.184 J/g°C)',
  h1: 'Specific Heat Calculator: Solve q = mcΔT for Heat, Mass, c or ΔT',
  meta: '200 g of water that absorbs 12,552 J and warms 15 °C has c = 4.184 J/g°C. Solve q = mcΔT for heat, mass, specific heat or temperature change.',
  keyword: 'how to calculate specific heat of water',
  also: ['specific heat calculator', 'how to calculate specific heat', 'q = mcat calculator', 'specific heat capacity formula', 'how to calculate heat absorbed', 'specific heat of water'],
  updated: '2026-11-13',
  inputs: [
    { id: 'solve', label: 'Solve for', type: 'select', value: 'c', options: [['c', 'Specific heat c'], ['q', 'Heat q'], ['m', 'Mass m'], ['dt', 'Temperature change ΔT']] },
    { id: 'q', label: 'Heat added (q)', type: 'number', value: 12552, suffix: 'J', help: 'Negative if the sample gives off heat. 1 cal = 4.184 J.', showIf: { solve: ['c', 'm', 'dt'] } },
    { id: 'm', label: 'Mass (m)', type: 'number', value: 200, suffix: 'g', showIf: { solve: ['c', 'q', 'dt'] } },
    { id: 'c', label: 'Specific heat (c)', type: 'number', value: 4.184, suffix: 'J/g·°C', help: 'Water 4.184, aluminum 0.897, iron 0.449, copper 0.385.', showIf: { solve: ['q', 'm', 'dt'] } },
    { id: 'ti', label: 'Starting temperature', type: 'number', value: 20, suffix: '°C', showIf: { solve: ['c', 'q', 'm'] } },
    { id: 'tf', label: 'Final temperature', type: 'number', value: 35, suffix: '°C', showIf: { solve: ['c', 'q', 'm'] } },
    { id: 'tstart', label: 'Starting temperature (optional)', type: 'number', value: '', suffix: '°C', placeholder: 'e.g. 20', help: 'Adds the final temperature to the answer.', showIf: { solve: ['dt'] } }
  ],
  data: { mats: [['Water (liquid)', 4.184], ['Ethanol (liquid)', 2.44], ['Ice (near 0 °C)', 2.09], ['Air (constant pressure)', 1.005], ['Aluminum', 0.897], ['Glass (typical)', 0.84], ['Iron', 0.449], ['Copper', 0.385], ['Silver', 0.235], ['Lead', 0.129], ['Gold', 0.129]] },
  compute(v, H, D) {
    var q = v.q, m = v.m, c = v.c, dt = v.tf - v.ti, out = {}, rows = [];
    var mats = D.mats;
    var nearest = function (cv) {
      var best = null, diff = 1e9;
      for (var i = 0; i < mats.length; i++) { var d = Math.abs(mats[i][1] - cv) / mats[i][1]; if (d < diff) { diff = d; best = mats[i]; } }
      return diff <= 0.03 ? best[0] : '';
    };
    if (v.solve === 'c') {
      if (!isFinite(q) || q === 0) return { error: 'Enter the heat absorbed or released in joules.' };
      if (!(m > 0)) return { error: 'Enter the mass in grams.' };
      if (!isFinite(dt) || dt === 0) return { error: 'Enter two different temperatures.' };
      c = q / (m * dt);
      if (c <= 0) return { error: 'Heat and temperature change must have the same sign (heat in → temperature rises).' };
      out = { value: H.sig(c, 4) + ' J/g·°C', label: 'Specific heat capacity', expr: H.num(q, 3) + ' J ÷ (' + H.num(m, 3) + ' g × ' + H.num(dt, 3) + ' °C)' };
      rows.push(['In J/kg·K', H.num(c * 1000, 1) + ' J/kg·K']);
      rows.push(['In cal/g·°C', H.sig(c / 4.184, 4) + ' cal/g·°C']);
      rows.push(['Temperature change ΔT', H.num(dt, 3) + ' °C']);
      var nm = nearest(c);
      out.sub = nm ? 'Closest reference value: ' + nm.toLowerCase() + ', ' + mats.filter(function (x) { return x[0] === nm; })[0][1] + ' J/g·°C.' : 'Compare with the table of common specific heats below the calculator.';
    } else if (v.solve === 'q') {
      if (!(m > 0)) return { error: 'Enter the mass in grams.' };
      if (!(c > 0)) return { error: 'Enter the specific heat in J/g·°C.' };
      if (!isFinite(dt)) return { error: 'Enter both temperatures.' };
      q = m * c * dt;
      out = { value: H.num(q, Math.abs(q) < 100 ? 2 : 0) + ' J', label: q < 0 ? 'Heat released' : 'Heat absorbed', expr: H.num(m, 3) + ' g × ' + H.num(c, 4) + ' J/g·°C × ' + H.num(dt, 3) + ' °C' };
      rows.push(['Kilojoules', H.num(q / 1000, 3) + ' kJ', true]);
      rows.push(['Calories', H.num(q / 4.184, 1) + ' cal']);
      rows.push(['BTU', H.num(q / 1055.05585262, 3) + ' BTU']);
      rows.push(['kWh (electric heating, 100% efficient)', H.sig(q / 3.6e6, 3) + ' kWh']);
      out.sub = q < 0 ? 'Negative q means the sample cooled and gave heat to its surroundings.' : 'Assumes no phase change between the two temperatures.';
    } else if (v.solve === 'm') {
      if (!isFinite(q) || q === 0) return { error: 'Enter the heat in joules.' };
      if (!(c > 0)) return { error: 'Enter the specific heat in J/g·°C.' };
      if (!isFinite(dt) || dt === 0) return { error: 'Enter two different temperatures.' };
      m = q / (c * dt);
      if (m <= 0) return { error: 'Heat and temperature change must have the same sign.' };
      out = { value: H.sig(m, 4) + ' g', label: 'Mass heated', expr: H.num(q, 3) + ' J ÷ (' + H.num(c, 4) + ' × ' + H.num(dt, 3) + ' °C)' };
      rows.push(['Kilograms', H.sig(m / 1000, 4) + ' kg', true]);
      rows.push(['Pounds', H.sig(m / 453.59237, 4) + ' lb']);
    } else {
      if (!isFinite(q)) return { error: 'Enter the heat in joules.' };
      if (!(m > 0)) return { error: 'Enter the mass in grams.' };
      if (!(c > 0)) return { error: 'Enter the specific heat in J/g·°C.' };
      dt = q / (m * c);
      out = { value: H.sig(dt, 4) + ' °C', label: 'Temperature change ΔT', expr: H.num(q, 3) + ' J ÷ (' + H.num(m, 3) + ' g × ' + H.num(c, 4) + ')' };
      rows.push(['In kelvins', H.sig(dt, 4) + ' K']);
      rows.push(['In Fahrenheit degrees', H.sig(dt * 1.8, 4) + ' °F change']);
      if (typeof v.tstart === 'number' && isFinite(v.tstart)) rows.push(['Final temperature', H.num(v.tstart + dt, 2) + ' °C', true]);
      out.sub = 'A change of 1 °C equals a change of 1 K, so ΔT is the same number in either scale.';
    }
    out.rows = rows;
    return out;
  },
  quick: ({ r }) => `To calculate the specific heat of water, divide the heat absorbed by mass times temperature change: c = q ÷ (m × ΔT). If 200 g of water absorbs 12,552 J and warms from 20 °C to 35 °C, c = 12,552 ÷ (200 × 15) = <strong>${r.value}</strong>, the accepted value for liquid water (1 cal/g·°C, or 4,184 J/kg·K).`,
  stepsTitle: 'How to calculate specific heat from a lab measurement',
  steps: [
    'Measure the heat q that went into the sample, in joules. In a calorimetry lab this usually comes from a heater (watts × seconds) or from the heat lost by a hot metal.',
    'Weigh the sample in grams. For water, 1 mL is about 1 g, so 200 mL is 200 g.',
    'Find ΔT = final − initial temperature. Students most often mix this up when a sample cools: ΔT is then negative, and so is q.',
    'Divide: c = q ÷ (m × ΔT). Keep the units with the number (J/g·°C); multiply by 1,000 for J/kg·K.',
    'Compare with a reference value. A result far from 4.184 J/g·°C for water usually means heat escaped to the cup or the air.'
  ],
  formulaTitle: 'What is the specific heat formula?',
  formula: {
    expr: 'q = m c ΔT<br>c = q ÷ (m ΔT)<br>m = q ÷ (c ΔT)<br>ΔT = q ÷ (m c)',
    vars: [['q', 'heat absorbed (+) or released (−), in joules'], ['m', 'mass in grams'], ['c', 'specific heat capacity, J/g·°C (same as J/g·K)'], ['ΔT', 'T<sub>final</sub> − T<sub>initial</sub> in °C or K']],
    note: 'The formula covers heating or cooling within one phase. Melting ice or boiling water adds latent heat (334 J/g to melt ice, about 2,260 J/g to boil water at 100 °C) on top of mcΔT.'
  },
  example: `<p><strong>Finding c for an unknown metal.</strong> A 50.0 g metal block heated to 98.0 °C is dropped into 100.0 g of water at 22.0 °C. Both settle at 25.6 °C. What is the metal's specific heat?</p>
<p>Heat gained by water: q = 100.0 × 4.184 × (25.6 − 22.0) = <strong>1,506 J</strong>.</p>
<p>The metal lost the same 1,506 J while cooling 98.0 − 25.6 = 72.4 °C, so c = 1,506 ÷ (50.0 × 72.4) = <strong>0.416 J/g·°C</strong>.</p>
<p>That is closest to iron (0.449); the 7% gap is typical of a coffee-cup calorimeter that loses some heat.</p>`,
  table: {
    title: 'What is the specific heat of common substances?',
    intro: 'Approximate values near room temperature, and how far the same 1,000 J of heat would raise the temperature of a 100 g sample of each, computed with ΔT = q ÷ (mc).',
    head: ['Substance', 'c (J/g·°C)', 'c (cal/g·°C)', '1,000 J into 100 g warms it by'],
    rows: ({ run, D, H }) => D.mats.map(x => { const r = run({ solve: 'dt', q: 1000, m: 100, c: x[1], tstart: NaN }); return [x[0], String(x[1]), H.num(x[1] / 4.184, 3), r.value]; }),
    note: 'Specific heat varies a little with temperature: liquid water ranges from about 4.22 J/g·°C near freezing to 4.18 near 35 °C. Use your textbook\'s value on homework.'
  },
  sections: [
    {
      h2: 'Why is the specific heat of water 4.184 J/g°C?',
      html: `<p>The number comes from the calorie. One calorie was defined as the heat needed to warm 1 g of water by 1 °C, and the thermochemical calorie is fixed at exactly 4.184 J. So water's specific heat is 1 cal/g·°C = 4.184 J/g·°C, or 4,184 J/kg·K.</p>
<p>Water's value is high because hydrogen bonds between molecules soak up energy before the molecules speed up. That is why lakes and oceans moderate coastal climates and why a pot of water takes so long to boil compared with the same mass of the metal pot it sits in, which has a specific heat about one tenth as large.</p>`
    },
    {
      h2: 'How much energy does it take to heat water?',
      html: `<p>Multiply grams by 4.184 by the temperature rise. Heating 1 liter (1,000 g) of tap water from 20 °C to 100 °C takes 1,000 × 4.184 × 80 = <strong>334,720 J</strong>, or 335 kJ. That is 0.093 kWh, about 1.3 cents of electricity at 14¢/kWh if the kettle were perfectly efficient.</p>
<p>In U.S. units, 1 BTU warms 1 lb of water by 1 °F, so heating a 40-gallon water tank (about 333 lb) by 70 °F needs roughly 23,300 BTU. Boiling water away costs far more than warming it: the latent heat of vaporization, about 2,260 J/g, is nearly seven times the 335 J/g it takes to bring water from 20 °C to 100 °C.</p>`
    },
    {
      h2: 'What is the difference between specific heat and heat capacity?',
      html: `<p>Specific heat (c) is per gram, a property of the material. Heat capacity (C = m × c) is for a whole object, in J/°C. A 500 g aluminum pan has heat capacity 500 × 0.897 = 449 J/°C; a 5 g aluminum spoon has 4.5 J/°C. Same material, same c, very different C.</p>
<p>Molar heat capacity is c times molar mass: for water, 4.184 × 18.02 = 75.4 J/mol·K. Chemistry tables often list this version.</p>`
    },
    {
      h2: 'Why is my calculated specific heat wrong?',
      html: `<ul>
<li><strong>Heat lost to the surroundings.</strong> Styrofoam cups leak heat, so measured q is too small and c comes out low.</li>
<li><strong>Calorimeter not counted.</strong> The cup, stirrer and thermometer absorb some heat too; careful labs add a calorimeter constant in J/°C.</li>
<li><strong>Wrong sign or wrong ΔT.</strong> Use final minus initial for each object separately, and remember that heat lost by the hot object equals heat gained by the cold one.</li>
<li><strong>Grams versus kilograms.</strong> Using kg with a J/g·°C value gives an answer 1,000 times off.</li>
</ul>`
    }
  ],
  faq: [
    { q: 'What is the specific heat of water in J/kg·K?', a: '4,184 J/kg·K, which is 4.184 J/g·°C or 1.000 cal/g·°C. Many physics texts round it to 4,186 or 4,190 J/kg·K.' },
    { q: 'What is the specific heat of ice and steam?', a: 'Ice is about 2.09 J/g·°C and steam about 2.0 J/g·°C, roughly half the value for liquid water, so the same amount of heat warms ice or steam about twice as fast.' },
    { q: 'Is ΔT the same in Celsius and Kelvin?', a: 'Yes. A change of 1 °C equals a change of 1 K, so J/g·°C and J/g·K are the same unit. Only absolute temperatures differ by 273.15.' },
    { q: 'How do you calculate heat released when something cools?', a: 'Use q = mcΔT with ΔT = final − initial, which is negative for cooling. 50 g of water cooling from 80 °C to 30 °C gives q = 50 × 4.184 × (−50) = −10,460 J, meaning 10.46 kJ released.' },
    { q: 'What does a high specific heat mean?', a: 'A high specific heat means a substance needs a lot of energy to change temperature and holds heat longer. Water (4.184) heats about ten times more slowly than copper (0.385) for the same mass and heat input.' },
    { q: 'How do I convert specific heat from cal/g°C to J/g°C?', a: 'Multiply by 4.184. Ice at 0.50 cal/g·°C is 0.50 × 4.184 = 2.09 J/g·°C. Divide by 4.184 to go back.' },
    { q: 'What is the final temperature when mixing hot and cold water?', a: 'Heat lost by hot water equals heat gained by cold water, so T_final = (m₁T₁ + m₂T₂) ÷ (m₁ + m₂) when both are water. Mixing 100 g at 80 °C with 300 g at 20 °C gives 35 °C.' }
  ],
  related: ['joules-calculator', 'temperature-converter', 'efficiency-calculator', 'btu-calculator', 'density-calculator'],
  sources: [
    { name: 'OpenStax Chemistry 2e: 5.1 Energy Basics (specific heat table)', url: 'https://openstax.org/books/chemistry-2e/pages/5-1-energy-basics' },
    { name: 'OpenStax Chemistry 2e: 5.2 Calorimetry', url: 'https://openstax.org/books/chemistry-2e/pages/5-2-calorimetry' },
    { name: 'NIST Chemistry WebBook: Water (thermophysical data)', url: 'https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185' },
    { name: 'NIST Special Publication 811: calorie and BTU conversion factors', url: 'https://www.nist.gov/pml/special-publication-811' }
  ]
};
