export default {
  slug: 'rmd-calculator',
  hub: 'investing',
  name: 'RMD Calculator',
  title: 'RMD Calculator 2026: $500,000 at Age 75 Is $20,325',
  h1: 'Required Minimum Distribution Calculator With the IRS Uniform Lifetime Table',
  meta: 'A $500,000 IRA on Dec 31, 2025 at age 75 in 2026 means a $20,325.20 RMD (÷ 24.6), using the IRS Uniform Lifetime Table and SECURE 2.0\'s start age of 73.',
  keyword: 'how do i calculate my rmd',
  also: ['rmd calculator', 'how to calculate required minimum distribution', 'how rmd is calculated', 'how to calculate minimum required distribution', 'how is ira rmd calculated', 'how do i calculate my rmd for 2026', 'required minimum distribution calculator', 'uniform lifetime table'],
  updated: '2026-11-13',
  inputs: [
    { id: 'balance', label: 'Account balance on Dec 31 of last year', type: 'number', value: 500000, prefix: '$', help: 'For a 2026 RMD, use the Dec 31, 2025 value from your year-end statement.' },
    { id: 'born', label: 'Year you were born', type: 'number', value: 1951 },
    { id: 'year', label: 'RMD for tax year', type: 'number', value: 2026 },
    { id: 'growth', label: 'Expected growth (for future RMDs)', type: 'number', value: 5, suffix: '%' }
  ],
  data: {
    ult: { 72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1, 108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1, 114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3, 120: 2.0 }
  },
  compute(v, H, D) {
    if (!(v.balance >= 0)) return { error: 'Enter the account balance at the end of last year.' };
    var born = Math.round(v.born), yr = Math.round(v.year);
    if (!(born >= 1900 && born <= 2010)) return { error: 'Enter the year you were born.' };
    if (!(yr >= 2023 && yr <= 2100)) return { error: 'Enter a tax year from 2023 on.' };
    var age = yr - born;
    var start = born <= 1950 ? 72 : born <= 1959 ? 73 : 75;
    function div(a) { return a >= 120 ? D.ult[120] : D.ult[a]; }
    if (age < start) {
      return {
        value: 'No RMD yet',
        label: 'You turn ' + age + ' in ' + yr,
        rows: [['Your RMD starting age', String(start), true], ['First RMD year', String(born + start)], ['First deadline', 'Apr 1, ' + (born + start + 1)]],
        sub: 'Under SECURE 2.0, people born in ' + (start === 75 ? '1960 or later start at 75.' : '1951–1959 start at 73.') + ' You can still withdraw before then; it just isn\'t required.'
      };
    }
    var d = div(age);
    var rmd = v.balance / d;
    var first = age === start;
    var g = isNaN(v.growth) ? 0 : v.growth / 100;
    var b = v.balance, sched = [];
    for (var k = 0; k < 15 && age + k <= 120; k++) {
      var dk = div(age + k), rk = b / dk;
      sched.push([String(yr + k), String(age + k), H.fix(dk, 1), H.money0(b), H.money0(rk), H.pct(100 / dk, 2)]);
      b = (b - rk) * (1 + g);
    }
    return {
      value: H.money(rmd),
      label: 'Your ' + yr + ' required minimum distribution',
      expr: H.money0(v.balance) + ' ÷ ' + H.fix(d, 1),
      rows: [
        ['Age in ' + yr, String(age)],
        ['Uniform Lifetime divisor', H.fix(d, 1)],
        ['Share of balance', H.pct(100 / d, 2)],
        ['Monthly if spread evenly', H.money(rmd / 12)],
        ['Deadline', first ? 'Apr 1, ' + (yr + 1) + ' (first RMD)' : 'Dec 31, ' + yr, true]
      ],
      sub: first ? 'Waiting until April 1 means two RMDs in ' + (yr + 1) + ', both taxable that year.' : 'Withdraw at least this much by December 31 to avoid the 25% excise tax.',
      table: { head: ['Year', 'Age', 'Divisor', 'Prior Dec 31 balance', 'RMD', '% of balance'], rows: sched, caption: 'Projected RMDs at ' + H.pct(g * 100, 1) + ' growth' }
    };
  },
  quick: ({ r }) => `To calculate your RMD, divide your account balance on December 31 of last year by the IRS Uniform Lifetime Table divisor for the age you reach this year. A <strong>$500,000</strong> IRA balance at the end of 2025 and age <strong>75</strong> in 2026 means $500,000 ÷ 24.6 = <strong>${r.value}</strong>, due by December 31, 2026. RMDs start at 73 (75 if you were born in 1960 or later).`,
  stepsTitle: 'How to calculate your RMD in 4 steps',
  steps: [
    'Find each account\'s fair market value on <strong>December 31 of the previous year</strong> (Dec 31, 2025 for your 2026 RMD). Using the current balance instead of the year-end balance is the most common mistake.',
    'Work out the age you reach on your birthday this year, even if your birthday is in December.',
    'Look up that age in the IRS Uniform Lifetime Table (Table III in Publication 590-B, shown in full below). Use Table II instead if your spouse is your sole beneficiary and more than 10 years younger.',
    'Divide the balance by the divisor. Repeat for each account; IRA RMDs can then be added up and taken from any one IRA, but each 401(k) must pay out its own RMD.'
  ],
  formulaTitle: 'What is the RMD formula?',
  formula: {
    expr: 'RMD = Account balance on Dec 31 of prior year ÷ Distribution period',
    vars: [['Account balance', 'fair market value at the end of the previous year, including outstanding rollovers'], ['Distribution period', 'divisor from the IRS Uniform Lifetime Table for your age this year']],
    note: 'The divisor shrinks every year, so the percentage you must withdraw rises: 3.77% at 73, 4.95% at 80, 8.20% at 90 and 15.63% at 100.'
  },
  example: `<p>Linda was born in 1951, so she turns 75 in 2026. Her traditional IRA was worth $500,000 on December 31, 2025.</p>
<p>Divisor at age 75 = <strong>24.6</strong>. RMD = $500,000 ÷ 24.6 = <strong>$20,325.20</strong>, which is 4.07% of the balance. She must withdraw at least that by December 31, 2026.</p>
<p>If her IRA grows 5% a year after each withdrawal, her 2027 RMD (age 76, divisor 23.7) is about $21,251 on a balance near $503,659. The calculator's projection shows the RMD rising every year even as the balance levels off. If her husband, the sole beneficiary, were 64, she could use the Joint and Last Survivor table instead: divisor 25.3 and an RMD of $19,762.85.</p>`,
  table: {
    title: 'IRS Uniform Lifetime Table: what is the divisor for each age?',
    intro: 'The full Table III (Uniform Lifetime) from IRS Publication 590-B, used for RMDs from 2022 on, with the RMD per $100,000 of balance.',
    head: ['Age', 'Divisor', 'RMD per $100K', 'Age', 'Divisor', 'RMD per $100K'],
    rows: ({ D, H }) => {
      const out = [];
      for (let a = 72; a <= 96; a++) {
        const b = a + 25;
        const left = [String(a), H.fix(D.ult[a], 1), H.money0(100000 / D.ult[a])];
        const right = b <= 120 ? [b === 120 ? '120+' : String(b), H.fix(D.ult[b], 1), H.money0(100000 / D.ult[b])] : ['', '', ''];
        out.push(left.concat(right));
      }
      return out;
    },
    note: 'Age 72 applies only to people who turned 72 before 2023; anyone born in 1951 or later starts at 73 or 75. Source: IRS Publication 590-B, Appendix B, Table III.'
  },
  sections: [
    {
      h2: 'When do I have to start taking RMDs?',
      html: `<p>The SECURE 2.0 Act raised the starting age twice. Your first RMD is for the year you reach:</p>
<div class="twrap"><table><thead><tr><th>Born</th><th>RMD starting age</th><th>First RMD year</th></tr></thead><tbody>
<tr><td>Before July 1, 1949</td><td>70½</td><td>Already started</td></tr>
<tr><td>July 1, 1949 – 1950</td><td>72</td><td>Already started</td></tr>
<tr><td>1951 – 1959</td><td>73</td><td>2024 – 2032</td></tr>
<tr><td>1960 or later</td><td>75</td><td>2035 or later</td></tr>
</tbody></table></div>
<p>The first RMD can wait until April 1 of the following year; every later RMD is due by December 31. Delaying the first one means taking two in the same tax year, which can push you into a higher bracket and raise Medicare premiums. Someone born in 1953 turns 73 in 2026 and has until April 1, 2027, for the first one, but must also take the 2027 RMD by December 31, 2027.</p>
<p>If you are still working and don't own 5% or more of the company, your current employer's 401(k) may let you delay RMDs from that plan until you retire. IRAs get no such delay.</p>`
    },
    {
      h2: 'Which accounts have required minimum distributions?',
      html: `<ul><li><strong>Yes:</strong> traditional IRAs, SEP IRAs, SIMPLE IRAs, 401(k), 403(b) and 457(b) plans, and profit-sharing plans.</li><li><strong>No (while the owner is alive):</strong> Roth IRAs, and since 2024, designated Roth accounts in 401(k) and 403(b) plans.</li><li><strong>Beneficiaries:</strong> inherited IRAs, including inherited Roth IRAs, have their own distribution rules.</li></ul>
<p>Aggregation rules matter when you have several accounts. Add up the RMDs from all your traditional, SEP and SIMPLE IRAs and take the total from any one or more of them. 403(b) RMDs can be combined the same way among 403(b)s. 401(k) and 457(b) RMDs must each come out of their own plan. A spouse's accounts are never combined with yours.</p>`
    },
    {
      h2: 'What happens if I miss an RMD?',
      html: `<p>The IRS charges an excise tax of <strong>25%</strong> of the amount you should have withdrawn but didn't. If you correct it within two years (generally by taking the missed amount and filing Form 5329), the tax drops to 10%. Under SECURE 2.0 these replaced the old 50% penalty. You can also ask the IRS to waive the tax for a reasonable error by attaching an explanation to Form 5329 once you've made up the shortfall.</p>
<p>Taking more than the RMD is always allowed, but the extra doesn't count toward next year's requirement.</p>`
    },
    {
      h2: 'How is an inherited IRA RMD calculated?',
      html: `<p>It depends on who you are and when the owner died. For deaths after 2019, most non-spouse beneficiaries must empty the account by the end of the 10th year after death; if the owner had already started RMDs, the beneficiary must also take yearly RMDs in years 1–9, based on the IRS Single Life Expectancy table (Table I). Spouses, minor children of the owner, disabled or chronically ill beneficiaries and people not more than 10 years younger than the owner can stretch withdrawals over their own life expectancy. A spouse can also roll the IRA into their own and use this calculator's Uniform Lifetime Table. Because the rules have several branches, check IRS Publication 590-B or the IRS RMD FAQs for your case.</p>`
    },
    {
      h2: 'How can I lower the tax on my RMD?',
      html: `<p>RMDs are taxed as ordinary income, and you can have federal tax withheld from the distribution. Ways people reduce the bill:</p>
<ul><li><strong>Qualified charitable distribution (QCD):</strong> from age 70½ you can send IRA money directly to a charity (up to $108,000 for 2025, indexed for inflation) and it counts toward your RMD without being taxed.</li><li><strong>Roth conversions before RMDs start:</strong> converting some pre-tax money in lower-income years shrinks the balance later RMDs are figured on.</li><li><strong>Time the first RMD:</strong> taking it in the year you turn 73 avoids doubling up the next year.</li></ul>
<p>To see how long the rest of your savings will last once withdrawals begin, try the <a href="/how-long-will-money-last-calculator">how long will my money last calculator</a>.</p>`
    }
  ],
  faq: [
    { q: 'What is the RMD for $100,000 at age 73?', a: 'The divisor at 73 is 26.5, so the RMD is $100,000 ÷ 26.5 = $3,773.58, or 3.77% of the balance.' },
    { q: 'What is the RMD on $1 million at age 75?', a: 'Divide by 24.6: $1,000,000 ÷ 24.6 = $40,650.41. At 80 the divisor is 20.2, giving $49,504.95.' },
    { q: 'Which balance do I use for my 2026 RMD?', a: 'The account value on December 31, 2025, from your year-end statement. Withdrawals or market changes during 2026 do not change the 2026 RMD.' },
    { q: 'Do I use my age now or my age at the end of the year?', a: 'Use the age you reach on your birthday in the RMD year. If you turn 75 in December 2026, use the age-75 divisor (24.6) for the whole of 2026.' },
    { q: 'Can I take my RMD in monthly installments?', a: 'Yes. You can take the RMD in one payment or several during the year, as long as the total reaches the required amount by the deadline. Many custodians offer automatic monthly RMD payments.' },
    { q: 'Do Roth IRAs have RMDs?', a: 'No, not while the original owner is alive. Since 2024, Roth accounts inside 401(k) and 403(b) plans are also exempt. Beneficiaries who inherit a Roth do have to take distributions.' },
    { q: 'Is the RMD age 73 or 75?', a: 'It is 73 if you were born from 1951 through 1959 and 75 if you were born in 1960 or later, under the SECURE 2.0 Act.' },
    { q: 'Can I reinvest my RMD?', a: 'You cannot put it back into an IRA or roll it over, but you can invest it in a regular taxable brokerage account, or contribute to a Roth IRA if you have earned income.' }
  ],
  related: ['how-long-will-money-last-calculator', 'retirement-calculator', 'social-security-calculator', 'income-tax-calculator', 'magi-calculator'],
  sources: [
    { name: 'IRS: Retirement topics, required minimum distributions (RMDs)', url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds' },
    { name: 'IRS Publication 590-B: Distributions from IRAs (Appendix B life expectancy tables)', url: 'https://www.irs.gov/publications/p590b' },
    { name: 'IRS: Retirement plan and IRA required minimum distributions FAQs', url: 'https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs' },
    { name: 'SEC Investor.gov: Required Minimum Distribution Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/required-minimum-distribution-calculator' }
  ],
  disclaimer: 'For IRA owners using the Uniform Lifetime Table. Not tax advice; inherited accounts and spouses more than 10 years younger use other IRS tables.'
};
