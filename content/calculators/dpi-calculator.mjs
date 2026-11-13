export default {
  slug: 'dpi-calculator',
  hub: 'everyday',
  name: 'DPI Calculator',
  title: 'DPI Calculator: 3000 px Across a 10-Inch Print Is 300 DPI',
  h1: 'DPI and PPI Calculator: Print Resolution, Print Size and Pixels to Inches',
  meta: 'A 3000 × 2400 pixel image printed at 10 × 8 inches is 300 DPI. Find the DPI of any print, the biggest sharp print size, the pixels you need, or a screen\'s PPI.',
  keyword: 'how to calculate dpi',
  also: ['how to calculate pixels to inches', 'how to calculate resolution of an image', 'dpi calculator', 'ppi calculator', 'print size calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you want to find?', type: 'select', value: 'dpi', options: [['dpi', 'DPI of a print (pixels + print size)'], ['size', 'Print size (pixels + DPI)'], ['pixels', 'Pixels needed (print size + DPI)'], ['screen', 'Screen PPI (resolution + diagonal)']], wide: true },
    { id: 'pxW', label: 'Image width', type: 'number', value: 3000, suffix: 'px', showIf: { mode: ['dpi', 'size', 'screen'] } },
    { id: 'pxH', label: 'Image height', type: 'number', value: 2400, suffix: 'px', showIf: { mode: ['dpi', 'size', 'screen'] } },
    { id: 'inW', label: 'Print width', type: 'number', value: 10, suffix: 'in', showIf: { mode: ['dpi', 'pixels'] } },
    { id: 'inH', label: 'Print height', type: 'number', value: 8, suffix: 'in', showIf: { mode: ['dpi', 'pixels'] } },
    { id: 'dpi', label: 'Resolution', type: 'number', value: 300, suffix: 'DPI', showIf: { mode: ['size', 'pixels'] } },
    { id: 'diag', label: 'Screen diagonal', type: 'number', value: 24, suffix: 'in', showIf: { mode: ['screen'] } }
  ],
  compute(v, H) {
    var cm = function (x) { return H.num(x * 2.54, 1); };
    var q = function (d) { return d >= 300 ? 'photo quality, sharp even up close' : d >= 200 ? 'good for most prints' : d >= 150 ? 'fine for posters viewed from a few feet' : d >= 100 ? 'large-format only; soft up close' : 'too low for a sharp print'; };
    if (v.mode === 'pixels') {
      if (!(v.inW > 0 && v.inH > 0 && v.dpi > 0)) return { error: 'Enter the print width, height and DPI.' };
      var w = Math.ceil(v.inW * v.dpi), h = Math.ceil(v.inH * v.dpi);
      return { value: H.int(w) + ' × ' + H.int(h), label: 'Pixels needed', expr: H.num(v.inW, 2) + '" × ' + H.num(v.inH, 2) + '" at ' + H.num(v.dpi, 0) + ' DPI', rows: [['Megapixels', H.num(w * h / 1e6, 1) + ' MP', true], ['Print size in cm', cm(v.inW) + ' × ' + cm(v.inH) + ' cm']] };
    }
    if (!(v.pxW > 0 && v.pxH > 0)) return { error: 'Enter the image width and height in pixels.' };
    var mp = v.pxW * v.pxH / 1e6;
    if (v.mode === 'screen') {
      if (!(v.diag > 0)) return { error: 'Enter the screen\'s diagonal size in inches.' };
      var dpx = Math.sqrt(v.pxW * v.pxW + v.pxH * v.pxH), ppi = dpx / v.diag;
      var sw = v.diag * v.pxW / dpx, shh = v.diag * v.pxH / dpx;
      return { value: H.num(ppi, 1) + ' PPI', label: 'Screen pixel density', expr: '√(' + v.pxW + '² + ' + v.pxH + '²) ÷ ' + H.num(v.diag, 1) + '"', rows: [['Diagonal in pixels', H.num(dpx, 1) + ' px'], ['Screen width × height', H.num(sw, 1) + '" × ' + H.num(shh, 1) + '"'], ['Pixel size', H.num(25.4 / ppi, 3) + ' mm']] };
    }
    if (v.mode === 'size') {
      if (!(v.dpi > 0)) return { error: 'Enter the DPI you plan to print at.' };
      var iw = v.pxW / v.dpi, ih = v.pxH / v.dpi;
      return { value: H.num(iw, 1) + '" × ' + H.num(ih, 1) + '"', label: 'Print size at ' + H.num(v.dpi, 0) + ' DPI', expr: v.pxW + ' px ÷ ' + H.num(v.dpi, 0) + ' DPI', rows: [['In centimeters', cm(iw) + ' × ' + cm(ih) + ' cm', true], ['At 150 DPI (poster)', H.num(v.pxW / 150, 1) + '" × ' + H.num(v.pxH / 150, 1) + '"'], ['Megapixels', H.num(mp, 1) + ' MP']] };
    }
    if (!(v.inW > 0 && v.inH > 0)) return { error: 'Enter the print width and height in inches.' };
    var dw = v.pxW / v.inW, dh = v.pxH / v.inH, d = Math.min(dw, dh);
    var rows = [
      ['Quality', q(d), true],
      ['Biggest print at 300 DPI', H.num(v.pxW / 300, 1) + '" × ' + H.num(v.pxH / 300, 1) + '"'],
      ['Biggest print at 150 DPI', H.num(v.pxW / 150, 1) + '" × ' + H.num(v.pxH / 150, 1) + '"'],
      ['Megapixels', H.num(mp, 1) + ' MP']
    ];
    if (Math.abs(dw - dh) / d > 0.01) rows.unshift(['Width / height DPI', H.num(dw, 0) + ' / ' + H.num(dh, 0) + ': shapes differ, so part of the image will be cropped']);
    return { value: H.num(d, 0) + ' DPI', label: 'Print resolution', expr: v.pxW + ' px ÷ ' + H.num(v.inW, 2) + ' in', rows: rows };
  },
  quick: ({ r }) => `To calculate DPI, divide the image's width in pixels by the print width in inches. A 3000 × 2400 pixel photo printed at 10 × 8 inches is 3000 ÷ 10 = <strong>${r.value}</strong> (2400 ÷ 8 gives the same). That's photo quality. Going the other way, pixels ÷ DPI = inches: the same file prints 20 × 16 inches at 150 DPI.`,
  stepsTitle: 'How to calculate DPI for a print',
  steps: [
    'Find the image\'s pixel dimensions: in file properties (Windows), Get Info or Preview\'s inspector (Mac), or your editor\'s image size dialog.',
    'Decide the print size in inches. Divide centimeters by 2.54 if you\'re working in metric.',
    'Divide pixels by inches for each side: 3000 px ÷ 10 in = 300 DPI. If the two sides give different numbers, the image and paper are different shapes and the lower number is what you\'ll get after cropping.',
    'Compare with the target: 300 for photos held in the hand, 150–200 for wall prints, 100–150 for posters seen from a distance. <strong>Don\'t just change the DPI field</strong> in an editor without resampling; that only changes a label, not the detail in the image.'
  ],
  formulaTitle: 'What is the formula for DPI?',
  formula: {
    expr: 'DPI = Pixels ÷ Inches<br>Print size (in) = Pixels ÷ DPI<br>Pixels needed = Inches × DPI<br>Screen PPI = √(width² + height²) ÷ diagonal',
    vars: [['Pixels', 'image width or height in pixels'], ['Inches', 'print width or height (cm ÷ 2.54)'], ['diagonal', 'screen size in inches, measured corner to corner']],
    note: 'Strictly, the resolution of an image file is PPI (pixels per inch) and DPI describes printer ink dots, but print shops and software use DPI for both.'
  },
  example: `<p>You want to print a 12-megapixel phone photo (4032 × 3024 pixels) as an 11 × 14 inch print, in landscape (14 × 11).</p>
<p>DPI across the width = 4032 ÷ 14 = <strong>288</strong>; down the height = 3024 ÷ 11 = <strong>275</strong>. The shapes differ (4:3 photo, 14:11 paper), so you crop a little and get about <strong>275 DPI</strong>, which prints well.</p>
<p>At a true 300 DPI the photo maxes out at 4032 ÷ 300 = 13.4 by 3024 ÷ 300 = 10.1 inches.</p>`,
  table: {
    title: 'How big can you print common image resolutions?',
    intro: 'Maximum print sizes at 300 DPI (photo quality) and 150 DPI (posters and large wall prints), computed by the calculator above.',
    head: ['Image', 'Pixels', 'At 300 DPI', 'At 150 DPI'],
    rows: ({ run }) => [['Full HD frame (2 MP)', 1920, 1080], ['8 MP', 3264, 2448], ['12 MP phone', 4032, 3024], ['4K frame (8 MP)', 3840, 2160], ['16 MP', 4608, 3456], ['24 MP camera', 6000, 4000], ['33 MP camera', 7008, 4672], ['45 MP camera', 8192, 5464], ['48 MP phone', 8064, 6048], ['61 MP camera', 9504, 6336]].map(([n, w, h]) => [n, w + ' × ' + h, run({ mode: 'size', pxW: w, pxH: h, dpi: 300 }).value, run({ mode: 'size', pxW: w, pxH: h, dpi: 150 }).value]),
    note: 'Sizes are in inches at the image\'s own shape. Large prints viewed from several feet away look sharp at well under 150 DPI.'
  },
  sections: [
    {
      h2: 'What DPI do you need for printing?',
      html: `<p>It depends on how close people will look:</p>
<ul><li><strong>300 DPI:</strong> the long-standing standard for photos, cards and anything held in the hand (about 12 inches away).</li><li><strong>200–250 DPI:</strong> usually indistinguishable from 300 for framed prints on a wall.</li><li><strong>100–150 DPI:</strong> posters and canvases viewed from a few feet.</li><li><strong>Under 50 DPI:</strong> banners and billboards seen from across a room or street.</li></ul>
<p>The rule behind it: the farther away the viewer, the larger each pixel can be before the eye notices. If your image comes in under target, printing a little smaller is better than upscaling, which adds pixels but no real detail.</p>`
    },
    {
      h2: 'What is the difference between DPI and PPI?',
      html: `<p><strong>PPI</strong> (pixels per inch) is how densely an image's pixels are spread over the print, or how dense a screen is. <strong>DPI</strong> (dots per inch) originally meant the tiny ink dots a printer lays down. An inkjet rated at 1,200 or 4,800 DPI uses many ink dots to reproduce each image pixel, so its DPI rating isn't the number this calculator works with.</p>
<p>In everyday use, and in most print-shop instructions, "300 DPI" means 300 pixels per inch of print. The "72 DPI" you see on many web images is only a metadata tag: a 3000-pixel-wide image has the same detail whether it's tagged 72 or 300.</p>`
    },
    {
      h2: 'How do you convert pixels to inches?',
      html: `<p>Divide the pixels by the DPI (or PPI). At 300 DPI, 1,800 pixels is 6 inches; at 96 PPI it is 18.75 inches. Multiply inches by 2.54 for centimeters, since an inch is exactly 2.54 cm.</p>
<p>On the web, CSS fixes 1 inch at 96 "CSS pixels," which is why a 960-pixel-wide design is called 10 inches in browser terms even though physical screens vary. For print work always use the DPI you'll actually print at.</p>`
    },
    {
      h2: 'How do you calculate a screen\'s PPI?',
      html: `<p>Use the diagonal: PPI = √(width² + height²) ÷ diagonal inches. A 24-inch monitor at 1920 × 1080 has √(1920² + 1080²) = 2,203 pixels on the diagonal, so 2,203 ÷ 24 = <strong>91.8 PPI</strong>. The same size at 3840 × 2160 (4K) is 183.6 PPI.</p>
<p>Choose "Screen PPI" above for any display. The width-and-height formula is the Pythagorean theorem applied to the pixel grid; the <a href="/right-triangle-calculator">right triangle calculator</a> uses the same math.</p>`
    }
  ],
  faq: [
    { q: 'How many pixels do I need for an 8 × 10 print at 300 DPI?', a: '2400 × 3000 pixels (7.2 megapixels). Multiply each side in inches by 300.' },
    { q: 'How do I calculate the DPI of an image?', a: 'Divide its width in pixels by the width it will print at in inches. A 3000-pixel-wide image printed 10 inches wide is 300 DPI.' },
    { q: 'How big can I print a 12-megapixel photo?', a: 'About 13.4 × 10.1 inches at 300 DPI (4032 × 3024 pixels), or about 27 × 20 inches at 150 DPI for a poster.' },
    { q: 'Is 72 DPI good enough for printing?', a: 'No, if the image is printed at its tagged size. 72 DPI is a web-era label; what matters is how many pixels you have. Divide them by your print size to find the real DPI.' },
    { q: 'Does increasing DPI in Photoshop improve quality?', a: 'Not by itself. Changing DPI without resampling only changes the print size label. Resampling up adds pixels by interpolation but cannot add detail the camera didn\'t capture.' },
    { q: 'What DPI should I scan photos at?', a: '300 DPI is enough to reprint at the same size. Scan at 600 DPI or higher if you might enlarge the print or crop into it.' },
    { q: 'Is mouse DPI the same thing?', a: 'No. Mouse DPI (more precisely CPI) is how many counts the sensor reports per inch of movement. It controls pointer speed and has nothing to do with image resolution.' }
  ],
  related: ['ratio-calculator', 'right-triangle-calculator', 'percentage-calculator', 'cubic-inches-calculator'],
  sources: [
    { name: 'W3C: CSS Values and Units Level 4, absolute lengths (1in = 96px)', url: 'https://www.w3.org/TR/css-values-4/#absolute-lengths' },
    { name: 'NIST: Unit conversion (1 inch = 2.54 cm exactly)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' },
    { name: 'Federal Agencies Digital Guidelines Initiative (FADGI): digitization guidelines', url: 'https://www.digitizationguidelines.gov/' }
  ]
};
