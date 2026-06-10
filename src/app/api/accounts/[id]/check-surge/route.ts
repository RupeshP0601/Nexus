import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const accountId = params.id;

        // Get account
        const account = await prisma.account.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            return NextResponse.json(
                { error: 'Account not found' },
                { status: 404 }
            );
        }

        // Count signals in last 48 hours
        const signalCount = await prisma.signal.count({
            where: {
                accountId,
                createdAt: {
                    gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
                },
            },
        });

        // Surge logic: totalScore > 70 AND at least 2 signals in last 48 hours
        const shouldSurge = account.totalScore > 70 && signalCount >= 2;

        // Update account if surge status changed
        if (account.isSurging !== shouldSurge) {
            await prisma.account.update({
                where: { id: accountId },
                data: { isSurging: shouldSurge },
            });
        }

        return NextResponse.json({
            accountId,
            isSurging: shouldSurge,
            totalScore: account.totalScore,
            signalCount,
            threshold: {
                scoreRequired: 70,
                signalsRequired: 2,
            },
        });
    } catch (error) {
        console.error('Error checking surge:', error);
        return NextResponse.json(
            { error: 'Failed to check surge status' },
            { status: 500 }
        );
    }
}
