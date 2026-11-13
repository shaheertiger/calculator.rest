export default {
  slug: 'safety-stock-calculator',
  hub: 'business',
  name: 'Safety Stock Calculator',
  title: 'Safety Stock Calculator: 95% Service Level = 42 Units Buffer',
  h1: 'Safety Stock Calculator: Z-Score, Max-Average and Reorder Point',
  meta: 'Demand of 40 ± 8 units a day and a 10-day lead time need 42 units of safety stock at a 95% service level, a 442-unit reorder point. Three methods compared.',
  keyword: 'how to calculate safety stock',
  also: ['safety stock calculator', 'safety stock formula', 'reorder point calculator', 'how to calculate reorder point', 'how to calculate min max inventory levels', 'how to calculate cycle stock', 'how to calculate ideal inventory levels'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Method', type: 'select', value: 'z', wide: true, options: [['z', 'Service level: Z × σ(demand) × √lead time'], ['combined', 'Service level with variable lead time'], ['maxavg', 'Max-average (max usage × max lead time − average)']] },
    { id: 'd', label: 'Average daily demand', type: 'number', value: 40, suffix: 'units' },
    { id: 'sd', label: 'Standard deviation of daily demand', type: 'number', value: 8, suffix: 'units', showIf: { method: ['z', 'combined'] } },
    { id: 'lt', label: 'Average lead time', type: 'number', value: 10, suffix: 'days' },
    { id: 'sdlt', label: 'Standard deviation of lead time', type: 'number', value: 2, suffix: 'days', showIf: { method: ['combined'] } },
    { id: 'sl', label: 'Cycle service level', type: 'number', value: 95, suffix: '%', showIf: { method: ['z', 'combined'] }, help: 'Chance of not running out before the next delivery arrives.' },
    { id: 'dmax', label: 'Maximum daily demand', type: 'number', value: 60, suffix: 'units', showIf: { method: ['maxavg'] } },
    { id: 'ltmax', label: 'Maximum lead time', type: 'number', value: 14, suffix: 'days', showIf: { method: ['maxavg'] } }
  ],
  compute(v, H) {
    var d = v.d, lt = v.lt, ss, z = NaN, expr, sigma = NaN;
    if (!(d > 0)) return { error: 'Enter average daily demand.' };
    if (!(lt > 0)) return { error: 'Enter the average lead time in days.' };
    if (v.method === 'maxavg') {
      if (!(v.dmax >= d) || !(v.ltmax >= lt)) return { error: 'Maximum demand and lead time must be at least the averages.' };
      ss = v.dmax * v.ltmax - d * lt;
      expr = H.num(v.dmax, 2) + ' × ' + H.num(v.ltmax, 2) + ' − ' + H.num(d, 2) + ' × ' + H.num(lt, 2);
    } else {
      if (!(v.sd >= 0)) return { error: 'Enter the standard deviation of daily demand.' };
      if (!(v.sl > 50 && v.sl < 100)) return { error: 'Enter a service level between 50% and 99.99%.' };
      z = H.normInv(v.sl / 100);
      if (v.method === 'combined') {
        if (!(v.sdlt >= 0)) return { error: 'Enter the standard deviation of lead time (0 if it never varies).' };
        sigma = Math.sqrt(lt * v.sd * v.sd + d * d * v.sdlt * v.sdlt);
        expr = H.fix(z, 3) + ' × √(' + H.num(lt, 2) + '×' + H.num(v.sd, 2) + '² + ' + H.num(d, 2) + '²×' + H.num(v.sdlt, 2) + '²)';
      } else {
        sigma = v.sd * Math.sqrt(lt);
        expr = H.fix(z, 3) + ' × ' + H.num(v.sd, 2) + ' × √' + H.num(lt, 2);
      }
      ss = z * sigma;
    }
    var units = Math.ceil(ss - 1e-9), ltd = d * lt, rop = ltd + units;
    var rows = [
      ['Reorder point', H.int(rop) + ' units', true],
      ['Demand during lead time', H.num(ltd, 1) + ' units'],
      ['Safety stock (exact)', H.num(ss, 2) + ' units']
    ];
    if (!isNaN(z)) { rows.push(['Z-score', H.fix(z, 3)]); rows.push(['σ of lead-time demand', H.num(sigma, 2) + ' units']); }
    rows.push(['Days of cover in the buffer', H.num(units / d, 1) + ' days']);
    return {
      value: H.int(units) + ' units',
      label: 'Safety stock',
      expr: expr,
      rows: rows,
      sub: v.method === 'maxavg' ? 'The max-average method assumes the worst demand and worst lead time happen together, so it gives a large, conservative buffer.' : 'Reorder when stock falls to ' + H.int(rop) + ' units and you should avoid a stockout in about ' + H.num(v.sl, 2) + '% of replenishment cycles.',
      ss: units, rop: rop, z: z
    };
  },
  quick: ({ r, run }) => `Safety stock = Z × standard deviation of daily demand × √lead time. For a product selling <strong>40 units a day</strong> (standard deviation 8) with a 10-day lead time, a 95% service level (Z = 1.645) needs 1.645 × 8 × √10 = <strong>${r.value}</strong> of safety stock. The reorder point is 400 + 42 = 442 units. The cruder max-average method gives ${run({ method: 'maxavg' }).value}.`,
  stepsTitle: 'How to calculate safety stock',
  steps: [
    'Pull at least 3–6 months of daily (or weekly) sales for the item and calculate the <strong>average</strong> and the <strong>standard deviation</strong>. A spreadsheet\'s =AVERAGE() and =STDEV.S() do this.',
    'Measure the supplier\'s <strong>lead time</strong> from order to shelf, in the same time unit as demand. Mixing weekly demand figures with a lead time in days is the most common mistake and makes the buffer wrong by a factor of √7.',
    'Choose a cycle service level and convert it to a Z-score: 90% → 1.282, 95% → 1.645, 99% → 2.326.',
    'Multiply Z × σ(demand) × √(lead time). If lead times vary, use the combined formula instead. Round up to whole units and add expected lead-time demand to get the reorder point.'
  ],
  formulaTitle: 'What is the safety stock formula?',
  formula: {
    expr: 'Safety stock = Z × σ<sub>d</sub> × √L<br>With variable lead time: SS = Z × √(L × σ<sub>d</sub>² + d² × σ<sub>L</sub>²)<br>Max-average: SS = d<sub>max</sub> × L<sub>max</sub> − d × L<br>Reorder point = d × L + SS',
    vars: [['Z', 'standard normal value for the service level'], ['σ<sub>d</sub>', 'standard deviation of demand per period'], ['L, σ<sub>L</sub>', 'average lead time and its standard deviation, in the same periods'], ['d, d<sub>max</sub>', 'average and maximum demand per period']],
    note: 'The service-level formulas assume demand per period is roughly normally distributed and independent from day to day, the standard textbook model in operations management courses.'
  },
  example: `<p>A distributor sells an average of 40 cases of a cleaning product per day, with a standard deviation of 8 cases. The supplier delivers in 10 days on average.</p>
<p>At a 95% service level, Z = 1.645. σ over the lead time = 8 × √10 = 25.30 cases.</p>
<p>Safety stock = 1.645 × 25.30 = 41.6, rounded up to <strong>42 cases</strong>. Reorder point = 40 × 10 + 42 = <strong>442 cases</strong>.</p>
<p>If the supplier's lead time also varies with a standard deviation of 2 days, the combined formula gives 1.645 × √(10 × 8² + 40² × 2²) = 1.645 × 83.9 = <strong>139 cases</strong>: unreliable delivery triples the buffer.</p>`,
  table: {
    title: 'How much safety stock does each service level need?',
    intro: 'Z-scores and resulting safety stock for the example above (40 units/day, σ = 8, 10-day lead time), computed with the calculator. Each step closer to 100% costs more stock than the last.',
    head: ['Cycle service level', 'Z-score', 'Safety stock', 'Reorder point'],
    rows: ({ run, H }) => [80, 85, 90, 95, 97.5, 98, 99, 99.5, 99.9].map(s => { const r = run({ method: 'z', sl: s }); return [s + '%', H.fix(r.z, 3), r.value, H.int(r.rop) + ' units']; }),
    note: 'Going from 95% to 99% adds 17 units (40%) of safety stock; going from 99% to 99.9% adds 20 more. Reserve the highest levels for items where a stockout is very costly.'
  },
  sections: [
    {
      h2: 'Which safety stock method should you use?',
      html: `<ul><li><strong>Z × σ × √L</strong> is the standard choice when supplier lead times are steady. It needs a standard deviation, which any sales history provides.</li>
<li><strong>The combined formula</strong> adds lead-time variability. Use it for overseas suppliers, ocean freight or any vendor whose deliveries slip. As the example shows, a 2-day lead-time wobble can matter more than demand swings.</li>
<li><strong>Max-average</strong> (max daily sales × max lead time − average daily sales × average lead time) needs no statistics, which makes it popular in small businesses, but it assumes the worst case of both at once. Here it gives 440 units, more than ten times the 95% service-level figure.</li></ul>`
    },
    {
      h2: 'How do you calculate the reorder point?',
      html: `<p>Reorder point = average daily demand × lead time in days + safety stock. The first part (cycle demand) covers normal sales while you wait for the order; safety stock covers the unexpected. With 40 units a day, a 10-day lead time and 42 units of safety stock, reorder at 442 units.</p>
<p>Check the gap between today's stock and the reorder point regularly. The <a href="/days-of-supply-calculator">days of supply calculator</a> turns on-hand stock into days of cover and a reorder date.</p>`
    },
    {
      h2: 'How do you calculate min-max inventory levels?',
      html: `<p>In a min-max system, the <strong>min</strong> is the reorder point (lead-time demand + safety stock) and the <strong>max</strong> is the min plus the order quantity. With a 442-unit min and an order quantity of 600 units (15 days of demand), the max is 1,042 units. When stock falls to the min, order enough to bring it back up to the max.</p>
<p><strong>Cycle stock</strong> is the inventory that comes and goes with each order: on average half the order quantity, here 300 units. Average total inventory is therefore about cycle stock + safety stock = 342 units, which is what feeds your <a href="/average-inventory-calculator">average inventory</a> and turnover.</p>`
    },
    {
      h2: 'What service level should you choose?',
      html: `<p>Set it by how much a stockout costs. Many businesses use 90–95% for ordinary items, 97–99% for top sellers or items customers can easily buy elsewhere, and lower levels for slow, expensive parts where holding stock is costly. An ABC analysis (A items get the highest level) is a common way to assign them.</p>
<p>Note that a <em>cycle</em> service level of 95% means no stockout in 95% of replenishment cycles. The share of demand filled from stock (fill rate) is usually higher, because even in a cycle that runs out, most orders were already filled.</p>`
    }
  ],
  faq: [
    { q: 'What is safety stock?', a: 'Safety stock is extra inventory held beyond expected demand during the lead time, to protect against demand spikes and late deliveries. It is the stock you expect to still have when a new order arrives.' },
    { q: 'What Z-score is used for a 95% service level?', a: 'Z = 1.645 for 95%. Other common values: 1.282 for 90%, 1.960 for 97.5%, 2.054 for 98%, 2.326 for 99% and 3.090 for 99.9%.' },
    { q: 'Can I use weekly demand instead of daily?', a: 'Yes, as long as lead time is in weeks too. A 10-day lead time is 1.43 weeks; multiply the weekly standard deviation by √1.43.' },
    { q: 'How do I calculate safety stock in Excel?', a: 'With service level in B1, daily standard deviation in B2 and lead time in days in B3, use =ROUNDUP(NORM.S.INV(B1)*B2*SQRT(B3),0).' },
    { q: 'Why is the max-average method so much higher?', a: 'It assumes the highest daily sales and the longest lead time happen in the same cycle, which is rare. It is simple and safe but usually overstocks compared with a service-level calculation.' },
    { q: 'Does safety stock change with seasonality?', a: 'Yes. Recalculate it for each season using that season\'s average and variability, otherwise the buffer will be too small at peak and too big in the off-season.' },
    { q: 'What is the difference between safety stock and reorder point?', a: 'Safety stock is the buffer itself. The reorder point is the stock level that triggers a new order: expected lead-time demand plus safety stock.' }
  ],
  related: ['days-of-supply-calculator', 'average-inventory-calculator', 'cogs-calculator', 'standard-deviation-calculator', 'z-score-calculator'],
  sources: [
    { name: 'MIT OpenCourseWare: 15.762J Supply Chain Planning', url: 'https://ocw.mit.edu/courses/15-762j-supply-chain-planning-spring-2011/' },
    { name: 'MIT OpenCourseWare: ESD.260J Logistics Systems', url: 'https://ocw.mit.edu/courses/esd-260j-logistics-systems-fall-2006/' },
    { name: 'NIST/SEMATECH e-Handbook of Statistical Methods: the normal distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm' }
  ]
};
