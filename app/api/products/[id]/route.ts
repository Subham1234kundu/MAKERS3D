import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        // Find by ObjectId if valid, otherwise try to find by a possible numeric 'id' field
        let query: any;
        try {
            query = { _id: new ObjectId(id) };
        } catch (e) {
            // If not a valid ObjectId, search by numeric id field if it exists (for backward compatibility if needed)
            query = { id: Number(id) };
        }

        const product = await db.collection('products').findOne(query);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Format for consistent use across frontend
        const formattedProduct = {
            ...product,
            id: product._id.toString(),
            name: product.name || product.title,
            images: product.images || (product.image ? [product.image] : [])
        };

        return NextResponse.json(formattedProduct);
    } catch (error: any) {
        console.error('Fetch product error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
