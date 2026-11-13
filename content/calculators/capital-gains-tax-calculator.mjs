export default {
  slug: 'capital-gains-tax-calculator',
  hub: 'pay',
  name: 'Capital Gains Tax Calculator',
  title: 'Capital Gains Tax Calculator 2026: $20,000 Gain = $3,000 Tax',
  h1: 'Capital Gains Tax Calculator: Long-Term and Short-Term Tax on a Sale',
  meta: 'Stock bought for $30,000 and sold for $50,000 is a $20,000 long-term gain. A single filer with $85,000 of other income owes $3,000 (15%) for 2026.',
  keyword: 'how to calculate the capital gains tax',
  also: ['how is capital gains calculated', 'how to calculate long term capital gains', 'how to calculate real estate capital gains', 'how to calculate capital gains on gifted property', 'how is capital gains calculated on a home sale', 'capital gains tax calculator 2026'],
  updated: '2026-11-13',
  inputs: [
    { id: 'buy', label: 'Cost basis (what you paid + fees)', type: 'number', value: 30000, prefix: '$' },
    { id: 'sell', label: 'Sale proceeds (after fees)', type: 'number', value: 50000, prefix: '$' },
    { id: 'term', label: 'How long you owned it', type: 'select', value: 'long', options: [['long', 'More than 1 year (long-term)'], ['short', '1 year or less (short-term)']] },
    { id: 'status', label: 'Filing status', type: 'select', value: 'single', options: [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household']] },
    { id: 'income', label: 'Other income for 2026 (before deductions)', type: 'number', value: 85000, prefix: '$', help: 'Wages, business income, interest. The standard deduction is applied for you.' }
  ],
  data: {
    rates: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
    tops: { single: [12400, 50400, 105700, 201775, 256225, 640600], mfj: [24800, 100800, 211400, 403550, 512450, 768700], hoh: [17700, 67450, 105700, 201750, 256200, 640600] },
    std: { single: 16100, mfj: 32200, hoh: 24150 },
    lt: { single: [49450, 545500], mfj: [98900, 613700], hoh: [66200, 579600] },
    niit: { single: 200000, mfj: 250000, hoh: 200000 }
  },
  compute(v, H, D) {
    if (!(v.buy >= 0) || !(v.sell >= 0)) return { error: 'Enter the cost basis and the sale amount.' };
    var inc = v.income >= 0 ? v.income : 0;
    var st = D.tops[v.status] ? v.status : 'single';
    function tax(ti) {
      var t = 0, lo = 0, tops = D.tops[st];
      for (var i = 0; i < D.rates.length; i++) {
        var hi = i < tops.length ? tops[i] : Infinity;
        if (ti > lo) t += (Math.min(ti, hi) - lo) * D.rates[i];
        lo = hi;
      }
      return t;
    }
    var gain = v.sell - v.buy;
    var ord = Math.max(0, inc - D.std[st]);
    if (gain <= 0) {
      var loss = -gain, used = Math.min(loss, 3000);
      var save = tax(ord) - tax(Math.max(0, ord - used));
      return {
        value: H.money(0), label: 'Capital gains tax', expr: H.money0(v.sell) + ' − ' + H.money0(v.buy) + ' = ' + H.money0(gain),
        rows: [['Capital loss', H.money(loss)], ['Deductible against other income this year', H.money(used)], ['Tax saved by the deduction', H.money(save), true], ['Loss carried forward', H.money(loss - used)]],
        sub: 'A net capital loss offsets gains first, then up to $3,000 of other income a year; the rest carries forward.'
      };
    }
    var gT = Math.max(0, inc + gain - D.std[st]) - ord;
    function ltTax() {
      var b = D.lt[st], top = ord + gT;
      var at0 = Math.max(0, Math.min(top, b[0]) - ord);
      var at15 = Math.max(0, Math.min(top, b[1]) - Math.max(ord, b[0]));
      var at20 = gT - at0 - at15;
      return { t: at15 * 0.15 + at20 * 0.20, at0: at0, at15: at15, at20: at20 };
    }
    var lt = ltTax();
    var stTax = tax(ord + gT) - tax(ord);
    var magi = inc + gain;
    var niit = 0.038 * Math.min(gain, Math.max(0, magi - D.niit[st]));
    var isLong = v.term !== 'short';
    var base = isLong ? lt.t : stTax;
    var total = base + niit;
    var rows = [['Capital gain', H.money(gain)]];
    if (isLong) {
      if (lt.at0 > 0) rows.push(['Taxed at 0%', H.money(lt.at0)]);
      if (lt.at15 > 0) rows.push(['Taxed at 15%', H.money(lt.at15)]);
      if (lt.at20 > 0) rows.push(['Taxed at 20%', H.money(lt.at20)]);
    } else rows.push(['Taxed as ordinary income', H.money(gT)]);
    if (gain - gT > 0.005) rows.push(['Covered by unused standard deduction', H.money(gain - gT)]);
    if (niit > 0) rows.push(['Net investment income tax (3.8%)', H.money(niit)]);
    rows.push(['Effective rate on the gain', H.pct(total / gain * 100, 1), true]);
    rows.push([isLong ? 'If you had sold within a year' : 'If you had held over a year', H.money((isLong ? stTax : lt.t) + niit)]);
    rows.push(['Kept after tax', H.money(gain - total)]);
    var diff = stTax - lt.t;
    return {
      value: H.money(total),
      label: (isLong ? 'Long-term' : 'Short-term') + ' capital gains tax',
      expr: H.money0(v.sell) + ' − ' + H.money0(v.buy) + ' = ' + H.money0(gain) + ' gain',
      rows: rows,
      sub: isLong ? (diff > 0.005 ? 'Holding over a year saves ' + H.money(diff) + ' compared with ordinary income rates.' : 'At your income, long-term and short-term rates come out the same.') : 'Held one more day past a year, this gain would cost ' + H.money(diff) + ' less.'
    };
  },
  quick: ({ r }) => `Capital gains tax is figured on the profit: sale price minus cost basis. Selling stock bought for $30,000 at $50,000 gives a <strong>$20,000</strong> gain. Held over a year, a single filer with $85,000 of other income pays the 15% long-term rate in 2026: <strong>${r.value}</strong>. Sold within a year, the same gain is taxed as ordinary income at 22%: $4,400.`,
  stepsTitle: 'How to calculate capital gains tax',
  steps: [
    'Find your cost basis: purchase price plus commissions and fees. For a home, add closing costs and the cost of improvements. Leaving out improvements is the mistake that overstates tax the most.',
    'Subtract basis from the sale proceeds (after selling costs) to get the gain or loss.',
    'Check the holding period. Owned more than one year: long-term rates of 0%, 15% or 20%. One year or less: taxed at your ordinary bracket.',
    'Stack the gain on top of your other taxable income. Only the part of the gain that falls in each band is taxed at that rate.',
    'Add the 3.8% net investment income tax if your modified AGI is above $200,000 single or $250,000 married filing jointly.'
  ],
  formulaTitle: 'What is the capital gains tax formula?',
  formula: {
    expr: 'Gain = Sale proceeds − Cost basis<br>Long-term tax = 0% × (gain below $49,450) + 15% × (gain up to $545,500) + 20% × (gain above)<br>NIIT = 3.8% × min(Gain, MAGI − $200,000)',
    vars: [['Cost basis', 'purchase price + fees + improvements'], ['Thresholds', '2026 single figures, measured on total taxable income including the gain'], ['MAGI', 'modified adjusted gross income; NIIT starts at $200,000 single or $250,000 joint']],
    note: 'Married filing jointly: 0% up to $98,900 and 15% up to $613,700 of taxable income. Head of household: $66,200 and $579,600.'
  },
  example: `<p>A married couple sells shares they bought in 2019 for $40,000, receiving $120,000 after fees: an $80,000 long-term gain. Their wages are $110,000.</p>
<p>Ordinary taxable income: $110,000 − $32,200 = $77,800. The 0% band runs to $98,900, so the first <strong>$21,100</strong> of gain is tax-free. The remaining <strong>$58,900</strong> is taxed at 15% = <strong>$8,835</strong>.</p>
<p>MAGI is $190,000, under the $250,000 NIIT line, so the total is $8,835, an 11.0% effective rate on the gain. Had they sold within a year, the gain would have been taxed at 12% and 22%: $15,300.</p>`,
  table: {
    title: 'How much tax is due on a $10,000 long-term gain?',
    intro: 'Federal tax on a $10,000 long-term capital gain in 2026 by other income (before the standard deduction), from the calculator above.',
    head: ['Other income', 'Single', 'Married filing jointly', 'Head of household', 'Single, if short-term'],
    rows: ({ run, H }) => [20000, 40000, 60000, 80000, 100000, 130000, 200000, 300000, 600000].map(x => {
      const g = (s, t) => run({ buy: 0, sell: 10000, term: t, status: s, income: x }).value;
      return [H.money0(x), g('single', 'long'), g('mfj', 'long'), g('hoh', 'long'), g('single', 'short')];
    }),
    note: 'Includes the 3.8% net investment income tax where it applies. State income tax is extra; most states tax capital gains as ordinary income.'
  },
  sections: [
    {
      h2: 'What are the 2026 long-term capital gains tax brackets?',
      html: `<p>Long-term rates depend on total taxable income, including the gain itself.</p>
<div class="twrap"><table><thead><tr><th>Rate</th><th>Single</th><th>Married filing jointly</th><th>Head of household</th></tr></thead><tbody>
<tr><td>0%</td><td>up to $49,450</td><td>up to $98,900</td><td>up to $66,200</td></tr>
<tr><td>15%</td><td>$49,450 – $545,500</td><td>$98,900 – $613,700</td><td>$66,200 – $579,600</td></tr>
<tr><td>20%</td><td>over $545,500</td><td>over $613,700</td><td>over $579,600</td></tr>
</tbody></table></div>
<p>Two exceptions: gains on collectibles such as coins, art and gold are taxed at up to 28%, and the part of a real estate gain that comes from depreciation you claimed (unrecaptured section 1250 gain) at up to 25%. Qualified dividends use the same 0/15/20% bands.</p>`
    },
    {
      h2: 'How is capital gains tax calculated on a home sale?',
      html: `<p>Subtract your basis and selling costs from the sale price, then subtract the home sale exclusion: up to <strong>$250,000</strong> of gain is tax-free for a single owner and <strong>$500,000</strong> for a married couple filing jointly, if you owned and lived in the home for at least 2 of the 5 years before the sale.</p>
<p>Example: bought for $300,000, $50,000 of improvements (a new roof and kitchen), sold for $700,000 with $40,000 of commissions and closing costs. Gain = $700,000 − $40,000 − $350,000 = $310,000. A married couple owes nothing; a single owner has $60,000 of taxable long-term gain. Enter that $60,000 as the gain (basis $0, sale $60,000) to see the tax. See the <a href="/home-sale-proceeds-calculator">home sale proceeds calculator</a> for net cash after the sale.</p>
<p>Rental and investment property gets no exclusion, and past depreciation is recaptured at up to 25%.</p>`
    },
    {
      h2: 'How do capital losses offset capital gains?',
      html: `<p>Losses are netted against gains of the same type first (short against short, long against long), then against the other type. If you still have a net loss, up to <strong>$3,000</strong> a year ($1,500 if married filing separately) comes off your ordinary income, and any remainder carries forward to future years with no time limit.</p>
<p>Selling losing positions before December 31 to offset gains is called tax-loss harvesting. Buying the same or a substantially identical security within 30 days before or after the sale triggers the wash sale rule, which postpones the loss.</p>`
    },
    {
      h2: 'How do you calculate capital gains on gifted or inherited property?',
      html: `<p><strong>Gifts:</strong> you generally take over the giver's basis (carryover basis). If your parent bought stock for $10,000 and gave it to you when it was worth $40,000, selling it for $45,000 is a $35,000 gain, and you include their holding period too. If the value at the gift date was below their basis and you sell at a loss, special rules use the lower value.</p>
<p><strong>Inheritance:</strong> basis "steps up" to the fair market value on the date of death, and the gain is always long-term. Inherited stock worth $40,000 at death and sold for $45,000 is only a $5,000 gain.</p>`
    }
  ],
  faq: [
    { q: 'How long do I have to hold an investment for long-term capital gains?', a: 'More than one year. Your holding period starts the day after you buy, so stock bought on March 10, 2026 qualifies if sold on March 11, 2027 or later.' },
    { q: 'Who pays 0% capital gains tax?', a: 'Anyone whose taxable income, including the gain, is at or below $49,450 single, $98,900 married filing jointly or $66,200 head of household in 2026, for the part of the gain under that line.' },
    { q: 'Is capital gains tax added to my income?', a: 'The gain is part of your income, but long-term gains are taxed at their own 0/15/20% rates. They can push other items, like the NIIT threshold or Social Security taxation, but they do not change the rate on your wages.' },
    { q: 'How is crypto taxed?', a: 'The IRS treats cryptocurrency as property, so selling, trading or spending it is a taxable sale. Gains are long-term or short-term exactly like stock.' },
    { q: 'Can I avoid capital gains tax by reinvesting?', a: 'Not for stocks or funds: selling triggers the tax even if you reinvest the proceeds. Real estate investors can defer it with a like-kind (1031) exchange, and retirement accounts let you trade without current tax.' },
    { q: 'Do I pay state tax on capital gains?', a: 'In most states, yes, at ordinary state income tax rates. States without a broad income tax, such as Texas and Florida, do not tax them, while Washington taxes only large long-term gains.' },
    { q: 'What is the net investment income tax?', a: 'A 3.8% tax on investment income, including capital gains, for people with modified AGI above $200,000 (single) or $250,000 (married filing jointly). It applies to the smaller of your investment income or the amount over the threshold.' }
  ],
  related: ['income-tax-calculator', 'home-sale-proceeds-calculator', 'roi-calculator', 'take-home-pay-calculator'],
  sources: [
    { name: 'IRS: Topic 409, Capital gains and losses', url: 'https://www.irs.gov/taxtopics/tc409' },
    { name: 'IRS: Topic 559, Net investment income tax', url: 'https://www.irs.gov/taxtopics/tc559' },
    { name: 'IRS: Topic 701, Sale of your home', url: 'https://www.irs.gov/taxtopics/tc701' },
    { name: 'IRS: Publication 551, Basis of Assets', url: 'https://www.irs.gov/publications/p551' },
    { name: 'IRS: Publication 550, Investment Income and Expenses', url: 'https://www.irs.gov/publications/p550' }
  ],
  disclaimer: 'Federal estimate for tax year 2026 using the standard deduction. Not tax advice.'
};
