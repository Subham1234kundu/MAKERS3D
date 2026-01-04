# Quick Start: MAKERS3D Email System

## 🚀 Setup in 3 Steps

### 1. Get Gmail App Password
```
1. Visit: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail" → "Other (MAKERS3D)"
5. Copy the 16-character password
```

### 2. Add to .env.local
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Test It!
```bash
# Restart your dev server
npm run dev

# Sign up a new user and check your email!
```

## 📧 Email Types & When They're Sent

| Email | Trigger | File |
|-------|---------|------|
| 🎉 **Welcome** | User signs up | `api/auth/signup/route.ts` |
| ✅ **Order Confirmation** | Order placed | `api/payment/create-order/route.ts` |
| 📦 **Shipped** | Admin marks as shipped | `api/admin/orders/route.ts` |
| 🎁 **Delivered** | Admin marks as delivered | `api/admin/orders/route.ts` |
| ↩️ **Return Confirmed** | Return approved | Manual trigger |
| 🔐 **Login Alert** | User logs in | Manual trigger (optional) |

## 🎨 Email Features

✅ Black background matching your website
✅ MAKERS3D logo from GitHub
✅ Premium minimalist design
✅ Mobile responsive
✅ Professional typography
✅ Branded colors and gradients

## 🔧 Manual Email Sending

```typescript
import { sendOrderShippedEmail } from '@/lib/email-service';

// Send anywhere in your code
await sendOrderShippedEmail({
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    orderId: 'ORD123456',
    trackingNumber: 'TRACK789' // optional
});
```

## 📁 File Structure

```
lib/
├── email.ts              # Nodemailer configuration
├── email-templates.ts    # HTML email templates
└── email-service.ts      # Email sending functions

app/api/
├── auth/signup/route.ts           # Sends welcome email
├── payment/create-order/route.ts  # Sends order confirmation (COD)
├── payment/check-status/route.ts  # Sends order confirmation (UPI)
└── admin/orders/route.ts          # Sends shipped/delivered emails
```

## ⚡ Quick Commands

```bash
# Install dependencies (already done)
npm install nodemailer @types/nodemailer

# Restart dev server
npm run dev

# Test email (create test route first)
curl http://localhost:3000/api/test-email
```

## 🐛 Troubleshooting

**Emails not sending?**
1. Check `.env.local` has EMAIL_USER and EMAIL_PASSWORD
2. Verify you're using App Password, not regular password
3. Check console for "Email server is ready" message
4. Look for error logs in terminal

**Emails in spam?**
- Normal for Gmail → Gmail (testing)
- Use professional email service for production (SendGrid, AWS SES)

## 🎯 Next Steps

1. ✅ Set up Gmail App Password
2. ✅ Add credentials to `.env.local`
3. ✅ Test by signing up a new user
4. ✅ Check your inbox for welcome email
5. ✅ Test order flow to see order confirmation
6. ✅ Update admin dashboard to mark orders as shipped/delivered

## 📚 Full Documentation

See `EMAIL_SETUP.md` for complete documentation including:
- Detailed setup instructions
- Customization guide
- Production recommendations
- Email analytics
- Security best practices

---

**Need Help?** Check the console logs or review EMAIL_SETUP.md
