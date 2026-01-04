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
            status: order.status === 'pending' ? 'Pending Payment' :
                order.status === 'success' ? 'Order Placed' :
                    order.status === 'cod_pending' ? 'COD Pending' :
                        order.status === 'shipped' ? 'Shipped' :
                            order.status === 'delivered' ? 'Delivered' :
                                order.status.charAt(0).toUpperCase() + order.status.slice(1),
            date: new Date(order.createdAt).toISOString().split('T')[0],
            rawStatus: order.status,
            payment_method: order.payment_method || 'upi'
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

        // Get order details before updating
        const order = await db.collection('orders').findOne({ client_txn_id: orderId });

        await db.collection('orders').updateOne(
            { client_txn_id: orderId },
            { $set: { status: status.toLowerCase(), updatedAt: new Date() } }
        );

        // Send email notifications based on status change (non-blocking)
        if (order && order.customer_email) {
            const statusLower = status.toLowerCase();

            if (statusLower === 'shipped') {
                const { sendOrderShippedEmail } = await import('@/lib/email-service');
                sendOrderShippedEmail({
                    customerName: order.customer_name,
                    customerEmail: order.customer_email,
                    orderId: order.order_id || order.client_txn_id,
                    trackingNumber: order.tracking_number
                }).catch(err => console.error('Shipped email error:', err));
            } else if (statusLower === 'delivered') {
                const { sendOrderDeliveredEmail } = await import('@/lib/email-service');
                sendOrderDeliveredEmail({
                    customerName: order.customer_name,
                    customerEmail: order.customer_email,
                    orderId: order.order_id || order.client_txn_id
                }).catch(err => console.error('Delivered email error:', err));
            }
        }


        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
