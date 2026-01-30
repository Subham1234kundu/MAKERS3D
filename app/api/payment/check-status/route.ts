import { NextResponse } from 'next/server';
import { phonePe } from '@/lib/phonepe';
import { getDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const merchantOrderId = searchParams.get('orderId');
        const paymentMethod = searchParams.get('method');

        if (!merchantOrderId) {
            return NextResponse.json({
                success: false,
                msg: 'Order ID is required'
            }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        // For PhonePe payments, check with PhonePe API
        if (paymentMethod === 'phonepe') {
            try {
                const statusResponse = await phonePe.checkStatus(merchantOrderId);
                console.log('PhonePe Status Check:', statusResponse);

                // Update local database with latest status
                if (statusResponse.success) {
                    await db.collection('orders').updateOne(
                        { client_txn_id: merchantOrderId },
                        {
                            $set: {
                                status: statusResponse.code === 'PAYMENT_SUCCESS' ? 'success' : 'failed',
                                payment_status: statusResponse.code,
                                phonepe_response: statusResponse,
                                updatedAt: new Date()
                            }
                        }
                    );
                }

                return NextResponse.json({
                    success: statusResponse.success,
                    status: statusResponse.code,
                    data: statusResponse.data
                });
            } catch (error: any) {
                console.error('PhonePe status check error:', error);
                return NextResponse.json({
                    success: false,
                    msg: error.message
                }, { status: 500 });
            }
        }

        // For other payment methods, check database
        const order = await db.collection('orders').findOne({
            $or: [
                { client_txn_id: merchantOrderId },
                { order_id: merchantOrderId }
            ]
        });

        if (!order) {
            return NextResponse.json({
                success: false,
                msg: 'Order not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            status: order.status,
            payment_method: order.payment_method,
            order: {
                order_id: order.order_id,
                amount: order.amount,
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                status: order.status
            }
        });

    } catch (error: any) {
        console.error('Status check error:', error);
        return NextResponse.json({
            success: false,
            msg: 'Internal Server Error'
        }, { status: 500 });
    }
}
