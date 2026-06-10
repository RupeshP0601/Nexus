import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const orderBy = searchParams.get('orderBy');

        const where = status ? { status } : {};
        const order = orderBy === 'slaDeadline'
            ? { slaDeadline: 'asc' as const }
            : { createdAt: 'desc' as const };

        const leads = await prisma.lead.findMany({
            where,
            orderBy: order,
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                        industry: true,
                        country: true,
                    },
                },
                contact: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        linkedinUrl: true,
                    },
                },
            },
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}
