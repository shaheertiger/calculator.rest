export default {
  slug: 'mpg-calculator',
  hub: 'everyday',
  name: 'MPG Calculator',
  title: 'MPG Calculator: 312 Miles on 11.8 Gallons Is 26.4 MPG',
  h1: 'Miles per Gallon Calculator: Find Your Car\'s Real Gas Mileage',
  meta: 'Driving 312 miles on 11.8 gallons is 26.4 mpg, or 8.9 L/100 km. Get your real gas mileage from a trip meter, odometer readings or a log of fill-ups.',
  keyword: 'how to calculate mpg',
  also: ['how do i calculate my mpg', 'how do you calculate your miles per gallon', 'how do you calculate gas mileage', 'how do you calculate miles per gallon', 'how do i calculate gas mileage', 'how is gas mileage calculated', 'how to calculate miles per gallon in a car', 'how to calculate my gas mileage', 'mpg calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'What do you have?', type: 'select', value: 'trip', options: [['trip', 'Trip meter miles'], ['odo', 'Two odometer readings'], ['log', 'Several fill-ups (log)']], wide: true },
    { id: 'miles', label: 'Miles driven', type: 'number', value: 312, suffix: 'mi', showIf: { method: ['trip'] } },
    { id: 'odoStart', label: 'Odometer at last fill-up', type: 'number', value: 48210, suffix: 'mi', showIf: { method: ['odo'] } },
    { id: 'odoEnd', label: 'Odometer now', type: 'number', value: 48522, suffix: 'mi', showIf: { method: ['odo'] } },
    { id: 'gallons', label: 'Gallons to refill', type: 'number', value: 11.8, suffix: 'gal', help: 'From the pump or receipt, filling to the first click.', showIf: { method: ['trip', 'odo'] } },
    {
      id: 'log', label: 'Fill-ups since a full tank', type: 'rows', addLabel: '+ add fill-up', max: 24, showIf: { method: ['log'] },
      fields: [
        { id: 'miles', label: 'Miles since last fill', type: 'number', value: 300 },
        { id: 'gallons', label: 'Gallons added', type: 'number', value: 11 }
      ],
      value: [{ miles: 312, gallons: 11.8 }, { miles: 287, gallons: 11.1 }, { miles: 341, gallons: 12.4 }]
    },
    { id: 'epa', label: 'EPA combined rating (optional)', type: 'number', value: 28, suffix: 'mpg', help: 'From the window sticker or fueleconomy.gov, to compare.' }
  ],
  compute(v, H) {
    var miles = 0, gal = 0, tanks = [];
    if (v.method === 'log') {
      (v.log || []).forEach(function (t) {
        if (t.miles > 0 && t.gallons > 0) { miles += t.miles; gal += t.gallons; tanks.push(t); }
      });
      if (!tanks.length) return { error: 'Add at least one fill-up with miles and gallons.' };
    } else if (v.method === 'odo') {
      if (!(v.odoStart >= 0) || !(v.odoEnd >= 0)) return { error: 'Enter both odometer readings.' };
      miles = v.odoEnd - v.odoStart;
      if (!(miles > 0)) return { error: 'The current odometer reading must be higher than the earlier one.' };
      gal = v.gallons;
    } else {
      miles = v.miles; gal = v.gallons;
      if (!(miles > 0)) return { error: 'Enter the miles you drove.' };
    }
    if (!(gal > 0)) return { error: 'Enter the gallons it took to refill the tank.' };
    var mpg = miles / gal;
    var rows = [
      ['Liters per 100 km', H.fix(235.2146 / mpg, 1)],
      ['Kilometers per liter', H.fix(mpg * 0.4251437, 2)],
      ['UK (imperial) mpg', H.fix(mpg * 1.2009504, 1)],
      ['Gallons per 100 miles', H.fix(100 / mpg, 2)]
    ];
    if (v.epa > 0) {
      var diff = (mpg / v.epa - 1) * 100;
      rows.unshift(['Versus ' + H.num(v.epa, 1) + ' mpg EPA rating', Math.abs(diff) < 0.05 ? 'right on it' : H.pct(Math.abs(diff), 1) + (diff < 0 ? ' below' : ' above'), true]);
    }
    var out = {
      value: H.fix(mpg, 1) + ' mpg',
      label: v.method === 'log' ? 'Average miles per gallon' : 'Miles per gallon',
      expr: H.num(miles, 1) + ' mi ÷ ' + H.num(gal, 3) + ' gal',
      rows: rows
    };
    if (v.method === 'log' && tanks.length > 1) {
      var best = 0, worst = Infinity;
      out.table = {
        head: ['Fill-up', 'Miles', 'Gallons', 'MPG'],
        rows: tanks.map(function (t, i) {
          var m = t.miles / t.gallons; best = Math.max(best, m); worst = Math.min(worst, m);
          return [String(i + 1), H.num(t.miles, 1), H.num(t.gallons, 3), H.fix(m, 1)];
        })
      };
      rows.push(['Best / worst tank', H.fix(best, 1) + ' / ' + H.fix(worst, 1) + ' mpg']);
    }
    out.sub = mpg >= 40 ? 'Hybrid territory: well above the 27.2 mpg EPA average for new 2024 vehicles.' : mpg >= 27.2 ? 'At or above the 27.2 mpg EPA average for new model-year 2024 vehicles.' : mpg >= 20 ? 'Below the 27.2 mpg new-vehicle average, which is typical for SUVs, older cars and city-heavy driving.' : 'Under 20 mpg is normal for full-size pickups and V8s; for a car it can point to short trips, cold weather or a maintenance issue.';
    return out;
  },
  quick: ({ r }) => `To calculate MPG, divide the miles you drove by the gallons it took to refill the tank. <strong>312 miles ÷ 11.8 gallons = ${r.value}</strong>, which is 8.9 liters per 100 km. Fill to the first click, reset the trip meter, drive, then refill and divide. Against a 28 mpg EPA rating, that car is running 5.6% below its sticker.`,
  stepsTitle: 'How to calculate your gas mileage by hand',
  steps: [
    'Fill the tank until the pump nozzle clicks off the first time. Don\'t top off. Reset the trip meter, or write down the odometer reading.',
    'Drive as you normally do for at least half a tank. The more miles between fill-ups, the smaller the error from how the pump shuts off.',
    'Refill to the first click again, ideally at the same station and pump, and note the gallons from the pump display or receipt.',
    'Divide the miles on the trip meter (or new odometer minus old) by the gallons you just added. <strong>The mistake people make:</strong> using the gallons from the first fill-up. Those gallons were burned before your measurement started; only the refill at the end counts.',
    'Repeat for three or more tanks and divide total miles by total gallons for a steadier average. Choose "Several fill-ups" above to do it in one go.'
  ],
  formulaTitle: 'What is the formula for miles per gallon?',
  formula: {
    expr: 'MPG = Miles driven ÷ Gallons used<br>L/100 km = 235.21 ÷ MPG<br>km/L = MPG × 0.4251',
    vars: [['Miles driven', 'trip meter reading, or current odometer minus the odometer at the last full tank'], ['Gallons used', 'gallons needed to refill to full at the end of the stretch'], ['235.21', '100 × 3.7854 liters per gallon ÷ 1.6093 km per mile']],
    note: 'The calculator also converts to UK miles per imperial gallon (US mpg × 1.201), because an imperial gallon holds 4.546 liters against 3.785 for a US gallon.'
  },
  example: `<p>You fill up with the odometer at 48,210. A week later it reads 48,522 and the pump takes 11.8 gallons to fill the tank again.</p>
<p>Miles driven = 48,522 − 48,210 = <strong>312</strong>. MPG = 312 ÷ 11.8 = <strong>26.4 mpg</strong>.</p>
<p>In metric: 235.21 ÷ 26.44 = <strong>8.9 L/100 km</strong>, or 26.44 × 0.4251 = 11.24 km per liter.</p>
<p>Logged over three tanks (312 mi on 11.8 gal, 287 mi on 11.1 gal, 341 mi on 12.4 gal), the average is 940 ÷ 35.3 = <strong>26.6 mpg</strong>.</p>`,
  table: {
    title: 'How do MPG, L/100 km and yearly gallons compare?',
    intro: 'Fuel use for 12,000 miles a year at different ratings, computed by the calculator above. Read the last column to see why going from 15 to 20 mpg saves more fuel than going from 35 to 50.',
    head: ['MPG', 'L/100 km', 'km per liter', 'Gallons per 100 mi', 'Gallons per year', 'Saved vs. row above'],
    rows: ({ run, H }) => {
      const list = [10, 15, 20, 25, 30, 35, 40, 50, 60];
      return list.map((m, i) => {
        const r = run({ method: 'trip', miles: m * 100, gallons: 100, epa: NaN });
        const g = (x) => (r.rows.find(row => row[0] === x) || [])[1];
        const yr = 12000 / m;
        return [String(m), g('Liters per 100 km'), g('Kilometers per liter'), g('Gallons per 100 miles'), H.int(yr), i ? H.int(12000 / list[i - 1] - yr) + ' gal' : '—'];
      });
    },
    note: 'Gallons per 100 miles is the measure that tracks fuel spent. Each jump in MPG saves less fuel than the one before, so swapping a 15 mpg truck for a 20 mpg one saves 200 gallons a year, the same as going from 30 to 60 mpg.'
  },
  sections: [
    {
      h2: 'Why doesn\'t my MPG match the dashboard or the EPA sticker?',
      html: `<p>Three different numbers are in play. Your <strong>hand calculation</strong> uses fuel you actually paid for. The <strong>trip computer</strong> estimates fuel from injector pulses and often reads a little optimistic, so check it against a few hand-calculated tanks before trusting it. The <strong>EPA rating</strong> on the window sticker comes from standardized lab cycles adjusted to reflect real-world driving, but your speed, climate, cargo and trip length are not the test's.</p>
<p>A gap of 5–10% from the combined rating is common and usually explained by driving mix: a car rated 32 highway and 25 city lands near 28 combined, and a commute that's mostly stop-and-go will sit closer to 25. A sudden drop of 15% or more on the same routes is worth investigating: tire pressure, a dragging brake, a failing oxygen sensor or a check-engine light.</p>
<p>Your measurement also has noise. Pumps shut off at slightly different levels, so a single tank can swing a mile or two per gallon either way. Averaging over several tanks cancels most of it.</p>`
    },
    {
      h2: 'How do you calculate average MPG over several tanks?',
      html: `<p>Add up all the miles and divide by all the gallons. Don't average the MPG figures from each tank, because a short tank would count as much as a long one.</p>
<p>Example: a 150-mile tank of city driving takes 8 gallons (18.8 mpg) and a 400-mile highway tank takes 10 gallons (40.0 mpg). Averaging the two figures gives 29.4 mpg, but the car really went 550 miles on 18 gallons: <strong>30.6 mpg</strong>. The highway tank covered more miles, so it should carry more weight.</p>
<p>If you skip a fill-up record, the chain breaks: the gallons you add next will include fuel burned during the unrecorded stretch. Either log every fill-up or restart from a full tank. Fuel-log apps and fueleconomy.gov's free My MPG tracker do exactly this arithmetic for you.</p>`
    },
    {
      h2: 'How do you convert MPG to L/100 km or km per liter?',
      html: `<p>Divide 235.21 by the MPG to get liters per 100 km; multiply MPG by 0.4251 for kilometers per liter. Going the other way, MPG = 235.21 ÷ L/100 km, and MPG = km/L × 2.352.</p>
<ul><li>25 mpg = 9.4 L/100 km = 10.6 km/L</li><li>30 mpg = 7.8 L/100 km = 12.8 km/L</li><li>40 mpg = 5.9 L/100 km = 17.0 km/L</li></ul>
<p>UK and Irish figures use the larger imperial gallon, so a car rated 50 mpg in Britain manages about 41.6 mpg in US gallons. Divide UK mpg by 1.201 before comparing it with a U.S. sticker.</p>`
    },
    {
      h2: 'What is good gas mileage for a car, SUV or truck?',
      html: `<p>The EPA's 2025 Automotive Trends Report puts the average new model-year 2024 vehicle at a record <strong>27.2 mpg</strong> in real-world fuel economy, with truck-style SUVs averaging 25.7 mpg. Against that yardstick:</p>
<ul><li><strong>Compact and midsize gas sedans:</strong> roughly 30–35 mpg combined is good.</li><li><strong>Small and midsize SUVs:</strong> mid-20s is typical; 30+ usually means a hybrid.</li><li><strong>Full-size pickups:</strong> high teens to low 20s.</li><li><strong>Conventional hybrids:</strong> 40–57 mpg combined for the most efficient models.</li></ul>
<p>The fairest comparison is your own car's EPA rating. Look it up by year, make and model on fueleconomy.gov's Find a Car tool, then enter the combined figure above to see how your driving stacks up.</p>`
    },
    {
      h2: 'What lowers gas mileage, and by how much?',
      html: `<p>Figures from the Department of Energy and EPA's fueleconomy.gov:</p>
<ul><li><strong>Aggressive driving</strong> (speeding, hard acceleration and braking) can cut gas mileage by roughly 15–30% at highway speeds and 10–40% in stop-and-go traffic.</li><li><strong>Speed:</strong> mileage usually drops quickly above 50 mph.</li><li><strong>Cold weather:</strong> in city driving a conventional car gets roughly 15% fewer miles per gallon at 20°F than at 77°F, and up to 24% fewer on short 3–4 mile trips. Hybrids can drop 30–34%.</li><li><strong>Under-inflated tires:</strong> about 0.2% lost for every 1 psi drop in average pressure; proper inflation gains 0.6% on average.</li><li><strong>Extra weight:</strong> an extra 100 pounds can reduce mpg by about 1%.</li><li><strong>Idling:</strong> burns a quarter to a half gallon per hour.</li></ul>
<p>Measure a few tanks before and after a change (new tires, a roof box, a different commute) and you'll see its real effect on your car.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my MPG?', a: 'Divide the miles driven since your last full tank by the gallons needed to fill it again. 312 miles on 11.8 gallons is 312 ÷ 11.8 = 26.4 mpg.' },
    { q: 'How do you calculate miles per gallon with odometer readings?', a: 'Subtract the odometer reading at your previous fill-up from the current reading to get miles driven, then divide by the gallons you just pumped. 48,522 − 48,210 = 312 miles; 312 ÷ 11.8 gallons = 26.4 mpg.' },
    { q: 'Do I count the gas from my first fill-up?', a: 'No. The first fill-up only sets the starting point. Count the gallons from the refill at the end of the stretch, because that is the fuel the car burned over those miles.' },
    { q: 'Is 26 mpg good gas mileage?', a: 'It is about average. The EPA puts the average new model-year 2024 vehicle at 27.2 mpg, so 26 mpg is solid for an SUV and a little low for a compact sedan. Compare it with your own car\'s EPA combined rating.' },
    { q: 'How do you calculate MPG for a hybrid or electric car?', a: 'For a regular hybrid, use the same miles ÷ gallons method. For electric cars the EPA uses MPGe, which treats 33.7 kWh of electricity as equal to one gallon of gasoline: miles driven ÷ (kWh used ÷ 33.7).' },
    { q: 'How do I convert km per liter to MPG?', a: 'Multiply km/L by 2.352. For example, 12 km/L × 2.352 = 28.2 mpg. To convert L/100 km, divide 235.21 by the figure: 8 L/100 km is 29.4 mpg.' },
    { q: 'Why does my gas mileage drop in winter?', a: 'Cold engines and thicker fluids take longer to warm up, winter-blend fuel holds slightly less energy, and heaters and defrosters add load. Fueleconomy.gov reports city mileage about 15% lower at 20°F than at 77°F, and up to 24% lower on short trips.' },
    { q: 'How many fill-ups do I need for an accurate MPG?', a: 'One full tank gives a usable number; three or more tanks give a reliable one. Pumps shut off at slightly different levels, and averaging total miles over total gallons smooths that out.' }
  ],
  related: ['trip-gas-cost-calculator', 'ev-charging-cost-calculator', 'fuel-surcharge-calculator', 'speed-calculator'],
  sources: [
    { name: 'FuelEconomy.gov: Driving More Efficiently', url: 'https://www.fueleconomy.gov/feg/driveHabits.jsp' },
    { name: 'FuelEconomy.gov: Keeping Your Vehicle in Shape', url: 'https://www.fueleconomy.gov/feg/maintain.jsp' },
    { name: 'FuelEconomy.gov: Fuel Economy in Cold Weather', url: 'https://www.fueleconomy.gov/feg/coldweather.shtml' },
    { name: 'FuelEconomy.gov: Find and Compare Cars', url: 'https://www.fueleconomy.gov/feg/findacar.shtml' },
    { name: 'EPA: Highlights of the Automotive Trends Report', url: 'https://www.epa.gov/automotive-trends/highlights-automotive-trends-report' }
  ]
};
