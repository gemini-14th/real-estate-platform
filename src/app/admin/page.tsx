"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Plus, Edit2, Trash2, Loader2, RefreshCcw, LogOut, LayoutDashboard, Home } from "lucide-react";
import ListingModal from "@/components/add-listing-modal";
import { Property } from "@/lib/data";

export default function AdminPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);

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
        if (!secret) {
            window.location.href = "/auth-admin";
            return;
        }
        fetchProperties();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_secret");
        window.location.href = "/";
    };

    const handleEdit = (property: Property) => {
        setEditingProperty(property);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProperty(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        try {
            const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchProperties();
            } else {
                const errorData = await res.json();
                alert(`Failed to delete: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Network error while deleting");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-28 md:py-32">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <LayoutDashboard size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Control Center</span>
                        </div>
                        <h1 className="text-4xl font-black text-white">Dashboard</h1>
                        <p className="text-gray-500 mt-2 font-medium">Manage your Kenyan real estate portfolio.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={fetchProperties}
                            className="p-4 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-colors border border-white/5 active:scale-95"
                        >
                            <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={() => {
                                setEditingProperty(null);
                                setIsModalOpen(true);
                            }}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                        >
                            <Plus size={20} />
                            New Listing
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="p-1 bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                                        <th className="px-8 py-6">Property</th>
                                        <th className="px-8 py-6 hidden md:table-cell">Price</th>
                                        <th className="px-8 py-6 hidden md:table-cell">Details</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Loader2 className="animate-spin text-primary" size={40} />
                                                    <p className="text-gray-500 font-medium">Loading listings...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : properties.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 text-gray-500">
                                                    <Home size={40} className="opacity-20" />
                                                    <p className="font-medium">No properties found. Start by creating one!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        properties.map((property) => (
                                            <tr key={property.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-20 h-14 rounded-xl overflow-hidden bg-black relative shrink-0 border border-white/5">
                                                            {property.thumbnailUrl ? (
                                                                <img src={property.thumbnailUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                            ) : (
                                                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                                    <Home className="text-gray-600" size={20} />
                                                                </div>
                                                            )}
                                                            <div className="absolute top-1 right-1 bg-primary text-black text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
                                                                {property.type}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-white truncate">{property.title}</h3>
                                                            <p className="text-xs text-gray-500 truncate">{property.location}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 hidden md:table-cell font-mono text-primary font-bold">
                                                    KSh {property.price.toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6 hidden md:table-cell">
                                                    <div className="flex gap-2">
                                                        <span className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-1 rounded-md">{property.beds} BEDS</span>
                                                        <span className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-1 rounded-md">{property.baths} BATHS</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleEdit(property)}
                                                            className="p-3 bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-xl transition-all"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(property.id!)}
                                                            className="p-3 bg-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/20 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-12">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-red-500 transition-colors font-bold text-sm bg-white/5 rounded-xl border border-white/5"
                    >
                        <LogOut size={18} />
                        Logout Section
                    </button>
                </div>

                <ListingModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={fetchProperties}
                    initialData={editingProperty}
                />
            </div>
        </div>
    );
}
