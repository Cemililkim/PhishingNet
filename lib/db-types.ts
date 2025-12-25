import type { AnalysisResult } from './types';

// Database types for Supabase tables

export interface DbScanHistory {
    id: string;
    user_id: string;
    email: string;
    domain: string;
    subject: string | null;
    verdict: 'safe' | 'suspicious' | 'dangerous';
    risk_score: number;
    spf_status: string;
    dkim_status: string;
    dmarc_status: string;
    is_lookalike: boolean;
    similar_to: string | null;
    ai_signals: AiSignal[];
    explanation: string | null;
    created_at: string;
    updated_at: string;
}

export interface AiSignal {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
}

export interface UserScanStats {
    user_id: string;
    total_scans: number;
    safe_count: number;
    suspicious_count: number;
    dangerous_count: number;
    last_scan_at: string | null;
}

// Convert AnalysisResult to DbScanHistory insert
export function analysisToDbInsert(
    userId: string,
    result: AnalysisResult,
    subject?: string
): Omit<DbScanHistory, 'id' | 'created_at' | 'updated_at'> {
    return {
        user_id: userId,
        email: result.email,
        domain: result.domain,
        subject: subject || null,
        verdict: result.verdict,
        risk_score: result.riskScore.total,
        spf_status: result.checks.spf.status,
        dkim_status: result.checks.dkim.status,
        dmarc_status: result.checks.dmarc.status,
        is_lookalike: result.domainInfo.isLookalike,
        similar_to: result.domainInfo.similarTo || null,
        ai_signals: result.aiAnalysis?.signals || [],
        explanation: result.explanation,
    };
}

// Convert DbScanHistory to display format
export function dbScanToDisplay(scan: DbScanHistory) {
    return {
        id: scan.id,
        subject: scan.subject || `Scan of ${scan.email}`,
        source: scan.email,
        score: scan.risk_score,
        status: scan.verdict === 'safe' ? 'Safe' : scan.verdict === 'suspicious' ? 'Suspicious' : 'Phishing',
        time: formatRelativeTime(scan.created_at),
        createdAt: scan.created_at,
    };
}

function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}
