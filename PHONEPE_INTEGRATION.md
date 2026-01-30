# PhonePe Payment Gateway Integration

This document provides details about the PhonePe Payment Gateway integration for MAKERS3D.

## Overview

PhonePe's Standard Checkout API provides a secure payment solution supporting:
- UPI payments
- Credit/Debit Cards
- Net Banking
- PCI DSS compliant by default

## Environment Variables

Add the following to your `.env.local` file:

```env
PHONEPE_CLIENT_ID=SU2601291633032674000017
PHONEPE_CLIENT_SECRET=a6a03e01-68e5-45a1-bd53-299f0e3ee4cd
PHONEPE_CLIENT_VERSION=1
PHONEPE_MERCHANT_ID=SU2601291633032674000017
PHONEPE_ENV=sandbox
```

For production, change `PHONEPE_ENV=production`

## API Endpoints

### Sandbox Environment
- Base URL: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- Auth URL: `https://api-preprod.phonepe.com/apis/identity-manager`

### Production Environment
- Base URL: `https://api.phonepe.com/apis/pg`
- Auth URL: `https://api.phonepe.com/apis/identity-manager`

## Integration Flow

### 1. Create Payment Order
**Endpoint:** `POST /api/payment/create-order`

**Request:**
```json
{
  "amount": "1000",
  "p_info": "Product Name",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_mobile": "9876543210",
  "address": "123 Street, City, State - 400001",
  "payment_method": "phonepe",
  "redirect_url": "https://yoursite.com/order-confirmation"
}
```

**Response:**
```json
{
  "success": true,
  "payment_method": "phonepe",
  "client_txn_id": "TXN1738155000123",
  "redirectUrl": "https://api-preprod.phonepe.com/..."
}
```

### 2. Redirect to PhonePe
After receiving the response, redirect the user to `redirectUrl` for payment.

### 3. Payment Callback
PhonePe will send a callback to: `POST /api/payment/phonepe-callback`

The callback handler:
- Verifies payment status with PhonePe
- Updates order status in database
- Sends confirmation email

### 4. Check Payment Status
**Endpoint:** `GET /api/payment/check-status?orderId=TXN123&method=phonepe`

**Response:**
```json
{
  "success": true,
  "status": "PAYMENT_SUCCESS",
  "data": { ... }
}
```

## Payment Status Codes

| Code | Description |
|------|-------------|
| `PAYMENT_SUCCESS` | Payment completed successfully |
| `PAYMENT_PENDING` | Payment is pending |
| `PAYMENT_FAILED` | Payment failed |
| `PAYMENT_CANCELLED` | Payment cancelled by user |

## Security

### X-VERIFY Header
All API requests include an `X-VERIFY` header for security:
```
SHA256(base64_payload + endpoint + client_secret) + "###1"
```

### OAuth Authentication
The SDK automatically handles OAuth token management:
- Tokens are cached for 55 minutes
- Auto-refreshes before expiry

## Files Created

1. **`lib/phonepe.ts`** - PhonePe SDK with all API methods
2. **`app/api/payment/create-order/route.ts`** - Updated to support PhonePe
3. **`app/api/payment/phonepe-callback/route.ts`** - Callback handler
4. **`app/api/payment/check-status/route.ts`** - Status check API
5. **`app/checkout/page.tsx`** - Updated checkout UI

## Testing

### Sandbox Testing
1. Use the sandbox environment credentials
2. Test with PhonePe's test cards and UPI IDs
3. Verify callback handling
4. Check order status updates

### Test Cards (Sandbox)
PhonePe provides test cards for sandbox testing. Check their documentation for details.

## Production Deployment

Before going live:

1. Update environment variables:
   ```env
   PHONEPE_ENV=production
   ```

2. Ensure your callback URL is publicly accessible:
   ```
   https://yourdomain.com/api/payment/phonepe-callback
   ```

3. Test thoroughly in sandbox first
4. Verify SSL certificate is valid
5. Monitor initial transactions closely

## Refund Support

The SDK includes refund functionality:

```typescript
await phonePe.refund({
  merchantOrderId: 'TXN123',
  merchantRefundId: 'REFUND123',
  amount: 100 // in rupees
});
```

Check refund status:
```typescript
await phonePe.checkRefundStatus('REFUND123');
```

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- Authentication failures
- Payment failures
- Database errors

Errors are logged to console and returned to the client with appropriate status codes.

## Support

For PhonePe API issues:
- Documentation: https://developer.phonepe.com/
- Support: Contact PhonePe merchant support

For integration issues:
- Check console logs
- Verify environment variables
- Ensure callback URL is accessible
- Test in sandbox first

## Migration from UPI Gateway

The integration supports both PhonePe and the legacy UPI Gateway:
- PhonePe is now the default payment method
- UPI Gateway remains available as fallback
- COD continues to work as before

Users can select their preferred payment method during checkout.
