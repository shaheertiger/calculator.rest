export default {
  slug: 'anc-calculator',
  hub: 'health',
  name: 'Absolute Neutrophil Count Calculator',
  title: 'ANC Calculator: WBC 3.2 With 42% Neutrophils = ANC 1,344',
  h1: 'Absolute Neutrophil Count (ANC) Calculator and Neutropenia Grade',
  meta: 'A WBC of 3.2 with 38% segs and 4% bands gives an ANC of 1,344 cells/µL, mild neutropenia. Enter a CBC differential to get ANC, its unit forms and grade.',
  keyword: 'how to calculate anc',
  also: ['absolute neutrophil count calculator', 'anc calculator', 'anc formula', 'how to calculate absolute neutrophil count', 'neutropenia grade calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'wbc', label: 'White blood cell count (WBC)', type: 'number', value: 3.2, suffix: '× 10³/µL', help: 'Same number as × 10⁹/L. If you type a raw count such as 3200, it is converted.' },
    { id: 'segs', label: 'Segmented neutrophils (segs, polys)', type: 'number', value: 38, suffix: '%', help: 'If your report shows only "neutrophils %", enter that here and leave bands at 0.' },
    { id: 'bands', label: 'Band neutrophils (bands, stabs)', type: 'number', value: 4, suffix: '%' }
  ],
  compute(v, H) {
    var w = v.wbc;
    if (!(w > 0)) return { error: 'Enter the white blood cell count.' };
    if (w > 500) w = w / 1000;
    var s = v.segs >= 0 ? v.segs : NaN, b = v.bands >= 0 ? v.bands : 0;
    if (!(s >= 0)) return { error: 'Enter the segmented neutrophil percentage.' };
    if (s + b > 100) return { error: 'Segs plus bands cannot be more than 100%.' };
    var anc = w * (s + b) * 10;
    var grade, ctc, sub;
    if (anc >= 1500) { grade = 'No neutropenia'; ctc = anc > 8000 ? 'Not graded (above most adult reference ranges)' : 'Grade 0, or grade 1 if below your lab\'s lower limit'; }
    else if (anc >= 1000) { grade = 'Mild neutropenia'; ctc = 'CTCAE grade 2'; }
    else if (anc >= 500) { grade = 'Moderate neutropenia'; ctc = 'CTCAE grade 3'; }
    else { grade = anc < 200 ? 'Severe neutropenia (under 200: agranulocytosis range)' : 'Severe neutropenia'; ctc = 'CTCAE grade 4'; }
    if (anc >= 1500) sub = anc > 8000 ? 'Above the upper limit most labs use. A high ANC (neutrophilia) is common with infection, inflammation, steroids or stress.' : 'At or above 1,500 cells/µL, the usual lower limit for adults.';
    else if (anc >= 1000) sub = 'Mild neutropenia: 1,000–1,499 cells/µL. Infection risk rises only modestly at this level.';
    else if (anc >= 500) sub = 'Moderate neutropenia: 500–999 cells/µL. Infection risk is increased.';
    else sub = 'Severe neutropenia: under 500 cells/µL. A fever at this level is a medical emergency (febrile neutropenia).';
    return {
      value: H.int(anc) + ' cells/µL',
      label: 'Absolute neutrophil count',
      expr: H.num(w, 2) + ' × (' + H.num(s, 1) + '% + ' + H.num(b, 1) + '%) × 10',
      rows: [
        ['Classification', grade, true],
        ['CTCAE v5 neutrophil count', ctc],
        ['ANC in × 10⁹/L', H.fix(anc / 1000, 2)],
        ['Total neutrophils', H.pct(s + b, 1) + ' of WBC']
      ],
      sub: sub
    };
  },
  quick: ({ r }) => `ANC = WBC × (segs % + bands %) × 10, with WBC in thousands per µL. For a WBC of <strong>3.2</strong> with 38% segs and 4% bands, ANC = 3.2 × 42 × 10 = <strong>${r.value}</strong>, which is mild neutropenia (1,000–1,499). Below 500 is severe. The same result in SI units is 1.34 × 10⁹/L.`,
  stepsTitle: 'How to calculate ANC from a CBC with differential',
  steps: [
    'Find the WBC on the complete blood count. Labs report it as × 10³/µL (K/µL) or × 10⁹/L; the number is the same, for example 3.2.',
    'Add the segmented neutrophil percentage and the band percentage from the differential: 38% + 4% = 42%. Leaving out the bands is the classic mistake and underestimates the ANC.',
    'Multiply the WBC by the total neutrophil percentage and by 10: 3.2 × 42 × 10 = 1,344. The × 10 converts thousands per µL and percent into cells per µL.',
    'Compare the result with the grading: 1,500 and above is normal, 1,000–1,499 mild, 500–999 moderate and under 500 severe neutropenia.'
  ],
  formulaTitle: 'What is the formula for absolute neutrophil count?',
  formula: {
    expr: 'ANC (cells/µL) = WBC (× 10³/µL) × (% segs + % bands) × 10<br>ANC (cells/µL) = WBC (cells/µL) × (% segs + % bands) ÷ 100',
    vars: [['WBC', 'total white blood cell count'], ['% segs', 'mature segmented neutrophils (polymorphonuclear cells, PMNs)'], ['% bands', 'slightly immature band neutrophils'], ['× 10', 'converts K/µL × percent into cells/µL (× 1,000 ÷ 100)']],
    note: 'Both lines give the same answer. If the WBC is written as 3,200 cells/µL, use the second form: 3,200 × 42 ÷ 100 = 1,344. Many automated analyzers now report an absolute neutrophil count directly; it should match this calculation within rounding.'
  },
  example: `<p>A patient on chemotherapy has a CBC showing <strong>WBC 1.8 × 10³/µL</strong>, segs 22% and bands 3%.</p>
<p>Total neutrophils = 22 + 3 = 25%. ANC = 1.8 × 25 × 10 = <strong>450 cells/µL</strong> (0.45 × 10⁹/L), which is severe neutropenia and CTCAE grade 4.</p>
<p>Two weeks later the WBC is 4.6 with 55% segs and 2% bands: 4.6 × 57 × 10 = <strong>2,622 cells/µL</strong>, back in the normal range.</p>`,
  table: {
    title: 'What ANC do common WBC counts and neutrophil percentages give?',
    intro: 'ANC in cells/µL for a range of WBC counts (rows) and total neutrophil percentages, segs plus bands (columns).',
    head: ['WBC (× 10³/µL)', '20%', '40%', '50%', '60%', '75%'],
    rows: ({ run }) => [0.8, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 7.0, 10.0, 15.0].map(w => [String(w.toFixed(1)), ...[20, 40, 50, 60, 75].map(p => run({ wbc: w, segs: p, bands: 0 }).value.replace(' cells/µL', ''))]),
    note: 'Values below 1,500 indicate neutropenia, below 500 severe neutropenia. Reference ranges vary by laboratory and population.'
  },
  sections: [
    {
      h2: 'What do the neutropenia grades mean?',
      html: `<p>Two scales are in common use. Clinical texts such as StatPearls use mild, moderate and severe; oncology trials use the National Cancer Institute's Common Terminology Criteria for Adverse Events (CTCAE v5).</p>
<div class="twrap"><table><thead><tr><th>ANC (cells/µL)</th><th>Clinical grade</th><th>CTCAE v5</th></tr></thead><tbody>
<tr><td>1,500 or more</td><td>Normal</td><td>Grade 0 (or grade 1 if below the lab's lower limit)</td></tr>
<tr><td>1,000–1,499</td><td>Mild</td><td>Grade 2</td></tr>
<tr><td>500–999</td><td>Moderate</td><td>Grade 3</td></tr>
<tr><td>Under 500</td><td>Severe</td><td>Grade 4</td></tr>
<tr><td>Under 200</td><td>Agranulocytosis range</td><td>Grade 4</td></tr>
</tbody></table></div>
<p>CTCAE grade 1 covers values from the lab's lower limit of normal down to 1,500, so it applies only where a lab's lower limit sits above 1,500.</p>`
    },
    {
      h2: 'Why are bands included in the ANC?',
      html: `<p>Band neutrophils are young neutrophils released from the bone marrow before their nucleus has fully segmented. They can still ingest and kill bacteria, so they count toward infection defense. A rising band count, called a left shift, often signals an acute bacterial infection.</p>
<p>Some protocols also add metamyelocytes and myelocytes when they appear on a manual differential. If your institution does, include them in the percentage; the formula is otherwise unchanged.</p>`
    },
    {
      h2: 'When is a low ANC an emergency?',
      html: `<p>The danger is fever with severe neutropenia. The Infectious Diseases Society of America defines <strong>febrile neutropenia</strong> as a single oral temperature of 38.3°C (101°F) or higher, or 38.0°C (100.4°F) sustained over an hour, in a patient whose ANC is under 500 cells/µL or expected to fall below 500 within 48 hours. Guidelines call for urgent evaluation and empiric antibiotics.</p>
<p>After many chemotherapy regimens the neutrophil count bottoms out (the nadir) about 7 to 14 days after treatment, which is when this risk peaks. Hospitals set their own thresholds for neutropenic precautions, so follow local policy.</p>`
    },
    {
      h2: 'Can a healthy person have an ANC below 1,500?',
      html: `<p>Yes. Some people of African and Middle Eastern ancestry carry the Duffy-null blood group, which is linked to a lower baseline neutrophil count (now called Duffy-null associated neutrophil count). Their ANC can sit below the standard 1,500 cut-off with no added infection risk, and labelling it neutropenia can lead to unnecessary bone marrow tests or delayed treatment.</p>
<p>Transient dips also follow viral infections and certain medicines. A single low value is a reason for a repeat count and clinical context, not a diagnosis by itself.</p>`
    }
  ],
  faq: [
    { q: 'What is a normal ANC?', a: 'For most adults a normal ANC is 1,500 cells/µL or higher, with upper limits around 7,000–8,000 depending on the lab. Labs publish their own reference range on the report.' },
    { q: 'How do you calculate ANC with WBC in cells/µL?', a: 'Multiply the WBC by the total neutrophil percentage and divide by 100. For 3,200 cells/µL and 42% neutrophils: 3,200 × 42 ÷ 100 = 1,344 cells/µL.' },
    { q: 'Do you include bands when calculating ANC?', a: 'Yes. ANC uses segmented neutrophils plus bands. Leaving out bands understates the count; with WBC 3.2, 38% segs and 4% bands, omitting bands gives 1,216 instead of 1,344.' },
    { q: 'What does an ANC of 1,000 mean?', a: 'An ANC of 1,000 cells/µL is at the bottom of the mild neutropenia range (1,000–1,499). Below 1,000 is classed as moderate neutropenia.' },
    { q: 'Is ANC 1.5 the same as 1,500?', a: 'Yes. 1.5 × 10⁹/L equals 1,500 cells/µL. SI reports use × 10⁹/L; US reports usually use cells/µL or K/µL.' },
    { q: 'What ANC is needed for chemotherapy?', a: 'Many treatment protocols require an ANC of at least 1,000 to 1,500 cells/µL before the next cycle, but thresholds differ by regimen. The oncology team sets the number for each patient.' },
    { q: 'Can I calculate ANC if the lab lists only "neutrophils %"?', a: 'Yes. Automated differentials often report a single neutrophil percentage that already includes bands. Enter it as segs and set bands to 0.' }
  ],
  related: ['iv-drip-rate-calculator', 'map-calculator', 'ecg-heart-rate-calculator', 'ldl-cholesterol-calculator'],
  sources: [
    { name: 'StatPearls (NCBI Bookshelf): Neutropenia', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507702/' },
    { name: 'StatPearls (NCBI Bookshelf): Febrile Neutropenia', url: 'https://www.ncbi.nlm.nih.gov/books/NBK541102/' },
    { name: 'National Cancer Institute CTEP: Common Terminology Criteria for Adverse Events (CTCAE)', url: 'https://ctep.cancer.gov/protocoldevelopment/electronic_applications/ctc.htm' },
    { name: 'Freifeld et al. 2011: IDSA guideline for neutropenic patients with cancer (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/21258094/' }
  ],
  disclaimer: 'For learning and checking homework only, not for clinical decisions. Interpret real blood counts with the treating team and your laboratory\'s reference ranges.'
};
