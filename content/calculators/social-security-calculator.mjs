export default {
  slug: 'social-security-calculator',
  hub: 'rules',
  name: 'Social Security Benefits Calculator',
  seoTitle: 'Social Security Calculator 2026: PIA Bend Points $1,286/$7,749',
  meta: '2026 PIA formula: 90% of the first $1,286 of AIME, 32% up to $7,749 and 15% above. A $6,000 AIME pays $2,665 a month at 67, $1,866 at 62 or $3,305 at 70.',
  intro: 'Plug in your average earnings (or your AIME), your birth year and the age you plan to claim, and we\'ll show you your primary insurance amount, your monthly and yearly benefit, and what a spouse could receive on your record.',
  keyword: 'how social security benefits are calculated',
  also: ['social security calculator', 'how are spousal benefits calculated for social security', 'how to calculate ssa', 'social security benefit formula 2026', 'how to calculate aime and pia'],
  updated: '2026-11-24',
  inputs: [
    { id: 'mode', label: 'Start from', type: 'select', value: 'earnings', options: [['earnings', 'My average yearly earnings'], ['aime', 'My AIME (from SSA)']], help: 'Use average earnings for a quick estimate, or switch to AIME if you already know it.' },
    { id: 'earn', label: 'Average yearly earnings, in today\'s dollars', type: 'number', value: 72000, prefix: '$', help: 'Your typical pay over your best years. Earnings above the 2026 cap of $184,500 do not count.', showIf: { mode: ['earnings'] } },
    { id: 'years', label: 'Years with Social Security earnings', type: 'number', value: 35, suffix: 'years', help: 'Only the top 35 count; fewer years means zeros are averaged in.', showIf: { mode: ['earnings'] } },
    { id: 'aime', label: 'Average indexed monthly earnings (AIME)', type: 'number', value: 6000, prefix: '$', help: 'Your top 35 years of indexed earnings divided by 420, for example from SSA\'s Detailed Calculator.', showIf: { mode: ['aime'] } },
    { id: 'birth', label: 'Year of birth', type: 'select', value: '1960', options: [['1954', '1943–1954 (FRA 66)'], ['1955', '1955 (FRA 66 and 2 months)'], ['1956', '1956 (FRA 66 and 4 months)'], ['1957', '1957 (FRA 66 and 6 months)'], ['1958', '1958 (FRA 66 and 8 months)'], ['1959', '1959 (FRA 66 and 10 months)'], ['1960', '1960 or later (FRA 67)']], help: 'Sets your full retirement age, the age you get 100% of your benefit.' },
    { id: 'age', label: 'Age you start benefits', type: 'number', value: 67, suffix: 'years', help: 'Between 62 and 70.' },
    { id: 'months', label: 'Plus months', type: 'number', value: 0, suffix: 'months', help: 'Extra months past that age, 0 to 11 (enter 6 for 66 and a half).' },
    { id: 'spouse', label: 'Estimate a spousal benefit?', type: 'select', value: 'no', options: [['no', 'No'], ['yes', 'Yes, for my spouse']], help: 'Choose Yes to see what a husband or wife could get on your record.' },
    { id: 'spAge', label: 'Spouse\'s claiming age (spouse born 1960 or later)', type: 'number', value: 67, suffix: 'years', help: 'Between 62 and 70; spousal benefits stop growing at 67.', showIf: { spouse: ['yes'] } },
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
      sub: 'You would receive about ' + H.money(monthly, 0) + ' a month starting at ' + Math.floor(claim / 12) + (claim % 12 ? ' and ' + (claim % 12) + ' months' : '') + '. ' + (claim < fra ? 'Claiming before full retirement age permanently reduces the check.' : claim > fra ? 'Delayed retirement credits add 8% a year until 70.' : 'At full retirement age you receive 100% of your PIA.') + ' Shown in 2026 dollars, before future cost-of-living raises and Medicare premiums.' + note
    };
  },
  notes: {
    'AIME': 'Your top 35 years of indexed earnings, averaged per month.',
    'Primary insurance amount (PIA)': 'Your monthly benefit if you claim exactly at full retirement age.',
    'Formula tiers': 'The 90%, 32% and 15% slices of your AIME that add up to the PIA.',
    'Full retirement age': 'The age you receive 100% of your PIA, set by your birth year.',
    'Claiming adjustment': 'The permanent cut for claiming early, or the credit for waiting past full retirement age.',
    'Yearly benefit': 'Twelve monthly checks at the claiming age you chose.',
    'At 62 / at 70': 'Your monthly check at the earliest and the latest claiming ages.',
    'Spouse\'s benefit (own + spousal)': 'Your spouse\'s own benefit plus any spousal top-up, at their claiming age.',
    'Spousal top-up before reduction': 'Half your PIA minus your spouse\'s own PIA, before any early-claiming cut.'
  },
  assumptions: 'These calculations are estimates. They assume your average earnings are already in today\'s wage-indexed dollars and use the 2026 bend points, and they leave out future cost-of-living raises, Medicare premiums and income tax.',
  quick: ({ r, run }) => `Social Security benefits are calculated in three steps: average your top 35 years of wage-indexed earnings into a monthly AIME, apply the 2026 formula (90% of the first $1,286, 32% up to $7,749, 15% above) to get your PIA, then adjust for claiming age. A $6,000 AIME gives a <strong>$2,665.80</strong> PIA: <strong>${r.value}</strong> a month at 67, ${run({ age: 62 }).value} at 62 or ${run({ age: 70 }).value} at 70.`,
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
      h2: 'Understanding your inputs',
      html: `<p>SSA works out your benefit in three moves: average your earnings into an AIME, turn the AIME into a PIA with the bend-point formula, then adjust the PIA for the age you claim. Each input below feeds one of those moves.</p>
<h3>Start from</h3>
<p>Most people don't know their AIME, so the calculator starts from average yearly earnings. If you have your AIME from SSA's Detailed Calculator or a benefit estimate, switch to "My AIME" and the PIA will match SSA's to the dime.</p>
<h3>Average yearly earnings</h3>
<p>Enter what you typically earned in your best working years, in today's dollars. SSA does the same thing behind the scenes: it multiplies each year's covered pay by the growth in the national average wage index up to the year you turn 60, so older paychecks count at today's wage levels. Earnings at 60 and later count at face value. Pay above the taxable maximum ($184,500 in 2026) never counts, so a $250,000 salary is treated as $184,500.</p>
<h3>Years with Social Security earnings</h3>
<p>SSA keeps your 35 highest indexed years, adds them and divides by 420 months. That is your AIME, rounded down to the dollar. With fewer than 35 years, zeros fill the gaps, which is the step people most often miss: 25 years at $72,000 gives a $4,285 AIME instead of $6,000. Years beyond 35 help only if they replace a lower year.</p>
<h3>Year of birth</h3>
<p>Your birth year sets your full retirement age (FRA): 66 for 1943–1954, rising two months a year to 67 for anyone born in 1960 or later. It also fixes your bend points, which come from the year you turn 62.</p>
<h3>Age you start benefits</h3>
<p>Enter the age and any extra months when your first check starts. Each month before full retirement age cuts the PIA by 5/9 of 1% for the first 36 months and 5/12 of 1% beyond that. Each month after adds 2/3 of 1%, up to 70. The adjustment is permanent.</p>
<h3>Spousal benefit</h3>
<p>Choose "Yes" to estimate what a husband or wife could get on your record. Enter your spouse's claiming age and their own PIA, or 0 if they have no work record. The calculator assumes your spouse's full retirement age is 67.</p>
<h3>Bend points</h3>
<p>Leave these at $1,286 and $7,749 if you turn 62 in 2026 (born in 1964), and use them as a reasonable estimate for younger workers. For anyone turning 62 in 2027, enter $1,340 and $8,077. Bend points rise each year with average wages.</p>`
    },
    {
      h2: 'How is AIME worked out from your earnings record?',
      html: `<p>SSA uses only earnings you paid Social Security tax on, capped each year at that year's taxable maximum ($184,500 in 2026).</p>
<h3>Indexing past earnings</h3>
<p>Each year before age 60 is multiplied by an index factor: the average wage index for the year you turn 60 divided by the index for the year of the earnings. A $30,000 salary from 1995 might count as roughly $80,000 once indexed, because average wages have more than doubled since then.</p>
<h3>Choosing the best 35 years</h3>
<p>After indexing, SSA picks the 35 highest years, adds them and divides by 420. Working a 36th year at good pay can replace a low or zero year and raise your AIME. Working part-time late in your career rarely helps if those years are below your top 35.</p>
<h3>Where to find your record</h3>
<p>Your yearly earnings are on your Social Security Statement at my Social Security (ssa.gov/myaccount). Check it for missing years; a gap you can document is worth correcting. If you know your AIME, switch the calculator to "My AIME" for an exact PIA.</p>`
    },
    {
      h2: 'How are spousal benefits calculated for Social Security?',
      html: `<p>A husband or wife can receive up to <strong>50% of the worker's PIA</strong>, not 50% of the check the worker actually gets. The worker must have filed for their own benefit first, and the spouse generally must be at least 62.</p>
<h3>Claiming early as a spouse</h3>
<p>The 50% applies only if the spouse claims at their own full retirement age. Claiming earlier reduces it by 25/36 of 1% a month for the first 36 months and 5/12 of 1% for each month beyond that. With FRA 67, a spouse who claims at 62 gets 32.5% of the worker's PIA: $866 a month on a $2,665.80 PIA. Spousal benefits earn no delayed retirement credits, so there is no gain from waiting past full retirement age.</p>
<h3>When the spouse has their own record</h3>
<p>If the spouse has a record of their own, SSA pays their own benefit first and adds a top-up only if half the worker's PIA is larger. Example: worker's PIA $2,665.80, spouse's own PIA $900. Half the worker's PIA is $1,332.90, so the top-up is $432.90, and at full retirement age the spouse receives $1,332 in total. Choose "Yes, for my spouse" above to run your own numbers.</p>`
    },
    {
      h2: 'When should you start Social Security?',
      html: `<p>You can start any month from 62 to 70, and the choice changes the check for life. On a $2,665.80 PIA with full retirement age 67, the monthly benefit is $1,866 at 62, $2,665 at 67 and $3,305 at 70.</p>
<h3>Claiming at 62</h3>
<p>Starting early makes sense if you need the income, have health problems or are single with no one relying on a survivor benefit. The 30% cut is permanent, and until full retirement age the earnings test can hold back part of your check if you still work.</p>
<h3>Waiting until 70</h3>
<p>Delayed retirement credits add 8% a year from full retirement age to 70, for 124% of your PIA. Using the example above, the 70 claimer's running total passes the 62 claimer's at about age 80 and the 67 claimer's at about 82 and a half, before COLAs. For the higher earner in a married couple, waiting also locks in a larger survivor benefit.</p>
<h3>Cost-of-living raises</h3>
<p>COLAs apply from the year you turn 62, even if you have not claimed yet, so waiting does not mean missing raises. The 2026 COLA was 2.8%. This calculator shows benefits in 2026 dollars, before future COLAs.</p>`
    },
    {
      h2: 'Is Social Security taxable, and how is the tax figured?',
      html: `<p>Possibly. Add half your benefits to all your other income, including tax-exempt interest. The IRS calls this provisional income. Then compare it to these thresholds, which are not adjusted for inflation:</p>
<h3>Single and head of household</h3>
<p>Under $25,000, no tax on benefits; $25,000–$34,000, up to 50% taxable; over $34,000, up to 85% taxable.</p>
<h3>Married filing jointly</h3>
<p>Under $32,000, none; $32,000–$44,000, up to 50%; over $44,000, up to 85%.</p>
<p>At most 85% of benefits are ever taxable, and the taxable part is taxed at your ordinary rate. Use IRS Publication 915's worksheet for the exact figure, or the <a href="/retirement-tax-calculator">retirement tax calculator</a> to see the tax alongside your other income. Some states also tax benefits.</p>`
    },
    {
      h2: 'Does working while collecting reduce your benefit?',
      html: `<p>Only before full retirement age. The retirement earnings test applies to wages and self-employment income, not to pensions, investment income or IRA withdrawals.</p>
<h3>Under full retirement age all year</h3>
<p>In 2026 SSA withholds $1 for every $2 you earn above <strong>$24,480</strong>.</p>
<h3>The year you reach full retirement age</h3>
<p>SSA withholds $1 for every $3 above <strong>$65,160</strong>, counting only earnings before the month you reach FRA. From then on there is no limit.</p>
<p>The withheld money is not lost. At full retirement age SSA recalculates your benefit to credit the months it held back, so the monthly check goes up.</p>`
    }
  ],
  faq: [
    { q: 'How is Social Security calculated?', a: 'SSA averages your 35 highest years of wage-indexed earnings into a monthly AIME, applies the bend-point formula to get your PIA, then adjusts for claiming age. For someone turning 62 in 2026, a $6,000 AIME gives a $2,665.80 PIA, or $2,665 a month at 67.' },
    { q: 'What are the Social Security bend points for 2026?', a: 'The 2026 PIA bend points are $1,286 and $7,749. They apply to workers who turn 62 in 2026 (born in 1964). For people first eligible in 2027, the bend points are $1,340 and $8,077.' },
    { q: 'How much Social Security will I get if I make $50,000 a year?', a: 'About $2,079 a month at 67 if you earned $50,000 in today\'s dollars for 35 years: AIME $4,166, PIA $2,079.00. Claiming at 62 cuts that to about $1,455, and waiting to 70 raises it to about $2,577.' },
    { q: 'How much Social Security will I get if I make $100,000 a year?', a: 'About $3,313 a month at 67 if you earned $100,000 in today\'s dollars for 35 years: AIME $8,333, PIA $3,313.10. That is $2,319 at 62 or $4,108 at 70. The 15% tier starts above $7,749 of AIME, so higher pay adds less.' },
    { q: 'Does Social Security use your highest 35 years?', a: 'Yes. SSA indexes your earnings for wage growth, keeps the 35 highest years and divides by 420 months. If you worked fewer than 35 years, zeros are averaged in: 25 years at $72,000 gives about $2,117 a month at 67 instead of $2,665.' },
    { q: 'What is my full retirement age for Social Security?', a: 'It is 67 if you were born in 1960 or later. It is 66 for people born 1943–1954 and rises by two months a year in between, for example 66 and 8 months for 1958.' },
    { q: 'How much is my benefit reduced if I claim at 62?', a: 'With a full retirement age of 67, claiming at 62 is 60 months early and cuts the benefit by 30%, to 70% of your PIA. A $2,665 benefit at 67 becomes $1,866 at 62, and the reduction is permanent.' },
    { q: 'How much more do I get if I wait until 70?', a: 'Waiting from 67 to 70 adds 8% a year, for 124% of your PIA: $2,665 a month becomes $3,305. In nominal dollars, a 70 claimer passes a 62 claimer\'s running total at about age 80, so it tends to pay off if you expect to live into your mid-80s or want the largest survivor benefit for a spouse.' },
    { q: 'Can my spouse get half of my Social Security?', a: 'Yes, up to 50% of your PIA if your spouse claims at their full retirement age, minus their own benefit. On a $2,665.80 PIA that is $1,332 a month at 67, or $866 at 62 (32.5%) when FRA is 67.' },
    { q: 'How much can I earn while collecting Social Security in 2026?', a: 'Under full retirement age, $24,480 a year before SSA withholds $1 for every $2 above it. In the year you reach full retirement age the limit is $65,160 with $1 withheld for every $3. After that there is no limit.' },
    { q: 'How much was the 2026 Social Security COLA?', a: 'The cost-of-living adjustment was 2.8%, paid starting with January 2026 benefits. COLAs apply from the year you turn 62, whether or not you have claimed.' },
    { q: 'Is Social Security taxable?', a: 'Up to 85% of benefits can be taxable. If half your benefits plus other income is under $25,000 (single) or $32,000 (married filing jointly), none is taxed; above $34,000 or $44,000, up to 85% is.' },
    { q: 'How many years do you need to work to get Social Security?', a: 'You need 40 credits, which takes about 10 years of work, to qualify for retirement benefits. Qualifying is separate from the amount: the benefit still averages 35 years, so a 10-year record has 25 zero years in it.' },
    { q: 'Do WEP and GPO still reduce benefits?', a: 'No. The Social Security Fairness Act, signed in January 2025, repealed the Windfall Elimination Provision and Government Pension Offset for benefits payable after December 2023.' }
  ],
  related: ['retirement-income-calculator', 'retirement-tax-calculator', 'couples-retirement-calculator', 'pension-calculator', 'retirement-age-calculator'],
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
