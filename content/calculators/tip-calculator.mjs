export default {
  slug: 'tip-calculator',
  hub: 'everyday',
  name: 'Tip Calculator',
  title: 'Tip Calculator: 20% Tip on $50 = $10 (With Steps)',
  meta: 'A 20% tip on $50 is $10, so the check comes to $60: multiply the bill by 0.20. Work out any tip, add sales tax and split the check, with every step shown.',
  keyword: 'tip calculator',
  also: ['20 percent tip on $10', '20% tip on 250 calculator', '10 percent tip on $40 calculator', '15% tip on 13', 'tax and tip calculator', 'how much to tip waitress calculator'],
  updated: '2026-11-26',
  answer: ({ r }) => `A 20% tip on $50 is <strong>${r.value}</strong>: multiply 50 by 0.20, so the check comes to ${r.totalText} with the tip.`,
  inputs: [
    { id: 'bill', label: 'Bill before tax', type: 'number', value: 50, prefix: '$' },
    { id: 'tip', label: 'Tip', type: 'number', value: 20, suffix: '%' },
    { id: 'people', label: 'Split between', type: 'number', value: 1, suffix: 'people' },
    { id: 'addTax', label: 'Add sales tax to the total', type: 'checkbox', value: false },
    { id: 'tax', label: 'Sales tax rate', type: 'number', value: 8, suffix: '%', showIf: { addTax: ['true'] } }
  ],
  compute(v, H) {
    if (!(v.bill > 0)) return { error: 'Enter the bill amount.' };
    if (!(v.tip >= 0)) return { error: 'Enter a tip percentage (0 or more).' };
    var people = v.people >= 1 ? Math.floor(v.people) : 1;
    var useTax = v.addTax === true && v.tax > 0;
    var m = function (x) { return H.money(x); };
    var exact = function (x) { return Math.abs(x - H.round(x, 2)) < 1e-9; };
    var d = v.tip / 100, tipRaw = v.bill * d, tip = H.round(tipRaw, 2);
    var rounded = !exact(tipRaw);
    var steps = ['<b>Formula:</b> Tip = Bill × (Tip % ÷ 100), then Total = Bill' + (useTax ? ' + Tax' : '') + ' + Tip' + (people > 1 ? ', and Each person = Total ÷ People' : '')];
    steps.push('<b>Substitute:</b> Tip = ' + m(v.bill) + ' × (' + H.num(v.tip, 4) + ' ÷ 100)' + (useTax ? '. The tip is figured on the bill before tax.' : ''));
    steps.push('<b>Turn the percent into a decimal:</b> ' + H.num(v.tip, 4) + ' ÷ 100 = ' + H.num(d, 6));
    steps.push('<b>Multiply:</b> ' + H.num(v.bill, 2) + ' × ' + H.num(d, 6) + ' = ' + H.num(tipRaw, 6) + (rounded ? ', which rounds to ' + m(tip) : ', so the tip is ' + m(tip)));
    if (v.tip > 0) {
      var ten = v.bill / 10;
      steps.push('<b>Check in your head:</b> 10% of ' + m(v.bill) + ' is $' + H.num(ten, 4) + ' (move the decimal point one place left), and ' + H.num(v.tip, 4) + '% is ' + H.num(v.tip / 10, 4) + ' × $' + H.num(ten, 4) + ' = $' + H.num(ten * v.tip / 10, 4) + '.');
    }
    var tax = 0;
    if (useTax) {
      var taxRaw = v.bill * v.tax / 100; tax = H.round(taxRaw, 2);
      if (!exact(taxRaw)) rounded = true;
      steps.push('<b>Sales tax:</b> ' + H.num(v.bill, 2) + ' × ' + H.num(v.tax / 100, 6) + ' = ' + H.num(taxRaw, 6) + (exact(taxRaw) ? '' : ', which rounds to ' + m(tax)));
    }
    var total = v.bill + tax + tip;
    steps.push('<b>Add:</b> ' + m(v.bill) + (useTax ? ' + ' + m(tax) : '') + ' + ' + m(tip) + ' = ' + m(total));
    var each = total, rows = [['Total with tip', m(total), true]];
    if (useTax) rows.push(['Sales tax', m(tax)]);
    if (people > 1) {
      var eachRaw = total / people; each = H.round(eachRaw, 2);
      var line = '<b>Divide by ' + people + ' people:</b> ' + m(total) + ' ÷ ' + people + ' = ' + H.num(eachRaw, 6);
      if (!exact(eachRaw)) {
        rounded = true;
        var back = each * people;
        line += ', which rounds to ' + m(each) + '. Check: ' + people + ' × ' + m(each) + ' = ' + m(back) + (back > total + 1e-9 ? ', ' + m(back - total) + ' over, so the check is covered.' : back < total - 1e-9 ? ', ' + m(total - back) + ' short, so one person adds the difference.' : '.');
      }
      steps.push(line);
      rows.push(['Each person pays', m(each), true], ['Tip per person', m(tip / people)]);
    }
    steps.push('<b>Answer:</b> leave a ' + m(tip) + ' tip, for a total of ' + m(total) + (people > 1 ? ', or ' + m(each) + ' per person' : '') + (rounded ? ' (rounded to the nearest cent).' : ' (exact to the cent, no rounding needed).'));
    return { value: m(tip), label: 'Tip to leave', rows: rows, steps: steps, totalText: m(total) };
  },
  facts: {
    formula: 'Tip = Bill × (Tip % ÷ 100)<br>Total = Bill + Tax + Tip<br>Each person = Total ÷ People',
    vars: [['Bill', 'the food and drink subtotal, before sales tax'], ['Tip %', 'the percent you choose: 20 for 20%'], ['Tax', 'sales tax in dollars, added after the tip is worked out'], ['People', 'how many are sharing the check']],
    rounding: 'Work the tip at full precision, then round to the nearest cent. When a split share is not a whole number of cents, round it and check that the shares still add up to the total.',
    note: 'A tip is a percent of a number, so it is the same math as "20% of 50": the percent becomes a decimal and multiplies the bill.'
  },
  example: {
    h2: 'Worked example: four friends leave an 18% tip',
    html: `<p><strong>Problem:</strong> Four friends have a dinner that comes to $148.50 before tax. They want to leave 18% and split the check evenly. How much does each person pay?</p>
<p><strong>1.</strong> Turn the percent into a decimal: 18 ÷ 100 = 0.18.</p>
<p><strong>2.</strong> Tip = 148.50 × 0.18 = 26.73, so the tip is $26.73.</p>
<p><strong>3.</strong> Total = $148.50 + $26.73 = $175.23.</p>
<p><strong>4.</strong> Each share = $175.23 ÷ 4 = 43.8075, which rounds to $43.81.</p>
<p><strong>Answer:</strong> each friend pays $43.81. Sense check: 4 × $43.81 = $175.24, one cent more than the check, so the table is covered. And 18% sits a little under 20%, which would be about $29.70, so a $26.73 tip is in the right range.</p>`
  },
  variants: [
    {
      h2: 'What is a 20 percent tip on $10, $35, $150 or $250?',
      html: `<p>A 20% tip on $10 is <strong>$2.00</strong>, and on $250 it is <strong>$50.00</strong>. For any bill, find 10% by moving the decimal point one place left, then double it: 10% of $35 is $3.50, so 20% is $7.00.</p>
<div class="twrap"><table><thead><tr><th>Bill</th><th>20% tip</th><th>Total</th></tr></thead><tbody>
<tr><td>$10</td><td>$2.00</td><td>$12.00</td></tr><tr><td>$12</td><td>$2.40</td><td>$14.40</td></tr><tr><td>$35</td><td>$7.00</td><td>$42.00</td></tr><tr><td>$50</td><td>$10.00</td><td>$60.00</td></tr><tr><td>$150</td><td>$30.00</td><td>$180.00</td></tr><tr><td>$250</td><td>$50.00</td><td>$300.00</td></tr>
</tbody></table></div>`
    },
    {
      h2: 'What is a 10 percent tip on $40, or 15% on $13?',
      html: `<p>A 10% tip on $40 is <strong>$4.00</strong>: 40 × 0.10 = 4. A 15% tip on $13 is <strong>$1.95</strong>: 13 × 0.15 = 1.95. To get 15% without a calculator, take 10% ($1.30), add half of it again ($0.65), and you have $1.95. For 25%, divide the bill by 4.</p>`
    },
    {
      h2: 'How do you use a tax and tip calculator?',
      html: `<p>Work out the tip on the bill before tax, then add the tax and the tip to the bill. On an $80 bill with 8% sales tax and an 18% tip, the tax is 80 × 0.08 = <strong>$6.40</strong>, the tip is 80 × 0.18 = <strong>$14.40</strong>, and the total is $80.00 + $6.40 + $14.40 = <strong>$100.80</strong>. Tick "Add sales tax" above to see these steps for your own bill and local rate.</p>`
    }
  ],
  mistakes: [
    '<strong>Multiplying by the percent instead of the decimal.</strong> 50 × 20 = 1,000, not a tip. Divide 20 by 100 first: 50 × 0.20 = $10.',
    '<strong>Tipping on the total after tax.</strong> On a $50 bill with $4 of tax, 20% of $54 is $10.80, which tips 80 cents on the tax. The tip normally goes on the $50 subtotal.',
    '<strong>Splitting before adding the tip.</strong> Dividing the $148.50 bill by 4 gives $37.13 each, and the $26.73 tip is left unpaid. Add the tip first, then divide.',
    '<strong>Rounding each share down.</strong> $175.23 ÷ 4 is 43.8075. Paying $43.80 each leaves the table 3 cents short; round to $43.81.'
  ],
  related: ['split-bill-calculator', 'percentage-calculator', 'party-food-calculator'],
  faq: [
    { q: 'How much do you tip a waitress?', a: 'In the U.S., 15% to 20% of the bill before tax is the usual range for table service. On a $64 bill that is $9.60 at 15% or $12.80 at 20%.' },
    { q: 'Do you tip on the amount before or after tax?', a: 'Before tax. The tip is a percent of the food and drink subtotal, and the tax is added afterward. The calculator works it that way when you add sales tax.' },
    { q: 'How do I work out what percent I tipped?', a: 'Divide the tip by the bill and multiply by 100. A $9 tip on a $45 bill is 9 ÷ 45 × 100 = 20%.' },
    { q: 'How do I round a tip to a whole dollar?', a: 'Work out the exact tip first, then round up. A 20% tip on $47.60 is $9.52; leaving $10 makes the total $57.60 and the tip about 21%.' }
  ]
};
