export default {
  slug: 'kva-calculator',
  hub: 'electrical',
  name: 'kVA Calculator',
  title: 'kVA Calculator: 100 A at 208 V 3-Phase = 36.03 kVA',
  h1: 'kVA Calculator: Volt-Amps, kVA to Amps and Transformer Size',
  meta: 'kVA = volts × amps ÷ 1,000, times 1.732 on three-phase. 100 A at 208 V 3-phase is 36.03 kVA, so a 45 kVA transformer fits. Also converts kVA to amps and kW.',
  keyword: 'how to calculate kva',
  also: ['how to calculate volt amps', 'how do you calculate volt amps', 'how do you calculate kva', 'how to calculate the kva', 'how to calculate kva to amps', 'kva to amps calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'va', options: [['va', 'kVA from volts and amps'], ['amps', 'Amps from kVA (full-load current)'], ['kw', 'kVA from kW and power factor']] },
    { id: 'phase', label: 'Phase', type: 'select', value: '3', options: [['3', 'Three-phase'], ['1', 'Single-phase']] },
    { id: 'volts', label: 'Voltage', type: 'number', value: 208, suffix: 'V', help: 'Three-phase: line-to-line (208, 480, 600 V).', showIf: { mode: ['va', 'amps'] } },
    { id: 'amps', label: 'Load current', type: 'number', value: 100, suffix: 'A', showIf: { mode: ['va'] } },
    { id: 'kva', label: 'Rating', type: 'number', value: 45, suffix: 'kVA', showIf: { mode: ['amps'] } },
    { id: 'kw', label: 'Real power', type: 'number', value: 30, suffix: 'kW', showIf: { mode: ['kw'] } },
    { id: 'pf', label: 'Power factor', type: 'number', value: 0.8, help: '0.8 is the standard rating basis for generators; use the load\'s actual PF if known.', showIf: { mode: ['va', 'kw'] } }
  ],
  data: {
    std1: [5, 7.5, 10, 15, 25, 37.5, 50, 75, 100, 167, 250, 333, 500],
    std3: [9, 15, 30, 45, 75, 112.5, 150, 225, 300, 500, 750, 1000, 1500, 2000, 2500]
  },
  compute(v, H, D) {
    var three = v.phase === '3';
    var k = three ? Math.sqrt(3) : 1;
    var kva, rows = [], expr, out;
    function nextStd(x) { var L = three ? D.std3 : D.std1; for (var i = 0; i < L.length; i++) if (L[i] >= x - 1e-9) return L[i]; return null; }
    if (v.mode === 'amps') {
      if (!(v.kva > 0)) return { error: 'Enter the kVA rating.' };
      if (!(v.volts > 0)) return { error: 'Enter the voltage.' };
      var I = v.kva * 1000 / (v.volts * k);
      rows.push(['Volt-amperes', H.num(v.kva * 1000, 0) + ' VA']);
      rows.push(['80% of full load (continuous planning limit)', H.num(I * 0.8, 1) + ' A']);
      rows.push(['Real power at 0.8 PF', H.num(v.kva * 0.8, 2) + ' kW']);
      return {
        value: H.num(I, 1) + ' A', label: 'Full-load current' + (three ? ' per phase' : ''),
        expr: H.num(v.kva, 2) + ' kVA × 1,000 ÷ (' + H.num(v.volts, 0) + ' V' + (three ? ' × 1.732' : '') + ')',
        rows: rows, sub: 'Conductors and overcurrent protection are sized from this current; see NEC Article 450 for transformer protection.'
      };
    }
    if (v.mode === 'kw') {
      if (!(v.kw > 0)) return { error: 'Enter the real power in kW.' };
      if (!(v.pf > 0 && v.pf <= 1)) return { error: 'Power factor must be greater than 0 and no more than 1.' };
      kva = v.kw / v.pf;
      expr = H.num(v.kw, 2) + ' kW ÷ ' + H.num(v.pf, 3) + ' PF';
      rows.push(['Reactive power', H.num(Math.sqrt(kva * kva - v.kw * v.kw), 2) + ' kVAR']);
    } else {
      if (!(v.volts > 0)) return { error: 'Enter the voltage.' };
      if (!(v.amps > 0)) return { error: 'Enter the load current.' };
      kva = v.volts * v.amps * k / 1000;
      expr = H.num(v.volts, 0) + ' V × ' + H.num(v.amps, 2) + ' A' + (three ? ' × 1.732' : '') + ' ÷ 1,000';
      rows.push(['Volt-amperes', H.num(kva * 1000, 0) + ' VA']);
      if (v.pf > 0 && v.pf <= 1) rows.push(['Real power at ' + H.num(v.pf, 2) + ' PF', H.num(kva * v.pf, 2) + ' kW']);
    }
    var s = nextStd(kva);
    rows.push(['Next standard ' + (three ? 'three' : 'single') + '-phase transformer', s ? H.num(s, 1) + ' kVA' : 'larger than listed sizes', true]);
    if (s) rows.push(['Loading at that size', H.pct(kva / s * 100, 0)]);
    out = { value: H.num(kva, 2) + ' kVA', label: 'Apparent power', expr: expr, rows: rows };
    var load = s ? kva / s * 100 : 0, up = s ? nextStd(s + 0.001) : null;
    out.sub = !s ? 'Above common standard sizes; consult the manufacturer.'
      : Math.round(load) <= 80 ? 'A ' + H.num(s, 1) + ' kVA unit runs at ' + H.pct(load, 0) + ' of its rating with this load, within the 80% many designers aim for.'
      : 'A ' + H.num(s, 1) + ' kVA unit would run at ' + H.pct(load, 0) + ' of its rating, leaving little headroom' + (up ? '; consider ' + H.num(up, 1) + ' kVA.' : '.');
    return out;
  },
  quick: ({ r }) => `To calculate kVA, multiply volts by amps and divide by 1,000; for three-phase, multiply by 1.732 as well. A <strong>100-amp</strong> load on a <strong>208-volt three-phase</strong> panel is 208 × 100 × 1.732 ÷ 1,000 = <strong>${r.value}</strong>, so the next standard transformer is 45 kVA. Single-phase 240 V at 100 A is 24 kVA. kW = kVA × power factor.`,
  stepsTitle: 'How to calculate kVA step by step',
  steps: [
    'Get the voltage and the current. For three-phase, use the voltage between two hot lines and the current in one line.',
    'Multiply volts × amps to get volt-amperes (VA). On three-phase, multiply that by 1.732 (√3).',
    'Divide by 1,000 to convert VA to kVA.',
    'To size a transformer, round up to the next standard rating. <strong>Do not undersize to the nearest rating</strong>: a transformer run above its nameplate kVA overheats.'
  ],
  formulaTitle: 'What is the kVA formula?',
  formula: {
    expr: 'Single-phase: kVA = V × I ÷ 1,000 &nbsp;·&nbsp; I = kVA × 1,000 ÷ V<br>Three-phase: kVA = V × I × 1.732 ÷ 1,000 &nbsp;·&nbsp; I = kVA × 1,000 ÷ (1.732 × V)<br>kVA = kW ÷ PF',
    vars: [['V', 'volts (line-to-line for three-phase)'], ['I', 'amps per line'], ['PF', 'power factor of the load'], ['1.732', 'square root of 3']]
  },
  example: `<p>A small office on a 480 V three-phase supply measures 52 A per phase at peak. What transformer does it need to step down to 208Y/120 V?</p>
<p>kVA = 480 × 52 × 1.732 ÷ 1,000 = <strong>43.23 kVA</strong>. The next standard three-phase rating is <strong>45 kVA</strong>, which would run at 96%. With little headroom for growth, many designers would choose 75 kVA instead.</p>
<p>On the 208 V side, a 45 kVA transformer can deliver 45,000 ÷ (1.732 × 208) = <strong>124.9 A</strong> per phase.</p>`,
  table: {
    title: 'How many amps is a 15, 45 or 75 kVA transformer?',
    intro: 'Full-load current for standard transformer ratings, calculated with I = kVA × 1,000 ÷ V (single-phase) or ÷ (1.732 × V) (three-phase).',
    head: ['kVA', '240 V single-phase', '208 V three-phase', '480 V three-phase'],
    rows: ({ run, H }) => [15, 25, 30, 37.5, 45, 50, 75, 100, 112.5, 150, 225, 300, 500].map(x => [H.num(x, 1) + ' kVA',
      run({ mode: 'amps', phase: '1', volts: 240, kva: x }).value,
      run({ mode: 'amps', phase: '3', volts: 208, kva: x }).value,
      run({ mode: 'amps', phase: '3', volts: 480, kva: x }).value]),
    note: 'Single-phase pad-mount and pole transformers commonly come in 10, 15, 25, 37.5, 50, 75, 100 and 167 kVA; common three-phase dry-types are 15, 30, 45, 75, 112.5, 150, 225 and 300 kVA. Confirm availability with the supplier.'
  },
  sections: [
    {
      h2: 'How do you calculate volt-amps (VA)?',
      html: `<p>Volt-amps are simply volts times amps: VA = V × I. A device that pulls 2.5 A at 120 V is a 300 VA load. You see VA most on UPS units and small control transformers, which list both a VA and a watt rating. A "1,500 VA / 900 W" UPS can handle loads up to 1,500 VA <em>and</em> 900 W, whichever limit comes first.</p>
<p>To check a UPS, add the wattage of everything plugged in, then divide by the load's power factor to get VA. Computers with active power factor correction sit near 0.95 to 0.99, so 600 W of equipment is roughly 610 to 630 VA and fits either limit with room to spare.</p>`
    },
    {
      h2: 'What is the difference between kVA and kW?',
      html: `<p>kVA is apparent power, the total current the equipment has to carry multiplied by voltage. kW is real power, the part that ends up as heat, light or motion. They are linked by the power factor: kW = kVA × PF.</p>
<p>A resistive heater has PF 1, so 10 kVA is 10 kW. An induction motor at PF 0.8 drawing 10 kVA does only 8 kW of work; the remaining current magnetizes the motor. Transformers, generators and cables heat up from total current, which is why they are rated in kVA, while your energy bill counts kWh. For kW from amps, use the <a href="/kw-calculator">kW calculator</a>.</p>`
    },
    {
      h2: 'How do you size a transformer or generator in kVA?',
      html: `<ol><li>Add up the connected or measured load in kVA, using each item's volts × amps (× 1.732 if three-phase).</li>
<li>Apply realistic diversity: not every load runs at once, which is what the demand factors in NEC Article 220 account for.</li>
<li>Add margin for future load and motor starting. Large motors can draw several times their running current for a few seconds at start-up.</li>
<li>Round up to the next standard rating.</li></ol>
<p>Generators follow the same arithmetic but are usually rated at 0.8 power factor, so a 50 kVA standby unit supplies 40 kW of real power. For a home backup generator sized in watts, use the <a href="/generator-size-calculator">generator size calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do you convert kVA to amps?', a: 'Multiply kVA by 1,000 and divide by voltage for single-phase, or by 1.732 × voltage for three-phase. 75 kVA at 480 V three-phase is 75,000 ÷ 831.4 = 90.2 A.' },
    { q: 'How many amps is 1 kVA?', a: '1 kVA is 8.33 A at 120 V, 4.17 A at 240 V, 2.78 A per phase at 208 V three-phase and 1.20 A per phase at 480 V three-phase.' },
    { q: 'How many kW is 1 kVA?', a: 'It depends on power factor: 1 kVA is 1 kW at PF 1, 0.9 kW at PF 0.9 and 0.8 kW at PF 0.8.' },
    { q: 'Is kVA the same as VA?', a: 'Yes, scaled by 1,000. 1 kVA = 1,000 VA, so a 2,200 VA UPS is 2.2 kVA.' },
    { q: 'Why multiply by 1.732 for three-phase kVA?', a: 'Three-phase power is spread across three lines whose voltages are 120° apart. Total apparent power works out to √3 (1.732) × line-to-line voltage × line current.' },
    { q: 'What size transformer do I need for 200 amps?', a: 'At 240 V single-phase, 200 A is 48 kVA, so a 50 kVA unit. At 208 V three-phase, 200 A is 72.05 kVA, so a 75 kVA unit. At 480 V three-phase it is 166.3 kVA, so 225 kVA.' },
    { q: 'Should I size a transformer at 80% load?', a: 'Many designers aim to load transformers at no more than about 80% of nameplate kVA for continuous use and future growth. It is a design choice rather than a code limit; follow the engineer of record and manufacturer guidance.' }
  ],
  related: ['kw-calculator', 'amps-calculator', 'generator-size-calculator', 'wire-size-calculator'],
  sources: [
    { name: 'NFPA 70: National Electrical Code (Articles 220 and 450)', url: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' },
    { name: 'NIST: SI Units', url: 'https://www.nist.gov/pml/owm/metric-si/si-units' },
    { name: 'OSHA: Electrical Safety', url: 'https://www.osha.gov/electrical' }
  ],
  disclaimer: 'Transformer and generator selection should be confirmed by a licensed electrician or engineer.'
};
