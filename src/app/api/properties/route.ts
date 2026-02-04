
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const properties = await (prisma.property as any).findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Convert back string tags to array for frontend
        const parsedProperties = properties.map((p: any) => ({
            ...p,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : []
        }));

        return NextResponse.json(parsedProperties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation 
        console.log("Creating property with:", { title: body.title, price: body.price, videoUrl: body.videoUrl });

        if (!body.title || !body.price) {
            return NextResponse.json({ error: 'Missing title or price' }, { status: 400 });
        }

        const finalVideoUrl = body.videoUrl || "https://coverr.co/files/coverr-interior-design-of-a-living-room-with-a-yellow-sofa-2594/1080p.mp4";

        const newProperty = await (prisma.property as any).create({
            data: {
                title: body.title,
                price: Number(body.price),
                location: body.location || "",
                videoUrl: finalVideoUrl,
                thumbnailUrl: body.thumbnailUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1080",
                description: body.description || "",
                beds: Number(body.beds || 0),
                baths: Number(body.baths || 0),
                sqft: Number(body.sqft || 0),
                type: body.type || "Buy",
                tags: JSON.stringify(body.tags || ["New Listing"]),
                agentName: body.agent?.name || "Admin User",
                agentAvatar: body.agent?.avatar || "https://i.pravatar.cc/150?u=admin"
            }
        });

        return NextResponse.json(newProperty, { status: 201 });
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
