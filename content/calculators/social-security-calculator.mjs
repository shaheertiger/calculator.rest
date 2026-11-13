export default {
  slug: 'social-security-calculator',
  hub: 'investing',
  name: 'Social Security Benefits Calculator',
  title: 'How Social Security Benefits Are Calculated: 2026 Calculator',
  h1: 'Social Security Benefits Calculator: From AIME to Your Monthly Check',
  meta: 'With 2026 bend points, a $6,000 AIME gives a $2,665.80 PIA: $1,866 a month at 62, $2,665 at 67 or $3,305 at 70. Spousal benefit estimate included.',
  keyword: 'how social security benefits are calculated',
  also: ['social security calculator', 'how are spousal benefits calculated for social security', 'how to calculate ssa', 'social security benefit formula 2026', 'how to calculate aime and pia'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Start from', type: 'select', value: 'earnings', options: [['earnings', 'My average yearly earnings'], ['aime', 'My AIME (from SSA)']] },
    { id: 'earn', label: 'Average yearly earnings, in today\'s dollars', type: 'number', value: 72000, prefix: '$', help: 'Your typical pay over your best years. Earnings above the 2026 cap of $184,500 do not count.', showIf: { mode: ['earnings'] } },
    { id: 'years', label: 'Years with Social Security earnings', type: 'number', value: 35, suffix: 'years', help: 'Only the top 35 count; fewer years means zeros are averaged in.', showIf: { mode: ['earnings'] } },
    { id: 'aime', label: 'Average indexed monthly earnings (AIME)', type: 'number', value: 6000, prefix: '$', showIf: { mode: ['aime'] } },
    { id: 'birth', label: 'Year of birth', type: 'select', value: '1960', options: [['1954', '1943–1954 (FRA 66)'], ['1955', '1955 (FRA 66 and 2 months)'], ['1956', '1956 (FRA 66 and 4 months)'], ['1957', '1957 (FRA 66 and 6 months)'], ['1958', '1958 (FRA 66 and 8 months)'], ['1959', '1959 (FRA 66 and 10 months)'], ['1960', '1960 or later (FRA 67)']] },
    { id: 'age', label: 'Age you start benefits', type: 'number', value: 67, suffix: 'years', help: 'Between 62 and 70.' },
    { id: 'months', label: 'Plus months', type: 'number', value: 0, suffix: 'months' },
    { id: 'spouse', label: 'Estimate a spousal benefit?', type: 'select', value: 'no', options: [['no', 'No'], ['yes', 'Yes, for my spouse']] },
    { id: 'spAge', label: 'Spouse\'s claiming age (spouse born 1960 or later)', type: 'number', value: 67, suffix: 'years', showIf: { spouse: ['yes'] } },
    { id: 'spPia', label: 'Spouse\'s own benefit at full retirement age', type: 'number', value: 0, prefix: '$', help: 'Enter 0 if your spouse has no work record of their own.', showIf: { spouse: ['yes'] } },
    { id: 'bp1', label: 'First bend point (2026)', type: 'number', value: 1286, prefix: '$', help: 'For people who turn 62 in 2026. 2027: $1,340.' },
    { id: 'bp2', label: 'Second bend point (2026)', type: 'number', value: 7749, prefix: '$', help: '2027: $8,077.' }
  ],
  data: { fra: { '1954': 792, '1955': 794, '1956': 796, '1957': 798, '1958': 800, '1959': 802, '1960': 804 }, cap: 184500 },
  compute(v, H, D) {
    var aime;
    var note = '';
    if (v.mode === 'aime') {
      if (!(v.aime >= 0)) return { error: 'Enter your AIME (average indexed monthly earnings).' };
      aime = Math.floor(v.aime);
    } else {
      if (!(v.earn >= 0)) return { error: 'Enter your average yearly earnings.' };
      if (!(v.years > 0)) return { error: 'Enter how many years you have worked.' };
      var e = Math.min(v.earn, D.cap);
      if (v.earn > D.cap) note = ' Earnings above the $184,500 taxable maximum were left out.';
      aime = Math.floor(e * Math.min(v.years, 35) / 420);
      if (v.years < 10) note += ' You need 40 credits (about 10 years of work) to qualify for retirement benefits at all.';
    }
    var b1 = v.bp1 > 0 ? v.bp1 : 1286, b2 = v.bp2 > b1 ? v.bp2 : 7749;
    var t1 = 0.9 * Math.min(aime, b1);
    var t2 = 0.32 * Math.max(0, Math.min(aime, b2) - b1);
    var t3 = 0.15 * Math.max(0, aime - b2);
    var pia = Math.floor((t1 + t2 + t3) * 10 + 1e-7) / 10;
    var fra = D.fra[v.birth] || 804;
    if (!(v.age >= 62)) return { error: 'Retirement benefits can start at age 62 at the earliest.' };
    var mo = v.months >= 0 && v.months < 12 ? Math.floor(v.months) : 0;
    var claim = Math.min(Math.floor(v.age) * 12 + mo, 840);
    function factor(c) {
      var d = c - fra;
      if (d < 0) { var m = -d; return 1 - (Math.min(m, 36) * 5 / 9 + Math.max(0, m - 36) * 5 / 12) / 100; }
      return 1 + (Math.min(c, 840) - fra) * (2 / 3) / 100;
    }
    function ben(c) { return Math.floor(pia * factor(c) + 1e-7); }
    var f = factor(claim), monthly = ben(claim);
    var fraTxt = Math.floor(fra / 12) + (fra % 12 ? ' and ' + (fra % 12) + ' months' : '');
    var adj = (f - 1) * 100;
    var rows = [
      ['AIME', H.money(aime, 0)],
      ['Primary insurance amount (PIA)', H.money(pia), true],
      ['Formula tiers', H.money(t1) + ' + ' + H.money(t2) + ' + ' + H.money(t3)],
      ['Full retirement age', fraTxt],
      ['Claiming adjustment', (adj >= 0 ? '+' : '−') + H.pct(Math.abs(adj), 2)],
      ['Yearly benefit', H.money(monthly * 12, 0)],
      ['At 62 / at 70', H.money(ben(744), 0) + ' / ' + H.money(ben(840), 0)]
    ];
    if (v.spouse === 'yes') {
      var sc = Math.min(Math.max(Math.floor(v.spAge >= 62 ? v.spAge : 67) * 12, 744), 840);
      var sm = Math.max(0, 804 - sc);
      var spF = 1 - (Math.min(sm, 36) * 25 / 36 + Math.max(0, sm - 36) * 5 / 12) / 100;
      var ownF = sc < 804 ? 1 - (Math.min(sm, 36) * 5 / 9 + Math.max(0, sm - 36) * 5 / 12) / 100 : 1 + (sc - 804) * (2 / 3) / 100;
      var own = v.spPia > 0 ? v.spPia : 0;
      var excess = Math.max(0, pia / 2 - own);
      var spTotal = Math.floor(own * ownF + excess * spF + 1e-7);
      rows.push(['Spouse\'s benefit (own + spousal)', H.money(spTotal, 0) + '/mo', true]);
      rows.push(['Spousal top-up before reduction', H.money(excess)]);
    }
    return {
      value: H.money(monthly, 0),
      label: 'Monthly benefit at ' + Math.floor(claim / 12) + (claim % 12 ? 'y ' + (claim % 12) + 'm' : ''),
      expr: H.money(pia) + ' PIA × ' + H.pct(f * 100, 2),
      rows: rows,
      sub: (claim < fra ? 'Claiming before full retirement age permanently reduces the check.' : claim > fra ? 'Delayed retirement credits add 8% a year until 70.' : 'At full retirement age you receive 100% of your PIA.') + ' Shown in 2026 dollars, before future cost-of-living raises and Medicare premiums.' + note
    };
  },
  quick: ({ r, run }) => `Social Security benefits are calculated in three steps: average your top 35 years of wage-indexed earnings into a monthly AIME, apply the 2026 formula (90% of the first $1,286, 32% up to $7,749, 15% above) to get your PIA, then adjust for claiming age. A $6,000 AIME gives a <strong>$2,665.80</strong> PIA: <strong>${r.value}</strong> a month at 67, ${run({ age: 62 }).value} at 62 or ${run({ age: 70 }).value} at 70.`,
  stepsTitle: 'How SSA calculates your benefit, step by step',
  steps: [
    '<strong>Index your earnings.</strong> SSA multiplies each year\'s covered pay by the growth in the national average wage index up to the year you turn 60. Earnings at 60 and later count at face value.',
    '<strong>Keep the best 35 years.</strong> Add the 35 highest indexed years and divide by 420 months. That is your AIME, rounded down to the dollar. With fewer than 35 years, zeros fill the gaps, which is the step people most often miss.',
    '<strong>Apply the bend-point formula.</strong> For anyone turning 62 in 2026: 90% of the first $1,286 of AIME, plus 32% of AIME from $1,286 to $7,749, plus 15% above $7,749. Round down to the dime. That is your PIA, the benefit at full retirement age.',
    '<strong>Adjust for when you claim.</strong> Each month before full retirement age cuts the PIA by 5/9 of 1% (5/12 of 1% beyond 36 months). Each month after adds 2/3 of 1%, up to 70.',
    '<strong>Add cost-of-living raises.</strong> COLAs apply from the year you turn 62, even if you have not claimed yet. The 2026 COLA was 2.8%.'
  ],
  formulaTitle: 'What is the Social Security benefit formula for 2026?',
  formula: {
    expr: 'AIME = top 35 years of indexed earnings ÷ 420<br>PIA = 0.90 × min(AIME, $1,286) + 0.32 × (AIME between $1,286 and $7,749) + 0.15 × (AIME above $7,749)<br>Benefit = PIA × claiming factor (70% at 62 to 124% at 70 when FRA is 67)',
    vars: [['AIME', 'average indexed monthly earnings'], ['PIA', 'primary insurance amount, your full-retirement-age benefit'], ['$1,286 / $7,749', 'bend points for workers first eligible (age 62) in 2026'], ['FRA', 'full retirement age: 67 if born in 1960 or later']],
    note: 'The bend points that apply are fixed by the year you turn 62, not the year you claim. Someone born in 1964 uses the 2026 bend points for life; someone born in 1965 uses the 2027 figures, $1,340 and $8,077. Change the bend-point inputs above to model a different eligibility year.'
  },
  example: `<p>Maria turns 62 in 2026. Her best 35 years of indexed earnings total $2,520,000, so her AIME is $2,520,000 ÷ 420 = <strong>$6,000</strong>.</p>
<p>First tier: 90% × $1,286 = $1,157.40. Second tier: 32% × ($6,000 − $1,286) = 32% × $4,714 = $1,508.48. Third tier: nothing, because $6,000 is below $7,749.</p>
<p>PIA = $1,157.40 + $1,508.48 = $2,665.88, rounded down to <strong>$2,665.80</strong>.</p>
<p>Her full retirement age is 67. Claiming at 62 is 60 months early: 36 × 5/9% + 24 × 5/12% = 20% + 10% = 30% off, so she gets $2,665.80 × 0.70 = <strong>$1,866</strong> a month. Waiting to 70 adds 36 × 2/3% = 24%: $2,665.80 × 1.24 = <strong>$3,305</strong>.</p>`,
  table: {
    title: 'How much does claiming age change the monthly check?',
    intro: 'Benefits for a $6,000 AIME ($2,665.80 PIA) with full retirement age 67, and the total collected by age 85 before COLAs.',
    head: ['Start at', '% of PIA', 'Monthly', 'Yearly', 'Total by 85'],
    rows: ({ run, H }) => [62, 63, 64, 65, 66, 67, 68, 69, 70].map(a => {
      const r = run({ age: a, months: 0, mode: 'aime', aime: 6000, birth: '1960', spouse: 'no', bp1: 1286, bp2: 7749 });
      const m = Number(String(r.value).replace(/[$,]/g, ''));
      const pct = { 62: '70%', 63: '75%', 64: '80%', 65: '86.67%', 66: '93.33%', 67: '100%', 68: '108%', 69: '116%', 70: '124%' }[a];
      return [String(a), pct, r.value, H.money(m * 12, 0), H.money(m * 12 * (85 - a), 0)];
    }),
    note: 'Claiming at 70 instead of 62 overtakes the early claimer\'s running total a little past age 80 in nominal dollars. Real break-even depends on COLAs, taxes, investment returns and how long you expect to live.'
  },
  sections: [
    {
      h2: 'How are spousal benefits calculated for Social Security?',
      html: `<p>A husband or wife can receive up to <strong>50% of the worker's PIA</strong>, not 50% of the check the worker actually gets. The worker must have filed for their own benefit first, and the spouse generally must be at least 62.</p>
<p>The 50% applies only if the spouse claims at their own full retirement age. Claiming earlier reduces it by 25/36 of 1% a month for the first 36 months and 5/12 of 1% for each month beyond that. With FRA 67, a spouse who claims at 62 gets 32.5% of the worker's PIA. Spousal benefits earn no delayed retirement credits, so there is no gain from waiting past full retirement age.</p>
<p>If the spouse has a record of their own, SSA pays their own benefit first and adds a top-up only if half the worker's PIA is larger. Example: worker's PIA $2,665.80, spouse's own PIA $900. Half the worker's PIA is $1,332.90, so the top-up is $432.90, and at full retirement age the spouse receives $1,332 in total. Choose "Yes, for my spouse" above to run your own numbers.</p>`
    },
    {
      h2: 'How is AIME worked out from your earnings record?',
      html: `<p>SSA uses only earnings you paid Social Security tax on, capped each year at that year's taxable maximum ($184,500 in 2026). Each year before age 60 is multiplied by an index factor: the average wage index for the year you turn 60 divided by the index for the year of the earnings. A $30,000 salary from 1995 might count as roughly $80,000 once indexed, because average wages have more than doubled since then.</p>
<p>After indexing, SSA picks the 35 highest years, adds them and divides by 420. Working a 36th year at good pay can replace a low or zero year and raise your AIME. Working part-time late in your career rarely helps if those years are below your top 35.</p>
<p>Your exact indexed earnings are on your Social Security Statement at my Social Security (ssa.gov/myaccount). If you know your AIME, switch the calculator to "My AIME" for an exact PIA.</p>`
    },
    {
      h2: 'Is Social Security taxable, and how is the tax figured?',
      html: `<p>Possibly. Add half your benefits to all your other income, including tax-exempt interest. The IRS calls this provisional income. Then compare it to these thresholds, which are not adjusted for inflation:</p>
<ul><li><strong>Single, head of household:</strong> under $25,000, no tax on benefits; $25,000–$34,000, up to 50% taxable; over $34,000, up to 85% taxable.</li>
<li><strong>Married filing jointly:</strong> under $32,000, none; $32,000–$44,000, up to 50%; over $44,000, up to 85%.</li></ul>
<p>At most 85% of benefits are ever taxable, and the taxable part is taxed at your ordinary rate. Use IRS Publication 915's worksheet for the exact figure. Some states also tax benefits.</p>`
    },
    {
      h2: 'Does working while collecting reduce your benefit?',
      html: `<p>Only before full retirement age. In 2026 SSA withholds $1 for every $2 you earn above <strong>$24,480</strong> if you are under FRA all year. In the year you reach FRA, it withholds $1 for every $3 above <strong>$65,160</strong>, counting only earnings before the month you reach FRA. From then on there is no limit.</p>
<p>The withheld money is not lost. At full retirement age SSA recalculates your benefit to credit the months it held back, so the monthly check goes up.</p>`
    }
  ],
  faq: [
    { q: 'What are the Social Security bend points for 2026?', a: 'The 2026 PIA bend points are $1,286 and $7,749. They apply to workers who turn 62 in 2026 (born in 1964). For people first eligible in 2027, the bend points are $1,340 and $8,077.' },
    { q: 'How much Social Security will I get if I make $50,000 a year?', a: 'About $2,079 a month at 67 if you earned $50,000 in today\'s dollars for 35 years: AIME $4,166, PIA $2,079.00. Claiming at 62 cuts that to about $1,455.' },
    { q: 'Does Social Security use your highest 35 years?', a: 'Yes. SSA indexes your earnings for wage growth, keeps the 35 highest years and divides by 420 months. If you worked fewer than 35 years, zeros are averaged in.' },
    { q: 'How much is my benefit reduced if I claim at 62?', a: 'With a full retirement age of 67, claiming at 62 is 60 months early and cuts the benefit by 30%, to 70% of your PIA. The reduction is permanent.' },
    { q: 'Is waiting until 70 worth it?', a: 'Waiting from 67 to 70 adds 8% a year, for 124% of your PIA. In nominal dollars, a 70 claimer passes a 62 claimer\'s running total a little after age 80, so it tends to pay off if you expect to live into your mid-80s or want the largest survivor benefit for a spouse.' },
    { q: 'Can my spouse get half of my Social Security?', a: 'Yes, up to 50% of your PIA if your spouse claims at their full retirement age, minus their own benefit. Claiming at 62 cuts it to 32.5% of your PIA when FRA is 67.' },
    { q: 'How much was the 2026 Social Security COLA?', a: 'The cost-of-living adjustment was 2.8%, paid starting with January 2026 benefits. COLAs apply from the year you turn 62, whether or not you have claimed.' },
    { q: 'Do WEP and GPO still reduce benefits?', a: 'No. The Social Security Fairness Act, signed in January 2025, repealed the Windfall Elimination Provision and Government Pension Offset for benefits payable after December 2023.' }
  ],
  related: ['retirement-calculator', 'retirement-age-calculator', 'pension-calculator', '401k-contribution-calculator', 'rmd-calculator'],
  sources: [
    { name: 'SSA Office of the Chief Actuary: Benefit formula bend points', url: 'https://www.ssa.gov/oact/cola/bendpoints.html' },
    { name: 'SSA Office of the Chief Actuary: Primary Insurance Amount', url: 'https://www.ssa.gov/oact/cola/piaformula.html' },
    { name: 'SSA: Code of Federal Regulations § 404.410, reduction for early retirement', url: 'https://www.ssa.gov/OP_Home/cfr20/404/404-0410.htm' },
    { name: 'SSA: Benefits for spouses', url: 'https://www.ssa.gov/oact/quickcalc/spouse.html' },
    { name: 'SSA: Retirement Benefits (Publication 05-10035)', url: 'https://www.ssa.gov/pubs/EN-05-10035.pdf' },
    { name: 'IRS Publication 915: Social Security and Equivalent Railroad Retirement Benefits', url: 'https://www.irs.gov/publications/p915' }
  ],
  disclaimer: 'An estimate, not an official SSA determination. Your Social Security Statement at ssa.gov/myaccount has your actual earnings record.'
};
