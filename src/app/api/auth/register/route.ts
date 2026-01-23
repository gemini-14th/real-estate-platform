
import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/json-db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const user = registerUser({ email, password, name });
        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
