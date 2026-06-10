import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ScoreBreakdown {
    totalScore: number;
    fitScore: number;
    intentScore: number;
    engagementScore: number;
    buyingStageScore: number;
    breakdown: {
        industry: number;
        country: number;
        contactLevel: number;
        revenue: number;
        recentSignals: number;
        activitiesCount: number;
        buyingStagePoints: number;
    };
    explanation: string[];
}

/**
 * Calculate Fit Score (max 100)
 */
export function calculateFitScoreValue(account: any): { score: number; industry: number; country: number; contactLevel: number; revenue: number; explanations: string[] } {
    let score = 0;
    let industryPoints = 0;
    let countryPoints = 0;
    let contactLevelPoints = 0;
    let revenuePoints = 0;
    const explanations: string[] = [];

    // 1. Industry Check (max 20)
    if (account.industry === 'BFSI' || account.industry === 'Telecom') {
        industryPoints = 20;
        score += 20;
        explanations.push(`Target industry fit: ${account.industry} (+20 pts)`);
    } else {
        explanations.push(`Non-target industry: ${account.industry || 'Unknown'} (0 pts)`);
    }

    // 2. Country Check (max 20)
    if (account.country === 'UAE' || account.country === 'KSA') {
        countryPoints = 20;
        score += 20;
        explanations.push(`Target GCC region: ${account.country} (+20 pts)`);
    } else if (account.country) {
        countryPoints = 5;
        score += 5;
        explanations.push(`Secondary GCC region: ${account.country} (+5 pts)`);
    }

    // 3. Contact Level Check (max 30)
    const contacts = account.contacts || [];
    const hasCLevel = contacts.some((contact: any) => {
        const title = contact.title?.toUpperCase() || '';
        return (
            title.includes('CFO') ||
            title.includes('CTO') ||
            title.includes('CRO') ||
            title.includes('CEO') ||
            title.includes('CHIEF') ||
            title.includes('DIRECTOR') ||
            title.includes('VP')
        );
    });

    if (hasCLevel) {
        contactLevelPoints = 30;
        score += 30;
        explanations.push('Decision-maker coverage: C-level, VP, or Director contact identified (+30 pts)');
    } else if (contacts.length > 0) {
        contactLevelPoints = 10;
        score += 10;
        explanations.push('Basic contact coverage: Mid-level contact present (+10 pts)');
    } else {
        explanations.push('No contact coverage: No contacts mapped (0 pts)');
    }

    // 4. Revenue Check (max 30)
    if (account.revenue && account.revenue >= 1000000000) {
        revenuePoints = 30;
        score += 30;
        explanations.push(`High enterprise revenue: >$1B (+30 pts)`);
    } else if (account.revenue && account.revenue >= 100000000) {
        revenuePoints = 15;
        score += 15;
        explanations.push(`Mid enterprise revenue: >$100M (+15 pts)`);
    } else if (account.revenue) {
        revenuePoints = 5;
        score += 5;
        explanations.push(`SME revenue tier (+5 pts)`);
    }

    return { score, industry: industryPoints, country: countryPoints, contactLevel: contactLevelPoints, revenue: revenuePoints, explanations };
}

/**
 * Calculate Intent Score (max 100)
 */
export function calculateIntentScoreValue(signals: any[]): { score: number; recentSignals: number; explanations: string[] } {
    const explanations: string[] = [];
    
    const signalPoints = signals.reduce((sum, signal) => {
        let points = (signal as any).points || 5;
        const type = signal.type?.toLowerCase() || '';
        const source = signal.source?.toLowerCase() || '';

        if (source === '6sense' || type === 'intent') {
            points = 20;
        } else if (type === 'content_download') {
            points = 15;
        } else if (type === 'website_visit') {
            points = 8;
        }
        return sum + points;
    }, 0);

    const score = Math.min(100, signalPoints);
    
    if (score >= 80) {
        explanations.push(`Surging buying intent: ${signals.length} dynamic signals in last 30 days (+${score} pts)`);
    } else if (score >= 30) {
        explanations.push(`Moderate buying intent: ${signals.length} signals in last 30 days (+${score} pts)`);
    } else if (score > 0) {
        explanations.push(`Low intent activity: ${signals.length} signal(s) in last 30 days (+${score} pts)`);
    } else {
        explanations.push('No intent activity detected in the last 30 days (0 pts)');
    }

    return { score, recentSignals: score, explanations };
}

/**
 * Calculate Engagement Score (max 100)
 */
export function calculateEngagementScoreValue(activities: any[]): { score: number; count: number; explanations: string[] } {
    const explanations: string[] = [];
    
    const engagementPoints = activities.reduce((sum, act) => {
        let points = 5;
        const type = act.type?.toLowerCase() || '';
        
        if (type === 'proposal') {
            points = 35;
        } else if (type === 'demo') {
            points = 25;
        } else if (type === 'meeting') {
            points = 20;
        } else if (type === 'call') {
            points = 10;
        } else if (type === 'email') {
            points = 5;
        }
        return sum + points;
    }, 0);

    const score = Math.min(100, engagementPoints);

    if (score >= 75) {
        explanations.push(`Deep sales engagement: ${activities.length} interactions including high-value meetings or proposals (+${score} pts)`);
    } else if (score >= 30) {
        explanations.push(`Steady sales engagement: ${activities.length} customer touchpoints recorded (+${score} pts)`);
    } else if (score > 0) {
        explanations.push(`Initial engagement: ${activities.length} touchpoint(s) in last 30 days (+${score} pts)`);
    } else {
        explanations.push('No engagement history in the last 30 days (0 pts)');
    }

    return { score, count: score, explanations };
}

/**
 * Calculate Buying Stage Score (max 100)
 */
export function calculateBuyingStageScoreValue(status: string): { score: number; explanations: string[] } {
    const explanations: string[] = [];
    let score = 10;
    const cleanStatus = status?.toLowerCase() || 'nurture';

    if (cleanStatus === 'opportunity') {
        score = 100;
        explanations.push('Active Opportunity: Near-closing buying stage (+100 pts)');
    } else if (cleanStatus === 'sql') {
        score = 80;
        explanations.push('Sales Qualified Lead (SQL) stage (+80 pts)');
    } else if (cleanStatus === 'mql') {
        score = 50;
        explanations.push('Marketing Qualified Lead (MQL) stage (+50 pts)');
    } else if (cleanStatus === 'nurture') {
        score = 20;
        explanations.push('Nurture stage (+20 pts)');
    } else {
        explanations.push('Initial stage (+10 pts)');
    }

    return { score, explanations };
}

/**
 * Calculate comprehensive account score and update DB
 */
export async function calculateAccountScore(accountId: string): Promise<number> {
    const breakdown = await getAccountScoreBreakdown(accountId);

    // Update account scores in the database
    await prisma.account.update({
        where: { id: accountId },
        data: {
            fitScore: breakdown.fitScore,
            intentScore: breakdown.intentScore,
            engagementScore: breakdown.engagementScore,
            buyingStageScore: breakdown.buyingStageScore,
            totalScore: breakdown.totalScore,
        },
    });

    console.log(`📊 Account ${accountId} scored: ${breakdown.totalScore} (Fit: ${breakdown.fitScore}, Intent: ${breakdown.intentScore}, Engagement: ${breakdown.engagementScore}, Stage: ${breakdown.buyingStageScore})`);

    return breakdown.totalScore;
}

/**
 * Get detailed score breakdown and explanations for an account
 */
export async function getAccountScoreBreakdown(accountId: string): Promise<ScoreBreakdown> {
    const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
            contacts: true,
            activities: {
                where: {
                    performedAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                    },
                },
            },
            signals: {
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                    },
                },
            },
        },
    });

    if (!account) {
        throw new Error(`Account ${accountId} not found`);
    }

    const fitResult = calculateFitScoreValue(account);
    const intentResult = calculateIntentScoreValue(account.signals);
    const engagementResult = calculateEngagementScoreValue(account.activities);
    const stageResult = calculateBuyingStageScoreValue(account.status);

    // Calculate weighted average
    const totalScore = Math.round(
        (fitResult.score * 0.40) +
        (intentResult.score * 0.35) +
        (engagementResult.score * 0.15) +
        (stageResult.score * 0.10)
    );

    const explanation = [
        ...fitResult.explanations,
        ...intentResult.explanations,
        ...engagementResult.explanations,
        ...stageResult.explanations,
    ];

    return {
        totalScore,
        fitScore: fitResult.score,
        intentScore: intentResult.score,
        engagementScore: engagementResult.score,
        buyingStageScore: stageResult.score,
        breakdown: {
            industry: fitResult.industry,
            country: fitResult.country,
            contactLevel: fitResult.contactLevel,
            revenue: fitResult.revenue,
            recentSignals: intentResult.recentSignals,
            activitiesCount: account.activities.length,
            buyingStagePoints: stageResult.score,
        },
        explanation,
    };
}
