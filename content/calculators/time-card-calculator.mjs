export default {
  slug: 'time-card-calculator',
  hub: 'time',
  name: 'Time Card Calculator',
  title: 'Time Card Calculator: 41:45 Is 41.75 Hours (With Overtime)',
  h1: 'Time Card Calculator: Add Up Hours and Minutes Worked This Week',
  meta: 'Enter clock-in, clock-out and unpaid breaks per day. Five shifts with 30-minute lunches total 41:45 (41.75 hours), or $959.06 at $22.50/hr with overtime.',
  keyword: 'how to calculate hours and minutes worked',
  also: ['time card calculator', 'timesheet calculator', 'hours worked calculator', 'how to calculate hours worked', 'weekly hours calculator', 'convert minutes to decimal hours', 'punch clock calculator'],
  updated: '2026-11-13',
  inputs: [
    {
      id: 'days', label: 'Shifts this week', type: 'rows', addLabel: '+ add shift', max: 14, wide: true,
      fields: [
        { id: 'day', label: 'Day', type: 'text', value: '', blank: true, placeholder: 'e.g. Sat' },
        { id: 'in', label: 'Clock in', type: 'time', value: '09:00' },
        { id: 'out', label: 'Clock out', type: 'time', value: '17:00' },
        { id: 'brk', label: 'Unpaid break (min)', type: 'number', value: 30 }
      ],
      value: [
        { day: 'Mon', in: '08:00', out: '17:00', brk: 30 },
        { day: 'Tue', in: '08:00', out: '17:30', brk: 30 },
        { day: 'Wed', in: '07:45', out: '16:30', brk: 30 },
        { day: 'Thu', in: '08:00', out: '17:00', brk: 30 },
        { day: 'Fri', in: '08:00', out: '16:00', brk: 30 }
      ],
      help: 'A clock-out earlier than the clock-in is treated as an overnight shift ending the next day.'
    },
    { id: 'round', label: 'Round each punch to the nearest', type: 'select', value: '0', options: [['0', 'No rounding (exact minutes)'], ['5', '5 minutes'], ['6', '6 minutes (tenth of an hour)'], ['15', '15 minutes (quarter hour)']] },
    { id: 'rate', label: 'Hourly pay rate (optional)', type: 'number', value: 22.5, prefix: '$' },
    { id: 'ot', label: 'Overtime rule', type: 'select', value: 'week', options: [['week', 'Federal: 1.5× over 40 hours a week'], ['ca', 'California: 1.5× over 8 a day / 40 a week, 2× over 12 a day'], ['none', 'No overtime']] }
  ],
  compute(v, H) {
    function tm(s) { var m = /^(\d{1,2}):(\d{2})/.exec(String(s || '')); if (!m) return NaN; var h = +m[1], mi = +m[2]; return h < 24 && mi < 60 ? h * 60 + mi : NaN; }
    function hm(min) { min = Math.round(min); return Math.floor(min / 60) + ':' + (min % 60 < 10 ? '0' : '') + (min % 60); }
    function t12(min) { var h = Math.floor(min / 60) % 24, m = min % 60; return ((h + 11) % 12 + 1) + ':' + (m < 10 ? '0' : '') + m + (h < 12 ? ' AM' : ' PM'); }
    var step = Number(v.round) || 0;
    function rnd(x) { return step ? Math.round(x / step) * step : x; }
    var total = 0, list = [], dReg = 0, dOT = 0, dDT = 0;
    (v.days || []).forEach(function (r, i) {
      var a = tm(r.in), b = tm(r.out);
      if (isNaN(a) || isNaN(b)) return;
      a = rnd(a); b = rnd(b);
      var span = b - a;
      if (span <= 0) span += 1440;
      var brk = r.brk > 0 ? r.brk : 0;
      var w = Math.max(0, span - brk);
      total += w;
      var hrs = w / 60;
      dReg += Math.min(hrs, 8); dOT += Math.min(Math.max(hrs - 8, 0), 4); dDT += Math.max(hrs - 12, 0);
      list.push([r.day ? H.esc(r.day) : 'Shift ' + (i + 1), t12(a), t12(b % 1440) + (b - a <= 0 ? ' (+1 day)' : ''), brk + ' min', hm(w), H.fix(hrs, 2)]);
    });
    if (!list.length) return { error: 'Enter at least one shift with a clock-in and clock-out time.' };
    var hrs = total / 60, reg, ot = 0, dt = 0;
    if (v.ot === 'ca') { reg = dReg; ot = dOT; dt = dDT; if (reg > 40) { ot += reg - 40; reg = 40; } }
    else if (v.ot === 'week') { reg = Math.min(hrs, 40); ot = Math.max(0, hrs - 40); }
    else reg = hrs;
    var rows = [
      ['Hours and minutes', hm(total), true],
      ['Regular hours', H.fix(reg, 2)]
    ];
    if (v.ot !== 'none') rows.push(['Overtime hours (1.5×)', H.fix(ot, 2)]);
    if (dt > 0) rows.push(['Double-time hours (2×)', H.fix(dt, 2)]);
    if (v.rate > 0) {
      var pay = reg * v.rate + ot * v.rate * 1.5 + dt * v.rate * 2;
      rows.push(['Regular pay', H.money(reg * v.rate)]);
      if (ot > 0) rows.push(['Overtime pay at ' + H.money(v.rate * 1.5) + '/hr', H.money(ot * v.rate * 1.5)]);
      if (dt > 0) rows.push(['Double-time pay at ' + H.money(v.rate * 2) + '/hr', H.money(dt * v.rate * 2)]);
      rows.push(['Gross pay', H.money(pay), true]);
    }
    return {
      value: H.fix(hrs, 2) + ' hrs',
      label: 'Total hours worked (decimal)',
      expr: list.length + (list.length === 1 ? ' shift' : ' shifts') + ' = ' + hm(total) + (step ? ', punches rounded to ' + step + ' min' : ''),
      rows: rows,
      table: { head: ['Day', 'In', 'Out', 'Break', 'Worked', 'Decimal'], rows: list },
      sub: 'Before taxes and deductions. Unpaid breaks are subtracted; short rest breaks of 5–20 minutes are paid time under federal law, so leave them out of the break column.'
    };
  },
  quick: ({ r, H }) => `To calculate hours worked, subtract clock-in from clock-out for each shift, take off unpaid breaks, add the days together and divide leftover minutes by 60. Five shifts from about 8 AM to 5 PM with 30-minute lunches total <strong>${r.rows[0][1]}</strong>, or <strong>${r.value}</strong> in decimal. At $22.50 an hour with time and a half over 40, gross pay is <strong>${r.rows[r.rows.length - 1][1]}</strong>.`,
  stepsTitle: 'How to calculate hours and minutes worked',
  steps: [
    'Convert each clock-in and clock-out to 24-hour time: 1:30 PM is 13:30.',
    'Subtract clock-in from clock-out. For an overnight shift (clock-out smaller than clock-in), add 24 hours first.',
    'Subtract unpaid meal breaks. Paid rest breaks stay in.',
    'Add up all the shifts as hours and minutes, carrying every 60 minutes into an hour.',
    'Convert to decimal for payroll by dividing the minutes by 60: 41 h 45 min = 41.75 hours. Writing 41:45 as 41.45 is the most common payroll mistake; it shortchanges the worker by 18 minutes.'
  ],
  formulaTitle: 'What is the formula for hours worked?',
  formula: {
    expr: 'Hours worked = Σ (Clock out − Clock in − Unpaid break)<br>Decimal hours = Hours + Minutes ÷ 60<br>Gross pay = Regular hours × Rate + Overtime hours × Rate × 1.5',
    vars: [['Clock out − Clock in', 'add 24 h when the shift passes midnight'], ['Unpaid break', 'bona fide meal periods, usually 30 minutes or more'], ['1.5', 'federal overtime premium for hours over 40 in a workweek']]
  },
  example: `<p>A week of shifts with a 30-minute unpaid lunch each day:</p>
<ul><li>Mon 8:00 AM–5:00 PM: 9:00 − 0:30 = 8:30</li><li>Tue 8:00 AM–5:30 PM: 9:30 − 0:30 = 9:00</li><li>Wed 7:45 AM–4:30 PM: 8:45 − 0:30 = 8:15</li><li>Thu 8:00 AM–5:00 PM: 8:30</li><li>Fri 8:00 AM–4:00 PM: 8:00 − 0:30 = 7:30</li></ul>
<p>Total: 40 h 105 min = <strong>41 h 45 min = 41.75 hours</strong>.</p>
<p>Pay at $22.50: 40 × $22.50 = $900.00, plus 1.75 overtime hours × $33.75 = $59.06, for <strong>$959.06</strong> gross. Under California's daily rule the same week has 2.25 overtime hours (the time over 8 on Mon, Tue, Wed and Thu) and pays $964.69.</p>`,
  table: {
    title: 'How do you convert minutes to decimal hours?',
    intro: 'Minutes as a decimal part of an hour, from the calculator. Use it to turn a time card total like 7:35 into 7.58 hours.',
    head: ['Minutes', 'Decimal hours', 'Minutes', 'Decimal hours'],
    rows: ({ run }) => { const m = [1, 3, 5, 6, 10, 12, 15, 18, 20, 24, 25, 30, 35, 36, 40, 42, 45, 48, 50, 54, 55, 59]; const out = []; const dec = x => run({ days: [{ day: 'x', in: '08:00', out: '08:' + String(x).padStart(2, '0'), brk: 0 }], round: '0', ot: 'none', rate: '' }).value.replace(' hrs', ''); for (let i = 0; i < m.length / 2; i++) out.push([String(m[i]), dec(m[i]), String(m[i + m.length / 2]), dec(m[i + m.length / 2])]); return out; },
    note: 'Payroll systems that work in tenths of an hour round each 6 minutes to 0.1.'
  },
  sections: [
    {
      h2: 'Are breaks counted as hours worked?',
      html: `<p>Under the federal Fair Labor Standards Act (FLSA), short rest breaks of about <strong>5 to 20 minutes</strong> are paid work time and must not be deducted. Bona fide <strong>meal periods</strong>, ordinarily 30 minutes or more, are unpaid only if the employee is completely relieved from duty; eating at your desk while answering phones counts as work.</p>
<p>Federal law doesn't require breaks at all, but many states do. California, for example, requires a 30-minute meal period for shifts over 5 hours and a paid 10-minute rest break for every 4 hours. Enter only unpaid meal time in the break column.</p>`
    },
    {
      h2: 'Can an employer round time card punches?',
      html: `<p>Yes, within limits. Federal regulations (29 CFR 785.48) allow rounding to the nearest 5 minutes, tenth of an hour or quarter hour, as long as it averages out so employees are paid for all the time they actually work. With quarter-hour rounding, the "7-minute rule" applies: 1–7 minutes past the quarter round down, 8–14 round up. Clocking in at 7:52 rounds to 7:45; 7:53 rounds to 8:00.</p>
<p>Rounding that always favors the employer (always rounding clock-ins up and clock-outs down) is not allowed. Use the rounding option above to see how your employer's policy changes your weekly total.</p>`
    },
    {
      h2: 'How is overtime calculated on a time card?',
      html: `<p>Federal law requires 1.5 times the regular rate for hours over <strong>40 in a workweek</strong> for non-exempt employees. Daily hours don't matter federally: four 10-hour days earn no overtime. A few states add daily rules. In California, hours over 8 in a day (up to 12) are paid at 1.5×, hours over 12 at 2×, and weekly hours over 40 at 1.5× (without double-counting daily overtime). Choose the rule above that matches your job, and see the <a href="/overtime-calculator">overtime calculator</a> for more on the regular rate.</p>`
    },
    {
      h2: 'How do you calculate an overnight shift?',
      html: `<p>When the clock-out time is earlier than the clock-in time, the shift crossed midnight: add 24 hours to the clock-out. 10:00 PM to 6:30 AM is (6:30 + 24:00) − 22:00 = <strong>8 h 30 min</strong>. The calculator does this automatically. For overtime, the hours belong to the workweek in which they're worked, so a shift spanning Saturday night into Sunday can split across two workweeks if your week starts on Sunday.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate total hours worked in a week?', a: 'Work out each day\'s hours (clock out − clock in − unpaid break), add them up as hours and minutes, and convert the minutes to a decimal by dividing by 60.' },
    { q: 'What is 7 hours and 30 minutes in decimal?', a: '7.5 hours. 30 minutes ÷ 60 = 0.5.' },
    { q: 'How many hours is 8 AM to 4:30 PM with a 30-minute lunch?', a: '8 hours. The shift spans 8.5 hours and the unpaid lunch takes off 0.5.' },
    { q: 'How do I calculate pay from hours and minutes?', a: 'Convert to decimal hours first, then multiply by the rate. 38 h 20 min is 38.333 hours; at $18 an hour that is $690.00.' },
    { q: 'Is a 15-minute break paid?', a: 'Under federal law, yes. Rest breaks of 5 to 20 minutes count as hours worked. Only meal periods of about 30 minutes or more, with no duties, can be unpaid.' },
    { q: 'What is 41.75 hours in hours and minutes?', a: '41 hours 45 minutes. Multiply the decimal part by 60: 0.75 × 60 = 45.' },
    { q: 'Does overtime count per day or per week?', a: 'Per week under federal law: over 40 hours in a fixed 7-day workweek. Some states, including California, also require daily overtime.' }
  ],
  related: ['overtime-calculator', 'time-duration-calculator', 'gross-pay-calculator', 'salary-to-hourly-calculator', 'business-days-calculator'],
  sources: [
    { name: 'U.S. Department of Labor: Fact Sheet #22, Hours Worked Under the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/22-flsa-hours-worked' },
    { name: 'eCFR: 29 CFR Part 785, Hours Worked (rounding, rest and meal periods)', url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-785' },
    { name: 'U.S. Department of Labor: Overtime Pay', url: 'https://www.dol.gov/agencies/whd/overtime' },
    { name: 'California DIR: Overtime FAQ', url: 'https://www.dir.ca.gov/dlse/faq_overtime.htm' }
  ]
};
