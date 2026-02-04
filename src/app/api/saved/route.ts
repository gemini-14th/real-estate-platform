
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const propertyId = searchParams.get('propertyId');

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    try {
        if (propertyId) {
            const saved = await prisma.savedProperty.findUnique({
                where: {
                    userId_propertyId: {
                        userId,
                        propertyId
                    }
                }
            });
            return NextResponse.json({ saved: !!saved });
        }

        const savedProperties = await prisma.savedProperty.findMany({
            where: { userId },
            include: { property: true },
            orderBy: { createdAt: 'desc' }
        });

        // Flatten the response and parse tags
        const properties = savedProperties.map(s => ({
            ...s.property,
            tags: typeof s.property.tags === 'string' ? JSON.parse(s.property.tags) : []
        }));

        return NextResponse.json(properties);
    } catch (error) {
        console.error("Saved items fetch error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, propertyId } = body;

        if (!userId || !propertyId) {
            return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
        }

        // Toggle logic
        const existing = await prisma.savedProperty.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        if (existing) {
            await prisma.savedProperty.delete({
                where: {
                    userId_propertyId: {
                        userId,
                        propertyId
                    }
                }
            });
            return NextResponse.json({ saved: false });
        } else {
            await prisma.savedProperty.create({
                data: {
                    userId,
                    propertyId
                }
            });
            return NextResponse.json({ saved: true });
        }
    } catch (error) {
        console.error("Toggle saved error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
