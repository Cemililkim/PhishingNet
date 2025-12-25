import { promises as dns } from 'dns';
import type { DMARCResult } from '@/lib/types';

/**
 * Check DMARC record for a domain
 */
export async function checkDMARC(domain: string): Promise<DMARCResult> {
    const dmarcDomain = `_dmarc.${domain}`;

    try {
        const records = await dns.resolveTxt(dmarcDomain);
        const dmarcRecord = records.flat().find(r => r.startsWith('v=DMARC1'));

        if (!dmarcRecord) {
            return {
                status: 'none',
                reason: 'No DMARC record found',
            };
        }

        // Parse DMARC record
        const policy = extractDMARCPolicy(dmarcRecord);

        return {
            status: policy === 'none' ? 'none' : 'pass',
            policy,
            record: dmarcRecord,
            reason: getDMARCPolicyDescription(policy),
        };

    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOTFOUND') {
            return {
                status: 'none',
                reason: 'Domain does not exist',
            };
        }
        if ((error as NodeJS.ErrnoException).code === 'ENODATA') {
            return {
                status: 'none',
                reason: 'No DMARC record configured',
            };
        }
        return {
            status: 'none',
            reason: `DNS lookup failed: ${(error as Error).message}`,
        };
    }
}

/**
 * Extract policy from DMARC record
 */
function extractDMARCPolicy(record: string): string {
    const policyMatch = record.match(/p=([^;]+)/);
    return policyMatch ? policyMatch[1].trim().toLowerCase() : 'none';
}

/**
 * Get human-readable description of DMARC policy
 */
function getDMARCPolicyDescription(policy: string): string {
    switch (policy) {
        case 'reject':
            return 'Strict policy: Reject unauthorized emails';
        case 'quarantine':
            return 'Moderate policy: Quarantine suspicious emails';
        case 'none':
            return 'Monitoring only: No enforcement';
        default:
            return `Policy: ${policy}`;
    }
}

/**
 * Extract DMARC details for UI display
 */
export function parseDMARCRecord(record: string): {
    policy: string;
    subdomainPolicy?: string;
    percentage?: number;
    reportEmail?: string;
} {
    const policy = record.match(/p=([^;]+)/)?.[1]?.trim();
    const sp = record.match(/sp=([^;]+)/)?.[1]?.trim();
    const pct = record.match(/pct=([^;]+)/)?.[1]?.trim();
    const rua = record.match(/rua=([^;]+)/)?.[1]?.trim();

    return {
        policy: policy || 'none',
        subdomainPolicy: sp,
        percentage: pct ? parseInt(pct, 10) : undefined,
        reportEmail: rua?.replace('mailto:', ''),
    };
}

/**
 * Get DMARC status description for UI
 */
export function getDMARCStatusDescription(result: DMARCResult): string {
    if (result.status === 'none' || !result.policy) {
        return 'No DMARC policy configured - domain is vulnerable';
    }

    switch (result.policy) {
        case 'reject':
            return 'Strong protection - unauthorized emails are rejected';
        case 'quarantine':
            return 'Moderate protection - suspicious emails are quarantined';
        case 'none':
            return 'Weak protection - monitoring only, no enforcement';
        default:
            return `DMARC policy: ${result.policy}`;
    }
}
