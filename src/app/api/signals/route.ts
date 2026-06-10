import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');

        const signals = await prisma.signal.findMany({
            take: limit ? parseInt(limit) : 50,
            orderBy: { createdAt: 'desc' },
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                        industry: true,
                        country: true,
                    },
                },
            },
        });

        return NextResponse.json(signals);
    } catch (error) {
        console.error('Error fetching signals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch signals' },
            { status: 500 }
        );
    }
}
