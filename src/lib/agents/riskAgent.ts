import { calculateDealRisk, RiskProfile } from '../risk/riskEngine';
import { GeminiService } from '../ai/gemini';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AIRiskAnalysis extends RiskProfile {
    executiveSummary: string;
    mitigationStrategy: string;
}

/**
 * AI Risk Agent - Combines mathematical risk engine with AI analysis using Gemini
 */
export async function runRiskAgent(accountId: string): Promise<AIRiskAnalysis> {
    console.log(`🤖 Risk Agent: Starting risk assessment for account ${accountId}`);

    // Compute mathematical risks
    const rawRiskProfile = await calculateDealRisk(accountId);

    // If there are no triggers, return low risk summary directly without AI overhead
    if (rawRiskProfile.triggers.length === 0) {
        return {
            ...rawRiskProfile,
            executiveSummary: "This account exhibits high engagement, consistent communications, and complete stakeholder alignment. No deal risks detected.",
            mitigationStrategy: "Maintain current progression momentum. Continue regular check-ins and prepare the proposal draft."
        };
    }

    // Fetch account details to enrich AI prompt context
    const account = await prisma.account.findUnique({
        where: { id: accountId },
    });

    const accountName = account?.name || 'Target Account';

    const systemPrompt = `You are a Revenue Operations Director and Deal Risk Coach at Afors.
Analyze the calculated risk triggers and output a strategic narrative and specific mitigation playbook.`;

    const userPrompt = `Account: ${accountName}
Status: ${account?.status}
Calculated Risk Level: ${rawRiskProfile.riskLevel} (Score: ${rawRiskProfile.riskScore}/100)

Calculated Risk Triggers:
${rawRiskProfile.triggers.map(t => `- ${t}`).join('\n')}

Return ONLY valid JSON in this exact structure:
{
  "executiveSummary": "1-2 sentences summarizing why this deal is threatened.",
  "mitigationStrategy": "1-2 sentences detailing the immediate strategic action to mitigate these risks."
}`;

    console.log('🧠 Risk Agent: Requesting AI narrative from Gemini...');
    const resultText = await GeminiService.generateContent(`${systemPrompt}\n\n${userPrompt}`, { jsonMode: true });

    const aiResponse = JSON.parse(resultText);

    return {
        ...rawRiskProfile,
        executiveSummary: aiResponse.executiveSummary || 'Deal is at risk due to lack of recent activities and low buying committee coverage.',
        mitigationStrategy: aiResponse.mitigationStrategy || 'Immediately schedule an executive touchpoint and identify additional stakeholders.'
    };
}
