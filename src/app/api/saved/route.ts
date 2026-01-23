
import { NextResponse } from 'next/server';
import { toggleSavedProperty, getUserSavedProperties, isPropertySaved } from '@/lib/json-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const propertyId = searchParams.get('propertyId');

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    if (propertyId) {
        const saved = isPropertySaved(userId, propertyId);
        return NextResponse.json({ saved });
    }

    const properties = getUserSavedProperties(userId);
    return NextResponse.json(properties);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, propertyId } = body;

        if (!userId || !propertyId) {
            return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
        }

        const saved = toggleSavedProperty(userId, propertyId);
        return NextResponse.json({ saved });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
