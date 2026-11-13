export default {
  slug: 'utilization-rate-calculator',
  hub: 'business',
  name: 'Utilization Rate Calculator',
  title: 'Utilization Rate Calculator: 1,410 of 1,880 Hours Is 75%',
  h1: 'Utilization Rate Calculator for Billable Hours and Capacity',
  meta: 'Billing 1,410 hours out of 1,880 available is a 75.0% utilization rate. See the revenue gap to an 80% target for consultants, agencies and service teams.',
  keyword: 'how to calculate utilization',
  also: ['utilization rate calculator', 'how to calculate resource utilization', 'how to calculate fleet utilization', 'how to calculate asset utilization'],
  updated: '2026-11-13',
  inputs: [
    { id: 'used', label: 'Billable (or used) hours', type: 'number', value: 1410, suffix: 'hours', help: 'Hours charged to clients or spent on productive work.' },
    { id: 'available', label: 'Available hours', type: 'number', value: 1880, suffix: 'hours', help: 'Paid hours minus holidays and PTO. A 40-hour year is 2,080.' },
    { id: 'rate', label: 'Bill rate (optional)', type: 'number', value: 150, prefix: '$', suffix: '/hour' },
    { id: 'target', label: 'Target utilization (optional)', type: 'number', value: 80, suffix: '%' }
  ],
  compute(v, H) {
    if (!(v.available > 0)) return { error: 'Enter the hours available in the period.' };
    if (!(v.used >= 0)) return { error: 'Enter the billable or used hours.' };
    var u = v.used / v.available * 100;
    var idle = v.available - v.used;
    var rows = [
      ['Non-billable hours', H.num(idle, 1) + ' h'],
      ['Share of time not billed', H.fix(100 - u, 1) + '%']
    ];
    if (v.rate > 0) {
      rows.push(['Billable revenue', H.money0(v.used * v.rate), true]);
      rows.push(['Effective rate per available hour', H.money(v.used * v.rate / v.available)]);
    }
    if (v.target > 0 && v.target <= 100) {
      var need = v.available * v.target / 100;
      var gap = need - v.used;
      rows.push(['Hours needed for ' + H.num(v.target, 1) + '%', H.num(need, 1) + ' h']);
      if (gap > 0) {
        rows.push(['Gap to target', H.num(gap, 1) + ' h' + (v.rate > 0 ? ' (' + H.money0(gap * v.rate) + ')' : ''), true]);
      } else {
        rows.push(['Above target by', H.num(-gap, 1) + ' h']);
      }
    }
    var sub = u > 100 ? 'Over 100% means more hours were logged than were available: check for overtime or a too-small denominator.'
      : u >= 90 ? 'Above 90% leaves little room for admin, training or sales; burnout risk rises.'
      : u >= 70 ? 'Within the 70–85% band most professional services firms aim for.'
      : 'Below 70%: look at bench time, internal projects and how hours are recorded.';
    return {
      value: H.fix(u, 1) + '%',
      label: 'Utilization rate',
      expr: H.num(v.used, 1) + ' h ÷ ' + H.num(v.available, 1) + ' h',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate utilization, divide billable hours by available hours and multiply by 100. An employee who bills <strong>1,410 hours</strong> of <strong>1,880 available</strong> (2,080 minus 200 hours of holidays and PTO) has a <strong>${r.value}</strong> utilization rate. At $150 an hour, reaching an 80% target would add 94 hours, or $14,100.`,
  stepsTitle: 'How to calculate a utilization rate',
  steps: [
    'Choose the period: a week, month, quarter or year. Use the same period for both numbers.',
    'Add up <strong>billable hours</strong>: time charged to clients, or productive hours for an internal team or machine.',
    'Work out <strong>available hours</strong>. Start with scheduled hours (2,080 for a full-time year) and subtract paid holidays and PTO. Leaving them in is the most common mistake and makes everyone look under-utilized.',
    'Divide billable by available and multiply by 100. Compare the result with your target and with last period.'
  ],
  formulaTitle: 'What is the utilization rate formula?',
  formula: {
    expr: 'Utilization rate = Billable hours ÷ Available hours × 100<br>Hours to hit target = Available hours × Target %',
    vars: [['Billable hours', 'hours spent on paid or productive work'], ['Available hours', 'hours the person, team or asset could work in the period'], ['Target %', 'the utilization goal you plan around']],
    note: 'For a team, sum everyone\'s billable hours and everyone\'s available hours before dividing. Averaging individual percentages gives part-timers too much weight.'
  },
  example: `<p>A design agency has 6 staff. Over a 4-week month each is scheduled for 160 hours, and the team took 48 hours of PTO in total, so available hours = 6 × 160 − 48 = <strong>912</strong>.</p>
<p>The team logged 640 billable hours. Utilization = 640 ÷ 912 × 100 = <strong>70.2%</strong>.</p>
<p>To hit 80% next month, they need 912 × 0.80 = 729.6 billable hours, about 90 more. At a $120 blended rate that gap is worth roughly <strong>$10,700</strong> a month.</p>`,
  table: {
    title: 'How many billable hours does each utilization target need?',
    intro: 'Weekly and yearly billable hours for a full-time employee with 1,880 available hours a year (2,080 minus 25 days of holidays and PTO), and the revenue at $150 an hour.',
    head: ['Target', 'Billable h per 40-h week', 'Billable h per year', 'Revenue at $150/h'],
    rows: ({ H, run }) => [50, 60, 65, 70, 75, 80, 85, 90, 100].map(t => {
      const r = run({ used: 1880 * t / 100, available: 1880, rate: 150, target: '' });
      return [r.value, H.num(40 * t / 100, 1), H.int(1880 * t / 100), H.money0(1880 * t / 100 * 150)];
    })
  },
  sections: [
    {
      h2: 'What is a good utilization rate?',
      html: `<p>It depends on the role. Common planning targets in professional services:</p>
<ul><li><strong>Junior consultants, developers, designers:</strong> 75–85%.</li>
<li><strong>Managers and team leads:</strong> 50–70%, because they spend time on reviews, hiring and client relationships.</li>
<li><strong>Partners and principals:</strong> 30–50%, with the rest on sales.</li>
<li><strong>Company-wide:</strong> many firms aim for roughly 70–80% across all billable staff.</li></ul>
<p>These are rules of thumb, not official figures. Higher is not always better: sustained utilization above 90% usually means no time for training, documentation or business development, and overtime creeps in.</p>`
    },
    {
      h2: 'Should utilization use 2,080 hours or available hours?',
      html: `<p>Both appear in practice, and they answer different questions.</p>
<ul><li><strong>Available hours (2,080 minus PTO and holidays)</strong> measures how well working time is used. This is what most firms report.</li>
<li><strong>Total paid hours (2,080)</strong> shows how much of what you pay for is billed, which is what pricing and profitability need. The same 1,410 billable hours is 75.0% of 1,880 but only 67.8% of 2,080.</li></ul>
<p>The federal government uses a 2,087-hour work year (the average over a 28-year calendar cycle, per OPM) when converting annual pay to hourly; the difference from 2,080 is small. Pick one denominator and keep it consistent. If you set billing rates, the 2,080 view tells you how much each billable hour has to carry. See the <a href="/salary-to-hourly-calculator">salary to hourly calculator</a> to turn salary into a cost per hour.</p>`
    },
    {
      h2: 'How do you calculate resource, fleet and asset utilization?',
      html: `<p>The idea is the same: time in productive use ÷ time available.</p>
<ul><li><strong>Resource utilization</strong> (people or equipment): assigned hours ÷ capacity hours. A machine run 108 of 120 scheduled hours is at 90%.</li>
<li><strong>Fleet utilization</strong>: vehicles in use ÷ vehicles available, or days in service ÷ days available. A 20-truck fleet averaging 16 trucks dispatched per day is at 80%. Exclude units in scheduled maintenance from "available" if you want an operational rate.</li>
<li><strong>Asset utilization</strong> in finance is a different ratio: net sales ÷ average total assets. $5 million of sales on $2.5 million of assets is 2.0×, meaning each dollar of assets generated $2 of revenue.</li></ul>`
    },
    {
      h2: 'How is utilization different from productivity?',
      html: `<p>Utilization measures how much available time was spent on billable or productive work; productivity measures how much output came out of each hour. A consultant can be 85% utilized and still unproductive if the billed hours produce little. Track both: utilization for capacity planning and the <a href="/productivity-calculator">productivity calculator</a> for output per hour.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate utilization rate for one employee?', a: 'Divide that employee\'s billable hours by their available hours for the same period and multiply by 100. 30 billable hours in a 40-hour week is 75%.' },
    { q: 'How many billable hours is 80% utilization?', a: 'For a 40-hour week, 80% is 32 billable hours. Over a year with 1,880 available hours it is 1,504 billable hours.' },
    { q: 'Do PTO and holidays count in utilization?', a: 'Usually not. Most firms subtract them from available hours so that vacation does not count against the employee. If you use 2,080 hours as the denominator, say so, because the rate will be lower.' },
    { q: 'Can utilization be over 100%?', a: 'Yes, if someone bills more hours than were available, typically through overtime. It is a warning sign for workload rather than a goal.' },
    { q: 'What is the difference between utilization and realization?', a: 'Utilization measures hours billed against hours available. Realization measures dollars collected against the value of hours at standard rates, so write-offs and discounts lower realization but not utilization.' },
    { q: 'How do I calculate capacity utilization for a factory?', a: 'Divide actual output by maximum possible output in the same period. A plant that made 42,000 units against a capacity of 50,000 ran at 84% capacity utilization.' },
    { q: 'What utilization rate do I need to break even?', a: 'Divide your fully loaded cost per available hour by your bill rate. If an employee costs $70 per available hour and bills at $150, breakeven utilization is 70 ÷ 150 = 46.7%.' }
  ],
  related: ['productivity-calculator', 'salary-to-hourly-calculator', 'time-card-calculator', 'pto-accrual-calculator', 'profit-margin-calculator'],
  sources: [
    { name: 'U.S. Office of Personnel Management: Computing hourly rates of pay using the 2,087-hour divisor', url: 'https://www.opm.gov/policy-data-oversight/pay-leave/pay-administration/fact-sheets/computing-hourly-rates-of-pay-using-the-2087-hour-divisor/' },
    { name: 'U.S. Bureau of Labor Statistics: Productivity', url: 'https://www.bls.gov/productivity/' },
    { name: 'Federal Reserve: Industrial Production and Capacity Utilization (G.17)', url: 'https://www.federalreserve.gov/releases/g17/current/default.htm' }
  ]
};
