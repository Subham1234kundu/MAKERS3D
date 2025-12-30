import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase('makers3d_db');
        const userLikes = await db.collection('likes').find({ userEmail: session.user.email }).toArray();

        const productIds = userLikes.map(like => new ObjectId(like.productId));
        const products = await db.collection('products').find({ _id: { $in: productIds } }).toArray();

        const formattedProducts = products.map(p => ({
            ...p,
            id: p._id.toString(),
            name: p.name || p.title,
            images: p.images || [p.image]
        }));

        return NextResponse.json(formattedProducts);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const existingLike = await db.collection('likes').findOne({
            userEmail: session.user.email,
            productId: productId
        });

        if (existingLike) {
            await db.collection('likes').deleteOne({ _id: existingLike._id });
            return NextResponse.json({ liked: false });
        } else {
            await db.collection('likes').insertOne({
                userEmail: session.user.email,
                productId: productId,
                createdAt: new Date()
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
