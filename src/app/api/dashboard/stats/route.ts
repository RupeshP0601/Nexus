import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateDealRisk } from '@/lib/risk/riskEngine';
import { calculateAccountScore } from '@/lib/scoring';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        // Fetch all accounts
        const accounts = await prisma.account.findMany({
            include: {
                activities: true,
                stakeholders: true,
                signals: true,
            },
        });

        // Compute scores and risk levels for all accounts
        const riskProfiles = await Promise.all(
            accounts.map(async (acc) => {
                // Ensure health scores are up-to-date in memory/DB
                await calculateAccountScore(acc.id);
                return await calculateDealRisk(acc.id);
            })
        );

        // Fetch re-calculated accounts (with updated scores)
        const updatedAccounts = await prisma.account.findMany();

        // 1. Calculate Card KPI Metrics
        const accountsAtRiskCount = riskProfiles.filter((p) => p.riskLevel === 'Medium' || p.riskLevel === 'High').length;
        const hotAccountsCount = updatedAccounts.filter((a) => a.totalScore >= 80 || a.isSurging).length;
        const opportunitiesCreated = updatedAccounts.filter((a) => a.status === 'opportunity').length;
        
        // Count meetings scheduled/completed
        const totalMeetingsCount = accounts.reduce((sum, acc) => {
            const meetings = acc.activities.filter(
                (act) => act.type?.toLowerCase() === 'meeting' || act.type?.toLowerCase() === 'demo'
            );
            return sum + meetings.length;
        }, 0);

        // Calculate Pipeline Value (sum of revenue for accounts in 'opportunity' or 'sql' stage)
        const pipelineValueSum = updatedAccounts
            .filter((a) => a.status === 'opportunity' || a.status === 'sql')
            .reduce((sum, a) => sum + (a.revenue || 0), 0);

        // Format pipeline value to millions/billions for UI display
        const pipelineValueStr = pipelineValueSum >= 1000000000 
            ? `$${(pipelineValueSum / 1000000000).toFixed(1)}B`
            : `$${(pipelineValueSum / 1000000).toFixed(1)}M`;

        // 2. Funnel Conversion counts
        const funnelConversion = {
            nurture: updatedAccounts.filter((a) => a.status === 'nurture').length,
            mql: updatedAccounts.filter((a) => a.status === 'mql').length,
            sql: updatedAccounts.filter((a) => a.status === 'sql').length,
            opportunity: updatedAccounts.filter((a) => a.status === 'opportunity').length,
        };

        // 3. Tier Distribution
        const tierDistribution = {
            tier1: updatedAccounts.filter((a) => a.tier === 1).length,
            tier2: updatedAccounts.filter((a) => a.tier === 2).length,
            tier3: updatedAccounts.filter((a) => a.tier === 3).length,
        };

        // 4. Risk Distribution
        const riskDistribution = {
            low: riskProfiles.filter((p) => p.riskLevel === 'Low').length,
            medium: riskProfiles.filter((p) => p.riskLevel === 'Medium').length,
            high: riskProfiles.filter((p) => p.riskLevel === 'High').length,
        };

        // 5. Score Distribution
        const scoreDistribution = {
            low: updatedAccounts.filter((a) => a.totalScore < 50).length,
            medium: updatedAccounts.filter((a) => a.totalScore >= 50 && a.totalScore < 75).length,
            high: updatedAccounts.filter((a) => a.totalScore >= 75 && a.totalScore < 90).length,
            critical: updatedAccounts.filter((a) => a.totalScore >= 90).length,
        };

        return NextResponse.json({
            kpis: {
                accountsAtRisk: accountsAtRiskCount,
                hotAccounts: hotAccountsCount,
                opportunitiesCreated,
                meetingsScheduled: totalMeetingsCount,
                pipelineValue: pipelineValueStr,
                pipelineRawValue: pipelineValueSum,
            },
            funnelConversion,
            tierDistribution,
            riskDistribution,
            scoreDistribution,
        });
    } catch (error) {
        console.error('Error generating dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed to generate dashboard statistics', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
