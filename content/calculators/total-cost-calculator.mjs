export default {
  slug: 'total-cost-calculator',
  hub: 'business',
  name: 'Total Cost Calculator',
  title: 'Total Cost Calculator: $5,000 Fixed + 1,000 × $12 = $17,000',
  h1: 'Total Cost Calculator with ATC, AVC, AFC and Marginal Cost',
  meta: '$5,000 of fixed cost plus 1,000 units at $12 each is $17,000 total, or $17 per unit. Get TC, ATC, AVC, AFC and marginal cost from figures or a cost table.',
  keyword: 'how to calculate total cost',
  also: ['total cost calculator', 'how to calculate variable cost per unit', 'how do i calculate average total cost', 'how do you calculate average total cost', 'how do you calculate average variable cost', 'how to calculate total fixed costs', 'how to calculate total average cost', 'how to calculate average total cost economics', 'how to calculate avc in economics', 'how to calculate atc in economics', 'how to calculate afc in economics', 'how to calculate afc economics', 'how to calculate marginal costs'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you know?', type: 'select', value: 'unit', options: [['unit', 'Fixed cost + variable cost per unit'], ['tvc', 'Fixed cost + total variable cost'], ['schedule', 'A cost table (quantity and total cost)']] },
    { id: 'fixed', label: 'Total fixed cost', type: 'number', value: 5000, prefix: '$', help: 'Rent, salaries, insurance, loan payments: costs that do not change with output.', showIf: { mode: ['unit', 'tvc'] } },
    { id: 'vcu', label: 'Variable cost per unit', type: 'number', value: 12, prefix: '$', help: 'Materials, packaging, piece-rate labor, shipping per unit.', showIf: { mode: ['unit'] } },
    { id: 'tvc', label: 'Total variable cost', type: 'number', value: 12000, prefix: '$', showIf: { mode: ['tvc'] } },
    { id: 'qty', label: 'Quantity produced', type: 'number', value: 1000, suffix: 'units', showIf: { mode: ['unit', 'tvc'] } },
    { id: 'qs', label: 'Quantities (start with 0)', type: 'text', value: '0, 1, 2, 3, 4, 5, 6', showIf: { mode: ['schedule'] }, wide: true },
    { id: 'tcs', label: 'Total cost at each quantity', type: 'text', value: '100, 150, 190, 220, 260, 320, 400', showIf: { mode: ['schedule'] }, wide: true, help: 'Total cost at quantity 0 is the fixed cost.' }
  ],
  compute(v, H) {
    if (v.mode === 'schedule') {
      var q = H.list(v.qs), tc = H.list(v.tcs);
      if (q.length < 2 || q.length !== tc.length) return { error: 'Enter the same number of quantities and total costs (at least two).' };
      var hasZero = q.indexOf(0) >= 0;
      if (!hasZero) return { error: 'Include quantity 0 so the fixed cost is known.' };
      var fc = tc[q.indexOf(0)];
      var rows = [], minAtc = Infinity, minAtcQ = null, minAvc = Infinity, minAvcQ = null;
      for (var i = 0; i < q.length; i++) {
        if (i > 0 && !(q[i] > q[i - 1])) return { error: 'List quantities in increasing order.' };
        var tvcI = tc[i] - fc;
        var mc = i > 0 ? (tc[i] - tc[i - 1]) / (q[i] - q[i - 1]) : NaN;
        var afc = q[i] > 0 ? fc / q[i] : NaN, avc = q[i] > 0 ? tvcI / q[i] : NaN, atc = q[i] > 0 ? tc[i] / q[i] : NaN;
        if (q[i] > 0 && atc < minAtc) { minAtc = atc; minAtcQ = q[i]; }
        if (q[i] > 0 && avc < minAvc) { minAvc = avc; minAvcQ = q[i]; }
        rows.push([H.num(q[i], 2), H.money(tc[i]), H.money(tvcI), q[i] > 0 ? H.money(afc) : '—', q[i] > 0 ? H.money(avc) : '—', q[i] > 0 ? H.money(atc) : '—', i > 0 ? H.money(mc) : '—']);
      }
      return {
        value: H.money(minAtc),
        label: 'Lowest average total cost (at Q = ' + H.num(minAtcQ, 2) + ')',
        expr: 'ATC = TC ÷ Q, fixed cost ' + H.money(fc),
        rows: [['Total fixed cost', H.money(fc)], ['Lowest ATC', H.money(minAtc) + ' at Q = ' + H.num(minAtcQ, 2), true], ['Lowest AVC', H.money(minAvc) + ' at Q = ' + H.num(minAvcQ, 2)]],
        sub: 'Marginal cost crosses ATC and AVC at their lowest points; the table shows every column.',
        table: { head: ['Q', 'TC', 'TVC', 'AFC', 'AVC', 'ATC', 'MC'], rows: rows, caption: 'Cost schedule' }
      };
    }
    if (!(v.fixed >= 0)) return { error: 'Enter total fixed cost (0 if none).' };
    if (!(v.qty > 0)) return { error: 'Enter a quantity greater than zero.' };
    var vcu, tvc;
    if (v.mode === 'tvc') {
      if (!(v.tvc >= 0)) return { error: 'Enter total variable cost.' };
      tvc = v.tvc; vcu = tvc / v.qty;
    } else {
      if (!(v.vcu >= 0)) return { error: 'Enter variable cost per unit.' };
      vcu = v.vcu; tvc = vcu * v.qty;
    }
    var total = v.fixed + tvc;
    return {
      value: H.money(total),
      label: 'Total cost (TC)',
      expr: H.money(v.fixed) + ' + ' + H.num(v.qty, 2) + ' × ' + H.money(vcu),
      rows: [
        ['Average total cost (ATC)', H.money(total / v.qty), true],
        ['Average variable cost (AVC)', H.money(vcu)],
        ['Average fixed cost (AFC)', H.money(v.fixed / v.qty)],
        ['Total variable cost (TVC)', H.money(tvc)],
        ['Variable cost per unit', H.money(vcu)],
        ['Marginal cost of one more unit', H.money(vcu)],
        ['Fixed share of total cost', total > 0 ? H.fix(v.fixed / total * 100, 1) + '%' : '—']
      ],
      sub: 'Each extra unit adds ' + H.money(vcu) + '; spreading fixed cost over more units is what pulls ATC down.'
    };
  },
  quick: ({ r }) => `Total cost is fixed cost plus variable cost: TC = FC + (variable cost per unit × quantity). A shop with <strong>$5,000</strong> of monthly fixed costs making <strong>1,000 units</strong> at <strong>$12</strong> of variable cost each has a total cost of <strong>${r.value}</strong>. That is an average total cost of $17.00 per unit: $12.00 AVC plus $5.00 AFC.`,
  stepsTitle: 'How to calculate total cost and average cost',
  steps: [
    'Add up <strong>fixed costs</strong> for the period: rent, salaried staff, insurance, equipment leases, software. They stay the same whether you make 10 units or 10,000.',
    'Find <strong>variable cost per unit</strong>: materials, packaging, hourly or piece-rate labor and per-order fees for one unit. If you only know total variable cost, divide it by the units produced.',
    'Multiply variable cost per unit by quantity and add fixed cost to get <strong>total cost</strong>.',
    'Divide by quantity for averages: ATC = TC ÷ Q, AVC = TVC ÷ Q, AFC = FC ÷ Q. Check that AFC + AVC = ATC; if not, a cost was put in the wrong bucket.'
  ],
  formulaTitle: 'What are the total cost formulas?',
  formula: {
    expr: 'TC = TFC + TVC = TFC + (VC per unit × Q)<br>ATC = TC ÷ Q = AFC + AVC<br>AVC = TVC ÷ Q &nbsp;·&nbsp; AFC = TFC ÷ Q<br>MC = ΔTC ÷ ΔQ',
    vars: [['TC', 'total cost'], ['TFC', 'total fixed cost'], ['TVC', 'total variable cost'], ['Q', 'quantity of output'], ['ATC, AVC, AFC', 'average total, variable and fixed cost per unit'], ['MC', 'marginal cost: extra cost of one more unit']]
  },
  example: `<p>A candle maker pays $2,400 a month for studio rent and equipment. Wax, wicks, jars and labels cost $4.75 per candle. In November she makes 800 candles.</p>
<p>TVC = 800 × $4.75 = $3,800. TC = $2,400 + $3,800 = <strong>$6,200</strong>.</p>
<p>ATC = $6,200 ÷ 800 = <strong>$7.75</strong>, made up of AVC $4.75 and AFC $3.00.</p>
<p>If she makes 1,200 candles in December, AFC falls to $2.00 and ATC to $6.75, even though her per-candle materials did not change.</p>`,
  table: {
    title: 'How does average total cost change with quantity?',
    intro: 'Total and average costs for $5,000 of fixed cost and $12 of variable cost per unit at different production levels.',
    head: ['Quantity', 'Total cost', 'AFC', 'AVC', 'ATC'],
    rows: ({ run, H }) => [100, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000].map(qn => {
      const r = run({ mode: 'unit', fixed: 5000, vcu: 12, qty: qn });
      return [H.int(qn), r.value, r.rows[2][1], r.rows[1][1], r.rows[0][1]];
    }),
    note: 'With a constant variable cost per unit, ATC keeps falling toward AVC as fixed cost is spread thinner. Real cost curves usually turn up again at high output; switch the calculator to "A cost table" to model that.'
  },
  sections: [
    {
      h2: 'How do you calculate variable cost per unit?',
      html: `<p>Divide total variable cost by the number of units produced. If a print shop spent $3,150 on paper, ink and hourly press labor to produce 4,500 flyers, the variable cost per unit is $3,150 ÷ 4,500 = <strong>$0.70</strong>.</p>
<p>If you have a total cost figure for two output levels, the change in cost divided by the change in units also gives variable cost per unit: ($9,800 − $8,000) ÷ (1,500 − 1,000) = $3.60. This is the high-low method, and it assumes fixed costs did not change between the two months.</p>
<p>Variable cost per unit is the input for contribution margin and break-even analysis; the <a href="/break-even-calculator">break-even calculator</a> takes it from there.</p>`
    },
    {
      h2: 'How do you calculate ATC, AVC and AFC in economics?',
      html: `<p>Economics problems usually give a table of output and total cost. Total cost at zero output is the fixed cost. For each row:</p>
<ul><li>TVC = TC − TFC</li><li>AFC = TFC ÷ Q</li><li>AVC = TVC ÷ Q</li><li>ATC = TC ÷ Q (or AFC + AVC)</li><li>MC = change in TC ÷ change in Q</li></ul>
<p>With the default table in the calculator (fixed cost $100), at Q = 4: TC = $260, TVC = $160, AFC = $25.00, AVC = $40.00, ATC = $65.00, and MC = $260 − $220 = $40. ATC bottoms out at $64.00 when Q = 5, which is where MC ($60) is still below ATC; at Q = 6 MC jumps to $80 and ATC starts rising.</p>
<p>AFC always falls as output rises. AVC and ATC are U-shaped because of diminishing marginal returns, and MC cuts through both at their minimums.</p>`
    },
    {
      h2: 'How do you calculate marginal cost?',
      html: `<p>Marginal cost is the change in total cost divided by the change in quantity. If producing 500 units costs $11,000 and 600 units costs $12,100, MC = $1,100 ÷ 100 = <strong>$11 per unit</strong>. Fixed costs drop out of the subtraction, so marginal cost is driven only by variable costs.</p>
<p>When variable cost per unit is constant, marginal cost equals it. In a cost table it changes row by row, and a firm maximizes profit by producing up to the point where marginal cost equals marginal revenue.</p>`
    },
    {
      h2: 'Which costs are fixed and which are variable?',
      html: `<ul><li><strong>Usually fixed:</strong> rent, salaried staff, insurance, depreciation, software subscriptions, loan interest.</li>
<li><strong>Usually variable:</strong> raw materials, packaging, piece-rate and hourly production labor, card processing fees, shipping per order, sales commissions.</li>
<li><strong>Mixed (semi-variable):</strong> utilities and phone plans have a base charge plus usage. Split them: the base goes in fixed, the usage in variable.</li></ul>
<p>"Fixed" only holds within a range. Doubling output may need a second shift or a bigger building, which steps fixed cost up. For pricing on top of total cost, see the <a href="/markup-calculator">markup calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for total cost?', a: 'Total cost = total fixed cost + total variable cost, where total variable cost = variable cost per unit × quantity. $5,000 + 1,000 × $12 = $17,000.' },
    { q: 'How do you calculate average total cost?', a: 'Divide total cost by the quantity produced. $17,000 ÷ 1,000 units = $17.00 per unit. It also equals average fixed cost plus average variable cost.' },
    { q: 'How do you calculate total fixed cost from a table?', a: 'Read total cost at an output of zero. Any cost a firm pays when it produces nothing is fixed. You can also subtract total variable cost from total cost at any output level.' },
    { q: 'How do you calculate average variable cost?', a: 'Divide total variable cost by quantity. If TVC is $160 at 4 units, AVC is $40. When variable cost per unit is constant, AVC equals that per-unit cost.' },
    { q: 'What is the difference between average total cost and marginal cost?', a: 'ATC is total cost spread over all units; marginal cost is the cost of the next unit only. When MC is below ATC, producing more pulls the average down, and when MC is above ATC, it pushes the average up.' },
    { q: 'Is total cost the same as cost of goods sold?', a: 'No. Total cost covers all fixed and variable costs of producing a quantity in a period. Cost of goods sold is an accounting figure for the cost of the units actually sold, based on inventory. Use the COGS calculator for that.' },
    { q: 'Why does average fixed cost always decrease?', a: 'Because the same fixed amount is divided by a larger quantity. $5,000 over 500 units is $10 each; over 2,000 units it is $2.50 each.' }
  ],
  related: ['break-even-calculator', 'cogs-calculator', 'markup-calculator', 'profit-margin-calculator', 'unit-price-calculator'],
  sources: [
    { name: 'OpenStax Principles of Economics 3e: Costs in the short run', url: 'https://openstax.org/books/principles-economics-3e/pages/7-3-costs-in-the-short-run' },
    { name: 'U.S. Small Business Administration: Calculate your startup costs', url: 'https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs' }
  ]
};
