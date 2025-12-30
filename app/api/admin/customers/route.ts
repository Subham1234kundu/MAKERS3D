import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Simple auth check - you might want to add role-based check here later
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase('makers3d_db');
        const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
        const subscribers = await db.collection('subscribers').find({}).sort({ subscribedAt: -1 }).toArray();
        const carts = await db.collection('carts').find({}).toArray();

        // Map carts for easy lookup
        const cartMap = new Map();
        carts.forEach(cart => {
            if (cart.email) cartMap.set(cart.email.toLowerCase(), cart.items || []);
        });

        // Map users, filtering out the current admin (the requester)
        const userData = users
            .filter(user => user.email.toLowerCase() !== session.user?.email?.toLowerCase())
            .map(user => {
                const userEmail = user.email.toLowerCase();
                const userCart = cartMap.get(userEmail) || [];
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone || 'N/A',
                    createdAt: user.createdAt,
                    provider: user.provider,
                    cartCount: userCart.length,
                    likesCount: 0,
                    totalOrders: 0,
                    totalSpent: 0,
                };
            });

        // Map subscribers
        const userEmails = new Set(userData.map(u => u.email.toLowerCase()));
        const subscriberData = subscribers
            .filter(sub => !userEmails.has(sub.email.toLowerCase()) && sub.email.toLowerCase() !== session.user?.email?.toLowerCase())
            .map(sub => {
                const subEmail = sub.email.toLowerCase();
                const subCart = cartMap.get(subEmail) || [];
                return {
                    id: sub._id.toString(),
                    name: 'Lead / Subscriber',
                    email: sub.email,
                    phone: sub.phone || 'N/A',
                    createdAt: sub.subscribedAt,
                    provider: 'newsletter',
                    cartCount: subCart.length,
                    likesCount: 0,
                    totalOrders: 0,
                    totalSpent: 0,
                };
            });

        const combinedData = [...userData, ...subscriberData].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json(combinedData);
    } catch (error: any) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
