import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const results = await sql`
            SELECT * FROM units WHERE id = ${id}
        `;

        if (results.length === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        const unit = results[0];
        const property = {
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
        };

        return NextResponse.json(property);
    } catch (error) {
        console.error("Error fetching property from Neon:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const tagsString = body.tags ? body.tags.join(',') : '';
        const imagesString = body.images ? body.images.join(',') : '';

        await sql`
            UPDATE units SET
                title = ${body.title},
                price = ${body.price},
                location = ${body.location},
                type = ${body.type},
                beds = ${body.beds},
                baths = ${body.baths},
                sqft = ${body.sqft},
                description = ${body.description},
                video_url = ${body.videoUrl},
                thumbnail_url = ${body.thumbnailUrl},
                images = ${imagesString},
                tags = ${tagsString},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating property in Neon:", error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await sql`
            DELETE FROM units WHERE id = ${id}
        `;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting property from Neon:", error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}
