export default {
  slug: 'trir-calculator',
  hub: 'business',
  name: 'TRIR Calculator',
  title: 'TRIR Calculator: 5 Recordables in 400,000 Hours = 2.50',
  h1: 'TRIR Calculator: OSHA Incidence Rate, DART and LTIR',
  meta: '5 OSHA recordable cases in 400,000 hours worked is a TRIR of 2.50 per 100 full-time workers. Also get DART, lost time and severity rates for your 300 log.',
  keyword: 'how to calculate trir',
  also: ['trir calculator', 'how is trir calculated', 'how to calculate trir osha', 'how to calculate dart', 'how to calculate lost time incident rate'],
  updated: '2026-11-13',
  inputs: [
    { id: 'cases', label: 'OSHA recordable cases', type: 'number', value: 5, help: 'All injuries and illnesses on your OSHA 300 log for the period.' },
    { id: 'hours', label: 'Total hours worked', type: 'number', value: 400000, suffix: 'hours', help: 'All employees, including overtime. Exclude vacation, sick and holiday hours.' },
    { id: 'dart', label: 'DART cases (optional)', type: 'number', value: 2, help: 'Cases with days away, restricted work or job transfer (300 log columns H + I).' },
    { id: 'lost', label: 'Days-away cases (optional)', type: 'number', value: 1, help: 'Cases with at least one day away from work (column H). Used for LTIR.' },
    { id: 'days', label: 'Days away from work (optional)', type: 'number', value: 30, suffix: 'days', help: 'Total days away (column K), for the severity rate.' }
  ],
  compute(v, H) {
    if (!(v.hours > 0)) return { error: 'Enter total hours worked by all employees.' };
    if (!(v.cases >= 0)) return { error: 'Enter the number of recordable cases (0 if none).' };
    var k = 200000 / v.hours;
    var trir = v.cases * k;
    var rows = [['Full-time equivalent workers', H.num(v.hours / 2000, 1)]];
    if (v.dart >= 0) {
      if (v.dart > v.cases) return { error: 'DART cases cannot exceed total recordable cases.' };
      rows.push(['DART rate', H.fix(v.dart * k, 2), true]);
    }
    if (v.lost >= 0) {
      if (v.dart >= 0 && v.lost > v.dart) return { error: 'Days-away cases are part of DART cases, so they cannot exceed them.' };
      rows.push(['Lost time incident rate (LTIR)', H.fix(v.lost * k, 2)]);
    }
    if (v.days >= 0) rows.push(['Severity rate (days away per 100 FTE)', H.fix(v.days * k, 2)]);
    rows.push(['Hours per recordable case', v.cases > 0 ? H.int(v.hours / v.cases) : 'no cases']);
    var sub = trir < 2.3 ? 'Below the 2.3 average for U.S. private industry in 2024 (BLS); compare with your own industry\'s rate.'
      : trir < 3.5 ? 'Close to or above the 2.3 average for U.S. private industry in 2024 (BLS); check your industry\'s rate before judging it.'
      : 'Well above the 2.3 private-industry average for 2024 (BLS); many prequalification forms flag rates in this range.';
    return {
      value: H.fix(trir, 2),
      label: 'Total recordable incident rate (per 100 full-time workers)',
      expr: H.num(v.cases, 0) + ' × 200,000 ÷ ' + H.int(v.hours) + ' h',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `TRIR = recordable cases × 200,000 ÷ total hours worked. A company with <strong>5 OSHA recordable cases</strong> and <strong>400,000 hours</strong> worked (about 200 full-time employees) has a TRIR of 5 × 200,000 ÷ 400,000 = <strong>${r.value}</strong> cases per 100 full-time workers. BLS put the U.S. private-industry average at 2.3 for 2024.`,
  stepsTitle: 'How to calculate TRIR step by step',
  steps: [
    'Count the recordable injuries and illnesses on your OSHA Form 300 for the period (usually a calendar year). First-aid-only cases are not recordable and do not count.',
    'Total the <strong>hours actually worked</strong> by all employees, including overtime and temporary workers you supervise day to day. Leave out paid vacation, sick leave and holidays; this is where most errors come from. Your OSHA 300A already has this total.',
    'Multiply recordable cases by 200,000, the hours 100 full-time employees work in a year.',
    'Divide by total hours worked. The result is cases per 100 full-time workers, comparable with BLS industry rates.'
  ],
  formulaTitle: 'What is the TRIR formula?',
  formula: {
    expr: 'TRIR = Recordable cases × 200,000 ÷ Hours worked<br>DART rate = DART cases × 200,000 ÷ Hours worked<br>LTIR = Days-away cases × 200,000 ÷ Hours worked',
    vars: [['200,000', '100 employees × 40 hours × 50 weeks: the OSHA/BLS base'], ['Recordable cases', 'every case on the OSHA 300 log'], ['DART cases', 'cases with days away, restricted duty or job transfer'], ['Hours worked', 'actual hours by all employees in the same period']],
    note: 'The same formula works for any period. For a quarter, use that quarter\'s cases and hours; the 200,000 base still converts it to an annualized rate per 100 workers.'
  },
  example: `<p>BLS uses this example: ABC Company has 200 employees who worked 400,000 hours in a year and recorded 7 injuries and illnesses, 3 of them with days away, restricted work or job transfer.</p>
<p>TRIR = 7 × 200,000 ÷ 400,000 = <strong>3.5</strong>.</p>
<p>DART rate = 3 × 200,000 ÷ 400,000 = <strong>1.5</strong>.</p>
<p>That means 3.5 recordable cases for every 100 full-time workers, well above the 2024 private-industry average of 2.3.</p>`,
  table: {
    title: 'What TRIR do different case counts and hours produce?',
    intro: 'TRIR for common combinations of recordable cases and annual hours. 100,000 hours is roughly 50 full-time employees; 1,000,000 hours is about 500.',
    head: ['Recordable cases', '100,000 h', '200,000 h', '400,000 h', '1,000,000 h', '2,000,000 h'],
    rows: ({ run }) => [0, 1, 2, 3, 5, 8, 10, 15, 25].map(c => [String(c), ...[100000, 200000, 400000, 1000000, 2000000].map(h => run({ cases: c, hours: h, dart: '', lost: '', days: '' }).value)]),
    note: 'One case at a small company moves TRIR a lot: 1 case in 100,000 hours is already 2.00. Many owners and insurers look at three-year averages for that reason.'
  },
  sections: [
    {
      h2: 'Why does OSHA use 200,000 hours?',
      html: `<p>200,000 is the number of hours 100 full-time employees work in a year at 40 hours a week for 50 weeks. Multiplying by it turns your raw case count into a rate per 100 full-time workers, so a 30-person contractor and a 3,000-person manufacturer can be compared on the same scale. The Bureau of Labor Statistics uses the same base for its national Survey of Occupational Injuries and Illnesses, which is why your TRIR can be compared directly with the industry averages it publishes.</p>`
    },
    {
      h2: 'What is a good TRIR?',
      html: `<p>Lower is better, and "good" depends on your industry. BLS reported a total recordable case rate of <strong>2.3 cases per 100 full-time workers</strong> for U.S. private industry in 2024, down from 2.4 in 2023. Rates vary widely by sector: information was 0.7, while health care and social assistance was 3.4 in 2024.</p>
<p>For contractor prequalification, many owners ask for TRIR and DART for the past three years and compare them with the BLS rate for your NAICS code. Being below your industry average is the usual bar; some owners set a fixed cutoff. Look up your industry in the BLS injury and illness tables before setting a target.</p>`
    },
    {
      h2: 'How do you calculate DART and lost time incident rate?',
      html: `<p>Both use the same formula as TRIR with a narrower case count:</p>
<ul><li><strong>DART rate:</strong> cases involving days away, restricted work or job transfer (OSHA 300 columns H and I) × 200,000 ÷ hours.</li>
<li><strong>LTIR (lost time incident rate):</strong> cases with at least one day away from work (column H) × 200,000 ÷ hours. Some companies count only days away; others also include restricted duty, so state which definition you use.</li>
<li><strong>Severity rate:</strong> total days away (column K) × 200,000 ÷ hours, showing how serious the cases were.</li></ul>
<p>With the defaults above, 2 DART cases and 1 days-away case in 400,000 hours give a DART rate of 1.00 and an LTIR of 0.50.</p>`
    },
    {
      h2: 'What counts as an OSHA recordable injury?',
      html: `<p>Under 29 CFR 1904.7, a work-related injury or illness is recordable if it results in any of these:</p>
<ul><li>death</li><li>days away from work</li><li>restricted work or transfer to another job</li><li>medical treatment beyond first aid</li><li>loss of consciousness</li><li>a significant injury or illness diagnosed by a physician or other licensed health care professional</li></ul>
<p>First aid, such as bandages, non-prescription medication at non-prescription strength, ice, or removing a splinter, does not make a case recordable on its own. Misclassifying first-aid cases as recordable inflates TRIR; leaving out real recordables understates it and violates the recordkeeping rule.</p>`
    }
  ],
  faq: [
    { q: 'How is TRIR calculated?', a: 'Multiply the number of OSHA recordable cases by 200,000 and divide by total hours worked by all employees in the same period. 5 cases in 400,000 hours gives a TRIR of 2.50.' },
    { q: 'What hours should I include in TRIR?', a: 'Hours actually worked by all employees, including overtime and supervised temporary workers. Exclude paid vacation, sick leave and holidays. If you lack payroll hours, estimate employees × hours worked per employee and note it.' },
    { q: 'Is TRIR the same as the OSHA incidence rate?', a: 'Yes. TRIR is the common name for the OSHA total recordable case incidence rate, calculated per 100 full-time workers with the 200,000-hour base.' },
    { q: 'What is the difference between TRIR and DART?', a: 'TRIR counts every recordable case. DART counts only the more serious cases that caused days away, restricted duty or a job transfer, so DART is always equal to or lower than TRIR.' },
    { q: 'Can I calculate TRIR for one month?', a: 'Yes. Use that month\'s cases and hours; the 200,000 base annualizes it. Monthly rates jump around at small companies, so a rolling 12-month figure is more meaningful.' },
    { q: 'How is EMR calculated in construction?', a: 'EMR (experience modification rate) is a workers\' compensation factor, not an OSHA rate. A rating bureau such as NCCI compares your actual claim losses with expected losses for your payroll and job classes, usually over three years. 1.0 is average; below 1.0 lowers your premium.' },
    { q: 'Do contractor injuries count in my TRIR?', a: 'Count temporary or leased workers you supervise day to day; their cases go on your OSHA 300 log. Independent contractors who direct their own work are recorded by their own employer.' }
  ],
  related: ['time-card-calculator', 'productivity-calculator', 'utilization-rate-calculator', 'percentage-calculator'],
  sources: [
    { name: 'BLS: How to compute a firm\'s incidence rate for safety management', url: 'https://www.bls.gov/iif/overview/compute-nonfatal-incidence-rates.htm' },
    { name: 'BLS: Employer-Reported Workplace Injuries and Illnesses, 2024 (news release)', url: 'https://www.bls.gov/news.release/osh.nr0.htm' },
    { name: 'OSHA: 29 CFR 1904.7, General recording criteria', url: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.7' },
    { name: 'OSHA: Injury and illness recordkeeping forms (300, 300A, 301)', url: 'https://www.osha.gov/recordkeeping/forms' }
  ]
};
