// Element list: [symbol, name, standard atomic weight or null]. Index = atomic number − 1.
// Weights are IUPAC (CIAAW) abridged/conventional values; null = no standard atomic weight (no stable isotopes
// with a characteristic terrestrial composition).
const EL = [
  ['H', 'Hydrogen', 1.008], ['He', 'Helium', 4.0026], ['Li', 'Lithium', 6.94], ['Be', 'Beryllium', 9.0122], ['B', 'Boron', 10.81],
  ['C', 'Carbon', 12.011], ['N', 'Nitrogen', 14.007], ['O', 'Oxygen', 15.999], ['F', 'Fluorine', 18.998], ['Ne', 'Neon', 20.180],
  ['Na', 'Sodium', 22.990], ['Mg', 'Magnesium', 24.305], ['Al', 'Aluminum', 26.982], ['Si', 'Silicon', 28.085], ['P', 'Phosphorus', 30.974],
  ['S', 'Sulfur', 32.06], ['Cl', 'Chlorine', 35.45], ['Ar', 'Argon', 39.95], ['K', 'Potassium', 39.098], ['Ca', 'Calcium', 40.078],
  ['Sc', 'Scandium', 44.956], ['Ti', 'Titanium', 47.867], ['V', 'Vanadium', 50.942], ['Cr', 'Chromium', 51.996], ['Mn', 'Manganese', 54.938],
  ['Fe', 'Iron', 55.845], ['Co', 'Cobalt', 58.933], ['Ni', 'Nickel', 58.693], ['Cu', 'Copper', 63.546], ['Zn', 'Zinc', 65.38],
  ['Ga', 'Gallium', 69.723], ['Ge', 'Germanium', 72.630], ['As', 'Arsenic', 74.922], ['Se', 'Selenium', 78.971], ['Br', 'Bromine', 79.904],
  ['Kr', 'Krypton', 83.798], ['Rb', 'Rubidium', 85.468], ['Sr', 'Strontium', 87.62], ['Y', 'Yttrium', 88.906], ['Zr', 'Zirconium', 91.22],
  ['Nb', 'Niobium', 92.906], ['Mo', 'Molybdenum', 95.95], ['Tc', 'Technetium', null], ['Ru', 'Ruthenium', 101.07], ['Rh', 'Rhodium', 102.91],
  ['Pd', 'Palladium', 106.42], ['Ag', 'Silver', 107.87], ['Cd', 'Cadmium', 112.41], ['In', 'Indium', 114.82], ['Sn', 'Tin', 118.71],
  ['Sb', 'Antimony', 121.76], ['Te', 'Tellurium', 127.60], ['I', 'Iodine', 126.90], ['Xe', 'Xenon', 131.29], ['Cs', 'Cesium', 132.91],
  ['Ba', 'Barium', 137.33], ['La', 'Lanthanum', 138.91], ['Ce', 'Cerium', 140.12], ['Pr', 'Praseodymium', 140.91], ['Nd', 'Neodymium', 144.24],
  ['Pm', 'Promethium', null], ['Sm', 'Samarium', 150.36], ['Eu', 'Europium', 151.96], ['Gd', 'Gadolinium', 157.25], ['Tb', 'Terbium', 158.93],
  ['Dy', 'Dysprosium', 162.50], ['Ho', 'Holmium', 164.93], ['Er', 'Erbium', 167.26], ['Tm', 'Thulium', 168.93], ['Yb', 'Ytterbium', 173.05],
  ['Lu', 'Lutetium', 174.97], ['Hf', 'Hafnium', 178.49], ['Ta', 'Tantalum', 180.95], ['W', 'Tungsten', 183.84], ['Re', 'Rhenium', 186.21],
  ['Os', 'Osmium', 190.23], ['Ir', 'Iridium', 192.22], ['Pt', 'Platinum', 195.08], ['Au', 'Gold', 196.97], ['Hg', 'Mercury', 200.59],
  ['Tl', 'Thallium', 204.38], ['Pb', 'Lead', 207.2], ['Bi', 'Bismuth', 208.98], ['Po', 'Polonium', null], ['At', 'Astatine', null],
  ['Rn', 'Radon', null], ['Fr', 'Francium', null], ['Ra', 'Radium', null], ['Ac', 'Actinium', null], ['Th', 'Thorium', 232.04],
  ['Pa', 'Protactinium', 231.04], ['U', 'Uranium', 238.03], ['Np', 'Neptunium', null], ['Pu', 'Plutonium', null], ['Am', 'Americium', null],
  ['Cm', 'Curium', null], ['Bk', 'Berkelium', null], ['Cf', 'Californium', null], ['Es', 'Einsteinium', null], ['Fm', 'Fermium', null],
  ['Md', 'Mendelevium', null], ['No', 'Nobelium', null], ['Lr', 'Lawrencium', null], ['Rf', 'Rutherfordium', null], ['Db', 'Dubnium', null],
  ['Sg', 'Seaborgium', null], ['Bh', 'Bohrium', null], ['Hs', 'Hassium', null], ['Mt', 'Meitnerium', null], ['Ds', 'Darmstadtium', null],
  ['Rg', 'Roentgenium', null], ['Cn', 'Copernicium', null], ['Nh', 'Nihonium', null], ['Fl', 'Flerovium', null], ['Mc', 'Moscovium', null],
  ['Lv', 'Livermorium', null], ['Ts', 'Tennessine', null], ['Og', 'Oganesson', null]
];

export default {
  slug: 'atom-calculator',
  hub: 'science',
  name: 'Protons Neutrons Electrons Calculator',
  title: 'Protons, Neutrons, Electrons Calculator: Fe-56 3+ Is 26/30/23',
  h1: 'Find the Protons, Neutrons and Electrons in Any Atom or Ion',
  meta: 'An Fe³⁺ ion with mass number 56 has 26 protons, 30 neutrons and 23 electrons. Pick any of the 118 elements, enter mass number and charge, get all three.',
  keyword: 'how to calculate protons neutrons and electrons',
  also: ['protons neutrons and electrons calculator', 'how to calculate protons neutrons and electrons worksheet', 'how to calculate the number of neutrons in an element', 'how to calculate the number of protons neutrons and electrons', 'how to calculate electron number', 'how to calculate atomic mass of isotopes with abundance'],
  updated: '2026-11-13',
  inputs: [
    { id: 'el', label: 'Element', type: 'select', value: '26', options: EL.map((e, i) => [String(i + 1), `${e[0]}: ${e[1]} (Z = ${i + 1})`]), wide: true },
    { id: 'A', label: 'Mass number A (protons + neutrons)', type: 'number', value: 56, placeholder: 'blank = rounded atomic weight', help: 'From the isotope name: carbon-14 → 14. Leave blank to use the rounded atomic weight, as most worksheets do.' },
    { id: 'q', label: 'Charge', type: 'number', value: 3, help: 'Positive for cations (Fe³⁺ → 3), negative for anions (Cl⁻ → −1), 0 for a neutral atom.' }
  ],
  data: { el: EL },
  compute(v, H, D) {
    var Z = parseInt(v.el, 10);
    var e = D.el[Z - 1];
    if (!e) return { error: 'Pick an element.' };
    var A = v.A, fromWeight = false;
    if (typeof A !== 'number' || !isFinite(A)) {
      if (e[2] == null) return { error: e[1] + ' has no stable isotopes or standard atomic weight, so enter the mass number of the isotope.' };
      A = Math.round(e[2]); fromWeight = true;
    }
    if (A !== Math.round(A) || A < 1) return { error: 'The mass number must be a whole number (protons + neutrons).' };
    if (A < Z) return { error: 'The mass number cannot be smaller than the atomic number (' + Z + ' for ' + e[1].toLowerCase() + ').' };
    var q = typeof v.q === 'number' && isFinite(v.q) ? v.q : 0;
    if (q !== Math.round(q)) return { error: 'The charge must be a whole number.' };
    var p = Z, n = A - Z, el = Z - q;
    if (el < 0) return { error: 'A charge of +' + q + ' would need more electrons than ' + e[1].toLowerCase() + ' has (' + Z + ').' };
    var qs = q === 0 ? '' : (Math.abs(q) === 1 ? '' : Math.abs(q)) + (q > 0 ? '+' : '−');
    var note = '<sup>' + A + '</sup>' + e[0] + (qs ? '<sup>' + qs + '</sup>' : '');
    var kind = q > 0 ? 'Cation (lost ' + q + ' electron' + (q === 1 ? '' : 's') + ')' : q < 0 ? 'Anion (gained ' + (-q) + ' electron' + (q === -1 ? '' : 's') + ')' : 'Neutral atom';
    var rows = [
      ['Protons (= atomic number Z)', String(p), true],
      ['Neutrons (A − Z)', String(n), true],
      ['Electrons (Z − charge)', String(el), true],
      ['Isotope notation', note],
      ['Hyphen notation', e[1].toLowerCase() + '-' + A],
      ['Type', kind],
      ['Mass number used', A + (fromWeight ? ' (rounded from atomic weight ' + e[2] + ')' : '')],
      ['Standard atomic weight', e[2] == null ? 'none (radioactive only)' : String(e[2])],
      ['Neutron-to-proton ratio', H.num(n / p, 3)]
    ];
    return {
      value: p + ' p · ' + n + ' n · ' + el + ' e',
      label: 'Protons, neutrons and electrons in ' + e[1].toLowerCase() + '-' + A + (qs ? ' (' + qs + ')' : ''),
      expr: 'Z = ' + Z + ', A = ' + A + ', charge = ' + (q > 0 ? '+' : '') + q,
      rows: rows,
      sub: fromWeight ? 'Worksheet method: neutrons = rounded atomic weight − atomic number. Real samples are a mix of isotopes, so a given atom may differ.' : 'Protons fix the element, neutrons fix the isotope, and electrons fix the charge.'
    };
  },
  quick: ({ r }) => `To calculate protons, neutrons and electrons: protons = atomic number (Z), neutrons = mass number − atomic number (A − Z), and electrons = protons − charge. Iron has Z = 26, so an Fe³⁺ ion with mass number 56 has 26 protons, 56 − 26 = 30 neutrons and 26 − 3 = 23 electrons: <strong>${r.value}</strong>.`,
  stepsTitle: 'How to find protons, neutrons and electrons',
  steps: [
    'Look up the atomic number Z on the periodic table (the whole number in the element\'s box). That is the number of protons, always.',
    'Find the mass number A. It is the number after the name or symbol (carbon-14, U-235) or the superscript on the left (<sup>14</sup>C). If none is given, round the atomic weight to the nearest whole number.',
    'Neutrons = A − Z. Do not subtract the unrounded atomic weight; neutrons come in whole numbers.',
    'Electrons = Z − charge. A 2+ ion has two fewer electrons than protons, a 2− ion two more. Adding the charge instead of subtracting it is the most common mistake.'
  ],
  formulaTitle: 'What are the formulas for protons, neutrons and electrons?',
  formula: {
    expr: 'protons = Z<br>neutrons = A − Z<br>electrons = Z − charge',
    vars: [['Z', 'atomic number, from the periodic table'], ['A', 'mass number = protons + neutrons (a whole number)'], ['charge', 'ion charge with its sign: +2, −1, or 0 for neutral'], ['<sup>A</sup>X<sup>charge</sup>', 'isotope notation, e.g. <sup>37</sup>Cl<sup>−</sup>']],
    note: 'Electrons are left out of the mass number because each has only about 1/1,836 of a proton\'s mass.'
  },
  example: `<p><strong>Three worksheet problems.</strong></p>
<p><sup>32</sup>S<sup>2−</sup>: sulfur has Z = 16, so 16 protons; neutrons = 32 − 16 = <strong>16</strong>; electrons = 16 − (−2) = <strong>18</strong>.</p>
<p>Uranium-235 (neutral): Z = 92, so 92 protons, 235 − 92 = <strong>143 neutrons</strong> and 92 electrons.</p>
<p>Ca²⁺ with no mass number given: Ca's atomic weight 40.078 rounds to 40, so 20 protons, <strong>20 neutrons</strong> and 20 − 2 = <strong>18 electrons</strong>.</p>`,
  table: {
    title: 'How many protons, neutrons and electrons do common atoms and ions have?',
    intro: 'Typical worksheet species, each solved by the calculator.',
    head: ['Species', 'Protons', 'Neutrons', 'Electrons'],
    rows: ({ run }) => [
      ['Hydrogen-1', 1, 1, 0], ['Deuterium (hydrogen-2)', 1, 2, 0], ['Carbon-12', 6, 12, 0], ['Carbon-14', 6, 14, 0], ['Oxide ion O²⁻', 8, 16, -2],
      ['Sodium ion Na⁺', 11, 23, 1], ['Chloride ion ³⁵Cl⁻', 17, 35, -1], ['Calcium ion Ca²⁺', 20, 40, 2], ['Iron(III) ion ⁵⁶Fe³⁺', 26, 56, 3],
      ['Copper-63 ion Cu²⁺', 29, 63, 2], ['Silver-107', 47, 107, 0], ['Gold-197', 79, 197, 0], ['Uranium-238', 92, 238, 0]
    ].map(x => { const r = run({ el: String(x[1]), A: x[2], q: x[3] }); return [x[0], r.rows[0][1], r.rows[1][1], r.rows[2][1]]; }),
    note: 'Na⁺, O²⁻ and neon all have 10 electrons: ions often gain or lose electrons until they match the nearest noble gas.'
  },
  sections: [
    {
      h2: 'How do you calculate the number of neutrons in an element?',
      html: `<p>Subtract the atomic number from the mass number. For a specific isotope that is exact: chlorine-37 has 37 − 17 = 20 neutrons. When a problem names only the element, the convention is to round the atomic weight: chlorine's 35.45 rounds to 35, giving 18 neutrons.</p>
<p>That shortcut describes the most common isotope only when one isotope dominates. Natural chlorine is about 76% chlorine-35 and 24% chlorine-37, and copper (atomic weight 63.546, which rounds to 64) is actually about 69% copper-63 and 31% copper-65, with no stable copper-64 at all. Bromine (79.904) is a near 50/50 mix of bromine-79 and bromine-81. So if the question gives a mass number, always use it.</p>`
    },
    {
      h2: 'How does the charge change the number of electrons?',
      html: `<p>Ions form when atoms lose or gain electrons; the protons never change in a chemical reaction. Subtract a positive charge and add a negative one: Mg²⁺ has 12 − 2 = 10 electrons, N³⁻ has 7 + 3 = 10.</p>
<p>Metals on the left of the table tend to lose electrons (Na⁺, Ca²⁺, Al³⁺), and nonmetals on the right tend to gain them (F⁻, O²⁻, N³⁻). Transition metals can form several ions, which is why iron appears as both Fe²⁺ (24 electrons) and Fe³⁺ (23).</p>`
    },
    {
      h2: 'How do you calculate atomic mass from isotopes and abundance?',
      html: `<p>Multiply each isotope's mass by its fractional abundance and add the results. For chlorine:</p>
<p>(34.969 u × 0.7576) + (36.966 u × 0.2424) = 26.49 + 8.96 = <strong>35.45 u</strong>, the value on the periodic table.</p>
<p>This weighted average is why atomic weights are rarely whole numbers, and why you cannot get the neutron count of a single atom straight from the periodic table without rounding.</p>`
    },
    {
      h2: 'What is the difference between mass number and atomic mass?',
      html: `<p>Mass number (A) is a count, protons plus neutrons in one nucleus, so it is always a whole number. Atomic mass is a measured mass in unified atomic mass units (u, also called daltons): carbon-12 is exactly 12 u by definition, but oxygen-16 is 15.995 u and iron-56 is 55.935 u, slightly less than their mass numbers because of nuclear binding energy. Standard atomic weight is the abundance-weighted average of those masses for the natural element.</p>`
    }
  ],
  faq: [
    { q: 'Is the number of protons always equal to the atomic number?', a: 'Yes. The atomic number is defined as the number of protons, and it is what makes an element that element. Every carbon atom has 6 protons; an atom with 7 is nitrogen.' },
    { q: 'Do neutral atoms have equal protons and electrons?', a: 'Yes. A neutral atom has no net charge, so its electrons equal its protons. Neutral oxygen has 8 of each.' },
    { q: 'How many neutrons does hydrogen have?', a: 'Ordinary hydrogen (protium, hydrogen-1) has none. Deuterium (hydrogen-2) has 1 and tritium (hydrogen-3) has 2.' },
    { q: 'Can an atom have more neutrons than protons?', a: 'Yes, and most do beyond the lightest elements. Iron-56 has 30 neutrons for 26 protons, and uranium-238 has 146 neutrons for 92 protons. Heavy nuclei need extra neutrons to stay together.' },
    { q: 'What changes in an isotope?', a: 'Only the neutron count. Carbon-12, carbon-13 and carbon-14 all have 6 protons and, when neutral, 6 electrons, but 6, 7 and 8 neutrons. Their chemistry is nearly identical; their mass and nuclear stability differ.' },
    { q: 'How do I find the number of valence electrons?', a: 'For main-group elements, use the group: groups 1 and 2 have 1 and 2 valence electrons, and groups 13 to 18 have 3 to 8 (helium has 2). That is a different question from the total electron count this calculator gives.' },
    { q: 'Why does the calculator say an element has no standard atomic weight?', a: 'Technetium, promethium, polonium through actinium (Z = 84–89) and every element after uranium have no stable isotopes with a fixed natural mix, so IUPAC lists no standard atomic weight for them. Enter the mass number of the isotope you mean, such as technetium-99.' }
  ],
  related: ['moles-calculator', 'half-life-calculator', 'theoretical-yield-calculator', 'density-calculator', 'scientific-notation-calculator'],
  sources: [
    { name: 'IUPAC Commission on Isotopic Abundances and Atomic Weights (CIAAW): Standard Atomic Weights', url: 'https://www.ciaaw.org/atomic-weights.htm' },
    { name: 'NIST: Atomic Weights and Isotopic Compositions for All Elements', url: 'https://www.nist.gov/pml/atomic-weights-and-isotopic-compositions-relative-atomic-masses' },
    { name: 'IUPAC: Periodic Table of Elements', url: 'https://iupac.org/what-we-do/periodic-table-of-elements/' },
    { name: 'OpenStax Chemistry 2e: 2.3 Atomic Structure and Symbolism', url: 'https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism' }
  ]
};
