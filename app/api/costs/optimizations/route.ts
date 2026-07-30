/**
 * Cost Optimizations API
 * Get cost optimization recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateOptimizationRecommendations } from '@/lib/cost-monitoring';

export async function GET(request: NextRequest) {
  try {
    const recommendations = await generateOptimizationRecommendations();
    const totalPotential = recommendations.reduce(
      (sum, r) => sum + r.estimatedMonthlySavings,
      0
    );

    // Group by difficulty
    const byDifficulty = {
      easy: recommendations.filter((r) => r.implementationDifficulty === 'easy'),
      medium: recommendations.filter((r) => r.implementationDifficulty === 'medium'),
      hard: recommendations.filter((r) => r.implementationDifficulty === 'hard'),
    };

    // Sort by savings potential
    const sorted = [...recommendations].sort(
      (a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings
    );

    return NextResponse.json({
      recommendations: sorted,
      totalMonthlySavings: totalPotential,
      count: recommendations.length,
      byDifficulty: {
        easy: {
          count: byDifficulty.easy.length,
          savings: byDifficulty.easy.reduce((sum, r) => sum + r.estimatedMonthlySavings, 0),
        },
        medium: {
          count: byDifficulty.medium.length,
          savings: byDifficulty.medium.reduce((sum, r) => sum + r.estimatedMonthlySavings, 0),
        },
        hard: {
          count: byDifficulty.hard.length,
          savings: byDifficulty.hard.reduce((sum, r) => sum + r.estimatedMonthlySavings, 0),
        },
      },
      yearlyPotential: totalPotential * 12,
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: 'Failed to fetch optimizations' }, { status: 500 });
  }
}
