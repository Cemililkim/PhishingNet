'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, EyeOff, CheckCircle, KeyRound } from 'lucide-react';
import { updatePassword } from '@/lib/auth/actions';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Password strength calculation
    const getPasswordStrength = () => {
        if (!password) return { level: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
        if (strength === 2) return { level: 2, label: 'Medium', color: 'bg-yellow-500' };
        if (strength === 3) return { level: 3, label: 'Strong', color: 'bg-green-500' };
        return { level: 4, label: 'Very Strong', color: 'bg-green-600' };
    };

    const strength = getPasswordStrength();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('password', password);

        try {
            const result = await updatePassword(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                setSuccess(true);
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
                        {success ? (
                            <>
                                {/* Success State */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Password Updated!</h3>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Your password has been successfully reset. You can now sign in with your new password.
                                    </p>
                                </div>

                                <Link
                                    href="/auth/login"
                                    className="w-full h-11 bg-[#6366f2] hover:bg-[#4f52d1] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#6366f2]/25 flex items-center justify-center"
                                >
                                    Sign In
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Form State */}
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold">Reset your password</h3>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Enter your new password below.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* New Password */}
                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-700">New Password</span>
                                        <div className="relative mt-2">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <Lock className="h-5 w-5" />
                                            </span>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full h-11 pl-10 pr-10 rounded-lg bg-gray-50 border border-gray-300 focus:border-[#6366f2] focus:ring-1 focus:ring-[#6366f2] text-gray-900 placeholder-gray-400 text-sm transition-all"
                                                placeholder="Enter new password"
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
                                        {/* Strength Indicator */}
                                        {password && (
                                            <>
                                                <div className="flex gap-1 mt-2 h-1 w-full">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-full flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className={`text-xs mt-1 ${strength.level <= 1 ? 'text-red-500' :
                                                        strength.level === 2 ? 'text-yellow-500' : 'text-green-500'
                                                    }`}>
                                                    {strength.label} strength
                                                </p>
                                            </>
                                        )}
                                    </label>

                                    {/* Confirm Password */}
                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-700">Confirm Password</span>
                                        <div className="relative mt-2">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <KeyRound className="h-5 w-5" />
                                            </span>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-[#6366f2] focus:ring-1 focus:ring-[#6366f2] text-gray-900 placeholder-gray-400 text-sm transition-all"
                                                placeholder="Confirm new password"
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
                                        {isLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
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
