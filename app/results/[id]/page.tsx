'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Shield,
    Share2,
    Download,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    HelpCircle,
    Zap,
    CreditCard,
    ThumbsUp,
    ThumbsDown,
    Flag,
    Menu,
    ChevronRight,
} from 'lucide-react';
import type { AnalysisResult, Verdict } from '@/lib/types';

const verdictColors: Record<Verdict, { bg: string; text: string; bar: string }> = {
    safe: { bg: 'bg-green-500', text: 'text-green-500', bar: 'bg-green-500' },
    suspicious: { bg: 'bg-amber-500', text: 'text-amber-500', bar: 'bg-amber-500' },
    dangerous: { bg: 'bg-red-500', text: 'text-red-500', bar: 'bg-red-500' },
};

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem('analysisResult');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.id === params.id) {
                setResult(parsed);
                setLoading(false);
                return;
            }
        }
        router.push('/');
    }, [params.id, router]);

    const handleShare = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading || !result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center gap-3 text-gray-500">
                    <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading analysis...
                </div>
            </div>
        );
    }

    const colors = verdictColors[result.verdict];
    const riskLabel = result.verdict === 'safe' ? 'Low Risk' : result.verdict === 'suspicious' ? 'Medium Risk' : 'High Risk Detected';

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 font-sans antialiased">
            {/* ============ HEADER ============ */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-8 text-[#6366f2]">
                            <Shield className="h-full w-full" />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">PhishingNet</h2>
                    </Link>
                </div>
                <div className="hidden md:flex flex-1 justify-end gap-8">
                    <nav className="flex items-center gap-9">
                        <Link href="/" className="text-gray-600 text-sm font-medium hover:text-[#6366f2] transition-colors">Home</Link>
                        <span className="text-[#6366f2] text-sm font-medium">Analysis</span>
                        <Link href="#" className="text-gray-600 text-sm font-medium hover:text-[#6366f2] transition-colors">Community</Link>
                        <Link href="#" className="text-gray-600 text-sm font-medium hover:text-[#6366f2] transition-colors">About</Link>
                    </nav>
                    <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#6366f2] hover:bg-[#6366f2]/90 text-white text-sm font-bold transition-colors">
                        Log In
                    </button>
                </div>
                <button className="md:hidden">
                    <Menu className="h-6 w-6" />
                </button>
            </header>

            {/* ============ MAIN ============ */}
            <main className="flex-1 flex justify-center py-8 px-4 sm:px-6">
                <div className="w-full max-w-[960px] flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-[#6366f2]">Home</Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <Link href="/" className="text-gray-500 hover:text-[#6366f2]">Tools</Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">Analysis Results</span>
                    </div>

                    {/* Title & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Analysis Result</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="hidden md:inline">|</span>
                                <span className="font-mono">ID: #{result.id.slice(0, 8)}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                                <Share2 className="h-4 w-4" />
                                {copied ? 'Copied!' : 'Share'}
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors">
                                <Download className="h-4 w-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* ============ MAIN RESULT CARD ============ */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                        {/* Left Accent Bar */}
                        <div className={`absolute top-0 left-0 w-2 h-full ${colors.bg}`} />

                        <div className="flex flex-col gap-6 pl-4">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Left: Sender & Pills */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-1">Analyzed Sender</p>
                                    <h2 className="text-xl md:text-2xl font-bold truncate font-mono">
                                        {result.email}
                                    </h2>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {/* SPF */}
                                        <div className={`flex h-8 items-center gap-2 rounded-lg px-3 border ${result.checks.spf.status === 'pass'
                                                ? 'bg-green-500/10 border-green-500/20'
                                                : 'bg-red-500/10 border-red-500/20'
                                            }`}>
                                            {result.checks.spf.status === 'pass'
                                                ? <CheckCircle className="h-4 w-4 text-green-500" />
                                                : <XCircle className="h-4 w-4 text-red-500" />
                                            }
                                            <p className={`text-sm font-bold ${result.checks.spf.status === 'pass' ? 'text-green-500' : 'text-red-500'}`}>
                                                SPF: {result.checks.spf.status.toUpperCase()}
                                            </p>
                                        </div>

                                        {/* DKIM */}
                                        <div className={`flex h-8 items-center gap-2 rounded-lg px-3 border ${result.checks.dkim.status === 'pass'
                                                ? 'bg-green-500/10 border-green-500/20'
                                                : result.checks.dkim.status === 'missing'
                                                    ? 'bg-gray-100 border-gray-200'
                                                    : 'bg-red-500/10 border-red-500/20'
                                            }`}>
                                            {result.checks.dkim.status === 'pass'
                                                ? <CheckCircle className="h-4 w-4 text-green-500" />
                                                : result.checks.dkim.status === 'missing'
                                                    ? <HelpCircle className="h-4 w-4 text-gray-400" />
                                                    : <XCircle className="h-4 w-4 text-red-500" />
                                            }
                                            <p className={`text-sm font-bold ${result.checks.dkim.status === 'pass' ? 'text-green-500' :
                                                    result.checks.dkim.status === 'missing' ? 'text-gray-500' : 'text-red-500'
                                                }`}>
                                                DKIM: {result.checks.dkim.status.toUpperCase()}
                                            </p>
                                        </div>

                                        {/* DMARC */}
                                        <div className={`flex h-8 items-center gap-2 rounded-lg px-3 border ${result.checks.dmarc.policy === 'reject' || result.checks.dmarc.status === 'pass'
                                                ? 'bg-green-500/10 border-green-500/20'
                                                : result.checks.dmarc.status === 'none'
                                                    ? 'bg-gray-100 border-gray-200'
                                                    : 'bg-red-500/10 border-red-500/20'
                                            }`}>
                                            {result.checks.dmarc.status === 'pass'
                                                ? <CheckCircle className="h-4 w-4 text-green-500" />
                                                : result.checks.dmarc.status === 'none'
                                                    ? <HelpCircle className="h-4 w-4 text-gray-400" />
                                                    : <XCircle className="h-4 w-4 text-red-500" />
                                            }
                                            <p className={`text-sm font-bold ${result.checks.dmarc.status === 'pass' ? 'text-green-500' :
                                                    result.checks.dmarc.status === 'none' ? 'text-gray-500' : 'text-red-500'
                                                }`}>
                                                DMARC: {result.checks.dmarc.policy?.toUpperCase() || result.checks.dmarc.status.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Score */}
                                <div className="flex flex-col items-end min-w-[200px]">
                                    <div className="text-right mb-2">
                                        <span className="block text-sm font-medium text-gray-500">Risk Score</span>
                                        <span className={`text-4xl font-black ${colors.text}`}>
                                            {result.riskScore.total}
                                            <span className="text-xl text-gray-400 font-medium">/100</span>
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${result.riskScore.total}%` }} />
                                    </div>
                                    <p className={`mt-2 text-xs font-bold uppercase tracking-wide ${colors.text}`}>
                                        {riskLabel}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ============ WARNING ALERT ============ */}
                    {result.verdict !== 'safe' && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-4 items-start">
                            <div className="bg-red-500 text-white rounded-full p-1 shrink-0 mt-0.5">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-red-500 font-bold text-base mb-1">
                                    {result.verdict === 'dangerous' ? 'Potential Phishing Attack' : 'Suspicious Email Detected'}
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {result.explanation}
                                    {result.domainInfo.isLookalike && (
                                        <span> The domain <span className="font-mono bg-black/10 px-1 rounded">{result.domain}</span> appears to mimic {result.domainInfo.similarTo}.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ============ TWO COLUMN: SECURITY + AI ============ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Security Checks */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <Shield className="h-6 w-6 text-[#6366f2]" />
                                <h3 className="text-lg font-bold">Security Checks</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">SPF Validation</span>
                                        <span className="text-gray-500 text-xs">{result.checks.spf.reason || 'Sender Policy Framework check'}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${result.checks.spf.status === 'pass' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {result.checks.spf.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">DKIM Signature</span>
                                        <span className="text-gray-500 text-xs">{result.checks.dkim.reason || 'DomainKeys identified mail'}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${result.checks.dkim.status === 'pass' ? 'bg-green-500/10 text-green-500' :
                                            result.checks.dkim.status === 'missing' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {result.checks.dkim.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">DMARC Policy</span>
                                        <span className="text-gray-500 text-xs">{result.checks.dmarc.reason || 'Domain-based message authentication'}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${result.checks.dmarc.status === 'pass' ? 'bg-green-500/10 text-green-500' :
                                            result.checks.dmarc.status === 'none' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {result.checks.dmarc.policy?.toUpperCase() || result.checks.dmarc.status.toUpperCase()}
                                    </span>
                                </div>
                                {result.domainInfo.isLookalike && (
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">Lookalike Domain</span>
                                            <span className="text-gray-500 text-xs">Similar to {result.domainInfo.similarTo}</span>
                                        </div>
                                        <span className="bg-red-500/10 text-red-500 text-xs font-bold px-2 py-1 rounded">
                                            DETECTED
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AI Analysis */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <Zap className="h-6 w-6 text-[#6366f2]" />
                                <h3 className="text-lg font-bold">AI Content Analysis</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                {result.aiAnalysis?.enabled && result.aiAnalysis.signals.length > 0 ? (
                                    <>
                                        {result.aiAnalysis.signals.map((signal, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {signal.type === 'urgency' && <Zap className="h-4 w-4 text-amber-500" />}
                                                    {signal.type === 'financial' && <CreditCard className="h-4 w-4 text-red-500" />}
                                                    {!['urgency', 'financial'].includes(signal.type) && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                                                    <span className="text-sm font-bold capitalize">{signal.type.replace('_', ' ')}</span>
                                                </div>
                                                <p className="text-xs text-gray-600">{signal.description}</p>
                                            </div>
                                        ))}
                                        <div className="mt-2 flex justify-end">
                                            <button className="text-[#6366f2] text-xs font-bold hover:underline">View Full Content Log</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                                        <p className="font-medium">No Threats Detected</p>
                                        <p className="text-xs mt-1">AI analysis found no suspicious patterns</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ============ COMMUNITY TRUST ============ */}
                    <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`flex flex-col items-center justify-center size-14 rounded-full border-4 ${colors.bg.replace('bg-', 'border-')} bg-transparent`}>
                                <span className="text-sm font-black">{Math.max(0, 100 - result.riskScore.total)}</span>
                            </div>
                            <div>
                                <h4 className="text-base font-bold">Community Trust Score</h4>
                                <p className="text-sm text-gray-500">Based on community reports</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                            <span className="text-xs font-medium text-gray-500 px-2 uppercase">Vote on this domain</span>
                            <div className="h-4 w-px bg-gray-300" />
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-gray-100 shadow-sm transition-all group">
                                <ThumbsUp className="h-4 w-4 text-gray-400 group-hover:text-green-500" />
                                <span className="text-sm font-medium">Safe</span>
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500 text-white shadow-sm hover:bg-red-600 transition-all">
                                <ThumbsDown className="h-4 w-4" />
                                <span className="text-sm font-medium">Malicious</span>
                            </button>
                        </div>
                    </div>

                    {/* ============ REPORT BUTTON ============ */}
                    <div className="flex justify-end pt-4 pb-12">
                        <button className="group relative flex items-center justify-center gap-2 rounded-xl bg-red-500 px-8 py-3 text-white font-bold text-base shadow-lg shadow-red-500/25 hover:bg-red-600 hover:shadow-red-500/40 transition-all active:scale-[0.98]">
                            <Flag className="h-5 w-5" />
                            Report as Phishing
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-100" />
                            </span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
