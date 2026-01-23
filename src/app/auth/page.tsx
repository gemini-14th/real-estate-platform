"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, Building2 } from "lucide-react";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Store user in localStorage
                localStorage.setItem("user", JSON.stringify(data));
                window.location.href = "/";
            } else {
                setError(data.error || "Authentication failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
            <Navbar />

            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Brand/Logo Section */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 text-black mb-6 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                            <Building2 size={32} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
                            {isLogin ? "Welcome Back" : "Join the Future"}
                        </h1>
                        <p className="text-gray-400">
                            {isLogin
                                ? "Experience the most immersive real estate platform."
                                : "Create your account to start saving your dream properties."
                            }
                        </p>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div
                                        key="name"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group/input">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors" size={20} />
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-700"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors" size={20} />
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-700"
                                        placeholder="name@email.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors" size={20} />
                                    <input
                                        required
                                        type="password"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-700"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 mt-4 bg-primary text-black font-black rounded-2xl hover:bg-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(var(--primary-rgb),0.2)] disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        {isLogin ? "Sign In" : "Create Account"}
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center px-2">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-zinc-900/50 px-4 text-gray-500 font-bold tracking-widest">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setLoading(true);
                                    // Mock Google Auth behavior
                                    setTimeout(() => {
                                        localStorage.setItem("user", JSON.stringify({
                                            id: "google-mock-id",
                                            name: "Google User",
                                            email: "user@gmail.com"
                                        }));
                                        window.location.href = "/";
                                    }, 1500);
                                }}
                                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-medium text-sm group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-gray-500">
                                {isLogin ? "New to ChrisUrban?" : "Already have an account?"}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-2 text-primary font-bold hover:underline"
                                >
                                    {isLogin ? "Sign Up Free" : "Log In"}
                                </button>
                            </p>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-xs text-gray-600 uppercase tracking-widest">
                        By continuing, you agree to our Terms and Privacy Policy.
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
