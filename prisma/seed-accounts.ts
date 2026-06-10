import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with sample accounts and leads...');

    // Sample accounts across all tiers
    const accounts = [
        // Tier 1: Strategic
        {
            name: 'Emirates NBD',
            domain: 'emiratesnbd.com',
            industry: 'BFSI',
            country: 'UAE',
            revenue: 12500000000,
            tier: 1,
            fitScore: 95,
            intentScore: 88,
            totalScore: 92,
            status: 'sql',
            isSurging: true,
        },
        {
            name: 'Saudi Telecom Company (STC)',
            domain: 'stc.com.sa',
            industry: 'Telecom',
            country: 'KSA',
            revenue: 15800000000,
            tier: 1,
            fitScore: 92,
            intentScore: 85,
            totalScore: 89,
            status: 'opportunity',
            isSurging: true,
        },
        {
            name: 'First Abu Dhabi Bank',
            domain: 'fab.ae',
            industry: 'BFSI',
            country: 'UAE',
            revenue: 18200000000,
            tier: 1,
            fitScore: 90,
            intentScore: 82,
            totalScore: 86,
            status: 'sql',
            isSurging: false,
        },
        {
            name: 'Qatar National Bank',
            domain: 'qnb.com',
            industry: 'BFSI',
            country: 'Qatar',
            revenue: 14500000000,
            tier: 1,
            fitScore: 88,
            intentScore: 80,
            totalScore: 84,
            status: 'mql',
            isSurging: true,
        },

        // Tier 2: Scale
        {
            name: 'Mashreq Bank',
            domain: 'mashreq.com',
            industry: 'BFSI',
            country: 'UAE',
            revenue: 3200000000,
            tier: 2,
            fitScore: 82,
            intentScore: 75,
            totalScore: 79,
            status: 'sql',
            isSurging: false,
        },
        {
            name: 'Mobily',
            domain: 'mobily.com.sa',
            industry: 'Telecom',
            country: 'KSA',
            revenue: 4100000000,
            tier: 2,
            fitScore: 78,
            intentScore: 72,
            totalScore: 75,
            status: 'opportunity',
            isSurging: true,
        },
        {
            name: 'Etisalat by e&',
            domain: 'etisalat.ae',
            industry: 'Telecom',
            country: 'UAE',
            revenue: 13500000000,
            tier: 2,
            fitScore: 80,
            intentScore: 68,
            totalScore: 74,
            status: 'mql',
            isSurging: false,
        },
        {
            name: 'Commercial Bank of Dubai',
            domain: 'cbd.ae',
            industry: 'BFSI',
            country: 'UAE',
            revenue: 1800000000,
            tier: 2,
            fitScore: 75,
            intentScore: 65,
            totalScore: 70,
            status: 'nurture',
            isSurging: false,
        },
        {
            name: 'Zain Group',
            domain: 'zain.com',
            industry: 'Telecom',
            country: 'Kuwait',
            revenue: 4500000000,
            tier: 2,
            fitScore: 72,
            intentScore: 62,
            totalScore: 67,
            status: 'sql',
            isSurging: true,
        },

        // Tier 3: Programmatic
        {
            name: 'National Bank of Bahrain',
            domain: 'nbbonline.com',
            industry: 'BFSI',
            country: 'Bahrain',
            revenue: 850000000,
            tier: 3,
            fitScore: 65,
            intentScore: 58,
            totalScore: 62,
            status: 'mql',
            isSurging: false,
        },
        {
            name: 'Omantel',
            domain: 'omantel.om',
            industry: 'Telecom',
            country: 'Oman',
            revenue: 1200000000,
            tier: 3,
            fitScore: 60,
            intentScore: 55,
            totalScore: 58,
            status: 'nurture',
            isSurging: false,
        },
        {
            name: 'Ahli United Bank',
            domain: 'ahliunited.com',
            industry: 'BFSI',
            country: 'Bahrain',
            revenue: 920000000,
            tier: 3,
            fitScore: 58,
            intentScore: 52,
            totalScore: 55,
            status: 'nurture',
            isSurging: false,
        },
        {
            name: 'Ooredoo Qatar',
            domain: 'ooredoo.qa',
            industry: 'Telecom',
            country: 'Qatar',
            revenue: 2800000000,
            tier: 3,
            fitScore: 62,
            intentScore: 48,
            totalScore: 55,
            status: 'mql',
            isSurging: true,
        },
        {
            name: 'Bank Muscat',
            domain: 'bankmuscat.com',
            industry: 'BFSI',
            country: 'Oman',
            revenue: 1100000000,
            tier: 3,
            fitScore: 55,
            intentScore: 45,
            totalScore: 50,
            status: 'nurture',
            isSurging: false,
        },
    ];

    for (const account of accounts) {
        await prisma.account.create({
            data: account,
        });
    }

    console.log(`✅ Created ${accounts.length} accounts`);

    // Create some sample leads for funnel stats
    const leads = [
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Emirates NBD' } }))!.id,
            contactId: null,
            source: 'website',
            status: 'qualified',
            score: 92,
            slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Saudi Telecom Company (STC)' } }))!.id,
            contactId: null,
            source: 'referral',
            status: 'won',
            score: 89,
            slaDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Mashreq Bank' } }))!.id,
            contactId: null,
            source: 'event',
            status: 'qualified',
            score: 79,
            slaDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Mobily' } }))!.id,
            contactId: null,
            source: 'outbound',
            status: 'won',
            score: 75,
            slaDeadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
    ];

    for (const lead of leads) {
        await prisma.lead.create({
            data: lead,
        });
    }

    console.log(`✅ Created ${leads.length} leads`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
