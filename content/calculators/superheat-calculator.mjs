// Saturation (dew-point / vapor) pressures in psig at each temperature in °F, from the Daikin Comfort
// Technologies "A1 vs. A2L Pressure Temperature Chart" (PM-A2LPTC-USA_04-24, values supplied by Weitron).
// Cross-checked against NIST-based CoolProp 8.0 equations of state (all within 0.6 °F).
const PT = {
  t: [-38, -36, -34, -32, -30, -28, -26, -24, -22, -20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100],
  r410a: [12, 13.3, 14.7, 16.2, 17.7, 19.3, 20.9, 22.6, 24.4, 26.2, 28.1, 30, 32, 34.1, 36.3, 38.5, 40.8, 43.2, 45.7, 48.2, 50.8, 53.5, 56.3, 59.2, 62.2, 65.2, 68.4, 71.6, 74.9, 78.4, 81.9, 85.5, 89.2, 93.1, 97, 101.1, 105.2, 109.5, 113.9, 118.4, 123, 127.7, 132.6, 137.5, 142.6, 147.9, 153.2, 158.7, 164.4, 170.1, 176, 182.1, 188.3, 194.6, 201.1, 207.7, 214.5, 221.4, 228.5, 235.8, 243.2, 250.7, 258.5, 266.4, 274.5, 282.7, 291.2, 299.8, 308.6, 317.6],
  r22: [1.4, 2.2, 3.1, 4, 4.9, 5.9, 6.9, 8, 9.1, 10.2, 11.4, 12.6, 13.9, 15.2, 16.5, 17.9, 19.4, 20.9, 22.4, 24, 25.7, 27.4, 29.2, 31, 32.8, 34.8, 36.8, 38.8, 40.9, 43.1, 45.3, 47.6, 50, 52.4, 55, 57.5, 60.2, 62.9, 65.7, 68.6, 71.5, 74.5, 77.6, 80.8, 84.1, 87.4, 90.8, 94.4, 98, 101.6, 105.4, 109.3, 113.2, 117.3, 121.4, 125.7, 130, 134.5, 139, 143.6, 148.4, 153.2, 158.2, 163.2, 168.4, 173.7, 179.1, 184.6, 190.2, 195.9],
  r32: [12.4, 13.7, 15.2, 16.6, 18.2, 19.8, 21.4, 23.2, 25, 26.8, 28.7, 30.7, 32.8, 34.9, 37.1, 39.4, 41.7, 44.1, 46.7, 49.2, 51.9, 54.7, 57.5, 60.5, 63.5, 66.6, 69.8, 73.1, 76.5, 80, 83.6, 87.3, 91.1, 95.1, 99.1, 103.2, 107.5, 111.8, 116.3, 121, 125.7, 130.5, 135.5, 140.6, 145.8, 151.2, 156.7, 162.4, 168.1, 174, 180.1, 186.3, 192.7, 199.2, 205.8, 212.6, 219.6, 226.7, 234, 241.5, 249.1, 256.9, 264.9, 273, 281.3, 289.8, 298.5, 307.4, 316.4, 325.7],
  r454b: [10, 11.2, 12.5, 13.9, 15.3, 16.7, 18.2, 19.8, 21.4, 23, 24.8, 26.6, 28.4, 30.3, 32.3, 34.4, 36.5, 38.7, 40.9, 43.3, 45.7, 48.1, 50.7, 53.3, 56.1, 58.9, 61.8, 64.7, 67.8, 70.9, 74.2, 77.5, 80.9, 84.4, 88.1, 91.8, 95.6, 99.5, 103.6, 107.7, 112, 116.3, 120.8, 125.4, 130.1, 134.9, 139.8, 144.9, 150.1, 155.4, 160.8, 166.4, 172.1, 178, 184, 190.1, 196.4, 202.8, 209.3, 216.1, 222.9, 229.9, 237.1, 244.4, 251.9, 259.6, 267.4, 275.4, 283.6, 291.6]
};
const ptRows = [20, 24, 28, 32, 36, 40, 44, 48, 52, 56].map(t => {
  const i = PT.t.indexOf(t);
  return `<tr><td>${t}°F</td><td>${PT.r410a[i]}</td><td>${PT.r22[i]}</td><td>${PT.r32[i]}</td><td>${PT.r454b[i]}</td></tr>`;
}).join('');

export default {
  slug: 'superheat-calculator',
  hub: 'electrical',
  name: 'Superheat Calculator',
  title: 'Superheat Calculator: R-410A at 123 psig & 52°F = 10°F SH',
  h1: 'Superheat Calculator for R-410A, R-22, R-32 and R-454B',
  meta: 'R-410A at 123 psig boils at 42°F, so a 52°F suction line means 10°F of superheat. Built-in dew-point PT data and fixed-orifice target superheat for techs.',
  keyword: 'how to calculate superheat',
  also: ['how to do superheat calculation', 'how do you calculate superheat', 'how to calculate superheat formula', 'how to calculate target superheat', 'superheat calculator', 'how to calculate superheat and subcooling'],
  updated: '2026-11-13',
  inputs: [
    { id: 'ref', label: 'Refrigerant', type: 'select', value: 'r410a', options: [['r410a', 'R-410A'], ['r22', 'R-22'], ['r32', 'R-32'], ['r454b', 'R-454B (dew point)'], ['manual', 'Other: I know the saturation temp']] },
    { id: 'psig', label: 'Suction (low-side) pressure', type: 'number', value: 123, suffix: 'psig', help: 'Read at the service valve on the vapor (larger) line.', showIf: { ref: ['r410a', 'r22', 'r32', 'r454b'] } },
    { id: 'sat', label: 'Evaporator saturation temperature', type: 'number', value: 42, suffix: '°F', help: 'From your gauge or PT chart (dew point for blends).', showIf: { ref: ['manual'] } },
    { id: 'line', label: 'Suction line temperature', type: 'number', value: 52, suffix: '°F', help: 'Clamp a pipe probe within 6 in. of the service valve, insulated from ambient air.' },
    { id: 'meter', label: 'Metering device', type: 'select', value: 'piston', options: [['piston', 'Fixed orifice / piston'], ['txv', 'TXV or EEV']] },
    { id: 'wb', label: 'Indoor return-air wet bulb', type: 'number', value: 63, suffix: '°F', showIf: { meter: ['piston'] } },
    { id: 'odb', label: 'Outdoor dry bulb (air entering condenser)', type: 'number', value: 85, suffix: '°F', showIf: { meter: ['piston'] } }
  ],
  data: PT,
  compute(v, H, D) {
    var names = { r410a: 'R-410A', r22: 'R-22', r32: 'R-32', r454b: 'R-454B' };
    var sat, how;
    if (v.ref === 'manual') {
      if (!H.isNum(v.sat)) return { error: 'Enter the saturation temperature.' };
      sat = v.sat; how = 'typed in';
    } else {
      var P = D[v.ref];
      if (!P) return { error: 'Pick a refrigerant.' };
      if (!H.isNum(v.psig)) return { error: 'Enter the suction pressure in psig.' };
      if (v.psig < P[0] || v.psig > P[P.length - 1]) return { error: 'That pressure is outside the ' + names[v.ref] + ' table (' + P[0] + '–' + P[P.length - 1] + ' psig). Check the gauge and refrigerant.' };
      for (var i = 0; i < P.length - 1; i++) {
        if (v.psig <= P[i + 1]) { sat = D.t[i] + (v.psig - P[i]) * (D.t[i + 1] - D.t[i]) / (P[i + 1] - P[i]); break; }
      }
      how = names[v.ref] + (v.ref === 'r454b' ? ' dew point' : ' saturation') + ' at ' + H.num(v.psig, 1) + ' psig';
    }
    if (!H.isNum(v.line)) return { error: 'Enter the suction line temperature.' };
    var sh = v.line - sat;
    var rows = [
      ['Evaporator saturation temp', H.fix(sat, 1) + '°F'],
      ['Suction line temp', H.num(v.line, 1) + '°F'],
      ['Saturation source', how]
    ];
    var out = { value: H.fix(sh, 1) + '°F', label: 'Total superheat', expr: H.num(v.line, 1) + '°F − ' + H.fix(sat, 1) + '°F', rows: rows };
    if (sh < 0) {
      out.sub = 'Negative superheat means the line is colder than saturation: liquid may be reaching the compressor, or a reading is wrong. Re-check the probe and gauge.';
      return out;
    }
    if (v.meter === 'piston') {
      if (!H.isNum(v.wb) || !H.isNum(v.odb)) { out.sub = 'Add indoor wet bulb and outdoor dry bulb to get a target superheat.'; return out; }
      var target = (3 * v.wb - 80 - v.odb) / 2;
      out._target = target;
      if (target < 5) {
        rows.push(['Target superheat', 'below 5°F']);
        out.sub = 'At these conditions the target falls under 5°F, where fixed-orifice charts say not to charge by superheat. Wait for a hotter, more humid day or weigh in the charge.';
        return out;
      }
      rows.push(['Target superheat (approx.)', H.fix(target, 1) + '°F', true]);
      var d = sh - target;
      rows.push(['Difference', (d >= 0 ? '+' : '−') + H.fix(Math.abs(d), 1) + '°F']);
      out.sub = Math.abs(d) <= 3 ? 'Within 3°F of target, a common charging tolerance. Confirm against the chart on the unit.' : d > 0 ? 'Superheat is high for a piston system: a sign of low charge or a starved evaporator. Rule out low airflow before adding refrigerant.' : 'Superheat is low for a piston system: a sign of overcharge or low indoor airflow. Check the filter and blower before recovering refrigerant.';
    } else {
      out.sub = 'A TXV regulates its own superheat (often around 8–12°F at the evaporator outlet), so judge a TXV system\'s charge by subcooling, not superheat.';
    }
    return out;
  },
  quick: ({ r }) => `Superheat is the suction line temperature minus the refrigerant's saturation temperature at suction pressure. R-410A at <strong>123 psig</strong> boils at 42°F, so a suction line reading 52°F carries <strong>${r.value}</strong> of superheat. For blends with glide, such as R-454B, use the dew-point column of the PT chart.`,
  stepsTitle: 'How to calculate superheat in 4 steps',
  steps: [
    'Let the system run for at least 10–15 minutes with the indoor and outdoor coils clean and the filter in place, so pressures settle.',
    'Read the suction pressure at the vapor-line service port and convert it to the saturation (boiling) temperature with a PT chart. For R-454B and other zeotropic blends use the <strong>dew point</strong>, the temperature at which the last droplet boils off.',
    'Measure the suction line temperature with a clamp probe a few inches from the service valve. Strap it to bare copper and insulate it; a probe touching insulation or sun-warmed air is the usual reason readings go wrong.',
    'Subtract: superheat = line temperature − saturation temperature. On a piston system compare it with the target from indoor wet bulb and outdoor dry bulb; on a TXV system move on to subcooling.'
  ],
  formulaTitle: 'What is the superheat formula?',
  formula: {
    expr: 'Superheat = T<sub>suction line</sub> − T<sub>sat</sub>(P<sub>suction</sub>)<br>Target SH (fixed orifice) ≈ (3 × WB<sub>indoor</sub> − 80 − DB<sub>outdoor</sub>) ÷ 2',
    vars: [['T<sub>suction line</sub>', 'pipe temperature near the outdoor unit\'s suction service valve, °F'], ['T<sub>sat</sub>', 'saturation temperature for the measured pressure (dew point for blends), °F'], ['WB<sub>indoor</sub>', 'return-air wet-bulb temperature at the air handler, °F'], ['DB<sub>outdoor</sub>', 'dry-bulb temperature of air entering the condenser, °F']],
    note: 'The target formula is a field approximation of the fixed-orifice charging charts printed on outdoor units. Where the equipment chart and the formula disagree, use the chart. The calculator interpolates linearly between 2°F rows of the PT table, which is accurate to about 0.1°F.'
  },
  example: `<p>A new R-454B heat pump in cooling mode shows <strong>116.3 psig</strong> on the suction gauge and a suction line temperature of <strong>54°F</strong>.</p>
<p>The dew-point column puts 116.3 psig at <strong>44°F</strong>, so superheat = 54 − 44 = <strong>10°F</strong>.</p>
<p>If you had read the bubble-point (liquid) column by mistake, 116.3 psig would convert to about 41.3°F and you would report 12.7°F, almost 3°F too high. That is the glide of R-454B at this pressure, and why blends need the right column.</p>`,
  table: {
    title: 'What is the target superheat for a fixed orifice system?',
    intro: 'Approximate target superheat at the outdoor unit for piston (fixed-orifice) systems, computed with the formula above. A dash means the target is under 5°F: do not charge by superheat in those conditions.',
    head: ['Indoor wet bulb', '75°F outdoor', '80°F', '85°F', '90°F', '95°F', '100°F'],
    rows: ({ run, H }) => [56, 58, 60, 62, 63, 64, 66, 68, 70].map(wb => [wb + '°F', ...[75, 80, 85, 90, 95, 100].map(odb => {
      const t = run({ meter: 'piston', wb, odb })._target;
      return t >= 5 ? H.fix(t, 1) + '°F' : '–';
    })]),
    note: 'Measure wet bulb in the return air with a psychrometer after the system has run 15 minutes. Manufacturer charts can differ by a few degrees from this formula; the chart on your unit takes priority.'
  },
  sections: [
    {
      h2: 'What should superheat be on a TXV system versus a piston?',
      html: `<p>It depends on the metering device. A <strong>fixed orifice (piston or capillary)</strong> lets a set amount of refrigerant through, so superheat swings with heat load and charge. That makes superheat the right charging check: you compare the reading with a target that rises with indoor humidity (wet bulb) and falls as outdoor temperature climbs. On a mild, humid day the target may be 15–20°F; on a hot, dry afternoon it can drop below 5°F.</p>
<p>A <strong>thermostatic or electronic expansion valve</strong> opens and closes to hold evaporator superheat roughly constant, commonly in the 8–12°F range at the coil outlet. Because the valve hides charge problems from superheat, manufacturers have you charge TXV systems to a <a href="/subcooling-calculator">subcooling</a> target instead and use superheat only to confirm the valve is working.</p>`
    },
    {
      h2: 'What pressure and temperature does R-410A, R-22, R-32 or R-454B boil at?',
      html: `<p>The table lists the saturation pressure (psig) at common evaporator temperatures, the same dew-point data the calculator uses. R-410A and R-32 run at roughly 1.7 to 1.8 times the pressure of R-22 for the same coil temperature.</p>
<div class="twrap"><table><thead><tr><th>Evaporator temp</th><th>R-410A</th><th>R-22</th><th>R-32</th><th>R-454B dew</th></tr></thead><tbody>${ptRows}</tbody></table></div>
<p>R-410A is a near-azeotrope with negligible glide, R-22 and R-32 are single compounds, and R-454B (68.9% R-32 / 31.1% R-1234yf) glides about 2–3°F between bubble and dew. Values come from a manufacturer PT chart; always check the chart for the refrigerant on the nameplate.</p>`
    },
    {
      h2: 'What causes high or low superheat?',
      html: `<p><strong>High superheat</strong> means the refrigerant finishes boiling early in the evaporator and the rest of the coil does little cooling. Common causes are low charge (a leak), a restricted metering device or liquid-line filter drier, a TXV that has lost its bulb charge, or an oversized heat load. Suction pressure is usually low as well, and the compressor runs hot because returning vapor cools its motor.</p>
<p><strong>Low superheat</strong> means liquid is getting close to the compressor. Causes include overcharge, a dirty filter or slow blower (too little heat to boil the refrigerant), a frozen coil, or a TXV bulb that is loose or not insulated. Near-zero superheat risks liquid slugging, which can break valves. Fix airflow before touching the charge: a clogged filter can make a correct charge look 10°F short.</p>`
    },
    {
      h2: 'Do you calculate superheat at the evaporator or the condensing unit?',
      html: `<p>Charging charts for split systems are written for <strong>total superheat</strong> measured at the outdoor unit's suction service valve, which includes heat picked up along the line set. <strong>Evaporator superheat</strong>, taken at the coil outlet next to the TXV bulb, is what the valve controls and is used to set or diagnose the valve itself. On a long line set the two can differ by several degrees, so note where you measured.</p>
<p>Superheat only applies on the vapor side. On the high side the matching measurement is subcooling, taken on the liquid line with the bubble-point temperature.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for superheat?', a: 'Superheat = suction line temperature − saturation temperature at the suction pressure. With R-410A at 123 psig (42°F saturation) and a 52°F suction line, superheat is 10°F.' },
    { q: 'What should superheat be on R-410A?', a: 'There is no single number for R-410A. Fixed-orifice systems follow a target chart (often 5–20°F depending on indoor wet bulb and outdoor temperature), while TXV systems usually hold about 8–12°F and are charged by subcooling.' },
    { q: 'What is the saturation temperature of R-410A at 118 psig?', a: 'About 40°F. The manufacturer chart lists 118.4 psig vapor pressure at 40°F, the classic design evaporator temperature for residential air conditioning.' },
    { q: 'Why use the dew point for R-454B superheat?', a: 'Superheat measures how far vapor is above the point where the last liquid boils off, and for a zeotropic blend that point is the dew point. Using the bubble point would overstate superheat by the glide, about 2–3°F for R-454B.' },
    { q: 'Can you check superheat with a TXV?', a: 'Yes, but it tells you whether the valve is working, not whether the charge is right. A TXV adjusts flow to keep superheat steady, so charge level shows up in subcooling instead.' },
    { q: 'Is 20 degrees of superheat too high?', a: 'For a TXV system, 20°F is high and points to a starved coil, low charge or a restriction. For a piston system it can be normal on a mild, humid day; compare it with the target for the current wet bulb and outdoor temperature.' },
    { q: 'Do I need EPA certification to measure superheat?', a: 'Attaching gauges to an appliance and adding or removing refrigerant requires EPA Section 608 certification in the U.S. Reading a pipe temperature alone does not, but connecting hoses usually releases some refrigerant and is covered.' }
  ],
  related: ['subcooling-calculator', 'btu-calculator', 'cfm-calculator', 'temperature-converter'],
  sources: [
    { name: 'Daikin Comfort Technologies: A1 vs. A2L Pressure Temperature Chart (R-22, R-410A, R-32, R-454B)', url: 'https://www.chadwellsupply.com/globalassets/articles-pk/a2l/a2lptc-usa_04-24.pdf' },
    { name: 'Honeywell: Solstice 454B pressure-temperature chart', url: 'https://advancedmaterials.honeywell.com/content/dam/advancedmaterials/en/documents/document-lists/fluorine-products/technical/hon-ess-am-3161690-adm-tds-pt-chart-solstice-454b-ltr-en.pdf' },
    { name: 'U.S. EPA: Section 608 of the Clean Air Act (refrigerant management and technician certification)', url: 'https://www.epa.gov/section608' },
    { name: 'U.S. EPA: Significant New Alternatives Policy (SNAP) program', url: 'https://www.epa.gov/snap' }
  ],
  disclaimer: 'A field aid, not a substitute for the equipment manufacturer\'s charging instructions or EPA 608 certification.'
};
