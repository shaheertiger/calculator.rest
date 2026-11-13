export default {
  slug: 'suit-size-calculator',
  hub: 'everyday',
  name: 'Suit Size Calculator',
  title: 'Suit Size Calculator: 40" Chest at 5\'10" Is a 40R Jacket',
  h1: 'What Is My Suit Size? Jacket Size, Length and Drop From Your Measurements',
  meta: 'A 40-inch chest at 5\'10" wears a 40R jacket; with a 34-inch waist that\'s the standard 6-inch drop. Find your US suit size, length (S, R, L, XL) and EU size.',
  keyword: 'what is my suit size calculator',
  also: ['suit size calculator', 'jacket size calculator', 'what size suit do i wear', 'suit size chart', 'suit size by height and weight'],
  updated: '2026-11-13',
  inputs: [
    { id: 'chest', label: 'Chest measurement', type: 'number', value: 40, suffix: 'in', help: 'Around the fullest part, under the arms. Leave blank to estimate from height and weight.' },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft' },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 10, suffix: 'in' },
    { id: 'weight', label: 'Weight', type: 'number', value: 175, suffix: 'lb' },
    { id: 'waist', label: 'Waist (where you wear trousers)', type: 'number', value: 34, suffix: 'in', help: 'Optional. Used for trouser size and drop.' }
  ],
  compute(v, H) {
    var h = (v.ft > 0 ? v.ft : 0) * 12 + (v.inch > 0 ? v.inch : 0);
    if (!(h >= 54 && h <= 90)) return { error: 'Enter your height in feet and inches.' };
    var est = v.weight > 0 ? 40 + (v.weight - 172.5) * 2 / 15 - (h - 70) * 0.25 : NaN;
    var measured = v.chest >= 28 && v.chest <= 70;
    if (!measured && !(est > 0)) return { error: 'Enter your chest measurement, or your weight for an estimate.' };
    var size, alt = null;
    if (measured) {
      var n = Math.round(v.chest);
      if (n % 2) { size = n + 1; alt = n; } else size = n;
    } else size = 2 * Math.round(est / 2);
    var len = h <= 67 ? ['S', 'Short (5\'7" and under)'] : h <= 71 ? ['R', 'Regular (5\'8"–5\'11")'] : h <= 75 ? ['L', 'Long (6\'0"–6\'3")'] : ['XL', 'Extra Long (6\'4" and up)'];
    var code = size + len[0];
    var rows = [
      ['Length', len[1] + (h === 72 ? '; try R too if your arms are short' : h === 67 ? '; try R too if your arms are long' : '')],
      ['Chest used', measured ? H.num(v.chest, 1) + ' in (measured)' : H.num(est, 1) + ' in (estimated from height and weight)'],
      ['European / Italian size', String(size + 10) + (alt ? ' (or ' + (alt + 10) + ')' : '')]
    ];
    if (alt) rows.push(['Odd size option', alt + len[0] + ', if the brand makes odd sizes']);
    if (v.waist > 0) {
      var drop = size - v.waist;
      var tw = 2 * Math.ceil(v.waist / 2);
      rows.push(['Trousers', tw + ' waist', true]);
      rows.push(['Drop', H.num(drop, 1) + ' in: ' + (drop >= 7.5 ? 'athletic, buy jacket and trousers as separates' : drop >= 6.5 ? 'slim/athletic (7"), separates fit best' : drop >= 5.5 ? 'standard 6", suits sold as a set fit' : drop >= 3.5 ? 'executive (4"), look for "executive" or separates' : 'portly cut or separates')]);
    }
    if (measured && est > 0) rows.push(['Height and weight suggest', String(2 * Math.round(est / 2)) + len[0]]);
    return {
      value: code,
      label: 'Suit jacket size',
      expr: (measured ? H.num(v.chest, 1) + '" chest' : 'est. ' + H.num(est, 1) + '" chest') + ' · ' + Math.floor(h / 12) + '\'' + (h % 12) + '"',
      rows: rows,
      sub: measured ? 'Try it on: the shoulder seam should end at your shoulder bone, and the jacket should button without pulling.' : 'A height-and-weight estimate can be a size off either way. Measure your chest for a reliable answer.'
    };
  },
  quick: ({ r }) => `Your suit jacket size is your chest measurement in inches plus a length letter from your height. A 40-inch chest at 5'10" is a <strong>${r.value}</strong>. Short (S) is 5'7" and under, Regular (R) 5'8"–5'11", Long (L) 6'0"–6'3" and Extra Long 6'4" and up. With a 34-inch waist that's the standard 6-inch drop, so the matching trousers are a 34.`,
  stepsTitle: 'How to find your suit size',
  steps: [
    'Measure your chest: wrap a soft tape under your arms, around the fullest part of your chest and shoulder blades, over a thin shirt, arms relaxed. Keep the tape level and snug, not tight.',
    'Round to a whole inch. Suits mostly come in even sizes (38, 40, 42); if you measure an odd number like 41, take the next even size up, or the odd size if the brand makes it.',
    'Add the length from your height: Short, Regular, Long or Extra Long. Length sets the jacket\'s body and sleeve length, not its width.',
    'Measure your waist where you wear your trousers (usually just below the navel) to get the drop. <strong>The common mistake:</strong> using your jeans size, which often runs 1–2 inches smaller than a true tape measurement.',
    'No tape handy? Leave the chest blank and the calculator estimates a size from height and weight, but expect to try on a size either side.'
  ],
  formulaTitle: 'How is suit size calculated?',
  formula: {
    expr: 'Jacket size = chest (in), rounded to an even number<br>Length = S (≤ 5\'7") · R (5\'8"–5\'11") · L (6\'0"–6\'3") · XL (≥ 6\'4")<br>Drop = Jacket size − Trouser waist<br>EU size = US size + 10',
    vars: [['chest', 'body measurement around the fullest part of the chest, in inches'], ['drop', 'how much smaller the trouser waist is than the jacket size; 6 in is standard']],
    note: 'Without a chest measurement, the estimate starts at 40 for a 5\'10", 172-lb man, adds one size (2 in) per 15 lb and takes off a quarter inch per inch of extra height. It is a rough guide, not a fit.'
  },
  example: `<p>Mark measures a 40-inch chest and a 34-inch waist, and he is 5'10" and 175 lb.</p>
<p>Jacket size = <strong>40</strong>. At 5'10" he's a Regular, so <strong>40R</strong>. In Europe that's a <strong>50</strong>.</p>
<p>Drop = 40 − 34 = <strong>6 inches</strong>, the standard drop, so a suit sold as a set (40R jacket with 34 trousers) should fit. His height and weight alone would also predict 40R.</p>`,
  table: {
    title: 'What size suit am I by height and weight?',
    intro: 'Estimated jacket sizes when you don\'t have a chest measurement, from the calculator\'s height-and-weight formula. Use as a starting point for trying on.',
    head: ['Weight', '5\'6"', '5\'9"', '5\'11"', '6\'1"', '6\'3"', '6\'5"'],
    rows: ({ run }) => [140, 155, 170, 185, 200, 215, 230, 250, 270].map(w => [w + ' lb', ...[66, 69, 71, 73, 75, 77].map(h => run({ chest: NaN, ft: Math.floor(h / 12), inch: h % 12, weight: w }).value)]),
    note: 'Muscular builds usually need one size larger in the jacket than this table shows (with an athletic drop); slim builds one size smaller. The chest measurement beats any table.'
  },
  sections: [
    {
      h2: 'How do you measure your chest for a suit?',
      html: `<p>Have someone else hold the tape if you can. Stand straight with your arms at your sides and breathe normally. Run a soft tape measure under your armpits, around the widest part of your chest and across your shoulder blades. Check in a mirror that the tape is level all the way around, and read it without puffing your chest or holding your breath.</p>
<p>That number in inches is your jacket size: a 40-inch chest wears a 40. Measure over a dress shirt, not a sweater. Shirt neck and sleeve sizes (such as 15½/33) are a different system and don't convert to jacket sizes.</p>`
    },
    {
      h2: 'What do Short, Regular and Long mean on a suit?',
      html: `<p>The letter is the jacket's length: how far it reaches down your body and how long the sleeves are. A 42S, 42R and 42L have the same chest and shoulders but different lengths.</p>
<div class="twrap"><table><thead><tr><th>Letter</th><th>Height</th><th>Example</th></tr></thead><tbody>
<tr><td>S (Short)</td><td>5'7" and under</td><td>40S</td></tr>
<tr><td>R (Regular)</td><td>5'8"–5'11"</td><td>40R</td></tr>
<tr><td>L (Long)</td><td>6'0"–6'3"</td><td>40L</td></tr>
<tr><td>XL (Extra Long)</td><td>6'4" and up</td><td>40XL</td></tr>
</tbody></table></div>
<p>Arms matter as much as height. If you're 5'11" with long arms, try a Long; at 6'0" with short arms, a Regular may fit better. A jacket should cover your seat, and the sleeves should show about ¼ to ½ inch of shirt cuff. Retailers draw the lines slightly differently, and the industry body-measurement standard (ASTM D6240) uses Short, Regular and Tall.</p>`
    },
    {
      h2: 'What is a suit drop, and what if mine isn\'t 6 inches?',
      html: `<p>The drop is the difference between the jacket size and the trouser waist. Most suits sold as a set have a <strong>6-inch drop</strong>: a 40R jacket comes with 34 trousers, a 44R with 38.</p>
<ul><li><strong>7–8 inch drop (athletic):</strong> big chest, narrow waist, such as a 42 jacket with 34 trousers. Buy suit separates so you can pick each size.</li><li><strong>4 inch drop (executive):</strong> a fuller waist, such as a 46 jacket with 42 trousers. Some brands sell "executive" or "portly" cuts.</li></ul>
<p>Trousers can usually be let out or taken in about an inch at the seat seam, so a 1-inch mismatch is a tailoring job, not a reason to switch sizes. For comparison, the CDC reports the average U.S. man is about 5'9", 200 lb, with a 40.5-inch waist, so many men fall outside the standard 6-inch drop.</p>`
    },
    {
      h2: 'Should I size up or down if I\'m between suit sizes?',
      html: `<p>Choose the jacket that fits your <strong>shoulders</strong>, then tailor everything else. Shoulders are nearly impossible to alter, while a tailor can take in the waist, shorten sleeves and adjust trousers cheaply. If the smaller size pulls into an X at the button or the shoulder pads hang past your shoulder bones, go to the larger size.</p>
<p>Cut matters too: a slim-fit 40 is noticeably narrower through the waist than a classic-fit 40, though the chest size is the same. European labels add 10 (a US 40 is an EU 50); UK sizes match US sizes.</p>`
    }
  ],
  faq: [
    { q: 'What size suit is a 40R?', a: 'A 40R fits a 40-inch chest on a man about 5\'8" to 5\'11" tall. It usually comes with 34-inch trousers (a 6-inch drop) and is a 50 in European sizing.' },
    { q: 'What size suit for a man 5\'10" and 180 lb?', a: 'Our height-and-weight estimate is a 42R (about a 41-inch chest, rounded up to the even size). Men with a slim build often wear a 40R, so measure your chest to decide.' },
    { q: 'What size suit for 6\'2" and 200 lb?', a: 'About a 42L by height and weight. At 6\'2" you need a Long; the chest size depends on build, so a muscular 200 lb may need a 44L.' },
    { q: 'Is suit size the same as chest size?', a: 'Yes. US and UK jacket sizes are your chest measurement in inches, rounded to the nearest size the brand makes, usually an even number.' },
    { q: 'What is the difference between 40S, 40R and 40L?', a: 'The chest is the same. The letter changes the jacket\'s body length and sleeve length: Short for about 5\'7" and under, Regular for 5\'8"–5\'11", Long for 6\'0"–6\'3".' },
    { q: 'How do I convert US suit sizes to European sizes?', a: 'Add 10. A US 38 is an EU 48, a 40 is a 50 and a 42 is a 52. UK sizes are the same as US sizes.' },
    { q: 'How should a suit jacket fit?', a: 'The shoulder seam should end at your shoulder bone, the jacket should button without pulling, it should cover your seat, and about ¼–½ inch of shirt cuff should show past the sleeve.' }
  ],
  related: ['bmi-calculator', 'ideal-weight-calculator', 'body-fat-calculator', 'discount-calculator'],
  sources: [
    { name: 'ASTM D6240/D6240M-24a: Standard Tables of Body Measurements for Adult Male, Chest Size Range 34–52 Short, Regular, and Tall', url: 'https://store.astm.org/d6240_d6240m-24a.html' },
    { name: 'CDC National Center for Health Statistics: Body Measurements (FastStats)', url: 'https://www.cdc.gov/nchs/fastats/body-measurements.htm' }
  ],
  disclaimer: 'Sizes vary by brand and cut. Use the result as a starting point and try the jacket on or check the brand\'s own size chart.'
};
