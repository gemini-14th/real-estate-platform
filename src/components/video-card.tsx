"use client";

import { useRef, useEffect, useState } from "react";
import { Property } from "@/lib/data";
import { Heart, MapPin, Share2, Volume2, VolumeX, Info, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ContactModal from "./contact-modal";

interface VideoCardProps {
    property: Property;
    isActive: boolean;
}

export default function VideoCard({ property, isActive }: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkSaved = async () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser && isActive) {
                const user = JSON.parse(savedUser);
                const res = await fetch(`/api/saved?userId=${user.id}&propertyId=${property.id}`);
                const data = await res.json();
                setIsSaved(data.saved);
            }
        };
        checkSaved();
    }, [property.id, isActive]);

    const toggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
            window.location.href = "/auth";
            return;
        }

        const user = JSON.parse(savedUser);
        setIsSaved(!isSaved); // Optimistic update

        await fetch("/api/saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, propertyId: property.id })
        });
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = typeof window !== 'undefined' ? window.location.origin + `/properties/${property.id}` : '';
        if (navigator.share) {
            navigator.share({
                title: property.title,
                text: property.description,
                url: url,
            });
        } else {
            alert("Link copied to clipboard!");
            navigator.clipboard.writeText(url);
        }
    };

    useEffect(() => {
        if (isActive) {
            const playPromise = videoRef.current?.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error: any) => {
                        console.log("Autoplay prevented:", error);
                        setIsPlaying(false);
                    });
            }
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
        }
    }, [isActive]);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="relative h-screen w-full snap-start overflow-hidden bg-black">
            {/* Video Player */}
            <video
                ref={videoRef}
                src={property.videoUrl}
                className="h-full w-full object-cover"
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
                poster={property.thumbnailUrl}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

            {/* Contols & Info */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Top Bar */}
                <div className="flex justify-between items-start pt-12 md:pt-4">
                    {/* Price Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white font-semibold"
                    >
                        KSh {property.price.toLocaleString()} {property.type === 'Rent' ? '/mo' : ''}
                    </motion.div>

                    {/* Mute Button */}
                    <button
                        onClick={toggleMute}
                        className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>

                {/* Bottom Info */}
                <div className="flex flex-col gap-4 pb-20 md:pb-8">
                    <div className="flex items-end justify-between">
                        <div className="flex-1 space-y-2 pointer-events-auto">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl font-bold text-white leading-tight"
                            >
                                {property.title}
                            </motion.h2>

                            <div className="flex items-center text-gray-200 gap-2">
                                <MapPin size={16} className="text-primary" />
                                <span className="text-sm font-medium">{property.location}</span>
                            </div>

                            <div className="flex gap-3 text-sm text-gray-300">
                                <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm">{property.beds} Beds</span>
                                <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm">{property.baths} Baths</span>
                                <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm">{property.sqft} sqft</span>
                            </div>
                        </div>

                        {/* Side Actions (Like, Share, Details) */}
                        <div className="flex flex-col gap-4 pointer-events-auto ml-4">
                            <button
                                onClick={toggleSave}
                                className={cn(
                                    "flex flex-col items-center gap-1 transition-colors group",
                                    isSaved ? "text-red-500" : "text-white hover:text-primary"
                                )}
                            >
                                <div className={cn(
                                    "p-3 backdrop-blur-md rounded-full border transition-transform group-hover:scale-110",
                                    isSaved ? "bg-red-500/20 border-red-500/50" : "bg-black/40 border-white/10"
                                )}>
                                    <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
                                </div>
                                <span className="text-xs font-medium">{isSaved ? "Saved" : "Save"}</span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex flex-col items-center gap-1 text-white hover:text-primary transition-colors group"
                            >
                                <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 group-hover:scale-110 transition-transform">
                                    <Share2 size={24} />
                                </div>
                                <span className="text-xs font-medium">Share</span>
                            </button>

                            <Link href={`/properties/${property.id}`} className="flex flex-col items-center gap-1 text-white hover:text-primary transition-colors group">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/5 group-hover:scale-110 transition-transform">
                                    <Info size={24} />
                                </div>
                                <span className="text-xs font-medium">Details</span>
                            </Link>

                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="flex flex-col items-center gap-1 text-white hover:text-primary transition-colors group"
                            >
                                <div className="p-3 bg-primary text-black rounded-full border border-primary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                                    <MessageSquare size={24} />
                                </div>
                                <span className="text-xs font-medium text-primary">Contact</span>
                            </button>
                        </div>
                    </div>
                </div>

                <ContactModal
                    isOpen={isContactModalOpen}
                    onClose={() => setIsContactModalOpen(false)}
                    agent={property.agent}
                    propertyTitle={property.title}
                />
            </div>
        </div>
    );
}
