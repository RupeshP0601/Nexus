import { PrismaClient } from '@prisma/client';
import { GeminiService } from '../ai/gemini';

const prisma = new PrismaClient();

export interface MeetingPrepPackage {
    meetingObjective: string;
    agenda: string[];
    discoveryQuestions: string[];
    possibleObjections: string[];
    objectionResponses: string[];
    nextSteps: string[];
}

/**
 * AI Meeting Prep Agent - Generates meeting briefing packages using Gemini
 */
export async function runMeetingPrepAgent(accountId: string): Promise<MeetingPrepPackage> {
    console.log(`🤖 Meeting Prep Agent: Gathering briefing data for account ${accountId}`);

    const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
            contacts: true,
            stakeholders: true,
            dossier: true,
            activities: {
                take: 5,
                orderBy: { performedAt: 'desc' },
            },
        },
    });

    if (!account) {
        throw new Error(`Account ${accountId} not found`);
    }

    const contactsList = account.contacts.map(c => `- ${c.name}, ${c.title}`).join('\n');
    const stakeholdersList = account.stakeholders.map(s => `- ${s.name}, ${s.title} (${s.role})`).join('\n');
    const activitiesList = account.activities.map(a => `- ${a.subject} (${a.type})`).join('\n');
    const dossierOverview = account.dossier?.overview || 'No dossier generated yet.';
    const dossierProposition = account.dossier?.valueProposition || 'No value proposition mapped.';

    const systemPrompt = `You are a Senior Executive Sales Coach at Afors, helping sales teams prepare for high-stakes enterprise discovery calls in the Middle East.
Synthesize the provided corporate history and intelligence to build a detailed meeting prep package in strict JSON.`;

    const userPrompt = `Generate Meeting Prep Package for:
Account: ${account.name}
Industry: ${account.industry}
Country: ${account.country}

AI Dossier Overview:
${dossierOverview}

Value Proposition:
${dossierProposition}

Key Contacts:
${contactsList || 'None mapped'}

Buying Committee:
${stakeholdersList || 'None mapped'}

Recent Touchpoints:
${activitiesList || 'No recent interactions'}

Return ONLY valid JSON in this exact structure:
{
  "meetingObjective": "Specific, actionable objective for this discovery session.",
  "agenda": [
    "Introduction & context (10 mins)",
    "Deep dive of challenge X (15 mins)"
  ],
  "discoveryQuestions": [
    "Strategic discovery question 1",
    "Technical question 2"
  ],
  "possibleObjections": [
    "Objection 1 related to budget or technology"
  ],
  "objectionResponses": [
    "Reframing strategy and response for Objection 1"
  ],
  "nextSteps": [
    "Next action 1",
    "Next action 2"
  ]
}`;

    console.log('🧠 Meeting Prep Agent: Triggering Gemini...');
    const resultText = await GeminiService.generateContent(`${systemPrompt}\n\n${userPrompt}`, { jsonMode: true });

    const prepPackage: MeetingPrepPackage = JSON.parse(resultText);
    return prepPackage;
}
