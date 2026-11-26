export default {
  slug: 'time-card-calculator',
  hub: 'everyday',
  name: 'Time Card Calculator',
  title: 'Time Card Calculator: 22 h 30 min Is 22.5 Hours, Not 22.30',
  meta: 'Three shifts totaling 22 h 30 min are 22.5 hours, because 30 ÷ 60 = 0.5; at $18.50 an hour that pays $416.25. Add up a time card with every step shown.',
  keyword: 'time card calculator',
  also: ['timesheet calculator', 'hours worked calculator', 'how to calculate hours and minutes worked', 'convert minutes to decimal hours', 'punch clock calculator'],
  updated: '2026-11-26',
  answer: ({ r }) => `Three shifts that add up to 22 h 30 min are <strong>${r.value}</strong> on a time card, because 30 ÷ 60 = 0.5; at $18.50 an hour that pays ${r.payText}.`,
  inputs: [
    {
      id: 'days', label: 'Shifts', type: 'rows', addLabel: '+ add shift', max: 14, wide: true,
      fields: [
        { id: 'day', label: 'Day', type: 'text', value: '', blank: true, placeholder: 'e.g. Thu' },
        { id: 'in', label: 'Clock in', type: 'time', value: '09:00' },
        { id: 'out', label: 'Clock out', type: 'time', value: '17:00' },
        { id: 'brk', label: 'Unpaid break (min)', type: 'number', value: 30 }
      ],
      value: [
        { day: 'Mon', in: '08:00', out: '16:45', brk: 30 },
        { day: 'Tue', in: '07:50', out: '17:25', brk: 45 },
        { day: 'Wed', in: '09:15', out: '14:40', brk: 0 }
      ],
      help: 'A clock-out earlier than the clock-in counts as an overnight shift ending the next day.'
    },
    { id: 'rate', label: 'Hourly pay (optional)', type: 'number', value: 18.5, prefix: '$' },
    { id: 'ot', label: 'Overtime', type: 'select', value: 'week', options: [['week', '1.5× over 40 hours a week'], ['none', 'No overtime']] },
    { id: 'round', label: 'Round each punch to', type: 'select', value: '0', options: [['0', 'Exact minutes'], ['5', 'Nearest 5 minutes'], ['6', 'Nearest 6 minutes (0.1 h)'], ['15', 'Nearest 15 minutes']] }
  ],
  compute(v, H) {
    function tm(s) { var x = /^(\d{1,2}):(\d{2})/.exec(String(s || '')); if (!x) return NaN; var h = +x[1], m = +x[2]; return h < 24 && m < 60 ? h * 60 + m : NaN; }
    function clock(min) { min = ((min % 1440) + 1440) % 1440; var h = Math.floor(min / 60), m = min % 60; return h + ':' + (m < 10 ? '0' : '') + m; }
    function hm(min) { return Math.floor(min / 60) + ' h ' + (min % 60) + ' min'; }
    var step = Number(v.round) || 0;
    var rnd = function (x) { return step ? (Math.round(x / step) * step) % 1440 : x; };
    var shifts = [], total = 0, sumH = 0, sumM = 0;
    var steps = ['<b>Formula:</b> Hours worked = Σ (Clock out − Clock in − Unpaid break); Decimal hours = Hours + Minutes ÷ 60; Pay = Hours × Rate' + (v.ot === 'week' ? ', with hours over 40 paid at Rate × 1.5' : '')];
    (v.days || []).forEach(function (r, i) {
      var a0 = tm(r.in), b0 = tm(r.out);
      if (isNaN(a0) || isNaN(b0)) return;
      var a = rnd(a0), b = rnd(b0), name = r.day ? H.esc(r.day) : 'Shift ' + (i + 1);
      var night = b <= a, span = night ? b + 1440 - a : b - a;
      var brk = r.brk > 0 ? Math.round(r.brk) : 0, w = Math.max(0, span - brk);
      var line = '<b>' + name + ':</b> ';
      if (step && (a !== a0 || b !== b0)) line += 'punches round to ' + clock(a) + ' and ' + clock(b) + '; ';
      line += night ? '(' + clock(b) + ' + 24:00) − ' + clock(a) : clock(b) + ' − ' + clock(a);
      line += ' = ' + hm(span) + (brk ? ', minus a ' + brk + '-minute break = ' + hm(w) : ', no unpaid break');
      steps.push(line);
      shifts.push(hm(w)); total += w; sumH += Math.floor(w / 60); sumM += w % 60;
    });
    if (!shifts.length) return { error: 'Enter at least one shift with a clock-in and a clock-out time.' };
    if (shifts.length > 1) steps.push('<b>Add the shifts:</b> ' + shifts.join(' + ') + ' = ' + sumH + ' h ' + sumM + ' min' + (sumM >= 60 ? ', and ' + sumM + ' min = ' + Math.floor(sumM / 60) + ' h ' + (sumM % 60) + ' min, so the total is ' + hm(total) : ''));
    var hrs = total / 60, mm = total % 60, hrsTxt = H.num(hrs, 2);
    var exactH = Math.abs(hrs - H.round(hrs, 2)) < 1e-9;
    steps.push('<b>Convert to decimal:</b> ' + mm + ' ÷ 60 = ' + H.num(mm / 60, 6) + ', so ' + hm(total) + ' = ' + H.num(hrs, 6) + ' hours');
    var reg = hrs, ot = 0, pay = 0, rows = [['Hours and minutes', hm(total), true]];
    if (v.ot === 'week' && hrs > 40) { reg = 40; ot = hrs - 40; steps.push('<b>Split off overtime:</b> ' + H.num(hrs, 6) + ' − 40 = ' + H.num(ot, 6) + ' overtime hours'); rows.push(['Regular / overtime hours', H.num(reg, 2) + ' / ' + H.num(ot, 2)]); }
    var payNote = '';
    var usd = function (x) { return '$' + (Math.abs(x - H.round(x, 2)) < 1e-9 ? H.fix(x, 2) : H.num(x, 6)); };
    if (v.rate > 0) {
      var regPay = reg * v.rate, otPay = ot * v.rate * 1.5;
      pay = regPay + otPay;
      if (ot > 0) {
        steps.push('<b>Pay:</b> 40 × ' + usd(v.rate) + ' = ' + usd(regPay) + ', and ' + H.num(ot, 6) + ' × ' + usd(v.rate * 1.5) + ' = ' + usd(otPay) + ', so ' + usd(regPay) + ' + ' + usd(otPay) + ' = ' + usd(pay));
      } else {
        steps.push('<b>Pay:</b> ' + H.num(hrs, 6) + ' × ' + usd(v.rate) + ' = ' + usd(pay));
      }
      var exactP = Math.abs(pay - H.round(pay, 2)) < 1e-9;
      payNote = ' and ' + H.money(pay) + ' gross pay (' + (exactP ? 'exact to the cent' : 'rounded to the nearest cent') + ')';
      rows.push(['Gross pay', H.money(pay), true]);
    }
    steps.push('<b>Answer:</b> ' + hm(total) + ' = ' + hrsTxt + ' hours (' + (exactH ? 'exact' : 'rounded to 2 decimal places') + ')' + payNote + '.');
    return { value: hrsTxt + ' hours', label: 'Total hours worked (decimal)', rows: rows, steps: steps, payText: v.rate > 0 ? H.money(pay) : '' };
  },
  facts: {
    formula: 'Hours worked = Σ (Clock out − Clock in − Unpaid break)<br>Decimal hours = Hours + Minutes ÷ 60<br>Pay = Regular hours × Rate + Overtime hours × Rate × 1.5',
    vars: [['Clock out − Clock in', 'add 24:00 to the clock-out when the shift passes midnight'], ['Unpaid break', 'meal time taken off the clock, in minutes'], ['Minutes ÷ 60', 'turns minutes into a fraction of an hour: 45 min = 0.75 h']],
    rounding: 'Add the shifts in exact minutes, convert once at the end, and round decimal hours to 2 places. Round pay to the nearest cent only after multiplying.',
    note: 'A time card total like 22:30 is hours and minutes, not a decimal. Payroll needs 22.5, because the minutes are sixtieths of an hour.'
  },
  example: {
    h2: 'Worked example: a five-day week with overtime',
    html: `<p><strong>Problem:</strong> An hourly worker earns $22.50 and takes a 30-minute unpaid lunch every day. The punches are Mon 8:00–17:00, Tue 8:00–17:30, Wed 7:45–16:30, Thu 8:00–17:00 and Fri 8:00–16:00. Hours over 40 pay time and a half. What is the gross pay?</p>
<p><strong>1.</strong> Each day, minus lunch: Mon 8 h 30 min, Tue 9 h, Wed 8 h 15 min, Thu 8 h 30 min, Fri 7 h 30 min.</p>
<p><strong>2.</strong> Add: 40 h 105 min, and 105 min = 1 h 45 min, so 41 h 45 min.</p>
<p><strong>3.</strong> Decimal: 45 ÷ 60 = 0.75, so 41.75 hours, of which 1.75 are overtime.</p>
<p><strong>4.</strong> Pay: 40 × $22.50 = $900, and 1.75 × $33.75 = $59.0625.</p>
<p><strong>Answer:</strong> $900 + $59.0625 = $959.0625, or $959.06 gross pay to the nearest cent. Sense check: straight time would be 41.75 × $22.50 = $939.375, and the extra half-rate on the overtime adds 1.75 × $11.25 = $19.6875, which again totals $959.0625.</p>`
  },
  variants: [
    {
      h2: 'How do you convert minutes to decimal hours on a time card?',
      html: `<p>Divide the minutes by 60. 30 minutes is 30 ÷ 60 = <strong>0.5</strong> hours, so 22 h 30 min is 22.5 hours. The common ones:</p>
<div class="twrap"><table><thead><tr><th>Minutes</th><th>Decimal</th><th>Minutes</th><th>Decimal</th></tr></thead><tbody>
<tr><td>5</td><td>0.08</td><td>30</td><td>0.5</td></tr><tr><td>10</td><td>0.17</td><td>40</td><td>0.67</td></tr><tr><td>15</td><td>0.25</td><td>45</td><td>0.75</td></tr><tr><td>20</td><td>0.33</td><td>50</td><td>0.83</td></tr>
</tbody></table></div>`
    },
    {
      h2: 'How is overtime calculated on a time card?',
      html: `<p>Hours past 40 in the week are paid at 1.5 times the hourly rate. For 44 hours at $20 an hour, the first 40 pay 40 × $20 = $800, the other 4 pay 4 × $30 = $120, and the week comes to <strong>$920</strong>. Federal law counts overtime by the week; a few states, such as California, also count hours over 8 in a single day, which this calculator does not.</p>`
    },
    {
      h2: 'How do you calculate an overnight shift?',
      html: `<p>Add 24 hours to the clock-out before subtracting. A shift from 10:00 PM to 6:30 AM is (6:30 + 24:00) − 22:00 = 8 h 30 min, and a 30-minute unpaid break brings it to <strong>8 hours</strong>. Type the clock-out as it appears on the clock; the calculator adds the 24 hours when the clock-out is earlier than the clock-in.</p>`
    }
  ],
  mistakes: [
    '<strong>Typing 22 h 30 min as 22.30.</strong> At $18.50 an hour, 22.30 hours pays $412.55, but 22.5 hours pays $416.25. The minutes must be divided by 60.',
    '<strong>Not carrying the minutes.</strong> 21 h 90 min is 22 h 30 min, not 21.9 hours. Every 60 minutes becomes another hour.',
    '<strong>Getting a negative overnight shift.</strong> 6:30 − 22:00 gives −15 h 30 min. Add 24:00 to the clock-out first.',
    '<strong>Paying overtime on the whole week.</strong> At 41.75 hours, only 1.75 hours earn time and a half; the first 40 stay at the regular rate.'
  ],
  related: ['time-duration-calculator', 'percentage-calculator', 'average-calculator', 'split-bill-calculator'],
  faq: [
    { q: 'What is 7 hours and 30 minutes in decimal?', a: '7.5 hours, because 30 ÷ 60 = 0.5.' },
    { q: 'How many hours is 8 AM to 4:30 PM with a 30-minute lunch?', a: '8 hours. The shift spans 8 h 30 min and the unpaid lunch takes off 30 minutes.' },
    { q: 'How do I calculate pay from hours and minutes?', a: 'Convert to decimal hours first, then multiply by the rate. 38 h 20 min is 38.333 hours; at $18 an hour that is $690.00.' },
    { q: 'What does rounding to the nearest 15 minutes do?', a: 'Each punch moves to the closest quarter hour: 7:52 rounds to 7:45 and 7:53 rounds to 8:00. Pick the rounding in the calculator to see how it changes the total.' }
  ]
};
