export default {
  slug: 'candy-jar-calculator',
  hub: 'everyday',
  name: 'Candy in a Jar Calculator',
  title: 'Candy Jar Calculator: About 3,043 M&M\'s in a 5" × 8" Jar',
  h1: 'How Many Candies in the Jar? Guess From Jar Size and Candy Type',
  meta: 'A jar 5 inches wide filled 8 inches deep holds about 3,043 plain M&M\'s. Estimate jelly beans, Skittles or gumballs in any jar for a guessing contest.',
  keyword: 'how many candies in a jar calculator',
  also: ['how many jelly beans in a jar calculator', 'how to calculate candy in a jar', 'candy jar guess calculator', 'how many m&ms in a jar', 'jelly bean counter'],
  updated: '2026-11-13',
  inputs: [
    { id: 'shape', label: 'Jar shape', type: 'select', value: 'cyl', options: [['cyl', 'Round (cylinder)'], ['box', 'Square or rectangular'], ['cap', 'I know the capacity']] },
    { id: 'dia', label: 'Inside diameter', type: 'number', value: 5, suffix: 'in', showIf: { shape: ['cyl'] } },
    { id: 'len', label: 'Inside length', type: 'number', value: 5, suffix: 'in', showIf: { shape: ['box'] } },
    { id: 'wid', label: 'Inside width', type: 'number', value: 4, suffix: 'in', showIf: { shape: ['box'] } },
    { id: 'ht', label: 'Height of the candy', type: 'number', value: 8, suffix: 'in', help: 'Measure to the top of the candy, not the lid.', showIf: { shape: ['cyl', 'box'] } },
    { id: 'cap', label: 'Jar capacity', type: 'number', value: 32, suffix: 'fl oz', help: 'Quart = 32, half gallon = 64, gallon = 128.', showIf: { shape: ['cap'] } },
    { id: 'candy', label: 'Candy', type: 'select', value: 'mm', options: [['mm', 'Plain M&M\'s'], ['pmm', 'Peanut M&M\'s'], ['skit', 'Skittles'], ['jb', 'Jelly beans (Jelly Belly size)'], ['gum', 'Gumballs, 1 inch'], ['custom', 'Other (enter size)']] },
    { id: 'cl', label: 'Candy length', type: 'number', value: 2, suffix: 'cm', showIf: { candy: ['custom'] } },
    { id: 'cw', label: 'Candy width', type: 'number', value: 1.5, suffix: 'cm', showIf: { candy: ['custom'] } },
    { id: 'ct', label: 'Candy thickness', type: 'number', value: 1, suffix: 'cm', showIf: { candy: ['custom'] } }
  ],
  data: {
    candy: {
      mm: { name: 'plain M&M\'s', dims: [1.3, 1.3, 0.65], pack: 0.68 },
      pmm: { name: 'peanut M&M\'s', dims: [1.8, 1.6, 1.5], pack: 0.64 },
      skit: { name: 'Skittles', dims: [1.2, 1.2, 0.7], pack: 0.68 },
      jb: { name: 'jelly beans', dims: [1.6, 1.0, 0.95], pack: 0.64 },
      gum: { name: '1-inch gumballs', dims: [2.54, 2.54, 2.54], pack: 0.64 }
    }
  },
  compute(v, H, D) {
    var in3;
    if (v.shape === 'box') {
      if (!(v.len > 0 && v.wid > 0 && v.ht > 0)) return { error: 'Enter the jar\'s inside length, width and candy height.' };
      in3 = v.len * v.wid * v.ht;
    } else if (v.shape === 'cap') {
      if (!(v.cap > 0)) return { error: 'Enter the jar capacity in fluid ounces.' };
      in3 = v.cap * 1.8046875;
    } else {
      if (!(v.dia > 0 && v.ht > 0)) return { error: 'Enter the jar\'s inside diameter and candy height.' };
      in3 = Math.PI * v.dia * v.dia / 4 * v.ht;
    }
    var c = D.candy[v.candy];
    var dims, pack, name;
    if (c) { dims = c.dims; pack = c.pack; name = c.name; }
    else {
      if (!(v.cl > 0 && v.cw > 0 && v.ct > 0)) return { error: 'Enter the candy\'s length, width and thickness in cm.' };
      dims = [v.cl, v.cw, v.ct]; pack = 0.64; name = 'candies';
    }
    var cm3 = in3 * 16.387064;
    var piece = Math.PI / 6 * dims[0] * dims[1] * dims[2];
    var n = cm3 * pack / piece;
    if (n < 1) return { error: 'The jar is smaller than one candy. Check the units: jar in inches, candy in cm.' };
    return {
      value: H.int(n),
      label: 'Estimated ' + name + ' in the jar',
      expr: H.num(cm3, 0) + ' cm³ × ' + H.pct(pack * 100, 0) + ' ÷ ' + H.num(piece, 3) + ' cm³',
      rows: [
        ['Smart guess range (±10%)', H.int(n * 0.9) + '–' + H.int(n * 1.1), true],
        ['Jar volume', H.num(in3, 1) + ' in³ · ' + H.int(cm3) + ' cm³ · ' + H.num(in3 / 1.8046875, 1) + ' fl oz'],
        ['Space filled by candy', H.pct(pack * 100, 0) + ' (' + H.int(cm3 * pack) + ' cm³)'],
        ['One candy', H.num(piece, 3) + ' cm³']
      ],
      sub: 'Subtract a little if the jar narrows at the shoulder or has a thick base; add a little if the candy is heaped above your height measurement.'
    };
  },
  quick: ({ r }) => `To estimate candies in a jar, multiply the jar's volume by the share of space the candy fills (about 64–68%) and divide by the volume of one piece. A round jar 5 inches across filled 8 inches deep holds 157 in³ (2,574 cm³). With plain M&M's at about 0.575 cm³ each and 68% packing, that's <strong>about ${r.value}</strong> candies.`,
  stepsTitle: 'How to estimate the candy in a jar',
  steps: [
    'Measure the jar\'s <strong>inside</strong> diameter (or length and width) through the glass, taking off the wall thickness. On a wide-mouth jar the lid ring is a good guide.',
    'Measure the height of the candy, not the jar. Ignore the empty space under the lid.',
    'Pick the candy, or enter a custom candy\'s length, width and thickness in centimeters (a ruler on a few pieces is enough).',
    'Read the estimate and guess inside the ±10% range. If the jar curves in at the top or bottom, shave your guess down a bit; that\'s the step most guessers forget.'
  ],
  formulaTitle: 'What is the formula for candies in a jar?',
  formula: {
    expr: 'Candies = Jar volume × Packing fraction ÷ Volume of one candy<br>Round jar volume = π × (diameter ÷ 2)² × height<br>Candy volume ≈ π ÷ 6 × length × width × thickness',
    vars: [['Packing fraction', 'share of the jar actually filled by candy: about 0.64 for round or bean shapes, about 0.68 for M&M-like lentils'], ['π ÷ 6 × L × W × T', 'volume of an ellipsoid, a good model for most rounded candies'], ['16.387', 'cm³ per cubic inch']],
    note: 'Candy sizes in the menu are approximate measurements of typical pieces; brands and batches vary, so treat the answer as an informed estimate.'
  },
  example: `<p>A contest jar is round, 5 inches across inside, with M&M's 8 inches deep.</p>
<p>Jar volume = 3.1416 × 2.5² × 8 = <strong>157.1 in³</strong> = 157.1 × 16.387 = <strong>2,574 cm³</strong>.</p>
<p>Candy space = 2,574 × 0.68 = 1,750 cm³. One plain M&M ≈ π ÷ 6 × 1.3 × 1.3 × 0.65 = 0.575 cm³.</p>
<p>Count ≈ 1,750 ÷ 0.575 ≈ <strong>3,043</strong>. A guess between about 2,740 and 3,350 is in range.</p>`,
  table: {
    title: 'How many candies fit in common jar sizes?',
    intro: 'Estimated counts by jar capacity, computed by the calculator above with the default candy sizes and packing.',
    head: ['Jar', 'Plain M&M\'s', 'Peanut M&M\'s', 'Skittles', 'Jelly beans', '1" gumballs'],
    rows: ({ run }) => [['Half pint (8 fl oz)', 8], ['Pint (16 fl oz)', 16], ['Quart (32 fl oz)', 32], ['Half gallon (64 fl oz)', 64], ['Gallon (128 fl oz)', 128], ['2 gallons (256 fl oz)', 256]].map(([n, oz]) => [n, ...['mm', 'pmm', 'skit', 'jb', 'gum'].map(c => run({ shape: 'cap', cap: oz, candy: c }).value)]),
    note: 'Capacity is to the brim. Most contest jars are filled to just below the shoulder, roughly 85–90% of the label capacity, so scale down accordingly.'
  },
  sections: [
    {
      h2: 'How do you guess how many candies are in a jar without a calculator?',
      html: `<p>Count in layers. Count how many candies span the bottom of the jar from side to side; for a round jar the bottom layer holds about that number squared × 0.8 (because a circle covers 78.5% of the square around it). Then count how many layers stack up to the candy line and multiply.</p>
<p>Example: 12 gumballs across the bottom gives about 12 × 12 × 0.8 ≈ 115 per layer; 9 layers makes roughly 1,040. The layer method works best for big candies like gumballs that you can count through the glass. For small candies, the volume method above is more reliable, and the two together make a good cross-check.</p>`
    },
    {
      h2: 'How much of a jar is actually candy?',
      html: `<p>Even packed tight, round objects leave gaps. Randomly poured spheres fill about <strong>64%</strong> of a container, a figure known as random close packing. Flattened, lentil-shaped candies do better: a 2004 study in <em>Science</em> (Donev et al.) found that M&M's pack randomly to about 68%, denser than spheres, because their shape fills gaps more efficiently.</p>
<p>Shaking or tapping the jar settles candy a little denser; a loosely poured jar can be closer to 60%. Irregular pieces like gummy bears or wrapped candy pack worse, often well under 60%, so lower your estimate for those.</p>`
    },
    {
      h2: 'How do you find the volume of a candy jar?',
      html: `<p>Three ways, from most to least accurate:</p>
<ul><li><strong>Read the label:</strong> mason jars are sold by capacity (a pint is 16 fl oz, a quart 32). Choose "I know the capacity."</li><li><strong>Fill an identical jar with water</strong> to the candy line and pour it into a measuring cup. One cup is 8 fl oz.</li><li><strong>Measure it:</strong> for a round jar, π × radius² × height; for a box-shaped jar, length × width × height. Use inside dimensions.</li></ul>
<p>For conversions: 1 fl oz = 1.805 in³ = 29.57 cm³, and a gallon is 231 in³. The <a href="/cubic-inches-calculator">cubic inches calculator</a> handles box volumes in more units.</p>`
    },
    {
      h2: 'How do you win a guess-the-candy contest?',
      html: `<p>Do the math, then adjust for what the math can't see. Check whether the jar has a thick glass base or a domed bottom (common on decorative jars), whether the center could be hollow or filled with something else, and whether the candy is heaped above the rim. Each of these can move the count by 10% or more.</p>
<p>If you can, ask a few friends for independent guesses and average them with your calculated number. The average of many independent guesses is usually closer than most individual guesses, the "wisdom of crowds" effect Francis Galton described in 1907 after a guess-the-ox-weight contest.</p>`
    }
  ],
  faq: [
    { q: 'How many M&M\'s are in a gallon jar?', a: 'About 4,475 plain M&M\'s fill a gallon jar to the brim, using 68% packing and 0.575 cm³ per candy. A jar filled to the shoulder holds closer to 3,800–4,000.' },
    { q: 'How many jelly beans are in a quart jar?', a: 'About 760 Jelly Belly-size jelly beans fit in a 32 fl oz quart jar. Larger, traditional jelly beans give a lower count.' },
    { q: 'How many gumballs are in a gallon jar?', a: 'About 280 one-inch gumballs. Spheres fill about 64% of the jar, and each 1-inch gumball takes about 8.6 cm³.' },
    { q: 'How many candies are in a pint mason jar?', a: 'About 560 plain M&M\'s, 610 Skittles or 380 jelly beans fill a 16 fl oz pint jar to the brim.' },
    { q: 'What packing fraction should I use?', a: 'Use 0.64 for round candies, gumballs and jelly beans, 0.68 for flat lentil shapes like M&M\'s and Skittles, and about 0.55–0.60 for irregular or wrapped candy.' },
    { q: 'Does the shape of the jar change the count?', a: 'Only through its volume. A tall thin jar and a short wide jar of the same volume hold about the same number, though very narrow jars pack slightly less tightly near the walls.' },
    { q: 'How many Skittles fit in a quart jar?', a: 'About 1,220 Skittles fit in a 32 fl oz quart jar at 68% packing.' }
  ],
  related: ['cubic-inches-calculator', 'cylinder-volume-calculator', 'party-food-calculator', 'unit-price-calculator'],
  sources: [
    { name: 'Donev A. et al. (2004), Improving the Density of Jammed Disordered Packings Using Ellipsoids, Science 303:990', url: 'https://doi.org/10.1126/science.1093010' },
    { name: 'NIST: Unit conversion (volume)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' }
  ]
};
