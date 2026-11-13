export default {
  slug: 'puppy-weight-calculator',
  hub: 'everyday',
  name: 'Puppy Weight Calculator',
  title: 'Puppy Weight Calculator: 26 lb at 16 Weeks → About 65 lb Adult',
  h1: 'How Big Will My Puppy Get? Adult Weight Estimate by Size Class',
  meta: 'A large-breed puppy weighing 26 lb at 16 weeks is about 40% grown, so expect roughly 65 lb as an adult. Enter weight, age and size class for your estimate.',
  keyword: 'how big will my puppy get calculator',
  also: ['how big my puppy will get calculator', 'how big will my puppy be calculator', 'how big will my dog get calculator', 'how big will my dog be calculator', 'how much will my dog weigh calculator', 'how big will my puppy get calculator by breed', 'puppy weight calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'weight', label: 'Puppy\'s weight today', type: 'number', value: 26, suffix: 'lb' },
    { id: 'age', label: 'Age', type: 'number', value: 16, suffix: 'weeks', help: 'Between 6 and 104 weeks. Not sure? Use the puppy age calculator.' },
    { id: 'size', label: 'Breed size class (adult weight)', type: 'select', value: 'large', options: [['toy', 'Toy (under 12 lb), e.g. Chihuahua, Yorkie'], ['small', 'Small (12–25 lb), e.g. Shih Tzu, Pug'], ['medium', 'Medium (25–50 lb), e.g. Border Collie, Beagle'], ['large', 'Large (50–90 lb), e.g. Labrador, Golden'], ['giant', 'Giant (over 90 lb), e.g. Great Dane, Mastiff']], wide: true }
  ],
  data: {
    weeks: [6, 8, 10, 12, 14, 16, 20, 26, 36, 44, 52, 65, 78, 104],
    frac: {
      toy: [0.30, 0.38, 0.45, 0.52, 0.58, 0.64, 0.74, 0.86, 0.96, 0.99, 1, 1, 1, 1],
      small: [0.19, 0.25, 0.31, 0.37, 0.43, 0.49, 0.60, 0.74, 0.89, 0.96, 0.99, 1, 1, 1],
      medium: [0.15, 0.20, 0.25, 0.31, 0.37, 0.42, 0.53, 0.70, 0.86, 0.93, 0.97, 1, 1, 1],
      large: [0.13, 0.18, 0.23, 0.28, 0.34, 0.40, 0.51, 0.66, 0.81, 0.89, 0.94, 0.98, 1, 1],
      giant: [0.10, 0.13, 0.17, 0.21, 0.25, 0.29, 0.39, 0.54, 0.71, 0.81, 0.87, 0.94, 0.98, 1]
    },
    range: { toy: [0, 12], small: [12, 25], medium: [25, 50], large: [50, 90], giant: [90, 250] },
    done: { toy: 'about 9–10 months', small: 'about 10–12 months', medium: 'about 12–15 months', large: 'about 15–18 months', giant: 'about 18–24 months' }
  },
  compute(v, H, D) {
    if (!(v.weight > 0)) return { error: 'Enter your puppy\'s current weight.' };
    if (!(v.age >= 6) || v.age > 104) return { error: 'Enter an age between 6 and 104 weeks.' };
    var size = D.frac[v.size] ? v.size : 'medium';
    var W = D.weeks, F = D.frac[size];
    function frac(w) {
      if (w <= W[0]) return F[0];
      for (var i = 1; i < W.length; i++) {
        if (w <= W[i]) return F[i - 1] + (w - W[i - 1]) / (W[i] - W[i - 1]) * (F[i] - F[i - 1]);
      }
      return 1;
    }
    var lb = function (x) { return H.num(x, x < 20 ? 1 : 0) + ' lb'; };
    var f = frac(v.age);
    var est = v.weight / f;
    var rows = [
      ['Likely range (±10%)', H.num(est * 0.9, est < 20 ? 1 : 0) + '–' + lb(est * 1.1), true],
      ['Share of adult weight now', H.pct(f * 100, 0)]
    ];
    if (v.age < 26) rows.push(['Expected at 6 months', lb(est * frac(26))]);
    if (v.age < 52) rows.push(['Expected at 1 year', lb(est * frac(52))]);
    rows.push(['Done growing', D.done[size]]);
    rows.push(['Adult weight in kg', H.fix(est * 0.45359237, 1) + ' kg']);
    var rg = D.range[size], sub;
    if (est > rg[1] * 1.1) sub = 'That estimate is above the usual range for this size class. If the parents are bigger, try the next class up.';
    else if (est < rg[0] * 0.9) sub = 'That estimate is below the usual range for this size class. If the parents are smaller, try the next class down.';
    else sub = 'Parents\' adult weights are the best reality check. Weigh weekly and re-run the estimate; it tightens as your puppy gets older.';
    return {
      value: lb(est),
      label: 'Estimated adult weight',
      expr: H.num(v.weight, 1) + ' lb ÷ ' + H.pct(f * 100, 0) + ' grown',
      rows: rows,
      mult: 1 / f,
      sub: sub
    };
  },
  quick: ({ r }) => `To estimate how big your puppy will get, divide its current weight by the share of adult weight it has reached for its age and size class. A large-breed puppy weighing 26 lb at 16 weeks is about 40% grown, so <strong>26 ÷ 0.40 ≈ ${r.value}</strong> as an adult, likely between 59 and 72 lb. Estimates vary by breed, sex and the parents' size.`,
  stepsTitle: 'How to estimate your puppy\'s adult weight',
  steps: [
    'Weigh your puppy. For small puppies, weigh yourself holding the puppy and subtract your own weight, or use a kitchen or baby scale.',
    'Enter the age in weeks. Being a week or two off matters a lot before 4 months, when puppies can gain 5–10% of their adult weight in a fortnight.',
    'Pick the size class by expected <strong>adult</strong> weight. For a purebred, use the breed standard; for a mixed breed, use the parents\' weights or a DNA test\'s prediction. This choice moves the answer more than anything else.',
    'Read the estimate and the ±10% range, then compare with the parents. Re-check every few weeks; predictions made after 4–5 months are much tighter than those at 8 weeks.'
  ],
  formulaTitle: 'What formula does the puppy weight calculator use?',
  formula: {
    expr: 'Adult weight ≈ Current weight ÷ Fraction grown(age, size class)',
    vars: [['Current weight', 'today\'s weight in pounds'], ['Fraction grown', 'typical share of adult weight reached at this age for the size class, interpolated from the growth table below']],
    note: 'The growth fractions are approximations built from typical growth patterns for each size class; they are not taken from any one breed\'s official chart. Published research (Salt et al., 2017, using Banfield records) confirms the key point: small dogs finish growing in 8–12 months while large breeds can take up to 24.'
  },
  example: `<p>A 16-week-old Labrador retriever (large class) weighs 26 lb.</p>
<p>At 16 weeks a large-breed puppy is about 40% of its adult weight. Adult weight ≈ 26 ÷ 0.40 = <strong>65 lb</strong>, with a likely range of 59–72 lb, which sits right inside the Labrador breed standard of 55–80 lb.</p>
<p>Expected milestones on the same curve: about 43 lb at 6 months and 61 lb at 1 year, then filling out until 15–18 months.</p>`,
  table: {
    title: 'How much bigger will my puppy get?',
    intro: 'Multiply your puppy\'s current weight by the factor for its age and size class to estimate adult weight. Computed by the calculator above.',
    head: ['Age', 'Toy', 'Small', 'Medium', 'Large', 'Giant'],
    rows: ({ run, H }) => [8, 10, 12, 14, 16, 20, 26, 36, 52].map(w => [w + ' weeks', ...['toy', 'small', 'medium', 'large', 'giant'].map(s => '×' + H.fix(run({ weight: 10, age: w, size: s }).mult, 1))]),
    note: 'Example: a 12-week-old medium puppy at 11 lb × 3.2 ≈ 35 lb. Toy breeds are mostly grown by 6 months; giant breeds are only about half grown then.'
  },
  sections: [
    {
      h2: 'Do the puppy weight rules of thumb work?',
      html: `<p>The popular shortcuts each work for one size of dog and miss for others. Here is how they do on the 26-lb, 16-week Labrador above (calculator estimate 65 lb):</p>
<ul><li><strong>"Double the weight at 4 months":</strong> 26 × 2 = 52 lb. Fine for small and medium dogs, who are about half grown at 4 months, but too low for large and giant breeds, who are only 30–40% grown.</li><li><strong>"Weekly gain × 52":</strong> 26 ÷ 16 × 52 = 85 lb. This assumes steady growth all year, so it overshoots for large breeds that keep gaining until 18 months at a slowing rate.</li><li><strong>"Triple the weight at 12 weeks"</strong> or <strong>"quadruple at 8 weeks"</strong>: rough fits for small breeds, far off for giants.</li></ul>
<p>Using a size-specific growth curve, as this calculator does, avoids the worst of these errors.</p>`
    },
    {
      h2: 'Do paw size and the parents predict how big a puppy will get?',
      html: `<p>The parents are the single best predictor. A puppy usually ends up close to the average of its mother and father, with males often at the upper end of the breed range and females at the lower end. If you can see or weigh the parents, use that figure to check the calculator.</p>
<p>Big paws are a weak clue. Puppy paws can look oversized at 3–4 months because feet grow ahead of the body, but paw size varies by breed and doesn't track adult weight well. For mixed breeds, a canine DNA test's breed breakdown can help you pick the right size class.</p>`
    },
    {
      h2: 'When do puppies stop growing?',
      html: `<p>Small breeds reach adult size first. The growth-standard research from Waltham and Banfield (Salt et al., 2017) cites very small dogs maturing at 8–12 months and larger breeds taking up to 24 months to reach adult weight. The calculator uses these finishing ages: toy about 9–10 months, small 10–12, medium 12–15, large 15–18 and giant 18–24.</p>
<p>Height usually stops before weight: a large dog may reach its full height around a year and then fill out its chest and muscle for several more months. That's why giant breeds look lanky as adolescents.</p>`
    },
    {
      h2: 'Is my puppy a healthy weight?',
      html: `<p>Judge by body shape, not by whether the puppy hits a predicted number. The WSAVA body condition score runs from 1 to 9, with 4–5 ideal: ribs easy to feel under a thin fat layer, a visible waist from above and a tummy tuck from the side.</p>
<p>For large and giant breeds, slow and steady growth matters. Feeding to make a puppy bigger faster, or adding calcium supplements to a complete puppy food, raises the risk of skeletal problems. Feed a diet formulated for large-breed puppies, adjust portions to body condition, and let your vet track the growth curve at each visit.</p>`
    }
  ],
  faq: [
    { q: 'How big will my puppy get?', a: 'Divide its current weight by the fraction of adult weight it has reached. A 16-week-old large-breed puppy is about 40% grown, so 26 lb today suggests about 65 lb as an adult.' },
    { q: 'How big will a 10-pound 8-week-old puppy get?', a: 'About 50 lb if it is a medium breed (20% grown at 8 weeks) or about 56 lb if it is a large breed (18% grown). At 8 weeks the estimate is rough; check again at 14–16 weeks.' },
    { q: 'At what age is a puppy half its adult weight?', a: 'On these growth curves, about 11 weeks for toy breeds, 16–17 weeks for small, 19 weeks for medium, 20 weeks for large and about 24 weeks for giant breeds.' },
    { q: 'How much will my puppy weigh at 6 months?', a: 'Roughly 86% of adult weight for toy breeds, 74% for small, 70% for medium, 66% for large and 54% for giant breeds. The calculator shows the projected 6-month weight for your puppy.' },
    { q: 'Will a male puppy be bigger than a female?', a: 'Often, yes. Many breed standards list a heavier range for males. If you know your breed\'s range, expect males toward the top and females toward the bottom.' },
    { q: 'Does the calculator work for mixed breeds?', a: 'Yes, as long as you choose the size class by expected adult weight. If you\'re unsure, run it for two classes and see which result matches the parents better.' },
    { q: 'Can I predict my puppy\'s adult height?', a: 'Not reliably from weight alone. Most dogs reach full height a few months before they reach full weight, and leg length varies widely between breeds of the same weight.' }
  ],
  related: ['puppy-age-calculator', 'dog-years-calculator', 'unit-price-calculator'],
  sources: [
    { name: 'Salt C. et al. (2017), Growth standard charts for monitoring bodyweight in dogs of different sizes, PLoS ONE', url: 'https://doi.org/10.1371/journal.pone.0182064' },
    { name: 'WSAVA: Body Condition Score (dog)', url: 'https://wsava.org/wp-content/uploads/2020/01/Body-Condition-Score-Dog.pdf' },
    { name: 'WSAVA: Global Nutrition Guidelines', url: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/' },
    { name: 'AKC: Dog breeds and breed standards', url: 'https://www.akc.org/dog-breeds/' }
  ],
  disclaimer: 'An estimate, not a guarantee: adult size varies by breed, sex, genetics and nutrition. Ask your veterinarian to track your puppy\'s growth.'
};
