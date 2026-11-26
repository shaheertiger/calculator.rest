export default {
  slug: 'party-food-calculator',
  hub: 'everyday',
  name: 'Party Food Calculator',
  title: 'Party Food Calculator: 13 Whole Chickens Feed 50 People',
  meta: 'For 50 people, plan 2 pieces of chicken each: 100 pieces, or 13 whole chickens cut in 8. Per-person amounts for meat, sides and drinks, with steps.',
  keyword: 'how many whole chickens to feed 50 people',
  also: ['catering calculator per person', 'free catering food calculator usa', 'how much food for a party calculator', 'how many pieces of chicken for 50 guests', 'how much pulled pork for 50 people'],
  updated: '2026-11-26',
  answer: ({ r }) => `To feed 50 adults, plan 2 pieces of chicken each: 100 pieces, or <strong>${r.value}</strong> cut into 8 pieces.`,
  inputs: [
    { id: 'adults', label: 'Adults and teens', type: 'number', value: 50, suffix: 'guests' },
    { id: 'kids', label: 'Children under 12', type: 'number', value: 0, suffix: 'kids', help: 'Each child counts as half an adult portion.' },
    { id: 'main', label: 'Main dish', type: 'select', value: 'chicken', options: [['chicken', 'Bone-in chicken pieces'], ['pork', 'Pulled pork (raw bone-in shoulder)'], ['brisket', 'Brisket (raw)'], ['burgers', 'Burgers (quarter-pound)'], ['primerib', 'Prime rib (bone-in)']] },
    { id: 'hours', label: 'Party length', type: 'number', value: 3, suffix: 'hours' }
  ],
  compute(v, H) {
    var a = v.adults > 0 ? Math.round(v.adults) : 0, k = v.kids > 0 ? Math.round(v.kids) : 0;
    if (!(a + k > 0)) return { error: 'Enter the number of guests.' };
    if (!(v.hours > 0)) return { error: 'Enter how many hours the party lasts.' };
    var heads = a + k, e = a + k / 2, hrs = v.hours, n = function (x) { return H.num(x, 2); };
    var main = v.main, value, label, line1, answerBit, steps = [];
    var per = { chicken: 2, pork: 0.5, brisket: 0.5, burgers: 1.5, primerib: 1 }[main] || 2;
    var unit = { chicken: 'pieces', pork: 'lb raw', brisket: 'lb raw', burgers: 'patties', primerib: 'lb bone-in' }[main] || 'pieces';
    var formula = { chicken: 'Pieces = Portions × 2, Whole chickens = Pieces ÷ 8 (round up)', pork: 'Raw pork = Portions × ½ lb (round up to a whole pound), Cooked ≈ Raw × ½', brisket: 'Raw brisket = Portions × ½ lb (round up to a whole pound), Cooked ≈ Raw × ½', burgers: 'Patties = Portions × 1.5 (round up), Beef = Patties × ¼ lb', primerib: 'Prime rib = Portions × 1 lb, Rib bones = Portions ÷ 2 (round up)' }[main];
    steps.push('<b>Formula:</b> Portions = Adults + ½ × Kids; ' + formula + '; Drinks = Guests × (Hours + 1)');
    steps.push('<b>Substitute:</b> Portions = ' + a + ' + ½ × ' + k);
    steps.push('<b>Count the portions:</b> ' + (k ? '½ × ' + k + ' = ' + n(k / 2) + ', and ' : '') + a + ' + ' + n(k / 2) + ' = ' + n(e) + ' adult portions');
    var amt = e * per;
    steps.push('<b>Multiply:</b> ' + n(e) + ' × ' + n(per) + ' = ' + n(amt) + ' ' + unit);
    if (main === 'pork' || main === 'brisket') {
      var lb = Math.ceil(amt - 1e-9), what = main === 'pork' ? 'pork shoulder' : 'brisket';
      if (lb !== amt) steps.push('<b>Round up:</b> ' + n(amt) + ' lb → ' + lb + ' lb, because you buy whole pounds');
      steps.push('<b>Cooked yield:</b> ' + lb + ' × ½ = ' + n(lb / 2) + ' lb of meat after cooking (it loses about half its weight)');
      value = lb + ' lb ' + what; label = 'Raw ' + what + ' to buy'; line1 = ['Cooked meat', n(lb / 2) + ' lb'];
      answerBit = lb + ' lb of raw ' + what + (lb !== amt ? ' (rounded up to the next whole pound)' : ' (already a whole number of pounds)');
    } else if (main === 'burgers') {
      var p = Math.ceil(amt - 1e-9);
      if (p !== amt) steps.push('<b>Round up:</b> ' + n(amt) + ' → ' + p + ' patties');
      steps.push('<b>Ground beef:</b> ' + p + ' × ¼ lb = ' + n(p / 4) + ' lb, plus ' + p + ' buns');
      value = p + ' burgers'; label = 'Quarter-pound patties'; line1 = ['Ground beef', n(p / 4) + ' lb'];
      answerBit = p + ' burgers, ' + n(p / 4) + ' lb of beef' + (p !== amt ? ' (rounded up to whole patties)' : ' (whole patties, no rounding needed)');
    } else if (main === 'primerib') {
      var ribs = Math.ceil(e / 2 - 1e-9);
      steps.push('<b>Rib bones:</b> ' + n(e) + ' ÷ 2 = ' + n(e / 2) + (ribs !== e / 2 ? ', rounded up to ' + ribs : '') + ' ribs');
      value = n(amt) + ' lb prime rib'; label = 'Bone-in prime rib, raw'; line1 = ['Rib bones', String(ribs)];
      answerBit = n(amt) + ' lb of bone-in prime rib, about ' + ribs + ' ribs' + (ribs !== e / 2 ? ' (rounded up to whole bones)' : ' (no rounding needed)');
    } else {
      var birds = Math.ceil(amt / 8 - 1e-9);
      steps.push('<b>Divide by 8 pieces a bird:</b> ' + n(amt) + ' ÷ 8 = ' + n(amt / 8));
      if (birds !== amt / 8) steps.push('<b>Round up:</b> ' + n(amt / 8) + ' → ' + birds + ' whole chickens, which gives ' + birds + ' × 8 = ' + (birds * 8) + ' pieces');
      value = birds + (birds === 1 ? ' whole chicken' : ' whole chickens'); label = 'Whole chickens, each cut into 8'; line1 = ['Pieces needed', n(amt)];
      answerBit = value + ' for ' + n(amt) + ' pieces' + (birds !== amt / 8 ? ' (rounded up to whole birds)' : ' (no rounding needed)');
    }
    var drinks = Math.ceil(heads * (hrs + 1) - 1e-9);
    steps.push('<b>Drinks:</b> ' + heads + ' guests × (' + n(hrs) + ' + 1) = ' + n(heads * (hrs + 1)) + (drinks !== heads * (hrs + 1) ? ', rounded up to ' + drinks : '') + ' drinks' + (k ? ' (children count as full guests for drinks)' : ''));
    steps.push('<b>Answer:</b> buy ' + answerBit + ' and ' + drinks + ' drinks.');
    var rows = [line1, ['Green salad (1 cup each)', Math.ceil(e - 1e-9) + ' cups'], ['Each side dish (½ cup each)', n(e / 2) + ' cups'], [main === 'burgers' ? 'Buns' : 'Rolls (1.5 each)', String(main === 'burgers' ? Math.ceil(amt - 1e-9) : Math.ceil(e * 1.5 - 1e-9))], ['Drinks', String(drinks), true], ['Ice (1 lb a guest)', heads + ' lb, ' + Math.ceil(heads / 10) + ' ten-pound bags']];
    return { value: value, label: label, rows: rows, steps: steps };
  },
  facts: {
    formula: 'Portions = Adults + ½ × Kids<br>Amount = Portions × Per-person amount<br>Drinks = Guests × (Hours + 1)',
    vars: [['Portions', 'adult-sized servings: each child under 12 counts as half'], ['Per-person amount', 'chicken 2 pieces · pork or brisket ½ lb raw · burgers 1.5 · prime rib 1 lb bone-in · salad 1 cup · each side ½ cup · rolls 1.5'], ['Hours', 'how long the party runs: 2 drinks in the first hour, then 1 an hour']],
    rounding: 'Always round up to something you can buy: whole chickens, whole pounds, whole patties and whole drinks. Rounding down leaves guests without food.',
    note: 'The per-person amounts are common buffet planning rules, not official serving sizes. A hungry crowd or the only meal of the day calls for a little more.'
  },
  example: {
    h2: 'Worked example: burgers for 40 adults and 12 kids',
    html: `<p><strong>Problem:</strong> A graduation party has 40 adults and 12 children and runs 4 hours. Burgers are the main dish. How many quarter-pound patties, how much ground beef and how many drinks are needed?</p>
<p><strong>1.</strong> Portions: the 12 kids count as ½ × 12 = 6, so 40 + 6 = 46 adult portions.</p>
<p><strong>2.</strong> Patties: 46 × 1.5 = 69 burgers.</p>
<p><strong>3.</strong> Beef: 69 × ¼ lb = 17.25 lb of ground beef, plus 69 buns.</p>
<p><strong>4.</strong> Drinks: all 52 guests count, so 52 × (4 + 1) = 260 drinks.</p>
<p><strong>Answer:</strong> 69 patties, 17.25 lb of beef and 260 drinks. Sense check: 69 burgers for 52 people is about 1⅓ each, which fits a crowd where adults may take two and kids take one or less.</p>`
  },
  variants: [
    {
      h2: 'How many whole chickens to feed 50 people?',
      html: `<p>Plan <strong>13 whole chickens</strong> for 50 adults. At 2 pieces each, 50 people need 100 pieces, and a chicken cut into 8 pieces gives 100 ÷ 8 = 12.5 birds, which rounds up to 13 (104 pieces).</p>
<div class="twrap"><table><thead><tr><th>Adults</th><th>Pieces</th><th>Whole chickens</th><th>Drinks (3 hours)</th></tr></thead><tbody>
<tr><td>25</td><td>50</td><td>7</td><td>100</td></tr><tr><td>50</td><td>100</td><td>13</td><td>200</td></tr><tr><td>75</td><td>150</td><td>19</td><td>300</td></tr><tr><td>100</td><td>200</td><td>25</td><td>400</td></tr><tr><td>150</td><td>300</td><td>38</td><td>600</td></tr>
</tbody></table></div>`
    },
    {
      h2: 'Catering calculator per person: how much food for each guest?',
      html: `<p>Multiply each per-person amount by the number of adult portions. For a buffet, the usual amounts per adult are 2 pieces of bone-in chicken, ½ lb of raw pork shoulder or brisket, 1.5 quarter-pound burgers, or 1 lb of bone-in prime rib; then 1 cup of green salad, ½ cup of each side dish, 1.5 rolls, and 2 drinks in the first hour plus 1 for each hour after. For 50 adults that is 50 cups of salad, 25 cups of each side and 75 rolls.</p>`
    },
    {
      h2: 'How much pulled pork for 50 people?',
      html: `<p>Buy about <strong>25 lb of raw bone-in pork shoulder</strong>: 50 × ½ lb = 25 lb. Shoulder loses about half its weight to bone, fat and moisture as it cooks, so 25 lb raw gives roughly 12.5 lb of pulled pork. That is 12.5 × 16 = 200 ounces, or 4 ounces of cooked meat per person.</p>`
    }
  ],
  mistakes: [
    '<strong>Rounding the chickens down.</strong> 100 ÷ 8 = 12.5, and buying 12 birds gives 96 pieces, so two guests go without. Round food up, never down.',
    '<strong>Counting children as full adults, or skipping them.</strong> 12 kids under 12 eat about 6 adult portions. Counting them as 12 overbuys; leaving them out underbuys.',
    '<strong>Mixing up raw and cooked weight.</strong> A recipe asking for 12.5 lb of pulled pork means buying about 25 lb of raw shoulder, not 12.5 lb.',
    '<strong>Giving every hour the same number of drinks.</strong> 50 guests × 3 hours = 150 drinks misses the thirsty first hour. Guests × (Hours + 1) gives 200.'
  ],
  related: ['tip-calculator', 'split-bill-calculator', 'percentage-calculator', 'average-calculator'],
  faq: [
    { q: 'How many pieces of chicken for 100 people?', a: 'About 200 pieces at 2 per adult, which is 200 ÷ 8 = 25 whole chickens cut into 8 pieces each.' },
    { q: 'How much salad do I need for 50 people?', a: 'About 50 cups of green salad at 1 cup per person. Served as a side, pasta or potato salad runs ½ cup each, or 25 cups for 50 people.' },
    { q: 'How many drinks per person for a party?', a: 'Hours + 1. Guests drink about 2 in the first hour and 1 an hour after, so a 4-hour party needs 5 drinks per guest.' },
    { q: 'How much prime rib per person?', a: 'About 1 lb of bone-in prime rib per person, raw weight, or one rib bone for every two guests. For 20 guests that is 20 lb and 10 ribs.' }
  ]
};
