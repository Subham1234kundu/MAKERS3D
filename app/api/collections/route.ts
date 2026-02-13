import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        const db = await getDatabase('makers3d_db');
        const collections = await db.collection('collections')
            .find({})
            .sort({ order: 1, createdAt: -1 })
            .toArray();

        const formattedCollections = collections.map(c => ({
            ...c,
            id: c._id.toString()
        }));

        return NextResponse.json(formattedCollections, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error: any) {
        console.error('Fetch collections error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
