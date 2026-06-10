/**
 * Fuzzy string matching utility for company name matching
 * Uses Levenshtein distance algorithm
 */

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1)
 */
function similarityScore(str1: string, str2: string): number {
    const maxLen = Math.max(str1.length, str2.length);
    if (maxLen === 0) return 1;

    const distance = levenshteinDistance(str1, str2);
    return 1 - distance / maxLen;
}

/**
 * Normalize company name for matching
 * - Convert to lowercase
 * - Remove common suffixes (Ltd, LLC, Inc, Bank, etc.)
 * - Remove special characters
 * - Trim whitespace
 */
export function normalizeCompanyName(name: string): string {
    return name
        .toLowerCase()
        .replace(/\b(ltd|llc|inc|corp|corporation|limited|bank|group|company|co)\b/gi, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Extract company name from IPInfo org field
 * Format: "AS12345 Emirates NBD Bank" → "Emirates NBD"
 */
export function extractCompanyFromOrg(org: string): string {
    // Remove AS number prefix
    const withoutAS = org.replace(/^AS\d+\s+/i, '');

    // Normalize
    return normalizeCompanyName(withoutAS);
}

/**
 * Find best matching account by company name
 * Returns account if similarity > threshold (default 0.7)
 */
export async function findMatchingAccount(
    companyName: string,
    threshold: number = 0.7
): Promise<{ account: any; score: number } | null> {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
        const normalizedSearch = normalizeCompanyName(companyName);

        // Get all accounts
        const accounts = await prisma.account.findMany({
            select: {
                id: true,
                name: true,
                domain: true,
                industry: true,
                country: true,
            },
        });

        let bestMatch: { account: any; score: number } | null = null;

        for (const account of accounts) {
            const normalizedAccountName = normalizeCompanyName(account.name);
            const score = similarityScore(normalizedSearch, normalizedAccountName);

            if (score > threshold && (!bestMatch || score > bestMatch.score)) {
                bestMatch = { account, score };
            }
        }

        return bestMatch;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * Check if company name contains any of the account name keywords
 */
export function containsKeywords(companyName: string, accountName: string): boolean {
    const companyWords = normalizeCompanyName(companyName).split(' ');
    const accountWords = normalizeCompanyName(accountName).split(' ');

    // Check if at least 2 significant words match
    const matches = accountWords.filter(word =>
        word.length > 3 && companyWords.includes(word)
    );

    return matches.length >= 2;
}
