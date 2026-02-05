"use client";

import { useState } from "react";
import { X, User, Mail, Phone, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: {
        name: string;
        avatar: string;
    };
    propertyTitle: string;
}

export default function ContactModal({ isOpen, onClose, agent, propertyTitle }: ContactModalProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {status === 'success' ? (
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Inquiry Sent!</h2>
                            <p className="text-gray-400">
                                {agent.name} has been notified about your interest in <strong>{propertyTitle}</strong>. They will reach out to you shortly.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-8">
                                {agent.avatar ? (
                                    <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-primary">
                                        <span className="text-xl font-bold font-mono">{agent.name.charAt(0)}</span>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-400">Contact Agent for</p>
                                    <h3 className="text-xl font-bold">{agent.name}</h3>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            required
                                            type="email"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="+254 7..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 text-gray-500" size={18} />
                                        <textarea
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none transition-colors h-32"
                                            placeholder={`I'm interested in ${propertyTitle}...`}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-5 bg-primary text-black font-bold rounded-2xl hover:bg-primary/90 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? <Loader2 className="animate-spin" /> : "Send Inquiry"}
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
