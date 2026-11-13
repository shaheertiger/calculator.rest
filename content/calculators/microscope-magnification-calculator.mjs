export default {
  slug: 'microscope-magnification-calculator',
  hub: 'science',
  name: 'Microscope Magnification Calculator',
  title: 'Microscope Magnification Calculator: 10× × 40× = 400× Total',
  h1: 'Total Magnification Calculator for Microscopes, Drawings and Scale Bars',
  meta: 'Total magnification = eyepiece × objective, so a 10× eyepiece with a 40× lens gives 400×. Also find magnification from image size, actual size or a scale bar.',
  keyword: 'how to calculate total magnification of microscope',
  also: ['how to calculate magnification', 'how can you calculate the magnification of a microscope', 'how to calculate the magnification of a microscope', 'how to calculate magnification on a microscope', 'how do you calculate the total magnification of the microscope', 'how is total magnification calculated', 'how to calculate magnification of microscope', 'how to calculate magnification of a microscope', 'how do you calculate total magnification of a microscope', 'how is a microscopes total magnification calculated', 'how do you calculate the total magnification', 'how do you calculate magnification on a light microscope', 'how do you calculate the magnification on a microscope', 'how is total magnification calculated on a microscope', 'how do you calculate the power of magnification', 'microscope magnification calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you want to find?', type: 'select', value: 'total', options: [['total', 'Total magnification (eyepiece × objective)'], ['image', 'Magnification from image size and actual size'], ['actual', 'Actual size from image size and magnification'], ['scale', 'Magnification from a scale bar']] },
    { id: 'eyepiece', label: 'Eyepiece (ocular) magnification', type: 'number', value: 10, suffix: '×', showIf: { mode: ['total'] } },
    { id: 'objective', label: 'Objective magnification', type: 'number', value: 40, suffix: '×', showIf: { mode: ['total'] }, help: 'Engraved on the objective barrel: 4, 10, 40, 100…' },
    { id: 'aux', label: 'Extra magnification factor', type: 'number', value: 1, suffix: '×', showIf: { mode: ['total'] }, help: 'Usually 1. Enter a zoom setting, intermediate tube lens or auxiliary lens factor if fitted.' },
    { id: 'na', label: 'Objective numerical aperture (optional)', type: 'number', value: 0.65, showIf: { mode: ['total'] }, help: 'Printed after the magnification, e.g. 40×/0.65. Used for resolution and useful range.' },
    { id: 'img', label: 'Size on the image or drawing', type: 'number', value: 50, showIf: { mode: ['image', 'actual', 'scale'] } },
    { id: 'imgUnit', label: 'Image size unit', type: 'select', value: 'mm', showIf: { mode: ['image', 'actual', 'scale'] }, options: [['cm', 'cm'], ['mm', 'mm'], ['um', 'µm'], ['nm', 'nm']] },
    { id: 'act', label: 'Actual size of the object', type: 'number', value: 20, showIf: { mode: ['image'] } },
    { id: 'actUnit', label: 'Actual size unit', type: 'select', value: 'um', showIf: { mode: ['image'] }, options: [['mm', 'mm'], ['um', 'µm'], ['nm', 'nm']] },
    { id: 'mag', label: 'Magnification', type: 'number', value: 2500, suffix: '×', showIf: { mode: ['actual'] } },
    { id: 'bar', label: 'Scale bar length you measured', type: 'number', value: 25, suffix: 'mm', showIf: { mode: ['scale'] } },
    { id: 'barLabel', label: 'Length written on the scale bar', type: 'number', value: 10, showIf: { mode: ['scale'] } },
    { id: 'barUnit', label: 'Scale bar label unit', type: 'select', value: 'um', showIf: { mode: ['scale'] }, options: [['mm', 'mm'], ['um', 'µm'], ['nm', 'nm']] }
  ],
  data: { um: { cm: 10000, mm: 1000, um: 1, nm: 0.001 } },
  compute(v, H, D) {
    function size(um) {
      if (!isFinite(um)) return '—';
      var a = Math.abs(um);
      if (a >= 1000) return H.num(Number((um / 1000).toPrecision(3)), 4) + ' mm';
      if (a >= 1) return H.num(Number(um.toPrecision(3)), 3) + ' µm';
      return H.num(Number((um * 1000).toPrecision(3)), 2) + ' nm';
    }
    function mx(m) { return H.num(Number(m.toPrecision(4)), 2) + '×'; }
    var U = D.um;
    if (v.mode === 'image') {
      if (!(v.img > 0) || !(v.act > 0)) return { error: 'Enter the image size and the actual size.' };
      var i1 = v.img * U[v.imgUnit], a1 = v.act * U[v.actUnit], m1 = i1 / a1;
      return {
        value: mx(m1), label: 'Magnification of the image',
        expr: 'M = ' + H.num(i1, 4) + ' µm ÷ ' + H.num(a1, 4) + ' µm',
        rows: [['Image size in µm', H.num(i1, 4) + ' µm'], ['Actual size in µm', H.num(a1, 4) + ' µm'], ['Check: actual × magnification', size(a1 * m1)]],
        sub: m1 < 1 ? 'Less than 1×: the image is smaller than the real object.' : 'Magnification = image size ÷ actual size, with both in the same unit.'
      };
    }
    if (v.mode === 'actual') {
      if (!(v.img > 0) || !(v.mag > 0)) return { error: 'Enter the image size and the magnification.' };
      var i2 = v.img * U[v.imgUnit], a2 = i2 / v.mag;
      return {
        value: size(a2), label: 'Actual size of the object',
        expr: 'A = ' + H.num(i2, 4) + ' µm ÷ ' + H.num(v.mag, 2),
        rows: [['Image size in µm', H.num(i2, 4) + ' µm'], ['Actual size in µm', H.num(Number(a2.toPrecision(4)), 4) + ' µm', true], ['Actual size in mm', H.num(Number((a2 / 1000).toPrecision(4)), 8) + ' mm']],
        sub: 'Actual size = image size ÷ magnification. Convert mm to µm (× 1,000) first.'
      };
    }
    if (v.mode === 'scale') {
      if (!(v.bar > 0) || !(v.barLabel > 0)) return { error: 'Enter the measured scale bar length and the length written on it.' };
      var b = v.bar * 1000, lab = v.barLabel * U[v.barUnit], m3 = b / lab;
      var rows = [['Scale bar measured', H.num(b, 4) + ' µm'], ['Scale bar represents', H.num(lab, 4) + ' µm']];
      if (v.img > 0) rows.push(['Actual size of your object', size(v.img * U[v.imgUnit] / m3), true]);
      return {
        value: mx(m3), label: 'Magnification from the scale bar',
        expr: H.num(b, 4) + ' µm ÷ ' + H.num(lab, 4) + ' µm',
        rows: rows,
        sub: 'A scale bar stays correct when an image is enlarged or shrunk, which a printed "×" figure does not.'
      };
    }
    if (!(v.eyepiece > 0) || !(v.objective > 0)) return { error: 'Enter the eyepiece and objective magnifications.' };
    var aux = v.aux > 0 ? v.aux : 1, M = v.eyepiece * v.objective * aux;
    var out = {
      value: mx(M), label: 'Total magnification',
      expr: H.num(v.eyepiece, 2) + '× eyepiece × ' + H.num(v.objective, 2) + '× objective' + (aux !== 1 ? ' × ' + H.num(aux, 3) : ''),
      rows: [['A 10 µm cell looks like', size(10 * M) + ' across']],
      sub: 'Total magnification is the product of every lens in the light path; the condenser does not count.'
    };
    if (v.na > 0 && v.na <= 1.6) {
      var lo = 500 * v.na, hi = 1000 * v.na, res = 0.61 * 0.55 / v.na;
      out.rows.unshift(['Useful magnification range (500–1,000 × NA)', H.num(lo, 0) + '× to ' + H.num(hi, 0) + '×', true]);
      out.rows.push(['Smallest resolvable detail (green light, 550 nm)', H.num(Number(res.toPrecision(2)), 3) + ' µm']);
      out.res = H.num(Number(res.toPrecision(3)), 3) + ' µm';
      out.umax = H.num(hi, 0) + '×';
      out.sub = M > hi ? 'Above 1,000 × NA: this is empty magnification. The image gets bigger but shows no more detail.' : M < lo ? 'Below 500 × NA: your eye may not see all the detail the objective resolves. A stronger eyepiece would help.' : 'Within the useful range for this objective, so the magnification matches the detail the lens can resolve.';
      if (v.na > 0.95) out.rows.push(['Immersion', 'NA above 0.95 needs immersion oil (n = 1.515)']);
    }
    return out;
  },
  quick: ({ r }) => `To calculate total magnification of a microscope, multiply the eyepiece (ocular) magnification by the objective magnification. A 10× eyepiece with the 40× objective gives 10 × 40 = <strong>${r.value}</strong>. The 4×, 10× and 100× oil objectives give 40×, 100× and 1,000×. For a drawing or photograph, magnification = image size ÷ actual size, in the same units.`,
  stepsTitle: 'How to calculate total magnification of a microscope',
  steps: [
    'Read the eyepiece magnification printed on the ocular. Most student and lab microscopes use 10× (sometimes marked WF 10×/18 or 10×/20, where the second number is the field number).',
    'Read the objective magnification engraved on the barrel of the lens in use. Most makers also follow a color ring code: red 4×, yellow 10×, green 20×, light blue 40×, dark blue 60×, white 100×.',
    'Multiply them: total magnification = eyepiece × objective. Don\'t add them (10 + 40 = 50 is the classic mistake), and don\'t include the condenser, which only focuses light on the specimen.',
    'If the microscope has a zoom body, a magnification changer or an intermediate tube lens (often 1.25× or 1.5×), multiply by that factor as well.',
    'Record the result with the × sign, for example "400×", and note the objective used so others can repeat your observation.'
  ],
  formulaTitle: 'What is the formula for total magnification?',
  formula: {
    expr: 'Total magnification = M<sub>eyepiece</sub> × M<sub>objective</sub> (× any extra factor)<br>Magnification of an image: M = image size ÷ actual size<br>Actual size = image size ÷ M &nbsp;·&nbsp; Image size = actual size × M',
    vars: [['M<sub>eyepiece</sub>', 'ocular magnification, usually 10×'], ['M<sub>objective</sub>', 'objective magnification, e.g. 4×, 10×, 40×, 100×'], ['image size', 'length measured on the drawing, photo or screen'], ['actual size', 'real length of the specimen, usually in µm']],
    note: 'Remember the "I AM" triangle: Image = Actual × Magnification. Unit conversions: 1 mm = 1,000 µm and 1 µm = 1,000 nm.'
  },
  example: `<p>A biology student views onion epidermis with a 10× eyepiece and switches from the 10× to the 40× objective.</p>
<p>Total magnification goes from 10 × 10 = 100× to 10 × 40 = <strong>400×</strong>.</p>
<p>She then draws one cell 48 mm long. Using the microscope's field of view she estimates the real cell is 240 µm long. Magnification of the drawing = 48,000 µm ÷ 240 µm = <strong>200×</strong>, which is what she writes under the drawing (not 400×, because the drawing scale is different from the eyepiece view).</p>`,
  table: {
    title: 'What is the total magnification of each objective lens?',
    intro: 'Standard objectives with typical achromat numerical apertures. Totals, resolution and maximum useful magnification were computed by the calculator above.',
    head: ['Objective', 'Common name', 'With 10× eyepiece', 'With 15× eyepiece', 'Typical NA', 'Resolves (550 nm)', 'Max useful (1,000 × NA)'],
    rows: ({ run }) => [[4, 'Scanning', 0.10], [10, 'Low power', 0.25], [20, 'Medium power', 0.40], [40, 'High power (high dry)', 0.65], [60, 'High dry', 0.80], [100, 'Oil immersion', 1.25]].map(([o, name, na]) => {
      const a = run({ mode: 'total', eyepiece: 10, objective: o, aux: 1, na });
      const b = run({ mode: 'total', eyepiece: 15, objective: o, aux: 1, na });
      return [o + '×', name, a.value, b.value, na.toFixed(2), a.res, a.umax];
    }),
    note: 'NA values are typical for achromat objectives; plan apochromats reach higher NAs (for example 0.95 at 40× and 1.40 at 100×). Resolution uses the Rayleigh criterion d = 0.61λ ÷ NA.'
  },
  sections: [
    {
      h2: 'How do you calculate magnification from image size and actual size?',
      html: `<p>Divide the size of the image by the real size of the object, after putting both in the same unit: M = I ÷ A. Because specimens are measured in micrometers and drawings in millimeters, multiply the image size in mm by 1,000 first.</p>
<p>A cheek cell drawn 45 mm wide that is really 60 µm across has a magnification of 45,000 µm ÷ 60 µm = <strong>750×</strong>. The default "image size" setting above shows a 50 mm image of a 20 µm object, which is 2,500×.</p>
<p>To find the real size instead, rearrange to A = I ÷ M. A mitochondrion 15 mm long in a ×12,000 electron micrograph is 15,000 µm ÷ 12,000 = <strong>1.25 µm</strong> long. Choose "Actual size" in the calculator for this version.</p>`
    },
    {
      h2: 'How do you calculate magnification using a scale bar?',
      html: `<p>Measure the scale bar on the page with a ruler, convert that length to the same unit as its label, then divide: M = measured length ÷ label. If a bar labeled 10 µm measures 25 mm, M = 25,000 µm ÷ 10 µm = <strong>2,500×</strong>.</p>
<p>Now any structure on the same image can be sized: an organelle measuring 50 mm is 50,000 ÷ 2,500 = 20 µm. Scale bars are preferred in published micrographs because they stay correct when the image is resized for a slide, a screen or a printout, while a "×2,500" caption becomes wrong as soon as the picture is enlarged.</p>`
    },
    {
      h2: 'What is the highest useful magnification of a light microscope?',
      html: `<p>About 1,000 times the numerical aperture (NA) of the objective. Detail is limited by resolution, not magnification: with green light the best oil-immersion objectives (NA 1.4) resolve about 0.2 µm. Nikon's microscopy primer gives the useful range as 500 to 1,000 × NA; magnifying beyond that is called <strong>empty magnification</strong>, because the image grows without showing anything new.</p>
<p>So a 100×/1.25 objective with a 10× eyepiece (1,000×) is well matched, while a 20× eyepiece (2,000×) would be empty. That is why classroom microscopes stop at 1,000× and research instruments rarely exceed about 1,500×. To see smaller things you need shorter wavelengths, as in electron microscopes.</p>`
    },
    {
      h2: 'Why does the 100× objective need immersion oil?',
      html: `<p>Numerical aperture is NA = n × sin θ, where n is the refractive index between the lens and the slide and θ is half the angle of the light cone the lens accepts. In air (n = 1.00) NA can't exceed 1, and in practice dry objectives top out near 0.95. Immersion oil has n = 1.515, matching glass, so it captures steeply angled rays that would otherwise bend away and lets NA reach 1.25 to 1.4.</p>
<p>Higher NA means finer resolution, d = 0.61λ ÷ NA. At 550 nm a 40×/0.65 objective resolves 0.52 µm, and a 100×/1.25 oil objective resolves 0.27 µm. Without oil the 100× image looks dim and blurry even though the magnification number hasn't changed.</p>`
    },
    {
      h2: 'How do you calculate magnification on a stereo or digital microscope?',
      html: `<p>On a stereo (dissecting) microscope, multiply the eyepiece by the zoom setting and by any auxiliary objective: 10× eyepieces at a zoom of 4.5 with a 0.5× auxiliary lens give 10 × 4.5 × 0.5 = <strong>22.5×</strong>. Enter the zoom × auxiliary product as the "extra factor" above.</p>
<p>On a camera or digital microscope there is no eyepiece, so the on-screen magnification is objective × camera adapter × (width of the image on the monitor ÷ width of the camera sensor). With a 40× objective, a 0.5× C-mount adapter and a 7.2 mm wide sensor shown 300 mm wide on screen, M = 40 × 0.5 × (300 ÷ 7.2) ≈ 833×. Because it depends on the screen, scientists label digital images with a scale bar instead.</p>`
    }
  ],
  faq: [
    { q: 'What is the total magnification with a 10× eyepiece and a 40× objective?', a: '400×. Multiply the eyepiece by the objective: 10 × 40 = 400. With the same eyepiece, the 4× objective gives 40×, the 10× gives 100× and the 100× oil objective gives 1,000×.' },
    { q: 'What is the total magnification on low power?', a: 'On most school microscopes low power is the 10× objective, giving 100× with a 10× eyepiece. The 4× scanning objective gives 40×.' },
    { q: 'Does the condenser lens add to the total magnification?', a: 'No. The condenser sits under the stage and concentrates light on the specimen; it doesn\'t form the magnified image, so it is left out of the calculation.' },
    { q: 'What does 400× mean?', a: 'The image is 400 times wider (in length) than the object. Area is magnified by the square, so a 400× image is 160,000 times larger in area.' },
    { q: 'What is the difference between magnification and resolution?', a: 'Magnification is how much bigger the image is; resolution is the smallest distance between two points that can still be seen as separate. A light microscope can magnify a lot, but it can\'t resolve detail finer than about 0.2 µm.' },
    { q: 'How do I convert units in magnification problems?', a: 'Use 1 cm = 10 mm, 1 mm = 1,000 µm and 1 µm = 1,000 nm. Put the image size and actual size in the same unit before dividing; most errors come from dividing millimeters by micrometers.' },
    { q: 'Why does the field of view get smaller at higher magnification?', a: 'The eyepiece shows a fixed-size circle of the image, so a more powerful objective fits less of the specimen into it. Going from 10× to 40× cuts the field diameter to a quarter. The field of view calculator works out the exact size.' },
    { q: 'How much can an electron microscope magnify?', a: 'Electron microscopes can magnify hundreds of thousands of times or more and resolve details below 1 nanometer, because electrons have a far shorter wavelength than visible light.' }
  ],
  related: ['field-of-view-calculator', 'telescope-magnification-calculator', 'ratio-calculator', 'scientific-notation-calculator'],
  sources: [
    { name: 'Nikon MicroscopyU: Useful Magnification Range', url: 'https://www.microscopyu.com/microscopy-basics/useful-magnification-range' },
    { name: 'Nikon MicroscopyU: Numerical Aperture', url: 'https://www.microscopyu.com/microscopy-basics/numerical-aperture' },
    { name: 'OpenStax Microbiology: 2.3 Instruments of Microscopy', url: 'https://openstax.org/books/microbiology/pages/2-3-instruments-of-microscopy' },
    { name: 'OpenStax Biology 2e: 4.1 Studying Cells', url: 'https://openstax.org/books/biology-2e/pages/4-1-studying-cells' },
    { name: 'OpenStax University Physics Volume 3: 2.8 Microscopes and Telescopes', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-8-microscopes-and-telescopes' }
  ]
};
