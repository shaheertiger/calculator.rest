export default {
  slug: 'stress-calculator',
  hub: 'science',
  name: 'Stress & Yield Strength Calculator',
  title: 'Yield Stress Calculator: 21,700 N on a 10 mm Rod Is 276 MPa',
  h1: 'Stress and Yield Strength Calculator: σ = F ÷ A, Strain and Modulus',
  meta: 'A 10 mm rod that yields at 21,700 N has a yield strength of 276 MPa (40.1 ksi), the value for 6061-T6 aluminum. Get stress, strain, modulus and safety factor.',
  keyword: 'how to calculate yield stress',
  also: ['how to calculate the yield stress', 'how to calculate the yield strength', 'how to calculate yield strain', 'how to calculate yield load', 'how to calculate ultimate tensile strength', 'how do you calculate tensile strength', 'stress calculator', 'how to calculate yield strength from stress strain curve'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sys', label: 'Units', type: 'select', value: 'metric', options: [['metric', 'Newtons and millimeters (MPa)'], ['us', 'Pounds-force and inches (psi)']] },
    { id: 'kind', label: 'The force is the…', type: 'select', value: 'yield', options: [['yield', 'Load at yield (gives yield strength)'], ['max', 'Maximum load (gives ultimate tensile strength)'], ['load', 'Working load (gives stress and safety factor)']] },
    { id: 'F', label: 'Force', type: 'number', value: 21700, help: 'N in metric, lbf in U.S. units.' },
    { id: 'shape', label: 'Cross-section', type: 'select', value: 'round', options: [['round', 'Round bar (diameter)'], ['rect', 'Rectangular bar (width × thickness)'], ['area', 'I know the area']] },
    { id: 'dia', label: 'Diameter', type: 'number', value: 10, help: 'mm in metric, inches in U.S. units.', showIf: { shape: ['round'] } },
    { id: 'w', label: 'Width', type: 'number', value: 12.5, showIf: { shape: ['rect'] } },
    { id: 'th', label: 'Thickness', type: 'number', value: 6, showIf: { shape: ['rect'] } },
    { id: 'area', label: 'Original cross-sectional area', type: 'number', value: 78.54, help: 'mm² or in².', showIf: { shape: ['area'] } },
    { id: 'L0', label: 'Gauge length (optional)', type: 'number', value: '', placeholder: 'e.g. 50', help: 'With elongation, adds strain and modulus.' },
    { id: 'dL', label: 'Elongation at this load (optional)', type: 'number', value: '', placeholder: 'e.g. 0.20' },
    { id: 'mat', label: 'Compare with', type: 'select', value: '6061', options: [['none', 'No comparison'], ['a36', 'ASTM A36 structural steel'], ['1018', 'AISI 1018 steel, cold drawn'], ['304', '304 stainless steel, annealed'], ['6061', '6061-T6 aluminum'], ['7075', '7075-T6 aluminum'], ['ti64', 'Ti-6Al-4V titanium, annealed']] }
  ],
  data: {
    mats: {
      a36: { name: 'ASTM A36 steel', sy: 250, su: 400, e: 200 },
      '1018': { name: '1018 cold-drawn steel', sy: 370, su: 440, e: 205 },
      '304': { name: '304 stainless (annealed)', sy: 215, su: 505, e: 193 },
      '6061': { name: '6061-T6 aluminum', sy: 276, su: 310, e: 68.9 },
      '7075': { name: '7075-T6 aluminum', sy: 503, su: 572, e: 71.7 },
      ti64: { name: 'Ti-6Al-4V (annealed)', sy: 880, su: 950, e: 113.8 }
    }
  },
  compute(v, H, D) {
    var us = v.sys === 'us';
    if (!(v.F > 0)) return { error: 'Enter the force (tension or compression) as a positive number.' };
    var A;
    if (v.shape === 'round') { if (!(v.dia > 0)) return { error: 'Enter the bar diameter.' }; A = Math.PI * v.dia * v.dia / 4; }
    else if (v.shape === 'rect') { if (!(v.w > 0) || !(v.th > 0)) return { error: 'Enter the width and thickness.' }; A = v.w * v.th; }
    else { if (!(v.area > 0)) return { error: 'Enter the cross-sectional area.' }; A = v.area; }
    var s = v.F / A;
    var mpa = us ? s / 145.0377377 : s;
    var au = us ? ' in²' : ' mm²';
    var fmtS = function (x) { return us ? H.num(x, 0) + ' psi' : H.num(x, 1) + ' MPa'; };
    var other = us ? H.num(mpa, 1) + ' MPa' : H.num(mpa * 145.0377377, 0) + ' psi (' + H.num(mpa * 0.1450377377, 2) + ' ksi)';
    var label = v.kind === 'yield' ? 'Yield strength (engineering stress at yield)' : v.kind === 'max' ? 'Ultimate tensile strength' : 'Normal stress';
    var rows = [
      ['Cross-sectional area', H.sig(A, 5) + au],
      [us ? 'In MPa' : 'In psi', other]
    ];
    if (us) rows.push(['In ksi', H.num(s / 1000, 2) + ' ksi']);
    var sub = 'Engineering stress uses the original area. ';
    var m = D.mats[v.mat];
    var hasStrain = typeof v.L0 === 'number' && v.L0 > 0 && typeof v.dL === 'number' && isFinite(v.dL) && v.dL !== 0;
    if (hasStrain) {
      var eps = v.dL / v.L0;
      rows.push(['Engineering strain ΔL ÷ L₀', H.num(eps, 5) + ' (' + H.pct(eps * 100, 3) + ')']);
      rows.push(['Stress ÷ strain', H.num(mpa / eps / 1000, 2) + ' GPa']);
      rows.push(['True stress σ(1 + ε)', fmtS(s * (1 + eps))]);
      sub += 'Stress ÷ strain equals Young\'s modulus only if this load is still in the straight, elastic part of the curve. ';
    }
    if (m) {
      var ref = v.kind === 'max' ? m.su : m.sy;
      if (v.kind === 'load') {
        var fos = m.sy / mpa;
        rows.push(['Yield strength of ' + m.name, H.num(m.sy, 0) + ' MPa']);
        rows.push(['Factor of safety against yield', H.num(fos, 2), true]);
        rows.push(['Load that would cause yield', us ? H.num(m.sy * 145.0377377 * A, 0) + ' lbf' : H.num(m.sy * A / 1000, 2) + ' kN']);
        sub += fos < 1 ? 'Above the yield strength of ' + m.name + ': the part would bend or stretch permanently.' : 'Below the yield strength of ' + m.name + ', so the part springs back when unloaded.';
      } else {
        rows.push([(v.kind === 'max' ? 'Published UTS of ' : 'Published yield strength of ') + m.name, H.num(ref, 0) + ' MPa']);
        rows.push(['Your result vs published', (mpa >= ref ? '+' : '−') + H.pct(Math.abs(mpa - ref) / ref * 100, 1), true]);
        rows.push(['Yield strain of ' + m.name + ' (σy ÷ E)', H.pct(m.sy / (m.e * 1000) * 100, 3)]);
        sub += 'Published values are typical or minimum figures; test results commonly vary by several percent.';
      }
    }
    return { value: fmtS(s), label: label, expr: H.num(v.F, 2) + (us ? ' lbf' : ' N') + ' ÷ ' + H.sig(A, 5) + au, rows: rows, sub: sub.trim() };
  },
  quick: ({ r }) => `To calculate yield stress, divide the load at which the material starts to yield by the original cross-sectional area: σ<sub>y</sub> = F<sub>y</sub> ÷ A₀. A 10 mm diameter rod has A = π × 5² = 78.54 mm²; if it yields at 21,700 N, σ<sub>y</sub> = 21,700 ÷ 78.54 = <strong>${r.value}</strong> (40.1 ksi), matching 6061-T6 aluminum's published 276 MPa. Since 1 N/mm² = 1 MPa, no conversion is needed.`,
  stepsTitle: 'How to calculate yield strength from a tensile test',
  steps: [
    'Measure the original cross-section before loading: diameter for a round specimen, width and thickness for a flat one. Always use this original area, not the narrowed area after the test.',
    'Find the yield load. Some steels show a clear drop in load (the yield point). Most metals do not, so use the 0.2% offset method on the load–extension or stress–strain curve.',
    'Divide force by area. Newtons over mm² gives MPa directly; pounds over in² gives psi.',
    'For ultimate tensile strength, divide the maximum load reached during the test by the same original area.',
    'Compare with published values for the material and temper. A result far off usually means the wrong area (radius vs diameter is the classic slip) or a load read from the wrong part of the curve.'
  ],
  formulaTitle: 'What are the stress, strain and modulus formulas?',
  formula: {
    expr: 'σ = F ÷ A₀ &nbsp;&nbsp; A₀ = πd² ÷ 4<br>ε = ΔL ÷ L₀<br>E = σ ÷ ε (elastic region)<br>σ<sub>y</sub> = F<sub>y</sub> ÷ A₀ &nbsp;&nbsp; UTS = F<sub>max</sub> ÷ A₀',
    vars: [['σ', 'engineering stress (MPa = N/mm², or psi)'], ['F', 'axial force'], ['A₀', 'original cross-sectional area'], ['ε', 'strain, dimensionless (often given in %)'], ['E', 'Young\'s modulus: about 200 GPa for steel, 69 GPa for aluminum'], ['F<sub>y</sub>, F<sub>max</sub>', 'load at yield and maximum load']],
    note: '1 MPa = 145.04 psi; 1 ksi = 6.895 MPa; 1 GPa = 1,000 MPa.'
  },
  example: `<p><strong>Steel tie rod.</strong> A 12 mm diameter A36 steel rod carries 15,000 N in tension. What is the stress, and how close is it to yielding?</p>
<p>A = π × 12² ÷ 4 = 113.1 mm². σ = 15,000 ÷ 113.1 = <strong>132.6 MPa</strong> (19.2 ksi).</p>
<p>A36 has a minimum yield strength of 250 MPa, so the factor of safety is 250 ÷ 132.6 = <strong>1.88</strong>. The rod would start to yield at 250 × 113.1 = 28,270 N.</p>
<p>Strain at that stress (elastic): ε = σ ÷ E = 132.6 ÷ 200,000 = 0.00066, so a 2 m rod stretches about 1.3 mm.</p>`,
  table: {
    title: 'What is the yield strength of common metals?',
    intro: 'Typical or minimum room-temperature values, with the load at which a 10 mm diameter rod (78.54 mm²) of each would begin to yield.',
    head: ['Material', 'Yield strength', 'Ultimate tensile', 'E (GPa)', 'Yield strain', '10 mm rod yields at'],
    rows: ({ D, H, run }) => ['a36', '1018', '304', '6061', '7075', 'ti64'].map(k => { const m = D.mats[k]; const r = run({ sys: 'metric', kind: 'load', F: 1000, shape: 'round', dia: 10, L0: NaN, dL: NaN, mat: k }); return [m.name, m.sy + ' MPa (' + H.num(m.sy * 0.1450377, 1) + ' ksi)', m.su + ' MPa (' + H.num(m.su * 0.1450377, 1) + ' ksi)', String(m.e), H.pct(m.sy / (m.e * 1000) * 100, 3), r.rows.find(x => x[0] === 'Load that would cause yield')[1]]; }),
    note: 'Values follow MatWeb and ASTM data: A36 yield and UTS are specification minimums (UTS range 400–550 MPa); the others are typical. Strength changes a lot with heat treatment and temper, so always check the certificate for the actual material.'
  },
  sections: [
    {
      h2: 'How do you calculate yield strength from a stress-strain curve?',
      html: `<p>Use the <strong>0.2% offset method</strong>, the standard approach in tensile testing (ASTM E8). Draw a straight line parallel to the elastic part of the curve, starting at a strain of 0.002 (0.2%) on the strain axis. The stress where that line crosses the curve is the 0.2% offset yield strength.</p>
<p>For 6061-T6 (E ≈ 68.9 GPa) the offset line is σ = 68,900 × (ε − 0.002) MPa. It meets the curve near 276 MPa, at a total strain of 276 ÷ 68,900 + 0.002 ≈ 0.0060, or 0.60%. Materials with a sharp yield point, such as mild steel, can instead use the upper or lower yield point read straight off the curve.</p>`
    },
    {
      h2: 'How do you calculate yield strain?',
      html: `<p>Divide yield strength by Young's modulus: ε<sub>y</sub> = σ<sub>y</sub> ÷ E. That is the elastic strain at the moment yielding begins. For A36 steel, 250 ÷ 200,000 = 0.00125 (0.125%); for 6061-T6, 276 ÷ 68,900 = 0.0040 (0.40%). Aluminum stretches about three times further than steel before yielding because its modulus is about a third as large.</p>
<p>If yield strength was found with the 0.2% offset, the total strain at that point is ε<sub>y</sub> + 0.002.</p>`
    },
    {
      h2: 'How do you calculate yield load?',
      html: `<p>Rearrange the stress formula: F<sub>y</sub> = σ<sub>y</sub> × A. A 1 in diameter A36 rod has A = 0.7854 in², so it yields at 36,000 psi × 0.7854 = <strong>28,274 lbf</strong>. A 25 × 6 mm 6061-T6 flat bar (150 mm²) yields at 276 × 150 = 41,400 N.</p>
<p>Choose "Working load" above and pick a material: the calculator returns the yield load for your section and the factor of safety for the force you entered. Designers usually keep working stress well below yield, often with a safety factor of 1.5 to 3 or more depending on the code.</p>`
    },
    {
      h2: 'What is the difference between engineering stress and true stress?',
      html: `<p>Engineering stress divides by the original area A₀, which is what yield strength and UTS are quoted in. True stress divides by the actual, shrinking area during the test. Before necking, with constant volume, σ<sub>true</sub> = σ(1 + ε) and true strain = ln(1 + ε). At 10% engineering strain, a 300 MPa engineering stress is 330 MPa true stress.</p>
<p>After necking starts the specimen thins locally, so engineering stress falls while true stress keeps rising until fracture. That is why the engineering curve has a peak (the UTS) and the true curve does not.</p>`
    }
  ],
  faq: [
    { q: 'What is the difference between yield strength and tensile strength?', a: 'Yield strength is the stress where permanent deformation begins; ultimate tensile strength is the highest engineering stress the material reaches before necking. For 6061-T6 they are 276 MPa and 310 MPa; for A36 steel, 250 MPa and at least 400 MPa.' },
    { q: 'Is yield stress the same as yield strength?', a: 'In everyday use, yes. Strictly, yield strength is a material property (e.g. 250 MPa for A36), while yield stress is the stress state that causes yielding, which equals the yield strength in a simple tension test.' },
    { q: 'What units is stress measured in?', a: 'Pascals (N/m²), usually megapascals: 1 MPa = 1 N/mm². In U.S. units, psi or ksi (1,000 psi). 1 ksi = 6.895 MPa.' },
    { q: 'How do you calculate modulus of resilience?', a: 'Modulus of resilience = σy² ÷ (2E), the elastic energy stored per unit volume up to yield. For 6061-T6: 276² ÷ (2 × 68,900) = 0.553 MPa, which is 0.553 MJ/m³.' },
    { q: 'Do I use radius or diameter for the area?', a: 'Either, carefully: A = πr² = πd² ÷ 4. Using the diameter in πr² gives an area four times too large and a stress four times too small, the most common mistake on these problems.' },
    { q: 'Does compressive stress use the same formula?', a: 'Yes, σ = F ÷ A, with compression usually given a negative sign. Long slender columns can buckle well below the compressive yield strength, which needs a separate check.' },
    { q: 'How do you find Young\'s modulus from a stress-strain curve?', a: 'Take the slope of the straight, elastic part: E = Δσ ÷ Δε. If 100 MPa produces 0.0005 strain, E = 100 ÷ 0.0005 = 200,000 MPa = 200 GPa, typical of steel.' }
  ],
  related: ['force-calculator', 'torque-calculator', 'circle-calculator', 'uncertainty-calculator'],
  sources: [
    { name: 'MatWeb: Material Property Data (A36, 1018, 304, 6061-T6, 7075-T6, Ti-6Al-4V)', url: 'https://www.matweb.com/' },
    { name: 'OpenStax University Physics Volume 1: 12.3 Stress, Strain, and Elastic Modulus', url: 'https://openstax.org/books/university-physics-volume-1/pages/12-3-stress-strain-and-elastic-modulus' },
    { name: 'NIST Special Publication 811: pressure and stress unit conversions', url: 'https://www.nist.gov/pml/special-publication-811' }
  ]
};
