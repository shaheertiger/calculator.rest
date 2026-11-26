export default {
  slug: 'percentage-calculator',
  hub: 'everyday',
  name: 'Percentage Calculator',
  title: 'Percentage Calculator: 30% of 150 = 45 (With Steps)',
  meta: '30% of 150 is 45: turn 30% into 0.30 and multiply by 150. Find a percent of a number, what percent one number is of another, or the whole, with steps.',
  keyword: 'percentage calculator',
  also: ['150 x 0.30', 'what percent of 30 is 4', '30 percent of', 'how to find the percentage of a number'],
  updated: '2026-11-26',
  answer: ({ r }) => `30% of 150 is <strong>${r.value}</strong>: multiply 150 by 0.30.`,
  inputs: [
    { id: 'mode', label: 'Question', type: 'select', value: 'of', wide: true, options: [['of', 'What is X% of Y?'], ['what', 'X is what percent of Y?'], ['whole', 'X is Y% of what number?']] },
    { id: 'p', label: 'Percent (X)', type: 'number', value: 30, suffix: '%', showIf: { mode: ['of'] } },
    { id: 'n', label: 'Of the number (Y)', type: 'number', value: 150, showIf: { mode: ['of'] } },
    { id: 'part', label: 'Part (X)', type: 'number', value: 4, showIf: { mode: ['what'] } },
    { id: 'whole', label: 'Whole (Y)', type: 'number', value: 30, showIf: { mode: ['what'] } },
    { id: 'known', label: 'Known amount (X)', type: 'number', value: 45, showIf: { mode: ['whole'] } },
    { id: 'rate', label: 'It is this percent of the whole (Y)', type: 'number', value: 30, suffix: '%', showIf: { mode: ['whole'] } }
  ],
  compute(v, H) {
    function f(x) { return H.num(x, 10); }
    function out(x, dp) {
      var r = H.round(x, dp);
      return { s: H.num(r, dp), note: Math.abs(r - x) < 1e-12 ? 'exact, no rounding needed' : 'rounded to ' + dp + ' decimal places' };
    }
    var m = v.mode;
    if (m === 'what') {
      if (!isFinite(v.part) || !isFinite(v.whole)) return { error: 'Enter the part and the whole.' };
      if (v.whole === 0) return { error: 'The whole cannot be 0: you cannot divide by zero.' };
      var d = v.part / v.whole, pc = out(d * 100, 2);
      return {
        value: pc.s + '%',
        label: f(v.part) + ' is this percent of ' + f(v.whole),
        steps: [
          '<b>Formula:</b> Percent = (Part ÷ Whole) × 100',
          '<b>Substitute:</b> Percent = (' + f(v.part) + ' ÷ ' + f(v.whole) + ') × 100. The number after "of" (' + f(v.whole) + ') is the whole, so it goes on the bottom.',
          '<b>Divide:</b> ' + f(v.part) + ' ÷ ' + f(v.whole) + ' = ' + H.num(d, 6),
          '<b>Multiply by 100:</b> ' + H.num(d, 6) + ' × 100 = ' + H.num(d * 100, 6),
          '<b>Answer:</b> ' + f(v.part) + ' is ' + pc.s + '% of ' + f(v.whole) + ' (' + pc.note + ').'
        ]
      };
    }
    if (m === 'whole') {
      if (!isFinite(v.known) || !isFinite(v.rate)) return { error: 'Enter the known amount and its percent.' };
      if (v.rate === 0) return { error: 'The percent cannot be 0: 0% of any number is 0.' };
      var dec = v.rate / 100, w = out(v.known / dec, 2);
      return {
        value: w.s,
        label: f(v.known) + ' is ' + f(v.rate) + '% of this number',
        steps: [
          '<b>Formula:</b> Whole = Part ÷ (Percent ÷ 100)',
          '<b>Substitute:</b> Whole = ' + f(v.known) + ' ÷ (' + f(v.rate) + ' ÷ 100)',
          '<b>Convert the percent:</b> ' + f(v.rate) + ' ÷ 100 = ' + f(dec),
          '<b>Divide:</b> ' + f(v.known) + ' ÷ ' + f(dec) + ' = ' + H.num(v.known / dec, 6),
          '<b>Check:</b> ' + f(dec) + ' × ' + w.s + ' = ' + H.num(dec * Number(H.round(v.known / dec, 2)), 4),
          '<b>Answer:</b> ' + f(v.known) + ' is ' + f(v.rate) + '% of ' + w.s + ' (' + w.note + ').'
        ]
      };
    }
    if (!isFinite(v.p) || !isFinite(v.n)) return { error: 'Enter a percent and a number.' };
    var dp = v.p / 100, a = out(dp * v.n, 2);
    return {
      value: a.s,
      label: f(v.p) + '% of ' + f(v.n),
      steps: [
        '<b>Formula:</b> Part = (Percent ÷ 100) × Whole',
        '<b>Substitute:</b> Part = (' + f(v.p) + ' ÷ 100) × ' + f(v.n),
        '<b>Convert the percent to a decimal:</b> ' + f(v.p) + ' ÷ 100 = ' + f(dp),
        '<b>Multiply:</b> ' + f(dp) + ' × ' + f(v.n) + ' = ' + H.num(dp * v.n, 6),
        '<b>Answer:</b> ' + f(v.p) + '% of ' + f(v.n) + ' is ' + a.s + ' (' + a.note + ').'
      ]
    };
  },
  facts: {
    formula: 'Part = (Percent ÷ 100) × Whole<br>Percent = (Part ÷ Whole) × 100<br>Whole = Part ÷ (Percent ÷ 100)',
    vars: [['Part', 'the piece: 45 in "45 is 30% of 150"'], ['Whole', 'the total that counts as 100%: the number after "of"'], ['Percent', 'the rate out of 100: 30']],
    rounding: 'Work at full precision and round only the final answer, to 2 decimal places unless the question asks for whole numbers.',
    note: 'All three formulas are one equation, Part = Rate × Whole, rearranged. In a word problem, "of" means multiply.'
  },
  example: {
    h2: 'Worked example: a school survey',
    html: `<p><strong>Problem:</strong> In a survey of 2,450 students, 18% said they walk to school. How many students walk?</p>
<p><strong>1.</strong> The question asks for a part: 18% <em>of</em> 2,450. So Part = (Percent ÷ 100) × Whole.</p>
<p><strong>2.</strong> Turn the percent into a decimal: 18 ÷ 100 = 0.18.</p>
<p><strong>3.</strong> Multiply by the whole: 0.18 × 2,450 = 441.</p>
<p><strong>Answer:</strong> 441 students walk to school. A quick check: 10% of 2,450 is 245 and 20% is 490, so 18% must land a little under 490, and it does.</p>`
  },
  variants: [
    {
      h2: 'What is 30% of 150?',
      html: `<p>30% of 150 is <strong>45</strong>. Write 30% as 0.30 and multiply: 0.30 × 150 = 45. That is why searches like "150 × 0.30" and "0.30 × 150" give the same result: multiplication works in either order. In your head, take 10% of 150 (move the decimal point once: 15) and triple it: 15 × 3 = 45.</p>`
    },
    {
      h2: 'How do you find the percentage of a number?',
      html: `<p>Divide the percent by 100 to get a decimal, then multiply it by the number. For 15% of 80: 15 ÷ 100 = 0.15, and 0.15 × 80 = 12. If the percent is a fraction you know, use it instead: 25% is a quarter, so 25% of 80 is 80 ÷ 4 = 20.</p>
<p>A useful shortcut is that x% of y equals y% of x. 8% of 50 looks awkward, but 50% of 8 is plainly 4.</p>`
    },
    {
      h2: 'What percent of 30 is 4?',
      html: `<p>4 is about <strong>13.33%</strong> of 30. Divide the part by the whole and multiply by 100: 4 ÷ 30 = 0.1333…, and 0.1333… × 100 = 13.33% (rounded to two decimal places). The same method turns a test mark into a percent: 29 out of 30 is 29 ÷ 30 × 100 = 96.67%.</p>`
    }
  ],
  mistakes: [
    '<strong>Dividing by the wrong total.</strong> In "what percent of 30 is 4", 30 is the whole and goes on the bottom: 4 ÷ 30 = 13.33%. Swapping them (30 ÷ 4) gives 750%, the answer to a different question.',
    '<strong>Multiplying by the percent instead of the decimal.</strong> 30 × 150 = 4,500, not 45. Divide the percent by 100 first.',
    '<strong>Taking a percent off a total that already includes it.</strong> If a $96.30 bill includes 7% tax, the price before tax is $96.30 ÷ 1.07 = $90, not $96.30 − 7%.',
    '<strong>Rounding too early.</strong> Keep the full decimal (0.1333…) until the last step, then round the percent.'
  ],
  related: ['tip-calculator', 'test-score-calculator', 'split-bill-calculator', 'grade-calculator', 'average-calculator'],
  faq: [
    { q: 'How do I calculate 30 percent of a number?', a: 'Multiply the number by 0.30, or find 10% (move the decimal point one place left) and multiply by 3. 30% of 70 is 7 × 3 = 21.' },
    { q: 'Can a percentage be more than 100%?', a: 'Yes, whenever the part is bigger than the whole. Selling 180 tickets against a goal of 150 is 180 ÷ 150 × 100 = 120% of the goal.' },
    { q: 'How do I work out a percentage from marks?', a: 'Divide the marks you scored by the marks available and multiply by 100. 172 out of 200 is 172 ÷ 200 × 100 = 86%.' },
    { q: 'What is the formula for finding the whole from a percent?', a: 'Whole = Part ÷ (Percent ÷ 100). If 45 is 30% of a number, the number is 45 ÷ 0.30 = 150.' }
  ],
  sources: [
    { name: 'Wolfram MathWorld: Percent', url: 'https://mathworld.wolfram.com/Percent.html' }
  ]
};
