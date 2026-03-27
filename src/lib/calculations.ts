// ============================================================
// Financial Calculations Engine
// Net Worth, Human Capital, Projections, Living Balance Sheet
// ============================================================

import {
  LivingBalanceSheet,
  FutureTimeline,
  FutureYear,
  Milestone,
  Scenario,
} from "@/types";

interface AssessmentData {
  [key: string]: unknown;
}

export function calculateLivingBalanceSheet(data: AssessmentData): LivingBalanceSheet {
  const savings = extractSavings(data);
  const debt = extractDebt(data);
  const income = extractIncome(data);
  const age = Number(data["demographics.age"]) || 35;
  const retirementAge = Number(data["demographics.retirementAge"]) || 65;
  const happinessScore = Number(data["happiness.overallScore"]) || 5;

  // Traditional Assets
  const emergencyFund = Number(data["savings.emergencyFund"]) || 0;
  const retirement401k = Number(data["savings.retirement401k"]) || 0;
  const retirementIRA = Number(data["savings.retirementIRA"]) || 0;
  const rothBalance = Number(data["savings.rothBalance"]) || 0;
  const brokerageBalance = Number(data["savings.brokerageBalance"]) || 0;
  const totalTraditionalAssets = emergencyFund + retirement401k + retirementIRA + rothBalance + brokerageBalance;

  // Human Capital Value (present value of future earnings)
  const annualIncome = income.total;
  const yearsToRetirement = Math.max(0, retirementAge - age);
  const growthRate = Number(data["income.expectedGrowthRate"]) || 3;
  const discountRate = 5; // reasonable discount rate
  const humanCapitalValue = calculateHumanCapitalPV(annualIncome, yearsToRetirement, growthRate / 100, discountRate / 100);

  // Social Capital (relationships, community, skills)
  const relationshipScore = Number(data["happiness.relationshipQuality"]) || 5;
  const communityScore = Number(data["happiness.communityBelonging"]) || 5;
  const skills = (data["humanCapital.skillsInventory"] as string[]) || [];
  const socialCapitalValue = (relationshipScore * 15000) + (communityScore * 10000) + (skills.length * 25000);

  // Total Liabilities
  const mortgageBalance = Number(data["debt.mortgage.balance"]) || 0;
  const studentBalance = Number(data["debt.studentLoans.balance"]) || 0;
  const autoBalance = Number(data["debt.autoLoans.balance"]) || 0;
  const creditCardBalance = Number(data["debt.creditCards.balance"]) || 0;
  const otherDebtBalance = Number(data["debt.otherDebt.balance"]) || 0;
  const totalLiabilities = mortgageBalance + studentBalance + autoBalance + creditCardBalance + otherDebtBalance;

  const netTraditionalWealth = totalTraditionalAssets - totalLiabilities;
  const netTotalWealth = totalTraditionalAssets + humanCapitalValue + socialCapitalValue - totalLiabilities;
  const happinessMultiplier = 0.5 + (happinessScore / 10) * 0.5; // 0.5 to 1.0
  const happinessAdjustedWealth = netTotalWealth * happinessMultiplier;

  return {
    traditionalAssets: {
      label: "Traditional Assets",
      items: [
        { label: "Emergency Fund", value: emergencyFund, category: "cash", trend: emergencyFund > annualIncome * 0.5 ? "up" : "down", happinessWeight: 0.8 },
        { label: "401(k) / 403(b)", value: retirement401k, category: "retirement", trend: "up", happinessWeight: 0.6 },
        { label: "Traditional IRA", value: retirementIRA, category: "retirement", trend: "stable", happinessWeight: 0.6 },
        { label: "Roth IRA / Roth 401(k)", value: rothBalance, category: "retirement", trend: "up", happinessWeight: 0.7 },
        { label: "Brokerage Accounts", value: brokerageBalance, category: "investments", trend: "stable", happinessWeight: 0.5 },
      ],
      total: totalTraditionalAssets,
    },
    humanCapitalAssets: {
      label: "Human Capital",
      items: [
        { label: "Future Earning Power", value: humanCapitalValue, category: "earnings", trend: (data["humanCapital.careerTrajectory"] === "ascending" ? "up" : data["humanCapital.careerTrajectory"] === "descending" ? "down" : "stable"), happinessWeight: 0.7 },
        { label: "Education & Skills", value: skills.length * 25000, category: "skills", trend: "up", happinessWeight: 0.8 },
        { label: "Career Trajectory Premium", value: data["humanCapital.careerTrajectory"] === "ascending" ? humanCapitalValue * 0.15 : 0, category: "growth", trend: "up", happinessWeight: 0.9 },
      ],
      total: humanCapitalValue + (skills.length * 25000) + (data["humanCapital.careerTrajectory"] === "ascending" ? humanCapitalValue * 0.15 : 0),
    },
    socialCapitalAssets: {
      label: "Social & Relationship Capital",
      items: [
        { label: "Relationship Network", value: relationshipScore * 15000, category: "relationships", trend: relationshipScore >= 7 ? "up" : "stable", happinessWeight: 1.0 },
        { label: "Community & Belonging", value: communityScore * 10000, category: "community", trend: "stable", happinessWeight: 0.9 },
        { label: "Purpose & Meaning", value: Number(data["happiness.purposeMeaning"] || 5) * 20000, category: "purpose", trend: "up", happinessWeight: 1.0 },
      ],
      total: socialCapitalValue + Number(data["happiness.purposeMeaning"] || 5) * 20000,
    },
    liabilities: {
      label: "Liabilities",
      items: [
        ...(mortgageBalance > 0 ? [{ label: "Mortgage", value: mortgageBalance, category: "secured", trend: "down" as const, happinessWeight: 0.3 }] : []),
        ...(studentBalance > 0 ? [{ label: "Student Loans", value: studentBalance, category: "education", trend: "down" as const, happinessWeight: 0.5 }] : []),
        ...(autoBalance > 0 ? [{ label: "Auto Loans", value: autoBalance, category: "depreciating", trend: "down" as const, happinessWeight: 0.2 }] : []),
        ...(creditCardBalance > 0 ? [{ label: "Credit Card Debt", value: creditCardBalance, category: "high-interest", trend: "stable" as const, happinessWeight: 0.9 }] : []),
        ...(otherDebtBalance > 0 ? [{ label: "Other Debt", value: otherDebtBalance, category: "other", trend: "stable" as const, happinessWeight: 0.4 }] : []),
      ],
      total: totalLiabilities,
    },
    netTraditionalWealth,
    netTotalWealth,
    happinessAdjustedWealth,
  };
}

export function calculateFutureTimeline(data: AssessmentData): FutureTimeline {
  const age = Number(data["demographics.age"]) || 35;
  const retirementAge = Number(data["demographics.retirementAge"]) || 65;
  const income = extractIncome(data);
  const spending = extractSpending(data);
  const savings = extractSavings(data);
  const debt = extractDebt(data);
  const happinessScore = Number(data["happiness.overallScore"]) || 5;
  const growthRate = (Number(data["income.expectedGrowthRate"]) || 3) / 100;
  const investmentReturn = 0.07;
  const inflationRate = 0.03;

  const years: FutureYear[] = [];
  let currentIncome = income.total;
  let currentSpending = spending.total * 12;
  let currentNetWorth = savings.total - debt.total;
  let currentHappiness = happinessScore;

  for (let i = 0; i <= 40; i++) {
    const currentAge = age + i;
    const isRetired = currentAge >= retirementAge;

    if (isRetired && i > 0) {
      currentIncome = currentIncome * 0.6; // Social security + withdrawals
      currentSpending = currentSpending * 0.85;
    } else {
      currentIncome = currentIncome * (1 + growthRate);
      currentSpending = currentSpending * (1 + inflationRate);
    }

    const netSavings = currentIncome - currentSpending;
    currentNetWorth = currentNetWorth * (1 + investmentReturn) + Math.max(0, netSavings);

    // Happiness tends to increase as financial security grows
    const financialSecurityBoost = Math.min(2, currentNetWorth / (currentSpending * 25) * 2);
    const ageHappinessBoost = currentAge > 50 ? 0.5 : 0; // U-curve of happiness
    currentHappiness = Math.min(10, happinessScore + financialSecurityBoost + ageHappinessBoost);

    const events: string[] = [];
    if (currentAge === retirementAge) events.push("Financial Independence Achieved");
    if (currentAge === age + (Number(data["goals.primary.yearsToGoal"]) || 10)) events.push("Primary Goal Target Date");
    if (currentNetWorth > 1000000 && (currentNetWorth - netSavings) <= 1000000) events.push("Millionaire Milestone");

    years.push({
      year: new Date().getFullYear() + i,
      age: currentAge,
      projectedIncome: Math.round(currentIncome),
      projectedSpending: Math.round(currentSpending),
      projectedNetWorth: Math.round(currentNetWorth),
      projectedHappiness: Math.round(currentHappiness * 10) / 10,
      events,
      goalProgress: [],
    });
  }

  const milestones = generateMilestones(data, years);
  const scenarios = generateScenarios(data, years);

  return { years, milestones, scenarios };
}

function calculateHumanCapitalPV(
  annualIncome: number,
  years: number,
  growthRate: number,
  discountRate: number
): number {
  let pv = 0;
  for (let i = 1; i <= years; i++) {
    const futureIncome = annualIncome * Math.pow(1 + growthRate, i);
    pv += futureIncome / Math.pow(1 + discountRate, i);
  }
  return Math.round(pv);
}

function extractIncome(data: AssessmentData) {
  const primary = Number(data["income.primarySalary"]) || 0;
  const secondary = Number(data["income.secondarySalary"]) || 0;
  const side = Number(data["income.sideIncome"]) || 0;
  const passive = Number(data["income.passiveIncome"]) || 0;
  return { primary, secondary, side, passive, total: primary + secondary + side + passive };
}

function extractSpending(data: AssessmentData) {
  const housing = Number(data["spending.housing"]) || 0;
  const transportation = Number(data["spending.transportation"]) || 0;
  const food = Number(data["spending.food"]) || 0;
  const healthcare = Number(data["spending.healthcare"]) || 0;
  const entertainment = Number(data["spending.entertainment"]) || 0;
  const subscriptions = Number(data["spending.subscriptions"]) || 0;
  const giving = Number(data["spending.giving"]) || 0;
  const other = Number(data["spending.other"]) || 0;
  const total = housing + transportation + food + healthcare + entertainment + subscriptions + giving + other;
  return { housing, transportation, food, healthcare, entertainment, subscriptions, giving, other, total };
}

function extractSavings(data: AssessmentData) {
  const emergency = Number(data["savings.emergencyFund"]) || 0;
  const r401k = Number(data["savings.retirement401k"]) || 0;
  const ira = Number(data["savings.retirementIRA"]) || 0;
  const roth = Number(data["savings.rothBalance"]) || 0;
  const brokerage = Number(data["savings.brokerageBalance"]) || 0;
  return { emergency, r401k, ira, roth, brokerage, total: emergency + r401k + ira + roth + brokerage };
}

function extractDebt(data: AssessmentData) {
  const mortgage = Number(data["debt.mortgage.balance"]) || 0;
  const student = Number(data["debt.studentLoans.balance"]) || 0;
  const auto = Number(data["debt.autoLoans.balance"]) || 0;
  const credit = Number(data["debt.creditCards.balance"]) || 0;
  const other = Number(data["debt.otherDebt.balance"]) || 0;
  return { mortgage, student, auto, credit, other, total: mortgage + student + auto + credit + other };
}

function generateMilestones(data: AssessmentData, years: FutureYear[]): Milestone[] {
  const milestones: Milestone[] = [];
  const age = Number(data["demographics.age"]) || 35;
  const retirementAge = Number(data["demographics.retirementAge"]) || 65;
  const currentYear = new Date().getFullYear();

  // Emergency fund milestone
  const spending = extractSpending(data);
  const emergencyTarget = spending.total * 6;
  const emergencyFund = Number(data["savings.emergencyFund"]) || 0;
  if (emergencyFund < emergencyTarget) {
    milestones.push({
      year: currentYear + 1,
      title: "Build 6-Month Emergency Fund",
      description: `Target: $${emergencyTarget.toLocaleString()}. This is your foundation of financial peace.`,
      type: "financial",
      impact: "positive",
    });
  }

  // Debt-free milestone
  const debt = extractDebt(data);
  if (debt.total > 0) {
    const debtFreeYear = currentYear + Math.ceil(debt.total / (spending.total * 3)); // rough estimate
    milestones.push({
      year: Math.min(debtFreeYear, currentYear + 15),
      title: "Debt Freedom Day",
      description: `Eliminate $${debt.total.toLocaleString()} in debt. The day your money works entirely for you.`,
      type: "financial",
      impact: "positive",
    });
  }

  // Net worth milestones
  for (const year of years) {
    if (year.projectedNetWorth >= 100000 && (years.find(y => y.age === year.age - 1)?.projectedNetWorth || 0) < 100000) {
      milestones.push({ year: year.year, title: "Six-Figure Net Worth", description: "A major milestone showing real financial momentum.", type: "financial", impact: "positive" });
    }
    if (year.projectedNetWorth >= 500000 && (years.find(y => y.age === year.age - 1)?.projectedNetWorth || 0) < 500000) {
      milestones.push({ year: year.year, title: "Half-Million Club", description: "Your wealth is compounding seriously now.", type: "financial", impact: "positive" });
    }
    if (year.projectedNetWorth >= 1000000 && (years.find(y => y.age === year.age - 1)?.projectedNetWorth || 0) < 1000000) {
      milestones.push({ year: year.year, title: "Millionaire Milestone", description: "You've built a seven-figure legacy.", type: "financial", impact: "positive" });
    }
  }

  // Retirement / financial independence
  milestones.push({
    year: currentYear + (retirementAge - age),
    title: "Financial Independence",
    description: "The day work becomes optional. Your assets generate enough to sustain your lifestyle.",
    type: "personal",
    impact: "positive",
  });

  // Primary goal
  const goalYears = Number(data["goals.primary.yearsToGoal"]) || 10;
  const goalCategory = String(data["goals.primary.category"] || "goal");
  milestones.push({
    year: currentYear + goalYears,
    title: `Achieve: ${goalCategory.charAt(0).toUpperCase() + goalCategory.slice(1)}`,
    description: `Your #1 financial goal reached. Target: $${Number(data["goals.primary.targetAmount"] || 0).toLocaleString()}.`,
    type: "personal",
    impact: "positive",
  });

  return milestones.sort((a, b) => a.year - b.year);
}

function generateScenarios(data: AssessmentData, baseYears: FutureYear[]): Scenario[] {
  const scenarios: Scenario[] = [];

  // Optimistic scenario (higher returns, faster income growth)
  const optimisticYears = baseYears.map(y => ({
    ...y,
    projectedNetWorth: Math.round(y.projectedNetWorth * 1.4),
    projectedIncome: Math.round(y.projectedIncome * 1.15),
    projectedHappiness: Math.min(10, y.projectedHappiness + 1),
  }));
  scenarios.push({
    id: "optimistic",
    name: "Best Case",
    description: "Strong market returns, career acceleration, and proactive financial decisions.",
    probability: 0.25,
    timeline: optimisticYears,
    requiredActions: [
      "Maximize retirement contributions",
      "Pursue career advancement opportunities",
      "Maintain diversified portfolio",
      "Build multiple income streams",
    ],
  });

  // Conservative scenario (lower returns, slower growth)
  const conservativeYears = baseYears.map(y => ({
    ...y,
    projectedNetWorth: Math.round(y.projectedNetWorth * 0.7),
    projectedIncome: Math.round(y.projectedIncome * 0.9),
    projectedHappiness: Math.max(1, y.projectedHappiness - 0.5),
  }));
  scenarios.push({
    id: "conservative",
    name: "Conservative",
    description: "Below-average market returns and modest income growth.",
    probability: 0.25,
    timeline: conservativeYears,
    requiredActions: [
      "Increase savings rate by 5%",
      "Consider additional income sources",
      "Review and reduce expenses",
      "Ensure adequate insurance protection",
    ],
  });

  // Disruption scenario
  const disruptionYears = baseYears.map((y, i) => ({
    ...y,
    projectedNetWorth: Math.round(y.projectedNetWorth * (i < 3 ? 0.6 : 0.75)),
    projectedIncome: Math.round(y.projectedIncome * (i < 2 ? 0.5 : 0.85)),
    projectedHappiness: Math.max(1, y.projectedHappiness - (i < 3 ? 2 : 1)),
  }));
  scenarios.push({
    id: "disruption",
    name: "Major Disruption",
    description: "Job loss, health event, or market crash early in the timeline.",
    probability: 0.15,
    timeline: disruptionYears,
    requiredActions: [
      "Build 12-month emergency fund",
      "Secure disability insurance",
      "Maintain adequate life insurance",
      "Diversify income sources",
      "Develop transferable skills",
    ],
  });

  return scenarios;
}

export function calculateInsuranceGap(data: AssessmentData): {
  lifeInsuranceGap: number;
  disabilityGap: boolean;
  recommendations: string[];
} {
  const income = extractIncome(data);
  const debt = extractDebt(data);
  const dependents = Number(data["demographics.dependents"]) || 0;
  const currentCoverage = Number(data["insurance.lifeCoverage"]) || 0;
  const hasDisability = data["insurance.hasDisabilityInsurance"] === "yes";

  // Life insurance need: 10-12x income + debt payoff + education funding
  const incomeReplacement = income.total * (dependents > 0 ? 12 : 10);
  const debtPayoff = debt.total;
  const educationFund = dependents * 100000;
  const totalNeed = incomeReplacement + debtPayoff + educationFund;
  const lifeInsuranceGap = Math.max(0, totalNeed - currentCoverage);

  const recommendations: string[] = [];
  if (lifeInsuranceGap > 0) {
    recommendations.push(
      `You may need an additional $${lifeInsuranceGap.toLocaleString()} in life insurance coverage to fully protect your family.`
    );
  }
  if (!hasDisability && income.total > 50000) {
    recommendations.push(
      "Disability insurance is critical — your ability to earn is your greatest asset. Consider coverage that replaces 60-70% of your income."
    );
  }
  if (dependents > 0 && !data["insurance.hasLifeInsurance"]) {
    recommendations.push(
      "With dependents, life insurance is essential. Term life insurance is an affordable way to protect your family."
    );
  }

  return { lifeInsuranceGap, disabilityGap: !hasDisability, recommendations };
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
