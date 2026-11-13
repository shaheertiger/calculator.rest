export default {
  slug: 'unit-price-calculator',
  hub: 'everyday',
  name: 'Unit Price Calculator',
  title: 'Unit Price Calculator: 24 oz for $4.99 Is 20.8¢ per Ounce',
  h1: 'Price per Ounce Calculator: Compare Sizes and Find the Better Deal',
  meta: 'A 24 oz jar at $4.99 costs 20.8¢ an ounce; a 16 oz jar at $3.69 costs 23.1¢. Compare up to 10 items by price per ounce, pound, liter or piece.',
  keyword: 'how to calculate per ounce price',
  also: ['unit price calculator', 'price per ounce calculator', 'how to calculate price per piece', 'how to calculate price per liter', 'which is the better deal calculator', 'cost per ounce calculator'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'items', label: 'Items to compare', type: 'rows', addLabel: '+ add item', max: 10,
      fields: [
        { id: 'name', label: 'Item', type: 'text', value: '', blank: true, placeholder: 'e.g. Store brand' },
        { id: 'price', label: 'Price ($)', type: 'number', value: 3.99 },
        { id: 'qty', label: 'Packs', type: 'number', value: 1 },
        { id: 'size', label: 'Size each', type: 'number', value: 16 },
        { id: 'unit', label: 'Unit', type: 'select', value: 'oz', options: [['oz', 'oz (weight)'], ['lb', 'lb'], ['g', 'g'], ['kg', 'kg'], ['floz', 'fl oz'], ['ml', 'mL'], ['l', 'L'], ['qt', 'quart'], ['gal', 'gallon'], ['ct', 'count / pieces']] }
      ],
      value: [
        { name: '24 oz jar', price: 4.99, qty: 1, size: 24, unit: 'oz' },
        { name: '16 oz jar', price: 3.69, qty: 1, size: 16, unit: 'oz' },
        { name: '2 lb tub', price: 6.79, qty: 1, size: 2, unit: 'lb' }
      ]
    }
  ],
  data: {
    unit: {
      oz: ['w', 1], lb: ['w', 16], g: ['w', 0.03527396195], kg: ['w', 35.27396195],
      floz: ['v', 1], ml: ['v', 0.0338140227], l: ['v', 33.8140227], qt: ['v', 32], gal: ['v', 128],
      ct: ['c', 1]
    }
  },
  compute(v, H, D) {
    var items = [], fam = null, mixed = false;
    (v.items || []).forEach(function (it, i) {
      var u = D.unit[it.unit];
      if (!u || !(it.price > 0) || !(it.size > 0)) return;
      var q = it.qty > 0 ? it.qty : 1;
      var base = q * it.size * u[1];
      if (fam && fam !== u[0]) mixed = true;
      fam = fam || u[0];
      items.push({ name: it.name || 'Item ' + (i + 1), price: it.price, base: base, up: it.price / base, q: q, size: it.size, unit: it.unit });
    });
    if (!items.length) return { error: 'Enter a price and size for at least one item.' };
    if (mixed) return { error: 'Compare items measured the same way: all by weight, all by liquid volume, or all by count.' };
    var label = fam === 'w' ? 'oz' : fam === 'v' ? 'fl oz' : 'piece';
    var fmt = function (x) { return x < 0.995 ? H.fix(x * 100, 1) + '¢' : H.money(x); };
    var alt = function (x) { return fam === 'w' ? H.money(x * 16) + '/lb · ' + H.money(x * 3.527396195) + '/100 g' : fam === 'v' ? H.money(x * 33.8140227) + '/L' : H.money(x * 100) + ' per 100'; };
    var best = items[0], worst = items[0];
    items.forEach(function (it) { if (it.up < best.up) best = it; if (it.up > worst.up) worst = it; });
    var unitName = { oz: 'oz', lb: 'lb', g: 'g', kg: 'kg', floz: 'fl oz', ml: 'mL', l: 'L', qt: 'qt', gal: 'gal', ct: 'ct' };
    var rows = items.map(function (it) {
      return [H.esc(it.name), fmt(it.up) + '/' + label + ' <small>(' + alt(it.up) + ')</small>', it === best];
    });
    if (items.length > 1 && worst.up > best.up) {
      rows.push(['Best vs. priciest', H.pct((1 - best.up / worst.up) * 100, 1) + ' cheaper per ' + label]);
      rows.push(['Same amount as the best, priciest way', H.money(best.base * worst.up) + ' vs. ' + H.money(best.price)]);
    }
    return {
      value: fmt(best.up) + ' / ' + label,
      label: 'Best deal: ' + H.esc(best.name),
      expr: H.money(best.price) + ' ÷ ' + (best.q > 1 ? best.q + ' × ' : '') + H.num(best.size, 3) + ' ' + unitName[best.unit],
      rows: rows,
      sub: items.length > 1 ? (best === items.reduce(function (a, b) { return b.base > a.base ? b : a; }) ? 'The largest package is the best deal here.' : 'The largest package is not the cheapest per ' + label + ' here.') : 'Add another item to compare.'
    };
  },
  quick: ({ r }) => `To calculate price per ounce, divide the price by the number of ounces. A 24 oz jar at $4.99 is $4.99 ÷ 24 = <strong>${r.value.replace(' / oz', '')} per ounce</strong>; a 16 oz jar at $3.69 is 23.1¢, so the bigger jar is 9.8% cheaper. A 2 lb (32 oz) tub at $6.79 works out to 21.2¢, so the biggest package isn't the best deal.`,
  stepsTitle: 'How to compare prices per ounce',
  steps: [
    'Find each package\'s net quantity on the label (net wt. for solids, fl oz or mL for liquids, count for pieces). For multipacks, multiply: 6 cans × 12 fl oz = 72 fl oz.',
    'Convert to the same unit. 1 lb = 16 oz, 1 kg = 35.27 oz, 1 L = 33.81 fl oz. The calculator does this for you when you pick each item\'s unit.',
    'Divide the price by the quantity: $4.99 ÷ 24 oz = 20.8¢ per ounce.',
    'Compare the unit prices. The lowest is the better value, <strong>if you\'ll use it all</strong>. Food you throw away raises the real cost per ounce.'
  ],
  formulaTitle: 'What is the formula for unit price?',
  formula: {
    expr: 'Unit price = Price ÷ (Packs × Size per pack)<br>Price per lb = Price per oz × 16<br>Percent saved = 1 − (Cheaper unit price ÷ Pricier unit price)',
    vars: [['Price', 'shelf price for the whole package'], ['Packs × Size', 'total net quantity in one unit (oz, fl oz or count)']],
    note: 'Ounces (weight) and fluid ounces (volume) are different units. Water weighs about 1.04 oz per fl oz, but oils, syrups and cereals don\'t follow that, so compare weight with weight and volume with volume.'
  },
  example: `<p>Three sizes of the same peanut butter: 24 oz for $4.99, 16 oz for $3.69, and a 2 lb tub for $6.79.</p>
<p>24 oz: $4.99 ÷ 24 = <strong>20.8¢/oz</strong>. 16 oz: $3.69 ÷ 16 = <strong>23.1¢/oz</strong>. 2 lb = 32 oz: $6.79 ÷ 32 = <strong>21.2¢/oz</strong>.</p>
<p>The 24 oz jar wins. Buying 24 oz at the 16 oz jar's rate would cost 24 × 23.06¢ = $5.54, so the bigger jar saves 55¢ (9.8%).</p>`,
  table: {
    title: 'What is the price per ounce at common sizes and prices?',
    intro: 'Unit prices worked out by the calculator above. Find your package size and shelf price.',
    head: ['Size', '$1.99', '$2.99', '$3.99', '$4.99', '$6.99', '$9.99'],
    rows: ({ run }) => [6, 8, 10, 12, 16, 20, 24, 32, 48, 64].map(s => [s + ' oz', ...[1.99, 2.99, 3.99, 4.99, 6.99, 9.99].map(p => run({ items: [{ name: 'x', price: p, qty: 1, size: s, unit: 'oz' }] }).value.replace(' / oz', ''))]),
    note: 'Same idea for liquids: a 64 fl oz bottle at $3.99 is 6.2¢ per fl oz, or $2.11 per liter.'
  },
  sections: [
    {
      h2: 'How do you compare prices in different units, like ounces and pounds?',
      html: `<p>Convert everything to one unit first. The conversions you need at the store:</p>
<div class="twrap"><table><thead><tr><th>Unit</th><th>Equals</th></tr></thead><tbody>
<tr><td>1 pound (lb)</td><td>16 oz</td></tr>
<tr><td>1 kilogram (kg)</td><td>35.27 oz = 2.205 lb</td></tr>
<tr><td>100 grams</td><td>3.53 oz</td></tr>
<tr><td>1 liter (L)</td><td>33.81 fl oz</td></tr>
<tr><td>1 quart</td><td>32 fl oz</td></tr>
<tr><td>1 gallon</td><td>128 fl oz = 3.785 L</td></tr>
</tbody></table></div>
<p>Then the shortcuts: price per pound = price per ounce × 16, and price per liter = price per fl oz × 33.81. A cheese at $0.42 an ounce is $6.72 a pound, which is easy to compare with the deli counter's per-pound price.</p>`
    },
    {
      h2: 'Can you trust the unit price on the shelf tag?',
      html: `<p>Mostly, but check the units. There is no federal law requiring unit pricing in the U.S.; it is voluntary unless a state or city requires it. NIST's 2015 Unit Pricing Guide listed nine states plus the District of Columbia with mandatory rules (Connecticut, Maryland, Massachusetts, New Hampshire, New Jersey, New York, Oregon, Rhode Island and Vermont).</p>
<p>NIST's model Uniform Unit Pricing Regulation, published in Handbook 130, says all sizes of the same product should be unit priced in the same unit: per pound or ounce for weight, per quart, pint or fluid ounce (or liter or 100 mL) for liquids, per item or per 100 for counts. In practice, tags on one shelf sometimes mix "per oz" and "per count," or the tag is for a different size than the product above it. When in doubt, do the division yourself.</p>`
    },
    {
      h2: 'Is the bigger package always the better deal?',
      html: `<p>No. Larger sizes are usually cheaper per ounce, but not always. In the example above, the 2 lb tub costs more per ounce than the 24 oz jar. Common exceptions:</p>
<ul><li><strong>Sales and coupons</strong> on the smaller size can flip the comparison for a week.</li><li><strong>Multipacks and single-serve packs</strong> often cost more per ounce than one big container.</li><li><strong>Warehouse club sizes</strong> are usually cheaper but not always; compare with the grocery store's sale price.</li><li><strong>Waste</strong>: a bigger bag of salad at 20% less per ounce costs more in the end if a third of it spoils.</li></ul>`
    },
    {
      h2: 'How do you calculate price per piece, sheet or load?',
      html: `<p>For counted items, divide the price by the count. A 120-count box of diapers at $38.99 is 32.5¢ per diaper; an 84-count box at $28.49 is 33.9¢. Choose "count / pieces" as the unit.</p>
<p>Paper towels and toilet paper are tricky because sheet sizes differ between brands, so price per square foot is the fairer comparison. Laundry detergent is best compared per load, since concentration varies: $13.99 for 64 loads is 21.9¢ a load. Enter the number of loads as the count.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate price per ounce?', a: 'Divide the price by the number of ounces. A 24 oz jar at $4.99 is $4.99 ÷ 24 = 20.8¢ per ounce.' },
    { q: 'How do I convert price per ounce to price per pound?', a: 'Multiply by 16, because a pound is 16 ounces. 20.8¢ per ounce is $3.33 per pound.' },
    { q: 'How do I calculate price per liter?', a: 'Divide the price by the liters. A 2-liter bottle at $2.49 is $2.49 ÷ 2 = about $1.25 per liter. For a size in milliliters, divide the price by the mL and multiply by 1,000.' },
    { q: 'What is the difference between oz and fl oz on a label?', a: 'Ounces (oz, net wt.) measure weight and fluid ounces (fl oz) measure volume. Compare weight with weight and volume with volume; they only match for water-like liquids.' },
    { q: 'How do I calculate price per piece?', a: 'Divide the total price by the number of pieces. A 36-pack of water bottles at $5.99 is 16.6¢ per bottle.' },
    { q: 'Is unit pricing required by law?', a: 'Not federally. It is voluntary in most states; NIST\'s 2015 guide listed nine states and Washington, D.C., with mandatory unit pricing rules.' },
    { q: 'How do I compare a multipack with a single large item?', a: 'Multiply the number of packs by the size of each to get the total, then divide the price by that total. A 6-pack of 12 fl oz cans at $4.49 is 72 fl oz, or 6.2¢ per fl oz.' }
  ],
  related: ['discount-calculator', 'percentage-calculator', 'sales-tax-calculator', 'ratio-calculator'],
  sources: [
    { name: 'NIST Special Publication 1181: Unit Pricing Guide', url: 'https://doi.org/10.6028/NIST.SP.1181' },
    { name: 'NIST Handbook 130 (Uniform Unit Pricing Regulation), current edition', url: 'https://www.nist.gov/pml/owm/nist-handbook-130-current-edition' },
    { name: 'NIST: Unit conversion (U.S. customary and metric)', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' }
  ]
};
