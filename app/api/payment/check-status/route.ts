import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { client_txn_id, txn_date } = body;

        if (!client_txn_id || !txn_date) {
            return NextResponse.json({ success: false, msg: 'Missing parameters' }, { status: 400 });
        }

        const apiKey = process.env.UPIGATEWAY_KEY;

        const response = await fetch('https://api.ekqr.in/api/check_order_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: apiKey,
                client_txn_id,
                txn_date
            })
        });

        const data = await response.json();

        // Update DB if success
        if (data.status && data.data.status === 'success') {
            try {
                const db = await getDatabase('makers3d_db');
                await db.collection('orders').updateOne(
                    { client_txn_id: client_txn_id },
                    {
                        $set: {
                            status: 'success',
                            upi_txn_id: data.data.upi_txn_id,
                            updatedAt: new Date()
                        }
                    }
                );
            } catch (dbError) {
                console.error('Database update error during status check:', dbError);
            }
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Payment check error:', error);
        return NextResponse.json({
            success: false,
            msg: 'Internal Server Error'
        }, { status: 500 });
    }
}
