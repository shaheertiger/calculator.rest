// NEC (NFPA 70) Table 310.16 allowable ampacities, 75 °C column, not more than three current-carrying conductors
// in raceway/cable, 30 °C (86 °F) ambient. cu60 = 60 °C column for copper NM-B sizes. R = Chapter 9 Table 8
// DC resistance, stranded, uncoated copper / aluminum, ohms per 1,000 ft at 75 °C.
const W = {
  size: ['14 AWG', '12 AWG', '10 AWG', '8 AWG', '6 AWG', '4 AWG', '3 AWG', '2 AWG', '1 AWG', '1/0 AWG', '2/0 AWG', '3/0 AWG', '4/0 AWG', '250 kcmil', '300 kcmil', '350 kcmil', '400 kcmil', '500 kcmil', '600 kcmil', '750 kcmil', '1000 kcmil'],
  cu: [20, 25, 35, 50, 65, 85, 100, 115, 130, 150, 175, 200, 230, 255, 285, 310, 335, 380, 420, 475, 545],
  al: [0, 20, 30, 40, 50, 65, 75, 90, 100, 120, 135, 155, 180, 205, 230, 250, 270, 310, 340, 385, 445],
  cu60: [15, 20, 30, 40, 55, 70, 85, 95],
  ocpdCu: [15, 20, 30],
  ocpdAl: [0, 15, 25],
  rCu: [3.14, 1.98, 1.24, 0.778, 0.491, 0.308, 0.245, 0.194, 0.154, 0.122, 0.0967, 0.0766, 0.0608, 0.0515, 0.0429, 0.0367, 0.0321, 0.0258, 0.0214, 0.0171, 0.0129],
  rAl: [0, 3.25, 2.04, 1.28, 0.808, 0.508, 0.403, 0.319, 0.253, 0.201, 0.159, 0.126, 0.1, 0.0847, 0.0707, 0.0605, 0.0529, 0.0424, 0.0353, 0.0282, 0.0212]
};

export default {
  slug: 'wire-size-calculator',
  hub: 'electrical',
  name: 'Wire Size Calculator',
  title: 'Wire Size Calculator: 40 A at 240 V Over 150 ft Needs 6 AWG',
  h1: 'Wire Gauge Calculator: Ampacity Plus a 3% Voltage-Drop Check',
  meta: 'A 40 A, 240 V load 150 ft away needs 6 AWG copper: 8 AWG has the ampacity but drops 3.9%. Sizes copper or aluminum from NEC Table 310.16 (75°C column).',
  keyword: 'how to calculate wire size',
  also: ['wire size calculator', 'wire gauge calculator', 'what size wire do i need', 'voltage drop wire size', 'how to calculate wire size for amps and distance', 'wire size for 50 amp'],
  updated: '2026-11-13',
  inputs: [
    { id: 'amps', label: 'Load current', type: 'number', value: 40, suffix: 'A' },
    { id: 'volts', label: 'Circuit voltage', type: 'number', value: 240, suffix: 'V' },
    { id: 'phase', label: 'System', type: 'select', value: '1', options: [['1', 'Single-phase AC'], ['3', 'Three-phase AC'], ['dc', 'DC (2-wire)']] },
    { id: 'length', label: 'One-way length (panel to load)', type: 'number', value: 150, suffix: 'ft' },
    { id: 'metal', label: 'Conductor', type: 'select', value: 'cu', options: [['cu', 'Copper'], ['al', 'Aluminum']] },
    { id: 'method', label: 'Wiring method', type: 'select', value: 'wire', options: [['wire', 'THHN/THWN or XHHW in conduit, 75°C terminals'], ['nm', 'NM-B (Romex) cable, 60°C limit']] },
    { id: 'drop', label: 'Maximum voltage drop', type: 'number', value: 3, suffix: '%' },
    { id: 'cont', label: 'Continuous load (3 hours or more, e.g. EV charger, water heater)', type: 'checkbox', value: false }
  ],
  data: W,
  compute(v, H, D) {
    if (!(v.amps > 0)) return { error: 'Enter the load current in amps.' };
    if (!(v.volts > 0)) return { error: 'Enter the circuit voltage.' };
    if (!(v.length > 0)) return { error: 'Enter the one-way distance in feet.' };
    var maxPct = v.drop > 0 ? v.drop : 3;
    var al = v.metal === 'al';
    var nm = v.method === 'nm';
    if (nm && al) return { error: 'NM-B cable sizing here covers copper only. Choose copper, or conductors in conduit for aluminum.' };
    var need = v.amps * (v.cont ? 1.25 : 1);
    var amp = al ? D.al : (nm ? D.cu60 : D.cu);
    var lim = al ? D.ocpdAl : D.ocpdCu;
    var R = al ? D.rAl : D.rCu;
    var k = v.phase === '3' ? Math.sqrt(3) : 2;
    var allow = function (i) { var a = amp[i]; if (!a) return 0; if (lim[i]) a = Math.min(a, lim[i]); return a; };
    var vd = function (i) { return k * v.amps * R[i] * v.length / 1000; };
    var ai = -1;
    for (var i = 0; i < amp.length; i++) { if (allow(i) >= need) { ai = i; break; } }
    if (ai < 0) return { error: nm ? 'NM-B cable tops out at 2 AWG (95 A) here. Use conductors in conduit for this load.' : 'Over 1000 kcmil: this load needs parallel conductors. Have an engineer or electrician size it.' };
    var fi = -1;
    for (var j = ai; j < amp.length; j++) { if (vd(j) / v.volts * 100 <= maxPct) { fi = j; break; } }
    if (fi < 0) return { error: 'Even the largest size in the table drops more than ' + H.num(maxPct, 1) + '% at this distance. Raise the voltage or shorten the run.' };
    var drop = vd(fi), pct = drop / v.volts * 100;
    var rows = [
      ['Minimum size for ampacity', D.size[ai] + ' (' + allow(ai) + ' A' + (nm ? ', 60°C' : ', 75°C') + ')'],
      ['Voltage drop on ' + D.size[ai], H.fix(vd(ai), 2) + ' V (' + H.fix(vd(ai) / v.volts * 100, 2) + '%)'],
      fi > ai ? ['Voltage drop on ' + D.size[fi], H.fix(drop, 2) + ' V (' + H.fix(pct, 2) + '%)', true] : null,
      ['Voltage at the load', H.fix(v.volts - drop, 1) + ' V']
    ];
    if (v.cont) rows.unshift(['Ampacity needed (125% continuous)', H.num(need, 1) + ' A']);
    rows = rows.filter(function (x) { return x; });
    var maxFt = maxPct / 100 * v.volts * 1000 / (k * v.amps * R[fi]);
    rows.push(['Longest run on ' + D.size[fi] + ' at ' + H.num(maxPct, 1) + '%', H.int(maxFt) + ' ft']);
    return {
      value: D.size[fi],
      label: (al ? 'Aluminum' : 'Copper') + ' conductor size',
      expr: H.num(v.amps, 1) + ' A · ' + H.num(v.volts, 0) + ' V · ' + H.num(v.length, 0) + ' ft',
      rows: rows,
      _ai: ai,
      sub: fi > ai ? 'Voltage drop, not ampacity, sets the size here: ' + D.size[ai] + ' could carry the current but would lose ' + H.fix(vd(ai) / v.volts * 100, 1) + '% over this distance.' : 'Ampacity sets the size; voltage drop is within ' + H.num(maxPct, 1) + '%. The breaker must not exceed the wire\'s rating.'
    };
  },
  quick: ({ r }) => `To calculate wire size, find the smallest gauge whose NEC ampacity covers the load, then check voltage drop over the distance. A 40-amp, 240-volt circuit running 150 feet needs <strong>${r.value} copper</strong>: 8 AWG is rated 50 A at 75°C but would drop 3.9%, while 6 AWG loses 5.89 V (2.46%), inside the 3% guideline.`,
  stepsTitle: 'How to calculate wire size in 5 steps',
  steps: [
    'Find the load current from the nameplate, or divide watts by volts (use the <a href="/amps-calculator">amps calculator</a> for three-phase or power factor).',
    'If the load runs 3 hours or more at a time, multiply by 1.25. EV chargers, electric water heaters and many heaters are continuous loads; forgetting this is the most common sizing mistake.',
    'Pick the smallest conductor whose ampacity in NEC Table 310.16 meets that current: the 75°C column for wires in conduit with 75°C-rated terminals, the 60°C column for NM-B cable. Small copper is also capped by breaker size: 15 A on 14 AWG, 20 A on 12 AWG, 30 A on 10 AWG.',
    'Measure the one-way distance and work out voltage drop. If it is over 3% for a branch circuit, step up a size until it is under.',
    'Adjust for anything unusual: more than three current-carrying conductors in one conduit, hot attics or rooftops, and local amendments. A licensed electrician or inspector has the final say.'
  ],
  formulaTitle: 'What is the voltage drop formula for wire sizing?',
  formula: {
    expr: 'Single-phase or DC: V<sub>drop</sub> = 2 × I × R × L ÷ 1000<br>Three-phase: V<sub>drop</sub> = 1.732 × I × R × L ÷ 1000<br>% drop = V<sub>drop</sub> ÷ V × 100',
    vars: [['I', 'load current, amps'], ['R', 'conductor resistance, ohms per 1,000 ft (NEC Chapter 9, Table 8, at 75°C)'], ['L', 'one-way length, feet'], ['V', 'circuit voltage']],
    note: 'The factor 2 counts the trip out and back. DC resistance is accurate for most branch circuits; for large conductors on AC, the reactance values in Chapter 9, Table 9 add a little more drop.'
  },
  example: `<p>A 48 A Level 2 EV charger on a 60 A, 240 V circuit sits 75 ft from the panel, wired with copper THHN in conduit.</p>
<p>It is a continuous load, so the conductors need 48 × 1.25 = <strong>60 A</strong> of ampacity. In the 75°C column, 6 AWG copper carries 65 A, the first size that qualifies.</p>
<p>Voltage drop on 6 AWG: 2 × 48 × 0.491 × 75 ÷ 1000 = <strong>3.54 V</strong>, which is 1.47% of 240 V. That passes, so <strong>6 AWG copper</strong> on a 60 A breaker is the answer.</p>`,
  table: {
    title: 'What size wire do I need for 20, 30, 50, 100 or 200 amps?',
    intro: 'Smallest conductors by ampacity alone (75°C column, conduit), with the longest single-phase 240 V run that keeps copper under 3% drop at full load. Longer runs need a bigger size.',
    head: ['Load (amps)', 'Copper', 'Aluminum', 'Max 240 V run on that copper at 3%'],
    rows: ({ run, D, H }) => [15, 20, 30, 40, 50, 60, 70, 80, 100, 125, 150, 200].map(a => {
      const cu = run({ amps: a, length: 1, metal: 'cu', method: 'wire', cont: false, drop: 3, volts: 240, phase: '1' });
      const al = run({ amps: a, length: 1, metal: 'al', method: 'wire', cont: false, drop: 3, volts: 240, phase: '1' });
      const ft = 0.03 * 240 * 1000 / (2 * a * D.rCu[cu._ai]);
      return [a + ' A', cu.value, al.value, H.int(ft) + ' ft'];
    }),
    note: 'For a whole-dwelling 120/240 V service or main feeder, NEC Table 310.12 allows smaller conductors (for 200 A: 2/0 copper or 4/0 aluminum). NM-B cable uses the 60°C column, so a 40 A circuit in NM-B needs 8 AWG and a 50 A circuit needs 6 AWG.'
  },
  sections: [
    {
      h2: 'How does distance change the wire size?',
      html: `<p>Ampacity is about heat and does not depend on length; voltage drop does. Resistance adds up foot by foot, so every doubling of the run doubles the drop. A 20 A, 120 V circuit on 12 AWG copper loses 3% at about 45 ft, and a 240 V circuit at the same current can go twice as far because 3% of 240 V is twice as many volts.</p>
<p>That is why long runs to detached garages, wells and outbuildings so often end up one or two sizes above what the breaker alone would call for. Going up one AWG size cuts resistance by about 21%, and every three sizes halves it.</p>`
    },
    {
      h2: 'Why does the NEC 75°C column matter?',
      html: `<p>Table 310.16 lists three ampacities for each size, for insulation rated 60°C, 75°C and 90°C. The insulation is only part of the story: the circuit is limited by its weakest link, which is usually the breaker or equipment terminal. Under NEC 110.14(C), terminals on circuits of 100 A or less are assumed to be 60°C unless they are marked 75°C; most modern breakers and panels are marked 60/75°C, which is why this calculator defaults to the 75°C column.</p>
<p>NM-B cable (Romex) is the big exception: NEC 334.80 limits its ampacity to the 60°C column even though its conductors are 90°C rated. The 90°C column is used only as a starting point for derating, never for the final size at a 75°C terminal.</p>`
    },
    {
      h2: 'Copper or aluminum: what size aluminum wire equals copper?',
      html: `<p>Aluminum conducts about 61% as well as copper, so it usually needs to be two AWG sizes larger for the same ampacity. Common pairs at 75°C: 6 AWG copper (65 A) and 4 AWG aluminum (65 A); 3 AWG copper (100 A) and 1 AWG aluminum (100 A); 3/0 copper (200 A) and 250 kcmil aluminum (205 A).</p>
<p>Modern aluminum building wire (AA-8000 series alloy) is standard for feeders and services, where it saves a lot of money on large sizes. Use connectors and breakers marked AL/CU, torque lugs to the specification, and avoid small aluminum branch circuits, where older alloys caused the reputation problems of the 1960s and 70s.</p>`
    },
    {
      h2: 'Is 3% voltage drop a code requirement?',
      html: `<p>No. In the NEC it appears in informational notes (under 210.19 for branch circuits and 215.2 for feeders) that recommend no more than 3% on a branch circuit and 5% total from service to outlet. Informational notes are advice, not enforceable rules, unless your jurisdiction adopts them. Some equipment does make it mandatory in practice: fire pumps, sensitive electronics and motor loads that will not start on low voltage. Solar and EV installers often aim for 2% or less.</p>`
    }
  ],
  faq: [
    { q: 'What size wire for a 50 amp circuit?', a: '6 AWG copper (65 A at 75°C) or 4 AWG aluminum in conduit. In NM-B cable, 6 AWG copper (55 A at 60°C) is also the minimum. Check voltage drop if the run is long.' },
    { q: 'What size wire for a 30 amp circuit?', a: '10 AWG copper. Its 75°C ampacity is 35 A, but the small-conductor rule in NEC 240.4(D) caps 10 AWG copper at a 30 A breaker anyway.' },
    { q: 'What size wire for 100 amps?', a: '3 AWG copper or 1 AWG aluminum for a general feeder at 75°C. A 100 A dwelling service under Table 310.12 can use 4 AWG copper or 2 AWG aluminum.' },
    { q: 'What gauge wire for 20 amps at 100 feet?', a: 'On 120 V, 8 AWG copper keeps the drop under 3% (about 2.6%); 12 AWG would lose 6.6% and 10 AWG about 4.1%. On 240 V, 10 AWG copper does it at about 2.1%.' },
    { q: 'Is the distance one way or round trip?', a: 'Enter the one-way distance from the panel to the load. The single-phase formula already doubles it for the return conductor.' },
    { q: 'Do I size wire for the breaker or the load?', a: 'Both. The wire must carry the load (×1.25 if continuous) and the breaker must protect the wire, so the breaker can never be larger than the wire\'s allowable ampacity except in special cases such as motor circuits.' },
    { q: 'Does this calculator replace an electrician?', a: 'No. It is a sizing guide based on NEC Table 310.16. Ambient temperature, conduit fill, local amendments and the inspector\'s interpretation can all change the answer.' }
  ],
  related: ['amps-calculator', 'ohms-law-calculator', 'kw-calculator', 'generator-size-calculator', 'ev-charging-cost-calculator'],
  sources: [
    { name: 'NFPA 70, National Electrical Code (2023): Table 310.16, Chapter 9 Table 8, 110.14(C), 240.4(D)', url: 'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70' },
    { name: 'NFPA: NFPA 70 (NEC) free access and purchase', url: 'https://www.nfpa.org/product/nfpa-70-code/p0070code' },
    { name: 'American wire gauge: diameters and areas', url: 'https://en.wikipedia.org/wiki/American_wire_gauge' }
  ],
  disclaimer: 'A planning guide only. Local code, the authority having jurisdiction and a licensed electrician decide the final conductor size.'
};
