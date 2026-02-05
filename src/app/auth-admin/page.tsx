"use client";

import { useState } from "react";
import { Shield, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AuthAdminPage() {
    const [secret, setSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secret: secret.trim() }),
            });

            if (res.ok) {
                localStorage.setItem("admin_secret", secret.trim());
                window.location.href = "/admin";
            } else {
                const data = await res.json();
                setError(data.error || "Invalid secret key. Access denied.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to verify secret key. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6">
                        <Shield size={40} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-500">Enter your secret key to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Secret Access Key</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 focus:border-primary focus:outline-none text-white text-center tracking-[0.5em] text-xl"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center font-medium bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Authenticate"}
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-center text-sm text-gray-500 hover:text-white transition-colors">
                            Return to site
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
