import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Check environment variables
        const hasMongoUri = !!process.env.MONGODB_URI;
        const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
        const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;

        return NextResponse.json({
            success: true,
            environment: {
                MONGODB_URI: hasMongoUri ? '✅ Set' : '❌ Missing',
                NEXTAUTH_URL: hasNextAuthUrl ? '✅ Set' : '❌ Missing',
                NEXTAUTH_SECRET: hasNextAuthSecret ? '✅ Set' : '❌ Missing',
                NODE_ENV: process.env.NODE_ENV,
            },
            mongoUriLength: process.env.MONGODB_URI?.length || 0,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            { status: 500 }
        );
    }
}
