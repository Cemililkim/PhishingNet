import {
    parseEmailAddress,
    extractDomain,
    parseRawHeaders,
    extractSenderFromHeaders,
} from '@/lib/services/email-parser';

describe('Email Parser', () => {
    describe('parseEmailAddress', () => {
        it('parses valid email addresses', () => {
            const result = parseEmailAddress('user@example.com');
            expect(result.isValid).toBe(true);
            expect(result.email).toBe('user@example.com');
            expect(result.localPart).toBe('user');
            expect(result.domain).toBe('example.com');
        });

        it('handles uppercase emails', () => {
            const result = parseEmailAddress('USER@EXAMPLE.COM');
            expect(result.isValid).toBe(true);
            expect(result.email).toBe('user@example.com');
            expect(result.domain).toBe('example.com');
        });

        it('rejects invalid emails', () => {
            const result = parseEmailAddress('invalid-email');
            expect(result.isValid).toBe(false);
            expect(result.domain).toBe('');
        });

        it('trims whitespace', () => {
            const result = parseEmailAddress('  user@example.com  ');
            expect(result.isValid).toBe(true);
            expect(result.email).toBe('user@example.com');
        });
    });

    describe('extractDomain', () => {
        it('extracts domain from valid email', () => {
            expect(extractDomain('test@google.com')).toBe('google.com');
        });

        it('returns null for invalid email', () => {
            expect(extractDomain('not-an-email')).toBeNull();
        });
    });

    describe('parseRawHeaders', () => {
        it('parses simple headers', () => {
            const raw = `From: sender@example.com
To: recipient@example.com
Subject: Test Email`;

            const headers = parseRawHeaders(raw);
            expect(headers['from']).toBe('sender@example.com');
            expect(headers['to']).toBe('recipient@example.com');
            expect(headers['subject']).toBe('Test Email');
        });

        it('handles multi-line headers', () => {
            const raw = `Subject: This is a very long subject
 that continues on the next line`;

            const headers = parseRawHeaders(raw);
            expect(headers['subject']).toContain('continues');
        });
    });

    describe('extractSenderFromHeaders', () => {
        it('extracts email from simple From header', () => {
            const headers = { from: 'sender@example.com' };
            const result = extractSenderFromHeaders(headers);
            expect(result?.email).toBe('sender@example.com');
        });

        it('extracts email from Name <email> format', () => {
            const headers = { from: 'John Doe <john@example.com>' };
            const result = extractSenderFromHeaders(headers);
            expect(result?.email).toBe('john@example.com');
        });

        it('returns null if no From header', () => {
            const headers = { to: 'recipient@example.com' };
            expect(extractSenderFromHeaders(headers)).toBeNull();
        });
    });
});
