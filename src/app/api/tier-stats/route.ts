import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Get tier 1 accounts (Strategic)
        const tier1Accounts = await prisma.account.findMany({
            where: { tier: 1 },
            orderBy: { totalScore: 'desc' },
            take: 3,
        });

        const tier1Count = await prisma.account.count({ where: { tier: 1 } });
        const tier1Surging = await prisma.account.count({
            where: { tier: 1, isSurging: true }
        });
        const tier1SQLs = await prisma.account.count({
            where: { tier: 1, status: 'sql' }
        });
        const tier1Opportunities = await prisma.account.count({
            where: { tier: 1, status: 'opportunity' }
        });

        // Get tier 2 accounts (Scale)
        const tier2Accounts = await prisma.account.findMany({
            where: { tier: 2 },
            orderBy: { totalScore: 'desc' },
            take: 3,
        });

        const tier2Count = await prisma.account.count({ where: { tier: 2 } });
        const tier2Surging = await prisma.account.count({
            where: { tier: 2, isSurging: true }
        });
        const tier2SQLs = await prisma.account.count({
            where: { tier: 2, status: 'sql' }
        });
        const tier2Opportunities = await prisma.account.count({
            where: { tier: 2, status: 'opportunity' }
        });

        // Get tier 3 accounts (Programmatic)
        const tier3Accounts = await prisma.account.findMany({
            where: { tier: 3 },
            orderBy: { totalScore: 'desc' },
            take: 3,
        });

        const tier3Count = await prisma.account.count({ where: { tier: 3 } });
        const tier3Surging = await prisma.account.count({
            where: { tier: 3, isSurging: true }
        });
        const tier3SQLs = await prisma.account.count({
            where: { tier: 3, status: 'sql' }
        });
        const tier3Opportunities = await prisma.account.count({
            where: { tier: 3, status: 'opportunity' }
        });

        return NextResponse.json({
            tier1: {
                accounts: tier1Accounts,
                count: tier1Count,
                surging: tier1Surging,
                sqls: tier1SQLs,
                opportunities: tier1Opportunities,
            },
            tier2: {
                accounts: tier2Accounts,
                count: tier2Count,
                surging: tier2Surging,
                sqls: tier2SQLs,
                opportunities: tier2Opportunities,
            },
            tier3: {
                accounts: tier3Accounts,
                count: tier3Count,
                surging: tier3Surging,
                sqls: tier3SQLs,
                opportunities: tier3Opportunities,
            },
        });
    } catch (error) {
        console.error('Error fetching tier stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tier stats' },
            { status: 500 }
        );
    }
}
