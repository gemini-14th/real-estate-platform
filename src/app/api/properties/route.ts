
import { NextResponse } from 'next/server';
import { getProperties, addProperty } from '@/lib/json-db';

export async function GET() {
    try {
        const properties = getProperties();
        return NextResponse.json(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation 
        if (!body.title || !body.price || !body.videoUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newProperty = addProperty({
            ...body,
            createdAt: new Date().toISOString(),
            agent: body.agent || {
                name: "System Agent",
                avatar: "https://i.pravatar.cc/150?u=system"
            },
            tags: body.tags || ["New"]
        });

        return NextResponse.json(newProperty, { status: 201 });
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
