import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { phonePe } from '@/lib/phonepe';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('PhonePe Callback received:', body);

        const { merchantOrderId, transactionId, code } = body;

        if (!merchantOrderId) {
            return NextResponse.json({
                success: false,
                msg: 'Missing merchant order ID'
            }, { status: 400 });
        }

        // Verify payment status with PhonePe
        const statusResponse = await phonePe.checkStatus(merchantOrderId);
        console.log('PhonePe Status Response:', statusResponse);

        const db = await getDatabase('makers3d_db');

        // Update order status based on payment response
        if (statusResponse.success && statusResponse.code === 'PAYMENT_SUCCESS') {
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

            return NextResponse.json({ success: true, status: 'PAYMENT_SUCCESS' });
        } else {
            // Payment failed or pending
            await db.collection('orders').updateOne(
                { client_txn_id: merchantOrderId },
                {
                    $set: {
                        status: 'failed',
                        payment_status: statusResponse.code || 'failed',
                        phonepe_response: statusResponse,
                        updatedAt: new Date()
                    }
                }
            );

            return NextResponse.json({
                success: false,
                status: statusResponse.code || 'PAYMENT_FAILED'
            });
        }

    } catch (error: any) {
        console.error('PhonePe callback error:', error);
        return NextResponse.json({
            success: false,
            msg: 'Callback processing failed'
        }, { status: 500 });
    }
}
