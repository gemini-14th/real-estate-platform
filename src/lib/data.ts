export interface Property {
    id: string;
    title: string;
    price: number;
    location: string;
    videoUrl: string;
    thumbnailUrl: string;
    description: string;
    beds: number;
    baths: number;
    sqft: number;
    type: "Sale" | "Rent";
    tags: string[];
    agent: {
        name: string;
        avatar: string;
    };
}

export const PROPERTIES: Property[] = [
    {
        id: "1",
        title: "Karen Country Home",
        price: 85000000,
        location: "Karen, Nairobi",
        videoUrl: "https://coverr.co/files/coverr-interior-design-of-a-living-room-with-a-yellow-sofa-2594/1080p.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop",
        description: "Experience the epitome of luxury living in this stunning modern villa in Karen. Featuring panoramic views, an infinity pool, and state-of-the-art smart home integration.",
        beds: 5,
        baths: 6,
        sqft: 6500,
        type: "Sale",
        tags: ["Luxury", "Pool", "View", "Garden"],
        agent: {
            name: "Alain Christian",
            avatar: "https://i.pravatar.cc/150?u=alain",
        },
    },
    {
        id: "2",
        title: "Westlands Sky Apartment",
        price: 150000,
        location: "Westlands, Nairobi",
        videoUrl: "https://coverr.co/files/coverr-modern-bedroom-with-large-windows-5712/1080p.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
        description: "Chic modern apartment in the heart of Westlands. High ceilings, panoramic city views, and walking distance to major malls.",
        beds: 2,
        baths: 2,
        sqft: 1200,
        type: "Rent",
        tags: ["City", "Modern", "Security"],
        agent: {
            name: "Alain Christian",
            avatar: "https://i.pravatar.cc/150?u=alain",
        },
    },
    {
        id: "3",
        title: "Diani Beach Villa",
        price: 45000000,
        location: "Diani, Kwale",
        videoUrl: "https://coverr.co/files/coverr-walking-through-a-modern-house-4536/1080p.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
        description: "Wake up to the sound of waves in this charming beachfront cottage. Private beach access and a spacious deck for sunset viewing.",
        beds: 4,
        baths: 4,
        sqft: 2800,
        type: "Sale",
        tags: ["Beach", "Holiday", "View"],
        agent: {
            name: "Alain Christian",
            avatar: "https://i.pravatar.cc/150?u=alain",
        },
    },
    {
        id: "4",
        title: "Kilimani Executive Suite",
        price: 180000,
        location: "Kilimani, Nairobi",
        videoUrl: "https://coverr.co/files/coverr-interior-of-a-luxury-apartment-2-4533/1080p.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
        description: "Fully furnished executive suite suitable for expatriates and business travelers. Includes gym and swimming pool access.",
        beds: 3,
        baths: 3,
        sqft: 2000,
        type: "Rent",
        tags: ["Furnished", "Gym", "Pool"],
        agent: {
            name: "Alain Christian",
            avatar: "https://i.pravatar.cc/150?u=alain",
        },
    },
    {
        id: "5",
        title: "Runda Family Estate",
        price: 120000000,
        location: "Runda, Nairobi",
        videoUrl: "https://coverr.co/files/coverr-family-house-garden-4535/1080p.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop",
        description: "Expansive family home sitting on half an acre in the prestigious Runda estate. Lush gardens, DSQ, and top-tier security.",
        beds: 6,
        baths: 7,
        sqft: 8000,
        type: "Sale",
        tags: ["Gated Community", "Garden", "Ambassadorial"],
        agent: {
            name: "Alain Christian",
            avatar: "https://i.pravatar.cc/150?u=alain",
        },
    },
];
