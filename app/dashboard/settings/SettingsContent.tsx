'use client';

import { useState } from 'react';
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
    User,
    Bell,
    Lock,
    Trash2,
    ArrowLeft,
    Mail,
    Save,
    Check,
} from 'lucide-react';
import { signOut } from '@/lib/auth/actions';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SettingsContentProps {
    user: SupabaseUser;
}

export default function SettingsContent({ user }: SettingsContentProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [displayName, setDisplayName] = useState(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const userName = displayName || user.email?.split('@')[0] || 'User';

    const handleSignOut = async () => {
        await signOut();
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                data: { full_name: displayName }
            });

            if (!error) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch {
            console.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
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
                            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#6366f2] text-white shadow-md shadow-[#6366f2]/20">
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

                <div className="p-6 md:p-10 max-w-[800px] mx-auto flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Settings</h1>
                            <p className="text-gray-500">Manage your account and preferences</p>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="h-5 w-5 text-[#6366f2]" />
                            <h2 className="text-lg font-bold">Profile</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Display Name</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="mt-2 w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-[#6366f2] focus:ring-1 focus:ring-[#6366f2] text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-2 flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-600">{user.email}</span>
                                    <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="h-5 w-5 text-[#6366f2]" />
                            <h2 className="text-lg font-bold">Notifications</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-gray-500">Receive alerts for high-risk scans</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                    className="h-5 w-5 rounded text-[#6366f2] focus:ring-[#6366f2]"
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="font-medium">Weekly Report</p>
                                    <p className="text-sm text-gray-500">Get a summary of your scans every week</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={weeklyReport}
                                    onChange={(e) => setWeeklyReport(e.target.checked)}
                                    className="h-5 w-5 rounded text-[#6366f2] focus:ring-[#6366f2]"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="h-5 w-5 text-[#6366f2]" />
                            <h2 className="text-lg font-bold">Security</h2>
                        </div>

                        <div className="space-y-4">
                            <Link
                                href="/auth/reset-password"
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium">Change Password</p>
                                    <p className="text-sm text-gray-500">Update your account password</p>
                                </div>
                                <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                            </Link>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            <h2 className="text-lg font-bold text-red-500">Danger Zone</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Delete Account</p>
                                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-11 bg-[#6366f2] hover:bg-[#4f52d1] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#6366f2]/25 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save className="h-5 w-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </main>
        </div>
    );
}
