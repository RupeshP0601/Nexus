import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: leadId } = await params;

        // Get lead
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                account: true,
            },
        });

        if (!lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        // Log breach in Activity table
        await prisma.activity.create({
            data: {
                accountId: lead.accountId,
                type: 'email',
                subject: `SLA BREACH: Lead ${leadId}`,
                description: `SLA deadline breached at ${new Date().toISOString()}. Original deadline: ${lead.slaDeadline ? lead.slaDeadline.toISOString() : 'N/A'}`,
                performedBy: 'System',
            },
        });

        // Update lead status to indicate breach
        await prisma.lead.update({
            where: { id: leadId },
            data: {
                // Could add a 'breached' flag if schema supports it
                // For now, we'll just log the activity
            },
        });

        // TODO: Trigger escalation (email, Slack notification, etc.)
        console.log(`🚨 SLA BREACH: Lead ${leadId} for account ${lead.account.name}`);

        return NextResponse.json({
            leadId,
            breached: true,
            breachedAt: new Date(),
            accountName: lead.account.name,
        });
    } catch (error) {
        console.error('Error logging breach:', error);
        return NextResponse.json(
            { error: 'Failed to log breach' },
            { status: 500 }
        );
    }
}
