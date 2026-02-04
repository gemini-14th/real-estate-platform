"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2, Check } from "lucide-react";
import CloudinaryUpload from "./cloudinary-upload";

interface ListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export default function ListingModal({ isOpen, onClose, onSuccess, initialData }: ListingModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        location: "",
        type: "Buy",
        beds: "",
        baths: "",
        sqft: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: initialData?.title || "",
                price: initialData?.price || "",
                location: initialData?.location || "",
                type: initialData?.type || "Buy",
                beds: initialData?.beds || "",
                baths: initialData?.baths || "",
                sqft: initialData?.sqft || "",
                description: initialData?.description || "",
                videoUrl: initialData?.videoUrl || "",
                thumbnailUrl: initialData?.thumbnailUrl || "",
            });
        }
    }, [isOpen, initialData]);

    // Reset form when initialData changes or modal opens
    // (In a real app, useEffect might be needed, but since we remount/control visibility, initial state might is tricky.
    // However, since we are doing a simple modal, we can initialize state directly if the component is conditionally rendered or we can use useEffect)

    // Better approach for modal reuse:
    // When `initialData` changes (i.e. we click edit on a different item), we need to update state.
    // However, hooks cannot be inside loops or conditionals.
    // The simplest way without complex useEffects is to key the modal on the parent, 
    // OR we just use a useEffect here to sync.

    // Let's use a key in the parent to force remount, 
    // OR just use useEffect here. useEffect is safer.

    // Actually, I'll just stick to standard functional component patterns.
    // Since I'm editing the file in place, let's add a useEffect to sync if isOpen changes or initialData changes.
    // But wait, React state initialized in `useState` only runs once. 
    // I will add a useEffect to reset the form data when `initialData` changes.

    const isEditing = !!initialData;

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditing ? `/api/properties/${initialData.id}` : "/api/properties";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    beds: Number(formData.beds),
                    baths: Number(formData.baths),
                    sqft: Number(formData.sqft),
                    tags: initialData?.tags || ["New Listing"],
                    agent: initialData?.agent || {
                        name: "Admin User",
                        avatar: "https://i.pravatar.cc/150?u=admin"
                    }
                }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const errorData = await res.json();
                alert(`Failed to ${isEditing ? 'update' : 'create'} listing: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error(error);
            alert(`Network error while ${isEditing ? 'updating' : 'creating'} listing`);
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

                <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Listing" : "Add New Listing"}</h2>

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
                                <option value="Buy">For Sale</option>
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
                            {formData.videoUrl && (
                                <p className="text-xs text-gray-500 break-all">{formData.videoUrl}</p>
                            )}

                            <CloudinaryUpload
                                label="Upload Property Thumbnail"
                                resourceType="image"
                                onUpload={(url: string) => setFormData({ ...formData, thumbnailUrl: url })}
                            />
                            {formData.thumbnailUrl && (
                                <p className="text-xs text-gray-500 break-all">{formData.thumbnailUrl}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Listing" : "Create Listing")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
