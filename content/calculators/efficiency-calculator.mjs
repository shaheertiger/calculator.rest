export default {
  slug: 'efficiency-calculator',
  hub: 'science',
  name: 'Efficiency Calculator',
  title: 'Efficiency Calculator: 5000 J of 6500 J In = 76.92% (Steps)',
  meta: '6500 J put into a machine that gives 5000 J of useful work is 76.92% efficient. Find efficiency from input and output or wasted energy, or the energy lost.',
  keyword: 'efficiency calculator',
  also: ['how to calculate efficiency', 'efficiency formula physics', 'useful output energy', 'energy wasted as heat', 'calculate the overall efficiency'],
  updated: '2026-11-26',
  answer: ({ r }) => `A machine that is given 6,500 J of energy and does 5,000 J of useful work is <strong>${r.value}</strong> efficient: 5,000 ÷ 6,500 × 100.`,
  inputs: [
    { id: 'mode', label: 'The question gives', type: 'select', value: 'out', wide: true, options: [['out', 'Total input and useful output: find the efficiency'], ['waste', 'Total input and energy wasted: find the efficiency'], ['fromIn', 'Total input and efficiency: find the useful output'], ['fromOut', 'Useful output and efficiency: find the energy lost']] },
    { id: 'inp', label: 'Total energy input', type: 'number', value: 6500, showIf: { mode: ['out', 'waste', 'fromIn'] } },
    { id: 'out', label: 'Useful energy output', type: 'number', value: 5000, showIf: { mode: ['out', 'fromOut'] } },
    { id: 'waste', label: 'Energy wasted', type: 'number', value: 1500, showIf: { mode: ['waste'] } },
    { id: 'eff', label: 'Efficiency', type: 'number', value: 85, suffix: '%', showIf: { mode: ['fromIn', 'fromOut'] } },
    { id: 'unit', label: 'Unit', type: 'select', value: 'J', options: [['J', 'J (joules)'], ['kJ', 'kJ (kilojoules)'], ['MJ', 'MJ (megajoules)'], ['kWh', 'kWh (kilowatt-hours)'], ['W', 'W (watts, for power)'], ['kW', 'kW (kilowatts)']] }
  ],
  compute(v, H) {
    var u = ' ' + (v.unit || 'J');
    var f = function (x) { return H.num(x, 10); };
    var p6 = function (x) { return H.num(x, 6); };
    var pc = function (x) {
      var r = H.round(x, 2);
      return { s: H.num(r, 2) + '%', note: Math.abs(r - x) < 1e-9 ? 'exact, no rounding needed' : 'rounded to 2 decimal places', whole: Math.round(x) + '%' };
    };
    var en = function (x) {
      return Math.abs(H.round(x, 4) - x) < 1e-9 ? { s: H.num(x, 4), note: 'exact' } : { s: H.sig(x, 3), note: 'to 3 significant figures' };
    };
    var m = v.mode, steps, inp, out, w, e, d;
    if (m === 'fromIn' || m === 'fromOut') {
      if (!(v.eff > 0 && v.eff <= 100)) return { error: 'Enter an efficiency above 0% and no more than 100%.' };
      var dec = v.eff / 100;
      if (m === 'fromIn') {
        if (!(v.inp > 0)) return { error: 'Enter the total energy input.' };
        inp = v.inp; out = inp * dec; w = inp - out;
        var uo = en(out), wo = en(w);
        return {
          value: uo.s + u,
          label: 'Useful energy output',
          rows: [['Energy wasted', wo.s + u], ['Total input', f(inp) + u]],
          steps: [
            '<b>Formula:</b> useful output = total input × (efficiency ÷ 100), and energy wasted = total input − useful output',
            '<b>Substitute:</b> useful output = ' + f(inp) + u + ' × (' + f(v.eff) + ' ÷ 100)',
            '<b>Turn the percent into a decimal:</b> ' + f(v.eff) + ' ÷ 100 = ' + f(dec),
            '<b>Multiply:</b> ' + f(inp) + u + ' × ' + f(dec) + ' = ' + p6(out) + u,
            '<b>Subtract to find the waste:</b> ' + f(inp) + u + ' − ' + p6(out) + u + ' = ' + p6(w) + u,
            '<b>Answer:</b> the useful output is ' + uo.s + u + ' (' + uo.note + ') and ' + wo.s + u + ' is wasted (' + wo.note + ').'
          ]
        };
      }
      if (!(v.out > 0)) return { error: 'Enter the useful energy output.' };
      out = v.out; inp = out / dec; w = inp - out;
      var io = en(inp), lo = en(w);
      return {
        value: lo.s + u,
        label: 'Energy lost to the surroundings',
        rows: [['Total input needed', io.s + u], ['Useful output', f(out) + u]],
        steps: [
          '<b>Formula:</b> total input = useful output ÷ (efficiency ÷ 100), then energy lost = total input − useful output',
          '<b>Substitute:</b> total input = ' + f(out) + u + ' ÷ (' + f(v.eff) + ' ÷ 100)',
          '<b>Turn the percent into a decimal:</b> ' + f(v.eff) + ' ÷ 100 = ' + f(dec),
          '<b>Divide:</b> ' + f(out) + u + ' ÷ ' + f(dec) + ' = ' + p6(inp) + u + ' (the total input)',
          '<b>Subtract:</b> ' + p6(inp) + u + ' − ' + f(out) + u + ' = ' + p6(w) + u,
          '<b>Answer:</b> ' + lo.s + u + ' is lost to the surroundings (' + lo.note + '), from a total input of ' + io.s + u + '.'
        ]
      };
    }
    if (!(v.inp > 0)) return { error: 'Enter the total energy input, greater than 0.' };
    inp = v.inp;
    steps = [];
    if (m === 'waste') {
      if (!(v.waste >= 0) || v.waste > inp) return { error: 'Enter the energy wasted: at least 0 and no more than the input.' };
      w = v.waste; out = inp - w;
      steps.push('<b>Formula:</b> efficiency = (useful output ÷ total input) × 100%, where useful output = total input − energy wasted');
      steps.push('<b>Find the useful output first:</b> ' + f(inp) + u + ' − ' + f(w) + u + ' = ' + f(out) + u);
    } else {
      if (!(v.out >= 0)) return { error: 'Enter the useful energy output.' };
      if (v.out > inp) return { error: 'The useful output cannot be more than the total input. Check you have not swapped them.' };
      out = v.out; w = inp - out;
      steps.push('<b>Formula:</b> efficiency = (useful output ÷ total input) × 100%');
    }
    d = out / inp; e = d * 100;
    var a = pc(e);
    steps.push('<b>Substitute:</b> efficiency = (' + f(out) + u + ' ÷ ' + f(inp) + u + ') × 100%');
    steps.push('<b>Divide:</b> ' + f(out) + u + ' ÷ ' + f(inp) + u + ' = ' + p6(d) + '. The' + u + ' cancel, so efficiency has no unit.');
    steps.push('<b>Multiply by 100%:</b> ' + p6(d) + ' × 100% = ' + p6(e) + '%');
    steps.push('<b>Answer:</b> the efficiency is ' + a.s + ' (' + a.note + '; ' + a.whole + ' to the nearest whole percent)' + (m === 'waste' ? '.' : ', and ' + f(w) + u + ' is wasted.'));
    return {
      value: a.s,
      label: 'Efficiency',
      rows: [['Useful output', f(out) + u], ['Energy wasted', f(w) + u], ['As a decimal', p6(d)]],
      steps: steps
    };
  },
  facts: {
    formula: 'Efficiency = (useful output ÷ total input) × 100%<br>Useful output = total input × efficiency<br>Wasted = total input − useful output',
    vars: [['Total input', 'all the energy supplied: chemical energy from a battery, electrical energy from the mains'], ['Useful output', 'the energy that does the job you want: motion, sound, lifting'], ['Wasted', 'energy passed to the surroundings, usually as heat'], ['Efficiency', 'a percent from 0% to 100%, or a decimal from 0 to 1']],
    rounding: 'keep full precision, then round the percent to 2 decimal places or to the whole percent the question asks for; round energies to 3 significant figures.',
    note: 'Input and output must be in the same unit. The units cancel when you divide, so efficiency itself has no unit.'
  },
  example: {
    h2: 'Worked example: the overall efficiency of an electric car',
    html: `<p><strong>Problem:</strong> A particular electric car is supplied with 300 kJ of chemical energy by the battery. Of this, a total of 70.5 kJ of energy is wasted as heat. Calculate the overall efficiency of the electric car. Hint: first work out the useful output energy.</p>
<p><strong>1.</strong> Useful output = total input − wasted = 300 kJ − 70.5 kJ = 229.5 kJ.</p>
<p><strong>2.</strong> Efficiency = (useful output ÷ total input) × 100% = (229.5 kJ ÷ 300 kJ) × 100%.</p>
<p><strong>3.</strong> Divide: 229.5 ÷ 300 = 0.765. The kJ cancel.</p>
<p><strong>4.</strong> Multiply by 100%: 0.765 × 100% = 76.5%.</p>
<p><strong>Answer:</strong> the electric car is 76.5% efficient (about 77% to the nearest whole percent). Sense check: 75 kJ would be exactly a quarter of 300 kJ, and 70.5 kJ is a little less, so the efficiency should be a little more than 75%.</p>`
  },
  variants: [
    {
      h2: 'If 6500 J of energy is put into a machine and it produces 5000 J of useful work, what is the efficiency?',
      html: `<p>The machine is <strong>76.92%</strong> efficient, or 77% to the nearest whole percent. Divide useful work by energy in: 5,000 J ÷ 6,500 J = 0.769231. Multiply by 100% to get 76.923077%, which is 76.92% to 2 decimal places. The remaining 6,500 J − 5,000 J = 1,500 J is wasted, mostly as heat from friction.</p>`
    },
    {
      h2: 'A vacuum cleaner has an energy input of 6.5 kWh and an output of 5.8 kWh: what is its efficiency?',
      html: `<p>To the nearest percentage, the efficiency is <strong>89%</strong>. Both values are in kWh, so no conversion is needed: 5.8 kWh ÷ 6.5 kWh = 0.892308, and 0.892308 × 100% = 89.23%, which rounds to 89%. The vacuum cleaner wastes 6.5 − 5.8 = 0.7 kWh.</p>`
    },
    {
      h2: 'The energy output of a blender is 1.4 kWh. If the blender is 85% efficient, how much energy is lost?',
      html: `<p>About <strong>0.247 kWh</strong> is lost to the surroundings (0.25 kWh to 2 decimal places). The 85% applies to the input, so find the input first: 1.4 kWh ÷ 0.85 = 1.647059 kWh. Then subtract the useful output: 1.647059 kWh − 1.4 kWh = 0.247059 kWh. Choose "useful output and efficiency" in the calculator to see these steps with your own numbers.</p>`
    }
  ],
  mistakes: [
    '<strong>Dividing the wrong way round.</strong> 6,500 J ÷ 5,000 J = 1.3, or 130%. No machine is more than 100% efficient, so a result above 100% means input and output are swapped.',
    '<strong>Using the wasted energy as the output.</strong> In the electric car problem, 70.5 kJ ÷ 300 kJ = 23.5% is the share that is wasted. Subtract it from the input first: 229.5 kJ is the useful output.',
    '<strong>Taking 15% of the output to find the loss.</strong> For the blender, 1.4 kWh × 0.15 = 0.21 kWh is wrong, because 85% is a share of the input. Find the input (1.647059 kWh) and subtract.',
    '<strong>Mixing units.</strong> Put input and output in the same unit before dividing. 1 kJ = 1,000 J and 1 kWh = 3,600,000 J.'
  ],
  related: ['percentage-calculator', 'ev-charging-cost-calculator', 'scientific-notation-calculator', 'speed-calculator'],
  faq: [
    { q: 'Can efficiency be more than 100%?', a: 'No. Energy cannot be created, so the useful output can never be more than the total input. If your answer is above 100%, you have divided input by output.' },
    { q: 'How do you work out the energy wasted from the efficiency?', a: 'Multiply the input by the share that is not useful: wasted = input × (1 − efficiency). For 300 kJ at 76.5%, that is 300 × 0.235 = 70.5 kJ, which matches the electric car problem.' },
    { q: 'Does the efficiency formula work for power as well as energy?', a: 'Yes. Efficiency = useful power output ÷ total power input × 100%. A motor that takes 2,000 W and delivers 1,500 W of useful power is 1,500 ÷ 2,000 × 100 = 75% efficient.' },
    { q: 'Should I give efficiency as a decimal or a percent?', a: 'Either, as long as you are clear. 0.765 and 76.5% mean the same thing. Most school physics questions want a percent, often to the nearest whole number.' }
  ],
  sources: [
    { name: 'OpenStax College Physics 2e: 7.6 Conservation of Energy (efficiency)', url: 'https://openstax.org/books/college-physics-2e/pages/7-6-conservation-of-energy' },
    { name: 'NIST Special Publication 811: Guide for the Use of the SI (units)', url: 'https://www.nist.gov/pml/special-publication-811' }
  ]
};
