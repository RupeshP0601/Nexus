import { NextResponse } from 'next/server';
import { runDossierAgent } from '@/lib/agents/dossierAgent';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: accountId } = await params;
        if (!accountId) {
            return NextResponse.json({ error: 'Missing account ID' }, { status: 400 });
        }

        console.log(`🚀 Triggering research agent V2 for account ${accountId}`);

        const dossierData = await runDossierAgent(accountId);

        return NextResponse.json({
            success: true,
            dossier: dossierData,
        });
    } catch (error) {
        console.error('Error running research agent V2:', error);
        return NextResponse.json(
            { error: 'Failed to generate dossier V2', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
