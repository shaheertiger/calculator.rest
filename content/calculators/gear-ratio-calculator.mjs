export default {
  slug: 'gear-ratio-calculator',
  hub: 'electrical',
  name: 'Gear Ratio Calculator',
  title: 'Gear Ratio Calculator: 12 to 36 Teeth = 3:1, 1,750 → 583 rpm',
  h1: 'Gear Ratio and RPM Calculator: Teeth, Output Speed, Torque and MPH',
  meta: 'A 12-tooth gear driving a 36-tooth gear is 3:1: 1,750 rpm becomes 583 rpm with triple the torque. Also gives vehicle mph or rpm from axle ratio and tires.',
  keyword: 'how to calculate gear ratio and rpm',
  also: ['how to calculate gear ratio rpm', 'how to calculate rpm gear ratio', 'gear ratio calculator', 'how to calculate rpm from speed', 'rear end gear ratio calculator', 'gear ratio speed calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Calculate', type: 'select', value: 'gears', options: [['gears', 'Gear pair: teeth, rpm and torque'], ['vehicle', 'Vehicle: speed and rpm from axle ratio']], wide: true },
    { id: 'drive', label: 'Driving gear teeth (input)', type: 'number', value: 12, showIf: { mode: ['gears'] } },
    { id: 'driven', label: 'Driven gear teeth (output)', type: 'number', value: 36, showIf: { mode: ['gears'] } },
    { id: 'rpmIn', label: 'Input speed', type: 'number', value: 1750, suffix: 'rpm', showIf: { mode: ['gears'] } },
    { id: 'tIn', label: 'Input torque', type: 'number', value: 15, suffix: 'lb-ft', placeholder: 'optional', showIf: { mode: ['gears'] } },
    { id: 'eff', label: 'Gear mesh efficiency', type: 'number', value: 98, suffix: '%', showIf: { mode: ['gears'] } },
    { id: 'rpm', label: 'Engine speed', type: 'number', value: 2000, suffix: 'rpm', showIf: { mode: ['vehicle'] } },
    { id: 'trans', label: 'Transmission gear ratio', type: 'number', value: 0.7, help: '1.00 for direct drive; overdrive is below 1, e.g. 0.70.', showIf: { mode: ['vehicle'] } },
    { id: 'axle', label: 'Axle (final drive) ratio', type: 'number', value: 3.73, showIf: { mode: ['vehicle'] } },
    { id: 'tire', label: 'Tire diameter', type: 'number', value: 28, suffix: 'in', showIf: { mode: ['vehicle'] } },
    { id: 'mph', label: 'Cruise speed to check', type: 'number', value: 70, suffix: 'mph', showIf: { mode: ['vehicle'] } }
  ],
  compute(v, H) {
    var K = 63360 / (60 * Math.PI);
    if (v.mode === 'vehicle') {
      if (!(v.trans > 0) || !(v.axle > 0)) return { error: 'Enter the transmission and axle ratios.' };
      if (!(v.tire > 0)) return { error: 'Enter the tire diameter in inches.' };
      var overall = v.trans * v.axle;
      var rows = [['Overall ratio', H.fix(overall, 3) + ':1'], ['Tire revolutions per mile', H.int(63360 / (Math.PI * v.tire))]];
      var res = { label: 'Road speed', rows: rows };
      var at = v.mph > 0 ? v.mph * overall * K / v.tire : NaN;
      res._rpmAt = at;
      if (v.rpm > 0) {
        var mph = v.rpm * v.tire / (overall * K);
        res.value = H.num(mph, 1) + ' mph';
        res.expr = H.num(v.rpm, 0) + ' rpm × ' + H.num(v.tire, 1) + ' in ÷ (' + H.num(overall, 3) + ' × 336.13)';
        rows.unshift(['Speed in km/h', H.num(mph * 1.609344, 1) + ' km/h']);
        rows.push(['Wheel speed', H.int(v.rpm / overall) + ' rpm']);
      } else if (H.isNum(at)) {
        res.value = H.int(at) + ' rpm'; res.label = 'Engine speed at ' + H.num(v.mph, 0) + ' mph'; res.expr = H.num(v.mph, 0) + ' mph × ' + H.num(overall, 3) + ' × 336.13 ÷ ' + H.num(v.tire, 1);
      } else return { error: 'Enter an engine rpm or a road speed.' };
      if (H.isNum(at)) rows.push(['Engine rpm at ' + H.num(v.mph, 0) + ' mph', H.int(at) + ' rpm', true]);
      res.sub = 'Ignores tire growth and torque-converter slip; an unlocked converter adds a few hundred rpm.';
      return res;
    }
    if (!(v.drive >= 1) || !(v.driven >= 1)) return { error: 'Enter the tooth counts for both gears.' };
    var ratio = v.driven / v.drive;
    var g = H.gcd(v.driven, v.drive);
    var out = { value: H.num(ratio, 3) + ':1', label: ratio >= 1 ? 'Gear ratio (reduction)' : 'Gear ratio (overdrive)', expr: H.num(v.driven, 0) + ' ÷ ' + H.num(v.drive, 0) + ' teeth', _ratio: ratio };
    var r2 = [];
    if (g > 1 && v.drive / g !== 1 && Number.isInteger(v.driven) && Number.isInteger(v.drive)) r2.push(['Simplest form', (v.driven / g) + ':' + (v.drive / g)]);
    if (v.rpmIn > 0) r2.push(['Output speed', H.num(v.rpmIn / ratio, 1) + ' rpm', true]);
    var eff = v.eff > 0 && v.eff <= 100 ? v.eff / 100 : 1;
    if (v.tIn > 0) {
      r2.push(['Output torque', H.num(v.tIn * ratio * eff, 1) + ' lb-ft', true]);
      r2.push(['Output torque, N·m', H.num(v.tIn * ratio * eff * 1.3558179483, 1) + ' N·m']);
    }
    out.rows = r2;
    out.sub = ratio >= 1 ? 'The output turns ' + H.num(ratio, 2) + ' times slower and, minus friction, ' + H.num(ratio, 2) + ' times stronger.' : 'The output turns faster than the input but with less torque.';
    return out;
  },
  quick: ({ r }) => `Gear ratio = driven teeth ÷ driving teeth, and output rpm = input rpm ÷ ratio. A 12-tooth gear turning a 36-tooth gear is 36 ÷ 12 = <strong>3:1</strong>, so a 1,750 rpm motor spins the output at <strong>583.3 rpm</strong>. Torque rises by the same factor: 15 lb-ft in becomes about 44.1 lb-ft out at 98% efficiency.`,
  stepsTitle: 'How to calculate gear ratio and output rpm',
  steps: [
    'Count the teeth on the driving gear (the one on the motor or input shaft) and the driven gear (the one being turned).',
    'Divide driven teeth by driving teeth. 36 ÷ 12 = 3, written 3:1. A result above 1 is a reduction; below 1 is an overdrive.',
    'Divide input rpm by the ratio for output rpm, and multiply input torque by the ratio (and by efficiency, about 0.98 per spur or helical mesh) for output torque.',
    'For a gear train, multiply the ratios of each pair. An idler gear between two gears changes direction but not the ratio; counting its teeth is a common mistake.'
  ],
  formulaTitle: 'What are the gear ratio and rpm formulas?',
  formula: {
    expr: 'Ratio = N<sub>driven</sub> ÷ N<sub>driving</sub><br>RPM<sub>out</sub> = RPM<sub>in</sub> ÷ Ratio · T<sub>out</sub> = T<sub>in</sub> × Ratio × η<br>MPH = RPM × tire dia (in) ÷ (trans × axle × 336.13)',
    vars: [['N', 'number of teeth'], ['η', 'mechanical efficiency of the gear set'], ['336.13', '63,360 in per mile ÷ (60 min × π)'], ['trans × axle', 'overall ratio in the selected gear']],
    note: 'For chain and belt drives, use sprocket teeth or pulley diameters in place of gear teeth; the math is identical.'
  },
  example: `<p>A pickup has 3.73 axle gears, a 0.70 overdrive top gear and 28 in. tires. At 2,000 rpm the overall ratio is 0.70 × 3.73 = 2.611, so speed = 2,000 × 28 ÷ (2.611 × 336.13) = <strong>63.8 mph</strong>.</p>
<p>At 70 mph the engine turns 70 × 2.611 × 336.13 ÷ 28 = <strong>2,194 rpm</strong>.</p>
<p>The owner fits 33 in. tires. Keeping the same rpm needs 3.73 × 33 ÷ 28 = 4.40, so 4.30 or 4.56 gears would restore the original feel and speedometer reading.</p>`,
  table: {
    title: 'What rpm will my engine turn at 70 mph?',
    intro: 'Engine speed at 70 mph in a 0.70:1 overdrive gear, by axle ratio and tire diameter, computed with the vehicle mode above (locked converter or manual transmission).',
    head: ['Axle ratio', '28 in. tire', '31 in.', '33 in.', '35 in.', '37 in.'],
    rows: ({ run, H }) => [2.73, 3.08, 3.23, 3.42, 3.55, 3.73, 3.92, 4.1, 4.3, 4.56, 4.88, 5.13].map(ax => [H.fix(ax, 2), ...[28, 31, 33, 35, 37].map(t => H.int(run({ mode: 'vehicle', trans: 0.7, axle: ax, tire: t, mph: 70, rpm: 2000 })._rpmAt))]),
    note: 'For direct drive (1.00:1), divide by 0.70: multiply each figure by about 1.43.'
  },
  sections: [
    {
      h2: 'How do you calculate the ratio of a gear train with several gears?',
      html: `<p>Multiply the ratio of each meshing pair. In a two-stage reducer where a 15-tooth pinion drives a 45-tooth gear, and a 12-tooth pinion on that same shaft drives a 48-tooth gear, the total is (45 ÷ 15) × (48 ÷ 12) = 3 × 4 = <strong>12:1</strong>. A 1,750 rpm motor then gives 145.8 rpm at the output.</p>
<p>Gears in a simple chain (each on its own shaft, one after another) cancel out: only the first and last tooth counts matter, and the ones in between are idlers that only flip rotation direction. Each additional mesh costs 1–2% efficiency on spur and helical gears, much more on worm gears.</p>
<p>For a planetary set with the ring held still, sun input and carrier output, the ratio is 1 + ring teeth ÷ sun teeth: a 72-tooth ring and 24-tooth sun give 4:1.</p>`
    },
    {
      h2: 'How do you find your axle gear ratio?',
      html: `<p>Look for a tag bolted to the differential cover or a code on the door-jamb sticker and decode it with the manufacturer's chart. To check by hand, lift both rear wheels, put the transmission in neutral, mark the driveshaft and one tire, and turn both tires together one full revolution while counting driveshaft turns: about 3¾ turns means 3.73. If you turn only one wheel on an open differential, the count comes out half the real ratio. You can also divide the ring gear teeth by the pinion teeth if the cover is off: 41 ÷ 11 = 3.73.</p>`
    },
    {
      h2: 'What gear ratio do I need for bigger tires?',
      html: `<p>Multiply the old axle ratio by new tire diameter ÷ old tire diameter. Going from 31 in. to 35 in. tires on 3.73 gears calls for 3.73 × 35 ÷ 31 = 4.21, so 4.10 or 4.30 gears. Without regearing, the taller tire lowers engine rpm at a given speed and reduces wheel torque by the same proportion, which you feel as sluggish acceleration and a transmission that hunts between gears when towing. The speedometer also reads low by the same ratio: at an indicated 60 mph you would really be doing about 67.7.</p>`
    }
  ],
  faq: [
    { q: 'What does a 3:1 gear ratio mean?', a: 'The input turns three times for every turn of the output. Output speed is one-third of input speed and output torque is about three times input torque, minus friction losses.' },
    { q: 'Is a higher or lower gear ratio better for towing?', a: 'A numerically higher axle ratio (4.10 rather than 3.55) multiplies torque more and tows better, at the cost of higher cruising rpm and usually lower fuel economy.' },
    { q: 'How do you calculate rpm from speed?', a: 'RPM = mph × overall gear ratio × 336.13 ÷ tire diameter in inches. At 70 mph with 3.73 gears, a 0.70 overdrive and 28 in. tires, that is about 2,194 rpm.' },
    { q: 'How do you calculate a bicycle gear ratio?', a: 'Divide chainring teeth by rear cog teeth: 50 ÷ 17 = 2.94. Multiply by the wheel diameter (about 27 in. for a 700c road tire) to get gear inches: 2.94 × 27 = 79.4.' },
    { q: 'Does an idler gear change the gear ratio?', a: 'No. An idler sits between two gears and reverses direction, but the overall ratio is still the last gear\'s teeth divided by the first gear\'s teeth.' },
    { q: 'How do you calculate gear ratio from rpm?', a: 'Divide input rpm by output rpm. A motor at 1,750 rpm driving a shaft at 350 rpm has a 5:1 ratio.' }
  ],
  related: ['pulley-calculator', 'torque-calculator', 'engine-displacement-calculator', 'speed-calculator', 'ratio-calculator'],
  sources: [
    { name: 'Gear train: ratio, idlers and compound trains', url: 'https://en.wikipedia.org/wiki/Gear_train' },
    { name: 'Industrial Press: Machinery\'s Handbook (gearing reference)', url: 'https://www.industrialpress.com/' },
    { name: 'NIST Special Publication 811: unit conversions (mile, inch, km/h)', url: 'https://www.nist.gov/pml/special-publication-811' }
  ]
};
