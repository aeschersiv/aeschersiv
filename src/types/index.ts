// ============================================================
// FutureWealth Core Types
// Financial Planning + Human Capital + Happiness Assessment
// ============================================================

// --- Assessment & Chat Types ---

export type MessageRole = "system" | "assistant" | "user";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  options?: ChatOption[];
  inputType?: "text" | "number" | "slider" | "select" | "multi-select" | "date";
  inputConfig?: InputConfig;
  category?: AssessmentCategory;
}

export interface ChatOption {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  description?: string;
  nextNode?: string;
}

export interface InputConfig {
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  unit?: string;
  options?: { label: string; value: string }[];
}

export type AssessmentCategory =
  | "demographics"
  | "income"
  | "spending"
  | "savings"
  | "debt"
  | "insurance"
  | "investments"
  | "goals"
  | "happiness"
  | "human-capital"
  | "relationships"
  | "health"
  | "career"
  | "legacy";

// --- Decision Tree Types ---

export interface DecisionNode {
  id: string;
  category: AssessmentCategory;
  question: string;
  description?: string;
  inputType: ChatMessage["inputType"];
  inputConfig?: InputConfig;
  options?: ChatOption[];
  validation?: (value: unknown) => boolean;
  next: string | ((value: unknown) => string);
  storeAs: string;
}

// --- Financial Profile Types ---

export interface UserProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  demographics: Demographics;
  income: IncomeProfile;
  spending: SpendingProfile;
  savings: SavingsProfile;
  debt: DebtProfile;
  insurance: InsuranceProfile;
  investments: InvestmentProfile;
  goals: FinancialGoal[];
  happiness: HappinessProfile;
  humanCapital: HumanCapitalProfile;
}

export interface Demographics {
  age: number;
  retirementAge: number;
  lifeExpectancy: number;
  state: string;
  filingStatus: "single" | "married-joint" | "married-separate" | "head-of-household";
  dependents: number;
}

export interface IncomeProfile {
  primarySalary: number;
  secondarySalary: number;
  sideIncome: number;
  passiveIncome: number;
  socialSecurityEstimate: number;
  expectedGrowthRate: number;
}

export interface SpendingProfile {
  housing: number;
  transportation: number;
  food: number;
  healthcare: number;
  insurance: number;
  entertainment: number;
  education: number;
  clothing: number;
  personalCare: number;
  giving: number;
  subscriptions: number;
  other: number;
  discretionaryRatio: number;
}

export interface SavingsProfile {
  emergencyFund: number;
  emergencyFundTarget: number;
  monthlySavingsRate: number;
  savingsRate: number;
  retirement401k: number;
  retirementIRA: number;
  rothBalance: number;
  hsaBalance: number;
  brokerageBalance: number;
  collegeSavings: number;
}

export interface DebtProfile {
  mortgage: DebtItem;
  autoLoans: DebtItem;
  studentLoans: DebtItem;
  creditCards: DebtItem;
  personalLoans: DebtItem;
  otherDebt: DebtItem;
}

export interface DebtItem {
  balance: number;
  monthlyPayment: number;
  interestRate: number;
  remainingMonths: number;
}

export interface InsuranceProfile {
  hasLifeInsurance: boolean;
  lifeCoverage: number;
  lifePremium: number;
  hasDisabilityInsurance: boolean;
  disabilityCoverage: number;
  hasLongTermCare: boolean;
  hasUmbrella: boolean;
  healthInsuranceType: "employer" | "marketplace" | "medicare" | "medicaid" | "none";
  healthDeductible: number;
  backn9neQuoteId?: string;
  backn9nePolicies?: BackN9nePolicy[];
}

export interface BackN9nePolicy {
  id: string;
  type: "life" | "disability" | "ltc" | "umbrella";
  carrier: string;
  premium: number;
  coverage: number;
  status: "quoted" | "applied" | "active";
}

export interface InvestmentProfile {
  totalPortfolioValue: number;
  assetAllocation: AssetAllocation;
  riskTolerance: 1 | 2 | 3 | 4 | 5;
  investmentStyle: "passive" | "active" | "hybrid";
  altruistAccountId?: string;
  altruistPortfolios?: AltruistPortfolio[];
}

export interface AssetAllocation {
  usDomesticEquity: number;
  internationalEquity: number;
  fixedIncome: number;
  realEstate: number;
  alternatives: number;
  cash: number;
}

export interface AltruistPortfolio {
  id: string;
  name: string;
  value: number;
  allocation: AssetAllocation;
  performance: {
    ytd: number;
    oneYear: number;
    threeYear: number;
    inception: number;
  };
}

// --- Happiness & Human Capital Types ---

export interface HappinessProfile {
  overallScore: number; // 1-10
  financialPeace: number;
  relationshipQuality: number;
  careerFulfillment: number;
  healthWellbeing: number;
  purposeMeaning: number;
  freedomAutonomy: number;
  growthLearning: number;
  communityBelonging: number;
  topValues: string[];
  biggestFinancialStress: string;
  dreamLifeDescription: string;
}

export interface HumanCapitalProfile {
  currentEarningPower: number;
  peakEarningPotential: number;
  yearsToRetirement: number;
  educationLevel: string;
  industryGrowthRate: number;
  skillsInventory: string[];
  totalHumanCapitalValue: number;
  careerTrajectory: "ascending" | "plateau" | "descending";
  riskOfDisplacement: "low" | "medium" | "high";
}

// --- Financial Goals ---

export interface FinancialGoal {
  id: string;
  name: string;
  category: "retirement" | "home" | "education" | "travel" | "business" | "giving" | "freedom" | "legacy" | "other";
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 1 | 2 | 3 | 4 | 5;
  monthlyContribution: number;
  happinessImpact: number; // 1-10 how much achieving this will boost happiness
}

// --- Living Balance Sheet Types ---

export interface LivingBalanceSheet {
  traditionalAssets: BalanceSheetSection;
  humanCapitalAssets: BalanceSheetSection;
  socialCapitalAssets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  netTraditionalWealth: number;
  netTotalWealth: number;
  happinessAdjustedWealth: number;
}

export interface BalanceSheetSection {
  label: string;
  items: BalanceSheetItem[];
  total: number;
}

export interface BalanceSheetItem {
  label: string;
  value: number;
  category: string;
  trend: "up" | "down" | "stable";
  happinessWeight: number;
}

// --- Future Timeline Types ---

export interface FutureTimeline {
  years: FutureYear[];
  milestones: Milestone[];
  scenarios: Scenario[];
}

export interface FutureYear {
  year: number;
  age: number;
  projectedIncome: number;
  projectedSpending: number;
  projectedNetWorth: number;
  projectedHappiness: number;
  events: string[];
  goalProgress: { goalId: string; progress: number }[];
}

export interface Milestone {
  year: number;
  title: string;
  description: string;
  type: "financial" | "personal" | "career" | "health" | "legacy";
  impact: "positive" | "neutral" | "negative";
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  probability: number;
  timeline: FutureYear[];
  requiredActions: string[];
}

// --- API Integration Types ---

export interface BackN9neConfig {
  apiKey: string;
  baseUrl: string;
  agentId: string;
}

export interface BackN9neQuoteRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  state: string;
  tobaccoUse: boolean;
  healthClass: "preferred-plus" | "preferred" | "standard-plus" | "standard";
  coverageAmount: number;
  termLength: 10 | 15 | 20 | 25 | 30;
  productType: "term" | "whole" | "universal" | "variable";
}

export interface BackN9neQuoteResponse {
  quoteId: string;
  quotes: {
    carrier: string;
    productName: string;
    monthlyPremium: number;
    annualPremium: number;
    coverageAmount: number;
    termLength: number;
    rating: string;
  }[];
}

export interface AltruistConfig {
  apiKey: string;
  baseUrl: string;
  advisorId: string;
}

export interface AltruistAccountRequest {
  clientId: string;
  accountType: "individual" | "joint" | "ira" | "roth-ira" | "401k-rollover" | "trust";
  modelPortfolioId?: string;
}

export interface AltruistPortfolioResponse {
  accountId: string;
  holdings: {
    symbol: string;
    shares: number;
    marketValue: number;
    costBasis: number;
    gainLoss: number;
    allocation: number;
  }[];
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    benchmarkReturn: number;
    alpha: number;
  };
}
