import { simpleParser, ParsedMail } from 'mailparser';
import { z } from 'zod';

// Validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const domainSchema = z.string().regex(
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/,
    'Invalid domain format'
);

export interface ParsedEmail {
    email: string;
    localPart: string;
    domain: string;
    isValid: boolean;
}

export interface ParsedEml {
    from: string;
    fromDomain: string;
    to: string[];
    subject: string;
    date?: Date;
    messageId?: string;
    headers: Record<string, string>;
    textContent?: string;
    htmlContent?: string;
    rawHeaders: string;
}

/**
 * Parse an email address to extract domain and local part
 */
export function parseEmailAddress(email: string): ParsedEmail {
    const trimmed = email.trim().toLowerCase();

    try {
        emailSchema.parse(trimmed);
        const [localPart, domain] = trimmed.split('@');
        return {
            email: trimmed,
            localPart,
            domain,
            isValid: true,
        };
    } catch {
        return {
            email: trimmed,
            localPart: '',
            domain: '',
            isValid: false,
        };
    }
}

/**
 * Extract domain from email address
 */
export function extractDomain(email: string): string | null {
    const parsed = parseEmailAddress(email);
    return parsed.isValid ? parsed.domain : null;
}

/**
 * Parse an EML file content
 */
export async function parseEmlContent(emlContent: string | Buffer): Promise<ParsedEml> {
    const parsed: ParsedMail = await simpleParser(emlContent);

    // Extract from address
    const fromAddress = parsed.from?.value?.[0];
    const fromEmail = fromAddress?.address || '';
    const fromDomain = extractDomain(fromEmail) || '';

    // Extract to addresses
    const toAddresses = parsed.to
        ? (Array.isArray(parsed.to) ? parsed.to : [parsed.to])
            .flatMap(addr => addr.value.map(v => v.address || ''))
            .filter(Boolean)
        : [];

    // Extract headers as key-value pairs
    const headers: Record<string, string> = {};
    if (parsed.headers) {
        parsed.headers.forEach((value, key) => {
            headers[key] = typeof value === 'string' ? value : JSON.stringify(value);
        });
    }

    // Build raw headers string
    const rawHeaders = parsed.headerLines
        ?.map(line => `${line.key}: ${line.line}`)
        .join('\n') || '';

    return {
        from: fromEmail,
        fromDomain,
        to: toAddresses,
        subject: parsed.subject || '',
        date: parsed.date,
        messageId: parsed.messageId,
        headers,
        textContent: parsed.text,
        htmlContent: parsed.html || undefined,
        rawHeaders,
    };
}

/**
 * Parse raw email headers
 */
export function parseRawHeaders(rawHeaders: string): Record<string, string> {
    const headers: Record<string, string> = {};
    const lines = rawHeaders.split(/\r?\n/);
    let currentKey = '';
    let currentValue = '';

    for (const line of lines) {
        // Continuation of previous header (starts with whitespace)
        if (/^\s/.test(line) && currentKey) {
            currentValue += ' ' + line.trim();
        } else {
            // Save previous header
            if (currentKey) {
                headers[currentKey.toLowerCase()] = currentValue;
            }
            // Parse new header
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                currentKey = line.substring(0, colonIndex).trim();
                currentValue = line.substring(colonIndex + 1).trim();
            }
        }
    }

    // Save last header
    if (currentKey) {
        headers[currentKey.toLowerCase()] = currentValue;
    }

    return headers;
}

/**
 * Extract sender information from raw headers
 */
export function extractSenderFromHeaders(headers: Record<string, string>): ParsedEmail | null {
    const fromHeader = headers['from'];
    if (!fromHeader) return null;

    // Extract email from "Name <email@domain.com>" format
    const emailMatch = fromHeader.match(/<([^>]+)>/) || fromHeader.match(/([^\s<>]+@[^\s<>]+)/);
    if (emailMatch) {
        return parseEmailAddress(emailMatch[1]);
    }

    return null;
}
