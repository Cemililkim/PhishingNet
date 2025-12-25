import type { SecurityChecks, DomainInfo } from '@/lib/types';
import { checkSPF } from './spf-checker';
import { checkDKIM, extractDKIMSelector } from './dkim-checker';
import { checkDMARC } from './dmarc-checker';

export interface DNSCheckOptions {
    domain: string;
    senderIP?: string;
    headers?: Record<string, string>;
}

export interface DNSCheckResult {
    checks: SecurityChecks;
    domainInfo: Partial<DomainInfo>;
}

/**
 * Run all DNS security checks in parallel
 */
export async function runDNSChecks(options: DNSCheckOptions): Promise<DNSCheckResult> {
    const { domain, senderIP, headers } = options;

    // Extract DKIM selector from headers if available
    const dkimSelector = headers ? extractDKIMSelector(headers) : undefined;

    // Run all checks in parallel for speed
    const [spfResult, dkimResult, dmarcResult] = await Promise.all([
        checkSPF(domain, senderIP),
        checkDKIM(domain, dkimSelector || undefined),
        checkDMARC(domain),
    ]);

    return {
        checks: {
            spf: spfResult,
            dkim: dkimResult,
            dmarc: dmarcResult,
        },
        domainInfo: {
            domain,
            isLookalike: checkLookalikeDomain(domain),
            similarTo: findSimilarDomain(domain),
        },
    };
}

// Common brand domains to check for lookalikes
const KNOWN_BRANDS = [
    'paypal.com',
    'amazon.com',
    'apple.com',
    'microsoft.com',
    'google.com',
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'netflix.com',
    'spotify.com',
    'linkedin.com',
    'dropbox.com',
    'chase.com',
    'wellsfargo.com',
    'bankofamerica.com',
    'citibank.com',
    'usps.com',
    'fedex.com',
    'ups.com',
    'dhl.com',
];

/**
 * Check if domain is a potential lookalike of known brands
 */
export function checkLookalikeDomain(domain: string): boolean {
    const normalized = domain.toLowerCase();

    for (const brand of KNOWN_BRANDS) {
        if (normalized === brand) continue; // Exact match is not a lookalike

        const brandName = brand.split('.')[0];

        // Check for common lookalike patterns
        if (
            normalized.includes(brandName) ||
            calculateLevenshteinDistance(normalized.split('.')[0], brandName) <= 2
        ) {
            return true;
        }
    }

    return false;
}

/**
 * Find the most similar known domain
 */
export function findSimilarDomain(domain: string): string | undefined {
    const normalized = domain.toLowerCase().split('.')[0];
    let minDistance = Infinity;
    let closestBrand: string | undefined;

    for (const brand of KNOWN_BRANDS) {
        const brandName = brand.split('.')[0];
        const distance = calculateLevenshteinDistance(normalized, brandName);

        if (distance < minDistance && distance <= 3 && normalized !== brandName) {
            minDistance = distance;
            closestBrand = brand;
        }
    }

    return closestBrand;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function calculateLevenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
