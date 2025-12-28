# Fix Google Sign-In to Show "ResuOne"

## Current Issue
Google sign-in screen shows: "Sign in to: ocmtxnxdglntvznuwuhw.supabase.co"
We want it to show: "Sign in to: ResuOne"

## Solution

### Option 1: Configure OAuth App Name in Google Cloud Console (Recommended)

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Select your project
3. Navigate to: **APIs & Services** → **OAuth consent screen**
4. Under **App information**:
   - **App name**: Change to `ResuOne`
   - **User support email**: Your email
   - **App logo**: (Optional) Upload ResuOne logo
   - **Application home page**: Your domain or `http://localhost:8080`
   - **Application privacy policy link**: (Optional)
   - **Application terms of service link**: (Optional)
5. Click **Save and Continue**
6. Wait 5-10 minutes for changes to propagate

### Option 2: Configure Site Name in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to: **Settings** → **General**
3. Find **Site URL** or **Site Name** field
4. Set **Site Name** to: `ResuOne`
5. Save changes

### Option 3: Use Custom Domain (Advanced)

If you have a custom domain:
1. Point domain to your app
2. Update Google OAuth redirect URI to use custom domain
3. Update Supabase site URL to custom domain
4. Google will show your custom domain name

## Verify Changes

After making changes:
1. Wait 5-10 minutes for propagation
2. Clear browser cache or use Incognito mode
3. Try Google sign-in again
4. Should now show "Sign in to: ResuOne"

## Quick Fix (Immediate)

The fastest way is **Option 1** - update the OAuth consent screen app name in Google Cloud Console. This will immediately change what users see.

## Notes

- Google may cache the old name for a few minutes
- Changes typically take 5-10 minutes to appear
- Using a custom domain gives you full control over branding

