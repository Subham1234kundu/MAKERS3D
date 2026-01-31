import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { phonePe } from '@/lib/phonepe';

// Handle redirect from PhonePe (user is redirected here after payment)
export async function POST(req: NextRequest) {
    try {
        // Get all possible data sources
        const url = new URL(req.url);
        const urlParams: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
            urlParams[key] = value;
        });

        // Read body as text first for verification
        const bodyText = await req.text();
        console.log('PhonePe Callback Raw Body:', bodyText);
        console.log('PhonePe Callback URL params:', urlParams);

        // Parse body
        let body: Record<string, any> = {};
        const contentType = req.headers.get('content-type') || '';

        if (contentType.includes('application/json') && bodyText) {
            try {
                body = JSON.parse(bodyText);
            } catch {
                // Try URL encoded
                const params = new URLSearchParams(bodyText);
                params.forEach((value, key) => {
                    body[key] = value;
                });
            }
        } else if (bodyText) {
            const params = new URLSearchParams(bodyText);
            params.forEach((value, key) => {
                body[key] = value;
            });
        }

        console.log('PhonePe Callback Parsed Body:', body);

        // Combine all params
        const allParams = { ...urlParams, ...body };

        // Extract merchantOrderId - PhonePe SDK typically returns this
        let merchantOrderId =
            allParams.merchantOrderId ||
            allParams.orderId ||
            allParams.transactionId;

        // If body contains a response field, it might be base64 encoded
        if (allParams.response) {
            try {
                const decoded = JSON.parse(Buffer.from(allParams.response, 'base64').toString('utf-8'));
                console.log('Decoded response:', decoded);
                merchantOrderId = merchantOrderId || decoded.merchantOrderId || decoded.data?.merchantOrderId;
            } catch (e) {
                console.log('Could not decode response field');
            }
        }

        const db = await getDatabase('makers3d_db');

        // If still no merchantOrderId, find the most recent pending order
        if (!merchantOrderId) {
            console.log('No merchantOrderId found, looking for recent pending order...');
            const recentOrder = await db.collection('orders').findOne(
                { payment_method: 'phonepe', status: 'pending' },
                { sort: { createdAt: -1 } }
            );

            if (recentOrder) {
                merchantOrderId = recentOrder.client_txn_id;
                console.log('Found recent pending order:', merchantOrderId);
            }
        }

        if (!merchantOrderId) {
            console.error('No merchantOrderId found');
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&error=missing_order_id`
            );
        }

        // Check payment status with PhonePe using SDK
        let statusResponse;
        try {
            statusResponse = await phonePe.checkStatus(merchantOrderId);
            console.log('PhonePe Status:', statusResponse);
        } catch (statusError: any) {
            console.error('Failed to check status:', statusError);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=pending&orderId=${merchantOrderId}`
            );
        }

        // Determine payment state from SDK response
        const paymentState = statusResponse?.state || (statusResponse as any)?.code;
        const isSuccess = paymentState === 'COMPLETED' || paymentState === 'SUCCESS' || paymentState === 'PAYMENT_SUCCESS';
        const isPending = paymentState === 'PENDING';

        if (isSuccess) {
            // Update order as successful
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                {
                    $set: {
                        status: 'success',
                        payment_status: 'completed',
                        phonepe_response: statusResponse,
                        updatedAt: new Date()
                    }
                }
            );

            // Fetch the order for subsequent actions (cart clearing, email sending)
            const order = await db.collection('orders').findOne({ client_txn_id: merchantOrderId });

            // Clear the cart in database if we have an order email
            if (order && order.customer_email) {
                db.collection('carts').deleteOne({ email: order.customer_email.toLowerCase() })
                    .catch(err => console.error('Failed to clear cart after PhonePe payment:', err));
            }

            // Send confirmation email
            if (order) {
                const { sendOrderConfirmationEmail } = await import('@/lib/email-service');
                sendOrderConfirmationEmail({
                    customerName: order.customer_name,
                    customerEmail: order.customer_email,
                    orderId: order.order_id,
                    items: order.p_info,
                    address: order.address,
                    paymentMethod: 'phonepe'
                }).catch(err => console.error('Email error:', err));
            }

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=success&orderId=${merchantOrderId}`
            );
        } else if (isPending) {
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                {
                    $set: {
                        status: 'pending',
                        payment_status: paymentState,
                        phonepe_response: statusResponse,
                        updatedAt: new Date()
                    }
                }
            );

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=pending&orderId=${merchantOrderId}`
            );
        } else {
            // Payment failed
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                {
                    $set: {
                        status: 'failed',
                        payment_status: paymentState || 'failed',
                        phonepe_response: statusResponse,
                        updatedAt: new Date()
                    }
                }
            );

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&orderId=${merchantOrderId}`
            );
        }

    } catch (error: any) {
        console.error('PhonePe callback error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=error&error=${encodeURIComponent(error.message)}`
        );
    }
}

// Handle GET requests (redirect mode)
export async function GET(req: NextRequest) {
    const url = new URL(req.url);

    let merchantOrderId = url.searchParams.get('merchantOrderId') ||
        url.searchParams.get('orderId') ||
        url.searchParams.get('transactionId');

    console.log('PhonePe GET Callback - orderId:', merchantOrderId);
    console.log('All URL params:', Object.fromEntries(url.searchParams));

    const db = await getDatabase('makers3d_db');

    // If no merchantOrderId, find recent pending order
    if (!merchantOrderId) {
        const recentOrder = await db.collection('orders').findOne(
            { payment_method: 'phonepe', status: 'pending' },
            { sort: { createdAt: -1 } }
        );

        if (recentOrder) {
            merchantOrderId = recentOrder.client_txn_id;
            console.log('Found recent pending order:', merchantOrderId);
        }
    }

    if (!merchantOrderId) {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&error=missing_order_id`
        );
    }

    try {
        const statusResponse = await phonePe.checkStatus(merchantOrderId);
        console.log('PhonePe Status (GET):', statusResponse);

        const paymentStateGet = statusResponse?.state || (statusResponse as any)?.code;
        const isSuccessGet = paymentStateGet === 'COMPLETED' || paymentStateGet === 'SUCCESS' || paymentStateGet === 'PAYMENT_SUCCESS';
        const isPendingGet = paymentStateGet === 'PENDING';

        if (isSuccessGet) {
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                {
                    $set: {
                        status: 'success',
                        payment_status: 'completed',
                        phonepe_response: statusResponse,
                        updatedAt: new Date()
                    }
                }
            );

            // Fetch order for subsequent actions
            const order = await db.collection('orders').findOne({ client_txn_id: merchantOrderId });

            // Clear cart if successful
            if (order && order.customer_email) {
                db.collection('carts').deleteOne({ email: order.customer_email.toLowerCase() })
                    .catch(err => console.error('Failed to clear cart after PhonePe GET callback:', err));
            }

            // Send email
            if (order) {
                const { sendOrderConfirmationEmail } = await import('@/lib/email-service');
                sendOrderConfirmationEmail({
                    customerName: order.customer_name,
                    customerEmail: order.customer_email,
                    orderId: order.order_id,
                    items: order.p_info,
                    address: order.address,
                    paymentMethod: 'phonepe'
                }).catch(err => console.error('Email error:', err));
            }

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=success&orderId=${merchantOrderId}`
            );
        } else if (isPendingGet) {
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                { $set: { status: 'pending', payment_status: paymentStateGet, updatedAt: new Date() } }
            );

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=pending&orderId=${merchantOrderId}`
            );
        } else {
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                { $set: { status: 'failed', payment_status: paymentStateGet || 'failed', updatedAt: new Date() } }
            );

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&orderId=${merchantOrderId}`
            );
        }
    } catch (error: any) {
        console.error('PhonePe GET callback error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=error&orderId=${merchantOrderId}`
        );
    }
}
