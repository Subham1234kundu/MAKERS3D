import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        // Check if MONGODB_URI is set
        const hasMongoUri = !!process.env.MONGODB_URI;
        if (!hasMongoUri) {
            return NextResponse.json(
                {
                    success: false,
                    message: '❌ MONGODB_URI not configured',
                    error: 'Environment variable MONGODB_URI is missing',
                    hint: 'Add MONGODB_URI to your Vercel environment variables'
                },
                { status: 500 }
            );
        }

        // Test connection
        const db = await getDatabase('makers3d_db');

        // List all collections
        const collections = await db.listCollections().toArray();

        // Get database stats
        const stats = await db.stats();

        // Check products count
        const productsCount = await db.collection('products').countDocuments();
        const usersCount = await db.collection('users').countDocuments().catch(() => 0);
        const cartsCount = await db.collection('carts').countDocuments().catch(() => 0);

        return NextResponse.json({
            success: true,
            message: '✅ MongoDB Atlas Connected Successfully!',
            environment: process.env.NODE_ENV,
            database: 'makers3d_db',
            cluster: 'lms.4a4h7.mongodb.net',
            collections: collections.map(c => c.name),
            documentCounts: {
                products: productsCount,
                users: usersCount,
                carts: cartsCount,
            },
            stats: {
                collections: stats.collections,
                dataSize: `${(stats.dataSize / 1024).toFixed(2)} KB`,
                indexSize: `${(stats.indexSize / 1024).toFixed(2)} KB`,
            },
            warnings: productsCount === 0 ? ['No products found in database'] : []
        });
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json(
            {
                success: false,
                message: '❌ MongoDB Connection Failed',
                error: error.message,
                errorCode: error.code,
                hint: error.message.includes('IP')
                    ? 'Check MongoDB Atlas Network Access settings - Vercel IPs may be blocked'
                    : 'Check your MONGODB_URI environment variable in Vercel settings'
            },
            { status: 500 }
        );
    }
}
