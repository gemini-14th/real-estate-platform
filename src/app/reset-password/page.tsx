
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2, Building2, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/navbar";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = "/auth";
                }, 3000);
            } else {
                setError(data.error || "Failed to reset password.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center p-8 bg-zinc-900/50 rounded-[2rem] border border-white/10">
                <p className="text-red-500 font-bold">Invalid reset link. Please request a new one.</p>
                <a href="/auth" className="mt-4 inline-block text-primary hover:underline font-bold">Back to Login</a>
            </div>
        );
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-12 bg-zinc-900/50 rounded-[2rem] border border-white/10"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-500 mb-6">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Password Updated!</h2>
                <p className="text-gray-400 mb-6">Your password has been changed successfully. Redirecting to login...</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3 }}
                        className="h-full bg-primary"
                    />
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors" size={20} />
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-12 py-4 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            <span className="text-[10px] font-black">{showPassword ? "HIDE" : "SHOW"}</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-black font-black rounded-2xl hover:bg-white transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                            Reset Password
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
            <Navbar />

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
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 text-black mb-6 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                            <Building2 size={32} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">New Password</h1>
                        <p className="text-gray-400">Please choose a strong password for your account.</p>
                    </div>

                    <Suspense fallback={<div className="text-center"><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </motion.div>
            </main>
        </div>
    );
}
