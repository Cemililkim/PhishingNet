import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
    parseEmailAddress,
    runDNSChecks,
    buildAnalysisResult,
} from '@/lib/services';
import type { ApiResponse, AnalysisResult } from '@/lib/types';

// Request validation schema
const analyzeEmailSchema = z.object({
    email: z.string().email('Invalid email address'),
    includeReputation: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate input
        const validation = analyzeEmailSchema.safeParse(body);
        if (!validation.success) {
            const errorMessage = validation.error.issues?.[0]?.message || 'Invalid input';
            const response: ApiResponse<null> = {
                status: 'error',
                error: {
                    code: 'VALIDATION_ERROR',
                    message: errorMessage,
                },
            };
            return NextResponse.json(response, { status: 400 });
        }

        const { email } = validation.data;

        // Parse email address
        const parsed = parseEmailAddress(email);
        if (!parsed.isValid) {
            const response: ApiResponse<null> = {
                status: 'error',
                error: {
                    code: 'INVALID_EMAIL',
                    message: 'Could not parse email address',
                },
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Run DNS checks
        const dnsResult = await runDNSChecks({
            domain: parsed.domain,
        });

        // Build analysis result
        const analysisId = uuidv4();
        const result = buildAnalysisResult(
            analysisId,
            email,
            parsed.domain,
            dnsResult.checks,
            dnsResult.domainInfo
        );

        const response: ApiResponse<AnalysisResult> = {
            status: 'success',
            data: result,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Analysis error:', error);

        const response: ApiResponse<null> = {
            status: 'error',
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An error occurred during analysis',
            },
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// Health check
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        endpoint: '/api/analyze/email',
        method: 'POST',
        description: 'Analyze an email address for phishing indicators',
    });
}
