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
    Trash2,
    ArrowLeft,
    Filter,
    Radar,
} from 'lucide-react';
import { signOut } from '@/lib/auth/actions';
import { deleteScan } from '@/lib/data/scans';
import type { User } from '@supabase/supabase-js';

interface ScanDisplay {
    id: string;
    subject: string;
    source: string;
    score: number;
    status: string;
    time: string;
}

interface HistoryContentProps {
    user: User;
    scans: ScanDisplay[];
}

export default function HistoryContent({ user, scans: initialScans }: HistoryContentProps) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scans, setScans] = useState(initialScans);
    const [filter, setFilter] = useState<'all' | 'safe' | 'suspicious' | 'phishing'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

    const handleSignOut = async () => {
        await signOut();
    };

    const handleDelete = async (scanId: string) => {
        const result = await deleteScan(scanId);
        if (result.success) {
            setScans(scans.filter(s => s.id !== scanId));
        }
    };

    const filteredScans = scans.filter(scan => {
        const matchesFilter = filter === 'all' ||
            (filter === 'safe' && scan.status === 'Safe') ||
            (filter === 'suspicious' && scan.status === 'Suspicious') ||
            (filter === 'phishing' && scan.status === 'Phishing');

        const matchesSearch = !searchQuery ||
            scan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scan.source.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Safe': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Suspicious': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Phishing': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'bg-red-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-40 w-64 flex flex-col border-r border-gray-200 bg-white h-full transition-transform`}>
                <div className="flex flex-col h-full p-4 justify-between">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="bg-[#6366f2]/20 rounded-xl size-10 flex items-center justify-center text-[#6366f2]">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold leading-none">PhishingNet</h1>
                                <p className="text-gray-500 text-xs font-medium mt-1">Security Dashboard</p>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-1">
                            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
                                <LayoutDashboard className="h-5 w-5" />
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link href="/dashboard/history" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#6366f2] text-white shadow-md shadow-[#6366f2]/20">
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

                    <div className="mt-auto border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                            <div className="bg-[#6366f2] rounded-full size-10 flex items-center justify-center text-white font-bold text-sm">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{userName}</p>
                                <p className="text-gray-500 text-xs truncate">{user.email}</p>
                            </div>
                            <button onClick={handleSignOut} className="text-gray-400 hover:text-gray-600">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <main className="flex-1 overflow-y-auto h-full">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-[#6366f2]">
                        <Shield className="h-5 w-5" />
                        <span className="font-bold text-gray-900">PhishingNet</span>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500">
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                <div className="p-6 md:p-10 max-w-[1400px] mx-auto flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Scan History</h1>
                            <p className="text-gray-500">View and manage all your previous email scans</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[200px] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by subject or email..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white border border-gray-200 focus:border-[#6366f2] focus:ring-1 focus:ring-[#6366f2] text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as typeof filter)}
                                className="h-10 px-3 rounded-lg bg-white border border-gray-200 text-sm focus:border-[#6366f2] focus:ring-1 focus:ring-[#6366f2]"
                            >
                                <option value="all">All Status</option>
                                <option value="safe">Safe</option>
                                <option value="suspicious">Suspicious</option>
                                <option value="phishing">Phishing</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {filteredScans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <Radar className="h-12 w-12 mb-3 opacity-50" />
                                <p className="font-medium">No scans found</p>
                                <p className="text-sm">{scans.length === 0 ? 'Start by scanning your first email' : 'Try adjusting your filters'}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">Subject / Source</th>
                                            <th className="px-5 py-3 font-medium">Risk Score</th>
                                            <th className="px-5 py-3 font-medium">Status</th>
                                            <th className="px-5 py-3 font-medium">Time</th>
                                            <th className="px-5 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredScans.map((scan) => (
                                            <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 cursor-pointer" onClick={() => router.push(`/results/${scan.id}`)}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium truncate max-w-[250px]">{scan.subject}</span>
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
                                                <td className="px-5 py-4 text-gray-500">{scan.time}</td>
                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(scan.id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Delete scan"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Showing {filteredScans.length} of {scans.length} scans
                    </p>
                </div>
            </main>
        </div>
    );
}
