"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Plus, Edit2, Trash2, Loader2, RefreshCcw, LogOut } from "lucide-react";
import AddListingModal from "@/components/add-listing-modal";
import { Property } from "@/lib/data";

export default function AdminPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/properties");
            if (res.ok) {
                const data = await res.json();
                setProperties(data);
            }
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const secret = localStorage.getItem("admin_secret");
        if (secret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
            window.location.href = "/";
            return;
        }
        fetchProperties();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_secret");
        window.location.href = "/";
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        try {
            const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchProperties();
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-24">

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage your real estate listings and content.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                        <button
                            onClick={fetchProperties}
                            className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                        >
                            <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            Add New Listing
                        </button>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="p-6 bg-zinc-900 border border-white/5 rounded-2xl">
                        <div className="grid grid-cols-12 gap-4 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">
                            <div className="col-span-12 md:col-span-5">Property</div>
                            <div className="col-span-6 md:col-span-2 hidden md:block">Price</div>
                            <div className="col-span-6 md:col-span-2 hidden md:block">Type</div>
                            <div className="col-span-6 md:col-span-3 text-right">Actions</div>
                        </div>

                        {isLoading ? (
                            <div className="py-20 flex justify-center text-gray-500">
                                <Loader2 size={32} className="animate-spin mb-2" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {properties.map((property) => (
                                    <div key={property.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-colors border border-transparent hover:border-white/5">
                                        <div className="col-span-5 flex items-center gap-4">
                                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-800 relative shrink-0">
                                                <video src={property.videoUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold truncate">{property.title}</h3>
                                                <p className="text-sm text-gray-400 truncate">{property.location}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 font-medium hidden md:block text-sm">
                                            KSh {property.price.toLocaleString()}
                                        </div>

                                        <div className="col-span-2 hidden md:block">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${property.type === 'Sale'
                                                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                }`}>
                                                For {property.type}
                                            </span>
                                        </div>

                                        <div className="col-span-12 md:col-span-3 flex justify-end gap-2 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <AddListingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchProperties}
                />
            </div>
        </div>
    );
}
