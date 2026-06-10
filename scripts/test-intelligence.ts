/**
 * Test script for Intelligence Engine signal ingestion
 * 
 * This script demonstrates how to send signals to the Intelligence Engine
 * and trigger automated scoring, surge detection, and lead creation.
 * 
 * Usage:
 *   tsx scripts/test-intelligence.ts
 */

interface SignalPayload {
    accountId: string;
    type: 'intent' | 'firmographic' | 'contextual' | 'website_visit' | 'content_download';
    description: string;
    points: number;
    source: string;
    metadata?: Record<string, any>;
}

async function ingestSignal(signal: SignalPayload) {
    const response = await fetch('http://localhost:3000/api/intelligence/ingest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signal),
    });

    const data = await response.json();
    console.log('\n📡 Signal Ingestion Result:');
    console.log(JSON.stringify(data, null, 2));

    return data;
}

async function main() {
    console.log('🧪 Testing Intelligence Engine Signal Ingestion\n');

    // Example 1: Website visit signal (low points)
    console.log('Test 1: Website visit signal');
    await ingestSignal({
        accountId: 'REPLACE_WITH_ACTUAL_ACCOUNT_ID', // Get from Prisma Studio
        type: 'website_visit',
        description: 'Visited pricing page',
        points: 5,
        source: 'Website Analytics',
        metadata: {
            page: '/pricing',
            duration: 120,
        },
    });

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Example 2: Content download signal (medium points)
    console.log('\nTest 2: Content download signal');
    await ingestSignal({
        accountId: 'REPLACE_WITH_ACTUAL_ACCOUNT_ID',
        type: 'content_download',
        description: 'Downloaded whitepaper: "RevOps Best Practices"',
        points: 10,
        source: 'Marketing Automation',
        metadata: {
            asset: 'revops-whitepaper.pdf',
            campaign: 'Q1-2026-BFSI',
        },
    });

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Example 3: High-intent signal (should trigger surge and possibly SQL threshold)
    console.log('\nTest 3: High-intent demo request signal');
    await ingestSignal({
        accountId: 'REPLACE_WITH_ACTUAL_ACCOUNT_ID',
        type: 'intent',
        description: 'Requested product demo',
        points: 20,
        source: 'Website Form',
        metadata: {
            formId: 'demo-request',
            urgency: 'high',
            budget: '$500K+',
        },
    });

    console.log('\n✅ Test complete! Check the API responses above for:');
    console.log('   - Updated account scores');
    console.log('   - Surge status changes');
    console.log('   - SQL threshold crossing');
    console.log('   - Automated lead creation');
}

main().catch(console.error);
