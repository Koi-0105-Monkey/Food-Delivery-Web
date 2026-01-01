'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { useAuth } from '@/components/AuthProvider';
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            login(user);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-[#FE8C00] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🍔</span>
                    </div>
                    <h2 className="text-3xl font-bold text-[#181C2E]">Welcome Back</h2>
                    <p className="mt-2 text-[#878787]">Sign in to your account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#181C2E] mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#181C2E] mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#FE8C00] hover:bg-[#E67D00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE8C00] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-[#878787]">Don't have an account? </span>
                        <Link href="/signup" className="font-medium text-[#FE8C00] hover:text-[#E67D00]">
                            Sign up now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
