export default {
  slug: 'what-grade-calculator',
  hub: 'education',
  name: 'What Grade Was I In Calculator',
  title: 'What Grade Was I In Calculator: Class of 2010 on 9/11 = 4th',
  h1: 'What Grade Was I In? Look Up Any School Year or Date',
  meta: 'The Class of 2010 was in 4th grade on Sep 11, 2001. Enter a graduation year or birth date and any date to see the grade, school year and typical age.',
  keyword: 'what grade was i in year calculator',
  also: ['what grade should i be in based on birthday calculator', 'what grade was i in calculator', 'what grade is my child in', 'what grade was i in on 9/11', 'what grade would i be in'],
  updated: '2026-11-13',
  inputs: [
    { id: 'mode', label: 'I know', type: 'select', value: 'grad', options: [['grad', 'The high school graduation year'], ['birth', 'The date of birth']] },
    { id: 'gradYear', label: 'High school graduation year', type: 'number', value: 2010, showIf: { mode: ['grad'] }, placeholder: 'e.g. 2010' },
    { id: 'birth', label: 'Date of birth', type: 'date', value: '2016-05-20', showIf: { mode: ['birth'] } },
    { id: 'cutoff', label: 'Kindergarten cutoff (must be 5 by)', type: 'select', value: '09-01', showIf: { mode: ['birth'] }, options: [['09-01', 'Sep 1 (most states)'], ['08-01', 'Aug 1'], ['08-31', 'Aug 31'], ['09-30', 'Sep 30'], ['10-01', 'Oct 1'], ['12-01', 'Dec 1'], ['12-31', 'Dec 31']] },
    { id: 'on', label: 'What grade on this date?', type: 'date', value: '2001-09-11' }
  ],
  compute(v, H) {
    var d = H.parseDate(v.on);
    if (!d) return { error: 'Enter the date you want to look up.' };
    var Y = d.getUTCFullYear(), m = d.getUTCMonth();
    var fall = m >= 7 ? Y : m <= 5 ? Y - 1 : Y, summer = m === 6;
    var k, b = null;
    if (v.mode === 'birth') {
      b = H.parseDate(v.birth);
      if (!b) return { error: 'Enter a valid date of birth.' };
      var by = b.getUTCFullYear(), p = String(v.cutoff || '09-01').split('-');
      var fifth = new Date(Date.UTC(by + 5, b.getUTCMonth(), b.getUTCDate()));
      k = fifth.getTime() <= Date.UTC(by + 5, Number(p[0]) - 1, Number(p[1])) ? by + 5 : by + 6;
    } else {
      if (!(v.gradYear >= 1900 && v.gradYear <= 2100)) return { error: 'Enter a graduation year such as 2010.' };
      k = Math.round(v.gradYear) - 13;
    }
    var g = fall - k, grad = k + 13;
    var name = function (n) {
      if (n === 0) return 'Kindergarten';
      if (n >= 1 && n <= 12) return H.ord(n) + ' grade';
      if (n === -1) return 'Pre-K';
      if (n < -1) return 'Not in school yet';
      if (n <= 16) return 'College ' + ['freshman', 'sophomore', 'junior', 'senior'][n - 13] + ' (if in college)';
      return H.plural(n - 12, 'year') + ' after high school';
    };
    var level = g < 0 ? 'before kindergarten' : g <= 5 ? 'elementary school' : g <= 8 ? 'middle school' : g <= 12 ? 'high school' : 'after high school';
    var sy = fall + '–' + String(fall + 1).slice(2);
    var rows = [
      ['School year', sy + (summer ? ' (starting soon; this date is summer break)' : ''), true],
      ['Stage', level],
      ['Class of', String(grad)],
      ['Started kindergarten', 'fall ' + k]
    ];
    if (g >= 0 && g <= 12) rows.push(['Typical age that year', (g + 5) + ' turning ' + (g + 6)]);
    if (b) { var a = H.ymdDiff(b, d); rows.push(['Age on that date', a.y >= 0 ? a.y + ' years ' + a.m + ' months' : 'not born yet']); }
    var label = (summer ? 'Grade starting in fall ' + fall : 'Grade on ' + H.fmtDate(d)) + ' (' + sy + ')';
    var sub = summer ? 'July is summer break, so this shows the grade that started in August or September.' : (m === 5 ? 'Many schools let out in June, so if school had ended this was the summer after ' + name(g).toLowerCase() + '.' : 'Grades follow the school year, which runs from about August or September through May or June.');
    return { value: name(g), label: label, expr: (v.mode === 'birth' ? 'K fall ' + k : 'Class of ' + grad) + ' · school year ' + sy, rows: rows, sub: sub, g: g };
  },
  quick: ({ r }) => `If you graduated high school in 2010, you were in <strong>${r.value.toLowerCase()}</strong> on September 11, 2001. That date fell in the 2001–02 school year, eight years before your 2009–10 senior year, and 12 − 8 = 4. The general rule: grade = 12 − (graduation year − the spring year of that school year).`,
  stepsTitle: 'How to work out what grade you were in',
  steps: [
    'Find the school year that contains your date. Dates from August to December belong to the school year starting that fall; dates from January to June belong to the one that started the previous fall.',
    'Take the spring year of that school year (2001–02 → 2002).',
    'Subtract it from your graduation year and subtract the result from 12: Class of 2010 in 2001–02 is 12 − (2010 − 2002) = 4th grade. A result of 0 is kindergarten.',
    'If you only know a birth date, find the fall the child turned 5 before the cutoff (that is kindergarten) and count up one grade per year. The step people miss is the January–June rule: spring 2002 is still the 2001–02 school year.'
  ],
  formulaTitle: 'What is the formula for which grade you were in?',
  formula: {
    expr: 'Grade = 12 − (graduation year − spring year of the school year)<br>From a birth date: grade = fall year of the school year − kindergarten fall year',
    vars: [['spring year', 'the year the school year ends (2001–02 → 2002)'], ['0', 'kindergarten; −1 is pre-K'], ['kindergarten fall year', 'the fall a child is 5 by the cutoff (birth year + 5 or + 6)']],
    note: 'Results above 12 are years after high school: 13 is the first year of college for students who went straight on.'
  },
  example: `<p><strong>From a graduation year:</strong> someone in the Class of 2016 wants to know their grade in March 2008. March belongs to the 2007–08 school year, spring year 2008. Grade = 12 − (2016 − 2008) = <strong>4th grade</strong>.</p>
<p><strong>From a birth date:</strong> a child born October 4, 2018, in a state with a September 1 cutoff, turned 5 after the 2023 cutoff, so kindergarten started in fall 2024. In the 2026–27 school year the child is in 2026 − 2024 = <strong>2nd grade</strong>. Born a month earlier, on September 1 or before, the child would be in 3rd grade.</p>`,
  table: {
    title: 'What grade is each graduating class in for 2026–27?',
    intro: 'Grade by high school graduation year during the current school year (fall 2026 to spring 2027).',
    head: ['Class of', 'Grade in 2026–27', 'Typical age'],
    rows: ({ run }) => [2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040].map(c => { const r = run({ mode: 'grad', gradYear: c, on: '2026-11-13' }); return [c, r.value, r.g >= 0 ? (r.g + 5) + '–' + (r.g + 6) : '4']; }),
    note: 'Seniors (12th grade) are the Class of 2027; this year\'s kindergartners are the Class of 2039.'
  },
  sections: [
    {
      h2: 'What grade was I in on 9/11?',
      html: `<p>September 11, 2001 was early in the 2001–02 school year, so the grade equals 12 − (your class year − 2002). The Class of 2002 were seniors, the Class of 2006 were in 8th grade, the Class of 2010 in 4th grade and the Class of 2014 in kindergarten. If you graduated in 2015 or later, you were not yet in kindergarten.</p>
<p>The same method works for any event: the 2008 election in November (2008–09 school year), the March 2020 school closures (2019–20) or the 2012 London Olympics, which ran from late July into August, right around the start of 2012–13.</p>`
    },
    {
      h2: 'What grade should my child be in based on their birthday?',
      html: `<p>Switch the calculator to "date of birth" and choose your state's cutoff. Under the most common rule, a child must turn 5 by September 1 to start kindergarten that fall, so in 2026–27:</p>
<ul><li>Born Sep 2, 2020 to Sep 1, 2021: kindergarten</li><li>Born Sep 2, 2019 to Sep 1, 2020: 1st grade</li><li>Born Sep 2, 2016 to Sep 1, 2017: 4th grade</li><li>Born Sep 2, 2012 to Sep 1, 2013: 8th grade</li><li>Born Sep 2, 2008 to Sep 1, 2009: 12th grade</li></ul>
<p>Children who started late, repeated or skipped a grade will be one grade off. To see the year a child will finish high school, use the <a href="/graduation-year-calculator">graduation year calculator</a>.</p>`
    },
    {
      h2: 'How old are kids in each grade?',
      html: `<p>Students turn the second age during the school year. With a September 1 cutoff:</p>
<div class="twrap"><table><thead><tr><th>Grade</th><th>Age at start → end</th><th>Grade</th><th>Age at start → end</th></tr></thead><tbody>
<tr><td>Kindergarten</td><td>5 → 6</td><td>7th</td><td>12 → 13</td></tr><tr><td>1st</td><td>6 → 7</td><td>8th</td><td>13 → 14</td></tr><tr><td>2nd</td><td>7 → 8</td><td>9th (freshman)</td><td>14 → 15</td></tr><tr><td>3rd</td><td>8 → 9</td><td>10th (sophomore)</td><td>15 → 16</td></tr><tr><td>4th</td><td>9 → 10</td><td>11th (junior)</td><td>16 → 17</td></tr><tr><td>5th</td><td>10 → 11</td><td>12th (senior)</td><td>17 → 18</td></tr><tr><td>6th</td><td>11 → 12</td><td></td><td></td></tr>
</tbody></table></div>
<p>Summer birthdays are the youngest in their grade and may still be the lower age at the end of the year.</p>`
    }
  ],
  faq: [
    { q: 'What grade was the Class of 2010 in during 2008?', a: 'In spring 2008 (the 2007–08 school year) the Class of 2010 was in 10th grade; from fall 2008 they were in 11th grade.' },
    { q: 'What grade is the Class of 2030 in now?', a: 'In the 2026–27 school year, the Class of 2030 is in 9th grade (high school freshmen).' },
    { q: 'What grade is a 10-year-old in?', a: 'Usually 4th or 5th grade. A child who turns 10 during the school year is typically in 4th grade; one who was already 10 when the year started is usually in 5th.' },
    { q: 'What grade is a child born in 2019 in?', a: 'In 2026–27, with a September 1 cutoff, a child born January 1 to September 1, 2019 is in 2nd grade, and one born later in 2019 is in 1st grade.' },
    { q: 'What grade was I in in 2008 if I was born in 1995?', a: 'With a September 1 cutoff, a child born January 1 to September 1, 1995 started kindergarten in 2000 and was in 8th grade in fall 2008; one born September 2 to December 31, 1995 was in 7th grade.' },
    { q: 'Does the calculator work for summer dates?', a: 'Yes. July dates show the grade that starts that fall, and June dates show the grade that is ending, since many schools are still in session in early June.' }
  ],
  related: ['graduation-year-calculator', 'age-calculator', 'class-rank-calculator', 'day-of-week-calculator'],
  sources: [
    { name: 'NCES: State Education Reforms, kindergarten entrance age by state', url: 'https://nces.ed.gov/programs/statereform/' },
    { name: 'Wikipedia: Education in the United States (grade levels and ages)', url: 'https://en.wikipedia.org/wiki/Education_in_the_United_States' }
  ]
};
