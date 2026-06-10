import { PrismaClient } from '@prisma/client';
import { GeminiService } from '../ai/gemini';

const prisma = new PrismaClient();

export interface SequenceStep {
    stepNumber: number;
    stepName: string;
    channel: 'email' | 'linkedin';
    subjectLine?: string;
    body: string;
}

export interface OutreachSequence {
    coldEmail: { subjectLine: string; body: string };
    linkedInMessage: { body: string };
    followUpEmail1: { subjectLine: string; body: string };
    followUpEmail2: { subjectLine: string; body: string };
    breakupEmail: { subjectLine: string; body: string };
}

/**
 * AI Outreach Agent V2 - Generates multi-step outreach sequences using Gemini
 */
export async function runOutreachAgent(accountId: string, contactId: string): Promise<SequenceStep[]> {
    console.log(`🤖 Outreach Agent: Drafting multi-step sequence for account ${accountId}, contact ${contactId}`);

    const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
            dossier: true,
        },
    });

    if (!account) {
        throw new Error(`Account ${accountId} not found`);
    }

    if (!account.dossier) {
        throw new Error(`No dossier found for account ${accountId}. Please generate a dossier first.`);
    }

    const contact = await prisma.contact.findUnique({
        where: { id: contactId },
    });

    if (!contact) {
        throw new Error(`Contact ${contactId} not found`);
    }

    const systemPrompt = `You are a Principal Outbound Personalization Specialist at Afors.
You draft highly tailored, high-converting outreach sequences for executives in the Middle East.
Maintain a professional, conversational tone, avoid corporate buzzwords, write concise emails, and reference value propositions specific to their regional challenges.`;

    const userPrompt = `Draft a 5-step outreach sequence targeting:
Contact Name: ${contact.name}
Title: ${contact.title}
Company: ${account.name}
Industry: ${account.industry}
GCC Region: ${account.country}

AI Dossier Context:
Overview: ${account.dossier.overview}
Value Proposition: ${account.dossier.valueProposition}
Pain Point Angle: ${account.dossier.messageAngle}

Generate exactly the following sequence in strict JSON format:
1. Cold Email: Highly personalized, short (< 120 words), direct soft CTA.
2. LinkedIn Connection Message: Genuine connection message (< 300 characters, no sales pitches).
3. Follow-up Email 1: Reference a trend/additional context, short (< 100 words).
4. Follow-up Email 2: Focus on a specific capability/offering, short (< 100 words).
5. Breakup Email: Polite, short, closing the loop.

Return ONLY valid JSON in this exact structure:
{
  "coldEmail": {
    "subjectLine": "string",
    "body": "string"
  },
  "linkedInMessage": {
    "body": "string"
  },
  "followUpEmail1": {
    "subjectLine": "string",
    "body": "string"
  },
  "followUpEmail2": {
    "subjectLine": "string",
    "body": "string"
  },
  "breakupEmail": {
    "subjectLine": "string",
    "body": "string"
  }
}`;

    console.log('🧠 Outreach Agent: Triggering sequence draft from Gemini...');
    const resultText = await GeminiService.generateContent(`${systemPrompt}\n\n${userPrompt}`, { jsonMode: true });

    const sequence: OutreachSequence = JSON.parse(resultText);

    // Format into sequence steps
    const steps: SequenceStep[] = [
        {
            stepNumber: 1,
            stepName: 'Cold Email',
            channel: 'email',
            subjectLine: sequence.coldEmail.subjectLine,
            body: sequence.coldEmail.body,
        },
        {
            stepNumber: 2,
            stepName: 'LinkedIn Connection',
            channel: 'linkedin',
            body: sequence.linkedInMessage.body,
        },
        {
            stepNumber: 3,
            stepName: 'Follow-up Email #1',
            channel: 'email',
            subjectLine: sequence.followUpEmail1.subjectLine,
            body: sequence.followUpEmail1.body,
        },
        {
            stepNumber: 4,
            stepName: 'Follow-up Email #2',
            channel: 'email',
            subjectLine: sequence.followUpEmail2.subjectLine,
            body: sequence.followUpEmail2.body,
        },
        {
            stepNumber: 5,
            stepName: 'Breakup Email',
            channel: 'email',
            subjectLine: sequence.breakupEmail.subjectLine,
            body: sequence.breakupEmail.body,
        },
    ];

    // Transactionally clear old drafts and insert new sequence steps
    await prisma.$transaction([
        prisma.draftMessage.deleteMany({
            where: { accountId, contactId },
        }),
        ...steps.map((step) =>
            prisma.draftMessage.create({
                data: {
                    accountId,
                    contactId,
                    channel: step.channel,
                    subjectLine: step.subjectLine || null,
                    body: step.body,
                    stepNumber: step.stepNumber,
                    stepName: step.stepName,
                    status: 'draft',
                },
            })
        ),
    ]);

    console.log(`💾 Outreach sequence (5 steps) successfully created and saved for ${contact.name}`);
    return steps;
}

/**
 * Retrieve current sequence drafts for an account/contact
 */
export async function getOutreachSequence(accountId: string, contactId: string): Promise<any[]> {
    return await prisma.draftMessage.findMany({
        where: { accountId, contactId },
        orderBy: { stepNumber: 'asc' },
    });
}
