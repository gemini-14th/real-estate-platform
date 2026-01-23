"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
// import { PROPERTIES } from "@/lib/data"; // Use API
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Property } from "@/lib/data";

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get("type") || "All";

    const [query, setQuery] = useState("");
    const [type, setType] = useState(initialType);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/properties");
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
        fetchData();
    }, []);

    const filtered = properties.filter(p => {
        const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.location.toLowerCase().includes(query.toLowerCase());
        const matchesType = type === "All" || p.type === type;
        return matchesQuery && matchesType;
    });

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">

                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h1 className="text-3xl font-bold mb-6">Find Your Dream Property</h1>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search in Westlands, Diani, or by features..."
                            className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        {["All", "Sale", "Rent"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`px-6 py-2 rounded-full border transition-colors ${type === t
                                    ? "bg-primary text-black border-primary font-bold"
                                    : "bg-transparent border-white/10 text-gray-400 hover:border-white/30"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-3 py-20 flex justify-center text-gray-500">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : (
                        <>
                            {filtered.map(property => (
                                <Link href={`/properties/${property.id}`} key={property.id} className="group block relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5">
                                    <div className="absolute inset-0">
                                        <img src={property.thumbnailUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="flex justify-between items-end mb-1">
                                            <h3 className="font-bold text-xl truncate">{property.title}</h3>
                                            <span className="font-bold text-primary">KSh {property.price.toLocaleString()}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm flex items-center gap-1">
                                            {property.location}
                                        </p>
                                    </div>

                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                        {property.type}
                                    </div>
                                </Link>
                            ))}

                            {filtered.length === 0 && !loading && (
                                <div className="col-span-3 text-center py-20 text-gray-500">
                                    <p>No properties found matching your criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
