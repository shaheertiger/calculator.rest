export default {
  slug: 'words-per-minute-calculator',
  hub: 'education',
  name: 'Words Per Minute Calculator',
  title: 'Words Per Minute Calculator: 1,200 Words in 5 Min = 240 WPM',
  h1: 'WPM Calculator for Reading Speed, Fluency (WCPM) and Typing',
  meta: 'Reading 1,200 words in 5 minutes is 240 WPM, close to the 238 WPM adult average. Also scores oral reading fluency (WCPM, accuracy) and typing speed.',
  keyword: 'how to calculate words per minute',
  also: ['how to calculate wpm reading', 'how to calculate words per minute reading', 'how do i calculate words per minute', 'how to calculate words correct per minute', 'how to calculate reading accuracy', 'how to calculate reading fluency', 'typing speed calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'What are you measuring?', type: 'select', value: 'read', options: [['read', 'Reading speed (silent or aloud)'], ['oral', 'Oral reading fluency (WCPM)'], ['type', 'Typing speed (WPM and KPH)']] },
    { id: 'words', label: 'Words read', type: 'number', value: 1200, showIf: { mode: ['read', 'oral'] } },
    { id: 'chars', label: 'Characters typed (with spaces)', type: 'number', value: 1250, showIf: { mode: ['type'] }, help: 'Most word processors show "characters (with spaces)" in their word count.' },
    { id: 'errors', label: 'Errors', type: 'number', value: 0, showIf: { mode: ['oral', 'type'] }, help: 'Oral reading: words misread or skipped. Typing: uncorrected mistakes.' },
    { id: 'minutes', label: 'Minutes', type: 'number', value: 5 },
    { id: 'seconds', label: 'Seconds', type: 'number', value: 0 }
  ],
  compute(v, H) {
    var isN = function (x) { return typeof x === 'number' && isFinite(x); };
    var mins = (isN(v.minutes) ? v.minutes : 0) + (isN(v.seconds) ? v.seconds : 0) / 60;
    if (!(mins > 0)) return { error: 'Enter how long it took (minutes and seconds).' };
    var err = isN(v.errors) && v.errors > 0 ? v.errors : 0;
    var t = H.num(mins, 2) + ' min';
    var mmss = function (m) { var s = Math.round(m * 60); return s >= 3600 ? H.dur(m) : Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; };
    if (v.mode === 'type') {
      if (!(isN(v.chars) && v.chars > 0)) return { error: 'Enter the number of characters typed.' };
      var gross = v.chars / 5 / mins, net = Math.max(0, gross - err / mins);
      return {
        value: H.num(net, 1) + ' WPM', label: 'Net typing speed',
        expr: '(' + H.int(v.chars) + ' ÷ 5 − ' + H.num(err, 0) + ') ÷ ' + t,
        rows: [['Gross WPM (before errors)', H.num(gross, 1)], ['Keystrokes per hour (KPH)', H.int(v.chars / mins * 60), true], ['Characters per minute', H.int(v.chars / mins)], ['Accuracy', H.pct(Math.max(0, (1 - err / (v.chars / 5)) * 100), 1) + ' of words']],
        sub: net >= 40 ? 'At or above the 40 WPM typing standard used for federal clerk-typist jobs.' : 'Below 40 WPM, the typing standard used for federal clerk-typist jobs.'
      };
    }
    if (!(isN(v.words) && v.words > 0)) return { error: 'Enter the number of words read.' };
    if (v.mode === 'oral') {
      if (err > v.words) return { error: 'Errors can\'t be more than the words read.' };
      var wcpm = (v.words - err) / mins, acc = (v.words - err) / v.words * 100;
      return {
        value: H.num(wcpm, 1) + ' WCPM', label: 'Words correct per minute',
        expr: '(' + H.int(v.words) + ' − ' + H.num(err, 0) + ') ÷ ' + t,
        rows: [['Accuracy', H.pct(acc, 1), true], ['Words per minute (all words)', H.num(v.words / mins, 1)], ['Reading level for this text', acc >= 95 ? 'independent (95%+)' : acc >= 90 ? 'instructional (90–94%)' : 'frustration (below 90%)']],
        sub: 'Compare WCPM with grade-level norms in the table on this page; accuracy tells you whether the passage was the right difficulty.'
      };
    }
    var wpm = v.words / mins;
    return {
      value: H.num(wpm, 0) + ' WPM', label: 'Reading speed',
      expr: H.int(v.words) + ' words ÷ ' + t,
      rows: [['Time for a 1,000-word article', mmss(1000 / wpm)], ['Time for an 80,000-word novel', H.dur(80000 / wpm), true], ['Words per second', H.num(wpm / 60, 2)]],
      sub: wpm >= 300 ? 'Faster than typical adult silent reading (about 238 WPM for non-fiction); check comprehension at this pace.' : wpm >= 200 ? 'In the typical range for adult silent reading (about 238 WPM non-fiction, 260 fiction).' : 'Slower than typical adult silent reading, but in the normal range for reading aloud (about 183 WPM).'
    };
  },
  quick: ({ r }) => `To calculate words per minute, divide the words read by the minutes it took. Reading 1,200 words in 5 minutes is 1,200 ÷ 5 = <strong>${r.value}</strong>, close to the adult average of about 238 WPM for silent non-fiction reading. For typing, count every 5 characters as one word: 1,250 characters in 5 minutes is 50 WPM.`,
  stepsTitle: 'How to calculate words per minute',
  steps: [
    'Pick a passage and count its words, or estimate: count the words on three full lines, average them, and multiply by the number of lines.',
    'Time yourself (or the reader) with a stopwatch from the first word to the last. Convert seconds to minutes: 4 minutes 30 seconds is 4.5 minutes.',
    'Divide words by minutes. For oral reading fluency, subtract errors first to get words correct per minute (WCPM).',
    'For typing, divide characters (including spaces) by 5 to get "words," then by minutes. Counting actual words instead of 5-character words is the usual mistake and inflates speed with short words.'
  ],
  formulaTitle: 'What is the words per minute formula?',
  formula: {
    expr: 'Reading WPM = words ÷ minutes<br>WCPM = (words read − errors) ÷ minutes<br>Typing net WPM = (characters ÷ 5 − uncorrected errors) ÷ minutes',
    vars: [['minutes', 'total time, with seconds ÷ 60'], ['errors', 'misread or skipped words (reading) or uncorrected typos (typing)'], ['÷ 5', 'one standard "word" = 5 characters including spaces']],
    note: 'Keystrokes per hour (KPH) = characters ÷ minutes × 60, so 1 net WPM is about 300 KPH.'
  },
  example: `<p><strong>Silent reading:</strong> you read a 2,850-word chapter in 12 minutes 30 seconds. 2,850 ÷ 12.5 = <strong>228 WPM</strong>; a 300-page book of about 90,000 words would take 90,000 ÷ 228 = 395 minutes, about 6 h 35 min.</p>
<p><strong>Fluency check:</strong> a third grader reads 118 words aloud in one minute with 6 errors. WCPM = 118 − 6 = <strong>112</strong>, accuracy 112 ÷ 118 = 94.9%.</p>
<p><strong>Typing test:</strong> 1,420 characters in 3 minutes with 4 uncorrected errors. Gross = 1,420 ÷ 5 ÷ 3 = 94.7 WPM; net = (284 − 4) ÷ 3 = <strong>93.3 WPM</strong>.</p>`,
  table: {
    title: 'How long does it take to read 1,000 words, a page or a novel?',
    intro: 'Reading time at different speeds, using about 275 words for a printed book page.',
    head: ['Speed', '275-word page', '1,000-word article', '80,000-word novel'],
    rows: ({ run, H }) => [100, 150, 183, 200, 238, 260, 300, 400, 500].map(w => {
      const r = run({ mode: 'read', words: w, minutes: 1, seconds: 0 });
      const sec = n => { const s = Math.round(n / w * 60); return Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; };
      return [r.value, sec(275), sec(1000), H.dur(80000 / w)];
    }),
    note: '183 WPM is the average adult reading aloud; 238 and 260 WPM are the average adult silent reading speeds for non-fiction and fiction (Brysbaert, 2019).'
  },
  sections: [
    {
      h2: 'What is the average reading speed for adults?',
      html: `<p>About 238 words per minute for silent reading of non-fiction and 260 WPM for fiction, according to a 2019 meta-analysis of 190 studies by Marc Brysbaert in the <em>Journal of Memory and Language</em>. Reading aloud averages about 183 WPM. Most adults fall roughly between 175 and 300 WPM silently; claims of 1,000+ WPM with full comprehension are not supported by eye-movement research, because the eye still has to fixate on most words.</p>`
    },
    {
      h2: 'How do you calculate words correct per minute (WCPM)?',
      html: `<p>Have the student read an unpracticed, grade-level passage aloud for exactly one minute. Count the words attempted, subtract errors (misread, skipped or substituted words; self-corrections within 3 seconds usually count as correct), and the result is WCPM. Accuracy is words correct ÷ words attempted.</p>
<p>Accuracy also tells you whether the text fits: 95% or higher is the independent level, 90–94% instructional, and below 90% frustration, so a fast reader at 88% accuracy needs easier text, not more speed drills.</p>`
    },
    {
      h2: 'What is a good reading fluency rate by grade?',
      html: `<p>The most widely used benchmarks are the Hasbrouck and Tindal oral reading fluency norms (2017 update). The 50th percentile WCPM on grade-level text:</p>
<div class="twrap"><table><thead><tr><th>Grade</th><th>Fall</th><th>Winter</th><th>Spring</th></tr></thead><tbody>
<tr><td>1</td><td>—</td><td>29</td><td>60</td></tr><tr><td>2</td><td>50</td><td>84</td><td>100</td></tr><tr><td>3</td><td>83</td><td>97</td><td>112</td></tr><tr><td>4</td><td>94</td><td>120</td><td>133</td></tr><tr><td>5</td><td>121</td><td>133</td><td>146</td></tr><tr><td>6</td><td>132</td><td>145</td><td>146</td></tr>
</tbody></table></div>
<p>The authors suggest that students reading 10 or more WCPM below the 50th percentile for their grade and season may need fluency support. Past 6th grade, fluency norms flatten and comprehension matters more than raw speed.</p>`
    },
    {
      h2: 'How is typing speed calculated?',
      html: `<p>Typing tests count a "word" as 5 keystrokes, including spaces and punctuation, so long and short words score fairly. Gross WPM = characters ÷ 5 ÷ minutes. Net WPM then subtracts one word per uncorrected error per minute. Data-entry tests often report keystrokes per hour instead: 50 net WPM with no errors is 50 × 5 × 60 = 15,000 KPH.</p>
<p>For federal clerk-typist positions, OPM's qualification standards set typing proficiency at 40 words per minute, a useful benchmark for office work.</p>`
    }
  ],
  faq: [
    { q: 'Is 240 words per minute a good reading speed?', a: 'Yes. 240 WPM is right at the adult average for silent reading of non-fiction (about 238 WPM), and slightly below the 260 WPM average for fiction.' },
    { q: 'How do I count the words on a page?', a: 'Count the words in three full lines, average them, and multiply by the number of lines on the page. Ten words a line on a 28-line page is about 280 words.' },
    { q: 'How do I calculate WPM with seconds?', a: 'Convert the time to minutes first: divide seconds by 60 and add them to the minutes. 600 words in 2 minutes 30 seconds is 600 ÷ 2.5 = 240 WPM.' },
    { q: 'What is a good typing speed?', a: '40 net WPM is the benchmark OPM uses for federal clerk-typist jobs, and anything well above it is comfortably fast for office work. Accuracy matters as much as speed, so compare net WPM, not gross.' },
    { q: 'How many words per minute should a 3rd grader read?', a: 'About 83 WCPM in the fall, 97 in winter and 112 in spring at the 50th percentile, according to the 2017 Hasbrouck and Tindal norms.' },
    { q: 'Do self-corrections count as errors in WCPM?', a: 'Usually not. Most fluency protocols count a word as correct if the student fixes it within about 3 seconds.' },
    { q: 'How do I convert KPH to WPM?', a: 'Divide keystrokes per hour by 300 (5 characters × 60 minutes). 12,000 KPH is 40 WPM.' }
  ],
  related: ['test-score-calculator', 'grade-calculator', 'percentage-calculator', 'time-duration-calculator'],
  sources: [
    { name: 'Brysbaert (2019), How many words do we read per minute? Journal of Memory and Language', url: 'https://doi.org/10.1016/j.jml.2019.104047' },
    { name: 'Reading Rockets: Fluency (including Hasbrouck & Tindal norms)', url: 'https://www.readingrockets.org/topics/fluency' },
    { name: 'U.S. OPM: General Schedule qualification standards', url: 'https://www.opm.gov/policy-data-oversight/classification-qualifications/general-schedule-qualification-standards/' }
  ]
};
