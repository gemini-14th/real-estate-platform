
import { NextResponse } from 'next/server';
import { deleteProperty, updateProperty, getProperties } from '@/lib/json-db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const properties = getProperties();
    const property = properties.find((p: any) => p.id === id);

    if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    deleteProperty(id);
    return NextResponse.json({ success: true });
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const updated = updateProperty(id, body);

    if (!updated) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
}
