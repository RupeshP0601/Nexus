import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const accountId = params.id;

        const contacts = await prisma.contact.findMany({
            where: { accountId },
            orderBy: [
                { isPrimary: 'desc' },
                { createdAt: 'asc' },
            ],
        });

        return NextResponse.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
}
