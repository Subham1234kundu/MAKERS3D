import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase('makers3d_db');
        const otpsCollection = db.collection('otps');
        const usersCollection = db.collection('users');

        // Find OTP
        const otpRecord = await otpsCollection.findOne({ email, otp });

        if (!otpRecord) {
            return NextResponse.json(
                { message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // Check expiry
        if (new Date() > new Date(otpRecord.expiry)) {
            return NextResponse.json(
                { message: 'OTP has expired' },
                { status: 400 }
            );
        }

        // Update user status
        await usersCollection.updateOne(
            { email },
            { $set: { isVerified: true } }
        );

        // Delete OTP record
        await otpsCollection.deleteOne({ email });

        // Get user for welcome email
        const user = await usersCollection.findOne({ email });

        // Send welcome email (non-blocking)
        if (user) {
            const { sendWelcomeEmail } = await import('@/lib/email-service');
            sendWelcomeEmail({
                customerName: user.name,
                customerEmail: user.email,
            }).catch(err => console.error('Welcome email error:', err));
        }

        return NextResponse.json(
            { message: 'OTP verified successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('OTP verification error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
