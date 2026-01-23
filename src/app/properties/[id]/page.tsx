
import { getProperties } from "@/lib/json-db";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowLeft, Share2, Heart, MapPin, Bed, Bath, Move, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { Property } from "@/lib/data";
import PropertyActions from "@/components/property-actions";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // In a real app with fetch, we would do:
    // const res = await fetch(`http://localhost:3000/api/properties/${id}`, { cache: 'no-store' });
    // const property = await res.json();
    // But since this is a server component in the same project, we can read the DB directly!
    const properties = getProperties();
    const property = properties.find((p: any) => p.id === id) as Property;

    if (!property) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            {/* Hero Video Section - shorter height than reel, but still immersive */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <video
                    src={property.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={property.thumbnailUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

                <div className="absolute top-24 left-6 md:left-12">
                    <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                        <ArrowLeft size={18} />
                        <span>Back to Reel</span>
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">{property.title}</h1>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <MapPin size={18} className="text-primary" />
                                    <span className="text-lg">{property.location}</span>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <span className="text-4xl font-bold text-primary">
                                    KSh {property.price.toLocaleString()}
                                    {property.type === 'Rent' && <span className="text-lg text-white font-normal">/mo</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Mobile Price (Hidden on Desktop) */}
                <div className="md:hidden flex items-center justify-between mb-8">
                    <span className="text-3xl font-bold text-primary">
                        KSh {property.price.toLocaleString()}
                        {property.type === 'Rent' && <span className="text-lg text-white font-normal">/mo</span>}
                    </span>
                    <div className="flex gap-3">
                        <button className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
                            <Share2 size={20} />
                        </button>
                        <button className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Stats */}
                        <div className="flex justify-between p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-1">
                                <Bed size={24} className="text-primary mb-1" />
                                <span className="font-bold text-lg">{property.beds}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Beds</span>
                            </div>
                            <div className="w-px bg-white/10" />
                            <div className="flex flex-col items-center gap-1">
                                <Bath size={24} className="text-primary mb-1" />
                                <span className="font-bold text-lg">{property.baths}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Baths</span>
                            </div>
                            <div className="w-px bg-white/10" />
                            <div className="flex flex-col items-center gap-1">
                                <Move size={24} className="text-primary mb-1" />
                                <span className="font-bold text-lg">{property.sqft}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Sqft</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">About this property</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Amenities</h3>
                            <div className="flex flex-wrap gap-3">
                                {(property.tags || []).map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-zinc-900 rounded-lg text-sm font-medium border border-white/5 flex items-center gap-2">
                                        <Check size={14} className="text-primary" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Location Map Placeholder */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Location</h3>
                            <div className="h-64 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=600x300&maptype=roadmap&style=feature:all|element:all|saturation:-100|lightness:-60')] bg-cover opacity-50" />
                                <button className="relative z-10 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2">
                                    <MapPin size={18} />
                                    View on Map
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm">Exact location provided upon booking or viewing request.</p>
                        </div>
                    </div>

                    {/* Sidebar / Agent Card */}
                    <div className="space-y-6">
                        <div className="p-6 bg-zinc-900/80 border border-white/5 rounded-2xl sticky top-24">
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={property.agent.avatar}
                                    alt={property.agent.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                                />
                                <div>
                                    <p className="text-sm text-gray-400">Listed by</p>
                                    <h4 className="text-lg font-bold">{property.agent.name}</h4>
                                </div>
                            </div>

                            <PropertyActions
                                agent={property.agent}
                                propertyTitle={property.title}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
