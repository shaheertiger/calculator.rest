export default {
  slug: 'productivity-calculator',
  hub: 'business',
  name: 'Productivity Calculator',
  title: 'Productivity Calculator: 4,800 Units in 1,600 Hours = 3/Hour',
  h1: 'Productivity Calculator: Output per Hour and per Employee',
  meta: '4,800 units made in 1,600 labor hours is 3.00 units per hour, up 7.1% on last period. Get labor productivity per hour and per employee, plus growth.',
  keyword: 'how to calculate productivity',
  also: ['productivity calculator', 'how to calculate labor productivity', 'how to calculate productivity per employee', 'how to calculate productivity of labor', 'how to calculate average labor productivity', 'how to calculate production efficiency'],
  updated: '2026-11-13',
  inputs: [
    { id: 'kind', label: 'Output measured in', type: 'select', value: 'units', options: [['units', 'Units (pieces, orders, tickets…)'], ['dollars', 'Dollars (revenue or value added)']] },
    { id: 'output', label: 'Output this period', type: 'number', value: 4800 },
    { id: 'hours', label: 'Labor hours worked', type: 'number', value: 1600, suffix: 'hours', help: 'Hours actually worked, including overtime; not hours paid for vacation.' },
    { id: 'staff', label: 'Employees (optional)', type: 'number', value: 10 },
    { id: 'prevOutput', label: 'Last period output (optional)', type: 'number', value: 4200 },
    { id: 'prevHours', label: 'Last period hours (optional)', type: 'number', value: 1500, suffix: 'hours' },
    { id: 'standard', label: 'Standard rate per hour (optional)', type: 'number', value: '', placeholder: 'e.g. 3.2', help: 'Engineered or target output per hour, for an efficiency %.' }
  ],
  compute(v, H) {
    if (!(v.output > 0)) return { error: 'Enter the output produced.' };
    if (!(v.hours > 0)) return { error: 'Enter the labor hours worked.' };
    var money = v.kind === 'dollars';
    var fmt = function (x) { return money ? H.money(x) : H.num(x, 2); };
    var rate = function (x) { return money ? H.money(x) : H.fix(x, 2); };
    var unit = money ? '' : ' units';
    var perHour = v.output / v.hours;
    var rows = [];
    if (v.staff > 0) {
      rows.push(['Output per employee', fmt(v.output / v.staff) + unit, true]);
      rows.push(['Hours per employee', H.num(v.hours / v.staff, 1) + ' h']);
    }
    if (!money) rows.push(['Labor minutes per unit', H.num(v.hours * 60 / v.output, 2) + ' min']);
    else rows.push(['Labor hours per $1,000 of output', H.num(v.hours / v.output * 1000, 2) + ' h']);
    var sub = 'Each labor hour produced ' + rate(perHour) + unit + '.';
    if (v.prevOutput > 0 && v.prevHours > 0) {
      var prev = v.prevOutput / v.prevHours;
      var g = (perHour / prev - 1) * 100;
      rows.push(['Last period per hour', rate(prev) + unit]);
      rows.push(['Productivity change', (g >= 0 ? '+' : '') + H.fix(g, 2) + '%', true]);
      rows.push(['Output change', (v.output >= v.prevOutput ? '+' : '') + H.fix((v.output / v.prevOutput - 1) * 100, 2) + '%']);
      rows.push(['Hours change', (v.hours >= v.prevHours ? '+' : '') + H.fix((v.hours / v.prevHours - 1) * 100, 2) + '%']);
      sub = 'Productivity ' + (g >= 0 ? 'rose ' : 'fell ') + H.fix(Math.abs(g), 2) + '% because output ' + (v.output >= v.prevOutput ? 'grew' : 'shrank') + ' ' + (Math.abs(v.output / v.prevOutput - 1) > Math.abs(v.hours / v.prevHours - 1) ? 'faster than' : 'slower than') + ' hours.';
    }
    if (v.standard > 0) rows.push(['Efficiency vs standard', H.fix(perHour / v.standard * 100, 1) + '%', true]);
    return {
      value: rate(perHour),
      label: money ? 'Dollars of output per labor hour' : 'Units per labor hour',
      expr: fmt(v.output) + unit + ' ÷ ' + H.num(v.hours, 2) + ' h',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `Productivity is output divided by input. For labor productivity, divide what was produced by the hours worked: a team of 10 that makes <strong>4,800 units</strong> in <strong>1,600 hours</strong> produces <strong>${r.value} units per hour</strong>, or 480 units per employee. Last period it made 4,200 units in 1,500 hours (2.80 per hour), so productivity rose 7.14%.`,
  stepsTitle: 'How to calculate labor productivity',
  steps: [
    'Pick one measure of output for the period: units made, orders shipped, tickets closed, or revenue. For dollars across years, adjust for inflation first so price increases do not look like productivity.',
    'Total the <strong>hours actually worked</strong>, including overtime, by everyone who contributed. Using headcount or paid hours (with vacation) instead of worked hours is the usual mistake.',
    'Divide output by hours to get output per labor hour. Divide output by employees if you also want output per employee.',
    'Compare periods with the same formula. Productivity growth = (this period per hour ÷ last period per hour − 1) × 100.'
  ],
  formulaTitle: 'What is the productivity formula?',
  formula: {
    expr: 'Productivity = Output ÷ Input<br>Labor productivity = Output ÷ Labor hours<br>Output per employee = Output ÷ Employees<br>Growth % = (New rate ÷ Old rate − 1) × 100',
    vars: [['Output', 'units or real (inflation-adjusted) dollars produced'], ['Labor hours', 'hours worked by all contributing staff'], ['Employees', 'average headcount in the period']],
    note: 'This is the same definition the U.S. Bureau of Labor Statistics uses for national labor productivity: real output per hour worked.'
  },
  example: `<p>A bakery produced 9,000 loaves in March with 4 bakers working 680 hours in total. In April it produced 9,600 loaves with 700 hours.</p>
<p>March: 9,000 ÷ 680 = <strong>13.24 loaves per hour</strong>. April: 9,600 ÷ 700 = <strong>13.71 loaves per hour</strong>.</p>
<p>Productivity growth = 13.71 ÷ 13.24 − 1 = <strong>3.6%</strong>. Output rose 6.7% while hours rose only 2.9%, which is where the gain comes from.</p>
<p>Output per baker in April = 9,600 ÷ 4 = <strong>2,400 loaves</strong>.</p>`,
  table: {
    title: 'What does an hourly productivity rate mean per day, week and year?',
    intro: 'The same rate expressed over an 8-hour day, a 40-hour week and a 2,080-hour work year, plus the labor minutes each unit takes.',
    head: ['Units per hour', 'Per 8-h day', 'Per 40-h week', 'Per 2,080-h year', 'Minutes per unit'],
    rows: ({ run, H }) => [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30, 60].map(p => {
      const r = run({ kind: 'units', output: p * 2080, hours: 2080, staff: 1, prevOutput: '', prevHours: '', standard: '' });
      return [r.value, H.num(p * 8, 1), H.num(p * 40, 1), H.int(p * 2080), H.num(60 / p, 2)];
    })
  },
  sections: [
    {
      h2: 'How do you calculate productivity per employee?',
      html: `<p>Divide total output by the average number of employees in the period. A sales team that closed $2.4 million of revenue with 8 reps produced $300,000 per employee. Use full-time equivalents (FTEs) if you have part-timers: two half-time staff count as one FTE.</p>
<p>Per-employee figures are easy to collect but hide overtime and part-time work, so output per hour is the better measure when you have hour records. Revenue per employee is also used to compare companies, but it mixes productivity with pricing power and outsourcing.</p>`
    },
    {
      h2: 'How is labor productivity measured for the whole economy?',
      html: `<p>The BLS measures U.S. labor productivity as real output of the nonfarm business sector divided by hours worked by everyone in it, including the self-employed. It publishes the series quarterly as an index and as percent changes at annual rates.</p>
<p>Average labor productivity in an economics class is the same idea: real GDP ÷ total hours worked (or ÷ employed workers). If an economy produces $24 trillion of real output with 270 billion hours, average labor productivity is about <strong>$88.89 per hour</strong>. For the GDP side of that ratio, see the <a href="/nominal-gdp-calculator">nominal GDP calculator</a>.</p>`
    },
    {
      h2: 'What is the difference between productivity and efficiency?',
      html: `<p><strong>Productivity</strong> is a rate: output per hour. <strong>Efficiency</strong> compares that rate with a standard: actual output ÷ standard output × 100. If the engineered standard for a packing line is 3.2 cartons per hour and workers average 3.0, production efficiency is 3.0 ÷ 3.2 = 93.75%.</p>
<p>Enter a standard rate in the optional box and the calculator shows efficiency alongside productivity. Physical efficiency (energy out ÷ energy in) is a separate concept; use the <a href="/efficiency-calculator">efficiency calculator</a> for that.</p>`
    },
    {
      h2: 'Why can productivity fall when output rises?',
      html: `<p>Because productivity depends on both numbers. If output grows 5% but hours grow 10%, output per hour falls about 4.5%. This often happens when a business hires ahead of demand, trains new staff, or leans on overtime. Look at the output change and hours change rows the calculator shows to see which side moved.</p>`
    }
  ],
  faq: [
    { q: 'What is the basic formula for productivity?', a: 'Productivity = output ÷ input. For workers, the input is usually hours worked, so labor productivity = units or real dollars produced ÷ labor hours.' },
    { q: 'How do you calculate productivity percentage?', a: 'Divide actual output by the expected (standard) output and multiply by 100. Producing 450 units against a standard of 500 is 90% productivity, a measure also called efficiency.' },
    { q: 'How do you calculate productivity growth?', a: 'Divide this period\'s output per hour by last period\'s and subtract 1. Going from 2.80 to 3.00 units per hour is 3.00 ÷ 2.80 − 1 = 7.14% growth.' },
    { q: 'Should I use revenue or units to measure productivity?', a: 'Use units when the product is uniform. Use revenue or value added when products differ, but deflate dollars by a price index when comparing years so that price increases are not counted as productivity.' },
    { q: 'Do breaks and meetings count as hours worked?', a: 'For productivity, count all paid working time, including short breaks and meetings, because that is the labor cost of the output. Exclude paid vacation, holidays and sick leave.' },
    { q: 'What is multifactor productivity?', a: 'Multifactor (total factor) productivity divides output by a combined index of labor, capital and other inputs. It shows gains not explained by simply adding more workers or equipment. BLS publishes it annually.' },
    { q: 'How do I measure productivity for knowledge workers?', a: 'Pick a countable output that reflects value, such as tickets resolved, features shipped or cases closed, and divide by hours. Track quality alongside it so speed is not rewarded over accuracy.' }
  ],
  related: ['utilization-rate-calculator', 'efficiency-calculator', 'percentage-change-calculator', 'time-card-calculator', 'nominal-gdp-calculator'],
  sources: [
    { name: 'U.S. Bureau of Labor Statistics: Productivity program', url: 'https://www.bls.gov/productivity/' },
    { name: 'OpenStax Principles of Economics 3e: Production in the short run', url: 'https://openstax.org/books/principles-economics-3e/pages/7-2-production-in-the-short-run' }
  ]
};
