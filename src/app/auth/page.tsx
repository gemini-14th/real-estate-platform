
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Building2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";

export default function AuthPage() {
    type Mode = "login" | "register" | "forgot";
    const [mode, setMode] = useState<Mode>("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    });

    const isLogin = mode === "login";
    const isRegister = mode === "register";
    const isForgot = mode === "forgot";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const email = formData.email.trim().toLowerCase();
        const password = formData.password.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        if (isForgot) {
            try {
                const res = await fetch("/api/auth/reset-request", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                if (res.ok) {
                    setMessage(data.message);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const payload = isLogin ? { email, password } : { email, password, name: formData.name };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
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
                        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
                            {isForgot ? "Reset Password" : isLogin ? "Welcome Back" : "Join the Future"}
                        </h1>
                        <p className="text-gray-400">
                            {isForgot
                                ? "Enter your email to receive a reset link."
                                : isLogin
                                    ? "Experience the most immersive real estate platform."
                                    : "Create your account to start saving dream properties."
                            }
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="wait">
                                {isRegister && (
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

                            {!isForgot && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                                        {isLogin && (
                                            <button
                                                type="button"
                                                onClick={() => setMode("forgot")}
                                                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
                                            >
                                                Forgot?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors" size={20} />
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-12 py-4 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-700"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
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
                            )}

                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                                    {error}
                                </motion.div>
                            )}
                            {message && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm text-center">
                                    {message}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-black font-black rounded-2xl hover:bg-white transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                    <>
                                        {isForgot ? "Send Link" : isLogin ? "Sign In" : "Create Account"}
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            {isForgot ? (
                                <button onClick={() => setMode("login")} className="flex items-center gap-2 text-primary font-bold hover:underline mx-auto">
                                    <ArrowLeft size={16} /> Back to Login
                                </button>
                            ) : (
                                <p className="text-gray-500">
                                    {isLogin ? "New here?" : "Joined before?"}
                                    <button onClick={() => setMode(isLogin ? "register" : "login")} className="ml-2 text-primary font-bold hover:underline">
                                        {isLogin ? "Sign Up" : "Log In"}
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
