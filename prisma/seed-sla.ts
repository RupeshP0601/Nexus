import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with active SLA leads...');

    // Create contacts for leads
    const contacts = [
        {
            name: 'Ahmed Al-Mansoori',
            email: 'ahmed.almansoori@emiratesnbd.com',
            phone: '+971-4-316-0316',
            linkedinUrl: 'https://linkedin.com/in/ahmed-almansoori',
            accountId: (await prisma.account.findFirst({ where: { name: 'Emirates NBD' } }))!.id,
        },
        {
            name: 'Fahad Al-Rashid',
            email: 'fahad.alrashid@stc.com.sa',
            phone: '+966-11-455-0000',
            linkedinUrl: 'https://linkedin.com/in/fahad-alrashid',
            accountId: (await prisma.account.findFirst({ where: { name: 'Saudi Telecom Company (STC)' } }))!.id,
        },
        {
            name: 'Khalid Al-Thani',
            email: 'khalid.althani@qnb.com',
            phone: '+974-4440-7407',
            linkedinUrl: 'https://linkedin.com/in/khalid-althani',
            accountId: (await prisma.account.findFirst({ where: { name: 'Qatar National Bank' } }))!.id,
        },
    ];

    for (const contact of contacts) {
        await prisma.contact.create({
            data: contact,
        });
    }

    console.log(`✅ Created ${contacts.length} contacts`);

    // Create active leads with various SLA states
    const now = Date.now();

    const leads = [
        // CRITICAL - Inbound inquiry, 2 minutes remaining
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Emirates NBD' } }))!.id,
            contactId: (await prisma.contact.findFirst({ where: { email: 'ahmed.almansoori@emiratesnbd.com' } }))!.id,
            source: 'inbound',
            status: 'new',
            score: 95,
            slaDeadline: new Date(now + 2 * 60 * 1000), // 2 minutes from now
        },

        // WARNING - Inbound inquiry, 30 seconds remaining (< 10%)
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Mashreq Bank' } }))!.id,
            contactId: null,
            source: 'inbound',
            status: 'new',
            score: 82,
            slaDeadline: new Date(now + 30 * 1000), // 30 seconds from now
        },

        // AMBER - SQL, 6 hours remaining (25%)
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Saudi Telecom Company (STC)' } }))!.id,
            contactId: (await prisma.contact.findFirst({ where: { email: 'fahad.alrashid@stc.com.sa' } }))!.id,
            source: 'outbound',
            status: 'new',
            score: 89,
            slaDeadline: new Date(now + 6 * 60 * 60 * 1000), // 6 hours from now
        },

        // GREEN - MQL, 18 hours remaining (75%)
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Qatar National Bank' } }))!.id,
            contactId: (await prisma.contact.findFirst({ where: { email: 'khalid.althani@qnb.com' } }))!.id,
            source: 'website',
            status: 'new',
            score: 84,
            slaDeadline: new Date(now + 18 * 60 * 60 * 1000), // 18 hours from now
        },

        // GREEN - SQL, 20 hours remaining (83%)
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Mobily' } }))!.id,
            contactId: null,
            source: 'referral',
            status: 'new',
            score: 75,
            slaDeadline: new Date(now + 20 * 60 * 60 * 1000), // 20 hours from now
        },

        // BREACHED - Already past deadline
        {
            accountId: (await prisma.account.findFirst({ where: { name: 'Etisalat by e&' } }))!.id,
            contactId: null,
            source: 'inbound',
            status: 'new',
            score: 74,
            slaDeadline: new Date(now - 10 * 60 * 1000), // 10 minutes ago (breached)
        },
    ];

    for (const lead of leads) {
        await prisma.lead.create({
            data: lead,
        });
    }

    console.log(`✅ Created ${leads.length} active SLA leads`);
    console.log('   - 1 CRITICAL (2 min remaining)');
    console.log('   - 1 WARNING (30 sec remaining)');
    console.log('   - 1 AMBER (6 hours remaining)');
    console.log('   - 2 GREEN (18-20 hours remaining)');
    console.log('   - 1 BREACHED (already past deadline)');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
