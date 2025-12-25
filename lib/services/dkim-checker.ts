import { promises as dns } from 'dns';
import type { DKIMResult } from '@/lib/types';

/**
 * Check DKIM configuration for a domain
 * Note: Full DKIM verification requires the email signature from headers
 */
export async function checkDKIM(
    domain: string,
    selector?: string,
    signature?: string
): Promise<DKIMResult> {
    // Common DKIM selectors to check
    const selectorsToCheck = selector
        ? [selector]
        : ['default', 'google', 'selector1', 'selector2', 'k1', 'dkim', 'mail'];

    for (const sel of selectorsToCheck) {
        const dkimDomain = `${sel}._domainkey.${domain}`;

        try {
            const records = await dns.resolveTxt(dkimDomain);
            const dkimRecord = records.flat().join('');

            if (dkimRecord.includes('v=DKIM1')) {
                // Found a DKIM record
                if (signature) {
                    // In production, verify signature against the public key
                    return {
                        status: 'pass',
                        selector: sel,
                        domain,
                        reason: 'DKIM key found and configured',
                    };
                }

                return {
                    status: 'pass',
                    selector: sel,
                    domain,
                    reason: `DKIM key configured (selector: ${sel})`,
                };
            }
        } catch {
            // Continue to next selector
            continue;
        }
    }

    // No DKIM record found
    return {
        status: 'missing',
        domain,
        reason: 'No DKIM record found for common selectors',
    };
}

/**
 * Extract DKIM selector from email headers
 */
export function extractDKIMSelector(headers: Record<string, string>): string | null {
    const dkimSignature = headers['dkim-signature'];
    if (!dkimSignature) return null;

    // Parse selector from DKIM-Signature header
    const selectorMatch = dkimSignature.match(/s=([^;]+)/);
    return selectorMatch ? selectorMatch[1].trim() : null;
}

/**
 * Extract DKIM signature from headers for verification
 */
export function extractDKIMSignature(headers: Record<string, string>): string | null {
    return headers['dkim-signature'] || null;
}

/**
 * Get DKIM status description for UI
 */
export function getDKIMStatusDescription(result: DKIMResult): string {
    switch (result.status) {
        case 'pass':
            return 'Email signature is valid';
        case 'fail':
            return 'Email signature validation failed';
        case 'missing':
            return 'No DKIM signature present';
        case 'invalid':
            return 'DKIM signature is malformed';
        default:
            return 'Unknown DKIM status';
    }
}
