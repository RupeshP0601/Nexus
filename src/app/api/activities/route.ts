import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const subject = searchParams.get('subject');

        const where: any = {};

        if (type) {
            where.type = type;
        }

        if (subject) {
            where.subject = {
                contains: subject,
            };
        }

        const activities = await prisma.activity.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}
