import { NextResponse } from 'next/server';
import { runMeetingPrepAgent } from '@/lib/agents/meetingPrepAgent';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('accountId');

        if (!accountId) {
            return NextResponse.json({ error: 'Missing accountId query parameter' }, { status: 400 });
        }

        const prepBriefing = await runMeetingPrepAgent(accountId);
        return NextResponse.json(prepBriefing);
    } catch (error) {
        console.error('Error compiling meeting prep package:', error);
        return NextResponse.json(
            { error: 'Failed to generate meeting prep briefing', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
