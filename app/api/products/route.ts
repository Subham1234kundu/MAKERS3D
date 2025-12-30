import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const db = await getDatabase('makers3d_db');
        const query = category && category !== 'ALL' ? { category } : {};

        const products = await db.collection('products')
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        // Map to match dashboard expected format
        const formattedProducts = products.map(p => ({
            ...p,
            id: p._id.toString(),
            name: p.name || p.title,
            images: p.images || [p.image]
        }));

        return NextResponse.json(formattedProducts);
    } catch (error: any) {
        console.error('Fetch products error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
