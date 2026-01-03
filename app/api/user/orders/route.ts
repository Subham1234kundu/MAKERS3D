import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase('makers3d_db');

        // Fetch only successful UPI orders or COD orders
        // Filter out 'pending' (UPI initiated but not paid)
        const orders = await db.collection('orders')
            .find({
                customer_email: session.user.email,
                status: { $in: ['success', 'cod_pending', 'processing', 'shipped', 'delivered', 'approved'] }
            })
            .sort({ createdAt: -1 })
            .toArray();

        // Format orders for profile
        const formattedOrders = orders.map(order => ({
            id: order.client_txn_id || order.order_id || 'N/A',
            date: new Date(order.createdAt).toISOString().split('T')[0],
            status: order.status === 'success' ? 'Processing' :
                order.status === 'cod_pending' ? 'COD Pending' :
                    order.status.charAt(0).toUpperCase() + order.status.slice(1),
            total: Number(order.amount),
            items: order.p_info ? order.p_info.split(', ').map((name: string) => ({
                name,
                image: '/images/placeholder.jpg' // We don't store individual item images in order yet
            })) : [],
            payment_method: order.payment_method || 'upi'
        }));

        return NextResponse.json(formattedOrders);
    } catch (error: any) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
