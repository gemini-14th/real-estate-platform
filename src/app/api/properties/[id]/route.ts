
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const property = await prisma.property.findUnique({
            where: { id }
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Parse tags
        const parsedProperty = {
            ...property,
            tags: typeof property.tags === 'string' ? JSON.parse(property.tags) : []
        };

        return NextResponse.json(parsedProperty);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.property.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Property not found or delete failed' }, { status: 404 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    try {
        // Prepare data for update, handling numeric fields and JSON strings
        const updateData: any = { ...body };
        if (body.price) updateData.price = Number(body.price);
        if (body.beds) updateData.beds = Number(body.beds);
        if (body.baths) updateData.baths = Number(body.baths);
        if (body.sqft) updateData.sqft = Number(body.sqft);
        if (body.tags) updateData.tags = JSON.stringify(body.tags);

        // Handle agent flattening if provided in body
        if (body.agent) {
            if (body.agent.name) updateData.agentName = body.agent.name;
            if (body.agent.avatar) updateData.agentAvatar = body.agent.avatar;
            delete updateData.agent;
        }

        const updated = await prisma.property.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: 'Property not found or update failed' }, { status: 404 });
    }
}
