export default {
  slug: 'anniversary-calculator',
  hub: 'time',
  name: 'Marriage Anniversary Calculator',
  title: 'Anniversary Calculator: How Long Married + Gift by Year (1–60)',
  h1: 'How Long Have You Been Married? Anniversary Calculator and Gift Guide',
  meta: 'See how long you have been married in years, months and days, and your next anniversary gift. Married June 17, 2017? Your 10th is Thursday, June 17, 2027: tin.',
  keyword: 'how long have you been married calculator',
  also: ['how many years have i been married calculator', 'how many years have i been married calculator free', 'how long have i been married calculator', 'anniversary calculator', 'wedding anniversary gifts by year', 'what anniversary is it'],
  updated: '2026-11-13',
  inputs: [
    { id: 'wed', label: 'Wedding date', type: 'date', value: '2017-06-17' },
    { id: 'today', label: 'Count up to', type: 'date', value: 'today' }
  ],
  data: {
    g: { 1: ['Paper', 'Clocks', 'Gold', 'Carnation'], 2: ['Cotton', 'China', 'Garnet', 'Cosmos'], 3: ['Leather', 'Glass', 'Pearl', 'Sunflower'], 4: ['Fruit or flowers', 'Appliances', 'Blue topaz', 'Geranium'], 5: ['Wood', 'Silverware', 'Sapphire', 'Daisy'], 6: ['Iron', 'Wood objects', 'Amethyst', 'Calla lily'], 7: ['Copper or wool', 'Desk sets', 'Onyx', 'Freesia'], 8: ['Bronze', 'Linen or lace', 'Tourmaline', 'Clematis'], 9: ['Willow or pottery', 'Leather', 'Lapis lazuli', 'Poppy'], 10: ['Aluminum or tin', 'Diamond jewelry', 'Diamond', 'Daffodil'], 15: ['Crystal', 'Watches', 'Ruby', 'Rose'], 20: ['China', 'Platinum', 'Emerald', 'Aster'], 25: ['Sterling silver', 'Sterling silver', 'Silver', 'Iris'], 30: ['Pearl', 'Diamond', 'Pearl', 'Lily'], 35: ['Coral', 'Jade', 'Emerald', 'Coral rose'], 40: ['Ruby', 'Ruby', 'Ruby', 'Gladioli'], 45: ['Sapphire', 'Sapphire', 'Sapphire', 'Blue iris'], 50: ['Gold', 'Gold', 'Gold', 'Yellow rose'], 55: ['Emerald', 'Emerald', 'Emerald', 'Calla lily'], 60: ['Diamond', 'Diamond', 'Diamond', 'Orchid'] }
  },
  compute(v, H, D) {
    var w = H.parseDate(v.wed), t = H.parseDate(v.today);
    if (!w) return { error: 'Enter your wedding date.' };
    if (!t) return { error: 'Enter the date to count up to.' };
    if (t < w) return { error: 'The count-up date is before the wedding date.' };
    var wm = w.getUTCMonth(), wd = w.getUTCDate(), wy = w.getUTCFullYear();
    function on(y) { var d = new Date(Date.UTC(y, wm, wd)); if (d.getUTCMonth() !== wm) d = new Date(Date.UTC(y, 2, 1)); return d; }
    var a = H.ymdDiff(w, t), days = H.daysBetween(w, t);
    var next = on(t.getUTCFullYear()); if (next < t || next.getUTCFullYear() === wy) next = on(t.getUTCFullYear() + 1);
    var n = next.getUTCFullYear() - wy;
    var until = H.daysBetween(t, next);
    var gift = D.g[n];
    var rows = [
      ['Married for', a.y + ' years, ' + a.m + ' months, ' + a.d + ' days', true],
      ['Total days', H.int(days)],
      ['Total weeks', H.int(Math.floor(days / 7)) + ' weeks, ' + (days % 7) + ' days'],
      ['Total months', H.int(a.y * 12 + a.m)],
      [until === 0 ? 'Anniversary today' : 'Next anniversary', H.ord(n) + ' on ' + H.fmtDate(next, true) + (until ? ' (in ' + H.plural(until, 'day') + ')' : '')]
    ];
    if (gift) {
      rows.push(['Classic gift for the ' + H.ord(n), gift[0], true]);
      rows.push(['Modern gift', gift[1]]);
      rows.push(['Stone or metal · flower', gift[2] + ' · ' + gift[3]]);
    } else {
      var k = n; while (!D.g[k] && k < 60) k++;
      rows.push(['Gift for the ' + H.ord(n), 'Not on the classic list; the next listed is the ' + H.ord(k) + ' (' + (D.g[k] ? D.g[k][0].toLowerCase() : 'diamond') + ')']);
    }
    var tenK = H.addDays(w, 10000);
    rows.push(['10,000 days married', H.fmtDate(tenK) + (tenK <= t ? ' (passed)' : '')]);
    rows.push(['Wedding day was a', H.weekday(w)]);
    return {
      value: a.y + (a.y === 1 ? ' year' : ' years'),
      label: 'Married ' + a.y + ' y, ' + a.m + ' m, ' + a.d + ' d as of ' + H.fmtDate(t),
      expr: H.fmtDate(w) + ' → ' + H.fmtDate(t),
      rows: rows,
      sub: until === 0 ? 'Happy ' + H.ord(n) + ' anniversary!' : 'You are in your ' + H.ord(a.y + 1) + ' year of marriage.'
    };
  },
  quick: ({ r, v, H }) => `A couple married on <strong>June 17, 2017</strong> has been married <strong>${r.rows[0][1]}</strong> as of ${H.fmtDate(v.today)}, or ${r.rows[1][1]} days. Their next anniversary is the ${r.rows[4][1]}. The classic 10th-anniversary gift is tin or aluminum; the modern gift is diamond jewelry.`,
  stepsTitle: 'How to work out how long you have been married',
  steps: [
    'Subtract the wedding year from this year. If this year\'s anniversary hasn\'t come yet, subtract 1 more: that is the number of completed years.',
    'Count whole months since the last anniversary, then the days since the last monthly date (borrowing the previous month\'s length if needed).',
    'For the total in days, count every day since the wedding, including February 29 in leap years. The calculator does this exactly.',
    'Your next anniversary number is the completed years + 1. A couple married 9 years and 4 months is heading for their 10th, which is easy to mix up with being "in the 10th year."'
  ],
  formulaTitle: 'How is the length of a marriage calculated?',
  formula: {
    expr: 'Years married = current year − wedding year − (1 if the anniversary hasn\'t passed)<br>Days married = today − wedding date',
    vars: [['Next anniversary number', 'years married + 1'], ['Year of marriage you are in', 'years married + 1 as well (the 1st year runs from the wedding to the 1st anniversary)']]
  },
  example: `<p>Married Saturday, June 17, 2017. On November 13, 2026:</p>
<p>2026 − 2017 = 9, and June 17 has passed, so <strong>9 full years</strong>. June 17 to October 17 is 4 more months, and October 17 to November 13 is 27 days: <strong>9 years, 4 months, 27 days</strong>, or 3,436 days.</p>
<p>The next anniversary is the <strong>10th</strong>, on Thursday, June 17, 2027. Classic gift: aluminum or tin. Modern: diamond jewelry. The couple's 10,000th day of marriage is Wednesday, November 2, 2044.</p>`,
  table: {
    title: 'What is the anniversary gift for each year?',
    intro: 'The Emily Post Institute\'s classic, modern, stone and flower list, with the date of each anniversary for a June 17, 2017 wedding (computed from the wedding date).',
    head: ['Anniversary', 'Classic', 'Modern', 'Stone / metal', 'Flower', 'Date (2017 wedding)'],
    rows: ({ D, H, v }) => Object.keys(D.g).map(Number).sort((a, b) => a - b).map(n => { const d = H.addMonths(H.parseDate(v.wed), 12 * n); return [H.ord(n), ...D.g[n], H.fmtDate(d)]; }),
    note: 'Years 11–14 and in-between years are not on this list; other published lists fill them in differently (for example steel for 11 and silk for 12), so there is no single standard.'
  },
  sections: [
    {
      h2: 'Where do the traditional anniversary gifts come from?',
      html: `<p>Emily Post's 1922 book <em>Etiquette</em> marked only a few anniversaries: paper for the 1st, wood for the 5th, tin for the 10th, crystal for the 15th, china for the 20th, silver for the 25th and gold for the 50th. In 1937 the American National Retail Jeweler Association filled in most of the rest of the list Americans use today, and the "modern" list (clocks, china, glass, appliances…) followed later.</p>
<p>The materials get more durable and valuable as the years go on, from paper to diamond, which is the whole idea. Treat the list as inspiration: a paper gift can be concert tickets or a handwritten letter, and tin can be a framed print on metal.</p>`
    },
    {
      h2: 'What are the milestone anniversaries?',
      html: `<ul><li><strong>25th, silver:</strong> the first big celebration for most couples.</li><li><strong>30th, pearl</strong> and <strong>35th, coral or jade</strong>.</li><li><strong>40th, ruby</strong> and <strong>45th, sapphire</strong>.</li><li><strong>50th, golden:</strong> the one Emily Post called "a quite sacred event."</li><li><strong>60th, diamond.</strong> A few lists add a 75th (diamond or gold).</li></ul>
<p>Some couples also celebrate day counts: 1,000 days (about 2 years and 9 months) or 10,000 days (about 27 years and 4 months). The calculator gives the exact 10,000-day date.</p>`
    },
    {
      h2: 'Is the 1st anniversary the end of the first year?',
      html: `<p>Yes. Your first year of marriage runs from the wedding day to the day before your first anniversary, so on your 10th anniversary you have completed 10 years and start your 11th year. People often say "our 10th year" when they mean the year leading up to the 10th anniversary; both phrasings point to the same June date, just from different sides.</p>
<p>If you married on February 29, the calculator counts your anniversary on March 1 in common years, the day a full year is completed. Many leap-day couples celebrate on February 28 instead.</p>`
    }
  ],
  faq: [
    { q: 'How many years have I been married?', a: 'Subtract your wedding year from the current year, then subtract 1 if this year\'s anniversary hasn\'t happened yet. The calculator also gives months, days and the total days married.' },
    { q: 'How many days have we been married?', a: 'Count every day since the wedding. A couple married June 17, 2017 had been married 3,436 days on November 13, 2026.' },
    { q: 'What is the 10th anniversary gift?', a: 'Aluminum or tin on the classic list and diamond jewelry on the modern list. The stone is diamond and the flower is the daffodil.' },
    { q: 'What anniversary is gold?', a: 'The 50th. Silver is the 25th, ruby the 40th and diamond the 60th.' },
    { q: 'What is the 1st anniversary gift?', a: 'Paper on the classic list and clocks on the modern list. Letters, books, tickets and prints are popular paper gifts.' },
    { q: 'What anniversary is it if we married in 2016?', a: 'In 2026 it is your 10th anniversary, on the date you married. Before that date you are in your 10th year; after it, your 11th.' },
    { q: 'When is our 10,000th day married?', a: 'About 27 years and 4 months after the wedding. Enter your wedding date and the calculator shows the exact date.' }
  ],
  related: ['age-calculator', 'birthday-calculator', 'days-between-dates-calculator', 'day-of-week-calculator'],
  sources: [
    { name: 'Emily Post Institute: Classic Etiquette, Anniversary Gifts by Year', url: 'https://emilypost.com/advice/classic-etiquette-anniversary-gifts-by-year' }
  ]
};
