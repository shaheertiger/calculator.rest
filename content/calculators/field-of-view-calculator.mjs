export default {
  slug: 'field-of-view-calculator',
  hub: 'science',
  name: 'Microscope Field of View Calculator',
  title: 'Field of View Calculator: FN 18 ÷ 40× = 0.45 mm (450 µm)',
  h1: 'Microscope Field of View Calculator: Field Diameter and Cell Size',
  meta: 'Field of view = field number ÷ objective, so an FN 18 eyepiece over a 40× lens shows a 0.45 mm (450 µm) circle. Scale FOV between powers and estimate cell size.',
  keyword: 'how to calculate field of view microscope',
  also: ['how to calculate the field of view on a microscope', 'how to calculate field of view on a microscope', 'how to calculate the field of view of a microscope', 'how to calculate fov microscope', 'how to calculate field of view', 'field of view calculator', 'how to estimate cell size microscope'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Method', type: 'select', value: 'fn', options: [['fn', 'Field number ÷ objective magnification'], ['scale', 'Scale a measured FOV to another magnification']] },
    { id: 'fn', label: 'Eyepiece field number (FN)', type: 'number', value: 18, suffix: 'mm', showIf: { mode: ['fn'] }, help: 'Printed on the eyepiece after the magnification, e.g. 10×/18.' },
    { id: 'obj', label: 'Objective magnification', type: 'number', value: 40, suffix: '×', showIf: { mode: ['fn'] } },
    { id: 'tube', label: 'Tube lens or zoom factor', type: 'number', value: 1, suffix: '×', showIf: { mode: ['fn'] }, help: 'Usually 1. Use 1.25 or 1.5 if your microscope has an intermediate magnifier.' },
    { id: 'fov1', label: 'Measured field diameter', type: 'number', value: 4.5, suffix: 'mm', showIf: { mode: ['scale'] }, help: 'Measured with a clear mm ruler, usually at the lowest power.' },
    { id: 'mag1', label: 'Total magnification when measured', type: 'number', value: 40, suffix: '×', showIf: { mode: ['scale'] } },
    { id: 'mag2', label: 'New total magnification', type: 'number', value: 400, suffix: '×', showIf: { mode: ['scale'] } },
    { id: 'count', label: 'Objects that span the field (optional)', type: 'number', value: 9, help: 'How many cells fit end to end across the diameter, for a size estimate.' }
  ],
  compute(v, H) {
    var mm, expr;
    if (v.mode === 'scale') {
      if (!(v.fov1 > 0)) return { error: 'Enter the field diameter you measured, in mm.' };
      if (!(v.mag1 > 0) || !(v.mag2 > 0)) return { error: 'Enter both magnifications.' };
      mm = v.fov1 * v.mag1 / v.mag2;
      expr = H.num(v.fov1, 4) + ' mm × ' + H.num(v.mag1, 2) + ' ÷ ' + H.num(v.mag2, 2);
    } else {
      if (!(v.fn > 0)) return { error: 'Enter the eyepiece field number in mm.' };
      if (!(v.obj > 0)) return { error: 'Enter the objective magnification.' };
      var tube = v.tube > 0 ? v.tube : 1;
      mm = v.fn / (v.obj * tube);
      expr = H.num(v.fn, 2) + ' mm ÷ ' + H.num(v.obj, 2) + '×' + (tube !== 1 ? ' ÷ ' + H.num(tube, 3) : '');
    }
    var um = mm * 1000, r = mm / 2;
    function len(u) { return u >= 1000 ? H.num(u / 1000, 3) + ' mm' : u >= 10 ? H.num(u, 1) + ' µm' : H.num(u, 2) + ' µm'; }
    var rows = [
      ['Diameter in mm', H.num(mm, 4) + ' mm'],
      ['Radius', len(r * 1000)],
      ['Field area', H.num(Math.PI * r * r, 4) + ' mm²']
    ];
    if (v.count > 0) rows.push(['Estimated size of one object', len(um / v.count), true]);
    return {
      value: H.num(um, 1) + ' µm',
      label: 'Field of view diameter',
      expr: expr,
      rows: rows,
      sub: 'Diameter of the circle you see. Doubling the magnification halves it, and the area drops to a quarter.'
    };
  },
  quick: ({ r }) => `To calculate a microscope's field of view, divide the eyepiece field number by the objective magnification. A 10× eyepiece marked FN 18 with the 40× objective shows 18 ÷ 40 = 0.45 mm, or <strong>${r.value}</strong> across. With the 4× and 10× objectives the same eyepiece shows 4.5 mm and 1.8 mm. If 9 cells span the field, each is about 50 µm long.`,
  stepsTitle: 'How to calculate field of view on a microscope',
  steps: [
    'Find the field number (FN) on the eyepiece: in "10×/18" or "WF 10×/20" it is the number after the slash, in millimeters.',
    'Divide FN by the magnification of the objective you are using. Use the objective, not the total magnification: 18 ÷ 40 = 0.45 mm, while 18 ÷ 400 would wrongly give 0.045 mm.',
    'If your microscope has an intermediate tube lens or zoom, divide by that factor too.',
    'Convert to micrometers by multiplying by 1,000 (0.45 mm = 450 µm), since cells are measured in µm.',
    'No field number? Measure the field at low power with a clear millimeter ruler, then scale it to higher powers with the inverse ratio of the magnifications.'
  ],
  formulaTitle: 'What is the formula for field of view?',
  formula: {
    expr: 'FOV (mm) = FN ÷ (M<sub>objective</sub> × M<sub>tube</sub>)<br>FOV<sub>high</sub> = FOV<sub>low</sub> × (M<sub>low</sub> ÷ M<sub>high</sub>)<br>Object size ≈ FOV ÷ number of objects across',
    vars: [['FN', 'field number of the eyepiece, the diameter of its field stop in mm'], ['M<sub>objective</sub>', 'objective magnification'], ['M<sub>tube</sub>', 'any intermediate magnification, usually 1'], ['M<sub>low</sub>, M<sub>high</sub>', 'total magnifications for the measured and new fields']],
    note: 'Field of view and magnification are inversely proportional: as one goes up by a factor, the other goes down by the same factor.'
  },
  example: `<p>A class has microscopes with no field number printed on the eyepieces. A student lays a clear plastic ruler on the stage under the 4× objective (40× total) and sees 4.5 mm divisions across the circle.</p>
<p>At 100× total (10× objective): 4.5 × 40 ÷ 100 = <strong>1.8 mm</strong>.</p>
<p>At 400× total (40× objective): 4.5 × 40 ÷ 400 = 0.45 mm = <strong>450 µm</strong>.</p>
<p>Under 400× about 9 human cheek cells fit across the field, so each cell is roughly 450 ÷ 9 = <strong>50 µm</strong> across. Choose "Scale a measured FOV" above to repeat this.</p>`,
  table: {
    title: 'What is the field of view for each objective and field number?',
    intro: 'Field diameters computed by the calculator for common eyepiece field numbers. Totals assume a 10× eyepiece.',
    head: ['Objective (total)', 'FN 18', 'FN 20', 'FN 22', 'FN 26.5'],
    rows: ({ run }) => [4, 10, 20, 40, 60, 100].map(o => [o + '× (' + (o * 10).toLocaleString('en-US') + '×)', ...[18, 20, 22, 26.5].map(fn => run({ mode: 'fn', fn, obj: o, tube: 1, count: NaN }).value)]),
    note: 'FN 18 is typical of student and older lab eyepieces; 20–22 is standard on teaching and clinical microscopes; 26.5 is a wide-field research design.'
  },
  sections: [
    {
      h2: 'How do you calculate field of view at higher power?',
      html: `<p>Multiply the known field diameter by the old magnification and divide by the new one. Because field of view shrinks in exact proportion as magnification grows, going from 40× to 400× (ten times the power) gives one-tenth the field: 4.5 mm becomes 0.45 mm.</p>
<p>You can use either total magnifications or objective magnifications in the ratio, as long as the eyepiece stays the same; 40 ÷ 400 and 4 ÷ 40 are the same fraction. Switching to a different eyepiece changes the field number, so recalculate from FN instead.</p>`
    },
    {
      h2: 'How do you measure field of view with a ruler?',
      html: `<p>Place a transparent ruler with millimeter marks on the stage, focus with the lowest-power objective and line one mark up with the left edge of the circle. Count the millimeter spaces to the right edge, estimating the last fraction. Most school microscopes show about 4 to 5 mm at 40×.</p>
<p>This only works at low power. At 400× the whole field is under half a millimeter wide, so there is at most one ruler mark in view. Measure low, then calculate the higher powers. A stage micrometer (a slide with a 1 mm scale divided into 100 parts of 10 µm) gives a more precise reading at any power.</p>`
    },
    {
      h2: 'How do you estimate cell size from the field of view?',
      html: `<p>Count how many cells would fit end to end across the diameter of the field, then divide the field diameter by that number. With a 450 µm field and about 9 cells across, each is about 50 µm. If one long cell spans a third of a 1.8 mm field, it is about 600 µm, or 0.6 mm, long.</p>
<p>For measurements good enough for a lab report, calibrate an ocular micrometer (a scale inside the eyepiece) against a stage micrometer. If 40 eyepiece divisions line up with 10 stage divisions (100 µm) at 400×, each eyepiece division is 2.5 µm, and a cell spanning 18 divisions is 45 µm long.</p>`
    },
    {
      h2: 'Where do you find the field number?',
      html: `<p>It is engraved on the eyepiece next to the magnification, as in 10×/18, 10×/22 or WF 10×/20, where WF stands for wide field. According to Nikon's MicroscopyU, 10× eyepieces typically have field numbers of 16 to 18 mm, while modern wide-field designs reach 26 mm and more.</p>
<p>If there is no number, measure the field with a ruler at low power and work backward: FN = FOV × objective magnification. A 4.5 mm field under a 4× objective means FN = 18. For the magnification itself, see the <a href="/microscope-magnification-calculator">microscope magnification calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the field of view at 400×?', a: 'It depends on the eyepiece. With a 10× eyepiece of field number 18 and a 40× objective, the field is 0.45 mm (450 µm) across; with FN 20 it is 0.50 mm and with FN 22 it is 0.55 mm.' },
    { q: 'What is the field of view at 40× (scanning power)?', a: 'With FN 18 and a 4× objective the field is 18 ÷ 4 = 4.5 mm (4,500 µm) across. With FN 20 it is 5.0 mm.' },
    { q: 'Why does the field of view get smaller as magnification increases?', a: 'The eyepiece always shows the same-size circle of the intermediate image. A stronger objective spreads a smaller piece of the specimen over that circle, so the field shrinks in proportion to the magnification.' },
    { q: 'Does the eyepiece magnification change the field of view?', a: 'Only through its field number. Higher-power eyepieces usually have smaller field numbers, so a 15× eyepiece normally shows a smaller field than a 10× one on the same objective.' },
    { q: 'Is field of view the diameter or the area?', a: 'Usually the diameter. The area is π × (diameter ÷ 2)²: a 0.45 mm field covers about 0.159 mm².' },
    { q: 'How do I calculate the field of view of a microscope camera?', a: 'Divide the camera sensor\'s width by the objective magnification times the camera adapter factor. A 13.2 mm wide sensor on a 1× adapter with a 20× objective sees a 0.66 mm wide rectangle.' },
    { q: 'How do I convert field of view from mm to µm?', a: 'Multiply by 1,000. 1.8 mm is 1,800 µm and 0.45 mm is 450 µm.' }
  ],
  related: ['microscope-magnification-calculator', 'telescope-magnification-calculator', 'circle-calculator', 'ratio-calculator'],
  sources: [
    { name: 'Nikon MicroscopyU: Field of View', url: 'https://www.microscopyu.com/microscopy-basics/field-of-view' },
    { name: 'Nikon MicroscopyU: Resolution', url: 'https://www.microscopyu.com/microscopy-basics/resolution' },
    { name: 'OpenStax Microbiology: 2.3 Instruments of Microscopy', url: 'https://openstax.org/books/microbiology/pages/2-3-instruments-of-microscopy' },
    { name: 'OpenStax Biology 2e: 4.1 Studying Cells (cell sizes)', url: 'https://openstax.org/books/biology-2e/pages/4-1-studying-cells' }
  ]
};
