
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        });

        if (!user) {
            // For security, don't reveal if user exists or not
            return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        // Generate a random token
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        await (prisma.user as any).update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry
            }
        });

        // In a real app, you would send an email here.
        // For now, we will log it to the console so the user can see it in their terminal.
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        console.log("------------------------------------------");
        console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
        console.log(`RESET URL: ${resetUrl}`);
        console.log("------------------------------------------");

        return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    } catch (error) {
        console.error("Reset request error:", error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
