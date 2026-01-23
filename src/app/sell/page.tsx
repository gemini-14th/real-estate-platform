"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Building2, UserCircle2, Mail, Phone, MapPin } from "lucide-react";
import CloudinaryUpload from "@/components/cloudinary-upload";

export default function SellPage() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        location: "",
        type: "Sale",
        beds: "",
        baths: "",
        sqft: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        sellerName: "",
        sellerEmail: "",
        sellerPhone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    beds: Number(formData.beds),
                    baths: Number(formData.baths),
                    sqft: Number(formData.sqft),
                    tags: ["Owner Listed", "New"],
                    agent: {
                        name: formData.sellerName,
                        avatar: `https://i.pravatar.cc/150?u=${formData.sellerEmail}`
                    }
                }),
            });

            if (res.ok) {
                setStep(3); // Success step
            } else {
                alert("Failed to create listing");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating listing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-32">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-4 tracking-tight"
                    >
                        Sell Your Property <span className="text-primary italic">Faster</span>
                    </motion.h1>
                    <p className="text-gray-400 text-lg">List your home on the world's most immersive real estate platform.</p>
                </div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 bg-zinc-900 border border-white/5 rounded-3xl"
                    >
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <UserCircle2 className="text-primary" /> Contact Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">FullName</label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none"
                                    placeholder="John Doe"
                                    value={formData.sellerName}
                                    onChange={e => setFormData({ ...formData, sellerName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Email Address</label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none"
                                    placeholder="john@example.com"
                                    type="email"
                                    value={formData.sellerEmail}
                                    onChange={e => setFormData({ ...formData, sellerEmail: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none"
                                    placeholder="+254 7..."
                                    value={formData.sellerPhone}
                                    onChange={e => setFormData({ ...formData, sellerPhone: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!formData.sellerName || !formData.sellerEmail}
                            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            Continue to Listing Details <ArrowRight size={20} />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        <div className="p-8 bg-zinc-900 border border-white/5 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <Building2 className="text-primary" /> Property Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Property Title</label>
                                    <input required className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Modern Villa with Pool" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Location</label>
                                    <input required className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Karen, Nairobi" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Expected Price (KES)</label>
                                    <input type="number" required className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="e.g. 45,000,000" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Property Type</label>
                                    <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="Sale">For Sale</option>
                                        <option value="Rent">For Rent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Beds</label>
                                    <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none" value={formData.beds} onChange={e => setFormData({ ...formData, beds: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Baths</label>
                                    <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none" value={formData.baths} onChange={e => setFormData({ ...formData, baths: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Sqft</label>
                                    <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-primary focus:outline-none" value={formData.sqft} onChange={e => setFormData({ ...formData, sqft: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-zinc-900 border border-white/5 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <Mail className="text-primary" /> Media Upload
                            </h2>
                            <div className="space-y-6">
                                <CloudinaryUpload
                                    label="Upload Property Video"
                                    resourceType="video"
                                    onUpload={(url) => setFormData({ ...formData, videoUrl: url })}
                                />
                                <CloudinaryUpload
                                    label="Upload Property Photo"
                                    resourceType="image"
                                    onUpload={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={() => setStep(1)} className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-colors">Back</button>
                            <button
                                type="submit"
                                disabled={loading || !formData.videoUrl || !formData.thumbnailUrl}
                                className="flex-1 py-4 bg-primary text-black font-bold rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Submit Listing for Approval"}
                            </button>
                        </div>
                    </motion.form>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-zinc-900 border border-white/5 rounded-3xl"
                    >
                        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building2 size={40} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Listing Submitted!</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Thank you, {formData.sellerName}. We've received your property details for <strong>{formData.title}</strong>. Our team will review it and contact you shortly at {formData.sellerEmail}.
                        </p>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            Return Home
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
