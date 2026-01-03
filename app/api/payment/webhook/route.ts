import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

/**
 * UPIGateway Webhook Handler
 * This endpoint receives real-time payment updates from UPIGateway.
 * Content-Type: application/x-www-form-urlencoded
 */
export async function POST(req: NextRequest) {
    try {
        // UPIGateway sends data as application/x-www-form-urlencoded
        const contentType = req.headers.get('content-type');
        let data: any = {};

        if (contentType?.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            data = Object.fromEntries(formData.entries());
        } else {
            // Fallback for JSON just in case
            data = await req.json();
        }

        const {
            client_txn_id,
            status,
            upi_txn_id,
            amount,
            remark,
            customer_name,
            customer_email
        } = data;

        console.log(`[Webhook] Received update for ${client_txn_id}: ${status}`);

        if (!client_txn_id) {
            return new Response('Missing client_txn_id', { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        // Update the order status in the database
        const result = await db.collection('orders').updateOne(
            { client_txn_id: client_txn_id },
            {
                $set: {
                    status: status, // 'success' or 'failure'
                    upi_txn_id: upi_txn_id,
                    bank_remark: remark,
                    webhook_received_at: new Date(),
                    payment_details: data,
                    updatedAt: new Date()
                }
            }
        );

        // If no matching order, log it in a separate collection for investigation
        if (result.matchedCount === 0) {
            console.warn(`[Webhook] No order found for client_txn_id: ${client_txn_id}`);
            await db.collection('payment_logs').insertOne({
                ...data,
                type: 'webhook_orphan',
                receivedAt: new Date()
            });
        }

        // Return a 200 OK to UPIGateway to acknowledge receipt
        return new Response('OK', { status: 200 });

    } catch (error: any) {
        console.error('[Webhook Error]:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

// Ensure the route handles POST correctly
export async function GET() {
    return new Response('Webhook endpoint is active. Use POST.', { status: 200 });
}
