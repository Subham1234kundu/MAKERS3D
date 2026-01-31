import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const db = await getDatabase('makers3d_db');
        const orders = await db.collection('orders')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Fetch all products to match images
        const products = await db.collection('products').find({}).toArray();
        const productImageMap = new Map();

        products.forEach(product => {
            if (product.name && product.images && product.images.length > 0) {
                // Handle both string URLs and image objects with url property
                const imageData = product.images[0];
                const imageUrl = typeof imageData === 'string' ? imageData : (imageData?.url || '/images/placeholder.jpg');
                productImageMap.set(product.name.toLowerCase().trim(), imageUrl);
            }
        });

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
            payment_method: order.payment_method || 'upi',
            address: order.address,
            items: order.p_info ? order.p_info.split(', ').map((name: string) => {
                const trimmedName = name.trim();
                const productImage = productImageMap.get(trimmedName.toLowerCase()) || '/images/placeholder.jpg';
                return {
                    name: trimmedName,
                    image: productImage,
                    price: 0 // We don't have individual prices in this simplified view, but we could fetch them if needed
                };
            }) : []
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
        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { orderId, status, trackingNumber } = body;

        if (!orderId || !status) {
            return NextResponse.json({ message: 'Missing orderId or status' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        // Get order details before updating
        const order = await db.collection('orders').findOne({ client_txn_id: orderId });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Update order status and tracking number
        const updateData: any = {
            status: status.toLowerCase(),
            updatedAt: new Date()
        };

        if (trackingNumber) {
            updateData.tracking_number = trackingNumber;
        }

        const updateResult = await db.collection('orders').updateOne(
            { client_txn_id: orderId },
            { $set: updateData }
        );

        if (updateResult.modifiedCount === 0 && order.status === status.toLowerCase() && !trackingNumber) {
            // If nothing changed and status is same, we can still return success
            return NextResponse.json({ success: true, message: 'Status already up to date' });
        }

        // Send email notifications based on status change (non-blocking)
        if (order && order.customer_email) {
            const statusLower = status.toLowerCase();

            if (statusLower === 'approved') {
                // For approved status, you might want to send a confirmation email
                // Currently using order confirmation as a fallback
                const { sendOrderConfirmationEmail } = await import('@/lib/email-service');
                sendOrderConfirmationEmail({
                    customerName: order.customer_name || 'Customer',
                    customerEmail: order.customer_email,
                    orderId: order.order_id || order.client_txn_id,
                    items: order.p_info || 'Your order',
                    address: typeof order.address === 'string' ? order.address : JSON.stringify(order.address),
                    paymentMethod: order.payment_method || 'UPI'
                }).catch(err => console.error('Approved email error:', err));
            } else if (statusLower === 'shipped') {
                const { sendOrderShippedEmail } = await import('@/lib/email-service');
                sendOrderShippedEmail({
                    customerName: order.customer_name || 'Customer',
                    customerEmail: order.customer_email,
                    orderId: order.order_id || order.client_txn_id,
                    trackingNumber: trackingNumber || order.tracking_number
                }).catch(err => console.error('Shipped email error:', err));
            } else if (statusLower === 'delivered') {
                const { sendOrderDeliveredEmail } = await import('@/lib/email-service');
                sendOrderDeliveredEmail({
                    customerName: order.customer_name || 'Customer',
                    customerEmail: order.customer_email,
                    orderId: order.order_id || order.client_txn_id
                }).catch(err => console.error('Delivered email error:', err));
            }
        }

        return NextResponse.json({
            success: true,
            message: `Order status updated to ${status}`,
            emailSent: order?.customer_email ? true : false
        });
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
