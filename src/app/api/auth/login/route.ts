
import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/json-db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = authenticateUser(email, password);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
