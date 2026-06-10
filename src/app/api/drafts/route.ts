import { NextResponse } from 'next/server';
// import { getAccountDrafts, getDraft, updateDraftStatus } from '@/lib/agents/personalizationAgent'; // Disabled for demo mode

export async function GET(request: Request) {
    // Disabled for demo mode - use mock data in frontend
    return NextResponse.json(
        { error: 'This endpoint is disabled in demo mode. Use mock data from /agents/[id] page.' },
        { status: 501 }
    );

    /* Original code - disabled for demo mode
    try {
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('accountId');
        const draftId = searchParams.get('draftId');

        if (draftId) {
            // Get specific draft
            const draft = await getDraft(draftId);
            if (!draft) {
                return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
            }
            return NextResponse.json(draft);
        }

        if (accountId) {
            // Get all drafts for account
            const drafts = await getAccountDrafts(accountId);
            return NextResponse.json(drafts);
        }

        return NextResponse.json(
            { error: 'Missing accountId or draftId parameter' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error fetching drafts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch drafts' },
            { status: 500 }
        );
    }
    */
}

export async function PATCH(request: Request) {
    // Disabled for demo mode - use mock data in frontend
    return NextResponse.json(
        { error: 'This endpoint is disabled in demo mode. Use mock data from /agents/[id] page.' },
        { status: 501 }
    );

    /* Original code - disabled for demo mode
    try {
        const body = await request.json();
        const { draftId, status, editedBody } = body;

        if (!draftId || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: draftId, status' },
                { status: 400 }
            );
        }

        const updatedDraft = await updateDraftStatus(draftId, status, editedBody);

        return NextResponse.json({
            success: true,
            draft: updatedDraft,
        });
    } catch (error) {
        console.error('Error updating draft:', error);
        return NextResponse.json(
            { error: 'Failed to update draft' },
            { status: 500 }
        );
    }
    */
}
