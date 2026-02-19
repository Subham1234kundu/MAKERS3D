import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { sendReturnConfirmedEmail } from '@/lib/email-service';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const db = await getDatabase('makers3d_db');
        const returns = await db.collection('return_requests')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const formatted = returns.map((r: any) => ({
            id: r._id.toString(),
            orderId: r.orderId,
            customerName: r.customer_name,
            customerEmail: r.customer_email,
            customerMobile: r.customer_mobile,
            reason: r.reason,
            images: r.images || [],
            status: r.status,
            createdAt: r.createdAt,
            reviewedAt: r.reviewedAt,
            reviewedBy: r.reviewedBy
        }));

        return NextResponse.json(formatted);
    } catch (error: any) {
        console.error('Fetch returns error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { returnId, action } = body; // action: 'approve' | 'reject'

        if (!returnId || !action || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ message: 'Invalid returnId or action' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        const returnReq = await db.collection('return_requests').findOne({
            _id: new ObjectId(returnId)
        });

        if (!returnReq) {
            return NextResponse.json({ message: 'Return request not found' }, { status: 404 });
        }

        if (returnReq.status !== 'pending') {
            return NextResponse.json({ message: 'Return request already processed' }, { status: 400 });
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        await db.collection('return_requests').updateOne(
            { _id: new ObjectId(returnId) },
            {
                $set: {
                    status: newStatus,
                    reviewedAt: new Date(),
                    reviewedBy: session.user?.email,
                    updatedAt: new Date()
                }
            }
        );

        if (action === 'approve') {
            sendReturnConfirmedEmail({
                customerName: returnReq.customer_name || 'Customer',
                customerEmail: returnReq.customer_email,
                orderId: returnReq.orderId,
                returnId: returnId,
                reason: returnReq.reason
            }).catch(err => console.error('Return confirmed email error:', err));
        }

        return NextResponse.json({
            success: true,
            message: `Return ${newStatus} successfully`,
            status: newStatus
        });
    } catch (error: any) {
        console.error('Update return error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
