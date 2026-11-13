export default {
  slug: 'pool-volume-calculator',
  hub: 'construction',
  name: 'Pool Volume Calculator',
  title: 'Pool Volume Calculator: a 16×32 ft Pool Holds 22,023 Gallons',
  h1: 'Pool Gallons Calculator for Rectangle, Round, Oval and Kidney Pools',
  meta: 'A 16 × 32 ft pool, 3.5 ft shallow and 8 ft deep, holds about 22,023 gallons (83,365 liters). Get any pool or pond\'s gallons and how long it takes to fill.',
  keyword: 'how to calculate how many gallons in a pool',
  also: ['how to calculate pool volume', 'how to calculate pool water volume', 'how calculate pool gallons', 'how to calculate swimming pool gallons', 'how to calculate pool capacity', 'how to calculate gallons in a pond', 'how to calculate pond gallons', 'how long to fill a pool calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'shape', label: 'Pool shape', type: 'select', value: 'rect', options: [['rect', 'Rectangle / square'], ['round', 'Round'], ['oval', 'Oval'], ['kidney', 'Kidney']] },
    { id: 'len', label: 'Length', type: 'number', value: 32, suffix: 'ft', showIf: { shape: ['rect', 'oval', 'kidney'] } },
    { id: 'wid', label: 'Width', type: 'number', value: 16, suffix: 'ft', showIf: { shape: ['rect', 'oval'] } },
    { id: 'diam', label: 'Diameter', type: 'number', value: 24, suffix: 'ft', showIf: { shape: ['round'] } },
    { id: 'a', label: 'Widest width (A)', type: 'number', value: 16, suffix: 'ft', showIf: { shape: ['kidney'] } },
    { id: 'b', label: 'Narrowest width (B)', type: 'number', value: 10, suffix: 'ft', showIf: { shape: ['kidney'] } },
    { id: 'shallow', label: 'Shallow-end water depth', type: 'number', value: 3.5, suffix: 'ft' },
    { id: 'deep', label: 'Deep-end water depth', type: 'number', value: 8, suffix: 'ft', help: 'Same as shallow for a flat bottom.' },
    { id: 'gpm', label: 'Hose flow for fill time', type: 'number', value: 10, suffix: 'gal/min', help: 'Time how long your hose takes to fill a 5-gallon bucket.' }
  ],
  compute(v, H) {
    var area, dims;
    if (v.shape === 'round') {
      if (!(v.diam > 0)) return { error: 'Enter the pool diameter.' };
      area = Math.PI * v.diam * v.diam / 4; dims = H.num(v.diam, 2) + ' ft round';
    } else if (v.shape === 'kidney') {
      if (!(v.len > 0) || !(v.a > 0) || !(v.b > 0)) return { error: 'Enter the length and the widest and narrowest widths.' };
      area = 0.45 * (v.a + v.b) * v.len; dims = '0.45 × (' + H.num(v.a, 2) + ' + ' + H.num(v.b, 2) + ') × ' + H.num(v.len, 2) + ' ft';
    } else {
      if (!(v.len > 0) || !(v.wid > 0)) return { error: 'Enter the length and width.' };
      area = v.shape === 'oval' ? Math.PI * v.len * v.wid / 4 : v.len * v.wid;
      dims = H.num(v.len, 2) + ' × ' + H.num(v.wid, 2) + ' ft' + (v.shape === 'oval' ? ' oval' : '');
    }
    if (!(v.shallow > 0)) return { error: 'Enter the water depth.' };
    var deep = v.deep > 0 ? v.deep : v.shallow;
    var avg = (v.shallow + deep) / 2;
    var cf = area * avg;
    var gal = cf * 1728 / 231;
    var rows = [
      ['Liters', H.int(gal * 3.785411784)],
      ['Cubic feet of water', H.int(cf)],
      ['Average depth', H.num(avg, 2) + ' ft'],
      ['Surface area', H.int(area) + ' sq ft'],
      ['Water weight', H.int(gal * 8.34) + ' lb (' + H.num(gal * 8.34 / 2000, 1) + ' tons)'],
      ['Chemical dose units', H.num(gal / 10000, 2) + ' × 10,000 gal']
    ];
    if (v.gpm > 0) rows.splice(1, 0, ['Time to fill at ' + H.num(v.gpm, 1) + ' gal/min', H.num(gal / v.gpm / 60, 1) + ' hours', true]);
    return {
      value: H.int(gal) + ' gal',
      label: 'Pool water volume',
      expr: H.num(area, 1) + ' sq ft × ' + H.num(avg, 2) + ' ft avg × 7.48',
      rows: rows,
      sub: 'Use the gallons, not the pool size, for every chemical dose; labels are written per 10,000 gallons.'
    };
  },
  quick: ({ r }) => `To calculate how many gallons are in a pool, multiply surface area by average depth to get cubic feet, then by 7.48 gallons per cubic foot. A 16 × 32 ft rectangular pool that runs from 3.5 to 8 ft deep averages 5.75 ft: 512 × 5.75 = 2,944 cu ft × 7.48 = <strong>${r.value}</strong>. For a round pool use diameter² × depth × 5.9.`,
  stepsTitle: 'How to calculate pool gallons',
  steps: [
    'Measure the length and width (or diameter) at the water line, not the outside of the coping or deck.',
    'Measure the water depth at the shallow and deep ends and average them: (shallow + deep) ÷ 2. Use water depth, not wall height; above-ground pools are usually filled about 6 in below the top. If the deep section is short and the floor is mostly shallow, measure depths at several points and average them all.',
    'Find the surface area: length × width for a rectangle, 0.785 × diameter² for a round pool, 0.785 × length × width for an oval, and 0.45 × (A + B) × length for a kidney.',
    'Multiply area × average depth for cubic feet, then × 7.48 for gallons (or × 28.3 for liters).',
    'Divide gallons by your hose flow in gallons per minute to estimate fill time.'
  ],
  formulaTitle: 'What is the formula for pool volume in gallons?',
  formula: {
    expr: 'Rectangle: L × W × D × 7.48<br>Round: Dia² × D × 5.9 &nbsp; Oval: L × W × D × 5.9<br>Kidney: (A + B) × L × 0.45 × D × 7.48',
    vars: [['L, W, Dia', 'length, width, diameter at the water line, ft'], ['D', 'average water depth, ft'], ['A, B', 'widest and narrowest widths of a kidney pool, ft'], ['7.48', 'U.S. gallons in one cubic foot (1,728 ÷ 231)']],
    note: '5.9 is 7.48 × π ÷ 4, the round-to-square conversion folded in. The kidney factor of 0.45 is the pool trade\'s standard approximation for that shape.'
  },
  example: `<p>An in-ground pool is 16 × 32 ft, with 3.5 ft of water at the shallow end and 8 ft at the deep end.</p>
<p>Average depth: (3.5 + 8) ÷ 2 = <strong>5.75 ft</strong>. Volume: 16 × 32 × 5.75 = <strong>2,944 cu ft</strong>.</p>
<p>Gallons: 2,944 × 7.48 = <strong>22,023 gallons</strong> (83,365 liters). That water weighs about 92 tons.</p>
<p>Filling with a hose that delivers 10 gallons a minute takes 22,023 ÷ 10 = 2,202 minutes, or about <strong>36.7 hours</strong>.</p>`,
  table: {
    title: 'How many gallons are in an above-ground pool?',
    intro: 'Round above-ground pools filled to 6 in below the top of the wall, calculated with diameter² × depth × 5.9.',
    head: ['Diameter', '48-in wall (42-in water)', '52-in wall (46-in water)', '54-in wall (48-in water)'],
    rows: ({ run }) => [12, 15, 18, 21, 24, 27, 30, 33].map(d => [d + ' ft', ...[42, 46, 48].map(w => run({ shape: 'round', diam: d, shallow: w / 12, deep: w / 12 }).value)]),
    note: 'For an oval above-ground pool, enter the length and width with the oval shape; an 18 × 33 ft oval with 48 in of water holds about 13,960 gallons.'
  },
  sections: [
    {
      h2: 'How do you calculate the gallons in a pond?',
      html: `<p>Ponds are rarely a neat shape, so treat them as the closest shape (oval or rectangle) and focus on getting a fair <strong>average depth</strong>. Take depth readings every few feet across the pond with a stick or tape and average them; a bowl-shaped pond that is 3 ft at the deepest point often averages only 1.5 to 2 ft. Then use length × width × average depth × 7.48 for a rectangle, or × 5.9 for an oval.</p>
<p>Example: an oval pond 12 × 8 ft with an average depth of 1.75 ft holds 12 × 8 × 1.75 × 5.9 ≈ 990 gallons. Pumps for koi ponds are usually sized to move the whole volume at least once an hour, so this pond needs a pump rated near 1,000 gal/h at its head height.</p>`
    },
    {
      h2: 'How long does it take to fill a pool?',
      html: `<p>Divide the gallons by the flow rate. Garden hoses vary widely with water pressure and hose diameter, so measure yours: time how many seconds it takes to fill a 5-gallon bucket, then gallons per minute = 300 ÷ seconds. A hose that fills the bucket in 30 seconds delivers 10 gal/min.</p>
<p>At 10 gal/min a 15,000-gallon pool takes 25 hours; two hoses on separate spigots roughly halve that if your pressure holds up. Bulk water delivered by truck is faster for big pools; ask the hauler how many gallons each load holds.</p>
<p>Water utilities bill in thousands of gallons or in CCF (100 cubic feet, or 748 gallons), so the cubic-feet figure above converts directly to your bill.</p>`
    },
    {
      h2: 'Why do you need to know your pool volume?',
      html: `<p>Every chemical dose is written per gallons of water: chlorine, shock, pH up and down, alkalinity increaser, stabilizer and salt. A pool that holds 22,000 gallons treated as if it held 15,000 gets about a third too little chlorine. Volume also sizes the pump and filter, which should circulate the whole pool at least once a day, and the heater.</p>
<p>Once you have the gallons, use the <a href="/pool-chlorine-calculator">pool chlorine calculator</a> to work out a dose.</p>`
    }
  ],
  faq: [
    { q: 'How many gallons is a 24-foot round pool?', a: 'A 24-ft round above-ground pool with 48 in of water holds about 13,500 gallons (24² × 4 × 5.9). With 52-in walls filled to 46 in it is about 13,000 gallons.' },
    { q: 'How many gallons are in a 15 x 30 pool?', a: 'A 15 × 30 ft rectangular pool with an average depth of 5 ft holds 15 × 30 × 5 × 7.48 = 16,831 gallons. At a flat 4 ft deep it holds 13,465 gallons.' },
    { q: 'How many gallons is a 12x24 pool?', a: 'A 12 × 24 ft rectangular pool averaging 4.5 ft deep holds about 9,700 gallons. As a 12 × 24 oval it holds about 7,600 gallons at the same depth.' },
    { q: 'How do I calculate the average depth of a pool?', a: 'Add the shallow and deep water depths and divide by 2. If the pool has a long shallow area and a small deep hopper, measure depths every few feet along the length and average all the readings instead.' },
    { q: 'How many gallons are in a cubic foot of water?', a: 'One cubic foot holds 7.48 U.S. gallons (1,728 cubic inches ÷ 231 cubic inches per gallon), or 28.32 liters.' },
    { q: 'How do I convert pool gallons to liters?', a: 'Multiply gallons by 3.785. A 22,023-gallon pool holds about 83,365 liters, or 83.4 cubic meters.' },
    { q: 'Does a hot tub use the same formula?', a: 'Yes, but measure the water inside the seats only roughly; most spas list their capacity, typically 300 to 500 gallons. Seats and footwells take up space, so a length × width × depth estimate overstates the water noticeably.' }
  ],
  related: ['pool-chlorine-calculator', 'tank-volume-calculator', 'cubic-feet-calculator', 'pipe-volume-calculator', 'square-footage-calculator'],
  sources: [
    { name: 'NIST Office of Weights and Measures: Handbook 44, Appendix C (1 gallon = 231 cubic inches)', url: 'https://www.nist.gov/pml/owm/owm-products-and-services/publications-and-documentary-standards/handbooks' },
    { name: 'CDC: Home pool and hot tub water treatment and testing', url: 'https://www.cdc.gov/healthy-swimming/about/home-pool-and-hot-tub-water-treatment-and-testing.html' },
    { name: 'Pool & Hot Tub Alliance (PHTA)', url: 'https://www.phta.org/' }
  ]
};
