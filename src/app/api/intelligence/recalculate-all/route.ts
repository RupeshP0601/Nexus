import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateAccountScore } from '@/lib/scoring';

const prisma = new PrismaClient();

export async function POST() {
    try {
        console.log('🔄 Starting bulk score recalculation...');

        // Get all accounts
        const accounts = await prisma.account.findMany({
            select: { id: true, name: true },
        });

        let successCount = 0;
        let errorCount = 0;

        // Recalculate score for each account
        for (const account of accounts) {
            try {
                await calculateAccountScore(account.id);
                successCount++;
            } catch (error) {
                console.error(`Error calculating score for ${account.name}:`, error);
                errorCount++;
            }
        }

        console.log(`✅ Recalculation complete: ${successCount} success, ${errorCount} errors`);

        return NextResponse.json({
            success: true,
            total: accounts.length,
            successCount,
            errorCount,
        });
    } catch (error) {
        console.error('Error recalculating scores:', error);
        return NextResponse.json(
            { error: 'Failed to recalculate scores' },
            { status: 500 }
        );
    }
}
