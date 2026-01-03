# Cloudinary Setup Guide for MAKERS3D

## Your Cloudinary Credentials
- **Cloud Name**: `dy2btgrbh`
- **API Key**: `256634691954795`
- **API Secret**: `qsvp6e6YYknRXCZ8vaFWEC7Vrmk`

## Step 1: Create Upload Preset (REQUIRED)

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Log in with your account
3. Navigate to **Settings** (gear icon) → **Upload** tab
4. Scroll down to **Upload presets** section
5. Click **Add upload preset** button
6. Configure the preset:
   - **Preset name**: `makers3d_preset` (you can use any name)
   - **Signing Mode**: Select **Unsigned** ⚠️ (This is crucial!)
   - **Folder**: `makers3d-products` (optional, helps organize your images)
   - Leave other settings as default
7. Click **Save**

## Step 2: Add Environment Variables

Add these lines to your `.env.local` file:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dy2btgrbh
NEXT_PUBLIC_CLOUDINARY_API_KEY=256634691954795
NEXT_PUBLIC_CLOUDINARY_API_SECRET=qsvp6e6YYknRXCZ8vaFWEC7Vrmk
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=makers3d_preset
```

⚠️ **Important**: If you chose a different preset name in Step 1, update the `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` value accordingly.

## Step 3: Restart Development Server

After adding the environment variables:
1. Stop the current dev server (Ctrl+C in terminal)
2. Restart it: `npm run dev`

## How It Works

- The upload preset allows **unsigned uploads** from your frontend
- Images are uploaded directly to Cloudinary from the browser
- The secure URL is returned and stored in your database
- No server-side processing needed!

## Troubleshooting

### Upload fails with "Upload preset not found"
- Make sure the preset name in `.env.local` matches exactly what you created in Cloudinary
- Ensure the preset is set to **Unsigned** mode

### Upload fails with "Invalid credentials"
- Double-check your cloud name, API key, and API secret
- Make sure there are no extra spaces in the `.env.local` file

### Images not showing after upload
- Check the browser console for errors
- Verify the secure_url is being returned from Cloudinary
- Ensure your Cloudinary account is active

## Testing

1. Go to your dashboard at `http://localhost:3000/dashboard`
2. Click "Add Product"
3. Click on any of the 4 image upload boxes
4. Select an image file
5. You should see "Uploading..." then the image should appear
6. The image URL will be automatically filled in the URL field below

## Security Note

The `.env.local` file is gitignored, so your credentials won't be committed to version control. Keep these credentials secure!
