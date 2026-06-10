import { NextResponse } from 'next/server';
import { runOutreachAgent, getOutreachSequence } from '@/lib/agents/outreachAgent';

// GET /api/accounts/[id]/draft-message?contactId=xyz - Retrieve current sequence drafts
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: accountId } = await params;
        const { searchParams } = new URL(request.url);
        const contactId = searchParams.get('contactId');

        if (!contactId) {
            return NextResponse.json({ error: 'Missing contactId query parameter' }, { status: 400 });
        }

        const sequence = await getOutreachSequence(accountId, contactId);
        return NextResponse.json(sequence);
    } catch (error) {
        console.error('Error fetching outreach sequence:', error);
        return NextResponse.json({ error: 'Failed to fetch sequence drafts' }, { status: 500 });
    }
}

// POST /api/accounts/[id]/draft-message - Generate a new multi-step sequence
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: accountId } = await params;
        const body = await request.json();
        const { contactId } = body;

        if (!contactId) {
            return NextResponse.json(
                { error: 'Missing required field: contactId' },
                { status: 400 }
            );
        }

        console.log(`🚀 Drafting multi-step outreach sequence for account ${accountId}, contact ${contactId}`);

        const sequenceSteps = await runOutreachAgent(accountId, contactId);

        return NextResponse.json({
            success: true,
            drafts: sequenceSteps,
        });
    } catch (error) {
        console.error('Error drafting outreach sequence:', error);
        return NextResponse.json(
            { error: 'Failed to draft outreach sequence', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
