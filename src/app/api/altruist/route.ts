import { NextRequest, NextResponse } from "next/server";
import { AltruistClient, getMockPortfolioModels } from "@/lib/api-integrations";

const USE_MOCK = !process.env.ALTRUIST_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (USE_MOCK) {
      switch (action) {
        case "models":
          return NextResponse.json({
            success: true,
            data: { models: getMockPortfolioModels() },
            mock: true,
          });
        case "portfolio":
          return NextResponse.json({
            success: true,
            data: {
              accountId: "mock-account",
              holdings: [
                { symbol: "VTI", shares: 150, marketValue: 42000, costBasis: 38000, gainLoss: 4000, allocation: 40 },
                { symbol: "VXUS", shares: 80, marketValue: 15000, costBasis: 14000, gainLoss: 1000, allocation: 15 },
                { symbol: "BND", shares: 200, marketValue: 25000, costBasis: 26000, gainLoss: -1000, allocation: 25 },
                { symbol: "VNQ", shares: 30, marketValue: 8000, costBasis: 7500, gainLoss: 500, allocation: 8 },
                { symbol: "VTIP", shares: 100, marketValue: 12000, costBasis: 12500, gainLoss: -500, allocation: 12 },
              ],
              performance: {
                totalReturn: 0.089,
                annualizedReturn: 0.074,
                benchmarkReturn: 0.082,
                alpha: -0.008,
              },
            },
            mock: true,
          });
        case "performance":
          return NextResponse.json({
            success: true,
            data: {
              period: params.period || "1y",
              totalReturn: 0.089,
              annualizedReturn: 0.074,
              benchmarkReturn: 0.082,
              dataPoints: Array.from({ length: 12 }, (_, i) => ({
                date: new Date(Date.now() - (11 - i) * 30 * 86400000).toISOString().split("T")[0],
                value: 100000 + Math.random() * 10000 + i * 800,
              })),
            },
            mock: true,
          });
        default:
          return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
      }
    }

    // Live API calls
    const client = new AltruistClient();

    switch (action) {
      case "models":
        const models = await client.getModelPortfolios();
        return NextResponse.json({ success: true, data: models });

      case "portfolio":
        const portfolio = await client.getPortfolio(params.accountId);
        return NextResponse.json({ success: true, data: portfolio });

      case "performance":
        const performance = await client.getPerformance(params.accountId, params.period);
        return NextResponse.json({ success: true, data: performance });

      case "create-account":
        const account = await client.createAccount(params);
        return NextResponse.json({ success: true, data: account });

      case "rebalance":
        const rebalance = await client.rebalance(params.accountId);
        return NextResponse.json({ success: true, data: rebalance });

      case "tax-harvest":
        const harvest = await client.getTaxLossOpportunities(params.accountId);
        return NextResponse.json({ success: true, data: harvest });

      case "report":
        const report = await client.getClientReport(params.clientId);
        return NextResponse.json({ success: true, data: report });

      default:
        return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
