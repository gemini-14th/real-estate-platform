"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { Lock, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAuthPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Robust comparison with trimming
        const cleanPassword = password?.trim();
        const cleanSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET?.trim();

        console.log("Input length:", cleanPassword?.length);
        console.log("Secret loaded:", !!cleanSecret);

        if (cleanPassword && cleanSecret && cleanPassword === cleanSecret) {
            localStorage.setItem("admin_secret", cleanPassword);
            setSuccess(true);
            setError(false);
            // Reload to update navbar
            setTimeout(() => {
                window.location.href = "/admin";
            }, 1000);
        } else {
            console.log("Login failed");
            setError(true);
            setSuccess(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 bg-zinc-900 border border-white/10 rounded-3xl"
                >
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-primary/20 rounded-2xl">
                            <Lock className="text-primary" size={32} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center mb-2">Admin Portal</h1>
                    <p className="text-gray-400 text-center mb-8">Enter the secret key to unlock admin privileges.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider px-1">Secret Key</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-4 focus:border-primary focus:outline-none transition-all`}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                            >
                                <AlertCircle size={16} />
                                <span>Incorrect secret key. Access denied.</span>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 p-3 rounded-xl border border-green-500/20"
                            >
                                <ShieldCheck size={16} />
                                <span>Success! Redirecting to dashboard...</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
                        >
                            Unlock Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
