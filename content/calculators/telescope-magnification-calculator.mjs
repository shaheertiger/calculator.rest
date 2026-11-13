export default {
  slug: 'telescope-magnification-calculator',
  hub: 'science',
  name: 'Telescope Magnification Calculator',
  title: 'Telescope Magnification Calculator: 1200 mm ÷ 25 mm = 48×',
  h1: 'Telescope Magnification Calculator with Barlow, Exit Pupil and True Field',
  meta: 'Magnification = telescope focal length ÷ eyepiece focal length, so 1200 mm with a 25 mm eyepiece is 48×. Covers Barlows, exit pupil, true field and max power.',
  keyword: 'how to calculate telescope magnification power',
  also: ['how to calculate telescope magnification', 'how to calculate magnification telescope', 'how to calculate magnification of telescope', 'how to calculate magnification of a telescope', 'how do you calculate the magnification of a telescope', 'how to calculate the magnification of a telescope', 'telescope magnification calculator', 'telescope eyepiece calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'fl', label: 'Telescope focal length', type: 'number', value: 1200, suffix: 'mm', help: 'Printed on the tube or mount, e.g. "D = 203 mm, F = 1200 mm".' },
    { id: 'ap', label: 'Aperture (diameter)', type: 'number', value: 203, suffix: 'mm', help: '1 inch = 25.4 mm: 4 in = 102 mm, 6 in = 152 mm, 8 in = 203 mm.' },
    { id: 'ep', label: 'Eyepiece focal length', type: 'number', value: 25, suffix: 'mm', help: 'Printed on the eyepiece barrel, e.g. 25 mm or 10 mm.' },
    { id: 'barlow', label: 'Barlow lens or reducer', type: 'select', value: '1', options: [['1', 'None'], ['2', '2× Barlow'], ['2.5', '2.5× Barlow'], ['3', '3× Barlow'], ['5', '5× Powermate / Barlow'], ['0.63', '0.63× focal reducer'], ['0.5', '0.5× focal reducer']] },
    { id: 'afov', label: 'Eyepiece apparent field', type: 'number', value: 52, suffix: '°', help: 'Plössl ≈ 50–52°, wide-angle ≈ 68–70°, ultra-wide ≈ 82°+.' }
  ],
  compute(v, H) {
    if (!(v.fl > 0)) return { error: 'Enter the telescope\'s focal length in mm.' };
    if (!(v.ep > 0)) return { error: 'Enter the eyepiece focal length in mm.' };
    var b = Number(v.barlow) || 1, efl = v.fl * b, M = efl / v.ep;
    var rows = [], sub = '';
    if (b !== 1) rows.push(['Effective focal length', H.num(efl, 1) + ' mm']);
    if (v.ap > 0) {
      var D = v.ap, xp = D / M, maxU = 50 * D / 25.4, minU = D / 7;
      rows.push(['Exit pupil', H.num(xp, 2) + ' mm', true]);
      rows.push(['Focal ratio', 'f/' + H.num(efl / D, 1)]);
      rows.push(['Max useful magnification (50× per inch)', H.num(maxU, 0) + '×']);
      rows.push(['Lowest useful magnification (7 mm pupil)', H.num(minU, 0) + '×']);
      rows.push(['Light gathered vs. the eye', H.num(Math.pow(D / 7, 2), 0) + '×']);
      rows.push(['Resolving limit (Dawes, 116″ ÷ D)', H.num(116 / D, 2) + '″']);
      sub = M > maxU ? 'Above 50× per inch of aperture: expect a dim, soft image. Use a longer eyepiece.' : xp > 7 ? 'Exit pupil over 7 mm: more light leaves the eyepiece than your pupil can take in. A shorter eyepiece wastes nothing.' : xp >= 2 ? 'A low-to-medium power view, good for star clusters, galaxies and the whole Moon.' : xp >= 0.5 ? 'A high-power view, good for the Moon\'s craters, planets and double stars on steady nights.' : 'Very high power: only useful on the steadiest nights for close double stars and planetary detail.';
    }
    if (v.afov > 0) {
      var tf = v.afov / M;
      rows.push(['True field of view', H.num(tf, 2) + '° (' + H.num(tf * 60, 0) + '′)']);
    }
    var out = {
      value: H.num(M, 1) + '×',
      label: 'Magnification',
      expr: H.num(v.fl, 1) + ' mm' + (b !== 1 ? ' × ' + H.num(b, 2) : '') + ' ÷ ' + H.num(v.ep, 2) + ' mm',
      rows: rows,
      sub: sub || 'Enter the aperture to see exit pupil and the useful magnification range.'
    };
    out.xp = v.ap > 0 ? H.num(v.ap / M, 1) + ' mm' : '—';
    out.tf = v.afov > 0 ? H.num(v.afov / M, 2) + '°' : '—';
    return out;
  },
  quick: ({ r }) => `To calculate telescope magnification, divide the telescope's focal length by the eyepiece's focal length. An 8-inch Dobsonian with a 1200 mm focal length and a 25 mm eyepiece gives 1200 ÷ 25 = <strong>${r.value}</strong>; a 10 mm eyepiece gives 120×, and a 2× Barlow doubles either. The useful maximum is about 50× per inch of aperture, roughly 400× here.`,
  stepsTitle: 'How to calculate telescope magnification',
  steps: [
    'Find the telescope\'s focal length, usually printed on the tube or in the manual as F or FL (for example F = 1200 mm). If only the focal ratio is given, multiply it by the aperture: f/6 × 203 mm ≈ 1,200 mm.',
    'Read the focal length on the eyepiece barrel, such as 25 mm or 10 mm. A smaller number means more magnification.',
    'Divide: magnification = telescope focal length ÷ eyepiece focal length. Both must be in millimeters.',
    'If you use a Barlow lens, multiply the result by its factor (2×, 3×). A focal reducer multiplies by a number below 1.',
    'Check the result against the limit of about 50× per inch (2× per mm) of aperture. Beyond it the image only gets dimmer and blurrier.'
  ],
  formulaTitle: 'What is the telescope magnification formula?',
  formula: {
    expr: 'M = F<sub>telescope</sub> ÷ f<sub>eyepiece</sub> (× Barlow factor)<br>Exit pupil = D ÷ M = f<sub>eyepiece</sub> ÷ focal ratio<br>True field ≈ apparent field ÷ M<br>Max useful M ≈ 50 × D (inches) ≈ 2 × D (mm)',
    vars: [['F<sub>telescope</sub>', 'focal length of the telescope\'s main lens or mirror (mm)'], ['f<sub>eyepiece</sub>', 'focal length of the eyepiece (mm)'], ['D', 'aperture, the diameter of the main lens or mirror'], ['focal ratio', 'F ÷ D, written f/6, f/10 and so on']]
  },
  example: `<p>A 102 mm (4-inch) refractor has a focal length of 660 mm. The owner has 25 mm and 9 mm eyepieces and a 2× Barlow.</p>
<p>25 mm: 660 ÷ 25 = <strong>26.4×</strong>, exit pupil 102 ÷ 26.4 = 3.9 mm. 9 mm: 660 ÷ 9 = <strong>73.3×</strong>. 9 mm with the Barlow: 1,320 ÷ 9 = <strong>146.7×</strong>, exit pupil 0.70 mm.</p>
<p>The maximum useful magnification is 50 × 4.0 in ≈ 200×, so all three are usable; the 147× combination is the one to use for Saturn on a steady night.</p>`,
  table: {
    title: 'What magnification does each eyepiece give on a 1200 mm telescope?',
    intro: 'Results from the calculator for an 8-inch (203 mm) f/5.9 telescope and eyepieces with a 52° apparent field.',
    head: ['Eyepiece', 'Magnification', 'With 2× Barlow', 'Exit pupil', 'True field'],
    rows: ({ run }) => [40, 32, 25, 20, 15, 12, 10, 9, 7, 6, 5, 4].map(e => {
      const a = run({ fl: 1200, ap: 203, ep: e, barlow: '1', afov: 52 });
      const b = run({ fl: 1200, ap: 203, ep: e, barlow: '2', afov: 52 });
      return [e + ' mm', a.value, b.value, a.xp, a.tf];
    }),
    note: 'Combinations above 400× (the 5 mm and 4 mm eyepieces with the Barlow) exceed the 50×-per-inch limit, and anything above about 250–350× is more than the air allows on most nights. In practice 150–250× is the everyday upper end for an 8-inch telescope.'
  },
  sections: [
    {
      h2: 'What is the maximum useful magnification of a telescope?',
      html: `<p>The rule of thumb is 50× per inch of aperture, or about 2× per millimeter. A 4-inch (102 mm) telescope tops out around 200×, a 6-inch around 300× and an 8-inch around 400×. Above that, the image gets larger but no sharper, because the aperture sets the finest detail the optics can resolve (about 116 ÷ D arcseconds, the Dawes limit).</p>
<p>The atmosphere is usually the tighter limit. Turbulence ("seeing") blurs anything above roughly 250–350× on most nights, whatever the telescope. That is why a small department-store telescope advertised at 675× is misleading: a 60 mm scope can only use about 120×.</p>`
    },
    {
      h2: 'How does a Barlow lens change magnification?',
      html: `<p>A Barlow lens goes between the focuser and the eyepiece and multiplies the telescope's effective focal length by its rated factor. A 2× Barlow turns a 1200 mm telescope into a 2400 mm one, so the 25 mm eyepiece that gave 48× now gives 96×, the same as a 12.5 mm eyepiece alone.</p>
<p>That effectively doubles an eyepiece collection, and it keeps the comfortable eye relief of the longer eyepiece. A focal reducer does the opposite: a 0.63× reducer on a 2000 mm f/10 Schmidt-Cassegrain makes it 1260 mm at f/6.3, for lower power and a wider field.</p>`
    },
    {
      h2: 'What is exit pupil and why does it matter?',
      html: `<p>The exit pupil is the diameter of the beam of light leaving the eyepiece: aperture ÷ magnification, or eyepiece focal length ÷ focal ratio. If it is wider than your eye's pupil, some light is wasted; if it is very small, the view gets dim and floaters in your eye become distracting.</p>
<ul><li><strong>5–7 mm:</strong> lowest power and widest field. A dark-adapted young eye opens to about 7 mm; this shrinks with age, so many adults are limited to around 5 mm.</li>
<li><strong>2–4 mm:</strong> most galaxies, nebulae and star clusters.</li>
<li><strong>0.5–1 mm:</strong> the Moon, planets and close double stars.</li></ul>`
    },
    {
      h2: 'How do you calculate a telescope\'s true field of view?',
      html: `<p>Divide the eyepiece's apparent field (printed on the box, typically 50° to 82°) by the magnification. A 52° eyepiece at 48× shows 52 ÷ 48 = 1.08°, about 65 arcminutes, enough to fit the full Moon (about half a degree) twice. The same eyepiece at 120× shows only 0.43°.</p>
<p>For a more exact figure, use the eyepiece's field stop diameter: true field = field stop ÷ telescope focal length × 57.3°. Manufacturers list the field stop for most premium eyepieces.</p>`
    },
    {
      h2: 'How do binocular numbers relate to magnification?',
      html: `<p>Binoculars print magnification and aperture directly: 10×50 means 10× magnification and 50 mm objective lenses, and dividing them gives the exit pupil, 50 ÷ 10 = 5 mm. A pair of 7×50s has a 7.1 mm exit pupil, a classic choice for low-light viewing; 8×42s have 5.25 mm.</p>
<p>A small refractor works the same way as the large example above: an 80 mm f/5 refractor has a 400 mm focal length, so a 10 mm eyepiece gives 40×. For lenses in a microscope, where the two magnifications multiply instead of divide, see the <a href="/microscope-magnification-calculator">microscope magnification calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate the magnification of a telescope?', a: 'Divide the telescope\'s focal length by the eyepiece\'s focal length, both in millimeters. A 900 mm telescope with a 10 mm eyepiece magnifies 90×.' },
    { q: 'Does a bigger aperture mean more magnification?', a: 'No. Magnification depends only on the two focal lengths. Aperture sets how much light is collected, how fine the detail can be, and therefore how much magnification is useful.' },
    { q: 'What magnification do I need to see Saturn\'s rings?', a: 'The rings are visible from about 25–30×. Around 100–200× on a steady night, in a 4-inch or larger telescope, shows the gap between the rings (the Cassini Division) and cloud bands.' },
    { q: 'What is the lowest useful magnification?', a: 'Aperture in mm divided by 7, which gives a 7 mm exit pupil. For an 8-inch (203 mm) telescope that is about 29×. Lower powers waste light.' },
    { q: 'How do I find my telescope\'s focal length?', a: 'Look for "F = " or "FL" on the tube or focuser label. If only the focal ratio is shown, multiply it by the aperture: an f/10 telescope with a 127 mm aperture has a 1,270 mm focal length.' },
    { q: 'Is higher magnification always better?', a: 'No. Most of the best views of galaxies, clusters and nebulae are at low to medium power, and high power is limited by aperture and the atmosphere. Start with your longest eyepiece and increase power only while the image stays sharp.' },
    { q: 'What does 2× Barlow do to a 10 mm eyepiece?', a: 'It makes the 10 mm eyepiece behave like a 5 mm one, doubling the magnification. On a 1200 mm telescope that is 240× instead of 120×.' }
  ],
  related: ['microscope-magnification-calculator', 'field-of-view-calculator', 'orbital-period-calculator', 'ratio-calculator'],
  sources: [
    { name: 'OpenStax Astronomy 2e: 6.1 Telescopes', url: 'https://openstax.org/books/astronomy-2e/pages/6-1-telescopes' },
    { name: 'OpenStax University Physics Volume 3: 2.8 Microscopes and Telescopes', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-8-microscopes-and-telescopes' },
    { name: 'NASA Night Sky Network (JPL)', url: 'https://nightsky.jpl.nasa.gov/' }
  ]
};
