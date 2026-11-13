export default {
  slug: 'puppy-age-calculator',
  hub: 'everyday',
  name: 'Puppy Age Calculator',
  title: 'Puppy Age Calculator: 84 Days Old = 12 Weeks (Shots, Teeth)',
  h1: 'How Old Is My Puppy? Age in Weeks and What Comes Next',
  meta: 'A puppy born 84 days ago is 12 weeks old: in the socialization window, mid-way through DHPP shots and old enough for rabies. Enter a birth date to check yours.',
  keyword: 'how old is my puppy calculator',
  also: ['puppy age calculator', 'how many weeks old is my puppy', 'puppy age in weeks', 'puppy age in months', 'how old is my puppy'],
  updated: '2026-11-13',
  inputs: [
    { id: 'birth', label: 'Puppy\'s birth date', type: 'date', value: 'today-84', help: 'Use the date on the breeder or shelter paperwork. Unsure? See the teeth guide below.' },
    { id: 'size', label: 'Expected adult size', type: 'select', value: 'medium', options: [['small', 'Small (under 25 lb)'], ['medium', 'Medium (25–45 lb)'], ['large', 'Large (45–90 lb)'], ['giant', 'Giant (over 90 lb)']] }
  ],
  data: {
    size: {
      small: { food: '9–12 months', grown: 'about 9–12 months', fix: 'around 6 months (AAHA, under 45 lb)' },
      medium: { food: 'around 12 months', grown: 'about 12 months', fix: 'around 6 months (AAHA, under 45 lb)' },
      large: { food: '12–18 months, on large-breed puppy food until then', grown: 'about 15–18 months', fix: 'after growth stops, often 9–15 months (AAHA)' },
      giant: { food: '18–24 months, on large-breed puppy food until then', grown: 'about 18–24 months', fix: 'after growth stops, often 12+ months (AAHA)' }
    }
  },
  compute(v, H, D) {
    var b = H.parseDate(v.birth);
    if (!b) return { error: 'Enter your puppy\'s birth date.' };
    var today = H.parseDate(H.today());
    var days = H.daysBetween(b, today);
    if (days < 0) return { error: 'That birth date is in the future.' };
    if (days > 1096) return { error: 'That\'s over 3 years. For grown dogs, use the dog years calculator.' };
    var w = Math.floor(days / 7), rem = days % 7;
    var ymd = H.ymdDiff(b, today);
    var sz = D.size[v.size] || D.size.medium;
    var stage = w < 3 ? 'Newborn: eyes and ears open at about 2 weeks' : w < 8 ? 'With mother and littermates, weaning (3–8 weeks)' : w < 14 ? 'Prime socialization window (closes around 14 weeks)' : w < 26 ? 'Juvenile: teething, house training, basic cues' : (w < 52 ? 'Adolescent: growing, testing limits' : 'Young adult, still filling out');
    var vax = w < 6 ? 'First core (DHPP) shot due at 6–8 weeks' : w < 10 ? 'DHPP every 2–4 weeks; next around 10–12 weeks' : w < 14 ? 'DHPP every 2–4 weeks; next around 14–16 weeks' + (w >= 12 ? '; rabies allowed from 12 weeks' : '') : w < 16 ? 'Last DHPP dose due at 16 weeks or older; rabies at 12–16 weeks' : w < 20 ? 'Final puppy DHPP at 16+ weeks; rabies should be done' : w < 52 ? 'Puppy series done; boosters due within a year' : '1-year DHPP and rabies boosters';
    var teeth = w < 3 ? 'No teeth yet' : w < 8 ? 'Baby teeth erupting (28 in all)' : w < 12 ? 'All 28 baby teeth in' : w < 16 ? 'Baby teeth in; adult incisors start at 3–4 months' : w < 28 ? 'Teething: adult teeth replacing baby teeth' : 'All 42 adult teeth should be in';
    var monthsTxt = H.ym(ymd.y * 12 + ymd.m) + (ymd.d ? ', ' + H.plural(ymd.d, 'day') : '');
    var rows = [
      ['Exact age', H.plural(w, 'week') + ', ' + H.plural(rem, 'day'), true],
      ['In months', monthsTxt],
      ['Days old', H.int(days)],
      ['Stage', stage],
      ['Vaccines', vax],
      ['Teeth', teeth],
      ['Switch to adult food', sz.food],
      ['Done growing', sz.grown],
      ['Spay/neuter timing', sz.fix]
    ];
    return {
      value: w < 52 ? H.plural(w, 'week') : H.ym(ymd.y * 12 + ymd.m),
      label: 'Your puppy\'s age',
      expr: 'born ' + H.fmtDate(b) + ' · ' + H.int(days) + ' days',
      rows: rows,
      stage: stage, vax: vax, teeth: teeth,
      sub: w >= 52 ? 'Past the puppy year. The dog years calculator converts adult ages to human years.' : 'Schedules vary by breed, health and state law; your veterinarian sets the final plan.'
    };
  },
  quick: ({ r }) => `To find your puppy's age, count the days since birth and divide by 7. A puppy born 84 days ago is <strong>${r.value} old</strong>, about 2¾ months. At that age it is in the prime socialization window, which closes around 14 weeks, is getting a DHPP booster every 2–4 weeks until at least 16 weeks, and is old enough for a rabies shot. Adult teeth start arriving soon.`,
  stepsTitle: 'How to work out your puppy\'s age in weeks',
  steps: [
    'Find the birth date on the breeder contract, litter registration or shelter intake record. If you only know the age at adoption, subtract it from the adoption date.',
    'Count the days from birth to today and divide by 7. The whole number is the age in weeks; the remainder is extra days. 87 days is 12 weeks and 3 days.',
    'For months, count calendar months from the birth date rather than dividing weeks by 4. A month averages 4.35 weeks, so 12 weeks is about 2¾ months, not 3.',
    'Pick the expected adult size. Small and giant dogs mature on very different clocks, which changes when to switch food and when growth stops.'
  ],
  formulaTitle: 'How is puppy age calculated?',
  formula: {
    expr: 'Weeks = ⌊Days since birth ÷ 7⌋, remainder = extra days<br>Months ≈ Weeks ÷ 4.35',
    vars: [['Days since birth', 'today\'s date minus the birth date'], ['4.35', 'average weeks per month (365.25 ÷ 12 ÷ 7)']],
    note: 'Breeders and vets talk in weeks for the first four months because vaccine and socialization milestones are a week or two apart. After about 16 weeks, months are precise enough.'
  },
  example: `<p>A Labrador mix was born on Jun 2 and today is Aug 25.</p>
<p>Days old: 28 (rest of June) + 31 (July) + 25 (August) = <strong>84 days</strong>. 84 ÷ 7 = <strong>12 weeks, 0 days</strong>, or 2 months and 23 days.</p>
<p>What that means: the socialization window has about two weeks left, the second or third DHPP shot is due now or soon, and the vet can give a rabies vaccine. Adult teeth start around 3–4 months, so stock up on chew toys.</p>`,
  table: {
    title: 'What happens at each puppy age?',
    intro: 'Milestones by week from the calculator above, based on AAHA vaccine guidelines and typical development.',
    head: ['Age', '≈ Months', 'Stage', 'Vaccines', 'Teeth'],
    rows: ({ run, H }) => [4, 6, 8, 10, 12, 14, 16, 20, 26, 36, 52].map(w => {
      const r = run({ birth: H.iso(H.addDays(H.parseDate(H.today()), -w * 7)) });
      return [w + ' weeks', H.fix(w / 4.348, 1), r.stage, r.vax, r.teeth];
    }),
    note: 'DHPP = distemper, hepatitis (adenovirus), parvovirus and parainfluenza. Leptospirosis became a core vaccine in AAHA\'s 2024 update; ask your vet when to start it.'
  },
  sections: [
    {
      h2: 'How can I tell how old my puppy is without papers?',
      html: `<p>Teeth are the most reliable clue. A vet can usually narrow the age to within a few weeks by looking in the mouth.</p>
<div class="twrap"><table><thead><tr><th>What you see</th><th>Likely age</th></tr></thead><tbody>
<tr><td>Eyes closed, no teeth</td><td>Under 2 weeks</td></tr>
<tr><td>Eyes open, first tiny teeth (incisors, canines)</td><td>3–4 weeks</td></tr>
<tr><td>Full set of 28 needle-sharp baby teeth</td><td>6–8 weeks</td></tr>
<tr><td>Baby incisors loose or gaps in front</td><td>3–4 months</td></tr>
<tr><td>Adult canines coming in next to baby canines</td><td>4–6 months</td></tr>
<tr><td>All 42 white adult teeth, no tartar</td><td>6–7 months to 1 year</td></tr>
</tbody></table></div>
<p>Size helps less, because a 10-pound puppy could be a 7-week-old Labrador or a 6-month-old terrier. Once the adult teeth are in, vets estimate age from tartar, wear and body shape, which is only accurate to a year or two.</p>`
    },
    {
      h2: 'When is the puppy socialization window?',
      html: `<p>Roughly from 3 to 14 weeks. The American Veterinary Society of Animal Behavior calls the first three months of life the most important time for socialization, when puppies accept new people, animals, sounds and handling most easily. A puppy that meets the world calmly in this window is less likely to be fearful later.</p>
<p>AVSAB's position is that puppies can start well-run puppy classes as early as 7–8 weeks, provided they've had at least one set of vaccines a week or more before the first class and have been dewormed. Until the vaccine series is finished, skip dog parks and places where unknown dogs gather, but do carry your puppy to new places and invite visitors over.</p>`
    },
    {
      h2: 'What is the puppy vaccine schedule by age?',
      html: `<p>The 2022 AAHA Canine Vaccination Guidelines (updated 2024), which most U.S. vets follow, set the core schedule:</p>
<ul><li><strong>Distemper, adenovirus, parvovirus (DHPP or DAPP combo):</strong> start at 6–8 weeks and repeat every 2–4 weeks until the puppy is at least 16 weeks old. Vets may add a dose at 18–20 weeks where parvovirus risk is high.</li><li><strong>Rabies:</strong> one dose no earlier than 12 weeks, on the timeline your state law sets.</li><li><strong>Leptospirosis:</strong> core for all dogs since the 2024 update; two initial doses 2–4 weeks apart.</li><li><strong>Boosters:</strong> within a year of finishing the puppy series, then on the interval your vet recommends.</li></ul>
<p>Breed, lifestyle (boarding, hiking, daycare) and local disease risk change the non-core shots such as Bordetella and Lyme, so bring your calculated age to the vet and plan from there.</p>`
    },
    {
      h2: 'When does a puppy become an adult dog?',
      html: `<p>It depends on size. Growth-chart research from Waltham and Banfield (Salt et al., 2017) notes that very small dogs reach adult weight at 8–12 months, while larger breeds can take up to 24 months. That timing drives two decisions:</p>
<ul><li><strong>Adult food:</strong> small breeds usually switch around 9–12 months, medium around 12 months, large and giant breeds at 12–24 months after staying on a large-breed puppy formula that controls calcium and calories.</li><li><strong>Spaying and neutering:</strong> AAHA's 2019 life stage guidelines suggest about 6 months for dogs expected to weigh under 45 pounds (before the first heat for females) and waiting until growth stops, roughly 9–15 months, for larger dogs. Your vet weighs breed-specific risks.</li></ul>
<p>Once your dog is past the first birthday, the <a href="/dog-years-calculator">dog years calculator</a> translates its age into human years. To see how much growing is left, use the <a href="/puppy-weight-calculator">puppy weight calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'How many weeks old is a 3-month-old puppy?', a: 'About 13 weeks. A month averages 4.35 weeks, so 3 months is 13 weeks; counted from a birth date it can be 12 or 13 weeks depending on the months involved.' },
    { q: 'How many months old is an 8-week-old puppy?', a: 'Just under 2 months, about 1.8. Eight weeks is 56 days, and two calendar months is 59 to 62 days.' },
    { q: 'When can a puppy leave its mother?', a: 'At 8 weeks at the earliest, and many breeders of small breeds wait until 10–12 weeks. Many U.S. states make it illegal to sell puppies younger than 8 weeks.' },
    { q: 'When can my puppy go outside and meet other dogs?', a: 'Your yard and safe visits are fine right away. Puppy classes can start at 7–8 weeks with at least one vaccine given a week before; wait to visit dog parks until about two weeks after the final puppy shot at 16 weeks or older.' },
    { q: 'When do puppies stop teething?', a: 'Usually by 6–7 months, when all 42 adult teeth are in. Teething is most intense between about 3 and 6 months as the baby teeth fall out.' },
    { q: 'Should I count from the birth date or the day I brought my puppy home?', a: 'The birth date. Vaccines, socialization and growth all follow age since birth. If you only know the age at adoption, add the weeks since then.' },
    { q: 'How old is my puppy in human years?', a: 'By the AVMA rule of thumb, a dog\'s first year equals about 15 human years, so a dog nearing its first birthday is roughly a mid-teen. The dog years calculator handles exact conversions by size.' }
  ],
  related: ['dog-years-calculator', 'puppy-weight-calculator', 'days-between-dates-calculator', 'age-calculator'],
  sources: [
    { name: 'AAHA: 2022 Canine Vaccination Guidelines, core and noncore vaccines', url: 'https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/recommendations-for-core-and-noncore-canine-vaccines/' },
    { name: 'AAHA: 2019 Canine Life Stage Guidelines, spay and neuter timing', url: 'https://www.aaha.org/resources/life-stage-canine-2019/spay-and-neuter-timing/' },
    { name: 'AVSAB: Position statements (puppy socialization)', url: 'https://avsab.org/resources/position-statements/' },
    { name: 'AKC: Puppy Shots Complete Guide', url: 'https://www.akc.org/expert-advice/health/puppy-shots-complete-guide/' },
    { name: 'Salt C. et al. (2017), Growth standard charts for monitoring bodyweight in dogs of different sizes, PLoS ONE', url: 'https://doi.org/10.1371/journal.pone.0182064' }
  ],
  disclaimer: 'General guidance, not veterinary advice. Vaccine timing depends on your puppy\'s health, breed and local law; follow your veterinarian.'
};
