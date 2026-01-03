import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, p_info, customer_name, customer_email, customer_mobile, redirect_url } = body;

        const apiKey = process.env.UPIGATEWAY_KEY;
        const client_txn_id = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

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

        const response = await fetch('https://api.ekqr.in/api/create_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.status) {
            // Save order to database as pending
            try {
                const db = await getDatabase('makers3d_db');

                // 1. Add/Update Order
                await db.collection('orders').insertOne({
                    client_txn_id,
                    order_id: data.data.order_id,
                    customer_name,
                    customer_email,
                    customer_mobile,
                    amount,
                    p_info,
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                // 2. Add/Update Customer record
                await db.collection('customers').updateOne(
                    { email: customer_email.toLowerCase() },
                    {
                        $set: {
                            name: customer_name,
                            phone: customer_mobile,
                            lastOrderAt: new Date(),
                            updatedAt: new Date()
                        },
                        $setOnInsert: {
                            createdAt: new Date(),
                        },
                        $inc: {
                            orderAttempts: 1
                        }
                    },
                    { upsert: true }
                );
            } catch (dbError) {
                console.error('Database maintenance error:', dbError);
                // We still proceed since payment gateway order was created
            }

            return NextResponse.json({
                success: true,
                data: data.data,
                client_txn_id
            });
        } else {
            return NextResponse.json({
                success: false,
                msg: data.msg
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Payment creation error:', error);
        return NextResponse.json({
            success: false,
            msg: 'Internal Server Error'
        }, { status: 500 });
    }
}
