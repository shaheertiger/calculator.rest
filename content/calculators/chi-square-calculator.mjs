export default {
  slug: 'chi-square-calculator',
  hub: 'statistics',
  name: 'Chi-Square Calculator',
  title: 'Chi-Square Calculator: χ² = 17.16, df = 4, p = 0.0018 (Steps)',
  h1: 'Chi-Square Test Calculator: Goodness of Fit and Independence',
  meta: 'Store visits of 42, 38, 45, 50 and 75 against an even split give χ² = 17.16 with 4 df, p = 0.0018. Get χ², expected counts, p and the Excel formulas.',
  keyword: 'how to calculate a chi square statistic',
  also: ['chi square calculator', 'how to calculate expected value in chi square test', 'how to calculate chi square test in excel', 'chi square test of independence calculator', 'chi square goodness of fit calculator', 'how to calculate expected frequency chi square'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'Test', type: 'select', value: 'gof', wide: true, options: [['gof', 'Goodness of fit (one row of counts)'], ['ind', 'Test of independence (contingency table)']] },
    { id: 'obs', label: 'Observed counts', type: 'text', multiline: 3, value: '42, 38, 45, 50, 75', showIf: { mode: ['gof'] }, placeholder: 'e.g. 42, 38, 45, 50, 75' },
    { id: 'exp', label: 'Expected counts or proportions (blank = all equal)', type: 'text', multiline: 3, value: '', showIf: { mode: ['gof'] }, placeholder: 'e.g. 0.2, 0.2, 0.2, 0.2, 0.2 or 50, 50, 50, 50, 50' },
    { id: 'tbl', label: 'Observed table: one row per line, columns separated by spaces or commas', type: 'text', multiline: 5, wide: true, value: '30 20 10\n20 25 35', showIf: { mode: ['ind'] } },
    { id: 'alpha', label: 'Significance level α', type: 'number', value: 0.05 }
  ],
  compute(v, H) {
    var a = v.alpha > 0 && v.alpha < 1 ? v.alpha : 0.05;
    function pf(p) { return p < 0.0001 ? H.sig(p, 3) : H.fix(p, 4); }
    var chi = 0, df, low = 0, cells = 0, extra = [], table;
    if (v.mode === 'ind') {
      var lines = String(v.tbl || '').split(/\n+/).map(function (l) { return H.list(l); }).filter(function (r) { return r.length; });
      if (lines.length < 2) return { error: 'Enter at least 2 rows, one per line.' };
      var c = lines[0].length;
      if (c < 2 || lines.some(function (r) { return r.length !== c; })) return { error: 'Every row needs the same number of columns (at least 2).' };
      if (lines.some(function (r) { return r.some(function (x) { return x < 0; }); })) return { error: 'Counts cannot be negative.' };
      var R = lines.map(function (r) { return H.sum(r); }), C = [], N = H.sum(R);
      for (var j = 0; j < c; j++) C.push(H.sum(lines.map(function (r) { return r[j]; })));
      if (!(N > 0) || R.some(function (x) { return x === 0; }) || C.some(function (x) { return x === 0; })) return { error: 'Every row and column needs a total above 0.' };
      var erows = [];
      lines.forEach(function (r, i) {
        var er = ['Row ' + (i + 1)];
        r.forEach(function (o, j) { var e = R[i] * C[j] / N; chi += (o - e) * (o - e) / e; cells++; if (e < 5) low++; er.push(H.num(o, 2) + ' / ' + H.fix(e, 2)); });
        erows.push(er);
      });
      df = (lines.length - 1) * (c - 1);
      var head = ['']; for (var k = 0; k < c; k++) head.push('Col ' + (k + 1) + ' obs / exp');
      table = { head: head, rows: erows, caption: 'Expected = row total × column total ÷ grand total (' + H.num(N, 0) + ')' };
      extra.push(['Table size', lines.length + ' × ' + c + ', N = ' + H.num(N, 2)]);
      extra.push(['Cramér\'s V (effect size)', H.fix(Math.sqrt(chi / (N * (Math.min(lines.length, c) - 1))), 3)]);
    } else {
      var o = H.list(v.obs), e = H.list(v.exp);
      if (o.length < 2) return { error: 'Enter at least 2 observed counts.' };
      if (o.some(function (x) { return x < 0; })) return { error: 'Counts cannot be negative.' };
      var T = H.sum(o);
      if (!(T > 0)) return { error: 'The observed counts add to 0.' };
      if (!e.length) e = o.map(function () { return T / o.length; });
      if (e.length !== o.length) return { error: 'Enter one expected value for each observed count (' + o.length + ').' };
      if (e.some(function (x) { return !(x > 0); })) return { error: 'Expected values must be above 0.' };
      var Es = H.sum(e);
      var scaled = Math.abs(Es - T) > 1e-9 * T;
      e = e.map(function (x) { return x * T / Es; });
      var rows2 = [];
      o.forEach(function (x, i) { var q = (x - e[i]) * (x - e[i]) / e[i]; chi += q; cells++; if (e[i] < 5) low++; rows2.push([String(i + 1), H.num(x, 2), H.fix(e[i], 2), H.fix(q, 3)]); });
      df = o.length - 1;
      table = { head: ['Category', 'Observed', 'Expected', '(O − E)² ÷ E'], rows: rows2, caption: scaled ? 'Expected values were scaled to the observed total of ' + H.num(T, 2) + '.' : null };
      extra.push(['Total count', H.num(T, 2)]);
    }
    var p = 1 - H.chi2Cdf(chi, df), crit = H.chi2Inv(1 - a, df);
    var rows = [
      ['Degrees of freedom', String(df)],
      ['p-value', pf(p), true],
      ['Critical value at α = ' + H.num(a, 4), H.fix(crit, 3)],
      ['Decision', p < a ? 'Reject H₀' : 'Fail to reject H₀', true]
    ].concat(extra);
    if (low) rows.push(['Cells with expected count < 5', low + ' of ' + cells]);
    return {
      value: 'χ² = ' + H.fix(chi, 3), label: v.mode === 'ind' ? 'Chi-square test of independence' : 'Chi-square goodness-of-fit statistic',
      expr: 'Σ (O − E)² ÷ E, df = ' + df,
      rows: rows, table: table,
      sub: (p < a ? (v.mode === 'ind' ? 'The two variables appear to be related (p < α).' : 'The observed counts differ from the expected pattern more than chance would explain (p < α).') : (v.mode === 'ind' ? 'No evidence the two variables are related at this α.' : 'The counts are consistent with the expected pattern at this α.')) + (low ? ' Some expected counts are below 5, so the p-value may be unreliable; consider combining categories or Fisher\'s exact test.' : ''),
      _chi: chi, _p: p, _df: df
    };
  },
  quick: ({ r }) => `To calculate a chi-square statistic, find (observed − expected)² ÷ expected for every category and add them up. A shop logs <strong>42, 38, 45, 50 and 75</strong> visits Monday to Friday; an even split predicts 50 a day, so χ² = (64 + 144 + 25 + 0 + 625) ÷ 50 = <strong>${r.value.replace('χ² = ', '')}</strong>. With 4 degrees of freedom, p = 0.0018: traffic is not even.`,
  stepsTitle: 'How to calculate a chi-square statistic',
  steps: [
    'Write down the observed count for every category (or every cell of a table). Use raw counts, never percentages or means; percentages give a meaningless χ².',
    'Work out the expected count for each one. Goodness of fit: total × expected proportion. Independence: row total × column total ÷ grand total.',
    'For each category, subtract expected from observed, square it and divide by expected.',
    'Add the pieces to get χ². Degrees of freedom = categories − 1 (goodness of fit) or (rows − 1) × (columns − 1) (independence).',
    'Find the p-value as the right-tail area of the χ² distribution, or compare χ² with the critical value (9.488 for df = 4 at α = 0.05).'
  ],
  formulaTitle: 'What is the chi-square formula?',
  formula: {
    expr: 'χ² = Σ (O − E)² ÷ E<br>Goodness of fit: E = N × p<sub>i</sub>, df = k − 1<br>Independence: E<sub>ij</sub> = (row<sub>i</sub> total × column<sub>j</sub> total) ÷ N, df = (r − 1)(c − 1)',
    vars: [['O', 'observed count'], ['E', 'expected count under the null hypothesis'], ['N', 'total count'], ['p<sub>i</sub>', 'expected proportion for category i'], ['k, r, c', 'number of categories, rows, columns']],
    note: 'If you estimated any parameters of the expected distribution from the data (for example, the mean of a Poisson), subtract one more degree of freedom for each.'
  },
  example: `<p>Goodness of fit: visits Monday–Friday were 42, 38, 45, 50, 75 (total 250). Equal traffic predicts 250 ÷ 5 = 50 per day.</p>
<p>(42 − 50)² ÷ 50 = 1.28; (38 − 50)² ÷ 50 = 2.88; (45 − 50)² ÷ 50 = 0.50; (50 − 50)² ÷ 50 = 0; (75 − 50)² ÷ 50 = 12.50.</p>
<p>χ² = 1.28 + 2.88 + 0.50 + 0 + 12.50 = <strong>17.16</strong>, df = 5 − 1 = 4. The critical value at α = 0.05 is 9.488, and p = <strong>0.0018</strong>, so the null hypothesis of equal daily traffic is rejected. Friday alone contributes 12.50 of the 17.16.</p>`,
  table: {
    title: 'What are the chi-square critical values?',
    intro: 'Right-tail critical values of the χ² distribution, generated with the calculator\'s inverse function. Reject H₀ if your χ² is larger than the value in your df row.',
    head: ['df', 'α = 0.10', 'α = 0.05', 'α = 0.025', 'α = 0.01', 'α = 0.001'],
    rows: ({ H }) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30].map(df => [String(df), ...[0.1, 0.05, 0.025, 0.01, 0.001].map(a => H.fix(H.chi2Inv(1 - a, df), 3))]),
    note: 'The df = 1, α = 0.05 value, 3.841, is 1.96²: a 2 × 2 chi-square test is equivalent to a two-sided z test of two proportions.'
  },
  sections: [
    {
      h2: 'How do you calculate expected values in a chi-square test?',
      html: `<p>In a <strong>test of independence</strong>, each expected count is what the cell would hold if the row and column variables had nothing to do with each other: <strong>E = row total × column total ÷ grand total</strong>.</p>
<p>Example: 140 people chose among three products, split by age. Under 35: 30, 20, 10 (row total 60). 35 and over: 20, 25, 35 (row total 80). Column totals: 50, 45, 45. The expected count for "under 35, product 1" is 60 × 50 ÷ 140 = <strong>21.43</strong>; the full expected row is 21.43, 19.29, 19.29 and the second is 28.57, 25.71, 25.71. Then χ² = <strong>13.87</strong> with (2 − 1)(3 − 1) = 2 df, p = 0.0010, and Cramér's V = 0.315: a moderate association between age and product choice. Switch the calculator to "Test of independence" to see this table.</p>
<p>In a <strong>goodness-of-fit test</strong>, expected = total × hypothesized proportion. You can enter proportions, percentages or counts in the expected box; the calculator rescales them to your observed total.</p>
<p>The test is reliable when every expected count is at least 5 (a common relaxed rule allows up to 20% of cells between 1 and 5). Below that, merge sparse categories or use Fisher's exact test for a 2 × 2 table.</p>`
    },
    {
      h2: 'How do you do a chi-square test in Excel?',
      html: `<p>Excel's <code>CHISQ.TEST(actual_range, expected_range)</code> returns the <strong>p-value</strong>, not χ². That trips up many users. For the store data in B2:B6 with expected values in C2:C6, <code>=CHISQ.TEST(B2:B6,C2:C6)</code> returns 0.0018.</p>
<ul>
<li>Expected counts for a table: with row totals in column E, column totals in row 4 and the grand total in E4, type <code>=$E2*B$4/$E$4</code> in the first expected cell and fill across and down.</li>
<li>The statistic itself: <code>=SUMPRODUCT((B2:B6-C2:C6)^2/C2:C6)</code> → 17.16.</li>
<li>From a statistic to p: <code>=CHISQ.DIST.RT(17.16,4)</code>. Critical value: <code>=CHISQ.INV.RT(0.05,4)</code> → 9.488.</li>
</ul>
<p>CHISQ.TEST works out df itself as (rows − 1)(columns − 1) for a table, or n − 1 for a single row or column. Google Sheets has the same CHISQ.TEST, CHISQ.DIST.RT and CHISQ.INV.RT functions (also CHITEST).</p>`
    },
    {
      h2: 'How do you run a chi-square test on a TI-84?',
      html: `<p><strong>Goodness of fit:</strong> put observed counts in L1 and expected counts in L2, then <strong>STAT → TESTS → χ²GOF-Test</strong>, enter df = categories − 1 and Calculate. It shows χ², p and the contribution list (CNTRB).</p>
<p><strong>Independence:</strong> press <strong>2nd x⁻¹</strong> (MATRIX) → EDIT → [A], set the dimensions (2 × 3 for the age example) and type the counts. Then <strong>STAT → TESTS → χ²-Test</strong> with Observed [A] and Expected [B], and Calculate. The calculator fills [B] with the expected counts, so you can check them afterwards under MATRIX → [B].</p>`
    },
    {
      h2: 'What does the chi-square result mean?',
      html: `<p>A large χ² means the observed counts sit far from what the null hypothesis predicts. The p-value is the chance of a χ² at least that large if the null were true. For goodness of fit, the null is "the data follow the expected proportions"; for independence, it's "the two variables are unrelated".</p>
<p>Rejecting H₀ tells you <em>that</em> something differs, not <em>where</em>. Look at the cell contributions (O − E)² ÷ E: in the store example, Friday's 12.50 drives the result. A significant χ² also isn't proof of a large effect; with thousands of observations tiny differences become significant, so report Cramér's V (0.1 small, 0.3 medium, 0.5 large for a 2-column table) alongside p. To look up a p-value for any χ² you already have, use the <a href="/p-value-calculator">p-value calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the critical value of chi-square at 0.05 with 1 degree of freedom?', a: 'The critical value is 3.841. Any χ² above 3.841 with 1 df is significant at the 5% level.' },
    { q: 'Can a chi-square statistic be negative?', a: 'No. Every term is a squared difference divided by a positive expected count, so χ² is zero or positive. It equals zero only when every observed count matches its expected count exactly.' },
    { q: 'How do you calculate degrees of freedom for chi-square?', a: 'For goodness of fit, df = number of categories − 1. For a contingency table, df = (rows − 1) × (columns − 1), so a 2 × 3 table has 2 df.' },
    { q: 'Does CHISQ.TEST in Excel give the chi-square value?', a: 'No, it returns the p-value. To get χ² from it use =CHISQ.INV.RT(p, df), or compute =SUMPRODUCT((O-E)^2/E) directly.' },
    { q: 'Can I use percentages in a chi-square test?', a: 'Not as observed values. The test needs actual counts; using percentages inflates or shrinks χ² depending on the sample size. Expected proportions are fine, as long as the observed values are counts.' },
    { q: 'What if an expected count is less than 5?', a: 'The chi-square approximation becomes unreliable. Combine small categories if that makes sense, collect more data, or use Fisher\'s exact test (2 × 2 tables) or an exact multinomial test.' },
    { q: 'Should I use Yates\' continuity correction?', a: 'Some textbooks apply it to 2 × 2 tables, subtracting 0.5 from each |O − E| before squaring. It makes the test conservative and many statisticians no longer recommend it; this calculator reports the uncorrected Pearson χ².' }
  ],
  related: ['p-value-calculator', 't-critical-value-calculator', 'point-estimate-calculator', 'confidence-interval-calculator'],
  sources: [
    { name: 'NIST/SEMATECH e-Handbook: Chi-Square Goodness-of-Fit Test', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda35f.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Critical Values of the Chi-Square Distribution', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3674.htm' },
    { name: 'NIST/SEMATECH e-Handbook: Comparing classifications across several categories (contingency tables)', url: 'https://www.itl.nist.gov/div898/handbook/prc/section4/prc45.htm' },
    { name: 'Microsoft Support: CHISQ.TEST function', url: 'https://support.microsoft.com/en-us/excel/functions/chisq-test-function' },
    { name: 'Microsoft Support: CHISQ.DIST.RT function', url: 'https://support.microsoft.com/en-us/excel/functions/chisq-dist-rt-function' }
  ]
};
