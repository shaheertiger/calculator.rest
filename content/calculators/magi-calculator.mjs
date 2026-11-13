export default {
  slug: 'magi-calculator',
  hub: 'investing',
  name: 'MAGI Calculator for Roth IRA',
  title: 'MAGI Calculator for Roth IRA 2026: Phase-Out $153K–$168K',
  h1: 'Roth IRA MAGI Calculator: Modified AGI and Your 2026 Contribution Limit',
  meta: 'An AGI of $158,000 plus a $2,500 student loan interest deduction is a $160,500 Roth MAGI, so a single filer can put in $3,750 for 2026 instead of $7,500.',
  keyword: 'how to calculate magi for roth ira',
  also: ['how to calculate your magi', 'how to calculate magi from agi', 'how to calculate the agi', 'how is magi calculated for irmaa', 'how is magi calculated for medicare premiums', 'roth ira income limit 2026'],
  updated: '2026-11-13',
  inputs: [
    { id: 'status', label: 'Filing status', type: 'select', value: 'single', options: [['single', 'Single, head of household, or married filing separately and lived apart all year'], ['mfj', 'Married filing jointly or qualifying surviving spouse'], ['mfs', 'Married filing separately, lived with spouse']], wide: true },
    { id: 'agi', label: 'Adjusted gross income (Form 1040)', type: 'number', value: 158000, prefix: '$' },
    { id: 'conv', label: 'Roth conversion or rollover income included in AGI', type: 'number', value: 0, prefix: '$', help: 'Subtracted: converting to a Roth does not count against you.' },
    { id: 'ira', label: 'Traditional IRA deduction', type: 'number', value: 0, prefix: '$', help: 'Schedule 1. Added back.' },
    { id: 'sli', label: 'Student loan interest deduction', type: 'number', value: 2500, prefix: '$', help: 'Schedule 1. Added back.' },
    { id: 'feie', label: 'Foreign earned income and housing exclusion or deduction', type: 'number', value: 0, prefix: '$', help: 'Form 2555. Added back.' },
    { id: 'other', label: 'Excluded savings bond interest and employer adoption benefits', type: 'number', value: 0, prefix: '$', help: 'Forms 8815 and 8839. Added back.' },
    { id: 'comp', label: 'Taxable compensation (wages, self-employment income)', type: 'number', value: 150000, prefix: '$', help: 'You cannot contribute more than you earned. A spouse\'s pay counts if filing jointly.' },
    { id: 'age50', label: 'Age 50 or older by Dec 31, 2026', type: 'checkbox', value: false },
    { id: 'trad', label: 'Already contributed to traditional IRAs for 2026', type: 'number', value: 0, prefix: '$' }
  ],
  data: { lo: { single: 153000, mfj: 242000, mfs: 0 }, span: { single: 15000, mfj: 10000, mfs: 10000 }, limit: 7500, catchup: 1100 },
  compute(v, H, D) {
    if (!(v.agi >= 0)) return { error: 'Enter your adjusted gross income.' };
    function z(x) { return x > 0 ? x : 0; }
    var addbacks = z(v.ira) + z(v.sli) + z(v.feie) + z(v.other);
    var magi = v.agi - z(v.conv) + addbacks;
    var lo = D.lo[v.status], span = D.span[v.status];
    if (lo === undefined) { lo = D.lo.single; span = D.span.single; }
    var hi = lo + span;
    var cap = D.limit + (v.age50 ? D.catchup : 0);
    var comp = v.comp >= 0 ? v.comp : cap;
    var base = Math.min(cap, comp);
    var allowed, ratio = 0;
    if (magi <= lo) allowed = base;
    else if (magi >= hi) allowed = 0;
    else {
      ratio = Math.round((magi - lo) / span * 1000) / 1000;
      allowed = base - base * ratio;
      allowed = Math.ceil(allowed / 10 - 1e-9) * 10;
      if (allowed > 0 && allowed < 200) allowed = 200;
    }
    allowed = Math.max(0, Math.min(allowed, base - z(v.trad)));
    var rows = [
      ['Most you can put in a Roth IRA for 2026', H.money(allowed, 0), true],
      ['2026 phase-out range', H.money(lo, 0) + ' – ' + H.money(hi, 0)],
      ['Add-backs to AGI', H.money(addbacks, 0)],
      ['Conversion income removed', H.money(z(v.conv), 0)],
      ['Limit before the income test', H.money(base, 0)]
    ];
    if (ratio > 0) rows.push(['Share of the range used', H.pct(ratio * 100, 1)]);
    var sub = magi <= lo ? 'Below the phase-out: you can make the full contribution.'
      : magi >= hi ? 'At or above ' + H.money(hi, 0) + ': no direct Roth IRA contribution for 2026. A backdoor Roth (nondeductible IRA, then convert) is the usual workaround.'
      : 'Inside the phase-out: your limit is cut in proportion to how far MAGI is into the range, rounded up to the next $10.';
    return {
      value: H.money(magi, 0),
      label: 'MAGI for Roth IRA purposes',
      expr: H.money(v.agi, 0) + (z(v.conv) ? ' − ' + H.money(z(v.conv), 0) : '') + ' + ' + H.money(addbacks, 0) + ' add-backs',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r, v, run }) => `To calculate MAGI for a Roth IRA, start with your AGI, subtract any Roth conversion income, and add back the traditional IRA deduction, student loan interest deduction, foreign income exclusions and certain excluded interest. An AGI of $158,000 plus $2,500 of student loan interest is a <strong>${r.value}</strong> MAGI. That is halfway through the 2026 single range of $153,000–$168,000, so the limit is <strong>${run().rows[0][1]}</strong>.`,
  stepsTitle: 'How to calculate MAGI for a Roth IRA (IRS Worksheet 2-1)',
  steps: [
    'Find your AGI on Form 1040. It is gross income minus the adjustments on Schedule 1, Part II.',
    'Subtract income from converting a traditional IRA to a Roth IRA, or rolling a 401(k) into a Roth IRA. This is the step people get wrong: conversions do not count for Roth eligibility, even though they raise your AGI.',
    'Add back your traditional IRA deduction and student loan interest deduction from Schedule 1.',
    'Add back any foreign earned income exclusion, foreign housing exclusion or deduction (Form 2555), excludable savings bond interest (Form 8815) and excluded employer adoption benefits (Form 8839).',
    'Compare the result with the 2026 phase-out: $153,000–$168,000 single, $242,000–$252,000 joint, $0–$10,000 married filing separately if you lived together. Inside the range, the calculator applies Worksheet 2-2 to find your reduced limit.'
  ],
  formulaTitle: 'What is the Roth IRA MAGI formula?',
  formula: {
    expr: 'MAGI = AGI − Roth conversion income + IRA deduction + student loan interest deduction + foreign exclusions + excluded bond interest + excluded adoption benefits<br>Reduced limit = Limit × (1 − (MAGI − range start) ÷ range width), rounded up to $10, minimum $200',
    vars: [['AGI', 'adjusted gross income from Form 1040'], ['Limit', '$7,500 for 2026 ($8,600 at 50+), or your taxable compensation if lower'], ['range start', '$153,000 single, $242,000 joint, $0 married filing separately'], ['range width', '$15,000 single, $10,000 joint or married filing separately']]
  },
  example: `<p>Priya is single and 38. Her 2026 AGI is $158,000 and she deducted $2,500 of student loan interest. She converted nothing and has no foreign income.</p>
<p>MAGI = $158,000 + $2,500 = <strong>$160,500</strong>.</p>
<p>She is $160,500 − $153,000 = $7,500 into the $15,000-wide range, which is 0.500 of the way. Reduction: $7,500 × 0.500 = $3,750. Her limit is $7,500 − $3,750 = <strong>$3,750</strong>, already a multiple of $10.</p>
<p>If she raised her pre-tax 401(k) deferrals by $8,000, AGI would fall to $150,000, MAGI to $152,500, and she could contribute the full $7,500.</p>`,
  table: {
    title: 'How much can you contribute to a Roth IRA at each income in 2026?',
    intro: 'Maximum contribution at points through the phase-out, assuming earned income of at least the limit and no traditional IRA contributions.',
    head: ['Single MAGI', 'Single limit', 'Joint MAGI', 'Joint limit', 'Joint limit, 50+'],
    rows: ({ run, H }) => [0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 0.98, 1].map(f => {
      const base = { conv: 0, ira: 0, sli: 0, feie: 0, other: 0, trad: 0, comp: 500000 };
      const s = 153000 + 15000 * f, j = 242000 + 10000 * f;
      return [H.money(s, 0), run({ ...base, status: 'single', agi: s, age50: false }).rows[0][1], H.money(j, 0), run({ ...base, status: 'mfj', agi: j, age50: false }).rows[0][1], run({ ...base, status: 'mfj', agi: j, age50: true }).rows[0][1]];
    }),
    note: 'Near the top of the range the IRS rounds up to a $200 minimum, which is why $167,700 single still allows $200. At $168,000 single or $252,000 joint the limit is zero.'
  },
  sections: [
    {
      h2: 'How do you calculate AGI before you get to MAGI?',
      html: `<p>Adjusted gross income is your total income minus "above-the-line" adjustments. Total income includes wages (after pre-tax 401(k), 403(b), HSA payroll and health premium deductions), interest, dividends, capital gains, business income, IRA and pension distributions, the taxable part of Social Security, rental income and unemployment.</p>
<p>The adjustments on Schedule 1, Part II include deductible IRA contributions, student loan interest, HSA contributions made outside payroll, half of self-employment tax, self-employed health insurance, SEP and solo 401(k) contributions, educator expenses and alimony under pre-2019 divorce agreements.</p>
<p>Example: $150,000 of wages plus $10,500 of interest and capital gains is $160,500 total income. Subtract a $2,500 student loan interest deduction and AGI is $158,000. The standard or itemized deduction comes <em>after</em> AGI, so it never lowers MAGI.</p>`
    },
    {
      h2: 'Is MAGI calculated the same way for IRMAA and Medicare premiums?',
      html: `<p>No. There is no single MAGI; each program defines its own.</p>
<ul><li><strong>Roth IRA:</strong> AGI minus conversion income plus the add-backs above.</li>
<li><strong>Medicare IRMAA:</strong> AGI plus tax-exempt interest. Social Security uses your tax return from two years earlier, so 2026 Part B and Part D premiums are based on 2024 income. The surcharge starts above $109,000 single or $218,000 joint, where the standard 2026 Part B premium of $202.90 rises. Roth conversions <em>do</em> count here.</li>
<li><strong>ACA marketplace subsidies:</strong> AGI plus nontaxable Social Security benefits, tax-exempt interest and excluded foreign income.</li>
<li><strong>Traditional IRA deduction:</strong> similar to the Roth version but without subtracting conversions; the 2026 range for a single filer covered by a workplace plan is $81,000–$91,000.</li></ul>
<p>Because a Roth conversion raises IRMAA MAGI two years later, people 63 and older often size conversions to stay below an IRMAA tier.</p>`
    },
    {
      h2: 'How can you lower MAGI to qualify for a Roth IRA?',
      html: `<p>Anything that lowers AGI without being added back works:</p>
<ul><li>Raise pre-tax 401(k) or 403(b) deferrals (up to $24,500 in 2026). See the <a href="/401k-contribution-calculator">401(k) paycheck calculator</a>.</li>
<li>Contribute to an HSA if you have a high-deductible health plan.</li>
<li>Self-employed: fund a SEP IRA or solo 401(k).</li>
<li>Harvest capital losses (up to $3,000 a year against ordinary income).</li></ul>
<p>A traditional IRA deduction does <em>not</em> help, because it is added back. If MAGI is still over the limit, the backdoor Roth is legal: make a nondeductible traditional IRA contribution and convert it. If you hold other pre-tax IRA money, the pro-rata rule makes part of the conversion taxable.</p>`
    },
    {
      h2: 'What happens if you contribute too much to a Roth IRA?',
      html: `<p>An excess contribution is charged a 6% excise tax for every year it stays in the account. To avoid it, withdraw the excess plus any earnings on it by your tax-filing deadline, including extensions; the earnings are taxable. You can also recharacterize the contribution as a traditional IRA contribution by the same deadline. If your MAGI ends up higher than you expected, for example from a year-end bonus, check this calculator again before you file.</p>`
    }
  ],
  faq: [
    { q: 'What is the Roth IRA income limit for 2026?', a: 'For 2026 the contribution phases out between $153,000 and $168,000 of MAGI for single and head-of-household filers, and between $242,000 and $252,000 for married couples filing jointly. Married filing separately (lived together) phases out from $0 to $10,000.' },
    { q: 'Is MAGI the same as AGI?', a: 'For many people they are identical or nearly so. MAGI for a Roth IRA differs from AGI only if you have Roth conversion income, a traditional IRA or student loan interest deduction, foreign income exclusions, or excluded savings bond interest or adoption benefits.' },
    { q: 'Do 401(k) contributions reduce MAGI?', a: 'Yes, pre-tax 401(k), 403(b) and 457 deferrals reduce your W-2 wages, so they lower both AGI and MAGI. Roth 401(k) deferrals do not.' },
    { q: 'Does a Roth conversion count toward MAGI?', a: 'Not for Roth IRA contribution eligibility: conversion income is subtracted. It does count toward MAGI for Medicare IRMAA, ACA subsidies and other tests.' },
    { q: 'How much can I put in a Roth IRA for 2026?', a: 'Up to $7,500, or $8,600 if you are 50 or older, but no more than your taxable compensation, and less if your MAGI is in the phase-out range. The limit is shared with any traditional IRA contributions.' },
    { q: 'Does Social Security count in MAGI for a Roth IRA?', a: 'Only the taxable part, because that is what is in AGI. The ACA version of MAGI also adds back the nontaxable part.' },
    { q: 'When is the deadline for a 2026 Roth IRA contribution?', a: 'April 15, 2027, the tax-filing deadline, not including extensions. You can contribute for 2026 from January 1, 2026 until then.' },
    { q: 'What if my spouse has no income?', a: 'A spousal IRA lets a non-working spouse contribute based on the working spouse\'s pay if you file jointly. Your joint MAGI is compared with the $242,000–$252,000 range.' }
  ],
  related: ['401k-contribution-calculator', 'income-tax-calculator', 'retirement-calculator', 'capital-gains-tax-calculator', 'social-security-calculator'],
  sources: [
    { name: 'IRS Publication 590-A: Contributions to IRAs (Worksheets 2-1 and 2-2)', url: 'https://www.irs.gov/publications/p590a' },
    { name: 'IRS: 401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500', url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500' },
    { name: 'IRS: Definition of adjusted gross income', url: 'https://www.irs.gov/e-file-providers/definition-of-adjusted-gross-income' },
    { name: 'IRS: Roth IRAs', url: 'https://www.irs.gov/retirement-plans/roth-iras' },
    { name: 'HealthCare.gov: Modified adjusted gross income (MAGI)', url: 'https://www.healthcare.gov/glossary/modified-adjusted-gross-income-magi/' },
    { name: 'Medicare.gov: Medicare costs', url: 'https://www.medicare.gov/basics/costs/medicare-costs' }
  ],
  disclaimer: 'For estimates only. Confirm with IRS Publication 590-A or a tax professional before contributing.'
};
