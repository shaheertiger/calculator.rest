export default {
  slug: 'body-fat-calculator',
  hub: 'health',
  name: 'Body Fat Calculator',
  title: 'Body Fat Calculator: 36" Waist, 16" Neck at 5\'10" = 19.4%',
  h1: 'Body Fat Calculator: U.S. Navy Tape-Measure Method',
  meta: 'A man 5 ft 10 in with a 36-inch waist and 16-inch neck is about 19.4% body fat by the U.S. Navy formula, the ACE "average" range. Measure, enter, compare.',
  keyword: 'how can you calculate your body fat',
  also: ['body fat calculator', 'how to compute body fat calculator', 'how to calculate percentage body fat', 'navy body fat calculator', 'body fat percentage calculator', 'us navy body fat formula'],
  updated: '2026-11-13',
  inputs: [
    { id: 'sex', label: 'Sex', type: 'select', value: 'male', options: [['male', 'Male'], ['female', 'Female']] },
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'Inches and pounds'], ['metric', 'Centimeters and kilograms']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 10, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 178, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'neckIn', label: 'Neck', type: 'number', value: 16, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'waistIn', label: 'Waist', type: 'number', value: 36, suffix: 'in', showIf: { units: ['us'] }, help: 'Men: at the navel. Women: at the narrowest point.' },
    { id: 'hipIn', label: 'Hips', type: 'number', value: 40, suffix: 'in', showIf: { units: ['us'], sex: ['female'] } },
    { id: 'neckCm', label: 'Neck', type: 'number', value: 40.5, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'waistCm', label: 'Waist', type: 'number', value: 91.5, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'hipCm', label: 'Hips', type: 'number', value: 101.5, suffix: 'cm', showIf: { units: ['metric'], sex: ['female'] } },
    { id: 'lb', label: 'Weight (optional)', type: 'number', value: 180, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Weight (optional)', type: 'number', value: 81.5, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'age', label: 'Age (optional)', type: 'number', value: 35, suffix: 'years', help: 'Adds a BMI-based estimate for comparison.' }
  ],
  compute(v, H) {
    var us = v.units !== 'metric';
    var c = us ? 1 : 1 / 2.54;
    var h = us ? (v.ft > 0 ? v.ft : 0) * 12 + (v.inch > 0 ? v.inch : 0) : v.cm * c;
    var neck = (us ? v.neckIn : v.neckCm) * c, waist = (us ? v.waistIn : v.waistCm) * c, hip = (us ? v.hipIn : v.hipCm) * c;
    var male = v.sex !== 'female';
    if (!(h >= 48 && h <= 96)) return { error: 'Enter a height between 4 and 8 feet (122–244 cm).' };
    if (!(neck >= 8 && neck <= 30)) return { error: 'Enter your neck circumference.' };
    if (!(waist >= 18 && waist <= 80)) return { error: 'Enter your waist circumference.' };
    if (!male && !(hip >= 24 && hip <= 80)) return { error: 'Enter your hip circumference.' };
    if (male && waist - neck <= 0) return { error: 'Waist must be larger than neck.' };
    var L = function (x) { return Math.log(x) / Math.LN10; };
    var bf = male ? 86.010 * L(waist - neck) - 70.041 * L(h) + 36.76 : 163.205 * L(waist + hip - neck) - 97.684 * L(h) - 78.387;
    if (!(bf > 0 && bf < 70)) return { error: 'These measurements give an implausible result. Check the units and how each was measured.' };
    var cats = male ? [[2, 'Below essential fat'], [6, 'Essential fat'], [14, 'Athletes'], [18, 'Fitness'], [25, 'Average'], [999, 'Obese']] : [[10, 'Below essential fat'], [14, 'Essential fat'], [21, 'Athletes'], [25, 'Fitness'], [32, 'Average'], [999, 'Obese']];
    var cat = '';
    for (var i = 0; i < cats.length; i++) if (bf < cats[i][0]) { cat = cats[i][1]; break; }
    var rows = [['ACE category', cat, true]];
    var wLb = us ? v.lb : v.kg / 0.45359237;
    if (wLb >= 60 && wLb <= 800) {
      var fat = wLb * bf / 100;
      var fmt = function (x) { return us ? H.num(x, 1) + ' lb' : H.num(x * 0.45359237, 1) + ' kg'; };
      rows.push(['Fat mass', fmt(fat)]);
      rows.push(['Lean mass', fmt(wLb - fat)]);
      if (v.age >= 18 && v.age <= 100) {
        var bmi = 703 * wLb / (h * h);
        var deu = 1.2 * bmi + 0.23 * v.age - 10.8 * (male ? 1 : 0) - 5.4;
        rows.push(['BMI-based estimate (Deurenberg)', H.fix(deu, 1) + '% at BMI ' + H.fix(bmi, 1)]);
      }
    }
    rows.push(['Waist-to-height ratio', H.fix(waist / h, 2)]);
    return {
      value: H.fix(bf, 1) + '%',
      label: 'Body fat · U.S. Navy method',
      expr: male ? '86.010·log(' + H.num(waist, 1) + '−' + H.num(neck, 1) + ') − 70.041·log(' + H.num(h, 1) + ') + 36.76' : '163.205·log(' + H.num(waist, 1) + '+' + H.num(hip, 1) + '−' + H.num(neck, 1) + ') − 97.684·log(' + H.num(h, 1) + ') − 78.387',
      rows: rows,
      sub: 'ACE ranges for ' + (male ? 'men' : 'women') + ': ' + (male ? 'athletes 6–13%, fitness 14–17%, average 18–24%, obese 25%+' : 'athletes 14–20%, fitness 21–24%, average 25–31%, obese 32%+') + '. Tape methods are usually within a few percentage points of a lab scan, so track the trend.',
      bf: bf
    };
  },
  quick: ({ r }) => `You can calculate body fat with a tape measure using the U.S. Navy formula. For men: 86.010 × log(waist − neck) − 70.041 × log(height) + 36.76, in inches. A man 5 ft 10 in (70 in) with a 36-inch waist and a 16-inch neck gets 86.010 × log(20) − 70.041 × log(70) + 36.76 = <strong>${r.value} body fat</strong>, in the American Council on Exercise's "average" range of 18–24% for men.`,
  stepsTitle: 'How to calculate body fat with a tape measure',
  steps: [
    'Use a flexible, non-stretch tape. Measure on bare skin, standing relaxed, after breathing out normally. Do not suck in.',
    '<strong>Neck:</strong> just below the larynx (Adam\'s apple), with the tape sloping slightly down toward the front.',
    '<strong>Waist:</strong> men at the level of the navel; women at the narrowest point of the torso. Using the wrong waist location for your sex is the most common error and can shift the result by several points.',
    '<strong>Hips (women only):</strong> around the widest part of the buttocks, tape level all the way around.',
    'Measure each site 2–3 times, use the average, and enter your height without shoes. Re-measure at the same time of day every 2–4 weeks to track changes.'
  ],
  formulaTitle: 'What is the U.S. Navy body fat formula?',
  formula: {
    expr: 'Men: %BF = 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76<br>Women: %BF = 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387',
    vars: [['waist, neck, hip, height', 'circumferences and height in inches (centimeters are converted)'], ['log₁₀', 'common (base-10) logarithm']],
    note: 'The equations were developed by James Hodgdon and Marcie Beckett at the Naval Health Research Center in 1984 and adopted by the U.S. military for its weight-control programs. Fat mass is weight × body fat %; lean mass is the rest.'
  },
  example: `<p>A woman is 5 ft 5 in (65 in) tall with a 32-inch waist, 40-inch hips and a 13.5-inch neck.</p><p>Waist + hip − neck = 32 + 40 − 13.5 = 58.5. log₁₀(58.5) = 1.7672 and log₁₀(65) = 1.8129.</p><p>%BF = 163.205 × 1.7672 − 97.684 × 1.8129 − 78.387 = 288.42 − 177.09 − 78.39 = <strong>32.9%</strong>, just into ACE's obese range for women (32% and up). Bringing her waist down 2 inches, to 30, would put her at about 30.5%, in the average range.</p>`,
  table: {
    title: 'What body fat percentage do my waist and neck measurements give?',
    intro: 'Navy-method body fat for a man 5 ft 10 in tall, computed with the calculator above. Find your waist in the left column and your neck along the top.',
    head: ['Waist (in)', 'Neck 14 in', 'Neck 15 in', 'Neck 16 in', 'Neck 17 in'],
    rows: ({ run, H }) => [30, 32, 34, 36, 38, 40, 42, 44].map(w => [w + ' in', ...[14, 15, 16, 17].map(n => H.fix(run({ sex: 'male', units: 'us', ft: 5, inch: 10, waistIn: w, neckIn: n }).bf, 1) + '%')]),
    note: 'Each extra inch of waist adds between about 1.3 and 2.5 points at this height (more at smaller waists), while a thicker neck lowers the estimate, which is why the formula can under-read men with large necks from heavy training.'
  },
  sections: [
    {
      h2: 'What is a healthy body fat percentage?',
      html: `<p>The American Council on Exercise (ACE) uses these widely quoted categories:</p><div class="twrap"><table><thead><tr><th>Category</th><th>Women</th><th>Men</th></tr></thead><tbody>
<tr><td>Essential fat</td><td>10–13%</td><td>2–5%</td></tr>
<tr><td>Athletes</td><td>14–20%</td><td>6–13%</td></tr>
<tr><td>Fitness</td><td>21–24%</td><td>14–17%</td></tr>
<tr><td>Average</td><td>25–31%</td><td>18–24%</td></tr>
<tr><td>Obese</td><td>32% and up</td><td>25% and up</td></tr>
</tbody></table></div><p>Women carry more essential fat than men for reproductive and hormonal reasons, which is why every category sits about 7–8 points higher. Going below the essential range is unsafe for anyone. The categories do not adjust for age, although body fat tends to rise with age at the same BMI.</p>`
    },
    {
      h2: 'How accurate is the Navy body fat formula?',
      html: `<p>Reasonably good for an estimate that needs only a tape measure. When Friedl and Vogel compared the military services' circumference equations with dual-energy X-ray absorptiometry (DXA) in 496 young men, the waist-minus-neck measurement tracked body fat better than BMI or waist alone, and the services' different equations gave substantially similar results.</p><p>It is weaker at the extremes: very lean, very muscular (thick-necked) people and people with obesity are more likely to be misread by several percentage points. Measurement technique matters as much as the equation; a tape pulled tighter or placed an inch higher changes the answer. Use the same tape, the same spots and the same time of day, and focus on the trend over months.</p>`
    },
    {
      h2: 'How can you calculate body fat percentage without a tape measure?',
      html: `<ul><li><strong>From BMI:</strong> Deurenberg's 1991 equation, BF% = 1.20 × BMI + 0.23 × age − 10.8 × sex − 5.4 (sex = 1 for men, 0 for women), had a standard error of about 4 percentage points. The calculator shows it when you enter weight and age. Get your BMI first with the <a href="/bmi-calculator">BMI calculator</a>.</li><li><strong>Skinfold calipers:</strong> accurate in trained hands, inconsistent when self-measured.</li><li><strong>Bioelectrical impedance scales:</strong> convenient, but readings swing with hydration, meals and exercise.</li><li><strong>DXA scan:</strong> a low-dose X-ray that also shows where fat is stored; often used as the reference method.</li></ul><p>For the same man in the example (5 ft 10 in, 180 lb, age 35), the BMI formula gives about 22.8% versus 19.4% from the tape, a typical gap between methods.</p>`
    },
    {
      h2: 'Does waist size matter more than body fat percentage?',
      html: `<p>For health risk, waist size is a strong signal on its own because it reflects fat stored around the organs. The NIDDK lists a waist of 35 inches or more for women and 40 inches or more for men as raising the risk of obesity-related problems. Another simple check is waist-to-height ratio, shown in the results: keeping your waist under half your height is a common target. To plan a goal weight from a body fat target, divide your lean mass by (1 − target %); the <a href="/ideal-weight-calculator">ideal weight calculator</a> gives formula-based ranges too.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my body fat percentage at home?', a: 'Measure your neck and waist (plus hips for women) with a tape, then use the U.S. Navy formula. A man 5 ft 10 in with a 36-inch waist and 16-inch neck comes out at about 19.4%.' },
    { q: 'What is a good body fat percentage for men?', a: 'ACE classes 14–17% as fitness and 18–24% as average for men; 6–13% is typical of athletes, and 25% or more is classed as obese.' },
    { q: 'What is a good body fat percentage for women?', a: 'ACE classes 21–24% as fitness and 25–31% as average for women; 14–20% is typical of athletes, and 32% or more is classed as obese.' },
    { q: 'Why do women need the hip measurement?', a: 'Women store more fat around the hips and thighs, so the Navy equation for women adds hip circumference to waist before subtracting neck. The men\'s equation uses waist and neck only.' },
    { q: 'How do I calculate fat mass and lean mass?', a: 'Fat mass = weight × body fat %. At 180 lb and 19.4%, fat mass is about 35 lb and lean mass is about 145 lb.' },
    { q: 'Is the Navy method more accurate than a smart scale?', a: 'Often yes for tracking over time, because a tape is not affected by hydration the way bioelectrical impedance is. Neither matches a DXA scan for a single reading.' },
    { q: 'Can I use centimeters with the Navy formula?', a: 'Yes. Choose metric units and the calculator converts your measurements to inches for the original equations. Published metric versions of the formula give results within a few tenths of a percentage point.' }
  ],
  related: ['bmi-calculator', 'ideal-weight-calculator', 'calorie-deficit-calculator', 'bmr-calculator', 'protein-calculator'],
  sources: [
    { name: 'Friedl KE, Vogel JA. Validity of percent body fat predicted from circumferences. Mil Med 1997', url: 'https://pubmed.ncbi.nlm.nih.gov/9121667/' },
    { name: 'Deurenberg P et al. Body mass index as a measure of body fatness: age- and sex-specific prediction formulas. Br J Nutr 1991', url: 'https://pubmed.ncbi.nlm.nih.gov/2043597/' },
    { name: 'American Council on Exercise (ACE): body fat percentage categories', url: 'https://www.acefitness.org/' },
    { name: 'NIDDK: Am I at a Healthy Weight?', url: 'https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/am-i-healthy-weight' }
  ],
  disclaimer: 'Body fat formulas give estimates, not a medical assessment. For clinical decisions, ask a health care provider about measured methods such as DXA.'
};
