// Hubs. Order = order on the homepage and in the nav. Max 5 live hubs, never one for a single calculator.
// The slugs of the four live hubs are pre-pivot URLs that Google had already shown (math-calculators #5.8,
// everyday-calculators #9.6, science-calculators #4, school-calculators #46.9).
// `retired: true` groups are the Nov 24 retirement calculators: live, noindex, listed only on /retirement.
export default [
  {
    id: 'everyday', slug: 'everyday-calculators', name: 'Percentages & Everyday Maths', short: 'Percentages',
    h1: 'Percentages and everyday maths',
    title: 'Percentage & Everyday Maths Calculators (With Steps)',
    meta: 'Percentages, tips, bill splits, party food, time sums and COGS, each solved step by step with your numbers. 30% of 150 is 45: multiply 150 by 0.30.',
    intro: 'Percent of a number, tips, splitting a bill, food for a crowd, adding up hours and cost of goods sold, each worked out step by step.'
  },
  {
    id: 'school', slug: 'school-calculators', name: 'Grades & Averages', short: 'Grades',
    h1: 'Grades, test scores and averages',
    title: 'Grade & Average Calculators: Test Scores, GPA, Finals',
    meta: 'Test score percentages, weighted grades, the score you need on the final, GPA and averages, with every step shown so you can check your own work.',
    intro: 'Test scores, weighted grades, what you need on the final, GPA and averages, with every step shown.'
  },
  {
    id: 'math', slug: 'math-calculators', name: 'Exponents, Roots & Growth', short: 'Exponents',
    h1: 'Exponents, roots, growth and decay',
    title: 'Exponent, Root & Decay Calculators: 2^10 = 1,024',
    meta: 'Exponents, roots, scientific notation, slope, compound growth and half-life decay word problems, solved step by step the way a teacher would.',
    intro: 'Powers, roots, scientific notation, slope, and growth and decay word problems, solved one step at a time.'
  },
  {
    id: 'science', slug: 'science-calculators', name: 'Rates & Science', short: 'Rates',
    h1: 'Rates and science calculators',
    title: 'Speed, Efficiency & pH Calculators (With Steps)',
    meta: 'Speed, distance and time, energy efficiency, pH, damage per second and charging cost: rate and unit problems solved step by step with units shown.',
    intro: 'Speed, efficiency, pH and other rate and unit problems, with the units carried through every step.'
  },
  { id: 'income', retired: true, slug: 'retirement', name: 'Retirement income & withdrawals', short: 'Income' },
  { id: 'planning', retired: true, slug: 'retirement', name: 'Retirement saving & planning', short: 'Planning' },
  { id: 'rules', retired: true, slug: 'retirement', name: 'Social Security, taxes & IRS rules', short: 'Rules' }
];
