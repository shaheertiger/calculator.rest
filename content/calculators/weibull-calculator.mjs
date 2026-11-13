export default {
  slug: 'weibull-calculator',
  hub: 'statistics',
  name: 'Weibull Reliability Calculator',
  title: 'Weibull Calculator: Expected Failures, R(t) and B10 Life',
  h1: 'Weibull Reliability Calculator: Failure Probability and Expected Failures',
  meta: 'With β = 1.5 and η = 10,000 hours, 8.56% of units fail by 2,000 hours: 42.8 of 500. Get F(t), R(t), hazard, MTTF, B10 life and a fleet failure forecast.',
  keyword: 'how to calculate expected number of failures in weibull',
  also: ['weibull calculator', 'weibull reliability calculator', 'weibull distribution calculator', 'weibull failure rate calculator', 'how to calculate failure rate', 'weibull b10 life calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Units', type: 'select', value: 'pop', wide: true, options: [['pop', 'A population of units, all the same age'], ['fleet', 'A fleet in service at different ages (failure forecast)']] },
    { id: 'beta', label: 'Shape β (slope)', type: 'number', value: 1.5, help: 'β < 1 early failures, β = 1 random, β > 1 wear-out.' },
    { id: 'eta', label: 'Scale η (characteristic life)', type: 'number', value: 10000, help: 'Age by which 63.2% of units have failed.' },
    { id: 't', label: 'Age / operating time t', type: 'number', value: 2000, showIf: { mode: ['pop'] }, help: 'Same units as η: hours, cycles, miles, months…' },
    { id: 'units', label: 'Number of units', type: 'number', value: 500, showIf: { mode: ['pop'] } },
    { id: 'ages', label: 'Current age of each unit in service', type: 'text', multiline: 5, value: '500, 1200, 2000, 3500, 5000, 8000', showIf: { mode: ['fleet'] }, placeholder: 'One age per unit, separated by commas, spaces or new lines' },
    { id: 'dt', label: 'Forecast period (next Δt)', type: 'number', value: 1000, help: 'Extra operating time to forecast failures for. Leave blank to skip.' }
  ],
  compute(v, H) {
    var b = v.beta, e = v.eta;
    if (!(b > 0)) return { error: 'Enter a shape parameter β above 0.' };
    if (!(e > 0)) return { error: 'Enter a scale parameter η above 0.' };
    function R(t) { return t <= 0 ? 1 : Math.exp(-Math.pow(t / e, b)); }
    function haz(t) { return t <= 0 && b < 1 ? Infinity : (b / e) * Math.pow(Math.max(t, 0) / e, b - 1); }
    function n1(x) { return H.fix(x, x < 10 ? 2 : 1); }
    var mttf = e * Math.exp(H.gammaln(1 + 1 / b));
    var b10 = e * Math.pow(-Math.log(0.9), 1 / b);
    var dt = v.dt > 0 ? v.dt : 0;
    var common = [['Mean life (MTTF) η·Γ(1 + 1/β)', H.num(mttf, 0)], ['B10 life (10% failed)', H.num(b10, 0)]];
    if (v.mode === 'fleet') {
      var ages = H.list(v.ages).filter(function (a) { return a >= 0; });
      if (!ages.length) return { error: 'Enter the age of each unit still in service.' };
      if (!dt) return { error: 'Enter a forecast period Δt to forecast failures.' };
      var exp = 0, worst = 0, worstAge = 0;
      ages.forEach(function (a) { var q = 1 - R(a + dt) / R(a); exp += q; if (q > worst) { worst = q; worstAge = a; } });
      return {
        value: n1(exp), label: 'Expected failures in the next Δt = ' + H.num(dt, 0) + ' (of ' + ages.length + ' units in service)',
        expr: 'Σ [1 − R(age + ' + H.num(dt, 0) + ') ÷ R(age)]',
        rows: [['Units in service', String(ages.length)], ['Average failure chance per unit', H.pct(exp / ages.length * 100, 2), true], ['Highest-risk unit', 'age ' + H.num(worstAge, 0) + ': ' + H.pct(worst * 100, 2)], ['Expected survivors after Δt', n1(ages.length - exp)]].concat(common),
        sub: b > 1 ? 'β above 1 means wear-out: older units are more likely to fail in the next period, so replacing the oldest first cuts the forecast most.' : b < 1 ? 'β below 1 means early failures: units that have survived longer are now less likely to fail.' : 'β = 1 is a constant failure rate: every unit has the same chance regardless of age.',
        table: { head: ['Unit age', 'P(fail in next ' + H.num(dt, 0) + ')'], rows: ages.slice(0, 50).map(function (a) { return [H.num(a, 0), H.pct((1 - R(a + dt) / R(a)) * 100, 2)]; }) }
      };
    }
    var t = v.t, N = v.units;
    if (!(t >= 0)) return { error: 'Enter the operating time t.' };
    if (!(N > 0)) return { error: 'Enter the number of units.' };
    var Rt = R(t), F = 1 - Rt, h = haz(t);
    var rows = [['Unreliability F(t)', H.pct(F * 100, 2), true], ['Reliability R(t)', H.pct(Rt * 100, 2)], ['Expected survivors', n1(N * Rt)]];
    var nxt = 0;
    if (dt) {
      nxt = N * (Rt - R(t + dt));
      rows.push(['Expected failures from ' + H.num(t, 0) + ' to ' + H.num(t + dt, 0), n1(nxt), true]);
      rows.push(['Chance a survivor fails in that period', Rt > 0 ? H.pct((1 - R(t + dt) / Rt) * 100, 2) : '—']);
    }
    rows.push(['Hazard rate h(t)', isFinite(h) ? H.sig(h * 1000, 3) + ' per 1,000' : '∞']);
    rows = rows.concat(common);
    rows.push(['Excel', '<code>=' + Number(N.toFixed(4)) + '*WEIBULL.DIST(' + Number(t.toFixed(4)) + ',' + Number(b.toFixed(4)) + ',' + Number(e.toFixed(4)) + ',TRUE)</code>']);
    return {
      value: n1(N * F), label: 'Expected failures by t = ' + H.num(t, 0) + ' (of ' + H.num(N, 0) + ' units)',
      expr: H.num(N, 0) + ' × [1 − e^−(' + H.num(t, 0) + '/' + H.num(e, 0) + ')^' + H.num(b, 3) + ']',
      rows: rows,
      sub: (b > 1 ? 'Wear-out (β > 1): the failure rate rises with age.' : b < 1 ? 'Infant mortality (β < 1): the failure rate falls with age.' : 'Random failures (β = 1): the failure rate is constant.') + ' ' + H.pct(F * 100, 1) + ' of units are expected to fail by this age.',
      _F: F, _R: Rt, _h: h, _next: nxt
    };
  },
  quick: ({ r }) => `To calculate the expected number of failures with a Weibull model, multiply the number of units by the cumulative failure probability F(t) = 1 − e^−(t/η)^β. With <strong>β = 1.5, η = 10,000 hours</strong> and 500 units at 2,000 hours, F = 1 − e^−0.0894 = 8.56%, so expect <strong>${r.value} failures</strong>. Another 33.0 are expected between 2,000 and 3,000 hours.`,
  stepsTitle: 'How to calculate expected failures with a Weibull distribution',
  steps: [
    'Get β (shape) and η (scale) from a Weibull analysis of your own failure data, a supplier\'s reliability report or a published life test. Both must use the same time unit as your ages.',
    'Compute the unreliability at age t: F(t) = 1 − exp[−(t/η)<sup>β</sup>]. For t = 2,000, (2,000/10,000)<sup>1.5</sup> = 0.0894, so F = 1 − e<sup>−0.0894</sup> = 0.0856.',
    'Multiply by the number of units that started at age 0: 500 × 0.0856 = <strong>42.8</strong> expected failures.',
    'For failures in a <em>future</em> period, use only the survivors and the conditional probability: N × [R(t) − R(t + Δt)]. Applying F(t + Δt) to the whole population again double-counts units that already failed; this is the most common mistake.',
    'For a fleet with mixed ages, add up each unit\'s conditional probability of failing in the period. Switch the calculator to "fleet" mode and paste the ages.'
  ],
  formulaTitle: 'What are the Weibull reliability formulas?',
  formula: {
    expr: 'F(t) = 1 − e<sup>−(t/η)<sup>β</sup></sup> &nbsp; R(t) = e<sup>−(t/η)<sup>β</sup></sup><br>Expected failures by t = N × F(t)<br>Expected failures in (t, t+Δt] = N × [R(t) − R(t+Δt)]<br>h(t) = (β/η)(t/η)<sup>β−1</sup> &nbsp; MTTF = η·Γ(1 + 1/β) &nbsp; B10 = η(−ln 0.9)<sup>1/β</sup>',
    vars: [['β', 'shape parameter (Weibull slope)'], ['η', 'scale parameter, characteristic life (63.2% failed)'], ['t', 'age or operating time'], ['N', 'number of units'], ['R(t)', 'reliability: probability a unit survives to t'], ['h(t)', 'instantaneous failure (hazard) rate'], ['Γ', 'gamma function']],
    note: 'This is the two-parameter Weibull. A three-parameter model adds a failure-free period γ: replace t with t − γ (and use 0 when t < γ).'
  },
  example: `<p>500 pumps have run 2,000 hours. A Weibull fit of past failures gave β = 1.5 and η = 10,000 hours.</p>
<p>(t/η)<sup>β</sup> = 0.2<sup>1.5</sup> = 0.0894. F(2,000) = 1 − e<sup>−0.0894</sup> = <strong>8.56%</strong>, so about <strong>42.8 pumps</strong> should have failed and 457.2 survive.</p>
<p>Next 1,000 hours: R(3,000) = e<sup>−0.3<sup>1.5</sup></sup> = 0.8486. Expected failures = 500 × (0.9144 − 0.8486) = <strong>33.0</strong>. Each surviving pump has a 7.21% chance of failing in that window.</p>
<p>Mean life = 10,000 × Γ(1.667) = <strong>9,027 hours</strong>; B10 life = 10,000 × 0.1054<sup>1/1.5</sup> = <strong>2,231 hours</strong>.</p>`,
  table: {
    title: 'How many units fail over time with β = 1.5 and η = 10,000?',
    intro: 'Cumulative failures out of 500 units at different ages, computed with the calculator above. The hazard column shows wear-out: the failure rate keeps rising.',
    head: ['Age (hours)', 'F(t)', 'R(t)', 'Failures of 500', 'Hazard per 1,000 h'],
    rows: ({ run, H }) => [500, 1000, 2000, 3000, 5000, 7500, 10000, 12500, 15000, 20000].map(t => {
      const r = run({ mode: 'pop', t, units: 500, beta: 1.5, eta: 10000 });
      return [H.num(t, 0), H.pct(r._F * 100, 2), H.pct(r._R * 100, 2), r.value, H.fix(r._h * 1000, 4)];
    }),
    note: 'At t = η = 10,000 hours, 63.2% have failed. That is true for every β, which is why η is called the characteristic life.'
  },
  sections: [
    {
      h2: 'How do you calculate the expected number of failures in a Weibull analysis?',
      html: `<p>The expected number of failures is the number of units at risk multiplied by the probability each one fails in the time window. Which probability you use depends on the question:</p>
<ul>
<li><strong>Failures from new to age t</strong> (a batch that all started together): N × F(t). This is the default mode above.</li>
<li><strong>Failures in the next period for units that are still working</strong>: N<sub>surviving</sub> × [1 − R(t + Δt) ÷ R(t)]. The ratio R(t + Δt) ÷ R(t) is the conditional reliability: the chance of lasting another Δt given the unit has already reached t.</li>
<li><strong>A fleet of mixed ages</strong>: Σ [1 − R(aᵢ + Δt) ÷ R(aᵢ)] over every unit in service. This is the failure forecast described in Abernethy's <em>New Weibull Handbook</em> and used for spare-parts and warranty planning.</li>
</ul>
<p>The result is an expected value, so fractions are normal: 42.8 failures means "about 43 on average". Actual counts scatter around it; for N units with failure probability F, the standard deviation is √(N·F·(1 − F)), here √(500 × 0.0856 × 0.9144) ≈ 6.3, so anywhere from roughly 30 to 55 would not be surprising.</p>`
    },
    {
      h2: 'How do you forecast failures for units already in service?',
      html: `<p>List the current age of every unit that has not failed yet and choose a forecast window. For six pumps aged 500, 1,200, 2,000, 3,500, 5,000 and 8,000 hours (β = 1.5, η = 10,000), the chance each fails in the next 1,000 hours is 4.58%, 5.98%, 7.21%, 9.05%, 10.52% and 12.91%. They add up to <strong>0.50 expected failures</strong>: about a coin flip that one of them fails before the next 1,000 hours are up.</p>
<p>The older pumps carry more of the risk because β > 1. With β < 1 the order reverses: units that have survived early life are the safest. With β = 1 every unit has the same chance, 1 − e<sup>−Δt/η</sup>, whatever its age.</p>`
    },
    {
      h2: 'What do the Weibull shape and scale parameters mean?',
      html: `<p><strong>η (scale, characteristic life)</strong> stretches the time axis: double η and every failure happens twice as late. At t = η, F = 1 − e<sup>−1</sup> = 63.2% for any β.</p>
<p><strong>β (shape, slope)</strong> sets how the failure rate changes with age, the three phases of the "bathtub curve":</p>
<div class="twrap"><table><thead><tr><th>β</th><th>Failure pattern</th><th>Typical causes</th><th>Failures of 500 by 2,000 h (η = 10,000)</th></tr></thead><tbody>
<tr><td>0.5</td><td>Decreasing rate (infant mortality)</td><td>Manufacturing defects, poor burn-in</td><td>180.3</td></tr>
<tr><td>1.0</td><td>Constant rate (exponential)</td><td>Random overloads, electronics</td><td>90.6</td></tr>
<tr><td>1.5</td><td>Slowly rising rate</td><td>Early wear, bearings</td><td>42.8</td></tr>
<tr><td>2.0</td><td>Linearly rising rate (Rayleigh)</td><td>Wear, corrosion</td><td>19.6</td></tr>
<tr><td>3.0</td><td>Fast wear-out</td><td>Fatigue</td><td>4.0</td></tr>
<tr><td>5.0</td><td>Very sharp wear-out</td><td>Material fatigue near end of life</td><td>0.2</td></tr>
</tbody></table></div>
<p>The same η with different β gives very different early-life failure counts, which is why a single "MTBF" figure hides most of the story. With β = 1 the Weibull reduces to the exponential distribution and MTTF = η.</p>`
    },
    {
      h2: 'How do you calculate Weibull reliability in Excel?',
      html: `<p>Excel's <code>WEIBULL.DIST(x, alpha, beta, cumulative)</code> names its parameters the opposite way from most reliability texts: <strong>alpha is the shape (β)</strong> and <strong>beta is the scale (η)</strong>. Swapping them is the classic spreadsheet error.</p>
<ul>
<li>Unreliability F(t): <code>=WEIBULL.DIST(2000,1.5,10000,TRUE)</code> → 0.0856</li>
<li>Reliability R(t): <code>=1-WEIBULL.DIST(2000,1.5,10000,TRUE)</code> or <code>=EXP(-(2000/10000)^1.5)</code> → 0.9144</li>
<li>Expected failures: <code>=500*WEIBULL.DIST(2000,1.5,10000,TRUE)</code> → 42.8</li>
<li>Next 1,000 hours: <code>=500*(EXP(-(2000/10000)^1.5)-EXP(-(3000/10000)^1.5))</code> → 33.0</li>
<li>Mean life: <code>=10000*GAMMA(1+1/1.5)</code> → 9,027</li>
</ul>
<p>Google Sheets supports the same WEIBULL.DIST and GAMMA formulas. In R, use <code>pweibull(2000, shape = 1.5, scale = 10000)</code>.</p>`
    },
    {
      h2: 'How do you estimate β and η from failure data?',
      html: `<p>The quick method is median rank regression. Sort the n failure times, give the i-th one a median rank with Bernard's approximation F ≈ (i − 0.3) ÷ (n + 0.4), then regress y = ln(−ln(1 − F)) on x = ln(t). The slope is β and η = e<sup>−intercept/β</sup>. In Excel, <code>=SLOPE(y_range, x_range)</code> and <code>=INTERCEPT(y_range, x_range)</code> do the fit.</p>
<p>Maximum likelihood estimation is preferred when you have units that have not failed yet (suspensions or censored data), which is nearly always the case in the field; the NIST handbook works through an example. Fewer than about 5 to 10 failures make β very uncertain, so treat forecasts from small samples as rough.</p>`
    }
  ],
  faq: [
    { q: 'What is the characteristic life in a Weibull distribution?', a: 'The characteristic life is the scale parameter η: the age by which 63.2% of units have failed, regardless of β. It is not the same as the mean life unless β = 1.' },
    { q: 'How do you calculate B10 life from Weibull parameters?', a: 'B10 = η × (−ln 0.9)^(1/β) = η × 0.10536^(1/β). With β = 1.5 and η = 10,000 hours, B10 is 2,231 hours: 10% of units fail by then. For B1 life use ln 0.99 instead.' },
    { q: 'How do you calculate the Weibull failure rate?', a: 'The instantaneous failure (hazard) rate is h(t) = (β/η)(t/η)^(β−1). At 2,000 hours with β = 1.5 and η = 10,000 it is 0.0671 failures per 1,000 unit-hours, and it rises with age because β > 1.' },
    { q: 'Is MTBF the same as η?', a: 'Only when β = 1. MTTF (or MTBF for repairable systems with as-good-as-new repairs) is η × Γ(1 + 1/β): 9,027 hours for β = 1.5 and η = 10,000, and 8,862 hours for β = 2.' },
    { q: 'Why is my expected number of failures not a whole number?', a: 'It is an average over many possible outcomes. 42.8 expected failures means the long-run average is about 43; any single fleet will see a whole number scattered around it.' },
    { q: 'What does a Weibull shape parameter below 1 mean?', a: 'β below 1 means the failure rate decreases with age: weak units fail early and the survivors are more robust. It usually points to manufacturing or installation problems, and burn-in testing is the usual fix.' },
    { q: 'Can I use months or miles instead of hours?', a: 'Yes. The model only needs t and η in the same unit, whether hours, cycles, miles, starts or months in service.' },
    { q: 'How do I calculate conditional reliability?', a: 'Divide the reliability at the later age by the reliability at the current age: R(t + Δt) ÷ R(t). A pump that has run 2,000 hours has an 0.8486 ÷ 0.9144 = 92.8% chance of lasting another 1,000 hours.' }
  ],
  related: ['standard-deviation-calculator', 'confidence-interval-calculator', 'r-squared-calculator', 'p-value-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Weibull (reliability)', url: 'https://www.itl.nist.gov/div898/handbook/apr/section1/apr162.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Weibull Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3668.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Failure (or hazard) rate', url: 'https://www.itl.nist.gov/div898/handbook/apr/section1/apr123.htm' },
    { name: 'NIST/SEMATECH e-Handbook: A Weibull maximum likelihood estimation example', url: 'https://www.itl.nist.gov/div898/handbook/apr/section4/apr413.htm' },
    { name: 'Microsoft Support: WEIBULL.DIST function', url: 'https://support.microsoft.com/en-us/excel/functions/weibull-dist-function' },
    { name: 'NIST/SEMATECH e-Handbook: Probability plotting', url: 'https://www.itl.nist.gov/div898/handbook/apr/section2/apr221.htm' }
  ]
};
