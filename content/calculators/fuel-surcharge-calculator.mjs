export default {
  slug: 'fuel-surcharge-calculator',
  hub: 'business',
  name: 'Fuel Surcharge Calculator',
  title: 'Fuel Surcharge Calculator: $6.13 Diesel = $0.81/Mile (2026)',
  h1: 'Fuel Surcharge Calculator for Trucking and Freight',
  meta: 'With diesel at $6.13, a $1.25 base and 6 mpg, the fuel surcharge is $0.81 a mile, or $405 on a 500-mile load. For carriers, brokers and shippers.',
  keyword: 'how do you calculate a fuel surcharge',
  also: ['fuel surcharge calculator', 'how do you calculate fuel surcharge', 'how do i calculate fuel surcharge', 'how to calculate fuel surcharge for trucking', 'how to calculate rate per mile trucking'],
  updated: '2026-11-13',
  inputs: [
    { id: 'method', label: 'Method', type: 'select', value: 'mile', options: [['mile', 'Per mile from diesel price (truckload)'], ['pct', 'Percentage of the freight charge (LTL, parcel)']] },
    { id: 'price', label: 'Current diesel price', type: 'number', value: 6.13, prefix: '$', suffix: '/gal', help: 'EIA U.S. on-highway average, published weekly.', showIf: { method: ['mile'] } },
    { id: 'base', label: 'Base (peg) price', type: 'number', value: 1.25, prefix: '$', suffix: '/gal', help: 'The fuel price already built into your rate, from the contract.', showIf: { method: ['mile'] } },
    { id: 'mpg', label: 'Fuel economy', type: 'number', value: 6, suffix: 'mpg', help: 'Contract figure; 6–6.5 mpg is common for Class 8 trucks.', showIf: { method: ['mile'] } },
    { id: 'miles', label: 'Loaded miles', type: 'number', value: 500, suffix: 'miles', showIf: { method: ['mile'] } },
    { id: 'linehaul', label: 'Linehaul rate', type: 'number', value: 2.5, prefix: '$', suffix: '/mile', help: 'Optional: shows the surcharge as a % and the all-in rate.', showIf: { method: ['mile'] } },
    { id: 'round', label: 'Round per-mile surcharge to the cent', type: 'checkbox', value: true, showIf: { method: ['mile'] } },
    { id: 'charge', label: 'Freight charge before surcharge', type: 'number', value: 850, prefix: '$', showIf: { method: ['pct'] } },
    { id: 'pct', label: 'Fuel surcharge rate', type: 'number', value: 32.4, suffix: '%', help: 'From the carrier\'s weekly fuel surcharge table.', showIf: { method: ['pct'] } }
  ],
  compute(v, H) {
    if (v.method === 'pct') {
      if (!(v.charge > 0)) return { error: 'Enter the freight charge.' };
      if (!(v.pct >= 0)) return { error: 'Enter the fuel surcharge percentage.' };
      var s = v.charge * v.pct / 100;
      return {
        value: H.money(s),
        label: 'Fuel surcharge',
        expr: H.money(v.charge) + ' × ' + H.num(v.pct, 2) + '%',
        rows: [['Total with surcharge', H.money(v.charge + s), true]],
        sub: 'Percentage surcharges move with the carrier\'s weekly table, which is keyed to the EIA diesel average.'
      };
    }
    if (!(v.price > 0)) return { error: 'Enter the current diesel price.' };
    if (!(v.base >= 0)) return { error: 'Enter the base fuel price from your contract.' };
    if (!(v.mpg > 0)) return { error: 'Enter miles per gallon.' };
    var raw = Math.max(0, (v.price - v.base) / v.mpg);
    var per = v.round ? Math.round(raw * 100) / 100 : raw;
    var rows = [['Unrounded per mile', '$' + H.fix(raw, 4)], ['Price above base', '$' + H.num(Math.max(0, v.price - v.base), 3) + '/gal']];
    var total = NaN;
    if (v.miles > 0) {
      total = per * v.miles;
      rows.unshift(['Fuel surcharge for ' + H.num(v.miles, 0) + ' miles', H.money(total), true]);
      rows.push(['Gallons for the trip', H.num(v.miles / v.mpg, 1) + ' gal']);
    }
    if (v.linehaul > 0) {
      rows.push(['Surcharge as % of linehaul', H.fix(per / v.linehaul * 100, 1) + '%']);
      rows.push(['All-in rate per mile', H.money(v.linehaul + per), true]);
      if (v.miles > 0) rows.push(['Total for the load', H.money((v.linehaul + per) * v.miles)]);
    }
    return {
      value: (v.round ? H.money(per) : H.num(per * 100, 2) + '¢') + '/mile',
      label: 'Fuel surcharge per mile',
      expr: '($' + H.num(v.price, 3) + ' − $' + H.num(v.base, 3) + ') ÷ ' + H.num(v.mpg, 2) + ' mpg',
      rows: rows,
      sub: v.price <= v.base ? 'Diesel is at or below the base price, so no surcharge applies.' : 'Each 6¢ rise in diesel adds about ' + H.num(6 / v.mpg, 2) + '¢ per mile at ' + H.num(v.mpg, 2) + ' mpg.'
    };
  },
  quick: ({ r }) => `A fuel surcharge is (current diesel price − base price) ÷ miles per gallon, charged per mile. With EIA's Nov 9, 2026 U.S. diesel average of <strong>$6.13</strong> a gallon, a $1.25 base and 6 mpg, the surcharge is $4.88 ÷ 6 = <strong>${r.value}</strong>. On a 500-mile load that is $405.00, or 32.4% of a $2.50-per-mile linehaul rate.`,
  stepsTitle: 'How to calculate a fuel surcharge',
  steps: [
    'Look up the current diesel price your contract names, usually the U.S. Energy Information Administration (EIA) weekly on-highway average, national or by region.',
    'Subtract the <strong>base (peg) price</strong> from the contract. That is the fuel cost the linehaul rate already covers.',
    'Divide the difference by the contract <strong>mpg</strong> to get the surcharge per mile. Using the truck\'s real mpg instead of the contract figure is a common source of billing disputes.',
    'Multiply by loaded miles for the trip total. To express it as a percentage, divide the per-mile surcharge by the linehaul rate per mile.'
  ],
  formulaTitle: 'What is the fuel surcharge formula?',
  formula: {
    expr: 'Surcharge per mile = (Current fuel price − Base price) ÷ MPG<br>Trip surcharge = Surcharge per mile × Miles<br>Surcharge % = Surcharge per mile ÷ Linehaul rate per mile × 100',
    vars: [['Current fuel price', 'EIA weekly diesel average named in the contract'], ['Base price', 'fuel price built into the base rate (the peg)'], ['MPG', 'fuel economy agreed in the contract']],
    note: 'Many shippers publish a schedule instead: for example, $0.01 per mile for every $0.06 the price rises above the peg, which is the same formula at about 6 mpg.'
  },
  example: `<p>A shipper's contract pegs fuel at $2.50 with 6.5 mpg. This week the EIA Midwest average is $5.90, and the load is 820 miles at $2.25 per mile linehaul.</p>
<p>Surcharge per mile = ($5.90 − $2.50) ÷ 6.5 = $3.40 ÷ 6.5 = 52.3¢, rounded to <strong>$0.52</strong>.</p>
<p>Trip surcharge = $0.52 × 820 = <strong>$426.40</strong>.</p>
<p>As a percentage of linehaul: $0.52 ÷ $2.25 = 23.1%. The carrier bills $2.25 + $0.52 = $2.77 per mile, or $2,271.40 all-in.</p>`,
  table: {
    title: 'What is the fuel surcharge at each diesel price?',
    intro: 'Per-mile surcharge with a $1.25 base and 6 mpg, the cost on a 500-mile load, and the percentage of a $2.50-per-mile linehaul rate.',
    head: ['Diesel price', 'Per mile', 'On 500 miles', '% of $2.50/mile'],
    rows: ({ run, H }) => [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.13, 6.5, 7.0].map(p => {
      const r = run({ method: 'mile', price: p, base: 1.25, mpg: 6, miles: 500, linehaul: 2.5, round: true });
      return [H.money(p) + (p === 6.13 ? ' (Nov 9, 2026)' : ''), r.value.replace('/mile', ''), r.rows[0][1], r.rows[4][1]];
    })
  },
  sections: [
    {
      h2: 'Where do you get the current diesel price?',
      html: `<p>Almost every U.S. fuel surcharge program uses the EIA's weekly retail on-highway diesel price. EIA surveys stations and publishes the national average plus regional figures (East Coast, Midwest, Gulf Coast, Rocky Mountain, West Coast and California) once a week, with each price dated the Monday it was collected. The national average was <strong>$6.13 a gallon</strong> on Nov 9, 2026, up $2.29 from a year earlier.</p>
<p>Your contract should say which series to use and which week applies: usually the price published on the Monday of the week the load ships or delivers.</p>`
    },
    {
      h2: 'How do you choose the base price and mpg?',
      html: `<p>The base price is the fuel cost already baked into your linehaul rate, so the surcharge only covers fuel above it. Many long-standing programs peg it around $1.20–$1.25, close to where diesel sat in the late 1990s and early 2000s, which means most of today's fuel cost travels in the surcharge. Newer contracts often peg at $2.50 or higher with a correspondingly higher base rate.</p>
<p>For mpg, 6 to 6.5 is typical for a loaded Class 8 tractor-trailer. A higher mpg in the contract lowers the surcharge: at $6.13 diesel and a $1.25 base, 6 mpg gives $0.81 a mile while 7 mpg gives $0.70. The fuel actually burned depends on the truck, load and route, so carriers with better fuel economy keep the difference.</p>`
    },
    {
      h2: 'Should a fuel surcharge be per mile or a percentage?',
      html: `<p><strong>Per mile</strong> is standard for truckload freight, because fuel burned depends on distance. <strong>Percentage</strong> surcharges are common in LTL and parcel shipping, where a carrier applies a weekly percentage, taken from its fuel table, to the freight charge. A percentage can overcharge on short, expensive shipments and undercharge on long cheap ones, which is why truckload shippers prefer the per-mile method.</p>
<p>Switch the calculator to "Percentage of the freight charge" to apply a table rate: $850 of freight at 32.4% adds $275.40.</p>`
    },
    {
      h2: 'How do you calculate rate per mile in trucking?',
      html: `<p>Divide the total paid for the load by the miles. An all-in rate includes the fuel surcharge: a $1,250 linehaul plus a $405 surcharge on a 500-mile run is $1,655 ÷ 500 = <strong>$3.31 per mile</strong>. Many brokers quote all-in, while contracts often split linehaul and fuel. When comparing loads, also count deadhead (empty) miles: the same $1,655 over 500 loaded plus 100 empty miles is $2.76 per total mile. For the fuel a trip will actually burn, use the <a href="/trip-gas-cost-calculator">trip gas cost calculator</a> or the <a href="/mpg-calculator">MPG calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate a fuel surcharge per mile?', a: 'Subtract the base fuel price from the current diesel price and divide by the contract mpg. ($6.13 − $1.25) ÷ 6 = $0.81 per mile.' },
    { q: 'How do you calculate a fuel surcharge percentage?', a: 'Divide the per-mile surcharge by the linehaul rate per mile and multiply by 100. $0.81 ÷ $2.50 = 32.4%.' },
    { q: 'What is a typical base price for a fuel surcharge?', a: 'It varies by contract. Older programs often peg fuel at about $1.20–$1.25 a gallon; many newer ones use $2.00–$3.00 with a higher base rate. The higher the peg, the lower the surcharge for the same diesel price.' },
    { q: 'How often do fuel surcharges change?', a: 'Weekly for most programs, tracking the EIA price published each Monday. Some contracts adjust monthly using an average of the weekly prices.' },
    { q: 'Do fuel surcharges apply to deadhead miles?', a: 'Usually only to loaded (billed) miles, because that is what the shipper pays for. Some dedicated and drayage contracts include a set number of empty miles; check your rate confirmation.' },
    { q: 'Can a fuel surcharge be negative?', a: 'Not under most contracts. If diesel falls below the base price, the surcharge is zero rather than a credit, and the calculator shows $0.00.' },
    { q: 'How do I calculate a fuel surcharge for a delivery business?', a: 'Use the same idea with gasoline: (current gas price − the price built into your rates) ÷ your vehicle\'s mpg × miles per delivery. At $4.00 gas, a $3.00 base, 20 mpg and 15 miles, that is $0.75 per stop.' }
  ],
  related: ['mpg-calculator', 'trip-gas-cost-calculator', 'dimensional-weight-calculator', 'total-cost-calculator', 'percentage-calculator'],
  sources: [
    { name: 'U.S. Energy Information Administration: Gasoline and Diesel Fuel Update', url: 'https://www.eia.gov/petroleum/gasdiesel/' },
    { name: 'EIA: Weekly retail on-highway diesel prices (data series)', url: 'https://www.eia.gov/dnav/pet/pet_pri_gnd_dcus_nus_w.htm' }
  ]
};
