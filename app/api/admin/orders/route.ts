import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase('makers3d_db');
        const orders = await db.collection('orders')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Format orders for dashboard
        const formattedOrders = orders.map(order => ({
            id: order.client_txn_id || order.order_id || 'N/A',
            customer: order.customer_name || 'Guest',
            email: order.customer_email,
            phone: order.customer_mobile,
            product: order.p_info || 'Custom Order',
            amount: `₹${Number(order.amount).toLocaleString('en-IN')}`,
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize
            date: new Date(order.createdAt).toISOString().split('T')[0],
            rawStatus: order.status
        }));

        return NextResponse.json(formattedOrders);
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        await db.collection('orders').updateOne(
            { client_txn_id: orderId },
            { $set: { status: status.toLowerCase(), updatedAt: new Date() } }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
