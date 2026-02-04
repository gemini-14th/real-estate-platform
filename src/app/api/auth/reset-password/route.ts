
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and new password required' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const user = await (prisma.user as any).findFirst({
            where: { resetToken: token }
        });

        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        // Update user and clear token
        await (prisma.user as any).update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return NextResponse.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
