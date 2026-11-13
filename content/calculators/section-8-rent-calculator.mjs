export default {
  slug: 'section-8-rent-calculator',
  hub: 'mortgage',
  name: 'Section 8 Rent Calculator',
  title: 'Section 8 Rent Calculator: $24K Income Pays $574 a Month',
  h1: 'Section 8 Rent Calculator: Total Tenant Payment and Voucher Share',
  meta: 'A family of three earning $24,000 pays about $574 a month toward rent and utilities under HUD\'s 30% rule, and the voucher covers the rest. 2027 HOTMA rules.',
  keyword: 'how is section 8 rent calculated',
  also: ['how to calculate section 8 rent', 'how to calculate rent for section 8', 'how does section 8 calculate rent', 'how is section 8 housing rent calculated', 'how is rent calculated for section 8 housing', 'how do income based apartments calculate rent'],
  updated: '2026-11-13',
  inputs: [
    { id: 'income', label: 'Annual household income (gross, all members)', type: 'number', value: 24000, prefix: '$', wide: true },
    { id: 'deps', label: 'Dependents (under 18, full-time students, or with a disability)', type: 'number', value: 2, wide: true },
    { id: 'elderly', label: 'Head, spouse or co-head is 62+ or has a disability', type: 'checkbox', value: false, wide: true },
    { id: 'childcare', label: 'Child care costs (to work or study)', type: 'number', value: 0, prefix: '$', suffix: '/ yr' },
    { id: 'medical', label: 'Unreimbursed medical / disability costs', type: 'number', value: 0, prefix: '$', suffix: '/ yr', help: 'Medical counts only for elderly or disabled families.' },
    { id: 'rules', label: 'Deduction rules', type: 'select', value: 'h27', options: [['h27', 'HOTMA, 2027 amounts ($525 / $575, 10% threshold)'], ['h26', 'HOTMA, 2026 amounts ($500 / $550, 10% threshold)'], ['old', 'Pre-HOTMA ($480 / $400, 3% threshold)']], wide: true },
    { id: 'contract', label: 'Unit rent charged by landlord', type: 'number', value: 1350, prefix: '$', suffix: '/ mo' },
    { id: 'ua', label: 'Utility allowance (tenant-paid utilities)', type: 'number', value: 150, prefix: '$', suffix: '/ mo' },
    { id: 'ps', label: 'Payment standard for the unit size', type: 'number', value: 1500, prefix: '$', suffix: '/ mo' },
    { id: 'minRent', label: 'Housing agency minimum rent', type: 'number', value: 50, prefix: '$' }
  ],
  data: { rules: { h27: [525, 575, 0.10], h26: [500, 550, 0.10], old: [480, 400, 0.03] } },
  compute(v, H, D) {
    if (!(v.income >= 0)) return { error: 'Enter annual household income (0 if none).' };
    var R = D.rules[v.rules] || D.rules.h27;
    var z = function (x) { return x > 0 ? x : 0; };
    var deps = Math.floor(z(v.deps));
    var depDed = deps * R[0];
    var eldDed = v.elderly ? R[1] : 0;
    var medDed = v.elderly ? Math.max(0, z(v.medical) - R[2] * v.income) : 0;
    var care = Math.min(z(v.childcare), v.income);
    var adj = Math.max(0, v.income - depDed - eldDed - medDed - care);
    var t30 = adj * 0.3 / 12, t10 = v.income * 0.1 / 12, tmin = z(v.minRent);
    var ttp = Math.max(t30, t10, tmin);
    var which = ttp === t30 ? '30% of adjusted income' : ttp === t10 ? '10% of gross income' : 'minimum rent';
    var ua = z(v.ua), gross = z(v.contract) + ua, ps = z(v.ps);
    var rows = [];
    if (gross > 0 && ps > 0) {
      var share = ttp + Math.max(0, gross - ps);
      var toOwner = share - ua;
      var hap = Math.max(0, Math.min(ps, gross) - ttp);
      rows.push(['Rent you pay the landlord', toOwner >= 0 ? H.money(toOwner) : '$0 (utility reimbursement ' + H.money(-toOwner) + ')', true]);
      rows.push(['Utility allowance (you pay utilities)', H.money(ua)]);
      rows.push(['Housing assistance payment to landlord', H.money(hap), true]);
      rows.push(['Your total share (rent + utilities)', H.money(share)]);
      if (gross > ps) rows.push(['40% cap at move-in', share > adj * 0.4 / 12 ? 'Fails: ' + H.money(share) + ' is over 40% of adjusted income (' + H.money(adj * 0.4 / 12) + ')' : 'Passes (limit ' + H.money(adj * 0.4 / 12) + ')']);
    }
    rows.push(['Adjusted annual income', H.money0(adj)]);
    rows.push(['Deductions', H.money0(v.income - adj)]);
    rows.push(['30% of adjusted monthly income', H.money(t30)]);
    rows.push(['10% of gross monthly income', H.money(t10)]);
    return {
      value: H.money(ttp),
      label: 'Total tenant payment (TTP) per month',
      expr: 'greatest of 30% adj. ' + H.money0(t30) + ', 10% gross ' + H.money0(t10) + ', min ' + H.money0(tmin),
      rows: rows,
      sub: 'Set by ' + which + '. If the unit\'s rent plus utilities is above the payment standard, you pay the difference on top.'
    };
  },
  quick: ({ r }) => `Section 8 rent is set by the total tenant payment: the highest of 30% of adjusted monthly income, 10% of gross monthly income, or the agency's minimum rent. A family with <strong>$24,000</strong> of income and two children deducts 2 × $525, leaving $22,950; 30% of that is <strong>${r.value} a month</strong>. With a $150 utility allowance, the family pays the landlord ${r.rows[0][1]} and the voucher pays ${r.rows[2][1]}.`,
  stepsTitle: 'How Section 8 rent is calculated, step by step',
  steps: [
    'Add up the household\'s expected gross income for the next 12 months: wages, Social Security, SSI, pensions, child support, unemployment and income from assets. Earnings of children under 18 are excluded.',
    'Subtract the mandatory deductions to get <strong>adjusted income</strong>: a set amount per dependent, a set amount if the head, spouse or co-head is elderly (62+) or disabled, child care that lets someone work or study, and, for elderly or disabled families, medical and disability costs above a share of income.',
    'Take the greatest of 30% of adjusted monthly income, 10% of gross monthly income and the minimum rent (up to $50, set by your agency). That is the <strong>total tenant payment</strong>, which covers rent <em>and</em> utilities.',
    'Subtract the utility allowance for tenant-paid utilities. What is left is the rent you pay the landlord. Forgetting that the TTP already includes utilities is the most common source of confusion.',
    'If the unit\'s gross rent (rent + utility allowance) is above the payment standard, you also pay the difference, and at move-in your total share cannot exceed 40% of adjusted monthly income.'
  ],
  formulaTitle: 'What is the Section 8 rent formula?',
  formula: {
    expr: 'Adjusted income = gross income − dependents × $525 − $575 (elderly/disabled) − child care − medical above 10% of income<br>TTP = max(30% × adjusted ÷ 12, 10% × gross ÷ 12, minimum rent)<br>Family share = TTP + max(0, gross rent − payment standard) · Rent to landlord = family share − utility allowance<br>HAP = min(payment standard, gross rent) − TTP',
    vars: [['TTP', 'total tenant payment, the family\'s contribution to rent plus utilities'], ['gross rent', 'landlord\'s rent + utility allowance'], ['payment standard', 'the most the agency will subsidize for that unit size, set at 90–110% of HUD\'s Fair Market Rent'], ['HAP', 'housing assistance payment the agency sends the landlord']],
    note: 'Dollar amounts are HUD\'s 2027 HOTMA figures. Before an agency switched to HOTMA rules the deductions were $480 per dependent and $400 for elderly or disabled families, with a 3% medical threshold; choose those rules in the calculator if your agency still uses them.'
  },
  example: `<p>Gross income $24,000. Two dependents: 2 × $525 = $1,050. Adjusted income = <strong>$22,950</strong>.</p>
<p>30% of adjusted monthly income: $22,950 × 0.30 ÷ 12 = <strong>$573.75</strong>. 10% of gross monthly income: $200. Minimum rent: $50. TTP = <strong>$573.75</strong>.</p>
<p>The unit rents for $1,350 and the tenant pays utilities with a $150 allowance, so gross rent is $1,500, equal to the payment standard. The family pays the landlord $573.75 − $150 = <strong>$423.75</strong> and the housing agency pays <strong>$926.25</strong>.</p>`,
  table: {
    title: 'How much is Section 8 rent at different incomes?',
    intro: 'A family with two dependents, not elderly or disabled, in the default $1,350 unit with a $150 utility allowance and $1,500 payment standard (2027 HOTMA deductions).',
    head: ['Annual income', 'Adjusted income', 'TTP', 'Rent to landlord', 'Voucher pays'],
    rows: ({ run }) => [0, 6000, 12000, 18000, 24000, 30000, 36000, 42000, 48000, 60000].map(i => {
      const o = run({ income: i });
      const pick = k => (o.rows.find(x => x[0].indexOf(k) === 0) || [, '—'])[1];
      return ['$' + i.toLocaleString('en-US'), pick('Adjusted'), o.value, pick('Rent you pay'), pick('Housing assistance')];
    }),
    note: 'At $0 income the family owes the $50 minimum rent unless the agency grants a hardship exemption; the utility allowance exceeds it, so the agency pays the difference as a utility reimbursement. Income limits apply at admission, typically 50% of area median income.'
  },
  sections: [
    {
      h2: 'What deductions lower Section 8 rent?',
      html: `<p>The Housing Opportunity Through Modernization Act (HOTMA) raised the deductions and indexes them to inflation each year:</p>
<div class="twrap"><table><thead><tr><th>Deduction</th><th>Pre-HOTMA</th><th>HOTMA 2026</th><th>HOTMA 2027</th></tr></thead><tbody>
<tr><td>Each dependent</td><td>$480</td><td>$500</td><td>$525</td></tr>
<tr><td>Elderly or disabled family</td><td>$400</td><td>$550</td><td>$575</td></tr>
<tr><td>Medical and disability costs (elderly/disabled families)</td><td>above 3% of income</td><td>above 10% of income</td><td>above 10% of income</td></tr>
<tr><td>Child care to work, look for work or study</td><td>actual cost</td><td>actual cost</td><td>actual cost</td></tr>
</tbody></table></div>
<p>HUD's Notice PIH 2026-15 says it will enforce HOTMA compliance for most public housing agencies starting Jan 1, 2027, so recertifications effective in 2027 use the new rules; some agencies switched earlier. Families who lost part of their medical deduction under the higher threshold can get phased-in hardship relief. Ask your agency which rules applied to your last certification.</p>`
    },
    {
      h2: 'What income counts for Section 8?',
      html: `<p>Annual income is the gross income all household members expect to receive over the next 12 months, before taxes. It includes wages and tips, self-employment income, Social Security and SSI, pensions, unemployment, regular child support and alimony, and income from assets. Excluded are the earnings of children under 18, a dependent full-time student's earnings above $525 a year (2027), foster care payments, food assistance, and lump sums such as tax refunds.</p>
<p>Under HOTMA, when net family assets are $52,787 or less (2026), only actual income from them counts; above that, the agency imputes income at HUD's passbook rate for assets without a known return. Families with net assets above $105,574 can be denied new assistance. Report income changes promptly, because your agency recalculates the rent at your next interim or annual reexamination.</p>`
    },
    {
      h2: 'What is a payment standard, and can I rent a more expensive unit?',
      html: `<p>The payment standard is the maximum subsidy for a unit size in your area, set by your housing agency between 90% and 110% of HUD's Fair Market Rent, or by ZIP code where Small Area FMRs apply. You can rent a unit whose rent plus utilities is above the standard, but you pay the difference on top of the TTP. At initial lease-up, that total cannot exceed 40% of your adjusted monthly income: with $22,950 of adjusted income, the cap is $765 a month, so this family could pay at most about $191 above the payment standard.</p>
<p>The landlord's rent must also be "reasonable" compared with similar unassisted units, and the unit must pass inspection. For non-voucher affordable housing, the <a href="/rent-affordability-calculator">3x rent calculator</a> shows the income most market-rate landlords require.</p>`
    }
  ],
  faq: [
    { q: 'Do you pay 30% of your income on Section 8?', a: 'About 30% of adjusted income, which is gross income minus deductions, and that covers rent plus utilities. If 10% of gross income or the minimum rent is higher, you pay that instead.' },
    { q: 'What is the minimum rent for Section 8?', a: 'Housing agencies may set a minimum rent of up to $50 a month. Families who cannot pay it because of a financial hardship, such as losing a job, can request an exemption.' },
    { q: 'Can a landlord charge more than the payment standard?', a: 'Yes, if the rent is reasonable for the area, but the family pays the amount above the payment standard. At move-in the family\'s total share cannot exceed 40% of adjusted monthly income.' },
    { q: 'Does the Section 8 rent include utilities?', a: 'Yes. The total tenant payment covers rent and tenant-paid utilities. The agency subtracts a utility allowance, and the rest is the rent you pay the landlord.' },
    { q: 'What happens to my Section 8 rent if my income goes up?', a: 'Your share rises at the next reexamination: roughly 30 cents of each extra dollar of adjusted income. Agencies handle increases between annual reviews according to their written policies, so report changes as required.' },
    { q: 'How do income-based apartments calculate rent?', a: 'It depends on the program. Public housing and project-based Section 8 apartments use the same total tenant payment formula as vouchers, so your rent is about 30% of adjusted income minus a utility allowance. Low-Income Housing Tax Credit apartments work differently: the rent is a fixed maximum set at 30% of an income limit for the unit size, typically 50% or 60% of area median income, so it does not fall if your own income drops.' },
    { q: 'How much would my rent be with no income?', a: 'The TTP would be the agency\'s minimum rent, up to $50, or $0 if the agency has none or grants a hardship exemption. If the utility allowance is larger, the agency pays the difference to you or the utility company.' }
  ],
  related: ['rent-affordability-calculator', 'rent-increase-calculator', 'take-home-pay-calculator', 'dti-calculator'],
  sources: [
    { name: 'eCFR: 24 CFR 5.628, Total tenant payment', url: 'https://www.ecfr.gov/current/title-24/subtitle-A/part-5/subpart-F/section-5.628' },
    { name: 'eCFR: 24 CFR 5.611, Adjusted income', url: 'https://www.ecfr.gov/current/title-24/subtitle-A/part-5/subpart-F/section-5.611' },
    { name: 'eCFR: 24 CFR 982.505, Voucher tenancy: how to calculate housing assistance payment', url: 'https://www.ecfr.gov/current/title-24/subtitle-B/chapter-IX/part-982/subpart-K/section-982.505' },
    { name: 'HUD: Notice PIH 2026-15, HOTMA compliance date', url: 'https://www.hud.gov/sites/dfiles/hudclips/documents/PIH-2026-15.pdf' },
    { name: 'HUD: Housing Choice Voucher tenants', url: 'https://www.hud.gov/helping-americans/housing-choice-vouchers-tenants' },
    { name: 'HUD User: Fair Market Rents', url: 'https://www.huduser.gov/portal/datasets/fmr.html' }
  ],
  disclaimer: 'Estimate only. Your housing agency\'s calculation, utility allowance schedule and payment standards are final.'
};
