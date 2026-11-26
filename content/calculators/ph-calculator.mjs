export default {
  slug: 'ph-calculator',
  hub: 'science',
  name: 'pH Calculator',
  title: 'pH Calculator: [H+] = 2.5 × 10^-4 M Gives pH 3.60 (Steps)',
  meta: '[H+] = 2.5 × 10^-4 M gives pH 3.60: pH = −log(2.5 × 10^-4). Find pH from [H+] or [OH−], [H+] from pH, and pOH, with every log step shown.',
  keyword: 'ph calculator',
  also: ['how to calculate ph', 'ph from hydrogen ion concentration', 'h+ from ph', 'poh calculator', 'ph and poh'],
  updated: '2026-11-26',
  answer: ({ r }) => `A solution with [H⁺] = 2.5 × 10<sup>−4</sup> M has a pH of <strong>${r.value}</strong>: take the log and change its sign.`,
  inputs: [
    { id: 'mode', label: 'I know', type: 'select', value: 'h', wide: true, options: [['h', '[H⁺] or [H₃O⁺] in mol/L: find the pH'], ['ph', 'The pH: find [H⁺]'], ['oh', '[OH⁻] in mol/L: find the pH'], ['poh', 'The pOH: find the pH']] },
    { id: 'hc', label: '[H⁺] number', type: 'number', value: 2.5, help: 'The 2.5 in 2.5 × 10⁻⁴', showIf: { mode: ['h'] } },
    { id: 'he', label: 'Power of 10', type: 'number', value: -4, help: 'The −4 in 2.5 × 10⁻⁴', showIf: { mode: ['h'] } },
    { id: 'oc', label: '[OH⁻] number', type: 'number', value: 2, help: 'The 2 in 2 × 10⁻²', showIf: { mode: ['oh'] } },
    { id: 'oe', label: 'Power of 10', type: 'number', value: -2, showIf: { mode: ['oh'] } },
    { id: 'ph', label: 'pH', type: 'number', value: 4.5, showIf: { mode: ['ph'] } },
    { id: 'poh', label: 'pOH', type: 'number', value: 9.5, showIf: { mode: ['poh'] } }
  ],
  compute(v, H) {
    var sup = function (n) { return '10<sup>' + String(n).replace('-', '−') + '</sup>'; };
    var sci = function (x, k) {
      var e = Math.floor(Math.log10(x)), m = Number((x / Math.pow(10, e)).toPrecision(k));
      if (m >= 10) { m = m / 10; e = e + 1; }
      return m.toFixed(k - 1) + ' × ' + sup(e);
    };
    var p5 = function (x) { return H.num(x, 5).replace('-', '−'); };
    var f = function (x) { return H.num(x, 10).replace('-', '−'); };
    var br = function (x) { return x < 0 ? '(' + p5(x) + ')' : p5(x); };
    var fx = function (x) { return H.fix(x, 2).replace('-', '−'); };
    var kind = function (p) { var r = H.round(p, 2); return r < 7 ? 'acidic' : r > 7 ? 'basic' : 'neutral'; };
    var m = v.mode, st, pH, pOH, h;
    if (m === 'h' || m === 'oh') {
      var c = m === 'h' ? v.hc : v.oc, e = m === 'h' ? v.he : v.oe, ion = m === 'h' ? '[H⁺]' : '[OH⁻]', p = m === 'h' ? 'pH' : 'pOH';
      if (!(c > 0)) return { error: 'Enter the number in front of the power of 10, above 0.' };
      if (!isFinite(e)) return { error: 'Enter the power of 10, for example −4.' };
      var lc = Math.log10(c), lg = lc + e, val = -lg;
      st = ['<b>Formula:</b> ' + p + ' = −log ' + ion,
        '<b>Substitute:</b> ' + p + ' = −log(' + f(c) + ' × ' + sup(e) + ')',
        '<b>Split the log:</b> log(' + f(c) + ') + log(' + sup(e) + ') = ' + p5(lc) + ' + (' + f(e) + ') = ' + p5(lg),
        '<b>Change the sign:</b> ' + p + ' = ' + p5(val)];
      if (m === 'h') { pH = val; pOH = 14 - pH; st.push('<b>pOH:</b> 14 − ' + br(pH) + ' = ' + p5(pOH)); }
      else { pOH = val; pH = 14 - pOH; st.push('<b>pH:</b> 14 − ' + br(pOH) + ' = ' + p5(pH)); }
      st.push('<b>Answer:</b> pH = ' + fx(pH) + ', rounded to 2 decimal places, so the solution is ' + kind(pH) + ' at 25 °C.');
      h = Math.pow(10, -pH);
      return { value: fx(pH), label: 'pH', rows: [['pOH', fx(pOH)], ['[H⁺]', sci(h, 3) + ' M'], ['[OH⁻]', sci(Math.pow(10, -pOH), 3) + ' M']], steps: st };
    }
    st = [];
    if (m === 'poh') {
      if (!isFinite(v.poh) || v.poh < -2 || v.poh > 16) return { error: 'Enter a pOH, usually between 0 and 14.' };
      pOH = v.poh; pH = 14 - pOH;
      st.push('<b>Formula:</b> pH = 14 − pOH, then [H⁺] = ' + sup('−pH'));
      st.push('<b>Substitute:</b> pH = 14 − ' + br(pOH));
      st.push('<b>Subtract:</b> pH = ' + p5(pH));
    } else {
      if (!isFinite(v.ph) || v.ph < -2 || v.ph > 16) return { error: 'Enter a pH, usually between 0 and 14.' };
      pH = v.ph; pOH = 14 - pH;
      st.push('<b>Formula:</b> [H⁺] = ' + sup('−pH'));
      st.push('<b>Substitute:</b> [H⁺] = ' + sup(f(-pH)));
    }
    var n = Math.ceil(pH - 1e-12), fr = n - pH, mm = Math.pow(10, fr);
    h = Math.pow(10, -pH);
    st.push('<b>Split the power:</b> ' + sup(p5(-pH)) + ' = ' + sup(p5(fr)) + ' × ' + sup(-n));
    st.push('<b>Evaluate:</b> ' + sup(p5(fr)) + ' = ' + p5(mm) + ', so [H⁺] = ' + p5(mm) + ' × ' + sup(-n) + ' M');
    if (m === 'poh') st.push('<b>Answer:</b> pH = ' + fx(pH) + ' (rounded to 2 decimal places), so the solution is ' + kind(pH) + '; [H⁺] = ' + sci(h, 3) + ' M to 3 significant figures.');
    else st.push('<b>Answer:</b> [H⁺] = ' + sci(h, 3) + ' M, rounded to 3 significant figures; pOH = 14 − ' + br(pH) + ' = ' + fx(pOH) + '.');
    return {
      value: m === 'poh' ? fx(pH) : sci(h, 3) + ' M',
      label: m === 'poh' ? 'pH' : 'Hydrogen ion concentration [H⁺]',
      rows: [['pOH', fx(pOH)], ['[OH⁻]', sci(Math.pow(10, -pOH), 3) + ' M'], ['The solution is', kind(pH)]],
      steps: st
    };
  },
  facts: {
    formula: 'pH = −log [H⁺]<br>[H⁺] = 10<sup>−pH</sup><br>pOH = −log [OH⁻]<br>pH + pOH = 14 (at 25 °C)',
    vars: [['[H⁺]', 'hydrogen (hydronium) ion concentration in mol/L, written M'], ['[OH⁻]', 'hydroxide ion concentration in mol/L'], ['log', 'the base-10 logarithm'], ['14', 'the pK<sub>w</sub> of water at 25 °C']],
    rounding: 'the calculator gives pH to 2 decimal places and concentrations to 3 significant figures. Chemistry convention: the pH has as many decimal places as the concentration has significant figures.',
    note: 'Below 7 is acidic, 7 is neutral and above 7 is basic. Each pH unit is a factor of 10 in [H⁺].'
  },
  example: {
    h2: 'Worked example: the pH of a 0.020 M NaOH solution',
    html: `<p><strong>Problem:</strong> Sodium hydroxide is a strong base, so it splits up completely in water. What is the pH of a 0.020 M NaOH solution at 25 °C?</p>
<p><strong>1.</strong> Each NaOH gives one OH⁻, so [OH⁻] = 0.020 M = 2.0 × 10<sup>−2</sup> M.</p>
<p><strong>2.</strong> pOH = −log(2.0 × 10<sup>−2</sup>) = −(0.30103 − 2) = 1.69897.</p>
<p><strong>3.</strong> pH = 14 − 1.69897 = 12.30103.</p>
<p><strong>Answer:</strong> pH = 12.30. Sense check: a base must have a pH above 7, and 0.01 M OH⁻ would give exactly pH 12, so twice as much hydroxide should land a little higher.</p>`
  },
  variants: [
    {
      h2: 'What is the pH of a 0.001 M HCl solution?',
      html: `<p>The pH is <strong>3.00</strong>. HCl is a strong acid, so [H⁺] equals the acid concentration: 0.001 M = 1 × 10<sup>−3</sup> M. Then pH = −log(1 × 10<sup>−3</sup>) = −(0 + (−3)) = 3. The pOH is 14 − 3 = 11. This shortcut only works for strong acids; a weak acid such as vinegar releases far fewer H⁺ ions than its concentration.</p>`
    },
    {
      h2: 'How do you find [H+] from pH?',
      html: `<p>Raise 10 to the negative pH: [H⁺] = 10<sup>−pH</sup>. For pH 4.5, split the power into a whole-number part and a decimal part: 10<sup>−4.5</sup> = 10<sup>0.5</sup> × 10<sup>−5</sup> = 3.16228 × 10<sup>−5</sup>, so [H⁺] = <strong>3.16 × 10<sup>−5</sup> M</strong>. On a calculator, press the 10<sup>x</sup> key (often shift + log) and type −4.5.</p>`
    },
    {
      h2: 'How do you calculate pOH and [OH-] from pH?',
      html: `<p>Subtract the pH from 14, then raise 10 to the negative pOH. For pH 4.5, pOH = 14 − 4.5 = 9.5 and [OH⁻] = 10<sup>−9.5</sup> = <strong>3.16 × 10<sup>−10</sup> M</strong>. For the default example, pH 3.60 gives pOH = 14 − 3.60206 = 10.39794, or 10.40.</p>`
    }
  ],
  mistakes: [
    '<strong>Dropping the minus sign.</strong> log(2.5 × 10<sup>−4</sup>) = −3.60206, so pH = +3.60. A negative pH from an ordinary concentration means the sign was lost.',
    '<strong>Typing the log without brackets.</strong> Entering −log 2.5 × 10<sup>−4</sup> on some calculators works out −log(2.5) first and then multiplies by 10<sup>−4</sup>. Put the whole concentration in brackets.',
    '<strong>Using [OH⁻] in the pH formula.</strong> −log(2.0 × 10<sup>−2</sup>) gives the pOH (1.70) for the NaOH example, not the pH. Subtract from 14 to get 12.30.',
    '<strong>Treating a weak acid like a strong one.</strong> 0.10 M acetic acid does not have [H⁺] = 0.10 M, because only a small share of it ionizes. Its pH is well above 1.'
  ],
  related: ['scientific-notation-calculator', 'exponent-calculator', 'efficiency-calculator', 'speed-calculator'],
  faq: [
    { q: 'Why do pH and pOH add up to 14?', a: 'In water at 25 °C, [H⁺] × [OH⁻] = 1.0 × 10<sup>−14</sup>. Taking −log of both sides gives pH + pOH = 14. At other temperatures the total is slightly different.' },
    { q: 'Can pH be negative or above 14?', a: 'Yes, for very concentrated solutions. 2 M HCl has [H⁺] = 2 M, so pH = −log(2) = −0.30. School problems almost always stay between 0 and 14.' },
    { q: 'How many decimal places should a pH have?', a: 'As many as the significant figures in the concentration. 2.5 × 10<sup>−4</sup> M has two significant figures, so the pH is written 3.60, with two decimal places.' },
    { q: 'Is [H⁺] the same as [H₃O⁺]?', a: 'For pH problems, yes. H⁺ ions in water attach to water molecules as H₃O⁺, and textbooks use either symbol in pH = −log[H⁺].' }
  ],
  sources: [
    { name: 'OpenStax Chemistry 2e: 14.2 pH and pOH', url: 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh' }
  ]
};
