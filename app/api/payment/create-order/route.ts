import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { phonePe } from '@/lib/phonepe';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            amount,
            p_info,
            customer_name,
            customer_email,
            customer_mobile,
            address,
            redirect_url,
            payment_method = 'phonepe'
        } = body;

        const db = await getDatabase('makers3d_db');
        const client_txn_id = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Handle Cash on Delivery
        if (payment_method === 'cod') {
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
                return NextResponse.json({
                    success: false,
                    msg: 'Failed to save COD order'
                }, { status: 500 });
            }
        }

        // Handle PhonePe Payment
        if (payment_method === 'phonepe') {
            try {
                console.log('=== PhonePe Payment Request ===');
                console.log('Merchant Order ID:', client_txn_id);
                console.log('Amount:', amount);

                const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/phonepe-callback`;

                const paymentResponse = await phonePe.createPayment({
                    amount: parseFloat(amount),
                    merchantOrderId: client_txn_id,
                    customerName: customer_name,
                    customerEmail: customer_email,
                    customerMobile: customer_mobile,
                    redirectUrl: redirect_url,
                    callbackUrl: callbackUrl,
                });

                console.log('PhonePe Response:', paymentResponse);

                // Save order to database as pending
                await db.collection('orders').insertOne({
                    client_txn_id,
                    order_id: paymentResponse.orderId || client_txn_id,
                    customer_name,
                    customer_email,
                    customer_mobile,
                    address,
                    amount,
                    p_info,
                    status: 'pending',
                    payment_method: 'phonepe',
                    phonepe_data: paymentResponse,
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

                console.log('✅ PhonePe payment order created successfully');

                // Extract redirect URL from response
                const redirectUrl = paymentResponse.redirectUrl ||
                    paymentResponse.data?.redirectUrl ||
                    paymentResponse.data?.instrumentResponse?.redirectInfo?.url;

                return NextResponse.json({
                    success: true,
                    payment_method: 'phonepe',
                    client_txn_id,
                    data: paymentResponse.data || paymentResponse,
                    redirectUrl: redirectUrl
                });

            } catch (phonePeError: any) {
                console.error('PhonePe Error:', phonePeError);
                return NextResponse.json({
                    success: false,
                    msg: phonePeError.message || 'PhonePe payment failed'
                }, { status: 400 });
            }
        }

        // Handle UPIGateway Payment (legacy)
        if (payment_method === 'upi') {
            const apiKey = process.env.UPIGATEWAY_KEY;

            console.log('=== UPIGateway Payment Request ===');
            console.log('API Key present:', !!apiKey);
            console.log('Client TXN ID:', client_txn_id);
            console.log('Amount:', amount);

            if (!apiKey) {
                console.error('UPIGATEWAY_KEY is not set in environment variables');
                return NextResponse.json({
                    success: false,
                    msg: 'Payment gateway configuration error. Please contact support.'
                }, { status: 500 });
            }

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

            console.log('UPIGateway Response Status:', data.status);

            if (data.status) {
                try {
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

                console.log('✅ UPI payment order created successfully');
                return NextResponse.json({
                    success: true,
                    data: data.data,
                    client_txn_id,
                    payment_method: 'upi'
                });
            } else {
                console.error('❌ UPIGateway Error:', data.msg);
                return NextResponse.json({ success: false, msg: data.msg }, { status: 400 });
            }
        }

        return NextResponse.json({
            success: false,
            msg: 'Invalid payment method'
        }, { status: 400 });

    } catch (error: any) {
        console.error('Payment creation error:', error);
        return NextResponse.json({
            success: false,
            msg: 'Internal Server Error'
        }, { status: 500 });
    }
}
