import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/neon';

export async function POST(request: Request) {
    try {
        const { secret } = await request.json();

        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        await initDb();

        // Check if any admin exists. If not, we allow the initial secret from .env
        const admins = await sql`SELECT * FROM admins LIMIT 1`;

        if (admins.length === 0) {
            // First time setup: allow the secret from .env
            const initialSecret = process.env.ADMIN_INITIAL_SECRET || 'admin123';
            if (secret === initialSecret) {
                return NextResponse.json({ success: true, message: 'Initial access granted' });
            }
        } else {
            // Check against DB
            const validAdmin = await sql`SELECT * FROM admins WHERE secret_key = ${secret} LIMIT 1`;
            if (validAdmin.length > 0) {
                return NextResponse.json({ success: true });
            }
        }

        return NextResponse.json({ error: 'Invalid secret key' }, { status: 401 });
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
