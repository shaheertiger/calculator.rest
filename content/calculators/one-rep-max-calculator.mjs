export default {
  slug: 'one-rep-max-calculator',
  hub: 'health',
  name: 'One Rep Max Calculator',
  title: 'One Rep Max Calculator: 185 lb × 5 Reps = 216 lb 1RM (Epley)',
  h1: 'One Rep Max Calculator: Estimate Your 1RM and Training Percentages',
  meta: 'Lifting 185 lb for 5 reps predicts a one-rep max of about 216 lb (Epley) or 208 lb (Brzycki). Compare 7 formulas and get a % of 1RM loading chart.',
  keyword: 'how do you calculate 1rm',
  also: ['one rep max calculator', '1rm calculator', 'how to calculate one rep max', 'epley formula', 'brzycki formula', 'bench press max calculator', 'percentage of 1rm chart'],
  updated: '2026-11-13',
  inputs: [
    { id: 'w', label: 'Weight lifted', type: 'number', value: 185 },
    { id: 'unit', label: 'Unit', type: 'select', value: 'lb', options: [['lb', 'lb'], ['kg', 'kg']] },
    { id: 'reps', label: 'Reps completed', type: 'number', value: 5, help: 'Most accurate with 2–10 reps taken close to failure.' },
    { id: 'f', label: 'Formula', type: 'select', value: 'epley', options: [['epley', 'Epley'], ['brzycki', 'Brzycki'], ['lander', 'Lander'], ['lombardi', 'Lombardi'], ['oconner', 'O\'Conner'], ['mayhew', 'Mayhew'], ['wathan', 'Wathan'], ['avg', 'Average of all 7']] }
  ],
  data: { pct: [[100, '1'], [95, '2'], [93, '3'], [90, '4'], [87, '5'], [85, '6'], [83, '7'], [80, '8'], [77, '9'], [75, '10'], [70, '11'], [67, '12'], [65, '15']] },
  compute(v, H, D) {
    var w = v.w, r = Math.round(v.reps);
    if (!(w > 0 && w < 2000)) return { error: 'Enter the weight you lifted.' };
    if (!(r >= 1 && r <= 20)) return { error: 'Enter 1 to 20 reps. Above 10 reps the estimates get much less reliable.' };
    var F = {
      epley: w * (1 + r / 30),
      brzycki: w * 36 / (37 - r),
      lander: 100 * w / (101.3 - 2.67123 * r),
      lombardi: w * Math.pow(r, 0.1),
      oconner: w * (1 + 0.025 * r),
      mayhew: 100 * w / (52.2 + 41.9 * Math.exp(-0.055 * r)),
      wathan: 100 * w / (48.8 + 53.8 * Math.exp(-0.075 * r))
    };
    var names = { epley: 'Epley', brzycki: 'Brzycki', lander: 'Lander', lombardi: 'Lombardi', oconner: 'O\'Conner', mayhew: 'Mayhew', wathan: 'Wathan', avg: 'Average of 7' };
    var keys = ['epley', 'brzycki', 'lander', 'lombardi', 'oconner', 'mayhew', 'wathan'];
    if (r === 1) keys.forEach(function (k) { F[k] = w; });
    var sum = 0; keys.forEach(function (k) { sum += F[k]; });
    F.avg = sum / 7;
    var key = names[v.f] ? v.f : 'epley';
    var orm = F[key];
    var u = v.unit === 'kg' ? 'kg' : 'lb';
    var step = u === 'kg' ? 2.5 : 5;
    var rows = keys.map(function (k) { return [names[k], H.num(F[k], 1) + ' ' + u, k === key]; });
    rows.push(['Average of 7', H.num(F.avg, 1) + ' ' + u, key === 'avg']);
    var exprs = { epley: H.num(w, 1) + ' × (1 + ' + r + ' ÷ 30)', brzycki: H.num(w, 1) + ' × 36 ÷ (37 − ' + r + ')', lander: '100 × ' + H.num(w, 1) + ' ÷ (101.3 − 2.67123 × ' + r + ')', lombardi: H.num(w, 1) + ' × ' + r + '^0.10', oconner: H.num(w, 1) + ' × (1 + 0.025 × ' + r + ')', mayhew: '100 × ' + H.num(w, 1) + ' ÷ (52.2 + 41.9e^(−0.055×' + r + '))', wathan: '100 × ' + H.num(w, 1) + ' ÷ (48.8 + 53.8e^(−0.075×' + r + '))', avg: 'mean of 7 formulas' };
    var t = D.pct.map(function (p) { return [p[0] + '%', H.num(orm * p[0] / 100, 1) + ' ' + u, H.num(Math.round(orm * p[0] / 100 / step) * step, 1) + ' ' + u, p[1]]; });
    return {
      value: H.num(orm, 1) + ' ' + u,
      label: 'Estimated one-rep max · ' + names[key],
      expr: r === 1 ? 'a single rep is your 1RM' : exprs[key],
      rows: rows,
      sub: (r > 10 ? 'Above 10 reps the formulas spread apart quickly; retest with a heavier set of 3–8 reps for a better estimate. ' : '') + 'Plate-rounded working weights are in the chart below; rep targets are the NSCA guide values.',
      table: { head: ['% of 1RM', 'Weight', 'Rounded', 'Reps (NSCA)'], rows: t, caption: 'Training loads from ' + H.num(orm, 1) + ' ' + u },
      F: F
    };
  },
  quick: ({ r }) => `To calculate your 1RM, lift a weight for as many clean reps as you can (ideally 2–10) and plug it into a formula. With Epley, 1RM = weight × (1 + reps ÷ 30): 185 lb for 5 reps gives 185 × 1.167 = <strong>${r.value}</strong>. Brzycki's weight × 36 ÷ (37 − reps) gives 208.1 lb. Both agree exactly at 10 reps and drift apart above it.`,
  stepsTitle: 'How to calculate your one-rep max safely',
  steps: [
    'Warm up: a light set of 5–10 reps, then a heavier set of 3–5 reps, resting 1–2 minutes between sets.',
    'Load a weight you think you can lift about 3–8 times with good form. Use a spotter or safety bars for bench press and squat.',
    'Do as many clean reps as you can, stopping when form breaks down or one more rep would fail. Counting sloppy or half reps is the mistake that inflates estimates most.',
    'Enter the weight and reps. Epley: 185 × (1 + 5 ÷ 30) = 215.8 lb. Brzycki: 185 × 36 ÷ 32 = 208.1 lb.',
    'Use the percentage chart to set training weights. Re-estimate every 4–8 weeks from a fresh hard set rather than testing a true max often.'
  ],
  formulaTitle: 'What are the one-rep max formulas?',
  formula: {
    expr: 'Epley: 1RM = w × (1 + r ÷ 30)<br>Brzycki: 1RM = w × 36 ÷ (37 − r)<br>Lander: 1RM = 100w ÷ (101.3 − 2.67123r)<br>Lombardi: 1RM = w × r<sup>0.10</sup><br>O\'Conner: 1RM = w × (1 + 0.025r)<br>Mayhew: 1RM = 100w ÷ (52.2 + 41.9e<sup>−0.055r</sup>)<br>Wathan: 1RM = 100w ÷ (48.8 + 53.8e<sup>−0.075r</sup>)',
    vars: [['w', 'weight lifted (any unit)'], ['r', 'repetitions completed to near failure'], ['e', 'Euler\'s number, 2.718…']],
    note: 'Boyd Epley published his version in a 1985 poundage chart; Matt Brzycki\'s appeared in 1993. All the equations treat a single rep as your 1RM; the calculator uses the lifted weight when reps = 1.'
  },
  example: `<p>A lifter squats 60 kg for 8 reps.</p><p>Epley: 60 × (1 + 8 ÷ 30) = 60 × 1.267 = <strong>76.0 kg</strong>. Brzycki: 60 × 36 ÷ 29 = <strong>74.5 kg</strong>.</p><p>For a strength block at 85% of 1RM (about 6 reps), she would use 0.85 × 76 = 64.6 kg, rounded to <strong>65 kg</strong>. For hypertrophy sets of 10 at 75%, 57 kg, rounded to <strong>57.5 kg</strong>.</p>`,
  table: {
    title: 'How much do the 1RM formulas differ as reps go up?',
    intro: 'Estimated one-rep max for a 185 lb set at different rep counts, computed with the calculator above. The formulas agree closely at low reps and spread out as reps rise.',
    head: ['Reps at 185 lb', 'Epley', 'Brzycki', 'Lander', 'Lombardi', 'Mayhew', 'Spread'],
    rows: ({ run, H }) => [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map(n => {
      const F = run({ w: 185, unit: 'lb', reps: n, f: 'epley' }).F;
      const vals = [F.epley, F.brzycki, F.lander, F.lombardi, F.mayhew];
      return [String(n), ...vals.map(x => H.num(x, 1)), H.num(Math.max(...vals) - Math.min(...vals), 1) + ' lb'];
    }),
    note: 'Lombardi and O\'Conner rise slowly at high reps while Lander and Brzycki rise fastest, so sets of 12–15 reps give a range of about 30 lb or more.'
  },
  sections: [
    {
      h2: 'Which one-rep max formula is the most accurate?',
      html: `<p>For sets of about 2–10 reps, Epley and Brzycki are the most widely used and give similar answers: they are identical at 10 reps, and Epley reads a little higher below that. More important than the formula is the rep count you feed it. In a 2006 study of 70 men and women aged 18–69, Reynolds, Gordon and Robergs found that a 5-rep max predicted bench press and leg press 1RM more accurately than 10- or 20-rep maxes, and recommended using no more than 10 repetitions in linear prediction equations.</p><p>Practical rules: use a set of 3–6 reps for the best estimate, take it to true technical failure, and use the same formula each time so changes reflect strength, not math. If you trained for endurance, your estimates from high-rep sets will tend to overshoot your real single.</p>`
    },
    {
      h2: 'How do you use percentages of your 1RM in training?',
      html: `<p>Training programs prescribe loads as a percentage of 1RM. The NSCA's widely used guide links each percentage to the number of reps most people can complete (shown in the results chart): about 6 reps at 85%, 8 at 80%, 10 at 75% and 12 at 67%.</p><ul><li><strong>Strength:</strong> 85% and above, 6 reps or fewer per set.</li><li><strong>Muscle size (hypertrophy):</strong> roughly 67–85%, 6–12 reps.</li><li><strong>Muscular endurance:</strong> under 67%, 12 or more reps.</li></ul><p>Individual differences are real: some people get 8 reps at 80%, others 5. If a prescribed set is far too easy or impossible, re-estimate your max. For fueling the work, the <a href="/protein-calculator">protein calculator</a> gives a daily target for building muscle.</p>`
    },
    {
      h2: 'Is it safe to test your true one-rep max?',
      html: `<p>For experienced lifters with good technique, a properly warmed-up max attempt with spotters is common practice. A typical approach is a light warm-up set, a set of 3–5 reps, a heavy double or triple, then single attempts with 2–4 minutes of rest, aiming to find the max within 3–5 attempts.</p><p>Beginners, people returning from injury, older adults and anyone with high blood pressure or heart disease are better served by estimating from a submaximal set, which is what this calculator is for. Straining against a maximal load can raise blood pressure sharply; ask your doctor first if you have cardiovascular concerns.</p>`
    }
  ],
  faq: [
    { q: 'How do you calculate 1RM from 5 reps?', a: 'Multiply the weight by (1 + 5 ÷ 30), or 1.167, using Epley. 185 lb for 5 reps gives about 215.8 lb. Brzycki multiplies by 36 ÷ 32 = 1.125 and gives 208.1 lb.' },
    { q: 'What is the Epley formula?', a: '1RM = weight × (1 + reps ÷ 30). It was published by strength coach Boyd Epley in 1985 and is the default in many apps and calculators.' },
    { q: 'What is the Brzycki formula?', a: '1RM = weight × 36 ÷ (37 − reps). It was published by Matt Brzycki in 1993 and gives slightly lower estimates than Epley below 10 reps.' },
    { q: 'What percentage of my 1RM can I lift for 10 reps?', a: 'About 75% on the NSCA chart. With a 1RM of 216 lb, that is about 162 lb, or 160 lb rounded to the nearest 5.' },
    { q: 'How accurate is a 1RM calculator?', a: 'From a hard set of 3–6 reps, most people land within a few percent of their tested max. Estimates from 12 or more reps are much less reliable.' },
    { q: 'Should I use my 1RM to train?', a: 'Use it to set loads, not as a daily lift. Most programs work at 65–90% of 1RM and test or re-estimate the max every few weeks.' },
    { q: 'Do the formulas work for all lifts?', a: 'They are most often used for bench press, squat and deadlift. Lifts that rely more on technique or smaller muscles, and machine exercises, can deviate more, so treat results as a starting point.' }
  ],
  related: ['protein-calculator', 'calories-burned-calculator', 'macro-calculator', 'body-fat-calculator'],
  sources: [
    { name: 'Reynolds JM, Gordon TJ, Robergs RA. Prediction of one repetition maximum strength from multiple repetition maximum testing. J Strength Cond Res 2006', url: 'https://pubmed.ncbi.nlm.nih.gov/16937972/' },
    { name: 'National Strength and Conditioning Association (NSCA)', url: 'https://www.nsca.com/' }
  ],
  disclaimer: 'One-rep max formulas give estimates, not a guarantee of what you can lift safely. Use spotters, progress gradually, and get medical advice before maximal lifting if you have heart, blood pressure or joint problems.'
};
