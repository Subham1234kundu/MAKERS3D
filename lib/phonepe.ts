import {
    StandardCheckoutClient,
    StandardCheckoutPayRequest,
    RefundRequest,
    Env,
    MetaInfo,
} from 'phonepe-pg-sdk-node';

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
    private client: StandardCheckoutClient | null = null;
    private env: 'sandbox' | 'production';

    constructor() {
        this.env = (process.env.PHONEPE_ENV as 'sandbox' | 'production') || 'sandbox';
    }

    private getClient(): StandardCheckoutClient {
        if (!this.client) {
            const clientId = process.env.PHONEPE_CLIENT_ID || '';
            const clientSecret = process.env.PHONEPE_CLIENT_SECRET || '';
            const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');

            const environment = this.env === 'production' ? Env.PRODUCTION : Env.SANDBOX;

            this.client = StandardCheckoutClient.getInstance(
                clientId,
                clientSecret,
                clientVersion,
                environment,
                false // shouldPublishEvents
            );

            console.log(`PhonePe SDK initialized in ${this.env} mode`);
        }
        return this.client;
    }

    /**
     * Create a payment order using official SDK
     */
    async createPayment(params: CreatePaymentParams) {
        const client = this.getClient();
        const amountInPaise = Math.round(params.amount * 100);

        // Build MetaInfo using builder pattern
        const metaInfo = MetaInfo.builder()
            .udf1(params.customerName)
            .udf2(params.customerEmail)
            .udf3(params.customerMobile)
            .build();

        // Build request using builder pattern
        const request = StandardCheckoutPayRequest.builder()
            .merchantOrderId(params.merchantOrderId)
            .amount(amountInPaise)
            .redirectUrl(params.redirectUrl)
            .metaInfo(metaInfo)
            .expireAfter(1200) // 20 minutes
            .build();

        console.log('PhonePe Create Payment Request:', JSON.stringify(request, null, 2));

        try {
            const response = await client.pay(request);
            console.log('PhonePe SDK Response:', JSON.stringify(response, null, 2));
            return response;
        } catch (error: any) {
            console.error('PhonePe SDK Error:', error);
            throw error;
        }
    }

    /**
     * Check payment status using official SDK
     */
    async checkStatus(merchantOrderId: string) {
        const client = this.getClient();
        console.log('PhonePe Check Status for:', merchantOrderId);

        try {
            const response = await client.getOrderStatus(merchantOrderId, true);
            console.log('PhonePe Status Response:', JSON.stringify(response, null, 2));
            return response;
        } catch (error: any) {
            console.error('PhonePe Status Check Error:', error);
            throw error;
        }
    }

    /**
     * Validate callback from PhonePe
     */
    validateCallback(username: string, password: string, authorization: string, responseBody: string) {
        const client = this.getClient();
        try {
            return client.validateCallback(username, password, authorization, responseBody);
        } catch (error) {
            console.error('Callback validation error:', error);
            throw error;
        }
    }

    /**
     * Initiate refund using official SDK
     */
    async refund(params: {
        merchantOrderId: string;
        merchantRefundId: string;
        amount: number;
    }) {
        const client = this.getClient();
        const amountInPaise = Math.round(params.amount * 100);

        const refundRequest = RefundRequest.builder()
            .merchantRefundId(params.merchantRefundId)
            .originalMerchantOrderId(params.merchantOrderId)
            .amount(amountInPaise)
            .build();

        try {
            const response = await client.refund(refundRequest);
            console.log('PhonePe Refund Response:', JSON.stringify(response, null, 2));
            return response;
        } catch (error: any) {
            console.error('PhonePe Refund Error:', error);
            throw error;
        }
    }

    /**
     * Check refund status
     */
    async checkRefundStatus(merchantRefundId: string) {
        const client = this.getClient();
        try {
            const response = await client.getRefundStatus(merchantRefundId);
            console.log('PhonePe Refund Status:', JSON.stringify(response, null, 2));
            return response;
        } catch (error: any) {
            console.error('PhonePe Refund Status Error:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const phonePe = new PhonePeSDK();

export default PhonePeSDK;
