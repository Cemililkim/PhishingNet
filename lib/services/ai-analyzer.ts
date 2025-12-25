import Groq from 'groq-sdk';
import type { AIAnalysisResult, AISignal } from '@/lib/types';

// Lazy initialization to avoid requiring API key at build time
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqClient) {
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }
    return groqClient;
}

// Model configuration
const MODELS = {
    fast: 'llama-3.1-8b-instant',    // Fast screening ~200ms
    deep: 'llama-3.3-70b-versatile', // Deep analysis ~2s
} as const;

export interface AIAnalysisOptions {
    content: string;
    subject?: string;
    sender?: string;
    useDeepModel?: boolean;
}

/**
 * Analyze email content for phishing indicators using AI
 */
export async function analyzeContent(options: AIAnalysisOptions): Promise<AIAnalysisResult> {
    const { content, subject, sender, useDeepModel = false } = options;
    const startTime = Date.now();

    // Skip if no content
    if (!content?.trim()) {
        return {
            enabled: false,
            score: 0,
            signals: [],
            model: '',
            processingTimeMs: 0,
        };
    }

    const model = useDeepModel ? MODELS.deep : MODELS.fast;

    try {
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(content, subject, sender);

        const completion = await getGroqClient().chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.1, // Low temperature for consistent analysis
            max_tokens: 1024,
            response_format: { type: 'json_object' },
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error('Empty response from AI');
        }

        const parsed = parseAIResponse(response);

        return {
            enabled: true,
            score: parsed.score,
            signals: parsed.signals,
            model,
            processingTimeMs: Date.now() - startTime,
        };

    } catch (error) {
        console.error('AI analysis error:', error);

        // Return disabled result on error (graceful degradation)
        return {
            enabled: false,
            score: 0,
            signals: [],
            model,
            processingTimeMs: Date.now() - startTime,
        };
    }
}

function buildSystemPrompt(): string {
    return `You are an email security analyst specializing in phishing detection. 
Analyze the provided email content and identify phishing indicators.

Return a JSON object with:
{
  "score": <0-100 risk score>,
  "signals": [
    {
      "type": "<urgency|financial|authority|link|social_engineering|grammar>",
      "severity": "<low|medium|high>",
      "description": "<brief description>",
      "evidence": "<quoted text from email>"
    }
  ]
}

Scoring guidelines:
- 0-20: No phishing indicators
- 21-40: Minor concerns (grammar issues, generic greeting)
- 41-60: Moderate risk (urgency, suspicious requests)
- 61-80: High risk (financial requests, authority impersonation)
- 81-100: Critical (multiple severe indicators, known attack patterns)

Signal types:
- urgency: "Act now!", "Account suspended", time pressure
- financial: Money requests, prize claims, refund offers
- authority: Impersonating IT, CEO, bank, government
- link: Suspicious URLs, mismatched link text
- social_engineering: Manipulation, emotional appeals
- grammar: Poor spelling/grammar common in mass phishing`;
}

function buildUserPrompt(content: string, subject?: string, sender?: string): string {
    let prompt = 'Analyze this email for phishing indicators:\n\n';

    if (sender) {
        prompt += `FROM: ${sender}\n`;
    }
    if (subject) {
        prompt += `SUBJECT: ${subject}\n`;
    }
    prompt += `\nCONTENT:\n${content.slice(0, 4000)}`; // Limit content length

    return prompt;
}

interface ParsedAIResponse {
    score: number;
    signals: AISignal[];
}

function parseAIResponse(response: string): ParsedAIResponse {
    try {
        const parsed = JSON.parse(response);

        const score = Math.min(100, Math.max(0, Number(parsed.score) || 0));

        const signals: AISignal[] = [];
        if (Array.isArray(parsed.signals)) {
            for (const signal of parsed.signals) {
                if (signal.type && signal.severity && signal.description) {
                    signals.push({
                        type: signal.type as AISignal['type'],
                        severity: signal.severity as AISignal['severity'],
                        description: String(signal.description),
                        evidence: signal.evidence ? String(signal.evidence) : undefined,
                    });
                }
            }
        }

        return { score, signals };

    } catch {
        return { score: 0, signals: [] };
    }
}

/**
 * Quick check if AI analysis is available
 */
export function isAIEnabled(): boolean {
    return !!process.env.GROQ_API_KEY;
}
