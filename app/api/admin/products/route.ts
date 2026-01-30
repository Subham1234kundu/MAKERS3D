import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Get products (admin view)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase('makers3d_db');
        const products = await db.collection('products')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Harmonize field names
        const formattedProducts = products.map(p => ({
            ...p,
            id: p._id.toString(),
            name: p.name || p.title,
            images: p.images || (p.image ? [p.image] : [])
        }));

        return NextResponse.json(formattedProducts);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Add product
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, price, originalPrice, category, images, description, specifications, sizes, colors } = body;

        if (!name || !price || !category || (!images || images.length === 0)) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const result = await db.collection('products').insertOne({
            name,
            price: Number(price),
            originalPrice: Number(originalPrice || price),
            category,
            images: Array.isArray(images) ? images : [images],
            description: description || '',
            specifications: specifications || '',
            sizes: sizes || '',
            colors: colors || '',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({ message: 'Product created', id: result.insertedId }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Update product
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, price, originalPrice, category, images, description, specifications, sizes, colors } = body;

        if (!id) {
            return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const updateData: any = {
            updatedAt: new Date()
        };

        if (name) updateData.name = name;
        if (price) updateData.price = Number(price);
        if (originalPrice) updateData.originalPrice = Number(originalPrice);
        if (category) updateData.category = category;
        if (images) updateData.images = Array.isArray(images) ? images : [images];
        if (description !== undefined) updateData.description = description;
        if (specifications !== undefined) updateData.specifications = specifications;
        if (sizes !== undefined) updateData.sizes = sizes;
        if (colors !== undefined) updateData.colors = colors;

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Delete product
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        // Delete the product
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Clean up: Remove this product from all user carts in the database
        try {
            await db.collection('carts').updateMany(
                {},
                { $pull: { items: { id: id } } } as any
            );
        } catch (pullError) {
            console.error('Failed to remove deleted product from user carts:', pullError);
        }

        // Clean up: Remove this product from all user likes
        try {
            await db.collection('likes').deleteMany({ productId: id });
        } catch (likeError) {
            console.error('Failed to remove deleted product from likes:', likeError);
        }

        return NextResponse.json({ message: 'Product deleted' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
