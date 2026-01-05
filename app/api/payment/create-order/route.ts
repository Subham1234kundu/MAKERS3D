import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, p_info, customer_name, customer_email, customer_mobile, address, redirect_url, payment_method = 'upi' } = body;

        const db = await getDatabase('makers3d_db');
        const client_txn_id = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        if (payment_method === 'cod') {
            // Handle Cash on Delivery
            try {
                const orderData = {
                    client_txn_id,
                    order_id: `COD-${Date.now()}`,
                    customer_name,
                    customer_email,
                    customer_mobile,
                    address,
                    amount,
                    p_info,
                    status: 'cod_pending',
                    payment_method: 'cod',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                await db.collection('orders').insertOne(orderData);

                // Update Customer record
                await db.collection('customers').updateOne(
                    { email: customer_email.toLowerCase() },
                    {
                        $set: {
                            name: customer_name,
                            phone: customer_mobile,
                            address,
                            lastOrderAt: new Date(),
                            updatedAt: new Date()
                        },
                        $setOnInsert: { createdAt: new Date() },
                        $inc: { orderAttempts: 1 }
                    },
                    { upsert: true }
                );

                // Send order confirmation email (non-blocking)
                const { sendOrderConfirmationEmail } = await import('@/lib/email-service');
                sendOrderConfirmationEmail({
                    customerName: customer_name,
                    customerEmail: customer_email,
                    orderId: orderData.order_id,
                    amount,
                    items: p_info,
                    address,
                    paymentMethod: 'cod'
                }).catch(err => console.error('Order confirmation email error:', err));


                return NextResponse.json({
                    success: true,
                    payment_method: 'cod',
                    order_id: orderData.order_id
                });
            } catch (dbError) {
                console.error('COD Database error:', dbError);
                return NextResponse.json({ success: false, msg: 'Failed to save COD order' }, { status: 500 });
            }
        }

        // Existing UPI logic
        const apiKey = process.env.UPIGATEWAY_KEY;

        const payload = {
            key: apiKey,
            client_txn_id,
            amount,
            p_info,
            customer_name,
            customer_email,
            customer_mobile,
            redirect_url
        };

        const response = await fetch('https://api.ekqr.in/api/v2/create_order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.status) {
            try {
                // Save order to database as pending
                await db.collection('orders').insertOne({
                    client_txn_id,
                    order_id: data.data.order_id,
                    customer_name,
                    customer_email,
                    customer_mobile,
                    address,
                    amount,
                    p_info,
                    status: 'pending',
                    payment_method: 'upi',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                // Update Customer record
                await db.collection('customers').updateOne(
                    { email: customer_email.toLowerCase() },
                    {
                        $set: {
                            name: customer_name,
                            phone: customer_mobile,
                            address,
                            lastOrderAt: new Date(),
                            updatedAt: new Date()
                        },
                        $setOnInsert: { createdAt: new Date() },
                        $inc: { orderAttempts: 1 }
                    },
                    { upsert: true }
                );
            } catch (dbError) {
                console.error('Database maintenance error:', dbError);
            }

            return NextResponse.json({
                success: true,
                data: data.data,
                client_txn_id,
                payment_method: 'upi'
            });
        } else {
            return NextResponse.json({ success: false, msg: data.msg }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Payment creation error:', error);
        return NextResponse.json({
            success: false,
            msg: 'Internal Server Error'
        }, { status: 500 });
    }
}
