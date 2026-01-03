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
        const orders = await db.collection('orders').find({}).toArray();
        const manualCustomers = await db.collection('customers').find({}).toArray();

        // Map carts for easy lookup
        const cartMap = new Map();
        carts.forEach(cart => {
            if (cart.email) cartMap.set(cart.email.toLowerCase(), cart.items || []);
        });

        // Map orders for easy lookup
        const orderStats = new Map();
        orders.forEach(order => {
            const email = order.customer_email?.toLowerCase();
            if (!email) return;

            const stats = orderStats.get(email) || { count: 0, spent: 0 };
            stats.count += 1;
            if (order.status === 'success' || order.status === 'delivered') {
                stats.spent += Number(order.amount) || 0;
            }
            orderStats.set(email, stats);
        });

        // Map users
        const userData = users
            .filter(user => user.email.toLowerCase() !== session.user?.email?.toLowerCase())
            .map(user => {
                const userEmail = user.email.toLowerCase();
                const userCart = cartMap.get(userEmail) || [];
                const stats = orderStats.get(userEmail) || { count: 0, spent: 0 };
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone || 'N/A',
                    createdAt: user.createdAt,
                    provider: user.provider,
                    cartCount: userCart.length,
                    likesCount: 0,
                    totalOrders: stats.count,
                    totalSpent: stats.spent,
                };
            });

        // Map manual/checkout customers who might not be users
        const userEmails = new Set(userData.map(u => u.email.toLowerCase()));
        const checkoutCustomerData = manualCustomers
            .filter(c => !userEmails.has(c.email.toLowerCase()))
            .map(c => {
                const email = c.email.toLowerCase();
                const cart = cartMap.get(email) || [];
                const stats = orderStats.get(email) || { count: 0, spent: 0 };
                return {
                    id: c._id.toString(),
                    name: c.name,
                    email: c.email,
                    phone: c.phone || 'N/A',
                    createdAt: c.createdAt,
                    provider: 'checkout',
                    cartCount: cart.length,
                    likesCount: 0,
                    totalOrders: stats.count,
                    totalSpent: stats.spent,
                };
            });

        // Map subscribers who aren't users or checkout customers
        const allProcessedEmails = new Set([...userEmails, ...checkoutCustomerData.map(c => c.email.toLowerCase())]);
        const subscriberData = subscribers
            .filter(sub => !allProcessedEmails.has(sub.email.toLowerCase()) && sub.email.toLowerCase() !== session.user?.email?.toLowerCase())
            .map(sub => {
                const subEmail = sub.email.toLowerCase();
                const subCart = cartMap.get(subEmail) || [];
                const stats = orderStats.get(subEmail) || { count: 0, spent: 0 };
                return {
                    id: sub._id.toString(),
                    name: 'Lead / Subscriber',
                    email: sub.email,
                    phone: sub.phone || 'N/A',
                    createdAt: sub.subscribedAt,
                    provider: 'newsletter',
                    cartCount: subCart.length,
                    likesCount: 0,
                    totalOrders: stats.count,
                    totalSpent: stats.spent,
                };
            });

        const combinedData = [...userData, ...checkoutCustomerData, ...subscriberData].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json(combinedData);
    } catch (error: any) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
