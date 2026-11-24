export default {
  slug: '403b-calculator',
  hub: 'planning',
  name: '403(b) Calculator',
  title: '403(b) Retirement Calculator: $180K at 52 Grows to $1.15M',
  h1: '403(b) Calculator With the 15-Year Service Catch-Up and 2026 Limits',
  meta: 'A 52-year-old with 16 years of service can defer $35,500 to a 403(b) in 2026. Maxing out from $180,000 at 6% reaches $1,151,964 by 65.',
  keyword: '403b retirement calculator',
  also: ['403b calculator retirement', '403 b retirement calculator', 'retirement calculator 403b', 'retirement 403b calculator', 'how much should i contribute to my 403b calculator', '403b retirement plan calculator', '403 b retirement plan calculator'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Your age now', type: 'number', value: 52 },
    { id: 'retAge', label: 'Retirement age', type: 'number', value: 65 },
    { id: 'bal', label: '403(b) balance today', type: 'number', value: 180000, prefix: '$' },
    { id: 'salary', label: 'Annual salary', type: 'number', value: 95000, prefix: '$' },
    { id: 'mode', label: 'How much you defer', type: 'select', value: 'max', options: [['max', 'The most the IRS allows me each year'], ['pct', 'A percentage of salary']] },
    { id: 'pct', label: 'Deferral rate', type: 'number', value: 15, suffix: '% of pay', showIf: { mode: ['pct'] } },
    { id: 'svcOn', label: 'My plan offers the 15-year service catch-up', type: 'checkbox', value: true },
    { id: 'svc', label: 'Years of service with this employer', type: 'number', value: 16, showIf: { svcOn: [true, 'true'] }, help: 'Counted with the employer sponsoring this 403(b): a school district, hospital, university or church.' },
    { id: 'prior', label: 'Total you have deferred to this employer\'s plans in past years', type: 'number', value: 40000, prefix: '$', showIf: { svcOn: [true, 'true'] }, help: 'Used in the $5,000 × years of service test. Include 401(k), 457(b) and SIMPLE deferrals with the same employer.' },
    { id: 'used', label: '15-year catch-up already used', type: 'number', value: 0, prefix: '$', showIf: { svcOn: [true, 'true'] } },
    { id: 'er', label: 'Employer contribution', type: 'number', value: 5, suffix: '% of pay', help: 'Many 403(b) employers contribute a fixed percentage whether or not you defer.' },
    { id: 'raise', label: 'Annual raise', type: 'number', value: 3, suffix: '%' },
    { id: 'ret', label: 'Annual return', type: 'number', value: 6, suffix: '%' }
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
      ['Your deferrals (incl. ' + H.money0(a1.ageTot) + ' age catch-up)', H.money0(a1.you)],
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
  quick: ({ r }) => `A 403(b) retirement calculator should apply the limits only these plans have. A 52-year-old hospital or school employee with $180,000 saved, a $95,000 salary, 16 years of service and a 5% employer contribution can defer <strong>$35,500</strong> in 2026: $24,500, plus a $3,000 service catch-up, plus $8,000 for age. Deferring the maximum every year at a 6% return grows to <strong>${r.value}</strong> by 65.`,
  stepsTitle: 'How to project a 403(b) with every catch-up you qualify for',
  steps: [
    'Enter your age, retirement age, current 403(b) balance and salary. Choose "the most the IRS allows" to see the ceiling, or enter a percentage to model what you actually defer.',
    'Tick the 15-year service catch-up only if your plan document offers it. Not every 403(b) does, and it exists only for employees of schools, hospitals, home health and health and welfare service agencies, and churches.',
    'Enter your years with this employer and the total you have deferred to its plans in earlier years. This is the step people skip: the $5,000 × years-of-service test often shrinks or removes the extra $3,000, especially for long-time savers.',
    'Add the employer contribution as a percentage of pay. Many nonprofits and public schools contribute a fixed share instead of a match.',
    'Read the year-by-year schedule to see which years get each catch-up.'
  ],
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
      h2: 'Who qualifies for the 403(b) 15-year catch-up?',
      html: `<p>You need three things: at least 15 years of service with the same employer, an employer that is a qualified organization (a public school system, college or university, hospital, home health service agency, health and welfare service agency, church or association of churches), and a plan that offers it. Years at a different employer do not count, even another school district.</p>
<p>The $5,000 test is what decides most cases. It compares your lifetime deferrals with that employer to $5,000 per year of service. Someone who deferred little early in their career has room; someone who has maxed out for years usually has none. For Denise's 16 years of service:</p>
<div class="twrap"><table><thead><tr><th>Deferred to this employer before 2026</th><th>Service catch-up she can use</th><th>Extra balance at 65</th></tr></thead><tbody>
<tr><td>$0 or $10,000</td><td>$9,000 over 3 years</td><td>$17,617</td></tr>
<tr><td>$20,000 or $40,000</td><td>$6,000 over 2 years</td><td>$12,083</td></tr>
<tr><td>$60,000 to $75,000</td><td>$3,000 in 1 year</td><td>$6,218</td></tr>
<tr><td>$80,000</td><td>$0</td><td>$0</td></tr>
</tbody></table></div>
<p>Even with no past deferrals, maxing out adds $35,500 a year to the running total while the allowance grows only $5,000, so the catch-up closes within a few years.</p>`
    },
    {
      h2: 'Can you use the 15-year catch-up and the age 50 catch-up together?',
      html: `<p>Yes. In 2026 a 403(b) participant aged 50 to 59 (or 64 and older) who qualifies for the full service catch-up can defer up to $35,500. At 60 to 63 the age catch-up rises to $11,250, so the ceiling is $38,750 if the service catch-up still applies. The calculator applies the excess over $24,500 to the service catch-up first, as IRS rules require, which can use up service room you might have preferred to save.</p>
<p>A 2026 change applies to both: if your FICA wages from this employer were over $150,000 in 2025, catch-up contributions must be made as Roth (after-tax) money. If your plan has no Roth option, you cannot make catch-ups at all.</p>`
    },
    {
      h2: 'How much should I contribute to my 403(b)?',
      html: `<p>Start with whatever earns the full employer contribution or match, then aim for a total savings rate, yours plus the employer's, of roughly 15% of pay if you are starting in your 30s and more if you start later. Denise's numbers show the range: deferring 15% of pay instead of the maximum leaves her with $817,334 at 65 instead of $1,151,964, a difference of about $1,115 a month at a 4% withdrawal.</p>
<p>The <a href="/401k-contribution-calculator">paycheck contribution calculator</a> turns a percentage into a per-paycheck amount (it works the same for a 403(b)). If you work for a state or local government, you may also have a 457(b) with its own separate $24,500 limit; the <a href="/457-calculator">457(b) calculator</a> shows how stacking the two adds up. For a standard plan with a match formula, use the <a href="/401k-retirement-calculator">401(k) retirement calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the 403(b) contribution limit for 2026?', a: '$24,500 in elective deferrals, plus $8,000 at age 50 and older or $11,250 at ages 60 to 63. Eligible long-service employees can add up to $3,000 more through the 15-year catch-up.' },
    { q: 'What is the most I can put in a 403(b) in 2026?', a: 'Up to $38,750 in deferrals if you are 60 to 63 and qualify for the full $3,000 service catch-up. Employer contributions are on top, up to a $72,000 total for employee and employer money, not counting age catch-ups.' },
    { q: 'Is the 15-year catch-up $3,000 every year?', a: 'At most. It is capped at $15,000 over your lifetime and by the $5,000-per-year-of-service test, so most people who use it get it for one to five years.' },
    { q: 'Does a 403(b) have employer matching?', a: 'Many do, but nonprofits and schools often make a fixed contribution of a percentage of pay instead, or nothing. Enter whatever your employer adds as a percentage of pay.' },
    { q: 'Can I have a 403(b) and a 457(b) at the same time?', a: 'Yes, and the limits are separate. A public school or state university employee can defer $24,500 to each in 2026, plus catch-ups in each plan.' },
    { q: 'Can I contribute to a 403(b) and a 401(k)?', a: 'Yes, but your elective deferrals to both together cannot exceed $24,500 (plus any catch-up). Employer contributions to each plan have their own separate limits.' }
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
