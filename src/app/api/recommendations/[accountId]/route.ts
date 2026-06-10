import { NextResponse } from 'next/server';
import { runNextBestActionAgent } from '@/lib/agents/nextBestActionAgent';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ accountId: string }> }
) {
    try {
        const { accountId } = await params;
        if (!accountId) {
            return NextResponse.json({ error: 'Missing accountId parameter' }, { status: 400 });
        }

        const recommendations = await runNextBestActionAgent(accountId);
        return NextResponse.json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to generate recommendations', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
