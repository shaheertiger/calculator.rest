export default {
  slug: 'half-life-calculator',
  hub: 'science',
  name: 'Half-Life Calculator',
  title: 'Half-Life Calculator: 200 mg After 4 Half-Lives Leaves 12.5 mg',
  h1: 'Half-Life Calculator for Radioactive Decay and Reaction Kinetics',
  meta: 'N = N₀ × (½)^(t/T): 200 mg with a 6-hour half-life falls to 12.5 mg in 24 hours. Solve for amount left, half-life or time, including zero-order kinetics.',
  keyword: 'how to calculate half life',
  also: ['half life calculator', 'how to calculate half life for zero order', 'how to calculate half life apes', 'radioactive decay calculator', 'how to calculate half life from a graph', 'carbon dating calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'order', label: 'Type of decay', type: 'select', value: 'first', options: [['first', 'First order (radioactive decay, most drugs)'], ['zero', 'Zero order reaction'], ['second', 'Second order reaction']] },
    { id: 'solve', label: 'Solve for', type: 'select', value: 'remaining', showIf: { order: ['first'] }, options: [['remaining', 'Amount remaining'], ['halflife', 'Half-life'], ['time', 'Time elapsed']] },
    { id: 'n0', label: 'Initial amount (N₀)', type: 'number', value: 200, showIf: { order: ['first'] } },
    { id: 'nt', label: 'Amount remaining (N)', type: 'number', value: 12.5, showIf: { order: ['first'], solve: ['halflife', 'time'] } },
    { id: 'aUnit', label: 'Amount unit', type: 'select', value: 'mg', showIf: { order: ['first'] }, options: [['mg', 'mg'], ['g', 'g'], ['µg', 'µg'], ['kg', 'kg'], ['mol', 'mol'], ['%', '%'], ['atoms', 'atoms (nuclei)'], ['Bq', 'Bq (activity)'], ['counts/min', 'counts per minute']] },
    { id: 'thalf', label: 'Half-life (T½)', type: 'number', value: 6, showIf: { order: ['first'], solve: ['remaining', 'time'] } },
    { id: 'a0', label: 'Initial concentration [A]₀', type: 'number', value: 0.8, suffix: 'M', showIf: { order: ['zero', 'second'] } },
    { id: 'k', label: 'Rate constant k', type: 'number', value: 0.02, showIf: { order: ['zero', 'second'] }, help: 'Zero order: M per time unit. Second order: 1/(M · time unit).' },
    { id: 't', label: 'Time elapsed (t)', type: 'number', value: 24, showIf: { solve: ['remaining', 'halflife'] } },
    { id: 'tUnit', label: 'Time unit', type: 'select', value: 'hours', options: [['seconds', 'seconds'], ['minutes', 'minutes'], ['hours', 'hours'], ['days', 'days'], ['years', 'years']] },
    { id: 'sf', label: 'Significant figures', type: 'select', value: '3', options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5']] }
  ],
  compute(v, H) {
    var n = Number(v.sf) || 3;
    function sf(x, k) {
      if (!isFinite(x)) return '—';
      if (x === 0) return '0';
      var r = Number(x.toPrecision(k));
      var e = Math.floor(Math.log10(Math.abs(r)));
      if (e < -3 || e >= 6) return (r / Math.pow(10, e)).toFixed(k - 1) + ' × 10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>';
      return H.fix(r, Math.max(0, k - 1 - e));
    }
    var tu = ' ' + (v.tUnit || 'hours'), tu1 = tu.replace(/s$/, ''), au = ' ' + (v.aUnit || 'mg'), LN2 = Math.LN2;
    if (v.aUnit === '%') au = '%';
    if (v.order === 'zero' || v.order === 'second') {
      var A0 = v.a0, k = v.k;
      if (!(A0 > 0)) return { error: 'Enter the initial concentration.' };
      if (!(k > 0)) return { error: 'Enter a positive rate constant.' };
      var zero = v.order === 'zero';
      var th = zero ? A0 / (2 * k) : 1 / (k * A0);
      var rows = [];
      if (v.t >= 0) {
        var At = zero ? Math.max(0, A0 - k * v.t) : 1 / (1 / A0 + k * v.t);
        rows.push(['[A] after ' + H.num(v.t, 4) + tu, sf(At, n) + ' M', true]);
        rows.push(['Fraction remaining', H.pct(At / A0 * 100, 2)]);
      }
      rows.push(['Next half-life (from [A]₀/2)', sf(zero ? th / 2 : th * 2, n) + tu]);
      if (zero) rows.push(['Time to use up all reactant', sf(A0 / k, n) + tu]);
      return {
        value: sf(th, n) + tu,
        label: (zero ? 'Zero' : 'Second') + '-order half-life',
        expr: zero ? sf(A0, n) + ' M ÷ (2 × ' + sf(k, n) + ')' : '1 ÷ (' + sf(k, n) + ' × ' + sf(A0, n) + ' M)',
        rows: rows,
        sub: zero ? 'Zero-order half-lives get shorter as the reactant is used up, because t½ depends on the starting concentration.' : 'Second-order half-lives double each time, because t½ = 1 ÷ (k[A]) grows as [A] falls.'
      };
    }
    var N0 = v.n0;
    if (!(N0 > 0)) return { error: 'Enter the initial amount.' };
    var T, t, N, val, label, expr;
    if (v.solve === 'halflife') {
      N = v.nt; t = v.t;
      if (!(N > 0) || N >= N0) return { error: 'The amount remaining must be greater than 0 and less than the initial amount.' };
      if (!(t > 0)) return { error: 'Enter the time elapsed.' };
      T = t * LN2 / Math.log(N0 / N);
      val = sf(T, n) + tu; label = 'Half-life (T½)';
      expr = H.num(t, 4) + ' × ln 2 ÷ ln(' + H.num(N0, 6) + ' ÷ ' + H.num(N, 6) + ')';
    } else if (v.solve === 'time') {
      N = v.nt; T = v.thalf;
      if (!(T > 0)) return { error: 'Enter the half-life.' };
      if (!(N > 0) || N >= N0) return { error: 'The amount remaining must be greater than 0 and less than the initial amount.' };
      t = T * Math.log(N0 / N) / LN2;
      val = sf(t, n) + tu; label = 'Time to fall from ' + H.num(N0, 6) + au + ' to ' + H.num(N, 6) + au;
      expr = H.num(T, 6) + ' × log₂(' + H.num(N0, 6) + ' ÷ ' + H.num(N, 6) + ')';
    } else {
      T = v.thalf; t = v.t;
      if (!(T > 0)) return { error: 'Enter the half-life.' };
      if (!(t >= 0)) return { error: 'Enter the time elapsed.' };
      N = N0 * Math.pow(0.5, t / T);
      val = sf(N, n) + au; label = 'Amount remaining after ' + H.num(t, 4) + tu;
      expr = H.num(N0, 6) + au + ' × (½)<sup>' + H.num(t, 4) + '/' + H.num(T, 6) + '</sup>';
    }
    var hl = t / T;
    var rows2 = [
      ['Half-lives elapsed', H.num(hl, 3), true],
      ['Fraction remaining', sf(N / N0 * 100, n) + '%'],
      ['Amount decayed', sf(N0 - N, n) + au],
      ['Decay constant λ = ln 2 ÷ T½', sf(LN2 / T, n) + ' per' + tu1],
      ['Mean lifetime τ = T½ ÷ ln 2', sf(T / LN2, n) + tu]
    ];
    return { value: val, label: label, expr: expr, rows: rows2, sub: 'Each half-life removes half of what is left, so the amount never quite reaches zero.' };
  },
  quick: ({ r }) => `To calculate how much is left after a given time, use <strong>N = N₀ × (½)<sup>t/T½</sup></strong>. A 200 mg sample with a 6-hour half-life has gone through 24 ÷ 6 = 4 half-lives after a day, so 200 × (½)⁴ = <strong>${r.value}</strong> remains (6.25%). To find the half-life itself from two measurements, use T½ = t × ln 2 ÷ ln(N₀ ÷ N).`,
  stepsTitle: 'How to calculate half-life problems',
  steps: [
    'Decide what kind of decay it is. Radioactive decay and most drug elimination are first order, with a constant half-life. A half-life that changes with concentration means zero or second order.',
    'Put the half-life and the elapsed time in the same unit. Mixing days and years is the most common error in half-life problems.',
    'Count half-lives: n = t ÷ T½. If n is a whole number you can simply halve the amount n times: 200 → 100 → 50 → 25 → 12.5.',
    'For any n, use N = N₀ × 0.5<sup>n</sup>. To solve for the half-life or the time instead, take logarithms (the calculator does this).',
    'Check that the answer is sensible: after 1 half-life 50% is left, after 2 it is 25%, and after 10 under 0.1%.'
  ],
  formulaTitle: 'What is the half-life formula?',
  formula: {
    expr: 'N = N₀ × (½)<sup>t / T½</sup> = N₀ × e<sup>−λt</sup><br>T½ = t × ln 2 ÷ ln(N₀ ÷ N) &nbsp;·&nbsp; t = T½ × log₂(N₀ ÷ N)<br>λ = ln 2 ÷ T½ ≈ 0.693 ÷ T½<br>Zero order: t½ = [A]₀ ÷ 2k &nbsp;·&nbsp; Second order: t½ = 1 ÷ (k[A]₀)',
    vars: [['N₀', 'starting amount (mass, moles, atoms or activity)'], ['N', 'amount left after time t'], ['T½', 'half-life'], ['λ', 'decay constant, per unit time'], ['k, [A]₀', 'rate constant and initial concentration for zero- and second-order reactions']],
    note: 'Activity (Bq or counts per minute) is proportional to the number of radioactive nuclei, so it follows the same formula as mass.'
  },
  example: `<p>A Geiger counter reads 1,200 counts per minute from a sample, and 850 counts per minute three hours later (background subtracted). What is the half-life?</p>
<p>T½ = 3.0 × ln 2 ÷ ln(1,200 ÷ 850) = 2.079 ÷ 0.3448 = <strong>6.03 hours</strong>.</p>
<p>That is close to technetium-99m (6.01 hours), the most widely used medical imaging isotope. Choose "Half-life" under Solve for to repeat it.</p>`,
  table: {
    title: 'How much is left after each half-life?',
    intro: 'The fraction remaining after whole numbers of half-lives, with the amount left from the 200 mg, 6-hour example above.',
    head: ['Half-lives', 'Time (6-h half-life)', 'Fraction left', 'Percent left', 'Amount left of 200 mg'],
    rows: ({ run }) => [1, 2, 3, 4, 5, 6, 7, 8, 10].map(k => {
      const r = run({ order: 'first', solve: 'remaining', n0: 200, thalf: 6, t: 6 * k, aUnit: 'mg', tUnit: 'hours', sf: '4' });
      return [String(k), (6 * k) + ' hours', '1/' + Math.pow(2, k).toLocaleString('en-US'), r.rows[1][1], r.value];
    }),
    note: 'After 7 half-lives less than 1% remains and after 10 less than 0.1%. In first-order decay the half-life is the same no matter how much you start with.'
  },
  sections: [
    {
      h2: 'How do you calculate half-life from two measurements?',
      html: `<p>Rearrange the decay law: T½ = t × ln 2 ÷ ln(N₀ ÷ N). If the numbers halve neatly you can count instead. A sample that falls from 80 g to 5 g in 20 days has halved four times (80 → 40 → 20 → 10 → 5), so T½ = 20 ÷ 4 = <strong>5 days</strong>. The formula gives the same: 20 × 0.693 ÷ ln 16 = 5.00.</p>
<p>From a graph of amount against time, read the time at which the curve reaches half its starting value, then check the time to reach a quarter; for first-order decay the second interval equals the first. On a graph of ln(N) against time the line is straight, and its slope is −λ, so T½ = 0.693 ÷ |slope|.</p>`
    },
    {
      h2: 'How do you calculate half-life for a zero-order reaction?',
      html: `<p>For a zero-order reaction the rate doesn't depend on concentration, [A] = [A]₀ − kt, and the half-life is <strong>t½ = [A]₀ ÷ 2k</strong>. Starting at 0.80 M with k = 0.020 M/min, the first half-life is 0.80 ÷ 0.040 = 20 min. The next one, starting from 0.40 M, is only 10 min, and the reactant is gone entirely at 40 min.</p>
<p>That shrinking half-life is the fingerprint of zero order. Second-order half-lives do the opposite: t½ = 1 ÷ (k[A]₀), so with k = 0.020 M⁻¹min⁻¹ and 0.80 M the first half-life is 62.5 min and the next is 125 min. Only first-order reactions have a constant half-life, which is why it is quoted for radioactive isotopes and drugs.</p>`
    },
    {
      h2: 'How is half-life used in carbon dating?',
      html: `<p>Living things keep the same carbon-14 level as the atmosphere; after death it decays with a half-life of 5,730 years (the conventional value; recent nuclear data evaluations give 5,700 ± 30 years). Measuring the fraction left gives the age: t = T½ × log₂(N₀ ÷ N).</p>
<p>A bone with 30% of its original carbon-14 is 5,730 × log₂(1 ÷ 0.30) = 5,730 × 1.737 ≈ <strong>9,950 years</strong> old. Radiocarbon labs then calibrate this against tree rings and other records, because atmospheric carbon-14 has varied. Beyond about 50,000 years (roughly nine half-lives) too little remains to measure reliably, so geologists use isotopes such as potassium-40 and uranium-238 instead.</p>`
    },
    {
      h2: 'What are the half-lives of common radioactive isotopes?',
      html: `<div class="twrap"><table><thead><tr><th>Isotope</th><th>Half-life</th><th>Where you meet it</th></tr></thead><tbody>
<tr><td>Fluorine-18</td><td>109.8 minutes</td><td>PET scans</td></tr>
<tr><td>Technetium-99m</td><td>6.01 hours</td><td>Medical imaging</td></tr>
<tr><td>Radon-222</td><td>3.82 days</td><td>Indoor air in basements</td></tr>
<tr><td>Iodine-131</td><td>8.02 days</td><td>Thyroid treatment</td></tr>
<tr><td>Phosphorus-32</td><td>14.3 days</td><td>DNA labeling in biology labs</td></tr>
<tr><td>Cobalt-60</td><td>5.27 years</td><td>Radiotherapy, sterilization</td></tr>
<tr><td>Tritium (hydrogen-3)</td><td>12.3 years</td><td>Self-lit exit signs</td></tr>
<tr><td>Cesium-137</td><td>about 30.1 years</td><td>Fission product, industrial gauges</td></tr>
<tr><td>Carbon-14</td><td>5,730 years</td><td>Radiocarbon dating</td></tr>
<tr><td>Plutonium-239</td><td>24,110 years</td><td>Nuclear fuel and waste</td></tr>
<tr><td>Uranium-235</td><td>704 million years</td><td>Reactor fuel</td></tr>
<tr><td>Potassium-40</td><td>1.25 billion years</td><td>K–Ar rock dating, bananas</td></tr>
<tr><td>Uranium-238</td><td>4.47 billion years</td><td>Dating the oldest rocks</td></tr>
</tbody></table></div>
<p>In AP Environmental Science, half-life questions usually ask how long nuclear waste stays hazardous. A common rule of thumb is about 10 half-lives, after which less than 0.1% of the original activity is left: roughly 300 years for cesium-137 and about 240,000 years for plutonium-239.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for half-life?', a: 'For first-order decay, N = N₀ × (½)^(t/T½). Rearranged, the half-life is T½ = t × ln 2 ÷ ln(N₀ ÷ N), where N₀ is the starting amount and N the amount after time t.' },
    { q: 'How much is left after 3 half-lives?', a: 'One-eighth, or 12.5%. Each half-life halves what is left: 100% → 50% → 25% → 12.5%.' },
    { q: 'How do you find the decay constant from the half-life?', a: 'Divide ln 2 (0.693) by the half-life: λ = 0.693 ÷ T½. A 6-hour half-life gives λ = 0.116 per hour.' },
    { q: 'Does the half-life depend on the amount you start with?', a: 'Not for first-order processes such as radioactive decay: 1 g and 1 kg of iodine-131 both take 8.02 days to halve. It does for zero-order (t½ = [A]₀ ÷ 2k) and second-order (t½ = 1 ÷ k[A]₀) reactions.' },
    { q: 'Does a substance ever completely decay?', a: 'In the math, never: the amount keeps halving. In practice the number of atoms is finite, so after enough half-lives (about 80 for a mole of atoms) essentially none remain.' },
    { q: 'How do you calculate the half-life of a drug?', a: 'Most drugs follow first-order elimination, so the same formula applies: measure the blood concentration at two times and use T½ = t × ln 2 ÷ ln(C₀ ÷ C). A drug is considered mostly cleared after about 4–5 half-lives (94–97% eliminated).' },
    { q: 'Can temperature or pressure change a radioactive half-life?', a: 'No, not measurably for ordinary conditions. Nuclear decay is set by the nucleus, unlike chemical reaction rates, which speed up with temperature.' }
  ],
  related: ['doubling-time-calculator', 'log-calculator', 'exponent-calculator', 'population-growth-calculator', 'atom-calculator'],
  sources: [
    { name: 'OpenStax Chemistry 2e: 21.3 Radioactive Decay', url: 'https://openstax.org/books/chemistry-2e/pages/21-3-radioactive-decay' },
    { name: 'OpenStax Chemistry 2e: 12.4 Integrated Rate Laws', url: 'https://openstax.org/books/chemistry-2e/pages/12-4-integrated-rate-laws' },
    { name: 'NIST: Radionuclide Half-Life Measurements', url: 'https://www.nist.gov/pml/radionuclide-half-life-measurements' },
    { name: 'Brookhaven National Laboratory NNDC: NuDat nuclear data', url: 'https://www.nndc.bnl.gov/nudat3/' },
    { name: 'U.S. EPA: Radiation Basics', url: 'https://www.epa.gov/radiation/radiation-basics' }
  ]
};
