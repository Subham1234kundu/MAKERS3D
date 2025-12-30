import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ items: [] }, { status: 200 });
        }

        const db = await getDatabase('makers3d_db');
        const cart = await db.collection('carts').findOne({ email: session.user.email });

        return NextResponse.json({ items: cart ? cart.items : [] }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch cart error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { product, quantity = 1 } = body;

        if (!product || !product.id) {
            return NextResponse.json({ message: 'Invalid product' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const cartsCollection = db.collection('carts');

        // Check if cart exists
        const cart = await cartsCollection.findOne({ email: session.user.email });

        if (cart) {
            // Check if item exists in cart
            const existingItemIndex = cart.items.findIndex((item: any) => item.id === product.id);

            if (existingItemIndex > -1) {
                // Update quantity
                const newQuantity = cart.items[existingItemIndex].quantity + quantity;
                await cartsCollection.updateOne(
                    { email: session.user.email, "items.id": product.id },
                    { $set: { "items.$.quantity": newQuantity } }
                );
            } else {
                // Add new item
                await cartsCollection.updateOne(
                    { email: session.user.email },
                    { $push: { items: { ...product, quantity } } }
                );
            }
        } else {
            // Create new cart
            await cartsCollection.insertOne({
                email: session.user.email,
                items: [{ ...product, quantity }],
                updatedAt: new Date()
            });
        }

        // Return updated cart items for convenience
        const updatedCart = await cartsCollection.findOne({ email: session.user.email });
        return NextResponse.json({ items: updatedCart ? updatedCart.items : [] }, { status: 200 });

    } catch (error: any) {
        console.error('Add to cart error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { itemId, quantity } = body; // If quantity is provided, set it. Or delta? Let's assume absolute quantity or delta logic in provider. Let's support setting quantity.

        const db = await getDatabase('makers3d_db');
        const cartsCollection = db.collection('carts');

        if (quantity <= 0) {
            // Remove item
            await cartsCollection.updateOne(
                { email: session.user.email },
                { $pull: { items: { id: itemId } } } as any
            );
        } else {
            // Update quantity
            await cartsCollection.updateOne(
                { email: session.user.email, "items.id": itemId },
                { $set: { "items.$.quantity": quantity } }
            );
        }

        const updatedCart = await cartsCollection.findOne({ email: session.user.email });
        return NextResponse.json({ items: updatedCart ? updatedCart.items : [] }, { status: 200 });

    } catch (error: any) {
        console.error('Update cart error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // We can pass itemId in query or body. Let's expect body for simplicity or URL param.
        // Usually delete should be /api/cart?itemId=...
        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get('itemId');

        if (!itemId) {
            return NextResponse.json({ message: 'Missing itemId' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const cartsCollection = db.collection('carts');

        await cartsCollection.updateOne(
            { email: session.user.email },
            { $pull: { items: { id: itemId } } } as any
        );

        // Handle number vs string ID matching if needed, but 'id' in frontend seems to be mixed. MongoDB $pull matches value.

        const updatedCart = await cartsCollection.findOne({ email: session.user.email });
        return NextResponse.json({ items: updatedCart ? updatedCart.items : [] }, { status: 200 });

    } catch (error: any) {
        console.error('Delete item error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
