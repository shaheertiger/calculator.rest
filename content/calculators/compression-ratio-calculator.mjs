export default {
  slug: 'compression-ratio-calculator',
  hub: 'electrical',
  name: 'Compression Ratio Calculator',
  title: 'Compression Ratio Calculator: 350 With 64 cc Heads = 9.63:1',
  h1: 'Engine Compression Ratio Calculator: Static and Dynamic',
  meta: 'A 4.000 × 3.48 in. 350 with 64 cc heads, a 0.041 in. gasket and 0.025 in. deck runs 9.63:1. Enter bore, stroke, chamber, gasket, deck and piston cc.',
  keyword: 'how to calculate compression ratio',
  also: ['how calculate compression ratio', 'how do you calculate compression ratio', 'how to calculate engine compression ratio', 'how to calculate compression ratio on engine', 'how to calculate compression ratio from psi', 'dynamic compression ratio calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'unit', label: 'Length units', type: 'select', value: 'in', options: [['in', 'inches'], ['mm', 'millimeters']], wide: true },
    { id: 'bore', label: 'Bore', type: 'number', value: 4.0 },
    { id: 'stroke', label: 'Stroke', type: 'number', value: 3.48 },
    { id: 'chamber', label: 'Combustion chamber volume', type: 'number', value: 64, suffix: 'cc' },
    { id: 'piston', label: 'Piston dish / valve reliefs', type: 'number', value: 5, suffix: 'cc', help: 'Positive for a dish or valve reliefs, negative for a dome.' },
    { id: 'gbore', label: 'Head gasket bore', type: 'number', value: 4.1 },
    { id: 'gthick', label: 'Gasket compressed thickness', type: 'number', value: 0.041 },
    { id: 'deck', label: 'Deck clearance', type: 'number', value: 0.025, help: 'Piston below the deck at TDC is positive; above the deck is negative.' },
    { id: 'rod', label: 'Rod length (for dynamic CR)', type: 'number', value: 5.7, placeholder: 'optional' },
    { id: 'ivc', label: 'Intake valve closing', type: 'number', value: 60, suffix: '° ABDC', placeholder: 'optional', help: 'From the cam card. Many builders use the 0.050 in. figure plus 15°.' }
  ],
  compute(v, H) {
    var CI = 16.387064;
    var u = v.unit === 'mm' ? 1 / 25.4 : 1;
    var b = v.bore * u, s = v.stroke * u, gb = v.gbore * u, gt = v.gthick * u, dk = (H.isNum(v.deck) ? v.deck : 0) * u;
    if (!(b > 0) || !(s > 0)) return { error: 'Enter the bore and stroke.' };
    if (!(v.chamber > 0)) return { error: 'Enter the combustion chamber volume in cc.' };
    if (!(gb > 0)) gb = b;
    if (!(gt >= 0)) gt = 0;
    var area = Math.PI / 4 * b * b;
    var swept = area * s * CI;
    var gasket = Math.PI / 4 * gb * gb * gt * CI;
    var deck = area * dk * CI;
    var pist = H.isNum(v.piston) ? v.piston : 0;
    var vc = v.chamber + gasket + deck + pist;
    if (!(vc > 0)) return { error: 'Clearance volume is zero or negative. Check the dome size (negative cc) and deck clearance.' };
    var cr = (swept + vc) / vc;
    var rows = [
      ['Swept volume per cylinder', H.num(swept, 1) + ' cc (' + H.num(swept / CI, 2) + ' cu in)'],
      ['Gasket volume', H.num(gasket, 2) + ' cc'],
      ['Deck volume', H.num(deck, 2) + ' cc'],
      ['Total clearance volume', H.num(vc, 2) + ' cc', true]
    ];
    var out = { value: H.fix(cr, 2) + ':1', label: 'Static compression ratio', expr: '(' + H.num(swept, 1) + ' + ' + H.num(vc, 1) + ') ÷ ' + H.num(vc, 1) + ' cc', rows: rows, _cr: cr };
    var L = v.rod * u;
    if (L > s / 2 && v.ivc >= 0 && v.ivc < 120) {
      var r = s / 2, th = (180 + v.ivc) * Math.PI / 180;
      var x = r + L - (r * Math.cos(th) + Math.sqrt(L * L - r * r * Math.sin(th) * Math.sin(th)));
      var dyn = (area * x * CI + vc) / vc;
      rows.push(['Effective stroke at IVC', H.fix(x / u, 3) + (v.unit === 'mm' ? ' mm' : ' in')]);
      rows.push(['Dynamic compression ratio', H.fix(dyn, 2) + ':1', true]);
      out.sub = 'Dynamic CR ' + H.fix(dyn, 2) + ':1. ' + (dyn < 7.5 ? 'On the soft side: expect low cranking pressure and weak low-end torque.' : dyn <= 8.5 ? 'In the 7.5–8.5 range commonly considered safe on premium pump gas with iron heads.' : 'Above 8.5: usually needs aluminum heads, race fuel or E85, and careful tuning to avoid detonation.');
    } else {
      out.sub = 'Add rod length and intake closing angle to see the dynamic compression ratio.';
    }
    return out;
  },
  quick: ({ r }) => `Compression ratio = (swept volume + clearance volume) ÷ clearance volume. A small-block Chevy 350 with a 4.000 in. bore and 3.48 in. stroke sweeps 716.6 cc per cylinder; 64 cc heads, a 0.041 in. gasket, 0.025 in. deck clearance and 5 cc valve reliefs add up to 83.0 cc, giving <strong>${r.value}</strong>.`,
  stepsTitle: 'How to calculate compression ratio in 5 steps',
  steps: [
    'Work out swept volume per cylinder: π ÷ 4 × bore² × stroke, then multiply cubic inches by 16.387 for cc.',
    'Find the clearance volume pieces: combustion chamber cc (from the head maker or measured with a burette), piston dish or dome cc, and the gasket volume (π ÷ 4 × gasket bore² × compressed thickness).',
    'Add the deck volume: π ÷ 4 × bore² × the distance the piston sits below the deck at top dead center. A piston above the deck subtracts volume.',
    'Add the clearance pieces together. A dome counts as negative cc; forgetting the sign is the most common error.',
    'Divide (swept + clearance) by clearance. For dynamic compression, repeat with the stroke remaining after the intake valve closes.'
  ],
  formulaTitle: 'What is the compression ratio formula?',
  formula: {
    expr: 'CR = (V<sub>swept</sub> + V<sub>c</sub>) ÷ V<sub>c</sub><br>V<sub>swept</sub> = π/4 × B² × S<br>V<sub>c</sub> = V<sub>chamber</sub> + V<sub>gasket</sub> + V<sub>deck</sub> + V<sub>piston</sub>',
    vars: [['B, S', 'bore and stroke (in, × 16.387 for cc)'], ['V<sub>gasket</sub>', 'π/4 × gasket bore² × compressed thickness'], ['V<sub>deck</sub>', 'π/4 × B² × deck clearance'], ['V<sub>piston</sub>', 'dish or valve-relief volume (+) or dome volume (−)']],
    note: 'Dynamic compression uses the piston\'s distance from top dead center at intake valve closing, found from the slider-crank equation x = r + L − (r cos θ + √(L² − r² sin² θ)), with r = half the stroke, L = rod length and θ = 180° + closing angle ABDC.'
  },
  example: `<p>A builder planning a 383 stroker (4.030 in. bore, 3.75 in. stroke) with 72 cc aluminum heads, a 4.100 in. × 0.040 in. gasket, pistons 0.010 in. down the hole and 8 cc of valve reliefs.</p>
<p>Swept: 0.7854 × 4.030² × 3.75 = 47.83 cu in = <strong>783.8 cc</strong>. Gasket: 0.7854 × 4.100² × 0.040 × 16.387 = 8.65 cc. Deck: 0.7854 × 4.030² × 0.010 × 16.387 = 2.09 cc.</p>
<p>Clearance = 72 + 8.65 + 2.09 + 8 = <strong>90.74 cc</strong>. CR = (783.8 + 90.74) ÷ 90.74 = <strong>9.64:1</strong>. With 64 cc heads instead, clearance falls to 82.74 cc and CR rises to 10.47:1.</p>`,
  table: {
    title: 'How do chamber size and piston volume change compression?',
    intro: 'Static compression ratio for a 4.000 × 3.48 in. small-block with a 0.041 in. gasket and 0.025 in. deck clearance, computed with the calculator.',
    head: ['Chamber', '−5 cc dome', 'Flat top (0 cc)', '+5 cc reliefs', '+12 cc dish', '+20 cc dish'],
    rows: ({ run, H }) => [58, 62, 64, 68, 72, 76].map(c => [c + ' cc', ...[-5, 0, 5, 12, 20].map(p => H.fix(run({ chamber: c, piston: p })._cr, 2) + ':1')]),
    note: 'Every 4 cc of chamber volume moves this engine roughly half a point of compression; the change is larger on smaller-bore engines.'
  },
  sections: [
    {
      h2: 'What is dynamic compression ratio and why does it matter?',
      html: `<p>Static compression assumes the cylinder seals at bottom dead center. In reality the intake valve stays open well past BDC, so compression only begins once it shuts. Dynamic compression ratio (DCR) uses the piston position at intake valve closing (IVC) instead of the full stroke. With a 5.7 in. rod and a 60° ABDC closing point, the 350 above has only 2.81 in. of effective stroke, so its 9.63:1 static ratio becomes about 7.98:1 dynamic.</p>
<p>That is why a big cam needs more static compression to run well, and why the same 10.5:1 pistons can be fine with a long-duration cam yet detonate with a mild one. Many street builders target 7.5–8.5:1 DCR on premium pump gas with iron heads and a little more with aluminum heads, which shed heat faster.</p>`
    },
    {
      h2: 'Can you calculate compression ratio from a compression test (psi)?',
      html: `<p>Only roughly. Cranking pressure depends on cam timing, cranking speed, altitude, ring seal and the gauge itself, so two engines with the same static ratio can read 30 psi apart. A rule of thumb treats cranking pressure as about 14.7 × DCR<sup>1.2</sup> − 14.7 psi, so 8.0:1 dynamic reads roughly 160–170 psi at sea level. Use the test to compare cylinders (within about 10% of each other is the usual pass mark) and calculate the ratio from measured volumes.</p>`
    },
    {
      h2: 'What compression ratio can I run on pump gas?',
      html: `<p>Modern gasoline engines with direct injection, knock sensors and fast-burn chambers run 10.5–13:1 on regular or premium. For older carbureted V8s on 91–93 octane, builders generally stay near 9.5–10:1 static with iron heads and 10–10.5:1 with aluminum heads, adjusting for cam timing as shown above. Turbocharged and supercharged engines usually drop to 8.5–9.5:1 because boost raises cylinder pressure. Diesels rely on compression for ignition and run about 15–22:1.</p>`
    },
    {
      h2: 'How do you measure chamber and deck volumes accurately?',
      html: `<p>Seal a clear plate over the chamber with grease and fill it from a burette with thin fluid; the reading is the chamber cc. Do the same with the piston a known distance (say 0.500 in.) down the bore, then subtract the volume of that straight cylinder to get dish or dome cc. Measure deck height with a dial indicator at TDC, and use the gasket maker's <em>compressed</em> thickness, not the free height. Published chamber volumes can be 1–2 cc off on used heads, especially after valve jobs.</p>`
    }
  ],
  faq: [
    { q: 'Does a thinner head gasket raise compression?', a: 'Yes. On the 350 above, going from a 0.041 in. to a 0.027 in. gasket removes about 3 cc of clearance and lifts compression from 9.63:1 to about 10.0:1.' },
    { q: 'Is a dome positive or negative in the formula?', a: 'A dome takes up space in the clearance volume, so enter it as negative cc. Dished pistons and valve reliefs add space and are positive.' },
    { q: 'What is the compression ratio of a stock 350 Chevy?', a: 'It varied by year. Late-1960s high-performance 350s were rated around 10.25–11:1, while most 1971–1990s car and truck 350s were around 8.5–9.5:1 after emissions changes. The 1992–97 LT1 went back to about 10.5:1.' },
    { q: 'What does deck clearance do to compression?', a: 'Each 0.010 in. the piston sits below the deck adds about 2 cc on a 4 in. bore, lowering compression. Zero-decking the block or using a piston that comes up flush raises it and tightens quench.' },
    { q: 'How do you calculate compression ratio of a 2-stroke?', a: 'Most 2-stroke makers quote trapped compression, measured from exhaust port closing rather than bottom dead center. Use the stroke remaining when the exhaust port closes in place of the full stroke.' },
    { q: 'Do I need the cylinder count?', a: 'No. Compression ratio is per cylinder. Use the engine displacement calculator for total cubic inches or cc.' }
  ],
  related: ['engine-displacement-calculator', 'torque-calculator', 'gear-ratio-calculator', 'cylinder-volume-calculator'],
  sources: [
    { name: 'Compression ratio: static, dynamic and the slider-crank relation', url: 'https://en.wikipedia.org/wiki/Compression_ratio' },
    { name: 'NIST Special Publication 811: unit conversions (1 in³ = 16.387064 cm³)', url: 'https://www.nist.gov/pml/special-publication-811' },
    { name: 'Engine displacement: swept volume formula', url: 'https://en.wikipedia.org/wiki/Engine_displacement' }
  ]
};
