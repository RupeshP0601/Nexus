import { PrismaClient } from '@prisma/client';
import { GeminiService } from '../ai/gemini';

const prisma = new PrismaClient();

export interface Recommendation {
    description: string;
    scoreImpact: number;
    priority: 'high' | 'medium' | 'low';
    actionType: 'outreach' | 'meeting' | 'stakeholder' | 'content' | 'risk';
    rationale: string;
}

/**
 * AI Next Best Action Agent - Generates recommendations for accounts using Gemini
 */
export async function runNextBestActionAgent(accountId: string): Promise<Recommendation[]> {
    console.log(`🤖 Next Best Action Agent: Starting analysis for account ${accountId}`);

    const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
            contacts: true,
            stakeholders: true,
            activities: {
                take: 10,
                orderBy: { performedAt: 'desc' },
            },
            signals: {
                take: 10,
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!account) {
        throw new Error(`Account ${accountId} not found`);
    }

    const signalSummary = account.signals.map(s => `- ${s.description} (source: ${s.source})`).join('\n');
    const activitySummary = account.activities.map(a => `- ${a.subject} (type: ${a.type})`).join('\n');
    const stakeholderSummary = account.stakeholders.map(s => `- ${s.name}, ${s.title} (${s.role})`).join('\n');

    const systemPrompt = `You are a Sales AI Assistant specialized in GCC Enterprise Revenue Orchestration.
Evaluate the current account health, signals, buying committee stakeholders, and activity history to provide exactly 3 next best actions to advance the opportunity.`;

    const userPrompt = `Account: ${account.name}
Industry: ${account.industry}
Country: ${account.country}
Buying Stage (Status): ${account.status}
Account Health Score: ${account.totalScore} (Fit: ${account.fitScore}, Intent: ${account.intentScore}, Engagement: ${account.engagementScore})

Buying Committee Stakeholders:
${stakeholderSummary || 'None mapped'}

Recent Behavioral Signals:
${signalSummary || 'No recent signals'}

Recent Sales Activities:
${activitySummary || 'No recent activities'}

Return ONLY valid JSON in this exact structure:
{
  "recommendations": [
    {
      "description": "Specific action recommendation (e.g. Schedule a technical validation call with the Lead Cloud Architect)",
      "scoreImpact": 15,
      "priority": "high",
      "actionType": "outreach",
      "rationale": "Short explanation of why this action is selected."
    }
  ]
}`;

    console.log('🧠 Next Best Action Agent: Querying Gemini...');
    const resultText = await GeminiService.generateContent(`${systemPrompt}\n\n${userPrompt}`, { jsonMode: true });

    const data = JSON.parse(resultText);
    return data.recommendations || [];
}
