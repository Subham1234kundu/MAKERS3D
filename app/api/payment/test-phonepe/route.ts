import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const clientId = process.env.PHONEPE_CLIENT_ID;
        const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
        const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';

        console.log('Testing PhonePe Auth...');
        console.log('Client ID:', clientId);
        console.log('Client Version:', clientVersion);
        console.log('Client Secret present:', !!clientSecret);

        // Test both endpoints
        const env = process.env.PHONEPE_ENV || 'sandbox';
        const authUrl = env === 'production'
            ? 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token'
            : 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token';

        console.log('Auth URL:', authUrl);

        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'client_id': clientId || '',
                'client_version': clientVersion,
                'client_secret': clientSecret || '',
                'grant_type': 'client_credentials',
            }).toString(),
        });

        const responseText = await response.text();
        console.log('Response Status:', response.status);
        console.log('Response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            data = { raw: responseText };
        }

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            authUrl,
            credentials: {
                clientId: clientId?.substring(0, 10) + '...',
                clientVersion,
                secretPresent: !!clientSecret,
            },
            response: data,
        });
    } catch (error: any) {
        console.error('Test Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
