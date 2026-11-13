export default {
  slug: 'moles-calculator',
  hub: 'science',
  name: 'Moles Calculator',
  title: 'Moles Calculator: 2.50 mol CO₂ = 1.51 × 10²⁴ Molecules',
  h1: 'Moles to Molecules, Grams and mL Converter',
  meta: 'Multiply moles by 6.022 × 10²³ to get molecules: 2.50 mol of CO₂ is 1.51 × 10²⁴ molecules and 110 g. Convert grams, moles, particles, mL of solution and gas.',
  keyword: 'how to calculate moles to molecules',
  also: ['moles calculator', 'how to calculate ml to moles', 'how to calculate moles from milliliters', 'grams to moles calculator', 'moles to grams', 'molecules to moles', 'avogadro\'s number calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'known', label: 'I know the', type: 'select', value: 'moles', options: [['moles', 'Number of moles'], ['grams', 'Mass in grams'], ['particles', 'Number of molecules / atoms'], ['solution', 'Volume of a solution (mL) and its molarity'], ['liquid', 'Volume of a pure liquid (mL) and its density'], ['gas', 'Volume of a gas (L)']] },
    { id: 'mol', label: 'Moles', type: 'number', value: 2.5, suffix: 'mol', showIf: { known: ['moles'] } },
    { id: 'g', label: 'Mass', type: 'number', value: 10, suffix: 'g', showIf: { known: ['grams'] } },
    { id: 'parts', label: 'Number of particles', type: 'number', value: 3.011e23, showIf: { known: ['particles'] }, help: 'Type e-notation for big numbers, e.g. 3.011e23.' },
    { id: 'mL', label: 'Volume', type: 'number', value: 25, suffix: 'mL', showIf: { known: ['solution', 'liquid'] } },
    { id: 'molarity', label: 'Molarity', type: 'number', value: 0.15, suffix: 'mol/L', showIf: { known: ['solution'] } },
    { id: 'dens', label: 'Density of the liquid', type: 'number', value: 1, suffix: 'g/mL', showIf: { known: ['liquid'] } },
    { id: 'gasL', label: 'Gas volume', type: 'number', value: 5, suffix: 'L', showIf: { known: ['gas'] } },
    { id: 'gasT', label: 'Conditions', type: 'select', value: 'stp', showIf: { known: ['gas'] }, options: [['stp', '0 °C and 1 atm (22.414 L/mol)'], ['iupac', '0 °C and 1 bar, IUPAC STP (22.711 L/mol)'], ['room', '25 °C and 1 atm (24.465 L/mol)']] },
    { id: 'compound', label: 'Substance', type: 'select', value: 'co2', options: [['co2', 'Carbon dioxide, CO₂'], ['h2o', 'Water, H₂O'], ['o2', 'Oxygen, O₂'], ['n2', 'Nitrogen, N₂'], ['ch4', 'Methane, CH₄'], ['nh3', 'Ammonia, NH₃'], ['etoh', 'Ethanol, C₂H₅OH'], ['glucose', 'Glucose, C₆H₁₂O₆'], ['sucrose', 'Sucrose, C₁₂H₂₂O₁₁'], ['nacl', 'Sodium chloride, NaCl'], ['naoh', 'Sodium hydroxide, NaOH'], ['hcl', 'Hydrogen chloride, HCl'], ['h2so4', 'Sulfuric acid, H₂SO₄'], ['caco3', 'Calcium carbonate, CaCO₃'], ['c', 'Carbon, C'], ['al', 'Aluminum, Al'], ['fe', 'Iron, Fe'], ['cu', 'Copper, Cu'], ['au', 'Gold, Au'], ['custom', 'Other (enter molar mass)']] },
    { id: 'mm', label: 'Molar mass', type: 'number', value: 100, suffix: 'g/mol', showIf: { compound: ['custom'] } },
    { id: 'apf', label: 'Atoms per molecule or formula unit', type: 'number', value: 1, showIf: { compound: ['custom'] } },
    { id: 'sf', label: 'Significant figures', type: 'select', value: '3', options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5']] }
  ],
  data: {
    NA: 6.02214076e23,
    vm: { stp: 22.414, iupac: 22.711, room: 24.465 },
    sub: {
      co2: ['CO₂', 44.009, 3, 'molecules'], h2o: ['H₂O', 18.015, 3, 'molecules'], o2: ['O₂', 31.998, 2, 'molecules'], n2: ['N₂', 28.014, 2, 'molecules'],
      ch4: ['CH₄', 16.043, 5, 'molecules'], nh3: ['NH₃', 17.031, 4, 'molecules'], etoh: ['C₂H₅OH', 46.069, 9, 'molecules'],
      glucose: ['C₆H₁₂O₆', 180.156, 24, 'molecules'], sucrose: ['C₁₂H₂₂O₁₁', 342.297, 45, 'molecules'],
      nacl: ['NaCl', 58.44, 2, 'formula units'], naoh: ['NaOH', 39.997, 3, 'formula units'], hcl: ['HCl', 36.458, 2, 'molecules'],
      h2so4: ['H₂SO₄', 98.072, 7, 'molecules'], caco3: ['CaCO₃', 100.086, 5, 'formula units'],
      c: ['C', 12.011, 1, 'atoms'], al: ['Al', 26.982, 1, 'atoms'], fe: ['Fe', 55.845, 1, 'atoms'], cu: ['Cu', 63.546, 1, 'atoms'], au: ['Au', 196.97, 1, 'atoms']
    }
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
    var NA = D.NA, s;
    if (v.compound === 'custom') {
      if (!(v.mm > 0)) return { error: 'Enter the molar mass in g/mol.' };
      var apf = v.apf >= 1 ? Math.round(v.apf) : 1;
      s = ['substance', v.mm, apf, apf === 1 ? 'atoms' : 'particles'];
    } else s = D.sub[v.compound] || D.sub.co2;
    var mm = s[1], kind = s[3], mol, how = '', expr = '';
    if (v.known === 'grams') {
      if (!(v.g > 0)) return { error: 'Enter the mass in grams.' };
      mol = v.g / mm; expr = H.num(v.g, 6) + ' g ÷ ' + H.num(mm, 3) + ' g/mol';
    } else if (v.known === 'particles') {
      if (!(v.parts > 0)) return { error: 'Enter the number of particles (e.g. 3.011e23).' };
      mol = v.parts / NA; expr = sf(v.parts, 4) + ' ÷ 6.022 × 10<sup>23</sup>';
    } else if (v.known === 'solution') {
      if (!(v.mL > 0) || !(v.molarity > 0)) return { error: 'Enter the volume in mL and the molarity.' };
      mol = v.molarity * v.mL / 1000; expr = H.num(v.molarity, 6) + ' mol/L × ' + H.num(v.mL / 1000, 6) + ' L';
      how = 'solution';
    } else if (v.known === 'liquid') {
      if (!(v.mL > 0) || !(v.dens > 0)) return { error: 'Enter the volume in mL and the liquid\'s density.' };
      mol = v.mL * v.dens / mm; expr = H.num(v.mL, 6) + ' mL × ' + H.num(v.dens, 4) + ' g/mL ÷ ' + H.num(mm, 3) + ' g/mol';
    } else if (v.known === 'gas') {
      if (!(v.gasL > 0)) return { error: 'Enter the gas volume in liters.' };
      var vm = D.vm[v.gasT] || 22.414;
      mol = v.gasL / vm; expr = H.num(v.gasL, 6) + ' L ÷ ' + H.num(vm, 3) + ' L/mol';
    } else {
      if (!(v.mol > 0)) return { error: 'Enter the number of moles.' };
      mol = v.mol; expr = H.num(v.mol, 6) + ' mol × 6.022 × 10<sup>23</sup>';
    }
    var N = mol * NA, atoms = N * s[2], grams = mol * mm;
    var rows = [
      ['Moles', sf(mol, n) + ' mol', v.known !== 'moles'],
      ['Mass', sf(grams, n) + ' g', false],
      [kind.charAt(0).toUpperCase() + kind.slice(1), sf(N, n), v.known === 'moles']
    ];
    if (s[2] > 1) rows.push(['Total atoms (' + s[2] + ' per ' + (kind === 'formula units' ? 'formula unit' : 'molecule') + ')', sf(atoms, n)]);
    if (how === 'solution') rows.push(['Millimoles', sf(mol * 1000, n) + ' mmol']);
    rows.push(['Molar mass used', H.num(mm, 3) + ' g/mol']);
    var isMol = v.known === 'moles';
    return {
      value: isMol ? sf(N, n) : sf(mol, n) + ' mol',
      label: isMol ? kind.charAt(0).toUpperCase() + kind.slice(1) + ' in ' + H.num(v.mol, 6) + ' mol of ' + s[0] : 'Moles of ' + s[0],
      expr: expr,
      rows: rows,
      sub: 'Avogadro\'s number is exactly 6.02214076 × 10<sup>23</sup> per mole (SI, 2019), so it never limits your significant figures.'
    };
  },
  quick: ({ r }) => `To convert moles to molecules, multiply by Avogadro's number, 6.022 × 10²³ per mole. So 2.50 mol of carbon dioxide is 2.50 × 6.022 × 10²³ = <strong>${r.value} molecules</strong>, holding 4.52 × 10²⁴ atoms (3 per CO₂) and weighing 110 g. To go from molecules back to moles, divide by Avogadro's number.`,
  stepsTitle: 'How to convert between grams, moles and molecules',
  steps: [
    'Find the molar mass by adding the atomic weights in the formula. CO₂ = 12.011 + 2 × 15.999 = 44.009 g/mol. Pick a substance above or enter your own.',
    'Get to moles first. Grams ÷ molar mass; molecules ÷ 6.022 × 10²³; mL of solution × molarity ÷ 1,000; mL of pure liquid × density ÷ molar mass.',
    'From moles, multiply by Avogadro\'s number for molecules, or by molar mass for grams. Moles are the bridge: you never go straight from grams to molecules.',
    'For atoms, multiply molecules by the atoms in one formula. People often forget this step: 1 mol of H₂O contains 3 mol of atoms.',
    'Round to the significant figures of your measured value. Avogadro\'s number is exact and molar masses carry 4–5 digits, so they rarely limit the answer.'
  ],
  formulaTitle: 'What are the mole conversion formulas?',
  formula: {
    expr: 'n = m ÷ M<br>N = n × N<sub>A</sub><br>n = c × V(L)<br>n = V<sub>gas</sub> ÷ V<sub>m</sub>',
    vars: [['n', 'amount of substance in moles (mol)'], ['m', 'mass in grams'], ['M', 'molar mass in g/mol'], ['N', 'number of particles (molecules, atoms or formula units)'], ['N<sub>A</sub>', 'Avogadro constant, 6.02214076 × 10²³ mol⁻¹ (exact)'], ['c', 'molarity in mol/L'], ['V<sub>m</sub>', 'molar volume of an ideal gas: 22.414 L/mol at 0 °C and 1 atm']]
  },
  example: `<p>A student dissolves 5.00 g of glucose (C₆H₁₂O₆, 180.156 g/mol). How many molecules and atoms is that?</p>
<p>Moles = 5.00 ÷ 180.156 = <strong>0.0278 mol</strong>.</p>
<p>Molecules = 0.02775 × 6.022 × 10²³ = <strong>1.67 × 10²² molecules</strong>.</p>
<p>Each glucose has 6 + 12 + 6 = 24 atoms, so atoms = 1.671 × 10²² × 24 = <strong>4.01 × 10²³ atoms</strong>.</p>`,
  table: {
    title: 'How many molecules are in 10 grams of common substances?',
    intro: 'Moles and particles in 10.0 g of each substance, from the calculator above using IUPAC standard atomic weights.',
    head: ['Substance', 'Molar mass (g/mol)', 'Moles in 10.0 g', 'Particles in 10.0 g'],
    rows: ({ run, D }) => ['h2o', 'co2', 'o2', 'n2', 'ch4', 'nh3', 'etoh', 'glucose', 'sucrose', 'nacl', 'naoh', 'caco3', 'fe', 'cu', 'au'].map(k => {
      const r = run({ known: 'grams', g: 10, compound: k, sf: '3' });
      return [D.sub[k][0], String(D.sub[k][1]), r.rows[0][1], r.rows[2][1] + ' ' + D.sub[k][3]];
    }),
    note: 'Ionic compounds such as NaCl are counted in formula units, not molecules; metals are counted in atoms.'
  },
  sections: [
    {
      h2: 'How do you convert molecules to moles?',
      html: `<p>Divide the number of molecules by Avogadro's number. 3.011 × 10²³ water molecules ÷ 6.022 × 10²³ = <strong>0.500 mol</strong>, which weighs 0.500 × 18.015 = 9.01 g. On a calculator, type it as 3.011E23 ÷ 6.022E23 to avoid bracket mistakes.</p>
<p>The same works for atoms and ions: 1.20 × 10²⁴ iron atoms ÷ 6.022 × 10²³ = 1.99 mol of Fe, or 111 g. Choose "Number of molecules / atoms" above to do it with any substance.</p>`
    },
    {
      h2: 'How do you calculate moles from mL?',
      html: `<p>It depends on what is in the flask.</p>
<ul><li><strong>A solution:</strong> moles = molarity × volume in liters. 25.0 mL of 0.150 M HCl contains 0.150 × 0.0250 = <strong>0.00375 mol</strong> (3.75 mmol). This is the default "solution" setting above and the step used in every titration.</li>
<li><strong>A pure liquid:</strong> convert mL to grams with the density, then divide by molar mass. 10.0 mL of ethanol × 0.789 g/mL = 7.89 g, and 7.89 ÷ 46.069 = <strong>0.171 mol</strong>. For water at room temperature, 18.0 mL is very nearly 1.00 mol.</li>
<li><strong>A gas:</strong> divide liters by the molar volume. At 0 °C and 1 atm, 5.00 L ÷ 22.414 L/mol = 0.223 mol.</li></ul>`
    },
    {
      h2: 'How do you convert grams to moles?',
      html: `<p>Divide the mass by the molar mass. For 50.0 g of table salt: NaCl = 22.990 + 35.45 = 58.44 g/mol, so 50.0 ÷ 58.44 = <strong>0.856 mol</strong>. To go from moles to grams, multiply instead: 0.250 mol of CaCO₃ × 100.09 g/mol = 25.0 g.</p>
<p>Use the atomic weights printed on your class periodic table so your answer matches the key; values above follow the current IUPAC (CIAAW) standard atomic weights, which differ from older tables in the third or fourth decimal place at most. For moles of each reactant in a reaction, continue with the <a href="/theoretical-yield-calculator">theoretical yield calculator</a>.</p>`
    },
    {
      h2: 'Why is Avogadro\'s number exact?',
      html: `<p>Since the SI redefinition of May 20, 2019, the mole has been defined by fixing the Avogadro constant at exactly 6.02214076 × 10²³ mol⁻¹. Before then it was a measured value tied to the number of atoms in 12 g of carbon-12. Because it is now exact, it never limits the significant figures of an answer; your measured mass or volume does.</p>
<p>A side effect is that the molar mass of carbon-12 is no longer exactly 12 g/mol, but the difference is less than one part in a billion, far below anything a school or university balance can detect.</p>`
    }
  ],
  faq: [
    { q: 'How many molecules are in one mole?', a: 'One mole contains exactly 6.02214076 × 10²³ particles, Avogadro\'s number. Most textbooks round it to 6.022 × 10²³ or 6.02 × 10²³.' },
    { q: 'How many atoms are in 2 moles of water?', a: 'Two moles of H₂O contain 2 × 6.022 × 10²³ = 1.20 × 10²⁴ molecules, and each molecule has 3 atoms, so there are 3.61 × 10²⁴ atoms.' },
    { q: 'How many moles are in 100 grams of water?', a: '100 g ÷ 18.015 g/mol = 5.55 mol of water, or about 3.34 × 10²⁴ molecules.' },
    { q: 'How many moles of gas are in 1 liter at STP?', a: 'At 0 °C and 1 atm, 1 L of an ideal gas is 1 ÷ 22.414 = 0.0446 mol. Under the IUPAC definition of STP (0 °C and 1 bar) the molar volume is 22.711 L/mol, giving 0.0440 mol.' },
    { q: 'What is the difference between molecules, atoms and formula units?', a: 'A molecule is a covalently bonded unit such as CO₂; an atom is a single element particle; a formula unit is the simplest ratio in an ionic solid such as NaCl, which has no discrete molecules. Avogadro\'s number applies to all three.' },
    { q: 'How do you convert moles to grams?', a: 'Multiply moles by molar mass. 2.50 mol of CO₂ × 44.009 g/mol = 110 g.' },
    { q: 'How do you find the mole ratio?', a: 'Read it from the coefficients of the balanced equation. In 2H₂ + O₂ → 2H₂O, the ratio of H₂ to O₂ is 2:1. Use it to convert moles of one substance to moles of another before converting to grams.' }
  ],
  related: ['theoretical-yield-calculator', 'dilution-calculator', 'density-calculator', 'atom-calculator', 'scientific-notation-calculator'],
  sources: [
    { name: 'NIST CODATA: Avogadro constant', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?na' },
    { name: 'IUPAC CIAAW: Standard atomic weights', url: 'https://www.ciaaw.org/atomic-weights.htm' },
    { name: 'OpenStax Chemistry 2e: 3.1 Formula Mass and the Mole Concept', url: 'https://openstax.org/books/chemistry-2e/pages/3-1-formula-mass-and-the-mole-concept' },
    { name: 'BIPM: The International System of Units (SI Brochure)', url: 'https://www.bipm.org/en/publications/si-brochure' }
  ]
};
