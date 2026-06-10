import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractCompanyFromOrg, findMatchingAccount } from '@/lib/fuzzy-match';

const prisma = new PrismaClient();

interface VisitorPayload {
    ip: string;
    page: string;
    userAgent: string;
    timestamp: string;
}

interface IPInfoResponse {
    ip: string;
    hostname?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    org?: string;
    postal?: string;
    timezone?: string;
    company?: {
        name: string;
        domain: string;
        type: string;
    };
}

// Page-based point scoring
const PAGE_POINTS: Record<string, number> = {
    '/pricing': 20,
    '/case-studies': 15,
    '/compliance': 15,
    '/contact': 25,
    '/demo': 25,
    '/features': 10,
    '/about': 5,
};

export async function POST(request: Request) {
    try {
        const payload: VisitorPayload = await request.json();

        // Validate payload
        if (!payload.ip || !payload.page) {
            return NextResponse.json(
                { error: 'Missing required fields: ip, page' },
                { status: 400 }
            );
        }

        console.log(`👁️ Visitor tracking: ${payload.ip} visited ${payload.page}`);

        // Step 1: Call IPInfo API
        const ipinfoToken = process.env.IPINFO_TOKEN;
        if (!ipinfoToken) {
            console.warn('⚠️ IPINFO_TOKEN not configured, skipping IP lookup');
            return NextResponse.json({
                matched: false,
                accountName: null,
                signalCreated: false,
                error: 'IPInfo token not configured',
            });
        }

        const ipinfoUrl = `https://ipinfo.io/${payload.ip}?token=${ipinfoToken}`;
        const ipinfoResponse = await fetch(ipinfoUrl);

        if (!ipinfoResponse.ok) {
            console.error('❌ IPInfo API error:', ipinfoResponse.statusText);
            return NextResponse.json({
                matched: false,
                accountName: null,
                signalCreated: false,
                error: 'IPInfo API error',
            });
        }

        const ipinfo: IPInfoResponse = await ipinfoResponse.json();

        // Step 2: Extract company name from org field
        if (!ipinfo.org) {
            console.log('ℹ️ No organization data from IPInfo');

            // Log unmatched visitor
            await logUnmatchedVisitor(payload, ipinfo, 'No org data');

            return NextResponse.json({
                matched: false,
                accountName: null,
                signalCreated: false,
                reason: 'No organization data',
            });
        }

        const companyName = extractCompanyFromOrg(ipinfo.org);
        console.log(`🏢 Extracted company: ${companyName} from ${ipinfo.org}`);

        // Step 3: Try to match against existing accounts
        const match = await findMatchingAccount(companyName);

        if (!match) {
            console.log(`❌ No account match found for: ${companyName}`);

            // Log unmatched visitor for manual review
            await logUnmatchedVisitor(payload, ipinfo, 'No account match');

            return NextResponse.json({
                matched: false,
                accountName: null,
                signalCreated: false,
                companyName,
                reason: 'No matching account',
            });
        }

        console.log(`✅ Matched to account: ${match.account.name} (score: ${match.score.toFixed(2)})`);

        // Step 4: Create signal for matched account
        const points = PAGE_POINTS[payload.page] || 5;

        const signal = await prisma.signal.create({
            data: {
                accountId: match.account.id,
                type: 'website_visit',
                description: `Visited: ${payload.page}`,
                source: 'website',
            },
        });

        console.log(`📡 Signal created for ${match.account.name}: ${points} points`);

        // Trigger signal ingestion workflow (score recalculation, surge detection, etc.)
        // This could be done via internal API call or direct function call
        try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/intelligence/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId: match.account.id,
                    type: 'website_visit',
                    description: `Visited: ${payload.page}`,
                    points,
                    source: 'website',
                    metadata: {
                        ip: maskIP(payload.ip),
                        userAgent: payload.userAgent,
                        city: ipinfo.city,
                        country: ipinfo.country,
                    },
                }),
            });
        } catch (error) {
            console.error('Error triggering signal ingestion:', error);
        }

        return NextResponse.json({
            matched: true,
            accountName: match.account.name,
            accountId: match.account.id,
            signalCreated: true,
            points,
            matchScore: match.score,
        });
    } catch (error) {
        console.error('Error tracking visitor:', error);
        return NextResponse.json(
            { error: 'Failed to track visitor', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

/**
 * Log unmatched visitor for manual review
 */
async function logUnmatchedVisitor(
    payload: VisitorPayload,
    ipinfo: IPInfoResponse,
    reason: string
) {
    try {
        console.log(`📝 Unmatched visitor: ${ipinfo.org || 'Unknown'} (Reason: ${reason}, IP: ${payload.ip}, Page: ${payload.page})`);
    } catch (error) {
        console.error('Error logging unmatched visitor:', error);
    }
}

/**
 * Mask IP address for privacy (show only first 2 octets)
 */
function maskIP(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.xxx.xxx`;
    }
    return 'xxx.xxx.xxx.xxx';
}
