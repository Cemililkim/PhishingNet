// User and community types for PhishingNet

export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
    lastLogin?: string;
}

export interface ApiKey {
    id: string;
    userId: string;
    name: string;
    keyPrefix: string; // First 8 chars for display
    rateLimit: number;
    usageCount: number;
    expiresAt?: string;
    createdAt: string;
}

export type TrustLevel = 'confirmed' | 'likely' | 'disputed' | 'rejected' | 'unrated';

export interface PhishingReport {
    id: string;
    userId: string;
    domain: string;
    email?: string;
    reason: string;
    evidence?: string;
    upvotes: number;
    downvotes: number;
    trustLevel: TrustLevel;
    createdAt: string;
    updatedAt: string;
}

export interface Vote {
    id: string;
    userId: string;
    reportId: string;
    type: 'upvote' | 'downvote';
    createdAt: string;
}

export interface ScanHistory {
    id: string;
    userId: string;
    email: string;
    domain: string;
    riskScore: number;
    verdict: 'safe' | 'suspicious' | 'dangerous';
    createdAt: string;
}

export function calculateTrustLevel(upvotes: number, downvotes: number): TrustLevel {
    const total = upvotes + downvotes;
    if (total === 0) return 'unrated';

    const ratio = upvotes / total;
    if (ratio >= 0.9) return 'confirmed';
    if (ratio >= 0.7) return 'likely';
    if (ratio >= 0.5) return 'disputed';
    return 'rejected';
}
