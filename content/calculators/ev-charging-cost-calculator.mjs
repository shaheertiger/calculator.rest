export default {
  slug: 'ev-charging-cost-calculator',
  hub: 'electrical',
  name: 'EV Charging Cost Calculator',
  title: 'EV Charging Cost Calculator: 80 kWh, 20% to 80% Costs $9.19',
  h1: 'Electric Car Charging Cost Calculator: Cost per Charge and per Mile',
  meta: 'Charging an 80 kWh EV from 20% to 80% at home costs about $9.19 at the U.S. average 17.23¢/kWh, after 10% charging loss. That is 5.2¢ a mile vs 13.3¢ for gas.',
  keyword: 'how to calculate the cost of charging an electric car',
  also: ['how to calculate ev charging cost', 'ev charging cost calculator', 'cost to charge electric car calculator', 'electric car cost per mile', 'how much does it cost to charge a tesla'],
  updated: '2026-11-13',
  inputs: [
    { id: 'battery', label: 'Battery size (usable)', type: 'number', value: 80, suffix: 'kWh', help: 'From the manufacturer\'s spec sheet; use usable capacity if listed.' },
    { id: 'start', label: 'Charge from', type: 'number', value: 20, suffix: '%' },
    { id: 'end', label: 'Charge to', type: 'number', value: 80, suffix: '%' },
    { id: 'rate', label: 'Electricity price', type: 'number', value: 17.23, suffix: '¢/kWh', help: 'Default: EIA 2025 U.S. average residential price. Public fast chargers usually cost much more.' },
    { id: 'eff', label: 'Charging efficiency', type: 'number', value: 90, suffix: '%', help: 'Share of wall energy that reaches the battery; often 84–93%.' },
    { id: 'cons', label: 'Vehicle efficiency', type: 'number', value: 30, suffix: 'kWh/100 mi', help: 'The EPA rating on the window sticker or fueleconomy.gov.' },
    { id: 'charger', label: 'Charger power', type: 'number', value: 7.2, suffix: 'kW', help: '1.4–1.9 kW for a 120 V outlet; 7.2 kW for a typical 240 V, 30 A home charger.' },
    { id: 'gas', label: 'Gas price (for comparison)', type: 'number', value: 4.00, prefix: '$', suffix: '/gal' },
    { id: 'mpg', label: 'Gas car fuel economy', type: 'number', value: 30, suffix: 'mpg' }
  ],
  compute(v, H) {
    if (!(v.battery > 0)) return { error: 'Enter the battery size in kWh.' };
    if (!(v.start >= 0 && v.end <= 100 && v.end > v.start)) return { error: 'Charge-to must be higher than charge-from, between 0% and 100%.' };
    if (!(v.rate >= 0)) return { error: 'Enter the electricity price in cents per kWh.' };
    if (!(v.eff > 0 && v.eff <= 100)) return { error: 'Charging efficiency must be between 1% and 100%.' };
    var added = v.battery * (v.end - v.start) / 100;
    var grid = added / (v.eff / 100);
    var cost = grid * v.rate / 100;
    var rows = [
      ['Energy into the battery', H.num(added, 1) + ' kWh'],
      ['Energy from the wall', H.num(grid, 1) + ' kWh'],
      ['Lost to charging', H.num(grid - added, 1) + ' kWh · ' + H.money((grid - added) * v.rate / 100)],
      ['Full charge (0–100%)', H.money(v.battery / (v.eff / 100) * v.rate / 100)]
    ];
    var sub = '';
    if (v.cons > 0) {
      var miles = grid * 100 / v.cons;
      var cpm = v.rate / 100 * v.cons / 100;
      rows.push(['Miles added (approx.)', H.num(miles, 0) + ' mi']);
      rows.push(['Electric cost per mile', H.num(cpm * 100, 1) + '¢', true]);
      if (v.gas > 0 && v.mpg > 0) {
        var gasCost = miles / v.mpg * v.gas;
        rows.push(['Gas cost for the same miles', H.money(gasCost) + ' (' + H.num(v.gas / v.mpg * 100, 1) + '¢/mi)']);
        sub = 'Charging saves ' + H.money(gasCost - cost) + ' over a ' + H.num(v.mpg, 0) + ' mpg car for these ' + H.num(miles, 0) + ' miles.';
      }
    }
    if (v.charger > 0) rows.push(['Time at ' + H.num(v.charger, 1) + ' kW', H.dur(grid / v.charger * 60)]);
    return { value: H.money(cost), label: 'Cost of this charge', expr: H.num(grid, 1) + ' kWh × ' + H.num(v.rate, 2) + '¢', rows: rows, sub: sub || 'Enter vehicle efficiency to see cost per mile.' };
  },
  quick: ({ r }) => `To calculate the cost of charging an electric car, multiply the kWh you add by your electricity price and allow for charging losses. Taking an <strong>80 kWh</strong> battery from 20% to 80% adds 48 kWh; at 90% efficiency that is 53.3 kWh from the wall, and at 17.23¢/kWh it costs <strong>${r.value}</strong>. That works out to about 5.2¢ a mile.`,
  stepsTitle: 'How to calculate EV charging cost',
  steps: [
    'Find the usable battery size in kWh and how much you will add. 20% to 80% of 80 kWh is 0.60 × 80 = 48 kWh.',
    'Divide by charging efficiency to get the energy your meter records. <strong>Forgetting charging losses understates cost by roughly 10–15%</strong>: 48 kWh ÷ 0.90 = 53.3 kWh.',
    'Multiply by your price per kWh, using your utility\'s all-in or off-peak EV rate (53.3 × $0.1723 = $9.19).',
    'For cost per mile, multiply your rate by the car\'s EPA kWh per 100 miles and divide by 100. EPA figures are measured at the wall, so they already include charging losses.'
  ],
  formulaTitle: 'What is the formula for EV charging cost?',
  formula: {
    expr: 'Cost = battery kWh × (end % − start %) ÷ charging efficiency × price per kWh<br>Cost per mile = price per kWh × (kWh per 100 mi ÷ 100)<br>Charge time ≈ wall kWh ÷ charger kW',
    vars: [['battery kWh', 'usable pack capacity'], ['charging efficiency', 'battery energy ÷ wall energy, typically 0.84–0.93'], ['kWh per 100 mi', 'the EPA efficiency rating'], ['charger kW', 'the smaller of the charger\'s and the car\'s onboard-charger limit']]
  },
  example: `<p>A driver covers 1,000 miles a month in an EV rated 28 kWh/100 mi, charging at home on a 13¢ off-peak rate.</p>
<p>Electricity = 1,000 × 0.28 = 280 kWh. Cost = 280 × $0.13 = <strong>$36.40 a month</strong>, or 3.6¢ a mile.</p>
<p>The same 1,000 miles in a 30 mpg car at $4.00 a gallon takes 33.3 gallons, or <strong>$133.33</strong>. Charging at a DC fast charger priced at 50¢/kWh instead would cost $140, about the same as gas.</p>`,
  table: {
    title: 'How much does it cost to charge an EV from 20% to 80%?',
    intro: 'Cost of a 20%-to-80% session at different electricity prices, including 10% charging loss. 17.23¢ is the 2025 U.S. residential average; the higher prices are typical of public charging.',
    head: ['Usable battery', '12¢/kWh', '17.23¢/kWh', '30¢/kWh', '50¢/kWh'],
    rows: ({ run }) => [40, 50, 60, 75, 80, 100, 120, 135].map(b => [b + ' kWh', ...[12, 17.23, 30, 50].map(p => run({ battery: b, start: 20, end: 80, rate: p, eff: 90 }).value)]),
    note: 'Prices at public stations vary by network, location, time of day and membership plan, and some bill per minute rather than per kWh. Check the price in the network\'s app before plugging in.'
  },
  sections: [
    {
      h2: 'How much does it cost to charge at home vs. a public fast charger?',
      html: `<p>Home charging costs whatever you pay for electricity, which averaged 17.23¢ per kWh nationwide in 2025 according to EIA. Many utilities offer time-of-use or EV plans with overnight prices well below the average, which can cut the cost of the default charge from $9.19 to $5–7.</p>
<p>DC fast chargers sell convenience: a 20–80% top-up in roughly half an hour on many cars, at prices that are commonly two to three times home rates or more. Level 2 chargers at workplaces, hotels and shopping centers range from free to similar to fast-charging prices. A useful rule: if public charging costs more than your gas car's cost per mile, it only makes sense for road trips.</p>`
    },
    {
      h2: 'How do you calculate EV cost per mile?',
      html: `<p>Multiply your electricity price by the car's efficiency. The Department of Energy's example: at 10.7¢/kWh, a car using 27 kWh per 100 miles costs about 3¢ a mile (0.107 × 0.27 = 2.9¢). At the 2025 average of 17.23¢ and 30 kWh/100 mi, it is 5.2¢.</p>
<p>For a gas car, divide the price per gallon by mpg: $4.00 ÷ 30 mpg = 13.3¢ a mile. EIA's weekly survey had U.S. regular gasoline just under $4.00 a gallon on Nov 9, 2026. To compare trips in a gas car, the <a href="/trip-gas-cost-calculator">trip gas cost calculator</a> does the same arithmetic for a route.</p>
<p>Efficiency drops in winter, when the car spends energy heating the cabin and battery, and at sustained highway speeds, so real-world kWh per 100 miles can be well above the EPA figure. If your car shows its own average consumption, enter that instead for a truer cost per mile.</p>`
    },
    {
      h2: 'How much electricity is lost when charging an electric car?',
      html: `<p>Usually 7–16%. The EPA and DOE's fueleconomy.gov puts typical battery charging efficiency at 84% to 93%. The losses come from the onboard charger converting AC to DC, battery heating or cooling during the session, and the car's electronics staying awake.</p>
<p>Level 1 charging on a 120 V outlet tends to be at the low end, because the car's fixed overhead runs for many more hours. Level 2 is usually more efficient. DC fast charging bypasses the onboard charger, but the station's own losses are built into its price.</p>`
    },
    {
      h2: 'How long does it take to charge?',
      html: `<p>Divide the wall energy by the charger's power. The default session needs 53.3 kWh, which takes about 7 hours 24 minutes on a 7.2 kW home charger. According to the DOE Alternative Fuels Data Center:</p>
<ul><li><strong>Level 1 (120 V):</strong> about 1.9 kW, roughly 5 miles of range per hour. Eight hours overnight adds around 40 miles.</li>
<li><strong>Level 2 (240 V):</strong> 2.9 to 19.2 kW. Most home units run at 30 A (7.2 kW) on a 40 A circuit, adding roughly 25 miles of range per hour.</li>
<li><strong>DC fast:</strong> up to 500 kW at the station, though most cars accept far less and slow down above about 80%.</li></ul>
<p>Installing a Level 2 charger is a continuous load under NEC Article 625, so the circuit must be rated at 125% of the charger current.</p>`
    }
  ],
  faq: [
    { q: 'How much does it cost to fully charge an electric car?', a: 'Multiply usable battery kWh by your rate and divide by about 0.9 for losses. An 80 kWh battery from empty costs about $15.32 at 17.23¢/kWh, but drivers rarely charge from 0% to 100%.' },
    { q: 'How much does it cost to charge a Tesla?', a: 'The same formula applies to any EV. A car with a 75 kWh usable battery charged from 20% to 80% at 17.23¢/kWh costs about $8.62 at home, including 10% charging loss. Supercharger prices vary by location and time.' },
    { q: 'Is it cheaper to charge an EV than buy gas?', a: 'At home, usually by a wide margin: about 5.2¢ a mile at the U.S. average electricity price for a 30 kWh/100 mi car, versus 13.3¢ for a 30 mpg car at $4.00 a gallon. Frequent fast charging narrows or erases the gap.' },
    { q: 'How many kWh does it take to charge an electric car?', a: 'Battery kWh added divided by charging efficiency. Adding 48 kWh to the battery draws about 53.3 kWh from the wall at 90% efficiency.' },
    { q: 'How much will an EV add to my electric bill?', a: 'Monthly miles × kWh per 100 miles ÷ 100 × your rate. 1,000 miles at 30 kWh/100 mi is 300 kWh, about $51.69 a month at 17.23¢/kWh.' },
    { q: 'Should I charge to 100%?', a: 'Many manufacturers recommend a daily limit around 80% for lithium-ion batteries and 100% only before long trips, though some LFP-battery cars recommend regular full charges. Follow your owner\'s manual.' },
    { q: 'Does cold weather increase charging cost?', a: 'Yes. Battery heating during charging adds losses, and the car uses more energy per mile in cold weather for cabin heat, so cost per mile rises even though the price per kWh is unchanged.' }
  ],
  related: ['electricity-cost-calculator', 'trip-gas-cost-calculator', 'mpg-calculator', 'kw-calculator', 'solar-panel-calculator'],
  sources: [
    { name: 'DOE Alternative Fuels Data Center: Charging Electric Vehicles at Home', url: 'https://afdc.energy.gov/fuels/electricity-charging-home' },
    { name: 'DOE Alternative Fuels Data Center: Developing Infrastructure to Charge Electric Vehicles', url: 'https://afdc.energy.gov/fuels/electricity-stations' },
    { name: 'FuelEconomy.gov: All-Electric Vehicles (charging efficiency)', url: 'https://www.fueleconomy.gov/feg/evtech.shtml' },
    { name: 'U.S. EIA: Average Price of Electricity (Electric Power Monthly Table 5.3)', url: 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_3' },
    { name: 'U.S. EIA: Gasoline and Diesel Fuel Update', url: 'https://www.eia.gov/petroleum/gasdiesel/' }
  ]
};
