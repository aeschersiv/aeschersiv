import { NextRequest, NextResponse } from "next/server";
import {
  calculateLivingBalanceSheet,
  calculateFutureTimeline,
  calculateInsuranceGap,
} from "@/lib/calculations";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const balanceSheet = calculateLivingBalanceSheet(data);
    const timeline = calculateFutureTimeline(data);
    const insuranceGap = calculateInsuranceGap(data);

    return NextResponse.json({
      success: true,
      balanceSheet,
      timeline,
      insuranceGap,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process assessment" },
      { status: 500 }
    );
  }
}
