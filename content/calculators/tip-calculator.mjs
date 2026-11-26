export default {
  slug: 'tip-calculator',
  hub: 'everyday',
  name: 'Tip Calculator',
  title: 'Tip Calculator: 20% Tip on $64 Is $12.80 (Split Any Bill)',
  h1: 'Tip Calculator: Work Out the Tip and Split the Bill',
  meta: 'A 20% tip on a $64 bill is $12.80, so the total is $76.80. Enter any bill, tip % and number of people to get the tip, total and each person\'s share.',
  keyword: 'how to calculate a 20 percent tip',
  also: ['tip calculator', 'how to calculate 20 percent tip', 'tip split calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'bill', label: 'Bill amount', type: 'number', value: 64, prefix: '$' },
    { id: 'tip', label: 'Tip', type: 'number', value: 20, suffix: '%' },
    { id: 'people', label: 'Split between', type: 'number', value: 1, suffix: 'people' },
    { id: 'round', label: 'Round', type: 'select', value: 'none', options: [['none', 'No rounding'], ['tip', 'Round tip up to $1'], ['total', 'Round total up to $1']] }
  ],
  compute(v, H) {
    if (!(v.bill > 0)) return { error: 'Enter the bill amount.' };
    if (!(v.tip >= 0)) return { error: 'Enter a tip percentage.' };
    var people = v.people >= 1 ? Math.floor(v.people) : 1;
    var tip = v.bill * v.tip / 100;
    if (v.round === 'tip') tip = Math.ceil(tip);
    var total = v.bill + tip;
    if (v.round === 'total') { total = Math.ceil(total); tip = total - v.bill; }
    var rows = [
      ['Total with tip', H.money(total), true],
      ['Effective tip rate', H.pct(tip / v.bill * 100, 1)]
    ];
    if (people > 1) {
      rows.push(['Tip per person', H.money(tip / people)]);
      rows.push(['Total per person', H.money(total / people), true]);
    }
    return {
      value: H.money(tip),
      label: 'Tip to leave',
      expr: H.money(v.bill) + ' × ' + H.num(v.tip, 2) + '%',
      rows: rows
    };
  },
  quick: ({ H }) => `To calculate a 20% tip, move the decimal one place left and double it. On a <strong>$64</strong> bill that is $6.40 × 2 = <strong>$12.80</strong>, for a total of <strong>$76.80</strong>. A 15% tip would be $9.60 and 18% would be $11.52. Split four ways, a 20% tip comes to $3.20 each.`,
  stepsTitle: 'How to calculate a tip',
  steps: [
    'Enter the bill before tax. Most etiquette guides, including the Emily Post Institute, base the tip on the pre-tax amount.',
    'Type the tip percentage. 15% is the minimum for table service in the U.S.; 18–20% is standard and 20% is the most common choice.',
    'Enter how many people are paying to see each person\'s share of the tip and the total.',
    'Choose a rounding option if you want an even number. Rounding the total up is the easiest way to leave cash.'
  ],
  formulaTitle: 'What is the formula for a tip?',
  formula: {
    expr: 'Tip = Bill × (Tip % ÷ 100)<br>Total = Bill + Tip<br>Per person = Total ÷ People',
    vars: [['Bill', 'pre-tax amount on the check'], ['Tip %', 'the percentage you want to leave'], ['People', 'number of people splitting the check']]
  },
  example: `<p>Four friends have a $148.50 dinner and want to leave 18%.</p><p>Tip = $148.50 × 0.18 = <strong>$26.73</strong>. Total = $148.50 + $26.73 = <strong>$175.23</strong>.</p><p>Each person pays $175.23 ÷ 4 = <strong>$43.81</strong>, of which $6.68 is tip.</p>`,
  table: {
    title: 'How much is a 15%, 18%, 20% and 25% tip?',
    intro: 'Tips on common bill amounts, worked out by the calculator above.',
    head: ['Bill', '15%', '18%', '20%', '25%'],
    rows: ({ run }) => [10, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250].map(b => ['$' + b, ...[15, 18, 20, 25].map(t => run({ bill: b, tip: t, people: 1, round: 'none' }).value)])
  },
  sections: [
    {
      h2: 'How do you calculate a 20% tip in your head?',
      html: `<p>Find 10% by moving the decimal point one place to the left, then double it. For a $47.60 bill, 10% is $4.76, so 20% is <strong>$9.52</strong>. Round the bill first if you want an easy number: $48 gives $4.80 × 2 = $9.60.</p><p>For 15%, take 10% and add half of it again: $4.76 + $2.38 = $7.14. For 25%, divide the bill by 4: $47.60 ÷ 4 = $11.90.</p>`
    },
    {
      h2: 'Should you tip on the total before or after tax?',
      html: `<p>Tip on the pre-tax amount. Sales tax is not part of the service, and the standard U.S. guidance is to base the tip on the subtotal. On a $64 meal with 8.875% New York City tax ($5.68), a 20% tip on the subtotal is $12.80; tipping on the taxed total would add $1.14.</p><p>If you used a coupon or a gift card, tip on the price <em>before</em> the discount: your server did the same work.</p>`
    },
    {
      h2: 'How much should you tip in 2026?',
      html: `<p>Common U.S. ranges:</p><ul><li><strong>Sit-down restaurant:</strong> 18–20%, 15% minimum, more for exceptional service or a large group.</li><li><strong>Bar:</strong> $1–2 per drink or 18–20% of the tab.</li><li><strong>Food delivery:</strong> 15–20%, at least $3–5, more in bad weather.</li><li><strong>Hair salon or barber:</strong> 20%.</li><li><strong>Taxi or rideshare:</strong> 15–20%.</li><li><strong>Counter service and tip screens:</strong> optional; 10% or a dollar or two is generous.</li></ul><p>Many restaurants add an automatic 18–20% service charge for parties of six or more, so check the bill before adding a tip.</p>`
    },
    {
      h2: 'How do you split a bill with tip between people?',
      html: `<p>Add the tip to the bill first, then divide by the number of people: (Bill + Tip) ÷ People. If people ordered very different amounts, work out each person's share of the subtotal and multiply it by 1 + the tip rate. Someone with a $32 order at 20% pays $32 × 1.20 = $38.40.</p>`
    }
  ],
  faq: [
    { q: 'How much is a 20% tip on $50?', a: 'A 20% tip on $50 is $10, making the total $60. Move the decimal one place ($5.00) and double it.' },
    { q: 'How much is a 15% tip on $100?', a: 'A 15% tip on $100 is $15. 10% is $10, and half of that again is $5, so $10 + $5 = $15.' },
    { q: 'What is 18% of a $75 bill?', a: '18% of $75 is $13.50, for a total of $88.50.' },
    { q: 'Is 15% still an acceptable tip?', a: 'Yes, 15% is still acceptable for adequate table service in the U.S., but 18–20% has become the norm, and 20% is the most common choice.' },
    { q: 'Do you tip on alcohol?', a: 'Yes. Drinks are part of the service, so include them in the amount you tip on. At a bar, $1–2 per drink is the usual alternative.' },
    { q: 'Should I tip if there is a service charge?', a: 'A service charge of 18–20% usually replaces the tip, though you can add a little extra for great service. Ask your server whether the charge goes to the staff.' },
    { q: 'How do I tip on a discounted meal?', a: 'Tip on the original price before the discount or coupon, because the server did the same amount of work.' }
  ],
  related: ['split-bill-calculator', 'discount-calculator', 'sales-tax-calculator', 'percentage-calculator'],
  sources: [
    { name: 'Emily Post Institute: General Tipping Guide', url: 'https://emilypost.com/advice/general-tipping-guide' },
    { name: 'IRS: Tip Recordkeeping and Reporting', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/tip-recordkeeping-and-reporting' }
  ]
};
