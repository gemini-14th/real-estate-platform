"use client";

import { useState } from "react";
import { X, Upload, Loader2, Check } from "lucide-react";
import CloudinaryUpload from "./cloudinary-upload";

interface AddListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddListingModal({ isOpen, onClose, onSuccess }: AddListingModalProps) {
    const [loading, setLoading] = useState(false);
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
    });

    if (!isOpen) return null;

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
                    tags: ["New Listing"], // Default tag
                    agent: {
                        name: "Admin User",
                        avatar: "https://i.pravatar.cc/150?u=admin"
                    }
                }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6">Add New Listing</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Title</label>
                            <input
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Modern Beach House"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Location</label>
                            <input
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Westlands, Nairobi"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Price (KES)</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="e.g. 15000000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Type</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Sale">For Sale</option>
                                <option value="Rent">For Rent</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Beds</label>
                            <input
                                type="number"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none"
                                value={formData.beds}
                                onChange={e => setFormData({ ...formData, beds: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Baths</label>
                            <input
                                type="number"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none"
                                value={formData.baths}
                                onChange={e => setFormData({ ...formData, baths: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Sqft</label>
                            <input
                                type="number"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none"
                                value={formData.sqft}
                                onChange={e => setFormData({ ...formData, sqft: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Description</label>
                        <textarea
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none h-24"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Media Inputs (Cloudinary Uploads) */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <h3 className="font-bold flex items-center gap-2">
                            <Upload size={18} /> Media
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <CloudinaryUpload
                                label="Upload Property Video"
                                resourceType="video"
                                onUpload={(url: string) => setFormData({ ...formData, videoUrl: url })}
                            />
                            <CloudinaryUpload
                                label="Upload Property Thumbnail"
                                resourceType="image"
                                onUpload={(url: string) => setFormData({ ...formData, thumbnailUrl: url })}
                            />
                        </div>

                        {formData.videoUrl && (
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <Check size={12} /> Video is ready
                            </p>
                        )}
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            {loading ? "Creating..." : "Create Listing"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
