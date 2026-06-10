import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateAccountScore } from '@/lib/scoring';

const prisma = new PrismaClient();

interface SignalPayload {
    accountId: string;
    type: 'intent' | 'firmographic' | 'contextual' | 'website_visit' | 'content_download';
    description: string;
    points: number;
    source: string;
    metadata?: Record<string, any>;
}

export async function POST(request: Request) {
    try {
        const payload: SignalPayload = await request.json();

        // Validate payload
        if (!payload.accountId || !payload.type || !payload.description || !payload.source) {
            return NextResponse.json(
                { error: 'Missing required fields: accountId, type, description, source' },
                { status: 400 }
            );
        }

        // Verify account exists
        const account = await prisma.account.findUnique({
            where: { id: payload.accountId },
        });

        if (!account) {
            return NextResponse.json(
                { error: `Account ${payload.accountId} not found` },
                { status: 404 }
            );
        }

        // Save signal
        const signal = await prisma.signal.create({
            data: {
                accountId: payload.accountId,
                type: payload.type,
                description: payload.description,
                source: payload.source,
                // Note: Prisma schema may need to be updated to include 'points' and 'metadata' fields
                // For now, we'll store them in the description or handle them separately
            },
        });

        console.log(`📡 Signal ingested: ${payload.type} for ${account.name}`);

        // Step 1: Recalculate account score
        const newScore = await calculateAccountScore(payload.accountId);

        // Step 2: Check if account should be marked as surging
        const signalCount = await prisma.signal.count({
            where: {
                accountId: payload.accountId,
                createdAt: {
                    gte: new Date(Date.now() - 48 * 60 * 60 * 1000), // Last 48 hours
                },
            },
        });

        const shouldSurge = newScore > 70 && signalCount >= 2;

        if (account.isSurging !== shouldSurge) {
            await prisma.account.update({
                where: { id: payload.accountId },
                data: { isSurging: shouldSurge },
            });

            if (shouldSurge) {
                console.log(`🔥 Account ${account.name} is now SURGING!`);
            }
        }

        // Step 3: Check if account crosses SQL threshold
        const previousScore = account.totalScore;
        const crossedSQLThreshold = previousScore <= 75 && newScore > 75;

        if (crossedSQLThreshold) {
            console.log(`🎯 Account ${account.name} crossed SQL threshold (${previousScore} → ${newScore})`);

            // Step 4: Create new Lead with 24-hour SLA
            const slaDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

            const lead = await prisma.lead.create({
                data: {
                    accountId: payload.accountId,
                    contactId: null, // Can be assigned later
                    source: 'intelligence_engine',
                    status: 'new',
                    score: newScore,
                    slaDeadline,
                },
            });

            console.log(`📋 Created SQL lead for ${account.name} with SLA deadline: ${slaDeadline.toISOString()}`);

            // TODO: Trigger SQL alert (email, Slack, etc.)
            // await sendSQLAlert(account, lead);

            return NextResponse.json({
                success: true,
                signal,
                account: {
                    id: account.id,
                    name: account.name,
                    score: newScore,
                    isSurging: shouldSurge,
                },
                sqlThresholdCrossed: true,
                lead: {
                    id: lead.id,
                    slaDeadline: lead.slaDeadline,
                },
            });
        }

        // Return success response
        return NextResponse.json({
            success: true,
            signal,
            account: {
                id: account.id,
                name: account.name,
                score: newScore,
                isSurging: shouldSurge,
            },
            sqlThresholdCrossed: false,
        });
    } catch (error) {
        console.error('Error ingesting signal:', error);
        return NextResponse.json(
            { error: 'Failed to ingest signal', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
