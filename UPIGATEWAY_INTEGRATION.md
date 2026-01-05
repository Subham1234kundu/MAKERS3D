# UPIGateway Payment Integration - Implementation Guide

## Overview
This document explains the UPIGateway - Merchant Connect integration implemented in the MAKERS3D e-commerce platform. The integration uses the official UPIGateway SDK to display payment QR codes in a modal format.

## What Changed

### 1. API Endpoint Update
**File**: `app/api/payment/create-order/route.ts`

- **Changed**: API endpoint from v1 to v2
- **Old**: `https://api.ekqr.in/api/create_order`
- **New**: `https://api.ekqr.in/api/v2/create_order`
- **Reason**: The v2 API returns a `session_id` which is required for the official SDK integration

### 2. New Payment Modal Component
**File**: `app/components/UPIPaymentModal.tsx`

Created a dedicated modal component that:
- Loads the UPIGateway SDK dynamically using Next.js Script component
- Initializes the EKQR SDK with the session ID
- Handles payment callbacks (success, error, cancelled)
- Displays a premium, MAKERS3D-branded modal interface
- Shows loading states while SDK initializes
- Provides payment instructions to users

### 3. Updated Checkout Page
**File**: `app/checkout/page.tsx`

Changes made:
- Imported the new `UPIPaymentModal` component
- Removed custom QR code generation logic
- Removed manual timer and polling logic (SDK handles this)
- Simplified state management
- Integrated SDK-based modal with proper callbacks

## How It Works

### Payment Flow

1. **User fills checkout form** → Validates shipping and contact information
2. **Clicks "Pay via UPI"** → Calls `/api/payment/create-order`
3. **API creates order** → Returns `session_id`, `order_id`, and payment data
4. **Modal opens** → Loads UPIGateway SDK script
5. **SDK initializes** → Uses `session_id` to fetch payment details
6. **SDK displays QR** → Shows official UPIGateway payment interface
7. **User scans & pays** → SDK automatically detects payment
8. **Callback triggered** → `onSuccess` callback fires
9. **Redirect to confirmation** → User sees order confirmation page

### Key Components

#### UPIPaymentModal Props
```typescript
interface UPIPaymentModalProps {
    isOpen: boolean;           // Controls modal visibility
    onClose: () => void;       // Called when modal closes
    sessionId: string;         // From create_order API response
    orderId: string;           // For display purposes
    amount: number;            // Total payment amount
    onSuccess: (response) => void;    // Payment successful
    onError: (response) => void;      // Payment failed
    onCancelled: (response) => void;  // User cancelled
}
```

#### SDK Initialization
```javascript
const paymentSDK = new window.EKQR({
    sessionId: sessionId,
    callbacks: {
        onSuccess: (response) => { /* Handle success */ },
        onError: (response) => { /* Handle error */ },
        onCancelled: (response) => { /* Handle cancellation */ }
    }
});

paymentSDK.pay(); // Triggers payment interface
```

## Environment Variables Required

Ensure you have the following in your `.env.local`:

```env
UPIGATEWAY_KEY=your-api-key-here
```

## Testing the Integration

### Local Testing
1. Start the development server: `npm run dev`
2. Navigate to checkout page with items in cart
3. Fill in shipping information
4. Select "Instant UPI" payment method
5. Click "PAY VIA UPI" button
6. Modal should open with SDK-loaded QR code

### What to Check
- ✅ Modal opens smoothly
- ✅ SDK script loads (check browser console)
- ✅ QR code displays from UPIGateway
- ✅ Session ID is logged in console
- ✅ Payment callbacks work correctly
- ✅ Modal closes on cancel
- ✅ Success redirects to confirmation page

### Console Logs to Monitor
```javascript
// These logs help debug the integration:
"EKQR SDK loaded successfully"
"Initializing EKQR SDK with session: [session_id]"
"Payment Data Received: [data object]"
"Session ID: [session_id]"
"Payment URL: [payment_url]"
```

## Troubleshooting

### QR Code Not Showing

**Problem**: Modal opens but QR code doesn't appear

**Solutions**:
1. Check browser console for SDK loading errors
2. Verify `session_id` is present in API response
3. Ensure API endpoint is using v2: `/api/v2/create_order`
4. Check UPIGATEWAY_KEY is set correctly
5. Verify merchant account is connected on UPIGateway dashboard

### SDK Not Loading

**Problem**: "EKQR is not defined" error

**Solutions**:
1. Check network tab - ensure `ekqr_sdk.js` loads successfully
2. Verify CDN URL: `https://cdn.ekqr.in/ekqr_sdk.js`
3. Check for CORS issues
4. Try clearing browser cache

### Payment Callbacks Not Firing

**Problem**: Payment completes but no redirect happens

**Solutions**:
1. Check webhook is configured in UPIGateway dashboard
2. Verify callback functions are properly defined
3. Check browser console for JavaScript errors
4. Ensure `onSuccess` callback is implemented correctly

### API Returns Error

**Problem**: "Your Plan Already Expired" or similar errors

**Solutions**:
1. Check UPIGateway account status
2. Verify API key is valid and active
3. Ensure merchant account is connected
4. Check API request payload matches documentation

## Production Deployment

### Before Going Live

1. **Verify Environment Variables**
   - Production `UPIGATEWAY_KEY` is set
   - All other required env vars are configured

2. **Test Payment Flow**
   - Complete a real test transaction
   - Verify webhooks are working
   - Check order confirmation emails

3. **Security Checklist**
   - ✅ API keys are in environment variables (not hardcoded)
   - ✅ HTTPS is enabled
   - ✅ Webhook endpoints are secured
   - ✅ Payment data is encrypted in transit

4. **UPIGateway Dashboard**
   - Merchant account is connected
   - Webhook URL is configured
   - Callback URL is set correctly
   - Plan is active and not expired

## API Response Structure

### Successful Create Order Response
```json
{
  "status": true,
  "msg": "Order Created",
  "data": {
    "order_id": 500041,
    "payment_url": "https://merchant.upigateway.com/gateway/pay/...",
    "session_id": "2723523b3a9cee672c35ee0799342006",
    "upi_intent": {
      "bhim_link": "upi://pay?pa=...",
      "phonepe_link": "phonepe://pay?pa=...",
      "paytm_link": "paytmmp://pay?pa=...",
      "gpay_link": "tez://upi/pay?pa=..."
    },
    "is_utr_required": false
  }
}
```

## Design Features

The modal includes:
- **Premium Aesthetic**: Matches MAKERS3D black theme
- **Glassmorphism**: Backdrop blur effects
- **Smooth Animations**: Entrance and exit animations
- **Responsive Design**: Works on mobile and desktop
- **Loading States**: Shows spinner while SDK loads
- **Payment Instructions**: Clear 3-step guide for users
- **Security Badge**: 256-bit encryption indicator
- **Professional Branding**: MAKERS3D logo and styling

## Support & Resources

- **UPIGateway Documentation**: https://upigateway.com/docs
- **API Reference**: https://api.ekqr.in/docs
- **Support**: Contact UPIGateway support team
- **Dashboard**: https://merchant.upigateway.com

## Notes

- The SDK handles payment verification automatically
- No need for manual polling - SDK callbacks handle status
- QR code is generated server-side by UPIGateway
- Session expires after 5 minutes (handled by SDK)
- Multiple payment apps supported (GPay, PhonePe, Paytm, etc.)

## Future Enhancements

Potential improvements:
- Add payment retry mechanism
- Implement payment timeout handling
- Add analytics tracking for payment events
- Support for direct UPI intent links
- Add payment method preferences
- Implement saved payment methods
