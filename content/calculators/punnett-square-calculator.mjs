export default {
  slug: 'punnett-square-calculator',
  hub: 'science',
  name: 'Punnett Square Calculator',
  title: 'Punnett Square Calculator: Aa × Aa = 1:2:1 Genotype Ratio',
  h1: 'Punnett Square Calculator for Genotype and Phenotype Ratios',
  meta: 'Aa × Aa gives 1 AA : 2 Aa : 1 aa, a 3:1 phenotype ratio; AaBb × AaBb gives 9:3:3:1. Enter two parents for a monohybrid or dihybrid Punnett square.',
  keyword: 'how to calculate genotypic ratio',
  also: ['punnett square calculator', 'how to calculate genotype and phenotype ratios', 'dihybrid cross calculator', 'how to calculate phenotypic ratio', 'monohybrid cross calculator', 'genotype ratio calculator'],
  updated: '2026-11-13',
  inputs: [
    { id: 'p1', label: 'Parent 1 genotype', type: 'text', value: 'Aa', placeholder: 'e.g. Aa or AaBb', help: 'One letter per allele: capital = dominant. Two letters for one gene, four for two genes.' },
    { id: 'p2', label: 'Parent 2 genotype', type: 'text', value: 'Aa', placeholder: 'e.g. Aa or aabb' },
    { id: 'dom', label: 'Dominance', type: 'select', value: 'complete', options: [['complete', 'Complete dominance (classic Mendel)'], ['incomplete', 'Incomplete dominance or codominance']] }
  ],
  compute(v, H) {
    var clean = function (s) { return String(s || '').replace(/[^A-Za-z]/g, ''); };
    var a = clean(v.p1), b = clean(v.p2);
    if (!a || !b) return { error: 'Enter a genotype for both parents, like Aa or AaBb.' };
    if (a.length !== b.length || (a.length !== 2 && a.length !== 4)) return { error: 'Use two letters per parent for one gene (Aa) or four for two genes (AaBb), the same number for both parents.' };
    var n = a.length / 2, genes = [];
    var pairOf = function (g, i) {
      var x = g.charAt(2 * i), y = g.charAt(2 * i + 1);
      if (x.toLowerCase() !== y.toLowerCase()) return null;
      return x === x.toUpperCase() ? x + y : y + x;
    };
    for (var i = 0; i < n; i++) {
      var pa = pairOf(a, i), pb = pairOf(b, i);
      if (!pa || !pb) return { error: 'Each gene needs two copies of the same letter, e.g. Aa or BB (not Ab).' };
      if (pa.toLowerCase().charAt(0) !== pb.toLowerCase().charAt(0)) return { error: 'Both parents must use the same gene letters in the same order.' };
      genes.push(pa.toLowerCase().charAt(0));
    }
    if (n === 2 && genes[0] === genes[1]) return { error: 'Use two different letters for the two genes, e.g. AaBb.' };
    var gametes = function (g) {
      if (n === 1) return [g.charAt(0), g.charAt(1)];
      var out = [];
      [g.charAt(0), g.charAt(1)].forEach(function (x) { [g.charAt(2), g.charAt(3)].forEach(function (y) { out.push(x + y); }); });
      return out;
    };
    var norm = function (x, y) { return x === x.toUpperCase() ? x + y : y + x; };
    var child = function (g1, g2) { var s = ''; for (var k = 0; k < n; k++) s += norm(g1.charAt(k), g2.charAt(k)); return s; };
    var rank = function (pair) { return pair.charAt(0) === pair.charAt(0).toUpperCase() ? (pair.charAt(1) === pair.charAt(1).toUpperCase() ? 0 : 1) : 2; };
    var A = gametes(a), B = gametes(b);
    var counts = {}, grid = [];
    A.forEach(function (x) {
      var row = [];
      B.forEach(function (y) { var c = child(x, y); counts[c] = (counts[c] || 0) + 1; row.push(c); });
      grid.push(row);
    });
    var total = A.length * B.length;
    var keys = Object.keys(counts).sort(function (p, q) {
      for (var k = 0; k < n; k++) { var d = rank(p.substr(2 * k, 2)) - rank(q.substr(2 * k, 2)); if (d) return d; }
      return 0;
    });
    var pheno = function (g) {
      var s = '', words = [];
      for (var k = 0; k < n; k++) {
        var pair = g.substr(2 * k, 2), r = rank(pair), U = genes[k].toUpperCase();
        if (v.dom === 'incomplete') { s += pair; words.push(r === 0 ? 'dominant' : r === 1 ? 'intermediate' : 'recessive'); }
        else { s += r < 2 ? U + '_' : genes[k] + genes[k]; words.push(r < 2 ? 'dominant' : 'recessive'); }
      }
      return s + ' (' + words.join(', ') + ')';
    };
    var pc = {}, porder = [];
    keys.forEach(function (k) { var p = pheno(k); if (!(p in pc)) { pc[p] = 0; porder.push(p); } pc[p] += counts[k]; });
    var gAll = 0; keys.forEach(function (k) { gAll = H.gcd(gAll, counts[k]); });
    var pAll = 0; porder.forEach(function (p) { pAll = H.gcd(pAll, pc[p]); });
    var gRatio = keys.length === 1 ? 'all ' + keys[0] : keys.map(function (k) { return counts[k] / gAll; }).join(' : ');
    var gNamed = keys.length === 1 ? 'all ' + keys[0] : keys.map(function (k) { return (counts[k] / gAll) + ' ' + k; }).join(' : ');
    var pRatio = porder.length === 1 ? 'all ' + porder[0].split(' (')[0] : porder.map(function (p) { return pc[p] / pAll; }).join(' : ');
    var pNamed = porder.length === 1 ? 'all ' + porder[0].split(' (')[0] : porder.map(function (p) { return (pc[p] / pAll) + ' ' + p.split(' (')[0]; }).join(' : ');
    var frac = function (c) { var d = H.gcd(c, total); return (c / d) + '/' + (total / d) + ' (' + H.num(c / total * 100, 2) + '%)'; };
    var rows = [
      ['Genotype ratio', gNamed, true],
      ['Phenotype ratio', pNamed, true],
      ['Parent 1 gametes', A.join(', ')],
      ['Parent 2 gametes', B.join(', ')]
    ];
    grid.forEach(function (row, r) { rows.push(['Punnett row ' + A[r] + ' ×', row.join(' · ')]); });
    return {
      value: gRatio,
      label: 'Genotype ratio (' + keys.join(' : ') + ')',
      expr: (n === 1 ? 'Monohybrid' : 'Dihybrid') + ' cross ' + a + ' × ' + b,
      rows: rows,
      sub: 'Phenotype ratio ' + pRatio + '. Each of the ' + total + ' boxes is an equally likely offspring, so these are probabilities for every child, not guarantees for a litter.',
      table: { head: ['Genotype', 'Boxes', 'Probability', 'Phenotype'], rows: keys.map(function (k) { return [k, counts[k] + ' of ' + total, frac(counts[k]), pheno(k)]; }), caption: 'Offspring genotypes and phenotypes' }
    };
  },
  quick: ({ r }) => `To calculate a genotypic ratio, fill in a Punnett square and count how many boxes hold each genotype, then reduce. Crossing two heterozygous parents (Aa × Aa) gives 1 AA, 2 Aa and 1 aa out of 4 boxes, a <strong>${r.value}</strong> genotype ratio. With complete dominance AA and Aa look the same, so the phenotype ratio is 3 : 1 (75% dominant, 25% recessive).`,
  stepsTitle: 'How to calculate genotype and phenotype ratios',
  steps: [
    'Write each parent\'s gametes. One gene: each parent gives one allele (Aa makes A and a). Two genes: take one allele from each gene, so AaBb makes AB, Ab, aB and ab.',
    'Draw the grid with one parent\'s gametes across the top and the other\'s down the side: 2 × 2 for one gene, 4 × 4 for two.',
    'Fill each box by combining the row and column alleles, writing the capital letter first (Aa, never aA).',
    'Count each genotype and divide by the number of boxes for its probability. Reduce the counts by their common factor for the ratio: 1 AA : 2 Aa : 1 aa.',
    'Group genotypes that look alike for the phenotype ratio. Under complete dominance, any box with a capital letter shows the dominant trait. Forgetting to merge AA with Aa is the most common error.'
  ],
  formulaTitle: 'What are the classic Mendelian ratios?',
  formula: {
    expr: 'Aa × Aa → 1 AA : 2 Aa : 1 aa → 3 : 1<br>Aa × aa → 1 Aa : 1 aa → 1 : 1<br>AaBb × AaBb → 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb',
    vars: [['A, a', 'dominant and recessive alleles of one gene'], ['A_', 'shorthand for "AA or Aa", the dominant phenotype'], ['Probability', 'boxes with that genotype ÷ total boxes (4 or 16)']],
    note: 'Dihybrid ratios assume the two genes assort independently, which holds for genes on different chromosomes or far apart on the same one.'
  },
  example: `<p><strong>Pea plants.</strong> In Mendel's peas, round seeds (R) are dominant to wrinkled (r) and yellow (Y) to green (y). Two RrYy plants are crossed. What fraction of the offspring are round and green?</p>
<p>Each parent makes four gametes: RY, Ry, rY, ry. The 4 × 4 square has 16 boxes.</p>
<p>Round and green means R_yy: RRyy (1 box) + Rryy (2 boxes) = <strong>3 of 16</strong>, or 18.75%. The full phenotype ratio is 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green.</p>
<p>Shortcut with probability: P(round) × P(green) = ¾ × ¼ = <strong>3/16</strong>.</p>`,
  table: {
    title: 'What ratios do common crosses give?',
    intro: 'Each row is a Punnett square solved by the calculator, assuming complete dominance.',
    head: ['Cross', 'Genotype ratio', 'Phenotype ratio'],
    rows: ({ run }) => [['AA', 'aa'], ['AA', 'Aa'], ['Aa', 'Aa'], ['Aa', 'aa'], ['aa', 'aa'], ['AABB', 'aabb'], ['AaBb', 'AaBb'], ['AaBb', 'aabb'], ['AaBb', 'AABB'], ['AABb', 'aaBb'], ['AaBB', 'Aabb'], ['Aabb', 'aaBb']].map(x => { const r = run({ p1: x[0], p2: x[1], dom: 'complete' }); return [x[0] + ' × ' + x[1], r.rows[0][1], r.rows[1][1]]; }),
    note: 'A_ means at least one dominant allele. Swap to incomplete dominance in the calculator and the phenotype ratio becomes identical to the genotype ratio.'
  },
  sections: [
    {
      h2: 'Why does a dihybrid cross give 9:3:3:1?',
      html: `<p>Because the two genes behave like two separate coin flips. Each monohybrid part gives ¾ dominant and ¼ recessive, and independent probabilities multiply:</p>
<ul><li>Both dominant: ¾ × ¾ = 9/16</li><li>First dominant, second recessive: ¾ × ¼ = 3/16</li><li>First recessive, second dominant: ¼ × ¾ = 3/16</li><li>Both recessive: ¼ × ¼ = 1/16</li></ul>
<p>The genotype ratio is the product of two 1 : 2 : 1 ratios, giving nine genotypes in a 1 : 2 : 1 : 2 : 4 : 2 : 1 : 2 : 1 pattern. AaBb, the double heterozygote, fills 4 of the 16 boxes.</p>`
    },
    {
      h2: 'How do you find ratios for three or more genes without a giant square?',
      html: `<p>Use the product rule gene by gene instead of drawing a 64-box trihybrid square. For AaBbCc × AaBbCc, the chance of an aabbcc offspring is ¼ × ¼ × ¼ = <strong>1/64</strong>, and the chance of showing all three dominant traits is (¾)³ = 27/64.</p>
<p>The sum rule handles "either/or": the probability of a heterozygote for one gene is P(A from mom, a from dad) + P(a from mom, A from dad) = ¼ + ¼ = ½.</p>`
    },
    {
      h2: 'How do incomplete dominance and codominance change the ratio?',
      html: `<p>When the heterozygote looks different from both parents, every genotype has its own phenotype, so the phenotype ratio equals the genotype ratio. Crossing two pink snapdragons (incomplete dominance, red × white gives pink) yields 1 red : 2 pink : 1 white, not 3 : 1. Codominance, such as roan cattle with both red and white hairs, gives the same 1 : 2 : 1 split. Choose "Incomplete dominance" above to see this.</p>
<p>ABO blood type involves three alleles, and sex-linked traits depend on X and Y chromosomes; those need a different setup from this two-allele calculator.</p>`
    },
    {
      h2: 'How do you check whether real offspring fit the expected ratio?',
      html: `<p>Real counts never match perfectly. Mendel counted 5,474 round and 1,850 wrinkled seeds, a ratio of 2.96 : 1, close to the expected 3 : 1. To decide whether a gap is just chance, run a chi-square goodness-of-fit test with the Punnett square's probabilities as the expected values (degrees of freedom = number of phenotype classes − 1). The <a href="/chi-square-calculator">chi-square calculator</a> does the arithmetic.</p>`
    }
  ],
  faq: [
    { q: 'What is the genotypic ratio of a monohybrid cross?', a: 'For two heterozygous parents (Aa × Aa) it is 1 AA : 2 Aa : 1 aa. Other monohybrid crosses differ: Aa × aa gives 1 Aa : 1 aa, and AA × aa gives all Aa.' },
    { q: 'What is the difference between genotype and phenotype ratio?', a: 'The genotype ratio counts allele combinations (AA, Aa, aa); the phenotype ratio counts visible traits. With complete dominance AA and Aa look alike, so 1 : 2 : 1 genotypes become a 3 : 1 phenotype ratio.' },
    { q: 'What is a test cross?', a: 'Crossing an organism showing the dominant trait with a homozygous recessive (aa) one. If any offspring show the recessive trait, the unknown parent was Aa; if all show the dominant trait over many offspring, it was most likely AA.' },
    { q: 'What percentage of offspring will be homozygous recessive in Aa × Aa?', a: '25%. One of the four boxes is aa, so each child has a 1 in 4 chance, regardless of how many siblings came before.' },
    { q: 'How do you write a genotype ratio?', a: 'List each genotype with its reduced count, dominant homozygote first: 1 AA : 2 Aa : 1 aa. You can also give probabilities (¼, ½, ¼) or percentages (25%, 50%, 25%).' },
    { q: 'What is the phenotypic ratio of AaBb × aabb?', a: '1 : 1 : 1 : 1. The double heterozygote makes four gamete types equally often and the aabb parent only makes ab, so AaBb, Aabb, aaBb and aabb each appear in a quarter of the offspring.' },
    { q: 'Can I use this for sex-linked traits?', a: 'Not directly. For an X-linked trait, write the mother\'s two X alleles and the father\'s single X allele plus Y, then fill a 2 × 2 square by hand; sons get their only X from their mother.' }
  ],
  related: ['chi-square-calculator', 'ratio-calculator', 'percentage-calculator', 'population-growth-calculator'],
  sources: [
    { name: 'OpenStax Biology 2e: 12.2 Characteristics and Traits', url: 'https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits' },
    { name: 'OpenStax Biology 2e: 12.3 Laws of Inheritance', url: 'https://openstax.org/books/biology-2e/pages/12-3-laws-of-inheritance' },
    { name: 'National Human Genome Research Institute: Punnett Square (glossary)', url: 'https://www.genome.gov/genetics-glossary/Punnett-Square' }
  ]
};
