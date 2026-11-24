export default {
  slug: '403b-calculator',
  hub: 'planning',
  name: '403(b) Calculator',
  meta: 'Estimate your 403(b) at retirement with our free 403(b) calculator. See your 2026 deferral limit, the 15-year service catch-up you qualify for and your balance.',
  intro: 'Plug in your age, salary, years with your employer and what you defer, and we\'ll show you your 2026 403(b) limit with every catch-up you qualify for and what the account will hold when you retire.',
  keyword: '403b retirement calculator',
  also: ['403b calculator retirement', '403 b retirement calculator', 'retirement calculator 403b', 'retirement 403b calculator', 'how much should i contribute to my 403b calculator', '403b retirement plan calculator', '403 b retirement plan calculator'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Your age now', type: 'number', value: 52, help: 'Your age today. It sets the age 50 and age 60–63 catch-ups in each projected year.' },
    { id: 'retAge', label: 'Retirement age', type: 'number', value: 65, help: 'The age you expect to stop working for this employer and stop deferring.' },
    { id: 'bal', label: '403(b) balance today', type: 'number', value: 180000, prefix: '$', help: 'Add up every 403(b) annuity and custodial account on your latest statements.' },
    { id: 'salary', label: 'Annual salary', type: 'number', value: 95000, prefix: '$', help: 'Gross yearly pay from the employer that sponsors the plan, before any deductions.' },
    { id: 'mode', label: 'How much you defer', type: 'select', value: 'max', options: [['max', 'The most the IRS allows me each year'], ['pct', 'A percentage of salary']], help: 'Pick the maximum to see your ceiling, or a percentage to model what you defer now.' },
    { id: 'pct', label: 'Deferral rate', type: 'number', value: 15, suffix: '% of pay', showIf: { mode: ['pct'] }, help: 'Pre-tax and Roth 403(b) deferrals together, as a share of gross pay.' },
    { id: 'svcOn', label: 'My plan offers the 15-year service catch-up', type: 'checkbox', value: true, help: 'Check your plan document or ask HR; only some school, hospital, church and charity plans offer it.' },
    { id: 'svc', label: 'Years of service with this employer', type: 'number', value: 16, showIf: { svcOn: [true, 'true'] }, help: 'Counted with the employer sponsoring this 403(b): a school district, hospital, university or church.' },
    { id: 'prior', label: 'Total you have deferred to this employer\'s plans in past years', type: 'number', value: 40000, prefix: '$', showIf: { svcOn: [true, 'true'] }, help: 'Used in the $5,000 × years of service test. Include 401(k), 457(b) and SIMPLE deferrals with the same employer.' },
    { id: 'used', label: '15-year catch-up already used', type: 'number', value: 0, prefix: '$', showIf: { svcOn: [true, 'true'] }, help: 'Service catch-up amounts you deferred in earlier years. Your plan administrator tracks this.' },
    { id: 'er', label: 'Employer contribution', type: 'number', value: 5, suffix: '% of pay', help: 'Many 403(b) employers contribute a fixed percentage whether or not you defer.' },
    { id: 'raise', label: 'Annual raise', type: 'number', value: 3, suffix: '%', help: 'Average yearly pay increase, including step raises on a salary schedule.' },
    { id: 'ret', label: 'Annual return', type: 'number', value: 6, suffix: '%', help: 'Average yearly growth before inflation. Fixed annuity accounts usually credit less than stock funds.' }
  ],
  data: { base: 24500, c50: 8000, c60: 11250, svcYr: 3000, svcLife: 15000, svcAvg: 5000, total: 72000, wr: 4 },
  compute(v, H, D) {
    if (!(v.age >= 15) || !(v.age < 100)) return { error: 'Enter your current age.' };
    if (!(v.retAge > v.age) || v.retAge > 100) return { error: 'Enter a retirement age above your current age.' };
    if (!(v.salary > 0)) return { error: 'Enter your annual salary.' };
    if (v.mode === 'pct' && (!(v.pct >= 0) || v.pct > 100)) return { error: 'Enter a deferral rate between 0 and 100%.' };
    var r = isNaN(v.ret) ? 0 : v.ret / 100, g = isNaN(v.raise) ? 0 : v.raise / 100, erPct = v.er > 0 ? v.er / 100 : 0;
    if (r <= -1) return { error: 'Enter a return above −100%.' };
    var on = v.svcOn === true || v.svcOn === 'true';
    var years = Math.round(v.retAge - v.age), start = v.bal > 0 ? v.bal : 0;
    function sim(useSvc, keep) {
      var bal = start, sal = v.salary, prior = v.prior > 0 ? v.prior : 0, used = v.used > 0 ? v.used : 0;
      var you = 0, emp = 0, svcTot = 0, svcYears = 0, ageTot = 0, first = null, rows = [];
      for (var i = 0; i < years; i++) {
        var a = Math.round(v.age) + i, s = (v.svc > 0 ? Math.floor(v.svc) : 0) + i;
        var svcRoom = useSvc && s >= 15 ? Math.max(0, Math.min(D.svcYr, D.svcLife - used, D.svcAvg * s - prior)) : 0;
        var ageRoom = a >= 60 && a <= 63 ? D.c60 : a >= 50 ? D.c50 : 0;
        var cap = D.base + svcRoom + ageRoom;
        var want = v.mode === 'pct' ? sal * v.pct / 100 : cap;
        var d = Math.min(want, cap, sal);
        var toSvc = Math.min(svcRoom, Math.max(0, d - D.base));
        var toAge = Math.max(0, d - D.base - toSvc);
        var e = sal * erPct;
        if (Math.min(d, D.base) + toSvc + e > D.total) e = Math.max(0, D.total - Math.min(d, D.base) - toSvc);
        if (i === 0) first = { cap: cap, svc: svcRoom, age: ageRoom, d: d };
        used += toSvc; prior += d; svcTot += toSvc; if (toSvc > 0) svcYears++; ageTot += toAge;
        bal = bal * (1 + r) + (d + e) * (1 + r / 2);
        you += d; emp += e;
        if (keep) rows.push([String(a), H.money0(cap), H.money0(toSvc), H.money0(toAge), H.money0(bal)]);
        sal *= 1 + g;
      }
      return { bal: bal, you: you, emp: emp, svcTot: svcTot, svcYears: svcYears, ageTot: ageTot, first: first, rows: rows };
    }
    var a1 = sim(on, true), b1 = sim(false, false);
    var extra = a1.bal - b1.bal, growth = a1.bal - start - a1.you - a1.emp;
    var rows = [
      ['Your 2026 deferral limit', H.money0(a1.first.cap) + ' (' + H.money0(D.base) + (a1.first.svc ? ' + ' + H.money0(a1.first.svc) + ' service' : '') + (a1.first.age ? ' + ' + H.money0(a1.first.age) + ' age' : '') + ')', true],
      ['15-year catch-up you can use', on ? H.money0(a1.svcTot) + ' over ' + H.plural(a1.svcYears, 'year') : 'Not offered'],
      ['Extra at retirement from the 15-year catch-up', H.money0(extra), true],
      ['Monthly income at a 4% withdrawal', H.money0(a1.bal * D.wr / 100 / 12)],
      ['Your deferrals', H.money0(a1.you)],
      ['Age catch-up included', H.money0(a1.ageTot)],
      ['Employer contributions', H.money0(a1.emp)],
      ['Investment growth', H.money0(growth)]
    ];
    var sub;
    if (!on) sub = 'Without the service catch-up, your ceiling is the regular limit plus any age-based catch-up.';
    else if ((v.svc > 0 ? v.svc : 0) + years <= 15) sub = 'You do not reach 15 years of service before retiring, so the service catch-up never applies.';
    else if (a1.svcTot === 0 && v.mode === 'pct' && a1.ageTot === 0) sub = 'Your deferrals stay under the ' + H.money0(D.base) + ' regular limit, so you never need a catch-up. Raise the rate or choose the maximum to use it.';
    else if (a1.svcTot === 0) sub = 'Your past deferrals already exceed $5,000 × years of service, so the 15-year catch-up is used up or blocked.';
    else sub = 'The $5,000-per-year-of-service test limits you to ' + H.money0(a1.svcTot) + ' of the $15,000 lifetime maximum; IRS rules apply deferrals above ' + H.money0(D.base) + ' to the service catch-up before the age catch-up.';
    if (v.salary > 150000 && a1.first.cap > D.base) sub += ' Earned over $150,000 from this employer last year? Catch-ups must go in as Roth from 2026.';
    return {
      value: H.money0(a1.bal),
      label: '403(b) balance at age ' + H.num(v.retAge, 0),
      expr: H.money0(start) + ' + ' + H.money0(a1.you + a1.emp) + ' contributed over ' + years + ' yrs at ' + H.num(r * 100, 2) + '%',
      rows: rows,
      sub: sub,
      svcTot: a1.svcTot, extra: extra, you: a1.you, emp: a1.emp, growth: growth, ageTot: a1.ageTot, mo: a1.bal * D.wr / 100 / 12,
      table: { head: ['Age', 'Deferral limit', '15-year catch-up', 'Age catch-up', 'Balance at year end'], rows: a1.rows, caption: 'Year-by-year limits and balance' }
    };
  },
  notes: {
    'Your 2026 deferral limit': 'The most you can defer this year: the $24,500 base plus each catch-up you qualify for.',
    '15-year catch-up you can use': 'Service catch-up the $5,000 test and $15,000 lifetime cap let you use before retiring.',
    'Extra at retirement from the 15-year catch-up': 'How much bigger the final balance is than with no service catch-up at all.',
    'Monthly income at a 4% withdrawal': 'Final balance × 4% ÷ 12, before income tax.',
    'Your deferrals': 'Everything you put in from your paychecks until retirement.',
    'Age catch-up included': 'The part of your deferrals that used the age 50 or age 60–63 catch-up.',
    'Employer contributions': 'What the employer adds as a share of your pay each year.',
    'Investment growth': 'Returns earned on the balance and on new money over the years.'
  },
  assumptions: 'These calculations are estimates. They assume the same return every year, contributions spread through each year, an employer contribution at the same share of pay and 2026 IRS limits held flat. Your plan administrator has the final word on catch-up eligibility.',
  quick: ({ r }) => `A 403(b) retirement calculator should apply the limits only these plans have. A 52-year-old hospital or school employee with $180,000 saved, a $95,000 salary, 16 years of service and a 5% employer contribution can defer <strong>$35,500</strong> in 2026: $24,500, plus a $3,000 service catch-up, plus $8,000 for age. Deferring the maximum every year at a 6% return grows to <strong>${r.value}</strong> by 65.`,
  formulaTitle: 'How is the 403(b) limit with catch-ups calculated?',
  formula: {
    expr: 'Deferral limit = $24,500 + service catch-up + age catch-up<br>Service catch-up = lesser of $3,000 · $15,000 − amount used before · $5,000 × years of service − prior deferrals with this employer<br>Age catch-up = $8,000 at 50–59 and 64+ · $11,250 at 60–63',
    vars: [['$24,500', '2026 elective deferral limit, shared with any 401(k) you also contribute to'], ['years of service', 'full-time years with the employer sponsoring the plan'], ['prior deferrals', 'all elective deferrals made to that employer\'s 401(k), 403(b), SIMPLE and 457(b) plans in earlier years'], ['Balance', 'grows by the return each year; contributions get half a year of growth']],
    note: 'When you defer more than $24,500, IRS rules apply the excess to the 15-year catch-up first and to the age catch-up second. The calculator follows that order, counts every deferral toward the $5,000 test in later years, and holds the 2026 dollar limits flat in future years.'
  },
  example: `<p>Denise is 52, a hospital lab manager with 16 years at the same nonprofit hospital. She earns $95,000, has $180,000 in her 403(b) and has deferred $40,000 to the hospital's plan over those 16 years. The hospital adds 5% of pay.</p>
<p><strong>2026 service catch-up:</strong> the lesser of $3,000; $15,000 − $0 = $15,000; and $5,000 × 16 − $40,000 = $40,000. That is <strong>$3,000</strong>. With the $8,000 age catch-up her limit is $24,500 + $3,000 + $8,000 = <strong>$35,500</strong>.</p>
<p><strong>2027:</strong> her prior deferrals are now $75,500 and the test allows $5,000 × 17 − $75,500 = $9,500, so she gets another $3,000. <strong>2028:</strong> $5,000 × 18 = $90,000, but she has deferred $111,000, so the service catch-up stops at a total of $6,000.</p>
<p>Maxing out every year until 65 at 6%, she contributes $441,500, the hospital $74,185, and the account reaches <strong>$1,151,964</strong>, about $3,840 a month at a 4% withdrawal. The two service catch-up years account for $12,083 of that.</p>`,
  table: {
    title: 'What is the 403(b) limit each year from 52 to 65?',
    intro: 'Denise\'s deferral ceiling and balance by age, from the calculator above. Watch the service catch-up run out and the age catch-up rise at 60.',
    head: ['Age', 'Deferral limit', '15-year catch-up', 'Age catch-up', 'Balance at year end'],
    rows: ({ run }) => run().table.rows,
    note: 'Limits use 2026 dollars throughout. The IRS adjusts the $24,500 base and the age catch-ups for inflation; the $3,000 and $15,000 service amounts are fixed in law.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>A 403(b) has more limit rules than any other workplace plan, so a few of these boxes exist only to work out how much the IRS lets you put in. The rest drive the growth.</p>
<h3>Age now and retirement age</h3>
<p>Your age in each projected year decides the age-based catch-up: $8,000 from 50, $11,250 in the years you are 60 to 63, and $8,000 again from 64. The years between now and retirement are how long the money compounds.</p>
<h3>403(b) balance and salary</h3>
<p>Add up every account in the plan. Many teachers and hospital staff hold money with two or three annuity or mutual fund vendors under one 403(b), and each sends its own statement. For salary, use gross pay from the sponsoring employer only.</p>
<h3>How much you defer</h3>
<p>Choose "the most the IRS allows" to see your ceiling year by year, or a percentage of salary to model what you actually defer. A percentage that stays under $24,500 never touches a catch-up, so the catch-up rows will show $0.</p>
<h3>The 15-year service catch-up</h3>
<p>Tick the box only if your plan document offers it. Not every 403(b) does, and it exists only for employees of public schools, colleges, hospitals, home health and health and welfare service agencies, and churches.</p>
<h3>Years of service and past deferrals</h3>
<p>This is the step people skip. Enter your full years with this employer and the total you have deferred to its plans in earlier years. The $5,000 × years-of-service test compares the two, and for long-time savers it often shrinks or removes the extra $3,000. Enter any service catch-up you already used, since it counts against the $15,000 lifetime cap.</p>
<h3>Employer contribution</h3>
<p>Many nonprofits and public schools contribute a fixed share of pay instead of a match, so it is entered as a percentage of salary. Enter 0 if your employer adds nothing.</p>
<h3>Raise and return</h3>
<p>Step raises on a salary schedule often average 2–3% a year. For the return, 6% is a middle-of-the-road figure for a balanced fund; a fixed annuity account usually credits less. Read the year-by-year schedule in the results to see which years get each catch-up.</p>`
    },
    {
      h2: 'Who qualifies for the 403(b) 15-year catch-up?',
      html: `<h3>The three requirements</h3>
<p>You need at least 15 years of service with the same employer, an employer that is a qualified organization (a public school system, college or university, hospital, home health service agency, health and welfare service agency, church or association of churches), and a plan that offers it. Years at a different employer do not count, even another school district.</p>
<h3>The $5,000 test</h3>
<p>The test is what decides most cases. It compares your lifetime deferrals with that employer to $5,000 per year of service. Someone who deferred little early in their career has room; someone who has maxed out for years usually has none. For Denise's 16 years of service:</p>
<div class="twrap"><table><thead><tr><th>Deferred to this employer before 2026</th><th>Service catch-up she can use</th><th>Extra balance at 65</th></tr></thead><tbody>
<tr><td>$0 or $10,000</td><td>$9,000 over 3 years</td><td>$17,617</td></tr>
<tr><td>$20,000 or $40,000</td><td>$6,000 over 2 years</td><td>$12,083</td></tr>
<tr><td>$60,000 to $75,000</td><td>$3,000 in 1 year</td><td>$6,218</td></tr>
<tr><td>$80,000</td><td>$0</td><td>$0</td></tr>
</tbody></table></div>
<p>Even with no past deferrals, maxing out adds $35,500 a year to the running total while the allowance grows only $5,000, so the catch-up closes within a few years. Its value is real but modest: a few thousand dollars of extra deferral, not a second limit.</p>`
    },
    {
      h2: 'Can you use the 15-year catch-up and the age 50 catch-up together?',
      html: `<p>Yes. In 2026 a 403(b) participant aged 50 to 59 (or 64 and older) who qualifies for the full service catch-up can defer up to $35,500. At 60 to 63 the age catch-up rises to $11,250, so the ceiling is $38,750 if the service catch-up still applies.</p>
<h3>Which catch-up is used first</h3>
<p>The calculator applies the excess over $24,500 to the service catch-up first, as IRS rules require. That ordering can use up service room you might have preferred to save, because you cannot choose to fill the age catch-up first.</p>
<h3>The 2026 Roth catch-up rule</h3>
<p>A new rule applies to both kinds of catch-up: if your FICA wages from this employer were over $150,000 in 2025, catch-up contributions must be made as Roth (after-tax) money. If your plan has no Roth option, you cannot make catch-ups at all.</p>`
    },
    {
      h2: 'How much should I contribute to my 403(b)?',
      html: `<h3>Get the employer money first</h3>
<p>If your employer matches, defer at least enough to collect all of it. If it makes a fixed contribution, you get it either way, and in Denise's case that 5% of pay is worth $108,351 by 65: the balance falls to $1,043,613 without it.</p>
<h3>Aim for a total savings rate</h3>
<p>A common target is about 15% of pay, yours plus the employer's, if you start in your 30s, and more if you start later. Denise's numbers show the range: deferring 15% of pay instead of the maximum leaves her with $817,334 at 65 instead of $1,151,964, a difference of about $1,115 a month at a 4% withdrawal.</p>
<h3>Turn the rate into a paycheck amount</h3>
<p>The <a href="/401k-contribution-calculator">paycheck contribution calculator</a> turns a percentage into a per-paycheck deduction; it works the same for a 403(b). If you work for a state or local government, you may also have a 457(b) with its own separate $24,500 limit; the <a href="/457-calculator">457(b) calculator</a> shows how stacking the two adds up.</p>`
    },
    {
      h2: 'How is a 403(b) different from a 401(k)?',
      html: `<p>The deferral limit, the age catch-ups and the tax treatment are the same. The differences are about who offers the plan and what it can hold.</p>
<h3>Who offers it</h3>
<p>A 403(b) is for employees of public schools and colleges, churches and tax-exempt 501(c)(3) organizations such as hospitals and charities. A 401(k) is mostly for private companies.</p>
<h3>What it can invest in</h3>
<p>A 403(b) can hold only annuity contracts and mutual funds held in a custodial account. Older school plans in particular often rely on annuities, so compare fees and surrender charges before you choose a vendor; a 1-point difference in yearly cost is like losing 1 point of return. In Denise's case, 5% instead of 6% leaves $1,056,880 instead of $1,151,964.</p>
<h3>Extra limit and fewer rules</h3>
<p>Only a 403(b) has the 15-year service catch-up. Plans of public schools and churches are generally exempt from ERISA, which can mean fewer reporting rules and fewer protections. For a company plan with a match formula, use the <a href="/401k-retirement-calculator">401(k) retirement calculator</a>.</p>`
    },
    {
      h2: 'When does a bigger 403(b) balance come from working longer?',
      html: `<p>In the last decade before retirement, each extra year adds a full year of maximum deferrals, an employer contribution and growth on the largest balance you will have. For Denise, maxing out every year:</p>
<div class="twrap"><table><thead><tr><th>Retire at</th><th>403(b) balance</th><th>Monthly income at 4%</th></tr></thead><tbody>
<tr><td>62</td><td>$853,508</td><td>$2,845</td></tr>
<tr><td>65</td><td>$1,151,964</td><td>$3,840</td></tr>
<tr><td>67</td><td>$1,378,322</td><td>$4,594</td></tr>
</tbody></table></div>
<p>The three years from 62 to 65 add almost $300,000. Many school and hospital employees also have a pension, so the 403(b) only needs to cover the gap between the pension and their spending; the <a href="/pension-calculator">pension calculator</a> estimates that side.</p>`
    }
  ],
  faq: [
    { q: 'What is the 403(b) contribution limit for 2026?', a: '$24,500 in elective deferrals, plus $8,000 at age 50 and older or $11,250 at ages 60 to 63. Eligible long-service employees can add up to $3,000 more through the 15-year catch-up.' },
    { q: 'What is the most I can put in a 403(b) in 2026?', a: 'Up to $38,750 in deferrals if you are 60 to 63 and qualify for the full $3,000 service catch-up. Employer contributions are on top, up to a $72,000 total for employee and employer money, not counting age catch-ups.' },
    { q: 'How much should I contribute to my 403(b)?', a: 'At least enough to collect every employer dollar, then toward about 15% of pay in total. For a 52-year-old earning $95,000 with $180,000 saved, deferring 15% reaches $817,334 by 65 at 6%, while deferring the maximum reaches $1,151,964.' },
    { q: 'How much will my 403(b) be worth at retirement?', a: 'A 30-year-old earning $55,000 with $15,000 saved, deferring 8%, with a 5% employer contribution, 3% raises and a 6% return, would have about $1,311,341 at 65. Enter your own numbers above for your figure.' },
    { q: 'Is the 15-year catch-up $3,000 every year?', a: 'At most. It is capped at $15,000 over your lifetime and by the $5,000-per-year-of-service test, so most people who use it get it for one to five years.' },
    { q: 'Does a 403(b) have employer matching?', a: 'Many do, but nonprofits and schools often make a fixed contribution of a percentage of pay instead, or nothing. Enter whatever your employer adds as a percentage of pay.' },
    { q: 'What rate of return should I use for a 403(b)?', a: 'Between 5% and 7% is a reasonable range for a mix of stock and bond funds. For the default example, 5% gives $1,056,880 at 65 and 7% gives $1,256,455. Fixed annuity options usually credit less.' },
    { q: 'Can I have a 403(b) and a 457(b) at the same time?', a: 'Yes, and the limits are separate. A public school or state university employee can defer $24,500 to each in 2026, plus catch-ups in each plan.' },
    { q: 'Can I contribute to a 403(b) and a 401(k)?', a: 'Yes, but your elective deferrals to both together cannot exceed $24,500 (plus any catch-up). Employer contributions to each plan have their own separate limits.' },
    { q: 'Are 403(b) withdrawals taxed?', a: 'Pre-tax 403(b) money is taxed as ordinary income when you withdraw it. Roth 403(b) withdrawals are tax-free once you are 59½ and the Roth account is at least five years old.' },
    { q: 'Can I take money out of a 403(b) before 59½?', a: 'Usually only with a 10% additional tax on top of income tax, unless an exception applies. One common exception: you leave the employer in or after the year you turn 55 and take money from that employer\'s plan.' },
    { q: 'Does this calculator include my pension?', a: 'No. It projects the 403(b) only. If you also earn a pension, estimate it separately and plan for the 403(b) to cover the gap between the pension and the income you need.' },
    { q: 'What happens to my 403(b) and service catch-up if I change jobs?', a: 'You can leave the money in the old plan or roll it to the new employer\'s plan or an IRA. Your service count for the 15-year catch-up starts again at zero with the new employer.' }
  ],
  related: ['457-calculator', '401k-retirement-calculator', '401k-contribution-calculator', 'retirement-calculator', 'early-withdrawal-penalty-calculator'],
  sources: [
    { name: 'IRS: Retirement topics, 403(b) contribution limits', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-403b-contribution-limits' },
    { name: 'IRS: 401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500', url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500' },
    { name: 'IRS: Retirement topics, catch-up contributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions' },
    { name: 'IRS: 403(b) plans', url: 'https://www.irs.gov/retirement-plans/403b-plans' },
    { name: 'IRS: How much salary can you defer if you\'re eligible for more than one retirement plan?', url: 'https://www.irs.gov/retirement-plans/how-much-salary-can-you-defer-if-youre-eligible-for-more-than-one-retirement-plan' }
  ],
  disclaimer: 'Assumes a steady return and current IRS rules. Confirm your service catch-up amount with your plan administrator.'
};
