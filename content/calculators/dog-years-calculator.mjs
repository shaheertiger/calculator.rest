export default {
  slug: 'dog-years-calculator',
  hub: 'everyday',
  name: 'Dog Years Calculator',
  title: 'Dog Years Calculator: A 5-Year-Old Dog Is 36 in Human Years',
  h1: 'Dog Age in Human Years: Size Chart, DNA Formula and the ×7 Myth',
  meta: 'A 5-year-old medium dog is about 36 in human years on the size chart, 57 by the 2020 UCSD DNA formula and 35 by the old ×7 rule. Convert any age by size.',
  keyword: 'how old is my dog in human years calculator',
  also: ['dog years calculator', 'dog years to human years', 'dog age calculator', 'how old is my dog in human years', 'dog age chart'],
  updated: '2026-11-13',
  inputs: [
    { id: 'years', label: 'Dog\'s age', type: 'number', value: 5, suffix: 'years' },
    { id: 'months', label: 'Plus months', type: 'number', value: 0, suffix: 'months' },
    { id: 'size', label: 'Adult weight', type: 'select', value: 'medium', options: [['small', 'Small (20 lb or less)'], ['medium', 'Medium (21–50 lb)'], ['large', 'Large (51–90 lb)'], ['giant', 'Giant (over 90 lb)']] }
  ],
  data: {
    chart: {
      small: [0, 15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80],
      medium: [0, 15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87],
      large: [0, 15, 24, 28, 32, 36, 45, 50, 55, 61, 66, 72, 77, 82, 88, 93, 99],
      giant: [0, 12, 22, 31, 38, 45, 49, 56, 64, 71, 79, 86, 93, 100, 107, 114, 121]
    },
    senior: { small: 7, medium: 7, large: 6, giant: 5 }
  },
  compute(v, H, D) {
    var a = (v.years > 0 ? v.years : 0) + (v.months > 0 ? v.months / 12 : 0);
    if (!(a > 0)) return { error: 'Enter your dog\'s age.' };
    if (a > 30) return { error: 'Enter an age of 30 years or less.' };
    var size = D.chart[v.size] ? v.size : 'medium';
    var c = D.chart[size];
    function avma(x) {
      if (x >= 16) return c[16] + (x - 16) * (c[16] - c[15]);
      var i = Math.floor(x);
      return c[i] + (x - i) * (c[i + 1] - c[i]);
    }
    var hy = avma(a);
    var epi = 16 * Math.log(a) + 31;
    var sen = D.senior[size];
    var stage = a < 1 ? 'Puppy' : a < 3 ? 'Young adult' : a < sen ? 'Adult (senior from about ' + sen + ')' : 'Senior (from about ' + sen + ' for this size)';
    if (a < 1) return {
      value: 'Puppy',
      label: 'Under 1 year: the chart reaches ' + c[1] + ' human years at the first birthday',
      expr: H.num(a, 2) + ' dog years · ' + size,
      rows: [['Old ×7 rule', H.int(a * 7) + ' years'], ['At first birthday (chart)', c[1] + ' years', true]],
      hy: NaN, epi: NaN,
      sub: 'Human-year conversions are not meaningful for young puppies. The puppy age calculator tracks puppies week by week.'
    };
    return {
      value: H.int(hy) + ' years',
      label: 'Human-equivalent age (size chart)',
      expr: H.num(a, 2) + ' dog years · ' + size,
      rows: [
        ['Epigenetic formula (UCSD 2020)', H.int(epi) + ' years'],
        ['Old ×7 rule', H.int(a * 7) + ' years'],
        ['Life stage', stage, true],
        ['At next birthday (chart)', H.int(avma(a + 1)) + ' years']
      ],
      hy: hy, epi: epi,
      sub: 'The size chart is the everyday answer; the DNA formula was fitted on Labrador retrievers only.'
    };
  },
  quick: ({ r, H }) => `A 5-year-old medium-sized dog (21–50 lb) is about <strong>${r.value.replace(' years', '')} in human years</strong> on the size-based chart the AVMA uses. The 2020 UCSD epigenetic formula, 16 ln(age) + 31, puts the same dog at ${H.int(r.epi)}, and the old ×7 rule says 35. Every dog's first year counts as about 15 human years; after that, bigger dogs age faster.`,
  stepsTitle: 'How to convert dog years to human years',
  steps: [
    'Enter your dog\'s age in years and months. A rescue with no records can be aged roughly by a vet from teeth and body condition.',
    'Pick the size by adult weight, not breed name. A 60-pound mixed breed belongs in the large column. <strong>Common slip:</strong> choosing by the puppy\'s current weight instead of its expected adult weight.',
    'Read the size-chart answer first. It reflects the AVMA rule that year one ≈ 15 human years and year two ≈ 9 more, then adds about 4–7 a year depending on size.',
    'Compare with the epigenetic and ×7 figures below the result to see how much the methods disagree for your dog\'s age.'
  ],
  formulaTitle: 'What are the formulas for dog years?',
  formula: {
    expr: 'AVMA rule (medium dog): year 1 = 15, year 2 = +9, each later year ≈ +5<br>Epigenetic (Wang et al., 2020): Human age = 16 × ln(Dog age) + 31<br>Old rule: Human age = Dog age × 7',
    vars: [['ln', 'natural logarithm'], ['Dog age', 'in years; the log formula only makes sense from about 1 year'], ['size chart', 'year-by-year values for small, medium, large and giant dogs (table below)']],
    note: 'Between birthdays the calculator interpolates in a straight line, so 5½ years for a medium dog is halfway between 36 and 42: 39.'
  },
  example: `<p>Max is a 5-year-old, 40-pound border collie mix (medium).</p>
<p><strong>Size chart:</strong> 36 human years. <strong>Epigenetic:</strong> ln(5) = 1.609; 16 × 1.609 + 31 = <strong>56.8, about 57</strong>. <strong>×7 rule:</strong> 35.</p>
<p>At 10, Max would be 60 on the chart and 16 × ln(10) + 31 = 67.8 by the DNA formula. A 10-year-old Great Dane (giant) would already be 79 on the chart.</p>`,
  table: {
    title: 'Dog years to human years chart by size',
    intro: 'Human-equivalent ages from the size-based chart, with the epigenetic formula for comparison. Computed by the calculator above.',
    head: ['Dog age', 'Small (≤20 lb)', 'Medium (21–50 lb)', 'Large (51–90 lb)', 'Giant (90+ lb)', 'DNA formula'],
    rows: ({ run, H }) => Array.from({ length: 15 }, (_, i) => i + 1).map(a => [a + (a === 1 ? ' year' : ' years'), ...['small', 'medium', 'large', 'giant'].map(s => H.int(run({ years: a, months: 0, size: s }).hy)), H.int(run({ years: a, months: 0, size: 'medium' }).epi)]),
    note: 'Weight bands differ slightly between sources (some put giant at 100+ lb). At 16 years the chart reads 80 (small), 87 (medium), 99 (large) and 121 (giant).'
  },
  sections: [
    {
      h2: 'Is one dog year really seven human years?',
      html: `<p>No. The ×7 rule seems to come from comparing rough lifespans (a dog living 10–12 years, a person 70–80), but dogs don't age at a steady rate. A 1-year-old dog can already reproduce and is nearly full-grown, which is closer to a 15-year-old human than a 7-year-old. After about age 2 the pace slows, and how fast it runs depends on size.</p>
<p>So the ×7 rule <em>undercounts</em> young dogs and, for small breeds, <em>overcounts</em> old ones: a 14-year-old Chihuahua is about 72 on the chart, not 98. It is closest to the truth for large dogs between about 5 and 10.</p>`
    },
    {
      h2: 'How does the UCSD epigenetic dog age formula work?',
      html: `<p>In 2020, researchers at UC San Diego (Wang et al., <em>Cell Systems</em>) compared DNA methylation, chemical tags that build up on DNA with age, in 104 Labrador retrievers spanning a 16-year age range against the same patterns in humans. Matching the two "epigenetic clocks" gave the formula <strong>human age = 16 ln(dog age) + 31</strong>.</p>
<p>Because it is logarithmic, dogs age very fast early and then slowly: 1 year ≈ 31, 2 years ≈ 42, 4 years ≈ 53, 10 years ≈ 68 and 14 years ≈ 73. That front-loading matches biology (puberty arrives within the first year), but the formula was fitted on one breed, so it can't account for size. Treat it as a research result, not a replacement for the size chart.</p>`
    },
    {
      h2: 'Why do big dogs age faster than small dogs?',
      html: `<p>Large and giant breeds have shorter average lifespans, and the size chart reflects it. Giant dogs start a little "younger" (12 human years at age 1, against 15 for others), pass small dogs by year 3, and by age 10 are about 79 against 56 for a small dog.</p>
<p>Researchers are still working out why. Rapid growth to a large adult size is linked to earlier onset of age-related disease, which is one reason the size of a dog matters more than its breed label when you convert its age. For a mixed breed, simply use its adult weight.</p>`
    },
    {
      h2: 'When is a dog considered a senior?',
      html: `<p>The AVMA notes that small dogs are generally considered senior at about 7, while larger breeds, with shorter lifespans, are often considered senior at 5 to 6. AAHA's life stage guidelines define the senior stage as the last quarter of a dog's expected lifespan, so a long-lived small breed may not need senior care until 10 or later.</p>
<p>The calculator flags the senior stage for your dog's size. AAHA's senior checklist calls for exams at least every six months with screening blood work, because kidney disease, arthritis and dental disease become more common.</p>`
    }
  ],
  faq: [
    { q: 'How old is a 1-year-old dog in human years?', a: 'About 15 for small, medium and large dogs and about 12 for giant breeds, using the size chart. The epigenetic formula says 31.' },
    { q: 'How old is a 10-year-old dog in human years?', a: 'About 56 for a small dog, 60 for a medium dog, 66 for a large dog and 79 for a giant breed on the size chart.' },
    { q: 'How old is a 15-year-old dog in human years?', a: 'About 76 for a small dog, 83 for a medium dog and 93 for a large dog. Few giant breeds reach 15; the chart would put one at 114.' },
    { q: 'Is the dog years times 7 rule accurate?', a: 'No. It undercounts young dogs, since a 1-year-old dog is closer to 15 than 7, and overcounts older small dogs. Use a size-based chart instead.' },
    { q: 'What is the formula for dog years?', a: 'The AVMA rule for a medium dog: the first year equals 15 human years, the second adds 9, and each year after adds about 5. The 2020 epigenetic formula is human age = 16 × ln(dog age) + 31.' },
    { q: 'Which dog age method should I use?', a: 'Use the size chart for everyday purposes because it accounts for your dog\'s size. The epigenetic formula is based on Labradors only and the ×7 rule is a myth.' },
    { q: 'How do I convert my puppy\'s age in weeks?', a: 'For dogs under a year, weeks and developmental milestones matter more than human years. The puppy age calculator turns a birth date into weeks, months, vaccine timing and teething stage.' }
  ],
  related: ['puppy-age-calculator', 'puppy-weight-calculator', 'age-calculator', 'birthday-calculator'],
  sources: [
    { name: 'AVMA: Senior pets', url: 'https://www.avma.org/resources-tools/pet-owners/petcare/senior-pets' },
    { name: 'AKC: How to Calculate Dog Years to Human Years', url: 'https://www.akc.org/expert-advice/health/how-to-calculate-dog-years-to-human-years/' },
    { name: 'AAHA: 2019 Canine Life Stage Guidelines, life stage definitions', url: 'https://www.aaha.org/resources/life-stage-canine-2019/canine-life-stage-definitions/' },
    { name: 'Wang T. et al. (2020), Quantitative Translation of Dog-to-Human Aging by Conserved Remodeling of the DNA Methylome, Cell Systems', url: 'https://doi.org/10.1016/j.cels.2020.06.006' }
  ],
  disclaimer: 'Human-year equivalents are approximations for fun and planning, not a medical assessment. Ask your veterinarian about your dog\'s health at each life stage.'
};
