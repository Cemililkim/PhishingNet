'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Shield,
    LayoutDashboard,
    History,
    Flag,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Radar,
    ShieldCheck,
    ShieldAlert,
    TrendingUp,
    TrendingDown,
    Key,
    Copy,
    RefreshCw,
    Calendar,
    Zap,
    ArrowRight,
    Check,
} from 'lucide-react';
import { signOut } from '@/lib/auth/actions';
import type { User } from '@supabase/supabase-js';

interface ScanDisplay {
    id: string;
    subject: string;
    source: string;
    score: number;
    status: string;
    time: string;
}

interface DashboardStats {
    totalScans: number;
    safeCount: number;
    threatsCount: number;
    weeklyChange: number;
}

interface DashboardContentProps {
    user: User;
    initialScans: ScanDisplay[];
    stats: DashboardStats;
}

export default function DashboardContent({ user, initialScans, stats }: DashboardContentProps) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quickInput, setQuickInput] = useState('');
    const [copied, setCopied] = useState(false);

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

    const handleQuickAnalyze = () => {
        if (!quickInput.trim()) return;
        // Navigate to home page with pre-filled content
        sessionStorage.setItem('analyzeContent', quickInput);
        router.push('/');
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText('pk_live_demo_key');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Safe':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Suspicious':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Phishing':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'bg-red-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const TrendIcon = stats.weeklyChange >= 0 ? TrendingUp : TrendingDown;
    const trendColor = stats.weeklyChange >= 0 ? 'text-green-500' : 'text-red-500';

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-100 text-gray-900">
            {/* ============ SIDEBAR ============ */}
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-40 w-64 flex flex-col border-r border-gray-200 bg-white h-full transition-transform`}>
                <div className="flex flex-col h-full p-4 justify-between">
                    <div className="flex flex-col gap-6">
                        {/* Logo */}
                        <button onClick={() => router.push('/')} className='hover:cursor-pointer'>
                            <div className="flex items-center gap-3 px-2">
                                <div className="bg-[#6366f2]/20 rounded-xl size-10 flex items-center justify-center text-[#6366f2]">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-base font-bold leading-none">PhishingNet</h1>
                                    <p className="text-gray-500 text-xs font-medium mt-1">Security Dashboard</p>
                                </div>
                            </div>
                        </button>

                        {/* Nav */}
                        <nav className="flex flex-col gap-1">
                            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#6366f2] text-white shadow-md shadow-[#6366f2]/20">
                                <LayoutDashboard className="h-5 w-5" />
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link href="/dashboard/history" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
                                <History className="h-5 w-5" />
                                <span className="text-sm font-medium">History</span>
                            </Link>
                            <Link href="/dashboard/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
                                <Flag className="h-5 w-5" />
                                <span className="text-sm font-medium">Reporting</span>
                            </Link>
                            <Link href="/api-docs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
                                <FileText className="h-5 w-5" />
                                <span className="text-sm font-medium">API Docs</span>
                            </Link>
                            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
                                <Settings className="h-5 w-5" />
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                        </nav>
                    </div>

                    {/* User */}
                    <div className="mt-auto border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                            <div className="bg-[#6366f2] rounded-full size-10 flex items-center justify-center text-white font-bold text-sm">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{userName}</p>
                                <p className="text-gray-500 text-xs truncate">{user.email}</p>
                            </div>
                            <button onClick={handleSignOut} className="text-gray-400 hover:text-gray-600" title="Sign out">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ============ MAIN ============ */}
            <main className="flex-1 overflow-y-auto h-full">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-[#6366f2]">
                        <Shield className="h-5 w-5" />
                        <span className="font-bold text-gray-900">PhishingNet</span>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500">
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                <div className="p-6 md:p-10 max-w-[1400px] mx-auto flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Welcome back, {userName}</h1>
                            <p className="text-gray-500 text-base">Here's what's happening with your security today.</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Radar className="h-16 w-16" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Radar className="h-5 w-5 text-[#6366f2]" />
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Scans</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.totalScans.toLocaleString()}</p>
                                <div className={`flex items-center gap-1 mt-1 ${trendColor} text-sm font-medium`}>
                                    <TrendIcon className="h-4 w-4" />
                                    <span>{stats.weeklyChange >= 0 ? '+' : ''}{stats.weeklyChange}% this week</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="h-16 w-16" />
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-green-500" />
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Safe Emails</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.safeCount.toLocaleString()}</p>
                                <div className="flex items-center gap-1 mt-1 text-green-500 text-sm font-medium">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>{stats.totalScans > 0 ? Math.round((stats.safeCount / stats.totalScans) * 100) : 0}% of scans</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldAlert className="h-16 w-16" />
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-red-500" />
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Threats Detected</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.threatsCount.toLocaleString()}</p>
                                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm font-medium">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>{stats.totalScans > 0 ? Math.round((stats.threatsCount / stats.totalScans) * 100) : 0}% of scans</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Analysis */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm relative">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#6366f2]/10 blur-3xl pointer-events-none" />
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="flex-1 flex flex-col gap-3 relative z-10">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <span className="bg-[#6366f2] text-white p-2 rounded-lg">
                                        <Zap className="h-5 w-5" />
                                    </span>
                                    Quick Analysis
                                </h2>
                                <p className="text-gray-600 text-base leading-relaxed max-w-xl">
                                    Instantly scan suspicious emails. Paste raw headers or body content below to run our AI detection engine.
                                </p>
                            </div>
                            <div className="w-full md:w-[480px] relative z-10">
                                <div className="flex items-stretch rounded-lg shadow-sm bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-[#6366f2] focus-within:border-[#6366f2] transition-all">
                                    <input
                                        type="text"
                                        value={quickInput}
                                        onChange={(e) => setQuickInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleQuickAnalyze()}
                                        className="flex-1 bg-transparent border-none text-gray-900 placeholder:text-gray-400 px-4 py-3 md:py-4 text-sm md:text-base focus:ring-0"
                                        placeholder="Paste email headers or content here..."
                                    />
                                    <button
                                        onClick={handleQuickAnalyze}
                                        className="bg-[#6366f2] hover:bg-[#6366f2]/90 text-white font-bold px-6 py-2 rounded-r-lg flex items-center gap-2 transition-colors"
                                    >
                                        <span className="hidden sm:inline">Analyze</span>
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Scans & API */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Recent Scans Table */}
                        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between p-5 border-b border-gray-200">
                                <h3 className="text-lg font-bold">Recent Scans</h3>
                                <Link href="/dashboard/history" className="text-[#6366f2] hover:text-[#6366f2]/80 text-sm font-medium flex items-center gap-1">
                                    View All <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            {initialScans.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <Radar className="h-12 w-12 mb-3 opacity-50" />
                                    <p className="font-medium">No scans yet</p>
                                    <p className="text-sm">Use the Quick Analysis above to scan your first email</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="px-5 py-3 font-medium">Subject / Source</th>
                                                <th className="px-5 py-3 font-medium">Risk Score</th>
                                                <th className="px-5 py-3 font-medium">Status</th>
                                                <th className="px-5 py-3 font-medium text-right">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {initialScans.map((scan) => (
                                                <tr key={scan.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/results/${scan.id}`)}>
                                                    <td className="px-5 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium truncate max-w-[200px]">{scan.subject}</span>
                                                            <span className="text-gray-500 text-xs">{scan.source}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div className={`h-full ${getScoreColor(scan.score)}`} style={{ width: `${scan.score}%` }} />
                                                            </div>
                                                            <span className="font-medium">{scan.score}/100</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(scan.status)}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${scan.status === 'Safe' ? 'bg-green-500' : scan.status === 'Suspicious' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                                            {scan.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right text-gray-500">{scan.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* API Access */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-6 gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Key className="h-5 w-5 text-[#6366f2]" />
                                    API Access
                                </h3>
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20">Active</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Your API Key</label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="password"
                                            disabled
                                            value="pk_live_demo_key_here"
                                            className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono tracking-wide opacity-70"
                                        />
                                    </div>
                                    <button
                                        onClick={handleCopyApiKey}
                                        className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                        title="Copy"
                                    >
                                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                    </button>
                                    <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Regenerate">
                                        <RefreshCw className="h-5 w-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Keep this key secret. Do not share it in client-side code.</p>
                            </div>

                            <hr className="border-gray-200" />

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Usage</label>
                                    <span className="text-sm font-bold">{stats.totalScans} / 1,000</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                    <div
                                        className="h-full bg-[#6366f2] rounded-full relative overflow-hidden transition-all"
                                        style={{ width: `${Math.min((stats.totalScans / 1000) * 100, 100)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <Link href="/api-docs" className="mt-auto w-full py-2.5 text-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-transparent">
                                Read Documentation
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
