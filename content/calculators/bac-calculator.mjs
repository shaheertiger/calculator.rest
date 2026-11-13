export default {
  slug: 'bac-calculator',
  hub: 'health',
  name: 'Blood Alcohol (BAC) Calculator',
  title: 'BAC Calculator: 4 Beers in 3 Hours at 180 lb Is About 0.056%',
  h1: 'Blood Alcohol Content Calculator Using the Widmark Formula',
  meta: 'A 180-lb man who drinks four 12-oz beers over 3 hours has an estimated BAC of about 0.056%, near zero 3¾ hours later. An estimate, never a driving test.',
  keyword: 'how to calculate blood alcohol content',
  also: ['bac calculator', 'blood alcohol calculator', 'when will i be sober calculator', 'are bac calculators accurate', 'widmark formula calculator', 'how long to get alcohol out of system calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sex', label: 'Sex', type: 'select', value: 'm', options: [['m', 'Male (r = 0.68)'], ['f', 'Female (r = 0.55)']] },
    { id: 'units', label: 'Weight units', type: 'select', value: 'us', options: [['us', 'Pounds'], ['metric', 'Kilograms']] },
    { id: 'lb', label: 'Body weight', type: 'number', value: 180, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Body weight', type: 'number', value: 82, suffix: 'kg', showIf: { units: ['metric'] } },
    {
      id: 'drinks', label: 'What you drank', type: 'rows', addLabel: '+ add drink', max: 12, wide: true,
      fields: [
        { id: 'type', label: 'Drink', type: 'select', value: 'beer', options: [['beer', 'Beer, 12 oz (355 mL), 5%'], ['light', 'Light beer, 12 oz, 4.2%'], ['ipa', 'IPA / craft beer, 12 oz, 7%'], ['pint', 'Pint of beer, 16 oz (473 mL), 5%'], ['seltzer', 'Hard seltzer, 12 oz, 5%'], ['wine', 'Wine, 5 oz (148 mL), 12%'], ['shot', 'Shot of 80-proof liquor, 1.5 oz (44 mL)'], ['double', 'Double mixed drink, 3 oz liquor'], ['std', 'One U.S. standard drink (14 g alcohol)']] },
        { id: 'qty', label: 'How many', type: 'number', value: 1 }
      ],
      value: [{ type: 'beer', qty: 4 }]
    },
    { id: 'hours', label: 'Hours since your first drink', type: 'number', value: 3, suffix: 'hours' }
  ],
  data: {
    drinks: { beer: [12, 5], light: [12, 4.2], ipa: [12, 7], pint: [16, 5], seltzer: [12, 5], wine: [5, 12], shot: [1.5, 40], double: [3, 40] }
  },
  compute(v, H, D) {
    var kg = v.units === 'metric' ? v.kg : v.lb * 0.45359237;
    if (!(kg >= 30 && kg <= 300)) return { error: 'Enter a body weight between 66 and 660 lb (30–300 kg).' };
    var grams = 0;
    (v.drinks || []).forEach(function (d) {
      if (!(d.qty > 0)) return;
      if (d.type === 'std') { grams += 14 * d.qty; return; }
      var p = D.drinks[d.type];
      if (p) grams += d.qty * p[0] * 29.5735 * p[1] / 100 * 0.789;
    });
    if (!(grams > 0)) return { error: 'Add at least one drink.' };
    var t = v.hours >= 0 ? v.hours : 0;
    var r = v.sex === 'f' ? 0.55 : 0.68;
    var peak = grams / (kg * 1000 * r) * 100;
    var bac = Math.max(0, peak - 0.015 * t);
    var rows = [
      ['U.S. standard drinks', H.num(grams / 14, 1) + ' (' + H.num(grams, 1) + ' g alcohol)'],
      ['If all absorbed, before elimination', H.fix(peak, 3) + '%'],
      ['Alcohol eliminated so far', H.fix(Math.min(peak, 0.015 * t), 3) + '% over ' + H.num(t, 1) + ' h']
    ];
    if (bac > 0) rows.push(['Estimated time until about 0.00%', H.dur(bac / 0.015 * 60), true]);
    if (bac >= 0.08) rows.push(['Estimated time until below 0.08%', H.dur((bac - 0.08) / 0.015 * 60)]);
    var eff = bac >= 0.15 ? 'NHTSA: far less muscle control, major loss of balance, vomiting possible.' : bac >= 0.10 ? 'NHTSA: clear deterioration of reaction time and control, slurred speech, slowed thinking.' : bac >= 0.08 ? 'NHTSA: poor muscle coordination; judgment, reasoning and memory impaired.' : bac >= 0.05 ? 'NHTSA: impaired judgment, lowered alertness, reduced coordination and steering ability.' : bac >= 0.02 ? 'NHTSA: some loss of judgment; decline in visual function and in doing two tasks at once.' : bac > 0 ? 'Low, but alcohol is still in your blood.' : 'The formula estimates the alcohol has been eliminated, but individual rates vary.';
    rows.push(['Typical effects at this level', eff]);
    return {
      value: H.fix(bac, 3) + '%',
      label: 'Estimated blood alcohol concentration now',
      expr: H.num(grams, 1) + ' g ÷ (' + H.num(kg, 1) + ' kg × ' + r + ') − 0.015 × ' + H.num(t, 1) + ' h',
      rows: rows,
      sub: 'A rough estimate, not a measurement. It cannot tell you that you are safe to drive: impairment starts well below 0.08%, and the only safe choice after drinking is not to drive.'
    };
  },
  quick: ({ r }) => `Blood alcohol content is estimated with the Widmark formula: BAC (%) = alcohol in grams ÷ (body weight in grams × r) × 100 − 0.015 × hours, where r is 0.68 for men and 0.55 for women. Four 12-oz beers (56 g of alcohol) for a <strong>180-lb man</strong> after <strong>3 hours</strong> gives 0.101% − 0.045% ≈ <strong>${r.value}</strong>. It is an estimate and cannot clear anyone to drive.`,
  stepsTitle: 'How to calculate blood alcohol content by hand',
  steps: [
    'Add up the alcohol in grams. A U.S. standard drink (12 oz of 5% beer, 5 oz of 12% wine or 1.5 oz of 40% liquor) holds about 14 g. Otherwise: ounces × 29.57 × ABV × 0.789.',
    'Convert body weight to grams (pounds × 453.6) and multiply by the Widmark factor r: 0.68 for men, 0.55 for women.',
    'Divide grams of alcohol by that number and multiply by 100 to get the peak BAC in percent.',
    'Subtract 0.015 for every hour since the first drink. <strong>Do not start the clock at your last drink</strong>; the formula counts elimination from when drinking began.',
    'To estimate when BAC reaches zero, divide the current BAC by 0.015. Treat every answer as approximate.'
  ],
  formulaTitle: 'What is the Widmark formula for BAC?',
  formula: {
    expr: 'BAC (%) = [A ÷ (W × r)] × 100 − β × t<br>A (g) = volume (oz) × 29.57 × ABV × 0.789',
    vars: [['A', 'grams of pure alcohol consumed'], ['W', 'body weight in grams'], ['r', 'Widmark factor, the share of body mass that holds alcohol: about 0.68 for men, 0.55 for women'], ['β', 'elimination rate, about 0.015% per hour on average'], ['t', 'hours since drinking started'], ['0.789', 'density of ethanol, g/mL']],
    note: 'Swedish chemist Erik Widmark developed the method in the 1930s, and forensic toxicologists still use versions of it. The r factors and the 0.015 elimination rate are population averages; individual values vary, which is why results are estimates.'
  },
  example: `<p>A 140-lb woman has two 5-oz glasses of 12% wine over 2 hours.</p>
<p>Alcohol: 2 × 5 × 29.57 × 0.12 × 0.789 = <strong>28.0 g</strong>. Body weight: 140 × 453.6 = 63,503 g; × 0.55 = 34,927.</p>
<p>Peak BAC = 28.0 ÷ 34,927 × 100 = 0.080%. After 2 hours: 0.080 − 0.030 = <strong>0.050%</strong>. Reaching about zero would take another 0.050 ÷ 0.015 ≈ 3 hours 20 minutes.</p>`,
  table: {
    title: 'How many drinks does it take to reach 0.08%?',
    intro: 'Estimated BAC one hour after starting to drink, by body weight and number of U.S. standard drinks (14 g each), from the Widmark calculation above. Values of 0.080% or more are at or over the legal limit for drivers 21 and older in every state except Utah, where the limit is 0.05%.',
    head: ['Body weight', 'Woman, 2 drinks', 'Woman, 4 drinks', 'Man, 2 drinks', 'Man, 4 drinks', 'Man, 6 drinks'],
    rows: ({ run }) => [100, 120, 140, 160, 180, 200, 220, 240, 260].map(lb => {
      const b = (sex, n) => run({ sex, units: 'us', lb, hours: 1, drinks: [{ type: 'std', qty: n }] }).value;
      return [lb + ' lb', b('f', 2), b('f', 4), b('m', 2), b('m', 4), b('m', 6)];
    }),
    note: 'Real BAC can be higher than shown, for example when drinking on an empty stomach or with certain medications. These numbers do not tell you whether you can drive safely.'
  },
  sections: [
    {
      h2: 'How long does it take for BAC to go back to zero?',
      html: `<p>The liver removes alcohol at a fairly steady rate, about 0.015 percentage points per hour on average. Divide your BAC by 0.015 to estimate the hours left: a BAC of 0.10% needs roughly 6 hours 40 minutes to reach zero.</p>
<p>Nothing speeds this up. Coffee, cold showers, exercise and food after drinking do not lower BAC; caffeine can make someone feel more alert while they remain impaired. Because elimination is slow, people who drink heavily at night can still be over the limit the next morning: a BAC of 0.15% at 1 AM is still about 0.045% at 8 AM.</p>`
    },
    {
      h2: 'Are BAC calculators accurate?',
      html: `<p>They give a ballpark figure, not a measurement. The Widmark method assumes all the alcohol has been absorbed, that your body water matches the average for your sex and weight, and that you eliminate alcohol at the average rate. In reality:</p>
<ul>
<li><strong>Food</strong> slows absorption and lowers the peak; an empty stomach raises it.</li>
<li><strong>Body composition</strong> matters: more body fat means less water to dilute alcohol, so BAC runs higher than the average r predicts.</li>
<li><strong>Elimination rates</strong> differ between people, and with liver disease, some medications and regular heavy drinking.</li>
<li><strong>Drink sizes</strong> are often bigger than people think; a restaurant pour of wine or a craft beer can hold 1.5–2 standard drinks.</li>
</ul>
<p>Only a breath or blood test measures BAC, and even a legal result does not mean you are unimpaired.</p>`
    },
    {
      h2: 'What BAC is legally drunk in the U.S.?',
      html: `<ul>
<li><strong>0.08%:</strong> the per se limit for drivers 21 and older in every state except Utah.</li>
<li><strong>0.05%:</strong> Utah's limit, in force since December 30, 2018.</li>
<li><strong>0.04%:</strong> the federal limit for commercial (CDL) drivers operating commercial vehicles.</li>
<li><strong>0.02% or lower:</strong> zero-tolerance limits for drivers under 21, set by each state.</li>
</ul>
<p>The National Highway Traffic Safety Administration notes that driving skills decline at levels below 0.08%, and drivers can be arrested at lower levels if they are impaired. The legal limit is not a safety threshold.</p>`
    },
    {
      h2: 'What happens at different blood alcohol levels?',
      html: `<p>NHTSA summarizes typical effects as BAC rises:</p>
<ul>
<li><strong>0.02%:</strong> some loss of judgment and relaxation; driving shows a decline in visual function and in doing two tasks at once.</li>
<li><strong>0.05%:</strong> exaggerated behavior, impaired judgment and lowered alertness; reduced coordination, difficulty steering and slower response to emergencies.</li>
<li><strong>0.08%:</strong> poor muscle coordination (balance, speech, vision, reaction time); judgment, self-control, reasoning and memory are impaired.</li>
<li><strong>0.10%:</strong> clear deterioration of reaction time and control, slurred speech and slowed thinking; trouble staying in the lane and braking.</li>
<li><strong>0.15%:</strong> far less muscle control, major loss of balance and possible vomiting; substantial impairment in vehicle control.</li>
</ul>
<p>Much higher levels risk alcohol poisoning. Confusion, vomiting, seizures, slow or irregular breathing, or someone who cannot be woken are emergencies: call 911.</p>`
    }
  ],
  faq: [
    { q: 'How many drinks will put me over 0.08?', a: 'It depends on weight, sex, time and food. By the Widmark estimate, a 180-lb man reaches about 0.086% one hour after four standard drinks, and a 140-lb woman about 0.105% one hour after three. Many people are impaired before that point.' },
    { q: 'When will I be sober?', a: 'Divide your estimated BAC by 0.015 to get the approximate hours until it reaches zero. A BAC of 0.06% takes about 4 hours. Feeling sober is not a reliable guide.' },
    { q: 'What counts as one standard drink?', a: 'In the U.S., a standard drink has about 14 grams (0.6 fl oz) of pure alcohol: 12 oz of 5% beer, 5 oz of 12% wine or 1.5 oz of 40% (80-proof) spirits, according to the NIAAA.' },
    { q: 'Why do women reach a higher BAC than men?', a: 'On average women have less body water per pound, so the same alcohol is less diluted. The Widmark factor is about 0.55 for women versus 0.68 for men.' },
    { q: 'Can a BAC calculator tell me if I can drive?', a: 'No. It is an estimate with a wide margin of error and cannot tell you that you are safe to drive. If you have been drinking, use a designated driver, a rideshare or public transit.' },
    { q: 'Does eating food lower BAC?', a: 'Eating before or while drinking slows absorption and lowers the peak. Eating after drinking does not remove alcohol already in your blood.' },
    { q: 'How much alcohol is in a 16-oz craft beer?', a: 'A 16-oz beer at 7% ABV holds about 26 g of alcohol, close to two standard drinks: 16 × 29.57 × 0.07 × 0.789 = 26.1 g.' }
  ],
  related: ['water-intake-calculator', 'calorie-calculator', 'bmr-calculator', 'sleep-calculator'],
  sources: [
    { name: 'NHTSA: Drunk Driving (BAC effects and legal limits)', url: 'https://www.nhtsa.gov/risky-driving/drunk-driving' },
    { name: 'NIAAA: What Is a Standard Drink?', url: 'https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink' },
    { name: 'NIAAA: Understanding the Dangers of Alcohol Overdose', url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-dangers-of-alcohol-overdose' },
    { name: 'StatPearls (NCBI Bookshelf): Ethanol Toxicity', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557381/' },
    { name: 'eCFR: 49 CFR Part 382, alcohol rules for commercial drivers', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-382' }
  ],
  disclaimer: 'Estimate for education only. It cannot tell anyone they are safe or legal to drive, operate machinery or make other safety decisions. If you drink, do not drive.'
};
