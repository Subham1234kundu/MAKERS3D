import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const db = await getDatabase('makers3d_db');
        const userEmail = session.user.email;

        // Delete user data from all collections
        await Promise.all([
            // Delete user account
            db.collection('users').deleteOne({ email: userEmail }),

            // Delete user's orders
            db.collection('orders').deleteMany({ customer_email: userEmail }),

            // Delete user from customers collection
            db.collection('customers').deleteOne({ email: userEmail.toLowerCase() }),

            // Delete user's addresses (if you have an addresses collection)
            // db.collection('addresses').deleteMany({ userEmail }),

            // Delete user's cart (if you have a cart collection)
            // db.collection('carts').deleteOne({ userEmail }),
        ]);

        return NextResponse.json(
            {
                message: 'Account deleted successfully',
                success: true
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            {
                message: 'Failed to delete account',
                error: error.message
            },
            { status: 500 }
        );
    }
}
