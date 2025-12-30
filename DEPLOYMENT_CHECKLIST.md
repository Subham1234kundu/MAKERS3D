# Vercel Deployment Checklist

## ✅ Step-by-Step Guide to Fix "Data Not Showing"

### 1. Configure Environment Variables in Vercel

Go to: https://vercel.com/[your-username]/[your-project]/settings/environment-variables

Add these 3 variables:

```
MONGODB_URI = mongodb+srv://subhamkundu:Ironman2000@lms.4a4h7.mongodb.net/makers3d_db?retryWrites=true&w=majority

NEXTAUTH_URL = https://your-actual-domain.vercel.app
(Replace with your actual Vercel URL)

NEXTAUTH_SECRET = pX9mK2vN8qL5wR7tY4uH6jG3fD1sA0zX9cV8bN7mQ5wE2rT4yU6iO8pA1sD3fG5h
```

**Important:**
- Select all three environments: Production, Preview, Development
- Click "Save" after adding each variable

### 2. Configure MongoDB Atlas Network Access

1. Go to https://cloud.mongodb.com/
2. Select your project
3. Click "Network Access" (left sidebar)
4. Click "Add IP Address"
5. Choose "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"

⚠️ **Why?** Vercel uses dynamic IPs, so we need to allow all IPs or add Vercel's IP ranges.

### 3. Verify Database Has Data

1. In MongoDB Atlas, click "Browse Collections"
2. Select database: `makers3d_db`
3. Check collection: `products`
4. Verify you have products in the collection

If empty, add sample products through your admin dashboard after deployment.

### 4. Commit & Push Changes

```bash
git add .
git commit -m "Fix: Add environment variable handling and deployment setup"
git push
```

Vercel will automatically redeploy.

### 5. Test Your Deployment

Once deployed, visit these URLs (replace with your domain):

#### A. Test Database Connection
```
https://your-app.vercel.app/api/test-connection
```
**Expected:** Should show `✅ MongoDB Atlas Connected Successfully!`

#### B. Test Products API
```
https://your-app.vercel.app/api/products
```
**Expected:** Should return array of products

#### C. Test Homepage
```
https://your-app.vercel.app
```
**Expected:** Should show products on the page

## 🔍 Troubleshooting

### Issue: "MongoDB Connection Failed"
**Solution:** Check Network Access in MongoDB Atlas

### Issue: "MONGODB_URI not configured"
**Solution:** Add environment variables in Vercel and redeploy

### Issue: Connected but no products showing
**Solution:**
1. Visit `/api/test-connection` - check `documentCounts.products`
2. If 0, you need to add products via admin dashboard
3. Check browser console for frontend errors

### Issue: Products showing locally but not on Vercel
**Solution:**
1. Verify all 3 environment variables are set in Vercel
2. Check Vercel function logs for errors
3. Ensure MongoDB allows connections from 0.0.0.0/0

## 📝 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Vercel Docs:** https://vercel.com/docs/environment-variables

## 🔒 Security Notes

**After successful deployment:**
1. Change your MongoDB password (currently exposed in this guide)
2. Update MONGODB_URI in Vercel with new password
3. Consider using MongoDB's IP whitelist with Vercel's IP ranges instead of 0.0.0.0/0
4. Rotate NEXTAUTH_SECRET for production

Generate new secret:
```bash
openssl rand -base64 32
```
