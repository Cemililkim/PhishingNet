'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';
import { signIn, signInWithOAuth } from '@/lib/auth/actions';

export default function LoginPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await signIn(formData);
            if (result?.error) {
                setError(result.error);
            }
            // signIn redirects on success
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuth = async (provider: 'github' | 'google') => {
        try {
            await signInWithOAuth(provider);
        } catch {
            setError('OAuth sign in failed');
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
                {/* Hero Text */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold mb-3">Secure Authentication</h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Access your PhishingNet dashboard to monitor threats and manage scans.
                    </p>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-8 flex flex-col gap-6">
                        {/* Title */}
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">Welcome back</h3>
                            <p className="text-gray-500 text-sm mt-2">Sign in to your account to continue</p>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleOAuth('github')}
                                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <Github className="h-5 w-5" />
                                <span className="text-sm font-medium text-gray-700">GitHub</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuth('google')}
                                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4" />
                                    <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853" />
                                    <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 13.9945 1.51649 17.3853L5.50253 14.3003Z" fill="#FBBC05" />
                                    <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Google</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200" />
                            <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Or continue with
                            </span>
                            <div className="flex-grow border-t border-gray-200" />
                        </div>

                        {/* Form */}
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
                                        className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-[#6366f2] focus:ring-1 focus:ring-[#6366f2] text-gray-900 placeholder-gray-400 text-sm transition-all"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </label>

                            {/* Password */}
                            <label className="block">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Password</span>
                                    <Link href="/auth/forgot-password" className="text-xs font-medium text-[#6366f2] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className="w-full h-11 pl-10 pr-10 rounded-lg bg-gray-50 border border-gray-300 focus:border-[#6366f2] focus:ring-1 focus:ring-[#6366f2] text-gray-900 placeholder-gray-400 text-sm transition-all"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </label>

                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-[#6366f2] hover:bg-[#4f52d1] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#6366f2]/25 mt-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="font-medium text-[#6366f2] hover:underline">
                                Sign up
                            </Link>
                        </p>
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
