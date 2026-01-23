"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Heart, Loader2, Home, ArrowLeft } from "lucide-react";
import { Property } from "@/lib/data";

export default function SavedPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
            window.location.href = "/auth";
            return;
        }
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        async function fetchSaved() {
            try {
                const res = await fetch(`/api/saved?userId=${parsedUser.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProperties(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSaved();
    }, []);

    const removeSaved = async (propertyId: string) => {
        if (!user) return;

        // Optimistic update
        setProperties(properties.filter(p => p.id !== propertyId));

        await fetch("/api/saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, propertyId })
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black flex items-center gap-3">
                            <Heart className="text-primary fill-primary" /> My Collection
                        </h1>
                        <p className="text-gray-400 mt-2">Your personalized list of premium dream homes.</p>
                    </div>
                    <Link href="/search" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                        Browse More
                    </Link>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                ) : (
                    <>
                        {properties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {properties.map(property => (
                                    <div key={property.id} className="group relative bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                                        <Link href={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={property.thumbnailUrl}
                                                alt={property.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                        </Link>

                                        <button
                                            onClick={() => removeSaved(property.id)}
                                            className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-full text-primary border border-white/10 hover:bg-primary hover:text-black transition-all"
                                        >
                                            <Heart size={20} fill="currentColor" />
                                        </button>

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1">{property.title}</h3>
                                                    <p className="text-gray-400 text-sm">{property.location}</p>
                                                </div>
                                                <span className="text-primary font-black text-lg">KSh {property.price.toLocaleString()}</span>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                                <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    <span>{property.beds} Bed</span>
                                                    <span>{property.baths} Bath</span>
                                                    <span>{property.sqft} sqft</span>
                                                </div>
                                                <Link href={`/properties/${property.id}`} className="text-sm font-bold text-white hover:text-primary transition-colors">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-zinc-900/30 rounded-[3rem] border border-dashed border-white/10">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 text-gray-600 mb-6">
                                    <Home size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">No properties saved yet</h2>
                                <p className="text-gray-400 mb-8 max-w-xs mx-auto">Start exploring the finest properties and save the ones you love.</p>
                                <Link href="/search" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-all transform active:scale-[0.98]">
                                    Browse Marketplace
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
