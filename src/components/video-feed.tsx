"use client";

import { useEffect, useRef, useState } from "react";
// import { PROPERTIES } from "@/lib/data"; // Use API instead
import { Property } from "@/lib/data";
import VideoCard from "./video-card";
import { Loader2 } from "lucide-react";
import ContactModal from "./contact-modal";

export default function VideoFeed() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/properties");
                if (res.ok) {
                    const data = await res.json();
                    setProperties(data);
                }
            } catch (error) {
                console.error("Failed to fetch feed:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || loading || properties.length === 0) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollTop / container.clientHeight);
            if (index !== activeIndex && index >= 0 && index < properties.length) {
                setActiveIndex(index);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [activeIndex, loading, properties]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black text-white">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <section
            ref={containerRef}
            className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black scroll-smooth"
        >
            {properties.map((property, index) => (
                <VideoCard
                    key={property.id}
                    property={property}
                    isActive={index === activeIndex}
                />
            ))}

            {/* End of Feed / Footer Call to Action */}
            <div className="h-screen w-full snap-start flex items-center justify-center bg-zinc-900 text-white">
                <div className="text-center p-8">
                    <h2 className="text-4xl font-bold mb-4">That's all for now!</h2>
                    <p className="text-gray-400 mb-8">Check back later for more exclusive listings.</p>
                    <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="px-8 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors"
                    >
                        Contact an Agent
                    </button>
                </div>

                <ContactModal
                    isOpen={isContactModalOpen}
                    onClose={() => setIsContactModalOpen(false)}
                    agent={{ name: "Premium Agent", avatar: "https://i.pravatar.cc/150?u=premium" }}
                    propertyTitle="General Inquiry"
                />
            </div>
        </section>
    );
}
