# UPIGateway Error: "Merchant Not Found or Logged Out"

## Error Message
```
merchant is not found or log out
```

## What This Means

This error comes from the UPIGateway API and indicates one of these issues:

1. **Merchant account not connected** to UPIGateway
2. **Invalid API key**
3. **API key from wrong environment** (test vs production)
4. **Merchant session expired** on UPIGateway dashboard
5. **Account suspended or inactive**

## Step-by-Step Troubleshooting

### Step 1: Check Your Terminal/Console Logs

After clicking "Pay via UPI", check your terminal where `npm run dev` is running. You should see:

```
=== UPIGateway Payment Request ===
API Key present: true
API Key length: 36
Client TXN ID: TXN1736067633123
Amount: 1000
Request payload: { key: '***xxxx', ... }
```

**If you see:**
- `API Key present: false` → API key is not set
- `API Key length: undefined` → API key is missing
- `❌ UPIGateway Error: merchant is not found or log out` → Merchant account issue

### Step 2: Verify Your API Key

1. **Check if UPIGATEWAY_KEY is set:**
   ```bash
   # In your .env.local file, you should have:
   UPIGATEWAY_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

2. **Verify the format:**
   - Should be a UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Should be 36 characters long (including dashes)
   - No spaces before or after
   - No quotes needed

3. **Check if it's the correct key:**
   - Login to https://merchant.upigateway.com
   - Go to API Settings or Developer Settings
   - Copy the API Key from there
   - Paste it in your `.env.local` file

### Step 3: Connect Your Merchant Account

This is the **most common issue**. You need to connect a UPI merchant account:

1. **Login to UPIGateway Dashboard:**
   - Go to https://merchant.upigateway.com
   - Login with your credentials

2. **Check Merchant Connect Status:**
   - Look for "Merchant Connect" section
   - Status should show: **"Connected"**
   - If it shows **"Disconnected"**, you need to connect

3. **Connect a Merchant Account:**
   
   You need ONE of these merchant accounts:
   - **PhonePe Business**
   - **HDFC Bank SmartHub Vyapar**
   - **YONO SBI Merchant**
   - **Paytm for Business** (limited features)

4. **How to Connect:**
   - Click "Connect Merchant Account"
   - Select your merchant provider
   - Follow the authentication steps
   - Grant necessary permissions
   - Wait for verification (usually instant)

### Step 4: Verify Your Account Status

1. **Check Plan Status:**
   - Ensure your UPIGateway plan is active
   - Check if trial period has expired
   - Verify payment for subscription (if applicable)

2. **Check Account Status:**
   - Account should be "Active"
   - No suspension or restrictions
   - All KYC/verification completed

### Step 5: Restart Development Server

After making changes to `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

**Important:** Environment variables are loaded when the server starts. Changes to `.env.local` require a server restart.

### Step 6: Test Again

1. Add items to cart
2. Go to checkout
3. Fill shipping information
4. Select "Instant UPI"
5. Click "PAY VIA UPI"
6. Check terminal logs for detailed error info

## Common Scenarios & Solutions

### Scenario 1: Fresh Setup (Never Connected Merchant)

**Problem:** You just created a UPIGateway account and got the API key, but never connected a merchant account.

**Solution:**
1. Go to UPIGateway dashboard
2. Navigate to "Merchant Connect" section
3. Click "Connect Merchant Account"
4. Choose your UPI merchant provider (PhonePe Business, HDFC, SBI, etc.)
5. Complete the connection process
6. Wait for "Connected" status
7. Try payment again

### Scenario 2: API Key from Test Environment

**Problem:** Using test/sandbox API key in production or vice versa.

**Solution:**
1. Check which environment you're in
2. Get the correct API key for that environment
3. Update `.env.local` with correct key
4. Restart server

### Scenario 3: Merchant Session Expired

**Problem:** You were logged out of UPIGateway dashboard or session expired.

**Solution:**
1. Login to UPIGateway dashboard again
2. Verify merchant is still connected
3. If disconnected, reconnect merchant account
4. Try payment again

### Scenario 4: Account Suspended

**Problem:** Account was suspended due to policy violation or payment issues.

**Solution:**
1. Check email for suspension notice
2. Contact UPIGateway support
3. Resolve any outstanding issues
4. Wait for account reactivation

## Debugging Checklist

Use this checklist to systematically debug:

- [ ] `.env.local` file exists in project root
- [ ] `UPIGATEWAY_KEY` is set in `.env.local`
- [ ] API key is 36 characters long (UUID format)
- [ ] No extra spaces or quotes around API key
- [ ] Development server was restarted after adding key
- [ ] Logged into UPIGateway dashboard successfully
- [ ] Merchant Connect status shows "Connected"
- [ ] UPIGateway plan is active (not expired)
- [ ] Account status is "Active"
- [ ] Terminal shows "API Key present: true"
- [ ] Terminal shows correct API key length
- [ ] No other error messages in console

## What to Check in UPIGateway Dashboard

### 1. Dashboard Home
- [ ] Account status: Active
- [ ] Plan status: Active
- [ ] Days remaining (if trial)

### 2. Merchant Connect
- [ ] Status: Connected
- [ ] Merchant provider shown (PhonePe/HDFC/SBI/Paytm)
- [ ] UPI ID displayed
- [ ] Last sync time recent

### 3. API Settings
- [ ] API Key visible
- [ ] Webhook URL configured (optional for now)
- [ ] Callback URL set (optional for now)

### 4. Transactions
- [ ] Can see test transactions (if any)
- [ ] No error messages
- [ ] Dashboard loads properly

## Expected Terminal Output (Success)

When everything is working correctly, you should see:

```
=== UPIGateway Payment Request ===
API Key present: true
API Key length: 36
Client TXN ID: TXN1736067633123
Amount: 1000
Request payload: { 
  key: '***a1b2',
  client_txn_id: 'TXN1736067633123',
  amount: '1000',
  p_info: 'Product Name',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  customer_mobile: '9876543210',
  redirect_url: 'http://localhost:3000/order-confirmation'
}
UPIGateway Response Status: true
UPIGateway Response: {
  status: true,
  msg: 'Order Created',
  data: {
    order_id: 500041,
    payment_url: 'https://merchant.upigateway.com/gateway/pay/...',
    session_id: '2723523b3a9cee672c35ee0799342006',
    upi_intent: { ... },
    is_utr_required: false
  }
}
✅ Payment order created successfully
```

## Expected Terminal Output (Error)

If merchant is not connected:

```
=== UPIGateway Payment Request ===
API Key present: true
API Key length: 36
Client TXN ID: TXN1736067633123
Amount: 1000
Request payload: { ... }
UPIGateway Response Status: false
UPIGateway Response: {
  status: false,
  msg: 'merchant is not found or log out'
}
❌ UPIGateway Error: merchant is not found or log out
Full error response: { status: false, msg: 'merchant is not found or log out' }
```

## Quick Fix (Most Common)

**90% of the time, this is the issue:**

1. **Go to:** https://merchant.upigateway.com
2. **Login** with your credentials
3. **Find:** "Merchant Connect" section
4. **Check:** Status should be "Connected"
5. **If Disconnected:** Click "Connect Merchant Account"
6. **Select:** Your merchant provider (PhonePe Business recommended)
7. **Complete:** Authentication and permissions
8. **Wait:** For "Connected" status
9. **Try:** Payment again

## Still Not Working?

### Check These:

1. **Browser Console (F12):**
   - Any JavaScript errors?
   - Network tab shows API call?
   - Response shows error message?

2. **Server Terminal:**
   - Full error logs visible?
   - API key being sent?
   - Response from UPIGateway?

3. **UPIGateway Dashboard:**
   - Any error notifications?
   - Account in good standing?
   - Merchant still connected?

### Contact Support

If none of the above works:

1. **UPIGateway Support:**
   - Email: support@upigateway.com
   - Dashboard: Support ticket section
   - Provide: Account email, error message, API key (last 4 digits only)

2. **What to Include:**
   - Error message from terminal
   - Screenshot of Merchant Connect status
   - Account email
   - When the error started occurring

## Prevention

To avoid this error in the future:

1. **Keep merchant connected** - Check dashboard regularly
2. **Monitor plan expiry** - Renew before expiration
3. **Maintain active merchant account** - Keep your PhonePe/HDFC/SBI account active
4. **Save API key securely** - Don't lose or expose it
5. **Test regularly** - Catch issues early

## Summary

**The "merchant is not found or log out" error means:**
- Your UPI merchant account is not connected to UPIGateway
- OR your API key is invalid/missing
- OR your UPIGateway account has issues

**The fix is usually:**
1. Login to UPIGateway dashboard
2. Connect your merchant account (PhonePe Business, HDFC, SBI, or Paytm)
3. Ensure status shows "Connected"
4. Try payment again

**Remember:** You MUST have a connected merchant account for UPIGateway to work. The API key alone is not enough!
