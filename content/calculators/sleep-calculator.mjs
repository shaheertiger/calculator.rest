export default {
  slug: 'sleep-calculator',
  hub: 'health',
  name: 'Sleep Calculator',
  title: 'Sleep Calculator: Up at 6:30 AM? Go to Bed at 10:45 PM',
  h1: 'Sleep Calculator: Bedtimes and Wake-Up Times by 90-Minute Cycles',
  meta: 'To wake at 6:30 AM after five 90-minute sleep cycles, be in bed by 10:45 PM. Get bedtimes or wake times that fit the hours of sleep CDC lists for your age.',
  keyword: 'how much sleep do i need calculator',
  also: ['when to go to sleep calculator', 'sleep calculator', 'bedtime calculator', 'sleep cycle calculator', 'what time should i go to bed calculator', 'wake up time calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I want to', type: 'select', value: 'wake', options: [['wake', 'Wake up at a set time'], ['bed', 'Go to bed now or at a set time']], wide: true },
    { id: 'time', label: 'Time', type: 'time', value: '06:30', help: 'Wake-up time, or the time you get into bed.' },
    { id: 'latency', label: 'Time to fall asleep', type: 'number', value: 15, suffix: 'min' },
    { id: 'age', label: 'Age group', type: 'select', value: 'adult', options: [['school', '6–12 years (9–12 hours)'], ['teen', '13–17 years (8–10 hours)'], ['adult', '18–60 years (7 or more hours)'], ['a61', '61–64 years (7–9 hours)'], ['a65', '65 and older (7–8 hours)']] }
  ],
  data: { need: { school: [9, 12], teen: [8, 10], adult: [7, 9], a61: [7, 9], a65: [7, 8] } },
  compute(v, H, D) {
    var m = /^(\d{1,2}):(\d{2})/.exec(v.time || '');
    if (!m) return { error: 'Enter a time.' };
    var t0 = +m[1] * 60 + +m[2];
    var lat = v.latency >= 0 ? Math.min(v.latency, 180) : 15;
    var need = D.need[v.age] || D.need.adult;
    function fmt(x) { x = ((Math.round(x) % 1440) + 1440) % 1440; var h = Math.floor(x / 60), mm = x % 60; return (h % 12 || 12) + ':' + (mm < 10 ? '0' : '') + mm + (h < 12 ? ' AM' : ' PM'); }
    var best = 0, rows = [], opts = {};
    for (var n = 7; n >= 3; n--) {
      var hrs = n * 1.5;
      var clock = v.mode === 'bed' ? t0 + lat + n * 90 : t0 - lat - n * 90;
      opts[n] = fmt(clock);
      var fits = hrs >= need[0] && hrs <= need[1];
      if (fits && (!best || n < best)) best = n;
      if (n <= 6 || need[0] >= 9) rows.push([n + ' cycles · ' + H.dur(n * 90) + ' of sleep', opts[n] + (fits ? ' ✓ fits your age group' : hrs < need[0] ? ' (short for your age)' : ''), false]);
    }
    if (!best) best = Math.ceil(need[0] / 1.5);
    rows.forEach(function (r) { if (r[0].indexOf(best + ' cycles') === 0) r[2] = true; });
    var target = v.mode === 'bed' ? t0 + lat + best * 90 : t0 - lat - best * 90;
    return {
      value: fmt(target),
      label: v.mode === 'bed' ? 'Set your alarm for' : 'Go to bed at',
      expr: v.mode === 'bed' ? fmt(t0) + ' + ' + lat + ' min + ' + best + ' × 90 min' : fmt(t0) + ' − ' + best + ' × 90 min − ' + lat + ' min',
      rows: rows,
      opts: opts,
      sub: best + ' full cycles give ' + H.dur(best * 90) + ' of sleep. CDC lists ' + need[0] + (v.age === 'adult' ? ' or more' : '–' + need[1]) + ' hours a night for this age group.'
    };
  },
  quick: ({ r }) => `Adults 18–60 need 7 or more hours of sleep a night, according to the CDC. Sleep runs in cycles of about 90 minutes, so to wake at <strong>6:30 AM</strong> after five cycles (7.5 hours) plus 15 minutes to fall asleep, go to bed at <strong>${r.value}</strong>. Six cycles (9 hours) means a 9:15 PM bedtime; teens need 8–10 hours.`,
  stepsTitle: 'How to work out your bedtime from your wake-up time',
  steps: [
    'Start with the time you must get up, for example 6:30 AM.',
    'Pick the hours of sleep for your age: 7 or more for adults, 8–10 for teens, 9–12 for children 6–12 (CDC).',
    'Count back in 90-minute cycles that cover that need: five cycles is 7 hours 30 minutes, six is 9 hours.',
    '<strong>Subtract the time it takes you to fall asleep</strong>, usually 10–20 minutes. Forgetting this is why a "7.5-hour" bedtime often delivers only 7 hours 15 minutes of sleep.',
    'Keep the same bedtime and wake time every day, weekends included, so your body clock can settle.'
  ],
  formulaTitle: 'How does the sleep cycle calculation work?',
  formula: {
    expr: 'Bedtime = Wake time − (cycles × 90 min) − time to fall asleep<br>Wake time = Bedtime + time to fall asleep + (cycles × 90 min)',
    vars: [['cycles', 'complete NREM–REM cycles, usually 4–6 a night'], ['90 min', 'average length of one sleep cycle'], ['time to fall asleep', 'sleep latency, the minutes between lights out and sleep']],
    note: 'StatPearls describes the body cycling through all sleep stages about 4 to 6 times a night, averaging 90 minutes per cycle. Real cycles vary from person to person and through the night, so treat the times as targets, not exact boundaries.'
  },
  example: `<p>A nurse starting a 7:00 AM shift needs to be up at <strong>5:15 AM</strong> and takes about 20 minutes to fall asleep.</p>
<p>Five cycles: 5:15 AM − 7 h 30 min = 9:45 PM, minus 20 minutes = <strong>9:25 PM</strong> in bed.</p>
<p>If she can't get to bed until 11:00 PM, the bedtime mode works forward: 11:00 PM + 20 min + four cycles (6 hours) = <strong>5:20 AM</strong>, five minutes after her alarm. She would get just under 6 hours, short of the 7 hours recommended for adults.</p>`,
  table: {
    title: 'What time should I go to bed to wake up on time?',
    intro: 'Bedtimes for common wake-up times, allowing 15 minutes to fall asleep, calculated by the tool above.',
    head: ['Wake-up time', '4 cycles (6 h)', '5 cycles (7.5 h)', '6 cycles (9 h)'],
    rows: ({ run }) => ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00'].map(t => {
      const r = run({ mode: 'wake', time: t, latency: 15, age: 'adult' });
      const [h, m] = t.split(':').map(Number);
      return [(h % 12 || 12) + ':' + String(m).padStart(2, '0') + ' AM', r.opts[4], r.opts[5], r.opts[6]];
    }),
    note: 'Five cycles meets the CDC\'s 7-hour minimum for adults; six cycles suits teenagers and anyone paying back a sleep debt.'
  },
  sections: [
    {
      h2: 'How much sleep do I need at my age?',
      html: `<p>The CDC's recommendations, based on American Academy of Sleep Medicine consensus statements:</p>
<div class="twrap"><table><thead><tr><th>Age</th><th>Hours per 24 hours</th></tr></thead><tbody>
<tr><td>Newborn, 0–3 months</td><td>14–17</td></tr>
<tr><td>Infant, 4–12 months</td><td>12–16 including naps</td></tr>
<tr><td>Toddler, 1–2 years</td><td>11–14 including naps</td></tr>
<tr><td>Preschool, 3–5 years</td><td>10–13 including naps</td></tr>
<tr><td>School age, 6–12 years</td><td>9–12</td></tr>
<tr><td>Teen, 13–17 years</td><td>8–10</td></tr>
<tr><td>Adult, 18–60 years</td><td>7 or more</td></tr>
<tr><td>Adult, 61–64 years</td><td>7–9</td></tr>
<tr><td>Adult, 65 and older</td><td>7–8</td></tr>
</tbody></table></div>
<p>These are amounts of actual sleep, not time in bed. If you routinely need an alarm to drag yourself up and sleep much longer on days off, you are probably getting less than you need.</p>`
    },
    {
      h2: 'Do 90-minute sleep cycles really matter?',
      html: `<p>Each night you move through light sleep (N1, N2), deep sleep (N3) and REM sleep in repeating cycles. Deep sleep dominates the early cycles and REM the later ones. Being woken out of deep sleep tends to leave you groggy for a while, an effect called sleep inertia, which is the idea behind timing your alarm to the end of a cycle.</p>
<p>The 90-minute figure is an average. Cycles can run shorter or longer, and the time you take to fall asleep changes night to night, so no calculator can hit a cycle boundary to the minute. Use the times as a guide, and remember that total sleep matters more than precise timing: 7.5 hours with a mid-cycle wake-up still beats 6 hours that ends neatly.</p>`
    },
    {
      h2: 'Is 6 hours of sleep enough?',
      html: `<p>Not for most adults. The American Academy of Sleep Medicine and Sleep Research Society concluded in 2015 that adults should sleep 7 or more hours a night on a regular basis. Regularly sleeping less than 7 hours is associated with weight gain, diabetes, high blood pressure, heart disease, stroke, depression, impaired performance and a greater risk of errors and accidents.</p>
<p>A small number of people function well on less, but feeling fine is not a reliable test: people who are chronically short of sleep tend to underestimate how impaired they are. More than 9 hours can be appropriate for young adults, people recovering from sleep debt and people who are ill.</p>`
    },
    {
      h2: 'What time should a teenager go to bed?',
      html: `<p>Teens need 8 to 10 hours, but puberty shifts the body clock later, so many cannot fall asleep before about 11 PM. A 6:30 AM alarm then leaves 7.5 hours at best. Working backward with six cycles, a teen who must be up at 6:30 should be asleep by 9:30 PM and in bed by about 9:15 PM; five cycles (10:45 PM bedtime) is the latest that still meets the 8-hour minimum only if they fall asleep quickly.</p>
<p>This mismatch is why the American Academy of Pediatrics recommends that middle and high schools start no earlier than 8:30 AM.</p>`
    }
  ],
  faq: [
    { q: 'What time should I go to bed if I wake up at 6 AM?', a: 'For five 90-minute cycles (7.5 hours) plus 15 minutes to fall asleep, go to bed at 10:15 PM. For six cycles (9 hours), 8:45 PM.' },
    { q: 'Is 7.5 hours of sleep better than 8?', a: 'Not necessarily. 7.5 hours lines up with five average cycles, but cycle length varies, and 8 hours gives more total sleep. Both meet the 7-hour adult minimum.' },
    { q: 'How long does it normally take to fall asleep?', a: 'Many people take about 10 to 20 minutes. Regularly lying awake longer than about 30 minutes can be a sign of insomnia worth discussing with a clinician.' },
    { q: 'How many sleep cycles do you need a night?', a: 'Most adults get 4 to 6 cycles in a night. Five cycles of about 90 minutes is 7.5 hours, which meets the CDC recommendation of 7 or more hours for adults.' },
    { q: 'Do naps count toward total sleep?', a: 'For babies and young children, yes; the CDC ranges include naps up to age 5. For adults, a short nap can ease sleepiness but does not fully replace a night of consolidated sleep.' },
    { q: 'Can I catch up on sleep on the weekend?', a: 'Partly. Sleeping in can reduce sleepiness after a short week, but it shifts your body clock later and does not undo every effect of regular short sleep. A consistent schedule works better.' },
    { q: 'What if I wake up in the middle of a cycle?', a: 'You may feel groggy for a few minutes to half an hour. It passes, and getting enough total sleep matters more than waking at a cycle boundary.' }
  ],
  related: ['water-intake-calculator', 'bmr-calculator', 'calorie-calculator', 'bac-calculator'],
  sources: [
    { name: 'CDC: About Sleep (recommended hours by age)', url: 'https://www.cdc.gov/sleep/about/index.html' },
    { name: 'Watson et al. 2015: AASM/SRS recommended amount of sleep for a healthy adult (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/25979105/' },
    { name: 'Paruthi et al. 2016: AASM recommended amount of sleep for pediatric populations (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/27250809/' },
    { name: 'StatPearls (NCBI Bookshelf): Physiology, Sleep Stages', url: 'https://www.ncbi.nlm.nih.gov/books/NBK526132/' },
    { name: 'NINDS: Brain Basics, Understanding Sleep', url: 'https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-understanding-sleep' }
  ],
  disclaimer: 'General information, not medical advice. Ongoing trouble sleeping, loud snoring or daytime sleepiness is worth raising with a clinician.'
};
