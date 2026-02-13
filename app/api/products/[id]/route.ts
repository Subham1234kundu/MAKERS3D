import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        let activePrice = Number(product.price) || 0;
        let activeOriginalPrice = Number(product.originalPrice) || 0;

        // If sizes exist and have prices, find the minimum price among all (base + variants)
        if (Array.isArray(product.sizes) && product.sizes.length > 0) {
            const variantPrices = product.sizes
                .map((s: any) => Number(s.price))
                .filter((pr: number) => !isNaN(pr) && pr > 0);

            if (variantPrices.length > 0) {
                const allPossiblePrices = activePrice > 0 ? [activePrice, ...variantPrices] : variantPrices;
                const minPrice = Math.min(...allPossiblePrices);

                if (minPrice !== activePrice) {
                    activePrice = minPrice;
                    const minPriceVariant = product.sizes.find((s: any) => Number(s.price) === activePrice);
                    if (minPriceVariant && minPriceVariant.originalPrice) {
                        activeOriginalPrice = Number(minPriceVariant.originalPrice);
                    }
                }
            }
        }

        const formattedProduct = {
            ...product,
            id: product._id.toString(),
            name: product.name || product.title,
            price: activePrice,
            originalPrice: activeOriginalPrice,
            images: product.images || (product.image ? [product.image] : [])
        };

        return NextResponse.json(formattedProduct, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error: any) {
        console.error('Fetch product error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
