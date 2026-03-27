import { NextRequest, NextResponse } from "next/server";
import { BackN9neClient, getMockInsuranceQuotes } from "@/lib/api-integrations";

const USE_MOCK = !process.env.BACKN9NE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (USE_MOCK) {
      // Return mock data when API key is not configured
      switch (action) {
        case "quote":
          return NextResponse.json({
            success: true,
            data: getMockInsuranceQuotes(params.coverageAmount || 500000),
            mock: true,
          });
        case "carriers":
          return NextResponse.json({
            success: true,
            data: [
              { id: "pacific-life", name: "Pacific Life", rating: "A+", products: ["term", "whole", "universal"] },
              { id: "protective", name: "Protective Life", rating: "A+", products: ["term", "whole"] },
              { id: "banner", name: "Banner Life", rating: "A+", products: ["term"] },
              { id: "nationwide", name: "Nationwide", rating: "A+", products: ["term", "whole", "universal", "variable"] },
            ],
            mock: true,
          });
        default:
          return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
      }
    }

    // Live API calls
    const client = new BackN9neClient();

    switch (action) {
      case "quote":
        const quote = await client.getQuote(params);
        return NextResponse.json({ success: true, data: quote });

      case "carriers":
        const carriers = await client.getCarriers();
        return NextResponse.json({ success: true, data: carriers });

      case "products":
        const products = await client.getProducts(params.carrierId);
        return NextResponse.json({ success: true, data: products });

      case "apply":
        const application = await client.submitApplication(params.quoteId, params.applicationData);
        return NextResponse.json({ success: true, data: application });

      case "status":
        const status = await client.getApplicationStatus(params.applicationId);
        return NextResponse.json({ success: true, data: status });

      default:
        return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
