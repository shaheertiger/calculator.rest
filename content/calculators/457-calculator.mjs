export default {
  slug: '457-calculator',
  hub: 'planning',
  name: '457(b) Calculator',
  seoTitle: '457(b) Calculator 2026: Double Catch-Up, No 10% Penalty',
  meta: 'Model a governmental 457(b): the final-3-year catch-up can double the $24,500 limit, and withdrawals after you leave skip the 10% penalty. Free 2026 calculator.',
  intro: 'Plug in your age, salary, what you defer and when you plan to leave your government job, and we\'ll show you what your 457(b) will hold, how much the special catch-up adds and what penalty-free access before 59½ is worth.',
  keyword: '457 retirement calculator',
  also: ['457 b retirement calculator', '457b retirement calculator', '457 retirement plan calculator', '457 plan retirement calculator', '457 b retirement plan calculator', '457 calculator retirement', 'what is a good rate of return on 457 calculator', 'retirement calculator with pension and 457'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'age', label: 'Your age now', type: 'number', value: 40, help: 'Your age today in whole years.' },
    { id: 'sep', label: 'Age you leave your government job', type: 'number', value: 52, help: 'Leaving the employer is what lets you draw from a 457(b) at any age.' },
    { id: 'nra', label: 'Plan\'s normal retirement age', type: 'number', value: 52, help: 'Set by your plan (often your pension\'s unreduced retirement age). The special catch-up covers the 3 years before it.' },
    { id: 'bal', label: '457(b) balance today', type: 'number', value: 60000, prefix: '$', help: 'The total on your latest deferred compensation statement.' },
    { id: 'salary', label: 'Annual salary', type: 'number', value: 90000, prefix: '$', help: 'Gross yearly pay from the government employer, before pension and plan deductions.' },
    { id: 'pct', label: '457(b) deferral', type: 'number', value: 10, suffix: '% of pay', help: 'The share of pay you elect to defer to the 457(b) outside the special catch-up years.' },
    { id: 'special', label: 'Use the special 3-year catch-up (defer up to double the limit)', type: 'checkbox', value: true, wide: true, help: 'Only if your plan offers it. In those 3 years the calculator defers the most the catch-up allows.' },
    { id: 'unused', label: 'Unused 457(b) limit from years before this one', type: 'number', value: 0, prefix: '$', help: 'The special catch-up can only make up limits you did not use in earlier years. Your plan administrator can tell you this number.', showIf: { special: [true, 'true'] } },
    { id: 'other', label: 'Also deferring to a 403(b) or 401(k)', type: 'number', value: 6000, prefix: '$', suffix: '/yr', help: 'Separate $24,500 limit. Enter 0 if you only have the 457(b).' },
    { id: 'raise', label: 'Annual raise', type: 'number', value: 3, suffix: '%', help: 'Average yearly pay increase, including step and cost-of-living raises.' },
    { id: 'ret', label: 'Annual return', type: 'number', value: 6, suffix: '%', help: 'Average yearly growth before inflation. Stable value or fixed funds usually credit less.' },
    { id: 'draw', label: 'Yearly withdrawal from leaving until 59½', type: 'number', value: 40000, prefix: '$', help: 'Used to show the 10% additional tax a 401(k) or IRA would charge on early withdrawals.' }
  ],
  data: { base: 24500, c50: 8000, c60: 11250, wr: 4 },
  compute(v, H, D) {
    if (!(v.age >= 15) || !(v.age < 100)) return { error: 'Enter your current age.' };
    if (!(v.sep > v.age) || v.sep > 100) return { error: 'Enter an age for leaving the job that is above your current age.' };
    if (!(v.salary > 0)) return { error: 'Enter your annual salary.' };
    if (!(v.pct >= 0) || v.pct > 100) return { error: 'Enter a deferral rate between 0 and 100%.' };
    var r = isNaN(v.ret) ? 0 : v.ret / 100, g = isNaN(v.raise) ? 0 : v.raise / 100;
    if (r <= -1) return { error: 'Enter a return above −100%.' };
    var sp = v.special === true || v.special === 'true';
    var nra = v.nra > 0 ? Math.round(v.nra) : Math.round(v.sep);
    var years = Math.round(v.sep - v.age), start = v.bal > 0 ? v.bal : 0;
    var oth = v.other > 0 ? Math.min(v.other, D.base) : 0;
    var bal = start, ob = 0, sal = v.salary, unused = sp && v.unused > 0 ? v.unused : 0;
    var you = 0, spTot = 0, spYears = 0, ageTot = 0, tbl = [];
    for (var i = 0; i < years; i++) {
      var a = Math.round(v.age) + i;
      var ageRoom = a >= 60 && a <= 63 ? D.c60 : a >= 50 ? D.c50 : 0;
      var inWindow = sp && a >= nra - 3 && a < nra && a < Math.round(v.sep);
      var spRoom = inWindow ? Math.min(D.base, unused) : 0;
      var want = sal * v.pct / 100;
      var mode = 'Regular';
      var d;
      if (inWindow && spRoom > ageRoom) { d = Math.min(D.base + spRoom, sal - oth); mode = 'Special catch-up'; }
      else { d = Math.min(want, D.base + ageRoom, sal - oth); if (d > D.base) mode = 'Age catch-up'; }
      if (inWindow && spRoom <= ageRoom) { d = Math.min(D.base + ageRoom, sal - oth); mode = ageRoom ? 'Age catch-up' : 'Regular'; }
      d = Math.max(0, d);
      var extra = Math.max(0, d - D.base);
      if (mode === 'Special catch-up') { unused -= extra; spTot += extra; spYears++; }
      else { ageTot += extra; if (!inWindow) unused += Math.max(0, D.base - Math.min(d, D.base)) * (sp ? 1 : 0); }
      bal = bal * (1 + r) + d * (1 + r / 2);
      ob = ob * (1 + r) + oth * (1 + r / 2);
      you += d;
      tbl.push([String(a), mode, H.money0(d), H.money0(bal)]);
      sal *= 1 + g;
    }
    var earlyYears = Math.max(0, 59.5 - v.sep);
    var drawAmt = v.draw > 0 ? v.draw : 0;
    var penalty = drawAmt * earlyYears * 0.10;
    var growth = bal - start - you;
    var rows = [
      ['Combined with your 403(b)/401(k)', H.money0(bal + ob)],
      ['10% additional tax the same withdrawals would owe from an IRA', earlyYears > 0 ? H.money0(penalty) + ' (' + H.num(earlyYears, 1) + ' yrs × ' + H.money0(drawAmt) + ')' : 'None: you leave at 59½ or later', true],
      ['Special catch-up used', sp ? H.money0(spTot) + ' over ' + H.plural(spYears, 'year') : 'Not used'],
      ['Your 457(b) deferrals', H.money0(you)],
      ['Investment growth', H.money0(growth)],
      ['Monthly income at a 4% withdrawal (457(b) only)', H.money0(bal * D.wr / 100 / 12)]
    ];
    if (ageTot > 0) rows.splice(3, 0, ['Age 50+ catch-up used', H.money0(ageTot)]);
    var sub = earlyYears > 0 ? 'Leaving at ' + H.num(v.sep, 1) + ', you can draw from a governmental 457(b) with no 10% additional tax, only income tax. Money rolled in from a 401(k) or IRA keeps its own penalty rules.' : 'You leave at 59½ or later, so the 457(b)\'s penalty-free access matters less; the extra deferral room is the main advantage.';
    if (sp && spYears === 0 && nra - 3 < Math.round(v.sep)) sub += ' The special catch-up added nothing: enter your unused limit from past years, or it may be smaller than the age 50+ catch-up.';
    return {
      value: H.money0(bal),
      label: '457(b) balance at age ' + H.num(v.sep, 0),
      expr: H.money0(start) + ' + ' + H.money0(you) + ' deferred over ' + years + ' yrs at ' + H.num(r * 100, 2) + '%',
      rows: rows,
      sub: sub,
      both: bal + ob, penalty: penalty, spTot: spTot, you: you, growth: growth, unused: unused,
      table: { head: ['Age', 'Limit used', 'You defer', '457(b) balance'], rows: tbl, caption: 'Deferrals and balance' }
    };
  },
  notes: {
    'Combined with your 403(b)/401(k)': 'The 457(b) plus the other plan\'s deferrals grown at the same return.',
    '10% additional tax the same withdrawals would owe from an IRA': 'The early-withdrawal tax a governmental 457(b) lets you skip before 59½.',
    'Special catch-up used': 'Extra deferrals above the regular limit in the 3 years before normal retirement age.',
    'Age 50+ catch-up used': 'Deferrals above $24,500 made with the age-based catch-up.',
    'Your 457(b) deferrals': 'Everything you put in from your paychecks until you leave.',
    'Investment growth': 'Returns earned on the 457(b) balance and new deferrals.',
    'Monthly income at a 4% withdrawal (457(b) only)': 'The 457(b) balance × 4% ÷ 12, before income tax.'
  },
  assumptions: 'These calculations are estimates. They assume a governmental 457(b), the same return every year, deferrals spread through each year, the full special catch-up in its window and 2026 IRS limits held flat. Confirm your unused limit with your plan.',
  quick: ({ r }) => `A 457 retirement calculator has to handle two perks that 401(k)s lack: a special catch-up that can double the limit and penalty-free access after you leave. A 40-year-old earning $90,000 with $60,000 in a governmental 457(b), deferring 10% and then $49,000 a year in the three years before a normal retirement age of 52, has <strong>${r.value}</strong> at 52 at a 6% return, and owes no 10% additional tax on withdrawals before 59½.`,
  formulaTitle: 'How are 457(b) limits and the special catch-up calculated?',
  formula: {
    expr: 'Regular year: Deferral = min(Salary × rate, $24,500 + age catch-up)<br>Special catch-up year (3 years before normal retirement age): Deferral = $24,500 + min($24,500, unused prior limits)<br>Each year: Balance = Balance × (1 + r) + Deferral × (1 + r ÷ 2)',
    vars: [['age catch-up', '$8,000 at 50–59 and 64+, $11,250 at 60–63 (2026)'], ['unused prior limits', 'limit you did not use in earlier years in the plan']],
    note: 'In each special catch-up year the calculator uses whichever is larger, the special catch-up or the age catch-up, because governmental plans do not allow both in the same year. Dollar limits are held at 2026 levels.'
  },
  example: `<p>Marcus is a 40-year-old county engineer earning $90,000, with $60,000 in the county's 457(b). He defers 10% and puts $6,000 a year into a 403(b) from a part-time teaching job. His plan's normal retirement age is 52.</p>
<p><strong>Ages 40–48:</strong> he defers about $9,000 to $11,400 a year, leaving $13,000 or more of each year's limit unused.</p>
<p><strong>Ages 49–51:</strong> the special catch-up lets him defer $24,500 + $24,500 = <strong>$49,000</strong> a year, $73,500 more than the regular limit over the three years. At 50 and 51 that beats the $8,000 age catch-up.</p>
<p><strong>At 52:</strong> his 457(b) holds <strong>$422,989</strong> at a 6% return, and $527,245 counting the 403(b). Without the special catch-up the 457(b) would hold $301,940. If he withdraws $40,000 a year from 52 to 59½, he pays income tax but no 10% additional tax; from an IRA the same withdrawals would owe about <strong>$30,000</strong> in additional tax.</p>`,
  table: {
    title: 'How much will a 457(b) hold at different separation ages?',
    intro: 'Marcus\'s plan with the normal retirement age set to each separation age, so the three special catch-up years come just before he leaves. Other inputs as above.',
    head: ['Leave at', '457(b) balance', 'With the $6,000/yr 403(b)', 'Years before 59½', '10% tax avoided on $40,000/yr'],
    rows: ({ run, H }) => [50, 52, 54, 55, 57, 59, 60, 62].map(a => {
      const r = run({ sep: a, nra: a });
      return [String(a), r.value, H.money0(r.both), a < 59.5 ? H.num(59.5 - a, 1) : '0', H.money0(r.penalty)];
    }),
    note: 'Compared with IRA withdrawals. A 401(k) or 403(b) left in or after the year you turn 55 (50 for public safety workers) is also exempt, so the 457(b)\'s edge is largest for people leaving earlier.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>A 457(b) is a government deferred compensation plan, and its two perks, a larger catch-up and access before 59½, both hinge on dates. That is why this calculator asks when you leave as well as what you save.</p>
<h3>Age now and age you leave</h3>
<p>Leaving the employer (a "severance from employment") is the event that opens the account. Enter the age you expect to stop working for this government employer, which for police, firefighters and teachers is often well before 59½.</p>
<h3>Plan's normal retirement age</h3>
<p>Your plan defines it, usually between 65 and 70½ or tied to the age your pension pays an unreduced benefit. The special catch-up window is the three years ending before it. If you are not sure, check the plan document; entering the wrong age moves the window.</p>
<h3>Balance, salary and deferral rate</h3>
<p>Use the total on your deferred compensation statement and your gross pay. The deferral rate applies in ordinary years; during the special catch-up window the calculator defers the most the catch-up allows, up to $49,000.</p>
<h3>Special catch-up and unused limit</h3>
<p>Turn it on only if your plan offers it. The common mistake is treating it as free room: it only recovers limits you left unused in earlier years, and in a governmental plan it replaces, rather than adds to, the age 50 catch-up. Enter unused room from before this year; the calculator adds what you leave unused from now on.</p>
<h3>Other plan deferrals</h3>
<p>If you also defer to a 403(b) or 401(k), enter that amount a year. It has its own separate limit, so it adds to, rather than shares, the 457(b) room.</p>
<h3>Raise, return and early withdrawals</h3>
<p>Public pay often rises with step increases plus cost-of-living raises; 3% is a fair middle. Then enter what you expect to withdraw each year between leaving and 59½ to see the 10% additional tax that money would owe if it sat in an IRA instead.</p>`
    },
    {
      h2: 'Is there a penalty for withdrawing from a 457(b) before 59½?',
      html: `<p>Not from a governmental 457(b).</p>
<h3>Why governmental plans are different</h3>
<p>The IRS lists governmental 457(b) distributions as not subject to the 10% additional tax on early distributions, at any age, once you have a distribution event, usually leaving the employer. You still owe ordinary income tax on pre-tax money. In the default example, avoiding the extra tax on $40,000 a year from 52 to 59½ saves $30,000.</p>
<h3>The rollover trap</h3>
<p>Money you rolled into the 457(b) from a 401(k), 403(b) or IRA keeps its original 10% rule. And rolling the 457(b) out to an IRA gives up the exemption. That makes the 457(b) a good bridge account for people who leave public service in their late 40s or early 50s. For the cost of early withdrawals from other plans, see the <a href="/early-withdrawal-penalty-calculator">401(k) early withdrawal calculator</a>.</p>
<h3>Non-governmental 457(b) plans</h3>
<p>Plans offered by some nonprofits to highly paid staff work differently: the money belongs to the employer until paid out, is exposed to the employer's creditors and cannot be rolled into an IRA.</p>`
    },
    {
      h2: 'Can you contribute to a 457(b) and a 403(b) at the same time?',
      html: `<p>Yes, and this is the biggest advantage of the 457(b). Its limit is not combined with deferrals to a 403(b) or 401(k).</p>
<h3>Two full limits</h3>
<p>In 2026 someone under 50 with both plans can defer $24,500 to each, $49,000 in total. From 50, add an $8,000 catch-up in each plan; at 60 to 63, $11,250 in each, for $71,500.</p>
<h3>What stacking adds</h3>
<p>If Marcus raised his 403(b) deferral from $6,000 to the full $24,500 while keeping the same 457(b) plan, the two accounts together would hold $848,702 at 52 instead of $527,245. The <a href="/403b-calculator">403(b) calculator</a> models the other half, including its separate 15-year service catch-up.</p>
<h3>Roth catch-ups for higher earners</h3>
<p>One 2026 change applies to both plans: if your FICA wages from that employer topped $150,000 in 2025, catch-up contributions have to be Roth.</p>`
    },
    {
      h2: 'How does the 457(b) special catch-up work?',
      html: `<p>For each of the three years ending before the plan's normal retirement age, you can defer the regular limit plus whatever limit you did not use in earlier years, up to double the regular limit: $49,000 in 2026. In Marcus's case it lifts the 457(b) at 52 from $301,940 to $422,989.</p>
<h3>Three rules that trip people up</h3>
<ul><li>It recovers only <strong>unused</strong> room. Someone who maxed out every year gets nothing extra.</li>
<li>In a governmental plan you cannot use it and the age 50 catch-up in the same year; you get whichever is larger. If your unused room is under $8,000 (or $11,250 at 60 to 63), the age catch-up wins.</li>
<li>The three years must be consecutive, end before normal retirement age and exclude the year you retire. You get the window only once.</li></ul>
<h3>Paying for it</h3>
<p>Deferring $49,000 a year takes about 39% of a $125,000 salary, so it needs planning: many people pay down debt or build cash in the years before the window opens.</p>`
    },
    {
      h2: 'What is a good rate of return on a 457 plan?',
      html: `<p>A 457(b) holds the same kinds of funds as a 401(k). Planners commonly model 6–7% a year before inflation for a stock-heavy mix and 4–5% for a balanced one, with no guarantee; a plan's stable value or fixed account usually credits less.</p>
<p>In Marcus's case, 5% a year gives $397,735 at 52, 6% gives $422,989 and 7% gives $450,426. With only 12 years to go and much of the money arriving at the end, how much he defers matters more than the return: raising his rate from 10% to 15% outside the catch-up years gives $493,779.</p>`
    },
    {
      h2: 'How long will my 457(b) last with a pension?',
      html: `<h3>Using the 457(b) as a bridge</h3>
<p>Many public employees leave with a pension that starts right away and use the 457(b) to cover the years before Social Security. Withdrawing a flat $40,000 a year from Marcus's $422,989, still earning 6%, the money lasts about 16 years 4 months, to around age 68. After seven years of withdrawals, at 59, about $289,451 is left. The <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a> runs this for any balance and spending level.</p>
<h3>Sizing the account to the pension gap</h3>
<p>Start with the income you need, subtract the pension and, later, Social Security, and plan for the 457(b) to fill only the difference. The <a href="/pension-calculator">pension calculator</a> estimates the pension side, and a pension that is reduced for early retirement is a reason to lean on the 457(b) for a few more years before claiming it.</p>`
    }
  ],
  faq: [
    { q: 'What is the 457(b) contribution limit for 2026?', a: '$24,500, plus $8,000 at age 50 and older or $11,250 at 60 to 63 in governmental plans. In the three years before normal retirement age, the special catch-up can raise the limit to $49,000 instead.' },
    { q: 'What is a good rate of return on a 457 plan?', a: 'Many planners assume 5–7% a year before inflation for a diversified mix. For a 40-year-old with $60,000 deferring 10% of $90,000, that range gives $397,735 to $450,426 by 52.' },
    { q: 'How much will my 457(b) be worth when I retire?', a: 'A 30-year-old earning $60,000 with $10,000 saved, deferring 10% with 3% raises and using the special catch-up before a normal retirement age of 55, would have about $617,606 at 55 at a 6% return.' },
    { q: 'How long will my 457 last?', a: 'Withdrawing $40,000 a year from $422,989 while earning 6%, about 16 years 4 months. To make the same balance last 30 years, the starting withdrawal would be about $2,481 a month.' },
    { q: 'How much does the 457(b) special catch-up add?', a: 'In the default example it lifts the balance at 52 from $301,940 to $422,989, about $121,049 more, by allowing $49,000 a year of deferrals in the last three years.' },
    { q: 'Does a 457(b) count toward the 401(k) limit?', a: 'No. Deferrals to a 457(b) are not combined with 401(k) or 403(b) deferrals, so you can defer the full limit to each.' },
    { q: 'Can I roll a 457(b) into an IRA?', a: 'A governmental 457(b) can be rolled into an IRA, 401(k) or 403(b) after you leave, but you then lose the 457(b)\'s exemption from the 10% early withdrawal tax. Many people leave enough in the 457(b) to cover the years before 59½.' },
    { q: 'When can I take money out of a 457(b)?', a: 'When you leave the employer, at any age; while still working, once you reach the age your plan allows or for an unforeseeable emergency. Required minimum distributions start at 73.' },
    { q: 'Are 457(b) withdrawals taxed?', a: 'Yes, pre-tax 457(b) money is taxed as ordinary income when withdrawn, though a governmental plan adds no 10% additional tax. Roth 457(b) money comes out tax-free once qualified, if your plan offers a Roth option.' },
    { q: 'Do 457(b) plans have an employer match?', a: 'Rarely, since most public employers also fund a pension. Any employer contribution counts toward the same $24,500 limit as your own deferrals.' },
    { q: 'Can I use the 457 special catch-up and the age 50 catch-up together?', a: 'Not in the same year in a governmental 457(b). You can use whichever gives the higher limit. In years outside the special catch-up window, the age 50 catch-up applies as normal.' },
    { q: 'What is the difference between a governmental and a non-governmental 457(b)?', a: 'Governmental plans, for state and local government workers, hold money in trust for you and can be rolled over. Non-governmental plans, offered by some tax-exempt employers to top earners, stay the employer\'s property until paid and cannot go to an IRA.' },
    { q: 'Can I contribute to a 457(b) and an IRA?', a: 'Yes. The 2026 IRA limit of $7,500, or $8,600 at 50 and older, is separate from the 457(b) limit, so a public employee can use both in the same year.' }
  ],
  related: ['403b-calculator', '401k-retirement-calculator', 'early-withdrawal-penalty-calculator', 'pension-calculator', 'retirement-age-calculator'],
  sources: [
    { name: 'IRS: IRC 457(b) deferred compensation plans', url: 'https://www.irs.gov/retirement-plans/irc-457b-deferred-compensation-plans' },
    { name: 'IRS: Non-governmental 457(b) deferred compensation plans', url: 'https://www.irs.gov/retirement-plans/non-governmental-457b-deferred-compensation-plans' },
    { name: 'IRS: Retirement topics, exceptions to tax on early distributions', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-exceptions-to-tax-on-early-distributions' },
    { name: 'IRS: How much salary can you defer if you\'re eligible for more than one retirement plan?', url: 'https://www.irs.gov/retirement-plans/how-much-salary-can-you-defer-if-youre-eligible-for-more-than-one-retirement-plan' },
    { name: 'IRS: 401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500', url: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500' }
  ],
  disclaimer: 'For governmental 457(b) plans unless noted. Assumes a steady return; confirm your unused limit and normal retirement age with your plan.'
};
