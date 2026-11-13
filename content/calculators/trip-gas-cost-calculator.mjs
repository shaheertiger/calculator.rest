export default {
  slug: 'trip-gas-cost-calculator',
  hub: 'everyday',
  name: 'Gas Cost Calculator',
  title: 'Gas Cost Calculator: 840-Mile Round Trip at 28 MPG Is $95.70',
  h1: 'Trip Gas Cost Calculator: Fuel Budget, Cost per Mile and Each Rider\'s Share',
  meta: 'A 420-mile drive each way at 28 mpg burns 30 gallons; at $3.19/gal that\'s $95.70 round trip, $47.85 each for two. Budget fuel for any road trip.',
  keyword: 'how to calculate gas price for a trip',
  also: ['how to calculate gas cost per mile', 'gas cost calculator', 'trip gas cost calculator', 'road trip gas calculator', 'fuel cost calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'distance', label: 'Distance one way', type: 'number', value: 420, suffix: 'miles' },
    { id: 'trip', label: 'Trip type', type: 'select', value: 'round', options: [['one', 'One way'], ['round', 'Round trip (there and back)']] },
    { id: 'mpg', label: 'Your car\'s fuel economy', type: 'number', value: 28, suffix: 'mpg', help: 'Use the EPA highway rating for interstate trips, or your measured MPG.' },
    { id: 'price', label: 'Gas price', type: 'number', value: 3.19, prefix: '$', suffix: '/gal' },
    { id: 'people', label: 'People sharing the cost', type: 'number', value: 2, suffix: 'people' },
    { id: 'tank', label: 'Tank size (optional)', type: 'number', value: 14, suffix: 'gal', help: 'Shows how many tankfuls the trip takes.' }
  ],
  compute(v, H) {
    if (!(v.distance > 0)) return { error: 'Enter the trip distance in miles.' };
    if (!(v.mpg > 0)) return { error: 'Enter your car\'s miles per gallon.' };
    if (!(v.price > 0)) return { error: 'Enter the price of gas per gallon.' };
    var legs = v.trip === 'round' ? 2 : 1;
    var miles = v.distance * legs;
    var gal = miles / v.mpg;
    var cost = gal * v.price;
    var people = v.people >= 1 ? Math.floor(v.people) : 1;
    var perMile = v.price / v.mpg;
    var cents = function (x) { return x < 1 ? H.num(x * 100, 1) + '¢' : H.money(x); };
    var rows = [['Gallons needed', H.fix(gal, 1)]];
    if (people > 1) rows.push(['Cost per person (' + people + ')', H.money(cost / people), true]);
    rows.push(['Gas cost per mile', cents(perMile)]);
    rows.push(['Gas cost per 100 miles', H.money(perMile * 100)]);
    if (legs === 2) rows.push(['Each way', H.money(cost / 2)]);
    if (v.tank > 0) rows.push(['Tankfuls', H.fix(gal / v.tank, 1) + ' (range ' + H.int(v.tank * v.mpg) + ' mi per tank)']);
    return {
      value: H.money(cost),
      label: legs === 2 ? 'Round-trip gas cost' : 'One-way gas cost',
      expr: H.num(miles, 1) + ' mi ÷ ' + H.num(v.mpg, 1) + ' mpg × ' + H.money(v.price),
      rows: rows,
      sub: 'Gas only. Tolls, parking and wear on the car are extra; fast cruising or a roof cargo box (6–17% worse highway MPG) pushes the fuel bill higher.'
    };
  },
  quick: ({ r, run }) => `To calculate gas for a trip, divide the miles by your car's MPG to get gallons, then multiply by the price per gallon. A 420-mile drive at 28 mpg takes 15 gallons; at $3.19 a gallon that's ${run({ trip: 'one' }).value} each way and <strong>${r.value} round trip</strong>, or $47.85 each for two people. Gas alone costs 11.4¢ a mile.`,
  stepsTitle: 'How to work out the gas cost of a road trip',
  steps: [
    'Get the driving distance from a map app. Enter it one way and choose round trip if you\'re coming back the same way, so the side trips you add later are easy to spot.',
    'Enter your fuel economy. For highway trips the EPA highway rating is a good start; your own measured MPG is better, because it reflects your car\'s condition and how you drive.',
    'Enter the gas price you expect to pay. Prices vary by tens of cents between states, so use the average along your route rather than your hometown price.',
    'Add the number of people chipping in, <strong>including the driver</strong>. Leaving the driver out is the most common way gas splits go wrong.',
    'Optionally add your tank size to see how many tankfuls the trip takes and how far each one goes.'
  ],
  formulaTitle: 'What is the formula for trip gas cost?',
  formula: {
    expr: 'Gallons = Miles ÷ MPG<br>Gas cost = Gallons × Price per gallon<br>Cost per mile = Price ÷ MPG',
    vars: [['Miles', 'total distance driven (double it for a round trip)'], ['MPG', 'your vehicle\'s miles per gallon'], ['Price', 'average price per gallon along the route']]
  },
  example: `<p>Two friends drive 420 miles to a lake house and back in a sedan that gets 28 mpg on the highway, with gas at $3.19.</p>
<p>Total miles = 420 × 2 = <strong>840</strong>. Gallons = 840 ÷ 28 = <strong>30</strong>. Cost = 30 × $3.19 = <strong>$95.70</strong>.</p>
<p>Each person pays $95.70 ÷ 2 = <strong>$47.85</strong>. Per mile, gas runs $3.19 ÷ 28 = 11.4¢. With a 14-gallon tank, the trip uses 2.1 tankfuls and each full tank covers about 392 miles.</p>`,
  table: {
    title: 'How much does gas cost per 100 miles?',
    intro: 'Fuel cost to drive 100 miles at different MPG ratings and pump prices, from the calculator above. Multiply by your distance ÷ 100.',
    head: ['MPG', '$3.00/gal', '$3.50/gal', '$4.00/gal', '$4.50/gal', '$5.00/gal'],
    rows: ({ run }) => [15, 20, 25, 28, 30, 35, 40, 50].map(m => [m + ' mpg', ...[3, 3.5, 4, 4.5, 5].map(p => run({ distance: 100, trip: 'one', mpg: m, price: p, people: 1 }).value)]),
    note: 'At $3.50 a gallon, a 20 mpg SUV costs $17.50 per 100 miles and a 50 mpg hybrid $7.00: on a 1,000-mile vacation that\'s $175 against $70.'
  },
  sections: [
    {
      h2: 'How do you calculate gas cost per mile?',
      html: `<p>Divide the price of a gallon by your miles per gallon. At $3.19 and 28 mpg, gas costs $3.19 ÷ 28 = <strong>$0.114 a mile</strong>, or $11.39 per 100 miles. A 20 mpg pickup at the same price costs 16¢ a mile.</p>
<p>That figure covers fuel only. The full cost of running a car includes depreciation, insurance, tires and maintenance, which is why the IRS business standard mileage rate is much higher: 72.5¢ a mile for January–June 2026 and 76¢ from July 1, 2026. If someone is reimbursing you for business driving, the IRS rate is the usual benchmark; for splitting a road trip with friends, gas cost per mile is the fairer number.</p>`
    },
    {
      h2: 'Which MPG should you use for a road trip?',
      html: `<p>Start with your car's EPA <strong>highway</strong> figure for interstate driving and its combined figure for mixed routes, then adjust for how you'll drive:</p>
<ul><li><strong>Speed:</strong> fueleconomy.gov notes that gas mileage usually falls off quickly above 50 mph, so 80 mph cruising can land well below the highway rating.</li><li><strong>Roof cargo box:</strong> a large one can cut fuel economy 6–17% on the highway and 10–25% at 65–75 mph. A rear hitch tray costs only 1–2%.</li><li><strong>Full car:</strong> every extra 100 pounds trims about 1%.</li><li><strong>Mountains and towing:</strong> long climbs and trailers can cost far more; budget 20–30% extra if you're unsure.</li></ul>
<p>Best of all is a number you measured yourself on a recent highway tank. The <a href="/mpg-calculator">MPG calculator</a> works it out from miles and gallons.</p>`
    },
    {
      h2: 'How much gas money should you give the driver?',
      html: `<p>Split the fuel bill evenly among everyone in the car, driver included: total gas ÷ people. On the $95.70 round trip above, that's $47.85 each for two, $31.90 each for three or $23.93 each for four.</p>
<p>If the driver is doing everyone a favor in their own car, many groups add a little for wear and tear. A simple way is to split a per-mile figure instead of gas alone, for example 20¢ a mile (840 miles × $0.20 = $168 shared). For a commute or a recurring ride, agree on a per-trip amount up front so nobody has to redo the math each week. For splitting other shared costs like lodging or groceries, the <a href="/split-bill-calculator">bill split calculator</a> handles equal and income-based shares.</p>`
    },
    {
      h2: 'Is it cheaper to drive or fly?',
      html: `<p>For one person, flying is often competitive past 400–500 miles once you count a hotel night on the road. For a family, driving usually wins: the gas bill stays the same whether one person or five are in the car, while airfare multiplies.</p>
<p>Example: four people going 600 miles each way in a 25 mpg minivan with gas at $3.50 pay 1,200 ÷ 25 × $3.50 = <strong>$168</strong> in fuel. Four round-trip airline tickets at $250 come to $1,000 before bags, airport parking and a rental car. Add tolls, parking and any overnight stays to the driving side before deciding.</p>`
    }
  ],
  faq: [
    { q: 'How much gas does it take to drive 100 miles?', a: 'Divide 100 by your MPG. At 28 mpg it takes 3.57 gallons, which costs $11.39 at $3.19 a gallon. At 20 mpg it takes 5 gallons.' },
    { q: 'How much does it cost to drive 1,000 miles?', a: 'At 28 mpg and $3.19 a gallon, 1,000 miles uses 35.7 gallons and costs about $113.93 in gas. At 20 mpg the same distance costs $159.50.' },
    { q: 'How much does a 300-mile trip cost in gas?', a: 'At 25 mpg and $3.50 a gallon, a 300-mile trip takes 12 gallons and costs $42. Double it for the drive home.' },
    { q: 'Should the driver pay a share of the gas?', a: 'Usually yes. Splitting evenly among everyone in the car, driver included, is the common arrangement. If the driver is also providing the car, riders sometimes cover a bit more to account for wear and tear.' },
    { q: 'Where can I find gas prices along my route?', a: 'AAA publishes daily state and metro averages, and the U.S. Energy Information Administration publishes weekly regional retail prices. Map and gas apps show individual stations along the way.' },
    { q: 'What is the IRS mileage rate for 2026?', a: 'The IRS business standard mileage rate is 72.5 cents a mile for January 1 to June 30, 2026, and 76 cents a mile from July 1 to December 31, 2026. It covers all vehicle costs, not just gas.' },
    { q: 'How do I estimate charging cost for an electric car trip?', a: 'Use kWh per mile and your electricity or charger price instead of MPG and gas prices. The EV charging cost calculator does that math.' }
  ],
  related: ['mpg-calculator', 'split-bill-calculator', 'ev-charging-cost-calculator', 'speed-calculator', 'fuel-surcharge-calculator'],
  sources: [
    { name: 'FuelEconomy.gov: Driving More Efficiently', url: 'https://www.fueleconomy.gov/feg/driveHabits.jsp' },
    { name: 'U.S. Energy Information Administration: Gasoline and Diesel Fuel Update', url: 'https://www.eia.gov/petroleum/gasdiesel/' },
    { name: 'AAA: Gas Prices', url: 'https://gasprices.aaa.com/' },
    { name: 'IRS: Standard Mileage Rates', url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates' }
  ]
};
