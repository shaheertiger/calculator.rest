// Static pages: about, methodology, privacy.
export default [
  {
    slug: 'about', name: 'About', h1: 'About calculator.rest',
    title: 'About calculator.rest: Free Calculators That Show Their Math',
    meta: 'Who builds calculator.rest, how the calculators are made, what we promise (free, private, no sign-up) and how to report a wrong number.',
    type: 'AboutPage',
    html: ({ calcs, hubs }) => `
<p><strong>calculator.rest is a free collection of ${calcs.length} calculators across ${hubs.length} categories.</strong> Each one answers a specific question people search for, like how much house they can afford, what GPA they have, or how many yards of gravel a driveway needs, and opens with the answer for a real example before you type anything.</p>
<h2>What we promise</h2>
<ul>
<li><strong>Free, with no account.</strong> Every calculator works without signing up, and there is no paid tier.</li>
<li><strong>Private.</strong> The math runs in your browser. What you type is not sent to us or anyone else. The only thing stored is your last 20 results, in your own browser, so dot can show them on the homepage.</li>
<li><strong>Formulas you can check.</strong> Every page shows its formula, a worked example and the sources it follows, such as the IRS, CDC, BLS, HUD or a standard textbook.</li>
<li><strong>Real dates.</strong> The "Updated" date on a page changes only when we change the calculator or its facts.</li>
</ul>
<h2>Who makes it</h2>
<p>calculator.rest is built and maintained independently. We are not a bank, lender, law firm, tax adviser or medical provider. Money calculators follow official IRS and agency figures; health calculators use peer-reviewed equations and cite the organisation behind them. They are planning and learning tools. For decisions about your money, health or legal situation, confirm the result with a qualified professional.</p>
<h2>Meet dot</h2>
<p>Dot is the pink circle in our logo. Dot does the math, keeps your recent answers, and stays out of the way.</p>
<h2>Found a wrong number?</h2>
<p>If a result doesn't match your official document, email <a href="mailto:hello@calculator.rest">hello@calculator.rest</a> with the page, the inputs and what you expected. We check every report against the cited source and fix confirmed errors, then update the page's date.</p>
<p>Read <a href="/methodology">how we build and check calculators</a> or our <a href="/privacy">privacy policy</a>.</p>`
  },
  {
    slug: 'methodology', name: 'Methodology', h1: 'How we build and check calculators',
    title: 'Methodology: How calculator.rest Builds and Checks Its Tools',
    meta: 'How calculator.rest picks calculators, which sources it uses (IRS, BLS, CDC, NIST), how formulas are tested and how dates and corrections work.',
    html: ({ calcs }) => `
<p><strong>Every calculator on this site is built the same way: one page per real question, the answer first, the formula shown, and a named source for every number that comes from law or research.</strong></p>
<h2>1. One calculator per question</h2>
<p>We build a page only when people actually search for that calculation, and we never publish two pages for the same question. If two searches share one formula, they share one page.</p>
<h2>2. Sources</h2>
<ul>
<li><strong>Taxes, retirement accounts and payroll:</strong> IRS revenue procedures, publications and notices for the tax year shown (2026 brackets, standard deductions, contribution limits, RMD tables), and the Social Security Administration for wage bases and benefit formulas.</li>
<li><strong>Inflation:</strong> U.S. Bureau of Labor Statistics CPI-U, U.S. city average, annual averages.</li>
<li><strong>Housing:</strong> Consumer Financial Protection Bureau, HUD and Fannie Mae guidelines.</li>
<li><strong>Health:</strong> CDC, NIH, ACOG, AHA and the original peer-reviewed equations (for example Mifflin-St Jeor 1990 for BMR, Hodgdon & Beckett for the U.S. Navy body fat method).</li>
<li><strong>Science and engineering:</strong> NIST constants and reference data, manufacturer data sheets for material densities, and published refrigerant pressure-temperature tables.</li>
</ul>
<h2>3. Testing</h2>
<p>Each formula follows the source cited on its page, and its worked example is calculated by the same code that runs the tool, so the numbers on the page and the answer you get always agree. The build process re-runs every calculator with its example inputs and refuses to publish a page whose calculation fails, whose answer line has no number, or whose title or description duplicates another page.</p>
<h2>4. Rounding</h2>
<p>We calculate at full precision and round only for display: money to the cent, percentages to two decimals, and physical quantities to a sensible number of significant figures. Material quantities (bags, boxes, sheets) are always rounded up.</p>
<h2>5. Dates and corrections</h2>
<p>The "Updated" date on each page is the date its calculator or facts last changed. We review tax and benefit figures every January and when the IRS or SSA publishes new numbers. Confirmed reader corrections are fixed and re-dated.</p>
<h2>6. What the calculators are not</h2>
<p>They are not financial, tax, legal or medical advice. Where a professional judgement matters, the page says so.</p>
<p class="trust">${calcs.length} calculators currently published.</p>`
  },
  {
    slug: 'privacy', name: 'Privacy', h1: 'Privacy policy',
    title: 'Privacy Policy | calculator.rest',
    meta: 'calculator.rest does its math in your browser. We do not collect what you type, require no account, and store only your recent results on your own device.',
    html: () => `
<p><strong>Short version: what you type into a calculator stays on your device.</strong></p>
<h2>Calculator inputs</h2>
<p>All calculations run in JavaScript in your browser. Your inputs and results are not transmitted to our servers. When you use a calculator, the current inputs are added to the page address so you can bookmark or share the result; that address is only sent anywhere if you choose to share it.</p>
<h2>Local history</h2>
<p>Your last 20 results are saved in your browser's local storage so they appear on the homepage. You can clear them at any time with the "clear history" button or by clearing your browser data.</p>
<h2>Hosting and analytics</h2>
<p>The site is hosted on Vercel, which processes standard request data (such as IP address and user agent) to deliver pages and protect against abuse. We may use privacy-friendly, cookie-free aggregate analytics to count page views. We do not sell data, run ad trackers or build user profiles.</p>
<h2>Fonts</h2>
<p>Pages load fonts from Google Fonts, which receives your IP address when the font files are requested.</p>
<h2>Contact</h2>
<p>Questions about privacy: <a href="mailto:hello@calculator.rest">hello@calculator.rest</a>.</p>
<p class="trust">Last updated Nov 13, 2026</p>`
  }
];
