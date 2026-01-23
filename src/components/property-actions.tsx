"use client";

import { useState } from "react";
import ContactModal from "@/components/contact-modal";

interface PropertyActionsProps {
    agent: {
        name: string;
        avatar: string;
    };
    propertyTitle: string;
}

export default function PropertyActions({ agent, propertyTitle }: PropertyActionsProps) {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-colors mb-3"
            >
                Schedule Tour
            </button>
            <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors"
            >
                Contact Agent
            </button>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                agent={agent}
                propertyTitle={propertyTitle}
            />
        </>
    );
}
