import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, password } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Connect to database
        const db = await getDatabase('makers3d_db');
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const result = await usersCollection.insertOne({
            name,
            email,
            phone: phone || '',
            password: hashedPassword,
            provider: 'credentials',
            createdAt: new Date(),
        });

        // Send welcome email (non-blocking)
        const { sendWelcomeEmail } = await import('@/lib/email-service');
        sendWelcomeEmail({
            customerName: name,
            customerEmail: email,
        }).catch(err => console.error('Welcome email error:', err));

        return NextResponse.json(
            {
                message: 'User created successfully',
                userId: result.insertedId,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            {
                message: 'Internal server error',
                error: error.message
            },
            { status: 500 }
        );
    }
}
