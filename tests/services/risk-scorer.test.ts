import { calculateRiskScore, generateExplanation } from '@/lib/services/risk-scorer';
import type { SecurityChecks, DomainInfo } from '@/lib/types';

describe('Risk Scorer', () => {
    describe('calculateRiskScore', () => {
        it('returns low score for passing checks', () => {
            const input = {
                checks: {
                    spf: { status: 'pass' as const },
                    dkim: { status: 'pass' as const },
                    dmarc: { status: 'pass' as const, policy: 'reject' },
                },
                domainInfo: {
                    ageDays: 365,
                    isLookalike: false,
                },
            };

            const score = calculateRiskScore(input);
            expect(score.total).toBeLessThanOrEqual(25);
            expect(score.breakdown.traditional).toBe(0);
        });

        it('returns high score for failing checks', () => {
            const input = {
                checks: {
                    spf: { status: 'fail' as const },
                    dkim: { status: 'missing' as const },
                    dmarc: { status: 'none' as const },
                },
                domainInfo: {
                    ageDays: 5,
                    isLookalike: true,
                    similarTo: 'paypal.com',
                },
            };

            const score = calculateRiskScore(input);
            expect(score.total).toBeGreaterThan(50);
        });

        it('adds points for lookalike domains', () => {
            const baseInput = {
                checks: {
                    spf: { status: 'pass' as const },
                    dkim: { status: 'pass' as const },
                    dmarc: { status: 'pass' as const },
                },
                domainInfo: {
                    ageDays: 365,
                    isLookalike: false,
                },
            };

            const lookalikeinput = {
                ...baseInput,
                domainInfo: {
                    ...baseInput.domainInfo,
                    isLookalike: true,
                },
            };

            const baseScore = calculateRiskScore(baseInput);
            const lookalikeScore = calculateRiskScore(lookalikeinput);

            expect(lookalikeScore.total).toBeGreaterThan(baseScore.total);
        });

        it('adds points for young domains', () => {
            const oldDomain = {
                checks: {
                    spf: { status: 'pass' as const },
                    dkim: { status: 'pass' as const },
                    dmarc: { status: 'pass' as const },
                },
                domainInfo: { ageDays: 365, isLookalike: false },
            };

            const newDomain = {
                ...oldDomain,
                domainInfo: { ageDays: 3, isLookalike: false },
            };

            const oldScore = calculateRiskScore(oldDomain);
            const newScore = calculateRiskScore(newDomain);

            expect(newScore.total).toBeGreaterThan(oldScore.total);
        });
    });

    describe('generateExplanation', () => {
        it('generates safe explanation for low scores', () => {
            const riskScore = { total: 10, breakdown: { traditional: 10, ai: 0, reputation: 0 } };
            const checks: SecurityChecks = {
                spf: { status: 'pass' },
                dkim: { status: 'pass' },
                dmarc: { status: 'pass', policy: 'reject' },
            };

            const explanation = generateExplanation(riskScore, checks, {});
            expect(explanation).toContain('legitimate');
        });

        it('generates warning for dangerous scores', () => {
            const riskScore = { total: 85, breakdown: { traditional: 55, ai: 20, reputation: 10 } };
            const checks: SecurityChecks = {
                spf: { status: 'fail' },
                dkim: { status: 'missing' },
                dmarc: { status: 'none' },
            };

            const explanation = generateExplanation(riskScore, checks, { isLookalike: true, similarTo: 'paypal.com' });
            expect(explanation).toContain('HIGH RISK');
            expect(explanation).toContain('DO NOT click');
        });
    });
});
