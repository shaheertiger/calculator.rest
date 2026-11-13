export default {
  slug: 'density-calculator',
  hub: 'science',
  name: 'Density Calculator',
  title: 'Density Calculator: 25.0 g of Aluminum Takes Up 9.26 cm³',
  h1: 'Density, Mass and Volume Calculator (ρ = m ÷ V)',
  meta: 'Volume = mass ÷ density, so 25.0 g of aluminum (2.70 g/cm³) fills 9.26 cm³. Solve density, mass or volume for cylinders, blocks, rocks and lab samples.',
  keyword: 'how to calculate volume from mass and density',
  also: ['density calculator', 'how to calculate density of cylinder', 'how to calculate the density of a cylinder', 'how do you calculate the density of metal', 'how to calculate the density of a rock', 'how do you calculate the density of a rock', 'how do we calculate mass'],
  updated: '2026-11-13',
  inputs: [
    { id: 'solve', label: 'Solve for', type: 'select', value: 'volume', options: [['volume', 'Volume (from mass and density)'], ['density', 'Density (from mass and volume)'], ['mass', 'Mass (from density and volume)']] },
    { id: 'mass', label: 'Mass', type: 'number', value: 25, showIf: { solve: ['volume', 'density'] } },
    { id: 'mUnit', label: 'Mass unit', type: 'select', value: 'g', options: [['g', 'grams (g)'], ['kg', 'kilograms (kg)'], ['mg', 'milligrams (mg)'], ['lb', 'pounds (lb)'], ['oz', 'ounces (oz)']] },
    { id: 'material', label: 'Material', type: 'select', value: 'aluminum', showIf: { solve: ['volume', 'mass'] }, options: [['custom', 'Enter my own density'], ['water', 'Water, 20 °C'], ['ethanol', 'Ethanol'], ['ice', 'Ice'], ['seawater', 'Seawater'], ['aluminum', 'Aluminum'], ['titanium', 'Titanium'], ['zinc', 'Zinc'], ['iron', 'Iron'], ['steel', 'Carbon steel'], ['copper', 'Copper'], ['silver', 'Silver'], ['lead', 'Lead'], ['mercury', 'Mercury'], ['gold', 'Gold'], ['granite', 'Granite (typical)'], ['glass', 'Soda-lime glass']] },
    { id: 'density', label: 'Density', type: 'number', value: 2.7, showIf: { solve: ['volume', 'mass'], material: ['custom'] } },
    { id: 'dUnit', label: 'Density unit', type: 'select', value: 'gcm3', options: [['gcm3', 'g/cm³ (= g/mL)'], ['kgm3', 'kg/m³'], ['gL', 'g/L'], ['lbft3', 'lb/ft³'], ['lbin3', 'lb/in³'], ['lbgal', 'lb/US gal']] },
    { id: 'vmode', label: 'How do you know the volume?', type: 'select', value: 'direct', showIf: { solve: ['density', 'mass'] }, options: [['direct', 'I know the volume'], ['cyl', 'Cylinder (diameter, height)'], ['box', 'Rectangular block (L × W × H)'], ['sphere', 'Sphere (diameter)'], ['disp', 'Water displacement (graduated cylinder)']] },
    { id: 'volume', label: 'Volume', type: 'number', value: 10, showIf: { solve: ['density', 'mass'], vmode: ['direct'] } },
    { id: 'diam', label: 'Diameter', type: 'number', value: 2, showIf: { solve: ['density', 'mass'], vmode: ['cyl', 'sphere'] } },
    { id: 'height', label: 'Height (length)', type: 'number', value: 5, showIf: { solve: ['density', 'mass'], vmode: ['cyl', 'box'] } },
    { id: 'len', label: 'Length', type: 'number', value: 4, showIf: { solve: ['density', 'mass'], vmode: ['box'] } },
    { id: 'wid', label: 'Width', type: 'number', value: 3, showIf: { solve: ['density', 'mass'], vmode: ['box'] } },
    { id: 'lUnit', label: 'Length unit', type: 'select', value: 'cm', showIf: { solve: ['density', 'mass'], vmode: ['cyl', 'box', 'sphere'] }, options: [['mm', 'mm'], ['cm', 'cm'], ['m', 'm'], ['in', 'in'], ['ft', 'ft']] },
    { id: 'vi', label: 'Water level before', type: 'number', value: 50, suffix: 'mL', showIf: { solve: ['density', 'mass'], vmode: ['disp'] } },
    { id: 'vf', label: 'Water level after', type: 'number', value: 70, suffix: 'mL', showIf: { solve: ['density', 'mass'], vmode: ['disp'] } },
    { id: 'vUnit', label: 'Volume unit', type: 'select', value: 'cm3', options: [['cm3', 'cm³'], ['mL', 'mL'], ['L', 'liters (L)'], ['m3', 'm³'], ['in3', 'in³'], ['ft3', 'ft³'], ['gal', 'US gallons']] },
    { id: 'sf', label: 'Significant figures', type: 'select', value: '3', options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5']] }
  ],
  data: {
    mat: {
      water: ['water at 20 °C', 0.998], ethanol: ['ethanol', 0.789], ice: ['ice', 0.917], seawater: ['seawater', 1.025],
      aluminum: ['aluminum', 2.70, '2.70'], titanium: ['titanium', 4.51], zinc: ['zinc', 7.14], iron: ['iron', 7.87], steel: ['carbon steel', 7.85],
      copper: ['copper', 8.96], silver: ['silver', 10.49], lead: ['lead', 11.34], mercury: ['mercury', 13.53], gold: ['gold', 19.32],
      granite: ['granite', 2.7], glass: ['soda-lime glass', 2.5]
    },
    mu: { g: ['g', 1], kg: ['kg', 1000], mg: ['mg', 0.001], lb: ['lb', 453.59237], oz: ['oz', 28.349523125] },
    vu: { cm3: ['cm³', 1], mL: ['mL', 1], L: ['L', 1000], m3: ['m³', 1e6], in3: ['in³', 16.387064], ft3: ['ft³', 28316.846592], gal: ['gal', 3785.411784] },
    du: { gcm3: ['g/cm³', 1], kgm3: ['kg/m³', 0.001], gL: ['g/L', 0.001], lbft3: ['lb/ft³', 0.0160184634], lbin3: ['lb/in³', 27.6799047], lbgal: ['lb/gal', 0.119826427] },
    lu: { mm: 0.1, cm: 1, m: 100, in: 2.54, ft: 30.48 }
  },
  compute(v, H, D) {
    var n = Number(v.sf) || 3;
    function sf(x, k) {
      if (!isFinite(x)) return '—';
      if (x === 0) return '0';
      var r = Number(x.toPrecision(k));
      var e = Math.floor(Math.log10(Math.abs(r)));
      if (e < -3 || e >= 6) return (r / Math.pow(10, e)).toFixed(k - 1) + ' × 10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>';
      return H.fix(r, Math.max(0, k - 1 - e));
    }
    var mu = D.mu[v.mUnit] || D.mu.g, vu = D.vu[v.vUnit] || D.vu.cm3, du = D.du[v.dUnit] || D.du.gcm3;
    var lu = D.lu[v.lUnit] || 1;
    function rhoIn() {
      if (v.material && v.material !== 'custom' && D.mat[v.material]) return { g: D.mat[v.material][1], name: D.mat[v.material][0] };
      if (!(v.density > 0)) return null;
      return { g: v.density * du[1], name: '' };
    }
    function volIn() {
      var m = v.vmode, pi = Math.PI, out = null, how = '';
      if (m === 'cyl') { if (v.diam > 0 && v.height > 0) { var rr = v.diam * lu / 2; out = pi * rr * rr * v.height * lu; how = 'π × (' + H.num(v.diam, 4) + ' ÷ 2)² × ' + H.num(v.height, 4) + ' ' + v.lUnit; } }
      else if (m === 'box') { if (v.len > 0 && v.wid > 0 && v.height > 0) { out = v.len * v.wid * v.height * lu * lu * lu; how = H.num(v.len, 4) + ' × ' + H.num(v.wid, 4) + ' × ' + H.num(v.height, 4) + ' ' + v.lUnit; } }
      else if (m === 'sphere') { if (v.diam > 0) { var d = v.diam * lu; out = pi * d * d * d / 6; how = 'π × ' + H.num(v.diam, 4) + '³ ÷ 6 ' + v.lUnit; } }
      else if (m === 'disp') { if (v.vf > v.vi && v.vi >= 0) { out = v.vf - v.vi; how = H.num(v.vf, 4) + ' mL − ' + H.num(v.vi, 4) + ' mL'; } }
      else { if (v.volume > 0) { out = v.volume * vu[1]; how = ''; } }
      return out ? { cm3: out, how: how } : null;
    }
    var rows = [], val, label, expr, sub = '';
    if (v.solve === 'density') {
      if (!(v.mass > 0)) return { error: 'Enter the mass.' };
      var V = volIn();
      if (!V) return { error: v.vmode === 'disp' ? 'The water level after must be higher than before.' : 'Enter the volume or the object\'s dimensions.' };
      var gm = v.mass * mu[1], rho = gm / V.cm3;
      val = sf(rho / du[1], n) + ' ' + du[0];
      label = 'Density';
      expr = H.num(v.mass, 6) + ' ' + mu[0] + ' ÷ ' + sf(V.cm3, n) + ' cm³';
      if (V.how) rows.push(['Volume (' + V.how + ')', sf(V.cm3, n) + ' cm³']);
      rows.push(['In g/cm³ (g/mL)', sf(rho, n)]);
      rows.push(['In kg/m³', sf(rho * 1000, n)]);
      rows.push(['In lb/ft³', sf(rho / 0.0160184634, n)]);
      var best = null, bd = 1;
      Object.keys(D.mat).forEach(function (k) { var dd = Math.abs(D.mat[k][1] - rho) / D.mat[k][1]; if (dd < bd) { bd = dd; best = k; } });
      if (best && bd <= 0.02) rows.push(['Closest match', D.mat[best][0] + ' (' + D.mat[best][1] + ' g/cm³)', true]);
      sub = rho < 0.998 ? 'Less dense than water, so a solid piece of it floats.' : 'Denser than water (0.998 g/cm³ at 20 °C), so a solid piece of it sinks.';
    } else if (v.solve === 'mass') {
      var R = rhoIn();
      if (!R) return { error: 'Enter the density or pick a material.' };
      var V2 = volIn();
      if (!V2) return { error: v.vmode === 'disp' ? 'The water level after must be higher than before.' : 'Enter the volume or the object\'s dimensions.' };
      var g2 = R.g * V2.cm3;
      val = sf(g2 / mu[1], n) + ' ' + mu[0];
      label = 'Mass' + (R.name ? ' of ' + R.name : '');
      expr = sf(R.g, n) + ' g/cm³ × ' + sf(V2.cm3, n) + ' cm³';
      if (V2.how) rows.push(['Volume (' + V2.how + ')', sf(V2.cm3, n) + ' cm³']);
      rows.push(['In grams', sf(g2, n) + ' g']);
      rows.push(['In kilograms', sf(g2 / 1000, n) + ' kg']);
      rows.push(['In pounds', sf(g2 / 453.59237, n) + ' lb']);
      sub = 'Mass = density × volume. Weight on Earth is this mass × 9.81 m/s².';
    } else {
      if (!(v.mass > 0)) return { error: 'Enter the mass.' };
      var R2 = rhoIn();
      if (!R2) return { error: 'Enter the density or pick a material.' };
      var g3 = v.mass * mu[1], cm3 = g3 / R2.g;
      val = sf(cm3 / vu[1], n) + ' ' + vu[0];
      label = 'Volume' + (R2.name ? ' of ' + R2.name : '');
      expr = H.num(v.mass, 6) + ' ' + mu[0] + ' ÷ ' + sf(R2.g, n) + ' g/cm³';
      rows.push(['In cm³ (= mL)', sf(cm3, n), true]);
      rows.push(['In liters', sf(cm3 / 1000, n) + ' L']);
      rows.push(['In cubic inches', sf(cm3 / 16.387064, n) + ' in³']);
      rows.push(['Side of an equal cube', sf(Math.cbrt(cm3), n) + ' cm']);
      sub = 'Volume = mass ÷ density. Change the material or units above to compare.';
    }
    return { value: val, label: label, expr: expr, rows: rows, sub: sub };
  },
  quick: ({ r }) => `To calculate volume from mass and density, divide: <strong>V = m ÷ ρ</strong>. A 25.0 g piece of aluminum (density 2.70 g/cm³) has a volume of 25.0 ÷ 2.70 = <strong>${r.value}</strong>, the same as 9.26 mL. Keep the units matched: grams with g/cm³ gives cm³, and kilograms with kg/m³ gives m³.`,
  stepsTitle: 'How to calculate density, mass or volume',
  steps: [
    'Choose what you are solving for. The three forms are ρ = m ÷ V, m = ρ × V and V = m ÷ ρ.',
    'Enter the mass and pick its unit. In the lab, tare the balance with the empty container first so you record only the sample.',
    'Enter the density (or pick a material), or give the volume: directly, from a cylinder or block\'s dimensions, or from the rise in water level in a graduated cylinder.',
    'Check the units. The step people get wrong is mixing grams with kg/m³ or mL with m³; the calculator converts everything to g and cm³ before dividing.',
    'Round to the significant figures of your least precise measurement. 25.0 g and 2.70 g/cm³ both have three, so report 9.26 cm³.'
  ],
  formulaTitle: 'What is the formula for density, mass and volume?',
  formula: {
    expr: 'ρ = m ÷ V<br>m = ρ × V<br>V = m ÷ ρ',
    vars: [['ρ (rho)', 'density, usually g/cm³ for solids and liquids or kg/m³ in SI'], ['m', 'mass in g or kg'], ['V', 'volume in cm³, mL, L or m³ (1 cm³ = 1 mL exactly)']],
    note: 'Useful conversions: 1 g/cm³ = 1 g/mL = 1,000 kg/m³ = 62.43 lb/ft³. Cylinder volume is πr²h, a rectangular block is L × W × H and a sphere is πd³ ÷ 6.'
  },
  example: `<p>A student measures a metal cylinder: diameter 2.00 cm, height 5.00 cm, mass 140.7 g. What is the metal?</p>
<p>Volume = π × (2.00 ÷ 2)² × 5.00 = π × 1.00 × 5.00 = <strong>15.7 cm³</strong>.</p>
<p>Density = 140.7 g ÷ 15.71 cm³ = <strong>8.96 g/cm³</strong>, which matches copper. Select "Density" and "Cylinder" above to repeat it.</p>`,
  table: {
    title: 'What are the densities of common materials?',
    intro: 'Typical densities near room temperature, with the volume that 100 g of each occupies, worked out by the calculator above.',
    head: ['Material', 'g/cm³', 'kg/m³', 'lb/ft³', '100 g fills'],
    rows: ({ run, D, H }) => Object.keys(D.mat).map(k => {
      const g = D.mat[k][1];
      return [D.mat[k][0][0].toUpperCase() + D.mat[k][0].slice(1), D.mat[k][2] || String(g), H.num(g * 1000, 1), H.num(g * 62.42796, 1), run({ solve: 'volume', mass: 100, mUnit: 'g', material: k, vUnit: 'cm3', sf: '3' }).value];
    }),
    note: 'Metals are pure elements at 20–25 °C. Granite, glass and steel vary with composition (granite 2.6–2.8, glass 2.4–2.6, steel 7.75–8.05 g/cm³), and seawater ranges from about 1.020 to 1.029 g/cm³ depending on salinity and temperature.'
  },
  sections: [
    {
      h2: 'How do you calculate the density of a cylinder?',
      html: `<p>Measure the diameter with calipers, halve it to get the radius, and measure the height. Volume is V = πr²h. Then weigh the cylinder and divide mass by volume.</p>
<p>For a steel rod 1.50 cm across and 10.0 cm long weighing 138 g: r = 0.750 cm, V = π × 0.750² × 10.0 = 17.7 cm³, and ρ = 138 ÷ 17.7 = <strong>7.81 g/cm³</strong>, within the 7.75–8.05 range for steel. The same method gives the <strong>mass of a cylinder</strong> if you know the material: m = ρ × πr²h. For volume alone, use the <a href="/cylinder-volume-calculator">cylinder volume calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate the density of a rock or irregular object?',
      html: `<p>Use water displacement, because an irregular shape has no simple volume formula. Fill a graduated cylinder partway, read the level at the bottom of the meniscus, slide the rock in without splashing and read again. The rise is the rock's volume in mL, which equals cm³.</p>
<p>Example: a 52.4 g rock raises the water from 50.0 mL to 70.0 mL. V = 20.0 mL, so ρ = 52.4 ÷ 20.0 = <strong>2.62 g/cm³</strong>, typical of quartz-rich rock. Choose "Water displacement" in the calculator to do this directly. Porous rocks soak up water and read low; coat them or weigh them wet for better results.</p>`
    },
    {
      h2: 'How do you calculate the density of a metal and identify it?',
      html: `<p>Find the density from mass and volume, then compare it with the table above. Density is an intensive property: a paper clip and a girder of the same steel have the same density, so it works as a fingerprint for pure metals.</p>
<p>A 10.0 g coin-shaped sample with a volume of 0.952 cm³ has ρ = 10.5 g/cm³, matching silver (10.49). The calculator flags the closest material when your result is within 2% of a listed value. Alloys such as brass (about 8.4–8.7 g/cm³) and sterling silver fall between their component metals, so density alone can't always tell them apart.</p>`
    },
    {
      h2: 'How many significant figures should a density answer have?',
      html: `<p>Division follows the significant-figure rule for multiplication: the answer keeps as many significant figures as the least precise measurement. If the mass is 52.43 g (4 s.f.) and the volume 20.0 mL (3 s.f.), report 2.62 g/mL, not 2.6215.</p>
<p>Subtraction in the displacement method follows the decimal-place rule: 70.0 − 50.0 = 20.0 mL keeps one decimal place. A graduated cylinder marked every 1 mL can be read to ±0.1 mL by estimating between lines. For a full error estimate on a lab report, use the <a href="/uncertainty-calculator">uncertainty calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate volume from mass and density?', a: 'Divide mass by density: V = m ÷ ρ. For example, 25.0 g of aluminum at 2.70 g/cm³ has a volume of 9.26 cm³. Make sure the mass unit matches the density unit (g with g/cm³, kg with kg/m³).' },
    { q: 'What is the density of water?', a: 'Pure water is 0.998 g/cm³ at 20 °C and reaches its maximum of about 1.000 g/cm³ near 4 °C. For most classroom problems 1.00 g/mL is close enough.' },
    { q: 'How do you convert g/cm³ to kg/m³?', a: 'Multiply by 1,000. Aluminum at 2.70 g/cm³ is 2,700 kg/m³. To go from kg/m³ to g/cm³, divide by 1,000.' },
    { q: 'Is g/mL the same as g/cm³?', a: 'Yes. One milliliter is defined as exactly one cubic centimeter, so 1 g/mL = 1 g/cm³. Liquids are usually quoted in g/mL and solids in g/cm³.' },
    { q: 'Does density change with temperature?', a: 'Yes, slightly. Most materials expand when heated, so their density falls. Water is unusual: it is densest near 4 °C, and ice (0.917 g/cm³) is less dense than liquid water, which is why it floats.' },
    { q: 'How do you calculate mass from density and volume?', a: 'Multiply them: m = ρ × V. 2.00 L (2,000 cm³) of ethanol at 0.789 g/cm³ has a mass of 1,578 g, or about 1.58 kg.' },
    { q: 'Why does an object float or sink?', a: 'A solid object floats if its average density is less than the liquid\'s and sinks if it is greater. A steel ship floats because its hollow hull gives it an average density below that of seawater (about 1.025 g/cm³).' }
  ],
  related: ['cylinder-volume-calculator', 'foil-thickness-calculator', 'moles-calculator', 'specific-heat-calculator', 'uncertainty-calculator'],
  sources: [
    { name: 'OpenStax Chemistry 2e: 1.4 Measurements (density)', url: 'https://openstax.org/books/chemistry-2e/pages/1-4-measurements' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI', url: 'https://www.nist.gov/pml/special-publication-811' },
    { name: 'NIST Chemistry WebBook', url: 'https://webbook.nist.gov/chemistry/' },
    { name: 'USGS Water Science School: Water Density', url: 'https://www.usgs.gov/special-topics/water-science-school/science/water-density' }
  ]
};
