import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/neon';

export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
        }

        // Auto-initialize table on first request (could be moved elsewhere)
        await initDb();

        const units = await sql`
            SELECT * FROM units ORDER BY created_at DESC
        `;

        // Map database fields to frontend property interface
        const properties = units.map(unit => ({
            id: unit.id,
            title: unit.title,
            price: Number(unit.price),
            location: unit.location,
            type: unit.type === 'Sale' ? 'Buy' : unit.type,
            beds: unit.beds,
            baths: unit.baths,
            sqft: unit.sqft,
            description: unit.description,
            videoUrl: unit.video_url,
            thumbnailUrl: unit.thumbnail_url,
            images: unit.images ? unit.images.split(',') : (unit.thumbnail_url ? [unit.thumbnail_url] : []),
            tags: unit.tags ? unit.tags.split(',') : [],
            createdAt: unit.created_at,
            updatedAt: unit.updated_at,
            agent: {
                name: "Alain Christian",
                avatar: "https://i.pravatar.cc/150?u=alain"
            }
        }));

        return NextResponse.json(properties);
    } catch (error) {
        console.error("Error fetching properties from Neon:", error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 500 });
        }

        const body = await request.json();

        if (!body.title || !body.price) {
            return NextResponse.json({ error: 'Missing title or price' }, { status: 400 });
        }

        const id = crypto.randomUUID();
        const tagsString = body.tags ? body.tags.join(',') : '';
        const imagesString = body.images ? body.images.join(',') : '';

        console.log('Saving property to Neon:', { id, title: body.title, videoUrl: body.videoUrl, imagesString });

        await sql`
            INSERT INTO units (
                id, title, price, location, type, beds, baths, sqft, description, video_url, thumbnail_url, images, tags
            ) VALUES (
                ${id}, ${body.title}, ${body.price}, ${body.location}, ${body.type}, 
                ${body.beds}, ${body.baths}, ${body.sqft}, ${body.description}, 
                ${body.videoUrl}, ${body.thumbnailUrl}, ${imagesString}, ${tagsString}
            )
        `;

        return NextResponse.json({ id, ...body }, { status: 201 });
    } catch (error) {
        console.error("Error creating property in Neon:", error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
