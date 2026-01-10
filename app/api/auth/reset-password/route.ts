import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const resetEntry = await db.collection('password_resets').findOne({
            token: token,
            expiry: { $gt: new Date() }
        });


        if (!resetEntry) {
            return NextResponse.json({ message: 'Invalid or expired reset link' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const usersCollection = db.collection('users');

        // Update user password
        await usersCollection.updateOne(
            { email: resetEntry.email },
            { $set: { password: hashedPassword } }
        );

        // Delete reset token
        await db.collection('password_resets').deleteOne({ token: token });

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    // Check if token is valid
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.json({ valid: false }, { status: 400 });
    }

    try {
        const db = await getDatabase('makers3d_db');
        const resetEntry = await db.collection('password_resets').findOne({
            token: token,
            expiry: { $gt: new Date() }
        });


        return NextResponse.json({ valid: !!resetEntry });
    } catch (error) {
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}
