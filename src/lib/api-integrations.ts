// ============================================================
// API Integration Layer
// Backn9ne Insurance + Altruist Portfolio Management
// ============================================================

import {
  BackN9neConfig,
  BackN9neQuoteRequest,
  BackN9neQuoteResponse,
  AltruistConfig,
  AltruistPortfolioResponse,
  AltruistAccountRequest,
} from "@/types";

// ============================================================
// Backn9ne Insurance API
// ============================================================

const BACKN9NE_DEFAULT_CONFIG: BackN9neConfig = {
  apiKey: process.env.BACKN9NE_API_KEY || "",
  baseUrl: process.env.BACKN9NE_API_URL || "https://api.backn9ne.com/v1",
  agentId: process.env.BACKN9NE_AGENT_ID || "",
};

export class BackN9neClient {
  private config: BackN9neConfig;

  constructor(config?: Partial<BackN9neConfig>) {
    this.config = { ...BACKN9NE_DEFAULT_CONFIG, ...config };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        "X-Agent-Id": this.config.agentId,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Backn9ne API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  async getQuote(request: BackN9neQuoteRequest): Promise<BackN9neQuoteResponse> {
    return this.request<BackN9neQuoteResponse>("/quotes", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getQuoteById(quoteId: string): Promise<BackN9neQuoteResponse> {
    return this.request<BackN9neQuoteResponse>(`/quotes/${quoteId}`);
  }

  async getCarriers(): Promise<{ id: string; name: string; rating: string; products: string[] }[]> {
    return this.request("/carriers");
  }

  async getProducts(carrierId: string): Promise<{
    id: string;
    name: string;
    type: string;
    minCoverage: number;
    maxCoverage: number;
    termLengths: number[];
  }[]> {
    return this.request(`/carriers/${carrierId}/products`);
  }

  async submitApplication(quoteId: string, applicationData: Record<string, unknown>): Promise<{
    applicationId: string;
    status: string;
    nextSteps: string[];
  }> {
    return this.request(`/quotes/${quoteId}/apply`, {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  }

  async getApplicationStatus(applicationId: string): Promise<{
    applicationId: string;
    status: "pending" | "underwriting" | "approved" | "declined";
    details: string;
  }> {
    return this.request(`/applications/${applicationId}`);
  }
}

// ============================================================
// Altruist API
// ============================================================

const ALTRUIST_DEFAULT_CONFIG: AltruistConfig = {
  apiKey: process.env.ALTRUIST_API_KEY || "",
  baseUrl: process.env.ALTRUIST_API_URL || "https://api.altruist.com/v1",
  advisorId: process.env.ALTRUIST_ADVISOR_ID || "",
};

export class AltruistClient {
  private config: AltruistConfig;

  constructor(config?: Partial<AltruistConfig>) {
    this.config = { ...ALTRUIST_DEFAULT_CONFIG, ...config };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        "X-Advisor-Id": this.config.advisorId,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Altruist API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  // Account Management
  async createAccount(request: AltruistAccountRequest): Promise<{ accountId: string; status: string }> {
    return this.request("/accounts", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getAccount(accountId: string): Promise<{
    accountId: string;
    type: string;
    status: string;
    balance: number;
    holdings: AltruistPortfolioResponse["holdings"];
  }> {
    return this.request(`/accounts/${accountId}`);
  }

  async listAccounts(clientId: string): Promise<{
    accounts: { accountId: string; type: string; balance: number }[];
  }> {
    return this.request(`/clients/${clientId}/accounts`);
  }

  // Portfolio Management
  async getPortfolio(accountId: string): Promise<AltruistPortfolioResponse> {
    return this.request(`/accounts/${accountId}/portfolio`);
  }

  async getModelPortfolios(): Promise<{
    models: {
      id: string;
      name: string;
      description: string;
      riskLevel: number;
      allocation: Record<string, number>;
      expenseRatio: number;
    }[];
  }> {
    return this.request("/model-portfolios");
  }

  async assignModelPortfolio(accountId: string, modelId: string): Promise<{ status: string }> {
    return this.request(`/accounts/${accountId}/model`, {
      method: "PUT",
      body: JSON.stringify({ modelPortfolioId: modelId }),
    });
  }

  // Performance
  async getPerformance(accountId: string, period: "1m" | "3m" | "6m" | "1y" | "3y" | "5y" | "inception"): Promise<{
    period: string;
    totalReturn: number;
    annualizedReturn: number;
    benchmarkReturn: number;
    dataPoints: { date: string; value: number }[];
  }> {
    return this.request(`/accounts/${accountId}/performance?period=${period}`);
  }

  // Trading
  async rebalance(accountId: string): Promise<{
    trades: { symbol: string; action: "buy" | "sell"; shares: number; estimatedAmount: number }[];
    status: string;
  }> {
    return this.request(`/accounts/${accountId}/rebalance`, { method: "POST" });
  }

  // Tax Loss Harvesting
  async getTaxLossOpportunities(accountId: string): Promise<{
    opportunities: {
      symbol: string;
      unrealizedLoss: number;
      replacementSymbol: string;
      estimatedTaxSavings: number;
    }[];
  }> {
    return this.request(`/accounts/${accountId}/tax-loss-harvest`);
  }

  // Reporting
  async getClientReport(clientId: string): Promise<{
    totalAUM: number;
    accounts: { accountId: string; type: string; balance: number; performance: number }[];
    assetAllocation: Record<string, number>;
    fees: { advisory: number; fund: number; total: number };
  }> {
    return this.request(`/clients/${clientId}/report`);
  }
}

// ============================================================
// Mock data for development (when APIs not configured)
// ============================================================

export function getMockInsuranceQuotes(coverageAmount: number): BackN9neQuoteResponse {
  return {
    quoteId: `mock-${Date.now()}`,
    quotes: [
      {
        carrier: "Pacific Life",
        productName: "Pacific Protector Term",
        monthlyPremium: Math.round(coverageAmount / 1000 * 0.45),
        annualPremium: Math.round(coverageAmount / 1000 * 0.45 * 12),
        coverageAmount,
        termLength: 20,
        rating: "A+",
      },
      {
        carrier: "Protective Life",
        productName: "Classic Choice Term",
        monthlyPremium: Math.round(coverageAmount / 1000 * 0.42),
        annualPremium: Math.round(coverageAmount / 1000 * 0.42 * 12),
        coverageAmount,
        termLength: 20,
        rating: "A+",
      },
      {
        carrier: "Banner Life",
        productName: "OPTerm",
        monthlyPremium: Math.round(coverageAmount / 1000 * 0.38),
        annualPremium: Math.round(coverageAmount / 1000 * 0.38 * 12),
        coverageAmount,
        termLength: 20,
        rating: "A+",
      },
    ],
  };
}

export function getMockPortfolioModels() {
  return [
    {
      id: "conservative",
      name: "Conservative Growth",
      description: "Capital preservation with moderate growth",
      riskLevel: 2,
      allocation: { "US Stocks": 30, "International": 10, "Bonds": 45, "REITs": 5, "Cash": 10 },
      expenseRatio: 0.08,
    },
    {
      id: "moderate",
      name: "Balanced Growth",
      description: "Balanced approach seeking growth and stability",
      riskLevel: 3,
      allocation: { "US Stocks": 45, "International": 15, "Bonds": 30, "REITs": 5, "Cash": 5 },
      expenseRatio: 0.09,
    },
    {
      id: "growth",
      name: "Growth",
      description: "Long-term capital appreciation",
      riskLevel: 4,
      allocation: { "US Stocks": 55, "International": 20, "Bonds": 15, "REITs": 7, "Cash": 3 },
      expenseRatio: 0.10,
    },
    {
      id: "aggressive",
      name: "Aggressive Growth",
      description: "Maximum growth potential for long time horizons",
      riskLevel: 5,
      allocation: { "US Stocks": 60, "International": 25, "Bonds": 5, "REITs": 8, "Cash": 2 },
      expenseRatio: 0.11,
    },
  ];
}
