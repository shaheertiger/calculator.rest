export default {
  slug: 'car-depreciation-calculator',
  hub: 'loans',
  name: 'Car Depreciation Calculator',
  title: 'Car Depreciation Calculator: $40K Car Is Worth $16,704 at 5 Years',
  h1: 'Car Depreciation Calculator: What Your Car Is Worth Year by Year',
  meta: 'At 20% the first year and 15% a year after, a $40,000 new car is worth about $16,704 after 5 years, a 58% loss. Estimate any car\'s value, loss per year and equity.',
  keyword: 'how to calculate depreciation car',
  also: ['car depreciation calculator', 'how to calculate the salvage value of a vehicle', 'how to calculate car equity', 'vehicle depreciation calculator', 'how much is my car worth after 5 years'],
  updated: '2026-11-13',
  inputs: [
    { id: 'price', label: 'Purchase price', type: 'number', value: 40000, prefix: '$' },
    { id: 'bought', label: 'Bought the car', type: 'select', value: 'new', options: [['new', 'New'], ['used', 'Used']] },
    { id: 'years', label: 'Years of ownership', type: 'number', value: 5, suffix: 'years' },
    { id: 'first', label: 'First-year depreciation', type: 'number', value: 20, suffix: '%', showIf: { bought: ['new'] } },
    { id: 'later', label: 'Depreciation in later years', type: 'number', value: 15, suffix: '% a year' },
    { id: 'owed', label: 'Loan balance (optional)', type: 'number', value: '', prefix: '$', placeholder: 'for equity', help: 'Your loan payoff amount, to see whether you have equity or are upside down.' }
  ],
  compute(v, H) {
    if (!(v.price > 0)) return { error: 'Enter what you paid for the car.' };
    if (!(v.years > 0) || v.years > 40) return { error: 'Enter how many years you have owned it (up to 40).' };
    var isNew = v.bought !== 'used';
    var f = isNew ? (v.first >= 0 && v.first < 100 ? v.first / 100 : NaN) : null;
    var s = v.later >= 0 && v.later < 100 ? v.later / 100 : NaN;
    if ((isNew && !(f >= 0)) || !(s >= 0)) return { error: 'Enter depreciation rates between 0% and 99%.' };
    function valAt(y) {
      if (!isNew) return v.price * Math.pow(1 - s, y);
      if (y <= 1) return v.price * Math.pow(1 - f, y);
      return v.price * (1 - f) * Math.pow(1 - s, y - 1);
    }
    var val = valAt(v.years);
    var lost = v.price - val;
    var rows = [
      ['Total depreciation', H.money0(lost), true],
      ['Share of value lost', H.pct(lost / v.price * 100, 1)],
      ['Average loss per year', H.money0(lost / v.years)],
      ['Average loss per month', H.money0(lost / v.years / 12)],
      ['Estimated value one year later', H.money0(valAt(v.years + 1))]
    ];
    if (v.owed >= 0) {
      var eq = val - v.owed;
      rows.push([eq >= 0 ? 'Equity (value − loan)' : 'Negative equity (upside down)', H.money0(Math.abs(eq)), true]);
    }
    var tr = [], prev = v.price, last = Math.max(5, Math.ceil(v.years));
    for (var y = 1; y <= Math.min(last, 15); y++) {
      var x = valAt(y);
      tr.push(['Year ' + y, H.money0(x), H.money0(prev - x), H.pct((1 - x / v.price) * 100, 1)]);
      prev = x;
    }
    return {
      value: H.money0(val),
      label: 'Estimated value after ' + H.plural(v.years, 'year'),
      expr: isNew ? H.money0(v.price) + ' × ' + H.num(1 - f, 2) + (v.years > 1 ? ' × ' + H.num(1 - s, 2) + '^' + H.num(v.years - 1, 2) : '') : H.money0(v.price) + ' × ' + H.num(1 - s, 2) + '^' + H.num(v.years, 2),
      rows: rows,
      sub: 'An estimate from average depreciation rates. Mileage, condition, accident history and the model\'s demand can move the real value a lot either way.',
      table: { head: ['End of', 'Value', 'Lost that year', 'Total lost'], rows: tr, caption: 'Year-by-year value' }
    };
  },
  quick: ({ r }) => `To calculate car depreciation, apply a yearly percentage loss to the car's value. A commonly used estimate is about 20% in the first year and 15% a year after that. A <strong>$40,000</strong> new car is then worth 40,000 × 0.80 × 0.85<sup>4</sup> = <strong>${r.value}</strong> after five years, a $23,296 (58%) loss, or about $388 a month.`,
  stepsTitle: 'How to estimate how much your car has depreciated',
  steps: [
    'Enter the price you paid, including options but not tax, registration or loan costs.',
    'Choose whether you bought it new or used. A used car has already taken the steep first-year drop, so the calculator applies the later-year rate from day one.',
    'Enter the years you have owned it (decimals are fine: 2.5 for two and a half years).',
    'Adjust the rates if you know your model holds value better or worse than average. Treating depreciation as a flat dollar amount each year instead of a percentage of the remaining value is the most common mistake: cars lose the most dollars early.',
    'Optionally enter your loan payoff to see your equity.'
  ],
  formulaTitle: 'What is the formula for car depreciation?',
  formula: {
    expr: 'New car: V = P × (1 − f) × (1 − s)<sup>t − 1</sup><br>Used car: V = P × (1 − s)<sup>t</sup><br>Depreciation = P − V',
    vars: [['V', 'estimated value after t years'], ['P', 'purchase price'], ['f', 'first-year depreciation rate'], ['s', 'yearly depreciation rate after year one'], ['t', 'years owned']],
    note: 'This is the declining-balance method: each year the car loses a percentage of what it is still worth. Business owners writing off a vehicle on a tax return use IRS rules instead (MACRS, with annual dollar limits for passenger cars), which are not the same as market value.'
  },
  example: `<p>A car bought new for $32,000 and kept 3 years, using 20% for year one and 15% a year after.</p>
<p>After year 1: 32,000 × 0.80 = <strong>$25,600</strong> (lost $6,400).</p>
<p>After year 2: 25,600 × 0.85 = <strong>$21,760</strong> (lost $3,840).</p>
<p>After year 3: 21,760 × 0.85 = <strong>$18,496</strong> (lost $3,264).</p>
<p>Total depreciation = $13,504, or 42% of the price. If $14,000 is still owed on the loan, equity is $18,496 − $14,000 = <strong>$4,496</strong>.</p>`,
  table: {
    title: 'How much is a $40,000 car worth after each year?',
    intro: 'Estimated value of a $40,000 new car by age under slow, typical and fast depreciation profiles (first-year rate / later-year rate).',
    head: ['Age', 'Slow (15% / 10%)', 'Typical (20% / 15%)', 'Fast (25% / 20%)'],
    rows: ({ run }) => [1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(y => ['Year ' + y, ...[[15, 10], [20, 15], [25, 20]].map(p => run({ price: 40000, bought: 'new', years: y, first: p[0], later: p[1], owed: NaN }).value)]),
    note: 'These are modeled curves, not price-guide data. Check a current pricing guide or get dealer offers before selling, trading in or settling an insurance claim.'
  },
  sections: [
    {
      h2: 'How much does a car depreciate per year and per mile?',
      html: `<p>In dollars, the first year is the worst. On the typical curve a $40,000 car loses $8,000 in year one, $4,800 in year two and $4,080 in year three; by year ten it is losing under $1,300 a year. As a share of what is left, the rate settles into a steady percentage, which is why the curve flattens.</p>
<p>Per mile, divide the dollar loss by the miles driven. The $23,296 lost over five years and 60,000 miles is about <strong>39¢ a mile</strong>, often more than fuel. Higher-than-average mileage pushes value down faster; low mileage holds it up. The IRS standard mileage rate for business driving includes an allowance for depreciation for the same reason.</p>`
    },
    {
      h2: 'How do you calculate car equity?',
      html: `<p>Equity = the car's current market value − the loan payoff amount. If the result is negative, you are "upside down": selling or trading the car would not clear the loan. Using the default car, a $16,704 value against an $18,000 payoff is about $1,296 of negative equity.</p>
<p>Depreciation is fastest early while the loan balance falls slowly, so long loans and small down payments are the usual cause. The CFPB explains that lenders measure this as the loan-to-value ratio, and that negative equity rolled into a new car loan raises what you owe. If you plan to trade in, see how a payoff above the trade-in value changes your next loan in the <a href="/car-loan-calculator">car loan calculator</a>.</p>`
    },
    {
      h2: 'How do you calculate the salvage value of a vehicle?',
      html: `<p>"Salvage value" has two meanings. In <strong>accounting</strong>, it is the value you expect the vehicle to have at the end of its useful life. With straight-line depreciation, yearly depreciation = (cost − salvage value) ÷ useful life: a $40,000 work truck expected to be worth $8,000 after 8 years depreciates $4,000 a year. The <a href="/depreciation-calculator">depreciation calculator</a> handles straight-line and other book methods.</p>
<p>In <strong>insurance</strong>, it is what a damaged, totaled vehicle is worth to a salvage buyer. The insurer pays the car's actual cash value before the loss; if you keep the wreck, the insurer typically deducts its salvage value from the payout. That amount varies with the damage and local salvage prices, so ask the adjuster for the figure.</p>`
    },
    {
      h2: 'Can you deduct car depreciation on your taxes?',
      html: `<p>Only for the business-use share of a vehicle. You either take the IRS standard mileage rate, which already includes depreciation, or deduct actual expenses including depreciation under MACRS, where cars are 5-year property and passenger vehicles are subject to annual dollar caps. If business use is 50% or less, you must use the slower straight-line alternative system. Personal-use depreciation is never deductible, and losing money when you sell a personal car is not a deductible loss.</p>
<p>IRS Publication 946 covers depreciation methods, and Publication 463 covers the car rules, including the yearly limits.</p>`
    }
  ],
  faq: [
    { q: 'How much is a 3-year-old $35,000 car worth?', a: 'About $20,230 on the typical curve: 35,000 × 0.80 × 0.85 × 0.85. That is a loss of $14,770, or 42%.' },
    { q: 'When does a car depreciate the most?', a: 'In the first year, and especially the moment it becomes a used car. On the typical curve a new car loses about a fifth of its value in year one, as much as the next two years combined in percentage terms.' },
    { q: 'What percentage does a car depreciate per year?', a: 'A common estimate is about 20% in year one and roughly 15% a year after that, so a typical new car keeps a bit over 40% of its value at five years. Actual rates vary widely by model, mileage and market conditions.' },
    { q: 'Does buying used avoid depreciation?', a: 'It avoids the steepest part. A two- or three-year-old car has already lost roughly a third or more of its value, so you pay for less depreciation, though the car keeps losing value each year you own it.' },
    { q: 'Which cars hold their value best?', a: 'Vehicles in steady demand with strong reliability reputations, such as many pickups and popular SUVs, tend to depreciate more slowly. Luxury cars with high running costs often depreciate faster. Use slower or faster rates in the calculator to compare.' },
    { q: 'How can I slow my car\'s depreciation?', a: 'Keep mileage reasonable, follow the maintenance schedule and keep records, fix damage properly, avoid unusual modifications and keep the interior clean. A documented service history supports a higher resale price.' }
  ],
  related: ['car-loan-calculator', 'car-affordability-calculator', 'lease-calculator', 'depreciation-calculator'],
  sources: [
    { name: 'IRS: Publication 946, How to Depreciate Property', url: 'https://www.irs.gov/publications/p946' },
    { name: 'IRS: Publication 463, Travel, Gift, and Car Expenses', url: 'https://www.irs.gov/publications/p463' },
    { name: 'IRS: Standard mileage rates', url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates' },
    { name: 'CFPB: What is a loan-to-value ratio in an auto loan?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-to-value-ratio-in-an-auto-loan-en-769/' }
  ],
  disclaimer: 'Depreciation rates are averages for estimating, not an appraisal of any specific vehicle.'
};
