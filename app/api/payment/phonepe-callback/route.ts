import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { phonePe } from '@/lib/phonepe';

// Helper to parse request body (handles both JSON and form data)
async function parseRequestBody(req: NextRequest): Promise<Record<string, string>> {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await req.text();
        const params = new URLSearchParams(text);
        const result: Record<string, string> = {};
        params.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    } else {
        // Try to parse as JSON first, then form data
        const text = await req.text();
        try {
            return JSON.parse(text);
        } catch {
            const params = new URLSearchParams(text);
            const result: Record<string, string> = {};
            params.forEach((value, key) => {
                result[key] = value;
            });
            return result;
        }
    }
}

// Handle redirect from PhonePe (user is redirected here after payment)
export async function POST(req: NextRequest) {
    try {
        const body = await parseRequestBody(req);
        console.log('PhonePe Callback/Redirect received:', body);

        // PhonePe sends these fields after redirect
        const merchantOrderId = body.merchantOrderId || body.transactionId || body.orderId;
        const transactionId = body.transactionId || body.providerReferenceId;
        const state = body.state || body.code;

        console.log('Parsed - merchantOrderId:', merchantOrderId, 'state:', state);

        if (!merchantOrderId) {
            console.error('Missing merchant order ID in callback');
            // Redirect to payment failed page
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&error=missing_order_id`
            );
        }

        const db = await getDatabase('makers3d_db');

        // Verify payment status with PhonePe API
        let statusResponse;
        try {
            statusResponse = await phonePe.checkStatus(merchantOrderId);
            console.log('PhonePe Status API Response:', statusResponse);
        } catch (statusError) {
            console.error('Failed to check status:', statusError);
            // If status check fails, use the state from callback
            statusResponse = { state: state, code: state };
        }

        const paymentState = statusResponse.state || statusResponse.code || state;
        const isSuccess = paymentState === 'COMPLETED' || paymentState === 'PAYMENT_SUCCESS' || paymentState === 'SUCCESS';

        if (isSuccess) {
            // Update order as successful
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                {
                    $set: {
                        status: 'success',
                        payment_status: 'completed',
                        transaction_id: transactionId,
                        phonepe_response: statusResponse,
                        updatedAt: new Date()
                    }
                }
            );

            // Send confirmation email
            const order = await db.collection('orders').findOne({ client_txn_id: merchantOrderId });
            if (order) {
                const { sendOrderConfirmationEmail } = await import('@/lib/email-service');
                sendOrderConfirmationEmail({
                    customerName: order.customer_name,
                    customerEmail: order.customer_email,
                    orderId: order.order_id,
                    amount: order.amount,
                    items: order.p_info,
                    address: order.address,
                    paymentMethod: 'phonepe'
                }).catch(err => console.error('Email error:', err));
            }

            // Redirect to success page
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=success&orderId=${merchantOrderId}`
            );
        } else {
            // Payment failed or pending
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                {
                    $set: {
                        status: paymentState === 'PENDING' ? 'pending' : 'failed',
                        payment_status: paymentState || 'failed',
                        phonepe_response: statusResponse,
                        updatedAt: new Date()
                    }
                }
            );

            // Redirect to failed/pending page
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=${paymentState?.toLowerCase() || 'failed'}&orderId=${merchantOrderId}`
            );
        }

    } catch (error: any) {
        console.error('PhonePe callback error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=error&error=${encodeURIComponent(error.message)}`
        );
    }
}

// Also handle GET requests (some payment gateways redirect with GET)
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const merchantOrderId = url.searchParams.get('merchantOrderId') || url.searchParams.get('orderId');
    const state = url.searchParams.get('state') || url.searchParams.get('code');

    console.log('PhonePe GET Callback - orderId:', merchantOrderId, 'state:', state);

    if (!merchantOrderId) {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&error=missing_order_id`
        );
    }

    const db = await getDatabase('makers3d_db');

    try {
        // Verify with PhonePe API
        const statusResponse = await phonePe.checkStatus(merchantOrderId);
        console.log('PhonePe Status (GET):', statusResponse);

        const paymentState = statusResponse.state || statusResponse.code;
        const isSuccess = paymentState === 'COMPLETED' || paymentState === 'PAYMENT_SUCCESS' || paymentState === 'SUCCESS';

        if (isSuccess) {
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

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=success&orderId=${merchantOrderId}`
            );
        } else {
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                {
                    $set: {
                        status: paymentState === 'PENDING' ? 'pending' : 'failed',
                        payment_status: paymentState || 'failed',
                        phonepe_response: statusResponse,
                        updatedAt: new Date()
                    }
                }
            );

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=${paymentState?.toLowerCase() || 'failed'}&orderId=${merchantOrderId}`
            );
        }
    } catch (error: any) {
        console.error('PhonePe GET callback error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=error&orderId=${merchantOrderId}`
        );
    }
}
