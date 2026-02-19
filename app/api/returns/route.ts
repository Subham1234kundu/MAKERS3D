import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { getEmailTemplate } from '@/lib/email-templates';

const RETURN_WINDOW_DAYS = 4;

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { orderId, reason, images } = body;

        if (!orderId || !images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ message: 'Order ID and at least one image are required' }, { status: 400 });
        }

        if (images.length > 3) {
            return NextResponse.json({ message: 'Maximum 3 images allowed' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        // Verify order exists, belongs to user, is delivered
        const order = await db.collection('orders').findOne({
            client_txn_id: orderId,
            customer_email: session.user.email,
            status: 'delivered'
        });

        if (!order) {
            return NextResponse.json({ message: 'Order not found or not eligible for return' }, { status: 404 });
        }

        // Check 4-day window
        const deliveredAt = order.deliveredAt || order.updatedAt || order.createdAt;
        const deliveredDate = new Date(deliveredAt);
        const now = new Date();
        const daysSinceDelivery = Math.floor((now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceDelivery > RETURN_WINDOW_DAYS) {
            return NextResponse.json({ message: `Return window has expired. Returns are only accepted within ${RETURN_WINDOW_DAYS} days of delivery.` }, { status: 400 });
        }

        // Check if return already requested
        const existingReturn = await db.collection('return_requests').findOne({
            orderId,
            customer_email: session.user.email
        });

        if (existingReturn) {
            return NextResponse.json({ message: 'Return request already submitted for this order' }, { status: 400 });
        }

        const returnRequest = {
            orderId,
            customer_email: session.user.email,
            customer_name: order.customer_name || session.user?.name || 'Customer',
            customer_mobile: order.customer_mobile || '',
            reason: reason || '',
            images,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('return_requests').insertOne(returnRequest);
        const returnId = result.insertedId.toString();

        // Send email to support@makers3d.in
        const supportContent = `
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="display: inline-block; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); 
                            padding: 12px 25px; margin-bottom: 25px;">
                    <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #eab308; margin: 0;">
                        🔄 New Return Request
                    </p>
                </div>
                <h1 style="font-size: 32px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
                    Return Request #${returnId.slice(-8)}
                </h1>
            </div>

            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
                <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 20px;">Request Details</h3>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); margin-bottom: 10px;"><strong>Order ID:</strong> ${orderId}</p>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); margin-bottom: 10px;"><strong>Customer:</strong> ${returnRequest.customer_name}</p>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); margin-bottom: 10px;"><strong>Email:</strong> ${returnRequest.customer_email}</p>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); margin-bottom: 10px;"><strong>Phone:</strong> ${returnRequest.customer_mobile || 'N/A'}</p>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); margin-bottom: 10px;"><strong>Reason:</strong> ${returnRequest.reason || 'Not provided'}</p>
            </div>

            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
                <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 20px;">Product Images</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                    ${images.map((url: string) => `<a href="${url}" target="_blank" style="display: block;"><img src="${url}" alt="Return proof" style="max-width: 200px; max-height: 200px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" /></a>`).join('')}
                </div>
            </div>

            <p style="font-size: 12px; color: rgba(255, 255, 255, 0.5); text-align: center;">
                Review and approve this return in the <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://makers3d.in'}/dashboard" style="color: rgba(255, 255, 255, 0.7);">Admin Dashboard</a> → Returns section.
            </p>
        `;

        const html = getEmailTemplate(supportContent);
        sendEmail({
            to: 'support@makers3d.in',
            subject: `[MAKERS3D] New Return Request #${returnId.slice(-8)} - Order ${orderId}`,
            html
        }).catch(err => console.error('Return notification email error:', err));

        return NextResponse.json({
            success: true,
            message: 'Return request submitted successfully',
            returnId
        });
    } catch (error: any) {
        console.error('Return request error:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
