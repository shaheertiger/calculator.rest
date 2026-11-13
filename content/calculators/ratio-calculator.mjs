export default {
  slug: 'ratio-calculator',
  hub: 'math',
  name: 'Ratio Calculator',
  title: 'Ratio Calculator: 45:60 Simplifies to 3:4 (Solve and Split Too)',
  h1: 'Ratio Calculator: Simplify Ratios, Solve Proportions and Split Amounts',
  meta: '45:60 simplifies to 3:4 because both terms divide by 15. Simplify 2- or 3-part ratios, solve A:B = C:x, or split an amount in a ratio, with steps and Excel formulas.',
  keyword: 'how do i calculate ratios',
  also: ['ratio calculator', 'how do i calculate ratios in excel', 'how do you calculate ratios in excel', 'how to calculate a ratio in excel', 'how to calculate ratios in excel', 'how to calculate ratio scale', 'proportion calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What to do', type: 'select', value: 'simplify', wide: true, options: [['simplify', 'Simplify a ratio'], ['solve', 'Solve a proportion A : B = C : x'], ['share', 'Split an amount in a ratio']] },
    { id: 'a', label: 'First term (A)', type: 'number', value: 45, showIf: { mode: ['simplify', 'share'] } },
    { id: 'b', label: 'Second term (B)', type: 'number', value: 60, showIf: { mode: ['simplify', 'share'] } },
    { id: 'c3', label: 'Third term (optional)', type: 'number', value: '', placeholder: 'for A : B : C', showIf: { mode: ['simplify', 'share'] } },
    { id: 'total', label: 'Amount to split', type: 'number', value: 600, showIf: { mode: ['share'] } },
    { id: 'pa', label: 'A', type: 'number', value: 3, showIf: { mode: ['solve'] } },
    { id: 'pb', label: 'B', type: 'number', value: 4, showIf: { mode: ['solve'] } },
    { id: 'pc', label: 'C', type: 'number', value: 15, showIf: { mode: ['solve'] } }
  ],
  compute(v, H) {
    function f(x) { var a = Math.abs(x); return a !== 0 && (a < 1e-6 || a >= 1e15) ? H.sig(x, 8) : H.num(x, 4); }
    if (v.mode === 'solve') {
      if (![v.pa, v.pb, v.pc].every(isFinite)) return { error: 'Enter A, B and C.' };
      if (v.pa === 0) return { error: 'A cannot be 0 in A : B = C : x.' };
      var x = v.pb * v.pc / v.pa;
      return {
        value: f(x), label: 'x in ' + f(v.pa) + ' : ' + f(v.pb) + ' = ' + f(v.pc) + ' : x',
        expr: 'x = ' + f(v.pb) + ' × ' + f(v.pc) + ' ÷ ' + f(v.pa),
        rows: [['Cross-multiply', f(v.pa) + ' × x = ' + f(v.pb) + ' × ' + f(v.pc) + ' = ' + f(v.pb * v.pc)], ['Scale factor', '× ' + f(v.pc / v.pa)], ['Check', f(v.pa) + ' ÷ ' + f(v.pb) + ' = ' + f(v.pa / v.pb) + ' and ' + f(v.pc) + ' ÷ ' + f(x) + ' = ' + f(x === 0 ? NaN : v.pc / x)]]
      };
    }
    var t = [v.a, v.b];
    if (isFinite(v.c3)) t.push(v.c3);
    if (!t.every(function (q) { return isFinite(q) && q > 0; })) return { error: 'Enter positive numbers for each term.' };
    var sum = t.reduce(function (s, q) { return s + q; }, 0);
    var lbl = t.map(f).join(' : ');
    if (v.mode === 'share') {
      if (!isFinite(v.total)) return { error: 'Enter the amount to split.' };
      var parts = t.map(function (q) { return v.total * q / sum; });
      return {
        value: parts.map(f).join(' : '), label: f(v.total) + ' split in the ratio ' + lbl,
        expr: f(v.total) + ' ÷ ' + f(sum) + ' parts = ' + f(v.total / sum) + ' per part',
        rows: parts.map(function (p, i) { return ['Share ' + 'ABC'.charAt(i) + ' (' + f(t[i]) + ' parts)', f(p) + ' (' + H.pct(t[i] / sum * 100, 2) + ')']; })
      };
    }
    var k = 0;
    while (k < 6 && t.some(function (q) { return Math.abs(q * Math.pow(10, k) - Math.round(q * Math.pow(10, k))) > 1e-9; })) k++;
    var ints = t.map(function (q) { return Math.round(q * Math.pow(10, k)); });
    var exact = t.every(function (q) { return Math.abs(q * Math.pow(10, k) - Math.round(q * Math.pow(10, k))) <= 1e-9; }) && ints.every(function (q) { return q < 9e15; });
    var steps = [], rows = [], simp;
    if (exact) {
      if (k > 0) steps.push(['Multiply every term by ' + Math.pow(10, k).toLocaleString('en-US') + ' to clear decimals', ints.map(function (q) { return q.toLocaleString('en-US'); }).join(' : ')]);
      var g = ints.reduce(function (s, q) { return H.gcd(s, q); });
      steps.push(['Greatest common factor', g.toLocaleString('en-US')]);
      simp = ints.map(function (q) { return (q / g).toLocaleString('en-US'); }).join(' : ');
      steps.push(['Divide every term by ' + g.toLocaleString('en-US'), simp]);
    } else simp = '1 : ' + t.slice(1).map(function (q) { return f(q / t[0]); }).join(' : ');
    rows.push(['As 1 : n', '1 : ' + t.slice(1).map(function (q) { return f(q / t[0]); }).join(' : ')]);
    if (t.length === 2) {
      rows.push(['As n : 1', f(t[0] / t[1]) + ' : 1']);
      rows.push(['A as a fraction of B', f(t[0] / t[1])]);
    }
    rows.push(['Share of the total', t.map(function (q) { return H.pct(q / sum * 100, 2); }).join(' : ')]);
    var out = { value: simp, label: 'Simplest form of ' + lbl, expr: lbl + ' = ' + simp, rows: rows };
    if (steps.length) out.table = { head: ['Step', 'Work'], rows: steps };
    return out;
  },
  quick: ({ r }) => `To calculate a ratio in simplest form, divide every term by the largest number that goes into all of them. 45 and 60 share a greatest common factor of 15, so 45 : 60 = <strong>${r.value}</strong>. In other words, for every 3 of the first there are 4 of the second: 42.86% and 57.14% of the total.`,
  stepsTitle: 'How to calculate a ratio',
  steps: [
    'Write the quantities in the same unit and in the order the question asks. 2 feet to 8 inches is 24 : 8, not 2 : 8. Mixing units is the usual ratio error.',
    'Clear decimals or fractions by multiplying every term by the same number (1.5 : 2.5 becomes 15 : 25).',
    'Divide every term by their greatest common factor to get the simplest whole-number ratio.',
    'For a proportion A : B = C : x, cross-multiply and divide: x = B × C ÷ A. To split an amount, divide it by the total number of parts and multiply by each term.'
  ],
  formulaTitle: 'What are the ratio formulas?',
  formula: {
    expr: 'A : B = (A ÷ GCF) : (B ÷ GCF)<br>A : B = C : x &nbsp;→&nbsp; x = B × C ÷ A<br>Share of A = Total × A ÷ (A + B)',
    vars: [['A, B', 'the terms of the ratio, in order'], ['GCF', 'greatest common factor of all terms'], ['x', 'the unknown term in a proportion']],
    note: 'A ratio compares parts with each other; a fraction compares a part with the whole. 3 : 4 means the first part is 3/7 of the total, not 3/4.'
  },
  example: `<p>A recipe serving 4 uses 300 g of pasta. How much for 7 people?</p>
<p>Set up the proportion 4 : 300 = 7 : x. Cross-multiply: 4x = 300 × 7 = 2,100, so x = 2,100 ÷ 4 = <strong>525 g</strong>.</p>
<p>Splitting instead: $600 shared in the ratio 2 : 3 is 5 parts of $120, so the shares are <strong>$240 and $360</strong>.</p>`,
  table: {
    title: 'What do common ratios simplify to?',
    intro: 'Screen sizes, photo crops, scores and mixes, simplified by the calculator above.',
    head: ['Ratio', 'Simplest form', 'As 1 : n', 'Share of total'],
    rows: ({ run }) => [[1920, 1080], [1280, 1024], [1080, 1350], [12, 18], [45, 60], [250, 1000], [36, 48], [1.5, 2.5], [0.75, 2], [150, 200, 250]].map(t => { const o = run({ mode: 'simplify', a: t[0], b: t[1], c3: t.length > 2 ? t[2] : NaN }); return [t.map(x => x.toLocaleString('en-US')).join(' : '), o.value, o.rows[0][1], o.rows[o.rows.length - 1][1]]; }),
    note: '1920 × 1080 (Full HD) is the familiar 16 : 9 widescreen shape, and 1080 × 1350 is the 4 : 5 portrait crop used on social feeds.'
  },
  sections: [
    {
      h2: 'How do you simplify a ratio with decimals or fractions?',
      html: `<p>Turn every term into a whole number first, by multiplying all of them by the same thing. 1.5 : 2.5 times 10 is 15 : 25, which simplifies to <strong>3 : 5</strong>. For fractions, multiply by the common denominator: ½ : ¾ times 4 is 2 : 3.</p>
<p>Three-part ratios work the same way. 150 : 200 : 250 all divide by 50, giving 3 : 4 : 5. Enter a third term in the calculator to simplify A : B : C. For more practice with common factors, see the <a href="/fraction-calculator">fraction calculator</a>, which simplifies the same way.</p>`
    },
    {
      h2: 'How do you split an amount in a given ratio?',
      html: `<p>Add the terms to get the number of parts, divide the amount by that, then multiply by each term. $600 in the ratio 2 : 3 is 5 parts of $120, so <strong>$240 and $360</strong>. 90 split 1 : 2 : 3 is 6 parts of 15: 15, 30 and 45.</p>
<p>Mixing instructions are ratios of parts too. Concentrate mixed 1 : 3 with water is 4 parts in total, so a 2-liter bottle needs 0.5 L of concentrate and 1.5 L of water. For lab solutions defined by concentration, use the <a href="/dilution-calculator">dilution calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate ratios in Excel or Google Sheets?',
      html: `<p>To show a simplified ratio from two whole numbers in A2 and B2, divide each by their greatest common divisor and join them with a colon:</p>
<p><code>=A2/GCD(A2,B2)&amp;":"&amp;B2/GCD(A2,B2)</code></p>
<p>With 45 and 60 this returns 3:4. GCD works on integers only (Excel truncates decimals), so multiply decimal data by 10 or 100 first. For an "n to 1" style ratio, use <code>=ROUND(A2/B2,2)&amp;":1"</code>, which returns 0.75:1. Google Sheets accepts both formulas unchanged.</p>`
    },
    {
      h2: 'How does a scale ratio work on maps and models?',
      html: `<p>A scale ratio says how many real units one unit on the map or model stands for. On a 1 : 24,000 USGS topographic map, 1 inch equals 24,000 inches, which is 2,000 feet. A 1 : 24 model of a 15-foot car is 180 inches ÷ 24 = <strong>7.5 inches</strong> long.</p>
<p>To find a real distance, multiply the measured distance by the second number; to build a model, divide the real size by it. Areas scale by the square of the ratio, so a 1 : 24 model covers 1/576 of the real footprint.</p>`
    }
  ],
  faq: [
    { q: 'What is the difference between a ratio and a fraction?', a: 'A ratio compares parts with each other (3 boys : 4 girls), while a fraction compares a part with the whole (3/7 of the class are boys). Add the ratio terms to get the whole.' },
    { q: 'How do you convert a ratio to a percentage?', a: 'Divide each term by the sum of the terms and multiply by 100. 3 : 4 has 7 parts, so the shares are 3/7 = 42.86% and 4/7 = 57.14%.' },
    { q: 'What does a 1:3 ratio mean?', a: 'One part of the first item for every three parts of the second, four parts in all. In a 1:3 mix the first ingredient is 25% of the total.' },
    { q: 'How do you solve for x in a ratio?', a: 'Cross-multiply. For 3 : 4 = 15 : x, 3x = 4 × 15 = 60, so x = 20.' },
    { q: 'How do you compare two ratios?', a: 'Convert each to a single number (A ÷ B) or to the form 1 : n. 5 : 8 = 0.625 and 3 : 5 = 0.6, so 5 : 8 has relatively more of the first quantity.' },
    { q: 'Can a ratio have decimals?', a: 'Yes, ratios such as 1 : 1.5 are common, but they are usually scaled to whole numbers for the simplest form: 1 : 1.5 = 2 : 3.' }
  ],
  related: ['fraction-calculator', 'percentage-calculator', 'unit-price-calculator', 'dilution-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Ratio', url: 'https://mathworld.wolfram.com/Ratio.html' },
    { name: 'Microsoft Support: GCD function', url: 'https://support.microsoft.com/en-us/office/gcd-function-d5107a51-69e3-461f-8e4c-ddfc21b5073a' },
    { name: 'USGS: Topographic map scales', url: 'https://www.usgs.gov/faqs/what-are-scales-topographic-maps' }
  ]
};
