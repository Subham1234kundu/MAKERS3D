import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase('makers3d_db');

        // Fetch all addresses for the user
        const addresses = await db.collection('user_addresses')
            .find({ user_email: session.user.email })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(addresses);
    } catch (error: any) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, street, city, state, zip, phone } = body;

        // Validate required fields
        if (!type || !street || !city || !state || !zip || !phone) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        const newAddress = {
            user_email: session.user.email,
            type,
            street,
            city,
            state,
            zip,
            phone,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('user_addresses').insertOne(newAddress);

        return NextResponse.json({
            ...newAddress,
            _id: result.insertedId
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating address:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { _id, type, street, city, state, zip, phone } = body;

        if (!_id) {
            return NextResponse.json({ message: 'Address ID is required' }, { status: 400 });
        }

        // Validate required fields
        if (!type || !street || !city || !state || !zip || !phone) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        const result = await db.collection('user_addresses').updateOne(
            { _id: new ObjectId(_id), user_email: session.user.email },
            {
                $set: {
                    type,
                    street,
                    city,
                    state,
                    zip,
                    phone,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Address updated successfully' });
    } catch (error: any) {
        console.error('Error updating address:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const addressId = searchParams.get('id');

        if (!addressId) {
            return NextResponse.json({ message: 'Address ID is required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        const result = await db.collection('user_addresses').deleteOne({
            _id: new ObjectId(addressId),
            user_email: session.user.email
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Address deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting address:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
