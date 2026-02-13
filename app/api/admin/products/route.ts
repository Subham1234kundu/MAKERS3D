import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        const formattedProducts = products.map(p => {
            let activePrice = Number(p.price) || 0;
            let activeOriginalPrice = Number(p.originalPrice) || 0;

            // If sizes exist and have prices, find the minimum price among all (base + variants)
            if (Array.isArray(p.sizes) && p.sizes.length > 0) {
                const variantPrices = p.sizes
                    .map((s: any) => Number(s.price))
                    .filter((pr: number) => !isNaN(pr) && pr > 0);

                if (variantPrices.length > 0) {
                    const allPossiblePrices = activePrice > 0 ? [activePrice, ...variantPrices] : variantPrices;
                    const minPrice = Math.min(...allPossiblePrices);

                    if (minPrice !== activePrice) {
                        activePrice = minPrice;
                        const minPriceVariant = p.sizes.find((s: any) => Number(s.price) === activePrice);
                        if (minPriceVariant && minPriceVariant.originalPrice) {
                            activeOriginalPrice = Number(minPriceVariant.originalPrice);
                        }
                    }
                }
            }

            return {
                ...p,
                id: p._id.toString(),
                name: p.name || p.title,
                price: activePrice,
                originalPrice: activeOriginalPrice,
                images: p.images || (p.image ? [p.image] : [])
            };
        });

        return NextResponse.json(formattedProducts, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
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

        // Be more specific about validation: price can be 0 (which is falsy)
        if (!name || price === undefined || price === null || !category || !images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json({
                message: 'Missing required fields',
                details: {
                    name: !name ? 'Required' : 'OK',
                    price: (price === undefined || price === null) ? 'Required' : 'OK',
                    category: !category ? 'Required' : 'OK',
                    images: (!images || !Array.isArray(images) || images.length === 0) ? 'Required' : 'OK'
                }
            }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const result = await db.collection('products').insertOne({
            name,
            price: Number(price),
            originalPrice: Number(originalPrice || price),
            category,
            images: Array.isArray(images) ? images : [images],
            video: body.video || null,
            description: description || '',
            specifications: specifications || '',
            sizes: sizes || '',
            colors: colors || '',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Revalidate frontend pages
        revalidatePath('/');
        revalidatePath('/products');

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
        console.log('📦 Updating product:', body.id, 'Data:', body);
        const { id, name, price, originalPrice, category, images, description, specifications, sizes, colors } = body;

        if (!id) {
            return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const updateData: any = {
            updatedAt: new Date()
        };

        if (name) updateData.name = name;
        if (price !== undefined) updateData.price = Number(price);
        if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);
        console.log('🛠️ Final updateData:', updateData);
        if (category) updateData.category = category;
        if (images) updateData.images = Array.isArray(images) ? images : [images];
        if (body.video !== undefined) updateData.video = body.video;
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

        // Revalidate frontend pages
        revalidatePath('/');
        revalidatePath('/products');
        revalidatePath(`/products/${id}`);

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

        // Revalidate frontend pages
        revalidatePath('/');
        revalidatePath('/products');
        if (id) revalidatePath(`/products/${id}`);

        return NextResponse.json({ message: 'Product deleted' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
