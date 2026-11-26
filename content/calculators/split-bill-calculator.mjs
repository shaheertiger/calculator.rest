export default {
  slug: 'split-bill-calculator',
  hub: 'everyday',
  name: 'Split Bill Calculator',
  title: 'Split Bill Calculator: 60/40 of $3,600 = $2,160 and $1,440',
  meta: 'Take-home pay of $6,000 and $4,000 splits $3,600 of shared bills 60/40: $2,160 and $1,440. Split by income, 50/50 or equal leftover, with steps.',
  keyword: 'split bills by income calculator',
  also: ['bill split calculator', 'split bills proportionally to income', 'how to split bills with spouse calculator', '60/40 split calculator', 'split rent by income'],
  updated: '2026-11-26',
  answer: ({ r }) => `With take-home pay of $6,000 and $4,000, a 60/40 split of $3,600 in shared bills is <strong>${r.value}</strong>: multiply 3,600 by 0.60.`,
  inputs: [
    { id: 'bills', label: 'Shared bills to split', type: 'number', value: 3600, prefix: '$' },
    { id: 'incA', label: 'Person A take-home pay', type: 'number', value: 6000, prefix: '$' },
    { id: 'incB', label: 'Person B take-home pay', type: 'number', value: 4000, prefix: '$' },
    { id: 'method', label: 'How to split', type: 'select', value: 'income', options: [['income', 'In proportion to income'], ['equal', '50/50'], ['leftover', 'Equal money left over'], ['custom', 'Custom percentage']] },
    { id: 'pctA', label: 'Person A pays', type: 'number', value: 55, suffix: '%', showIf: { method: ['custom'] } }
  ],
  compute(v, H) {
    if (!(v.bills > 0)) return { error: 'Enter the total of the shared bills.' };
    var T = v.bills, a = v.incA > 0 ? v.incA : 0, b = v.incB > 0 ? v.incB : 0;
    var m = function (x) { return H.money(x); }, n = function (x) { return H.num(x, 2); };
    var steps = [], payA, share;
    if (v.method === 'equal') {
      payA = T / 2; share = 0.5;
      steps.push('<b>Formula:</b> Each pays = Bills ÷ 2');
      steps.push('<b>Substitute:</b> Each pays = ' + n(T) + ' ÷ 2');
      steps.push('<b>Divide:</b> ' + n(T) + ' ÷ 2 = ' + H.num(payA, 6));
    } else if (v.method === 'custom') {
      if (!(v.pctA >= 0 && v.pctA <= 100)) return { error: 'Enter Person A\'s share as a percent from 0 to 100.' };
      share = v.pctA / 100; payA = T * share;
      steps.push('<b>Formula:</b> A pays = Bills × (A\'s percent ÷ 100), and B pays = Bills − A pays');
      steps.push('<b>Substitute:</b> A pays = ' + n(T) + ' × (' + H.num(v.pctA, 4) + ' ÷ 100)');
      steps.push('<b>Turn the percent into a decimal:</b> ' + H.num(v.pctA, 4) + ' ÷ 100 = ' + H.num(share, 6));
      steps.push('<b>Multiply:</b> ' + n(T) + ' × ' + H.num(share, 6) + ' = ' + H.num(payA, 6));
    } else if (v.method === 'leftover') {
      if (!(a + b > 0)) return { error: 'Enter both take-home pays.' };
      var raw = (a - b + T) / 2;
      payA = Math.min(T, Math.max(0, raw)); share = payA / T;
      steps.push('<b>Formula:</b> A pays = (A\'s pay − B\'s pay + Bills) ÷ 2, and B pays = Bills − A pays');
      steps.push('<b>Substitute:</b> A pays = (' + n(a) + ' − ' + n(b) + ' + ' + n(T) + ') ÷ 2');
      steps.push('<b>Inside the brackets:</b> ' + n(a) + ' − ' + n(b) + ' + ' + n(T) + ' = ' + n(a - b + T));
      steps.push('<b>Divide:</b> ' + n(a - b + T) + ' ÷ 2 = ' + H.num(raw, 6) + (raw > T ? '. That is more than the bills, so A pays all ' + m(T) + '.' : raw < 0 ? '. That is below zero, so A pays nothing and B pays all ' + m(T) + '.' : ''));
    } else {
      if (!(a > 0) || !(b >= 0)) return { error: 'Enter both take-home pays to split by income.' };
      share = a / (a + b); payA = T * share;
      steps.push('<b>Formula:</b> A\'s share = A\'s pay ÷ (A\'s pay + B\'s pay), A pays = Bills × A\'s share, B pays = Bills − A pays');
      steps.push('<b>Substitute:</b> A\'s share = ' + n(a) + ' ÷ (' + n(a) + ' + ' + n(b) + ')');
      steps.push('<b>Add the incomes:</b> ' + n(a) + ' + ' + n(b) + ' = ' + n(a + b));
      steps.push('<b>Divide:</b> ' + n(a) + ' ÷ ' + n(a + b) + ' = ' + H.num(share, 6) + ', so A covers ' + H.pct(share * 100, 4) + ' and B covers ' + H.pct((1 - share) * 100, 4));
      steps.push('<b>Multiply:</b> ' + n(T) + ' × ' + H.num(share, 6) + ' = ' + H.num(payA, 6));
    }
    var pA = H.round(payA, 2), pB = H.round(T - pA, 2);
    var exact = Math.abs(payA - pA) < 1e-9;
    if (v.method !== 'equal') steps.push('<b>Subtract for B:</b> ' + n(T) + ' − ' + n(pA) + ' = ' + n(pB));
    if (v.method === 'income' && b > 0) steps.push('<b>Check:</b> ' + n(pA) + ' ÷ ' + n(a) + ' = ' + H.pct(pA / a * 100, 2) + ' and ' + n(pB) + ' ÷ ' + n(b) + ' = ' + H.pct(pB / b * 100, 2) + ' of pay, so both give the same share of what they earn.');
    if (v.method === 'leftover' && a + b > 0) steps.push('<b>Check:</b> A keeps ' + m(a - pA) + ' and B keeps ' + m(b - pB) + '.');
    steps.push('<b>Answer:</b> A pays ' + m(pA) + ' and B pays ' + m(pB) + (exact ? ' (exact to the cent, no rounding needed).' : ' (A\'s share rounded to the nearest cent; B pays the rest so the two add up to ' + m(T) + ').'));
    var rows = [['Person A pays', m(pA), true], ['Person B pays', m(pB), true], ['Split', H.pct(share * 100, 1) + ' / ' + H.pct((1 - share) * 100, 1)]];
    if (a > 0 && b > 0) rows.push(['Left after bills', m(a - pA) + ' / ' + m(b - pB)]);
    return { value: m(pA) + ' / ' + m(pB), label: 'Person A / Person B', rows: rows, steps: steps };
  },
  facts: {
    formula: 'A\'s share = A ÷ (A + B)<br>A pays = Bills × A\'s share<br>B pays = Bills − A pays<br>Equal leftover: A pays = (A − B + Bills) ÷ 2',
    vars: [['A, B', 'each person\'s monthly take-home pay (same basis for both)'], ['Bills', 'the total of the shared bills for the month'], ['A\'s share', 'a decimal between 0 and 1: 0.60 means A covers 60%']],
    rounding: 'Keep the share as a full decimal (0.583333…, not 58%) until you multiply, round A\'s payment to the nearest cent, then subtract from the total for B so the two always add up exactly.',
    note: 'Splitting by income is a ratio problem: the bills are divided in the ratio A : B, the same way you would share 10 marbles in the ratio 3 : 2.'
  },
  example: {
    h2: 'Worked example: $2,700 of bills on $5,200 and $2,800',
    html: `<p><strong>Problem:</strong> Ana takes home $5,200 a month and Ben $2,800. Their shared bills come to $2,700. If they split the bills in proportion to income, how much does each pay?</p>
<p><strong>1.</strong> Combined pay: 5,200 + 2,800 = 8,000.</p>
<p><strong>2.</strong> Ana's share: 5,200 ÷ 8,000 = 0.65, so Ana covers 65% and Ben 35%.</p>
<p><strong>3.</strong> Ana pays 2,700 × 0.65 = $1,755.</p>
<p><strong>4.</strong> Ben pays 2,700 − 1,755 = $945.</p>
<p><strong>Answer:</strong> Ana pays $1,755.00 and Ben pays $945.00. Sense check: 1,755 ÷ 5,200 and 945 ÷ 2,800 both equal 33.75%, so each gives up the same fraction of their pay, which is the whole point of a proportional split.</p>`
  },
  variants: [
    {
      h2: 'How do you split bills 60/40?',
      html: `<p>Multiply the total by 0.60 for one person and by 0.40 (or subtract) for the other. On $3,600 that is <strong>$2,160 and $1,440</strong>. A 60/40 split is what income-based math gives when one person earns 1.5 times the other: 6,000 ÷ (6,000 + 4,000) = 0.60. Pick "Custom percentage" above to split 55/45, 70/30 or any other ratio.</p>`
    },
    {
      h2: 'How do you split rent proportionally to income?',
      html: `<p>Divide each income by the combined income, then multiply the rent by that share. With $2,000 rent and take-home pay of $5,250 and $3,750, the combined pay is $9,000 and the first share is 5,250 ÷ 9,000 = 0.583333. So one person pays 2,000 × 0.583333 = <strong>$1,166.67</strong> and the other pays 2,000 − 1,166.67 = <strong>$833.33</strong>. Rounding the share to 58% first would give $1,160, which is $6.67 off.</p>`
    },
    {
      h2: 'What does an equal money left over split mean?',
      html: `<p>Both people end up with the same amount after the shared bills. The higher earner covers the gap in pay first, then the rest is shared evenly: A pays (A − B + Bills) ÷ 2. With $6,000 and $4,000 of pay and $3,600 of bills, A pays (6,000 − 4,000 + 3,600) ÷ 2 = <strong>$2,800</strong> and B pays <strong>$800</strong>, leaving each with $3,200. If the gap in pay is bigger than the bills, the higher earner pays them all.</p>`
    }
  ],
  mistakes: [
    '<strong>Dividing by the other person\'s pay.</strong> 6,000 ÷ 4,000 = 1.5 is the ratio of the two incomes, not a share. The share divides by the combined pay: 6,000 ÷ 10,000 = 0.60.',
    '<strong>Rounding the share too early.</strong> 5,250 ÷ 9,000 is 0.583333…, and 2,000 × 0.58 = $1,160 instead of $1,166.67. Keep the full decimal until the last step.',
    '<strong>Rounding both payments separately.</strong> If each amount is rounded on its own, the two can miss the total by a cent. Round one payment, then subtract it from the total for the other.',
    '<strong>Mixing gross and take-home pay.</strong> Using one person\'s salary before tax and the other\'s paycheck after tax changes the ratio. Use the same kind of number for both.'
  ],
  related: ['percentage-calculator', 'tip-calculator', 'average-calculator', 'party-food-calculator'],
  faq: [
    { q: 'Is a 50/50 split the same share of each paycheck?', a: 'Only when the two incomes are equal. Splitting $3,600 evenly is $1,800 each, which is 30% of $6,000 but 45% of $4,000.' },
    { q: 'How do you split bills by income between three people?', a: 'Divide each income by the total of all three, then multiply the bills by each share. With pay of $5,000, $3,000 and $2,000, the shares are 0.5, 0.3 and 0.2, so $1,500 of bills splits into $750, $450 and $300.' },
    { q: 'What if one person has no income?', a: 'An income-based split then puts all of the shared bills on the person with income, because their share is 100%. The math still works; whether that suits the household is up to the people in it.' },
    { q: 'Can I split a restaurant check with this?', a: 'For one check shared evenly with a tip, the tip calculator divides the total by the number of people. This page is for splitting a total unevenly, by income or a set percentage.' }
  ]
};
