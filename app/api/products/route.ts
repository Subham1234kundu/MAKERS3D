import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
                images: p.images || [p.image]
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
        console.error('Fetch products error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
