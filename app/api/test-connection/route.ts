import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        // Test connection
        const db = await getDatabase('makers3d_db');

        // List all collections
        const collections = await db.listCollections().toArray();

        // Get database stats
        const stats = await db.stats();

        return NextResponse.json({
            success: true,
            message: '✅ MongoDB Atlas Connected Successfully!',
            database: 'makers3d_db',
            cluster: 'lms.4a4h7.mongodb.net',
            collections: collections.map(c => c.name),
            stats: {
                collections: stats.collections,
                dataSize: `${(stats.dataSize / 1024).toFixed(2)} KB`,
                indexSize: `${(stats.indexSize / 1024).toFixed(2)} KB`,
            }
        });
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json(
            {
                success: false,
                message: '❌ MongoDB Connection Failed',
                error: error.message,
                hint: 'Check your MONGODB_URI in .env.local'
            },
            { status: 500 }
        );
    }
}
