// Core analysis types for PhishingNet

export interface AnalysisInput {
    type: 'email' | 'eml' | 'headers';
    email?: string;
    emlContent?: string;
    headers?: string;
}

export interface SPFResult {
    status: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none' | 'permerror' | 'temperror';
    record?: string;
    reason?: string;
}

export interface DKIMResult {
    status: 'pass' | 'fail' | 'missing' | 'invalid';
    selector?: string;
    domain?: string;
    reason?: string;
}

export interface DMARCResult {
    status: 'pass' | 'fail' | 'none' | 'quarantine' | 'reject';
    policy?: string;
    record?: string;
    reason?: string;
}

export interface DomainInfo {
    domain: string;
    ageDays: number;
    registrar?: string;
    createdDate?: string;
    reputationScore: number;
    isVerified: boolean;
    companyName?: string;
    isLookalike: boolean;
    similarTo?: string;
}

export interface AIAnalysisResult {
    enabled: boolean;
    score: number;
    signals: AISignal[];
    model: string;
    processingTimeMs: number;
}

export interface AISignal {
    type: 'urgency' | 'financial' | 'authority' | 'link' | 'social_engineering' | 'grammar';
    severity: 'low' | 'medium' | 'high';
    description: string;
    evidence?: string;
}

export interface SecurityChecks {
    spf: SPFResult;
    dkim: DKIMResult;
    dmarc: DMARCResult;
}

export interface RiskScore {
    total: number;
    breakdown: {
        traditional: number;
        ai: number;
        reputation: number;
    };
}

export type Verdict = 'safe' | 'suspicious' | 'dangerous';

export interface AnalysisResult {
    id: string;
    email: string;
    domain: string;
    riskScore: RiskScore;
    verdict: Verdict;
    checks: SecurityChecks;
    domainInfo: DomainInfo;
    aiAnalysis?: AIAnalysisResult;
    explanation: string;
    warnings: string[];
    createdAt: string;
}

export function getVerdictFromScore(score: number): Verdict {
    if (score <= 25) return 'safe';
    if (score <= 60) return 'suspicious';
    return 'dangerous';
}
