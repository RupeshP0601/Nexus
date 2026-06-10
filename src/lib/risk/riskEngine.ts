import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RiskProfile {
    accountId: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    riskScore: number; // 0 to 100
    triggers: string[];
    details: {
        lastActivityDays: number | null;
        meetingsCount: number;
        stakeholderCount: number;
        isStagnantOpportunity: boolean;
        decliningEngagement: boolean;
    };
}

/**
 * Evaluates the deal risk of a target account
 */
export async function calculateDealRisk(accountId: string): Promise<RiskProfile> {
    const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
            activities: {
                orderBy: { performedAt: 'desc' },
            },
            signals: {
                orderBy: { createdAt: 'desc' },
            },
            stakeholders: true,
        },
    });

    if (!account) {
        throw new Error(`Account ${accountId} not found`);
    }

    const triggers: string[] = [];
    let riskScore = 0;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // 1. Activity Check
    const lastActivity = account.activities[0];
    const lastActivityDays = lastActivity 
        ? Math.ceil((now.getTime() - new Date(lastActivity.performedAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    if (lastActivityDays === null || lastActivityDays > 30) {
        triggers.push('No sales activity recorded in the last 30 days');
        riskScore += 40;
    } else if (lastActivityDays > 14) {
        triggers.push(`No sales activity in the last ${lastActivityDays} days`);
        riskScore += 15;
    }

    // 2. Meetings Check
    const meetings = account.activities.filter(
        (act) => act.type?.toLowerCase() === 'meeting' || act.type?.toLowerCase() === 'demo'
    );
    const meetingsCount = meetings.length;

    if (meetingsCount === 0) {
        triggers.push('No client meetings or product demos scheduled or completed');
        riskScore += 25;
    }

    // 3. Stagnant Opportunity Check
    const isOpportunity = account.status?.toLowerCase() === 'opportunity';
    let isStagnantOpportunity = false;

    if (isOpportunity) {
        const lastStageUpdate = account.updatedAt;
        const stageAgeDays = Math.ceil((now.getTime() - new Date(lastStageUpdate).getTime()) / (1000 * 60 * 60 * 24));
        if (stageAgeDays > 30) {
            isStagnantOpportunity = true;
            triggers.push(`Opportunity stuck in pipeline stage for over 30 days without progress`);
            riskScore += 30;
        }
    }

    // 4. Stakeholder Coverage Check (Buying Committee)
    const stakeholderCount = account.stakeholders.length;
    if (stakeholderCount === 0) {
        triggers.push('No stakeholders mapped to the buying committee');
        riskScore += 30;
    } else if (stakeholderCount < 2) {
        triggers.push('Single stakeholder coverage - high dependency risk');
        riskScore += 15;
    }

    // 5. Declining Engagement Check (Signals volume drops)
    const recentSignals = account.signals.filter((s) => new Date(s.createdAt) >= fourteenDaysAgo).length;
    const priorSignals = account.signals.filter(
        (s) => new Date(s.createdAt) >= thirtyDaysAgo && new Date(s.createdAt) < fourteenDaysAgo
    ).length;
    
    const decliningEngagement = recentSignals < priorSignals && priorSignals > 0;
    if (decliningEngagement) {
        triggers.push('Declining intent engagement: Activity signals dropped over the last 14 days');
        riskScore += 15;
    }

    // Cap Risk Score
    riskScore = Math.min(100, riskScore);

    // Determine Risk Level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (riskScore >= 60 || triggers.some(t => t.includes('30 days') && t.includes('activity'))) {
        riskLevel = 'High';
    } else if (riskScore >= 25) {
        riskLevel = 'Medium';
    }

    return {
        accountId,
        riskLevel,
        riskScore,
        triggers,
        details: {
            lastActivityDays,
            meetingsCount,
            stakeholderCount,
            isStagnantOpportunity,
            decliningEngagement,
        },
    };
}
