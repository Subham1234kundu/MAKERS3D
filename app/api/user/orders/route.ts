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

        // Fetch all confirmed orders for the user
        const orders = await db.collection('orders')
            .find({
                customer_email: session.user.email,
                status: { $in: ['success', 'cod_pending', 'processing', 'shipped', 'delivered', 'approved', 'confirmed'] }
            })
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

        // Format orders with full details
        const formattedOrders = orders.map(order => {
            // Determine display status and color
            let displayStatus = 'Processing';
            let statusColor = 'yellow';

            switch (order.status) {
                case 'success':
                case 'confirmed':
                    displayStatus = 'Confirmed';
                    statusColor = 'green';
                    break;
                case 'cod_pending':
                    displayStatus = 'COD - Awaiting Delivery';
                    statusColor = 'blue';
                    break;
                case 'processing':
                    displayStatus = 'Processing';
                    statusColor = 'blue';
                    break;
                case 'shipped':
                    displayStatus = 'Shipped';
                    statusColor = 'purple';
                    break;
                case 'delivered':
                    displayStatus = 'Delivered';
                    statusColor = 'green';
                    break;
                case 'approved':
                    displayStatus = 'Approved';
                    statusColor = 'green';
                    break;
                default:
                    displayStatus = order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Processing';
            }

            return {
                id: order.client_txn_id || order.order_id || 'N/A',
                orderId: order.order_id || order.client_txn_id,
                date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : 'N/A',
                dateTime: order.createdAt,
                status: displayStatus,
                statusColor,
                rawStatus: order.status,
                total: Number(order.amount) || 0,
                items: order.p_info ? order.p_info.split(', ').map((name: string) => {
                    const trimmedName = name.trim();
                    const productImage = productImageMap.get(trimmedName.toLowerCase()) || '/images/placeholder.jpg';
                    return {
                        name: trimmedName,
                        image: productImage
                    };
                }) : [],
                itemsText: order.p_info || '',
                payment_method: order.payment_method || 'upi',
                paymentMethodDisplay: order.payment_method === 'phonepe' ? 'PhonePe' :
                    order.payment_method === 'cod' ? 'Cash on Delivery' :
                        order.payment_method === 'upi' ? 'UPI' : order.payment_method,
                address: order.address || {},
                customerName: order.customer_name,
                customerEmail: order.customer_email,
                customerMobile: order.customer_mobile,
                transactionId: order.transaction_id || order.phonepe_data?.orderId || null,
            };
        });

        return NextResponse.json(formattedOrders);
    } catch (error: any) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
