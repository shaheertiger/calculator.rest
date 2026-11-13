export default {
  slug: 'pool-chlorine-calculator',
  hub: 'construction',
  name: 'Pool Chlorine Calculator',
  title: 'Pool Chlorine Calculator: +2 ppm in 15,000 gal = 30.7 fl oz',
  h1: 'How Much Chlorine to Add: Liquid, Cal-Hypo, Dichlor or Trichlor',
  meta: 'Raising a 15,000-gallon pool from 1 to 3 ppm takes 30.7 fl oz of 12.5% liquid chlorine, 6.2 oz of 65% cal-hypo or 7.1 oz of dichlor. Dose any pool by ppm.',
  keyword: 'how much chlorine to add to pool calculator',
  also: ['how much liquid chlorine to add to pool calculator', 'how much chlorine to add to a pool calculator', 'how much chlorine to shock a pool calculator', 'how much shock to add to pool calculator', 'how many chlorine tablets for pool calculator', 'how much bleach to add to pool calculator', 'pool chlorine calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'gal', label: 'Pool volume', type: 'number', value: 15000, suffix: 'gal', help: 'Not sure? Use the pool volume calculator first.' },
    { id: 'current', label: 'Current free chlorine', type: 'number', value: 1, suffix: 'ppm' },
    { id: 'target', label: 'Target free chlorine', type: 'number', value: 3, suffix: 'ppm' },
    { id: 'product', label: 'Chlorine product', type: 'select', value: 'liq125', options: [['liq125', 'Liquid chlorine 12.5%'], ['liq10', 'Liquid chlorine 10%'], ['bleach825', 'Plain bleach 8.25%'], ['bleach6', 'Plain bleach 6%'], ['cal65', 'Cal-hypo shock 65%'], ['cal73', 'Cal-hypo shock 73%'], ['dichlor', 'Dichlor granules 56%'], ['trichlor', 'Trichlor tablets/granules 90%']] }
  ],
  data: {
    products: {
      liq125: { name: '12.5% liquid chlorine', pct: 12.5, liquid: true },
      liq10: { name: '10% liquid chlorine', pct: 10, liquid: true },
      bleach825: { name: '8.25% bleach', pct: 8.25, liquid: true },
      bleach6: { name: '6% bleach', pct: 6, liquid: true },
      cal65: { name: '65% cal-hypo', pct: 65, ch: 0.7 },
      cal73: { name: '73% cal-hypo', pct: 73, ch: 0.7 },
      dichlor: { name: '56% dichlor', pct: 56, cya: 0.9 },
      trichlor: { name: '90% trichlor', pct: 90, cya: 0.6 }
    }
  },
  compute(v, H, D) {
    if (!(v.gal > 0)) return { error: 'Enter the pool volume in gallons.' };
    if (!(v.current >= 0) || !(v.target >= 0)) return { error: 'Enter the current and target free chlorine in ppm.' };
    var P = D.products[v.product] || D.products.liq125;
    var d = v.target - v.current;
    if (d <= 0) return { value: 'None', label: 'No chlorine needed', expr: H.num(v.current, 2) + ' ppm ≥ ' + H.num(v.target, 2) + ' ppm', rows: [['Free chlorine to lose', H.num(-d, 2) + ' ppm']], sub: 'Chlorine is already at or above the target. Sunlight and swimmers will bring it down; retest before swimming if it is above 10 ppm.' };
    var avail = d * v.gal * 8.34 / 1e6;
    var rows = [], value, perUnit, unit;
    if (P.liquid) {
      var g = d * v.gal / (P.pct * 10000);
      value = g >= 1 ? H.fix(g, 2) + ' gal' : H.num(g * 128, 1) + ' fl oz';
      rows.push(['Fluid ounces', H.num(g * 128, 1) + ' fl oz']);
      rows.push(['Gallons', H.fix(g, 2) + ' gal']);
      rows.push(['Cups (8 fl oz)', H.num(g * 16, 1)]);
      perUnit = P.pct * 10000 / v.gal; unit = 'gallon';
    } else {
      var lb = avail / (P.pct / 100);
      value = lb >= 1 ? H.fix(lb, 2) + ' lb' : H.num(lb * 16, 1) + ' oz';
      rows.push(['Ounces by weight', H.num(lb * 16, 1) + ' oz']);
      rows.push(['Pounds', H.fix(lb, 2) + ' lb']);
      perUnit = (P.pct / 100) / (v.gal * 8.34 / 1e6); unit = 'pound';
    }
    rows.push(['Available chlorine added', H.fix(avail, 3) + ' lb']);
    rows.push(['1 ' + unit + ' raises this pool by', H.num(perUnit, 2) + ' ppm']);
    if (P.cya) rows.push(['Also adds stabilizer (CYA)', '+' + H.num(P.cya * d, 1) + ' ppm', true]);
    if (P.ch) rows.push(['Also adds calcium hardness', '+' + H.num(P.ch * d, 1) + ' ppm', true]);
    return {
      value: value,
      label: P.name + ' to raise free chlorine ' + H.num(d, 2) + ' ppm',
      expr: H.num(d, 2) + ' ppm × ' + H.int(v.gal) + ' gal × 8.34 ÷ 10⁶ ÷ ' + P.pct + '%',
      rows: rows,
      sub: v.target > 10 ? 'That is shock level; keep swimmers out until free chlorine drops back to the normal range.' : 'Add with the pump running, pour slowly in front of a return jet, and retest after 30 minutes of circulation.'
    };
  },
  quick: ({ r }) => `To raise free chlorine from 1 to 3 ppm in a 15,000-gallon pool, add <strong>${r.value}</strong> (0.24 gal) of 12.5% liquid chlorine. The math: 1 ppm in 10,000 gallons is 0.0834 lb of available chlorine, so 2 ppm in 15,000 gallons needs 0.25 lb. A gallon of 12.5% liquid carries about 1.04 lb; 65% cal-hypo would take 6.2 oz.`,
  stepsTitle: 'How to work out how much chlorine to add',
  steps: [
    'Test free chlorine (FC) with a reliable kit; a FAS-DPD drop test is more precise than strips. Note the CYA (stabilizer) level too.',
    'Pick a target. CDC guidance is at least 1 ppm in pools without stabilizer, at least 2 ppm if you use cyanuric acid or dichlor/trichlor, and at least 3 ppm in hot tubs. The more CYA in the water, the higher the FC you need.',
    'Subtract current from target to get the ppm to add, and enter your pool\'s real volume. Guessing the gallons is the most common dosing error.',
    'Choose the product and read its strength from the label. Liquid chlorine loses strength in storage, especially in heat, so an old jug may be weaker than it says.',
    'Add with the pump running, then retest after the water has circulated for at least 30 minutes.'
  ],
  formulaTitle: 'What is the chlorine dosing formula?',
  formula: {
    expr: 'Available chlorine (lb) = Δppm × gallons × 8.34 ÷ 1,000,000<br>Dry product (lb) = Available chlorine ÷ (strength % ÷ 100)<br>Liquid (gal) = Δppm × gallons ÷ (strength % × 10,000)',
    vars: [['Δppm', 'target free chlorine − current free chlorine'], ['8.34', 'pounds per gallon of water'], ['strength %', 'available chlorine on the label: 12.5, 10, 65, 73, 56, 90…']],
    note: 'One ppm in 10,000 gallons is 0.0834 lb of available chlorine. For liquid chlorine the percentage is treated as trade percent (grams of available chlorine per 100 mL), the convention pool chlorine is sold by, so one gallon of 10% raises 10,000 gallons by 10 ppm.'
  },
  example: `<p>A 15,000-gallon pool tests at 1 ppm free chlorine and the owner wants 3 ppm.</p>
<p>Available chlorine needed: 2 × 15,000 × 8.34 ÷ 1,000,000 = <strong>0.250 lb</strong>.</p>
<p>With 12.5% liquid chlorine: 2 × 15,000 ÷ (12.5 × 10,000) = <strong>0.24 gal</strong> = 30.7 fl oz. With 65% cal-hypo: 0.250 ÷ 0.65 = 0.385 lb = <strong>6.2 oz</strong>. With 56% dichlor: 0.447 lb = <strong>7.1 oz</strong>, which also adds 1.8 ppm of CYA.</p>
<p>To shock the same pool from 1 to 10 ppm takes 1.08 gallons of 12.5% liquid, or 1.73 lb of 65% cal-hypo.</p>`,
  table: {
    title: 'How much chlorine raises a pool by 1 ppm?',
    intro: 'Amount to raise free chlorine by 1 ppm, worked out by the calculator. Multiply by the ppm you need.',
    head: ['Pool size', '12.5% liquid', '10% liquid', '6% bleach', '65% cal-hypo', '56% dichlor', '90% trichlor'],
    rows: ({ run }) => [5000, 10000, 15000, 20000, 25000, 30000, 40000].map(g => [g.toLocaleString('en-US') + ' gal', ...['liq125', 'liq10', 'bleach6', 'cal65', 'dichlor', 'trichlor'].map(p => run({ gal: g, current: 0, target: 1, product: p }).rows[0][1])]),
    note: 'Liquids in fluid ounces, dry products in ounces by weight. Trichlor tablets dissolve over days, so treat that column as the total chlorine a feeder delivers, not a one-time dose.'
  },
  sections: [
    {
      h2: 'How much liquid chlorine do I add to my pool?',
      html: `<p>Each gallon of 12.5% liquid chlorine raises 10,000 gallons by about 12.5 ppm, and a gallon of 10% raises it by 10 ppm. So for daily top-ups in a typical 15,000- to 20,000-gallon pool you are usually adding a quart or two. Liquid chlorine adds no stabilizer and no calcium, which is why many owners use it as their everyday chlorine and keep stabilizer separate.</p>
<p>It does lose strength: a jug stored in a hot garage can drop noticeably within weeks. Buy it fresh, keep it cool and shaded, and trust your test results over the label.</p>`
    },
    {
      h2: 'How much shock do I need?',
      html: `<p>A typical shock label dose is <strong>1 lb of 65–73% cal-hypo per 10,000 gallons</strong>, which raises free chlorine by about 7.8 ppm (65%) to 8.8 ppm (73%). Whether that is enough depends on what you are fighting and how much stabilizer is in the water: algae and high CYA both call for a higher, sustained free chlorine level. Enter your current reading and the level you want, and the calculator gives the exact amount for your product.</p>
<p>Shock at dusk so sunlight doesn't burn off the chlorine, keep the pump running, and stay out of the water until free chlorine is back down to the range on your test kit or product label.</p>`
    },
    {
      h2: 'Which chlorine is best: liquid, cal-hypo, dichlor or trichlor?',
      html: `<ul><li><strong>Liquid chlorine (sodium hypochlorite, 10–12.5%):</strong> no byproducts except a little salt; heavy to carry and loses strength in storage.</li><li><strong>Cal-hypo (65–73%):</strong> a strong, cheap dry shock, but each 1 ppm of chlorine adds about 0.7 ppm of calcium hardness.</li><li><strong>Dichlor (56%):</strong> dissolves fast and is pH-neutral; each 1 ppm adds about 0.9 ppm of CYA.</li><li><strong>Trichlor (90%):</strong> slow-dissolving tablets for feeders and floaters; acidic, and each 1 ppm adds about 0.6 ppm of CYA.</li></ul>
<p>Stabilizer protects chlorine from sunlight, but it builds up and never evaporates, so pools fed only with dichlor or trichlor eventually need partial draining. The CDC advises against using cyanuric acid products in hot tubs.</p>`
    },
    {
      h2: 'Is it safe to mix pool chemicals?',
      html: `<p>No. Never mix chlorine products with each other or with acid, and never put cal-hypo in a feeder or bucket that has held trichlor: the combination can cause fire or an explosion. Add each chemical separately to the pool water, always add chemical to water (not water to chemical), and wear eye protection. Store chlorine away from acids, fertilizers and fuel.</p>`
    }
  ],
  faq: [
    { q: 'How much chlorine do I add to a 10,000-gallon pool?', a: 'To raise free chlorine 1 ppm in 10,000 gallons, add 10.2 fl oz of 12.5% liquid chlorine, 12.8 fl oz of 10% liquid or 2.1 oz of 65% cal-hypo. Multiply by the ppm you need.' },
    { q: 'How much chlorine to shock a 20,000-gallon pool?', a: 'Raising a 20,000-gallon pool by 10 ppm takes 1.6 gallons of 12.5% liquid chlorine or about 2.6 lb of 65% cal-hypo. The common label dose of 1 lb per 10,000 gallons (2 lb here) would raise it about 7.8 ppm.' },
    { q: 'What should free chlorine be in a pool?', a: 'The CDC recommends at least 1 ppm free chlorine in pools (at least 2 ppm if the water is stabilized with cyanuric acid) and at least 3 ppm in hot tubs, with pH between 7.0 and 7.8.' },
    { q: 'Can I use household bleach in my pool?', a: 'Yes, if it is plain, unscented bleach with no additives. It is the same sodium hypochlorite as pool liquid chlorine, just weaker: 6% bleach takes about twice as much as 12.5% pool chlorine for the same ppm.' },
    { q: 'How many chlorine tablets does my pool need?', a: 'Tablets are dosed by feeder setting, not by ppm on the day. As a rough guide, the calculator\'s trichlor result is the weight of tablet chlorine needed to supply that many ppm; adjust the feeder until daily tests hold your target, and watch CYA climb.' },
    { q: 'How long after adding chlorine can you swim?', a: 'After liquid chlorine at normal levels, wait until it has circulated for at least 30 minutes and retest. After shocking, wait until free chlorine falls back to the safe swimming range on the product label, which can take a day or more.' },
    { q: 'Why does my chlorine disappear overnight?', a: 'A big overnight loss with no sun usually means something is consuming it: algae, organic debris or ammonia. Test before and after sunset; losing more than about 0.5 ppm overnight is the usual sign that something is eating chlorine and the pool needs shocking.' }
  ],
  related: ['pool-volume-calculator', 'tank-volume-calculator', 'pipe-volume-calculator', 'cubic-feet-calculator'],
  sources: [
    { name: 'CDC: Home pool and hot tub water treatment and testing', url: 'https://www.cdc.gov/healthy-swimming/about/home-pool-and-hot-tub-water-treatment-and-testing.html' },
    { name: 'CDC: Operating and managing public pools, hot tubs and splash pads', url: 'https://www.cdc.gov/healthy-swimming/toolkit/operating-public-pools-hot-tubs-and-splash-pads.html' },
    { name: 'Pool & Hot Tub Alliance (PHTA)', url: 'https://www.phta.org/' }
  ],
  disclaimer: 'Follow the product label and safety data sheet. Never mix chlorine products.'
};
