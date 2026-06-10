import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/stakeholders - List stakeholders (optional accountId query filter)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('accountId');

        const where = accountId ? { accountId } : {};
        const stakeholders = await prisma.stakeholder.findMany({
            where,
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(stakeholders);
    } catch (error) {
        console.error('Error fetching stakeholders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stakeholders' },
            { status: 500 }
        );
    }
}

// POST /api/stakeholders - Create a new stakeholder
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, title, email, role, accountId } = body;

        if (!name || !title || !email || !role || !accountId) {
            return NextResponse.json(
                { error: 'Missing required fields: name, title, email, role, accountId' },
                { status: 400 }
            );
        }

        // Verify account exists
        const account = await prisma.account.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            return NextResponse.json(
                { error: `Account with ID ${accountId} not found` },
                { status: 404 }
            );
        }

        // Create stakeholder
        const stakeholder = await prisma.stakeholder.create({
            data: {
                name,
                title,
                email,
                role,
                accountId,
            },
        });

        return NextResponse.json(stakeholder, { status: 201 });
    } catch (error) {
        console.error('Error creating stakeholder:', error);
        return NextResponse.json(
            { error: 'Failed to create stakeholder', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
