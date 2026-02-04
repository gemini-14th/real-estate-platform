
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        // 1. Basic field presence
        if (!email || !password || !name) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Stronger Email Validation (Format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json({ error: 'Please provide a valid email address format' }, { status: 400 });
        }

        // 3. Password Strength (Optional but recommended)
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        // 4. Check if user already exists
        const existing = await (prisma.user as any).findUnique({
            where: { email: normalizedEmail }
        });

        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
        }

        // 5. HASH THE PASSWORD
        // salt rounds = 10 (industry standard)
        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        // 6. Create User
        const user = await (prisma.user as any).create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                name: name.trim()
            }
        });

        // Safe user without password
        const { password: _, ...safeUser } = user;
        return NextResponse.json(safeUser, { status: 201 });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: 'Internal system error' }, { status: 500 });
    }
}
