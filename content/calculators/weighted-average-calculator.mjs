export default {
  slug: 'weighted-average-calculator',
  hub: 'math',
  name: 'Weighted Average Calculator',
  title: 'Weighted Average Calculator: 78, 84 and 71 Combine to 78.75',
  h1: 'Weighted Mean Calculator: Values Times Weights, Divided by Total Weight',
  meta: 'Class means of 78, 84 and 71 with 24, 30 and 18 students give a grand mean of 5,670 ÷ 72 = 78.75, not the 77.67 simple average. Add values and weights.',
  keyword: 'how to calculate weighted mean',
  also: ['weighted average calculator', 'weighted mean calculator', 'how to calculate weighted mean in excel', 'how to calculate weighted average interest rate', 'grand mean calculator'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'items', label: 'Values and their weights', type: 'rows', addLabel: '+ add value', max: 50,
      fields: [
        { id: 'name', label: 'Label (optional)', type: 'text', value: '', blank: true, placeholder: 'e.g. Class A' },
        { id: 'x', label: 'Value', type: 'number', value: '' },
        { id: 'w', label: 'Weight', type: 'number', value: 1 }
      ],
      value: [
        { name: 'Class A', x: 78, w: 24 },
        { name: 'Class B', x: 84, w: 30 },
        { name: 'Class C', x: 71, w: 18 }
      ]
    }
  ],
  compute(v, H) {
    function f(t) { var a = Math.abs(t); return a !== 0 && (a < 1e-6 || a >= 1e15) ? H.sig(t, 8) : H.num(t, 4); }
    var sw = 0, swx = 0, xs = [], used = [];
    var bad = false;
    (v.items || []).forEach(function (it, i) {
      if (!isFinite(it.x) || !isFinite(it.w)) return;
      if (it.w < 0) { bad = true; return; }
      sw += it.w; swx += it.w * it.x; xs.push(it.x);
      used.push({ name: String(it.name || '').trim() || 'Value ' + (i + 1), x: it.x, w: it.w });
    });
    if (bad) return { error: 'Weights cannot be negative.' };
    if (!used.length) return { error: 'Enter at least one value with a weight.' };
    if (sw === 0) return { error: 'The weights add up to 0, so there is nothing to average.' };
    var wm = swx / sw, sm = H.mean(xs);
    return {
      value: f(wm), label: 'Weighted mean of ' + used.length + ' value' + (used.length === 1 ? '' : 's'),
      expr: f(swx) + ' ÷ ' + f(sw),
      rows: [
        ['Sum of weight × value (Σwx)', f(swx)],
        ['Sum of weights (Σw)', f(sw)],
        ['Simple (unweighted) mean', f(sm)],
        ['Weighting changes the result by', (wm - sm >= 0 ? '+' : '−') + f(Math.abs(wm - sm))]
      ],
      table: { head: ['Item', 'Value', 'Weight', 'Share of weight', 'w × x'], rows: used.map(function (u) { return [H.esc(u.name), f(u.x), f(u.w), H.pct(u.w / sw * 100, 2), f(u.w * u.x)]; }) },
      sub: 'Items with bigger weights pull the result toward their values.'
    };
  },
  quick: ({ r }) => `To calculate a weighted mean, multiply each value by its weight, add the products, and divide by the total weight. Class means of 78 (24 students), 84 (30) and 71 (18) give (1,872 + 2,520 + 1,278) ÷ 72 = 5,670 ÷ 72 = <strong>${r.value}</strong>. The simple average of the three means, 77.67, understates it because the largest class scored highest.`,
  stepsTitle: 'How to calculate a weighted mean',
  steps: [
    'List each value with its weight: number of students, credit hours, dollars invested, percent of the grade, or any measure of importance.',
    'Multiply every value by its weight. 78 × 24 = 1,872.',
    'Add the products (Σwx) and add the weights (Σw) separately.',
    'Divide Σwx by Σw. Dividing by the number of items instead of the total weight is the most common mistake; it only works when every weight is 1.'
  ],
  formulaTitle: 'What is the weighted mean formula?',
  formula: {
    expr: 'x̄ʷ = Σ(wᵢ × xᵢ) ÷ Σwᵢ = (w₁x₁ + w₂x₂ + … + wₙxₙ) ÷ (w₁ + w₂ + … + wₙ)',
    vars: [['xᵢ', 'each value (a score, rate, price or group mean)'], ['wᵢ', 'its weight (count, credits, dollars, percent)'], ['Σ', 'sum over all items']],
    note: 'Weights do not need to add up to 1 or 100%; dividing by Σw normalizes them. With equal weights the formula reduces to the ordinary mean.'
  },
  example: `<p>Three class sections took the same exam. Section A: 24 students, mean 78. Section B: 30 students, mean 84. Section C: 18 students, mean 71.</p>
<p>Products: 78 × 24 = 1,872; 84 × 30 = 2,520; 71 × 18 = 1,278. Sum = <strong>5,670</strong> over <strong>72</strong> students.</p>
<p>Grand mean = 5,670 ÷ 72 = <strong>78.75</strong>. Averaging the three section means, (78 + 84 + 71) ÷ 3 = 77.67, would treat the 18-student section as if it were as big as the 30-student one.</p>`,
  table: {
    title: 'How does the grand mean move as one group gets bigger?',
    intro: 'Sections A (24 students, mean 78) and C (18, mean 71) stay fixed while section B (mean 84) grows. Computed by the calculator above.',
    head: ['Students in B', 'Total students', 'Grand mean', 'Simple mean of the 3 sections'],
    rows: ({ run }) => [0, 10, 20, 30, 50, 100, 200].map(nb => { const o = run({ items: [{ name: 'A', x: 78, w: 24 }, { name: 'B', x: 84, w: nb }, { name: 'C', x: 71, w: 18 }] }); return [String(nb), String(42 + nb), o.value, o.rows[2][1]]; }),
    note: 'The simple mean never changes because it ignores group size; the weighted mean approaches 84 as section B dominates.'
  },
  sections: [
    {
      h2: 'How do you calculate a weighted mean in Excel or Google Sheets?',
      html: `<p>Put values in B2:B4 and weights in C2:C4, then use:</p>
<p><code>=SUMPRODUCT(B2:B4,C2:C4)/SUM(C2:C4)</code></p>
<p>SUMPRODUCT multiplies each pair and adds the results (Σwx); SUM adds the weights (Σw). Google Sheets accepts the same formula and also has a shortcut, <code>=AVERAGE.WEIGHTED(B2:B4,C2:C4)</code>. Keep the two ranges the same size, and avoid blank weight cells, which count as 0.</p>`
    },
    {
      h2: 'Do the weights have to add up to 100%?',
      html: `<p>No. Because the formula divides by the sum of the weights, you can use raw counts (24, 30, 18), percentages (20%, 30%, 50%) or any proportional numbers (2, 3, 5) and get the same answer for the same proportions.</p>
<p>Percent weights that do not reach 100% are a special case in grading: if only 70% of a course has been graded, dividing by 70 gives your current standing on the work so far. The <a href="/grade-calculator">grade calculator</a> and <a href="/final-grade-calculator">final grade calculator</a> handle weighted course categories; GPA is a weighted mean with credit hours as weights, covered by the <a href="/gpa-calculator">GPA calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate a weighted average interest rate?',
      html: `<p>Weight each rate by its balance. Loans of $12,000 at 6.8%, $8,000 at 4.5% and $5,000 at 7.9%:</p>
<p>(12,000 × 6.8 + 8,000 × 4.5 + 5,000 × 7.9) ÷ 25,000 = (81,600 + 36,000 + 39,500) ÷ 25,000 = <strong>6.284%</strong>.</p>
<p>This is how a federal Direct Consolidation Loan sets its rate: the weighted average of the loans being combined, rounded up to the nearest one-eighth of a percent, which here would be 6.375%. The same method gives the average cost per share of a stock bought in several lots: 50 shares at $40, 30 at $52 and 20 at $47 cost $4,500 for 100 shares, or $45.00 each.</p>`
    },
    {
      h2: 'What is a grand mean and how do you combine group averages?',
      html: `<p>The grand mean is the mean of every individual observation across all groups. If you only have each group's mean and size, it equals the weighted mean of the group means, weighted by group size, exactly what the default example computes.</p>
<p>Grouped frequency tables work the same way: use each class midpoint as the value and its frequency as the weight. For an unweighted list of raw numbers, the <a href="/average-calculator">average calculator</a> gives the mean, median and mode directly.</p>`
    }
  ],
  faq: [
    { q: 'What is the difference between a weighted and a simple average?', a: 'A simple average gives every value the same importance. A weighted average multiplies each value by a weight first, so values with bigger weights count more toward the result.' },
    { q: 'Can a weight be zero?', a: 'Yes. A zero weight leaves that value out of the result entirely. Negative weights are not allowed in an ordinary weighted mean.' },
    { q: 'Is GPA a weighted average?', a: 'Yes. Each grade\'s points are weighted by the class\'s credit hours, so a 4-credit class moves your GPA more than a 1-credit class.' },
    { q: 'What happens if all the weights are equal?', a: 'The weighted mean becomes the ordinary mean. Weights of 2, 2 and 2 on 78, 84 and 71 give 77.67, the same as the simple average.' },
    { q: 'How do you find a weighted percentage?', a: 'Treat each percentage as a value and its base as the weight. 40% of 200 people and 70% of 50 people is (0.40 × 200 + 0.70 × 50) ÷ 250 = 46%, not the 55% simple average.' },
    { q: 'Is a weighted moving average the same thing?', a: 'It uses the same formula, but over a sliding window of recent data with larger weights on newer points. The moving average calculator handles that case.' }
  ],
  related: ['average-calculator', 'gpa-calculator', 'grade-calculator', 'moving-average-calculator'],
  sources: [
    { name: 'Wolfram MathWorld: Weighted Mean', url: 'https://mathworld.wolfram.com/WeightedMean.html' },
    { name: 'Microsoft Support: SUMPRODUCT function', url: 'https://support.microsoft.com/en-us/office/sumproduct-function-16753e75-9f68-4874-94ac-4d2145a2fd2e' },
    { name: 'Federal Student Aid: Direct Consolidation Loans', url: 'https://studentaid.gov/manage-loans/consolidation' }
  ]
};
