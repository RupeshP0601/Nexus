import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Get funnel stats by counting accounts at each stage
        const tracked = await prisma.account.count();
        const mql = await prisma.account.count({
            where: { status: 'mql' }
        });
        const sql = await prisma.account.count({
            where: { status: 'sql' }
        });
        const opportunity = await prisma.account.count({
            where: { status: 'opportunity' }
        });

        // Count leads that converted to deals (assuming Lead has a status field)
        const deals = await prisma.lead.count({
            where: { status: 'won' }
        });

        // Calculate conversion percentages
        const funnelData = [
            {
                stage: 'Tracked',
                count: tracked,
                percentage: 100,
            },
            {
                stage: 'MQL',
                count: mql,
                percentage: tracked > 0 ? Math.round((mql / tracked) * 100) : 0,
            },
            {
                stage: 'SQL',
                count: sql,
                percentage: mql > 0 ? Math.round((sql / mql) * 100) : 0,
            },
            {
                stage: 'Opportunity',
                count: opportunity,
                percentage: sql > 0 ? Math.round((opportunity / sql) * 100) : 0,
            },
            {
                stage: 'Deal',
                count: deals,
                percentage: opportunity > 0 ? Math.round((deals / opportunity) * 100) : 0,
            },
        ];

        return NextResponse.json(funnelData);
    } catch (error) {
        console.error('Error fetching funnel stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch funnel stats' },
            { status: 500 }
        );
    }
}
