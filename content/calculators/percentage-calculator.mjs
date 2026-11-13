export default {
  slug: 'percentage-calculator',
  hub: 'math',
  name: 'Percentage Calculator',
  title: 'Percentage Calculator: 30% of 150 Is 45 (Plus 2 More Modes)',
  h1: 'Percent Calculator: Find X% of Y, What Percent X Is of Y, or the Whole',
  meta: '30% of 150 is 45: turn the percent into 0.30 and multiply. Solve all three percent questions (part, rate or whole) with steps, for homework, shopping or work.',
  keyword: 'how do you calculate percentage of a number',
  also: ['percentage calculator', 'do percentage calculator', 'how to find percentage of a number on a calculator', 'how to calculate 30 percent of a number', 'how to calculate 5 percent of a number', 'how to calculate percentage from 2 numbers', 'how to calculate percentage in google sheets', 'how to calculate percentages in google sheets', 'how to calculate total amount from percentage', 'how to calculate percentage of a total number', 'how to calculate percentages of amounts', 'how to calculate percentages calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Question', type: 'select', value: 'of', wide: true, options: [['of', 'What is X% of Y?'], ['what', 'X is what percent of Y?'], ['whole', 'X is Y% of what number?']] },
    { id: 'p', label: 'Percent (X)', type: 'number', value: 30, suffix: '%', showIf: { mode: ['of'] } },
    { id: 'n', label: 'Of the number (Y)', type: 'number', value: 150, showIf: { mode: ['of'] } },
    { id: 'part', label: 'Part (X)', type: 'number', value: 45, showIf: { mode: ['what'] } },
    { id: 'whole', label: 'Whole (Y)', type: 'number', value: 150, showIf: { mode: ['what'] } },
    { id: 'known', label: 'Known amount (X)', type: 'number', value: 45, showIf: { mode: ['whole'] } },
    { id: 'rate', label: 'Is this percent of the total (Y)', type: 'number', value: 30, suffix: '%', showIf: { mode: ['whole'] } }
  ],
  compute(v, H) {
    function f(x) {
      if (!isFinite(x)) return '—';
      var a = Math.abs(x);
      if (a !== 0 && (a < 1e-6 || a >= 1e15)) return H.sig(x, 6);
      return H.num(x, 6);
    }
    function frac(p) {
      // percent p -> reduced fraction p/100 (up to 4 decimals in p)
      var k = 0;
      while (k < 4 && Math.abs(p * Math.pow(10, k) - Math.round(p * Math.pow(10, k))) > 1e-9) k++;
      var num = Math.round(p * Math.pow(10, k)), den = 100 * Math.pow(10, k);
      if (Math.abs(p * Math.pow(10, k) - num) > 1e-9 || !num || den / H.gcd(num, den) > 1000) return '';
      var g = H.gcd(num, den);
      return (num / g) + '/' + (den / g);
    }
    var m = v.mode, res;
    if (m === 'what') {
      if (!isFinite(v.part) || !isFinite(v.whole)) return { error: 'Enter the part and the whole.' };
      if (v.whole === 0) return { error: 'The whole cannot be 0.' };
      res = v.part * 100 / v.whole;
      var rowsW = [['As a decimal', f(v.part / v.whole)]];
      if (Number.isInteger(v.part) && Number.isInteger(v.whole) && v.part !== 0) {
        var g = H.gcd(v.part, v.whole), sgn = (v.part < 0) !== (v.whole < 0) ? '−' : '';
        rowsW.push(['As a fraction', f(v.part) + '/' + f(v.whole) + (g > 1 ? ' = ' + sgn + (Math.abs(v.part) / g) + '/' + (Math.abs(v.whole) / g) : '')]);
      }
      rowsW.push(['Rest of the whole', H.pct(100 - res, 4) + ' (' + f(v.whole - v.part) + ')']);
      return {
        value: H.pct(res, 4),
        label: f(v.part) + ' is this percent of ' + f(v.whole),
        expr: f(v.part) + ' ÷ ' + f(v.whole) + ' × 100',
        rows: rowsW,
        sub: 'Steps: ' + f(v.part) + ' ÷ ' + f(v.whole) + ' = ' + f(v.part / v.whole) + ', then × 100 = ' + H.pct(res, 4) + '.' + (Math.abs(res) > 100 ? ' Over 100% means the part is bigger than the whole.' : '')
      };
    }
    if (m === 'whole') {
      if (!isFinite(v.known) || !isFinite(v.rate)) return { error: 'Enter the known amount and its percent.' };
      if (v.rate === 0) return { error: 'The percent cannot be 0: 0% of any number is 0.' };
      res = v.known * 100 / v.rate;
      return {
        value: f(res),
        label: 'The whole (100%)',
        expr: f(v.known) + ' ÷ ' + H.pct(v.rate, 4) + ' = ' + f(v.known) + ' ÷ ' + f(v.rate / 100),
        rows: [
          ['Check', H.pct(v.rate, 4) + ' of ' + f(res) + ' = ' + f(v.known)],
          ['The other ' + H.pct(100 - v.rate, 4), f(res - v.known)],
          ['1% of the whole', f(res / 100)]
        ],
        sub: 'Steps: ' + H.pct(v.rate, 4) + ' = ' + f(v.rate / 100) + ', then ' + f(v.known) + ' ÷ ' + f(v.rate / 100) + ' = ' + f(res) + '.'
      };
    }
    if (!isFinite(v.p) || !isFinite(v.n)) return { error: 'Enter a percent and a number.' };
    res = v.p * v.n / 100;
    var rows = [['Percent as a decimal', f(v.p / 100)]];
    var fr = frac(v.p);
    if (fr) rows.push(['Percent as a fraction', fr + ' of ' + f(v.n)]);
    rows.push([f(v.n) + ' increased by ' + H.pct(v.p, 4), f(v.n + res)]);
    rows.push([f(v.n) + ' decreased by ' + H.pct(v.p, 4), f(v.n - res)]);
    return {
      value: f(res),
      label: H.pct(v.p, 4) + ' of ' + f(v.n),
      expr: H.pct(v.p, 4) + ' × ' + f(v.n) + ' = ' + f(v.p / 100) + ' × ' + f(v.n),
      rows: rows,
      sub: 'Steps: ' + f(v.p) + ' ÷ 100 = ' + f(v.p / 100) + ', then ' + f(v.p / 100) + ' × ' + f(v.n) + ' = ' + f(res) + '.'
    };
  },
  quick: ({ r }) => `To calculate a percentage of a number, divide the percent by 100 and multiply: <strong>30% of 150 = 0.30 × 150 = ${r.value}</strong>. The same numbers answer the other two percent questions: 45 is 30% of 150 (45 ÷ 150 × 100), and if 45 is 30% of a total, the total is 45 ÷ 0.30 = 150. Switch the question above to solve any of the three.`,
  stepsTitle: 'How to calculate a percentage in 4 steps',
  steps: [
    'Decide which of the three questions you have. "What is 30% of 150?" asks for a <strong>part</strong>, "45 is what percent of 150?" asks for a <strong>rate</strong>, and "45 is 30% of what?" asks for the <strong>whole</strong>. Picking the wrong one is the mistake behind most wrong percentage answers.',
    'Type the percent as a plain number (30, not 0.30). The calculator divides by 100 for you.',
    'For a part, multiply the decimal by the whole. For a rate, divide the part by the whole and multiply by 100. For the whole, divide the part by the decimal.',
    'Sanity-check the answer: below 100%, the part must be smaller than the whole; 50% is exactly half; 10% is the number with the decimal point moved one place left.'
  ],
  formulaTitle: 'What are the three percentage formulas?',
  formula: {
    expr: 'Part = (Percent ÷ 100) × Whole<br>Percent = (Part ÷ Whole) × 100<br>Whole = Part ÷ (Percent ÷ 100)',
    vars: [['Part', 'the piece you have or want (45)'], ['Whole', 'the total that counts as 100% (150)'], ['Percent', 'the rate per hundred (30)']],
    note: 'All three are the same equation, Part = Rate × Whole, rearranged. "Of" in a word problem means multiply; "what percent" means divide the part by the whole.'
  },
  example: `<p><strong>Part:</strong> 18% of 2,450 survey responses said yes. 18 ÷ 100 = 0.18, and 0.18 × 2,450 = <strong>441 people</strong>.</p>
<p><strong>Rate:</strong> you answered 52 of 65 questions correctly. 52 ÷ 65 = 0.8, and 0.8 × 100 = <strong>80%</strong>.</p>
<p><strong>Whole:</strong> a $27 deposit is 15% of the price. 15% = 0.15, and $27 ÷ 0.15 = <strong>$180</strong>. Check: 0.15 × $180 = $27.</p>`,
  table: {
    title: 'What is 5%, 10%, 20%, 25%, 30% and 50% of a number?',
    intro: 'Common percentages of round numbers, each worked out by the calculator above. Read across for a number, or down a column to see the pattern.',
    head: ['Number', '5%', '10%', '15%', '20%', '25%', '30%', '50%'],
    rows: ({ run }) => [20, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250, 500, 1000].map(n => [String(n.toLocaleString('en-US')), ...[5, 10, 15, 20, 25, 30, 50].map(p => run({ mode: 'of', p, n }).value)]),
    note: 'Shortcuts hidden in the table: 5% is half of 10%, 15% is 10% plus 5%, 25% is a quarter, and 50% is a half.'
  },
  sections: [
    {
      h2: 'How do you calculate what percentage one number is of another?',
      html: `<p>Divide the part by the whole, then multiply by 100. If 18 of the 24 students in a class passed, 18 ÷ 24 = 0.75, so <strong>75%</strong> passed. The number after "of" (the class size) always goes on the bottom; swapping the two gives 24 ÷ 18 = 133%, which answers a different question.</p>
<p>The result can be more than 100% when the part is bigger than the whole. A team that sold 180 tickets against a goal of 150 hit 180 ÷ 150 × 100 = <strong>120%</strong> of its goal. If you want to know how much something grew or shrank from one value to another, that is a percent change, a different calculation covered by the <a href="/percentage-change-calculator">percentage change calculator</a>.</p>
<p>Two school versions of this question have their own tools: test marks (score ÷ points possible) in the <a href="/test-score-calculator">test score calculator</a> and days present ÷ school days in the <a href="/attendance-percentage-calculator">attendance percentage calculator</a>.</p>`
    },
    {
      h2: 'How do you find the total amount from a percentage?',
      html: `<p>Divide the amount you know by its percent written as a decimal. If $6.30 of sales tax is 7% of a purchase, the purchase was $6.30 ÷ 0.07 = <strong>$90</strong>. If 340 people is 85% of the seats in a hall, the hall holds 340 ÷ 0.85 = <strong>400</strong>.</p>
<p>Watch for totals that already include the percent. A $96.30 receipt with 7% tax built in is 107% of the pre-tax price, so divide by 1.07, not 0.07: $96.30 ÷ 1.07 = $90. Taking 7% off $96.30 instead gives $89.56, which is wrong by 44 cents because the tax was charged on $90, not on $96.30.</p>`
    },
    {
      h2: 'How do you calculate a percentage in your head?',
      html: `<p>Build every percentage from a few easy pieces:</p>
<ul>
<li><strong>10%:</strong> move the decimal point one place left. 10% of 380 is 38.</li>
<li><strong>1%:</strong> move it two places. 1% of 380 is 3.8, so 3% is 11.4.</li>
<li><strong>5%:</strong> half of 10%. 5% of 380 is 19.</li>
<li><strong>25% and 50%:</strong> divide by 4 or by 2. 25% of 380 is 95.</li>
<li><strong>Combinations:</strong> 35% = 25% + 10%, so 35% of 380 = 95 + 38 = 133. 15% = 10% + 5% = 38 + 19 = 57.</li>
</ul>
<p>The swap trick helps with awkward pairs: x% of y always equals y% of x. 8% of 50 looks hard, but 50% of 8 is obviously 4. Likewise 16% of 25 is 25% of 16, which is 4.</p>`
    },
    {
      h2: 'How do you find a percentage on a calculator?',
      html: `<p>The method that works on every calculator, including phones and graphing models such as the TI-84, is to convert the percent to a decimal yourself: for 30% of 150, type <code>0.3 × 150 =</code> and read 45. For "what percent", type <code>45 ÷ 150 × 100 =</code>.</p>
<p>Many basic and desk calculators also have a <strong>%</strong> key, and on most of them <code>150 × 30 %</code> displays 45. The key is less consistent for addition and subtraction: some models treat <code>150 + 30 %</code> as "150 plus 30% of 150" and show 195, while others show 150.3 or something else. Test your model with an easy case such as 10% of 100 before relying on the key for anything important.</p>`
    },
    {
      h2: 'How do you calculate percentages in Excel or Google Sheets?',
      html: `<p>Spreadsheets store 30% as the number 0.3, so the formulas mirror the three questions. With the whole in B2 and the percent or part in C2:</p>
<div class="twrap"><table><thead><tr><th>Question</th><th>Formula</th><th>Then</th></tr></thead><tbody>
<tr><td>What is 30% of 150?</td><td><code>=B2*C2</code> (C2 holds 30%)</td><td>Shows 45</td></tr>
<tr><td>45 is what % of 150?</td><td><code>=C2/B2</code></td><td>Format as percent to show 30%</td></tr>
<tr><td>45 is 30% of what?</td><td><code>=C2/D2</code> (D2 holds 30%)</td><td>Shows 150</td></tr>
<tr><td>Each row's share of a column total</td><td><code>=B2/SUM($B$2:$B$20)</code></td><td>Fill down, format as percent</td></tr>
</tbody></table></div>
<p>In Excel, format with Home › Percent Style or Ctrl+Shift+%. In Google Sheets, use Format › Number › Percent or the % button on the toolbar. Typing 30% into a cell stores 0.3 automatically; typing 30 into a cell you then format as a percentage displays 3000%, a common surprise. The dollar signs in <code>$B$2:$B$20</code> keep the total fixed when you copy the formula down.</p>`
    },
    {
      h2: 'How do you convert between percents, decimals and fractions?',
      html: `<p>To turn a percent into a decimal, divide by 100 (move the point two places left); to go back, multiply by 100. A fraction becomes a percent by dividing top by bottom and multiplying by 100. The pairs below come up constantly, so they are worth memorizing.</p>
<div class="twrap"><table><thead><tr><th>Percent</th><th>Decimal</th><th>Fraction</th></tr></thead><tbody>
<tr><td>1%</td><td>0.01</td><td>1/100</td></tr><tr><td>5%</td><td>0.05</td><td>1/20</td></tr><tr><td>10%</td><td>0.1</td><td>1/10</td></tr><tr><td>12.5%</td><td>0.125</td><td>1/8</td></tr><tr><td>20%</td><td>0.2</td><td>1/5</td></tr><tr><td>25%</td><td>0.25</td><td>1/4</td></tr><tr><td>33⅓%</td><td>0.333…</td><td>1/3</td></tr><tr><td>50%</td><td>0.5</td><td>1/2</td></tr><tr><td>66⅔%</td><td>0.666…</td><td>2/3</td></tr><tr><td>75%</td><td>0.75</td><td>3/4</td></tr><tr><td>150%</td><td>1.5</td><td>3/2</td></tr>
</tbody></table></div>
<p>For other fractions, the <a href="/fraction-calculator">fraction calculator</a> converts any fraction or mixed number to a decimal and back.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate 5 percent of a number?', a: 'Divide the number by 20, or take 10% and halve it. 5% of 380 is 380 ÷ 20 = 19.' },
    { q: 'How do you calculate 30 percent of a number?', a: 'Multiply the number by 0.3, or find 10% and triple it. 30% of 70 is 7 × 3 = 21.' },
    { q: 'What percent of 80 is 20?', a: '20 is 25% of 80, because 20 ÷ 80 = 0.25 and 0.25 × 100 = 25.' },
    { q: '15 is 20% of what number?', a: '15 is 20% of 75. Divide 15 by 0.20 to get 75; check it with 0.20 × 75 = 15.' },
    { q: 'Is 8% of 50 the same as 50% of 8?', a: 'Yes. x% of y always equals y% of x because both are x × y ÷ 100. Both come to 4, which makes the swap a handy mental-math shortcut.' },
    { q: 'How do I find what percentage each item is of a total?', a: 'Divide each item by the sum of all items and multiply by 100. In a $3,000 monthly budget, $1,200 of rent is 1,200 ÷ 3,000 = 40%. The shares should add up to 100%, give or take rounding.' },
    { q: 'Can a percentage be more than 100%?', a: 'Yes, whenever the part is larger than the whole. 180 out of a goal of 150 is 120%. A percentage of a quantity cannot be negative unless the quantity itself is negative.' },
    { q: 'How do I work out a percentage from marks?', a: 'Divide the marks you scored by the marks available and multiply by 100. 172 out of 200 is 172 ÷ 200 × 100 = 86%.' }
  ],
  related: ['percentage-change-calculator', 'fraction-calculator', 'discount-calculator', 'tip-calculator', 'test-score-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Percent', url: 'https://mathworld.wolfram.com/Percent.html' },
    { name: 'Khan Academy: Pre-algebra (percents, decimals and fractions)', url: 'https://www.khanacademy.org/math/pre-algebra' },
    { name: 'Microsoft Support: Calculate percentages in Excel', url: 'https://support.microsoft.com/en-us/excel/calculate-percentages' }
  ]
};
