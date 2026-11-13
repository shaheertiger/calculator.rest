export default {
  slug: 'speed-calculator',
  hub: 'science',
  name: 'Speed Distance Time Calculator',
  title: 'Speed Calculator: 150 Miles in 2.5 Hours Is 60 mph',
  h1: 'Speed, Distance and Time Calculator With Unit Conversion and Pace',
  meta: 'Driving 150 miles in 2 hours 30 minutes is an average of 60 mph (96.6 km/h). Solve for speed, distance or time and convert to m/s, knots or running pace.',
  keyword: 'what two measurements are necessary for calculating speed',
  also: ['speed calculator', 'speed distance time calculator', 'which explains the information needed to calculate speed and velocity', 'how to calculate speed from a distance time graph', 'how to calculate average speed', 'distance calculator speed time', 'time calculator speed distance'],
  updated: '2026-11-13',
  inputs: [
    { id: 'solve', label: 'Solve for', type: 'select', value: 'speed', options: [['speed', 'Speed'], ['dist', 'Distance'], ['time', 'Time']] },
    { id: 'd', label: 'Distance', type: 'number', value: 150, showIf: { solve: ['speed', 'time'] } },
    { id: 'du', label: 'Distance unit', type: 'select', value: 'mi', options: [['mi', 'miles'], ['km', 'kilometers'], ['m', 'meters'], ['ft', 'feet'], ['nmi', 'nautical miles']] },
    { id: 'th', label: 'Hours', type: 'number', value: 2, showIf: { solve: ['speed', 'dist'] } },
    { id: 'tm', label: 'Minutes', type: 'number', value: 30, showIf: { solve: ['speed', 'dist'] } },
    { id: 'ts', label: 'Seconds', type: 'number', value: 0, showIf: { solve: ['speed', 'dist'] } },
    { id: 's', label: 'Speed', type: 'number', value: 60, showIf: { solve: ['dist', 'time'] } },
    { id: 'su', label: 'Speed unit', type: 'select', value: 'mph', options: [['mph', 'mph'], ['kmh', 'km/h'], ['ms', 'm/s'], ['fts', 'ft/s'], ['kn', 'knots']] }
  ],
  data: {
    dm: { mi: 1609.344, km: 1000, m: 1, ft: 0.3048, nmi: 1852 },
    dn: { mi: 'mi', km: 'km', m: 'm', ft: 'ft', nmi: 'nmi' },
    sm: { mph: 0.44704, kmh: 1 / 3.6, ms: 1, fts: 0.3048, kn: 1852 / 3600 },
    sn: { mph: 'mph', kmh: 'km/h', ms: 'm/s', fts: 'ft/s', kn: 'knots' }
  },
  compute(v, H, D) {
    var dm = D.dm[v.du] || 1609.344, sm = D.sm[v.su] || 0.44704;
    var secs = (isFinite(v.th) ? v.th : 0) * 3600 + (isFinite(v.tm) ? v.tm : 0) * 60 + (isFinite(v.ts) ? v.ts : 0);
    var d, t, sp;
    if (v.solve === 'speed') {
      if (!(v.d > 0)) return { error: 'Enter the distance traveled.' };
      if (!(secs > 0)) return { error: 'Enter the time taken.' };
      d = v.d * dm; t = secs; sp = d / t;
    } else if (v.solve === 'dist') {
      if (!(v.s > 0)) return { error: 'Enter the speed.' };
      if (!(secs > 0)) return { error: 'Enter the time.' };
      sp = v.s * sm; t = secs; d = sp * t;
    } else {
      if (!(v.d > 0)) return { error: 'Enter the distance.' };
      if (!(v.s > 0)) return { error: 'Enter the speed.' };
      d = v.d * dm; sp = v.s * sm; t = d / sp;
    }
    var hms = function (x) {
      var s = Math.round(x), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
      return (h ? h + ' h ' : '') + (h || m ? m + ' min' : '') + (r || (!h && !m) ? (h || m ? ' ' : '') + r + ' s' : '');
    };
    var pace = function (secPerUnit) {
      if (!isFinite(secPerUnit) || secPerUnit > 86400) return '—';
      var s = Math.round(secPerUnit), m = Math.floor(s / 60), r = s % 60;
      return m + ':' + (r < 10 ? '0' : '') + r;
    };
    var rows = [], value, label, expr;
    var sn = D.sn[v.su], dn = D.dn[v.du];
    if (v.solve === 'speed') {
      value = H.num(sp / sm, 2) + ' ' + sn; label = 'Average speed';
      expr = H.num(v.d, 3) + ' ' + dn + ' ÷ ' + H.num(t / 3600, 4) + ' h';
    } else if (v.solve === 'dist') {
      value = H.num(d / dm, 3) + ' ' + dn; label = 'Distance covered';
      expr = H.num(v.s, 3) + ' ' + sn + ' × ' + H.num(t / 3600, 4) + ' h';
    } else {
      value = hms(t); label = 'Travel time';
      expr = H.num(v.d, 3) + ' ' + dn + ' ÷ ' + H.num(v.s, 3) + ' ' + sn;
    }
    if (v.solve !== 'speed') rows.push(['Speed', H.num(sp / sm, 3) + ' ' + sn]);
    if (v.solve !== 'dist') rows.push(['Distance', H.num(d / dm, 3) + ' ' + dn]);
    if (v.solve !== 'time') rows.push(['Time', hms(t) + ' (' + H.num(t / 3600, 4) + ' h)']);
    else rows.push(['Time in hours', H.num(t / 3600, 4) + ' h', true]);
    rows.push(['mph', H.num(sp / 0.44704, 2) + ' mph', v.su !== 'mph' && v.solve === 'speed']);
    rows.push(['km/h', H.num(sp * 3.6, 2) + ' km/h', v.su === 'mph' && v.solve === 'speed']);
    rows.push(['m/s', H.num(sp, 3) + ' m/s']);
    rows.push(['ft/s', H.num(sp / 0.3048, 2) + ' ft/s']);
    rows.push(['knots', H.num(sp / (1852 / 3600), 2) + ' kn']);
    rows.push(['Pace per mile', pace(1609.344 / sp) + ' min/mi']);
    rows.push(['Pace per kilometer', pace(1000 / sp) + ' min/km']);
    return { value: value, label: label, expr: expr, rows: rows, sub: 'Average speed over the whole trip; actual speed varies along the way.' };
  },
  quick: ({ r }) => `The two measurements necessary for calculating speed are distance and time: speed = distance ÷ time. A car that covers 150 miles in 2 hours 30 minutes (2.5 hours) averages 150 ÷ 2.5 = <strong>${r.value}</strong>, or 96.56 km/h and 26.82 m/s. Rearranged, distance = speed × time and time = distance ÷ speed. Velocity also needs a direction.`,
  stepsTitle: 'How to calculate speed, distance or time',
  steps: [
    'Measure the distance traveled and the time it took. Those are the only two measurements speed needs.',
    'Convert the time to a single unit. 2 hours 30 minutes is 2.5 hours, not 2.30 hours; writing minutes after the decimal point is the most common error. Divide minutes by 60 and seconds by 3,600.',
    'Divide distance by time for speed. Multiply speed by time for distance, or divide distance by speed for time.',
    'Check the units match: miles with hours gives mph, meters with seconds gives m/s. Convert at the end if needed (1 mph = 1.609 km/h = 0.447 m/s).'
  ],
  formulaTitle: 'What is the speed, distance, time formula?',
  formula: {
    expr: 'speed = distance ÷ time<br>distance = speed × time<br>time = distance ÷ speed',
    vars: [['speed', 'how fast, in mph, km/h or m/s'], ['distance', 'total path length traveled'], ['time', 'elapsed time, in one unit (hours or seconds)']],
    note: 'The classic memory triangle puts D on top and S and T below: cover the one you want and the other two show whether to multiply or divide.'
  },
  example: `<p><strong>Road trip with a stop.</strong> You drive 210 miles. The first 120 miles take 2 h 0 min, you stop for 30 min, then the last 90 miles take 1 h 30 min. What is your average speed?</p>
<p>Total time = 2 h + 0.5 h + 1.5 h = 4.0 h. Average speed = 210 ÷ 4.0 = <strong>52.5 mph</strong>.</p>
<p>Moving speed alone (excluding the stop) = 210 ÷ 3.5 = <strong>60 mph</strong>. Both are correct answers to different questions, so say which one you mean.</p>`,
  table: {
    title: 'How long does it take to drive 100 miles at different speeds?',
    intro: 'Time = 100 miles ÷ speed, worked out by the calculator, with the matching pace in minutes and seconds per mile.',
    head: ['Speed', 'km/h', 'Time for 100 miles', 'Minutes per mile'],
    rows: ({ run }) => [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(s => { const r = run({ solve: 'time', d: 100, du: 'mi', s, su: 'mph' }); return [s + ' mph', r.rows.find(x => x[0] === 'km/h')[1].replace(' km/h', ''), r.value, r.rows.find(x => x[0] === 'Pace per mile')[1].replace(' min/mi', '')]; }),
    note: 'Going from 65 to 75 mph over 100 miles saves about 12 minutes; going from 25 to 35 mph saves almost 69 minutes. Speeding pays off least on the highway, where crash energy is highest.'
  },
  sections: [
    {
      h2: 'What information do you need to calculate speed and velocity?',
      html: `<p>Speed needs two measurements: the <strong>distance</strong> traveled and the <strong>time</strong> taken. Velocity needs those plus a <strong>direction</strong>, because it is a vector: it uses displacement (the straight-line change in position, with direction) instead of total distance.</p>
<p>The difference shows up on a round trip. Run one lap of a 400 m track in 80 s and your average speed is 400 ÷ 80 = 5 m/s, but your displacement is zero, so your average velocity is 0 m/s. Drive 30 km east in 30 minutes and your velocity is 60 km/h east.</p>`
    },
    {
      h2: 'How do you calculate average speed when the speed changes?',
      html: `<p>Divide the <strong>total distance</strong> by the <strong>total time</strong>. Do not average the speeds. Drive 60 miles to a city at 60 mph (1 hour) and back at 40 mph (1.5 hours): total 120 miles in 2.5 hours = <strong>48 mph</strong>, not 50 mph, because you spend longer at the slower speed.</p>
<p>When equal distances are covered at two speeds, the average is the harmonic mean, 2ab ÷ (a + b) = 2 × 60 × 40 ÷ 100 = 48. When equal times are spent at each speed, the simple average works.</p>`
    },
    {
      h2: 'How do you calculate speed from a distance-time graph?',
      html: `<p>Speed is the slope (gradient) of the line: rise ÷ run = change in distance ÷ change in time. If the line goes from (0 s, 0 m) to (20 s, 100 m), speed = 100 ÷ 20 = 5 m/s. A steeper line means faster motion and a flat line means the object is stopped.</p>
<p>For a curved line, the speed is changing. The instantaneous speed at a point is the slope of the tangent there; the average speed between two points is the slope of the straight line joining them. The <a href="/slope-calculator">slope calculator</a> handles the arithmetic.</p>`
    },
    {
      h2: 'How do you convert between mph, km/h, m/s and pace?',
      html: `<ul><li>mph × 1.609344 = km/h; km/h ÷ 1.609344 = mph</li><li>mph × 0.44704 = m/s; m/s × 2.23694 = mph</li><li>km/h ÷ 3.6 = m/s; m/s × 3.6 = km/h</li><li>knots × 1.15078 = mph (1 knot = 1 nautical mile, 1,852 m, per hour)</li><li>Pace (minutes per mile) = 60 ÷ mph</li></ul>
<p>Runners think in pace. A 10K in 50:00 is 12 km/h, a pace of 5:00 per km or 8:03 per mile. Enter 10 km, 0 h 50 min and choose "Speed" to see both.</p>`
    }
  ],
  faq: [
    { q: 'What is the formula for speed?', a: 'Speed = distance ÷ time. In symbols, v = d ÷ t. Its SI unit is meters per second (m/s); everyday units are mph and km/h.' },
    { q: 'How do you calculate time from speed and distance?', a: 'Divide distance by speed: t = d ÷ v. 150 miles at 60 mph takes 150 ÷ 60 = 2.5 hours, which is 2 hours 30 minutes.' },
    { q: 'How do you calculate distance from speed and time?', a: 'Multiply speed by time: d = v × t. At 65 mph for 3 hours 15 minutes (3.25 h), you cover 211.25 miles.' },
    { q: 'How do I convert minutes to hours for the speed formula?', a: 'Divide minutes by 60. 45 minutes is 0.75 hours, and 2 hours 20 minutes is 2.333 hours. Never type 2.20 for 2 hours 20 minutes.' },
    { q: 'Is speed a scalar or a vector?', a: 'Speed is a scalar: it has size only. Velocity is the vector version, with size and direction, which is why it uses displacement instead of distance.' },
    { q: 'What is 60 mph in m/s?', a: '60 mph is 26.82 m/s (60 × 0.44704), which is 96.56 km/h or 88 ft/s.' },
    { q: 'How fast is walking speed?', a: 'An average walking pace is about 3 mph (4.8 km/h), roughly 20 minutes per mile; a brisk walk is 3.5 to 4 mph.' }
  ],
  related: ['time-duration-calculator', 'trip-gas-cost-calculator', 'slope-calculator', 'force-calculator', 'orbital-period-calculator'],
  sources: [
    { name: 'OpenStax University Physics Volume 1: 3.1 Position, Displacement, and Average Velocity', url: 'https://openstax.org/books/university-physics-volume-1/pages/3-1-position-displacement-and-average-velocity' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI (mile, knot, foot conversions)', url: 'https://www.nist.gov/pml/special-publication-811' },
    { name: 'NIST Handbook 44, Appendix C: General Tables of Units of Measurement', url: 'https://www.nist.gov/pml/owm/publications/nist-handbooks/handbook-44' }
  ]
};
