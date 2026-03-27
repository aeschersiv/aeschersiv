import { DecisionNode } from "@/types";

// ============================================================
// Complete Financial Life Assessment Decision Tree
// Covers: Demographics, Income, Spending, Savings, Debt,
//         Insurance, Investments, Goals, Happiness, Human Capital
// ============================================================

export const assessmentTree: Record<string, DecisionNode> = {
  // === WELCOME ===
  welcome: {
    id: "welcome",
    category: "demographics",
    question:
      "Welcome to FutureWealth. I'm here to help you write a positive financial future — one that's built around what actually makes you happy. Let's start with a few basics. What's your first name?",
    inputType: "text",
    inputConfig: { placeholder: "Your first name" },
    storeAs: "firstName",
    next: "age",
  },

  // === DEMOGRAPHICS ===
  age: {
    id: "age",
    category: "demographics",
    question:
      "Nice to meet you, {firstName}! How old are you?",
    inputType: "number",
    inputConfig: { min: 18, max: 100, placeholder: "Your age" },
    storeAs: "demographics.age",
    next: "filing_status",
  },
  filing_status: {
    id: "filing_status",
    category: "demographics",
    question: "What's your tax filing status?",
    inputType: "select",
    options: [
      { id: "single", label: "Single", value: "single" },
      { id: "married-joint", label: "Married Filing Jointly", value: "married-joint" },
      { id: "married-separate", label: "Married Filing Separately", value: "married-separate" },
      { id: "head-of-household", label: "Head of Household", value: "head-of-household" },
    ],
    storeAs: "demographics.filingStatus",
    next: "dependents",
  },
  dependents: {
    id: "dependents",
    category: "demographics",
    question: "How many dependents do you have?",
    inputType: "number",
    inputConfig: { min: 0, max: 20, placeholder: "Number of dependents" },
    storeAs: "demographics.dependents",
    next: "state",
  },
  state: {
    id: "state",
    category: "demographics",
    question: "Which state do you live in?",
    inputType: "text",
    inputConfig: { placeholder: "e.g., California" },
    storeAs: "demographics.state",
    next: "retirement_age",
  },
  retirement_age: {
    id: "retirement_age",
    category: "demographics",
    question:
      "At what age do you envision stepping away from full-time work? This doesn't have to be traditional retirement — it could be when you shift to passion projects, part-time work, or full freedom.",
    inputType: "number",
    inputConfig: { min: 30, max: 90, placeholder: "Target retirement age" },
    storeAs: "demographics.retirementAge",
    next: "happiness_intro",
  },

  // === HAPPINESS (Early — sets the tone) ===
  happiness_intro: {
    id: "happiness_intro",
    category: "happiness",
    question:
      "Before we dive into numbers, let's talk about what matters most. Money is a tool — what it's for is what counts. On a scale of 1-10, how happy are you with your life overall right now?",
    inputType: "slider",
    inputConfig: { min: 1, max: 10, step: 1 },
    storeAs: "happiness.overallScore",
    next: "financial_peace",
  },
  financial_peace: {
    id: "financial_peace",
    category: "happiness",
    question:
      "How much financial peace do you feel? (1 = constant stress, 10 = complete peace)",
    inputType: "slider",
    inputConfig: { min: 1, max: 10, step: 1 },
    storeAs: "happiness.financialPeace",
    next: "relationship_quality",
  },
  relationship_quality: {
    id: "relationship_quality",
    category: "happiness",
    question: "How would you rate the quality of your closest relationships?",
    inputType: "slider",
    inputConfig: { min: 1, max: 10, step: 1 },
    storeAs: "happiness.relationshipQuality",
    next: "career_fulfillment",
  },
  career_fulfillment: {
    id: "career_fulfillment",
    category: "happiness",
    question: "How fulfilled do you feel in your career or daily work?",
    inputType: "slider",
    inputConfig: { min: 1, max: 10, step: 1 },
    storeAs: "happiness.careerFulfillment",
    next: "health_wellbeing",
  },
  health_wellbeing: {
    id: "health_wellbeing",
    category: "happiness",
    question: "How would you rate your overall health and wellbeing?",
    inputType: "slider",
    inputConfig: { min: 1, max: 10, step: 1 },
    storeAs: "happiness.healthWellbeing",
    next: "purpose_meaning",
  },
  purpose_meaning: {
    id: "purpose_meaning",
    category: "happiness",
    question: "How strong is your sense of purpose and meaning in life?",
    inputType: "slider",
    inputConfig: { min: 1, max: 10, step: 1 },
    storeAs: "happiness.purposeMeaning",
    next: "freedom_autonomy",
  },
  freedom_autonomy: {
    id: "freedom_autonomy",
    category: "happiness",
    question: "How much freedom and autonomy do you feel you have over your time?",
    inputType: "slider",
    inputConfig: { min: 1, max: 10, step: 1 },
    storeAs: "happiness.freedomAutonomy",
    next: "top_values",
  },
  top_values: {
    id: "top_values",
    category: "happiness",
    question: "Select the values that matter most to you (choose up to 5):",
    inputType: "multi-select",
    options: [
      { id: "family", label: "Family & Relationships", value: "family" },
      { id: "freedom", label: "Freedom & Independence", value: "freedom" },
      { id: "security", label: "Security & Stability", value: "security" },
      { id: "adventure", label: "Adventure & Experiences", value: "adventure" },
      { id: "growth", label: "Personal Growth", value: "growth" },
      { id: "creativity", label: "Creativity & Expression", value: "creativity" },
      { id: "service", label: "Service & Giving Back", value: "service" },
      { id: "health", label: "Health & Vitality", value: "health" },
      { id: "legacy", label: "Legacy & Impact", value: "legacy" },
      { id: "community", label: "Community & Belonging", value: "community" },
      { id: "spirituality", label: "Spirituality & Faith", value: "spirituality" },
      { id: "achievement", label: "Achievement & Recognition", value: "achievement" },
    ],
    storeAs: "happiness.topValues",
    next: "biggest_stress",
  },
  biggest_stress: {
    id: "biggest_stress",
    category: "happiness",
    question:
      "What is the single biggest financial stress in your life right now?",
    inputType: "select",
    options: [
      { id: "debt", label: "Debt & monthly payments", value: "debt" },
      { id: "savings", label: "Not saving enough", value: "savings" },
      { id: "retirement", label: "Not ready for retirement", value: "retirement" },
      { id: "emergency", label: "No emergency fund", value: "emergency" },
      { id: "income", label: "Not earning enough", value: "income" },
      { id: "protection", label: "Not enough insurance/protection", value: "protection" },
      { id: "investing", label: "Not investing wisely", value: "investing" },
      { id: "family", label: "Supporting family members", value: "family" },
      { id: "healthcare", label: "Healthcare costs", value: "healthcare" },
      { id: "education", label: "Education costs", value: "education" },
    ],
    storeAs: "happiness.biggestFinancialStress",
    next: "dream_life",
  },
  dream_life: {
    id: "dream_life",
    category: "happiness",
    question:
      "Paint me a picture: If money were no object, what does your ideal Tuesday look like five years from now? Where are you, what are you doing, who is with you?",
    inputType: "text",
    inputConfig: { placeholder: "Describe your dream day..." },
    storeAs: "happiness.dreamLifeDescription",
    next: "income_primary",
  },

  // === INCOME ===
  income_primary: {
    id: "income_primary",
    category: "income",
    question:
      "Now let's look at what's coming in. What is your annual gross salary (before taxes) from your primary job?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Annual salary", unit: "$" },
    storeAs: "income.primarySalary",
    next: "income_secondary",
  },
  income_secondary: {
    id: "income_secondary",
    category: "income",
    question:
      "Does your household have a second income (spouse/partner)? If so, what's their annual gross salary?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "0 if none", unit: "$" },
    storeAs: "income.secondarySalary",
    next: "income_side",
  },
  income_side: {
    id: "income_side",
    category: "income",
    question: "Any side income, freelance work, or business income per year?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Annual side income", unit: "$" },
    storeAs: "income.sideIncome",
    next: "income_passive",
  },
  income_passive: {
    id: "income_passive",
    category: "income",
    question:
      "Do you have any passive income (rental properties, dividends, royalties)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Annual passive income", unit: "$" },
    storeAs: "income.passiveIncome",
    next: "income_growth",
  },
  income_growth: {
    id: "income_growth",
    category: "income",
    question: "What annual raise or income growth do you typically expect?",
    inputType: "select",
    options: [
      { id: "low", label: "1-2% (cost of living)", value: 1.5 },
      { id: "moderate", label: "3-5% (moderate growth)", value: 4 },
      { id: "high", label: "6-10% (high growth / promotions)", value: 8 },
      { id: "very-high", label: "10%+ (rapid career growth)", value: 12 },
    ],
    storeAs: "income.expectedGrowthRate",
    next: "spending_housing",
  },

  // === SPENDING ===
  spending_housing: {
    id: "spending_housing",
    category: "spending",
    question:
      "Let's understand where your money goes. What's your monthly housing cost (rent or mortgage, including insurance and taxes)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Monthly housing cost", unit: "$" },
    storeAs: "spending.housing",
    next: "spending_transport",
  },
  spending_transport: {
    id: "spending_transport",
    category: "spending",
    question:
      "Monthly transportation costs (car payment, insurance, gas, transit)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Monthly transport", unit: "$" },
    storeAs: "spending.transportation",
    next: "spending_food",
  },
  spending_food: {
    id: "spending_food",
    category: "spending",
    question: "Monthly food spending (groceries + dining out)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Monthly food", unit: "$" },
    storeAs: "spending.food",
    next: "spending_healthcare",
  },
  spending_healthcare: {
    id: "spending_healthcare",
    category: "spending",
    question: "Monthly healthcare costs (premiums, copays, medications)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Monthly healthcare", unit: "$" },
    storeAs: "spending.healthcare",
    next: "spending_entertainment",
  },
  spending_entertainment: {
    id: "spending_entertainment",
    category: "spending",
    question: "Monthly entertainment and lifestyle spending?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Monthly entertainment", unit: "$" },
    storeAs: "spending.entertainment",
    next: "spending_subscriptions",
  },
  spending_subscriptions: {
    id: "spending_subscriptions",
    category: "spending",
    question:
      "Total monthly subscriptions (streaming, gym, software, memberships)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Monthly subscriptions", unit: "$" },
    storeAs: "spending.subscriptions",
    next: "spending_giving",
  },
  spending_giving: {
    id: "spending_giving",
    category: "spending",
    question: "Monthly charitable giving or tithing?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Monthly giving", unit: "$" },
    storeAs: "spending.giving",
    next: "spending_other",
  },
  spending_other: {
    id: "spending_other",
    category: "spending",
    question: "Any other monthly expenses we haven't covered?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Other monthly expenses", unit: "$" },
    storeAs: "spending.other",
    next: "savings_emergency",
  },

  // === SAVINGS ===
  savings_emergency: {
    id: "savings_emergency",
    category: "savings",
    question:
      "How much do you have in your emergency fund (liquid savings you can access quickly)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Emergency fund balance", unit: "$" },
    storeAs: "savings.emergencyFund",
    next: "savings_rate",
  },
  savings_rate: {
    id: "savings_rate",
    category: "savings",
    question:
      "What percentage of your income are you currently saving each month (across all savings)?",
    inputType: "slider",
    inputConfig: { min: 0, max: 60, step: 1, unit: "%" },
    storeAs: "savings.savingsRate",
    next: "savings_401k",
  },
  savings_401k: {
    id: "savings_401k",
    category: "savings",
    question: "Current balance in employer-sponsored retirement accounts (401k, 403b, TSP)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "401k balance", unit: "$" },
    storeAs: "savings.retirement401k",
    next: "savings_ira",
  },
  savings_ira: {
    id: "savings_ira",
    category: "savings",
    question: "Current balance in traditional IRA accounts?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "IRA balance", unit: "$" },
    storeAs: "savings.retirementIRA",
    next: "savings_roth",
  },
  savings_roth: {
    id: "savings_roth",
    category: "savings",
    question: "Current balance in Roth IRA or Roth 401k?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Roth balance", unit: "$" },
    storeAs: "savings.rothBalance",
    next: "savings_brokerage",
  },
  savings_brokerage: {
    id: "savings_brokerage",
    category: "savings",
    question: "Current balance in taxable brokerage/investment accounts?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Brokerage balance", unit: "$" },
    storeAs: "savings.brokerageBalance",
    next: "debt_mortgage",
  },

  // === DEBT ===
  debt_mortgage: {
    id: "debt_mortgage",
    category: "debt",
    question: "Do you have a mortgage? If so, what's the remaining balance?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Mortgage balance (0 if none)", unit: "$" },
    storeAs: "debt.mortgage.balance",
    next: (value) => (Number(value) > 0 ? "debt_mortgage_rate" : "debt_student"),
  },
  debt_mortgage_rate: {
    id: "debt_mortgage_rate",
    category: "debt",
    question: "What's your mortgage interest rate?",
    inputType: "number",
    inputConfig: { min: 0, max: 15, step: 0.125, placeholder: "Interest rate", unit: "%" },
    storeAs: "debt.mortgage.interestRate",
    next: "debt_student",
  },
  debt_student: {
    id: "debt_student",
    category: "debt",
    question: "Total student loan balance?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Student loan balance", unit: "$" },
    storeAs: "debt.studentLoans.balance",
    next: "debt_auto",
  },
  debt_auto: {
    id: "debt_auto",
    category: "debt",
    question: "Total auto loan balance?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Auto loan balance", unit: "$" },
    storeAs: "debt.autoLoans.balance",
    next: "debt_credit_cards",
  },
  debt_credit_cards: {
    id: "debt_credit_cards",
    category: "debt",
    question: "Total credit card debt (carried month to month)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Credit card debt", unit: "$" },
    storeAs: "debt.creditCards.balance",
    next: "debt_other",
  },
  debt_other: {
    id: "debt_other",
    category: "debt",
    question: "Any other debt (personal loans, medical debt, etc.)?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Other debt", unit: "$" },
    storeAs: "debt.otherDebt.balance",
    next: "insurance_life",
  },

  // === INSURANCE ===
  insurance_life: {
    id: "insurance_life",
    category: "insurance",
    question: "Do you currently have life insurance?",
    inputType: "select",
    options: [
      { id: "yes", label: "Yes", value: "yes" },
      { id: "no", label: "No", value: "no" },
      { id: "unsure", label: "I'm not sure", value: "unsure" },
    ],
    storeAs: "insurance.hasLifeInsurance",
    next: (value) => (value === "yes" ? "insurance_life_coverage" : "insurance_disability"),
  },
  insurance_life_coverage: {
    id: "insurance_life_coverage",
    category: "insurance",
    question: "What's your total life insurance coverage amount?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Coverage amount", unit: "$" },
    storeAs: "insurance.lifeCoverage",
    next: "insurance_disability",
  },
  insurance_disability: {
    id: "insurance_disability",
    category: "insurance",
    question:
      "Do you have disability insurance (the ability to protect your income if you can't work)?",
    inputType: "select",
    options: [
      { id: "yes", label: "Yes — through work or personally", value: "yes" },
      { id: "no", label: "No", value: "no" },
      { id: "unsure", label: "I'm not sure", value: "unsure" },
    ],
    storeAs: "insurance.hasDisabilityInsurance",
    next: "insurance_health",
  },
  insurance_health: {
    id: "insurance_health",
    category: "insurance",
    question: "How do you get your health insurance?",
    inputType: "select",
    options: [
      { id: "employer", label: "Through my employer", value: "employer" },
      { id: "marketplace", label: "Marketplace / ACA", value: "marketplace" },
      { id: "medicare", label: "Medicare", value: "medicare" },
      { id: "none", label: "I don't have health insurance", value: "none" },
    ],
    storeAs: "insurance.healthInsuranceType",
    next: "investments_risk",
  },

  // === INVESTMENTS ===
  investments_risk: {
    id: "investments_risk",
    category: "investments",
    question:
      "When the market drops 20%, what do you do?",
    inputType: "select",
    options: [
      { id: "sell", label: "Sell everything — I can't handle losses", value: 1, description: "Very Conservative" },
      { id: "reduce", label: "Sell some and move to safer investments", value: 2, description: "Conservative" },
      { id: "hold", label: "Hold steady and wait it out", value: 3, description: "Moderate" },
      { id: "buy-some", label: "Buy a little more at the lower prices", value: 4, description: "Growth" },
      { id: "buy-aggressive", label: "Buy aggressively — this is a sale!", value: 5, description: "Aggressive" },
    ],
    storeAs: "investments.riskTolerance",
    next: "investments_style",
  },
  investments_style: {
    id: "investments_style",
    category: "investments",
    question: "How do you prefer to invest?",
    inputType: "select",
    options: [
      { id: "passive", label: "Index funds / set it and forget it", value: "passive" },
      { id: "active", label: "I like picking individual stocks and managing actively", value: "active" },
      { id: "hybrid", label: "A mix of both", value: "hybrid" },
      { id: "unsure", label: "I'm not sure / I need guidance", value: "passive" },
    ],
    storeAs: "investments.investmentStyle",
    next: "human_capital_education",
  },

  // === HUMAN CAPITAL ===
  human_capital_education: {
    id: "human_capital_education",
    category: "human-capital",
    question: "What is your highest level of education?",
    inputType: "select",
    options: [
      { id: "hs", label: "High School", value: "high-school" },
      { id: "some-college", label: "Some College", value: "some-college" },
      { id: "bachelors", label: "Bachelor's Degree", value: "bachelors" },
      { id: "masters", label: "Master's Degree", value: "masters" },
      { id: "doctorate", label: "Doctorate / Professional Degree", value: "doctorate" },
      { id: "trade", label: "Trade / Vocational Certification", value: "trade" },
    ],
    storeAs: "humanCapital.educationLevel",
    next: "human_capital_trajectory",
  },
  human_capital_trajectory: {
    id: "human_capital_trajectory",
    category: "human-capital",
    question: "How would you describe your career trajectory?",
    inputType: "select",
    options: [
      { id: "ascending", label: "Ascending — I'm growing and expect to earn more", value: "ascending" },
      { id: "plateau", label: "Plateau — I'm at my peak earning range", value: "plateau" },
      { id: "descending", label: "Winding down — moving toward retirement or a simpler role", value: "descending" },
    ],
    storeAs: "humanCapital.careerTrajectory",
    next: "human_capital_skills",
  },
  human_capital_skills: {
    id: "human_capital_skills",
    category: "human-capital",
    question: "What are your top professional skills? (Select all that apply)",
    inputType: "multi-select",
    options: [
      { id: "leadership", label: "Leadership & Management", value: "leadership" },
      { id: "technical", label: "Technical / Engineering", value: "technical" },
      { id: "sales", label: "Sales & Business Development", value: "sales" },
      { id: "creative", label: "Creative & Design", value: "creative" },
      { id: "analytical", label: "Data & Analytics", value: "analytical" },
      { id: "healthcare", label: "Healthcare & Medicine", value: "healthcare" },
      { id: "education", label: "Education & Training", value: "education" },
      { id: "finance", label: "Finance & Accounting", value: "finance" },
      { id: "communication", label: "Communication & Writing", value: "communication" },
      { id: "trades", label: "Skilled Trades", value: "trades" },
    ],
    storeAs: "humanCapital.skillsInventory",
    next: "human_capital_displacement",
  },
  human_capital_displacement: {
    id: "human_capital_displacement",
    category: "human-capital",
    question:
      "How concerned are you about AI or automation affecting your career in the next 10 years?",
    inputType: "select",
    options: [
      { id: "low", label: "Not concerned — my work requires deep human connection", value: "low" },
      { id: "medium", label: "Somewhat — parts of my job could be automated", value: "medium" },
      { id: "high", label: "Very concerned — my industry is changing fast", value: "high" },
    ],
    storeAs: "humanCapital.riskOfDisplacement",
    next: "goals_primary",
  },

  // === GOALS ===
  goals_primary: {
    id: "goals_primary",
    category: "goals",
    question: "What's the most important financial goal you're working toward?",
    inputType: "select",
    options: [
      { id: "retirement", label: "Retire comfortably", value: "retirement" },
      { id: "home", label: "Buy a home", value: "home" },
      { id: "freedom", label: "Achieve financial independence", value: "freedom" },
      { id: "education", label: "Fund education (self or children)", value: "education" },
      { id: "business", label: "Start or grow a business", value: "business" },
      { id: "travel", label: "Travel and experiences", value: "travel" },
      { id: "giving", label: "Give generously", value: "giving" },
      { id: "legacy", label: "Build a lasting legacy", value: "legacy" },
    ],
    storeAs: "goals.primary.category",
    next: "goals_primary_amount",
  },
  goals_primary_amount: {
    id: "goals_primary_amount",
    category: "goals",
    question: "How much do you think you'll need to achieve that goal?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Target amount", unit: "$" },
    storeAs: "goals.primary.targetAmount",
    next: "goals_primary_timeline",
  },
  goals_primary_timeline: {
    id: "goals_primary_timeline",
    category: "goals",
    question: "In how many years do you want to achieve it?",
    inputType: "number",
    inputConfig: { min: 1, max: 50, placeholder: "Years" },
    storeAs: "goals.primary.yearsToGoal",
    next: "goals_primary_happiness",
  },
  goals_primary_happiness: {
    id: "goals_primary_happiness",
    category: "goals",
    question:
      "On a scale of 1-10, how much would achieving this goal increase your happiness?",
    inputType: "slider",
    inputConfig: { min: 1, max: 10, step: 1 },
    storeAs: "goals.primary.happinessImpact",
    next: "goals_secondary",
  },
  goals_secondary: {
    id: "goals_secondary",
    category: "goals",
    question: "What's your second most important financial goal?",
    inputType: "select",
    options: [
      { id: "retirement", label: "Retire comfortably", value: "retirement" },
      { id: "home", label: "Buy a home", value: "home" },
      { id: "freedom", label: "Achieve financial independence", value: "freedom" },
      { id: "education", label: "Fund education", value: "education" },
      { id: "business", label: "Start or grow a business", value: "business" },
      { id: "travel", label: "Travel and experiences", value: "travel" },
      { id: "giving", label: "Give generously", value: "giving" },
      { id: "legacy", label: "Build a lasting legacy", value: "legacy" },
      { id: "none", label: "Just the one goal for now", value: "none" },
    ],
    storeAs: "goals.secondary.category",
    next: (value) => (value === "none" ? "assessment_complete" : "goals_secondary_amount"),
  },
  goals_secondary_amount: {
    id: "goals_secondary_amount",
    category: "goals",
    question: "How much will you need for that second goal?",
    inputType: "number",
    inputConfig: { min: 0, placeholder: "Target amount", unit: "$" },
    storeAs: "goals.secondary.targetAmount",
    next: "assessment_complete",
  },

  // === COMPLETION ===
  assessment_complete: {
    id: "assessment_complete",
    category: "goals",
    question:
      "Excellent work, {firstName}! I now have a comprehensive picture of your financial life and what matters most to you. Let me build your personalized Living Balance Sheet, calculate your total human capital, and create a roadmap to your happiest financial future. Ready to see your results?",
    inputType: "select",
    options: [
      { id: "ready", label: "Show me my future!", value: "ready" },
    ],
    storeAs: "_complete",
    next: "DONE",
  },
};

export function getNode(id: string): DecisionNode | undefined {
  return assessmentTree[id];
}

export function getNextNodeId(node: DecisionNode, value: unknown): string {
  if (typeof node.next === "function") {
    return node.next(value);
  }
  return node.next;
}

export function interpolateQuestion(question: string, data: Record<string, unknown>): string {
  return question.replace(/\{(\w+)\}/g, (_, key) => {
    return String(data[key] ?? key);
  });
}
