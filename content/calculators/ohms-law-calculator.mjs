export default {
  slug: 'ohms-law-calculator',
  hub: 'electrical',
  name: 'Ohm\'s Law Calculator',
  title: 'Ohm\'s Law Calculator: V = I × R (0.5 A × 24 Ω = 12 V)',
  h1: 'Ohm\'s Law Calculator: Solve Voltage, Current, Resistance and Power',
  meta: 'Voltage equals current times resistance: 0.5 A through 24 Ω is 12 V and 6 W. Enter any two of V, I, R or P, or find the voltage drop across series resistors.',
  keyword: 'how is voltage calculated',
  also: ['ohm\'s law calculator', 'how do you calculate the voltage drop across a resistor', 'how to calculate voltage drop over a resistor', 'how to calculate resistance with current and voltage', 'how to calculate voltage drop series circuit', 'how to calculate voltage drop in series circuit', 'what is the symbol for voltage used in calculations'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Solve', type: 'select', value: 'ohm', options: [['ohm', 'Ohm\'s law (enter any two values)'], ['series', 'Voltage drop across series resistors']] },
    { id: 'V', label: 'Voltage (V)', type: 'number', value: '', suffix: 'V', placeholder: 'leave blank to solve', showIf: { mode: ['ohm'] } },
    { id: 'I', label: 'Current (I)', type: 'number', value: 0.5, suffix: 'A', help: '20 mA = 0.02 A.', showIf: { mode: ['ohm'] } },
    { id: 'R', label: 'Resistance (R)', type: 'number', value: 24, suffix: 'Ω', help: '4.7 kΩ = 4,700 Ω.', showIf: { mode: ['ohm'] } },
    { id: 'P', label: 'Power (P)', type: 'number', value: '', suffix: 'W', placeholder: 'leave blank to solve', showIf: { mode: ['ohm'] } },
    { id: 'vs', label: 'Source voltage', type: 'number', value: 12, suffix: 'V', showIf: { mode: ['series'] } },
    { id: 'rlist', label: 'Resistors in series (ohms)', type: 'text', value: '100, 220, 330', placeholder: 'e.g. 100, 220, 330', showIf: { mode: ['series'] }, wide: true }
  ],
  compute(v, H) {
    function f(x, u) { return H.sig(x, 4) + ' ' + u; }
    function amp(x) { return x < 0.1 ? H.sig(x * 1000, 4) + ' mA' : H.sig(x, 4) + ' A'; }
    if (v.mode === 'series') {
      var rs = H.list(v.rlist).filter(function (x) { return x > 0; });
      if (!(v.vs > 0)) return { error: 'Enter the source voltage.' };
      if (!rs.length) return { error: 'Enter at least one resistor value in ohms.' };
      var rt = H.sum(rs), i = v.vs / rt;
      var rows = [['Total resistance', f(rt, 'Ω')]];
      var trows = rs.map(function (r, k) {
        var d = i * r;
        rows.push(['Drop across R' + (k + 1) + ' (' + H.num(r, 2) + ' Ω)', f(d, 'V'), true]);
        return ['R' + (k + 1), H.num(r, 2) + ' Ω', f(d, 'V'), H.pct(d / v.vs * 100, 1), f(d * i, 'W')];
      });
      rows.push(['Total power', f(v.vs * i, 'W')]);
      return {
        value: amp(i), label: 'Series current (same through every resistor)',
        expr: H.num(v.vs, 2) + ' V ÷ ' + H.num(rt, 2) + ' Ω', rows: rows,
        sub: 'Each resistor drops current × its resistance; the drops add up to the ' + H.num(v.vs, 2) + ' V source.',
        table: { head: ['Resistor', 'Value', 'Voltage drop', 'Share', 'Power'], rows: trows }
      };
    }
    var V = v.V > 0 ? v.V : NaN, I = v.I > 0 ? v.I : NaN, R = v.R > 0 ? v.R : NaN, P = v.P > 0 ? v.P : NaN;
    var known = [V, I, R, P].filter(function (x) { return x === x; }).length;
    if (known < 2) return { error: 'Enter any two of voltage, current, resistance and power (positive numbers).' };
    if (known > 2) return { error: 'Enter exactly two values and leave the other two blank.' };
    var solved, ex;
    var sv = H.sig(V, 4) + ' V', si = H.sig(I, 4) + ' A', sr = H.sig(R, 4) + ' Ω', sp = H.sig(P, 4) + ' W';
    if (V === V && I === I) { R = V / I; P = V * I; solved = ['R', 'P']; ex = sv + ' ÷ ' + si; }
    else if (V === V && R === R) { I = V / R; P = V * V / R; solved = ['I', 'P']; ex = sv + ' ÷ ' + sr; }
    else if (V === V && P === P) { I = P / V; R = V * V / P; solved = ['I', 'R']; ex = sp + ' ÷ ' + sv; }
    else if (I === I && R === R) { V = I * R; P = I * I * R; solved = ['V', 'P']; ex = si + ' × ' + sr; }
    else if (I === I && P === P) { V = P / I; R = P / (I * I); solved = ['V', 'R']; ex = sp + ' ÷ ' + si; }
    else { V = Math.sqrt(P * R); I = Math.sqrt(P / R); solved = ['V', 'I']; ex = '√(' + sp + ' × ' + sr + ')'; }
    var exprs = { V: 'V = I × R', I: 'I = V ÷ R', R: 'R = V ÷ I', P: 'P = V × I' };
    if (solved[0] === 'I' && solved[1] === 'R') exprs.I = 'I = P ÷ V';
    if (solved[0] === 'V' && solved[1] === 'R') exprs.V = 'V = P ÷ I';
    if (solved[0] === 'V' && solved[1] === 'I') exprs.V = 'V = √(P × R)';
    var main = solved[0];
    var vals = { V: f(V, 'V'), I: amp(I), R: f(R, 'Ω'), P: f(P, 'W') };
    var names = { V: 'Voltage', I: 'Current', R: 'Resistance', P: 'Power' };
    var rows = ['V', 'I', 'R', 'P'].map(function (k) { return [names[k] + (solved.indexOf(k) >= 0 ? ' (solved)' : ''), vals[k], solved.indexOf(k) >= 0]; });
    rows.push(['Resistor rating with 2× margin', H.sig(P * 2, 3) + ' W or higher']);
    return {
      value: vals[main], label: names[main] + ' (' + exprs[main] + ')',
      expr: ex,
      rows: rows,
      sub: 'Power dissipated: ' + vals.P + '. Choose a resistor rated at roughly twice that to keep it cool.'
    };
  },
  quick: ({ r }) => `Voltage is calculated with Ohm's law: <strong>V = I × R</strong>, current in amps times resistance in ohms. A current of 0.5 A through a 24 Ω resistance needs 0.5 × 24 = <strong>${r.value}</strong>, and the resistor turns 12 × 0.5 = 6 W into heat. Rearranged, I = V ÷ R and R = V ÷ I; enter any two values above to get the other two.`,
  stepsTitle: 'How to use Ohm\'s law',
  steps: [
    'Write down the two quantities you know and convert them to base units: milliamps to amps (÷ 1,000) and kilohms to ohms (× 1,000). <strong>Mixing mA with Ω is the most common slip</strong>; it makes the answer 1,000 times off.',
    'Pick the form that isolates the unknown: V = I × R for voltage, I = V ÷ R for current, R = V ÷ I for resistance.',
    'Find power with P = V × I, or with P = I² × R and P = V² ÷ R when you only have resistance and one other value.',
    'Sanity-check the result: a bigger resistance with the same voltage must give a smaller current, and the resistor\'s watt rating should be at least double the power you calculated.'
  ],
  formulaTitle: 'What are the Ohm\'s law formulas?',
  formula: {
    expr: 'V = I × R &nbsp;·&nbsp; I = V ÷ R &nbsp;·&nbsp; R = V ÷ I<br>P = V × I = I² × R = V² ÷ R',
    vars: [['V', 'voltage (potential difference) in volts; older texts write E for electromotive force'], ['I', 'current in amperes (from the French <em>intensité</em>)'], ['R', 'resistance in ohms (Ω)'], ['P', 'power in watts (W)']],
    note: 'Ohm\'s law describes ohmic (linear) components such as resistors and heating elements. Diodes, LEDs and lamps change resistance with current, so use their datasheet curves for anything beyond a rough estimate.'
  },
  example: `<p>A 5 V supply drives a red LED that drops about 2.0 V (check the datasheet) at 20 mA. What resistor is needed?</p>
<p>Voltage across the resistor = 5 − 2.0 = <strong>3.0 V</strong>. R = V ÷ I = 3.0 ÷ 0.020 = <strong>150 Ω</strong>.</p>
<p>Power in the resistor = 3.0 × 0.020 = <strong>0.06 W</strong>, so a standard 1/4 W (0.25 W) resistor has plenty of margin.</p>`,
  table: {
    title: 'How much current flows through common resistor values?',
    intro: 'Current and power for standard resistor values on a 5 V logic rail and a 12 V supply, solved with I = V ÷ R and P = V² ÷ R by the calculator above.',
    head: ['Resistor', 'Current at 5 V', 'Power at 5 V', 'Current at 12 V', 'Power at 12 V'],
    rows: ({ run, H }) => [10, 22, 47, 100, 220, 330, 470, 1000, 2200, 4700, 10000].map(R => {
      const a = run({ mode: 'ohm', V: 5, I: NaN, R, P: NaN }), b = run({ mode: 'ohm', V: 12, I: NaN, R, P: NaN });
      const pick = (x, n) => x.rows.find(r => r[0].indexOf(n) === 0)[1];
      return [H.num(R, 0) + ' Ω', pick(a, 'Current'), pick(a, 'Power'), pick(b, 'Current'), pick(b, 'Power')];
    }),
    note: 'A 10 Ω resistor across 12 V dissipates 14.4 W, far beyond a 1/4 W part. Always check power before current.'
  },
  sections: [
    {
      h2: 'How do you calculate the voltage drop across a resistor?',
      html: `<p>Multiply the current through the resistor by its resistance: V<sub>drop</sub> = I × R. If you don't know the current, find it first from the whole circuit. In a series string the same current flows through every part, so I = source voltage ÷ total resistance.</p>
<p>Example: 12 V across 100 Ω, 220 Ω and 330 Ω in series. Total R = 650 Ω, so I = 12 ÷ 650 = 18.46 mA. The drops are 100 × 0.01846 = <strong>1.846 V</strong>, 220 × 0.01846 = <strong>4.062 V</strong> and 330 × 0.01846 = <strong>6.092 V</strong>, which add back up to 12 V. Choose <em>Voltage drop across series resistors</em> in the calculator to do this for any list.</p>
<p>A shortcut for two resistors is the voltage divider: V<sub>out</sub> = V<sub>in</sub> × R2 ÷ (R1 + R2). With 10 kΩ and 4.7 kΩ on 5 V, the midpoint sits at 5 × 4.7 ÷ 14.7 = 1.60 V. Note that this sense of "voltage drop" is different from the drop along a long wire run, which the <a href="/wire-size-calculator">wire size calculator</a> covers.</p>`
    },
    {
      h2: 'How do you calculate resistance with current and voltage?',
      html: `<p>Divide voltage by current: R = V ÷ I. A heating element that draws 12.5 A at 120 V has a hot resistance of 120 ÷ 12.5 = <strong>9.6 Ω</strong>. A sensor that passes 4 mA at 24 V presents 24 ÷ 0.004 = 6,000 Ω, or 6 kΩ.</p>
<p>Measured with a multimeter, the same element will read lower when cold, because metals gain resistance as they heat up. That is why the Ohm's law value for a lamp or heater should come from its operating current and voltage, not a cold ohmmeter reading.</p>`
    },
    {
      h2: 'How is voltage calculated in series and parallel circuits?',
      html: `<ul><li><strong>Series:</strong> the current is the same everywhere and the voltages add up. Each component's share of the source voltage equals its share of the total resistance.</li>
<li><strong>Parallel:</strong> every branch sees the full source voltage, and the currents add up. Total resistance is 1 ÷ (1/R1 + 1/R2 + …), always less than the smallest branch. Two 100 Ω resistors in parallel make 50 Ω.</li>
<li><strong>Kirchhoff's voltage law</strong> ties both together: around any closed loop, the voltage rises from sources equal the sum of the drops across the loads.</li></ul>
<p>For mixed circuits, collapse the parallel groups into single equivalent resistors, solve the resulting series circuit with Ohm's law, then work back out to each branch.</p>`
    },
    {
      h2: 'What do V, I, R and E stand for in Ohm\'s law?',
      html: `<p>V is voltage, measured in volts; I is current in amperes; R is resistance in ohms (Ω); P is power in watts. Many U.S. electrician textbooks write the law as <strong>E = I × R</strong>, where E stands for electromotive force. E and V mean the same thing in these formulas. The units are defined in the International System of Units: one ohm is the resistance that passes one ampere when one volt is applied, and one watt is one volt times one ampere.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for voltage?', a: 'Voltage equals current times resistance (V = I × R). If you know power instead, V = P ÷ I or V = √(P × R).' },
    { q: 'How do you calculate voltage drop in a series circuit?', a: 'Find the current as source voltage ÷ total resistance, then multiply that current by each resistor. The individual drops always add up to the source voltage.' },
    { q: 'How do I use milliamps in Ohm\'s law?', a: 'Convert to amps first by dividing by 1,000. 25 mA is 0.025 A, so 0.025 A × 200 Ω = 5 V. Alternatively, milliamps × kilohms gives volts directly.' },
    { q: 'How do you calculate power from voltage and resistance?', a: 'Square the voltage and divide by resistance: P = V² ÷ R. 12 V across 48 Ω dissipates 144 ÷ 48 = 3 W.' },
    { q: 'Does Ohm\'s law work for AC circuits?', a: 'Yes for resistive loads, using RMS voltage and current. With capacitors or inductors, replace resistance with impedance (Z), so V = I × Z, and real power also depends on the power factor.' },
    { q: 'Why does my LED not follow Ohm\'s law?', a: 'LEDs and other diodes are non-ohmic: their current rises steeply once the forward voltage is reached. Apply Ohm\'s law to the series resistor instead, using the supply voltage minus the LED\'s forward voltage.' },
    { q: 'What happens to current if resistance doubles?', a: 'At a fixed voltage, current halves. 12 V across 6 Ω gives 2 A; across 12 Ω it gives 1 A.' }
  ],
  related: ['amps-calculator', 'kw-calculator', 'wire-size-calculator', 'watt-hours-calculator'],
  sources: [
    { name: 'NIST: SI Units (volt, ampere, ohm, watt)', url: 'https://www.nist.gov/pml/owm/metric-si/si-units' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI', url: 'https://www.nist.gov/pml/special-publication-811' },
    { name: 'BIPM: The International System of Units (SI Brochure)', url: 'https://www.bipm.org/en/publications/si-brochure' }
  ]
};
