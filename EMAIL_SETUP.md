# MAKERS3D Email Notification System

## Overview
Production-ready email notification system using **Nodemailer** with Gmail SMTP. All emails are professionally designed to match the MAKERS3D aesthetic with black backgrounds, minimalist design, and premium typography.

## Email Types

### 1. **Welcome Email**
- Sent when a new user signs up
- Includes introduction to MAKERS3D
- Call-to-action to start exploring

### 2. **Order Confirmation Email**
- Sent when an order is placed (both UPI and COD)
- Includes order details, items, shipping address, and total amount
- Payment method information

### 3. **Order Shipped Email**
- Sent when admin marks order as "Shipped"
- Includes tracking number (if available)
- Estimated delivery timeline

### 4. **Order Delivered Email**
- Sent when admin marks order as "Delivered"
- Thank you message
- Feedback request

### 5. **Return Confirmed Email**
- Sent when a return request is approved
- Includes return ID and next steps
- Refund timeline information

### 6. **Login Notification Email**
- Sent when user logs in (optional feature)
- Security alert with login details
- Device and IP information

## Setup Instructions

### Step 1: Enable Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select app: **Mail**
5. Select device: **Other (Custom name)** → Enter "MAKERS3D"
6. Click **Generate**
7. Copy the 16-character password

### Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password

# Base URL for email links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For Production:**
```env
EMAIL_USER=makers3d@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
NEXT_PUBLIC_BASE_URL=https://makers3d.com
```

### Step 3: Test Email System

Create a test route to verify emails are working:

```typescript
// app/api/test-email/route.ts
import { sendWelcomeEmail } from '@/lib/email-service';
import { NextResponse } from 'next/server';

export async function GET() {
    const result = await sendWelcomeEmail({
        customerName: 'Test User',
        customerEmail: 'your-test-email@gmail.com',
    });
    
    return NextResponse.json(result);
}
```

Visit: `http://localhost:3000/api/test-email`

## Email Triggers

### Automatic Triggers

| Event | Email Type | Trigger Location |
|-------|-----------|------------------|
| User Sign Up | Welcome Email | `app/api/auth/signup/route.ts` |
| Order Placed (COD) | Order Confirmation | `app/api/payment/create-order/route.ts` |
| Order Placed (UPI) | Order Confirmation | `app/api/payment/check-status/route.ts` |
| Order Status → Shipped | Shipped Email | `app/api/admin/orders/route.ts` |
| Order Status → Delivered | Delivered Email | `app/api/admin/orders/route.ts` |

### Manual Triggers

You can manually send emails from anywhere in your code:

```typescript
import { 
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendOrderShippedEmail,
    sendOrderDeliveredEmail,
    sendReturnConfirmedEmail,
    sendLoginNotificationEmail
} from '@/lib/email-service';

// Example: Send order shipped email
await sendOrderShippedEmail({
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    orderId: 'ORD123456',
    trackingNumber: 'TRACK789' // optional
});
```

## Email Design Features

✅ **MAKERS3D Branding**
- Black background (#000000)
- White text with opacity variations
- Logo integration from GitHub
- Minimalist, premium aesthetic

✅ **Responsive Design**
- Mobile-friendly layout
- Max-width: 600px
- Proper spacing and typography

✅ **Professional Elements**
- Gradient backgrounds
- Border accents
- Uppercase tracking
- Monospace fonts for codes/IDs

✅ **Call-to-Actions**
- White buttons with black text
- Hover states
- Clear action labels

## Customization

### Update Logo URL

Edit `lib/email-templates.ts`:

```typescript
<img src="YOUR_LOGO_URL" alt="MAKERS3D" class="logo" />
```

### Change Colors

Modify the inline styles in `lib/email-templates.ts`:

```typescript
// Primary background
background-color: #000000;

// Accent colors
color: rgba(255, 255, 255, 0.7);

// Success green
color: #22c55e;

// Warning yellow
color: #fbbf24;
```

### Add New Email Template

1. Create template function in `lib/email-templates.ts`:
```typescript
export const getYourNewEmailContent = (params) => `
    <div>Your HTML content here</div>
`;
```

2. Create service function in `lib/email-service.ts`:
```typescript
export async function sendYourNewEmail(params) {
    const content = getYourNewEmailContent(params);
    const html = getEmailTemplate(content);
    return await sendEmail({
        to: params.email,
        subject: 'Your Subject',
        html,
    });
}
```

## Troubleshooting

### Emails Not Sending

1. **Check Gmail App Password**
   - Make sure you're using the 16-character app password, not your regular Gmail password
   - Verify 2-Step Verification is enabled

2. **Check Environment Variables**
   ```bash
   # Verify variables are loaded
   console.log(process.env.EMAIL_USER);
   console.log(process.env.EMAIL_PASSWORD ? 'Password set' : 'Password missing');
   ```

3. **Check Console Logs**
   - Look for "Email server is ready to send messages"
   - Check for any error messages

4. **Gmail Security**
   - Check if Gmail blocked the login attempt
   - Visit: https://myaccount.google.com/notifications

### Emails Going to Spam

1. Add SPF record to your domain
2. Set up DKIM authentication
3. Use a custom domain email instead of Gmail
4. Avoid spam trigger words in subject/content

## Production Recommendations

### Use a Professional Email Service

For production, consider using:

1. **SendGrid** (99% deliverability)
2. **AWS SES** (Cost-effective)
3. **Mailgun** (Developer-friendly)
4. **Postmark** (Transactional emails)

### Switch to SendGrid Example

```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail({ to, subject, html }) {
    const msg = {
        to,
        from: 'noreply@makers3d.com',
        subject,
        html,
    };
    
    return await sgMail.send(msg);
}
```

## Email Analytics

Track email performance:

```typescript
// Add to email service functions
const result = await sendEmail({...});

// Log to database
await db.collection('email_logs').insertOne({
    to: params.customerEmail,
    type: 'order_confirmation',
    messageId: result.messageId,
    sentAt: new Date(),
    status: result.success ? 'sent' : 'failed'
});
```

## Security Best Practices

✅ Never commit `.env.local` to git
✅ Use app passwords, not account passwords
✅ Implement rate limiting for email sending
✅ Validate email addresses before sending
✅ Use non-blocking async email sending
✅ Log email failures for monitoring

## Support

For issues or questions:
- Email: support@makers3d.com
- Check server logs for detailed error messages
- Verify all environment variables are set correctly

---

**Built with ❤️ for MAKERS3D**
