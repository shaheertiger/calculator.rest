export default {
  slug: 'cubic-yards-to-tons-calculator',
  hub: 'construction',
  name: 'Cubic Yards to Tons Calculator',
  title: 'Cubic Yards to Tons Calculator: 10 Yd³ of Stone = 13.5 Tons',
  h1: 'Convert Cubic Yards to Tons (and Tons to Yards) by Material',
  meta: 'Convert cubic yards to tons, or tons to yards, for gravel, sand, soil, concrete, asphalt and mulch. 10 yd³ of crushed stone at 2,700 lb a yard is 13.5 tons.',
  keyword: 'how to convert cubic yards to tons calculator',
  also: ['how to calculate tons to cubic yards', 'how to convert tons to cubic yards calculator', 'how to calculate cubic yards into tons', 'how to calculate tonnage', 'how to calculate tons', 'how to calculate tonnes', 'how to calculate stone tonnage', 'how to calculate how much stone i need'],
  updated: '2026-11-13',
  inputs: [
    { id: 'dir', label: 'Convert', type: 'select', value: 'y2t', options: [['y2t', 'Cubic yards → tons'], ['t2y', 'Tons → cubic yards']] },
    { id: 'amount', label: 'Amount', type: 'number', value: 10, help: 'Cubic yards or tons, depending on the direction.' },
    { id: 'material', label: 'Material', type: 'select', value: 'crushed', options: [['crushed', 'Crushed stone / #57'], ['pea', 'Pea gravel'], ['crusherrun', 'Crusher run / road base'], ['river', 'River rock'], ['sand', 'Sand, dry'], ['topsoil', 'Topsoil'], ['fill', 'Fill dirt'], ['compost', 'Compost'], ['mulch', 'Wood or bark mulch'], ['concrete', 'Concrete, wet ready-mix'], ['asphalt', 'Asphalt, hot mix compacted'], ['water', 'Water (reference)'], ['custom', 'Custom density']] },
    { id: 'density', label: 'Custom density', type: 'number', value: 2500, suffix: 'lb/yd³', showIf: { material: ['custom'] } },
    { id: 'ton', label: 'Ton', type: 'select', value: 'short', options: [['short', 'U.S. short ton (2,000 lb)'], ['metric', 'Metric tonne (1,000 kg)']] }
  ],
  data: {
    lb: { crushed: 2700, pea: 2800, crusherrun: 3000, river: 2600, sand: 2700, topsoil: 2200, fill: 2100, compost: 1000, mulch: 600, concrete: 4050, asphalt: 3915, water: 1685 },
    name: { crushed: 'crushed stone', pea: 'pea gravel', crusherrun: 'crusher run', river: 'river rock', sand: 'dry sand', topsoil: 'topsoil', fill: 'fill dirt', compost: 'compost', mulch: 'mulch', concrete: 'wet concrete', asphalt: 'hot-mix asphalt', water: 'water', custom: 'your material' }
  },
  compute(v, H, D) {
    if (!(v.amount > 0)) return { error: 'Enter an amount greater than zero.' };
    var dens = v.material === 'custom' ? v.density : D.lb[v.material];
    if (!(dens > 0)) return { error: 'Enter a density in pounds per cubic yard.' };
    var tonLb = v.ton === 'metric' ? 2204.62262 : 2000;
    var unit = v.ton === 'metric' ? 'tonnes' : 'tons';
    var tPerYd = dens / tonLb;
    var rows = [['Density used', H.int(dens) + ' lb/yd³ (' + H.num(dens / 27, 1) + ' lb/cu ft)'], ['Tons per cubic yard', H.num(tPerYd, 3) + ' ' + unit], ['Cubic yards per ton', H.num(1 / tPerYd, 3) + ' yd³']];
    if (v.dir === 't2y') {
      var yd = v.amount / tPerYd;
      rows.unshift(['Cubic feet', H.num(yd * 27, 1) + ' cu ft']);
      rows.unshift(['Cubic meters', H.num(yd * 0.764554858, 2) + ' m³']);
      return { value: H.num(yd, 2) + ' yd³', label: 'Cubic yards of ' + D.name[v.material], expr: H.num(v.amount, 2) + ' ' + unit + ' × ' + H.int(tonLb) + ' ÷ ' + H.int(dens), rows: rows, n: yd, sub: 'Volume is loose, as delivered. Compacted material takes up less space.' };
    }
    var t = v.amount * tPerYd;
    rows.unshift(['Pounds', H.int(v.amount * dens) + ' lb']);
    rows.unshift([v.ton === 'metric' ? 'U.S. short tons' : 'Metric tonnes', H.num(v.amount * dens / (v.ton === 'metric' ? 2000 : 2204.62262), 2)]);
    return { value: H.num(t, 2) + ' ' + unit, label: 'Weight of ' + D.name[v.material], expr: H.num(v.amount, 2) + ' yd³ × ' + H.int(dens) + ' lb ÷ ' + H.int(tonLb), rows: rows, n: t, sub: 'Densities are typical loose values; moisture and supplier change them. Use the supplier\'s figure when you have it.' };
  },
  quick: ({ r }) => `To convert cubic yards to tons, multiply by the material's weight per cubic yard and divide by 2,000. Crushed stone weighs about 2,700 lb per yard, so 10 yd³ × 2,700 ÷ 2,000 = <strong>${r.value}</strong>. To go from tons to cubic yards, reverse it: 13.5 tons × 2,000 ÷ 2,700 = 10 yd³. Sand is about 1.35 tons per yard, topsoil 1.1 and mulch 0.3.`,
  stepsTitle: 'How to convert cubic yards to tons',
  steps: [
    'Find the material\'s density in pounds per cubic yard. Use your supplier\'s number if they publish one; otherwise use the typical value in the table below.',
    'Cubic yards to tons: multiply cubic yards by density, then divide by 2,000 (U.S. short ton) or by 2,204.6 for metric tonnes.',
    'Tons to cubic yards: multiply tons by 2,000 and divide by density.',
    'Allow for moisture. Wet sand and soil can weigh 10–20% more than dry, which is the mistake that makes a tonnage order come up short on volume.'
  ],
  formulaTitle: 'What is the formula to convert cubic yards to tons?',
  formula: {
    expr: 'Tons = cubic yards × density (lb/yd³) ÷ 2,000<br>Cubic yards = tons × 2,000 ÷ density (lb/yd³)<br>Density (lb/yd³) = density (lb/cu ft) × 27',
    vars: [['density', 'weight of one cubic yard of the material'], ['2,000', 'pounds in a U.S. short ton'], ['2,204.6', 'pounds in a metric tonne'], ['27', 'cubic feet in a cubic yard']]
  },
  example: `<p>A landscaper quotes 18 tons of dry sand for a paver base. How many cubic yards is that?</p>
<p>18 × 2,000 = 36,000 lb ÷ 2,700 lb per yard = <strong>13.33 yd³</strong>.</p>
<p>If the sand is damp and actually weighs 3,000 lb per yard, the same 18 tons is only 36,000 ÷ 3,000 = <strong>12 yd³</strong>, 10% less volume. When volume is what you need, ask the supplier to sell by the yard or to confirm the weight per yard.</p>`,
  table: {
    title: 'How many tons is a cubic yard of each material?',
    intro: 'Typical loose densities converted by the calculator in both directions. Values vary by supplier, moisture and gradation.',
    head: ['Material', 'lb per cu ft', 'lb per cubic yard', 'Tons per yd³', 'Yd³ per ton'],
    rows: ({ run, H, D }) => ['crushed', 'pea', 'crusherrun', 'river', 'sand', 'topsoil', 'fill', 'compost', 'mulch', 'concrete', 'asphalt', 'water'].map(m => {
      const a = run({ dir: 'y2t', amount: 1, material: m, ton: 'short' });
      const b = run({ dir: 't2y', amount: 1, material: m, ton: 'short' });
      const nm = D.name[m];
      return [nm.charAt(0).toUpperCase() + nm.slice(1), H.num(D.lb[m] / 27, 1), H.int(D.lb[m]), H.num(a.n, 2), H.num(b.n, 2)];
    }),
    note: 'Water (62.4 lb/cu ft) is included as a fixed reference point. Mulch and compost vary the most, from about 400 to 1,200 lb per yard.'
  },
  sections: [
    {
      h2: 'Why do different suppliers give different weights per yard?',
      html: `<p>A cubic yard is a fixed volume, but how much material fits in it changes with:</p>
<ul>
<li><strong>Moisture:</strong> water fills the gaps between grains. Damp sand or topsoil can be 10–20% heavier than dry, and you pay for that water when buying by the ton.</li>
<li><strong>Gradation:</strong> a mix of sizes (crusher run, with stone dust filling voids) packs denser than one-size stone (#57 or pea gravel).</li>
<li><strong>Rock type:</strong> granite, limestone and trap rock have different specific gravities, so their crushed stone weighs differently.</li>
<li><strong>Loose vs compacted:</strong> quarry densities are usually loose, as dumped. Compacted base can be 20–30% denser, so a ton fills less space after rolling.</li>
</ul>
<p>Quarries weigh every truck, so a tonnage price is exact for weight but approximate for volume. The yard volume you need for a job comes from the <a href="/gravel-calculator">gravel calculator</a> or <a href="/cubic-yards-calculator">cubic yards calculator</a>.</p>`
    },
    {
      h2: 'Short tons, long tons or metric tonnes: which does your supplier use?',
      html: `<p>U.S. quarries, landfills and asphalt plants use the short ton of 2,000 lb. A metric tonne is 1,000 kg, or 2,204.6 lb, about 10% heavier, and is used in Canada and most other countries; a long ton (2,240 lb) survives mainly in shipping. Mixing them up shifts the answer by 10%. Switch the ton type above to see both; 13.5 short tons of crushed stone is 12.25 metric tonnes.</p>
<p>In metric units the conversion is simpler still: tonnes = cubic meters × density in t/m³. One cubic yard is 0.7646 m³.</p>`
    },
    {
      h2: 'How many tons of material fit in a pickup or dump truck?',
      html: `<p>Trucks are limited by weight before volume for heavy materials. A cubic yard of crushed stone weighs about 1.35 tons, so a pickup with a 1,500 lb payload can carry only about half a yard of gravel, even though the bed would hold two yards of mulch. Check the payload on the door-jamb sticker of your truck or trailer, and divide by the weight per yard from the table to find how much it can safely haul. Delivery trucks are sized the same way; ask the supplier for the load limit per trip.</p>`
    }
  ],
  faq: [
    { q: 'How many tons are in a cubic yard of gravel?', a: 'About 1.35 to 1.5 tons. Crushed stone is roughly 1.35 tons (2,700 lb), pea gravel 1.4 tons and crusher run 1.5 tons per cubic yard.' },
    { q: 'How many cubic yards are in a ton of gravel?', a: 'About 0.74 cubic yards per ton of crushed stone (2,000 ÷ 2,700), or 0.71 for pea gravel.' },
    { q: 'How many tons is a yard of sand?', a: 'Dry sand weighs about 2,700 lb per cubic yard, or 1.35 tons. Damp sand is heavier.' },
    { q: 'How many tons is a yard of topsoil?', a: 'Roughly 1 to 1.1 tons (2,000–2,200 lb) when fairly dry; wet topsoil can be 1.3 tons or more.' },
    { q: 'How many tons in a cubic yard of concrete?', a: 'About 2 tons. Normal-weight concrete is roughly 150 lb per cubic foot, or 4,050 lb per cubic yard.' },
    { q: 'How do I convert tons to cubic yards?', a: 'Multiply tons by 2,000 and divide by the material\'s weight per cubic yard. 20 tons of crushed stone is 40,000 ÷ 2,700 = 14.81 cubic yards.' },
    { q: 'What is the difference between a ton and a tonne?', a: 'A U.S. ton is 2,000 lb; a metric tonne is 1,000 kg (2,204.6 lb). One short ton equals 0.907 tonnes.' }
  ],
  related: ['gravel-calculator', 'cubic-yards-calculator', 'asphalt-calculator', 'density-calculator', 'concrete-calculator'],
  sources: [
    { name: 'The Engineering ToolBox: Densities of common materials', url: 'https://www.engineeringtoolbox.com/density-materials-d_1652.html' },
    { name: 'The Engineering ToolBox: Dirt and mud densities', url: 'https://www.engineeringtoolbox.com/dirt-mud-densities-d_1727.html' },
    { name: 'NIST: Unit conversion (mass and volume)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' }
  ],
  disclaimer: 'Material densities are typical published values and vary by supplier, moisture and gradation.'
};
