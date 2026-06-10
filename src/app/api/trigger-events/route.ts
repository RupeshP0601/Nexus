import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch last 20 trigger events, ordered by publishedAt descending
        const events = await prisma.triggerEvent.findMany({
            take: 20,
            orderBy: {
                publishedAt: 'desc',
            },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching trigger events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch trigger events' },
            { status: 500 }
        );
    }
}
