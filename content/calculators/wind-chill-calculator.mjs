export default {
  slug: 'wind-chill-calculator',
  hub: 'science',
  name: 'Wind Chill Calculator',
  title: 'Wind Chill Calculator: 0 °F at 15 mph Feels Like −19 °F',
  h1: 'Wind Chill Calculator With the NWS Formula and Frostbite Times',
  meta: 'At 0 °F with a 15 mph wind, the NWS wind chill is −19 °F and exposed skin can freeze in about 30 minutes. Enter °F and mph or °C and km/h.',
  keyword: 'how to calculate the wind chill',
  also: ['wind chill calculator', 'wind chill formula', 'wind chill chart', 'how is wind chill calculated', 'feels like temperature calculator', 'frostbite time chart'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sys', label: 'Units', type: 'select', value: 'us', options: [['us', '°F and mph'], ['metric', '°C and km/h']] },
    { id: 't', label: 'Air temperature', type: 'number', value: 0, help: 'The formula is defined at or below 50 °F (10 °C).' },
    { id: 'w', label: 'Wind speed', type: 'number', value: 15, help: 'Sustained wind from a forecast or weather station (measured at 33 ft / 10 m). At least 3 mph (4.8 km/h).' }
  ],
  compute(v, H) {
    if (!isFinite(v.t)) return { error: 'Enter the air temperature.' };
    if (!(v.w >= 0)) return { error: 'Enter the wind speed (0 or more).' };
    var us = v.sys !== 'metric';
    var tF = us ? v.t : v.t * 9 / 5 + 32;
    var mph = us ? v.w : v.w / 1.609344;
    var valid = tF <= 50 + 1e-9 && mph >= 3 - 1e-9;
    var wcF, wcC;
    if (valid) {
      if (us) { var p = Math.pow(v.w, 0.16); wcF = 35.74 + 0.6215 * v.t - 35.75 * p + 0.4275 * v.t * p; wcC = (wcF - 32) * 5 / 9; }
      else { var q = Math.pow(v.w, 0.16); wcC = 13.12 + 0.6215 * v.t - 11.37 * q + 0.3965 * v.t * q; wcF = wcC * 9 / 5 + 32; }
    } else { wcF = tF; wcC = (tF - 32) * 5 / 9; }
    var wc = us ? wcF : wcC, unit = us ? ' °F' : ' °C';
    var rc = Math.round(wcC);
    var risk = rc <= -55 ? ['Extreme', 'under 2 minutes'] : rc <= -48 ? ['Severe', '2 to 5 minutes'] : rc <= -40 ? ['Very high', '5 to 10 minutes'] : rc <= -28 ? ['High', '10 to 30 minutes'] : rc <= -10 ? ['Moderate', 'unlikely within 30 minutes; hypothermia risk with long exposure'] : ['Low', 'unlikely'];
    var r0 = function (x) { var n = Math.round(x); return (n < 0 ? '−' : '') + Math.abs(n); };
    var rows = [
      ['Wind chill (unrounded)', H.num(wc, 1).replace('-', '−') + unit],
      [us ? 'In Celsius' : 'In Fahrenheit', (us ? r0(wcC) + ' °C' : r0(wcF) + ' °F')],
      ['Feels colder than the air by', H.num(Math.abs((us ? tF : (tF - 32) * 5 / 9) - wc), 1) + (us ? ' °F' : ' °C')],
      ['Frostbite risk', risk[0], true],
      ['Exposed skin can freeze in', risk[1]]
    ];
    var sub = valid ? 'NWS 2001 wind chill for exposed skin on the face. Frostbite times follow Environment and Climate Change Canada\'s wind chill risk bands.'
      : (tF > 50 ? 'Wind chill is only defined at or below 50 °F (10 °C); above that, the "feels like" value is just the air temperature (or the heat index in hot weather).' : 'Below 3 mph (4.8 km/h) the air counts as calm, so the wind chill equals the air temperature.');
    return {
      value: r0(wc) + unit,
      label: valid ? 'Wind chill (feels like)' : 'Feels like (wind chill not applicable)',
      expr: us ? H.num(v.t, 1) + ' °F, ' + H.num(v.w, 1) + ' mph' : H.num(v.t, 1) + ' °C, ' + H.num(v.w, 1) + ' km/h',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `To calculate the wind chill, the National Weather Service uses WC = 35.74 + 0.6215T − 35.75V<sup>0.16</sup> + 0.4275TV<sup>0.16</sup>, with T in °F and V the wind speed in mph. At 0 °F and 15 mph, V<sup>0.16</sup> = 1.542, so the wind chill is <strong>${r.value}</strong> (−29 °C). At that level exposed skin can get frostbite in about 30 minutes.`,
  stepsTitle: 'How to calculate wind chill by hand',
  steps: [
    'Check the formula applies: air temperature at or below 50 °F and wind of at least 3 mph. Outside that range the wind chill is simply the air temperature.',
    'Raise the wind speed in mph to the 0.16 power. On a calculator, type 15, press x<sup>y</sup> (or ^), then 0.16 to get 1.542. Using 0.16 as a multiplier instead of an exponent is the usual slip.',
    'Plug in: 35.74 + 0.6215 × T − 35.75 × V<sup>0.16</sup> + 0.4275 × T × V<sup>0.16</sup>.',
    'Round to the nearest whole degree, the way the NWS chart and forecasts report it.'
  ],
  formulaTitle: 'What is the NWS wind chill formula?',
  formula: {
    expr: 'WC(°F) = 35.74 + 0.6215T − 35.75V<sup>0.16</sup> + 0.4275T·V<sup>0.16</sup><br>WC(°C) = 13.12 + 0.6215T − 11.37V<sup>0.16</sup> + 0.3965T·V<sup>0.16</sup>',
    vars: [['T', 'air temperature (°F in the first form, °C in the metric form)'], ['V', 'wind speed at 33 ft / 10 m (mph in the first form, km/h in the metric form)'], ['WC', 'wind chill temperature, the air temperature in calm conditions that would cool exposed skin as fast']],
    note: 'Both forms were adopted in 2001 by the U.S. National Weather Service and Environment Canada. They model heat loss from a face at about 5 ft above ground, walking into the wind on a clear night with no sunshine.'
  },
  example: `<p><strong>Bus stop at −10 °C.</strong> The forecast in Toronto is −10 °C with a 30 km/h wind. What is the wind chill?</p>
<p>V<sup>0.16</sup> = 30<sup>0.16</sup> = 1.723.</p>
<p>WC = 13.12 + 0.6215(−10) − 11.37(1.723) + 0.3965(−10)(1.723) = 13.12 − 6.215 − 19.59 − 6.83 = <strong>−19.5 °C</strong>, reported as −20 (about −3 °F).</p>
<p>That falls in the moderate band: frostbite is unlikely within 30 minutes, but a long wait without a hat and gloves still risks it.</p>`,
  table: {
    title: 'What does the wind chill chart look like?',
    intro: 'Wind chill in °F from the NWS formula, rounded to whole degrees. Bold cells are at or below −18 °F (−28 °C), where frostbite can set in within 30 minutes.',
    head: ['Air temp', '5 mph', '10 mph', '15 mph', '20 mph', '30 mph', '40 mph', '50 mph'],
    rows: ({ run }) => [40, 30, 20, 10, 5, 0, -5, -10, -20, -30].map(t => [t + ' °F', ...[5, 10, 15, 20, 30, 40, 50].map(w => { const r = run({ sys: 'us', t, w }); const n = parseFloat(r.rows[0][1].replace('−', '-')); return Math.round((n - 32) * 5 / 9) <= -28 ? '<strong>' + r.value + '</strong>' : r.value; })]),
    note: 'Values match the official NWS Wind Chill Chart. For metric units, switch the calculator to °C and km/h.'
  },
  sections: [
    {
      h2: 'How long does it take to get frostbite in wind chill?',
      html: `<p>The colder the wind chill, the faster exposed skin freezes. Environment and Climate Change Canada uses these bands, and the calculator reports them:</p>
<div class="twrap"><table><thead><tr><th>Wind chill</th><th>Risk</th><th>Exposed skin can freeze in</th></tr></thead><tbody>
<tr><td>Above −10 °C (14 °F)</td><td>Low</td><td>Unlikely</td></tr>
<tr><td>−10 to −27 °C (14 to −17 °F)</td><td>Moderate</td><td>Unlikely in 30 min; hypothermia risk over long periods</td></tr>
<tr><td>−28 to −39 °C (−18 to −38 °F)</td><td>High</td><td>10–30 minutes</td></tr>
<tr><td>−40 to −47 °C (−40 to −53 °F)</td><td>Very high</td><td>5–10 minutes</td></tr>
<tr><td>−48 to −54 °C (−54 to −65 °F)</td><td>Severe</td><td>2–5 minutes</td></tr>
<tr><td>−55 °C (−67 °F) and colder</td><td>Extreme</td><td>Under 2 minutes</td></tr>
</tbody></table></div>
<p>Cheeks, nose, ears, fingers and toes go first. Numbness and white or grayish-yellow skin are warning signs; get indoors and rewarm gently.</p>`
    },
    {
      h2: 'Can wind chill freeze pipes or a car engine?',
      html: `<p>No. Wind chill describes how fast heat leaves warm, exposed skin. Wind makes a warm object cool down faster, but it cannot cool anything below the actual air temperature. At 35 °F with a 30 mph wind the wind chill is 22 °F, yet a puddle will not freeze and neither will your radiator, because the air itself is above 32 °F.</p>
<p>Wind still matters for pipes and engines in the sense that they reach the air temperature sooner, so a pipe in a drafty crawlspace freezes faster than one in still air once the air is below freezing.</p>`
    },
    {
      h2: 'Why did the wind chill formula change in 2001?',
      html: `<p>The original index, from Siple and Passel's 1940s experiments cooling water bottles in Antarctica, exaggerated the chill in strong winds. The 2001 version is based on a model of heat flow through human facial skin, checked against volunteers walking in a chilled wind tunnel, and it uses wind at face height rather than at the 33-foot level of weather instruments (the formula adjusts for that internally).</p>
<p>The result is milder numbers in most conditions: the old index called 0 °F with a 15 mph wind about −31 °F; the current one gives −19 °F.</p>`
    },
    {
      h2: 'When does the Weather Service warn about wind chill?',
      html: `<p>Thresholds are set by each local NWS office because "dangerously cold" differs between Florida and North Dakota. Since late 2024 the NWS has issued <strong>Cold Weather Advisories</strong> and <strong>Extreme Cold Warnings</strong> in place of the older Wind Chill Advisory and Wind Chill Warning; both are driven largely by forecast wind chill. In the northern Plains an Extreme Cold Warning typically means wind chills around −35 °F or colder, while southern offices use much higher thresholds.</p>`
    }
  ],
  faq: [
    { q: 'What is the wind chill at 20 °F with a 10 mph wind?', a: 'About 9 °F. With V⁰·¹⁶ = 1.445, the formula gives 35.74 + 12.43 − 51.67 + 12.36 = 8.9 °F.' },
    { q: 'Does wind chill apply above 50 °F?', a: 'No. The NWS formula is defined only at or below 50 °F and for winds of at least 3 mph. Above 50 °F the wind\'s cooling effect is usually pleasant, and in hot, humid weather the heat index is used instead.' },
    { q: 'Is wind chill the same as "feels like" temperature?', a: 'In cold, windy weather the "feels like" value on most weather apps is the wind chill. Some apps blend in humidity and sunshine, so their number can differ by a few degrees from the NWS formula.' },
    { q: 'Does sunshine change the wind chill?', a: 'The formula assumes no sun. Bright sunshine can make it feel 10 to 18 °F warmer than the calculated wind chill, according to the NWS, but the formula itself does not include it.' },
    { q: 'What wind speed should I use?', a: 'Use the sustained wind from a forecast or a nearby weather station, which is measured 33 ft (10 m) above the ground. Gusts are briefly stronger, but the index is built for sustained wind.' },
    { q: 'Can dogs get frostbite from wind chill?', a: 'Yes. Ears, tails and paw pads of short-haired dogs are exposed skin, so the same wind chill bands are a reasonable guide for limiting time outside.' },
    { q: 'How do you calculate wind chill in Celsius?', a: 'Use the metric form with T in °C and V in km/h: WC = 13.12 + 0.6215T − 11.37V⁰·¹⁶ + 0.3965TV⁰·¹⁶. At −10 °C and 30 km/h it gives −19.5 °C.' }
  ],
  related: ['temperature-converter', 'speed-calculator', 'specific-heat-calculator'],
  sources: [
    { name: 'National Weather Service: Wind Chill Chart', url: 'https://www.weather.gov/safety/cold-wind-chill-chart' },
    { name: 'National Weather Service: Wind Chill Calculator', url: 'https://www.weather.gov/epz/wxcalc_windchill' },
    { name: 'Environment and Climate Change Canada: Wind chill index', url: 'https://www.canada.ca/en/environment-climate-change/services/weather-health/wind-chill-cold-weather/wind-chill-index.html' },
    { name: 'National Weather Service: Cold Weather Safety', url: 'https://www.weather.gov/safety/cold' }
  ],
  disclaimer: 'Frostbite times are general guidance for healthy adults with dry skin, not medical advice.'
};
