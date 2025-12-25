import type {
    SecurityChecks,
    DomainInfo,
    AIAnalysisResult,
    RiskScore,
    Verdict,
    AnalysisResult,
} from '@/lib/types';
import { getVerdictFromScore } from '@/lib/types';

// Scoring weights based on documentation
const WEIGHTS = {
    // Traditional checks (55%)
    spf: 15,
    dkim: 15,
    dmarc: 12,
    domainAge: 8,
    lookalike: 12,
    reputation: 8,

    // AI analysis (30%) - handled separately
    aiTotal: 30,

    // Maximum score
    total: 100,
};

export interface ScoringInput {
    checks: SecurityChecks;
    domainInfo: Partial<DomainInfo>;
    aiAnalysis?: AIAnalysisResult;
}

/**
 * Calculate risk score based on all analysis results
 */
export function calculateRiskScore(input: ScoringInput): RiskScore {
    const { checks, domainInfo, aiAnalysis } = input;

    let traditionalScore = 0;
    let aiScore = 0;
    let reputationScore = 0;

    // SPF scoring
    if (checks.spf.status === 'fail') {
        traditionalScore += WEIGHTS.spf;
    } else if (checks.spf.status === 'softfail') {
        traditionalScore += WEIGHTS.spf * 0.5;
    } else if (checks.spf.status === 'none') {
        traditionalScore += WEIGHTS.spf * 0.3;
    }

    // DKIM scoring
    if (checks.dkim.status === 'fail') {
        traditionalScore += WEIGHTS.dkim;
    } else if (checks.dkim.status === 'missing') {
        traditionalScore += WEIGHTS.dkim * 0.7;
    } else if (checks.dkim.status === 'invalid') {
        traditionalScore += WEIGHTS.dkim * 0.9;
    }

    // DMARC scoring
    if (checks.dmarc.status === 'fail') {
        traditionalScore += WEIGHTS.dmarc;
    } else if (checks.dmarc.status === 'none' || checks.dmarc.policy === 'none') {
        traditionalScore += WEIGHTS.dmarc * 0.6;
    } else if (checks.dmarc.policy === 'quarantine') {
        // Quarantine is better than none but not as good as reject
        traditionalScore += WEIGHTS.dmarc * 0.2;
    }

    // Domain age scoring
    if (domainInfo.ageDays !== undefined) {
        if (domainInfo.ageDays < 7) {
            traditionalScore += WEIGHTS.domainAge;
        } else if (domainInfo.ageDays < 30) {
            traditionalScore += WEIGHTS.domainAge * 0.7;
        } else if (domainInfo.ageDays < 90) {
            traditionalScore += WEIGHTS.domainAge * 0.3;
        }
    }

    // Lookalike domain scoring
    if (domainInfo.isLookalike) {
        traditionalScore += WEIGHTS.lookalike;
    }

    // Reputation scoring
    if (domainInfo.reputationScore !== undefined) {
        if (domainInfo.reputationScore < 30) {
            reputationScore += WEIGHTS.reputation;
        } else if (domainInfo.reputationScore < 50) {
            reputationScore += WEIGHTS.reputation * 0.5;
        }
    }

    // AI analysis scoring
    if (aiAnalysis?.enabled && aiAnalysis.score) {
        // AI score is already calculated, scale it to 30%
        aiScore = (aiAnalysis.score / 100) * WEIGHTS.aiTotal;
    }

    const total = Math.min(
        Math.round(traditionalScore + aiScore + reputationScore),
        WEIGHTS.total
    );

    return {
        total,
        breakdown: {
            traditional: Math.round(traditionalScore),
            ai: Math.round(aiScore),
            reputation: Math.round(reputationScore),
        },
    };
}

/**
 * Generate human-readable explanation based on analysis results
 */
export function generateExplanation(
    riskScore: RiskScore,
    checks: SecurityChecks,
    domainInfo: Partial<DomainInfo>,
    aiAnalysis?: AIAnalysisResult
): string {
    const verdict = getVerdictFromScore(riskScore.total);
    const issues: string[] = [];
    const positives: string[] = [];

    // Check results
    if (checks.spf.status === 'pass') {
        positives.push('SPF authentication passed');
    } else if (checks.spf.status === 'fail') {
        issues.push('SPF check failed - sender is not authorized by the domain');
    }

    if (checks.dkim.status === 'pass') {
        positives.push('DKIM signature verified');
    } else if (checks.dkim.status === 'missing') {
        issues.push('No DKIM signature found');
    } else if (checks.dkim.status === 'fail') {
        issues.push('DKIM signature verification failed');
    }

    if (checks.dmarc.policy === 'reject') {
        positives.push('Strong DMARC policy in place');
    } else if (checks.dmarc.status === 'none') {
        issues.push('No DMARC policy configured');
    }

    // Domain info
    if (domainInfo.isLookalike && domainInfo.similarTo) {
        issues.push(`Domain "${domainInfo.domain}" appears to mimic "${domainInfo.similarTo}"`);
    }

    if (domainInfo.ageDays !== undefined && domainInfo.ageDays < 30) {
        issues.push(`Domain was registered only ${domainInfo.ageDays} days ago`);
    }

    // AI signals
    if (aiAnalysis?.signals) {
        for (const signal of aiAnalysis.signals) {
            if (signal.severity === 'high') {
                issues.push(`AI detected: ${signal.description}`);
            }
        }
    }

    // Build explanation
    let explanation = '';

    if (verdict === 'safe') {
        explanation = 'This email appears to be legitimate. ';
        if (positives.length > 0) {
            explanation += positives.join('. ') + '.';
        }
    } else if (verdict === 'suspicious') {
        explanation = 'This email has some concerning indicators. Proceed with caution. ';
        if (issues.length > 0) {
            explanation += 'Issues found: ' + issues.join('; ') + '.';
        }
    } else {
        explanation = '⚠️ HIGH RISK: This email is likely a phishing attempt. ';
        if (issues.length > 0) {
            explanation += 'Critical issues: ' + issues.join('; ') + '.';
        }
        explanation += ' DO NOT click any links or download attachments.';
    }

    return explanation;
}

/**
 * Build complete analysis result
 */
export function buildAnalysisResult(
    id: string,
    email: string,
    domain: string,
    checks: SecurityChecks,
    domainInfo: Partial<DomainInfo>,
    aiAnalysis?: AIAnalysisResult
): AnalysisResult {
    const riskScore = calculateRiskScore({ checks, domainInfo, aiAnalysis });
    const verdict: Verdict = getVerdictFromScore(riskScore.total);
    const explanation = generateExplanation(riskScore, checks, domainInfo, aiAnalysis);

    // Collect warnings
    const warnings: string[] = [];
    if (checks.spf.status !== 'pass') warnings.push(`SPF: ${checks.spf.reason || checks.spf.status}`);
    if (checks.dkim.status !== 'pass') warnings.push(`DKIM: ${checks.dkim.reason || checks.dkim.status}`);
    if (checks.dmarc.status === 'none') warnings.push('No DMARC policy');
    if (domainInfo.isLookalike) warnings.push(`Lookalike domain detected (similar to ${domainInfo.similarTo})`);

    return {
        id,
        email,
        domain,
        riskScore,
        verdict,
        checks,
        domainInfo: {
            domain,
            ageDays: domainInfo.ageDays || 0,
            reputationScore: domainInfo.reputationScore || 50,
            isVerified: domainInfo.isVerified || false,
            isLookalike: domainInfo.isLookalike || false,
            similarTo: domainInfo.similarTo,
        },
        aiAnalysis,
        explanation,
        warnings,
        createdAt: new Date().toISOString(),
    };
}
