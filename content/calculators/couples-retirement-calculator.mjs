export default {
  slug: 'couples-retirement-calculator',
  hub: 'planning',
  name: 'Couples Retirement Calculator',
  meta: 'Estimate your joint retirement with our free couples retirement calculator. See your projected savings, the amount you need and how a spouse\'s death changes it.',
  intro: 'Plug in both spouses\' ages, savings, Social Security and your joint budget, and we\'ll show you whether your combined savings will last, including the years after one of you dies.',
  keyword: 'couple retirement calculator',
  also: ['retirement calculator for couples', 'retirement calculator for married couples', 'married retirement calculator', 'couples retirement calculator', 'retirement calculator for couple', 'married couple retirement calculator', 'retirement calculator married', 'retirement calculator with spouse', 'retirement calculator for couples with age difference', 'retirement calculator with spouse and social security', 'dual income retirement calculator', 'how much does a couple need to retire calculator', 'retirement calculator for couples retiring at different times'],
  updated: '2026-11-24',
  published: '2026-11-24',
  inputs: [
    { id: 'age1', label: 'Spouse 1: age now', type: 'number', value: 60, help: 'The first spouse\'s age today.' },
    { id: 'age2', label: 'Spouse 2: age now', type: 'number', value: 57, help: 'The second spouse\'s age today; the plan runs to this spouse\'s planning age.' },
    { id: 'ret1', label: 'Spouse 1: retirement age', type: 'number', value: 65, help: 'When spouse 1 stops working and contributing.' },
    { id: 'ret2', label: 'Spouse 2: retirement age', type: 'number', value: 65, help: 'When spouse 2 stops working. Withdrawals start once both have retired.' },
    { id: 'sav1', label: 'Spouse 1: retirement savings', type: 'number', value: 260000, prefix: '$', help: '401(k), IRA and brokerage money in spouse 1\'s name.' },
    { id: 'sav2', label: 'Spouse 2: retirement savings', type: 'number', value: 130000, prefix: '$', help: '401(k), IRA and brokerage money in spouse 2\'s name.' },
    { id: 'add1', label: 'Spouse 1: monthly contributions', type: 'number', value: 1500, prefix: '$', help: 'What spouse 1 adds each month, including any employer match.' },
    { id: 'add2', label: 'Spouse 2: monthly contributions', type: 'number', value: 1000, prefix: '$', help: 'What spouse 2 adds each month, including any employer match.' },
    { id: 'ss1', label: 'Spouse 1: Social Security per month', type: 'number', value: 2400, prefix: '$', help: 'Estimate at the age you will claim, in today\'s dollars. Starts at retirement age, but not before 62.' },
    { id: 'ss2', label: 'Spouse 2: Social Security per month', type: 'number', value: 1800, prefix: '$', help: 'Spouse 2\'s own benefit or spousal benefit, whichever is larger, in today\'s dollars.' },
    { id: 'spend', label: 'Joint spending in retirement per month (today\'s $)', type: 'number', value: 7000, prefix: '$', wide: true, help: 'Everything the household will spend each month once both are retired, including taxes and health premiums.' },
    { id: 'surv', label: 'Survivor\'s spending, % of joint spending', type: 'number', value: 80, suffix: '%', help: 'What one person spends after the other dies.' },
    { id: 'death', label: 'Survivor test: older spouse dies at age', type: 'number', value: 80, help: 'Age at which the older spouse is assumed to die in the survivor scenario. Enter 0 to skip the test.' },
    { id: 'horizon', label: 'Plan until the younger spouse is', type: 'number', value: 95, help: 'How long the money must last. 95 is a cautious choice for the younger spouse.' },
    { id: 'ret', label: 'Annual return', type: 'number', value: 6, suffix: '%', help: 'Average yearly growth before inflation on your combined savings.' },
    { id: 'infl', label: 'Inflation', type: 'number', value: 3, suffix: '%', help: 'Expected yearly price rise; results are shown in today\'s dollars.' }
  ],
  compute(v, H) {
    var a1 = v.age1, a2 = v.age2;
    if (!(a1 >= 18 && a1 < 110) || !(a2 >= 18 && a2 < 110)) return { error: 'Enter both ages (18 or older).' };
    var r1 = v.ret1 >= a1 ? v.ret1 : a1, r2 = v.ret2 >= a2 ? v.ret2 : a2;
    if (!(v.spend > 0)) return { error: 'Enter your joint monthly spending in retirement.' };
    var hz = v.horizon, young = Math.min(a1, a2);
    if (!(hz > young) || hz > 120) return { error: 'Enter a planning age above the younger spouse\'s age.' };
    function p(x) { return x > 0 ? x : 0; }
    var s1 = p(v.sav1), s2 = p(v.sav2), c1 = p(v.add1), c2 = p(v.add2), b1 = p(v.ss1), b2 = p(v.ss2);
    var surv = v.surv > 0 && v.surv <= 100 ? v.surv / 100 : 1;
    var ret = isNaN(v.ret) ? 0 : v.ret, inf = isNaN(v.infl) ? 0 : v.infl;
    if (ret <= -100 || inf <= -100) return { error: 'Enter a return and inflation above −100%.' };
    var i = Math.pow((1 + ret / 100) / (1 + inf / 100), 1 / 12) - 1;
    var older = a1 >= a2 ? 1 : 2;
    var dAge = v.death > 0 ? v.death : 0;
    var dm = dAge > 0 ? Math.round((dAge - (older === 1 ? a1 : a2)) * 12) : 1e9;
    if (dm < 0) dm = 0;
    var T = Math.round((hz - young) * 12);
    var t1 = Math.round((r1 - a1) * 12), t2 = Math.round((r2 - a2) * 12);
    var st1 = Math.round((Math.max(r1, 62) - a1) * 12), st2 = Math.round((Math.max(r2, 62) - a2) * 12);
    var tFirst = Math.min(t1, t2), tBoth = Math.max(t1, t2);
    // simulate months [from, T) starting with balance B; die = month the older spouse dies (or never)
    function sim(B, from, die) {
      var b = B, depl = -1;
      for (var m = from; m < T; m++) {
        var alive1 = !(older === 1 && m >= die), alive2 = !(older === 2 && m >= die);
        var add = (alive1 && m < t1 ? c1 : 0) + (alive2 && m < t2 ? c2 : 0);
        var bothAlive = alive1 && alive2;
        var allRet = (!alive1 || m >= t1) && (!alive2 || m >= t2);
        var out = 0;
        if (allRet) {
          var inc;
          if (bothAlive) inc = (m >= st1 ? b1 : 0) + (m >= st2 ? b2 : 0);
          else { var own = alive1 ? m >= st1 : m >= st2; inc = own ? Math.max(b1, b2) : 0; }
          out = v.spend * (bothAlive ? 1 : surv) - inc;
        }
        b = b - out + add;
        if (b < 0 && depl < 0) depl = m;
        b *= 1 + i;
      }
      return { b: b, depl: depl };
    }
    function need(die) {
      var lo = 0, hi = 1e5;
      while (sim(hi, tFirst, die).depl >= 0 && hi < 1e12) hi *= 2;
      for (var k = 0; k < 60; k++) { var mid = (lo + hi) / 2; if (sim(mid, tFirst, die).depl >= 0) lo = mid; else hi = mid; }
      return hi;
    }
    // projected savings at first retirement
    var bal = s1 + s2;
    for (var m = 0; m < tFirst; m++) { bal += (m < t1 ? c1 : 0) + (m < t2 ? c2 : 0); bal *= 1 + i; }
    var needBoth = need(1e9), needSurv = dm < T ? need(dm) : needBoth;
    var needed = Math.max(needBoth, needSurv);
    var diff = bal - needed;
    var onTrack = diff >= 0;
    var run2 = sim(bal, tFirst, dm < T ? dm : 1e9);
    var lastAge = run2.depl >= 0 ? young + run2.depl / 12 : hz;
    var extra = 0;
    if (!onTrack) {
      var n = tFirst;
      extra = n > 0 ? (Math.abs(i) < 1e-12 ? -diff / n : -diff * i / (Math.pow(1 + i, n) - 1) / (1 + i)) : NaN;
    }
    var olderAge = older === 1 ? a1 : a2;
    var rows = [
      ['Savings needed at first retirement', H.money0(needed)],
      [onTrack ? 'Cushion above what you need' : 'Shortfall', H.money0(Math.abs(diff)), true],
      ['Social Security while both alive', H.money0(b1 + b2) + '/mo'],
      ['Social Security for the survivor', H.money0(Math.max(b1, b2)) + '/mo (−' + H.money0(Math.min(b1, b2)) + ')'],
      ['Needed if both live to the end of the plan', H.money0(needBoth)],
      ['Needed in the survivor test', H.money0(needSurv)]
    ];
    if (!onTrack) rows.push(['Extra monthly saving until first retirement', isNaN(extra) ? 'retire later or spend less' : H.money0(extra), true]);
    rows.push([run2.depl >= 0 ? 'Savings run out when the younger spouse is' : 'Savings last until the younger spouse is', H.num(Math.floor(lastAge), 0) + (run2.depl >= 0 ? '' : '+')]);
    return {
      value: H.money0(bal),
      label: 'Projected joint savings at first retirement (today\'s $)',
      expr: 'In ' + H.ym(tFirst) + ', when spouse ' + (t1 <= t2 ? '1' : '2') + ' retires',
      rows: rows,
      bal: bal, needed: needed, needBoth: needBoth, needSurv: needSurv, diff: diff, onTrack: onTrack, lastAge: lastAge, extra: extra,
      sub: onTrack ? 'On track: you are projected to have ' + H.money0(diff) + ' more than the plan needs' + (dAge ? ', even in the survivor test.' : '.') : 'Not on track: the plan is ' + H.money0(-diff) + ' short; without changes, savings run out when the younger spouse is about ' + H.num(Math.floor(lastAge), 0) + '.'
    };
  },
  notes: {
    'Savings needed at first retirement': 'The larger of the two scenarios below: the balance that lasts to the planning age.',
    'Cushion above what you need': 'Projected savings minus the amount needed; your margin of safety.',
    'Shortfall': 'How far projected savings fall below what the harder scenario needs.',
    'Social Security while both alive': 'Both benefits added together once each spouse has claimed.',
    'Social Security for the survivor': 'The larger benefit the survivor keeps; the smaller one stops.',
    'Needed if both live to the end of the plan': 'Savings required if both spouses live to the planning age.',
    'Needed in the survivor test': 'Savings required if the older spouse dies at the age you entered.',
    'Extra monthly saving until first retirement': 'Additional joint saving each month that closes the shortfall.',
    'Savings run out when the younger spouse is': 'The younger spouse\'s age when the money is gone in the survivor test.',
    'Savings last until the younger spouse is': 'Savings still remain at the planning age in the survivor test.'
  },
  assumptions: 'These are estimates in today\'s dollars with a steady real return. They assume the working spouse\'s paycheck covers costs until both retire, benefits start at retirement but not before 62, and the survivor keeps the larger Social Security check.',
  quick: ({ r }) => `A couple aged 60 and 57 with $390,000 saved, adding $2,500 a month, will have <strong>${r.value}</strong> (today's dollars, 6% return, 3% inflation) when the older spouse retires at 65. With $7,000 of joint spending and $4,200 of Social Security, that covers the plan to 95 if both live, but if the older spouse dies at 80 they need <strong>$630,087</strong>: <strong>$18,391 short</strong>.`,
  formulaTitle: 'How does the couples calculation work?',
  formula: {
    expr: 'Before retirement: B<sub>m+1</sub> = (B<sub>m</sub> + C<sub>1</sub> + C<sub>2</sub>) × (1 + i)<br>After both retire: B<sub>m+1</sub> = (B<sub>m</sub> − Spending + SS<sub>1</sub> + SS<sub>2</sub>) × (1 + i)<br>After a death: SS = max(SS<sub>1</sub>, SS<sub>2</sub>) · Spending × survivor %',
    vars: [['B', 'joint savings, in today\'s dollars'], ['C<sub>1</sub>, C<sub>2</sub>', 'each spouse\'s monthly contribution, paid until that spouse retires'], ['i', 'real monthly return: [(1 + return) ÷ (1 + inflation)]<sup>1/12</sup> − 1'], ['SS<sub>1</sub>, SS<sub>2</sub>', 'each benefit, starting at that spouse\'s retirement age but not before 62']],
    note: 'Savings needed is the smallest balance at the first retirement that lasts until the younger spouse reaches the planning age, found by trial and error in two scenarios: both spouses live, and the older spouse dies at the age you enter. The calculator uses the larger. While one spouse still works, it assumes that paycheck covers household costs, so withdrawals start when both have retired.'
  },
  example: `<p>Dan is 60 and Rosa is 57. Dan has $260,000 in his 401(k) and adds $1,500 a month; Rosa has $130,000 and adds $1,000. Both plan to retire at 65. Their Social Security estimates are $2,400 and $1,800 a month, and they expect to spend $7,000 a month together. They assume 6% returns and 3% inflation, a real return of about 2.9%, and plan until Rosa is 95.</p>
<p><strong>Savings at Dan's retirement:</strong> five years of growth and contributions take $390,000 to <strong>$611,696</strong> in today's dollars. Rosa keeps working and saving for three more years.</p>
<p><strong>If both live:</strong> once Rosa retires, Social Security pays $4,200 and savings supply $2,800 a month. That plan needs $586,172 at Dan's retirement, so they would have a $25,524 cushion.</p>
<p><strong>Survivor test:</strong> if Dan dies at 80, Rosa (77) keeps his $2,400 benefit, the larger of the two, and her own $1,800 stops. At 80% of joint spending she needs $5,600 a month, so savings must supply $3,200, more than before. This scenario needs <strong>$630,087</strong>. They are <strong>$18,391 short</strong>, and the money would run out when Rosa is 93. Saving an extra <strong>$285 a month</strong> until Dan retires closes the gap.</p>`,
  table: {
    title: 'What happens to the plan if one spouse dies early?',
    intro: 'The example couple\'s plan, rerun with the older spouse dying at different ages, computed by the calculator above. Projected savings at the first retirement are $611,696 in every row.',
    head: ['Older spouse dies at', 'Savings needed', 'Cushion or shortfall', 'Savings last until younger spouse is'],
    rows: ({ run, H }) => [70, 75, 80, 85, 90, 0].map(d => { const x = run({ death: d }); const need = d ? x.needSurv : x.needBoth; const diff = x.bal - need; return [d ? String(d) : 'Both live to the end', H.money0(need), (diff >= 0 ? '+' : '−') + H.money0(Math.abs(diff)), x.lastAge >= 95 ? '95+' : H.num(Math.floor(x.lastAge), 0)]; }),
    note: 'An early death costs more than a late one because the survivor lives longer on one Social Security check. With survivor spending at 70% or less of joint spending, the death scenario stops being the binding case for this couple.'
  },
  sections: [
    {
      h2: 'Understanding your inputs',
      html: `<p>A couple's plan has more moving parts than a single person's: two paychecks that stop on different dates, two benefits that start on different dates, and a second phase after one spouse dies. Here is how to fill in each group of boxes.</p>
<h3>Ages and retirement ages</h3>
<p>Enter each spouse's own age and the age that spouse will stop working. If you both plan to stop on the same calendar date, enter the same retirement <em>year</em> for each, not the same age: with a three-year gap, Rosa retiring at 62 is the same date as Dan retiring at 65.</p>
<h3>Savings and monthly contributions</h3>
<p>Count 401(k), IRA and taxable accounts for both, plus any employer match. The calculator pools them, because the household spends from one pot, but keeps each spouse's contributions running only until that spouse retires.</p>
<h3>Social Security for each spouse</h3>
<p>Use each estimate at the age that spouse will claim, from both my Social Security accounts. A lower earner may be due a spousal benefit of up to half the other spouse's full-retirement-age amount; use the larger figure. Benefits start at the retirement age you enter, but never before 62.</p>
<h3>Joint monthly spending</h3>
<p>Set household spending in today's dollars, including income taxes on withdrawals and two sets of Medicare premiums. Leave out contributions and work costs that stop at retirement.</p>
<h3>Survivor spending and the survivor test</h3>
<p>Couples most often skip this step. When one spouse dies, one Social Security check stops, yet the survivor's costs fall by far less than half. Enter the age at which the older spouse dies and what the survivor would spend as a share of joint spending; 80% is the default.</p>
<h3>Planning age, return and inflation</h3>
<p>Plan until the younger spouse is at least 95. The return and inflation combine into a real return, about 2.9% in the example, so every figure stays in today's dollars.</p>`
    },
    {
      h2: 'What Social Security does a surviving spouse get?',
      html: `<p>When one spouse dies, the household goes from two Social Security checks to one.</p>
<h3>The larger check continues</h3>
<p>A widow or widower who has reached survivor full retirement age can receive <strong>100% of the deceased spouse's benefit</strong>; survivors can start as early as 60 at a reduced amount. Someone eligible for both their own retirement benefit and a survivor benefit is paid the higher of the two, not both. In practice, the survivor keeps the <strong>larger of the two checks</strong> and the smaller one disappears. That is why the calculator drops household Social Security from $4,200 to $2,400 a month in the example.</p>
<h3>Why the higher earner often delays</h3>
<p>If the deceased spouse claimed early, the survivor benefit can be lower than their full-retirement-age amount, which is one reason many couples have the higher earner delay claiming until 70: the bigger check is the one that lasts for the second lifetime. Raising Dan's benefit from $2,400 to $2,700 a month turns the example's $18,391 shortfall into a $48,113 cushion. The <a href="/social-security-calculator">Social Security benefits calculator</a> shows how each benefit and the spousal amount are worked out.</p>`
    },
    {
      h2: 'How do couples with an age difference plan for retirement?',
      html: `<p>Plan to the younger spouse's life expectancy, not the average of the two. A three-year gap with both retiring at 65 means the paychecks stop three years apart, and so does Social Security. The calculator handles this month by month. Changing only Rosa's age in the example, with her horizon kept at 95:</p>
<div class="twrap"><table><thead><tr><th>Rosa's age now</th><th>Savings needed</th><th>Cushion or shortfall</th></tr></thead><tbody>
<tr><td>60 (same age)</td><td>$714,615</td><td>−$102,919</td></tr>
<tr><td>57 (3 years younger)</td><td>$630,087</td><td>−$18,391</td></tr>
<tr><td>54 (6 years younger)</td><td>$552,534</td><td>+$59,162</td></tr>
<tr><td>50 (10 years younger)</td><td>$458,994</td><td>+$152,702</td></tr>
</tbody></table></div>
<h3>A younger working spouse helps</h3>
<p>Her paycheck covers costs and her contributions keep going after Dan stops, so the pooled savings get a few more years to grow before withdrawals begin.</p>
<h3>Retiring on the same date costs more</h3>
<p>The catch: this assumes the younger spouse really does keep working. If Rosa stops at 62, the same month as Dan, the plan needs $761,318 and the couple is $149,622 short. Going the other way, if Dan works to 67 while Rosa keeps her plan, the couple ends up with a $17,620 cushion.</p>`
    },
    {
      h2: 'How much does a married couple need to retire?',
      html: `<p>Start from joint spending, subtract both Social Security benefits and any pensions, and multiply the yearly gap by 25 as a first estimate. Dan and Rosa's $2,800 monthly gap is $33,600 a year, or $840,000 at a 4% withdrawal rate.</p>
<h3>Why the calculator's figure is lower</h3>
<p>The calculator's answer is $586,172 if both live, because it uses their actual 30-year horizon, Rosa's extra working years and a steady 2.9% real return, while 4% is designed to survive bad markets. Treat the difference as your margin of safety, not spare money.</p>
<h3>Spending is the strongest lever</h3>
<p>Trimming joint spending from $7,000 to $6,500 a month turns the shortfall into an $81,471 cushion. A single person's target is covered by the <a href="/retirement-calculator">retirement savings calculator</a>; this page adds what only couples face: two retirement dates, two benefits and the survivor years.</p>`
    },
    {
      h2: 'Should we merge our retirement savings in the calculator?',
      html: `<p>For planning, yes: the household spends from one pool, so the calculator adds both balances together.</p>
<h3>The accounts stay separate on paper</h3>
<p>Legally the accounts stay separate. A 401(k) or IRA belongs to one spouse, each has its own required minimum distributions from age 73, and the surviving spouse can roll an inherited account into their own.</p>
<h3>Keep beneficiary forms current</h3>
<p>Name each other as beneficiaries and check those forms after any marriage, divorce or move to a new employer. A will does not override the beneficiary named on a retirement account.</p>`
    }
  ],
  faq: [
    { q: 'How much should a couple have saved for retirement?', a: 'Enough to cover joint spending minus both Social Security benefits for as long as the younger spouse may live. In the example, a couple spending $7,000 a month with $4,200 of Social Security needs about $586,172 if both live and $630,087 if one spouse dies at 80.' },
    { q: 'How much does a couple need to retire?', a: 'A quick estimate is 25 times the yearly gap between spending and both benefits: a $2,800 monthly gap means $840,000 at a 4% withdrawal rate. The calculator refines this for your ages, retirement dates and the survivor years.' },
    { q: 'What happens to Social Security when a spouse dies?', a: 'The surviving spouse keeps the larger of the two benefits and the smaller one stops. At survivor full retirement age the survivor can receive 100% of what the deceased spouse was getting.' },
    { q: 'How much less does a widow or widower spend?', a: 'Usually far less than half drops away, since housing, utilities and the car cost about the same for one person. At 70% of joint spending the example couple has a $25,524 cushion; at 90% they are $95,241 short.' },
    { q: 'What if we retire at different times?', a: 'Enter each spouse\'s own retirement age. The calculator keeps the working spouse\'s contributions going and starts withdrawals only when both have retired.' },
    { q: 'How does an age difference change a couple\'s retirement plan?', a: 'The plan must run to the younger spouse\'s planning age. In the example, a same-age couple is $102,919 short, while a 10-year gap with the younger spouse still working leaves a $152,702 cushion.' },
    { q: 'Should the higher earner delay Social Security?', a: 'Often, yes. Each year past full retirement age adds 8% until 70, and the larger check is the one the survivor keeps. It matters most when the higher earner is older or has shorter life expectancy.' },
    { q: 'How long should a couple plan for?', a: 'Until the younger spouse is at least 95. Planning only to 90 drops the example couple\'s need to $549,937, but leaves less room if the younger spouse lives longer.' },
    { q: 'Is a spousal benefit the same as a survivor benefit?', a: 'No. A spousal benefit, paid while both are alive, is up to 50% of the worker\'s full-retirement-age amount. A survivor benefit, paid after a death, can be up to 100% of what the deceased received.' },
    { q: 'How do I include a pension in a couples retirement plan?', a: 'Add a pension to the Social Security figure of the spouse who receives it, if it continues for life. If it pays a reduced survivor amount, the survivor test will be slightly optimistic, so check the plan\'s joint-and-survivor option.' },
    { q: 'How much extra should we save if the plan is short?', a: 'The calculator shows it as "Extra monthly saving until first retirement". For the example couple it is $285 a month until the older spouse retires at 65.' },
    { q: 'What return should a couple assume?', a: 'Many couples use 5–7% before inflation for a balanced portfolio. At 7% instead of 6%, the example couple moves from an $18,391 shortfall to a $99,392 cushion, which shows how sensitive the result is.' }
  ],
  related: ['retirement-calculator', 'social-security-calculator', 'retirement-age-calculator', 'retirement-income-calculator', '401k-retirement-calculator'],
  sources: [
    { name: 'Social Security Administration: What you could get from survivor benefits', url: 'https://www.ssa.gov/survivor/amount' },
    { name: 'Social Security Administration: Survivors Benefits (PDF)', url: 'https://www.ssa.gov/pubs/EN-05-10084.pdf' },
    { name: 'Social Security Administration: Benefits for your spouse', url: 'https://www.ssa.gov/benefits/retirement/planner/applying7.html' },
    { name: 'Social Security Administration: Delayed retirement credits', url: 'https://www.ssa.gov/benefits/retirement/planner/delayret.html' },
    { name: 'IRS: Retirement topics, beneficiary', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-beneficiary' }
  ],
  disclaimer: 'Illustration in today\'s dollars with a steady return. Not financial or Social Security advice.'
};
