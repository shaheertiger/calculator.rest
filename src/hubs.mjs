// Hub (category) pages. Order = order on the homepage.
export default [
  {
    id: 'mortgage', slug: 'mortgage-calculators', name: 'Mortgage & Real Estate', short: 'Mortgage',
    title: 'Mortgage Calculators: {n} Free Home & Rent Tools',
    meta: 'Free mortgage and real estate calculators: house affordability, monthly payment, payoff, refinance break-even, rent, property tax and DTI. No sign-up.',
    intro: 'Every calculator here runs the same math a lender or landlord uses: monthly payment from the amortization formula, affordability from the 28/36 debt-to-income rule, and break-even in months. Each tool shows its formula, a worked example and the official source it follows.',
    faq: [
      ['What is the 28/36 rule?', 'The 28/36 rule says housing costs should stay under 28% of gross monthly income and all debt payments under 36%. Lenders use it as a starting point; many conventional loans allow a back-end ratio up to 45%, and FHA loans can go higher with compensating factors.'],
      ['How is a mortgage payment calculated?', 'A fixed-rate payment is M = P × r(1+r)^n ÷ ((1+r)^n − 1), where P is the loan amount, r the monthly rate (APR ÷ 12) and n the number of months. Property tax, insurance and HOA dues are added on top to get the full monthly housing cost (PITI).'],
      ['Are these calculators accurate for my lender?', 'They use the standard formulas, so the principal-and-interest figure matches a lender quote to the cent for the same inputs. Lender quotes can differ on taxes, insurance, PMI and fees, so treat the result as a planning number and confirm the Loan Estimate.']
    ]
  },
  {
    id: 'loans', slug: 'loan-calculators', name: 'Loans & Credit', short: 'Loans',
    title: 'Loan Calculators: {n} Free Payment, APR & Payoff Tools',
    meta: 'Free loan calculators for car loans, personal loans, credit cards, leases, APR and amortization schedules. See the payment, total interest and payoff date.',
    intro: 'Loan math comes down to four numbers: amount, rate, term and payment. Know any three and these tools solve the fourth, then show total interest, the payoff date and a schedule. Credit card tools use the average daily balance method that issuers disclose in your cardholder agreement.',
    faq: [
      ['What is the difference between APR and interest rate?', 'The interest rate is the cost of borrowing the principal. APR adds most lender fees and spreads them over the loan term, so APR is always equal to or higher than the note rate. Compare loans by APR.'],
      ['How do I calculate monthly interest on a loan?', 'Divide the annual rate by 12 and multiply by the current balance. A $20,000 balance at 7.2% accrues $20,000 × 0.072 ÷ 12 = $120 of interest that month.'],
      ['Does paying extra on a loan save money?', 'Yes. Any amount above the scheduled payment goes to principal, which cuts every future interest charge. On a 5-year car loan an extra $50 a month typically saves a few hundred dollars and several months.']
    ]
  },
  {
    id: 'investing', slug: 'investing-calculators', name: 'Savings, Investing & Retirement', short: 'Investing',
    title: 'Investing & Retirement Calculators: {n} Free Tools',
    meta: 'Free savings, investing and retirement calculators: compound interest, CDs, inflation, RMDs, FIRE, IRR, NPV and how long your money will last.',
    intro: 'Growth, inflation and withdrawals are all compounding problems. These calculators show the year-by-year numbers behind each answer, use IRS tables where the law sets the number (RMDs, contribution limits) and BLS CPI data for inflation.',
    faq: [
      ['What is the 4% rule?', 'The 4% rule says you can withdraw 4% of your portfolio in the first year of retirement and adjust for inflation afterwards with a high historical chance of the money lasting 30 years. Your FIRE number is therefore about 25 times annual spending.'],
      ['How is compound interest calculated?', 'Compound interest uses A = P(1 + r/n)^(nt): the balance grows by the periodic rate each period, and interest earns interest. Monthly compounding on 5% APR gives an effective annual yield of 5.12%.'],
      ['Which inflation numbers do you use?', 'Inflation tools use the U.S. Bureau of Labor Statistics CPI-U annual averages (1982–84 = 100), the same series used for official inflation figures and Social Security cost-of-living adjustments.']
    ]
  },
  {
    id: 'pay', slug: 'pay-tax-calculators', name: 'Pay, Salary & Tax', short: 'Pay & tax',
    title: 'Pay & Tax Calculators: {n} Free Salary and 2026 Tax Tools',
    meta: 'Free pay and tax calculators: salary to hourly, overtime, take-home pay, 2026 federal income tax, capital gains, sales tax and more. No sign-up.',
    intro: 'Pay calculators convert between hourly, weekly, biweekly and annual pay and apply overtime rules from the Fair Labor Standards Act. Tax tools use the 2026 IRS brackets, standard deductions and FICA limits, and link to the IRS page for each number.',
    faq: [
      ['How do I convert salary to hourly?', 'Divide the annual salary by the hours worked in a year. With 40 hours a week and 52 weeks, that is salary ÷ 2,080. A $60,000 salary works out to $28.85 an hour.'],
      ['What are the 2026 federal tax brackets?', 'For 2026 the IRS brackets are 10%, 12%, 22%, 24%, 32%, 35% and 37%. For single filers the 12% bracket starts at $12,401 and the 37% bracket at $640,601; the standard deduction is $16,100 for single filers and $32,200 for married couples filing jointly.'],
      ['How is overtime calculated?', 'Under federal law, non-exempt employees earn 1.5 times their regular rate for hours over 40 in a workweek. Some states, like California, also require daily overtime after 8 hours and double time after 12.']
    ]
  },
  {
    id: 'business', slug: 'business-calculators', name: 'Business & Accounting', short: 'Business',
    title: 'Business Calculators: {n} Free Margin, Inventory & Ratio Tools',
    meta: 'Free business and accounting calculators: profit margin, markup, break-even, COGS, inventory, ROAS, CLV, financial ratios, depreciation and GDP.',
    intro: 'Margins, ratios and inventory figures that accountants and operators check every week. Each calculator gives the formula used in accounting textbooks, a worked example and a benchmark table so you can tell whether your number is good.',
    faq: [
      ['What is the difference between margin and markup?', 'Markup is profit as a percentage of cost; margin is profit as a percentage of price. A product that costs $60 and sells for $100 has a 66.7% markup and a 40% margin.'],
      ['How do I calculate break-even point?', 'Divide fixed costs by the contribution margin per unit (price minus variable cost). With $10,000 of fixed costs, a $50 price and $30 of variable cost, you break even at 500 units.'],
      ['What is a good current ratio?', 'A current ratio between 1.5 and 2 is usually considered healthy: the business has $1.50 to $2 of current assets for every $1 of current liabilities. Below 1 can signal a liquidity squeeze.']
    ]
  },
  {
    id: 'health', slug: 'health-calculators', name: 'Health & Fitness', short: 'Health',
    title: 'Health Calculators: {n} Free BMI, Calorie & Pregnancy Tools',
    meta: 'Free health and fitness calculators: BMI, calories, macros, net carbs, heart rate zones, VO2 max, due date, ovulation and clinical formulas with sources.',
    intro: 'Health calculators use published, peer-reviewed equations (Mifflin-St Jeor for BMR, the U.S. Navy method for body fat, Naegele\'s rule for due dates) and cite the CDC, NIH or professional body behind each one. They are estimates for education, not a diagnosis.',
    faq: [
      ['Are these health calculators medical advice?', 'No. They apply standard published formulas to the numbers you enter. Use the results to start a conversation with a doctor, dietitian or midwife, not to replace one.'],
      ['How many calories should I eat?', 'Your maintenance calories are your BMR multiplied by an activity factor, typically 1.2 for sedentary up to 1.9 for very active. Eating about 500 calories below maintenance leads to roughly 0.5 kg (1 lb) of weight loss per week for most people.'],
      ['What is a healthy BMI?', 'For adults the CDC classes a BMI of 18.5 to 24.9 as healthy weight, 25 to 29.9 as overweight and 30 or above as obesity. BMI does not measure body fat directly, so athletes can read high.']
    ]
  },
  {
    id: 'education', slug: 'school-calculators', name: 'School & Grades', short: 'School',
    title: 'Grade & GPA Calculators: {n} Free School Tools',
    meta: 'Free school calculators: college and high school GPA, final grade needed, what-if grades, class rank, credit hours, reading WPM and graduation year.',
    intro: 'GPA and grade tools use the standard 4.0 scale with plus and minus grades, the weighted scale most U.S. high schools use for honors and AP classes, and weighted category averages from a typical syllabus.',
    faq: [
      ['How is GPA calculated?', 'Multiply each course\'s grade points by its credit hours, add the results, and divide by total credit hours. Three credits of A (4.0) and four credits of B (3.0) give (12 + 12) ÷ 7 = 3.43.'],
      ['What score do I need on my final?', 'Needed final = (target − current × (1 − final weight)) ÷ final weight. With an 85% average, a final worth 30% and a 90% target, you need (90 − 85 × 0.7) ÷ 0.3 = 101.7%.'],
      ['What is a weighted GPA?', 'A weighted GPA adds extra points for harder classes, commonly +0.5 for honors and +1.0 for AP or IB, so an A in AP counts as 5.0 instead of 4.0.']
    ]
  },
  {
    id: 'construction', slug: 'construction-calculators', name: 'Home, Garden & Construction', short: 'Home & DIY',
    title: 'Construction Calculators: {n} Free Material & DIY Tools',
    meta: 'Free construction and DIY calculators: square footage, linear feet, concrete, gravel, mulch, roofing, tile, stairs, pool chemicals and more, with waste factors.',
    intro: 'Material calculators turn measurements into what you actually buy: cubic yards, tons, bags, boxes, sheets and rolls, with a waste allowance. Densities and coverage rates come from manufacturer data sheets and building codes, and every page shows the conversion it uses.',
    faq: [
      ['How do I convert square feet to cubic yards?', 'Multiply the area in square feet by the depth in feet, then divide by 27. A 10 × 12 ft area at 3 inches deep is 120 × 0.25 ÷ 27 = 1.11 cubic yards.'],
      ['How much extra material should I buy?', 'Plan on 5–10% extra for flooring, tile and lumber laid in straight runs, 10–15% for diagonal layouts or many cuts, and round bulk materials up to the next half yard.'],
      ['How many tons is a cubic yard of gravel?', 'A cubic yard of gravel weighs about 1.4 tons (2,800 lb), depending on stone size and moisture. Sand is about 1.35 tons and topsoil about 1.1 tons per cubic yard.']
    ]
  },
  {
    id: 'electrical', slug: 'engineering-calculators', name: 'Electrical, HVAC & Mechanical', short: 'Engineering',
    title: 'Electrical & Engineering Calculators: {n} Free Tools',
    meta: 'Free electrical, HVAC and mechanical calculators: amps, watts, kW, kVA, amp hours, superheat, subcooling, BTU, CFM, torque, gear ratio and compression ratio.',
    intro: 'Electrical formulas follow Ohm\'s law and the power equations for DC, single-phase and three-phase circuits. HVAC tools use published pressure-temperature data for common refrigerants. Mechanical tools cover the engine, gear and pump math technicians do on the job.',
    faq: [
      ['How do I calculate amps from watts?', 'Divide watts by volts: amps = watts ÷ volts. A 1,500 W heater on 120 V draws 12.5 A. For three-phase AC, divide by (volts × 1.732 × power factor).'],
      ['What is the difference between kW and kVA?', 'kVA is apparent power (volts × amps); kW is real power that does work. kW = kVA × power factor, so a 10 kVA load at 0.8 power factor delivers 8 kW.'],
      ['What should superheat be?', 'On a fixed-orifice system, target superheat depends on indoor wet-bulb and outdoor dry-bulb temperatures and is often 5–20 °F. TXV systems usually run 8–12 °F superheat and are charged by subcooling instead.']
    ]
  },
  {
    id: 'math', slug: 'math-calculators', name: 'Math', short: 'Math',
    title: 'Math Calculators: {n} Free Percentage, Fraction & Geometry Tools',
    meta: 'Free math calculators: percentage, percent change, fractions, roots, exponents, logarithms, slope, midpoint, circles, cylinders, triangles and ratios.',
    intro: 'Each math tool shows the answer and the steps that produce it, so you can check your homework or a spreadsheet formula. Results show exact fractions where possible and decimals rounded to a sensible number of places.',
    faq: [
      ['How do I calculate a percentage of a number?', 'Multiply the number by the percentage and divide by 100. 15% of 80 is 80 × 15 ÷ 100 = 12.'],
      ['How do I calculate percentage change?', 'Subtract the old value from the new value, divide by the old value and multiply by 100. Going from 50 to 65 is (65 − 50) ÷ 50 × 100 = 30% increase.'],
      ['How do I simplify a fraction?', 'Divide the top and bottom by their greatest common divisor. 18/24 has a GCD of 6, so it simplifies to 3/4.']
    ]
  },
  {
    id: 'statistics', slug: 'statistics-calculators', name: 'Statistics', short: 'Statistics',
    title: 'Statistics Calculators: {n} Free P-Value, CI & Z-Score Tools',
    meta: 'Free statistics calculators: standard deviation, confidence intervals, p-values, z-scores, correlation, R-squared, t critical values, chi-square and more.',
    intro: 'Statistics tools compute exact distribution values (normal, t, chi-square and F) rather than reading a printed table, and show the matching Excel or Google Sheets function so you can reproduce each result.',
    faq: [
      ['What is a p-value?', 'A p-value is the probability of getting a result at least as extreme as yours if the null hypothesis were true. A p-value below your significance level (often 0.05) means the result is statistically significant.'],
      ['Sample or population standard deviation?', 'Use the sample standard deviation (divide by n − 1) when your data is a sample from a larger group, which is almost always. Use the population version (divide by n) only when you have every member of the group.'],
      ['What z-score gives a 95% confidence interval?', 'A two-sided 95% confidence interval uses z = 1.96. For small samples with an unknown population standard deviation, use the t critical value for n − 1 degrees of freedom instead.']
    ]
  },
  {
    id: 'science', slug: 'science-calculators', name: 'Science', short: 'Science',
    title: 'Science Calculators: {n} Free Chemistry & Physics Tools',
    meta: 'Free chemistry and physics calculators: density, dilution, moles, pH, titration, half-life, magnification, wave period, force, energy, stress and temperature.',
    intro: 'Lab and homework calculators for chemistry, biology and physics. Each one lists the equation, the units it expects and a worked example from a typical lab, with constants taken from NIST and IUPAC references.',
    faq: [
      ['How do I calculate density?', 'Density is mass divided by volume: ρ = m ÷ V. A 270 g block with a volume of 100 cm³ has a density of 2.7 g/cm³, the density of aluminum.'],
      ['What is C1V1 = C2V2?', 'It is the dilution equation: initial concentration × initial volume = final concentration × final volume. To make 100 mL of 1 M solution from 5 M stock, you need 1 × 100 ÷ 5 = 20 mL of stock.'],
      ['How is total magnification calculated?', 'Multiply the eyepiece magnification by the objective magnification. A 10× eyepiece with a 40× objective gives 400× total magnification.']
    ]
  },
  {
    id: 'time', slug: 'date-time-calculators', name: 'Dates & Time', short: 'Dates',
    title: 'Date & Time Calculators: {n} Free Age, Days & Hours Tools',
    meta: 'Free date and time calculators: age, days between dates, time duration, time cards, business days, birthdays, anniversaries and day of the week.',
    intro: 'Date math that accounts for leap years, month lengths and U.S. federal holidays. Every tool counts calendar days exactly and shows the result in days, weeks, months and years.',
    faq: [
      ['How many days are in a year?', 'A common year has 365 days and a leap year has 366. Leap years are divisible by 4, except century years, which must be divisible by 400, so 2000 was a leap year and 2100 will not be.'],
      ['How do I count days between two dates?', 'Subtract the earlier date from the later one in days. Most calculators, including ours, do not count the start date; add one if you want to include both ends.'],
      ['How do I convert minutes to decimal hours?', 'Divide the minutes by 60. 7 hours 45 minutes is 7 + 45 ÷ 60 = 7.75 hours, which is the figure payroll systems use.']
    ]
  },
  {
    id: 'everyday', slug: 'everyday-calculators', name: 'Everyday & Lifestyle', short: 'Everyday',
    title: 'Everyday Calculators: {n} Free Tip, Gas, Discount & Pet Tools',
    meta: 'Free everyday calculators: tips, bill splits, discounts, unit prices, MPG and trip gas cost, suit size, party food, dog years and puppy age.',
    intro: 'Quick answers for daily decisions: what to tip, who owes what, whether the big box is cheaper, how much gas a trip will cost. Type the numbers, get the answer, get on with your day.',
    faq: [
      ['How much should I tip?', 'In U.S. restaurants, 15–20% of the pre-tax bill is standard for table service, with 20% the most common choice. 20% of a $64 bill is $12.80.'],
      ['How do I calculate MPG?', 'Divide the miles driven since your last fill-up by the gallons it took to refill the tank. 312 miles on 11.8 gallons is 26.4 mpg.'],
      ['How do I find the better deal between two sizes?', 'Divide each price by its size to get a unit price and compare. A 24 oz jar at $4.99 costs 20.8¢ per ounce; a 16 oz jar at $3.69 costs 23.1¢, so the larger jar is cheaper.']
    ]
  },
  {
    id: 'sports', slug: 'sports-game-calculators', name: 'Sports & Games', short: 'Sports',
    title: 'Sports & Game Calculators: {n} Free Golf, Baseball & D&D Tools',
    meta: 'Free sports and gaming calculators: golf handicap index, bowling handicap, ERA, OPS, passer rating, volleyball hitting percentage, D&D 5e stats, DPS and K/D.',
    intro: 'Official formulas for the stats people argue about: the World Handicap System for golf, MLB and NFL definitions for ERA and passer rating, and the Player\'s Handbook rules for D&D 5e.',
    faq: [
      ['How is a golf handicap calculated?', 'Under the World Handicap System, each score becomes a differential: (113 ÷ slope) × (adjusted gross score − course rating). Your Handicap Index is the average of the lowest 8 of your last 20 differentials.'],
      ['How is ERA calculated?', 'ERA = earned runs × 9 ÷ innings pitched. A pitcher who allows 20 earned runs in 60 innings has a 3.00 ERA. Count partial innings in thirds: 6⅔ innings is 6.667.'],
      ['How is passive perception calculated?', 'Passive Perception = 10 + your Wisdom (Perception) modifier, which includes proficiency if you have it. Add 5 for advantage and subtract 5 for disadvantage.']
    ]
  }
];
