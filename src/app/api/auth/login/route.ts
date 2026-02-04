
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user
        const user = await (prisma.user as any).findUnique({
            where: {
                email: normalizedEmail
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // COMPARE HASHED PASSWORD
        const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const { password: _, ...safeUser } = user;
        return NextResponse.json(safeUser);
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
