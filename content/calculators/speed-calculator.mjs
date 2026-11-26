export default {
  slug: 'speed-calculator',
  hub: 'science',
  name: 'Speed Calculator',
  title: 'Speed Calculator: 150 Miles in 2.5 Hours = 60 mph (Steps)',
  meta: 'John drives 150 miles in 2.5 hours, so his speed is 60 mph: 150 ÷ 2.5. Solve for speed, distance or time with units, including minutes-to-hours steps.',
  keyword: 'speed calculator',
  also: ['john drives 150 miles in 2.5 hours. what is his speed', 'speed distance time calculator', 'how to calculate speed', 'average speed formula'],
  updated: '2026-11-26',
  answer: ({ r }) => `John drives 150 miles in 2.5 hours, so his speed is <strong>${r.value}</strong>: divide the distance by the time, 150 ÷ 2.5.`,
  inputs: [
    { id: 'mode', label: 'Solve for', type: 'select', value: 'speed', options: [['speed', 'Speed'], ['dist', 'Distance'], ['time', 'Time']] },
    { id: 'units', label: 'Units in the question', type: 'select', value: 'mi_h', options: [['mi_h', 'miles, hours, mph'], ['mi_min', 'miles, minutes, mph'], ['km_h', 'km, hours, km/h'], ['km_min', 'km, minutes, km/h'], ['m_s', 'meters, seconds, m/s'], ['m_s_kmh', 'meters, seconds, km/h'], ['ft_s', 'feet, seconds, ft/s']] },
    { id: 'd', label: 'Distance', type: 'number', value: 150, showIf: { mode: ['speed', 'time'] } },
    { id: 't', label: 'Time', type: 'number', value: 2.5, showIf: { mode: ['speed', 'dist'] } },
    { id: 's', label: 'Speed', type: 'number', value: 60, showIf: { mode: ['dist', 'time'] } }
  ],
  compute(v, H) {
    var U = { mi_h: ['mi', 'h', 'mph', 1, 1], mi_min: ['mi', 'min', 'mph', 60, 1], km_h: ['km', 'h', 'km/h', 1, 1], km_min: ['km', 'min', 'km/h', 60, 1], m_s: ['m', 's', 'm/s', 1, 1], m_s_kmh: ['m', 's', 'km/h', 1, 3.6], ft_s: ['ft', 's', 'ft/s', 1, 1] };
    var o = U[v.units] || U.mi_h, du = ' ' + o[0], tu = ' ' + o[1], su = ' ' + o[2], tdiv = o[3], sk = o[4];
    var f = function (x) { return H.num(x, 10); };
    var p6 = function (x) { return H.num(x, 6); };
    var out = function (x) {
      var r = H.round(x, 2);
      return { s: H.num(r, 2), note: Math.abs(r - x) < 1e-9 ? 'exact, no rounding needed' : 'rounded to 2 decimal places' };
    };
    var hm = function (mins) { return mins >= 60 ? ', which is ' + H.dur(mins) : ''; };
    var st, a;
    if (v.mode === 'dist') {
      if (!(v.s > 0) || !(v.t > 0)) return { error: 'Enter the speed and the time, both above 0.' };
      var th = v.t / tdiv, sb = v.s / sk, dd = sb * th;
      st = ['<b>Formula:</b> distance = speed × time', '<b>Substitute:</b> distance = ' + f(v.s) + su + ' × ' + f(v.t) + tu];
      if (tdiv !== 1) st.push('<b>Convert the time to hours</b> (the speed is per hour): ' + f(v.t) + ' min ÷ 60 = ' + p6(th) + ' h');
      if (sk !== 1) st.push('<b>Convert the speed to m/s</b> (the time is in seconds): ' + f(v.s) + ' km/h ÷ 3.6 = ' + p6(sb) + ' m/s');
      st.push('<b>Multiply:</b> ' + p6(sb) + (sk !== 1 ? ' m/s' : su) + ' × ' + p6(th) + (tdiv !== 1 ? ' h' : tu) + ' = ' + p6(dd) + du + '. The time units cancel, leaving' + du + '.');
      a = out(dd);
      st.push('<b>Answer:</b> distance = ' + a.s + du + ' (' + a.note + ').');
      return { value: a.s + du, label: 'Distance', rows: [['Speed', f(v.s) + su], ['Time', f(v.t) + tu]], steps: st };
    }
    if (!(v.d > 0)) return { error: 'Enter the distance, above 0.' };
    if (v.mode === 'time') {
      if (!(v.s > 0)) return { error: 'Enter the speed, above 0.' };
      var sb2 = v.s / sk, tb = v.d / sb2, tt = tb * tdiv;
      st = ['<b>Formula:</b> time = distance ÷ speed', '<b>Substitute:</b> time = ' + f(v.d) + du + ' ÷ ' + f(v.s) + su];
      if (sk !== 1) st.push('<b>Convert the speed to m/s</b> (the distance is in meters): ' + f(v.s) + ' km/h ÷ 3.6 = ' + p6(sb2) + ' m/s');
      st.push('<b>Divide:</b> ' + f(v.d) + du + ' ÷ ' + p6(sb2) + (sk !== 1 ? ' m/s' : su) + ' = ' + p6(tb) + (tdiv !== 1 ? ' h' : tu));
      if (tdiv !== 1) st.push('<b>Convert hours to minutes:</b> ' + p6(tb) + ' h × 60 = ' + p6(tt) + ' min');
      a = out(tt);
      var mins = o[1] === 'h' ? tt * 60 : o[1] === 'min' ? tt : 0;
      st.push('<b>Answer:</b> time = ' + a.s + tu + ' (' + a.note + ')' + hm(mins) + '.');
      return { value: a.s + tu, label: 'Time', rows: [['Distance', f(v.d) + du], ['Speed', f(v.s) + su]], steps: st };
    }
    if (!(v.t > 0)) return { error: 'Enter the time, above 0.' };
    var th2 = v.t / tdiv, base = v.d / th2, sp = base * sk;
    st = ['<b>Formula:</b> speed = distance ÷ time', '<b>Substitute:</b> speed = ' + f(v.d) + du + ' ÷ ' + f(v.t) + tu];
    if (tdiv !== 1) st.push('<b>Convert the time to hours</b> (the answer is per hour): ' + f(v.t) + ' min ÷ 60 = ' + p6(th2) + ' h');
    st.push('<b>Divide:</b> ' + f(v.d) + du + ' ÷ ' + p6(th2) + (tdiv !== 1 ? ' h' : tu) + ' = ' + p6(base) + (sk !== 1 ? ' m/s' : su));
    st.push('<b>Check:</b> ' + p6(base) + (sk !== 1 ? ' m/s' : su) + ' × ' + p6(th2) + (tdiv !== 1 ? ' h' : tu) + ' = ' + p6(base * th2) + du + ', the distance in the question.');
    if (sk !== 1) st.push('<b>Convert m/s to km/h:</b> ' + p6(base) + ' m/s × 3.6 = ' + p6(sp) + ' km/h (3,600 s in an hour ÷ 1,000 m in a km = 3.6)');
    a = out(sp);
    st.push('<b>Answer:</b> speed = ' + a.s + su + ' (' + a.note + ').');
    return { value: a.s + su, label: 'Average speed', rows: [['Distance', f(v.d) + du], ['Time', f(v.t) + tu]], steps: st };
  },
  facts: {
    formula: 'speed = distance ÷ time<br>distance = speed × time<br>time = distance ÷ speed',
    vars: [['speed', 'average speed: distance covered per unit of time (mph, km/h, m/s)'], ['distance', 'the total length traveled'], ['time', 'how long the trip took, in the same time unit as the speed']],
    rounding: 'convert units first, keep full precision, and round the final answer to 2 decimal places unless the question says otherwise.',
    note: 'Units must match: miles with mph needs hours, meters with m/s needs seconds. 1 mile = 1.609344 km, and 1 m/s = 3.6 km/h.'
  },
  example: {
    h2: 'Worked example: a bike ride timed in minutes',
    html: `<p><strong>Problem:</strong> Maya rides 18 km to school in 40 minutes. What is her average speed in km/h?</p>
<p><strong>1.</strong> Speed = distance ÷ time. The answer is wanted per hour, so the minutes must become hours.</p>
<p><strong>2.</strong> Convert: 40 min ÷ 60 = 0.666667 h.</p>
<p><strong>3.</strong> Divide: 18 km ÷ 0.666667 h = 27 km/h.</p>
<p><strong>Answer:</strong> 27 km/h. Sense check: 40 minutes is two-thirds of an hour, so in a full hour she would go half as far again, 18 + 9 = 27 km.</p>`
  },
  variants: [
    {
      h2: 'John drives 150 miles in 2.5 hours. What is his speed?',
      html: `<p>His speed is <strong>60 mph</strong>. Divide the distance by the time: 150 mi ÷ 2.5 h = 60 mph. That is one mile every minute, which makes it easy to check: 2.5 hours is 150 minutes, and 150 minutes at a mile a minute is 150 miles. At the same speed he would cover 60 mph × 4 h = 240 miles in 4 hours.</p>`
    },
    {
      h2: 'How do you find time from distance and speed?',
      html: `<p>Divide the distance by the speed. A 210-mile trip at 60 mph takes 210 ÷ 60 = <strong>3.5 hours</strong>, which is 3 h 30 min. The decimal part is a fraction of an hour, not minutes: 0.5 h × 60 = 30 min. Pick "Time" in the calculator and it converts the answer for you.</p>`
    },
    {
      h2: 'How do you convert m/s to km/h?',
      html: `<p>Multiply by 3.6. A sprinter who runs 100 m in 12.5 s moves at 100 ÷ 12.5 = 8 m/s, and 8 × 3.6 = <strong>28.8 km/h</strong>. The 3.6 comes from 3,600 seconds in an hour divided by 1,000 meters in a kilometer. To go back from km/h to m/s, divide by 3.6.</p>`
    }
  ],
  mistakes: [
    '<strong>Writing 2 hours 30 minutes as 2.3 hours.</strong> 30 minutes is half an hour, so the time is 2.5 h. Using 2.3 gives 150 ÷ 2.3 = 65.22 mph instead of 60 mph.',
    '<strong>Dividing time by distance.</strong> 2.5 ÷ 150 = 0.016667 hours per mile is a pace, not a speed. Speed always has distance on top.',
    '<strong>Mixing minutes with mph.</strong> 12 miles ÷ 45 minutes = 0.266667 miles per minute. Multiply by 60 (or convert 45 min to 0.75 h first) to get 16 mph.',
    '<strong>Averaging two speeds.</strong> Driving 60 miles out at 30 mph and back at 60 mph does not average 45 mph. The trip takes 2 h + 1 h = 3 h, so the average speed is 120 mi ÷ 3 h = 40 mph.'
  ],
  related: ['time-duration-calculator', 'slope-calculator', 'efficiency-calculator', 'scientific-notation-calculator'],
  faq: [
    { q: 'What is the formula for speed?', a: 'Speed = distance ÷ time. Rearranged, distance = speed × time and time = distance ÷ speed. Cover the one you want in the distance-speed-time triangle to remember which way to divide.' },
    { q: 'How do I convert mph to km/h?', a: 'Multiply by 1.609344, the number of kilometers in a mile. 60 mph × 1.609344 = 96.56 km/h. To go from km/h to mph, divide by 1.609344.' },
    { q: 'Is speed the same as velocity?', a: 'Not quite. Speed is how fast you go; velocity also includes a direction. Average speed is total distance ÷ total time, which is what this calculator works out.' },
    { q: 'How do I write minutes as hours?', a: 'Divide the minutes by 60. 1 hour 15 minutes is 1 + 15 ÷ 60 = 1.25 hours, and 40 minutes is 0.666667 hours.' }
  ],
  sources: [
    { name: 'OpenStax College Physics 2e: 2.3 Time, Velocity, and Speed', url: 'https://openstax.org/books/college-physics-2e/pages/2-3-time-velocity-and-speed' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI (conversion factors)', url: 'https://www.nist.gov/pml/special-publication-811' }
  ]
};
