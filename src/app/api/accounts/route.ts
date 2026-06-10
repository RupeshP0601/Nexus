import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const surging = searchParams.get('surging');
        const limit = searchParams.get('limit');

        const where = surging === 'true' ? { isSurging: true } : {};
        const take = limit ? parseInt(limit) : undefined;

        const accounts = await prisma.account.findMany({
            where,
            take,
            orderBy: { totalScore: 'desc' },
            include: {
                signals: {
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - 48 * 60 * 60 * 1000), // Last 48 hours
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });

        return NextResponse.json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch accounts' },
            { status: 500 }
        );
    }
}
