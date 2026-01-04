# MAKERS3D Environment Variables Template

Copy this file to `.env.local` and fill in your actual values.

## Database Configuration
```
MONGODB_URI=your_mongodb_connection_string
```

## NextAuth Configuration
```
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## Payment Gateway (UPI)
```
UPIGATEWAY_KEY=your_upigateway_api_key
```

## Email Configuration (Gmail SMTP)

### How to get Gmail App Password:
1. Visit: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "MAKERS3D" and generate
6. Copy the 16-character password

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

## Base URL
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Production Example:
```
EMAIL_USER=noreply@makers3d.com
EMAIL_PASSWORD=your-app-password
NEXT_PUBLIC_BASE_URL=https://makers3d.com
```
