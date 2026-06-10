import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: accountId } = await params;
        if (!accountId) {
            return NextResponse.json({ error: 'Missing account ID' }, { status: 400 });
        }

        const dossier = await prisma.dossier.findUnique({
            where: { accountId },
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                        industry: true,
                        country: true,
                        totalScore: true,
                        fitScore: true,
                        intentScore: true,
                        engagementScore: true,
                        buyingStageScore: true,
                    },
                },
            },
        });

        if (!dossier) {
            return NextResponse.json(
                { error: 'Dossier not found for this account' },
                { status: 404 }
            );
        }

        return NextResponse.json(dossier);
    } catch (error) {
        console.error('Error fetching dossier:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dossier' },
            { status: 500 }
        );
    }
}
