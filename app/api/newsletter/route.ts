import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { email, phone } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const subscribersCollection = db.collection('subscribers');

        // Check if already subscribed
        const existing = await subscribersCollection.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: 'You are already in the circle.' }, { status: 409 });
        }

        await subscribersCollection.insertOne({
            email,
            phone: phone || '',
            subscribedAt: new Date(),
            source: 'Newsletter Footer',
            status: 'active'
        });

        return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Newsletter error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
