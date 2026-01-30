import crypto from 'crypto';

interface PhonePeConfig {
    clientId: string;
    clientSecret: string;
    clientVersion: string;
    merchantId: string;
    env: 'sandbox' | 'production';
}

interface CreatePaymentParams {
    amount: number;
    merchantOrderId: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    redirectUrl: string;
    callbackUrl: string;
}

class PhonePeSDK {
    private config: PhonePeConfig;
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    constructor(config: PhonePeConfig) {
        this.config = config;
    }

    private getBaseUrl(): string {
        return this.config.env === 'sandbox'
            ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
            : 'https://api.phonepe.com/apis/pg';
    }

    private getAuthUrl(): string {
        // Production uses separate identity-manager endpoint
        // Sandbox uses pg-sandbox for everything
        return this.config.env === 'sandbox'
            ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
            : 'https://api.phonepe.com/apis/identity-manager';
    }

    /**
     * Get OAuth access token (Production only - sandbox may not require this)
     */
    private async getAccessToken(): Promise<string> {
        // Return cached token if still valid
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        const authUrl = `${this.getAuthUrl()}/v1/oauth/token`;

        console.log('PhonePe Auth URL:', authUrl);

        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'client_id': this.config.clientId,
                'client_version': this.config.clientVersion,
                'client_secret': this.config.clientSecret,
                'grant_type': 'client_credentials',
            }).toString(),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('PhonePe Auth Error Response:', error);
            throw new Error(`PhonePe Auth failed: ${error}`);
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error('No access token received from PhonePe');
        }

        // Cache token (expires in 1 hour, we'll refresh 5 mins early)
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (55 * 60 * 1000); // 55 minutes

        return data.access_token;
    }

    /**
     * Generate X-VERIFY header for API requests
     */
    private generateChecksum(base64Payload: string, endpoint: string): string {
        const stringToHash = base64Payload + endpoint + this.config.clientSecret;
        const hash = crypto
            .createHash('sha256')
            .update(stringToHash)
            .digest('hex');
        return `${hash}###1`;
    }

    /**
     * Create a payment order
     */
    async createPayment(params: CreatePaymentParams) {
        const token = await this.getAccessToken();

        // PhonePe Standard Checkout v2 payload format
        const payload = {
            merchantOrderId: params.merchantOrderId,
            amount: Math.round(params.amount * 100), // Convert to paise
            expireAfter: 1200, // 20 minutes in seconds
            metaInfo: {
                udf1: params.customerName,
                udf2: params.customerEmail,
                udf3: params.customerMobile,
            },
            paymentFlow: {
                type: 'PG_CHECKOUT',
                message: `Payment for Order ${params.merchantOrderId}`,
                merchantUrls: {
                    redirectUrl: params.redirectUrl,
                },
            },
        };

        const endpoint = '/checkout/v2/pay';

        console.log('PhonePe Create Payment URL:', `${this.getBaseUrl()}${endpoint}`);
        console.log('PhonePe Payload:', JSON.stringify(payload, null, 2));

        const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `O-Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        console.log('PhonePe Raw Response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error(`PhonePe returned invalid JSON: ${responseText}`);
        }

        console.log('PhonePe Create Payment Response:', JSON.stringify(data, null, 2));

        // Check for error in response
        if (data.code && data.code !== 'SUCCESS') {
            throw new Error(data.message || data.code || 'Payment creation failed');
        }

        return data;
    }

    /**
     * Check payment status
     */
    async checkStatus(merchantOrderId: string) {
        const token = await this.getAccessToken();

        const endpoint = `/checkout/v2/order/${merchantOrderId}/status`;
        const xVerify = crypto
            .createHash('sha256')
            .update(endpoint + this.config.clientSecret)
            .digest('hex') + '###1';

        const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `O-Bearer ${token}`,
                'X-VERIFY': xVerify,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Status check failed');
        }

        return data;
    }

    /**
     * Initiate refund
     */
    async refund(params: {
        merchantOrderId: string;
        merchantRefundId: string;
        amount: number;
    }) {
        const token = await this.getAccessToken();

        const payload = {
            merchantId: this.config.merchantId,
            merchantOrderId: params.merchantOrderId,
            merchantRefundId: params.merchantRefundId,
            amount: Math.round(params.amount * 100),
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const endpoint = '/payments/v2/refund';
        const xVerify = this.generateChecksum(base64Payload, endpoint);

        const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `O-Bearer ${token}`,
                'X-VERIFY': xVerify,
            },
            body: JSON.stringify({
                request: base64Payload,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Refund failed');
        }

        return data;
    }

    /**
     * Check refund status
     */
    async checkRefundStatus(merchantRefundId: string) {
        const token = await this.getAccessToken();

        const endpoint = `/payments/v2/refund/${merchantRefundId}/status`;
        const xVerify = crypto
            .createHash('sha256')
            .update(endpoint + this.config.clientSecret)
            .digest('hex') + '###1';

        const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `O-Bearer ${token}`,
                'X-VERIFY': xVerify,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Refund status check failed');
        }

        return data;
    }
}

// Export singleton instance
export const phonePe = new PhonePeSDK({
    clientId: process.env.PHONEPE_CLIENT_ID || '',
    clientSecret: process.env.PHONEPE_CLIENT_SECRET || '',
    clientVersion: process.env.PHONEPE_CLIENT_VERSION || '1',
    merchantId: process.env.PHONEPE_MERCHANT_ID || '',
    env: (process.env.PHONEPE_ENV as 'sandbox' | 'production') || 'sandbox',
});

export default PhonePeSDK;
