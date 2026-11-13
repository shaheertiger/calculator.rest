export default {
  slug: 'bmi-calculator',
  hub: 'health',
  name: 'BMI Calculator',
  title: 'BMI Calculator: 5\'9" and 160 lb Is a BMI of 23.6 (CDC)',
  h1: 'BMI Calculator: Body Mass Index for Adults in Pounds or Kilograms',
  meta: 'Someone 5 ft 9 in who weighs 160 lb has a BMI of 23.6, in the CDC healthy range of 125–168 lb. Enter height and weight in US or metric units.',
  keyword: 'how to calculate body mass index',
  also: ['bmi calculator', 'how i calculate my bmi', 'how is bmi calculated for women', 'body mass index calculator', 'bmi formula', 'healthy weight for my height'],
  updated: '2026-11-13',
  inputs: [
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'US (lb, ft, in)'], ['metric', 'Metric (kg, cm)']] },
    { id: 'ft', label: 'Height (feet)', type: 'number', value: 5, suffix: 'ft', showIf: { units: ['us'] } },
    { id: 'inch', label: 'Height (inches)', type: 'number', value: 9, suffix: 'in', showIf: { units: ['us'] } },
    { id: 'cm', label: 'Height', type: 'number', value: 175, suffix: 'cm', showIf: { units: ['metric'] } },
    { id: 'lb', label: 'Weight', type: 'number', value: 160, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Weight', type: 'number', value: 72.5, suffix: 'kg', showIf: { units: ['metric'] } }
  ],
  compute(v, H) {
    var us = v.units !== 'metric';
    var hIn, wLb;
    if (us) {
      hIn = (v.ft > 0 ? v.ft : 0) * 12 + (v.inch > 0 ? v.inch : 0);
      wLb = v.lb;
    } else {
      hIn = v.cm / 2.54;
      wLb = v.kg / 0.45359237;
    }
    if (!(hIn >= 36 && hIn <= 96)) return { error: us ? 'Enter a height between 3 and 8 feet.' : 'Enter a height between 91 and 244 cm.' };
    if (!(wLb >= 40 && wLb <= 1000)) return { error: 'Enter a weight between 40 and 1,000 lb (18–454 kg).' };
    var bmi = 703 * wLb / (hIn * hIn);
    var b1 = Math.round(bmi * 10) / 10;
    var cat = b1 < 18.5 ? 'Underweight' : b1 < 25 ? 'Healthy weight' : b1 < 30 ? 'Overweight' : b1 < 35 ? 'Class 1 obesity' : b1 < 40 ? 'Class 2 obesity' : 'Class 3 (severe) obesity';
    var h2 = hIn * hIn / 703;
    var lo = Math.ceil(18.45 * h2), hi = Math.floor(24.95 * h2);
    var ow = Math.floor(29.95 * h2);
    var lbToKg = function (x) { return x * 0.45359237; };
    var fmtW = function (x) { return us ? H.int(x) + ' lb' : H.fix(lbToKg(x), 1) + ' kg'; };
    var range = us ? lo + '–' + hi + ' lb' : H.fix(lbToKg(18.5 * h2), 1) + '–' + H.fix(lbToKg(24.9 * h2), 1) + ' kg';
    var rows = [
      ['Category (CDC, adults 20+)', cat, true],
      ['Healthy weight for this height', range],
      ['BMI Prime (BMI ÷ 25)', H.fix(bmi / 25, 2)]
    ];
    var gap = '';
    if (wLb > hi) { rows.push(['To reach BMI 24.9', 'lose ' + fmtW(wLb - 24.9 * h2)]); gap = ' Losing ' + fmtW(wLb - 24.9 * h2) + ' would bring BMI to 24.9.'; }
    else if (wLb < lo) { rows.push(['To reach BMI 18.5', 'gain ' + fmtW(18.5 * h2 - wLb)]); gap = ' Gaining ' + fmtW(18.5 * h2 - wLb) + ' would bring BMI to 18.5.'; }
    var hTxt = us ? Math.floor(hIn / 12) + ' ft ' + H.num(hIn - 12 * Math.floor(hIn / 12), 1) + ' in' : H.num(v.cm, 1) + ' cm';
    return {
      value: H.fix(b1, 1),
      label: 'Body mass index (kg/m²) · ' + cat,
      expr: us ? '703 × ' + H.num(wLb, 1) + ' lb ÷ ' + H.num(hIn, 1) + ' in²' : H.num(v.kg, 1) + ' kg ÷ ' + H.fix(v.cm / 100, 2) + ' m²',
      rows: rows,
      sub: 'At ' + hTxt + ', a BMI of 18.5 to under 25 is the healthy-weight range.' + gap + ' BMI is a screening number, not a diagnosis.',
      lo: lo, hi: hi, ow: ow
    };
  },
  quick: ({ r }) => `BMI is weight in kilograms divided by height in meters squared, or 703 × pounds ÷ inches². An adult who is <strong>5 ft 9 in (69 in) and 160 lb</strong> has a BMI of 703 × 160 ÷ 4,761 = <strong>${r.value}</strong>, which the CDC classes as a healthy weight. At that height the healthy range is ${r.rows[1][1]}; 169 lb and up is overweight.`,
  stepsTitle: 'How to calculate your BMI',
  steps: [
    'Convert your height to inches (feet × 12 + inches) or to meters (centimeters ÷ 100). 5 ft 9 in is 69 inches, or 1.75 m.',
    'Square the height: 69 × 69 = 4,761 square inches, or 1.75 × 1.75 = 3.0625 m². Forgetting to square it is the most common mistake.',
    'Divide your weight by the squared height. In metric units that is the BMI: 72.5 kg ÷ 3.0625 = 23.7.',
    'In US units, multiply by 703 to convert lb/in² to kg/m²: 160 ÷ 4,761 × 703 = 23.6.',
    'Round to one decimal and compare with the CDC categories: under 18.5, 18.5–24.9, 25–29.9, and 30 or more.'
  ],
  formulaTitle: 'What is the BMI formula?',
  formula: {
    expr: 'BMI = weight (kg) ÷ height (m)²<br>BMI = 703 × weight (lb) ÷ height (in)²<br>BMI Prime = BMI ÷ 25',
    vars: [['weight', 'body weight in kilograms or pounds'], ['height', 'standing height in meters or inches'], ['703', 'converts lb/in² to kg/m² (more precisely 703.07)']],
    note: 'The formula is the Quetelet index from the 1830s. The same equation is used for adult women and men; only the interpretation changes for children and teens.'
  },
  example: `<p>A woman is 5 ft 4 in (64 in) and weighs 150 lb.</p><p>Height squared: 64 × 64 = 4,096. BMI = 703 × 150 ÷ 4,096 = <strong>25.7</strong>, just inside the overweight range (25 to under 30).</p><p>Her healthy-weight range is 18.5 × 4,096 ÷ 703 = 108 lb up to 24.9 × 4,096 ÷ 703 = 145 lb, so losing about 5 lb would bring her BMI under 25.</p>`,
  table: {
    title: 'What is a healthy weight for my height?',
    intro: 'Weight ranges for each adult BMI category, computed with the calculator above and rounded the way the CDC rounds BMI (to one decimal).',
    head: ['Height', 'Healthy (18.5–24.9)', 'Overweight (25–29.9)', 'Obesity (30+)'],
    rows: ({ run }) => [58, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 76].map(h => {
      const r = run({ units: 'us', ft: Math.floor(h / 12), inch: h % 12, lb: 150 });
      return [Math.floor(h / 12) + ' ft ' + (h % 12) + ' in', r.lo + '–' + r.hi + ' lb', (r.hi + 1) + '–' + r.ow + ' lb', (r.ow + 1) + ' lb or more'];
    }),
    note: 'The 5 ft 9 in row matches the CDC\'s own worked example (125–168 lb healthy, 169–202 lb overweight, 203 lb or more obesity).'
  },
  sections: [
    {
      h2: 'How is BMI calculated for women?',
      html: `<p>Exactly the same way as for men. For adults 20 and older the CDC applies one formula and one set of cut-offs regardless of age, sex or race: under 18.5 is underweight, 18.5 to under 25 is healthy weight, 25 to under 30 is overweight and 30 or more is obesity.</p><p>What differs is body composition. At the same BMI, women on average carry a higher percentage of body fat than men, so a woman and a man with a BMI of 24 are not equally lean. If you want a number that accounts for this, a <a href="/body-fat-calculator">body fat percentage</a> estimate from tape measurements is more informative. During pregnancy BMI is not used to judge weight; doctors use pre-pregnancy BMI to set weight-gain targets instead.</p>`
    },
    {
      h2: 'What do the BMI categories mean?',
      html: `<div class="twrap"><table><thead><tr><th>BMI</th><th>CDC category</th></tr></thead><tbody>
<tr><td>Below 18.5</td><td>Underweight</td></tr>
<tr><td>18.5 to under 25</td><td>Healthy weight</td></tr>
<tr><td>25 to under 30</td><td>Overweight</td></tr>
<tr><td>30 to under 35</td><td>Class 1 obesity</td></tr>
<tr><td>35 to under 40</td><td>Class 2 obesity</td></tr>
<tr><td>40 or more</td><td>Class 3 (severe) obesity</td></tr>
</tbody></table></div><p>BMI Prime divides your BMI by 25, the top of the healthy range. A BMI Prime under 1.00 means you are below the overweight threshold; 1.20 means your BMI is 20% above it (a BMI of 30).</p><p>For children and teens aged 2 to 19, BMI is converted to a percentile for age and sex using CDC growth charts, so an adult cut-off like 25 does not apply.</p>`
    },
    {
      h2: 'Is BMI accurate for athletes, older adults and Asian adults?',
      html: `<p>BMI measures weight relative to height, not fat. The CDC calls it a screening measure that should be considered alongside other factors. Its blind spots are predictable:</p><ul><li><strong>Muscular people</strong> can score as overweight with little body fat; a 5 ft 10 in lifter at 200 lb has a BMI of 28.7.</li><li><strong>Older adults</strong> lose muscle with age, so a normal BMI can hide excess fat.</li><li><strong>Asian adults</strong> tend to develop diabetes and heart risk at lower BMIs. A 2004 WHO expert consultation suggested additional public-health action points of 23 and 27.5, and the American Diabetes Association recommends diabetes screening for Asian Americans starting at a BMI of 23 rather than 25.</li></ul><p>Waist size adds useful information: the NIDDK lists a waist of 35 inches or more for women, or 40 inches or more for men, as raising the risk of obesity-related health problems.</p>`
    },
    {
      h2: 'How much weight do I need to lose to change BMI by one point?',
      html: `<p>One BMI point equals height² ÷ 703 pounds. At 5 ft 4 in that is 4,096 ÷ 703 = <strong>5.8 lb</strong>; at 5 ft 9 in it is 6.8 lb; at 6 ft 2 in it is 7.8 lb. In metric units one point is simply your height in meters squared, in kilograms: 3.06 kg at 1.75 m.</p><p>To turn a weight goal into a daily eating plan, use the <a href="/calorie-deficit-calculator">calorie deficit calculator</a>; for formula-based target weights used by clinicians, see the <a href="/ideal-weight-calculator">ideal body weight calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How do I calculate my BMI by hand?', a: 'Multiply your weight in pounds by 703, then divide by your height in inches squared. At 160 lb and 69 inches: 160 × 703 = 112,480, and 112,480 ÷ 4,761 = 23.6.' },
    { q: 'What is a normal BMI for a woman?', a: 'For adult women the healthy range is the same as for men: 18.5 to under 25. The CDC does not use separate adult cut-offs by sex.' },
    { q: 'Is a BMI of 25 overweight?', a: 'Yes. The overweight category starts at 25.0. A BMI of 24.9 is the top of the healthy range.' },
    { q: 'What BMI is considered obese?', a: 'A BMI of 30 or more is obesity for adults. It is divided into class 1 (30 to under 35), class 2 (35 to under 40) and class 3, or severe obesity (40 or more).' },
    { q: 'What weight is a BMI of 30 at 5 ft 6 in?', a: 'About 186 lb. One BMI point at 66 inches is 4,356 ÷ 703 = 6.2 lb, so BMI 30 is 30 × 6.2 = 185.9 lb.' },
    { q: 'Does BMI work for children?', a: 'Not with adult categories. For ages 2 to 19, BMI is compared with CDC growth charts to get a percentile; the 95th percentile or above is classed as obesity.' },
    { q: 'Why does my BMI say overweight when I am muscular?', a: 'BMI cannot tell muscle from fat. Very muscular people often score 25–29.9 with low body fat. A waist measurement or body fat estimate gives a better picture.' },
    { q: 'What is BMI Prime?', a: 'BMI Prime is your BMI divided by 25, the upper limit of the healthy range. 0.95 means you are 5% under the overweight line; 1.10 means 10% over it.' }
  ],
  related: ['body-fat-calculator', 'ideal-weight-calculator', 'calorie-calculator', 'calorie-deficit-calculator', 'bmr-calculator'],
  sources: [
    { name: 'CDC: Adult BMI Categories', url: 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html' },
    { name: 'CDC: About Body Mass Index (BMI)', url: 'https://www.cdc.gov/bmi/about/index.html' },
    { name: 'NIDDK: Am I at a Healthy Weight?', url: 'https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/am-i-healthy-weight' },
    { name: 'NHLBI: Calculate Your Body Mass Index', url: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm' }
  ],
  disclaimer: 'BMI is a screening estimate, not a diagnosis or medical advice. Talk with a health care provider about your weight and health.'
};
