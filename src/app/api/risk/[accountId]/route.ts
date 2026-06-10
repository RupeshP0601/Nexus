import { NextResponse } from 'next/server';
import { runRiskAgent } from '@/lib/agents/riskAgent';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ accountId: string }> }
) {
    try {
        const { accountId } = await params;
        if (!accountId) {
            return NextResponse.json({ error: 'Missing accountId parameter' }, { status: 400 });
        }

        const riskAnalysis = await runRiskAgent(accountId);
        return NextResponse.json(riskAnalysis);
    } catch (error) {
        console.error('Error fetching deal risk analysis:', error);
        return NextResponse.json(
            { error: 'Failed to analyze deal risk profile', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
