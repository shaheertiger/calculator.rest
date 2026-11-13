export default {
  slug: 'electricity-cost-calculator',
  hub: 'electrical',
  name: 'Electricity Cost Calculator',
  title: 'Electricity Cost Calculator: 900 kWh at 17.23¢ Is $155.07',
  h1: 'Electric Bill Calculator: Cost from Meter Readings or Appliance Watts',
  meta: 'Subtract meter readings to get kWh, then multiply by your rate: 900 kWh at the 2025 U.S. average of 17.23¢ is $155.07. Also prices appliances by watts or amps.',
  keyword: 'how to calculate your electric bill',
  also: ['how do you calculate your electricity bill', 'electricity cost calculator', 'how to calculate electric meter reading', 'how do you calculate kwh from amps', 'how to calculate kwh from amps', 'cost to run appliance calculator', 'how much does it cost to run a space heater'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate from', type: 'select', value: 'meter', options: [['meter', 'Meter readings (monthly bill)'], ['watts', 'Appliance watts'], ['amps', 'Appliance amps and volts']] },
    { id: 'prev', label: 'Previous meter reading', type: 'number', value: 48312, suffix: 'kWh', showIf: { mode: ['meter'] } },
    { id: 'curr', label: 'Current meter reading', type: 'number', value: 49212, suffix: 'kWh', showIf: { mode: ['meter'] } },
    { id: 'watts', label: 'Appliance power', type: 'number', value: 1500, suffix: 'W', showIf: { mode: ['watts'] } },
    { id: 'amps', label: 'Current', type: 'number', value: 10, suffix: 'A', showIf: { mode: ['amps'] } },
    { id: 'volts', label: 'Voltage', type: 'number', value: 120, suffix: 'V', showIf: { mode: ['amps'] } },
    { id: 'hours', label: 'Hours used per day', type: 'number', value: 8, suffix: 'h', showIf: { mode: ['watts', 'amps'] } },
    { id: 'days', label: 'Days in the period', type: 'number', value: 30, suffix: 'days', help: 'Your billing cycle, usually 28–33 days.' },
    { id: 'rate', label: 'Electricity rate', type: 'number', value: 17.23, suffix: '¢/kWh', help: 'Default: EIA 2025 U.S. average residential price. Use the all-in rate from your bill.' },
    { id: 'fixed', label: 'Fixed monthly charge (optional)', type: 'number', value: 0, prefix: '$', help: 'Only if your rate above excludes the customer/service charge.', showIf: { mode: ['meter'] } }
  ],
  compute(v, H) {
    if (!(v.rate >= 0)) return { error: 'Enter your electricity rate in cents per kWh.' };
    if (!(v.days > 0)) return { error: 'Enter the number of days.' };
    var r = v.rate / 100, rows, kwh, cost, expr;
    if (v.mode === 'meter') {
      if (!(v.prev >= 0) || !(v.curr >= 0)) return { error: 'Enter both meter readings.' };
      if (v.curr < v.prev) return { error: 'The current reading should be higher than the previous one (check for a meter rollover).' };
      kwh = v.curr - v.prev;
      var fixed = v.fixed > 0 ? v.fixed : 0;
      cost = kwh * r + fixed;
      expr = H.num(kwh, 0) + ' kWh × ' + H.num(v.rate, 2) + '¢' + (fixed ? ' + ' + H.money(fixed) : '');
      rows = [['Electricity used', H.num(kwh, 0) + ' kWh', true], ['Energy charge', H.money(kwh * r)]];
      if (fixed) rows.push(['Fixed charge', H.money(fixed)]);
      rows.push(['Average per day', H.num(kwh / v.days, 1) + ' kWh · ' + H.money(cost / v.days)]);
      rows.push(['Effective rate', H.num(kwh ? cost / kwh * 100 : 0, 2) + '¢/kWh']);
      return { value: H.money(cost), label: 'Bill for ' + H.num(v.days, 0) + ' days', expr: expr, rows: rows, sub: 'Taxes, tiered or time-of-use rates and riders can move the real bill a few percent either way.' };
    }
    var w;
    if (v.mode === 'amps') {
      if (!(v.amps > 0) || !(v.volts > 0)) return { error: 'Enter the current and voltage.' };
      w = v.amps * v.volts;
    } else {
      if (!(v.watts > 0)) return { error: 'Enter the appliance wattage.' };
      w = v.watts;
    }
    if (!(v.hours > 0 && v.hours <= 24)) return { error: 'Enter hours per day between 0 and 24.' };
    var day = w * v.hours / 1000;
    kwh = day * v.days; cost = kwh * r;
    rows = [
      ['Energy for the period', H.num(kwh, 1) + ' kWh', true],
      ['Cost per hour of use', H.money(w / 1000 * r)],
      ['Cost per day', H.money(day * r)],
      ['Cost per year at this use', H.money(day * 365 * r, 0)]
    ];
    if (v.mode === 'amps') rows.unshift(['Power (amps × volts)', H.num(w, 0) + ' W']);
    return {
      value: H.money(cost), label: 'Cost for ' + H.num(v.days, 0) + ' days',
      expr: H.num(w, 0) + ' W × ' + H.num(v.hours, 2) + ' h × ' + H.num(v.days, 0) + ' d ÷ 1,000 × ' + H.num(v.rate, 2) + '¢',
      rows: rows,
      sub: 'Assumes the appliance draws full power whenever it is on; thermostats and compressors that cycle use less.'
    };
  },
  quick: ({ r }) => `To calculate your electric bill, subtract last month's meter reading from this month's to get kWh used, then multiply by your rate. <strong>49,212 − 48,312 = 900 kWh</strong>, and 900 × 17.23¢ = <strong>${r.value}</strong>. 17.23¢ is the EIA's 2025 U.S. average residential price, which already folds in delivery and fixed charges; swap in the all-in rate from your own bill.`,
  stepsTitle: 'How to calculate your electric bill',
  steps: [
    'Read your meter at the start and end of the billing period (or take both readings from your bill). Subtract the earlier reading from the later one to get kWh used.',
    'Find your rate. Divide the bill\'s total electricity charges by the kWh billed to get an all-in rate per kWh. <strong>Using only the "supply" or "generation" rate understates the bill</strong>, because delivery charges are often a third or more of the total.',
    'Multiply kWh by the rate in dollars (17.23¢ = $0.1723).',
    'If you used a supply-only rate, add the fixed customer charge, delivery charges and taxes listed on the bill.'
  ],
  formulaTitle: 'What is the formula for electricity cost?',
  formula: {
    expr: 'Bill = (current reading − previous reading) × rate + fixed charges<br>Appliance cost = watts × hours ÷ 1,000 × rate<br>Watts from amps = amps × volts',
    vars: [['reading', 'meter reading in kWh'], ['rate', 'price per kWh in dollars'], ['watts', 'appliance power from the nameplate'], ['hours', 'hours of use in the period']]
  },
  example: `<p>A 1,500 W space heater runs 8 hours a day for 30 days at 17.23¢/kWh.</p>
<p>Energy = 1,500 × 8 × 30 ÷ 1,000 = <strong>360 kWh</strong>. Cost = 360 × $0.1723 = <strong>$62.03</strong> for the month, or 1.5 × $0.1723 = about 26¢ for every hour it runs.</p>
<p>At a 12¢ rate the same heater costs $43.20 a month; at 30¢ it costs $108.</p>`,
  table: {
    title: 'How much does it cost to run common appliances?',
    intro: 'Monthly cost at the EIA 2025 U.S. average of 17.23¢ per kWh, for typical wattages and daily use. Your appliance\'s nameplate and habits will differ.',
    head: ['Appliance', 'Typical watts', 'Hours/day', 'kWh/month', 'Cost/month'],
    rows: ({ run, H }) => [['LED bulb', 10, 5], ['Ceiling fan', 50, 8], ['Laptop', 60, 8], ['TV', 100, 5], ['Gaming console', 150, 3], ['Desktop PC', 250, 6], ['Window AC', 900, 8], ['Microwave', 1100, 0.5], ['Hair dryer', 1500, 0.25], ['Space heater', 1500, 8], ['Central AC', 3500, 8], ['Electric water heater', 4500, 3], ['EV on Level 2', 7200, 1.5]].map(([n, w, h]) => {
      const r = run({ mode: 'watts', watts: w, hours: h, days: 30, rate: 17.23 });
      return [n, H.num(w, 0) + ' W', String(h), r.rows[0][1].replace(' kWh', ''), r.value];
    }),
    note: 'Air conditioners, water heaters and refrigerators cycle on and off, so "hours/day" here means hours at full power. Check the yellow EnergyGuide label for a model\'s yearly kWh.'
  },
  sections: [
    {
      h2: 'How do you calculate kWh from amps?',
      html: `<p>Multiply amps by volts to get watts, multiply by hours, then divide by 1,000: kWh = A × V × h ÷ 1,000. A tool drawing 10 A on a 120 V outlet for 8 hours uses 10 × 120 × 8 ÷ 1,000 = <strong>9.6 kWh</strong>, which costs $1.65 at 17.23¢.</p>
<p>This works exactly for heaters and other resistive loads. For motors and electronics, the amps on the label include current that does no billable work (power factor below 1), so amps × volts slightly overstates what your meter records. Choose <em>Appliance amps and volts</em> above for this method; for power factor and three-phase, see the <a href="/kw-calculator">kW calculator</a>.</p>`
    },
    {
      h2: 'How do you read an electric meter?',
      html: `<p><strong>Digital meters</strong> show kWh directly; some cycle through several screens, so note the one labeled kWh (often a code like "1.8.0" or a total-import register). Smart meters also show readings in your utility's app.</p>
<p><strong>Dial meters</strong> have four or five small clocks. Read them left to right, writing down the number each pointer has just passed. Neighboring dials turn in opposite directions, and if a pointer sits between two numbers, take the lower one (between 9 and 0, take 9). If a pointer looks exactly on a number, check the dial to its right: unless that one has passed zero, use the lower number.</p>
<p>Subtract last month's reading from today's. If the new reading is lower, the meter rolled over: add 10,000 (four dials) or 100,000 (five dials) to the new reading first. If you have solar with net metering, your bill uses net kWh, which the meter shows on separate import and export registers.</p>`
    },
    {
      h2: 'Why is my electric bill higher than kWh × rate?',
      html: `<ul><li><strong>Fixed customer charge:</strong> a flat monthly fee, often $10 to $20 or more, charged even at zero use.</li>
<li><strong>Delivery vs. supply:</strong> many bills split generation (supply) and transmission/distribution (delivery). Both are per-kWh charges; add them.</li>
<li><strong>Tiered rates:</strong> the price per kWh steps up after a monthly allowance.</li>
<li><strong>Time-of-use rates:</strong> peak hours (often late afternoon and evening) can cost two or three times off-peak.</li>
<li><strong>Riders, fuel adjustments and taxes:</strong> line items that change month to month.</li></ul>
<p>The fix is to calculate your own all-in rate: total electric charges ÷ kWh billed. Put that in the rate box, and the calculator matches your bill.</p>`
    },
    {
      h2: 'What is the average electric bill in the U.S.?',
      html: `<p>Roughly $150 to $160 a month at current prices. The EIA reports that the average residential customer bought about 899 kWh per month in 2022 (its most recent figure in that series), and the U.S. average residential price was <strong>17.23¢/kWh in 2025</strong>, up from 16.48¢ in 2024. 900 kWh × 17.23¢ = $155.07. Preliminary EIA data put the 2026 average through August at 18.19¢, so this year's bills are running higher.</p>
<p>State averages vary widely: in August 2026 residential prices ran from about 12.7¢ in Nevada and 12.9¢ in Louisiana to 29.8¢ in California and 47.2¢ in Hawaii. Use is highest in Southern homes, which rely more on electric heat and air conditioning. Your own bill is the only reliable rate to use.</p>`
    }
  ],
  faq: [
    { q: 'How much does it cost to run a 1,500 W heater for an hour?', a: 'About 26 cents at the 2025 U.S. average of 17.23¢/kWh: 1.5 kW × 1 hour = 1.5 kWh × $0.1723 = $0.26.' },
    { q: 'How do I calculate my electric bill per day?', a: 'Divide the kWh used in the billing period by the number of days, then multiply by your rate. 900 kWh over 30 days is 30 kWh a day, about $5.17 at 17.23¢.' },
    { q: 'How many kWh does a house use per month?', a: 'The EIA puts the U.S. average at about 899 kWh per month (2022), but it ranges from roughly 500 kWh in mild-climate states to well over 1,000 kWh where electric cooling and heating dominate.' },
    { q: 'How do I calculate the cost of electricity per kWh from my bill?', a: 'Divide the total electricity charges (including delivery, fixed fees and taxes) by the total kWh billed. A $132 bill for 760 kWh is an all-in rate of 17.4¢ per kWh.' },
    { q: 'What uses the most electricity in a home?', a: 'Air conditioning is the largest single use, about 19% of U.S. household electricity in EIA\'s 2020 survey, followed by space heating and water heating at about 12% each. Refrigerators, lighting, laundry and electronics make up most of the rest.' },
    { q: 'Does unplugging appliances save money?', a: 'A little. Standby draw from TVs, game consoles and chargers is often 1 to 10 watts per device. A device drawing 5 W around the clock uses 3.6 kWh a month, about 62¢ at 17.23¢/kWh.' },
    { q: 'What if my meter reading went down?', a: 'Either the meter rolled past 9999 or 99999, or you have solar and are exporting more than you import. For a rollover, add 10,000 or 100,000 to the new reading before subtracting.' }
  ],
  related: ['ev-charging-cost-calculator', 'kw-calculator', 'solar-panel-calculator', 'watt-hours-calculator', 'amps-calculator'],
  sources: [
    { name: 'U.S. EIA: Electric Power Monthly, Table 5.3 Average Price of Electricity', url: 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_3' },
    { name: 'U.S. EIA: Average Price of Electricity by State (Table 5.6.A)', url: 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a' },
    { name: 'U.S. EIA: How much electricity does an American home use?', url: 'https://www.eia.gov/tools/faqs/faq.php?id=97&t=3' },
    { name: 'U.S. EIA: Electricity use in homes', url: 'https://www.eia.gov/energyexplained/use-of-energy/electricity-use-in-homes.php' }
  ]
};
