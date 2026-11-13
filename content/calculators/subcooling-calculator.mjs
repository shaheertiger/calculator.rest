// Saturated-liquid (bubble-point) pressures in psig at each temperature in °F, from the Daikin Comfort
// Technologies "A1 vs. A2L Pressure Temperature Chart" (PM-A2LPTC-USA_04-24, values supplied by Weitron).
// R-410A and R-454B use the chart's liquid-pressure column. Cross-checked against CoolProp 8.0 (within 0.3 °F).
const LIQ = {
  t: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150],
  r410a: [78.7, 82.2, 85.8, 89.6, 93.4, 97.4, 101.4, 105.6, 109.9, 114.3, 118.8, 123.4, 128.2, 133, 138, 143.2, 148.4, 153.8, 159.3, 164.9, 170.7, 176.7, 182.7, 188.9, 195.3, 201.8, 208.4, 215.2, 222.2, 229.3, 236.5, 244, 251.6, 259.3, 267.3, 275.4, 283.6, 292.1, 300.7, 309.5, 318.6, 341.9, 366.4, 392.3, 419.4, 447.9, 477.9, 509.4, 542.5, 577.3, 613.9],
  r22: [43.1, 45.3, 47.6, 50, 52.4, 55, 57.5, 60.2, 62.9, 65.7, 68.6, 71.5, 74.5, 77.6, 80.8, 84.1, 87.4, 90.8, 94.4, 98, 101.6, 105.4, 109.3, 113.2, 117.3, 121.4, 125.7, 130, 134.5, 139, 143.6, 148.4, 153.2, 158.2, 163.2, 168.4, 173.7, 179.1, 184.6, 190.2, 195.9, 210.8, 226.4, 242.8, 260, 278, 296.9, 316.7, 337.4, 359, 381.7],
  r32: [80, 83.6, 87.3, 91.1, 95.1, 99.1, 103.2, 107.5, 111.8, 116.3, 121, 125.7, 130.5, 135.5, 140.6, 145.8, 151.2, 156.7, 162.4, 168.1, 174, 180.1, 186.3, 192.7, 199.2, 205.8, 212.6, 219.6, 226.7, 234, 241.5, 249.1, 256.9, 264.9, 273, 281.3, 289.8, 298.5, 307.4, 316.4, 325.7, 349.6, 374.9, 401.4, 429.3, 458.7, 489.5, 521.8, 555.8, 591.4, 628.8],
  r454b: [75, 78.4, 81.8, 85.4, 89.1, 92.9, 96.8, 100.7, 104.8, 109, 113.3, 117.8, 122.3, 126.9, 131.7, 136.6, 141.6, 146.7, 152, 157.4, 162.9, 168.6, 174.3, 180.2, 186.3, 192.5, 198.8, 205.3, 211.9, 218.7, 225.6, 232.7, 239.9, 247.3, 254.8, 262.5, 270.4, 278.4, 286.6, 295, 303.6, 325.7, 348.9, 373.4, 399.1, 426, 454.2, 483.8, 514.9, 547.3, 581.4]
};

export default {
  slug: 'subcooling-calculator',
  hub: 'electrical',
  name: 'Subcooling Calculator',
  title: 'Subcooling Calculator: R-410A at 342 psig, 95°F Line = 10°F',
  h1: 'Subcooling Calculator: Check a TXV System\'s Charge From the Liquid Line',
  meta: 'Liquid line at 342 psig and 95°F on R-410A? That is 10°F of subcooling. Bubble-point PT data for R-410A, R-22, R-32 and R-454B, with a target check.',
  keyword: 'how to calculate subcooling',
  also: ['how do you calculate subcooling', 'how to calculate subcool', 'how do i calculate subcooling', 'subcooling calculator', 'how to calculate subcool and superheat', 'how do you calculate superheat and subcooling'],
  updated: '2026-11-13',
  inputs: [
    { id: 'ref', label: 'Refrigerant', type: 'select', value: 'r410a', options: [['r410a', 'R-410A'], ['r22', 'R-22'], ['r32', 'R-32'], ['r454b', 'R-454B (bubble point)'], ['manual', 'Other: enter condensing temp']] },
    { id: 'psig', label: 'Liquid line (high-side) pressure', type: 'number', value: 342, suffix: 'psig', help: 'From the gauge on the small liquid-line service port.', showIf: { ref: ['r410a', 'r22', 'r32', 'r454b'] } },
    { id: 'sat', label: 'Condensing (bubble-point) temperature', type: 'number', value: 105, suffix: '°F', showIf: { ref: ['manual'] } },
    { id: 'line', label: 'Liquid line temperature', type: 'number', value: 95, suffix: '°F', help: 'Probe on bare copper beside the liquid service valve.' },
    { id: 'target', label: 'Target subcooling (nameplate)', type: 'number', value: 10, suffix: '°F', placeholder: 'e.g. 10', help: 'Printed on the outdoor unit\'s rating plate or charging chart. Optional.' },
    { id: 'odb', label: 'Outdoor air temperature', type: 'number', value: 85, suffix: '°F', placeholder: 'optional', help: 'Optional: adds the condensing temperature over ambient.' }
  ],
  data: LIQ,
  compute(v, H, D) {
    var label = { r410a: 'R-410A', r22: 'R-22', r32: 'R-32', r454b: 'R-454B' };
    var cond, src;
    if (v.ref === 'manual') {
      if (!H.isNum(v.sat)) return { error: 'Enter the condensing temperature.' };
      cond = v.sat; src = 'entered by hand';
    } else {
      var P = D[v.ref];
      if (!P) return { error: 'Choose a refrigerant.' };
      if (!H.isNum(v.psig)) return { error: 'Enter the liquid line pressure in psig.' };
      var lo = P[0], hi = P[P.length - 1];
      if (v.psig < lo || v.psig > hi) return { error: 'Liquid pressure must be between ' + lo + ' and ' + hi + ' psig for ' + label[v.ref] + '. Is the gauge on the high side?' };
      var j = 0;
      while (j < P.length - 2 && v.psig > P[j + 1]) j++;
      cond = D.t[j] + (D.t[j + 1] - D.t[j]) * (v.psig - P[j]) / (P[j + 1] - P[j]);
      src = label[v.ref] + (v.ref === 'r454b' ? ' bubble point' : ' saturation') + ' at ' + H.num(v.psig, 1) + ' psig';
    }
    if (!H.isNum(v.line)) return { error: 'Enter the liquid line temperature.' };
    var sc = cond - v.line;
    var rows = [
      ['Condensing temperature', H.fix(cond, 1) + '°F'],
      ['Liquid line temperature', H.num(v.line, 1) + '°F'],
      ['Saturation from', src]
    ];
    if (H.isNum(v.odb)) rows.push(['Condensing temp over ambient', H.fix(cond - v.odb, 1) + '°F']);
    var res = { value: H.fix(sc, 1) + '°F', label: 'Liquid subcooling', expr: H.fix(cond, 1) + '°F − ' + H.num(v.line, 1) + '°F', rows: rows };
    if (sc < 0) {
      res.sub = 'The liquid line is warmer than the condensing temperature, which is not physically possible for a full liquid line. Re-check the probe placement and that the gauge is on the liquid port.';
      return res;
    }
    if (H.isNum(v.target) && v.target > 0) {
      var diff = sc - v.target;
      rows.push(['Versus target', (diff >= 0 ? '+' : '−') + H.fix(Math.abs(diff), 1) + '°F', true]);
      res.sub = Math.abs(diff) <= 3 ? 'Within 3°F of the ' + H.num(v.target, 1) + '°F target. Follow the tolerance in the installation manual before adjusting.' : diff < 0 ? 'Subcooling is below target: the condenser is not holding enough liquid. Usually low charge; confirm with high superheat before adding refrigerant.' : 'Subcooling is above target: liquid is backing up in the condenser. Usually overcharge, or a restriction if superheat is also high.';
    } else {
      res.sub = 'Most residential TXV systems call for roughly 8–12°F; use the number on the rating plate.';
    }
    return res;
  },
  quick: ({ r }) => `Subcooling equals the condensing (saturation) temperature at liquid line pressure minus the actual liquid line temperature. On an R-410A system reading <strong>342 psig</strong>, the refrigerant condenses at 105°F; a 95°F liquid line therefore has <strong>${r.value}</strong> of subcooling, right on a typical 10°F nameplate target. Blends like R-454B use the bubble point.`,
  stepsTitle: 'How to calculate subcooling on an AC or heat pump',
  steps: [
    'Run the system in cooling for 15 minutes or more. Subcooling readings drift while head pressure is still climbing, and a heat pump in heating mode needs the manufacturer\'s heating chart.',
    'Connect the high-side gauge to the liquid-line service port and note the pressure in psig.',
    'Look up the condensing temperature for that pressure. For R-454B, R-407C and other blends with glide, read the <strong>bubble point</strong> (saturated liquid) column, not the dew point.',
    'Clamp a temperature probe on the liquid line within a few inches of the service valve, out of direct sun and condenser discharge air.',
    'Subtract the liquid line temperature from the condensing temperature. Compare the result with the target subcooling on the rating plate.'
  ],
  formulaTitle: 'What is the formula for subcooling?',
  formula: {
    expr: 'Subcooling = T<sub>sat</sub>(P<sub>liquid</sub>) − T<sub>liquid line</sub>',
    vars: [['T<sub>sat</sub>(P<sub>liquid</sub>)', 'condensing temperature for the liquid line pressure; bubble point for zeotropic blends, °F'], ['T<sub>liquid line</sub>', 'measured temperature of the liquid line at the outdoor unit, °F']],
    note: 'The order is reversed compared with superheat: here the saturation temperature comes first, because properly subcooled liquid is colder than its condensing point. Pressure is converted by linear interpolation between 2°F and 5°F rows of a manufacturer PT chart.'
  },
  example: `<p>A technician checks a 3-ton R-454B system with a TXV. The liquid line gauge reads <strong>303.6 psig</strong> and the liquid line probe reads <strong>91°F</strong>. The nameplate target is 9°F.</p>
<p>On the bubble-point column, 303.6 psig corresponds to <strong>100°F</strong>. Subcooling = 100 − 91 = <strong>9°F</strong>, exactly on target, so the charge is left alone.</p>
<p>Reading the dew-point column instead would give about 102.7°F at that pressure and an apparent 11.7°F of subcooling, which could tempt someone to recover refrigerant from a correctly charged unit.</p>`,
  table: {
    title: 'What pressure does each refrigerant condense at?',
    intro: 'Liquid-side saturation pressures (psig) across the normal condensing range, the same data the calculator interpolates. R-454B and R-410A figures are bubble-point (liquid) values.',
    head: ['Condensing temp', 'R-410A', 'R-22', 'R-32', 'R-454B bubble'],
    rows: ({ D }) => [80, 84, 88, 92, 96, 100, 105, 110, 115, 120, 125].map(t => {
      const i = D.t.indexOf(t);
      return [t + '°F', D.r410a[i], D.r22[i], D.r32[i], D.r454b[i]];
    }),
    note: 'Source: Daikin Comfort Technologies A1 vs. A2L PT chart (Weitron data). A condensing temperature 15–30°F above outdoor air is common; high-efficiency condensers sit at the low end of that range.'
  },
  sections: [
    {
      h2: 'What should subcooling be?',
      html: `<p>Use the number the manufacturer prints on the outdoor unit. Most residential split systems with a TXV or electronic expansion valve list a target between about 8°F and 12°F, and 10°F is the single most common figure. Some high-efficiency and variable-speed units specify less, some more, and many give a correction for line-set length.</p>
<p>Subcooling is the primary charging check whenever the indoor coil has an expansion valve, because the valve keeps evaporator superheat steady no matter how much refrigerant is in the system. Extra refrigerant collects as liquid in the bottom of the condenser and raises subcooling; a shortage lets vapor reach the liquid line and pushes subcooling toward zero. For piston systems, charge by <a href="/superheat-calculator">superheat</a> instead.</p>`
    },
    {
      h2: 'How do you read superheat and subcooling together?',
      html: `<p>Taking both readings at once separates charge problems from airflow and restriction problems. The usual patterns:</p>
<div class="twrap"><table><thead><tr><th>Superheat</th><th>Subcooling</th><th>Likely cause</th></tr></thead><tbody>
<tr><td>High</td><td>Low</td><td>Undercharge or leak</td></tr>
<tr><td>Low</td><td>High</td><td>Overcharge</td></tr>
<tr><td>High</td><td>High</td><td>Restriction: plugged filter drier, kinked liquid line or stuck metering device</td></tr>
<tr><td>Low</td><td>Normal to low</td><td>Low indoor airflow: dirty filter, slow blower, iced coil</td></tr>
<tr><td>Normal</td><td>Low, with high suction and low head pressure</td><td>Weak compressor valves</td></tr>
</tbody></table></div>
<p>Treat the table as a starting point. Check the filter, blower speed and both coils before you add or recover refrigerant.</p>`
    },
    {
      h2: 'Why use the bubble point for subcooling on R-454B?',
      html: `<p>A zeotropic blend does not condense at one temperature. As it gives up heat in the condenser, the more volatile component lingers in the vapor and the condensing temperature slides down by the glide. The <strong>bubble point</strong> is the temperature at which the very last vapor has condensed, which is exactly the starting line for subcooling. For R-454B the glide is roughly 2–3°F, so using the wrong column moves the answer by that much.</p>
<p>R-410A is classed as a near-azeotrope: its liquid and vapor columns differ by about 1 psi, so either works in practice. R-22 and R-32 are single compounds with one saturation curve.</p>`
    },
    {
      h2: 'What causes high or low subcooling?',
      html: `<p><strong>Low subcooling</strong> (under about 5°F) means the condenser has little or no liquid seal. The usual reasons are low charge, a leak, or a liquid line warmed by sun or by being run through a hot attic. Bubbles in a sight glass, where fitted, point the same way.</p>
<p><strong>High subcooling</strong> (more than about 5°F over target) means liquid is stacking up. Overcharge is the common cause; others are a restriction downstream of the condenser and non-condensables, which also push head pressure up. A dirty condenser coil raises head pressure and condensing temperature too, so clean it before charging.</p>`
    }
  ],
  faq: [
    { q: 'What is the subcooling formula?', a: 'Subcooling = condensing temperature at the liquid line pressure − liquid line temperature. For example, R-410A at 342 psig condenses at 105°F, and a 95°F liquid line gives 10°F of subcooling.' },
    { q: 'What should subcooling be on an R-410A system?', a: 'Typically 8–12°F for TXV systems, with 10°F the most common nameplate figure. Always use the target printed on the outdoor unit, because some models specify different values.' },
    { q: 'Is subcooling measured on the liquid line or the suction line?', a: 'The liquid line. Subcooling uses the high-side (liquid) pressure and the small liquid line temperature; superheat uses the suction pressure and the larger vapor line.' },
    { q: 'Do you charge by subcooling or superheat?', a: 'Charge by subcooling when the system has a TXV or electronic expansion valve, and by superheat when it has a fixed orifice or piston. Check the other reading as a cross-check.' },
    { q: 'What does 0 subcooling mean?', a: 'Zero subcooling means the liquid line holds a mix of liquid and vapor, so the metering device is not getting a solid column of liquid. It almost always points to low charge or a severe restriction ahead of the measuring point.' },
    { q: 'Does line-set length change target subcooling?', a: 'It can. Many installation manuals add charge per foot beyond a standard length (often 15 ft) and some adjust the subcooling target for long or tall line sets. Follow the table in the unit\'s manual.' },
    { q: 'Can I calculate subcooling in heating mode?', a: 'Yes, the formula is the same, but the condenser is the indoor coil and the targets differ. Many manufacturers ask you to charge in cooling mode, or to weigh in the charge, when it is cold outside.' }
  ],
  related: ['superheat-calculator', 'btu-calculator', 'temperature-converter', 'cfm-calculator'],
  sources: [
    { name: 'Daikin Comfort Technologies: A1 vs. A2L Pressure Temperature Chart (R-22, R-410A, R-32, R-454B)', url: 'https://www.chadwellsupply.com/globalassets/articles-pk/a2l/a2lptc-usa_04-24.pdf' },
    { name: 'Honeywell: Solstice 454B pressure-temperature chart (bubble and dew columns)', url: 'https://advancedmaterials.honeywell.com/content/dam/advancedmaterials/en/documents/document-lists/fluorine-products/technical/hon-ess-am-3161690-adm-tds-pt-chart-solstice-454b-ltr-en.pdf' },
    { name: 'U.S. EPA: Section 608 Technician Certification', url: 'https://www.epa.gov/section608/section-608-technician-certification-0' }
  ],
  disclaimer: 'For trained technicians. Follow the equipment manufacturer\'s charging procedure; adding or removing refrigerant requires EPA Section 608 certification.'
};
