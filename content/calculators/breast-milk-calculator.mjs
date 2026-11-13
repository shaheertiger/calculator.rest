export default {
  slug: 'breast-milk-calculator',
  hub: 'health',
  name: 'Breast Milk Feeding Calculator',
  title: 'Breast Milk Calculator: A 10-lb Baby Needs About 25 oz a Day',
  h1: 'Breast Milk Feeding Calculator: Ounces per Bottle and per Day',
  meta: 'A 10-lb baby needs roughly 25 oz of expressed milk a day, about 3.1 oz per bottle over 8 feeds. Get per-bottle amounts, daycare bottles and CDC storage times.',
  keyword: 'how much expressed milk to feed baby calculator',
  also: ['breast milk calculator', 'how much breast milk per feeding calculator', 'breastfed baby ounces calculator', 'how many ounces should my baby eat calculator', 'daycare bottle calculator', 'pumped milk calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'units', label: 'Units', type: 'select', value: 'us', options: [['us', 'US (lb, oz)'], ['metric', 'Metric (kg, mL)']] },
    { id: 'lb', label: 'Baby\'s weight (lb)', type: 'number', value: 10, suffix: 'lb', showIf: { units: ['us'] } },
    { id: 'oz', label: '+ ounces', type: 'number', value: 0, suffix: 'oz', showIf: { units: ['us'] } },
    { id: 'kg', label: 'Baby\'s weight', type: 'number', value: 4.5, suffix: 'kg', showIf: { units: ['metric'] } },
    { id: 'age', label: 'Baby\'s age', type: 'select', value: 'm6', options: [['w1', 'First week'], ['m1', '1 to 4 weeks'], ['m6', '1 to 6 months'], ['m12', '6 to 12 months (eating solids)']] },
    { id: 'feeds', label: 'Feeds per 24 hours', type: 'number', value: 8 },
    { id: 'away', label: 'Hours away from baby (optional)', type: 'number', value: 9, suffix: 'h', help: 'For daycare or work: how many bottles to leave.' }
  ],
  compute(v, H) {
    var us = v.units !== 'metric';
    var lb = us ? (v.lb || 0) + (v.oz > 0 ? v.oz : 0) / 16 : v.kg / 0.45359237;
    if (!(lb >= 3 && lb <= 40)) return { error: 'Enter a baby weight between 3 and 40 lb (1.4–18 kg).' };
    var feeds = v.feeds >= 1 && v.feeds <= 20 ? Math.round(v.feeds) : 0;
    if (!feeds) return { error: 'Enter how many times your baby feeds in 24 hours (1–20).' };
    var raw = 2.5 * lb, daily = Math.min(raw, 32);
    var per = daily / feeds, capped = false;
    if (v.age === 'w1' && per > 2) { per = 2; daily = per * feeds; capped = true; }
    var ml = function (o) { return o * 29.5735; };
    var show = function (o) { return us ? H.fix(o, 1) + ' oz' : H.int(ml(o)) + ' mL'; };
    var rows = [
      ['Per day', show(daily) + (us ? ' (' + H.int(ml(daily)) + ' mL)' : ' (' + H.num(daily, 1) + ' oz)'), true],
      ['Feeding interval', 'about every ' + H.num(24 / feeds, 1) + ' hours'],
      ['Weight rule (2.5 oz per lb, max 32 oz)', show(Math.min(raw, 32))]
    ];
    if (v.away > 0) {
      var n = Math.max(1, Math.round(v.away * feeds / 24));
      rows.push(['Bottles to leave for ' + H.num(v.away, 1) + ' h', n + ' × ' + show(per) + ' = ' + show(n * per), true]);
    }
    var sub = capped ? 'In the first week a baby\'s stomach is small: AAP guidance is about 1–2 oz (30–60 mL) per feed, so the amount is capped at 2 oz.' : v.age === 'm12' ? 'Once solids are established, milk intake gradually falls; let your baby\'s hunger cues lead.' : raw > 32 ? 'Capped at 32 oz a day; most babies do not need more. Follow hunger and fullness cues.' : 'A starting estimate. Breastfed babies vary from feed to feed; offer the bottle slowly and stop when your baby shows fullness cues.';
    return {
      value: show(per),
      label: 'Expressed milk per feed (one bottle)',
      expr: 'min(2.5 × ' + H.num(lb, 2) + ' lb, 32) ÷ ' + feeds + ' feeds',
      rows: rows,
      sub: sub
    };
  },
  quick: ({ r }) => `A common starting estimate is 2.5 oz of milk per pound of body weight per day, up to about 32 oz. A <strong>10-lb</strong> baby needs about 2.5 × 10 = 25 oz a day, so with <strong>8 feeds</strong> each bottle holds about <strong>${r.value}</strong> (about 92 mL). For a 9-hour day at daycare, that is 3 bottles, or about 9.4 oz of expressed milk.`,
  stepsTitle: 'How to work out how much expressed milk to give',
  steps: [
    'Weigh your baby or use the weight from the last checkup, in pounds (kg × 2.2).',
    'Multiply by 2.5 to get ounces per day: 10 lb × 2.5 = 25 oz. Most babies top out around 32 oz a day, however big they are.',
    'Divide by the number of feeds in 24 hours. Breastfed babies usually feed 8 to 12 times a day (CDC): 25 oz ÷ 8 = 3.1 oz per bottle.',
    'For time apart, multiply the hours away by feeds per hour (9 h × 8 ÷ 24 = 3 bottles). <strong>Freeze and send milk in 2–4 oz portions</strong> so a half-finished bottle isn\'t wasted.',
    'Watch your baby, not the bottle: stop when they turn away, slow down or seem content, and offer more if they still show hunger cues.'
  ],
  formulaTitle: 'What formula estimates how much breast milk a baby needs?',
  formula: {
    expr: 'Milk per day (oz) = 2.5 × weight (lb), up to about 32 oz<br>Per feed = milk per day ÷ feeds per day<br>Metric: about 163 mL per kg per day, up to about 950 mL',
    vars: [['weight', 'baby\'s current weight'], ['feeds', 'number of feeds in 24 hours'], ['1 oz', '29.6 mL']],
    note: 'The 2.5 oz per pound figure comes from American Academy of Pediatrics guidance on infant formula, and it is widely used as a starting estimate for expressed breast milk too. Breastfed babies\' intake tends to level off after the first month, so for a bigger baby the 32 oz cap, or simply your baby\'s cues, matters more than weight.'
  },
  example: `<p>A 3-month-old weighs <strong>12 lb 8 oz</strong> (12.5 lb) and feeds about 7 times a day. Daily estimate: 2.5 × 12.5 = <strong>31.3 oz</strong>. Per bottle: 31.3 ÷ 7 = <strong>4.5 oz</strong> (about 132 mL).</p>
<p>She will be at daycare from 8 AM to 5:30 PM, 9.5 hours. Feeds during that time: 9.5 × 7 ÷ 24 = 2.8, so <strong>3 bottles of 4.5 oz</strong>, about 13.4 oz in total. Packing one extra 2-oz bottle covers a hungry day without wasting a full feed.</p>`,
  table: {
    title: 'How many ounces of breast milk per bottle by weight?',
    intro: 'Estimated ounces per feed for babies 1 to 6 months old, by weight and number of feeds a day, calculated with the 2.5 oz per pound rule (capped at 32 oz a day).',
    head: ['Baby\'s weight', 'Per day', '6 feeds', '8 feeds', '10 feeds', '12 feeds'],
    rows: ({ run }) => [6, 7, 8, 9, 10, 11, 12, 13, 14, 16].map(lb => {
      const d = Math.min(2.5 * lb, 32);
      return [lb + ' lb (' + (lb * 0.45359237).toFixed(1) + ' kg)', d.toFixed(1) + ' oz', ...[6, 8, 10, 12].map(f => run({ units: 'us', lb, oz: 0, age: 'm6', feeds: f, away: NaN }).value)];
    }),
    note: 'Babies who feed more often take less at each feed. These are averages for planning; daily intake varies and many breastfed babies take less from a bottle than the weight rule suggests.'
  },
  sections: [
    {
      h2: 'How much breast milk does a baby drink per feeding?',
      html: `<p>It depends on age and how often your baby eats. In the first days a newborn's stomach holds very little, and AAP guidance for bottle feeding is no more than about 1 to 2 oz (30–60 mL) per feed in the first week. Over the first month intake per feed rises, and by about one month many babies take 3 to 4 oz.</p>
<p>Breastfed babies tend to eat smaller, more frequent meals than formula-fed babies. In a study of exclusively breastfed babies aged 1 to 6 months (Kent et al., Pediatrics, 2006), infants fed 11 ± 3 times in 24 hours (range 6 to 18) and took an average of 76 g, roughly 2.6 oz, per breastfeeding. So a bottle of 2.5 to 4 oz is typical, and a much bigger bottle often means the flow is too fast rather than the baby needing more.</p>`
    },
    {
      h2: 'How many bottles should I send to daycare?',
      html: `<p>Count how many feeds fall in the time you are apart, including travel: hours away × feeds per day ÷ 24. A baby who eats 8 times a day and is away 10 hours needs about 3 to 4 bottles. Multiply by the amount per feed to know how much to pump or thaw.</p>
<p>The CDC suggests storing milk in 2 to 4 oz portions, or the amount offered at one feeding, and labeling each container with your child's name and the date. Smaller portions let the caregiver top up without wasting milk, since any milk left in a bottle must be used within 2 hours.</p>`
    },
    {
      h2: 'How long can breast milk be stored?',
      html: `<p>CDC storage guidelines for freshly expressed or pumped milk:</p>
<ul>
<li><strong>Room temperature (77°F / 25°C or colder):</strong> up to 4 hours.</li>
<li><strong>Refrigerator:</strong> up to 4 days.</li>
<li><strong>Freezer:</strong> about 6 months is best; up to 12 months is acceptable.</li>
<li><strong>Thawed in the refrigerator:</strong> use within 24 hours, counted from when it is fully thawed. Never refreeze thawed milk.</li>
<li><strong>Warmed or brought to room temperature:</strong> use within 2 hours.</li>
<li><strong>Leftovers from a feed:</strong> use within 2 hours, then throw away.</li>
</ul>
<p>Thaw the oldest milk first, in the refrigerator overnight or in lukewarm water, and never in a microwave, which creates hot spots.</p>`
    },
    {
      h2: 'How do I know my baby is getting enough milk?',
      html: `<p>Numbers are only a guide. Signs that intake is on track include steady weight gain at checkups, plenty of wet and dirty diapers, and a baby who seems content and drowsy after feeds. Early hunger cues include rooting, sucking on hands and smacking lips; crying is a late cue.</p>
<p>With a bottle, paced feeding helps a breastfed baby control the flow: hold the bottle more horizontally, pause every few sucks and let the baby decide when to stop. If you are worried about weight gain or supply, talk to your pediatrician or a lactation consultant.</p>`
    }
  ],
  faq: [
    { q: 'How many ounces of breast milk does a 1-month-old need?', a: 'Many 1-month-olds take about 3 to 4 oz per feed. By weight, a 9-lb baby needs about 22.5 oz a day, or 2.8 oz per feed over 8 feeds.' },
    { q: 'Does a breastfed baby need more milk as they grow?', a: 'Not much after the first month. Breastfed babies\' daily intake tends to level off between 1 and 6 months while milk composition changes, which is why the estimate is capped at about 32 oz a day.' },
    { q: 'How do I convert ounces to mL?', a: 'Multiply ounces by 29.6. A 3-oz bottle is about 89 mL and a 4-oz bottle about 118 mL. To go the other way, divide mL by 29.6.' },
    { q: 'Why does my baby drink more from a bottle than at the breast?', a: 'Bottles often flow faster, so babies can overfeed before their fullness signals catch up. A slow-flow nipple and paced bottle feeding help them take what they actually need.' },
    { q: 'Can I give leftover breast milk at the next feeding?', a: 'Only within 2 hours of when the baby started that bottle, according to the CDC. After 2 hours, discard what is left.' },
    { q: 'Does my breastfed baby need vitamin D?', a: 'Yes. The CDC advises vitamin D drops starting shortly after birth for babies fed only breast milk or less than 32 oz of formula a day. Ask your pediatrician about the dose.' },
    { q: 'How much expressed milk does a 6-month-old need?', a: 'Around 25 to 32 oz a day before solids are well established. As your baby eats more solid food, milk intake gradually drops, but breast milk remains the main source of nutrition through the first year.' }
  ],
  related: ['water-intake-calculator', 'due-date-calculator', 'pregnancy-weeks-calculator', 'ovulation-calculator'],
  sources: [
    { name: 'CDC: How Much and How Often to Breastfeed', url: 'https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/how-much-and-how-often.html' },
    { name: 'CDC: Breast Milk Storage and Preparation', url: 'https://www.cdc.gov/breastfeeding/breast-milk-preparation-and-storage/handling-breastmilk.html' },
    { name: 'AAP HealthyChildren.org: Amount and Schedule of Baby Formula Feedings', url: 'https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx' },
    { name: 'Kent et al. 2006, Pediatrics: Volume and frequency of breastfeedings (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/16510619/' }
  ],
  disclaimer: 'Planning estimates, not medical advice. Follow your baby\'s cues and your pediatrician\'s guidance, especially for premature babies or slow weight gain.'
};
