// Static pages: about, methodology (indexable), privacy (noindex).
export default [
  {
    slug: 'about', name: 'About', h1: 'About calculator.rest', updated: '2026-11-26',
    title: 'About calculator.rest: Calculators That Show the Work',
    meta: 'calculator.rest solves school and everyday maths with your own numbers and shows every step. Who makes it, what it promises and how to report a wrong step.',
    type: 'AboutPage',
    html: ({ calcs, hubs }) => `
<p><strong>calculator.rest is ${calcs.length} free calculators for school and everyday maths, in ${hubs.length} groups.</strong> Each one solves your exact numbers and writes out the work the way a teacher would on the board: the formula, your numbers put into it, each piece of arithmetic, and the answer with its units and how it was rounded.</p>
<p>It exists because most online calculators give you a number and nothing else. That is fine for a tip, but not when you need to check homework, understand where a grade came from, or show your method on a test.</p>
<h2>What we promise</h2>
<ul>
<li><strong>Your numbers, every step.</strong> The steps change when you change the inputs. They are never a canned example.</li>
<li><strong>Works without JavaScript.</strong> Every page loads with its example already solved, steps included.</li>
<li><strong>Free, with no account.</strong> No sign-up, no paid tier, no email capture.</li>
<li><strong>Private.</strong> The maths runs in your browser. What you type is not sent to us. Your last 20 answers are kept in your own browser so the homepage can show them.</li>
<li><strong>Named formulas.</strong> Each page says which standard formula it uses and links to a textbook-level source where one helps.</li>
<li><strong>Real dates.</strong> A page's "Updated" date changes only when its calculator or text changes.</li>
</ul>
<h2>Who makes it</h2>
<p>calculator.rest is built and maintained independently. It is not run by a school, a publisher or a tutoring company, and the pages are not written or reviewed by certified teachers. The steps follow the standard formulas taught in school maths and science courses, and <a href="/methodology">the methodology page</a> explains exactly how they are produced and checked. If your teacher or textbook uses a different method or rounding rule, follow theirs.</p>
<h2>Meet dot</h2>
<p>Dot is the pink circle in the logo. Dot does the arithmetic, keeps your recent answers, and stays out of the way.</p>
<h2 id="report">Found a wrong step?</h2>
<p>Email <a href="mailto:hello@calculator.rest">hello@calculator.rest</a> with the page, the numbers you typed, and the step you think is wrong. We work the problem by hand against the formula named on the page, fix any confirmed error in the calculator itself (so the answer and every step change together), and update the page's date.</p>
<p>Read <a href="/methodology">how steps are produced and checked</a> or the <a href="/privacy">privacy policy</a>.</p>`
  },
  {
    slug: 'methodology', name: 'Methodology', h1: 'How the steps are produced and checked', updated: '2026-11-26',
    title: 'Methodology: How calculator.rest Shows and Checks Steps',
    meta: 'How calculator.rest writes out each step, which formulas and standards it follows, how it rounds, what the build checks before publishing, and how errors are fixed.',
    html: ({ calcs }) => `
<p><strong>Every calculator on this site follows the same rule: one page per tool, the answer first, and every step of the working shown with your numbers.</strong></p>
<h2>1. One calculation, one piece of code</h2>
<p>The answer and the steps under it are produced by the same function, in the same pass. The steps are not a separate template filled in afterwards, so they cannot disagree with the answer. The function runs in your browser as you type, and the build runs it once with the page's example, so the solved example and its steps are already in the page before any script loads.</p>
<h2>2. What a step list contains</h2>
<ol>
<li><strong>Formula</strong>: the standard formula, with letters.</li>
<li><strong>Substitution</strong>: your numbers in place of the letters.</li>
<li><strong>Arithmetic</strong>: each operation on its own line, in the order a student would do it (powers before multiplication, brackets first).</li>
<li><strong>Answer</strong>: the result with its units and the rounding rule used.</li>
</ol>
<h2>3. Formulas and sources</h2>
<p>Pages use the formulas found in standard school maths and science courses: percent as part ÷ whole × 100, the arithmetic mean, the laws of exponents, half-life decay V = V₀ × (½)<sup>t/h</sup>, compound interest A = P(1 + r/n)<sup>nt</sup>, slope (y₂ − y₁) ÷ (x₂ − x₁), pH = −log₁₀[H⁺], efficiency = useful output ÷ input × 100, and speed = distance ÷ time. Units and unit symbols follow the <a href="https://www.nist.gov/pml/special-publication-811" rel="nofollow noopener" target="_blank">NIST Guide for the Use of the International System of Units (SP 811)</a>. Where a page links a source, it is a page we read and that states the formula used; we do not cite sources for decoration.</p>
<h2>4. Rounding</h2>
<p>Everything is calculated at full precision and rounded once, at the end, unless the problem says otherwise. Each page states its rounding rule in the Key facts box and in the last step: money to the cent, percentages to two decimals, and word problems to whatever the question asks for (the car depreciation solver, for example, rounds to the nearest hundred dollars because that is how the textbook problem is worded). Rounding in the middle of a calculation is listed as a common mistake wherever it changes the answer.</p>
<h2>5. What the build refuses to publish</h2>
<p>The site is generated by a script that stops with an error, and publishes nothing, if any page:</p>
<ul>
<li>has a title without a worked number, or no one-sentence answer under the heading;</li>
<li>fails to show a solved example with numbered steps in the page itself, starting with the formula and ending with the answer;</li>
<li>is shorter than 600 or longer than 1,100 words;</li>
<li>shares more than 30% of its wording with another calculator page;</li>
<li>is the same tool as another page with different numbers (we never publish one page per numeric variant);</li>
<li>links to a calculator that does not exist.</li>
</ul>
<h2>6. How examples are checked</h2>
<p>Each written example and word problem on a page is worked through with the page's own calculator, and the numbers in the text are compared with its steps before the page is published. When a reader reports an error, we redo the problem by hand from the formula named on the page; a confirmed error is fixed in the calculator, which corrects the answer and every step at once, and the page's date is updated.</p>
<h2>7. What the calculators are not</h2>
<p>They are study and everyday tools, not financial, medical or legal advice. They do not replace your teacher's method: if a class rounds differently or uses a different convention, use the class's rule.</p>
<p class="trust">${calcs.length} calculators currently published.</p>`
  },
  {
    slug: 'privacy', name: 'Privacy', h1: 'Privacy policy', index: false,
    title: 'Privacy Policy | calculator.rest',
    meta: 'calculator.rest does its math in your browser. We do not collect what you type, require no account, and store only your recent results on your own device.',
    html: () => `
<p><strong>Short version: what you type into a calculator stays on your device.</strong></p>
<h2>Calculator inputs</h2>
<p>All calculations run in JavaScript in your browser. Your inputs and results are not transmitted to our servers. When you use a calculator, the current inputs are added to the page address so you can bookmark or share the result; that address is only sent anywhere if you choose to share it.</p>
<h2>Local history</h2>
<p>Your last 20 results are saved in your browser's local storage so they appear on the homepage. You can clear them at any time with the "clear history" button or by clearing your browser data.</p>
<h2>Hosting and analytics</h2>
<p>The site is hosted on Vercel, which processes standard request data (such as IP address and user agent) to deliver pages and protect against abuse. We use Vercel Web Analytics, which is cookie-free, to count page views in aggregate. We do not sell data, run ad trackers or build user profiles.</p>
<h2>Fonts</h2>
<p>Pages load fonts from Google Fonts, which receives your IP address when the font files are requested.</p>
<h2>Contact</h2>
<p>Questions about privacy: <a href="mailto:hello@calculator.rest">hello@calculator.rest</a>.</p>
<p class="trust">Last updated Nov 26, 2026</p>`
  }
];
