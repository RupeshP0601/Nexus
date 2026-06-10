import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/stakeholders/[id] - Retrieve a single stakeholder
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const stakeholder = await prisma.stakeholder.findUnique({
            where: { id },
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

        if (!stakeholder) {
            return NextResponse.json({ error: 'Stakeholder not found' }, { status: 404 });
        }

        return NextResponse.json(stakeholder);
    } catch (error) {
        console.error('Error fetching stakeholder:', error);
        return NextResponse.json({ error: 'Failed to fetch stakeholder' }, { status: 500 });
    }
}

// PUT /api/stakeholders/[id] - Update a stakeholder
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, title, email, role } = body;

        // Check if stakeholder exists
        const existing = await prisma.stakeholder.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Stakeholder not found' }, { status: 404 });
        }

        // Update
        const updated = await prisma.stakeholder.update({
            where: { id },
            data: {
                name: name !== undefined ? name : undefined,
                title: title !== undefined ? title : undefined,
                email: email !== undefined ? email : undefined,
                role: role !== undefined ? role : undefined,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating stakeholder:', error);
        return NextResponse.json({ error: 'Failed to update stakeholder' }, { status: 500 });
    }
}

// DELETE /api/stakeholders/[id] - Delete a stakeholder
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check if stakeholder exists
        const existing = await prisma.stakeholder.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Stakeholder not found' }, { status: 404 });
        }

        // Delete
        await prisma.stakeholder.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Stakeholder deleted successfully' });
    } catch (error) {
        console.error('Error deleting stakeholder:', error);
        return NextResponse.json({ error: 'Failed to delete stakeholder' }, { status: 500 });
    }
}
