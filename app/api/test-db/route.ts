import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Example API route: GET /api/test-db
export async function GET(request: NextRequest) {
    try {
        // Connect to database
        const db = await getDatabase('makers3d_db'); // Replace with your database name

        // Example: Get all items from a collection
        const collection = db.collection('products'); // Replace with your collection name
        const items = await collection.find({}).limit(10).toArray();

        return NextResponse.json({
            success: true,
            message: 'Connected to MongoDB successfully!',
            itemCount: items.length,
            items: items,
        });
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to MongoDB',
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// Example API route: POST /api/test-db
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Connect to database
        const db = await getDatabase('makers3d_db');
        const collection = db.collection('products');

        // Insert a document
        const result = await collection.insertOne(body);

        return NextResponse.json({
            success: true,
            message: 'Document inserted successfully!',
            insertedId: result.insertedId,
        });
    } catch (error: any) {
        console.error('MongoDB insert error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to insert document',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
