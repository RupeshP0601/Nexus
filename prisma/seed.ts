import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with trigger events...');

    const sampleEvents = [
        {
            headline: 'UAE Central Bank mandates ISO 20022 migration by Q4 2025',
            category: 'regulatory',
            sector: 'BFSI',
            country: 'UAE',
            source: 'UAE Central Bank',
            url: 'https://centralbank.ae/announcements/iso20022',
            publishedAt: new Date('2026-02-17T10:30:00Z'),
        },
        {
            headline: 'STC Group announces AED 2B edge computing infrastructure tender',
            category: 'tender',
            sector: 'Telecom',
            country: 'KSA',
            source: 'STC Group',
            url: 'https://stc.com.sa/tenders/edge-computing',
            publishedAt: new Date('2026-02-17T09:15:00Z'),
        },
        {
            headline: 'Emirates NBD completes cloud-native core banking migration',
            category: 'funding',
            sector: 'BFSI',
            country: 'UAE',
            source: 'Emirates NBD',
            url: 'https://emiratesnbd.com/news/cloud-migration',
            publishedAt: new Date('2026-02-16T14:20:00Z'),
        },
        {
            headline: 'Mobily appoints new Chief Digital Officer',
            category: 'executive_change',
            sector: 'Telecom',
            country: 'KSA',
            source: 'Mobily',
            url: 'https://mobily.com.sa/news/cdo-appointment',
            publishedAt: new Date('2026-02-16T11:45:00Z'),
        },
        {
            headline: 'Saudi Arabia removed from FATF Gray List — compliance requirements intensify',
            category: 'regulatory',
            sector: 'BFSI',
            country: 'KSA',
            source: 'FATF',
            url: 'https://fatf-gafi.org/countries/saudi-arabia',
            publishedAt: new Date('2026-02-15T16:00:00Z'),
        },
        {
            headline: 'Qatar Financial Centre launches digital banking framework',
            category: 'regulatory',
            sector: 'BFSI',
            country: 'Qatar',
            source: 'QFC',
            url: 'https://qfc.qa/digital-banking-framework',
            publishedAt: new Date('2026-02-15T08:30:00Z'),
        },
        {
            headline: 'Etisalat by e& wins $500M 5G network expansion contract',
            category: 'tender',
            sector: 'Telecom',
            country: 'UAE',
            source: 'Etisalat',
            url: 'https://etisalat.ae/5g-expansion',
            publishedAt: new Date('2026-02-14T13:00:00Z'),
        },
        {
            headline: 'First Abu Dhabi Bank raises $1.2B in green bonds',
            category: 'funding',
            sector: 'BFSI',
            country: 'UAE',
            source: 'FAB',
            url: 'https://fab.ae/green-bonds',
            publishedAt: new Date('2026-02-14T10:15:00Z'),
        },
        {
            headline: 'Zain Group appoints former Vodafone exec as new CEO',
            category: 'executive_change',
            sector: 'Telecom',
            country: 'Kuwait',
            source: 'Zain Group',
            url: 'https://zain.com/ceo-appointment',
            publishedAt: new Date('2026-02-13T15:30:00Z'),
        },
        {
            headline: 'Bahrain Central Bank introduces real-time payments mandate',
            category: 'regulatory',
            sector: 'BFSI',
            country: 'Bahrain',
            source: 'CBB',
            url: 'https://cbb.gov.bh/real-time-payments',
            publishedAt: new Date('2026-02-13T09:00:00Z'),
        },
    ];

    for (const event of sampleEvents) {
        await prisma.triggerEvent.create({
            data: event,
        });
    }

    console.log(`✅ Created ${sampleEvents.length} trigger events`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
