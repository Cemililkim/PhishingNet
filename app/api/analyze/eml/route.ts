import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
    parseEmlContent,
    runDNSChecks,
    buildAnalysisResult,
    analyzeContent,
    isAIEnabled,
} from '@/lib/services';
import type { ApiResponse, AnalysisResult } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        // Get form data with file
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const enableAI = formData.get('enableAI') !== 'false'; // Default true

        if (!file) {
            const response: ApiResponse<null> = {
                status: 'error',
                error: {
                    code: 'NO_FILE',
                    message: 'No .eml file provided',
                },
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Validate file type
        if (!file.name.endsWith('.eml')) {
            const response: ApiResponse<null> = {
                status: 'error',
                error: {
                    code: 'INVALID_FILE_TYPE',
                    message: 'File must be a .eml file',
                },
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Parse EML file
        const emlContent = await file.text();
        const parsed = await parseEmlContent(emlContent);

        if (!parsed.fromDomain) {
            const response: ApiResponse<null> = {
                status: 'error',
                error: {
                    code: 'INVALID_EML',
                    message: 'Could not extract sender from EML file',
                },
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Run DNS checks
        const dnsResult = await runDNSChecks({
            domain: parsed.fromDomain,
            headers: parsed.headers,
        });

        // Run AI analysis if enabled and available
        let aiAnalysis = undefined;
        if (enableAI && isAIEnabled() && parsed.textContent) {
            aiAnalysis = await analyzeContent({
                content: parsed.textContent,
                subject: parsed.subject,
                sender: parsed.from,
            });
        }

        // Build result
        const analysisId = uuidv4();
        const result = buildAnalysisResult(
            analysisId,
            parsed.from,
            parsed.fromDomain,
            dnsResult.checks,
            dnsResult.domainInfo,
            aiAnalysis
        );

        const response: ApiResponse<AnalysisResult> = {
            status: 'success',
            data: result,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('EML analysis error:', error);

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

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        endpoint: '/api/analyze/eml',
        method: 'POST',
        description: 'Upload and analyze an .eml file',
        params: {
            file: 'The .eml file (multipart/form-data)',
            enableAI: 'Enable AI content analysis (default: true)',
        },
    });
}
