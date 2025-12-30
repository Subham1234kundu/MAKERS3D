# Vercel Deployment Setup Guide

## Issue: Data not showing after Vercel deployment

This is typically caused by missing environment variables or MongoDB connection issues.

## Step 1: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

### Required Environment Variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://subhamkundu:Ironman2000@lms.4a4h7.mongodb.net/makers3d_db?retryWrites=true&w=majority` | Your MongoDB connection string |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` | Replace with your actual Vercel URL |
| `NEXTAUTH_SECRET` | `pX9mK2vN8qL5wR7tY4uH6jG3fD1sA0zX9cV8bN7mQ5wE2rT4yU6iO8pA1sD3fG5h` | Keep the same secret |

**Important:** Set these variables for **Production**, **Preview**, and **Development** environments.

## Step 2: Configure MongoDB Atlas Network Access

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Select your cluster (lms)
3. Click **Network Access** in the left sidebar
4. Click **Add IP Address**
5. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add Vercel's IP ranges if you want more security
6. Click **Confirm**

## Step 3: Verify Database Has Data

1. Go to MongoDB Atlas
2. Click **Browse Collections**
3. Check if the `makers3d_db` database has data in the `products` collection
4. If empty, you need to add sample products

## Step 4: Redeploy on Vercel

After adding environment variables:
1. Go to your Vercel project
2. Click **Deployments**
3. Click the **...** menu on the latest deployment
4. Click **Redeploy**

## Step 5: Test the Deployment

Visit these URLs to test (replace with your domain):

- Homepage: `https://your-app.vercel.app`
- Products API: `https://your-app.vercel.app/api/products`
- Test Connection: `https://your-app.vercel.app/api/test-connection`

## Troubleshooting

### If data still doesn't show:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Click on "Functions" tab
   - Look for error messages

2. **Check MongoDB Connection:**
   - Visit: `https://your-app.vercel.app/api/test-connection`
   - Should return success if MongoDB is connected

3. **Check if products exist:**
   - Visit: `https://your-app.vercel.app/api/products`
   - Should return an array of products

4. **Common Issues:**
   - MongoDB IP whitelist blocking Vercel
   - Wrong database name (should be `makers3d_db`)
   - Empty products collection
   - Environment variables not set correctly

## Security Recommendations

1. **Change MongoDB Password:** The current password is exposed in this guide
2. **Rotate NEXTAUTH_SECRET:** Generate a new one for production
3. **Use IP Whitelist:** Instead of 0.0.0.0/0, add specific Vercel IPs

## Quick Commands

Generate a new NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

Test MongoDB connection locally:
```bash
npm run dev
# Visit http://localhost:3000/api/test-connection
```
