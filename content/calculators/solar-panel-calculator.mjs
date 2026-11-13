export default {
  slug: 'solar-panel-calculator',
  hub: 'electrical',
  name: 'Solar Panel Calculator',
  title: 'Solar Panel Calculator: 900 kWh/Month Needs an 8.2 kW System',
  h1: 'Solar System Size Calculator: kW, Panel Count, Inverter and Battery',
  meta: 'Using 900 kWh a month with 4.5 peak sun hours? Plan on about 8.2 kW of solar, or 21 panels of 400 W. Sizes the array, inverter and backup battery for your home.',
  keyword: 'how to calculate solar system size',
  also: ['solar panel calculator', 'how to calculate solar panel battery and inverter', 'how to calculate solar panel output', 'how do i calculate solar panel output', 'how to calculate solar power generation', 'how many solar panels do i need'],
  updated: '2026-11-13',
  inputs: [
    { id: 'kwh', label: 'Average monthly electricity use', type: 'number', value: 900, suffix: 'kWh', help: 'Add up 12 months of bills and divide by 12. The U.S. average is about 900 kWh.' },
    { id: 'psh', label: 'Peak sun hours per day', type: 'number', value: 4.5, suffix: 'hours', help: 'Annual average for your location; get it from NREL PVWatts.' },
    { id: 'offset', label: 'Share of usage to cover', type: 'number', value: 100, suffix: '%' },
    { id: 'loss', label: 'System losses', type: 'number', value: 20, suffix: '%', help: 'Wiring, inverter, heat, dirt and shading. 15–25% is typical.' },
    { id: 'watt', label: 'Panel rating', type: 'number', value: 400, suffix: 'W' },
    { id: 'backup', label: 'Battery backup wanted', type: 'number', value: 12, suffix: 'hours', placeholder: 'optional', help: 'Hours of average household use to store. Leave blank for none.' }
  ],
  compute(v, H) {
    if (!(v.kwh > 0)) return { error: 'Enter your monthly kWh use.' };
    if (!(v.psh > 0 && v.psh < 12)) return { error: 'Enter peak sun hours between 1 and 12.' };
    if (!(v.watt > 0)) return { error: 'Enter the panel wattage.' };
    var offset = v.offset > 0 ? v.offset : 100;
    var loss = v.loss >= 0 && v.loss < 90 ? v.loss : 20;
    var derate = 1 - loss / 100;
    var daily = v.kwh * 12 / 365;
    var need = daily * offset / 100;
    var kw = need / (v.psh * derate);
    var panels = Math.ceil(kw * 1000 / v.watt - 1e-9);
    var built = panels * v.watt / 1000;
    var annual = built * v.psh * derate * 365;
    var area = panels * (v.watt / 205) * 10.7639;
    var rows = [
      ['Panels needed', panels + ' × ' + H.num(v.watt, 0) + ' W = ' + H.num(built, 2) + ' kW', true],
      ['Estimated production', H.int(annual) + ' kWh/yr (' + H.int(annual / 12) + ' kWh/mo)'],
      ['Share of your use covered', H.pct(annual / (v.kwh * 12) * 100, 0)],
      ['Inverter size (1.2 DC/AC ratio)', '≈ ' + H.num(built / 1.2, 1) + ' kW AC'],
      ['Roof area (≈20.5% efficient panels)', '≈ ' + H.int(area) + ' sq ft']
    ];
    if (v.backup > 0) rows.push(['Battery for ' + H.num(v.backup, 1) + ' h backup', H.num(daily / 24 * v.backup, 1) + ' kWh usable']);
    return {
      value: H.num(kw, 2) + ' kW',
      label: 'Solar array size (DC)',
      expr: H.num(daily, 1) + ' kWh/day ÷ (' + H.num(v.psh, 2) + ' h × ' + H.num(derate, 2) + ')',
      rows: rows,
      _panels: panels,
      sub: 'Each kW of panels here makes about ' + H.int(v.psh * derate * 365) + ' kWh a year. Run your address through NREL PVWatts to refine the sun-hour figure before getting quotes.'
    };
  },
  quick: ({ r }) => `To calculate solar system size, divide daily kWh use by peak sun hours and by the system efficiency. A home using <strong>900 kWh a month</strong> (29.6 kWh a day) with 4.5 sun hours and 20% losses needs 29.6 ÷ (4.5 × 0.8) = <strong>${r.value}</strong> of panels, which rounds up to 21 × 400 W panels (8.4 kW).`,
  stepsTitle: 'How to calculate solar system size in 5 steps',
  steps: [
    'Find your yearly electricity use on 12 months of bills and divide by 365 for kWh per day. One month of bills can be off by 50% because of heating and cooling seasons.',
    'Look up peak sun hours (kWh of sunlight per m² per day) for your address and roof tilt. NREL\'s free PVWatts tool gives this from decades of satellite weather data.',
    'Divide daily kWh by peak sun hours, then by 1 minus losses. With 20% losses, 29.6 kWh ÷ 4.5 h ÷ 0.8 = 8.2 kW of panels.',
    'Divide the kW by the panel rating and round up: 8,219 W ÷ 400 W = 20.5, so 21 panels (8.4 kW).',
    'Size the inverter to about the array kW divided by 1.1–1.3, and add a battery sized in usable kWh if you want backup power.'
  ],
  formulaTitle: 'What is the solar sizing formula?',
  formula: {
    expr: 'System kW = (monthly kWh × 12 ÷ 365) ÷ (peak sun hours × (1 − losses))<br>Panels = system kW × 1000 ÷ panel watts (round up)<br>Annual kWh = kW × peak sun hours × (1 − losses) × 365',
    vars: [['peak sun hours', 'daily solar energy on the panels, kWh/m², equal to hours of 1,000 W/m² sun'], ['losses', 'combined inverter, wiring, temperature, soiling and shading losses'], ['panel watts', 'STC nameplate rating of one module']],
    note: 'PVWatts uses 14% default system losses plus a separate 96% inverter efficiency, and it models heat loss hour by hour. A flat 20% here is a conservative stand-in for all three.'
  },
  example: `<p>A household in a sunny state uses <strong>14,400 kWh a year</strong> (1,200 kWh a month) and wants to cover 90% of it. Its roof gets 5.5 peak sun hours, and the installer quotes 430 W panels with 18% losses.</p>
<p>Daily need: 14,400 ÷ 365 × 0.90 = <strong>35.5 kWh</strong>. Array: 35.5 ÷ (5.5 × 0.82) = <strong>7.87 kW</strong>.</p>
<p>Panels: 7,872 W ÷ 430 W = 18.3, so <strong>19 panels</strong> (8.17 kW), producing about 8.17 × 5.5 × 0.82 × 365 = <strong>13,450 kWh a year</strong>.</p>`,
  table: {
    title: 'What size solar system do I need for my monthly kWh?',
    intro: 'Array size in kW (and 400 W panel count) at different sun levels, with 20% losses, worked out by the calculator.',
    head: ['Monthly use', '3.5 sun hours', '4.5 sun hours', '5.5 sun hours', '6.5 sun hours'],
    rows: ({ run }) => [500, 750, 900, 1000, 1250, 1500, 2000, 2500].map(k => [k.toLocaleString('en-US') + ' kWh', ...[3.5, 4.5, 5.5, 6.5].map(p => {
      const r = run({ kwh: k, psh: p, offset: 100, loss: 20, watt: 400 });
      return r.value + ' (' + r._panels + ')';
    })]),
    note: 'Roughly: 6–7 sun hours in the desert Southwest, 5–6 in Southern California, Texas and Florida, 4–5 across the Midwest, mid-Atlantic and Northeast, and 3.5–4 in the Pacific Northwest. These are annual averages for tilted panels; check your own address.'
  },
  sections: [
    {
      h2: 'How do you calculate solar panel output?',
      html: `<p>Multiply the panel's watt rating by peak sun hours and by the derate. A 400 W panel in a 4.5-hour location makes 400 × 4.5 × 0.8 = <strong>1.44 kWh a day</strong>, or about 526 kWh a year. The nameplate is measured at standard test conditions (1,000 W/m² of light at a 25°C cell temperature); on a hot roof a panel loses roughly 0.3–0.4% of output per °C above that, which is part of the 20% allowance.</p>
<p>For an installed plant, the <strong>performance ratio</strong> compares what it actually produced with what its nameplate would have made in the sunlight it received: PR = actual kWh ÷ (kW<sub>DC</sub> × peak sun hours over the period). A healthy residential system runs about 0.75–0.85.</p>`
    },
    {
      h2: 'How do you size the battery and inverter for solar?',
      html: `<p><strong>Inverter:</strong> panels rarely hit nameplate output, so string inverters are usually smaller than the array. A DC-to-AC ratio of 1.1–1.3 is common; PVWatts uses 1.2 by default, so an 8.4 kW array pairs with roughly a 7 kW inverter. Microinverters are matched one per panel instead.</p>
<p><strong>Battery:</strong> work in usable kWh. Average draw is daily use ÷ 24, so 29.6 kWh a day is about 1.2 kW, and 12 hours of backup needs about 14.8 kWh usable. For outage backup you can cut that sharply by backing up only essentials such as the fridge, lights, internet and a furnace fan. Off-grid systems need several days of storage, so they are sized from the worst winter week, not the average. Lithium iron phosphate batteries are typically rated in usable capacity; for lead-acid, divide by 0.5 so you only use half the bank.</p>`
    },
    {
      h2: 'How many solar panels does it take to power a house?',
      html: `<p>For the average U.S. home using about 900 kWh a month, it takes about 15 to 27 panels of 400 W, depending on sunshine: about 15 with 6.5 sun hours (desert Southwest), 21 at 4.5 hours, and 27 at 3.5 hours (Pacific Northwest). House size matters less than what is plugged in: electric heat, a pool pump or an EV can double usage.</p>
<p>Your roof sets the ceiling. A 400 W panel covers about 21 sq ft, and fire codes require clear pathways along ridges and edges, so plan on usable roof area of about 25 sq ft per panel. South-facing roofs produce the most in the U.S.; east and west faces lose roughly 10–20%.</p>`
    },
    {
      h2: 'How long does a solar panel take to charge a battery?',
      html: `<p>Divide the energy the battery needs by the panel's real output. A 12 V, 100 Ah battery holds 1.2 kWh; at 50% charge it needs 600 Wh. A 200 W panel delivering about 75% of its rating through a charge controller gives 150 W, so it takes about <strong>4 hours of full sun</strong>, or one to two days in typical weather. Use the <a href="/battery-life-calculator">battery life calculator</a> to see how long that charge runs a load.</p>`
    }
  ],
  faq: [
    { q: 'How many kW of solar do I need for 1,000 kWh a month?', a: 'About 9.1 kW at 4.5 peak sun hours and 20% losses, or roughly 23 panels of 400 W. In a 5.5-hour location it drops to about 7.5 kW.' },
    { q: 'How much does a 10 kW solar system produce?', a: 'About 13,000 kWh a year at 4.5 peak sun hours with 20% losses (10 × 4.5 × 0.8 × 365 = 13,140). With Phoenix-level sun (about 6.5 hours) the same math gives about 19,000 kWh; at Seattle-like 3.5 hours, about 10,200 kWh.' },
    { q: 'What are peak sun hours?', a: 'Peak sun hours are the day\'s total solar energy expressed as hours of full 1,000 W/m² sunlight. Five peak sun hours means the panels received 5 kWh per square meter that day, even if the sun was up for 12 hours.' },
    { q: 'Should I size solar for 100% of my usage?', a: 'Only if your utility credits exported power at a fair rate. Under net billing plans that pay less for exports, many homeowners size for 70–90% of use, or add a battery to use more of their own solar.' },
    { q: 'Do solar panels produce less in winter?', a: 'Yes. Shorter days and a lower sun can cut output by half or more in northern states. Size from annual totals, since summer surplus typically offsets winter shortfall under net metering.' },
    { q: 'How many solar panels do I need for a 2,000 sq ft house?', a: 'It depends on electricity use, not floor area. A 2,000 sq ft home using 1,000 kWh a month needs about 23 panels of 400 W at 4.5 sun hours; one using 1,500 kWh needs about 35.' }
  ],
  related: ['battery-life-calculator', 'electricity-cost-calculator', 'watt-hours-calculator', 'amp-hours-calculator', 'kw-calculator'],
  sources: [
    { name: 'NREL PVWatts Calculator (solar resource, default losses and DC/AC ratio)', url: 'https://pvwatts.nrel.gov/' },
    { name: 'U.S. DOE Solar Energy Technologies Office: Homeowner\'s Guide to Going Solar', url: 'https://www.energy.gov/eere/solar/homeowners-guide-going-solar' },
    { name: 'U.S. EIA: How much electricity does an American home use?', url: 'https://www.eia.gov/tools/faqs/faq.php?id=97&t=3' }
  ],
  disclaimer: 'Estimates for planning. Shading, roof orientation and local interconnection rules change the final design.'
};
