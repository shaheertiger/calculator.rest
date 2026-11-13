export default {
  slug: 'circle-calculator',
  hub: 'math',
  name: 'Circle Calculator',
  title: 'Circle Calculator: 10-Inch Diameter = 5-Inch Radius, 78.54 in²',
  h1: 'Circle Calculator: Radius, Diameter, Circumference and Area From Any One',
  meta: 'A 10-inch circle has a 5-inch radius, a 31.4159-inch circumference and 78.5398 sq in of area. Enter any one measurement to get the other three, with formulas.',
  keyword: 'how do you calculate radius from diameter',
  also: ['circle calculator', 'how to calculate circumference to diameter', 'how to calculate diameter from circumference of a circle', 'radius calculator', 'circumference calculator', 'area of a circle calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'known', label: 'I know the', type: 'select', value: 'd', options: [['d', 'Diameter'], ['r', 'Radius'], ['c', 'Circumference'], ['a', 'Area']] },
    { id: 'val', label: 'Value', type: 'number', value: 10 },
    { id: 'unit', label: 'Unit', type: 'select', value: 'in', options: [['in', 'inches'], ['ft', 'feet'], ['yd', 'yards'], ['mm', 'millimeters'], ['cm', 'centimeters'], ['m', 'meters'], ['', 'no unit']] }
  ],
  compute(v, H) {
    var PI = Math.PI;
    if (!(v.val > 0)) return { error: 'Enter a measurement greater than 0.' };
    var u = v.unit ? ' ' + v.unit : '', u2 = v.unit ? ' ' + v.unit + '²' : ' sq units';
    function f(x) { return x >= 1e15 || x < 1e-6 ? H.sig(x, 8) : H.num(x, 4); }
    var r, how;
    if (v.known === 'r') { r = v.val; how = 'given'; }
    else if (v.known === 'c') { r = v.val / (2 * PI); how = 'r = C ÷ 2π = ' + f(v.val) + ' ÷ 6.2832'; }
    else if (v.known === 'a') { r = Math.sqrt(v.val / PI); how = 'r = √(A ÷ π) = √(' + f(v.val) + ' ÷ 3.1416)'; }
    else { r = v.val / 2; how = 'r = d ÷ 2 = ' + f(v.val) + ' ÷ 2'; }
    var d = 2 * r, c = 2 * PI * r, a = PI * r * r;
    var rows = [
      ['Radius (r)', f(r) + u, v.known !== 'r'],
      ['Diameter (d = 2r)', f(d) + u],
      ['Circumference (C = πd)', f(c) + u],
      ['Area (A = πr²)', f(a) + u2, v.known === 'r'],
      ['Semicircle area', f(a / 2) + u2],
      ['Arc length per 1°', f(c / 360) + u]
    ];
    if (v.unit === 'in') rows.push(['Area in square feet', f(a / 144) + ' ft²']);
    if (v.unit === 'ft') rows.push(['Area in square yards', f(a / 9) + ' yd²']);
    if (v.unit === 'cm') rows.push(['Area in square meters', f(a / 10000) + ' m²']);
    return v.known === 'r'
      ? { value: f(a) + u2, label: 'Area of the circle', expr: 'π × ' + f(r) + '²', rows: rows }
      : { value: f(r) + u, label: 'Radius', expr: how, rows: rows };
  },
  quick: ({ r }) => `The radius is half the diameter: r = d ÷ 2. A circle with a 10-inch diameter has a radius of <strong>${r.value}</strong>. From the same circle you get a circumference of π × 10 = 31.4159 inches and an area of π × 5² = 78.5398 square inches. Starting from circumference instead, divide by 2π (6.2832) to get the radius.`,
  stepsTitle: 'How to calculate radius from diameter (or any other measurement)',
  steps: [
    'Choose which measurement you have: diameter (straight across through the center), radius (center to edge), circumference (distance around) or area.',
    'Enter the value and pick a unit. The area comes back in the same unit squared.',
    'The calculator finds the radius first, then everything else from it: d = 2r, C = 2πr, A = πr².',
    'Check which measurement a formula wants. Plugging the diameter into πr² instead of the radius is the classic error and makes the area four times too big.'
  ],
  formulaTitle: 'What are the circle formulas?',
  formula: {
    expr: 'r = d ÷ 2 &nbsp;·&nbsp; d = 2r<br>C = 2πr = πd &nbsp;→&nbsp; r = C ÷ 2π<br>A = πr² = πd² ÷ 4 &nbsp;→&nbsp; r = √(A ÷ π)<br>A = C² ÷ 4π',
    vars: [['r', 'radius'], ['d', 'diameter'], ['C', 'circumference (perimeter)'], ['A', 'area'], ['π', '3.14159265…, the ratio of any circle\'s circumference to its diameter']]
  },
  example: `<p>A tree trunk measures 94.2 inches around at chest height. How wide is it?</p>
<p>Diameter = C ÷ π = 94.2 ÷ 3.14159 = <strong>29.98 inches</strong>, so the radius is about 14.99 inches.</p>
<p>The cross-section area is π × 14.99² ≈ <strong>706.1 sq in</strong>, or about 4.9 square feet (÷ 144).</p>`,
  table: {
    title: 'What are the radius, circumference and area of common circle sizes?',
    intro: 'Diameters in inches, computed by the calculator above. Pizza, pipe, tabletop and trampoline sizes all fall in this range.',
    head: ['Diameter', 'Radius', 'Circumference', 'Area'],
    rows: ({ run }) => [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 24, 36, 48].map(d => { const o = run({ known: 'd', val: d, unit: 'in' }); return [d + ' in', o.rows[0][1], o.rows[2][1], o.rows[3][1]]; }),
    note: 'Doubling the diameter doubles the circumference but quadruples the area: a 24-inch circle has four times the area of a 12-inch one.'
  },
  sections: [
    {
      h2: 'How do you calculate the diameter from the circumference?',
      html: `<p>Divide the circumference by π: d = C ÷ π. A pipe that measures 6.28 inches around is 6.28 ÷ 3.14159 = 2.0 inches across. Divide by 2π instead (6.28319) and you get the radius directly.</p>
<p>This is the easiest way to measure round things you cannot reach across: wrap a flexible tape around a tree, post, pipe or column and divide. Foresters measure tree diameter this way at 4.5 feet above the ground (diameter at breast height), often with a "diameter tape" that has the division by π printed on it. For the volume inside a pipe of that size, use the <a href="/pipe-volume-calculator">pipe volume calculator</a>.</p>`
    },
    {
      h2: 'How do you find the radius from the area?',
      html: `<p>Divide the area by π and take the square root: r = √(A ÷ π). A circular patio of 50 square feet has r = √(50 ÷ 3.14159) = √15.915 = <strong>3.99 feet</strong>, so it is just under 8 feet across.</p>
<p>Working the other way, the square feet of any round space is π × radius². A 12-foot round rug covers π × 6² = 113.1 sq ft. For rooms that combine circles with rectangles, the <a href="/square-footage-calculator">square footage calculator</a> adds the shapes together.</p>`
    },
    {
      h2: 'Is a 16-inch pizza really bigger than two 12-inch pizzas?',
      html: `<p>Not quite, but it is much bigger than one. Area grows with the square of the diameter, so a 16-inch pizza is (16 ÷ 12)² = 1.78 times the size of a 12-inch: 201.06 sq in against 113.10 sq in. Two 12-inch pizzas give 226.19 sq in, about 12% more than one 16-inch.</p>
<p>A 14-inch pizza (153.94 sq in) is 36% bigger than a 12-inch even though it is only 2 inches wider. To compare value, divide the price by the area in the table above.</p>`
    },
    {
      h2: 'How many digits of pi do you need?',
      html: `<p>For everyday measuring, 3.14 is within 0.05% of π and 22/7 within 0.04%: on a 10-inch circle either gives a circumference off by less than 2 hundredths of an inch. This calculator uses JavaScript's built-in value, which is accurate to about 15 decimal places.</p>
<p>That is also what NASA's Jet Propulsion Laboratory uses for its most precise interplanetary navigation, 3.141592653589793. In Excel and Google Sheets, <code>=PI()</code> returns the same 15-digit value, so the area of a circle with radius in A2 is <code>=PI()*A2^2</code>.</p>`
    }
  ],
  faq: [
    { q: 'Is the radius always half the diameter?', a: 'Yes. The diameter is two radii laid end to end through the center, so r = d ÷ 2 for every circle. A 10-inch diameter means a 5-inch radius.' },
    { q: 'What is the circumference of a circle with a 5 cm radius?', a: 'It is 2 × π × 5 = 31.42 cm. The diameter is 10 cm, and π × 10 gives the same answer.' },
    { q: 'How do you find the area from the circumference?', a: 'Use A = C² ÷ 4π. A circumference of 31.42 inches gives 31.42² ÷ 12.566 = 78.56 sq in, essentially the 78.54 sq in of a 10-inch circle (the difference is rounding in 31.42).' },
    { q: 'What is the formula for the area of a circle?', a: 'A = πr², pi times the radius squared. If you have the diameter, A = πd² ÷ 4.' },
    { q: 'How do you calculate the area of a circle in Excel?', a: 'Use =PI()*A2^2 with the radius in A2, or =PI()*(A2/2)^2 if A2 holds the diameter. Google Sheets uses the same formula.' },
    { q: 'How many degrees and radians are in a circle?', a: 'A full circle is 360°, or 2π radians (about 6.2832). One radian is the angle whose arc equals the radius, about 57.3°.' }
  ],
  related: ['cylinder-volume-calculator', 'square-footage-calculator', 'pipe-volume-calculator', 'right-triangle-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Circle', url: 'https://mathworld.wolfram.com/Circle.html' },
    { name: 'Wolfram MathWorld: Pi', url: 'https://mathworld.wolfram.com/Pi.html' },
    { name: 'NASA JPL Education: How Many Decimals of Pi Do We Really Need?', url: 'https://www.jpl.nasa.gov/edu/news/how-many-decimals-of-pi-do-we-really-need/' },
    { name: 'Microsoft Support: PI function', url: 'https://support.microsoft.com/en-us/office/pi-function-264199d0-a3ba-46b8-975a-c4a04608989b' }
  ]
};
