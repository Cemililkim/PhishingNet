'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { resetPassword } from '@/lib/auth/actions';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await resetPassword(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSent(true);
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col relative overflow-x-hidden">
            {/* Background Glow Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6366f2]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white/50 backdrop-blur-md sticky top-0">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366f2]/20 text-[#6366f2]">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">PhishingNet</h1>
                </Link>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-12">
                {/* Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-8 flex flex-col gap-6">
                        {sent ? (
                            <>
                                {/* Success State */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Check your email</h3>
                                    <p className="text-gray-500 text-sm mt-2">
                                        We've sent a password reset link to <strong>{email}</strong>
                                    </p>
                                </div>

                                <Link
                                    href="/auth/login"
                                    className="w-full h-11 bg-[#6366f2] hover:bg-[#4f52d1] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#6366f2]/25 flex items-center justify-center"
                                >
                                    Back to Login
                                </Link>

                                <p className="text-center text-xs text-gray-400">
                                    Didn't receive the email? Check your spam folder or{' '}
                                    <button onClick={() => setSent(false)} className="text-[#6366f2] hover:underline">
                                        try again
                                    </button>
                                </p>
                            </>
                        ) : (
                            <>
                                {/* Form State */}
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold">Forgot password?</h3>
                                    <p className="text-gray-500 text-sm mt-2">
                                        No worries, we'll send you reset instructions.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email */}
                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-700">Email address</span>
                                        <div className="relative mt-2">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <Mail className="h-5 w-5" />
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-[#6366f2] focus:ring-1 focus:ring-[#6366f2] text-gray-900 placeholder-gray-400 text-sm transition-all"
                                                placeholder="name@company.com"
                                                required
                                            />
                                        </div>
                                    </label>

                                    {error && (
                                        <p className="text-sm text-red-600">{error}</p>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-11 bg-[#6366f2] hover:bg-[#4f52d1] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#6366f2]/25 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Sending...' : 'Reset Password'}
                                    </button>
                                </form>

                                {/* Back Link */}
                                <Link
                                    href="/auth/login"
                                    className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-gray-500 text-sm relative z-10">
                <p>© 2025 PhishingNet Security. All rights reserved.</p>
            </footer>
        </div>
    );
}
