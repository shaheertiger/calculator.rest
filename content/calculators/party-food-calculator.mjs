export default {
  slug: 'party-food-calculator',
  hub: 'everyday',
  name: 'Party Food Calculator',
  title: 'Party Food Calculator: 100 Pieces of Chicken for 50 Guests',
  h1: 'How Much Food for a Party? Meat, Sides, Salad and Drinks per Guest',
  meta: 'For 50 guests, plan about 100 pieces of bone-in chicken, 50 cups of salad, 12.5 lb of fruit and 200 drinks over 3 hours. Get a full list for any crowd.',
  keyword: 'how many pieces of chicken for 50 guests calculator',
  also: ['how much prime rib per person calculator', 'how much salad for 50 guests calculator', 'party food calculator', 'how much food for a party calculator', 'catering calculator per person'],
  updated: '2026-11-13',
  inputs: [
    { id: 'adults', label: 'Adults and teens', type: 'number', value: 50, suffix: 'guests' },
    { id: 'kids', label: 'Children under 12', type: 'number', value: 0, suffix: 'kids', help: 'Counted as about half an adult portion.' },
    { id: 'type', label: 'Type of party', type: 'select', value: 'meal', options: [['meal', 'Full meal (main + sides)'], ['apps', 'Appetizers only']] },
    { id: 'main', label: 'Main dish', type: 'select', value: 'chicken', options: [['chicken', 'Bone-in chicken pieces'], ['primerib', 'Prime rib (bone-in)'], ['pork', 'Pulled pork (bone-in shoulder)'], ['brisket', 'Brisket'], ['burgers', 'Burgers'], ['two', 'Chicken + pulled pork']], showIf: { type: ['meal'] } },
    { id: 'hours', label: 'Party length', type: 'number', value: 3, suffix: 'hours' }
  ],
  compute(v, H) {
    var a = v.adults > 0 ? Math.round(v.adults) : 0, k = v.kids > 0 ? Math.round(v.kids) : 0;
    if (!(a + k > 0)) return { error: 'Enter the number of guests.' };
    var hrs = v.hours > 0 ? v.hours : 3;
    var e = a + k * 0.5;
    var heads = a + k;
    var items = [], value, label, expr;
    var lb = function (x) { return H.num(x, 1) + ' lb'; };
    if (v.type === 'apps') {
      var pcs = Math.ceil(e * (6 + 4 * Math.max(0, hrs - 1)));
      value = H.int(pcs) + ' pieces'; label = 'Appetizer bites in total'; expr = H.num(e, 1) + ' adult portions × ' + H.num(6 + 4 * Math.max(0, hrs - 1), 1);
      items.push(['Appetizer bites', '6 first hour, 4 each hour after', H.int(pcs)]);
      items.push(['Kinds of appetizer', '6–8 for 50 guests', String(heads <= 20 ? 4 : heads <= 50 ? 6 : 8)]);
    } else {
      var m = v.main;
      var share = m === 'two' ? 0.6 : 1;
      if (m === 'chicken' || m === 'two') {
        var cp = Math.ceil(e * 2 * share);
        items.push(['Bone-in chicken', share < 1 ? '1.2 pieces' : '2 pieces', H.int(cp) + ' pieces (' + Math.ceil(cp / 8) + ' whole birds cut in 8)']);
        if (m === 'chicken') { value = H.int(cp) + ' pieces'; label = 'Pieces of bone-in chicken'; expr = H.num(e, 1) + ' adult portions × 2'; }
      }
      if (m === 'pork' || m === 'two') {
        var pr = e * 0.5 * share;
        items.push(['Pork shoulder, raw bone-in', share < 1 ? '0.3 lb' : '½ lb', lb(pr) + ' (≈ ' + lb(pr * 0.5) + ' cooked)']);
        if (m === 'pork') { value = lb(pr); label = 'Raw bone-in pork shoulder'; expr = H.num(e, 1) + ' × ½ lb'; }
      }
      if (m === 'two') { value = H.int(Math.ceil(e * 1.2)) + ' pcs + ' + lb(e * 0.3); label = 'Chicken pieces + raw pork shoulder'; expr = 'each meat at 60% of a full portion'; }
      if (m === 'primerib') {
        var r = e * 1;
        items.push(['Prime rib, bone-in, raw', '1 lb (1 rib per 2 people)', lb(r) + ' (' + Math.ceil(e / 2) + ' ribs)']);
        value = lb(r); label = 'Bone-in prime rib'; expr = H.num(e, 1) + ' × 1 lb';
      }
      if (m === 'brisket') {
        var b = e * 0.5;
        items.push(['Whole brisket, raw', '½ lb', lb(b) + ' (≈ ' + lb(b * 0.5) + ' cooked)']);
        value = lb(b); label = 'Raw brisket'; expr = H.num(e, 1) + ' × ½ lb';
      }
      if (m === 'burgers') {
        var bg = Math.ceil(e * 1.5);
        items.push(['Burger patties, ¼ lb', '1.5', H.int(bg) + ' patties (' + lb(bg / 4) + ' ground beef)']);
        items.push(['Buns', '1.5', H.int(bg)]);
        value = H.int(bg) + ' burgers'; label = 'Quarter-pound patties'; expr = H.num(e, 1) + ' × 1.5';
      }
      items.push(['Green salad', '1 cup', H.int(Math.ceil(e)) + ' cups (' + lb(e * 1.25 / 16) + ' greens)']);
      items.push(['Salad dressing', '2 tbsp', H.num(e * 2 / 16, 1) + ' cups']);
      items.push(['Hot sides (2–3 kinds)', '½ cup each', H.num(e * 0.5, 1) + ' cups of each side']);
      if (m !== 'burgers') items.push(['Rolls', '1.5', H.int(Math.ceil(e * 1.5))]);
      items.push(['Appetizers before the meal', '3–4 bites', H.int(Math.ceil(e * 4))]);
    }
    items.push(['Fruit', '4 oz (½ cup)', lb(e * 0.25)]);
    items.push(['Dessert', '1 slice or 2 cookies', H.int(Math.ceil(e)) + ' servings']);
    var drinks = Math.ceil(heads * (2 + Math.max(0, hrs - 1)));
    items.push(['Drinks', '2 first hour, 1 each hour after', H.int(drinks) + ' drinks']);
    items.push(['Ice', '1 lb', lb(heads) + ' (' + Math.ceil(heads / 10) + ' 10-lb bags)']);
    items.push(['Plates / napkins', '1.5 / 3', H.int(Math.ceil(heads * 1.5)) + ' / ' + H.int(heads * 3)]);
    return {
      value: value,
      label: label,
      expr: expr,
      rows: [['Guests', a + ' adults' + (k ? ' + ' + k + ' kids' : '')], ['Drinks', H.int(drinks), true], ['Fruit', lb(e * 0.25)]],
      table: { head: ['Item', 'Per adult', 'Total'], rows: items },
      sub: 'Planning amounts for a buffet. Add 10–15% if your crowd eats big or if it\'s the only meal of the day; cut back a little for a lunch or a hot afternoon.'
    };
  },
  quick: ({ r }) => `For 50 guests, plan 2 pieces of bone-in chicken per adult: <strong>${r.value}</strong>, or about 13 whole chickens cut into 8 pieces. Add 50 cups of salad (about 4 lb of greens), ½ cup of each side per person, 75 rolls and 12.5 lb of fruit. Over a 3-hour party, figure 200 drinks and 50 lb of ice. Prime rib instead? Plan 1 lb bone-in per person.`,
  stepsTitle: 'How to plan party food quantities',
  steps: [
    'Count adults and children separately. Kids under 12 eat roughly half an adult portion; teens eat like adults or more.',
    'Pick the format. A full meal needs a main, two or three sides, salad and bread; an appetizer-only party needs more bites per person and more variety.',
    'Size the main dish per adult: 2 bone-in chicken pieces, 1 lb bone-in prime rib, or ½ lb raw pork shoulder or brisket. <strong>Most common mistake:</strong> buying cooked weights as raw weights. Brisket and pork shoulder lose about half their weight cooking.',
    'Add drinks by the hour: 2 per guest in the first hour and 1 per hour after, plus about 1 lb of ice per guest.',
    'Round up and keep a backup (frozen rolls, extra chips) rather than buying 30% extra of everything.'
  ],
  formulaTitle: 'What are the per-person rules for party food?',
  formula: {
    expr: 'Total = (Adults + ½ × Kids) × Per-person amount<br>Drinks = Guests × (2 + Hours − 1)<br>Appetizers only = Guests × (6 + 4 × (Hours − 1)) bites',
    vars: [['Per-person amount', 'chicken 2 pieces · prime rib 1 lb bone-in · pork or brisket ½ lb raw · salad 1 cup · each side ½ cup · fruit 4 oz · rolls 1.5'], ['Hours', 'length of the party']],
    note: 'These are common catering rules of thumb for buffets, not official serving sizes. When two meats are served, each is cut to about 60% of a full portion because people take some of both.'
  },
  example: `<p>A 50-person graduation party serving fried chicken, potato salad, baked beans, green salad and rolls, running 3 hours.</p>
<p>Chicken: 50 × 2 = <strong>100 pieces</strong> (13 chickens cut in 8). Salad: 50 cups, about 3.9 lb of greens, with 6.3 cups of dressing. Each side: 50 × ½ cup = <strong>25 cups</strong> (about 1½ gallons). Rolls: 75. Fruit: 12.5 lb.</p>
<p>Drinks: 50 × (2 + 2) = <strong>200</strong>. Ice: 50 lb, or five 10-lb bags.</p>`,
  table: {
    title: 'How much food do you need for 10 to 150 guests?',
    intro: 'Full-meal quantities for adult guests at a 3-hour party, computed by the calculator above.',
    head: ['Guests', 'Chicken pieces', 'Prime rib (bone-in)', 'Pulled pork (raw)', 'Salad', 'Fruit', 'Drinks'],
    rows: ({ run }) => [10, 20, 25, 30, 40, 50, 75, 100, 150].map(g => {
      const c = run({ adults: g, kids: 0, type: 'meal', main: 'chicken', hours: 3 });
      const sal = c.table.rows.find(x => x[0] === 'Green salad')[2].split(' (')[0];
      return [String(g), c.value.replace(' pieces', ''), run({ adults: g, kids: 0, type: 'meal', main: 'primerib', hours: 3 }).value, run({ adults: g, kids: 0, type: 'meal', main: 'pork', hours: 3 }).value, sal, c.rows[2][1], c.rows[1][1]];
    }),
    note: 'Prime rib is bone-in raw weight (about one rib per two guests); pulled pork is raw bone-in shoulder, which cooks down to about half.'
  },
  sections: [
    {
      h2: 'How many pieces of chicken do you need for 50 people?',
      html: `<p>About <strong>100 pieces</strong> when chicken is the only main: 2 pieces per adult. That's 13 whole chickens cut into 8 pieces, or a 100-piece catering order. Go up to 2.5 pieces per person (125 pieces) for a hungry crowd or a mostly-wings-and-drumsticks mix, since those pieces are small.</p>
<p>If you're serving chicken alongside another meat, plan about 1.2 pieces per person (60 for 50 guests). For boneless chicken breasts or thighs, use about 6 oz raw per adult, which is roughly 19 lb for 50 people.</p>`
    },
    {
      h2: 'How much prime rib per person?',
      html: `<p>Plan <strong>1 lb of bone-in prime rib per person</strong> (raw weight), which works out to about one rib bone for every two guests. A 3-rib roast (about 6–7 lb) feeds 6, a 7-rib full roast about 14. For a boneless rib roast, ½ to ¾ lb per person is enough, because there's no bone weight.</p>
<p>Cook to temperature, not time. Beef roasts are safe at 145°F with a 3-minute rest, per the USDA; most people pull prime rib around 120–125°F for medium-rare and let carryover heat finish it, which is a quality choice below the USDA safe minimum.</p>`
    },
    {
      h2: 'How much salad and sides for 50 guests?',
      html: `<p>For green salad, plan about <strong>1 cup per person</strong>: 50 cups for 50 guests, which is roughly 4 lb of lettuce and 6 cups of dressing (2 tablespoons each). Pasta or potato salad served as a side runs about ½ cup per person, or 25 cups (just over 1½ gallons) for 50.</p>
<p>With 3 sides on a buffet, people take less of each, so ½ cup per side per person is plenty. Fruit trays go about 4 oz per person, or 12.5 lb for 50. The USDA Food Buying Guide, which school cafeterias use, lists exact yields if you need to convert pounds of raw produce to cups.</p>`
    },
    {
      h2: 'How long can party food sit out?',
      html: `<p>No more than <strong>2 hours</strong> at room temperature, or 1 hour above 90°F, according to the FDA and USDA. Keep hot foods at 140°F or above (chafing dishes or slow cookers) and cold foods at 40°F or below (bowls nested in ice).</p>
<p>For a party longer than 2 hours, put out smaller platters and swap them for fresh ones from the fridge or oven, rather than refilling the same dish. Cook chicken to 165°F and ground beef to 160°F.</p>`
    }
  ],
  faq: [
    { q: 'How many pieces of chicken for 50 guests?', a: 'About 100 pieces, at 2 pieces per adult. Plan 125 for a big-eating crowd or 60 if a second meat is served.' },
    { q: 'How much prime rib per person?', a: 'About 1 lb of bone-in prime rib per person, raw weight, or one rib for every two guests. Boneless needs ½ to ¾ lb per person.' },
    { q: 'How much salad for 50 guests?', a: 'About 50 cups of green salad, roughly 4 lb of greens, plus 6 cups of dressing.' },
    { q: 'How much pulled pork for 50 people?', a: 'About 25 lb of raw bone-in pork shoulder, which cooks down to roughly 12–13 lb of pulled meat, or 4 oz cooked per person.' },
    { q: 'How many appetizers per person?', a: 'Before a meal, 3–4 bites per person. For an appetizer-only party, 6 bites per person in the first hour and 4 per hour after, so 14 per person for 3 hours.' },
    { q: 'How many drinks per person at a party?', a: 'Plan 2 drinks per guest in the first hour and 1 per hour after. For 50 guests over 3 hours, that is 200 drinks, plus about 50 lb of ice.' },
    { q: 'How much food do kids eat at a party?', a: 'Children under about 12 eat roughly half an adult portion. The calculator counts each child as half an adult for food but as a full guest for drinks, ice and plates.' }
  ],
  related: ['candy-jar-calculator', 'split-bill-calculator', 'unit-price-calculator', 'tip-calculator'],
  sources: [
    { name: 'USDA Food and Nutrition Service: Food Buying Guide for Child Nutrition Programs', url: 'https://foodbuyingguide.fns.usda.gov/' },
    { name: 'FoodSafety.gov: Safe Minimum Internal Temperatures', url: 'https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures' },
    { name: 'FDA: Safe Food Handling', url: 'https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling' }
  ]
};
