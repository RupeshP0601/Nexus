import { PrismaClient } from '@prisma/client';
import { GeminiService } from '../ai/gemini';

const prisma = new PrismaClient();

export interface DossierV2Data {
    overview: string;
    businessChallenges: string[];
    growthInitiatives: string[];
    technologyLandscape: string[];
    painPoints: string[];
    competitiveRisks: string[];
    solutionPositioning: string;
    stakeholderMapping: Array<{
        role: 'Champion' | 'DecisionMaker' | 'Influencer' | 'TechnicalEvaluator' | 'Procurement';
        title: string;
        strategy: string;
    }>;
    nextBestActions: string[];
}

/**
 * AI Research Agent V2 - Generates V2 dossiers for accounts using Gemini
 */
export async function runDossierAgent(accountId: string): Promise<DossierV2Data> {
    console.log(`🤖 Dossier Agent V2: Starting analysis for account ${accountId}`);

    const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
            contacts: true,
            stakeholders: true,
            signals: {
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!account) {
        throw new Error(`Account ${accountId} not found`);
    }

    const signalSummary = account.signals
        .map((s) => `- [${s.source}] ${s.description} (Type: ${s.type})`)
        .join('\n');

    const contactSummary = account.contacts
        .map((c) => `- ${c.name}, ${c.title || 'No Title'} (${c.email || 'No Email'})`)
        .join('\n');

    const stakeholderSummary = account.stakeholders
        .map((s) => `- ${s.name}, ${s.title} (Role: ${s.role})`)
        .join('\n');

    const systemPrompt = `You are a Principal Sales Strategy Analyst at Afors, a premier B2B tech consulting firm specializing in BFSI and Telecom digital transformation in the Middle East.

Afors specializes in:
- Cloud migrations & mainframe modernizations
- Digital banking framework solutions
- Custom software development & API orchestration
- Security, automated compliance checking, and risk mitigation
- 5G infrastructure enablement & Telecom edge computing

Analyze the target company details and behavioral signals to generate an in-depth corporate dossier in strict JSON format. Focus specifically on challenges Afors can solve. Ensure actions are specific and strategies are highly tailored.`;

    const userPrompt = `Generate a detailed Dossier V2 for:
Account: ${account.name}
Industry: ${account.industry}
Country: ${account.country}
Revenue: ${account.revenue ? `$${(account.revenue / 1000000000).toFixed(2)}B` : 'Unknown'}
Tier: Tier ${account.tier}

Mapped Contacts:
${contactSummary || 'None mapped'}

Buying Committee Stakeholders:
${stakeholderSummary || 'None mapped'}

Recent Behavioral & Market Signals (Last 30 days):
${signalSummary || 'No recent signals recorded'}

Return ONLY valid JSON in this exact structure:
{
  "overview": "2-3 sentences company overview and digital maturity assessment.",
  "businessChallenges": ["Challenge 1", "Challenge 2", "Challenge 3"],
  "growthInitiatives": ["Initiative 1", "Initiative 2"],
  "technologyLandscape": ["Tech 1", "Tech 2"],
  "painPoints": ["Pain Point 1", "Pain Point 2", "Pain Point 3"],
  "competitiveRisks": ["Risk 1", "Risk 2"],
  "solutionPositioning": "Paragraph explaining exactly how Afors positions its services to address these challenges.",
  "stakeholderMapping": [
    {
      "role": "Champion",
      "title": "Job Title (e.g., Head of Digital)",
      "strategy": "Engagement strategy for this role."
    }
  ],
  "nextBestActions": ["Action 1", "Action 2", "Action 3"]
}`;

    console.log('🧠 Dossier Agent V2: Dispatching Gemini generation...');
    const resultText = await GeminiService.generateContent(`${systemPrompt}\n\n${userPrompt}`, { jsonMode: true });
    
    // Parse result
    const dossierData: DossierV2Data = JSON.parse(resultText);

    // Save V2 Dossier to the database
    // We update all properties on the upsert record
    const mockPainPointArray = dossierData.painPoints;
    const messageAngle = dossierData.nextBestActions[0] || 'Schedule technical discovery';
    const targetStakeholder = dossierData.stakeholderMapping[0]?.title || 'Chief Technology Officer';

    await prisma.dossier.upsert({
        where: { accountId },
        update: {
            overview: dossierData.overview,
            businessChallenges: dossierData.businessChallenges,
            growthInitiatives: dossierData.growthInitiatives,
            technologyLandscape: dossierData.technologyLandscape,
            painPoints: mockPainPointArray,
            competitiveRisks: dossierData.competitiveRisks,
            solutionPositioning: dossierData.solutionPositioning,
            stakeholderMapping: dossierData.stakeholderMapping as any,
            nextBestActions: dossierData.nextBestActions,
            valueProposition: dossierData.solutionPositioning,
            messageAngle: messageAngle,
            targetStakeholder: targetStakeholder,
            isStale: false,
            updatedAt: new Date(),
        },
        create: {
            accountId,
            overview: dossierData.overview,
            businessChallenges: dossierData.businessChallenges,
            growthInitiatives: dossierData.growthInitiatives,
            technologyLandscape: dossierData.technologyLandscape,
            painPoints: mockPainPointArray,
            competitiveRisks: dossierData.competitiveRisks,
            solutionPositioning: dossierData.solutionPositioning,
            stakeholderMapping: dossierData.stakeholderMapping as any,
            nextBestActions: dossierData.nextBestActions,
            valueProposition: dossierData.solutionPositioning,
            messageAngle: messageAngle,
            targetStakeholder: targetStakeholder,
            isStale: false,
        },
    });

    // Automatically transition account status to SQL when dossier is generated
    await prisma.account.update({
        where: { id: accountId },
        data: { status: 'sql' },
    });

    console.log(`💾 Dossier V2 saved successfully for account: ${account.name}`);
    return dossierData;
}
