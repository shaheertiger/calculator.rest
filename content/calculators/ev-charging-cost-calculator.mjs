export default {
  slug: 'ev-charging-cost-calculator',
  hub: 'science',
  name: 'EV Charging Cost Calculator',
  title: 'EV Charging Cost Calculator: 48 kWh at $0.15/kWh = $8.00',
  meta: 'Adding 48 kWh at 90% charging efficiency and an example price of $0.15 per kWh costs $8.00. Find the cost of a charge, a top-up or a trip, with steps.',
  keyword: 'ev charging cost calculator',
  also: ['electric car charging cost calculator', 'cost to charge an electric car', 'ev cost per mile', 'kwh cost calculator'],
  updated: '2026-11-26',
  answer: ({ r }) => `Putting 48 kWh into the battery at 90% charging efficiency costs <strong>${r.value}</strong> at $0.15 per kWh: 48 ÷ 0.9 × 0.15.`,
  inputs: [
    { id: 'mode', label: 'I know', type: 'select', value: 'kwh', wide: true, options: [['kwh', 'The kWh to add to the battery'], ['pct', 'The battery size and charge levels (from % to %)'], ['trip', 'The miles to drive and the miles per kWh']] },
    { id: 'kwh', label: 'Energy to add', type: 'number', value: 48, suffix: 'kWh', showIf: { mode: ['kwh'] } },
    { id: 'bat', label: 'Battery size', type: 'number', value: 80, suffix: 'kWh', showIf: { mode: ['pct'] } },
    { id: 'from', label: 'Charge from', type: 'number', value: 20, suffix: '%', showIf: { mode: ['pct'] } },
    { id: 'to', label: 'Charge to', type: 'number', value: 80, suffix: '%', showIf: { mode: ['pct'] } },
    { id: 'miles', label: 'Miles to drive', type: 'number', value: 300, suffix: 'mi', showIf: { mode: ['trip'] } },
    { id: 'mpk', label: 'Miles per kWh', type: 'number', value: 3.5, suffix: 'mi/kWh', showIf: { mode: ['trip'] } },
    { id: 'eff', label: 'Charging efficiency', type: 'number', value: 90, suffix: '%', help: 'Use 100% if your kWh already include losses.' },
    { id: 'price', label: 'Price per kWh', type: 'number', value: 0.15, prefix: '$', help: 'Example price only: enter your own rate.' }
  ],
  compute(v, H) {
    if (!(v.eff > 0 && v.eff <= 100)) return { error: 'Enter a charging efficiency above 0% and no more than 100%.' };
    if (!(v.price >= 0)) return { error: 'Enter the price per kWh in dollars (15¢ is 0.15).' };
    var f = function (x) { return H.num(x, 10); };
    var p6 = function (x) { return H.num(x, 6); };
    var d = function (x, dp) { return '$' + (Math.abs(H.round(x, 2) - x) < 1e-9 ? H.fix(x, 2) : H.num(x, dp || 6)); };
    var st = [], k;
    if (v.mode === 'pct') {
      if (!(v.bat > 0)) return { error: 'Enter the battery size in kWh.' };
      if (!(v.from >= 0 && v.to <= 100 && v.to > v.from)) return { error: 'The charge-to level must be above the charge-from level, between 0% and 100%.' };
      k = v.bat * (v.to - v.from) / 100;
      st.push('<b>Formula:</b> kWh added = battery size × (end % − start %) ÷ 100, then cost = (kWh added ÷ charging efficiency) × price per kWh');
      st.push('<b>Find the kWh added:</b> ' + f(v.bat) + ' kWh × (' + f(v.to) + '% − ' + f(v.from) + '%) = ' + f(v.bat) + ' kWh × ' + f((v.to - v.from) / 100) + ' = ' + p6(k) + ' kWh');
    } else if (v.mode === 'trip') {
      if (!(v.miles > 0) || !(v.mpk > 0)) return { error: 'Enter the miles to drive and the miles per kWh.' };
      k = v.miles / v.mpk;
      st.push('<b>Formula:</b> kWh used = miles ÷ miles per kWh, then cost = (kWh used ÷ charging efficiency) × price per kWh');
      st.push('<b>Find the kWh used:</b> ' + f(v.miles) + ' mi ÷ ' + f(v.mpk) + ' mi/kWh = ' + p6(k) + ' kWh. The miles cancel.');
    } else {
      if (!(v.kwh > 0)) return { error: 'Enter the kWh to add to the battery.' };
      k = v.kwh;
      st.push('<b>Formula:</b> cost = (kWh added ÷ charging efficiency) × price per kWh');
    }
    var e = v.eff / 100, grid = k / e, cost = grid * v.price;
    st.push('<b>Substitute:</b> cost = (' + p6(k) + ' kWh ÷ ' + f(v.eff) + '%) × ' + d(v.price) + ' per kWh');
    st.push('<b>Turn the efficiency into a decimal:</b> ' + f(v.eff) + ' ÷ 100 = ' + f(e));
    st.push('<b>Divide:</b> ' + p6(k) + ' kWh ÷ ' + f(e) + ' = ' + p6(grid) + ' kWh drawn from the charger');
    st.push('<b>Multiply by the price:</b> ' + p6(grid) + ' kWh × ' + d(v.price) + '/kWh = ' + d(cost) + ' (the kWh cancel, leaving dollars)');
    st.push('<b>Answer:</b> the charge costs ' + H.money(cost) + ', rounded to the nearest cent' + (v.mode === 'trip' ? ', or ' + d(cost / v.miles, 4) + ' per mile.' : '.'));
    var rows = [['Energy from the charger', H.num(grid, 2) + ' kWh'], ['Lost while charging', H.num(grid - k, 2) + ' kWh'], ['Cost per kWh that reaches the battery', d(v.price / e, 4)]];
    if (v.mode === 'trip') rows.push(['Cost per mile', d(cost / v.miles, 4)]);
    return { value: H.money(cost), label: v.mode === 'trip' ? 'Charging cost for the trip' : 'Cost of this charge', rows: rows, steps: st };
  },
  facts: {
    formula: 'cost = (E ÷ η) × p<br>E = battery size × (end % − start %) ÷ 100<br>E = miles ÷ miles per kWh',
    vars: [['E', 'energy that ends up in the battery, in kWh'], ['η', 'charging efficiency as a decimal: 90% = 0.9'], ['p', 'price per kWh in dollars, from your bill or the charger'], ['E ÷ η', 'energy drawn from the charger, which is what you pay for']],
    rounding: 'carry full precision through the division and round the cost to the nearest cent at the end.',
    note: 'The $0.15 default is an example input, not a quoted rate. Electricity prices vary by utility, time of day and charger, so enter the price you actually pay.'
  },
  example: {
    h2: 'Worked example: topping up a 75 kWh battery',
    html: `<p><strong>Problem:</strong> A car has a 75 kWh battery. It is charged from 30% to 90% on a charger that costs $0.40 per kWh, and 92% of the energy from the charger reaches the battery. What does the charge cost?</p>
<p><strong>1.</strong> Energy added: 75 kWh × (90% − 30%) = 75 × 0.6 = 45 kWh.</p>
<p><strong>2.</strong> Energy drawn from the charger: 45 kWh ÷ 0.92 = 48.913043 kWh.</p>
<p><strong>3.</strong> Cost: 48.913043 kWh × $0.40 per kWh = $19.565217.</p>
<p><strong>Answer:</strong> $19.57 to the nearest cent. Sense check: with no losses, 45 kWh × $0.40 = $18, and losing 8% of the energy should add a little over $1.50, which it does.</p>`
  },
  variants: [
    {
      h2: 'How much does it cost to charge an electric car from 20% to 80%?',
      html: `<p>For an 80 kWh battery, 20% to 80% adds 80 × 0.6 = 48 kWh. At 90% charging efficiency that draws 48 ÷ 0.9 = 53.333333 kWh, and at an example price of $0.15 per kWh the charge costs <strong>$8.00</strong>. The cost scales with the price: at $0.30 per kWh the same charge is $16.00. Pick "battery size and charge levels" to enter your own car.</p>`
    },
    {
      h2: 'How do you work out the charging cost per mile?',
      html: `<p>Divide the price per kWh by the charging efficiency and by the miles per kWh. At $0.15, 90% and 3.5 miles per kWh: 0.15 ÷ 0.9 ÷ 3.5 = <strong>$0.0476 per mile</strong>, about 4.8 cents. A 300-mile trip uses 300 ÷ 3.5 = 85.714286 kWh of battery energy, draws 95.238095 kWh from the charger and costs $14.29.</p>`
    }
  ],
  mistakes: [
    '<strong>Leaving out charging losses.</strong> 48 kWh × $0.15 = $7.20 is what the battery holds, not what you pay for. Dividing by 0.9 first gives the true $8.00.',
    '<strong>Multiplying by the efficiency instead of dividing.</strong> 48 × 0.9 × $0.15 = $6.48 makes losses lower the bill. Losses always mean you buy more energy than the battery stores.',
    '<strong>Using the whole battery for a partial charge.</strong> Charging 20% to 80% adds 60% of 80 kWh, which is 48 kWh, not 80 kWh.',
    '<strong>Typing cents as dollars.</strong> 15¢ per kWh is $0.15. Entering 15 makes the 48 kWh charge cost $800.'
  ],
  related: ['efficiency-calculator', 'percentage-calculator', 'speed-calculator', 'time-duration-calculator'],
  faq: [
    { q: 'Is $0.15 per kWh the real price of electricity?', a: 'No. It is only an example input so the calculator has numbers to show. Your rate depends on your utility, the time of day and the charger, so read it from your bill or the charger screen.' },
    { q: 'How do I enter a price in cents per kWh?', a: 'Divide by 100 to get dollars. 17.5¢ per kWh is $0.175, and 42¢ is $0.42.' },
    { q: 'What charging efficiency should I use?', a: 'Use the figure your problem gives. If your kWh number was measured at the charger, it already includes the losses, so enter 100%.' },
    { q: 'How long will the charge take?', a: 'Divide the kWh drawn from the charger by the charger power in kW. 53.333333 kWh on a 7.2 kW charger takes 53.333333 ÷ 7.2 = 7.41 hours.' }
  ],
  sources: [
    { name: 'OpenStax College Physics 2e: 7.6 Conservation of Energy (efficiency)', url: 'https://openstax.org/books/college-physics-2e/pages/7-6-conservation-of-energy' }
  ]
};
