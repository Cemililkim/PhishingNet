import { promises as dns } from 'dns';
import type { SPFResult } from '@/lib/types';

/**
 * Check SPF record for a domain
 */
export async function checkSPF(domain: string, senderIP?: string): Promise<SPFResult> {
    try {
        const records = await dns.resolveTxt(domain);

        // Find SPF record
        const spfRecord = records
            .flat()
            .find(record => record.startsWith('v=spf1'));

        if (!spfRecord) {
            return {
                status: 'none',
                reason: 'No SPF record found for this domain',
            };
        }

        // Parse SPF record
        const mechanisms = parseSPFMechanisms(spfRecord);

        // If we have a sender IP, validate it against the SPF record
        if (senderIP) {
            const result = validateIPAgainstSPF(senderIP, mechanisms);
            return {
                ...result,
                record: spfRecord,
            };
        }

        // Without sender IP, we can only report that SPF exists
        return {
            status: 'neutral',
            record: spfRecord,
            reason: 'SPF record exists (IP validation requires email headers)',
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
                reason: 'No SPF record found',
            };
        }
        return {
            status: 'temperror',
            reason: `DNS lookup failed: ${(error as Error).message}`,
        };
    }
}

interface SPFMechanism {
    qualifier: '+' | '-' | '~' | '?';
    type: string;
    value?: string;
}

function parseSPFMechanisms(record: string): SPFMechanism[] {
    const mechanisms: SPFMechanism[] = [];
    const parts = record.split(/\s+/).slice(1); // Skip 'v=spf1'

    for (const part of parts) {
        let qualifier: SPFMechanism['qualifier'] = '+';
        let mechanism = part;

        if (['+', '-', '~', '?'].includes(part[0])) {
            qualifier = part[0] as SPFMechanism['qualifier'];
            mechanism = part.slice(1);
        }

        const colonIndex = mechanism.indexOf(':');
        const type = colonIndex > 0 ? mechanism.substring(0, colonIndex) : mechanism;
        const value = colonIndex > 0 ? mechanism.substring(colonIndex + 1) : undefined;

        mechanisms.push({ qualifier, type, value });
    }

    return mechanisms;
}

function validateIPAgainstSPF(
    ip: string,
    mechanisms: SPFMechanism[]
): Pick<SPFResult, 'status' | 'reason'> {
    // Simplified validation - in production, use a proper SPF library
    for (const mech of mechanisms) {
        if (mech.type === 'all') {
            switch (mech.qualifier) {
                case '+': return { status: 'pass', reason: 'Matched +all' };
                case '-': return { status: 'fail', reason: 'Matched -all (sender not authorized)' };
                case '~': return { status: 'softfail', reason: 'Matched ~all (soft fail)' };
                case '?': return { status: 'neutral', reason: 'Matched ?all (neutral)' };
            }
        }

        // For other mechanisms, we'd need IP matching logic
        // This is a simplified implementation
    }

    return { status: 'neutral', reason: 'No definitive match found' };
}

/**
 * Get SPF status description for UI
 */
export function getSPFStatusDescription(result: SPFResult): string {
    switch (result.status) {
        case 'pass':
            return 'Sender is authorized by the domain';
        case 'fail':
            return 'Sender is NOT authorized by the domain';
        case 'softfail':
            return 'Sender may not be authorized (soft fail)';
        case 'neutral':
            return 'Domain does not assert sender authorization';
        case 'none':
            return 'No SPF record configured';
        case 'permerror':
            return 'SPF record has configuration errors';
        case 'temperror':
            return 'Temporary DNS error during lookup';
        default:
            return 'Unknown SPF status';
    }
}
