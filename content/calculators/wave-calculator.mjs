export default {
  slug: 'wave-calculator',
  hub: 'science',
  name: 'Wave Period & Frequency Calculator',
  title: 'Wave Period Calculator: 1 ÷ 440 Hz = 2.273 ms per Cycle',
  h1: 'Wave Period and Frequency Calculator: T = 1/f, v = fλ and Oscilloscope Readings',
  meta: 'Period = 1 ÷ frequency, so a 440 Hz wave repeats every 2.273 ms and is 0.78 m long in air. Also v = fλ, oscilloscope divisions, pendulums and springs.',
  keyword: 'how to calculate period of a wave',
  also: ['how to calculate period physics', 'how do you calculate period of a wave', 'how to calculate the period of a wave', 'how do you calculate the period of a wave', 'how to calculate frequency from oscilloscope', 'how to calculate period from oscilloscope', 'how to calculate frequency on oscilloscope', 'how to calculate frequency in oscilloscope', 'how to calculate frequency from an oscilloscope', 'how to calculate frequency oscilloscope', 'wave frequency calculator', 'wavelength calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What do you know?', type: 'select', value: 'freq', options: [['freq', 'Frequency (and wave speed, optional)'], ['speed', 'Wave speed and wavelength'], ['scope', 'Oscilloscope trace (divisions)'], ['cycles', 'Number of cycles in a time'], ['pendulum', 'Simple pendulum length'], ['spring', 'Mass on a spring']] },
    { id: 'f', label: 'Frequency', type: 'number', value: 440, showIf: { mode: ['freq'] } },
    { id: 'fUnit', label: 'Frequency unit', type: 'select', value: '1', showIf: { mode: ['freq'] }, options: [['1', 'Hz'], ['1000', 'kHz'], ['1000000', 'MHz'], ['1000000000', 'GHz']] },
    { id: 'v', label: 'Wave speed', type: 'number', value: 343, suffix: 'm/s', showIf: { mode: ['freq', 'speed'] }, help: 'Sound in air at 20 °C ≈ 343 m/s; light in vacuum = 299,792,458 m/s. Leave blank to skip wavelength.' },
    { id: 'lam', label: 'Wavelength', type: 'number', value: 0.78, showIf: { mode: ['speed'] } },
    { id: 'lamUnit', label: 'Wavelength unit', type: 'select', value: '1', showIf: { mode: ['speed'] }, options: [['1000', 'km'], ['1', 'm'], ['0.01', 'cm'], ['0.001', 'mm'], ['0.000001', 'µm'], ['0.000000001', 'nm']] },
    { id: 'divs', label: 'Horizontal divisions for one full cycle', type: 'number', value: 4, showIf: { mode: ['scope'] } },
    { id: 'tdiv', label: 'Time base (time/div)', type: 'select', value: '0.0005', showIf: { mode: ['scope'] }, options: [['0.000001', '1 µs/div'], ['0.000002', '2 µs/div'], ['0.000005', '5 µs/div'], ['0.00001', '10 µs/div'], ['0.00002', '20 µs/div'], ['0.00005', '50 µs/div'], ['0.0001', '0.1 ms/div'], ['0.0002', '0.2 ms/div'], ['0.0005', '0.5 ms/div'], ['0.001', '1 ms/div'], ['0.002', '2 ms/div'], ['0.005', '5 ms/div'], ['0.01', '10 ms/div'], ['0.02', '20 ms/div'], ['0.05', '50 ms/div'], ['0.1', '0.1 s/div'], ['0.2', '0.2 s/div'], ['0.5', '0.5 s/div'], ['1', '1 s/div']] },
    { id: 'vdivs', label: 'Vertical divisions, peak to peak (optional)', type: 'number', value: 6, showIf: { mode: ['scope'] } },
    { id: 'vdiv', label: 'Volts per division', type: 'select', value: '1', showIf: { mode: ['scope'] }, options: [['0.01', '10 mV/div'], ['0.02', '20 mV/div'], ['0.05', '50 mV/div'], ['0.1', '0.1 V/div'], ['0.2', '0.2 V/div'], ['0.5', '0.5 V/div'], ['1', '1 V/div'], ['2', '2 V/div'], ['5', '5 V/div'], ['10', '10 V/div']] },
    { id: 'n', label: 'Number of complete cycles', type: 'number', value: 20, showIf: { mode: ['cycles'] } },
    { id: 't', label: 'Time for those cycles', type: 'number', value: 15, suffix: 's', showIf: { mode: ['cycles'] } },
    { id: 'L', label: 'Pendulum length (pivot to center of bob)', type: 'number', value: 1, suffix: 'm', showIf: { mode: ['pendulum'] } },
    { id: 'g', label: 'Gravitational acceleration', type: 'number', value: 9.80665, suffix: 'm/s²', showIf: { mode: ['pendulum'] } },
    { id: 'm', label: 'Mass', type: 'number', value: 0.5, suffix: 'kg', showIf: { mode: ['spring'] } },
    { id: 'k', label: 'Spring constant', type: 'number', value: 20, suffix: 'N/m', showIf: { mode: ['spring'] } }
  ],
  compute(v, H) {
    function p4(x) { return H.num(Number(x.toPrecision(4)), 12); }
    function tm(s) {
      if (!isFinite(s)) return '—';
      var a = Math.abs(s);
      if (a >= 1) return p4(s) + ' s';
      if (a >= 1e-3) return p4(s * 1e3) + ' ms';
      if (a >= 1e-6) return p4(s * 1e6) + ' µs';
      if (a >= 1e-9) return p4(s * 1e9) + ' ns';
      if (a >= 1e-12) return p4(s * 1e12) + ' ps';
      return p4(s * 1e15) + ' fs';
    }
    function hz(f) {
      if (!isFinite(f)) return '—';
      if (f >= 1e12) return p4(f / 1e12) + ' THz';
      if (f >= 1e9) return p4(f / 1e9) + ' GHz';
      if (f >= 1e6) return p4(f / 1e6) + ' MHz';
      if (f >= 1e3) return p4(f / 1e3) + ' kHz';
      return p4(f) + ' Hz';
    }
    function len(m) {
      if (!isFinite(m)) return '—';
      if (m >= 1000) return p4(m / 1000) + ' km';
      if (m >= 0.5) return p4(m) + ' m';
      if (m >= 0.01) return p4(m * 100) + ' cm';
      if (m >= 1e-3) return p4(m * 1000) + ' mm';
      if (m >= 1e-6) return p4(m * 1e6) + ' µm';
      return p4(m * 1e9) + ' nm';
    }
    var T, expr, rows = [], speed = v.v > 0 ? v.v : NaN, sub = 'Period and frequency are reciprocals: T = 1 ÷ f.';
    if (v.mode === 'speed') {
      var lam = v.lam * (Number(v.lamUnit) || 1);
      if (!(speed > 0) || !(lam > 0)) return { error: 'Enter the wave speed and the wavelength.' };
      T = lam / speed; expr = 'T = ' + len(lam) + ' ÷ ' + H.num(speed, 4) + ' m/s';
    } else if (v.mode === 'scope') {
      var td = Number(v.tdiv);
      if (!(v.divs > 0) || !(td > 0)) return { error: 'Enter the number of divisions for one cycle.' };
      T = v.divs * td; speed = NaN; expr = H.num(v.divs, 3) + ' div × ' + tm(td) + '/div';
      if (v.vdivs > 0) {
        var vpp = v.vdivs * Number(v.vdiv);
        rows.push(['Peak-to-peak voltage', p4(vpp) + ' V']);
        rows.push(['Amplitude (peak)', p4(vpp / 2) + ' V']);
        rows.push(['RMS voltage (sine wave)', p4(vpp / 2 / Math.SQRT2) + ' V']);
      }
      sub = 'Count divisions across several cycles and divide for a more precise period.';
    } else if (v.mode === 'cycles') {
      if (!(v.n > 0) || !(v.t > 0)) return { error: 'Enter the number of cycles and the time they took.' };
      T = v.t / v.n; speed = NaN; expr = H.num(v.t, 4) + ' s ÷ ' + H.num(v.n, 3) + ' cycles';
      sub = 'Timing many cycles and dividing cuts the effect of your reaction time on the stopwatch.';
    } else if (v.mode === 'pendulum') {
      if (!(v.L > 0) || !(v.g > 0)) return { error: 'Enter the pendulum length and g.' };
      T = 2 * Math.PI * Math.sqrt(v.L / v.g); speed = NaN; expr = '2π √(' + H.num(v.L, 4) + ' ÷ ' + H.num(v.g, 5) + ')';
      sub = 'Valid for small swings (under about 15°). Mass and amplitude don\'t change the period.';
    } else if (v.mode === 'spring') {
      if (!(v.m > 0) || !(v.k > 0)) return { error: 'Enter the mass and the spring constant.' };
      T = 2 * Math.PI * Math.sqrt(v.m / v.k); speed = NaN; expr = '2π √(' + H.num(v.m, 4) + ' ÷ ' + H.num(v.k, 4) + ')';
      sub = 'Ideal spring with negligible mass. Amplitude doesn\'t change the period.';
    } else {
      var f0 = v.f * (Number(v.fUnit) || 1);
      if (!(f0 > 0)) return { error: 'Enter a frequency above zero.' };
      T = 1 / f0; expr = 'T = 1 ÷ ' + hz(f0);
    }
    var f = 1 / T;
    rows.unshift(['Frequency (f = 1 ÷ T)', hz(f), true]);
    if (speed > 0) rows.splice(1, 0, ['Wavelength (λ = v ÷ f)', len(speed / f), true]);
    rows.push(['Angular frequency (ω = 2πf)', H.num(Number((2 * Math.PI * f).toPrecision(4)), 12) + ' rad/s']);
    if (v.mode === 'pendulum' || v.mode === 'spring') rows.push(['Time for 10 oscillations', tm(10 * T)]);
    return { value: tm(T), label: 'Period (T)', expr: expr, rows: rows, sub: sub, T: tm(T), F: hz(f), L: speed > 0 ? len(speed / f) : '—' };
  },
  quick: ({ r }) => `The period of a wave is the time for one complete cycle, the reciprocal of frequency: <strong>T = 1 ÷ f</strong>. A 440 Hz tone (concert A) has a period of 1 ÷ 440 = <strong>${r.value}</strong>. In air at 343 m/s its wavelength is v ÷ f = 0.7795 m. On an oscilloscope, period = divisions for one cycle × time per division.`,
  stepsTitle: 'How to calculate the period of a wave',
  steps: [
    'If you know the frequency, take its reciprocal: T = 1 ÷ f. Convert kHz, MHz or GHz to hertz first (1 kHz = 1,000 Hz), or the answer will be off by powers of 1,000.',
    'If you know the wave speed and wavelength, divide: T = λ ÷ v (equivalently, find f = v ÷ λ and invert it).',
    'From an oscilloscope or a displacement–time graph, measure the time for one complete cycle, crest to crest or between matching zero crossings.',
    'With a stopwatch, time 10 or 20 complete cycles and divide by the count. This is the standard way to time a pendulum in the lab.',
    'Report the period with a time unit (s, ms, µs) and the same number of significant figures as your least precise measurement.'
  ],
  formulaTitle: 'What are the period, frequency and wave speed formulas?',
  formula: {
    expr: 'T = 1 ÷ f &nbsp;·&nbsp; f = 1 ÷ T<br>v = f × λ &nbsp;·&nbsp; T = λ ÷ v<br>Oscilloscope: T = divisions × time/div<br>Pendulum: T = 2π√(L ÷ g) &nbsp;·&nbsp; Spring: T = 2π√(m ÷ k)',
    vars: [['T', 'period in seconds'], ['f', 'frequency in hertz (1 Hz = 1 cycle per second = 1 s⁻¹)'], ['v', 'wave speed in m/s'], ['λ', 'wavelength in meters'], ['L, g', 'pendulum length and gravitational acceleration (standard g = 9.80665 m/s²)'], ['m, k', 'mass on the spring (kg) and spring constant (N/m)']],
    note: 'Angular frequency ω = 2πf = 2π ÷ T, in radians per second, is used in the equations of simple harmonic motion.'
  },
  example: `<p>A physics lab times a pendulum with a 0.750 m string. Twenty full swings take 34.8 s on the stopwatch.</p>
<p>Measured period: T = 34.8 s ÷ 20 = <strong>1.74 s</strong>, so f = 1 ÷ 1.74 = 0.575 Hz.</p>
<p>Predicted period: T = 2π√(0.750 ÷ 9.81) = <strong>1.737 s</strong>. The two agree within 0.2%, well inside the ±0.2 s reaction-time uncertainty spread over 20 swings (±0.01 s per swing). Choose "Number of cycles" or "Simple pendulum" above to check your own data.</p>`,
  table: {
    title: 'What are the period and wavelength of common waves?',
    intro: 'Periods and wavelengths computed by the calculator. Sound uses 343 m/s (air, 20 °C) or 1,540 m/s (soft tissue); radio and light use 299,792,458 m/s.',
    head: ['Wave', 'Frequency', 'Period', 'Wavelength'],
    rows: ({ run }) => [
      ['Ocean swell (deep water)', 0.1, 15.61],
      ['Lowest note humans hear (sound)', 20, 343],
      ['U.S. household AC power', 60, NaN],
      ['Middle C, C4 (sound)', 261.63, 343],
      ['Concert A, A4 (sound)', 440, 343],
      ['1 kHz test tone (sound)', 1000, 343],
      ['Highest note young people hear (sound)', 20000, 343],
      ['Medical ultrasound in tissue', 5e6, 1540],
      ['AM radio', 1e6, 299792458],
      ['FM radio', 1e8, 299792458],
      ['Wi-Fi 2.4 GHz', 2.4e9, 299792458],
      ['Green light', 5.4e14, 299792458]
    ].map(([name, f, sp]) => { const r = run({ mode: 'freq', f, fUnit: '1', v: sp }); return [name, r.F, r.T, r.L]; }),
    note: 'AC power is a varying voltage in a wire, not a wave traveling through air, so no wavelength is listed. Deep-water ocean waves travel at gT ÷ 2π, about 15.6 m/s for a 10-second swell.'
  },
  sections: [
    {
      h2: 'How do you calculate frequency and period on an oscilloscope?',
      html: `<p>Count the horizontal divisions for one complete cycle, then multiply by the time base setting (time/div) to get the period. Invert the period for frequency. If one cycle spans 4.0 divisions at 0.5 ms/div, T = 4.0 × 0.5 ms = <strong>2.0 ms</strong> and f = 1 ÷ 0.0020 s = <strong>500 Hz</strong>.</p>
<p>For better precision, adjust the time base so two or three cycles fill the screen and measure them together. If 3 cycles span 8.4 divisions at 1 ms/div, T = 8.4 ms ÷ 3 = 2.8 ms and f = 357 Hz. Most graticules have 5 minor ticks per division, so you can read to about ±0.1 division.</p>
<p>The vertical axis gives the voltage the same way: peak-to-peak divisions × volts/div. A sine wave 6 divisions tall at 1 V/div is 6 V peak to peak, 3 V peak, and 3 ÷ √2 = 2.12 V RMS. Choose "Oscilloscope trace" above to do both at once.</p>`
    },
    {
      h2: 'How do you calculate period in physics for a pendulum or spring?',
      html: `<p>Oscillators that aren't traveling waves still have a period, and physics courses use these two formulas constantly:</p>
<ul><li><strong>Simple pendulum:</strong> T = 2π√(L ÷ g). A 1.00 m pendulum has T = 2π√(1.00 ÷ 9.81) = 2.01 s. The mass of the bob doesn't matter, and for swings under about 15° the amplitude barely matters either.</li>
<li><strong>Mass on a spring:</strong> T = 2π√(m ÷ k). A 0.500 kg mass on a 20.0 N/m spring has T = 2π√0.0250 = 0.993 s. Quadrupling the mass doubles the period.</li></ul>
<p>Both rearrange to find unknowns: g = 4π²L ÷ T² is a classic lab measurement of gravitational acceleration, and k = 4π²m ÷ T² finds a spring constant. For a planet or satellite, use the <a href="/orbital-period-calculator">orbital period calculator</a>.</p>`
    },
    {
      h2: 'How do you find the period from a wave graph?',
      html: `<p>Check the horizontal axis first. On a <strong>displacement–time</strong> graph, the distance between two neighboring crests (or two matching points one cycle apart) is the period. On a <strong>displacement–distance</strong> graph the same crest-to-crest spacing is the wavelength, not the period. Mixing the two up is the most common error on exam questions.</p>
<p>If the graph only gives wavelength, you also need the wave speed: a water wave with λ = 2.0 m moving at 0.50 m/s has T = 2.0 ÷ 0.50 = 4.0 s. Reading across several cycles and dividing gives a more accurate period than reading one.</p>`
    },
    {
      h2: 'How are frequency, wavelength and wave speed related?',
      html: `<p>They are linked by v = fλ. The source sets the frequency; the medium sets the speed; the wavelength adjusts to fit. When a 440 Hz sound passes from air (343 m/s) into water (about 1,480 m/s), its frequency stays 440 Hz but its wavelength stretches from 0.78 m to about 3.4 m.</p>
<p>Electromagnetic waves in a vacuum all travel at exactly 299,792,458 m/s, so their wavelength and frequency are simply inverses: a 100 MHz FM station broadcasts 3.00 m waves, and green light at 540 THz has a wavelength of 555 nm. In glass or water, light slows down and its wavelength shortens by the refractive index.</p>`
    }
  ],
  faq: [
    { q: 'What is the period of a 60 Hz wave?', a: 'T = 1 ÷ 60 = 0.01667 s, or 16.67 ms. A 50 Hz wave, the mains frequency in Europe and much of Asia, has a period of 20 ms.' },
    { q: 'What are the units of period and frequency?', a: 'Period is measured in seconds (or ms, µs). Frequency is measured in hertz, where 1 Hz is one cycle per second, so 1 Hz = 1 s⁻¹.' },
    { q: 'How do you convert period to frequency?', a: 'Take the reciprocal: f = 1 ÷ T. A period of 0.25 s is a frequency of 4 Hz, and a period of 2.0 ms is 500 Hz.' },
    { q: 'Does amplitude affect the period?', a: 'Not for an ideal wave or simple harmonic oscillator. A louder 440 Hz tone still has a 2.273 ms period. Real pendulums swung through very large angles do run slightly slow.' },
    { q: 'How do you calculate the period from wavelength and speed?', a: 'Divide the wavelength by the speed: T = λ ÷ v. Waves 2.0 m apart traveling at 0.50 m/s have a 4.0 s period.' },
    { q: 'What is the period of a 5 MHz ultrasound wave?', a: 'T = 1 ÷ 5,000,000 Hz = 2 × 10⁻⁷ s, or 200 ns. In soft tissue at 1,540 m/s its wavelength is 0.308 mm.' },
    { q: 'What is the difference between period and frequency?', a: 'Period is how long one cycle takes; frequency is how many cycles happen each second. They are reciprocals, so when one doubles the other halves.' },
    { q: 'How do you calculate angular frequency?', a: 'Multiply frequency by 2π: ω = 2πf = 2π ÷ T. A 440 Hz wave has ω = 2,765 rad/s.' }
  ],
  related: ['speed-calculator', 'orbital-period-calculator', 'uncertainty-calculator', 'scientific-notation-calculator'],
  sources: [
    { name: 'OpenStax University Physics Volume 1: 16.1 Traveling Waves', url: 'https://openstax.org/books/university-physics-volume-1/pages/16-1-traveling-waves' },
    { name: 'OpenStax University Physics Volume 1: 15.1 Simple Harmonic Motion', url: 'https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion' },
    { name: 'OpenStax University Physics Volume 1: 15.4 Pendulums', url: 'https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums' },
    { name: 'NIST: SI Units (second and hertz)', url: 'https://www.nist.gov/pml/owm/metric-si/si-units' },
    { name: 'NIST CODATA: Speed of light in vacuum', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?c' },
    { name: 'NIST CODATA: Standard acceleration of gravity', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?gn' }
  ]
};
