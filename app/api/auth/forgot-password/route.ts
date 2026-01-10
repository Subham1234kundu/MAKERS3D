import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });

        if (!user) {
            // Return success even if user not found for security (prevent email enumeration)
            return NextResponse.json({ message: 'If an account exists with this email, a reset link will be sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Store reset token
        await db.collection('password_resets').updateOne(
            { email },
            {
                $set: {
                    token: resetToken,
                    expiry: resetExpiry,
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );

        // Send reset email
        await sendPasswordResetEmail({
            customerName: user.name || 'User',
            customerEmail: email,
            resetToken: resetToken
        });

        return NextResponse.json({ message: 'If an account exists with this email, a reset link will be sent.' });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
