/**
 * Cost Allocation API
 * Get cost breakdown by subscription tier
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateCostAllocation, getTotalMonthlySpend } from '@/lib/utils/cost-monitoring';

export async function GET(request: NextRequest) {
  try {
    const allocation = await calculateCostAllocation();
    const totalSpend = await getTotalMonthlySpend(new Date());

    // Calculate pricing impact
    const tierPricing = {
      free: 0,
      pro: 999 / 12, // $999/year = ~$83/month
      school: 2999 / 12, // $2999/year = ~$250/month
    };

    const profitabilityAnalysis = allocation.map((tier) => {
      const pricingPerUser = tierPricing[tier.tier as keyof typeof tierPricing] || 0;
      const costPerUser = tier.costPerUser;
      const margin = pricingPerUser - costPerUser;
      const marginPercent = pricingPerUser > 0 ? (margin / pricingPerUser) * 100 : 0;

      return {
        ...tier,
        pricing: pricingPerUser,
        profitMargin: margin,
        profitMarginPercent: marginPercent,
        sustainable: margin > 0,
      };
    });

    return NextResponse.json({
      allocation,
      totalSpend,
      profitability: profitabilityAnalysis,
      summary: {
        totalAllocated: allocation.reduce((sum, a) => sum + a.allocatedCost, 0),
        costPerUser: totalSpend / 1000, // Assuming ~1000 total users
        mostProfitable: profitabilityAnalysis.reduce((max, a) =>
          a.profitMarginPercent > max.profitMarginPercent ? a : max
        ),
      },
    });
  } catch (error) {
    console.error('Allocation error:', error);
    return NextResponse.json({ error: 'Failed to fetch allocation' }, { status: 500 });
  }
}
