export default {
  slug: 'amps-calculator',
  hub: 'electrical',
  name: 'Amps Calculator',
  title: 'Amps Calculator: 1,500 Watts at 120 Volts Is 12.5 Amps',
  h1: 'Amps Calculator: Convert Watts to Amps (DC, AC and 3-Phase)',
  meta: 'Divide watts by volts to get amps: 1,500 W on a 120 V circuit draws 12.5 A. Handles DC, single-phase AC with power factor, three-phase and amps to watts.',
  keyword: 'how to calculate amps',
  also: ['how do you calculate amps', 'how do i calculate amperage', 'how to calculate ampere', 'how to calculate watts to amps formula', 'how do i calculate amps from watts and volts', 'how to calculate amp to watts', 'how to calculate wattage from amps', 'how to calculate amp draw', 'how to calculate total amps in breaker panel'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I want to find', type: 'select', value: 'w2a', options: [['w2a', 'Amps (from watts)'], ['a2w', 'Watts (from amps)']] },
    { id: 'system', label: 'Circuit type', type: 'select', value: 'ac1', options: [['ac1', 'AC single-phase'], ['ac3', 'AC three-phase'], ['dc', 'DC (battery, solar, automotive)']] },
    { id: 'watts', label: 'Power', type: 'number', value: 1500, suffix: 'W', help: 'From the nameplate or manual. 1 kW = 1,000 W.', showIf: { mode: ['w2a'] } },
    { id: 'amps', label: 'Current', type: 'number', value: 15, suffix: 'A', showIf: { mode: ['a2w'] } },
    { id: 'volts', label: 'Voltage', type: 'number', value: 120, suffix: 'V', help: 'For three-phase use the line-to-line voltage (208, 240 or 480 V).' },
    { id: 'pf', label: 'Power factor', type: 'number', value: 1, help: '1.0 for heaters and incandescent lights; about 0.8–0.95 for motors and electronics.', showIf: { system: ['ac1', 'ac3'] } }
  ],
  data: { breakers: [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600] },
  compute(v, H, D) {
    var sys = v.system;
    if (!(v.volts > 0)) return { error: 'Enter the voltage.' };
    var pf = sys === 'dc' ? 1 : v.pf;
    if (!(pf > 0 && pf <= 1)) return { error: 'Power factor must be greater than 0 and no more than 1.' };
    var k = sys === 'ac3' ? Math.sqrt(3) : 1;
    var per = v.volts * pf * k;
    var watts, amps;
    if (v.mode === 'a2w') {
      if (!(v.amps > 0)) return { error: 'Enter the current in amps.' };
      amps = v.amps; watts = amps * per;
    } else {
      if (!(v.watts > 0)) return { error: 'Enter the power in watts.' };
      watts = v.watts; amps = watts / per;
    }
    var va = amps * v.volts * k;
    var parts = H.num(v.volts, 1) + ' V' + (sys === 'ac3' ? ' × √3' : '') + (sys !== 'dc' && pf !== 1 ? ' × ' + H.num(pf, 3) + ' PF' : '');
    var need = amps * 1.25, brk = null;
    for (var i = 0; i < D.breakers.length; i++) { if (D.breakers[i] >= need - 1e-9) { brk = D.breakers[i]; break; } }
    var rows = [['Power in kilowatts', H.num(watts / 1000, 3) + ' kW', true]];
    if (sys === 'ac3') rows.push(['Current in each of the 3 lines', H.num(amps, 2) + ' A']);
    if (sys !== 'dc') rows.push(['Apparent power', H.num(va, 0) + ' VA']);
    rows.push(['Amps per 1,000 W at this voltage', H.num(1000 / per, 2) + ' A']);
    rows.push(['Breaker if the load runs 3+ hours (125%)', brk ? brk + ' A' : 'over 600 A']);
    var out = v.mode === 'a2w'
      ? { value: H.num(watts, 0) + ' W', label: 'Power (watts)', expr: H.num(amps, 2) + ' A × ' + parts, rows: rows }
      : { value: H.num(amps, 2) + ' A', label: 'Current (amps)', expr: H.num(watts, 0) + ' W ÷ ' + (parts.indexOf('×') > 0 ? '(' + parts + ')' : parts), rows: rows };
    out.sub = sys === 'ac3'
      ? 'Three-phase current is per line: each of the three conductors carries ' + H.num(amps, 2) + ' A.'
      : (sys === 'dc' ? 'DC has no power factor, so amps are simply watts ÷ volts.' : 'At ' + H.num(v.volts, 0) + ' V, every 1,000 W draws about ' + H.num(1000 / per, 2) + ' A.');
    return out;
  },
  quick: ({ r }) => `To calculate amps, divide watts by volts. A <strong>1,500-watt</strong> space heater on a <strong>120-volt</strong> circuit draws 1,500 ÷ 120 = <strong>${r.value}</strong>. For AC motors and electronics, also divide by the power factor; for three-phase, divide watts by 1.732 × volts × power factor. To go the other way, multiply amps by volts to get watts.`,
  stepsTitle: 'How to calculate amps in 4 steps',
  steps: [
    'Find the power in watts on the nameplate, charger brick or manual. If it is in kilowatts, multiply by 1,000; if it only lists amps, you already have your answer.',
    'Pick the voltage the device actually runs on: 120 V for ordinary U.S. outlets, 240 V for dryers and ranges, 12 V for car and RV gear, 208 or 480 V for commercial three-phase.',
    'For AC loads with motors, compressors or power supplies, find the power factor (PF). <strong>This is the step people skip</strong>: a 0.8 PF load pulls 25% more current than its watts suggest.',
    'Divide: amps = watts ÷ (volts × PF), and for three-phase amps = watts ÷ (1.732 × volts × PF). Size the breaker at 125% of that figure if the load runs three hours or more.'
  ],
  formulaTitle: 'What is the formula for watts to amps?',
  formula: {
    expr: 'DC: I = P ÷ V<br>AC single-phase: I = P ÷ (V × PF)<br>AC three-phase: I = P ÷ (√3 × V<sub>L-L</sub> × PF)<br>Amps to watts: P = I × V × PF (× √3 for three-phase)',
    vars: [['I', 'current in amperes (A)'], ['P', 'real power in watts (W)'], ['V', 'voltage in volts; V<sub>L-L</sub> is line-to-line on three-phase'], ['PF', 'power factor, 0 to 1 (1 for resistive loads)'], ['√3', '1.732, the three-phase constant']],
    note: 'Power factor only applies to AC. A resistive load such as a heater, toaster or incandescent bulb has a PF of 1, so the single-phase formula becomes the same as DC.'
  },
  example: `<p><strong>DC:</strong> a 600 W inverter load on a 12 V battery draws 600 ÷ 12 = <strong>50 A</strong> from the battery (more once inverter losses are added).</p>
<p><strong>Single-phase with power factor:</strong> a 1,200 W window air conditioner at 120 V with a PF of 0.85 draws 1,200 ÷ (120 × 0.85) = 1,200 ÷ 102 = <strong>11.76 A</strong>, not the 10 A you would get by ignoring PF.</p>
<p><strong>Three-phase:</strong> a 7,500 W load on a 208 V three-phase panel at PF 0.9 draws 7,500 ÷ (1.732 × 208 × 0.9) = 7,500 ÷ 324.2 = <strong>23.13 A</strong> on each line.</p>`,
  table: {
    title: 'How many amps is 1,000, 1,500 or 5,000 watts?',
    intro: 'Current for common wattages at the voltages you meet in homes, vehicles and commercial buildings, worked out by the calculator above with a power factor of 1.0.',
    head: ['Watts', '12 V DC', '120 V', '240 V', '208 V 3-phase', '480 V 3-phase'],
    rows: ({ run, H }) => [100, 300, 500, 1000, 1500, 1800, 2400, 3000, 3600, 5000, 7200, 10000].map(w => [H.num(w, 0) + ' W',
      run({ mode: 'w2a', system: 'dc', watts: w, volts: 12 }).value,
      run({ mode: 'w2a', system: 'ac1', watts: w, volts: 120, pf: 1 }).value,
      run({ mode: 'w2a', system: 'ac1', watts: w, volts: 240, pf: 1 }).value,
      run({ mode: 'w2a', system: 'ac3', watts: w, volts: 208, pf: 1 }).value,
      run({ mode: 'w2a', system: 'ac3', watts: w, volts: 480, pf: 1 }).value]),
    note: 'For a motor or other inductive load, divide the figure by its power factor: at PF 0.85 the 120 V column rises by about 18%.'
  },
  sections: [
    {
      h2: 'How do you calculate amps on a three-phase circuit?',
      html: `<p>Use the line-to-line voltage and divide by √3 (1.732) as well: I = P ÷ (1.732 × V × PF). The answer is the current in <em>each</em> of the three hot conductors, which is what you compare with the breaker and wire rating. You do not add the three lines together.</p>
<p>The √3 appears because the three phases peak 120° apart, so a three-phase circuit delivers 1.732 times the power of a single-phase circuit at the same line voltage and current. That is why a 10 kW heater draws 41.7 A on 240 V single-phase but only 27.8 A per line on 208 V three-phase.</p>
<p>Watch the voltage label. A "120/208 V" building has 120 V from any hot to neutral and 208 V between hots; use 208 in the three-phase formula. On a "277/480 V" system use 480. If you only know the line-to-neutral voltage, multiply it by 1.732 first.</p>`
    },
    {
      h2: 'How do you calculate amps to watts?',
      html: `<p>Multiply amps by volts: watts = amps × volts (× PF for AC motors, × 1.732 more for three-phase). Switch the calculator to <em>Watts (from amps)</em> to do it with power factor included. The most useful version of this is knowing how much a circuit can carry:</p>
<div class="twrap"><table><thead><tr><th>Circuit</th><th>Maximum watts</th><th>Continuous (80%) watts</th></tr></thead><tbody>
<tr><td>15 A at 120 V</td><td>1,800 W</td><td>1,440 W</td></tr>
<tr><td>20 A at 120 V</td><td>2,400 W</td><td>1,920 W</td></tr>
<tr><td>30 A at 240 V</td><td>7,200 W</td><td>5,760 W</td></tr>
<tr><td>40 A at 240 V</td><td>9,600 W</td><td>7,680 W</td></tr>
<tr><td>50 A at 240 V</td><td>12,000 W</td><td>9,600 W</td></tr>
</tbody></table></div>
<p>The 80% column comes from the National Electrical Code: a breaker must be rated at 125% of any load that runs three hours or more, which is the same as loading it to 80%. A space heater, EV charger or water heater counts as continuous.</p>`
    },
    {
      h2: 'How do you calculate amp draw of an appliance?',
      html: `<p>Start with the nameplate. Most appliances list either amps directly or watts and volts; divide watts by volts if only watts are given. Motor nameplates list full-load amps (FLA), which already includes power factor and efficiency, so use that number as-is.</p>
<p>Three cautions keep the estimate honest:</p>
<ul><li><strong>Starting current:</strong> motors and compressors draw several times their running amps for a second or two at start-up. That surge trips undersized breakers and is the main reason generators are sized above running load; the <a href="/generator-size-calculator">generator size calculator</a> handles it.</li>
<li><strong>Nameplate is a maximum:</strong> a refrigerator or air conditioner cycles, so its average draw is lower than the label. To measure real draw, use a clamp meter around one conductor (not the whole cord) or a plug-in watt meter.</li>
<li><strong>Chargers and power supplies:</strong> a laptop brick rated 65 W at the output pulls a little more from the wall because of conversion losses and a power factor below 1.</li></ul>`
    },
    {
      h2: 'How do you calculate amps for a motor from horsepower?',
      html: `<p>Convert horsepower to watts of shaft output (1 hp = 746 W), then divide by efficiency as well as power factor: I = hp × 746 ÷ (V × efficiency × PF), with an extra √3 in the denominator for three-phase. A 10 hp motor on 460 V three-phase at 90% efficiency and 0.85 PF draws about 7,460 ÷ (1.732 × 460 × 0.90 × 0.85) = <strong>12.2 A</strong>.</p>
<p>For wire and breaker sizing, electricians do not use that estimate. NEC Article 430 requires the full-load current tables instead, which are deliberately conservative: Table 430.250 lists 14 A for a 10 hp, 460 V three-phase motor (28 A at 230 V), and Table 430.248 lists 16 A for a 1 hp single-phase motor at 115 V. Use the nameplate FLA for overload protection and the table value for conductors.</p>`
    },
    {
      h2: 'How do you calculate total amps in a breaker panel?',
      html: `<p>Not by adding the breaker handles. A typical 200 A panel can easily hold breakers that sum to 400 A or more, because circuits rarely run at full load together. Electricians size a service with the load calculation in NEC Article 220: general lighting at 3 volt-amperes per square foot, small-appliance and laundry circuits, fixed appliances, the larger of heating or cooling, and demand factors that discount loads unlikely to run at once.</p>
<p>For a quick reality check, add the watts of everything that could realistically run at the same moment, divide by 240 V, and compare the result with your main breaker. A house drawing 9,600 W at once is pulling 40 A per leg on 240 V service. The NEC sets 100 A as the minimum service for a one-family dwelling, and 200 A is common for homes with electric heat, an electric range and an EV charger. Use the calculation as a planning number and have a licensed electrician confirm it before adding big loads.</p>`
    }
  ],
  faq: [
    { q: 'How many amps is 1,500 watts?', a: '1,500 watts is 12.5 amps at 120 volts and 6.25 amps at 240 volts, assuming a resistive load such as a heater (power factor 1).' },
    { q: 'How many watts can a 15-amp circuit handle?', a: 'A 15-amp, 120-volt circuit can carry 1,800 watts at most and 1,440 watts for a load that runs three hours or more, because continuous loads are limited to 80% of the breaker rating.' },
    { q: 'How do you calculate amps from kilowatts?', a: 'Multiply kilowatts by 1,000 to get watts, then divide by volts (and by power factor for AC). A 5 kW load at 240 V and PF 1 draws 5,000 ÷ 240 = 20.83 amps.' },
    { q: 'What power factor should I use?', a: 'Use 1.0 for heaters, ovens, kettles and incandescent lights. For motors, compressors and pumps use the nameplate value, or 0.8 to 0.9 if none is given. Modern electronics with power factor correction run around 0.9 to 0.99.' },
    { q: 'How many amps does 240 volts draw?', a: 'Voltage alone does not set the current; the load does. A 4,800 W water heater at 240 V draws 20 amps, while a 2,400 W heater on the same circuit draws 10 amps. Doubling the voltage for the same wattage halves the amps.' },
    { q: 'Why does three-phase use 1.732?', a: '1.732 is the square root of 3. Three-phase voltages are offset by 120°, so line-to-line voltage is √3 times line-to-neutral voltage and total power is √3 × V × I × PF.' },
    { q: 'How do I convert kVA to amps?', a: 'Divide volt-amperes by volts for single-phase, or by 1.732 × volts for three-phase. A 45 kVA transformer at 208 V three-phase supplies 45,000 ÷ (1.732 × 208) = 124.9 amps. The kVA calculator has a full transformer table.' }
  ],
  related: ['ohms-law-calculator', 'kw-calculator', 'kva-calculator', 'wire-size-calculator', 'electricity-cost-calculator'],
  sources: [
    { name: 'NFPA 70: National Electrical Code (Articles 210, 220, 240)', url: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' },
    { name: 'NIST: SI Units (ampere, volt, watt)', url: 'https://www.nist.gov/pml/owm/metric-si/si-units' },
    { name: 'OSHA: Electrical Safety', url: 'https://www.osha.gov/electrical' }
  ],
  disclaimer: 'For planning only. Breaker, wire and service sizing must follow the NEC and your local code; have a licensed electrician verify.'
};
